import type { ReactNode } from "react";
import { requireMerkoraAdmin } from "@/lib/supabase/admin-guard";
export default async function AdminWorkspaceLayout({ children }: Readonly<{ children: ReactNode }>) {
  await requireMerkoraAdmin();
  return children;
}
