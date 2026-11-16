import type { KnowledgeConcept, KnowledgeRelationship } from "./types";

const CREATED_AT = "2026-11-16T00:00:00.000Z";
const SOURCE_ID = "source:merkora-family-06-energy-utilities-v1";
const FAMILY_ID = "family:energy-utilities";

type Seed = {
  id: string; type: string; fr: string; en: string;
  frDefinition: string; enDefinition: string;
  parentId?: string; terms?: string[];
};

function makeConcept(seed: Seed): KnowledgeConcept {
  return {
    id: seed.id,
    canonicalKey: `merkora.energy-utilities.${seed.type}.${seed.id.replace(/^[^:]+:/, "")}`,
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
      label: "MerKora GDJ — Famille 06 Énergie et services essentiels, version 1",
    }],
    reliability: {
      evidenceLevel: "documented",
      reviewStatus: "not_reviewed",
      verificationNotes: [
        "Les règles de raccordement, de tarification, de sécurité, de comptage, de qualité de service et d'autorisation dépendent du pays, du réseau et de l'opérateur. Ce référentiel ne remplace ni les normes locales ni l'avis d'un professionnel habilité.",
      ],
    },
  };
}

const SUBDOMAINS: Seed[] = [
  { id: "subdomain-ene:electricity-generation", type: "subdomain", fr: "Production d'électricité", en: "Electricity generation", frDefinition: "Production d'énergie électrique à partir de sources thermiques, hydrauliques, renouvelables ou autres.", enDefinition: "Production of electrical energy from thermal, hydro, renewable or other sources.", parentId: "domain:electricity" },
  { id: "subdomain-ene:electricity-transmission", type: "subdomain", fr: "Transport d'électricité", en: "Electricity transmission", frDefinition: "Acheminement de l'électricité sur les réseaux de transport à haute tension.", enDefinition: "Transfer of electricity through high-voltage transmission networks.", parentId: "domain:electricity" },
  { id: "subdomain-ene:electricity-distribution", type: "subdomain", fr: "Distribution d'électricité", en: "Electricity distribution", frDefinition: "Acheminement de l'électricité vers les clients au moyen des réseaux de distribution.", enDefinition: "Delivery of electricity to customers through distribution networks.", parentId: "domain:electricity", terms: ["réseau de distribution électrique"] },
  { id: "subdomain-ene:grid-operation", type: "subdomain", fr: "Conduite et exploitation des réseaux électriques", en: "Electricity grid operations", frDefinition: "Surveillance, conduite, équilibrage et coordination opérationnelle des réseaux électriques.", enDefinition: "Monitoring, operating, balancing and coordinating electricity networks.", parentId: "domain:electricity" },
  { id: "subdomain-ene:electrical-connections", type: "subdomain", fr: "Branchement et raccordement électrique", en: "Electrical connections and service hookups", frDefinition: "Étude, réalisation et mise en service des raccordements des installations aux réseaux électriques.", enDefinition: "Design, installation and commissioning of electrical connections to utility networks.", parentId: "domain:electricity", terms: ["branchement électrique"] },
  { id: "subdomain-ene:power-quality", type: "subdomain", fr: "Qualité et continuité de l'alimentation électrique", en: "Power quality and supply continuity", frDefinition: "Suivi de la tension, de la fréquence, des perturbations et de la continuité du service électrique.", enDefinition: "Monitoring voltage, frequency, disturbances and continuity of electricity supply.", parentId: "domain:electricity" },
  { id: "subdomain-ene:solar-energy", type: "subdomain", fr: "Énergie solaire photovoltaïque et thermique", en: "Solar photovoltaic and thermal energy", frDefinition: "Conversion du rayonnement solaire en électricité ou en chaleur et exploitation des installations.", enDefinition: "Conversion of solar radiation into electricity or heat and operation of installations.", parentId: "domain:renewable-energy", terms: ["solaire", "photovoltaïque"] },
  { id: "subdomain-ene:wind-energy", type: "subdomain", fr: "Énergie éolienne", en: "Wind energy", frDefinition: "Production d'électricité à partir de l'énergie cinétique du vent.", enDefinition: "Electricity generation from the kinetic energy of wind.", parentId: "domain:renewable-energy" },
  { id: "subdomain-ene:hydropower", type: "subdomain", fr: "Énergie hydraulique", en: "Hydropower", frDefinition: "Production d'énergie par exploitation de l'énergie de l'eau en mouvement ou en hauteur.", enDefinition: "Energy generation using moving or elevated water.", parentId: "domain:renewable-energy" },
  { id: "subdomain-ene:bioenergy", type: "subdomain", fr: "Bioénergie et biomasse", en: "Bioenergy and biomass", frDefinition: "Production de chaleur, de gaz ou d'électricité à partir de matières organiques et résidus.", enDefinition: "Production of heat, gas or electricity from organic matter and residues.", parentId: "domain:renewable-energy" },
  { id: "subdomain-ene:energy-storage", type: "subdomain", fr: "Stockage de l'énergie", en: "Energy storage", frDefinition: "Stockage et restitution d'énergie par batteries, pompage, chaleur ou autres technologies.", enDefinition: "Storage and release of energy using batteries, pumped storage, heat or other technologies.", parentId: "domain:renewable-energy" },
  { id: "subdomain-ene:gas-production-supply", type: "subdomain", fr: "Production et approvisionnement en gaz", en: "Gas production and supply", frDefinition: "Production, traitement, importation ou approvisionnement en gaz destiné aux usages énergétiques.", enDefinition: "Production, processing, import or supply of gas for energy uses.", parentId: "domain:gas-utilities" },
  { id: "subdomain-ene:gas-distribution", type: "subdomain", fr: "Réseaux de distribution de gaz", en: "Gas distribution networks", frDefinition: "Transport local, distribution, branchement et exploitation des réseaux de gaz.", enDefinition: "Local transport, distribution, connection and operation of gas networks.", parentId: "domain:gas-utilities" },
  { id: "subdomain-ene:gas-storage", type: "subdomain", fr: "Stockage et logistique du gaz", en: "Gas storage and logistics", frDefinition: "Stockage, manutention, transport et gestion des approvisionnements de gaz et combustibles gazeux.", enDefinition: "Storage, handling, transport and supply management of gas and gaseous fuels.", parentId: "domain:gas-utilities" },
  { id: "subdomain-ene:district-heating", type: "subdomain", fr: "Réseaux de chaleur et de froid", en: "District heating and cooling", frDefinition: "Production centralisée et distribution de chaleur ou de froid à plusieurs bâtiments ou clients.", enDefinition: "Centralized production and distribution of heating or cooling to multiple buildings or customers.", parentId: "domain:thermal-energy" },
  { id: "subdomain-ene:thermal-plants", type: "subdomain", fr: "Centrales thermiques et chaudières industrielles", en: "Thermal power plants and industrial boilers", frDefinition: "Production de chaleur ou d'électricité par des installations thermiques et chaudières.", enDefinition: "Production of heat or electricity through thermal plants and boilers.", parentId: "domain:thermal-energy" },
  { id: "subdomain-ene:utility-asset-maintenance", type: "subdomain", fr: "Maintenance des équipements et réseaux énergétiques", en: "Energy utility asset maintenance", frDefinition: "Inspection, maintenance préventive et corrective des installations, équipements et réseaux énergétiques.", enDefinition: "Inspection and preventive or corrective maintenance of energy installations, equipment and networks.", parentId: "domain:utility-maintenance" },
  { id: "subdomain-ene:metering-billing", type: "subdomain", fr: "Comptage, relevé et facturation des services énergétiques", en: "Energy metering, reading and billing", frDefinition: "Mesure des consommations, gestion des compteurs, relevés et données nécessaires à la facturation.", enDefinition: "Measurement of consumption, meter management, readings and data required for billing.", parentId: "domain:utility-maintenance", terms: ["relevé compteur", "comptage énergétique"] },
];

