import type { KnowledgeConcept, KnowledgeRelationship } from "./types";

const CREATED_AT = "2026-11-16T00:00:00.000Z";
const SOURCE_ID = "source:merkora-family-04-industry-manufacturing-v1";
const FAMILY_ID = "family:manufacturing-industry";

type Seed = {
  id: string;
  type: string;
  fr: string;
  en: string;
  frDefinition: string;
  enDefinition: string;
  parentId?: string;
  terms?: string[];
};

function makeConcept(seed: Seed): KnowledgeConcept {
  return {
    id: seed.id,
    canonicalKey: `merkora.industry-manufacturing.${seed.type}.${seed.id.replace(/^[^:]+:/, "")}`,
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
      label: "MerKora GDJ — Famille 04 Industrie et fabrication, version 1",
    }],
    reliability: {
      evidenceLevel: "documented",
      reviewStatus: "not_reviewed",
      verificationNotes: [
        "Référentiel initial à contextualiser selon les procédés, les normes, les risques, les équipements et les réglementations du pays et du secteur. Les paramètres techniques ne remplacent pas une validation par un spécialiste habilité.",
      ],
    },
  };
}

const SUBDOMAINS: Seed[] = [
  { id: "subdomain-ind:industrial-engineering", type: "subdomain", fr: "Ingénierie industrielle", en: "Industrial engineering", frDefinition: "Conception et amélioration des systèmes de production, des flux, des postes et des moyens industriels.", enDefinition: "Design and improvement of production systems, flows, workstations and industrial resources.", parentId: "domain:industrial-production", terms: ["organisation industrielle"] },
  { id: "subdomain-ind:production-planning", type: "subdomain", fr: "Planification et ordonnancement de production", en: "Production planning and scheduling", frDefinition: "Prévision des besoins, planification des charges, ordonnancement des opérations et suivi des délais de fabrication.", enDefinition: "Forecasting needs, planning capacity, scheduling operations and monitoring manufacturing lead times.", parentId: "domain:industrial-production", terms: ["ordonnancement", "planning atelier"] },
  { id: "subdomain-ind:industrial-process-engineering", type: "subdomain", fr: "Ingénierie des procédés industriels", en: "Industrial process engineering", frDefinition: "Définition, dimensionnement, maîtrise et amélioration des procédés de transformation et de fabrication.", enDefinition: "Definition, sizing, control and improvement of transformation and manufacturing processes.", parentId: "domain:industrial-production" },
  { id: "subdomain-ind:assembly-production", type: "subdomain", fr: "Assemblage industriel", en: "Industrial assembly", frDefinition: "Assemblage de pièces et composants en sous-ensembles ou produits finis selon des gammes définies.", enDefinition: "Assembly of parts and components into subassemblies or finished products using defined work instructions.", parentId: "domain:industrial-production", terms: ["montage industriel"] },
  { id: "subdomain-ind:machining", type: "subdomain", fr: "Usinage et fabrication mécanique", en: "Machining and mechanical manufacturing", frDefinition: "Enlèvement de matière et fabrication de pièces par tournage, fraisage, perçage, rectification ou procédés apparentés.", enDefinition: "Material removal and part manufacturing by turning, milling, drilling, grinding and related processes.", parentId: "domain:mechanical-engineering", terms: ["tournage", "fraisage", "atelier d'usinage"] },
  { id: "subdomain-ind:welding-metalwork", type: "subdomain", fr: "Soudage et chaudronnerie", en: "Welding and metal fabrication", frDefinition: "Assemblage, découpe, formage et fabrication d'ouvrages métalliques selon des plans et procédures.", enDefinition: "Joining, cutting, forming and fabrication of metal structures according to drawings and procedures.", parentId: "domain:mechanical-engineering", terms: ["métallerie", "travail des métaux"] },
  { id: "subdomain-ind:industrial-maintenance", type: "subdomain", fr: "Maintenance industrielle", en: "Industrial maintenance", frDefinition: "Inspection, entretien, diagnostic, réparation et amélioration de la disponibilité des équipements industriels.", enDefinition: "Inspection, servicing, diagnosis, repair and improvement of industrial equipment availability.", parentId: "domain:mechanical-engineering" },
  { id: "subdomain-ind:industrial-automation", type: "subdomain", fr: "Automatisation industrielle", en: "Industrial automation", frDefinition: "Automatisation des opérations par capteurs, automates, actionneurs, supervision et systèmes de commande.", enDefinition: "Automation of operations using sensors, programmable controllers, actuators, supervision and control systems.", parentId: "domain:electrical-engineering", terms: ["automatisme industriel"] },
  { id: "subdomain-ind:robotics", type: "subdomain", fr: "Robotique industrielle", en: "Industrial robotics", frDefinition: "Intégration, programmation, exploitation et maintenance de robots et cellules robotisées industrielles.", enDefinition: "Integration, programming, operation and maintenance of industrial robots and robotic cells.", parentId: "domain:electrical-engineering" },
  { id: "subdomain-ind:industrial-electrical-systems", type: "subdomain", fr: "Installations électriques industrielles", en: "Industrial electrical systems", frDefinition: "Conception, installation, contrôle et maintenance des réseaux, armoires, moteurs et protections électriques industriels.", enDefinition: "Design, installation, inspection and maintenance of industrial networks, panels, motors and electrical protection.", parentId: "domain:electrical-engineering" },
  { id: "subdomain-ind:industrial-electronics", type: "subdomain", fr: "Électronique industrielle", en: "Industrial electronics", frDefinition: "Conception, intégration, diagnostic et maintenance des circuits et équipements électroniques utilisés dans l'industrie.", enDefinition: "Design, integration, diagnosis and maintenance of electronic circuits and equipment used in industry.", parentId: "domain:electronics" },
  { id: "subdomain-ind:embedded-control-systems", type: "subdomain", fr: "Systèmes embarqués et contrôle-commande", en: "Embedded and control systems", frDefinition: "Développement et intégration de systèmes électroniques et logiciels pilotant des machines et équipements.", enDefinition: "Development and integration of electronic and software systems controlling machines and equipment.", parentId: "domain:electronics" },
  { id: "subdomain-ind:industrial-instrumentation", type: "subdomain", fr: "Instrumentation et métrologie industrielles", en: "Industrial instrumentation and metrology", frDefinition: "Mesure, étalonnage, vérification et maîtrise des instruments et grandeurs utilisés dans les procédés industriels.", enDefinition: "Measurement, calibration, verification and control of instruments and quantities used in industrial processes.", parentId: "domain:electronics" },
  { id: "subdomain-ind:textile-spinning-weaving", type: "subdomain", fr: "Filature et tissage", en: "Spinning and weaving", frDefinition: "Transformation des fibres en fils puis en étoffes par des opérations de filature et de tissage.", enDefinition: "Transformation of fibres into yarns and fabrics through spinning and weaving operations.", parentId: "domain:textile-fashion" },
  { id: "subdomain-ind:textile-dyeing-finishing", type: "subdomain", fr: "Teinture et ennoblissement textile", en: "Textile dyeing and finishing", frDefinition: "Traitement des textiles pour modifier leur couleur, leur aspect, leur toucher ou leurs propriétés.", enDefinition: "Treatment of textiles to change colour, appearance, hand feel or performance properties.", parentId: "domain:textile-fashion" },
  { id: "subdomain-ind:garment-manufacturing", type: "subdomain", fr: "Confection et fabrication de vêtements", en: "Garment manufacturing", frDefinition: "Préparation, coupe, assemblage, finition et contrôle de vêtements et articles textiles.", enDefinition: "Preparation, cutting, assembly, finishing and inspection of garments and textile articles.", parentId: "domain:textile-fashion", terms: ["confection textile", "atelier de couture industrielle"] },
  { id: "subdomain-ind:industrial-quality", type: "subdomain", fr: "Qualité et contrôle industriel", en: "Industrial quality and inspection", frDefinition: "Contrôle des matières, opérations et produits afin de vérifier leur conformité aux spécifications et critères définis.", enDefinition: "Inspection of materials, operations and products to verify compliance with defined specifications and criteria.", parentId: "domain:industrial-production" },
  { id: "subdomain-ind:industrial-safety", type: "subdomain", fr: "Santé et sécurité au travail industriel", en: "Industrial occupational health and safety", frDefinition: "Prévention des accidents, expositions et situations dangereuses dans les ateliers et sites industriels.", enDefinition: "Prevention of accidents, exposures and hazardous situations in workshops and industrial sites.", parentId: "domain:industrial-production" },
  { id: "subdomain-ind:industrial-packaging", type: "subdomain", fr: "Conditionnement et emballage industriel", en: "Industrial packaging", frDefinition: "Dosage, remplissage, fermeture, étiquetage, emballage et traçabilité des produits fabriqués.", enDefinition: "Dosing, filling, sealing, labelling, packaging and traceability of manufactured products.", parentId: "domain:industrial-production" },
  { id: "subdomain-ind:industrial-supply-chain", type: "subdomain", fr: "Approvisionnement industriel", en: "Industrial supply", frDefinition: "Gestion des matières premières, composants, pièces de rechange et flux nécessaires à la continuité de production.", enDefinition: "Management of raw materials, components, spare parts and flows needed for production continuity.", parentId: "domain:industrial-production" },
];

