import { AGENT_POLES, type AgentPoleId } from "./agent-catalog";
import { resolveAgentSelection } from "./agent-selection";
import { prepareSpecialistMission, type SpecialistMissionPreparation } from "./agent-mission-adapter";
import { createAgentMissionPlan, type AgentMissionRequest, type AgentMissionPlan } from "./agent-mission-plan";
import { orderExecutionTasks } from "../server/orchestration/execution-graph";

type FactoryPhaseId =
  | "intelligence"
  | "conception"
  | "governance-before-build"
  | "fabrication"
  | "controle"
  | "governance-before-release"
  | "exploitation-preparation"
  | "production-release"
  | "relation-client"
  | "post-delivery-support";

type FactoryPhaseDefinition = {
  id: FactoryPhaseId;
  label: string;
  poleId: AgentPoleId;
  purpose: string;
};

const FACTORY_PHASES: readonly FactoryPhaseDefinition[] = [
  {
    id: "intelligence",
    label: "Comprendre et qualifier",
    poleId: "intelligence",
    purpose: "Établir les faits, besoins, objectifs, contraintes et inconnues du projet.",
  },
  {
    id: "conception",
    label: "Concevoir et spécifier",
    poleId: "conception",
    purpose: "Transformer le besoin clarifié en parcours, maquettes, règles et spécifications.",
  },
  {
    id: "governance-before-build",
    label: "Cadrage administratif et financier",
    poleId: "gestion_administration",
    purpose: "Préparer ressources, budget, devis et autorisations avant tout lancement de fabrication.",
  },
  {
    id: "fabrication",
    label: "Fabriquer",
    poleId: "fabrication",
    purpose: "Construire les livrables à partir du périmètre et des spécifications approuvés.",
  },
  {
    id: "controle",
    label: "Contrôler et corriger",
    poleId: "controle",
    purpose: "Vérifier les livrables, relever les écarts et demander les corrections nécessaires.",
  },
  {
    id: "governance-before-release",
    label: "Validation administrative de sortie",
    poleId: "gestion_administration",
    purpose: "Contrôler le dossier et les autorisations avant la préparation de livraison ou d'exploitation.",
  },
  {
    id: "exploitation-preparation",
    label: "Préparer l'exploitation",
    poleId: "exploitation",
    purpose: "Préparer environnements, supervision, maintenance et procédures d'incident sans publier en production.",
  },
  {
    id: "production-release",
    label: "Exécuter une mise en production autorisée",
    poleId: "exploitation",
    purpose: "Réaliser uniquement la publication explicitement autorisée et tracer son résultat.",
  },
  {
    id: "relation-client",
    label: "Préparer la livraison et accompagner",
    poleId: "relation_client",
    purpose: "Préparer la documentation, la formation, les échanges et le transfert au client.",
  },
  {
    id: "post-delivery-support",
    label: "Assurer le support après livraison",
    poleId: "relation_client",
    purpose: "Ouvrir le suivi, traiter les demandes et accompagner l'évolution après acceptation de la livraison.",
  },
];

const PHASE_BY_AGENT: Readonly<Record<string, FactoryPhaseId>> = {
  "analyste-metier": "intelligence",
  "chercheur-documentaire": "intelligence",
  "expert-sectoriel": "intelligence",
  "analyste-des-besoins": "intelligence",
  "detecteur-de-contradictions": "intelligence",

  "architecte-logiciel": "conception",
  "product-designer": "conception",
  "ux-ui-designer": "conception",
  "expert-fonctionnel": "conception",
  "redacteur-technique": "conception",

  "estimation-ressources-couts": "governance-before-build",
  "preparation-des-devis": "governance-before-build",
  "suivi-des-budgets": "governance-before-build",
  "gestion-des-autorisations": "governance-before-build",

  "developpeur-frontend": "fabrication",
  "developpeur-backend": "fabrication",
  "expert-base-de-donnees": "fabrication",
  "integrateur-api": "fabrication",
  "generateur-de-fichiers": "fabrication",

  "testeur-logiciel": "controle",
  "auditeur-de-code": "controle",
  "expert-securite": "controle",
  "detecteur-erreurs": "controle",
  "agent-de-correction": "controle",

  "validation-administrative": "governance-before-release",

  devops: "exploitation-preparation",
  "gestionnaire-des-deploiements": "production-release",
  supervision: "exploitation-preparation",
  maintenance: "exploitation-preparation",
  "gestion-des-incidents": "exploitation-preparation",

  "assistant-client": "relation-client",
  "suivi-des-demandes": "relation-client",
  documentation: "relation-client",
  formation: "relation-client",
  "support-apres-livraison": "post-delivery-support",
};

