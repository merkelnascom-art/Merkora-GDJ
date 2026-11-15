# MerKora GDJ — référentiel universel et raccordement à l'écran 03

Version de conception : 1.1  
Date : 15 novembre 2026  
Branche : `feature/merkora-universal-reference-complete`

## 1. Cartographie MerKora

Le socle de navigation contient exactement :

- 20 familles de domaines ;
- 100 domaines d'activité ;
- 5 spécialisations transversales initiales rattachées à un domaine parent.

Les cinq spécialisations juridiques, judiciaires, de sécurité publique, de sécurité privée et de services personnels ne sont pas comptées comme cinq domaines supplémentaires. Elles sont conservées comme spécialisations afin de préserver le total de 100 domaines sans effacer ces réalités.

Les identifiants canoniques ne dépendent pas des libellés traduits. Les termes français et anglais actuellement présents sont des libellés initiaux, pas une traduction exhaustive de tous les domaines du monde.

## 2. Corpus professionnel externe

ESCO est utilisé comme source professionnelle externe et interrogeable. La Commission européenne indique 3 039 professions, 13 939 compétences et 28 langues pour ESCO. La version publiée actuellement sur son portail de téléchargement est v1.2.1.

- Portail officiel : https://esco.ec.europa.eu/fr/use-esco
- Téléchargement officiel : https://esco.ec.europa.eu/fr/use-esco/download
- API de suggestions documentée : https://ec.europa.eu/esco/api/doc/esco_api_doc.html

Le raccordement écran 03 interroge l'API ESCO à la demande pour les métiers/professions et les compétences/spécialisations, dans une langue choisie parmi les 28 codes supportés. Les résultats sont des suggestions externes, pas des décisions automatiques. La version utilisée par le service API est indiquée comme version par défaut du service et n'est pas artificiellement assimilée à v1.2.1.

**Limite explicite :** les 3 039 professions et 13 939 compétences ne sont pas encore copiées dans un miroir local ou une base persistante MerKora. Elles sont accessibles par recherche à la demande via ESCO. Le module d'import normalisé permet d'intégrer un paquet complet dès qu'un paquet officiel ou un export API complet est disponible.

## 3. Import, langues et identités stables

`importESCOBundle` accepte les concepts profession/compétence avec :

- URI externe stable ;
- libellés préférés par langue ;
- synonymes/variantes par langue ;
- définitions par langue ;
- relation hiérarchique éventuelle ;
- relations profession-compétence essentielles ou optionnelles ;
- version de dataset et horodatage ;
- correspondance MerKora explicite, lorsqu'elle a été validée.

Le parseur `parseESCOCsvLanguageFiles` accepte les exports CSV ESCO multilingues, les groupes de professions/compétences, les fichiers de relations hiérarchiques et les relations profession-compétence. Les paquets de langues successifs portant la même URI sont fusionnés dans le même concept canonique. Une nouvelle langue ou une correction réellement différente crée une nouvelle version et archive le snapshot précédent. Réimporter un paquet identique de la même version est idempotent. Les relations ont des identifiants stables et leur évolution crée également une version avec snapshot historique.

Les domaines MerKora ne sont pas attribués automatiquement aux professions ESCO. `domainMappings` exige une correspondance explicite vers un domaine existant ; l'absence de correspondance laisse la profession non classée localement.

## 4. Écran 03 — moteur de compréhension

L'écran 03 :

- utilise les 100 domaines et les spécialisations dans le moteur de rapprochement ;
- expose les chemins famille → domaine et domaine → spécialisation ;
- affiche toutes les entités du graphe, sans tronquer la liste à 16 ;
- conserve les ambiguïtés sans choisir arbitrairement ;
- permet de rechercher les professions ESCO dans la langue choisie ;
- affiche les libellés alternatifs et les fiches ESCO ;
- permet de proposer un rapprochement externe ou un nouveau concept.

La recherche ESCO ne valide pas automatiquement une profession. Le rapprochement reste une proposition privée du projet jusqu'à la revue humaine.

## 5. Gouvernance des inconnus et des correspondances externes

Une proposition de concept demeure attachée au projet avec son extrait source. Une référence ESCO choisie par l'utilisateur reste une candidate privée.

L'approbation humaine peut :
- créer un concept canonique MerKora ;
- fusionner le terme dans un concept existant ;
- publier la correspondance externe approuvée ;
- conserver l'identité URI ESCO et sa langue/version.

Un refus n'ajoute rien au registre partagé. Une proposition n'est jamais promue automatiquement parce que l'API ESCO a retourné un résultat.

## 6. Versionnage

Les concepts ont une version, un historique de snapshots et un contrôle de version attendue pour éviter les écrasements concurrents. Les relations ont un versionnage séparé et un historique de snapshots. Les imports ESCO multilingues utilisent le versionnage de concept lors d'une modification réelle.

## 7. Persistance et limites opérationnelles

Dans cette tranche, le registre partagé est construit depuis le code et conservé en mémoire côté application. Les propositions de l'écran 03 restent dans le dossier projet du navigateur/session. Aucun schéma Supabase ni aucune écriture de base n'a été ajouté.

Pour une gouvernance multi-administrateurs et une synchronisation multi-appareils, il faudra ultérieurement un stockage serveur avec authentification, permissions, audit et transactions. Ce raccordement n'est pas prétendu achevé ici.
