# MerKora GDJ — Moteur central de symbiose IA et proxy d'orchestration

Date: 2026-10-31
Statut: spécification d'implémentation — aucun appel fournisseur, aucune migration et aucun déploiement effectués.
Branche cible: `feature/merkora-orchestration-v1`

## 1. Décision produit

MerKora est le chef d'orchestre et le serveur de confiance. Les fournisseurs IA ne deviennent pas un seul modèle fusionné : ils restent des services distincts, avec leurs propres modèles, politiques, limites et identifiants. MerKora les fait collaborer au moyen de missions structurées, d'un contexte projet autorisé et d'un cycle de vérification.

Le proxy MerKora n'est pas un relais HTTP ouvert. C'est une passerelle d'orchestration qui :
- authentifie l'utilisateur et vérifie son accès au projet ;
- choisit uniquement les fournisseurs réellement connectés et autorisés ;
- minimise les données transmises à chaque fournisseur ;
- applique les budgets, limites de durée, nombre d'appels et règles de consentement ;
- collecte les résultats structurés et les preuves ;
- organise la critique indépendante et la synthèse ;
- conserve un historique sans stocker les secrets ni les chaînes de pensée privées ;
- bloque les opérations externes non approuvées.

## 2. Rôles et responsabilités

### MerKora Control Plane
Source de vérité pour les projets, propriétaires, autorisations, budgets, missions, approbations, tâches, états et journaux d'audit. Aucun modèle ne peut s'octroyer des permissions.

### AI Gateway / Proxy
Point d'entrée serveur unique pour les appels IA. Il résout les alias de modèles côté serveur, sélectionne l'adaptateur fournisseur, applique les quotas et renvoie une réponse normalisée. Il ne révèle jamais les clés API au navigateur ou à un autre fournisseur.

### Agents spécialisés
- Planificateur principal : transforme la demande en objectifs, livrables, contraintes et étapes.
- Analyste : extrait les besoins et ambiguïtés.
- Architecte : propose une conception technique.
- Constructeur : produit des changements ou artefacts dans un environnement isolé.
- Réviseur indépendant : recherche les défauts et contradictions sans être le même fournisseur que le constructeur lorsque la diversité est disponible.
- Testeur : exécute des contrôles déterministes et rapporte des preuves.
- Synthétiseur : rassemble les résultats, désaccords et décisions humaines requises.

Les rôles sont des instructions de mission, pas des privilèges. Les permissions viennent exclusivement du serveur.

## 3. Flux de collaboration

1. L'utilisateur crée ou ouvre un projet et accorde le consentement de traitement IA applicable.
2. MerKora charge uniquement les données du projet que l'utilisateur et le rôle courant sont autorisés à voir.
3. Le planificateur produit un plan versionné avec périmètre, livrables, critères d'acceptation, risques et coût estimé.
4. L'utilisateur et l'administrateur approuvent séparément le périmètre, le plan et les actions sensibles selon les règles produit.
5. MerKora construit un graphe de tâches avec dépendances et fournisseurs candidats.
6. Le moteur réserve le budget, réclame une clé d'idempotence durable et lance uniquement les tâches prêtes.
7. Les fournisseurs reçoivent des enveloppes de mission minimisées, jamais les secrets des autres fournisseurs.
8. Le réviseur indépendant analyse les résultats et fournit des constats structurés.
9. MerKora compare les constats, demande une correction bornée si nécessaire et conserve les divergences non résolues.
10. Les tests déterministes et la revue de sécurité doivent réussir avant qu'un livrable puisse être déclaré vérifié.
11. Une personne autorisée approuve toute action externe sensible : écriture GitHub, migration, achat, publication ou déploiement.
12. MerKora présente un rapport final avec artefacts, preuves, limites connues et décisions restantes.

Aucun consensus artificiel : si les fournisseurs divergent, MerKora expose le désaccord et demande une décision humaine lorsqu'elle affecte le périmètre, la sécurité, le coût ou le résultat.

## 4. Contrat d'appel du proxy

Interface proposée, côté serveur uniquement :

`invokeAgent({ projectId, mission, providerId, modelAlias, budgetReservationId, idempotencyKey })`

