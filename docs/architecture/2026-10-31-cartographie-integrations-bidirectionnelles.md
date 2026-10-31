# Cartographie des intégrations MerKora GDJ

Date : 2026-10-31

## Objectif

MerKora doit fonctionner comme un orchestrateur central, et non comme un simple catalogue de boutons. Chaque intégration doit documenter les flux sortants (MerKora utilise un outil), entrants (un outil ou assistant appelle MerKora) et les limites réellement supportées.

## Flux sortants et entrants

| Intégration | Flux | Transport prévu | Capacités initiales | Réserve |
|---|---|---|---|---|
| GitHub | Entrant + sortant | OAuth / API | dépôts, branches, PR, checks | accès dépôt limité, déploiement séparément autorisé |
| Vercel | Entrant + sortant | OAuth / API | previews, état des déploiements | production toujours soumise à approbation |
| Supabase | Entrant + sortant | API | projets, lecture DB, auth | aucune migration ou suppression sans approbation |
| OpenAI | Sortant | API | génération et analyse | facturation API distincte de ChatGPT |
| Anthropic Claude | Sortant | API | analyse et revue | facturation API distincte de Claude.ai |
| Google Gemini | Sortant | API | génération et vérification | produit Google, quotas et coûts à confirmer |
| Figma | Entrant + sortant | OAuth / API | lecture et création/échange de designs | scopes et autorisations de fichiers à vérifier |
| Runway | Sortant | API à confirmer | génération média | accès officiel, plan et prix à vérifier |
| HeyGen | Sortant | API à confirmer | vidéos avatar | accès officiel, plan et prix à vérifier |
| CapCut | Passage manuel sortant | transfert de fichiers / lien | montage humain | aucune automatisation UI présumée |
| Codunk | Passage manuel sortant | lien / transfert | transmission de spécification | contrat API/export non confirmé |
| Netlify | Entrant + sortant | OAuth / API | sites, déploiements, observabilité | variables et production protégées |
| Render | Entrant + sortant | API | services, logs, métriques | changements d'infrastructure soumis à approbation |
| MagicPath | Entrant + sortant | API à confirmer | projets, canvas, composants | permissions, quotas et export à vérifier |
| WebsitePublisher | Entrant + sortant | API à confirmer | pages, assets, publication | publication et secrets protégés |
| ChatGPT ↔ MerKora | Entrant | MCP + OAuth | profil et projets en lecture seule | endpoint MCP pas encore déployé |
| Claude ↔ MerKora | Entrant | MCP + OAuth | profil et projets en lecture seule | endpoint MCP pas encore déployé |

## Règles de sécurité

1. Une entrée de catalogue ne signifie jamais que le compte est connecté.
2. Aucun secret ne transite par le navigateur ou par une conversation.
3. Les secrets sont chiffrés côté serveur par le coffre AES-256-GCM ; la clé maîtresse vient d'une variable d'environnement et n'est pas versionnée.
4. Chaque connexion est rattachée à un propriétaire explicite : organisation, utilisateur ou client.
5. Les capacités sont accordées au moindre privilège et vérifiées à chaque action.
6. Les opérations de production, de facturation, de publication, de migration ou de suppression demandent une approbation distincte.
7. Les intégrations sans API ou contrat confirmé restent en transfert manuel.
8. Les statuts ne deviennent « connectés » qu'après une vérification réelle du fournisseur.

## État réel au moment de cette version

- Le catalogue déclare les directions et transports prévus.
- Le gestionnaire de cycle de vie et son contrat de fournisseur sont présents, mais le stockage est temporaire en mémoire.
- Le coffre de chiffrement est une primitive locale testée ; il n'est pas encore relié à un stockage durable.
- Les flux OAuth, les autorisations entrantes MCP et les adaptateurs fournisseurs ne sont pas encore déployés.
- Aucune connexion réelle n'est déclarée active.
- Aucun changement de schéma Supabase, déploiement de production ou fusion vers main n'est effectué par cette étape.

## Ordre de réalisation

1. Stabiliser le contrat de connexion et le coffre chiffré.
2. Construire une interface de stockage durable avec isolation organisation/client après approbation du schéma.
3. Mettre en place OAuth et les adaptateurs officiels en commençant par GitHub, Figma, Vercel et Netlify.
4. Construire l'API MerKora entrante, ses scopes et son audit.
5. Exposer les outils MCP en lecture seule pour ChatGPT et Claude.
6. Ajouter les fournisseurs IA sortants avec budget et limites explicites.
7. Ajouter les outils de création vidéo et de construction selon les API réellement disponibles ; garder CapCut/Codunk en transfert manuel si nécessaire.
