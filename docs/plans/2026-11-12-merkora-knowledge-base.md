# MerKora GDJ — Base de connaissances et inventaire des ressources — Plan d’implémentation

> **For agentic workers:** Use the host's available task-by-task implementation workflow. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Inventorier les ressources MerKora déjà accessibles, les conserver sans altération, puis créer un catalogue versionné et une recherche locale traçable que le cerveau de MerKora pourra exploiter.

**Architecture:** Le premier sous-projet reste indépendant de Supabase et des fournisseurs IA. Les originaux sont conservés, les contenus lisibles sont extraits vers un espace de connaissances versionné, et un manifeste décrit provenance, catégorie, secteur, version, statut et niveau de confiance. Une recherche locale déterministe fournit les ressources pertinentes avec leur provenance ; le futur orchestrateur IA consommera ce contrat sans traiter les documents importés comme des instructions système fiables.

**Tech Stack:** Next.js 16 App Router, TypeScript strict, Node.js, Vitest 3.2.4, GitHub repository, ChatGPT Library files for source discovery. No new runtime dependency is required for the initial Markdown/JSON/TXT ingestion.

## Global Constraints

- MerKora doit servir des projets de tous secteurs et des projets multi-sectoriels.
- Les ressources existantes du propriétaire sont destinées à être exploitées par MerKora.
- Les secteurs constituent un catalogue évolutif, jamais une liste fermée.
- Les ressources ne sont pas réécrites ni supprimées pendant l'import initial.
- Toute ressource importée reçoit une provenance, une version et un statut de validation.
- Les ressources non vérifiées ou contradictoires sont signalées.
- Les contenus importés sont des données non fiables : ils ne deviennent jamais automatiquement des instructions système, du code exécutable ou une politique de sécurité.
- Aucune réinitialisation, suppression de données ou migration Supabase dans ce sous-projet.
- Aucun changement à WALL Trade ou aux autres projets.
- Aucun appel IA payant, service payant ou environnement Sandbox sans autorisation et budget vérifiés.
- Développer et vérifier sur `feature/merkora-rebuild-foundation`.
- Aucun changement ne doit être fusionné dans `main` ni promu en production sans autorisation explicite.
- Ne jamais committer de secret ni de fichier `.env.local`.

---

## État du dépôt vérifié

Branche : `feature/merkora-rebuild-foundation`.

Chemins existants observés :
- `src/lib/discovery.ts` : classification actuelle en six domaines et questions de clarification codées en dur.
- `src/lib/solution-recommendations.ts` : catégories et recommandations locales codées en dur.
- `src/lib/local-analysis.ts` : pré-analyse locale et améliorations par catégorie.
- `src/lib/ai-provider.ts` : appel serveur Vercel AI Gateway.
- `app/api/ai/analyze/route.ts` : prompt d’analyse actuellement intégré directement à la route serveur.
- `vitest.config.ts` : alias `@/` vers `src/`, environnement de test Node.
- `package.json` : scripts `npm test`, `npm run typecheck` et `npm run build`.

Le dépôt ne contient actuellement aucun répertoire `knowledge/`, aucun manifeste de secteurs et aucun catalogue de prompts identifié dans l’arborescence de cette branche. Le contenu métier est aujourd’hui surtout incorporé aux fichiers TypeScript ci-dessus.

Ressources déjà retrouvées dans la Library lors de la recherche initiale :
- `2026-10-27-merkora-gdj-design.md` : ancienne conception MerKora, parcours client, modèle commercial, sécurité et phases de réalisation.
- `Pasted markdown(3).md` et `Pasted markdown(4).md` : documents de conception AÉRO SERVICE / AÉRO SERVICE TRAVEL, exemples de rôles, présence, retards, pénalités, notifications et gestion de dossiers.
- `Pasted markdown.md` et `Pasted markdown(1).md` : notes et données d’exemple de suivi financier d’une activité, à classer comme exemple métier et non comme règle universelle.
- `Wall_Trade_Gestion_Revendeurs.xlsx` : modèle de gestion des revendeurs, à classifier comme ressource spécifique à un projet distinct, réutilisable uniquement comme exemple de structure après revue.

