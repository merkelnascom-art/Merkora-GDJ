import { analyzeUniversalProjectIntent } from "../universal-project-understanding";
import { selectNextQuestion } from "./question-planner";
import { selectNextDiscoveryQuestion, type DiscoveryContradiction } from "../universal-project-discovery";
import type {
  ConversationMessage,
  NeedDimension,
  NeedEvidence,
  QuestionCandidate,
  ValidationDecision,
} from "./types";

export type UnderstandingStage = "clarification" | "summary_validation" | "complete";

export interface UnderstandingSession {
  id: string;
  conversationId: string;
  originalDescription: string;
  messages: ConversationMessage[];
  evidence: NeedEvidence[];
  validations: ValidationDecision[];
  askedQuestionIds: string[];
  deferredDimensions: NeedDimension[];
  stage: UnderstandingStage;
  pendingQuestion: QuestionCandidate | null;
  summary?: string;
  version: number;
  intentClues: string[];
  privacyConsiderations: string[];
  contradictions: DiscoveryContradiction[];
  resolvedContradictionKeys: string[];
  deferredContradictionKeys: string[];
}

let sequence = 0;
const createId = (prefix: string) => `${prefix}-${Date.now()}-${++sequence}`;
const now = () => new Date().toISOString();

const PROBLEM_PATTERN = /probl[eè]me|difficult[eé]|me pose|me gêne|m'empêche|n'arrive pas|retard|perte de temps|désorganis|desorganis|oubli|erreur|bloqu|confus|ne fonctionne pas|fonctionne mal/i;
const CAUSE_PATTERN = /(?:parce que|car|à cause de|puisque|en raison de|du fait que)[^.!?\n]*/i;
const CONTEXT_PATTERN = /\b(?:centre de formation|centre de santé|centre de sante|entreprise|boutique|magasin|école|ecole|association|atelier|agence|restaurant|hôpital|hopital|famille|foyer)\b/gi;
const ACTOR_PATTERNS: Array<{ label: string; pattern: RegExp }> = [
  { label: "enseignants", pattern: /enseignant(?:e)?s?/i },
  { label: "personnel", pattern: /personnel|employé(?:e)?s?|salarié(?:e)?s?|collaborateurs?/i },
  { label: "apprenants", pattern: /élèves?|étudiants?|apprenants?|stagiaires?/i },
  { label: "clients", pattern: /client(?:e)?s?|acheteurs?/i },
  { label: "patients", pattern: /patients?/i },
  { label: "visiteurs", pattern: /visiteurs?|invités?/i },
  { label: "famille", pattern: /famille|parents|enfants|proches/i },
  { label: "équipe", pattern: /équipe|equipe|membres/i },
];

function message(conversationId: string, role: ConversationMessage["role"], content: string, relatedEvidenceIds?: string[]): ConversationMessage {
  return { id: createId("message"), conversationId, role, content, createdAt: now(), relatedEvidenceIds };
}

function addEvidence(
  evidence: NeedEvidence[],
  dimension: NeedDimension,
  value: string,
  sourceMessageId: string,
  sourceQuote = value,
): NeedEvidence[] {
  const clean = value.trim();
  if (!clean) return evidence;
  const exists = evidence.some((item) => item.dimension === dimension && item.value.toLocaleLowerCase() === clean.toLocaleLowerCase());
  if (exists) return evidence;
  return [...evidence, {
    id: createId("evidence"),
    dimension,
    value: clean,
    status: "user_stated",
    sourceMessageId,
    sourceQuote,
    createdAt: now(),
  }];
}

function sentenceContaining(text: string, pattern: RegExp): string | null {
  const sentence = text.split(/(?<=[.!?])\s+/).find((part) => pattern.test(part));
  return sentence?.trim() ?? null;
}

/** Extracts only explicit lexical clues. It does not infer an unstated fact or root cause. */
function extractExplicitEvidence(raw: string, sourceMessageId: string, current: NeedEvidence[]): NeedEvidence[] {
  const analysis = analyzeUniversalProjectIntent(raw);
  let evidence = current;

  if (analysis.currentSituation) {
    evidence = addEvidence(evidence, "activity", analysis.currentSituation, sourceMessageId);
  }
  for (const outcome of analysis.desiredOutcomes) {
    evidence = addEvidence(evidence, "goal", outcome, sourceMessageId);
  }
  for (const actor of ACTOR_PATTERNS) {
    const match = raw.match(actor.pattern);
    if (match?.[0]) evidence = addEvidence(evidence, "actor", actor.label, sourceMessageId, match[0]);
  }
  for (const context of raw.matchAll(CONTEXT_PATTERN)) {
    evidence = addEvidence(evidence, "context", context[0], sourceMessageId, context[0]);
  }
  for (const constraint of analysis.constraints) {
    evidence = addEvidence(evidence, "constraint", constraint, sourceMessageId);
  }
  const problem = sentenceContaining(raw, PROBLEM_PATTERN);
  if (problem) evidence = addEvidence(evidence, "problem", problem, sourceMessageId, problem);
  const cause = raw.match(CAUSE_PATTERN)?.[0]?.trim();
  if (cause) evidence = addEvidence(evidence, "cause", cause, sourceMessageId, cause);

  return evidence;
}

