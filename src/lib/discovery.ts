import {
  buildRecommendations,
  validateNeed,
  type NeedInput,
  type Recommendation,
} from "./solution-recommendations";
import {
  identifyDomain,
  getDomainQuestions,
  type DomainId,
  type DomainMatch,
} from "./domain-registry";

export type DiscoveryDomain =
  | "education"
  | "commerce"
  | "creative"
  | "digital"
  | "personal"
  | "general";

export type DiscoveryState = "incomplete" | "needs_clarification" | "preliminary";

export type DiscoveryResult = {
  state: DiscoveryState;
  domain: DiscoveryDomain;
  domainId: DomainId | null;
  specializationId: string | null;
  domainLabel: string;
  confidence: "high" | "medium" | "low";
  isPreliminary: true;
  understood: string[];
  questions: string[];
  recommendations: Recommendation[];
  notice: string;
};

function legacyDomain(match: DomainMatch, input: NeedInput): DiscoveryDomain {
  if (match.domain && match.confidence !== "low") {
    if (match.domain.id === "education-formation") return "education";
    if (match.domain.id === "commerce" || match.domain.id === "ressources-humaines" ||
        match.domain.id === "entrepreneuriat-finance") return "commerce";
    if (match.domain.id === "voyage-tourisme-creation-jeux" &&
        match.specialization?.id === "audiovisual") return "creative";
    return "digital";
  }
  if (input.category === "personal") return "personal";
  if (input.category === "business" || input.category === "organization") return "commerce";
  if (input.category === "creative") return "creative";
  if (input.category === "digital") return "digital";
  return "general";
}

function isVague(input: NeedInput): boolean {
  const text = `${input.problem} ${input.desiredOutcome}`.toLocaleLowerCase("fr");
  return text.length < 35 || /quelque chose|je ne sais pas encore quoi|pas encore précis|pas encore precis|à définir|a definir/.test(text);
}

export function analyzeNeed(input: NeedInput): DiscoveryResult {
  const validation = validateNeed(input);
  const fullText = `${input.title} ${input.problem} ${input.desiredOutcome}`;
  const match = identifyDomain(fullText);
  const domain = legacyDomain(match, input);
  const vague = isVague(input);
  const domainId = match.domain?.id ?? null;
  const specializationId = match.specialization?.id ?? null;
  const domainLabel = match.domain?.label ?? (domain === "general" ? "Domaine à préciser" :
    domain === "education" ? "Éducation et formation" :
    domain === "commerce" ? "Entreprise, commerce et organisation" :
    domain === "creative" ? "Création et communication" :
    domain === "digital" ? "Solution numérique" : "Objectif personnel");
  const base = {
    domain,
    domainId,
    specializationId,
    domainLabel,
    confidence: match.confidence,
    isPreliminary: true as const,
  };

  if (validation.length > 0) {
    const questions: string[] = [];
    if (input.title.trim().length < 3) questions.push("Comment souhaitez-vous appeler ce projet ou ce besoin ?");
    if (input.problem.trim().length < 15) questions.push("Que se passe-t-il aujourd’hui, concrètement ?");
    if (input.desiredOutcome.trim().length < 8) questions.push("Quel changement aimeriez-vous obtenir ?");
    return {
      ...base,
      state: "incomplete",
      understood: [],
      questions,
      recommendations: [],
      notice: "Il manque des informations essentielles. Aucune proposition n’est encore formulée.",
    };
  }

  if (!match.domain || vague || match.confidence === "low" && match.score < 3) {
    return {
      ...base,
      state: "needs_clarification",
      understood: [input.problem.trim(), `Résultat souhaité : ${input.desiredOutcome.trim()}`],
      questions: getDomainQuestions(match),
      recommendations: buildRecommendations(input),
      notice: "Le domaine ou le sous-métier reste à confirmer. Les pistes sont exploratoires et ne constituent pas une décision.",
    };
  }

  const understood = [
    input.problem.trim(),
    `Résultat souhaité : ${input.desiredOutcome.trim()}`,
    `Domaine repéré : ${domainLabel}`,
    ...(match.specialization ? [`Spécialisation repérée : ${match.specialization.label}`] : []),
  ];
  const questions = getDomainQuestions(match);
  return {
    ...base,
    state: "preliminary",
    understood,
    questions,
    recommendations: buildRecommendations(input),
    notice: "Cette première lecture utilise le référentiel métier MerKora. Confirmez le domaine, la spécialisation et les pistes avant de préparer un cahier des charges.",
  };
}
