# MerKora GDJ — principe fondateur de l’usine logicielle autonome

**Date :** 30 octobre 2026  
**Statut :** Exigence d’architecture validée pour la conception  
**Branche de référence :** `feature/admin-preview-secure-access`

## 1. Principe non négociable

> **MerKora GDJ doit pouvoir analyser un besoin, concevoir une solution, générer son application, la développer, la tester, corriger ses erreurs et la livrer de manière autonome, sous la supervision et le contrôle de son administration.**

MerKora n'est pas simplement un catalogue de services numériques ni une interface dans laquelle un opérateur humain exécute manuellement chaque commande. Sa finalité est de devenir une plateforme capable de transformer une demande métier validée en un produit numérique fonctionnel, vérifié et livrable.

ChatGPT, les modèles IA et les outils externes peuvent contribuer à construire, améliorer ou assister MerKora. Ils ne doivent pas devenir une dépendance humaine permanente pour fabriquer chaque application cliente. À terme, c'est le moteur de production de MerKora qui orchestre le travail.

Cette exigence décrit une capacité cible. Elle ne signifie pas que l'autonomie complète est déjà implémentée ou disponible dans le prototype actuel.

## 2. Exigence explicite : MerKora produit ses propres plans de projet

Le moteur de planification est une capacité native de MerKora GDJ. Pour chaque nouveau dossier client, MerKora doit produire et maintenir le plan du projet à partir des besoins, contraintes, choix validés et objectifs réellement enregistrés dans ce dossier.

Le plan ne doit pas être rédigé manuellement par ChatGPT, par un assistant externe ou par un opérateur pour chaque client. Les modèles IA et outils tiers peuvent être utilisés comme composants techniques du moteur, mais la responsabilité du résultat, de sa cohérence, de son versionnement et de son suivi appartient à MerKora.

Pour chaque projet, le moteur doit être capable de générer :
- un résumé du problème, des objectifs et du résultat attendu ;
- le périmètre inclus, les exclusions et les hypothèses ;
- les modules et fonctionnalités correspondant aux choix du client ;
- les exigences fonctionnelles, techniques, de sécurité et d'exploitation ;
- une architecture proposée et ses justifications ;
- les étapes, tâches, dépendances, priorités et jalons ;
- les critères d'acceptation et les scénarios de vérification ;
- une estimation des ressources, délais, coûts et incertitudes ;
- les points nécessitant une clarification ou une approbation humaine.

Le plan est un artefact versionné lié au dossier client et à la version de sa spécification. Il doit pouvoir être recalculé lorsqu'un choix change, en montrant les différences et les conséquences sur le périmètre, le coût, les délais et les tâches. Une modification du besoin ne doit pas effacer l'historique ni réécrire silencieusement un plan déjà validé.

Le parcours attendu est donc : besoin client → analyse MerKora → propositions et choix → spécification validée → plan de projet généré par MerKora → validation requise selon le niveau de risque → exécution par l'usine → vérification et suivi.

L'administration supervise et peut demander une révision ou valider les étapes sensibles ; elle n'a pas à reconstruire manuellement chaque plan. Si les informations sont insuffisantes, MerKora pose des questions ciblées et signale les hypothèses au lieu d'inventer des réponses.

Cette capacité doit être testée indépendamment de la génération de code. Elle constitue une porte d'entrée obligatoire de l'usine : aucun job de construction ne démarre sans plan traçable, critères d'acceptation et périmètre autorisé.

## 3. Parcours autonome cible

