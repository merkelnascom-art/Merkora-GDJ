import type { KnowledgeConcept, KnowledgeRelationship } from "./types";

const CREATED_AT = "2026-11-17T00:00:00.000Z";
const SOURCE_ID = "source:merkora-family-11-public-governance-v1";
const FAMILY_ID = "family:public-governance";

type Seed = { id:string; type:string; fr:string; en:string; parentId:string; aliases:string[] };

const SEEDS: Seed[] = [
  {
    "id": "subdomain-gov:central-government",
    "type": "subdomain",
    "fr": "Administration centrale",
    "en": "Central government",
    "parentId": "domain:public-administration",
    "aliases": [
      "services centraux",
      " ministères"
    ]
  },
  {
    "id": "subdomain-gov:public-policy-design",
    "type": "subdomain",
    "fr": "Conception des politiques publiques",
    "en": "Public policy design",
    "parentId": "domain:public-administration",
    "aliases": [
      "élaboration des politiques publiques"
    ]
  },
  {
    "id": "subdomain-gov:public-service-delivery",
    "type": "subdomain",
    "fr": "Prestation des services publics",
    "en": "Public service delivery",
    "parentId": "domain:public-administration",
    "aliases": [
      "services administratifs"
    ]
  },
  {
    "id": "subdomain-gov:administrative-procedures",
    "type": "subdomain",
    "fr": "Procédures administratives",
    "en": "Administrative procedures",
    "parentId": "domain:public-administration",
    "aliases": [
      "démarches administratives"
    ]
  },
  {
    "id": "subdomain-gov:public-human-resources",
    "type": "subdomain",
    "fr": "Gestion des ressources humaines publiques",
    "en": "Public-sector human resources",
    "parentId": "domain:public-administration",
    "aliases": [
      "fonction publique"
    ]
  },
  {
    "id": "subdomain-gov:public-procurement",
    "type": "subdomain",
    "fr": "Commande publique et marchés publics",
    "en": "Public procurement",
    "parentId": "domain:public-administration",
    "aliases": [
      "marchés publics"
    ]
  },
  {
    "id": "subdomain-gov:regulatory-administration",
    "type": "subdomain",
    "fr": "Administration réglementaire et contrôle",
    "en": "Regulatory administration and enforcement",
    "parentId": "domain:public-administration",
    "aliases": [
      "contrôle administratif"
    ]
  },
  {
    "id": "subdomain-gov:public-records-management",
    "type": "subdomain",
    "fr": "Gestion des archives et documents publics",
    "en": "Public records management",
    "parentId": "domain:public-administration",
    "aliases": [
      "archives publiques"
    ]
  },
  {
    "id": "subdomain-gov:local-public-services",
    "type": "subdomain",
    "fr": "Services publics locaux",
    "en": "Local public services",
    "parentId": "domain:local-government",
    "aliases": [
      "services municipaux", "gestion des collectivités territoriales"
    ]
  },
  {
    "id": "subdomain-gov:territorial-planning",
    "type": "subdomain",
    "fr": "Planification et aménagement territorial",
    "en": "Territorial planning",
    "parentId": "domain:local-government",
    "aliases": [
      "aménagement du territoire"
    ]
  },
  {
    "id": "subdomain-gov:citizen-participation",
    "type": "subdomain",
    "fr": "Participation citoyenne et concertation",
    "en": "Citizen participation and consultation",
    "parentId": "domain:local-government",
    "aliases": [
      "concertation publique"
    ]
  },
  {
    "id": "subdomain-gov:intergovernmental-relations",
    "type": "subdomain",
    "fr": "Relations entre niveaux de gouvernement",
    "en": "Intergovernmental relations",
    "parentId": "domain:local-government",
    "aliases": [
      "coopération intercommunale"
    ]
  },
  {
    "id": "subdomain-gov:public-budgeting",
    "type": "subdomain",
    "fr": "Préparation et programmation budgétaires publiques",
    "en": "Public budgeting",
    "parentId": "domain:public-finance",
    "aliases": [
      "budget de l'État"
    ]
  },
  {
    "id": "subdomain-gov:public-expenditure",
    "type": "subdomain",
    "fr": "Exécution et contrôle de la dépense publique",
    "en": "Public expenditure management",
    "parentId": "domain:public-finance",
    "aliases": [
      "dépenses publiques", "exécution de la dépense publique"
    ]
  },
  {
    "id": "subdomain-gov:public-revenue",
    "type": "subdomain",
    "fr": "Recettes publiques et fiscalité administrative",
    "en": "Public revenue administration",
    "parentId": "domain:public-finance",
    "aliases": [
      "recettes de l'État"
    ]
  },
  {
    "id": "subdomain-gov:public-debt",
    "type": "subdomain",
    "fr": "Dette publique et financement souverain",
    "en": "Public debt and sovereign financing",
    "parentId": "domain:public-finance",
    "aliases": [
      "dette de l'État"
    ]
  },
  {
    "id": "subdomain-gov:diplomatic-relations",
    "type": "subdomain",
    "fr": "Relations diplomatiques bilatérales et multilatérales",
    "en": "Bilateral and multilateral diplomacy",
    "parentId": "domain:diplomacy-international",
    "aliases": [
      "relations diplomatiques"
    ]
  },
  {
    "id": "subdomain-gov:international-cooperation",
    "type": "subdomain",
    "fr": "Coopération et aide internationales",
    "en": "International cooperation and assistance",
    "parentId": "domain:diplomacy-international",
    "aliases": [
      "coopération internationale"
    ]
  },
  {
    "id": "subdomain-gov:consular-services",
    "type": "subdomain",
    "fr": "Services consulaires et assistance aux ressortissants",
    "en": "Consular services and citizen assistance",
    "parentId": "domain:diplomacy-international",
    "aliases": [
      "assistance consulaire"
    ]
  },
  {
    "id": "subdomain-gov:civil-status-records",
    "type": "subdomain",
    "fr": "Registres d'état civil et événements de vie",
    "en": "Civil status records and life events",
    "parentId": "domain:civil-registration",
    "aliases": [
      "actes de naissance",
      " actes de mariage"
    ]
  },
  {
    "id": "specialization-gov:open-government",
    "type": "specialization",
    "fr": "Gouvernement ouvert et transparence",
    "en": "Open government and transparency",
    "parentId": "domain:public-administration",
    "aliases": [
      "transparence publique"
    ]
  },
  {
    "id": "specialization-gov:digital-government",
    "type": "specialization",
    "fr": "Administration numérique et services en ligne",
    "en": "Digital government and e-services",
    "parentId": "domain:public-administration",
    "aliases": [
      "e-gouvernement"
    ]
  },
  {
    "id": "specialization-gov:public-integrity",
    "type": "specialization",
    "fr": "Intégrité publique et prévention de la corruption",
    "en": "Public integrity and anti-corruption",
    "parentId": "domain:public-administration",
    "aliases": [
      "déontologie publique"
    ]
  },
  {
    "id": "specialization-gov:decentralization",
    "type": "specialization",
    "fr": "Décentralisation et gouvernance territoriale",
    "en": "Decentralization and territorial governance",
    "parentId": "domain:local-government",
    "aliases": [
      "décentralisation"
    ]
  },
  {
    "id": "specialization-gov:participatory-budgeting",
    "type": "specialization",
    "fr": "Budget participatif",
    "en": "Participatory budgeting",
    "parentId": "domain:public-finance",
    "aliases": [
      "budget citoyen"
    ]
  },
  {
    "id": "specialization-gov:electoral-administration",
    "type": "specialization",
    "fr": "Administration électorale",
    "en": "Electoral administration",
    "parentId": "domain:public-administration",
    "aliases": [
      "organisation électorale"
    ]
  },
  {
    "id": "specialization-gov:multilateral-governance",
    "type": "specialization",
    "fr": "Gouvernance multilatérale",
    "en": "Multilateral governance",
    "parentId": "domain:diplomacy-international",
    "aliases": [
      "organisations internationales"
    ]
  },
  {
    "id": "occupation-gov:public-administrator",
    "type": "occupation",
    "fr": "Administrateur public",
    "en": "Public administrator",
    "parentId": "domain:public-administration",
    "aliases": [
      "administrateur de l'État"
    ]
  },
  {
    "id": "occupation-gov:policy-analyst",
    "type": "occupation",
    "fr": "Analyste des politiques publiques",
    "en": "Public policy analyst",
    "parentId": "domain:public-administration",
    "aliases": [
      "analyste politique publique"
    ]
  },
  {
    "id": "occupation-gov:civil-servant",
    "type": "occupation",
    "fr": "Agent de la fonction publique",
    "en": "Civil servant",
    "parentId": "domain:public-administration",
    "aliases": [
      "fonctionnaire"
    ]
  },
  {
    "id": "occupation-gov:municipal-secretary",
    "type": "occupation",
    "fr": "Secrétaire général de mairie",
    "en": "Municipal secretary general",
    "parentId": "domain:local-government",
    "aliases": [
      "secrétaire général de commune"
    ]
  },
  {
    "id": "occupation-gov:local-elected-official",
    "type": "occupation",
    "fr": "Élu local",
    "en": "Local elected official",
    "parentId": "domain:local-government",
    "aliases": [
      "maire",
      " conseiller communal"
    ]
  },
  {
    "id": "occupation-gov:public-finance-officer",
    "type": "occupation",
    "fr": "Gestionnaire des finances publiques",
    "en": "Public finance officer",
    "parentId": "domain:public-finance",
    "aliases": [
      "agent des finances publiques"
    ]
  },
  {
    "id": "occupation-gov:procurement-officer",
    "type": "occupation",
    "fr": "Responsable de la commande publique",
    "en": "Public procurement officer",
    "parentId": "domain:public-administration",
    "aliases": [
      "spécialiste des marchés publics"
    ]
  },
  {
    "id": "occupation-gov:public-auditor",
    "type": "occupation",
    "fr": "Auditeur du secteur public",
    "en": "Public-sector auditor",
    "parentId": "domain:public-finance",
    "aliases": [
      "contrôleur public"
    ]
  },
  {
    "id": "occupation-gov:diplomat",
    "type": "occupation",
    "fr": "Diplomate",
    "en": "Diplomat",
    "parentId": "domain:diplomacy-international",
    "aliases": [
      "agent diplomatique"
    ]
  },
  {
    "id": "occupation-gov:consular-officer",
    "type": "occupation",
    "fr": "Agent consulaire",
    "en": "Consular officer",
    "parentId": "domain:diplomacy-international",
    "aliases": [
      "consul"
    ]
  },
  {
    "id": "occupation-gov:civil-registrar",
    "type": "occupation",
    "fr": "Officier d'état civil",
    "en": "Civil registrar",
    "parentId": "domain:civil-registration",
    "aliases": [
      "agent d'état civil"
    ]
  },
  {
    "id": "occupation-gov:public-service-designer",
    "type": "occupation",
    "fr": "Concepteur de services publics",
    "en": "Public service designer",
    "parentId": "domain:public-administration",
    "aliases": [
      "designer de services publics"
    ]
  },
  {
    "id": "activity-gov:policy-evaluation",
    "type": "activity",
    "fr": "Évaluation des politiques publiques",
    "en": "Public policy evaluation",
    "parentId": "domain:public-administration",
    "aliases": [
      "évaluer une politique publique"
    ]
  },
  {
    "id": "activity-gov:citizen-request-processing",
    "type": "activity",
    "fr": "Instruction d'une demande citoyenne",
    "en": "Citizen request processing",
    "parentId": "domain:public-administration",
    "aliases": [
      "traitement d'une demande administrative"
    ]
  },
  {
    "id": "activity-gov:administrative-decision",
    "type": "activity",
    "fr": "Prise et notification d'une décision administrative",
    "en": "Administrative decision and notification",
    "parentId": "domain:public-administration",
    "aliases": [
      "décision administrative"
    ]
  },
  {
    "id": "activity-gov:public-consultation",
    "type": "activity",
    "fr": "Organisation d'une consultation publique",
    "en": "Public consultation",
    "parentId": "domain:local-government",
    "aliases": [
      "consultation citoyenne"
    ]
  },
  {
    "id": "activity-gov:public-budget-execution",
    "type": "activity",
    "fr": "Exécution du budget public",
    "en": "Public budget execution",
    "parentId": "domain:public-finance",
    "aliases": [
      "exécution budgétaire"
    ]
  },
  {
    "id": "activity-gov:public-revenue-collection",
    "type": "activity",
    "fr": "Collecte et suivi des recettes publiques",
    "en": "Public revenue collection",
    "parentId": "domain:public-finance",
    "aliases": [
      "recouvrement des recettes publiques"
    ]
  },
  {
    "id": "activity-gov:public-audit",
    "type": "activity",
    "fr": "Audit et contrôle des fonds publics",
    "en": "Public audit",
    "parentId": "domain:public-finance",
    "aliases": [
      "audit public"
    ]
  },
  {
    "id": "activity-gov:diplomatic-negotiation",
    "type": "activity",
    "fr": "Négociation diplomatique",
    "en": "Diplomatic negotiation",
    "parentId": "domain:diplomacy-international",
    "aliases": [
      "négociation internationale"
    ]
  },
  {
    "id": "activity-gov:consular-assistance",
    "type": "activity",
    "fr": "Assistance consulaire aux ressortissants",
    "en": "Consular assistance",
    "parentId": "domain:diplomacy-international",
    "aliases": [
      "aide aux citoyens à l'étranger"
    ]
  },
  {
    "id": "activity-gov:civil-event-registration",
    "type": "activity",
    "fr": "Enregistrement d'un événement d'état civil",
    "en": "Civil event registration",
    "parentId": "domain:civil-registration",
    "aliases": [
      "enregistrement naissance mariage décès"
    ]
  },
  {
    "id": "activity-gov:public-document-issuance",
    "type": "activity",
    "fr": "Délivrance d'un document administratif",
    "en": "Public document issuance",
    "parentId": "domain:civil-registration",
    "aliases": [
      "délivrance acte administratif"
    ]
  },
  {
    "id": "activity-gov:public-program-monitoring",
    "type": "activity",
    "fr": "Suivi d'un programme public",
    "en": "Public program monitoring",
    "parentId": "domain:public-administration",
    "aliases": [
      "suivi de programme public"
    ]
  },
  {
    "id": "process-gov:policy-cycle",
    "type": "process",
    "fr": "Cycle de conception et d'évaluation d'une politique publique",
    "en": "Public policy cycle",
    "parentId": "domain:public-administration",
    "aliases": [
      "cycle de politique publique"
    ]
  },
  {
    "id": "process-gov:administrative-case-management",
    "type": "process",
    "fr": "Cycle de traitement d'un dossier administratif",
    "en": "Administrative case management",
    "parentId": "domain:public-administration",
    "aliases": [
      "instruction dossier administratif"
    ]
  },
  {
    "id": "process-gov:public-budget-cycle",
    "type": "process",
    "fr": "Cycle budgétaire public",
    "en": "Public budget cycle",
    "parentId": "domain:public-finance",
    "aliases": [
      "préparation vote exécution budget"
    ]
  },
  {
    "id": "process-gov:public-procurement-cycle",
    "type": "process",
    "fr": "Cycle de la commande publique",
    "en": "Public procurement cycle",
    "parentId": "domain:public-administration",
    "aliases": [
      "passation marché public"
    ]
  },
  {
    "id": "process-gov:local-deliberation-cycle",
    "type": "process",
    "fr": "Cycle de délibération d'une collectivité",
    "en": "Local deliberation cycle",
    "parentId": "domain:local-government",
    "aliases": [
      "délibération communale"
    ]
  },
  {
    "id": "process-gov:diplomatic-mission-cycle",
    "type": "process",
    "fr": "Cycle d'une mission diplomatique",
    "en": "Diplomatic mission cycle",
    "parentId": "domain:diplomacy-international",
    "aliases": [
      "mission diplomatique"
    ]
  },
  {
    "id": "process-gov:civil-registration-lifecycle",
    "type": "process",
    "fr": "Cycle de vie d'un acte d'état civil",
    "en": "Civil registration lifecycle",
    "parentId": "domain:civil-registration",
    "aliases": [
      "cycle acte naissance"
    ]
  },
  {
    "id": "process-gov:public-grievance-process",
    "type": "process",
    "fr": "Traitement d'une réclamation ou d'un recours citoyen",
    "en": "Public grievance and appeal process",
    "parentId": "domain:public-administration",
    "aliases": [
      "recours administratif"
    ]
  },
  {
    "id": "problem-gov:administrative-delays",
    "type": "problem",
    "fr": "Retards et lenteurs administratifs",
    "en": "Administrative delays",
    "parentId": "domain:public-administration",
    "aliases": [
      "lenteur administrative"
    ]
  },
  {
    "id": "problem-gov:opaque-decisions",
    "type": "problem",
    "fr": "Décisions publiques insuffisamment motivées ou opaques",
    "en": "Opaque or poorly explained public decisions",
    "parentId": "domain:public-administration",
    "aliases": [
      "manque de transparence"
    ]
  },
  {
    "id": "problem-gov:service-access-barriers",
    "type": "problem",
    "fr": "Obstacles d'accès aux services publics",
    "en": "Barriers to public-service access",
    "parentId": "domain:public-administration",
    "aliases": [
      "difficulté accès service public"
    ]
  },
  {
    "id": "problem-gov:corruption-conflicts",
    "type": "problem",
    "fr": "Risques de corruption et conflits d'intérêts",
    "en": "Corruption and conflicts-of-interest risks",
    "parentId": "domain:public-administration",
    "aliases": [
      "conflit d'intérêt"
    ]
  },
  {
    "id": "problem-gov:budget-overruns",
    "type": "problem",
    "fr": "Dépassements et dérives budgétaires",
    "en": "Budget overruns",
    "parentId": "domain:public-finance",
    "aliases": [
      "dépassement budget"
    ]
  },
  {
    "id": "problem-gov:weak-public-revenue",
    "type": "problem",
    "fr": "Faible mobilisation des recettes publiques",
    "en": "Weak public revenue collection",
    "parentId": "domain:public-finance",
    "aliases": [
      "faible recouvrement fiscal"
    ]
  },
  {
    "id": "problem-gov:coordination-gaps",
    "type": "problem",
    "fr": "Défaut de coordination entre administrations",
    "en": "Intergovernmental coordination gaps",
    "parentId": "domain:local-government",
    "aliases": [
      "mauvaise coordination administrative"
    ]
  },
  {
    "id": "problem-gov:civil-record-errors",
    "type": "problem",
    "fr": "Erreurs et incohérences des actes d'état civil",
    "en": "Civil-record errors and inconsistencies",
    "parentId": "domain:civil-registration",
    "aliases": [
      "erreur acte naissance"
    ]
  },
  {
    "id": "problem-gov:diplomatic-case-tracking",
    "type": "problem",
    "fr": "Suivi insuffisant des dossiers diplomatiques et consulaires",
    "en": "Poor diplomatic and consular case tracking",
    "parentId": "domain:diplomacy-international",
    "aliases": [
      "dossier consulaire perdu"
    ]
  },
  {
    "id": "problem-gov:public-data-breach",
    "type": "problem",
    "fr": "Divulgation ou accès indu à des données publiques sensibles",
    "en": "Unauthorized disclosure of sensitive public data",
    "parentId": "domain:public-administration",
    "aliases": [
      "fuite données administratives"
    ]
  },
  {
    "id": "resource-gov:legal-frameworks",
    "type": "resource",
    "fr": "Textes juridiques et référentiels administratifs",
    "en": "Legal frameworks and administrative standards",
    "parentId": "domain:public-administration",
    "aliases": [
      "lois décrets règlements"
    ]
  },
  {
    "id": "resource-gov:public-budget-documents",
    "type": "resource",
    "fr": "Documents budgétaires et comptables publics",
    "en": "Public budget and accounting documents",
    "parentId": "domain:public-finance",
    "aliases": [
      "loi de finances"
    ]
  },
  {
    "id": "resource-gov:citizen-case-files",
    "type": "resource",
    "fr": "Dossiers et pièces justificatives des citoyens",
    "en": "Citizen case files and supporting documents",
    "parentId": "domain:public-administration",
    "aliases": [
      "dossier usager"
    ]
  },
  {
    "id": "resource-gov:public-registers",
    "type": "resource",
    "fr": "Registres et archives publics",
    "en": "Public registers and archives",
    "parentId": "domain:civil-registration",
    "aliases": [
      "registre état civil"
    ]
  },
  {
    "id": "resource-gov:territorial-data",
    "type": "resource",
    "fr": "Données territoriales et cartographiques",
    "en": "Territorial and geospatial data",
    "parentId": "domain:local-government",
    "aliases": [
      "données communales"
    ]
  },
  {
    "id": "resource-gov:diplomatic-records",
    "type": "resource",
    "fr": "Dossiers et correspondances diplomatiques",
    "en": "Diplomatic files and correspondence",
    "parentId": "domain:diplomacy-international",
    "aliases": [
      "archives diplomatiques"
    ]
  },
  {
    "id": "resource-gov:public-performance-data",
    "type": "resource",
    "fr": "Données de performance et d'évaluation publiques",
    "en": "Public performance and evaluation data",
    "parentId": "domain:public-administration",
    "aliases": [
      "indicateurs secteur public"
    ]
  },
  {
    "id": "function-gov:citizen-portal",
    "type": "function",
    "fr": "Portail citoyen et démarches en ligne",
    "en": "Citizen portal and online services",
    "parentId": "domain:public-administration",
    "aliases": [
      "portail usager"
    ]
  },
  {
    "id": "function-gov:administrative-workflow",
    "type": "function",
    "fr": "Workflow d'instruction et de validation administrative",
    "en": "Administrative case workflow",
    "parentId": "domain:public-administration",
    "aliases": [
      "circuit de validation"
    ]
  },
  {
    "id": "function-gov:public-budget-dashboard",
    "type": "function",
    "fr": "Tableau de bord du budget public",
    "en": "Public budget dashboard",
    "parentId": "domain:public-finance",
    "aliases": [
      "suivi budget public"
    ]
  },
  {
    "id": "function-gov:procurement-transparency",
    "type": "function",
    "fr": "Publication et transparence des marchés publics",
    "en": "Public procurement transparency",
    "parentId": "domain:public-administration",
    "aliases": [
      "portail marchés publics"
    ]
  },
  {
    "id": "function-gov:civil-registry-management",
    "type": "function",
    "fr": "Gestion sécurisée de l'état civil",
    "en": "Civil registry management",
    "parentId": "domain:civil-registration",
    "aliases": [
      "logiciel état civil"
    ]
  },
  {
    "id": "function-gov:public-complaints-management",
    "type": "function",
    "fr": "Gestion des réclamations et recours citoyens",
    "en": "Public complaints management",
    "parentId": "domain:public-administration",
    "aliases": [
      "gestion plaintes citoyennes"
    ]
  },
  {
    "id": "function-gov:public-program-monitoring",
    "type": "function",
    "fr": "Suivi des programmes et projets publics",
    "en": "Public program monitoring",
    "parentId": "domain:public-administration",
    "aliases": [
      "suivi projets publics"
    ]
  },
  {
    "id": "indicator-gov:service-processing-time",
    "type": "indicator",
    "fr": "Délai moyen de traitement d'un service public",
    "en": "Public service processing time",
    "parentId": "domain:public-administration",
    "aliases": [
      "délai traitement dossier"
    ]
  },
  {
    "id": "indicator-gov:citizen-satisfaction",
    "type": "indicator",
    "fr": "Satisfaction des usagers des services publics",
    "en": "Public-service user satisfaction",
    "parentId": "domain:public-administration",
    "aliases": [
      "satisfaction citoyenne"
    ]
  },
  {
    "id": "indicator-gov:administrative-backlog",
    "type": "indicator",
    "fr": "Volume et ancienneté du stock de dossiers en attente",
    "en": "Administrative backlog",
    "parentId": "domain:public-administration",
    "aliases": [
      "arriéré administratif"
    ]
  },
  {
    "id": "indicator-gov:budget-execution-rate",
    "type": "indicator",
    "fr": "Taux d'exécution budgétaire",
    "en": "Budget execution rate",
    "parentId": "domain:public-finance",
    "aliases": [
      "taux exécution budget"
    ]
  },
  {
    "id": "indicator-gov:public-revenue-rate",
    "type": "indicator",
    "fr": "Taux de mobilisation des recettes publiques",
    "en": "Public revenue collection rate",
    "parentId": "domain:public-finance",
    "aliases": [
      "taux recouvrement recettes"
    ]
  },
  {
    "id": "indicator-gov:procurement-competition-rate",
    "type": "indicator",
    "fr": "Taux de mise en concurrence des marchés publics",
    "en": "Public procurement competition rate",
    "parentId": "domain:public-administration",
    "aliases": [
      "taux concurrence marchés"
    ]
  },
  {
    "id": "indicator-gov:policy-outcome-achievement",
    "type": "indicator",
    "fr": "Taux d'atteinte des résultats d'une politique publique",
    "en": "Public policy outcome achievement",
    "parentId": "domain:public-administration",
    "aliases": [
      "résultats politique publique"
    ]
  }
];

