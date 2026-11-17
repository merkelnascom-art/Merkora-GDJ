import { createFamilyCatalog } from "./family-catalog-builder";

const result=createFamilyCatalog({
  "familyId": "family:education-research",
  "familyFr": "Éducation et recherche",
  "familyEn": "Education and research",
  "sourceId": "source:merkora-family-13-education-research-v1",
  "familyNumber": 13,
  "domains": [
    {
      "id": "domain:primary-secondary-education",
      "fr": "Enseignement scolaire",
      "en": "School education",
      "create": false
    },
    {
      "id": "domain:higher-education",
      "fr": "Enseignement supérieur",
      "en": "Higher education",
      "create": false
    },
    {
      "id": "domain:vocational-training",
      "fr": "Formation professionnelle",
      "en": "Vocational education and training",
      "create": false
    },
    {
      "id": "domain:research-development",
      "fr": "Recherche scientifique",
      "en": "Scientific research",
      "create": false
    },
    {
      "id": "domain:career-guidance",
      "fr": "Orientation et accompagnement des parcours",
      "en": "Career guidance and pathway support",
      "create": true
    }
  ],
  "seeds": [
    {
      "id": "subdomain-edu:early-childhood",
      "type": "subdomain",
      "fr": "Éducation de la petite enfance",
      "en": "Early childhood education",
      "aliases": [
        "crèche",
        "préscolaire"
      ]
    },
    {
      "id": "subdomain-edu:school-primary",
      "type": "subdomain",
      "fr": "Enseignement primaire",
      "en": "Primary education",
      "aliases": [
        "école primaire"
      ]
    },
    {
      "id": "subdomain-edu:school-secondary",
      "type": "subdomain",
      "fr": "Enseignement secondaire",
      "en": "Secondary education",
      "aliases": [
        "enseignement secondaire"
      ]
    },
    {
      "id": "subdomain-edu:inclusive-education",
      "type": "subdomain",
      "fr": "Éducation inclusive et besoins éducatifs particuliers",
      "en": "Inclusive education and special educational needs",
      "aliases": [
        "éducation spécialisée"
      ]
    },
    {
      "id": "subdomain-edu:university-teaching",
      "type": "subdomain",
      "fr": "Enseignement universitaire",
      "en": "University teaching",
      "aliases": [
        "enseignement universitaire"
      ]
    },
    {
      "id": "subdomain-edu:higher-institutions",
      "type": "subdomain",
      "fr": "Institutions et gouvernance de l'enseignement supérieur",
      "en": "Higher education institutions and governance",
      "aliases": [
        "université",
        "grande école"
      ]
    },
    {
      "id": "subdomain-edu:academic-assessment",
      "type": "subdomain",
      "fr": "Évaluation académique et examens",
      "en": "Academic assessment and examinations",
      "aliases": [
        "examens universitaires"
      ]
    },
    {
      "id": "subdomain-edu:student-services",
      "type": "subdomain",
      "fr": "Services et vie étudiante",
      "en": "Student services and campus life",
      "aliases": [
        "vie étudiante"
      ]
    },
    {
      "id": "subdomain-edu:apprenticeship",
      "type": "subdomain",
      "fr": "Apprentissage et alternance",
      "en": "Apprenticeship and work-based learning",
      "aliases": [
        "alternance"
      ]
    },
    {
      "id": "subdomain-edu:continuing-vocational",
      "type": "subdomain",
      "fr": "Formation professionnelle continue",
      "en": "Continuing vocational education",
      "aliases": [
        "formation continue"
      ]
    },
    {
      "id": "subdomain-edu:technical-training",
      "type": "subdomain",
      "fr": "Formation technique et qualification métier",
      "en": "Technical and occupational training",
      "aliases": [
        "formation technique"
      ]
    },
    {
      "id": "subdomain-edu:certification",
      "type": "subdomain",
      "fr": "Certification et validation des compétences",
      "en": "Certification and skills validation",
      "aliases": [
        "certification professionnelle"
      ]
    },
    {
      "id": "subdomain-edu:scientific-research",
      "type": "subdomain",
      "fr": "Recherche scientifique fondamentale et appliquée",
      "en": "Basic and applied scientific research",
      "aliases": [
        "recherche scientifique"
      ]
    },
    {
      "id": "subdomain-edu:research-management",
      "type": "subdomain",
      "fr": "Gestion des projets et laboratoires de recherche",
      "en": "Research project and laboratory management",
      "aliases": [
        "gestion laboratoire recherche"
      ]
    },
    {
      "id": "subdomain-edu:research-ethics",
      "type": "subdomain",
      "fr": "Éthique, intégrité et reproductibilité scientifique",
      "en": "Research ethics, integrity and reproducibility",
      "aliases": [
        "intégrité scientifique"
      ]
    },
    {
      "id": "subdomain-edu:knowledge-transfer",
      "type": "subdomain",
      "fr": "Valorisation et transfert des connaissances",
      "en": "Knowledge transfer and valorization",
      "aliases": [
        "transfert de technologie"
      ]
    },
    {
      "id": "subdomain-edu:career-guidance",
      "type": "subdomain",
      "fr": "Orientation scolaire et professionnelle",
      "en": "Educational and career guidance",
      "aliases": [
        "orientation scolaire et professionnelle"
      ]
    },
    {
      "id": "subdomain-edu:career-assessment",
      "type": "subdomain",
      "fr": "Évaluation des intérêts et compétences",
      "en": "Interest and skills assessment",
      "aliases": [
        "bilan de compétences"
      ]
    },
    {
      "id": "subdomain-edu:career-counselling",
      "type": "subdomain",
      "fr": "Conseil et accompagnement de parcours",
      "en": "Career counselling and pathway support",
      "aliases": [
        "conseil orientation"
      ]
    },
    {
      "id": "subdomain-edu:educational-transition",
      "type": "subdomain",
      "fr": "Transitions, insertion et réorientation",
      "en": "Educational transitions and career reintegration",
      "aliases": [
        "réorientation professionnelle"
      ]
    },
    {
      "id": "specialization-edu:stem-education",
      "type": "specialization",
      "fr": "Éducation aux sciences, technologies, ingénierie et mathématiques",
      "en": "STEM education",
      "aliases": [
        "éducation STEM"
      ]
    },
    {
      "id": "specialization-edu:digital-learning",
      "type": "specialization",
      "fr": "Apprentissage numérique et hybride",
      "en": "Digital and blended learning",
      "aliases": [
        "e-learning"
      ]
    },
    {
      "id": "specialization-edu:competency-based-learning",
      "type": "specialization",
      "fr": "Approche par compétences",
      "en": "Competency-based learning",
      "aliases": [
        "approche par compétences"
      ]
    },
    {
      "id": "specialization-edu:adult-learning",
      "type": "specialization",
      "fr": "Formation et apprentissage des adultes",
      "en": "Adult learning",
      "aliases": [
        "andragogie"
      ]
    },
    {
      "id": "specialization-edu:open-science",
      "type": "specialization",
      "fr": "Science ouverte et données de recherche",
      "en": "Open science and research data",
      "aliases": [
        "science ouverte"
      ]
    },
    {
      "id": "specialization-edu:career-transition",
      "type": "specialization",
      "fr": "Transitions scolaires et professionnelles",
      "en": "Career transitions",
      "aliases": [
        "transition professionnelle"
      ]
    },
    {
      "id": "specialization-edu:inclusive-assessment",
      "type": "specialization",
      "fr": "Évaluation accessible et adaptée",
      "en": "Accessible and adapted assessment",
      "aliases": [
        "évaluation inclusive"
      ]
    },
    {
      "id": "occupation-edu:teacher",
      "type": "occupation",
      "fr": "Enseignant",
      "en": "Teacher",
      "aliases": [
        "professeur"
      ]
    },
    {
      "id": "occupation-edu:school-principal",
      "type": "occupation",
      "fr": "Chef d'établissement scolaire",
      "en": "School principal",
      "aliases": [
        "directeur d'école"
      ]
    },
    {
      "id": "occupation-edu:lecturer",
      "type": "occupation",
      "fr": "Enseignant-chercheur",
      "en": "Lecturer and academic",
      "aliases": [
        "enseignant chercheur"
      ]
    },
    {
      "id": "occupation-edu:trainer",
      "type": "occupation",
      "fr": "Formateur professionnel",
      "en": "Vocational trainer",
      "aliases": [
        "formateur"
      ]
    },
    {
      "id": "occupation-edu:instructional-designer",
      "type": "occupation",
      "fr": "Ingénieur pédagogique",
      "en": "Instructional designer",
      "aliases": [
        "concepteur pédagogique"
      ]
    },
    {
      "id": "occupation-edu:researcher",
      "type": "occupation",
      "fr": "Chercheur scientifique",
      "en": "Research scientist",
      "aliases": [
        "chercheur"
      ]
    },
    {
      "id": "occupation-edu:lab-manager",
      "type": "occupation",
      "fr": "Responsable de laboratoire",
      "en": "Laboratory manager",
      "aliases": [
        "gestionnaire laboratoire"
      ]
    },
    {
      "id": "occupation-edu:career-counsellor",
      "type": "occupation",
      "fr": "Conseiller d'orientation",
      "en": "Career counsellor",
      "aliases": [
        "conseiller orientation"
      ]
    },
    {
      "id": "occupation-edu:school-psychologist",
      "type": "occupation",
      "fr": "Psychologue de l'éducation",
      "en": "Educational psychologist",
      "aliases": [
        "psychologue scolaire"
      ]
    },
    {
      "id": "occupation-edu:registrar",
      "type": "occupation",
      "fr": "Responsable de scolarité et des examens",
      "en": "Registrar and examinations officer",
      "aliases": [
        "responsable scolarité"
      ]
    },
    {
      "id": "occupation-edu:quality-officer",
      "type": "occupation",
      "fr": "Responsable qualité pédagogique",
      "en": "Educational quality officer",
      "aliases": [
        "responsable qualité formation"
      ]
    },
    {
      "id": "occupation-edu:internship-coordinator",
      "type": "occupation",
      "fr": "Coordinateur de stages et d'alternance",
      "en": "Internship and apprenticeship coordinator",
      "aliases": [
        "coordinateur stage"
      ]
    },
    {
      "id": "activity-edu:course-design",
      "type": "activity",
      "fr": "Conception d'un cours et de séquences pédagogiques",
      "en": "Course and lesson design",
      "aliases": [
        "conception d'un cours"
      ]
    },
    {
      "id": "activity-edu:teaching-delivery",
      "type": "activity",
      "fr": "Animation d'une séance d'enseignement",
      "en": "Teaching delivery",
      "aliases": [
        "donner un cours"
      ]
    },
    {
      "id": "activity-edu:learning-assessment",
      "type": "activity",
      "fr": "Évaluation des acquis d'apprentissage",
      "en": "Learning outcomes assessment",
      "aliases": [
        "évaluation des acquis"
      ]
    },
    {
      "id": "activity-edu:student-admission",
      "type": "activity",
      "fr": "Admission et inscription d'un apprenant",
      "en": "Student admission and enrollment",
      "aliases": [
        "inscription étudiant"
      ]
    },
    {
      "id": "activity-edu:certification-award",
      "type": "activity",
      "fr": "Délivrance d'une certification ou attestation",
      "en": "Certification and credential award",
      "aliases": [
        "délivrance d'une certification"
      ]
    },
    {
      "id": "activity-edu:research-study",
      "type": "activity",
      "fr": "Conduite d'une étude scientifique",
      "en": "Conducting a scientific study",
      "aliases": [
        "conduite d'une étude scientifique"
      ]
    },
    {
      "id": "activity-edu:research-publication",
      "type": "activity",
      "fr": "Publication et diffusion de résultats scientifiques",
      "en": "Research publication and dissemination",
      "aliases": [
        "publication scientifique"
      ]
    },
    {
      "id": "activity-edu:career-guidance",
      "type": "activity",
      "fr": "Accompagnement à l'orientation",
      "en": "Career guidance counselling",
      "aliases": [
        "accompagnement à l'orientation"
      ]
    },
    {
      "id": "activity-edu:skills-assessment",
      "type": "activity",
      "fr": "Évaluation des compétences et acquis antérieurs",
      "en": "Skills and prior learning assessment",
      "aliases": [
        "bilan de compétences"
      ]
    },
    {
      "id": "activity-edu:internship-placement",
      "type": "activity",
      "fr": "Placement et suivi d'un stage",
      "en": "Internship placement and monitoring",
      "aliases": [
        "placement stage"
      ]
    },
    {
      "id": "activity-edu:learning-support",
      "type": "activity",
      "fr": "Accompagnement individualisé des apprentissages",
      "en": "Individual learning support",
      "aliases": [
        "soutien scolaire"
      ]
    },
    {
      "id": "activity-edu:research-ethics-review",
      "type": "activity",
      "fr": "Examen éthique d'un protocole de recherche",
      "en": "Research protocol ethics review",
      "aliases": [
        "évaluation éthique recherche"
      ]
    },
    {
      "id": "process-edu:student-learning-cycle",
      "type": "process",
      "fr": "Cycle de progression et d'évaluation de l'apprenant",
      "en": "Learner progression and assessment cycle",
      "aliases": [
        "parcours apprentissage"
      ]
    },
    {
      "id": "process-edu:academic-year-cycle",
      "type": "process",
      "fr": "Cycle annuel de scolarité et d'examens",
      "en": "Academic year and examination cycle",
      "aliases": [
        "année académique"
      ]
    },
    {
      "id": "process-edu:training-certification",
      "type": "process",
      "fr": "Parcours de formation et de certification professionnelle",
      "en": "Vocational training and certification pathway",
      "aliases": [
        "parcours certification"
      ]
    },
    {
      "id": "process-edu:research-project-cycle",
      "type": "process",
      "fr": "Cycle de vie d'un projet de recherche",
      "en": "Research project lifecycle",
      "aliases": [
        "projet de recherche"
      ]
    },
    {
      "id": "process-edu:publication-review",
      "type": "process",
      "fr": "Évaluation scientifique et publication",
      "en": "Peer review and publication",
      "aliases": [
        "évaluation par les pairs"
      ]
    },
    {
      "id": "process-edu:career-guidance-cycle",
      "type": "process",
      "fr": "Parcours de diagnostic et d'orientation",
      "en": "Career guidance pathway",
      "aliases": [
        "parcours orientation"
      ]
    },
    {
      "id": "process-edu:admission-selection",
      "type": "process",
      "fr": "Sélection et admission des candidats",
      "en": "Candidate selection and admission",
      "aliases": [
        "processus admission"
      ]
    },
    {
      "id": "process-edu:quality-improvement",
      "type": "process",
      "fr": "Amélioration continue de la qualité éducative",
      "en": "Continuous educational quality improvement",
      "aliases": [
        "amélioration qualité éducation"
      ]
    },
    {
      "id": "problem-edu:learning-gaps",
      "type": "problem",
      "fr": "Lacunes d'apprentissage et difficultés scolaires",
      "en": "Learning gaps and academic difficulties",
      "aliases": [
        "retard scolaire"
      ]
    },
    {
      "id": "problem-edu:dropout-risk",
      "type": "problem",
      "fr": "Risque de décrochage et d'abandon",
      "en": "Dropout risk",
      "aliases": [
        "décrochage scolaire"
      ]
    },
    {
      "id": "problem-edu:unequal-access",
      "type": "problem",
      "fr": "Inégalités d'accès à l'éducation et à la formation",
      "en": "Unequal access to education and training",
      "aliases": [
        "inégalité accès éducation"
      ]
    },
    {
      "id": "problem-edu:assessment-bias",
      "type": "problem",
      "fr": "Évaluations peu fiables ou biaisées",
      "en": "Unreliable or biased assessment",
      "aliases": [
        "évaluation injuste"
      ]
    },
    {
      "id": "problem-edu:credential-fraud",
      "type": "problem",
      "fr": "Fraude ou difficulté de vérification des diplômes",
      "en": "Credential fraud and verification issues",
      "aliases": [
        "faux diplôme"
      ]
    },
    {
      "id": "problem-edu:training-mismatch",
      "type": "problem",
      "fr": "Décalage entre formations et besoins professionnels",
      "en": "Skills and training mismatch",
      "aliases": [
        "formation inadéquate emploi"
      ]
    },
    {
      "id": "problem-edu:research-reproducibility",
      "type": "problem",
      "fr": "Faible reproductibilité et traçabilité de la recherche",
      "en": "Poor research reproducibility and traceability",
      "aliases": [
        "recherche non reproductible"
      ]
    },
    {
      "id": "problem-edu:research-funding",
      "type": "problem",
      "fr": "Difficulté de financement et de gestion de la recherche",
      "en": "Research funding and management difficulties",
      "aliases": [
        "manque financement recherche"
      ]
    },
    {
      "id": "problem-edu:career-uncertainty",
      "type": "problem",
      "fr": "Indécision et manque d'information sur les parcours",
      "en": "Career uncertainty and lack of pathway information",
      "aliases": [
        "ne sait pas quel métier choisir"
      ]
    },
    {
      "id": "problem-edu:student-data-risk",
      "type": "problem",
      "fr": "Exposition ou usage indu des données d'apprenants",
      "en": "Exposure or misuse of learner data",
      "aliases": [
        "fuite données élèves"
      ]
    },
    {
      "id": "resource-edu:curricula",
      "type": "resource",
      "fr": "Programmes, référentiels et curricula",
      "en": "Curricula and learning standards",
      "aliases": [
        "programme scolaire"
      ]
    },
    {
      "id": "resource-edu:learning-materials",
      "type": "resource",
      "fr": "Supports et ressources pédagogiques",
      "en": "Learning and teaching materials",
      "aliases": [
        "supports pédagogiques"
      ]
    },
    {
      "id": "resource-edu:learner-records",
      "type": "resource",
      "fr": "Dossiers scolaires et portfolios d'apprentissage",
      "en": "Learner records and portfolios",
      "aliases": [
        "dossier scolaire"
      ]
    },
    {
      "id": "resource-edu:research-data",
      "type": "resource",
      "fr": "Données, protocoles et résultats de recherche",
      "en": "Research data, protocols and findings",
      "aliases": [
        "données scientifiques"
      ]
    },
    {
      "id": "resource-edu:academic-library",
      "type": "resource",
      "fr": "Bibliothèques et ressources documentaires scientifiques",
      "en": "Academic libraries and scholarly resources",
      "aliases": [
        "bibliothèque universitaire"
      ]
    },
    {
      "id": "resource-edu:skills-frameworks",
      "type": "resource",
      "fr": "Référentiels de compétences et certifications",
      "en": "Skills frameworks and certifications",
      "aliases": [
        "référentiel compétences"
      ]
    },
    {
      "id": "resource-edu:career-information",
      "type": "resource",
      "fr": "Informations métiers, formations et débouchés",
      "en": "Occupation, education and career information",
      "aliases": [
        "fiches métiers"
      ]
    },
    {
      "id": "function-edu:learning-management",
      "type": "function",
      "fr": "Gestion des cours, contenus et activités d'apprentissage",
      "en": "Learning management",
      "aliases": [
        "plateforme e-learning"
      ]
    },
    {
      "id": "function-edu:assessment-management",
      "type": "function",
      "fr": "Création et suivi des évaluations",
      "en": "Assessment management",
      "aliases": [
        "gestion examens"
      ]
    },
    {
      "id": "function-edu:student-information",
      "type": "function",
      "fr": "Gestion des dossiers et parcours étudiants",
      "en": "Student information management",
      "aliases": [
        "logiciel scolarité"
      ]
    },
    {
      "id": "function-edu:research-management",
      "type": "function",
      "fr": "Gestion des projets, équipes et productions de recherche",
      "en": "Research management",
      "aliases": [
        "gestion recherche"
      ]
    },
    {
      "id": "function-edu:credential-verification",
      "type": "function",
      "fr": "Vérification des diplômes et certifications",
      "en": "Credential verification",
      "aliases": [
        "vérification diplôme"
      ]
    },
    {
      "id": "function-edu:career-guidance-platform",
      "type": "function",
      "fr": "Plateforme d'orientation et de découverte des métiers",
      "en": "Career guidance platform",
      "aliases": [
        "plateforme orientation métier"
      ]
    },
    {
      "id": "function-edu:internship-management",
      "type": "function",
      "fr": "Gestion des stages, alternances et partenariats",
      "en": "Internship and apprenticeship management",
      "aliases": [
        "gestion stages"
      ]
    },
    {
      "id": "indicator-edu:learning-outcome-rate",
      "type": "indicator",
      "fr": "Taux d'atteinte des acquis d'apprentissage",
      "en": "Learning outcomes achievement rate",
      "aliases": [
        "taux réussite apprentissage"
      ]
    },
    {
      "id": "indicator-edu:attendance-rate",
      "type": "indicator",
      "fr": "Taux de présence des apprenants",
      "en": "Learner attendance rate",
      "aliases": [
        "taux présence élèves"
      ]
    },
    {
      "id": "indicator-edu:dropout-rate",
      "type": "indicator",
      "fr": "Taux de décrochage ou d'abandon",
      "en": "Dropout rate",
      "aliases": [
        "taux abandon scolaire"
      ]
    },
    {
      "id": "indicator-edu:certification-rate",
      "type": "indicator",
      "fr": "Taux d'obtention des certifications",
      "en": "Certification attainment rate",
      "aliases": [
        "taux certification"
      ]
    },
    {
      "id": "indicator-edu:research-output",
      "type": "indicator",
      "fr": "Production scientifique validée par période",
      "en": "Validated research output per period",
      "aliases": [
        "publications recherche"
      ]
    },
    {
      "id": "indicator-edu:career-pathway-clarity",
      "type": "indicator",
      "fr": "Niveau de clarté du projet d'orientation",
      "en": "Career pathway clarity",
      "aliases": [
        "clarté orientation"
      ]
    },
    {
      "id": "indicator-edu:employability-rate",
      "type": "indicator",
      "fr": "Taux d'insertion professionnelle des diplômés",
      "en": "Graduate employment rate",
      "aliases": [
        "taux insertion diplômés"
      ]
    }
  ],
  "safetyNotes": [
    "Les programmes, diplômes, accréditations, conditions d'admission et équivalences varient selon le pays, l'autorité et l'établissement ; les sources officielles et leur date doivent être vérifiées.",
    "Les recommandations d'orientation sont exploratoires et explicables ; elles ne déterminent pas à la place de l'apprenant son avenir ou sa profession.",
    "Les décisions de notation, admission, certification, sanction ou diplomation restent prises par les personnes et organismes habilités.",
    "Les données d'apprenants, mineurs, résultats, besoins éducatifs et dossiers de recherche exigent minimisation, contrôle d'accès, consentement ou base légale, traçabilité et conservation limitée.",
    "Les résultats scientifiques doivent conserver provenance, protocole, limites, version et statut de revue ; une génération IA ne constitue pas une preuve scientifique."
  ]
},[
  [
    "activity-edu:course-design",
    "process-edu:student-learning-cycle",
    "part_of"
  ],
  [
    "activity-edu:learning-assessment",
    "process-edu:student-learning-cycle",
    "part_of"
  ],
  [
    "function-edu:learning-management",
    "activity-edu:teaching-delivery",
    "supports"
  ],
  [
    "function-edu:career-guidance-platform",
    "resource-edu:career-information",
    "uses"
  ],
  [
    "problem-edu:career-uncertainty",
    "function-edu:career-guidance-platform",
    "may_be_mitigated_by"
  ],
  [
    "activity-edu:research-publication",
    "process-edu:publication-review",
    "part_of"
  ],
  [
    "function-edu:research-management",
    "activity-edu:research-study",
    "supports"
  ],
  [
    "problem-edu:student-data-risk",
    "function-edu:student-information",
    "requires_control_by"
  ]
]);
export const EDUCATION_RESEARCH_FAMILY_CONCEPTS=result.familyConcepts;
export const EDUCATION_RESEARCH_CATALOG=result.catalog;
export const EDUCATION_RESEARCH_RELATIONSHIPS=result.relationships;
