import { getSupabaseServerClient } from "./server";
import { isMerkoraAdminEmail } from "./admin-constants";

export type MerKoraRole = "client" | "collaborator" | "designer" | "developer" | "admin" | "superadmin";

export type AuthenticatedContext = { userId: string; email: string | null; displayName: string | null; role: MerKoraRole };

/** Reads the role from the protected profile row, never from editable browser metadata. */
export async function getAuthenticatedContext(): Promise<AuthenticatedContext | null> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return null;
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  const { data: profile } = await supabase.from("user_profiles").select("display_name,role").eq("user_id", user.id).maybeSingle();
  const allowed: MerKoraRole[] = ["client", "collaborator", "designer", "developer", "admin", "superadmin"];
  const role = isMerkoraAdminEmail(user.email) ? "superadmin" : (allowed.includes(profile?.role as MerKoraRole) ? profile!.role as MerKoraRole : "client");
  return { userId: user.id, email: user.email ?? null, displayName: profile?.display_name ?? (typeof user.user_metadata?.display_name === "string" ? user.user_metadata.display_name : null), role };
}