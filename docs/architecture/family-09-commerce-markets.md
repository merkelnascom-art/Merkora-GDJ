# Fondation A — Famille 09 : Commerce et marchés

**Version :** 1.0 — 16 novembre 2026  
**Identifiant :** `family:commerce-markets`  
**Catalogue initial :** 90 concepts bilingues FR/EN  
**Statut :** branche de travail ; contrôles automatisés et revue métier à effectuer avant fusion.

## 1. Périmètre et frontières

La famille couvre les activités de mise sur le marché, de commercialisation, de vente, de relation client et de distribution commerciale : commerce de détail, commerce de gros, commerce électronique, places de marché, réseaux de vente, franchises, marchandisage, marketing commercial, tarification, promotions et fidélisation.

Elle réutilise cinq domaines canoniques :
- `domain:retail-trade` — commerce de détail ;
- `domain:wholesale-trade` — commerce de gros ;
- `domain:e-commerce` — commerce électronique ;
- `domain:sales-distribution` — vente et distribution commerciale ;
- `domain:marketing-advertising` — marketing et publicité.

**Frontière avec la Famille 08 — Logistique et chaîne d'approvisionnement :** la Famille 09 traite l'offre, les canaux de vente, la relation commerciale et la transaction. La Famille 08 traite les achats fournisseurs, l'entreposage, les stocks, la préparation, le transit et la coordination de livraison. La distribution commerciale et la distribution physique des marchandises ne sont donc pas synonymes.

**Frontières comptables et financières :** une vente, un encaissement, une facture, un mouvement bancaire, une écriture comptable, le chiffre d'affaires, la marge et le bénéfice sont des objets différents. Ils peuvent être reliés dans un système mais ne doivent jamais être fusionnés dans le modèle de données.

## 2. Sous-domaines et spécialisations

Le socle couvre le magasin physique, le commerce de gros, la vente en ligne, les places de marché, la caisse, les réseaux de distribution commerciale, B2B, B2C, vente directe, commerce social, omnicanal, franchise, marchandisage, trade marketing, relation client, prix et promotions, assortiment et représentation commerciale. Il inclut également le commerce par abonnement et les études de marché/connaissance client comme sous-domaines distincts.

Spécialisations initiales : commerce alimentaire, mode et habillement, électronique, pharmacie, automobile et pièces, matériaux de construction, intrants agricoles. Les produits réglementés et activités professionnelles restent soumis aux autorisations et règles du pays.

## 3. Métiers, activités et processus

Métiers : responsable de magasin, vendeur, caissier, commercial grossiste, responsable commercial, chargé de clientèle, responsable e-commerce, gestionnaire de marketplace, marchandiseur, conseiller service client, responsable marketing et animateur de réseau de franchise.

Activités : vente, encaissement, facturation, prospection, devis, gestion de catalogue, définition des prix, promotions, assistance client, présentation produits, fidélisation et rapprochement/clôture de caisse.

Processus : prospect à commande ; devis à encaissement ; passage en caisse ; commande en ligne ; intégration d'un vendeur partenaire ; retours et réclamations ; campagne à conversion ; déploiement d'une franchise.

## 4. Problèmes, ressources, fonctions et indicateurs

Problèmes initiaux : écart de caisse, faible conversion, perte de clients, incohérence tarifaire, fiches produits incomplètes, abandon de commande, ventes mal enregistrées, réclamations en attente, silos entre canaux et remises non autorisées.

Ressources : produit/offre, compte client, devis, commande commerciale, campagne promotionnelle, compte de fidélité, session et journal de caisse.

Fonctions numériques : caisse/point de vente, CRM, catalogue multicanal, pipeline commercial, tarification et promotions, gestion de marketplace, analyse des ventes.

Indicateurs : chiffre d'affaires, panier moyen, taux de conversion, taux de réachat, taux de marge commerciale, taux de retours/remboursements et satisfaction client. Chaque indicateur doit préciser son périmètre, sa formule, sa période, sa source et ses exclusions.

## 5. Questionnaire adaptatif — une question à la fois

1. Quel type d'activité commerciale est exercé : magasin, grossiste, vente en ligne, marketplace, réseau de revendeurs, vente directe ou activité mixte ?
2. Que vend-on : produits, services, abonnements, biens réglementés ou offres personnalisées ?
3. À qui : consommateurs, entreprises, administrations, revendeurs ou plusieurs segments ?
4. Par quels canaux : boutique, agents, téléphone, WhatsApp, site web, application, marketplace ou réseaux sociaux ?
5. Comment le client découvre-t-il l'offre, demande un prix, commande et confirme son achat ?
6. Comment sont gérés les prix, remises, taxes paramétrées, devis, factures, paiements et remboursements ? Distinguer les étapes réellement pratiquées.
7. Comment sont enregistrées les ventes, les retours, les échanges et les réclamations ?
8. Comment les clients sont-ils identifiés, accompagnés et fidélisés ? Quelles données sont réellement nécessaires ?
9. Quels sont les volumes, périodes de pointe, équipes, magasins, vendeurs, références et canaux ?
10. Quels outils existent déjà : caisse, tableur, ERP, CRM, site, terminaux, moyens de paiement et outils de comptabilité ?
11. Quel problème prioritaire doit être résolu : visibilité des ventes, suivi des vendeurs, caisse, fidélisation, prix, catalogue, commandes ou analyse ?
12. Présenter la synthèse des faits, hypothèses et recommandations et demander la validation des règles critiques.

Le moteur pose chaque question dans un sous-écran distinct, enregistre les réponses validées et adapte la question suivante à la clarté des informations.

## 6. Parcours opérationnel et écrans

