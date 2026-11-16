import type { KnowledgeConcept, KnowledgeRelationship } from "./types";

const CREATED_AT = "2026-11-16T00:00:00.000Z";
const SOURCE_ID = "source:merkora-family-05-construction-built-environment-v1";
const FAMILY_ID = "family:construction-built-environment";

type Seed = {
  id: string; type: string; fr: string; en: string;
  frDefinition: string; enDefinition: string;
  parentId?: string; terms?: string[];
};

function makeConcept(seed: Seed): KnowledgeConcept {
  return {
    id: seed.id,
    canonicalKey: `merkora.construction-built-environment.${seed.type}.${seed.id.replace(/^[^:]+:/, "")}`,
    conceptType: seed.type,
    definitions: [
      { language: "fr", label: seed.fr, definition: seed.frDefinition },
      { language: "en", label: seed.en, definition: seed.enDefinition },
    ],
    terms: [
      { value: seed.fr, language: "fr", kind: "preferred" },
      { value: seed.en, language: "en", kind: "preferred" },
      ...(seed.terms ?? []).map((value) => ({ value, language: "fr", kind: "synonym" as const })),
    ],
    classifications: seed.parentId
      ? [{ classificationType: "universal-domain", parentConceptId: seed.parentId }]
      : [],
    attributes: [],
    relationships: [],
    scope: { global: true },
    lifecycle: { status: "validated", version: 1, createdAt: CREATED_AT, updatedAt: CREATED_AT },
    sources: [{
      id: SOURCE_ID,
      sourceType: "curated_domain_knowledge",
      label: "MerKora GDJ — Famille 05 Construction et cadre bâti, version 1",
    }],
    reliability: {
      evidenceLevel: "documented",
      reviewStatus: "not_reviewed",
      verificationNotes: [
        "Référentiel général à contextualiser selon le pays, les règles d'urbanisme, les normes, les contrats, les sols et les risques du projet. Ne remplace pas l'avis d'un professionnel habilité.",
      ],
    },
  };
}

