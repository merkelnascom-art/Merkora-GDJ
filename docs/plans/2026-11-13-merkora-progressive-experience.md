# MerKora Progressive Experience Implementation Plan

> **For agentic workers:** Use the host's available task-by-task implementation workflow. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform MerKora GDJ into the approved progressive, universal client journey and a distinct task-oriented administration experience while preserving existing project data and the current feature-branch/Preview-only release boundary.

**Architecture:** Keep the existing Next.js App Router, React, TypeScript and Vitest stack. Refactor the current page composition into a thin route and focused workspace components; add a typed journey state model that controls which client space is visible; reuse the existing universal understanding, discovery, blueprint, conversation, decision-memory and workspace-sync services. Keep commercial panels outside discovery and only expose them after a project reaches the appropriate realization/commercial stage.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5.9, Vitest 5, existing Supabase REST routes and workspace persistence, existing Vercel Preview workflow.

## Global Constraints

- The platform must accept any domain, profession, organization, personal project or problem; no vertical becomes the universal template.
- Understand the need before recommending a format, sector, profession, module or commercial offer.
- Do not infer a category, module, role, process or solution from one keyword.
- Show one main client stage at a time. Ask one useful question at a time unless a genuine multi-select is appropriate.
- Keep facts, hypotheses, unknowns, suggestions and confirmed client decisions distinct.
- A suggestion never becomes a client decision without explicit confirmation.
- Proposals must explain relevance, benefits and limits; non-digital options remain possible.
- The visual concept must be specific to the established need and format; do not force a generic mobile mockup or dashboard.
- Design validation is distinct from quote acceptance, payment or production authorization.
- Do not ask for budget or expose quotes, payments, subscriptions, invoices or hosting during initial discovery.
- Preserve local projects, cloud projects, conversations, decisions and workspace state. No destructive database operations, resets or deletions.
- Any database change must be additive, documented, reviewed and tested; the first implementation should avoid schema changes unless repository evidence proves they are essential.
- Do not enable paid services or incur costs without separate explicit approval.
- Work only on `feature/merkora-universal-reference-implementation`; no merge and no production deployment.
- The approved visual direction is premium, bright, restrained and responsive: midnight blue, champagne gold accents, luminous violet, pearl white and soft neutral surfaces.
- Be truthful about AI execution and synchronization status. An unavailable provider must not be represented as having completed an analysis.
- Keep existing API ownership checks, same-origin checks, revision conflict behavior and local fallback protections intact.

---

## Repository Findings and Existing Contracts

Observed on `feature/merkora-universal-reference-implementation`:

- `app/page.tsx` currently owns project state, localStorage persistence, landing/workspace switching, discovery submission and renders tracking, quote and payment panels before the main content. It also mounts several project tools together, producing a long mixed workspace.
- `src/components/marketing/landing-page.tsx` contains the public welcome/marketing page and example entry points.
- `src/components/studio/project-mockup-studio.tsx` owns mockup configuration, local and cloud workspace loading, review status and studio interactions.
- `src/components/studio/client-request-submit-panel.tsx` transmits project, studio, quote and client-response information together; its commercial payload must not be surfaced as a required discovery step.
- `src/lib/universal-project-understanding.ts` already separates facts, hypotheses, unknowns, constraints, actors and questions.
- `src/lib/universal-project-discovery.ts` exposes `selectNextDiscoveryQuestion(analysis, history)` and returns a single next question plus remaining gaps and readiness.
- `src/lib/universal-project-model.ts` and `src/lib/universal-project-blueprint.ts` deliberately preserve unconfirmed states and empty workflow/rule/data structures.
- `app/api/projects/[projectId]/workspace/route.ts` enforces ownership, same-origin writes, revision checks and bounded workspace payloads. Preserve these contracts.
- `app/api/projects/[projectId]/assistant/route.ts` uses persisted server-side conversation history and decision memory; browser-provided history is not trusted as durable history.
- `package.json` scripts: `npm test` runs Vitest, `npm run typecheck` runs `tsc --noEmit`, and `npm run build` runs Vitest followed by `next build`.
- `vitest.config.ts` uses the Node environment and the `@` alias. New core state logic should be tested as pure TypeScript modules; do not assume a React DOM testing library is installed.

