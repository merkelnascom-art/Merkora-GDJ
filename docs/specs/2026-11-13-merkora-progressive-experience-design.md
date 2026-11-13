# MerKora GDJ — Spécification de conception de l’expérience progressive

- **Date :** 13 novembre 2026
- **Version :** 1.0
- **Statut :** Proposition à valider avant plan d’implémentation
- **Dépôt :** merkelnascom-art/Merkora-GDJ
- **Branche de travail :** feature/merkora-universal-reference-implementation
- **Référence visuelle :** planche d’écrans approuvée dans la conversation du 13 novembre 2026

## 1. Vision produit

MerKora GDJ est une plateforme universelle d’analyse, de conception et de réalisation de solutions adaptées à des besoins réels. Elle accueille toute personne, activité, profession, organisation ou idée, sans présumer qu’une demande doit devenir un site web, une application, un logiciel de gestion ou même une solution numérique.

Le rôle de MerKora est de comprendre avant de proposer, de rendre les options compréhensibles, de matérialiser les choix dans un concept visuel crédible, puis d’accompagner la validation et la réalisation.

Le référentiel universel (domaines, métiers, processus, outils et contraintes) est une connaissance interne qui aide le raisonnement. Il ne doit jamais être présenté au client comme un catalogue massif à parcourir.

### Principes non négociables

1. **Le besoin avant l’outil.** Aucun format technique ou module ne doit être imposé avant d’avoir compris la situation.
2. **Une étape à la fois.** Un espace principal visible à la fois ; les étapes suivantes restent discrètes jusqu’à ce qu’elles deviennent pertinentes.
3. **Une question utile à la fois.** Les questions dépendent des réponses précédentes. Les choix multiples ne sont affichés que lorsque plusieurs réponses peuvent réellement coexister.
4. **Le client garde le contrôle.** Une suggestion de l’IA n’est jamais une décision confirmée du client.
5. **Aucune classification sur un mot isolé.** Une catégorie, un métier, un module ou un format doit être justifié par plusieurs éléments de contexte.
6. **Pas de pression commerciale prématurée.** Pas de budget, devis, paiement, abonnement ou facture dans la phase de compréhension. Les éléments commerciaux apparaissent lorsque le client choisit réellement d’aller vers la réalisation.
7. **La solution doit être montrée.** Le concept visuel doit ressembler au produit ou au service imaginé, avec des écrans, rôles, actions et parcours cohérents, et non à un long rapport textuel.
8. **Accessibilité et continuité.** Expérience mobile-first, langage simple, reprise du projet, sauvegarde prudente et gestion claire des erreurs.
9. **Universalité réelle.** Aucun projet de test ou secteur particulier ne doit devenir le modèle par défaut de tous les clients.
10. **Transparence sur l’IA.** Ne jamais annoncer une analyse externe ou une vérification par un modèle qui n’a pas réellement été exécuté.

## 2. Direction artistique approuvée

La direction reprend la composition visuelle validée par le client : interface lumineuse, premium, aérée, cartes sobres, angles doux, hiérarchie typographique nette et progression très lisible.

### Palette de marque

- Bleu nuit : structure, profondeur, confiance et navigation.
- Or champagne : accents de prestige, détails et éléments de mise en valeur.
- Violet lumineux : intelligence, créativité, innovation et interactions importantes.
- Blanc nacré : surfaces, respiration et lisibilité.
- Gris doux : métadonnées, séparateurs et états secondaires.

Le violet ne doit pas saturer toute l’interface. L’or reste un accent rare, jamais un texte courant peu contrasté. Les couleurs d’état (succès, attention, erreur) restent distinctes de la palette de marque.

### Principes d’interface

- Mobile-first et responsive ordinateur/tablette.
- Une zone de travail principale, centrée et lisible.
- Cartes avec profondeur légère, bordures discrètes et espacements généreux.
- Titres courts et actions explicites.
- Progression indiquée sans afficher un long tunnel de formulaires.
- Transitions sobres, rapides, respectueuses des préférences de réduction des animations.
- Navigation secondaire compacte ; sur mobile, elle ne doit pas occuper l’écran en permanence.
- Les maquettes doivent présenter des données d’exemple clairement fictives et adaptées au projet courant.