1. **Comprendre** — recueillir le problème, le contexte, les utilisateurs, les objectifs, les contraintes et les résultats attendus.
2. **Clarifier** — détecter les informations manquantes et demander au client uniquement les précisions qui changent réellement la solution.
3. **Analyser** — structurer les besoins, distinguer les exigences fonctionnelles, techniques, de sécurité, de conformité et d'exploitation.
4. **Proposer** — présenter plusieurs solutions possibles, leurs avantages, limites, coûts estimatifs et compromis.
5. **Composer** — transformer les options sélectionnées par le client en spécification exploitable et versionnée.
6. **Visualiser** — produire des maquettes fidèles aux besoins et options effectivement sélectionnés. Une maquette ne doit jamais inventer des modules ou décisions non choisis.
7. **Faire valider** — obtenir la validation du client sur le périmètre, le concept et le devis selon des états distincts.
8. **Planifier** — décomposer le travail en tâches testables, définir les interfaces, dépendances, critères d'acceptation et budget d'exécution.
9. **Construire** — générer et modifier le code dans un environnement isolé propre au projet.
10. **Vérifier** — exécuter les tests, le contrôle de types, les contrôles de sécurité et le build. Les résultats doivent être conservés comme preuves.
11. **Corriger** — analyser les échecs, proposer une correction limitée, la tester à nouveau et conserver l'historique des tentatives.
12. **Réviser** — soumettre les résultats à des contrôles automatisés et, selon le risque, à une revue humaine.
13. **Livrer** — préparer un aperçu, une recette client, puis une livraison uniquement après les autorisations requises.
14. **Suivre** — conserver les versions, événements, coûts, décisions, erreurs et demandes de modification.

Le système doit pouvoir s'arrêter proprement lorsqu'une information, une permission, une ressource ou une validation manque. Il ne doit jamais simuler une réussite.

## 4. Architecture logique recommandée

Les chemins ci-dessous sont des responsabilités et emplacements proposés ; ils doivent être confrontés à la structure réelle du dépôt avant toute implémentation.

### 4.1 Plan de contrôle MerKora

Responsable de l'expérience client et de l'administration : dossiers, besoins, choix, maquettes, devis, validations, suivi, facturation et autorisations. Il ne doit pas exécuter directement du code arbitraire dans le processus web principal.

### 4.2 Orchestrateur de production

Emplacement proposé : `src/lib/factory/orchestrator/`.

- Reçoit une demande de production liée à un projet et à une version de spécification validée.
- Décompose le travail en tâches et choisit des capacités spécialisées.
- Gère l'état de la production, les dépendances, les reprises et les limites.
- Ne peut invoquer que des outils autorisés par une politique explicite.
- Enregistre chaque transition et chaque résultat.

Interface conceptuelle :

```ts
type FactoryJobStatus =
  | "queued" | "planning" | "building" | "testing"
  | "repairing" | "awaiting_approval" | "ready"
  | "blocked" | "failed" | "delivered";

type FactoryJob = {
  id: string;
  projectId: string;
  specificationVersion: string;
  status: FactoryJobStatus;
  createdAt: string;
};

interface FactoryOrchestrator {
  start(input: {
    projectId: string;
    specificationVersion: string;
    approvedScope: string[];
  }): Promise<FactoryJob>;
  resume(jobId: string, approvalId?: string): Promise<FactoryJob>;
  getStatus(jobId: string): Promise<FactoryJob>;
}
```

Les noms et signatures sont des contrats conceptuels à adapter après inspection du code existant.

### 4.3 Capacités spécialisées

Emplacement proposé : `src/lib/factory/agents/`.

Capacités séparables, coordonnées par l'orchestrateur :
- analyste de besoins ;
- architecte logiciel ;
- concepteur UI/UX et Studio Visuel ;
- planificateur ;
- générateur de code ;
- ingénieur de tests ;
- diagnostiqueur et réparateur ;
- réviseur sécurité ;
- préparateur de livraison.

Ces capacités peuvent utiliser des modèles IA différents, mais aucune ne reçoit automatiquement un accès global. Chaque capacité reçoit seulement le contexte nécessaire à sa tâche.

### 4.4 Générateurs et modèles de projet

Emplacement proposé : `src/lib/factory/templates/`.

- Bibliothèque de modèles versionnés (application web, tableau de bord, gestion de personnel, commerce, portail client, etc.).
- Composants et modules réutilisables.
- Contrats d'interface et conventions de sécurité.
- Génération déterministe lorsque possible ; IA pour les décisions et adaptations qui le nécessitent.
- Chaque projet conserve son propre manifeste, ses dépendances et ses versions.

Ne pas créer un générateur universel opaque. Commencer par un petit nombre de familles d'applications testées et élargir sur preuve.

