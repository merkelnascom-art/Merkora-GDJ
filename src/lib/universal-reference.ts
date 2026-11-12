export type UniversalSector = {
  id: string;
  familyId: string;
  label: string;
  description: string;
};

export type UniversalFamily = {
  id: string;
  number: number;
  label: string;
  sectors: readonly UniversalSector[];
};

/**
 * Canonical reference copied from docs/strategie-13-domaines/09.
 * It is separate from the 13 operational DomainId records for compatibility.
 */
export const MERKORA_UNIVERSAL_FAMILIES = [
  {
    id: "family-01",
    number: 1,
    label: "Santé, médecine, pharmacie et bien-être",
    sectors: [
      { id: "S01-01", familyId: "family-01", label: "Médecine générale et soins primaires", description: "Consultations, rendez-vous, dossiers autorisés, suivi administratif, orientation" },
      { id: "S01-02", familyId: "family-01", label: "Médecines spécialisées et chirurgie", description: "Parcours spécialisés, planification, coordination, comptes rendus et suivi" },
      { id: "S01-03", familyId: "family-01", label: "Soins infirmiers et paramédicaux", description: "Tournées, actes, planning, transmissions et suivi des interventions" },
      { id: "S01-04", familyId: "family-01", label: "Pharmacies et distribution pharmaceutique", description: "Stocks, lots, commandes, délivrance, fournisseurs et alertes" },
      { id: "S01-05", familyId: "family-01", label: "Laboratoires, imagerie et diagnostic", description: "Demandes, prélèvements, examens, résultats, traçabilité et rendez-vous" },
    ],
  },
  {
    id: "family-02",
    number: 2,
    label: "Sport, fitness, loisirs sportifs et compétitions",
    sectors: [
      { id: "S02-01", familyId: "family-02", label: "Clubs et associations sportives", description: "Adhésions, licences, cotisations, équipes et communication" },
      { id: "S02-02", familyId: "family-02", label: "Salles de sport et fitness", description: "Abonnements, accès, séances, coachs, équipements" },
      { id: "S02-03", familyId: "family-02", label: "Entraînement et coaching individuel", description: "Objectifs, programmes, rendez-vous et progression" },
      { id: "S02-04", familyId: "family-02", label: "Compétitions et fédérations", description: "Inscriptions, calendriers, résultats, arbitres et classements" },
      { id: "S02-05", familyId: "family-02", label: "Installations et équipements sportifs", description: "Réservations, maintenance, inventaire et sécurité" },
    ],
  },
  {
    id: "family-03",
    number: 3,
    label: "Agriculture, élevage, pêche et environnement",
    sectors: [
      { id: "S03-01", familyId: "family-03", label: "Cultures vivrières et maraîchage", description: "Parcelles, semis, intrants, récoltes, ventes et météo" },
      { id: "S03-02", familyId: "family-03", label: "Cultures de rente et plantations", description: "Campagnes, parcelles, rendements, achats et traçabilité" },
      { id: "S03-03", familyId: "family-03", label: "Élevage et santé animale", description: "Cheptel, alimentation, reproduction, soins et ventes" },
      { id: "S03-04", familyId: "family-03", label: "Pêche, aquaculture et transformation", description: "Captures, bassins, alimentation, lots, chaîne du froid" },
      { id: "S03-05", familyId: "family-03", label: "Environnement, forêt et gestion des ressources", description: "Inspections, inventaires, incidents et indicateurs environnementaux" },
    ],
  },
  {
    id: "family-04",
    number: 4,
    label: "Commerce, distribution, vente et e-commerce",
    sectors: [
      { id: "S04-01", familyId: "family-04", label: "Commerce de détail et boutiques", description: "Catalogue, ventes, caisse, stock, fidélité" },
      { id: "S04-02", familyId: "family-04", label: "Commerce de gros et import-export", description: "Tarifs, fournisseurs, commandes, lots et logistique" },
      { id: "S04-03", familyId: "family-04", label: "Vente en ligne et marketplaces", description: "Catalogue, panier, commandes, paiement et livraison" },
      { id: "S04-04", familyId: "family-04", label: "Vente directe, réseaux et distribution indépendante", description: "Portefeuille de vendeurs, commissions, prospects et suivi" },
      { id: "S04-05", familyId: "family-04", label: "Distribution spécialisée et points de vente multiples", description: "Multi-boutiques, inventaires, transferts et tableaux de bord" },
    ],
  },
  {
    id: "family-05",
    number: 5,
    label: "Finance, comptabilité, assurance et gestion patrimoniale",
    sectors: [
      { id: "S05-01", familyId: "family-05", label: "Comptabilité et expertise comptable", description: "Pièces, journaux, rapprochements, clôtures et rapports" },
      { id: "S05-02", familyId: "family-05", label: "Trésorerie et gestion financière d'entreprise", description: "Encaissements, décaissements, prévisions et budgets" },
      { id: "S05-03", familyId: "family-05", label: "Banque, microfinance et crédit", description: "Dossiers, échéances, remboursements et suivi des risques" },
      { id: "S05-04", familyId: "family-05", label: "Assurance et courtage", description: "Contrats, primes, sinistres, échéances et clients" },
      { id: "S05-05", familyId: "family-05", label: "Gestion patrimoniale et finances personnelles", description: "Budgets, actifs, dettes, objectifs et projections" },
    ],
  },
  {
    id: "family-06",
    number: 6,
    label: "Entrepreneuriat, direction et gestion des organisations",
    sectors: [
      { id: "S06-01", familyId: "family-06", label: "Création et accompagnement d'entreprise", description: "Idée, étude, formalités, business plan et suivi" },
      { id: "S06-02", familyId: "family-06", label: "Direction générale et pilotage", description: "Objectifs, indicateurs, décisions et plans d'action" },
      { id: "S06-03", familyId: "family-06", label: "Gestion de projets et programmes", description: "Tâches, jalons, ressources, risques et livrables" },
      { id: "S06-04", familyId: "family-06", label: "Conseil et accompagnement professionnel", description: "Missions, diagnostics, recommandations et rapports" },
      { id: "S06-05", familyId: "family-06", label: "Qualité, audit et amélioration continue", description: "Procédures, contrôles, écarts, actions correctives" },
    ],
  },
  {
    id: "family-07",
    number: 7,
    label: "Immobilier, architecture, urbanisme, BTP et maintenance des bâtiments",
    sectors: [
      { id: "S07-01", familyId: "family-07", label: "Transaction et gestion immobilière", description: "Biens, mandats, visites, offres et commissions" },
      { id: "S07-02", familyId: "family-07", label: "Location et gestion locative", description: "Baux, loyers, charges, états des lieux et incidents" },
      { id: "S07-03", familyId: "family-07", label: "Architecture et maîtrise d'œuvre", description: "Plans, versions, clients, validations et chantier" },
      { id: "S07-04", familyId: "family-07", label: "Construction et travaux publics", description: "Devis, équipes, matériaux, planning, avancement" },
      { id: "S07-05", familyId: "family-07", label: "Maintenance et gestion technique des bâtiments", description: "Interventions, équipements, contrats et historique" },
    ],
  },
  {
    id: "family-08",
    number: 8,
    label: "Éducation, formation, recherche et orientation",
    sectors: [
      { id: "S08-01", familyId: "family-08", label: "Enseignement préscolaire et primaire", description: "Inscriptions, classes, présence, suivi et communication" },
      { id: "S08-02", familyId: "family-08", label: "Enseignement secondaire et supérieur", description: "Cours, évaluations, emplois du temps, résultats" },
      { id: "S08-03", familyId: "family-08", label: "Formation professionnelle et apprentissage", description: "Sessions, compétences, stages, attestations" },
      { id: "S08-04", familyId: "family-08", label: "Formation continue et apprentissage en ligne", description: "Modules, contenus, progression et évaluations" },
      { id: "S08-05", familyId: "family-08", label: "Orientation scolaire, universitaire et professionnelle", description: "Questionnaires, intérêts, pistes, parcours et accompagnement" },
    ],
  },
  {
    id: "family-09",
    number: 9,
    label: "Transport, mobilité, logistique et automobile",
    sectors: [
      { id: "S09-01", familyId: "family-09", label: "Transport de personnes", description: "Réservations, trajets, chauffeurs, horaires et incidents" },
      { id: "S09-02", familyId: "family-09", label: "Transport de marchandises et livraison", description: "Missions, colis, preuve de livraison et suivi" },
      { id: "S09-03", familyId: "family-09", label: "Entreposage et gestion de stocks logistiques", description: "Emplacements, entrées, sorties et inventaires" },
      { id: "S09-04", familyId: "family-09", label: "Garage, réparation et entretien automobile", description: "Ordres de travail, pièces, diagnostics et rendez-vous" },
      { id: "S09-05", familyId: "family-09", label: "Flottes, location et mobilité partagée", description: "Véhicules, contrats, carburant, maintenance et conducteurs" },
    ],
  },
  {
    id: "family-10",
    number: 10,
    label: "Restauration, alimentation, hôtellerie et hébergement",
    sectors: [
      { id: "S10-01", familyId: "family-10", label: "Restaurants et restauration traditionnelle", description: "Menus, commandes, tables, caisse et achats" },
      { id: "S10-02", familyId: "family-10", label: "Restauration rapide et livraison de repas", description: "Commandes, préparation, délais et livreurs" },
      { id: "S10-03", familyId: "family-10", label: "Traiteurs et restauration événementielle", description: "Devis, menus, quantités, équipes et événements" },
      { id: "S10-04", familyId: "family-10", label: "Hôtels, auberges et résidences", description: "Réservations, chambres, clients et facturation" },
      { id: "S10-05", familyId: "family-10", label: "Hébergements touristiques et locations courte durée", description: "Disponibilités, arrivées, ménage et avis" },
    ],
  },
  {
    id: "family-11",
    number: 11,
    label: "Événementiel, culture, tourisme et voyages",
    sectors: [
      { id: "S11-01", familyId: "family-11", label: "Organisation d'événements privés et professionnels", description: "Devis, prestataires, programme, invitations et budget" },
      { id: "S11-02", familyId: "family-11", label: "Billetterie, spectacles et festivals", description: "Billets, contrôle d'accès, jauges et programmation" },
      { id: "S11-03", familyId: "family-11", label: "Tourisme, agences et circuits", description: "Offres, itinéraires, réservations et voyageurs" },
      { id: "S11-04", familyId: "family-11", label: "Voyages et services de réservation", description: "Dossiers, documents, échéances et assistance" },
      { id: "S11-05", familyId: "family-11", label: "Patrimoine, musées et médiation culturelle", description: "Collections, visites, guides et événements" },
    ],
  },
  {
    id: "family-12",
    number: 12,
    label: "Ressources humaines, recrutement et organisation du travail",
    sectors: [
      { id: "S12-01", familyId: "family-12", label: "Recrutement et sélection", description: "Offres, candidatures, entretiens et décisions" },
      { id: "S12-02", familyId: "family-12", label: "Administration du personnel", description: "Dossiers, contrats, congés et attestations" },
      { id: "S12-03", familyId: "family-12", label: "Temps, présence et planification", description: "Horaires, pointages, retards et corrections" },
      { id: "S12-04", familyId: "family-12", label: "Paie, avantages et rémunération", description: "Variables, validations, bulletins et historique" },
      { id: "S12-05", familyId: "family-12", label: "Formation, compétences et performance", description: "Compétences, objectifs, formations et entretiens" },
    ],
  },
  {
    id: "family-13",
    number: 13,
    label: "Artisanat, fabrication, industrie et métiers techniques",
    sectors: [
      { id: "S13-01", familyId: "family-13", label: "Artisanat d'art et création manuelle", description: "Commandes, matières, devis, étapes et livraison" },
      { id: "S13-02", familyId: "family-13", label: "Menuiserie, métallurgie et construction artisanale", description: "Mesures, plans, fabrication, pose et maintenance" },
      { id: "S13-03", familyId: "family-13", label: "Textile, mode et confection", description: "Modèles, tailles, matières, commandes et stocks" },
      { id: "S13-04", familyId: "family-13", label: "Industrie et production en atelier", description: "Ordres de fabrication, qualité, maintenance et lots" },
      { id: "S13-05", familyId: "family-13", label: "Réparation et maintenance d'équipements", description: "Tickets, diagnostic, pièces, interventions et garantie" },
    ],
  },
  {
    id: "family-14",
    number: 14,
    label: "Services aux personnes, services à domicile et assistance",
    sectors: [
      { id: "S14-01", familyId: "family-14", label: "Aide et accompagnement à domicile", description: "Bénéficiaires, visites, intervenants et transmissions" },
      { id: "S14-02", familyId: "family-14", label: "Entretien et nettoyage", description: "Contrats, tournées, produits et contrôle qualité" },
      { id: "S14-03", familyId: "family-14", label: "Beauté, coiffure et soins esthétiques", description: "Rendez-vous, prestations, produits et fidélité" },
      { id: "S14-04", familyId: "family-14", label: "Services personnels et conciergerie", description: "Demandes, planning, prestataires et suivi" },
      { id: "S14-05", familyId: "family-14", label: "Garde d'enfants et accompagnement familial", description: "Planning, autorisations, contacts et transmissions" },
    ],
  },
  {
    id: "family-15",
    number: 15,
    label: "Administration, collectivités, services publics et citoyenneté",
    sectors: [
      { id: "S15-01", familyId: "family-15", label: "Administration territoriale et collectivités", description: "Courriers, services, dossiers et délibérations" },
      { id: "S15-02", familyId: "family-15", label: "État civil et gestion documentaire publique", description: "Demandes, pièces, instruction et délivrance" },
      { id: "S15-03", familyId: "family-15", label: "Services municipaux et interventions locales", description: "Signalements, équipes, équipements et suivi" },
      { id: "S15-04", familyId: "family-15", label: "Services aux citoyens et démarches", description: "Formulaires, rendez-vous, suivi et notifications" },
      { id: "S15-05", familyId: "family-15", label: "Gestion des archives et documents administratifs", description: "Classement, conservation, recherche et accès" },
    ],
  },
  {
    id: "family-16",
    number: 16,
    label: "Droit, conformité, médiation et services juridiques",
    sectors: [
      { id: "S16-01", familyId: "family-16", label: "Cabinets d'avocats et conseil juridique", description: "Clients, dossiers, audiences et échéances" },
      { id: "S16-02", familyId: "family-16", label: "Notariat et actes", description: "Dossiers, pièces, rendez-vous et formalités" },
      { id: "S16-03", familyId: "family-16", label: "Huissiers, commissaires de justice et exécution", description: "Missions, constats, actes et suivi" },
      { id: "S16-04", familyId: "family-16", label: "Médiation et résolution de conflits", description: "Parties, séances, accords et confidentialité" },
      { id: "S16-05", familyId: "family-16", label: "Conformité, protection des données et contrôle", description: "Registres, contrôles, incidents et plans d'action" },
    ],
  },
  {
    id: "family-17",
    number: 17,
    label: "Numérique, informatique, télécommunications et médias digitaux",
    sectors: [
      { id: "S17-01", familyId: "family-17", label: "Développement logiciel et applications", description: "Projets, code, versions, tests et déploiements" },
      { id: "S17-02", familyId: "family-17", label: "Support informatique et maintenance", description: "Tickets, parc, incidents et interventions" },
      { id: "S17-03", familyId: "family-17", label: "Réseaux, télécoms et infrastructures", description: "Équipements, lignes, incidents et supervision" },
      { id: "S17-04", familyId: "family-17", label: "Marketing digital, communication et médias", description: "Campagnes, contenus, audiences et résultats" },
      { id: "S17-05", familyId: "family-17", label: "Données, IA et automatisation", description: "Jeux de données, workflows, modèles et contrôles" },
    ],
  },
  {
    id: "family-18",
    number: 18,
    label: "Énergie, eau, assainissement et services essentiels",
    sectors: [
      { id: "S18-01", familyId: "family-18", label: "Production et distribution d'électricité", description: "Sites, équipements, incidents et interventions" },
      { id: "S18-02", familyId: "family-18", label: "Énergies renouvelables et installations solaires", description: "Études, équipements, maintenance et rendement" },
      { id: "S18-03", familyId: "family-18", label: "Eau potable et distribution", description: "Compteurs, abonnés, relevés et fuites" },
      { id: "S18-04", familyId: "family-18", label: "Assainissement et déchets", description: "Collecte, tournées, installations et signalements" },
      { id: "S18-05", familyId: "family-18", label: "Services techniques et réseaux essentiels", description: "Maintenance, astreintes, pannes et continuité" },
    ],
  },
  {
    id: "family-19",
    number: 19,
    label: "Sécurité, prévention, sûreté et gestion des risques",
    sectors: [
      { id: "S19-01", familyId: "family-19", label: "Sécurité privée et gardiennage", description: "Sites, rondes, agents, incidents et consignes" },
      { id: "S19-02", familyId: "family-19", label: "Sécurité incendie et prévention", description: "Équipements, inspections, exercices et alertes" },
      { id: "S19-03", familyId: "family-19", label: "Santé et sécurité au travail", description: "Risques, formations, incidents et actions correctives" },
      { id: "S19-04", familyId: "family-19", label: "Gestion de crise et continuité d'activité", description: "Alertes, plans, équipes et journal de crise" },
      { id: "S19-05", familyId: "family-19", label: "Contrôle d'accès et sûreté des sites", description: "Visiteurs, badges, autorisations et journaux d'accès" },
    ],
  },
  {
    id: "family-20",
    number: 20,
    label: "Famille, vie personnelle, associations, solidarité et communauté",
    sectors: [
      { id: "S20-01", familyId: "family-20", label: "Gestion familiale et budget du foyer", description: "Budgets, dépenses, objectifs et tâches communes" },
      { id: "S20-02", familyId: "family-20", label: "Associations et organisations communautaires", description: "Membres, cotisations, activités et gouvernance" },
      { id: "S20-03", familyId: "family-20", label: "ONG, solidarité et projets sociaux", description: "Bénéficiaires, programmes, dons et rapports" },
      { id: "S20-04", familyId: "family-20", label: "Communautés, clubs et groupes d'intérêt", description: "Adhésions, événements, échanges et modération" },
      { id: "S20-05", familyId: "family-20", label: "Organisation personnelle et vie quotidienne", description: "Tâches, rendez-vous, documents et objectifs" },
    ],
  },
] as const satisfies readonly UniversalFamily[];

export const MERKORA_UNIVERSAL_SECTORS: readonly UniversalSector[] =
  MERKORA_UNIVERSAL_FAMILIES.flatMap((family) => family.sectors);

export function getUniversalFamilyById(id: string): UniversalFamily | null {
  return MERKORA_UNIVERSAL_FAMILIES.find((family) => family.id === id) ?? null;
}

export function getUniversalSectorById(id: string): UniversalSector | null {
  return MERKORA_UNIVERSAL_SECTORS.find((sector) => sector.id === id) ?? null;
}
