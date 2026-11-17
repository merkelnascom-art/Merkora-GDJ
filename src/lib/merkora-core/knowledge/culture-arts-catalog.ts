import {createFamilyCatalog} from "./family-catalog-builder";
const result=createFamilyCatalog({
  "familyId": "family:culture-arts",
  "familyFr": "Culture et arts",
  "familyEn": "Culture and arts",
  "sourceId": "source:merkora-family-16-culture-arts-v1",
  "familyNumber": 16,
  "domains": [
    {
      "id": "domain:dance-movement",
      "fr": "Danse et arts du mouvement",
      "en": "Dance and movement arts",
      "create": true
    },
    {
      "id": "domain:music-sound",
      "fr": "Musique et arts sonores",
      "en": "Music and sound arts",
      "create": true
    },
    {
      "id": "domain:visual-arts",
      "fr": "Arts visuels et création plastique",
      "en": "Visual and fine arts",
      "create": true
    },
    {
      "id": "domain:cultural-performance",
      "fr": "Spectacle et événementiel culturel",
      "en": "Cultural performance and events",
      "create": true
    },
    {
      "id": "domain:heritage-institutions",
      "fr": "Patrimoine et institutions culturelles",
      "en": "Heritage and cultural institutions",
      "create": true
    }
  ],
  "seeds": [
    {
      "id": "subdomain-culture:dance-training",
      "type": "subdomain",
      "fr": "Enseignement et pratique de la danse",
      "en": "Dance education and practice",
      "parentId": "domain:dance-movement",
      "aliases": [
        "enseignement de la danse"
      ]
    },
    {
      "id": "subdomain-culture:choreography",
      "type": "subdomain",
      "fr": "Chorégraphie et création du mouvement",
      "en": "Choreography and movement creation",
      "parentId": "domain:dance-movement",
      "aliases": [
        "création chorégraphique"
      ]
    },
    {
      "id": "subdomain-culture:traditional-dance",
      "type": "subdomain",
      "fr": "Danses traditionnelles et patrimoniales",
      "en": "Traditional and heritage dance",
      "parentId": "domain:dance-movement",
      "aliases": [
        "danse traditionnelle"
      ]
    },
    {
      "id": "subdomain-culture:movement-arts",
      "type": "subdomain",
      "fr": "Arts du mouvement et performance corporelle",
      "en": "Movement arts and physical performance",
      "parentId": "domain:dance-movement",
      "aliases": [
        "arts du mouvement"
      ]
    },
    {
      "id": "subdomain-culture:music-production",
      "type": "subdomain",
      "fr": "Production musicale et enregistrement sonore",
      "en": "Music production and sound recording",
      "parentId": "domain:music-sound",
      "aliases": [
        "production musicale"
      ]
    },
    {
      "id": "subdomain-culture:instrumental-music",
      "type": "subdomain",
      "fr": "Pratique instrumentale et ensembles",
      "en": "Instrumental practice and ensembles",
      "parentId": "domain:music-sound",
      "aliases": [
        "musique instrumentale"
      ]
    },
    {
      "id": "subdomain-culture:vocal-music",
      "type": "subdomain",
      "fr": "Chant et arts vocaux",
      "en": "Singing and vocal arts",
      "parentId": "domain:music-sound",
      "aliases": [
        "chant"
      ]
    },
    {
      "id": "subdomain-culture:sound-design",
      "type": "subdomain",
      "fr": "Création sonore et ingénierie du son",
      "en": "Sound design and audio engineering",
      "parentId": "domain:music-sound",
      "aliases": [
        "création sonore"
      ]
    },
    {
      "id": "subdomain-culture:visual-art-creation",
      "type": "subdomain",
      "fr": "Création d'arts visuels et plastiques",
      "en": "Visual and fine art creation",
      "parentId": "domain:visual-arts",
      "aliases": [
        "création d'une œuvre visuelle"
      ]
    },
    {
      "id": "subdomain-culture:painting-drawing",
      "type": "subdomain",
      "fr": "Peinture, dessin et illustration",
      "en": "Painting, drawing and illustration",
      "parentId": "domain:visual-arts",
      "aliases": [
        "peinture dessin"
      ]
    },
    {
      "id": "subdomain-culture:photography",
      "type": "subdomain",
      "fr": "Photographie et image artistique",
      "en": "Photography and artistic imaging",
      "parentId": "domain:visual-arts",
      "aliases": [
        "photographie artistique"
      ]
    },
    {
      "id": "subdomain-culture:digital-art",
      "type": "subdomain",
      "fr": "Art numérique et création multimédia",
      "en": "Digital art and multimedia creation",
      "parentId": "domain:visual-arts",
      "aliases": [
        "art numérique"
      ]
    },
    {
      "id": "subdomain-culture:live-performance",
      "type": "subdomain",
      "fr": "Production de spectacles vivants",
      "en": "Live performance production",
      "parentId": "domain:cultural-performance",
      "aliases": [
        "production d'un spectacle vivant"
      ]
    },
    {
      "id": "subdomain-culture:theatre-performance",
      "type": "subdomain",
      "fr": "Théâtre et arts dramatiques",
      "en": "Theatre and dramatic arts",
      "parentId": "domain:cultural-performance",
      "aliases": [
        "théâtre"
      ]
    },
    {
      "id": "subdomain-culture:concert-events",
      "type": "subdomain",
      "fr": "Concerts et événements musicaux",
      "en": "Concerts and music events",
      "parentId": "domain:cultural-performance",
      "aliases": [
        "concert"
      ]
    },
    {
      "id": "subdomain-culture:festival-production",
      "type": "subdomain",
      "fr": "Festivals et programmation culturelle",
      "en": "Festivals and cultural programming",
      "parentId": "domain:cultural-performance",
      "aliases": [
        "festival culturel"
      ]
    },
    {
      "id": "subdomain-culture:museum-heritage",
      "type": "subdomain",
      "fr": "Musées et gestion des collections patrimoniales",
      "en": "Museums and heritage collections",
      "parentId": "domain:heritage-institutions",
      "aliases": [
        "gestion d'un musée patrimonial"
      ]
    },
    {
      "id": "subdomain-culture:monuments-sites",
      "type": "subdomain",
      "fr": "Monuments, sites et patrimoine bâti",
      "en": "Monuments, sites and built heritage",
      "parentId": "domain:heritage-institutions",
      "aliases": [
        "patrimoine bâti"
      ]
    },
    {
      "id": "subdomain-culture:archives-memory",
      "type": "subdomain",
      "fr": "Archives, mémoire et patrimoine immatériel",
      "en": "Archives, memory and intangible heritage",
      "parentId": "domain:heritage-institutions",
      "aliases": [
        "patrimoine immatériel"
      ]
    },
    {
      "id": "subdomain-culture:cultural-education",
      "type": "subdomain",
      "fr": "Médiation et éducation culturelle",
      "en": "Cultural mediation and education",
      "parentId": "domain:heritage-institutions",
      "aliases": [
        "médiation culturelle"
      ]
    },
    {
      "id": "specialization-culture:contemporary-dance",
      "type": "specialization",
      "fr": "Danse contemporaine et expérimentation",
      "en": "Contemporary dance and experimentation",
      "parentId": "domain:dance-movement",
      "aliases": [
        "danse contemporaine"
      ]
    },
    {
      "id": "specialization-culture:music-arrangement",
      "type": "specialization",
      "fr": "Composition et arrangement musical",
      "en": "Music composition and arrangement",
      "parentId": "domain:music-sound",
      "aliases": [
        "composition musicale"
      ]
    },
    {
      "id": "specialization-culture:visual-curation",
      "type": "specialization",
      "fr": "Curation et commissariat d'exposition",
      "en": "Visual curation and exhibition making",
      "parentId": "domain:visual-arts",
      "aliases": [
        "commissariat exposition"
      ]
    },
    {
      "id": "specialization-culture:immersive-arts",
      "type": "specialization",
      "fr": "Arts immersifs et expériences interactives",
      "en": "Immersive arts and interactive experiences",
      "parentId": "domain:visual-arts",
      "aliases": [
        "art immersif"
      ]
    },
    {
      "id": "specialization-culture:performing-arts",
      "type": "specialization",
      "fr": "Arts de la scène et production scénique",
      "en": "Performing arts and stage production",
      "parentId": "domain:cultural-performance",
      "aliases": [
        "arts de la scène"
      ]
    },
    {
      "id": "specialization-culture:heritage-conservation",
      "type": "specialization",
      "fr": "Conservation et restauration du patrimoine",
      "en": "Heritage conservation and restoration",
      "parentId": "domain:heritage-institutions",
      "aliases": [
        "restauration patrimoine"
      ]
    },
    {
      "id": "specialization-culture:cultural-access",
      "type": "specialization",
      "fr": "Accessibilité et participation culturelle",
      "en": "Cultural access and participation",
      "parentId": "domain:heritage-institutions",
      "aliases": [
        "accès culture"
      ]
    },
    {
      "id": "occupation-culture:dancer",
      "type": "occupation",
      "fr": "Danseur ou interprète du mouvement",
      "en": "Dancer or movement performer",
      "parentId": "domain:dance-movement",
      "aliases": [
        "danseur"
      ]
    },
    {
      "id": "occupation-culture:choreographer",
      "type": "occupation",
      "fr": "Chorégraphe",
      "en": "Choreographer",
      "parentId": "domain:dance-movement",
      "aliases": [
        "chorégraphe"
      ]
    },
    {
      "id": "occupation-culture:musician",
      "type": "occupation",
      "fr": "Musicien ou instrumentiste",
      "en": "Musician or instrumentalist",
      "parentId": "domain:music-sound",
      "aliases": [
        "musicien"
      ]
    },
    {
      "id": "occupation-culture:composer",
      "type": "occupation",
      "fr": "Compositeur ou arrangeur",
      "en": "Composer or arranger",
      "parentId": "domain:music-sound",
      "aliases": [
        "compositeur"
      ]
    },
    {
      "id": "occupation-culture:sound-engineer",
      "type": "occupation",
      "fr": "Ingénieur du son",
      "en": "Sound engineer",
      "parentId": "domain:music-sound",
      "aliases": [
        "ingénieur son"
      ]
    },
    {
      "id": "occupation-culture:visual-artist",
      "type": "occupation",
      "fr": "Artiste plasticien ou visuel",
      "en": "Visual artist",
      "parentId": "domain:visual-arts",
      "aliases": [
        "artiste plasticien"
      ]
    },
    {
      "id": "occupation-culture:photographer",
      "type": "occupation",
      "fr": "Photographe",
      "en": "Photographer",
      "parentId": "domain:visual-arts",
      "aliases": [
        "photographe"
      ]
    },
    {
      "id": "occupation-culture:producer",
      "type": "occupation",
      "fr": "Producteur de spectacle",
      "en": "Performance producer",
      "parentId": "domain:cultural-performance",
      "aliases": [
        "producteur spectacle"
      ]
    },
    {
      "id": "occupation-culture:stage-manager",
      "type": "occupation",
      "fr": "Régisseur de scène",
      "en": "Stage manager",
      "parentId": "domain:cultural-performance",
      "aliases": [
        "régisseur"
      ]
    },
    {
      "id": "occupation-culture:curator",
      "type": "occupation",
      "fr": "Conservateur ou commissaire d'exposition",
      "en": "Curator",
      "parentId": "domain:heritage-institutions",
      "aliases": [
        "conservateur musée"
      ]
    },
    {
      "id": "occupation-culture:heritage-restorer",
      "type": "occupation",
      "fr": "Restaurateur du patrimoine",
      "en": "Heritage conservator",
      "parentId": "domain:heritage-institutions",
      "aliases": [
        "restaurateur patrimoine"
      ]
    },
    {
      "id": "occupation-culture:cultural-mediator",
      "type": "occupation",
      "fr": "Médiateur culturel",
      "en": "Cultural mediator",
      "parentId": "domain:heritage-institutions",
      "aliases": [
        "médiateur culturel"
      ]
    },
    {
      "id": "activity-culture:artwork-creation",
      "type": "activity",
      "fr": "Création d'une œuvre artistique",
      "en": "Creating an artwork",
      "parentId": "domain:visual-arts",
      "aliases": [
        "création d'une œuvre artistique"
      ]
    },
    {
      "id": "activity-culture:rehearsal",
      "type": "activity",
      "fr": "Répétition d'un spectacle",
      "en": "Rehearsing a performance",
      "parentId": "domain:cultural-performance",
      "aliases": [
        "répétition d'un spectacle"
      ]
    },
    {
      "id": "activity-culture:concert-production",
      "type": "activity",
      "fr": "Production d'un concert",
      "en": "Producing a concert",
      "parentId": "domain:music-sound",
      "aliases": [
        "production d'un concert"
      ]
    },
    {
      "id": "activity-culture:exhibition-dissemination",
      "type": "activity",
      "fr": "Diffusion et présentation d'une exposition",
      "en": "Exhibition dissemination and presentation",
      "parentId": "domain:visual-arts",
      "aliases": [
        "diffusion d'une exposition"
      ]
    },
    {
      "id": "activity-culture:collection-conservation",
      "type": "activity",
      "fr": "Conservation d'une collection patrimoniale",
      "en": "Conservation of a heritage collection",
      "parentId": "domain:heritage-institutions",
      "aliases": [
        "conservation d'une collection patrimoniale"
      ]
    },
    {
      "id": "activity-culture:choreography-design",
      "type": "activity",
      "fr": "Conception d'une chorégraphie",
      "en": "Choreography design",
      "parentId": "domain:dance-movement",
      "aliases": [
        "conception chorégraphie"
      ]
    },
    {
      "id": "activity-culture:audio-recording",
      "type": "activity",
      "fr": "Enregistrement et mixage sonore",
      "en": "Audio recording and mixing",
      "parentId": "domain:music-sound",
      "aliases": [
        "enregistrement sonore"
      ]
    },
    {
      "id": "activity-culture:art-exhibition",
      "type": "activity",
      "fr": "Montage et scénographie d'une exposition",
      "en": "Exhibition installation and scenography",
      "parentId": "domain:visual-arts",
      "aliases": [
        "montage exposition"
      ]
    },
    {
      "id": "activity-culture:festival-programming",
      "type": "activity",
      "fr": "Programmation d'un festival culturel",
      "en": "Programming a cultural festival",
      "parentId": "domain:cultural-performance",
      "aliases": [
        "programmation festival"
      ]
    },
    {
      "id": "activity-culture:heritage-inventory",
      "type": "activity",
      "fr": "Inventaire et documentation du patrimoine",
      "en": "Heritage inventory and documentation",
      "parentId": "domain:heritage-institutions",
      "aliases": [
        "inventaire patrimoine"
      ]
    },
    {
      "id": "activity-culture:ticketing",
      "type": "activity",
      "fr": "Gestion de billetterie d'un événement culturel",
      "en": "Cultural event ticketing",
      "parentId": "domain:cultural-performance",
      "aliases": [
        "billetterie spectacle"
      ]
    },
    {
      "id": "activity-culture:public-mediation",
      "type": "activity",
      "fr": "Médiation auprès des publics",
      "en": "Audience engagement and mediation",
      "parentId": "domain:heritage-institutions",
      "aliases": [
        "médiation auprès du public"
      ]
    },
    {
      "id": "process-culture:artistic-creation-cycle",
      "type": "process",
      "fr": "Cycle de création et de production artistique",
      "en": "Artistic creation and production cycle",
      "parentId": "domain:visual-arts",
      "aliases": [
        "cycle création artistique"
      ]
    },
    {
      "id": "process-culture:show-production",
      "type": "process",
      "fr": "Cycle de préparation et production d'un spectacle",
      "en": "Show preparation and production cycle",
      "parentId": "domain:cultural-performance",
      "aliases": [
        "production spectacle"
      ]
    },
    {
      "id": "process-culture:concert-production",
      "type": "process",
      "fr": "Cycle de production et diffusion musicale",
      "en": "Music production and distribution cycle",
      "parentId": "domain:music-sound",
      "aliases": [
        "production concert"
      ]
    },
    {
      "id": "process-culture:exhibition-cycle",
      "type": "process",
      "fr": "Cycle de conception, montage et démontage d'exposition",
      "en": "Exhibition design and installation cycle",
      "parentId": "domain:visual-arts",
      "aliases": [
        "cycle exposition"
      ]
    },
    {
      "id": "process-culture:heritage-conservation",
      "type": "process",
      "fr": "Cycle de conservation et restauration patrimoniale",
      "en": "Heritage conservation and restoration cycle",
      "parentId": "domain:heritage-institutions",
      "aliases": [
        "cycle conservation patrimoine"
      ]
    },
    {
      "id": "process-culture:festival-cycle",
      "type": "process",
      "fr": "Cycle de programmation et réalisation d'un festival",
      "en": "Festival programming and delivery cycle",
      "parentId": "domain:cultural-performance",
      "aliases": [
        "cycle festival"
      ]
    },
    {
      "id": "process-culture:artist-career",
      "type": "process",
      "fr": "Parcours professionnel et diffusion d'un artiste",
      "en": "Artist career and distribution pathway",
      "parentId": "domain:dance-movement",
      "aliases": [
        "parcours artiste"
      ]
    },
    {
      "id": "process-culture:cultural-education",
      "type": "process",
      "fr": "Parcours de médiation et d'éducation culturelle",
      "en": "Cultural mediation and education pathway",
      "parentId": "domain:heritage-institutions",
      "aliases": [
        "parcours éducation culturelle"
      ]
    },
    {
      "id": "problem-culture:funding-instability",
      "type": "problem",
      "fr": "Instabilité du financement des projets artistiques",
      "en": "Unstable funding for artistic projects",
      "parentId": "domain:cultural-performance",
      "aliases": [
        "manque financement artistique"
      ]
    },
    {
      "id": "problem-culture:audience-access",
      "type": "problem",
      "fr": "Difficulté d'accès des publics aux activités culturelles",
      "en": "Barriers to cultural participation",
      "parentId": "domain:heritage-institutions",
      "aliases": [
        "accès culture difficile"
      ]
    },
    {
      "id": "problem-culture:production-coordination",
      "type": "problem",
      "fr": "Coordination insuffisante des productions artistiques",
      "en": "Poor coordination of artistic productions",
      "parentId": "domain:cultural-performance",
      "aliases": [
        "désorganisation production spectacle"
      ]
    },
    {
      "id": "problem-culture:heritage-deterioration",
      "type": "problem",
      "fr": "Dégradation ou perte de biens patrimoniaux",
      "en": "Deterioration or loss of heritage assets",
      "parentId": "domain:heritage-institutions",
      "aliases": [
        "dégradation patrimoine"
      ]
    },
    {
      "id": "problem-culture:artist-rights",
      "type": "problem",
      "fr": "Difficulté de gestion des droits d'auteur et voisins",
      "en": "Copyright and neighboring-rights management issues",
      "parentId": "domain:music-sound",
      "aliases": [
        "droits auteur"
      ]
    },
    {
      "id": "problem-culture:collection-traceability",
      "type": "problem",
      "fr": "Traçabilité insuffisante des collections",
      "en": "Insufficient collection traceability",
      "parentId": "domain:heritage-institutions",
      "aliases": [
        "inventaire musée incomplet"
      ]
    },
    {
      "id": "problem-culture:event-cancellation",
      "type": "problem",
      "fr": "Annulations et incidents d'événements culturels",
      "en": "Cultural event cancellations and incidents",
      "parentId": "domain:cultural-performance",
      "aliases": [
        "annulation spectacle"
      ]
    },
    {
      "id": "problem-culture:technical-failures",
      "type": "problem",
      "fr": "Défaillances techniques de scène ou de son",
      "en": "Stage or sound technical failures",
      "parentId": "domain:cultural-performance",
      "aliases": [
        "panne son spectacle"
      ]
    },
    {
      "id": "problem-culture:visibility-gaps",
      "type": "problem",
      "fr": "Manque de visibilité et de diffusion des artistes",
      "en": "Limited artist visibility and distribution",
      "parentId": "domain:dance-movement",
      "aliases": [
        "artiste manque visibilité"
      ]
    },
    {
      "id": "problem-culture:digital-preservation",
      "type": "problem",
      "fr": "Perte ou obsolescence des contenus culturels numériques",
      "en": "Loss or obsolescence of digital cultural content",
      "parentId": "domain:heritage-institutions",
      "aliases": [
        "perte archives numériques"
      ]
    },
    {
      "id": "resource-culture:artistic-portfolio",
      "type": "resource",
      "fr": "Portfolio et catalogue des œuvres",
      "en": "Artist portfolio and artwork catalog",
      "parentId": "domain:visual-arts",
      "aliases": [
        "portfolio artiste"
      ]
    },
    {
      "id": "resource-culture:production-schedule",
      "type": "resource",
      "fr": "Calendrier, fiche technique et plan de production",
      "en": "Schedule, technical rider and production plan",
      "parentId": "domain:cultural-performance",
      "aliases": [
        "fiche technique spectacle"
      ]
    },
    {
      "id": "resource-culture:music-library",
      "type": "resource",
      "fr": "Partitions, enregistrements et bibliothèques musicales",
      "en": "Scores, recordings and music libraries",
      "parentId": "domain:music-sound",
      "aliases": [
        "bibliothèque musicale"
      ]
    },
    {
      "id": "resource-culture:heritage-inventory",
      "type": "resource",
      "fr": "Inventaire et dossiers des collections patrimoniales",
      "en": "Heritage collection inventory and records",
      "parentId": "domain:heritage-institutions",
      "aliases": [
        "inventaire collections"
      ]
    },
    {
      "id": "resource-culture:copyright-records",
      "type": "resource",
      "fr": "Registres de droits et autorisations de diffusion",
      "en": "Rights and distribution authorization records",
      "parentId": "domain:music-sound",
      "aliases": [
        "droits diffusion"
      ]
    },
    {
      "id": "resource-culture:venue-equipment",
      "type": "resource",
      "fr": "Lieux, scènes et équipements culturels",
      "en": "Cultural venues, stages and equipment",
      "parentId": "domain:cultural-performance",
      "aliases": [
        "équipement scène"
      ]
    },
    {
      "id": "resource-culture:audience-data",
      "type": "resource",
      "fr": "Données de fréquentation et retours des publics",
      "en": "Audience attendance and feedback data",
      "parentId": "domain:heritage-institutions",
      "aliases": [
        "fréquentation musée"
      ]
    },
    {
      "id": "function-culture:artist-portfolio",
      "type": "function",
      "fr": "Gestion de portfolios et catalogues d'œuvres",
      "en": "Artist portfolio and artwork catalog management",
      "parentId": "domain:visual-arts",
      "aliases": [
        "gestion portfolio artiste"
      ]
    },
    {
      "id": "function-culture:event-production",
      "type": "function",
      "fr": "Gestion de production et équipes événementielles",
      "en": "Event production and crew management",
      "parentId": "domain:cultural-performance",
      "aliases": [
        "gestion production événement"
      ]
    },
    {
      "id": "function-culture:ticketing-management",
      "type": "function",
      "fr": "Billetterie et contrôle d'accès culturel",
      "en": "Cultural ticketing and access control",
      "parentId": "domain:cultural-performance",
      "aliases": [
        "billetterie culturelle"
      ]
    },
    {
      "id": "function-culture:collection-management",
      "type": "function",
      "fr": "Gestion et traçabilité des collections",
      "en": "Collection management and traceability",
      "parentId": "domain:heritage-institutions",
      "aliases": [
        "logiciel gestion musée"
      ]
    },
    {
      "id": "function-culture:rights-management",
      "type": "function",
      "fr": "Gestion des droits d'auteur et autorisations",
      "en": "Copyright and permissions management",
      "parentId": "domain:music-sound",
      "aliases": [
        "gestion droits auteur"
      ]
    },
    {
      "id": "function-culture:exhibition-planning",
      "type": "function",
      "fr": "Planification et scénographie des expositions",
      "en": "Exhibition planning and scenography",
      "parentId": "domain:visual-arts",
      "aliases": [
        "planification exposition"
      ]
    },
    {
      "id": "function-culture:cultural-archive",
      "type": "function",
      "fr": "Archivage et préservation des contenus culturels",
      "en": "Cultural content archiving and preservation",
      "parentId": "domain:heritage-institutions",
      "aliases": [
        "archivage culturel"
      ]
    },
    {
      "id": "indicator-culture:audience-attendance",
      "type": "indicator",
      "fr": "Fréquentation des événements et lieux culturels",
      "en": "Cultural event and venue attendance",
      "parentId": "domain:cultural-performance",
      "aliases": [
        "fréquentation événement"
      ]
    },
    {
      "id": "indicator-culture:artist-distribution",
      "type": "indicator",
      "fr": "Nombre de diffusions et opportunités des artistes",
      "en": "Artist distribution and opportunities",
      "parentId": "domain:dance-movement",
      "aliases": [
        "diffusion artiste"
      ]
    },
    {
      "id": "indicator-culture:production-on-time",
      "type": "indicator",
      "fr": "Taux de productions réalisées dans les délais",
      "en": "On-time production rate",
      "parentId": "domain:cultural-performance",
      "aliases": [
        "production dans délais"
      ]
    },
    {
      "id": "indicator-culture:collection-condition",
      "type": "indicator",
      "fr": "État de conservation des collections",
      "en": "Collection conservation condition",
      "parentId": "domain:heritage-institutions",
      "aliases": [
        "état conservation collection"
      ]
    },
    {
      "id": "indicator-culture:audience-satisfaction",
      "type": "indicator",
      "fr": "Satisfaction des publics culturels",
      "en": "Cultural audience satisfaction",
      "parentId": "domain:heritage-institutions",
      "aliases": [
        "satisfaction public"
      ]
    },
    {
      "id": "indicator-culture:rights-clearance",
      "type": "indicator",
      "fr": "Taux de contenus diffusés avec droits vérifiés",
      "en": "Share of content with cleared rights",
      "parentId": "domain:music-sound",
      "aliases": [
        "droits diffusion vérifiés"
      ]
    },
    {
      "id": "indicator-culture:project-budget-variance",
      "type": "indicator",
      "fr": "Écart entre budget prévisionnel et réalisé",
      "en": "Cultural project budget variance",
      "parentId": "domain:cultural-performance",
      "aliases": [
        "écart budget projet culturel"
      ]
    }
  ],
  "safetyNotes": [
    "Les œuvres, images, musiques, textes et performances sont soumis aux droits d'auteur, droits voisins, droits à l'image, contrats et licences ; aucune diffusion ne doit être présumée autorisée.",
    "Les collections patrimoniales et archives exigent provenance, conditions de conservation, inventaires, restrictions d'accès et procédures de prêt ou restauration documentées.",
    "Les événements culturels comportent des risques de sécurité, capacité, accessibilité, assurance et autorisations qui varient selon le lieu et la juridiction.",
    "Les contenus et données des artistes, publics et mineurs doivent être utilisés selon consentement, contrats et règles de confidentialité.",
    "Les recommandations de curation et de sélection artistique doivent rester explicables et ne pas se substituer aux décisions des responsables culturels."
  ]
},[
  [
    "activity-culture:rehearsal",
    "process-culture:show-production",
    "part_of"
  ],
  [
    "activity-culture:concert-production",
    "process-culture:concert-production",
    "part_of"
  ],
  [
    "function-culture:ticketing-management",
    "activity-culture:ticketing",
    "supports"
  ],
  [
    "function-culture:collection-management",
    "resource-culture:heritage-inventory",
    "manages"
  ],
  [
    "problem-culture:heritage-deterioration",
    "specialization-culture:heritage-conservation",
    "addressed_by"
  ],
  [
    "problem-culture:production-coordination",
    "function-culture:event-production",
    "may_be_mitigated_by"
  ],
  [
    "function-culture:rights-management",
    "resource-culture:copyright-records",
    "manages"
  ],
  [
    "activity-culture:public-mediation",
    "process-culture:cultural-education",
    "part_of"
  ]
]);
export const CULTURE_ARTS_FAMILY_CONCEPTS=result.familyConcepts;
export const CULTURE_ARTS_CATALOG=result.catalog;
export const CULTURE_ARTS_RELATIONSHIPS=result.relationships;