Ces résultats prouvent que des ressources historiques existent, mais ne constituent pas encore un inventaire exhaustif de la Library. Le catalogue autonome des 500 secteurs annoncé par le propriétaire n’a pas été retrouvé dans les résultats de recherche initiaux ; il ne doit pas être reconstitué artificiellement. L’inventaire doit poursuivre la recherche et inscrire précisément toute ressource introuvable comme « source attendue non localisée ».

## Contrat de données proposé

Le manifeste initial sera un fichier JSON versionné. Une entrée de ressource contient :

```ts
export type KnowledgeResourceKind =
  | "sector"
  | "prompt"
  | "business_rule"
  | "workflow"
  | "example"
  | "template"
  | "component"
  | "code"
  | "schema"
  | "documentation"
  | "asset";

export type KnowledgeReviewStatus =
  | "discovered"
  | "extracted"
  | "needs_review"
  | "approved"
  | "rejected"
  | "needs_extraction";

export type KnowledgeResource = {
  id: string;
  title: string;
  description: string;
  kind: KnowledgeResourceKind;
  sectors: string[];
  tags: string[];
  language: string;
  source: {
    name: string;
    location: string;
    sourceVersion?: string;
    contentSha256?: string;
  };
  version: number;
  status: KnowledgeReviewStatus;
  sensitivity: "public" | "internal" | "confidential";
  extractedPath?: string;
  dependencies: string[];
  notes: string[];
};
```

Les identifiants sont stables et ne dépendent pas du nom de fichier. Les secteurs sont des étiquettes extensibles et plusieurs secteurs peuvent être associés à une même ressource. Les champs facultatifs restent absents lorsqu’ils ne sont pas connus ; aucune donnée manquante ne sera inventée.

---

### Task 1: Inventorier et classer les ressources historiques

**Files:**
- Create: `knowledge/README.md`
- Create: `knowledge/inventory.md`
- Create: `knowledge/manifest.json`
- Create: `knowledge/sources/README.md`
- Test: `src/lib/knowledge/inventory.test.ts`

**Interfaces:**
- Consumes: arborescence Git de la branche, fichiers accessibles dans la Library, anciens documents de conception et ressources historiques explicitement associées à MerKora ou à ses projets pilotes.
- Produces: inventaire daté, manifeste initial et liste explicite des sources à retrouver ; aucune donnée n’est encore écrite dans Supabase.

- [ ] **Step 1: Ajouter les tests de l’inventaire**
  
  Créer des tests Vitest vérifiant que :
  1. chaque entrée du manifeste possède un identifiant, un titre, un type, une provenance, une version et un statut ;
  2. une ressource multi-sectorielle accepte plusieurs étiquettes ;
  3. une source non retrouvée peut être enregistrée avec le statut `needs_extraction` et une note explicative ;
  4. deux ressources de même nom mais de provenances différentes ne sont pas fusionnées automatiquement ;
  5. les ressources de projets distincts (WALL Trade, AÉRO SERVICE, Ginesse, Asho Sweet) sont classées comme exemples/projets spécifiques, pas comme règles globales.

- [ ] **Step 2: Vérifier l’échec initial**
  
  Run: `npm test -- src/lib/knowledge/inventory.test.ts`
  
  Expected: échec initial indiquant que le module d’inventaire ou le manifeste n’existe pas encore.

