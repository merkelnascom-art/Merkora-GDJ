import {createFamilyCatalog} from "./family-catalog-builder";
const result=createFamilyCatalog({
  "familyId": "family:business-management",
  "familyFr": "Gestion et services aux organisations",
  "familyEn": "Management and business services",
  "sourceId": "source:merkora-family-19-professional-services-v1",
  "familyNumber": 19,
  "domains": [
    {
      "id": "domain:business-administration",
      "fr": "Administration des entreprises",
      "en": "Business administration",
      "create": false
    },
    {
      "id": "domain:human-resources",
      "fr": "Ressources humaines",
      "en": "Human resources",
      "create": false
    },
    {
      "id": "domain:consulting",
      "fr": "Conseil et accompagnement",
      "en": "Consulting and advisory",
      "create": false
    },
    {
      "id": "domain:quality-risk-compliance",
      "fr": "Qualité, risques et conformité",
      "en": "Quality, risk and compliance",
      "create": false
    },
    {
      "id": "domain:entrepreneurship",
      "fr": "Entrepreneuriat",
      "en": "Entrepreneurship",
      "create": false
    }
  ],
  "seeds": [
  {
    "id": "subdomain-pro:business-consulting",
    "type": "subdomain",
    "fr": "Conseil en stratégie et organisation d'entreprise",
    "en": "Business strategy and organization consulting",
    "parentId": "domain:consulting",
    "aliases": [
      "Conseil en stratégie et organisation d'entreprise",
      "conseil en stratégie d'entreprise"
    ]
  },
  {
    "id": "subdomain-pro:business-operations",
    "type": "subdomain",
    "fr": "Gestion opérationnelle et administration d'entreprise",
    "en": "Business operations and administration",
    "parentId": "domain:business-administration",
    "aliases": [
      "Gestion opérationnelle et administration d'entreprise"
    ]
  },
  {
    "id": "subdomain-pro:business-planning",
    "type": "subdomain",
    "fr": "Planification, budgets et pilotage d'activité",
    "en": "Business planning, budgeting and performance",
    "parentId": "domain:business-administration",
    "aliases": [
      "Planification, budgets et pilotage d'activité"
    ]
  },
  {
    "id": "subdomain-pro:business-procurement",
    "type": "subdomain",
    "fr": "Achats et gestion des fournisseurs d'entreprise",
    "en": "Business procurement and supplier management",
    "parentId": "domain:business-administration",
    "aliases": [
      "Achats et gestion des fournisseurs d'entreprise"
    ]
  },
  {
    "id": "subdomain-pro:human-resources-operations",
    "type": "subdomain",
    "fr": "Gestion des ressources humaines",
    "en": "Human resources operations",
    "parentId": "domain:human-resources",
    "aliases": [
      "Gestion des ressources humaines",
      "gestion des ressources humaines"
    ]
  },
  {
    "id": "subdomain-pro:recruitment",
    "type": "subdomain",
    "fr": "Recrutement et acquisition de talents",
    "en": "Recruitment and talent acquisition",
    "parentId": "domain:human-resources",
    "aliases": [
      "Recrutement et acquisition de talents"
    ]
  },
  {
    "id": "subdomain-pro:payroll-administration",
    "type": "subdomain",
    "fr": "Administration de la paie et des avantages",
    "en": "Payroll and benefits administration",
    "parentId": "domain:human-resources",
    "aliases": [
      "Administration de la paie et des avantages"
    ]
  },
  {
    "id": "subdomain-pro:workforce-development",
    "type": "subdomain",
    "fr": "Développement des compétences et formation du personnel",
    "en": "Workforce learning and development",
    "parentId": "domain:human-resources",
    "aliases": [
      "Développement des compétences et formation du personnel"
    ]
  },
  {
    "id": "subdomain-pro:management-consulting",
    "type": "subdomain",
    "fr": "Conseil en management et transformation",
    "en": "Management and transformation consulting",
    "parentId": "domain:consulting",
    "aliases": [
      "Conseil en management et transformation"
    ]
  },
  {
    "id": "subdomain-pro:process-improvement",
    "type": "subdomain",
    "fr": "Amélioration des processus et organisation",
    "en": "Process improvement and organization",
    "parentId": "domain:consulting",
    "aliases": [
      "Amélioration des processus et organisation"
    ]
  },
  {
    "id": "subdomain-pro:professional-accounting",
    "type": "subdomain",
    "fr": "Services comptables et gestion administrative spécialisée",
    "en": "Accounting and specialized administrative services",
    "parentId": "domain:consulting",
    "aliases": [
      "Services comptables et gestion administrative spécialisée"
    ]
  },
  {
    "id": "subdomain-pro:technical-consulting",
    "type": "subdomain",
    "fr": "Conseil technique et ingénierie spécialisée",
    "en": "Technical and engineering consulting",
    "parentId": "domain:consulting",
    "aliases": [
      "Conseil technique et ingénierie spécialisée",
      "services professionnels spécialisés"
    ]
  },
  {
    "id": "subdomain-pro:quality-management",
    "type": "subdomain",
    "fr": "Management de la qualité et amélioration continue",
    "en": "Quality management and continuous improvement",
    "parentId": "domain:quality-risk-compliance",
    "aliases": [
      "Management de la qualité et amélioration continue"
    ]
  },
  {
    "id": "subdomain-pro:risk-management",
    "type": "subdomain",
    "fr": "Gestion des risques opérationnels et organisationnels",
    "en": "Operational and organizational risk management",
    "parentId": "domain:quality-risk-compliance",
    "aliases": [
      "Gestion des risques opérationnels et organisationnels"
    ]
  },
  {
    "id": "subdomain-pro:compliance-services",
    "type": "subdomain",
    "fr": "Conformité réglementaire et contrôle interne",
    "en": "Regulatory compliance and internal control",
    "parentId": "domain:quality-risk-compliance",
    "aliases": [
      "Conformité réglementaire et contrôle interne"
    ]
  },
  {
    "id": "subdomain-pro:security-risk-services",
    "type": "subdomain",
    "fr": "Sécurité, prévention et services de protection",
    "en": "Security, prevention and protection services",
    "parentId": "domain:quality-risk-compliance",
    "aliases": [
      "Sécurité, prévention et services de protection",
      "sécurité et prévention des risques"
    ]
  },
  {
    "id": "subdomain-pro:business-startup-support",
    "type": "subdomain",
    "fr": "Accompagnement à la création d'entreprise",
    "en": "Business startup support",
    "parentId": "domain:entrepreneurship",
    "aliases": [
      "Accompagnement à la création d'entreprise",
      "accompagnement à la création d'entreprise"
    ]
  },
  {
    "id": "subdomain-pro:business-development",
    "type": "subdomain",
    "fr": "Développement commercial et partenariats",
    "en": "Business development and partnerships",
    "parentId": "domain:entrepreneurship",
    "aliases": [
      "Développement commercial et partenariats"
    ]
  },
  {
    "id": "subdomain-pro:entrepreneurship-support",
    "type": "subdomain",
    "fr": "Incubation et accompagnement entrepreneurial",
    "en": "Entrepreneurship incubation and support",
    "parentId": "domain:entrepreneurship",
    "aliases": [
      "Incubation et accompagnement entrepreneurial"
    ]
  },
  {
    "id": "subdomain-pro:sme-support",
    "type": "subdomain",
    "fr": "Services aux petites et moyennes entreprises",
    "en": "Small and medium enterprise services",
    "parentId": "domain:entrepreneurship",
    "aliases": [
      "Services aux petites et moyennes entreprises"
    ]
  },
  {
    "id": "specialization-pro:organizational-transformation",
    "type": "specialization",
    "fr": "Transformation organisationnelle",
    "en": "Organizational transformation",
    "parentId": "domain:consulting",
    "aliases": [
      "Transformation organisationnelle"
    ]
  },
  {
    "id": "specialization-pro:people-analytics",
    "type": "specialization",
    "fr": "Analytique RH et planification des effectifs",
    "en": "People analytics and workforce planning",
    "parentId": "domain:human-resources",
    "aliases": [
      "Analytique RH et planification des effectifs"
    ]
  },
  {
    "id": "specialization-pro:outsourced-services",
    "type": "specialization",
    "fr": "Externalisation et services partagés",
    "en": "Outsourcing and shared services",
    "parentId": "domain:business-administration",
    "aliases": [
      "Externalisation et services partagés"
    ]
  },
  {
    "id": "specialization-pro:quality-assurance",
    "type": "specialization",
    "fr": "Assurance qualité et certification des organisations",
    "en": "Quality assurance and organizational certification",
    "parentId": "domain:quality-risk-compliance",
    "aliases": [
      "Assurance qualité et certification des organisations"
    ]
  },
  {
    "id": "specialization-pro:business-continuity",
    "type": "specialization",
    "fr": "Continuité d'activité et résilience organisationnelle",
    "en": "Business continuity and organizational resilience",
    "parentId": "domain:quality-risk-compliance",
    "aliases": [
      "Continuité d'activité et résilience organisationnelle"
    ]
  },
  {
    "id": "specialization-pro:entrepreneurial-finance",
    "type": "specialization",
    "fr": "Structuration et financement entrepreneurial",
    "en": "Entrepreneurial structuring and financing",
    "parentId": "domain:entrepreneurship",
    "aliases": [
      "Structuration et financement entrepreneurial"
    ]
  },
  {
    "id": "specialization-pro:professional-ethics",
    "type": "specialization",
    "fr": "Déontologie et indépendance des services professionnels",
    "en": "Professional ethics and independence",
    "parentId": "domain:consulting",
    "aliases": [
      "Déontologie et indépendance des services professionnels"
    ]
  },
  {
    "id": "occupation-pro:business-consultant",
    "type": "occupation",
    "fr": "Consultant en organisation",
    "en": "Business management consultant",
    "parentId": "domain:consulting",
    "aliases": [
      "Consultant en organisation"
    ]
  },
  {
    "id": "occupation-pro:hr-manager",
    "type": "occupation",
    "fr": "Responsable des ressources humaines",
    "en": "Human resources manager",
    "parentId": "domain:human-resources",
    "aliases": [
      "Responsable des ressources humaines"
    ]
  },
  {
    "id": "occupation-pro:recruiter",
    "type": "occupation",
    "fr": "Chargé de recrutement",
    "en": "Recruiter",
    "parentId": "domain:human-resources",
    "aliases": [
      "Chargé de recrutement"
    ]
  },
  {
    "id": "occupation-pro:accountant",
    "type": "occupation",
    "fr": "Comptable professionnel",
    "en": "Professional accountant",
    "parentId": "domain:consulting",
    "aliases": [
      "Comptable professionnel"
    ]
  },
  {
    "id": "occupation-pro:management-controller",
    "type": "occupation",
    "fr": "Contrôleur de gestion",
    "en": "Management controller",
    "parentId": "domain:business-administration",
    "aliases": [
      "Contrôleur de gestion"
    ]
  },
  {
    "id": "occupation-pro:quality-manager",
    "type": "occupation",
    "fr": "Responsable qualité",
    "en": "Quality manager",
    "parentId": "domain:quality-risk-compliance",
    "aliases": [
      "Responsable qualité"
    ]
  },
  {
    "id": "occupation-pro:risk-manager",
    "type": "occupation",
    "fr": "Responsable des risques",
    "en": "Risk manager",
    "parentId": "domain:quality-risk-compliance",
    "aliases": [
      "Responsable des risques"
    ]
  },
  {
    "id": "occupation-pro:security-manager",
    "type": "occupation",
    "fr": "Responsable sécurité et prévention",
    "en": "Security and prevention manager",
    "parentId": "domain:quality-risk-compliance",
    "aliases": [
      "Responsable sécurité et prévention"
    ]
  },
  {
    "id": "occupation-pro:business-developer",
    "type": "occupation",
    "fr": "Responsable développement d'affaires",
    "en": "Business development manager",
    "parentId": "domain:entrepreneurship",
    "aliases": [
      "Responsable développement d'affaires"
    ]
  },
  {
    "id": "occupation-pro:entrepreneur",
    "type": "occupation",
    "fr": "Entrepreneur ou dirigeant de PME",
    "en": "Entrepreneur or SME owner",
    "parentId": "domain:entrepreneurship",
    "aliases": [
      "Entrepreneur ou dirigeant de PME"
    ]
  },
  {
    "id": "occupation-pro:operations-manager",
    "type": "occupation",
    "fr": "Responsable des opérations",
    "en": "Operations manager",
    "parentId": "domain:business-administration",
    "aliases": [
      "Responsable des opérations"
    ]
  },
  {
    "id": "occupation-pro:internal-auditor",
    "type": "occupation",
    "fr": "Auditeur interne organisationnel",
    "en": "Internal organizational auditor",
    "parentId": "domain:quality-risk-compliance",
    "aliases": [
      "Auditeur interne organisationnel"
    ]
  },
  {
    "id": "activity-pro:consulting-engagement",
    "type": "activity",
    "fr": "Réalisation d'une mission de conseil",
    "en": "Delivering a consulting engagement",
    "parentId": "domain:consulting",
    "aliases": [
      "Réalisation d'une mission de conseil",
      "réalisation d'une mission de conseil"
    ]
  },
  {
    "id": "activity-pro:organizational-audit",
    "type": "activity",
    "fr": "Conduite d'un audit organisationnel",
    "en": "Conducting an organizational audit",
    "parentId": "domain:quality-risk-compliance",
    "aliases": [
      "Conduite d'un audit organisationnel",
      "conduite d'un audit organisationnel"
    ]
  },
  {
    "id": "activity-pro:employee-recruitment",
    "type": "activity",
    "fr": "Recrutement d'un salarié",
    "en": "Recruiting an employee",
    "parentId": "domain:human-resources",
    "aliases": [
      "Recrutement d'un salarié",
      "recrutement d'un salarié"
    ]
  },
  {
    "id": "activity-pro:service-delivery",
    "type": "activity",
    "fr": "Exécution d'une prestation de service",
    "en": "Delivering a professional service",
    "parentId": "domain:consulting",
    "aliases": [
      "Exécution d'une prestation de service",
      "exécution d'une prestation de service"
    ]
  },
  {
    "id": "activity-pro:contract-monitoring",
    "type": "activity",
    "fr": "Suivi d'un contrat de prestation",
    "en": "Monitoring a service contract",
    "parentId": "domain:business-administration",
    "aliases": [
      "Suivi d'un contrat de prestation",
      "suivi d'un contrat de prestation"
    ]
  },
  {
    "id": "activity-pro:workforce-planning",
    "type": "activity",
    "fr": "Planification des effectifs et compétences",
    "en": "Workforce and skills planning",
    "parentId": "domain:human-resources",
    "aliases": [
      "Planification des effectifs et compétences"
    ]
  },
  {
    "id": "activity-pro:quality-inspection",
    "type": "activity",
    "fr": "Inspection qualité d'un service ou processus",
    "en": "Quality inspection of a service or process",
    "parentId": "domain:quality-risk-compliance",
    "aliases": [
      "Inspection qualité d'un service ou processus"
    ]
  },
  {
    "id": "activity-pro:risk-assessment",
    "type": "activity",
    "fr": "Évaluation des risques opérationnels",
    "en": "Operational risk assessment",
    "parentId": "domain:quality-risk-compliance",
    "aliases": [
      "Évaluation des risques opérationnels"
    ]
  },
  {
    "id": "activity-pro:business-plan-design",
    "type": "activity",
    "fr": "Élaboration d'un plan d'affaires",
    "en": "Preparing a business plan",
    "parentId": "domain:entrepreneurship",
    "aliases": [
      "Élaboration d'un plan d'affaires"
    ]
  },
  {
    "id": "activity-pro:employee-training",
    "type": "activity",
    "fr": "Organisation d'une formation professionnelle interne",
    "en": "Organizing internal professional training",
    "parentId": "domain:human-resources",
    "aliases": [
      "Organisation d'une formation professionnelle interne"
    ]
  },
  {
    "id": "activity-pro:supplier-assessment",
    "type": "activity",
    "fr": "Évaluation et suivi d'un fournisseur",
    "en": "Supplier assessment and monitoring",
    "parentId": "domain:business-administration",
    "aliases": [
      "Évaluation et suivi d'un fournisseur"
    ]
  },
  {
    "id": "activity-pro:business-development",
    "type": "activity",
    "fr": "Développement d'un partenariat commercial",
    "en": "Developing a business partnership",
    "parentId": "domain:entrepreneurship",
    "aliases": [
      "Développement d'un partenariat commercial"
    ]
  },
  {
    "id": "process-pro:consulting-engagement-cycle",
    "type": "process",
    "fr": "Cycle d'une mission de conseil",
    "en": "Consulting engagement lifecycle",
    "parentId": "domain:consulting",
    "aliases": [
      "Cycle d'une mission de conseil"
    ]
  },
  {
    "id": "process-pro:recruitment-cycle",
    "type": "process",
    "fr": "Cycle de recrutement et intégration",
    "en": "Recruitment and onboarding cycle",
    "parentId": "domain:human-resources",
    "aliases": [
      "Cycle de recrutement et intégration"
    ]
  },
  {
    "id": "process-pro:employee-lifecycle",
    "type": "process",
    "fr": "Cycle de vie administratif d'un salarié",
    "en": "Employee administrative lifecycle",
    "parentId": "domain:human-resources",
    "aliases": [
      "Cycle de vie administratif d'un salarié"
    ]
  },
  {
    "id": "process-pro:service-contract-cycle",
    "type": "process",
    "fr": "Cycle de vie d'un contrat de prestation",
    "en": "Professional service contract lifecycle",
    "parentId": "domain:business-administration",
    "aliases": [
      "Cycle de vie d'un contrat de prestation"
    ]
  },
  {
    "id": "process-pro:quality-improvement-cycle",
    "type": "process",
    "fr": "Cycle d'amélioration continue de la qualité",
    "en": "Continuous quality improvement cycle",
    "parentId": "domain:quality-risk-compliance",
    "aliases": [
      "Cycle d'amélioration continue de la qualité"
    ]
  },
  {
    "id": "process-pro:risk-management-cycle",
    "type": "process",
    "fr": "Cycle de gestion des risques",
    "en": "Risk management cycle",
    "parentId": "domain:quality-risk-compliance",
    "aliases": [
      "Cycle de gestion des risques"
    ]
  },
  {
    "id": "process-pro:business-creation-cycle",
    "type": "process",
    "fr": "Parcours de création et lancement d'entreprise",
    "en": "Business creation and launch pathway",
    "parentId": "domain:entrepreneurship",
    "aliases": [
      "Parcours de création et lancement d'entreprise"
    ]
  },
  {
    "id": "process-pro:business-performance-cycle",
    "type": "process",
    "fr": "Cycle de pilotage et d'amélioration de la performance",
    "en": "Business performance management cycle",
    "parentId": "domain:business-administration",
    "aliases": [
      "Cycle de pilotage et d'amélioration de la performance"
    ]
  },
  {
    "id": "problem-pro:unclear-responsibilities",
    "type": "problem",
    "fr": "Responsabilités et processus internes mal définis",
    "en": "Unclear responsibilities and internal processes",
    "parentId": "domain:business-administration",
    "aliases": [
      "Responsabilités et processus internes mal définis"
    ]
  },
  {
    "id": "problem-pro:recruitment-delays",
    "type": "problem",
    "fr": "Retards et erreurs de recrutement",
    "en": "Recruitment delays and errors",
    "parentId": "domain:human-resources",
    "aliases": [
      "Retards et erreurs de recrutement"
    ]
  },
  {
    "id": "problem-pro:skills-gaps",
    "type": "problem",
    "fr": "Écarts de compétences et besoins de formation",
    "en": "Skills gaps and training needs",
    "parentId": "domain:human-resources",
    "aliases": [
      "Écarts de compétences et besoins de formation"
    ]
  },
  {
    "id": "problem-pro:service-quality-issues",
    "type": "problem",
    "fr": "Qualité de prestation irrégulière",
    "en": "Inconsistent professional service quality",
    "parentId": "domain:quality-risk-compliance",
    "aliases": [
      "Qualité de prestation irrégulière"
    ]
  },
  {
    "id": "problem-pro:contract-overruns",
    "type": "problem",
    "fr": "Dépassements de coûts ou délais contractuels",
    "en": "Contract cost or schedule overruns",
    "parentId": "domain:business-administration",
    "aliases": [
      "Dépassements de coûts ou délais contractuels"
    ]
  },
  {
    "id": "problem-pro:operational-risks",
    "type": "problem",
    "fr": "Risques opérationnels insuffisamment maîtrisés",
    "en": "Insufficiently managed operational risks",
    "parentId": "domain:quality-risk-compliance",
    "aliases": [
      "Risques opérationnels insuffisamment maîtrisés"
    ]
  },
  {
    "id": "problem-pro:security-incidents",
    "type": "problem",
    "fr": "Incidents de sécurité et protection des personnes ou biens",
    "en": "Security incidents affecting people or assets",
    "parentId": "domain:quality-risk-compliance",
    "aliases": [
      "Incidents de sécurité et protection des personnes ou biens"
    ]
  },
  {
    "id": "problem-pro:business-fragility",
    "type": "problem",
    "fr": "Fragilité économique et manque de continuité d'activité",
    "en": "Business fragility and weak continuity",
    "parentId": "domain:entrepreneurship",
    "aliases": [
      "Fragilité économique et manque de continuité d'activité"
    ]
  },
  {
    "id": "problem-pro:poor-business-visibility",
    "type": "problem",
    "fr": "Manque de visibilité sur les performances et coûts",
    "en": "Poor visibility into performance and costs",
    "parentId": "domain:business-administration",
    "aliases": [
      "Manque de visibilité sur les performances et coûts"
    ]
  },
  {
    "id": "problem-pro:compliance-gaps",
    "type": "problem",
    "fr": "Obligations de conformité non suivies",
    "en": "Untracked compliance obligations",
    "parentId": "domain:quality-risk-compliance",
    "aliases": [
      "Obligations de conformité non suivies"
    ]
  },
  {
    "id": "resource-pro:organization-chart",
    "type": "resource",
    "fr": "Organigrammes, rôles et délégations",
    "en": "Organization charts, roles and delegations",
    "parentId": "domain:business-administration",
    "aliases": [
      "Organigrammes, rôles et délégations"
    ]
  },
  {
    "id": "resource-pro:employee-records",
    "type": "resource",
    "fr": "Dossiers du personnel et compétences",
    "en": "Employee records and skills",
    "parentId": "domain:human-resources",
    "aliases": [
      "Dossiers du personnel et compétences"
    ]
  },
  {
    "id": "resource-pro:service-contracts",
    "type": "resource",
    "fr": "Contrats, cahiers des charges et engagements de service",
    "en": "Contracts, statements of work and service commitments",
    "parentId": "domain:consulting",
    "aliases": [
      "Contrats, cahiers des charges et engagements de service"
    ]
  },
  {
    "id": "resource-pro:quality-standards",
    "type": "resource",
    "fr": "Normes, référentiels et procédures qualité",
    "en": "Quality standards and procedures",
    "parentId": "domain:quality-risk-compliance",
    "aliases": [
      "Normes, référentiels et procédures qualité"
    ]
  },
  {
    "id": "resource-pro:risk-register",
    "type": "resource",
    "fr": "Registre des risques et plans de contrôle",
    "en": "Risk register and control plans",
    "parentId": "domain:quality-risk-compliance",
    "aliases": [
      "Registre des risques et plans de contrôle"
    ]
  },
  {
    "id": "resource-pro:business-plan",
    "type": "resource",
    "fr": "Plan d'affaires et prévisions d'activité",
    "en": "Business plan and forecasts",
    "parentId": "domain:entrepreneurship",
    "aliases": [
      "Plan d'affaires et prévisions d'activité"
    ]
  },
  {
    "id": "resource-pro:performance-data",
    "type": "resource",
    "fr": "Données de gestion et indicateurs d'entreprise",
    "en": "Business management data and indicators",
    "parentId": "domain:business-administration",
    "aliases": [
      "Données de gestion et indicateurs d'entreprise"
    ]
  },
  {
    "id": "function-pro:business-management",
    "type": "function",
    "fr": "Gestion intégrée des opérations et objectifs d'entreprise",
    "en": "Integrated business operations and objectives management",
    "parentId": "domain:business-administration",
    "aliases": [
      "Gestion intégrée des opérations et objectifs d'entreprise"
    ]
  },
  {
    "id": "function-pro:hr-management",
    "type": "function",
    "fr": "Gestion du personnel, recrutement et compétences",
    "en": "HR, recruitment and skills management",
    "parentId": "domain:human-resources",
    "aliases": [
      "Gestion du personnel, recrutement et compétences"
    ]
  },
  {
    "id": "function-pro:service-delivery-management",
    "type": "function",
    "fr": "Gestion des missions et prestations professionnelles",
    "en": "Professional engagement and service delivery management",
    "parentId": "domain:consulting",
    "aliases": [
      "Gestion des missions et prestations professionnelles"
    ]
  },
  {
    "id": "function-pro:quality-management",
    "type": "function",
    "fr": "Gestion qualité, audits et actions correctives",
    "en": "Quality, audit and corrective action management",
    "parentId": "domain:quality-risk-compliance",
    "aliases": [
      "Gestion qualité, audits et actions correctives"
    ]
  },
  {
    "id": "function-pro:risk-compliance-management",
    "type": "function",
    "fr": "Gestion des risques et obligations de conformité",
    "en": "Risk and compliance management",
    "parentId": "domain:quality-risk-compliance",
    "aliases": [
      "Gestion des risques et obligations de conformité"
    ]
  },
  {
    "id": "function-pro:business-development-crm",
    "type": "function",
    "fr": "Gestion des prospects, partenariats et développement",
    "en": "Prospect, partnership and business development management",
    "parentId": "domain:entrepreneurship",
    "aliases": [
      "Gestion des prospects, partenariats et développement"
    ]
  },
  {
    "id": "function-pro:contract-management",
    "type": "function",
    "fr": "Suivi des contrats, échéances et niveaux de service",
    "en": "Contract, deadline and service-level management",
    "parentId": "domain:business-administration",
    "aliases": [
      "Suivi des contrats, échéances et niveaux de service"
    ]
  },
  {
    "id": "indicator-pro:service-delivery-on-time",
    "type": "indicator",
    "fr": "Taux de prestations réalisées dans les délais",
    "en": "On-time service delivery rate",
    "parentId": "domain:consulting",
    "aliases": [
      "Taux de prestations réalisées dans les délais"
    ]
  },
  {
    "id": "indicator-pro:employee-retention",
    "type": "indicator",
    "fr": "Taux de fidélisation du personnel",
    "en": "Employee retention rate",
    "parentId": "domain:human-resources",
    "aliases": [
      "Taux de fidélisation du personnel"
    ]
  },
  {
    "id": "indicator-pro:recruitment-time",
    "type": "indicator",
    "fr": "Délai moyen de recrutement",
    "en": "Average recruitment time",
    "parentId": "domain:human-resources",
    "aliases": [
      "Délai moyen de recrutement"
    ]
  },
  {
    "id": "indicator-pro:quality-nonconformity",
    "type": "indicator",
    "fr": "Taux de non-conformité des prestations",
    "en": "Service nonconformity rate",
    "parentId": "domain:quality-risk-compliance",
    "aliases": [
      "Taux de non-conformité des prestations"
    ]
  },
  {
    "id": "indicator-pro:risk-action-closure",
    "type": "indicator",
    "fr": "Taux de clôture des actions de maîtrise des risques",
    "en": "Risk mitigation action closure rate",
    "parentId": "domain:quality-risk-compliance",
    "aliases": [
      "Taux de clôture des actions de maîtrise des risques"
    ]
  },
  {
    "id": "indicator-pro:business-margin",
    "type": "indicator",
    "fr": "Marge opérationnelle par activité ou mission",
    "en": "Operating margin by activity or engagement",
    "parentId": "domain:business-administration",
    "aliases": [
      "Marge opérationnelle par activité ou mission"
    ]
  },
  {
    "id": "indicator-pro:client-satisfaction",
    "type": "indicator",
    "fr": "Satisfaction des clients professionnels",
    "en": "Business client satisfaction",
    "parentId": "domain:consulting",
    "aliases": [
      "Satisfaction des clients professionnels"
    ]
  }
],
  "safetyNotes": [
    "Les services professionnels peuvent être soumis à des qualifications, assurances, autorisations, règles déontologiques et responsabilités contractuelles propres au pays et au métier.",
    "Les données de personnel, rémunération, recrutement et évaluation sont personnelles et doivent être minimisées, cloisonnées et accessibles selon le rôle.",
    "Les services de sécurité et de protection des personnes doivent respecter les licences, pouvoirs, limites d'intervention et règles locales ; aucune surveillance illégale n'est permise.",
    "Les prestations et contrats conservent périmètre, livrables, responsabilités, délais, niveaux de service, acceptation et voies de réclamation.",
    "Les audits et évaluations doivent être indépendants, traçables et distinguer constat, risque, non-conformité et faute."
  ]
},[
  [
    "activity-pro:consulting-engagement",
    "process-pro:consulting-engagement-cycle",
    "part_of"
  ],
  [
    "activity-pro:employee-recruitment",
    "process-pro:recruitment-cycle",
    "part_of"
  ],
  [
    "function-pro:hr-management",
    "resource-pro:employee-records",
    "manages"
  ],
  [
    "function-pro:service-delivery-management",
    "activity-pro:service-delivery",
    "supports"
  ],
  [
    "problem-pro:poor-business-visibility",
    "function-pro:business-management",
    "may_be_mitigated_by"
  ],
  [
    "problem-pro:compliance-gaps",
    "function-pro:risk-compliance-management",
    "may_be_mitigated_by"
  ],
  [
    "function-pro:contract-management",
    "resource-pro:service-contracts",
    "manages"
  ],
  [
    "activity-pro:quality-inspection",
    "process-pro:quality-improvement-cycle",
    "part_of"
  ]
]);
export const PROFESSIONAL_SERVICES_FAMILY_CONCEPTS=result.familyConcepts.filter(concept=>concept.id!=="family:business-management");
export const PROFESSIONAL_SERVICES_CATALOG=result.catalog;
export const PROFESSIONAL_SERVICES_RELATIONSHIPS=result.relationships;