const SEEDS: Seed[] = [
  ...SUBDOMAINS,
  { id: "specialization-ene:smart-grids", type: "specialization", fr: "Réseaux électriques intelligents", en: "Smart grids", frDefinition: "Réseaux intégrant mesure, communication, automatisation et pilotage pour améliorer leur exploitation.", enDefinition: "Networks integrating measurement, communication, automation and control to improve operation.", parentId: "domain:electricity" },
  { id: "specialization-ene:distributed-generation", type: "specialization", fr: "Production décentralisée et autoconsommation", en: "Distributed generation and self-consumption", frDefinition: "Production proche des usages et consommation locale de l'énergie produite, avec ou sans stockage.", enDefinition: "Generation close to consumption and local use of produced energy, with or without storage.", parentId: "domain:renewable-energy" },
  { id: "specialization-ene:energy-efficiency", type: "specialization", fr: "Efficacité énergétique et maîtrise de la demande", en: "Energy efficiency and demand-side management", frDefinition: "Réduction des consommations et adaptation des usages sans dégrader le service attendu.", enDefinition: "Reducing consumption and adapting use without degrading the expected service.", parentId: "domain:thermal-energy" },
  { id: "specialization-ene:mini-grids", type: "specialization", fr: "Mini-réseaux et électrification décentralisée", en: "Mini-grids and decentralized electrification", frDefinition: "Systèmes locaux de production, stockage et distribution électrique pour des zones ou communautés.", enDefinition: "Local electricity generation, storage and distribution systems for areas or communities.", parentId: "domain:electricity" },

  { id: "occupation-ene:power-systems-engineer", type: "occupation", fr: "Ingénieur en systèmes électriques", en: "Power systems engineer", frDefinition: "Professionnel qui étudie, conçoit ou optimise les systèmes de production, transport et distribution d'électricité.", enDefinition: "Professional studying, designing or optimizing electricity generation, transmission and distribution systems.", parentId: "domain:electricity" },
  { id: "occupation-ene:electrical-network-technician", type: "occupation", fr: "Technicien de réseau électrique", en: "Electrical network technician", frDefinition: "Professionnel intervenant sur l'exploitation, le contrôle et la maintenance des réseaux électriques selon habilitation.", enDefinition: "Professional operating, inspecting and maintaining electrical networks within authorized scope.", parentId: "domain:electricity" },
  { id: "occupation-ene:renewable-energy-technician", type: "occupation", fr: "Technicien en énergies renouvelables", en: "Renewable energy technician", frDefinition: "Professionnel qui installe, contrôle et entretient des systèmes d'énergie renouvelable.", enDefinition: "Professional installing, inspecting and maintaining renewable energy systems.", parentId: "domain:renewable-energy" },
  { id: "occupation-ene:solar-installer", type: "occupation", fr: "Installateur photovoltaïque", en: "Solar photovoltaic installer", frDefinition: "Professionnel qui installe et met en service des systèmes photovoltaïques selon les règles applicables.", enDefinition: "Professional installing and commissioning photovoltaic systems under applicable rules.", parentId: "domain:renewable-energy" },
  { id: "occupation-ene:energy-auditor", type: "occupation", fr: "Auditeur énergétique", en: "Energy auditor", frDefinition: "Professionnel qui analyse les usages et consommations afin d'identifier des possibilités d'amélioration.", enDefinition: "Professional analyzing energy use and consumption to identify improvement opportunities.", parentId: "domain:thermal-energy" },
  { id: "occupation-ene:gas-network-technician", type: "occupation", fr: "Technicien des réseaux de gaz", en: "Gas network technician", frDefinition: "Professionnel chargé d'opérations sur les réseaux et installations de gaz dans son périmètre d'habilitation.", enDefinition: "Professional performing gas network and installation work within authorized scope.", parentId: "domain:gas-utilities" },
  { id: "occupation-ene:power-plant-operator", type: "occupation", fr: "Opérateur de centrale énergétique", en: "Power plant operator", frDefinition: "Professionnel qui surveille et conduit les équipements d'une installation de production énergétique.", enDefinition: "Professional monitoring and operating equipment in an energy generation facility.", parentId: "domain:thermal-energy" },
  { id: "occupation-ene:utility-meter-reader", type: "occupation", fr: "Agent releveur de compteurs", en: "Utility meter reader", frDefinition: "Professionnel qui relève et vérifie les index des compteurs et transmet les données de consommation.", enDefinition: "Professional reading and checking meter indexes and submitting consumption data.", parentId: "domain:utility-maintenance" },

  { id: "activity-ene:meter-reading", type: "activity", fr: "Relevé du compteur énergétique", en: "Energy meter reading", frDefinition: "Lecture, contrôle et enregistrement de l'index d'un compteur d'énergie.", enDefinition: "Reading, checking and recording an energy meter index.", parentId: "domain:utility-maintenance", terms: ["relevé du compteur", "lecture compteur"] },
  { id: "activity-ene:customer-connection", type: "activity", fr: "Réalisation d'un branchement client", en: "Customer utility connection", frDefinition: "Exécution et contrôle des opérations nécessaires au raccordement d'un nouveau client.", enDefinition: "Execution and inspection of work required to connect a new customer.", parentId: "domain:electricity", terms: ["branchement client"] },
  { id: "activity-ene:network-inspection", type: "activity", fr: "Inspection d'un réseau énergétique", en: "Energy network inspection", frDefinition: "Examen planifié ou ciblé des équipements, ouvrages et conditions d'exploitation d'un réseau.", enDefinition: "Planned or targeted examination of network equipment, assets and operating conditions.", parentId: "domain:utility-maintenance" },
  { id: "activity-ene:preventive-maintenance", type: "activity", fr: "Maintenance préventive des équipements énergétiques", en: "Preventive maintenance of energy equipment", frDefinition: "Interventions planifiées pour réduire la probabilité de défaillance et préserver les performances des équipements.", enDefinition: "Planned interventions to reduce failure likelihood and preserve equipment performance.", parentId: "domain:utility-maintenance" },
  { id: "activity-ene:fault-restoration", type: "activity", fr: "Rétablissement du service après incident", en: "Service restoration after an incident", frDefinition: "Localisation, sécurisation, réparation et remise en service après une interruption ou défaillance.", enDefinition: "Locating, securing, repairing and restoring service after an interruption or failure.", parentId: "domain:utility-maintenance" },
  { id: "activity-ene:solar-system-installation", type: "activity", fr: "Installation d'un système solaire", en: "Solar system installation", frDefinition: "Montage, raccordement, essais et mise en service d'un système solaire adapté au site.", enDefinition: "Assembly, connection, testing and commissioning of a solar system suited to the site.", parentId: "domain:renewable-energy" },
  { id: "activity-ene:energy-audit", type: "activity", fr: "Réalisation d'un audit énergétique", en: "Energy audit", frDefinition: "Collecte de données, analyse des usages et formulation de recommandations d'efficacité énergétique.", enDefinition: "Data collection, energy-use analysis and recommendations for improved efficiency.", parentId: "domain:thermal-energy" },
  { id: "activity-ene:load-shedding-planning", type: "activity", fr: "Planification de délestage électrique", en: "Electricity load-shedding planning", frDefinition: "Organisation documentée de réductions temporaires de charge en fonction des contraintes du système et des règles applicables.", enDefinition: "Documented planning of temporary load reductions according to system constraints and applicable rules.", parentId: "domain:electricity" },

  { id: "process-ene:utility-customer-onboarding", type: "process", fr: "Processus de demande et raccordement d'un client", en: "Utility customer request and connection process", frDefinition: "Demande, étude, devis, autorisation, travaux, contrôle et mise en service d'un raccordement.", enDefinition: "Request, assessment, quotation, approval, works, inspection and commissioning of a connection.", parentId: "domain:electricity" },
  { id: "process-ene:meter-to-cash", type: "process", fr: "Cycle de comptage à facturation", en: "Meter-to-cash process", frDefinition: "Collecte des index, validation des consommations, calcul de facture, émission et suivi du paiement.", enDefinition: "Collection of meter readings, validation of consumption, bill calculation, issuance and payment tracking.", parentId: "domain:utility-maintenance" },
  { id: "process-ene:outage-management", type: "process", fr: "Gestion des interruptions de service", en: "Utility outage management", frDefinition: "Détection, qualification, priorisation, affectation, réparation, communication et clôture des interruptions.", enDefinition: "Detection, classification, prioritization, dispatch, repair, communication and closure of outages.", parentId: "domain:electricity" },
  { id: "process-ene:energy-asset-lifecycle", type: "process", fr: "Cycle de vie des actifs énergétiques", en: "Energy asset lifecycle", frDefinition: "Planification, acquisition, installation, exploitation, maintenance, renouvellement et retrait des actifs.", enDefinition: "Planning, acquisition, installation, operation, maintenance, renewal and retirement of assets.", parentId: "domain:utility-maintenance" },
  { id: "process-ene:renewable-project-delivery", type: "process", fr: "Développement et mise en service d'un projet renouvelable", en: "Renewable energy project delivery", frDefinition: "Étude du site, dimensionnement, approvisionnement, installation, essais et mise en service.", enDefinition: "Site assessment, sizing, procurement, installation, testing and commissioning.", parentId: "domain:renewable-energy" },
  { id: "process-ene:energy-efficiency-program", type: "process", fr: "Programme de maîtrise de la consommation énergétique", en: "Energy efficiency program", frDefinition: "Diagnostic, définition des objectifs, mise en œuvre des mesures et suivi des économies réalisées.", enDefinition: "Diagnosis, target setting, implementation of measures and monitoring of achieved savings.", parentId: "domain:thermal-energy" },

  { id: "problem-ene:power-outage", type: "problem", fr: "Coupure ou interruption d'électricité", en: "Power outage", frDefinition: "Perte totale ou partielle de l'alimentation électrique sur une installation ou une zone de réseau.", enDefinition: "Total or partial loss of electricity supply at an installation or network area.", parentId: "domain:electricity", terms: ["coupure de courant", "panne de courant", "absence de courant"] },
  { id: "problem-ene:voltage-instability", type: "problem", fr: "Instabilité ou mauvaise qualité de tension", en: "Voltage instability or poor power quality", frDefinition: "Écart ou perturbation des caractéristiques électriques affectant les équipements ou la qualité de service.", enDefinition: "Deviation or disturbance in electrical characteristics affecting equipment or service quality.", parentId: "domain:electricity" },
  { id: "problem-ene:energy-losses", type: "problem", fr: "Pertes techniques ou commerciales d'énergie", en: "Technical or commercial energy losses", frDefinition: "Énergie produite ou acheminée qui n'est pas comptabilisée ou facturée selon les règles du système.", enDefinition: "Generated or delivered energy not accounted for or billed under the system rules.", parentId: "domain:electricity" },
  { id: "problem-ene:meter-failure", type: "problem", fr: "Compteur défectueux ou relevé incohérent", en: "Faulty meter or inconsistent reading", frDefinition: "Défaillance, absence de communication ou données de comptage incohérentes.", enDefinition: "Meter failure, communication loss or inconsistent metering data.", parentId: "domain:utility-maintenance" },
  { id: "problem-ene:equipment-breakdown", type: "problem", fr: "Panne d'un équipement énergétique", en: "Energy equipment breakdown", frDefinition: "Défaillance empêchant ou dégradant le fonctionnement attendu d'un équipement de production ou de réseau.", enDefinition: "Failure preventing or degrading expected operation of generation or network equipment.", parentId: "domain:utility-maintenance" },
  { id: "problem-ene:renewable-intermittency", type: "problem", fr: "Intermittence de la production renouvelable", en: "Renewable generation intermittency", frDefinition: "Variabilité de la production liée à la disponibilité de la ressource renouvelable et aux conditions météorologiques.", enDefinition: "Generation variability due to renewable resource availability and weather conditions.", parentId: "domain:renewable-energy" },
  { id: "problem-ene:energy-poverty-access", type: "problem", fr: "Accès insuffisant ou inabordable à l'énergie", en: "Insufficient or unaffordable energy access", frDefinition: "Situation dans laquelle des personnes ou organisations ne disposent pas d'un service énergétique adéquat, fiable ou financièrement accessible.", enDefinition: "Situation where people or organizations lack adequate, reliable or affordable energy services.", parentId: "domain:electricity" },

  { id: "resource-ene:energy-network-assets", type: "resource", fr: "Actifs et équipements de réseau énergétique", en: "Energy network assets and equipment", frDefinition: "Lignes, câbles, postes, transformateurs, conduites, vannes et équipements associés aux réseaux.", enDefinition: "Lines, cables, substations, transformers, pipes, valves and related network equipment.", parentId: "domain:utility-maintenance" },
  { id: "resource-ene:energy-meters", type: "resource", fr: "Compteurs et dispositifs de mesure énergétique", en: "Energy meters and measuring devices", frDefinition: "Équipements de mesure et de communication utilisés pour enregistrer les consommations ou paramètres énergétiques.", enDefinition: "Measurement and communication devices recording energy consumption or operating parameters.", parentId: "domain:utility-maintenance" },
  { id: "resource-ene:renewable-installations", type: "resource", fr: "Installations de production renouvelable", en: "Renewable generation installations", frDefinition: "Panneaux solaires, éoliennes, systèmes hydrauliques, unités biomasse et équipements associés.", enDefinition: "Solar panels, wind turbines, hydropower systems, biomass units and associated equipment.", parentId: "domain:renewable-energy" },
  { id: "resource-ene:energy-storage-systems", type: "resource", fr: "Systèmes de stockage énergétique", en: "Energy storage systems", frDefinition: "Batteries, réservoirs thermiques et autres dispositifs de stockage et restitution d'énergie.", enDefinition: "Batteries, thermal stores and other systems for storing and releasing energy.", parentId: "domain:renewable-energy" },
  { id: "resource-ene:utility-workforce", type: "resource", fr: "Personnel et équipes d'exploitation énergétique", en: "Energy utility workforce", frDefinition: "Personnel habilité et équipes chargés de la conduite, du contrôle, de l'intervention et de la maintenance.", enDefinition: "Authorized personnel and teams operating, inspecting, servicing and maintaining utility assets.", parentId: "domain:utility-maintenance" },

  { id: "function-ene:utility-customer-management", type: "function", fr: "Gestion des clients et demandes de raccordement", en: "Utility customer and connection management", frDefinition: "Gestion des abonnés, demandes, branchements, contrats, réclamations et dossiers clients.", enDefinition: "Management of customers, requests, connections, contracts, complaints and customer records.", parentId: "domain:utility-maintenance" },
  { id: "function-ene:metering-billing-management", type: "function", fr: "Gestion des compteurs, consommations et factures", en: "Metering, consumption and billing management", frDefinition: "Suivi des compteurs, index, consommations, calculs de factures et corrections documentées.", enDefinition: "Tracking meters, readings, consumption, bill calculations and documented corrections.", parentId: "domain:utility-maintenance" },
  { id: "function-ene:network-operations-dashboard", type: "function", fr: "Supervision des réseaux et incidents", en: "Network operations and incident supervision", frDefinition: "Tableau de bord de l'état des réseaux, alarmes, interruptions, interventions et rétablissements.", enDefinition: "Dashboard for network status, alarms, outages, interventions and service restoration.", parentId: "domain:electricity" },
  { id: "function-ene:energy-asset-maintenance", type: "function", fr: "Gestion des actifs et maintenance énergétique", en: "Energy asset and maintenance management", frDefinition: "Inventaire des actifs, plans de maintenance, ordres de travail, historiques et pièces de rechange.", enDefinition: "Asset inventory, maintenance plans, work orders, histories and spare parts.", parentId: "domain:utility-maintenance" },
  { id: "function-ene:energy-consumption-analytics", type: "function", fr: "Analyse des consommations et performance énergétique", en: "Energy consumption and performance analytics", frDefinition: "Analyse des consommations, coûts, pertes, pointes de charge et indicateurs de performance énergétique.", enDefinition: "Analysis of consumption, costs, losses, peak loads and energy performance indicators.", parentId: "domain:thermal-energy" },

  { id: "indicator-ene:service-continuity", type: "indicator", fr: "Taux de continuité du service énergétique", en: "Energy service continuity rate", frDefinition: "Mesure de la disponibilité du service sur une période et un périmètre définis.", enDefinition: "Measure of service availability over a defined period and scope.", parentId: "domain:electricity" },
  { id: "indicator-ene:outage-duration", type: "indicator", fr: "Durée moyenne des interruptions", en: "Average outage duration", frDefinition: "Durée moyenne des interruptions selon une méthode de calcul et une population définies.", enDefinition: "Average duration of outages under a defined calculation method and population.", parentId: "domain:electricity" },
  { id: "indicator-ene:technical-commercial-losses", type: "indicator", fr: "Taux de pertes énergétiques", en: "Energy loss rate", frDefinition: "Part de l'énergie perdue ou non comptabilisée par rapport à l'énergie injectée, selon le périmètre retenu.", enDefinition: "Share of energy lost or unaccounted for relative to energy injected, under the selected scope.", parentId: "domain:electricity" },
  { id: "indicator-ene:renewable-share", type: "indicator", fr: "Part de la production renouvelable", en: "Renewable generation share", frDefinition: "Part de l'énergie produite ou consommée provenant de sources renouvelables selon le périmètre retenu.", enDefinition: "Share of generated or consumed energy from renewable sources under the selected scope.", parentId: "domain:renewable-energy" },
  { id: "indicator-ene:energy-intensity", type: "indicator", fr: "Intensité énergétique", en: "Energy intensity", frDefinition: "Consommation d'énergie rapportée à une unité d'activité, de surface, de production ou de service.", enDefinition: "Energy consumption relative to a unit of activity, area, production or service.", parentId: "domain:thermal-energy" },
];

