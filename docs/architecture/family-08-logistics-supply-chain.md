# Fondation A — Famille 08 : Logistique et chaîne d'approvisionnement

**Version :** 1.0 — 16 novembre 2026  
**Identifiant canonique :** `family:logistics-supply-chain`  
**Catalogue initial :** 88 concepts bilingues FR/EN  
**Statut :** intégré à la branche de travail ; validation CI et revue métier requises avant fusion.

## 1. Périmètre et frontières

La famille couvre la coordination des flux de biens et des informations associées : achats et approvisionnement, gestion des fournisseurs, entreposage, gestion des stocks, préparation des commandes, transit et formalités, distribution postale, livraison finale, chaîne du froid, retours et logistique humanitaire.

Elle réutilise les cinq domaines canoniques déjà présents dans la cartographie universelle :

- `domain:warehousing` — Entreposage ;
- `domain:freight-forwarding` — Transit et commission de transport ;
- `domain:procurement` — Achats et approvisionnement ;
- `domain:inventory-management` — Gestion des stocks ;
- `domain:postal-delivery` — Services postaux et livraison.

**Frontière avec la Famille 07 — Mobilité et transport :** la Famille 07 décrit l'exécution du déplacement par route, rail, mer, air ou mobilité urbaine, ainsi que les véhicules, équipages et opérations de transport. La Famille 08 décrit la planification et la coordination de la chaîne, les stocks, l'entrepôt, le transit, les documents, la préparation et la preuve de remise. Une expédition peut donc référencer une prestation de transport de la Famille 07 sans dupliquer son concept.

**Autres frontières :** la vente et la relation commerciale relèvent aussi du commerce ; la comptabilité et le paiement restent des domaines financiers ; la production et la fabrication restent dans les familles agricoles ou industrielles. La logistique reçoit des besoins et transmet des événements, sans absorber ces métiers.

## 2. Sous-domaines

Le premier corpus couvre : exploitation d'entrepôt ; centres de distribution ; contrôle des stocks ; réapprovisionnement ; achats et sourcing ; relations fournisseurs ; transit ; dédouanement ; opérations postales et colis ; livraison du dernier kilomètre ; exécution des commandes ; planification des flux ; logistique inverse ; chaîne du froid ; emballage et palettisation ; cours et quais ; pièces de rechange ; logistique humanitaire.

## 3. Spécialisations

- Matières dangereuses ;
- produits pharmaceutiques et de santé ;
- produits alimentaires ;
- préparation des commandes du commerce électronique ;
- cross-docking ;
- conformité du commerce international ;
- optimisation avancée des stocks.

Ces spécialisations ne remplacent pas les habilitations, agréments ou procédures propres aux marchandises et juridictions.

## 4. Métiers, activités et processus

Métiers initiaux : responsable d'entrepôt, magasinier, gestionnaire de stocks, acheteur-approvisionneur, responsable supply chain, commissionnaire de transport/transitaire, déclarant en douane, préparateur de commandes, planificateur logistique, coordinateur de livraison, agent de conditionnement et analyste de performance.

Activités : réception et contrôle, mise en emplacement, inventaire tournant, réapprovisionnement, consultation fournisseurs, suivi des commandes d'achat, picking, emballage, documentation d'expédition, contrôle de dossier douanier, preuve de livraison et qualification des retours.

Processus : du besoin à la réception ; de la commande à la remise ; réception et entrée en stock ; sortie et expédition ; inventaire et régularisation ; dédouanement ; logistique inverse ; qualification fournisseur.

## 5. Problèmes, ressources, fonctions et indicateurs

Problèmes initiaux : rupture, surstock, écart d'inventaire, retard fournisseur, prévision erronée, marchandise introuvable, erreur de préparation, livraison échouée, rupture de chaîne du froid et dossier douanier incomplet.

Ressources : emplacement de stockage, référence SKU, commande d'achat, dossier fournisseur, équipement de manutention, unité logistique et dossier d'expédition.

Fonctions numériques : WMS ; gestion des stocks ; achats et fournisseurs ; préparation des commandes ; suivi d'expédition et livraison ; documents douaniers ; analyse de performance.

