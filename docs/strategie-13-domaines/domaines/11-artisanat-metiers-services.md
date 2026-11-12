# 11. Artisanat, métiers techniques et services

## 1. Finalité et organisations concernées
Artisans, menuisiers, couturiers, soudeurs, réparateurs, plombiers, électriciens, coiffeurs, salons, nettoyage, dépannage et prestataires à domicile.

Le domaine est un référentiel métier : MerKora doit reconnaître les mots utilisés par les professionnels, mais surtout comprendre les opérations, les responsabilités, les exceptions et les résultats attendus. Un projet peut associer ce domaine à un ou plusieurs autres.

## 2. Catalogue de projets et fonctions possibles
Catalogue de prestations ; demandes et devis ; rendez-vous ; interventions ; affectation techniciens ; commandes atelier ; matières et pièces ; étapes de fabrication ; photos avant/après ; validation client ; factures ; garanties et réclamations.

Ce catalogue sert à inspirer et à clarifier. Il ne signifie pas que toutes ces fonctions sont incluses dans un devis ou activées dans une application.

## 3. Questionnaire métier adaptatif
MerKora commence par une question ouverte sur le problème. Puis il approfondit uniquement les inconnues qui influencent le périmètre :
Quel métier exact ? Atelier, domicile ou les deux ? Sur commande ou stock ? Comment mesurer temps et matériaux ? Comment chiffrer un devis ? Qui intervient ? Comment prouver la fin et gérer une réserve ou garantie ?

Questions de relance génériques à adapter : « Comment faites-vous aujourd'hui ? », « Qu'est-ce qui échoue le plus souvent ? », « Qui doit intervenir ? », « Quelle preuve montre que l'opération est terminée ? », « Que doit-il se passer en cas d'erreur ou d'absence de réseau ? »

## 4. Parcours et processus de référence
Demande → qualification/photos → visite éventuelle → devis → accord → planification → intervention/fabrication → contrôle → preuve → validation client → facture → garantie.

Pour chaque processus réel, MerKora doit documenter déclencheur, acteurs, entrées, étapes, décisions, exceptions, sorties, preuves et responsable. Les processus ci-dessus sont des modèles à adapter, pas des règles imposées.

## 5. Rôles et espaces
Prestataire, artisan, chef d'atelier, technicien, planificateur, client, fournisseur, apprenti, comptable.

Chaque rôle reçoit uniquement les écrans et actions nécessaires. Les espaces client et administrateur MerKora restent séparés de l'espace administrateur du logiciel construit pour le client.

## 6. Architecture et données métier
Clients, prestations, demandes, devis, rendez-vous, ordres de travail, étapes, matériaux, temps passé, photos, validations, factures, garanties, réclamations.

Les objets définitifs doivent être conçus après validation des cas d'usage. Prévoir identifiants stables, historique, relations, provenance des données, règles de conservation et séparation des organisations. Ne pas collecter des champs « au cas où ».

## 7. Modules, options et intégrations
Options actuelles : catalogue prestataires, pièces/matériaux, preuve avant/après, garanties ; spécialisations atelier, domicile, services personnels. Intégrations : agenda, messagerie, paiement, cartographie, photos.

Les capacités transversales (permissions, notifications, documents, paiements, rapports, audit, assistance, intégrations) sont proposées séparément et seulement si utiles. Toute connexion externe exige une vérification de disponibilité, coûts, sécurité, autorisations et solution de secours.

## 8. Règles métier et sécurité
Devis accepté avant travaux ; supplément de prix validé ; photos avec accord ; signature ou confirmation de fin ; garantie selon contrat ; sécurité des techniciens et protection des adresses privées.

Les règles locales, contrats, normes et obligations doivent être vérifiés avec des professionnels compétents avant usage réel. L'IA peut aider à expliquer et à préparer, mais ne doit pas se substituer aux autorités ou professionnels habilités.

## 9. Exemple complet de projet
Exemple : un atelier de menuiserie reçoit une commande de placard, détaille dimensions, matériaux, étapes et acompte. Le client valide le plan et les changements avant fabrication.

## 10. Indicateurs et scénarios de test
Indicateurs : délai devis, taux acceptation, temps de réalisation, marge par intervention, reprises, réclamations. Tests : devis expiré, changement matériau, technicien absent, réserve client.

Prévoir également des tests de permissions, données invalides, doublons, changements après validation, historique, fonctionnement mobile et réseau dégradé.

## 11. Critères d'acceptation du domaine
Réussite : relier demande, estimation, travail réel, preuve, paiement et garantie.

Un dossier métier n'est considéré prêt pour fabrication que si le client a confirmé le problème, les rôles, les processus, les options, les données nécessaires, les règles critiques, les écrans prioritaires et les critères d'acceptation.