export type ProjectTeamGrant = {
  moduleId: string;
  canView: boolean;
  canEdit: boolean;
};

export type InvitePayload = {
  projectId: string;
  email: string;
  grants: ProjectTeamGrant[];
};

export function normalizeTeamEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  if (email.length < 3 || email.length > 320 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  return email;
}

export function parseInvitePayload(value: unknown): InvitePayload | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const input = value as Record<string, unknown>;
  if (typeof input.projectId !== "string" || !/^[A-Za-z0-9_-]{3,100}$/.test(input.projectId)) return null;
  const email = normalizeTeamEmail(input.email);
  if (!email || !Array.isArray(input.grants) || input.grants.length < 1 || input.grants.length > 30) return null;
  const seen = new Set<string>();
  const grants: ProjectTeamGrant[] = [];
  for (const raw of input.grants) {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
    const grant = raw as Record<string, unknown>;
    if (typeof grant.moduleId !== "string" ||
      !/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(grant.moduleId) ||
      grant.moduleId.length > 80 ||
      typeof grant.canView !== "boolean" ||
      typeof grant.canEdit !== "boolean" ||
      (grant.canEdit && !grant.canView) ||
      seen.has(grant.moduleId)) return null;
    seen.add(grant.moduleId);
    grants.push({ moduleId: grant.moduleId, canView: grant.canView, canEdit: grant.canEdit });
  }
  return { projectId: input.projectId, email, grants };
}

export function parseAcceptPayload(value: unknown): { projectId: string } | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const projectId = (value as Record<string, unknown>).projectId;
  return typeof projectId === "string" && /^[A-Za-z0-9_-]{3,100}$/.test(projectId)
    ? { projectId }
    : null;
}

export function parseRevokePayload(value: unknown): { projectId: string; membershipId: string } | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const input = value as Record<string, unknown>;
  if (typeof input.projectId !== "string" || !/^[A-Za-z0-9_-]{3,100}$/.test(input.projectId) ||
    typeof input.membershipId !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(input.membershipId)) return null;
  return { projectId: input.projectId, membershipId: input.membershipId };
}

export function confirmedEmail(user: { email?: string | null; email_confirmed_at?: string | null; confirmed_at?: string | null } | null) {
  return Boolean(user?.email && (user.email_confirmed_at || user.confirmed_at));
}

export function corsHeaders(origin: string | null = null): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": origin && /^https:\/\//.test(origin) ? origin : "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

export function jsonResponse(body: unknown, status = 200, origin: string | null = null) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(origin), "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

export function bearerToken(request: Request): string | null {
  const value = request.headers.get("authorization") ?? "";
  const match = /^Bearer ([A-Za-z0-9._~-]+)$/.exec(value);
  return match?.[1] ?? null;
}
