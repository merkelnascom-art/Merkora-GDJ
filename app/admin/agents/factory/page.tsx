import { redirect } from "next/navigation";
import { getAdminAccess } from "@/lib/server/admin-access";
import { FactoryWorkflowPlanner } from "./factory-workflow-planner";

export const dynamic = "force-dynamic";

export default async function AdminAgentFactoryPage() {
  const access = await getAdminAccess();

  if (!access.ok && access.reason === "unauthenticated") {
    redirect("/?connexion=requise");
  }
  if (!access.ok) {
    redirect("/admin");
  }

  return <FactoryWorkflowPlanner />;
}
