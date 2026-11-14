# 2. Santé, médical et bien-être

## 1. Finalité et organisations concernées
Cabinets, cliniques, centres de soins, laboratoires, pharmacies, centres de rééducation et structures de bien-être.

Le domaine est un référentiel métier : MerKora doit reconnaître les mots utilisés par les professionnels, mais surtout comprendre les opérations, les responsabilités, les exceptions et les résultats attendus. Un projet peut associer ce domaine à un ou plusieurs autres.

## 2. Catalogue de projets et fonctions possibles
Rendez-vous et accueil ; files d'attente ; dossiers et documents autorisés ; équipes et spécialités ; prescriptions et examens uniquement selon habilitation ; résultats de laboratoire ; stocks et lots ; facturation administrative ; suivi de rendez-vous ; maintenance d'équipements ; gestion de centre de bien-être.

Ce catalogue sert à inspirer et à clarifier. Il ne signifie pas que toutes ces fonctions sont incluses dans un devis ou activées dans une application.

## 3. Questionnaire métier adaptatif
MerKora commence par une question ouverte sur le problème. Puis il approfondit uniquement les inconnues qui influencent le périmètre :
Quelle structure et quels services ? Qui sont les professionnels habilités ? Quelles données sont indispensables ? Qui peut voir quoi ? Quelles étapes nécessitent une validation clinique ? Comment gérer urgence, annulation et résultat corrigé ? Quels systèmes et obligations locales s'appliquent ?

Questions de relance génériques à adapter : « Comment faites-vous aujourd'hui ? », « Qu'est-ce qui échoue le plus souvent ? », « Qui doit intervenir ? », « Quelle preuve montre que l'opération est terminée ? », « Que doit-il se passer en cas d'erreur ou d'absence de réseau ? »

## 4. Parcours et processus de référence
Prise de rendez-vous → accueil/identification → orientation → consultation ou prestation → saisie par professionnel habilité → validation → suivi administratif → facturation et archivage selon règles.

Pour chaque processus réel, MerKora doit documenter déclencheur, acteurs, entrées, étapes, décisions, exceptions, sorties, preuves et responsable. Les processus ci-dessus sont des modèles à adapter, pas des règles imposées.

## 5. Rôles et espaces
Patient/client, accueil, praticien, infirmier, laboratoire, pharmacien, responsable, facturation, administrateur technique. Espaces et permissions séparés par rôle et spécialité.

Chaque rôle reçoit uniquement les écrans et actions nécessaires. Les espaces client et administrateur MerKora restent séparés de l'espace administrateur du logiciel construit pour le client.

## 6. Architecture et données métier
Patients, rendez-vous, professionnels, spécialités, consultations, documents, examens, résultats, produits, lots, stocks, factures, consentements et accès. Séparer données médicales et administratives.

Les objets définitifs doivent être conçus après validation des cas d'usage. Prévoir identifiants stables, historique, relations, provenance des données, règles de conservation et séparation des organisations. Ne pas collecter des champs « au cas où ».

## 7. Modules, options et intégrations
Options actuelles : professionnels/équipes, analyses/résultats, pharmacie/consommables, facturation. Intégrations potentielles : laboratoire, calendrier, paiement, SMS ; uniquement après audit des API, conformité et contrat.

Les capacités transversales (permissions, notifications, documents, paiements, rapports, audit, assistance, intégrations) sont proposées séparément et seulement si utiles. Toute connexion externe exige une vérification de disponibilité, coûts, sécurité, autorisations et solution de secours.

## 8. Règles métier et sécurité
Risque élevé. Confidentialité renforcée, minimisation, journal des accès, consentement, durée de conservation et procédures d'incident à définir selon pays. L'IA ne diagnostique pas, ne prescrit pas et ne remplace jamais un professionnel. Résultats cliniques et décisions validés par un professionnel autorisé.

Les règles locales, contrats, normes et obligations doivent être vérifiés avec des professionnels compétents avant usage réel. L'IA peut aider à expliquer et à préparer, mais ne doit pas se substituer aux autorités ou professionnels habilités.

## 9. Exemple complet de projet
Exemple : un centre médical utilise le système pour les rendez-vous, l'accueil et les résultats déposés par le laboratoire. Le patient reçoit une notification de disponibilité ; seul le professionnel habilité interprète et explique le résultat.

## 10. Indicateurs et scénarios de test
Indicateurs : délai d'attente, rendez-vous manqués, disponibilité des consommables, délais de transmission des résultats. Tests : accès refusé, patient homonyme, document erroné, urgence, panne réseau, correction tracée.

Prévoir également des tests de permissions, données invalides, doublons, changements après validation, historique, fonctionnement mobile et réseau dégradé.

## 11. Critères d'acceptation du domaine
Réussite : fluidifier l'administration sans exposer les données ni automatiser les décisions cliniques.

Un dossier métier n'est considéré prêt pour fabrication que si le client a confirmé le problème, les rôles, les processus, les options, les données nécessaires, les règles critiques, les écrans prioritaires et les critères d'acceptation.