import type { KnowledgeConcept, KnowledgeRelationship } from "./types";

const CREATED_AT = "2026-11-16T00:00:00.000Z";
const SOURCE_ID = "source:merkora-family-01-agriculture-agrofood-v1";

type Seed = {
  id: string;
  type: string;
  fr: string;
  en: string;
  frDefinition: string;
  enDefinition: string;
  terms?: Array<{ value: string; language?: string; kind?: "preferred" | "synonym" | "local" | "abbreviation" | "variant"; region?: string; usage?: string }>;
  parentId?: string;
  parentKind?: "domain" | "subdomain" | "specialization";
};

function makeConcept(seed: Seed): KnowledgeConcept {
  const terms = [
    { value: seed.fr, language: "fr", kind: "preferred" as const },
    { value: seed.en, language: "en", kind: "preferred" as const },
    ...(seed.terms ?? []).map((term) => ({
      value: term.value,
      language: term.language ?? "fr",
      kind: term.kind ?? "synonym",
      ...(term.region ? { region: term.region } : {}),
      ...(term.usage ? { usage: term.usage } : {}),
    })),
  ];
  const classifications = seed.parentId
    ? [{ classificationType: "foundation-a-family-v2", parentConceptId: seed.parentId }, { classificationType: "universal-domain", parentConceptId: seed.parentId }]
    : [];

  return {
    id: seed.id,
    canonicalKey: `merkora.${seed.type}.${seed.id.replace(/^[^:]+:/, "")}`,
    conceptType: seed.type,
    definitions: [
      { language: "fr", label: seed.fr, definition: seed.frDefinition },
      { language: "en", label: seed.en, definition: seed.enDefinition },
    ],
    terms,
    classifications,
    attributes: [],
    relationships: [],
    scope: { global: true },
    lifecycle: {
      status: "validated",
      version: 1,
      createdAt: CREATED_AT,
      updatedAt: CREATED_AT,
    },
    sources: [{
      id: SOURCE_ID,
      sourceType: "curated_domain_knowledge",
      label: "MerKora GDJ — Famille 01 Agriculture et agroalimentaire, version 1",
    }],
    reliability: {
      evidenceLevel: "documented",
      reviewStatus: "not_reviewed",
      verificationNotes: [
        "Contenu de référence initial rédigé par MerKora ; les pratiques, termes et règles doivent être contextualisés et revus par des spécialistes locaux avant tout usage opérationnel.",
      ],
    },
  };
}

const FAMILY_SEED: Seed = {
  id: "family:agriculture-agrofood",
  type: "domain_family",
  fr: "Agriculture et agroalimentaire",
  en: "Agriculture and agri-food",
  frDefinition: "Famille couvrant la production végétale, l'organisation des exploitations, les services et ressources agricoles, la transformation des produits agricoles et leur mise en marché, sans absorber automatiquement l'élevage, la pêche ou la foresterie qui disposent de domaines propres.",
  enDefinition: "Family covering crop production, farm organization, agricultural services and resources, processing of agricultural products and their route to market, without automatically absorbing livestock, fisheries or forestry, which have their own domains.",
};

const DOMAIN_SEEDS: Seed[] = [
  {
    id: "domain-v2:crop-production", type: "domain", fr: "Productions végétales", en: "Crop production",
    frDefinition: "Production de plantes cultivées destinées à l'alimentation, à l'industrie, au commerce ou à d'autres usages, depuis la préparation de la parcelle jusqu'à la récolte.",
    enDefinition: "Cultivation of plants for food, industry, trade or other uses, from plot preparation through harvesting.",
    parentId: FAMILY_SEED.id, parentKind: "domain",
  },
  {
    id: "domain-v2:specialized-crop-systems", type: "domain", fr: "Productions agricoles spécialisées", en: "Specialized agricultural production",
    frDefinition: "Systèmes spécialisés de production végétale, notamment l'horticulture, les cultures protégées, les pépinières, les semences et les productions à forte technicité.",
    enDefinition: "Specialized crop systems including horticulture, protected cultivation, nurseries, seed production and technically intensive crops.",
    parentId: FAMILY_SEED.id, parentKind: "domain",
  },
  {
    id: "domain-v2:farm-management", type: "domain", fr: "Gestion des exploitations agricoles", en: "Farm management",
    frDefinition: "Organisation des terres, des ressources, des intrants, des équipements, du travail, des finances, des calendriers et des décisions d'une exploitation agricole.",
    enDefinition: "Organization of land, resources, inputs, equipment, labour, finances, calendars and decisions within a farm.",
    parentId: FAMILY_SEED.id, parentKind: "domain",
  },
  {
    id: "domain-v2:agrofood-processing", type: "domain", fr: "Transformation agroalimentaire", en: "Agri-food processing",
    frDefinition: "Opérations qui transforment, conservent, conditionnent ou préparent les matières premières agricoles en produits alimentaires ou ingrédients, avec maîtrise de la qualité et de l'hygiène.",
    enDefinition: "Operations that transform, preserve, package or prepare agricultural raw materials into food products or ingredients while managing quality and hygiene.",
    parentId: FAMILY_SEED.id, parentKind: "domain",
  },
  {
    id: "domain-v2:agricultural-marketing", type: "domain", fr: "Commercialisation agricole", en: "Agricultural marketing",
    frDefinition: "Organisation de la collecte, du regroupement, du stockage commercial, de la négociation, de la vente et de la distribution des produits agricoles.",
    enDefinition: "Organization of collection, aggregation, commercial storage, negotiation, sale and distribution of agricultural products.",
    parentId: FAMILY_SEED.id, parentKind: "domain",
  },
];

