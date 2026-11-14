import { createClient } from "npm:@supabase/supabase-js@2.57.4";
import {
  bearerToken,
  confirmedEmail,
  jsonResponse,
  parseRevokePayload,
} from "../_shared/project-team.ts";

const fail = (error: string, status: number, origin: string | null) =>
  jsonResponse({ ok: false, error }, status, origin);

Deno.serve(async (request: Request) => {
  const origin = request.headers.get("origin");
  if (request.method === "OPTIONS") return new Response("ok", { headers: jsonResponse({}, 200, origin).headers });
  if (request.method !== "POST") return fail("method_not_allowed", 405, origin);

  const token = bearerToken(request);
  if (!token) return fail("authentication_required", 401, origin);
  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceKey) return fail("team_service_not_configured", 503, origin);

  const admin = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  const { data: authData, error: authError } = await admin.auth.getUser(token);
  const user = authData.user;
  if (authError || !user || !confirmedEmail(user)) return fail("verified_account_required", 401, origin);

  let raw: unknown;
  try { raw = await request.json(); } catch { return fail("invalid_json", 400, origin); }
  const payload = parseRevokePayload(raw);
  if (!payload) return fail("invalid_revocation_payload", 400, origin);

  const { data: project, error: projectError } = await admin
    .from("user_projects").select("id,user_id").eq("id", payload.projectId).maybeSingle();
  if (projectError) return fail("project_lookup_failed", 503, origin);
  if (!project || project.user_id !== user.id) return fail("project_owner_only", 403, origin);

  const { data: membership, error: membershipError } = await admin
    .from("project_team_memberships")
    .select("id,user_id,status")
    .eq("id", payload.membershipId)
    .eq("project_id", payload.projectId)
    .maybeSingle();
  if (membershipError) return fail("membership_lookup_failed", 503, origin);
  if (!membership) return fail("membership_not_found", 404, origin);
  if (membership.user_id === user.id) return fail("owner_membership_cannot_be_revoked", 400, origin);
  if (membership.status === "revoked") return jsonResponse({ ok: true, status: "already_revoked" }, 200, origin);

  const { error: revokeError } = await admin.from("project_team_memberships")
    .update({
      status: "revoked",
      revoked_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", membership.id)
    .eq("project_id", payload.projectId);
  if (revokeError) return fail("membership_revocation_failed", 503, origin);

  const { error: permissionsError } = await admin.from("project_team_module_permissions")
    .delete().eq("membership_id", membership.id).eq("project_id", payload.projectId);
  if (permissionsError) return fail("membership_revoked_but_permission_cleanup_failed", 503, origin);

  return jsonResponse({ ok: true, status: "revoked" }, 200, origin);
});
