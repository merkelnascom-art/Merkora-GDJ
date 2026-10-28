# MerKora GDJ — intégration IA, amélioration et concurrence — Plan d’implémentation

> **For agentic workers:** Use the host's available task-by-task implementation workflow. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Préparer une analyse IA structurée et contrôlée par l’utilisateur qui couvre le diagnostic, les pistes de solution, les améliorations du projet et l’analyse concurrentielle sans déclencher de dépense ni prétendre effectuer des recherches externes non réalisées.

**Architecture:** Conserver les routes Next.js et l’interface existantes. Extraire la communication au modèle derrière un contrat de fournisseur côté serveur, garder le drapeau de désactivation comme verrou absolu, puis étendre le résultat JSON et le panneau de proposition pour afficher des pistes modifiables, un plan d’amélioration et une comparaison concurrentielle fondée sur des informations explicitement fournies ou vérifiées. Aucun fournisseur ni appel réseau ne sera activé automatiquement.

**Tech Stack:** Next.js App Router, React, TypeScript, Vitest, API compatible Chat Completions de Vercel AI Gateway déjà présente dans le code, Supabase existant uniquement pour l’authentification et les dossiers.

## Global Constraints

- Travailler uniquement sur `feature/merkora-rebuild-foundation` et le déploiement d’aperçu.
- Ne pas fusionner dans `main`, ne pas promouvoir en production et ne pas modifier la configuration de production sans autorisation explicite.
- Ne créer aucune clé, aucun abonnement et aucun appel potentiellement facturable. `MERKORA_AI_ENABLED` reste désactivé; aucune requête au fournisseur ne doit être envoyée pendant les tests.
- Ne pas toucher à WALL Trade; ne supprimer, réinitialiser ni migrer aucune donnée Supabase pour cette phase.
- Les clés fournisseur restent côté serveur. Aucune clé, aucun jeton, aucune donnée d’authentification ne doit apparaître dans la réponse API, les logs ou le navigateur.
- Les propositions sont des conseils non contractuels. Les prix, délais, capacités des concurrents et faits externes ne doivent jamais être inventés.
- Les recommandations et améliorations doivent être relues/modifiées/retirées avant application au dossier. Un devis officiel reste soumis à validation humaine.
- Si l’utilisateur n’a fourni aucun concurrent ni source, le système peut proposer une grille de recherche et des critères de comparaison, mais doit dire que la concurrence n’a pas été vérifiée en direct.
- Aucun paquet payant ou nouvelle dépendance externe n’est nécessaire ou autorisé pour cette phase.

---

### Task 1: Séparer le fournisseur IA et verrouiller les appels à coût nul par défaut

**Files:**
- Create: `src/lib/server/ai-provider.ts`
- Modify: `app/api/ai/analyze/route.ts`
- Modify: `app/api/ai/status/route.ts`
- Test: `src/lib/server/ai-provider.test.ts`
- Test: `app/api/ai/analyze/route.test.ts` (proposed; follow the repository’s existing Vitest conventions)

**Interfaces:**
- `runStructuredAnalysis(input, options): Promise<unknown>` is a server-only boundary that receives a validated prompt and model configuration and returns decoded provider output or a typed error.
- The route remains responsible for same-origin validation, request limits, validating the user’s need, validating the model output and translating failures to safe French messages.
- Provider configuration remains server-side: `MERKORA_AI_ENABLED`, `MERKORA_AI_MODEL`, and `AI_GATEWAY_API_KEY` / the existing Vercel OIDC option. The feature flag must be checked before provider authentication or fetch.

- [ ] **Step 1: Add focused failing tests**
  - With `MERKORA_AI_ENABLED` absent or not exactly `true`, POST returns 503 and the mocked global fetch is never called.
  - With an invalid Origin, POST returns 403 and fetch is never called.
  - Malformed JSON returns 400; missing title/problem/outcome returns 400.
  - Provider 401/403, 402, 429, timeout, invalid JSON and malformed structured content return safe errors with no token or raw provider payload.
  - GET status reports disabled and returns no model identifier when the feature flag is off.

- [ ] **Step 2: Verify relevant failures**
  Run: `npm test -- --run src/lib/server/ai-provider.test.ts app/api/ai/analyze/route.test.ts`
  Expected: tests fail because the extracted provider boundary and coverage are not yet present.