const SUBDOMAIN_SEEDS: Seed[] = [
  // Productions végétales
  { id: "subdomain-v2:field-crops", type: "subdomain", fr: "Grandes cultures", en: "Field crops", frDefinition: "Cultures pratiquées sur des surfaces agricoles importantes, notamment céréales, légumineuses et cultures industrielles.", enDefinition: "Field-scale crops, including cereals, legumes and industrial crops.", parentId: "domain-v2:crop-production", parentKind: "domain" },
  { id: "subdomain-v2:cereal-crops", type: "subdomain", fr: "Cultures céréalières", en: "Cereal crops", frDefinition: "Production de céréales telles que maïs, riz, sorgho, mil et autres grains.", enDefinition: "Production of cereals such as maize, rice, sorghum, millet and other grains.", parentId: "domain-v2:crop-production", parentKind: "domain", terms: [{ value: "culture du maïs" }, { value: "maïs" }, { value: "riz" }, { value: "riziculture" }, { value: "sorgho" }, { value: "mil" }, { value: "fonio" }, { value: "production de sorgho" }] },
  { id: "subdomain-v2:legume-crops", type: "subdomain", fr: "Cultures de légumineuses", en: "Legume crops", frDefinition: "Production de légumineuses alimentaires ou commerciales, notamment niébé, soja, arachide et haricot.", enDefinition: "Production of food or commercial legumes such as cowpea, soybean, groundnut and beans.", parentId: "domain-v2:crop-production", parentKind: "domain", terms: [{ value: "niébé" }, { value: "soja" }, { value: "arachide" }, { value: "haricot" }] },
  { id: "subdomain-v2:tuber-crops", type: "subdomain", fr: "Cultures de tubercules et racines", en: "Root and tuber crops", frDefinition: "Production de cultures telles que manioc, igname, patate douce et autres racines alimentaires.", enDefinition: "Production of cassava, yam, sweet potato and other edible roots and tubers.", parentId: "domain-v2:crop-production", parentKind: "domain", terms: [{ value: "manioc" }, { value: "igname" }, { value: "patate douce" }] },
  { id: "subdomain-v2:market-gardening", type: "subdomain", fr: "Maraîchage", en: "Market gardening", frDefinition: "Production de légumes, feuilles, fruits potagers et plantes condimentaires destinés notamment aux marchés frais.", enDefinition: "Production of vegetables, leafy crops and culinary plants, often for fresh markets.", parentId: "domain-v2:crop-production", parentKind: "domain", terms: [{ value: "cultures maraîchères" }, { value: "production de légumes" }, { value: "tomate" }, { value: "piment" }, { value: "légumes frais" }] },
  { id: "subdomain-v2:fruit-production", type: "subdomain", fr: "Arboriculture fruitière", en: "Fruit growing", frDefinition: "Production de fruits issus d'arbres, arbustes ou plantes fruitières pérennes ou saisonnières.", enDefinition: "Production of fruit from trees, shrubs or perennial and seasonal fruit plants.", parentId: "domain-v2:crop-production", parentKind: "domain" },
  { id: "subdomain-v2:industrial-crops", type: "subdomain", fr: "Cultures industrielles", en: "Industrial crops", frDefinition: "Cultures destinées principalement à la transformation industrielle, par exemple coton, palmier à huile, canne à sucre ou hévéa.", enDefinition: "Crops primarily intended for industrial processing, such as cotton, oil palm, sugar cane or rubber.", parentId: "domain-v2:crop-production", parentKind: "domain", terms: [{ value: "coton" }, { value: "palmier à huile" }, { value: "canne à sucre" }, { value: "hévéa" }] },
  // Productions spécialisées
  { id: "subdomain-v2:horticulture", type: "subdomain", fr: "Horticulture", en: "Horticulture", frDefinition: "Production et conduite de plantes alimentaires, ornementales ou spécialisées selon des techniques horticoles.", enDefinition: "Production and cultivation of food, ornamental or specialized plants using horticultural techniques.", parentId: "domain-v2:specialized-crop-systems", parentKind: "domain" },
  { id: "subdomain-v2:protected-cultivation", type: "subdomain", fr: "Cultures sous abri", en: "Protected cultivation", frDefinition: "Production végétale sous serre, tunnel, ombrière ou autre dispositif protégeant les cultures.", enDefinition: "Crop production in greenhouses, tunnels, shade structures or other protected systems.", parentId: "domain-v2:specialized-crop-systems", parentKind: "domain", terms: [{ value: "culture sous serre" }, { value: "serriculture" }] },
  { id: "subdomain-v2:nurseries", type: "subdomain", fr: "Pépinières végétales", en: "Plant nurseries", frDefinition: "Multiplication, élevage et vente de plants, jeunes arbres, plants fruitiers et matériel végétal.", enDefinition: "Propagation, growing and sale of seedlings, young trees, fruit plants and planting material.", parentId: "domain-v2:specialized-crop-systems", parentKind: "domain" },
  { id: "subdomain-v2:seed-production", type: "subdomain", fr: "Production de semences", en: "Seed production", frDefinition: "Production, sélection, multiplication, conditionnement et contrôle des semences destinées aux semis.", enDefinition: "Production, selection, multiplication, packaging and quality control of seeds for planting.", parentId: "domain-v2:specialized-crop-systems", parentKind: "domain", terms: [{ value: "semences" }, { value: "graines de semis" }] },
  { id: "subdomain-v2:floriculture", type: "subdomain", fr: "Floriculture et plantes ornementales", en: "Floriculture and ornamental plants", frDefinition: "Production de fleurs coupées, plantes décoratives et végétaux d'ornement.", enDefinition: "Production of cut flowers, decorative plants and ornamental vegetation.", parentId: "domain-v2:specialized-crop-systems", parentKind: "domain" },
  // Gestion de l'exploitation
  { id: "subdomain-v2:land-plot-management", type: "subdomain", fr: "Gestion des terres et parcelles", en: "Land and plot management", frDefinition: "Identification, description, affectation et suivi des parcelles, superficies, limites, usages et historiques culturaux.", enDefinition: "Identification, description, allocation and monitoring of plots, areas, boundaries, uses and crop histories.", parentId: "domain-v2:farm-management", parentKind: "domain", terms: [{ value: "champ", kind: "local", region: "BJ" }, { value: "parcelle cultivée" }] },
  { id: "subdomain-v2:soil-management", type: "subdomain", fr: "Gestion des sols", en: "Soil management", frDefinition: "Observation, analyse, préparation, fertilité, conservation et amélioration des sols agricoles.", enDefinition: "Observation, analysis, preparation, fertility, conservation and improvement of agricultural soils.", parentId: "domain-v2:farm-management", parentKind: "domain" },
  { id: "subdomain-v2:irrigation-water-management", type: "subdomain", fr: "Irrigation et gestion de l'eau agricole", en: "Irrigation and agricultural water management", frDefinition: "Captage, stockage, distribution, programmation et contrôle de l'eau utilisée pour les cultures.", enDefinition: "Capture, storage, distribution, scheduling and control of water used for crops.", parentId: "domain-v2:farm-management", parentKind: "domain", terms: [{ value: "arrosage agricole" }, { value: "gestion de l'eau des cultures" }] },
  { id: "subdomain-v2:agricultural-inputs", type: "subdomain", fr: "Intrants agricoles", en: "Agricultural inputs", frDefinition: "Gestion des semences, plants, engrais, amendements, produits phytosanitaires et autres consommables de production.", enDefinition: "Management of seeds, seedlings, fertilizers, soil amendments, crop protection products and other production consumables.", parentId: "domain-v2:farm-management", parentKind: "domain" },
  { id: "subdomain-v2:agricultural-mechanization", type: "subdomain", fr: "Machinisme et équipements agricoles", en: "Agricultural machinery and equipment", frDefinition: "Choix, utilisation, entretien et réparation des machines, outils et équipements agricoles.", enDefinition: "Selection, use, maintenance and repair of agricultural machinery, tools and equipment.", parentId: "domain-v2:farm-management", parentKind: "domain" },
  { id: "subdomain-v2:farm-labour-management", type: "subdomain", fr: "Main-d'œuvre agricole", en: "Agricultural workforce management", frDefinition: "Organisation des équipes, tâches, horaires, compétences, rémunérations et travaux saisonniers.", enDefinition: "Organization of teams, tasks, schedules, skills, remuneration and seasonal labour.", parentId: "domain-v2:farm-management", parentKind: "domain" },
  { id: "subdomain-v2:farm-economics", type: "subdomain", fr: "Économie et gestion financière agricole", en: "Farm economics and financial management", frDefinition: "Suivi des coûts, investissements, recettes, marges, budgets, crédits et rentabilité d'une exploitation.", enDefinition: "Monitoring farm costs, investments, income, margins, budgets, credit and profitability.", parentId: "domain-v2:farm-management", parentKind: "domain" },
  // Transformation
  { id: "subdomain-v2:postharvest-handling", type: "subdomain", fr: "Opérations post-récolte", en: "Post-harvest handling", frDefinition: "Opérations après récolte : réception, tri, nettoyage, séchage, calibrage, conservation et préparation au stockage ou à la vente.", enDefinition: "After-harvest operations including receiving, sorting, cleaning, drying, grading, preservation and preparation for storage or sale.", parentId: "domain-v2:agrofood-processing", parentKind: "domain", terms: [{ value: "post-récolte" }, { value: "après récolte" }] },
  { id: "subdomain-v2:food-preservation", type: "subdomain", fr: "Conservation des produits alimentaires", en: "Food preservation", frDefinition: "Techniques de conservation des denrées par séchage, refroidissement, congélation, fermentation ou autres procédés appropriés.", enDefinition: "Food preservation through drying, cooling, freezing, fermentation or other suitable processes.", parentId: "domain-v2:agrofood-processing", parentKind: "domain" },
  { id: "subdomain-v2:food-transformation", type: "subdomain", fr: "Transformation des matières premières agricoles", en: "Agricultural raw material processing", frDefinition: "Transformation de matières premières agricoles en aliments, ingrédients ou produits à valeur ajoutée.", enDefinition: "Processing agricultural raw materials into food, ingredients or value-added products.", parentId: "domain-v2:agrofood-processing", parentKind: "domain" },
  { id: "subdomain-v2:food-packaging", type: "subdomain", fr: "Conditionnement et emballage alimentaire", en: "Food packaging", frDefinition: "Choix des emballages, remplissage, fermeture, étiquetage, identification des lots et préparation à la distribution.", enDefinition: "Selection of packaging, filling, sealing, labelling, batch identification and preparation for distribution.", parentId: "domain-v2:agrofood-processing", parentKind: "domain" },
  { id: "subdomain-v2:food-quality-safety", type: "subdomain", fr: "Qualité et sécurité sanitaire des aliments", en: "Food quality and safety", frDefinition: "Contrôle des caractéristiques, de l'hygiène, des dangers, de la conformité et de la traçabilité des produits alimentaires.", enDefinition: "Control of food characteristics, hygiene, hazards, compliance and traceability.", parentId: "domain-v2:agrofood-processing", parentKind: "domain" },
  // Commercialisation
  { id: "subdomain-v2:agricultural-collection", type: "subdomain", fr: "Collecte et regroupement des récoltes", en: "Agricultural collection and aggregation", frDefinition: "Organisation de la collecte auprès des producteurs, pesée, réception, regroupement et constitution de lots commerciaux.", enDefinition: "Organization of collection from producers, weighing, receiving, aggregation and creation of commercial lots.", parentId: "domain-v2:agricultural-marketing", parentKind: "domain" },
  { id: "subdomain-v2:cooperatives", type: "subdomain", fr: "Coopératives agricoles", en: "Agricultural cooperatives", frDefinition: "Organisation collective de producteurs pour mutualiser les achats, services, équipements, collecte, transformation ou commercialisation.", enDefinition: "Collective organization of producers to share procurement, services, equipment, collection, processing or marketing.", parentId: "domain-v2:agricultural-marketing", parentKind: "domain", terms: [{ value: "coopérative agricole" }, { value: "groupement de producteurs" }, { value: "organisation paysanne" }] },
  { id: "subdomain-v2:agricultural-storage", type: "subdomain", fr: "Stockage et entreposage agricole", en: "Agricultural storage and warehousing", frDefinition: "Gestion des lieux, conditions, mouvements, quantités, pertes et durées de stockage des récoltes et produits agricoles.", enDefinition: "Management of locations, conditions, movements, quantities, losses and storage duration for crops and agricultural products.", parentId: "domain-v2:agricultural-marketing", parentKind: "domain" },
  { id: "subdomain-v2:agricultural-trade", type: "subdomain", fr: "Négociation et vente des produits agricoles", en: "Agricultural trade and sales", frDefinition: "Détermination des offres, prix, quantités, contrats, commandes et conditions de vente des produits agricoles.", enDefinition: "Setting offers, prices, quantities, contracts, orders and sales terms for agricultural products.", parentId: "domain-v2:agricultural-marketing", parentKind: "domain" },
  { id: "subdomain-v2:agricultural-distribution", type: "subdomain", fr: "Distribution et acheminement des produits agricoles", en: "Agricultural distribution and transport", frDefinition: "Organisation du transport, de la livraison, des circuits de distribution et de la remise des produits aux acheteurs.", enDefinition: "Organization of transport, delivery, distribution channels and transfer of products to buyers.", parentId: "domain-v2:agricultural-marketing", parentKind: "domain" },
];