const SUBDOMAINS: Seed[] = [
  { id: "subdomain-con:architectural-design", type: "subdomain", fr: "Conception architecturale", en: "Architectural design", frDefinition: "Étude des usages, espaces, formes et contraintes pour concevoir des bâtiments et espaces construits.", enDefinition: "Study of uses, spaces, forms and constraints to design buildings and built spaces.", parentId: "domain:architecture", terms: ["conception de bâtiment"] },
  { id: "subdomain-con:urban-planning", type: "subdomain", fr: "Urbanisme et aménagement", en: "Urban planning and development", frDefinition: "Organisation de l'utilisation des sols, des espaces publics, des réseaux et du développement urbain.", enDefinition: "Organization of land use, public spaces, networks and urban development.", parentId: "domain:architecture", terms: ["aménagement urbain"] },
  { id: "subdomain-con:land-surveying", type: "subdomain", fr: "Topographie et géomatique de chantier", en: "Construction surveying and geomatics", frDefinition: "Mesure, représentation et implantation des terrains, ouvrages et limites utiles aux projets.", enDefinition: "Measurement, representation and setting out of land, structures and boundaries for projects.", parentId: "domain:civil-engineering", terms: ["levé topographique", "implantation topographique"] },
  { id: "subdomain-con:geotechnical-engineering", type: "subdomain", fr: "Géotechnique et études de sol", en: "Geotechnical and soil engineering", frDefinition: "Étude des sols et roches pour apprécier leur comportement et les conditions de fondation.", enDefinition: "Study of soil and rock behavior and foundation conditions.", parentId: "domain:civil-engineering", terms: ["étude géotechnique", "étude de sol"] },
  { id: "subdomain-con:structural-engineering", type: "subdomain", fr: "Ingénierie des structures", en: "Structural engineering", frDefinition: "Analyse et conception de structures porteuses soumises aux charges et actions prévues.", enDefinition: "Analysis and design of load-bearing structures under expected loads and actions.", parentId: "domain:civil-engineering", terms: ["calcul de structure"] },
  { id: "subdomain-con:roads-bridges", type: "subdomain", fr: "Routes, ponts et ouvrages d'art", en: "Roads, bridges and civil structures", frDefinition: "Conception, réalisation, inspection et entretien des routes, ponts et ouvrages associés.", enDefinition: "Design, construction, inspection and maintenance of roads, bridges and related structures.", parentId: "domain:public-works", terms: ["infrastructures routières"] },
  { id: "subdomain-con:water-infrastructure", type: "subdomain", fr: "Infrastructures hydrauliques et assainissement", en: "Water infrastructure and sanitation", frDefinition: "Réalisation des réseaux d'eau, drainage, assainissement et ouvrages hydrauliques.", enDefinition: "Construction of water networks, drainage, sanitation and hydraulic structures.", parentId: "domain:public-works" },
  { id: "subdomain-con:earthworks", type: "subdomain", fr: "Terrassement et préparation des sites", en: "Earthworks and site preparation", frDefinition: "Déblai, remblai, nivellement, compactage et préparation des emprises de travaux.", enDefinition: "Excavation, filling, grading, compaction and preparation of construction sites.", parentId: "domain:public-works", terms: ["terrassement"] },
  { id: "subdomain-con:building-site-management", type: "subdomain", fr: "Gestion et conduite de chantier", en: "Building site management", frDefinition: "Organisation des équipes, travaux, ressources, délais, coûts, sécurité et coordination d'un chantier.", enDefinition: "Organization of teams, works, resources, schedule, cost, safety and coordination on a construction site.", parentId: "domain:building-construction", terms: ["conduite de travaux", "suivi de chantier"] },
  { id: "subdomain-con:building-structure", type: "subdomain", fr: "Gros œuvre et structure du bâtiment", en: "Building shell and structural works", frDefinition: "Réalisation des fondations, éléments porteurs, planchers, murs et enveloppes structurelles.", enDefinition: "Construction of foundations, load-bearing elements, floors, walls and structural envelope.", parentId: "domain:building-construction", terms: ["gros œuvre"] },
  { id: "subdomain-con:finishing-works", type: "subdomain", fr: "Second œuvre et finitions", en: "Building fit-out and finishing", frDefinition: "Réalisation des cloisons, revêtements, menuiseries, peintures et finitions intérieures ou extérieures.", enDefinition: "Installation of partitions, finishes, joinery, painting and interior or exterior finishing.", parentId: "domain:building-construction", terms: ["second œuvre"] },
  { id: "subdomain-con:building-services", type: "subdomain", fr: "Lots techniques du bâtiment", en: "Building technical systems", frDefinition: "Conception et installation des systèmes électriques, plomberie, ventilation, climatisation et sécurité.", enDefinition: "Design and installation of electrical, plumbing, ventilation, air-conditioning and safety systems.", parentId: "domain:building-construction", terms: ["fluides du bâtiment", "CVC"] },
  { id: "subdomain-con:building-renovation", type: "subdomain", fr: "Rénovation et réhabilitation", en: "Building renovation and rehabilitation", frDefinition: "Transformation, remise en état, adaptation ou amélioration de bâtiments existants.", enDefinition: "Transformation, restoration, adaptation or improvement of existing buildings.", parentId: "domain:building-construction" },
  { id: "subdomain-con:quantity-surveying", type: "subdomain", fr: "Économie de la construction et métrés", en: "Quantity surveying and construction economics", frDefinition: "Estimation des quantités, coûts, budgets, décomptes et variations des travaux.", enDefinition: "Estimation of quantities, costs, budgets, valuations and variations of works.", parentId: "domain:building-construction", terms: ["métré", "devis quantitatif"] },
  { id: "subdomain-con:construction-procurement", type: "subdomain", fr: "Achats et approvisionnement de chantier", en: "Construction procurement and supply", frDefinition: "Planification et acquisition des matériaux, équipements, locations et prestations nécessaires au chantier.", enDefinition: "Planning and purchasing materials, equipment, rentals and services required by a construction site.", parentId: "domain:building-construction" },
  { id: "subdomain-con:construction-quality", type: "subdomain", fr: "Qualité et contrôle des travaux", en: "Construction quality and inspection", frDefinition: "Contrôle de la conformité des matériaux, méthodes d'exécution et ouvrages aux exigences contractuelles et techniques.", enDefinition: "Inspection of materials, execution methods and works against contractual and technical requirements.", parentId: "domain:building-construction" },
  { id: "subdomain-con:construction-safety", type: "subdomain", fr: "Santé et sécurité sur chantier", en: "Construction occupational health and safety", frDefinition: "Prévention des accidents, chutes, effondrements, expositions et autres risques liés aux travaux.", enDefinition: "Prevention of accidents, falls, collapses, exposures and other worksite hazards.", parentId: "domain:building-construction" },
  { id: "subdomain-con:facility-operations", type: "subdomain", fr: "Exploitation et maintenance immobilière", en: "Facilities operations and maintenance", frDefinition: "Gestion des équipements, interventions, contrats, consommations et services d'un bâtiment en exploitation.", enDefinition: "Management of equipment, work orders, contracts, utilities and services in an operating building.", parentId: "domain:facility-management" },
  { id: "subdomain-con:property-asset-management", type: "subdomain", fr: "Gestion technique du patrimoine immobilier", en: "Real estate technical asset management", frDefinition: "Suivi de l'état, de la valeur d'usage, des travaux et du cycle de vie des actifs immobiliers.", enDefinition: "Monitoring condition, use value, works and lifecycle of real estate assets.", parentId: "domain:facility-management" },
  { id: "subdomain-con:building-energy-performance", type: "subdomain", fr: "Performance énergétique et environnementale des bâtiments", en: "Building energy and environmental performance", frDefinition: "Évaluation et amélioration des consommations, du confort et des impacts environnementaux des bâtiments.", enDefinition: "Assessment and improvement of building energy use, comfort and environmental impacts.", parentId: "domain:facility-management" },
];

