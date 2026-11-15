# MerKora GDJ — Écrans 03 et 04 : compréhension universelle et diagnostic adaptatif

**Version 1.0 — 15 novembre 2026**  
**Implémentation initiale déterministe, sans fournisseur IA externe et sans migration de base de données.**

## 1. Objectif

L'écran 03 restitue la compréhension construite à l'écran 02 et permet à l'utilisateur de confirmer, corriger ou laisser en suspens chaque information.

L'écran 04 approfondit le contexte avec un entretien adaptatif à question unique. Il conserve les réponses, les précisions, les inconnues et l'historique des corrections.

Ces écrans ne constituent pas un générateur de formulaires par secteur. Ils doivent pouvoir recevoir une activité connue, une activité inconnue, un projet hybride, une recherche, une invention, une situation personnelle ou toute autre réalité décrite librement.

## 2. Règle d'universalité

- Aucun domaine, métier, secteur, type d'application ou famille de produit n'est obligatoire.
- Les identifiants de dimensions sont ouverts et extensibles.
- Le référentiel métier est une aide interne, jamais une liste fermée.
- Une activité non reconnue est conservée avec les mots originaux et peut être explorée comme concept provisoire.
- Les projets hybrides peuvent posséder plusieurs activités, processus et ensembles d'acteurs.
- Les questions sont sélectionnées à partir des informations manquantes, et non d'un parcours sectoriel prédéfini.

## 3. Écran 03 — `app/understanding/page.tsx`

### 3.1. Entrées

- Session de compréhension écran 02 : `merkora-v2-understanding-session`.
- Dossier écran 03 : `merkora-v2-project-understanding`.

Le dossier est construit depuis les preuves existantes et conserve la description initiale, les citations sources, les identifiants de messages et les statuts. Il transporte également le graphe de situation, les contradictions apparentes, les références non résolues et les précautions de confidentialité déjà repérées.

### 3.2. Sections génériques

- Activité, idée ou phénomène.
- Contexte et environnement.
- Situation actuelle.
- Difficultés et besoins.
- Causes évoquées.
- Conséquences.
- Objectifs et résultats.
- Personnes et organisations.
- Fonctionnement et opérations.
- Ressources disponibles.
- Contraintes et règles.
- Solution imaginée.
- Conditions de réussite.

Ces sections sont des angles de lecture transversaux, pas des obligations. Une section vide reste explicitement vide et ne produit aucune information inventée.

### 3.3. Validation et corrections

- Chaque élément affiche son statut et sa provenance.
- L'utilisateur peut confirmer un élément individuellement.
- Une correction ajoute une nouvelle version avec `supersedesId`; l'ancienne formulation reste conservée.
- La validation globale ne transforme que les déclarations de l'utilisateur en éléments validés.
- Les hypothèses et interprétations restent distinctes.
- Le passage à l'écran 04 n'exige pas que toutes les informations soient connues.

## 4. Écran 04 — `app/diagnostic/page.tsx`

### 4.1. Expérience

- Une seule question principale est affichée.
- Le format de réponse peut être texte, choix unique ou choix multiple.
- Les choix peuvent être accompagnés d'une explication libre.
- L'utilisateur peut indiquer qu'il ne sait pas, que la question ne s'applique pas ou la différer.
- Une validation ajoute la réponse au dossier puis recalcule la prochaine question.
- L'historique permet de revoir et corriger une réponse sans supprimer sa version antérieure.
- Les réponses et le dossier sont sauvegardés dans le stockage de session du navigateur après chaque validation ; les brouillons de saisie sont également conservés pendant l'édition.
- Les questions différées peuvent être remises dans le parcours sans perdre les réponses déjà données.

### 4.2. Dimensions explorées

Le moteur peut explorer l'activité, la situation actuelle, la motivation, les résultats attendus, les acteurs, les opérations, les impacts, les causes possibles, les contraintes, les ressources et les critères de réussite. Lorsque le récit signale des obligations, des lois, des normes ou des données personnelles, il peut demander les pays, territoires et juridictions concernés. Lorsque le projet signale un besoin multilingue, il peut demander les langues à prendre en charge.

Chaque dimension est conditionnelle. Par exemple, les questions sur les conséquences et les causes ne sont proposées que lorsqu'un problème est identifié. Une cause recueillie est une hypothèse déclarée, pas une conclusion vérifiée.

### 4.3. Sélection de la prochaine question

`getNextDiagnosticQuestion` construit les candidates depuis les informations actives et écarte celles qui sont déjà traitées ou différées. Il retourne une seule question ou `null` si aucune candidate ne reste.

Les questions sont génériques et ne contiennent pas de catalogue fermé de secteurs. Les réponses de l'utilisateur enrichissent le dossier et modifient les candidates suivantes.

## 5. Modèle de données — `src/lib/merkora-core/project-diagnostic.ts`

### `ProjectUnderstanding`

Conserve l'identité du dossier, la description initiale, les éléments de compréhension, leur dimension ouverte, leur statut, leur source, leur version et leur provenance.

### `ProjectUnderstandingItem`

Conserve une déclaration, une observation, une hypothèse, une interprétation, une inconnue ou une validation. Les corrections utilisent `supersedesId`.

### `DiagnosticSession`

Conserve les réponses, les questions déjà posées, les questions différées, le statut et la version.

### `DiagnosticAnswer`

Conserve la question présentée, la réponse, le détail libre, le statut, la date, la version et, en cas de correction, la référence à la réponse remplacée.

## 6. Persistance et sécurité

La première livraison utilise `sessionStorage`, cohérent avec l'écran 02. Il permet de reprendre après un rechargement dans le même onglet, mais ne garantit pas une reprise après fermeture complète de l'onglet ou sur un autre appareil.