const SEEDS: Seed[] = [
  ...SUBDOMAINS,
  { id: "specialization-ind:lean-manufacturing", type: "specialization", fr: "Production au plus juste", en: "Lean manufacturing", frDefinition: "Approche d'amélioration visant à réduire les gaspillages et à fluidifier la création de valeur.", enDefinition: "Improvement approach aiming to reduce waste and improve value flow.", parentId: "domain:industrial-production", terms: ["lean", "amélioration continue"] },
  { id: "specialization-ind:additive-manufacturing", type: "specialization", fr: "Fabrication additive", en: "Additive manufacturing", frDefinition: "Fabrication de pièces par ajout successif de matière à partir d'un modèle numérique.", enDefinition: "Production of parts by adding material layer by layer from a digital model.", parentId: "domain:mechanical-engineering", terms: ["impression 3D industrielle"] },
  { id: "specialization-ind:industrial-energy-efficiency", type: "specialization", fr: "Efficacité énergétique industrielle", en: "Industrial energy efficiency", frDefinition: "Réduction et maîtrise des consommations énergétiques des procédés et installations industrielles.", enDefinition: "Reduction and control of energy consumption in industrial processes and facilities.", parentId: "domain:industrial-production" },
  { id: "specialization-ind:computer-integrated-manufacturing", type: "specialization", fr: "Fabrication intégrée par ordinateur", en: "Computer-integrated manufacturing", frDefinition: "Coordination numérique de la conception, de la planification, de la fabrication et du contrôle.", enDefinition: "Digital coordination of design, planning, manufacturing and inspection.", parentId: "domain:industrial-production" },
  { id: "occupation-ind:industrial-engineer", type: "occupation", fr: "Ingénieur industriel", en: "Industrial engineer", frDefinition: "Professionnel qui conçoit, analyse et améliore les systèmes et performances industriels.", enDefinition: "Professional who designs, analyses and improves industrial systems and performance.", parentId: "domain:industrial-production" },
  { id: "occupation-ind:production-manager", type: "occupation", fr: "Responsable de production", en: "Production manager", frDefinition: "Responsable de l'organisation des équipes, des moyens, des objectifs et des résultats de production.", enDefinition: "Person responsible for organizing teams, resources, targets and production outcomes.", parentId: "domain:industrial-production" },
  { id: "occupation-ind:maintenance-technician", type: "occupation", fr: "Technicien de maintenance industrielle", en: "Industrial maintenance technician", frDefinition: "Technicien chargé du diagnostic, de l'entretien et de la remise en service des équipements.", enDefinition: "Technician responsible for diagnosing, servicing and restoring equipment.", parentId: "domain:mechanical-engineering" },
  { id: "occupation-ind:industrial-electrician", type: "occupation", fr: "Électricien industriel", en: "Industrial electrician", frDefinition: "Professionnel qui installe, contrôle et entretient les équipements et installations électriques industriels.", enDefinition: "Professional installing, inspecting and maintaining industrial electrical equipment and installations.", parentId: "domain:electrical-engineering" },
  { id: "occupation-ind:automation-technician", type: "occupation", fr: "Technicien en automatisme", en: "Automation technician", frDefinition: "Technicien qui met en service, programme et dépanne les systèmes automatisés.", enDefinition: "Technician who commissions, programs and troubleshoots automated systems.", parentId: "domain:electrical-engineering" },
  { id: "occupation-ind:quality-controller", type: "occupation", fr: "Contrôleur qualité industriel", en: "Industrial quality inspector", frDefinition: "Professionnel qui vérifie la conformité des matières, opérations et produits.", enDefinition: "Professional who checks the conformity of materials, operations and products.", parentId: "domain:industrial-production" },
  { id: "occupation-ind:welder", type: "occupation", fr: "Soudeur industriel", en: "Industrial welder", frDefinition: "Professionnel réalisant des assemblages soudés selon des plans, procédés et qualifications applicables.", enDefinition: "Professional making welded joints according to applicable drawings, processes and qualifications.", parentId: "domain:mechanical-engineering" },
  { id: "occupation-ind:textile-operator", type: "occupation", fr: "Opérateur de production textile", en: "Textile production operator", frDefinition: "Opérateur conduisant ou surveillant des opérations de transformation et fabrication textile.", enDefinition: "Operator running or monitoring textile transformation and manufacturing operations.", parentId: "domain:textile-fashion" },
  { id: "activity-ind:production-order", type: "activity", fr: "Lancement d'un ordre de fabrication", en: "Production order release", frDefinition: "Autorisation et préparation du lancement d'une fabrication selon les données et ressources disponibles.", enDefinition: "Authorization and preparation of a manufacturing run based on available data and resources.", parentId: "domain:industrial-production", terms: ["lancement OF"] },
  { id: "activity-ind:machine-setup", type: "activity", fr: "Réglage d'une machine industrielle", en: "Industrial machine setup", frDefinition: "Préparation et réglage d'une machine avant une opération de fabrication.", enDefinition: "Preparation and setup of a machine before a manufacturing operation.", parentId: "domain:mechanical-engineering" },
  { id: "activity-ind:preventive-maintenance", type: "activity", fr: "Maintenance préventive", en: "Preventive maintenance", frDefinition: "Intervention planifiée destinée à réduire la probabilité de défaillance d'un équipement.", enDefinition: "Planned intervention intended to reduce the likelihood of equipment failure.", parentId: "domain:mechanical-engineering" },
  { id: "activity-ind:quality-inspection", type: "activity", fr: "Inspection qualité", en: "Quality inspection", frDefinition: "Vérification documentée de caractéristiques d'une matière, d'un produit ou d'un procédé.", enDefinition: "Documented verification of characteristics of a material, product or process.", parentId: "domain:industrial-production" },
  { id: "activity-ind:calibration", type: "activity", fr: "Étalonnage d'un instrument", en: "Instrument calibration", frDefinition: "Opération établissant la relation entre les indications d'un instrument et des références de mesure.", enDefinition: "Operation establishing the relationship between instrument indications and measurement standards.", parentId: "domain:electronics" },
  { id: "activity-ind:welding-operation", type: "activity", fr: "Opération de soudage", en: "Welding operation", frDefinition: "Réalisation d'un assemblage par soudage selon un procédé et une instruction adaptés.", enDefinition: "Execution of a welded joint using an appropriate process and instruction.", parentId: "domain:mechanical-engineering" },
  { id: "activity-ind:textile-cutting", type: "activity", fr: "Coupe textile", en: "Textile cutting", frDefinition: "Découpe de matières textiles selon des patrons, plans de coupe et tolérances définis.", enDefinition: "Cutting textile materials according to patterns, cutting plans and defined tolerances.", parentId: "domain:textile-fashion" },
  { id: "activity-ind:production-reporting", type: "activity", fr: "Déclaration de production", en: "Production reporting", frDefinition: "Enregistrement des quantités produites, temps, rebuts, arrêts et événements d'un poste ou atelier.", enDefinition: "Recording quantities produced, time, scrap, downtime and events at a workstation or workshop.", parentId: "domain:industrial-production" },
  { id: "process-ind:manufacturing-order-cycle", type: "process", fr: "Cycle d'un ordre de fabrication", en: "Manufacturing order cycle", frDefinition: "Préparation, lancement, exécution, contrôle, déclaration et clôture d'un ordre de fabrication.", enDefinition: "Preparation, release, execution, inspection, reporting and closure of a manufacturing order.", parentId: "domain:industrial-production" },
  { id: "process-ind:maintenance-workflow", type: "process", fr: "Processus de maintenance industrielle", en: "Industrial maintenance workflow", frDefinition: "Signalement, diagnostic, planification, intervention, essai, remise en service et retour d'expérience.", enDefinition: "Reporting, diagnosis, planning, intervention, testing, return to service and lessons learned.", parentId: "domain:mechanical-engineering" },
  { id: "process-ind:quality-control-cycle", type: "process", fr: "Cycle de contrôle qualité", en: "Quality control cycle", frDefinition: "Définition des critères, échantillonnage, mesure, décision de conformité, traitement des écarts et archivage.", enDefinition: "Definition of criteria, sampling, measurement, conformity decision, deviation handling and record keeping.", parentId: "domain:industrial-production" },
  { id: "process-ind:industrial-procurement", type: "process", fr: "Approvisionnement de production", en: "Production procurement process", frDefinition: "Expression du besoin, approbation, commande, réception, contrôle et mise à disposition des articles.", enDefinition: "Requirement, approval, ordering, receipt, inspection and release of items.", parentId: "domain:industrial-production" },
  { id: "process-ind:nonconformity-management", type: "process", fr: "Traitement des non-conformités", en: "Nonconformity management", frDefinition: "Identification, isolement, analyse, décision, correction et vérification des non-conformités.", enDefinition: "Identification, containment, analysis, disposition, correction and verification of nonconformities.", parentId: "domain:industrial-production" },
  { id: "process-ind:industrial-safety-management", type: "process", fr: "Gestion de la sécurité industrielle", en: "Industrial safety management", frDefinition: "Identification des dangers, évaluation des risques, mesures de prévention, suivi et retour d'incident.", enDefinition: "Hazard identification, risk assessment, preventive controls, monitoring and incident learning.", parentId: "domain:industrial-production" },
  { id: "problem-ind:machine-downtime", type: "problem", fr: "Arrêt ou indisponibilité des machines", en: "Machine downtime", frDefinition: "Période pendant laquelle un équipement ne peut pas assurer la fonction de production attendue.", enDefinition: "Period during which equipment cannot perform its expected production function.", parentId: "domain:mechanical-engineering", terms: ["panne machine", "arrêt machine"] },
  { id: "problem-ind:production-delays", type: "problem", fr: "Retards de production", en: "Production delays", frDefinition: "Décalage entre les dates prévues et réelles de réalisation des opérations ou commandes.", enDefinition: "Difference between planned and actual completion dates of operations or orders.", parentId: "domain:industrial-production" },
  { id: "problem-ind:quality-defects", type: "problem", fr: "Défauts de fabrication", en: "Manufacturing defects", frDefinition: "Écart d'un produit ou composant par rapport aux exigences ou spécifications applicables.", enDefinition: "Deviation of a product or component from applicable requirements or specifications.", parentId: "domain:industrial-production", terms: ["produits défectueux", "rebuts de fabrication"] },
  { id: "problem-ind:material-shortage", type: "problem", fr: "Rupture de matières ou composants", en: "Material or component shortage", frDefinition: "Indisponibilité d'une matière ou d'un composant nécessaire à la continuité de fabrication.", enDefinition: "Unavailability of material or components required for manufacturing continuity.", parentId: "domain:industrial-production" },
  { id: "problem-ind:high-production-cost", type: "problem", fr: "Coût de production trop élevé", en: "Excessive production cost", frDefinition: "Coût des ressources et opérations supérieur au niveau cible ou économiquement soutenable.", enDefinition: "Resource and operation cost exceeding the target or economically sustainable level.", parentId: "domain:industrial-production" },
  { id: "problem-ind:workplace-accident-risk", type: "problem", fr: "Risque d'accident en milieu industriel", en: "Industrial workplace accident risk", frDefinition: "Exposition à des dangers susceptibles de provoquer blessures, dommages ou atteintes à la santé.", enDefinition: "Exposure to hazards that may cause injury, damage or harm to health.", parentId: "domain:industrial-production" },
  { id: "problem-ind:energy-waste", type: "problem", fr: "Surconsommation énergétique industrielle", en: "Industrial energy waste", frDefinition: "Consommation d'énergie évitable ou supérieure aux besoins et références définis pour l'activité.", enDefinition: "Avoidable energy use or consumption above defined needs and benchmarks for the activity.", parentId: "domain:industrial-production" },
  { id: "resource-ind:production-machine", type: "resource", fr: "Machine de production", en: "Production machine", frDefinition: "Équipement réalisant une opération de transformation, fabrication ou assemblage.", enDefinition: "Equipment performing a transformation, manufacturing or assembly operation.", parentId: "domain:industrial-production" },
  { id: "resource-ind:spare-parts", type: "resource", fr: "Pièces de rechange", en: "Spare parts", frDefinition: "Composants conservés ou approvisionnés pour réparer ou maintenir les équipements.", enDefinition: "Components held or procured to repair or maintain equipment.", parentId: "domain:mechanical-engineering" },
  { id: "resource-ind:raw-material", type: "resource", fr: "Matière première industrielle", en: "Industrial raw material", frDefinition: "Matière entrant dans un procédé de transformation ou de fabrication.", enDefinition: "Material entering a transformation or manufacturing process.", parentId: "domain:industrial-production" },
  { id: "resource-ind:technical-documentation", type: "resource", fr: "Documentation technique industrielle", en: "Industrial technical documentation", frDefinition: "Plans, notices, gammes, procédures, fiches techniques et dossiers nécessaires à l'exploitation.", enDefinition: "Drawings, manuals, routings, procedures, technical sheets and records required for operations.", parentId: "domain:industrial-production" },
  { id: "resource-ind:measurement-instrument", type: "resource", fr: "Instrument de mesure industriel", en: "Industrial measuring instrument", frDefinition: "Instrument destiné à mesurer une grandeur utilisée pour le contrôle ou la conduite d'un procédé.", enDefinition: "Instrument used to measure a quantity for process control or inspection.", parentId: "domain:electronics" },
  { id: "function-ind:production-planning-board", type: "function", fr: "Planning et ordonnancement de production", en: "Production planning board", frDefinition: "Planification des ordres, ressources, capacités, priorités et échéances de fabrication.", enDefinition: "Planning manufacturing orders, resources, capacity, priorities and deadlines.", parentId: "domain:industrial-production" },
  { id: "function-ind:maintenance-management", type: "function", fr: "Gestion de la maintenance et des interventions", en: "Maintenance and work-order management", frDefinition: "Gestion des équipements, demandes, interventions, pièces, historiques et calendriers de maintenance.", enDefinition: "Management of equipment, requests, work orders, parts, histories and maintenance schedules.", parentId: "domain:mechanical-engineering" },
  { id: "function-ind:quality-traceability", type: "function", fr: "Traçabilité qualité des fabrications", en: "Manufacturing quality traceability", frDefinition: "Traçabilité des lots, contrôles, résultats, non-conformités et décisions qualité.", enDefinition: "Traceability of batches, inspections, results, nonconformities and quality decisions.", parentId: "domain:industrial-production" },
  { id: "function-ind:industrial-inventory", type: "function", fr: "Gestion des stocks industriels", en: "Industrial inventory management", frDefinition: "Suivi des matières, composants, produits en cours, produits finis et pièces de rechange.", enDefinition: "Tracking materials, components, work in progress, finished goods and spare parts.", parentId: "domain:industrial-production" },
  { id: "function-ind:machine-monitoring", type: "function", fr: "Suivi de l'état des machines", en: "Machine condition monitoring", frDefinition: "Collecte et visualisation des états, compteurs, alertes et événements des équipements.", enDefinition: "Collection and visualization of equipment states, counters, alerts and events.", parentId: "domain:industrial-production" },
  { id: "indicator-ind:production-yield", type: "indicator", fr: "Rendement de production", en: "Production yield", frDefinition: "Rapport entre la quantité conforme obtenue et la quantité ou ressource de référence définie.", enDefinition: "Ratio between conforming output and the defined reference quantity or input.", parentId: "domain:industrial-production" },
  { id: "indicator-ind:equipment-availability", type: "indicator", fr: "Taux de disponibilité des équipements", en: "Equipment availability rate", frDefinition: "Part du temps de référence pendant laquelle un équipement est disponible selon la définition retenue.", enDefinition: "Share of reference time during which equipment is available under the chosen definition.", parentId: "domain:mechanical-engineering" },
  { id: "indicator-ind:overall-equipment-effectiveness", type: "indicator", fr: "Efficacité globale des équipements", en: "Overall equipment effectiveness", frDefinition: "Indicateur combinant disponibilité, performance et qualité selon un périmètre de calcul explicite.", enDefinition: "Metric combining availability, performance and quality using an explicit calculation scope.", parentId: "domain:industrial-production", terms: ["TRS", "OEE"] },
  { id: "indicator-ind:defect-rate", type: "indicator", fr: "Taux de défauts de fabrication", en: "Manufacturing defect rate", frDefinition: "Part des unités inspectées ou produites présentant au moins un défaut selon les critères retenus.", enDefinition: "Share of inspected or produced units with at least one defect under the selected criteria.", parentId: "domain:industrial-production" },
  { id: "indicator-ind:on-time-delivery", type: "indicator", fr: "Taux de réalisation dans les délais", en: "On-time production completion rate", frDefinition: "Part des ordres ou lots achevés à la date promise selon la règle de calcul définie.", enDefinition: "Share of orders or batches completed by the promised date under the defined calculation rule.", parentId: "domain:industrial-production" },
];

