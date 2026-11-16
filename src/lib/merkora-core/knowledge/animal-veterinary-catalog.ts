import type { KnowledgeConcept, KnowledgeRelationship } from "./types";
import { UNIVERSAL_DOMAIN_CATALOG } from "./universal-domain-catalog";

const CREATED_AT = "2026-11-16T00:00:00.000Z";
const SOURCE_ID = "source:merkora-family-02-animal-veterinary-v1";
type Seed = {
  id: string; type: string; fr: string; en: string; frDefinition: string; enDefinition: string;
  parentId?: string; terms?: string[];
};
function makeConcept(seed: Seed): KnowledgeConcept {
  const terms = [
    { value: seed.fr, language: "fr", kind: "preferred" as const },
    { value: seed.en, language: "en", kind: "preferred" as const },
    ...(seed.terms ?? []).map((value) => ({ value, language: "fr", kind: "synonym" as const })),
  ];
  return {
    id: seed.id, canonicalKey: `merkora.${seed.type}.${seed.id.replace(/^[^:]+:/, "")}`,
    conceptType: seed.type,
    definitions: [
      { language: "fr", label: seed.fr, definition: seed.frDefinition },
      { language: "en", label: seed.en, definition: seed.enDefinition },
    ],
    terms,
    classifications: seed.parentId ? [{ classificationType: "foundation-a-family-v2", parentConceptId: seed.parentId }] : [],
    attributes: [], relationships: [], scope: { global: true },
    lifecycle: { status: "validated", version: 1, createdAt: CREATED_AT, updatedAt: CREATED_AT },
    sources: [{ id: SOURCE_ID, sourceType: "curated_domain_knowledge", label: "MerKora GDJ — Famille 02 Animaux et médecine vétérinaire, version 1" }],
    reliability: {
      evidenceLevel: "documented", reviewStatus: "not_reviewed",
      verificationNotes: ["Référentiel initial de conception. Les diagnostics, traitements, dosages, vaccinations et règles d'élevage doivent être validés par un professionnel compétent et contextualisés au pays, à l'espèce et à la réglementation applicable."],
    },
  };
}
function relation(id: string, sourceConceptId: string, targetConceptId: string, predicate: string): KnowledgeRelationship {
  return { id, sourceConceptId, targetConceptId, predicate, status: "validated", confidence: 1, sourceIds: [SOURCE_ID], version: 1 };
}

