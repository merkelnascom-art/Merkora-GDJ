import { rebuildSituationGraph, type UnderstandingSession } from "./situation-intake-engine";
import type { SituationGraph } from "./situation-graph";
import type { NeedDimension } from "./types";
import { enrichSituationGraphWithKnowledge } from "./knowledge/situation-linker";
import type { KnowledgeProposal } from "./knowledge/types";
import { buildProjectKnowledgeMap, getFamilyDiagnosticQuestionSeeds, type ProjectKnowledgeMap } from "./knowledge/universal-project-knowledge";
import { deriveScreen03Evidence, isConversationOnlyStatement } from "./understanding-quality";

export type ProjectUnderstandingStatus =
  | "user_stated"
  | "observed"
  | "inferred"
  | "hypothesis"
  | "unknown"
  | "not_applicable"
  | "conversation_only"
  | "validated"
  | "rejected";

export type ProjectUnderstandingDimension =
  | "project_identity"
  | "activity"
  | "context"
  | "current_situation"
  | "problem"
  | "impact"
  | "causes"
  | "objectives"
  | "expected_outcome"
  | "motivation"
  | "actors"
  | "operations"
  | "resources"
  | "constraints"
  | "imagined_solution"
  | "success_criteria"
  | "jurisdiction"
  | "languages"
  | "information"
  | "other"
  | (string & {});

export interface ProjectUnderstandingItem {
  id: string;
  dimension: ProjectUnderstandingDimension;
  originalDimension: NeedDimension | string;
  value: string;
  status: ProjectUnderstandingStatus;
  source: "conversation" | "user_correction" | "diagnostic_answer";
  sourceMessageId?: string;
  sourceReferenceId?: string;
  sourceQuote: string;
  createdAt: string;
  supersedesId?: string;
}

export interface ProjectContradiction {
  id: string;
  topic: string;
  statementA: string;
  statementB: string;
  question: string;
  confirmationRequired: boolean;
  status: "apparent" | "resolved" | "deferred";
  answerId?: string;
}

export interface ProjectUnderstanding {
  id: string;
  projectId: string;
  version: number;
  originalDescription: string;
  items: ProjectUnderstandingItem[];
  situationGraph: UnderstandingSession["situationGraph"];
  contradictions: ProjectContradiction[];
  unresolvedQuestions: string[];
  privacyConsiderations: string[];
  /** Project-private proposals; older stored dossiers may not contain this field. */
  knowledgeProposals?: KnowledgeProposal[];
  /** Recomputed, non-authoritative links to the universal 20-family knowledge graph. */
  knowledgeMap?: ProjectKnowledgeMap;
  activityVocabulary: "open";
  validationStatus: "in_progress" | "validated";
  sourceSessionVersion: number;
  createdAt: string;
  updatedAt: string;
}

export type DiagnosticAnswerType = "text" | "single_choice" | "multi_choice";

export interface DiagnosticQuestion {
  id: string;
  dimension: ProjectUnderstandingDimension;
  prompt: string;
  purpose: string;
  answerType: DiagnosticAnswerType;
  options?: string[];
  allowDetail: boolean;
  resolvesContradictionId?: string;
}

export interface DiagnosticAnswer {
  id: string;
  questionId: string;
  dimension: ProjectUnderstandingDimension;
  value: string | string[];
  detail?: string;
  status: "answered" | "unknown" | "not_applicable" | "already_provided" | "deferred";
  referencedEvidenceIds?: string[];
  createdAt: string;
  version: number;
  question: DiagnosticQuestion;
  supersedesId?: string;
}

export interface DiagnosticSession {
  id: string;
  projectId: string;
  understandingId: string;
  version: number;
  answers: DiagnosticAnswer[];
  askedQuestionIds: string[];
  deferredQuestionIds: string[];
  status: "in_progress" | "ready_for_review";
  createdAt: string;
  updatedAt: string;
}

export interface DiagnosticAnswerInput {
  value: string | string[];
  detail?: string;
  status?: "answered" | "unknown" | "not_applicable";
}

const now = () => new Date().toISOString();
let sequence = 0;
const makeId = (prefix: string) => `${prefix}-${Date.now()}-${++sequence}`;

const DIMENSION_MAP: Partial<Record<NeedDimension, ProjectUnderstandingDimension>> = {
  project_scope: "project_identity",
  problem: "problem",
  cause: "causes",
  goal: "objectives",
  expected_outcome: "expected_outcome",
  audience: "actors",
  actor: "actors",
  activity: "activity",
  feature: "operations",
  context: "context",
  resource: "resources",
  constraint: "constraints",
  preference: "imagined_solution",
  business_rule: "constraints",
  risk: "constraints",
  experience: "current_situation",
  emotion: "current_situation",
};

