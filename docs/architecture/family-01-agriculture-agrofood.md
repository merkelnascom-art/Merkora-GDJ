# Famille 01 — Agriculture et agroalimentaire

**Référentiel :** Fondation A ouverte de MerKora GDJ  
**Version de conception :** 1.0  
**Statut :** première intégration additive dans le registre TypeScript  
**Identifiant canonique :** `family:agriculture-agrofood`

## 1. Périmètre et frontières

Cette famille couvre les systèmes de production végétale, l'organisation des exploitations agricoles, les services et ressources agricoles, la transformation agroalimentaire et la mise en marché des produits agricoles.

Elle ne doit pas absorber automatiquement :
- l'élevage et la santé animale ;
- la pêche et l'aquaculture ;
- la foresterie et la gestion forestière ;
- l'environnement général, la gestion de l'eau à l'échelle des services publics ;
- l'industrie alimentaire sans lien direct avec une filière agricole identifiable.

Ces sujets peuvent être liés à l'agriculture par des relations transversales ou des projets hybrides. Leurs référentiels sectoriels propres seront développés dans les familles concernées.

## 2. Les cinq domaines canoniques

| Identifiant | Domaine | Périmètre |
|---|---|---|
| `domain-v2:crop-production` | Productions végétales | Cultures, itinéraires techniques et récoltes |
| `domain-v2:specialized-crop-systems` | Productions agricoles spécialisées | Horticulture, cultures sous abri, pépinières et semences |
| `domain-v2:farm-management` | Gestion des exploitations agricoles | Parcelles, sols, eau, intrants, équipements, travail et économie |
| `domain-v2:agrofood-processing` | Transformation agroalimentaire | Opérations post-récolte, conservation, transformation, emballage et qualité |
| `domain-v2:agricultural-marketing` | Commercialisation agricole | Collecte, coopératives, stockage, négociation, vente et distribution |

Les anciens identifiants `family:agriculture-living`, `domain:agriculture` et `domain:food-production` sont conservés. Les nouveaux domaines déclarent des relations de précision ou de proximité avec les domaines historiques ; ils ne les remplacent pas et ne prétendent pas être des équivalences réglementaires.

## 3. Sous-domaines et spécialisations

### 3.1 Productions végétales
- Grandes cultures.
- Cultures céréalières : maïs, riz, sorgho, mil et autres grains.
- Cultures de légumineuses : niébé, soja, arachide, haricot.
- Cultures de tubercules et racines : manioc, igname, patate douce.
- Maraîchage et production de légumes.
- Arboriculture fruitière.
- Cultures industrielles : coton, palmier à huile, canne à sucre, hévéa.

### 3.2 Productions agricoles spécialisées
- Horticulture.
- Cultures sous abri : serre, tunnel et ombrière.
- Pépinières végétales.
- Production et multiplication de semences.
- Floriculture et plantes ornementales.

### 3.3 Gestion des exploitations agricoles
- Gestion des terres et parcelles.
- Gestion des sols et de leur fertilité.
- Irrigation et gestion de l'eau agricole.
- Intrants agricoles : semences, plants, fertilisants, amendements et produits de protection.
- Machinisme et équipements agricoles.
- Main-d'œuvre agricole et travaux saisonniers.
- Économie, comptabilité de gestion et financement des exploitations.

### 3.4 Transformation agroalimentaire
- Opérations post-récolte : réception, tri, nettoyage, séchage, calibrage.
- Conservation : séchage, refroidissement, congélation, fermentation et autres procédés adaptés.
- Transformation des matières premières agricoles.
- Conditionnement, emballage et étiquetage.
- Qualité et sécurité sanitaire des aliments.
- Traçabilité des produits et lots.

### 3.5 Commercialisation agricole
- Collecte et regroupement des récoltes.
- Coopératives et organisations de producteurs.
- Stockage et entreposage agricole.
- Négociation et vente des produits agricoles.
- Distribution, transport et acheminement.
- Information sur les marchés et les prix.

La liste est ouverte. Une nouvelle culture, une nouvelle pratique ou une spécialité locale peut être proposée sans modifier les identifiants déjà publiés.

## 4. Acteurs et rôles

Le référentiel initial inclut notamment :
- agriculteur, exploitant et producteur agricole ;
- maraîcher, horticulteur, pépiniériste et producteur de semences ;
- agronome, technicien agricole et conseiller agricole ;
- technicien en irrigation et spécialiste des sols ;
- conducteur d'engins agricoles ;
- gestionnaire d'exploitation ;
- technicien post-récolte ;
- transformateur agroalimentaire et contrôleur qualité ;
- magasinier agricole ;
- gestionnaire de coopérative ;
- acheteur de produits agricoles, collecteur et commercial agricole ;
- économiste agricole.