const FAMILY_SEED: Seed = {
  id: "family:animals-veterinary", type: "domain_family", fr: "Animaux et médecine vétérinaire", en: "Animals and veterinary medicine",
  frDefinition: "Famille couvrant l'élevage et la production animale, la santé et la médecine vétérinaires, les animaux de compagnie, le bien-être et la protection animale, la nutrition, la reproduction et la génétique animales. La pêche et l'aquaculture conservent leur domaine propre ; les productions végétales et la transformation agroalimentaire restent distinctes.",
  enDefinition: "Family covering livestock and animal production, animal health and veterinary medicine, companion animals, animal welfare and protection, animal nutrition, reproduction and genetics. Fisheries and aquaculture retain their own domain; crop production and agri-food processing remain distinct.",
};
const DOMAIN_SEEDS: Seed[] = [
  { id: "domain-vet:veterinary-medicine", type: "domain", fr: "Médecine vétérinaire et santé animale", en: "Veterinary medicine and animal health", frDefinition: "Prévention, examen, diagnostic vétérinaire, prise en charge, suivi sanitaire et surveillance des maladies animales.", enDefinition: "Prevention, veterinary examination, diagnosis, care, health monitoring and animal disease surveillance.", parentId: FAMILY_SEED.id },
  { id: "domain-vet:companion-animal-care", type: "domain", fr: "Animaux de compagnie et services animaliers", en: "Companion animals and animal services", frDefinition: "Accueil, garde, soins courants, éducation, toilettage et services destinés aux animaux de compagnie.", enDefinition: "Care, boarding, routine services, training, grooming and services for companion animals.", parentId: FAMILY_SEED.id },
  { id: "domain-vet:animal-welfare-protection", type: "domain", fr: "Bien-être et protection animale", en: "Animal welfare and protection", frDefinition: "Conditions de détention, prévention de la souffrance, protection, refuges, identification et gestion responsable des animaux.", enDefinition: "Animal housing conditions, prevention of suffering, protection, shelters, identification and responsible animal management.", parentId: FAMILY_SEED.id },
  { id: "domain-vet:animal-nutrition", type: "domain", fr: "Nutrition et alimentation animales", en: "Animal nutrition and feeding", frDefinition: "Évaluation des besoins nutritionnels, formulation et distribution des aliments, fourrages, abreuvement et suivi alimentaire.", enDefinition: "Assessment of nutritional needs, feed formulation and distribution, forage, watering and feeding monitoring.", parentId: FAMILY_SEED.id },
  { id: "domain-vet:animal-reproduction-genetics", type: "domain", fr: "Reproduction et génétique animales", en: "Animal reproduction and genetics", frDefinition: "Reproduction, sélection, amélioration génétique, suivi de gestation, mise bas et gestion des reproducteurs.", enDefinition: "Animal reproduction, selection, genetic improvement, pregnancy monitoring, birth and breeding-stock management.", parentId: FAMILY_SEED.id },
  { id: "domain-vet:animal-products-primary", type: "domain", fr: "Productions animales et collecte primaire", en: "Animal products and primary collection", frDefinition: "Organisation de la production primaire, collecte et première conservation du lait, des œufs, du miel, de la viande et autres produits animaux, sans absorber leur transformation industrielle.", enDefinition: "Organization of primary production, collection and initial preservation of milk, eggs, honey, meat and other animal products, without absorbing industrial processing.", parentId: FAMILY_SEED.id },
];
const SUBDOMAIN_SEEDS: Seed[] = [
  { id: "subdomain-vet:cattle-farming", type: "subdomain", fr: "Élevage bovin", en: "Cattle farming", frDefinition: "Conduite d'élevages de bovins pour la viande, le lait, la reproduction ou le travail.", enDefinition: "Management of cattle raised for meat, milk, breeding or work.", parentId: "domain:livestock", terms: ["bovins", "vaches", "bœufs"] },
  { id: "subdomain-vet:small-ruminant-farming", type: "subdomain", fr: "Élevage des petits ruminants", en: "Small ruminant farming", frDefinition: "Élevage des ovins et caprins, incluant conduite du troupeau, reproduction et production.", enDefinition: "Sheep and goat farming, including herd management, reproduction and production.", parentId: "domain:livestock", terms: ["moutons", "chèvres", "ovins", "caprins"] },
  { id: "subdomain-vet:pig-farming", type: "subdomain", fr: "Élevage porcin", en: "Pig farming", frDefinition: "Élevage et conduite des porcs pour la reproduction et la production.", enDefinition: "Pig breeding and management for reproduction and production.", parentId: "domain:livestock", terms: ["porcs", "porcherie"] },
  { id: "subdomain-vet:aviculture", type: "subdomain", fr: "Aviculture", en: "Poultry farming", frDefinition: "Élevage de volailles, notamment poulets, pintades, canards et dindes, pour les œufs ou la viande.", enDefinition: "Raising poultry such as chickens, guinea fowl, ducks and turkeys for eggs or meat.", parentId: "domain:livestock", terms: ["volaille", "élevage de poulets", "poulets de chair", "pondeuses", "pintades"] },
  { id: "subdomain-vet:rabbit-farming", type: "subdomain", fr: "Cuniculture", en: "Rabbit farming", frDefinition: "Élevage et reproduction des lapins.", enDefinition: "Rabbit breeding and production.", parentId: "domain:livestock", terms: ["élevage de lapins", "lapins"] },
  { id: "subdomain-vet:beekeeping", type: "subdomain", fr: "Apiculture", en: "Beekeeping", frDefinition: "Conduite des colonies d'abeilles et production primaire de miel, cire et autres produits apicoles.", enDefinition: "Management of bee colonies and primary production of honey, wax and other bee products.", parentId: "domain:livestock", terms: ["élevage des abeilles", "ruches", "miel"] },
  { id: "subdomain-vet:clinical-veterinary-medicine", type: "subdomain", fr: "Médecine vétérinaire clinique", en: "Clinical veterinary medicine", frDefinition: "Examen clinique, évaluation de l'état de santé, diagnostic différentiel et suivi des animaux malades ou blessés.", enDefinition: "Clinical examination, health assessment, differential diagnosis and follow-up of sick or injured animals.", parentId: "domain-vet:veterinary-medicine", terms: ["consultation vétérinaire", "soins vétérinaires"] },
  { id: "subdomain-vet:preventive-veterinary-medicine", type: "subdomain", fr: "Médecine vétérinaire préventive", en: "Preventive veterinary medicine", frDefinition: "Prévention sanitaire, vaccination, biosécurité, prophylaxie et suivi des risques de maladie.", enDefinition: "Animal health prevention, vaccination, biosecurity, prophylaxis and disease-risk monitoring.", parentId: "domain-vet:veterinary-medicine", terms: ["prévention animale", "prophylaxie"] },
  { id: "subdomain-vet:veterinary-surgery", type: "subdomain", fr: "Chirurgie vétérinaire", en: "Veterinary surgery", frDefinition: "Actes chirurgicaux vétérinaires et suivi périopératoire réalisés par des professionnels habilités.", enDefinition: "Veterinary surgical procedures and perioperative care performed by qualified professionals.", parentId: "domain-vet:veterinary-medicine", terms: ["opération animale", "chirurgie animale"] },
  { id: "subdomain-vet:veterinary-diagnostics", type: "subdomain", fr: "Diagnostic et laboratoire vétérinaires", en: "Veterinary diagnostics and laboratory", frDefinition: "Examens complémentaires, analyses biologiques, imagerie et interprétation vétérinaire.", enDefinition: "Veterinary investigations, laboratory testing, imaging and interpretation.", parentId: "domain-vet:veterinary-medicine", terms: ["analyses vétérinaires", "laboratoire animal"] },
  { id: "subdomain-vet:veterinary-epidemiology", type: "subdomain", fr: "Épidémiologie et surveillance animale", en: "Veterinary epidemiology and surveillance", frDefinition: "Surveillance des maladies, détection de signaux sanitaires, investigation et suivi des foyers.", enDefinition: "Disease surveillance, detection of health signals, investigation and outbreak monitoring.", parentId: "domain-vet:veterinary-medicine", terms: ["épidémiosurveillance animale", "maladies animales"] },
  { id: "subdomain-vet:animal-pharmacy", type: "subdomain", fr: "Pharmacie vétérinaire", en: "Veterinary pharmacy", frDefinition: "Gestion réglementée des médicaments vétérinaires, prescriptions, délivrance, stockage et traçabilité.", enDefinition: "Regulated management of veterinary medicines, prescriptions, dispensing, storage and traceability.", parentId: "domain-vet:veterinary-medicine", terms: ["médicaments vétérinaires"] },
  { id: "subdomain-vet:dogs-cats", type: "subdomain", fr: "Chiens et chats", en: "Dogs and cats", frDefinition: "Soins, hébergement, éducation et suivi des chiens et chats de compagnie.", enDefinition: "Care, boarding, training and monitoring of companion dogs and cats.", parentId: "domain-vet:companion-animal-care", terms: ["canins", "félins"] },
  { id: "subdomain-vet:equine-care", type: "subdomain", fr: "Soins et services équins", en: "Equine care and services", frDefinition: "Gestion, hébergement, soins et services autour des chevaux et autres équidés.", enDefinition: "Management, boarding, care and services for horses and other equids.", parentId: "domain-vet:companion-animal-care", terms: ["chevaux", "équitation", "équidés"] },
  { id: "subdomain-vet:animal-boarding", type: "subdomain", fr: "Pension et garde d'animaux", en: "Animal boarding and pet sitting", frDefinition: "Accueil temporaire, garde, alimentation et surveillance des animaux confiés.", enDefinition: "Temporary boarding, supervision, feeding and care of entrusted animals.", parentId: "domain-vet:companion-animal-care", terms: ["garderie animale", "garde de chiens", "pension canine"] },
  { id: "subdomain-vet:animal-grooming", type: "subdomain", fr: "Toilettage animalier", en: "Animal grooming", frDefinition: "Hygiène et entretien externe des animaux dans le respect de leur bien-être.", enDefinition: "Hygiene and external grooming of animals while respecting their welfare.", parentId: "domain-vet:companion-animal-care", terms: ["toiletteur animalier"] },
  { id: "subdomain-vet:animal-shelters", type: "subdomain", fr: "Refuges et accueil animalier", en: "Animal shelters and rescue", frDefinition: "Accueil, protection, soins de première intention, identification et adoption responsable des animaux.", enDefinition: "Sheltering, protection, first-line care, identification and responsible animal adoption.", parentId: "domain-vet:animal-welfare-protection", terms: ["refuge pour animaux", "sauvetage animalier"] },
  { id: "subdomain-vet:animal-identification", type: "subdomain", fr: "Identification et traçabilité animales", en: "Animal identification and traceability", frDefinition: "Identification individuelle ou collective et suivi des mouvements et événements sanitaires.", enDefinition: "Individual or group identification and monitoring of movements and health events.", parentId: "domain-vet:animal-welfare-protection", terms: ["marquage animal", "identification du cheptel"] },
  { id: "subdomain-vet:animal-transport-welfare", type: "subdomain", fr: "Transport et bien-être animal", en: "Animal transport and welfare", frDefinition: "Préparation, transport et réception des animaux dans des conditions adaptées et réglementaires.", enDefinition: "Preparation, transport and reception of animals under appropriate and lawful conditions.", parentId: "domain-vet:animal-welfare-protection", terms: ["transport des animaux"] },
  { id: "subdomain-vet:animal-nutrition", type: "subdomain", fr: "Nutrition animale", en: "Animal nutrition", frDefinition: "Évaluation des besoins alimentaires et suivi de l'état nutritionnel selon l'espèce, l'âge et le stade physiologique.", enDefinition: "Assessment of feed requirements and nutritional status by species, age and physiological stage.", parentId: "domain-vet:animal-nutrition", terms: ["alimentation du bétail", "ration animale", "nourriture des animaux"] },
  { id: "subdomain-vet:feed-production", type: "subdomain", fr: "Production et formulation des aliments animaux", en: "Animal feed production and formulation", frDefinition: "Sélection, formulation, fabrication et contrôle des aliments destinés aux animaux.", enDefinition: "Selection, formulation, manufacture and control of animal feed.", parentId: "domain-vet:animal-nutrition", terms: ["fabrique d'aliments bétail", "provenderie", "provende"] },
  { id: "subdomain-vet:forage-management", type: "subdomain", fr: "Fourrages et pâturages", en: "Forage and pasture management", frDefinition: "Production, conservation et gestion des fourrages et espaces de pâturage.", enDefinition: "Production, conservation and management of forage and grazing areas.", parentId: "domain-vet:animal-nutrition", terms: ["pâturage", "foin", "fourrage"] },
  { id: "subdomain-vet:animal-reproduction", type: "subdomain", fr: "Reproduction animale", en: "Animal reproduction", frDefinition: "Gestion des cycles reproductifs, accouplements, insémination, gestation et mise bas.", enDefinition: "Management of reproductive cycles, mating, insemination, pregnancy and birth.", parentId: "domain-vet:animal-reproduction-genetics", terms: ["reproduction du bétail", "insémination animale"] },
  { id: "subdomain-vet:animal-genetics", type: "subdomain", fr: "Génétique et sélection animales", en: "Animal genetics and breeding selection", frDefinition: "Sélection des reproducteurs et suivi des caractères héréditaires dans des programmes encadrés.", enDefinition: "Breeding-stock selection and monitoring of inherited traits in managed programs.", parentId: "domain-vet:animal-reproduction-genetics", terms: ["sélection animale", "amélioration génétique"] },
  { id: "subdomain-vet:milk-egg-honey-collection", type: "subdomain", fr: "Collecte des produits animaux", en: "Animal product collection", frDefinition: "Collecte et première conservation du lait, des œufs, du miel et d'autres produits primaires.", enDefinition: "Collection and initial preservation of milk, eggs, honey and other primary products.", parentId: "domain-vet:animal-products-primary", terms: ["collecte de lait", "ramassage des œufs", "récolte du miel"] },
  { id: "subdomain-vet:meat-primary-production", type: "subdomain", fr: "Production primaire de viande", en: "Primary meat production", frDefinition: "Suivi des animaux destinés à la production de viande et organisation des opérations primaires autorisées.", enDefinition: "Monitoring animals raised for meat and organizing permitted primary operations.", parentId: "domain-vet:animal-products-primary", terms: ["production de viande"] },
];

