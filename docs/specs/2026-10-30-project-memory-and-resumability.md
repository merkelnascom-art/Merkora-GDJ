# MerKora GDJ — Mémoire durable et reprise des projets

**Date :** 30 octobre 2026  
**Statut :** Conception proposée — non implémentée  
**Branche :** `feature/admin-preview-secure-access`  
**Périmètre :** conception uniquement. Ce document n'autorise aucune migration, écriture de données, connexion à un fournisseur IA payant, création de worker, ni déploiement.

## 1. Objectif

MerKora doit conserver une mémoire de travail fiable pour chaque dossier client afin de savoir, même après une interruption :
- ce que le client a demandé et pourquoi ;
- quelles options il a réellement sélectionnées ;
- ce qui a été proposé, accepté, refusé ou laissé en attente ;
- quelle version du cahier des charges et du plan est la référence ;
- quelles tâches sont terminées, en cours, bloquées ou non commencées ;
- quelles preuves démontrent les résultats annoncés ;
- quelle est la prochaine action sûre à exécuter.

Cette mémoire appartient à MerKora. Elle ne doit pas dépendre de l'historique d'une conversation ChatGPT, d'une mémoire volatile d'agent, du navigateur ou d'un fichier localStorage comme source de vérité.

## 2. Principes obligatoires

1. **Une source de vérité côté serveur.** Le navigateur peut afficher et mettre en cache des données, mais il ne décide pas du statut officiel d'un projet, d'une approbation ou d'une exécution.
2. **Historique conservé.** Une décision ou un plan important ne doit pas être écrasé silencieusement. Les changements sont ajoutés avec leur auteur, leur date et leur raison lorsqu'elle est connue.
3. **État et preuve séparés.** « Test réussi » doit pointer vers un résultat de test réel. « Livré » ne peut pas être déduit d'un devis accepté ou d'un lancement administratif.
4. **Reprise idempotente.** Répéter une requête après un délai réseau ne doit pas créer deux jobs ni deux décisions contradictoires.
5. **Pas de mémoire transversale.** Un agent ne reçoit que le contexte nécessaire à son projet et à sa tâche.
6. **Contexte compact et vérifiable.** Les agents reçoivent un résumé calculé depuis des données persistées, avec des références vers les sources détaillées.
7. **Échec fermé.** Si l'état, l'identité, la version ou l'autorisation ne peut pas être vérifié, MerKora s'arrête et signale le blocage.
8. **Pas de secrets dans la mémoire.** Les mots de passe, tokens, clés API, PIN, OTP et secrets de connexion ne sont jamais enregistrés dans les résumés, prompts, traces ou journaux.
9. **Aucune autonomie implicite.** La mémoire conserve les approbations exactes ; elle ne crée pas une autorisation générale réutilisable.
10. **Pas de fausse complétion.** Toute capacité non vérifiée est marquée comme non exécutée, inconnue, bloquée ou proposée.

## 3. Modèle logique proposé

Les noms ci-dessous sont conceptuels et ne représentent pas des tables déjà créées.

### 3.1 Project brief versions

Contient des versions immuables du besoin :
- identifiant du projet et numéro de version ;
- problème métier exprimé par le client ;
- objectifs et résultats attendus ;
- utilisateurs concernés et contexte d'utilisation ;
- contraintes, exclusions et hypothèses ;
- réponses aux questions de clarification ;
- options et modules explicitement sélectionnés ;
- références vers les pièces jointes autorisées ;
- auteur, date de création et référence à la version précédente.

Une correction du brief crée une nouvelle version. Elle ne réécrit pas la version ayant servi à un plan approuvé.

### 3.2 Project decisions

Journal append-only des décisions significatives :
- décision et catégorie ;
- choix retenu, choix refusé ou question ouverte ;
- acteur identifié côté serveur et rôle vérifié ;
- date et identifiant de corrélation ;
- versions du brief, du plan ou du périmètre concernés ;
- motif ou commentaire lorsque fourni ;
- approbation requise et état de cette approbation.

Une proposition de l'IA n'est pas une décision client. Un clic, une approbation commerciale, une approbation de maquette et une autorisation d'exécution sont des événements différents.

### 3.3 Plan versions et approbations

Réutiliser les principes du document `2026-10-30-versioned-plan-approval-workflow.md` :
- plans immuables, versionnés et associés à leur entrée source ;
- approbations immuables liées au plan exact et au périmètre exact ;
- toute modification substantielle rend nécessaire une nouvelle version et une nouvelle vérification des approbations ;
- aucune exécution ne démarre sur la seule base d'un résumé fourni par le navigateur.

### 3.4 Project task state

