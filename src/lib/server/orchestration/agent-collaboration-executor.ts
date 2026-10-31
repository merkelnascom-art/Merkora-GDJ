import type { AgentMissionEnvelope, AgentMissionResult } from "./agent-mission-contract";
import type { AgentCollaborationPlan, AgentRole } from "./agent-collaboration";
import {
  createAgentRuntime,
  type AgentInvocationOutcome,
  type AgentRuntimeAdapter,
  type AgentRuntimeConnection,
} from "./provider-execution";

export type CollaborationInvocationRecord = {
  role: AgentRole;
  providerId: string;
  outcome:
    | AgentInvocationOutcome
    | { ok: false; code: "MISSION_MISSING" | "PROJECT_SCOPE_MISMATCH" | "NOT_AUTHORIZED" | "BUDGET_NOT_RESERVED" };
};

export type CollaborationExecutionResult = {
  projectId: string;
  invocations: CollaborationInvocationRecord[];
  blockedRoles: AgentRole[];
  completedResults: AgentMissionResult[];
};

/**
 * Executes a previously planned collaboration through registered provider
 * adapters. Authorization and budget reservation are mandatory callbacks so
 * this orchestration layer cannot silently bypass tenant policy or spend limits.
 *
 * Calls are deliberately sequential for predictable cost and rate limiting.
 * Durable job state, retries and audit persistence belong to the worker layer.
 */
export async function executeAgentCollaboration(input: {
  plan: AgentCollaborationPlan;
  adapters: readonly AgentRuntimeAdapter[];
  connections: readonly AgentRuntimeConnection[];
  missions: Partial<Record<AgentRole, AgentMissionEnvelope>>;
  modelAliases: Readonly<Record<string, string>>;
  timeoutMs: number;
  authorize: (assignment: { projectId: string; role: AgentRole; providerId: string }) => Promise<boolean>;
  reserveBudget: (assignment: { projectId: string; role: AgentRole; providerId: string }) => Promise<boolean>;
}): Promise<CollaborationExecutionResult> {
  const runtime = createAgentRuntime(input.adapters);
  const connectionByProvider = new Map(input.connections.map((connection) => [connection.providerId, connection]));
  const invocations: CollaborationInvocationRecord[] = [];
  const blockedRoles = [...input.plan.blockedRoles];

  for (const assignment of input.plan.assignments) {
    const base = {
      projectId: input.plan.projectId,
      role: assignment.role,
      providerId: assignment.providerId,
    };
    const mission = input.missions[assignment.role];

    if (!mission) {
      invocations.push({ ...base, outcome: { ok: false, code: "MISSION_MISSING" } });
      blockedRoles.push(assignment.role);
      continue;
    }
    if (mission.projectId !== input.plan.projectId || mission.role !== assignment.role) {
      invocations.push({ ...base, outcome: { ok: false, code: "PROJECT_SCOPE_MISMATCH" } });
      blockedRoles.push(assignment.role);
      continue;
    }

    let authorized = false;
    try {
      authorized = await input.authorize(base);
    } catch {
      authorized = false;
    }
    if (!authorized) {
      invocations.push({ ...base, outcome: { ok: false, code: "NOT_AUTHORIZED" } });
      blockedRoles.push(assignment.role);
      continue;
    }

    const connection = connectionByProvider.get(assignment.providerId);
    if (!connection || connection.status !== "connected") {
      invocations.push({ ...base, outcome: { ok: false, code: "NOT_CONNECTED" } });
      blockedRoles.push(assignment.role);
      continue;
    }
    if (!connection.capabilities.includes(assignment.capability)) {
      invocations.push({ ...base, outcome: { ok: false, code: "CAPABILITY_MISSING" } });
      blockedRoles.push(assignment.role);
      continue;
    }

    const modelAlias = input.modelAliases[assignment.providerId];
    if (!modelAlias) {
      invocations.push({ ...base, outcome: { ok: false, code: "PROVIDER_ERROR" } });
      blockedRoles.push(assignment.role);
      continue;
    }

    let reserved = false;
    try {
      reserved = await input.reserveBudget(base);
    } catch {
      reserved = false;
    }
    if (!reserved) {
      invocations.push({ ...base, outcome: { ok: false, code: "BUDGET_NOT_RESERVED" } });
      blockedRoles.push(assignment.role);
      continue;
    }

    const outcome = await runtime.invoke({
      connection,
      mission,
      modelAlias,
      timeoutMs: input.timeoutMs,
    });
    invocations.push({ ...base, outcome });
    if (!outcome.ok) blockedRoles.push(assignment.role);
  }

  const completedResults = invocations.flatMap((invocation) =>
    invocation.outcome.ok ? [invocation.outcome.result] : [],
  );

  return {
    projectId: input.plan.projectId,
    invocations,
    blockedRoles: [...new Set(blockedRoles)],
    completedResults,
  };
}
