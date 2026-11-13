import type { ConversationMessage } from "./assistant/merkora-conversation";
import type { UniversalProjectUnderstanding } from "./universal-project-understanding";

export type DiscoveryStage =
  | "project_scope"
  | "current_process"
  | "desired_outcome"
  | "people_and_roles"
  | "constraints"
  | "privacy_and_consent"
  | "data_needs"
  | "solution_review";

export type DiscoveryQuestionSelection = {
  stage: DiscoveryStage;
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

function hasAny(text: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(text));
}

/**
 * Selects one next question using current evidence and prior user answers.
 * This is a deterministic first version: it does not claim to resolve
 * contradictions or infer business rules from conversation history.
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
    /même projet|un seul projet|ensemble|séparément|projets distincts|deux projets/i,
  ]);
  const gaps: Array<{ stage: DiscoveryStage; question: string; reason: string }> = [];

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

  if (analysis.privacyConsiderations.length > 0 && !hasAny(answers, [
    /accord|consentement|informé|informés|autorisé|autorisés|confidentiel|privé|personne ne|seulement moi/i,
  ])) {
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
      nextQuestion: gaps[0].question,
      remainingGaps: gaps.map((gap) => gap.stage),
      readyForSolutionReview: false,
      reason: gaps[0].reason,
    };
  }

  return {
    stage: "solution_review",
    nextQuestion: "Nous avons les premières informations essentielles. Souhaitez-vous vérifier ensemble ce résumé avant de comparer les différentes formes de solution ?",
    remainingGaps: [],
    readyForSolutionReview: true,
    reason: "Les principaux points de découverte ont reçu une première réponse ; le client doit encore valider le résumé.",
  };
}