### 4.5 Environnements d'exécution isolés

Emplacement proposé : `src/lib/factory/workspaces/` et infrastructure d'exécution dédiée.

- Chaque travail s'exécute dans un espace isolé, distinct du serveur web MerKora.
- Accès au dépôt et aux secrets limités au projet, à la branche et à la tâche.
- Pas de privilège d'administration Supabase ou Vercel donné par défaut aux agents.
- Limites de temps, mémoire, coût, taille de sortie et nombre de tentatives.
- Réseau sortant fermé par défaut ou limité à une liste autorisée.
- Aucun accès aux autres projets ou données clients.
- Nettoyage contrôlé des espaces temporaires sans toucher aux livrables conservés.

### 4.6 Vérification et réparation

Emplacement proposé : `src/lib/factory/verification/`.

Une production n'est « prête » que si les preuves attendues existent :
- tests unitaires et d'intégration ;
- vérification TypeScript et lint lorsqu'ils sont configurés ;
- build de production local/Preview ;
- contrôles de sécurité et de secrets ;
- critères d'acceptation propres au projet ;
- statut explicite des contrôles non exécutés.

Boucle de réparation bornée :
1. capturer l'échec et son contexte ;
2. classifier la cause probable ;
3. proposer un changement limité ;
4. exécuter les tests ciblés ;
5. exécuter la suite de régression pertinente ;
6. conserver diff, logs et résultats ;
7. arrêter et demander une intervention si le budget de tentatives est atteint, si le risque augmente ou si la cause reste incertaine.

Le moteur ne doit jamais modifier ses propres politiques de sécurité pour faire passer un test.

### 4.7 Politique d'autorisation et supervision

Emplacement proposé : `src/lib/factory/policies/`.

Actions automatisables après validation du périmètre :
- analyser les besoins ;
- produire un plan ;
- générer une maquette ;
- créer ou modifier des fichiers dans un workspace isolé ;
- exécuter des tests et builds sans effet externe ;
- préparer un déploiement Preview non public.

Actions soumises à une autorisation administrative explicite, selon le contexte :
- engager des coûts ou dépasser un budget approuvé ;
- créer ou modifier des ressources cloud ;
- appliquer une migration de base de données ;
- accéder à des données personnelles ou sensibles ;
- modifier les rôles, secrets, politiques d'accès ou paramètres de sécurité ;
- promouvoir en production, publier un domaine ou livrer officiellement ;
- créer, modifier ou confirmer une facture ou un paiement.

Une approbation doit être liée à une action précise, un projet, une version, un périmètre et une durée. Une approbation ne vaut pas autorisation générale et ne doit pas être réutilisée pour une action différente.

### 4.8 Journal d'audit

Emplacement proposé : `src/lib/factory/audit/`.

Pour chaque étape, enregistrer au minimum :
- projet et job concernés ;
- acteur ou capacité ayant agi ;
- action demandée et justification ;
- version de la spécification et du modèle utilisés ;
- outils invoqués ;
- autorisation associée, si nécessaire ;
- résultat, statut et horodatage ;
- références vers les logs, diffs et preuves de test.

Ne pas copier inutilement les réponses privées des utilisateurs, mots de passe, tokens, clés API, PIN, OTP ou contenus sensibles dans les journaux. Les secrets sont masqués. Les données détaillées d'un client ne sont accessibles qu'aux personnes et services autorisés.

## 5. Séparation des responsabilités

- **Client :** décrit le besoin, choisit les options, valide le concept et le périmètre, accepte le devis et réalise la recette.
- **Moteur MerKora :** analyse, planifie, conçoit, génère, construit, teste, corrige et prépare la livraison.
- **Administration MerKora :** supervise, autorise les opérations sensibles, contrôle les coûts, traite les blocages et décide des mises en production/livraisons.
- **Fournisseurs externes :** modèles IA, GitHub, hébergement, base de données et services tiers ; ils sont appelés par des adaptateurs limités et traçables.

L'administration doit pouvoir voir ce que le moteur a fait, pourquoi, sur quelle version, avec quel résultat et quelles preuves, sans devoir intervenir manuellement dans chaque étape normale.