export const ENERGY_UTILITIES_CATALOG = SEEDS.map(makeConcept);
export const ENERGY_UTILITIES_SUBDOMAINS = ENERGY_UTILITIES_CATALOG.filter((item) => item.conceptType === "subdomain");
export const ENERGY_UTILITIES_FAMILY_ID = FAMILY_ID;
export const ENERGY_UTILITIES_RELATIONSHIPS: KnowledgeRelationship[] = [
  ...SUBDOMAINS.map((seed) => ({
    id: `rel:family-06-parent:${seed.id}`,
    sourceConceptId: seed.id,
    targetConceptId: seed.parentId!,
    predicate: "belongs_to_domain",
    status: "validated" as const,
    confidence: 1,
    sourceIds: [SOURCE_ID],
    version: 1,
  })),
  ...SEEDS.filter((seed) => seed.type === "occupation").map((seed) => ({
    id: `rel:family-06-occupation:${seed.id}`,
    sourceConceptId: seed.id,
    targetConceptId: FAMILY_ID,
    predicate: "works_in_family",
    status: "validated" as const,
    confidence: 1,
    sourceIds: [SOURCE_ID],
    version: 1,
  })),
  ...SEEDS.filter((seed) => ["activity", "process", "problem", "resource", "function", "indicator"].includes(seed.type)).map((seed) => ({
    id: `rel:family-06-concept:${seed.id}`,
    sourceConceptId: seed.id,
    targetConceptId: seed.parentId ?? FAMILY_ID,
    predicate: "related_to_energy_domain",
    status: "validated" as const,
    confidence: 1,
    sourceIds: [SOURCE_ID],
    version: 1,
  })),
];
