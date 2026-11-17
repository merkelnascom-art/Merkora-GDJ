import {createFamilyCatalog} from "./family-catalog-builder";
const result=createFamilyCatalog({
  "familyId": "family:sport-physical-activity",
  "familyFr": "Sport et activités physiques",
  "familyEn": "Sport and physical activity",
  "sourceId": "source:merkora-family-15-sport-physical-activity-v1",
  "familyNumber": 15,
  "domains": [
    {
      "id": "domain:team-sports",
      "fr": "Sports collectifs",
      "en": "Team sports",
      "create": true
    },
    {
      "id": "domain:individual-sports",
      "fr": "Sports individuels",
      "en": "Individual sports",
      "create": true
    },
    {
      "id": "domain:fitness-conditioning",
      "fr": "Fitness et préparation physique",
      "en": "Fitness and physical conditioning",
      "create": true
    },
    {
      "id": "domain:sports-clubs",
      "fr": "Clubs et organisations sportives",
      "en": "Sports clubs and organizations",
      "create": true
    },
    {
      "id": "domain:sports-performance",
      "fr": "Performance et encadrement sportif",
      "en": "Sports performance and coaching",
      "create": true
    }
  ],
  "seeds": [
    {
      "id": "subdomain-sport:team-ball-sports",
      "type": "subdomain",
      "fr": "Sports collectifs avec ballon",
      "en": "Team ball sports",
      "parentId": "domain:team-sports",
      "aliases": [
        "football en équipe",
        "basketball"
      ]
    },
    {
      "id": "subdomain-sport:team-court-sports",
      "type": "subdomain",
      "fr": "Sports collectifs de salle et de terrain",
      "en": "Team court and field sports",
      "parentId": "domain:team-sports",
      "aliases": [
        "volleyball",
        "handball"
      ]
    },
    {
      "id": "subdomain-sport:team-water-sports",
      "type": "subdomain",
      "fr": "Sports collectifs aquatiques",
      "en": "Team water sports",
      "parentId": "domain:team-sports",
      "aliases": [
        "water-polo"
      ]
    },
    {
      "id": "subdomain-sport:team-contact-sports",
      "type": "subdomain",
      "fr": "Sports collectifs de contact",
      "en": "Team contact sports",
      "parentId": "domain:team-sports",
      "aliases": [
        "rugby"
      ]
    },
    {
      "id": "subdomain-sport:individual-athletics",
      "type": "subdomain",
      "fr": "Athlétisme et disciplines individuelles",
      "en": "Athletics and individual disciplines",
      "parentId": "domain:individual-sports",
      "aliases": [
        "athlétisme individuel"
      ]
    },
    {
      "id": "subdomain-sport:racket-sports",
      "type": "subdomain",
      "fr": "Sports de raquette",
      "en": "Racket sports",
      "parentId": "domain:individual-sports",
      "aliases": [
        "tennis",
        "badminton"
      ]
    },
    {
      "id": "subdomain-sport:combat-sports",
      "type": "subdomain",
      "fr": "Sports de combat individuels",
      "en": "Individual combat sports",
      "parentId": "domain:individual-sports",
      "aliases": [
        "judo",
        "boxe"
      ]
    },
    {
      "id": "subdomain-sport:precision-sports",
      "type": "subdomain",
      "fr": "Sports de précision et d'adresse",
      "en": "Precision and skill sports",
      "parentId": "domain:individual-sports",
      "aliases": [
        "tir à l'arc",
        "golf"
      ]
    },
    {
      "id": "subdomain-sport:fitness-training",
      "type": "subdomain",
      "fr": "Fitness, musculation et condition physique",
      "en": "Fitness, strength and conditioning",
      "parentId": "domain:fitness-conditioning",
      "aliases": [
        "préparation physique et fitness"
      ]
    },
    {
      "id": "subdomain-sport:group-fitness",
      "type": "subdomain",
      "fr": "Cours collectifs de remise en forme",
      "en": "Group fitness classes",
      "parentId": "domain:fitness-conditioning",
      "aliases": [
        "cours fitness collectif"
      ]
    },
    {
      "id": "subdomain-sport:mobility-flexibility",
      "type": "subdomain",
      "fr": "Mobilité, souplesse et récupération physique",
      "en": "Mobility, flexibility and physical recovery",
      "parentId": "domain:fitness-conditioning",
      "aliases": [
        "souplesse récupération"
      ]
    },
    {
      "id": "subdomain-sport:recreational-activity",
      "type": "subdomain",
      "fr": "Activités physiques de loisir et bien-être",
      "en": "Recreational and wellbeing physical activity",
      "parentId": "domain:fitness-conditioning",
      "aliases": [
        "activité physique loisir"
      ]
    },
    {
      "id": "subdomain-sport:club-administration",
      "type": "subdomain",
      "fr": "Administration et gestion de clubs sportifs",
      "en": "Sports club administration",
      "parentId": "domain:sports-clubs",
      "aliases": [
        "gestion d'un club sportif"
      ]
    },
    {
      "id": "subdomain-sport:membership-licensing",
      "type": "subdomain",
      "fr": "Adhésions, licences et affiliations",
      "en": "Membership, licensing and affiliations",
      "parentId": "domain:sports-clubs",
      "aliases": [
        "licence sportive"
      ]
    },
    {
      "id": "subdomain-sport:competition-organization",
      "type": "subdomain",
      "fr": "Organisation de compétitions et tournois",
      "en": "Competition and tournament organization",
      "parentId": "domain:sports-clubs",
      "aliases": [
        "organisation tournoi"
      ]
    },
    {
      "id": "subdomain-sport:sports-facilities",
      "type": "subdomain",
      "fr": "Gestion des installations et équipements sportifs",
      "en": "Sports facilities and equipment management",
      "parentId": "domain:sports-clubs",
      "aliases": [
        "infrastructure sportive"
      ]
    },
    {
      "id": "subdomain-sport:performance-coaching",
      "type": "subdomain",
      "fr": "Encadrement de la performance sportive",
      "en": "Sports performance coaching",
      "parentId": "domain:sports-performance",
      "aliases": [
        "encadrement de la performance sportive"
      ]
    },
    {
      "id": "subdomain-sport:talent-development",
      "type": "subdomain",
      "fr": "Détection et développement des talents",
      "en": "Talent identification and development",
      "parentId": "domain:sports-performance",
      "aliases": [
        "détection talent sportif"
      ]
    },
    {
      "id": "subdomain-sport:sports-analysis",
      "type": "subdomain",
      "fr": "Analyse tactique et performance",
      "en": "Tactical and performance analysis",
      "parentId": "domain:sports-performance",
      "aliases": [
        "analyse performance sportive"
      ]
    },
    {
      "id": "subdomain-sport:refereeing-governance",
      "type": "subdomain",
      "fr": "Arbitrage et gouvernance des compétitions",
      "en": "Refereeing and competition governance",
      "parentId": "domain:sports-performance",
      "aliases": [
        "arbitrage sportif"
      ]
    },
    {
      "id": "specialization-sport:adaptive-sport",
      "type": "specialization",
      "fr": "Sport adapté et parasport",
      "en": "Adaptive sport and para-sport",
      "parentId": "domain:team-sports",
      "aliases": [
        "parasport"
      ]
    },
    {
      "id": "specialization-sport:youth-sport",
      "type": "specialization",
      "fr": "Sport des jeunes et développement",
      "en": "Youth sport development",
      "parentId": "domain:sports-clubs",
      "aliases": [
        "sport jeunesse"
      ]
    },
    {
      "id": "specialization-sport:elite-sport",
      "type": "specialization",
      "fr": "Sport de haut niveau",
      "en": "Elite sport",
      "parentId": "domain:sports-performance",
      "aliases": [
        "sport haut niveau"
      ]
    },
    {
      "id": "specialization-sport:community-sport",
      "type": "specialization",
      "fr": "Sport communautaire et inclusion",
      "en": "Community and inclusive sport",
      "parentId": "domain:sports-clubs",
      "aliases": [
        "sport communautaire"
      ]
    },
    {
      "id": "specialization-sport:sports-science",
      "type": "specialization",
      "fr": "Sciences et données de la performance sportive",
      "en": "Sports science and performance data",
      "parentId": "domain:sports-performance",
      "aliases": [
        "science du sport"
      ]
    },
    {
      "id": "specialization-sport:strength-conditioning",
      "type": "specialization",
      "fr": "Force, endurance et conditionnement",
      "en": "Strength, endurance and conditioning",
      "parentId": "domain:fitness-conditioning",
      "aliases": [
        "préparation physique"
      ]
    },
    {
      "id": "specialization-sport:injury-prevention",
      "type": "specialization",
      "fr": "Prévention des blessures et retour progressif à l'activité",
      "en": "Injury prevention and return to activity",
      "parentId": "domain:fitness-conditioning",
      "aliases": [
        "prévention blessures sport"
      ]
    },
    {
      "id": "occupation-sport:coach",
      "type": "occupation",
      "fr": "Entraîneur sportif",
      "en": "Sports coach",
      "parentId": "domain:sports-performance",
      "aliases": [
        "coach sportif"
      ]
    },
    {
      "id": "occupation-sport:physical-trainer",
      "type": "occupation",
      "fr": "Préparateur physique",
      "en": "Strength and conditioning coach",
      "parentId": "domain:fitness-conditioning",
      "aliases": [
        "préparateur physique"
      ]
    },
    {
      "id": "occupation-sport:athlete",
      "type": "occupation",
      "fr": "Sportif ou athlète",
      "en": "Athlete",
      "parentId": "domain:individual-sports",
      "aliases": [
        "sportif professionnel"
      ]
    },
    {
      "id": "occupation-sport:referee",
      "type": "occupation",
      "fr": "Arbitre sportif",
      "en": "Sports referee",
      "parentId": "domain:sports-performance",
      "aliases": [
        "arbitre"
      ]
    },
    {
      "id": "occupation-sport:club-manager",
      "type": "occupation",
      "fr": "Gestionnaire de club sportif",
      "en": "Sports club manager",
      "parentId": "domain:sports-clubs",
      "aliases": [
        "responsable club"
      ]
    },
    {
      "id": "occupation-sport:competition-organizer",
      "type": "occupation",
      "fr": "Organisateur de compétitions",
      "en": "Sports competition organizer",
      "parentId": "domain:sports-clubs",
      "aliases": [
        "organisateur tournoi"
      ]
    },
    {
      "id": "occupation-sport:fitness-instructor",
      "type": "occupation",
      "fr": "Animateur ou instructeur fitness",
      "en": "Fitness instructor",
      "parentId": "domain:fitness-conditioning",
      "aliases": [
        "instructeur fitness"
      ]
    },
    {
      "id": "occupation-sport:performance-analyst",
      "type": "occupation",
      "fr": "Analyste de la performance sportive",
      "en": "Sports performance analyst",
      "parentId": "domain:sports-performance",
      "aliases": [
        "analyste sportif"
      ]
    },
    {
      "id": "occupation-sport:team-captain",
      "type": "occupation",
      "fr": "Capitaine ou responsable d'équipe",
      "en": "Team captain",
      "parentId": "domain:team-sports",
      "aliases": [
        "capitaine équipe"
      ]
    },
    {
      "id": "occupation-sport:facility-technician",
      "type": "occupation",
      "fr": "Technicien d'installation sportive",
      "en": "Sports facility technician",
      "parentId": "domain:sports-clubs",
      "aliases": [
        "technicien équipement sportif"
      ]
    },
    {
      "id": "occupation-sport:talent-scout",
      "type": "occupation",
      "fr": "Recruteur et détecteur de talents sportifs",
      "en": "Sports talent scout",
      "parentId": "domain:sports-performance",
      "aliases": [
        "détecteur talents"
      ]
    },
    {
      "id": "occupation-sport:sports-official",
      "type": "occupation",
      "fr": "Officiel et délégué de compétition",
      "en": "Sports official and competition delegate",
      "parentId": "domain:sports-clubs",
      "aliases": [
        "délégué compétition"
      ]
    },
    {
      "id": "activity-sport:training-session",
      "type": "activity",
      "fr": "Conduite d'une séance d'entraînement",
      "en": "Conducting a training session",
      "parentId": "domain:sports-performance",
      "aliases": [
        "conduite d'une séance d'entraînement"
      ]
    },
    {
      "id": "activity-sport:competition-organization",
      "type": "activity",
      "fr": "Organisation d'une compétition sportive",
      "en": "Organizing a sports competition",
      "parentId": "domain:sports-clubs",
      "aliases": [
        "organisation d'une compétition sportive"
      ]
    },
    {
      "id": "activity-sport:match-refereeing",
      "type": "activity",
      "fr": "Arbitrage d'un match",
      "en": "Refereeing a match",
      "parentId": "domain:sports-performance",
      "aliases": [
        "arbitrage d'un match"
      ]
    },
    {
      "id": "activity-sport:performance-monitoring",
      "type": "activity",
      "fr": "Suivi des performances d'un athlète",
      "en": "Monitoring athlete performance",
      "parentId": "domain:sports-performance",
      "aliases": [
        "suivi des performances d'un athlète"
      ]
    },
    {
      "id": "activity-sport:injury-prevention",
      "type": "activity",
      "fr": "Prévention des blessures sportives",
      "en": "Sports injury prevention",
      "parentId": "domain:fitness-conditioning",
      "aliases": [
        "prévention des blessures sportives"
      ]
    },
    {
      "id": "activity-sport:fitness-class",
      "type": "activity",
      "fr": "Animation d'un cours collectif de fitness",
      "en": "Leading a group fitness class",
      "parentId": "domain:fitness-conditioning",
      "aliases": [
        "cours collectif fitness"
      ]
    },
    {
      "id": "activity-sport:club-enrollment",
      "type": "activity",
      "fr": "Inscription et affiliation d'un membre",
      "en": "Member enrollment and affiliation",
      "parentId": "domain:sports-clubs",
      "aliases": [
        "inscription club sportif"
      ]
    },
    {
      "id": "activity-sport:facility-inspection",
      "type": "activity",
      "fr": "Inspection d'une installation sportive",
      "en": "Sports facility inspection",
      "parentId": "domain:sports-clubs",
      "aliases": [
        "inspection installation sportive"
      ]
    },
    {
      "id": "activity-sport:talent-assessment",
      "type": "activity",
      "fr": "Évaluation du potentiel sportif",
      "en": "Sports talent assessment",
      "parentId": "domain:sports-performance",
      "aliases": [
        "évaluation potentiel sportif"
      ]
    },
    {
      "id": "activity-sport:team-selection",
      "type": "activity",
      "fr": "Sélection et composition d'une équipe",
      "en": "Team selection and composition",
      "parentId": "domain:team-sports",
      "aliases": [
        "sélection équipe"
      ]
    },
    {
      "id": "activity-sport:recovery-planning",
      "type": "activity",
      "fr": "Planification de récupération non clinique",
      "en": "Non-clinical recovery planning",
      "parentId": "domain:fitness-conditioning",
      "aliases": [
        "planification récupération"
      ]
    },
    {
      "id": "activity-sport:results-recording",
      "type": "activity",
      "fr": "Enregistrement et validation des résultats sportifs",
      "en": "Recording and validating sports results",
      "parentId": "domain:sports-clubs",
      "aliases": [
        "enregistrement résultats sportifs"
      ]
    },
    {
      "id": "process-sport:athlete-development",
      "type": "process",
      "fr": "Parcours de développement d'un athlète",
      "en": "Athlete development pathway",
      "parentId": "domain:sports-performance",
      "aliases": [
        "parcours athlète"
      ]
    },
    {
      "id": "process-sport:team-season",
      "type": "process",
      "fr": "Cycle d'une saison d'équipe",
      "en": "Team season cycle",
      "parentId": "domain:team-sports",
      "aliases": [
        "saison sportive"
      ]
    },
    {
      "id": "process-sport:competition-cycle",
      "type": "process",
      "fr": "Cycle de préparation et de tenue d'une compétition",
      "en": "Competition preparation and delivery cycle",
      "parentId": "domain:sports-clubs",
      "aliases": [
        "cycle compétition"
      ]
    },
    {
      "id": "process-sport:club-membership",
      "type": "process",
      "fr": "Cycle d'adhésion et de renouvellement d'une licence",
      "en": "Club membership and license renewal cycle",
      "parentId": "domain:sports-clubs",
      "aliases": [
        "renouvellement licence"
      ]
    },
    {
      "id": "process-sport:fitness-program",
      "type": "process",
      "fr": "Parcours de programme de condition physique",
      "en": "Physical conditioning program pathway",
      "parentId": "domain:fitness-conditioning",
      "aliases": [
        "programme fitness"
      ]
    },
    {
      "id": "process-sport:talent-pathway",
      "type": "process",
      "fr": "Parcours de détection et de développement des talents",
      "en": "Talent identification and development pathway",
      "parentId": "domain:sports-performance",
      "aliases": [
        "parcours détection talent"
      ]
    },
    {
      "id": "process-sport:facility-maintenance",
      "type": "process",
      "fr": "Cycle de contrôle et de maintenance des installations",
      "en": "Facility inspection and maintenance cycle",
      "parentId": "domain:sports-clubs",
      "aliases": [
        "maintenance équipement sportif"
      ]
    },
    {
      "id": "process-sport:injury-return",
      "type": "process",
      "fr": "Parcours de retour à l'activité après blessure validé médicalement",
      "en": "Medically cleared return-to-activity pathway",
      "parentId": "domain:fitness-conditioning",
      "aliases": [
        "retour sport après blessure"
      ]
    },
    {
      "id": "problem-sport:low-participation",
      "type": "problem",
      "fr": "Faible participation et abandon des activités sportives",
      "en": "Low participation and dropout",
      "parentId": "domain:sports-clubs",
      "aliases": [
        "abandon sport"
      ]
    },
    {
      "id": "problem-sport:training-disorganization",
      "type": "problem",
      "fr": "Entraînements et calendriers mal coordonnés",
      "en": "Poorly coordinated training schedules",
      "parentId": "domain:sports-performance",
      "aliases": [
        "désorganisation entraînement"
      ]
    },
    {
      "id": "problem-sport:competition-errors",
      "type": "problem",
      "fr": "Erreurs d'organisation et de résultats de compétition",
      "en": "Competition organization and result errors",
      "parentId": "domain:sports-clubs",
      "aliases": [
        "erreur résultat match"
      ]
    },
    {
      "id": "problem-sport:facility-unavailability",
      "type": "problem",
      "fr": "Indisponibilité ou mauvais état des installations",
      "en": "Unavailable or poorly maintained facilities",
      "parentId": "domain:sports-clubs",
      "aliases": [
        "terrain indisponible"
      ]
    },
    {
      "id": "problem-sport:injury-risk",
      "type": "problem",
      "fr": "Risques de blessures et prévention insuffisante",
      "en": "Injury risks and insufficient prevention",
      "parentId": "domain:fitness-conditioning",
      "aliases": [
        "risque blessure sport"
      ]
    },
    {
      "id": "problem-sport:talent-loss",
      "type": "problem",
      "fr": "Détection tardive et perte de talents",
      "en": "Late talent identification and loss",
      "parentId": "domain:sports-performance",
      "aliases": [
        "talent non détecté"
      ]
    },
    {
      "id": "problem-sport:unfair-selection",
      "type": "problem",
      "fr": "Sélection peu transparente ou contestée",
      "en": "Non-transparent or disputed selection",
      "parentId": "domain:sports-performance",
      "aliases": [
        "sélection injuste équipe"
      ]
    },
    {
      "id": "problem-sport:membership-management",
      "type": "problem",
      "fr": "Gestion complexe des adhésions et licences",
      "en": "Complex membership and licensing management",
      "parentId": "domain:sports-clubs",
      "aliases": [
        "gestion licences club"
      ]
    },
    {
      "id": "problem-sport:performance-data-gaps",
      "type": "problem",
      "fr": "Données de performance incomplètes ou peu fiables",
      "en": "Incomplete or unreliable performance data",
      "parentId": "domain:sports-performance",
      "aliases": [
        "données performance manquantes"
      ]
    },
    {
      "id": "problem-sport:safeguarding-incidents",
      "type": "problem",
      "fr": "Incidents de protection et de sécurité des sportifs",
      "en": "Athlete safeguarding and safety incidents",
      "parentId": "domain:sports-clubs",
      "aliases": [
        "incident protection sportif"
      ]
    },
    {
      "id": "resource-sport:training-plans",
      "type": "resource",
      "fr": "Plans d'entraînement et calendriers",
      "en": "Training plans and schedules",
      "parentId": "domain:sports-performance",
      "aliases": [
        "plan entraînement"
      ]
    },
    {
      "id": "resource-sport:athlete-profile",
      "type": "resource",
      "fr": "Profil sportif et historique de progression",
      "en": "Athlete profile and progress history",
      "parentId": "domain:sports-performance",
      "aliases": [
        "fiche athlète"
      ]
    },
    {
      "id": "resource-sport:competition-rules",
      "type": "resource",
      "fr": "Règlements et règles de compétition",
      "en": "Competition regulations and rules",
      "parentId": "domain:sports-clubs",
      "aliases": [
        "règlement compétition"
      ]
    },
    {
      "id": "resource-sport:facility-inventory",
      "type": "resource",
      "fr": "Inventaire des installations et équipements",
      "en": "Facility and equipment inventory",
      "parentId": "domain:sports-clubs",
      "aliases": [
        "inventaire équipements sportifs"
      ]
    },
    {
      "id": "resource-sport:performance-data",
      "type": "resource",
      "fr": "Données d'entraînement et de performance",
      "en": "Training and performance data",
      "parentId": "domain:sports-performance",
      "aliases": [
        "données performance"
      ]
    },
    {
      "id": "resource-sport:membership-records",
      "type": "resource",
      "fr": "Registres d'adhérents et licences",
      "en": "Membership and license records",
      "parentId": "domain:sports-clubs",
      "aliases": [
        "registre adhérents"
      ]
    },
    {
      "id": "resource-sport:safety-protocols",
      "type": "resource",
      "fr": "Protocoles de sécurité et de protection",
      "en": "Safety and safeguarding protocols",
      "parentId": "domain:sports-clubs",
      "aliases": [
        "protocole sécurité sport"
      ]
    },
    {
      "id": "function-sport:club-management",
      "type": "function",
      "fr": "Gestion des clubs, membres et licences",
      "en": "Club, member and license management",
      "parentId": "domain:sports-clubs",
      "aliases": [
        "logiciel gestion club sportif"
      ]
    },
    {
      "id": "function-sport:training-planner",
      "type": "function",
      "fr": "Planification des entraînements et séances",
      "en": "Training and session planning",
      "parentId": "domain:sports-performance",
      "aliases": [
        "planning entraînement"
      ]
    },
    {
      "id": "function-sport:competition-management",
      "type": "function",
      "fr": "Gestion des compétitions, calendriers et résultats",
      "en": "Competition, schedule and result management",
      "parentId": "domain:sports-clubs",
      "aliases": [
        "gestion compétition"
      ]
    },
    {
      "id": "function-sport:athlete-monitoring",
      "type": "function",
      "fr": "Suivi de progression et performance des athlètes",
      "en": "Athlete progress and performance monitoring",
      "parentId": "domain:sports-performance",
      "aliases": [
        "suivi performance athlète"
      ]
    },
    {
      "id": "function-sport:facility-management",
      "type": "function",
      "fr": "Gestion des installations et réservations sportives",
      "en": "Sports facility and booking management",
      "parentId": "domain:sports-clubs",
      "aliases": [
        "gestion terrain sport"
      ]
    },
    {
      "id": "function-sport:fitness-programs",
      "type": "function",
      "fr": "Gestion de programmes de fitness et conditionnement",
      "en": "Fitness and conditioning program management",
      "parentId": "domain:fitness-conditioning",
      "aliases": [
        "programme fitness"
      ]
    },
    {
      "id": "function-sport:safeguarding-reports",
      "type": "function",
      "fr": "Signalement et suivi des incidents de protection",
      "en": "Safeguarding incident reporting and tracking",
      "parentId": "domain:sports-clubs",
      "aliases": [
        "signalement incident sport"
      ]
    },
    {
      "id": "indicator-sport:participation-rate",
      "type": "indicator",
      "fr": "Taux de participation aux activités sportives",
      "en": "Sports activity participation rate",
      "parentId": "domain:sports-clubs",
      "aliases": [
        "taux participation sport"
      ]
    },
    {
      "id": "indicator-sport:attendance-rate",
      "type": "indicator",
      "fr": "Taux de présence aux entraînements",
      "en": "Training attendance rate",
      "parentId": "domain:sports-performance",
      "aliases": [
        "présence entraînement"
      ]
    },
    {
      "id": "indicator-sport:competition-completion",
      "type": "indicator",
      "fr": "Taux de compétitions tenues sans incident majeur",
      "en": "Competition completion rate without major incidents",
      "parentId": "domain:sports-clubs",
      "aliases": [
        "compétition tenue"
      ]
    },
    {
      "id": "indicator-sport:athlete-progress",
      "type": "indicator",
      "fr": "Progression mesurée des performances sportives",
      "en": "Measured athlete performance progress",
      "parentId": "domain:sports-performance",
      "aliases": [
        "progression performance"
      ]
    },
    {
      "id": "indicator-sport:injury-incidence",
      "type": "indicator",
      "fr": "Incidence des blessures rapportées",
      "en": "Reported injury incidence",
      "parentId": "domain:fitness-conditioning",
      "aliases": [
        "incidence blessures"
      ]
    },
    {
      "id": "indicator-sport:membership-retention",
      "type": "indicator",
      "fr": "Taux de renouvellement des adhésions",
      "en": "Membership renewal rate",
      "parentId": "domain:sports-clubs",
      "aliases": [
        "renouvellement adhésion"
      ]
    },
    {
      "id": "indicator-sport:facility-availability",
      "type": "indicator",
      "fr": "Taux de disponibilité des installations sportives",
      "en": "Sports facility availability rate",
      "parentId": "domain:sports-clubs",
      "aliases": [
        "disponibilité terrain sport"
      ]
    }
  ],
  "safetyNotes": [
    "Les activités sportives comportent des risques physiques ; les consignes de sécurité, équipements, qualifications et autorisations dépendent de la discipline et du contexte.",
    "MerKora ne diagnostique aucune blessure, ne prescrit pas de rééducation et ne valide pas le retour au sport ; ces décisions relèvent d'un professionnel de santé habilité.",
    "Les données de santé, performances, mineurs et adhérents doivent être minimisées, protégées et accessibles uniquement aux rôles autorisés.",
    "Les règles d'arbitrage, catégories d'âge, licences, dopage, assurances, compétitions et fédérations dépendent des règlements officiels applicables.",
    "La protection des mineurs, le consentement, la prévention du harcèlement et les procédures de signalement doivent être intégrés aux clubs et événements."
  ]
},[
  [
    "activity-sport:training-session",
    "process-sport:athlete-development",
    "part_of"
  ],
  [
    "activity-sport:competition-organization",
    "process-sport:competition-cycle",
    "part_of"
  ],
  [
    "function-sport:training-planner",
    "activity-sport:training-session",
    "supports"
  ],
  [
    "function-sport:athlete-monitoring",
    "resource-sport:performance-data",
    "uses"
  ],
  [
    "problem-sport:training-disorganization",
    "function-sport:training-planner",
    "may_be_mitigated_by"
  ],
  [
    "problem-sport:injury-risk",
    "specialization-sport:injury-prevention",
    "addressed_by"
  ],
  [
    "function-sport:club-management",
    "resource-sport:membership-records",
    "manages"
  ],
  [
    "activity-sport:facility-inspection",
    "process-sport:facility-maintenance",
    "part_of"
  ]
]);
export const SPORT_PHYSICAL_ACTIVITY_FAMILY_CONCEPTS=result.familyConcepts;
export const SPORT_PHYSICAL_ACTIVITY_CATALOG=result.catalog;
export const SPORT_PHYSICAL_ACTIVITY_RELATIONSHIPS=result.relationships;
