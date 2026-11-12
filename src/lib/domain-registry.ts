export const MERKORA_DOMAIN_VERSION = "1.1.0";

export type DomainId =
  | "sport"
  | "sante"
  | "agriculture-environnement"
  | "commerce"
  | "entrepreneuriat-finance"
  | "immobilier-btp"
  | "education-formation"
  | "transport-logistique"
  | "restauration-hotellerie-evenementiel"
  | "ressources-humaines"
  | "artisanat-services"
  | "administration-services-publics"
  | "voyage-tourisme-creation-jeux";

export type DomainSpecialization = {
  id: string;
  label: string;
  keywords: string[];
  questions: string[];
  modules: Array<{ id: string; title: string; description: string }>;
};

export type DomainProfile = {
  id: DomainId;
  number: number;
  label: string;
  summary: string;
  keywords: string[];
  questions: string[];
  modules: Array<{ id: string; title: string; description: string }>;
  specializations: DomainSpecialization[];
};

const moduleItem = (id: string, title: string, description: string) => ({ id, title, description });

export const MERKORA_DOMAINS: DomainProfile[] = [
  {
    id: "sport", number: 1, label: "Sport, fitness et compétitions",
    summary: "Clubs, salles, coachs, athlètes, compétitions, inscriptions, entraînements et résultats.",
    keywords: ["sport", "football", "basketball", "tennis", "athlete", "athlète", "club sportif", "salle de sport", "fitness", "musculation", "coach sportif", "entraînement", "entrainement", "compétition", "competition", "tournoi", "arbitre", "licence sportive"],
    questions: ["Quel sport ou quelle activité encadrez-vous ?", "Gérez-vous des membres, des athlètes, des équipes ou des clients ?", "Faut-il planifier les entraînements, les compétitions, les inscriptions ou les paiements ?", "Qui valide les résultats et les performances ?", "Le suivi doit-il fonctionner sur téléphone pendant les activités ?"],
    modules: [moduleItem("sport-members", "Adhérents et licences", "Profils, inscriptions, licences et renouvellements."), moduleItem("sport-schedule", "Entraînements et calendrier", "Séances, terrains, coachs et disponibilités."), moduleItem("sport-competition", "Compétitions et résultats", "Tournois, rencontres, classements et statistiques.")],
    specializations: [],
  },
  {
    id: "sante", number: 2, label: "Santé, médical et bien-être",
    summary: "Cabinets, cliniques, laboratoires, pharmacies, centres de soins et services de bien-être.",
    keywords: ["santé", "sante", "médical", "medical", "clinique", "hôpital", "hopital", "médecin", "medecin", "patient", "infirmier", "laboratoire", "pharmacie", "consultation", "rendez-vous médical", "dossier médical", "bien-être", "bien etre", "soins"],
    questions: ["Quel type de structure ou de service de santé gérez-vous ?", "Quels professionnels et quels patients utiliseront la solution ?", "Faut-il gérer les rendez-vous, dossiers, prescriptions, analyses ou stocks ?", "Quelles personnes sont autorisées à consulter les informations médicales ?", "Quels systèmes ou obligations locales devez-vous respecter ?"],
    modules: [moduleItem("health-appointments", "Rendez-vous et accueil", "Planning, rendez-vous, accueil et orientation des patients."), moduleItem("health-records", "Dossiers et suivi autorisé", "Informations nécessaires, accès restreints et historique."), moduleItem("health-operations", "Opérations et stocks", "Équipements, consommables, pharmacie et suivi administratif.")],
    specializations: [],
  },
  {
    id: "agriculture-environnement", number: 3, label: "Agriculture, élevage et environnement",
    summary: "Exploitations agricoles, élevages, coopératives, transformation, environnement et ressources naturelles.",
    keywords: ["agriculture", "agriculteur", "champ", "culture", "récolte", "recolte", "élevage", "elevage", "ferme", "bétail", "betail", "volaille", "pêche", "peche", "coopérative agricole", "coopérative", "irrigation", "environnement", "déchets", "dechets", "reboisement"],
    questions: ["Quelle production ou ressource gérez-vous ?", "Sur combien de parcelles, sites ou unités travaillez-vous ?", "Quelles opérations faut-il suivre : semis, traitements, alimentation, récoltes ou ventes ?", "Faut-il suivre les intrants, les animaux, les équipements ou la traçabilité ?", "Les utilisateurs travaillent-ils souvent sans connexion Internet ?"],
    modules: [moduleItem("agri-production", "Production et campagnes", "Parcelles, cycles, cultures, élevage et récoltes."), moduleItem("agri-inputs", "Intrants et équipements", "Stocks, consommations, fournisseurs et matériel."), moduleItem("agri-traceability", "Traçabilité et ventes", "Lots, qualité, transformations et commercialisation.")],
    specializations: [],
  },
  {
    id: "commerce", number: 4, label: "Commerce, vente et e-commerce",
    summary: "Boutiques, grossistes, détaillants, distributeurs, vendeurs en ligne et réseaux de revendeurs.",
    keywords: ["commerce", "boutique", "magasin", "vente", "ventes", "vendeur", "revendeur", "grossiste", "détaillant", "detaillant", "e-commerce", "commande", "caisse", "stock", "inventaire", "catalogue produit", "livraison client"],
    questions: ["Que vendez-vous et à quels types de clients ?", "Combien de points de vente ou de dépôts gérez-vous ?", "Faut-il gérer les stocks, ventes, caisse, commandes ou livraisons ?", "Qui peut appliquer une remise ou annuler une vente ?", "Souhaitez-vous une boutique en ligne ou un réseau de revendeurs ?"],
    modules: [moduleItem("commerce-catalog", "Catalogue et tarifs", "Produits, variantes, prix et disponibilité."), moduleItem("commerce-sales", "Ventes et caisse", "Ventes, reçus, paiements et clôtures."), moduleItem("commerce-inventory", "Stocks et approvisionnement", "Entrées, sorties, inventaires et alertes.")],
    specializations: [],
  },
  {
    id: "entrepreneuriat-finance", number: 5, label: "Entrepreneuriat, finance et gestion d'entreprise",
    summary: "Pilotage d'entreprise, comptabilité de gestion, budgets, trésorerie, rentabilité et tableaux de bord.",
    keywords: ["entreprise", "entrepreneur", "directeur", "gestion financière", "gestion financiere", "finance", "trésorerie", "tresorerie", "budget", "comptabilité", "comptabilite", "bénéfice", "benefice", "rentabilité", "rentabilite", "bilan", "rapport financier", "dépenses", "depenses", "recettes", "facturation"],
    questions: ["Quelle activité et quelle taille d'entreprise souhaitez-vous piloter ?", "Quelles sources de revenus et quelles catégories de dépenses avez-vous ?", "Souhaitez-vous suivre la trésorerie, les budgets, les dettes, les marges ou la rentabilité ?", "À quelle fréquence faut-il produire les rapports ?", "Qui saisit, contrôle et valide les chiffres ?"],
    modules: [moduleItem("finance-cashflow", "Trésorerie et mouvements", "Encaissements, décaissements, soldes et prévisions."), moduleItem("finance-budgets", "Budgets et contrôle", "Budgets prévisionnels, réalisés et écarts."), moduleItem("finance-reports", "Rapports de gestion", "Résultats, indicateurs, rapprochements et rapports périodiques.")],
    specializations: [],
  },
  {
    id: "immobilier-btp", number: 6, label: "Immobilier, BTP et gestion locative",
    summary: "Agences immobilières, propriétaires, syndics, chantiers, entreprises de construction et maintenance immobilière.",
    keywords: ["immobilier", "immobilière", "immobiliere", "location", "locataire", "propriétaire", "proprietaire", "loyer", "terrain", "parcelle", "maison", "appartement", "chantier", "btp", "construction", "maçon", "macon", "architecte", "travaux", "bâtiment", "batiment", "syndic"],
    questions: ["Gérez-vous des biens, des locations, des ventes ou des chantiers ?", "Combien de biens, contrats ou chantiers sont concernés ?", "Faut-il suivre les loyers, échéances, dépenses, matériaux ou avancement ?", "Quels documents et validations doivent être conservés ?", "Qui peut valider un paiement, un devis ou une réception de travaux ?"],
    modules: [moduleItem("property-assets", "Biens et contrats", "Biens, propriétaires, locataires et contrats."), moduleItem("property-payments", "Loyers et dépenses", "Échéances, encaissements, charges et relances."), moduleItem("construction-sites", "Chantiers et travaux", "Planning, équipes, matériaux, coûts et réception.")],
    specializations: [],
  },
  {
    id: "education-formation", number: 7, label: "Éducation, formation et gestion des connaissances",
    summary: "Écoles, universités, centres de formation, orientation, cours, évaluations et bibliothèques de connaissances.",
    keywords: ["école", "ecole", "élève", "eleve", "étudiant", "etudiant", "université", "universite", "formation", "apprenant", "enseignant", "professeur", "orientation", "orientation scolaire", "orientation professionnelle", "parcours scolaire", "bac", "métier", "metier", "relevé", "releve", "résultat scolaire", "resultat scolaire", "test d orientation", "formation professionnelle", "choix de carrière", "cours", "examen", "note scolaire", "bibliothèque", "bibliotheque", "e-learning"],
    questions: ["Quel public apprendra ou sera accompagné ?", "Quels programmes, cours ou parcours faut-il gérer ?", "Faut-il gérer les inscriptions, présences, évaluations ou résultats ?", "Les enseignants, parents ou responsables doivent-ils disposer d'espaces distincts ?", "L'objectif est-il pédagogique, administratif, d'orientation ou plusieurs à la fois ?"],
    modules: [moduleItem("education-learners", "Apprenants et inscriptions", "Profils, inscriptions, groupes et parcours."), moduleItem("education-learning", "Cours et ressources", "Programmes, contenus, supports et activités."), moduleItem("education-assessment", "Évaluations et progression", "Tests, résultats, compétences et suivi.")],
    specializations: [
      { id: "career-guidance", label: "Orientation scolaire et professionnelle", keywords: ["orientation", "métier", "metier", "bac", "relevé", "releve", "choix de carrière", "test d orientation"], questions: ["Les résultats scolaires, les intérêts, les aptitudes ou les préférences doivent-ils être pris en compte ?", "Qui relira les résultats et accompagnera le jeune avant une décision d'orientation ?"], modules: [moduleItem("student-profile", "Profil de l'élève", "Intérêts, matières appréciées, compétences et objectifs à explorer."), moduleItem("aptitude-tests", "Tests et activités", "Questionnaires et exercices de réflexion à interpréter avec prudence."), moduleItem("career-explorer", "Explorer les métiers", "Découvrir plusieurs familles de métiers et comprendre leurs activités."), moduleItem("study-paths", "Formations et écoles", "Comparer les parcours d'études et les conditions d'accès à vérifier.")] },
    ],
  },
  {
    id: "transport-logistique", number: 8, label: "Transport, logistique et automobile",
    summary: "Transport de personnes et marchandises, flottes, livraisons, garages, maintenance et mobilité.",
    keywords: ["transport", "logistique", "livraison", "chauffeur", "conducteur", "véhicule", "vehicule", "camion", "taxi", "bus", "moto", "flotte", "garage", "mécanicien", "mecanicien", "maintenance automobile", "entrepôt", "entrepot", "expédition", "expedition", "colis"],
    questions: ["Transportez-vous des personnes, des marchandises ou assurez-vous la maintenance ?", "Combien de véhicules, chauffeurs ou dépôts sont concernés ?", "Faut-il planifier les trajets, suivre les colis, les coûts ou les entretiens ?", "Comment confirmez-vous une livraison ou une intervention ?", "Avez-vous besoin d'un suivi GPS et dans quelles conditions de consentement ?"],
    modules: [moduleItem("transport-dispatch", "Missions et affectations", "Courses, tournées, chauffeurs et affectations."), moduleItem("transport-fleet", "Flotte et maintenance", "Véhicules, entretiens, consommations et documents."), moduleItem("transport-delivery", "Suivi des livraisons", "Colis, statuts, preuves et incidents.")],
    specializations: [],
  },
  {
    id: "restauration-hotellerie-evenementiel", number: 9, label: "Restauration, hôtellerie et événementiel",
    summary: "Restaurants, hôtels, traiteurs, bars, hébergements, événements et gestion des réservations.",
    keywords: ["restaurant", "restauration", "hôtel", "hotel", "hébergement", "hebergement", "chambre", "réservation", "reservation", "traiteur", "bar", "cuisine", "menu", "serveur", "événement", "evenement", "festival", "banquet", "réception", "reception"],
    questions: ["Quel établissement ou type d'événement gérez-vous ?", "Faut-il gérer les tables, chambres, commandes, réservations ou invités ?", "Comment suivez-vous les stocks, équipes et paiements ?", "Quelles capacités et plages horaires faut-il respecter ?", "Quels services sont gérés par vos équipes et lesquels par des partenaires ?"],
    modules: [moduleItem("hospitality-bookings", "Réservations et accueil", "Tables, chambres, clients et disponibilités."), moduleItem("hospitality-operations", "Opérations et services", "Commandes, cuisine, ménage et prestations."), moduleItem("hospitality-stock", "Stocks et caisse", "Ingrédients, consommations, ventes et clôtures.")],
    specializations: [],
  },
  {
    id: "ressources-humaines", number: 10, label: "Ressources humaines et gestion du personnel",
    summary: "Dossiers salariés, recrutement, contrats, temps, congés, paie, formation et performance.",
    keywords: ["ressources humaines", "rh", "employé", "employe", "salarié", "salarie", "personnel", "recrutement", "contrat de travail", "congé", "conge", "paie", "bulletin de salaire", "pointage", "présence", "presence", "retard", "planning du personnel", "équipe", "equipe", "responsabilité", "responsabilite", "absence", "horaire", "effectif", "collaborateur"],
    questions: ["Combien de collaborateurs et de sites faut-il gérer ?", "Quels processus RH souhaitez-vous couvrir ?", "Faut-il suivre les contrats, horaires, absences, congés, paie ou recrutements ?", "Qui peut consulter les dossiers individuels et les rémunérations ?", "Quelles validations humaines et règles locales doivent être respectées ?"],
    modules: [moduleItem("hr-employees", "Dossiers du personnel", "Employés, contrats, affectations et documents."), moduleItem("hr-time", "Temps et absences", "Horaires, pointages, congés et corrections tracées."), moduleItem("hr-reports", "Pilotage RH", "Effectifs, indicateurs, formations et rapports.")],
    specializations: [],
  },
  {
    id: "artisanat-services", number: 11, label: "Artisanat, métiers techniques et services à domicile",
    summary: "Artisans, réparateurs, ateliers, salons, prestataires et interventions chez les clients.",
    keywords: ["artisan", "artisanat", "menuisier", "menuiserie", "soudeur", "soudure", "plombier", "plomberie", "électricien", "electricien", "électricité", "electricite", "couturier", "couture", "tailleur", "cordonnier", "coiffeur", "coiffure", "esthétique", "esthetique", "nettoyage", "ménage", "menage", "réparation", "reparation", "dépannage", "depannage", "service à domicile", "service a domicile", "technicien", "atelier"],
    questions: ["Quel métier ou service proposez-vous exactement ?", "Travaillez-vous en atelier, chez le client ou les deux ?", "Comment recevez-vous les demandes et préparez-vous les devis ?", "Faut-il planifier les interventions, affecter des techniciens et suivre les matériaux ?", "Comment le client valide-t-il la prestation et les éventuelles réserves ?", "Avez-vous besoin de photos avant/après, d'une signature ou d'une garantie de service ?"],
    modules: [moduleItem("service-requests", "Demandes et devis", "Demandes clients, qualification, estimation et validation."), moduleItem("service-scheduling", "Planning et interventions", "Rendez-vous, affectations, déplacements et comptes rendus."), moduleItem("service-jobs", "Travaux, matériaux et garanties", "Ordres de travail, pièces, preuves, factures et garanties.")],
    specializations: [
      { id: "artisan-workshop", label: "Ateliers et fabrication artisanale", keywords: ["atelier", "fabrication", "menuiserie", "couture", "soudure", "ébéniste", "bijoux"], questions: ["Fabriquez-vous sur commande ou pour constituer un stock ?", "Faut-il suivre matières premières, étapes de fabrication et temps passé ?"], modules: [moduleItem("workshop-orders", "Commandes d'atelier", "Commandes sur mesure, étapes, matières et livraison.")] },
      { id: "home-services", label: "Services et interventions à domicile", keywords: ["domicile", "ménage", "nettoyage", "plomberie", "électricité", "jardinage", "dépannage"], questions: ["Les interventions sont-elles ponctuelles ou récurrentes ?", "Faut-il géolocaliser les équipes ou seulement planifier leurs tournées ?"], modules: [moduleItem("home-visits", "Visites et tournées", "Créneaux, adresses, intervenants et preuves de passage.")] },
      { id: "personal-services", label: "Services personnels et beauté", keywords: ["salon", "coiffure", "barbier", "esthétique", "manucure", "maquillage"], questions: ["Les clients réservent-ils un créneau et un professionnel ?", "Faut-il gérer les prestations, produits, commissions et fidélité ?"], modules: [moduleItem("personal-bookings", "Rendez-vous et prestations", "Calendrier, professionnels, prestations et fidélité.")] },
    ],
  },
  {
    id: "administration-services-publics", number: 12, label: "Administration, vie citoyenne et services publics",
    summary: "Communes, administrations, services aux citoyens, demandes, dossiers, autorisations et gestion publique.",
    keywords: ["mairie", "commune", "administration", "service public", "citoyen", "état civil", "etat civil", "acte de naissance", "acte de mariage", "permis", "autorisation administrative", "démarche administrative", "demarche administrative", "collectivité", "collectivite", "ministère", "ministere", "préfecture", "prefecture", "service municipal", "plainte citoyenne", "réclamation citoyenne"],
    questions: ["Quelle administration ou quel service public est concerné ?", "Quels services les citoyens doivent-ils pouvoir demander ou suivre ?", "Quelles étapes, pièces et validations sont nécessaires pour chaque dossier ?", "Quels agents peuvent consulter ou décider sur chaque dossier ?", "Quelles règles locales encadrent l'identité, les archives, les délais et les données ?", "Quelle solution hors ligne ou au guichet doit rester disponible pour les personnes non connectées ?"],
    modules: [moduleItem("public-service-requests", "Demandes citoyennes", "Dépôt, pièces, suivi et réponses aux demandes."), moduleItem("public-workflows", "Instruction et validations", "Étapes, agents responsables, décisions et délais."), moduleItem("public-transparency", "Information et suivi public", "Annonces, réclamations, travaux et indicateurs publiables.")],
    specializations: [
      { id: "civil-status", label: "État civil et documents administratifs", keywords: ["état civil", "acte de naissance", "acte de décès", "acte de mariage", "certificat"], questions: ["Quels documents peuvent être demandés en ligne ?", "Comment l'identité et les pièces sont-elles vérifiées par un agent habilité ?"], modules: [moduleItem("civil-status-cases", "Dossiers d'état civil", "Demandes, vérification humaine, délivrance et traçabilité.")] },
      { id: "municipal-services", label: "Services municipaux et vie citoyenne", keywords: ["mairie", "commune", "voirie", "déchets", "assainissement", "éclairage public"], questions: ["Quels signalements les habitants peuvent-ils transmettre ?", "Comment les services affectent-ils les interventions et publient-ils leur avancement ?"], modules: [moduleItem("municipal-operations", "Interventions municipales", "Signalements, équipes, travaux et suivi de résolution.")] },
    ],
  },
  {
    id: "voyage-tourisme-creation-jeux", number: 13, label: "Voyages, tourisme, loisirs, création et jeux",
    summary: "Agences de voyages, tourisme, loisirs, production audiovisuelle, expériences interactives et conception de jeux.",
    keywords: ["voyage", "voyages", "agence de voyage", "billet d'avion", "séjour", "sejour", "tourisme", "touristique", "guide touristique", "excursion", "destination", "hôtel partenaire", "loisir", "loisirs", "sortie", "parc de loisirs", "jeu", "jeux", "jeu vidéo", "jeu video", "jeux vidéo", "jeux video", "jeu mobile", "jeu éducatif", "jeu educatif", "jeu de société", "jeu de societe", "conception de jeu", "créer un jeu", "creer un jeu", "game design", "game designer", "joueur", "niveau de jeu", "personnage de jeu", "escape game", "quiz interactif", "audiovisuel", "tournage", "production vidéo", "production video", "cinéma", "cinema", "studio photo", "montage vidéo", "montage video"],
    questions: ["Quel type d'expérience voulez-vous proposer : voyage, visite, loisir, création audiovisuelle ou jeu ?", "Qui est le public cible et que doit-il pouvoir faire ?", "Faut-il gérer des réservations, des contenus, des équipes, des niveaux ou une progression ?", "Quelles plateformes et quels appareils sont visés ?", "Comment mesurerez-vous la réussite et qui validera les contenus ou les réservations ?"],
    modules: [moduleItem("experience-content", "Contenus et expériences", "Fiches, scénarios, médias, parcours et contenus interactifs."), moduleItem("experience-bookings", "Réservations et participants", "Créneaux, capacités, inscriptions et confirmations."), moduleItem("experience-progress", "Progression et engagement", "Missions, niveaux, résultats, récompenses et retours.")],
    specializations: [
      { id: "travel-agency", label: "Agences de voyages et billetterie", keywords: ["agence de voyage", "billet", "billetterie", "voyageur", "visa", "séjour"], questions: ["Vendez-vous des billets, séjours, circuits ou prestations partenaires ?", "Quelles confirmations doivent venir d'un fournisseur externe avant d'être annoncées au client ?"], modules: [moduleItem("travel-bookings", "Dossiers voyageurs et réservations", "Devis, voyageurs, prestations, confirmations et documents.")] },
      { id: "tourism", label: "Tourisme et visites guidées", keywords: ["tourisme", "guide touristique", "excursion", "destination", "site touristique", "musée", "musee"], questions: ["Quels sites, circuits et capacités d'accueil faut-il présenter ?", "Les visiteurs réservent-ils un guide, une activité ou un billet ?"], modules: [moduleItem("tourism-circuits", "Destinations et circuits", "Sites, guides, activités, horaires et capacités.")] },
      { id: "audiovisual", label: "Production audiovisuelle et création", keywords: ["audiovisuel", "tournage", "cinéma", "cinema", "studio photo", "montage vidéo", "production vidéo", "casting"], questions: ["Quels livrables produisez-vous et quelles équipes interviennent ?", "Comment gérez-vous les versions, validations, fichiers et droits d'utilisation ?"], modules: [moduleItem("creative-production", "Production et livrables", "Projets, équipes, tournages, versions et validations.")] },
      { id: "game-design", label: "Conception de jeux et expériences interactives", keywords: ["jeu", "jeux", "jeu vidéo", "jeu video", "jeux vidéo", "jeux video", "jeu mobile", "jeu éducatif", "jeu educatif", "jeu de société", "jeu de societe", "conception de jeu", "créer un jeu", "creer un jeu", "game design", "game designer", "joueur", "niveau de jeu", "personnage de jeu", "escape game", "quiz interactif"], questions: ["Quel est le genre du jeu et quelle expérience le joueur doit-il vivre ?", "Quelles sont la boucle de jeu, les règles, les missions et les conditions de réussite ?", "Le jeu est-il web, mobile, ordinateur, 2D ou 3D ?", "Faut-il des comptes, des sauvegardes, un classement ou un mode hors ligne ?", "Quel prototype jouable permettrait de valider l'idée avant de produire tous les contenus ?"], modules: [moduleItem("game-core-loop", "Boucle de jeu et règles", "Actions, objectifs, règles, conséquences et progression."), moduleItem("game-levels", "Niveaux et missions", "Scènes, niveaux, objectifs, obstacles et récompenses."), moduleItem("game-player-data", "Profils et sauvegardes", "Profils joueurs, sessions, progression et sauvegardes.") ] },
      { id: "leisure-events", label: "Loisirs et événements", keywords: ["loisir", "sortie", "parc de loisirs", "festival", "événement", "evenement", "escape game", "billet"], questions: ["Quelles activités, sessions ou événements sont proposés ?", "Quelles capacités, réservations, billets et règles d'accès faut-il gérer ?"], modules: [moduleItem("leisure-sessions", "Activités et sessions", "Programmation, places, billets et contrôle d'accès.")] },
    ],
  },
];

