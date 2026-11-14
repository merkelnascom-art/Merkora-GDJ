# MerKora GDJ — Migration de mémoire projet appliquée

**Date :** 30 octobre 2026  
**Projet Supabase :** `tvwkickjtqjqwoiidmxj`  
**Branche de code :** `feature/admin-preview-secure-access`  
**Statut :** migrations appliquées et vérifications de structure/sécurité effectuées.

## Périmètre réellement appliqué

Quatre migrations additives ont été enregistrées dans Supabase :

- `20261030142529_create_merkora_project_memory`
- `20261030142558_tighten_merkora_memory_approval_guards`
- `20261030142727_index_merkora_project_memory_foreign_keys`
- `20261030142906_consolidate_merkora_memory_write_policies`

Elles ajoutent neuf tables :

1. `project_memory_brief_versions` — versions immuables des briefs.
2. `project_memory_plan_versions` — versions de plans, liées au brief source et à une empreinte de périmètre.
3. `project_memory_decisions` — décisions client/admin historisées.
4. `project_memory_approvals` — approbations append-only liées à la version exacte du plan et au scope digest.
5. `project_factory_jobs` — manifestes et état des exécutions futures.
6. `project_factory_tasks` — tâches, dépendances, tentatives et état de reprise.
7. `project_factory_evidence` — métadonnées de preuves et d'artefacts.
8. `project_memory_events` — journal append-only.
9. `project_resume_snapshots` — projections de reprise réservées à l'administration.

## Sécurité et autorisations

- RLS est activé sur les neuf tables.
- Aucune lecture anonyme n'est accordée.
- Les clients authentifiés ne voient que les enregistrements rattachés à leurs propres lignes de `user_projects`.
- Les administrateurs sont reconnus par une fonction SQL `SECURITY INVOKER` qui vérifie l'email du JWT contre la liste d'administration actuelle : `merkelnascom@gmail.com` et `wdesk87@gmail.com`. Les métadonnées utilisateur modifiables ne servent pas à l'autorisation.
- Les briefs, plans, décisions, approbations, événements et preuves n'ont pas de droit UPDATE/DELETE pour le rôle `authenticated`.
- Les tâches et jobs peuvent être mis à jour uniquement par un administrateur.
- Les jobs ne peuvent être insérés par un administrateur que si les empreintes du plan et du périmètre correspondent à la version persistée et si les trois approbations exactes `client_scope`, `admin_review` et `execution_authorization` sont présentes et approuvées.
- Les octets des artefacts ne sont pas stockés dans ces tables : un bucket Storage privé et ses propres politiques seront nécessaires avant tout dépôt de fichiers.

## Vérifications après application

- Les neuf nouvelles tables existent et ont RLS activé.
- Les neuf tables sont vides : aucune donnée client n'a été créée ou migrée dans ces nouvelles structures.
- Les neuf tables refusent SELECT au rôle `anon`.
- Le rôle `authenticated` n'a pas de droit DELETE sur les nouvelles tables ; UPDATE n'est accordé que sur jobs et tâches.
- Le helper d'administration retourne `true` pour l'email admin autorisé et `false` pour un email client de test.
- Les index de clés étrangères des nouvelles tables ont été ajoutés. Le conseiller de performance ne signale plus de clé étrangère non indexée sur les nouvelles tables ; les cinq alertes restantes concernent des tables commerciales préexistantes.
- Le conseiller de sécurité ne signale pas de nouveau défaut RLS sur les tables de mémoire. Il conserve une alerte préexistante : la protection contre les mots de passe compromis est désactivée.
- Les avertissements RLS concernant plusieurs politiques permissives sur les nouvelles tables ont été réduits en regroupant les politiques d'insertion des décisions et approbations.

## Ce qui n'est pas encore implémenté

Cette migration ne signifie pas que MerKora persiste déjà les projets depuis l'interface. Il reste à développer et tester les routes serveur/repository qui :

1. authentifient l'utilisateur et déterminent son rôle côté serveur ;
2. créent les versions de brief et calculent leurs digests côté serveur ;
3. génèrent et enregistrent les plans avec leurs digests de contenu et de périmètre ;
4. enregistrent les décisions et approbations exactes ;
5. construisent le manifeste d'exécution et vérifient les approbations avant de créer un job ;
6. journalisent tâches, preuves et reprise après interruption.

Aucun worker autonome, génération de code client, déploiement, stockage d'artefact, paiement ou communication externe n'a été activé. Aucun déploiement Vercel de production n'a été effectué.

## Préservation des données existantes

Aucune table existante n'a été supprimée, vidée, renommée ou modifiée par ces migrations. Les neuf tables commerciales préexistantes ont conservé leurs nombres de lignes observés avant/après l'opération : projets, demandes, devis, versions de devis, décisions commerciales, factures, déclarations de paiement, revues de paiement et lancements de projet.
