# MerKora GDJ Catalogue — conception détaillée de la fondation

**Version :** 1.0  
**Date :** 24 novembre 2026  
**Statut :** conception validée pour réalisation progressive  
**Décisions produit confirmées :**
- Architecture A : un socle commun avec des configurateurs spécialisés par type de produit.
- Périmètre initial : tous les secteurs et types de produits du référentiel existant, avec une architecture extensible.
- Personnalisation après commande : le client personnalise les éléments et options compris dans le périmètre acheté. Toute extension de périmètre, option payante ou réalisation nouvelle passe par une demande et, si nécessaire, un devis complémentaire.

---

## 1. Objectif et promesse

MerKora GDJ Catalogue permet à un client de découvrir une solution numérique, de comprendre ce qu'elle fait, de la configurer selon son activité, de voir clairement ce qu'il commande et de transmettre une commande ou une demande de devis.

Le catalogue n'est pas une simple galerie de modèles. Il constitue l'entrée commerciale et fonctionnelle de la Fabrique MerKora. Il doit relier les besoins réels du client à des produits, modules, règles métier, options, tarifs, conditions et livrables explicites.

**Promesse :** le client adapte la solution à son activité dans les limites de l'offre choisie ; il n'est pas forcé de transformer son activité pour entrer dans un modèle rigide.

Le catalogue ne promet pas qu'une application complète est générée instantanément. Il décrit le périmètre commandé, recueille les décisions et prépare le travail de conception et de réalisation.

## 2. Principes non négociables

1. **Secteur, produit et fonction sont distincts.** Un secteur peut commander plusieurs types de produits ; un produit peut servir plusieurs secteurs ; les fonctions métier restent spécialisées.
2. **Socle commun, règles spécialisées.** Identité, offre, configuration, devis, commande et historique sont partagés. Les configurateurs propres à chaque produit portent les règles spécifiques.
3. **Composition hybride maîtrisée.** Plusieurs domaines peuvent être combinés. Leurs modules sont réunis sans fusionner leurs règles métier ; les modules communs ne sont pas dupliqués.
4. **Le client décide.** Les recommandations de l'IA sont des suggestions, jamais des choix validés automatiquement à sa place.
5. **Les règles contrôlent les choix.** Dépendances, incompatibilités, options, limites et conditions sont évaluées par du code déterministe.
6. **Périmètre commercial immuable après acceptation.** Une commande conserve l'offre, les options, les tarifs, les conditions et la configuration acceptés à cet instant.
7. **Personnalisation incluse, extension encadrée.** Le client modifie les éléments prévus dans son offre. Toute fonction supplémentaire ou modification hors périmètre déclenche une demande d'évolution, une étude et éventuellement un nouveau devis.
8. **L'administration garde le contrôle commercial.** Elle définit et publie les offres et tarifs ; l'IA peut aider à estimer la complexité, mais ne fixe pas le tarif officiel et n'envoie pas seule un devis contractuel.
9. **Sécurité et coûts par défaut prudents.** Aucun paiement, service payant, publication en production, intégration externe ou dépense n'est activé sans autorisation explicite.
10. **Évolution sans réécriture.** Les secteurs, produits, offres, modules, règles et configurateurs doivent pouvoir être enrichis sans casser les projets déjà commandés.

## 3. Vocabulaire métier

| Terme | Définition |
|---|---|
| Secteur / domaine | Univers d'activité dans lequel la solution sera utilisée : commerce, santé, éducation, transport, etc. |
| Type de produit | Nature du livrable numérique : site, plateforme, application mobile, e-commerce, réservation, jeu, générateur, etc. |
| Module | Capacité fonctionnelle identifiable : stock, réservation de créneaux, pointage, OCR, classement, etc. |
| Rôle | Profil d'une personne qui intervient dans le produit : propriétaire, agent, enseignant, client, joueur, etc. |
| Offre | Proposition commerciale publiée par MerKora, composée d'un produit, d'un périmètre, de limites, d'options, de prix et de conditions. |
| Configuration | Choix du client pour adapter une offre avant commande. |
| Personnalisation incluse | Modification de contenu ou de paramètres permise dans le périmètre commandé. |
| Évolution | Demande qui ajoute ou change le périmètre fonctionnel accepté. |
| Instantané | Copie immuable des éléments commerciaux et fonctionnels acceptés à la commande. |
| Configurateur | Parcours de questions et de règles spécialisé pour un type de produit. |

