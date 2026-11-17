# Écran 05 — Définition adaptative du produit : plan d'implémentation

> **For agentic workers:** Use the host's available task-by-task implementation workflow. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Construire l'écran 05 comme une définition progressive et universelle du produit, alimentée par le dossier des écrans 01 à 04 et par les connaissances métier du référentiel MerKora.

**Architecture:** Un moteur déterministe de sélection choisit une seule question utile à la fois parmi les 12 familles de définition. Il combine les éléments confirmés du dossier, les propositions du référentiel universel (20 familles/domaines), les réponses déjà enregistrées et des signaux de pertinence métier. Les suggestions restent des propositions à valider ; les réponses et brouillons sont conservés dans sessionStorage, sans nouvelle table ni migration Supabase.

**Tech Stack:** Next.js App Router, React, TypeScript, Vitest, sessionStorage, référentiel métier existant dans `src/lib/merkora-core/knowledge`.

## Global Constraints

- Le parcours est universel : aucun secteur, métier, sous-domaine ou exemple (dont le Baby-foot) ne devient le modèle par défaut.
- Le moteur doit exploiter les activités, problèmes, causes, objectifs, acteurs, opérations, ressources, contraintes, indicateurs et informations déjà communiqués.
- Ne jamais redemander un élément déjà présent dans le dossier ou une réponse précédente.
- Les 12 familles sont une bibliothèque de décisions conditionnelles, pas 12 formulaires ni 12 étapes obligatoires.
- Une question visible à la fois ; enregistrer en arrière-plan ; permettre de modifier, différer et reprendre.
- Distinguer faits déclarés/validés, suggestions du référentiel, inconnues et non-applicabilité.
- Ne pas inventer une classification lorsque le référentiel est ambigu ; demander une clarification ciblée.
- Ne modifier ni supprimer aucune donnée ou structure Supabase.
- Conserver l'expérience responsive mobile/ordinateur et le vocabulaire non technique.

---

### Task 1: Moteur métier de définition adaptative

**Files:**
- Create: `src/lib/merkora-core/product-definition.ts`
- Test: `src/lib/merkora-core/product-definition.test.ts`

**Interfaces:**
- Consumes: `ProjectUnderstanding`, `ProjectKnowledgeMap`, les éléments de preuve actifs et les 12 familles convenues.
- Produces: `ProductDefinitionSession`, `ProductDefinitionQuestion`, `createProductDefinitionSession`, `getNextProductDefinitionQuestion`, `recordProductDefinitionAnswer`, `reviseProductDefinitionAnswer`, `deferProductDefinitionQuestion`, `resumeDeferredProductDefinitionQuestions`, `getActiveProductDefinitionAnswers`.

- [x] **Step 1: Add the focused failing test**

Tester un projet de tournoi déjà décrit (activité, nombre de participants, processus) : le moteur ne doit pas redemander ces informations et doit proposer une question sur une dimension de produit encore pertinente. Tester également un projet agricole et un projet éducatif : les questions proposées doivent être ancrées dans leurs activités et ne jamais imposer des questions sportives ou commerciales. Tester qu'une famille non pertinente ne génère aucune question, qu'une question différée peut être reprise et qu'une réponse révisée conserve sa version antérieure.

- [x] **Step 2: Verify the relevant failure**

Run: `npm test -- src/lib/merkora-core/product-definition.test.ts`
Expected: échec initial car le module et ses fonctions n'existent pas.

- [x] **Step 3: Implement the minimum behavior**

Créer les 12 familles comme métadonnées de décision. Sélectionner les questions avec règles explicites de pertinence, détection des éléments déjà connus et consultation du `knowledgeMap`. Les familles « navigation » et « espaces » ne sont candidates que lorsqu'un produit avec interface ou plusieurs lieux est établi ; « finances » seulement si le contexte financier est pertinent ; « identité visuelle » seulement pour une expérience qui en a besoin ; « sécurité » selon les personnes, accès, données, paiements ou obligations. Les familles transversales restent conditionnelles et le moteur peut terminer sans forcer les 12.

- [x] **Step 4: Verify the focused pass**

Run: `npm test -- src/lib/merkora-core/product-definition.test.ts`
Expected: les cas universels et les cas sectoriels passent.

- [x] **Step 5: Run the affected integration check**

Run: `npm run typecheck`
Expected: aucune erreur TypeScript.

- [x] **Step 6: Commit the passing deliverable**