- [ ] **Step 3: Implement the minimum behavior**
  - Extract the current Gateway fetch from the route into a server-only provider module; do not change endpoint or add a new provider dependency.
  - Preserve timeouts and the existing safe handling of authentication, budget exhaustion and rate limits.
  - Ensure the disabled feature flag short-circuits before any fetch, regardless of whether a secret exists.
  - Validate provider output at the route boundary; do not trust model-generated JSON types.
  - Do not log prompts, client dossiers, tokens or full provider responses.

- [ ] **Step 4: Verify focused tests**
  Run: `npm test -- --run src/lib/server/ai-provider.test.ts app/api/ai/analyze/route.test.ts`
  Expected: all focused tests pass and the mocked fetch call count stays at zero for every disabled/error-before-provider case.

- [ ] **Step 5: Run integration checks**
  Run: `npm run typecheck && npm test`
  Expected: typecheck and all unit tests pass.

- [ ] **Step 6: Commit the passing deliverable**
  `git add src/lib/server/ai-provider.ts src/lib/server/ai-provider.test.ts app/api/ai/analyze/route.ts app/api/ai/analyze/route.test.ts app/api/ai/status/route.ts`
  `git commit -m "refactor(ai): isolate provider and preserve zero-cost default"`

### Task 2: Ajouter des améliorations priorisées au diagnostic

**Files:**
- Modify: `app/api/ai/analyze/route.ts`
- Modify: `src/components/ai/ai-proposal-panel.tsx`
- Modify: `src/lib/solution-recommendations.ts` only if a shared type is justified by the implementation
- Test: `app/api/ai/analyze/route.test.ts`
- Test: `src/lib/solution-recommendations.test.ts` when shared types or local fallback behavior change

**Interfaces:**
- Extend the structured `Analysis` with `improvements: Improvement[]`, where each item has `title`, `description`, `expectedBenefit`, `effort` (`low | medium | high | unknown`), `priority` (`high | medium | low`) and `assumptions: string[]`.
- The server parser must bound list sizes and field lengths, reject unknown enum values to `unknown` / `medium` / `low` safe defaults, and never accept arbitrary HTML.
- The panel must render improvements separately from solution recommendations and must not apply improvements automatically to a dossier.

- [ ] **Step 1: Add focused failing tests**
  - A valid analysis with 0–5 improvements parses successfully.
  - Missing or malformed improvements becomes an empty list without invalidating otherwise valid recommendations.
  - Excessive items and overlong fields are truncated to the documented limits.
  - Effort and priority are restricted to the declared values.
  - The panel displays improvement suggestions as proposals and does not mutate the project until the user chooses an explicit apply action.

- [ ] **Step 2: Verify relevant failures**
  Run: `npm test -- --run app/api/ai/analyze/route.test.ts`
  Expected: new assertions fail until the output parser and UI support improvements.

- [ ] **Step 3: Implement the minimum behavior**
  - Ask the model for improvements grounded in the dossier, ordered by benefit/effort and with assumptions clearly stated.
  - Distinguish improvements to process, organization, existing tools, automation and custom software; recommend custom software only when justified.
  - Add a dedicated improvement section with priority, expected benefit, estimated effort and editable text.
  - Do not create exact costs, timelines or ROI figures from absent evidence. Mark effort as unknown when information is insufficient.
  - Keep current recommendation editing/application behavior intact.

- [ ] **Step 4: Verify focused tests**
  Run: `npm test -- --run app/api/ai/analyze/route.test.ts`
  Expected: output validation and improvement display tests pass.

- [ ] **Step 5: Run integration checks**
  Run: `npm run typecheck && npm test`
  Expected: all tests pass; existing discovery and account flows remain unchanged.

- [ ] **Step 6: Commit the passing deliverable**
  `git add app/api/ai/analyze/route.ts app/api/ai/analyze/route.test.ts src/components/ai/ai-proposal-panel.tsx src/lib/solution-recommendations.ts src/lib/solution-recommendations.test.ts`
  `git commit -m "feat(ai): add prioritized project improvements"`

### Task 3: Ajouter une analyse concurrentielle honnête et exploitable

**Files:**
- Create: `src/lib/competitive-analysis.ts`
- Create: `src/lib/competitive-analysis.test.ts`
- Modify: `app/api/ai/analyze/route.ts`
- Modify: `src/components/ai/ai-proposal-panel.tsx`

**Interfaces:**
- `CompetitorInput` represents only competitor details the user explicitly supplies: name, public URL, observed offer, price as supplied, strengths, weaknesses and source note.
- `CompetitiveAnalysis` returns `researchStatus` (`not_verified | user_supplied | source_supplied`), comparison criteria, comparable entries, opportunities, unknowns and next research steps.
- No paid search API, scraping service or network research call is introduced in this phase. Supplied facts must retain source/provenance notes.