- [ ] **Step 3: Établir l’inventaire sans altérer les originaux**
  
  Examiner les fichiers du dépôt et les documents Library pertinents, en élargissant la recherche aux noms et contenus liés aux secteurs, prompts, modèles, scripts, exemples et spécifications MerKora. Pour chaque ressource retrouvée, consigner son nom exact, sa source, son type, son domaine, son état d’extraction et sa provenance.
  
  Distinguer explicitement :
  - les ressources génériques réutilisables ;
  - les ressources propres à un secteur ;
  - les exemples de projets clients ;
  - les documents contenant des données opérationnelles ou confidentielles ;
  - les doublons possibles ;
  - les ressources annoncées mais non localisées.
  
  Ne pas importer les secrets, identifiants, données personnelles ou données clients réelles dans les exemples publics. Ne pas supprimer, renommer ou modifier les originaux. Ne pas transformer le catalogue des 500 secteurs en liste inventée si le fichier source reste introuvable.

- [ ] **Step 4: Vérifier l’inventaire**
  
  Run: `npm test -- src/lib/knowledge/inventory.test.ts`
  
  Expected: tous les contrôles du manifeste passent ; chaque ressource découverte a une provenance ; chaque source manquante est explicitement signalée.

- [ ] **Step 5: Vérifier l’intégration**
  
  Run: `npm run typecheck`
  
  Expected: aucune erreur TypeScript introduite.

- [ ] **Step 6: Commit du livrable**
  
  ```bash
  git add knowledge/README.md knowledge/inventory.md knowledge/manifest.json knowledge/sources/README.md src/lib/knowledge/inventory.test.ts
  git commit -m "docs: inventory existing MerKora knowledge resources"
  ```

---

### Task 2: Créer le modèle typé et le catalogue local versionné

**Files:**
- Create: `src/lib/knowledge/types.ts`
- Create: `src/lib/knowledge/catalog.ts`
- Create: `src/lib/knowledge/catalog.test.ts`
- Modify: `knowledge/manifest.json`
- Modify: `knowledge/README.md`

**Interfaces:**
- Consumes: manifeste JSON validé de la Task 1.
- Produces: `KnowledgeResource`, `KnowledgeResourceKind`, `KnowledgeReviewStatus`, `loadKnowledgeCatalog()`, `getKnowledgeResource(id)`.

- [ ] **Step 1: Ajouter les tests de contrat**
  
  Tester :
  1. chargement d’un manifeste valide ;
  2. rejet d’un identifiant vide, d’un type inconnu, d’une version non positive ou d’un statut non reconnu ;
  3. conservation des tableaux de secteurs et de tags sans les réduire à une seule valeur ;
  4. absence de mutation du manifeste source pendant le chargement ;
  5. recherche d’un identifiant existant et résultat explicite `undefined` pour un identifiant absent ;
  6. maintien des ressources `needs_review` et `needs_extraction` dans le catalogue, mais exclusion de leur contenu des ressources approuvées.

- [ ] **Step 2: Vérifier l’échec initial**
  
  Run: `npm test -- src/lib/knowledge/catalog.test.ts`
  
  Expected: échec initial sur les exports du catalogue non encore créés.

- [ ] **Step 3: Implémenter le catalogue minimal**
  
  Définir les types dans `src/lib/knowledge/types.ts`. Implémenter dans `catalog.ts` un chargement déterministe du manifeste local, avec validation de structure et fonctions de lecture en lecture seule. Ne pas ajouter de base de données, de vector store ou de dépendance externe dans ce sous-projet.
  
  Les entrées incomplètes restent visibles à des fins d’administration avec leur statut et leurs notes, mais ne sont pas proposées comme connaissances validées à l’analyse client.

- [ ] **Step 4: Vérifier le comportement**
  
  Run: `npm test -- src/lib/knowledge/catalog.test.ts`
  
  Expected: tous les cas valides et invalides passent ; le manifeste est chargé sans altération.

- [ ] **Step 5: Vérifier l’intégration**
  
  Run: `npm run typecheck`
  
  Expected: aucun conflit de types avec le code existant.

- [ ] **Step 6: Commit du livrable**
  
  ```bash
  git add src/lib/knowledge/types.ts src/lib/knowledge/catalog.ts src/lib/knowledge/catalog.test.ts knowledge/manifest.json knowledge/README.md
  git commit -m "feat: add versioned knowledge catalog"
  ```

