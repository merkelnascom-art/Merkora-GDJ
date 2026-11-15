# MerKora GDJ — Fondation A : référentiel universel des connaissances — Implementation Plan

> **For agentic workers:** Use the host's available task-by-task implementation workflow. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Intégrer au cœur MerKora un référentiel de connaissances universel, extensible, multilingue et traçable, relié au graphe de situation existant et capable de conserver les concepts inconnus comme propositions propres au projet.

**Architecture:** La Fondation A sera un module TypeScript pur sous `src/lib/merkora-core/knowledge/`, sans dépendance externe ni écriture Supabase. Un registre versionnable contiendra les concepts fondamentaux partagés, les définitions, les termes multilingues et les relations typées. Un moteur de correspondance lexicale prudente reliera les observations existantes aux concepts uniquement lorsque la correspondance est suffisamment établie ; les concepts non reconnus resteront ouverts et pourront être proposés dans le périmètre privé d'un projet. Le graphe de situation et l'écran 03 exposeront ces liens sans transformer une correspondance en vérité métier.

**Tech Stack:** TypeScript strict, Next.js 16, Vitest 3, structures immuables en mémoire pour cette première intégration, PostgreSQL-compatible data contracts documentés pour une future persistance additive.

## Global Constraints

- Ne limiter aucun domaine, métier, profession, activité, projet ou type de solution.
- Les identifiants de concepts sont indépendants de la langue ; les termes et définitions sont multilingues et contextualisables.
- Les taxonomies sont multiples et ouvertes ; aucune arborescence unique n'est obligatoire.
- Les relations sont typées, orientées, traçables et peuvent être étendues.
- Toute connaissance conserve sa provenance, son statut de validation, sa version et sa fiabilité.
- Une correspondance lexicale ne constitue pas une preuve de compréhension sémantique.
- Un concept inconnu est conservé dans le contexte du projet ; il n'est jamais publié automatiquement dans le référentiel partagé.
- Seule une validation explicite peut promouvoir une proposition de projet vers le registre partagé.
- Préserver la compatibilité avec les sessions existantes stockées dans sessionStorage.
- Ne pas supprimer ni réinitialiser les données ou tables existantes.
- Aucune migration ou écriture Supabase dans cette tranche.
- Aucun fournisseur IA externe, aucune API payante et aucune dépense.
- Aucun merge ni déploiement en production sans autorisation explicite.
- La Fondation B reste hors périmètre jusqu'à validation de la Fondation A.

---

### Task 1: Modèle universel, normalisation et registre de base

**Files:**
- Create: `src/lib/merkora-core/knowledge/types.ts`
- Create: `src/lib/merkora-core/knowledge/normalization.ts`
- Create: `src/lib/merkora-core/knowledge/core-catalog.ts`
- Create: `src/lib/merkora-core/knowledge/registry.ts`
- Test: `src/lib/merkora-core/knowledge/registry.test.ts`

**Interfaces:**
- Consumes: aucune dépendance métier ; uniquement des valeurs TypeScript.
- Produces: `KnowledgeConcept`, `KnowledgeTerm`, `KnowledgeDefinition`, `KnowledgeRelationship`, `KnowledgeSource`, `KnowledgeReliability`, `KnowledgeRegistry`, `createKnowledgeRegistry`, `createCoreKnowledgeRegistry`, `normalizeKnowledgeTerm`.

- [ ] **Step 1: Add the focused failing test**

Tester la normalisation Unicode (accents, casse, espaces, apostrophes typographiques), la récupération par identifiant stable, les concepts avec plusieurs définitions/langues et le refus de deux concepts partageant le même identifiant ou canonicalKey.

- [ ] **Step 2: Verify the relevant failure**

Run: `npm test -- src/lib/merkora-core/knowledge/registry.test.ts`

Expected: échec d'import ou assertions indiquant que le registre et ses interfaces n'existent pas encore.

- [ ] **Step 3: Implement the minimum behavior**

