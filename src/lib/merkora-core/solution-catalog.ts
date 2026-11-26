export type SolutionProductTypeId =
  | "showcase_website"
  | "web_platform"
  | "mobile_app"
  | "web_application"
  | "booking_solution"
  | "ecommerce"
  | "game"
  | "generator"
  | "architecture_workspace"
  | "operational_solution";

export type SolutionDomainId =
  | "attendance"
  | "reservation"
  | "finance"
  | "education"
  | "architecture"
  | "social_network"
  | "game"
  | "code_generation"
  | "commerce"
  | "business_management"
  | "telecommunications"
  | "health"
  | "agriculture"
  | "transport"
  | "media"
  | "digitization";

export type SolutionNavigationStyle = "sidebar" | "topbar" | "bottom_tabs" | "contextual" | "not_applicable";
export type SolutionBrandingMode = "existing_logo" | "create_logo" | "to_define";

export interface SolutionProductRole {
  id: string;
  label: string;
  scope: "owner" | "product_user" | "operational";
  description: string;
}

export interface SolutionProductType {
  id: SolutionProductTypeId;
  label: string;
  description: string;
  baselineModules: string[];
  defaultRoles: SolutionProductRole[];
  defaultNavigation: SolutionNavigationStyle;
}

export interface SolutionDomainModule {
  id: string;
  label: string;
  description: string;
  domainIds: SolutionDomainId[];
  dependsOn?: string[];
}

export interface SolutionDomainCatalog {
  id: SolutionDomainId;
  label: string;
  description: string;
  modules: SolutionDomainModule[];
  roles: SolutionProductRole[];
}

export interface SolutionProductProfile {
  projectName: string;
  productTypeId: SolutionProductTypeId;
  domainIds: SolutionDomainId[];
  navigationStyle: SolutionNavigationStyle;
  brandingMode: SolutionBrandingMode;
}

export interface HybridDomainComposition {
  domainIds: SolutionDomainId[];
  modules: SolutionDomainModule[];
  roles: SolutionProductRole[];
  isHybrid: boolean;
}

const ownerRole: SolutionProductRole = {
  id: "project_owner_admin",
  label: "Administrateur propriétaire",
  scope: "owner",
  description: "La personne qui commande et pilote le produit ; son espace de gestion est distinct des comptes utilisateurs.",
};
const endUserRole: SolutionProductRole = {
  id: "end_user",
  label: "Utilisateur final",
  scope: "product_user",
  description: "Personne qui utilise les services, fonctions ou contenus du produit.",
};

const productTypes: SolutionProductType[] = [
  { id: "showcase_website", label: "Site vitrine", description: "Présenter une organisation, ses offres, ses réalisations et permettre aux visiteurs de la contacter.", baselineModules: ["public_pages", "content_sections", "contact_forms", "seo_visibility"], defaultRoles: [ownerRole, endUserRole], defaultNavigation: "topbar" },
  { id: "web_platform", label: "Plateforme web", description: "Réunir plusieurs espaces, profils, opérations, données et parcours dans un même produit.", baselineModules: ["role_workspaces", "admin_console", "permissions", "activity_dashboard"], defaultRoles: [ownerRole, endUserRole], defaultNavigation: "sidebar" },
  { id: "mobile_app", label: "Application mobile", description: "Proposer une expérience pensée d'abord pour le téléphone, avec navigation tactile et fonctions mobiles.", baselineModules: ["mobile_navigation", "push_notifications", "device_permissions", "offline_ready_states"], defaultRoles: [ownerRole, endUserRole], defaultNavigation: "bottom_tabs" },
  { id: "web_application", label: "Application web / logiciel", description: "Exécuter des tâches, manipuler des données et suivre des opérations dans une interface applicative.", baselineModules: ["application_workspace", "data_forms", "search_and_filters", "operation_history"], defaultRoles: [ownerRole, endUserRole], defaultNavigation: "sidebar" },
  { id: "booking_solution", label: "Système de réservation", description: "Gérer disponibilités, créneaux, demandes, confirmations, invitations et présence effective.", baselineModules: ["availability_calendar", "booking_lifecycle", "confirmation_messages", "booking_admin"], defaultRoles: [ownerRole, endUserRole], defaultNavigation: "contextual" },
  { id: "ecommerce", label: "Boutique / e-commerce", description: "Présenter un catalogue, gérer panier, commandes, paiement, livraison et suivi commercial.", baselineModules: ["product_catalog", "shopping_cart", "order_management", "checkout"], defaultRoles: [ownerRole, endUserRole], defaultNavigation: "topbar" },
  { id: "game", label: "Jeu numérique", description: "Définir les règles, les parties, les joueurs, les scores, la progression et les interactions.", baselineModules: ["game_lobby", "game_rules", "player_sessions", "score_progression"], defaultRoles: [ownerRole, endUserRole], defaultNavigation: "contextual" },
  { id: "generator", label: "Générateur / outil de création", description: "Produire des éléments à partir de paramètres, modèles, règles et validations.", baselineModules: ["input_builder", "generation_engine", "preview_output", "export_history"], defaultRoles: [ownerRole, endUserRole], defaultNavigation: "sidebar" },
  { id: "architecture_workspace", label: "Espace de conception architecturale", description: "Organiser plans, mesures, variantes, modèles, matériaux et validations de projet.", baselineModules: ["project_canvas", "file_library", "revision_history", "approval_workflow"], defaultRoles: [ownerRole, endUserRole], defaultNavigation: "contextual" },
  { id: "operational_solution", label: "Solution opérationnelle / métier", description: "Organiser une activité réelle, ses personnes, ressources, procédures et contrôles, avec ou sans logiciel.", baselineModules: ["operations_register", "resource_planning", "task_follow_up", "evidence_log"], defaultRoles: [ownerRole, endUserRole], defaultNavigation: "not_applicable" },
];