const SPECIALIZATION_SEEDS: Seed[] = [
  { id: "specialization-vet:dairy-farming", type: "specialization", fr: "Élevage laitier", en: "Dairy farming", frDefinition: "Système d'élevage orienté vers la production de lait.", enDefinition: "Livestock system focused on milk production.", parentId: "subdomain-vet:cattle-farming", terms: ["production laitière"] },
  { id: "specialization-vet:broiler-production", type: "specialization", fr: "Poulets de chair", en: "Broiler production", frDefinition: "Élevage de volailles destiné principalement à la production de viande.", enDefinition: "Poultry production primarily for meat.", parentId: "subdomain-vet:aviculture" },
  { id: "specialization-vet:layer-production", type: "specialization", fr: "Élevage de poules pondeuses", en: "Layer production", frDefinition: "Élevage de volailles destiné à la production d'œufs.", enDefinition: "Poultry production focused on eggs.", parentId: "subdomain-vet:aviculture" },
  { id: "specialization-vet:smallholder-livestock", type: "specialization", fr: "Élevage familial", en: "Smallholder livestock", frDefinition: "Système d'élevage à petite échelle organisé autour d'une exploitation familiale.", enDefinition: "Small-scale livestock system organized around a family farm.", parentId: "domain:livestock" },
  { id: "specialization-vet:herd-health", type: "specialization", fr: "Gestion sanitaire des troupeaux", en: "Herd health management", frDefinition: "Approche collective de prévention, surveillance et suivi sanitaire d'un troupeau.", enDefinition: "Herd-level prevention, surveillance and health monitoring.", parentId: "subdomain-vet:preventive-veterinary-medicine" },
  { id: "specialization-vet:animal-emergency-care", type: "specialization", fr: "Urgences vétérinaires", en: "Veterinary emergency care", frDefinition: "Organisation de la prise en charge urgente par des professionnels habilités.", enDefinition: "Organization of urgent care by qualified veterinary professionals.", parentId: "subdomain-vet:clinical-veterinary-medicine" },
];