## 6. Déploiement progressif de l'autonomie

| Niveau | Capacité | Autorisation |
|---|---|---|
| 0 — Assistance | Analyse et recommandations uniquement | Validation humaine pour toute action |
| 1 — Conception | Spécification, plan et maquettes | Client valide le périmètre |
| 2 — Construction isolée | Code et tests dans un workspace | Automatique dans les limites approuvées |
| 3 — Preview | Build et déploiement non-production | Autorisation Preview explicite |
| 4 — Livraison contrôlée | Recette et préparation de livraison | Validation client et admin |
| 5 — Exploitation encadrée | Suivi, diagnostics et correctifs limités | Politique d'exploitation et approbations selon risque |

Le passage à un niveau supérieur dépend de tests et de preuves observables, jamais d'une simple déclaration de l'agent.

## 7. Student Vision comme premier projet de validation

Student Vision est le premier cas d'essai de bout en bout de l'usine MerKora. Son cahier des charges existant décrit le produit à fabriquer et ses critères d'acceptation.

**Ordre impératif :**
1. construire d'abord les capacités minimales de l'usine MerKora ;
2. vérifier que l'usine peut prendre une spécification, planifier le travail, produire une application isolée et fournir des preuves de test ;
3. confier ensuite à cette usine la réalisation de Student Vision ;
4. utiliser les résultats de Student Vision pour améliorer les générateurs, tests, contrôles et procédures de l'usine.

ChatGPT peut aider à concevoir et développer l'usine elle-même, à examiner les résultats et à améliorer ses règles. Il ne doit pas être le constructeur manuel permanent de Student Vision à la place de MerKora.

Le statut commercial existant de Student Vision, ses données de lancement et ses montants ne doivent pas être confondus avec son avancement technique. Le lancement enregistré ne prouve pas que l'application est construite ou livrée.

## 8. Sécurité et limites obligatoires

- Aucun déploiement en production sans approbation administrative explicite.
- Aucune migration destructive, réinitialisation ou suppression de données.
- Aucun secret dans le navigateur, le code généré public, les logs ou les maquettes.
- Aucun accès transversal entre projets clients.
- Aucune confirmation automatique de paiement.
- Aucune action externe non autorisée sous prétexte de corriger un échec.
- Les coûts, tentatives et durées d'exécution sont plafonnés.
- Un blocage de sécurité arrête le job ; il ne se contourne pas automatiquement.
- Toute sortie non vérifiée est marquée comme telle.
- Le client garde le droit de demander une modification ou de refuser la solution proposée.

## 9. Critères de réussite de l'usine

L'exigence sera considérée comme démontrée seulement lorsqu'un test reproductible prouvera que MerKora peut, sans qu'un opérateur ChatGPT construise manuellement l'application cliente :

1. recevoir une spécification client validée et versionnée ;
2. créer un plan de production traçable ;
3. créer un workspace isolé pour le projet ;
4. générer une application à partir d'un modèle et de modules autorisés ;
5. exécuter les tests et le build ;
6. diagnostiquer et corriger au moins un échec contrôlé dans la limite fixée ;
7. conserver les diffs, logs et preuves ;
8. arrêter le processus lorsqu'une autorisation humaine est requise ;
9. produire un Preview non-production après autorisation ;
10. afficher l'état, les blocages et les preuves dans l'administration MerKora.

Jusqu'à ce que ces critères soient prouvés, toute capacité non réalisée doit être présentée comme planifiée, expérimentale ou indisponible — jamais comme déjà autonome.

## 10. Décisions à confirmer avant l'exécution technique

- Choisir l'environnement d'exécution isolé (conteneurs éphémères, workers dédiés ou service sandbox) selon les capacités réellement disponibles.
- Définir les plafonds initiaux de coût, durée, mémoire et tentatives par job.
- Définir les familles de modèles d'applications prioritaires après inventaire des demandes clients.
- Déterminer les règles de conservation des workspaces, diffs, logs et artefacts.
- Définir le niveau de revue humaine requis selon la criticité des applications générées.
- Confirmer les fournisseurs IA et leurs règles de traitement des données avant d'envoyer des données client.
