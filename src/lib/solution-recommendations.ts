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

  // Check concrete domains before generic technology words: an education platform
  // should not accidentally receive retail recommendations just because it is an app.
  if (/élève|eleve|bac\b|métier|metier|relevé|releve|orientation|parcours scolaire|bulletin|notes scolaires|étudiant|etudiant|école|ecole|formation professionnelle|choix de carrière/.test(text)) {
    suggestions.push({
      title: "Explorer l’orientation scolaire et professionnelle",
      description: "Relier les résultats scolaires, les matières appréciées, les intérêts et les contraintes à des familles de métiers et de formations à explorer.",
      reason: "L’objectif décrit concerne le choix d’un parcours d’études ou d’un métier, pas la gestion d’une boutique.",
    });
    suggestions.push({
      title: "Définir une méthode d’évaluation",
      description: "Prévoir des questionnaires, des tests d’intérêts et des critères explicites, puis faire valider les pistes par un conseiller qualifié.",
      reason: "Les résultats scolaires seuls ne suffisent pas à décider d’un avenir professionnel.",
    });
    return suggestions.slice(0, 4);
  }

  if (/boutique|magasin|vente|ventes|stock|caisse|recette|client|commerce|commande|personnel|employé|employe|équipe|equipe|horaire|présence|presence|retard|salaire|paie/.test(text) || input.category === "business" || input.category === "organization") {
    suggestions.push({
      title: "Organiser les opérations commerciales",
      description: "Identifier les informations à suivre pour les ventes, les stocks, la caisse, les commandes et les validations.",
      reason: "Votre description indique un besoin de pilotage quotidien d’une activité commerciale ou d’une équipe.",
    });
    suggestions.push({
      title: "Définir les rôles et les accès",
      description: "Distinguer ce que le responsable, les employés et les autres collaborateurs peuvent consulter ou modifier.",
      reason: "Des responsabilités claires facilitent le suivi et limitent les erreurs.",
    });
    return suggestions.slice(0, 4);
  }

  if (/logo|affiche|identité visuelle|identite visuelle|vidéo|video|visuel|marque|design graphique|impression textile|communication/.test(text) || input.category === "creative") {
    suggestions.push({
      title: "Préparer une proposition créative",
      description: "Définir les supports, le style, les contenus attendus et les critères de validation avant la production.",
      reason: "Un cadre visuel partagé permet de valider la direction avant de produire les éléments finaux.",
    });
    return suggestions.slice(0, 4);
  }

  if (/application|site web|logiciel|automatisation|outil numérique|outil numerique|base de données|base de donnees|espace client/.test(text) || input.category === "digital") {
    suggestions.push({
      title: "Évaluer une solution numérique",
      description: "Comparer un outil existant, une automatisation et une application sur mesure selon les usages, les coûts et les contraintes.",
      reason: "La technologie doit être choisie après clarification des utilisateurs et des tâches à accomplir.",
    });
    return suggestions.slice(0, 4);
  }

  if (input.category === "personal") {
    suggestions.push({
      title: "Construire un plan d’action",
      description: "Découper l’objectif en étapes réalistes, avec des ressources et des points de contrôle.",
      reason: "Un plan progressif peut rendre votre objectif plus facile à mettre en œuvre.",
    });
    return suggestions.slice(0, 4);
  }

  suggestions.push({
    title: "Préciser le contexte avant de choisir",
    description: "Identifier les personnes concernées, la situation qui déclenche le besoin et le résultat prioritaire avant de comparer les solutions.",
    reason: "Les informations actuelles ne permettent pas encore d’identifier un domaine ou une solution avec assez de confiance.",
  });
  return suggestions;
}

export function validateNeed(input: NeedInput): string[] {
  const errors: string[] = [];
  if (input.title.trim().length < 3) errors.push("Donnez un titre d'au moins 3 caractères.");
  if (input.problem.trim().length < 15) errors.push("Décrivez le problème en au moins 15 caractères.");
  if (input.desiredOutcome.trim().length < 8) errors.push("Précisez le résultat que vous souhaitez obtenir.");
  return errors;
}