const SPECIALTY_SEEDS: Seed[] = [
  { id: "specialization-v2:organic-farming", type: "specialization", fr: "Agriculture biologique", en: "Organic farming", frDefinition: "Système de production soumis à des principes et règles spécifiques de production biologique, selon le référentiel applicable.", enDefinition: "A production system following specific organic production principles and the applicable standard.", parentId: "subdomain-v2:field-crops", parentKind: "specialization" },
  { id: "specialization-v2:agroecology", type: "specialization", fr: "Agroécologie", en: "Agroecology", frDefinition: "Approches de conception et de conduite des systèmes agricoles s'appuyant sur les interactions écologiques et les contextes sociaux.", enDefinition: "Approaches to designing and managing agricultural systems using ecological interactions and social context.", parentId: "subdomain-v2:field-crops", parentKind: "specialization" },
  { id: "specialization-v2:precision-agriculture", type: "specialization", fr: "Agriculture de précision", en: "Precision agriculture", frDefinition: "Utilisation de mesures, données et technologies pour adapter les interventions agricoles à la variabilité des parcelles et des cultures.", enDefinition: "Use of measurements, data and technologies to adapt farm operations to field and crop variability.", parentId: "subdomain-v2:land-plot-management", parentKind: "specialization" },
  { id: "specialization-v2:climate-smart-agriculture", type: "specialization", fr: "Agriculture climato-intelligente", en: "Climate-smart agriculture", frDefinition: "Pratiques visant à améliorer la productivité, l'adaptation climatique et, lorsque pertinent, l'atténuation des émissions.", enDefinition: "Practices aiming to improve productivity, climate adaptation and, where relevant, emissions mitigation.", parentId: "subdomain-v2:field-crops", parentKind: "specialization" },
  { id: "specialization-v2:seed-multiplication", type: "specialization", fr: "Multiplication des semences", en: "Seed multiplication", frDefinition: "Production de semences selon des exigences d'identité variétale, de pureté et de qualité applicables.", enDefinition: "Seed production under applicable varietal identity, purity and quality requirements.", parentId: "subdomain-v2:seed-production", parentKind: "specialization" },
  { id: "specialization-v2:food-traceability", type: "specialization", fr: "Traçabilité agroalimentaire", en: "Agri-food traceability", frDefinition: "Capacité à retracer l'origine, les transformations, les mouvements et la destination des produits ou lots alimentaires.", enDefinition: "Ability to trace the origin, processing, movements and destination of food products or batches.", parentId: "subdomain-v2:food-quality-safety", parentKind: "specialization" },
  { id: "specialization-v2:smallholder-farming", type: "specialization", fr: "Agriculture familiale et petites exploitations", en: "Family and smallholder farming", frDefinition: "Systèmes agricoles reposant principalement sur le travail familial ou des exploitations de petite échelle, avec des réalités variables selon les territoires.", enDefinition: "Farming systems relying mainly on family labour or small-scale holdings, with context-dependent characteristics.", parentId: "subdomain-v2:farm-labour-management", parentKind: "specialization" },
  { id: "specialization-v2:food-processing-enterprise", type: "specialization", fr: "Petite et moyenne transformation alimentaire", en: "Small and medium food processing", frDefinition: "Transformation alimentaire artisanale ou semi-industrielle organisée à petite ou moyenne échelle.", enDefinition: "Artisanal or semi-industrial food processing organized at small or medium scale.", parentId: "subdomain-v2:food-transformation", parentKind: "specialization" },
];