export const UNDERSTANDING_SECTIONS: Array<{
  id: ProjectUnderstandingDimension;
  title: string;
  description: string;
}> = [
  { id: "project_identity", title: "Identité et périmètre du projet", description: "Le nom ou le périmètre lorsqu'il a été communiqué." },
  { id: "activity", title: "Activité, idée ou phénomène", description: "Ce qui est au cœur du projet, sans catégorie imposée." },
  { id: "motivation", title: "Motivation du projet", description: "Ce qui déclenche la démarche ou justifie son existence." },
  { id: "context", title: "Contexte et environnement", description: "Le cadre dans lequel la situation existe ou devra exister." },
  { id: "current_situation", title: "Situation actuelle", description: "Ce qui se passe aujourd'hui, ou ce qui n'existe pas encore." },
  { id: "problem", title: "Difficultés et besoins", description: "Les problèmes, besoins ou occasions d'amélioration exprimés." },
  { id: "causes", title: "Causes évoquées", description: "Les explications proposées, qui restent à vérifier." },
  { id: "impact", title: "Conséquences", description: "Les effets observés ou redoutés." },
  { id: "objectives", title: "Objectifs et résultats", description: "Les changements et résultats recherchés." },
  { id: "expected_outcome", title: "Résultats attendus", description: "Les effets concrets que l'utilisateur souhaite obtenir." },
  { id: "actors", title: "Personnes et organisations", description: "Les personnes concernées, leurs rôles et leurs responsabilités." },
  { id: "operations", title: "Fonctionnement et opérations", description: "Les actions, étapes et interactions décrites." },
  { id: "resources", title: "Ressources disponibles", description: "Les moyens humains, matériels, financiers ou informationnels." },
  { id: "constraints", title: "Contraintes et règles", description: "Les limites, obligations, règles et précautions." },
  { id: "imagined_solution", title: "Solution imaginée", description: "Les pistes proposées par l'utilisateur, sans les considérer comme déjà décidées." },
  { id: "success_criteria", title: "Conditions de réussite", description: "Les signes qui permettront de vérifier le résultat." },
  { id: "jurisdiction", title: "Cadre géographique et réglementaire", description: "Les pays, territoires et juridictions explicitement concernés." },
  { id: "languages", title: "Langues et terminologies", description: "Les langues nécessaires au projet et à ses utilisateurs." },
  { id: "information", title: "Informations et connaissances", description: "Les données, documents et connaissances déjà mentionnés." },
  { id: "other", title: "Autres éléments", description: "Les éléments importants qui ne correspondent pas encore à une dimension connue." },
];

function normalizeDimension(dimension: NeedDimension): ProjectUnderstandingDimension {
  return DIMENSION_MAP[dimension] ?? (dimension === "unknown" ? "other" : dimension);
}

function normalizeStatus(status: string): ProjectUnderstandingStatus {
  if (status === "validated" || status === "hypothesis" || status === "inferred" || status === "unknown" || status === "not_applicable" || status === "conversation_only" || status === "rejected" || status === "observed") {
    return status;
  }
  return "user_stated";
}