Préconditions :
- session utilisateur valide et propriétaire/admin autorisé ;
- consentement IA actif pour ce projet et cette finalité ;
- connexion du fournisseur au statut `connected` et capacité requise accordée ;
- modèle résolu depuis une liste serveur autorisée ;
- budget disponible et réservation atomique ;
- mission rattachée au projet et à sa version de périmètre.

Résultat normalisé :
- `completed` avec résumé, constats, artefacts référencés, usage communiqué et vérifications ;
- `blocked` avec code sûr et raison exploitable ;
- `failed` avec code d'erreur expurgé ;
- `needs_human_decision` avec question et options explicites.

Ne jamais retourner au client : jeton fournisseur, clé API, prompt système, contenu confidentiel d'un autre tenant, exception brute, ou chaîne de pensée privée. Les rapports doivent contenir des conclusions, éléments vérifiables et justifications concises, pas les raisonnements internes cachés des modèles.

## 5. Sécurité multi-tenant et connexions

Une connexion est toujours associée à un propriétaire précis : organisation MerKora, utilisateur ou client/tenant. Le fait qu'un outil apparaisse dans un espace ne lui donne pas accès aux identifiants d'un autre propriétaire.

Pour chaque appel :
- vérifier propriétaire, projet, fournisseur, capacité, statut et finalité ;
- utiliser uniquement le credential du propriétaire correspondant ;
- ne jamais transmettre un credential d'un fournisseur à un autre ;
- limiter le contexte au minimum utile ;
- appliquer une liste de domaines/redirects autorisés pour les callbacks ;
- chiffrer les secrets au repos avec une enveloppe versionnée et une clé maître côté serveur ;
- enregistrer les événements d'accès et de révocation sans secret ni payload sensible ;
- rendre la révocation effective immédiatement côté MerKora.

Les tokens OAuth entrants des assistants qui accèdent à MerKora et les tokens sortants utilisés par MerKora pour appeler OpenAI, Anthropic, Google ou les outils sont deux catégories distinctes. Ils ne doivent jamais être réutilisés l'un pour l'autre.

## 6. Proxy entrant et connecteurs sortants

### Entrant : assistants vers MerKora
Le serveur MCP/API expose d'abord des opérations de lecture limitées au compte authentifié. Les outils d'écriture seront ajoutés un par un, avec scopes distincts, approbation explicite, idempotence et audit. Un client OAuth ne doit jamais obtenir les permissions d'un utilisateur direct par simple réutilisation de son jeton.

### Sortant : MerKora vers les fournisseurs
Chaque fournisseur implémente un adaptateur dédié avec :
- échange/renouvellement/révocation du credential selon le protocole officiel ;
- vérification non destructive de la connexion ;
- capacités explicitement déclarées ;
- limites et erreurs normalisées ;
- tests avec doubles déterministes avant tout appel réel.

OpenAI, Anthropic et Google Gemini sont les premiers candidats pour le moteur IA. GitHub, Supabase, Vercel, Figma et les autres outils sont des connecteurs d'exécution spécialisés, pas des modèles IA.

## 7. Persistance et exécution durable

Les primitives actuelles de graphe, cycle de vie, budget et idempotence sont en mémoire ou simulées. Elles ne constituent pas un moteur de production multi-instance.

Avant d'activer un worker réel, prévoir et faire approuver séparément :
- stockage durable des missions et enveloppes de mission ;
- état durable des tâches, tentatives, dépendances et verrous ;
- réservations de budget atomiques ;
- événements d'audit append-only ;
- stockage des références d'artefacts ;
- mécanisme de reprise après interruption et déduplication ;
- politique de rétention et suppression par tenant.

Aucune migration Supabase ne fait partie de cette spécification et aucune table existante ne doit être modifiée sans autorisation explicite. Le worker ne doit pas démarrer tant que le stockage durable, les politiques RLS, les limites et les procédures de reprise ne sont pas validés.

## 8. Limites d'exécution et prévention des coûts

