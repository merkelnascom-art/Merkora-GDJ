import {createFamilyCatalog} from "./family-catalog-builder";
const result=createFamilyCatalog({
  "familyId": "family:digital-technology",
  "familyFr": "Numérique et technologies",
  "familyEn": "Digital and technology",
  "sourceId": "source:merkora-family-18-digital-technology-v1",
  "familyNumber": 18,
  "domains": [
    {
      "id": "domain:software-development",
      "fr": "Développement logiciel",
      "en": "Software development",
      "create": false
    },
    {
      "id": "domain:it-infrastructure",
      "fr": "Infrastructure informatique",
      "en": "IT infrastructure",
      "create": false
    },
    {
      "id": "domain:cybersecurity",
      "fr": "Cybersécurité",
      "en": "Cybersecurity",
      "create": false
    },
    {
      "id": "domain:data-ai",
      "fr": "Données et intelligence artificielle",
      "en": "Data and artificial intelligence",
      "create": false
    },
    {
      "id": "domain:digital-services",
      "fr": "Services numériques et plateformes",
      "en": "Digital services and platforms",
      "create": false
    }
  ],
  "seeds": [
    {
      "id": "subdomain-digital:software-engineering",
      "type": "subdomain",
      "fr": "Ingénierie et architecture logicielle",
      "en": "Software engineering and architecture",
      "parentId": "domain:software-development",
      "aliases": [
        "développement d'applications logicielles"
      ]
    },
    {
      "id": "subdomain-digital:web-mobile",
      "type": "subdomain",
      "fr": "Développement web et mobile",
      "en": "Web and mobile development",
      "parentId": "domain:software-development",
      "aliases": [
        "application web mobile"
      ]
    },
    {
      "id": "subdomain-digital:quality-testing",
      "type": "subdomain",
      "fr": "Qualité, tests et assurance logicielle",
      "en": "Software quality and testing",
      "parentId": "domain:software-development",
      "aliases": [
        "tests logiciels"
      ]
    },
    {
      "id": "subdomain-digital:devops-delivery",
      "type": "subdomain",
      "fr": "Intégration, livraison et exploitation DevOps",
      "en": "DevOps integration, delivery and operations",
      "parentId": "domain:software-development",
      "aliases": [
        "devops"
      ]
    },
    {
      "id": "subdomain-digital:cloud-infrastructure",
      "type": "subdomain",
      "fr": "Infrastructures cloud et hébergement",
      "en": "Cloud infrastructure and hosting",
      "parentId": "domain:it-infrastructure",
      "aliases": [
        "administration des infrastructures cloud"
      ]
    },
    {
      "id": "subdomain-digital:networks",
      "type": "subdomain",
      "fr": "Réseaux et connectivité",
      "en": "Networks and connectivity",
      "parentId": "domain:it-infrastructure",
      "aliases": [
        "réseaux informatiques"
      ]
    },
    {
      "id": "subdomain-digital:systems-administration",
      "type": "subdomain",
      "fr": "Administration des systèmes et postes",
      "en": "Systems and endpoint administration",
      "parentId": "domain:it-infrastructure",
      "aliases": [
        "administration système"
      ]
    },
    {
      "id": "subdomain-digital:telecom-operations",
      "type": "subdomain",
      "fr": "Opérations télécoms et services opérateurs",
      "en": "Telecom operations and carrier services",
      "parentId": "domain:it-infrastructure",
      "aliases": [
        "opérations télécommunications"
      ]
    },
    {
      "id": "subdomain-digital:cybersecurity-operations",
      "type": "subdomain",
      "fr": "Opérations de cybersécurité et réponse aux incidents",
      "en": "Cybersecurity operations and incident response",
      "parentId": "domain:cybersecurity",
      "aliases": [
        "sécurité informatique et réponse aux incidents"
      ]
    },
    {
      "id": "subdomain-digital:identity-access",
      "type": "subdomain",
      "fr": "Identité numérique et gestion des accès",
      "en": "Digital identity and access management",
      "parentId": "domain:cybersecurity",
      "aliases": [
        "gestion identités accès"
      ]
    },
    {
      "id": "subdomain-digital:application-security",
      "type": "subdomain",
      "fr": "Sécurité applicative et tests d'intrusion autorisés",
      "en": "Application security and authorized penetration testing",
      "parentId": "domain:cybersecurity",
      "aliases": [
        "sécurité application"
      ]
    },
    {
      "id": "subdomain-digital:privacy-data-protection",
      "type": "subdomain",
      "fr": "Protection des données et confidentialité",
      "en": "Data protection and privacy",
      "parentId": "domain:cybersecurity",
      "aliases": [
        "protection données personnelles"
      ]
    },
    {
      "id": "subdomain-digital:ai-data-engineering",
      "type": "subdomain",
      "fr": "Ingénierie IA et données",
      "en": "AI and data engineering",
      "parentId": "domain:data-ai",
      "aliases": [
        "intelligence artificielle et analyse de données"
      ]
    },
    {
      "id": "subdomain-digital:machine-learning",
      "type": "subdomain",
      "fr": "Apprentissage automatique et modèles prédictifs",
      "en": "Machine learning and predictive models",
      "parentId": "domain:data-ai",
      "aliases": [
        "machine learning"
      ]
    },
    {
      "id": "subdomain-digital:data-governance",
      "type": "subdomain",
      "fr": "Gouvernance, qualité et cycle de vie des données",
      "en": "Data governance, quality and lifecycle",
      "parentId": "domain:data-ai",
      "aliases": [
        "gouvernance et qualité des données"
      ]
    },
    {
      "id": "subdomain-digital:analytics-bi",
      "type": "subdomain",
      "fr": "Analytique, reporting et intelligence décisionnelle",
      "en": "Analytics, reporting and business intelligence",
      "parentId": "domain:data-ai",
      "aliases": [
        "business intelligence"
      ]
    },
    {
      "id": "subdomain-digital:digital-platforms",
      "type": "subdomain",
      "fr": "Services numériques et plateformes en ligne",
      "en": "Digital services and online platforms",
      "parentId": "domain:digital-services",
      "aliases": [
        "services numériques et plateformes en ligne"
      ]
    },
    {
      "id": "subdomain-digital:ecommerce-platforms",
      "type": "subdomain",
      "fr": "Plateformes transactionnelles et commerce numérique",
      "en": "Transactional and digital commerce platforms",
      "parentId": "domain:digital-services",
      "aliases": [
        "plateforme e-commerce"
      ]
    },
    {
      "id": "subdomain-digital:workflow-automation",
      "type": "subdomain",
      "fr": "Automatisation des processus et intégration",
      "en": "Process automation and integration",
      "parentId": "domain:digital-services",
      "aliases": [
        "automatisation processus"
      ]
    },
    {
      "id": "subdomain-digital:user-experience",
      "type": "subdomain",
      "fr": "Expérience utilisateur et accessibilité numérique",
      "en": "User experience and digital accessibility",
      "parentId": "domain:digital-services",
      "aliases": [
        "expérience utilisateur"
      ]
    },
    {
      "id": "specialization-digital:cloud-native",
      "type": "specialization",
      "fr": "Architecture cloud-native et microservices",
      "en": "Cloud-native and microservices architecture",
      "parentId": "domain:it-infrastructure",
      "aliases": [
        "cloud native"
      ]
    },
    {
      "id": "specialization-digital:open-source",
      "type": "specialization",
      "fr": "Solutions open source et souveraineté numérique",
      "en": "Open source and digital sovereignty",
      "parentId": "domain:software-development",
      "aliases": [
        "open source"
      ]
    },
    {
      "id": "specialization-digital:zero-trust",
      "type": "specialization",
      "fr": "Sécurité Zero Trust et défense en profondeur",
      "en": "Zero Trust and defense in depth",
      "parentId": "domain:cybersecurity",
      "aliases": [
        "zero trust"
      ]
    },
    {
      "id": "specialization-digital:ai-governance",
      "type": "specialization",
      "fr": "Gouvernance et évaluation des systèmes IA",
      "en": "AI governance and evaluation",
      "parentId": "domain:data-ai",
      "aliases": [
        "gouvernance intelligence artificielle"
      ]
    },
    {
      "id": "specialization-digital:data-engineering",
      "type": "specialization",
      "fr": "Ingénierie des données et plateformes analytiques",
      "en": "Data engineering and analytics platforms",
      "parentId": "domain:data-ai",
      "aliases": [
        "data engineering"
      ]
    },
    {
      "id": "specialization-digital:telecom-networking",
      "type": "specialization",
      "fr": "Réseaux mobiles et télécommunications avancées",
      "en": "Mobile networks and advanced telecommunications",
      "parentId": "domain:it-infrastructure",
      "aliases": [
        "réseaux mobiles"
      ]
    },
    {
      "id": "specialization-digital:accessibility",
      "type": "specialization",
      "fr": "Accessibilité et inclusion numérique",
      "en": "Digital accessibility and inclusion",
      "parentId": "domain:digital-services",
      "aliases": [
        "accessibilité numérique"
      ]
    },
    {
      "id": "occupation-digital:software-engineer",
      "type": "occupation",
      "fr": "Ingénieur logiciel",
      "en": "Software engineer",
      "parentId": "domain:software-development",
      "aliases": [
        "développeur logiciel"
      ]
    },
    {
      "id": "occupation-digital:frontend-developer",
      "type": "occupation",
      "fr": "Développeur front-end",
      "en": "Frontend developer",
      "parentId": "domain:software-development",
      "aliases": [
        "développeur frontend"
      ]
    },
    {
      "id": "occupation-digital:backend-developer",
      "type": "occupation",
      "fr": "Développeur back-end",
      "en": "Backend developer",
      "parentId": "domain:software-development",
      "aliases": [
        "développeur backend"
      ]
    },
    {
      "id": "occupation-digital:devops-engineer",
      "type": "occupation",
      "fr": "Ingénieur DevOps",
      "en": "DevOps engineer",
      "parentId": "domain:it-infrastructure",
      "aliases": [
        "ingénieur devops"
      ]
    },
    {
      "id": "occupation-digital:system-admin",
      "type": "occupation",
      "fr": "Administrateur systèmes et réseaux",
      "en": "Systems and network administrator",
      "parentId": "domain:it-infrastructure",
      "aliases": [
        "administrateur réseau"
      ]
    },
    {
      "id": "occupation-digital:security-analyst",
      "type": "occupation",
      "fr": "Analyste cybersécurité",
      "en": "Cybersecurity analyst",
      "parentId": "domain:cybersecurity",
      "aliases": [
        "analyste sécurité"
      ]
    },
    {
      "id": "occupation-digital:security-engineer",
      "type": "occupation",
      "fr": "Ingénieur sécurité informatique",
      "en": "Security engineer",
      "parentId": "domain:cybersecurity",
      "aliases": [
        "ingénieur cybersécurité"
      ]
    },
    {
      "id": "occupation-digital:data-engineer",
      "type": "occupation",
      "fr": "Ingénieur données",
      "en": "Data engineer",
      "parentId": "domain:data-ai",
      "aliases": [
        "data engineer"
      ]
    },
    {
      "id": "occupation-digital:ai-engineer",
      "type": "occupation",
      "fr": "Ingénieur intelligence artificielle",
      "en": "AI engineer",
      "parentId": "domain:data-ai",
      "aliases": [
        "ingénieur IA"
      ]
    },
    {
      "id": "occupation-digital:product-manager",
      "type": "occupation",
      "fr": "Responsable produit numérique",
      "en": "Digital product manager",
      "parentId": "domain:digital-services",
      "aliases": [
        "product manager"
      ]
    },
    {
      "id": "occupation-digital:ux-designer",
      "type": "occupation",
      "fr": "Designer UX/UI",
      "en": "UX/UI designer",
      "parentId": "domain:digital-services",
      "aliases": [
        "designer ux ui"
      ]
    },
    {
      "id": "occupation-digital:telecom-engineer",
      "type": "occupation",
      "fr": "Ingénieur télécommunications",
      "en": "Telecommunications engineer",
      "parentId": "domain:it-infrastructure",
      "aliases": [
        "ingénieur télécom"
      ]
    },
    {
      "id": "activity-digital:application-development",
      "type": "activity",
      "fr": "Développement d'une application",
      "en": "Application development",
      "parentId": "domain:software-development",
      "aliases": [
        "développement d'une application"
      ]
    },
    {
      "id": "activity-digital:software-testing",
      "type": "activity",
      "fr": "Test et validation d'un logiciel",
      "en": "Software testing and validation",
      "parentId": "domain:software-development",
      "aliases": [
        "test logiciel"
      ]
    },
    {
      "id": "activity-digital:service-deployment",
      "type": "activity",
      "fr": "Déploiement d'un service numérique",
      "en": "Digital service deployment",
      "parentId": "domain:digital-services",
      "aliases": [
        "déploiement d'un service numérique"
      ]
    },
    {
      "id": "activity-digital:infrastructure-operations",
      "type": "activity",
      "fr": "Exploitation d'une infrastructure informatique",
      "en": "IT infrastructure operations",
      "parentId": "domain:it-infrastructure",
      "aliases": [
        "exploitation d'une infrastructure informatique"
      ]
    },
    {
      "id": "activity-digital:security-audit",
      "type": "activity",
      "fr": "Audit de cybersécurité",
      "en": "Cybersecurity audit",
      "parentId": "domain:cybersecurity",
      "aliases": [
        "audit de cybersécurité"
      ]
    },
    {
      "id": "activity-digital:incident-response",
      "type": "activity",
      "fr": "Réponse à un incident de sécurité",
      "en": "Security incident response",
      "parentId": "domain:cybersecurity",
      "aliases": [
        "réponse incident sécurité"
      ]
    },
    {
      "id": "activity-digital:data-governance",
      "type": "activity",
      "fr": "Gouvernance et qualité des données",
      "en": "Data governance and quality",
      "parentId": "domain:data-ai",
      "aliases": [
        "gouvernance et qualité des données"
      ]
    },
    {
      "id": "activity-digital:model-evaluation",
      "type": "activity",
      "fr": "Évaluation d'un modèle d'intelligence artificielle",
      "en": "AI model evaluation",
      "parentId": "domain:data-ai",
      "aliases": [
        "évaluation modèle IA"
      ]
    },
    {
      "id": "activity-digital:telecom-maintenance",
      "type": "activity",
      "fr": "Maintenance d'un réseau télécom",
      "en": "Telecommunications network maintenance",
      "parentId": "domain:it-infrastructure",
      "aliases": [
        "maintenance réseau télécom"
      ]
    },
    {
      "id": "activity-digital:workflow-automation",
      "type": "activity",
      "fr": "Automatisation d'un processus métier",
      "en": "Business process automation",
      "parentId": "domain:digital-services",
      "aliases": [
        "automatisation processus métier"
      ]
    },
    {
      "id": "activity-digital:user-research",
      "type": "activity",
      "fr": "Recherche utilisateur et tests d'expérience",
      "en": "User research and experience testing",
      "parentId": "domain:digital-services",
      "aliases": [
        "recherche utilisateur"
      ]
    },
    {
      "id": "activity-digital:data-analysis",
      "type": "activity",
      "fr": "Analyse et visualisation de données",
      "en": "Data analysis and visualization",
      "parentId": "domain:data-ai",
      "aliases": [
        "analyse données"
      ]
    },
    {
      "id": "process-digital:software-development-lifecycle",
      "type": "process",
      "fr": "Cycle de vie du développement logiciel",
      "en": "Software development lifecycle",
      "parentId": "domain:software-development",
      "aliases": [
        "cycle développement logiciel"
      ]
    },
    {
      "id": "process-digital:release-management",
      "type": "process",
      "fr": "Gestion des versions et mises en production",
      "en": "Release and production deployment management",
      "parentId": "domain:software-development",
      "aliases": [
        "gestion versions"
      ]
    },
    {
      "id": "process-digital:infrastructure-lifecycle",
      "type": "process",
      "fr": "Cycle de vie des infrastructures informatiques",
      "en": "IT infrastructure lifecycle",
      "parentId": "domain:it-infrastructure",
      "aliases": [
        "cycle infrastructure"
      ]
    },
    {
      "id": "process-digital:security-incident",
      "type": "process",
      "fr": "Gestion des incidents de cybersécurité",
      "en": "Cybersecurity incident management",
      "parentId": "domain:cybersecurity",
      "aliases": [
        "gestion incident cyber"
      ]
    },
    {
      "id": "process-digital:data-lifecycle",
      "type": "process",
      "fr": "Cycle de vie et gouvernance des données",
      "en": "Data lifecycle and governance",
      "parentId": "domain:data-ai",
      "aliases": [
        "cycle vie données"
      ]
    },
    {
      "id": "process-digital:ai-model-lifecycle",
      "type": "process",
      "fr": "Cycle de vie d'un modèle IA",
      "en": "AI model lifecycle",
      "parentId": "domain:data-ai",
      "aliases": [
        "cycle vie modèle IA"
      ]
    },
    {
      "id": "process-digital:digital-service-operation",
      "type": "process",
      "fr": "Exploitation et amélioration d'un service numérique",
      "en": "Digital service operation and improvement",
      "parentId": "domain:digital-services",
      "aliases": [
        "exploitation service numérique"
      ]
    },
    {
      "id": "process-digital:telecom-service",
      "type": "process",
      "fr": "Activation et maintenance d'un service télécom",
      "en": "Telecom service activation and maintenance",
      "parentId": "domain:it-infrastructure",
      "aliases": [
        "activation service télécom"
      ]
    },
    {
      "id": "problem-digital:technical-debt",
      "type": "problem",
      "fr": "Dette technique et complexité logicielle",
      "en": "Technical debt and software complexity",
      "parentId": "domain:software-development",
      "aliases": [
        "dette technique"
      ]
    },
    {
      "id": "problem-digital:service-outage",
      "type": "problem",
      "fr": "Indisponibilité et interruption de services",
      "en": "Service outage and downtime",
      "parentId": "domain:it-infrastructure",
      "aliases": [
        "panne service numérique"
      ]
    },
    {
      "id": "problem-digital:security-breach",
      "type": "problem",
      "fr": "Intrusion, compromission ou fuite de données",
      "en": "Intrusion, compromise or data breach",
      "parentId": "domain:cybersecurity",
      "aliases": [
        "cyberattaque"
      ]
    },
    {
      "id": "problem-digital:access-control-gaps",
      "type": "problem",
      "fr": "Habilitations excessives ou contrôles d'accès insuffisants",
      "en": "Excessive permissions or weak access controls",
      "parentId": "domain:cybersecurity",
      "aliases": [
        "mauvaise gestion accès"
      ]
    },
    {
      "id": "problem-digital:data-quality",
      "type": "problem",
      "fr": "Données incomplètes, incohérentes ou non fiables",
      "en": "Incomplete, inconsistent or unreliable data",
      "parentId": "domain:data-ai",
      "aliases": [
        "mauvaise qualité données"
      ]
    },
    {
      "id": "problem-digital:ai-bias",
      "type": "problem",
      "fr": "Biais, dérive ou manque d'explicabilité d'un système IA",
      "en": "AI bias, drift or lack of explainability",
      "parentId": "domain:data-ai",
      "aliases": [
        "biais intelligence artificielle"
      ]
    },
    {
      "id": "problem-digital:integration-failure",
      "type": "problem",
      "fr": "Défaillances d'intégration entre systèmes",
      "en": "System integration failures",
      "parentId": "domain:digital-services",
      "aliases": [
        "intégration systèmes impossible"
      ]
    },
    {
      "id": "problem-digital:scalability",
      "type": "problem",
      "fr": "Difficulté de montée en charge et de performance",
      "en": "Scalability and performance difficulties",
      "parentId": "domain:it-infrastructure",
      "aliases": [
        "problème montée en charge"
      ]
    },
    {
      "id": "problem-digital:vendor-lock-in",
      "type": "problem",
      "fr": "Dépendance excessive à un fournisseur numérique",
      "en": "Excessive digital vendor lock-in",
      "parentId": "domain:digital-services",
      "aliases": [
        "dépendance fournisseur"
      ]
    },
    {
      "id": "problem-digital:digital-exclusion",
      "type": "problem",
      "fr": "Exclusion numérique et obstacles d'accessibilité",
      "en": "Digital exclusion and accessibility barriers",
      "parentId": "domain:digital-services",
      "aliases": [
        "fracture numérique"
      ]
    },
    {
      "id": "resource-digital:source-code",
      "type": "resource",
      "fr": "Code source et dépôts de versions",
      "en": "Source code and version repositories",
      "parentId": "domain:software-development",
      "aliases": [
        "code source"
      ]
    },
    {
      "id": "resource-digital:cloud-resources",
      "type": "resource",
      "fr": "Ressources cloud, serveurs et réseaux",
      "en": "Cloud, server and network resources",
      "parentId": "domain:it-infrastructure",
      "aliases": [
        "ressources cloud"
      ]
    },
    {
      "id": "resource-digital:security-assets",
      "type": "resource",
      "fr": "Politiques, clés et référentiels de sécurité",
      "en": "Security policies, keys and standards",
      "parentId": "domain:cybersecurity",
      "aliases": [
        "référentiel sécurité"
      ]
    },
    {
      "id": "resource-digital:data-assets",
      "type": "resource",
      "fr": "Jeux de données, métadonnées et dictionnaires",
      "en": "Datasets, metadata and data dictionaries",
      "parentId": "domain:data-ai",
      "aliases": [
        "jeux de données"
      ]
    },
    {
      "id": "resource-digital:ai-model-assets",
      "type": "resource",
      "fr": "Modèles, prompts et jeux d'évaluation IA",
      "en": "AI models, prompts and evaluation datasets",
      "parentId": "domain:data-ai",
      "aliases": [
        "modèles IA"
      ]
    },
    {
      "id": "resource-digital:api-catalog",
      "type": "resource",
      "fr": "Catalogue d'API et contrats d'intégration",
      "en": "API catalog and integration contracts",
      "parentId": "domain:digital-services",
      "aliases": [
        "catalogue API"
      ]
    },
    {
      "id": "resource-digital:telecom-assets",
      "type": "resource",
      "fr": "Équipements, fréquences et ressources télécoms",
      "en": "Telecom equipment, spectrum and resources",
      "parentId": "domain:it-infrastructure",
      "aliases": [
        "équipements télécom"
      ]
    },
    {
      "id": "function-digital:software-delivery",
      "type": "function",
      "fr": "Gestion du code, versions, tests et livraisons",
      "en": "Code, version, test and delivery management",
      "parentId": "domain:software-development",
      "aliases": [
        "pipeline développement"
      ]
    },
    {
      "id": "function-digital:infrastructure-monitoring",
      "type": "function",
      "fr": "Supervision et observabilité des infrastructures",
      "en": "Infrastructure monitoring and observability",
      "parentId": "domain:it-infrastructure",
      "aliases": [
        "supervision infrastructure"
      ]
    },
    {
      "id": "function-digital:security-monitoring",
      "type": "function",
      "fr": "Surveillance et gestion des alertes de sécurité",
      "en": "Security monitoring and alert management",
      "parentId": "domain:cybersecurity",
      "aliases": [
        "surveillance cybersécurité"
      ]
    },
    {
      "id": "function-digital:data-platform",
      "type": "function",
      "fr": "Plateforme de données et gouvernance analytique",
      "en": "Data platform and analytics governance",
      "parentId": "domain:data-ai",
      "aliases": [
        "plateforme données"
      ]
    },
    {
      "id": "function-digital:ai-model-operations",
      "type": "function",
      "fr": "Gestion et surveillance des modèles IA",
      "en": "AI model management and monitoring",
      "parentId": "domain:data-ai",
      "aliases": [
        "gestion modèles IA"
      ]
    },
    {
      "id": "function-digital:api-integration",
      "type": "function",
      "fr": "Gestion des API et intégrations",
      "en": "API and integration management",
      "parentId": "domain:digital-services",
      "aliases": [
        "gestion intégration API"
      ]
    },
    {
      "id": "function-digital:telecom-management",
      "type": "function",
      "fr": "Gestion des services et incidents télécoms",
      "en": "Telecom service and incident management",
      "parentId": "domain:it-infrastructure",
      "aliases": [
        "gestion réseau télécom"
      ]
    },
    {
      "id": "indicator-digital:service-availability",
      "type": "indicator",
      "fr": "Disponibilité des services numériques",
      "en": "Digital service availability",
      "parentId": "domain:it-infrastructure",
      "aliases": [
        "disponibilité service"
      ]
    },
    {
      "id": "indicator-digital:incident-resolution-time",
      "type": "indicator",
      "fr": "Délai moyen de résolution des incidents",
      "en": "Mean incident resolution time",
      "parentId": "domain:cybersecurity",
      "aliases": [
        "délai résolution incident"
      ]
    },
    {
      "id": "indicator-digital:software-defect-rate",
      "type": "indicator",
      "fr": "Taux de défauts logiciels détectés en production",
      "en": "Production software defect rate",
      "parentId": "domain:software-development",
      "aliases": [
        "taux bugs production"
      ]
    },
    {
      "id": "indicator-digital:deployment-frequency",
      "type": "indicator",
      "fr": "Fréquence des déploiements réussis",
      "en": "Successful deployment frequency",
      "parentId": "domain:software-development",
      "aliases": [
        "fréquence déploiement"
      ]
    },
    {
      "id": "indicator-digital:data-quality-score",
      "type": "indicator",
      "fr": "Score de qualité et complétude des données",
      "en": "Data quality and completeness score",
      "parentId": "domain:data-ai",
      "aliases": [
        "score qualité données"
      ]
    },
    {
      "id": "indicator-digital:security-incident-rate",
      "type": "indicator",
      "fr": "Taux d'incidents de sécurité confirmés",
      "en": "Confirmed security incident rate",
      "parentId": "domain:cybersecurity",
      "aliases": [
        "taux incident sécurité"
      ]
    },
    {
      "id": "indicator-digital:user-adoption",
      "type": "indicator",
      "fr": "Taux d'adoption des services numériques",
      "en": "Digital service adoption rate",
      "parentId": "domain:digital-services",
      "aliases": [
        "adoption service numérique"
      ]
    }
  ],
  "safetyNotes": [
    "Les accès, systèmes, réseaux, données et secrets exigent le moindre privilège, authentification forte, chiffrement, journalisation, sauvegardes et gestion des vulnérabilités.",
    "Les tests offensifs, scans, pentests et opérations de sécurité doivent être explicitement autorisés et limités au périmètre contractuel ; aucun contournement ou accès non autorisé.",
    "Les systèmes IA nécessitent gouvernance des données, évaluation, explicabilité proportionnée, suivi de dérive, supervision humaine et mécanismes de recours.",
    "Les données personnelles et secrets d'affaires sont soumis à finalité, base légale, minimisation, rétention et contrôle des transferts.",
    "Les architectures, API, licences open source, dépendances, contrats cloud, coûts, localisation et réversibilité doivent être documentés."
  ]
},[
  [
    "activity-digital:application-development",
    "process-digital:software-development-lifecycle",
    "part_of"
  ],
  [
    "activity-digital:security-audit",
    "process-digital:security-incident",
    "supports"
  ],
  [
    "function-digital:infrastructure-monitoring",
    "activity-digital:infrastructure-operations",
    "supports"
  ],
  [
    "function-digital:data-platform",
    "resource-digital:data-assets",
    "manages"
  ],
  [
    "problem-digital:security-breach",
    "function-digital:security-monitoring",
    "may_be_mitigated_by"
  ],
  [
    "function-digital:api-integration",
    "resource-digital:api-catalog",
    "manages"
  ],
  [
    "activity-digital:model-evaluation",
    "process-digital:ai-model-lifecycle",
    "part_of"
  ],
  [
    "problem-digital:data-quality",
    "function-digital:data-platform",
    "may_be_mitigated_by"
  ]
]);
export const DIGITAL_TELECOM_FAMILY_CONCEPTS=result.familyConcepts.filter(concept=>concept.id!=="family:digital-technology");
export const DIGITAL_TELECOM_CATALOG=result.catalog;
export const DIGITAL_TELECOM_RELATIONSHIPS=result.relationships;