const QUESTION_CATALOG: QuestionCandidate[] = [
  {
    id: "clarify-problem-v1",
    dimension: "problem",
    prompt: "Quel besoin concret veux-tu satisfaire ou quelle difficulté veux-tu faire évoluer en priorité ?",
    rationale: "Comprendre le besoin central avant de proposer une solution.",
    impact: 1, uncertainty: 0.9, decisionRelevance: 1, answerability: 0.9,
  },
  {
    id: "clarify-activity-v1",
    dimension: "activity",
    prompt: "Comment cette situation se déroule-t-elle aujourd'hui, concrètement ?",
    rationale: "Comprendre le fonctionnement actuel avant d'imaginer un changement.",
    impact: 0.9, uncertainty: 0.9, decisionRelevance: 0.9, answerability: 0.95,
  },
  {
    id: "clarify-cause-v1",
    dimension: "cause",
    prompt: "À ton avis, qu'est-ce qui explique principalement cette situation ?",
    rationale: "Distinguer le symptôme de ses causes possibles, sans décider à la place de la personne.",
    impact: 0.85, uncertainty: 0.9, decisionRelevance: 0.85, answerability: 0.85,
  },
  {
    id: "clarify-goal-v1",
    dimension: "goal",
    prompt: "Quel changement concret aimerais-tu constater lorsque ce besoin sera mieux satisfait ?",
    rationale: "Relier la compréhension à un résultat attendu observable.",
    impact: 0.95, uncertainty: 0.75, decisionRelevance: 0.95, answerability: 0.9,
  },
  {
    id: "clarify-context-v1",
    dimension: "context",
    prompt: "Dans quel cadre ou quel lieu cette situation se présente-t-elle ?",
    rationale: "Éviter de généraliser un besoin qui dépend de son contexte réel.",
    impact: 0.7, uncertainty: 0.8, decisionRelevance: 0.7, answerability: 0.95,
  },
  {
    id: "clarify-actors-v1",
    dimension: "actor",
    prompt: "Qui est concerné par cette situation et quel est le rôle de chacun ?",
    rationale: "Identifier les personnes concernées sans présumer de leurs responsabilités.",
    impact: 0.65, uncertainty: 0.7, decisionRelevance: 0.7, answerability: 0.9,
  },
];

function buildSummary(session: UnderstandingSession): string {
  const labels: Partial<Record<NeedDimension, string>> = {
    problem: "Besoin ou difficulté",
    activity: "Fonctionnement actuel",
    cause: "Cause évoquée",
    goal: "Résultat souhaité",
    context: "Contexte",
    actor: "Personnes concernées",
    constraint: "Contraintes mentionnées",
    unknown: "Correction à prendre en compte",
    business_rule: "Règle ou clarification",
  };
  const grouped = new Map<NeedDimension, string[]>();
  for (const item of session.evidence) {
    const values = grouped.get(item.dimension) ?? [];
    values.push(item.value);
    grouped.set(item.dimension, values);
  }
  const sections = [...grouped.entries()]
    .filter(([dimension]) => Boolean(labels[dimension]))
    .map(([dimension, values]) => `• ${labels[dimension]} : ${values.join(" ; ")}`);
  return [
    "Voici ma compréhension provisoire, construite à partir de tes propres réponses :",
    "",
    `Description initiale : « ${session.originalDescription} »`,
    ...(sections.length ? ["", ...sections] : []),
    "",
    "Cette synthèse n'est pas encore une décision ni une solution. Tu peux la confirmer ou me corriger.",
  ].join("\n");
}

function contradictionKey(item: DiscoveryContradiction): string {
  return `${item.topic}::${item.statementA}::${item.statementB}`;
}