The plan intentionally does not assume an admin route filename that has not yet been inspected. The implementer must inspect the existing admin entry point before editing and preserve its route and authorization contract.

## Task 1: Establish a typed, testable progressive journey model

**Files:**
- Create: `src/lib/client-journey.ts`
- Create: `src/lib/client-journey.test.ts`
- Modify: `src/lib/project-types.ts` only if the existing Project type needs an optional, backward-compatible journey metadata field; prefer keeping transient navigation state outside persisted Project records.
- Reference: `src/lib/universal-project-discovery.ts`
- Reference: `src/lib/universal-project-understanding.ts`
- Reference: `src/lib/universal-project-model.ts`
- Reference: `src/lib/universal-project-blueprint.ts`

**Interfaces:**
- Produce `ClientJourneyStage = "welcome" | "understanding" | "analysis" | "proposals" | "concept" | "personalization" | "validation" | "realization"`.
- Produce a typed `ClientJourneyState` with `projectId: string | null`, `stage: ClientJourneyStage`, `completedStages: ClientJourneyStage[]`, and `pendingQuestion: string | null`.
- Produce `getNextJourneyStage(input)` and `canEnterJourneyStage(input)` pure functions. Their input must include current stage, available evidence/readiness, and explicit client decisions; they must not infer confirmation from recommendations.
- Consume `selectNextDiscoveryQuestion` as the existing source of one-next-question discovery guidance. Do not duplicate its question-selection rules inside React components.

- [ ] **Step 1: Add failing unit tests**
  
  Cover:
  - a new project starts in `understanding`, not in a commercial stage;
  - an unresolved critical discovery gap keeps the journey in `understanding`;
  - a contradiction prevents transition to proposals;
  - a recommendation alone cannot mark a client decision as confirmed;
  - proposal selection allows compatible multi-selection without advancing until the client continues;
  - concept validation is not treated as quote acceptance or payment;
  - a returning project can reopen its saved stage without resetting its existing data;
  - invalid or absent project identifiers return the safe welcome state.

- [ ] **Step 2: Verify the focused failure**

  Run: `npm test -- src/lib/client-journey.test.ts`

  Expected: the new tests fail because the journey module and transition rules do not exist yet.

- [ ] **Step 3: Implement the minimum pure state model**

  Implement the types and deterministic transition helpers. Keep navigation state separate from project business data unless a backward-compatible persisted field is proven necessary. Gate the transition to proposals on discovery readiness returned by the existing discovery service; gate validation on a client-selected concept; gate realization on an explicit client design-validation event. Do not require quote/payment state to enter realization tracking.

  Edge cases:
  - unknown stages fall back to welcome at the UI boundary;
  - missing discovery context cannot be interpreted as ready;
  - missing or stale decisions cannot be silently reconstructed from AI suggestions;
  - a client returning to a prior stage does not erase later decisions or workspace payloads.

- [ ] **Step 4: Verify the focused pass**

  Run: `npm test -- src/lib/client-journey.test.ts`

  Expected: all journey-state tests pass.

- [ ] **Step 5: Run affected integration checks**

  Run: `npm test -- src/lib/universal-project-understanding.test.ts src/lib/universal-project-discovery.test.ts src/lib/mockup-studio.test.ts`

  Expected: existing universal interpretation, one-question discovery and mockup classification regressions remain green.

- [ ] **Step 6: Commit the passing deliverable**

  ```bash
  git add src/lib/client-journey.ts src/lib/client-journey.test.ts src/lib/project-types.ts
  git commit -m "feat: add progressive client journey state"
  ```

  Add `src/lib/project-types.ts` only if it was actually changed.

