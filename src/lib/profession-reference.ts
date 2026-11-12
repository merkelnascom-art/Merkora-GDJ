export type ProfessionCandidate = {
  id: string;
  title: string;
  familyId: string;
  sourceGroup: string;
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
  }
] as const satisfies readonly ProfessionCandidate[];

export const MERKORA_DETAILED_PROFESSION_PROFILES = [
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
  }
] as const satisfies readonly ProfessionProfile[];


/**
 * Returns source-index titles for client confirmation. These are candidates,
 * not validated job classifications or professional recommendations.
 */
export function getProfessionCandidatesForFamilies(
  familyIds: readonly string[],
  limit = 12,
): ProfessionCandidate[] {
  const allowed = new Set(familyIds);
  const safeLimit = Number.isFinite(limit) ? Math.max(0, Math.min(50, Math.floor(limit))) : 12;
  return MERKORA_PROFESSION_CANDIDATES
    .filter((candidate) => allowed.has(candidate.familyId))
    .slice(0, safeLimit);
}
