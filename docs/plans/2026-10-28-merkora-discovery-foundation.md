# MerKora GDJ — fondations et découverte Implementation Plan

> **For agentic workers:** Use the host's available task-by-task implementation workflow. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver the first verified MerKora GDJ experience: an elegant public landing page that lets a visitor understand the service and begin describing a need without creating an account, while keeping existing prototype data untouched and clearly distinguishing local rules from real AI.

**Architecture:** Preserve the existing Next.js App Router and TypeScript structure. Separate the public landing/entry experience from the existing workspace with small, focused React components and a typed discovery model; keep recommendations deterministic and honestly labeled until a server-side AI provider is implemented in a later phase. No Supabase schema or authentication changes are included in this first implementation plan.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, existing CSS, Vitest; GitHub feature branch and Vercel Preview only.

## Global Constraints

- Work only on `feature/merkora-rebuild-foundation`; do not merge to `main`.
- Do not deploy/promote to production without explicit user approval.
- Do not delete, reset, or migrate any existing Supabase project/data in this phase.
- Do not change WALL Trade or any other project.
- Never claim a live AI connection when only deterministic local rules are running.
- Never label an illustrative mockup as a working product.
- Keep all private AI keys out of client code and Git history.
- Keep the existing workspace organization recognizable; make the public entry experience more immersive without sacrificing accessibility, responsiveness, or clarity.
- No account is required to begin describing a need. Cross-device cloud saving and authenticated dossiers belong to a later phase; until implemented, the UI must state accurately where data is stored.
- Run the repository's actual checks: `npm run typecheck`, `npm test`, and `npm run build`.

---

### Task 1: Establish tested discovery-domain interfaces

**Files:**
- Modify: `src/lib/solution-recommendations.ts`
- Modify: `src/lib/solution-recommendations.test.ts`
- Proposed create: `src/lib/discovery.ts`
- Proposed create: `src/lib/discovery.test.ts`

**Interfaces:**
- Preserve existing exports `NeedCategory`, `NeedInput`, `Recommendation`, `buildRecommendations(input: NeedInput): Recommendation[]`, `getCategoryLabel(category: NeedCategory): string`, and `validateNeed(input: NeedInput): string[]` unless a compatibility-preserving extension is needed.
- Add a typed discovery state and result contract in `src/lib/discovery.ts`, with explicit states for incomplete input, preliminary local analysis, and ready-for-clarification. Keep this contract provider-agnostic; it must not imply that an AI provider exists.

- [ ] **Step 1: Add focused failing tests**

Add cases for:
1. A school/career-orientation description containing “élèves”, “bac”, “métiers”, “tests” and “relevés” does not receive unrelated shop/team-management recommendations.
2. A retail/staff-management need gets domain-relevant directions, not education-oriented content.
3. A vague need returns a clearly preliminary result and identifies the missing information instead of inventing details.
4. Invalid or whitespace-only inputs do not produce a ready-for-proposal state.
5. Existing category labels and validation behavior remain compatible.

- [ ] **Step 2: Verify the relevant failure**

Run: `npm test -- --run src/lib/solution-recommendations.test.ts src/lib/discovery.test.ts`

Expected: the new domain-specific assertions fail before implementation because the current rules mostly produce generic recommendations and have no discovery-state contract.

- [ ] **Step 3: Implement the minimum behavior**

Create a small deterministic discovery contract and refine the local recommendation rules to recognize a bounded set of clear domains (at minimum education/career orientation, commerce/staff operations, and creative/digital work). Return distinct, domain-grounded recommendations and explain that they are preliminary. When the domain is ambiguous, ask for clarification rather than forcing a category. Do not add an external AI SDK or fabricate generated insights in this task.

- [ ] **Step 4: Verify the focused pass**

Run: `npm test -- --run src/lib/solution-recommendations.test.ts src/lib/discovery.test.ts`

