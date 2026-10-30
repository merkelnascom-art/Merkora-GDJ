import { analyzeNeed, type DiscoveryDomain } from "../discovery";
import type { NeedInput } from "../solution-recommendations";
import type {
  PlanEffortBand,
  PlanMilestone,
  PlanTask,
  PlanTaskKind,
  ProjectPlan,
  ProjectPlanInput,
} from "./plan-types";

type TaskTemplate = {
  kind: PlanTaskKind;
  title: string;
  purpose: string;
  deliverable: string;
  acceptanceCriteria: string[];
  effort: PlanEffortBand;
};

const commonCriteria = {
  analysis: ["Le problème initial et les personnes concernées sont consignés dans le dossier."],
  scope: ["Chaque élément inclus est relié à un choix explicite ou à un périmètre approuvé."],
  design: ["La proposition répond aux objectifs confirmés et ses hypothèses sont visibles."],
  implementation: ["Le résultat livré correspond au périmètre approuvé et peut être vérifié."],
  production: ["Les éléments produits respectent les formats et critères créatifs validés."],
  verification: ["Chaque critère d'acceptation est vérifié et les écarts sont documentés."],
  handover: ["Les livrables, limites connues et consignes d'utilisation sont remis au destinataire."],
} satisfies Record<PlanTaskKind, string[]>;

function inferDomain(need: NeedInput, suppliedDomain?: DiscoveryDomain): DiscoveryDomain {
  if (suppliedDomain) return suppliedDomain;
  switch (need.category) {
    case "business":
    case "organization":
      return "commerce";
    case "digital":
      return "digital";
    case "creative":
      return "creative";
    case "personal":
      return "personal";
    default:
      return "general";
  }
}

function taskTemplates(domain: DiscoveryDomain): TaskTemplate[] {
  const base: TaskTemplate[] = [
    {
      kind: "analysis",
      title: "Analyser le besoin et le contexte",
      purpose: "Consolider le problème, les personnes concernées, le résultat attendu et les informations disponibles.",
      deliverable: "Synthèse du besoin et registre des informations à confirmer.",
      acceptanceCriteria: commonCriteria.analysis,
      effort: "low",
    },
    {
      kind: "scope",
      title: "Définir le périmètre de réalisation",
      purpose: "Séparer les éléments explicitement choisis, le périmètre approuvé et les idées encore à discuter.",
      deliverable: "Périmètre inclus, exclusions et hypothèses.",
      acceptanceCriteria: commonCriteria.scope,
      effort: "medium",
    },
    {
      kind: "design",
      title: "Concevoir la solution proposée",
      purpose: "Décrire une réponse cohérente aux objectifs confirmés sans imposer de technologie non validée.",
      deliverable: "Conception fonctionnelle ou direction de production à faire examiner.",
      acceptanceCriteria: commonCriteria.design,
      effort: "medium",
    },
  ];

  if (domain === "creative") {
    base.push({
      kind: "production",
      title: "Produire les éléments créatifs",
      purpose: "Réaliser les supports prévus dans le périmètre créatif validé.",
      deliverable: "Éléments créatifs préparés pour examen et validation.",
      acceptanceCriteria: commonCriteria.production,
      effort: "unknown",
    });
  } else {
    base.push({
      kind: "implementation",
      title: "Réaliser la solution approuvée",
      purpose: "Construire ou configurer uniquement les éléments numériques ou opérationnels autorisés.",
      deliverable: "Version de travail correspondant au périmètre approuvé.",
      acceptanceCriteria: commonCriteria.implementation,
      effort: "unknown",
    });
  }

  base.push(
    {
      kind: "verification",
      title: "Vérifier le résultat",
      purpose: "Contrôler les livrables par rapport aux critères d'acceptation et relever les écarts.",
      deliverable: "Compte rendu de vérification et liste des corrections éventuelles.",
      acceptanceCriteria: commonCriteria.verification,
      effort: "medium",
    },
    {
      kind: "handover",
      title: "Préparer la remise du projet",
      purpose: "Rassembler les livrables, les limites connues et les informations utiles au client.",
      deliverable: "Dossier de livraison prêt pour validation.",
      acceptanceCriteria: commonCriteria.handover,
      effort: "low",
    },
  );
  return base;
}

function normalizedScope(input: ProjectPlanInput): ProjectPlan["includedScope"] {
  const scope: ProjectPlan["includedScope"] = [];
  const seen = new Set<string>();

  for (const option of input.selectedOptions ?? []) {
    const id = option.id.trim();
    if (!id || seen.has(id)) continue;
    seen.add(id);
    scope.push({
      id,
      title: option.title.trim(),
      description: option.description.trim(),
      source: "selected_option",
    });
  }

  for (const item of input.approvedScope ?? []) {
    const id = item.id.trim();
    if (!id || seen.has(id)) continue;
    seen.add(id);
    scope.push({
      id,
      title: item.label.trim(),
      description: item.description?.trim() ?? "",
      source: "approved_scope",
    });
  }
  return scope;
}

function unknownAssumptions(input: ProjectPlanInput): string[] {
  const confirmed = new Map(
    (input.confirmedConstraints ?? []).map((item) => [item.key.trim().toLowerCase(), item.value.trim()]),
  );
  const assumptions: string[] = [];
  const addIfUnknown = (key: string, label: string) => {
    if (!confirmed.get(key)) assumptions.push(`${label} : information non confirmée.`);
  };

  if (!input.need.budget.trim() || /à définir|a definir|inconnu/i.test(input.need.budget)) {
    assumptions.push("Budget : montant et enveloppe disponibles non confirmés.");
  }
  addIfUnknown("deadline", "Délai ou date cible");
  addIfUnknown("team_size", "Effectif et nombre d'utilisateurs");
  addIfUnknown("infrastructure", "Infrastructure et hébergement");
  return assumptions;
}

