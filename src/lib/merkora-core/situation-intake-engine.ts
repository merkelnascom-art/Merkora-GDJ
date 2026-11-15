import type { ConversationMessage, NeedDimension, NeedEvidence, QuestionCandidate, ValidationDecision } from "./types";
import { buildSituationGraph, type SituationGraph } from "./situation-graph";
import { extractSituationObservations } from "./situation-extractor";
import { analyzeConversation, type ConversationReasoning } from "./situation-reasoning";

export type IntentKind =
  | "organize_event" | "reservation" | "invitation" | "request"
  | "create_project" | "invention" | "improve" | "solve" | "explore" | "unknown";
export type UnderstandingStage = "clarification" | "summary_validation" | "complete";

export interface UnderstandingSession {
  id: string;
  conversationId: string;
  originalDescription: string;
  intentKind: IntentKind;
  messages: ConversationMessage[];
  evidence: NeedEvidence[];
  situationGraph: SituationGraph;
  reasoning?: ConversationReasoning;
  validations: ValidationDecision[];
  askedQuestionIds: string[];
  deferredDimensions: NeedDimension[];
  stage: UnderstandingStage;
  pendingQuestion: QuestionCandidate | null;
  summary?: string;
  version: number;
  intentClues: string[];
  privacyConsiderations: string[];
  contradictions: { topic: string; statementA: string; statementB: string; question: string; confirmationRequired: boolean }[];
  resolvedContradictionKeys: string[];
  deferredContradictionKeys: string[];
}

let sequence = 0;
const makeId = (prefix: string) => prefix + "-" + Date.now() + "-" + (++sequence);
const now = () => new Date().toISOString();

/**
 * This first-stage extractor is deliberately conservative:
 * it stores complete source sentences as evidence, never a guessed answer.
 * It is a deterministic baseline, not a claim of general semantic understanding.
 */
