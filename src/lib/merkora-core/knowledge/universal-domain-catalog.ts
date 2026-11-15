import type { KnowledgeConcept } from "./types";

const CREATED_AT = "2026-11-15T00:00:00.000Z";

type FamilySeed = { id: string; fr: string; en: string; domains: Array<[string, string, string]> };

/**
 * MerKora's open 20-family / 100-domain starting map.
 * It is a navigation scaffold, not a closed list of human activities.
 * Domain labels are bilingual seed terms; additional language packs are
 * loaded through the same canonical IDs and never overwrite source labels.
 */
const FAMILIES: FamilySeed[] = [
  { id: "agriculture-living", fr: "Agriculture et vivant", en: "Agriculture and life sciences", domains: [
    ["agriculture", "Agriculture", "Agriculture"], ["livestock", "Élevage", "Animal husbandry"], ["fisheries", "Pêche et aquaculture", "Fishing and aquaculture"], ["forestry", "Foresterie", "Forestry"], ["food-production", "Production alimentaire", "Food production"],
  ]},
  { id: "environment-natural-resources", fr: "Environnement et ressources naturelles", en: "Environment and natural resources", domains: [
    ["environment", "Environnement", "Environment"], ["water-management", "Gestion de l'eau", "Water management"], ["waste-management", "Gestion des déchets", "Waste management"], ["climate-energy-transition", "Climat et transition écologique", "Climate and green transition"], ["natural-resource-management", "Gestion des ressources naturelles", "Natural resource management"],
  ]},
  { id: "extractive-industries", fr: "Industries extractives", en: "Extractive industries", domains: [
    ["mining", "Mines et carrières", "Mining and quarrying"], ["oil-gas", "Pétrole et gaz", "Oil and gas"], ["geology", "Géologie", "Geology"], ["mineral-processing", "Traitement des minerais", "Mineral processing"], ["extractive-safety", "Sécurité des industries extractives", "Extractive industry safety"],
  ]},
  { id: "construction-built-environment", fr: "Construction et cadre bâti", en: "Construction and built environment", domains: [
    ["architecture", "Architecture", "Architecture"], ["civil-engineering", "Génie civil", "Civil engineering"], ["building-construction", "Bâtiment et construction", "Building construction"], ["public-works", "Travaux publics", "Public works"], ["facility-management", "Gestion des bâtiments", "Facilities management"],
  ]},
  { id: "manufacturing-industry", fr: "Industrie et fabrication", en: "Industry and manufacturing", domains: [
    ["mechanical-engineering", "Génie mécanique", "Mechanical engineering"], ["electrical-engineering", "Génie électrique", "Electrical engineering"], ["electronics", "Électronique", "Electronics"], ["textile-fashion", "Textile et habillement", "Textiles and apparel"], ["industrial-production", "Production industrielle", "Industrial production"],
  ]},
  { id: "energy-utilities", fr: "Énergie et services essentiels", en: "Energy and utilities", domains: [
    ["electricity", "Électricité", "Electricity"], ["renewable-energy", "Énergies renouvelables", "Renewable energy"], ["gas-utilities", "Gaz et réseaux", "Gas utilities"], ["thermal-energy", "Énergie thermique", "Thermal energy"], ["utility-maintenance", "Maintenance des réseaux essentiels", "Utility maintenance"],
  ]},
  { id: "mobility-transport", fr: "Mobilité et transport", en: "Mobility and transport", domains: [
    ["road-transport", "Transport routier", "Road transport"], ["rail-transport", "Transport ferroviaire", "Rail transport"], ["maritime-transport", "Transport maritime", "Maritime transport"], ["aviation", "Aviation", "Aviation"], ["urban-mobility", "Mobilité urbaine", "Urban mobility"],
  ]},
  { id: "logistics-supply-chain", fr: "Logistique et chaîne d'approvisionnement", en: "Logistics and supply chain", domains: [
    ["warehousing", "Entreposage", "Warehousing"], ["freight-forwarding", "Transit et commission de transport", "Freight forwarding"], ["procurement", "Achats et approvisionnement", "Procurement"], ["inventory-management", "Gestion des stocks", "Inventory management"], ["postal-delivery", "Services postaux et livraison", "Postal and delivery services"],
  ]},
  { id: "commerce-markets", fr: "Commerce et marchés", en: "Commerce and markets", domains: [
    ["retail-trade", "Commerce de détail", "Retail trade"], ["wholesale-trade", "Commerce de gros", "Wholesale trade"], ["e-commerce", "Commerce électronique", "E-commerce"], ["sales-distribution", "Vente et distribution", "Sales and distribution"], ["marketing-advertising", "Marketing et publicité", "Marketing and advertising"],
  ]},
  { id: "hospitality-tourism-food", fr: "Hôtellerie, tourisme et restauration", en: "Hospitality, tourism and food services", domains: [
    ["hospitality", "Hôtellerie", "Hospitality"], ["restaurants-catering", "Restauration et traiteur", "Restaurants and catering"], ["tourism-travel", "Tourisme et voyage", "Tourism and travel"], ["events", "Événementiel", "Events"], ["recreation-leisure", "Loisirs et divertissement", "Recreation and leisure"],
  ]},
  { id: "finance-insurance", fr: "Finance, assurance et comptabilité", en: "Finance, insurance and accounting", domains: [
    ["banking", "Banque", "Banking"], ["accounting-audit", "Comptabilité et audit", "Accounting and audit"], ["insurance", "Assurance", "Insurance"], ["investment-finance", "Investissement et finance", "Investment and finance"], ["microfinance", "Microfinance", "Microfinance"],
  ]},
  { id: "business-management", fr: "Gestion et services aux organisations", en: "Management and business services", domains: [
    ["business-administration", "Administration des entreprises", "Business administration"], ["human-resources", "Ressources humaines", "Human resources"], ["consulting", "Conseil et accompagnement", "Consulting and advisory"], ["quality-risk-compliance", "Qualité, risques et conformité", "Quality, risk and compliance"], ["entrepreneurship", "Entrepreneuriat", "Entrepreneurship"],
  ]},
  { id: "public-governance", fr: "Administration publique et gouvernance", en: "Public administration and governance", domains: [
    ["public-administration", "Administration publique", "Public administration"], ["local-government", "Collectivités territoriales", "Local government"], ["public-finance", "Finances publiques", "Public finance"], ["diplomacy-international", "Diplomatie et relations internationales", "Diplomacy and international relations"], ["civil-registration", "État civil et services citoyens", "Civil registration and citizen services"],
  ]},
  { id: "education-training", fr: "Éducation et formation", en: "Education and training", domains: [
    ["early-childhood-education", "Petite enfance", "Early childhood education"], ["primary-secondary-education", "Enseignement primaire et secondaire", "Primary and secondary education"], ["higher-education", "Enseignement supérieur", "Higher education"], ["vocational-training", "Formation professionnelle", "Vocational training"], ["educational-technology", "Technologies éducatives", "Educational technology"],
  ]},
  { id: "science-research", fr: "Sciences et recherche", en: "Science and research", domains: [
    ["natural-sciences", "Sciences naturelles", "Natural sciences"], ["social-sciences", "Sciences sociales", "Social sciences"], ["mathematics-statistics", "Mathématiques et statistiques", "Mathematics and statistics"], ["research-development", "Recherche et développement", "Research and development"], ["laboratory-sciences", "Sciences de laboratoire", "Laboratory sciences"],
  ]},
  { id: "health-life-care", fr: "Santé et soins", en: "Health and care", domains: [
    ["medicine", "Médecine", "Medicine"], ["nursing-midwifery", "Soins infirmiers et maïeutique", "Nursing and midwifery"], ["pharmacy", "Pharmacie", "Pharmacy"], ["dentistry", "Médecine dentaire", "Dentistry"], ["public-health", "Santé publique", "Public health"],
  ]},
  { id: "social-community-services", fr: "Services sociaux et communautaires", en: "Social and community services", domains: [
    ["social-work", "Travail social", "Social work"], ["community-development", "Développement communautaire", "Community development"], ["child-family-services", "Services à l'enfance et aux familles", "Child and family services"], ["elderly-disability-care", "Accompagnement du grand âge et du handicap", "Elderly and disability care"], ["humanitarian-aid", "Aide humanitaire", "Humanitarian aid"],
  ]},
  { id: "culture-creative-industries", fr: "Culture et industries créatives", en: "Culture and creative industries", domains: [
    ["arts-performing-arts", "Arts et spectacle vivant", "Arts and performing arts"], ["heritage-museums", "Patrimoine et musées", "Heritage and museums"], ["design-creative", "Design et création", "Design and creative work"], ["crafts", "Artisanat", "Crafts"], ["sports-fitness", "Sport et condition physique", "Sports and fitness"],
  ]},
  { id: "media-communication", fr: "Médias et communication", en: "Media and communication", domains: [
    ["journalism", "Journalisme", "Journalism"], ["publishing", "Édition", "Publishing"], ["audiovisual-production", "Production audiovisuelle", "Audiovisual production"], ["public-relations", "Relations publiques", "Public relations"], ["telecommunications", "Télécommunications", "Telecommunications"],
  ]},
  { id: "digital-technology", fr: "Numérique et technologies", en: "Digital and technology", domains: [
    ["software-development", "Développement logiciel", "Software development"], ["it-infrastructure", "Infrastructures informatiques", "IT infrastructure"], ["cybersecurity", "Cybersécurité", "Cybersecurity"], ["data-ai", "Données et intelligence artificielle", "Data and artificial intelligence"], ["digital-services", "Services numériques", "Digital services"],
  ]},
];

