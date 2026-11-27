import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "./server";
import { MERKORA_ADMIN_EMAIL } from "./admin-auth-actions";
export async function requireMerkoraAdmin() {
  const supabase = await getSupabaseServerClient();
  if (!supabase) redirect("/admin/login?status=unconfigured");
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user || user.email?.trim().toLowerCase() !== MERKORA_ADMIN_EMAIL) redirect("/admin/login");
  return user;
}
