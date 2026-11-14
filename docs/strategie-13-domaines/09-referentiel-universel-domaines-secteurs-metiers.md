# 09 — Référentiel universel des domaines, secteurs et métiers

> Version 1.0 — 12 novembre 2026  
> Branche : `feature/merkora-factory-unified-runtime`  
> Statut : **socle de classification et catalogue initial à enrichir par lots validés**.

## 1. Objet et niveau de complétude

Ce document établit le cadre commun pour organiser les activités que MerKora GDJ doit savoir comprendre et transformer en projets numériques. Il relie quatre niveaux qui ne doivent jamais être confondus :

1. **Famille de domaine** : grande catégorie de connaissance.
2. **Secteur / sous-domaine** : contexte d'activité concret.
3. **Métier / spécialisation** : fonction ou profession exercée dans ce contexte.
4. **Processus et capacités** : ce que les personnes font réellement et les fonctions numériques qui peuvent les aider.

La cible produit est un référentiel extensible pouvant accueillir environ **100 secteurs**, puis **2 000 à 3 000 métiers, spécialités et variantes d'activité**. Ce document constitue la première cartographie des 20 familles et des 100 secteurs de référence. Il ne prétend pas que les 2 000 à 3 000 fiches métier approfondies sont déjà rédigées : celles-ci devront être développées par lots, relues et versionnées, sans inventer de règles professionnelles ou réglementaires.

Un métier ne doit jamais être réduit à un nom. Une fiche métier complète devra documenter ses activités, ses processus, ses utilisateurs, ses données, ses contraintes, ses risques, ses questions de diagnostic et les solutions numériques possibles.

## 2. Les 20 familles et les 100 secteurs de référence

Les 100 secteurs ci-dessous sont une cartographie de départ. Les frontières sont volontairement perméables : une organisation peut exercer plusieurs activités et un projet peut mobiliser plusieurs secteurs.

### Domaine 01 — Santé, médecine, pharmacie et bien-être
| ID | Secteur | Activités et besoins numériques typiques |
|---|---|---|
| S01-01 | Médecine générale et soins primaires | Consultations, rendez-vous, dossiers autorisés, suivi administratif, orientation |
| S01-02 | Médecines spécialisées et chirurgie | Parcours spécialisés, planification, coordination, comptes rendus et suivi |
| S01-03 | Soins infirmiers et paramédicaux | Tournées, actes, planning, transmissions et suivi des interventions |
| S01-04 | Pharmacies et distribution pharmaceutique | Stocks, lots, commandes, délivrance, fournisseurs et alertes |
| S01-05 | Laboratoires, imagerie et diagnostic | Demandes, prélèvements, examens, résultats, traçabilité et rendez-vous |

Métiers et fonctions à reconnaître : médecin généraliste, médecin spécialiste, chirurgien, anesthésiste, pédiatre, gynécologue, cardiologue, dermatologue, infirmier, aide-soignant, sage-femme, kinésithérapeute, orthophoniste, pharmacien, préparateur en pharmacie, biologiste médical, technicien de laboratoire, radiologue, manipulateur en imagerie, secrétaire médical, agent d'accueil, gestionnaire de centre de soins.

**Précautions :** séparer les données de santé des données administratives ; appliquer les règles locales de confidentialité et de conservation ; ne jamais laisser une IA poser un diagnostic clinique autonome ou remplacer une décision médicale ; contrôler les accès et journaliser les consultations de dossiers.

### Domaine 02 — Sport, fitness, loisirs sportifs et compétitions
| ID | Secteur | Activités et besoins numériques typiques |
|---|---|---|
| S02-01 | Clubs et associations sportives | Adhésions, licences, cotisations, équipes et communication |
| S02-02 | Salles de sport et fitness | Abonnements, accès, séances, coachs, équipements |
| S02-03 | Entraînement et coaching individuel | Objectifs, programmes, rendez-vous et progression |
| S02-04 | Compétitions et fédérations | Inscriptions, calendriers, résultats, arbitres et classements |
| S02-05 | Installations et équipements sportifs | Réservations, maintenance, inventaire et sécurité |

Métiers et fonctions : éducateur sportif, entraîneur, préparateur physique, coach fitness, coach personnel, professeur d'éducation physique, arbitre, juge sportif, directeur technique, responsable de club, agent d'accueil, gestionnaire de salle, organisateur de compétition, responsable d'équipement, kinésithérapeute du sport, analyste de performance, responsable de formation sportive.

**Précautions :** consentement pour les données personnelles et images ; protection renforcée des mineurs ; ne pas présenter les indicateurs de performance comme un diagnostic médical.

