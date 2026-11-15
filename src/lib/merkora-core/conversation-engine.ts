import { analyzeUniversalProjectIntent } from "../universal-project-understanding";
import { buildUnderstandingDossier, type UnderstandingDossier } from "./understanding-dossier";
import { selectNextQuestion } from "./question-planner";
import { selectNextDiscoveryQuestion, type DiscoveryContradiction } from "../universal-project-discovery";
import type {
  ConversationMessage,
  NeedDimension,
  NeedEvidence,
  QuestionCandidate,
  ValidationDecision,
} from "./types";

export type IntentKind = "organize_event" | "reservation" | "invitation" | "request" | "create_project" | "invention" | "improve" | "solve" | "explore" | "unknown";
export type UnderstandingStage = "clarification" | "summary_validation" | "complete";

export interface UnderstandingSession {
  id: string;
  conversationId: string;
  originalDescription: string;
  intentKind: IntentKind;
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
  dossier: UnderstandingDossier;
}

let sequence = 0;
const createId = (prefix: string) => `${prefix}-${Date.now()}-${++sequence}`;
const now = () => new Date().toISOString();

const SOLUTION_PATTERN = /application|site web|plateforme|logiciel|interface|jeu interactif|système|systeme|outil numérique|outil digital|robot|automatiser|automatisation/i;
const PROBLEM_PATTERN = /probl[eè]me|difficult[eé]|frustr|se frustr|stress|col[eè]re|m'énerve|m'enerve|me pose|me gêne|m'empêche|n'arrive pas|retard|perte de temps|désorganis|desorganis|oubli|erreur|bloqu|confus|ne fonctionne pas|fonctionne mal/i;
const AUDIENCE_PATTERN = /jeunes|adolescents?|étudiants?|etudiants?|élèves?|eleves?|apprenants?|adultes?|enfants?/i;
const EMOTION_PATTERN = /frustr\w*|stress\w*|col[eè]re|tension\w*|(?:est|sont|se sent|se sentent)\s+(?:énervé|énervée|énervés|énervées|enervé|enervée|enervés|enervées)/i;
const EXPERIENCE_PATTERN = /distraire|détendre|detendre|relâcher|relacher|évacuer|evacuer|se défouler|se defouler|se divertir|s'amuser/i;
const NO_CONTEXT_PATTERN = /(?:pas de cadre|aucun cadre|pas vraiment de contexte|aucun contexte|rien de particulier comme contexte|n'y a pas de cadre|pas vraiment dans un cadre|pas de contexte)/i;
const GAME_FEATURE_PATTERNS: Array<{ pattern: RegExp; value: string }> = [
  { pattern: /chois\w*[^.!?\n]{0,100}(?:énerve|enerve|embête|embete|agace|dérange|derange)/i, value: "Choix libre de ce qui énerve ou dérange le joueur" },
  { pattern: /emoji|émotic[oô]ne|emotic[oô]ne/i, value: "Association d'un symbole ou emoji à l'élément choisi" },
  { pattern: /défil\w*|defil\w*|dispara[iî]t|réappara[iî]t|reappara[iî]t/i, value: "Cible mobile qui disparaît et réapparaît" },
  { pattern: /touch\w*|taper sur la cible|attraper la cible/i, value: "Le joueur doit toucher ou attraper la cible" },
  { pattern: /rat\w*|vide|échec|echec|looser|loser|difficulté augmente|difficulte augmente|grandit/i, value: "La difficulté progresse après un échec, avec une taquinerie humoristique" },
  { pattern: /excuses|désolé|desole|pardon/i, value: "La cible présente des excuses après une réussite" },
];
const PRIVACY_PATTERN = /accord|consentement|informé(?:e)?s?|autorisé(?:e)?s?|confidentiel|privé|personne d'autre|seulement moi|uniquement moi/i;
const CAUSE_PATTERN = /(?:parce que|car|à cause de|puisque|en raison de|du fait que)[^.!?\n]*/i;

const REPAIR_PATTERN = /tu ne me suis pas|tu ne me comprends pas|est[- ]ce que tu me comprends|tu n'as pas compris|tu n'as pas encore compris|tu ne comprends pas|tu m'écoutes pas|tu ne m'écoutes pas|tu es à côté|tu pars à côté|ce n'est pas ce que je veux dire|avec tout ce que j'ai dit.{0,50}(?:pas compris|ne comprends)/i;

function classifyIntent(raw: string): IntentKind {
  const text = raw.toLocaleLowerCase("fr");
  if (/réserv|reserver|réserver|prendre un rendez-vous|booking/i.test(text)) return "reservation";
  if (/organiser|organisation/i.test(text) && /anniversaire|fête|pool party|soirée|mariage|cérémonie|conférence|événement|rencontre/i.test(text)) return "organize_event";
  if (/inviter|invitation|convier|faire-part/i.test(text)) return "invitation";
  if (/demande|solliciter|réclamer|requête/i.test(text)) return "request";
  if (/créer|creation|création|ouvrir|lancer|fonder|mettre en place|construire/i.test(text) && /interface de jeu|jeu interactif|expérience ludique|experience ludique/i.test(text)) return "create_project";
  if (/créer|creation|création|ouvrir|lancer|fonder|mettre en place|construire/i.test(text) && SOLUTION_PATTERN.test(text)) return "solve";
  if (/créer|creation|création|ouvrir|lancer|fonder|mettre en place|construire/i.test(text)) return "create_project";
  if (/inventer|invention|imaginer|nouvelle idée/i.test(text)) return "invention";
  if (/^\s*(?:j['’]ai|nous avons)\s+(?:une\s+)?idée(?:\s+à\s+développer)?\s*$/i.test(text) || /idée à développer|idée à developper|nouvelle idée|j'imagine|je rêve|explorer|réfléchir/i.test(text)) return "explore";
  if (/améliorer|optimiser|moderniser/i.test(text)) return "improve";
  if (PROBLEM_PATTERN.test(text) || /résoudre|régler ce problème/i.test(text)) return "solve";
  if (/développer|developper/i.test(text)) return "explore";
  return "unknown";
}

function intentFirstQuestion(session: UnderstandingSession): QuestionCandidate {
  const prompts: Record<IntentKind, { dimension: NeedDimension; id: string; prompt: string }> = {
    organize_event: /pool party|fête|soirée|mariage|cérémonie|conférence|événement/i.test(session.originalDescription)
      ? { dimension: "context", id: "event-date-v1", prompt: "As-tu déjà une date ou une période prévue pour cet événement ?" }
      : { dimension: "activity", id: "event-type-v1", prompt: "Quel type d'événement souhaites-tu organiser pour ton anniversaire ou cette occasion ?" },
    reservation: /samedi|dimanche|demain|aujourd'hui|lundi|mardi|mercredi|jeudi|vendredi|\d{1,2}[/-]\d{1,2}/i.test(session.originalDescription)
      ? { dimension: "actor", id: "reservation-party-v1", prompt: "Pour combien de personnes ou de bénéficiaires souhaites-tu faire cette réservation ?" }
      : { dimension: "context", id: "reservation-when-v1", prompt: "Qu'est-ce que tu souhaites réserver, et pour quelle date ou période ?" },
    invitation: { dimension: "context", id: "invitation-occasion-v1", prompt: "À quelle occasion et à quelle date souhaites-tu envoyer cette invitation ?" },
    request: { dimension: "actor", id: "request-recipient-v1", prompt: "À qui cette demande s'adresse-t-elle ?" },
    create_project: { dimension: "actor", id: "create-purpose-v1", prompt: "À qui cette école, cette structure ou ce projet doit-il servir, et quels besoins doit-il couvrir ?" },
    invention: { dimension: "unknown", id: "invention-purpose-v1", prompt: "Quelle est ton idée, même incomplète ? Décris-la avec tes propres mots." },
    improve: { dimension: "problem", id: "improve-priority-v1", prompt: "Quel aspect souhaites-tu améliorer en priorité, et quel changement aimerais-tu obtenir ?" },
    solve: { dimension: "problem", id: "solve-priority-v1", prompt: "Qu'est-ce qui se passe exactement, et quel effet cela a-t-il pour toi ?" },
    explore: { dimension: "goal", id: "explore-purpose-v1", prompt: "Raconte-moi ce que tu imagines, même si ton idée n'est pas encore bien formulée." },
    unknown: { dimension: "problem", id: "open-purpose-v1", prompt: "Qu'aimerais-tu mieux organiser, changer ou faire concrètement ? Tu peux me l'expliquer librement." },
  };
  const item = prompts[session.intentKind];
  return { ...item, rationale: "Première question adaptée à l'intention exprimée.", impact: 1, uncertainty: 0.95, decisionRelevance: 1, answerability: 0.9 };
}

function repairQuestion(session: UnderstandingSession): QuestionCandidate {
  const prior = session.messages.filter((item) => item.role === "visitor").map((item) => item.content).slice(-3).join(" — ");
  const excerpt = prior.length > 240 ? prior.slice(0, 237) + "…" : prior;
  return {
    id: "repair-understanding-v1", dimension: "unknown",
    prompt: `Tu as raison, je suis parti dans une mauvaise direction. Je reprends à partir de tes propres mots : « ${excerpt} ». Peux-tu me réexpliquer ce que tu veux faire concrètement, ou corriger ma reformulation ?`,
    rationale: "Réparer un décalage conversationnel avant de poursuivre.",
    impact: 1, uncertainty: 1, decisionRelevance: 1, answerability: 0.9,
  };
}
const CONTEXT_PATTERN = /\b(?:centre de formation|centre de santé|centre de sante|entreprise|boutique|magasin|école|ecole|association|atelier|agence|restaurant|hôpital|hopital|famille|foyer)\b/gi;
const ACTOR_PATTERNS: Array<{ label: string; pattern: RegExp }> = [
  { label: "enseignants", pattern: /enseignant(?:e)?s?/i },
  { label: "personnel", pattern: /personnel|employé(?:e)?s?|salarié(?:e)?s?|collaborateurs?/i },
  { label: "apprenants", pattern: /élèves?|étudiants?|apprenants?|stagiaires?/i },
  { label: "jeunes", pattern: /jeunes|adolescents?/i },
  { label: "clients", pattern: /client(?:e)?s?|acheteurs?/i },
  { label: "patients", pattern: /patients?/i },
  { label: "participants et invités", pattern: /visiteurs?|invités?|inviter|participants?|convives|personnes/i },
  { label: "famille", pattern: /famille|parents|enfants|proches/i },
  { label: "amis", pattern: /amis|amies/i },
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
  const proposedSolution = sentenceContaining(raw, SOLUTION_PATTERN);
  if (proposedSolution) {
    evidence = addEvidence(evidence, "preference", proposedSolution, sourceMessageId, proposedSolution);
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
  const privacyStatement = raw.match(PRIVACY_PATTERN)?.[0];
  if (privacyStatement) evidence = addEvidence(evidence, "risk", privacyStatement, sourceMessageId, privacyStatement);
  const problem = sentenceContaining(raw, PROBLEM_PATTERN);
  if (problem) evidence = addEvidence(evidence, "problem", problem, sourceMessageId, problem);
  const cause = raw.match(CAUSE_PATTERN)?.[0]?.trim();
  if (cause) evidence = addEvidence(evidence, "cause", cause, sourceMessageId, cause);

  const audienceMatch = raw.match(AUDIENCE_PATTERN)?.[0];
  if (audienceMatch) {
    const audienceQuote = sentenceContaining(raw, AUDIENCE_PATTERN) ?? audienceMatch;
    evidence = addEvidence(evidence, "audience", audienceMatch, sourceMessageId, audienceQuote);
  }
  const emotion = sentenceContaining(raw, EMOTION_PATTERN);
  if (emotion) evidence = addEvidence(evidence, "emotion", emotion, sourceMessageId, emotion);
  const experience = sentenceContaining(raw, EXPERIENCE_PATTERN);
  const describesAnObstacle = experience && /n['’]arriv\w* plus|n['’]arriv\w* pas|ne parv\w* pas|ne peuvent pas|difficulté à|difficulte a/i.test(experience);
  if (experience && !describesAnObstacle) {
    evidence = addEvidence(evidence, "experience", experience, sourceMessageId, experience);
    evidence = addEvidence(evidence, "goal", experience, sourceMessageId, experience);
  }
  const noContext = raw.match(NO_CONTEXT_PATTERN)?.[0];
  if (noContext) evidence = addEvidence(evidence, "context", "Aucun cadre particulier indiqué", sourceMessageId, noContext);
  for (const feature of GAME_FEATURE_PATTERNS) {
    const quote = sentenceContaining(raw, feature.pattern);
    if (quote) evidence = addEvidence(evidence, "feature", feature.value, sourceMessageId, quote);
  }

  return evidence;
}

const PROJECT_SCOPE_QUESTION: QuestionCandidate = {
  id: "clarify-project-scope-v1",
  dimension: "project_scope",
  prompt: "Tu as évoqué plusieurs besoins. Veux-tu les réunir dans un seul projet commun, ou préfères-tu les traiter comme des projets distincts ?",
  rationale: "Clarifier le périmètre avant de mélanger des activités qui pourraient être indépendantes.",
  impact: 1, uncertainty: 0.95, decisionRelevance: 1, answerability: 0.9,
};
const PROJECT_SCOPE_CHOICE_QUESTION: QuestionCandidate = {
  ...PROJECT_SCOPE_QUESTION,
  id: "clarify-project-scope-choice-v1",
  prompt: "Pour éviter un malentendu, précise simplement : un seul projet commun, ou plusieurs projets distincts ?",
};
const INTENT_QUESTION_CATALOG: Partial<Record<IntentKind, QuestionCandidate[]>> = {
  organize_event: [
    { id: "event-date-v1", dimension: "context", prompt: "As-tu déjà une date ou une période prévue pour cet événement ?", rationale: "Préciser le calendrier de l'événement.", impact: 1, uncertainty: 0.95, decisionRelevance: 1, answerability: 0.95 },
    { id: "event-guests-v1", dimension: "actor", prompt: "Qui souhaites-tu inviter, et combien de personnes aimerais-tu accueillir environ ?", rationale: "Comprendre le public et l'échelle.", impact: 0.95, uncertainty: 0.9, decisionRelevance: 0.95, answerability: 0.9 },
    { id: "event-capacity-v1", dimension: "constraint", prompt: "Y a-t-il une capacité maximale, des règles d'accès ou des limites à respecter ?", rationale: "Identifier les contraintes pratiques.", impact: 0.9, uncertainty: 0.85, decisionRelevance: 0.9, answerability: 0.85 },
    { id: "event-experience-v1", dimension: "goal", prompt: "Qu'aimerais-tu que les invités puissent vivre ou faire pendant cet événement ?", rationale: "Définir l'expérience attendue.", impact: 0.85, uncertainty: 0.8, decisionRelevance: 0.85, answerability: 0.9 },
  ],
  reservation: [
    { id: "reservation-details-v1", dimension: "constraint", prompt: "Y a-t-il des préférences, besoins particuliers ou conditions à respecter pour cette réservation ?", rationale: "Identifier les conditions importantes.", impact: 0.8, uncertainty: 0.8, decisionRelevance: 0.85, answerability: 0.85 },
  ],
  invitation: [
    { id: "invitation-guests-v1", dimension: "actor", prompt: "Qui souhaites-tu inviter ?", rationale: "Identifier les destinataires.", impact: 0.9, uncertainty: 0.85, decisionRelevance: 0.9, answerability: 0.9 },
    { id: "invitation-response-v1", dimension: "goal", prompt: "Comment les invités devront-ils répondre : confirmer, décliner, choisir une option ou réserver une place ?", rationale: "Comprendre l'action attendue.", impact: 0.95, uncertainty: 0.85, decisionRelevance: 0.95, answerability: 0.9 },
  ],
  request: [
    { id: "request-outcome-v1", dimension: "goal", prompt: "Qu'aimerais-tu obtenir concrètement à la suite de cette demande ?", rationale: "Définir le résultat attendu.", impact: 1, uncertainty: 0.9, decisionRelevance: 1, answerability: 0.9 },
  ],
  create_project: [
    { id: "create-beneficiaries-v1", dimension: "actor", prompt: "Qui utilisera, fera vivre ou bénéficiera de ce projet ?", rationale: "Identifier les personnes et rôles.", impact: 0.9, uncertainty: 0.85, decisionRelevance: 0.9, answerability: 0.9 },
    { id: "create-context-v1", dimension: "context", prompt: "Où et dans quel environnement souhaites-tu créer ce projet ?", rationale: "Situer le projet sans l'enfermer.", impact: 0.8, uncertainty: 0.8, decisionRelevance: 0.85, answerability: 0.9 },
    { id: "create-limits-v1", dimension: "constraint", prompt: "Quelles ressources, limites ou échéances faut-il prendre en compte ?", rationale: "Faire émerger les contraintes.", impact: 0.8, uncertainty: 0.75, decisionRelevance: 0.85, answerability: 0.85 },
  ],
  invention: [
    { id: "invention-users-v1", dimension: "actor", prompt: "À qui cette invention pourrait-elle servir ou quelle situation pourrait-elle transformer ?", rationale: "Identifier les bénéficiaires possibles.", impact: 0.85, uncertainty: 0.85, decisionRelevance: 0.85, answerability: 0.85 },
  ],
  explore: [
    { id: "explore-context-v1", dimension: "context", prompt: "Qu'est-ce qui t'a donné envie d'explorer cette idée maintenant ?", rationale: "Comprendre le déclencheur sans présumer d'un problème.", impact: 0.8, uncertainty: 0.85, decisionRelevance: 0.8, answerability: 0.9 },
  ],
};

const PRIVACY_QUESTION: QuestionCandidate = {
  id: "clarify-privacy-and-consent-v1",
  dimension: "risk",
  prompt: "Qui pourra consulter les relevés, résultats ou informations des personnes concernées ?",
  rationale: "Vérifier les attentes de confidentialité et de transparence lorsque d'autres personnes sont concernées.",
  impact: 0.9, uncertainty: 0.85, decisionRelevance: 0.95, answerability: 0.85,
};

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
  const dossier = session.dossier ?? buildUnderstandingDossier(session.messages);
  const sections = dossier.facets.map((item) => "• " + item.title + " : " + item.content);
  const deferredQuestions = session.deferredDimensions.map((dimension) => {
    const candidate = QUESTION_CATALOG.find((item) => item.dimension === dimension);
    return "• " + (candidate?.prompt ?? dimension);
  });
  const deferredConflicts = session.contradictions
    .filter((item) => session.deferredContradictionKeys.includes(contradictionKey(item)))
    .map((item) => "• " + item.statementA + " / " + item.statementB);
  return [
    "Voici le dossier de compréhension construit à partir de l'ensemble de tes messages :",
    "",
    dossier.title ? "Projet : « " + dossier.title + " »" : "Description initiale : « " + session.originalDescription + " »",
    "",
    "Éléments recueillis :",
    ...(sections.length ? sections : ["• Je conserve ton récit original sans lui attribuer de faits supplémentaires."]),
    "",
    dossier.openQuestions.length ? "Points qui restent à éclaircir :" : "Aucune question essentielle ne ressort encore de ce premier récit.",
    ...(dossier.openQuestions.length ? dossier.openQuestions.map((question) => "• " + question) : []),
    ...(deferredQuestions.length ? ["", "Points laissés en attente :", ...deferredQuestions] : []),
    ...(deferredConflicts.length ? ["", "Indications de cohérence à revoir :", ...deferredConflicts] : []),
    "",
    "Les éléments ci-dessus restent des déclarations issues de tes messages. Rien n'est validé tant que tu ne l'as pas confirmé.",
  ].join("\n");
}

function contradictionKey(item: DiscoveryContradiction): string {
  return `${item.topic}::${item.statementA}::${item.statementB}`;
}

function advance(session: UnderstandingSession): UnderstandingSession {
  const dossier = buildUnderstandingDossier(session.messages);
  session = { ...session, dossier };
  const visitorText = session.messages
    .filter((item) => item.role === "visitor")
    .map((item) => item.content)
    .join("\n");
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

  const hasProjectScope = updatedSession.evidence.some((item) => item.dimension === "project_scope");
  if (discovery.stage === "project_scope" && !hasProjectScope &&
      !updatedSession.deferredDimensions.includes("project_scope")) {
    return {
      ...updatedSession,
      pendingQuestion: PROJECT_SCOPE_QUESTION,
      askedQuestionIds: [...updatedSession.askedQuestionIds, PROJECT_SCOPE_QUESTION.id],
      stage: "clarification",
      version: updatedSession.version + 1,
      messages: [...updatedSession.messages, message(updatedSession.conversationId, "merkora", PROJECT_SCOPE_QUESTION.prompt)],
    };
  }

  const coreDimensions = new Set(dossier.facets.map((item) => item.dimension));
  const hasCompleteOpeningBrief = ["problem", "audience", "goal", "preference", "feature"].every((dimension) => coreDimensions.has(dimension));
  if (updatedSession.askedQuestionIds.length === 0 && hasCompleteOpeningBrief) {
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

  if (updatedSession.askedQuestionIds.length === 0 && !hasCompleteOpeningBrief) {
    const question = intentFirstQuestion(updatedSession);
    const alreadyCovered = updatedSession.evidence.some((item) => item.dimension === question.dimension) ||
      dossier.facets.some((item) => item.dimension === question.dimension);
    if (!alreadyCovered) {
      const next = { ...updatedSession, pendingQuestion: question, askedQuestionIds: [question.id], stage: "clarification" as const, version: updatedSession.version + 1 };
      return { ...next, messages: [...next.messages, message(next.conversationId, "merkora", question.prompt)] };
    }
  }

  const answeredDimensions = [...new Set([
    ...updatedSession.evidence.map((item) => item.dimension),
    ...dossier.facets.map((item) => item.dimension),
  ])];
  const dossierDimensions = new Set(dossier.facets.map((item) => item.dimension));
  const hasRichDescription = ["problem", "audience", "goal", "preference", "feature"].every((dimension) => dossierDimensions.has(dimension));
  const plan = selectNextQuestion({
    candidates: (INTENT_QUESTION_CATALOG[updatedSession.intentKind] ?? QUESTION_CATALOG),
    answeredDimensions,
    deferredDimensions: updatedSession.deferredDimensions,
    askedQuestionIds: updatedSession.askedQuestionIds,
  });

  if (plan.kind === "question" && !hasRichDescription) {
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

  if (dossier.missingDimensions.includes("risk") &&
      !updatedSession.deferredDimensions.includes("risk") &&
      !updatedSession.askedQuestionIds.some((id) => id.includes("risk")) &&
      !updatedSession.askedQuestionIds.includes(PRIVACY_QUESTION.id)) {
    return {
      ...updatedSession,
      pendingQuestion: PRIVACY_QUESTION,
      askedQuestionIds: [...updatedSession.askedQuestionIds, PRIVACY_QUESTION.id],
      stage: "clarification",
      version: updatedSession.version + 1,
      messages: [...updatedSession.messages, message(updatedSession.conversationId, "merkora", PRIVACY_QUESTION.prompt)],
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
    intentKind: classifyIntent(originalDescription),
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
    dossier: buildUnderstandingDossier([firstMessage]),
  };
  return advance(initial);
}

export function answerUnderstanding(session: UnderstandingSession, answer: string): UnderstandingSession {
  const clean = answer.trim();
  if (!clean || session.stage !== "clarification" || !session.pendingQuestion) return session;

  if (session.pendingQuestion.dimension === "project_scope" &&
      /^(oui|non|exactement|d'accord|tout à fait)[.!? ]*$/i.test(clean) &&
      !/un seul projet|même projet|projets distincts|séparément/i.test(clean)) {
    const visitorMessage = message(session.conversationId, "visitor", clean);
    return {
      ...session,
      messages: [
        ...session.messages,
        visitorMessage,
        message(session.conversationId, "merkora", PROJECT_SCOPE_CHOICE_QUESTION.prompt),
      ],
      pendingQuestion: PROJECT_SCOPE_CHOICE_QUESTION,
      askedQuestionIds: [...session.askedQuestionIds, PROJECT_SCOPE_CHOICE_QUESTION.id],
      version: session.version + 1,
    };
  }

  if (REPAIR_PATTERN.test(clean)) {
    const visitorMessage = message(session.conversationId, "visitor", clean);
    const question = repairQuestion(session);
    return {
      ...session,
      messages: [...session.messages, visitorMessage, message(session.conversationId, "merkora", question.prompt)],
      pendingQuestion: question,
      askedQuestionIds: [...session.askedQuestionIds, question.id],
      stage: "clarification",
      dossier: buildUnderstandingDossier([...session.messages, visitorMessage]),
      version: session.version + 1,
    };
  }

  const visitorMessage = message(session.conversationId, "visitor", clean);
  let evidence = extractExplicitEvidence(clean, visitorMessage.id, session.evidence);
  const answerHasPendingDimension = evidence.some((item) =>
    item.dimension === session.pendingQuestion?.dimension &&
    item.sourceMessageId === visitorMessage.id,
  );
  const isExplicitClarification = session.pendingQuestion.dimension === "business_rule" ||
    session.pendingQuestion.dimension === "project_scope";
  if (!answerHasPendingDimension && (evidence.length === session.evidence.length || isExplicitClarification)) {
    evidence = addEvidence(
      evidence,
      session.pendingQuestion.dimension,
      clean,
      visitorMessage.id,
      clean,
    );
  }
  const conflictTopic = session.pendingQuestion.id.startsWith("resolve-contradiction-")
    ? session.pendingQuestion.id.replace("resolve-contradiction-", "").replace("-v1", "")
    : null;
  const clarifiedConflict = conflictTopic
    ? session.contradictions.find((item) => item.topic === conflictTopic)
    : undefined;
  const cumulativeVisitorText = [...session.messages, visitorMessage]
    .filter((item) => item.role === "visitor")
    .map((item) => item.content)
    .join("\n");
  const detectedIntent = classifyIntent(cumulativeVisitorText);
  const updated: UnderstandingSession = {
    ...session,
    intentKind: detectedIntent === "unknown" ? session.intentKind : detectedIntent,
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
    const nextPrompt = session.dossier.openQuestions[0];
    if (nextPrompt) {
      const dimension = session.dossier.missingDimensions[0] ?? "unknown";
      const question: QuestionCandidate = {
        id: "dossier-follow-up-" + dimension + "-v1",
        dimension,
        prompt: nextPrompt,
        rationale: "Cette information manque encore dans le dossier et peut préciser la conception.",
        impact: 0.9, uncertainty: 0.9, decisionRelevance: 0.9, answerability: 0.85,
      };
      return {
        ...session,
        evidence: confirmedEvidence,
        summary: confirmedSummary,
        validations: [...session.validations, validation],
        pendingQuestion: question,
        askedQuestionIds: [...session.askedQuestionIds, question.id],
        stage: "clarification",
        version: session.version + 1,
        messages: [
          ...session.messages,
          message(session.conversationId, "merkora", "Merci. J'ai conservé les éléments que tu viens de confirmer. Il reste un seul point utile à éclaircir : " + question.prompt),
        ],
      };
    }
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
