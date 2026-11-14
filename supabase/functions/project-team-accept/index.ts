import { createClient } from "npm:@supabase/supabase-js@2.57.4";
import {
  bearerToken,
  confirmedEmail,
  jsonResponse,
  parseAcceptPayload,
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
  if (authError || !user || !confirmedEmail(user) || !user.email) {
    return fail("verified_account_required", 401, origin);
  }

  let raw: unknown;
  try { raw = await request.json(); } catch { return fail("invalid_json", 400, origin); }
  const payload = parseAcceptPayload(raw);
  if (!payload) return fail("invalid_acceptance_payload", 400, origin);

  const email = user.email.trim().toLowerCase();
  const { data: existing, error: existingError } = await admin
    .from("project_team_memberships")
    .select("id")
    .eq("project_id", payload.projectId)
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle();
  if (existingError) return fail("membership_lookup_failed", 503, origin);
  if (existing) {
    return jsonResponse({ ok: true, status: "already_active" }, 200, origin);
  }

  const { data: pending, error: pendingError } = await admin
    .from("project_team_memberships")
    .select("id,user_id,email")
    .eq("project_id", payload.projectId)
    .eq("email", email)
    .eq("status", "pending")
    .maybeSingle();
  if (pendingError) return fail("invitation_lookup_failed", 503, origin);
  if (!pending) return fail("matching_invitation_not_found", 404, origin);
  if (pending.user_id && pending.user_id !== user.id) return fail("invitation_belongs_to_another_account", 403, origin);

  const { data: activated, error: activationError } = await admin
    .from("project_team_memberships")
    .update({
      user_id: user.id,
      status: "active",
      accepted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      revoked_at: null,
    })
    .eq("id", pending.id)
    .eq("project_id", payload.projectId)
    .eq("status", "pending")
    .select("id")
    .maybeSingle();

  if (activationError || !activated) {
    const { data: retry } = await admin.from("project_team_memberships")
      .select("id").eq("project_id", payload.projectId).eq("user_id", user.id).eq("status", "active").maybeSingle();
    if (retry) return jsonResponse({ ok: true, status: "already_active" }, 200, origin);
    return fail("invitation_activation_failed", 409, origin);
  }

  return jsonResponse({ ok: true, status: "active", membershipId: activated.id }, 200, origin);
});