## 3. Parcours client cible

Le parcours est séquentiel et adaptatif. Le système peut revenir à une étape précédente sans perdre les réponses déjà confirmées.

### Écran 1 — Accueil et projets

**Objectif :** permettre de commencer immédiatement ou de reprendre un projet existant.

Contenu :
- identité MerKora GDJ et promesse courte ;
- action principale « Commencer un projet » ;
- projets récents sous forme de cartes compactes, avec état réel et date utile ;
- action de reprise ;
- accès discret au compte et à l’aide.

Ne pas afficher dès l’accueil les devis, paiements, modules, diagnostics complets ou tableaux de statistiques qui ne servent pas à commencer.

### Écran 2 — Compréhension conversationnelle

**Objectif :** recueillir le besoin avec les mots du client.

Contenu :
- question d’ouverture simple, par exemple « Qu’aimeriez-vous améliorer, créer ou résoudre ? » ;
- zone de saisie libre ;
- possibilité facultative d’ajouter une image, un document ou un exemple ;
- suggestions de démarrage facultatives, non prescriptives.

Comportement :
- accepter une description courte ou longue ;
- ne pas exiger le choix d’un secteur ;
- demander une seule précision prioritaire lorsque nécessaire ;
- conserver le contexte et les réponses précédentes ;
- proposer « Je ne sais pas encore » lorsque cela évite de forcer une réponse.

### Écran 3 — Analyse en arrière-plan

**Objectif :** préparer une compréhension fiable sans submerger le client.

L’analyse structure séparément :
- faits explicitement donnés par le client ;
- objectifs exprimés ;
- situation actuelle ;
- hypothèses et raisons qui les soutiennent ;
- informations manquantes ;
- contraintes et risques potentiels ;
- personnes et rôles concernés, lorsqu’ils sont connus ;
- questions réellement nécessaires.

Les hypothèses restent marquées comme telles jusqu’à confirmation. Les déductions incertaines ne sont pas transformées en faits. L’interface montre un état de traitement honnête et une solution de repli si un service IA est indisponible.

### Écran 4 — Propositions adaptées

**Objectif :** présenter un petit nombre d’options pertinentes, comparables et justifiées.

Chaque proposition comprend :
- nom compréhensible ;
- représentation visuelle ou pictogramme pertinent ;
- problème précis auquel elle répond ;
- bénéfice attendu ;
- limites, dépendances ou informations encore inconnues ;
- raison pour laquelle MerKora la propose.

Le client peut choisir une ou plusieurs options compatibles, demander une modification, refuser une proposition ou demander une autre piste. Les solutions non numériques restent possibles si elles répondent mieux au besoin.

### Écran 5 — Concept visuel réel

**Objectif :** rendre la solution tangible.

Le studio construit une maquette adaptée au projet et au format confirmé. Il ne doit pas afficher systématiquement un téléphone ou un tableau de bord avant d’avoir établi si le besoin concerne un site, une application mobile, un outil interne, un service hybride ou une autre forme.

La maquette doit montrer, selon le cas :
- navigation et pages ;
- rôles et espaces utilisateurs ;
- actions principales ;
- données représentatives ;
- enchaînement des opérations ;
- états utiles (vide, en cours, terminé, erreur ou attente).

Le contenu d’exemple doit provenir du contexte du projet, sans recycler automatiquement un projet de démonstration.

### Écran 6 — Personnalisation

**Objectif :** permettre au client d’ajuster la proposition sans devoir comprendre la technique.

Les réglages n’apparaissent que s’ils sont pertinents :
- fonctions retenues ;
- rôles et permissions ;
- étapes d’un processus ;
- identité visuelle ;
- supports et appareils ;
- notifications, intégrations ou automatisations.

Les options compatibles peuvent être sélectionnées ensemble. Les dépendances et conséquences sont expliquées simplement. Aucune fonction n’est activée silencieusement au nom du client.

### Écran 7 — Validation de conception

**Objectif :** obtenir une validation explicite et traçable du périmètre conçu.

Le client peut :
- valider le concept présenté ;
- demander des changements ;
- revenir à une proposition précédente ;
- laisser une question ou une réserve.

