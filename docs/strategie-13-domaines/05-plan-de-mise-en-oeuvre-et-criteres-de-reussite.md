# 05 — Plan de mise en œuvre et critères de réussite

## Principe de livraison

Construire par paliers démontrables. Ne pas chercher à automatiser les 13 métiers en une seule livraison. Le socle doit être solide, puis les domaines doivent être enrichis à partir de projets pilotes réels et de tests reproductibles.

## Phase 0 — Audit et alignement
- Auditer le code existant, les parcours, le registre des domaines et les tests.
- Comparer le comportement réel avec ce dossier.
- Identifier les fonctions déjà opérationnelles, partielles, simulées ou absentes.
- Vérifier les dépendances, permissions et données sans réinitialiser les bases.
- Livrable : matrice « existant / partiel / à construire / risque ».

**Sortie :** aucun écart critique inconnu, périmètre technique validé.

## Phase 1 — Socle universel
- Modèle projet, organisation, membres, rôles et validations.
- Diagnostic conversationnel et sauvegarde de progression.
- Domaines multiples, spécialisation, confiance et correction manuelle.
- Catalogue métier/transversal avec dépendances et états.
- Versionnement des sélections et périmètre.
- Journal d'audit et séparation des espaces.

**Sortie :** un besoin peut être compris, corrigé, sélectionné et confirmé sans ambiguïté.

## Phase 2 — Conception
- Cartographie des processus.
- Parcours par rôle et écrans.
- Maquettes contextualisées.
- Cahier des charges versionné et critères d'acceptation.
- Comparaison des scénarios minimum / recommandé / évolutif.

**Sortie :** le client comprend ce qui sera construit et ce qui ne le sera pas.

## Phase 3 — Fabrication contrôlée
- Génération de tâches à partir des spécifications confirmées.
- Réutilisation de composants validés.
- Création de composants spécifiques avec tests.
- Branches, Preview, revues et journal de fabrication.
- Gestion des secrets et environnements.

**Sortie :** chaque lot est démontrable, testable et traçable.

## Phase 4 — Qualité, livraison et exploitation
- Tests fonctionnels, sécurité, accessibilité et performance.
- Recette client.
- Documentation et transfert.
- Sauvegardes, restauration, surveillance et support.
- Processus de changement et maintenance.

**Sortie :** livraison acceptée et exploitée avec responsabilités claires.

## Phase 5 — Enrichissement progressif des 13 domaines
Piloter au moins un cas représentatif par domaine, puis ajouter des variantes et cas limites. Les domaines à risque élevé (santé, administration, RH, finance) exigent une revue métier et sécurité plus forte avant toute automatisation.

## Batterie de validation par domaine

Pour chaque domaine, exécuter :
1. un projet simple et bien décrit ;
2. un projet flou nécessitant des questions ;
3. un projet hybride multi-domaines ;
4. un cas avec une option transversale ;
5. un cas où le client refuse toutes les options facultatives ;
6. un cas de correction de classification ;
7. un cas de changement de périmètre après validation.

Vérifier : domaine, spécialisation, questions, options, sélection explicite, maquette, plan, permissions, données et tests. Aucune option non confirmée ne doit apparaître comme engagement.

## Indicateurs de réussite

- Taux de classification correcte et taux de correction par les utilisateurs.
- Part des diagnostics où les inconnues critiques sont résolues.
- Temps entre demande et proposition compréhensible.
- Pourcentage de fonctionnalités livrées correspondant au périmètre confirmé.
- Nombre d'options suggérées mais non sélectionnées correctement exclues.
- Taux de réussite des tests et anomalies après livraison.
- Temps de traitement des demandes et changements.
- Satisfaction client et adoption réelle.
- Incidents de sécurité, accès indus et pertes de données : objectif zéro.
- Écart entre estimation et effort réel, suivi par type de projet.

## Ordre de priorité conseillé

1. Sécurité, permissions, audit et intégrité des validations.
2. Diagnostic, catalogue et périmètre explicite.
3. Maquettes et cahier des charges.
4. Fabrication et tests par lots.
5. Livraison, sauvegardes et support.
6. Intégrations et automatisations avancées.

## Garde-fous de livraison

La Preview est un environnement de vérification, pas une mise en production. Toute mise en production doit avoir une autorisation distincte, une sauvegarde, un plan de retour arrière, une vérification des variables d'environnement et une recette. Aucun merge ou déploiement production n'est autorisé par ce dossier seul.
