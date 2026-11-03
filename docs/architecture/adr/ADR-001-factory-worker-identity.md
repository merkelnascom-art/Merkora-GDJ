# ADR-001 — Identité et autorisation du worker de fabrication MerKora

- **Statut :** proposé — aucun accès privilégié activé
- **Date :** 2026-11-03
- **Branche :** `feature/merkora-factory-unified-runtime`

## Contexte

Après confirmation du paiement et création d'un `project_factory_job`, l'endpoint actuel de compilation exige une session administrateur Supabase portée par les cookies. Un runner GitHub Actions ne possède pas cette session. Réutiliser un cookie administrateur, exposer une clé `service_role` à GitHub ou désactiver les contrôles RLS serait une élévation de privilèges inacceptable.

L'endpoint existant revalide aujourd'hui le propriétaire du projet, le lancement commercial et le paiement confirmé, le plan et ses empreintes, les trois validations, le consentement IA et l'état initial des tâches avant de réclamer atomiquement le job. Ces contrôles doivent rester effectifs pour tout appel du worker.

## Décision proposée

Séparer l'identité du worker de l'identité d'un administrateur humain :

1. L'application admin reste le seul point qui autorise le lancement commercial et crée le job durable.
2. Un workflow GitHub Actions **déclenché à la demande**, sans cron ni polling permanent, reçoit uniquement les identifiants opaques du job et du projet.
3. Le workflow demande un jeton OIDC GitHub avec une audience dédiée, par exemple `merkora-gdj-factory`. Aucun PAT, cookie admin ou secret Supabase ne doit être transmis au runner.
4. Une Edge Function Supabase dédiée vérifie cryptographiquement le JWT GitHub (signature via JWKS, `iss`, `aud`, `exp`, `nbf`) et applique une liste stricte de claims : dépôt `merkelnascom-art/Merkora-GDJ`, workflow exact, branche de fabrication autorisée, événement attendu et identifiant du run.
5. Après authentification du workflow, l'Edge Function ne fournit qu'une commande de travail limitée : vérifier l'éligibilité, réclamer atomiquement un job `queued`, et enregistrer les événements d'audit. Elle ne doit jamais exposer une API générique de lecture/écriture.
6. Le build continue dans le Vercel Sandbox éphémère existant. Les secrets ne sont pas injectés dans le code client généré ni dans la sandbox. Les opérations de livraison et de déploiement restent bloquées jusqu'à une revue humaine explicite.

## Déclenchement du workflow

L'application doit pouvoir appeler l'API GitHub `workflow_dispatch` après création du job. Le connecteur GitHub utilisé dans cette conversation n'est pas disponible comme identité d'exécution dans l'application Vercel. Le déclenchement automatique nécessite donc une identité serveur dédiée, de préférence une GitHub App limitée au dépôt avec la permission Actions: write, dont la clé privée reste dans les variables serveur Vercel. Une fine-grained PAT limitée à Actions: write est une solution de repli moins souhaitable.

Cette identité de déclenchement ne donne aucun accès à Supabase et ne doit jamais être exposée au navigateur. Le runner, de son côté, utilise OIDC et n'a pas besoin de cette clé privée.

## Contrôles obligatoires

- Vérifier le paiement confirmé, le propriétaire exact, la demande commerciale et le lancement officiel au moment de la réclamation, pas seulement lors de la création du job.
- Revalider le digest du plan, le digest du périmètre, les validations exactes et le consentement IA.
- Utiliser une transition atomique compare-and-set `queued → building`; refuser les doubles exécutions et les états incohérents.
- Imposer une clé d'idempotence fondée sur le job, le run et la tentative; enregistrer `run_id`, `run_attempt`, le sujet OIDC et l'acteur humain `authorized_by` déjà persisté.
- Limiter la durée, les ressources, les sorties de logs et les tentatives; aucun accès réseau dans la sandbox après installation des dépendances.
- Ne jamais accepter `project_id`, `job_id`, état, consentement ou montant comme preuve d'autorisation : ce sont uniquement des sélecteurs à revalider côté serveur.
- Ne jamais permettre au worker d'approuver une livraison, d'envoyer un devis, de confirmer un paiement ou de déployer en production.

## Options rejetées

| Option | Motif |
|---|---|
| Réutiliser le cookie administrateur | Secret de session humain non adapté à un worker, difficile à révoquer et à auditer. |
| Envoyer une clé Supabase `service_role` au workflow | Bypass RLS global et impact potentiel sur toutes les données du projet. |
| Faire confiance à un header secret partagé sur une route Next.js | Secret durable, risque de rejeu et rotation; moins robuste que la validation d'un jeton OIDC signé et borné. |
| Désactiver les vérifications commerciales/RLS pour le worker | Permettrait de lancer des projets sans les contrôles actuels. |
| Laisser Render sonder la file en continu | Coût récurrent et exécution non liée à une autorisation ponctuelle. |

## Conséquences et limites

- Le lancement et la compilation restent deux opérations distinctes, reliées par un identifiant de job durable.
- Une Edge Function dédiée avec privilèges minimaux est nécessaire; elle devra utiliser des requêtes/RPC étroitement bornées, pas un accès admin général exposé.
- Le modèle exact de tables, les clés étrangères, les policies RLS, les permissions et la stratégie d'audit doivent être inspectés avant d'écrire une migration.
- GitHub Actions est limité à un seul run par lancement, avec concurrence groupée par job et timeout maximal.
- L'administrateur conserve la décision finale avant toute livraison.

## Étapes suivantes

1. Inspecter en lecture seule le schéma et les policies des tables de fabrication, des validations, des demandes commerciales et des paiements.
2. Concevoir le contrat minimal de l'Edge Function et les tests négatifs (mauvais dépôt, workflow, branche, audience, jeton expiré, job non éligible, rejeu, double claim).
3. Ajouter le workflow à la branche de fonctionnalité, avec `permissions: id-token: write` et aucune action tierce si possible.
4. Ajouter la configuration GitHub App côté Vercel uniquement après accord et configuration des secrets par l'administrateur.
5. Faire tourner les tests et une simulation sans dépense IA; ne pas fusionner ni déployer avant validation explicite.

## Hors périmètre

Aucune migration Supabase, modification de données, création de secret, consommation de crédits IA, fusion ou déploiement n'est autorisé par cet ADR.
