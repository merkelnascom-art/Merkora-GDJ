import type { Project } from "./project-types";
import type { Recommendation } from "./solution-recommendations";
import type { CompetitiveAnalysis, CompetitorInput } from "./competitive-analysis";

export type LocalImprovement = {
  title: string;
  description: string;
  expectedBenefit: string;
  effort: "low" | "medium" | "high" | "unknown";
  priority: "high" | "medium" | "low";
  assumptions: string[];
};

export type LocalAnalysis = {
  summary: string;
  domain: string;
  understood: string[];
  questions: string[];
  recommendations: Recommendation[];
  improvements: LocalImprovement[];
  competitiveAnalysis: CompetitiveAnalysis;
  assumptions: string[];
  nextSteps: string[];
};

export function buildLocalAnalysis(project: Project, competitors: CompetitorInput[] = []): LocalAnalysis {
  const improvementByCategory: Record<Project["category"], LocalImprovement> = {
    business: {
      title: "Définir les indicateurs de suivi",
      description: "Lister les données à suivre, leur responsable, leur fréquence de mise à jour et la méthode de vérification.",
      expectedBenefit: "Réduire les oublis et rendre les décisions plus vérifiables.",
      effort: "low", priority: "high", assumptions: ["Les indicateurs prioritaires restent à confirmer avec les utilisateurs."],
    },
    organization: {
      title: "Clarifier les rôles et les responsabilités",
      description: "Définir qui réalise chaque tâche, qui la valide et comment les retards ou exceptions sont signalés.",
      expectedBenefit: "Limiter les zones de flou et faciliter le suivi de l’activité.",
      effort: "low", priority: "high", assumptions: ["L’équipe et ses responsabilités exactes ne sont pas encore détaillées."],
    },
    digital: {
      title: "Comparer l’existant avant de développer",
      description: "Comparer une solution déjà disponible, une automatisation simple et un développement sur mesure selon les usages nécessaires.",
      expectedBenefit: "Éviter de payer pour une application personnalisée si un outil existant suffit.",
      effort: "medium", priority: "high", assumptions: ["Les outils déjà utilisés et les contraintes techniques sont à préciser."],
    },
    creative: {
      title: "Définir les critères de validation créative",
      description: "Lister les supports, le public visé, le style, les formats finaux et les critères d’acceptation avant la production.",
      expectedBenefit: "Réduire les retours tardifs et les écarts entre l’attendu et le résultat.",
      effort: "low", priority: "medium", assumptions: ["Les formats et références visuelles restent à confirmer."],
    },
    personal: {
      title: "Découper l’objectif en étapes vérifiables",
      description: "Transformer l’objectif en petites étapes, avec les ressources disponibles et un point de contrôle pour chacune.",
      expectedBenefit: "Rendre le progrès visible et aider à ajuster le plan.",
      effort: "low", priority: "medium", assumptions: ["Les ressources et les échéances exactes ne sont pas encore connues."],
    },
    other: {
      title: "Clarifier le résultat prioritaire",
      description: "Définir les personnes concernées, la situation actuelle et les signes concrets qui montreraient une amélioration.",
      expectedBenefit: "Mieux comparer les solutions avant de choisir une direction.",
      effort: "low", priority: "high", assumptions: ["Le domaine et les contraintes doivent encore être confirmés."],
    },
  };
  const supplied = competitors.filter((item) => Object.values(item).some((value) => value.trim()));
  const competitiveAnalysis: CompetitiveAnalysis = {
    summary: supplied.length
      ? "Les sources que tu as saisies sont conservées pour une comparaison ultérieure. Ce mode local n’effectue aucune vérification indépendante et ne conclut pas qu’un concurrent est meilleur."
      : "La concurrence n’a pas été vérifiée. Ajoute des noms, des offres ou des sources publiques pour préparer une comparaison factuelle.",
    comparisonCriteria: ["Public cible", "Fonctionnalités", "Modèle de prix", "Expérience utilisateur", "Assistance", "Limites et différenciation"],
    opportunities: [],
    unknowns: ["Les offres actuelles, les prix et la qualité des concurrents doivent être vérifiés à partir de sources datées."],
    nextSteps: ["Identifier les alternatives réellement utilisées par le public cible.", "Consigner la date et la source de chaque prix ou fonctionnalité observés."],
    researchStatus: supplied.length ? "user_supplied" : "not_verified",
  };
  return {
    summary: "Pré-analyse locale gratuite fondée sur les informations de ce dossier et des règles simples. Ce résultat n’est pas généré par un modèle IA et doit être confirmé.",
    domain: project.discovery?.domainLabel || project.category,
    understood: project.discovery?.understood?.length
      ? [...project.discovery.understood]
      : [project.problem, `Résultat souhaité : ${project.desiredOutcome}`],
    questions: project.discovery?.questions?.length ? [...project.discovery.questions] : ["Quelles contraintes ou ressources faut-il prendre en compte avant de choisir ?"],
    recommendations: project.recommendations.map((item) => ({ ...item })),
    improvements: [improvementByCategory[project.category]],
    competitiveAnalysis,
    assumptions: ["Aucun fournisseur IA n’a été appelé.", "Les recommandations sont préliminaires et ne constituent pas un devis."],
    nextSteps: ["Confirmer les informations manquantes avec les personnes concernées.", "Comparer les pistes selon les besoins, les contraintes et le coût total."],
  };
}