La validation porte sur une version identifiée du concept et sur les éléments effectivement présentés. Une modification ultérieure crée une nouvelle version ou une révision identifiable. La validation de conception ne vaut pas acceptation d’un devis, paiement ou autorisation de mise en production.

### Écran 8 — Réalisation et suivi

**Objectif :** accompagner le projet après validation.

Afficher seulement les informations pertinentes :
- étape actuelle ;
- éléments terminés et à venir ;
- livrables ou démonstrations disponibles ;
- questions en attente du client ;
- demandes de modification ;
- résultats des vérifications lorsqu’ils existent.

Les informations commerciales (devis, échéancier, paiement, abonnement, hébergement ou maintenance) sont accessibles dans un espace distinct lorsque le projet atteint cette étape et que ces sujets sont effectivement applicables. Elles ne doivent pas interrompre le parcours de conception.

## 4. Espace administrateur

L’espace administrateur est un outil de pilotage distinct de l’expérience client. Il reprend la même identité visuelle mais privilégie la densité utile, la lisibilité et les actions métier.

Navigation cible :
1. Tableau de bord
2. Demandes et projets
3. Analyse & conception
4. Validations & devis
5. Réalisation
6. Clients
7. Finances
8. Configuration

### Fiche administrateur d’un projet

Elle doit permettre de consulter :
- description initiale et historique de conversation ;
- faits, hypothèses, inconnues et niveau de confiance ;
- propositions émises et justifications ;
- questions en attente ;
- versions successives de la maquette ;
- décisions explicitement confirmées par le client ;
- validations, demandes de modification et historique des actions ;
- état réel de réalisation et éléments vérifiés.

Actions possibles :
- demander une précision au client ;
- corriger une analyse avec justification ;
- proposer une nouvelle version ;
- préparer ou réviser un devis lorsque cela devient pertinent ;
- affecter un responsable ;
- faire avancer une étape avec trace d’audit.

Un administrateur ne doit pas transformer silencieusement une hypothèse en décision client. Les devis restent soumis à contrôle administrateur avant présentation au client, selon les règles commerciales déjà retenues.

## 5. Modèle de compréhension et règles de décision

Le modèle métier doit préserver des distinctions explicites :

- **Fact** : information directement fournie ou confirmée par le client.
- **Hypothesis** : interprétation possible, avec raison et confirmation requise.
- **Unknown** : information absente ou non résolue.
- **Suggestion** : option proposée par MerKora, non acceptée par défaut.
- **Decision** : choix explicite du client, daté et lié à une version.
- **Admin override** : correction administrative tracée, qui ne doit pas se faire passer pour une déclaration du client.

Toute recommandation importante doit être liée à une ou plusieurs preuves contextuelles. Les règles fondées sur des mots-clés peuvent aider à détecter une piste, mais ne peuvent pas suffire à confirmer un secteur, un métier, un module ou un format.

Les modèles IA secondaires, y compris Gemini si l’intégration est réellement disponible et autorisée, peuvent aider à analyser, détecter les ambiguïtés et proposer des questions. Leur sortie reste consultative et doit être contrôlée par les règles métier. Le système doit fonctionner avec un mode de repli explicite si aucun fournisseur IA n’est disponible.

## 6. Architecture d’expérience et données

La refonte doit réutiliser les briques métier existantes lorsque leur comportement est compatible avec ces principes, plutôt que de remplacer sans examen les moteurs universels déjà présents.

Concepts de données à préserver ou formaliser :
- projet et propriétaire ;
- conversation et messages ;
- réponses structurées ;
- faits et hypothèses ;
- questions ouvertes ;
- propositions et justifications ;
- configuration et versions de maquette ;
- décisions et validations ;
- étapes et livrables de réalisation ;
- historique d’événements et journal d’audit.

La persistance doit être cohérente entre stockage local et espace cloud. Une donnée locale ne doit pas écraser une version cloud plus récente sans stratégie de résolution de conflit. Les sauvegardes doivent être tolérantes aux erreurs, et les états de synchronisation doivent être honnêtes.

**Contrainte de préservation :** aucune suppression, réinitialisation ou migration destructive des données Supabase existantes. Toute évolution de schéma doit être additive, documentée et testée. Aucun service payant ne doit être activé sans autorisation explicite.