### Domaine 03 — Agriculture, élevage, pêche et environnement
| ID | Secteur | Activités et besoins numériques typiques |
|---|---|---|
| S03-01 | Cultures vivrières et maraîchage | Parcelles, semis, intrants, récoltes, ventes et météo |
| S03-02 | Cultures de rente et plantations | Campagnes, parcelles, rendements, achats et traçabilité |
| S03-03 | Élevage et santé animale | Cheptel, alimentation, reproduction, soins et ventes |
| S03-04 | Pêche, aquaculture et transformation | Captures, bassins, alimentation, lots, chaîne du froid |
| S03-05 | Environnement, forêt et gestion des ressources | Inspections, inventaires, incidents et indicateurs environnementaux |

Métiers et fonctions : agriculteur, maraîcher, exploitant agricole, chef de culture, ouvrier agricole, pépiniériste, arboriculteur, agronome, conseiller agricole, éleveur, vétérinaire, auxiliaire vétérinaire, pisciculteur, pêcheur, mareyeur, technicien aquacole, transformateur agroalimentaire, forestier, technicien environnement, agent de collecte, gestionnaire de coopérative.

**Précautions :** tenir compte des saisons, de la connectivité rurale, de la traçabilité des intrants et des produits ; ne pas transformer une recommandation agronomique en garantie de rendement.

### Domaine 04 — Commerce, distribution, vente et e-commerce
| ID | Secteur | Activités et besoins numériques typiques |
|---|---|---|
| S04-01 | Commerce de détail et boutiques | Catalogue, ventes, caisse, stock, fidélité |
| S04-02 | Commerce de gros et import-export | Tarifs, fournisseurs, commandes, lots et logistique |
| S04-03 | Vente en ligne et marketplaces | Catalogue, panier, commandes, paiement et livraison |
| S04-04 | Vente directe, réseaux et distribution indépendante | Portefeuille de vendeurs, commissions, prospects et suivi |
| S04-05 | Distribution spécialisée et points de vente multiples | Multi-boutiques, inventaires, transferts et tableaux de bord |

Métiers et fonctions : commerçant, détaillant, grossiste, vendeur, caissier, chef de rayon, responsable magasin, commercial terrain, représentant, télévendeur, acheteur, approvisionneur, gestionnaire de stock, préparateur de commandes, responsable e-commerce, gestionnaire marketplace, importateur, exportateur, livreur, responsable relation client.

**Précautions :** transparence des prix, remboursements, droits des consommateurs, protection des moyens de paiement et traçabilité des opérations.

### Domaine 05 — Finance, comptabilité, assurance et gestion patrimoniale
| ID | Secteur | Activités et besoins numériques typiques |
|---|---|---|
| S05-01 | Comptabilité et expertise comptable | Pièces, journaux, rapprochements, clôtures et rapports |
| S05-02 | Trésorerie et gestion financière d'entreprise | Encaissements, décaissements, prévisions et budgets |
| S05-03 | Banque, microfinance et crédit | Dossiers, échéances, remboursements et suivi des risques |
| S05-04 | Assurance et courtage | Contrats, primes, sinistres, échéances et clients |
| S05-05 | Gestion patrimoniale et finances personnelles | Budgets, actifs, dettes, objectifs et projections |

Métiers et fonctions : comptable, aide-comptable, chef comptable, contrôleur de gestion, directeur financier, trésorier, auditeur, analyste financier, conseiller bancaire, chargé de clientèle, agent de crédit, gestionnaire de portefeuille, courtier, agent d'assurance, gestionnaire de sinistres, conseiller patrimonial, gestionnaire de paie, fiscaliste.

**Précautions :** séparation des rôles de saisie et de validation, piste d'audit, confidentialité, règles fiscales locales, prévention de la fraude ; les calculs et recommandations ne remplacent pas un professionnel habilité.

### Domaine 06 — Entrepreneuriat, direction et gestion des organisations
| ID | Secteur | Activités et besoins numériques typiques |
|---|---|---|
| S06-01 | Création et accompagnement d'entreprise | Idée, étude, formalités, business plan et suivi |
| S06-02 | Direction générale et pilotage | Objectifs, indicateurs, décisions et plans d'action |
| S06-03 | Gestion de projets et programmes | Tâches, jalons, ressources, risques et livrables |
| S06-04 | Conseil et accompagnement professionnel | Missions, diagnostics, recommandations et rapports |
| S06-05 | Qualité, audit et amélioration continue | Procédures, contrôles, écarts, actions correctives |

Métiers et fonctions : entrepreneur, dirigeant, directeur général, directeur des opérations, chef de projet, chef de programme, consultant, analyste organisationnel, responsable qualité, auditeur interne, responsable stratégie, assistant de direction, office manager, responsable amélioration continue, chargé de mission.