const OCCUPATION_SEEDS: Seed[] = [
  { id: "occupation-v2:farmer", type: "occupation", fr: "Agriculteur", en: "Farmer", frDefinition: "Personne qui organise ou réalise des activités de production agricole, seule ou au sein d'une exploitation.", enDefinition: "Person who organizes or carries out agricultural production activities, independently or within a farm.", terms: [{ value: "producteur agricole" }, { value: "exploitant agricole" }, { value: "cultivateur" }] },
  { id: "occupation-v2:market-gardener", type: "occupation", fr: "Maraîcher", en: "Market gardener", frDefinition: "Producteur spécialisé dans la culture de légumes et autres plantes potagères destinés notamment à la vente.", enDefinition: "Producer specializing in vegetables and other market-garden crops, often for sale.", terms: [{ value: "productrice maraîchère" }, { value: "producteur de légumes" }] },
  { id: "occupation-v2:agronomist", type: "occupation", fr: "Agronome", en: "Agronomist", frDefinition: "Spécialiste des sciences et techniques agronomiques qui étudie ou conseille les systèmes de production agricole.", enDefinition: "Specialist in agronomic sciences and techniques who studies or advises on agricultural production systems." },
  { id: "occupation-v2:agricultural-technician", type: "occupation", fr: "Technicien agricole", en: "Agricultural technician", frDefinition: "Professionnel qui accompagne, observe ou met en œuvre des opérations techniques de production agricole.", enDefinition: "Professional who supports, monitors or implements technical agricultural production operations." },
  { id: "occupation-v2:horticulturist", type: "occupation", fr: "Horticulteur", en: "Horticulturist", frDefinition: "Producteur ou spécialiste des plantes horticoles, alimentaires ou ornementales.", enDefinition: "Producer or specialist in horticultural, food or ornamental plants." },
  { id: "occupation-v2:nursery-worker", type: "occupation", fr: "Pépiniériste", en: "Nursery grower", frDefinition: "Producteur qui multiplie, élève et commercialise des plants et jeunes végétaux.", enDefinition: "Grower who propagates, raises and markets seedlings and young plants." },
  { id: "occupation-v2:seed-producer", type: "occupation", fr: "Producteur de semences", en: "Seed producer", frDefinition: "Personne ou organisation spécialisée dans la multiplication et la préparation de semences.", enDefinition: "Person or organization specializing in seed multiplication and preparation." },
  { id: "occupation-v2:irrigation-technician", type: "occupation", fr: "Technicien en irrigation", en: "Irrigation technician", frDefinition: "Professionnel qui installe, règle, entretient ou conseille les systèmes d'irrigation.", enDefinition: "Professional who installs, adjusts, maintains or advises on irrigation systems." },
  { id: "occupation-v2:agricultural-machinery-operator", type: "occupation", fr: "Conducteur d'engins agricoles", en: "Agricultural machinery operator", frDefinition: "Personne qui conduit et utilise des tracteurs ou autres engins agricoles dans le respect des consignes de sécurité.", enDefinition: "Person who operates tractors or other agricultural machinery in accordance with safety instructions." },
  { id: "occupation-v2:farm-manager", type: "occupation", fr: "Gestionnaire d'exploitation agricole", en: "Farm manager", frDefinition: "Personne chargée de planifier, coordonner et suivre les ressources, activités et résultats d'une exploitation.", enDefinition: "Person responsible for planning, coordinating and monitoring a farm's resources, activities and results." },
  { id: "occupation-v2:agricultural-advisor", type: "occupation", fr: "Conseiller agricole", en: "Agricultural extension advisor", frDefinition: "Professionnel qui accompagne les producteurs par le conseil, la formation et la diffusion de pratiques adaptées.", enDefinition: "Professional who supports producers through advice, training and dissemination of suitable practices." },
  { id: "occupation-v2:soil-specialist", type: "occupation", fr: "Spécialiste des sols", en: "Soil specialist", frDefinition: "Spécialiste de l'observation, de l'analyse et de la gestion des sols et de leur fertilité.", enDefinition: "Specialist in soil observation, analysis and management of soil fertility." },
  { id: "occupation-v2:postharvest-technician", type: "occupation", fr: "Technicien post-récolte", en: "Post-harvest technician", frDefinition: "Professionnel qui organise ou contrôle les opérations de manutention, conservation et préparation après récolte.", enDefinition: "Professional who organizes or controls post-harvest handling, preservation and preparation." },
  { id: "occupation-v2:food-processor", type: "occupation", fr: "Transformateur agroalimentaire", en: "Agri-food processor", frDefinition: "Personne ou entreprise qui transforme des matières premières agricoles en produits alimentaires ou ingrédients.", enDefinition: "Person or business that processes agricultural raw materials into food products or ingredients." },
  { id: "occupation-v2:food-quality-controller", type: "occupation", fr: "Contrôleur qualité agroalimentaire", en: "Agri-food quality controller", frDefinition: "Professionnel qui vérifie des critères de qualité, d'hygiène et de conformité des produits et opérations.", enDefinition: "Professional who checks product and process quality, hygiene and compliance criteria." },
  { id: "occupation-v2:warehouse-keeper", type: "occupation", fr: "Magasinier agricole", en: "Agricultural storekeeper", frDefinition: "Personne qui réceptionne, range, conserve et suit les mouvements des intrants ou produits agricoles.", enDefinition: "Person who receives, stores, preserves and tracks agricultural inputs or product movements." },
  { id: "occupation-v2:cooperative-manager", type: "occupation", fr: "Gestionnaire de coopérative agricole", en: "Agricultural cooperative manager", frDefinition: "Personne qui coordonne les services, membres, opérations et obligations d'une coopérative de producteurs.", enDefinition: "Person who coordinates the services, members, operations and obligations of a producer cooperative." },
  { id: "occupation-v2:agricultural-buyer", type: "occupation", fr: "Acheteur de produits agricoles", en: "Agricultural produce buyer", frDefinition: "Professionnel qui recherche, évalue, négocie et achète des produits agricoles auprès des producteurs ou collecteurs.", enDefinition: "Professional who sources, assesses, negotiates and purchases agricultural products from producers or aggregators." },
  { id: "occupation-v2:agricultural-sales-agent", type: "occupation", fr: "Commercial agricole", en: "Agricultural sales representative", frDefinition: "Professionnel qui commercialise des intrants, équipements, services ou produits agricoles.", enDefinition: "Professional who sells agricultural inputs, equipment, services or produce." },
  { id: "occupation-v2:agricultural-economist", type: "occupation", fr: "Économiste agricole", en: "Agricultural economist", frDefinition: "Spécialiste de l'analyse économique des exploitations, filières, marchés et politiques agricoles.", enDefinition: "Specialist in economic analysis of farms, value chains, markets and agricultural policies." },
];