Indicateurs : exactitude des stocks, rotation, taux de rupture, délai de traitement de commande, taux de livraison complète et à l'heure, ponctualité fournisseur, utilisation de capacité d'entreposage. Chaque indicateur doit préciser formule, unité, période, périmètre, source et règles d'exclusion avant toute comparaison.

## 6. Questionnaire métier adaptatif — principe de conception

Le moteur ne doit pas afficher un formulaire géant. Il pose une question à la fois, valide chaque réponse en arrière-plan et choisit la question suivante selon les informations manquantes.

1. **Comprendre l'organisation :** entreprise, association, administration, plateforme, activité personnelle ou opérateur logistique ; sites et zones desservis.
2. **Identifier le flux :** achat, réception, stockage, transfert, préparation, expédition, livraison, retour ou plusieurs étapes.
3. **Identifier les biens :** familles d'articles, unités, lots, dates, numéros de série, contraintes de température, fragilité ou dangerosité.
4. **Comprendre les acteurs :** demandeur, acheteur, fournisseur, magasinier, préparateur, responsable, transitaire, transporteur, livreur, destinataire.
5. **Décrire le problème :** rupture, pertes, retards, erreurs, manque de visibilité, documents, coûts ou coordination ; demander les causes et exemples.
6. **Mesurer le fonctionnement :** volumes, fréquence, saisonnalité, nombre de références, sites, fournisseurs, commandes et utilisateurs.
7. **Décrire les règles :** seuils, validations, droits, lots, FIFO/FEFO si applicables, substitutions, tolérances, retours et exceptions.
8. **Déterminer les outils :** papier, tableur, logiciel existant, codes-barres, QR, RFID, balance, GPS, API et connectivité.
9. **Définir les résultats :** disponibilité, exactitude, délai, coût, traçabilité, niveau de service et réduction des pertes.
10. **Valider les décisions :** synthèse des faits, hypothèses et propositions ; aucune règle critique n'est activée sans validation humaine.

## 7. Parcours opérationnel et écrans possibles

Parcours de référence : expression du besoin → validation → consultation fournisseur → commande → avis d'expédition → réception → contrôle → mise en stock → réservation/allocation → préparation → contrôle qualité → emballage → expédition coordonnée → preuve de remise → clôture ou traitement d'exception → retours éventuels.

Écrans possibles selon le projet :
- tableau de bord des flux et alertes ;
- demandes d'achat et circuits d'approbation ;
- annuaire et évaluation fournisseurs ;
- commandes d'achat et réceptions attendues ;
- catalogue des articles et unités ;
- stock par site, dépôt, emplacement, lot ou série ;
- mouvements, transferts et inventaires ;
- carte ou plan des emplacements si utile ;
- vagues et listes de préparation ;
- emballage, étiquetage et staging ;
- dossiers d'expédition et documents ;
- suivi des statuts et preuves de livraison ;
- retours, litiges et non-conformités ;
- rapports, coûts et indicateurs ;
- administration, rôles, paramètres et journal d'audit.

## 8. Architecture de données à prévoir selon le besoin

Entités possibles : organisation, site, entrepôt, zone, emplacement, article, unité de mesure, code-barres, lot, numéro de série, fournisseur, contrat, demande d'achat, consultation, offre fournisseur, commande d'achat, ligne de commande, réception, contrôle, stock, réservation, mouvement, inventaire, transfert, commande client référencée, vague de préparation, prélèvement, colis, unité logistique, expédition, dossier douanier, événement de suivi, preuve de livraison, retour, non-conformité et règle de réapprovisionnement.

Principes :
- distinguer quantité physique, disponible, réservée, en quarantaine, en transit et attendue ;
- conserver un journal immuable ou traçable des mouvements et corrections ;
- enregistrer l'unité, le site, l'emplacement, le lot/série et l'horodatage quand pertinents ;
- gérer les conversions d'unités de manière explicite et contrôlée ;
- conserver les liens entre commande, réception, facture et expédition sans les confondre ;
- gérer les statuts avec transitions autorisées, acteurs et motifs ;
- séparer les données de référence, les événements opérationnels et les agrégats analytiques ;
- éviter les suppressions physiques d'opérations historiques ; privilégier annulation et correction traçables.

