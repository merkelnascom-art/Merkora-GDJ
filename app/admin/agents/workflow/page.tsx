import { redirect } from "next/navigation";
import { getAdminAccess } from "@/lib/server/admin-access";

export const dynamic = "force-dynamic";

export default async function AdminAgentWorkflowAliasPage() {
  const access = await getAdminAccess();
  if (!access.ok && access.reason === "unauthenticated") {
    redirect("/?connexion=requise");
  }
  if (!access.ok) {
    redirect("/admin");
  }
  redirect("/admin/agents/factory");
}
