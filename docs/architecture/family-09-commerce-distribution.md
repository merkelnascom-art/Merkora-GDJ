# Fondation A — Famille 09 : Commerce et marchés

**Version :** 1.0 — 16 novembre 2026  
**Identifiant :** `family:commerce-markets`  
**Catalogue :** 90 concepts bilingues français/anglais  
**État :** intégré au registre sur branche de travail ; tests et revue métier à vérifier avant fusion.

## 1. Périmètre et principes de classement

Cette famille couvre les activités de commerce, de vente, de distribution, de marketing commercial et de relation client. Elle s'appuie sur cinq domaines canoniques déjà présents dans la cartographie universelle :

- `domain:retail-trade` — commerce de détail ;
- `domain:wholesale-trade` — commerce de gros ;
- `domain:e-commerce` — commerce électronique ;
- `domain:sales-distribution` — vente et distribution ;
- `domain:marketing-advertising` — marketing et publicité.

Le catalogue ajoute des concepts sectoriels sans recréer ces domaines ni modifier leurs identifiants.

### Frontières à préserver

- **Commerce de détail** : vente au consommateur, point de vente, magasin, caisse, présentation des produits.
- **Commerce de gros** : transactions professionnelles, volumes B2B, grossistes, import-export et négoce.
- **Commerce électronique** : canaux numériques, catalogue en ligne, places de marché, vente sociale et abonnements.
- **Vente et distribution** : prospection, négociation, commande, réseau de distribution et vente directe.
- **Marketing et publicité** : acquisition, marque, campagnes, connaissance client, CRM et fidélisation.

La logistique physique, l'entreposage et l'exécution de transport sont décrits dans les Familles 08 et 07. Le commerce peut les référencer sans absorber leurs concepts.

## 2. Distinctions métier fondamentales

Le moteur de compréhension doit éviter les confusions suivantes :

1. Une **vente** est un événement ou une relation commerciale ; un **paiement** est un règlement ; un **encaissement** est l'enregistrement ou la réception du règlement ; une **facture** est un document commercial/fiscal ; une **écriture comptable** relève de la comptabilité.
2. Le **chiffre d'affaires**, les ventes brutes, les ventes nettes, les encaissements et la trésorerie ne sont pas interchangeables.
3. La **marge brute**, le taux de marge et le taux de marque doivent avoir des formules explicites.
4. Un **magasin physique**, une boutique en ligne, une place de marché et un réseau de distribution sont des modèles distincts, qui peuvent coexister.
5. Le commerce de gros ne se réduit pas à une boutique avec de grandes quantités : clients, contrats, prix, négociation et commandes sont souvent différents.
6. La publicité, le marketing, la prospection, la vente et le service client sont des fonctions liées, mais distinctes.
7. Un client, un prospect, un vendeur, un fournisseur, un distributeur, un affilié et un partenaire ont des rôles différents selon le contexte.
8. Une remise, un coupon, une promotion, un avoir et un remboursement ont des règles et des effets différents.

## 3. Couverture du catalogue

Le socle comprend 90 concepts :

| Catégorie | Nombre |
|---|---:|
| Sous-domaines | 20 |
| Spécialisations | 7 |
| Métiers | 12 |
| Activités | 12 |
| Processus | 8 |
| Problèmes | 10 |
| Ressources | 7 |
| Fonctions numériques | 7 |
| Indicateurs | 7 |
| **Total** | **90** |

Les sous-domaines couvrent notamment le magasin physique, le commerce spécialisé et alimentaire, les marchés, les franchises, le commerce B2B, l'import-export, le cash-and-carry, les agents, la vente en ligne, les places de marché, le commerce social, les abonnements, l'omnicanal, les réseaux de distribution, la vente directe, le trade marketing, la publicité, le CRM et les études de marché.

Les spécialisations incluent le luxe, les produits périssables, les grands comptes B2B, le commerce électronique transfrontalier, les produits numériques, la franchise et le marketing de performance.

Les métiers couvrent responsables de magasin, vendeurs, caissiers, merchandisers, commerciaux B2B, acheteurs/category managers, responsables e-commerce, responsables marketing numérique, CRM, commerciaux terrain, analystes de marché et agents de service client.

## 4. Questionnaire adaptatif — une question à la fois

Le diagnostic n'est pas un formulaire interminable. Une question est affichée dans un sous-écran ; la réponse est validée en arrière-plan, puis le moteur choisit la question suivante selon les informations déjà fiables.