export const INDUSTRY_MANUFACTURING_CATALOG = SEEDS.map(makeConcept);
export const INDUSTRY_MANUFACTURING_SUBDOMAINS = INDUSTRY_MANUFACTURING_CATALOG.filter((item) => item.conceptType === "subdomain");
export const INDUSTRY_MANUFACTURING_FAMILY_ID = FAMILY_ID;
export const INDUSTRY_MANUFACTURING_RELATIONSHIPS: KnowledgeRelationship[] = [
  ...SUBDOMAINS.map((seed) => ({
    id: `rel:family-04-parent:${seed.id}`,
    sourceConceptId: seed.id,
    targetConceptId: seed.parentId!,
    predicate: "belongs_to_domain",
    status: "validated" as const,
    confidence: 1,
    sourceIds: [SOURCE_ID],
    version: 1,
  })),
  ...SEEDS.filter((seed) => seed.type === "occupation").map((seed) => ({
    id: `rel:family-04-occupation:${seed.id}`,
    sourceConceptId: seed.id,
    targetConceptId: FAMILY_ID,
    predicate: "works_in_family",
    status: "validated" as const,
    confidence: 1,
    sourceIds: [SOURCE_ID],
    version: 1,
  })),
  ...SEEDS.filter((seed) => ["activity", "process", "problem", "resource", "function", "indicator"].includes(seed.type)).map((seed) => ({
    id: `rel:family-04-concept:${seed.id}`,
    sourceConceptId: seed.id,
    targetConceptId: seed.parentId ?? FAMILY_ID,
    predicate: "related_to_industrial_domain",
    status: "validated" as const,
    confidence: 1,
    sourceIds: [SOURCE_ID],
    version: 1,
  })),
];
