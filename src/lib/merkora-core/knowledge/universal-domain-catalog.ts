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
  { id:"agriculture-agrofood",fr:"Agriculture et agroalimentaire",en:"Agriculture and agri-food",domains:[
    ["domain-v2:crop-production","Productions végétales","Crop production"],
    ["domain-v2:specialized-crop-systems","Productions agricoles spécialisées","Specialized agricultural production"],
    ["domain-v2:farm-management","Gestion des exploitations agricoles","Farm management"],
    ["domain-v2:agrofood-processing","Transformation agroalimentaire","Agri-food processing"],
    ["domain-v2:agricultural-marketing","Commercialisation agricole","Agricultural marketing"],
  ]},
  { id:"animals-veterinary",fr:"Animaux et services vétérinaires",en:"Animals and veterinary services",domains:[
    ["domain:livestock","Élevage et productions animales","Animal husbandry and livestock"],
    ["domain-vet:veterinary-medicine","Médecine vétérinaire et santé animale","Veterinary medicine and animal health"],
    ["domain-vet:animal-welfare-protection","Bien-être et protection animale","Animal welfare and protection"],
    ["domain-vet:animal-nutrition","Nutrition et alimentation animales","Animal nutrition and feeding"],
    ["domain-vet:animal-products-primary","Productions animales et collecte primaire","Animal products and primary collection"],
  ]},
  { id:"environment-natural-resources",fr:"Environnement et ressources naturelles",en:"Environment and natural resources",domains:[
    ["environment","Environnement","Environment"],["water-management","Gestion de l'eau","Water management"],["waste-management","Gestion des déchets","Waste management"],["climate-energy-transition","Climat et transition écologique","Climate and green transition"],["natural-resource-management","Gestion des ressources naturelles","Natural resource management"],
  ]},
  { id:"manufacturing-industry",fr:"Industrie et fabrication",en:"Industry and manufacturing",domains:[
    ["mechanical-engineering","Génie mécanique","Mechanical engineering"],["electrical-engineering","Génie électrique","Electrical engineering"],["electronics","Électronique","Electronics"],["textile-fashion","Textile et habillement","Textiles and apparel"],["industrial-production","Production industrielle","Industrial production"],
  ]},
  { id:"construction-built-environment",fr:"Construction et cadre bâti",en:"Construction and built environment",domains:[
    ["architecture","Architecture","Architecture"],["civil-engineering","Génie civil","Civil engineering"],["building-construction","Bâtiment et construction","Building construction"],["public-works","Travaux publics","Public works"],["facility-management","Gestion des bâtiments","Facilities management"],
  ]},
  { id:"energy-utilities",fr:"Énergie et services essentiels",en:"Energy and utilities",domains:[
    ["electricity","Électricité","Electricity"],["renewable-energy","Énergies renouvelables","Renewable energy"],["gas-utilities","Gaz et réseaux","Gas utilities"],["thermal-energy","Énergie thermique","Thermal energy"],["utility-maintenance","Maintenance des réseaux essentiels","Utility maintenance"],
  ]},
  { id:"mobility-transport",fr:"Mobilité et transport",en:"Mobility and transport",domains:[
    ["road-transport","Transport routier","Road transport"],["rail-transport","Transport ferroviaire","Rail transport"],["maritime-transport","Transport maritime","Maritime transport"],["aviation","Aviation","Aviation"],["urban-mobility","Mobilité urbaine","Urban mobility"],
  ]},
  { id:"logistics-supply-chain",fr:"Logistique et chaîne d'approvisionnement",en:"Logistics and supply chain",domains:[
    ["warehousing","Entreposage","Warehousing"],["freight-forwarding","Transit et commission de transport","Freight forwarding"],["procurement","Achats et approvisionnement","Procurement"],["inventory-management","Gestion des stocks","Inventory management"],["postal-delivery","Services postaux et livraison","Postal and delivery services"],
  ]},
  { id:"commerce-markets",fr:"Commerce et marchés",en:"Commerce and markets",domains:[
    ["retail-trade","Commerce de détail","Retail trade"],["wholesale-trade","Commerce de gros","Wholesale trade"],["e-commerce","Commerce électronique","E-commerce"],["sales-distribution","Vente et distribution","Sales and distribution"],["marketing-advertising","Marketing et publicité","Marketing and advertising"],
  ]},
  { id:"finance-insurance",fr:"Finance, assurance et comptabilité",en:"Finance, insurance and accounting",domains:[
    ["banking","Banque","Banking"],["accounting-audit","Comptabilité et audit","Accounting and audit"],["insurance","Assurance","Insurance"],["investment-finance","Investissement et finance","Investment and finance"],["microfinance","Microfinance","Microfinance"],
  ]},
  { id:"public-governance",fr:"Administration publique et gouvernance",en:"Public administration and governance",domains:[
    ["public-administration","Administration publique","Public administration"],["local-government","Collectivités territoriales","Local government"],["public-finance","Finances publiques","Public finance"],["diplomacy-international","Diplomatie et relations internationales","Diplomacy and international relations"],["civil-registration","État civil et services citoyens","Civil registration and citizen services"],
  ]},
  { id:"legal-services",fr:"Droit et services juridiques",en:"Law and legal services",domains:[
    ["business-law","Droit des affaires","Business law"],["civil-family-law","Droit civil et familial","Civil and family law"],["labor-employment-law","Droit du travail","Labor and employment law"],["justice-litigation","Justice et contentieux","Justice and litigation"],["legal-advice-documents","Conseil juridique et actes","Legal advice and instruments"],
  ]},
  { id:"education-research",fr:"Éducation et recherche",en:"Education and research",domains:[
    ["primary-secondary-education","Enseignement scolaire","School education"],["higher-education","Enseignement supérieur","Higher education"],["vocational-training","Formation professionnelle","Vocational education and training"],["research-development","Recherche scientifique","Scientific research"],["career-guidance","Orientation et accompagnement des parcours","Career guidance and pathway support"],
  ]},
  { id:"health-social-services",fr:"Santé et services sociaux",en:"Health and social services",domains:[
    ["medicine","Médecine et consultations","Medicine and consultations"],["nursing-midwifery","Soins infirmiers et hospitaliers","Nursing and hospital care"],["clinical-diagnostics","Laboratoires et diagnostic","Laboratories and diagnostics"],["pharmacy","Pharmacie et produits de santé","Pharmacy and health products"],["social-work","Services sociaux et accompagnement","Social services and support"],
  ]},
  { id:"sport-physical-activity",fr:"Sport et activités physiques",en:"Sport and physical activity",domains:[
    ["team-sports","Sports collectifs","Team sports"],["individual-sports","Sports individuels","Individual sports"],["fitness-conditioning","Fitness et préparation physique","Fitness and physical conditioning"],["sports-clubs","Clubs et organisations sportives","Sports clubs and organizations"],["sports-performance","Performance et encadrement sportif","Sports performance and coaching"],
  ]},
  { id:"culture-arts",fr:"Culture et arts",en:"Culture and arts",domains:[
    ["dance-movement","Danse et arts du mouvement","Dance and movement arts"],["music-sound","Musique et arts sonores","Music and sound arts"],["visual-arts","Arts visuels et création plastique","Visual and fine arts"],["cultural-performance","Spectacle et événementiel culturel","Cultural performance and events"],["heritage-institutions","Patrimoine et institutions culturelles","Heritage and cultural institutions"],
  ]},
  { id:"media-communication",fr:"Médias et communication",en:"Media and communication",domains:[
    ["journalism","Presse et journalisme","Press and journalism"],["audiovisual-production","Production audiovisuelle","Audiovisual production"],["media-advertising","Publicité et planification média","Media advertising and planning"],["public-relations","Communication institutionnelle et relations publiques","Institutional communication and public relations"],["content-management","Création et gestion de contenus","Content creation and management"],
  ]},
  { id:"digital-technology",fr:"Numérique et télécommunications",en:"Digital technology and telecommunications",domains:[
    ["software-development","Développement logiciel","Software development"],["it-infrastructure","Infrastructure informatique","IT infrastructure"],["telecommunications","Télécommunications et connectivité","Telecommunications and connectivity"],["cybersecurity","Cybersécurité","Cybersecurity"],["data-ai","Données et intelligence artificielle","Data and artificial intelligence"],
  ]},
  { id:"business-management",fr:"Services professionnels et entreprises",en:"Professional services and business",domains:[
    ["business-administration","Administration des entreprises","Business administration"],["human-resources","Ressources humaines","Human resources"],["consulting","Conseil et accompagnement","Consulting and advisory"],["quality-risk-compliance","Qualité, risques et conformité","Quality, risk and compliance"],["entrepreneurship","Entrepreneuriat","Entrepreneurship"],
  ]},
  { id:"crafts-personal-services",fr:"Artisanat et services personnels",en:"Crafts and personal services",domains:[
    ["crafts","Artisanat et production artisanale","Crafts and artisanal production"],["beauty-personal-care","Beauté et soins personnels","Beauty and personal care"],["repair-maintenance","Réparation et maintenance","Repair and maintenance"],["domestic-services","Services domestiques et à domicile","Domestic and home services"],["local-personal-services","Services personnels et de proximité","Personal and local services"],
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

const canonicalDomainId = (reference: string) =>
  /^(domain|domain-v2|domain-vet):/.test(reference) ? reference : `domain:${reference}`;
const domainKey = (reference: string) => reference.replace(/^(domain-v2|domain-vet|domain):/, "").replace(/-/g, ".");

const domainConcepts: KnowledgeConcept[] = FAMILIES.flatMap((family) =>
  family.domains.map(([reference, fr, en]) => {
    const conceptId = canonicalDomainId(reference);
    const key = domainKey(reference);
    const familyId = `family:${family.id}`;
    const animalFamilyClassifications = family.id === "animals-veterinary"
      ? [{ classificationType: "foundation-a-family-v2", parentConceptId: familyId }]
      : [];
    return ({
    id: conceptId,
    canonicalKey: `merkora.domain.${key}`,
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
      { classificationType: "universal-domain", parentConceptId: familyId },
      { classificationType: "universal-domain-family", parentConceptId: familyId },
      ...animalFamilyClassifications,
    ],
    attributes: [],
    relationships: [{
      id: `rel:domain-family:${key}`,
      sourceConceptId: conceptId,
      targetConceptId: familyId,
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
  });
  }),
);


const ADDITIONAL_SUBDOMAIN_SEEDS: Array<[string,string,string,string]> = [
 ["domain:agriculture","Agriculture générale","General agriculture","domain-v2:farm-management"],
 ["domain:fisheries","Pêche et aquaculture","Fishing and aquaculture","domain-v2:farm-management"],
 ["domain:forestry","Foresterie et gestion forestière","Forestry and forest management","domain-v2:farm-management"],
 ["domain:food-production","Production et transformation alimentaire","Food production and processing","domain-v2:agrofood-processing"],
 ["domain:mining","Mines et carrières","Mining and quarrying","domain:industrial-production"],
 ["domain:oil-gas","Pétrole et gaz","Oil and gas","domain:industrial-production"],
 ["domain:geology","Géologie appliquée","Applied geology","domain:industrial-production"],
 ["domain:mineral-processing","Traitement des minerais","Mineral processing","domain:industrial-production"],
 ["domain:extractive-safety","Sécurité des industries extractives","Extractive industry safety","domain:industrial-production"],
 ["domain:hospitality","Hôtellerie et accueil","Hospitality and guest services","domain:business-administration"],
 ["domain:restaurants-catering","Restauration et traiteur","Restaurants and catering","domain:local-personal-services"],
 ["domain:tourism-travel","Tourisme et voyage","Tourism and travel","domain:business-administration"],
 ["domain:events","Événementiel","Events","domain:cultural-performance"],
 ["domain:recreation-leisure","Loisirs et divertissement","Recreation and leisure","domain:fitness-conditioning"],
 ["domain:early-childhood-education","Éducation de la petite enfance","Early childhood education","domain:primary-secondary-education"],
 ["domain:educational-technology","Technologies éducatives","Educational technology","domain:primary-secondary-education"],
 ["domain:natural-sciences","Sciences naturelles","Natural sciences","domain:research-development"],
 ["domain:social-sciences","Sciences sociales","Social sciences","domain:research-development"],
 ["domain:mathematics-statistics","Mathématiques et statistiques","Mathematics and statistics","domain:research-development"],
 ["domain:laboratory-sciences","Sciences de laboratoire","Laboratory sciences","domain:research-development"],
 ["domain:dentistry","Médecine dentaire","Dentistry","domain:medicine"],
 ["domain:public-health","Santé publique","Public health","domain:medicine"],
 ["domain:community-development","Développement communautaire","Community development","domain:social-work"],
 ["domain:child-family-services","Services à l'enfance et aux familles","Child and family services","domain:social-work"],
 ["domain:elderly-disability-care","Accompagnement du grand âge et du handicap","Elderly and disability care","domain:social-work"],
 ["domain:humanitarian-aid","Aide humanitaire","Humanitarian aid","domain:social-work"],
 ["domain:arts-performing-arts","Arts et spectacle vivant","Arts and performing arts","domain:cultural-performance"],
 ["domain:heritage-museums","Patrimoine et musées","Heritage and museums","domain:heritage-institutions"],
 ["domain:design-creative","Design et création","Design and creative work","domain:visual-arts"],
 ["domain:sports-fitness","Sport et condition physique","Sports and fitness","domain:fitness-conditioning"],
 ["domain:publishing","Édition et publication","Publishing","domain:content-management"],
 ["domain:digital-services","Services numériques et plateformes","Digital services and platforms","domain:software-development"],
];
const additionalSubdomainConcepts: KnowledgeConcept[] = ADDITIONAL_SUBDOMAIN_SEEDS.map(([id,fr,en,parentConceptId]) => {
 const slug=id.replace(/^domain:/,"");
 return {
  id,canonicalKey:`merkora.subdomain.legacy.${slug}`,conceptType:"subdomain",
  definitions:[
   {language:"fr",label:fr,definition:`Champ spécialisé conservé dans le référentiel universel et rattaché au domaine canonique ${parentConceptId}.`},
   {language:"en",label:en,definition:`Specialized field retained in the universal knowledge graph and linked to canonical domain ${parentConceptId}.`}
  ],
  terms:[{value:fr,language:"fr",kind:"preferred"},{value:en,language:"en",kind:"preferred"}],
  classifications:[{classificationType:"universal-domain",parentConceptId}],
  attributes:[],relationships:[],scope:{global:true},
  lifecycle:{status:"validated",version:1,createdAt:CREATED_AT,updatedAt:CREATED_AT},
  sources:[{id:"source:merkora-domain-map-v2",sourceType:"curated_taxonomy",label:"Raccordement des anciennes branches au référentiel 20 familles"}],
  reliability:{evidenceLevel:"documented",reviewStatus:"not_reviewed",verificationNotes:["Identifiant historique conservé ; ce concept est désormais un sous-domaine transversal, pas un domaine canonique de premier niveau."]}
 };
});

const CROSS_SECTOR_SEEDS: Array<[string,string,string,string[]]> = [
 ["family:agriculture-living","Agriculture et vivant","Agriculture and life sciences",["family:agriculture-agrofood"]],
 ["family:extractive-industries","Industries extractives","Extractive industries",["family:manufacturing-industry"]],
 ["family:hospitality-tourism-food","Hôtellerie, tourisme et restauration","Hospitality, tourism and food services",["family:business-management","family:crafts-personal-services","family:culture-arts"]],
 ["family:education-training","Éducation et formation","Education and training",["family:education-research"]],
 ["family:science-research","Sciences et recherche","Science and research",["family:education-research"]],
 ["family:health-life-care","Santé et soins","Health and care",["family:health-social-services"]],
 ["family:social-community-services","Services sociaux et communautaires","Social and community services",["family:health-social-services"]],
 ["family:culture-creative-industries","Culture et industries créatives","Culture and creative industries",["family:culture-arts","family:crafts-personal-services"]],
];
const crossSectorConcepts: KnowledgeConcept[] = CROSS_SECTOR_SEEDS.map(([id,fr,en,parents])=>({
 id,canonicalKey:`merkora.sector-profile.${id.replace("family:","")}`,conceptType:"sector_profile",
 definitions:[{language:"fr",label:fr,definition:`Profil sectoriel transversal conservé pour assurer la continuité des anciennes cartographies : ${fr.toLocaleLowerCase("fr")}.`},{language:"en",label:en,definition:`Cross-sector profile retained for continuity with earlier maps: ${en.toLocaleLowerCase("en")}.`}],
 terms:[{value:fr,language:"fr",kind:"preferred"},{value:en,language:"en",kind:"preferred"}],
 classifications:parents.map(parentConceptId=>({classificationType:"universal-domain-family",parentConceptId})),
 attributes:[],relationships:[],scope:{global:true},
 lifecycle:{status:"validated",version:1,createdAt:CREATED_AT,updatedAt:CREATED_AT},
 sources:[{id:"source:merkora-domain-map-v2",sourceType:"curated_taxonomy",label:"Profils sectoriels transversaux — continuité des anciennes familles"}],
 reliability:{evidenceLevel:"documented",reviewStatus:"not_reviewed",verificationNotes:["Profil transversal non compté parmi les 20 familles canoniques. Son rattachement indique des relations de proximité, pas une fusion des métiers ou des responsabilités."]}
}));

const SPECIALIZATION_SEEDS: Array<[string, string, string, string]> = [
  ["law-legal-services", "Droit et services juridiques", "Law and legal services", "domain:legal-advice-documents"],
  ["justice-courts", "Justice et juridictions", "Justice and courts", "domain:justice-litigation"],
  ["public-safety", "Sécurité publique", "Public safety", "domain:public-administration"],
  ["private-security", "Sécurité privée", "Private security", "domain:quality-risk-compliance"],
  ["personal-household-services", "Services personnels et domestiques", "Personal and household services", "domain:local-personal-services"],
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
export const UNIVERSAL_ADDITIONAL_SUBDOMAIN_CONCEPTS = additionalSubdomainConcepts;\nexport const UNIVERSAL_CROSS_SECTOR_CONCEPTS = crossSectorConcepts;\nexport const UNIVERSAL_DOMAIN_CATALOG = [...familyConcepts, ...domainConcepts, ...specializationConcepts, ...additionalSubdomainConcepts, ...crossSectorConcepts];
export const UNIVERSAL_DOMAIN_FAMILY_COUNT = familyConcepts.length;
export const UNIVERSAL_FAMILY_COUNT = UNIVERSAL_DOMAIN_FAMILY_COUNT;
export const UNIVERSAL_DOMAIN_COUNT = domainConcepts.length;
export const UNIVERSAL_SPECIALIZATION_COUNT = specializationConcepts.length;