const OCCUPATION_SEEDS: Seed[] = [
  ["veterinarian","Vétérinaire","Veterinarian","Professionnel habilité à prévenir, examiner, diagnostiquer et prendre en charge la santé animale.", "Professional qualified to prevent, examine, diagnose and manage animal health.", "domain-vet:veterinary-medicine", ["docteur vétérinaire"]],
  ["veterinary-nurse","Auxiliaire vétérinaire","Veterinary nurse","Professionnel assistant l'équipe vétérinaire dans les soins, l'accueil et le suivi, selon son champ de compétence.", "Professional assisting veterinary teams with care, reception and follow-up within their scope.", "domain-vet:veterinary-medicine", ["assistant vétérinaire"]],
  ["animal-health-technician","Technicien en santé animale","Animal health technician","Technicien intervenant dans la surveillance et les activités de santé animale selon les habilitations locales.", "Technician involved in animal health monitoring and activities within local authorization.", "domain-vet:veterinary-medicine", ["technicien vétérinaire"]],
  ["livestock-farmer","Éleveur","Livestock farmer","Personne qui conduit une activité d'élevage et gère les animaux et les ressources associées.", "Person managing livestock, animals and related resources.", "domain:livestock", ["éleveuse", "producteur animal"]],
  ["poultry-farmer","Aviculteur","Poultry farmer","Personne qui élève des volailles pour la production d'œufs ou de viande.", "Person raising poultry for egg or meat production.", "subdomain-vet:aviculture", ["éleveur de volailles"]],
  ["cattle-farmer","Éleveur bovin","Cattle farmer","Personne qui conduit un élevage de bovins.", "Person managing cattle farming.", "subdomain-vet:cattle-farming", ["éleveur de vaches"]],
  ["small-ruminant-farmer","Éleveur de petits ruminants","Small ruminant farmer","Personne qui élève des moutons ou des chèvres.", "Person raising sheep or goats.", "subdomain-vet:small-ruminant-farming", ["berger", "éleveur de chèvres"]],
  ["pig-farmer","Éleveur porcin","Pig farmer","Personne qui conduit un élevage de porcs.", "Person managing pig farming.", "subdomain-vet:pig-farming", ["porcher"]],
  ["beekeeper","Apiculteur","Beekeeper","Personne qui conduit des colonies d'abeilles et récolte les produits apicoles.", "Person managing bee colonies and harvesting bee products.", "subdomain-vet:beekeeping", ["éleveur d'abeilles"]],
  ["animal-nutritionist","Spécialiste en nutrition animale","Animal nutritionist","Professionnel évaluant les besoins alimentaires et les rations des animaux.", "Professional assessing animal nutritional needs and diets.", "domain-vet:animal-nutrition", ["nutritionniste animal"]],
  ["animal-breeding-technician","Technicien en reproduction animale","Animal breeding technician","Technicien intervenant dans le suivi de la reproduction animale selon ses habilitations.", "Technician supporting animal reproduction within authorized scope.", "domain-vet:animal-reproduction-genetics", ["inséminateur animal"]],
  ["animal-breeder","Sélectionneur animal","Animal breeder","Personne sélectionnant des reproducteurs selon des objectifs et critères encadrés.", "Person selecting breeding animals against managed goals and criteria.", "domain-vet:animal-reproduction-genetics", ["sélectionneur de bétail"]],
  ["animal-shelter-manager","Responsable de refuge animalier","Animal shelter manager","Personne organisant l'accueil, les soins quotidiens et l'adoption responsable des animaux.", "Person managing animal sheltering, daily care and responsible adoption.", "domain-vet:animal-welfare-protection", ["gestionnaire de refuge"]],
  ["animal-groomer","Toiletteur animalier","Animal groomer","Professionnel assurant l'hygiène et l'entretien externe des animaux.", "Professional providing animal hygiene and grooming.", "subdomain-vet:animal-grooming", ["toiletteuse animalière"]],
  ["pet-trainer","Éducateur canin","Dog trainer","Professionnel accompagnant l'éducation et les comportements du chien.", "Professional supporting dog training and behavior.", "subdomain-vet:dogs-cats", ["éducateur animalier"]],
  ["animal-product-collector","Agent de collecte de produits animaux","Animal product collection agent","Personne organisant la collecte et l'enregistrement des produits animaux.", "Person organizing collection and recording of animal products.", "domain-vet:animal-products-primary", ["collecteur de lait"]],
  ["veterinary-laboratory-technician","Technicien de laboratoire vétérinaire","Veterinary laboratory technician","Technicien réalisant des analyses vétérinaires dans un cadre contrôlé.", "Technician performing veterinary laboratory analyses in a controlled setting.", "subdomain-vet:veterinary-diagnostics", ["laborantin vétérinaire"]],
  ["animal-welfare-officer","Agent de protection animale","Animal welfare officer","Personne chargée d'activités de protection et de suivi du bien-être animal.", "Person responsible for animal protection and welfare activities.", "domain-vet:animal-welfare-protection", ["inspecteur du bien-être animal"]],
].map(([key, fr, en, frDefinition, enDefinition, parentId, terms]) => ({
  id: `occupation-vet:${key}`, type: "occupation", fr, en, frDefinition, enDefinition, parentId, terms,
})) as Seed[];

