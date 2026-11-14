import { analyzeNeed, type DiscoveryDomain } from "../discovery";
import type { NeedInput } from "../solution-recommendations";
import type { DomainId } from "../domain-registry";
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

function taskTemplates(domain: DiscoveryDomain, domainId: DomainId | null, specializationId: string | null): TaskTemplate[] {
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

  const audiovisual = domainId === "voyage-tourisme-creation-jeux" && specializationId === "audiovisual";
  if (domain === "creative" || audiovisual) {
    base.push({
      kind: "production",
      title: audiovisual ? "Produire les éléments audiovisuels" : "Produire les éléments créatifs",
      purpose: "Réaliser les supports, médias et livrables prévus dans le périmètre créatif validé.",
      deliverable: "Éléments créatifs ou audiovisuels préparés pour examen et validation.",
      acceptanceCriteria: commonCriteria.production,
      effort: "unknown",
    });
  } else {
    const implementation: TaskTemplate = {
      kind: "implementation",
      title: "Réaliser la solution approuvée",
      purpose: "Construire ou configurer uniquement les éléments numériques ou opérationnels autorisés.",
      deliverable: "Version de travail correspondant au périmètre approuvé.",
      acceptanceCriteria: commonCriteria.implementation,
      effort: "unknown",
    };
    const domainCopy: Partial<Record<DomainId, Pick<TaskTemplate, "title" | "purpose" | "deliverable">>> = {
      sport: { title: "Configurer les activités sportives", purpose: "Mettre en place les adhésions, calendriers, entraînements et compétitions validés.", deliverable: "Espace de gestion sportive prêt à être vérifié." },
      sante: { title: "Configurer les parcours de santé autorisés", purpose: "Mettre en place les rendez-vous et fonctions administratives avec des accès strictement contrôlés.", deliverable: "Parcours de service et contrôles d'accès prêts à être examinés par les responsables habilités." },
      "agriculture-environnement": { title: "Configurer le suivi de production", purpose: "Mettre en place les campagnes, opérations, intrants et éléments de traçabilité validés.", deliverable: "Suivi de production et de ressources prêt à être vérifié sur un cas pilote." },
      commerce: { title: "Configurer les opérations commerciales", purpose: "Mettre en place les catalogues, ventes, stocks et validations retenus.", deliverable: "Parcours commercial prêt à être vérifié avec des données de test." },
      "entrepreneuriat-finance": { title: "Configurer le pilotage financier", purpose: "Mettre en place les mouvements, budgets, contrôles et rapports de gestion convenus.", deliverable: "Tableaux de bord financiers avec règles de calcul documentées." },
      "immobilier-btp": { title: "Configurer les biens et opérations immobilières", purpose: "Mettre en place les biens, contrats, échéances, chantiers ou travaux retenus.", deliverable: "Suivi immobilier ou chantier prêt à être vérifié." },
      "education-formation": { title: "Configurer les parcours d'apprentissage", purpose: "Mettre en place les apprenants, contenus, évaluations et suivis pédagogiques validés.", deliverable: "Parcours pédagogique et espace de suivi prêts à être examinés." },
      "transport-logistique": { title: "Configurer les opérations de transport", purpose: "Mettre en place les missions, affectations, véhicules, livraisons et preuves retenus.", deliverable: "Parcours de transport et de livraison prêt à être testé." },
      "restauration-hotellerie-evenementiel": { title: "Configurer les opérations d'accueil et de service", purpose: "Mettre en place les réservations, commandes, prestations, stocks et capacités validés.", deliverable: "Parcours de réservation et d'exploitation prêt à être vérifié." },
      "ressources-humaines": { title: "Configurer les processus RH", purpose: "Mettre en place les dossiers, temps, absences et validations selon les règles de l'organisation.", deliverable: "Espace RH avec rôles et historiques de contrôle prêt à être vérifié." },
      "artisanat-services": { title: "Configurer les demandes et interventions", purpose: "Mettre en place les devis, plannings, affectations, travaux et preuves de service retenus.", deliverable: "Parcours d'intervention client prêt à être testé." },
      "administration-services-publics": { title: "Configurer l'instruction des demandes citoyennes", purpose: "Mettre en place le dépôt, le suivi et le circuit de validation par les agents habilités; aucune décision administrative n'est automatisée.", deliverable: "Circuit de dossier avec traçabilité et validation humaine prêt à être examiné." },
      "voyage-tourisme-creation-jeux": { title: "Configurer l'expérience et les réservations", purpose: "Mettre en place les destinations, activités, contenus, participants et réservations selon les confirmations disponibles.", deliverable: "Parcours d'expérience ou de réservation prêt à être vérifié." },
    };
    const gameCopy = specializationId === "game-design"
      ? { title: "Construire un prototype jouable", purpose: "Implémenter une boucle de jeu courte, ses règles, une mission et une progression de démonstration avant de multiplier les niveaux.", deliverable: "Prototype jouable permettant de tester les commandes, règles et conditions de réussite." }
      : null;
    base.push({
      ...implementation,
      ...(domainId ? domainCopy[domainId] : {}),
      ...(gameCopy && domainId === "voyage-tourisme-creation-jeux" ? gameCopy : {}),
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

function makeTasks(domain: DiscoveryDomain, domainId: DomainId | null, specializationId: string | null): PlanTask[] {
  const templates = taskTemplates(domain, domainId, specializationId);
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
  const domainId = discovery.domainId;
  const specializationId = discovery.specializationId;
  const isAudiovisual = domainId === "voyage-tourisme-creation-jeux" && specializationId === "audiovisual";
  const incomplete = discovery.state === "incomplete" || discovery.state === "needs_clarification";
  const includedScope = normalizedScope(input);
  const tasks = incomplete ? [] : makeTasks(domain, domainId, specializationId);
  const assumptions = unknownAssumptions(input);
  const openQuestions = [...new Set(discovery.questions.map((question) => question.trim()).filter(Boolean))];

  if (includedScope.length === 0) {
    assumptions.push("Aucun module ni fonctionnalité n'est encore inclus comme choix confirmé.");
  }

  const domainComponents: Partial<Record<DomainId, string[]>> = {
    sport: ["Adhésions et profils sportifs", "Calendriers et affectations", "Résultats et statistiques"],
    sante: ["Rendez-vous et accueil", "Accès aux dossiers selon habilitation", "Traçabilité des opérations"],
    "agriculture-environnement": ["Parcelles, cycles et productions", "Intrants et équipements", "Lots et traçabilité"],
    commerce: ["Catalogue, ventes et caisse", "Stocks et approvisionnement", "Accès par rôle"],
    "entrepreneuriat-finance": ["Mouvements financiers", "Budgets et contrôles", "Rapports et indicateurs"],
    "immobilier-btp": ["Biens, contrats et échéances", "Chantiers et interventions", "Dépenses et documents"],
    "education-formation": ["Apprenants et parcours", "Cours et ressources", "Évaluations et progression"],
    "transport-logistique": ["Missions et affectations", "Flotte et maintenance", "Livraisons et preuves"],
    "restauration-hotellerie-evenementiel": ["Réservations et capacités", "Opérations et prestations", "Stocks et encaissements"],
    "ressources-humaines": ["Dossiers et contrats", "Temps, absences et validations", "Rapports RH"],
    "artisanat-services": ["Demandes et devis", "Planning et interventions", "Matériaux, preuves et garanties"],
    "administration-services-publics": ["Portail et dossiers citoyens", "Instruction et validations humaines", "Archives et traçabilité"],
    "voyage-tourisme-creation-jeux": specializationId === "game-design"
      ? ["Boucle de jeu et règles", "Niveaux, missions et contenus", "Profils, progression et sauvegardes"]
      : ["Destinations et contenus", "Réservations et participants", "Expériences et retours"],
  };

  const specializationComponents: Record<string, string[]> = {
    "artisan-workshop": ["Commandes sur mesure et étapes de fabrication", "Matières premières et temps passé"],
    "home-services": ["Tournées et créneaux d'intervention", "Preuves de passage et comptes rendus"],
    "personal-services": ["Rendez-vous et professionnels", "Prestations, commissions et fidélité"],
    "civil-status": ["Vérification des pièces par un agent habilité", "Délivrance et archivage contrôlés"],
    "municipal-services": ["Signalements des habitants", "Affectation des équipes et suivi des interventions"],
    "travel-agency": ["Dossiers voyageurs et prestations", "Confirmation des fournisseurs avant engagement"],
    tourism: ["Destinations et circuits", "Guides, capacités et créneaux de visite"],
    audiovisual: ["Production et versions des médias", "Droits, crédits et validations"],
    "game-design": ["Boucle de jeu, règles et objectifs", "Niveaux, missions et sauvegardes"],
    "leisure-events": ["Sessions et capacités", "Billetterie et contrôle d'accès"],
    "career-guidance": ["Profil d'intérêts et questionnaires", "Exploration de métiers et parcours à examiner avec un conseiller"],
  };
  const baseComponents = domainId
    ? domainComponents[domainId] ?? ["Interface adaptée aux utilisateurs", "Logique métier à préciser", "Stockage et intégrations à déterminer"]
    : domain === "education"
      ? ["Parcours de questionnaires et d'exercices", "Exploration des métiers et formations", "Restitution des résultats à examiner"]
      : domain === "commerce"
        ? ["Suivi des opérations et responsabilités", "Gestion des accès par rôle", "Indicateurs et restitutions"]
        : ["Interface adaptée aux utilisateurs", "Logique métier à préciser", "Stockage et intégrations à déterminer"];
  const proposedArchitecture = domain === "creative" || isAudiovisual
    ? null
    : {
        style: "À déterminer après validation du besoin et des contraintes.",
        description: "Architecture fonctionnelle préliminaire, sans choix de fournisseur, d'hébergement ou de technologie imposé.",
        components: [...baseComponents, ...(specializationId ? specializationComponents[specializationId] ?? [] : []), ...includedScope.map((item) => `Option retenue : ${item.title}`)],
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
    domainId,
    specializationId,
    domainLabel: discovery.domainLabel,
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