## Task 2: Refactor the client experience into one progressive space at a time

**Files:**
- Modify: `app/page.tsx` — reduce to route-level data/state composition and render the selected workspace space.
- Create: `src/components/workspace/client-workspace-shell.tsx` — responsive shell, compact navigation, project context and stage frame.
- Create: `src/components/workspace/client-project-journey.tsx` — stage switcher and stage transitions.
- Create: `src/components/workspace/client-project-home.tsx` — project list, resume cards and start action.
- Create: `src/components/workspace/client-understanding-step.tsx` — free-form first description, optional attachments if an existing supported upload flow is present, and one-question-at-a-time continuation.
- Create: `src/components/workspace/client-analysis-step.tsx` — honest processing/analysis state, with explicit local-only fallback when no AI provider actually ran.
- Create: `src/components/workspace/client-proposals-step.tsx` — a short set of justified options with benefits, limits and client choice.
- Reference: `src/components/marketing/landing-page.tsx`
- Reference: `src/components/assistant/merkora-assistant-panel.tsx`
- Reference: `src/components/ai/ai-proposal-panel.tsx`
- Reference: `src/components/account/cloud-account-panel.tsx`
- Reference: `src/components/account/client-request-tracking-panel.tsx`
- Reference: `src/components/account/client-quotes-panel.tsx`
- Reference: `src/components/account/client-payments-panel.tsx`
- Reference: `src/lib/client-journey.ts`

**Interfaces:**
- `ClientWorkspaceShell` receives the active project, project list, active stage, stage navigation callback and children for the single visible stage.
- `ClientProjectJourney` receives a Project and the persisted discovery/conversation context; it uses the Task 1 pure transition helpers.
- Existing project creation and `STORAGE_KEY = "merkora-gdj-projects-v1"` compatibility must be preserved.
- Existing cloud account loading and `mergeCloudProjects` behavior must remain available.
- Existing assistant and discovery services remain the source of conversation and next-question behavior.

- [ ] **Step 1: Add failing tests for the client composition contract**

  Add pure tests for stage-to-view selection and compatibility helpers, or component tests only if an existing React test renderer is found in the repository. Assert that:
  - the home view exposes start and resume actions;
  - only the selected stage is mounted as the primary stage;
  - quote, payment and invoice panels are absent from welcome, understanding, analysis, proposals, concept, personalization and validation;
  - project list and saved project identifiers remain unchanged through navigation;
  - returning from a later stage to an earlier stage does not clear local project state.

- [ ] **Step 2: Verify the focused failure**

  Run: `npm test -- src/components/workspace`

  Expected: the focused test fails before the new composition and stage-selection behavior are implemented.

- [ ] **Step 3: Implement the progressive client shell**

  Extract the existing home/project navigation from `app/page.tsx`. Replace the always-mounted tracking/quotes/payments and long mixed page with one stage frame. Preserve the public landing page as an optional entry point, the ability to start without creating an account, and the current local browser storage key. Do not add mandatory sector, device, budget or category choices to the first description.

  The understanding stage must:
  - accept the client's own words;
  - show only the next most useful question returned by the existing discovery engine;
  - allow short answers and "Je ne sais pas encore" where appropriate;
  - preserve previous answers and conversation history;
  - show clear save/sync state without pretending local storage is cloud synchronization.

  The analysis stage must distinguish actual connected AI execution from deterministic local analysis. If a provider is unavailable, show the existing truthful local-only status and allow the client to continue once enough evidence exists.

  The proposal stage must not mark recommendations as confirmed choices. Store explicit client selections separately from AI-generated proposals.

  Commercial panels remain available from a distinct project/commercial destination only when the project has entered realization and a quote or payment actually exists. Existing tracking access must not be deleted; it is relocated rather than removed.

  - [ ] **Step 4: Verify focused client-flow tests**

  Run: `npm test -- src/components/workspace`

  Expected: the client stage selection and commercial visibility tests pass.