Créer un registre immuable à l'échelle d'une instance. Les types de concept et les prédicats de relation restent des chaînes extensibles ; les états de validation et de fiabilité sont explicitement typés. Ajouter un noyau de concepts abstraits universels (acteur, activité, processus, opération, événement, objet, ressource, objectif, problème, résultat, contrainte, lieu, temps, information, règle, solution, service, produit, projet), sans présenter ce noyau comme un catalogue exhaustif de métiers ou de secteurs. Fournir définitions françaises et anglaises pour les concepts de base.

- [ ] **Step 4: Verify the focused pass**

Run: `npm test -- src/lib/merkora-core/knowledge/registry.test.ts`

Expected: tous les tests du registre passent ; les concepts restent extensibles et les clés canoniques sont uniques.

- [ ] **Step 5: Run the affected integration check**

Run: `npm run typecheck`

Expected: TypeScript strict valide les nouveaux contrats sans modifier les types existants.

- [ ] **Step 6: Commit the passing deliverable**

`feat: add universal knowledge registry foundation`

### Task 2: Correspondance contrôlée, relations et propositions de concepts inconnus

**Files:**
- Create: `src/lib/merkora-core/knowledge/matching.ts`
- Create: `src/lib/merkora-core/knowledge/proposals.ts`
- Create: `src/lib/merkora-core/knowledge/matching.test.ts`
- Create: `src/lib/merkora-core/knowledge/proposals.test.ts`

**Interfaces:**
- Consumes: `KnowledgeRegistry`, `KnowledgeConcept`, `KnowledgeRelationship`, `KnowledgeSource` de Task 1.
- Produces: `matchKnowledgeConcept`, `KnowledgeMatchResult`, `createProjectKnowledgeProposal`, `approveKnowledgeProposal`, `rejectKnowledgeProposal`.

- [ ] **Step 1: Add the focused failing tests**

Vérifier une correspondance exacte, une correspondance après normalisation, un synonyme multilingue, une ambiguïté entre deux concepts, l'absence de correspondance, le filtrage par type lorsque demandé et l'absence de correspondance forcée. Vérifier qu'une proposition inconnue reste limitée à son projectId, qu'elle conserve la citation et le message source, qu'elle ne modifie pas le registre partagé, puis qu'une approbation explicite crée un concept versionné et qu'un rejet ne le publie pas.

- [ ] **Step 2: Verify the relevant failure**

Run: `npm test -- src/lib/merkora-core/knowledge/matching.test.ts src/lib/merkora-core/knowledge/proposals.test.ts`

Expected: échec car les fonctions de correspondance et de proposition ne sont pas encore présentes.

- [ ] **Step 3: Implement the minimum behavior**

La recherche initiale est volontairement lexicale et déterministe : correspondance exacte, terme normalisé, synonyme, compatibilité de type et ambiguïté. Elle ne doit pas prétendre fournir une proximité sémantique par embeddings. Si plusieurs concepts ont le même meilleur résultat, retourner un résultat ambigu sans choisir arbitrairement. Créer les propositions dans un espace projet séparé ; la promotion vers le registre partagé exige une action explicite et un enregistrement de revue.

- [ ] **Step 4: Verify the focused pass**

Run: `npm test -- src/lib/merkora-core/knowledge/matching.test.ts src/lib/merkora-core/knowledge/proposals.test.ts`

Expected: tous les cas passent ; aucune proposition n'est publiée implicitement.

- [ ] **Step 5: Run the affected integration check**

Run: `npm run typecheck`

Expected: contrats et résultats discriminés correctement typés.

- [ ] **Step 6: Commit the passing deliverable**

`feat: add cautious knowledge matching and project proposals`

### Task 3: Raccordement au graphe de situation et à l'écran 03

**Files:**
- Modify: `src/lib/merkora-core/situation-graph.ts`
- Create: `src/lib/merkora-core/knowledge/situation-linker.ts`
- Modify: `src/lib/merkora-core/situation-intake-engine.ts`
- Modify: `src/lib/merkora-core/project-diagnostic.ts`
- Modify: `app/understanding/page.tsx`
- Modify: `app/globals.css`
- Test: `src/lib/merkora-core/knowledge/situation-linker.test.ts`
- Test: `src/lib/merkora-core/situation-intake-engine.test.ts`

