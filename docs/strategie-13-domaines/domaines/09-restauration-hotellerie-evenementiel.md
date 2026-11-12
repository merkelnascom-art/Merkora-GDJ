# 9. Restauration, hôtellerie et événementiel

## 1. Finalité et organisations concernées
Restaurants, bars, hôtels, maisons d'hôtes, traiteurs, organisateurs d'événements et lieux de loisirs.

Le domaine est un référentiel métier : MerKora doit reconnaître les mots utilisés par les professionnels, mais surtout comprendre les opérations, les responsabilités, les exceptions et les résultats attendus. Un projet peut associer ce domaine à un ou plusieurs autres.

## 2. Catalogue de projets et fonctions possibles
Réservations de tables/chambres ; menus ; commandes ; cuisine ; stocks ingrédients ; achats ; hygiène et allergènes ; ménage ; événements ; invités ; billets ; accès ; prestataires ; facturation et clôture.

Ce catalogue sert à inspirer et à clarifier. Il ne signifie pas que toutes ces fonctions sont incluses dans un devis ou activées dans une application.

## 3. Questionnaire métier adaptatif
MerKora commence par une question ouverte sur le problème. Puis il approfondit uniquement les inconnues qui influencent le périmètre :
Quel établissement ou événement ? Tables/chambres/capacités ? Quels services et horaires ? Comment gérer réservation, acompte, annulation et no-show ? Qui suit cuisine, ménage, invités et fournisseurs ?

Questions de relance génériques à adapter : « Comment faites-vous aujourd'hui ? », « Qu'est-ce qui échoue le plus souvent ? », « Qui doit intervenir ? », « Quelle preuve montre que l'opération est terminée ? », « Que doit-il se passer en cas d'erreur ou d'absence de réseau ? »

## 4. Parcours et processus de référence
Demande → disponibilité → réservation → confirmation éventuelle → accueil → service/commande → paiement → clôture ; pour événement : programmation → billetterie → contrôle accès → bilan.

Pour chaque processus réel, MerKora doit documenter déclencheur, acteurs, entrées, étapes, décisions, exceptions, sorties, preuves et responsable. Les processus ci-dessus sont des modèles à adapter, pas des règles imposées.

## 5. Rôles et espaces
Réception, serveur, cuisine, chef, gouvernante, gestionnaire, client, organisateur, sécurité, prestataire, comptable.

Chaque rôle reçoit uniquement les écrans et actions nécessaires. Les espaces client et administrateur MerKora restent séparés de l'espace administrateur du logiciel construit pour le client.

## 6. Architecture et données métier
Tables, chambres, créneaux, réservations, clients, commandes, recettes, ingrédients, lots, allergènes, chambres nettoyées, événements, billets, invités, paiements.

Les objets définitifs doivent être conçus après validation des cas d'usage. Prévoir identifiants stables, historique, relations, provenance des données, règles de conservation et séparation des organisations. Ne pas collecter des champs « au cas où ».

## 7. Modules, options et intégrations
Options actuelles : tables/chambres/capacités, menus/commandes, invités/accès événement, hygiène/traçabilité. Intégrations : paiement, calendrier, canaux réservation, QR billets, messagerie.

Les capacités transversales (permissions, notifications, documents, paiements, rapports, audit, assistance, intégrations) sont proposées séparément et seulement si utiles. Toute connexion externe exige une vérification de disponibilité, coûts, sécurité, autorisations et solution de secours.

## 8. Règles métier et sécurité
Capacités et disponibilités cohérentes ; allergènes et informations alimentaires vérifiés par l'établissement ; annulation et remboursement selon politique ; billets uniques et contrôle anti-duplication.

Les règles locales, contrats, normes et obligations doivent être vérifiés avec des professionnels compétents avant usage réel. L'IA peut aider à expliquer et à préparer, mais ne doit pas se substituer aux autorités ou professionnels habilités.

## 9. Exemple complet de projet
Exemple : un hôtel suit chambres, réservations et ménage. Une chambre ne redevient disponible qu'après validation du nettoyage. Le restaurant du même établissement suit commandes et consommation de stock.

## 10. Indicateurs et scénarios de test
Indicateurs : taux d'occupation, couverts, no-show, rotation, coût matière, ventes événement, incidents d'accès. Tests : réservation concurrente, annulation, billet dupliqué, chambre indisponible.

Prévoir également des tests de permissions, données invalides, doublons, changements après validation, historique, fonctionnement mobile et réseau dégradé.

## 11. Critères d'acceptation du domaine
Réussite : synchroniser réservation, opération sur place, capacité, paiement et qualité de service.

Un dossier métier n'est considéré prêt pour fabrication que si le client a confirmé le problème, les rôles, les processus, les options, les données nécessaires, les règles critiques, les écrans prioritaires et les critères d'acceptation.