function makeConcept(seed: Seed): KnowledgeConcept {
  const definitionFr = `${seed.fr} désigne le champ, le rôle ou l'opération du secteur public décrit par ce concept. Son périmètre précis dépend des compétences, textes et procédures de la juridiction concernée.`;
  const definitionEn = `${seed.en} describes the public-sector field, role or operation represented by this concept. Its precise scope depends on the applicable jurisdiction, legal powers and procedures.`;
  return {
    id: seed.id,
    canonicalKey: `merkora.public-governance.${seed.type}.${seed.id.replace(/^[^:]+:/, "")}`,
    conceptType: seed.type,
    definitions: [
      { language:"fr", label:seed.fr, definition:definitionFr },
      { language:"en", label:seed.en, definition:definitionEn },
    ],
    terms: [
      { value:seed.fr, language:"fr", kind:"preferred" },
      { value:seed.en, language:"en", kind:"preferred" },
      ...seed.aliases.map(value=>({value,language:"fr",kind:"synonym" as const})),
    ],
    classifications: [{
      classificationType: seed.type === "specialization" ? "universal-specialization" : "universal-domain",
      parentConceptId: seed.parentId,
    }],
    attributes: [],
    relationships: [],
    scope: { global:true },
    lifecycle: { status:"validated", version:1, createdAt:CREATED_AT, updatedAt:CREATED_AT },
    sources: [{ id:SOURCE_ID, sourceType:"curated_domain_knowledge", label:"MerKora GDJ — Famille 11 Administration publique et gouvernance, version 1" }],
    reliability: {
      evidenceLevel:"documented",
      reviewStatus:"not_reviewed",
      verificationNotes:[
        "Les compétences des autorités, procédures, délais, seuils, voies de recours, règles budgétaires et obligations de publication dépendent du pays, du niveau de gouvernement et des textes en vigueur.",
        "Les concepts ne constituent ni un avis juridique, ni une délégation de pouvoir, ni une autorisation d'effectuer un acte administratif ou financier.",
        "Les décisions publiques doivent rester prises et signées par une personne ou autorité légalement habilitée ; l'IA prépare, explique et signale, sans se substituer au décideur.",
        "Les données d'état civil, d'identité, de dossiers citoyens et diplomatiques sont protégées par des règles d'accès, de minimisation, de conservation et de traçabilité.",
        "La Famille 10 couvre les services financiers privés, la comptabilité, l'assurance et l'investissement ; cette famille couvre les budgets, recettes, dépenses et contrôles des administrations publiques."
      ]
    }
  };
}

