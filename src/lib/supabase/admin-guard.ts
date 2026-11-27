import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "./server";
import { isMerkoraAdminEmail } from "./admin-constants";
export async function requireMerkoraAdmin() {
  const supabase = await getSupabaseServerClient();
  if (!supabase) redirect("/admin/login?status=unconfigured");
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user || !isMerkoraAdminEmail(user.email)) redirect("/admin/login");
  return user;
}
