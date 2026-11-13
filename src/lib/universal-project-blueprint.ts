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

  const processes: BlueprintProcess[] = model.needs.length && model.sourceDescription
    ? model.needs
        .filter(() => false)
        .map(() => ({
          id: "unused",
          title: "unused",
          status: "current_process_to_confirm" as const,
          sourceDescription: "",
          steps: [] as [],
          triggers: [] as [],
          exceptions: [] as [],
          confirmationRequired: true as const,
        }))
    : [];

  // The model's source description alone is not proof of an existing workflow.
  // A current process is represented only when its source was explicitly captured
  // by the upstream understanding layer and forwarded as a validated field.
  const roles = model.roles.map((role) => ({
    id: role.id,
    label: role.label,
    status: "candidate_to_confirm" as const,
    permissions: [] as [],
  }));

  const solutionOptions = model.solutionDirections.map((option) => ({
    id: `option-${option.format}`,
    format: option.format,
    assessment: "not_assessed" as const,
    benefits: [] as [],
    limitations: [] as [],
    requiredEvidence: FORMAT_EVIDENCE[option.format],
  }));

  const openQuestions = unique([
    ...model.openQuestions,
    "Quelles sont les étapes réellement suivies aujourd'hui, du début jusqu'au résultat ?",
    "Quel événement déclenche le processus et comment sait-on qu'il est terminé ?",
    "Quelles situations exceptionnelles faut-il prévoir et que doit-il se passer dans ces cas ?",
    "Quelles informations sont indispensables, qui les fournit et qui peut les consulter ?",
    "Quelles règles doivent être respectées et qui a autorité pour les modifier ?",
    "Comment mesurerez-vous que le problème est réellement résolu ?",
  ]);

  return {
    title: model.title,
    status: "discovery_draft",
    requirements,
    processes,
    roles,
    dataRequirements: [],
    operatingRules: [],
    scenarios: [],
    acceptanceCriteria: [],
    constraintsToValidate: [...model.constraintsToValidate],
    risksToReview: [...model.risksToReview],
    solutionOptions,
    recommendedOptionId: null,
    approvalGates: [
      { id: "approve-requirements", stage: "requirements", question: "Les besoins et résultats attendus sont-ils exacts et complets ?", blocksProgression: true },
      { id: "approve-process", stage: "process", question: "Le fonctionnement actuel, ses étapes et ses exceptions ont-ils été décrits et confirmés ?", blocksProgression: true },
      { id: "approve-roles", stage: "roles", question: "Les personnes concernées et leurs responsabilités ont-elles été validées ?", blocksProgression: true },
      { id: "approve-data", stage: "data", question: "Les informations nécessaires, leur finalité, leurs accès et leur conservation ont-ils été validés ?", blocksProgression: true },
      { id: "approve-rules", stage: "rules", question: "Les règles métier et les cas particuliers ont-ils été confirmés par le client ?", blocksProgression: true },
      { id: "approve-solution", stage: "solution", question: "Le client a-t-il comparé les options et validé le format de solution ?", blocksProgression: true },
    ],
    openQuestions,
    explicitNonAssumptions: [
      "Aucun secteur, métier ou type d'application n'est imposé par ce modèle.",
      "Aucune étape de processus n'est inventée à partir d'un simple objectif.",
      "Aucun rôle ne reçoit de permission avant validation.",
      "Aucune donnée n'est collectée sans finalité, nécessité et accès définis.",
      "Aucune règle, exception ou condition d'acceptation n'est considérée comme acquise sans confirmation.",
      "Aucune solution n'est classée ni recommandée avant comparaison et validation.",
    ],
  };
}
