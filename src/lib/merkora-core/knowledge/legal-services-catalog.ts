import type { KnowledgeConcept, KnowledgeRelationship } from "./types";

const CREATED_AT = "2026-11-17T00:00:00.000Z";
const SOURCE_ID = "source:merkora-family-12-legal-services-v1";
const FAMILY_ID = "family:legal-services";

const DOMAIN_SEEDS = [
  {
    "id": "domain:business-law",
    "fr": "Droit des affaires",
    "en": "Business law"
  },
  {
    "id": "domain:civil-family-law",
    "fr": "Droit civil et familial",
    "en": "Civil and family law"
  },
  {
    "id": "domain:labour-law",
    "fr": "Droit du travail",
    "en": "Labour and employment law"
  },
  {
    "id": "domain:justice-litigation",
    "fr": "Justice et contentieux",
    "en": "Justice and litigation"
  },
  {
    "id": "domain:legal-advisory-acts",
    "fr": "Conseil juridique et actes",
    "en": "Legal advisory and instruments"
  }
] as const;
type Seed = { id:string; type:string; fr:string; en:string; parentId:string; aliases:string[] };
const SEEDS: Seed[] = [
  {
    "id": "subdomain-law:corporate-law",
    "type": "subdomain",
    "fr": "Droit des sociétés et gouvernance d'entreprise",
    "en": "Corporate law and governance",
    "parentId": "domain:business-law",
    "aliases": [
      "droit des sociétés",
      "gouvernance d'entreprise"
    ]
  },
  {
    "id": "subdomain-law:company-formation",
    "type": "subdomain",
    "fr": "Création, immatriculation et restructuration des sociétés",
    "en": "Company formation and restructuring",
    "parentId": "domain:business-law",
    "aliases": [
      "création d'une société",
      "immatriculation entreprise"
    ]
  },
  {
    "id": "subdomain-law:commercial-contracts",
    "type": "subdomain",
    "fr": "Contrats commerciaux et obligations d'affaires",
    "en": "Commercial contracts and obligations",
    "parentId": "domain:business-law",
    "aliases": [
      "contrat commercial",
      "contrats d'affaires"
    ]
  },
  {
    "id": "subdomain-law:business-insolvency",
    "type": "subdomain",
    "fr": "Difficultés des entreprises et procédures collectives",
    "en": "Business insolvency and restructuring",
    "parentId": "domain:business-law",
    "aliases": [
      "faillite",
      "liquidation judiciaire"
    ]
  },
  {
    "id": "subdomain-law:civil-obligations",
    "type": "subdomain",
    "fr": "Obligations, responsabilité et réparation civile",
    "en": "Civil obligations and liability",
    "parentId": "domain:civil-family-law",
    "aliases": [
      "responsabilité civile",
      "dommages intérêts"
    ]
  },
  {
    "id": "subdomain-law:family-law",
    "type": "subdomain",
    "fr": "Droit de la famille et des personnes",
    "en": "Family and personal status law",
    "parentId": "domain:civil-family-law",
    "aliases": [
      "divorce et garde des enfants",
      "droit familial"
    ]
  },
  {
    "id": "subdomain-law:property-real-estate",
    "type": "subdomain",
    "fr": "Droit des biens, propriété et immobilier",
    "en": "Property and real estate law",
    "parentId": "domain:civil-family-law",
    "aliases": [
      "litige foncier",
      "propriété immobilière"
    ]
  },
  {
    "id": "subdomain-law:inheritance-estates",
    "type": "subdomain",
    "fr": "Successions, donations et libéralités",
    "en": "Inheritance and estate law",
    "parentId": "domain:civil-family-law",
    "aliases": [
      "succession",
      "héritage"
    ]
  },
  {
    "id": "subdomain-law:employment-contracts",
    "type": "subdomain",
    "fr": "Contrats de travail et relations individuelles",
    "en": "Employment contracts and individual relations",
    "parentId": "domain:labour-law",
    "aliases": [
      "contrat de travail",
      "licenciement"
    ]
  },
  {
    "id": "subdomain-law:collective-labour",
    "type": "subdomain",
    "fr": "Relations collectives, syndicats et négociation",
    "en": "Collective labour relations",
    "parentId": "domain:labour-law",
    "aliases": [
      "convention collective",
      "syndicat"
    ]
  },
  {
    "id": "subdomain-law:workplace-health-rights",
    "type": "subdomain",
    "fr": "Droits, santé et sécurité au travail",
    "en": "Workplace rights, health and safety",
    "parentId": "domain:labour-law",
    "aliases": [
      "sécurité au travail",
      "accident du travail"
    ]
  },
  {
    "id": "subdomain-law:employment-disputes",
    "type": "subdomain",
    "fr": "Conflits individuels et collectifs du travail",
    "en": "Employment disputes",
    "parentId": "domain:labour-law",
    "aliases": [
      "conflit employeur salarié",
      "litige social"
    ]
  },
  {
    "id": "subdomain-law:civil-litigation",
    "type": "subdomain",
    "fr": "Contentieux civil et commercial",
    "en": "Civil and commercial litigation",
    "parentId": "domain:justice-litigation",
    "aliases": [
      "contentieux civil",
      "procès commercial"
    ]
  },
  {
    "id": "subdomain-law:criminal-justice",
    "type": "subdomain",
    "fr": "Justice pénale et droits de la défense",
    "en": "Criminal justice and defence rights",
    "parentId": "domain:justice-litigation",
    "aliases": [
      "procédure pénale",
      "défense pénale"
    ]
  },
  {
    "id": "subdomain-law:administrative-litigation",
    "type": "subdomain",
    "fr": "Contentieux administratif et recours",
    "en": "Administrative litigation and appeals",
    "parentId": "domain:justice-litigation",
    "aliases": [
      "recours administratif contentieux"
    ]
  },
  {
    "id": "subdomain-law:alternative-dispute-resolution",
    "type": "subdomain",
    "fr": "Médiation, conciliation et arbitrage",
    "en": "Mediation, conciliation and arbitration",
    "parentId": "domain:justice-litigation",
    "aliases": [
      "règlement amiable",
      "arbitrage"
    ]
  },
  {
    "id": "subdomain-law:legal-consultation",
    "type": "subdomain",
    "fr": "Consultation et analyse juridiques",
    "en": "Legal consultation and analysis",
    "parentId": "domain:legal-advisory-acts",
    "aliases": [
      "consultation juridique",
      "avis juridique"
    ]
  },
  {
    "id": "subdomain-law:legal-document-drafting",
    "type": "subdomain",
    "fr": "Rédaction et revue d'actes juridiques",
    "en": "Legal drafting and document review",
    "parentId": "domain:legal-advisory-acts",
    "aliases": [
      "rédaction d'un acte juridique",
      "contrat"
    ]
  },
  {
    "id": "subdomain-law:notarial-services",
    "type": "subdomain",
    "fr": "Actes authentiques et services notariaux",
    "en": "Notarial instruments and services",
    "parentId": "domain:legal-advisory-acts",
    "aliases": [
      "acte notarié",
      "authentification"
    ]
  },
  {
    "id": "subdomain-law:legal-compliance",
    "type": "subdomain",
    "fr": "Conformité juridique et veille réglementaire",
    "en": "Legal compliance and regulatory monitoring",
    "parentId": "domain:legal-advisory-acts",
    "aliases": [
      "veille juridique",
      "conformité légale"
    ]
  },
  {
    "id": "specialization-law:corporate-governance",
    "type": "specialization",
    "fr": "Gouvernance et secrétariat juridique des sociétés",
    "en": "Corporate governance and company secretarial practice",
    "parentId": "domain:business-law",
    "aliases": [
      "secrétariat juridique"
    ]
  },
  {
    "id": "specialization-law:business-transactions",
    "type": "specialization",
    "fr": "Fusions, acquisitions et transactions",
    "en": "Mergers, acquisitions and transactions",
    "parentId": "domain:business-law",
    "aliases": [
      "fusion acquisition"
    ]
  },
  {
    "id": "specialization-law:family-mediation",
    "type": "specialization",
    "fr": "Médiation familiale et protection des personnes",
    "en": "Family mediation and protection",
    "parentId": "domain:civil-family-law",
    "aliases": [
      "médiation familiale"
    ]
  },
  {
    "id": "specialization-law:employment-compliance",
    "type": "specialization",
    "fr": "Conformité sociale et droit du travail",
    "en": "Employment compliance",
    "parentId": "domain:labour-law",
    "aliases": [
      "conformité sociale"
    ]
  },
  {
    "id": "specialization-law:digital-justice",
    "type": "specialization",
    "fr": "Justice numérique et gestion électronique des dossiers",
    "en": "Digital justice and e-case management",
    "parentId": "domain:justice-litigation",
    "aliases": [
      "justice numérique"
    ]
  },
  {
    "id": "specialization-law:arbitration-practice",
    "type": "specialization",
    "fr": "Pratique de l'arbitrage et règlement transfrontalier",
    "en": "Arbitration and cross-border dispute resolution",
    "parentId": "domain:justice-litigation",
    "aliases": [
      "arbitrage international"
    ]
  },
  {
    "id": "specialization-law:legal-ethics",
    "type": "specialization",
    "fr": "Déontologie, secret professionnel et conflits d'intérêts",
    "en": "Legal ethics and professional secrecy",
    "parentId": "domain:legal-advisory-acts",
    "aliases": [
      "déontologie juridique"
    ]
  },
  {
    "id": "occupation-law:lawyer",
    "type": "occupation",
    "fr": "Avocat",
    "en": "Lawyer",
    "parentId": "domain:legal-advisory-acts",
    "aliases": [
      "avocat conseil"
    ]
  },
  {
    "id": "occupation-law:in-house-counsel",
    "type": "occupation",
    "fr": "Juriste d'entreprise",
    "en": "In-house counsel",
    "parentId": "domain:business-law",
    "aliases": [
      "juriste entreprise"
    ]
  },
  {
    "id": "occupation-law:notary",
    "type": "occupation",
    "fr": "Notaire",
    "en": "Notary",
    "parentId": "domain:legal-advisory-acts",
    "aliases": [
      "notaire"
    ]
  },
  {
    "id": "occupation-law:bailiff",
    "type": "occupation",
    "fr": "Commissaire de justice / huissier",
    "en": "Bailiff / judicial officer",
    "parentId": "domain:justice-litigation",
    "aliases": [
      "huissier de justice"
    ]
  },
  {
    "id": "occupation-law:judge",
    "type": "occupation",
    "fr": "Magistrat du siège",
    "en": "Judge",
    "parentId": "domain:justice-litigation",
    "aliases": [
      "juge"
    ]
  },
  {
    "id": "occupation-law:prosecutor",
    "type": "occupation",
    "fr": "Magistrat du parquet",
    "en": "Public prosecutor",
    "parentId": "domain:justice-litigation",
    "aliases": [
      "procureur"
    ]
  },
  {
    "id": "occupation-law:court-clerk",
    "type": "occupation",
    "fr": "Greffier",
    "en": "Court clerk",
    "parentId": "domain:justice-litigation",
    "aliases": [
      "greffier tribunal"
    ]
  },
  {
    "id": "occupation-law:legal-assistant",
    "type": "occupation",
    "fr": "Assistant juridique",
    "en": "Legal assistant",
    "parentId": "domain:legal-advisory-acts",
    "aliases": [
      "secrétaire juridique"
    ]
  },
  {
    "id": "occupation-law:mediator",
    "type": "occupation",
    "fr": "Médiateur / conciliateur",
    "en": "Mediator / conciliator",
    "parentId": "domain:justice-litigation",
    "aliases": [
      "conciliateur"
    ]
  },
  {
    "id": "occupation-law:labour-inspector",
    "type": "occupation",
    "fr": "Inspecteur du travail",
    "en": "Labour inspector",
    "parentId": "domain:labour-law",
    "aliases": [
      "inspection du travail"
    ]
  },
  {
    "id": "occupation-law:compliance-officer",
    "type": "occupation",
    "fr": "Responsable conformité juridique",
    "en": "Legal compliance officer",
    "parentId": "domain:legal-advisory-acts",
    "aliases": [
      "responsable conformité"
    ]
  },
  {
    "id": "occupation-law:legal-researcher",
    "type": "occupation",
    "fr": "Chercheur ou documentaliste juridique",
    "en": "Legal researcher / law librarian",
    "parentId": "domain:legal-advisory-acts",
    "aliases": [
      "documentaliste juridique"
    ]
  },
  {
    "id": "activity-law:legal-information",
    "type": "activity",
    "fr": "Fourniture d'information juridique générale",
    "en": "General legal information",
    "parentId": "domain:legal-advisory-acts",
    "aliases": [
      "information juridique générale"
    ]
  },
  {
    "id": "activity-law:personalized-legal-consultation",
    "type": "activity",
    "fr": "Consultation juridique personnalisée",
    "en": "Personalized legal consultation",
    "parentId": "domain:legal-advisory-acts",
    "aliases": [
      "consultation juridique personnalisée"
    ]
  },
  {
    "id": "activity-law:contract-review",
    "type": "activity",
    "fr": "Analyse et revue d'un contrat",
    "en": "Contract review",
    "parentId": "domain:business-law",
    "aliases": [
      "analyse de contrat"
    ]
  },
  {
    "id": "activity-law:legal-document-drafting",
    "type": "activity",
    "fr": "Rédaction d'un acte ou document juridique",
    "en": "Legal document drafting",
    "parentId": "domain:legal-advisory-acts",
    "aliases": [
      "rédiger un acte juridique"
    ]
  },
  {
    "id": "activity-law:company-registration",
    "type": "activity",
    "fr": "Préparation d'un dossier de création de société",
    "en": "Company registration filing",
    "parentId": "domain:business-law",
    "aliases": [
      "immatriculation société"
    ]
  },
  {
    "id": "activity-law:employment-advice",
    "type": "activity",
    "fr": "Conseil relatif à une relation de travail",
    "en": "Employment law advice",
    "parentId": "domain:labour-law",
    "aliases": [
      "conseil droit du travail"
    ]
  },
  {
    "id": "activity-law:case-filing",
    "type": "activity",
    "fr": "Dépôt et suivi d'un dossier contentieux",
    "en": "Court filing and case tracking",
    "parentId": "domain:justice-litigation",
    "aliases": [
      "déposer un dossier au tribunal"
    ]
  },
  {
    "id": "activity-law:hearing-representation",
    "type": "activity",
    "fr": "Représentation d'une partie à une audience",
    "en": "Courtroom representation",
    "parentId": "domain:justice-litigation",
    "aliases": [
      "représentation devant une juridiction"
    ]
  },
  {
    "id": "activity-law:mediation-session",
    "type": "activity",
    "fr": "Conduite d'une séance de médiation",
    "en": "Mediation session",
    "parentId": "domain:justice-litigation",
    "aliases": [
      "séance de médiation"
    ]
  },
  {
    "id": "activity-law:notarial-authentication",
    "type": "activity",
    "fr": "Authentification ou réception d'un acte notarié",
    "en": "Notarial authentication",
    "parentId": "domain:legal-advisory-acts",
    "aliases": [
      "authentification notaire"
    ]
  },
  {
    "id": "activity-law:legal-monitoring",
    "type": "activity",
    "fr": "Veille et analyse des évolutions juridiques",
    "en": "Legal monitoring",
    "parentId": "domain:legal-advisory-acts",
    "aliases": [
      "veille juridique"
    ]
  },
  {
    "id": "activity-law:judgment-rendering",
    "type": "activity",
    "fr": "Rendu d'une décision juridictionnelle par l'autorité compétente",
    "en": "Judgment delivered by a competent court",
    "parentId": "domain:justice-litigation",
    "aliases": [
      "rendre un jugement"
    ]
  },
  {
    "id": "process-law:company-life-cycle",
    "type": "process",
    "fr": "Cycle de vie juridique d'une entreprise",
    "en": "Company legal lifecycle",
    "parentId": "domain:business-law",
    "aliases": [
      "création modification dissolution société"
    ]
  },
  {
    "id": "process-law:contract-life-cycle",
    "type": "process",
    "fr": "Cycle de préparation, conclusion et exécution d'un contrat",
    "en": "Contract lifecycle",
    "parentId": "domain:business-law",
    "aliases": [
      "cycle de vie contrat"
    ]
  },
  {
    "id": "process-law:civil-case-procedure",
    "type": "process",
    "fr": "Procédure d'un dossier civil",
    "en": "Civil case procedure",
    "parentId": "domain:justice-litigation",
    "aliases": [
      "procédure contentieux civil"
    ]
  },
  {
    "id": "process-law:criminal-case-procedure",
    "type": "process",
    "fr": "Procédure d'un dossier pénal",
    "en": "Criminal case procedure",
    "parentId": "domain:justice-litigation",
    "aliases": [
      "procédure dossier pénal"
    ]
  },
  {
    "id": "process-law:employment-dispute-process",
    "type": "process",
    "fr": "Traitement d'un différend du travail",
    "en": "Employment dispute process",
    "parentId": "domain:labour-law",
    "aliases": [
      "procédure litige travail"
    ]
  },
  {
    "id": "process-law:family-case-process",
    "type": "process",
    "fr": "Traitement d'un dossier familial",
    "en": "Family case process",
    "parentId": "domain:civil-family-law",
    "aliases": [
      "procédure divorce succession"
    ]
  },
  {
    "id": "process-law:mediation-arbitration-process",
    "type": "process",
    "fr": "Processus de médiation ou d'arbitrage",
    "en": "Mediation or arbitration process",
    "parentId": "domain:justice-litigation",
    "aliases": [
      "processus arbitrage médiation"
    ]
  },
  {
    "id": "process-law:legal-compliance-cycle",
    "type": "process",
    "fr": "Cycle de conformité et de veille juridique",
    "en": "Legal compliance cycle",
    "parentId": "domain:legal-advisory-acts",
    "aliases": [
      "processus conformité juridique"
    ]
  },
  {
    "id": "problem-law:legal-uncertainty",
    "type": "problem",
    "fr": "Incertitude sur les droits et obligations applicables",
    "en": "Uncertainty about applicable rights and duties",
    "parentId": "domain:legal-advisory-acts",
    "aliases": [
      "ne connaît pas ses droits"
    ]
  },
  {
    "id": "problem-law:contractual-risk",
    "type": "problem",
    "fr": "Clauses ambiguës ou risques contractuels non maîtrisés",
    "en": "Ambiguous clauses and unmanaged contractual risk",
    "parentId": "domain:business-law",
    "aliases": [
      "contrat mal rédigé"
    ]
  },
  {
    "id": "problem-law:company-filing-errors",
    "type": "problem",
    "fr": "Erreurs ou rejets dans les formalités d'entreprise",
    "en": "Errors or rejection in company filings",
    "parentId": "domain:business-law",
    "aliases": [
      "dossier entreprise rejeté"
    ]
  },
  {
    "id": "problem-law:family-disputes",
    "type": "problem",
    "fr": "Conflits familiaux et désaccords sur les responsabilités",
    "en": "Family disputes",
    "parentId": "domain:civil-family-law",
    "aliases": [
      "conflit familial"
    ]
  },
  {
    "id": "problem-law:workplace-disputes",
    "type": "problem",
    "fr": "Litiges et non-conformités dans la relation de travail",
    "en": "Workplace disputes and non-compliance",
    "parentId": "domain:labour-law",
    "aliases": [
      "litige employeur employé"
    ]
  },
  {
    "id": "problem-law:case-delays",
    "type": "problem",
    "fr": "Délais et manque de visibilité sur les dossiers judiciaires",
    "en": "Court delays and poor case visibility",
    "parentId": "domain:justice-litigation",
    "aliases": [
      "retard dossier tribunal"
    ]
  },
  {
    "id": "problem-law:access-to-justice",
    "type": "problem",
    "fr": "Difficulté d'accès à l'information et à la justice",
    "en": "Barriers to legal information and justice",
    "parentId": "domain:justice-litigation",
    "aliases": [
      "accès à la justice difficile"
    ]
  },
  {
    "id": "problem-law:unauthorized-practice",
    "type": "problem",
    "fr": "Conseil ou représentation par une personne non habilitée",
    "en": "Advice or representation by an unauthorized person",
    "parentId": "domain:legal-advisory-acts",
    "aliases": [
      "conseil juridique non autorisé"
    ]
  },
  {
    "id": "problem-law:legal-data-exposure",
    "type": "problem",
    "fr": "Divulgation de données ou pièces juridiques confidentielles",
    "en": "Exposure of confidential legal data",
    "parentId": "domain:legal-advisory-acts",
    "aliases": [
      "fuite dossier juridique"
    ]
  },
  {
    "id": "problem-law:conflict-of-interest",
    "type": "problem",
    "fr": "Conflit d'intérêts ou atteinte au secret professionnel",
    "en": "Conflict of interest or breach of professional secrecy",
    "parentId": "domain:legal-advisory-acts",
    "aliases": [
      "conflit intérêt avocat"
    ]
  },
  {
    "id": "resource-law:legislation",
    "type": "resource",
    "fr": "Textes législatifs et réglementaires applicables",
    "en": "Applicable legislation and regulations",
    "parentId": "domain:legal-advisory-acts",
    "aliases": [
      "lois et règlements"
    ]
  },
  {
    "id": "resource-law:case-law",
    "type": "resource",
    "fr": "Décisions de justice et jurisprudence",
    "en": "Court decisions and case law",
    "parentId": "domain:justice-litigation",
    "aliases": [
      "jurisprudence"
    ]
  },
  {
    "id": "resource-law:legal-case-file",
    "type": "resource",
    "fr": "Dossier juridique et pièces justificatives",
    "en": "Legal case file and supporting evidence",
    "parentId": "domain:justice-litigation",
    "aliases": [
      "dossier juridique"
    ]
  },
  {
    "id": "resource-law:contracts",
    "type": "resource",
    "fr": "Contrats, conventions et clauses",
    "en": "Contracts, agreements and clauses",
    "parentId": "domain:business-law",
    "aliases": [
      "contrats"
    ]
  },
  {
    "id": "resource-law:corporate-records",
    "type": "resource",
    "fr": "Registres et documents de sociétés",
    "en": "Corporate records and company documents",
    "parentId": "domain:business-law",
    "aliases": [
      "registre société"
    ]
  },
  {
    "id": "resource-law:legal-deadlines",
    "type": "resource",
    "fr": "Calendriers procéduraux et échéances juridiques",
    "en": "Procedural calendars and legal deadlines",
    "parentId": "domain:justice-litigation",
    "aliases": [
      "délais recours"
    ]
  },
  {
    "id": "resource-law:legal-knowledge-base",
    "type": "resource",
    "fr": "Référentiel juridique sourcé et daté",
    "en": "Sourced and dated legal knowledge base",
    "parentId": "domain:legal-advisory-acts",
    "aliases": [
      "base de données juridique"
    ]
  },
  {
    "id": "function-law:legal-intake",
    "type": "function",
    "fr": "Qualification et ouverture sécurisée d'un dossier juridique",
    "en": "Secure legal intake and case opening",
    "parentId": "domain:legal-advisory-acts",
    "aliases": [
      "formulaire dossier juridique"
    ]
  },
  {
    "id": "function-law:contract-management",
    "type": "function",
    "fr": "Gestion des contrats, versions et échéances",
    "en": "Contract management and versioning",
    "parentId": "domain:business-law",
    "aliases": [
      "gestion contrat"
    ]
  },
  {
    "id": "function-law:legal-research",
    "type": "function",
    "fr": "Recherche juridique avec sources et dates",
    "en": "Legal research with sources and dates",
    "parentId": "domain:legal-advisory-acts",
    "aliases": [
      "recherche juridique"
    ]
  },
  {
    "id": "function-law:case-management",
    "type": "function",
    "fr": "Gestion des dossiers, audiences et échéances",
    "en": "Legal case and hearing management",
    "parentId": "domain:justice-litigation",
    "aliases": [
      "logiciel suivi dossier tribunal"
    ]
  },
  {
    "id": "function-law:document-automation",
    "type": "function",
    "fr": "Préparation assistée de documents juridiques",
    "en": "Assisted legal document preparation",
    "parentId": "domain:legal-advisory-acts",
    "aliases": [
      "générateur acte juridique"
    ]
  },
  {
    "id": "function-law:dispute-resolution",
    "type": "function",
    "fr": "Gestion des médiations, conciliations et arbitrages",
    "en": "Dispute resolution management",
    "parentId": "domain:justice-litigation",
    "aliases": [
      "gestion médiation"
    ]
  },
  {
    "id": "function-law:compliance-monitoring",
    "type": "function",
    "fr": "Suivi des obligations et alertes de conformité",
    "en": "Compliance obligations monitoring",
    "parentId": "domain:legal-advisory-acts",
    "aliases": [
      "alerte conformité juridique"
    ]
  },
  {
    "id": "indicator-law:case-processing-time",
    "type": "indicator",
    "fr": "Délai médian de traitement d'un dossier juridique",
    "en": "Median legal case processing time",
    "parentId": "domain:justice-litigation",
    "aliases": [
      "délai traitement dossier"
    ]
  },
  {
    "id": "indicator-law:deadline-compliance",
    "type": "indicator",
    "fr": "Taux de respect des échéances procédurales",
    "en": "Procedural deadline compliance rate",
    "parentId": "domain:justice-litigation",
    "aliases": [
      "respect délais procédure"
    ]
  },
  {
    "id": "indicator-law:contract-risk-rate",
    "type": "indicator",
    "fr": "Part des contrats présentant un risque majeur identifié",
    "en": "Share of contracts with identified major risks",
    "parentId": "domain:business-law",
    "aliases": [
      "risque contractuel"
    ]
  },
  {
    "id": "indicator-law:filing-acceptance-rate",
    "type": "indicator",
    "fr": "Taux d'acceptation des formalités déposées",
    "en": "Filing acceptance rate",
    "parentId": "domain:business-law",
    "aliases": [
      "taux acceptation formalités"
    ]
  },
  {
    "id": "indicator-law:dispute-resolution-rate",
    "type": "indicator",
    "fr": "Part des différends résolus par voie amiable",
    "en": "Dispute resolution rate through amicable means",
    "parentId": "domain:justice-litigation",
    "aliases": [
      "taux résolution amiable"
    ]
  },
  {
    "id": "indicator-law:client-satisfaction",
    "type": "indicator",
    "fr": "Satisfaction des clients ou usagers du service juridique",
    "en": "Legal service client satisfaction",
    "parentId": "domain:legal-advisory-acts",
    "aliases": [
      "satisfaction client juridique"
    ]
  },
  {
    "id": "indicator-law:confidentiality-incidents",
    "type": "indicator",
    "fr": "Nombre d'incidents de confidentialité et d'accès indu",
    "en": "Confidentiality and unauthorized access incidents",
    "parentId": "domain:legal-advisory-acts",
    "aliases": [
      "incident confidentialité"
    ]
  }
];