const familyConcepts: KnowledgeConcept[] = FAMILIES.map((family) => ({
  id: `family:${family.id}`,
  canonicalKey: `merkora.family.${family.id}`,
  conceptType: "domain_family",
  definitions: [
    { language: "fr", label: family.fr, definition: `Famille de domaines : ${family.fr.toLocaleLowerCase("fr")}.` },
    { language: "en", label: family.en, definition: `Domain family: ${family.en.toLocaleLowerCase("en")}.` },
  ],
  terms: [
    { value: family.fr, language: "fr", kind: "preferred" },
    { value: family.en, language: "en", kind: "preferred" },
  ],
  classifications: [{ classificationType: "universal-domain" }, { classificationType: "universal-domain-family" }],
  attributes: [],
  relationships: [],
  scope: { global: true },
  lifecycle: { status: "validated", version: 1, createdAt: CREATED_AT, updatedAt: CREATED_AT },
  sources: [{ id: "source:merkora-domain-map-v1", sourceType: "curated_taxonomy", label: "Cartographie initiale MerKora GDJ — version 1" }],
  reliability: { evidenceLevel: "documented", reviewStatus: "not_reviewed", verificationNotes: ["Cartographie de départ à enrichir et faire relire par des spécialistes des contextes locaux."] },
}));