**Interfaces:**
- Consumes: `SituationGraph`, `SituationEntity`, `KnowledgeRegistry`, `matchKnowledgeConcept`.
- Produces: liens de type universel sur les entités du graphe et `enrichSituationGraphWithKnowledge`.

- [ ] **Step 1: Add the focused failing test**

Vérifier que les entités du graphe reçoivent un concept de type universel correspondant à leur kind, qu'une correspondance exacte/synonyme non ambiguë reçoit un concept canonique, qu'une entité inconnue reste intacte sans concept inventé, et que les graphes historiques sans métadonnées knowledge restent lisibles et enrichissables.

- [ ] **Step 2: Verify the relevant failure**

Run: `npm test -- src/lib/merkora-core/knowledge/situation-linker.test.ts src/lib/merkora-core/situation-intake-engine.test.ts`

Expected: échec car le linker et les champs de liaison knowledge n'existent pas encore.

- [ ] **Step 3: Implement the minimum behavior**

Ajouter des métadonnées knowledge optionnelles à `SituationEntity`, sans changer l'identité des nœuds ni leurs preuves. Enrichir le graphe dans `rebuildSituationGraph` et lors de la reconstruction d'un dossier écran 03 ancien. L'interface affichera les types universels associés, les correspondances canoniques confirmées par le matcher et le nombre d'éléments qui restent sans correspondance. Ne pas créer automatiquement de propositions partagées depuis les observations.

- [ ] **Step 4: Verify the focused pass**

Run: `npm test -- src/lib/merkora-core/knowledge/situation-linker.test.ts src/lib/merkora-core/situation-intake-engine.test.ts`

Expected: les nouveaux tests et les tests existants du graphe/intake passent ; les citations et relations existantes restent inchangées.

- [ ] **Step 5: Run the affected integration check**

Run: `npm run typecheck && npm test`

Expected: TypeScript valide et aucune régression sur le parcours conversation → compréhension → diagnostic.

- [ ] **Step 6: Commit the passing deliverable**

`feat: connect universal knowledge to situation understanding`

### Task 4: Documentation, compatibilité et vérification complète

**Files:**
- Create: `docs/architecture/merkora-universal-knowledge-foundation-a.md`
- Create: `docs/plans/2026-11-15-merkora-foundation-a.md`
- Modify: `docs/architecture/merkora-screens-03-04-v1.md`

**Interfaces:**
- Consumes: implémentation et tests des Tasks 1 à 3.
- Produces: documentation de l'architecture, limites réelles, contrat de compatibilité et critères de validation de la Fondation A.

- [ ] **Step 1: Document the implemented contract**

Documenter le modèle, les statuts, les identifiants, les relations, la recherche lexicale, les propositions privées, le raccordement au graphe, la compatibilité des sessions historiques et les limites de la première version.

- [ ] **Step 2: Verify the full repository**

Run: `npm run typecheck && npm test && npm run build`

Expected: TypeScript réussi, tous les tests Vitest réussis et build Next.js de production réussi.

- [ ] **Step 3: Review the diff and boundaries**

Confirmer qu'aucun fichier de migration Supabase, aucune clé API, aucun service payant, aucune configuration de production et aucune donnée existante n'ont été modifiés.

- [ ] **Step 4: Commit the verified documentation**

`docs: specify universal knowledge foundation A`

## Unresolved external decisions

- Le stockage partagé permanent du référentiel (Supabase/PostgreSQL ou autre) est reporté à une tranche dédiée après validation du modèle ; aucune table ne sera créée dans cette livraison.
- Les validations de propositions partagées seront initialement explicites et pilotées par le code/appelant ; le futur rôle administrateur et le workflow de revue seront spécifiés séparément.
- La recherche sémantique multilingue avancée, les embeddings et l'intégration d'un modèle linguistique appartiennent à la Fondation B ou à une décision ultérieure ; la Fondation A ne simulera pas ces capacités.
