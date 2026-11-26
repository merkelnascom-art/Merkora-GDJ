export type SpecializedConfiguratorId =
  | "ecommerce"
  | "reservation"
  | "business_management"
  | "education"
  | "digitization"
  | "games";

export type ConfiguratorAnswer = string | string[] | number | boolean;

export interface SpecializedConfiguratorStep {
  id: string;
  title: string;
  question: string;
  guidance: string;
  input: "single" | "multiple" | "number" | "boolean" | "text";
  required: boolean;
  options?: string[];
  min?: number;
}

export interface SpecializedConfigurator {
  id: SpecializedConfiguratorId;
  title: string;
  purpose: string;
  domainIds: string[];
  moduleIds: string[];
  steps: SpecializedConfiguratorStep[];
}

export interface SpecializedConfiguratorIssue {
  code: "unknown_step" | "invalid_option" | "missing_answer" | "invalid_value";
  path: string;
  message: string;
}

export interface SpecializedConfiguratorValidation {
  valid: boolean;
  issues: SpecializedConfiguratorIssue[];
}

const configurators: SpecializedConfigurator[] = [
  {
    id: "ecommerce",
    title: "Commerce et vente en ligne",
    purpose: "Décrire comment les produits ou services sont présentés, vendus, payés, préparés, livrés et suivis après la vente.",
    domainIds: ["commerce"],
    moduleIds: ["product_catalog", "inventory_movements", "order_management", "delivery_tracking", "returns_management"],
    steps: [
      { id: "selling_model", title: "Modèle de vente", question: "Que vendra la boutique et comment les clients passeront-ils commande ?", guidance: "Distinguer produits physiques, produits numériques et prestations ; préciser vente directe, sur commande ou les deux.", input: "multiple", required: true, options: ["physical_products", "digital_products", "services", "made_to_order", "retail", "wholesale"] },
      { id: "catalogue", title: "Catalogue et fiches", question: "Comment les articles doivent-ils être présentés ?", guidance: "Préciser catégories, photos, descriptions, variantes (taille, couleur, format), prix, promotions et disponibilité.", input: "multiple", required: true, options: ["categories", "photos", "descriptions", "variants", "multiple_prices", "promotions", "digital_downloads"] },
      { id: "inventory", title: "Stock et disponibilité", question: "Comment la disponibilité des articles sera-t-elle gérée ?", guidance: "Le stock peut être suivi par article, variante, dépôt ou fournisseur ; certains produits peuvent être vendus sans stock physique.", input: "single", required: true, options: ["no_stock_tracking", "manual_stock", "automatic_stock", "multiple_locations", "made_to_order"] },
      { id: "checkout", title: "Commande et paiement", question: "Comment le client validera-t-il et réglera-t-il sa commande ?", guidance: "Définir les coordonnées demandées, les étapes de validation, les paiements acceptés et le traitement des paiements non confirmés.", input: "multiple", required: true, options: ["cash_on_delivery", "mobile_money", "bank_card", "bank_transfer", "pay_on_pickup", "manual_confirmation"] },
      { id: "fulfilment", title: "Livraison et retrait", question: "Comment les commandes seront-elles remises aux clients ?", guidance: "Préciser zones, frais, délais, livraison par vos équipes ou partenaire, retrait sur place et preuve de remise.", input: "multiple", required: true, options: ["home_delivery", "pickup_point", "store_pickup", "third_party_carrier", "digital_delivery", "delivery_zones"] },
      { id: "after_sales", title: "Après-vente", question: "Que doit-il se passer après la livraison ou la remise ?", guidance: "Définir retours, échanges, remboursements, réclamations, garanties et suivi de satisfaction.", input: "multiple", required: true, options: ["returns", "exchanges", "refunds", "warranty", "complaints", "customer_support"] },
    ],
  },
  {
    id: "reservation",
    title: "Réservation et gestion de disponibilités",
    purpose: "Organiser des ressources réservables, leurs calendriers, capacités, règles de confirmation et le suivi des présences.",
    domainIds: ["reservation"],
    moduleIds: ["reservation_slots", "booking_lifecycle", "qr_invitations", "reservation_notifications"],
    steps: [
      { id: "bookable_resource", title: "Ce qui est réservé", question: "Qu'est-ce qu'un client ou participant pourra réserver ?", guidance: "Exemples : rendez-vous avec une personne, salle, véhicule, chambre, place à un événement ou prestation.", input: "multiple", required: true, options: ["appointment", "room", "vehicle", "accommodation", "event_seat", "service", "equipment"] },
      { id: "availability", title: "Disponibilités", question: "Comment les créneaux disponibles seront-ils définis ?", guidance: "Préciser jours et heures, durée fixe ou variable, pauses, jours fermés, exceptions et synchronisation éventuelle d'agendas.", input: "multiple", required: true, options: ["fixed_hours", "variable_hours", "staff_calendar", "resource_calendar", "date_ranges", "external_calendar"] },
      { id: "capacity", title: "Capacité et conflits", question: "Combien de réservations peuvent être acceptées au même moment ?", guidance: "Une ressource peut être unique ou accueillir plusieurs personnes ; empêcher les doubles réservations lorsque nécessaire.", input: "single", required: true, options: ["one_per_slot", "limited_capacity", "unlimited_capacity", "multiple_resources"] },
      { id: "booking_policy", title: "Règles de réservation", question: "Quelles règles encadrent la demande et la confirmation ?", guidance: "Choisir confirmation automatique ou manuelle, délai minimum, acompte éventuel, annulation, modification et liste d'attente.", input: "multiple", required: true, options: ["automatic_confirmation", "manual_approval", "deposit_required", "free_booking", "cancellation_window", "reschedule", "waiting_list"] },
      { id: "notifications", title: "Messages et accueil", question: "Quels messages ou contrôles faut-il prévoir ?", guidance: "Les notifications peuvent confirmer, rappeler ou signaler un changement ; le QR code peut servir à vérifier une invitation ou enregistrer une arrivée.", input: "multiple", required: true, options: ["email_confirmation", "sms_confirmation", "whatsapp_confirmation", "reminders", "qr_check_in", "attendance_register"] },
    ],
  },
  {
    id: "business_management",
    title: "Gestion d'activité et opérations",
    purpose: "Structurer les personnes, responsabilités, processus quotidiens, contrôles financiers et indicateurs d'une organisation.",
    domainIds: ["business_management", "finance"],
    moduleIds: ["team_directory", "task_follow_up", "business_indicators", "cashflow_tracking", "expense_approval", "financial_reporting", "invoice_register"],
    steps: [
      { id: "organization", title: "Organisation", question: "Comment l'activité est-elle organisée au quotidien ?", guidance: "Décrire les services, sites, équipes, points de vente, ateliers ou unités qui doivent travailler ensemble.", input: "multiple", required: true, options: ["single_site", "multiple_sites", "departments", "branches", "field_teams", "partners"] },
      { id: "people_and_roles", title: "Personnes et responsabilités", question: "Quelles personnes utiliseront le système et que pourront-elles faire ?", guidance: "Définir les responsabilités réelles et les limites : consulter, créer, valider, corriger ou supprimer. Les droits financiers sensibles doivent être séparés.", input: "multiple", required: true, options: ["owner_admin", "manager", "supervisor", "employee", "accountant", "sales_agent", "external_partner", "custom_roles"] },
      { id: "workflows", title: "Processus de travail", question: "Quelles opérations faut-il organiser et suivre ?", guidance: "Décrire le circuit réel d'une opération, son responsable, ses échéances, ses pièces et les étapes de validation.", input: "multiple", required: true, options: ["tasks", "sales", "purchases", "stock", "staff_attendance", "customer_requests", "approvals", "field_operations"] },
      { id: "financial_controls", title: "Contrôle financier", question: "Quels flux financiers et quelles validations doivent être gérés ?", guidance: "Distinguer recettes, dépenses, caisse, factures, budgets et approbations. Préciser qui peut saisir, consulter et autoriser.", input: "multiple", required: true, options: ["income_expenses", "cash_register", "invoices_receipts", "budgets", "expense_approval", "payment_tracking", "financial_reports"] },
      { id: "reporting", title: "Pilotage et rapports", question: "Quelles informations aideront les responsables à prendre leurs décisions ?", guidance: "Choisir les indicateurs, fréquences de rapport, alertes et exports utiles ; ne montrer à chaque rôle que les données autorisées.", input: "multiple", required: true, options: ["daily_dashboard", "weekly_reports", "monthly_reports", "performance_indicators", "alerts", "excel_export", "audit_history"] },
    ],
  },
  {
    id: "education",
    title: "Éducation, formation et orientation",
    purpose: "Configurer un parcours pédagogique ou d'orientation sans imposer la gestion d'un établissement lorsque le projet n'en a pas besoin.",
    domainIds: ["education"],
    moduleIds: ["learner_records", "learning_schedule", "pedagogical_tracking", "quizzes_assessments", "career_orientation"],
    steps: [
      { id: "education_model", title: "Nature du projet", question: "Quel type d'expérience éducative voulez-vous proposer ?", guidance: "Une plateforme d'orientation comme Student Vision peut analyser des réponses et proposer des pistes sans gérer une école, des classes ou une direction.", input: "single", required: true, options: ["school_management", "career_orientation", "training", "online_learning", "assessment_platform", "educational_content"] },
      { id: "audience", title: "Public concerné", question: "À qui la plateforme s'adresse-t-elle ?", guidance: "Préciser les profils, tranches de niveau, accompagnateurs et éventuels responsables légaux.", input: "multiple", required: true, options: ["children", "students", "job_seekers", "employees", "trainers", "parents", "career_counsellors", "general_public"] },
      { id: "learning_content", title: "Contenus et activités", question: "Quels contenus ou activités seront proposés ?", guidance: "Choisir cours, leçons, ressources, exercices, parcours, vidéos ou activités de découverte.", input: "multiple", required: true, options: ["courses", "lessons", "videos", "documents", "exercises", "guided_pathways", "career_discovery"] },
      { id: "assessment", title: "Tests et évaluations", question: "Comment les connaissances, aptitudes ou intérêts seront-ils explorés ?", guidance: "Décrire les quiz, mises en situation, devinettes, tests, critères de correction, tentatives et interprétation des résultats.", input: "multiple", required: true, options: ["multiple_choice", "open_questions", "quizzes", "riddles", "skills_tests", "interest_tests", "practical_tasks", "human_review"] },
      { id: "progression", title: "Résultats et progression", question: "Que doit recevoir la personne à la fin de son parcours ?", guidance: "Les propositions d'orientation doivent être expliquées à partir des réponses et critères utilisés, avec limites et possibilité d'accompagnement humain.", input: "multiple", required: true, options: ["scores", "progress_tracking", "recommendations", "career_suggestions", "certificates", "feedback", "advisor_follow_up"] },
    ],
  },
  {
    id: "digitization",
    title: "Numérisation et archivage documentaire",
    purpose: "Définir la chaîne de réception, capture, reconnaissance, classement, recherche, conservation et restitution des documents.",
    domainIds: ["digitization"],
    moduleIds: ["document_intake", "document_capture", "document_ocr", "document_classification", "document_archive", "document_search"],
    steps: [
      { id: "intake", title: "Réception des documents", question: "Quels documents seront confiés à la plateforme et comment seront-ils reçus ?", guidance: "Préciser les formats, volumes, origines, lots, dépôt par les utilisateurs ou import par les agents.", input: "multiple", required: true, options: ["paper_documents", "pdf_files", "images", "office_files", "bulk_import", "user_upload", "operator_intake"] },
      { id: "capture", title: "Numérisation et capture", question: "Comment les documents papier ou numériques seront-ils capturés ?", guidance: "Définir scan recto-verso, appareil photo, scanner réseau, contrôle qualité, rotation et traitement des pages.", input: "multiple", required: true, options: ["flatbed_scanner", "document_scanner", "mobile_camera", "network_scanner", "batch_scanning", "image_cleanup"] },
      { id: "recognition", title: "Reconnaissance du contenu", question: "Quelles informations doivent être extraites automatiquement ?", guidance: "L'OCR convertit une image de texte en texte exploitable ; l'extraction structurée peut identifier dates, noms, références ou montants et doit être vérifiable.", input: "multiple", required: true, options: ["ocr", "handwriting_recognition", "metadata_extraction", "tables_extraction", "manual_indexing", "human_verification"] },
      { id: "classification", title: "Classement et indexation", question: "Comment les documents seront-ils organisés et retrouvés ?", guidance: "Définir catégories, dossiers, tags, métadonnées obligatoires, règles de nommage et niveaux de confidentialité.", input: "multiple", required: true, options: ["folders", "categories", "tags", "metadata", "automatic_classification", "access_levels"] },
      { id: "search_and_retention", title: "Recherche et conservation", question: "Comment les documents seront-ils consultés, conservés et éventuellement supprimés ?", guidance: "Préciser recherche plein texte, filtres, durée de conservation, archivage, sauvegarde, export et procédure de suppression autorisée.", input: "multiple", required: true, options: ["full_text_search", "advanced_filters", "retention_rules", "long_term_archive", "backups", "export", "authorized_disposal"] },
    ],
  },
  {
    id: "games",
    title: "Jeux numériques et expériences ludiques",
    purpose: "Définir les modes de jeu, participants, règles, déroulement des sessions, scores et progression.",
    domainIds: ["game"],
    moduleIds: ["game_lobby", "game_rules_engine", "player_sessions", "score_progression"],
    steps: [
      { id: "game_format", title: "Format du jeu", question: "Quelle expérience de jeu voulez-vous créer ?", guidance: "Définir jeu de réflexion, quiz, aventure, stratégie, simulation ou compétition ; préciser solo, local ou en ligne.", input: "multiple", required: true, options: ["quiz", "puzzle", "strategy", "adventure", "simulation", "competition", "educational_game", "single_player", "multiplayer"] },
      { id: "players", title: "Joueurs et équipes", question: "Qui peut jouer et comment les participants se retrouvent-ils ?", guidance: "Préciser comptes, pseudonymes, équipes, invitations, nombre de joueurs et rôles de modération.", input: "multiple", required: true, options: ["guest_players", "registered_players", "teams", "private_rooms", "public_matchmaking", "moderator"] },
      { id: "rules", title: "Règles et actions", question: "Quelles sont les règles qui déterminent le déroulement du jeu ?", guidance: "Décrire objectifs, actions possibles, tours, temps limité, conditions de victoire, pénalités et cas d'égalité.", input: "multiple", required: true, options: ["turn_based", "real_time", "timed_rounds", "levels", "random_events", "custom_rules", "penalties", "win_conditions"] },
      { id: "session_flow", title: "Déroulement d'une partie", question: "Comment une partie commence-t-elle, progresse-t-elle et se termine-t-elle ?", guidance: "Préciser lobby, invitation, préparation, sauvegarde, pause, reprise, abandon et gestion des déconnexions.", input: "multiple", required: true, options: ["lobby", "ready_check", "tutorial", "pause_resume", "save_progress", "reconnect", "spectator_mode"] },
      { id: "scoring_and_progression", title: "Scores et progression", question: "Comment mesurer la réussite et faire évoluer les joueurs ?", guidance: "Définir points, niveaux, badges, classements, récompenses, statistiques et éventuelle progression entre plusieurs sessions.", input: "multiple", required: true, options: ["points", "leaderboards", "levels", "badges", "achievements", "statistics", "season_progression"] },
    ],
  },
];