const SEEDS: Seed[] = [
  ...SUBDOMAINS,
  { id: "specialization-con:sustainable-construction", type: "specialization", fr: "Construction durable", en: "Sustainable construction", frDefinition: "Approche intégrant les impacts environnementaux, sociaux et économiques sur le cycle de vie d'un ouvrage.", enDefinition: "Approach integrating environmental, social and economic impacts over a structure's lifecycle.", parentId: "domain:building-construction" },
  { id: "specialization-con:building-information-modeling", type: "specialization", fr: "Maquette numérique du bâtiment (BIM)", en: "Building information modeling (BIM)", frDefinition: "Méthode de production et de coordination d'informations structurées sur un ouvrage durant son cycle de vie.", enDefinition: "Method for producing and coordinating structured information about a built asset throughout its lifecycle.", parentId: "domain:architecture", terms: ["maquette numérique", "BIM"] },
  { id: "specialization-con:modular-construction", type: "specialization", fr: "Construction modulaire et préfabriquée", en: "Modular and prefabricated construction", frDefinition: "Réalisation d'éléments ou modules en atelier puis assemblage sur le site.", enDefinition: "Production of elements or modules off-site followed by assembly on site.", parentId: "domain:building-construction" },
  { id: "specialization-con:disaster-resilient-construction", type: "specialization", fr: "Construction résiliente aux aléas", en: "Disaster-resilient construction", frDefinition: "Conception et réalisation visant à réduire la vulnérabilité des ouvrages face aux aléas pertinents.", enDefinition: "Design and construction intended to reduce building vulnerability to relevant hazards.", parentId: "domain:civil-engineering" },

  { id: "occupation-con:architect", type: "occupation", fr: "Architecte", en: "Architect", frDefinition: "Professionnel qui conçoit des projets architecturaux et coordonne les choix spatiaux et fonctionnels dans son champ d'habilitation.", enDefinition: "Professional designing architectural projects and coordinating spatial and functional choices within their authorization.", parentId: "domain:architecture" },
  { id: "occupation-con:civil-engineer", type: "occupation", fr: "Ingénieur en génie civil", en: "Civil engineer", frDefinition: "Professionnel qui étudie et conçoit des infrastructures et ouvrages de génie civil.", enDefinition: "Professional who studies and designs civil engineering infrastructure and structures.", parentId: "domain:civil-engineering" },
  { id: "occupation-con:quantity-surveyor", type: "occupation", fr: "Métreur ou économiste de la construction", en: "Quantity surveyor", frDefinition: "Professionnel qui mesure les ouvrages et estime, suit ou contrôle les coûts des travaux.", enDefinition: "Professional measuring works and estimating, monitoring or controlling construction costs.", parentId: "domain:building-construction", terms: ["métreur"] },
  { id: "occupation-con:site-manager", type: "occupation", fr: "Conducteur de travaux", en: "Construction site manager", frDefinition: "Professionnel qui prépare, coordonne et suit l'exécution des travaux sur un ou plusieurs chantiers.", enDefinition: "Professional preparing, coordinating and monitoring execution of works on one or more sites.", parentId: "domain:building-construction" },
  { id: "occupation-con:site-supervisor", type: "occupation", fr: "Chef de chantier", en: "Site foreman", frDefinition: "Responsable de proximité qui organise les équipes et contrôle l'exécution quotidienne des travaux.", enDefinition: "Front-line supervisor organizing crews and overseeing daily execution of works.", parentId: "domain:building-construction" },
  { id: "occupation-con:surveyor", type: "occupation", fr: "Géomètre-topographe", en: "Land surveyor", frDefinition: "Professionnel qui réalise des mesures et implantations topographiques selon les compétences et règles applicables.", enDefinition: "Professional performing surveys and setting out according to applicable competencies and rules.", parentId: "domain:civil-engineering" },
  { id: "occupation-con:building-electrician", type: "occupation", fr: "Électricien bâtiment", en: "Building electrician", frDefinition: "Professionnel qui installe, vérifie et entretient les installations électriques des bâtiments.", enDefinition: "Professional installing, inspecting and maintaining building electrical systems.", parentId: "domain:building-construction" },
  { id: "occupation-con:facility-manager", type: "occupation", fr: "Responsable de maintenance immobilière", en: "Facilities manager", frDefinition: "Professionnel qui organise l'exploitation, la maintenance et les services associés aux bâtiments.", enDefinition: "Professional organizing building operations, maintenance and related services.", parentId: "domain:facility-management" },

  { id: "activity-con:site-progress-monitoring", type: "activity", fr: "Suivi de l'avancement du chantier", en: "Construction site progress monitoring", frDefinition: "Observation et enregistrement de l'avancement réel des travaux par rapport au planning.", enDefinition: "Observation and recording of actual work progress against the schedule.", parentId: "domain:building-construction", terms: ["suivi de chantier", "avancement des travaux"] },
  { id: "activity-con:quantity-takeoff", type: "activity", fr: "Réalisation d'un métré", en: "Quantity takeoff", frDefinition: "Mesure et calcul des quantités d'ouvrages à réaliser à partir des plans et relevés.", enDefinition: "Measurement and calculation of work quantities from drawings and surveys.", parentId: "domain:building-construction", terms: ["métrage"] },
  { id: "activity-con:site-setting-out", type: "activity", fr: "Implantation des ouvrages", en: "Construction setting out", frDefinition: "Report sur le terrain des axes, niveaux et positions prévus dans les documents du projet.", enDefinition: "Transfer of planned axes, levels and positions from project documents onto the site.", parentId: "domain:civil-engineering" },
  { id: "activity-con:concrete-placement", type: "activity", fr: "Mise en œuvre du béton", en: "Concrete placement", frDefinition: "Préparation, transport, coulage, vibration et cure du béton selon les spécifications du projet.", enDefinition: "Preparation, transport, placement, compaction and curing of concrete according to project specifications.", parentId: "domain:building-construction" },
  { id: "activity-con:construction-inspection", type: "activity", fr: "Inspection des travaux", en: "Construction work inspection", frDefinition: "Vérification documentée des travaux exécutés et de leurs critères de conformité.", enDefinition: "Documented inspection of completed work and its conformity criteria.", parentId: "domain:building-construction" },
  { id: "activity-con:material-receiving", type: "activity", fr: "Réception des matériaux de chantier", en: "Construction material receiving", frDefinition: "Contrôle quantitatif et documentaire des matériaux livrés avant leur stockage ou utilisation.", enDefinition: "Quantity and document checks on delivered materials before storage or use.", parentId: "domain:building-construction" },
  { id: "activity-con:maintenance-work-order", type: "activity", fr: "Traitement d'une demande de maintenance immobilière", en: "Facilities maintenance work order", frDefinition: "Enregistrement, qualification, affectation et suivi d'une demande d'intervention sur un bâtiment.", enDefinition: "Recording, qualification, assignment and tracking of a building maintenance request.", parentId: "domain:facility-management" },
  { id: "activity-con:handover-inspection", type: "activity", fr: "Inspection préalable à la réception d'un ouvrage", en: "Pre-handover building inspection", frDefinition: "Examen de l'ouvrage et consignation des réserves avant sa réception contractuelle.", enDefinition: "Inspection of a structure and recording of outstanding items before contractual handover.", parentId: "domain:building-construction" },

  { id: "process-con:construction-project-lifecycle", type: "process", fr: "Cycle de vie d'un projet de construction", en: "Construction project lifecycle", frDefinition: "Études, conception, autorisations, consultation, préparation, exécution, réception et suivi d'un projet.", enDefinition: "Studies, design, approvals, procurement, preparation, execution, handover and follow-up of a project.", parentId: "domain:building-construction" },
  { id: "process-con:site-execution-cycle", type: "process", fr: "Processus d'exécution de chantier", en: "Construction site execution process", frDefinition: "Préparation, mobilisation, planification, exécution, contrôle, coordination et clôture des travaux.", enDefinition: "Preparation, mobilization, scheduling, execution, inspection, coordination and closeout of works.", parentId: "domain:building-construction" },
  { id: "process-con:change-order-management", type: "process", fr: "Gestion des modifications et travaux supplémentaires", en: "Change order and variation management", frDefinition: "Demande, analyse, chiffrage, approbation, exécution et traçabilité des modifications de travaux.", enDefinition: "Request, analysis, costing, approval, execution and traceability of work changes.", parentId: "domain:building-construction" },
  { id: "process-con:construction-handover", type: "process", fr: "Processus de réception et livraison d'ouvrage", en: "Construction handover process", frDefinition: "Contrôles, réserves, levée des réserves, remise des documents et transfert de responsabilité.", enDefinition: "Inspections, outstanding items, resolution, document handover and transfer of responsibility.", parentId: "domain:building-construction" },
  { id: "process-con:facility-maintenance-cycle", type: "process", fr: "Cycle de maintenance d'un bâtiment", en: "Building maintenance cycle", frDefinition: "Signalement, diagnostic, planification, intervention, contrôle et clôture d'une opération de maintenance.", enDefinition: "Reporting, diagnosis, planning, intervention, inspection and closure of a maintenance operation.", parentId: "domain:facility-management" },
  { id: "process-con:construction-procurement-cycle", type: "process", fr: "Cycle d'approvisionnement de chantier", en: "Construction procurement cycle", frDefinition: "Expression du besoin, consultation, commande, livraison, réception, stockage et rapprochement.", enDefinition: "Requirement, sourcing, ordering, delivery, receipt, storage and reconciliation.", parentId: "domain:building-construction" },

  { id: "problem-con:construction-delay", type: "problem", fr: "Retard de chantier", en: "Construction delay", frDefinition: "Écart entre l'avancement ou la date réelle des travaux et les échéances planifiées ou contractuelles.", enDefinition: "Difference between actual work progress or completion and planned or contractual milestones.", parentId: "domain:building-construction", terms: ["retard des travaux", "chantier en retard"] },
  { id: "problem-con:construction-cost-overrun", type: "problem", fr: "Dépassement du budget de construction", en: "Construction cost overrun", frDefinition: "Coût prévisionnel ou final supérieur au budget de référence selon le périmètre défini.", enDefinition: "Forecast or final cost exceeding the reference budget under the defined scope.", parentId: "domain:building-construction" },
  { id: "problem-con:material-shortage", type: "problem", fr: "Rupture de matériaux sur chantier", en: "Construction material shortage", frDefinition: "Indisponibilité d'un matériau ou équipement nécessaire à la poursuite des travaux.", enDefinition: "Unavailability of material or equipment required to continue the works.", parentId: "domain:building-construction" },
  { id: "problem-con:construction-defects", type: "problem", fr: "Malfaçons et défauts d'exécution", en: "Construction defects and poor workmanship", frDefinition: "Non-conformités ou défauts affectant les travaux réalisés par rapport aux exigences applicables.", enDefinition: "Nonconformities or defects in completed works against applicable requirements.", parentId: "domain:building-construction", terms: ["malfaçons"] },
  { id: "problem-con:site-safety-incident", type: "problem", fr: "Accident ou risque de sécurité sur chantier", en: "Construction site safety incident or risk", frDefinition: "Événement ou situation exposant les personnes à un risque de blessure ou d'atteinte à la santé.", enDefinition: "Event or condition exposing people to injury or harm to health.", parentId: "domain:building-construction" },
  { id: "problem-con:design-coordination-conflict", type: "problem", fr: "Conflit ou incohérence entre plans et lots techniques", en: "Design and building-services coordination conflict", frDefinition: "Incompatibilité entre documents, dimensions, ouvrages ou interventions de différents lots.", enDefinition: "Incompatibility between documents, dimensions, structures or work packages.", parentId: "domain:architecture" },
  { id: "problem-con:building-maintenance-backlog", type: "problem", fr: "Accumulation des demandes de maintenance immobilière", en: "Building maintenance backlog", frDefinition: "Accumulation d'interventions non réalisées ou en attente dans le patrimoine immobilier.", enDefinition: "Accumulation of outstanding or pending maintenance work across a property portfolio.", parentId: "domain:facility-management" },

  { id: "resource-con:construction-materials", type: "resource", fr: "Matériaux de construction", en: "Construction materials", frDefinition: "Matériaux et produits utilisés pour réaliser les ouvrages et leurs finitions.", enDefinition: "Materials and products used to build structures and their finishes.", parentId: "domain:building-construction" },
  { id: "resource-con:construction-equipment", type: "resource", fr: "Engins et équipements de chantier", en: "Construction plant and equipment", frDefinition: "Machines, engins, outils et équipements mobilisés pour exécuter les travaux.", enDefinition: "Machines, plant, tools and equipment used to perform construction work.", parentId: "domain:building-construction" },
  { id: "resource-con:construction-plans", type: "resource", fr: "Plans et documents d'exécution", en: "Construction drawings and execution documents", frDefinition: "Plans, détails, spécifications, notes et documents nécessaires à l'exécution et au contrôle.", enDefinition: "Drawings, details, specifications, notes and documents needed for execution and inspection.", parentId: "domain:architecture" },
  { id: "resource-con:construction-labor", type: "resource", fr: "Main-d'œuvre de chantier", en: "Construction workforce", frDefinition: "Personnel et équipes mobilisés pour les études, travaux, contrôles et services du projet.", enDefinition: "Personnel and crews mobilized for project studies, works, inspections and services.", parentId: "domain:building-construction" },
  { id: "resource-con:real-estate-asset", type: "resource", fr: "Actif immobilier bâti", en: "Built real estate asset", frDefinition: "Bâtiment ou ouvrage existant faisant l'objet d'une exploitation, d'une gestion ou d'une maintenance.", enDefinition: "Existing building or structure operated, managed or maintained.", parentId: "domain:facility-management" },

  { id: "function-con:construction-project-management", type: "function", fr: "Gestion de projets et chantiers", en: "Construction project and site management", frDefinition: "Suivi des projets, tâches, intervenants, jalons, risques, documents et décisions de chantier.", enDefinition: "Tracking construction projects, tasks, stakeholders, milestones, risks, documents and decisions.", parentId: "domain:building-construction" },
  { id: "function-con:construction-cost-estimation", type: "function", fr: "Métrés, devis et suivi budgétaire des travaux", en: "Quantity takeoff, estimating and construction cost control", frDefinition: "Calcul des quantités, estimation des coûts, suivi des engagements, dépenses et écarts.", enDefinition: "Calculation of quantities, cost estimating and monitoring of commitments, expenses and variances.", parentId: "domain:building-construction" },
  { id: "function-con:construction-material-inventory", type: "function", fr: "Gestion des matériaux et stocks de chantier", en: "Construction materials and site inventory", frDefinition: "Suivi des entrées, sorties, transferts, consommations et niveaux de stock des matériaux.", enDefinition: "Tracking receipts, issues, transfers, consumption and stock levels of materials.", parentId: "domain:building-construction" },
  { id: "function-con:construction-quality-safety", type: "function", fr: "Contrôle qualité, sécurité et réserves", en: "Construction quality, safety and punch-list management", frDefinition: "Enregistrement des inspections, non-conformités, incidents, mesures correctives et réserves.", enDefinition: "Recording inspections, nonconformities, incidents, corrective actions and outstanding items.", parentId: "domain:building-construction" },
  { id: "function-con:facility-maintenance-management", type: "function", fr: "Gestion du patrimoine et de la maintenance immobilière", en: "Property and facilities maintenance management", frDefinition: "Gestion des bâtiments, équipements, interventions, contrats, échéances et historiques.", enDefinition: "Management of buildings, equipment, work orders, contracts, due dates and histories.", parentId: "domain:facility-management" },

  { id: "indicator-con:construction-progress", type: "indicator", fr: "Taux d'avancement des travaux", en: "Construction work progress rate", frDefinition: "Mesure de l'avancement réalisé selon une méthode et un périmètre explicitement définis.", enDefinition: "Measure of completed progress under an explicitly defined method and scope.", parentId: "domain:building-construction" },
  { id: "indicator-con:construction-cost-variance", type: "indicator", fr: "Écart budgétaire des travaux", en: "Construction budget variance", frDefinition: "Différence entre le coût réel ou prévisionnel et le budget de référence.", enDefinition: "Difference between actual or forecast cost and the reference budget.", parentId: "domain:building-construction" },
  { id: "indicator-con:construction-schedule-variance", type: "indicator", fr: "Écart de délai du chantier", en: "Construction schedule variance", frDefinition: "Écart entre l'avancement ou les dates constatés et le calendrier de référence.", enDefinition: "Difference between actual progress or dates and the reference schedule.", parentId: "domain:building-construction" },
  { id: "indicator-con:construction-defect-rate", type: "indicator", fr: "Taux de non-conformités des travaux", en: "Construction work nonconformity rate", frDefinition: "Part des contrôles ou éléments inspectés présentant une non-conformité selon les critères retenus.", enDefinition: "Share of inspections or items found nonconforming under the selected criteria.", parentId: "domain:building-construction" },
  { id: "indicator-con:facility-maintenance-completion", type: "indicator", fr: "Taux de réalisation des interventions de maintenance", en: "Facilities maintenance completion rate", frDefinition: "Part des interventions planifiées ou demandées clôturées dans le périmètre et la période définis.", enDefinition: "Share of planned or requested work orders closed within the defined scope and period.", parentId: "domain:facility-management" },
];

