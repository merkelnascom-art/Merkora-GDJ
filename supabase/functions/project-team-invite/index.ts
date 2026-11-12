import { createClient } from "npm:@supabase/supabase-js@2.57.4";
import {
  bearerToken,
  confirmedEmail,
  jsonResponse,
  parseInvitePayload,
} from "../_shared/project-team.ts";

const jsonError = (message: string, status: number, origin: string | null) =>
  jsonResponse({ ok: false, error: message }, status, origin);

Deno.serve(async (request: Request) => {
  const origin = request.headers.get("origin");
  if (request.method === "OPTIONS") return new Response("ok", { headers: jsonResponse({}, 200, origin).headers });
  if (request.method !== "POST") return jsonError("method_not_allowed", 405, origin);

  const token = bearerToken(request);
  if (!token) return jsonError("authentication_required", 401, origin);

  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceKey) return jsonError("team_service_not_configured", 503, origin);

  const admin = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  const { data: authData, error: authError } = await admin.auth.getUser(token);
  const user = authData.user;
  if (authError || !user || !confirmedEmail(user)) return jsonError("verified_account_required", 401, origin);

  let raw: unknown;
  try { raw = await request.json(); } catch { return jsonError("invalid_json", 400, origin); }
  const payload = parseInvitePayload(raw);
  if (!payload) return jsonError("invalid_invitation_payload", 400, origin);
  if (payload.email === user.email?.toLowerCase()) return jsonError("owner_cannot_invite_self", 400, origin);

  const { data: project, error: projectError } = await admin
    .from("user_projects")
    .select("id,user_id,title")
    .eq("id", payload.projectId)
    .maybeSingle();
  if (projectError) return jsonError("project_lookup_failed", 503, origin);
  if (!project || project.user_id !== user.id) return jsonError("project_owner_only", 403, origin);

  const { data: activeMembership, error: activeError } = await admin
    .from("project_team_memberships")
    .select("id")
    .eq("project_id", payload.projectId)
    .eq("email", payload.email)
    .eq("status", "active")
    .maybeSingle();
  if (activeError) return jsonError("membership_lookup_failed", 503, origin);
  if (activeMembership) return jsonError("already_a_project_member", 409, origin);

  const { data: pendingMembership, error: pendingError } = await admin
    .from("project_team_memberships")
    .select("id")
    .eq("project_id", payload.projectId)
    .eq("email", payload.email)
    .eq("status", "pending")
    .maybeSingle();
  if (pendingError) return jsonError("invitation_lookup_failed", 503, origin);

  let membershipId = pendingMembership?.id as string | undefined;
  if (membershipId) {
    const { error } = await admin.from("project_team_memberships")
      .update({ invited_by: user.id, updated_at: new Date().toISOString(), user_id: null })
      .eq("id", membershipId).eq("project_id", payload.projectId).eq("status", "pending");
    if (error) return jsonError("invitation_update_failed", 503, origin);
  } else {
    const { data, error } = await admin.from("project_team_memberships")
      .insert({
        project_id: payload.projectId,
        email: payload.email,
        invited_by: user.id,
        status: "pending",
      })
      .select("id")
      .single();
    if (error || !data) return jsonError("invitation_create_failed", 503, origin);
    membershipId = data.id;
  }

  const { error: clearGrantsError } = await admin.from("project_team_module_permissions")
    .delete().eq("membership_id", membershipId).eq("project_id", payload.projectId);
  if (clearGrantsError) return jsonError("invitation_permissions_reset_failed", 503, origin);

  const grants = payload.grants.map((grant) => ({
    membership_id: membershipId,
    project_id: payload.projectId,
    module_id: grant.moduleId,
    can_view: grant.canView,
    can_edit: grant.canEdit,
  }));
  const { error: grantsError } = await admin.from("project_team_module_permissions").insert(grants);
  if (grantsError) {
    await admin.from("project_team_memberships")
      .update({ status: "revoked", revoked_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq("id", membershipId);
    return jsonError("invitation_permissions_create_failed", 503, origin);
  }

  const configuredRedirect = Deno.env.get("MERKORA_INVITE_REDIRECT_URL")?.trim();
  const inviteOptions = {
    data: { merkora_project_invitation: payload.projectId },
    ...(configuredRedirect ? { redirectTo: configuredRedirect } : {}),
  };
  const { data: inviteData, error: inviteError } = await admin.auth.admin.inviteUserByEmail(
    payload.email,
    inviteOptions,
  );

  if (inviteError) {
    const message = inviteError.message.toLowerCase();
    if (message.includes("already registered") || message.includes("already been registered") || message.includes("already exists")) {
      return jsonResponse({
        ok: true,
        membershipId,
        delivery: "existing_account",
        message: "Invitation enregistrée. Cette personne possède déjà un compte : elle doit se connecter à l'application pour activer son accès.",
      }, 200, origin);
    }
    return jsonError("invitation_email_delivery_failed", 502, origin);
  }

  if (inviteData.user?.id) {
    const { error } = await admin.from("project_team_memberships")
      .update({ user_id: inviteData.user.id, updated_at: new Date().toISOString() })
      .eq("id", membershipId).eq("status", "pending");
    if (error) return jsonError("invitation_user_link_failed", 503, origin);
  }

  return jsonResponse({
    ok: true,
    membershipId,
    delivery: "sent",
    message: "Invitation envoyée. L'accès sera activé lorsque la personne aura confirmé son adresse et se sera connectée à l'application.",
  }, 200, origin);
});
