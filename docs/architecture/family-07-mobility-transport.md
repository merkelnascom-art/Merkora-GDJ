# Fondation A — Famille 07 : Mobilité et transport

**Version :** 1.0 — 16 novembre 2026  
**Identifiant canonique :** `family:mobility-transport`  
**Statut :** catalogue initial bilingue raccordé au registre universel ; révision métier et CI requises avant fusion.

## 1. Périmètre et frontière avec la famille 08

La famille couvre les services de transport de personnes et de marchandises, l'exploitation des moyens de transport, les réseaux et infrastructures de mobilité, les opérations de trajet, les titres de transport, les équipages, les flottes et la sécurité opérationnelle.

Elle réutilise les cinq domaines canoniques déjà présents dans la cartographie universelle :
- `domain:road-transport` — transport routier ;
- `domain:rail-transport` — transport ferroviaire ;
- `domain:maritime-transport` — transport maritime ;
- `domain:aviation` — aviation ;
- `domain:urban-mobility` — mobilité urbaine.

**Frontière importante :** la famille 08 `logistics-supply-chain` reste distincte. Elle porte notamment l'entreposage, les stocks, la préparation de commandes, le transit/commission de transport, les services postaux et la distribution logistique. La famille 07 traite l'exécution du transport et du déplacement ; elle ne devient pas un catalogue général d'entrepôts ou de gestion de stock. Le fret demeure une activité de transport, tandis que la chaîne logistique qui l'entoure peut relever de la famille 08.

Le transport de marchandises n'est pas confondu avec le transport de voyageurs ; les billets et réservations de passagers ne sont pas des documents de fret ; une mission de transport n'est pas un stock entreposé.

## 2. Sous-domaines

**Routier :** transport routier de voyageurs ; transport routier de marchandises ; autocars et interurbain ; taxis et transport à la demande ; transport collectif routier spécialisé.

**Ferroviaire :** transport ferroviaire de voyageurs ; transport ferroviaire de marchandises ; exploitation des réseaux et infrastructures ferroviaires.

**Maritime et fluvial :** transport maritime de voyageurs ; transport maritime de marchandises ; transport fluvial et lagunaire ; opérations de transport portuaire.

**Aérien :** transport aérien de voyageurs ; transport aérien de marchandises ; opérations au sol et assistance aéroportuaire.

**Mobilité urbaine :** transport public urbain ; mobilité partagée et micromobilité ; gestion de la circulation et des déplacements urbains.

## 3. Spécialisations

- Transport scolaire.
- Transport sanitaire et d'urgence.
- Transport de marchandises dangereuses.
- Transport multimodal et intermodal.
- Transport accessible et inclusif.

Les exigences réglementaires et les habilitations sont à déterminer selon le pays, le mode de transport et l'autorité compétente.

## 4. Métiers

Conducteur professionnel ; conducteur d'autobus ou d'autocar ; conducteur de taxi ou véhicule avec chauffeur ; régulateur/dispatcheur transport ; gestionnaire de flotte ; agent d'exploitation ferroviaire ; conducteur de train ; capitaine/patron de navire ; agent d'exploitation portuaire ; pilote d'aéronef ; agent d'exploitation aéroportuaire ; chargé d'études en mobilité urbaine.

Cette liste est un socle initial : elle n'est pas une nomenclature réglementaire exhaustive des professions.

## 5. Activités

Planification d'itinéraire ; affectation et départ des véhicules ; embarquement des voyageurs ; vérification et validation des titres ; chargement et déchargement ; mise à jour du statut d'expédition ; inspection avant départ ; planification des équipages ; réponse opérationnelle aux incidents ; coordination de la maintenance des véhicules.

## 6. Processus

Réservation jusqu'à l'arrivée du voyageur ; ordre de transport de marchandises ; coordination multimodale ; disponibilité et affectation de flotte ; cycle de maintenance ; gestion des perturbations ; rotation et escale portuaire/aéroportuaire.

## 7. Problèmes

Retard ; annulation ; panne ou immobilisation ; perturbation d'itinéraire ; accident ; bagage ou marchandise égaré ; inadéquation capacité/demande ; incident de sécurité concernant les voyageurs.

Un problème est un événement ou une situation à traiter. Il ne doit pas être confondu avec une activité telle que la planification, le dispatch ou l'intervention.

## 8. Ressources

Véhicules et moyens de transport ; infrastructures et points de transport ; conducteurs, équipages et personnel ; billets, titres et réservations ; documents et preuves de transport de marchandises ; carburants et énergie de traction.

## 9. Fonctions numériques que MerKora pourra proposer

- Réservation, billetterie et gestion des places.
- Gestion des véhicules, documents, conducteurs et flottes.
- Dispatch, planification et optimisation des itinéraires.
- Information voyageurs, horaires et alertes de perturbation.
- Suivi des missions de transport et événements d'expédition.
- Maintenance, pannes, contrôles et disponibilité des moyens de transport.

Ces fonctions sont des capacités de logiciel possibles, pas des obligations identiques pour toutes les entreprises.

## 10. Indicateurs

Ponctualité ; utilisation des véhicules ; taux de remplissage ou de charge ; coût par kilomètre ; taux d'incidents ; réalisation des trajets planifiés. Toute comparaison doit préciser la formule, la période, le mode de transport et le périmètre.

## 11. Règles de compréhension MerKora

- Identifier d'abord si la demande concerne des personnes, des marchandises, ou les deux.
- Identifier le mode : route, rail, mer/eaux intérieures, air ou mobilité urbaine.
- Distinguer réservation, billet, trajet, ordre de transport, expédition et preuve de remise.
- Distinguer conducteur, dispatcheur, gestionnaire de flotte, agent d'exploitation et responsable logistique.
- Distinguer panne, retard, annulation, incident et accident.
- Distinguer flotte de véhicules et stock de marchandises.
- Orienter les besoins dominés par l'entreposage, le stock, la préparation de commandes, le transit ou la chaîne d'approvisionnement vers la famille 08, tout en conservant les liens transversaux nécessaires.
- Ne pas déduire une cause d'un retard ou d'un incident sans preuve ; recueillir les faits, hypothèses et validations séparément.

## 12. Sécurité, conformité et précautions

Les règles de permis, licences, assurance, temps de conduite et de repos, sûreté, transport de matières dangereuses, sécurité maritime/aérienne/ferroviaire, documents de fret, accessibilité et protection des passagers varient selon les juridictions et les modes. Le système doit recueillir le pays, la zone d'opération, le mode et le type de service avant de proposer des règles applicables.

Les fonctions de géolocalisation doivent respecter les obligations de confidentialité et informer les personnes concernées. Les données de trajet, passagers, équipages et marchandises doivent être protégées par des accès adaptés et des durées de conservation définies.

Aucun changement Supabase, aucune suppression de données et aucun déploiement ne sont inclus.
