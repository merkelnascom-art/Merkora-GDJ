# MerKora GDJ — Fondation A : famille 03, Environnement et ressources naturelles

**Version :** 1.0  
**Date :** 16 novembre 2026  
**Statut :** Catalogue intégré au registre de connaissances sur une branche isolée ; vérification CI à effectuer.  
**Famille universelle réutilisée :** `family:environment-natural-resources`.

## 1. Périmètre et règles de classification

Cette famille couvre la gestion environnementale, l'eau, les déchets, le climat, les risques naturels et les ressources naturelles. Elle s'appuie sur les cinq domaines canoniques déjà présents dans la cartographie universelle :
- `domain:environment` — Environnement ;
- `domain:water-management` — Gestion de l'eau ;
- `domain:waste-management` — Gestion des déchets ;
- `domain:climate-energy-transition` — Climat et transition écologique ;
- `domain:natural-resource-management` — Gestion des ressources naturelles.

Aucun nouveau concept famille ou domaine n'est créé pour ces identités déjà existantes. Les sous-domaines et concepts spécialisés sont rattachés à ces domaines via la classification `universal-domain`, de façon à préserver le chemin de classification jusqu'à la famille universelle.

La famille ne doit pas absorber automatiquement l'agriculture, la foresterie, les mines, l'énergie, les services d'eau ou les travaux publics : les interfaces et responsabilités sont modélisées par relations, et les concepts canoniques restent distincts.

## 2. Sous-domaines

Le premier corpus comprend 19 sous-domaines :
- Évaluation environnementale ;
- Management environnemental ;
- Prévention et contrôle des pollutions ;
- Surveillance environnementale ;
- Approvisionnement en eau ;
- Traitement et qualité de l'eau ;
- Eaux usées et assainissement ;
- Gestion des bassins versants ;
- Collecte des déchets solides ;
- Tri et recyclage ;
- Déchets dangereux ;
- Déchets organiques et compostage ;
- Adaptation au changement climatique ;
- Inventaires de gaz à effet de serre ;
- Réduction des risques de catastrophe ;
- Forêts et écosystèmes forestiers ;
- Biodiversité et conservation ;
- Terres et gestion des sols ;
- Ressources minérales naturelles.

## 3. Spécialisations

Trois spécialisations initiales :
- Gestion intégrée des ressources en eau ;
- Économie circulaire ;
- Solutions fondées sur la nature.

Elles sont des spécialisations de navigation et de connaissance, pas des certifications ou autorisations professionnelles.

## 4. Métiers et professions

Six professions initiales : chargé de l'environnement, ingénieur environnemental, hydrologue, gestionnaire des déchets, technicien forestier et écologue. Les intitulés, compétences et habilitations devront être contextualisés selon le pays et le secteur.

## 5. Activités et processus

Six activités : prélèvement d'eau, collecte des déchets, tri des déchets, plantation d'arbres, inspection environnementale, inventaire de biodiversité et contrôle de la qualité de l'eau.

Quatre processus : cycle de surveillance environnementale, cycle de gestion des déchets solides, cycle du service d'eau et processus d'évaluation environnementale.

## 6. Problèmes, ressources, fonctions et indicateurs

Le corpus initial couvre les pénuries et contaminations d'eau, déchets non collectés et dépôts sauvages, dégradation des sols, perte de biodiversité et risques d'inondation. Les ressources incluent les ressources en eau, stations de suivi, conteneurs et centres de tri/recyclage.

Fonctions envisageables : signalement environnemental, suivi des circuits de déchets, registre de qualité de l'eau et plan d'actions environnementales.

Indicateurs : taux de collecte des déchets, taux de pertes en eau, taux de survie des plants et taux de conformité de la qualité de l'eau. Chaque indicateur exige une méthode, une période, un périmètre, une unité et une source documentés ; aucune valeur ne doit être inférée.

## 7. Relations avec les autres familles

- Agriculture : sols, irrigation, eau, intrants et impacts des pratiques agricoles.
- Animaux : habitats, biodiversité, santé des écosystèmes et gestion des effluents d'élevage.
- Industrie : rejets, conformité, déchets de production et prévention des pollutions.
- Construction : études d'impact, gestion des eaux pluviales, déblais et risques de chantier.
- Énergie : émissions, transition énergétique et impacts des infrastructures.
- Transport et logistique : émissions, déchets, incidents et risques liés aux infrastructures.
- Administration : permis, inspections, signalements, plans et rapports.
- Numérique : capteurs, cartographie, télédétection, registres et tableaux de bord.

Ces relations décrivent des interfaces et ne prouvent pas une causalité.

## 8. Scénarios de compréhension

1. « Les ordures ne sont plus ramassées dans notre quartier. » Reconnaître un problème de collecte, demander la zone, la période, les déchets concernés et l'organisation responsable ; ne pas supposer la cause.
2. « L'eau du forage a changé de couleur. » Enregistrer une observation de qualité de l'eau, la source, la date et les usages ; ne pas conclure à une contamination confirmée ni déclarer l'eau potable.
3. « Nous plantons 2 000 arbres mais je ne sais pas combien survivent. » Reconnaître plantation, suivi des plants, cohorte et taux de survie ; demander les dates et la méthode de comptage.
4. « Une usine rejette de l'eau dans le cours d'eau. » Distinguer observation, suspicion de pollution, site, activité industrielle et besoin de signalement/inspection ; ne pas affirmer une infraction sans éléments.
5. « Notre village est inondé chaque saison des pluies. » Identifier événement récurrent, exposition et besoin de prévention ; demander dates, zones, impacts et dispositifs existants, sans prétendre prédire l'inondation.
6. « Je veux organiser la collecte, le tri et la vente du plastique. » Identifier les étapes de la chaîne de déchets et les liens avec commerce, logistique et finance.

## 9. Sécurité, fiabilité et limites

- Une observation, une mesure, une suspicion et un résultat certifié sont des statuts différents.
- La qualité de l'eau doit être évaluée par des prélèvements et méthodes appropriés ; MerKora ne certifie pas la potabilité.
- Une étude d'impact, une inspection ou une déclaration de conformité relève des procédures et autorités applicables.
- Les alertes de catastrophe ne doivent pas remplacer les autorités officielles.
- Les données géographiques, photos, mesures et signalements peuvent être sensibles et doivent être protégés.
- Les indicateurs ne sont calculés que si leur dénominateur, leur période, leur périmètre et leur méthode sont connus.

## 10. Intégration technique

Le catalogue est exporté par `knowledge/index.ts` et ajouté à `createUniversalKnowledgeRegistry()` dans `knowledge/registry.ts`. Il réutilise les cinq domaines canoniques existants, ajoute des concepts sectoriels bilingues avec provenance, statut de revue et notes de fiabilité, et publie des relations vérifiables. Aucun changement de base de données ni déploiement de production n'est requis pour ce catalogue statique.

## 11. Limites de la version initiale

Le corpus est une base de structuration, pas une nomenclature exhaustive ni un avis réglementaire. Il doit être enrichi et relu par des spécialistes de l'eau, de l'assainissement, de la gestion des déchets, de l'écologie et des autorités locales avant usage opérationnel ou réglementaire.
