import type { AgentFactoryWorkflow } from "@/lib/agents/agent-factory-workflow";

export type DurableFactoryTaskKey =
  | "prepare_specification"
  | "generate_application"
  | "run_quality_checks"
  | "repair_and_retest"
  | "human_delivery_review";

export type FactoryTaskMissionBridge = {
  schemaVersion: 1;
  projectId: string;
  workflowId: string;
  status: "prepared" | "requires_specialized_task_runtime";
  executionEnabled: false;
  stages: Array<{
    taskKey: DurableFactoryTaskKey;
    missionIds: string[];
    agentIds: string[];
  }>;
  unsupported: Array<{
    phaseId: string;
    missionIds: string[];
    agentIds: string[];
    reason: "NO_EXISTING_DURABLE_TASK_EQUIVALENT";
  }>;
};

/**
 * Describes how an already-planned multi-pole workflow can be represented by
 * the five durable factory tasks that already exist in Supabase.
 *
 * This is intentionally a manifest adapter only. It does not create/update
 * jobs or tasks, invoke providers, or authorize work. Phases with no honest
 * equivalent in the existing task lifecycle remain explicitly unsupported.
 */
export function bridgeWorkflowToDurableFactoryTasks(
  workflow: Pick<AgentFactoryWorkflow,
    "projectId" | "workflowId" | "executionEnabled" | "phases" | "assignments">,
): FactoryTaskMissionBridge {
  if (!workflow.projectId.trim() || !workflow.workflowId.trim()) {
    throw new Error("Un projet et un workflow sont requis.");
  }
  if (workflow.executionEnabled !== false) {
    throw new Error("Le pont de tâches ne peut accepter qu'un workflow non activé.");
  }

  const taskKeys: DurableFactoryTaskKey[] = [
    "prepare_specification",
    "generate_application",
    "run_quality_checks",
    "repair_and_retest",
    "human_delivery_review",
  ];
  const stageAgents = new Map<DurableFactoryTaskKey, Set<string>>(
    taskKeys.map((key) => [key, new Set<string>()]),
  );
  const stageMissions = new Map<DurableFactoryTaskKey, Set<string>>(
    taskKeys.map((key) => [key, new Set<string>()]),
  );
  const unsupported = [];

  for (const phase of workflow.phases) {
    const agents = workflow.assignments.filter((item) => item.phaseId === phase.id);
    if (agents.length === 0) continue;

    let taskKey: DurableFactoryTaskKey | null = null;
    if (phase.id === "intelligence" || phase.id === "conception" || phase.id === "governance-before-build") {
      taskKey = "prepare_specification";
    } else if (phase.id === "fabrication") {
      taskKey = "generate_application";
    } else if (phase.id === "controle") {
      // The correction specialist has its own existing repair task.
      for (const assignment of agents) {
        const key = assignment.agentId === "agent-de-correction"
          ? "repair_and_retest"
          : "run_quality_checks";
        stageAgents.get(key)?.add(assignment.agentId);
        stageMissions.get(key)?.add(assignment.missionId);
      }
      continue;
    }

    if (!taskKey) {
      unsupported.push({
        phaseId: phase.id,
        missionIds: agents.map((item) => item.missionId),
        agentIds: agents.map((item) => item.agentId),
        reason: "NO_EXISTING_DURABLE_TASK_EQUIVALENT" as const,
      });
      continue;
    }

    for (const assignment of agents) {
      stageAgents.get(taskKey)?.add(assignment.agentId);
      stageMissions.get(taskKey)?.add(assignment.missionId);
    }
  }

  const stages = taskKeys.map((taskKey) => ({
    taskKey,
    missionIds: [...(stageMissions.get(taskKey) ?? [])],
    agentIds: [...(stageAgents.get(taskKey) ?? [])],
  }));

  return {
    schemaVersion: 1,
    projectId: workflow.projectId,
    workflowId: workflow.workflowId,
    status: unsupported.length > 0 ? "requires_specialized_task_runtime" : "prepared",
    executionEnabled: false,
    stages,
    unsupported,
  };
}
