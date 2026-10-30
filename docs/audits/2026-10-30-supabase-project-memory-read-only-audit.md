# Audit Supabase en lecture seule — mémoire persistante MerKora

**Date :** 2026-10-30  
**Projet Supabase :** `tvwkickjtqjqwoiidmxj`  
**Branche GitHub examinée :** `feature/admin-preview-secure-access`  
**Statut :** inventaire en lecture seule — aucune modification de base de données effectuée.

## Objectif

Préparer le raccordement futur de la mémoire de projet MerKora (versions de brief et de plan, décisions, approbations, tâches, preuves et reprises après interruption) sans perturber les données ou les parcours clients déjà présents.

## État du schéma public observé

Les neuf tables publiques retournées par l'inventaire sont :

- `user_projects`
- `client_requests`
- `client_quotes`
- `client_quote_versions`
- `client_quote_decisions`
- `client_invoices`
- `client_payment_declarations`
- `client_payment_reviews`
- `client_project_launches`

Les neuf tables retournées indiquent RLS activé. L'inventaire n'a retourné aucune table dédiée à la mémoire de l'usine (événements, versions immuables de brief/plan, tâches d'exécution, preuves, jobs ou instantanés de reprise).

La table `user_projects` contient le brief courant (titre, catégorie, problème, résultat souhaité, budget, urgence, statut et recommandations), mais son schéma observé ne contient pas d'historique immuable des versions de brief ou de plan.

Le schéma possède déjà des structures versionnées et append-only pour les devis, décisions, déclarations de paiement, examens de paiement et lancements de projet. Elles constituent des exemples de conventions existantes, mais ne doivent pas être réutilisées comme stockage de la mémoire d'exécution : leurs responsabilités métier sont distinctes.

## RLS et autorisations observées

- Les politiques de `user_projects` restreignent les opérations utilisateur à `auth.uid() = user_id`.
- Les tables de devis, décisions, factures, paiements et lancements possèdent des politiques distinctes selon le propriétaire client et l'administration.
- Plusieurs politiques administratives utilisent des listes d'adresses e-mail codées en dur. Les listes observées ne sont pas parfaitement uniformes entre les tables. Toute nouvelle autorisation de la mémoire devra centraliser et tester la décision de rôle côté serveur, plutôt que copier aveuglément une politique existante.
- Les privilèges de table et les politiques RLS sont deux couches différentes : un futur schéma exposé via la Data API devra avoir des GRANT explicites et des politiques RLS cohérentes.

## Historique des migrations observé

Migrations présentes dans l'historique Supabase :

- `20261028093038_create_user_projects`
- `20261029132447_create_client_requests_inbox`
- `20261029185150_create_versioned_client_quotes`
- `20261030095438_fix_client_quote_rls_recursion`
- `20261030103907_create_client_invoices_and_payment_reviews`
- `20261030111900_allow_celtiis_cash_payment_method`
- `20261030121046_create_client_project_launches`
- `20261030121245_tighten_project_launch_rls_and_indexes`
- `20261030121322_enforce_project_launch_prerequisites`

## Conséquence importante au 30 octobre 2026

Le changelog officiel Supabase indique qu'à partir du 30 octobre 2026, les nouvelles tables des projets existants ne sont plus automatiquement exposées à la Data API. Une future table publique utilisée via Supabase REST / supabase-js nécessitera donc des privilèges explicites adaptés aux rôles réellement utilisés, en plus de RLS et de politiques d'accès restrictives. Il ne faudra jamais répondre à un défaut d'accès par un GRANT global ou par une ouverture à `anon` non justifiée.

Référence officielle : https://supabase.com/changelog?types=breaking-change

## Décisions d'architecture proposées — non appliquées

1. Garder les données métier actuelles (`user_projects`, devis, factures, paiements) intactes.
2. Ajouter ultérieurement un espace de persistance distinct pour la mémoire de l'usine : événements append-only, versions immuables, approbations liées à un digest exact, tâches, preuves et jobs.
3. Lier chaque enregistrement à un projet et à un propriétaire authentifié ; vérifier l'autorisation côté serveur sur chaque lecture/écriture.
4. Ne jamais faire confiance à un `actorId`, un rôle ou un identifiant de propriétaire fourni par le navigateur : les dériver de la session authentifiée.
5. Empêcher la modification/suppression des événements et approbations par les rôles applicatifs ; prévoir une stratégie d'idempotence par identifiant d'événement et de corrélation.
6. Appliquer RLS, GRANT explicites et tests d'accès multi-utilisateurs dans la même migration additive.
7. Ne pas autoriser une reprise automatique d'un job interrompu : une vérification humaine est requise avant reprise, même si les tâches semblent techniquement récupérables.

## État des changements

- Aucune table créée.
- Aucune donnée modifiée ou supprimée.
- Aucune politique RLS changée.
- Aucune migration appliquée.
- Aucun déploiement déclenché.

Cet audit décrit uniquement les métadonnées et politiques lues au moment de l'inspection ; il ne constitue pas un audit exhaustif de sécurité ni une preuve que toutes les routes applicatives utilisent correctement chaque politique.