Recommandations initiales à confirmer avant activation :
- maximum de 3 fournisseurs IA par mission standard ;
- maximum de 6 appels IA pour une mission de planification/revue ;
- maximum de 2 cycles de correction ;
- délai d'expiration par appel et par mission ;
- budget maximum par projet et par exécution ;
- arrêt automatique lorsque le budget est épuisé ou que les preuves requises manquent.

Les montants, quotas et modèles par défaut sont des décisions produit à valider. Aucun appel payant ne doit être effectué tant qu'un budget et une autorisation explicites ne sont pas configurés.

## 9. Plan de livraison technique

### Phase A — Contrat et contrôle du proxy
- compléter les types de requête/résultat et erreurs ;
- tester l'isolation tenant, le consentement, les capacités, l'idempotence et les limites ;
- créer une composition racine serveur qui refuse de démarrer si un adaptateur est absent ou mal configuré ;
- ajouter des métriques expurgées et des journaux d'audit sûrs.

### Phase B — Premier fournisseur IA réel, désactivé par défaut
- implémenter un seul adaptateur fournisseur derrière l'interface existante ;
- utiliser une clé serveur configurée manuellement et jamais renvoyée au client ;
- ajouter des tests unitaires simulés ; un test live ne sera exécuté qu'après autorisation et budget ;
- garder `MERKORA_AI_ENABLED=false` jusqu'à validation explicite.

### Phase C — Collaboration multi-fournisseurs
- ajouter les adaptateurs Anthropic et Gemini séparément ;
- sélectionner le réviseur sur un fournisseur distinct si possible ;
- normaliser les résultats et les coûts ;
- gérer indisponibilité, quota, timeout et divergence sans fallback silencieux.

### Phase D — Worker de fabrique
- définir le dépôt durable et le schéma après autorisation ;
- consommer les jobs approuvés, respecter les dépendances et produire des preuves ;
- isoler la génération de code dans un environnement éphémère sans secret de production ;
- ouvrir des branches/PR et previews seulement après approbations adaptées ;
- exiger revue et validation humaine avant fusion ou production.

### Phase E — Expérience client et livraison
- montrer les agents réellement actifs, leurs missions et états ;
- distinguer clairement « planifié », « en cours », « vérifié », « bloqué » et « livré » ;
- présenter les preuves, coûts estimés/réels, décisions et demandes d'approbation ;
- fournir un paquet de livraison, documentation et procédure de maintenance.

## 10. Critères d'acceptation

- Un utilisateur ne peut jamais lire les connexions ou projets d'un autre tenant.
- Aucun fournisseur ne peut choisir ou augmenter ses propres permissions.
- Une mission sans consentement, connexion, capacité ou budget est bloquée avant tout appel réseau.
- Une répétition de requête avec la même clé d'idempotence ne crée pas une deuxième exécution.
- Les erreurs et journaux ne divulguent aucune clé, token ou exception brute.
- Les divergences et les tâches non vérifiées restent visibles.
- Aucune action GitHub write, migration, dépense ou publication ne survient sans approbation requise.
- Les tests automatisés couvrent les chemins succès, refus, timeout, quota, révocation, reprise et isolation.
- Un fournisseur simulé n'est jamais présenté comme une connexion réelle.
- Le produit distingue clairement l'assistance IA, la génération de code, l'exécution de tests et la livraison réelle.

## 11. Décisions à obtenir avant activation réelle

1. Quel compte paie les appels IA : MerKora ou le client via sa propre clé/connexion ? Prévoir les deux modes à terme, mais choisir le premier pour le MVP.
2. Quels fournisseurs sont activés au premier lancement : OpenAI seul, puis Anthropic et Gemini, ou plusieurs dès le départ ?
3. Quel budget maximum par projet et par mois ?
4. Quelles actions peuvent être automatiquement exécutées après approbation, et lesquelles exigent une validation humaine à chaque occurrence ?
5. Quel service de stockage durable des secrets et des tâches est approuvé ?

## 12. État de départ observé