Expected: all new and existing assertions pass; ambiguous input stays explicitly preliminary.

- [ ] **Step 5: Run the affected integration check**

Run: `npm run typecheck`

Expected: no TypeScript errors.

- [ ] **Step 6: Commit the passing deliverable**

```bash
git add src/lib/solution-recommendations.ts src/lib/solution-recommendations.test.ts src/lib/discovery.ts src/lib/discovery.test.ts
git commit -m "feat: add domain-aware discovery foundation"
```

### Task 2: Build the public MerKora landing and no-account entry

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Proposed create: `src/components/marketing/landing-page.tsx`
- Proposed create: `src/components/marketing/need-entry.tsx`

**Interfaces:**
- `LandingPage` presents the product promise and calls `onStartDiscovery()`.
- `NeedEntry` accepts a typed callback that submits a `NeedInput`/discovery draft into the existing workspace flow; it does not save a cloud dossier or require a login.
- Existing project list/detail state and local-storage key `merkora-gdj-projects-v1` must remain readable. Do not silently discard or overwrite existing local projects.

- [ ] **Step 1: Add focused behavior tests**

Add unit tests for any extracted pure view-model helpers: starting discovery creates a draft without requiring an account; returning to the workspace preserves previously stored local dossiers; the prototype's local-storage status is not presented as cloud synchronization.

- [ ] **Step 2: Verify the relevant failure**

Run: `npm test`

Expected: new assertions fail until the entry-flow helpers and accurate storage status are in place.

- [ ] **Step 3: Implement the landing experience**

Create a responsive French landing page with a strong visual hierarchy: hero promise (“Les besoins d’abord. Les solutions ensuite.”), a clear primary action to describe a problem, a concise explanation of the process, examples across different domains, and transparent notes about what is preliminary. Use a premium technology aesthetic with restrained motion and existing typography/color tokens where practical. A visitor can begin discovery without registering. Preserve a direct route back to the existing workspace. Do not add fake customer quotes, fake metrics, fake partner logos, or nonfunctional CTA buttons.

- [ ] **Step 4: Verify the focused pass**

Run: `npm test`

Expected: all unit tests pass and existing project serialization remains compatible.

- [ ] **Step 5: Run the affected integration checks**

Run: `npm run typecheck && npm run build`

Expected: successful typecheck and production build.

Manual preview checklist:
1. Desktop and mobile layout have no horizontal overflow.
2. Primary CTA starts the need-entry flow without opening an account prompt.
3. Keyboard navigation reaches every interactive control; focus is visible.
4. Reduced-motion preference is respected.
5. Existing local dossiers remain visible after switching between landing and workspace and after refresh.
6. Any local-only storage indicator remains truthful.

- [ ] **Step 6: Commit the passing deliverable**

```bash
git add app/page.tsx app/globals.css app/layout.tsx src/components/marketing/landing-page.tsx src/components/marketing/need-entry.tsx
git commit -m "feat: add public MerKora discovery landing"
```

### Task 3: Connect the entry flow to a contextual preliminary analysis

**Files:**
- Modify: `app/page.tsx`
- Modify: `src/lib/discovery.ts`
- Modify: `src/lib/discovery.test.ts`
- Proposed create: `src/components/discovery/discovery-summary.tsx`

**Interfaces:**
- `analyzeNeed(input: NeedInput)` returns the typed local discovery result from Task 1.
- `DiscoverySummary` receives that result and renders the domain, what is understood, what remains uncertain, and a clear preliminary-status label.
- The result can be converted to the existing project shape without changing the current local-storage key or silently changing the meaning of stored fields.

- [ ] **Step 1: Add focused failing tests**

Cover Student Vision-style input, retail/staff input, ambiguous input, and incomplete input. Assert that the summary has domain-specific next steps and never calls the result “IA connectée” or a validated diagnosis.

- [ ] **Step 2: Verify the relevant failure**

Run: `npm test -- --run src/lib/discovery.test.ts`

