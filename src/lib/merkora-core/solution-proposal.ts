import {
  buildHybridDomainComposition,
  getBaselineModuleLabel,
  getDomainCatalog,
  getProductType,
  type HybridDomainComposition,
  type SolutionProductProfile,
} from "./solution-catalog";
import {
  getActiveUnderstandingItems,
  type ProjectUnderstanding,
} from "./project-diagnostic";
import {
  getActiveProductDefinitionAnswers,
  type ProductDefinitionSession,
} from "./product-definition";

export type SolutionComponentStatus = "suggested" | "accepted" | "modified" | "rejected";

export interface SolutionProposalComponent {
  id: string;
  title: string;
  description: string;
  status: SolutionComponentStatus;
  source: "validated_definition" | "project_evidence" | "knowledge_suggestion" | "catalog_suggestion";
  familyId?: string;
  sourceIds: string[];
  domainIds?: string[];
}

export interface SolutionProposalArchitecture {
  id: string;
  title: string;
  description: string;
  recommended: boolean;
  tradeOffs: string[];
}

export interface SolutionProposal {
  id: string;
  projectId: string;
  title: string;
  description: string;
  problem: string;
  objective: string;
  operatingPrinciple: string;
  architectures: SolutionProposalArchitecture[];
  components: SolutionProposalComponent[];
  coherenceNotes: string[];
  unresolvedPoints: string[];
  productProfile?: SolutionProductProfile;
  domainComposition?: HybridDomainComposition;
  version: number;
  updatedAt: string;
}

const now = () => new Date().toISOString();

function firstEvidence(
  items: ReturnType<typeof getActiveUnderstandingItems>,
  dimensions: string[],
): string {
  return items.find((item) => dimensions.includes(item.dimension))?.value ?? "";
}

function makeComponentId(sourceId: string, index: number): string {
  return `component-${sourceId.replace(/[^a-z0-9-]/gi, "-").toLowerCase()}-${index + 1}`;
}

function addCatalogComponent(
  components: SolutionProposalComponent[],
  knownTitles: Set<string>,
  id: string,
  title: string,
  description: string,
  domainIds: string[] = [],
): void {
  const normalized = title.toLocaleLowerCase("fr");
  if (knownTitles.has(normalized)) return;
  components.push({
    id: makeComponentId(id, components.length),
    title,
    description,
    status: "suggested",
    source: "catalog_suggestion",
    sourceIds: [`catalog:${id}`],
    domainIds,
  });
  knownTitles.add(normalized);
}