const domainConcepts: KnowledgeConcept[] = FAMILIES.flatMap((family) =>
  family.domains.map(([slug, fr, en]) => ({
    id: `domain:${slug}`,
    canonicalKey: `merkora.domain.${slug}`,
    conceptType: "domain",
    definitions: [
      { language: "fr", label: fr, definition: `Domaine d'activité couvrant les pratiques, organisations, opérations et compétences liées à ${fr.toLocaleLowerCase("fr")}.` },
      { language: "en", label: en, definition: `Field covering the practices, organisations, operations and skills related to ${en.toLocaleLowerCase("en")}.` },
    ],
    terms: [
      { value: fr, language: "fr", kind: "preferred" as const },
      { value: en, language: "en", kind: "preferred" as const },
    ],
    classifications: [
      { classificationType: "universal-domain", parentConceptId: `family:${family.id}` },
      { classificationType: "universal-domain-family", parentConceptId: `family:${family.id}` },
    ],
    attributes: [],
    relationships: [{
      id: `rel:domain-family:${slug}`,
      sourceConceptId: `domain:${slug}`,
      targetConceptId: `family:${family.id}`,
      predicate: "belongs_to_family",
      status: "validated",
      confidence: 1,
      sourceIds: ["source:merkora-domain-map-v1"],
      version: 1,
    }],
    scope: { global: true },
    lifecycle: { status: "validated", version: 1, createdAt: CREATED_AT, updatedAt: CREATED_AT },
    sources: [{ id: "source:merkora-domain-map-v1", sourceType: "curated_taxonomy", label: "Cartographie initiale MerKora GDJ — version 1" }],
    reliability: { evidenceLevel: "documented", reviewStatus: "not_reviewed", verificationNotes: ["Libellé générique de cartographie ; ne constitue pas une nomenclature réglementaire ou professionnelle nationale."] },
  })),
);