### Étape A — Comprendre l'activité
- Que vendez-vous ou souhaitez-vous vendre : biens, services, produits numériques, abonnements, offres mixtes ?
- Votre activité est-elle déjà lancée, en préparation, en test ou en expansion ?
- Le modèle principal est-il B2C, B2B, B2G, marketplace, vente directe, franchise ou mixte ?

### Étape B — Comprendre les canaux
- Magasin, marché, commerciaux terrain, téléphone/messagerie, site web, application, marketplace, réseaux sociaux ou plusieurs canaux ?
- Où se déroule la vente et où le client reçoit-il le produit ou service ?
- Les prix, catalogues et stocks sont-ils communs aux canaux ou différents ?

### Étape C — Comprendre les clients et les offres
- Qui achète, qui utilise, qui paie et qui décide ?
- Quels produits, variantes, unités, lots, services, tarifs ou abonnements sont proposés ?
- Existe-t-il des prix par catégorie de client, volume, canal ou période ?

### Étape D — Comprendre le processus commercial
- Comment un prospect devient-il client ?
- Comment sont établis les devis, commandes, validations, ventes, factures et règlements ?
- Qui peut accorder une remise, annuler une vente, accepter un retour ou autoriser un remboursement ?

### Étape E — Identifier les problèmes et leurs causes
- Manque de clients, faible conversion, ventes non suivies, erreurs de prix, ruptures, pertes, impayés, retours, faible fidélisation, campagnes sans résultats ?
- Depuis quand, à quelle fréquence, sur quel canal et avec quel impact ?
- Quelles causes sont confirmées et lesquelles restent des hypothèses ?

### Étape F — Mesurer et connecter
- Nombre de références, clients, vendeurs, magasins, commandes et transactions ?
- Outils actuels : cahier, tableur, caisse, ERP, CRM, boutique en ligne, réseaux sociaux, passerelle de paiement ?
- Besoin de codes-barres, QR, notifications, rapports, multi-sites, multi-devises ou intégrations ?

### Étape G — Valider
Le moteur restitue les faits, les zones inconnues, les contradictions, les causes possibles et les propositions de fonctions. Le client valide les décisions structurantes avant que le cahier des charges ne soit considéré comme approuvé.

## 5. Parcours opérationnels de référence

### Vente en magasin
Ouverture du point de vente → consultation du catalogue → conseil → panier → contrôle des prix et remises → encaissement → justificatif → mise à jour des ventes et disponibilités → clôture de caisse → analyse.

### Vente B2B
Prospection → qualification du compte → besoin → devis → négociation → validation des conditions → commande → préparation et livraison (référence Famille 08/07) → facture → suivi du règlement → fidélisation.

### E-commerce
Publication du catalogue → découverte et recherche → panier → commande → confirmation → paiement selon prestataire → préparation logistique → livraison → service après-vente → retour ou réclamation éventuels.

### Marketing et fidélisation
Objectif → audience → consentement et base légale → message/création → validation → diffusion → mesure → apprentissage → fidélisation ou ajustement.

## 6. Rôles et écrans possibles

Rôles selon la taille et le modèle : propriétaire/administrateur, responsable commercial, responsable de magasin, vendeur, caissier, acheteur, gestionnaire catalogue, responsable e-commerce, commercial terrain, responsable marketing, CRM/service client, analyste, comptable en accès limité, vendeur marketplace et client.

Écrans possibles :
- tableau de bord commercial ;
- points de vente et équipes ;
- catalogue produits/services et variantes ;
- tarifs, promotions et autorisations de remise ;
- caisse et opérations de vente ;
- clients, prospects et CRM ;
- devis, commandes et suivi des opportunités ;
- facturation et liens vers le système financier ;
- canaux numériques et commandes en ligne ;
- vendeurs et marketplace ;
- campagnes et calendrier marketing ;
- réclamations, retours et fidélité ;
- analyses, indicateurs et exports ;
- rôles, paramètres et journal d'audit.

Chaque projet n'obtient que les écrans justifiés par le diagnostic.

## 7. Architecture de données indicative

Entités potentielles : organisation, établissement, canal, point de vente, utilisateur, rôle, vendeur, client, prospect, compte B2B, consentement, segment, produit, variante, catégorie, unité, média, prix, tarif, promotion, coupon, devis, ligne de devis, opportunité, commande, ligne de commande, vente, ligne de vente, transaction de caisse, paiement référencé, facture référencée, avoir, retour, remboursement, campagne, audience, contenu, interaction, réclamation, programme de fidélité, avantage, événement et indicateur.

