# 10. Ressources humaines et gestion du personnel

## 1. Finalité et organisations concernées
PME, grandes entreprises, écoles, agences, associations et organisations multi-sites.

Le domaine est un référentiel métier : MerKora doit reconnaître les mots utilisés par les professionnels, mais surtout comprendre les opérations, les responsabilités, les exceptions et les résultats attendus. Un projet peut associer ce domaine à un ou plusieurs autres.

## 2. Catalogue de projets et fonctions possibles
Dossiers employés ; contrats et affectations ; recrutement ; présence/pointage ; horaires ; congés et autorisations ; tâches et responsabilités ; formation ; éléments variables de paie ; évaluations ; rapports RH.

Ce catalogue sert à inspirer et à clarifier. Il ne signifie pas que toutes ces fonctions sont incluses dans un devis ou activées dans une application.

## 3. Questionnaire métier adaptatif
MerKora commence par une question ouverte sur le problème. Puis il approfondit uniquement les inconnues qui influencent le périmètre :
Combien de salariés et de sites ? Quels processus RH ? Quelles règles d'horaires et de retard ? Qui voit les dossiers et salaires ? Comment corriger un pointage ? Quelles validations humaines et règles locales ?

Questions de relance génériques à adapter : « Comment faites-vous aujourd'hui ? », « Qu'est-ce qui échoue le plus souvent ? », « Qui doit intervenir ? », « Quelle preuve montre que l'opération est terminée ? », « Que doit-il se passer en cas d'erreur ou d'absence de réseau ? »

## 4. Parcours et processus de référence
Recrutement → sélection humaine → embauche → dossier → affectation → planning → pointage → demande d'absence/congé → validation → variables de paie contrôlées → rapport.

Pour chaque processus réel, MerKora doit documenter déclencheur, acteurs, entrées, étapes, décisions, exceptions, sorties, preuves et responsable. Les processus ci-dessus sont des modèles à adapter, pas des règles imposées.

## 5. Rôles et espaces
Direction, RH, manager, salarié, superviseur, paie, auditeur. Espace salarié limité à ses propres informations ; RH et direction selon habilitation.

Chaque rôle reçoit uniquement les écrans et actions nécessaires. Les espaces client et administrateur MerKora restent séparés de l'espace administrateur du logiciel construit pour le client.

## 6. Architecture et données métier
Employés, contrats, postes, sites, horaires, pointages, absences, congés, tâches, formations, évaluations, variables de paie, validations.

Les objets définitifs doivent être conçus après validation des cas d'usage. Prévoir identifiants stables, historique, relations, provenance des données, règles de conservation et séparation des organisations. Ne pas collecter des champs « au cas où ».

## 7. Modules, options et intégrations
Options actuelles : vue équipe, présences/pointages, tâches, historique, recrutement, congés, formation, variables de paie. Intégrations : badge/QR, biométrie si justifiée et légalement permise, paie, notifications.

Les capacités transversales (permissions, notifications, documents, paiements, rapports, audit, assistance, intégrations) sont proposées séparément et seulement si utiles. Toute connexion externe exige une vérification de disponibilité, coûts, sécurité, autorisations et solution de secours.

## 8. Règles métier et sécurité
Données personnelles et salariales strictement protégées. Pas de sanction ou licenciement automatique. Corrections de pointage motivées et auditées. Biométrie : nécessité, proportionnalité, sécurité et conformité locale avant toute collecte.

Les règles locales, contrats, normes et obligations doivent être vérifiés avec des professionnels compétents avant usage réel. L'IA peut aider à expliquer et à préparer, mais ne doit pas se substituer aux autorités ou professionnels habilités.

## 9. Exemple complet de projet
Exemple : une entreprise utilise des horaires par équipe. Un retard est enregistré ; le manager vérifie le motif et valide la correction ou le statut selon règlement interne. Le rapport hebdomadaire distingue données brutes et corrections.

## 10. Indicateurs et scénarios de test
Indicateurs : effectif, absentéisme, retards, congés, formation, délai recrutement. Tests : employé consulte le dossier d'autrui, manager hors périmètre, pointage hors ligne, correction tardive.

Prévoir également des tests de permissions, données invalides, doublons, changements après validation, historique, fonctionnement mobile et réseau dégradé.

## 11. Critères d'acceptation du domaine
Réussite : améliorer le suivi sans surveillance excessive ni décision automatisée injustifiée.

Un dossier métier n'est considéré prêt pour fabrication que si le client a confirmé le problème, les rôles, les processus, les options, les données nécessaires, les règles critiques, les écrans prioritaires et les critères d'acceptation.