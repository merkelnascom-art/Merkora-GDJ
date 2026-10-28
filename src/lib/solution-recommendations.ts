export type NeedCategory =
  | "business"
  | "digital"
  | "creative"
  | "organization"
  | "personal"
  | "other";

export type ProjectStatus =
  | "discovery"
  | "design"
  | "awaiting_approval"
  | "in_progress"
  | "verification"
  | "delivered";

export type NeedInput = {
  title: string;
  category: NeedCategory;
  problem: string;
  desiredOutcome: string;
  budget: string;
  urgency: string;
};

export type Recommendation = {
  title: string;
  description: string;
  reason: string;
};

export function getCategoryLabel(category: NeedCategory): string {
  const labels: Record<NeedCategory, string> = {
    business: "Entreprise / activité",
    digital: "Solution numérique",
    creative: "Création / communication",
    organization: "Organisation / équipe",
    personal: "Besoin personnel",
    other: "Autre besoin",
  };
  return labels[category];
}

export function buildRecommendations(input: NeedInput): Recommendation[] {
  const text = `${input.problem} ${input.desiredOutcome} ${input.title}`.toLocaleLowerCase("fr");
  const suggestions: Recommendation[] = [
    {
      title: "Clarifier le besoin",
      description: "Décomposer le problème, les personnes concernées et le résultat attendu.",
      reason: "Une définition claire évite de construire une solution qui ne répond pas au vrai problème.",
    },
  ];

  if (/personnel|employ|équipe|retard|horaire|présence|stock|vente|caisse|recette|client|boutique|entreprise/.test(text) || input.category === "business" || input.category === "organization") {
    suggestions.push({
      title: "Structurer le fonctionnement",
      description: "Cartographier les rôles, les étapes, les informations à suivre et les validations nécessaires.",
      reason: "Votre demande semble concerner l'organisation d'une activité ou d'un groupe.",
    });
  }

  if (/application|plateforme|site|numérique|logiciel|automatis|donnée|internet|en ligne/.test(text) || input.category === "digital") {
    suggestions.push({
      title: "Évaluer une solution numérique",
      description: "Comparer un outil existant, une automatisation et une application sur mesure.",
      reason: "Le besoin pourrait bénéficier d'un outil numérique, à confirmer après analyse.",
    });
  }

  if (/logo|image|vidéo|video|design|visuel|marque|affiche|création|creation|communication/.test(text) || input.category === "creative") {
    suggestions.push({
      title: "Préparer une proposition créative",
      description: "Définir le style, les supports, les contenus attendus et les critères de validation.",
      reason: "Un cadre visuel partagé permet de valider la direction avant la production.",
    });
  }

  if (input.category === "personal") {
    suggestions.push({
      title: "Construire un plan d'action",
      description: "Découper l'objectif en étapes réalistes avec des ressources et des points de contrôle.",
      reason: "Un plan progressif peut rendre votre objectif plus facile à mettre en œuvre.",
    });
  }

  if (suggestions.length === 1) {
    suggestions.push({
      title: "Comparer plusieurs approches",
      description: "Examiner une solution simple, une solution intermédiaire et une option plus complète.",
      reason: "Comparer les options aide à choisir selon vos contraintes et vos priorités.",
    });
  }

  return suggestions.slice(0, 4);
}

export function validateNeed(input: NeedInput): string[] {
  const errors: string[] = [];
  if (input.title.trim().length < 3) errors.push("Donnez un titre d'au moins 3 caractères.");
  if (input.problem.trim().length < 15) errors.push("Décrivez le problème en au moins 15 caractères.");
  if (input.desiredOutcome.trim().length < 8) errors.push("Précisez le résultat que vous souhaitez obtenir.");
  return errors;
}