Règles de conception :
- séparer prospect, client, fournisseur, vendeur et partenaire ;
- séparer commande, vente, encaissement, paiement, facture, avoir et écriture comptable ;
- conserver les événements d'audit et les annulations/corrections ;
- versionner prix, promotions, catalogue et conditions commerciales ;
- tracer l'origine d'une commande et le canal d'acquisition lorsque la donnée est disponible ;
- ne pas conserver les données de carte bancaire sensibles dans l'application ; utiliser un prestataire conforme et ses références de transaction ;
- appliquer les règles multi-établissements, multi-devises et multi-langues seulement si le besoin est confirmé ;
- définir les calculs d'indicateurs avant de les afficher.

## 8. Intégrations et équipements possibles

Selon le besoin : terminaux et logiciels de caisse, lecteurs code-barres/QR, imprimantes tickets et étiquettes, catalogues fournisseurs, ERP, CRM, plateformes e-commerce, marketplaces, réseaux sociaux, outils d'email/SMS/WhatsApp, outils publicitaires et analytiques, prestataires de paiement, facturation électronique, systèmes de fidélité et services logistiques.

Avant toute intégration, vérifier pays desservis, couverture réelle, API disponible, autorisations, frais, délais, conditions contractuelles, protection des données et possibilités de sortie/export.

## 9. Règles métier à configurer

- Les prix affichés, taxes, devises, remises et périodes de validité doivent être traçables.
- Les remises et annulations peuvent nécessiter des seuils d'approbation.
- Une vente ne doit pas être déclarée payée sans preuve ou statut de paiement provenant d'une source autorisée.
- Les paiements partiels, acomptes, paiements différés et remboursements doivent être explicitement modélisés.
- Les retours et garanties dépendent des produits, contrats et lois locales.
- Les stocks disponibles doivent provenir du système responsable du stock (Famille 08), avec synchronisation et gestion des conflits.
- Les campagnes doivent respecter les consentements, oppositions et règles publicitaires applicables.
- Les commissions vendeurs, affiliés ou apporteurs doivent avoir des règles, bases de calcul et validations explicites.
- Les places de marché peuvent être intermédiaires, vendeurs ou opérateurs ; le modèle juridique et financier doit être déterminé.
- Les règles de facturation et fiscalité doivent être confirmées localement, pas déduites par l'IA.

## 10. Sécurité, conformité et précautions

Contrôles d'accès par rôle, établissement et canal ; protection des données clients ; journalisation des changements de prix, remises, remboursements et comptes ; authentification renforcée des administrateurs ; minimisation et durée de conservation des données ; sauvegardes et export ; sécurité des terminaux de caisse ; prévention de fraude sans profilage opaque ; consentement marketing et gestion des oppositions ; contrôle des accès aux rapports financiers.

Les obligations de protection des consommateurs, affichage, concurrence, publicité, fiscalité, facturation, données personnelles, commerce électronique et import-export dépendent du pays, du produit et du canal. Le référentiel ne remplace pas une validation juridique ou comptable locale.

## 11. Prompts professionnels pour le moteur MerKora

- **Analyste commercial :** « Reconstitue le modèle commercial à partir des informations fournies. Distingue clients, utilisateurs, payeurs, canaux, offres, événements de vente et règles. Sépare faits, hypothèses et inconnues. »
- **Diagnostic de magasin :** « Analyse les difficultés de fréquentation, conversion, disponibilité, prix, caisse et fidélisation. Ne conclus pas à une cause sans données ; propose les questions discriminantes. »
- **Architecte e-commerce :** « Propose le parcours catalogue-panier-commande-paiement-logistique-service après-vente, en identifiant les systèmes responsables et les dépendances externes. »
- **Concepteur CRM :** « Définis les étapes du cycle client, les données minimales, les consentements, les interactions, les segments et les indicateurs sans collecte excessive. »
- **Analyste de rentabilité :** « Distingue ventes, remises, retours, ventes nettes, coût des biens, marge, encaissements et trésorerie. Indique les formules et données manquantes avant tout calcul. »
- **Auditeur de cohérence :** « Repère les contradictions entre catalogue, prix, commandes, ventes, paiements, factures, stocks et retours. Classe les anomalies sans fusionner des notions comptables différentes. »

## 12. Limites et validation humaine

Les 90 concepts constituent un socle initial, pas une taxonomie exhaustive. Les modèles commerciaux hybrides doivent pouvoir combiner plusieurs domaines. Les propositions IA restent des propositions tant qu'un responsable ne les a pas validées. Les décisions irréversibles — remboursement, modification tarifaire massive, campagne payante, engagement contractuel, suspension d'un compte — nécessitent une autorisation explicite.

Aucune modification Supabase, aucune suppression de données et aucun déploiement de production ne sont inclus dans cette famille.