Chaque tâche planifiée doit avoir :
- un identifiant stable dans sa version de plan ;
- son état : `not_started`, `ready`, `in_progress`, `blocked`, `completed`, `failed` ou `cancelled` ;
- ses dépendances ;
- les entrées et sorties attendues ;
- la référence à la preuve de réalisation, si terminée ;
- le nombre de tentatives et la dernière erreur expurgée, si applicable ;
- l'acteur ou le worker responsable ;
- l'horodatage des transitions.

Une tâche `completed` sans preuve exigée ne satisfait pas les critères de fin du job.

### 3.5 Factory execution / job

Un job doit référencer :
- projet, brief version, plan version et empreintes de contenu ;
- périmètre autorisé et approbations vérifiées ;
- statut, date de création, démarrage et fin ;
- limites de durée, coût, tentatives et ressources ;
- workspace isolé et version de l'environnement ;
- tâches, tentatives, artefacts, résultats de tests et erreurs ;
- événement de reprise et identifiant de corrélation.

Un job reprend le même manifeste validé. Si le brief, le plan, le périmètre ou les approbations ont changé, il ne reprend pas aveuglément : il se bloque et demande une nouvelle vérification.

### 3.6 Project snapshot (résumé de reprise)

Le snapshot est une projection recalculable, pas la source de vérité. Il fournit à l'administration et à l'orchestrateur :
- état actuel et dernière transition ;
- résultat attendu et périmètre actif ;
- version de brief et plan de référence ;
- approbations présentes et manquantes ;
- tâches terminées, tâches suivantes et dépendances bloquantes ;
- preuves disponibles et contrôles non exécutés ;
- dernier blocage et action sûre suggérée ;
- références vers les événements, plans, tâches et artefacts sources.

Le snapshot doit être recalculable depuis les enregistrements persistés. Si son contenu contredit les événements sources, les événements sources prévalent et le snapshot est reconstruit.

## 4. Cycle de vie d'un dossier

```text
Besoin reçu
   -> brief v1
   -> questions de clarification (si nécessaires)
   -> options sélectionnées et décisions enregistrées
   -> spécification versionnée
   -> plan v1
   -> revue client/admin et approbations exactes
   -> manifeste de job immuable
   -> tâches exécutées dans un workspace isolé
   -> preuves, tests et journal d'événements
   -> reprise, réparation ou blocage si nécessaire
   -> revue de livraison
   -> livraison après autorisations distinctes
```

Un changement de périmètre produit une nouvelle version du brief et du plan. Les tâches qui dépendent de l'ancien périmètre sont marquées comme obsolètes ou nécessitant une replanification ; leur historique reste conservé.

## 5. Reprise après interruption

Lorsqu'un worker, un serveur ou une requête s'interrompt :

1. charger le job et son manifeste depuis le serveur ;
2. vérifier l'identité du projet, le plan et les empreintes enregistrées ;
3. vérifier que les autorisations requises sont toujours valides pour cette action précise ;
4. reconstruire l'état à partir des événements persistés ;
5. détecter les tâches sans résultat final ou dont le résultat est ambigu ;
6. réconcilier ces tâches sans répéter aveuglément une action externe ;
7. reprendre uniquement les tâches sûres et idempotentes ;
8. exiger une revue humaine si l'état d'une action externe est incertain ;
9. enregistrer l'événement de reprise et la décision de reprise ;
10. afficher à l'administration ce qui a été repris, ignoré ou bloqué.

Pour toute action externe non idempotente (paiement, communication envoyée, création de ressource cloud ou publication), la reprise doit d'abord vérifier son état auprès du système cible ou demander une intervention. Ne jamais supposer que l'action a échoué simplement parce que la réponse réseau a été perdue.

## 6. Mémoire contextuelle des agents

Chaque tâche reçoit un paquet de contexte limité et construit côté serveur, comprenant :
- l'objectif de la tâche ;
- le brief et le plan exacts utilisés ;
- les décisions pertinentes ;
- les contraintes et exclusions ;
- les fichiers et interfaces autorisés ;
- les résultats précédents pertinents ;
- les critères de réussite et les limites d'exécution ;
- les autorisations applicables et les actions interdites.

Le paquet doit référencer les versions sources et être identifiable par une empreinte. L'agent ne peut pas modifier ce paquet pour s'accorder lui-même des permissions. Une sortie d'agent devient un résultat candidat, puis est validée et persistée par le système selon un schéma strict.

## 7. Sécurité, confidentialité et rétention