Expected: contextual result and summary-state assertions fail before integration.

- [ ] **Step 3: Implement the entry-to-summary flow**

After a visitor submits a sufficiently described need, show a contextual preliminary analysis with the exact submitted problem and outcome, a small number of relevant directions, and explicit unknowns/questions. If essential information is missing, keep the visitor in clarification instead of showing a confident recommendation. Keep the conversation/forms architecture extensible but do not claim adaptive LLM dialogue until the real provider integration phase. Do not generate a fake mockup in this task.

- [ ] **Step 4: Verify the focused pass**

Run: `npm test -- --run src/lib/discovery.test.ts`

Expected: the domain-specific and uncertainty cases pass.

- [ ] **Step 5: Run the affected integration checks**

Run: `npm run typecheck && npm run build`

Expected: no type errors and a successful Next.js build.

Manual preview checklist:
1. A Student Vision description produces education/career-oriented directions.
2. A shop/staff description produces commerce/operations directions.
3. An ambiguous description prompts clarification rather than a generic confident solution.
4. The user can go back and edit the description without losing it.
5. The screen clearly labels the analysis as preliminary/local rules, not connected AI.

- [ ] **Step 6: Commit the passing deliverable**

```bash
git add app/page.tsx src/lib/discovery.ts src/lib/discovery.test.ts src/components/discovery/discovery-summary.tsx
git commit -m "feat: connect need entry to contextual analysis"
```

### Task 4: Verify and deliver a safe preview

**Files:**
- Modify: `README.md`
- Proposed create: `docs/testing/merkora-discovery-preview-checklist.md`

**Interfaces:**
- The README must accurately distinguish the current local prototype from future authenticated cloud saving and future real AI.
- The preview checklist records the exact build checks and manual scenarios without claiming unrun checks passed.

- [ ] **Step 1: Add the preview checklist**

Record the three domain scenarios, no-account entry, storage persistence compatibility, keyboard focus, responsive layout, reduced motion, honest AI status, and production isolation.

- [ ] **Step 2: Verify the checklist covers the agreed behavior**

Review the checklist against the design spec and the actual code paths.

Expected: every Task 1–3 acceptance condition is represented.

- [ ] **Step 3: Update the README**

Describe how to run `npm install`, `npm run dev`, `npm run typecheck`, `npm test`, and `npm run build`; clearly state that this phase does not yet include cloud account sync or a live AI provider.

- [ ] **Step 4: Run all repository checks**

Run: `npm run typecheck && npm test && npm run build`

Expected: all three commands exit successfully. If any fails, record the exact failure and do not present the preview as verified.

- [ ] **Step 5: Commit the passing deliverable**

```bash
git add README.md docs/testing/merkora-discovery-preview-checklist.md
git commit -m "docs: document MerKora discovery preview verification"
```

## Explicitly deferred to later plans

- Supabase Auth, verified administrator provisioning, row-level security and cross-device cloud saving.
- Real model-provider integration, adaptive natural-language conversation, API secret configuration, rate limits, token/cost controls, and provider outage behavior.
- Project-specific interactive mockup composition, quote versioning, administrator approval, collaboration and delivery tracking.
- Payments, hosting subscriptions, maintenance, support, audit services and verified payment webhooks.

These are deferred to keep the first preview testable; they remain in the approved product direction and are not being rejected.

## Unresolved external decisions

- Which AI provider and model to use, its approved budget/usage limits, and where its API credentials will be configured.
- Whether the first public discovery draft should be retained only in memory during the visit or offered as a downloadable local summary before sign-in.
- Which precise premium visual assets or animations are approved for the landing page. The implementation should use lightweight CSS and existing assets until specific assets are approved.

## Handoff

After this plan is reviewed, implement the tasks in order on `feature/merkora-rebuild-foundation`. Verify each task before moving forward. Do not merge or promote to production without explicit user approval.
