import type { DomainId, DomainMatch } from "./domain-registry";

export type DomainOption = {
  id: string;
  title: string;
  description: string;
  group?: "metier" | "transversal";
};

const option = (id: string, title: string, description: string, group: DomainOption["group"] = "metier"): DomainOption =>
  ({ id, title, description, group });

/** Options métier complémentaires : elles ne deviennent jamais incluses sans sélection du client. */
const DOMAIN_OPTIONS: Record<DomainId, DomainOption[]> = {
  sport: [
    option("sport-coaches", "Coachs et encadrement", "Profils des coachs, spécialités, disponibilités et affectations."),
    option("sport-facilities", "Terrains et équipements", "Installations, matériel, réservations et maintenance."),
    option("sport-membership-payments", "Cotisations et licences", "Échéances, renouvellements, reçus et suivi des règlements."),
    option("sport-performance", "Progression et performances", "Objectifs, statistiques et historiques sportifs validés par l'encadrement."),
  ],
  sante: [
    option("health-professionals", "Professionnels et équipes", "Profils, spécialités, horaires et affectations des professionnels."),
    option("health-lab-results", "Analyses et résultats", "Réception, suivi et accès contrôlé aux résultats validés."),
    option("health-pharmacy-stock", "Pharmacie et consommables", "Stocks, lots, seuils et mouvements autorisés."),
    option("health-billing", "Facturation et prise en charge", "Prestations, factures et suivi administratif sans décision clinique automatisée."),
  ],
  "agriculture-environnement": [
    option("agri-fields", "Parcelles et cartes", "Sites, parcelles, surfaces et historiques d'exploitation."),
    option("agri-livestock", "Élevage et santé animale", "Animaux, lots, alimentation et interventions consignées."),
    option("agri-harvest-sales", "Récoltes et commercialisation", "Quantités récoltées, qualité, acheteurs et ventes."),
    option("agri-equipment-maintenance", "Matériel et maintenance", "Machines, entretiens, pannes et coûts d'utilisation."),
  ],
  commerce: [
    option("commerce-customers", "Fichier clients et fidélité", "Profils clients, historique, fidélité et consentements."),
    option("commerce-suppliers", "Fournisseurs et achats", "Commandes fournisseurs, réceptions et factures à contrôler."),
    option("commerce-promotions", "Promotions et tarifs", "Prix, remises, périodes et autorisations de modification."),
    option("commerce-multistore", "Multi-boutiques et dépôts", "Sites, transferts de stock et résultats par point de vente."),
  ],
  "entrepreneuriat-finance": [
    option("finance-expenses", "Dépenses et justificatifs", "Catégories, pièces justificatives et circuits de validation."),
    option("finance-cash-forecast", "Prévisions de trésorerie", "Entrées, sorties prévues, scénarios et alertes."),
    option("finance-profitability", "Marges et rentabilité", "Coûts, marges, seuils et hypothèses documentées."),
    option("finance-debts", "Dettes et créances", "Échéances, soldes, relances et rapprochements contrôlés."),
  ],
  "immobilier-btp": [
    option("property-portfolio", "Portefeuille de biens", "Biens, lots, caractéristiques, photos et disponibilité."),
    option("property-tenant-portal", "Espace locataire", "Demandes, documents, échéances et échanges."),
    option("construction-materials", "Matériaux et achats chantier", "Besoins, commandes, réceptions et consommations."),
    option("construction-progress", "Avancement et réception", "Étapes, réserves, photos et validations de chantier."),
  ],
  "education-formation": [
    option("education-timetables", "Emplois du temps", "Cours, salles, enseignants et calendriers."),
    option("education-attendance", "Présences et absences", "Pointages, justificatifs et alertes selon les règles de l'établissement."),
    option("education-parent-portal", "Espace parents et apprenants", "Résultats, annonces, documents et échanges autorisés."),
    option("education-career-guidance", "Orientation et métiers", "Intérêts, tests, pistes de formation et restitution à examiner avec un conseiller."),
  ],
  "transport-logistique": [
    option("transport-orders", "Commandes et expéditions", "Demandes, colis, documents et statuts de traitement."),
    option("transport-routes", "Tournées et itinéraires", "Ordre des arrêts, contraintes horaires et optimisation à valider."),
    option("transport-fuel-costs", "Carburant et coûts", "Consommations, dépenses et indicateurs par véhicule."),
    option("transport-customer-tracking", "Espace de suivi client", "Consultation des statuts et preuves de livraison autorisées."),
  ],
  "restauration-hotellerie-evenementiel": [
    option("hospitality-tables-rooms", "Tables, chambres et capacités", "Plans, disponibilités, affectations et règles d'occupation."),
    option("hospitality-menu-orders", "Menus et commandes", "Carte, commandes, options et suivi de préparation."),
    option("hospitality-event-guests", "Invités et accès événement", "Listes, billets, contrôle d'accès et capacité."),
    option("hospitality-food-safety", "Hygiène et traçabilité", "Lots, températures, allergènes et contrôles renseignés par l'établissement."),
  ],
  "ressources-humaines": [
    option("hr-recruitment", "Recrutement et candidatures", "Offres, candidatures, entretiens et décisions humaines tracées."),
    option("hr-leave-approvals", "Congés et autorisations", "Demandes, soldes, validations et historique."),
    option("hr-training", "Formation du personnel", "Compétences, sessions, attestations et besoins."),
    option("hr-payroll-inputs", "Éléments variables de paie", "Primes, heures et variables préparées pour contrôle humain."),
  ],
  "artisanat-services": [
    option("service-provider-marketplace", "Catalogue des prestataires", "Métiers, zones desservies, profils et disponibilités."),
    option("service-materials-stock", "Pièces et matériaux", "Consommables, pièces utilisées et seuils de réapprovisionnement."),
    option("service-before-after-proof", "Photos et preuve de service", "État avant/après, accord du client et compte rendu de fin d'intervention."),
    option("service-warranty-claims", "Garanties et réclamations", "Réserves, reprises, garanties et résolution des litiges."),
  ],
  "administration-services-publics": [
    option("public-appointments-queue", "Rendez-vous et files d'attente", "Créneaux, guichets, tickets et orientation des visiteurs."),
    option("public-fees-receipts", "Frais et reçus administratifs", "Barèmes configurés, paiements confirmés et reçus vérifiables."),
    option("public-archives", "Archives et correspondances", "Courriers, pièces, classement, conservation et accès contrôlé."),
    option("public-field-inspections", "Inspections et travaux publics", "Signalements, visites, ordres de travail et comptes rendus."),
  ],
  "voyage-tourisme-creation-jeux": [
    option("travel-suppliers", "Prestataires et fournisseurs", "Compagnies, hôtels, guides et confirmations provenant des sources autorisées."),
    option("travel-itineraries", "Programmes et itinéraires", "Étapes, horaires, voyageurs et documents de voyage."),
    option("creative-assets-rights", "Médias et droits d'utilisation", "Fichiers, versions, crédits, autorisations et licences."),
    option("game-content-editor", "Éditeur de contenus et niveaux", "Scènes, missions, dialogues, règles et ressources du jeu."),
  ],
};