const ACTIVITY_SEEDS: Seed[] = [
  ["prepare-soil", "Préparer le sol", "Prepare soil", "Préparation physique ou mécanique d'une parcelle avant implantation d'une culture."],
  ["select-seeds", "Sélectionner les semences", "Select seeds", "Choix des semences selon l'espèce, la variété, la qualité, la saison et l'objectif de production."],
  ["sow-seeds", "Semer", "Sow seeds", "Mise en place des semences dans le sol ou un support de culture selon une méthode adaptée."],
  ["transplant-seedlings", "Repiquer les plants", "Transplant seedlings", "Transfert de jeunes plants vers leur emplacement de culture définitif."],
  ["irrigate-crops", "Irriguer les cultures", "Irrigate crops", "Apport contrôlé d'eau aux cultures selon leurs besoins et les conditions disponibles."],
  ["fertilize-crops", "Fertiliser les cultures", "Fertilize crops", "Apport de matières fertilisantes selon les besoins du sol et des cultures."],
  ["weed-crops", "Désherber", "Weed crops", "Gestion des plantes indésirables qui concurrencent les cultures."],
  ["monitor-crops", "Observer et suivre les cultures", "Monitor crops", "Observation de l'état des cultures, de leur développement et des facteurs de risque."],
  ["manage-pests", "Surveiller les ravageurs et maladies", "Monitor pests and diseases", "Détection et suivi des organismes nuisibles et symptômes affectant les cultures."],
  ["apply-crop-protection", "Appliquer une protection des cultures", "Apply crop protection", "Mise en œuvre d'une méthode de protection adaptée, dans le respect des règles applicables."],
  ["harvest-crops", "Récolter", "Harvest crops", "Collecte des produits au stade de maturité et selon les méthodes appropriées."],
  ["sort-produce", "Trier les récoltes", "Sort harvested produce", "Séparation des produits selon leur état, qualité, calibre ou destination."],
  ["dry-produce", "Sécher les produits agricoles", "Dry agricultural produce", "Réduction contrôlée de l'humidité d'un produit afin de faciliter sa conservation ou transformation."],
  ["store-produce", "Stocker les récoltes", "Store harvested produce", "Conservation des récoltes dans des conditions adaptées et suivi des entrées et sorties."],
  ["process-raw-materials", "Transformer les matières premières", "Process raw materials", "Transformation physique, mécanique ou biologique des matières premières agricoles."],
  ["package-food", "Conditionner les produits alimentaires", "Package food products", "Préparation et emballage des produits pour leur conservation, identification et distribution."],
  ["inspect-food-quality", "Contrôler la qualité alimentaire", "Inspect food quality", "Vérification des caractéristiques et exigences de qualité et de sécurité sanitaire."],
  ["record-farm-expenses", "Enregistrer les dépenses agricoles", "Record farm expenses", "Enregistrement des achats, charges et dépenses affectés à une activité ou une campagne agricole."],
  ["plan-crop-calendar", "Planifier le calendrier cultural", "Plan crop calendar", "Organisation des cultures et interventions dans le temps selon les saisons et contraintes."],
  ["manage-farm-workers", "Organiser les travaux agricoles", "Organize farm work", "Répartition des tâches, équipes, moyens et périodes de travail."],
  ["weigh-harvest", "Peser les récoltes", "Weigh harvested produce", "Mesure des quantités récoltées ou collectées à l'aide d'un équipement adapté."],
  ["collect-produce", "Collecter les produits agricoles", "Collect agricultural produce", "Réception et regroupement de produits auprès de producteurs ou de sites de production."],
  ["negotiate-produce-sale", "Négocier la vente des récoltes", "Negotiate produce sales", "Discussion et accord sur le prix, la quantité, la qualité, le délai et les conditions de vente."],
  ["trace-produce-batch", "Tracer un lot agricole", "Trace an agricultural batch", "Association d'un identifiant à un lot et enregistrement de son origine, ses opérations et ses mouvements."],
  ["maintain-farm-equipment", "Entretenir le matériel agricole", "Maintain farm equipment", "Contrôle, nettoyage, réglage et maintenance des outils et machines agricoles."],
].map(([slug, fr, en, definition]) => ({
  id: `activity-v2:${slug}`, type: "activity", fr, en,
  frDefinition: definition,
  enDefinition: `Agricultural activity: ${en.toLocaleLowerCase("en")}.`,
}));

const PROCESS_SEEDS: Seed[] = [
  ["crop-cycle", "Cycle de production culturale", "Crop production cycle", "Enchaînement des étapes d'une campagne, de la préparation de la parcelle à la récolte et au bilan."],
  ["input-procurement", "Approvisionnement en intrants", "Input procurement", "Identification des besoins, choix des fournisseurs, achat, réception et stockage des intrants."],
  ["irrigation-cycle", "Gestion d'un cycle d'irrigation", "Irrigation cycle management", "Évaluation des besoins en eau, programmation, distribution, contrôle et ajustement de l'irrigation."],
  ["crop-protection-cycle", "Protection intégrée des cultures", "Integrated crop protection", "Observation, identification des risques, choix des méthodes de prévention et suivi de leur efficacité."],
  ["harvest-process", "Processus de récolte", "Harvest process", "Préparation, récolte, pesée, tri initial et transfert des produits vers l'étape suivante."],
  ["postharvest-process", "Processus post-récolte", "Post-harvest process", "Réception, nettoyage, tri, séchage ou refroidissement, conditionnement et stockage des produits."],
  ["food-processing-process", "Processus de transformation alimentaire", "Food processing process", "Réception des matières premières, préparation, transformation, contrôle, conditionnement et libération des lots."],
  ["food-quality-process", "Contrôle qualité et sécurité sanitaire", "Food quality and safety control", "Définition des critères, contrôles, enregistrement des résultats, gestion des écarts et traçabilité."],
  ["farm-finance-process", "Suivi économique d'une campagne agricole", "Farm campaign financial tracking", "Enregistrement des coûts, recettes, investissements et calcul des résultats selon les données disponibles."],
  ["cooperative-collection-process", "Collecte coopérative des récoltes", "Cooperative crop collection", "Planification de la collecte, identification des membres, pesée, classement, enregistrement et règlement."],
  ["agricultural-sales-process", "Vente de produits agricoles", "Agricultural produce sales", "Mise en offre, négociation, commande, préparation, livraison, facturation et suivi du règlement."],
  ["farm-equipment-maintenance-process", "Maintenance des équipements agricoles", "Farm equipment maintenance", "Planification des contrôles, déclaration des pannes, interventions, pièces utilisées et remise en service."],
].map(([slug, fr, en, definition]) => ({
  id: `process-v2:${slug}`, type: "process", fr, en,
  frDefinition: definition,
  enDefinition: `Process covering ${en.toLocaleLowerCase("en")}.`,
}));