## 7. Sécurité, confidentialité et fiabilité

- Contrôle d’accès serveur par utilisateur et rôle ; ne pas se fier uniquement à l’interface.
- Vérification de propriété du projet sur chaque route et opération.
- Permissions minimales pour les rôles administrateur, client et intervenant.
- Journalisation des changements importants et de l’auteur.
- Minimisation des données collectées ; expliquer les données sensibles lorsqu’elles sont nécessaires.
- Aucun suivi caché, collecte non consentie ou partage implicite de données.
- Gestion des erreurs réseau, session expirée, synchronisation impossible et réponse IA invalide.
- États de chargement et de reprise accessibles.
- Protection contre les doubles soumissions et les mises à jour concurrentes.
- Les exemples et données fictives doivent être identifiables comme tels.

## 8. Accessibilité et qualité d’usage

- Contraste suffisant pour le texte et les contrôles.
- Navigation clavier et focus visibles.
- Libellés accessibles pour les champs et boutons.
- Messages d’erreur compréhensibles et associés au champ concerné.
- Zones tactiles adaptées au mobile.
- Mise en page utilisable à partir des petits écrans.
- Respect de prefers-reduced-motion.
- Pas d’information communiquée uniquement par la couleur.

## 9. Hors périmètre de cette première refonte

- Refonte du modèle commercial ou modification des tarifs.
- Paiement automatique ou activation de services payants.
- Suppression ou réinitialisation de données.
- Migration destructive de la base Supabase.
- Fusion de branche ou déploiement en production.
- Construction immédiate et complète de tous les types de solutions imaginables.
- Dépendance obligatoire à un fournisseur IA externe.

## 10. Critères d’acceptation

La conception sera considérée comme correctement traduite si :

1. Un nouveau client peut commencer par une description libre sans choisir un secteur ou un format.
2. Le parcours n’affiche qu’une étape principale à la fois.
3. Les questions suivantes dépendent réellement du contexte déjà fourni.
4. Les hypothèses sont distinguées des faits et exigent confirmation avant de devenir des décisions.
5. Les propositions expliquent leur pertinence et leurs limites.
6. Le studio présente une maquette adaptée au type de solution établi, sans format générique imposé.
7. Les choix du client peuvent être modifiés et les versions sont traçables.
8. La validation du concept est distincte de l’acceptation commerciale.
9. Les devis et paiements n’apparaissent pas pendant la compréhension initiale.
10. Le client peut reprendre un projet sans perte de réponses.
11. Les erreurs de synchronisation ou d’IA ne bloquent pas l’accès aux données déjà sauvegardées.
12. L’espace administrateur permet de vérifier les décisions et l’historique sans mélanger les droits.
13. Les données Supabase existantes sont préservées.
14. Les tests couvrent les parcours heureux, les réponses ambiguës, les erreurs réseau, les permissions et les régressions de classification.
15. Les changements restent sur la branche de travail et sont vérifiés en Preview ; aucun merge ou déploiement de production n’est effectué sans accord séparé.

## 11. Découpage de conception pour l’implémentation

Après validation de cette spécification, le plan d’implémentation devra être établi en lots contrôlables :

- **Lot A — Structure de navigation :** isoler les espaces client, projet et administrateur ; supprimer l’effet de page longue sans supprimer les fonctionnalités métier.
- **Lot B — Parcours de découverte :** conversation progressive, questions adaptatives, sauvegarde/reprise et états de traitement.
- **Lot C — Raisonnement universel :** exploiter les faits/hypothèses/inconnues et lier les propositions aux preuves.
- **Lot D — Studio visuel :** adapter les maquettes au besoin confirmé, améliorer les interactions et versions.
- **Lot E — Validation et réalisation :** séparer validation de conception, suivi d’exécution et étapes commerciales.
- **Lot F — Administration :** navigation et fiche projet centrées sur la décision, le contrôle et l’audit.
- **Lot G — Fiabilité :** tests, accessibilité, sécurité, synchronisation, régressions et vérification Preview.

Chaque lot doit préserver les données, inclure des tests et être livré sans merge ni production tant que l’utilisateur ne l’a pas autorisé.
