import type { UniversalProjectModel, SolutionFormat } from "./universal-project-model";

export type BlueprintRequirement = {
  id: string;
  sourceNeedId: string;
  statement: string;
  evidence: string[];
  status: "draft";
  priority: "not_defined";
  validationRequired: true;
};

export type BlueprintProcess = {
  id: string;
  title: string;
  status: "current_process_to_confirm";
  sourceDescription: string;
  steps: [];
  triggers: [];
  exceptions: [];
  confirmationRequired: true;
};

export type UniversalProjectBlueprint = {
  title: string;
  status: "discovery_draft";
  requirements: BlueprintRequirement[];
  processes: BlueprintProcess[];
  roles: Array<{
    id: string;
    label: string;
    status: "candidate_to_confirm";
    permissions: [];
  }>;
  dataRequirements: [];
  operatingRules: [];
  scenarios: [];
  acceptanceCriteria: [];
  constraintsToValidate: string[];
  risksToReview: string[];
  solutionOptions: Array<{
    id: string;
    format: SolutionFormat;
    assessment: "not_assessed";
    benefits: [];
    limitations: [];
    requiredEvidence: string[];
  }>;
  recommendedOptionId: null;
  approvalGates: Array<{
    id: string;
    stage: "requirements" | "process" | "roles" | "data" | "rules" | "solution";
    question: string;
    blocksProgression: true;
  }>;
  openQuestions: string[];
  explicitNonAssumptions: string[];
};

const FORMAT_EVIDENCE: Record<SolutionFormat, string[]> = {
  human: ["personnes disponibles", "compétences et charge de travail"],
  organizational: ["responsabilités", "coordination et fonctionnement"],
  documentary: ["documents utiles", "informations à tracer et à partager"],
  physical: ["lieux, équipements et contraintes matérielles"],
  digital: ["appareils", "connexion", "sécurité et maintenance"],
  hybrid: ["articulation entre moyens humains, matériels et numériques"],
};

function unique(values: string[]): string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

/**
 * Produces a discovery-ready project blueprint from the evidence-based model.
 * It deliberately leaves workflow steps, permissions, data structures, rules,
 * scenarios and acceptance criteria empty until the client confirms them.
 */
export function buildUniversalProjectBlueprint(
  model: UniversalProjectModel,
): UniversalProjectBlueprint {
  const requirements: BlueprintRequirement[] = model.needs.map((need, index) => ({
    id: `requirement-${index + 1}-${need.id}`,
    sourceNeedId: need.id,
    statement: `La solution devra permettre de ${need.expectedChange}.`,
    evidence: [...need.evidence],
    status: "draft",
    priority: "not_defined",
    validationRequired: true,
  }));

  const processes: BlueprintProcess[] = model.currentSituation
    ? [{
        id: "current-process-to-confirm",
        title: "Fonctionnement actuel décrit par le client",
        status: "current_process_to_confirm",
        sourceDescription: model.currentSituation,
        steps: [],
        triggers: [],
        exceptions: [],
        confirmationRequired: true,
      }]
    : [];
