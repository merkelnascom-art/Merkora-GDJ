import { redirect } from "next/navigation";
import { getAdminAccess } from "@/lib/server/admin-access";
import { AgentCatalogExplorer } from "./agent-catalog-explorer";

export const dynamic = "force-dynamic";

export default async function AdminAgentsPage() {
  const access = await getAdminAccess();

  if (!access.ok && access.reason === "unauthenticated") {
    redirect("/?connexion=requise");
  }
  if (!access.ok) {
    redirect("/admin");
  }

  return <AgentCatalogExplorer />;
}