export function getSpecializedConfigurator(id: string): SpecializedConfigurator | undefined {
  const configurator = configurators.find((item) => item.id === id);
  return configurator ? {
    ...configurator,
    domainIds: [...configurator.domainIds],
    moduleIds: [...configurator.moduleIds],
    steps: configurator.steps.map((step) => ({
      ...step,
      options: step.options ? [...step.options] : undefined,
    })),
  } : undefined;
}

export function getSpecializedConfigurators(): SpecializedConfigurator[] {
  return configurators.map((item) => getSpecializedConfigurator(item.id) as SpecializedConfigurator);
}

export function validateSpecializedConfiguratorAnswers(
  id: string,
  answers: Record<string, ConfiguratorAnswer>,
): SpecializedConfiguratorValidation {
  const configurator = getSpecializedConfigurator(id);
  if (!configurator) {
    return { valid: false, issues: [{ code: "invalid_value", path: "configuratorId", message: "Configurateur inconnu." }] };
  }

  const issues: SpecializedConfiguratorIssue[] = [];
  const stepsById = new Map(configurator.steps.map((step) => [step.id, step]));

  Object.keys(answers).forEach((stepId) => {
    if (!stepsById.has(stepId)) {
      issues.push({ code: "unknown_step", path: stepId, message: "Cette réponse ne correspond à aucune question de ce configurateur." });
    }
  });

  configurator.steps.forEach((step) => {
    const answer = answers[step.id];
    if (answer === undefined || answer === null || answer === "") {
      if (step.required) issues.push({ code: "missing_answer", path: step.id, message: "Une réponse est nécessaire pour continuer." });
      return;
    }

    if (step.input === "number") {
      if (typeof answer !== "number" || !Number.isFinite(answer) || (step.min !== undefined && answer < step.min)) {
        issues.push({ code: "invalid_value", path: step.id, message: "La valeur numérique est invalide." });
      }
      return;
    }

    if (step.input === "boolean") {
      if (typeof answer !== "boolean") issues.push({ code: "invalid_value", path: step.id, message: "Une réponse oui/non est attendue." });
      return;
    }

    if (step.input === "text") {
      if (typeof answer !== "string" || answer.trim().length === 0) {
        issues.push({ code: "invalid_value", path: step.id, message: "Un texte non vide est attendu." });
      }
      return;
    }

    const values = Array.isArray(answer) ? answer : [answer];
    if (step.input === "single" && (Array.isArray(answer) || typeof answer !== "string")) {
      issues.push({ code: "invalid_value", path: step.id, message: "Une seule option doit être choisie." });
      return;
    }
    if (step.input === "multiple" && !Array.isArray(answer)) {
      issues.push({ code: "invalid_value", path: step.id, message: "Une ou plusieurs options doivent être choisies." });
      return;
    }
    values.forEach((value) => {
      if (typeof value !== "string" || !step.options?.includes(value)) {
        issues.push({ code: "invalid_option", path: step.id, message: "Une option choisie n'est pas autorisée pour cette question." });
      }
    });
  });

  return { valid: issues.length === 0, issues };
}