Parcours générique : découverte de l'offre → demande d'information/devis → négociation éventuelle → commande/vente → paiement ou modalités de paiement → justificatif/facture selon règles → remise ou exécution coordonnée avec la Famille 08 → service après-vente → fidélisation et analyse.

Écrans possibles :
- tableau de bord ventes et activité ;
- points de vente, équipes et vendeurs ;
- catalogue produits/services et variantes ;
- tarifs, taxes configurées et promotions ;
- panier, caisse, ventes et clôtures ;
- clients, comptes et historique de relation ;
- prospects, opportunités, devis et commandes ;
- commandes web et canaux omnicanaux ;
- vendeurs partenaires et marketplace ;
- campagnes, fidélité et coupons ;
- retours, échanges et réclamations ;
- rapports, indicateurs et exports ;
- paramètres, rôles, permissions et audit.

## 7. Architecture de données possible

Entités : organisation, point de vente, canal, vendeur, client, segment client, produit, service, variante, assortiment, prix, règle tarifaire, promotion, campagne, panier, ligne de panier, vente, ligne de vente, devis, commande commerciale, facture référencée, paiement référencé, remboursement, session de caisse, mouvement de caisse, clôture, prospect, opportunité, interaction client, réclamation, retour, programme de fidélité, compte de fidélité, coupon, avis et indicateur.

Principes :
- vente et paiement ont des statuts et horodatages indépendants ;
- facture et vente restent liées sans être la même entité ;
- le chiffre d'affaires est calculé selon des règles définies et ne se confond pas avec les encaissements ;
- marge et bénéfice requièrent des coûts fiables et une définition comptable ;
- les remises et annulations nécessitent des autorisations et motifs ;
- conserver un historique des prix et conditions appliqués ;
- isoler les données par organisation et point de vente ;
- journaliser les opérations sensibles et éviter les suppressions historiques.

## 8. Intégrations et équipements

Selon le besoin : terminaux de point de vente, lecteurs de codes-barres, imprimantes de reçus, balances, terminaux mobiles, moyens de paiement locaux, plateformes e-commerce, marketplaces, CRM, ERP, comptabilité, facturation électronique lorsque disponible, SMS/e-mail/WhatsApp, outils d'analyse et services de fidélité.

Toute intégration doit être évaluée selon pays, couverture, frais, API, sécurité, disponibilité, autorisations et qualité des données. Ne jamais présumer qu'un prestataire de paiement ou une API est disponible dans un pays donné.

## 9. Règles métier

- Distinguer client, prospect, vendeur, distributeur, revendeur et opérateur de marketplace.
- Distinguer commerce de détail, commerce de gros et commerce électronique ; un même commerçant peut exercer plusieurs activités.
- Une commande n'est pas nécessairement une vente finalisée.
- Une vente n'est pas un paiement ; un paiement peut être partiel, différé, fractionné ou remboursé.
- Une facture est un document avec des exigences locales ; ne pas inventer son contenu réglementaire.
- Une remise doit être soumise à des droits, limites, périodes et motifs définis.
- Une annulation, un échange et un remboursement sont des événements différents.
- Les stocks et la préparation relèvent de la Famille 08 ; le commerce ne doit pas créer une seconde vérité sur les quantités.
- Les commissions de vendeurs et plateformes nécessitent des règles transparentes et vérifiables.
- Les calculs de chiffre d'affaires, marge et conversion doivent expliciter leurs bases et exclusions.

## 10. Sécurité, conformité et précautions

Appliquer le moindre privilège aux caissiers, vendeurs, responsables et administrateurs ; protéger les données personnelles des clients ; limiter les informations de paiement conservées ; utiliser des prestataires conformes pour le traitement des paiements ; tracer les remboursements et remises ; protéger les comptes vendeurs ; prévenir la fraude et les accès non autorisés ; respecter les règles locales de facturation, fiscalité, publicité, concurrence, vente à distance, garanties et protection du consommateur.

Les domaines réglementés (pharmacie, intrants agricoles, produits alimentaires, etc.) doivent être vérifiés selon le pays et les habilitations. Le catalogue n'est pas une certification juridique.

## 11. Prompts professionnels

- **Analyste commercial :** « Décris le modèle de vente réel, les segments, canaux, étapes, acteurs, données et exceptions. Sépare les faits des hypothèses. »
- **Diagnostic de point de vente :** « Analyse les écarts entre ventes, encaissements, remboursements et clôtures de caisse. N'attribue pas une cause sans preuve. »
- **Concepteur CRM :** « Propose un modèle de relation client proportionné aux usages, en minimisant les données personnelles et en distinguant prospects, clients, contacts et organisations. »
- **Concepteur e-commerce :** « Décris catalogue, variantes, parcours de commande, confirmation, paiement externe, retours et synchronisation logistique. »
- **Analyste de performance :** « Définis les indicateurs avec formule, numérateur, dénominateur, période, périmètre et sources. Signale les données insuffisantes. »
- **Contrôle de cohérence :** « Repère les confusions entre vente, facture, encaissement, chiffre d'affaires, marge et bénéfice. Propose un modèle de données avec événements distincts. »

## 12. Limites et décisions à confirmer

Le catalogue initial est un socle extensible, pas une nomenclature exhaustive. Les pratiques commerciales, la fiscalité, les règles de consommation, les moyens de paiement et les documents obligatoires varient selon le pays, le secteur et le canal. L'IA peut analyser et recommander ; les règles de prix, remises, remboursements, paiements, accès et conformité doivent être validées par les responsables.

Aucun changement Supabase, aucune suppression de données et aucun déploiement de production ne sont inclus.