**Précautions :** distinguer les données de chaque client, documenter les validations et éviter qu'un indicateur automatisé devienne une décision de gestion non contrôlée.

### Domaine 07 — Immobilier, architecture, urbanisme, BTP et maintenance des bâtiments
| ID | Secteur | Activités et besoins numériques typiques |
|---|---|---|
| S07-01 | Transaction et gestion immobilière | Biens, mandats, visites, offres et commissions |
| S07-02 | Location et gestion locative | Baux, loyers, charges, états des lieux et incidents |
| S07-03 | Architecture et maîtrise d'œuvre | Plans, versions, clients, validations et chantier |
| S07-04 | Construction et travaux publics | Devis, équipes, matériaux, planning, avancement |
| S07-05 | Maintenance et gestion technique des bâtiments | Interventions, équipements, contrats et historique |

Métiers et fonctions : agent immobilier, négociateur immobilier, gestionnaire locatif, syndic, promoteur, architecte, dessinateur-projeteur, urbaniste, ingénieur civil, conducteur de travaux, chef de chantier, maçon, électricien bâtiment, plombier, carreleur, peintre, métreur, économiste de la construction, technicien de maintenance, gardien d'immeuble.

**Précautions :** traçabilité des devis et avenants, validation des plans, sécurité des travailleurs, documents contractuels et règles d'urbanisme applicables.

### Domaine 08 — Éducation, formation, recherche et orientation
| ID | Secteur | Activités et besoins numériques typiques |
|---|---|---|
| S08-01 | Enseignement préscolaire et primaire | Inscriptions, classes, présence, suivi et communication |
| S08-02 | Enseignement secondaire et supérieur | Cours, évaluations, emplois du temps, résultats |
| S08-03 | Formation professionnelle et apprentissage | Sessions, compétences, stages, attestations |
| S08-04 | Formation continue et apprentissage en ligne | Modules, contenus, progression et évaluations |
| S08-05 | Orientation scolaire, universitaire et professionnelle | Questionnaires, intérêts, pistes, parcours et accompagnement |

Métiers et fonctions : enseignant, instituteur, professeur, directeur d'école, proviseur, surveillant, conseiller pédagogique, formateur, maître d'apprentissage, tuteur, responsable pédagogique, gestionnaire de scolarité, chercheur, documentaliste, conseiller d'orientation, psychologue de l'orientation, responsable e-learning, évaluateur.

**Précautions :** protection des mineurs, confidentialité des résultats, accessibilité, explicabilité des recommandations d'orientation ; ne pas enfermer une personne dans une profession sur la base d'un test unique.

### Domaine 09 — Transport, mobilité, logistique et automobile
| ID | Secteur | Activités et besoins numériques typiques |
|---|---|---|
| S09-01 | Transport de personnes | Réservations, trajets, chauffeurs, horaires et incidents |
| S09-02 | Transport de marchandises et livraison | Missions, colis, preuve de livraison et suivi |
| S09-03 | Entreposage et gestion de stocks logistiques | Emplacements, entrées, sorties et inventaires |
| S09-04 | Garage, réparation et entretien automobile | Ordres de travail, pièces, diagnostics et rendez-vous |
| S09-05 | Flottes, location et mobilité partagée | Véhicules, contrats, carburant, maintenance et conducteurs |

Métiers et fonctions : chauffeur, conducteur de taxi, conducteur de bus, conducteur routier, livreur, coursier, exploitant transport, dispatcheur, logisticien, magasinier, préparateur, cariste, responsable d'entrepôt, mécanicien automobile, électricien automobile, carrossier, contrôleur technique, gestionnaire de flotte, agent de location.

**Précautions :** sécurité routière, données de géolocalisation, preuve de livraison, temps de conduite et obligations locales.

### Domaine 10 — Restauration, alimentation, hôtellerie et hébergement
| ID | Secteur | Activités et besoins numériques typiques |
|---|---|---|
| S10-01 | Restaurants et restauration traditionnelle | Menus, commandes, tables, caisse et achats |
| S10-02 | Restauration rapide et livraison de repas | Commandes, préparation, délais et livreurs |
| S10-03 | Traiteurs et restauration événementielle | Devis, menus, quantités, équipes et événements |
| S10-04 | Hôtels, auberges et résidences | Réservations, chambres, clients et facturation |
| S10-05 | Hébergements touristiques et locations courte durée | Disponibilités, arrivées, ménage et avis |