- [ ] **Step 5: Run affected integration checks**

  Run: `npm test && npm run typecheck`

  Expected: all Vitest tests pass and TypeScript reports no errors.

- [ ] **Step 6: Commit the passing deliverable**

  ```bash
  git add app/page.tsx src/components/workspace
  git commit -m "feat: introduce progressive client workspace"
  ```

## Task 3: Make the concept studio and validation reflect confirmed project context

**Files:**
- Modify: `src/components/studio/project-mockup-studio.tsx`
- Modify: `src/lib/mockup-studio.ts`
- Modify: `src/components/studio/client-request-submit-panel.tsx`
- Create: `src/lib/concept-validation.ts`
- Create: `src/lib/concept-validation.test.ts`
- Reference: `src/lib/universal-project-model.ts`
- Reference: `src/lib/universal-project-blueprint.ts`
- Reference: `app/api/projects/[projectId]/workspace/route.ts`
- Reference: `src/lib/universal-project-decision-memory.ts`

**Interfaces:**
- Produce a pure `ConceptValidationState` with a concept version identifier, status (`draft | changes_requested | approved`), client note and timestamp.
- Produce `recordConceptDecision(state, decision)` that only records an explicit client action and preserves prior versions.
- Studio consumes confirmed project format and selected options; if no format is confirmed, it presents a neutral format exploration rather than defaulting to a mobile app or dashboard.
- Submission payload must distinguish design validation from quote response and payment state.

- [ ] **Step 1: Add failing tests for concept decisions**

  Cover:
  - a generated concept remains draft until the client explicitly approves it;
  - a change request preserves the previous concept version;
  - approval is bound to the exact concept version shown;
  - an updated concept invalidates approval for the new version without deleting the prior approval record;
  - approval never implies quote acceptance or payment;
  - an unconfirmed format does not silently become a confirmed website/mobile/dashboard selection;
  - a missing timestamp or decision actor is not fabricated by a pure state transformation.

- [ ] **Step 2: Verify the focused failure**

  Run: `npm test -- src/lib/concept-validation.test.ts`

  Expected: tests fail because the versioned concept decision module is not present.

- [ ] **Step 3: Implement concept-specific preview and validation**

  Refine the mockup model so its preview is based on the project's confirmed needs, chosen solution direction and actual client decisions. Keep the universal format options (human, organizational, documentary, physical, digital and hybrid) separate from display formats (website, mobile, dashboard). Only use a website/mobile/dashboard rendering once a digital interface is supported by the confirmed concept.

  Replace any automatic first-format assumption in studio hydration with a neutral/unselected state when the saved project has no confirmed format. Preserve backward compatibility when older saved projects contain one of the existing format values.

  Separate:
  - suggested functions from client-selected functions;
  - proposed roles from confirmed roles;
  - draft concepts from client-approved concepts;
  - design approval from quote response and payment.

  The client-request transmission must not require or fabricate a quote response during discovery. Preserve the current API payload compatibility for existing submitted requests; introduce optional fields only where the server already accepts extensible JSON, and verify before sending new fields.

  - [ ] **Step 4: Verify focused studio and validation tests**

  Run: `npm test -- src/lib/concept-validation.test.ts src/lib/mockup-studio.test.ts`

  Expected: all concept versioning and existing mockup regression tests pass.

- [ ] **Step 5: Run affected integration checks**

  Run: `npm test && npm run typecheck`

  Expected: all tests and type checking pass; older local studio records still hydrate.

- [ ] **Step 6: Commit the passing deliverable**

  ```bash
  git add src/components/studio/project-mockup-studio.tsx src/lib/mockup-studio.ts src/components/studio/client-request-submit-panel.tsx src/lib/concept-validation.ts src/lib/concept-validation.test.ts
  git commit -m "feat: align concept studio with client decisions"
  ```

## Task 4: Separate realization and commercial access from discovery