const ACTIVITY_SEEDS: Seed[] = [
  ["animal-vaccination","Vaccination animale","Animal vaccination","Acte préventif réalisé selon un protocole vétérinaire adapté à l'espèce et au contexte.", "Preventive intervention under a veterinary protocol adapted to species and context.", ["vacciner les animaux"]],
  ["animal-clinical-examination","Examen clinique animal","Animal clinical examination","Examen de l'animal par un professionnel habilité pour évaluer son état de santé.", "Examination by a qualified professional to assess animal health.", ["examiner un animal"]],
  ["animal-disease-reporting","Déclaration d'une maladie animale","Animal disease reporting","Signalement documenté d'une suspicion ou d'un événement sanitaire selon les règles applicables.", "Documented reporting of suspected disease or health events under applicable rules.", ["signaler une maladie animale"]],
  ["animal-isolation","Isolement d'un animal","Animal isolation","Séparation temporaire organisée pour limiter les contacts et gérer un risque sanitaire.", "Temporary separation to limit contact and manage a health risk.", ["mettre un animal en quarantaine"]],
  ["animal-feeding","Alimentation des animaux","Animal feeding","Distribution d'aliments et d'eau selon les besoins et les pratiques adaptées.", "Providing feed and water according to appropriate needs and practices.", ["nourrir les animaux"]],
  ["animal-weight-monitoring","Pesée et suivi du poids animal","Animal weighing and weight monitoring","Mesure et suivi périodique du poids d'un animal ou d'un lot.", "Periodic measurement and monitoring of animal or group weight.", ["peser les animaux"]],
  ["animal-breeding-recording","Enregistrement des reproductions","Animal breeding recording","Enregistrement des accouplements, inséminations, gestations et mises bas.", "Recording mating, insemination, pregnancy and birth events.", ["suivi de reproduction"]],
  ["animal-veterinary-treatment-followup","Suivi d'un traitement vétérinaire","Veterinary treatment follow-up","Suivi de l'application et des résultats d'un traitement prescrit par un vétérinaire.", "Monitoring implementation and outcomes of a veterinarian-prescribed treatment.", ["suivi des traitements"]],
  ["animal-identification-recording","Enregistrement de l'identification animale","Animal identification recording","Enregistrement d'une identification et de ses informations associées.", "Recording animal identification and associated information.", ["identifier un animal"]],
  ["animal-movement-recording","Enregistrement des mouvements animaux","Animal movement recording","Enregistrement des entrées, sorties et transferts d'animaux.", "Recording animal arrivals, departures and transfers.", ["suivi des mouvements du cheptel"]],
  ["animal-housing-cleaning","Nettoyage des locaux d'élevage","Livestock housing cleaning","Nettoyage et entretien des espaces hébergeant des animaux.", "Cleaning and maintenance of animal housing.", ["nettoyer la bergerie", "nettoyer le poulailler"]],
  ["animal-biosecurity-control","Contrôle de biosécurité","Biosecurity control","Application et suivi de mesures visant à réduire les risques d'introduction et de diffusion d'agents biologiques.", "Applying and monitoring measures to reduce introduction and spread of biological agents.", ["biosécurité élevage"]],
  ["animal-vaccination-recording","Enregistrement des vaccinations","Vaccination recording","Enregistrement des vaccinations, lots, dates et intervenants.", "Recording vaccinations, batches, dates and responsible personnel.", ["carnet de vaccination animale"]],
  ["animal-feed-formulation","Formulation d'une ration animale","Animal ration formulation","Élaboration d'une ration selon les besoins et les conseils techniques compétents.", "Formulating a ration according to needs and qualified technical advice.", ["composer une ration"]],
  ["animal-milk-collection","Collecte du lait","Milk collection","Collecte, mesure et enregistrement du lait dans des conditions adaptées.", "Collection, measurement and recording of milk under appropriate conditions.", ["traite et collecte du lait"]],
  ["animal-egg-collection","Collecte des œufs","Egg collection","Ramassage, tri initial et enregistrement des œufs.", "Collection, initial sorting and recording of eggs.", ["ramassage des œufs"]],
  ["animal-honey-harvesting","Récolte du miel","Honey harvesting","Récolte des produits de la ruche dans des conditions adaptées.", "Harvesting hive products under appropriate conditions.", ["récolter le miel"]],
  ["animal-shelter-intake","Admission en refuge","Animal shelter intake","Enregistrement de l'arrivée, de l'état apparent et de l'identification d'un animal accueilli.", "Recording arrival, apparent condition and identification of a sheltered animal.", ["accueil d'un animal"]],
  ["animal-grooming-service","Prestation de toilettage","Animal grooming service","Réalisation d'une prestation de toilettage et d'hygiène animale.", "Providing animal grooming and hygiene services.", ["toiletter un chien"]],
  ["animal-health-stock-control","Gestion du stock vétérinaire","Veterinary stock control","Suivi des stocks de produits et matériels vétérinaires dans le respect des règles applicables.", "Monitoring veterinary product and equipment stock under applicable rules.", ["stock de médicaments vétérinaires"]],
].map(([key, fr, en, frDefinition, enDefinition, terms]) => ({
  id: `activity-vet:${key}`, type: "activity", fr, en, frDefinition, enDefinition, terms,
})) as Seed[];

const PROCESS_SEEDS: Seed[] = [
  ["animal-health-followup","Suivi sanitaire d'un élevage","Livestock health monitoring","Ensemble organisé des observations, contrôles, interventions et enregistrements sanitaires d'un élevage.", "Organized sequence of observations, checks, interventions and health records for a livestock operation."],
  ["veterinary-consultation","Parcours de consultation vétérinaire","Veterinary consultation workflow","Accueil, recueil des informations, examen, décision professionnelle, compte rendu et suivi d'une consultation.", "Reception, information gathering, examination, professional decision, report and follow-up."],
  ["animal-vaccination-campaign","Campagne de vaccination animale","Animal vaccination campaign","Planification, autorisation, réalisation et traçabilité d'une campagne de vaccination.", "Planning, authorization, delivery and traceability of a vaccination campaign."],
  ["animal-breeding-cycle","Cycle de reproduction animale","Animal breeding cycle","Suivi des reproducteurs, accouplement ou insémination, gestation, naissance et période postnatale.", "Monitoring breeders, mating or insemination, pregnancy, birth and postnatal period."],
  ["livestock-feed-cycle","Cycle d'alimentation d'un élevage","Livestock feeding cycle","Planification des besoins, approvisionnement, stockage, distribution et suivi alimentaire.", "Planning needs, procurement, storage, distribution and feed monitoring."],
  ["animal-batch-traceability","Traçabilité d'un lot d'animaux","Animal batch traceability","Suivi de l'origine, de l'identification, des mouvements et des événements d'un lot.", "Tracking origin, identification, movements and events of an animal group."],
  ["animal-shelter-adoption","Parcours d'accueil et d'adoption animale","Animal shelter and adoption workflow","Admission, évaluation, soins, hébergement, recherche d'adoptant et suivi d'adoption.", "Intake, assessment, care, housing, adopter matching and adoption follow-up."],
  ["animal-product-collection","Collecte primaire de produits animaux","Primary animal product collection","Organisation de la collecte, du contrôle initial, de l'enregistrement et du transfert des produits animaux.", "Organization of collection, initial checks, recording and transfer of animal products."],
  ["animal-outbreak-response","Gestion d'un foyer de maladie animale","Animal disease outbreak response","Signalement, investigation, mesures de maîtrise et suivi d'un événement sanitaire selon les autorités compétentes.", "Reporting, investigation, control measures and monitoring under competent authorities."],
  ["veterinary-medicine-stock","Gestion des médicaments vétérinaires","Veterinary medicine inventory workflow","Approvisionnement, réception, stockage, suivi des lots, péremptions et délivrance réglementée.", "Procurement, receipt, storage, batch and expiry tracking, and regulated dispensing."],
].map(([key, fr, en, frDefinition, enDefinition]) => ({
  id: `process-vet:${key}`, type: "process", fr, en, frDefinition, enDefinition,
})) as Seed[];

