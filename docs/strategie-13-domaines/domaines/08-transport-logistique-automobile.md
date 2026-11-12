# 8. Transport, logistique et automobile

## 1. Finalité et organisations concernées
Transporteurs, taxis, bus, livraison, transit, entrepôts, gestionnaires de flotte, garages et ateliers automobiles.

Le domaine est un référentiel métier : MerKora doit reconnaître les mots utilisés par les professionnels, mais surtout comprendre les opérations, les responsabilités, les exceptions et les résultats attendus. Un projet peut associer ce domaine à un ou plusieurs autres.

## 2. Catalogue de projets et fonctions possibles
Demandes de transport ; réservation de trajet ; affectation chauffeur/véhicule ; tournées ; colis et expéditions ; suivi statuts ; preuve de livraison ; carburant ; entretien ; pièces ; devis garage ; incidents ; documents véhicules.

Ce catalogue sert à inspirer et à clarifier. Il ne signifie pas que toutes ces fonctions sont incluses dans un devis ou activées dans une application.

## 3. Questionnaire métier adaptatif
MerKora commence par une question ouverte sur le problème. Puis il approfondit uniquement les inconnues qui influencent le périmètre :
Transport de personnes, marchandises ou maintenance ? Combien de véhicules/chauffeurs ? Quelles zones et contraintes horaires ? Comment affecter et prouver une livraison ? Quelles données de géolocalisation sont réellement nécessaires ?

Questions de relance génériques à adapter : « Comment faites-vous aujourd'hui ? », « Qu'est-ce qui échoue le plus souvent ? », « Qui doit intervenir ? », « Quelle preuve montre que l'opération est terminée ? », « Que doit-il se passer en cas d'erreur ou d'absence de réseau ? »

## 4. Parcours et processus de référence
Demande → devis/réservation → planification → affectation → prise en charge → suivi → livraison/course/intervention → preuve → facturation → maintenance et analyse.

Pour chaque processus réel, MerKora doit documenter déclencheur, acteurs, entrées, étapes, décisions, exceptions, sorties, preuves et responsable. Les processus ci-dessus sont des modèles à adapter, pas des règles imposées.

## 5. Rôles et espaces
Dispatcher, chauffeur, client, magasinier, livreur, mécanicien, gestionnaire flotte, responsable logistique.

Chaque rôle reçoit uniquement les écrans et actions nécessaires. Les espaces client et administrateur MerKora restent séparés de l'espace administrateur du logiciel construit pour le client.

## 6. Architecture et données métier
Véhicules, conducteurs, documents, missions, trajets, colis, arrêts, preuves, carburant, entretiens, pièces, incidents, coûts.

Les objets définitifs doivent être conçus après validation des cas d'usage. Prévoir identifiants stables, historique, relations, provenance des données, règles de conservation et séparation des organisations. Ne pas collecter des champs « au cas où ».

## 7. Modules, options et intégrations
Options actuelles : commandes/expéditions, itinéraires, carburant/coûts, suivi client. Intégrations : cartographie, GPS, SMS, paiement, scanner/QR, transporteurs partenaires.

Les capacités transversales (permissions, notifications, documents, paiements, rapports, audit, assistance, intégrations) sont proposées séparément et seulement si utiles. Toute connexion externe exige une vérification de disponibilité, coûts, sécurité, autorisations et solution de secours.

## 8. Règles métier et sécurité
Géolocalisation seulement avec finalité, durée et information appropriées. Vérifier permis, assurances et documents. Une livraison n'est terminée qu'avec preuve ou exception validée. Les itinéraires proposés restent ajustables par l'opérateur.

Les règles locales, contrats, normes et obligations doivent être vérifiés avec des professionnels compétents avant usage réel. L'IA peut aider à expliquer et à préparer, mais ne doit pas se substituer aux autorités ou professionnels habilités.

## 9. Exemple complet de projet
Exemple : une société affecte 12 motos à des livreurs. Les tournées sont regroupées, chaque livraison produit une preuve et les dépenses de carburant sont rapprochées par véhicule.

## 10. Indicateurs et scénarios de test
Indicateurs : ponctualité, coût par livraison, taux de réussite, kilomètres, consommation, immobilisation flotte. Tests : panne, colis manquant, absence réseau, chauffeur remplacé, preuve contestée.

Prévoir également des tests de permissions, données invalides, doublons, changements après validation, historique, fonctionnement mobile et réseau dégradé.

## 11. Critères d'acceptation du domaine
Réussite : rendre les opérations visibles du dispatch à la preuve de service, en restant utilisable sur le terrain.

Un dossier métier n'est considéré prêt pour fabrication que si le client a confirmé le problème, les rôles, les processus, les options, les données nécessaires, les règles critiques, les écrans prioritaires et les critères d'acceptation.