- Vérifier côté serveur l'identité, le rôle et l'accès au projet sur chaque lecture ou écriture.
- Ne pas accepter un rôle ou un identifiant d'acteur déclaré par le navigateur comme preuve d'autorisation.
- Appliquer des politiques RLS compatibles avec le modèle réel de propriété avant toute persistance.
- Ne pas utiliser la clé service Supabase pour les opérations ordinaires au nom d'un utilisateur.
- Ne pas transmettre les briefs à un fournisseur IA externe tant que le fournisseur, le traitement des données et le plafond de dépenses ne sont pas approuvés.
- Expurger les secrets et limiter les données personnelles dans les logs.
- Définir une politique de conservation, d'export et de suppression avant migration.
- Séparer les métadonnées nécessaires à l'audit du contenu détaillé du projet.
- Ne jamais faire dépendre la reprise d'un secret enregistré dans le journal.
- Ne jamais supprimer les données existantes de MerKora pour mettre en place ce système.

## 8. Interfaces candidates

Interfaces à évaluer pendant l'implémentation, sans routes ni fonctions créées par ce document :

- `getProjectResume(projectId, actor)` : renvoie un résumé autorisé et les références sources.
- `appendProjectEvent(projectId, event, actor)` : ajoute un événement après validation serveur.
- `createBriefVersion(projectId, input, actor)` : crée une version de brief.
- `getPlanVersion(projectId, planId, actor)` : charge une version de plan accessible.
- `buildTaskContext(jobId, taskId)` : compose un contexte minimal à partir du manifeste validé.
- `reconcileInterruptedJob(jobId)` : détermine les tâches reprenables, ambiguës ou bloquées sans exécuter d'action externe non autorisée.
- `recordTaskEvidence(jobId, taskId, evidence)` : enregistre les preuves validées d'une tâche.

Les signatures et les noms sont proposés. Ils devront être adaptés après inspection des modules, du schéma et du modèle d'accès réellement présents dans le dépôt.

## 9. Tests d'acceptation obligatoires

1. Une reprise conserve la même version de brief, plan et périmètre tant qu'aucun changement n'est approuvé.
2. Une nouvelle version de plan n'hérite pas automatiquement des approbations de la version précédente.
3. Un client ne peut ni lire ni modifier la mémoire d'un autre projet.
4. Un rôle admin envoyé depuis le navigateur ne donne aucun privilège.
5. Un job interrompu reprend les tâches idempotentes sans doublon.
6. Une action externe dont le résultat est incertain est mise en vérification au lieu d'être répétée automatiquement.
7. Un état de tâche ne peut pas être déclaré terminé sans les preuves obligatoires.
8. Les erreurs sont conservées sous forme expurgée et ne contiennent aucun secret.
9. Une modification de périmètre bloque les tâches devenues invalides et impose une replanification.
10. Un snapshot corrompu ou obsolète peut être reconstruit depuis les sources persistées.
11. Une panne de persistance empêche de signaler une décision ou une approbation comme enregistrée.
12. Les données, devis, paiements et projets existants ne sont ni supprimés ni modifiés par la mise en place future de cette fonctionnalité.

## 10. Ordre d'implémentation recommandé

1. **Inventaire en lecture seule** : examiner les modèles de projet, l'authentification, les rôles, les routes, le schéma Supabase et les politiques RLS existantes.
2. **Contrats et tests purs** : définir les types d'événements, transitions d'état, manifeste de job et règles de reprise sans écrire en base.
3. **Persistance proposée** : concevoir tables, contraintes, index, RLS, rétention et plan de retour arrière ; aucune migration partagée sans approbation explicite.
4. **Journal append-only** : ajouter les événements et les tests d'autorisation, d'idempotence et de confidentialité.
5. **Résumé de reprise** : calculer et tester le snapshot à partir des sources persistées.
6. **Reprise simulée** : tester les interruptions, les tâches ambiguës et les reprises sans worker réel ni effets externes.
7. **Workspace et worker isolés** : seulement après validation des approbations, des limites de ressources et du modèle de sécurité.
8. **Student Vision comme preuve** : utiliser sa spécification comme entrée de l'usine, et non construire son livrable manuellement à la place de MerKora.

Chaque étape doit être vérifiable indépendamment. Un document de conception ou un test simulé ne prouve pas que la persistance ou l'exécution autonome existe déjà.

## 11. Décisions restant à trancher avant l'implémentation

- Quelle politique de conservation et de suppression s'applique aux événements, plans, journaux et artefacts ?
- Quel modèle de propriété de projet et quelle source de rôle admin sont effectivement autoritaires dans le code et la base actuels ?
- Quels événements doivent être conservés intégralement et lesquels peuvent être résumés ou expurgés ?
- Quelle est la durée maximale de reprise d'un job et à partir de quand une revue humaine est obligatoire ?
- Quels types d'actions externes pourront un jour être repris automatiquement après réconciliation ?
- Quel fournisseur d'exécution isolée sera retenu, avec quels plafonds et quelle politique réseau ?

**État de vérité :** ce document est une spécification proposée. Il ne signifie pas que la mémoire durable, la persistance des plans, le journal d'événements ou la reprise automatique sont déjà implémentés.
