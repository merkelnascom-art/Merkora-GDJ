export type ProfessionCandidate = {
  id: string;
  title: string;
  familyId: string;
  sourceGroup: string;
  sectorIds?: readonly string[];
  reviewStatus: "candidate";
};

export type ProfessionProfile = {
  id: string;
  title: string;
  familyId: string;
  /** Sector links are reviewed candidates, not official occupational classifications. */
  sectorIds?: readonly string[];
  reviewStatus: "documented_unreviewed";
  purpose: string;
  workflow: string;
  actorsAndResponsibilities: string;
  businessData: string;
  diagnosticQuestions: string;
  digitalCapabilities: string;
  risksAndLimits: string;
  possibleIndicators: string;
  projectExample: string;
  clientValidation: string;
};

/**
 * The source document declares 500 candidate titles. Its current index has
 * 504 bullets, including 20 family labels; excluding those labels leaves
 * 484 candidate entries. The 16-entry discrepancy is intentionally visible.
 */
export const PROFESSION_CANDIDATE_SOURCE_DECLARED_COUNT = 500;
export const PROFESSION_CANDIDATE_IMPORTED_COUNT = 484;
export const PROFESSION_CANDIDATE_CURATED_ADDITION_COUNT = 1407;
export const PROFESSION_CANDIDATE_TOTAL_COUNT = PROFESSION_CANDIDATE_IMPORTED_COUNT + PROFESSION_CANDIDATE_CURATED_ADDITION_COUNT;
export const PROFESSION_CANDIDATE_SOURCE_GAP = PROFESSION_CANDIDATE_SOURCE_DECLARED_COUNT - PROFESSION_CANDIDATE_IMPORTED_COUNT;