export type DomainMatch = {
  domain: DomainProfile | null;
  specialization: DomainSpecialization | null;
  confidence: "high" | "medium" | "low";
  score: number;
};

function normalize(value: string): string {
  return value.toLocaleLowerCase("fr").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
}

function keywordMatches(text: string, keywords: string[]): number {
  const haystack = ` ${normalize(text)} `;
  const uniqueKeywords = [...new Set(keywords.map(normalize).filter(Boolean))];
  return uniqueKeywords.reduce((score, needle) => {
    const flexible = needle.split(" ").map((part) => `${part}s?`).join("\\s+");
    const pattern = new RegExp(`(^| )${flexible}( |$)`);
    return pattern.test(haystack) ? score + (needle.includes(" ") ? 3 : 2) : score;
  }, 0);
}

export function identifyDomain(text: string): DomainMatch {
  const ranked = MERKORA_DOMAINS.map((domain) => ({
    domain,
    score: keywordMatches(text, domain.keywords),
  })).sort((a, b) => b.score - a.score);

  const best = ranked[0];
  const second = ranked[1];
  if (!best || best.score < 2) return { domain: null, specialization: null, confidence: "low", score: 0 };

  const specializationRanked = best.domain.specializations.map((specialization) => ({
    specialization,
    score: keywordMatches(text, specialization.keywords),
  })).sort((a, b) => b.score - a.score);
  const bestSpecialization = specializationRanked[0];
  const specialization = bestSpecialization && bestSpecialization.score >= 2 ? bestSpecialization.specialization : null;

  const margin = best.score - (second?.score ?? 0);
  const confidence = best.score >= 6 && margin >= 2 ? "high" : best.score >= 3 && margin >= 1 ? "medium" : "low";
  return { domain: best.domain, specialization, confidence, score: best.score };
}

export function getDomainById(id: DomainId): DomainProfile {
  const domain = MERKORA_DOMAINS.find((item) => item.id === id);
  if (!domain) throw new Error(`Domaine MerKora inconnu : ${id}`);
  return domain;
}

export function getDomainQuestions(match: DomainMatch): string[] {
  if (!match.domain) {
    return [
      "Dans quel secteur ou métier se déroule votre activité ?",
      "Qui rencontre le problème : clients, employés, apprenants, citoyens, visiteurs ou vous-même ?",
      "Quelle action concrète voulez-vous rendre plus simple, plus fiable ou plus rapide ?",
    ];
  }
  const specializationQuestions = match.specialization?.questions ?? [];
  return [...specializationQuestions, ...match.domain.questions].slice(0, 7);
}

export function getDomainModules(match: DomainMatch) {
  if (!match.domain) return [];
  const specialized = match.specialization?.modules ?? [];
  const base = match.domain.modules;
  return [...specialized, ...base].slice(0, 5);
}