export function buildSolutionProposal(
  dossier: ProjectUnderstanding,
  definition: ProductDefinitionSession,
  profile?: SolutionProductProfile,
): SolutionProposal {
  if (definition.understandingId !== dossier.id) {
    throw new Error("The product definition does not belong to this project dossier.");
  }

  const evidence = getActiveUnderstandingItems(dossier);
  const answers = getActiveProductDefinitionAnswers(definition);
  const components: SolutionProposalComponent[] = [];

  for (const answer of answers) {
    if (answer.status !== "answered") continue;
    const values = Array.isArray(answer.value) ? answer.value : [answer.value];
    values.forEach((value, index) => {
      const title = value.trim();
      if (!title) return;
      components.push({
        id: makeComponentId(answer.id, index),
        title,
        description: answer.question.purpose,
        status: "suggested",
        source: "validated_definition",
        familyId: answer.familyId,
        sourceIds: [answer.id, ...answer.question.evidenceIds],
      });
    });
  }

  const knownTitles = new Set(components.map((component) => component.title.toLocaleLowerCase("fr")));
  const knowledgeSuggestions = dossier.knowledgeMap?.solutionCandidates ?? [];
  knowledgeSuggestions.forEach((suggestion, index) => {
    const title = suggestion.labelFr?.trim();
    if (!title || knownTitles.has(title.toLocaleLowerCase("fr"))) return;
    components.push({
      id: makeComponentId(`knowledge-${index}`, index),
      title,
      description: "Piste issue du référentiel métier ; à examiner avant toute validation.",
      status: "suggested",
      source: "knowledge_suggestion",
      sourceIds: [],
    });
    knownTitles.add(title.toLocaleLowerCase("fr"));
  });

  let domainComposition: HybridDomainComposition | undefined;
  const productType = profile ? getProductType(profile.productTypeId) : undefined;
  if (profile && productType) {
    productType.baselineModules.forEach((moduleId) => {
      addCatalogComponent(
        components,
        knownTitles,
        `product-${moduleId}`,
        getBaselineModuleLabel(moduleId),
        `Élément de base associé au type « ${productType.label} ». À examiner et à retenir uniquement s'il correspond au projet.`,
      );
    });

    domainComposition = buildHybridDomainComposition(profile.domainIds);
    domainComposition.modules.forEach((module) => {
      addCatalogComponent(
        components,
        knownTitles,
        module.id,
        module.label,
        module.description,
        module.domainIds,
      );
    });
  }

  const activity = firstEvidence(evidence, ["activity", "project_identity"]);
  const problem = firstEvidence(evidence, ["problem", "causes", "current_situation"]);
  const objective = firstEvidence(evidence, ["objectives", "expected_outcome", "success_criteria"]);
  const context = firstEvidence(evidence, ["context", "operations"]);
  const projectLabel = profile?.projectName.trim()
    || activity
    || dossier.originalDescription.trim().slice(0, 90)
    || "votre projet";
  const title = /^je veux\b/i.test(projectLabel)
    ? projectLabel.replace(/^je veux\s+/i, "").replace(/[.!?]+$/, "")
    : projectLabel;

  const unresolvedPoints = [
    ...answers.filter((answer) => answer.status === "unknown").map((answer) => answer.question.prompt),
    ...(dossier.unresolvedQuestions ?? []),
    ...(dossier.contradictions ?? [])
      .filter((item) => item.status !== "resolved")
      .map((item) => item.question),
  ].filter((value, index, all) => Boolean(value) && all.indexOf(value) === index);

  const coherenceNotes: string[] = [];
  if (components.length === 0) {
    coherenceNotes.push("Aucune fonction ou composante n'a encore été confirmée dans la définition. La proposition reste à compléter.");
  }
  if (!problem) coherenceNotes.push("Le problème principal reste à préciser avant de figer le périmètre.");
  if (!objective) coherenceNotes.push("Le résultat attendu mérite encore une confirmation.");
  if (profile && profile.domainIds.length > 1) {
    coherenceNotes.push("Plusieurs domaines ont été combinés. Les dépendances entre modules et les règles de partage seront vérifiées avant la maquette.");
  }
  if (profile && profile.domainIds.length === 0) {
    coherenceNotes.push("Aucun domaine métier n'a encore été choisi. La proposition reste volontairement générique.");
  }
  if (unresolvedPoints.length > 0) {
    coherenceNotes.push("Certains points restent inconnus ou contradictoires : ils ne sont pas considérés comme des décisions.");
  }

  const digitalTypes = new Set([
    "showcase_website", "web_platform", "mobile_app", "web_application",
    "booking_solution", "ecommerce", "game", "generator", "architecture_workspace",
  ]);
  const isDigital = profile
    ? digitalTypes.has(profile.productTypeId)
    : /application|plateforme|logiciel|site web|portail|numérique|mobile/i.test(
      [dossier.originalDescription, ...evidence.map((item) => item.value)].join(" "),
    );
  const domainNames = (profile?.domainIds ?? [])
    .map((id) => getDomainCatalog(id)?.label)
    .filter((value): value is string => Boolean(value));
  const productLabel = productType?.label;

  return {
    id: `solution-${dossier.projectId}`,
    projectId: dossier.projectId,
    title: title.charAt(0).toLocaleUpperCase("fr") + title.slice(1),
    description: objective
      ? `Une solution conçue pour ${objective.charAt(0).toLocaleLowerCase("fr") + objective.slice(1)}.`
      : `Une proposition construite à partir de l'activité exprimée : ${projectLabel}.`,
    problem: problem || "À préciser avec le client.",
    objective: objective || "À confirmer avec le client.",
    operatingPrinciple: [
      productLabel ? `Type de réalisation : ${productLabel}.` : "",
      domainNames.length ? `Domaines couverts : ${domainNames.join(" + ")}.` : "",
      context ? `Contexte de fonctionnement : ${context}.` : "",
      profile ? `Navigation envisagée : ${profile.navigationStyle.replace(/_/g, " ")} ; identité visuelle : ${profile.brandingMode.replace(/_/g, " ")}.` : "",
    ].filter(Boolean).join(" ") || "Le fonctionnement détaillé sera précisé à partir des composantes que le client choisira de retenir.",
    architectures: [{
      id: "recommended-architecture",
      title: productLabel
        ? `Architecture adaptée — ${productLabel}`
        : isDigital ? "Architecture numérique à préciser" : "Solution organisée autour de l'activité",
      description: isDigital
        ? "Le type de produit et les domaines choisis déterminent les espaces, la navigation et les fonctions. Les modules métier sont composés sans confondre leurs règles."
        : "Une solution structurée autour des opérations, des personnes et des moyens explicitement décrits, sans présumer qu'une application est nécessaire.",
      recommended: true,
      tradeOffs: [
        productType ? `Structure de départ propre à « ${productType.label} ».` : "Structure construite à partir des informations confirmées.",
        domainComposition?.isHybrid ? "Les domaines sont assemblés dans une architecture commune, avec leurs règles et responsabilités séparées." : "Les fonctions restent rattachées au domaine choisi.",
        "L'espace du propriétaire administrateur est séparé des espaces des utilisateurs finaux.",
      ],
    }],
    components,
    coherenceNotes,
    unresolvedPoints,
    productProfile: profile,
    domainComposition,
    version: 1,
    updatedAt: now(),
  };
}

function updateComponent(
  proposal: SolutionProposal,
  componentId: string,
  update: (component: SolutionProposalComponent) => SolutionProposalComponent,
): SolutionProposal {
  let found = false;
  const components = proposal.components.map((component) => {
    if (component.id !== componentId) return component;
    found = true;
    return update(component);
  });
  if (!found) throw new Error("The solution component does not exist.");
  return { ...proposal, components, version: proposal.version + 1, updatedAt: now() };
}

export function acceptSolutionComponent(proposal: SolutionProposal, componentId: string): SolutionProposal {
  return updateComponent(proposal, componentId, (component) => ({ ...component, status: "accepted" }));
}

export function rejectSolutionComponent(proposal: SolutionProposal, componentId: string): SolutionProposal {
  return updateComponent(proposal, componentId, (component) => ({ ...component, status: "rejected" }));
}

export function reviseSolutionComponent(
  proposal: SolutionProposal,
  componentId: string,
  title: string,
): SolutionProposal {
  return updateComponent(proposal, componentId, (component) => ({
    ...component,
    title,
    status: "modified",
  }));
}