function makeTasks(domain: DiscoveryDomain): PlanTask[] {
  const templates = taskTemplates(domain);
  return templates.map((template, index) => ({
    id: `task-${template.kind}-${String(index + 1).padStart(2, "0")}`,
    kind: template.kind,
    title: template.title,
    purpose: template.purpose,
    priority: index < 2 ? "high" : index === templates.length - 1 ? "low" : "medium",
    dependencies: index === 0 ? [] : [`task-${templates[index - 1].kind}-${String(index).padStart(2, "0")}`],
    deliverable: template.deliverable,
    acceptanceCriteria: [...template.acceptanceCriteria],
    effort: template.effort,
    uncertaintyNotes: template.effort === "unknown"
      ? ["L'effort sera réévalué après validation du périmètre et des contraintes."]
      : [],
  }));
}

function makeMilestones(tasks: PlanTask[]): PlanMilestone[] {
  const groups = [
    { id: "milestone-discovery", title: "Besoin et périmètre clarifiés", kinds: ["analysis", "scope"] as PlanTaskKind[] },
    { id: "milestone-design", title: "Conception examinable", kinds: ["design"] as PlanTaskKind[] },
    { id: "milestone-delivery", title: "Réalisation et vérification", kinds: ["implementation", "production", "verification", "handover"] as PlanTaskKind[] },
  ];
  return groups.map((group) => ({
    id: group.id,
    title: group.title,
    taskIds: tasks.filter((task) => group.kinds.includes(task.kind)).map((task) => task.id),
    exitCriteria: group.id === "milestone-discovery"
      ? ["Le besoin et le périmètre ont été examinés."]
      : group.id === "milestone-design"
        ? ["La conception proposée est prête à être examinée avant exécution."]
        : ["Les livrables ont été vérifiés et le dossier de remise est préparé."],
  })).filter((milestone) => milestone.taskIds.length > 0);
}

export function generateProjectPlan(input: ProjectPlanInput): ProjectPlan {
  const discovery = input.discovery ?? analyzeNeed(input.need);
  const domain = inferDomain(input.need, discovery.domain);
  const incomplete = discovery.state === "incomplete" || discovery.state === "needs_clarification";
  const includedScope = normalizedScope(input);
  const tasks = incomplete ? [] : makeTasks(domain);
  const assumptions = unknownAssumptions(input);
  const openQuestions = [...new Set(discovery.questions.map((question) => question.trim()).filter(Boolean))];

  if (includedScope.length === 0) {
    assumptions.push("Aucun module ni fonctionnalité n'est encore inclus comme choix confirmé.");
  }

  const proposedArchitecture = domain === "creative"
    ? null
    : {
        style: "À déterminer après validation du besoin et des contraintes.",
        description: "Architecture fonctionnelle préliminaire, sans choix de fournisseur, d'hébergement ou de technologie imposé.",
        components: domain === "education"
          ? ["Parcours de questionnaires et d'exercices", "Exploration des métiers et formations", "Restitution des résultats à examiner"]
          : domain === "commerce"
            ? ["Suivi des opérations et responsabilités", "Gestion des accès par rôle", "Indicateurs et restitutions"]
            : ["Interface adaptée aux utilisateurs", "Logique métier à préciser", "Stockage et intégrations à déterminer"],
      };

  const estimateNotes = [
    "Estimation relative uniquement ; aucun délai calendaire ni prix n'est calculé.",
    "L'effort de réalisation reste inconnu tant que le périmètre et les contraintes ne sont pas confirmés.",
  ];

  return {
    id: `${input.projectId}:plan:${input.planVersion}`,
    projectId: input.projectId,
    version: input.planVersion,
    briefVersion: input.briefVersion,
    plannerVersion: input.plannerVersion,
    status: incomplete ? "needs_clarification" : "draft",
    domain,
    summary: `Plan préliminaire pour « ${input.need.title.trim()} », fondé sur le besoin enregistré et les seuls choix explicitement transmis.`,
    goals: [input.need.desiredOutcome.trim()].filter(Boolean),
    includedScope,
    suggestions: discovery.recommendations.map((recommendation) => ({ ...recommendation })),
    exclusions: discovery.recommendations
      .filter((recommendation) => !includedScope.some((item) => item.title === recommendation.title))
      .map((recommendation) => `Suggestion non sélectionnée : ${recommendation.title}`),
    assumptions,
    openQuestions,
    proposedArchitecture,
    tasks,
    milestones: makeMilestones(tasks),
    estimate: {
      effortBand: tasks.length === 0 ? "unknown" : "unknown",
      confidence: "low",
      notes: estimateNotes,
      calendarDays: null,
      price: null,
    },
    acceptanceCriteria: tasks.flatMap((task) => task.acceptanceCriteria),
    verificationChecklist: [
      "Vérifier que chaque élément inclus correspond à un choix explicite ou à un périmètre approuvé.",
      "Vérifier les dépendances et les livrables de chaque tâche.",
      "Faire examiner les hypothèses, questions ouvertes et estimations avant toute exécution.",
    ],
  };
}