function conceptBase(id:string, canonicalKey:string, conceptType:string, fr:string, en:string, frDefinition:string, enDefinition:string, parentId?:string): KnowledgeConcept {
  return {
    id, canonicalKey, conceptType,
    definitions:[{language:"fr",label:fr,definition:frDefinition},{language:"en",label:en,definition:enDefinition}],
    terms:[{value:fr,language:"fr",kind:"preferred"},{value:en,language:"en",kind:"preferred"}],
    classifications: parentId ? [{classificationType:"universal-domain",parentConceptId:parentId}] : [],
    attributes:[],relationships:[],scope:{global:true},
    lifecycle:{status:"validated",version:1,createdAt:CREATED_AT,updatedAt:CREATED_AT},
    sources:[{id:SOURCE_ID,sourceType:"curated_domain_knowledge",label:"MerKora GDJ — Famille 12 Droit et services juridiques, version 1"}],
    reliability:{evidenceLevel:"documented",reviewStatus:"not_reviewed",verificationNotes:[
      "Le droit applicable, les professions réglementées, les actes réservés, les compétences juridictionnelles, les délais et les voies de recours dépendent du pays et de la date des textes.",
      "Le moteur fournit de l'information générale et de l'aide organisationnelle ; il ne se présente pas comme avocat, notaire, magistrat ou conseil habilité.",
      "Tout conseil individualisé, acte réservé, dépôt officiel, représentation ou décision doit être validé et exécuté par un professionnel ou une autorité légalement habilitée.",
      "Les pièces, consultations et dossiers juridiques peuvent être confidentiels ou couverts par le secret professionnel ; accès minimal, chiffrement, traçabilité et conservation contrôlée sont requis.",
      "Une correspondance lexicale ou une synthèse IA ne constitue ni une source de droit ni une preuve de validité juridique."
    ]}
  };
}