const PROBLEM_SEEDS: Seed[] = [
  ["animal-mortality","Mortalité animale","Animal mortality","Décès d'un ou plusieurs animaux dans un contexte à documenter sans présumer la cause.", "Death of one or more animals in a context requiring investigation without presuming the cause.", ["animaux qui meurent"]],
  ["animal-disease-outbreak","Suspicion de maladie contagieuse","Suspected contagious animal disease","Suspicion d'un problème sanitaire pouvant concerner plusieurs animaux.", "Suspected health issue potentially affecting multiple animals.", ["épidémie dans l'élevage"]],
  ["low-animal-productivity","Faible productivité animale","Low animal productivity","Production observée inférieure à l'objectif ou à la référence définie.", "Observed production below a defined target or reference.", ["baisse de ponte", "baisse de lait"]],
  ["animal-feed-shortage","Manque d'aliments pour animaux","Animal feed shortage","Disponibilité insuffisante d'aliments ou de fourrages pour les animaux.", "Insufficient availability of feed or forage.", ["manque de provende"]],
  ["animal-feed-cost","Coût élevé de l'alimentation animale","High animal feed cost","Dépenses alimentaires jugées trop élevées au regard des ressources ou objectifs.", "Feed expenses considered too high relative to resources or goals.", ["provende trop chère"]],
  ["animal-reproduction-failure","Difficultés de reproduction animale","Animal reproduction difficulties","Résultats de reproduction jugés insuffisants ou événements reproductifs problématiques.", "Unsatisfactory breeding outcomes or problematic reproductive events.", ["animaux ne se reproduisent pas"]],
  ["animal-injury","Blessure animale","Animal injury","Lésion ou traumatisme observé nécessitant une évaluation adaptée.", "Observed lesion or trauma requiring appropriate assessment.", ["animal blessé"]],
  ["animal-escape-loss","Fuite ou perte d'animaux","Animal escape or loss","Animal échappé, égaré ou dont la localisation n'est plus connue.", "Animal escaped, missing or no longer located.", ["animaux disparus"]],
  ["animal-theft","Vol d'animaux","Animal theft","Disparition suspectée ou confirmée d'animaux dans un contexte de sécurité à documenter.", "Suspected or confirmed animal theft requiring security documentation.", ["vol de bétail"]],
  ["animal-identification-gap","Défaut d'identification animale","Animal identification gap","Identification absente, illisible, incohérente ou non reliée au dossier de l'animal.", "Missing, unreadable or inconsistent identification not linked to an animal record.", ["animaux non identifiés"]],
  ["animal-welfare-risk","Risque pour le bien-être animal","Animal welfare risk","Conditions susceptibles de compromettre le bien-être ou la sécurité des animaux.", "Conditions that may compromise animal welfare or safety.", ["mauvais traitement animal"]],
  ["veterinary-stock-expiry","Péremption de produits vétérinaires","Veterinary product expiry","Produits vétérinaires périmés, mal conservés ou dont la traçabilité est insuffisante.", "Expired, poorly stored or inadequately traceable veterinary products.", ["médicaments vétérinaires périmés"]],
  ["animal-product-spoilage","Altération de produits animaux","Animal product spoilage","Dégradation possible d'un produit animal pendant la collecte ou la conservation initiale.", "Possible deterioration of an animal product during collection or initial storage.", ["lait qui tourne", "œufs abîmés"]],
  ["animal-records-missing","Absence de registre d'élevage","Missing livestock records","Informations insuffisantes sur les animaux, interventions, mouvements ou productions.", "Insufficient records about animals, interventions, movements or production.", ["pas de suivi des animaux"]],
].map(([key, fr, en, frDefinition, enDefinition, terms]) => ({
  id: `problem-vet:${key}`, type: "problem", fr, en, frDefinition, enDefinition, terms,
})) as Seed[];

const RESOURCE_SEEDS: Seed[] = [
  ["animal-herd","Troupeau","Herd","Ensemble d'animaux gérés comme un groupe.", "Group of animals managed as a unit."],
  ["animal-individual-record","Dossier individuel animal","Individual animal record","Ensemble des informations d'identification, de santé et de suivi d'un animal.", "Identification, health and monitoring information for an individual animal."],
  ["animal-housing","Bâtiment d'élevage","Livestock housing","Installation destinée à héberger des animaux.", "Facility intended to house animals."],
  ["animal-feed","Aliment pour animaux","Animal feed","Matière ou mélange destiné à l'alimentation animale.", "Material or mixture intended for animal feeding."],
  ["animal-forage","Fourrage","Forage","Végétaux ou matières végétales destinés à l'alimentation des animaux.", "Plants or plant material intended for animal feed."],
  ["veterinary-medicine","Médicament vétérinaire","Veterinary medicine","Produit destiné à un usage vétérinaire et soumis aux règles applicables.", "Product intended for veterinary use and subject to applicable rules."],
  ["veterinary-equipment","Matériel vétérinaire","Veterinary equipment","Équipement utilisé dans les activités vétérinaires.", "Equipment used in veterinary activities."],
  ["animal-identification-tag","Boucle ou dispositif d'identification animale","Animal identification tag","Dispositif permettant d'identifier un animal ou un lot.", "Device used to identify an animal or group."],
  ["incubator","Incubateur","Incubator","Équipement contrôlant les conditions d'incubation d'œufs.", "Equipment controlling egg incubation conditions."],
  ["beehive","Ruche","Beehive","Installation destinée à héberger une colonie d'abeilles.", "Structure intended to house a bee colony."],
  ["milking-equipment","Matériel de traite","Milking equipment","Équipement utilisé pour la collecte du lait.", "Equipment used for milk collection."],
  ["animal-water-point","Abreuvoir","Watering point","Installation mettant de l'eau à disposition des animaux.", "Installation providing water to animals."],
  ["animal-transport-vehicle","Véhicule de transport animal","Animal transport vehicle","Véhicule aménagé ou utilisé pour le transport d'animaux.", "Vehicle adapted or used for animal transport."],
  ["animal-cold-storage","Équipement de conservation initiale","Initial preservation equipment","Équipement de conservation initiale de produits animaux selon les exigences applicables.", "Equipment for initial preservation of animal products under applicable requirements."],
].map(([key, fr, en, frDefinition, enDefinition]) => ({
  id: `resource-vet:${key}`, type: "resource", fr, en, frDefinition, enDefinition,
})) as Seed[];

const FUNCTION_SEEDS: Seed[] = [
  ["register-animal","Enregistrer les animaux","Register animals","Créer et maintenir les dossiers d'identification des animaux.", "Create and maintain animal identification records."],
  ["track-animal-health","Suivre la santé animale","Track animal health","Consigner les observations et événements de santé animale.", "Record animal health observations and events."],
  ["manage-vaccination","Gérer les vaccinations","Manage vaccinations","Planifier et tracer les vaccinations selon les protocoles validés.", "Schedule and trace vaccinations under validated protocols."],
  ["manage-herd","Gérer un troupeau","Manage a herd","Suivre la composition, les mouvements et les événements d'un troupeau.", "Monitor herd composition, movements and events."],
  ["manage-animal-feed","Gérer l'alimentation animale","Manage animal feeding","Planifier les besoins, stocks et distributions alimentaires.", "Plan feed needs, stocks and distributions."],
  ["manage-animal-breeding","Gérer la reproduction animale","Manage animal breeding","Suivre les reproducteurs et événements reproductifs.", "Track breeding animals and reproductive events."],
  ["trace-animal-products","Tracer les produits animaux","Trace animal products","Relier un produit à son origine et à ses étapes de collecte.", "Link a product to its origin and collection stages."],
  ["manage-veterinary-stock","Gérer le stock vétérinaire","Manage veterinary inventory","Suivre les lots, quantités, péremptions et mouvements de produits vétérinaires.", "Track batches, quantities, expiry dates and veterinary product movements."],
  ["manage-animal-shelter","Gérer un refuge animalier","Manage an animal shelter","Gérer les admissions, places, soins, sorties et adoptions.", "Manage intakes, capacity, care, exits and adoptions."],
  ["report-animal-disease","Signaler un événement sanitaire animal","Report an animal health event","Enregistrer et transmettre un signalement selon les procédures applicables.", "Record and transmit a report under applicable procedures."],
].map(([key, fr, en, frDefinition, enDefinition]) => ({
  id: `function-vet:${key}`, type: "function", fr, en, frDefinition, enDefinition,
})) as Seed[];

