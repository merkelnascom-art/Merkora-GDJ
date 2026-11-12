# 4. Commerce, vente et e-commerce

## 1. Finalité et organisations concernées
Boutiques, grossistes, détaillants, vendeurs en ligne, distributeurs, réseaux de revendeurs et ventes via réseaux sociaux.

Le domaine est un référentiel métier : MerKora doit reconnaître les mots utilisés par les professionnels, mais surtout comprendre les opérations, les responsabilités, les exceptions et les résultats attendus. Un projet peut associer ce domaine à un ou plusieurs autres.

## 2. Catalogue de projets et fonctions possibles
Catalogue et variantes ; prix et promotions ; stock multi-dépôts ; caisse ; ventes et reçus ; commandes ; fournisseurs et achats ; retours ; livraison ; fidélité ; commissions revendeurs ; ventes en ligne ; rapports de marge.

Ce catalogue sert à inspirer et à clarifier. Il ne signifie pas que toutes ces fonctions sont incluses dans un devis ou activées dans une application.

## 3. Questionnaire métier adaptatif
MerKora commence par une question ouverte sur le problème. Puis il approfondit uniquement les inconnues qui influencent le périmètre :
Quels produits et variantes ? Vente en boutique, en ligne ou par revendeurs ? Combien de points de vente ? Comment se fait l'encaissement ? Qui modifie prix, remises, stock et annulations ? Comment traiter retours, crédit et livraison ?

Questions de relance génériques à adapter : « Comment faites-vous aujourd'hui ? », « Qu'est-ce qui échoue le plus souvent ? », « Qui doit intervenir ? », « Quelle preuve montre que l'opération est terminée ? », « Que doit-il se passer en cas d'erreur ou d'absence de réseau ? »

## 4. Parcours et processus de référence
Catalogue → disponibilité → commande/vente → réservation stock → paiement confirmé → préparation → livraison/retrait → facture/reçu → retour éventuel → clôture et rapprochement.

Pour chaque processus réel, MerKora doit documenter déclencheur, acteurs, entrées, étapes, décisions, exceptions, sorties, preuves et responsable. Les processus ci-dessus sont des modèles à adapter, pas des règles imposées.

## 5. Rôles et espaces
Administrateur, gérant, caissier, vendeur, magasinier, acheteur, livreur, revendeur, client, comptable/contrôleur.

Chaque rôle reçoit uniquement les écrans et actions nécessaires. Les espaces client et administrateur MerKora restent séparés de l'espace administrateur du logiciel construit pour le client.

## 6. Architecture et données métier
Produits, variantes, prix, stocks par site, mouvements, fournisseurs, commandes, lignes, ventes, paiements, clients, retours, livraisons, commissions.

Les objets définitifs doivent être conçus après validation des cas d'usage. Prévoir identifiants stables, historique, relations, provenance des données, règles de conservation et séparation des organisations. Ne pas collecter des champs « au cas où ».

## 7. Modules, options et intégrations
Options actuelles : clients/fidélité, fournisseurs/achats, promotions/tarifs, multi-boutiques. Intégrations : mobile money, passerelle paiement, WhatsApp/email, transporteur, boutique en ligne ; confirmation serveur requise.

Les capacités transversales (permissions, notifications, documents, paiements, rapports, audit, assistance, intégrations) sont proposées séparément et seulement si utiles. Toute connexion externe exige une vérification de disponibilité, coûts, sécurité, autorisations et solution de secours.

## 8. Règles métier et sécurité
Stock jamais modifié sans mouvement traçable ; remise et annulation selon droits ; paiement confirmé côté serveur ; prévention doublons ; retour lié à la vente ; commissions calculées selon règle versionnée.

Les règles locales, contrats, normes et obligations doivent être vérifiés avec des professionnels compétents avant usage réel. L'IA peut aider à expliquer et à préparer, mais ne doit pas se substituer aux autorités ou professionnels habilités.

## 9. Exemple complet de projet
Exemple : un réseau de revendeurs consulte un catalogue, prend une commande, l'admin valide le stock et confirme l'encaissement. La commission n'est due qu'après validation des conditions de vente.

## 10. Indicateurs et scénarios de test
Indicateurs : chiffre d'affaires, marge, rotation stock, panier moyen, taux retours, ventes par canal, créances. Tests : stock négatif, double webhook, retour partiel, prix modifié après commande.

Prévoir également des tests de permissions, données invalides, doublons, changements après validation, historique, fonctionnement mobile et réseau dégradé.

## 11. Critères d'acceptation du domaine
Réussite : rapprocher commandes, stock, argent et livraison sans écarts invisibles.

Un dossier métier n'est considéré prêt pour fabrication que si le client a confirmé le problème, les rôles, les processus, les options, les données nécessaires, les règles critiques, les écrans prioritaires et les critères d'acceptation.