```bash
git add src/lib/merkora-core/product-definition.ts src/lib/merkora-core/product-definition.test.ts
git commit -m "feat: add universal adaptive product definition engine"
```

### Task 2: Écran 05, parcours une question à la fois

**Files:**
- Create: `app/product-definition/page.tsx`
- Modify: `app/globals.css`
- Test: `app/stage-pages.test.tsx`

**Interfaces:**
- Consumes: les fonctions et types exportés par `product-definition.ts`, le dossier `merkora-v2-project-understanding` de l'écran 03/04.
- Produces: route `/product-definition`, session persistée sous une clé dédiée, progression et historique de réponses.

- [x] **Step 1: Add the focused failing test**

Tester le rendu statique de l'écran 05 : titre de définition du produit, une seule question active, rappel que les réponses déjà connues sont réutilisées, options « Je ne sais pas encore », « Non applicable » et « Passer pour le moment », historique et lien de retour.

- [x] **Step 2: Verify the relevant failure**

Run: `npm test -- app/stage-pages.test.tsx`
Expected: échec car la page 05 n'est pas encore exportée et rendue.

- [x] **Step 3: Implement the minimum behavior**

Construire une page responsive avec une carte de question, une progression, une mémoire des réponses et une seule question active. Restaurer dossier, session et brouillon après rechargement. Ne pas écrire dans Supabase. Une réponse ne devient pas une vérité métier sans validation explicite.

- [x] **Step 4: Verify the focused pass**

Run: `npm test -- app/stage-pages.test.tsx`
Expected: les trois écrans testés rendent leurs éléments attendus.

- [x] **Step 5: Run the affected integration check**

Run: `npm run typecheck`
Expected: aucune erreur TypeScript.

- [x] **Step 6: Commit the passing deliverable**

```bash
git add app/product-definition/page.tsx app/globals.css app/stage-pages.test.tsx
git commit -m "feat: add adaptive product definition screen"
```

### Task 3: Relier les écrans et vérifier le parcours

**Files:**
- Modify: `app/diagnostic/page.tsx`
- Modify: `docs/architecture/merkora-screens-03-04-v1.md` si nécessaire pour le raccordement de l'étape suivante.

**Interfaces:**
- Consumes: route `/product-definition` et statut `ready_for_review` du diagnostic.
- Produces: un accès explicite de l'écran 04 vers l'écran 05, sans contourner le dossier ni effacer la session.

- [x] **Step 1: Add the focused failing test**

Vérifier que l'écran 04 terminé propose « Définir le produit » et que l'accès conserve le dossier du projet.

- [x] **Step 2: Verify the relevant failure**

Run: `npm test -- app/stage-pages.test.tsx`
Expected: l'assertion du lien échoue avant le raccordement.

- [x] **Step 3: Implement the minimum behavior**

Ajouter le lien vers `/product-definition` dans l'état de fin de l'écran 04. L'écran 05 redirige vers l'écran 03 si le dossier n'existe pas ; il ne crée pas de dossier fictif.

- [x] **Step 4: Verify the focused pass**

Run: `npm test -- app/stage-pages.test.tsx`
Expected: l'accès depuis l'écran 04 est rendu.

- [x] **Step 5: Run the affected integration check**

Run: `npm test` puis `npm run typecheck` puis `npm run build`.
Expected: suite complète, vérification TypeScript et build de production réussis.

- [x] **Step 6: Commit the passing deliverable**

```bash
git add app/diagnostic/page.tsx app/stage-pages.test.tsx docs/architecture/merkora-screens-03-04-v1.md
git commit -m "feat: connect diagnostic to product definition"
```

## Décisions externes non tranchées

- Le stockage reste local au navigateur pour cette première livraison, dans la continuité des écrans 03/04 ; une synchronisation multi-appareil nécessitera une décision et un schéma séparés.
- L'écran 06 « Proposition et composition de solution » n'est pas créé dans ce lot ; l'écran 05 doit d'abord produire une définition relisible et modifiable.


## Vérifications exécutées

- GitHub Actions `Quality checks` : succès sur le code de l'écran 05.
- TypeScript : succès.
- Vitest : 54 fichiers de tests, 329 tests réussis.
- Build de production Next.js : succès.
- Déploiement de prévisualisation Vercel : `READY` sur le commit applicatif testé.
- Vérification interactive dans un navigateur : non réalisée, car le contexte navigateur connecté n'était pas disponible et les aperçus sont protégés par SSO.
- Supabase : aucune migration, écriture ou suppression effectuée.