const domainCatalogs: SolutionDomainCatalog[] = [
  {
    id: "attendance", label: "Suivi de présence", description: "Identifier les personnes présentes, les heures, retards, absences, justificatifs et validations.",
    roles: [{ id: "attendance_controller", label: "Agent de pointage", scope: "operational", description: "Enregistre ou vérifie les arrivées et départs." }, { id: "attendance_supervisor", label: "Responsable de présence", scope: "operational", description: "Contrôle les anomalies, retards et corrections." }],
    modules: [
      { id: "attendance_capture", label: "Pointage et identification", description: "Pointage manuel, QR code, badge ou biométrie selon le contexte, le matériel et les règles de confidentialité.", domainIds: ["attendance"] },
      { id: "late_management", label: "Retards, absences et justificatifs", description: "Règles horaires, motifs, pièces justificatives, demandes de correction et décisions autorisées.", domainIds: ["attendance"] },
      { id: "attendance_audit", label: "Historique et contrôle des présences", description: "Journal horodaté, corrections traçables, rapports et alertes.", domainIds: ["attendance"] },
      { id: "check_in_from_reservation", label: "Transformer une réservation en présence", description: "À l'arrivée, retrouver la réservation et enregistrer le check-in sans ressaisir l'identité.", domainIds: ["attendance", "reservation"], dependsOn: ["attendance_capture", "reservation_slots"] },
    ],
  },
  {
    id: "reservation", label: "Réservation et événements", description: "Gérer des places, rendez-vous, événements, invitations et contrôles d'accès.",
    roles: [{ id: "booking_manager", label: "Gestionnaire des réservations", scope: "operational", description: "Configure les créneaux, capacités, confirmations et annulations." }, { id: "checkin_agent", label: "Agent d'accueil", scope: "operational", description: "Vérifie les invitations et les arrivées." }],
    modules: [
      { id: "reservation_slots", label: "Disponibilités et créneaux", description: "Calendrier, capacité, durée, règles et conflits de réservation.", domainIds: ["reservation"] },
      { id: "booking_lifecycle", label: "Cycle de réservation", description: "Demande, confirmation, modification, annulation, liste d'attente et statut.", domainIds: ["reservation"] },
      { id: "qr_invitations", label: "Invitations et QR codes", description: "Générer, renouveler, révoquer et vérifier des invitations ou billets QR.", domainIds: ["reservation"] },
      { id: "reservation_notifications", label: "Notifications et rappels", description: "Envoyer confirmations, rappels et changements par les canaux autorisés.", domainIds: ["reservation"] },
    ],
  },
  {
    id: "finance", label: "Gestion financière", description: "Suivre revenus, dépenses, trésorerie, budgets, pièces et décisions financières.",
    roles: [{ id: "finance_manager", label: "Responsable financier", scope: "operational", description: "Suit les flux, budgets et rapports." }, { id: "expense_approver", label: "Approbateur des dépenses", scope: "operational", description: "Autorise ou refuse les dépenses selon les seuils." }],
    modules: [
      { id: "cashflow_tracking", label: "Recettes et dépenses", description: "Enregistrer les flux, catégories, moyens de paiement et pièces justificatives.", domainIds: ["finance"] },
      { id: "expense_approval", label: "Validation des dépenses", description: "Circuit d'approbation, seuils, approbateurs et historique des décisions.", domainIds: ["finance"] },
      { id: "financial_reporting", label: "Rapports et indicateurs financiers", description: "Trésorerie, marges, budgets, écarts et tendances.", domainIds: ["finance"] },
      { id: "invoice_register", label: "Factures et reçus", description: "Référencer les factures, reçus, échéances et statuts de règlement.", domainIds: ["finance"] },
    ],
  },
  {
    id: "education", label: "Éducation et formation", description: "Organiser apprenants, cours, évaluations, emplois du temps et suivi pédagogique.",
    roles: [{ id: "teacher", label: "Enseignant / formateur", scope: "operational", description: "Prépare les cours, évaluations et observations." }, { id: "learner", label: "Apprenant", scope: "product_user", description: "Suit les activités, résultats et ressources pédagogiques." }],
    modules: [
      { id: "learner_records", label: "Dossiers des apprenants", description: "Inscription, identité, parcours, pièces et statut.", domainIds: ["education"] },
      { id: "learning_schedule", label: "Emploi du temps et cours", description: "Cours, salles, enseignants, horaires et changements.", domainIds: ["education"] },
      { id: "pedagogical_tracking", label: "Suivi pédagogique", description: "Notes, compétences, progression, observations et bilans.", domainIds: ["education"] },
      { id: "quizzes_assessments", label: "Tests, quiz et évaluations", description: "Questionnaires, exercices, scores et historique des tentatives.", domainIds: ["education"] },
      { id: "career_orientation", label: "Orientation et recommandations de parcours", description: "Analyser les réponses, intérêts et aptitudes pour proposer des pistes argumentées sans imposer une gestion scolaire.", domainIds: ["education"] },
    ],
  },
  {
    id: "architecture", label: "Architecture et construction", description: "Étudier un site, concevoir des plans, estimer les matériaux et suivre les validations.",
    roles: [{ id: "architect", label: "Architecte / concepteur", scope: "operational", description: "Conçoit et révise les plans." }, { id: "client_approver", label: "Client / maître d'ouvrage", scope: "product_user", description: "Exprime les besoins et valide les variantes." }],
    modules: [
      { id: "site_measurements", label: "Relevés et mesures du site", description: "Dimensions, orientation, contraintes et relevés documentés.", domainIds: ["architecture"] },
      { id: "architectural_plans", label: "Plans et variantes", description: "Plans, niveaux, pièces, annotations et versions.", domainIds: ["architecture"] },
      { id: "3d_visualization", label: "Visualisation 3D", description: "Modèle spatial, vues, matériaux et présentation des variantes.", domainIds: ["architecture"] },
      { id: "materials_estimation", label: "Estimation des matériaux", description: "Quantités, unités, pertes estimées et coûts paramétrables.", domainIds: ["architecture", "business_management"] },
    ],
  },
  {
    id: "social_network", label: "Réseau social et communauté", description: "Créer des profils, publications, relations, échanges et mécanismes de modération.",
    roles: [{ id: "community_moderator", label: "Modérateur", scope: "operational", description: "Traite les signalements et applique les règles communautaires." }],
    modules: [
      { id: "member_profiles", label: "Profils et relations", description: "Profils, abonnements, contacts et paramètres de visibilité.", domainIds: ["social_network"] },
      { id: "community_feed", label: "Publications et fil d'actualité", description: "Publier, commenter, réagir et partager.", domainIds: ["social_network"] },
      { id: "private_messaging", label: "Messagerie et notifications", description: "Conversations privées, pièces jointes et alertes.", domainIds: ["social_network"] },
      { id: "community_moderation", label: "Modération et signalements", description: "Règles, signalements, décisions et journal de modération.", domainIds: ["social_network"] },
    ],
  },
  {
    id: "game", label: "Jeux et divertissement", description: "Définir une expérience de jeu, les règles, parties, joueurs et résultats.",
    roles: [{ id: "game_moderator", label: "Modérateur de partie", scope: "operational", description: "Supervise les sessions et les incidents." }],
    modules: [
      { id: "game_lobby", label: "Salle d'attente et parties", description: "Créer, rejoindre et organiser des parties.", domainIds: ["game"] },
      { id: "game_rules_engine", label: "Règles et moteur de jeu", description: "États, tours, conditions, calculs et résolution des actions.", domainIds: ["game"] },
      { id: "player_sessions", label: "Comptes et sessions joueurs", description: "Identité, équipes, invitations et progression.", domainIds: ["game"] },
      { id: "score_progression", label: "Scores et progression", description: "Classements, récompenses et historique des résultats.", domainIds: ["game"] },
    ],
  },
  {
    id: "code_generation", label: "Génération de code et d'outils", description: "Produire des fichiers, scripts ou configurations à partir de règles et modèles.",
    roles: [{ id: "developer_reviewer", label: "Développeur vérificateur", scope: "operational", description: "Contrôle, teste et valide les éléments générés." }],
    modules: [
      { id: "template_library", label: "Bibliothèque de modèles", description: "Modèles versionnés, variables et paramètres.", domainIds: ["code_generation"] },
      { id: "generation_engine", label: "Moteur de génération", description: "Générer des artefacts reproductibles à partir d'entrées explicites.", domainIds: ["code_generation"] },
      { id: "sandbox_validation", label: "Tests en environnement isolé", description: "Vérifier le résultat dans un environnement contrôlé avant livraison.", domainIds: ["code_generation"] },
      { id: "artifact_export", label: "Export et historique", description: "Télécharger, comparer et retrouver les versions produites.", domainIds: ["code_generation"] },
    ],
  },
  {
    id: "commerce", label: "Commerce et distribution", description: "Gérer produits, stocks, commandes, ventes, livraisons et relation client.",
    roles: [{ id: "sales_agent", label: "Agent commercial", scope: "operational", description: "Traite les demandes et commandes." }, { id: "stock_manager", label: "Gestionnaire de stock", scope: "operational", description: "Contrôle les quantités et mouvements." }],
    modules: [
      { id: "product_catalog", label: "Catalogue de produits et services", description: "Fiches, variantes, prix et disponibilité.", domainIds: ["commerce"] },
      { id: "inventory_movements", label: "Stock et mouvements", description: "Entrées, sorties, seuils et inventaires.", domainIds: ["commerce"] },
      { id: "order_management", label: "Commandes et ventes", description: "Commandes, statuts, retours et suivi commercial.", domainIds: ["commerce"] },
      { id: "returns_management", label: "Retours et remboursements", description: "Demandes de retour, échanges, remboursements, motifs et décisions traçables.", domainIds: ["commerce"] },
      { id: "delivery_tracking", label: "Livraison et retrait", description: "Zones, frais, affectation et preuve de livraison.", domainIds: ["commerce", "transport"] },
    ],
  },
  {
    id: "business_management", label: "Gestion d'entreprise", description: "Piloter équipes, opérations, objectifs, ressources et indicateurs.",
    roles: [{ id: "operations_manager", label: "Responsable des opérations", scope: "operational", description: "Coordonne les activités et ressources." }, { id: "team_member", label: "Membre de l'équipe", scope: "product_user", description: "Exécute les tâches qui lui sont attribuées." }],
    modules: [
      { id: "team_directory", label: "Équipe et responsabilités", description: "Membres, rôles, affectations et disponibilité.", domainIds: ["business_management"] },
      { id: "task_follow_up", label: "Tâches et suivi opérationnel", description: "Actions, échéances, responsables et avancement.", domainIds: ["business_management"] },
      { id: "business_indicators", label: "Tableau de bord d'activité", description: "Indicateurs, objectifs et alertes de gestion.", domainIds: ["business_management"] },
      { id: "materials_estimation", label: "Estimation des ressources et matériaux", description: "Quantités et coûts estimés selon les règles validées.", domainIds: ["architecture", "business_management"] },
    ],
  },
  {
    id: "telecommunications", label: "Télécommunications", description: "Gérer abonnés, lignes, forfaits, incidents, consommation et interventions.",
    roles: [{ id: "telecom_agent", label: "Agent réseau / support", scope: "operational", description: "Traite incidents et demandes techniques." }],
    modules: [
      { id: "subscriber_accounts", label: "Comptes et abonnements", description: "Abonnés, lignes, forfaits et renouvellements.", domainIds: ["telecommunications"] },
      { id: "usage_monitoring", label: "Consommation et suivi", description: "Volumes, seuils, périodes et alertes.", domainIds: ["telecommunications"] },
      { id: "incident_management", label: "Incidents et interventions", description: "Déclaration, diagnostic, affectation et résolution.", domainIds: ["telecommunications", "business_management"] },
    ],
  },
  {
    id: "health", label: "Santé et services de soins", description: "Organiser rendez-vous, dossiers, parcours et coordination sans remplacer les professionnels habilités.",
    roles: [{ id: "care_professional", label: "Professionnel habilité", scope: "operational", description: "Valide les actes et informations relevant de sa compétence." }],
    modules: [
      { id: "care_appointments", label: "Rendez-vous et accueil", description: "Disponibilités, rendez-vous, confirmations et accueil.", domainIds: ["health", "reservation"] },
      { id: "care_records", label: "Dossiers et documents", description: "Documents et informations avec accès strictement contrôlé.", domainIds: ["health"] },
      { id: "care_pathway", label: "Suivi du parcours", description: "Étapes, rappels et coordination des intervenants.", domainIds: ["health"] },
    ],
  },
  {
    id: "agriculture", label: "Agriculture et élevage", description: "Suivre parcelles, cultures, élevages, intrants, interventions et récoltes.",
    roles: [{ id: "farm_manager", label: "Exploitant / responsable agricole", scope: "operational", description: "Planifie et suit la production." }],
    modules: [
      { id: "farm_register", label: "Exploitations et parcelles", description: "Sites, parcelles, surfaces et caractéristiques.", domainIds: ["agriculture"] },
      { id: "production_cycles", label: "Cycles de production", description: "Cultures, saisons, lots et étapes d'élevage.", domainIds: ["agriculture"] },
      { id: "farm_inputs", label: "Intrants et interventions", description: "Semences, aliments, traitements, travaux et coûts.", domainIds: ["agriculture"] },
      { id: "harvest_tracking", label: "Récoltes et rendements", description: "Quantités, qualité, pertes et ventes.", domainIds: ["agriculture", "commerce"] },
    ],
  },
  {
    id: "transport", label: "Transport et logistique", description: "Organiser trajets, véhicules, chauffeurs, missions, colis et livraisons.",
    roles: [{ id: "dispatcher", label: "Dispatcheur / planificateur", scope: "operational", description: "Affecte les ressources et suit les missions." }],
    modules: [
      { id: "route_planning", label: "Trajets et planification", description: "Itinéraires, étapes, horaires et affectations.", domainIds: ["transport"] },
      { id: "fleet_register", label: "Véhicules et maintenance", description: "Parc, documents, contrôles et entretiens.", domainIds: ["transport"] },
      { id: "shipment_tracking", label: "Suivi des missions et colis", description: "Statuts, preuves, incidents et notifications.", domainIds: ["transport"] },
    ],
  },
  {
    id: "digitization", label: "Numérisation et archivage documentaire", description: "Recevoir, numériser, reconnaître, classer, rechercher et conserver des documents.",
    roles: [{ id: "document_operator", label: "Agent de numérisation", scope: "operational", description: "Réceptionne, numérise et contrôle la qualité des documents." }, { id: "archive_manager", label: "Responsable des archives", scope: "operational", description: "Définit le classement, les accès et les règles de conservation." }],
    modules: [
      { id: "document_intake", label: "Réception des documents", description: "Dépôt, import, lots, formats acceptés et traçabilité de réception.", domainIds: ["digitization"] },
      { id: "document_capture", label: "Numérisation et capture", description: "Scan, capture mobile, traitement d'image et contrôle qualité.", domainIds: ["digitization"] },
      { id: "document_ocr", label: "OCR et extraction", description: "Reconnaissance optique, extraction de texte et vérification humaine.", domainIds: ["digitization"] },
      { id: "document_classification", label: "Classement et métadonnées", description: "Catégories, dossiers, tags, index et niveaux de confidentialité.", domainIds: ["digitization"] },
      { id: "document_search", label: "Recherche documentaire", description: "Recherche plein texte, filtres et accès selon permissions.", domainIds: ["digitization"] },
      { id: "document_archive", label: "Archivage et conservation", description: "Durées de conservation, sauvegardes, exports et élimination autorisée.", domainIds: ["digitization"] },
    ],
  },
  {
    id: "media", label: "Médias et marketing", description: "Créer, organiser, publier et mesurer des contenus et campagnes.",
    roles: [{ id: "content_editor", label: "Créateur / éditeur", scope: "operational", description: "Prépare les contenus et valide leur publication." }],
    modules: [
      { id: "content_calendar", label: "Calendrier éditorial", description: "Idées, scripts, échéances et canaux.", domainIds: ["media"] },
      { id: "media_asset_library", label: "Bibliothèque de médias", description: "Images, vidéos, rushes, droits et versions.", domainIds: ["media"] },
      { id: "campaign_analytics", label: "Performance des campagnes", description: "Portée, interactions, conversions et comparaison.", domainIds: ["media"] },
    ],
  },
];