Un acteur peut cumuler plusieurs rôles. Un rôle est contextuel : « propriétaire », « exploitant », « salarié », « membre de coopérative », « acheteur » et « responsable de parcelle » ne sont pas des synonymes.

## 5. Objets et ressources

Les objets et ressources fréquemment rencontrés incluent :
- parcelle, exploitation, campagne agricole et lot ;
- sol, semence, plant, récolte et produit agricole ;
- engrais, amendement, produit phytosanitaire et autres intrants ;
- eau, système d'irrigation, outils, tracteur et équipement de récolte ;
- bâtiment de stockage, chambre froide et matériel d'emballage ;
- main-d'œuvre, capital d'exploitation, données météorologiques et transport.

Un même objet peut être une ressource dans un processus et un produit dans un autre. Le référentiel doit conserver le contexte plutôt que forcer une catégorie unique.

## 6. Activités et processus

### Activités initialement intégrées
Préparer le sol, sélectionner les semences, semer, repiquer, irriguer, fertiliser, désherber, observer les cultures, surveiller les ravageurs et maladies, protéger les cultures, récolter, trier, sécher, stocker, transformer, conditionner, contrôler la qualité, enregistrer les dépenses, planifier le calendrier cultural, organiser les travaux, peser, collecter, négocier la vente, tracer les lots et entretenir le matériel.

### Processus de référence
1. Cycle de production culturale.
2. Approvisionnement en intrants.
3. Gestion d'un cycle d'irrigation.
4. Protection intégrée des cultures.
5. Récolte.
6. Opérations post-récolte.
7. Transformation alimentaire.
8. Contrôle qualité et sécurité sanitaire.
9. Suivi économique d'une campagne.
10. Collecte coopérative.
11. Vente de produits agricoles.
12. Maintenance des équipements agricoles.

Chaque processus doit être détaillé ensuite avec ses déclencheurs, étapes, acteurs, entrées, sorties, décisions, exceptions, documents, règles et indicateurs.

## 7. Problèmes et besoins à reconnaître

Exemples de problèmes représentés :
- rendement inférieur à l'objectif ;
- manque ou irrégularité de l'eau ;
- dégradation du sol ;
- pression de ravageurs ou maladies ;
- coût élevé des intrants ;
- pertes post-récolte ou altération en stockage ;
- absence de suivi des parcelles et opérations ;
- incertitude sur les prix ;
- panne ou indisponibilité des équipements ;
- manque de main-d'œuvre ;
- retard d'approvisionnement ;
- rejet d'un lot ;
- traçabilité insuffisante ;
- décalage de trésorerie pendant la campagne.

Ces éléments sont des possibilités à détecter, pas des faits à attribuer à un client sans preuve.

Besoins fonctionnels possibles :
- connaître les parcelles et les cultures en cours ;
- planifier les activités et calendriers ;
- savoir quels intrants ont été achetés et utilisés ;
- suivre les récoltes, quantités, rendements et pertes ;
- calculer les coûts par culture, parcelle ou campagne ;
- connaître les stocks disponibles ;
- suivre les lots, leurs origines et leurs destinations ;
- gérer les acheteurs, commandes, livraisons et règlements ;
- organiser la maintenance des équipements.

## 8. Indicateurs

Indicateurs initiaux :
- rendement par hectare ;
- taux de germination ;
- taux de pertes post-récolte ;
- coût de production par unité ;
- marge brute agricole ;
- consommation d'eau par hectare ;
- taux de pertes en stockage.

Chaque indicateur devra préciser la formule, l'unité, la période, la population ou surface concernée, la source des données et les limites de comparaison. Une marge brute ne doit pas être présentée comme un bénéfice net.

## 9. Règles métier et précautions

1. Une culture prévue n'est pas une culture effectivement semée.
2. Une intervention planifiée n'est pas une intervention réalisée.
3. Un intrant acheté n'est pas nécessairement un intrant utilisé.
4. Une quantité récoltée n'est pas nécessairement une quantité vendable.
5. Un lot stocké peut subir des pertes, déclassements ou transformations.
6. Une commande n'est pas une livraison ; une livraison n'est pas un règlement.
7. Un prix observé sur un marché n'est pas automatiquement le prix accepté par un acheteur.
8. Un rendement exige une quantité, une surface, une période et une méthode de mesure.
9. Une recommandation de traitement phytosanitaire doit respecter les homologations, étiquettes, doses, délais et compétences applicables. MerKora ne doit pas improviser une prescription.
10. Les calendriers agricoles dépendent de la zone, du climat, de la variété, de l'eau, du sol et des pratiques locales. Aucun calendrier universel ne doit être imposé.
11. Les données de parcelles et de producteurs peuvent être sensibles ; leurs accès doivent être limités selon les rôles.
12. Les données météorologiques, prix de marché et informations de fournisseurs doivent être datées et sourcées.

