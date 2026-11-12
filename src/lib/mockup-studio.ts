import type { Project } from "./project-types";
import { identifyDomain } from "./domain-registry";
import { analyzeNeed } from "./discovery";
import { getDomainOptionCatalog, type DomainOption } from "./domain-options";
import { getUniversalFamilyById } from "./universal-reference";
import { getUniversalFamilyCandidatesForOperationalDomain } from "./universal-domain-mapping";
import type { ProfessionCandidate } from "./profession-reference";
import { buildActivityDiagnosticPlan, type ActivityDiagnosticPlan } from "./activity-diagnostic";

export type MockupFormat = "website" | "mobile" | "dashboard";
export type MockupPalette = "violet" | "blue" | "emerald" | "amber";
export type MockupConfig = {
  format: MockupFormat;
  palette: MockupPalette;
  enabledModules: string[];
  /** True only after the client has actively confirmed a module selection. */
  moduleSelectionConfirmed?: boolean;
  /** Missing means legacy/default behavior: show every proposed solution track. */
  selectedRecommendationIds?: string[];
  /** Profession candidates are selected only after explicit client confirmation. */
  selectedProfessionCandidateIds?: string[];
  selectedUniversalSectorIds?: string[];
};
export type MockupModule = DomainOption;
export type MockupRecommendation = MockupModule & { reason: string };
export type MockupDomain = "education" | "operations" | "creative" | "digital" | "general";
export type MockupModel = {
  title: string;
  headline: string;
  supportingCopy: string;
  domain: MockupDomain;
  domainLabel: string;
  domainId: string | null;
  specializationId: string | null;
  universalFamilyCandidates: Array<{ id: string; label: string }>;
  professionCandidates: ProfessionCandidate[];
  selectedProfessionCandidates: ProfessionCandidate[];
  activityDiagnostic: ActivityDiagnosticPlan;
  transversalOptions: MockupModule[];
  format: MockupFormat;
  formatLabel: string;
  palette: MockupPalette;
  modules: MockupModule[];
  visibleModules: MockupModule[];
  recommendations: MockupRecommendation[];
  visibleRecommendations: MockupRecommendation[];
  conceptNotice: string;
};

const formatLabels: Record<MockupFormat, string> = {
  website: "Site web",
  mobile: "Application mobile",
  dashboard: "Tableau de bord",
};

const domainLabels: Record<MockupDomain, string> = {
  education: "Orientation et éducation",
  operations: "Organisation et opérations",
  creative: "Création et communication",
  digital: "Service numérique",
  general: "Concept général",
};

const educationModules: MockupModule[] = [
  { id: "student-profile", title: "Mon profil", description: "Intérêts, matières appréciées, compétences et objectifs à explorer." },
  { id: "aptitude-tests", title: "Tests et activités", description: "Questionnaires et exercices de réflexion à interpréter avec prudence." },
  { id: "career-explorer", title: "Explorer les métiers", description: "Découvrir plusieurs familles de métiers et comprendre leurs activités." },
  { id: "study-paths", title: "Formations et écoles", description: "Comparer les parcours d’études et les conditions d’accès à vérifier." },
];

const operationsModules: MockupModule[] = [
  { id: "team-overview", title: "Vue d’ensemble", description: "Repères de suivi à configurer selon l’activité réelle." },
  { id: "attendance", title: "Présences", description: "Suivi des arrivées, absences et validations selon les règles de l’organisation." },
  { id: "task-board", title: "Tâches et responsabilités", description: "Répartir les actions, responsables et états d’avancement." },
  { id: "activity-log", title: "Historique des actions", description: "Retrouver les changements et validations importants." },
];

const creativeModules: MockupModule[] = [
  { id: "brand-direction", title: "Direction créative", description: "Explorer l’identité, le ton et les références visuelles." },
  { id: "content-library", title: "Contenus et supports", description: "Organiser les textes, images et supports à produire." },
  { id: "review-board", title: "Commentaires et validation", description: "Comparer les propositions et consigner les retours." },
];

const digitalModules: MockupModule[] = [
  { id: "overview", title: "Vue d’ensemble", description: "Présenter les informations essentielles du service." },
  { id: "main-workflow", title: "Fonction principale", description: "Mettre en évidence le parcours utilisateur principal." },
  { id: "workspace", title: "Espace de travail", description: "Organiser les actions, les ressources et les résultats." },
  { id: "help-center", title: "Aide et accompagnement", description: "Prévoir des explications et des points de contact." },
];