const moduleLabels: Record<string, string> = {
  public_pages: "Pages publiques", content_sections: "Sections et contenus", contact_forms: "Formulaires de contact", seo_visibility: "Visibilité et référencement",
  role_workspaces: "Espaces par profil", admin_console: "Espace administrateur", permissions: "Droits et permissions", activity_dashboard: "Tableau de bord",
  mobile_navigation: "Navigation mobile", push_notifications: "Notifications mobiles", device_permissions: "Autorisations de l'appareil", offline_ready_states: "Mode hors connexion à préciser",
  application_workspace: "Espace applicatif", data_forms: "Formulaires métier", search_and_filters: "Recherche et filtres", operation_history: "Historique des opérations",
  availability_calendar: "Calendrier des disponibilités", booking_lifecycle: "Cycle de réservation", confirmation_messages: "Confirmations", booking_admin: "Gestion des réservations",
  product_catalog: "Catalogue produits", shopping_cart: "Panier", order_management: "Gestion des commandes", returns_management: "Retours et remboursements", checkout: "Paiement et validation de commande",
  game_lobby: "Salle de jeu", game_rules: "Règles du jeu", player_sessions: "Sessions joueurs", score_progression: "Scores et progression", career_orientation: "Orientation et recommandations",
  input_builder: "Paramètres de création", generation_engine: "Moteur de génération", preview_output: "Aperçu du résultat", export_history: "Export et historique",
  project_canvas: "Espace de conception", file_library: "Bibliothèque de fichiers", revision_history: "Historique des versions", approval_workflow: "Circuit de validation",
  operations_register: "Registre des opérations", resource_planning: "Planification des ressources", task_follow_up: "Suivi des tâches", evidence_log: "Journal de preuves",
};

