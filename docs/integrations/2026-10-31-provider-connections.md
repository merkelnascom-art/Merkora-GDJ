# MerKora GDJ — plan réel de connexion des fournisseurs IA

Date : 2026-10-31  
Statut : architecture et préparation ; connexions externes à valider avant activation.

## Objectif

MerKora doit être le coordinateur central des missions. Les fournisseurs restent indépendants : OpenAI, Anthropic et Google exécutent des missions via leurs API respectives ; MerKora conserve le contexte métier autorisé, assigne les rôles, applique les permissions et budgets, compare les résultats et trace les décisions.

Une connexion est considérée comme **réelle** seulement après configuration de credentials côté serveur, test de connectivité réussi, vérification du propriétaire et du périmètre, puis preuve d'un appel de bout en bout. La présence d'un adaptateur dans le dépôt ne prouve pas qu'un fournisseur est connecté.

## État technique observé dans le dépôt

- Adaptateurs serveur présents : `openai`, `anthropic`, `gemini`.
- Les adaptateurs attendent des clés serveur et des alias de modèles explicitement autorisés.
- `createConfiguredAgentRuntime` est protégé par `MERKORA_AGENT_RUNTIME_ENABLED=true`.
- Les clés de l'organisation ne peuvent pas servir de solution de repli pour une connexion appartenant à un client.
- L'exécuteur exige des contrôles d'autorisation et de réservation de budget avant l'appel fournisseur.
- Le registre actuel des connexions est volatil (mémoire du processus), pas un coffre de connexions persistant.
- Le coffre de credentials chiffre les secrets, mais il faut encore l'associer à un stockage durable, à une rotation de clés et à un contrôle d'accès par tenant.
- L'API conversationnelle `/api/ai` utilise séparément Vercel AI Gateway ; elle n'est pas à elle seule la preuve que l'orchestrateur multi-agents est branché sur les adaptateurs OpenAI/Anthropic/Gemini.
- Aucun secret, token, identifiant privé ou credential ne doit être commité dans Git.

## Variables serveur pour un pilote contrôlé

À configurer dans les secrets de l'environnement de prévisualisation, jamais dans le navigateur :

```dotenv
MERKORA_AGENT_RUNTIME_ENABLED=false
MERKORA_ORGANIZATION_ID=merkora-gdj

# OpenAI API — clé distincte de l'abonnement ChatGPT
OPENAI_API_KEY=
MERKORA_OPENAI_MODEL_FAST=
MERKORA_OPENAI_MODEL_BALANCED=
MERKORA_OPENAI_MODEL_DEEP=
MERKORA_OPENAI_MODEL_REVIEW=

# Anthropic API — compte/API et facturation Anthropic
ANTHROPIC_API_KEY=
MERKORA_ANTHROPIC_MODEL_FAST=
MERKORA_ANTHROPIC_MODEL_BALANCED=
MERKORA_ANTHROPIC_MODEL_DEEP=
MERKORA_ANTHROPIC_MODEL_REVIEW=

# Google Gemini API
GEMINI_API_KEY=
MERKORA_GEMINI_MODEL_FAST=
MERKORA_GEMINI_MODEL_BALANCED=
MERKORA_GEMINI_MODEL_DEEP=
MERKORA_GEMINI_MODEL_REVIEW=
```

Ces valeurs sont des emplacements de configuration, pas des credentials actifs. Ne pas activer le runtime tant que les clés ne sont pas fournies par le propriétaire du compte, les modèles autorisés, les plafonds de dépense et les règles de consentement n'ont pas été vérifiés. L'API OpenAI est un produit distinct de ChatGPT : un abonnement ChatGPT ne fournit pas automatiquement une clé API ni un budget API.

## Architecture de connexion par service

| Service | Canal cible | Sens | Preuve exigée |
| --- | --- | --- | --- |
| OpenAI | API serveur, puis OAuth/MCP si un produit le prend officiellement en charge | MerKora → OpenAI ; résultats → MerKora | appel de test non sensible, réponse validée, usage/coût journalisés |
| Anthropic Claude | API Messages serveur | MerKora → Anthropic ; résultats → MerKora | appel de test et résultat conforme au contrat de mission |
| Google Gemini | API Generate Content serveur | MerKora → Gemini ; résultats → MerKora | appel de test et résultat conforme au contrat de mission |
| GitHub | App OAuth/GitHub App à privilèges minimaux | lecture/écriture du dépôt selon permission | dépôt et branche autorisés, audit des commits ; aucun push production automatique |
| Supabase | client serveur/RLS ou OAuth à portée limitée | données du tenant autorisées | tests RLS et isolation inter-tenant ; pas de contournement par clé service |
| Vercel | OAuth/API token à portée minimale | projet et prévisualisations | projet explicite, déploiement Preview uniquement avant validation |
| Figma | OAuth officiel | lecture des fichiers et écriture des livrables autorisés | identité, fichier/équipe cible et permissions vérifiés |
| Netlify / Render | OAuth/API token à portée minimale | builds, logs et prévisualisations | environnement explicite, aucun changement de production sans validation |
| ChatGPT et Claude comme applications utilisateur | MCP/OAuth lorsque le fournisseur l'autorise | outils/contextes explicitement accordés | audience, client OAuth, consentement et scope vérifiés |

Une API de modèle permet à MerKora d'appeler un modèle ; elle ne signifie pas que MerKora contrôle l'application ChatGPT, les conversations privées de l'utilisateur ou son abonnement. Les intégrations MCP/OAuth sont des connexions distinctes, avec des autorisations et capacités spécifiques.

## Contrat commun d'intégration

Chaque connexion durable doit conserver uniquement des métadonnées non secrètes dans la table de connexions : identifiant, tenant propriétaire, fournisseur, état, scopes/capacités, dates de vérification, expiration et code d'erreur sûr. Les credentials sont chiffrés côté serveur avec contexte lié à l'identifiant de connexion et au fournisseur. Les secrets bruts ne sont jamais renvoyés au navigateur ni aux journaux.

Chaque mission doit porter : `tenantId`, `projectId`, `missionId`, rôle, fournisseur, capacités nécessaires, identifiant de connexion, version de plan, digest de périmètre, statut de consentement IA, plafond de dépense et corrélation d'audit. Refuser par défaut en cas de propriétaire inconnu, de connexion révoquée, de scope insuffisant, de budget non réservé ou de consentement absent.

## Parcours d'activation

1. Configurer une clé fournisseur uniquement dans les secrets Preview, avec un plafond de dépense faible.
2. Activer le runtime en Preview uniquement et effectuer un test sans données personnelles.
3. Vérifier que le fournisseur et le modèle correspondent à l'allowlist serveur.
4. Tester refus d'accès inter-tenant, connexion révoquée, absence de budget, consentement IA absent, timeout, erreur fournisseur et sortie JSON invalide.
5. Vérifier que les journaux ne contiennent ni clé ni données sensibles non nécessaires.
6. Exécuter une mission de test de bout en bout ; conserver les IDs de mission, résultats, coûts et preuves de validation.
7. Ajouter le stockage persistant et la révocation avant d'ouvrir la connexion aux clients.
8. N'autoriser les écritures GitHub/Figma et les déploiements que via des outils distincts, scopes limités, environnements explicites et contrôles d'approbation.

## Hors périmètre de cette étape

Ce document ne crée aucune connexion externe, ne fournit aucun secret, ne modifie aucune base Supabase et ne déclenche aucun déploiement. Il fixe le contrat d'implémentation et les critères pour ne pas confondre code préparé et service réellement connecté.
