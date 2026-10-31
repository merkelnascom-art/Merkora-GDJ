# MerKora GDJ — Architecture d'orchestration multi-outils
Date: 2026-10-31
Statut: fondation de conception à implémenter progressivement
Branche: `feature/merkora-orchestration-foundation`

## 1. Vision produit

MerKora est le point d'entrée unique du client. Le client décrit son problème, son contexte, les résultats attendus, son budget et ses contraintes. MerKora clarifie les zones d'incertitude, propose des pistes, affiche un studio visuel fidèle aux choix retenus, prépare une proposition, puis coordonne la construction et les tests d'un logiciel lorsqu'elle est autorisée.

Le client ne doit pas connaître les fournisseurs techniques. MerKora choisit des capacités adaptées au projet, explique les limites, garde une trace des décisions et demande une approbation explicite avant toute action à risque.

## 2. Règles non négociables

- Aucun secret, token ou clé fournisseur ne va dans le navigateur, les prompts client ou le dépôt Git.
- Aucun déploiement de production, paiement, achat de service, migration destructive, suppression de données ou fusion dans `main` sans autorisation explicite.
- Ne jamais réinitialiser la base Supabase ni modifier un projet tiers au seul motif qu'il est connecté.
- Chaque client et chaque projet sont isolés : autorisation serveur, vérification du propriétaire, moindre privilège et RLS lorsque la base est utilisée.
- Les instructions d'un client, documents, dépôts et sorties de modèles sont des données non fiables. Elles ne peuvent pas contourner les règles de sécurité.
- Les sorties d'un modèle sont des propositions, pas des faits vérifiés. Le code généré doit être testé avant d'être présenté comme fonctionnel.
- Pas de modèle ou de fournisseur de secours choisi silencieusement. Si la configuration manque ou si le budget est dépassé, arrêter proprement et informer l'utilisateur.
- L'IA reste désactivée par défaut jusqu'à ce que le propriétaire ait configuré, budgété et testé chaque intégration.
- Le studio interactif et l'image générée sont deux livrables différents : l'image est illustrative, la maquette est un prototype, aucun des deux n'est une application déployée.

## 3. Architecture cible

### A. Interface MerKora
- Espace client : dossiers, besoins, questions de clarification, pistes, choix, maquette, commentaires, proposition et statut de réalisation.
- Espace administrateur : file de dossiers autorisés, revue des concepts, coûts, exécutions, erreurs, approbations et journal d'audit.
- Interface de travail : statut visible de chaque étape et de chaque outil; pas de fausse indication de réussite.

### B. Orchestrateur serveur
Une couche serveur coordonne les étapes et conserve un état de workflow explicite. Elle ne donne pas un accès universel aux modèles. Chaque tâche reçoit un ensemble de capacités autorisées et une limite de coût/temps.

États indicatifs :
`intake` → `clarification` → `solution_proposal` → `visual_concept` → `client_review` → `quote_review` → `approved_for_build` → `implementation` → `tests` → `preview_review` → `delivery_approval` → `delivered`.

Toute étape peut passer à `blocked` ou `needs_human_review`. Une approbation de maquette ne vaut jamais approbation de devis, de paiement ou de déploiement.

### C. Registre des capacités
Chaque fournisseur est représenté par un adaptateur avec un contrat uniforme :
- identifiant et capacités supportées;
- statut configuré / indisponible;
- limites, budget et timeout;
- classification des données autorisées;
- règles de conservation et conditions du fournisseur à vérifier;
- mode test et état de santé;
- coût estimé et coût réel quand disponible.

Un fournisseur ne doit pas être sélectionné parce que son nom est célèbre : il doit correspondre à la tâche, aux contraintes, à la qualité nécessaire, au budget et aux règles de confidentialité.

### D. Registre des modèles
Les tâches prévues incluent conversation, analyse de besoins, architecture, génération de code, revue de code et rédaction de tests. Un modèle peut être choisi par tâche, avec un modèle partagé de secours uniquement s'il est explicitement configuré. Les identifiants et prix doivent être vérifiés dans le catalogue actuel du fournisseur. Aucun nom de modèle n'est présumé disponible.