Métiers et fonctions : restaurateur, chef cuisinier, cuisinier, commis, pâtissier, boulanger, serveur, maître d'hôtel, barman, traiteur, gestionnaire de restaurant, réceptionniste, gouvernant, femme/valet de chambre, directeur d'hôtel, responsable réservation, concierge, agent d'entretien.

**Précautions :** hygiène, allergènes, traçabilité, protection des paiements et confidentialité des clients.

### Domaine 11 — Événementiel, culture, tourisme et voyages
| ID | Secteur | Activités et besoins numériques typiques |
|---|---|---|
| S11-01 | Organisation d'événements privés et professionnels | Devis, prestataires, programme, invitations et budget |
| S11-02 | Billetterie, spectacles et festivals | Billets, contrôle d'accès, jauges et programmation |
| S11-03 | Tourisme, agences et circuits | Offres, itinéraires, réservations et voyageurs |
| S11-04 | Voyages et services de réservation | Dossiers, documents, échéances et assistance |
| S11-05 | Patrimoine, musées et médiation culturelle | Collections, visites, guides et événements |

Métiers et fonctions : organisateur événementiel, chef de projet événementiel, wedding planner, décorateur événementiel, régisseur, technicien son, technicien lumière, agent de billetterie, programmateur, guide touristique, agent de voyage, conseiller voyages, accompagnateur, médiateur culturel, conservateur, animateur culturel, photographe événementiel.

**Précautions :** autorisations, sécurité des publics, gestion des mineurs, conditions d'annulation, protection des documents de voyage.

### Domaine 12 — Ressources humaines, recrutement et organisation du travail
| ID | Secteur | Activités et besoins numériques typiques |
|---|---|---|
| S12-01 | Recrutement et sélection | Offres, candidatures, entretiens et décisions |
| S12-02 | Administration du personnel | Dossiers, contrats, congés et attestations |
| S12-03 | Temps, présence et planification | Horaires, pointages, retards et corrections |
| S12-04 | Paie, avantages et rémunération | Variables, validations, bulletins et historique |
| S12-05 | Formation, compétences et performance | Compétences, objectifs, formations et entretiens |

Métiers et fonctions : directeur RH, responsable RH, chargé de recrutement, recruteur, assistant RH, gestionnaire de paie, gestionnaire du personnel, responsable formation, responsable développement des compétences, responsable relations sociales, planificateur, responsable administration du travail, consultant RH, responsable rémunération.

**Précautions :** minimisation des données, accès strictement limités, droit du travail local, transparence des règles de pointage et interdiction de décisions disciplinaires automatiques.

### Domaine 13 — Artisanat, fabrication, industrie et métiers techniques
| ID | Secteur | Activités et besoins numériques typiques |
|---|---|---|
| S13-01 | Artisanat d'art et création manuelle | Commandes, matières, devis, étapes et livraison |
| S13-02 | Menuiserie, métallurgie et construction artisanale | Mesures, plans, fabrication, pose et maintenance |
| S13-03 | Textile, mode et confection | Modèles, tailles, matières, commandes et stocks |
| S13-04 | Industrie et production en atelier | Ordres de fabrication, qualité, maintenance et lots |
| S13-05 | Réparation et maintenance d'équipements | Tickets, diagnostic, pièces, interventions et garantie |

Métiers et fonctions : artisan, menuisier, ébéniste, soudeur, métallier, ferronnier, couturier, tailleur, modéliste, styliste, maroquinier, bijoutier, imprimeur, opérateur de production, chef d'atelier, technicien de maintenance, électromécanicien, mécanicien industriel, contrôleur qualité, réparateur.

**Précautions :** sécurité au travail, traçabilité des lots, tolérances techniques, validation des plans et gestion des garanties.

### Domaine 14 — Services aux personnes, services à domicile et assistance
| ID | Secteur | Activités et besoins numériques typiques |
|---|---|---|
| S14-01 | Aide et accompagnement à domicile | Bénéficiaires, visites, intervenants et transmissions |
| S14-02 | Entretien et nettoyage | Contrats, tournées, produits et contrôle qualité |
| S14-03 | Beauté, coiffure et soins esthétiques | Rendez-vous, prestations, produits et fidélité |
| S14-04 | Services personnels et conciergerie | Demandes, planning, prestataires et suivi |
| S14-05 | Garde d'enfants et accompagnement familial | Planning, autorisations, contacts et transmissions |

Métiers et fonctions : aide à domicile, auxiliaire de vie, assistant de vie, agent d'entretien, femme de ménage, chef d'équipe nettoyage, coiffeur, barbier, esthéticien, maquilleur, prothésiste ongulaire, masseur bien-être, concierge, garde d'enfants, auxiliaire parental, intervenant familial.

