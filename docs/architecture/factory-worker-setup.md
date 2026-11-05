# Worker de fabrication MerKora GDJ

## Architecture raccordée dans le dépôt

Le workflow `.github/workflows/merkora-factory-worker.yml` est le déclencheur manuel. Il obtient une identité GitHub OIDC à durée courte et appelle l'Edge Function `factory-worker`.

Le worker :
1. vérifie l'identité du dépôt, du workflow et de la branche ;
2. revalide le propriétaire, le plan et ses empreintes, les trois validations, le consentement IA et le lancement commercial avec acompte confirmé ;
3. réserve atomiquement le travail en passant `queued` à `building` ;
4. génère le squelette à partir du seul périmètre approuvé ;
5. exécute installation, TypeScript et build dans un Vercel Sandbox éphémère ;
6. ferme le réseau du Sandbox après installation ;
7. enregistre l'archive, le manifeste, le rapport, les preuves, les états des tâches et l'événement d'audit dans Supabase ;
8. place un build réussi en `awaiting_approval`. Il ne déploie jamais le projet et ne déclenche aucun appel IA.

Render n'est plus dans le chemin d'exécution de ce workflow.

## Paramètres externes utilisés

Le workflow lit les valeurs suivantes ; il ne les affiche jamais dans les logs :

| Emplacement GitHub | Nom |
| --- | --- |
| Actions variable | `MERKORA_SUPABASE_URL` |
| Actions secret | `VERCEL_TOKEN` |
| Actions secret | `VERCEL_TEAM_ID` |
| Actions secret | `VERCEL_PROJECT_ID` |

La clé `SUPABASE_SERVICE_ROLE_KEY` reste exclusivement dans l'environnement de l'Edge Function Supabase. Elle n'est jamais transmise à GitHub Actions ni au Sandbox. Le runner obtient un jeton OIDC GitHub court-vivant pour appeler l'Edge Function.

Les paramètres Vercel sont consommés uniquement par le processus runner qui crée le Sandbox. Aucun secret n'est injecté dans la machine virtuelle de code client.

## Prérequis côté Supabase

La fonction `factory-worker` doit être déployée sur le projet `tvwkickjtqjqwoiidmxj`, avec `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY` dans ses secrets d'environnement. Le fichier `supabase/config.toml` désactive la vérification JWT générique uniquement pour cette fonction ; le handler vérifie lui-même la signature GitHub OIDC, l'émetteur, l'audience, l'expiration, le dépôt, le workflow et la branche.

Commande de déploiement, à exécuter seulement après validation de la PR et approbation explicite de mise en production :

```bash
supabase functions deploy factory-worker --project-ref tvwkickjtqjqwoiidmxj
```

## Déclenchement serveur via GitHub App

Le serveur Next.js dispose d'un helper `lib/server/merkora-factory-github.ts` et d'un endpoint administrateur `POST /api/admin/projects/{projectId}/factory/jobs/{jobId}/dispatch`. L'endpoint n'accepte le déclenchement que si le corps contient `confirmSandboxCost: true`, si l'utilisateur est administrateur, si la requête est same-origin et si le job existe encore en statut `queued`.

Créer une GitHub App dédiée à MerKora (ne pas réutiliser l'installation de l'application ChatGPT/connecteur). La limiter au dépôt `merkelnascom-art/Merkora-GDJ` et lui accorder `Actions: Read and write` ainsi que `Metadata: Read-only`. Installer cette App sur le dépôt et générer une clé privée. Configurer côté serveur Vercel, sans préfixe `NEXT_PUBLIC_` :

| Variable Vercel | Valeur |
| --- | --- |
| `MERKORA_GITHUB_APP_ID` | App ID de la GitHub App dédiée |
| `MERKORA_GITHUB_APP_INSTALLATION_ID` | ID de son installation sur le dépôt |
| `MERKORA_GITHUB_APP_PRIVATE_KEY` | Clé privée PEM complète, conservant ses retours à la ligne (ou `\\n`) |

Le serveur signe un JWT d'application de courte durée, échange ce JWT contre un jeton d'installation temporaire limité à `actions: write`, puis appelle `workflow_dispatch` sur `merkora-factory-worker.yml`. Le jeton d'installation n'est jamais renvoyé au navigateur ni écrit dans les logs. Le déclenchement est explicitement séparé de la création du job afin qu'aucun Sandbox payant ne démarre sans confirmation distincte.

Le endpoint de dispatch est préparé côté serveur ; le bouton de confirmation du dashboard doit encore l'appeler après affichage de l'avertissement de coût. Tant que la GitHub App dédiée et les variables Vercel ne sont pas configurées, le endpoint répond `not_configured` et le job reste `queued`.

## Lancement contrôlé

Lancer `MerKora factory worker` depuis `feature/merkora-factory-unified-runtime`, `feature/merkora-production-security-hardening` ou `main` (branches autorisées par la vérification OIDC), avec un `project_id` existant et un UUID de job en statut `queued`. Le workflow reste manuel : aucun lancement automatique à la création d'un job.

Un job est réclamé par comparaison atomique `status = queued`. Une seconde exécution ne peut pas prendre le même travail. Les erreurs après réservation marquent le job en échec lorsque le worker peut encore joindre l'Edge Function ; sinon, une réconciliation administrateur est nécessaire.

## Limites de cette version

- Elle fabrique et compile un squelette Next.js à partir des modules approuvés ; elle n'implémente pas encore toute la logique métier spécifique du client.
- Le build réussi passe en revue humaine (`awaiting_approval`), jamais en livraison automatique.
- La génération IA métier est distincte et reste soumise au consentement client et à une confirmation de dépense.
- Vercel Sandbox est un service à l'utilisation. Le workflow n'est pas exécuté automatiquement par les tests CI ; un lancement réel doit être décidé séparément.
- Aucune migration SQL n'est ajoutée ou appliquée par ce raccordement.