export const TRANSVERSAL_OPTIONS: DomainOption[] = [
  option("common-roles-permissions", "Utilisateurs et permissions", "Comptes, rôles, accès par fonction et séparation des responsabilités.", "transversal"),
  option("common-notifications", "Notifications et rappels", "Alertes par canal, préférences et historique d'envoi.", "transversal"),
  option("common-documents", "Documents et pièces jointes", "Dépôt, classement, versions, partage et règles de conservation.", "transversal"),
  option("common-payments-invoicing", "Paiements et facturation", "Factures, reçus et rapprochement; aucun paiement réel sans confirmation et autorisation.", "transversal"),
  option("common-dashboard-reports", "Tableaux de bord et rapports", "Indicateurs, filtres, exports et périodicité des rapports.", "transversal"),
  option("common-audit-log", "Historique et audit", "Journal des actions, validations, corrections et accès sensibles.", "transversal"),
  option("common-customer-support", "Messagerie et assistance", "Échanges, demandes d'aide, réclamations et suivi des réponses.", "transversal"),
  option("common-integrations", "Connexions et automatisations", "API et services externes à choisir après vérification des besoins, coûts et autorisations.", "transversal"),
];

export function getDomainOptionCatalog(match: DomainMatch): { domainOptions: DomainOption[]; transversalOptions: DomainOption[] } {
  if (!match.domain || match.confidence === "low") return { domainOptions: [], transversalOptions: TRANSVERSAL_OPTIONS };
  const base = match.domain.modules.map((item) => option(item.id, item.title, item.description));
  const specialized = (match.specialization?.modules ?? []).map((item) => option(item.id, item.title, item.description));
  const extras = DOMAIN_OPTIONS[match.domain.id];
  const unique = [...specialized, ...base, ...extras].filter((item, index, all) => all.findIndex((candidate) => candidate.id === item.id) === index);
  return { domainOptions: unique, transversalOptions: TRANSVERSAL_OPTIONS };
}
