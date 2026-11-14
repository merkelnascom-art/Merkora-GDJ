# Configuration serveur des fournisseurs IA MerKora

Date: 2026-10-31
Statut: documentation de configuration — aucun secret ajouté et aucun appel fournisseur exécuté.

## Objectif

Le module `src/lib/server/orchestration/provider-runtime.ts` reste totalement désactivé tant que `MERKORA_AGENT_RUNTIME_ENABLED` n'est pas exactement `true`. Lorsqu'il est activé, il enregistre uniquement les fournisseurs qui disposent à la fois :
1. d'une clé API présente dans l'environnement serveur ;
2. d'au moins un identifiant de modèle explicitement autorisé par configuration serveur.

La construction du runtime ne lance aucun appel réseau. Les identifiants de modèles fournis par le navigateur ne sont jamais acceptés comme choix arbitraires : l'appelant doit utiliser un alias connu du serveur.

## Variables attendues

| Fournisseur | Clé serveur | Alias de modèles |
|---|---|---|
| OpenAI | `OPENAI_API_KEY` | `MERKORA_OPENAI_MODEL_FAST`, `MERKORA_OPENAI_MODEL_BALANCED`, `MERKORA_OPENAI_MODEL_DEEP`, `MERKORA_OPENAI_MODEL_REVIEW` |
| Anthropic | `ANTHROPIC_API_KEY` | `MERKORA_ANTHROPIC_MODEL_FAST`, `MERKORA_ANTHROPIC_MODEL_BALANCED`, `MERKORA_ANTHROPIC_MODEL_DEEP`, `MERKORA_ANTHROPIC_MODEL_REVIEW` |
| Google Gemini | `GEMINI_API_KEY` | `MERKORA_GEMINI_MODEL_FAST`, `MERKORA_GEMINI_MODEL_BALANCED`, `MERKORA_GEMINI_MODEL_DEEP`, `MERKORA_GEMINI_MODEL_REVIEW` |

Les valeurs doivent être des noms de modèles réellement disponibles pour le compte fournisseur et validés par l'administrateur. Aucun identifiant de modèle n'est présumé ni fixé dans le code. Le commutateur global doit rester `false` tant que les contrôles de production ne sont pas prêts.

## Installation sûre

- Ajouter les clés dans les variables d'environnement serveur du déploiement, jamais dans une variable préfixée `NEXT_PUBLIC_`.
- Ne pas copier les clés dans GitHub, un ticket, un prompt, un fichier .env suivi par Git ou un message client.
- Définir d'abord un seul fournisseur et un seul alias pour les essais internes.
- Limiter les permissions et plafonds de dépense depuis le tableau de bord du fournisseur.
- Ne pas activer l'interface publique ni les appels en production avant la mise en place du consentement, de l'autorisation de projet, des budgets atomiques, de la persistance et de l'audit.
- Les connexions OAuth des clients à leurs assistants sont distinctes des clés API sortantes utilisées par le serveur MerKora. Elles ne sont pas interchangeables.

## Capacités

Les trois adaptateurs exposent actuellement la capacité commune `models.generate`. Cela permet au planificateur de collaboration de sélectionner des fournisseurs sans dépendre des noms d'endpoints propres à chaque API.

## Vérifications et limites

Les tests utilisent un faux transport HTTP et des réponses synthétiques. Ils vérifient les en-têtes d'authentification, les listes d'autorisation, les résultats liés au bon projet/à la bonne mission et le refus sans clé. Ils ne prouvent ni la validité d'une clé réelle, ni la disponibilité du compte, ni les prix, ni le fonctionnement d'une connexion OAuth client.

Avant activation réelle, ajouter :
- un écran administrateur de statut sans afficher les secrets ;
- une vérification de connexion explicitement déclenchée et plafonnée ;
- des budgets et réservations atomiques par tenant ;
- un journal d'audit expurgé ;
- une procédure de rotation/révocation des clés ;
- une politique de rétention des prompts et résultats.

## Statut au 31 octobre 2026

Les adaptateurs OpenAI, Anthropic et Gemini et le registre serveur sont présents dans la branche de travail. Aucun secret n'a été ajouté, aucun appel payant n'a été lancé et aucun fournisseur n'est déclaré connecté tant que la configuration réelle n'a pas été vérifiée.


## Séparation des identifiants par propriétaire

- Les clés globales `OPENAI_API_KEY`, `ANTHROPIC_API_KEY` et `GEMINI_API_KEY` ne sont utilisables que pour une connexion dont le propriétaire est `organization` et dont l'identifiant correspond exactement à `MERKORA_ORGANIZATION_ID`.
- Les connexions de type `user` ou `customer` doivent obtenir leur secret via le callback serveur `resolveCredential(providerId, connection)`, lequel devra charger le secret du bon propriétaire/connectionId et le déchiffrer avec le coffre.
- Le callback n'est pas encore raccordé à une base persistante. Aucun secret client ne doit être stocké dans le navigateur ou dans les champs publics de la base.
- Une clé de l'organisation MerKora ne sert jamais de solution de secours pour une connexion appartenant à un client.
