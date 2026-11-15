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

Le dossier est construit depuis les preuves existantes et conserve la description initiale, les citations sources, les identifiants de messages et les statuts.

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
- La session et le dossier sont sauvegardés dans le stockage de session du navigateur après chaque validation.

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
