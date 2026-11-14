# 5. Entrepreneuriat, finance et gestion d'entreprise

## 1. Finalité et organisations concernées
TPE/PME, entrepreneurs, directions, consultants, gestionnaires, associations et structures multi-sites.

Le domaine est un référentiel métier : MerKora doit reconnaître les mots utilisés par les professionnels, mais surtout comprendre les opérations, les responsabilités, les exceptions et les résultats attendus. Un projet peut associer ce domaine à un ou plusieurs autres.

## 2. Catalogue de projets et fonctions possibles
Budget prévisionnel/réalisé ; trésorerie ; recettes et dépenses ; justificatifs ; caisse et banques ; dettes et créances ; facturation ; marges et rentabilité ; suivi par activité ; rapports hebdomadaires/mensuels ; scénarios ; contrôle budgétaire.

Ce catalogue sert à inspirer et à clarifier. Il ne signifie pas que toutes ces fonctions sont incluses dans un devis ou activées dans une application.

## 3. Questionnaire métier adaptatif
MerKora commence par une question ouverte sur le problème. Puis il approfondit uniquement les inconnues qui influencent le périmètre :
Quelle activité et période ? Quelles sources de recettes et catégories de dépenses ? Quelle méthode de saisie et quelles pièces ? Qui saisit, contrôle et valide ? Quels rapports et indicateurs ? Comptabilité officielle ou pilotage de gestion ?

Questions de relance génériques à adapter : « Comment faites-vous aujourd'hui ? », « Qu'est-ce qui échoue le plus souvent ? », « Qui doit intervenir ? », « Quelle preuve montre que l'opération est terminée ? », « Que doit-il se passer en cas d'erreur ou d'absence de réseau ? »

## 4. Parcours et processus de référence
Saisie mouvement → justificatif → catégorisation → validation → rapprochement → calcul indicateurs → analyse des écarts → rapport → décision de gestion documentée.

Pour chaque processus réel, MerKora doit documenter déclencheur, acteurs, entrées, étapes, décisions, exceptions, sorties, preuves et responsable. Les processus ci-dessus sont des modèles à adapter, pas des règles imposées.

## 5. Rôles et espaces
Dirigeant, responsable financier, comptable, caissier, chef de service, auditeur, lecteur de rapport.

Chaque rôle reçoit uniquement les écrans et actions nécessaires. Les espaces client et administrateur MerKora restent séparés de l'espace administrateur du logiciel construit pour le client.

## 6. Architecture et données métier
Comptes/catégories, budgets, transactions, pièces, factures, clients/fournisseurs, échéances, centres de coûts, rapprochements, rapports, validations.

Les objets définitifs doivent être conçus après validation des cas d'usage. Prévoir identifiants stables, historique, relations, provenance des données, règles de conservation et séparation des organisations. Ne pas collecter des champs « au cas où ».

## 7. Modules, options et intégrations
Options actuelles : dépenses/justificatifs, prévisions de trésorerie, rentabilité, dettes/créances. Intégrations : banque ou paiement si API autorisée, tableurs, facturation et exports.

Les capacités transversales (permissions, notifications, documents, paiements, rapports, audit, assistance, intégrations) sont proposées séparément et seulement si utiles. Toute connexion externe exige une vérification de disponibilité, coûts, sécurité, autorisations et solution de secours.

## 8. Règles métier et sécurité
Ne pas inventer de chiffres ni confondre trésorerie, chiffre d'affaires, bénéfice et solde bancaire. Chaque rapport indique période, source, méthode et données manquantes. Séparer pilotage de gestion et comptabilité réglementaire.

Les règles locales, contrats, normes et obligations doivent être vérifiés avec des professionnels compétents avant usage réel. L'IA peut aider à expliquer et à préparer, mais ne doit pas se substituer aux autorités ou professionnels habilités.

## 9. Exemple complet de projet
Exemple : un dirigeant reçoit chaque semaine les recettes, dépenses par catégorie, solde de caisse, créances, factures impayées et écarts au budget. Les transactions non justifiées sont marquées à vérifier, pas masquées.

## 10. Indicateurs et scénarios de test
Indicateurs : trésorerie disponible, marge, charges fixes/variables, créances échues, budget réalisé, couverture des dépenses. Tests : doublon, dépense non justifiée, période clôturée, correction rétroactive tracée.

Prévoir également des tests de permissions, données invalides, doublons, changements après validation, historique, fonctionnement mobile et réseau dégradé.

## 11. Critères d'acceptation du domaine
Réussite : donner une image financière compréhensible et vérifiable pour décider, sans présenter une estimation comme une certification comptable.

Un dossier métier n'est considéré prêt pour fabrication que si le client a confirmé le problème, les rôles, les processus, les options, les données nécessaires, les règles critiques, les écrans prioritaires et les critères d'acceptation.