import {
  planAgentFactoryWorkflow,
  type AgentFactoryWorkflow,
  type FactoryHumanGate,
} from "../../agents/agent-factory-workflow";
import { prepareSpecialistMission } from "../../agents/agent-mission-adapter";
import type { AgentMissionResult, AgentMissionRole } from "./agent-mission-contract";
import {
  createAgentRuntime,
  type AgentInvocationOutcome,
  type AgentRuntimeAdapter,
  type AgentRuntimeConnection,
} from "./provider-execution";

type RuntimeFailureCode = Extract<AgentInvocationOutcome, { ok: false }>["code"];
type FactoryFailureCode =
  | RuntimeFailureCode
  | "WORKFLOW_START_NOT_AUTHORIZED"
  | "SPECIALIZED_RUNTIME_REQUIRED"
  | "NO_COMPATIBLE_PROVIDER"
  | "MODEL_ALIAS_MISSING"
  | "INDEPENDENT_PROVIDER_REQUIRED"
  | "NOT_AUTHORIZED"
  | "BUDGET_NOT_RESERVED";

export type FactoryAgentInvocation = {
  agentId: string;
  missionId: string;
  phaseId: string;
  providerId: string | null;
  status: "completed" | "blocked" | "failed" | "needs_review";
  code: FactoryFailureCode | null;
  result?: AgentMissionResult;
};

export type FactoryPhaseExecution = {
  phaseId: string;
  status: "not_selected" | "completed" | "blocked" | "needs_review";
  agentIds: string[];
};

export type FactoryGateResult = {
  gateId: FactoryHumanGate["id"];
  approved: boolean;
};

export type AgentFactoryExecutionResult = {
  workflow: AgentFactoryWorkflow;
  state: "blocked" | "needs_review" | "ready_for_human_review";
  executionStarted: boolean;
  phaseResults: FactoryPhaseExecution[];
  gateResults: FactoryGateResult[];
  invocations: FactoryAgentInvocation[];
  completedResults: AgentMissionResult[];
  blockedAgentIds: string[];
};

/**
 * Executes a server-created factory workflow through the existing provider
 * runtime. The caller must supply project ACL, explicit-start, human-gate and
 * budget policies. Calls are sequential for predictable cost and rate limits.
 *
 * This function does not persist state or deploy anything. A trusted server
 * route/worker must persist events and reconcile durable task state separately.
 */