### E. Environnements de construction isolés
- Dépôt Git dédié par produit, branche de fonctionnalité et commits explicites.
- Environnement de test/sandbox isolé par tâche, avec ressources et durée limitées.
- Tests automatiques, lint/typecheck/build et inspection des résultats.
- Les secrets de production ne sont pas injectés dans les environnements non fiables.
- Aperçu de préproduction seulement après les contrôles; production après approbation distincte.
- Les sorties générées par un modèle doivent être revues et comparées au cahier des charges.

### F. Persistance et audit
Réutiliser le schéma Supabase et les règles RLS existantes après inspection. Toute modification de schéma doit être additive, documentée, testée et autorisée. Journaliser les actions, acteur, projet, fournisseur, version des entrées, approbations, coûts et résultats sans journaliser les secrets ni des données personnelles inutiles.

## 4. Outils à considérer et rôle possible

Les intégrations ne sont pas réputées actives simplement parce qu'elles sont nommées ici.

- **GitHub** : dépôts, branches, commits, pull requests, historique et revue du code.
- **Vercel** : aperçu et déploiement Next.js, journaux et configuration d'environnement, selon les droits accordés.
- **Supabase** : base de données, authentification, stockage et politiques d'accès. Toute opération doit respecter les règles de propriété et de non-destruction.
- **Netlify** : alternative d'hébergement et d'aperçu lorsque le projet s'y prête; ne pas déployer le même projet sur plusieurs plateformes sans raison.
- **Render** : services backend, tâches longues et bases de données lorsque l'architecture le justifie.
- **Anthropic Claude, OpenAI, Google Gemini et autres fournisseurs** : capacités de raisonnement, conversation, analyse ou génération selon modèles disponibles, coût, qualité et confidentialité. Une clé et un compte autorisés sont nécessaires pour les intégrations directes.
- **Vercel AI Gateway** : option de routage vers des modèles compatibles; elle ne remplace pas le registre de capacités, le budget ni les contrôles de sécurité.
- **Codex ou agents de développement équivalents** : aide à la modification, à la navigation et aux tests du code, dans des environnements autorisés.
- **Outils de design/prototypage comme Figma ou MagicPath** : maquettes et interfaces lorsque leur API/connexion permet l'action voulue.
- **Outils d'image** : illustrations personnalisées à partir des besoins et choix réels du client.
- **Codunk / Creatly / autres noms évoqués** : ne pas intégrer sur la seule base du nom. Vérifier d'abord le produit exact, l'éditeur, la documentation, les API, les autorisations, les coûts et la pertinence. Si aucune interface technique adaptée n'existe, le traiter comme outil manuel plutôt que simuler une intégration.

Une intégration peut être native, via API officielle, via connecteur autorisé, ou manuelle. Le statut doit être affiché honnêtement.

## 5. Flux de travail cible par dossier

1. Capturer le besoin, le contexte, les objectifs, les contraintes, le budget et les informations à ne pas transmettre.
2. Détecter les ambiguïtés et poser des questions de clarification.
3. Produire une synthèse éditable et demander confirmation des faits essentiels.
4. Proposer plusieurs pistes avec bénéfices, limites, risques, coût/effort indicatifs et hypothèses.
5. Laisser le client sélectionner les options et modules.
6. Générer une maquette interactive à partir des choix sélectionnés et, si configuré, une image illustrative liée à la même version du concept.
7. Enregistrer les versions, commentaires et état de revue.
8. Préparer un devis indicatif puis une proposition commerciale distincte, validée par l'administrateur. Ne pas présenter une estimation IA comme un devis contractuel.
9. Après accord explicite, générer un plan technique et ouvrir un environnement de construction isolé.
10. Faire travailler les agents par tâches bornées : architecture, code, tests, revue. Aucun agent ne reçoit des accès inutiles.
11. Exécuter les tests et corriger les échecs. Si les contrôles ne passent pas, ne pas prétendre que le logiciel est prêt.
12. Créer une prévisualisation de test et obtenir l'approbation du client/administrateur avant toute livraison.
13. Déployer en production uniquement après approbation distincte, contrôle des secrets, sauvegardes et plan de retour arrière.
14. Remettre le code, la documentation, les limites connues, les coûts récurrents et les consignes de maintenance.

