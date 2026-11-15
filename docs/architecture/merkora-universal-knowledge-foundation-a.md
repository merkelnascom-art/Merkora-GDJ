# MerKora GDJ — Fondation A : référentiel universel des connaissances

**Version :** 1.0  
**Date :** 15 novembre 2026  
**Statut :** Intégration réalisée dans une branche isolée ; vérification CI en cours sur la dernière révision  
**Périmètre :** noyau TypeScript, registre de concepts, correspondance contrôlée, propositions privées et raccordement au graphe de situation.

## 1. Finalité

La Fondation A fournit à MerKora une représentation structurée et évolutive des connaissances : concepts, définitions, termes, classifications, propriétés, relations, sources, portée géographique, versions et niveau de fiabilité.

Elle doit servir tous les projets, métiers, activités, domaines, recherches, créations et situations humaines. Aucun catalogue ou ensemble de catégories n'est une frontière du système.

## 2. Principes obligatoires

1. Identifiants canoniques indépendants des langues.
2. Définitions et termes multilingues, contextualisables par pays, région et usage.
3. Classification multiple et relations transversales ; une taxonomie arborescente n'est qu'une vue possible.
4. Types de concept et prédicats extensibles.
5. Provenance et statut épistémique conservés.
6. Historique versionné ; pas de remplacement silencieux.
7. Les concepts inconnus restent représentables sans classification forcée.
8. Les propositions issues d'un projet restent privées jusqu'à approbation explicite.
9. Les correspondances lexicales sont distinguées des identités sémantiques.
10. Le référentiel partagé est séparé des faits et données propres à un projet.

## 3. Modèle conceptuel

### 3.1 Concept

Un concept contient :
- `id` stable ;
- `canonicalKey` unique ;
- `conceptType` ouvert ;
- définitions par langue ;
- termes et synonymes avec langue, région, registre et statut ;
- classifications multiples ;
- attributs typés ;
- relations entrantes/sortantes ;
- portée globale ou locale ;
- statut de cycle de vie et version ;
- sources et métadonnées de fiabilité.

### 3.2 Relation

Une relation contient :
- identifiant ;
- concept source et concept cible ;
- prédicat ouvert ;
- direction ;
- conditions et contexte éventuels ;
- statut de validation ;
- provenance ;
- version.

Les relations peuvent exprimer hiérarchie, appartenance, spécialisation, activité, causalité, dépendance, fonction, temporalité, spatialité, mesure, intention ou incompatibilité. Les prédicats ne sont pas fermés à cette liste.

### 3.3 Statuts

Les statuts de connaissance distinguent au minimum :
- proposé ;
- en revue ;
- validé ;
- contesté ;
- déprécié ;
- rejeté.

La fiabilité de la source est séparée du statut de validation : une source faisant autorité n'implique pas qu'une relation soit automatiquement applicable au projet courant.

## 4. Noyau de concepts

Le registre initial fournit uniquement les primitives universelles utiles à la représentation : acteur, activité, processus, opération, événement, objet, ressource, objectif, problème, résultat, contrainte, lieu, temps, information, règle, solution, service, produit et projet.

Ce noyau n'est ni une liste de métiers ni une taxonomie exhaustive. Toute extension peut ajouter un nouveau type ou concept sans modifier le cœur.

## 5. Normalisation et recherche

La normalisation retire les variations techniques de casse, espaces et Unicode, sans effacer les formes originales conservées dans les termes.

La première recherche est déterministe :
1. terme exact ;
2. terme normalisé ;
3. synonyme ;
4. compatibilité de type demandée par l'appelant ;
5. détection d'ambiguïté.

Le résultat doit distinguer correspondance exacte, normalisée, synonyme, correspondance par type, ambiguïté et absence de correspondance. Plusieurs meilleurs candidats ne doivent jamais être départagés arbitrairement.

Aucune distance lexicale ou similarité sémantique non calibrée ne sera présentée comme une compréhension. Les embeddings et la compréhension linguistique avancée ne font pas partie de cette fondation.

## 6. Concepts inconnus et séparation des espaces

Lorsqu'un concept n'est pas reconnu, le projet peut créer une proposition comprenant :
- projectId ;
- libellé original ;
- description éventuelle ;
- langue ;
- citation exacte ;
- identifiant du message source ;
- date et statut.

La proposition ne modifie pas le registre partagé. Sur l'écran 03, un terme sans correspondance peut être proposé explicitement ; la proposition est alors attachée au dossier du projet avec son libellé, sa citation et son message source. Elle reste dans l'espace privé du projet et ne modifie pas le registre partagé. Seule une approbation explicite crée un concept partagé, accompagnée de sa source de revue. Un rejet conserve la trace mais n'ajoute pas le concept au registre. La langue est marquée « und » (indéterminée) lorsqu'elle n'a pas été déterminée par un mécanisme fiable.

