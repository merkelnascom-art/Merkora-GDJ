import { getActiveProductDefinitionAnswers, type ProductDefinitionSession } from "./product-definition";
import { getActiveUnderstandingItems } from "./project-diagnostic";
import type { ProjectUnderstanding } from "./project-diagnostic";
import type { SolutionProposal, SolutionProposalComponent } from "./solution-proposal";

export interface VisualPrototypeModel {
  mode: "digital" | "operational";
  title: string;
  description: string;
  objective: string;
  problem: string;
  profiles: string[];
  components: SolutionProposalComponent[];
  navigation: string[];
  unresolvedPoints: string[];
}

const FAMILY_NAVIGATION: Record<string, string> = {
  nature: "Vue d'ensemble",
  users_roles: "Profils",
  spaces: "Espaces",
  navigation: "Parcours",
  functionalities: "Fonctions",
  interactions: "Interactions",
  data: "Données",
  integrations_equipment: "Ressources",
  security_control: "Contrôles",
  finances: "Finances",
  visual_identity: "Identité",
  operations: "Déroulement",
};

function unique(values: string[]): string[] {
  return values.map((value) => value.trim()).filter(Boolean)
    .filter((value, index, all) => all.findIndex((item) => item.toLocaleLowerCase("fr") === value.toLocaleLowerCase("fr")) === index);
}

export function buildVisualPrototypeModel(
  dossier: ProjectUnderstanding,
  definition: ProductDefinitionSession,
  proposal: SolutionProposal,
): VisualPrototypeModel {
  if (definition.understandingId !== dossier.id || proposal.projectId !== dossier.projectId) {
    throw new Error("The visual prototype sources do not belong to the same project.");
  }

  const evidenceText = [
    dossier.originalDescription,
    ...getActiveUnderstandingItems(dossier).map((item) => item.value),
    proposal.title,
    proposal.description,
  ].join(" ").toLocaleLowerCase("fr");
  const mode = /\b(application|plateforme|logiciel|site web|portail numérique|outil numérique|application mobile|interface web)\b/i.test(evidenceText)
    ? "digital"
    : "operational";

  const answers = getActiveProductDefinitionAnswers(definition)
    .filter((answer) => answer.status === "answered");
  const profiles = unique(answers
    .filter((answer) => answer.familyId === "users_roles")
    .flatMap((answer) => Array.isArray(answer.value) ? answer.value : [answer.value])
    .concat(answers.filter((answer) => answer.familyId === "users_roles" && answer.detail).map((answer) => answer.detail ?? "")));

  const components = proposal.components.filter((component) => component.status === "accepted" || component.status === "modified");
  const navigation = unique([
    "Vue d'ensemble",
    ...components.map((component) => FAMILY_NAVIGATION[component.familyId ?? ""] ?? "Éléments retenus"),
  ]);
  if (mode === "operational" && !navigation.includes("Déroulement")) navigation.push("Déroulement");
  return {
    mode,
    title: proposal.title,
    description: proposal.description,
    objective: proposal.objective,
    problem: proposal.problem,
    profiles,
    components,
    navigation,
    unresolvedPoints: unique(proposal.unresolvedPoints),
  };
}