const familyConcept = conceptBase(FAMILY_ID,"merkora.family.legal-services","domain_family","Droit et services juridiques","Law and legal services","Famille couvrant les droits, obligations, institutions de justice, professions et services juridiques.","Family covering rights, duties, justice institutions, legal professions and legal services.");
const domainConcepts: KnowledgeConcept[] = DOMAIN_SEEDS.map(d=>({
  ...conceptBase(d.id,`merkora.domain.${d.id.replace("domain:","")}`,"domain",d.fr,d.en,`Domaine couvrant les règles, acteurs, pratiques et services liés à ${d.fr.toLocaleLowerCase("fr")}.`,`Field covering rules, actors, practices and services related to ${d.en.toLocaleLowerCase("en")}.`),
  classifications:[{classificationType:"universal-domain",parentConceptId:FAMILY_ID},{classificationType:"universal-domain-family",parentConceptId:FAMILY_ID}],
  relationships:[{id:`rel:domain-family:${d.id.replace("domain:","")}`,sourceConceptId:d.id,targetConceptId:FAMILY_ID,predicate:"belongs_to_family",status:"validated",confidence:1,sourceIds:[SOURCE_ID],version:1}]
}));

function makeConcept(seed:Seed):KnowledgeConcept {
  const definitionFr = seed.type==="subdomain"
    ? `${seed.fr} regroupe les règles, acteurs, dossiers et opérations propres à ce champ. Le périmètre dépend du droit applicable et des compétences professionnelles locales.`
    : seed.type==="occupation"
    ? `${seed.fr} désigne un rôle professionnel intervenant dans le champ juridique. Les actes pouvant être accomplis dépendent des qualifications, habilitations et règles déontologiques applicables.`
    : seed.type==="activity"
    ? `${seed.fr} est une activité du parcours juridique. Elle doit être distinguée de l'information générale, du conseil réservé, de la représentation et de la décision d'une autorité.`
    : `${seed.fr} désigne un élément du référentiel juridique MerKora, à contextualiser selon la juridiction, les textes en vigueur et les acteurs habilités.`;
  const definitionEn = seed.type==="subdomain"
    ? `${seed.en} groups the rules, actors, case files and operations in this field. Its scope depends on applicable law and local professional powers.`
    : seed.type==="occupation"
    ? `${seed.en} is a professional role in the legal field. Permitted acts depend on qualifications, authorization and applicable professional conduct rules.`
    : seed.type==="activity"
    ? `${seed.en} is an activity in a legal workflow. It must be distinguished from general information, reserved advice, representation and a court decision.`
    : `${seed.en} is a MerKora legal knowledge concept to be contextualized against current jurisdictional law and authorized actors.`;
  return {
    ...conceptBase(seed.id,`merkora.legal.${seed.type}.${seed.id.replace(/^[^:]+:/,"")}`,seed.type,seed.fr,seed.en,definitionFr,definitionEn,seed.parentId),
    terms:[{value:seed.fr,language:"fr",kind:"preferred"},{value:seed.en,language:"en",kind:"preferred"},...seed.aliases.map(value=>({value,language:"fr",kind:"synonym" as const}))],
  };
}

