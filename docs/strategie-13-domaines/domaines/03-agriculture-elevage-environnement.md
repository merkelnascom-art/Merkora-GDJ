# 3. Agriculture, élevage et environnement

## 1. Finalité et organisations concernées
Exploitations, coopératives, éleveurs, pêcheurs, transformateurs, distributeurs d'intrants, associations environnementales et services de suivi des ressources.

Le domaine est un référentiel métier : MerKora doit reconnaître les mots utilisés par les professionnels, mais surtout comprendre les opérations, les responsabilités, les exceptions et les résultats attendus. Un projet peut associer ce domaine à un ou plusieurs autres.

## 2. Catalogue de projets et fonctions possibles
Parcelles et campagnes ; semences et intrants ; calendrier cultural ; irrigation et traitements ; élevage et alimentation ; suivi sanitaire animal consigné ; récoltes et qualité ; transformation ; stockage ; ventes ; matériel et maintenance ; collecte des déchets et suivi environnemental.

Ce catalogue sert à inspirer et à clarifier. Il ne signifie pas que toutes ces fonctions sont incluses dans un devis ou activées dans une application.

## 3. Questionnaire métier adaptatif
MerKora commence par une question ouverte sur le problème. Puis il approfondit uniquement les inconnues qui influencent le périmètre :
Quelle production, espèce ou ressource ? Quelles parcelles/sites et saisons ? Quelles opérations et intrants ? Quelles unités de mesure ? Quelles contraintes météo, eau, transport ou réseau ? Qui enregistre et valide les traitements, pertes et récoltes ?

Questions de relance génériques à adapter : « Comment faites-vous aujourd'hui ? », « Qu'est-ce qui échoue le plus souvent ? », « Qui doit intervenir ? », « Quelle preuve montre que l'opération est terminée ? », « Que doit-il se passer en cas d'erreur ou d'absence de réseau ? »

## 4. Parcours et processus de référence
Préparation → planification campagne → achat intrants → opérations terrain → journal de culture/élevage → récolte/collecte → contrôle qualité → stockage/transformation → vente et traçabilité.

Pour chaque processus réel, MerKora doit documenter déclencheur, acteurs, entrées, étapes, décisions, exceptions, sorties, preuves et responsable. Les processus ci-dessus sont des modèles à adapter, pas des règles imposées.

## 5. Rôles et espaces
Exploitant, chef de parcelle, ouvrier, vétérinaire/conseiller habilité, magasinier, coopérative, acheteur, responsable environnemental.

Chaque rôle reçoit uniquement les écrans et actions nécessaires. Les espaces client et administrateur MerKora restent séparés de l'espace administrateur du logiciel construit pour le client.

## 6. Architecture et données métier
Exploitations, parcelles, cultures, campagnes, animaux/lots, intrants, interventions, observations, récoltes, stocks, acheteurs, équipements, incidents environnementaux.

Les objets définitifs doivent être conçus après validation des cas d'usage. Prévoir identifiants stables, historique, relations, provenance des données, règles de conservation et séparation des organisations. Ne pas collecter des champs « au cas où ».

## 7. Modules, options et intégrations
Options actuelles : parcelles/cartes, élevage, récoltes/ventes, maintenance matériel. Intégrations : météo, cartographie, balances, capteurs, paiement, SMS ; prévoir saisie hors ligne et synchronisation.

Les capacités transversales (permissions, notifications, documents, paiements, rapports, audit, assistance, intégrations) sont proposées séparément et seulement si utiles. Toute connexion externe exige une vérification de disponibilité, coûts, sécurité, autorisations et solution de secours.

## 8. Règles métier et sécurité
Ne pas transformer une recommandation agronomique ou vétérinaire en prescription. Traçabilité des produits utilisés, unités, dates et opérateurs. Gestion des coordonnées géographiques et consentement. Les alertes météo/santé doivent indiquer leur source et leur date.

Les règles locales, contrats, normes et obligations doivent être vérifiés avec des professionnels compétents avant usage réel. L'IA peut aider à expliquer et à préparer, mais ne doit pas se substituer aux autorités ou professionnels habilités.

## 9. Exemple complet de projet
Exemple : une coopérative suit 40 producteurs de maïs, les superficies, semences distribuées, interventions et volumes livrés. Les données terrain sont saisies hors connexion puis synchronisées au dépôt.

## 10. Indicateurs et scénarios de test
Indicateurs : rendement par parcelle, coût par campagne, pertes, délais de synchronisation, consommation d'intrants, volumes commercialisés. Tests : saison chevauchante, parcelle modifiée, lot rappelé, saisie hors ligne.

Prévoir également des tests de permissions, données invalides, doublons, changements après validation, historique, fonctionnement mobile et réseau dégradé.

## 11. Critères d'acceptation du domaine
Réussite : disposer d'une traçabilité de la production jusqu'à la vente malgré les contraintes du terrain.

Un dossier métier n'est considéré prêt pour fabrication que si le client a confirmé le problème, les rôles, les processus, les options, les données nécessaires, les règles critiques, les écrans prioritaires et les critères d'acceptation.