Aucune donnée personnelle ou information confidentielle de projet ne doit être copiée automatiquement dans le référentiel partagé.

## 7. Raccordement au graphe de situation

Chaque entité du graphe existant peut recevoir :
- un lien vers un concept de type universel correspondant à son kind ;
- un concept canonique optionnel si le libellé a une correspondance non ambiguë ;
- la méthode de correspondance et son score ;
- le statut de correspondance.

Le lien ne change ni l'identité de l'entité, ni ses preuves, ni les relations déjà établies. Une entité inconnue reste intacte et visible.

Les sessions existantes dépourvues de métadonnées knowledge doivent rester compatibles et pouvoir être enrichies à la reconstruction. Les dossiers historiques sont normalisés avec une liste de propositions vide si ce champ n'existait pas. Les liens restent des métadonnées et ne changent ni les citations, ni les statuts de preuve, ni les relations de situation.

L'écran 03 expose les repères du référentiel sans les présenter comme des faits supplémentaires déclarés par le client.

## 8. Architecture de stockage

La première intégration utilise un registre TypeScript pur, en mémoire, avec snapshots défensifs et contrats compatibles avec une future persistance relationnelle. Les révisions d'un concept créent une nouvelle version et archivent le snapshot précédent ; une version attendue obligatoire évite les modifications obsolètes. Les relations déclarées sur les concepts sont indexées dans le registre et leurs extrémités sont validées. Les classifications avec parent doivent référencer un concept existant. PostgreSQL pourra ensuite stocker séparément concepts, définitions, termes, classifications, relations, attributs, sources, preuves, versions, propositions, revues, conflits et portées.

Aucune migration, écriture ou modification Supabase n'est incluse dans cette livraison. Il ne faut pas utiliser un document JSON géant comme unique stockage du graphe.

## 9. Sécurité, coûts et compatibilité

- Aucun fournisseur IA externe ni service payant.
- Aucun secret ou clé API ajouté.
- Aucune migration Supabase.
- Aucune suppression ou réinitialisation de données.
- Aucun changement de production ou déploiement.
- Les champs ajoutés aux graphes sont optionnels pour lire les sessions antérieures.
- Les concepts partagés et les propositions privées restent séparés.
- Toute promotion vers le référentiel partagé doit être explicite et traçable.
- Les propositions d'un dossier sont conservées dans le sessionStorage du navigateur ; cette première livraison ne synchronise pas les propositions entre appareils ni entre comptes.
- La revue des propositions est exposée par les fonctions métier d'approbation/rejet ; aucune interface administrative globale ni authentification de revue n'est ajoutée dans cette fondation.

## 10. Tests d'acceptation

- Identifiants canoniques uniques et définitions multilingues.
- Normalisation Unicode et accents sans perte du terme d'origine.
- Correspondance exacte, normalisée et par synonyme.
- Ambiguïté retournée sans sélection arbitraire.
- Type ouvert et nouveau concept accepté sans modifier le code métier.
- Relations déclarées sur un concept indexées et validées avec leurs deux extrémités.
- Portées locales exigeant la concordance de toutes les dimensions déclarées.
- Correspondance filtrable par langue et région.
- Historique des concepts conservé avec contrôle de version attendu et rejet des modifications obsolètes.
- Snapshots du registre isolés des objets d'entrée mutables.
- Proposition inconnue conservée dans son projet et accessible depuis l'écran 03.
- Aucun effet sur le registre partagé avant approbation.
- Approbation explicite versionnée et rejet non publié.
- Graphe de situation enrichi sans modifier les preuves.
- Sessions historiques sans liens knowledge toujours lisibles.
- Tests existants des écrans 02, 03 et 04 non régressés.

## 11. Limites de cette intégration

- Le noyau contient des primitives universelles de représentation, pas une encyclopédie exhaustive de tous les domaines, métiers et professions.
- Le registre partagé chargé par défaut reste fourni par le code et conservé en mémoire dans cette version.
- Les propositions de projet sont sauvegardées dans le dossier navigateur courant ; elles ne sont pas encore synchronisées côté serveur.
- L'interface d'approbation/rejet globale et les permissions d'administrateur seront raccordées à une future couche de gouvernance sécurisée.

## 12. Hors périmètre

La compréhension linguistique générale, la résolution robuste des pronoms, les embeddings, les déductions logiques, le raisonnement causal, le moteur probabiliste, le questionnaire adaptatif avancé et les intégrations IA appartiennent aux fondations suivantes. La Fondation A ne prétend pas les remplacer.
