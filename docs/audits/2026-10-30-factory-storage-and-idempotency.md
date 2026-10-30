# MerKora GDJ — Stockage privé des artefacts et idempotence de la fabrique

Date : 2026-10-30  
Projet Supabase : `tvwkickjtqjqwoiidmxj`  
Branche Git : `feature/admin-preview-secure-access`

## Migrations appliquées

- `20261030152336_create_private_factory_artifacts_bucket`
- `20261030153210_allow_factory_source_archives`
- `20261030153356_enforce_factory_job_correlation_idempotency`

## Stockage privé

Bucket : `merkora-factory-artifacts`

- `public = false`
- Limite de taille : 20 MiB par objet
- Types autorisés : `application/json`, `application/gzip`
- INSERT : administrateurs MerKora uniquement, avec un chemin rattaché à un projet et à un travail existants
- SELECT : administrateurs ; propriétaire du projet uniquement quand le travail est en attente de revue ou dans un état autorisé
- Aucun droit de mise à jour ou de suppression n'a été ajouté par ces politiques
- Les fichiers source et rapports sont nommés avec leur empreinte afin d'éviter l'écrasement

Le stockage contient les manifestes source JSON, les archives `.tar.gz` et les rapports de compilation. Aucun objet client n'a été créé pendant cette étape.

## Idempotence des travaux

Une vérification préalable n'a trouvé aucun doublon `(project_id, correlation_id)`. La contrainte unique `project_factory_jobs_project_correlation_key` a ensuite été appliquée. La création de travaux est ainsi protégée contre deux requêtes concurrentes portant le même identifiant de corrélation.

## Vérifications de sécurité et de performance

- Le bucket est confirmé privé.
- Les deux politiques de stockage attendues sont présentes : INSERT administrateur et SELECT propriétaire/administrateur.
- Les nouvelles tables de mémoire/fabrique n'apparaissent pas dans les avertissements de clés étrangères non indexées.
- Aucun nouvel avertissement de sécurité lié aux nouvelles tables ou au bucket n'a été signalé.
- Avertissement restant : la protection des mots de passe compromis dans Supabase Auth est désactivée. [Documentation Supabase](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection)
- Les avertissements de performance observés concernent des tables commerciales préexistantes : factures, devis, demandes et revues de paiement. Ils n'ont pas été modifiés dans cette étape.

## Limites

- Aucun travail client n'a été lancé.
- Aucun bac à sable Vercel n'a été démarré depuis cette session.
- Aucun code n'a été déployé en production.
- Aucun appel AI Gateway n'a été effectué ; le mode zéro dépense reste actif.
- Le générateur produit actuellement un squelette Next.js conforme au périmètre approuvé. La logique métier complète doit encore être implémentée, testée et revue avant livraison.