export const MERKORA_PROFESSION_CANDIDATES = [
  {
    "id": "candidate-01-001",
    "title": "Médecin spécialiste",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-002",
    "title": "Infirmier diplômé",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-003",
    "title": "Sage-femme",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-004",
    "title": "Aide-soignant",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-005",
    "title": "Pharmacien",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-006",
    "title": "Préparateur en pharmacie",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-007",
    "title": "Biologiste médical",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-008",
    "title": "Technicien de laboratoire",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-009",
    "title": "Radiologue",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-010",
    "title": "Manipulateur en imagerie",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-011",
    "title": "Kinésithérapeute",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-012",
    "title": "Orthophoniste",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-013",
    "title": "Pédiatre",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-014",
    "title": "Cardiologue",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-015",
    "title": "Dermatologue",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-016",
    "title": "Chirurgien",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-017",
    "title": "Anesthésiste",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-018",
    "title": "Secrétaire médical",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-019",
    "title": "Gestionnaire de clinique",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-020",
    "title": "Coordinateur de soins",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-021",
    "title": "Agent d’accueil",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-022",
    "title": "Responsable pharmacie",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-023",
    "title": "Technicien biomédical",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-024",
    "title": "Gestionnaire de dossiers patients",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-001",
    "title": "Coach fitness",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-002",
    "title": "Préparateur physique",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-003",
    "title": "Éducateur sportif",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-004",
    "title": "Professeur d’EPS",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-005",
    "title": "Arbitre",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-006",
    "title": "Juge sportif",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-007",
    "title": "Directeur technique",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-008",
    "title": "Responsable de club",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-009",
    "title": "Gestionnaire de salle",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-010",
    "title": "Organisateur de compétition",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-011",
    "title": "Responsable d’équipement",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-012",
    "title": "Analyste de performance",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-013",
    "title": "Coach personnel",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-014",
    "title": "Entraîneur de football",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-015",
    "title": "Entraîneur de basketball",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-016",
    "title": "Entraîneur de natation",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-017",
    "title": "Moniteur de tennis",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-018",
    "title": "Responsable de formation sportive",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-019",
    "title": "Agent d’accueil sportif",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-020",
    "title": "Gestionnaire de licences",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-021",
    "title": "Coordinateur d’équipes",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-022",
    "title": "Responsable de centre sportif",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-023",
    "title": "Animateur sportif",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-024",
    "title": "Technicien d’équipement sportif",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-001",
    "title": "Maraîcher",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-002",
    "title": "Chef de culture",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-003",
    "title": "Ouvrier agricole",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-004",
    "title": "Pépiniériste",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-005",
    "title": "Arboriculteur",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-006",
    "title": "Agronome",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-007",
    "title": "Conseiller agricole",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-008",
    "title": "Éleveur bovin",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-009",
    "title": "Éleveur avicole",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-010",
    "title": "Vétérinaire",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-011",
    "title": "Auxiliaire vétérinaire",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-012",
    "title": "Pisciculteur",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-013",
    "title": "Pêcheur",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-014",
    "title": "Mareyeur",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-015",
    "title": "Technicien aquacole",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-016",
    "title": "Transformateur agroalimentaire",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-017",
    "title": "Forestier",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-018",
    "title": "Technicien environnement",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-019",
    "title": "Gestionnaire de coopérative",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-020",
    "title": "Conducteur d’engins agricoles",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-021",
    "title": "Irrigateur",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-022",
    "title": "Semencier",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-023",
    "title": "Apiculteur",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-024",
    "title": "Collecteur agricole",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-001",
    "title": "Grossiste",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-002",
    "title": "Vendeur",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-003",
    "title": "Caissier",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-004",
    "title": "Chef de rayon",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-005",
    "title": "Responsable magasin",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-006",
    "title": "Commercial terrain",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-007",
    "title": "Représentant",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-008",
    "title": "Télévendeur",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-009",
    "title": "Acheteur",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-010",
    "title": "Approvisionneur",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-011",
    "title": "Gestionnaire de stock",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-012",
    "title": "Préparateur de commandes",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-013",
    "title": "Responsable e-commerce",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-014",
    "title": "Gestionnaire marketplace",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-015",
    "title": "Importateur",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-016",
    "title": "Exportateur",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-017",
    "title": "Livreur",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-018",
    "title": "Responsable relation client",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-019",
    "title": "Responsable réseau de boutiques",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-020",
    "title": "Merchandiser",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-021",
    "title": "Gestionnaire de catalogue",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-022",
    "title": "Responsable retours",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-023",
    "title": "Agent de vente à crédit",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-024",
    "title": "Superviseur commercial",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-001",
    "title": "Comptable",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-002",
    "title": "Aide-comptable",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-003",
    "title": "Chef comptable",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-004",
    "title": "Directeur financier",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-005",
    "title": "Trésorier",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-006",
    "title": "Auditeur interne",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-007",
    "title": "Auditeur externe",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-008",
    "title": "Analyste financier",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-009",
    "title": "Conseiller bancaire",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-010",
    "title": "Chargé de clientèle",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-011",
    "title": "Agent de crédit",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-012",
    "title": "Gestionnaire de portefeuille",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-013",
    "title": "Courtier",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-014",
    "title": "Agent d’assurance",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-015",
    "title": "Gestionnaire de sinistres",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-016",
    "title": "Conseiller patrimonial",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-017",
    "title": "Gestionnaire de paie",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-018",
    "title": "Fiscaliste",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-019",
    "title": "Contrôleur budgétaire",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-020",
    "title": "Analyste crédit",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-021",
    "title": "Gestionnaire de recouvrement",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-022",
    "title": "Responsable conformité financière",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-023",
    "title": "Assistant trésorerie",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-024",
    "title": "Comptable fournisseurs",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-001",
    "title": "Entrepreneur",
    "familyId": "family-06",
    "sourceGroup": "Gestion",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-002",
    "title": "Directeur général",
    "familyId": "family-06",
    "sourceGroup": "Gestion",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-003",
    "title": "Directeur des opérations",
    "familyId": "family-06",
    "sourceGroup": "Gestion",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-004",
    "title": "Chef de programme",
    "familyId": "family-06",
    "sourceGroup": "Gestion",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-005",
    "title": "Consultant en organisation",
    "familyId": "family-06",
    "sourceGroup": "Gestion",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-006",
    "title": "Analyste organisationnel",
    "familyId": "family-06",
    "sourceGroup": "Gestion",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-007",
    "title": "Responsable qualité",
    "familyId": "family-06",
    "sourceGroup": "Gestion",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-008",
    "title": "Auditeur qualité",
    "familyId": "family-06",
    "sourceGroup": "Gestion",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-009",
    "title": "Responsable stratégie",
    "familyId": "family-06",
    "sourceGroup": "Gestion",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-010",
    "title": "Assistant de direction",
    "familyId": "family-06",
    "sourceGroup": "Gestion",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-011",
    "title": "Office manager",
    "familyId": "family-06",
    "sourceGroup": "Gestion",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-012",
    "title": "Responsable amélioration continue",
    "familyId": "family-06",
    "sourceGroup": "Gestion",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-013",
    "title": "Chargé de mission",
    "familyId": "family-06",
    "sourceGroup": "Gestion",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-014",
    "title": "Responsable administratif",
    "familyId": "family-06",
    "sourceGroup": "Gestion",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-015",
    "title": "Directeur commercial",
    "familyId": "family-06",
    "sourceGroup": "Gestion",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-016",
    "title": "Responsable achats",
    "familyId": "family-06",
    "sourceGroup": "Gestion",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-017",
    "title": "Responsable de portefeuille projets",
    "familyId": "family-06",
    "sourceGroup": "Gestion",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-018",
    "title": "Analyste processus",
    "familyId": "family-06",
    "sourceGroup": "Gestion",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-019",
    "title": "Gestionnaire de contrats",
    "familyId": "family-06",
    "sourceGroup": "Gestion",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-020",
    "title": "Responsable performance",
    "familyId": "family-06",
    "sourceGroup": "Gestion",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-021",
    "title": "Coordinateur opérationnel",
    "familyId": "family-06",
    "sourceGroup": "Gestion",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-022",
    "title": "Consultant indépendant",
    "familyId": "family-06",
    "sourceGroup": "Gestion",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-023",
    "title": "Responsable gouvernance",
    "familyId": "family-06",
    "sourceGroup": "Gestion",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-024",
    "title": "Secrétaire général",
    "familyId": "family-06",
    "sourceGroup": "Gestion",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-001",
    "title": "Agent immobilier",
    "familyId": "family-07",
    "sourceGroup": "BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-002",
    "title": "Négociateur immobilier",
    "familyId": "family-07",
    "sourceGroup": "BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-003",
    "title": "Gestionnaire locatif",
    "familyId": "family-07",
    "sourceGroup": "BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-004",
    "title": "Syndic",
    "familyId": "family-07",
    "sourceGroup": "BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-005",
    "title": "Promoteur immobilier",
    "familyId": "family-07",
    "sourceGroup": "BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-006",
    "title": "Architecte",
    "familyId": "family-07",
    "sourceGroup": "BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-007",
    "title": "Dessinateur-projeteur",
    "familyId": "family-07",
    "sourceGroup": "BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-008",
    "title": "Urbaniste",
    "familyId": "family-07",
    "sourceGroup": "BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-009",
    "title": "Ingénieur civil",
    "familyId": "family-07",
    "sourceGroup": "BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-010",
    "title": "Chef de chantier",
    "familyId": "family-07",
    "sourceGroup": "BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-011",
    "title": "Maçon",
    "familyId": "family-07",
    "sourceGroup": "BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-012",
    "title": "Électricien bâtiment",
    "familyId": "family-07",
    "sourceGroup": "BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-013",
    "title": "Plombier",
    "familyId": "family-07",
    "sourceGroup": "BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-014",
    "title": "Carreleur",
    "familyId": "family-07",
    "sourceGroup": "BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-015",
    "title": "Peintre bâtiment",
    "familyId": "family-07",
    "sourceGroup": "BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-016",
    "title": "Métreur",
    "familyId": "family-07",
    "sourceGroup": "BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-017",
    "title": "Économiste de la construction",
    "familyId": "family-07",
    "sourceGroup": "BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-018",
    "title": "Technicien de maintenance bâtiment",
    "familyId": "family-07",
    "sourceGroup": "BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-019",
    "title": "Gardien d’immeuble",
    "familyId": "family-07",
    "sourceGroup": "BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-020",
    "title": "Conducteur d’engins",
    "familyId": "family-07",
    "sourceGroup": "BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-021",
    "title": "Couvreur",
    "familyId": "family-07",
    "sourceGroup": "BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-022",
    "title": "Charpentier",
    "familyId": "family-07",
    "sourceGroup": "BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-023",
    "title": "Géomètre-topographe",
    "familyId": "family-07",
    "sourceGroup": "BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-024",
    "title": "Responsable HSE chantier",
    "familyId": "family-07",
    "sourceGroup": "BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-001",
    "title": "Enseignant primaire",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-002",
    "title": "Professeur secondaire",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-003",
    "title": "Directeur d’école",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-004",
    "title": "Proviseur",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-005",
    "title": "Surveillant général",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-006",
    "title": "Conseiller pédagogique",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-007",
    "title": "Formateur professionnel",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-008",
    "title": "Maître d’apprentissage",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-009",
    "title": "Tuteur",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-010",
    "title": "Responsable pédagogique",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-011",
    "title": "Gestionnaire de scolarité",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-012",
    "title": "Chercheur",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-013",
    "title": "Documentaliste",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-014",
    "title": "Conseiller d’orientation",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-015",
    "title": "Psychologue de l’orientation",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-016",
    "title": "Responsable e-learning",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-017",
    "title": "Évaluateur",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-018",
    "title": "Éducateur spécialisé",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-019",
    "title": "Inspecteur pédagogique",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-020",
    "title": "Gestionnaire d’examens",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-021",
    "title": "Responsable bibliothèque",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-022",
    "title": "Concepteur pédagogique",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-023",
    "title": "Assistant scolaire",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-024",
    "title": "Coordinateur de stages",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-001",
    "title": "Chauffeur taxi",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-002",
    "title": "Conducteur de bus",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-003",
    "title": "Conducteur routier",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-004",
    "title": "Livreur",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-005",
    "title": "Coursier",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-006",
    "title": "Exploitant transport",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-007",
    "title": "Dispatcheur",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-008",
    "title": "Logisticien",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-009",
    "title": "Magasinier",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-010",
    "title": "Préparateur logistique",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-011",
    "title": "Cariste",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-012",
    "title": "Responsable d’entrepôt",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-013",
    "title": "Mécanicien automobile",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-014",
    "title": "Électricien automobile",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-015",
    "title": "Carrossier",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-016",
    "title": "Contrôleur technique",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-017",
    "title": "Gestionnaire de flotte",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-018",
    "title": "Agent de location",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-019",
    "title": "Agent d’exploitation",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-020",
    "title": "Responsable de quai",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-021",
    "title": "Gestionnaire de parc",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-022",
    "title": "Agent de transit",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-023",
    "title": "Déclarant en douane",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-024",
    "title": "Planificateur transport",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-001",
    "title": "Chef cuisinier",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-002",
    "title": "Cuisinier",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-003",
    "title": "Commis de cuisine",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-004",
    "title": "Pâtissier",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-005",
    "title": "Boulanger",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-006",
    "title": "Serveur",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-007",
    "title": "Maître d’hôtel",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-008",
    "title": "Barman",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-009",
    "title": "Traiteur",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-010",
    "title": "Gestionnaire de restaurant",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-011",
    "title": "Réceptionniste hôtelier",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-012",
    "title": "Gouvernant",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-013",
    "title": "Femme de chambre",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-014",
    "title": "Directeur d’hôtel",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-015",
    "title": "Responsable réservation",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-016",
    "title": "Concierge",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-017",
    "title": "Agent d’entretien hôtelier",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-018",
    "title": "Chef de rang",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-019",
    "title": "Plongeur",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-020",
    "title": "Responsable petit-déjeuner",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-021",
    "title": "Gestionnaire de livraison repas",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-022",
    "title": "Responsable hygiène alimentaire",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-023",
    "title": "Économe de restaurant",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-024",
    "title": "Responsable de salle",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-001",
    "title": "Chef de projet événementiel",
    "familyId": "family-11",
    "sourceGroup": "Événementiel",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-002",
    "title": "Wedding planner",
    "familyId": "family-11",
    "sourceGroup": "Événementiel",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-003",
    "title": "Décorateur événementiel",
    "familyId": "family-11",
    "sourceGroup": "Événementiel",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-004",
    "title": "Régisseur",
    "familyId": "family-11",
    "sourceGroup": "Événementiel",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-005",
    "title": "Technicien son",
    "familyId": "family-11",
    "sourceGroup": "Événementiel",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-006",
    "title": "Technicien lumière",
    "familyId": "family-11",
    "sourceGroup": "Événementiel",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-007",
    "title": "Agent de billetterie",
    "familyId": "family-11",
    "sourceGroup": "Événementiel",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-008",
    "title": "Programmateur culturel",
    "familyId": "family-11",
    "sourceGroup": "Événementiel",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-009",
    "title": "Guide touristique",
    "familyId": "family-11",
    "sourceGroup": "Événementiel",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-010",
    "title": "Agent de voyage",
    "familyId": "family-11",
    "sourceGroup": "Événementiel",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-011",
    "title": "Conseiller voyages",
    "familyId": "family-11",
    "sourceGroup": "Événementiel",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-012",
    "title": "Accompagnateur touristique",
    "familyId": "family-11",
    "sourceGroup": "Événementiel",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-013",
    "title": "Médiateur culturel",
    "familyId": "family-11",
    "sourceGroup": "Événementiel",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-014",
    "title": "Conservateur",
    "familyId": "family-11",
    "sourceGroup": "Événementiel",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-015",
    "title": "Animateur culturel",
    "familyId": "family-11",
    "sourceGroup": "Événementiel",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-016",
    "title": "Photographe événementiel",
    "familyId": "family-11",
    "sourceGroup": "Événementiel",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-017",
    "title": "Vidéaste événementiel",
    "familyId": "family-11",
    "sourceGroup": "Événementiel",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-018",
    "title": "Responsable protocole",
    "familyId": "family-11",
    "sourceGroup": "Événementiel",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-019",
    "title": "Coordinateur prestataires",
    "familyId": "family-11",
    "sourceGroup": "Événementiel",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-020",
    "title": "Responsable accueil",
    "familyId": "family-11",
    "sourceGroup": "Événementiel",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-021",
    "title": "Agent d’escale",
    "familyId": "family-11",
    "sourceGroup": "Événementiel",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-022",
    "title": "Gestionnaire de réservation",
    "familyId": "family-11",
    "sourceGroup": "Événementiel",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-023",
    "title": "Producteur de spectacle",
    "familyId": "family-11",
    "sourceGroup": "Événementiel",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-024",
    "title": "Chargé de communication événementielle",
    "familyId": "family-11",
    "sourceGroup": "Événementiel",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-025",
    "title": "Responsable logistique événementielle",
    "familyId": "family-11",
    "sourceGroup": "Événementiel",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-001",
    "title": "Directeur RH",
    "familyId": "family-12",
    "sourceGroup": "RH",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-002",
    "title": "Responsable RH",
    "familyId": "family-12",
    "sourceGroup": "RH",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-003",
    "title": "Chargé de recrutement",
    "familyId": "family-12",
    "sourceGroup": "RH",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-004",
    "title": "Recruteur",
    "familyId": "family-12",
    "sourceGroup": "RH",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-005",
    "title": "Assistant RH",
    "familyId": "family-12",
    "sourceGroup": "RH",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-006",
    "title": "Gestionnaire de paie",
    "familyId": "family-12",
    "sourceGroup": "RH",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-007",
    "title": "Gestionnaire du personnel",
    "familyId": "family-12",
    "sourceGroup": "RH",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-008",
    "title": "Responsable formation",
    "familyId": "family-12",
    "sourceGroup": "RH",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-009",
    "title": "Responsable compétences",
    "familyId": "family-12",
    "sourceGroup": "RH",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-010",
    "title": "Responsable relations sociales",
    "familyId": "family-12",
    "sourceGroup": "RH",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-011",
    "title": "Planificateur du personnel",
    "familyId": "family-12",
    "sourceGroup": "RH",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-012",
    "title": "Responsable administration du travail",
    "familyId": "family-12",
    "sourceGroup": "RH",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-013",
    "title": "Consultant RH",
    "familyId": "family-12",
    "sourceGroup": "RH",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-014",
    "title": "Responsable rémunération",
    "familyId": "family-12",
    "sourceGroup": "RH",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-015",
    "title": "Gestionnaire des carrières",
    "familyId": "family-12",
    "sourceGroup": "RH",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-016",
    "title": "Responsable mobilité",
    "familyId": "family-12",
    "sourceGroup": "RH",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-017",
    "title": "Chargé des avantages sociaux",
    "familyId": "family-12",
    "sourceGroup": "RH",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-018",
    "title": "Responsable temps et activités",
    "familyId": "family-12",
    "sourceGroup": "RH",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-019",
    "title": "Gestionnaire des absences",
    "familyId": "family-12",
    "sourceGroup": "RH",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-020",
    "title": "Responsable SIRH",
    "familyId": "family-12",
    "sourceGroup": "RH",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-021",
    "title": "Chargé de développement RH",
    "familyId": "family-12",
    "sourceGroup": "RH",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-022",
    "title": "Responsable intégration",
    "familyId": "family-12",
    "sourceGroup": "RH",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-023",
    "title": "Responsable disciplinaire",
    "familyId": "family-12",
    "sourceGroup": "RH",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-024",
    "title": "Responsable santé au travail",
    "familyId": "family-12",
    "sourceGroup": "RH",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-001",
    "title": "Artisan d’art",
    "familyId": "family-13",
    "sourceGroup": "Artisanat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-002",
    "title": "Menuisier",
    "familyId": "family-13",
    "sourceGroup": "Artisanat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-003",
    "title": "Ébéniste",
    "familyId": "family-13",
    "sourceGroup": "Artisanat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-004",
    "title": "Soudeur",
    "familyId": "family-13",
    "sourceGroup": "Artisanat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-005",
    "title": "Métallier",
    "familyId": "family-13",
    "sourceGroup": "Artisanat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-006",
    "title": "Ferronnier",
    "familyId": "family-13",
    "sourceGroup": "Artisanat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-007",
    "title": "Couturier",
    "familyId": "family-13",
    "sourceGroup": "Artisanat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-008",
    "title": "Tailleur",
    "familyId": "family-13",
    "sourceGroup": "Artisanat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-009",
    "title": "Modéliste",
    "familyId": "family-13",
    "sourceGroup": "Artisanat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-010",
    "title": "Styliste",
    "familyId": "family-13",
    "sourceGroup": "Artisanat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-011",
    "title": "Maroquinier",
    "familyId": "family-13",
    "sourceGroup": "Artisanat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-012",
    "title": "Bijoutier",
    "familyId": "family-13",
    "sourceGroup": "Artisanat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-013",
    "title": "Imprimeur",
    "familyId": "family-13",
    "sourceGroup": "Artisanat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-014",
    "title": "Opérateur de production",
    "familyId": "family-13",
    "sourceGroup": "Artisanat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-015",
    "title": "Chef d’atelier",
    "familyId": "family-13",
    "sourceGroup": "Artisanat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-016",
    "title": "Technicien maintenance",
    "familyId": "family-13",
    "sourceGroup": "Artisanat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-017",
    "title": "Électromécanicien",
    "familyId": "family-13",
    "sourceGroup": "Artisanat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-018",
    "title": "Mécanicien industriel",
    "familyId": "family-13",
    "sourceGroup": "Artisanat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-019",
    "title": "Contrôleur qualité",
    "familyId": "family-13",
    "sourceGroup": "Artisanat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-020",
    "title": "Réparateur électronique",
    "familyId": "family-13",
    "sourceGroup": "Artisanat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-021",
    "title": "Tapissier",
    "familyId": "family-13",
    "sourceGroup": "Artisanat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-022",
    "title": "Sérigraphe",
    "familyId": "family-13",
    "sourceGroup": "Artisanat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-023",
    "title": "Potier",
    "familyId": "family-13",
    "sourceGroup": "Artisanat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-024",
    "title": "Sculpteur",
    "familyId": "family-13",
    "sourceGroup": "Artisanat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-025",
    "title": "Technicien fabrication",
    "familyId": "family-13",
    "sourceGroup": "Artisanat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-001",
    "title": "Aide à domicile",
    "familyId": "family-14",
    "sourceGroup": "Services",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-002",
    "title": "Auxiliaire de vie",
    "familyId": "family-14",
    "sourceGroup": "Services",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-003",
    "title": "Assistant de vie",
    "familyId": "family-14",
    "sourceGroup": "Services",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-004",
    "title": "Agent d’entretien",
    "familyId": "family-14",
    "sourceGroup": "Services",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-005",
    "title": "Chef d’équipe nettoyage",
    "familyId": "family-14",
    "sourceGroup": "Services",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-006",
    "title": "Coiffeur",
    "familyId": "family-14",
    "sourceGroup": "Services",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-007",
    "title": "Barbier",
    "familyId": "family-14",
    "sourceGroup": "Services",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-008",
    "title": "Esthéticien",
    "familyId": "family-14",
    "sourceGroup": "Services",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-009",
    "title": "Maquilleur",
    "familyId": "family-14",
    "sourceGroup": "Services",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-010",
    "title": "Prothésiste ongulaire",
    "familyId": "family-14",
    "sourceGroup": "Services",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-011",
    "title": "Masseur bien-être",
    "familyId": "family-14",
    "sourceGroup": "Services",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-012",
    "title": "Concierge",
    "familyId": "family-14",
    "sourceGroup": "Services",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-013",
    "title": "Garde d’enfants",
    "familyId": "family-14",
    "sourceGroup": "Services",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-014",
    "title": "Auxiliaire parental",
    "familyId": "family-14",
    "sourceGroup": "Services",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-015",
    "title": "Intervenant familial",
    "familyId": "family-14",
    "sourceGroup": "Services",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-016",
    "title": "Agent de blanchisserie",
    "familyId": "family-14",
    "sourceGroup": "Services",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-017",
    "title": "Laveur automobile",
    "familyId": "family-14",
    "sourceGroup": "Services",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-018",
    "title": "Jardinier paysagiste",
    "familyId": "family-14",
    "sourceGroup": "Services",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-019",
    "title": "Dépanneur à domicile",
    "familyId": "family-14",
    "sourceGroup": "Services",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-020",
    "title": "Pet-sitter",
    "familyId": "family-14",
    "sourceGroup": "Services",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-021",
    "title": "Assistant personnel",
    "familyId": "family-14",
    "sourceGroup": "Services",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-022",
    "title": "Responsable conciergerie",
    "familyId": "family-14",
    "sourceGroup": "Services",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-023",
    "title": "Agent de nettoyage industriel",
    "familyId": "family-14",
    "sourceGroup": "Services",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-024",
    "title": "Technicien nuisibles",
    "familyId": "family-14",
    "sourceGroup": "Services",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-001",
    "title": "Agent administratif",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-002",
    "title": "Secrétaire administratif",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-003",
    "title": "Attaché territorial",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-004",
    "title": "Responsable service public",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-005",
    "title": "Agent d’état civil",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-006",
    "title": "Archiviste",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-007",
    "title": "Documentaliste public",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-008",
    "title": "Agent municipal",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-009",
    "title": "Chargé de citoyenneté",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-010",
    "title": "Gestionnaire de dossiers",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-011",
    "title": "Médiateur public",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-012",
    "title": "Responsable marchés publics",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-013",
    "title": "Agent de guichet",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-014",
    "title": "Gestionnaire d’archives",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-015",
    "title": "Responsable accueil citoyen",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-016",
    "title": "Agent de recouvrement public",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-017",
    "title": "Contrôleur administratif",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-018",
    "title": "Régisseur public",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-019",
    "title": "Chargé de protocole",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-020",
    "title": "Responsable de service communal",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-021",
    "title": "Assistant de collectivité",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-022",
    "title": "Gestionnaire de courrier",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-023",
    "title": "Agent de délivrance de titres",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-024",
    "title": "Chargé de statistiques publiques",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-025",
    "title": "Responsable qualité service public",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-001",
    "title": "Avocat",
    "familyId": "family-16",
    "sourceGroup": "Juridique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-002",
    "title": "Juriste d’entreprise",
    "familyId": "family-16",
    "sourceGroup": "Juridique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-003",
    "title": "Assistant juridique",
    "familyId": "family-16",
    "sourceGroup": "Juridique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-004",
    "title": "Notaire",
    "familyId": "family-16",
    "sourceGroup": "Juridique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-005",
    "title": "Clerc de notaire",
    "familyId": "family-16",
    "sourceGroup": "Juridique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-006",
    "title": "Commissaire de justice",
    "familyId": "family-16",
    "sourceGroup": "Juridique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-007",
    "title": "Médiateur",
    "familyId": "family-16",
    "sourceGroup": "Juridique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-008",
    "title": "Conciliateur",
    "familyId": "family-16",
    "sourceGroup": "Juridique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-009",
    "title": "Responsable conformité",
    "familyId": "family-16",
    "sourceGroup": "Juridique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-010",
    "title": "Délégué à la protection des données",
    "familyId": "family-16",
    "sourceGroup": "Juridique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-011",
    "title": "Enquêteur conformité",
    "familyId": "family-16",
    "sourceGroup": "Juridique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-012",
    "title": "Documentaliste juridique",
    "familyId": "family-16",
    "sourceGroup": "Juridique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-013",
    "title": "Juriste social",
    "familyId": "family-16",
    "sourceGroup": "Juridique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-014",
    "title": "Juriste fiscaliste",
    "familyId": "family-16",
    "sourceGroup": "Juridique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-015",
    "title": "Juriste immobilier",
    "familyId": "family-16",
    "sourceGroup": "Juridique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-016",
    "title": "Juriste bancaire",
    "familyId": "family-16",
    "sourceGroup": "Juridique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-017",
    "title": "Secrétaire juridique",
    "familyId": "family-16",
    "sourceGroup": "Juridique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-018",
    "title": "Gestionnaire de contentieux",
    "familyId": "family-16",
    "sourceGroup": "Juridique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-019",
    "title": "Responsable contrats",
    "familyId": "family-16",
    "sourceGroup": "Juridique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-020",
    "title": "Greffier",
    "familyId": "family-16",
    "sourceGroup": "Juridique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-021",
    "title": "Conseiller juridique",
    "familyId": "family-16",
    "sourceGroup": "Juridique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-022",
    "title": "Mandataire judiciaire",
    "familyId": "family-16",
    "sourceGroup": "Juridique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-023",
    "title": "Juriste marchés publics",
    "familyId": "family-16",
    "sourceGroup": "Juridique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-024",
    "title": "Responsable éthique",
    "familyId": "family-16",
    "sourceGroup": "Juridique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-001",
    "title": "Développeur web",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-002",
    "title": "Développeur mobile",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-003",
    "title": "Architecte logiciel",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-004",
    "title": "Ingénieur DevOps",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-005",
    "title": "Administrateur système",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-006",
    "title": "Administrateur réseau",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-007",
    "title": "Technicien support",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-008",
    "title": "Technicien informatique",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-009",
    "title": "Analyste de données",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-010",
    "title": "Ingénieur données",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-011",
    "title": "Spécialiste IA",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-012",
    "title": "Testeur logiciel",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-013",
    "title": "UX designer",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-014",
    "title": "UI designer",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-015",
    "title": "Graphiste",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-016",
    "title": "Community manager",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-017",
    "title": "Rédacteur web",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-018",
    "title": "Spécialiste SEO",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-019",
    "title": "Chef de projet digital",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-020",
    "title": "Analyste cybersécurité",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-021",
    "title": "Ingénieur cloud",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-022",
    "title": "Product manager",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-023",
    "title": "Technicien télécom",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-024",
    "title": "Consultant ERP",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-001",
    "title": "Ingénieur énergie",
    "familyId": "family-18",
    "sourceGroup": "Énergie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-002",
    "title": "Technicien électricien",
    "familyId": "family-18",
    "sourceGroup": "Énergie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-003",
    "title": "Installateur solaire",
    "familyId": "family-18",
    "sourceGroup": "Énergie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-004",
    "title": "Technicien photovoltaïque",
    "familyId": "family-18",
    "sourceGroup": "Énergie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-005",
    "title": "Agent réseau électrique",
    "familyId": "family-18",
    "sourceGroup": "Énergie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-006",
    "title": "Fontainier",
    "familyId": "family-18",
    "sourceGroup": "Énergie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-007",
    "title": "Technicien hydraulique",
    "familyId": "family-18",
    "sourceGroup": "Énergie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-008",
    "title": "Agent de relève",
    "familyId": "family-18",
    "sourceGroup": "Énergie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-009",
    "title": "Technicien assainissement",
    "familyId": "family-18",
    "sourceGroup": "Énergie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-010",
    "title": "Agent de collecte",
    "familyId": "family-18",
    "sourceGroup": "Énergie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-011",
    "title": "Responsable maintenance",
    "familyId": "family-18",
    "sourceGroup": "Énergie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-012",
    "title": "Opérateur supervision",
    "familyId": "family-18",
    "sourceGroup": "Énergie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-013",
    "title": "Technicien électromécanique",
    "familyId": "family-18",
    "sourceGroup": "Énergie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-014",
    "title": "Ingénieur efficacité énergétique",
    "familyId": "family-18",
    "sourceGroup": "Énergie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-015",
    "title": "Technicien froid",
    "familyId": "family-18",
    "sourceGroup": "Énergie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-016",
    "title": "Installateur thermique",
    "familyId": "family-18",
    "sourceGroup": "Énergie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-017",
    "title": "Responsable réseau eau",
    "familyId": "family-18",
    "sourceGroup": "Énergie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-018",
    "title": "Agent d’exploitation énergétique",
    "familyId": "family-18",
    "sourceGroup": "Énergie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-019",
    "title": "Technicien traitement eau",
    "familyId": "family-18",
    "sourceGroup": "Énergie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-020",
    "title": "Responsable déchets",
    "familyId": "family-18",
    "sourceGroup": "Énergie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-021",
    "title": "Technicien gaz",
    "familyId": "family-18",
    "sourceGroup": "Énergie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-022",
    "title": "Chef d’équipe réseau",
    "familyId": "family-18",
    "sourceGroup": "Énergie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-023",
    "title": "Contrôleur installations",
    "familyId": "family-18",
    "sourceGroup": "Énergie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-024",
    "title": "Technicien biomasse",
    "familyId": "family-18",
    "sourceGroup": "Énergie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-001",
    "title": "Agent de sécurité",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-002",
    "title": "Chef de poste",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-003",
    "title": "Responsable sûreté",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-004",
    "title": "Agent de prévention",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-005",
    "title": "Technicien incendie",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-006",
    "title": "Responsable HSE",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-007",
    "title": "Préventeur",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-008",
    "title": "Coordinateur sécurité",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-009",
    "title": "Gestionnaire de crise",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-010",
    "title": "Contrôleur d’accès",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-011",
    "title": "Auditeur sécurité",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-012",
    "title": "Responsable continuité activité",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-013",
    "title": "Agent de ronde",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-014",
    "title": "Opérateur télésurveillance",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-015",
    "title": "Responsable sécurité événementielle",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-016",
    "title": "Formateur sécurité",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-017",
    "title": "Responsable protection site",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-018",
    "title": "Coordinateur risques",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-019",
    "title": "Inspecteur sécurité",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-020",
    "title": "Responsable sécurité informatique",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-021",
    "title": "Analyste risques",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-022",
    "title": "Technicien contrôle d’accès",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-023",
    "title": "Responsable sûreté aéroportuaire",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-024",
    "title": "Agent de sécurité incendie",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-001",
    "title": "Président d’association",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-002",
    "title": "Secrétaire d’association",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-003",
    "title": "Trésorier associatif",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-004",
    "title": "Coordinateur projet social",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-005",
    "title": "Travailleur social",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-006",
    "title": "Éducateur spécialisé",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-007",
    "title": "Animateur communautaire",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-008",
    "title": "Chargé de mobilisation",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-009",
    "title": "Gestionnaire bénévoles",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-010",
    "title": "Médiateur social",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-011",
    "title": "Accompagnateur social",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-012",
    "title": "Organisateur communautaire",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-013",
    "title": "Responsable ONG",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-014",
    "title": "Gestionnaire de dons",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-015",
    "title": "Coordinateur bénévolat",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-016",
    "title": "Responsable de programme social",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-017",
    "title": "Assistant social",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-018",
    "title": "Conseiller familial",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-019",
    "title": "Gestionnaire de foyer",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-020",
    "title": "Responsable de centre communautaire",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-021",
    "title": "Chargé de partenariat",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-022",
    "title": "Animateur jeunesse",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-023",
    "title": "Coordinateur de solidarité",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-024",
    "title": "Gestionnaire de membres",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-025",
    "title": "Responsable de collecte de fonds",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-025",
    "title": "Médecin urgentiste",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-026",
    "title": "Gynécologue-obstétricien",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-027",
    "title": "Ophtalmologue",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-028",
    "title": "Dentiste",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-029",
    "title": "Chirurgien-dentiste",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-030",
    "title": "Diététicien",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-031",
    "title": "Psychologue clinicien",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-032",
    "title": "Ergothérapeute",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-033",
    "title": "Ambulancier",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-034",
    "title": "Responsable qualité hospitalière",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-025",
    "title": "Préparateur mental sportif",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-026",
    "title": "Moniteur d’athlétisme",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-027",
    "title": "Entraîneur de volleyball",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-028",
    "title": "Entraîneur de handball",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-029",
    "title": "Moniteur de gymnastique",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-030",
    "title": "Moniteur de sports nautiques",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-031",
    "title": "Arbitre de football",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-032",
    "title": "Gestionnaire de compétition",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-033",
    "title": "Responsable de centre de loisirs sportifs",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-034",
    "title": "Réparateur d’équipements sportifs",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-025",
    "title": "Technicien de semences",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-026",
    "title": "Chef d’exploitation agricole",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-027",
    "title": "Conseiller phytosanitaire",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-028",
    "title": "Inséminateur animal",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-029",
    "title": "Berger",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-030",
    "title": "Aviculteur",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-031",
    "title": "Pisciculteur en étang",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-032",
    "title": "Technicien de pêche",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-033",
    "title": "Transformateur de produits agricoles",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-034",
    "title": "Agent de contrôle phytosanitaire",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-025",
    "title": "Responsable de franchise",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-026",
    "title": "Gestionnaire de point de vente",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-027",
    "title": "Responsable des ventes",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-028",
    "title": "Chef des ventes",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-029",
    "title": "Conseiller clientèle",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-030",
    "title": "Agent de prospection",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-031",
    "title": "Responsable fidélisation",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-032",
    "title": "Gestionnaire de commandes",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-033",
    "title": "Contrôleur de marchandises",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-034",
    "title": "Responsable de caisse",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-025",
    "title": "Contrôleur de gestion",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-026",
    "title": "Comptable général",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-027",
    "title": "Comptable analytique",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-028",
    "title": "Comptable trésorerie",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-029",
    "title": "Comptable immobilisations",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-030",
    "title": "Gestionnaire de facturation",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-031",
    "title": "Chargé de recouvrement",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-032",
    "title": "Gestionnaire de risques financiers",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-033",
    "title": "Analyste de trésorerie",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-034",
    "title": "Responsable contrôle interne",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-025",
    "title": "Fondateur de startup",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-026",
    "title": "Directeur de PME",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-027",
    "title": "Directeur administratif et financier",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-028",
    "title": "Responsable développement",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-029",
    "title": "Responsable partenariats",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-030",
    "title": "Business analyst",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-031",
    "title": "Gestionnaire de transformation",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-032",
    "title": "Responsable planification stratégique",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-033",
    "title": "Chef de cabinet",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-034",
    "title": "Secrétaire exécutif",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-025",
    "title": "Ingénieur structure",
    "familyId": "family-07",
    "sourceGroup": "Immobilier et BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-026",
    "title": "Ingénieur géotechnicien",
    "familyId": "family-07",
    "sourceGroup": "Immobilier et BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-027",
    "title": "Technicien bâtiment",
    "familyId": "family-07",
    "sourceGroup": "Immobilier et BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-028",
    "title": "Conducteur de travaux publics",
    "familyId": "family-07",
    "sourceGroup": "Immobilier et BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-029",
    "title": "Chef d’équipe maçonnerie",
    "familyId": "family-07",
    "sourceGroup": "Immobilier et BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-030",
    "title": "Installateur sanitaire",
    "familyId": "family-07",
    "sourceGroup": "Immobilier et BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-031",
    "title": "Étancheur",
    "familyId": "family-07",
    "sourceGroup": "Immobilier et BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-032",
    "title": "Vitrier",
    "familyId": "family-07",
    "sourceGroup": "Immobilier et BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-033",
    "title": "Technicien climatisation bâtiment",
    "familyId": "family-07",
    "sourceGroup": "Immobilier et BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-034",
    "title": "Responsable maintenance immobilière",
    "familyId": "family-07",
    "sourceGroup": "Immobilier et BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-025",
    "title": "Instituteur spécialisé",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-026",
    "title": "Professeur de langues",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-027",
    "title": "Professeur de mathématiques",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-028",
    "title": "Professeur de sciences",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-029",
    "title": "Formateur en informatique",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-030",
    "title": "Formateur en langues",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-031",
    "title": "Concepteur de cours en ligne",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-032",
    "title": "Responsable des admissions",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-033",
    "title": "Conseiller d’études",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-034",
    "title": "Coordinateur pédagogique",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-025",
    "title": "Conducteur de moto-taxi",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-026",
    "title": "Conducteur de véhicule de tourisme",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-027",
    "title": "Chauffeur de poids lourd",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-028",
    "title": "Conducteur d’engins de manutention",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-029",
    "title": "Agent de planification des transports",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-030",
    "title": "Gestionnaire de chaîne logistique",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-031",
    "title": "Responsable approvisionnement transport",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-032",
    "title": "Agent maritime",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-033",
    "title": "Agent portuaire",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-034",
    "title": "Technicien de maintenance automobile",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-025",
    "title": "Responsable de pâtisserie",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-026",
    "title": "Glacier",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-027",
    "title": "Boucher",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-028",
    "title": "Charcutier",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-029",
    "title": "Poissonnier",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-030",
    "title": "Sommelier",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-031",
    "title": "Barista",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-032",
    "title": "Responsable de cuisine collective",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-033",
    "title": "Gestionnaire de chambres d’hôtes",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-034",
    "title": "Responsable de réservation hôtelière",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-026",
    "title": "Directeur de festival",
    "familyId": "family-11",
    "sourceGroup": "Événementiel et tourisme",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-027",
    "title": "Agent artistique",
    "familyId": "family-11",
    "sourceGroup": "Événementiel et tourisme",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-028",
    "title": "Manager d’artiste",
    "familyId": "family-11",
    "sourceGroup": "Événementiel et tourisme",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-029",
    "title": "Régisseur général",
    "familyId": "family-11",
    "sourceGroup": "Événementiel et tourisme",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-030",
    "title": "Scénographe",
    "familyId": "family-11",
    "sourceGroup": "Événementiel et tourisme",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-031",
    "title": "Technicien audiovisuel",
    "familyId": "family-11",
    "sourceGroup": "Événementiel et tourisme",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-032",
    "title": "Monteur vidéo événementiel",
    "familyId": "family-11",
    "sourceGroup": "Événementiel et tourisme",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-033",
    "title": "Guide de musée",
    "familyId": "family-11",
    "sourceGroup": "Événementiel et tourisme",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-034",
    "title": "Médiateur du patrimoine",
    "familyId": "family-11",
    "sourceGroup": "Événementiel et tourisme",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-035",
    "title": "Agent de tourisme local",
    "familyId": "family-11",
    "sourceGroup": "Événementiel et tourisme",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-025",
    "title": "Responsable relations employés",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-026",
    "title": "Gestionnaire de formation RH",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-027",
    "title": "Analyste rémunération",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-028",
    "title": "Responsable recrutement international",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-029",
    "title": "Gestionnaire des talents",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-030",
    "title": "Responsable marque employeur",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-031",
    "title": "Responsable diversité et inclusion",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-032",
    "title": "Gestionnaire de dossiers disciplinaires",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-033",
    "title": "Consultant en organisation du travail",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-034",
    "title": "Responsable dialogue social",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-026",
    "title": "Forgeron",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-027",
    "title": "Fondeur",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-028",
    "title": "Tourneur-fraiseur",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-029",
    "title": "Usineur",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-030",
    "title": "Technicien de production",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-031",
    "title": "Opérateur de machine industrielle",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-032",
    "title": "Technicien de contrôle non destructif",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-033",
    "title": "Réparateur électroménager",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-034",
    "title": "Technicien textile",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-035",
    "title": "Fabricant de meubles",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-025",
    "title": "Auxiliaire de puériculture",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-026",
    "title": "Assistant maternel",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-027",
    "title": "Éducateur de jeunes enfants",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-028",
    "title": "Aide ménager",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-029",
    "title": "Agent de repassage",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-030",
    "title": "Cordonnier réparateur",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-031",
    "title": "Retoucheur de vêtements",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-032",
    "title": "Toiletteur animalier",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-033",
    "title": "Technicien de réparation domestique",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-034",
    "title": "Assistant aux personnes âgées",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-026",
    "title": "Agent d’accueil municipal",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-027",
    "title": "Officier d’état civil",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-028",
    "title": "Gestionnaire de population",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-029",
    "title": "Agent de délivrance de permis",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-030",
    "title": "Gestionnaire de subventions publiques",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-031",
    "title": "Chargé de participation citoyenne",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-032",
    "title": "Responsable des archives publiques",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-033",
    "title": "Agent de contrôle communal",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-034",
    "title": "Gestionnaire de patrimoine public",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-035",
    "title": "Responsable de service administratif",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-025",
    "title": "Avocat pénaliste",
    "familyId": "family-16",
    "sourceGroup": "Droit",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-026",
    "title": "Avocat en droit des affaires",
    "familyId": "family-16",
    "sourceGroup": "Droit",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-027",
    "title": "Avocat en droit du travail",
    "familyId": "family-16",
    "sourceGroup": "Droit",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-028",
    "title": "Avocat fiscaliste",
    "familyId": "family-16",
    "sourceGroup": "Droit",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-029",
    "title": "Juriste en droit des sociétés",
    "familyId": "family-16",
    "sourceGroup": "Droit",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-030",
    "title": "Juriste en droit public",
    "familyId": "family-16",
    "sourceGroup": "Droit",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-031",
    "title": "Juriste en propriété intellectuelle",
    "familyId": "family-16",
    "sourceGroup": "Droit",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-032",
    "title": "Juriste en droit numérique",
    "familyId": "family-16",
    "sourceGroup": "Droit",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-033",
    "title": "Gestionnaire de contrats publics",
    "familyId": "family-16",
    "sourceGroup": "Droit",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-034",
    "title": "Chargé de veille réglementaire",
    "familyId": "family-16",
    "sourceGroup": "Droit",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-025",
    "title": "Développeur backend",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-026",
    "title": "Développeur frontend",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-027",
    "title": "Développeur full-stack",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-028",
    "title": "Développeur embarqué",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-029",
    "title": "Ingénieur cybersécurité",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-030",
    "title": "Pentester autorisé",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-031",
    "title": "Administrateur de bases de données",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-032",
    "title": "Architecte cloud",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-033",
    "title": "Ingénieur machine learning",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-034",
    "title": "Spécialiste automatisation",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-025",
    "title": "Technicien de réseau électrique",
    "familyId": "family-18",
    "sourceGroup": "Énergie et environnement",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-026",
    "title": "Installateur de pompes solaires",
    "familyId": "family-18",
    "sourceGroup": "Énergie et environnement",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-027",
    "title": "Technicien de forage",
    "familyId": "family-18",
    "sourceGroup": "Énergie et environnement",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-028",
    "title": "Agent de distribution d’eau",
    "familyId": "family-18",
    "sourceGroup": "Énergie et environnement",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-029",
    "title": "Opérateur de station d’épuration",
    "familyId": "family-18",
    "sourceGroup": "Énergie et environnement",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-030",
    "title": "Technicien de réseau d’assainissement",
    "familyId": "family-18",
    "sourceGroup": "Énergie et environnement",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-031",
    "title": "Responsable de centrale énergétique",
    "familyId": "family-18",
    "sourceGroup": "Énergie et environnement",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-032",
    "title": "Technicien de maintenance éolienne",
    "familyId": "family-18",
    "sourceGroup": "Énergie et environnement",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-033",
    "title": "Agent de contrôle de qualité de l’eau",
    "familyId": "family-18",
    "sourceGroup": "Énergie et environnement",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-034",
    "title": "Technicien de gestion des déchets",
    "familyId": "family-18",
    "sourceGroup": "Énergie et environnement",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-025",
    "title": "Chef de sécurité incendie",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-026",
    "title": "Agent de protection rapprochée",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-027",
    "title": "Responsable prévention des risques",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-028",
    "title": "Coordinateur de plan d’urgence",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-029",
    "title": "Inspecteur HSE",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-030",
    "title": "Analyste de sûreté",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-031",
    "title": "Responsable sécurité industrielle",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-032",
    "title": "Opérateur de centre de supervision",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-033",
    "title": "Conseiller en continuité d’activité",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-034",
    "title": "Responsable gestion des incidents",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-026",
    "title": "Directeur d’ONG",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-027",
    "title": "Coordinateur de bénévoles",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-028",
    "title": "Chargé de développement communautaire",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-029",
    "title": "Responsable d’action humanitaire",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-030",
    "title": "Animateur de quartier",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-031",
    "title": "Médiateur familial",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-032",
    "title": "Conseiller d’insertion sociale",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-033",
    "title": "Chargé de protection de l’enfance",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-034",
    "title": "Gestionnaire de centre d’accueil",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-035",
    "title": "Coordinateur de programme jeunesse",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-035",
    "title": "Médecin du travail",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-036",
    "title": "Médecin de santé publique",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-037",
    "title": "Neurologue",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-038",
    "title": "Pneumologue",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-039",
    "title": "Néphrologue",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-040",
    "title": "Endocrinologue",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-041",
    "title": "Oncologue",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-042",
    "title": "Gériatre",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-043",
    "title": "Psychiatre",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-044",
    "title": "Technicien en hygiène hospitalière",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-035",
    "title": "Moniteur de boxe",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-036",
    "title": "Moniteur de judo",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-037",
    "title": "Moniteur de karaté",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-038",
    "title": "Moniteur de taekwondo",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-039",
    "title": "Entraîneur de cyclisme",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-040",
    "title": "Entraîneur de course à pied",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-041",
    "title": "Entraîneur de rugby",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-042",
    "title": "Préparateur de gardiens",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-043",
    "title": "Responsable de centre aquatique",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-044",
    "title": "Gestionnaire de stade",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-035",
    "title": "Technicien d’élevage",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-036",
    "title": "Inséminateur bovin",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-037",
    "title": "Responsable de ferme avicole",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-038",
    "title": "Technicien de couvoir",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-039",
    "title": "Conducteur de moissonneuse",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-040",
    "title": "Technicien irrigation agricole",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-041",
    "title": "Conseiller en agroécologie",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-042",
    "title": "Contrôleur de qualité agricole",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-043",
    "title": "Gestionnaire de silo",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-044",
    "title": "Responsable de coopérative agricole",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-035",
    "title": "Responsable grands comptes",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-036",
    "title": "Responsable de secteur commercial",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-037",
    "title": "Chef de produit",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-038",
    "title": "Gestionnaire de promotions",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-039",
    "title": "Responsable de merchandising",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-040",
    "title": "Responsable de service après-vente",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-041",
    "title": "Agent de recouvrement commercial",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-042",
    "title": "Responsable des achats de détail",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-043",
    "title": "Gestionnaire de franchise",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-044",
    "title": "Analyste des ventes",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-035",
    "title": "Expert-comptable",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-036",
    "title": "Commissaire aux comptes",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-037",
    "title": "Contrôleur financier",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-038",
    "title": "Responsable de consolidation",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-039",
    "title": "Gestionnaire de budget",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-040",
    "title": "Analyste de risques bancaires",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-041",
    "title": "Gestionnaire de crédit-bail",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-042",
    "title": "Conseiller en microfinance",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-043",
    "title": "Gestionnaire de portefeuille assurance",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-044",
    "title": "Responsable de reporting financier",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-035",
    "title": "Directeur de business unit",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-036",
    "title": "Responsable de filiale",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-037",
    "title": "Directeur de cabinet conseil",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-038",
    "title": "Consultant en stratégie",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-039",
    "title": "Consultant en gestion du changement",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-040",
    "title": "Responsable de transformation numérique",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-041",
    "title": "Responsable des risques d’entreprise",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-042",
    "title": "Responsable de contrôle de gestion",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-043",
    "title": "Administrateur de société",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-044",
    "title": "Secrétaire de conseil d’administration",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-035",
    "title": "Ingénieur travaux publics",
    "familyId": "family-07",
    "sourceGroup": "Immobilier et BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-036",
    "title": "Ingénieur hydraulique urbaine",
    "familyId": "family-07",
    "sourceGroup": "Immobilier et BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-037",
    "title": "Technicien géomètre",
    "familyId": "family-07",
    "sourceGroup": "Immobilier et BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-038",
    "title": "Chef de projet immobilier",
    "familyId": "family-07",
    "sourceGroup": "Immobilier et BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-039",
    "title": "Gestionnaire de copropriété",
    "familyId": "family-07",
    "sourceGroup": "Immobilier et BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-040",
    "title": "Expert immobilier",
    "familyId": "family-07",
    "sourceGroup": "Immobilier et BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-041",
    "title": "Diagnostiqueur immobilier",
    "familyId": "family-07",
    "sourceGroup": "Immobilier et BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-042",
    "title": "Responsable de patrimoine immobilier",
    "familyId": "family-07",
    "sourceGroup": "Immobilier et BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-043",
    "title": "Technicien ascensoriste",
    "familyId": "family-07",
    "sourceGroup": "Immobilier et BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-044",
    "title": "Technicien de désenfumage",
    "familyId": "family-07",
    "sourceGroup": "Immobilier et BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-035",
    "title": "Professeur de français",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-036",
    "title": "Professeur d’anglais",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-037",
    "title": "Professeur d’histoire-géographie",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-038",
    "title": "Professeur de physique-chimie",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-039",
    "title": "Professeur de biologie",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-040",
    "title": "Enseignant spécialisé handicap",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-041",
    "title": "Formateur en conduite",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-042",
    "title": "Formateur en santé et sécurité",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-043",
    "title": "Responsable de certification",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-044",
    "title": "Administrateur de plateforme pédagogique",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-035",
    "title": "Pilote de ligne",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-036",
    "title": "Copilote aérien",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-037",
    "title": "Agent de piste aéroportuaire",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-038",
    "title": "Agent de trafic aérien",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-039",
    "title": "Contrôleur aérien",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-040",
    "title": "Mécanicien aéronautique",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-041",
    "title": "Agent de sûreté aéroportuaire",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-042",
    "title": "Capitaine de navire",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-043",
    "title": "Officier mécanicien maritime",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-044",
    "title": "Agent de consignation maritime",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-035",
    "title": "Chef pâtissier",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-036",
    "title": "Chocolatier-confiseur",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-037",
    "title": "Pizzaïolo",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-038",
    "title": "Cuisinier de collectivité",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-039",
    "title": "Responsable de restauration scolaire",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-040",
    "title": "Gestionnaire de cantine",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-041",
    "title": "Directeur de résidence hôtelière",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-042",
    "title": "Responsable d'étage hôtelier",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-043",
    "title": "Agent de réservation touristique",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-044",
    "title": "Responsable de spa hôtelier",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-036",
    "title": "Directeur de production audiovisuelle",
    "familyId": "family-11",
    "sourceGroup": "Événementiel et tourisme",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-037",
    "title": "Producteur de cinéma",
    "familyId": "family-11",
    "sourceGroup": "Événementiel et tourisme",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-038",
    "title": "Réalisateur",
    "familyId": "family-11",
    "sourceGroup": "Événementiel et tourisme",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-039",
    "title": "Scénariste",
    "familyId": "family-11",
    "sourceGroup": "Événementiel et tourisme",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-040",
    "title": "Journaliste culturel",
    "familyId": "family-11",
    "sourceGroup": "Événementiel et tourisme",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-041",
    "title": "Responsable de galerie d’art",
    "familyId": "family-11",
    "sourceGroup": "Événementiel et tourisme",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-042",
    "title": "Commissaire d’exposition",
    "familyId": "family-11",
    "sourceGroup": "Événementiel et tourisme",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-043",
    "title": "Responsable de musée",
    "familyId": "family-11",
    "sourceGroup": "Événementiel et tourisme",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-044",
    "title": "Régisseur de musée",
    "familyId": "family-11",
    "sourceGroup": "Événementiel et tourisme",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-045",
    "title": "Chargé de médiation patrimoniale",
    "familyId": "family-11",
    "sourceGroup": "Événementiel et tourisme",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-035",
    "title": "Responsable des relations professionnelles",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-036",
    "title": "Responsable de mobilité internationale",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-037",
    "title": "Gestionnaire de temps de travail",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-038",
    "title": "Analyste des effectifs",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-039",
    "title": "Responsable de prévention des risques psychosociaux",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-040",
    "title": "Chargé de recrutement technique",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-041",
    "title": "Responsable de gestion des compétences",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-042",
    "title": "Gestionnaire de retraite et prévoyance",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-043",
    "title": "Responsable de politique salariale",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-044",
    "title": "Responsable de transformation RH",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-036",
    "title": "Technicien de maintenance textile",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-037",
    "title": "Brodeur",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-038",
    "title": "Tisserand",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-039",
    "title": "Teinturier textile",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-040",
    "title": "Céramiste",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-041",
    "title": "Verrier",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-042",
    "title": "Technicien de plasturgie",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-043",
    "title": "Opérateur de conditionnement",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-044",
    "title": "Technicien de métrologie industrielle",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-045",
    "title": "Responsable méthodes industrielles",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-035",
    "title": "Assistant de personnes handicapées",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-036",
    "title": "Accompagnateur de mobilité",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-037",
    "title": "Auxiliaire de vie scolaire",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-038",
    "title": "Agent de garde malade non médical",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-039",
    "title": "Conseiller en image",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-040",
    "title": "Prothésiste capillaire",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-041",
    "title": "Technicien de nettoyage de vitres",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-042",
    "title": "Agent de désinfection",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-043",
    "title": "Responsable de pressing",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-044",
    "title": "Réparateur de petits appareils",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-036",
    "title": "Agent de développement local",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-037",
    "title": "Chargé de coopération décentralisée",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-038",
    "title": "Responsable de commande publique",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-039",
    "title": "Gestionnaire de concessions publiques",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-040",
    "title": "Agent de contrôle fiscal local",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-041",
    "title": "Responsable de la relation usager",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-042",
    "title": "Gestionnaire de dossiers sociaux publics",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-043",
    "title": "Responsable de médiation citoyenne",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-044",
    "title": "Chargé de mission territoriale",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-045",
    "title": "Responsable de service d’état civil",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-035",
    "title": "Avocat en droit de la famille",
    "familyId": "family-16",
    "sourceGroup": "Droit",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-036",
    "title": "Avocat en droit immobilier",
    "familyId": "family-16",
    "sourceGroup": "Droit",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-037",
    "title": "Avocat en droit pénal des affaires",
    "familyId": "family-16",
    "sourceGroup": "Droit",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-038",
    "title": "Juriste en droit de la concurrence",
    "familyId": "family-16",
    "sourceGroup": "Droit",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-039",
    "title": "Juriste en droit de l’environnement",
    "familyId": "family-16",
    "sourceGroup": "Droit",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-040",
    "title": "Juriste en droit des assurances",
    "familyId": "family-16",
    "sourceGroup": "Droit",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-041",
    "title": "Juriste en droit maritime",
    "familyId": "family-16",
    "sourceGroup": "Droit",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-042",
    "title": "Juriste en droit de la santé",
    "familyId": "family-16",
    "sourceGroup": "Droit",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-043",
    "title": "Responsable de protection des données",
    "familyId": "family-16",
    "sourceGroup": "Droit",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-044",
    "title": "Gestionnaire de conformité réglementaire",
    "familyId": "family-16",
    "sourceGroup": "Droit",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-035",
    "title": "Ingénieur en intelligence artificielle",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-036",
    "title": "Ingénieur en traitement du langage",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-037",
    "title": "Spécialiste en vision par ordinateur",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-038",
    "title": "Architecte de données",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-039",
    "title": "Ingénieur de fiabilité de site",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-040",
    "title": "Ingénieur sécurité applicative",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-041",
    "title": "Administrateur Linux",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-042",
    "title": "Administrateur Microsoft 365",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-043",
    "title": "Technicien audiovisuel numérique",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-044",
    "title": "Responsable de gouvernance des données",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-035",
    "title": "Ingénieur de réseau d’eau potable",
    "familyId": "family-18",
    "sourceGroup": "Énergie et environnement",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-036",
    "title": "Technicien de station de pompage",
    "familyId": "family-18",
    "sourceGroup": "Énergie et environnement",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-037",
    "title": "Agent de contrôle des fuites",
    "familyId": "family-18",
    "sourceGroup": "Énergie et environnement",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-038",
    "title": "Technicien de maintenance hydraulique",
    "familyId": "family-18",
    "sourceGroup": "Énergie et environnement",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-039",
    "title": "Responsable de réseau d’assainissement",
    "familyId": "family-18",
    "sourceGroup": "Énergie et environnement",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-040",
    "title": "Opérateur de centrale solaire",
    "familyId": "family-18",
    "sourceGroup": "Énergie et environnement",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-041",
    "title": "Technicien de stockage d’énergie",
    "familyId": "family-18",
    "sourceGroup": "Énergie et environnement",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-042",
    "title": "Technicien de biométhanisation",
    "familyId": "family-18",
    "sourceGroup": "Énergie et environnement",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-043",
    "title": "Responsable d’efficacité énergétique",
    "familyId": "family-18",
    "sourceGroup": "Énergie et environnement",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-044",
    "title": "Agent de contrôle de pollution",
    "familyId": "family-18",
    "sourceGroup": "Énergie et environnement",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-035",
    "title": "Responsable de sûreté portuaire",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-036",
    "title": "Responsable de sûreté industrielle",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-037",
    "title": "Auditeur de sécurité physique",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-038",
    "title": "Spécialiste de prévention incendie",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-039",
    "title": "Coordinateur de protection civile",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-040",
    "title": "Chef de centre de secours",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-041",
    "title": "Responsable de sécurité événementielle",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-042",
    "title": "Analyste de risques opérationnels",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-043",
    "title": "Responsable de sûreté des transports",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-044",
    "title": "Formateur en premiers secours",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-036",
    "title": "Responsable de centre social",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-037",
    "title": "Coordinateur d’aide alimentaire",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-038",
    "title": "Chargé d’accompagnement des familles",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-039",
    "title": "Responsable de programme d’insertion",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-040",
    "title": "Conseiller en développement communautaire",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-041",
    "title": "Coordinateur de volontaires",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-042",
    "title": "Responsable de maison des jeunes",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-043",
    "title": "Chargé de plaidoyer associatif",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-044",
    "title": "Gestionnaire de partenariat humanitaire",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-045",
    "title": "Responsable de suivi-évaluation social",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-045",
    "title": "Immunologiste",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-046",
    "title": "Rhumatologue",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-047",
    "title": "Gastro-entérologue",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-048",
    "title": "ORL",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-049",
    "title": "Urologue",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-050",
    "title": "Hématologue",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-051",
    "title": "Infectiologue",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-052",
    "title": "Médecin rééducateur",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-053",
    "title": "Technicien de stérilisation médicale",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-054",
    "title": "Coordinateur de parcours de soins",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-045",
    "title": "Moniteur d’escalade",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-046",
    "title": "Moniteur de randonnée sportive",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-047",
    "title": "Entraîneur d’arts martiaux",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-048",
    "title": "Entraîneur de tennis de table",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-049",
    "title": "Entraîneur de badminton",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-050",
    "title": "Entraîneur de hockey",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-051",
    "title": "Préparateur de compétition",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-052",
    "title": "Responsable de vestiaires sportifs",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-053",
    "title": "Gestionnaire de centre équestre",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-054",
    "title": "Moniteur d’équitation",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-045",
    "title": "Technicien en machinisme agricole",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-046",
    "title": "Conducteur de tracteur",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-047",
    "title": "Responsable de production maraîchère",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-048",
    "title": "Technicien de conservation des sols",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-049",
    "title": "Technicien de laboratoire agricole",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-050",
    "title": "Responsable de stockage agricole",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-051",
    "title": "Contrôleur de produits phytosanitaires",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-052",
    "title": "Gestionnaire de marché agricole",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-053",
    "title": "Technicien de transformation laitière",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-054",
    "title": "Responsable de collecte de lait",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-045",
    "title": "Responsable de catégorie produit",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-046",
    "title": "Gestionnaire de ventes B2B",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-047",
    "title": "Responsable de commerce franchisé",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-048",
    "title": "Agent de commerce international",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-049",
    "title": "Gestionnaire de portefeuille clients",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-050",
    "title": "Responsable de distribution régionale",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-051",
    "title": "Responsable de boutique en ligne",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-052",
    "title": "Gestionnaire de programmes de fidélité",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-053",
    "title": "Responsable de centre d'appels commerciaux",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-054",
    "title": "Coordinateur de vente directe",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-045",
    "title": "Analyste de rentabilité",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-046",
    "title": "Responsable de trésorerie",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-047",
    "title": "Gestionnaire de placements",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-048",
    "title": "Conseiller en financement",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-049",
    "title": "Chargé d’affaires bancaires",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-050",
    "title": "Analyste de conformité bancaire",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-051",
    "title": "Gestionnaire de garanties",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-052",
    "title": "Gestionnaire de portefeuille de crédit",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-053",
    "title": "Responsable de facturation médicale",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-054",
    "title": "Analyste de performance financière",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-045",
    "title": "Directeur de développement commercial",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-046",
    "title": "Responsable de centre de profit",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-047",
    "title": "Gestionnaire de risques de projet",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-048",
    "title": "Responsable de planification",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-049",
    "title": "Directeur de programme",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-050",
    "title": "Gestionnaire de portefeuille stratégique",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-051",
    "title": "Consultant en performance opérationnelle",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-052",
    "title": "Responsable de gestion documentaire",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-053",
    "title": "Responsable de contrôle de gestion sociale",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-054",
    "title": "Administrateur de fondation",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-045",
    "title": "Technicien en topographie",
    "familyId": "family-07",
    "sourceGroup": "Immobilier et BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-046",
    "title": "Géotechnicien",
    "familyId": "family-07",
    "sourceGroup": "Immobilier et BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-047",
    "title": "Ingénieur en bâtiment durable",
    "familyId": "family-07",
    "sourceGroup": "Immobilier et BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-048",
    "title": "Responsable de travaux de rénovation",
    "familyId": "family-07",
    "sourceGroup": "Immobilier et BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-049",
    "title": "Technicien de plomberie bâtiment",
    "familyId": "family-07",
    "sourceGroup": "Immobilier et BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-050",
    "title": "Installateur de systèmes de ventilation",
    "familyId": "family-07",
    "sourceGroup": "Immobilier et BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-051",
    "title": "Technicien de maintenance d’ascenseurs",
    "familyId": "family-07",
    "sourceGroup": "Immobilier et BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-052",
    "title": "Gestionnaire de parc immobilier",
    "familyId": "family-07",
    "sourceGroup": "Immobilier et BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-053",
    "title": "Responsable de location saisonnière",
    "familyId": "family-07",
    "sourceGroup": "Immobilier et BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-054",
    "title": "Responsable de chantier de réhabilitation",
    "familyId": "family-07",
    "sourceGroup": "Immobilier et BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-045",
    "title": "Professeur de musique",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-046",
    "title": "Professeur d’arts plastiques",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-047",
    "title": "Professeur de sport adapté",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-048",
    "title": "Enseignant en formation professionnelle",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-049",
    "title": "Formateur en entrepreneuriat",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-050",
    "title": "Formateur en comptabilité",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-051",
    "title": "Formateur en agriculture",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-052",
    "title": "Responsable de centre de formation",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-053",
    "title": "Gestionnaire de bourses scolaires",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-054",
    "title": "Responsable de vie scolaire",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-045",
    "title": "Conducteur de train",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-046",
    "title": "Agent de gare",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-047",
    "title": "Chef de gare",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-048",
    "title": "Technicien ferroviaire",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-049",
    "title": "Agent de maintenance ferroviaire",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-050",
    "title": "Conducteur de tramway",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-051",
    "title": "Régulateur de trafic routier",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-052",
    "title": "Gestionnaire de transport scolaire",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-053",
    "title": "Responsable de transport sanitaire",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-054",
    "title": "Agent de manutention portuaire",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-045",
    "title": "Poissonnier-traiteur",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-046",
    "title": "Cuisinier à domicile",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-047",
    "title": "Chef de cuisine événementielle",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-048",
    "title": "Responsable de boulangerie",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-049",
    "title": "Responsable de glacier",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-050",
    "title": "Gestionnaire de bar",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-051",
    "title": "Responsable de cave et boissons",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-052",
    "title": "Directeur de restaurant collectif",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-053",
    "title": "Responsable de buffet",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-054",
    "title": "Gestionnaire de service traiteur",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-046",
    "title": "Chargé de production culturelle",
    "familyId": "family-11",
    "sourceGroup": "Événementiel et tourisme",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-047",
    "title": "Directeur de centre culturel",
    "familyId": "family-11",
    "sourceGroup": "Événementiel et tourisme",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-048",
    "title": "Responsable de salle de spectacle",
    "familyId": "family-11",
    "sourceGroup": "Événementiel et tourisme",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-049",
    "title": "Technicien de plateau",
    "familyId": "family-11",
    "sourceGroup": "Événementiel et tourisme",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-050",
    "title": "Régisseur de tournée",
    "familyId": "family-11",
    "sourceGroup": "Événementiel et tourisme",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-051",
    "title": "Agent de patrimoine touristique",
    "familyId": "family-11",
    "sourceGroup": "Événementiel et tourisme",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-052",
    "title": "Responsable de destination touristique",
    "familyId": "family-11",
    "sourceGroup": "Événementiel et tourisme",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-053",
    "title": "Chargé de développement touristique",
    "familyId": "family-11",
    "sourceGroup": "Événementiel et tourisme",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-054",
    "title": "Organisateur de congrès",
    "familyId": "family-11",
    "sourceGroup": "Événementiel et tourisme",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-055",
    "title": "Responsable de salon professionnel",
    "familyId": "family-11",
    "sourceGroup": "Événementiel et tourisme",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-045",
    "title": "Responsable de recrutement et sélection",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-046",
    "title": "Responsable de gestion prévisionnelle des emplois",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-047",
    "title": "Gestionnaire de dossiers de retraite",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-048",
    "title": "Responsable de rémunération variable",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-049",
    "title": "Gestionnaire de relations sociales",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-050",
    "title": "Responsable d'évaluation professionnelle",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-051",
    "title": "Chargé de prévention des conflits au travail",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-052",
    "title": "Responsable de politique de formation",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-053",
    "title": "Gestionnaire de mobilité interne",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-054",
    "title": "Responsable de communication RH",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-046",
    "title": "Technicien de maintenance mécanique",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-047",
    "title": "Technicien de maintenance électrique",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-048",
    "title": "Opérateur de découpe industrielle",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-049",
    "title": "Conducteur de ligne de production",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-050",
    "title": "Technicien de fabrication additive",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-051",
    "title": "Technicien de contrôle dimensionnel",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-052",
    "title": "Responsable de production textile",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-053",
    "title": "Responsable de finition industrielle",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-054",
    "title": "Technicien de réparation de machines",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-055",
    "title": "Chef d’équipe de production",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-045",
    "title": "Auxiliaire de vie en résidence",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-046",
    "title": "Assistant de maintien à domicile",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-047",
    "title": "Responsable de service de garde",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-048",
    "title": "Agent de collecte de linge",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-049",
    "title": "Technicien de nettoyage spécialisé",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-050",
    "title": "Responsable de salon de coiffure",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-051",
    "title": "Responsable de centre esthétique",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-052",
    "title": "Conseiller en soins de beauté",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-053",
    "title": "Technicien de réparation de mobilier",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-054",
    "title": "Assistant de services personnels",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-046",
    "title": "Responsable de service d’urbanisme",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-047",
    "title": "Agent de développement communal",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-048",
    "title": "Gestionnaire de fiscalité locale",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-049",
    "title": "Responsable de gestion des équipements publics",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-050",
    "title": "Agent de police municipale administrative",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-051",
    "title": "Responsable de service social communal",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-052",
    "title": "Gestionnaire de dossiers de citoyenneté",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-053",
    "title": "Chargé de contrôle de délégations publiques",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-054",
    "title": "Responsable de relation institutionnelle",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-055",
    "title": "Chargé de mission de coopération publique",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-045",
    "title": "Juriste en droit commercial",
    "familyId": "family-16",
    "sourceGroup": "Droit",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-046",
    "title": "Juriste en droit pénal",
    "familyId": "family-16",
    "sourceGroup": "Droit",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-047",
    "title": "Juriste en droit de la famille",
    "familyId": "family-16",
    "sourceGroup": "Droit",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-048",
    "title": "Juriste en droit des transports",
    "familyId": "family-16",
    "sourceGroup": "Droit",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-049",
    "title": "Juriste en droit de la construction",
    "familyId": "family-16",
    "sourceGroup": "Droit",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-050",
    "title": "Juriste en droit de la propriété intellectuelle",
    "familyId": "family-16",
    "sourceGroup": "Droit",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-051",
    "title": "Juriste en droit des collectivités",
    "familyId": "family-16",
    "sourceGroup": "Droit",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-052",
    "title": "Responsable de contentieux fiscal",
    "familyId": "family-16",
    "sourceGroup": "Droit",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-053",
    "title": "Gestionnaire de conformité sociale",
    "familyId": "family-16",
    "sourceGroup": "Droit",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-054",
    "title": "Chargé de prévention de la corruption",
    "familyId": "family-16",
    "sourceGroup": "Droit",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-045",
    "title": "Développeur d’applications métier",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-046",
    "title": "Développeur de jeux vidéo",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-047",
    "title": "Ingénieur logiciel embarqué",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-048",
    "title": "Administrateur Kubernetes",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-049",
    "title": "Ingénieur réseau sans fil",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-050",
    "title": "Architecte de solutions numériques",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-051",
    "title": "Spécialiste de tests automatisés",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-052",
    "title": "Ingénieur en qualité logicielle",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-053",
    "title": "Gestionnaire de services informatiques",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-054",
    "title": "Responsable de support applicatif",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-045",
    "title": "Technicien de maintenance de réseau d’eau",
    "familyId": "family-18",
    "sourceGroup": "Énergie et environnement",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-046",
    "title": "Agent de station de traitement",
    "familyId": "family-18",
    "sourceGroup": "Énergie et environnement",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-047",
    "title": "Technicien de contrôle de qualité énergétique",
    "familyId": "family-18",
    "sourceGroup": "Énergie et environnement",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-048",
    "title": "Responsable de comptage énergétique",
    "familyId": "family-18",
    "sourceGroup": "Énergie et environnement",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-049",
    "title": "Ingénieur en énergie renouvelable",
    "familyId": "family-18",
    "sourceGroup": "Énergie et environnement",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-050",
    "title": "Technicien de réseau de gaz",
    "familyId": "family-18",
    "sourceGroup": "Énergie et environnement",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-051",
    "title": "Opérateur de réseau de chaleur",
    "familyId": "family-18",
    "sourceGroup": "Énergie et environnement",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-052",
    "title": "Responsable de maintenance de pompes",
    "familyId": "family-18",
    "sourceGroup": "Énergie et environnement",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-053",
    "title": "Technicien de dépollution des eaux",
    "familyId": "family-18",
    "sourceGroup": "Énergie et environnement",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-054",
    "title": "Gestionnaire de service d’assainissement",
    "familyId": "family-18",
    "sourceGroup": "Énergie et environnement",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-045",
    "title": "Responsable de prévention des accidents",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-046",
    "title": "Coordinateur de sécurité au travail",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-047",
    "title": "Inspecteur de prévention incendie",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-048",
    "title": "Responsable de sécurité des bâtiments",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-049",
    "title": "Analyste de vulnérabilité physique",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-050",
    "title": "Responsable de sécurité des personnes",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-051",
    "title": "Coordinateur de réponse aux incidents",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-052",
    "title": "Responsable de plan de continuité",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-053",
    "title": "Auditeur de gestion de crise",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-054",
    "title": "Technicien de systèmes de détection",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-046",
    "title": "Chargé de mission humanitaire",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-047",
    "title": "Coordinateur de protection sociale",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-048",
    "title": "Responsable de programme d’alphabétisation",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-049",
    "title": "Gestionnaire de centre d’hébergement",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-050",
    "title": "Coordinateur de soutien scolaire",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-051",
    "title": "Responsable de programme d’autonomisation",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-052",
    "title": "Chargé de participation communautaire",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-053",
    "title": "Responsable de programme de santé communautaire",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-054",
    "title": "Coordinateur de développement rural",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-055",
    "title": "Gestionnaire de programme de solidarité",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-055",
    "title": "Allergologue",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-056",
    "title": "Médecin nutritionniste",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-057",
    "title": "Médecin légiste",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-058",
    "title": "Médecin de réadaptation",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-059",
    "title": "Neuropédiatre",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-060",
    "title": "Chirurgien orthopédiste",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-061",
    "title": "Chirurgien digestif",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-062",
    "title": "Spécialiste douleur",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-063",
    "title": "Technicien en électrophysiologie",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-064",
    "title": "Coordinateur de recherche clinique",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-055",
    "title": "Moniteur de plongée",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-056",
    "title": "Moniteur de voile",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-057",
    "title": "Entraîneur de sports de combat",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-058",
    "title": "Entraîneur de football féminin",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-059",
    "title": "Préparateur de jeunes talents",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-060",
    "title": "Responsable de scouting sportif",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-061",
    "title": "Agent de joueurs",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-062",
    "title": "Gestionnaire de centre de performance",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-063",
    "title": "Responsable de compétition scolaire",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-064",
    "title": "Coordinateur de sport adapté",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-055",
    "title": "Technicien en agroforesterie",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-056",
    "title": "Technicien de production semencière",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-057",
    "title": "Gestionnaire de verger",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-058",
    "title": "Chef de plantation",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-059",
    "title": "Technicien de santé animale",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-060",
    "title": "Responsable de ferme laitière",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-061",
    "title": "Responsable d’écloserie",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-062",
    "title": "Technicien de conservation des récoltes",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-063",
    "title": "Responsable de transformation de manioc",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-064",
    "title": "Conseiller en gestion d’exploitation",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-055",
    "title": "Responsable de ventes automobiles",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-056",
    "title": "Gestionnaire de magasin de matériaux",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-057",
    "title": "Responsable de distribution pharmaceutique",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-058",
    "title": "Commercial immobilier",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-059",
    "title": "Responsable de vente à crédit",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-060",
    "title": "Gestionnaire de réseau de revendeurs",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-061",
    "title": "Responsable de ventes télécoms",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-062",
    "title": "Conseiller en équipements professionnels",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-063",
    "title": "Gestionnaire de commandes fournisseurs",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-064",
    "title": "Responsable de commerce de proximité",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-055",
    "title": "Gestionnaire de risques de crédit",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-056",
    "title": "Responsable de conformité assurance",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-057",
    "title": "Actuaire",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-058",
    "title": "Expert en évaluation financière",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-059",
    "title": "Analyste de portefeuille d’investissement",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-060",
    "title": "Gestionnaire de fonds",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-061",
    "title": "Responsable de contrôle budgétaire",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-062",
    "title": "Responsable de recouvrement bancaire",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-063",
    "title": "Chargé de financement de projets",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-064",
    "title": "Conseiller en gestion de patrimoine",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-055",
    "title": "Responsable de gouvernance d’entreprise",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-056",
    "title": "Directeur de la transformation",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-057",
    "title": "Responsable de développement organisationnel",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-058",
    "title": "Consultant en management",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-059",
    "title": "Gestionnaire de portefeuille de services",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-060",
    "title": "Responsable de planification des ressources",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-061",
    "title": "Directeur de centre de services",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-062",
    "title": "Responsable de gestion des fournisseurs",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-063",
    "title": "Responsable de contrôle stratégique",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-064",
    "title": "Chargé de suivi des décisions de direction",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-055",
    "title": "Technicien en génie climatique",
    "familyId": "family-07",
    "sourceGroup": "Immobilier et BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-056",
    "title": "Ingénieur en structures métalliques",
    "familyId": "family-07",
    "sourceGroup": "Immobilier et BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-057",
    "title": "Responsable de bureau d’études",
    "familyId": "family-07",
    "sourceGroup": "Immobilier et BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-058",
    "title": "Chef de projet de construction",
    "familyId": "family-07",
    "sourceGroup": "Immobilier et BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-059",
    "title": "Responsable de travaux routiers",
    "familyId": "family-07",
    "sourceGroup": "Immobilier et BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-060",
    "title": "Technicien en voirie et réseaux divers",
    "familyId": "family-07",
    "sourceGroup": "Immobilier et BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-061",
    "title": "Gestionnaire de maintenance immobilière",
    "familyId": "family-07",
    "sourceGroup": "Immobilier et BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-062",
    "title": "Responsable de patrimoine bâti",
    "familyId": "family-07",
    "sourceGroup": "Immobilier et BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-063",
    "title": "Technicien en diagnostic énergétique bâtiment",
    "familyId": "family-07",
    "sourceGroup": "Immobilier et BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-064",
    "title": "Conducteur de travaux de second œuvre",
    "familyId": "family-07",
    "sourceGroup": "Immobilier et BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-055",
    "title": "Professeur de philosophie",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-056",
    "title": "Professeur de technologie",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-057",
    "title": "Enseignant de maternelle",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-058",
    "title": "Enseignant de formation technique",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-059",
    "title": "Responsable d’alternance",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-060",
    "title": "Coordinateur de formation continue",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-061",
    "title": "Responsable de validation des acquis",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-062",
    "title": "Concepteur de référentiels de compétences",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-063",
    "title": "Gestionnaire de concours scolaires",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-064",
    "title": "Responsable de centre d’examen",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-055",
    "title": "Pilote de drone logistique",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-056",
    "title": "Responsable d’exploitation aéroportuaire",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-057",
    "title": "Agent de fret aérien",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-058",
    "title": "Responsable de terminal portuaire",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-059",
    "title": "Officier de port",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-060",
    "title": "Agent de sécurité maritime",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-061",
    "title": "Gestionnaire de transport urbain",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-062",
    "title": "Responsable de mobilité partagée",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-063",
    "title": "Planificateur de transport de marchandises",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-064",
    "title": "Gestionnaire de transport frigorifique",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-055",
    "title": "Responsable de cuisine centrale",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-056",
    "title": "Chef de production alimentaire",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-057",
    "title": "Technicien en boulangerie industrielle",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-058",
    "title": "Responsable de chaîne de restauration",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-059",
    "title": "Gestionnaire de résidence touristique",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-060",
    "title": "Responsable de camping",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-061",
    "title": "Agent d’accueil touristique",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-062",
    "title": "Responsable de spa et bien-être hôtelier",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-063",
    "title": "Gestionnaire de petit-déjeuner hôtelier",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-064",
    "title": "Responsable de service banquet",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-056",
    "title": "Producteur de festival",
    "familyId": "family-11",
    "sourceGroup": "Événementiel et tourisme",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-057",
    "title": "Directeur artistique",
    "familyId": "family-11",
    "sourceGroup": "Événementiel et tourisme",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-058",
    "title": "Responsable de tournée musicale",
    "familyId": "family-11",
    "sourceGroup": "Événementiel et tourisme",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-059",
    "title": "Chargé de diffusion artistique",
    "familyId": "family-11",
    "sourceGroup": "Événementiel et tourisme",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-060",
    "title": "Responsable de droits musicaux",
    "familyId": "family-11",
    "sourceGroup": "Événementiel et tourisme",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-061",
    "title": "Gestionnaire de salle de cinéma",
    "familyId": "family-11",
    "sourceGroup": "Événementiel et tourisme",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-062",
    "title": "Exploitant de salle de spectacle",
    "familyId": "family-11",
    "sourceGroup": "Événementiel et tourisme",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-063",
    "title": "Chargé de patrimoine culturel",
    "familyId": "family-11",
    "sourceGroup": "Événementiel et tourisme",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-064",
    "title": "Responsable de médiathèque",
    "familyId": "family-11",
    "sourceGroup": "Événementiel et tourisme",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-065",
    "title": "Organisateur de voyages culturels",
    "familyId": "family-11",
    "sourceGroup": "Événementiel et tourisme",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-055",
    "title": "Responsable de gestion des talents",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-056",
    "title": "Responsable de relations employés",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-057",
    "title": "Gestionnaire de temps et activités",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-058",
    "title": "Responsable de politique de rémunération",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-059",
    "title": "Analyste de données RH",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-060",
    "title": "Responsable de planification des effectifs",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-061",
    "title": "Gestionnaire de mobilité professionnelle",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-062",
    "title": "Responsable de santé et sécurité au travail",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-063",
    "title": "Coordinateur de dialogue social",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-064",
    "title": "Responsable de qualité de vie au travail",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-056",
    "title": "Technicien de maintenance de machines-outils",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-057",
    "title": "Opérateur de commande numérique",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-058",
    "title": "Technicien de maintenance hydraulique industrielle",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-059",
    "title": "Technicien de maintenance pneumatique",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-060",
    "title": "Responsable de maintenance d’atelier",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-061",
    "title": "Responsable de production agro-industrielle",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-062",
    "title": "Technicien en emballage industriel",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-063",
    "title": "Contrôleur de procédés industriels",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-064",
    "title": "Responsable de laboratoire industriel",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-065",
    "title": "Technicien de fabrication métallique",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-055",
    "title": "Responsable de service d’aide à domicile",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-056",
    "title": "Coordinateur de garde d’enfants",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-057",
    "title": "Assistant de vie en établissement",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-058",
    "title": "Agent de nettoyage hospitalier",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-059",
    "title": "Technicien de désinsectisation",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-060",
    "title": "Technicien de dératisation",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-061",
    "title": "Responsable de service de conciergerie",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-062",
    "title": "Agent de soins esthétiques",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-063",
    "title": "Responsable de pressing industriel",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-064",
    "title": "Intervenant de soutien familial",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-056",
    "title": "Responsable de service des affaires générales",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-057",
    "title": "Gestionnaire de l’état civil numérique",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-058",
    "title": "Responsable de service des populations",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-059",
    "title": "Chargé de suivi des politiques publiques",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-060",
    "title": "Gestionnaire de marchés publics",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-061",
    "title": "Responsable de contrôle de gestion publique",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-062",
    "title": "Agent de gestion des aides publiques",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-063",
    "title": "Responsable de guichet unique",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-064",
    "title": "Chargé de mission de décentralisation",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-065",
    "title": "Gestionnaire de services municipaux",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-055",
    "title": "Juriste en droit fiscal international",
    "familyId": "family-16",
    "sourceGroup": "Droit",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-056",
    "title": "Juriste en droit bancaire",
    "familyId": "family-16",
    "sourceGroup": "Droit",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-057",
    "title": "Juriste en droit de la propriété foncière",
    "familyId": "family-16",
    "sourceGroup": "Droit",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-058",
    "title": "Juriste en droit des marchés publics",
    "familyId": "family-16",
    "sourceGroup": "Droit",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-059",
    "title": "Juriste en droit des télécommunications",
    "familyId": "family-16",
    "sourceGroup": "Droit",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-060",
    "title": "Juriste en droit de l’énergie",
    "familyId": "family-16",
    "sourceGroup": "Droit",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-061",
    "title": "Juriste en droit des données",
    "familyId": "family-16",
    "sourceGroup": "Droit",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-062",
    "title": "Gestionnaire de litiges commerciaux",
    "familyId": "family-16",
    "sourceGroup": "Droit",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-063",
    "title": "Responsable de médiation institutionnelle",
    "familyId": "family-16",
    "sourceGroup": "Droit",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-064",
    "title": "Consultant en gouvernance juridique",
    "familyId": "family-16",
    "sourceGroup": "Droit",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-055",
    "title": "Ingénieur en robotique",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-056",
    "title": "Ingénieur en systèmes embarqués",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-057",
    "title": "Ingénieur en réalité augmentée",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-058",
    "title": "Spécialiste en blockchain",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-059",
    "title": "Ingénieur de plateforme de données",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-060",
    "title": "Développeur d’API",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-061",
    "title": "Ingénieur de sécurité réseau",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-062",
    "title": "Administrateur de stockage cloud",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-063",
    "title": "Ingénieur d’intégration logicielle",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-064",
    "title": "Responsable d’architecture informatique",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-055",
    "title": "Responsable d’exploitation d’eau potable",
    "familyId": "family-18",
    "sourceGroup": "Énergie et environnement",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-056",
    "title": "Technicien de maintenance de station d’épuration",
    "familyId": "family-18",
    "sourceGroup": "Énergie et environnement",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-057",
    "title": "Ingénieur en traitement des eaux usées",
    "familyId": "family-18",
    "sourceGroup": "Énergie et environnement",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-058",
    "title": "Responsable de réseau de distribution électrique",
    "familyId": "family-18",
    "sourceGroup": "Énergie et environnement",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-059",
    "title": "Technicien de compteur intelligent",
    "familyId": "family-18",
    "sourceGroup": "Énergie et environnement",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-060",
    "title": "Gestionnaire de réseau de chaleur",
    "familyId": "family-18",
    "sourceGroup": "Énergie et environnement",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-061",
    "title": "Responsable de production d’énergie renouvelable",
    "familyId": "family-18",
    "sourceGroup": "Énergie et environnement",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-062",
    "title": "Technicien de maintenance de batteries",
    "familyId": "family-18",
    "sourceGroup": "Énergie et environnement",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-063",
    "title": "Responsable de collecte des déchets dangereux",
    "familyId": "family-18",
    "sourceGroup": "Énergie et environnement",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-064",
    "title": "Agent de contrôle environnemental",
    "familyId": "family-18",
    "sourceGroup": "Énergie et environnement",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-055",
    "title": "Responsable de sécurité des systèmes industriels",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-056",
    "title": "Coordinateur de sécurité civile",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-057",
    "title": "Responsable de protection des infrastructures",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-058",
    "title": "Expert en prévention des risques professionnels",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-059",
    "title": "Responsable de sécurité des transports publics",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-060",
    "title": "Technicien de contrôle des alarmes",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-061",
    "title": "Responsable de gestion des évacuations",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-062",
    "title": "Coordinateur de sécurité de chantier",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-063",
    "title": "Inspecteur de sûreté aéroportuaire",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-064",
    "title": "Responsable de sécurité des établissements",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-056",
    "title": "Responsable de programme d’inclusion",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-057",
    "title": "Coordinateur de services aux personnes âgées",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-058",
    "title": "Responsable de programme de soutien aux femmes",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-059",
    "title": "Coordinateur de protection communautaire",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-060",
    "title": "Responsable de centre d’écoute",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-061",
    "title": "Gestionnaire de programme de bénévolat",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-062",
    "title": "Chargé de mobilisation de ressources communautaires",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-063",
    "title": "Responsable de programme de développement local",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-064",
    "title": "Coordinateur d’accompagnement des jeunes",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-065",
    "title": "Responsable de programme d’accès aux droits",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-065",
    "title": "Médecin vasculaire",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-066",
    "title": "Chirurgien thoracique",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-067",
    "title": "Chirurgien pédiatrique",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-068",
    "title": "Spécialiste en médecine du sport",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-069",
    "title": "Médecin de famille",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-070",
    "title": "Technicien en anatomopathologie",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-071",
    "title": "Technicien en radiothérapie",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-072",
    "title": "Coordinateur de greffe",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-073",
    "title": "Infirmier anesthésiste",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-074",
    "title": "Infirmier de bloc opératoire",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-065",
    "title": "Entraîneur de volley-ball de plage",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-066",
    "title": "Entraîneur de futsal",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-067",
    "title": "Entraîneur de basketball 3x3",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-068",
    "title": "Responsable de sport scolaire",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-069",
    "title": "Moniteur de fitness aquatique",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-070",
    "title": "Responsable de préparation physique",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-071",
    "title": "Technicien de chronométrage sportif",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-072",
    "title": "Responsable de centre de récupération sportive",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-073",
    "title": "Gestionnaire de matériel de compétition",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-074",
    "title": "Coordinateur de ligue sportive",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-065",
    "title": "Technicien de production de cacao",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-066",
    "title": "Technicien de production de coton",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-067",
    "title": "Responsable de ferme porcine",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-068",
    "title": "Responsable de ferme caprine",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-069",
    "title": "Technicien de transformation de fruits",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-070",
    "title": "Technicien de transformation de céréales",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-071",
    "title": "Responsable de chaîne du froid agricole",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-072",
    "title": "Gestionnaire de marché à bétail",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-073",
    "title": "Technicien de contrôle vétérinaire",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-074",
    "title": "Conseiller en élevage durable",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-065",
    "title": "Responsable de vente de pièces détachées",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-066",
    "title": "Gestionnaire de commerce de gros",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-067",
    "title": "Responsable de magasin alimentaire",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-068",
    "title": "Gestionnaire de dépôt de boissons",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-069",
    "title": "Responsable de vente de matériel informatique",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-070",
    "title": "Agent de vente pharmaceutique",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-071",
    "title": "Responsable de réseau de distribution",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-072",
    "title": "Gestionnaire de commandes en ligne",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-073",
    "title": "Responsable de commerce mobile",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-074",
    "title": "Responsable de centre de relation commerciale",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-065",
    "title": "Gestionnaire de risques opérationnels financiers",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-066",
    "title": "Analyste de conformité fiscale",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-067",
    "title": "Gestionnaire de portefeuille immobilier",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-068",
    "title": "Conseiller en assurance vie",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-069",
    "title": "Gestionnaire de contrats d’assurance",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-070",
    "title": "Responsable de contrôle financier",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-071",
    "title": "Analyste de trésorerie prévisionnelle",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-072",
    "title": "Responsable de financement agricole",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-073",
    "title": "Gestionnaire de portefeuille de microcrédit",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-074",
    "title": "Chargé de relation investisseurs",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-065",
    "title": "Responsable de développement institutionnel",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-066",
    "title": "Directeur de stratégie et planification",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-067",
    "title": "Responsable de gestion des processus",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-068",
    "title": "Responsable de performance organisationnelle",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-069",
    "title": "Consultant en audit organisationnel",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-070",
    "title": "Responsable de gestion des connaissances",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-071",
    "title": "Coordinateur de gouvernance de projet",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-072",
    "title": "Responsable de gestion des partenariats",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-073",
    "title": "Directeur de centre de formation professionnelle",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-074",
    "title": "Responsable de portefeuille d’initiatives",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-065",
    "title": "Ingénieur en routes et chaussées",
    "familyId": "family-07",
    "sourceGroup": "Immobilier et BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-066",
    "title": "Technicien en assainissement urbain",
    "familyId": "family-07",
    "sourceGroup": "Immobilier et BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-067",
    "title": "Responsable de maintenance de routes",
    "familyId": "family-07",
    "sourceGroup": "Immobilier et BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-068",
    "title": "Chef de projet de lotissement",
    "familyId": "family-07",
    "sourceGroup": "Immobilier et BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-069",
    "title": "Responsable de bureau de contrôle bâtiment",
    "familyId": "family-07",
    "sourceGroup": "Immobilier et BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-070",
    "title": "Technicien en économie de la construction",
    "familyId": "family-07",
    "sourceGroup": "Immobilier et BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-071",
    "title": "Ingénieur en travaux maritimes",
    "familyId": "family-07",
    "sourceGroup": "Immobilier et BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-072",
    "title": "Technicien en géomatique foncière",
    "familyId": "family-07",
    "sourceGroup": "Immobilier et BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-073",
    "title": "Responsable de gestion de chantier",
    "familyId": "family-07",
    "sourceGroup": "Immobilier et BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-074",
    "title": "Technicien de maintenance de bâtiments publics",
    "familyId": "family-07",
    "sourceGroup": "Immobilier et BTP",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-065",
    "title": "Enseignant de sciences économiques",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-066",
    "title": "Enseignant de comptabilité",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-067",
    "title": "Enseignant de dessin technique",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-068",
    "title": "Enseignant de formation agricole",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-069",
    "title": "Formateur en logistique",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-070",
    "title": "Formateur en gestion de projet",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-071",
    "title": "Responsable de tutorat universitaire",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-072",
    "title": "Gestionnaire de formation à distance",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-073",
    "title": "Coordinateur d’apprentissage dual",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-074",
    "title": "Responsable de suivi des diplômés",
    "familyId": "family-08",
    "sourceGroup": "Éducation",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-065",
    "title": "Responsable de transport interurbain",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-066",
    "title": "Gestionnaire de gare routière",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-067",
    "title": "Agent d’exploitation ferroviaire",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-068",
    "title": "Planificateur de vols",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-069",
    "title": "Agent de fret maritime",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-070",
    "title": "Responsable de logistique humanitaire",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-071",
    "title": "Gestionnaire de parc de véhicules lourds",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-072",
    "title": "Technicien de maintenance de motos",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-073",
    "title": "Responsable de transport de fonds",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-074",
    "title": "Coordinateur de mobilité professionnelle",
    "familyId": "family-09",
    "sourceGroup": "Transport",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-065",
    "title": "Responsable de production de boissons",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-066",
    "title": "Brasseur artisanal",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-067",
    "title": "Technicien de transformation de produits laitiers",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-068",
    "title": "Responsable de cuisine hospitalière",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-069",
    "title": "Gestionnaire de restaurant universitaire",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-070",
    "title": "Responsable de restauration d’entreprise",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-071",
    "title": "Chef de partie",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-072",
    "title": "Responsable de service en chambre",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-073",
    "title": "Gestionnaire de résidence de tourisme",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-074",
    "title": "Responsable de contrôle des coûts alimentaires",
    "familyId": "family-10",
    "sourceGroup": "Restauration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-066",
    "title": "Administrateur de compagnie artistique",
    "familyId": "family-11",
    "sourceGroup": "Événementiel et tourisme",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-067",
    "title": "Chargé de programmation de festival",
    "familyId": "family-11",
    "sourceGroup": "Événementiel et tourisme",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-068",
    "title": "Responsable de billetterie de spectacle",
    "familyId": "family-11",
    "sourceGroup": "Événementiel et tourisme",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-069",
    "title": "Gestionnaire de droits audiovisuels",
    "familyId": "family-11",
    "sourceGroup": "Événementiel et tourisme",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-070",
    "title": "Directeur de production événementielle",
    "familyId": "family-11",
    "sourceGroup": "Événementiel et tourisme",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-071",
    "title": "Responsable de communication touristique",
    "familyId": "family-11",
    "sourceGroup": "Événementiel et tourisme",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-072",
    "title": "Gestionnaire de site patrimonial",
    "familyId": "family-11",
    "sourceGroup": "Événementiel et tourisme",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-073",
    "title": "Coordinateur de circuits touristiques",
    "familyId": "family-11",
    "sourceGroup": "Événementiel et tourisme",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-074",
    "title": "Responsable d’accueil de congrès",
    "familyId": "family-11",
    "sourceGroup": "Événementiel et tourisme",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-075",
    "title": "Agent de développement des industries culturelles",
    "familyId": "family-11",
    "sourceGroup": "Événementiel et tourisme",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-065",
    "title": "Gestionnaire de dossiers de recrutement",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-066",
    "title": "Responsable de rémunération et avantages",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-067",
    "title": "Responsable de gestion des absences",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-068",
    "title": "Chargé de relations avec les syndicats",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-069",
    "title": "Responsable d’administration du personnel",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-070",
    "title": "Gestionnaire de mobilité géographique",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-071",
    "title": "Responsable de plan de succession",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-072",
    "title": "Chargé d’intégration des nouveaux employés",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-073",
    "title": "Responsable de gestion des compétences numériques",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-074",
    "title": "Analyste de climat social",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-066",
    "title": "Technicien en maintenance de véhicules industriels",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-067",
    "title": "Opérateur de fabrication de pièces",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-068",
    "title": "Technicien en contrôle de soudure",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-069",
    "title": "Responsable de maintenance préventive",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-070",
    "title": "Responsable de maintenance corrective",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-071",
    "title": "Technicien de réparation de moteurs",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-072",
    "title": "Opérateur de traitement de surface",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-073",
    "title": "Technicien de maintenance d’équipements médicaux",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-074",
    "title": "Responsable de chaîne de montage",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-075",
    "title": "Technicien de contrôle de production",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-065",
    "title": "Responsable de résidence pour personnes âgées",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-066",
    "title": "Coordinateur de soins à domicile non médicaux",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-067",
    "title": "Assistant de vie de nuit",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-068",
    "title": "Agent de service en établissement médico-social",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-069",
    "title": "Responsable de garde périscolaire",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-070",
    "title": "Accompagnateur de personnes à mobilité réduite",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-071",
    "title": "Technicien de nettoyage après sinistre",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-072",
    "title": "Responsable de service de jardinage",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-073",
    "title": "Gestionnaire de services de blanchisserie",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-074",
    "title": "Responsable de services de proximité",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-066",
    "title": "Responsable de service de délivrance de documents",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-067",
    "title": "Gestionnaire de dossiers de permis de construire",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-068",
    "title": "Agent de gestion de domaine public",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-069",
    "title": "Responsable de service de voirie",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-070",
    "title": "Chargé de suivi des délibérations",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-071",
    "title": "Responsable de relation avec les administrés",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-072",
    "title": "Gestionnaire de dossiers de subventions",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-073",
    "title": "Agent de contrôle des services délégués",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-074",
    "title": "Responsable de coopération intercommunale",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-075",
    "title": "Responsable de gestion des cimetières publics",
    "familyId": "family-15",
    "sourceGroup": "Administration",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-065",
    "title": "Juriste en droit des sociétés commerciales",
    "familyId": "family-16",
    "sourceGroup": "Droit",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-066",
    "title": "Juriste en droit des personnes",
    "familyId": "family-16",
    "sourceGroup": "Droit",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-067",
    "title": "Juriste en droit de la propriété industrielle",
    "familyId": "family-16",
    "sourceGroup": "Droit",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-068",
    "title": "Juriste en droit de la consommation",
    "familyId": "family-16",
    "sourceGroup": "Droit",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-069",
    "title": "Juriste en droit de la concurrence numérique",
    "familyId": "family-16",
    "sourceGroup": "Droit",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-070",
    "title": "Responsable de veille juridique",
    "familyId": "family-16",
    "sourceGroup": "Droit",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-071",
    "title": "Responsable de gestion des réclamations juridiques",
    "familyId": "family-16",
    "sourceGroup": "Droit",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-072",
    "title": "Chargé de prévention des litiges",
    "familyId": "family-16",
    "sourceGroup": "Droit",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-073",
    "title": "Gestionnaire de dossiers de médiation",
    "familyId": "family-16",
    "sourceGroup": "Droit",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-074",
    "title": "Conseiller en conformité contractuelle",
    "familyId": "family-16",
    "sourceGroup": "Droit",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-065",
    "title": "Ingénieur en architecture microservices",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-066",
    "title": "Ingénieur en automatisation des tests",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-067",
    "title": "Développeur de systèmes distribués",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-068",
    "title": "Administrateur de messagerie d’entreprise",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-069",
    "title": "Spécialiste en observabilité logicielle",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-070",
    "title": "Ingénieur de sécurité cloud",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-071",
    "title": "Responsable de qualité des données",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-072",
    "title": "Développeur de solutions no-code",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-073",
    "title": "Ingénieur de migration informatique",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-074",
    "title": "Responsable de gestion des identités numériques",
    "familyId": "family-17",
    "sourceGroup": "Numérique",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-065",
    "title": "Technicien de maintenance de panneaux solaires",
    "familyId": "family-18",
    "sourceGroup": "Énergie et environnement",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-066",
    "title": "Responsable de réseau de distribution d’eau",
    "familyId": "family-18",
    "sourceGroup": "Énergie et environnement",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-067",
    "title": "Technicien d’analyse des eaux",
    "familyId": "family-18",
    "sourceGroup": "Énergie et environnement",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-068",
    "title": "Opérateur de centre de conduite énergétique",
    "familyId": "family-18",
    "sourceGroup": "Énergie et environnement",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-069",
    "title": "Responsable de maintenance de réseau électrique",
    "familyId": "family-18",
    "sourceGroup": "Énergie et environnement",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-070",
    "title": "Technicien de contrôle des installations électriques",
    "familyId": "family-18",
    "sourceGroup": "Énergie et environnement",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-071",
    "title": "Gestionnaire de réseau d’éclairage public",
    "familyId": "family-18",
    "sourceGroup": "Énergie et environnement",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-072",
    "title": "Responsable de collecte sélective",
    "familyId": "family-18",
    "sourceGroup": "Énergie et environnement",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-073",
    "title": "Technicien de valorisation des déchets",
    "familyId": "family-18",
    "sourceGroup": "Énergie et environnement",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-074",
    "title": "Ingénieur en gestion des ressources hydriques",
    "familyId": "family-18",
    "sourceGroup": "Énergie et environnement",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-065",
    "title": "Responsable de sécurité des données physiques",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-066",
    "title": "Coordinateur de prévention des risques naturels",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-067",
    "title": "Responsable de sécurité des sites sensibles",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-068",
    "title": "Technicien de maintenance de systèmes incendie",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-069",
    "title": "Responsable de sécurité des établissements scolaires",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-070",
    "title": "Coordinateur de sûreté événementielle",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-071",
    "title": "Responsable de protection des travailleurs",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-072",
    "title": "Analyste de risques environnementaux",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-073",
    "title": "Responsable de prévention des intrusions",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-074",
    "title": "Gestionnaire de plan de crise",
    "familyId": "family-19",
    "sourceGroup": "Sécurité",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-066",
    "title": "Coordinateur de programme de lutte contre l’exclusion",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-067",
    "title": "Responsable de programme d’aide aux personnes déplacées",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-068",
    "title": "Chargé de soutien aux aidants",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-069",
    "title": "Gestionnaire de centre d’accompagnement social",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-070",
    "title": "Responsable de programme d’accès à l’éducation",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-071",
    "title": "Coordinateur de réseau associatif",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-072",
    "title": "Responsable de programme de médiation familiale",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-073",
    "title": "Chargé d’accompagnement des personnes vulnérables",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-074",
    "title": "Gestionnaire de fonds associatif",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-075",
    "title": "Responsable de programme de cohésion sociale",
    "familyId": "family-20",
    "sourceGroup": "Famille",
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-075",
    "title": "Andrologue",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "sectorIds": ["S01-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-076",
    "title": "Angiologue",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "sectorIds": ["S01-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-077",
    "title": "Médecin scolaire",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "sectorIds": ["S01-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-078",
    "title": "Oto-rhino-laryngologiste",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "sectorIds": ["S01-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-079",
    "title": "Psychomotricien",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "sectorIds": ["S01-03"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-080",
    "title": "Orthoptiste",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "sectorIds": ["S01-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-081",
    "title": "Prothésiste dentaire",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "sectorIds": ["S01-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-082",
    "title": "Assistant dentaire",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "sectorIds": ["S01-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-083",
    "title": "Hygiéniste dentaire",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "sectorIds": ["S01-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-084",
    "title": "Technicien en électroradiologie",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "sectorIds": ["S01-05"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-085",
    "title": "Brancardier",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "sectorIds": ["S01-03"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-086",
    "title": "Agent de stérilisation",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "sectorIds": ["S01-05"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-087",
    "title": "Secrétaire de laboratoire",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "sectorIds": ["S01-05"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-088",
    "title": "Gestionnaire de centre de dialyse",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "sectorIds": ["S01-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-01-089",
    "title": "Responsable de bloc opératoire",
    "familyId": "family-01",
    "sourceGroup": "Santé",
    "sectorIds": ["S01-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-075",
    "title": "Entraîneur de boxe",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "sectorIds": ["S02-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-076",
    "title": "Entraîneur de taekwondo",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "sectorIds": ["S02-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-077",
    "title": "Entraîneur de karaté",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "sectorIds": ["S02-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-078",
    "title": "Entraîneur d’athlétisme",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "sectorIds": ["S02-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-079",
    "title": "Entraîneur d’équitation",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "sectorIds": ["S02-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-080",
    "title": "Moniteur d’aquagym",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "sectorIds": ["S02-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-081",
    "title": "Moniteur de randonnée",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "sectorIds": ["S02-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-082",
    "title": "Guide de montagne",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "sectorIds": ["S02-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-083",
    "title": "Analyste vidéo sportif",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "sectorIds": ["S02-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-084",
    "title": "Agent de joueur",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "sectorIds": ["S02-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-085",
    "title": "Scout sportif",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "sectorIds": ["S02-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-086",
    "title": "Responsable de billetterie sportive",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "sectorIds": ["S02-04"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-087",
    "title": "Responsable antidopage",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "sectorIds": ["S02-04"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-088",
    "title": "Kinésithérapeute du sport",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "sectorIds": ["S02-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-089",
    "title": "Diététicien du sport",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "sectorIds": ["S02-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-090",
    "title": "Responsable de piscine",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "sectorIds": ["S02-05"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-091",
    "title": "Organisateur de tournoi amateur",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "sectorIds": ["S02-04"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-092",
    "title": "Responsable de parcours de golf",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "sectorIds": ["S02-05"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-02-093",
    "title": "Animateur de loisirs nautiques",
    "familyId": "family-02",
    "sourceGroup": "Sport",
    "sectorIds": ["S02-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-075",
    "title": "Poissonnier-écailler producteur",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "sectorIds": ["S03-04"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-076",
    "title": "Pêcheur artisanal",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "sectorIds": ["S03-04"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-077",
    "title": "Pêcheur hauturier",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "sectorIds": ["S03-04"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-078",
    "title": "Aquaculteur",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "sectorIds": ["S03-04"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-079",
    "title": "Ostréiculteur",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "sectorIds": ["S03-04"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-080",
    "title": "Mytiliculteur",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "sectorIds": ["S03-04"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-081",
    "title": "Conchyliculteur",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "sectorIds": ["S03-04"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-082",
    "title": "Technicien d’écloserie aquacole",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "sectorIds": ["S03-04"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-083",
    "title": "Responsable de couvoir avicole",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "sectorIds": ["S03-03"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-084",
    "title": "Éleveur porcin",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "sectorIds": ["S03-03"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-085",
    "title": "Éleveur ovin",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "sectorIds": ["S03-03"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-086",
    "title": "Éleveur caprin",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "sectorIds": ["S03-03"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-087",
    "title": "Horticulteur",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "sectorIds": ["S03-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-088",
    "title": "Viticulteur",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "sectorIds": ["S03-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-089",
    "title": "Technicien phytosanitaire",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "sectorIds": ["S03-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-090",
    "title": "Irrigateur agricole",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "sectorIds": ["S03-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-091",
    "title": "Responsable de silo céréalier",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "sectorIds": ["S03-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-092",
    "title": "Agent de collecte de lait",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "sectorIds": ["S03-03"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-03-093",
    "title": "Technicien d’insémination animale",
    "familyId": "family-03",
    "sourceGroup": "Agriculture",
    "sectorIds": ["S03-03"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-075",
    "title": "Boulanger vendeur",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "sectorIds": ["S04-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-076",
    "title": "Primeur",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "sectorIds": ["S04-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-077",
    "title": "Fleuriste commerçant",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "sectorIds": ["S04-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-078",
    "title": "Libraire",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "sectorIds": ["S04-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-079",
    "title": "Papetier",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "sectorIds": ["S04-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-080",
    "title": "Mercier",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "sectorIds": ["S04-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-081",
    "title": "Quincaillier",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "sectorIds": ["S04-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-082",
    "title": "Droguiste",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "sectorIds": ["S04-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-083",
    "title": "Opticien-lunetier commerçant",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "sectorIds": ["S04-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-084",
    "title": "Bijoutier vendeur",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "sectorIds": ["S04-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-085",
    "title": "Fripier",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "sectorIds": ["S04-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-086",
    "title": "Vendeur de tissus",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "sectorIds": ["S04-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-087",
    "title": "Vendeur de pièces détachées",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "sectorIds": ["S04-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-088",
    "title": "Vendeur de matériel informatique",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "sectorIds": ["S04-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-089",
    "title": "Vendeur de téléphones mobiles",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "sectorIds": ["S04-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-090",
    "title": "Commerçant grossiste",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "sectorIds": ["S04-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-091",
    "title": "Détaillant alimentaire",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "sectorIds": ["S04-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-092",
    "title": "Responsable de caisse de supermarché",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "sectorIds": ["S04-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-093",
    "title": "Chef de rayon frais",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "sectorIds": ["S04-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-094",
    "title": "Chef de rayon textile",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "sectorIds": ["S04-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-095",
    "title": "Responsable de marché couvert",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "sectorIds": ["S04-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-096",
    "title": "Gestionnaire de boutique en ligne",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "sectorIds": ["S04-03"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-097",
    "title": "Responsable de point de vente",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "sectorIds": ["S04-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-04-098",
    "title": "Gestionnaire de retours e-commerce",
    "familyId": "family-04",
    "sourceGroup": "Commerce",
    "sectorIds": ["S04-03"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-075",
    "title": "Comptable clients",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "sectorIds": ["S05-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-076",
    "title": "Comptable de paie",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "sectorIds": ["S05-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-077",
    "title": "Comptable matières",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "sectorIds": ["S05-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-078",
    "title": "Contrôleur de gestion industriel",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "sectorIds": ["S05-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-079",
    "title": "Contrôleur de gestion commercial",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "sectorIds": ["S05-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-080",
    "title": "Trésorier d’entreprise",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "sectorIds": ["S05-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-081",
    "title": "Gestionnaire de caisse",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "sectorIds": ["S05-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-082",
    "title": "Analyste crédit PME",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "sectorIds": ["S05-03"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-083",
    "title": "Gestionnaire de portefeuille bancaire",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "sectorIds": ["S05-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-084",
    "title": "Conseiller clientèle bancaire",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "sectorIds": ["S05-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-085",
    "title": "Opérateur de microfinance",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "sectorIds": ["S05-03"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-086",
    "title": "Gestionnaire de microcrédit",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "sectorIds": ["S05-03"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-087",
    "title": "Courtier en assurance",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "sectorIds": ["S05-04"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-088",
    "title": "Agent général d’assurance",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "sectorIds": ["S05-04"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-089",
    "title": "Expert en évaluation de dommages",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "sectorIds": ["S05-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-090",
    "title": "Conseiller fiscal",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "sectorIds": ["S05-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-091",
    "title": "Déclarant fiscal",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "sectorIds": ["S05-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-05-092",
    "title": "Responsable de budget",
    "familyId": "family-05",
    "sourceGroup": "Finance",
    "sectorIds": ["S05-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-075",
    "title": "Directeur général de PME",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat et gestion",
    "sectorIds": ["S06-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-076",
    "title": "Directeur de production",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat et gestion",
    "sectorIds": ["S06-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-077",
    "title": "Directeur de magasin",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat et gestion",
    "sectorIds": ["S06-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-078",
    "title": "Gérant de société",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat et gestion",
    "sectorIds": ["S06-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-079",
    "title": "Gérant de coopérative",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat et gestion",
    "sectorIds": ["S06-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-080",
    "title": "Entrepreneur individuel",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat et gestion",
    "sectorIds": ["S06-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-081",
    "title": "Créateur de startup",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat et gestion",
    "sectorIds": ["S06-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-082",
    "title": "Chef de projet d’entreprise",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat et gestion",
    "sectorIds": ["S06-03"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-083",
    "title": "Gestionnaire de programme",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat et gestion",
    "sectorIds": ["S06-03"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-084",
    "title": "Responsable de la qualité",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat et gestion",
    "sectorIds": ["S06-05"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-085",
    "title": "Responsable des achats",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat et gestion",
    "sectorIds": ["S06-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-086",
    "title": "Acheteur professionnel",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat et gestion",
    "sectorIds": ["S06-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-087",
    "title": "Gestionnaire des fournisseurs",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat et gestion",
    "sectorIds": ["S06-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-088",
    "title": "Responsable des moyens généraux",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat et gestion",
    "sectorIds": ["S06-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-089",
    "title": "Secrétaire de direction",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat et gestion",
    "sectorIds": ["S06-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-090",
    "title": "Responsable de développement commercial",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat et gestion",
    "sectorIds": ["S06-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-091",
    "title": "Chargé d’études économiques",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat et gestion",
    "sectorIds": ["S06-04"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-092",
    "title": "Analyste de processus",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat et gestion",
    "sectorIds": ["S06-05"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-093",
    "title": "Responsable de continuité d’activité",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat et gestion",
    "sectorIds": ["S06-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-094",
    "title": "Administrateur de PME",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat et gestion",
    "sectorIds": ["S06-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-06-095",
    "title": "Gestionnaire de partenariats",
    "familyId": "family-06",
    "sourceGroup": "Entrepreneuriat et gestion",
    "sectorIds": ["S06-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-075",
    "title": "Architecte d’intérieur",
    "familyId": "family-07",
    "sourceGroup": "Immobilier et BTP",
    "sectorIds": ["S07-03"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-076",
    "title": "Architecte paysagiste",
    "familyId": "family-07",
    "sourceGroup": "Immobilier et BTP",
    "sectorIds": ["S07-03"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-077",
    "title": "Géomètre-expert",
    "familyId": "family-07",
    "sourceGroup": "Immobilier et BTP",
    "sectorIds": ["S07-03"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-078",
    "title": "Paysagiste concepteur",
    "familyId": "family-07",
    "sourceGroup": "Immobilier et BTP",
    "sectorIds": ["S07-03"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-079",
    "title": "Coffreur-bancheur",
    "familyId": "family-07",
    "sourceGroup": "Immobilier et BTP",
    "sectorIds": ["S07-04"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-080",
    "title": "Ferrailleur",
    "familyId": "family-07",
    "sourceGroup": "Immobilier et BTP",
    "sectorIds": ["S07-04"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-081",
    "title": "Plâtrier",
    "familyId": "family-07",
    "sourceGroup": "Immobilier et BTP",
    "sectorIds": ["S07-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-082",
    "title": "Plaquiste",
    "familyId": "family-07",
    "sourceGroup": "Immobilier et BTP",
    "sectorIds": ["S07-04"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-083",
    "title": "Peintre en bâtiment",
    "familyId": "family-07",
    "sourceGroup": "Immobilier et BTP",
    "sectorIds": ["S07-04"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-084",
    "title": "Menuisier bâtiment",
    "familyId": "family-07",
    "sourceGroup": "Immobilier et BTP",
    "sectorIds": ["S07-04"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-085",
    "title": "Plombier sanitaire",
    "familyId": "family-07",
    "sourceGroup": "Immobilier et BTP",
    "sectorIds": ["S07-04"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-086",
    "title": "Climaticien frigoriste",
    "familyId": "family-07",
    "sourceGroup": "Immobilier et BTP",
    "sectorIds": ["S07-04"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-087",
    "title": "Conducteur de travaux",
    "familyId": "family-07",
    "sourceGroup": "Immobilier et BTP",
    "sectorIds": ["S07-04"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-088",
    "title": "Métreur-vérificateur",
    "familyId": "family-07",
    "sourceGroup": "Immobilier et BTP",
    "sectorIds": ["S07-04"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-089",
    "title": "Administrateur de biens",
    "familyId": "family-07",
    "sourceGroup": "Immobilier et BTP",
    "sectorIds": ["S07-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-090",
    "title": "Syndic de copropriété",
    "familyId": "family-07",
    "sourceGroup": "Immobilier et BTP",
    "sectorIds": ["S07-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-07-091",
    "title": "Dessinateur-projeteur bâtiment",
    "familyId": "family-07",
    "sourceGroup": "Immobilier et BTP",
    "sectorIds": ["S07-03"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-075",
    "title": "Instituteur",
    "familyId": "family-08",
    "sourceGroup": "Éducation et formation",
    "sectorIds": ["S08-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-076",
    "title": "Professeur des écoles",
    "familyId": "family-08",
    "sourceGroup": "Éducation et formation",
    "sectorIds": ["S08-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-077",
    "title": "Professeur de sciences physiques",
    "familyId": "family-08",
    "sourceGroup": "Éducation et formation",
    "sectorIds": ["S08-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-078",
    "title": "Professeur de SVT",
    "familyId": "family-08",
    "sourceGroup": "Éducation et formation",
    "sectorIds": ["S08-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-079",
    "title": "Professeur d’informatique",
    "familyId": "family-08",
    "sourceGroup": "Éducation et formation",
    "sectorIds": ["S08-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-080",
    "title": "Formateur en bureautique",
    "familyId": "family-08",
    "sourceGroup": "Éducation et formation",
    "sectorIds": ["S08-03"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-081",
    "title": "Formateur en sécurité",
    "familyId": "family-08",
    "sourceGroup": "Éducation et formation",
    "sectorIds": ["S08-03"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-082",
    "title": "Formateur technique industriel",
    "familyId": "family-08",
    "sourceGroup": "Éducation et formation",
    "sectorIds": ["S08-03"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-083",
    "title": "Moniteur d’auto-école",
    "familyId": "family-08",
    "sourceGroup": "Éducation et formation",
    "sectorIds": ["S08-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-084",
    "title": "Conseiller principal d’éducation",
    "familyId": "family-08",
    "sourceGroup": "Éducation et formation",
    "sectorIds": ["S08-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-085",
    "title": "Bibliothécaire scolaire",
    "familyId": "family-08",
    "sourceGroup": "Éducation et formation",
    "sectorIds": ["S08-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-086",
    "title": "Ingénieur pédagogique",
    "familyId": "family-08",
    "sourceGroup": "Éducation et formation",
    "sectorIds": ["S08-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-087",
    "title": "Concepteur de cours numériques",
    "familyId": "family-08",
    "sourceGroup": "Éducation et formation",
    "sectorIds": ["S08-04"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-088",
    "title": "Tuteur en ligne",
    "familyId": "family-08",
    "sourceGroup": "Éducation et formation",
    "sectorIds": ["S08-04"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-089",
    "title": "Correcteur d’examens",
    "familyId": "family-08",
    "sourceGroup": "Éducation et formation",
    "sectorIds": ["S08-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-090",
    "title": "Conseiller d’orientation scolaire",
    "familyId": "family-08",
    "sourceGroup": "Éducation et formation",
    "sectorIds": ["S08-05"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-091",
    "title": "Responsable d’examens",
    "familyId": "family-08",
    "sourceGroup": "Éducation et formation",
    "sectorIds": ["S08-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-092",
    "title": "Gestionnaire de cantine scolaire",
    "familyId": "family-08",
    "sourceGroup": "Éducation et formation",
    "sectorIds": ["S08-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-08-093",
    "title": "Responsable d’internat",
    "familyId": "family-08",
    "sourceGroup": "Éducation et formation",
    "sectorIds": ["S08-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-075",
    "title": "Chauffeur de taxi",
    "familyId": "family-09",
    "sourceGroup": "Transport et logistique",
    "sectorIds": ["S09-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-076",
    "title": "Conducteur de car scolaire",
    "familyId": "family-09",
    "sourceGroup": "Transport et logistique",
    "sectorIds": ["S09-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-077",
    "title": "Conducteur de poids lourd",
    "familyId": "family-09",
    "sourceGroup": "Transport et logistique",
    "sectorIds": ["S09-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-078",
    "title": "Chauffeur-livreur",
    "familyId": "family-09",
    "sourceGroup": "Transport et logistique",
    "sectorIds": ["S09-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-079",
    "title": "Conducteur de camion-citerne",
    "familyId": "family-09",
    "sourceGroup": "Transport et logistique",
    "sectorIds": ["S09-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-080",
    "title": "Pilote d’hélicoptère",
    "familyId": "family-09",
    "sourceGroup": "Transport et logistique",
    "sectorIds": ["S09-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-081",
    "title": "Personnel navigant commercial",
    "familyId": "family-09",
    "sourceGroup": "Transport et logistique",
    "sectorIds": ["S09-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-082",
    "title": "Agent d’escale aéroportuaire",
    "familyId": "family-09",
    "sourceGroup": "Transport et logistique",
    "sectorIds": ["S09-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-083",
    "title": "Officier de marine marchande",
    "familyId": "family-09",
    "sourceGroup": "Transport et logistique",
    "sectorIds": ["S09-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-084",
    "title": "Docker",
    "familyId": "family-09",
    "sourceGroup": "Transport et logistique",
    "sectorIds": ["S09-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-085",
    "title": "Magasinier cariste",
    "familyId": "family-09",
    "sourceGroup": "Transport et logistique",
    "sectorIds": ["S09-03"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-086",
    "title": "Gestionnaire d’entrepôt",
    "familyId": "family-09",
    "sourceGroup": "Transport et logistique",
    "sectorIds": ["S09-03"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-087",
    "title": "Commissionnaire de transport",
    "familyId": "family-09",
    "sourceGroup": "Transport et logistique",
    "sectorIds": ["S09-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-088",
    "title": "Transitaire",
    "familyId": "family-09",
    "sourceGroup": "Transport et logistique",
    "sectorIds": ["S09-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-089",
    "title": "Agent de billetterie ferroviaire",
    "familyId": "family-09",
    "sourceGroup": "Transport et logistique",
    "sectorIds": ["S09-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-090",
    "title": "Agent de billetterie aérienne",
    "familyId": "family-09",
    "sourceGroup": "Transport et logistique",
    "sectorIds": ["S09-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-091",
    "title": "Régulateur de transport",
    "familyId": "family-09",
    "sourceGroup": "Transport et logistique",
    "sectorIds": ["S09-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-092",
    "title": "Planificateur de tournées",
    "familyId": "family-09",
    "sourceGroup": "Transport et logistique",
    "sectorIds": ["S09-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-093",
    "title": "Coursier à vélo",
    "familyId": "family-09",
    "sourceGroup": "Transport et logistique",
    "sectorIds": ["S09-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-09-094",
    "title": "Gestionnaire de parc automobile",
    "familyId": "family-09",
    "sourceGroup": "Transport et logistique",
    "sectorIds": ["S09-04"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-075",
    "title": "Second de cuisine",
    "familyId": "family-10",
    "sourceGroup": "Restauration et hôtellerie",
    "sectorIds": ["S10-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-076",
    "title": "Chef exécutif",
    "familyId": "family-10",
    "sourceGroup": "Restauration et hôtellerie",
    "sectorIds": ["S10-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-077",
    "title": "Boucher de cuisine",
    "familyId": "family-10",
    "sourceGroup": "Restauration et hôtellerie",
    "sectorIds": ["S10-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-078",
    "title": "Poissonnier de cuisine",
    "familyId": "family-10",
    "sourceGroup": "Restauration et hôtellerie",
    "sectorIds": ["S10-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-079",
    "title": "Serveur en restauration",
    "familyId": "family-10",
    "sourceGroup": "Restauration et hôtellerie",
    "sectorIds": ["S10-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-080",
    "title": "Responsable de restaurant",
    "familyId": "family-10",
    "sourceGroup": "Restauration et hôtellerie",
    "sectorIds": ["S10-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-081",
    "title": "Gérant de bar",
    "familyId": "family-10",
    "sourceGroup": "Restauration et hôtellerie",
    "sectorIds": ["S10-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-082",
    "title": "Plongeur en restauration",
    "familyId": "family-10",
    "sourceGroup": "Restauration et hôtellerie",
    "sectorIds": ["S10-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-083",
    "title": "Employé polyvalent de restauration",
    "familyId": "family-10",
    "sourceGroup": "Restauration et hôtellerie",
    "sectorIds": ["S10-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-084",
    "title": "Responsable de cafétéria",
    "familyId": "family-10",
    "sourceGroup": "Restauration et hôtellerie",
    "sectorIds": ["S10-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-085",
    "title": "Traiteur événementiel",
    "familyId": "family-10",
    "sourceGroup": "Restauration et hôtellerie",
    "sectorIds": ["S10-03"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-086",
    "title": "Réceptionniste d’hôtel",
    "familyId": "family-10",
    "sourceGroup": "Restauration et hôtellerie",
    "sectorIds": ["S10-04"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-087",
    "title": "Gouvernant d’hôtel",
    "familyId": "family-10",
    "sourceGroup": "Restauration et hôtellerie",
    "sectorIds": ["S10-04"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-088",
    "title": "Femme ou valet de chambre",
    "familyId": "family-10",
    "sourceGroup": "Restauration et hôtellerie",
    "sectorIds": ["S10-04"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-089",
    "title": "Concierge d’hôtel",
    "familyId": "family-10",
    "sourceGroup": "Restauration et hôtellerie",
    "sectorIds": ["S10-04"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-090",
    "title": "Bagagiste",
    "familyId": "family-10",
    "sourceGroup": "Restauration et hôtellerie",
    "sectorIds": ["S10-04"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-091",
    "title": "Revenue manager hôtelier",
    "familyId": "family-10",
    "sourceGroup": "Restauration et hôtellerie",
    "sectorIds": ["S10-04"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-092",
    "title": "Responsable réservation hôtelière",
    "familyId": "family-10",
    "sourceGroup": "Restauration et hôtellerie",
    "sectorIds": ["S10-04"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-10-093",
    "title": "Responsable d’hébergement",
    "familyId": "family-10",
    "sourceGroup": "Restauration et hôtellerie",
    "sectorIds": ["S10-04"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-076",
    "title": "Agent de billetterie de spectacle",
    "familyId": "family-11",
    "sourceGroup": "Événementiel, culture et tourisme",
    "sectorIds": ["S11-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-077",
    "title": "Billetiste événementiel",
    "familyId": "family-11",
    "sourceGroup": "Événementiel, culture et tourisme",
    "sectorIds": ["S11-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-078",
    "title": "Billetiste de voyage",
    "familyId": "family-11",
    "sourceGroup": "Événementiel, culture et tourisme",
    "sectorIds": ["S11-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-079",
    "title": "Forfaitiste touristique",
    "familyId": "family-11",
    "sourceGroup": "Événementiel, culture et tourisme",
    "sectorIds": ["S11-03"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-080",
    "title": "Guide-conférencier",
    "familyId": "family-11",
    "sourceGroup": "Événementiel, culture et tourisme",
    "sectorIds": ["S11-03"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-081",
    "title": "Guide touristique local",
    "familyId": "family-11",
    "sourceGroup": "Événementiel, culture et tourisme",
    "sectorIds": ["S11-03"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-082",
    "title": "Accompagnateur de tourisme",
    "familyId": "family-11",
    "sourceGroup": "Événementiel, culture et tourisme",
    "sectorIds": ["S11-03"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-083",
    "title": "Agent d’accueil de musée",
    "familyId": "family-11",
    "sourceGroup": "Événementiel, culture et tourisme",
    "sectorIds": ["S11-05"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-084",
    "title": "Conservateur de musée",
    "familyId": "family-11",
    "sourceGroup": "Événementiel, culture et tourisme",
    "sectorIds": ["S11-05"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-085",
    "title": "Régisseur de spectacle",
    "familyId": "family-11",
    "sourceGroup": "Événementiel, culture et tourisme",
    "sectorIds": ["S11-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-086",
    "title": "Régisseur lumière",
    "familyId": "family-11",
    "sourceGroup": "Événementiel, culture et tourisme",
    "sectorIds": ["S11-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-087",
    "title": "Régisseur son",
    "familyId": "family-11",
    "sourceGroup": "Événementiel, culture et tourisme",
    "sectorIds": ["S11-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-088",
    "title": "Technicien audiovisuel événementiel",
    "familyId": "family-11",
    "sourceGroup": "Événementiel, culture et tourisme",
    "sectorIds": ["S11-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-089",
    "title": "Organisateur de mariage",
    "familyId": "family-11",
    "sourceGroup": "Événementiel, culture et tourisme",
    "sectorIds": ["S11-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-090",
    "title": "Hôte d’accueil événementiel",
    "familyId": "family-11",
    "sourceGroup": "Événementiel, culture et tourisme",
    "sectorIds": ["S11-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-091",
    "title": "Responsable de festival",
    "familyId": "family-11",
    "sourceGroup": "Événementiel, culture et tourisme",
    "sectorIds": ["S11-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-092",
    "title": "Chargé de communication culturelle",
    "familyId": "family-11",
    "sourceGroup": "Événementiel, culture et tourisme",
    "sectorIds": ["S11-05"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-11-093",
    "title": "Responsable de billetterie culturelle",
    "familyId": "family-11",
    "sourceGroup": "Événementiel, culture et tourisme",
    "sectorIds": ["S11-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-075",
    "title": "Responsable des ressources humaines",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "sectorIds": ["S12-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-076",
    "title": "Assistant ressources humaines",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "sectorIds": ["S12-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-077",
    "title": "Consultant en recrutement",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "sectorIds": ["S12-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-078",
    "title": "Chasseur de têtes",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "sectorIds": ["S12-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-079",
    "title": "Gestionnaire de carrière",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "sectorIds": ["S12-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-080",
    "title": "Responsable formation RH",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "sectorIds": ["S12-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-081",
    "title": "Responsable administration du personnel",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "sectorIds": ["S12-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-082",
    "title": "Gestionnaire des temps et activités",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "sectorIds": ["S12-03"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-083",
    "title": "Gestionnaire des congés",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "sectorIds": ["S12-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-084",
    "title": "Gestionnaire de paie RH",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "sectorIds": ["S12-04"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-085",
    "title": "Chargé des relations sociales",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "sectorIds": ["S12-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-086",
    "title": "Responsable de la diversité et inclusion",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "sectorIds": ["S12-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-087",
    "title": "Responsable qualité de vie au travail",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "sectorIds": ["S12-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-088",
    "title": "Ergonome",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "sectorIds": ["S12-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-089",
    "title": "Psychologue du travail",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "sectorIds": ["S12-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-090",
    "title": "Conseiller en insertion professionnelle",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "sectorIds": ["S12-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-091",
    "title": "Chargé d’emploi et compétences",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "sectorIds": ["S12-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-092",
    "title": "Responsable de la marque employeur",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "sectorIds": ["S12-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-093",
    "title": "Gestionnaire des expatriés",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "sectorIds": ["S12-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-094",
    "title": "Responsable des avantages sociaux",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "sectorIds": ["S12-04"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-095",
    "title": "Médiateur en entreprise",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "sectorIds": ["S12-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-096",
    "title": "Responsable de discipline interne",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "sectorIds": ["S12-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-097",
    "title": "Gestionnaire de dossiers du personnel",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "sectorIds": ["S12-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-098",
    "title": "Planificateur des effectifs",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "sectorIds": ["S12-03"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-099",
    "title": "Responsable de sécurité sociale du personnel",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "sectorIds": ["S12-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-100",
    "title": "Consultant en mobilité professionnelle",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "sectorIds": ["S12-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-12-101",
    "title": "Responsable de dialogue social",
    "familyId": "family-12",
    "sourceGroup": "Ressources humaines",
    "sectorIds": ["S12-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-076",
    "title": "Imprimeur sérigraphe",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "sectorIds": ["S13-04"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-077",
    "title": "Mécanographe",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "sectorIds": ["S13-04"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-078",
    "title": "Opérateur de saisie mécanographique",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "sectorIds": ["S13-04"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-079",
    "title": "Technicien en mécanographie",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "sectorIds": ["S13-04"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-080",
    "title": "Typographe",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "sectorIds": ["S13-04"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-081",
    "title": "Conducteur de presse offset",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "sectorIds": ["S13-04"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-082",
    "title": "Imprimeur numérique",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "sectorIds": ["S13-04"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-083",
    "title": "Imprimeur grand format",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "sectorIds": ["S13-04"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-084",
    "title": "Graveur",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "sectorIds": ["S13-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-085",
    "title": "Relieur",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "sectorIds": ["S13-04"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-086",
    "title": "Massicotier",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "sectorIds": ["S13-04"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-087",
    "title": "Façonnier de produits imprimés",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "sectorIds": ["S13-04"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-088",
    "title": "Brocheur",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "sectorIds": ["S13-04"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-089",
    "title": "Reprographe",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "sectorIds": ["S13-04"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-090",
    "title": "Photograveur",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "sectorIds": ["S13-04"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-091",
    "title": "Infographiste prépresse",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "sectorIds": ["S13-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-092",
    "title": "Tailleur-couturier",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "sectorIds": ["S13-03"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-093",
    "title": "Cordonnier",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "sectorIds": ["S13-03"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-094",
    "title": "Bijoutier-joaillier",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "sectorIds": ["S13-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-095",
    "title": "Horloger",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "sectorIds": ["S13-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-096",
    "title": "Potier-céramiste",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "sectorIds": ["S13-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-097",
    "title": "Sculpteur sur bois",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "sectorIds": ["S13-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-098",
    "title": "Menuisier ébéniste",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "sectorIds": ["S13-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-099",
    "title": "Chaudronnier",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "sectorIds": ["S13-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-100",
    "title": "Réparateur d’appareils électroménagers",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "sectorIds": ["S13-05"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-13-101",
    "title": "Technicien de maintenance industrielle",
    "familyId": "family-13",
    "sourceGroup": "Artisanat et industrie",
    "sectorIds": ["S13-05"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-075",
    "title": "Maquilleur professionnel",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "sectorIds": ["S14-03"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-076",
    "title": "Manucure-pédicure",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "sectorIds": ["S14-03"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-077",
    "title": "Spa praticien",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "sectorIds": ["S14-03"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-078",
    "title": "Garde d’enfants à domicile",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "sectorIds": ["S14-05"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-079",
    "title": "Auxiliaire de vie sociale",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "sectorIds": ["S14-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-080",
    "title": "Assistant de personnes âgées",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "sectorIds": ["S14-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-081",
    "title": "Accompagnant éducatif et social",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "sectorIds": ["S14-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-082",
    "title": "Moniteur-éducateur",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "sectorIds": ["S14-05"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-083",
    "title": "Assistant familial",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "sectorIds": ["S14-05"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-084",
    "title": "Conseiller conjugal",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "sectorIds": ["S14-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-085",
    "title": "Agent d’entretien ménager",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "sectorIds": ["S14-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-086",
    "title": "Laveur de vitres",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "sectorIds": ["S14-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-087",
    "title": "Blanchisseur",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "sectorIds": ["S14-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-088",
    "title": "Pressing-nettoyeur",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "sectorIds": ["S14-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-089",
    "title": "Employé de maison",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "sectorIds": ["S14-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-090",
    "title": "Concierge privé",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "sectorIds": ["S14-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-091",
    "title": "Agent funéraire",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "sectorIds": ["S14-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-092",
    "title": "Thanatopracteur",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "sectorIds": ["S14-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-14-093",
    "title": "Maître de cérémonie funéraire",
    "familyId": "family-14",
    "sourceGroup": "Services aux personnes",
    "sectorIds": ["S14-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-076",
    "title": "Assistant administratif",
    "familyId": "family-15",
    "sourceGroup": "Administration et services publics",
    "sectorIds": ["S15-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-077",
    "title": "Agent de mairie",
    "familyId": "family-15",
    "sourceGroup": "Administration et services publics",
    "sectorIds": ["S15-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-078",
    "title": "Secrétaire de mairie",
    "familyId": "family-15",
    "sourceGroup": "Administration et services publics",
    "sectorIds": ["S15-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-079",
    "title": "Agent de recensement",
    "familyId": "family-15",
    "sourceGroup": "Administration et services publics",
    "sectorIds": ["S15-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-080",
    "title": "Agent des impôts",
    "familyId": "family-15",
    "sourceGroup": "Administration et services publics",
    "sectorIds": ["S15-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-081",
    "title": "Contrôleur des impôts",
    "familyId": "family-15",
    "sourceGroup": "Administration et services publics",
    "sectorIds": ["S15-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-082",
    "title": "Agent des douanes",
    "familyId": "family-15",
    "sourceGroup": "Administration et services publics",
    "sectorIds": ["S15-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-083",
    "title": "Contrôleur des douanes",
    "familyId": "family-15",
    "sourceGroup": "Administration et services publics",
    "sectorIds": ["S15-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-084",
    "title": "Agent des services sociaux",
    "familyId": "family-15",
    "sourceGroup": "Administration et services publics",
    "sectorIds": ["S15-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-085",
    "title": "Acheteur public",
    "familyId": "family-15",
    "sourceGroup": "Administration et services publics",
    "sectorIds": ["S15-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-086",
    "title": "Secrétaire juridique public",
    "familyId": "family-15",
    "sourceGroup": "Administration et services publics",
    "sectorIds": ["S15-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-087",
    "title": "Archiviste public",
    "familyId": "family-15",
    "sourceGroup": "Administration et services publics",
    "sectorIds": ["S15-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-088",
    "title": "Documentaliste administratif",
    "familyId": "family-15",
    "sourceGroup": "Administration et services publics",
    "sectorIds": ["S15-05"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-089",
    "title": "Agent de protocole",
    "familyId": "family-15",
    "sourceGroup": "Administration et services publics",
    "sectorIds": ["S15-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-090",
    "title": "Chargé de relation citoyenne",
    "familyId": "family-15",
    "sourceGroup": "Administration et services publics",
    "sectorIds": ["S15-04"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-091",
    "title": "Agent de guichet unique",
    "familyId": "family-15",
    "sourceGroup": "Administration et services publics",
    "sectorIds": ["S15-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-092",
    "title": "Gestionnaire de dossiers de subvention",
    "familyId": "family-15",
    "sourceGroup": "Administration et services publics",
    "sectorIds": ["S15-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-093",
    "title": "Médiateur administratif",
    "familyId": "family-15",
    "sourceGroup": "Administration et services publics",
    "sectorIds": ["S15-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-094",
    "title": "Régisseur de recettes publiques",
    "familyId": "family-15",
    "sourceGroup": "Administration et services publics",
    "sectorIds": ["S15-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-095",
    "title": "Régisseur d’avances",
    "familyId": "family-15",
    "sourceGroup": "Administration et services publics",
    "sectorIds": ["S15-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-096",
    "title": "Contrôleur de gestion publique",
    "familyId": "family-15",
    "sourceGroup": "Administration et services publics",
    "sectorIds": ["S15-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-097",
    "title": "Inspecteur administratif",
    "familyId": "family-15",
    "sourceGroup": "Administration et services publics",
    "sectorIds": ["S15-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-15-098",
    "title": "Agent de protection civile",
    "familyId": "family-15",
    "sourceGroup": "Administration et services publics",
    "sectorIds": ["S15-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-075",
    "title": "Avocat d’affaires",
    "familyId": "family-16",
    "sourceGroup": "Droit et conformité",
    "sectorIds": ["S16-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-076",
    "title": "Avocat en droit social",
    "familyId": "family-16",
    "sourceGroup": "Droit et conformité",
    "sectorIds": ["S16-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-077",
    "title": "Huissier de justice",
    "familyId": "family-16",
    "sourceGroup": "Droit et conformité",
    "sectorIds": ["S16-03"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-078",
    "title": "Magistrat du siège",
    "familyId": "family-16",
    "sourceGroup": "Droit et conformité",
    "sectorIds": ["S16-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-079",
    "title": "Magistrat du parquet",
    "familyId": "family-16",
    "sourceGroup": "Droit et conformité",
    "sectorIds": ["S16-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-080",
    "title": "Juge d’instruction",
    "familyId": "family-16",
    "sourceGroup": "Droit et conformité",
    "sectorIds": ["S16-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-081",
    "title": "Procureur",
    "familyId": "family-16",
    "sourceGroup": "Droit et conformité",
    "sectorIds": ["S16-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-082",
    "title": "Juriste en droit du travail",
    "familyId": "family-16",
    "sourceGroup": "Droit et conformité",
    "sectorIds": ["S16-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-083",
    "title": "Conseil en propriété industrielle",
    "familyId": "family-16",
    "sourceGroup": "Droit et conformité",
    "sectorIds": ["S16-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-084",
    "title": "Médiateur judiciaire",
    "familyId": "family-16",
    "sourceGroup": "Droit et conformité",
    "sectorIds": ["S16-04"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-085",
    "title": "Arbitre commercial",
    "familyId": "family-16",
    "sourceGroup": "Droit et conformité",
    "sectorIds": ["S16-04"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-086",
    "title": "Commissaire-priseur",
    "familyId": "family-16",
    "sourceGroup": "Droit et conformité",
    "sectorIds": ["S16-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-16-087",
    "title": "Administrateur judiciaire",
    "familyId": "family-16",
    "sourceGroup": "Droit et conformité",
    "sectorIds": ["S16-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-075",
    "title": "Développeur logiciel",
    "familyId": "family-17",
    "sourceGroup": "Numérique et télécommunications",
    "sectorIds": ["S17-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-076",
    "title": "Intégrateur web",
    "familyId": "family-17",
    "sourceGroup": "Numérique et télécommunications",
    "sectorIds": ["S17-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-077",
    "title": "Webmaster",
    "familyId": "family-17",
    "sourceGroup": "Numérique et télécommunications",
    "sectorIds": ["S17-04"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-078",
    "title": "Administrateur systèmes",
    "familyId": "family-17",
    "sourceGroup": "Numérique et télécommunications",
    "sectorIds": ["S17-03"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-079",
    "title": "Administrateur bases de données",
    "familyId": "family-17",
    "sourceGroup": "Numérique et télécommunications",
    "sectorIds": ["S17-05"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-080",
    "title": "Technicien helpdesk",
    "familyId": "family-17",
    "sourceGroup": "Numérique et télécommunications",
    "sectorIds": ["S17-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-081",
    "title": "Technicien fibre optique",
    "familyId": "family-17",
    "sourceGroup": "Numérique et télécommunications",
    "sectorIds": ["S17-03"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-082",
    "title": "Installateur télécoms",
    "familyId": "family-17",
    "sourceGroup": "Numérique et télécommunications",
    "sectorIds": ["S17-03"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-083",
    "title": "Technicien radio",
    "familyId": "family-17",
    "sourceGroup": "Numérique et télécommunications",
    "sectorIds": ["S17-03"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-084",
    "title": "Ingénieur télécommunications",
    "familyId": "family-17",
    "sourceGroup": "Numérique et télécommunications",
    "sectorIds": ["S17-03"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-085",
    "title": "Pentester",
    "familyId": "family-17",
    "sourceGroup": "Numérique et télécommunications",
    "sectorIds": ["S17-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-086",
    "title": "Analyste SOC",
    "familyId": "family-17",
    "sourceGroup": "Numérique et télécommunications",
    "sectorIds": ["S17-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-087",
    "title": "Data analyst",
    "familyId": "family-17",
    "sourceGroup": "Numérique et télécommunications",
    "sectorIds": ["S17-05"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-088",
    "title": "Data scientist",
    "familyId": "family-17",
    "sourceGroup": "Numérique et télécommunications",
    "sectorIds": ["S17-05"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-089",
    "title": "Spécialiste intelligence artificielle",
    "familyId": "family-17",
    "sourceGroup": "Numérique et télécommunications",
    "sectorIds": ["S17-05"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-090",
    "title": "Concepteur UX",
    "familyId": "family-17",
    "sourceGroup": "Numérique et télécommunications",
    "sectorIds": ["S17-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-091",
    "title": "Designer UI",
    "familyId": "family-17",
    "sourceGroup": "Numérique et télécommunications",
    "sectorIds": ["S17-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-092",
    "title": "Monteur vidéo numérique",
    "familyId": "family-17",
    "sourceGroup": "Numérique et télécommunications",
    "sectorIds": ["S17-04"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-093",
    "title": "Technicien de maintenance informatique",
    "familyId": "family-17",
    "sourceGroup": "Numérique et télécommunications",
    "sectorIds": ["S17-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-17-094",
    "title": "Opérateur de saisie de données",
    "familyId": "family-17",
    "sourceGroup": "Numérique et télécommunications",
    "sectorIds": ["S17-05"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-075",
    "title": "Électricien réseau",
    "familyId": "family-18",
    "sourceGroup": "Énergie, eau et environnement",
    "sectorIds": ["S18-03"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-076",
    "title": "Électricien photovoltaïque",
    "familyId": "family-18",
    "sourceGroup": "Énergie, eau et environnement",
    "sectorIds": ["S18-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-077",
    "title": "Technicien solaire thermique",
    "familyId": "family-18",
    "sourceGroup": "Énergie, eau et environnement",
    "sectorIds": ["S18-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-078",
    "title": "Ingénieur en énergies renouvelables",
    "familyId": "family-18",
    "sourceGroup": "Énergie, eau et environnement",
    "sectorIds": ["S18-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-079",
    "title": "Technicien de centrale électrique",
    "familyId": "family-18",
    "sourceGroup": "Énergie, eau et environnement",
    "sectorIds": ["S18-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-080",
    "title": "Agent de conduite de réseau électrique",
    "familyId": "family-18",
    "sourceGroup": "Énergie, eau et environnement",
    "sectorIds": ["S18-03"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-081",
    "title": "Plombier réseau d’eau",
    "familyId": "family-18",
    "sourceGroup": "Énergie, eau et environnement",
    "sectorIds": ["S18-03"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-082",
    "title": "Agent de relève de compteurs",
    "familyId": "family-18",
    "sourceGroup": "Énergie, eau et environnement",
    "sectorIds": ["S18-03"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-083",
    "title": "Technicien de station d’épuration",
    "familyId": "family-18",
    "sourceGroup": "Énergie, eau et environnement",
    "sectorIds": ["S18-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-084",
    "title": "Agent d’assainissement",
    "familyId": "family-18",
    "sourceGroup": "Énergie, eau et environnement",
    "sectorIds": ["S18-04"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-085",
    "title": "Technicien de laboratoire environnemental",
    "familyId": "family-18",
    "sourceGroup": "Énergie, eau et environnement",
    "sectorIds": ["S18-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-086",
    "title": "Écologue",
    "familyId": "family-18",
    "sourceGroup": "Énergie, eau et environnement",
    "sectorIds": ["S18-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-087",
    "title": "Garde forestier",
    "familyId": "family-18",
    "sourceGroup": "Énergie, eau et environnement",
    "sectorIds": ["S18-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-088",
    "title": "Agent des eaux et forêts",
    "familyId": "family-18",
    "sourceGroup": "Énergie, eau et environnement",
    "sectorIds": ["S18-03"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-089",
    "title": "Technicien forestier",
    "familyId": "family-18",
    "sourceGroup": "Énergie, eau et environnement",
    "sectorIds": ["S18-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-090",
    "title": "Gestionnaire de déchets",
    "familyId": "family-18",
    "sourceGroup": "Énergie, eau et environnement",
    "sectorIds": ["S18-04"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-091",
    "title": "Agent de collecte des déchets",
    "familyId": "family-18",
    "sourceGroup": "Énergie, eau et environnement",
    "sectorIds": ["S18-04"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-092",
    "title": "Conducteur de centre d’enfouissement",
    "familyId": "family-18",
    "sourceGroup": "Énergie, eau et environnement",
    "sectorIds": ["S18-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-093",
    "title": "Responsable de recyclage",
    "familyId": "family-18",
    "sourceGroup": "Énergie, eau et environnement",
    "sectorIds": ["S18-04"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-094",
    "title": "Technicien en compostage",
    "familyId": "family-18",
    "sourceGroup": "Énergie, eau et environnement",
    "sectorIds": ["S18-04"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-095",
    "title": "Inspecteur environnemental",
    "familyId": "family-18",
    "sourceGroup": "Énergie, eau et environnement",
    "sectorIds": ["S18-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-096",
    "title": "Responsable hygiène et assainissement",
    "familyId": "family-18",
    "sourceGroup": "Énergie, eau et environnement",
    "sectorIds": ["S18-04"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-097",
    "title": "Technicien de qualité de l’air",
    "familyId": "family-18",
    "sourceGroup": "Énergie, eau et environnement",
    "sectorIds": ["S18-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-098",
    "title": "Technicien de qualité de l’eau",
    "familyId": "family-18",
    "sourceGroup": "Énergie, eau et environnement",
    "sectorIds": ["S18-03"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-099",
    "title": "Agent de lutte antipollution",
    "familyId": "family-18",
    "sourceGroup": "Énergie, eau et environnement",
    "sectorIds": ["S18-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-100",
    "title": "Conseiller en efficacité énergétique",
    "familyId": "family-18",
    "sourceGroup": "Énergie, eau et environnement",
    "sectorIds": ["S18-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-18-101",
    "title": "Auditeur énergétique",
    "familyId": "family-18",
    "sourceGroup": "Énergie, eau et environnement",
    "sectorIds": ["S18-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-075",
    "title": "Agent de gardiennage",
    "familyId": "family-19",
    "sourceGroup": "Sécurité et gestion des risques",
    "sectorIds": ["S19-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-076",
    "title": "Chef de poste de sécurité",
    "familyId": "family-19",
    "sourceGroup": "Sécurité et gestion des risques",
    "sectorIds": ["S19-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-077",
    "title": "Chef d’équipe de sécurité",
    "familyId": "family-19",
    "sourceGroup": "Sécurité et gestion des risques",
    "sectorIds": ["S19-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-078",
    "title": "Sapeur-pompier",
    "familyId": "family-19",
    "sourceGroup": "Sécurité et gestion des risques",
    "sectorIds": ["S19-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-079",
    "title": "Garde du corps",
    "familyId": "family-19",
    "sourceGroup": "Sécurité et gestion des risques",
    "sectorIds": ["S19-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-080",
    "title": "Agent de sûreté portuaire",
    "familyId": "family-19",
    "sourceGroup": "Sécurité et gestion des risques",
    "sectorIds": ["S19-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-081",
    "title": "Agent de sécurité événementielle",
    "familyId": "family-19",
    "sourceGroup": "Sécurité et gestion des risques",
    "sectorIds": ["S19-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-082",
    "title": "Opérateur de vidéosurveillance",
    "familyId": "family-19",
    "sourceGroup": "Sécurité et gestion des risques",
    "sectorIds": ["S19-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-083",
    "title": "Opérateur de centre d’alarme",
    "familyId": "family-19",
    "sourceGroup": "Sécurité et gestion des risques",
    "sectorIds": ["S19-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-084",
    "title": "Installateur de systèmes d’alarme",
    "familyId": "family-19",
    "sourceGroup": "Sécurité et gestion des risques",
    "sectorIds": ["S19-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-085",
    "title": "Technicien de sécurité incendie",
    "familyId": "family-19",
    "sourceGroup": "Sécurité et gestion des risques",
    "sectorIds": ["S19-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-086",
    "title": "Responsable sécurité site",
    "familyId": "family-19",
    "sourceGroup": "Sécurité et gestion des risques",
    "sectorIds": ["S19-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-087",
    "title": "Responsable santé-sécurité au travail",
    "familyId": "family-19",
    "sourceGroup": "Sécurité et gestion des risques",
    "sectorIds": ["S19-03"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-088",
    "title": "Préventeur HSE",
    "familyId": "family-19",
    "sourceGroup": "Sécurité et gestion des risques",
    "sectorIds": ["S19-03"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-089",
    "title": "Risk manager",
    "familyId": "family-19",
    "sourceGroup": "Sécurité et gestion des risques",
    "sectorIds": ["S19-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-090",
    "title": "Auditeur de sûreté",
    "familyId": "family-19",
    "sourceGroup": "Sécurité et gestion des risques",
    "sectorIds": ["S19-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-091",
    "title": "Enquêteur privé agréé",
    "familyId": "family-19",
    "sourceGroup": "Sécurité et gestion des risques",
    "sectorIds": ["S19-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-092",
    "title": "Secouriste",
    "familyId": "family-19",
    "sourceGroup": "Sécurité et gestion des risques",
    "sectorIds": ["S19-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-093",
    "title": "Responsable de gestion de crise",
    "familyId": "family-19",
    "sourceGroup": "Sécurité et gestion des risques",
    "sectorIds": ["S19-03"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-094",
    "title": "Spécialiste de continuité d’activité",
    "familyId": "family-19",
    "sourceGroup": "Sécurité et gestion des risques",
    "sectorIds": ["S19-03"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-19-095",
    "title": "Agent de prévention des pertes",
    "familyId": "family-19",
    "sourceGroup": "Sécurité et gestion des risques",
    "sectorIds": ["S19-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-076",
    "title": "Éducateur communautaire",
    "familyId": "family-20",
    "sourceGroup": "Famille, vie personnelle et solidarité",
    "sectorIds": ["S20-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-077",
    "title": "Animateur socioculturel",
    "familyId": "family-20",
    "sourceGroup": "Famille, vie personnelle et solidarité",
    "sectorIds": ["S20-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-078",
    "title": "Médiateur communautaire",
    "familyId": "family-20",
    "sourceGroup": "Famille, vie personnelle et solidarité",
    "sectorIds": ["S20-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-079",
    "title": "Conseiller en économie sociale et familiale",
    "familyId": "family-20",
    "sourceGroup": "Famille, vie personnelle et solidarité",
    "sectorIds": ["S20-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-080",
    "title": "Coordinateur associatif",
    "familyId": "family-20",
    "sourceGroup": "Famille, vie personnelle et solidarité",
    "sectorIds": ["S20-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-081",
    "title": "Directeur d’association",
    "familyId": "family-20",
    "sourceGroup": "Famille, vie personnelle et solidarité",
    "sectorIds": ["S20-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-082",
    "title": "Responsable de bénévolat",
    "familyId": "family-20",
    "sourceGroup": "Famille, vie personnelle et solidarité",
    "sectorIds": ["S20-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-083",
    "title": "Chargé de collecte de fonds",
    "familyId": "family-20",
    "sourceGroup": "Famille, vie personnelle et solidarité",
    "sectorIds": ["S20-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-084",
    "title": "Responsable de plaidoyer",
    "familyId": "family-20",
    "sourceGroup": "Famille, vie personnelle et solidarité",
    "sectorIds": ["S20-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-085",
    "title": "Agent de développement communautaire",
    "familyId": "family-20",
    "sourceGroup": "Famille, vie personnelle et solidarité",
    "sectorIds": ["S20-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-086",
    "title": "Accompagnateur de personnes réfugiées",
    "familyId": "family-20",
    "sourceGroup": "Famille, vie personnelle et solidarité",
    "sectorIds": ["S20-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-087",
    "title": "Intervenant en protection de l’enfance",
    "familyId": "family-20",
    "sourceGroup": "Famille, vie personnelle et solidarité",
    "sectorIds": ["S20-05"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-088",
    "title": "Conseiller en aide aux victimes",
    "familyId": "family-20",
    "sourceGroup": "Famille, vie personnelle et solidarité",
    "sectorIds": ["S20-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-089",
    "title": "Responsable de centre d’hébergement",
    "familyId": "family-20",
    "sourceGroup": "Famille, vie personnelle et solidarité",
    "sectorIds": ["S20-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-090",
    "title": "Gestionnaire de banque alimentaire",
    "familyId": "family-20",
    "sourceGroup": "Famille, vie personnelle et solidarité",
    "sectorIds": ["S20-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-091",
    "title": "Conseiller en parentalité",
    "familyId": "family-20",
    "sourceGroup": "Famille, vie personnelle et solidarité",
    "sectorIds": ["S20-05"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-092",
    "title": "Accompagnateur de jeunes",
    "familyId": "family-20",
    "sourceGroup": "Famille, vie personnelle et solidarité",
    "sectorIds": ["S20-05"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-093",
    "title": "Responsable de programme de solidarité",
    "familyId": "family-20",
    "sourceGroup": "Famille, vie personnelle et solidarité",
    "sectorIds": ["S20-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-094",
    "title": "Chargé de mobilisation citoyenne",
    "familyId": "family-20",
    "sourceGroup": "Famille, vie personnelle et solidarité",
    "sectorIds": ["S20-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-095",
    "title": "Coordinateur de visite à domicile",
    "familyId": "family-20",
    "sourceGroup": "Famille, vie personnelle et solidarité",
    "sectorIds": ["S20-01"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-096",
    "title": "Médiateur interculturel",
    "familyId": "family-20",
    "sourceGroup": "Famille, vie personnelle et solidarité",
    "sectorIds": ["S20-02"],
    "reviewStatus": "candidate"
  },
  {
    "id": "candidate-20-097",
    "title": "Responsable d’aide aux personnes isolées",
    "familyId": "family-20",
    "sourceGroup": "Famille, vie personnelle et solidarité",
    "sectorIds": ["S20-05"],
    "reviewStatus": "candidate"
  }
] as const satisfies readonly ProfessionCandidate[];

export const MERKORA_DETAILED_PROFESSION_PROFILES: readonly ProfessionProfile[] = [
  {
    "id": "profile-01",
    "title": "Médecin généraliste",
    "familyId": "family-01",
    "reviewStatus": "documented_unreviewed",
    "purpose": "Consultation, suivi, orientation, coordination avec secrétariat et autres professionnels.",
    "workflow": "Accueil → rendez-vous → consultation → décision clinique humaine → suivi → clôture administrative.",
    "actorsAndResponsibilities": "Médecin, secrétaire, infirmier, patient avec accès limité.",
    "businessData": "Créneaux, rendez-vous, patients, documents administratifs, actes facturables, rappels.",
    "diagnosticQuestions": "Quels types de consultations ? Qui planifie ? Quelles données doivent rester médicales ? Qui peut consulter quoi ?",
    "digitalCapabilities": "Agenda, accueil, dossier administratif cloisonné, rappels, facturation, rapports d’activité.",
    "risksAndLimits": "Confidentialité des données de santé, accès minimal, journalisation, aucune décision clinique autonome par l’IA.",
    "possibleIndicators": "Délai d’attente, rendez-vous honorés, taux d’absence, temps administratif.",
    "projectExample": "Un cabinet veut réduire les rendez-vous oubliés : MerKora propose rappels et agenda, sans exposer les informations médicales aux personnes non autorisées.",
    "clientValidation": "Confirmer le périmètre, les rôles réels, les règles locales, les données à collecter et les modules retenus avant toute maquette détaillée ou fabrication."
  },
  {
    "id": "profile-02",
    "title": "Entraîneur sportif",
    "familyId": "family-02",
    "reviewStatus": "documented_unreviewed",
    "purpose": "Préparer les séances, suivre les sportifs, adapter les exercices et communiquer avec le club.",
    "workflow": "Inscription → évaluation initiale → objectifs → planification → séance → suivi → bilan.",
    "actorsAndResponsibilities": "Entraîneur, sportif, responsable de club, parent/tuteur si mineur.",
    "businessData": "Profils sportifs, séances, objectifs, présence, résultats, autorisations.",
    "diagnosticQuestions": "Sport individuel ou collectif ? Quel âge ? Qui valide les programmes ? Quels indicateurs sont utiles ?",
    "digitalCapabilities": "Planning, fiches sportifs, présence, programmes, progression, communication.",
    "risksAndLimits": "Protection des mineurs, consentement image, prudence sur les données de santé et les recommandations physiques.",
    "possibleIndicators": "Assiduité, progression selon objectifs définis, séances réalisées.",
    "projectExample": "Un club veut suivre les présences et les séances : l’application distingue les droits de l’entraîneur, du sportif et du responsable.",
    "clientValidation": "Confirmer le périmètre, les rôles réels, les règles locales, les données à collecter et les modules retenus avant toute maquette détaillée ou fabrication."
  },
  {
    "id": "profile-03",
    "title": "Exploitant agricole",
    "familyId": "family-03",
    "reviewStatus": "documented_unreviewed",
    "purpose": "Organiser parcelles, campagnes, intrants, main-d’œuvre, récoltes et ventes.",
    "workflow": "Préparation campagne → travaux → suivi parcelle → récolte → stockage → vente → bilan.",
    "actorsAndResponsibilities": "Exploitant, chef de culture, ouvriers, conseiller agricole, acheteur.",
    "businessData": "Parcelles, cultures, intrants, interventions, coûts, récoltes, lots, ventes.",
    "diagnosticQuestions": "Combien de parcelles ? Quelles cultures ? Réseau disponible ? Qui saisit les opérations ?",
    "digitalCapabilities": "Registre parcellaire, calendrier cultural, stocks, dépenses, récoltes, ventes, rapports.",
    "risksAndLimits": "Saisonnalité, traçabilité, fonctionnement hors ligne, sécurité des conseils agronomiques.",
    "possibleIndicators": "Rendement par parcelle, coût par campagne, pertes, délai de saisie.",
    "projectExample": "Une exploitation veut savoir où part son argent : MerKora relie achats d’intrants, travaux et récoltes par campagne.",
    "clientValidation": "Confirmer le périmètre, les rôles réels, les règles locales, les données à collecter et les modules retenus avant toute maquette détaillée ou fabrication."
  },
  {
    "id": "profile-04",
    "title": "Commerçant de détail",
    "familyId": "family-04",
    "reviewStatus": "documented_unreviewed",
    "purpose": "Gérer articles, prix, achats, ventes, caisse, stock et relation client.",
    "workflow": "Approvisionnement → réception → mise en stock → vente → encaissement → clôture caisse.",
    "actorsAndResponsibilities": "Propriétaire, vendeur, caissier, magasinier, comptable.",
    "businessData": "Articles, variantes, prix, fournisseurs, ventes, paiements, mouvements de stock.",
    "diagnosticQuestions": "Une ou plusieurs boutiques ? Vente comptant ou crédit ? Qui peut modifier les prix ?",
    "digitalCapabilities": "Catalogue, caisse, stock, achats, clients, clôture et rapports.",
    "risksAndLimits": "Traçabilité des annulations, droits de caisse, protection des données et paiements.",
    "possibleIndicators": "Marge, rotation stock, écart de caisse, ventes par période.",
    "projectExample": "Une boutique veut éviter les ruptures : seuils d’alerte proposés puis confirmés par le propriétaire.",
    "clientValidation": "Confirmer le périmètre, les rôles réels, les règles locales, les données à collecter et les modules retenus avant toute maquette détaillée ou fabrication."
  },
  {
    "id": "profile-05",
    "title": "Contrôleur de gestion",
    "familyId": "family-05",
    "reviewStatus": "documented_unreviewed",
    "purpose": "Comparer budget et réalisé, expliquer les écarts et aider la direction à décider.",
    "workflow": "Collecte → contrôle → rapprochement → analyse des écarts → commentaire → rapport → plan d’action.",
    "actorsAndResponsibilities": "Contrôleur, comptable, responsables budgétaires, directeur financier, direction.",
    "businessData": "Budgets, centres de coûts, écritures agrégées, justificatifs, périodes, indicateurs.",
    "diagnosticQuestions": "Quelle périodicité ? Quelles sources ? Qui valide les chiffres ? Quels seuils sont définis par l’entreprise ?",
    "digitalCapabilities": "Budget, import de données, rapprochement, écarts, commentaires, tableaux de bord.",
    "risksAndLimits": "Séparation saisie/validation, piste d’audit, confidentialité, aucune écriture comptable automatique non validée.",
    "possibleIndicators": "Écart budgétaire, délai de clôture, taux de justificatifs, actions réalisées.",
    "projectExample": "Le dirigeant reçoit chaque semaine un rapport recettes/dépenses et les écarts sont expliqués à partir des données validées.",
    "clientValidation": "Confirmer le périmètre, les rôles réels, les règles locales, les données à collecter et les modules retenus avant toute maquette détaillée ou fabrication."
  },
  {
    "id": "profile-06",
    "title": "Chef de projet",
    "familyId": "family-06",
    "reviewStatus": "documented_unreviewed",
    "purpose": "Cadrer, planifier, coordonner et suivre les livrables, risques, coûts et décisions.",
    "workflow": "Demande → cadrage → tâches/jalons → exécution → revue → validation → clôture.",
    "actorsAndResponsibilities": "Chef de projet, équipe, sponsor, client, fournisseurs.",
    "businessData": "Projets, tâches, dépendances, jalons, charges, risques, décisions, livrables.",
    "diagnosticQuestions": "Quels résultats attendus ? Qui décide ? Quelles échéances sont fixes ? Quels livrables prouvent l’avancement ?",
    "digitalCapabilities": "Portefeuille, tâches, calendrier, risques, décisions, rapports, espace client.",
    "risksAndLimits": "Historique des décisions, confidentialité client, distinction estimation/réalisé.",
    "possibleIndicators": "Jalons tenus, tâches en retard, charge, risques ouverts.",
    "projectExample": "Un client veut voir l’avancement sans accéder aux notes internes : deux vues et permissions distinctes.",
    "clientValidation": "Confirmer le périmètre, les rôles réels, les règles locales, les données à collecter et les modules retenus avant toute maquette détaillée ou fabrication."
  },
  {
    "id": "profile-07",
    "title": "Conducteur de travaux",
    "familyId": "family-07",
    "reviewStatus": "documented_unreviewed",
    "purpose": "Préparer les chantiers, coordonner équipes, matériaux, sous-traitants, coûts et sécurité.",
    "workflow": "Étude dossier → préparation → approvisionnement → exécution → contrôle → réception → réserves.",
    "actorsAndResponsibilities": "Conducteur, chef de chantier, ouvriers, sous-traitants, client, bureau d’études.",
    "businessData": "Chantiers, lots, devis, situations, équipes, matériaux, incidents, photos, réserves.",
    "diagnosticQuestions": "Combien de chantiers ? Qui valide les avenants ? Comment suivre les matériaux et incidents ?",
    "digitalCapabilities": "Planning chantier, journal, achats, avancement, photos, réserves, coûts.",
    "risksAndLimits": "Sécurité, validation des plans, traçabilité des avenants et preuves datées.",
    "possibleIndicators": "Avancement réel, écarts coût/délai, réserves, incidents.",
    "projectExample": "Le conducteur signale un retard : le système relie la tâche, la cause, l’impact et l’action corrective.",
    "clientValidation": "Confirmer le périmètre, les rôles réels, les règles locales, les données à collecter et les modules retenus avant toute maquette détaillée ou fabrication."
  },
  {
    "id": "profile-08",
    "title": "Directeur d’établissement scolaire",
    "familyId": "family-08",
    "reviewStatus": "documented_unreviewed",
    "purpose": "Piloter inscriptions, classes, personnel, emplois du temps, évaluations et communication.",
    "workflow": "Préinscription → admission → affectation → cours → évaluation → bulletin → réinscription.",
    "actorsAndResponsibilities": "Direction, secrétariat, enseignant, surveillant, élève, parent/tuteur.",
    "businessData": "Élèves, responsables légaux, classes, cours, présences, notes, paiements.",
    "diagnosticQuestions": "Quels cycles ? Qui saisit et valide les notes ? Comment les parents reçoivent-ils les informations ?",
    "digitalCapabilities": "Admissions, classes, présence, notes, emplois du temps, paiements, portail parent.",
    "risksAndLimits": "Protection des mineurs, confidentialité des résultats, accès parent limité à l’enfant concerné.",
    "possibleIndicators": "Taux de présence, retards, résultats, impayés, délai de traitement.",
    "projectExample": "La direction veut suivre les retards : le système distingue constat, justification et décision administrative.",
    "clientValidation": "Confirmer le périmètre, les rôles réels, les règles locales, les données à collecter et les modules retenus avant toute maquette détaillée ou fabrication."
  },
  {
    "id": "profile-09",
    "title": "Exploitant de transport",
    "familyId": "family-09",
    "reviewStatus": "documented_unreviewed",
    "purpose": "Affecter véhicules et conducteurs, planifier missions, suivre livraisons et incidents.",
    "workflow": "Commande → planification → affectation → départ → suivi → preuve → facturation.",
    "actorsAndResponsibilities": "Exploitant, conducteur, répartiteur, client, mécanicien.",
    "businessData": "Missions, trajets, véhicules, conducteurs, carburant, coûts, preuves, incidents.",
    "diagnosticQuestions": "Transport de personnes ou marchandises ? Suivi GPS nécessaire ? Quelles zones sans réseau ?",
    "digitalCapabilities": "Planning, dispatch, suivi mission, preuve livraison, entretien, coûts.",
    "risksAndLimits": "Géolocalisation proportionnée, sécurité routière, accès aux données de trajet.",
    "possibleIndicators": "Livraisons à l’heure, coût par trajet, immobilisation véhicule, incidents.",
    "projectExample": "Le client veut savoir si une livraison est faite : preuve horodatée, statut et motif d’échec.",
    "clientValidation": "Confirmer le périmètre, les rôles réels, les règles locales, les données à collecter et les modules retenus avant toute maquette détaillée ou fabrication."
  },
  {
    "id": "profile-10",
    "title": "Restaurateur",
    "familyId": "family-10",
    "reviewStatus": "documented_unreviewed",
    "purpose": "Gérer menu, approvisionnement, commandes, préparation, service, caisse et pertes.",
    "workflow": "Approvisionnement → réception → préparation → commande → service/livraison → encaissement → clôture.",
    "actorsAndResponsibilities": "Gérant, cuisinier, serveur, caissier, livreur, client.",
    "businessData": "Menus, recettes, ingrédients, allergènes, commandes, tables, paiements, stocks.",
    "diagnosticQuestions": "Sur place, à emporter ou livraison ? Plusieurs points de vente ? Qui modifie les recettes ?",
    "digitalCapabilities": "Menu, commandes, cuisine, tables, caisse, stocks, achats, rapports.",
    "risksAndLimits": "Hygiène, allergènes, sécurité des paiements, traçabilité des lots.",
    "possibleIndicators": "Temps de préparation, pertes, marge par plat, ventes par période.",
    "projectExample": "Un restaurant veut connaître les plats rentables : calcul à partir des coûts confirmés des ingrédients.",
    "clientValidation": "Confirmer le périmètre, les rôles réels, les règles locales, les données à collecter et les modules retenus avant toute maquette détaillée ou fabrication."
  },
  {
    "id": "profile-11",
    "title": "Organisateur événementiel",
    "familyId": "family-11",
    "reviewStatus": "documented_unreviewed",
    "purpose": "Concevoir et exécuter un événement avec budget, programme, prestataires et participants.",
    "workflow": "Brief → budget → réservation → planification → invitations/billets → événement → bilan.",
    "actorsAndResponsibilities": "Organisateur, client, prestataire, équipe, participant, sécurité.",
    "businessData": "Événements, budgets, contrats, prestataires, invités, billets, tâches, incidents.",
    "diagnosticQuestions": "Événement privé ou public ? Jauge ? Billetterie ? Quels prestataires et validations ?",
    "digitalCapabilities": "Dossier événement, budget, tâches, invitations, billetterie, contrôle accès, bilan.",
    "risksAndLimits": "Protection des listes d’invités, sécurité du public, conditions d’annulation.",
    "possibleIndicators": "Budget consommé, inscriptions, présence, incidents, satisfaction.",
    "projectExample": "Le budget change : le système présente les postes touchés et demande validation avant modification.",
    "clientValidation": "Confirmer le périmètre, les rôles réels, les règles locales, les données à collecter et les modules retenus avant toute maquette détaillée ou fabrication."
  },
  {
    "id": "profile-12",
    "title": "Gestionnaire RH",
    "familyId": "family-12",
    "reviewStatus": "documented_unreviewed",
    "purpose": "Administrer les dossiers du personnel, contrats, absences, temps et demandes.",
    "workflow": "Entrée → dossier → affectation → présence/congés → changement → sortie/archivage.",
    "actorsAndResponsibilities": "RH, salarié, manager, paie, direction.",
    "businessData": "Employés, contrats, postes, absences, horaires, validations, pièces.",
    "diagnosticQuestions": "Quelles règles locales ? Qui valide les absences ? Quels éléments sont transmis à la paie ?",
    "digitalCapabilities": "Dossiers, organigramme, congés, présence, planning, documents, rapports.",
    "risksAndLimits": "Données personnelles, droits d’accès, droit du travail, pas de sanction automatique.",
    "possibleIndicators": "Délai de traitement, absences, dossiers complets, corrections de pointage.",
    "projectExample": "Un employé corrige un oubli de pointage : demande motivée puis validation hiérarchique tracée.",
    "clientValidation": "Confirmer le périmètre, les rôles réels, les règles locales, les données à collecter et les modules retenus avant toute maquette détaillée ou fabrication."
  },
  {
    "id": "profile-13",
    "title": "Menuisier",
    "familyId": "family-13",
    "reviewStatus": "documented_unreviewed",
    "purpose": "Prendre mesures, chiffrer, acheter les matériaux, fabriquer, poser et gérer les retouches.",
    "workflow": "Demande → visite/mesure → devis → validation → achat → fabrication → pose → réception.",
    "actorsAndResponsibilities": "Artisan, apprenti, client, fournisseur, poseur.",
    "businessData": "Clients, ouvrages, dimensions, plans, matériaux, devis, étapes, paiements.",
    "diagnosticQuestions": "Fabrication sur mesure ? Quelles unités ? Comment calculer pertes et main-d’œuvre ?",
    "digitalCapabilities": "Fiches ouvrages, mesures, devis, achats, atelier, planning, livraison, garantie.",
    "risksAndLimits": "Validation des dimensions, versions de plan, sécurité atelier et preuves d’accord.",
    "possibleIndicators": "Marge par ouvrage, retouches, délais, consommation matière.",
    "projectExample": "Le client modifie une dimension : nouvelle version du devis et du plan, sans écraser l’ancienne.",
    "clientValidation": "Confirmer le périmètre, les rôles réels, les règles locales, les données à collecter et les modules retenus avant toute maquette détaillée ou fabrication."
  },
  {
    "id": "profile-14",
    "title": "Coiffeur",
    "familyId": "family-14",
    "reviewStatus": "documented_unreviewed",
    "purpose": "Gérer rendez-vous, prestations, employés, produits, encaissements et fidélité.",
    "workflow": "Réservation → accueil → prestation → paiement → suivi client → réapprovisionnement.",
    "actorsAndResponsibilities": "Gérant, coiffeur, réceptionniste, client.",
    "businessData": "Clients, rendez-vous, prestations, durées, employés, produits, paiements.",
    "diagnosticQuestions": "Avec ou sans rendez-vous ? Plusieurs fauteuils ? Commission ? Rappels par quel canal ?",
    "digitalCapabilities": "Agenda, planning équipe, catalogue prestations, caisse, stock, fidélité.",
    "risksAndLimits": "Confidentialité des contacts, consentement aux messages et photos.",
    "possibleIndicators": "Taux de rendez-vous honorés, occupation, panier moyen, fidélité.",
    "projectExample": "Le salon veut réduire les absences : rappel paramétrable, désinscription et suivi des réponses.",
    "clientValidation": "Confirmer le périmètre, les rôles réels, les règles locales, les données à collecter et les modules retenus avant toute maquette détaillée ou fabrication."
  },
  {
    "id": "profile-15",
    "title": "Agent d’état civil",
    "familyId": "family-15",
    "reviewStatus": "documented_unreviewed",
    "purpose": "Recevoir, instruire, vérifier et délivrer des actes selon les procédures légales.",
    "workflow": "Dépôt demande → contrôle pièces → instruction → validation habilitée → délivrance → archivage.",
    "actorsAndResponsibilities": "Agent d’accueil, instructeur, officier habilité, demandeur, archiviste.",
    "businessData": "Demandes, identité, pièces justificatives, statuts, décisions, traces de délivrance.",
    "diagnosticQuestions": "Quelle juridiction ? Quelles pièces officielles ? Qui a pouvoir de validation ? Quel archivage légal ?",
    "digitalCapabilities": "Guichet, suivi de dossier, contrôle pièces, circuit de validation, registre et archives.",
    "risksAndLimits": "Données d’identité sensibles, habilitations strictes, règles nationales, aucune délivrance automatique.",
    "possibleIndicators": "Délai d’instruction, dossiers incomplets, demandes en attente.",
    "projectExample": "Le demandeur suit l’état de sa demande mais ne voit pas les notes internes d’instruction.",
    "clientValidation": "Confirmer le périmètre, les rôles réels, les règles locales, les données à collecter et les modules retenus avant toute maquette détaillée ou fabrication."
  },
  {
    "id": "profile-16",
    "title": "Avocat",
    "familyId": "family-16",
    "reviewStatus": "documented_unreviewed",
    "purpose": "Organiser dossiers clients, pièces, échéances, audiences, recherches et temps passé.",
    "workflow": "Ouverture dossier → contrôle conflit → collecte pièces → analyse → échéance/audience → clôture.",
    "actorsAndResponsibilities": "Avocat, collaborateur, assistant, client avec accès limité.",
    "businessData": "Clients, dossiers, parties, pièces, échéances, audiences, tâches, facturation.",
    "diagnosticQuestions": "Quelles juridictions ? Qui accède à chaque dossier ? Comment vérifier les conflits ?",
    "digitalCapabilities": "Dossiers cloisonnés, échéancier, pièces, recherche, tâches, facturation, portail client.",
    "risksAndLimits": "Secret professionnel, conflits d’intérêts, contrôle des accès, IA non substitutive au conseil.",
    "possibleIndicators": "Échéances respectées, temps par dossier, dossiers incomplets.",
    "projectExample": "Un client dépose une pièce dans son espace : elle reste inaccessible aux autres clients.",
    "clientValidation": "Confirmer le périmètre, les rôles réels, les règles locales, les données à collecter et les modules retenus avant toute maquette détaillée ou fabrication."
  },
  {
    "id": "profile-17",
    "title": "Développeur logiciel",
    "familyId": "family-17",
    "reviewStatus": "documented_unreviewed",
    "purpose": "Transformer un besoin validé en code maintenable, testé, sécurisé et livré.",
    "workflow": "Cadrage → spécification → conception → développement → revue → tests → déploiement contrôlé.",
    "actorsAndResponsibilities": "Développeur, lead, QA, produit, sécurité, client.",
    "businessData": "Tickets, exigences, code, versions, tests, incidents, secrets, déploiements.",
    "diagnosticQuestions": "Quel environnement ? Quelles contraintes de sécurité ? Qui valide la mise en production ?",
    "digitalCapabilities": "Backlog, dépôt, CI, tests, revue, suivi bugs, documentation, release.",
    "risksAndLimits": "Secrets, dépendances, droits dépôt, sauvegardes, séparation preview/production.",
    "possibleIndicators": "Défauts échappés, délai cycle, couverture tests pertinente, incidents post-livraison.",
    "projectExample": "Une fonctionnalité est prête : déploiement preview, tests, validation, puis approbation séparée pour production.",
    "clientValidation": "Confirmer le périmètre, les rôles réels, les règles locales, les données à collecter et les modules retenus avant toute maquette détaillée ou fabrication."
  },
  {
    "id": "profile-18",
    "title": "Technicien solaire",
    "familyId": "family-18",
    "reviewStatus": "documented_unreviewed",
    "purpose": "Étudier, installer, mettre en service et maintenir des équipements photovoltaïques.",
    "workflow": "Demande → visite → dimensionnement validé → devis → installation → test → maintenance.",
    "actorsAndResponsibilities": "Technicien, ingénieur, client, fournisseur, équipe maintenance.",
    "businessData": "Sites, équipements, puissances, composants, séries, interventions, mesures.",
    "diagnosticQuestions": "Installation autonome ou raccordée ? Qui valide le dimensionnement ? Quelles normes locales ?",
    "digitalCapabilities": "Dossiers site, devis, inventaire, checklist, maintenance, mesures et alertes.",
    "risksAndLimits": "Sécurité électrique, compétences habilitées, normes et validation technique.",
    "possibleIndicators": "Pannes, disponibilité, rendement mesuré, interventions dans les délais.",
    "projectExample": "Le client signale une panne : historique équipement, diagnostic technicien et compte rendu d’intervention.",
    "clientValidation": "Confirmer le périmètre, les rôles réels, les règles locales, les données à collecter et les modules retenus avant toute maquette détaillée ou fabrication."
  },
  {
    "id": "profile-19",
    "title": "Responsable sécurité de site",
    "familyId": "family-19",
    "reviewStatus": "documented_unreviewed",
    "purpose": "Organiser consignes, équipes, rondes, accès, incidents et escalades.",
    "workflow": "Consigne → affectation → prise de poste → ronde/contrôle → incident → escalade → rapport.",
    "actorsAndResponsibilities": "Responsable, chef de poste, agent, direction, visiteurs selon droits.",
    "businessData": "Sites, postes, rondes, événements, visiteurs, incidents, consignes.",
    "diagnosticQuestions": "Quels sites ? Quelles rondes ? Quels événements doivent être escaladés ? Caméras ou simples journaux ?",
    "digitalCapabilities": "Planning, consignes, registre, rondes, visiteurs, incidents, rapports.",
    "risksAndLimits": "Surveillance proportionnée, accès limité aux images, conservation définie, contrôle humain.",
    "possibleIndicators": "Rondes effectuées, incidents traités, délais d’escalade.",
    "projectExample": "Un agent déclare un incident : le responsable reçoit l’alerte selon gravité définie et trace la clôture.",
    "clientValidation": "Confirmer le périmètre, les rôles réels, les règles locales, les données à collecter et les modules retenus avant toute maquette détaillée ou fabrication."
  },
  {
    "id": "profile-20",
    "title": "Coordinateur associatif",
    "familyId": "family-20",
    "reviewStatus": "documented_unreviewed",
    "purpose": "Gérer membres, bénévoles, activités, cotisations, dons et comptes rendus.",
    "workflow": "Adhésion → validation → affectation → activité → collecte → rapport → renouvellement.",
    "actorsAndResponsibilities": "Bureau, trésorier, bénévole, membre, bénéficiaire avec accès adapté.",
    "businessData": "Membres, rôles, cotisations, dons, projets, dépenses, justificatifs.",
    "diagnosticQuestions": "Association ou ONG ? Quelles données bénéficiaires ? Qui valide les dépenses ?",
    "digitalCapabilities": "Adhérents, bénévoles, activités, dons, budget, justificatifs, rapports.",
    "risksAndLimits": "Confidentialité des bénéficiaires, transparence financière, consentement et séparation des rôles.",
    "possibleIndicators": "Adhésions actives, fonds justifiés, bénévoles mobilisés, actions terminées.",
    "projectExample": "Le trésorier prépare un rapport : les dépenses non justifiées restent signalées et non masquées.",
    "clientValidation": "Confirmer le périmètre, les rôles réels, les règles locales, les données à collecter et les modules retenus avant toute maquette détaillée ou fabrication."
  }
,
  {
    "id": "profile-21",
    "title": "Clerc de notaire",
    "familyId": "family-16",
    "sectorIds": ["S16-02"],
    "reviewStatus": "documented_unreviewed",
    "purpose": "Préparer et suivre les dossiers d'actes sous la responsabilité et la validation du notaire habilité.",
    "workflow": "Ouverture du dossier → identification des parties → collecte des pièces → vérification de complétude → préparation du projet d'acte → revue du notaire → signature/formalités → archivage.",
    "actorsAndResponsibilities": "Clerc, notaire, assistant, parties, administrations et partenaires autorisés. Le clerc prépare et suit ; le notaire conserve les validations et actes réservés à sa fonction.",
    "businessData": "Références dossier, identité et coordonnées strictement nécessaires, pièces, provenance, dates, rendez-vous, versions d'acte, formalités, frais et statut.",
    "diagnosticQuestions": "Quels types d'actes traitez-vous ? Quelles pièces sont requises selon le dossier ? Qui vérifie l'identité et la complétude ? Qui valide la version finale ? Quels délais et formalités doivent être suivis ?",
    "digitalCapabilities": "Checklist documentaire configurable, coffre de pièces avec droits fins, échéancier, modèles versionnés, tâches, journal des consultations, rappels et suivi des formalités.",
    "risksAndLimits": "Ne pas interpréter le droit ni authentifier automatiquement les pièces. Exiger validation du notaire, contrôle d'accès nominatif, chiffrement, journalisation et règles locales de conservation.",
    "possibleIndicators": "Dossiers incomplets, temps de collecte, actes en attente de revue, formalités hors délai, pièces à renouveler.",
    "projectExample": "Un office veut réduire les dossiers bloqués : le tableau identifie les pièces manquantes et le responsable de la prochaine action sans exposer le contenu aux personnes non autorisées.",
    "clientValidation": "Faire valider par le notaire les catégories d'actes, listes de pièces, habilitations, délais et obligations de conservation avant paramétrage."
  },
  {
    "id": "profile-22",
    "title": "Délégué à la protection des données",
    "familyId": "family-16",
    "sectorIds": ["S16-05"],
    "reviewStatus": "documented_unreviewed",
    "purpose": "Conseiller l'organisation sur la gouvernance des données personnelles, suivre les obligations et documenter les risques et demandes.",
    "workflow": "Cartographie des traitements → qualification → conseil → analyse des risques si nécessaire → suivi des mesures → demandes/incidents → rapport et amélioration.",
    "actorsAndResponsibilities": "Délégué, responsables métiers, responsable de traitement, sécurité informatique, juridique, personnes concernées et autorité compétente selon le cadre applicable.",
    "businessData": "Registre des traitements, finalités, catégories de données, destinataires, durées, bases légales documentées par l'organisation, demandes, incidents et mesures.",
    "diagnosticQuestions": "Dans quel pays l'organisation opère-t-elle ? Quelles catégories de données sont traitées ? Qui décide des finalités ? Comment les demandes des personnes sont-elles reçues et suivies ?",
    "digitalCapabilities": "Registre, cartographie, workflow de demandes, calendrier de revue, registre d'incidents, plans d'action, preuves et rapports d'audit.",
    "risksAndLimits": "La plateforme ne détermine pas seule la conformité juridique. Les rôles, bases légales, durées et notifications doivent être validés par les responsables compétents et selon la juridiction.",
    "possibleIndicators": "Traitements recensés, revues en retard, demandes dans les délais, mesures correctives ouvertes, incidents documentés.",
    "projectExample": "Une organisation veut centraliser les demandes d'accès : chaque demande reçoit un responsable, une échéance, une preuve de réponse et un accès restreint.",
    "clientValidation": "Confirmer la juridiction, le rôle exact du délégué, les traitements concernés, les règles de conservation et les procédures validées."
  },
  {
    "id": "profile-23",
    "title": "Administrateur réseau",
    "familyId": "family-17",
    "sectorIds": ["S17-03"],
    "reviewStatus": "documented_unreviewed",
    "purpose": "Maintenir la disponibilité, la performance et la sécurité des réseaux et services de connectivité.",
    "workflow": "Inventaire → supervision → détection → qualification incident → diagnostic → intervention/changement contrôlé → test → clôture et retour d'expérience.",
    "actorsAndResponsibilities": "Administrateur réseau, technicien terrain, support, responsable sécurité, fournisseur opérateur et utilisateurs.",
    "businessData": "Équipements, adresses et segments réseau, liens, configurations, versions, tickets, changements, alertes, interventions et niveaux de service.",
    "diagnosticQuestions": "Quels sites et équipements sont couverts ? Quels services sont critiques ? Qui peut modifier les configurations ? Quelles alertes sont prioritaires ? Comment documentez-vous les changements ?",
    "digitalCapabilities": "Inventaire, cartographie, tickets, calendrier de maintenance, journal de changements, alertes, base de connaissances et rapports de disponibilité.",
    "risksAndLimits": "Ne jamais stocker des mots de passe ou clés en clair. Restreindre les accès d'administration, séparer supervision et commande, conserver les journaux utiles et exiger une approbation pour les changements sensibles.",
    "possibleIndicators": "Disponibilité des liens, incidents récurrents, délai moyen de rétablissement, changements échoués, équipements sans inventaire.",
    "projectExample": "Une entreprise multi-sites veut comprendre les coupures : les alertes sont corrélées aux sites et tickets, mais les changements réseau restent exécutés par un administrateur autorisé.",
    "clientValidation": "Valider le périmètre réseau, les niveaux de criticité, les intégrations, les droits techniques et les procédures d'escalade."
  },
  {
    "id": "profile-24",
    "title": "Analyste cybersécurité",
    "familyId": "family-17",
    "sectorIds": ["S17-05"],
    "reviewStatus": "documented_unreviewed",
    "purpose": "Surveiller les signaux de sécurité, qualifier les alertes et coordonner les réponses aux incidents.",
    "workflow": "Collecte autorisée → détection → triage → enrichissement → qualification humaine → escalade → réponse approuvée → clôture et leçons apprises.",
    "actorsAndResponsibilities": "Analyste, responsable sécurité, administrateur, équipe juridique/conformité, direction et prestataires habilités.",
    "businessData": "Alertes, horodatages, actifs, événements, sévérité proposée, décisions, actions autorisées, preuves et rapports.",
    "diagnosticQuestions": "Quelles sources de journaux sont autorisées ? Qui valide une sévérité ? Qui peut isoler un équipement ? Quelle procédure de notification et d'escalade existe ?",
    "digitalCapabilities": "File d'alertes, corrélation de signaux, gestion d'incidents, assignation, chronologie, preuves, tableaux de bord et rapports.",
    "risksAndLimits": "Pas de surveillance clandestine, d'accès non autorisé ni de réponse destructive automatique. Les faux positifs, preuves et actions doivent être revus par une personne habilitée.",
    "possibleIndicators": "Délai de triage, alertes confirmées, incidents récurrents, actions en attente, délai de clôture.",
    "projectExample": "Une alerte inhabituelle ouvre un incident avec les éléments disponibles ; l'analyste valide la qualification et le responsable autorise toute mesure de confinement.",
    "clientValidation": "Définir les systèmes autorisés, les sources, les rôles, les niveaux d'escalade, la conservation des preuves et les actions permises."
  },
  {
    "id": "profile-25",
    "title": "Fontainier",
    "familyId": "family-18",
    "sectorIds": ["S18-03"],
    "reviewStatus": "documented_unreviewed",
    "purpose": "Assurer le suivi de proximité des points d'eau, installations, interventions et signalements liés à la distribution.",
    "workflow": "Signalement ou tournée → localisation → relevé/constat → qualification → intervention ou transmission → vérification → clôture.",
    "actorsAndResponsibilities": "Fontainier, responsable réseau, agent de relève, équipe de maintenance, usager et service clientèle.",
    "businessData": "Points d'eau, compteurs si applicables, relevés, anomalies, fuites, interventions, pièces, dates et statuts.",
    "diagnosticQuestions": "Quels ouvrages ou points d'eau suivez-vous ? Les relevés sont-ils périodiques ? Comment une fuite est-elle signalée ? Qui valide la remise en service ?",
    "digitalCapabilities": "Registre des points d'eau, tournées, formulaires mobiles hors ligne, photos horodatées, tickets, affectations et historique.",
    "risksAndLimits": "La plateforme ne certifie pas la potabilité ni la sécurité sanitaire. Les mesures et remises en service doivent être validées par les agents compétents.",
    "possibleIndicators": "Signalements ouverts, délais d'intervention, relevés manquants, pannes répétées, points d'eau indisponibles.",
    "projectExample": "Un agent relève une fuite pendant sa tournée : il enregistre le lieu, la photo et l'urgence, puis le responsable affecte une équipe.",
    "clientValidation": "Confirmer le type d'installation, les responsabilités d'exploitation, les données collectées, les procédures de contrôle et le fonctionnement hors ligne."
  },
  {
    "id": "profile-26",
    "title": "Technicien traitement de l'eau",
    "familyId": "family-18",
    "sectorIds": ["S18-03", "S18-04"],
    "reviewStatus": "documented_unreviewed",
    "purpose": "Suivre les opérations techniques de traitement, les contrôles, les équipements et les anomalies.",
    "workflow": "Planification → opération → prélèvement/mesure selon protocole → saisie → contrôle par responsable → anomalie → action corrective → rapport.",
    "actorsAndResponsibilities": "Technicien, responsable d'exploitation, laboratoire habilité, maintenance, autorité ou organisme de contrôle selon le contexte.",
    "businessData": "Installations, lots, étapes, paramètres mesurés, appareils, étalonnages, résultats, anomalies, interventions et validations.",
    "diagnosticQuestions": "Quel procédé est exploité ? Quels paramètres sont mesurés et selon quel protocole ? Qui est habilité à valider les résultats ? Comment les appareils sont-ils étalonnés ?",
    "digitalCapabilities": "Registre d'exploitation, formulaires de mesure, alertes de seuil configurées par expert, suivi d'étalonnage, maintenance, pièces et rapports.",
    "risksAndLimits": "Ne pas interpréter automatiquement les résultats ni déclarer l'eau conforme. Les seuils, prélèvements et décisions doivent être définis et validés par des spécialistes selon les normes locales.",
    "possibleIndicators": "Mesures manquantes, appareils à étalonner, anomalies ouvertes, opérations hors calendrier, interventions en retard.",
    "projectExample": "Le responsable reçoit une alerte lorsqu'une mesure sort de la plage configurée et décide des contrôles et actions nécessaires.",
    "clientValidation": "Faire valider les protocoles, paramètres, seuils, habilitations, équipements et règles réglementaires applicables."
  },
  {
    "id": "profile-27",
    "title": "Responsable HSE",
    "familyId": "family-19",
    "sectorIds": ["S19-03"],
    "reviewStatus": "documented_unreviewed",
    "purpose": "Structurer la prévention des risques professionnels, le suivi des incidents et les actions d'amélioration.",
    "workflow": "Identification dangers → évaluation validée → plan de prévention → sensibilisation → inspection → incident → analyse → action corrective → revue.",
    "actorsAndResponsibilities": "Responsable HSE, direction, managers, travailleurs, représentants du personnel, médecine du travail et organismes compétents.",
    "businessData": "Sites, activités, dangers, évaluations, formations, équipements, inspections, incidents, presque-accidents et actions.",
    "diagnosticQuestions": "Quels sites et activités sont couverts ? Qui réalise et valide les évaluations ? Comment les travailleurs signalent-ils un danger ? Qui suit les actions correctives ?",
    "digitalCapabilities": "Registre des risques, inspections, plans d'action, formations, signalements, preuves, échéances et rapports.",
    "risksAndLimits": "L'outil n'est pas une certification ni un substitut à l'expertise HSE. Les évaluations et mesures de prévention sont validées par des personnes compétentes.",
    "possibleIndicators": "Actions échues, inspections réalisées, formations à renouveler, incidents et presque-accidents enregistrés.",
    "projectExample": "Un salarié signale un sol glissant : le responsable attribue une action, une échéance et une preuve de correction.",
    "clientValidation": "Valider les référentiels de risques, les responsabilités, la confidentialité des signalements et les obligations du pays concerné."
  },
  {
    "id": "profile-28",
    "title": "Gestionnaire de crise",
    "familyId": "family-19",
    "sectorIds": ["S19-04"],
    "reviewStatus": "documented_unreviewed",
    "purpose": "Préparer la coordination humaine lors d'un événement perturbant les activités ou la sécurité.",
    "workflow": "Préparation → déclenchement humain → qualification → mobilisation → actions assignées → points de situation → retour à la normale → retour d'expérience.",
    "actorsAndResponsibilities": "Responsable de crise, direction, responsables de cellule, équipes terrain, communication, partenaires et autorités selon le plan.",
    "businessData": "Plans, contacts professionnels, scénarios, événements, décisions, actions, horodatages, comptes rendus et clôture.",
    "diagnosticQuestions": "Qui peut déclencher le plan ? Quels scénarios sont couverts ? Quels canaux de secours existent ? Qui valide les messages et le retour à la normale ?",
    "digitalCapabilities": "Annuaire d'astreinte, listes de contrôle, journal de décisions, affectation d'actions, notifications validées, tableaux de situation et exercices.",
    "risksAndLimits": "Aucune décision d'urgence automatisée. Les alertes et communications critiques doivent suivre des protocoles testés, avec solutions de secours indépendantes.",
    "possibleIndicators": "Temps de mobilisation, actions critiques en retard, contacts non joignables, exercices réalisés, leçons clôturées.",
    "projectExample": "Lors d'une panne majeure, le responsable déclenche le plan et suit les équipes ; le système journalise les décisions sans décider seul de la gravité.",
    "clientValidation": "Valider les autorités de déclenchement, scénarios, contacts, canaux de secours, messages types et exercices périodiques."
  },
  {
    "id": "profile-29",
    "title": "Trésorier associatif",
    "familyId": "family-20",
    "sectorIds": ["S20-02"],
    "reviewStatus": "documented_unreviewed",
    "purpose": "Enregistrer les recettes et dépenses, conserver les justificatifs et préparer une information financière compréhensible aux membres habilités.",
    "workflow": "Budget approuvé → collecte des pièces → enregistrement → rapprochement → contrôle → rapport → présentation et archivage.",
    "actorsAndResponsibilities": "Trésorier, président, bureau, contrôleur interne, membres selon les statuts et partenaires financiers.",
    "businessData": "Budgets, cotisations, dons, recettes, dépenses, justificatifs, comptes, périodes et validations.",
    "diagnosticQuestions": "Quelles règles statutaires encadrent les dépenses ? Qui autorise et qui enregistre ? Faut-il gérer plusieurs projets ou bailleurs ? Quel niveau de détail les membres peuvent-ils consulter ?",
    "digitalCapabilities": "Journal recettes/dépenses, pièces jointes, budget par activité, rapprochement, circuit d'approbation, exports et rapports.",
    "risksAndLimits": "Séparer autorisation, paiement et enregistrement quand possible. Ne pas présenter des données non rapprochées comme certifiées ; respecter les règles comptables locales.",
    "possibleIndicators": "Dépenses justifiées, écarts au budget, rapprochements en attente, rapports remis à temps.",
    "projectExample": "Le bureau consulte un rapport de projet : les dépenses sans justificatif sont visibles comme à compléter et non intégrées silencieusement comme validées.",
    "clientValidation": "Confirmer statuts, règles d'approbation, comptes utilisés, exigences des financeurs, accès des membres et format des rapports."
  },
  {
    "id": "profile-30",
    "title": "Coordinateur de projet social",
    "familyId": "family-20",
    "sectorIds": ["S20-03"],
    "reviewStatus": "documented_unreviewed",
    "purpose": "Planifier les actions sociales, coordonner équipes et partenaires, suivre les bénéficiaires avec dignité et mesurer les résultats convenus.",
    "workflow": "Diagnostic de besoin → conception du programme → critères validés → orientation/consentement → mise en œuvre → suivi → évaluation → rapport.",
    "actorsAndResponsibilities": "Coordinateur, travailleurs sociaux, bénévoles, partenaires, financeurs et bénéficiaires avec droits et choix respectés.",
    "businessData": "Programmes, activités, ressources, bénéficiaires pseudonymisés si possible, consentements, orientations, services rendus et résultats agrégés.",
    "diagnosticQuestions": "Quel problème social le programme vise-t-il ? Qui définit l'éligibilité ? Quelles données sont strictement nécessaires ? Comment le bénéficiaire peut-il corriger ou refuser une information ?",
    "digitalCapabilities": "Gestion de programme, planification, suivi d'activités, gestion des orientations, consentements, indicateurs agrégés et rapports financeurs.",
    "risksAndLimits": "Minimiser les données sensibles, protéger les personnes vulnérables, éviter le profilage automatisé et laisser les décisions d'éligibilité à des professionnels autorisés.",
    "possibleIndicators": "Activités réalisées, délais d'orientation, services délivrés, couverture du programme et résultats agrégés définis avec prudence.",
    "projectExample": "Une ONG suit les distributions par programme avec des identifiants limités et des rapports agrégés, sans afficher publiquement les situations personnelles.",
    "clientValidation": "Valider les finalités, critères, consentements, droits d'accès, durée de conservation et méthode de mesure avec les responsables du programme."
  },
  {
    id: "profile-31",
    title: "Médecin généraliste",
    familyId: "family-01",
    sectorIds: ["S01-01"],
    reviewStatus: "documented_unreviewed",
    purpose: "Assurer une prise en charge médicale de premier recours, coordonner l'orientation et documenter le suivi des patients.",
    workflow: "Accueil et motif → anamnèse et examen → hypothèses cliniques → décision et prescription par le médecin → orientation si nécessaire → suivi et clôture.",
    actorsAndResponsibilities: "Médecin, patient, secrétariat, infirmier, laboratoire et spécialiste ; le médecin assume les décisions cliniques.",
    businessData: "Identité minimale, motif, antécédents utiles, observations, prescriptions, résultats, rendez-vous et consentements selon le cadre applicable.",
    diagnosticQuestions: "Quelles consultations réalisez-vous ? Comment gérez-vous les urgences et les rendez-vous ? Qui accède au dossier ? Comment suivez-vous les résultats et orientations ?",
    digitalCapabilities: "Agenda, dossier patient sécurisé, rappels, demandes d'examens, suivi d'orientation, facturation et statistiques agrégées.",
    risksAndLimits: "Aucun diagnostic automatique ni partage non autorisé. Protéger le secret médical, les accès, la traçabilité et les règles locales de conservation.",
    possibleIndicators: "Délais de rendez-vous, consultations reportées, résultats à revoir, orientations en attente.",
    projectExample: "Le cabinet repère les patients à recontacter après réception d'un résultat, sans laisser le logiciel interpréter ce résultat.",
    clientValidation: "Faire valider par les professionnels les données, accès, protocoles, urgences et exigences de santé du pays."
  },
  {
    id: "profile-32",
    title: "Infirmier diplômé",
    familyId: "family-01",
    sectorIds: ["S01-02"],
    reviewStatus: "documented_unreviewed",
    purpose: "Organiser les soins infirmiers prescrits ou relevant de son champ de compétence, surveiller l'évolution et transmettre les informations utiles.",
    workflow: "Plan de soins → vérification identité et prescription si nécessaire → préparation → soin → surveillance → traçabilité → transmission et réévaluation.",
    actorsAndResponsibilities: "Infirmier, patient, médecin, aide-soignant, pharmacie et équipe de soins.",
    businessData: "Plan de soins, actes, horaires, paramètres, observations, allergies signalées, matériel et transmissions nécessaires.",
    diagnosticQuestions: "Quels soins sont réalisés ? Quelles validations sont requises ? Comment gérez-vous les transmissions et incidents ? Quels paramètres sont suivis ?",
    digitalCapabilities: "Planning de soins, checklists, traçabilité horodatée, transmissions sécurisées, stocks de consommables et alertes de tâches.",
    risksAndLimits: "Respect du champ de compétence, confidentialité, hygiène, protocoles validés ; aucune recommandation clinique autonome.",
    possibleIndicators: "Soins planifiés/réalisés, retards, transmissions incomplètes, consommables à renouveler.",
    projectExample: "Une équipe suit les soins programmés et les tâches non clôturées à la relève.",
    clientValidation: "Valider les protocoles, habilitations, terminologies, droits d'accès et obligations locales."
  },
  {
    id: "profile-33",
    title: "Coach sportif",
    familyId: "family-02",
    sectorIds: ["S02-01"],
    reviewStatus: "documented_unreviewed",
    purpose: "Concevoir et encadrer des séances adaptées aux objectifs, au niveau et aux limites communiquées par les pratiquants.",
    workflow: "Entretien initial → objectifs → vérification des contre-indications déclarées et orientation si besoin → programme → séance → retour → adaptation.",
    actorsAndResponsibilities: "Coach, pratiquant, responsable de salle et professionnel de santé si orientation nécessaire.",
    businessData: "Objectifs, niveau, séances, présence, exercices, charges déclarées, observations et consentements.",
    diagnosticQuestions: "Quels publics accompagnez-vous ? Comment définissez-vous les objectifs ? Comment suivez-vous la progression et les absences ?",
    digitalCapabilities: "Planning, inscriptions, programmes, présences, progression, paiements et communication aux adhérents.",
    risksAndLimits: "Ne pas diagnostiquer ni prescrire de traitement. Adapter l'effort, respecter les limites et orienter vers un professionnel de santé si nécessaire.",
    possibleIndicators: "Assiduité, séances réalisées, renouvellements, progression selon indicateurs convenus.",
    projectExample: "Une salle propose des programmes et suit les séances effectuées sans noter de diagnostic médical.",
    clientValidation: "Valider qualifications, protocoles de sécurité, assurances, collecte des données et règles de responsabilité."
  },
  {
    id: "profile-34",
    title: "Exploitant agricole",
    familyId: "family-03",
    sectorIds: ["S03-01"],
    reviewStatus: "documented_unreviewed",
    purpose: "Planifier les cultures, mobiliser les ressources et suivre les opérations du champ jusqu'à la récolte et à la vente.",
    workflow: "Préparation parcelle → choix cultural → approvisionnement → semis/plantation → entretien → observations → récolte → stockage/vente.",
    actorsAndResponsibilities: "Exploitant, ouvriers, fournisseurs, coopérative, technicien agricole et acheteurs.",
    businessData: "Parcelles, cultures, saisons, intrants, tâches, main-d'œuvre, météo saisie, récoltes, lots et ventes.",
    diagnosticQuestions: "Quelles cultures et parcelles gérez-vous ? Quels calendriers suivez-vous ? Comment enregistrez-vous intrants, coûts, récoltes et pertes ?",
    digitalCapabilities: "Registre parcellaire, calendrier cultural, tâches, stocks d'intrants, suivi des coûts, lots, ventes et rapports.",
    risksAndLimits: "Les conseils agronomiques et phytosanitaires doivent être validés localement. Encadrer les produits dangereux et la traçabilité.",
    possibleIndicators: "Tâches en retard, coûts par parcelle, rendements enregistrés, pertes et stocks disponibles.",
    projectExample: "Une exploitation compare les prévisions de récolte aux quantités réellement pesées et vendues.",
    clientValidation: "Confirmer cultures, unités locales, saisons, pratiques, exigences de traçabilité et droits des utilisateurs."
  },
  {
    id: "profile-35",
    title: "Responsable de boutique",
    familyId: "family-04",
    sectorIds: ["S04-01"],
    reviewStatus: "documented_unreviewed",
    purpose: "Piloter les ventes quotidiennes, les stocks, l'équipe et les encaissements avec une visibilité fiable sur l'activité.",
    workflow: "Ouverture → réception et mise en rayon → vente/encaissement → retours → contrôle caisse → inventaire → clôture.",
    actorsAndResponsibilities: "Gérant, vendeur, caissier, fournisseur, client et comptable.",
    businessData: "Articles, prix, mouvements de stock, ventes, remises, paiements, retours, caisse et fournisseurs.",
    diagnosticQuestions: "Combien de points de vente ? Comment les prix changent-ils ? Quels paiements acceptez-vous ? Qui valide remises, retours et écarts de caisse ?",
    digitalCapabilities: "Catalogue, caisse, inventaire, alertes de seuil, commandes fournisseurs, rapprochement des paiements et rapports.",
    risksAndLimits: "Séparer les rôles, tracer les corrections, protéger les données clients et ne pas assimiler un écart à une fraude sans vérification.",
    possibleIndicators: "Ventes par période, marge estimée, ruptures, retours, écarts de caisse à examiner.",
    projectExample: "Le responsable voit les produits à réapprovisionner et les encaissements par mode de paiement.",
    clientValidation: "Valider les règles fiscales, les moyens de paiement, les unités, les remises et la procédure de clôture."
  },
  {
    id: "profile-36",
    title: "Comptable",
    familyId: "family-05",
    sectorIds: ["S05-01"],
    reviewStatus: "documented_unreviewed",
    purpose: "Enregistrer, contrôler et analyser les opérations comptables selon le référentiel et les règles applicables à l'organisation.",
    workflow: "Collecte pièces → imputation → saisie → rapprochement → contrôles → clôture périodique → états et archivage.",
    actorsAndResponsibilities: "Comptable, direction, clients/fournisseurs, banque, auditeur et administration fiscale.",
    businessData: "Journaux, comptes, pièces, tiers, taxes, échéances, rapprochements et écritures validées.",
    diagnosticQuestions: "Quel référentiel utilisez-vous ? Qui valide les écritures ? Comment gérez-vous les pièces manquantes, clôtures et rapprochements ?",
    digitalCapabilities: "Collecte documentaire, circuits de validation, rapprochement, échéancier, exports comptables et pistes d'audit.",
    risksAndLimits: "Ne pas certifier automatiquement les comptes. Contrôler accès, séparation des tâches, justificatifs et règles fiscales locales.",
    possibleIndicators: "Pièces manquantes, comptes non rapprochés, écritures en attente, délais de clôture.",
    projectExample: "La direction suit les pièces à fournir et les rapprochements restant à valider.",
    clientValidation: "Faire valider le plan comptable, les règles fiscales, les exports, les habilitations et la conservation."
  },
  {
    id: "profile-37",
    title: "Directeur de petite entreprise",
    familyId: "family-06",
    sectorIds: ["S06-01"],
    reviewStatus: "documented_unreviewed",
    purpose: "Coordonner la stratégie, les opérations, les équipes et les ressources à partir d'indicateurs compréhensibles et vérifiables.",
    workflow: "Objectifs → budget → répartition responsabilités → exécution → revue indicateurs → arbitrages → plan d'action.",
    actorsAndResponsibilities: "Dirigeant, responsables, salariés, clients, fournisseurs, partenaires et comptable.",
    businessData: "Objectifs, budgets, ventes, dépenses, trésorerie, ressources, projets, risques et décisions.",
    diagnosticQuestions: "Quels objectifs sont prioritaires ? Qui est responsable de chaque activité ? Quels chiffres sont fiables ? À quelle fréquence faites-vous les revues ?",
    digitalCapabilities: "Tableau de bord, budgets, tâches, validations, suivi commercial, trésorerie de gestion et comptes rendus.",
    risksAndLimits: "Ne pas confondre estimations et chiffres comptabilisés. Limiter l'accès aux données sensibles et conserver la validation humaine des décisions.",
    possibleIndicators: "Objectifs atteints, actions en retard, budget consommé, trésorerie prévisionnelle et incidents opérationnels.",
    projectExample: "Le dirigeant suit chaque semaine ventes, dépenses et actions responsables depuis un tableau de bord.",
    clientValidation: "Confirmer les sources des chiffres, définitions KPI, responsabilités, périodicité et droits de consultation."
  },
  {
    id: "profile-38",
    title: "Conducteur de travaux",
    familyId: "family-07",
    sectorIds: ["S07-03"],
    reviewStatus: "documented_unreviewed",
    purpose: "Préparer et coordonner l'exécution d'un chantier en contrôlant délais, ressources, avancement et points de qualité/sécurité.",
    workflow: "Préparation dossier → planning → approvisionnements → lancement → suivi terrain → contrôles → réception → réserves et clôture.",
    actorsAndResponsibilities: "Conducteur, chef de chantier, ouvriers, sous-traitants, maître d'œuvre, client et fournisseurs.",
    businessData: "Lots, plans, quantités, planning, équipes, matériaux, situations, photos, contrôles et réserves.",
    diagnosticQuestions: "Quels lots et intervenants ? Qui valide les plans et modifications ? Comment mesurez-vous l'avancement ? Comment gérez-vous les réserves ?",
    digitalCapabilities: "Planning, journal chantier, pointage, approvisionnement, photos, demandes de modification, réserves et rapports.",
    risksAndLimits: "Les validations techniques et réglementaires restent aux professionnels habilités. Gérer les risques chantier et les versions des plans.",
    possibleIndicators: "Retards par lot, approvisionnements manquants, réserves ouvertes, tâches bloquées.",
    projectExample: "Le client visualise l'avancement par lot et les réserves sans remplacer les visas techniques.",
    clientValidation: "Valider marchés, rôles, unités, circuits de visa, sécurité et exigences de réception."
  },
  {
    id: "profile-39",
    title: "Formateur professionnel",
    familyId: "family-08",
    sectorIds: ["S08-01"],
    reviewStatus: "documented_unreviewed",
    purpose: "Préparer et animer des apprentissages, évaluer les acquis selon des critères explicites et suivre les parcours des apprenants.",
    workflow: "Analyse besoin → objectifs pédagogiques → préparation supports → séance → évaluation → remédiation → bilan.",
    actorsAndResponsibilities: "Formateur, apprenants, responsable pédagogique, entreprise partenaire et financeur.",
    businessData: "Programmes, séances, présences, supports, évaluations, compétences, résultats et attestations.",
    diagnosticQuestions: "Quelles compétences doivent être acquises ? Comment évaluez-vous ? Qui valide les programmes et attestations ? Comment gérez-vous les absences ?",
    digitalCapabilities: "Catalogue de formation, classes, ressources, présence, évaluations, progression, attestations et rapports.",
    risksAndLimits: "Protéger les résultats individuels, garantir l'accessibilité et ne délivrer des attestations qu'après validation autorisée.",
    possibleIndicators: "Assiduité, progression, évaluations terminées, abandons et attestations en attente.",
    projectExample: "Un centre repère les apprenants nécessitant un accompagnement à partir des absences et évaluations validées.",
    clientValidation: "Confirmer référentiels, critères, règles d'assiduité, modalités d'évaluation et habilitations."
  },
  {
    id: "profile-40",
    title: "Responsable de restaurant",
    familyId: "family-10",
    sectorIds: ["S10-01"],
    reviewStatus: "documented_unreviewed",
    purpose: "Coordonner la production, le service, les équipes, les approvisionnements et l'hygiène d'un établissement de restauration.",
    workflow: "Prévision activité → achats → réception → stockage → préparation → service → encaissement → nettoyage et clôture.",
    actorsAndResponsibilities: "Gérant, chef, cuisiniers, serveurs, caisse, fournisseurs et clients.",
    businessData: "Menus, recettes, allergènes déclarés, stocks, achats, températures contrôlées, commandes, ventes et pertes.",
    diagnosticQuestions: "Quels services et menus ? Comment gérez-vous les allergènes ? Qui contrôle réception et températures ? Comment mesurez-vous pertes et coûts ?",
    digitalCapabilities: "Gestion menus, fiches recettes, achats, stock, commandes, planning, caisse, suivi des contrôles et rapports.",
    risksAndLimits: "Les contrôles sanitaires doivent suivre les protocoles et autorités compétentes. Ne pas inventer ou déduire les allergènes ; validation humaine obligatoire.",
    possibleIndicators: "Ruptures, pertes, coût matière estimé, commandes servies, contrôles à effectuer.",
    projectExample: "Le responsable compare ventes et consommations théoriques pour repérer les écarts à vérifier.",
    clientValidation: "Valider recettes, allergènes, unités, contrôles sanitaires, rôles et obligations locales."
  },
  {
    id: "profile-41",
    title: "Chauffeur professionnel",
    familyId: "family-09",
    sectorIds: ["S09-01","S09-02"],
    reviewStatus: "documented_unreviewed",
    purpose: "Transporter des personnes dans des conditions planifiées, sûres et conformes aux règles applicables.",
    workflow: "Réservation ou mission → vérification du véhicule → prise en charge → trajet → remise du client → clôture et signalement des incidents.",
    actorsAndResponsibilities: "Chauffeur, exploitant, client, répartiteur, mécanicien et autorité compétente selon le transport.",
    businessData: "Permis et habilitations utiles, véhicule, mission, horaires, itinéraire, frais, incidents et entretien.",
    diagnosticQuestions: "Quels trajets effectuez-vous ? Qui affecte les missions ? Comment suivez-vous carburant, entretien, retards et incidents ?",
    digitalCapabilities: "Planning des courses, affectations, carnet véhicule, dépenses, alertes d'entretien et suivi client.",
    risksAndLimits: "Ne pas remplacer les règles de sécurité routière ni collecter inutilement les déplacements personnels. Vérifier les autorisations professionnelles.",
    possibleIndicators: "Courses réalisées, retards, coûts par trajet, entretiens à échéance et incidents déclarés.",
    projectExample: "Une entreprise répartit les courses et compare les dépenses de carburant par véhicule.",
    clientValidation: "Valider permis, assurances, autorisations, politique de géolocalisation et règles de sécurité."
  },
  {
    id: "profile-42",
    title: "Gestionnaire logistique",
    familyId: "family-09",
    sectorIds: ["S09-03"],
    reviewStatus: "documented_unreviewed",
    purpose: "Organiser les flux de marchandises, les stocks en transit, les transporteurs et la livraison.",
    workflow: "Commande → préparation → réservation transport → expédition → suivi → réception → preuve de livraison → traitement des écarts.",
    actorsAndResponsibilities: "Gestionnaire, magasinier, transporteur, fournisseur, client et service commercial.",
    businessData: "Commandes, colis, poids, volumes, lots, transporteurs, coûts, étapes, preuves et réclamations.",
    diagnosticQuestions: "Quels flux gérez-vous ? Comment choisissez-vous les transporteurs ? Qui confirme la réception ? Comment traitez-vous les pertes ou retards ?",
    digitalCapabilities: "Suivi expéditions, affectation transporteurs, scan colis, preuves de livraison, coûts et gestion des anomalies.",
    risksAndLimits: "Les preuves et statuts doivent être vérifiables. Limiter l'accès aux données clients et ne pas déclarer livré sans preuve.",
    possibleIndicators: "Livraisons à l'heure, colis en anomalie, coût par expédition, temps de transit.",
    projectExample: "Un distributeur suit les commandes depuis l'entrepôt jusqu'à la confirmation du destinataire.",
    clientValidation: "Valider unités, transporteurs, preuves acceptées, responsabilités et règles douanières si transfrontalier."
  },
  {
    id: "profile-43",
    title: "Agent de réservation de voyages",
    familyId: "family-11",
    sectorIds: ["S11-03"],
    reviewStatus: "documented_unreviewed",
    purpose: "Conseiller et organiser des prestations de voyage en respectant les choix, délais et conditions des fournisseurs.",
    workflow: "Recueil du besoin → proposition → vérification disponibilités → devis → validation et paiement → émission documents → assistance.",
    actorsAndResponsibilities: "Agent, voyageur, agence, compagnie, hébergeur, assureur et prestataire local.",
    businessData: "Profil voyageur, dates, itinéraire, devis, réservations, paiements, billets, conditions et demandes d'assistance.",
    diagnosticQuestions: "Quels produits vendez-vous ? Comment confirmez-vous une disponibilité ? Qui valide les remboursements et modifications ?",
    digitalCapabilities: "CRM voyageurs, dossiers de réservation, échéances, documents, suivi des paiements et demandes après-vente.",
    risksAndLimits: "Ne jamais promettre une disponibilité sans confirmation fournisseur. Protéger passeports, coordonnées et informations de paiement.",
    possibleIndicators: "Dossiers en attente, échéances, modifications, annulations et ventes par prestation.",
    projectExample: "Une agence visualise les dossiers dont les billets ou pièces restent à confirmer.",
    clientValidation: "Valider contrats fournisseurs, conditions d'annulation, responsabilités, conservation des documents et paiements."
  },
  {
    id: "profile-44",
    title: "Organisateur d'événements",
    familyId: "family-11",
    sectorIds: ["S11-01"],
    reviewStatus: "documented_unreviewed",
    purpose: "Concevoir et coordonner un événement en maîtrisant programme, prestataires, budget, participants et déroulement.",
    workflow: "Brief → concept → budget → réservation lieu → prestataires → inscriptions → exécution → bilan et règlement.",
    actorsAndResponsibilities: "Organisateur, client, lieu, technique, sécurité, restauration, artistes, participants et fournisseurs.",
    businessData: "Programme, budget, contrats, tâches, invités, inscriptions, paiements, plans, incidents et livrables.",
    diagnosticQuestions: "Quels formats d'événements ? Qui décide du budget ? Comment gérez-vous les invités, prestataires, changements et incidents ?",
    digitalCapabilities: "Gestion de projet, budget, invitations, billetterie, planning, checklists, contrats et bilan.",
    risksAndLimits: "Respecter autorisations, sécurité, droit à l'image, données des participants et plans de secours.",
    possibleIndicators: "Tâches critiques en retard, budget engagé, inscriptions, prestataires confirmés et incidents ouverts.",
    projectExample: "Un organisateur pilote les étapes d'un événement et visualise les validations manquantes.",
    clientValidation: "Valider capacité, autorisations, responsabilités, assurances, consentements photo et règles de remboursement."
  },
  {
    id: "profile-45",
    title: "Responsable recrutement",
    familyId: "family-12",
    sectorIds: ["S12-01"],
    reviewStatus: "documented_unreviewed",
    purpose: "Organiser les recrutements de manière équitable, traçable et cohérente avec les besoins du poste.",
    workflow: "Demande de poste → validation → publication → candidatures → présélection humaine → entretiens → décision → intégration.",
    actorsAndResponsibilities: "RH, manager recruteur, candidat, direction et éventuellement organisme de formation.",
    businessData: "Poste, critères, candidatures, étapes, entretiens, évaluations documentées et décision.",
    diagnosticQuestions: "Qui ouvre un poste ? Quels critères sont indispensables ? Qui mène les entretiens ? Comment informez-vous les candidats ?",
    digitalCapabilities: "Suivi des candidatures, calendrier, grilles d'entretien validées, échanges et parcours d'intégration.",
    risksAndLimits: "Pas de décision automatisée discriminatoire. Limiter les données, respecter les durées de conservation et permettre une revue humaine.",
    possibleIndicators: "Délai de recrutement, postes ouverts, entretiens planifiés, candidats en attente de réponse.",
    projectExample: "Une organisation suit chaque recrutement et rappelle les retours à envoyer.",
    clientValidation: "Valider critères objectifs, base légale, accès aux dossiers, conservation et obligations du droit du travail."
  },
  {
    id: "profile-46",
    title: "Gestionnaire de paie",
    familyId: "family-12",
    sectorIds: ["S12-03"],
    reviewStatus: "documented_unreviewed",
    purpose: "Préparer et contrôler les éléments variables de rémunération pour une paie validée par les responsables habilités.",
    workflow: "Collecte présence et variables → contrôles → calcul selon paramètres validés → vérification → validation → édition et archivage sécurisé.",
    actorsAndResponsibilities: "Gestionnaire paie, RH, manager, comptable, salarié et prestataire habilité.",
    businessData: "Contrat, absences, heures, primes, retenues, avances, paramètres légaux et bulletins.",
    diagnosticQuestions: "Quelles règles et conventions s'appliquent ? Qui valide les variables ? Comment corrigez-vous une anomalie ?",
    digitalCapabilities: "Collecte des variables, workflow de validation, exports paie, historique et échéancier.",
    risksAndLimits: "Données salariales hautement confidentielles. Ne pas inventer les règles fiscales ou sociales ; calculs validés par un professionnel.",
    possibleIndicators: "Variables manquantes, paies en attente, corrections et échéances déclaratives.",
    projectExample: "Le service RH repère les heures et absences non validées avant transmission au logiciel de paie.",
    clientValidation: "Faire valider les paramètres par un spécialiste local, les habilitations et les exigences de conservation."
  },
  {
    id: "profile-47",
    title: "Électricien bâtiment",
    familyId: "family-13",
    sectorIds: ["S13-02"],
    reviewStatus: "documented_unreviewed",
    purpose: "Installer, contrôler et dépanner des équipements électriques dans le périmètre de ses habilitations.",
    workflow: "Demande → diagnostic sécurisé → devis → consignation si requise → intervention → essais → compte rendu.",
    actorsAndResponsibilities: "Électricien, client, maître d'ouvrage, fournisseur et organisme de contrôle si applicable.",
    businessData: "Site, installation, schémas, matériel, mesures, intervention, pièces et réserves.",
    diagnosticQuestions: "Quels types d'installations ? Quelles habilitations ? Comment gérez-vous devis, pièces, essais et maintenance ?",
    digitalCapabilities: "Planning d'intervention, devis, inventaire matériel, fiches d'essai, photos autorisées et maintenance.",
    risksAndLimits: "Risque électrique majeur. Le logiciel ne remplace ni habilitation, ni consignation, ni normes et contrôles obligatoires.",
    possibleIndicators: "Interventions planifiées, retours, pièces consommées, réserves et maintenances échues.",
    projectExample: "Une société suit les dépannages et garde l'historique des interventions par site.",
    clientValidation: "Valider habilitations, normes locales, procédure de consignation, contrôles et assurances."
  },
  {
    id: "profile-48",
    title: "Menuisier",
    familyId: "family-13",
    sectorIds: ["S13-01"],
    reviewStatus: "documented_unreviewed",
    purpose: "Concevoir, fabriquer, assembler et poser des ouvrages en bois ou matériaux associés selon les dimensions convenues.",
    workflow: "Prise de mesure → conception → choix matière → devis → débit → fabrication → finition → pose → réception.",
    actorsAndResponsibilities: "Menuisier, client, apprenti, fournisseur et poseur partenaire.",
    businessData: "Mesures, plans, matériaux, quincaillerie, temps, devis, commandes, étapes et réserves.",
    diagnosticQuestions: "Quels ouvrages fabriquez-vous ? Comment validez-vous mesures et plans ? Comment suivez-vous chutes, coûts et délais ?",
    digitalCapabilities: "Fiches projets, bibliothèque de plans, devis, achats, temps atelier, photos et réception.",
    risksAndLimits: "Vérifier mesures et plans avant fabrication. Encadrer machines, poussières, équipements de protection et sécurité atelier.",
    possibleIndicators: "Commandes en cours, délais, consommation matière, reprises et marge estimée.",
    projectExample: "Un atelier suit chaque meuble depuis le métrage jusqu'à la pose validée.",
    clientValidation: "Valider unités, tolérances, plans, règles de sécurité, garanties et modalités de réception."
  },
  {
    id: "profile-49",
    title: "Technicien de maintenance industrielle",
    familyId: "family-13",
    sectorIds: ["S13-04"],
    reviewStatus: "documented_unreviewed",
    purpose: "Maintenir les équipements en état de fonctionnement par des interventions préventives et correctives sécurisées.",
    workflow: "Signalement → priorisation → autorisation → consignation adaptée → intervention → essais → remise en service → historique.",
    actorsAndResponsibilities: "Technicien, responsable maintenance, opérateur, production, fournisseur et HSE.",
    businessData: "Équipement, gamme, pièces, mesures, heures, arrêts, interventions, causes observées et validations.",
    diagnosticQuestions: "Quels équipements ? Comment planifiez-vous préventif et arrêts ? Qui autorise la remise en service ? Où sont les notices ?",
    digitalCapabilities: "GMAO, ordres de travail, stocks pièces, historiques, alertes, contrôles et indicateurs de disponibilité.",
    risksAndLimits: "Ne pas automatiser les autorisations de sécurité. Respecter consignations, habilitations, notices et procédures du site.",
    possibleIndicators: "Pannes, temps d'arrêt, préventif réalisé, pièces critiques et récurrence des incidents.",
    projectExample: "Une usine visualise les maintenances dues et les machines immobilisées.",
    clientValidation: "Valider référentiels équipements, procédures HSE, habilitations et règles de remise en service."
  },
  {
    id: "profile-50",
    title: "Aide à domicile",
    familyId: "family-14",
    sectorIds: ["S14-01"],
    reviewStatus: "documented_unreviewed",
    purpose: "Accompagner une personne dans les actes et tâches convenus, en respectant son autonomie et son plan d'accompagnement.",
    workflow: "Planification → visite → vérification des consignes → accompagnement → transmission factuelle → signalement si nécessaire.",
    actorsAndResponsibilities: "Bénéficiaire, intervenant, proche autorisé, coordinateur et professionnel de santé si besoin.",
    businessData: "Planning, tâches convenues, présence, observations strictement nécessaires, contacts autorisés et incidents.",
    diagnosticQuestions: "Quelles tâches sont prévues ? Qui autorise les changements ? Comment signalez-vous une situation urgente ?",
    digitalCapabilities: "Planning, pointage, fiches de visite, consignes autorisées, transmissions et remplacements.",
    risksAndLimits: "Protéger la dignité et la vie privée. Ne pas effectuer d'acte médical hors compétence et appliquer les protocoles d'urgence.",
    possibleIndicators: "Visites réalisées, remplacements, tâches reportées et alertes transmises.",
    projectExample: "Une structure organise les tournées et sait quelles visites nécessitent une relève.",
    clientValidation: "Valider périmètre d'intervention, consentement, accès aux données, urgences et réglementation locale."
  },
  {
    id: "profile-51",
    title: "Assistant administratif",
    familyId: "family-15",
    sectorIds: ["S15-01"],
    reviewStatus: "documented_unreviewed",
    purpose: "Assurer le traitement organisé des dossiers, courriers, rendez-vous et demandes administratives.",
    workflow: "Réception → enregistrement → vérification complétude → affectation → traitement → validation → notification → archivage.",
    actorsAndResponsibilities: "Agent, responsable, usager, service métier et organisme partenaire.",
    businessData: "Référence dossier, demande, pièces, dates, statut, affectation, décisions et traces de notification.",
    diagnosticQuestions: "Quels dossiers recevez-vous ? Quels délais ? Qui instruit et qui signe ? Comment gérez-vous les pièces manquantes ?",
    digitalCapabilities: "Registre des demandes, workflow, documents, échéances, modèles de courrier et historique.",
    risksAndLimits: "Ne pas prendre de décision administrative sans délégation. Protéger les données et garantir traçabilité et recours applicables.",
    possibleIndicators: "Dossiers en attente, délais, pièces manquantes, demandes réorientées.",
    projectExample: "Un service suit les demandes entrantes et identifie les dossiers bloqués par pièce manquante.",
    clientValidation: "Valider compétences de signature, délais légaux, classification des dossiers et politique d'archivage."
  },
  {
    id: "profile-52",
    title: "Juriste d'entreprise",
    familyId: "family-16",
    sectorIds: ["S16-01"],
    reviewStatus: "documented_unreviewed",
    purpose: "Identifier les enjeux juridiques des activités et préparer des analyses ou documents soumis à validation compétente.",
    workflow: "Demande → collecte des faits et pièces → recherche du droit applicable → analyse → options → validation → suivi échéances.",
    actorsAndResponsibilities: "Juriste, direction, opérationnels, avocat, conformité et partenaires.",
    businessData: "Contrats, versions, parties, obligations, risques identifiés, avis, échéances et validations.",
    diagnosticQuestions: "Quels pays et textes s'appliquent ? Qui valide les actes ? Comment suivez-vous échéances et versions contractuelles ?",
    digitalCapabilities: "Bibliothèque contractuelle, workflow de revue, alertes, registre des obligations et suivi des litiges.",
    risksAndLimits: "Ne pas présenter une réponse générée comme avis juridique définitif. Vérifier juridiction, actualité des textes et habilitations.",
    possibleIndicators: "Contrats à renouveler, revues en attente, obligations échues, demandes ouvertes.",
    projectExample: "Une entreprise suit les clauses et dates clés des contrats sans automatiser la décision juridique.",
    clientValidation: "Valider juridiction, sources, secret professionnel éventuel, délégations et politique documentaire."
  },
  {
    id: "profile-53",
    title: "Développeur logiciel",
    familyId: "family-17",
    sectorIds: ["S17-01"],
    reviewStatus: "documented_unreviewed",
    purpose: "Concevoir, développer, tester et maintenir des logiciels répondant à des besoins utilisateurs.",
    workflow: "Cadrage → spécification → conception → développement → revue → tests → livraison → maintenance.",
    actorsAndResponsibilities: "Développeur, produit, designer, QA, sécurité, utilisateurs et exploitant.",
    businessData: "Besoins, user stories, code, versions, dépendances, tests, incidents et décisions d'architecture.",
    diagnosticQuestions: "Quels utilisateurs et contraintes ? Quels systèmes intégrer ? Comment gérez-vous accès, tests, versions et incidents ?",
    digitalCapabilities: "Gestion de backlog, dépôt code, CI, tests, documentation, suivi bugs et déploiements contrôlés.",
    risksAndLimits: "Sécuriser secrets et données. Revue humaine du code, tests et permissions avant mise en production.",
    possibleIndicators: "Défauts ouverts, couverture de tests, délai de livraison, incidents et dette technique.",
    projectExample: "Une équipe suit les demandes d'évolution et associe chaque livraison à ses tests.",
    clientValidation: "Valider architecture, licences, sécurité, sauvegardes, conformité et responsabilités d'exploitation."
  },
  {
    id: "profile-54",
    title: "Technicien télécoms et réseaux",
    familyId: "family-17",
    sectorIds: ["S17-03"],
    reviewStatus: "documented_unreviewed",
    purpose: "Installer et maintenir les équipements et liaisons de communication selon les procédures techniques et habilitations.",
    workflow: "Demande → diagnostic → préparation → intervention → tests de liaison → mise en service → compte rendu.",
    actorsAndResponsibilities: "Technicien, superviseur, client, opérateur, fournisseur et équipe sécurité.",
    businessData: "Sites, équipements, ports, configurations autorisées, mesures, incidents et interventions.",
    diagnosticQuestions: "Quels réseaux et équipements ? Quelles autorisations d'accès ? Comment documentez-vous les configurations et pannes ?",
    digitalCapabilities: "Inventaire réseau, tickets, planning, cartographie contrôlée, mesures et historique d'intervention.",
    risksAndLimits: "Ne pas exposer configurations sensibles, identifiants ou topologies critiques. Respecter travail en hauteur et sécurité électrique.",
    possibleIndicators: "Pannes ouvertes, disponibilité déclarée, interventions répétées et équipements à maintenir.",
    projectExample: "Un opérateur suit les interventions terrain et les tests de rétablissement.",
    clientValidation: "Valider habilitations, accès, sauvegarde des configurations, sécurité et engagements de service."
  },
  {
    id: "profile-55",
    title: "Technicien solaire photovoltaïque",
    familyId: "family-18",
    sectorIds: ["S18-01"],
    reviewStatus: "documented_unreviewed",
    purpose: "Installer et entretenir des systèmes photovoltaïques en respectant les dimensionnements et règles de sécurité validés.",
    workflow: "Étude du site → dimensionnement validé → devis → installation → tests → mise en service → maintenance.",
    actorsAndResponsibilities: "Technicien, ingénieur, client, fournisseur, distributeur et organisme de contrôle.",
    businessData: "Site, puissance, panneaux, onduleurs, batteries, schémas, mesures, garanties et interventions.",
    diagnosticQuestions: "Quels systèmes installez-vous ? Qui valide le dimensionnement ? Comment suivez-vous batteries, garanties et maintenance ?",
    digitalCapabilities: "CRM chantiers, inventaire équipements, fiches d'installation, suivi garanties, tickets et maintenance.",
    risksAndLimits: "Risque électrique et travail en hauteur. Ne pas calculer ou certifier une installation sans validation d'un professionnel habilité.",
    possibleIndicators: "Installations réceptionnées, défauts, maintenances dues, garanties et disponibilité mesurée.",
    projectExample: "Une entreprise suit les équipements installés chez chaque client et planifie les visites de maintenance.",
    clientValidation: "Valider normes électriques, dimensionnement, habilitations, assurances et règles de raccordement locales."
  },
  {
    id: "profile-56",
    title: "Agent de sécurité",
    familyId: "family-19",
    sectorIds: ["S19-01"],
    reviewStatus: "documented_unreviewed",
    purpose: "Prévenir les incidents et appliquer les consignes de surveillance et d'alerte dans les limites de son mandat.",
    workflow: "Prise de poste → consignes → rondes autorisées → observation → signalement → relève → rapport.",
    actorsAndResponsibilities: "Agent, chef d'équipe, client, secours et autorités selon protocole.",
    businessData: "Poste, consignes, horaires, rondes, événements observés, alertes et relève.",
    diagnosticQuestions: "Quels sites et risques ? Quelles consignes ? Qui reçoit les alertes ? Quelles limites d'intervention et de recours à la force ?",
    digitalCapabilities: "Planning, registre de poste, rondes, incidents, consignes et transmission à la relève.",
    risksAndLimits: "Respecter droits des personnes, proportionnalité, confidentialité et règles locales. Pas de surveillance intrusive non autorisée.",
    possibleIndicators: "Rondes effectuées, incidents signalés, consignes non lues et relèves en attente.",
    projectExample: "Un site conserve un journal factuel des événements et consignes transmises.",
    clientValidation: "Valider agréments, cadre d'intervention, règles de preuve, conservation des images et escalade d'urgence."
  },
  {
    id: "profile-57",
    title: "Responsable associatif",
    familyId: "family-20",
    sectorIds: ["S20-01"],
    reviewStatus: "documented_unreviewed",
    purpose: "Coordonner la vie de l'association, ses membres, activités, ressources et obligations de gouvernance.",
    workflow: "Adhésion → assemblée et décisions → plan d'action → activités → suivi financier → rapport et renouvellement.",
    actorsAndResponsibilities: "Bureau, membres, bénévoles, partenaires, bénéficiaires et financeurs.",
    businessData: "Membres, cotisations, décisions, projets, dépenses, recettes, justificatifs et rapports.",
    diagnosticQuestions: "Comment adhère-t-on ? Qui autorise les dépenses ? Comment sont consignées les décisions et activités ?",
    digitalCapabilities: "Gestion membres, cotisations, réunions, tâches, budget, dons, rapports et communication.",
    risksAndLimits: "Protéger les coordonnées des membres, respecter les statuts et distinguer fonds affectés et fonds libres.",
    possibleIndicators: "Adhésions actives, cotisations, projets, dépenses justifiées et décisions à exécuter.",
    projectExample: "Une association suit ses cotisations et les actions décidées en assemblée.",
    clientValidation: "Valider statuts, délégations, règles comptables, obligations déclaratives et confidentialité."
  },
  {
    id: "profile-58",
    title: "Gestionnaire de déchets",
    familyId: "family-18",
    sectorIds: ["S18-05"],
    reviewStatus: "documented_unreviewed",
    purpose: "Organiser la collecte, le tri, la traçabilité et l'orientation des déchets vers les filières autorisées.",
    workflow: "Signalement → collecte → pesée/estimation → tri → stockage temporaire → transfert → preuve de traitement.",
    actorsAndResponsibilities: "Gestionnaire, collecteur, entreprise, centre de traitement, commune et contrôleur.",
    businessData: "Type de déchet, origine, volume, date, transporteur, destination, preuve et incident.",
    diagnosticQuestions: "Quels déchets et filières ? Qui est autorisé à transporter ou traiter ? Comment prouvez-vous la destination finale ?",
    digitalCapabilities: "Registre des collectes, tournées, pesées, bordereaux, incidents et indicateurs de tri.",
    risksAndLimits: "Ne pas mélanger catégories dangereuses. Respecter les filières autorisées, équipements de protection et obligations environnementales.",
    possibleIndicators: "Volumes collectés, taux de tri, enlèvements en retard et justificatifs manquants.",
    projectExample: "Une structure suit les enlèvements et garde les preuves de transfert vers les filières.",
    clientValidation: "Valider classification, autorisations, documents de suivi, stockage et obligations locales."
  },
  {
    id: "profile-59",
    title: "Responsable conformité",
    familyId: "family-16",
    sectorIds: ["S16-05"],
    reviewStatus: "documented_unreviewed",
    purpose: "Organiser le suivi des obligations applicables et documenter les contrôles et actions correctives.",
    workflow: "Cartographie obligations → attribution → contrôle → constat → plan d'action → preuve → revue périodique.",
    actorsAndResponsibilities: "Conformité, direction, métiers, audit, juridique et autorités selon secteur.",
    businessData: "Obligation, source, périmètre, propriétaire, échéance, preuve, constat et action corrective.",
    diagnosticQuestions: "Quelles obligations et juridictions ? Qui en est responsable ? Quelles preuves sont exigées ? Comment escalader un retard ?",
    digitalCapabilities: "Registre des obligations, contrôles, alertes, preuves, plans d'action et rapports.",
    risksAndLimits: "Ne pas déclarer la conformité sans preuve. Vérifier actualité des textes et indépendance des contrôles.",
    possibleIndicators: "Obligations échues, contrôles réalisés, actions en retard et preuves manquantes.",
    projectExample: "Une organisation suit les obligations par service et prépare les éléments d'audit.",
    clientValidation: "Faire valider périmètre, sources officielles, responsables, fréquence et règles de conservation."
  },
  {
    id: "profile-60",
    title: "Gestionnaire de flotte automobile",
    familyId: "family-09",
    sectorIds: ["S09-04"],
    reviewStatus: "documented_unreviewed",
    purpose: "Maintenir une flotte disponible, sûre et maîtrisée en coûts, affectations et entretien.",
    workflow: "Affectation → départ → suivi kilométrage et carburant → retour → contrôle → maintenance → renouvellement.",
    actorsAndResponsibilities: "Gestionnaire flotte, conducteur, atelier, assurance, fournisseur et direction.",
    businessData: "Véhicule, conducteur habilité, kilométrage, carburant, entretien, assurance, documents et incidents.",
    diagnosticQuestions: "Combien de véhicules ? Qui peut les conduire ? Comment validez-vous dépenses, réparations et affectations ?",
    digitalCapabilities: "Registre flotte, réservation, carnet véhicule, alertes documents, carburant, coûts et maintenance.",
    risksAndLimits: "Limiter la géolocalisation, protéger les données conducteurs et ne pas retarder une réparation de sécurité.",
    possibleIndicators: "Disponibilité flotte, coût par véhicule, entretiens dus, consommation et immobilisations.",
    projectExample: "Une entreprise repère les véhicules dont assurance ou visite technique approche.",
    clientValidation: "Valider responsabilités, permis, assurances, contrôles obligatoires et politique de suivi des conducteurs."
  },
  {
    id: "profile-61",
    title: "Sage-femme",
    familyId: "family-01",
    sectorIds: ["S01-03"],
    reviewStatus: "documented_unreviewed",
    purpose: "Accompagner la santé maternelle et néonatale dans le cadre de ses compétences et protocoles.",
    workflow: "Accueil et suivi → consultations et actes autorisés → surveillance → orientation si signe d'alerte → transmissions → suivi postnatal.",
    actorsAndResponsibilities: "Sage-femme, patiente, famille selon consentement, médecin, maternité et laboratoire.",
    businessData: "Rendez-vous, antécédents pertinents, suivi grossesse, observations, actes, résultats et orientation.",
    diagnosticQuestions: "Quels services assurez-vous ? Quels protocoles d'urgence ? Comment gérez-vous les rendez-vous, dossiers et références ?",
    digitalCapabilities: "Agenda, dossier sécurisé, rappels, suivi de visites, transmissions et rapports agrégés.",
    risksAndLimits: "Données de santé très sensibles. Respecter les compétences, protocoles nationaux, consentement et confidentialité ; aucun diagnostic automatisé.",
    possibleIndicators: "Visites planifiées, rendez-vous manqués, orientations et suivis à réaliser.",
    projectExample: "Une maternité suit les rendez-vous prénataux et les visites postnatales restant à planifier.",
    clientValidation: "Faire valider les protocoles par les professionnels autorisés et les règles sanitaires locales."
  },
  {
    id: "profile-62",
    title: "Arbitre sportif",
    familyId: "family-02",
    sectorIds: ["S02-04"],
    reviewStatus: "documented_unreviewed",
    purpose: "Appliquer les règles de la discipline et garantir le déroulement équitable d'une rencontre.",
    workflow: "Désignation → confirmation → contrôle administratif → briefing → arbitrage → rapport → traitement des contestations selon règlement.",
    actorsAndResponsibilities: "Arbitre, fédération, clubs, équipes, délégué, organisateur et commission disciplinaire.",
    businessData: "Match, équipes, licences, désignations, décisions consignées, incidents et rapports.",
    diagnosticQuestions: "Qui désigne les arbitres ? Comment gérez-vous indisponibilités, rapports et contestations ? Quelles règles de publication ?",
    digitalCapabilities: "Planning des rencontres, désignations, disponibilités, rapports et archivage des décisions.",
    risksAndLimits: "Respecter règlement de la fédération, neutralité, sécurité et procédure contradictoire ; ne pas automatiser les sanctions.",
    possibleIndicators: "Désignations confirmées, rapports remis, matchs couverts et contestations ouvertes.",
    projectExample: "Une ligue suit les arbitres affectés aux rencontres et les rapports encore attendus.",
    clientValidation: "Valider règlement sportif, habilitations, confidentialité et circuit d'appel."
  },
  {
    id: "profile-63",
    title: "Vétérinaire",
    familyId: "family-03",
    sectorIds: ["S03-03"],
    reviewStatus: "documented_unreviewed",
    purpose: "Prévenir, diagnostiquer et traiter les problèmes de santé animale dans le champ d'exercice autorisé.",
    workflow: "Demande → examen → hypothèses et examens → décision vétérinaire → traitement ou prévention → suivi et traçabilité.",
    actorsAndResponsibilities: "Vétérinaire, propriétaire ou éleveur, auxiliaire, laboratoire et autorité sanitaire.",
    businessData: "Animal ou cheptel, identification, historique, examen, prescriptions, vaccins, lots et suivi.",
    diagnosticQuestions: "Quelles espèces et activités ? Comment gérez-vous urgences, vaccinations, stocks et visites d'élevage ?",
    digitalCapabilities: "Dossiers animaux, agenda, rappels vaccinaux, stocks, lots, facturation et suivi de visites.",
    risksAndLimits: "Décisions cliniques réservées au vétérinaire. Respecter biosécurité, médicaments réglementés et confidentialité du client.",
    possibleIndicators: "Visites de suivi, rappels, vaccinations, stocks sensibles et résultats en attente.",
    projectExample: "Un cabinet suit les vaccinations et visites d'élevage par exploitation.",
    clientValidation: "Valider les protocoles vétérinaires, habilitations, règles pharmaceutiques et exigences sanitaires."
  },
  {
    id: "profile-64",
    title: "Gestionnaire e-commerce",
    familyId: "family-04",
    sectorIds: ["S04-03"],
    reviewStatus: "documented_unreviewed",
    purpose: "Piloter un canal de vente en ligne depuis le catalogue jusqu'à la livraison et au service après-vente.",
    workflow: "Publication catalogue → commande → paiement confirmé → préparation → expédition → livraison → retour ou réclamation.",
    actorsAndResponsibilities: "Gestionnaire, client, préparateur, transporteur, paiement, fournisseur et support.",
    businessData: "Produits, prix, stock, commandes, paiements, adresses, expéditions, retours et consentements.",
    diagnosticQuestions: "Quels canaux de vente ? Comment synchronisez-vous stocks et prix ? Quelle preuve confirme un paiement et une livraison ?",
    digitalCapabilities: "Catalogue, commandes, intégration paiement, stock, livraison, retours, CRM et analytics.",
    risksAndLimits: "Ne pas stocker les données de carte. Vérifier les paiements via le prestataire et respecter protection consommateur et données personnelles.",
    possibleIndicators: "Conversion, commandes non réglées, retours, délais d'expédition et ruptures.",
    projectExample: "Une boutique suit les commandes de plusieurs canaux sans vendre un stock indisponible.",
    clientValidation: "Valider prestataires, fiscalité, conditions de vente, remboursements et sécurité des données."
  },
  {
    id: "profile-65",
    title: "Courtier en assurance",
    familyId: "family-05",
    sectorIds: ["S05-04"],
    reviewStatus: "documented_unreviewed",
    purpose: "Analyser le besoin d'assurance et accompagner la comparaison, la souscription et le suivi des contrats selon mandat.",
    workflow: "Recueil besoin → analyse exposition → consultation assureurs → proposition → accord client → souscription → suivi échéances et sinistres.",
    actorsAndResponsibilities: "Courtier, client, assureur, expert, gestionnaire sinistre et autorité compétente.",
    businessData: "Profil risque, garanties, exclusions, primes, échéances, pièces, contrats et sinistres.",
    diagnosticQuestions: "Quels produits et assureurs ? Comment documentez-vous le conseil ? Qui confirme garanties et primes ?",
    digitalCapabilities: "CRM clients, comparatif d'offres, échéances, pièces, suivi sinistres et commissions.",
    risksAndLimits: "Le conseil et la vente exigent les autorisations applicables. Ne pas promettre une couverture non confirmée ; protéger les dossiers.",
    possibleIndicators: "Contrats à renouveler, propositions en attente, sinistres suivis et pièces manquantes.",
    projectExample: "Un cabinet rappelle les échéances et suit les demandes de sinistre par assureur.",
    clientValidation: "Valider agréments, devoir de conseil, mandats, exclusions et conservation documentaire."
  },
  {
    id: "profile-66",
    title: "Chef de projet",
    familyId: "family-06",
    sectorIds: ["S06-03"],
    reviewStatus: "documented_unreviewed",
    purpose: "Organiser les ressources, jalons, risques et livrables d'un projet pour atteindre les objectifs convenus.",
    workflow: "Cadrage → découpage → estimation → planification → exécution → suivi → arbitrage → recette et clôture.",
    actorsAndResponsibilities: "Chef de projet, sponsor, équipe, fournisseurs, utilisateurs et contrôleur qualité.",
    businessData: "Objectifs, périmètre, tâches, jalons, charges, coûts, risques, décisions et livrables.",
    diagnosticQuestions: "Qui sponsorise ? Quels critères d'acceptation ? Comment gérez-vous changements, dépendances et dépassements ?",
    digitalCapabilities: "Backlog, planning, budget, registre de risques, décisions, livrables et comptes rendus.",
    risksAndLimits: "Les estimations restent des hypothèses. Les changements de périmètre et validations doivent être explicites.",
    possibleIndicators: "Jalons atteints, tâches bloquées, budget consommé, risques ouverts et livrables acceptés.",
    projectExample: "Une équipe suit les validations attendues avant de passer au jalon suivant.",
    clientValidation: "Valider périmètre, gouvernance, méthodes, responsabilités et règles de changement."
  },
  {
    id: "profile-67",
    title: "Gestionnaire immobilier",
    familyId: "family-07",
    sectorIds: ["S07-01","S07-02"],
    reviewStatus: "documented_unreviewed",
    purpose: "Administrer un portefeuille de biens, contrats, visites, loyers, interventions et relations locataires.",
    workflow: "Entrée mandat → inventaire bien → commercialisation → visite → contrat → suivi loyers → maintenance → sortie.",
    actorsAndResponsibilities: "Gestionnaire, propriétaire, locataire, syndic, artisan et comptable.",
    businessData: "Biens, lots, mandats, baux, loyers, dépôts, charges, visites, interventions et états des lieux.",
    diagnosticQuestions: "Combien de biens ? Comment suivez-vous impayés, charges et dépôts ? Qui autorise les travaux ?",
    digitalCapabilities: "Fiches biens, baux, échéancier, quittances, tickets maintenance, visites et rapports propriétaires.",
    risksAndLimits: "Respecter droit immobilier local, confidentialité et règles de gestion des dépôts. Ne pas déclencher d'expulsion ou pénalité automatiquement.",
    possibleIndicators: "Loyers à échéance, incidents ouverts, vacance, renouvellements et dépenses par bien.",
    projectExample: "Un gestionnaire voit les loyers attendus et les interventions non terminées pour chaque logement.",
    clientValidation: "Valider modèles de bail, règles locatives, mandats, droits d'accès et comptabilisation."
  },
  {
    id: "profile-68",
    title: "Directeur d'établissement scolaire",
    familyId: "family-08",
    sectorIds: ["S08-02"],
    reviewStatus: "documented_unreviewed",
    purpose: "Piloter l'organisation pédagogique, administrative et la sécurité d'un établissement scolaire.",
    workflow: "Préparation année → inscriptions → affectation classes → emplois du temps → suivi pédagogique → évaluations → bilans.",
    actorsAndResponsibilities: "Direction, enseignants, élèves, parents ou tuteurs, administration et autorités éducatives.",
    businessData: "Élèves, classes, inscriptions, présence, notes, emplois du temps, incidents et documents.",
    diagnosticQuestions: "Quels cycles et règles ? Qui valide notes et absences ? Comment gérez-vous communication familles et sécurité ?",
    digitalCapabilities: "Scolarité, emploi du temps, présence, évaluations, communication et rapports.",
    risksAndLimits: "Données des mineurs protégées. Les décisions pédagogiques et disciplinaires restent humaines et conformes aux textes locaux.",
    possibleIndicators: "Présences, classes complètes, évaluations en attente, dossiers incomplets et incidents suivis.",
    projectExample: "La direction repère les classes sans enseignant affecté et les dossiers d'inscription incomplets.",
    clientValidation: "Valider calendrier officiel, droits parentaux, règles d'évaluation, confidentialité et procédures de protection."
  },
  {
    id: "profile-69",
    title: "Déclarant en douane",
    familyId: "family-09",
    sectorIds: ["S09-05"],
    reviewStatus: "documented_unreviewed",
    purpose: "Préparer et suivre les formalités douanières et documentaires d'une opération d'importation ou d'exportation.",
    workflow: "Collecte documents → classement tarifaire proposé → vérification origine et valeur → déclaration → contrôle → mainlevée et archivage.",
    actorsAndResponsibilities: "Déclarant habilité, importateur, exportateur, transitaire, douane, transporteur et banque.",
    businessData: "Facture, colisage, origine, nomenclature, valeur, taxes, documents transport et statuts.",
    diagnosticQuestions: "Quels pays et régimes ? Qui confirme classement et valeur ? Comment gérez-vous pièces manquantes et contrôles ?",
    digitalCapabilities: "Dossiers import-export, checklist, échéances, documents, suivi déclarations et coûts estimés.",
    risksAndLimits: "Classement, valeur et régime doivent être vérifiés par une personne habilitée et les autorités. Ne pas garantir une mainlevée.",
    possibleIndicators: "Dossiers incomplets, délais de dédouanement, contrôles et frais estimés.",
    projectExample: "Un transitaire suit les pièces manquantes avant dépôt de déclaration.",
    clientValidation: "Valider habilitations, nomenclature, règles pays, documents officiels et conservation."
  },
  {
    id: "profile-70",
    title: "Réceptionniste hôtelier",
    familyId: "family-10",
    sectorIds: ["S10-03"],
    reviewStatus: "documented_unreviewed",
    purpose: "Accueillir les clients, gérer les arrivées et départs, réservations et demandes durant le séjour.",
    workflow: "Réservation → confirmation → préparation chambre → arrivée → séjour → facturation → départ et retour client.",
    actorsAndResponsibilities: "Réceptionniste, client, gouvernant, maintenance, réservation, direction et prestataires.",
    businessData: "Réservation, identité nécessaire, dates, chambre, demandes, paiements, incidents et factures.",
    diagnosticQuestions: "Quels canaux de réservation ? Comment gérez-vous surréservations, acomptes, annulations et réclamations ?",
    digitalCapabilities: "Planning chambres, check-in/out, tâches, demandes clients, facturation et coordination housekeeping.",
    risksAndLimits: "Protéger pièces d'identité et données de paiement. Respecter règles d'hébergement, sécurité et fiscalité locale.",
    possibleIndicators: "Chambres disponibles, arrivées prévues, départs, demandes non résolues et annulations.",
    projectExample: "L'hôtel voit les chambres à préparer et les arrivées dont les dossiers sont incomplets.",
    clientValidation: "Valider règles d'identification, paiements, annulations, sécurité et conservation des données."
  },
  {
    id: "profile-71",
    title: "Programmateur culturel",
    familyId: "family-11",
    sectorIds: ["S11-02"],
    reviewStatus: "documented_unreviewed",
    purpose: "Construire une programmation culturelle cohérente, négocier les interventions et coordonner les publics et partenaires.",
    workflow: "Orientation artistique → sélection → budget → contrats → calendrier → communication → accueil → bilan.",
    actorsAndResponsibilities: "Programmateur, artistes, lieux, producteurs, financeurs, techniciens et publics.",
    businessData: "Œuvres, artistes, droits, contrats, cachets, dates, jauges, budgets et fréquentation.",
    diagnosticQuestions: "Quels publics et disciplines ? Qui valide programmation et budget ? Comment gérez-vous droits et annulations ?",
    digitalCapabilities: "Base artistes, calendrier, contrats, budgets, réservations et bilan de fréquentation.",
    risksAndLimits: "Respecter droits d'auteur, contrats, accessibilité, sécurité et pluralisme des publics.",
    possibleIndicators: "Événements confirmés, budget engagé, contrats signés et fréquentation.",
    projectExample: "Un centre culturel suit les dates et contrats des artistes programmés.",
    clientValidation: "Valider droits, autorisations, contrats, conditions d'accueil et politique de communication."
  },
  {
    id: "profile-72",
    title: "Responsable formation RH",
    familyId: "family-12",
    sectorIds: ["S12-04"],
    reviewStatus: "documented_unreviewed",
    purpose: "Identifier les besoins de compétences et organiser les actions de formation et leur évaluation.",
    workflow: "Recueil besoins → plan formation → validation budget → inscription → réalisation → évaluation → suivi des acquis.",
    actorsAndResponsibilities: "RH, managers, salariés, formateurs, financeur et direction.",
    businessData: "Compétences, besoins, formations, coûts, convocations, présences, évaluations et attestations.",
    diagnosticQuestions: "Qui exprime les besoins ? Comment priorisez-vous ? Qui valide le budget et les prestataires ? Comment mesurez-vous l'utilité ?",
    digitalCapabilities: "Catalogue, plan de formation, inscriptions, présence, budget, évaluations et attestations.",
    risksAndLimits: "Protéger les évaluations individuelles et vérifier les organismes et attestations ; ne pas confondre présence et compétence acquise.",
    possibleIndicators: "Taux de réalisation, budget, absences, évaluations et compétences à développer.",
    projectExample: "Le service RH suit le plan annuel et les formations restant à programmer.",
    clientValidation: "Valider référentiel de compétences, budget, prestataires, données RH et règles locales."
  },
  {
    id: "profile-73",
    title: "Tailleur-couturier",
    familyId: "family-13",
    sectorIds: ["S13-03"],
    reviewStatus: "documented_unreviewed",
    purpose: "Prendre les mesures, concevoir ou adapter des vêtements et organiser la fabrication et les retouches.",
    workflow: "Prise de commande → mesures → choix tissu → patron → coupe → assemblage → essayage → retouche → livraison.",
    actorsAndResponsibilities: "Tailleur, client, apprenti, fournisseur de tissu et sous-traitant.",
    businessData: "Mesures, modèle, tissu, fournitures, prix, acompte, essayages, retouches et livraison.",
    diagnosticQuestions: "Quels vêtements réalisez-vous ? Comment conservez-vous mesures et préférences ? Comment gérez-vous acomptes et délais ?",
    digitalCapabilities: "Fiches clients avec accès restreint, commandes, mesures, stock tissu, coûts et calendrier de livraison.",
    risksAndLimits: "Les mesures corporelles sont personnelles. Obtenir l'accord, limiter l'accès et permettre leur suppression selon politique définie.",
    possibleIndicators: "Commandes à livrer, retouches, consommation tissu et délais dépassés.",
    projectExample: "Un atelier suit les commandes et les essayages à planifier.",
    clientValidation: "Valider consentement, conservation des mesures, acomptes, retours et propriété des modèles."
  },
  {
    id: "profile-74",
    title: "Auxiliaire de puériculture",
    familyId: "family-14",
    sectorIds: ["S14-02"],
    reviewStatus: "documented_unreviewed",
    purpose: "Contribuer à l'accueil et au bien-être des jeunes enfants dans le cadre de ses compétences et du projet d'accueil.",
    workflow: "Accueil enfant → transmissions parentales → activités et soins autorisés → observation → repas/repos → départ sécurisé.",
    actorsAndResponsibilities: "Auxiliaire, enfant, parents ou tuteurs, responsable de structure et professionnels compétents.",
    businessData: "Présence, personnes autorisées, consignes parentales, repas, repos, observations nécessaires et incidents.",
    diagnosticQuestions: "Quels âges et effectifs ? Comment vérifiez-vous les personnes autorisées ? Quels protocoles d'urgence et transmissions ?",
    digitalCapabilities: "Présences, autorisations de sortie, planning, transmissions, activités et incidents.",
    risksAndLimits: "Données de mineurs hautement sensibles. Respecter ratios, protection de l'enfance, protocoles sanitaires et limites de compétence.",
    possibleIndicators: "Présences, transmissions à compléter, autorisations expirées et incidents signalés.",
    projectExample: "Une crèche sécurise les départs en vérifiant les personnes autorisées selon procédure humaine.",
    clientValidation: "Valider agréments, ratios, autorisations parentales, conservation et protocoles de protection."
  },
  {
    id: "profile-75",
    title: "Archiviste",
    familyId: "family-15",
    sectorIds: ["S15-03"],
    reviewStatus: "documented_unreviewed",
    purpose: "Collecter, classer, conserver et rendre accessibles les archives selon les règles applicables.",
    workflow: "Versement → tri → classement → description → conservation → demande de consultation → communication autorisée.",
    actorsAndResponsibilities: "Archiviste, service producteur, demandeur, responsable des archives et autorité de contrôle.",
    businessData: "Producteur, série, dates, cote, format, durée, restriction, état et mouvements.",
    diagnosticQuestions: "Quels fonds et formats ? Qui autorise la consultation ? Comment gérez-vous délais de communicabilité et élimination ?",
    digitalCapabilities: "Inventaire, plan de classement, localisation, demandes, mouvements, conservation et numérisation.",
    risksAndLimits: "Respecter délais légaux, confidentialité, intégrité et authenticité. Ne pas détruire automatiquement les archives.",
    possibleIndicators: "Fonds inventoriés, demandes en attente, documents à contrôler et risques de conservation.",
    projectExample: "Une collectivité localise les dossiers et suit les consultations autorisées.",
    clientValidation: "Valider tableau de gestion, règles d'accès, archivage probant et autorisations d'élimination."
  },
  {
    id: "profile-76",
    title: "Médiateur",
    familyId: "family-16",
    sectorIds: ["S16-04"],
    reviewStatus: "documented_unreviewed",
    purpose: "Faciliter un dialogue volontaire et impartial entre parties sans imposer une décision.",
    workflow: "Demande → vérification du cadre et consentement → préparation → rencontres → options → accord éventuel → clôture.",
    actorsAndResponsibilities: "Médiateur, parties, représentants autorisés et prescripteur selon le cadre.",
    businessData: "Parties, objet du différend, consentements, séances, propositions et accord si accepté.",
    diagnosticQuestions: "Quel type de médiation ? Le processus est-il volontaire ? Quelles limites de confidentialité et de sécurité ?",
    digitalCapabilities: "Agenda, dossiers restreints, convocations, suivi des séances et conservation minimale des accords.",
    risksAndLimits: "Impartialité, indépendance, consentement et confidentialité selon le cadre. Ne pas traiter les situations exclues ou dangereuses comme médiation ordinaire.",
    possibleIndicators: "Demandes reçues, séances réalisées, dossiers clôturés et suites consenties.",
    projectExample: "Un service organise les séances sans rendre publiques les positions des parties.",
    clientValidation: "Valider statut du médiateur, confidentialité, conflits d'intérêts et cadre juridique local."
  },
  {
    id: "profile-77",
    title: "Analyste de données",
    familyId: "family-17",
    sectorIds: ["S17-04"],
    reviewStatus: "documented_unreviewed",
    purpose: "Transformer des données autorisées en analyses reproductibles et compréhensibles pour éclairer les décisions.",
    workflow: "Question → inventaire sources → contrôle qualité → préparation → analyse → visualisation → interprétation → validation.",
    actorsAndResponsibilities: "Analyste, métier demandeur, data engineer, responsable données et décideur.",
    businessData: "Sources, dictionnaire, transformations, métriques, échantillons, résultats et limites.",
    diagnosticQuestions: "Quelles décisions l'analyse doit-elle éclairer ? Quelles sources sont autorisées ? Comment définissez-vous chaque indicateur ?",
    digitalCapabilities: "Pipelines d'analyse, tableaux de bord, documentation, contrôle qualité et suivi des versions.",
    risksAndLimits: "Éviter biais, réidentification et conclusions causales non démontrées. Documenter qualité, périmètre et limites.",
    possibleIndicators: "Fraîcheur des données, taux d'erreur, couverture, temps de production et indicateurs validés.",
    projectExample: "Une entreprise suit ses ventes en distinguant données brutes, calculs et hypothèses.",
    clientValidation: "Valider provenance, base légale, dictionnaire, accès, méthodes et interprétation."
  },
  {
    id: "profile-78",
    title: "Opérateur de station de traitement d'eau",
    familyId: "family-18",
    sectorIds: ["S18-04"],
    reviewStatus: "documented_unreviewed",
    purpose: "Surveiller et exploiter une installation de traitement de l'eau conformément aux procédures et seuils validés.",
    workflow: "Prise de poste → contrôle équipements → prélèvements et mesures → réglages autorisés → consignation → rapport et alerte.",
    actorsAndResponsibilities: "Opérateur, responsable d'exploitation, laboratoire, maintenance et autorité sanitaire.",
    businessData: "Paramètres mesurés, lots, débits, équipements, alarmes, interventions et résultats laboratoire.",
    diagnosticQuestions: "Quels paramètres sont suivis ? Qui valide les seuils et réglages ? Comment gérez-vous alarmes, prélèvements et pannes ?",
    digitalCapabilities: "Journal d'exploitation, mesures, alertes, maintenance, stocks de réactifs et rapports.",
    risksAndLimits: "Ne pas modifier les seuils réglementaires ni remplacer les analyses certifiées. Encadrer produits chimiques et accès aux installations.",
    possibleIndicators: "Mesures hors plage à investiguer, alarmes, arrêts, analyses en attente et maintenance due.",
    projectExample: "Une station suit les relevés de poste et les anomalies à transmettre à l'ingénieur.",
    clientValidation: "Valider seuils, protocoles, habilitations, sécurité chimique et exigences sanitaires locales."
  },
  {
    id: "profile-79",
    title: "Technicien de sécurité incendie",
    familyId: "family-19",
    sectorIds: ["S19-02"],
    reviewStatus: "documented_unreviewed",
    purpose: "Contrôler et entretenir les dispositifs de sécurité incendie dans le périmètre de ses qualifications.",
    workflow: "Planification → inspection → tests autorisés → constat → maintenance → rapport → levée des réserves.",
    actorsAndResponsibilities: "Technicien, responsable sécurité, mainteneur, exploitant du site et organisme agréé.",
    businessData: "Équipements, localisation, dates, tests, anomalies, maintenance, réserves et certificats.",
    diagnosticQuestions: "Quels équipements et sites ? Quelles normes ? Qui autorise les tests et valide la remise en service ?",
    digitalCapabilities: "Inventaire équipements, planning, fiches de contrôle, alertes, réserves et certificats.",
    risksAndLimits: "Les systèmes critiques nécessitent des personnes qualifiées et procédures réglementaires ; aucun statut conforme sans preuve.",
    possibleIndicators: "Contrôles échus, équipements indisponibles, réserves ouvertes et interventions.",
    projectExample: "Un gestionnaire d'immeuble suit les extincteurs et alarmes à contrôler selon échéancier.",
    clientValidation: "Valider certifications, normes locales, périodicités et responsabilités de maintenance."
  },
  {
    id: "profile-80",
    title: "Chargé de collecte de fonds",
    familyId: "family-20",
    sectorIds: ["S20-02"],
    reviewStatus: "documented_unreviewed",
    purpose: "Mobiliser des ressources financières ou matérielles pour des projets en garantissant transparence et suivi des donateurs.",
    workflow: "Définition besoin → campagne → information → réception don → reçu → affectation → rapport d'utilisation.",
    actorsAndResponsibilities: "Association, donateur, bénéficiaire, trésorier, partenaire et auditeur.",
    businessData: "Campagne, objectif, don, mode de réception, affectation, justificatif, consentement et rapport.",
    diagnosticQuestions: "Quelles sources de dons ? Qui autorise l'affectation ? Comment délivrez-vous les reçus et rendez-vous compte ?",
    digitalCapabilities: "Campagnes, promesses, dons reçus, reçus, affectations, relances consenties et rapports.",
    risksAndLimits: "Vérifier origine et restrictions des fonds selon obligations. Protéger les donateurs et ne pas publier leurs données sans accord.",
    possibleIndicators: "Objectif collecté, dons rapprochés, reçus en attente, fonds affectés et rapports dus.",
    projectExample: "Une ONG suit une campagne et relie chaque don à une affectation et à un justificatif.",
    clientValidation: "Valider règles de collecte, reçus, lutte contre abus, fiscalité et transparence financière."
  },
  {
    id: "profile-81",
    title: "Chirurgien-dentiste",
    familyId: "family-01",
    sectorIds: ["S01-02"],
    reviewStatus: "documented_unreviewed",
    purpose: "Prévenir et traiter les affections bucco-dentaires dans le cadre des compétences et protocoles professionnels.",
    workflow: "Accueil → anamnèse → examen → plan de soins → consentement → acte → consignes → suivi.",
    actorsAndResponsibilities: "Chirurgien-dentiste, patient, assistant dentaire, laboratoire et spécialiste référent.",
    businessData: "Dossier dentaire, observations, imagerie, actes, devis, consentements, prescriptions et rendez-vous.",
    diagnosticQuestions: "Quels soins et équipements ? Comment gérez-vous urgences, devis, consentements, stérilisation et rappels ?",
    digitalCapabilities: "Agenda, dossier sécurisé, devis, planification des actes, rappels et suivi des consommables.",
    risksAndLimits: "Secret médical, hygiène, stérilisation et actes réservés. Aucun diagnostic automatisé ni partage non autorisé.",
    possibleIndicators: "Rendez-vous de suivi, actes planifiés, devis acceptés et contrôles à réaliser.",
    projectExample: "Un cabinet suit les plans de traitement et les rendez-vous de contrôle à programmer.",
    clientValidation: "Faire valider les protocoles, habilitations, exigences sanitaires et durées de conservation."
  },
  {
    id: "profile-82",
    title: "Responsable de salle de fitness",
    familyId: "family-02",
    sectorIds: ["S02-02"],
    reviewStatus: "documented_unreviewed",
    purpose: "Assurer le fonctionnement quotidien d'une salle, la sécurité des équipements et le suivi des adhérents.",
    workflow: "Inscription → accueil → accès → séances → entretien matériel → renouvellement → gestion des incidents.",
    actorsAndResponsibilities: "Responsable, coachs, adhérents, accueil, maintenance et prestataires.",
    businessData: "Abonnements, accès, séances, équipements, incidents, paiements et consentements.",
    diagnosticQuestions: "Comment contrôlez-vous les accès ? Qui suit les équipements ? Comment gérez-vous incidents, abonnements et renouvellements ?",
    digitalCapabilities: "Adhérents, abonnements, réservations, accès, maintenance, caisse et communication.",
    risksAndLimits: "Ne pas collecter de données de santé superflues. Respecter sécurité des équipements et limites des conseils sportifs.",
    possibleIndicators: "Abonnements actifs, fréquentation, équipements indisponibles et renouvellements.",
    projectExample: "Une salle repère les abonnements expirants et les équipements en maintenance.",
    clientValidation: "Valider conditions d'accès, règles de sécurité, assurances et traitement des données."
  },
  {
    id: "profile-83",
    title: "Apiculteur",
    familyId: "family-03",
    sectorIds: ["S03-03"],
    reviewStatus: "documented_unreviewed",
    purpose: "Gérer les ruchers, la santé des colonies et la production apicole dans le respect des pratiques locales.",
    workflow: "Implantation → suivi des ruches → visites → prévention sanitaire → récolte → extraction → conditionnement → vente.",
    actorsAndResponsibilities: "Apiculteur, technicien, fournisseur, coopérative, acheteur et service vétérinaire selon contexte.",
    businessData: "Ruchers, ruches, visites, traitements autorisés, récoltes, lots, conditionnement et ventes.",
    diagnosticQuestions: "Combien de ruchers ? Comment suivez-vous les colonies, récoltes, traitements, lots et déplacements ?",
    digitalCapabilities: "Registre ruchers, calendrier, suivi des visites, lots, stock, ventes et traçabilité.",
    risksAndLimits: "Respecter les règles sanitaires, l'usage autorisé des produits et la sécurité des personnes et pollinisateurs.",
    possibleIndicators: "Ruches suivies, récoltes par lot, pertes déclarées, visites dues et stock disponible.",
    projectExample: "Un apiculteur compare les récoltes par rucher et conserve la traçabilité des lots.",
    clientValidation: "Valider les pratiques vétérinaires, exigences alimentaires, unités et règles environnementales."
  },
  {
    id: "profile-84",
    title: "Responsable import-export",
    familyId: "family-04",
    sectorIds: ["S04-02"],
    reviewStatus: "documented_unreviewed",
    purpose: "Coordonner achats et ventes transfrontaliers, documents, transport, paiements et conformité des opérations.",
    workflow: "Demande → offre → commande → contrôle fournisseur → documents → transport → douane → réception et règlement.",
    actorsAndResponsibilities: "Responsable, acheteur, fournisseur, transitaire, douane, banque et client.",
    businessData: "Produits, quantités, Incoterms validés, factures, origine, transport, assurance, paiements et délais.",
    diagnosticQuestions: "Quels pays et marchandises ? Qui valide les conditions commerciales ? Comment suivez-vous documents, coûts et douane ?",
    digitalCapabilities: "Dossiers import-export, fournisseurs, commandes, échéances, documents et coûts logistiques.",
    risksAndLimits: "Vérifier sanctions, licences, douane, origine et règles produits avec spécialistes compétents.",
    possibleIndicators: "Expéditions en transit, documents manquants, retards, frais et paiements à rapprocher.",
    projectExample: "Une PME suit chaque importation avec ses pièces, frais et étapes de dédouanement.",
    clientValidation: "Valider règles pays, contrats, Incoterms, fiscalité, autorisations et responsabilités."
  },
  {
    id: "profile-85",
    title: "Gestionnaire de sinistres",
    familyId: "family-05",
    sectorIds: ["S05-04"],
    reviewStatus: "documented_unreviewed",
    purpose: "Instruire les déclarations de sinistre et coordonner les pièces, expertises et décisions de l'assureur.",
    workflow: "Déclaration → ouverture dossier → contrôle garantie → collecte pièces → expertise → décision assureur → indemnisation ou clôture.",
    actorsAndResponsibilities: "Gestionnaire, assuré, courtier, assureur, expert, réparateur et service juridique.",
    businessData: "Contrat, garanties, dates, déclaration, pièces, expertise, réserves et décision.",
    diagnosticQuestions: "Qui décide de la garantie ? Quels délais ? Comment gérez-vous pièces manquantes, expertises et contestations ?",
    digitalCapabilities: "Dossiers sinistres, checklist, échéances, échanges, expertise et suivi des règlements.",
    risksAndLimits: "Ne pas promettre une indemnisation ni interpréter définitivement le contrat sans habilitation. Restreindre l'accès aux dossiers.",
    possibleIndicators: "Dossiers en attente, délais d'instruction, pièces manquantes et décisions à notifier.",
    projectExample: "Un cabinet suit les sinistres par étape et relance les pièces manquantes.",
    clientValidation: "Valider délégations, contrats, règles de protection des données et procédure de contestation."
  },
  {
    id: "profile-86",
    title: "Auditeur qualité",
    familyId: "family-06",
    sectorIds: ["S06-05"],
    reviewStatus: "documented_unreviewed",
    purpose: "Évaluer les processus au regard de critères définis et suivre les actions correctives.",
    workflow: "Programme audit → périmètre → collecte preuves → entretiens → constats → rapport → actions → vérification.",
    actorsAndResponsibilities: "Auditeur, responsables de processus, direction, équipes et organisme certificateur si applicable.",
    businessData: "Référentiel, périmètre, preuves, constats, écarts, responsables, délais et clôtures.",
    diagnosticQuestions: "Quels référentiels ? Qui approuve le programme ? Comment garantissez-vous indépendance, preuves et suivi des écarts ?",
    digitalCapabilities: "Plan d'audit, checklists, preuves, constats, actions correctives et historique.",
    risksAndLimits: "Ne pas transformer une observation en non-conformité sans critère et preuve. Protéger l'indépendance.",
    possibleIndicators: "Audits réalisés, écarts ouverts, actions échues et récurrences.",
    projectExample: "Une organisation suit les actions correctives et leurs preuves de clôture.",
    clientValidation: "Valider référentiels, indépendance, échantillonnage, accès et procédure d'audit."
  },
  {
    id: "profile-87",
    title: "Architecte",
    familyId: "family-07",
    sectorIds: ["S07-03"],
    reviewStatus: "documented_unreviewed",
    purpose: "Concevoir des espaces et documents de projet répondant au programme, au site et aux règles applicables.",
    workflow: "Programme → relevés → esquisse → études → concertation → dossier autorisations → plans d'exécution → suivi.",
    actorsAndResponsibilities: "Architecte, client, ingénieurs, urbaniste, entreprises et autorités.",
    businessData: "Programme, site, plans, versions, surfaces, matériaux, coûts, validations et autorisations.",
    diagnosticQuestions: "Qui valide chaque phase ? Quelles contraintes du site ? Comment gérez-vous versions, budget et autorisations ?",
    digitalCapabilities: "Gestion des projets, plans, annotations, versions, validations, planning et comptes rendus.",
    risksAndLimits: "La conception réglementaire et les signatures restent aux professionnels habilités. Vérifier normes et permis locaux.",
    possibleIndicators: "Phases validées, observations ouvertes, modifications et autorisations attendues.",
    projectExample: "Une agence centralise les commentaires client et les versions de plans d'un projet.",
    clientValidation: "Valider mission, assurance, signatures, normes, droits sur les plans et procédure d'approbation."
  },
  {
    id: "profile-88",
    title: "Conseiller d'orientation",
    familyId: "family-08",
    sectorIds: ["S08-05"],
    reviewStatus: "documented_unreviewed",
    purpose: "Aider une personne à explorer ses intérêts, compétences et parcours possibles sans décider à sa place.",
    workflow: "Accueil → clarification → exploration → informations sur parcours → options → plan d'action → suivi.",
    actorsAndResponsibilities: "Conseiller, personne accompagnée, famille si accord, établissement et partenaires professionnels.",
    businessData: "Objectifs, intérêts déclarés, parcours, compétences, options explorées et décisions de la personne.",
    diagnosticQuestions: "Quel public ? Quels tests sont autorisés ? Comment distinguez-vous exploration, conseil et décision d'admission ?",
    digitalCapabilities: "Rendez-vous, questionnaires validés, ressources métiers, plans d'action et suivi des candidatures.",
    risksAndLimits: "Éviter le profilage déterministe et les promesses d'emploi. Les choix restent à la personne ; protéger les données sensibles.",
    possibleIndicators: "Entretiens, plans d'action, candidatures suivies et retours d'accompagnement.",
    projectExample: "Une plateforme propose des pistes à explorer puis permet au conseiller et à l'apprenant de les discuter.",
    clientValidation: "Valider outils psychométriques, qualifications, consentement, accessibilité et limites de recommandations."
  },
  {
    id: "profile-89",
    title: "Agent de transit",
    familyId: "family-09",
    sectorIds: ["S09-05"],
    reviewStatus: "documented_unreviewed",
    purpose: "Organiser les opérations documentaires et logistiques de transit des marchandises.",
    workflow: "Ouverture dossier → collecte documents → réservation → suivi transport → formalités → livraison → facturation.",
    actorsAndResponsibilities: "Agent, client, transporteur, transitaire, douane, entrepôt et assureur.",
    businessData: "Expédition, colis, documents, transporteur, statuts, frais, incidents et preuves de livraison.",
    diagnosticQuestions: "Quels modes de transport ? Qui valide les documents ? Comment suivez-vous frais, retards et réclamations ?",
    digitalCapabilities: "Dossiers transit, suivi expédition, échéances, documents, coûts et preuves.",
    risksAndLimits: "Respecter réglementations douanières, sûreté, marchandises réglementées et confidentialité commerciale.",
    possibleIndicators: "Dossiers bloqués, documents manquants, retards, frais additionnels et livraisons confirmées.",
    projectExample: "Un transitaire voit les expéditions et les formalités restant à finaliser.",
    clientValidation: "Valider agréments, documents officiels, règles douanières et responsabilité contractuelle."
  },
  {
    id: "profile-90",
    title: "Chef pâtissier",
    familyId: "family-10",
    sectorIds: ["S10-01"],
    reviewStatus: "documented_unreviewed",
    purpose: "Organiser la production pâtissière, la qualité, les approvisionnements et la sécurité alimentaire.",
    workflow: "Prévision → fiches recettes → achats → réception → préparation → cuisson → refroidissement → vente et nettoyage.",
    actorsAndResponsibilities: "Chef pâtissier, pâtissiers, apprentis, fournisseurs, vente et responsable hygiène.",
    businessData: "Recettes, ingrédients, allergènes déclarés, lots, coûts, quantités, températures et pertes.",
    diagnosticQuestions: "Quels produits et volumes ? Comment contrôlez-vous allergènes, lots, conservation et coûts matière ?",
    digitalCapabilities: "Fiches recettes, production, achats, stocks, commandes, lots, contrôles et ventes.",
    risksAndLimits: "Ne jamais déduire les allergènes. Respecter chaîne du froid, hygiène, traçabilité et formation.",
    possibleIndicators: "Production prévue/réalisée, pertes, ruptures, contrôles et coûts matière estimés.",
    projectExample: "Un laboratoire suit les commandes de gâteaux et les matières nécessaires par recette.",
    clientValidation: "Valider recettes, allergènes, procédures sanitaires, unités et exigences d'étiquetage."
  },
  {
    id: "profile-91",
    title: "Guide touristique",
    familyId: "family-11",
    sectorIds: ["S11-03"],
    reviewStatus: "documented_unreviewed",
    purpose: "Accompagner des visiteurs et présenter un territoire ou un site dans le respect des consignes et du programme.",
    workflow: "Réservation → préparation parcours → briefing → accueil → visite → gestion du groupe → retour et évaluation.",
    actorsAndResponsibilities: "Guide, visiteurs, agence, site, transporteur et autorités du patrimoine.",
    businessData: "Programme, groupe, réservation, langues, horaires, billets, incidents et retours.",
    diagnosticQuestions: "Quels sites et publics ? Quelles habilitations ? Comment gérez-vous retards, sécurité, accessibilité et annulations ?",
    digitalCapabilities: "Planning visites, groupes, réservations, billets, messages et retours clients.",
    risksAndLimits: "Respecter règles des sites, protection du patrimoine, sécurité et vie privée des visiteurs.",
    possibleIndicators: "Visites réalisées, retards, annulations, retours et incidents transmis.",
    projectExample: "Une agence répartit les groupes et suit les visites confirmées par guide.",
    clientValidation: "Valider autorisations, assurances, contenus historiques, règles de site et accessibilité."
  },
  {
    id: "profile-92",
    title: "Gestionnaire des carrières",
    familyId: "family-12",
    sectorIds: ["S12-05"],
    reviewStatus: "documented_unreviewed",
    purpose: "Organiser les parcours professionnels, mobilités et plans de développement des collaborateurs.",
    workflow: "Référentiel compétences → entretien → souhaits et opportunités → revue humaine → plan → suivi et réévaluation.",
    actorsAndResponsibilities: "RH, salarié, manager, formation, direction et représentant du personnel selon règles.",
    businessData: "Poste, compétences, souhaits, formations, expériences, mobilités et décisions validées.",
    diagnosticQuestions: "Qui conduit les entretiens ? Quels critères ? Comment garantissez-vous transparence et confidentialité ?",
    digitalCapabilities: "Référentiel compétences, entretiens, plans de développement, formations et mobilité.",
    risksAndLimits: "Éviter les classements opaques ou décisions automatisées. Protéger les évaluations et garantir l'équité.",
    possibleIndicators: "Plans de développement actifs, formations prévues, mobilités et entretiens à réaliser.",
    projectExample: "Le service RH suit les souhaits d'évolution et les actions convenues.",
    clientValidation: "Valider droit du travail, accès, critères, conservation et processus de contestation."
  },
  {
    id: "profile-93",
    title: "Soudeur",
    familyId: "family-13",
    sectorIds: ["S13-04"],
    reviewStatus: "documented_unreviewed",
    purpose: "Assembler des pièces selon plans, procédés, qualifications et contrôles exigés.",
    workflow: "Lecture plan → préparation → choix procédé → assemblage → soudage → contrôle → finition et traçabilité.",
    actorsAndResponsibilities: "Soudeur, chef d'atelier, contrôleur, ingénieur méthodes et HSE.",
    businessData: "Plans, matériaux, procédés, paramètres, qualification, lots, contrôles et reprises.",
    diagnosticQuestions: "Quels procédés et matériaux ? Quelles qualifications ? Comment tracez-vous contrôles et reprises ?",
    digitalCapabilities: "Ordres de fabrication, fiches procédés, lots, qualification, contrôles et maintenance équipements.",
    risksAndLimits: "Risques thermiques, fumées, incendie et défauts structurels. Respecter qualifications, ventilation et procédures HSE.",
    possibleIndicators: "Pièces conformes, reprises, contrôles en attente et heures de fabrication.",
    projectExample: "Un atelier relie chaque assemblage à son plan et aux contrôles réalisés.",
    clientValidation: "Valider qualifications, normes applicables, procédures de soudage et sécurité atelier."
  },
  {
    id: "profile-94",
    title: "Coiffeur",
    familyId: "family-14",
    sectorIds: ["S14-03"],
    reviewStatus: "documented_unreviewed",
    purpose: "Accueillir les clients et réaliser les prestations capillaires convenues dans de bonnes conditions d'hygiène.",
    workflow: "Prise de rendez-vous → accueil → échange sur prestation → réalisation → paiement → entretien et prochain rendez-vous.",
    actorsAndResponsibilities: "Coiffeur, client, assistant, fournisseur et responsable de salon.",
    businessData: "Rendez-vous, prestation, durée, produits, tarif, préférences consenties et paiement.",
    diagnosticQuestions: "Quels services ? Comment gérez-vous planning, produits, fidélité, acomptes et annulations ?",
    digitalCapabilities: "Agenda, fiches prestations, caisse, stock produits, fidélité et communication consentie.",
    risksAndLimits: "Éviter de conserver des informations personnelles inutiles. Respecter hygiène, allergies déclarées et règles professionnelles.",
    possibleIndicators: "Rendez-vous, retards, annulations, produits bas et chiffre d'affaires par prestation.",
    projectExample: "Un salon suit les rendez-vous et les produits à réapprovisionner.",
    clientValidation: "Valider prix affichés, hygiène, consentement marketing et protection des données clients."
  },
  {
    id: "profile-95",
    title: "Officier d'état civil",
    familyId: "family-15",
    sectorIds: ["S15-02"],
    reviewStatus: "documented_unreviewed",
    purpose: "Recevoir et traiter les actes et demandes d'état civil dans le cadre des compétences légalement déléguées.",
    workflow: "Demande → vérification identité et pièces → instruction → contrôle → signature habilitée → délivrance → archivage.",
    actorsAndResponsibilities: "Officier habilité, agent, usager, autorité de tutelle et service d'archives.",
    businessData: "Demande, acte, pièces justificatives, références, validations, délivrance et traces d'accès.",
    diagnosticQuestions: "Quels actes et délégations ? Quelles vérifications ? Qui signe ? Comment gérez-vous corrections et demandes de copie ?",
    digitalCapabilities: "Registre sécurisé, workflow, rendez-vous, vérification de pièces et suivi de délivrance.",
    risksAndLimits: "Données d'identité très sensibles. Seules les personnes habilitées prennent les décisions et signent les actes.",
    possibleIndicators: "Demandes en attente, pièces manquantes, délais, corrections à instruire.",
    projectExample: "Une mairie suit les demandes d'actes et distingue préparation administrative et signature habilitée.",
    clientValidation: "Valider délégations, textes applicables, sécurité, archivage et droits d'accès."
  },
  {
    id: "profile-96",
    title: "Délégué à la protection des données",
    familyId: "family-16",
    sectorIds: ["S16-05"],
    reviewStatus: "documented_unreviewed",
    purpose: "Conseiller l'organisation sur la protection des données et suivre les risques, demandes et obligations.",
    workflow: "Cartographie traitements → conseil → analyse des risques → sensibilisation → suivi demandes → contrôle et recommandations.",
    actorsAndResponsibilities: "DPO, responsable de traitement, métiers, sécurité, juridique, personnes concernées et autorité.",
    businessData: "Traitements, finalités, catégories, destinataires, durées, risques, demandes et mesures.",
    diagnosticQuestions: "Qui décide des finalités ? Quels traitements et sous-traitants ? Comment gérez-vous demandes et violations ?",
    digitalCapabilities: "Registre traitements, demandes de droits, analyses d'impact, incidents, actions et preuves.",
    risksAndLimits: "Indépendance, confidentialité et respect des obligations locales. Le logiciel ne certifie pas la conformité.",
    possibleIndicators: "Traitements à revoir, demandes en délai, actions en retard et incidents documentés.",
    projectExample: "Une organisation suit les demandes d'accès et les actions de réduction des risques.",
    clientValidation: "Valider juridiction, indépendance, bases légales, notification d'incidents et conservation."
  },
  {
    id: "profile-97",
    title: "UX designer",
    familyId: "family-17",
    sectorIds: ["S17-02"],
    reviewStatus: "documented_unreviewed",
    purpose: "Concevoir des parcours numériques compréhensibles, accessibles et testés avec les utilisateurs.",
    workflow: "Recherche → besoins → parcours → prototypes → tests utilisateurs → itérations → spécifications et handoff.",
    actorsAndResponsibilities: "UX designer, utilisateurs, produit, UI, développeurs, accessibilité et support.",
    businessData: "Personas non sensibles, tâches, parcours, observations, prototypes, tests et décisions.",
    diagnosticQuestions: "Quels utilisateurs et tâches ? Comment recrutez-vous les testeurs ? Quels critères d'accessibilité et de réussite ?",
    digitalCapabilities: "Recherche, cartographie parcours, prototypes, retours, décisions et suivi des améliorations.",
    risksAndLimits: "Protéger les participants, éviter les stéréotypes et documenter limites des échantillons. Respecter l'accessibilité.",
    possibleIndicators: "Tâches réussies, points de friction, problèmes d'accessibilité et retours traités.",
    projectExample: "Une équipe teste un parcours de commande avant de le développer.",
    clientValidation: "Valider consentement de recherche, accessibilité, propriété des livrables et méthodes de test."
  },
  {
    id: "profile-98",
    title: "Ingénieur en efficacité énergétique",
    familyId: "family-18",
    sectorIds: ["S18-02"],
    reviewStatus: "documented_unreviewed",
    purpose: "Analyser les usages énergétiques et proposer des mesures d'efficacité dont les gains sont mesurés et vérifiables.",
    workflow: "Collecte données → audit → référence énergétique → scénarios → validation → mise en œuvre → mesure et suivi.",
    actorsAndResponsibilities: "Ingénieur, exploitant, technicien, direction, fournisseur et auditeur.",
    businessData: "Consommations, compteurs, périodes, équipements, tarifs, météo et hypothèses de calcul.",
    diagnosticQuestions: "Quelles sources de consommation ? Quelle période de référence ? Qui valide les hypothèses et investissements ?",
    digitalCapabilities: "Suivi compteurs, audits, plans d'action, coûts, économies estimées et mesures réelles.",
    risksAndLimits: "Distinguer économies estimées et mesurées. Ne pas garantir de gains sans méthode et données fiables.",
    possibleIndicators: "Consommation normalisée, actions réalisées, économies mesurées et dérives.",
    projectExample: "Un bâtiment compare ses consommations avant/après travaux en explicitant les hypothèses.",
    clientValidation: "Valider méthode, facteurs de normalisation, tarifs, sécurité et mesures."
  },
  {
    id: "profile-99",
    title: "Analyste de risques",
    familyId: "family-19",
    sectorIds: ["S19-04"],
    reviewStatus: "documented_unreviewed",
    purpose: "Identifier, évaluer et suivre les risques opérationnels avec les responsables compétents.",
    workflow: "Contexte → identification → analyse → priorisation → traitement → suivi indicateurs → revue et escalade.",
    actorsAndResponsibilities: "Analyste, responsables métiers, direction, sécurité, conformité et audit.",
    businessData: "Risque, cause, conséquence, probabilité, impact, contrôles, propriétaire et actions.",
    diagnosticQuestions: "Quels objectifs menacés ? Qui possède le risque ? Quelles preuves et seuils d'escalade ?",
    digitalCapabilities: "Registre risques, matrices validées, plans de traitement, incidents et tableaux de bord.",
    risksAndLimits: "Les scores sont des estimations contextualisées, pas des certitudes. Éviter le profilage des personnes et les fausses assurances.",
    possibleIndicators: "Risques élevés sans action, mesures échues, incidents récurrents et contrôles faibles.",
    projectExample: "Une direction suit les risques par processus et les actions dont l'échéance approche.",
    clientValidation: "Valider méthode, appétence au risque, responsabilités, confidentialité et escalade."
  },
  {
    id: "profile-100",
    title: "Médiateur communautaire",
    familyId: "family-20",
    sectorIds: ["S20-03"],
    reviewStatus: "documented_unreviewed",
    purpose: "Faciliter la participation et le dialogue communautaire en respectant la diversité et le consentement des participants.",
    workflow: "Demande → écoute → cadrage → dialogue collectif → options → engagements volontaires → suivi.",
    actorsAndResponsibilities: "Médiateur, habitants, associations, autorités locales et groupes concernés.",
    businessData: "Sujet, participants consentants, réunions, propositions, engagements et suites.",
    diagnosticQuestions: "Qui doit participer ? Comment garantir représentation et sécurité ? Comment recueillez-vous les accords et désaccords ?",
    digitalCapabilities: "Agenda communautaire, convocations, comptes rendus validés, actions et suivi.",
    risksAndLimits: "Ne pas exposer les personnes vulnérables ni forcer un accord. Prévoir une orientation en cas de violence ou danger.",
    possibleIndicators: "Participants représentés, engagements suivis, réunions et actions clôturées.",
    projectExample: "Une commune suit les engagements issus d'une concertation de quartier.",
    clientValidation: "Valider neutralité, consentement, protection des personnes, accessibilité et confidentialité."
  }
 ];


/**
 * Returns source-index titles for client confirmation. These are candidates,
 * not validated job classifications or professional recommendations.
 */
export function getProfessionCandidatesForFamilies(
  familyIds: readonly string[],
  limit = 12,
  sectorIds?: readonly string[],
): ProfessionCandidate[] {
  const allowed = new Set(familyIds);
  const selectedSectors = sectorIds?.length ? new Set(sectorIds) : null;
  const safeLimit = Number.isFinite(limit) ? Math.max(0, Math.min(50, Math.floor(limit))) : 12;
  return MERKORA_PROFESSION_CANDIDATES
    .filter((candidate) => allowed.has(candidate.familyId))
    .map((candidate) => ({ ...candidate, sectorIds: candidate.sectorIds ?? [`S${candidate.familyId.slice(-2)}-01`] }))
    .filter((candidate) => !selectedSectors || candidate.sectorIds?.some((id) => selectedSectors.has(id)))
    .slice(0, safeLimit);
}
