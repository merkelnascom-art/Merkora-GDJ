# 1. Sport, fitness et compétitions

## 1. Finalité et organisations concernées
Clubs amateurs/professionnels, salles de sport, coachs indépendants, fédérations, académies, organisateurs de tournois, centres de remise en forme.

Le domaine est un référentiel métier : MerKora doit reconnaître les mots utilisés par les professionnels, mais surtout comprendre les opérations, les responsabilités, les exceptions et les résultats attendus. Un projet peut associer ce domaine à un ou plusieurs autres.

## 2. Catalogue de projets et fonctions possibles
Adhésions et licences ; équipes et catégories ; coachs ; entraînements et calendriers ; terrains et équipements ; inscriptions aux compétitions ; arbitres et feuilles de match ; résultats et classements ; objectifs et progression ; cotisations ; boutique de matériel ; communication aux membres.

Ce catalogue sert à inspirer et à clarifier. Il ne signifie pas que toutes ces fonctions sont incluses dans un devis ou activées dans une application.

## 3. Questionnaire métier adaptatif
MerKora commence par une question ouverte sur le problème. Puis il approfondit uniquement les inconnues qui influencent le périmètre :
Quel sport et quelles disciplines ? Club, salle, fédération ou coach ? Qui sont les membres et leurs responsables légaux ? Quelles catégories d'âge et niveaux ? Comment inscrire, renouveler et payer ? Qui planifie les séances et valide les résultats ? Quels équipements et installations réserver ? Les données de performance sont-elles visibles par l'athlète, le coach ou les parents ?

Questions de relance génériques à adapter : « Comment faites-vous aujourd'hui ? », « Qu'est-ce qui échoue le plus souvent ? », « Qui doit intervenir ? », « Quelle preuve montre que l'opération est terminée ? », « Que doit-il se passer en cas d'erreur ou d'absence de réseau ? »

## 4. Parcours et processus de référence
Inscription → vérification → adhésion/licence → affectation à une équipe ou un programme → planning → présence → compétition/séance → saisie du résultat → validation par responsable → rapport et renouvellement.

Pour chaque processus réel, MerKora doit documenter déclencheur, acteurs, entrées, étapes, décisions, exceptions, sorties, preuves et responsable. Les processus ci-dessus sont des modèles à adapter, pas des règles imposées.

## 5. Rôles et espaces
Direction, secrétaire, coach, athlète, parent/tuteur, arbitre, trésorier, gestionnaire d'installation. Écrans : accueil, membres, équipes, calendrier, séances, compétitions, résultats, cotisations, rapports.

Chaque rôle reçoit uniquement les écrans et actions nécessaires. Les espaces client et administrateur MerKora restent séparés de l'espace administrateur du logiciel construit pour le client.

## 6. Architecture et données métier
Membres, équipes, catégories, disciplines, licences, coachs, installations, séances, inscriptions, rencontres, résultats, paiements, incidents. Relations temporelles pour saisons et historiques.

Les objets définitifs doivent être conçus après validation des cas d'usage. Prévoir identifiants stables, historique, relations, provenance des données, règles de conservation et séparation des organisations. Ne pas collecter des champs « au cas où ».

## 7. Modules, options et intégrations
Options actuelles : coachs et encadrement, terrains/équipements, cotisations/licences, progression/performance. Transversales selon besoin : rôles, notifications, documents, paiement, rapports, audit, support. Intégrations possibles : calendrier, paiement, QR d'accès, messagerie ; vérifier fournisseurs et connectivité.

Les capacités transversales (permissions, notifications, documents, paiements, rapports, audit, assistance, intégrations) sont proposées séparément et seulement si utiles. Toute connexion externe exige une vérification de disponibilité, coûts, sécurité, autorisations et solution de secours.

## 8. Règles métier et sécurité
Règles : âge/catégorie, capacité, prérequis de licence, clôture d'inscription, annulation, validation des résultats, règles de compétition. Sécurité : données des mineurs, autorisations parentales, visibilité limitée des performances et données physiques ; pas de diagnostic médical automatique.

Les règles locales, contrats, normes et obligations doivent être vérifiés avec des professionnels compétents avant usage réel. L'IA peut aider à expliquer et à préparer, mais ne doit pas se substituer aux autorités ou professionnels habilités.

## 9. Exemple complet de projet
Exemple : une académie de football suit 180 jeunes, les groupes, les présences, les cotisations et les matchs. Le coach saisit le score ; le responsable valide avant publication. Les parents ne voient que les informations autorisées de leur enfant.

## 10. Indicateurs et scénarios de test
Indicateurs : renouvellement, présence, taux de paiement, occupation des installations, participation, progression définie par les responsables. Tests : doublon de licence, changement d'équipe, séance annulée, résultat corrigé, parent sans autorisation.

Prévoir également des tests de permissions, données invalides, doublons, changements après validation, historique, fonctionnement mobile et réseau dégradé.

## 11. Critères d'acceptation du domaine
Réussite : un membre est suivi de l'inscription à la saison et les décisions sportives restent validées par les personnes habilitées.

Un dossier métier n'est considéré prêt pour fabrication que si le client a confirmé le problème, les rôles, les processus, les options, les données nécessaires, les règles critiques, les écrans prioritaires et les critères d'acceptation.