export const PUBLIC_GOVERNANCE_FAMILY_ID = FAMILY_ID;
export const PUBLIC_GOVERNANCE_CATALOG: KnowledgeConcept[] = SEEDS.map(makeConcept);

const relationSeeds = [
  ["activity-gov:citizen-request-processing","process-gov:administrative-case-management","participates_in"],
  ["activity-gov:public-budget-execution","process-gov:public-budget-cycle","part_of"],
  ["activity-gov:civil-event-registration","process-gov:civil-registration-lifecycle","part_of"],
  ["function-gov:administrative-workflow","activity-gov:administrative-decision","supports"],
  ["function-gov:public-budget-dashboard","activity-gov:public-budget-execution","monitors"],
  ["function-gov:civil-registry-management","resource-gov:public-registers","manages"],
  ["problem-gov:administrative-delays","function-gov:administrative-workflow","may_be_mitigated_by"],
  ["problem-gov:budget-overruns","function-gov:public-budget-dashboard","may_be_mitigated_by"],
] as const;

export const PUBLIC_GOVERNANCE_RELATIONSHIPS: KnowledgeRelationship[] = relationSeeds.map(([sourceConceptId,targetConceptId,predicate],index)=>({
  id:`rel:family-11-${index+1}`,
  sourceConceptId,
  targetConceptId,
  predicate,
  status:"validated",
  confidence:0.9,
  sourceIds:[SOURCE_ID],
  version:1,
}));