**Précautions :** protection des personnes vulnérables, vérification des autorisations, confidentialité des domiciles et contacts, gestion des urgences.

### Domaine 15 — Administration, collectivités, services publics et citoyenneté
| ID | Secteur | Activités et besoins numériques typiques |
|---|---|---|
| S15-01 | Administration territoriale et collectivités | Courriers, services, dossiers et délibérations |
| S15-02 | État civil et gestion documentaire publique | Demandes, pièces, instruction et délivrance |
| S15-03 | Services municipaux et interventions locales | Signalements, équipes, équipements et suivi |
| S15-04 | Services aux citoyens et démarches | Formulaires, rendez-vous, suivi et notifications |
| S15-05 | Gestion des archives et documents administratifs | Classement, conservation, recherche et accès |

Métiers et fonctions : agent administratif, secrétaire administratif, attaché territorial, responsable de service public, agent d'état civil, archiviste, documentaliste, agent municipal, chargé de citoyenneté, gestionnaire de dossiers, médiateur public, responsable des marchés publics.

**Précautions :** légalité, transparence, archivage, accessibilité, traçabilité des décisions et protection des données des citoyens.

### Domaine 16 — Droit, conformité, médiation et services juridiques
| ID | Secteur | Activités et besoins numériques typiques |
|---|---|---|
| S16-01 | Cabinets d'avocats et conseil juridique | Clients, dossiers, audiences et échéances |
| S16-02 | Notariat et actes | Dossiers, pièces, rendez-vous et formalités |
| S16-03 | Huissiers, commissaires de justice et exécution | Missions, constats, actes et suivi |
| S16-04 | Médiation et résolution de conflits | Parties, séances, accords et confidentialité |
| S16-05 | Conformité, protection des données et contrôle | Registres, contrôles, incidents et plans d'action |

Métiers et fonctions : avocat, juriste, assistant juridique, notaire, clerc de notaire, commissaire de justice, huissier selon juridiction, médiateur, conciliateur, responsable conformité, délégué à la protection des données, enquêteur conformité, documentaliste juridique.

**Précautions :** secret professionnel, conflits d'intérêts, règles propres à chaque juridiction ; l'IA peut organiser et expliquer des informations mais ne se substitue pas au conseil juridique habilité.

### Domaine 17 — Numérique, informatique, télécommunications et médias digitaux
| ID | Secteur | Activités et besoins numériques typiques |
|---|---|---|
| S17-01 | Développement logiciel et applications | Projets, code, versions, tests et déploiements |
| S17-02 | Support informatique et maintenance | Tickets, parc, incidents et interventions |
| S17-03 | Réseaux, télécoms et infrastructures | Équipements, lignes, incidents et supervision |
| S17-04 | Marketing digital, communication et médias | Campagnes, contenus, audiences et résultats |
| S17-05 | Données, IA et automatisation | Jeux de données, workflows, modèles et contrôles |

Métiers et fonctions : développeur logiciel, développeur web, développeur mobile, architecte logiciel, ingénieur DevOps, administrateur système, administrateur réseau, technicien support, technicien informatique, analyste de données, ingénieur données, spécialiste IA, testeur logiciel, UX designer, UI designer, graphiste, community manager, rédacteur web, spécialiste SEO, chef de projet digital.

**Précautions :** sécurité dès la conception, gestion des secrets, sauvegardes, licences, droits d'auteur, surveillance des systèmes et validation humaine des automatisations sensibles.

### Domaine 18 — Énergie, eau, assainissement et services essentiels
| ID | Secteur | Activités et besoins numériques typiques |
|---|---|---|
| S18-01 | Production et distribution d'électricité | Sites, équipements, incidents et interventions |
| S18-02 | Énergies renouvelables et installations solaires | Études, équipements, maintenance et rendement |
| S18-03 | Eau potable et distribution | Compteurs, abonnés, relevés et fuites |
| S18-04 | Assainissement et déchets | Collecte, tournées, installations et signalements |
| S18-05 | Services techniques et réseaux essentiels | Maintenance, astreintes, pannes et continuité |

Métiers et fonctions : ingénieur énergie, technicien électricien, installateur solaire, technicien photovoltaïque, agent réseau, fontainier, technicien hydraulique, agent de relève, technicien assainissement, agent de collecte, responsable maintenance, opérateur de supervision, technicien électromécanique.

**Précautions :** sécurité des installations, continuité de service, interventions autorisées et fiabilité des relevés.