const PROBLEM_SEEDS: Seed[] = [
  ["low-crop-yield", "Rendement agricole faible", "Low crop yield", "Production obtenue inférieure à l'objectif ou au potentiel attendu, dont les causes restent à établir."],
  ["water-shortage", "Manque d'eau pour les cultures", "Insufficient water for crops", "Disponibilité en eau insuffisante ou irrégulière pour les besoins des cultures."],
  ["soil-degradation", "Dégradation des sols", "Soil degradation", "Diminution ou altération de certaines fonctions du sol pouvant affecter la production."],
  ["pest-disease-pressure", "Pression des ravageurs ou maladies", "Pest or disease pressure", "Présence ou progression d'organismes nuisibles ou maladies pouvant affecter les cultures."],
  ["input-cost-increase", "Hausse du coût des intrants", "Rising input costs", "Augmentation du coût des semences, engrais, produits de protection ou autres intrants."],
  ["postharvest-loss", "Pertes post-récolte", "Post-harvest losses", "Diminution de quantité ou de qualité entre la récolte et l'utilisation ou la vente."],
  ["storage-spoilage", "Altération pendant le stockage", "Storage spoilage", "Dégradation des produits stockés liée à des conditions, organismes, durées ou manipulations."],
  ["lack-of-farm-records", "Absence de suivi des activités agricoles", "Lack of farm records", "Informations insuffisantes ou dispersées sur les parcelles, opérations, intrants, coûts ou récoltes."],
  ["market-price-uncertainty", "Incertitude sur les prix agricoles", "Agricultural price uncertainty", "Difficulté à connaître, comparer ou anticiper les prix et conditions de vente."],
  ["equipment-downtime", "Indisponibilité du matériel agricole", "Agricultural equipment downtime", "Équipement inutilisable ou indisponible à cause d'une panne, d'un entretien ou d'un manque de pièces."],
  ["labour-shortage", "Manque de main-d'œuvre agricole", "Agricultural labour shortage", "Disponibilité insuffisante de personnes ou de compétences au moment où les travaux doivent être réalisés."],
  ["delayed-input-delivery", "Retard d'approvisionnement agricole", "Delayed agricultural input supply", "Intrants ou équipements reçus après la période où ils étaient nécessaires."],
  ["quality-rejection", "Rejet d'un lot pour non-conformité", "Batch rejection for non-compliance", "Lot refusé par un acheteur ou un contrôle en raison d'exigences non satisfaites."],
  ["weak-product-traceability", "Traçabilité insuffisante des produits", "Insufficient product traceability", "Difficulté à retrouver l'origine, les opérations ou les mouvements d'un produit ou d'un lot."],
  ["cashflow-gap-farm", "Décalage de trésorerie agricole", "Farm cash-flow gap", "Décalage entre les dépenses nécessaires à la production et les recettes réellement encaissées."],
].map(([slug, fr, en, definition]) => ({
  id: `problem-v2:${slug}`, type: "problem", fr, en,
  frDefinition: definition,
  enDefinition: `A possible agricultural problem: ${en.toLocaleLowerCase("en")}.`,
}));

const RESOURCE_SEEDS: Seed[] = [
  ["agricultural-plot", "Parcelle agricole", "Agricultural plot", "Unité de terre identifiée et utilisée ou destinée à être utilisée pour une activité agricole."],
  ["soil", "Sol agricole", "Agricultural soil", "Milieu naturel dans lequel les cultures s'enracinent et auquel sont associées des propriétés physiques, chimiques et biologiques."],
  ["seed", "Semence", "Seed", "Matériel végétal destiné au semis et à la multiplication d'une culture."],
  ["seedling", "Plant", "Seedling", "Jeune végétal destiné à être repiqué ou planté."],
  ["fertilizer", "Engrais", "Fertilizer", "Matière apportant des éléments nutritifs aux plantes selon sa composition et son usage."],
  ["soil-amendment", "Amendement du sol", "Soil amendment", "Matière ou pratique destinée à modifier certaines propriétés du sol."],
  ["crop-protection-product", "Produit phytosanitaire", "Plant protection product", "Produit utilisé pour protéger les végétaux, soumis aux règles et conditions d'utilisation applicables."],
  ["irrigation-system", "Système d'irrigation", "Irrigation system", "Ensemble de dispositifs permettant d'apporter et de distribuer l'eau aux cultures."],
  ["farm-tool", "Outil agricole", "Farm tool", "Outil manuel ou mécanique utilisé pour réaliser une opération agricole."],
  ["tractor", "Tracteur agricole", "Agricultural tractor", "Engin motorisé utilisé pour tracter ou actionner des équipements agricoles."],
  ["harvesting-equipment", "Équipement de récolte", "Harvesting equipment", "Matériel utilisé pour détacher, ramasser ou collecter les produits agricoles."],
  ["storage-facility", "Infrastructure de stockage", "Storage facility", "Bâtiment ou installation destiné à conserver des intrants ou produits agricoles."],
  ["cold-room", "Chambre froide", "Cold room", "Local réfrigéré utilisé pour conserver certains produits à une température contrôlée."],
  ["packaging-material", "Matériel d'emballage", "Packaging material", "Contenant ou matériau utilisé pour protéger, regrouper et identifier un produit."],
  ["agricultural-labour", "Main-d'œuvre agricole", "Agricultural labour", "Ressource humaine mobilisée pour les travaux et opérations d'une exploitation."],
  ["weather-information", "Données météorologiques", "Weather information", "Informations sur la pluie, la température, le vent et d'autres conditions atmosphériques."],
  ["farm-capital", "Capital d'exploitation", "Farm operating capital", "Ressources financières mobilisées pour les dépenses et investissements de l'exploitation."],
  ["agricultural-transport", "Moyen de transport agricole", "Agricultural transport", "Véhicule ou service utilisé pour déplacer intrants, récoltes et produits agricoles."],
].map(([slug, fr, en, definition]) => ({
  id: `resource-v2:${slug}`, type: "resource", fr, en,
  frDefinition: definition,
  enDefinition: `A resource used in agriculture: ${en.toLocaleLowerCase("en")}.`,
}));

const FUNCTION_SEEDS: Seed[] = [
  ["manage-plots", "Gérer les parcelles", "Manage plots", "Enregistrer les parcelles, leurs superficies, cultures, statuts et historiques."],
  ["manage-crop-calendar", "Gérer le calendrier cultural", "Manage crop calendar", "Planifier les semis, entretiens, traitements, irrigations et récoltes."],
  ["track-farm-inputs", "Suivre les intrants agricoles", "Track agricultural inputs", "Enregistrer les achats, stocks, utilisations, lots et coûts des intrants."],
  ["record-farm-operations", "Enregistrer les opérations agricoles", "Record farm operations", "Conserver l'historique des interventions, dates, responsables et parcelles concernées."],
  ["track-harvests", "Suivre les récoltes et rendements", "Track harvests and yields", "Enregistrer les quantités, qualités, dates, parcelles et rendements observés."],
  ["manage-agricultural-stock", "Gérer les stocks agricoles", "Manage agricultural inventory", "Suivre les entrées, sorties, pertes, emplacements et seuils de stock."],
  ["trace-food-batches", "Assurer la traçabilité des lots", "Trace product batches", "Relier un lot à son origine, ses opérations, ses contrôles et ses destinations."],
  ["manage-farm-costs", "Suivre les coûts de production", "Track production costs", "Associer les dépenses aux cultures, parcelles, campagnes et opérations."],
  ["manage-produce-orders", "Gérer les commandes agricoles", "Manage produce orders", "Enregistrer les acheteurs, commandes, quantités, prix, livraisons et règlements."],
  ["monitor-equipment-maintenance", "Suivre la maintenance agricole", "Monitor farm equipment maintenance", "Planifier et documenter les entretiens, pannes, réparations et pièces."],
].map(([slug, fr, en, definition]) => ({
  id: `function-v2:${slug}`, type: "function", fr, en,
  frDefinition: definition,
  enDefinition: `A digital or organizational capability to ${en.toLocaleLowerCase("en")}.`,
}));

const INDICATOR_SEEDS: Seed[] = [
  ["yield-per-hectare", "Rendement par hectare", "Yield per hectare", "Quantité récoltée rapportée à la superficie cultivée, avec unité, période et méthode de mesure explicites."],
  ["germination-rate", "Taux de germination", "Germination rate", "Part des semences ayant germé dans un test ou une situation de référence définie."],
  ["postharvest-loss-rate", "Taux de pertes post-récolte", "Post-harvest loss rate", "Part de la quantité récoltée perdue ou déclassée entre la récolte et une étape définie."],
  ["production-cost-per-unit", "Coût de production unitaire", "Unit production cost", "Coût attribué à une quantité ou unité de produit selon une méthode de calcul documentée."],
  ["gross-margin-farm", "Marge brute agricole", "Farm gross margin", "Différence entre produits et charges variables selon les conventions comptables retenues."],
  ["water-use-per-hectare", "Consommation d'eau par hectare", "Water use per hectare", "Volume d'eau utilisé rapporté à la superficie et à la période considérées."],
  ["storage-loss-rate", "Taux de pertes en stockage", "Storage loss rate", "Part des quantités perdues ou déclassées pendant une période de stockage définie."],
].map(([slug, fr, en, definition]) => ({
  id: `indicator-v2:${slug}`, type: "indicator", fr, en,
  frDefinition: definition,
  enDefinition: `Agricultural indicator: ${en.toLocaleLowerCase("en")}.`,
}));

