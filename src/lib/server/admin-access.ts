import { getCurrentUser } from "@/lib/server/supabase-rest";

const ADMIN_EMAILS = new Set(["merkelnascom@gmail.com", "wdesk87@gmail.com"]);

export async function getAdminAccess() {
  const user = await getCurrentUser();
  if (!user) return { ok: false as const, reason: "unauthenticated" as const };
  if (!ADMIN_EMAILS.has(user.email.trim().toLowerCase())) {
    return { ok: false as const, reason: "not_allowed" as const };
  }
  return { ok: true as const, user };
}
