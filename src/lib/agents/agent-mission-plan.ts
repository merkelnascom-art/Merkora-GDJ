import { getAgentDefinition, type AgentPoleId } from "./agent-catalog";

export type AgentMissionRequest = {
  missionId: string;
  agentId: string;
  dependsOn: readonly string[];
};

export type AgentMissionPlanStep = {
  sequence: number;
  missionId: string;
  agentId: string;
  agentName: string;
  poleId: AgentPoleId;
  dependsOn: readonly string[];
  execution: "not_started";
  toolPermissions: readonly [];
  approvalRequiredFor: readonly [];
};

export type AgentMissionPlan = {
  contractVersion: 1;
  status: "planned";
  executionEnabled: false;
  steps: readonly AgentMissionPlanStep[];
};

/**
 * Builds a deterministic dependency order from explicit mission requests.
 *
 * This is a planner only: it does not infer agents, create missing missions,
 * execute work, call providers, grant tools, or manufacture approvals.
 */
export function createAgentMissionPlan(
  requests: readonly AgentMissionRequest[],
): AgentMissionPlan {
  if (!Array.isArray(requests) || requests.length === 0) {
    throw new Error("Le plan doit contenir au moins une mission.");
  }
  if (requests.length > 100) {
    throw new Error("Le plan dépasse la limite de 100 missions.");
  }

  const byId = new Map<string, AgentMissionRequest>();
  const agents = new Map<string, NonNullable<ReturnType<typeof getAgentDefinition>>>();

  for (const request of requests) {
    if (!request || typeof request !== "object") {
      throw new Error("Mission invalide.");
    }
    if (
      typeof request.missionId !== "string" ||
      !/^[a-z0-9][a-z0-9-]{0,79}$/.test(request.missionId)
    ) {
      throw new Error("Identifiant de mission invalide.");
    }
    if (byId.has(request.missionId)) {
      throw new Error(`Identifiant de mission dupliqué : ${request.missionId}`);
    }

    if (typeof request.agentId !== "string") {
      throw new Error("Identifiant d'agent invalide.");
    }
    const agent = getAgentDefinition(request.agentId);
    if (!agent) {
      throw new Error(`Agent inconnu : ${request.agentId}`);
    }

    if (!Array.isArray(request.dependsOn) || request.dependsOn.length > 20) {
      throw new Error(`Dépendances invalides pour la mission : ${request.missionId}`);
    }
    const dependencies = [...request.dependsOn];
    for (const dependencyId of dependencies) {
      if (typeof dependencyId !== "string" || !/^[a-z0-9][a-z0-9-]{0,79}$/.test(dependencyId)) {
        throw new Error(`Dépendance invalide pour la mission : ${request.missionId}`);
      }
      if (dependencyId === request.missionId) {
        throw new Error(`Une mission ne peut pas dépendre d'elle-même : ${request.missionId}`);
      }
    }

    byId.set(request.missionId, {
      missionId: request.missionId,
      agentId: request.agentId,
      dependsOn: [...new Set(dependencies)],
    });
    agents.set(request.missionId, agent);
  }

  for (const request of byId.values()) {
    for (const dependencyId of request.dependsOn) {
      if (!byId.has(dependencyId)) {
        throw new Error(`Dépendance inconnue : ${dependencyId}`);
      }
    }
  }

  const state = new Map<string, "visiting" | "visited">();
  const ordered: string[] = [];

  const visit = (missionId: string): void => {
    const currentState = state.get(missionId);
    if (currentState === "visited") return;
    if (currentState === "visiting") {
      throw new Error("Cycle de dépendances détecté dans le plan de missions.");
    }

    state.set(missionId, "visiting");
    const request = byId.get(missionId);
    if (!request) throw new Error(`Mission introuvable : ${missionId}`);

    for (const dependencyId of request.dependsOn) {
      visit(dependencyId);
    }

    state.set(missionId, "visited");
    ordered.push(missionId);
  };

  for (const request of requests) visit(request.missionId);

  const steps = ordered.map((missionId, index): AgentMissionPlanStep => {
    const request = byId.get(missionId);
    const agent = agents.get(missionId);
    if (!request || !agent) throw new Error(`Mission impossible à résoudre : ${missionId}`);

    return {
      sequence: index + 1,
      missionId,
      agentId: agent.id,
      agentName: agent.name,
      poleId: agent.poleId,
      dependsOn: request.dependsOn,
      execution: "not_started",
      toolPermissions: [],
      approvalRequiredFor: [],
    };
  });

  return {
    contractVersion: 1,
    status: "planned",
    executionEnabled: false,
    steps,
  };
}