function advance(session: UnderstandingSession): UnderstandingSession {
  const visitorText = session.messages
    .filter((item) => item.role === "visitor")
    .map((item) => item.content)
    .join("\\n");
  const analysis = analyzeUniversalProjectIntent(visitorText);
  const history = session.messages.map((item) => ({
    role: item.role === "visitor" ? "user" as const : item.role === "merkora" ? "assistant" as const : "system" as const,
    content: item.content,
  }));
  const discovery = selectNextDiscoveryQuestion(analysis, history);
  const updatedSession: UnderstandingSession = {
    ...session,
    contradictions: discovery.contradictions,
    intentClues: analysis.intentGroups,
    privacyConsiderations: analysis.privacyConsiderations,
  };
  const unresolved = discovery.contradictions.filter((item) => {
    const key = contradictionKey(item);
    return !updatedSession.resolvedContradictionKeys.includes(key) &&
      !updatedSession.deferredContradictionKeys.includes(key);
  });

  if (unresolved.length > 0) {
    const conflict = unresolved[0];
    const question: QuestionCandidate = {
      id: `resolve-contradiction-${conflict.topic}-v1`,
      dimension: "business_rule",
      prompt: conflict.question,
      rationale: "Deux indications semblent incompatibles. MerKora demande une clarification et ne choisit pas à la place de la personne.",
      impact: 1,
      uncertainty: 1,
      decisionRelevance: 1,
      answerability: 0.8,
    };
    const next = {
      ...updatedSession,
      pendingQuestion: question,
      askedQuestionIds: [...updatedSession.askedQuestionIds, question.id],
      stage: "clarification" as const,
      version: updatedSession.version + 1,
    };
    return {
      ...next,
      messages: [...next.messages, message(next.conversationId, "merkora", `J'ai repéré deux indications qui semblent incompatibles. Je ne vais pas choisir à ta place. ${question.prompt}`)],
    };
  }

  const answeredDimensions = [...new Set(updatedSession.evidence.map((item) => item.dimension))];
  const plan = selectNextQuestion({
    candidates: QUESTION_CATALOG,
    answeredDimensions,
    deferredDimensions: updatedSession.deferredDimensions,
    askedQuestionIds: updatedSession.askedQuestionIds,
  });

  if (plan.kind === "question") {
    const next = {
      ...updatedSession,
      pendingQuestion: plan.question,
      askedQuestionIds: [...updatedSession.askedQuestionIds, plan.question.id],
      stage: "clarification" as const,
      version: updatedSession.version + 1,
    };
    return {
      ...next,
      messages: [...next.messages, message(next.conversationId, "merkora", plan.question.prompt)],
    };
  }

  const summary = buildSummary(updatedSession);
  return {
    ...updatedSession,
    pendingQuestion: null,
    stage: "summary_validation",
    summary,
    version: updatedSession.version + 1,
    messages: [...updatedSession.messages, message(updatedSession.conversationId, "merkora", summary)],
  };
}

export function beginUnderstanding(rawIntent: string): UnderstandingSession {
  const originalDescription = rawIntent.trim();
  if (!originalDescription) throw new Error("A first description is required to begin understanding.");
  const id = createId("understanding");
  const conversationId = createId("conversation");
  const firstMessage = message(conversationId, "visitor", originalDescription);
  const evidence = extractExplicitEvidence(originalDescription, firstMessage.id, []);
  const analysis = analyzeUniversalProjectIntent(originalDescription);
  const initial: UnderstandingSession = {
    id,
    conversationId,
    originalDescription,
    messages: [firstMessage],
    evidence,
    validations: [],
    askedQuestionIds: [],
    deferredDimensions: [],
    stage: "clarification",
    pendingQuestion: null,
    version: 1,
    intentClues: analysis.intentGroups,
    privacyConsiderations: analysis.privacyConsiderations,
    contradictions: [],
    resolvedContradictionKeys: [],
    deferredContradictionKeys: [],
  };
  return advance(initial);
}

export function answerUnderstanding(session: UnderstandingSession, answer: string): UnderstandingSession {
  const clean = answer.trim();
  if (!clean || session.stage !== "clarification" || !session.pendingQuestion) return session;

  const visitorMessage = message(session.conversationId, "visitor", clean);
  let evidence = addEvidence(
    session.evidence,
    session.pendingQuestion.dimension,
    clean,
    visitorMessage.id,
    clean,
  );
  evidence = extractExplicitEvidence(clean, visitorMessage.id, evidence);
  const conflictTopic = session.pendingQuestion.id.startsWith("resolve-contradiction-")
    ? session.pendingQuestion.id.replace("resolve-contradiction-", "").replace("-v1", "")
    : null;
  const clarifiedConflict = conflictTopic
    ? session.contradictions.find((item) => item.topic === conflictTopic)
    : undefined;
  const updated: UnderstandingSession = {
    ...session,
    messages: [...session.messages, visitorMessage],
    evidence,
    pendingQuestion: null,
    resolvedContradictionKeys: clarifiedConflict
      ? [...new Set([...session.resolvedContradictionKeys, contradictionKey(clarifiedConflict)])]
      : session.resolvedContradictionKeys,
    version: session.version + 1,
  };
  return advance(updated);
}