- Les modules de contrat de mission, planification de rôles, graphe, cycle de vie, garde-fous, gestionnaire de connexions et coffre de chiffrement existent déjà sous forme de fondations.
- Le gestionnaire de connexions est actuellement volatil et ne persiste pas les connexions.
- Le runtime fournisseur accepte des adaptateurs injectés mais aucun adaptateur réel n'est enregistré.
- Le serveur MCP existant expose uniquement profil/projets en lecture et garde la lecture projet désactivée par configuration.
- La fabrique crée une demande et ses tâches en file d'attente après approbations ; elle n'exécute pas encore ces tâches.
- Aucun changement de base, appel IA réel, achat, fusion ou déploiement de production n'est autorisé par ce document.


## 13. Avancement du code — 31 octobre 2026

Depuis la rédaction initiale, les éléments suivants ont été ajoutés sur la branche de travail :

- Adaptateurs serveur OpenAI, Anthropic et Gemini, avec alias de modèles autorisés côté serveur, clés non exposées, délais bornés et validation des résultats.
- Composition racine `createConfiguredAgentRuntime` : un fournisseur n'est enregistré que si une clé serveur et au moins un alias de modèle sont présents.
- Validation runtime renforcée des réponses JSON non fiables : types, listes, valeurs autorisées, limites, identifiants de mission/projet et statut de vérification.
- Revalidation centralisée de chaque résultat à la frontière du runtime.
- Exécuteur de collaboration séquentiel avec callbacks obligatoires d'autorisation et de réservation de budget avant tout appel fournisseur.
- Normalisation de la capacité commune `models.generate` entre le planificateur et les adaptateurs.
- Tests unitaires simulés pour les trois adaptateurs, le registre, la validation des résultats et les barrières d'autorisation/budget.
- Guide d'exploitation des variables serveur : `docs/operations/2026-10-31-provider-runtime-configuration.md`.

Ces éléments sont des fondations exécutables en test, pas encore une fonctionnalité de production complète. Il manque toujours le stockage durable multi-tenant, les contrôles d'accès intégrés à une route serveur authentifiée, les réservations de budget atomiques, la journalisation persistante, le worker durable et les écrans de gestion des connexions. Aucun appel fournisseur réel ni déploiement n'a été effectué.


### Compléments de sécurité et d'harmonisation — 31 octobre 2026

- Le runtime multi-fournisseurs possède maintenant un coupe-circuit global `MERKORA_AGENT_RUNTIME_ENABLED`, désactivé par défaut. Les clés seules ne suffisent donc pas à activer l'enregistrement des agents.
- Les capacités d'appel ont été harmonisées sous `models.generate` pour OpenAI, Anthropic et Gemini afin que le planificateur et les adaptateurs utilisent le même contrat.
- L'exécuteur séquentiel exige deux barrières serveur : autorisation du projet et réservation budgétaire. Il vérifie également l'état du fournisseur, sa capacité et l'alias modèle avant de réserver le budget.
- La synthèse déterministe distingue `incomplete`, `blocked` et `ready_for_human_review`. Elle ne transforme jamais les déclarations d'un fournisseur en preuve indépendante ni en livraison.
- Le coffre AES-256-GCM lie le ciphertext au couple connexion/fournisseur via AAD et accepte un résolveur de clés par identifiant pour préparer la rotation. Aucun coffre durable ni trousseau de production n'est configuré.
- Le contenu des missions est explicitement traité comme une donnée non fiable dans les instructions système des trois adaptateurs.

Le commutateur runtime est maintenu à `false` dans `.env.example`. Les appels fournisseur réels restent désactivés tant que les contrôles d'accès projet, le consentement, le budget atomique, l'audit durable et le worker de production ne sont pas raccordés.


### Isolation des identifiants par connexion — 31 octobre 2026

Les appels d'agents portent désormais l'identifiant de connexion et son propriétaire (`organization`, `user` ou `customer`). La résolution du credential reçoit ce contexte exact. Les clés globales MerKora ne sont utilisables que pour le propriétaire organisationnel explicitement identifié par `MERKORA_ORGANIZATION_ID`. Un compte client ne peut jamais retomber silencieusement sur une clé globale de l'organisation.

Le résolveur de credentials par tenant est une interface serveur préparée, mais il n'est pas encore raccordé au stockage Supabase durable. Le runtime demeure désactivé par défaut et ne doit pas être activé en production avant la mise en place du stockage, de la vérification d'accès et des audits.