export function getProductTypeCatalog(): SolutionProductType[] {
  return productTypes.map((item) => ({ ...item, baselineModules: [...item.baselineModules], defaultRoles: [...item.defaultRoles] }));
}

export function getProductType(id: string): SolutionProductType | undefined {
  return getProductTypeCatalog().find((item) => item.id === id);
}

export function getDomainCatalog(id: string): SolutionDomainCatalog | undefined {
  const domain = domainCatalogs.find((item) => item.id === id);
  return domain ? { ...domain, modules: domain.modules.map((module) => ({ ...module, domainIds: [...module.domainIds], dependsOn: module.dependsOn ? [...module.dependsOn] : undefined })), roles: [...domain.roles] } : undefined;
}

export function getDomainCatalogs(): SolutionDomainCatalog[] {
  return domainCatalogs.map((domain) => getDomainCatalog(domain.id) as SolutionDomainCatalog);
}

export function getBaselineModuleLabel(id: string): string {
  return moduleLabels[id] ?? id.replace(/_/g, " ").replace(/^./, (letter) => letter.toLocaleUpperCase("fr"));
}

export function buildHybridDomainComposition(domainIds: string[]): HybridDomainComposition {
  const selected = [...new Set(domainIds)].filter((id): id is SolutionDomainId =>
    domainCatalogs.some((domain) => domain.id === id),
  );
  const modules = new Map<string, SolutionDomainModule>();
  const roles = new Map<string, SolutionProductRole>();

  selected.forEach((domainId) => {
    const domain = domainCatalogs.find((item) => item.id === domainId);
    if (!domain) return;
    domain.modules.forEach((module) => {
      const existing = modules.get(module.id);
      modules.set(module.id, existing
        ? { ...existing, domainIds: [...new Set([...existing.domainIds, ...module.domainIds])] }
        : { ...module, domainIds: [...module.domainIds], dependsOn: module.dependsOn ? [...module.dependsOn] : undefined });
    });
    domain.roles.forEach((role) => roles.set(role.id, role));
  });

  return {
    domainIds: selected,
    modules: [...modules.values()],
    roles: [...roles.values()],
    isHybrid: selected.length > 1,
  };
}
