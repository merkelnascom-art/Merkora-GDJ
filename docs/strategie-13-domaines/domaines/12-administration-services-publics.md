# 12. Administration, vie citoyenne et services publics

## 1. Finalité et organisations concernées
Mairies, communes, administrations, collectivités, guichets, services de démarches, signalements et programmes publics.

Le domaine est un référentiel métier : MerKora doit reconnaître les mots utilisés par les professionnels, mais surtout comprendre les opérations, les responsabilités, les exceptions et les résultats attendus. Un projet peut associer ce domaine à un ou plusieurs autres.

## 2. Catalogue de projets et fonctions possibles
Portail citoyen ; rendez-vous et files ; demandes de documents ; dépôt de pièces ; instruction ; correspondances ; archives ; frais et reçus ; signalements ; interventions municipales ; suivi des travaux et informations publiques.

Ce catalogue sert à inspirer et à clarifier. Il ne signifie pas que toutes ces fonctions sont incluses dans un devis ou activées dans une application.

## 3. Questionnaire métier adaptatif
MerKora commence par une question ouverte sur le problème. Puis il approfondit uniquement les inconnues qui influencent le périmètre :
Quelle administration et compétence ? Quels services sont numérisés ? Quelles pièces et étapes ? Comment vérifier identité et authenticité ? Qui instruit et signe ? Quel parcours au guichet pour les personnes non connectées ? Quelles obligations d'archives et délais ?

Questions de relance génériques à adapter : « Comment faites-vous aujourd'hui ? », « Qu'est-ce qui échoue le plus souvent ? », « Qui doit intervenir ? », « Quelle preuve montre que l'opération est terminée ? », « Que doit-il se passer en cas d'erreur ou d'absence de réseau ? »

## 4. Parcours et processus de référence
Demande → accusé réception → vérification pièces par agent → instruction → avis/validation habilitée → décision officielle → notification → délivrance/archivage ; signalement → affectation → intervention → clôture contrôlée.

Pour chaque processus réel, MerKora doit documenter déclencheur, acteurs, entrées, étapes, décisions, exceptions, sorties, preuves et responsable. Les processus ci-dessus sont des modèles à adapter, pas des règles imposées.

## 5. Rôles et espaces
Citoyen, agent d'accueil, instructeur, superviseur, signataire habilité, archiviste, responsable service, auditeur.

Chaque rôle reçoit uniquement les écrans et actions nécessaires. Les espaces client et administrateur MerKora restent séparés de l'espace administrateur du logiciel construit pour le client.

## 6. Architecture et données métier
Citoyens, dossiers, pièces, rendez-vous, étapes, agents, décisions, actes, correspondances, frais, reçus, signalements, interventions, archives.

Les objets définitifs doivent être conçus après validation des cas d'usage. Prévoir identifiants stables, historique, relations, provenance des données, règles de conservation et séparation des organisations. Ne pas collecter des champs « au cas où ».

## 7. Modules, options et intégrations
Options actuelles : rendez-vous/files, frais/reçus, archives/correspondances, inspections/travaux publics ; spécialisations état civil et services municipaux. Intégrations : identité ou paiement uniquement par accords et APIs officielles.

Les capacités transversales (permissions, notifications, documents, paiements, rapports, audit, assistance, intégrations) sont proposées séparément et seulement si utiles. Toute connexion externe exige une vérification de disponibilité, coûts, sécurité, autorisations et solution de secours.

## 8. Règles métier et sécurité
Risque élevé : aucun acte officiel ni décision d'éligibilité émis automatiquement sans validation habilitée. Journal des consultations et modifications, contrôle d'identité, archivage, accessibilité, canal physique et procédure de recours.

Les règles locales, contrats, normes et obligations doivent être vérifiés avec des professionnels compétents avant usage réel. L'IA peut aider à expliquer et à préparer, mais ne doit pas se substituer aux autorités ou professionnels habilités.

## 9. Exemple complet de projet
Exemple : un citoyen dépose une demande de document et reçoit un numéro de suivi. L'agent contrôle les pièces et le responsable habilité signe la décision. La plateforme informe le citoyen sans se substituer à l'autorité.

## 10. Indicateurs et scénarios de test
Indicateurs : délais de traitement, dossiers incomplets, files, demandes résolues, disponibilité guichet. Tests : usurpation, pièce falsifiée signalée, dossier incomplet, accès non habilité, panne du portail.

Prévoir également des tests de permissions, données invalides, doublons, changements après validation, historique, fonctionnement mobile et réseau dégradé.

## 11. Critères d'acceptation du domaine
Réussite : améliorer l'accès et la traçabilité du service public sans transférer le pouvoir de décision à l'algorithme.

Un dossier métier n'est considéré prêt pour fabrication que si le client a confirmé le problème, les rôles, les processus, les options, les données nécessaires, les règles critiques, les écrans prioritaires et les critères d'acceptation.