const SPECIALIZATION_SEEDS: Array<[string, string, string, string]> = [
  ["law-legal-services", "Droit et services juridiques", "Law and legal services", "domain:public-administration"],
  ["justice-courts", "Justice et juridictions", "Justice and courts", "domain:public-administration"],
  ["public-safety", "Sécurité publique", "Public safety", "domain:public-administration"],
  ["private-security", "Sécurité privée", "Private security", "domain:quality-risk-compliance"],
  ["personal-household-services", "Services personnels et domestiques", "Personal and household services", "domain:social-work"],
];

const specializationConcepts: KnowledgeConcept[] = SPECIALIZATION_SEEDS.map(([slug, fr, en, parentId]) => ({
  id: `specialization:${slug}`,
  canonicalKey: `merkora.specialization.${slug}`,
  conceptType: "specialization",
  definitions: [
    { language: "fr", label: fr, definition: `Spécialisation rattachée à un domaine parent : ${fr.toLocaleLowerCase("fr")}.` },
    { language: "en", label: en, definition: `Specialization within its parent field: ${en.toLocaleLowerCase("en")}.` },
  ],
  terms: [
    { value: fr, language: "fr", kind: "preferred" as const },
    { value: en, language: "en", kind: "preferred" as const },
  ],
  classifications: [{ classificationType: "universal-specialization", parentConceptId: parentId }],
  attributes: [],
  relationships: [],
  scope: { global: true },
  lifecycle: { status: "validated", version: 1, createdAt: CREATED_AT, updatedAt: CREATED_AT },
  sources: [{ id: "source:merkora-domain-map-v1", sourceType: "curated_taxonomy", label: "Cartographie initiale MerKora GDJ — spécialisation" }],
  reliability: { evidenceLevel: "documented", reviewStatus: "not_reviewed", verificationNotes: ["Spécialisation ouverte ; son rattachement est une structure de navigation, pas une équivalence réglementaire."] },
}));

export const UNIVERSAL_FAMILY_CONCEPTS = familyConcepts;
export const UNIVERSAL_DOMAIN_CONCEPTS = domainConcepts;
export const UNIVERSAL_SPECIALIZATION_CONCEPTS = specializationConcepts;
export const UNIVERSAL_DOMAIN_CATALOG = [...familyConcepts, ...domainConcepts, ...specializationConcepts];
export const UNIVERSAL_DOMAIN_FAMILY_COUNT = familyConcepts.length;
export const UNIVERSAL_FAMILY_COUNT = UNIVERSAL_DOMAIN_FAMILY_COUNT;
export const UNIVERSAL_DOMAIN_COUNT = domainConcepts.length;
export const UNIVERSAL_SPECIALIZATION_COUNT = specializationConcepts.length;