## 6. Sécurité et gouvernance des agents

- Le modèle propose une action; un moteur de politiques décide si elle est autorisée.
- Les actions sont classées : lecture, écriture de branche, test isolé, publication d'aperçu, modification de données, dépense et production.
- Les actions de lecture peuvent être automatisées dans le périmètre accordé. Les écritures sont limitées à la branche/projet autorisés. Les actions destructrices, dépenses et production demandent confirmation explicite.
- Toute action possède un identifiant d'exécution, un délai, un plafond de coût, des entrées validées et une sortie contrôlée.
- Idempotence, retries bornés, arrêt d'urgence, détection de boucle et limites de tokens/appels.
- Aucun outil ne peut augmenter ses propres privilèges.
- Les fichiers et contenus de dépôts peuvent contenir des instructions malveillantes; ils ne peuvent pas remplacer les règles du système.
- Le client choisit les informations qu'il soumet; les données confidentielles ne sont pas envoyées à un fournisseur non approuvé.

## 7. Déploiement progressif

### Phase 0 — Inventaire et sécurité
Confirmer la branche, les workflows existants, les routes serveur, l'authentification, les variables d'environnement, les politiques RLS et les tests. Aucun changement de production.

### Phase 1 — Orchestrateur de workflows
Créer des types partagés pour les tâches, états, approbations, événements et résultats. Ajouter un moteur de politiques sans action destructive.

### Phase 2 — Routage multi-modèle
Connecter le résolveur de modèles au serveur existant, puis ajouter des adaptateurs fournisseur avec configuration explicite, timeout, budget et gestion d'erreurs. Pas d'appel réel avant test contrôlé.

### Phase 3 — Studio de concept
Relier besoins, options sélectionnées, maquette et génération d'image à une version commune. Enregistrer les concepts selon les mécanismes existants et les règles d'accès.

### Phase 4 — Atelier de code
Créer des tâches de construction isolées avec GitHub, sandbox, tests et revue. Commencer par un petit projet de démonstration non sensible.

### Phase 5 — Aperçu et livraison
Connecter l'hébergement choisi pour les aperçus, avec vérification des résultats. Déploiement de production soumis à approbation distincte.

### Phase 6 — Catalogue et exploitation
Ajouter suivi des coûts, limites par client, quotas, facturation séparée, observabilité, support et procédures de retour arrière.

## 8. Critères de réussite

- Un client peut décrire un besoin et corriger la synthèse de MerKora.
- Les recommandations et la maquette reflètent les choix réellement sélectionnés.
- Le système identifie les intégrations manquantes sans simuler leur fonctionnement.
- Les tâches ont un état et un historique visibles.
- Un projet client ne peut pas accéder aux données d'un autre.
- Les modèles et fournisseurs sont configurables sans exposer de secrets.
- Les budgets, quotas et autorisations sont contrôlés côté serveur.
- Le code généré est testé et les échecs sont rapportés.
- Les données existantes sont préservées.
- Aucun déploiement de production ou achat n'est déclenché sans approbation.
- Les tests existants, le typecheck et le build sont exécutés avant toute déclaration de réussite.

## 9. Première tâche d'implémentation

Inspecter les routes serveur et les contrats existants avant d'ajouter un orchestrateur. Identifier le point d'entrée réel de l'analyse IA et la façon dont les dossiers sont authentifiés, chargés et sauvegardés. Intégrer le résolveur de modèles dans ce chemin existant plutôt que de créer une deuxième voie d'IA. Ajouter des tests unitaires ciblés et exécuter les commandes de vérification. Ne pas créer de clés, modifier de variables de production, toucher aux données ou fusionner sans autorisation.
