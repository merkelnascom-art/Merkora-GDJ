# MerKora GDJ Catalogue — plan de réalisation

**Date :** 24 novembre 2026  
**Branche :** `feature/merkora-catalogue-foundation`  
**PR de travail :** [#76](https://github.com/merkelnascom-art/Merkora-GDJ/pull/76)  
**Conception de référence :** [2026-11-24-merkora-catalogue-foundation-design.md](../specs/2026-11-24-merkora-catalogue-foundation-design.md)

## Décisions déjà validées

- Architecture A : socle commun + configurateurs spécialisés.
- Périmètre de fondation : tous les domaines et types de produits déjà enregistrés, avec extension possible.
- Personnalisation après commande : uniquement les champs explicitement inclus dans l'offre acceptée.
- Toute fonction, option ou changement hors périmètre devient une demande d'évolution et peut nécessiter un devis complémentaire.
- Les tarifs contractuels restent sous contrôle de l'administration.
- Aucun changement Supabase, paiement réel, service payant, fusion ou déploiement production dans cette tranche.

## Avancement

| Lot | Contenu | État |
|---|---|---|
| 0 | Conception métier, architecture et règles de protection | Réalisé |
| 1 | Réutilisation du catalogue canonique (10 produits, 16 domaines) | Réalisé |
| 2 | Première page Catalogue : produits, domaines, fonctions et accès au parcours sur mesure | Réalisé |
| 3 | Contrat TypeScript d'offre versionnée et validation des références | Réalisé |
| 4 | Évaluation des sélections, options, dépendances et suggestions IA non validées | Réalisé |
| 5 | Instantané de commande et classification de la personnalisation incluse | Réalisé |
| 6 | Scénarios de régression métier et vérifications CI | Réalisé |
| 7 | Durcissement des validations d'entrée et des contrats de version | À faire |
| 8 | Configurateurs spécialisés initiaux | En cours — six définitions métier, parcours adaptatifs, écran une question à la fois, précisions libres, reprise locale et récapitulatif ajoutés ; règles conditionnelles plus fines à poursuivre |
| 9 | Parcours client de configuration et récapitulatif | En cours — six entrées Catalogue vers les configurateurs ; synthèse éditable et sauvegarde locale du brouillon ; connexion au dossier client et transmission serveur à concevoir |
| 10 | Administration des offres, versions et options | À faire |
| 11 | Moteur de devis administré et validation humaine | À faire |
| 12 | Persistance Supabase et intégration aux commandes partagées | À concevoir séparément, avec autorisation |

## Ordre d'exécution détaillé

### Lot 7 — Durcir les contrats

- Valider les identifiants, noms, résumés, versions et statuts à l'exécution.
- Rejeter les domaines et modules dupliqués.
- Vérifier les codes de devise et les modes tarifaires.
- Définir précisément la sémantique des modules inclus et optionnels.
- Garantir que l'instantané de commande ne partage aucune référence mutable avec les objets sources.
- Ajouter des tests pour chaque règle avant de modifier l'implémentation.

**Critère de sortie :** une offre invalide ne peut ni être publiée ni produire un instantané de commande.

### Lot 8 — Configurateurs spécialisés

Créer une interface commune de configurateur, puis des définitions métier séparées pour :
1. E-commerce : catalogue, variantes, stock, commandes, paiement, livraison et retours.
2. Réservation : ressources, disponibilités, capacités, créneaux, confirmations et annulations.
3. Gestion : personnes, rôles, tâches, recettes, dépenses, validations et rapports.
4. Éducation : apprenants, cours, évaluations, résultats et progression.
5. Numérisation : réception, scan, OCR, classement, métadonnées, recherche et archivage.
6. Jeux : modes, règles, joueurs, équipes, sessions, scores et progression.

Les autres domaines restent reconnus par le référentiel, sans être artificiellement déclarés « configurés » avant leur réalisation. Le premier socle couvre six parcours distincts : e-commerce, réservation, gestion d’activité, éducation/orientation, numérisation documentaire et jeux. Chaque parcours possède ses propres étapes, questions, options, explications et modules référencés. Les parcours conditionnels évitent notamment de demander une gestion de stock pour une boutique uniquement numérique et évitent d’imposer la gestion des cours à un projet d’orientation professionnelle. L’interface commune affiche une question par écran, permet les sélections adaptées, une précision libre à chaque étape, le retour aux réponses précédentes et un récapitulatif éditable. Le brouillon peut être enregistré localement dans le navigateur. Cette sauvegarde locale n’envoie pas encore les données à l’équipe et ne remplace pas la persistance dans le dossier client.

**Critère de sortie :** chaque configurateur pose des questions pertinentes à son produit, applique ses règles métier et produit un résultat compatible avec le socle commun.

### Lot 9 — Parcours client

- Découverte par produit, domaine ou besoin.
- Fiche d'offre avec inclusions, limites, options et conditions.
- Questions adaptées au type de produit.
- Sélection client explicite ; les suggestions IA ne sont jamais activées sans accord.
- Aperçu et récapitulatif lisible.
- Demande de devis ou commande selon le statut de l'offre.
- Historique des choix et versions.

**Critère de sortie :** le client comprend précisément ce qu'il demande et ce qui reste hors périmètre.

### Lot 10 — Administration catalogue

- Création et édition des offres.
- Gestion des versions et statuts.
- Composition des modules inclus et optionnels.
- Déclaration des champs personnalisables.
- Définition des limites, dépendances et exclusions.
- Prévisualisation et publication explicite.

**Critère de sortie :** aucune offre ne devient visible ou commandable sans validation administrative.

### Lot 11 — Devis

- Prix fixe administré.
- Règles de calcul explicites, testées et versionnées.
- Demande de devis pour les réalisations complexes.
- Estimation IA utilisée comme aide interne, jamais comme tarif contractuel.
- Approbation administrative avant transmission au client.
- Conservation des devis acceptés sans réécriture rétroactive.

**Critère de sortie :** le montant et les conditions présentés au client sont traçables et approuvés.

### Lot 12 — Persistance et intégration

- Définir les tables, relations, droits d'accès et politiques de conservation.
- Examiner l'impact sur les données et flux existants.
- Préparer une migration additive et réversible.
- Faire relire et approuver le schéma et les changements avant exécution.

**Critère de sortie :** aucune migration n'est exécutée sans accord explicite ; aucune donnée existante n'est supprimée ou réinitialisée.

## Garde-fous permanents

- Ne pas modifier ni fusionner la PR #75.
- Garder la PR #76 en brouillon jusqu'à revue et validation.
- Ne pas déployer en production.
- Ne pas toucher aux données Supabase existantes.
- Ne pas activer de fournisseur payant ni engager de dépense.
- Préserver les routes et les parcours DRT, IDP et Catalogue existants.
- Lancer tests, vérification TypeScript et build après chaque lot significatif.