const allSeeds = [
  ...DOMAIN_SEEDS,
  ...SUBDOMAIN_SEEDS,
  ...SPECIALTY_SEEDS,
  ...OCCUPATION_SEEDS,
  ...ACTIVITY_SEEDS,
  ...PROCESS_SEEDS,
  ...PROBLEM_SEEDS,
  ...RESOURCE_SEEDS,
  ...FUNCTION_SEEDS,
  ...INDICATOR_SEEDS,
];

const familyConcept = makeConcept(FAMILY_SEED);
const concepts = allSeeds.map(makeConcept);

function relation(
  id: string,
  sourceConceptId: string,
  targetConceptId: string,
  predicate: string,
): KnowledgeRelationship {
  return {
    id,
    sourceConceptId,
    targetConceptId,
    predicate,
    status: "validated",
    confidence: 1,
    sourceIds: [SOURCE_ID],
    version: 1,
  };
}

const hierarchyRelationships: KnowledgeRelationship[] = allSeeds
  .filter((seed) => seed.parentId)
  .map((seed) => relation(
    `rel:agri-v2:${seed.id.replace(/^[^:]+:/, "")}:parent`,
    seed.parentId!,
    seed.id,
    seed.parentKind === "domain" ? "has_domain" : seed.parentKind === "subdomain" ? "has_subdomain" : "has_specialization",
  ));

const legacyAlignmentRelationships: KnowledgeRelationship[] = [
  relation("rel:agri-v2:crop-production:refines-legacy-agriculture", "domain-v2:crop-production", "domain:agriculture", "refines_legacy_domain"),
  relation("rel:agri-v2:specialized-crop-systems:refines-legacy-agriculture", "domain-v2:specialized-crop-systems", "domain:agriculture", "refines_legacy_domain"),
  relation("rel:agri-v2:farm-management:refines-legacy-agriculture", "domain-v2:farm-management", "domain:agriculture", "refines_legacy_domain"),
  relation("rel:agri-v2:agrofood-processing:refines-legacy-food-production", "domain-v2:agrofood-processing", "domain:food-production", "refines_legacy_domain"),
  relation("rel:agri-v2:agricultural-marketing:related-to-legacy-agriculture", "domain-v2:agricultural-marketing", "domain:agriculture", "related_to_legacy_domain"),
];

const activityLinks: KnowledgeRelationship[] = [
  relation("rel:agri-v2:farmer-performs-sowing", "occupation-v2:farmer", "activity-v2:sow-seeds", "may_perform"),
  relation("rel:agri-v2:market-gardener-performs-irrigation", "occupation-v2:market-gardener", "activity-v2:irrigate-crops", "may_perform"),
  relation("rel:agri-v2:agronomist-supports-crop-monitoring", "occupation-v2:agronomist", "activity-v2:monitor-crops", "may_advise_on"),
  relation("rel:agri-v2:processor-performs-processing", "occupation-v2:food-processor", "activity-v2:process-raw-materials", "may_perform"),
  relation("rel:agri-v2:cooperative-collects-produce", "occupation-v2:cooperative-manager", "activity-v2:collect-produce", "may_coordinate"),
  relation("rel:agri-v2:postharvest-process-includes-drying", "process-v2:postharvest-process", "activity-v2:dry-produce", "includes_activity"),
  relation("rel:agri-v2:crop-cycle-includes-harvest", "process-v2:crop-cycle", "activity-v2:harvest-crops", "includes_activity"),
  relation("rel:agri-v2:traceability-function-supports-process", "function-v2:trace-food-batches", "process-v2:food-quality-process", "supports_process"),
  relation("rel:agri-v2:postharvest-loss-may-affect-process", "problem-v2:postharvest-loss", "process-v2:postharvest-process", "may_disrupt"),
  relation("rel:agri-v2:water-shortage-may-affect-irrigation", "problem-v2:water-shortage", "activity-v2:irrigate-crops", "may_constrain"),
];


const domainAssociationSeeds: Array<[string, string, string]> = [
  ["occupation-v2:farmer", "domain-v2:crop-production", "works_in_domain"],
  ["occupation-v2:farmer", "domain-v2:farm-management", "works_in_domain"],
  ["occupation-v2:market-gardener", "domain-v2:crop-production", "specializes_in_domain"],
  ["occupation-v2:market-gardener", "domain-v2:specialized-crop-systems", "specializes_in_domain"],
  ["occupation-v2:agronomist", "domain-v2:crop-production", "advises_on_domain"],
  ["occupation-v2:agricultural-technician", "domain-v2:crop-production", "supports_domain"],
  ["occupation-v2:horticulturist", "domain-v2:specialized-crop-systems", "works_in_domain"],
  ["occupation-v2:nursery-worker", "domain-v2:specialized-crop-systems", "works_in_domain"],
  ["occupation-v2:seed-producer", "domain-v2:specialized-crop-systems", "works_in_domain"],
  ["occupation-v2:irrigation-technician", "domain-v2:farm-management", "supports_domain"],
  ["occupation-v2:agricultural-machinery-operator", "domain-v2:farm-management", "works_in_domain"],
  ["occupation-v2:farm-manager", "domain-v2:farm-management", "manages_domain"],
  ["occupation-v2:agricultural-advisor", "domain-v2:farm-management", "advises_on_domain"],
  ["occupation-v2:soil-specialist", "domain-v2:farm-management", "advises_on_domain"],
  ["occupation-v2:postharvest-technician", "domain-v2:agrofood-processing", "works_in_domain"],
  ["occupation-v2:food-processor", "domain-v2:agrofood-processing", "works_in_domain"],
  ["occupation-v2:food-quality-controller", "domain-v2:agrofood-processing", "controls_domain"],
  ["occupation-v2:warehouse-keeper", "domain-v2:agricultural-marketing", "supports_domain"],
  ["occupation-v2:cooperative-manager", "domain-v2:agricultural-marketing", "manages_domain"],
  ["occupation-v2:agricultural-buyer", "domain-v2:agricultural-marketing", "works_in_domain"],
  ["occupation-v2:agricultural-sales-agent", "domain-v2:agricultural-marketing", "works_in_domain"],
  ["occupation-v2:agricultural-economist", "domain-v2:farm-management", "advises_on_domain"],
  ["process-v2:crop-cycle", "domain-v2:crop-production", "process_of_domain"],
  ["process-v2:postharvest-process", "domain-v2:agrofood-processing", "process_of_domain"],
  ["process-v2:food-processing-process", "domain-v2:agrofood-processing", "process_of_domain"],
  ["process-v2:agricultural-sales-process", "domain-v2:agricultural-marketing", "process_of_domain"],
  ["function-v2:manage-plots", "domain-v2:farm-management", "supports_domain"],
  ["function-v2:track-harvests", "domain-v2:crop-production", "supports_domain"],
  ["function-v2:trace-food-batches", "domain-v2:agrofood-processing", "supports_domain"],
  ["function-v2:manage-produce-orders", "domain-v2:agricultural-marketing", "supports_domain"],
  ["problem-v2:postharvest-loss", "domain-v2:agrofood-processing", "problem_in_domain"],
  ["problem-v2:market-price-uncertainty", "domain-v2:agricultural-marketing", "problem_in_domain"],
  ["problem-v2:low-crop-yield", "domain-v2:crop-production", "problem_in_domain"],
  ["indicator-v2:yield-per-hectare", "domain-v2:crop-production", "measures_domain"],
  ["indicator-v2:postharvest-loss-rate", "domain-v2:agrofood-processing", "measures_domain"],
];
const domainAssociationRelationships = domainAssociationSeeds.map(([sourceId, targetId, predicate]) =>
  relation(`rel:agri-v2:association:${sourceId.replace(/^[^:]+:/, "")}:${targetId.replace(/^[^:]+:/, "")}`, sourceId, targetId, predicate),
);

