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
  approach?: "simple" | "existing_tool" | "custom";
  tradeoff?: string;
  nextStep?: string;
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
  const has = (pattern: RegExp) => pattern.test(text);
  const isTeamOrBusiness = input.category === "business" || input.category === "organization"
    || has(/personnel|employ|équipe|retard|horaire|présence|stock|vente|caisse|recette|client|boutique|entreprise|commande|facture|dépense|dépenses/);
  const isDigital = input.category === "digital"
    || has(/application|plateforme|site|numérique|logiciel|automatis|donnée|internet|en ligne|connexion|compte utilisateur/);
  const isCreative = input.category === "creative"
    || has(/logo|image|vidéo|video|design|visuel|marque|affiche|création|creation|communication|publicité|publicite/);
  const isTracking = has(/suivre|suivi|contrôle|controle|historique|rapport|statistique|mesurer|tableau de bord|alerte|notification/);
  const isUrgent = input.urgency === "urgent" || input.urgency === "high";

  const recommendations: Recommendation[] = [{
    title: "Préciser le problème à résoudre",
    description: "Décrire le déclencheur du problème, les personnes concernées, sa fréquence et ses conséquences concrètes.",
    reason: "On doit comprendre la cause et le résultat attendu avant de choisir un outil ou de chiffrer un travail.",
    nextStep: "Donner un exemple récent et expliquer comment vous saurez que la situation s'est améliorée.",
  }];

  if (isTeamOrBusiness) {
    recommendations.push({
      title: "Mettre au clair le fonctionnement",
      description: "Définir les rôles, les étapes de travail, les informations à enregistrer et les décisions qui nécessitent une validation.",
      reason: "Une règle de fonctionnement claire peut résoudre une partie du problème avant même d'ajouter un logiciel.",
      approach: "simple",
      tradeoff: "Démarrage rapide et peu coûteux, mais le suivi reste manuel si l'activité grandit.",
      nextStep: "Lister qui fait quoi, à quel moment, et qui valide le résultat.",
    });
  }

  if (isTracking) {
    recommendations.push({
      title: "Créer un suivi mesurable",
      description: "Choisir quelques indicateurs utiles, un historique fiable et un rapport qui permet de repérer les écarts.",
      reason: "Le besoin mentionne le suivi ou le contrôle ; les données doivent aider à décider, pas seulement s'accumuler.",
      approach: isDigital ? "existing_tool" : "simple",
      tradeoff: "Un tableau simple suffit pour commencer, mais les mises à jour doivent être régulières et fiables.",
      nextStep: "Choisir les 3 à 5 informations qui doivent absolument apparaître dans le suivi.",
    });
  }

  if (isCreative) {
    recommendations.push({
      title: "Valider une direction créative",
      description: "Préparer un brief avec le public visé, le message, les formats, le style et les critères d'acceptation.",
      reason: "Un aperçu validable avant production limite les incompréhensions et les retouches.",
      approach: "simple",
      tradeoff: "Le brief accélère la validation, mais les contenus et dimensions finaux doivent être confirmés.",
      nextStep: "Réunir les exemples visuels appréciés, les textes exacts et les formats attendus.",
    });
  }

  if (isDigital) {
    recommendations.push({
      title: "Comparer les options numériques",
      description: "Comparer un outil existant, une automatisation légère et une application sur mesure à partir des usages réellement nécessaires.",
      reason: "Le numérique est une piste possible, mais il faut éviter de développer une plateforme complète si un outil plus simple suffit.",
      approach: "existing_tool",
      tradeoff: "Un outil existant peut coûter moins cher au départ ; une solution sur mesure offre plus de contrôle mais demande plus de conception et de maintenance.",
      nextStep: "Définir les utilisateurs, les appareils, les droits d'accès et les tâches à automatiser en priorité.",
    });
  }

  if (input.category === "personal") {
    recommendations.push({
      title: "Découper l'objectif en étapes",
      description: "Transformer le résultat souhaité en actions réalisables, avec des ressources, une échéance et un point de vérification.",
      reason: "Un objectif décomposé devient plus facile à commencer et à ajuster.",
      approach: "simple",
      tradeoff: "Le plan est flexible, mais il dépend d'un suivi régulier.",
      nextStep: "Choisir la première action réalisable et le signe concret qui montrera qu'elle est terminée.",
    });
  }

  if (!isTeamOrBusiness && !isDigital && !isCreative && input.category !== "personal") {
    recommendations.push({
      title: "Comparer trois niveaux de réponse",
      description: "Étudier une méthode simple, l'adaptation d'un outil existant et une solution personnalisée.",
      reason: "Le choix doit dépendre du besoin réel, du budget et des contraintes, pas seulement de la technologie.",
      approach: "custom",
      tradeoff: "Une solution personnalisée peut mieux épouser le besoin, mais elle augmente le coût initial et l'effort de maintenance.",
      nextStep: "Définir les fonctions indispensables et celles qui peuvent attendre.",
    });
  }

  if (isUrgent) {
    recommendations.push({
      title: "Prévoir une mesure immédiate",
      description: "Identifier une action temporaire à faible risque pendant que la solution durable est étudiée.",
      reason: "La priorité déclarée invite à réduire rapidement les conséquences sans précipiter un choix coûteux.",
      approach: "simple",
      tradeoff: "La mesure temporaire soulage le problème mais ne remplace pas le traitement de sa cause.",
      nextStep: "Choisir une mesure réversible et vérifier son effet après une courte période.",
    });
  }

  if (recommendations.length < 3) {
    recommendations.push({
      title: "Définir les critères de réussite",
      description: "Choisir des résultats observables, des contraintes non négociables et les personnes qui valideront la solution.",
      reason: "Des critères explicites permettront de comparer les propositions de façon équitable.",
      nextStep: "Formuler deux ou trois signes mesurables d'amélioration.",
    });
  }

  return recommendations.slice(0, 4);
}

export function validateNeed(input: NeedInput): string[] {
  const errors: string[] = [];
  if (input.title.trim().length < 3) errors.push("Donnez un titre d'au moins 3 caractères.");
  if (input.problem.trim().length < 15) errors.push("Décrivez le problème en au moins 15 caractères.");
  if (input.desiredOutcome.trim().length < 8) errors.push("Précisez le résultat que vous souhaitez obtenir.");
  return errors;
}