**Files:**
- Create: `src/components/workspace/client-realization-step.tsx`
- Create: `src/components/workspace/client-project-services.tsx`
- Modify: `src/components/workspace/client-project-journey.tsx`
- Modify: `app/page.tsx` only if needed to route to the separate project services destination.
- Reference: `src/components/account/client-request-tracking-panel.tsx`
- Reference: `src/components/account/client-quotes-panel.tsx`
- Reference: `src/components/account/client-payments-panel.tsx`
- Reference: `src/components/account/client-plan-approval-panel.tsx`
- Reference: `src/components/project-plan-preview.tsx`
- Reference: `src/components/studio/client-request-submit-panel.tsx`

**Interfaces:**
- `ClientRealizationStep` receives project status, verified milestones, deliverables and pending client actions.
- `ClientProjectServices` receives existing quote/payment/plan data and renders only the data that actually exists and is authorized for the current user.
- Existing tracking, quote, payment and plan APIs remain unchanged unless a separately reviewed API contract change is proven necessary.

- [ ] **Step 1: Add failing tests for stage and commercial separation**

  Cover:
  - discovery, proposals, concept and validation views never render a quote or payment action;
  - a validated concept can enter realization tracking without a quote being automatically accepted;
  - a quote is visible only when a quote record exists and the user is authorized;
  - payment status is displayed only from persisted payment data, never inferred from a quote;
  - a project with no commercial records shows no empty finance dashboard;
  - existing project status labels remain understandable and backward compatible.

- [ ] **Step 2: Verify the focused failure**

  Run: `npm test -- src/components/workspace`

  Expected: tests fail until commercial visibility is separated from discovery and tied to persisted data.

- [ ] **Step 3: Implement realization and service destinations**

  Build a concise realization timeline with current stage, completed work, next expected action, deliverables and client questions. Move existing tracking, quote, payment and plan components into a separate services area reachable from the project after it enters realization. Do not remove the existing capabilities or change quote-review rules.

  Edge cases:
  - if no milestone data exists, show a clear initial state rather than inventing progress;
  - if a quote is pending admin review, do not show it as client-approved;
  - if payment status cannot be loaded, show unavailable rather than unpaid/paid;
  - if a user lacks authorization, retain the existing server denial and do not reveal hidden project or financial data.

- [ ] **Step 4: Verify focused realization tests**

  Run: `npm test -- src/components/workspace`

  Expected: stage and commercial separation tests pass.

- [ ] **Step 5: Run affected integration checks**

  Run: `npm test && npm run typecheck`

  Expected: existing account and project types remain compatible.

- [ ] **Step 6: Commit the passing deliverable**

  ```bash
  git add src/components/workspace app/page.tsx
  git commit -m "feat: separate realization from project discovery"
  ```

## Task 5: Refine the administrator workspace and complete quality verification

**Files:**
- Inspect before editing: existing admin route and files under `src/components/admin/` and the corresponding `app/` route.
- Modify: existing admin entry point and its existing dashboard/project components; exact filenames must be selected from the repository tree during implementation rather than guessed.
- Create only if the current admin structure has no suitable separation:
  - `src/components/admin/admin-workspace-shell.tsx`
  - `src/components/admin/admin-project-review.tsx`
- Create: `src/lib/admin-project-review.test.ts` if review decision logic is extracted into a pure module.
- Modify: `app/globals.css` for responsive, accessible premium styling.
- Reference: `src/lib/universal-project-decision-memory.ts`
- Reference: `src/lib/server/supabase-rest.ts`
- Reference: existing admin authorization and data-access modules discovered before edits.

**Interfaces:**
- Admin navigation sections: dashboard, requests/projects, analysis & design, approvals & quotes, realization, clients, finances and configuration.
- Admin project review consumes project conversation, facts, hypotheses, unknowns, proposals, concept versions, client decisions and audit events.
- Admin actions that affect client decisions or project state must be authorized server-side and recorded with actor and timestamp by the existing audit/event mechanism where available.