const INDICATOR_SEEDS: Seed[] = [
  ["animal-mortality-rate","Taux de mortalité animale","Animal mortality rate","Part des animaux décédés dans une population et une période définies.", "Share of animals that died in a defined population and period."],
  ["animal-birth-rate","Taux de natalité animale","Animal birth rate","Nombre de naissances rapporté à une population et une période définies.", "Number of births relative to a defined population and period."],
  ["animal-vaccination-coverage","Couverture vaccinale animale","Animal vaccination coverage","Part des animaux éligibles effectivement vaccinés selon le protocole retenu.", "Share of eligible animals vaccinated under the selected protocol."],
  ["average-daily-animal-gain","Gain moyen quotidien","Average daily gain","Variation moyenne du poids par animal et par jour sur une période définie.", "Average weight change per animal per day over a defined period."],
  ["feed-conversion-ratio","Indice de consommation alimentaire","Feed conversion ratio","Quantité d'aliment consommée rapportée à une quantité de production définie.", "Feed consumed relative to a defined quantity of production."],
  ["egg-laying-rate","Taux de ponte","Egg laying rate","Nombre d'œufs produits rapporté à l'effectif de pondeuses et à la période définis.", "Eggs produced relative to the defined number of laying birds and period."],
  ["milk-yield-per-animal","Production laitière par animal","Milk yield per animal","Volume de lait collecté par animal et par période définie.", "Milk volume collected per animal over a defined period."],
].map(([key, fr, en, frDefinition, enDefinition]) => ({
  id: `indicator-vet:${key}`, type: "indicator", fr, en, frDefinition, enDefinition,
})) as Seed[];