### Domaine 19 — Sécurité, prévention, sûreté et gestion des risques
| ID | Secteur | Activités et besoins numériques typiques |
|---|---|---|
| S19-01 | Sécurité privée et gardiennage | Sites, rondes, agents, incidents et consignes |
| S19-02 | Sécurité incendie et prévention | Équipements, inspections, exercices et alertes |
| S19-03 | Santé et sécurité au travail | Risques, formations, incidents et actions correctives |
| S19-04 | Gestion de crise et continuité d'activité | Alertes, plans, équipes et journal de crise |
| S19-05 | Contrôle d'accès et sûreté des sites | Visiteurs, badges, autorisations et journaux d'accès |

Métiers et fonctions : agent de sécurité, chef de poste, responsable sûreté, agent de prévention, technicien incendie, responsable HSE, préventeur, coordinateur sécurité, gestionnaire de crise, contrôleur d'accès, auditeur sécurité, responsable continuité d'activité.

**Précautions :** proportionnalité de la surveillance, respect des droits, accès aux images et journaux, conservation limitée et validation humaine des alertes.

### Domaine 20 — Famille, vie personnelle, associations, solidarité et communauté
| ID | Secteur | Activités et besoins numériques typiques |
|---|---|---|
| S20-01 | Gestion familiale et budget du foyer | Budgets, dépenses, objectifs et tâches communes |
| S20-02 | Associations et organisations communautaires | Membres, cotisations, activités et gouvernance |
| S20-03 | ONG, solidarité et projets sociaux | Bénéficiaires, programmes, dons et rapports |
| S20-04 | Communautés, clubs et groupes d'intérêt | Adhésions, événements, échanges et modération |
| S20-05 | Organisation personnelle et vie quotidienne | Tâches, rendez-vous, documents et objectifs |

Métiers et fonctions : responsable associatif, président d'association, secrétaire, trésorier, coordinateur de projet social, travailleur social, éducateur spécialisé, animateur communautaire, chargé de mobilisation, gestionnaire de bénévoles, médiateur social, accompagnateur, organisateur communautaire.

**Précautions :** séparer les espaces privés et professionnels, consentement des membres, protection des bénéficiaires, transparence des fonds et contrôle des accès.

## 3. Les capacités transversales communes

Ces capacités ne sont pas des domaines métier. Elles sont des briques réutilisables qui peuvent être activées dans plusieurs secteurs selon le besoin confirmé.

| Capacité | Questions de diagnostic | Exemples de fonctions |
|---|---|---|
| Identité et comptes | Qui utilise le système ? | Comptes, invitations, récupération, authentification |
| Rôles et permissions | Qui peut voir, créer, modifier, valider ? | Matrice d'accès, périmètres et délégations |
| Organisation multi-site | Plusieurs lieux ou entités ? | Sites, équipes, séparation et consolidation |
| Gestion des personnes | Quelles personnes suivre ? | Profils, statuts, historique |
| Planning et rendez-vous | Qu'est-ce qui doit être planifié ? | Calendrier, disponibilité, réservation |
| Présence et temps | Faut-il suivre des présences ? | Pointage, retards, corrections et validations |
| Finance | Quelles opérations financières ? | Budgets, recettes, dépenses, rapprochements |
| Vente et commande | Qu'est-ce qui est vendu ou commandé ? | Catalogue, panier, commandes, factures |
| Stock et inventaire | Quels biens ou consommables ? | Entrées, sorties, seuils et inventaires |
| Documents | Quels documents circulent ? | Dépôt, versions, partage et archivage |
| Communication | Qui communique avec qui ? | Messages, demandes et historique |
| Notifications | Quels événements doivent être signalés ? | Alertes, rappels, préférences |
| Workflow et validation | Quelles décisions exigent approbation ? | Étapes, approbateurs, refus et commentaires |
| Rapports et indicateurs | Quelles décisions prendre grâce aux données ? | Tableaux de bord, exports et rapports périodiques |
| Audit et traçabilité | Quelles actions doivent être historisées ? | Journaux, événements et preuves |
| Intégrations | Quels outils existent déjà ? | API, webhooks, synchronisation contrôlée |
| Automatisation | Quelles tâches répétitives ? | Règles, déclencheurs, tâches planifiées |
| Support et assistance | Comment traiter les problèmes ? | Tickets, FAQ, escalade |
| Gestion des risques | Quels incidents sont possibles ? | Registre, alertes, plans d'action |
| Accessibilité et langues | Qui doit pouvoir utiliser le système ? | Langues, contrastes, navigation et adaptation |

## 4. Modèle de fiche métier à développer pour chaque profession

Chaque métier ou spécialisation du catalogue approfondi doit être documenté selon la même structure. Cette fiche est la norme de qualité du référentiel.

### A. Identité
- Identifiant stable et version.
- Nom courant, synonymes, appellations locales et variantes.
- Domaine principal, secteurs associés et métiers voisins.
- Définition courte, contexte et limites du métier.