## 9. Intégrations et équipements possibles

Selon le contexte : lecteurs de codes-barres, imprimantes d'étiquettes, QR, RFID, balances, terminaux mobiles, WMS, ERP, logiciels d'achat, plateformes e-commerce, API fournisseurs, services de suivi transport, outils douaniers autorisés, cartographie, notifications SMS/e-mail/WhatsApp, systèmes de paiement ou facturation en intégration limitée, et outils BI.

Une intégration ne doit être proposée qu'après vérification de sa disponibilité, de ses coûts, de ses conditions d'accès, de sa couverture géographique et de la qualité des données.

## 10. Règles métier et contrôles

- Une commande d'achat n'est pas une réception ; une réception n'est pas une facture ni un paiement.
- Le stock théorique n'est pas nécessairement le stock physiquement disponible.
- Une réservation réduit la disponibilité sans nécessairement déplacer physiquement le stock.
- Un mouvement de stock doit préciser origine, destination, article, quantité, unité, auteur, date et motif.
- Les corrections d'inventaire doivent être autorisées et justifiées.
- Les règles FIFO, FEFO, LIFO ou autres ne sont pas imposées universellement : le choix dépend du produit et des obligations applicables.
- Les substitutions, reliquats, livraisons partielles et tolérances doivent être configurables.
- La preuve de livraison doit respecter les règles de confidentialité et de conservation.
- Les produits sensibles exigent des contrôles de température, de lot, de date et de traçabilité adaptés.
- Les formalités douanières et les marchandises réglementées exigent les validations et professionnels habilités localement.
- Les KPI doivent être définis avant d'être utilisés pour classer ou sanctionner des équipes ou fournisseurs.

## 11. Sécurité, conformité et précautions

Contrôler les accès par rôle et site ; protéger les données fournisseurs et commerciales ; tracer les validations et corrections ; sécuriser les terminaux et intégrations ; prévoir sauvegardes, continuité et fonctionnement dégradé en cas de réseau indisponible ; limiter les données personnelles des destinataires ; définir les durées de conservation ; protéger les emplacements et informations sensibles ; intégrer les règles locales de sécurité au travail, hygiène, douane, fiscalité et transport.

Ce catalogue est un référentiel de conception numérique, non une certification réglementaire. Les règles locales et les contraintes propres aux marchandises doivent être confirmées avec les responsables compétents.

## 12. Prompts professionnels — base de conception IA

- **Analyste de flux :** « Cartographie le flux de bout en bout à partir des faits fournis. Distingue acteurs, événements, documents, stocks, décisions, exceptions et systèmes. Signale les inconnues sans les inventer. »
- **Diagnostic de stock :** « Analyse les symptômes de rupture, surstock ou écart. Sépare causes confirmées, hypothèses et données manquantes. Propose les vérifications et indicateurs nécessaires avant toute conclusion. »
- **Concepteur WMS :** « Propose les fonctions d'entrepôt adaptées aux volumes, emplacements, articles, lots, équipements et rôles décrits. Décris les scénarios normaux et les exceptions. »
- **Concepteur achats :** « Décris le cycle besoin-fournisseur-consultation-approbation-commande-réception, les seuils d'autorisation et la piste d'audit, sans inventer de politique d'achat. »
- **Concepteur de traçabilité :** « Détermine les événements et preuves nécessaires pour suivre chaque unité ou expédition, en respectant les données réellement disponibles et les obligations locales. »
- **Auditeur de cohérence :** « Recherche les contradictions entre quantités, unités, statuts, délais et documents. Classe chaque anomalie par gravité, confiance et action de vérification. »

## 13. Limites et décisions à confirmer

Le catalogue est un premier socle universel, non une liste exhaustive de métiers ou de règles. Les processus réels peuvent varier selon taille, secteur, pays, produits, saisonnalité et maturité numérique. Le client valide les règles critiques ; l'IA peut proposer des scénarios mais ne doit ni déclarer une conformité légale ni déclencher seule des opérations financières, douanières ou irréversibles.

Aucun changement Supabase, aucune suppression de données et aucun déploiement ne sont inclus.