---

### Task 3: Extraire les ressources textuelles avec provenance et empreinte

**Files:**
- Create: `scripts/knowledge/import-text.ts`
- Create: `scripts/knowledge/import-text.test.ts`
- Create: `knowledge/sources/README.md`
- Create: `knowledge/content/` (fichiers Markdown/JSON/TXT extraits et revus)
- Modify: `knowledge/manifest.json`
- Modify: `package.json` uniquement pour ajouter le script d’import si nécessaire.

**Interfaces:**
- Consumes: fichiers sources explicitement sélectionnés, types du catalogue et métadonnées de la Task 1.
- Produces: contenus extraits versionnés, empreinte SHA-256, référence de provenance et statut d’extraction.

- [ ] **Step 1: Ajouter les tests d’import**
  
  Tester :
  1. import d’un Markdown, d’un JSON et d’un TXT UTF-8 ;
  2. conservation du texte et des caractères français ;
  3. calcul stable de l’empreinte SHA-256 ;
  4. import répété d’un même contenu sans créer un doublon silencieux ;
  5. même nom de fichier avec contenu différent : créer une nouvelle version ou signaler un conflit, jamais écraser automatiquement ;
  6. fichier illisible ou format non pris en charge : statut `needs_extraction`, motif explicite, aucun contenu inventé ;
  7. contenu vide : conserver la provenance et signaler l’absence de contenu exploitable.

- [ ] **Step 2: Vérifier l’échec initial**
  
  Run: `npm test -- scripts/knowledge/import-text.test.ts`
  
  Expected: échec initial car le script d’import n’existe pas.

- [ ] **Step 3: Implémenter l’import non destructif**
  
  Ajouter un importeur Node limité aux formats textuels UTF-8 initiaux. L’importeur lit les sources sans les modifier, calcule leur empreinte, écrit une copie normalisée dans `knowledge/content/` et met à jour le manifeste de façon déterministe. Les collisions sont signalées ; aucun fichier déjà importé n’est remplacé sans changement de version explicite.
  
  Les PDF, DOCX, XLSX, images, archives et autres formats binaires restent référencés dans l’inventaire avec leur type et leur état d’extraction tant qu’un extracteur approprié n’a pas été validé. Les fichiers sources originaux ne sont pas exécutés et les scripts importés restent inactifs.

- [ ] **Step 4: Vérifier l’import**
  
  Run: `npm test -- scripts/knowledge/import-text.test.ts`
  
  Expected: les trois formats textuels sont importés avec une empreinte reproductible ; les formats non pris en charge restent intacts et signalés.

- [ ] **Step 5: Vérifier l’intégration**
  
  Run: `npm test` puis `npm run typecheck`
  
  Expected: tous les tests du dépôt et le contrôle TypeScript passent.

- [ ] **Step 6: Commit du livrable**
  
  ```bash
  git add scripts/knowledge knowledge package.json
  git commit -m "feat: import versioned text knowledge sources"
  ```

---

### Task 4: Rendre les ressources approuvées retrouvables par contexte

**Files:**
- Create: `src/lib/knowledge/search.ts`
- Create: `src/lib/knowledge/search.test.ts`
- Modify: `src/lib/knowledge/README.md` si nécessaire.
- Modify: `src/lib/knowledge/catalog.ts` uniquement pour exposer les fonctions nécessaires.

**Interfaces:**
- Consumes: `loadKnowledgeCatalog()`, `KnowledgeResource`, contenus extraits et approuvés.
- Produces: `searchKnowledge({ query, sectors, kinds, limit })` retournant des ressources avec identifiant, titre, extrait, secteurs, version, statut et provenance.

