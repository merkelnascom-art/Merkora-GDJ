import {createFamilyCatalog} from "./family-catalog-builder";
const result=createFamilyCatalog({
  "familyId": "family:media-communication",
  "familyFr": "Médias et communication",
  "familyEn": "Media and communication",
  "sourceId": "source:merkora-family-17-media-communication-v1",
  "familyNumber": 17,
  "domains": [
    {
      "id": "domain:journalism",
      "fr": "Presse et journalisme",
      "en": "Press and journalism",
      "create": false
    },
    {
      "id": "domain:audiovisual-production",
      "fr": "Production audiovisuelle",
      "en": "Audiovisual production",
      "create": false
    },
    {
      "id": "domain:marketing-advertising",
      "fr": "Marketing et publicité",
      "en": "Marketing and advertising",
      "create": false
    },
    {
      "id": "domain:public-relations",
      "fr": "Communication institutionnelle et relations publiques",
      "en": "Institutional communication and public relations",
      "create": false
    },
    {
      "id": "domain:content-management",
      "fr": "Création et gestion de contenus",
      "en": "Content creation and management",
      "create": true
    }
  ],
  "seeds": [
    {
      "id": "subdomain-media:press-reporting",
      "type": "subdomain",
      "fr": "Reportage et couverture de l'actualité",
      "en": "News reporting and coverage",
      "parentId": "domain:journalism",
      "aliases": [
        "reportage de presse"
      ]
    },
    {
      "id": "subdomain-media:investigative-journalism",
      "type": "subdomain",
      "fr": "Journalisme d'enquête",
      "en": "Investigative journalism",
      "parentId": "domain:journalism",
      "aliases": [
        "enquête journalistique"
      ]
    },
    {
      "id": "subdomain-media:fact-checking",
      "type": "subdomain",
      "fr": "Vérification des faits et des sources",
      "en": "Fact-checking and source verification",
      "parentId": "domain:journalism",
      "aliases": [
        "vérification des faits et des sources"
      ]
    },
    {
      "id": "subdomain-media:editing-publishing",
      "type": "subdomain",
      "fr": "Édition et publication de presse",
      "en": "Press editing and publishing",
      "parentId": "domain:journalism",
      "aliases": [
        "édition presse"
      ]
    },
    {
      "id": "subdomain-media:video-production",
      "type": "subdomain",
      "fr": "Production vidéo et reportage audiovisuel",
      "en": "Video and audiovisual report production",
      "parentId": "domain:audiovisual-production",
      "aliases": [
        "production audiovisuelle"
      ]
    },
    {
      "id": "subdomain-media:film-documentary",
      "type": "subdomain",
      "fr": "Cinéma et documentaire",
      "en": "Film and documentary production",
      "parentId": "domain:audiovisual-production",
      "aliases": [
        "documentaire"
      ]
    },
    {
      "id": "subdomain-media:radio-podcast",
      "type": "subdomain",
      "fr": "Radio et podcast",
      "en": "Radio and podcast production",
      "parentId": "domain:audiovisual-production",
      "aliases": [
        "production podcast"
      ]
    },
    {
      "id": "subdomain-media:live-broadcast",
      "type": "subdomain",
      "fr": "Diffusion en direct et retransmission",
      "en": "Live broadcasting and streaming",
      "parentId": "domain:audiovisual-production",
      "aliases": [
        "retransmission en direct"
      ]
    },
    {
      "id": "subdomain-media:advertising-campaigns",
      "type": "subdomain",
      "fr": "Campagnes publicitaires et média planning",
      "en": "Advertising campaigns and media planning",
      "parentId": "domain:marketing-advertising",
      "aliases": [
        "campagne publicitaire"
      ]
    },
    {
      "id": "subdomain-media:brand-content",
      "type": "subdomain",
      "fr": "Contenu de marque et marketing éditorial",
      "en": "Brand content and content marketing",
      "parentId": "domain:marketing-advertising",
      "aliases": [
        "contenu de marque"
      ]
    },
    {
      "id": "subdomain-media:digital-marketing",
      "type": "subdomain",
      "fr": "Marketing numérique et acquisition",
      "en": "Digital marketing and acquisition",
      "parentId": "domain:marketing-advertising",
      "aliases": [
        "marketing numérique"
      ]
    },
    {
      "id": "subdomain-media:media-buying",
      "type": "subdomain",
      "fr": "Achat d'espace et planification média",
      "en": "Media buying and planning",
      "parentId": "domain:marketing-advertising",
      "aliases": [
        "achat espace publicitaire"
      ]
    },
    {
      "id": "subdomain-media:institutional-communication",
      "type": "subdomain",
      "fr": "Communication institutionnelle",
      "en": "Institutional communication",
      "parentId": "domain:public-relations",
      "aliases": [
        "communication institutionnelle"
      ]
    },
    {
      "id": "subdomain-media:public-relations",
      "type": "subdomain",
      "fr": "Relations publiques et presse",
      "en": "Public relations and press relations",
      "parentId": "domain:public-relations",
      "aliases": [
        "relations publiques"
      ]
    },
    {
      "id": "subdomain-media:crisis-communication",
      "type": "subdomain",
      "fr": "Communication de crise",
      "en": "Crisis communication",
      "parentId": "domain:public-relations",
      "aliases": [
        "communication crise"
      ]
    },
    {
      "id": "subdomain-media:internal-communication",
      "type": "subdomain",
      "fr": "Communication interne et conduite du changement",
      "en": "Internal communication and change communication",
      "parentId": "domain:public-relations",
      "aliases": [
        "communication interne"
      ]
    },
    {
      "id": "subdomain-media:content-management",
      "type": "subdomain",
      "fr": "Gestion éditoriale de contenus",
      "en": "Editorial content management",
      "parentId": "domain:content-management",
      "aliases": [
        "gestion éditoriale de contenus"
      ]
    },
    {
      "id": "subdomain-media:copywriting",
      "type": "subdomain",
      "fr": "Rédaction et conception de contenus",
      "en": "Copywriting and content design",
      "parentId": "domain:content-management",
      "aliases": [
        "rédaction contenu"
      ]
    },
    {
      "id": "subdomain-media:social-media",
      "type": "subdomain",
      "fr": "Réseaux sociaux et communautés numériques",
      "en": "Social media and digital communities",
      "parentId": "domain:content-management",
      "aliases": [
        "gestion réseaux sociaux"
      ]
    },
    {
      "id": "subdomain-media:content-archives",
      "type": "subdomain",
      "fr": "Archivage et réutilisation des contenus",
      "en": "Content archiving and reuse",
      "parentId": "domain:content-management",
      "aliases": [
        "archives médias"
      ]
    },
    {
      "id": "specialization-media:solutions-journalism",
      "type": "specialization",
      "fr": "Journalisme de solutions et formats explicatifs",
      "en": "Solutions journalism and explanatory formats",
      "parentId": "domain:journalism",
      "aliases": [
        "journalisme solutions"
      ]
    },
    {
      "id": "specialization-media:data-journalism",
      "type": "specialization",
      "fr": "Journalisme de données",
      "en": "Data journalism",
      "parentId": "domain:journalism",
      "aliases": [
        "journalisme données"
      ]
    },
    {
      "id": "specialization-media:documentary-production",
      "type": "specialization",
      "fr": "Production documentaire et long format",
      "en": "Documentary and long-form production",
      "parentId": "domain:audiovisual-production",
      "aliases": [
        "production documentaire"
      ]
    },
    {
      "id": "specialization-media:performance-marketing",
      "type": "specialization",
      "fr": "Marketing de performance",
      "en": "Performance marketing",
      "parentId": "domain:marketing-advertising",
      "aliases": [
        "marketing performance"
      ]
    },
    {
      "id": "specialization-media:reputation-management",
      "type": "specialization",
      "fr": "Gestion de réputation et communication sensible",
      "en": "Reputation and sensitive communication management",
      "parentId": "domain:public-relations",
      "aliases": [
        "gestion réputation"
      ]
    },
    {
      "id": "specialization-media:multiplatform-publishing",
      "type": "specialization",
      "fr": "Publication multiplateforme et transmédia",
      "en": "Multiplatform and transmedia publishing",
      "parentId": "domain:content-management",
      "aliases": [
        "publication transmédia"
      ]
    },
    {
      "id": "specialization-media:accessibility-localization",
      "type": "specialization",
      "fr": "Accessibilité et adaptation linguistique des contenus",
      "en": "Content accessibility and localization",
      "parentId": "domain:content-management",
      "aliases": [
        "accessibilité contenu"
      ]
    },
    {
      "id": "occupation-media:journalist",
      "type": "occupation",
      "fr": "Journaliste",
      "en": "Journalist",
      "parentId": "domain:journalism",
      "aliases": [
        "journaliste"
      ]
    },
    {
      "id": "occupation-media:editor",
      "type": "occupation",
      "fr": "Rédacteur en chef ou éditeur",
      "en": "Editor or chief editor",
      "parentId": "domain:journalism",
      "aliases": [
        "rédacteur en chef"
      ]
    },
    {
      "id": "occupation-media:investigative-reporter",
      "type": "occupation",
      "fr": "Journaliste d'investigation",
      "en": "Investigative reporter",
      "parentId": "domain:journalism",
      "aliases": [
        "reporter enquête"
      ]
    },
    {
      "id": "occupation-media:camera-operator",
      "type": "occupation",
      "fr": "Cadreur ou opérateur caméra",
      "en": "Camera operator",
      "parentId": "domain:audiovisual-production",
      "aliases": [
        "cadreur"
      ]
    },
    {
      "id": "occupation-media:video-editor",
      "type": "occupation",
      "fr": "Monteur audiovisuel",
      "en": "Video editor",
      "parentId": "domain:audiovisual-production",
      "aliases": [
        "monteur vidéo"
      ]
    },
    {
      "id": "occupation-media:producer",
      "type": "occupation",
      "fr": "Producteur audiovisuel",
      "en": "Audiovisual producer",
      "parentId": "domain:audiovisual-production",
      "aliases": [
        "producteur audiovisuel"
      ]
    },
    {
      "id": "occupation-media:advertising-manager",
      "type": "occupation",
      "fr": "Responsable publicité et média",
      "en": "Advertising and media manager",
      "parentId": "domain:marketing-advertising",
      "aliases": [
        "responsable publicité"
      ]
    },
    {
      "id": "occupation-media:media-planner",
      "type": "occupation",
      "fr": "Planneur stratégique ou média",
      "en": "Strategic or media planner",
      "parentId": "domain:marketing-advertising",
      "aliases": [
        "planneur média"
      ]
    },
    {
      "id": "occupation-media:communications-officer",
      "type": "occupation",
      "fr": "Chargé de communication institutionnelle",
      "en": "Institutional communications officer",
      "parentId": "domain:public-relations",
      "aliases": [
        "chargé communication"
      ]
    },
    {
      "id": "occupation-media:press-officer",
      "type": "occupation",
      "fr": "Attaché de presse",
      "en": "Press officer",
      "parentId": "domain:public-relations",
      "aliases": [
        "attaché presse"
      ]
    },
    {
      "id": "occupation-media:content-strategist",
      "type": "occupation",
      "fr": "Responsable éditorial et stratégie de contenu",
      "en": "Content strategist and editor",
      "parentId": "domain:content-management",
      "aliases": [
        "responsable éditorial"
      ]
    },
    {
      "id": "occupation-media:community-manager",
      "type": "occupation",
      "fr": "Gestionnaire de communauté numérique",
      "en": "Community manager",
      "parentId": "domain:content-management",
      "aliases": [
        "community manager"
      ]
    },
    {
      "id": "activity-media:journalistic-investigation",
      "type": "activity",
      "fr": "Conduite d'une enquête journalistique",
      "en": "Conducting a journalistic investigation",
      "parentId": "domain:journalism",
      "aliases": [
        "conduite d'une enquête journalistique"
      ]
    },
    {
      "id": "activity-media:source-verification",
      "type": "activity",
      "fr": "Vérification des faits et des sources",
      "en": "Fact and source verification",
      "parentId": "domain:journalism",
      "aliases": [
        "vérification des sources"
      ]
    },
    {
      "id": "activity-media:news-editing",
      "type": "activity",
      "fr": "Édition et validation d'un contenu d'actualité",
      "en": "Editing and approving a news item",
      "parentId": "domain:journalism",
      "aliases": [
        "édition article"
      ]
    },
    {
      "id": "activity-media:audiovisual-report",
      "type": "activity",
      "fr": "Production d'un reportage audiovisuel",
      "en": "Producing an audiovisual report",
      "parentId": "domain:audiovisual-production",
      "aliases": [
        "production d'un reportage audiovisuel"
      ]
    },
    {
      "id": "activity-media:audio-recording",
      "type": "activity",
      "fr": "Enregistrement et montage audio",
      "en": "Audio recording and editing",
      "parentId": "domain:audiovisual-production",
      "aliases": [
        "enregistrement audio"
      ]
    },
    {
      "id": "activity-media:ad-campaign",
      "type": "activity",
      "fr": "Conception et lancement d'une campagne publicitaire",
      "en": "Designing and launching an advertising campaign",
      "parentId": "domain:marketing-advertising",
      "aliases": [
        "lancement campagne publicitaire"
      ]
    },
    {
      "id": "activity-media:media-analysis",
      "type": "activity",
      "fr": "Analyse de l'audience média",
      "en": "Media audience analysis",
      "parentId": "domain:marketing-advertising",
      "aliases": [
        "analyse de l'audience média"
      ]
    },
    {
      "id": "activity-media:institutional-release",
      "type": "activity",
      "fr": "Rédaction et diffusion d'un communiqué institutionnel",
      "en": "Writing and distributing an institutional release",
      "parentId": "domain:public-relations",
      "aliases": [
        "communiqué institutionnel"
      ]
    },
    {
      "id": "activity-media:crisis-response",
      "type": "activity",
      "fr": "Coordination d'une réponse de communication de crise",
      "en": "Coordinating a crisis communication response",
      "parentId": "domain:public-relations",
      "aliases": [
        "réponse communication crise"
      ]
    },
    {
      "id": "activity-media:content-publication",
      "type": "activity",
      "fr": "Publication d'un contenu éditorial",
      "en": "Publishing editorial content",
      "parentId": "domain:content-management",
      "aliases": [
        "publication d'un contenu éditorial"
      ]
    },
    {
      "id": "activity-media:community-moderation",
      "type": "activity",
      "fr": "Modération d'une communauté et de commentaires",
      "en": "Community and comment moderation",
      "parentId": "domain:content-management",
      "aliases": [
        "modération communauté"
      ]
    },
    {
      "id": "activity-media:content-analytics",
      "type": "activity",
      "fr": "Mesure et analyse de la performance des contenus",
      "en": "Measuring and analyzing content performance",
      "parentId": "domain:content-management",
      "aliases": [
        "analyse performance contenu"
      ]
    },
    {
      "id": "process-media:editorial-cycle",
      "type": "process",
      "fr": "Cycle éditorial de collecte, vérification et publication",
      "en": "Editorial collection, verification and publication cycle",
      "parentId": "domain:journalism",
      "aliases": [
        "cycle éditorial"
      ]
    },
    {
      "id": "process-media:newsroom-workflow",
      "type": "process",
      "fr": "Organisation du travail d'une rédaction",
      "en": "Newsroom workflow",
      "parentId": "domain:journalism",
      "aliases": [
        "workflow rédaction"
      ]
    },
    {
      "id": "process-media:audiovisual-production",
      "type": "process",
      "fr": "Cycle de production audiovisuelle",
      "en": "Audiovisual production cycle",
      "parentId": "domain:audiovisual-production",
      "aliases": [
        "cycle production audiovisuelle"
      ]
    },
    {
      "id": "process-media:advertising-campaign",
      "type": "process",
      "fr": "Cycle de conception, diffusion et mesure d'une campagne",
      "en": "Advertising campaign design, delivery and measurement cycle",
      "parentId": "domain:marketing-advertising",
      "aliases": [
        "cycle campagne publicitaire"
      ]
    },
    {
      "id": "process-media:institutional-communication",
      "type": "process",
      "fr": "Cycle de communication institutionnelle",
      "en": "Institutional communication cycle",
      "parentId": "domain:public-relations",
      "aliases": [
        "cycle communication institutionnelle"
      ]
    },
    {
      "id": "process-media:crisis-communication",
      "type": "process",
      "fr": "Processus de réponse et de suivi d'une crise médiatique",
      "en": "Media crisis response and monitoring process",
      "parentId": "domain:public-relations",
      "aliases": [
        "processus communication crise"
      ]
    },
    {
      "id": "process-media:content-lifecycle",
      "type": "process",
      "fr": "Cycle de vie éditorial d'un contenu",
      "en": "Editorial content lifecycle",
      "parentId": "domain:content-management",
      "aliases": [
        "cycle vie contenu"
      ]
    },
    {
      "id": "process-media:audience-measurement",
      "type": "process",
      "fr": "Collecte et analyse des audiences",
      "en": "Audience collection and analysis",
      "parentId": "domain:marketing-advertising",
      "aliases": [
        "mesure audience"
      ]
    },
    {
      "id": "problem-media:misinformation",
      "type": "problem",
      "fr": "Désinformation et diffusion de contenus trompeurs",
      "en": "Misinformation and misleading content",
      "parentId": "domain:journalism",
      "aliases": [
        "désinformation"
      ]
    },
    {
      "id": "problem-media:source-credibility",
      "type": "problem",
      "fr": "Sources insuffisamment vérifiées ou peu crédibles",
      "en": "Unverified or low-credibility sources",
      "parentId": "domain:journalism",
      "aliases": [
        "source non fiable"
      ]
    },
    {
      "id": "problem-media:production-delays",
      "type": "problem",
      "fr": "Retards et désorganisation de production",
      "en": "Production delays and disorganization",
      "parentId": "domain:audiovisual-production",
      "aliases": [
        "retard production audiovisuelle"
      ]
    },
    {
      "id": "problem-media:rights-clearance",
      "type": "problem",
      "fr": "Droits d'image, de musique ou d'archives non clarifiés",
      "en": "Unclear image, music or archive rights",
      "parentId": "domain:audiovisual-production",
      "aliases": [
        "droits image non clarifiés"
      ]
    },
    {
      "id": "problem-media:campaign-waste",
      "type": "problem",
      "fr": "Dépenses publicitaires sans mesure fiable des résultats",
      "en": "Advertising spend without reliable outcome measurement",
      "parentId": "domain:marketing-advertising",
      "aliases": [
        "publicité inefficace"
      ]
    },
    {
      "id": "problem-media:reputation-crisis",
      "type": "problem",
      "fr": "Crise de réputation et réponses incohérentes",
      "en": "Reputation crisis and inconsistent responses",
      "parentId": "domain:public-relations",
      "aliases": [
        "crise réputation"
      ]
    },
    {
      "id": "problem-media:content-fragmentation",
      "type": "problem",
      "fr": "Contenus dispersés, dupliqués ou difficiles à retrouver",
      "en": "Fragmented, duplicated or hard-to-find content",
      "parentId": "domain:content-management",
      "aliases": [
        "contenus dispersés"
      ]
    },
    {
      "id": "problem-media:audience-decline",
      "type": "problem",
      "fr": "Baisse d'audience et engagement insuffisant",
      "en": "Audience decline and low engagement",
      "parentId": "domain:marketing-advertising",
      "aliases": [
        "baisse audience"
      ]
    },
    {
      "id": "problem-media:editorial-errors",
      "type": "problem",
      "fr": "Erreurs éditoriales et corrections non tracées",
      "en": "Editorial errors and untracked corrections",
      "parentId": "domain:journalism",
      "aliases": [
        "erreur article"
      ]
    },
    {
      "id": "problem-media:privacy-violations",
      "type": "problem",
      "fr": "Atteinte à la vie privée ou publication non autorisée",
      "en": "Privacy violation or unauthorized publication",
      "parentId": "domain:public-relations",
      "aliases": [
        "publication non autorisée"
      ]
    },
    {
      "id": "resource-media:source-library",
      "type": "resource",
      "fr": "Bibliothèque de sources et dossiers documentaires",
      "en": "Source library and research files",
      "parentId": "domain:journalism",
      "aliases": [
        "dossiers sources"
      ]
    },
    {
      "id": "resource-media:media-assets",
      "type": "resource",
      "fr": "Photographies, vidéos, sons et éléments graphiques",
      "en": "Photos, videos, audio and graphic assets",
      "parentId": "domain:audiovisual-production",
      "aliases": [
        "ressources médias"
      ]
    },
    {
      "id": "resource-media:campaign-budget",
      "type": "resource",
      "fr": "Budget média et plans de diffusion",
      "en": "Media budget and distribution plans",
      "parentId": "domain:marketing-advertising",
      "aliases": [
        "budget publicité"
      ]
    },
    {
      "id": "resource-media:brand-guidelines",
      "type": "resource",
      "fr": "Charte de marque et guides de communication",
      "en": "Brand guidelines and communication guides",
      "parentId": "domain:public-relations",
      "aliases": [
        "charte communication"
      ]
    },
    {
      "id": "resource-media:editorial-calendar",
      "type": "resource",
      "fr": "Calendrier éditorial et référentiel de contenus",
      "en": "Editorial calendar and content repository",
      "parentId": "domain:content-management",
      "aliases": [
        "calendrier éditorial"
      ]
    },
    {
      "id": "resource-media:audience-data",
      "type": "resource",
      "fr": "Données d'audience et statistiques de diffusion",
      "en": "Audience and distribution analytics",
      "parentId": "domain:marketing-advertising",
      "aliases": [
        "données audience"
      ]
    },
    {
      "id": "resource-media:publication-rights",
      "type": "resource",
      "fr": "Autorisations, contrats et droits de publication",
      "en": "Publication permissions, contracts and rights",
      "parentId": "domain:public-relations",
      "aliases": [
        "droits publication"
      ]
    },
    {
      "id": "function-media:newsroom-management",
      "type": "function",
      "fr": "Gestion de rédaction et circuit éditorial",
      "en": "Newsroom and editorial workflow management",
      "parentId": "domain:journalism",
      "aliases": [
        "logiciel rédaction"
      ]
    },
    {
      "id": "function-media:fact-checking",
      "type": "function",
      "fr": "Vérification des faits et traçabilité des corrections",
      "en": "Fact-checking and correction traceability",
      "parentId": "domain:journalism",
      "aliases": [
        "outil fact checking"
      ]
    },
    {
      "id": "function-media:production-management",
      "type": "function",
      "fr": "Gestion de production vidéo, audio et équipes",
      "en": "Video, audio and crew production management",
      "parentId": "domain:audiovisual-production",
      "aliases": [
        "gestion production audiovisuelle"
      ]
    },
    {
      "id": "function-media:campaign-management",
      "type": "function",
      "fr": "Gestion des campagnes et budgets publicitaires",
      "en": "Advertising campaign and budget management",
      "parentId": "domain:marketing-advertising",
      "aliases": [
        "gestion campagne publicité"
      ]
    },
    {
      "id": "function-media:press-relations",
      "type": "function",
      "fr": "Gestion des relations presse et communiqués",
      "en": "Press relations and release management",
      "parentId": "domain:public-relations",
      "aliases": [
        "gestion relation presse"
      ]
    },
    {
      "id": "function-media:content-management",
      "type": "function",
      "fr": "Gestion éditoriale, versions et publication multicanale",
      "en": "Editorial, version and multichannel content management",
      "parentId": "domain:content-management",
      "aliases": [
        "gestion contenu multicanal"
      ]
    },
    {
      "id": "function-media:audience-analytics",
      "type": "function",
      "fr": "Analyse d'audience et performance des contenus",
      "en": "Audience and content performance analytics",
      "parentId": "domain:marketing-advertising",
      "aliases": [
        "tableau de bord audience"
      ]
    },
    {
      "id": "indicator-media:publication-cadence",
      "type": "indicator",
      "fr": "Cadence de publication éditoriale",
      "en": "Editorial publishing cadence",
      "parentId": "domain:journalism",
      "aliases": [
        "cadence publication"
      ]
    },
    {
      "id": "indicator-media:fact-correction-rate",
      "type": "indicator",
      "fr": "Taux de corrections ou rectifications publiées",
      "en": "Published correction rate",
      "parentId": "domain:journalism",
      "aliases": [
        "taux correction article"
      ]
    },
    {
      "id": "indicator-media:production-on-time",
      "type": "indicator",
      "fr": "Taux de productions livrées dans les délais",
      "en": "On-time media production rate",
      "parentId": "domain:audiovisual-production",
      "aliases": [
        "production dans délais"
      ]
    },
    {
      "id": "indicator-media:campaign-conversion",
      "type": "indicator",
      "fr": "Taux de conversion des campagnes publicitaires",
      "en": "Advertising campaign conversion rate",
      "parentId": "domain:marketing-advertising",
      "aliases": [
        "conversion publicité"
      ]
    },
    {
      "id": "indicator-media:audience-reach",
      "type": "indicator",
      "fr": "Portée et couverture des audiences",
      "en": "Audience reach and coverage",
      "parentId": "domain:marketing-advertising",
      "aliases": [
        "portée audience"
      ]
    },
    {
      "id": "indicator-media:engagement-rate",
      "type": "indicator",
      "fr": "Taux d'engagement des contenus",
      "en": "Content engagement rate",
      "parentId": "domain:content-management",
      "aliases": [
        "taux engagement contenu"
      ]
    },
    {
      "id": "indicator-media:rights-compliance",
      "type": "indicator",
      "fr": "Part des publications avec droits et autorisations vérifiés",
      "en": "Share of publications with verified rights",
      "parentId": "domain:public-relations",
      "aliases": [
        "conformité droits publication"
      ]
    }
  ],
  "safetyNotes": [
    "Les publications et productions exigent vérification des sources, droit de réponse, correction traçable et distinction entre information, opinion, publicité et contenu sponsorisé.",
    "Les droits d'auteur, droits à l'image, droits musicaux, autorisations d'archives et contrats de diffusion doivent être vérifiés avant publication.",
    "Les données d'audience, profils et communautés sont soumis aux règles de protection des données et ne doivent pas servir à manipuler ou cibler illégalement les personnes.",
    "Les contenus générés par IA doivent être vérifiés, étiquetés selon les règles applicables et ne peuvent être présentés comme témoignage, source ou preuve authentique.",
    "Les communications de crise et les prises de parole officielles nécessitent validation par les responsables autorisés."
  ]
},[
  [
    "activity-media:journalistic-investigation",
    "process-media:editorial-cycle",
    "part_of"
  ],
  [
    "activity-media:audiovisual-report",
    "process-media:audiovisual-production",
    "part_of"
  ],
  [
    "function-media:fact-checking",
    "activity-media:source-verification",
    "supports"
  ],
  [
    "function-media:content-management",
    "resource-media:editorial-calendar",
    "manages"
  ],
  [
    "problem-media:misinformation",
    "function-media:fact-checking",
    "may_be_mitigated_by"
  ],
  [
    "function-media:campaign-management",
    "activity-media:ad-campaign",
    "supports"
  ],
  [
    "problem-media:rights-clearance",
    "resource-media:publication-rights",
    "requires_control_by"
  ],
  [
    "activity-media:content-publication",
    "process-media:content-lifecycle",
    "part_of"
  ]
]);
export const MEDIA_COMMUNICATION_FAMILY_CONCEPTS=result.familyConcepts.filter(concept=>concept.id!=="family:media-communication");
export const MEDIA_COMMUNICATION_CATALOG=result.catalog;
export const MEDIA_COMMUNICATION_RELATIONSHIPS=result.relationships;
