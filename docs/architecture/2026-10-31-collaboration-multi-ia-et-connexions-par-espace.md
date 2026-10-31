# Collaboration multi-IA et connexions par espace — MerKora GDJ

Date : 31 octobre 2026
Statut : architecture et plan d'implémentation, non activé en production.

## 1. Vision fonctionnelle

MerKora est le planificateur et le contrôleur du travail. Les fournisseurs d'IA sont des intervenants spécialisés qui reçoivent uniquement une mission limitée et les éléments nécessaires. Les outils externes exécutent les opérations autorisées. Les résultats reviennent dans le dossier du projet MerKora pour vérification.

Le but est de permettre à ChatGPT, Claude, Gemini et aux autres assistants compatibles de contribuer au même projet sans leur donner un accès général au compte, aux secrets, à la base ou à l'infrastructure.

## 2. Rôles d'agents

- Analyste : clarifie le besoin métier, les contraintes et les critères de réussite.
- Architecte : propose l'architecture technique et les décisions à prendre.
- Constructeur : prépare les modifications de code et les livrables techniques.
- Réviseur indépendant : examine les propositions et recherche les défauts.
- Testeur : définit et exécute les vérifications permises.
- Contre-vérificateur : apporte un second avis indépendant sur les points importants.

Un rôle est attribué seulement à un fournisseur dont la connexion est réellement active et dont les capacités déclarées correspondent. Les rôles de revue indépendante et de contre-vérification ne doivent pas être attribués au même fournisseur que l'analyste principal lorsqu'un autre fournisseur connecté est disponible. Une capacité absente bloque le rôle au lieu d'inventer une intégration.

## 3. Cycle collaboratif d'un projet

1. Le client décrit son besoin dans l'espace client et donne son consentement au traitement IA.
2. MerKora crée un dossier projet et une spécification structurée.
3. Le planificateur choisit les rôles et fournisseurs disponibles selon leurs capacités, coûts, données accessibles et règles du projet.
4. L'analyste et l'architecte proposent une solution.
5. MerKora rassemble les propositions et demande une revue indépendante.
6. Le client ou l'administrateur valide les choix qui engagent le périmètre, le prix, les données ou la production.
7. Le constructeur prépare le travail dans une branche ou un espace de prévisualisation isolé.
8. Le testeur et le réviseur contrôlent le résultat.
9. MerKora présente le résultat, les preuves, les limites et les décisions restantes.
10. La livraison et le déploiement en production nécessitent une approbation explicite distincte.

Les IA ne se donnent pas directement leurs clés API. MerKora transmet des tâches et des artefacts minimisés par l'intermédiaire de ses adaptateurs serveur.

## 4. Contrat d'une mission d'agent

Chaque mission persistée devra contenir au minimum :
- project_id et task_id, avec vérification d'appartenance au compte ;
- provider_id, rôle, capability et version du modèle ;
- objectif, contexte autorisé et références d'artefacts ;
- classification des données et consentement applicable ;
- limites de jetons, durée, tentatives et budget en unités monétaires mineures ;
- approbations requises et état de la mission ;
- résultat structuré, références de preuves, erreurs expurgées et horodatages.

Aucune clé, aucun jeton OAuth et aucun secret d'infrastructure ne doit apparaître dans le contenu d'une mission ou d'un résultat d'agent.

## 5. Connexion bidirectionnelle des assistants

### Assistant externe vers MerKora
Un assistant externe compatible MCP se connecte à l'endpoint MerKora avec OAuth. MerKora applique ses propres permissions/scopes applicatifs au niveau de chaque outil ; les scopes OIDC natifs de Supabase ne contrôlent pas à eux seuls l'accès aux tables. RLS doit donc imposer indépendamment les limites par client OAuth et par propriétaire. L'assistant peut consulter les ressources permises, puis, après une phase ultérieure d'autorisation, proposer des artefacts ou des résultats de mission. Les mutations, modifications de code, écritures de données et déploiements sont des capacités distinctes et désactivées par défaut.

### MerKora vers les fournisseurs IA
MerKora appelle les API officielles des fournisseurs via des adaptateurs serveur indépendants. Une connexion ChatGPT ou Claude à titre d'utilisateur ne donne pas automatiquement accès à l'API OpenAI ou Anthropic. Les accès API et leurs facturations sont distincts des abonnements grand public.

### Collaboration réelle
Les assistants ne sont pas réunis dans une conversation privée commune par magie. MerKora organise une collaboration asynchrone : mission, résultat, revue, arbitrage, approbation et journal d'audit. Chaque assistant voit uniquement les éléments nécessaires à son rôle.

## 6. Matrice des connexions par espace

