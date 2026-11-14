import {
  createAgentMissionEnvelope,
  type AgentMissionEnvelope,
  type AgentMissionRole,
} from "../server/orchestration/agent-mission-contract";
import {
  getAgentDefinition,
  type AgentDefinition,
  type AgentPoleId,
} from "./agent-catalog";

export type SpecialistMissionPreparation =
  | {
      status: "prepared";
      agent: AgentDefinition;
      runtimeRole: AgentMissionRole;
      mission: AgentMissionEnvelope;
    }
  | {
      status: "requires_specialized_runtime";
      agentId: string;
      poleId: AgentPoleId;
      reason: "NO_COMPATIBLE_EXISTING_RUNTIME_ROLE";
    };

/**
 * Explicit compatibility bridge to the existing generic mission contract.
 *
 * A mapping only means that the current generic role can carry this specialist's
 * mission packet. It does not mean the specialist has a dedicated provider,
 * tools, permissions, UI, or an active execution runtime.
 */
const EXISTING_RUNTIME_ROLE_BY_AGENT: Readonly<Record<string, AgentMissionRole>> = {
  "analyste-metier": "analyst",
  "chercheur-documentaire": "analyst",
  "expert-sectoriel": "analyst",
  "analyste-des-besoins": "analyst",
  "detecteur-de-contradictions": "cross_checker",
  "architecte-logiciel": "architect",
  "developpeur-frontend": "implementer",
  "developpeur-backend": "implementer",
  "expert-base-de-donnees": "implementer",
  "integrateur-api": "implementer",
  "generateur-de-fichiers": "implementer",
  "testeur-logiciel": "tester",
  "auditeur-de-code": "reviewer",
  "expert-securite": "reviewer",
  "detecteur-erreurs": "cross_checker",
  "agent-de-correction": "implementer",
};

function buildMissionInstructions(agent: AgentDefinition): string[] {
  return [
    `Agent spécialisé : ${agent.name} (${agent.id}).`,
    `Pôle de rattachement : ${agent.poleId}.`,
    `Mission : ${agent.mission}`,
    ...agent.responsibilities.slice(0, 4).map((item) => `Responsabilité : ${item}`),
    ...agent.activationTriggers.slice(0, 2).map((item) => `Déclencheur : ${item}`),
    ...agent.inputs.slice(0, 2).map((item) => `Entrée attendue : ${item}`),
    ...agent.outputs.slice(0, 2).map((item) => `Sortie attendue : ${item}`),
    ...agent.acceptanceCriteria.slice(0, 2).map((item) => `Critère d'acceptation : ${item}`),
    ...agent.verificationMethods.slice(0, 2).map((item) => `Vérification : ${item}`),
    ...agent.failureHandling.slice(0, 2).map((item) => `En cas d'échec : ${item}`),
  ];
}

/**
 * Prepares, but never executes, a specialist mission.
 * Unknown specialists are rejected. Specialists without a semantically
 * compatible generic role remain explicitly unassigned instead of being
 * squeezed into an unrelated role.
 */
export function prepareSpecialistMission(input: {
  agentId: string;
  missionId: string;
  projectId: string;
  contextReferences?: readonly string[];
  approvalRequiredFor?: readonly string[];
}): SpecialistMissionPreparation {
  const agent = getAgentDefinition(input.agentId);
  if (!agent) {
    throw new Error(`Agent inconnu : ${input.agentId}`);
  }

  const runtimeRole = EXISTING_RUNTIME_ROLE_BY_AGENT[agent.id];
  if (!runtimeRole) {
    return {
      status: "requires_specialized_runtime",
      agentId: agent.id,
      poleId: agent.poleId,
      reason: "NO_COMPATIBLE_EXISTING_RUNTIME_ROLE",
    };
  }

  const mission = createAgentMissionEnvelope({
    missionId: input.missionId,
    projectId: input.projectId,
    role: runtimeRole,
    objective: agent.mission,
    instructions: buildMissionInstructions(agent),
    contextReferences: [
      `agent-catalog:${agent.id}`,
      ...(input.contextReferences ?? []),
    ],
    constraints: [
      ...agent.permissionBoundaries,
      "Les domaines d'outils suggérés sont descriptifs et ne confèrent aucune permission.",
      "Ce paquet prépare une mission; il ne déclenche aucun appel fournisseur ni aucune exécution.",
    ],
    approvalRequiredFor: input.approvalRequiredFor ?? [],
  });

  return {
    status: "prepared",
    agent,
    runtimeRole,
    mission,
  };
}
