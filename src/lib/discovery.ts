import {
  buildRecommendations,
  validateNeed,
  type NeedInput,
  type Recommendation,
} from "./solution-recommendations";

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
  domainLabel: string;
  isPreliminary: true;
  understood: string[];
  questions: string[];
  recommendations: Recommendation[];
  notice: string;
};

const domainLabels: Record<DiscoveryDomain, string> = {
  education: "Orientation scolaire et professionnelle",
  commerce: "Commerce et organisation d’activité",
  creative: "Création et communication",
  digital: "Solution numérique",
  personal: "Objectif personnel",
  general: "Domaine à préciser",
};

function classifyDomain(input: NeedInput): DiscoveryDomain {
  const text = `${input.title} ${input.problem} ${input.desiredOutcome}`.toLocaleLowerCase("fr");

  // Education must be checked before generic digital terms such as “plateforme”.
  if (/élève|eleve|bac\b|métier|metier|relevé|releve|orientation|parcours scolaire|bulletin|notes scolaires|étudiant|etudiant|école|ecole|formation professionnelle|choix de carrière/.test(text)) {
    return "education";
  }
  if (/boutique|magasin|vente|ventes|stock|caisse|recette|client|commerce|commande|personnel|employé|employe|équipe|equipe|horaire|présence|presence|retard|salaire|paie/.test(text)) {
    return "commerce";
  }
  if (/logo|affiche|identité visuelle|identite visuelle|vidéo|video|visuel|marque|design graphique|impression textile|communication/.test(text)) {
    return "creative";
  }
  if (/application|site web|logiciel|automatisation|outil numérique|outil numerique|base de données|base de donnees|espace client|plateforme de réservation|plateforme de reservation/.test(text)) {
    return "digital";
  }
  if (input.category === "personal" && text.trim().length > 0) return "personal";
  return "general";
}

function isVague(input: NeedInput): boolean {
  const text = `${input.problem} ${input.desiredOutcome}`.toLocaleLowerCase("fr");
  return text.length < 35 || /quelque chose|je ne sais pas encore quoi|pas encore précis|pas encore precis|à définir|a definir|je ne sais pas/.test(text);
}

export function analyzeNeed(input: NeedInput): DiscoveryResult {
  const validation = validateNeed(input);
  const domain = classifyDomain(input);
  const vague = isVague(input);
  const questions: string[] = [];

  if (validation.length > 0) {
    if (input.title.trim().length < 3) questions.push("Comment souhaitez-vous appeler ce projet ou ce besoin ?");
    if (input.problem.trim().length < 15) questions.push("Que se passe-t-il aujourd’hui, concrètement ?");
    if (input.desiredOutcome.trim().length < 8) questions.push("Quel changement aimeriez-vous obtenir ?");
    return {
      state: "incomplete",
      domain,
      domainLabel: domainLabels[domain],
      isPreliminary: true,
      understood: [],
      questions,
      recommendations: [],
      notice: "Il manque des informations essentielles. Aucune proposition n’est encore formulée.",
    };
  }

  if (domain === "general" || vague) {
    questions.push("Qui rencontre ce problème : vous, des élèves, des clients, une équipe ou d’autres personnes ?");
    questions.push("Dans quelle situation précise le problème apparaît-il le plus souvent ?");
    questions.push("À quoi reconnaîtriez-vous que la situation s’est améliorée ?");
    return {
      state: "needs_clarification",
      domain,
      domainLabel: domainLabels[domain],
      isPreliminary: true,
      understood: [input.problem.trim(), `Résultat souhaité : ${input.desiredOutcome.trim()}`],
      questions,
      recommendations: buildRecommendations(input),
      notice: "Le domaine ou le résultat reste trop incertain pour recommander une solution précise.",
    };
  }

  const understood = [input.problem.trim(), `Résultat souhaité : ${input.desiredOutcome.trim()}`];
  if (domain === "education") {
    questions.push("Quels éléments doivent compter dans l’orientation : matières préférées, résultats, intérêts, contraintes ou tous ces critères ?");
    questions.push("Les recommandations doivent-elles couvrir les métiers, les formations, les écoles ou les trois ?");
  } else if (domain === "commerce") {
    questions.push("Quelles informations sont prioritaires : ventes, stocks, caisse, personnel ou plusieurs à la fois ?");
    questions.push("Qui devra utiliser l’outil et quelles informations chaque personne pourra-t-elle voir ?");
  } else if (domain === "creative") {
    questions.push("Quels supports faut-il produire et quel style souhaitez-vous obtenir ?");
  } else if (domain === "digital") {
    questions.push("Qui utilisera la solution et sur quels appareils doit-elle fonctionner ?");
  } else {
    questions.push("Quel délai et quelles ressources avez-vous en tête ?");
  }

  return {
    state: "preliminary",
    domain,
    domainLabel: domainLabels[domain],
    isPreliminary: true,
    understood,
    questions,
    recommendations: buildRecommendations(input),
    notice: "Cette première lecture repose sur des règles locales. Elle doit être confirmée avec vous avant toute proposition définitive.",
  };
}