- [ ] **Step 1: Add failing tests for admin review invariants**

  Cover:
  - admin can distinguish facts from hypotheses and client-confirmed decisions;
  - an admin correction does not rewrite the original client statement;
  - a proposal cannot be represented as client-approved without a client decision event;
  - a quote remains subject to existing administrator review before client visibility;
  - unauthorized users cannot access admin project details or financial data;
  - an unavailable audit/event feed is shown as unavailable rather than silently omitted as if no events existed.

- [ ] **Step 2: Verify the focused failure**

  Run: `npm test -- src/lib/admin-project-review.test.ts`

  Expected: the new invariant tests fail before the admin review model or behavior is implemented.

- [ ] **Step 3: Implement admin review and visual consistency**

  Inspect and preserve the actual existing admin route, authorization and data-access conventions. Refactor its navigation into the eight task areas listed above. The dashboard should prioritize work requiring attention, not repeat the client landing page. The project review view must make the source and status of every important item visible: client fact, hypothesis, unknown, AI suggestion, admin correction or confirmed client decision.

  Do not implement a new finance data model or change prices. Reuse current admin quote-review logic. Apply the approved palette and component rhythm, with responsive compact navigation and accessible focus/contrast.

  - [ ] **Step 4: Verify focused admin tests**

  Run: `npm test -- src/lib/admin-project-review.test.ts`

  Expected: all decision provenance and authorization behavior tests pass.

- [ ] **Step 5: Run full repository verification**

  Run:
  ```bash
  npm test
  npm run typecheck
  npm run build
  ```

  Expected:
  - Vitest reports all tests passing;
  - TypeScript completes without errors;
  - Next.js production build completes successfully.

  Then verify the Vercel Preview manually at mobile and desktop widths:
  - create a project from a free description;
  - answer the next contextual question and reload;
  - resume the project without losing answers;
  - confirm that proposals remain suggestions until selected;
  - inspect a project-appropriate concept and request a change;
  - approve one exact concept version;
  - confirm that no quote/payment prompt appeared during discovery;
  - inspect realization and the separate commercial area;
  - verify admin fact/hypothesis/decision provenance;
  - verify logged-out and unauthorized access behavior;
  - confirm no destructive Supabase operation or production deployment occurred.

- [ ] **Step 6: Commit the passing deliverable**

  ```bash
  git add app src
  git commit -m "feat: complete progressive admin and quality pass"
  ```

  Stage only files actually changed for this task; do not include generated artifacts, secrets, local environment files or unrelated edits.

---

## Explicitly Unresolved Product Decisions

These decisions affect user-visible behavior and should be settled before the relevant implementation task, not guessed silently:

1. **Public landing versus direct workspace:** keep the current marketing landing as the first screen with a clear start action, or make the project home the default authenticated experience. Recommendation: preserve the current public landing for logged-out visitors and show the project home after entering the workspace.
2. **Attachments in the first discovery release:** enable file/image uploads immediately only if an existing secure upload pipeline is already present; otherwise retain the UI affordance as unavailable until a secure storage and consent flow is approved. Recommendation: do not invent a new storage backend or use an unreviewed public bucket.
3. **Cloud account requirement:** preserve the current ability to begin without an account and explain that cross-device cloud continuity requires sign-in. Recommendation: keep local-first entry and request sign-in only when the user chooses cloud synchronization or submission.
4. **Admin navigation labels:** the eight sections in the design specification are the target information architecture; exact route URLs should follow the existing admin route structure after inspection. Recommendation: preserve current URLs and change the navigation labels/layout first.

## Handoff

The implementation plan is intended to be executed one task at a time with focused tests and review gates. The available host workflow for inline execution is the SkillQuiver `executing-plans` skill; load its instructions before beginning implementation. A subagent-driven workflow is not assumed available.

The approved next boundary is implementation on the existing feature branch and Preview only. This plan does not authorize merge, production deployment, destructive database changes, new paid services or external spending.
