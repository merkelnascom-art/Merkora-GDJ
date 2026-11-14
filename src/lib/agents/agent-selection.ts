import {
  AGENT_POLES,
  getAgentDefinition,
  type AgentDefinition,
  type AgentPoleId,
} from "./agent-catalog";

export type AgentSelectionGroup = {
  poleId: AgentPoleId;
  poleName: string;
  agents: readonly AgentDefinition[];
};

export type AgentSelectionResult = {
  /** Selected specialists in first-request order. */
  agents: readonly AgentDefinition[];
  /** Repeated identifiers, reported in the order they reappeared. */
  duplicateAgentIds: readonly string[];
  /** Non-empty groups in the exact order of the validated organigram. */
  byPole: readonly AgentSelectionGroup[];
};

/**
 * Resolves an explicit list of specialist IDs.
 *
 * This is intentionally not an AI planner: it never infers, activates, or
 * assigns additional agents. Provider selection and mission execution remain
 * separate server-side responsibilities.
 */
export function resolveAgentSelection(
  requestedAgentIds: readonly string[],
): AgentSelectionResult {
  if (!Array.isArray(requestedAgentIds)) {
    throw new Error("La sélection d'agents doit être une liste.");
  }
  if (requestedAgentIds.length > 35) {
    throw new Error("La sélection dépasse les 35 agents du catalogue.");
  }

  const agents: AgentDefinition[] = [];
  const seen = new Set<string>();
  const duplicateAgentIds: string[] = [];

  for (const agentId of requestedAgentIds) {
    if (typeof agentId !== "string" || !agentId.trim() || agentId !== agentId.trim()) {
      throw new Error("Identifiant d'agent invalide.");
    }
    if (seen.has(agentId)) {
      duplicateAgentIds.push(agentId);
      continue;
    }

    const agent = getAgentDefinition(agentId);
    if (!agent) {
      throw new Error(`Agent inconnu : ${agentId}`);
    }

    seen.add(agentId);
    agents.push(agent);
  }

  const byPole = AGENT_POLES.flatMap((pole) => {
    const selected = agents.filter((agent) => agent.poleId === pole.id);
    return selected.length > 0
      ? [{ poleId: pole.id, poleName: pole.name, agents: selected }]
      : [];
  });

  return {
    agents,
    duplicateAgentIds,
    byPole,
  };
}