## 4. Taxonomie initiale et couverture

La fondation doit reconnaître tous les identifiants déjà présents dans `src/lib/merkora-core/solution-catalog.ts`. Ils sont le référentiel initial ; ils ne doivent pas être recréés sous des identifiants concurrents.

### 4.1 Types de produits déjà présents

- `showcase_website` — site vitrine.
- `web_platform` — plateforme web.
- `mobile_app` — application mobile.
- `web_application` — application web / logiciel.
- `booking_solution` — système de réservation.
- `ecommerce` — boutique / e-commerce.
- `game` — jeu numérique.
- `generator` — générateur / outil de création.
- `architecture_workspace` — espace de conception architecturale.
- `operational_solution` — solution opérationnelle / métier.

Un même projet peut combiner plusieurs domaines métier, mais son type de produit principal est explicite. Les formes de livrables multiples devront être représentées par une composition déclarée, pas par une déduction implicite.

### 4.2 Domaines métier déjà présents

`attendance`, `reservation`, `finance`, `education`, `architecture`, `social_network`, `game`, `code_generation`, `commerce`, `business_management`, `telecommunications`, `health`, `agriculture`, `transport`, `media`.

Cette liste est un socle initial extensible, pas une liste exhaustive de tous les métiers possibles. Les nouveaux domaines seront ajoutés après définition de leur vocabulaire, rôles, modules, dépendances et précautions.

### 4.3 Exemples de spécialisation

- Commerce + e-commerce : catalogue, variantes, stock, panier, commande, paiement, livraison, retours.
- Éducation + plateforme : apprenants, classes, cours, enseignants, évaluations, résultats, progression.
- Formation + réservation : créneaux, capacité, ressources, inscription et confirmations.
- Présence + réservation : pointage relié à une réservation, sans confondre réservation et présence réelle.
- Numérisation : réception, scan, OCR, classification, métadonnées, indexation, recherche, contrôle qualité, archivage.
- Jeu : règles, état de partie, joueurs, équipes, sessions, scores, progression, modération.
- Architecture : relevés, plans, variantes, matériaux, estimations, visualisations et validations.

Ces exemples illustrent les règles de composition ; ils ne signifient pas que tous les configurateurs détaillés et tous les écrans seront livrés dans la première tranche.

## 5. Architecture fonctionnelle

### 5.1 Socle commun

Le socle commun fournit :
- référentiel des catégories, domaines, types de produits et modules ;
- fiches d'offres et versions publiées ;
- rôles et espaces utilisateurs ;
- moteur de règles de configuration ;
- sélection d'options et calcul de périmètre ;
- aperçu et récapitulatif de configuration ;
- règles tarifaires et demande de devis ;
- commande et instantané de ce qui a été accepté ;
- demandes d'évolution et historique des versions.

### 5.2 Configurateurs spécialisés

Chaque configurateur expose une interface commune (identifiant du produit, étapes, questions, règles et résultat), mais conserve son propre modèle métier. Les champs propres à une réservation ne doivent pas être imposés à un jeu ou à un outil d'archivage.

Les configurateurs initiaux prioritaires seront e-commerce, réservation, gestion, éducation, numérisation et jeux. Les autres types et domaines restent présents dans le référentiel et seront complétés par étapes. Le périmètre « all » signifie que l'architecture et le catalogue de référence couvrent l'ensemble des domaines et produits déjà connus ; il ne signifie pas que chaque parcours métier spécialisé est intégralement implémenté dans une seule livraison.

### 5.3 Administration