export const LEGAL_SERVICES_FAMILY_ID = FAMILY_ID;
export const LEGAL_SERVICES_DOMAINS = domainConcepts;
export const LEGAL_SERVICES_CATALOG: KnowledgeConcept[] = SEEDS.map(makeConcept);
export const LEGAL_SERVICES_FAMILY_CONCEPTS: KnowledgeConcept[] = [familyConcept,...domainConcepts];

const relationSeeds = [
  ["activity-law:contract-review","process-law:contract-life-cycle","part_of"],
  ["activity-law:company-registration","process-law:company-life-cycle","part_of"],
  ["activity-law:case-filing","process-law:civil-case-procedure","part_of"],
  ["function-law:case-management","activity-law:case-filing","supports"],
  ["function-law:legal-research","resource-law:legislation","searches"],
  ["problem-law:unauthorized-practice","specialization-law:legal-ethics","addressed_by"],
  ["problem-law:case-delays","function-law:case-management","may_be_mitigated_by"],
  ["function-law:contract-management","resource-law:contracts","manages"],
] as const;
export const LEGAL_SERVICES_RELATIONSHIPS: KnowledgeRelationship[] = relationSeeds.map(([sourceConceptId,targetConceptId,predicate],i)=>({
  id:`rel:family-12-${i+1}`,sourceConceptId,targetConceptId,predicate,status:"validated",confidence:0.9,sourceIds:[SOURCE_ID],version:1
}));
