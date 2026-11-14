import { redirect } from "next/navigation";
import { getAdminAccess } from "@/lib/server/admin-access";
import { AgentFactoryWorkflowPlanner } from "@/components/admin/agent-factory-workflow-planner";
import "./planner.css";

export const dynamic = "force-dynamic";

export default async function AgentFactoryWorkflowPage() {
  const access = await getAdminAccess();
  if (!access.ok && access.reason === "unauthenticated") redirect("/?connexion=requise");
  if (!access.ok) redirect("/admin");
  return <AgentFactoryWorkflowPlanner />;
}
