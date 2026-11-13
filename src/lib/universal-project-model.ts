import type { UniversalProjectUnderstanding } from "./universal-project-understanding";

export type ProjectNeed = {
  id: string;
  sourceIntentId: string;
  title: string;
  expectedChange: string;
  evidence: string[];
  confidence: "high" | "medium" | "low";
  status: "proposed";
  priority: "to_define";
  confirmationRequired: true;
};

export type ProjectRelationship = {
  fromNeedId: string;
  toNeedId: string;
  kind: "relationship_unknown";
  explanation: string;
  confirmationRequired: true;
};

export type ProjectRole = {
  id: string;
  label: string;
  status: "candidate_to_confirm";
  permissions: [];
};

export type SolutionFormat =
  | "human"
  | "organizational"
  | "documentary"
  | "physical"
  | "digital"
  | "hybrid";

export type UniversalProjectModel = {
  title: string;
  summary: string;
  sourceDescription: string;
  needs: ProjectNeed[];
  relationships: ProjectRelationship[];
  processes: [];
  roles: ProjectRole[];
  operatingRules: [];
  dataEntities: [];
  scenarios: [];
  constraintsToValidate: string[];
  risksToReview: string[];
  solutionDirections: Array<{
    format: SolutionFormat;
    status: "to_explore";
    advantages: [];
    limitations: [];
    fit: "not_assessed";
  }>;
  selectedSolutionFormat: null;
  openQuestions: string[];
  validationCheckpoints: Array<{
    id: string;
    question: string;
    target: "need" | "relationship" | "role" | "solution";
    confirmationRequired: true;
  }>;
  modelingStatus: "initial_draft";
  noUnconfirmedRulesApplied: true;
};

const SOLUTION_FORMATS: SolutionFormat[] = [
  "human",
  "organizational",
  "documentary",
  "physical",
  "digital",
  "hybrid",
];

function unique(values: string[]): string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function slug(value: string): string {
  return value.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("fr")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Turns the first-pass understanding into a cautious project model.
 * Only evidence already present in the understanding is carried forward;
 * workflows, rules, permissions and data structures stay empty until confirmed.
 */
export function buildUniversalProjectModel(
  understanding: UniversalProjectUnderstanding,
): UniversalProjectModel {
  const needs: ProjectNeed[] = understanding.intentGroups.map((group, index) => ({
    id: `need-${index + 1}-${slug(group.id)}`,
    sourceIntentId: group.id,
    title: group.subject,
    expectedChange: group.desiredAction,
    evidence: [...group.evidence],
    confidence: group.confidence,
    status: "proposed",
    priority: "to_define",
    confirmationRequired: true,
  }));

  const relationships: ProjectRelationship[] = [];
  for (let from = 0; from < needs.length; from += 1) {
    for (let to = from + 1; to < needs.length; to += 1) {
      relationships.push({
        fromNeedId: needs[from].id,
        toNeedId: needs[to].id,
        kind: "relationship_unknown",
        explanation: "Le lien entre ces besoins n'est pas établi par la description initiale.",
        confirmationRequired: true,
      });
    }
  }

  const roles: ProjectRole[] = unique(understanding.actors).map((actor, index) => ({
    id: `role-${index + 1}-${slug(actor)}`,
    label: actor,
    status: "candidate_to_confirm",
    permissions: [],
  }));

  const validationCheckpoints: UniversalProjectModel["validationCheckpoints"] = [
    ...needs.map((need) => ({
      id: `validate-${need.id}`,
      question: `Confirmez-vous ce besoin : « ${need.title} » et le résultat attendu « ${need.expectedChange} » ?`,
      target: "need" as const,
      confirmationRequired: true as const,
    })),
    ...(relationships.length > 0 ? [{
      id: "validate-need-relationships",
      question: "Ces besoins font-ils partie d'un même projet ou souhaitez-vous les traiter séparément ?",
      target: "relationship" as const,
      confirmationRequired: true as const,
    }] : []),
    ...(roles.length > 0 ? [{
      id: "validate-project-roles",
      question: "Les personnes et groupes mentionnés sont-ils bien concernés, et quel rôle chacun souhaite-t-il avoir ?",
      target: "role" as const,
      confirmationRequired: true as const,
    }] : []),
    {
      id: "validate-solution-format",
      question: "Avant de choisir un format, souhaitez-vous examiner des réponses humaines, organisationnelles, documentaires, physiques, numériques ou combinées ?",
      target: "solution" as const,
      confirmationRequired: true as const,
    },
  ];

  return {
    title: "Projet à préciser",
    summary: needs.length
      ? `${needs.length} besoin(s) candidat(s) extrait(s) de la description ; leur priorité et leurs relations restent à confirmer.`
      : "La description ne permet pas encore d'identifier un besoin suffisamment précis.",
    sourceDescription: understanding.rawIntent,
    needs,
    relationships,
    processes: [],
    roles,
    operatingRules: [],
    dataEntities: [],
    scenarios: [],
    constraintsToValidate: [...understanding.constraints],
    risksToReview: [...understanding.risks],
    solutionDirections: SOLUTION_FORMATS.map((format) => ({
      format,
      status: "to_explore",
      advantages: [],
      limitations: [],
      fit: "not_assessed",
    })),
    selectedSolutionFormat: null,
    openQuestions: unique(understanding.questions),
    validationCheckpoints,
    modelingStatus: "initial_draft",
    noUnconfirmedRulesApplied: true,
  };
}