### B. Réalité du travail
- Missions principales et secondaires.
- Activités quotidiennes, hebdomadaires, saisonnières ou exceptionnelles.
- Déclencheurs des opérations.
- Étapes de travail et résultats attendus.
- Relations avec clients, usagers, collègues, fournisseurs et autorités.

### C. Diagnostic adaptatif
- Question d'ouverture en langage simple.
- Questions selon les réponses et la spécialisation.
- Informations indispensables à comprendre.
- Questions conditionnelles et cas particuliers.
- Signaux d'incertitude qui obligent à demander une précision.
- Questions à ne pas poser si elles ne sont pas pertinentes.

### D. Utilisateurs et responsabilités
- Profils utilisateurs possibles.
- Rôles opérationnels et hiérarchiques.
- Actions autorisées, contrôles et validations.
- Séparation des responsabilités.
- Cas de remplacement, délégation et absence.

### E. Processus et exceptions
- Flux normal.
- Cas d'urgence.
- Retards, annulations, erreurs et corrections.
- Litiges, réclamations et escalades.
- Preuves, documents et historiques requis.

### F. Données et écrans
- Entités et relations métier.
- Champs nécessaires et champs facultatifs.
- Données personnelles ou sensibles.
- Écrans par rôle.
- Filtres, recherches, tableaux de bord et exports.

### G. Capacités numériques candidates
- Modules spécifiques au métier.
- Capacités transversales utiles.
- Options facultatives.
- Dépendances techniques et humaines.
- Fonctionnement mobile, ordinateur, tablette ou hors ligne.

### H. Risques et conformité
- Risques opérationnels et erreurs possibles.
- Risques de sécurité, confidentialité et fraude.
- Règles professionnelles et réglementaires à vérifier par pays.
- Contrôles et validations humaines.
- Limites explicites de l'IA.

### I. Mesure et amélioration
- Indicateurs utiles et leurs définitions.
- Fréquence de mesure.
- Sources de données.
- Seuils à définir par le client, jamais inventés.
- Boucle de retour d'expérience.

### J. Exemples
- Scénario réel fictif.
- Problème initial.
- Questions posées.
- Proposition de solution.
- Choix du client.
- Maquette et écrans proposés.
- Règles métier et critères d'acceptation.

## 5. Comment atteindre 2 000 à 3 000 métiers sans créer un catalogue artificiel

Le nombre cible ne doit pas être atteint en multipliant des synonymes ou en inventant des intitulés. Une entrée distincte doit représenter une réalité de travail ou une spécialisation utile au diagnostic.

### Règles de qualité du catalogue
1. Un identifiant ne change pas lorsqu'un libellé est corrigé.
2. Les synonymes sont rattachés à une entrée canonique et ne gonflent pas le décompte.
3. Une spécialisation n'est séparée que si elle modifie réellement les processus, les utilisateurs, les données, les risques ou les questions.
4. Les appellations locales et internationales peuvent coexister.
5. Les métiers réglementés portent un marqueur de vérification par juridiction.
6. Les fiches incertaines restent marquées « à vérifier » et ne déclenchent pas de recommandations sensibles.
7. Les entrées obsolètes sont archivées, pas supprimées sans historique.
8. Les fiches sont versionnées et datées.

### Stratégie d'enrichissement par lots
- **Lot A — Cartographie :** vérifier les 20 familles et 100 secteurs avec des professionnels et des sources fiables.
- **Lot B — Métiers fréquents :** recenser les métiers courants et leurs synonymes, en privilégiant les usages concrets.
- **Lot C — Spécialisations :** ajouter les spécialisations qui changent le diagnostic ou les processus.
- **Lot D — Variantes territoriales :** documenter les appellations et pratiques par pays, sans universaliser une règle locale.
- **Lot E — Fiches approfondies :** rédiger les fiches complètes par métier et secteur.
- **Lot F — Contrôle qualité :** détecter doublons, lacunes, contradictions et fiches sans valeur opérationnelle.

Le tableau de bord du référentiel doit afficher le nombre d'entrées par statut : brouillon, à vérifier, validé, obsolète. Il doit aussi distinguer le nombre de métiers canoniques, de spécialisations et de synonymes.

## 6. Modèle de données conceptuel recommandé

Le modèle suivant est une proposition logique. Il ne constitue pas une migration SQL ni une autorisation de modifier une base existante.