export type FactoryHumanGate = {
  id:
    | "client-scope-validation"
    | "administrative-review"
    | "execution-authorization"
    | "quality-acceptance"
    | "production-release-authorization"
    | "delivery-acceptance";
  label: string;
  blocksPhase: FactoryPhaseId;
  requiredFor: readonly FactoryPhaseId[];
  status: "not_evaluated";
  authority: "client" | "authorized_administrator" | "authorized_release_owner";
  enforcement: "must_be_checked_by_existing_approval_or_release_service";
};

const HUMAN_GATES: readonly FactoryHumanGate[] = [
  {
    id: "client-scope-validation",
    label: "Validation du besoin et du périmètre par le client",
    blocksPhase: "fabrication",
    requiredFor: [
      "fabrication", "controle", "governance-before-release",
      "exploitation-preparation", "production-release", "relation-client", "post-delivery-support",
    ],
    status: "not_evaluated",
    authority: "client",
    enforcement: "must_be_checked_by_existing_approval_or_release_service",
  },
  {
    id: "administrative-review",
    label: "Revue administrative du plan et du devis",
    blocksPhase: "fabrication",
    requiredFor: ["fabrication"],
    status: "not_evaluated",
    authority: "authorized_administrator",
    enforcement: "must_be_checked_by_existing_approval_or_release_service",
  },
  {
    id: "execution-authorization",
    label: "Autorisation explicite de lancer la fabrication",
    blocksPhase: "fabrication",
    requiredFor: ["fabrication"],
    status: "not_evaluated",
    authority: "authorized_administrator",
    enforcement: "must_be_checked_by_existing_approval_or_release_service",
  },
  {
    id: "quality-acceptance",
    label: "Acceptation des contrôles et des preuves qualité",
    blocksPhase: "governance-before-release",
    requiredFor: [
      "governance-before-release", "exploitation-preparation",
      "production-release", "relation-client", "post-delivery-support",
    ],
    status: "not_evaluated",
    authority: "authorized_administrator",
    enforcement: "must_be_checked_by_existing_approval_or_release_service",
  },
  {
    id: "production-release-authorization",
    label: "Autorisation distincte de toute mise en production",
    blocksPhase: "production-release",
    requiredFor: ["production-release"],
    status: "not_evaluated",
    authority: "authorized_release_owner",
    enforcement: "must_be_checked_by_existing_approval_or_release_service",
  },
  {
    id: "delivery-acceptance",
    label: "Réception et acceptation de la livraison",
    blocksPhase: "post-delivery-support",
    requiredFor: ["post-delivery-support"],
    status: "not_evaluated",
    authority: "client",
    enforcement: "must_be_checked_by_existing_approval_or_release_service",
  },
];

export type AgentFactoryWorkflow = {
  contractVersion: 1;
  workflowId: string;
  projectId: string;
  core: "merkora-core";
  status: "planned";
  executionEnabled: false;
  phases: Array<FactoryPhaseDefinition & {
    agentIds: string[];
    missionIds: string[];
    status: "planned" | "not_selected";
  }>;
  poles: Array<{
    poleId: AgentPoleId;
    poleName: string;
    selectedAgentIds: string[];
    selectedCount: number;
    totalAgents: number;
    status: "selected" | "not_selected";
  }>;
  assignments: Array<{
    agentId: string;
    poleId: AgentPoleId;
    phaseId: FactoryPhaseId;
    missionId: string;
    status: SpecialistMissionPreparation["status"];
    reason?: "NO_COMPATIBLE_EXISTING_RUNTIME_ROLE";
  }>;
  missionPlan: AgentMissionPlan;
  executionOrder: string[];
  humanGates: readonly FactoryHumanGate[];
  guarantees: readonly string[];
};

/**
 * Composes the validated specialist catalog with MerKora's existing mission
 * contract and dependency graph. This is a planning/configuration boundary:
 * it never invokes a provider, starts a worker, grants tools, or approves a gate.
 */