- [ ] **Step 1: Ajouter les tests de recherche**
  
  Tester :
  1. recherche par expression exacte et par mots-clés ;
  2. filtrage par un ou plusieurs secteurs ;
  3. filtrage par type de ressource ;
  4. exclusion par défaut des ressources rejetées, non revues ou non extraites ;
  5. inclusion facultative des ressources non approuvées uniquement dans un mode d’audit explicite ;
  6. limite de résultats respectée ;
  7. résultats identiques pour les mêmes données et la même requête ;
  8. chaque résultat contient une provenance consultable et la version utilisée ;
  9. un secteur inconnu n’entraîne pas le rejet d’une requête multi-sectorielle.

- [ ] **Step 2: Vérifier l’échec initial**
  
  Run: `npm test -- src/lib/knowledge/search.test.ts`
  
  Expected: échec initial car la fonction de recherche n’existe pas.

- [ ] **Step 3: Implémenter la recherche locale**
  
  Commencer par une recherche lexicale et des filtres structurés, sans prétendre à une recherche sémantique ou vectorielle. La fonction retourne les ressources approuvées et leurs références de source ; elle ne transforme jamais le contenu récupéré en instructions de confiance. La pertinence doit être déterministe et testable.
  
  Le futur cerveau central pourra appeler cette interface avant de construire un contexte IA. L’intégration au prompt, le routage fournisseur, les embeddings et le stockage distant appartiennent au sous-projet « cerveau central et orchestration IA », pas à cette livraison.

- [ ] **Step 4: Vérifier la recherche**
  
  Run: `npm test -- src/lib/knowledge/search.test.ts`
  
  Expected: tous les filtres, exclusions et critères de provenance passent.

- [ ] **Step 5: Vérifier la suite**
  
  Run: `npm test`, `npm run typecheck`, `npm run build`
  
  Expected: tous les tests, le typage et le build local passent sans activer de fournisseur IA.

- [ ] **Step 6: Commit du livrable**
  
  ```bash
  git add src/lib/knowledge
  git commit -m "feat: search approved knowledge resources"
  ```

## Critères d’acceptation du sous-projet

- Les ressources historiques retrouvées sont listées avec leur provenance exacte.
- Les sources originales ne sont ni supprimées ni altérées.
- Les ressources non retrouvées, non lisibles ou non vérifiées sont signalées clairement.
- Aucun secteur, prompt, code ou contenu manquant n’est inventé.
- Le catalogue accepte plusieurs secteurs par ressource et reste extensible.
- Les ressources d’exemples clients sont distinguées des règles universelles.
- Les contenus non approuvés ne sont pas utilisés par défaut dans la recherche client.
- Les résultats de recherche retournent toujours leur provenance et leur version.
- Aucune table, politique RLS ou donnée Supabase n’est modifiée.
- Aucun appel IA payant ni déploiement n’est effectué.

## Décisions encore ouvertes

1. **Emplacement canonique des originaux volumineux (PDF, DOCX, XLSX, images, archives) :** recommandation — conserver les fichiers binaires dans un stockage de fichiers dédié et versionner dans Git les ressources textuelles sélectionnées, le manifeste et les empreintes. Le choix du stockage distant devra être fait après comparaison des coûts et des permissions ; il ne bloque pas les trois premiers livrables locaux.
2. **Catalogue des 500 secteurs :** le fichier source n’a pas encore été localisé dans les résultats initiaux. L’inventaire doit le rechercher dans les ressources historiques accessibles ; si aucune copie n’est trouvée, le catalogue reste marqué comme source attendue manquante, sans reconstruction artificielle.
3. **Formats Office/PDF :** choisir les extracteurs adaptés seulement après avoir recensé les fichiers réellement présents, afin d’éviter d’ajouter des dépendances inutiles.

## Passage à l’exécution

Ce plan ne modifie pas encore le code. Après validation du plan, exécuter les tâches dans l’ordre, avec revue après chaque livrable. Le premier résultat attendu est un inventaire fidèle des ressources accessibles et des sources manquantes, avant toute intégration au cerveau IA.
