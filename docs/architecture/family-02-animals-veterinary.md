# MerKora GDJ — Fondation A : famille 02, Animaux et médecine vétérinaire

**Version :** 1.0  
**Date :** 16 novembre 2026  
**Statut :** Première intégration sectorielle en branche de travail ; vérification CI en cours.  
**Référentiel :** Fondation A ouverte, concepts et relations versionnés.

## 1. Périmètre

La famille couvre l'élevage et la production animale, la médecine vétérinaire et la santé animale, les animaux de compagnie et services animaliers, le bien-être et la protection animale, la nutrition animale, la reproduction et la génétique, ainsi que la collecte primaire des produits animaux.

Elle ne remplace pas la famille Agriculture et agroalimentaire. Les productions végétales et la transformation agroalimentaire restent dans leur famille respective. La pêche et l'aquaculture conservent le domaine transversal existant et ne sont pas absorbées par cette famille.

## 2. Réutilisation du référentiel existant

Le domaine canonique historique `domain:livestock` (« Élevage ») est réutilisé tel quel. Aucun second concept « Élevage » n'est créé et son identité, sa définition et son rattachement historique ne sont pas réécrits. La nouvelle famille le référence par une relation explicite `also_classified_in_family`.

Les relations inter-familles expriment les interfaces de chaîne de valeur : alimentation animale et productions végétales ; collecte primaire et transformation agroalimentaire ; élevage et agriculture. Une relation d'intersection ne signifie pas que les domaines sont identiques.

## 3. Volume du premier corpus

Le catalogue ajoute 132 concepts structurés, auxquels s'ajoute le rattachement non duplicatif du domaine historique « Élevage » :
- 1 famille et 6 nouveaux domaines ;
- 26 sous-domaines et 6 spécialisations ;
- 18 métiers ;
- 20 activités et 10 processus ;
- 14 problèmes ;
- 14 ressources ;
- 10 fonctions et 7 indicateurs.

Le domaine canonique `domain:livestock` est réutilisé, et non compté comme une nouvelle création.

## 4. Domaines couverts

1. Élevage (concept canonique existant, réutilisé avec un rattachement familial additionnel non destructif).
2. Médecine vétérinaire et santé animale.
3. Animaux de compagnie et services animaliers.
4. Bien-être et protection animale.
5. Nutrition et alimentation animales.
6. Reproduction et génétique animales.
7. Productions animales et collecte primaire.

## 5. Sous-domaines

Le premier corpus comprend 26 sous-domaines : élevage bovin, petits ruminants, porcin, aviculture, cuniculture, apiculture ; médecine vétérinaire clinique et préventive, chirurgie, diagnostic et laboratoire, épidémiologie, pharmacie vétérinaire ; chiens et chats, services équins, pension et garde, toilettage ; refuges, identification et traçabilité, transport et bien-être ; nutrition, formulation des aliments, fourrages et pâturages ; reproduction, génétique et sélection ; collecte des produits animaux et production primaire de viande.

## 6. Spécialisations

Six spécialisations initiales : élevage laitier, poulets de chair, poules pondeuses, élevage familial, gestion sanitaire des troupeaux et urgences vétérinaires.

## 7. Métiers et professions

Le corpus comprend 18 professions : vétérinaire, auxiliaire vétérinaire, technicien en santé animale, éleveur, aviculteur, éleveur bovin, éleveur de petits ruminants, éleveur porcin, apiculteur, spécialiste en nutrition animale, technicien en reproduction animale, sélectionneur animal, responsable de refuge, toiletteur animalier, éducateur canin, agent de collecte de produits animaux, technicien de laboratoire vétérinaire et agent de protection animale.

Les rôles et titres professionnels sont descriptifs. Les actes réservés, autorisations et champs de compétence dépendent de la réglementation du pays.

## 8. Activités et processus

Vingt activités couvrent examen clinique, vaccination, signalement, isolement, alimentation, pesée, reproduction, suivi de traitement, identification, mouvements, nettoyage, biosécurité, enregistrement sanitaire, formulation de ration, collecte du lait, des œufs et du miel, admission en refuge, toilettage et gestion du stock vétérinaire.

Dix processus relient ces activités : suivi sanitaire, consultation vétérinaire, campagne de vaccination, cycle de reproduction, cycle d'alimentation, traçabilité d'un lot, accueil et adoption, collecte primaire, réponse à un foyer de maladie et gestion des médicaments vétérinaires.