function detectDomain(project: Pick<Project, "title" | "category" | "problem" | "desiredOutcome" | "recommendations">): MockupDomain {
  const text = [
    project.title,
    project.problem,
    project.desiredOutcome,
    ...project.recommendations.flatMap((item) => [item.title, item.description, item.reason]),
  ].join(" ").toLocaleLowerCase("fr");

  if (/élève|eleve|étudiant|etudiant|orientation|métier|metier|bac\b|formation|école|ecole|scolaire|aptitude|bulletin/.test(text)) return "education";
  if (/équipe|equipe|employé|employe|personnel|présence|presence|retard|tâche|tache|stock|caisse|vente|boutique|horaire|responsable/.test(text) || project.category === "organization" || project.category === "business") return "operations";
  if (/logo|affiche|identité visuelle|identite visuelle|communication|créatif|creatif|graphique|impression|vidéo|video|marque/.test(text) || project.category === "creative") return "creative";
  if (/application|plateforme|logiciel|site web|numérique|numerique|outil|automatisation|espace client/.test(text) || project.category === "digital") return "digital";
  return "general";
}

function recommendationId(title: string): string {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("fr")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function modulesFor(domain: MockupDomain): MockupModule[] {
  switch (domain) {
    case "education": return educationModules;
    case "operations": return operationsModules;
    case "creative": return creativeModules;
    case "digital": return digitalModules;
    case "general": return [
      { id: "purpose", title: "Objectif du projet", description: "Rendre le résultat souhaité facile à comprendre." },
      { id: "key-actions", title: "Actions principales", description: "Présenter les actions essentielles à préciser avec le client." },
      { id: "next-steps", title: "Prochaines étapes", description: "Montrer les étapes qui restent à décider et à valider." },
    ];
  }
}

export function buildMockupModel(
  project: Pick<Project, "title" | "category" | "problem" | "desiredOutcome" | "recommendations" | "budget" | "urgency"> & { discovery?: Pick<NonNullable<Project["discovery"]>, "professionCandidates"> },
  config: MockupConfig,
): MockupModel {
  const domain = detectDomain(project);
  const match = identifyDomain([project.title, project.problem, project.desiredOutcome].join(" "));
  const trustedMatch = match.domain && match.confidence !== "low" ? match : null;
  const catalog = getDomainOptionCatalog(trustedMatch ?? { domain: null, specialization: null, confidence: "low", score: 0 });
  const universalFamilyCandidates = trustedMatch?.domain
    ? getUniversalFamilyCandidatesForOperationalDomain(trustedMatch.domain.id).flatMap((id) => {
      const family = getUniversalFamilyById(id);
      return family ? [{ id: family.id, label: family.label }] : [];
    })
    : [];
  const professionCandidates = project.discovery?.professionCandidates ?? analyzeNeed({
    title: project.title,
    category: project.category,
    problem: project.problem,
    desiredOutcome: project.desiredOutcome,
    budget: project.budget,
    urgency: project.urgency,
  }).professionCandidates;
  const selectedProfessionIds = new Set(config.selectedProfessionCandidateIds ?? []);
  const selectedProfessionCandidates = professionCandidates.filter((candidate) => selectedProfessionIds.has(candidate.id));
  const activityDiagnostic = buildActivityDiagnosticPlan({ familyIds: universalFamilyCandidates.map((family) => family.id), sectorIds: config.selectedUniversalSectorIds ?? [], professionTitles: selectedProfessionCandidates.map((candidate) => candidate.title) });
  const legacyModules = modulesFor(domain).map((item) => ({ ...item, group: "metier" as const }));
  const modules: MockupModule[] = trustedMatch ? catalog.domainOptions : legacyModules;
  const transversalOptions = trustedMatch ? catalog.transversalOptions : [];
  const allOptions = [...modules, ...transversalOptions];
  const allowedIds = new Set(allOptions.map((item) => item.id));
  const requested = config.enabledModules.filter((id) => allowedIds.has(id));
  const visibleModules = config.moduleSelectionConfirmed || requested.length > 0
    ? allOptions.filter((item) => requested.includes(item.id))
    : modules;

  const recommendations: MockupRecommendation[] = project.recommendations.map((item) => ({
    id: recommendationId(item.title),
    title: item.title,
    description: item.description,
    reason: item.reason,
  }));
  const selectedRecommendationIds = config.selectedRecommendationIds;
  const visibleRecommendations = selectedRecommendationIds === undefined
    ? recommendations
    : recommendations.filter((item) => selectedRecommendationIds.includes(item.id));

  const title = project.title.trim() || "Votre projet";
  const supportingCopy = project.desiredOutcome.trim()
    || "Un aperçu de travail à préciser avec les besoins et les choix du client.";
  return {
    title,
    headline: title,
    supportingCopy,
    domain,
    domainLabel: trustedMatch?.domain?.label ?? domainLabels[domain],
    domainId: trustedMatch?.domain?.id ?? null,
    specializationId: trustedMatch?.specialization?.id ?? null,
    universalFamilyCandidates,
    professionCandidates,
    selectedProfessionCandidates,
    activityDiagnostic,
    transversalOptions,
    format: config.format,
    formatLabel: formatLabels[config.format],
    palette: config.palette,
    modules: allOptions,
    visibleModules,
    recommendations,
    visibleRecommendations,
    conceptNotice: "Maquette conceptuelle assemblée par MerKora à partir du dossier. Elle illustre une direction possible ; ce n’est pas encore un produit fonctionnel ni une image générée par IA.",
  };
}