## 10. Fonctions numériques envisageables

La famille peut mobiliser des fonctions réutilisables :
- registre des exploitations, parcelles et campagnes ;
- calendrier cultural et planification des opérations ;
- registre des intrants et inventaire ;
- suivi des équipes et travaux ;
- journal des interventions ;
- suivi des récoltes et pesées ;
- gestion post-récolte et stockage ;
- traçabilité des lots ;
- gestion de transformation et contrôle qualité ;
- gestion des coopératives, membres et collectes ;
- ventes, commandes, livraisons et paiements ;
- dépenses, recettes, coûts et marges ;
- maintenance des machines et équipements ;
- alertes, rapports et tableaux de bord.

Ces fonctions sont des briques possibles. Le diagnostic doit sélectionner celles qui répondent au besoin réellement confirmé.

## 11. Récits de test pour le moteur de compréhension

### Cas A — Suivi d'une petite exploitation
« J'ai trois champs. Cette année j'ai mis du maïs et du soja, mais je ne sais plus combien j'ai dépensé dans chaque champ. »

Attendu : reconnaître exploitation, parcelles, cultures, campagne, dépenses et besoin de ventilation des coûts. Ne pas supposer que les trois champs ont les mêmes superficies.

### Cas B — Pertes après récolte
« On récolte le manioc, mais avant de tout vendre une partie se gâte. Je veux savoir où ça se perd. »

Attendu : reconnaître récolte, manioc, stockage ou opérations post-récolte comme pistes à préciser, perte déclarée et besoin de traçabilité. Ne pas affirmer que la cause est l'humidité sans information.

### Cas C — Intrants et crédit
« Le fournisseur me donne les engrais maintenant et je paie après la récolte. Je veux suivre ça. »

Attendu : distinguer réception d'intrants, dette fournisseur, échéance et paiement différé. Ne pas confondre dette fournisseur et crédit accordé aux clients.

### Cas D — Irrigation
« Quand la pluie tarde, mes légumes souffrent. Je ne sais pas combien d'eau il faut mettre. »

Attendu : reconnaître maraîchage et contrainte hydrique, demander localisation, culture, stade et système d'irrigation avant toute estimation technique. Ne pas inventer une dose d'arrosage.

### Cas E — Coopérative
« Nous sommes 35 producteurs. Chacun apporte ses sacs, on pèse, on vend ensemble et après il faut répartir l'argent. »

Attendu : reconnaître organisation collective, membres, apports, pesée, lots, vente groupée et répartition des recettes. Demander la règle de répartition au lieu de l'inventer.

### Cas F — Transformation
« J'achète du soja, je le transforme et je vends l'huile. Je veux connaître le coût de chaque production. »

Attendu : distinguer achat de matière première, transformation, rendement matière, emballage, charges et ventes. Ne pas présumer la méthode de calcul du coût.

## 12. Raccordement technique

Le catalogue est ajouté au registre universel via `createUniversalKnowledgeRegistry()` et exporté par le module de connaissance. Les identifiants de la nouvelle cartographie utilisent le suffixe de version `v2` pour éviter de remplacer les concepts historiques.

Une classification unique `foundation-a-family-v2` relie la famille, les cinq domaines, les sous-domaines et les spécialisations. Les concepts sont aussi raccordés au graphe de connaissances par des relations typées : appartenance, précision d'un domaine historique, activités possibles d'un métier, inclusion d'une activité dans un processus, contrainte et soutien fonctionnel.

Les propositions de termes propres à un projet restent dans le mécanisme existant de propositions privées. Aucun concept client n'est publié automatiquement dans le catalogue partagé.

## 13. Périmètre de la première intégration logicielle

Inclus :
- famille canonique et cinq domaines ;
- sous-domaines et spécialisations initiales ;
- métiers, activités, processus, problèmes, ressources, fonctions et indicateurs ;
- termes français et anglais, avec variantes lexicales françaises ;
- liens vers les domaines historiques agriculture et production alimentaire ;
- tests d'intégration du registre, de la hiérarchie et des concepts métier.

Non inclus à ce stade :
- encyclopédie exhaustive des cultures et variétés ;
- calendrier agronomique local par commune ;
- prescriptions phytosanitaires ou recommandations de dosage ;
- connexion à des données météo, marchés, fournisseurs ou satellites ;
- import complet de classifications internationales ;
- persistance dédiée en base de données ;
- interface d'administration de la taxonomie.

Ces éléments seront traités séparément avec leurs sources, validations et exigences de sécurité.