export async function executeAgentFactoryWorkflow(input: {
  projectId: string;
  workflowId: string;
  agentIds: readonly string[];
  contextReferences?: readonly string[];
  adapters: readonly AgentRuntimeAdapter[];
  connections: readonly AgentRuntimeConnection[];
  modelAliases: Readonly<Record<string, string>>;
  timeoutMs: number;
  authorizeWorkflowStart: (scope: { projectId: string; workflowId: string }) => Promise<boolean>;
  authorizeAgent: (scope: {
    projectId: string;
    workflowId: string;
    agentId: string;
    missionId: string;
    role: AgentMissionRole;
    providerId: string;
    connectionId: string;
    connectionOwner: AgentRuntimeConnection["owner"];
  }) => Promise<boolean>;
  reserveBudget: (scope: {
    projectId: string;
    workflowId: string;
    agentId: string;
    missionId: string;
    role: AgentMissionRole;
    providerId: string;
    connectionId: string;
    connectionOwner: AgentRuntimeConnection["owner"];
  }) => Promise<boolean>;
  checkHumanGate: (scope: {
    projectId: string;
    workflowId: string;
    gate: FactoryHumanGate;
  }) => Promise<boolean>;
}): Promise<AgentFactoryExecutionResult> {
  const workflow = planAgentFactoryWorkflow({
    projectId: input.projectId,
    workflowId: input.workflowId,
    agentIds: input.agentIds,
    contextReferences: input.contextReferences,
  });

  const emptyResult = (
    state: AgentFactoryExecutionResult["state"],
    code?: FactoryFailureCode,
  ): AgentFactoryExecutionResult => ({
    workflow,
    state,
    executionStarted: false,
    phaseResults: [],
    gateResults: [],
    invocations: code ? [{
      agentId: "merkora-core",
      missionId: workflow.workflowId,
      phaseId: "workflow-start",
      providerId: null,
      status: "blocked",
      code,
    }] : [],
    completedResults: [],
    blockedAgentIds: [],
  });

  let startAuthorized = false;
  try {
    startAuthorized = await input.authorizeWorkflowStart({
      projectId: workflow.projectId,
      workflowId: workflow.workflowId,
    });
  } catch {
    startAuthorized = false;
  }
  if (!startAuthorized) return emptyResult("blocked", "WORKFLOW_START_NOT_AUTHORIZED");

  const runtime = createAgentRuntime(input.adapters);
  const adapterByProvider = new Map(input.adapters.map((adapter) => [adapter.providerId, adapter]));
  const primaryProviderIds = new Set<string>();
  const independentProviderByRole = new Map<"reviewer" | "cross_checker", string>();
  const independentProviderIds = new Set<string>();
  const phaseResults: FactoryPhaseExecution[] = [];
  const gateResults: FactoryGateResult[] = [];
  const invocations: FactoryAgentInvocation[] = [];
  const completedResults: AgentMissionResult[] = [];
  const blockedAgentIds: string[] = [];
  const checkedGateIds = new Set<FactoryHumanGate["id"]>();
  let executionStarted = false;
  let terminalState: AgentFactoryExecutionResult["state"] = "ready_for_human_review";

  const chooseProvider = (role: AgentMissionRole): {
    connection: AgentRuntimeConnection;
    modelAlias: string;
  } | { code: FactoryFailureCode } => {
    const candidates = input.connections.filter((connection) => {
      const adapter = adapterByProvider.get(connection.providerId);
      const modelAlias = input.modelAliases[connection.providerId]?.trim();
      return connection.status === "connected"
        && Boolean(adapter)
        && Boolean(modelAlias)
        && Boolean(adapter && connection.capabilities.includes(adapter.invocationCapability));
    });

    if (candidates.length === 0) {
      const hasConnectedProvider = input.connections.some((connection) =>
        connection.status === "connected" && adapterByProvider.has(connection.providerId),
      );
      return { code: hasConnectedProvider ? "MODEL_ALIAS_MISSING" : "NO_COMPATIBLE_PROVIDER" };
    }

    if (role !== "reviewer" && role !== "cross_checker") {
      const connection = candidates[0];
      if (!connection) return { code: "NO_COMPATIBLE_PROVIDER" };
      primaryProviderIds.add(connection.providerId);
      const modelAlias = input.modelAliases[connection.providerId]?.trim();
      if (!modelAlias) return { code: "MODEL_ALIAS_MISSING" };
      return { connection, modelAlias };
    }

    const existingProvider = independentProviderByRole.get(role);
    if (existingProvider) {
      const connection = candidates.find((candidate) => candidate.providerId === existingProvider);
      if (!connection) return { code: "NO_COMPATIBLE_PROVIDER" };
      const modelAlias = input.modelAliases[connection.providerId]?.trim();
      if (!modelAlias) return { code: "MODEL_ALIAS_MISSING" };
      return { connection, modelAlias };
    }

    const needsIndependentProvider = primaryProviderIds.size > 0 || independentProviderIds.size > 0;
    const connection = candidates.find((candidate) =>
      !needsIndependentProvider
      || (!primaryProviderIds.has(candidate.providerId) && !independentProviderIds.has(candidate.providerId)),
    );
    if (!connection) return { code: "INDEPENDENT_PROVIDER_REQUIRED" };

    independentProviderByRole.set(role, connection.providerId);
    independentProviderIds.add(connection.providerId);
    const modelAlias = input.modelAliases[connection.providerId]?.trim();
    if (!modelAlias) return { code: "MODEL_ALIAS_MISSING" };
    return { connection, modelAlias };
  };

  const phaseIndex = new Map(workflow.phases.map((phase, index) => [phase.id, index]));
  for (let index = 0; index < workflow.phases.length; index += 1) {
    const phase = workflow.phases[index];
    if (!phase) continue;

    // A gate is checked at its blocking phase even when that phase has no
    // selected specialist, so omitting an agent cannot bypass an approval.
    const dueGates = workflow.humanGates.filter((gate) => {
      const gateIndex = phaseIndex.get(gate.blocksPhase);
      return gateIndex !== undefined && gateIndex <= index && !checkedGateIds.has(gate.id);
    });

    for (const gate of dueGates) {
      let approved = false;
      try {
        approved = await input.checkHumanGate({
          projectId: workflow.projectId,
          workflowId: workflow.workflowId,
          gate,
        });
      } catch {
        approved = false;
      }
      checkedGateIds.add(gate.id);
      gateResults.push({ gateId: gate.id, approved });
      if (!approved) {
        phaseResults.push({
          phaseId: phase.id,
          status: "blocked",
          agentIds: [...phase.agentIds],
        });
        terminalState = "blocked";
        return {
          workflow, state: terminalState, executionStarted, phaseResults,
          gateResults, invocations, completedResults, blockedAgentIds,
        };
      }
    }

    if (phase.agentIds.length === 0) {
      phaseResults.push({ phaseId: phase.id, status: "not_selected", agentIds: [] });
      continue;
    }

    let phaseBlocked = false;
    let phaseNeedsReview = false;

    for (const agentId of phase.agentIds) {
      const step = workflow.missionPlan.steps.find((item) => item.agentId === agentId);
      if (!step) {
        invocations.push({
          agentId, missionId: `${workflow.workflowId}-${agentId}`,
          phaseId: phase.id, providerId: null, status: "blocked", code: "NO_COMPATIBLE_PROVIDER",
        });
        blockedAgentIds.push(agentId);
        phaseBlocked = true;
        continue;
      }

      const preparation = prepareSpecialistMission({
        agentId,
        missionId: step.missionId,
        projectId: workflow.projectId,
        contextReferences: input.contextReferences,
      });
      if (preparation.status !== "prepared") {
        invocations.push({
          agentId, missionId: step.missionId, phaseId: phase.id,
          providerId: null, status: "blocked", code: "SPECIALIZED_RUNTIME_REQUIRED",
        });
        blockedAgentIds.push(agentId);
        phaseBlocked = true;
        continue;
      }

      const provider = chooseProvider(preparation.runtimeRole);
      if ("code" in provider) {
        invocations.push({
          agentId, missionId: step.missionId, phaseId: phase.id,
          providerId: null, status: "blocked", code: provider.code,
        });
        blockedAgentIds.push(agentId);
        phaseBlocked = true;
        continue;
      }

      const policyScope = {
        projectId: workflow.projectId,
        workflowId: workflow.workflowId,
        agentId,
        missionId: step.missionId,
        role: preparation.runtimeRole,
        providerId: provider.connection.providerId,
        connectionId: provider.connection.connectionId,
        connectionOwner: provider.connection.owner,
      };

      let authorized = false;
      try {
        authorized = await input.authorizeAgent(policyScope);
      } catch {
        authorized = false;
      }
      if (!authorized) {
        invocations.push({
          agentId, missionId: step.missionId, phaseId: phase.id,
          providerId: provider.connection.providerId, status: "blocked", code: "NOT_AUTHORIZED",
        });
        blockedAgentIds.push(agentId);
        phaseBlocked = true;
        continue;
      }

      let reserved = false;
      try {
        reserved = await input.reserveBudget(policyScope);
      } catch {
        reserved = false;
      }
      if (!reserved) {
        invocations.push({
          agentId, missionId: step.missionId, phaseId: phase.id,
          providerId: provider.connection.providerId, status: "blocked", code: "BUDGET_NOT_RESERVED",
        });
        blockedAgentIds.push(agentId);
        phaseBlocked = true;
        continue;
      }

      executionStarted = true;
      const outcome = await runtime.invoke({
        connection: provider.connection,
        mission: preparation.mission,
        modelAlias: provider.modelAlias,
        timeoutMs: input.timeoutMs,
      });

      if (!outcome.ok) {
        invocations.push({
          agentId, missionId: step.missionId, phaseId: phase.id,
          providerId: provider.connection.providerId, status: "failed", code: outcome.code,
        });
        blockedAgentIds.push(agentId);
        phaseBlocked = true;
        continue;
      }

      if (outcome.result.status !== "completed") {
        invocations.push({
          agentId, missionId: step.missionId, phaseId: phase.id,
          providerId: provider.connection.providerId,
          status: outcome.result.status === "failed" ? "failed" : "blocked",
          code: null,
          result: outcome.result,
        });
        blockedAgentIds.push(agentId);
        phaseBlocked = true;
        continue;
      }

      completedResults.push(outcome.result);
      const requiresReview = outcome.result.requiresHumanDecision
        || outcome.result.findings.some((finding) => finding.severity === "warning" || finding.severity === "critical");
      invocations.push({
        agentId, missionId: step.missionId, phaseId: phase.id,
        providerId: provider.connection.providerId,
        status: requiresReview ? "needs_review" : "completed",
        code: null,
        result: outcome.result,
      });
      if (requiresReview) phaseNeedsReview = true;
    }

    if (phaseBlocked) {
      phaseResults.push({ phaseId: phase.id, status: "blocked", agentIds: [...phase.agentIds] });
      terminalState = "blocked";
      return {
        workflow, state: terminalState, executionStarted, phaseResults,
        gateResults, invocations, completedResults, blockedAgentIds: [...new Set(blockedAgentIds)],
      };
    }

    if (phaseNeedsReview) {
      phaseResults.push({ phaseId: phase.id, status: "needs_review", agentIds: [...phase.agentIds] });
      terminalState = "needs_review";
      return {
        workflow, state: terminalState, executionStarted, phaseResults,
        gateResults, invocations, completedResults, blockedAgentIds: [...new Set(blockedAgentIds)],
      };
    }

    phaseResults.push({ phaseId: phase.id, status: "completed", agentIds: [...phase.agentIds] });
  }

  return {
    workflow,
    state: terminalState,
    executionStarted,
    phaseResults,
    gateResults,
    invocations,
    completedResults,
    blockedAgentIds: [...new Set(blockedAgentIds)],
  };
}