L'administration MerKora doit pouvoir, dans les phases d'interface suivantes :
- créer, modifier, prévisualiser et publier une offre ;
- choisir un type de produit et les domaines compatibles ;
- composer le périmètre inclus et les options ;
- déclarer dépendances, incompatibilités et limites ;
- définir un prix fixe, des règles de calcul ou une demande de devis ;
- gérer les versions, conditions, délais et frais récurrents ;
- suspendre ou archiver une offre sans effacer les commandes historiques.

La fondation technique commence par les modèles et règles métier ; l'interface d'administration viendra après stabilisation de ces contrats.

## 6. Modèle d'une offre

Une offre publiée doit au minimum décrire :

- identifiant stable, nom, résumé et description détaillée ;
- catégorie et statut ;
- type de produit principal ;
- domaines métier compatibles ;
- fonctions incluses et leurs limites ;
- options facultatives, prérequis et coûts éventuels ;
- rôles et espaces disponibles ;
- possibilités de personnalisation incluse ;
- éléments hors périmètre ;
- prix et mode de calcul ;
- frais récurrents éventuels ;
- délai indicatif et dépendances client ;
- conditions, validité et version ;
- démonstration, captures ou aperçu lorsqu'ils existent réellement.

### 6.1 Statuts

- `draft` : brouillon non visible au client ;
- `in_review` : en vérification interne ;
- `published` : visible et commandable selon ses conditions ;
- `suspended` : temporairement non commandable, historique conservé ;
- `archived` : retiré du catalogue actif, commandes historiques conservées.

### 6.2 Modes tarifaires

- `fixed` : prix défini par l'administration ;
- `rule_based` : calcul déterministe à partir de règles publiées ;
- `quote_required` : étude et devis préparés puis validés par l'administration.

Un prix indicatif ou une estimation IA ne doit jamais être présenté comme un devis approuvé.

## 7. Moteur de configuration

Le moteur reçoit une offre versionnée, les choix du client et le référentiel de règles. Il retourne :
- les choix acceptés ;
- les choix refusés avec une raison compréhensible ;
- les dépendances manquantes ;
- les options nécessitant une confirmation ou une revue ;
- le périmètre calculé ;
- les éléments personnalisables inclus ;
- les éléments qui exigent une demande d'évolution.

### 7.1 Règles de sélection

1. Une option doit appartenir à l'offre ou être explicitement autorisée par une règle.
2. Une fonction ayant des dépendances ne peut pas être activée tant que ses prérequis ne sont pas présents.
3. Une fonction incompatible avec une sélection active doit être refusée ou demander une résolution explicite.
4. Les modules communs issus de plusieurs domaines ne sont présents qu'une fois dans la composition finale.
5. Une fonction recommandée par l'IA reste non sélectionnée jusqu'à validation du client.
6. Une sélection inconnue ne doit pas être silencieusement convertie en module valide.
7. Une configuration conserve la version de l'offre et des règles qui l'ont produite.

### 7.2 Personnalisation après commande — décision confirmée

Le client peut modifier les contenus, informations, identité visuelle, paramètres et options que l'offre et la commande autorisent explicitement. Il peut gérer les utilisateurs et rôles dans les limites prévues.

Il ne peut pas, par une simple personnalisation, transformer une fonction non achetée en fonction incluse. Une demande qui ajoute un module, change une règle métier majeure, augmente une limite ou modifie un livrable est une évolution. Elle est enregistrée séparément et peut nécessiter un devis complémentaire et une nouvelle validation.

## 8. Cycle client cible

1. Découvrir les offres par besoin, secteur ou type de produit.
2. Ouvrir une fiche complète et comprendre ce qui est inclus.
3. Choisir ou confirmer son secteur et son type de produit.
4. Répondre aux questions du configurateur adapté.
5. Ajouter ou retirer des modules et options autorisés.
6. Lire les explications sur les dépendances, limites et choix incompatibles.
7. Prévisualiser la composition et, si disponible, une maquette produit.
8. Consulter le récapitulatif : fonctions, options, exclusions, prix ou statut « devis requis », délais et conditions.
9. Commander ou demander un devis.
10. Après acceptation, retrouver un espace projet et personnaliser les éléments inclus.
11. Déposer une demande d'évolution pour tout changement hors périmètre.
12. Suivre ensuite la conception, les tests, les validations et la livraison dans les phases suivantes.