const extractors: Array<[NeedDimension, RegExp]> = [
  ["project_scope", /(?:ça s'appelle|cela s'appelle|le projet s'appelle|nommé|nommée)\s*[:«]?\s*[^.!?\n]+/i],
  ["problem", /(?:problème|difficulté|ne savent pas|ne sait pas|n'arriv\w* pas|n'arrivent\w* pas|se perdent|se retrouve\w*|en désordre|manque de|stress\w*|frustr\w*|désorganis\w*|retard\w*|bloqu\w*|perd\w*)/i],
  ["goal", /(?:ce que je veux|je souhaite|mon objectif|le but est|afin de|pour leur permettre|pour permettre à|l'objectif|l'objectif est|permettre de|aider à|aider les)/i],
  ["preference", /(?:application|plateforme|logiciel|site web|outil numérique|jeu|système|service numérique|solution|interface)/i],
  ["audience", /(?:élèves|étudiants|apprenants|jeunes|clients|patients|joueurs|visiteurs|voyageurs|membres|employés|enseignants|candidats|parents|professionnels)/i],
  ["feature", /(?:par des questions|tests?|questionnaire|quiz|relevés|notes|analyse|analys\w*|propose\w*|réservation|réserver|notification|paiement|chois\w*|sélectionn\w*|défile\w*|disparaît|réapparaît|envoient|envoie|vérifi\w*|confirm\w*|synchronis\w*|joignent|indiquent|estime\w*|calcule\w*|affiche\w*|enregistr\w*|suiv\w*|gère\w*|organis\w*)/i],
  ["context", /(?:après le bac|après leur bac|à l'école|dans les écoles|en ligne|sur place|à domicile|sans connexion|sans compte|dans une clinique|dans un établissement|au sein de)/i],
  ["resource", /(?:relevés|bulletins|documents|photos|fichiers|notes|données|téléphone|ordinateur|internet|disponibilités|calendrier|agenda)/i],
  ["constraint", /(?:sans connexion|sans compte|pas besoin de se connecter|pas besoin de compte|ne demand\\w* pas de connexion|obligatoire|budget|délai|gratuit|limite|confidentiel|autorisation|consentement|ne faut pas|ne doit pas|pas de paiement|sans paiement|aucun paiement|pas.*paiement en ligne)/i],
  ["cause", /(?:parce que|car|à cause de|puisque|en raison de|cela vient de|la cause)/i],
  ["activity", /(?:réserver|réservation|former|enseigner|vendre|acheter|livrer|soigner|consulter|orienter|évaluer|jouer|s'inscrire|inscription|organiser|accueillir)/i],
];

function addEvidence(
  all: NeedEvidence[],
  dimension: NeedDimension,
  rawValue: string,
  message: ConversationMessage,
  sourceQuote = rawValue,
): NeedEvidence[] {
  const value = rawValue.trim().replace(/\s+/g, " ");
  if (!value) return all;
  const normalized = value.toLocaleLowerCase("fr");
  if (all.some((item) => item.dimension === dimension && item.value.toLocaleLowerCase("fr") === normalized)) return all;
  return [...all, {
    id: makeId("evidence"),
    dimension,
    value,
    status: (() => {
      const assertion = analyzeConversation([message]).assertions.find((item) => item.quote === sourceQuote);
      return assertion?.status === "hypothesis" ? "hypothesis" : assertion?.status === "deduction" ? "inferred" : "user_stated";
    })(),
    sourceMessageId: message.id,
    sourceQuote,
    confidence: 0.86,
    createdAt: now(),
  }];
}

function splitIntoStatements(text: string): string[] {
  return text
    .replace(/\r/g, "\n")
    .split(/(?<=[.!?])\s+|\n+|\s*;\s*/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function extract(text: string, message: ConversationMessage, previous: NeedEvidence[]): NeedEvidence[] {
  let evidence = previous;
  const statements = splitIntoStatements(text);

  for (const statement of statements) {
    for (const [dimension, pattern] of extractors) {
      const match = statement.match(pattern);
      if (!match) continue;

      let value = statement;
      if (dimension === "project_scope") {
        value = statement
          .replace(/^(?:ça s'appelle|cela s'appelle|le projet s'appelle|nommé|nommée)\s*[:«]?\s*/i, "")
          .replace(/[»"']$/, "")
          .trim();
      }
      evidence = addEvidence(evidence, dimension, value, message, statement);
    }

    const actorPattern = /\b(?:secrétariat|secrétaire|directeur|directrice|administrateur|administratrice|médecin|docteur|enseignant\w*|professeur\w*|formateur\w*|responsable|agent\w*|employé\w*|personnel|parent\w*|élèves|étudiants|apprenants|joueurs|clients|patients)\b/gi;
    for (const actor of statement.matchAll(actorPattern)) {
      evidence = addEvidence(evidence, "actor", actor[0], message, statement);
    }

    const noContext = statement.match(/(?:pas de cadre particulier|aucun contexte|pas de contexte précis|accessible à tous)/i);
    if (noContext) evidence = addEvidence(evidence, "context", noContext[0], message, statement);
  }

  return evidence;
}

function classify(text: string): IntentKind {
  const value = text.toLocaleLowerCase("fr");
  if (/réserv|reservation|réserver|rendez-vous|booking/.test(value)) return "reservation";
  if (/organiser|organisation/.test(value) && /anniversaire|fête|soirée|mariage|événement/.test(value)) return "organize_event";
  if (/inviter|invitation|convier/.test(value)) return "invitation";
  if (/demande|solliciter|requête/.test(value)) return "request";
  if (/invention|inventer|nouvelle invention/.test(value)) return "invention";
  if (/j'ai une idée|j’ai une idée|idée à développer|idée à explorer|je veux imaginer|je réfléchis/.test(value)) return "explore";
  if (/créer|creer|concevoir|développer|developper|lancer|mettre en place/.test(value)) return "create_project";
  if (/améliorer|optimiser|moderniser/.test(value)) return "improve";
  if (/problème|difficulté|résoudre|retard|désorganis/.test(value)) return "solve";
  return "unknown";
}

function newMessage(conversationId: string, role: ConversationMessage["role"], content: string): ConversationMessage {
  return { id: makeId("message"), conversationId, role, content, createdAt: now() };
}

function makeQuestion(dimension: NeedDimension, prompt: string, rationale: string): QuestionCandidate {
  return {
    id: "missing-" + dimension + "-v2",
    dimension,
    prompt,
    rationale,
    impact: 0.9,
    uncertainty: 0.8,
    decisionRelevance: 0.9,
    answerability: 0.9,
  };
}

const REPAIR = /(?:tu n'as pas (?:encore )?compris|tu n’as pas (?:encore )?compris|tu ne comprends pas|tu ne me comprends pas|tu ne me suis pas|tu m'écoutes pas|tu m’écoutes pas|tu es à côté)/i;

export function rebuildSituationGraph(messages: ConversationMessage[]): SituationGraph {
  const projectMessages = messages.filter(
    (message) => message.role === "visitor" && !REPAIR.test(message.content),
  );
  return buildSituationGraph(extractSituationObservations(projectMessages));
}

function makeSummary(session: UnderstandingSession): string {
  const labels: Partial<Record<NeedDimension, string>> = {
    project_scope: "Nom du projet",
    problem: "Situation et problème",
    goal: "Objectif",
    preference: "Solution envisagée",
    audience: "Public concerné",
    actor: "Personnes et rôles",
    feature: "Fonctionnement et fonctionnalités",
    context: "Cadre",
    resource: "Données et ressources",
    constraint: "Contraintes",
    cause: "Causes",
    activity: "Activités",
  };
  const order: NeedDimension[] = [
    "project_scope", "problem", "audience", "actor", "goal", "preference",
    "activity", "feature", "context", "resource", "constraint", "cause",
  ];
  const lines = order.flatMap((dimension) => {
    const items = session.evidence.filter((item) => item.dimension === dimension);
    return items.length
      ? [labels[dimension] || dimension, ...items.map((item) => "• " + item.value)]
      : [];
  });

  return [
    "Voici ce que j'ai compris à partir de l'ensemble de ton récit. Les informations ci-dessous viennent de tes propres messages.",
    "",
    "Description initiale intégrale :",
    session.originalDescription,
    "",
    ...lines,
    "",
    "Les informations absentes restent à préciser. Je ne les transforme pas en faits et je ne te redemanderai pas ce que tu as déjà expliqué.",
    "",
    "Cette compréhension est provisoire : tu peux la corriger ou la confirmer.",
  ].join("\n");
}

function advance(session: UnderstandingSession): UnderstandingSession {
  const lastVisitorMessage = session.messages.filter((message) => message.role === "visitor").at(-1)?.content || "";

  if (REPAIR.test(lastVisitorMessage)) {
    const question = makeQuestion(
      "unknown",
      "Tu as raison : ma réponse précédente n'a pas exploité ce que tu avais déjà expliqué. Qu'ai-je déformé ou laissé de côté ?",
      "Réparer le décalage sans traiter ta remarque comme une donnée métier.",
    );
    return {
      ...session,
      pendingQuestion: question,
      stage: "clarification",
      messages: [...session.messages, newMessage(session.conversationId, "merkora", "Je reconnais le décalage. Je reprends ton récit complet. " + question.prompt)],
      version: session.version + 1,
    };
  }

  const reasoning = analyzeConversation(session.messages);
  const detectedContradictions = reasoning.contradictions.map((item) => ({
    topic: item.topic,
    statementA: item.statementA,
    statementB: item.statementB,
    question: item.question,
    confirmationRequired: true,
  }));
  session = { ...session, reasoning, contradictions: detectedContradictions };
  const unresolvedContradiction = reasoning.contradictions.find((item) => {
    const key = `${item.topic}::${item.statementA}::${item.statementB}`;
    return !session.resolvedContradictionKeys.includes(key) && !session.deferredContradictionKeys.includes(key);
  });
  if (unresolvedContradiction) {
    const question = makeQuestion(
      "business_rule",
      unresolvedContradiction.question,
      "Deux messages contiennent des indications incompatibles sur une même règle. MerKora doit clarifier avant de poursuivre.",
    );
    question.id = `resolve-contradiction-${unresolvedContradiction.topic}-v2`;
    return {
      ...session,
      pendingQuestion: question,
      askedQuestionIds: [...session.askedQuestionIds, question.id],
      stage: "clarification",
      version: session.version + 1,
      messages: [...session.messages, newMessage(
        session.conversationId,
        "merkora",
        `J'ai repéré deux indications qui semblent incompatibles : « ${unresolvedContradiction.statementA} » et « ${unresolvedContradiction.statementB} ». Je ne vais pas choisir à ta place. ${question.prompt}`,
      )],
    };
  }

  const unresolvedReference = reasoning.references.find((item) => !item.resolved);
  if (unresolvedReference) {
    const question = makeQuestion(
      "unknown",
      `Quand tu dis « ${unresolvedReference.mention} », à quel élément de ton récit fais-tu référence ?`,
      "Un pronom ou une référence ne possède pas encore d'antécédent suffisamment clair.",
    );
    question.id = `clarify-reference-${unresolvedReference.messageId}-${unresolvedReference.mention.toLocaleLowerCase("fr")}`;
    if (!session.askedQuestionIds.includes(question.id)) return {
      ...session,
      pendingQuestion: question,
      askedQuestionIds: [...session.askedQuestionIds, question.id],
      stage: "clarification",
      version: session.version + 1,
      messages: [...session.messages, newMessage(session.conversationId, "merkora", question.prompt)],
    };
  }

  const has = (dimension: NeedDimension) => session.evidence.some((item) => item.dimension === dimension);
  const rich = (has("problem") || has("goal"))
    && (has("preference") || has("feature"))
    && (has("audience") || has("context") || has("resource"));

  if (rich) {
    const summary = makeSummary(session);
    return {
      ...session,
      pendingQuestion: null,
      stage: "summary_validation",
      summary,
      version: session.version + 1,
      messages: [...session.messages, newMessage(session.conversationId, "merkora", summary)],
    };
  }

  if (session.intentKind === "explore" && !has("problem") && !has("goal") && !has("preference") && !has("feature")) {
    const question = makeQuestion(
      "unknown",
      "Raconte-moi ton idée avec tes propres mots. Tu peux tout expliquer librement : ce que tu imagines, pourquoi, pour qui et comment tu voudrais que cela fonctionne.",
      "Tu as annoncé une idée, mais tu ne l'as pas encore décrite. Je t'invite à l'exposer librement avant toute question de détail.",
    );
    return {
      ...session,
      pendingQuestion: question,
      stage: "clarification",
      askedQuestionIds: [...session.askedQuestionIds, question.id],
      version: session.version + 1,
      messages: [...session.messages, newMessage(session.conversationId, "merkora", question.prompt)],
    };
  }

  const missing: Array<[NeedDimension, string, string]> = [
    ["problem", "Quelle situation précise veux-tu changer ou quel problème veux-tu résoudre ?", "Le problème central n'est pas encore explicite."],
    ["goal", "Quel résultat concret aimerais-tu obtenir ?", "Le résultat attendu reste à préciser."],
    ["preference", "As-tu déjà imaginé une forme de solution, ou souhaites-tu que nous l'explorions ?", "La forme de solution reste inconnue."],
    ["audience", "Qui utilisera cette solution ou en bénéficiera ?", "Le public n'est pas encore identifié."],
    ["feature", "Comment imagines-tu que cela fonctionne, étape par étape ?", "Le fonctionnement n'est pas encore assez détaillé."],
    ["context", "Dans quel cadre ou environnement cela devra-t-il fonctionner ?", "Le contexte peut changer la conception."],
  ];

  const next = missing.find(([dimension]) => !has(dimension) && !session.deferredDimensions.includes(dimension));
  if (!next) {
    const summary = makeSummary(session);
    return {
      ...session,
      pendingQuestion: null,
      stage: "summary_validation",
      summary,
      version: session.version + 1,
      messages: [...session.messages, newMessage(session.conversationId, "merkora", summary)],
    };
  }

  const question = makeQuestion(next[0], next[1], next[2]);
  return {
    ...session,
    pendingQuestion: question,
    stage: "clarification",
    askedQuestionIds: [...session.askedQuestionIds, question.id],
    version: session.version + 1,
    messages: [...session.messages, newMessage(session.conversationId, "merkora", question.prompt)],
  };
}

export function beginUnderstanding(rawDescription: string): UnderstandingSession {
  const text = rawDescription.trim();
  if (!text) throw new Error("A first description is required.");

  const conversationId = makeId("conversation");
  const firstMessage = newMessage(conversationId, "visitor", text);
  const session: UnderstandingSession = {
    id: makeId("understanding"),
    conversationId,
    originalDescription: text,
    intentKind: classify(text),
    messages: [firstMessage],
    evidence: extract(text, firstMessage, []),
    situationGraph: rebuildSituationGraph([firstMessage]),
    validations: [],
    askedQuestionIds: [],
    deferredDimensions: [],
    stage: "clarification",
    pendingQuestion: null,
    version: 1,
    intentClues: [],
    privacyConsiderations: [],
    contradictions: [],
    resolvedContradictionKeys: [],
    deferredContradictionKeys: [],
  };
  return advance(session);
}

export function answerUnderstanding(session: UnderstandingSession, answer: string): UnderstandingSession {
  const text = answer.trim();
  if (!text || session.stage !== "clarification" || !session.pendingQuestion) return session;

  const visitorMessage = newMessage(session.conversationId, "visitor", text);
  if (REPAIR.test(text)) {
    return advance({
      ...session,
      messages: [...session.messages, visitorMessage],
      situationGraph: rebuildSituationGraph([...session.messages, visitorMessage]),
      pendingQuestion: null,
      version: session.version + 1,
    });
  }

  const evidence = extract(text, visitorMessage, session.evidence);
  const hasPendingEvidence = evidence.some(
    (item) => item.dimension === session.pendingQuestion?.dimension && item.sourceMessageId === visitorMessage.id,
  );
  const completeEvidence = hasPendingEvidence
    ? evidence
    : addEvidence(evidence, session.pendingQuestion.dimension, text, visitorMessage, text);
  const resolvingTopic = session.pendingQuestion.id.startsWith("resolve-contradiction-")
    ? session.pendingQuestion.id.replace("resolve-contradiction-", "").replace("-v2", "")
    : null;
  const resolvedConflict = resolvingTopic
    ? session.reasoning?.contradictions.find((item) => item.topic === resolvingTopic)
    : undefined;
  const isUncertainAnswer = /je ne sais pas|je ne sais|à vérifier|a verifier|les deux|aucun des deux|je ne peux pas dire/i.test(text);
  const conflictKey = resolvedConflict
    ? `${resolvedConflict.topic}::${resolvedConflict.statementA}::${resolvedConflict.statementB}`
    : null;
  const resolvedContradictionKeys = resolvedConflict && !isUncertainAnswer && text.length > 2 && conflictKey
    ? [...new Set([...session.resolvedContradictionKeys, conflictKey])]
    : session.resolvedContradictionKeys;
  const deferredContradictionKeys = resolvedConflict && isUncertainAnswer && conflictKey
    ? [...new Set([...session.deferredContradictionKeys, conflictKey])]
    : session.deferredContradictionKeys;

  return advance({
    ...session,
    messages: [...session.messages, visitorMessage],
    evidence: completeEvidence,
    situationGraph: rebuildSituationGraph([...session.messages, visitorMessage]),
    resolvedContradictionKeys,
    deferredContradictionKeys,
    pendingQuestion: null,
    version: session.version + 1,
  });
}

export function deferUnderstandingQuestion(session: UnderstandingSession): UnderstandingSession {
  if (!session.pendingQuestion) return session;
  return advance({
    ...session,
    deferredDimensions: [...session.deferredDimensions, session.pendingQuestion.dimension],
    pendingQuestion: null,
    messages: [...session.messages, newMessage(session.conversationId, "merkora", "D'accord, je garde ce point en attente sans inventer de réponse.")],
    version: session.version + 1,
  });
}

export function decideUnderstandingSummary(
  session: UnderstandingSession,
  decision: "confirmed" | "corrected" | "rejected" | "deferred",
  correction?: string,
): UnderstandingSession {
  if (!session.summary) throw new Error("No summary to validate.");

  const validation: ValidationDecision = {
    id: makeId("validation"),
    conversationId: session.conversationId,
    subject: "understanding_summary",
    presentedText: session.summary,
    decision,
    correction,
    evidenceIds: session.evidence.map((item) => item.id),
    createdAt: now(),
  };

  if (decision === "corrected" && correction?.trim()) {
    const message = newMessage(session.conversationId, "visitor", correction.trim());
    return advance({
      ...session,
      messages: [...session.messages, message],
      evidence: extract(correction.trim(), message, session.evidence),
      situationGraph: rebuildSituationGraph([...session.messages, message]),
      validations: [...session.validations, validation],
      stage: "clarification",
      summary: undefined,
      version: session.version + 1,
    });
  }

  return {
    ...session,
    validations: [...session.validations, validation],
    evidence: decision === "confirmed"
      ? session.evidence.map((item) => ({ ...item, status: "validated" }))
      : session.evidence,
    stage: "complete",
    summary: decision === "confirmed" ? session.summary.replace("provisoire", "validée") : session.summary,
    version: session.version + 1,
    messages: [
      ...session.messages,
      newMessage(
        session.conversationId,
        "merkora",
        decision === "confirmed" ? "Merci. Tu as confirmé cette compréhension." : "Compréhension conservée sans validation.",
      ),
    ],
  };
}