| Espace MerKora | Outils / fournisseurs prévus | Usage |
| --- | --- | --- |
| Espace client | ChatGPT MCP, Claude MCP | Consulter le dossier, comprendre l'avancement et participer selon les droits du client |
| Administration | GitHub, Vercel, Supabase, Netlify, Render | Contrôler les connexions, dépôts, environnements, bases et déploiements |
| Copilote IA | OpenAI, Anthropic Claude, Gemini, assistants MCP | Dialogue, analyse, synthèse, seconde opinion et routage |
| Studio visuel | Figma, MagicPath | Maquettes, composants, validation visuelle et export selon API vérifiée |
| Fabrique de projets | GitHub, Supabase, Vercel, Netlify, Render, fournisseurs IA, Codunk si contrat vérifié, WebsitePublisher | Préparation, construction, tests et livraison |
| Création média | Runway, HeyGen, CapCut | Génération média via API officielle quand disponible ; transfert manuel pour les outils sans API confirmée |

Cette matrice exprime les usages visés, pas des connexions déjà actives. Le catalogue et les capacités réelles de chaque fournisseur doivent être vérifiés avant activation.

## 7. Règles de sécurité

- Connexions séparées par propriétaire : organisation, utilisateur ou client.
- OAuth avec consentement révocable, expiration et rotation ; permissions applicatives vérifiées outil par outil, et RLS indépendante pour les données.
- Coffre de secrets côté serveur ; aucune clé dans le navigateur, le dépôt ou les prompts.
- Séparation stricte des projets et des clients.
- Connexions inactives ou expirées jamais utilisables.
- Aucun outil payant appelé sans budget explicite.
- Aucune écriture en base, action destructive, fusion sur main ou mise en production sans approbation adaptée.
- Idempotence, journal d'audit, limites de tentatives et preuves de vérification.
- Les sorties d'agents et les données de fournisseurs sont non fiables jusqu'à validation.
- Le service ne doit jamais exposer une clé Supabase service-role à un client MCP.

## 8. Progression technique

### Phase A — fondations présentes / à vérifier
- Catalogue des fournisseurs et affectation indicative par espace.
- Gestionnaire de connexions en mémoire pour tests uniquement.
- Planificateur de capacités connecté uniquement.
- Cycle d'exécution, graphe de dépendances, garde de budget et audit en mémoire.
- Endpoint MCP avec outils de lecture ; accès projet fermé par défaut tant que la protection RLS dédiée n'est pas installée et vérifiée.
- Planificateur d'affectation multi-IA pur, sans appels réseau ni persistance.

### Phase B — OAuth réel
- Confirmer le serveur OAuth Supabase et ses capacités actuelles.
- Configurer et tester le Custom Access Token Hook pour une audience MCP canonique.
- Installer des politiques RLS restrictives pour que les jetons OAuth MCP ne puissent ni écrire ni lire d'autres tables.
- Implémenter autorisation, consentement, scopes, expiration, révocation et tests d'isolation.
- Connecter d'abord un seul client de test.

### Phase C — espace de collaboration persistant
- Faire approuver le schéma de persistance des connexions, missions, résultats et journaux.
- Remplacer les registres en mémoire par un stockage durable et atomique.
- Ajouter des outils MCP de proposition de mission et de soumission de résultat, sans exécution privilégiée.
- Construire la vue de suivi et d'approbation par projet.

### Phase D — adaptateurs IA et outils
- Brancher un fournisseur IA à la fois, après configuration du compte, des secrets et du budget.
- Vérifier officiellement les API de Figma, MagicPath, Runway, HeyGen, Codunk, CapCut et WebsitePublisher avant d'annoncer une automatisation.
- Connecter GitHub en branche dédiée, tests et revue avant toute fusion.
- Ajouter previews, déploiements de test et enfin production avec consentement distinct.

## 9. Limites actuelles à ne pas masquer

- Aucun assistant externe n'est encore connecté au serveur MerKora en production.
- Le serveur MCP et le parcours OAuth ne sont pas déployés ni validés de bout en bout.
- Les outils de lecture de projets sont volontairement désactivés par défaut via `MERKORA_MCP_DATA_ACCESS_ENABLED=false`.
- Le gestionnaire de connexions, le planificateur d'agents et les garde-fous d'exécution sont des composants de conception / tests en mémoire, pas une plateforme multi-instance prête pour la production.
- Le planificateur multi-IA n'appelle pas encore les API OpenAI, Anthropic ou Google.
- Aucune connexion fournisseur, dépense, modification de base ou mise en production n'est autorisée par ce document.

## 10. Critères d'acceptation avant activation

- Un assistant externe autorisé peut se connecter avec OAuth et scopes précis.
- Un jeton ordinaire, expiré, révoqué ou destiné à une autre audience est rejeté.
- Un assistant ne peut lire que les projets autorisés et ne peut pas contourner MCP via PostgREST.
- Les propositions de plusieurs fournisseurs sont liées au même projet et à des missions distinctes.
- Les revues indépendantes sont attribuées à un autre fournisseur lorsque disponible.
- Les budgets, consentements, approbations, résultats et erreurs sont audités.
- Aucun déploiement ou changement de production n'a lieu sans approbation explicite.
- Les tests, le typecheck et le build passent sur la version exacte qui sera proposée à livraison.