const processActivitySeeds: Array<[string, string]> = [
  ["process-v2:crop-cycle", "activity-v2:prepare-soil"],
  ["process-v2:crop-cycle", "activity-v2:select-seeds"],
  ["process-v2:crop-cycle", "activity-v2:sow-seeds"],
  ["process-v2:crop-cycle", "activity-v2:irrigate-crops"],
  ["process-v2:crop-cycle", "activity-v2:fertilize-crops"],
  ["process-v2:crop-cycle", "activity-v2:monitor-crops"],
  ["process-v2:crop-cycle", "activity-v2:harvest-crops"],
  ["process-v2:postharvest-process", "activity-v2:weigh-harvest"],
  ["process-v2:postharvest-process", "activity-v2:sort-produce"],
  ["process-v2:postharvest-process", "activity-v2:dry-produce"],
  ["process-v2:postharvest-process", "activity-v2:store-produce"],
  ["process-v2:food-processing-process", "activity-v2:process-raw-materials"],
  ["process-v2:food-processing-process", "activity-v2:package-food"],
  ["process-v2:food-quality-process", "activity-v2:inspect-food-quality"],
  ["process-v2:agricultural-sales-process", "activity-v2:collect-produce"],
  ["process-v2:agricultural-sales-process", "activity-v2:negotiate-produce-sale"],
  ["process-v2:agricultural-sales-process", "activity-v2:trace-produce-batch"],
  ["process-v2:farm-equipment-maintenance-process", "activity-v2:maintain-farm-equipment"],
];
const processActivityRelationships = processActivitySeeds.map(([processId, activityId]) =>
  relation(`rel:agri-v2:process-activity:${processId.split(":").pop()}:${activityId.split(":").pop()}`, processId, activityId, "includes_activity"),
);

const resourceDomainSeeds: Array<[string, string]> = [
  ["resource-v2:agricultural-plot", "domain-v2:crop-production"],
  ["resource-v2:soil", "domain-v2:crop-production"],
  ["resource-v2:seed", "domain-v2:crop-production"],
  ["resource-v2:seedling", "domain-v2:specialized-crop-systems"],
  ["resource-v2:fertilizer", "domain-v2:farm-management"],
  ["resource-v2:soil-amendment", "domain-v2:farm-management"],
  ["resource-v2:crop-protection-product", "domain-v2:farm-management"],
  ["resource-v2:irrigation-system", "domain-v2:farm-management"],
  ["resource-v2:farm-tool", "domain-v2:farm-management"],
  ["resource-v2:tractor", "domain-v2:farm-management"],
  ["resource-v2:harvesting-equipment", "domain-v2:crop-production"],
  ["resource-v2:storage-facility", "domain-v2:agrofood-processing"],
  ["resource-v2:cold-room", "domain-v2:agrofood-processing"],
  ["resource-v2:packaging-material", "domain-v2:agrofood-processing"],
  ["resource-v2:agricultural-labour", "domain-v2:farm-management"],
  ["resource-v2:weather-information", "domain-v2:crop-production"],
  ["resource-v2:farm-capital", "domain-v2:farm-management"],
  ["resource-v2:agricultural-transport", "domain-v2:agricultural-marketing"],
];
const resourceDomainRelationships = resourceDomainSeeds.map(([resourceId, domainId]) =>
  relation(`rel:agri-v2:resource-domain:${resourceId.split(":").pop()}`, resourceId, domainId, "resource_for_domain"),
);

const problemProcessSeeds: Array<[string, string, string]> = [
  ["problem-v2:soil-degradation", "process-v2:crop-cycle", "may_reduce_performance_of"],
  ["problem-v2:pest-disease-pressure", "activity-v2:monitor-crops", "may_require_attention_in"],
  ["problem-v2:input-cost-increase", "process-v2:input-procurement", "may_increase_cost_of"],
  ["problem-v2:storage-spoilage", "process-v2:postharvest-process", "may_disrupt"],
  ["problem-v2:lack-of-farm-records", "function-v2:record-farm-operations", "may_be_addressed_by"],
  ["problem-v2:equipment-downtime", "process-v2:farm-equipment-maintenance-process", "may_disrupt"],
  ["problem-v2:labour-shortage", "subdomain-v2:farm-labour-management", "may_constrain"],
  ["problem-v2:delayed-input-delivery", "process-v2:input-procurement", "may_delay"],
  ["problem-v2:quality-rejection", "process-v2:food-quality-process", "may_be_detected_by"],
  ["problem-v2:weak-product-traceability", "function-v2:trace-food-batches", "may_be_addressed_by"],
  ["problem-v2:cashflow-gap-farm", "process-v2:farm-finance-process", "may_affect"],
];
const problemProcessRelationships = problemProcessSeeds.map(([problemId, targetId, predicate]) =>
  relation(`rel:agri-v2:problem-link:${problemId.split(":").pop()}`, problemId, targetId, predicate),
);

export const AGRICULTURE_AGROFOOD_FAMILY = familyConcept;
export const AGRICULTURE_AGROFOOD_DOMAINS = concepts.filter((item) => item.conceptType === "domain");
export const AGRICULTURE_AGROFOOD_SUBDOMAINS = concepts.filter((item) => item.conceptType === "subdomain");
export const AGRICULTURE_AGROFOOD_SPECIALIZATIONS = concepts.filter((item) => item.conceptType === "specialization");
export const AGRICULTURE_AGROFOOD_OCCUPATIONS = concepts.filter((item) => item.conceptType === "occupation");
export const AGRICULTURE_AGROFOOD_ACTIVITIES = concepts.filter((item) => item.conceptType === "activity");
export const AGRICULTURE_AGROFOOD_PROCESSES = concepts.filter((item) => item.conceptType === "process");
export const AGRICULTURE_AGROFOOD_PROBLEMS = concepts.filter((item) => item.conceptType === "problem");
export const AGRICULTURE_AGROFOOD_RESOURCES = concepts.filter((item) => item.conceptType === "resource");
export const AGRICULTURE_AGROFOOD_FUNCTIONS = concepts.filter((item) => item.conceptType === "function");
export const AGRICULTURE_AGROFOOD_INDICATORS = concepts.filter((item) => item.conceptType === "indicator");
export const AGRICULTURE_AGROFOOD_CATALOG = [familyConcept, ...concepts];
export const AGRICULTURE_AGROFOOD_RELATIONSHIPS = [
  ...hierarchyRelationships,
  ...legacyAlignmentRelationships,
  ...activityLinks,
  ...domainAssociationRelationships,
  ...processActivityRelationships,
  ...resourceDomainRelationships,
  ...problemProcessRelationships,
];
