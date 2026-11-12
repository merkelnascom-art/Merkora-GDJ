# Dossier stratégique MerKora GDJ — les 13 domaines

> Version de conception 1.0 — 12 novembre 2026  
> Statut : **proposition structurante à vérifier**. Ce dossier documente la vision, les règles de fonctionnement et la méthode de fabrication. Il ne constitue pas une autorisation de déploiement, de dépense, de modification destructive ou de décision métier à la place du client.

## Objet du dossier

MerKora GDJ doit être une **plateforme universelle de compréhension, de conception et de fabrication de solutions numériques**. Elle ne doit pas être un catalogue rigide de logiciels prédéfinis. Elle doit partir du problème réel d'une personne ou d'une organisation, comprendre le métier, identifier les utilisateurs et les contraintes, proposer une solution adaptée, laisser le client arbitrer, puis transformer les choix validés en spécifications, prototype, application testée et livrable exploitable.

Les 13 domaines sont des portes d'entrée métier et des référentiels de connaissance. Ils ne sont ni 13 applications indépendantes, ni des limites imposées à l'utilisateur. Un projet peut relever de plusieurs domaines.

## Documents directeurs — à lire en premier

1. **[Conception générale unifiée de MerKora GDJ](./08-conception-generale-unifiee-merkora.md)** — vision, parcours adaptatif, classification hybride, rôles, données, propositions, maquettes, fabrication, sécurité et livraison.
2. **[Référentiel universel des domaines, secteurs et métiers](./09-referentiel-universel-domaines-secteurs-metiers.md)** — 20 familles, cartographie initiale de 100 secteurs, capacités transversales, modèle de fiche métier et méthode d'expansion vers 2 000 à 3 000 métiers/spécialisations.

Le référentiel 09 est une première cartographie structurée, pas encore un catalogue de 2 000 à 3 000 fiches métier approfondies. Ces fiches doivent être enrichies et validées progressivement. Les 13 dossiers métiers historiques restent disponibles et ne sont pas remplacés.

---

## Lire le dossier dans cet ordre

1. [Vision, principes et périmètre](./00-vision-principes-et-perimetre.md)
2. [Architecture fonctionnelle et technique cible](./01-architecture-fonctionnelle-et-technique.md)
3. [Méthode de travail de MerKora, de l'idée à la livraison](./02-methode-de-travail-et-cycle-de-fabrication.md)
4. [Organisation, rôles, validations et gouvernance](./03-organisation-gouvernance-et-controles.md)
5. [Modèle transversal : capacités communes à tous les projets](./04-socle-transversal-et-regles-communes.md)
6. [Les 13 dossiers métiers](#les-13-dossiers-métiers)
7. [Plan de mise en œuvre](./05-plan-de-mise-en-oeuvre-et-criteres-de-reussite.md)
8. [Glossaire et décisions ouvertes](./06-glossaire-et-decisions-ouvertes.md)
9. [Conception hybride et parcours client adaptatif](./07-conception-hybride-et-parcours-client.md)
10. [Référentiel universel des 20 familles et 100 secteurs](./09-referentiel-universel-domaines-secteurs-metiers.md)

## Les 13 dossiers métiers

Chaque dossier suit le même cadre : finalité et profils, projets possibles, questions adaptatives, processus, rôles et écrans, données, modules et intégrations, règles métier, sécurité, indicateurs, exemple, critères d'acceptation.

1. [Sport, fitness et compétitions](./domaines/01-sport-fitness-competitions.md)
2. [Santé, médical et bien-être](./domaines/02-sante-medical-bien-etre.md)
3. [Agriculture, élevage et environnement](./domaines/03-agriculture-elevage-environnement.md)
4. [Commerce, vente et e-commerce](./domaines/04-commerce-vente-ecommerce.md)
5. [Entrepreneuriat, finance et gestion d'entreprise](./domaines/05-entrepreneuriat-finance-gestion.md)
6. [Immobilier, BTP et gestion locative](./domaines/06-immobilier-btp-gestion-locative.md)
7. [Éducation, formation et orientation](./domaines/07-education-formation-orientation.md)
8. [Transport, logistique et automobile](./domaines/08-transport-logistique-automobile.md)
9. [Restauration, hôtellerie et événementiel](./domaines/09-restauration-hotellerie-evenementiel.md)
10. [Ressources humaines et gestion du personnel](./domaines/10-ressources-humaines-personnel.md)
11. [Artisanat, métiers techniques et services](./domaines/11-artisanat-metiers-services.md)
12. [Administration, vie citoyenne et services publics](./domaines/12-administration-vie-citoyenne-services-publics.md)
13. [Voyages, tourisme, loisirs, création et jeux](./domaines/13-voyages-tourisme-loisirs-creation-jeux.md)

## Règle fondamentale

Une option affichée par l'IA est une **proposition**, pas une fonctionnalité achetée, commandée, activée ou validée. Seules les options choisies et confirmées par le client entrent dans le périmètre de conception. Les décisions sensibles, les estimations financières, les paiements, les publications, les accès aux données et les mises en production exigent les validations prévues.

## État technique connu au moment de la rédaction

Le code contient un registre des 13 domaines dans `src/lib/domain-registry.ts`, un catalogue d'options métier et transversales dans `src/lib/domain-options.ts`, une intégration au studio de maquette et à la génération de plans, ainsi que des tests associés. Cette documentation décrit la cible fonctionnelle ; elle ne prétend pas que chaque capacité métier est déjà développée ou certifiée.

Branche de travail : `feature/merkora-factory-unified-runtime`. Aucun merge ni déploiement en production n'est inclus dans cette opération.
