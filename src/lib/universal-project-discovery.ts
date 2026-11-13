import type { ConversationMessage } from "./assistant/merkora-conversation";
import type { UniversalProjectUnderstanding } from "./universal-project-understanding";

export type DiscoveryStage =
  | "resolve_contradiction"
  | "project_scope"
  | "current_process"
  | "desired_outcome"
  | "people_and_roles"
  | "constraints"
  | "privacy_and_consent"
  | "data_needs"
  | "solution_review";

export type DiscoveryContradiction = {
  topic: "access" | "connectivity" | "automation" | "consent";
  statementA: string;
  statementB: string;
  question: string;
  confirmationRequired: true;
};

export type DiscoveryQuestionSelection = {
  stage: DiscoveryStage;
  contradictions: DiscoveryContradiction[];
  nextQuestion: string;
  remainingGaps: DiscoveryStage[];
  readyForSolutionReview: boolean;
  reason: string;
};

function userHistory(history: ConversationMessage[]): string {
  return history
    .filter((message) => message.role === "user")
    .map((message) => message.content)
    .join(" ");
}

function detectContradictions(rawIntent: string): DiscoveryContradiction[] {
  const statements = rawIntent
    .split(/(?<=[.!?;])\s+|\n+/)
    .map((statement) => statement.trim())
    .filter(Boolean);
  const pairs: Array<{
    topic: DiscoveryContradiction["topic"];
    broad: RegExp;
    restrictive: RegExp;
    question: string;
  }> = [
    {
      topic: "access",
      broad: /tout le monde|tous les membres|toute (?:la|ma|notre) famille|toute l'équipe|tout le personnel|chacun peut consulter|accès à tous/i,
      restrictive: /seul(?:e)? moi|uniquement moi|personne d'autre|seul le responsable|accès privé|moi uniquement/i,
      question: "Qui doit réellement pouvoir consulter ces informations : tout le groupe, certaines personnes précises ou uniquement vous ?",
    },
    {
      topic: "connectivity",
      broad: /connexion permanente|toujours connecté|internet obligatoire|nécessite internet/i,
      restrictive: /sans connexion|hors ligne|offline|même sans internet/i,
      question: "La solution doit-elle fonctionner uniquement avec Internet, uniquement hors ligne ou dans les deux situations ?",
    },
    {
      topic: "automation",
      broad: /automatiser|automatique|tout seul|sans intervention/i,
      restrictive: /manuellement|à la main|sans automatisation|je veux tout faire moi-même/i,
      question: "Quelles opérations doivent être automatiques et lesquelles doivent rester manuelles ?",
    },
    {
      topic: "consent",
      broad: /(?:personnes|participants|visiteurs|employés|membres).{0,70}(?:inform(?:é|e|és|ées)|consent(?:ement|ent)|d'accord)|avec (?:leur|son) accord|après information/i,
      restrictive: /sans (?:les|leur|son) (?:informer|prévenir|avertir)|à leur insu|sans (?:leur )?consentement|collecte cachée|en secret/i,
      question: "Comment garantir que chaque personne concernée sera informée et pourra accepter ou refuser la collecte de ses informations ?",
    },
  ];

  return pairs.flatMap((pair) => {
    const broadIndex = statements.findIndex((statement) => pair.broad.test(statement));
    const restrictiveIndex = statements.findIndex((statement) => pair.restrictive.test(statement));
    if (broadIndex < 0 || restrictiveIndex < 0 || broadIndex === restrictiveIndex) return [];

    // An explicit later correction replaces the earlier preference; it is not
    // an unresolved conflict that should block discovery.
    const laterStatement = statements[Math.max(broadIndex, restrictiveIndex)];
    const explicitCorrection = /\b(finalement|je corrige|je change d'avis|je reviens sur ma décision|à la place de)\b/i.test(laterStatement);
    if (explicitCorrection) return [];

    return [{
      topic: pair.topic,
      statementA: statements[broadIndex],
      statementB: statements[restrictiveIndex],
      question: pair.question,
      confirmationRequired: true as const,
    }];
  });
}

function hasAny(text: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(text));
}

/**
 * A privacy answer only closes the discovery gap when it states an affirmative
 * safeguard. A refusal or absence of consent must remain visible as unresolved.
 */
function hasPositivePrivacyAnswer(text: string): boolean {
  const negativeConsent = [
    /ne\\s+(?:seront|sont|seraient|peuvent|pourront|veulent|doivent)\\s+pas.{0,50}(?:inform|accord|consent)/i,
    /sans.{0,40}(?:informer|prévenir|avertir|accord|consentement)/i,
    /(?:pas|aucun|aucune|refus).{0,35}(?:accord|consentement)/i,
  ];
  if (hasAny(text, negativeConsent)) return false;

  return hasAny(text, [
    /(?:seront|sont|seraient) inform(?:é|és|ées)/i,
    /(?:donner|obtenir|recueillir).{0,35}(?:leur|son) accord/i,
    /(?:avec|après) (?:leur|son) accord/i,
    /consentement (?:libre|explicite|recueilli)/i,
    /(?:accès|consultation) (?:sera|est) (?:privé|confidentiel|limité)/i,
    /seulement moi|uniquement moi|personne d'autre/i,
  ]);
}

/**
 * Selects one next question using current evidence and prior user answers.
 * This deterministic first version flags common conflicts for client clarification;
 * it never resolves them automatically or invents business rules.
 */
export function selectNextDiscoveryQuestion(
  analysis: UniversalProjectUnderstanding,
  history: ConversationMessage[],
): DiscoveryQuestionSelection {
  const answers = [userHistory(history), analysis.rawIntent].join(" ");
  const previousAssistantQuestion = [...history].reverse().find((message) => message.role === "assistant")?.content ?? "";
  const latestStatement = analysis.rawIntent.split(/\n+/).at(-1)?.trim() ?? "";
  const shortAnswerToScopeQuestion =
    /même projet|séparément/i.test(previousAssistantQuestion) &&
    /^(oui|non|exactement|c'est ça|c'est cela|pas du tout)[.!? ]*$/i.test(latestStatement);
  const scopeAlreadyAnswered = shortAnswerToScopeQuestion || hasAny(answers, [
    /même projet|un seul projet|projets distincts|deux projets|séparément/i,
    /(?:ces|les|différents|deux) besoins.{0,60}ensemble/i,
    /regrouper les besoins|séparer les projets/i,
  ]);
  // Compare client statements across turns, not just the latest message.
  const contradictions = detectContradictions(answers);
  const gaps: Array<{ stage: DiscoveryStage; question: string; reason: string }> = [];

  if (contradictions.length > 0) {
    gaps.push({
      stage: "resolve_contradiction",
      question: contradictions[0].question,
      reason: "Deux indications du client semblent incompatibles et doivent être clarifiées avant de concevoir les accès ou le fonctionnement.",
    });
  }

  if (analysis.intentGroups.length > 1 && !scopeAlreadyAnswered) {
    gaps.push({
      stage: "project_scope",
      question: "Les différents besoins que vous avez cités font-ils partie d'un même projet ou souhaitez-vous les traiter séparément ?",
      reason: "Plusieurs intentions ont été repérées ; leur relation doit être clarifiée en premier.",
    });
  }

  if (!analysis.currentSituation && !hasAny(answers, [
    /aujourd'hui|actuellement|pour le moment|en ce moment|je note|on note|nous notons|cahier|registre|excel|tableur|whatsapp|à la main|manuellement|je ne fais rien|aucun suivi/i,
  ])) {
    gaps.push({
      stage: "current_process",
      question: "Comment procédez-vous aujourd'hui pour gérer cette situation, même si c'est de façon simple ou informelle ?",
      reason: "Le fonctionnement actuel n'est pas encore décrit.",
    });
  }

  if (!analysis.desiredOutcomes.length && !hasAny(answers, [
    /je veux|mon objectif|mon souhait|cela me permettra|pour pouvoir|afin de|j'aimerais|je voudrais/i,
  ])) {
    gaps.push({
      stage: "desired_outcome",
      question: "Quel résultat concret voudriez-vous obtenir une fois le problème résolu ?",
      reason: "Le résultat attendu reste à préciser.",
    });
  }

  if (!analysis.actors.length && !hasAny(answers, [
    /je suis seul|uniquement moi|avec mon|avec ma|les membres|les personnes|les employés|les clients|les visiteurs|mon équipe|ma famille/i,
  ])) {
    gaps.push({
      stage: "people_and_roles",
      question: "Qui sera concerné par cette organisation, et qui devra participer ou prendre les décisions ?",
      reason: "Les personnes concernées et leurs responsabilités ne sont pas établies.",
    });
  }

  if (!analysis.constraints.length && !hasAny(answers, [
    /budget|fcfa|franc|connexion|internet|hors ligne|téléphone|ordinateur|tablette|délai|urgent|temps disponible/i,
  ])) {
    gaps.push({
      stage: "constraints",
      question: "Quelles limites devons-nous respecter : budget, délais, appareils disponibles, connexion Internet ou temps disponible ?",
      reason: "Les contraintes pratiques ne sont pas encore connues.",
    });
  }

  if (analysis.privacyConsiderations.length > 0 && !hasPositivePrivacyAnswer(answers)) {
    gaps.push({
      stage: "privacy_and_consent",
      question: "Les personnes concernées seront-elles informées et d'accord avec l'utilisation de leurs informations, et qui pourra les consulter ?",
      reason: "La demande touche des informations concernant d'autres personnes.",
    });
  }

  if (analysis.intentGroups.length > 0 && !hasAny(answers, [
    /nom|date|heure|montant|adresse|justificatif|historique|document|information|donnée|donnee|rapport/i,
  ])) {
    gaps.push({
      stage: "data_needs",
      question: "Quelles informations sont réellement indispensables pour atteindre votre objectif, et lesquelles ne faut-il surtout pas collecter ?",
      reason: "Les informations nécessaires et les limites de collecte restent à définir.",
    });
  }

  if (gaps.length > 0) {
    return {
      stage: gaps[0].stage,
      contradictions,
      nextQuestion: gaps[0].question,
      remainingGaps: gaps.map((gap) => gap.stage),
      readyForSolutionReview: false,
      reason: gaps[0].reason,
    };
  }

  return {
    stage: "solution_review",
    contradictions,
    nextQuestion: "Nous avons les premières informations essentielles. Souhaitez-vous vérifier ensemble ce résumé avant de comparer les différentes formes de solution ?",
    remainingGaps: [],
    readyForSolutionReview: true,
    reason: "Les principaux points de découverte ont reçu une première réponse ; le client doit encore valider le résumé.",
  };
}