export function deferUnderstandingQuestion(session: UnderstandingSession): UnderstandingSession {
  if (session.stage !== "clarification" || !session.pendingQuestion) return session;
  const dimension = session.pendingQuestion.dimension;
  const conflictTopic = session.pendingQuestion.id.startsWith("resolve-contradiction-")
    ? session.pendingQuestion.id.replace("resolve-contradiction-", "").replace("-v1", "")
    : null;
  const deferredConflict = conflictTopic
    ? session.contradictions.find((item) => item.topic === conflictTopic)
    : undefined;
  const updated: UnderstandingSession = {
    ...session,
    deferredDimensions: [...new Set([...session.deferredDimensions, dimension])],
    deferredContradictionKeys: deferredConflict
      ? [...new Set([...session.deferredContradictionKeys, contradictionKey(deferredConflict)])]
      : session.deferredContradictionKeys,
    pendingQuestion: null,
    messages: [...session.messages, message(session.conversationId, "merkora", "D'accord, nous laissons ce point de côté pour le moment. On continue avec un autre élément utile.")],
    version: session.version + 1,
  };
  return advance(updated);
}

export function decideUnderstandingSummary(
  session: UnderstandingSession,
  decision: "confirmed" | "corrected" | "rejected" | "deferred",
  correction?: string,
): UnderstandingSession {
  if (session.stage !== "summary_validation" || !session.summary) {
    throw new Error("There is no summary awaiting validation.");
  }
  if (decision === "corrected" && !correction?.trim()) {
    throw new Error("A correction is required when the summary is marked as corrected.");
  }

  const cleanCorrection = correction?.trim();
  const validation: ValidationDecision = {
    id: createId("validation"),
    conversationId: session.conversationId,
    subject: "understanding_summary",
    presentedText: session.summary,
    decision,
    correction: cleanCorrection,
    evidenceIds: session.evidence.map((item) => item.id),
    createdAt: now(),
  };

  if (decision === "confirmed") {
    const confirmedEvidence = session.evidence.map((item) => ({ ...item, status: "validated" as const }));
    const confirmedSummary = session.summary
      .replace("compréhension provisoire", "compréhension validée")
      .replace("Cette synthèse n'est pas encore une décision ni une solution. Tu peux la confirmer ou me corriger.", "Cette synthèse a été confirmée par toi. Elle constitue le point de départ validé de la suite du parcours.");
    return {
      ...session,
      evidence: confirmedEvidence,
      summary: confirmedSummary,
      validations: [...session.validations, validation],
      stage: "complete",
      version: session.version + 1,
      messages: [...session.messages, message(session.conversationId, "merkora", "Merci. Tu as confirmé cette compréhension. Les éléments de cette synthèse sont maintenant marqués comme validés par toi.")],
    };
  }

  if (decision === "corrected" && cleanCorrection) {
    const correctionMessage = message(session.conversationId, "visitor", cleanCorrection);
    const correctionEvidence = addEvidence(session.evidence, "unknown", cleanCorrection, correctionMessage.id, cleanCorrection);
    const correctedValidation = { ...validation, evidenceIds: correctionEvidence.map((item) => item.id) };
    return {
      ...session,
      evidence: correctionEvidence,
      validations: [...session.validations, correctedValidation],
      summary: `${session.summary}\n\nCorrection apportée par toi : « ${cleanCorrection} ». Cette correction doit encore être vérifiée dans la synthèse.`,
      version: session.version + 1,
      messages: [
        ...session.messages,
        correctionMessage,
        message(session.conversationId, "merkora", `Merci, j'ai conservé ta correction : « ${cleanCorrection} ». Relis la synthèse mise à jour avant de la valider.`),
      ],
    };
  }

  return {
    ...session,
    validations: [...session.validations, validation],
    stage: "complete",
    version: session.version + 1,
    messages: [...session.messages, message(session.conversationId, "merkora", "D'accord. La synthèse reste en attente : aucun élément n'est marqué comme validé. Tu pourras reprendre cette vérification plus tard dans cette session.")],
  };
}