Le client peut passer par Catalogue, IDP ou DRT. Les parcours doivent converger vers un même dossier projet et préserver les décisions déjà confirmées.

## 9. Données et versionnement

Les concepts de données à représenter sont :

| Entité logique | Responsabilité |
|---|---|
| CatalogueCategory | Catégoriser les offres |
| BusinessDomain | Décrire un secteur métier |
| ProductType | Décrire un type de réalisation |
| ModuleDefinition | Définir une capacité métier |
| ModuleDependency | Déclarer prérequis et incompatibilités |
| CatalogOffer | Décrire une offre publiée |
| CatalogOfferVersion | Conserver chaque version d'offre |
| OfferModule | Décrire les fonctions incluses ou optionnelles |
| ConfigurationRule | Décrire les règles déterministes |
| PricingRule | Décrire le calcul commercial administré |
| ProductConfiguration | Conserver les choix avant commande |
| ConfigurationRevision | Historiser les changements de configuration |
| OrderSnapshot | Conserver exactement ce qui a été accepté |
| ChangeRequest | Décrire une évolution post-commande |

Ces noms sont des entités conceptuelles ; ils ne sont pas des tables Supabase créées. La première implémentation utilisera des types et fonctions TypeScript purs. La persistance et le schéma Supabase feront l'objet d'une conception et d'une autorisation séparées.

### 9.1 Instantané de commande

L'instantané conserve au minimum : identifiant et version de l'offre, type de produit, domaines, modules, options, limites, prix et devise, frais récurrents, conditions, date d'acceptation et révision de configuration. Les futures modifications du catalogue ne modifient jamais cet instantané.

## 10. Sécurité, confidentialité et contrôle humain

- Les données personnelles, dossiers de santé, informations financières et documents privés doivent être traités selon le principe du moindre accès.
- La biométrie, les données de santé, les paiements et les fonctions réglementées nécessitent une analyse dédiée avant toute implémentation réelle.
- Les clés et secrets de fournisseurs restent côté serveur.
- Le navigateur ne peut pas déclarer un paiement réussi.
- Aucun connecteur payant, service GPU, abonnement fournisseur ou déploiement de production n'est activé par défaut.
- Les actions administratives et validations commerciales sont journalisées.
- L'IA ne doit ni publier une offre, ni approuver un tarif, ni accepter une commande, ni étendre le périmètre sans décision autorisée.

## 11. Limites de la première fondation

La première tranche comprend :
- formalisation des types et interfaces de catalogue ;
- réutilisation du référentiel produit/domaine existant ;
- définition d'une offre versionnée et de ses options ;
- règles de cohérence des offres et configurations ;
- gestion des dépendances et des compositions hybrides ;
- distinction personnalisation incluse / évolution hors périmètre ;
- tests unitaires et documentation.

Elle ne comprend pas encore :
- migration ou modification Supabase ;
- paiement réel, facturation contractuelle ou abonnement actif ;
- publication de production ;
- exécution automatique de projets clients ;
- tous les écrans des configurateurs spécialisés ;
- activation de services payants ou intégrations externes.

## 12. Critères d'acceptation

La fondation est acceptable lorsque :
1. Les dix types de produits et les quinze domaines métier déjà présents sont réutilisés sans identifiants concurrents.
2. Un secteur peut être associé à plusieurs types de produits.
3. Un produit peut servir plusieurs domaines métier.
4. Les compositions hybrides fusionnent les doublons de modules sans fusionner les règles métier.
5. Les offres ont un statut, une version, un périmètre, des options et un mode tarifaire explicites.
6. Une offre en brouillon, suspendue ou archivée ne peut pas être commandée comme une offre publiée.
7. Les dépendances manquantes et options non autorisées sont expliquées et bloquent une configuration invalide.
8. Une configuration conserve les références de versions utilisées.
9. Les personnalisations incluses sont séparées des demandes d'évolution.
10. Un instantané de commande demeure inchangé après modification ultérieure de l'offre.
11. Les cas Aéro Service, WALL Trade, Ginesse de Paris Center Work, Student Vision et architecture peuvent servir de scénarios de régression.
12. Les tests, le typecheck et le build passent sans modification de données Supabase.

