import "server-only";
import { cookies } from "next/headers";
import { getCurrentUser, type SafeAuthUser } from "@/lib/server/supabase-rest";

export type AdminAccess =
  | { ok: true; user: SafeAuthUser }
  | { ok: false; reason: "unauthenticated" | "not_allowed" | "not_configured" };

function configuredAdminEmails(): Set<string> {
  return new Set(
    (process.env.MERKORA_ADMIN_EMAILS ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

/** Server-only allowlist. Never infer an admin role from client input or user metadata. */
export async function getAdminAccess(): Promise<AdminAccess> {
  const allowedEmails = configuredAdminEmails();
  if (allowedEmails.size === 0) return { ok: false, reason: "not_configured" };

  const user = await getCurrentUser(await cookies());
  if (!user?.email) return { ok: false, reason: "unauthenticated" };
  if (!allowedEmails.has(user.email.trim().toLowerCase())) return { ok: false, reason: "not_allowed" };
  return { ok: true, user };
}
