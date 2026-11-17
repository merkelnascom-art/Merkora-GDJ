# Fondation A — Famille 04 : Industrie et fabrication

**Version :** 1.0 — 16 novembre 2026  
**Identifiant canonique :** `family:manufacturing-industry`  
**Statut :** catalogue initial intégré à la branche de travail, sous réserve des contrôles CI et de revue métier.

## Périmètre

Cette famille couvre la conception et l'organisation des systèmes industriels, la fabrication mécanique, les systèmes électriques et électroniques, les textiles et l'habillement, ainsi que la production industrielle. Elle réutilise les cinq domaines canoniques déjà présents dans la cartographie universelle :

- `domain:mechanical-engineering` — Génie mécanique ;
- `domain:electrical-engineering` — Génie électrique ;
- `domain:electronics` — Électronique ;
- `domain:textile-fashion` — Textile et habillement ;
- `domain:industrial-production` — Production industrielle.

Les industries extractives restent une famille distincte dans la cartographie universelle ; elles ne sont pas absorbées ici.

## Sous-domaines couverts

Ingénierie industrielle ; planification et ordonnancement ; ingénierie des procédés ; assemblage ; usinage ; soudage et chaudronnerie ; maintenance industrielle ; automatisation ; robotique ; installations électriques industrielles ; électronique industrielle ; systèmes embarqués et contrôle-commande ; instrumentation et métrologie ; filature et tissage ; teinture et ennoblissement ; confection ; qualité et contrôle ; santé et sécurité au travail ; conditionnement ; approvisionnement industriel.

## Spécialisations

Production au plus juste (Lean), fabrication additive, efficacité énergétique industrielle et fabrication intégrée par ordinateur.

## Métiers, activités et processus

Le catalogue initial comprend notamment les métiers d'ingénieur industriel, responsable de production, technicien de maintenance, électricien industriel, technicien en automatisme, contrôleur qualité, soudeur et opérateur textile.

Les activités représentées incluent le lancement d'ordres de fabrication, le réglage machine, la maintenance préventive, l'inspection qualité, l'étalonnage, le soudage, la coupe textile et la déclaration de production.

Les processus couvrent le cycle d'ordre de fabrication, la maintenance, le contrôle qualité, l'approvisionnement, le traitement des non-conformités et la gestion de la sécurité.

## Problèmes, ressources et fonctions numériques

Les problèmes modélisés comprennent les arrêts machine, retards de production, défauts, ruptures de matières, coûts élevés, risques d'accident et surconsommation énergétique. Les ressources incluent machines, pièces de rechange, matières premières, documentation technique et instruments de mesure.

Les fonctions numériques proposées comprennent planning/ordonnancement, gestion de maintenance, traçabilité qualité, stocks industriels et suivi d'état des machines. Les indicateurs comprennent rendement, disponibilité, efficacité globale des équipements, taux de défauts et réalisation dans les délais.

## Règles de modélisation et précautions

- Les domaines canoniques existants sont réutilisés ; aucun domaine universel en double n'est créé.
- Les sous-domaines sont reliés par classification `universal-domain` et remontent vers la famille via le domaine parent.
- Un métier, une activité, un processus, un problème et une fonction logicielle restent des concepts distincts.
- Les valeurs de production, seuils qualité, méthodes de sécurité, qualifications et exigences réglementaires dépendent du procédé et du territoire ; elles ne sont pas présumées par ce catalogue.
- Les concepts sont bilingues FR/EN et portent une provenance ainsi qu'une note de revue. Le contenu est une base de compréhension, pas une certification technique ou réglementaire.
- Aucun changement de base Supabase et aucun déploiement ne sont inclus.