- [ ] **Step 1: Add focused failing tests**
  - No competitor input returns a research checklist and `not_verified`, never invented competitor names or prices.
  - User-supplied competitors are preserved and compared only on provided fields.
  - Missing fields are labelled unknown rather than inferred.
  - Duplicate competitor names/URLs are safely normalized for display without claiming identity verification.
  - Malformed provider output cannot add unsupported external facts to the comparison.

- [ ] **Step 2: Verify relevant failures**
  Run: `npm test -- --run src/lib/competitive-analysis.test.ts`
  Expected: tests fail because the comparison schema and safe no-source behavior are not yet implemented.

- [ ] **Step 3: Implement the minimum behavior**
  - Add a compact competitor-input area to the proposal panel where the user can add names, public URLs, observed offers, prices and notes they have collected.
  - Ask the model to compare supplied facts on target audience, offer, features, user experience, pricing model, support, limitations and differentiation only where evidence exists.
  - For missing evidence, show “À vérifier” and a practical research question; never assert that the model browsed the web.
  - Produce opportunity ideas for MerKora and distinguish observed fact, user-provided claim, inference and hypothesis.
  - Keep competitive research optional; a dossier can be analyzed without competitors.

- [ ] **Step 4: Verify focused tests**
  Run: `npm test -- --run src/lib/competitive-analysis.test.ts`
  Expected: no-source and partial-source cases pass without fabricated facts.

- [ ] **Step 5: Run integration checks**
  Run: `npm run typecheck && npm test`
  Expected: all tests pass; the ordinary needs-analysis flow works with empty competitor input.

- [ ] **Step 6: Commit the passing deliverable**
  `git add src/lib/competitive-analysis.ts src/lib/competitive-analysis.test.ts app/api/ai/analyze/route.ts src/components/ai/ai-proposal-panel.tsx`
  `git commit -m "feat(ai): add evidence-aware competitor analysis"`

### Task 4: Document activation gates and verify the full branch

**Files:**
- Modify: `README.md`
- Modify: `docs/plans/2026-10-28-merkora-cloud-sync-progress.md`
- Modify: `docs/testing/merkora-cloud-sync-checklist.md`
- Create: `docs/testing/merkora-ai-checklist.md`

**Interfaces:**
- Documentation must state that the AI provider is not activated, competitor research is not live web research, and all generated proposals are non-binding until reviewed.
- The test checklist must include no-cost verification, response-schema checks, manual editing, unknown competitor data, account isolation and regression of signup/cloud sync.

- [ ] **Step 1: Add checklist assertions**
  Document manual preview checks for: feature flag off; no provider request in browser/network; status displays disabled; local analysis still works; proposal edits persist only when explicitly applied; competitor status remains not verified without sources; no secret appears in response/browser logs.

- [ ] **Step 2: Verify the checklist against current behavior**
  Run: `npm test`
  Expected: baseline tests pass; manual checklist clearly separates automated from browser-only checks.

- [ ] **Step 3: Update documentation**
  - Explain which functions are local rules and which require a configured provider.
  - Describe the future activation process only as instructions; do not change environment variables.
  - State that a no-cost implementation cannot guarantee unlimited real-model usage; the safe default is no provider calls.
  - Include recovery steps for disabled, unauthenticated, budget-exhausted, rate-limited and malformed responses.

- [ ] **Step 4: Verify all checks**
  Run: `npm run typecheck && npm test && npm run build`
  Expected: all commands exit successfully without requiring any provider key or making a provider request.

- [ ] **Step 5: Commit the passing deliverable**
  `git add README.md docs/plans/2026-10-28-merkora-cloud-sync-progress.md docs/testing/merkora-cloud-sync-checklist.md docs/testing/merkora-ai-checklist.md`
  `git commit -m "docs(ai): document safe activation and review workflow"`

---

## Decisions fixed for this phase

- The first provider remains the existing Vercel AI Gateway adapter; the server-side interface is designed so a different provider can be added later without rewriting the UI.
- The feature flag remains off, and tests mock provider fetches. No live model call is part of implementation or verification.
- Competitor analysis in this phase uses facts supplied by the user or their source notes. Live web research is a separate future capability and requires its own source/cost/privacy review.
- No automatic application of AI suggestions, no official quote generation, no payment action, and no production deployment are included in this phase.

## Remaining product decision

When a later phase adds live competitor research, should MerKora only accept links and sources the user provides, or should it also be allowed to search public web sources? This does not block the current no-cost implementation.
