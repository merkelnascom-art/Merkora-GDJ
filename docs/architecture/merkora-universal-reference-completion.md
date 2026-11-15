# Référentiel universel MerKora GDJ — cartographie et import multilingue

## Cartographie de départ

Le catalogue MerKora contient une cartographie initiale de **20 familles et 100 domaines**. Les identifiants canoniques sont indépendants de la langue. Chaque domaine est relié à sa famille par une classification hiérarchique et une relation typée.

Cette carte est un point de départ extensible, non une liste fermée ni une nomenclature officielle de tous les pays. Les libellés initiaux français/anglais sont marqués comme cartographie à revoir ; les traductions et termes locaux supplémentaires sont ajoutés comme termes séparés et versionnés.

## Métiers, professions et compétences

Le modèle distingue les concepts `occupation`, `skill` et `domain`. Le module `esco-import.ts` importe des paquets ESCO normalisés : URI stables, libellés préférés par langue, synonymes par langue, descriptions, relations hiérarchiques et relations métier-compétence. Il préserve la version de la source et les URI externes. Aucun rattachement à un domaine MerKora n'est deviné : il faut fournir une correspondance de domaine explicitement revue.

La source de référence ciblée est ESCO v1.2.1. Le catalogue officiel est librement téléchargeable dans 28 langues, mais le paquet de données complet n'est pas embarqué dans ce dépôt à cette étape. L'importateur est prêt à ingérer les fichiers après leur normalisation ; tant que le paquet n'est pas fourni/importé, le dépôt ne prétend pas contenir les milliers de professions ESCO.

Source officielle : https://esco.ec.europa.eu/en/use-esco/download
Modèle et usages : https://esco.ec.europa.eu/en/use-esco

## Gouvernance des termes inconnus

Un terme inconnu demeure une proposition privée au projet, avec son extrait source et le message d'origine. Les doublons lexicaux de même langue sont signalés avant publication. La revue peut :
- créer un nouveau concept canonique ;
- rattacher le terme à un concept existant comme terme local après contrôle ;
- rejeter la proposition avec un motif.

L'extrait privé n'est jamais copié dans le référentiel partagé. La revue partagée nécessite une identité de réviseur et une validation côté serveur avant d'être exposée comme action d'administration.

## Historique

Les concepts sont révisés par version optimiste : l'ancienne version est archivée et les écritures concurrentes obsolètes sont rejetées. Les relations ont désormais leur propre numéro de version et un historique indépendant. Les URI externes et versions des jeux de données sont conservées pour la traçabilité.

## Écran 03

Le moteur de compréhension charge le registre universel. Les activités peuvent être rapprochées d'un domaine ou d'une profession ; les rôles d'acteurs peuvent être rapprochés d'une profession. Les ambiguïtés restent visibles avec leurs candidats. Les correspondances hiérarchiques affichent le chemin de classification. Les inconnus restent ouverts et peuvent être proposés sans publication automatique.

## Limites d'intégration à ce stade

- Le catalogue local fournit 100 domaines et 20 familles, mais pas encore une liste locale exhaustive de plusieurs milliers de professions.
- L'importateur ESCO est implémenté, mais le paquet officiel multilingue n'est pas encore importé dans ce dépôt.
- Le registre et les propositions restent en mémoire/session navigateur ; aucune synchronisation serveur ni console d'administration sécurisée n'est raccordée.
- Aucune migration Supabase, aucun déploiement et aucune fusion en production.
