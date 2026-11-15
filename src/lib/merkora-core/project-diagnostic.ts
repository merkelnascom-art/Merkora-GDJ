import type { UnderstandingSession } from "./situation-intake-engine";
import type { NeedDimension } from "./types";

export type ProjectUnderstandingStatus =
  | "user_stated"
  | "observed"
  | "inferred"
  | "hypothesis"
  | "unknown"
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
  sourceQuote: string;
  createdAt: string;
  supersedesId?: string;
}

export interface ProjectUnderstanding {
  id: string;
  projectId: string;
  version: number;
  originalDescription: string;
  items: ProjectUnderstandingItem[];
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
}

export interface DiagnosticAnswer {
  id: string;
  questionId: string;
  dimension: ProjectUnderstandingDimension;
  value: string | string[];
  detail?: string;
  status: "answered" | "unknown" | "not_applicable" | "deferred";
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
  { id: "information", title: "Informations et connaissances", description: "Les données, documents et connaissances déjà mentionnés." },
  { id: "other", title: "Autres éléments", description: "Les éléments importants qui ne correspondent pas encore à une dimension connue." },
];

function normalizeDimension(dimension: NeedDimension): ProjectUnderstandingDimension {
  return DIMENSION_MAP[dimension] ?? (dimension === "unknown" ? "other" : dimension);
}

function normalizeStatus(status: string): ProjectUnderstandingStatus {
  if (status === "validated" || status === "hypothesis" || status === "inferred" || status === "unknown" || status === "rejected" || status === "observed") {
    return status;
  }
  return "user_stated";
}