- `domain_families` : familles de domaines.
- `sectors` : secteurs rattachés à une ou plusieurs familles.
- `occupations` : métiers canoniques.
- `occupation_specializations` : spécialisations ayant une valeur métier distincte.
- `occupation_aliases` : synonymes, appellations locales et variantes linguistiques.
- `occupation_sector_links` : relation plusieurs-à-plusieurs entre métiers et secteurs.
- `occupation_processes` : processus professionnels.
- `occupation_questions` : questions adaptatives et conditions d'affichage.
- `occupation_roles` : rôles et responsabilités possibles.
- `occupation_capabilities` : capacités numériques candidates.
- `occupation_risks` : risques et contrôles.
- `occupation_sources` : sources, provenance et date de vérification.
- `catalog_versions` : versions du référentiel et historique.

Chaque enregistrement doit porter au minimum un identifiant stable, un statut de validation et des informations de version. Les relations doivent permettre qu'un métier appartienne à plusieurs secteurs et qu'un projet mobilise plusieurs métiers sans dupliquer les données.

## 7. Algorithme de reconnaissance d'un projet

1. Lire la demande libre et extraire les objectifs, problèmes, acteurs et contraintes.
2. Repérer les activités et processus, pas seulement les mots du métier.
3. Proposer un domaine principal et des domaines secondaires avec justification.
4. Identifier les secteurs et métiers candidats, avec synonymes reconnus.
5. Relier les besoins aux capacités transversales possibles.
6. Signaler les informations manquantes et poser une question ciblée.
7. Afficher les propositions au client sans pré-sélection silencieuse.
8. Enregistrer les corrections, refus, ajouts et confirmations du client.
9. Produire une synthèse de périmètre et demander validation.
10. Transmettre uniquement le périmètre confirmé au studio de maquette et au moteur de planification.

Une profession mentionnée n'active pas automatiquement ses modules. Par exemple, si un médecin demande uniquement un outil de suivi du budget familial, MerKora doit analyser ce projet comme un besoin de gestion personnelle et financière, sans imposer un logiciel médical.

## 8. Exemple transversal : un médecin et quatre besoins distincts

Demande : « Je dirige un cabinet médical. Je veux suivre les présences du personnel, organiser les rendez-vous des patients, suivre les recettes et dépenses du cabinet, et gérer mon budget familial séparément. »

Classification proposée :
- Domaine principal : santé et gestion d'un cabinet, si le client confirme que le cabinet est le projet central.
- Domaines secondaires : ressources humaines, finance et gestion familiale.
- Capacités : comptes et rôles, planning, rendez-vous, présence, finance, rapports, notifications et séparation des espaces.

Questions ciblées :
- Les patients prennent-ils rendez-vous eux-mêmes ou par le secrétariat ?
- Qui peut voir les informations de rendez-vous ?
- Qui pointe les présences et qui valide les corrections ?
- Les finances du cabinet sont-elles accessibles à la direction et au comptable uniquement ?
- Le budget familial doit-il être dans un espace privé distinct, sans accès au personnel du cabinet ?

Architecture fonctionnelle proposée : un même compte propriétaire peut accéder à deux espaces cloisonnés — « Cabinet » et « Personnel/Famille ». Les collaborateurs du cabinet ne voient jamais le budget familial. Les données médicales ne sont collectées que si le périmètre l'exige et avec les garanties appropriées.

## 9. Critères d'acceptation du référentiel

- Les 20 familles ont un identifiant stable et une définition claire.
- Les 100 secteurs sont identifiés et reliés à leurs familles.
- Les métiers peuvent être liés à plusieurs secteurs.
- Les synonymes ne sont pas comptés comme métiers distincts.
- Une spécialisation ne devient une entrée séparée que si elle change réellement le travail ou la solution.
- La reconnaissance peut être hybride, incertaine ou à confirmer.
- Le client peut corriger, ajouter et refuser les propositions.
- Aucune option IA n'est sélectionnée automatiquement.
- Les données privées, professionnelles et sensibles peuvent être cloisonnées.
- Chaque fiche métier approfondie cite ses sources et indique la juridiction applicable.
- Aucun catalogue n'est présenté comme complet tant que ses entrées ne sont pas vérifiées.

## 10. Décisions à prendre avant l'industrialisation

- Déterminer les pays prioritaires pour les variantes réglementaires et professionnelles.
- Choisir les sources de référence par pays et par secteur.
- Définir qui valide les fiches métier et à quelle fréquence.
- Fixer le rythme des lots de publication et les critères d'entrée dans le catalogue validé.
- Déterminer si les 2 000 à 3 000 entrées désignent uniquement des métiers canoniques ou incluent les spécialisations distinctes.

**Règle finale :** le catalogue sert à mieux comprendre les personnes et leurs activités. Il ne doit jamais enfermer un client dans une catégorie, imposer un logiciel préfabriqué ou remplacer sa propre description du besoin.