export function createProjectUnderstanding(session: UnderstandingSession): ProjectUnderstanding {
  const timestamp = now();
  const dossier: ProjectUnderstanding = {
    id: `understanding-${session.id}`,
    projectId: session.conversationId,
    version: 1,
    originalDescription: session.originalDescription,
    items: session.evidence.map((evidence) => ({
      id: evidence.id,
      dimension: normalizeDimension(evidence.dimension),
      originalDimension: evidence.dimension,
      value: evidence.value,
      status: normalizeStatus(evidence.status),
      source: "conversation",
      sourceMessageId: evidence.sourceMessageId,
      sourceQuote: evidence.sourceQuote ?? evidence.value,
      createdAt: evidence.createdAt,
      ...(evidence.supersedesId ? { supersedesId: evidence.supersedesId } : {}),
    })),
    situationGraph: enrichSituationGraphWithKnowledge(session.situationGraph),
    contradictions: session.contradictions.map((item) => {
      const id = `${item.topic}::${item.statementA}::${item.statementB}`;
      return {
        id,
        topic: item.topic,
        statementA: item.statementA,
        statementB: item.statementB,
        question: item.question,
        confirmationRequired: item.confirmationRequired,
        status: session.resolvedContradictionKeys.includes(id) ? "resolved" : session.deferredContradictionKeys.includes(id) ? "deferred" : "apparent",
      };
    }),
    unresolvedQuestions: [
      ...(session.reasoning?.references.filter((reference) => !reference.resolved).map((reference) => `Préciser la référence « ${reference.mention} ».`) ?? []),
    ],
    privacyConsiderations: [...session.privacyConsiderations],
    knowledgeProposals: [],
    activityVocabulary: "open",
    validationStatus: "in_progress",
    sourceSessionVersion: session.version,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  return refreshProjectKnowledgeMap(dossier);
}

export function attachKnowledgeProposalToUnderstanding(
  dossier: ProjectUnderstanding,
  proposal: KnowledgeProposal,
): ProjectUnderstanding {
  if (proposal.projectId !== dossier.projectId) {
    throw new Error("A knowledge proposal can only be attached to its own project.");
  }
  const proposals = dossier.knowledgeProposals ?? [];
  if (proposals.some((item) => item.id === proposal.id)) {
    throw new Error("This knowledge proposal is already attached to the project.");
  }
  if (proposals.some((item) =>
    item.label === proposal.label && item.sourceMessageId === proposal.sourceMessageId,
  )) {
    throw new Error("This term has already been proposed from this source message.");
  }

  return {
    ...dossier,
    version: dossier.version + 1,
    knowledgeProposals: [...proposals, proposal],
    updatedAt: now(),
  };
}

export function getActiveUnderstandingItems(dossier: ProjectUnderstanding): ProjectUnderstandingItem[] {
  const superseded = new Set(dossier.items.flatMap((item) => item.supersedesId ? [item.supersedesId] : []));
  return dossier.items.filter((item) => !superseded.has(item.id) && item.status !== "rejected");
}

export function migrateStoredProjectUnderstanding(dossier: ProjectUnderstanding): ProjectUnderstanding {
  const hasImpersonalIl = /\\bil\\s+y\\s+(?:a|avait|aura|aurait)\\b/i.test(dossier.originalDescription);
  const unresolvedQuestions = hasImpersonalIl
    ? dossier.unresolvedQuestions.filter((item) => !/référence\\s+«\\s*il\\s*»/i.test(item))
    : dossier.unresolvedQuestions;
  const staleGoals = dossier.situationGraph.entities.filter((entity) =>
    entity.kind === "goal" && /\\borganiser\\b.*\\b(tournoi|interface|anniversaire|fête|soiree|mariage|événement)\\b/i.test(entity.label),
  );

  if (staleGoals.length === 0 && unresolvedQuestions.length === dossier.unresolvedQuestions.length) {
    return refreshProjectKnowledgeMap(dossier);
  }

  let situationGraph: SituationGraph = dossier.situationGraph;
  if (staleGoals.length > 0) {
    const sourceMessageId = dossier.items.find((item) => item.sourceMessageId)?.sourceMessageId ?? `legacy-${dossier.id}`;
    const rebuilt = rebuildSituationGraph([{
      id: sourceMessageId,
      conversationId: dossier.projectId,
      role: "visitor",
      content: dossier.originalDescription,
      createdAt: dossier.createdAt,
    }]);
    const staleIds = new Set(staleGoals.map((entity) => entity.id));
    const entitiesByKey = new Map<string, SituationGraph["entities"][number]>();
    for (const entity of [...dossier.situationGraph.entities.filter((item) => !staleIds.has(item.id)), ...rebuilt.entities]) {
      const existing = entitiesByKey.get(entity.key);
      if (!existing) entitiesByKey.set(entity.key, { ...entity, evidence: [...entity.evidence] });
      else {
        const evidence = [...existing.evidence];
        for (const item of entity.evidence) {
          if (!evidence.some((previous) => previous.messageId === item.messageId && previous.quote === item.quote)) evidence.push(item);
        }
        entitiesByKey.set(entity.key, { ...existing, evidence });
      }
    }
    const validIds = new Set([...entitiesByKey.values()].map((entity) => entity.id));
    const relations = new Map<string, SituationGraph["relations"][number]>();
    for (const relation of [...dossier.situationGraph.relations.filter((item) => !staleIds.has(item.fromEntityId) && !staleIds.has(item.toEntityId)), ...rebuilt.relations]) {
      if (validIds.has(relation.fromEntityId) && validIds.has(relation.toEntityId)) relations.set(relation.id, relation);
    }
    situationGraph = {
      entities: [...entitiesByKey.values()],
      relations: [...relations.values()],
      unresolvedRelations: dossier.situationGraph.unresolvedRelations,
    };
  }

  return refreshProjectKnowledgeMap({
    ...dossier,
    situationGraph,
    unresolvedQuestions,
    updatedAt: now(),
  });
}

export function getProjectEvidenceItems(dossier: ProjectUnderstanding): ProjectUnderstandingItem[] {
  return deriveScreen03Evidence(getActiveUnderstandingItems(dossier)).projectItems.filter((item) => item.status !== "unknown" && item.status !== "not_applicable" && item.status !== "conversation_only");
}

function refreshProjectKnowledgeMap(dossier: ProjectUnderstanding): ProjectUnderstanding {
  return { ...dossier, knowledgeMap: buildProjectKnowledgeMap(getProjectEvidenceItems(dossier), dossier.situationGraph) };
}

export function reviseUnderstandingItem(
  dossier: ProjectUnderstanding,
  itemId: string,
  correction: string,
): ProjectUnderstanding {
  const original = dossier.items.find((item) => item.id === itemId);
  const value = correction.trim();
  if (!original) throw new Error("The understanding item does not exist.");
  if (!value) throw new Error("A correction cannot be empty.");

  const revision: ProjectUnderstandingItem = {
    id: makeId("correction"),
    dimension: original.dimension,
    originalDimension: original.originalDimension,
    value,
    status: "validated",
    source: "user_correction",
    sourceReferenceId: makeId("correction-reference"),
    sourceQuote: value,
    createdAt: now(),
    supersedesId: original.id,
  };

  return refreshProjectKnowledgeMap({
    ...dossier,
    version: dossier.version + 1,
    items: [...dossier.items, revision],
    validationStatus: "in_progress",
    updatedAt: now(),
  });
}

export function validateUnderstandingItem(dossier: ProjectUnderstanding, itemId: string): ProjectUnderstanding {
  const active = getActiveUnderstandingItems(dossier);
  if (!active.some((item) => item.id === itemId)) throw new Error("Only an active understanding item can be validated.");
  return refreshProjectKnowledgeMap({
    ...dossier,
    version: dossier.version + 1,
    items: dossier.items.map((item) => item.id === itemId ? { ...item, status: "validated" } : item),
    updatedAt: now(),
  });
}


export function rejectUnderstandingItem(dossier: ProjectUnderstanding, itemId: string): ProjectUnderstanding {
  const active = getActiveUnderstandingItems(dossier);
  if (!active.some((item) => item.id === itemId)) throw new Error("Only an active understanding item can be rejected.");
  return refreshProjectKnowledgeMap({
    ...dossier,
    version: dossier.version + 1,
    items: dossier.items.map((item) => item.id === itemId ? { ...item, status: "rejected" } : item),
    updatedAt: now(),
  });
}

export function validateProjectUnderstanding(dossier: ProjectUnderstanding): ProjectUnderstanding {
  const activeIds = new Set(getActiveUnderstandingItems(dossier).map((item) => item.id));
  return refreshProjectKnowledgeMap({
    ...dossier,
    version: dossier.version + 1,
    items: dossier.items.map((item) =>
      activeIds.has(item.id) && item.status === "user_stated"
        ? { ...item, status: "validated" }
        : item
    ),
    validationStatus: "validated",
    updatedAt: now(),
  });
}

export function createDiagnosticSession(dossier: ProjectUnderstanding): DiagnosticSession {
  const timestamp = now();
  return {
    id: makeId("diagnostic"),
    projectId: dossier.projectId,
    understandingId: dossier.id,
    version: 1,
    answers: [],
    askedQuestionIds: [],
    deferredQuestionIds: [],
    status: "in_progress",
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

function hasDimension(dossier: ProjectUnderstanding, dimensions: ProjectUnderstandingDimension[]): boolean {
  return getProjectEvidenceItems(dossier).some((item) => dimensions.includes(item.dimension));
}

function wasHandled(session: DiagnosticSession, id: string): boolean {
  return session.askedQuestionIds.includes(id) || session.deferredQuestionIds.includes(id);
}

function question(
  id: string,
  dimension: ProjectUnderstandingDimension,
  prompt: string,
  purpose: string,
  answerType: DiagnosticAnswerType = "text",
  options?: string[],
): DiagnosticQuestion {
  return { id, dimension, prompt, purpose, answerType, ...(options ? { options } : {}), allowDetail: answerType !== "text" };
}

/**
 * Selects one useful next question from the project's missing information.
 * The vocabulary is intentionally open: domains and professions are never
 * used as a mandatory enum or as a gate to the diagnostic.
 */
export function getNextDiagnosticQuestion(
  dossier: ProjectUnderstanding,
  session: DiagnosticSession,
): DiagnosticQuestion | null {
  const hasActivity = hasDimension(dossier, ["activity"]);
  const hasSituation = hasDimension(dossier, ["context", "current_situation", "operations"]);
  const hasMotivation = hasDimension(dossier, ["problem", "objectives", "motivation"]);
  const projectEvidence = getProjectEvidenceItems(dossier);
  const motivationText = projectEvidence.filter((item) => item.dimension === "motivation").map((item) => item.value).join(" ");
  const motivationRequiresProblemDetail = /résoudre une difficulté|résoudre un problème/i.test(motivationText);
  const hasPeople = hasDimension(dossier, ["actors"]);
  const hasOperations = hasDimension(dossier, ["operations"]);
  const hasProblem = hasDimension(dossier, ["problem"]);
  const hasImpact = hasDimension(dossier, ["impact"]);
  const hasCauses = hasDimension(dossier, ["causes"]);
  const hasObjectives = hasDimension(dossier, ["objectives", "expected_outcome"]);
  const hasConstraints = hasDimension(dossier, ["constraints"]);
  const hasResources = hasDimension(dossier, ["resources"]);
  const hasSuccess = hasDimension(dossier, ["success_criteria"]);
  const hasJurisdiction = hasDimension(dossier, ["jurisdiction"]);
  const hasLanguages = hasDimension(dossier, ["languages"]);
  const activeText = [dossier.originalDescription, ...projectEvidence.map((item) => item.value)].join("\n");
  const regulatorySignals = /\b(réglement\w*|juridiction\w*|loi\w*|norme\w*|autorisation\w*|licence\w*|données personnelles|confidentialité|fiscal\w*|douane\w*|conformité|certification)\b/i.test(activeText);
  const multilingualSignals = /\b(multilingue|plusieurs langues|traduction|langues? différentes)\b/i.test(activeText);

  const unresolvedContradiction = dossier.contradictions.find((item) => {
    const questionId = `resolve-contradiction-${item.id}`;
    return item.status !== "resolved" && !wasHandled(session, questionId);
  });
  if (unresolvedContradiction) {
    const clarification = question(
      `resolve-contradiction-${unresolvedContradiction.id}`,
      "constraints",
      unresolvedContradiction.question,
      `Deux indications semblent incompatibles au sujet de « ${unresolvedContradiction.topic} ». Précise le contexte ou la règle correcte ; MerKora ne choisira pas à ta place.`,
      "single_choice",
      ["La première indication est correcte", "La deuxième indication est correcte", "Les deux s'appliquent dans des contextes différents", "Aucune des deux n'est exacte", "Je ne sais pas encore"],
    );
    clarification.resolvesContradictionId = unresolvedContradiction.id;
    return clarification;
  }

  const unresolvedReferenceIndex = dossier.unresolvedQuestions.findIndex((item, index) => !wasHandled(session, `unresolved-reference-${index}`));
  if (unresolvedReferenceIndex >= 0) {
    const unresolvedReference = dossier.unresolvedQuestions[unresolvedReferenceIndex];
    const prompt = unresolvedReference.startsWith("Préciser")
      ? "Peux-tu " + unresolvedReference.charAt(0).toLocaleLowerCase("fr") + unresolvedReference.slice(1)
      : unresolvedReference;
    return question(
      `unresolved-reference-${unresolvedReferenceIndex}`,
      "other",
      prompt,
      "Une référence de ton récit n'a pas encore d'antécédent suffisamment clair. Je préfère te demander plutôt que de deviner.",
    );
  }

  const baseCandidates: DiagnosticQuestion[] = [
    question(
      "activity-context",
      "activity",
      "Quelle activité, idée, situation ou quel phénomène est au cœur de ce projet ?",
      "Comprendre précisément ce dont il est question, sans te demander de choisir un secteur ou un métier.",
    ),
    question(
      "current-situation",
      "current_situation",
      "Comment cette activité ou cette situation fonctionne-t-elle aujourd'hui ? Si elle n'existe pas encore, comment l'imagines-tu ?",
      "Distinguer la réalité actuelle d'un projet nouveau ou encore expérimental.",
    ),
    question(
      "project-motivation",
      "motivation",
      "Qu'est-ce qui motive principalement ce projet ?",
      "Comprendre le déclencheur avant de supposer qu'il s'agit nécessairement d'un problème.",
      "single_choice",
      ["Résoudre une difficulté", "Atteindre un objectif", "Créer quelque chose de nouveau", "Améliorer une situation existante", "Explorer ou étudier une possibilité", "Anticiper un besoin", "Autre"],
    ),
    question(
      "problem-description",
      "problem",
      "Quelle difficulté précise souhaites-tu résoudre ? Décris ce qui se passe et qui est concerné.",
      "Tu as indiqué que le projet vise à résoudre une difficulté ; il faut comprendre cette difficulté avant d'en étudier les causes.",
    ),
    question(
      "expected-outcome",
      "expected_outcome",
      "Quel changement ou résultat concret souhaites-tu obtenir ?",
      "Définir le résultat recherché avec tes propres mots, sans imposer une forme de solution.",
    ),
    question(
      "people-and-roles",
      "actors",
      "Quelles personnes, organisations ou groupes sont concernés, et quel rôle jouent-ils ?",
      "Identifier les acteurs réels et leurs responsabilités, sans imposer une liste de rôles prédéfinis.",
    ),
    question(
      "operations-and-flow",
      "operations",
      "Quelles sont les principales actions ou étapes de cette activité, depuis son début jusqu'au résultat ?",
      "Comprendre le fonctionnement réel ou imaginé, étape par étape.",
    ),
    question(
      "problem-impact",
      "impact",
      "Quelles conséquences cette difficulté produit-elle sur l'activité, les personnes ou les résultats ?",
      "Comprendre l'importance du problème avant d'évaluer les solutions.",
    ),
    question(
      "possible-causes",
      "causes",
      "À ton avis, qu'est-ce qui pourrait expliquer cette situation ? Tu peux aussi dire que tu ne sais pas encore.",
      "Recueillir des pistes de causes sans les présenter comme des faits établis.",
    ),
    question(
      "constraints-and-rules",
      "constraints",
      "Quelles limites, règles ou obligations devons-nous prendre en compte ?",
      "Repérer les conditions qui pourraient changer les choix de conception.",
      "multi_choice",
      ["Budget ou moyens disponibles", "Temps ou échéances", "Lieu ou environnement", "Matériel ou équipements", "Accès ou connexion", "Règles ou autorisations", "Confidentialité ou sécurité", "Aucune contrainte identifiée", "Je ne sais pas encore", "Autre"],
    ),
    question(
      "jurisdiction-context",
      "jurisdiction",
      "Dans quels pays, territoires ou cadres juridiques ce projet devra-t-il fonctionner ? Si plusieurs cadres s'appliquent, indique-les.",
      "Les obligations locales peuvent dépendre du pays, du territoire et de la juridiction concernés.",
    ),
    question(
      "language-context",
      "languages",
      "Quelles langues doivent être comprises ou utilisées dans ce projet ?",
      "Préserver les langues, les variantes locales et les terminologies nécessaires.",
    ),
    question(
      "available-resources",
      "resources",
      "Quels moyens sont déjà disponibles pour ce projet : personnes, équipements, documents, données, lieux, outils ou autres ressources ?",
      "Éviter de proposer une solution qui ignore les ressources déjà présentes.",
    ),
    question(
      "success-criteria",
      "success_criteria",
      "À quoi reconnaîtras-tu concrètement que ce projet a réussi ?",
      "Définir un résultat vérifiable plutôt qu'une simple impression de réussite.",
    ),
  ];

  const knowledgeMap = dossier.knowledgeMap ?? buildProjectKnowledgeMap(projectEvidence, dossier.situationGraph);
  const familyQuestionSeeds = getFamilyDiagnosticQuestionSeeds(knowledgeMap.primaryFamilyId);
  const familyQuestions = familyQuestionSeeds.map((seed) =>
    question(`family-context-${knowledgeMap.primaryFamilyId}-${seed.id}`, seed.dimension, seed.prompt, seed.purpose),
  );
  const familyClarification = question(
    "family-domain-clarification",
    "context",
    "Plusieurs domaines semblent concernés. Peux-tu préciser quelles activités ou parties du projet sont réellement au cœur de ta demande ?",
    "MerKora garde plusieurs rattachements possibles tant que le périmètre n'est pas clarifié ; tu n'as pas à choisir une famille prédéfinie.",
  );
  const candidates: DiagnosticQuestion[] = [
    ...baseCandidates.slice(0, 7),
    ...(knowledgeMap.needsFamilyClarification ? [familyClarification] : familyQuestions),
    ...baseCandidates.slice(7),
  ];

  const eligible = candidates.filter((candidate) => {
    if (wasHandled(session, candidate.id)) return false;
    switch (candidate.id) {
      case "family-domain-clarification": return knowledgeMap.needsFamilyClarification;
      case "activity-context": return !hasActivity;
      case "current-situation": return !hasSituation;
      case "project-motivation": return !hasMotivation;
      case "problem-description": return motivationRequiresProblemDetail && !hasProblem;
      case "expected-outcome": return !hasObjectives;
      case "people-and-roles": return !hasPeople;
      case "operations-and-flow": return !hasOperations;
      case "problem-impact": return hasProblem && !hasImpact;
      case "possible-causes": return hasProblem && !hasCauses;
      case "constraints-and-rules": return !hasConstraints;
      case "available-resources": return !hasResources;
      case "success-criteria": return hasObjectives && !hasSuccess;
      case "jurisdiction-context": return regulatorySignals && !hasJurisdiction;
      case "language-context": return multilingualSignals && !hasLanguages;
      default: return candidate.id.startsWith("family-context-") && Boolean(knowledgeMap.primaryFamilyId) && hasActivity && hasSituation;
    }
  });

  return eligible[0] ?? null;
}

export function recordDiagnosticAnswer(
  dossier: ProjectUnderstanding,
  session: DiagnosticSession,
  currentQuestion: DiagnosticQuestion,
  input: DiagnosticAnswerInput,
): { understanding: ProjectUnderstanding; diagnostic: DiagnosticSession } {
  if (wasHandled(session, currentQuestion.id)) throw new Error("This diagnostic question has already been handled.");
  const values = Array.isArray(input.value) ? input.value : [input.value];
  const normalizedValues = values.map((value) => value.trim()).filter(Boolean);
  if (!normalizedValues.length) throw new Error("A diagnostic answer cannot be empty.");

  const valueText = normalizedValues.join(" · ");
  const requestedStatus = input.status ?? "answered";
  const isUnknown = requestedStatus === "unknown" || (normalizedValues.length === 1 && /^je ne sais pas encore$/i.test(normalizedValues[0]));
  const isAlreadyProvided = requestedStatus === "answered" && isConversationOnlyStatement(valueText);
  const answerStatus = isUnknown ? "unknown" : isAlreadyProvided ? "already_provided" : requestedStatus;
  const referencedEvidenceIds = isAlreadyProvided
    ? getProjectEvidenceItems(dossier).filter((item) => item.dimension === currentQuestion.dimension).map((item) => item.id)
    : [];
  const answer: DiagnosticAnswer = {
    id: makeId("diagnostic-answer"),
    questionId: currentQuestion.id,
    dimension: currentQuestion.dimension,
    value: Array.isArray(input.value) ? normalizedValues : normalizedValues[0],
    ...(input.detail?.trim() ? { detail: input.detail.trim() } : {}),
    status: answerStatus,
    ...(referencedEvidenceIds.length ? { referencedEvidenceIds } : {}),
    createdAt: now(),
    version: session.version + 1,
    question: currentQuestion,
    ...(getActiveDiagnosticAnswers(session).find((previous) => previous.questionId === currentQuestion.id) ? { supersedesId: getActiveDiagnosticAnswers(session).find((previous) => previous.questionId === currentQuestion.id)?.id } : {}),
  };
  const evidenceValue = [valueText, input.detail?.trim()].filter(Boolean).join(" — ");
  const evidence: ProjectUnderstandingItem = {
    id: answer.id,
    dimension: currentQuestion.dimension,
    originalDimension: currentQuestion.dimension,
    value: evidenceValue,
    status: isAlreadyProvided ? "conversation_only" : answerStatus === "unknown" ? "unknown" : answerStatus === "not_applicable" ? "not_applicable" : "user_stated",
    source: "diagnostic_answer",
    sourceReferenceId: answer.id,
    sourceQuote: evidenceValue,
    createdAt: answer.createdAt,
    ...(answer.supersedesId ? { supersedesId: answer.supersedesId } : {}),
  };
  const unresolvedAnswer = answerStatus === "unknown" || answerStatus === "not_applicable" || answerStatus === "already_provided";
  const contradictions = currentQuestion.resolvesContradictionId
    ? dossier.contradictions.map((item) => item.id === currentQuestion.resolvesContradictionId
      ? { ...item, status: unresolvedAnswer ? "deferred" as const : "resolved" as const, answerId: answer.id }
      : item)
    : dossier.contradictions;

  return {
    understanding: refreshProjectKnowledgeMap({
      ...dossier,
      version: dossier.version + 1,
      items: [...dossier.items, evidence],
      contradictions,
      updatedAt: now(),
    }),
    diagnostic: {
      ...session,
      version: session.version + 1,
      answers: [...session.answers, answer],
      askedQuestionIds: isUnknown ? session.askedQuestionIds : [...session.askedQuestionIds, currentQuestion.id],
      deferredQuestionIds: isUnknown ? [...new Set([...session.deferredQuestionIds, currentQuestion.id])] : session.deferredQuestionIds,
      updatedAt: now(),
    },
  };
}


export function getActiveDiagnosticAnswers(session: DiagnosticSession): DiagnosticAnswer[] {
  const superseded = new Set(session.answers.flatMap((answer) => answer.supersedesId ? [answer.supersedesId] : []));
  return session.answers.filter((answer) => !superseded.has(answer.id));
}

export function reviseDiagnosticAnswer(
  dossier: ProjectUnderstanding,
  session: DiagnosticSession,
  answerId: string,
  input: DiagnosticAnswerInput,
): { understanding: ProjectUnderstanding; diagnostic: DiagnosticSession } {
  const original = getActiveDiagnosticAnswers(session).find((answer) => answer.id === answerId);
  if (!original) throw new Error("The diagnostic answer does not exist or has already been revised.");
  const values = Array.isArray(input.value) ? input.value : [input.value];
  const normalizedValues = values.map((value) => value.trim()).filter(Boolean);
  if (!normalizedValues.length) throw new Error("A diagnostic answer cannot be empty.");

  const valueText = normalizedValues.join(" · ");
  const requestedStatus = input.status ?? "answered";
  const isUnknown = requestedStatus === "unknown" || (normalizedValues.length === 1 && /^je ne sais pas encore$/i.test(normalizedValues[0]));
  const isAlreadyProvided = requestedStatus === "answered" && isConversationOnlyStatement(valueText);
  const answerStatus = isUnknown ? "unknown" : isAlreadyProvided ? "already_provided" : requestedStatus;
  const referencedEvidenceIds = isAlreadyProvided
    ? getProjectEvidenceItems(dossier).filter((item) => item.dimension === original.dimension).map((item) => item.id)
    : [];
  const answerIdNext = makeId("diagnostic-answer-revision");
  const evidenceValue = [valueText, input.detail?.trim()].filter(Boolean).join(" — ");
  const answer: DiagnosticAnswer = {
    id: answerIdNext,
    questionId: original.questionId,
    dimension: original.dimension,
    value: Array.isArray(input.value) ? normalizedValues : normalizedValues[0],
    ...(input.detail?.trim() ? { detail: input.detail.trim() } : {}),
    status: answerStatus,
    ...(referencedEvidenceIds.length ? { referencedEvidenceIds } : {}),
    createdAt: now(),
    version: session.version + 1,
    question: original.question,
    supersedesId: original.id,
  };
  const evidence: ProjectUnderstandingItem = {
    id: answerIdNext,
    dimension: original.dimension,
    originalDimension: original.dimension,
    value: evidenceValue,
    status: isAlreadyProvided ? "conversation_only" : answerStatus === "unknown" ? "unknown" : answerStatus === "not_applicable" ? "not_applicable" : "user_stated",
    source: "diagnostic_answer",
    sourceReferenceId: answerIdNext,
    sourceQuote: evidenceValue,
    createdAt: answer.createdAt,
    supersedesId: original.id,
  };
  const unresolvedAnswer = answerStatus === "unknown" || answerStatus === "not_applicable" || answerStatus === "already_provided";
  const contradictions = original.question.resolvesContradictionId
    ? dossier.contradictions.map((item) => item.id === original.question.resolvesContradictionId
      ? { ...item, status: unresolvedAnswer ? "deferred" as const : "resolved" as const, answerId: answer.id }
      : item)
    : dossier.contradictions;
  const nextAsked = answerStatus === "unknown"
    ? session.askedQuestionIds.filter((id) => id !== original.questionId)
    : [...new Set([...session.askedQuestionIds, original.questionId])];
  const nextDeferred = answerStatus === "unknown"
    ? [...new Set([...session.deferredQuestionIds, original.questionId])]
    : session.deferredQuestionIds.filter((id) => id !== original.questionId);

  return {
    understanding: refreshProjectKnowledgeMap({ ...dossier, version: dossier.version + 1, items: [...dossier.items, evidence], contradictions, updatedAt: now() }),
    diagnostic: { ...session, version: session.version + 1, answers: [...session.answers, answer], askedQuestionIds: nextAsked, deferredQuestionIds: nextDeferred, updatedAt: now() },
  };
}


export function deferDiagnosticQuestion(
  session: DiagnosticSession,
  currentQuestion: DiagnosticQuestion,
): DiagnosticSession {
  if (wasHandled(session, currentQuestion.id)) return session;
  return {
    ...session,
    version: session.version + 1,
    deferredQuestionIds: [...session.deferredQuestionIds, currentQuestion.id],
    updatedAt: now(),
  };
}


export function resumeDeferredDiagnosticQuestions(session: DiagnosticSession): DiagnosticSession {
  if (session.deferredQuestionIds.length === 0) return session;
  return {
    ...session,
    deferredQuestionIds: [],
    status: "in_progress",
    version: session.version + 1,
    updatedAt: now(),
  };
}

export function markDiagnosticReady(session: DiagnosticSession): DiagnosticSession {
  return { ...session, status: "ready_for_review", version: session.version + 1, updatedAt: now() };
}