export function planAgentFactoryWorkflow(input: {
  projectId: string;
  workflowId: string;
  agentIds: readonly string[];
  contextReferences?: readonly string[];
}): AgentFactoryWorkflow {
  const projectId = input.projectId.trim();
  if (!projectId || projectId.length > 160) {
    throw new Error("Identifiant de projet invalide.");
  }
  if (!/^[a-z0-9][a-z0-9-]{0,29}$/.test(input.workflowId)) {
    throw new Error("Identifiant de workflow invalide.");
  }
  if (!Array.isArray(input.agentIds) || input.agentIds.length === 0) {
    throw new Error("Sélection d'agents vide.");
  }

  const selection = resolveAgentSelection(input.agentIds);
  const selectedById = new Map(selection.agents.map((agent) => [agent.id, agent]));
  const phaseAgentIds = new Map<FactoryPhaseId, string[]>(
    FACTORY_PHASES.map((phase) => [phase.id, []]),
  );

  for (const agent of selection.agents) {
    const phaseId = PHASE_BY_AGENT[agent.id];
    if (!phaseId) throw new Error(`Aucune phase d'usine définie pour l'agent : ${agent.id}`);
    phaseAgentIds.get(phaseId)?.push(agent.id);
  }

  const missionIdByAgent = new Map<string, string>();
  for (const agent of selection.agents) {
    missionIdByAgent.set(agent.id, `${input.workflowId}-${agent.id}`);
  }

  const requests: AgentMissionRequest[] = [];
  let previousNonEmptyPhaseMissionIds: string[] = [];

  for (const phase of FACTORY_PHASES) {
    const agentIds = phaseAgentIds.get(phase.id) ?? [];
    if (agentIds.length === 0) continue;

    const currentPhaseMissionIds = agentIds.map((agentId) => {
      const missionId = missionIdByAgent.get(agentId);
      if (!missionId) throw new Error(`Mission non résolue pour l'agent : ${agentId}`);
      return missionId;
    });

    for (const agentId of agentIds) {
      const missionId = missionIdByAgent.get(agentId);
      if (!missionId) throw new Error(`Mission non résolue pour l'agent : ${agentId}`);
      requests.push({
        missionId,
        agentId,
        dependsOn: [...previousNonEmptyPhaseMissionIds],
      });
    }
    previousNonEmptyPhaseMissionIds = currentPhaseMissionIds;
  }

  const missionPlan = createAgentMissionPlan(requests);
  const executionOrder = orderExecutionTasks(
    requests.map((request) => ({
      id: request.missionId,
      dependencyIds: request.dependsOn,
    })),
  );

  const assignments = selection.agents.map((agent) => {
    const missionId = missionIdByAgent.get(agent.id);
    if (!missionId) throw new Error(`Mission non résolue pour l'agent : ${agent.id}`);

    const preparation = prepareSpecialistMission({
      agentId: agent.id,
      missionId,
      projectId,
      contextReferences: [
        `workflow:${input.workflowId}`,
        ...(input.contextReferences ?? []),
      ],
    });

    return preparation.status === "prepared"
      ? {
          agentId: agent.id,
          poleId: agent.poleId,
          phaseId: PHASE_BY_AGENT[agent.id],
          missionId,
          status: preparation.status,
        }
      : {
          agentId: agent.id,
          poleId: agent.poleId,
          phaseId: PHASE_BY_AGENT[agent.id],
          missionId,
          status: preparation.status,
          reason: preparation.reason,
        };
  });

  return {
    contractVersion: 1,
    workflowId: input.workflowId,
    projectId,
    core: "merkora-core",
    status: "planned",
    executionEnabled: false,
    phases: FACTORY_PHASES.map((phase) => {
      const agentIds = phaseAgentIds.get(phase.id) ?? [];
      return {
        ...phase,
        agentIds: [...agentIds],
        missionIds: agentIds.flatMap((agentId) => {
          const missionId = missionIdByAgent.get(agentId);
          return missionId ? [missionId] : [];
        }),
        status: agentIds.length > 0 ? "planned" : "not_selected",
      };
    }),
    poles: AGENT_POLES.map((pole) => {
      const selectedAgentIds = pole.agents
        .filter((agent) => selectedById.has(agent.id))
        .map((agent) => agent.id);
      return {
        poleId: pole.id,
        poleName: pole.name,
        selectedAgentIds,
        selectedCount: selectedAgentIds.length,
        totalAgents: pole.agents.length,
        status: selectedAgentIds.length > 0 ? "selected" : "not_selected",
      };
    }),
    assignments,
    missionPlan,
    executionOrder,
    humanGates: HUMAN_GATES,
    guarantees: [
      "MerKora Core coordonne les missions et conserve l'ordre des pôles.",
      "Chaque phase dépend de toutes les missions de la phase précédente sélectionnée.",
      "Les agents d'une même phase peuvent travailler en parallèle après validation de leurs dépendances.",
      "Les spécialistes sans rôle technique compatible sont signalés; ils ne sont pas forcés dans un autre rôle.",
      "Les autorisations et validations restent à vérifier par les services existants.",
      "Aucun fournisseur, worker, outil, budget, changement de données ou déploiement n'est activé par ce plan.",
    ],
  };
}