export const CONSTRUCTION_BUILT_ENVIRONMENT_CATALOG = SEEDS.map(makeConcept);
export const CONSTRUCTION_BUILT_ENVIRONMENT_SUBDOMAINS = CONSTRUCTION_BUILT_ENVIRONMENT_CATALOG.filter((item) => item.conceptType === "subdomain");
export const CONSTRUCTION_BUILT_ENVIRONMENT_FAMILY_ID = FAMILY_ID;
export const CONSTRUCTION_BUILT_ENVIRONMENT_RELATIONSHIPS: KnowledgeRelationship[] = [
  ...SUBDOMAINS.map((seed) => ({
    id: `rel:family-05-parent:${seed.id}`,
    sourceConceptId: seed.id,
    targetConceptId: seed.parentId!,
    predicate: "belongs_to_domain",
    status: "validated" as const,
    confidence: 1,
    sourceIds: [SOURCE_ID],
    version: 1,
  })),
  ...SEEDS.filter((seed) => seed.type === "occupation").map((seed) => ({
    id: `rel:family-05-occupation:${seed.id}`,
    sourceConceptId: seed.id,
    targetConceptId: FAMILY_ID,
    predicate: "works_in_family",
    status: "validated" as const,
    confidence: 1,
    sourceIds: [SOURCE_ID],
    version: 1,
  })),
  ...SEEDS.filter((seed) => ["activity", "process", "problem", "resource", "function", "indicator"].includes(seed.type)).map((seed) => ({
    id: `rel:family-05-concept:${seed.id}`,
    sourceConceptId: seed.id,
    targetConceptId: seed.parentId ?? FAMILY_ID,
    predicate: "related_to_construction_domain",
    status: "validated" as const,
    confidence: 1,
    sourceIds: [SOURCE_ID],
    version: 1,
  })),
];