## 9. Problèmes, ressources, fonctions et indicateurs

Quatorze problèmes initiaux sont décrits : mortalité, suspicion de maladie contagieuse, faible productivité, manque ou coût élevé de l'alimentation, difficultés de reproduction, blessure, fuite ou perte, vol, défaut d'identification, risque de bien-être, péremption de produits, altération de produits et absence de registres.

Quatorze ressources couvrent troupeau, dossier individuel, bâtiments, aliments, fourrages, médicaments, matériel vétérinaire, dispositifs d'identification, incubateur, ruche, matériel de traite, abreuvoir, véhicule et équipement de conservation initiale.

Dix fonctions et sept indicateurs sont inclus, notamment gestion du troupeau, suivi sanitaire, vaccination, reproduction, stock vétérinaire, traçabilité, taux de mortalité, natalité, couverture vaccinale, gain moyen quotidien, indice de consommation, taux de ponte et production laitière par animal.

Tout indicateur devra être contextualisé par espèce, catégorie, population de référence et période. Sa formule ne doit pas être appliquée sans données compatibles.

## 10. Sécurité et précautions

Le référentiel ne produit pas de diagnostic, de prescription, de dosage ni de calendrier vaccinal autonome. Toute recommandation médicale doit être validée par un vétérinaire habilité. Les symptômes rapportés sont des observations à conserver comme telles, pas des diagnostics confirmés.

Les données sanitaires, traitements, propriétaires et mouvements d'animaux doivent être protégés selon les règles locales. Les maladies réglementées, zoonoses, médicaments vétérinaires, transport et abattage exigent le respect des autorités et textes applicables.

## 11. Tests d'acceptation

- Reconnaître « volaille » comme sous-domaine aviculture.
- Reconnaître « vaccination animale » comme activité et non comme métier ou maladie.
- Reconnaître « vétérinaire » comme profession.
- Reconnaître « apiculture » sans la confondre avec aviculture.
- Reconnaître « alimentation du bétail » comme nutrition animale.
- Remonter du sous-domaine vétérinaire à la famille et au domaine.
- Réutiliser `domain:livestock` sans créer un doublon.
- Raccorder les graphes de situation sans modifier les mots d'origine, les preuves ou les relations de l'utilisateur.
- Préserver les concepts inconnus et les ambiguïtés plutôt que forcer une correspondance.

## 12. Scénarios de compréhension multi-projets

1. **Élevage avicole :** « J'ai 500 poulets, depuis trois jours ils mangent moins et plusieurs meurent. » Le moteur doit distinguer l'espèce et le lot, les observations rapportées, la durée et la mortalité. Il ne doit pas inventer de maladie ni de cause et doit orienter vers un vétérinaire compétent.
2. **Cabinet vétérinaire :** « Je veux suivre les consultations, les vaccins, les médicaments et les prochains rendez-vous. » Le moteur doit reconnaître le parcours de consultation, les événements sanitaires, le stock vétérinaire et les rappels, sans produire de prescription.
3. **Élevage bovin :** « J'ai des vaches, je veux suivre les naissances, les maladies, les ventes et les dépenses. » Le moteur doit distinguer troupeau, reproduction, suivi sanitaire, commercialisation et gestion financière.
4. **Apiculture :** « J'ai plusieurs ruches et je ne sais pas combien chacune produit. » Le moteur doit reconnaître l'apiculture, les ruches, les récoltes et la mesure de production, sans confondre apiculture et aquaculture.
5. **Refuge animalier :** « Les animaux arrivent, certains repartent chez des familles, je perds le suivi. » Le moteur doit reconnaître admissions, dossiers individuels, hébergement, adoption et traçabilité.
6. **Nutrition animale :** « Je fabrique la provende, mais je veux suivre les matières premières, les recettes, les lots et les clients. » Le moteur doit distinguer formulation, production d'aliments, stock, lots et vente, sans inventer de formule nutritionnelle.

Ces scénarios servent à tester l'extraction des concepts, les relations, les inconnues et les questions suivantes du diagnostic. Ils ne constituent pas des conseils vétérinaires.

## 13. Limites de la version initiale

Les termes, définitions et relations sont un premier corpus organisé par MerKora. Ils nécessitent une revue par des professionnels de l'élevage, des vétérinaires et des spécialistes locaux avant usage réglementaire ou opérationnel. Le catalogue reste ouvert : de nouvelles espèces, filières, métiers, pratiques et spécialités pourront être ajoutés sans réécrire les identifiants existants.