const seeds: Seed[] = [
  ...DOMAIN_SEEDS, ...SUBDOMAIN_SEEDS, ...SPECIALIZATION_SEEDS, ...OCCUPATION_SEEDS,
  ...ACTIVITY_SEEDS, ...PROCESS_SEEDS, ...PROBLEM_SEEDS, ...RESOURCE_SEEDS, ...FUNCTION_SEEDS, ...INDICATOR_SEEDS,
];
const concepts = seeds.map(makeConcept);
const familyConcept = makeConcept(FAMILY_SEED);
const activityProcessLinks: Array<[string, string]> = [
  ["process-vet:animal-health-followup", "activity-vet:animal-clinical-examination"],
  ["process-vet:animal-health-followup", "activity-vet:animal-vaccination"],
  ["process-vet:animal-health-followup", "activity-vet:animal-vaccination-recording"],
  ["process-vet:animal-health-followup", "activity-vet:animal-disease-reporting"],
  ["process-vet:animal-vaccination-campaign", "activity-vet:animal-vaccination"],
  ["process-vet:animal-vaccination-campaign", "activity-vet:animal-vaccination-recording"],
  ["process-vet:livestock-feed-cycle", "activity-vet:animal-feeding"],
  ["process-vet:livestock-feed-cycle", "activity-vet:animal-weight-monitoring"],
  ["process-vet:animal-breeding-cycle", "activity-vet:animal-breeding-recording"],
  ["process-vet:animal-batch-traceability", "activity-vet:animal-identification-recording"],
  ["process-vet:animal-batch-traceability", "activity-vet:animal-movement-recording"],
  ["process-vet:animal-shelter-adoption", "activity-vet:animal-shelter-intake"],
  ["process-vet:animal-product-collection", "activity-vet:animal-milk-collection"],
  ["process-vet:animal-product-collection", "activity-vet:animal-egg-collection"],
  ["process-vet:animal-product-collection", "activity-vet:animal-honey-harvesting"],
  ["process-vet:veterinary-medicine-stock", "activity-vet:animal-health-stock-control"],
];
const processActivityRelationships = activityProcessLinks.map(([processId, activityId]) =>
  relation(`rel:animal-vet:process-activity:${processId.split(":").pop()}:${activityId.split(":").pop()}`, processId, activityId, "includes_activity"),
);
const occupationDomainSeeds: Array<[string, string]> = [
  ["occupation-vet:veterinarian", "domain-vet:veterinary-medicine"],
  ["occupation-vet:veterinary-nurse", "domain-vet:veterinary-medicine"],
  ["occupation-vet:animal-health-technician", "domain-vet:veterinary-medicine"],
  ["occupation-vet:livestock-farmer", "domain:livestock"],
  ["occupation-vet:poultry-farmer", "domain:livestock"],
  ["occupation-vet:cattle-farmer", "domain:livestock"],
  ["occupation-vet:small-ruminant-farmer", "domain:livestock"],
  ["occupation-vet:pig-farmer", "domain:livestock"],
  ["occupation-vet:beekeeper", "domain:livestock"],
  ["occupation-vet:animal-nutritionist", "domain-vet:animal-nutrition"],
  ["occupation-vet:animal-breeding-technician", "domain-vet:animal-reproduction-genetics"],
  ["occupation-vet:animal-breeder", "domain-vet:animal-reproduction-genetics"],
  ["occupation-vet:animal-shelter-manager", "domain-vet:animal-welfare-protection"],
  ["occupation-vet:animal-groomer", "domain-vet:companion-animal-care"],
  ["occupation-vet:pet-trainer", "domain-vet:companion-animal-care"],
  ["occupation-vet:animal-product-collector", "domain-vet:animal-products-primary"],
  ["occupation-vet:veterinary-laboratory-technician", "domain-vet:veterinary-medicine"],
  ["occupation-vet:animal-welfare-officer", "domain-vet:animal-welfare-protection"],
];
const occupationDomainRelationships = occupationDomainSeeds.map(([occupationId, domainId]) =>
  relation(`rel:animal-vet:occupation-domain:${occupationId.split(":").pop()}`, occupationId, domainId, "works_in_domain"),
);
const resourceDomainSeeds: Array<[string, string]> = [
  ["animal-herd", "domain:livestock"],
  ["animal-individual-record", "domain-vet:veterinary-medicine"],
  ["animal-housing", "domain:livestock"],
  ["animal-feed", "domain-vet:animal-nutrition"],
  ["animal-forage", "domain-vet:animal-nutrition"],
  ["veterinary-medicine", "domain-vet:veterinary-medicine"],
  ["veterinary-equipment", "domain-vet:veterinary-medicine"],
  ["animal-identification-tag", "domain-vet:animal-welfare-protection"],
  ["incubator", "domain:livestock"],
  ["beehive", "domain:livestock"],
  ["milking-equipment", "domain-vet:animal-products-primary"],
  ["animal-water-point", "domain:livestock"],
  ["animal-transport-vehicle", "domain-vet:animal-welfare-protection"],
  ["animal-cold-storage", "domain-vet:animal-products-primary"],
];
const resourceDomainRelationships = resourceDomainSeeds.map(([resourceKey, domainId]) =>
  relation(`rel:animal-vet:resource-domain:${resourceKey}`, `resource-vet:${resourceKey}`, domainId, "resource_for_domain"),
);
const problemSolutionSeeds: Array<[string, string]> = [
  ["animal-mortality", "function-vet:track-animal-health"],
  ["animal-disease-outbreak", "function-vet:report-animal-disease"],
  ["low-animal-productivity", "function-vet:track-animal-health"],
  ["animal-feed-shortage", "function-vet:manage-animal-feed"],
  ["animal-feed-cost", "function-vet:manage-animal-feed"],
  ["animal-reproduction-failure", "function-vet:manage-animal-breeding"],
  ["animal-injury", "function-vet:track-animal-health"],
  ["animal-escape-loss", "function-vet:register-animal"],
  ["animal-theft", "function-vet:register-animal"],
  ["animal-identification-gap", "function-vet:register-animal"],
  ["animal-welfare-risk", "function-vet:manage-animal-shelter"],
  ["veterinary-stock-expiry", "function-vet:manage-veterinary-stock"],
  ["animal-product-spoilage", "function-vet:trace-animal-products"],
  ["animal-records-missing", "function-vet:manage-herd"],
];
const problemFunctionRelationships = problemSolutionSeeds.map(([problemKey, functionId]) =>
  relation(`rel:animal-vet:problem-function:${problemKey}`, `problem-vet:${problemKey}`, functionId, "may_be_addressed_by"),
);
const indicatorDomainSeeds: Array<[string, string]> = [
  ["animal-mortality-rate", "domain-vet:veterinary-medicine"],
  ["animal-birth-rate", "domain-vet:animal-reproduction-genetics"],
  ["animal-vaccination-coverage", "domain-vet:veterinary-medicine"],
  ["average-daily-animal-gain", "domain:livestock"],
  ["feed-conversion-ratio", "domain-vet:animal-nutrition"],
  ["egg-laying-rate", "domain:livestock"],
  ["milk-yield-per-animal", "domain-vet:animal-products-primary"],
];
const indicatorDomainRelationships = indicatorDomainSeeds.map(([indicatorKey, domainId]) =>
  relation(`rel:animal-vet:indicator-domain:${indicatorKey}`, `indicator-vet:${indicatorKey}`, domainId, "measures_domain"),
);
const crossFamilyRelationships = [
  relation("rel:animal-vet:existing-livestock-domain", "domain:livestock", FAMILY_SEED.id, "also_classified_in_family"),
  relation("rel:animal-vet:family-agriculture-intersection", FAMILY_SEED.id, "family:agriculture-agrofood", "intersects_with_family"),
  relation("rel:animal-vet:livestock-crop-family-intersection", "domain:livestock", "family:agriculture-agrofood", "has_supply_chain_relationship_with"),
  relation("rel:animal-vet:animal-products-agri-food", "domain-vet:animal-products-primary", "domain-v2:agrofood-processing", "supplies_raw_material_to"),
  relation("rel:animal-vet:feed-crop-production", "domain-vet:animal-nutrition", "domain-v2:crop-production", "uses_inputs_from"),
  relation("rel:animal-vet:fishery-boundary", FAMILY_SEED.id, "domain:fisheries", "has_adjacent_but_distinct_domain"),
];
const existingLivestockDomain = UNIVERSAL_DOMAIN_CATALOG.find((item) => item.id === "domain:livestock");
if (!existingLivestockDomain) throw new Error("The existing canonical livestock domain is required by the animal family.");
const linkedLivestockDomain: KnowledgeConcept = {
  ...existingLivestockDomain,
  classifications: [
    ...existingLivestockDomain.classifications,
    { classificationType: "foundation-a-family-v2", parentConceptId: FAMILY_SEED.id },
  ],
};

export const ANIMAL_VETERINARY_LEGACY_DOMAIN_PATCHES = [linkedLivestockDomain];
export const ANIMAL_VETERINARY_DOMAINS = [
  linkedLivestockDomain,
  ...concepts.filter((item) => item.conceptType === "domain"),
];
export const ANIMAL_VETERINARY_FAMILY = familyConcept;
export const ANIMAL_VETERINARY_SUBDOMAINS = concepts.filter((item) => item.conceptType === "subdomain");
export const ANIMAL_VETERINARY_SPECIALIZATIONS = concepts.filter((item) => item.conceptType === "specialization");
export const ANIMAL_VETERINARY_OCCUPATIONS = concepts.filter((item) => item.conceptType === "occupation");
export const ANIMAL_VETERINARY_ACTIVITIES = concepts.filter((item) => item.conceptType === "activity");
export const ANIMAL_VETERINARY_PROCESSES = concepts.filter((item) => item.conceptType === "process");
export const ANIMAL_VETERINARY_PROBLEMS = concepts.filter((item) => item.conceptType === "problem");
export const ANIMAL_VETERINARY_RESOURCES = concepts.filter((item) => item.conceptType === "resource");
export const ANIMAL_VETERINARY_FUNCTIONS = concepts.filter((item) => item.conceptType === "function");
export const ANIMAL_VETERINARY_INDICATORS = concepts.filter((item) => item.conceptType === "indicator");
export const ANIMAL_VETERINARY_CATALOG = [familyConcept, ...concepts];
export const ANIMAL_VETERINARY_RELATIONSHIPS = [
  ...processActivityRelationships,
  ...occupationDomainRelationships,
  ...resourceDomainRelationships,
  ...problemFunctionRelationships,
  ...indicatorDomainRelationships,
  ...crossFamilyRelationships,
];
