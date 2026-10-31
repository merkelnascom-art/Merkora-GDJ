# Topologie des connexions bidirectionnelles — MerKora GDJ

Date : 31 octobre 2026
Statut : architecture cible ; les connexions listées ne sont pas déclarées actives du seul fait de ce document.

## Principe

« A vers MerKora » et « MerKora vers A » sont deux autorisations différentes. Une connexion dans un sens ne prouve jamais que le sens inverse fonctionne.

## Trois chemins distincts

| Chemin | Exemple | Mécanisme attendu |
| --- | --- | --- |
| Assistant externe vers MerKora | Claude, ChatGPT ou un client MCP appelle les outils MerKora | Serveur MCP MerKora + OAuth du client + audience canonique + permissions par outil |
| MerKora vers fournisseur IA | MerKora envoie une mission à OpenAI, Anthropic ou Google | API officielle du fournisseur, secret conservé côté serveur, budget et adaptateur dédiés |
| MerKora vers outil / outil vers MerKora | GitHub, Vercel, Supabase, Figma | OAuth ou API sortante pour les actions ; webhooks entrants signés lorsque l'outil les prend en charge |

## Connexions par acteur

### ChatGPT / OpenAI

- ChatGPT comme client MCP : connexion entrante vers MerKora, configurée depuis le client compatible après publication et validation OAuth.
- API OpenAI : connexion sortante depuis MerKora vers les modèles OpenAI, avec une clé API distincte et une facturation API.
- L'accès GitHub fourni à ChatGPT n'est pas automatiquement transmis à MerKora.

### Claude / Anthropic

- Claude comme client MCP : connexion entrante vers MerKora, autorisée depuis Claude après mise en ligne du serveur et validation OAuth.
- API Anthropic : connexion sortante depuis MerKora vers Claude, avec identifiants API distincts.
- La connexion GitHub de Claude Code est une autorisation séparée ; MerKora ne l'hérite pas automatiquement.

### Gemini / Google

- Client MCP compatible : connexion entrante vers MerKora si le client Google utilisé prend en charge le transport et l'OAuth requis.
- API Gemini : connexion sortante depuis MerKora avec authentification et quotas Google configurés côté serveur.
- Ne pas confondre un compte Google/Gemini grand public avec une autorisation API.

### GitHub, Vercel, Supabase et autres outils

- MerKora initie les connexions OAuth/API pour agir sur les ressources expressément autorisées.
- Les webhooks signés peuvent notifier MerKora d'événements entrants ; ils ne constituent pas un accès général au compte.
- Les permissions doivent distinguer lecture, écriture, création de preview, déploiement et production.

## Identité et propriété des connexions

Chaque connexion porte un propriétaire explicite : organisation MerKora, utilisateur individuel ou client/projet. Le serveur vérifie que l'acteur courant peut utiliser cette connexion pour ce projet précis. Les secrets restent côté serveur dans le coffre ; les missions ne contiennent que des références de connexion et des capacités autorisées.

## Règles non négociables

- Pas de partage automatique des jetons entre ChatGPT, Claude, Gemini, GitHub et les clients.
- Pas de clé API dans le navigateur, dans un prompt, un ticket ou le dépôt.
- Pas de connexion affichée « active » avant un test réel de l'API et une persistance sécurisée.
- Pas d'écriture, de coût, de déploiement ou de publication sans autorisation explicite.
- Les événements entrants sont authentifiés, vérifiés contre le rejeu et limités en débit.
- Les données d'un client ne sont transmises à un fournisseur IA que selon le consentement, la politique de données et le périmètre de mission applicables.

## État technique actuel

Le serveur MCP expose actuellement uniquement trois outils de lecture et l'accès aux projets est désactivé par défaut. Il n'existe pas encore de flux OAuth complet validé de bout en bout. Les adaptateurs IA réels ne sont pas configurés. Les connexions catalogue ne constituent pas des connexions actives.

Le nouveau module `provider-execution.ts` définit une frontière d'invocation serveur neutre vis-à-vis des fournisseurs : fournisseur connecté, capacité requise, délai borné et validation du périmètre du résultat. Il n'inclut pas de SDK fournisseur, de secret, d'appel réseau ou de persistance ; les adaptateurs réels seront ajoutés après configuration et approbation des accès.