## 13. Avancement et étapes suivantes

### 13.1 Réalisé dans la première tranche

- Le référentiel canonique existant est réutilisé : 10 types de produits et 15 domaines métier.
- Le Catalogue présente les types de produits et les domaines séparément, avec leurs fonctions de référence.
- Le modèle TypeScript des offres versionnées et les statuts commerciaux sont définis.
- La validation vérifie les références produit, domaine et module.
- Le moteur de configuration vérifie les sélections, les options déclarées, les dépendances et conserve les suggestions IA comme suggestions.
- L'instantané de commande conserve les références de l'offre, la configuration, les options et les champs de personnalisation autorisés.
- Les scénarios de régression couvrent Aéro Service, WALL Trade, Ginesse de Paris Center Work, Student Vision et un espace de conception architecturale.
- Le document et les tests sont conservés dans cette branche de travail.

### 13.2 À construire ensuite

1. Renforcer les contrats de validation (données incomplètes, doublons, versions, devises et valeurs reçues à l'exécution).
2. Construire les six premiers configurateurs spécialisés : e-commerce, réservation, gestion, éducation, numérisation et jeux.
3. Créer le parcours de configuration client avec aperçu, résumé des inclusions, options et exclusions.
4. Construire l'interface d'administration des offres, versions, options et règles tarifaires.
5. Ajouter le moteur de devis administré : prix fixes, règles explicites et devis soumis à validation humaine.
6. Relier les commandes au dossier projet partagé et aux parcours Catalogue, IDP et DRT.
7. Concevoir séparément la persistance Supabase et les migrations nécessaires, sans les exécuter avant autorisation.

Le périmètre « all » signifie que tous les identifiants déjà connus sont reconnus et que l'architecture peut s'étendre à tous les domaines. Il ne signifie pas que les 15 domaines disposent déjà chacun d'un configurateur complet.

**Règle de livraison :** chaque étape est isolée, testée et relue. La PR #75 reste intacte ; aucune fusion ou mise en production n'est autorisée sans autorisation explicite.


## Avancement complémentaire — configurateurs spécialisés (26 novembre 2026)

Une première couche métier distincte a été ajoutée pour six configurateurs :
- **E-commerce** : modèle de vente, catalogue et variantes, stock, commande/paiement, livraison/retrait et après-vente.
- **Réservation** : ressource réservable, disponibilités, capacité, règles de réservation et notifications/accueil.
- **Gestion d'activité** : organisation, rôles et responsabilités, processus, contrôles financiers et rapports.
- **Éducation / orientation** : modèle (dont orientation professionnelle indépendante d'une gestion scolaire), public, contenus, tests et recommandations.
- **Numérisation / archivage** : réception, capture/scan, OCR et extraction, classement, recherche et conservation.
- **Jeux** : format, joueurs/équipes, règles, déroulement des sessions et progression.

Chaque configurateur expose ses propres étapes, formulations, aides, types de réponses, choix autorisés et références de modules. Un validateur refuse les réponses inconnues ou les options non prévues. Les modules du catalogue canonique ont été enrichis pour les retours commerciaux, l'orientation et la chaîne documentaire.

**Limite actuelle :** cette couche constitue le contrat métier et le moteur de validation initial. Les écrans interactifs, questions conditionnelles avancées, dépendances entre réponses, génération de prévisualisation et branchement au parcours de commande restent des étapes suivantes. Les configurateurs ne doivent pas être présentés comme entièrement finalisés avant ces étapes et les tests de bout en bout.