export function createProjectUnderstanding(session: UnderstandingSession): ProjectUnderstanding {
  const timestamp = now();
  return {
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
    activityVocabulary: "open",
    validationStatus: "in_progress",
    sourceSessionVersion: session.version,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function getActiveUnderstandingItems(dossier: ProjectUnderstanding): ProjectUnderstandingItem[] {
  const superseded = new Set(dossier.items.flatMap((item) => item.supersedesId ? [item.supersedesId] : []));
  return dossier.items.filter((item) => !superseded.has(item.id) && item.status !== "rejected");
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
    sourceMessageId: makeId("correction-message"),
    sourceQuote: value,
    createdAt: now(),
    supersedesId: original.id,
  };

  return {
    ...dossier,
    version: dossier.version + 1,
    items: [...dossier.items, revision],
    validationStatus: "in_progress",
    updatedAt: now(),
  };
}

export function validateUnderstandingItem(dossier: ProjectUnderstanding, itemId: string): ProjectUnderstanding {
  const active = getActiveUnderstandingItems(dossier);
  if (!active.some((item) => item.id === itemId)) throw new Error("Only an active understanding item can be validated.");
  return {
    ...dossier,
    version: dossier.version + 1,
    items: dossier.items.map((item) => item.id === itemId ? { ...item, status: "validated" } : item),
    updatedAt: now(),
  };
}


export function rejectUnderstandingItem(dossier: ProjectUnderstanding, itemId: string): ProjectUnderstanding {
  const active = getActiveUnderstandingItems(dossier);
  if (!active.some((item) => item.id === itemId)) throw new Error("Only an active understanding item can be rejected.");
  return {
    ...dossier,
    version: dossier.version + 1,
    items: dossier.items.map((item) => item.id === itemId ? { ...item, status: "rejected" } : item),
    updatedAt: now(),
  };
}

export function validateProjectUnderstanding(dossier: ProjectUnderstanding): ProjectUnderstanding {
  const activeIds = new Set(getActiveUnderstandingItems(dossier).map((item) => item.id));
  return {
    ...dossier,
    version: dossier.version + 1,
    items: dossier.items.map((item) =>
      activeIds.has(item.id) && item.status === "user_stated"
        ? { ...item, status: "validated" }
        : item
    ),
    validationStatus: "validated",
    updatedAt: now(),
  };
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
  const active = getActiveUnderstandingItems(dossier);
  return active.some((item) => dimensions.includes(item.dimension) && item.status !== "rejected");
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
  const hasPeople = hasDimension(dossier, ["actors"]);
  const hasOperations = hasDimension(dossier, ["operations"]);
  const hasProblem = hasDimension(dossier, ["problem"]);
  const hasImpact = hasDimension(dossier, ["impact"]);
  const hasCauses = hasDimension(dossier, ["causes"]);
  const hasObjectives = hasDimension(dossier, ["objectives", "expected_outcome"]);
  const hasConstraints = hasDimension(dossier, ["constraints"]);
  const hasResources = hasDimension(dossier, ["resources"]);
  const hasSuccess = hasDimension(dossier, ["success_criteria"]);

  const candidates: DiagnosticQuestion[] = [
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

  const eligible = candidates.filter((candidate) => {
    if (wasHandled(session, candidate.id)) return false;
    switch (candidate.id) {
      case "activity-context": return !hasActivity;
      case "current-situation": return !hasSituation;
      case "project-motivation": return !hasMotivation;
      case "expected-outcome": return !hasObjectives;
      case "people-and-roles": return !hasPeople;
      case "operations-and-flow": return !hasOperations;
      case "problem-impact": return hasProblem && !hasImpact;
      case "possible-causes": return hasProblem && !hasCauses;
      case "constraints-and-rules": return !hasConstraints;
      case "available-resources": return !hasResources;
      case "success-criteria": return hasObjectives && !hasSuccess;
      default: return false;
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

  const answerStatus = input.status ?? "answered";
  const answer: DiagnosticAnswer = {
    id: makeId("diagnostic-answer"),
    questionId: currentQuestion.id,
    dimension: currentQuestion.dimension,
    value: Array.isArray(input.value) ? normalizedValues : normalizedValues[0],
    ...(input.detail?.trim() ? { detail: input.detail.trim() } : {}),
    status: answerStatus,
    createdAt: now(),
    version: session.version + 1,
    question: currentQuestion,
  };
  const valueText = normalizedValues.join(" · ");
  const evidenceValue = [valueText, input.detail?.trim()].filter(Boolean).join(" — ");
  const evidence: ProjectUnderstandingItem = {
    id: answer.id,
    dimension: currentQuestion.dimension,
    originalDimension: currentQuestion.dimension,
    value: evidenceValue,
    status: answerStatus === "unknown" || answerStatus === "not_applicable" ? "unknown" : "user_stated",
    source: "diagnostic_answer",
    sourceMessageId: answer.id,
    sourceQuote: evidenceValue,
    createdAt: answer.createdAt,
  };

  return {
    understanding: {
      ...dossier,
      version: dossier.version + 1,
      items: [...dossier.items, evidence],
      updatedAt: now(),
    },
    diagnostic: {
      ...session,
      version: session.version + 1,
      answers: [...session.answers, answer],
      askedQuestionIds: [...session.askedQuestionIds, currentQuestion.id],
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

  const answerStatus = input.status ?? "answered";
  const answerIdNext = makeId("diagnostic-answer-revision");
  const valueText = normalizedValues.join(" · ");
  const evidenceValue = [valueText, input.detail?.trim()].filter(Boolean).join(" — ");
  const answer: DiagnosticAnswer = {
    id: answerIdNext,
    questionId: original.questionId,
    dimension: original.dimension,
    value: Array.isArray(input.value) ? normalizedValues : normalizedValues[0],
    ...(input.detail?.trim() ? { detail: input.detail.trim() } : {}),
    status: answerStatus,
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
    status: answerStatus === "unknown" || answerStatus === "not_applicable" ? "unknown" : "user_stated",
    source: "diagnostic_answer",
    sourceMessageId: answerIdNext,
    sourceQuote: evidenceValue,
    createdAt: answer.createdAt,
    supersedesId: original.id,
  };

  return {
    understanding: { ...dossier, version: dossier.version + 1, items: [...dossier.items, evidence], updatedAt: now() },
    diagnostic: { ...session, version: session.version + 1, answers: [...session.answers, answer], updatedAt: now() },
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

export function markDiagnosticReady(session: DiagnosticSession): DiagnosticSession {
  return { ...session, status: "ready_for_review", version: session.version + 1, updatedAt: now() };
}