Aucune migration ni écriture Supabase n'est incluse dans cette livraison. La persistance serveur, l'authentification et les politiques d'accès doivent faire l'objet d'une conception séparée avant de stocker durablement des données de projet.

Aucun fournisseur IA externe, aucune API payante et aucun traitement serveur de données personnelles ne sont activés par ces écrans.

## 7. Limites connues de cette version

- L'extraction initiale de l'écran 02 reste déterministe et lexicale ; elle ne constitue pas une compréhension sémantique universelle.
- L'écran 03 conserve et organise les preuves déjà produites ; il ne prétend pas corriger automatiquement les limites de l'extracteur.
- L'écran 04 sélectionne des questions génériques à partir des dimensions absentes ; les réponses ne sont pas encore évaluées par un modèle IA.
- La persistance est limitée à la session du navigateur.
- Les questions de juridiction et de langue sont conditionnelles ; les règles réglementaires internationales ne sont pas encore reliées à une source juridique versionnée.

Ces limites doivent rester visibles dans les décisions techniques et les prochaines étapes.

## 8. Tests prévus

- Conservation du texte initial et de la provenance.
- Activité inconnue et vocabulaire libre.
- Correction versionnée sans suppression.
- Hypothèse qui ne devient pas un fait lors de la validation globale.
- Une seule question sélectionnée.
- Question suivante différente après réponse.
- Choix accompagné d'un détail libre.
- Réponse antérieure modifiable avec historique.
- Projet sans problème déclaré.
- Projet hybride et informations partielles.
- Réponse inconnue ou non applicable.
- Reprise d'une session sauvegardée.

## 9. Suite

Après vérification de cette livraison, la prochaine couche à concevoir sera la consolidation du diagnostic : analyse causale avec preuves, relations entre problèmes et causes, critères de réussite mesurables, règles de préparation par étape et génération du dossier unifié qui alimentera la définition et la composition de la solution.


## 10. Fondation A — référentiel universel des connaissances

La Fondation A est intégrée dans `src/lib/merkora-core/knowledge/` et reliée au graphe de situation.

### 10.1. Capacités livrées dans cette tranche

- Contrats extensibles pour concepts, définitions multilingues, termes, classifications, attributs, relations, sources, portée, versions et fiabilité.
- Noyau de primitives universelles : acteur, organisation, activité, processus, opération, événement, objet, ressource, objectif, problème, résultat, contrainte, lieu, temps, information, règle, solution, service, produit, projet et concept.
- Identifiants canoniques indépendants de la langue.
- Registre en mémoire, immuable par opération, avec contrôle des identifiants et des extrémités de relations.
- Recherche lexicale explicite : exact, normalisé, synonyme, ambigu ou sans correspondance.
- Exclusion par défaut des concepts non validés et respect des portées globales, géographiques ou projet.
- Propositions de concepts inconnus conservées dans le périmètre du projet ; la promotion dans le registre partagé exige une revue explicite.
- Les sources privées du projet ne sont pas copiées dans le concept partagé lors de l'approbation.
- Chaque entité du graphe de situation reçoit un type universel lorsqu'il existe ; un concept canonique n'est attaché que si le rapprochement lexical est non ambigu.
- L'écran 03 présente ces repères en les distinguant des déclarations de l'utilisateur.

### 10.2. Limites explicites

- Le noyau initial est une ontologie de représentation, pas un catalogue exhaustif des métiers, secteurs ou activités.
- La recherche actuelle est lexicale et déterministe ; elle ne constitue pas une recherche sémantique générale et n'utilise pas d'embeddings.
- Le registre partagé est chargé en mémoire depuis le noyau de code. La persistance durable des connaissances enrichies, la revue administrative et la synchronisation entre appareils restent à concevoir.
- Les propositions de concepts sont des objets de domaine disponibles pour le moteur ; leur interface de revue et leur stockage durable ne sont pas encore activés.
- Aucune migration ni écriture Supabase n'est effectuée.
- Les connaissances locales ne sont rapprochées que lorsque le contexte de pays, de juridiction, de région ou de projet est fourni au moteur de correspondance.

La Fondation A fournit ainsi un premier socle réellement utilisé par le graphe et l'écran 03. Elle ne prétend pas remplacer la compréhension linguistique et le raisonnement qui seront conçus dans les fondations suivantes.


### 10.3. Compléments d'intégration de la Fondation A

La validation d'intégrité a complété le premier raccordement :

- Les relations déclarées à l'intérieur d'un concept sont maintenant indexées dans le registre et validées avec leurs deux extrémités.
- Les classifications hiérarchiques ne peuvent pas référencer un parent absent.
- Les portées locales appliquent toutes les dimensions déclarées ; une simple concordance du pays ne suffit pas si une juridiction ou une région plus précise est aussi imposée.
- La correspondance peut être limitée à une langue et à une région, afin de ne pas fusionner des homonymes de langues différentes.
- Les concepts peuvent être révisés par version attendue ; l'ancienne version reste archivée et une révision obsolète est refusée.
- Les snapshots du registre copient les collections et sous-structures afin d'éviter qu'une mutation des objets fournis à l'entrée altère silencieusement le registre.
- L'écran 03 permet de proposer explicitement un terme inconnu. La proposition est conservée dans le dossier privé du projet, avec sa citation et son message source ; elle ne modifie pas le référentiel commun.

Les propositions sont conservées dans le dossier de compréhension du navigateur courant. Leur synchronisation multi-appareils et leur revue administrative sécurisée restent hors périmètre, conformément à l'absence de migration Supabase dans cette fondation.
