# MerKora Native Project Planning Engine Implementation Plan

> **For agentic workers:** Use the host's available task-by-task implementation workflow. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a native MerKora engine that turns a customer's validated project brief into a traceable, versioned, testable delivery plan without requiring ChatGPT or an operator to write each customer plan manually.

**Architecture:** Start with a deterministic, server-safe domain engine that consumes the project's recorded brief, validated scope and explicitly selected options. It produces a structured plan with tasks, dependencies, acceptance criteria, estimates, assumptions and clarification blockers. Keep generation separate from persistence and UI; only integrate after the contract is proven. External AI remains disabled in the current zero-expense phase.

**Tech Stack:** Next.js App Router, TypeScript strict mode, Vitest, existing `NeedInput`, `Project`, `DiscoveryResult` and recommendation types. No new dependency is required for the first engine milestone.

## Global Constraints

- MerKora, not ChatGPT or a human operator, owns the generation, versioning and maintenance of each customer project plan.
- A plan is generated from a specific project brief version and the options the customer actually selected. Never add unselected features as if they were approved.
- Missing facts must be represented as questions, assumptions or blockers. Never invent a deadline, budget, team size, infrastructure, provider, price or delivery promise.
- A plan must include scope, proposed architecture, tasks, dependencies, priorities, milestones, acceptance criteria, verification steps, estimates and uncertainty.
- No code-generation job may start without a traceable plan, acceptance criteria and an explicitly authorized scope.
- The first milestone is deterministic and free: do not call an external AI provider, create paid resources or enable the currently disabled AI feature.
- Keep the existing project, discovery, recommendation and client-request behavior backward compatible.
- Work only on `feature/admin-preview-secure-access` in `merkelnascom-art/Merkora-GDJ`.
- Do not modify `main`, production settings, Supabase data, existing invoices, payment declarations or launch records.
- Do not run migrations or add a database table in this milestone. Plan persistence/version storage requires a separate schema and access review.
- Do not create or trigger a production deployment. No cloud resources, provider credentials or paid services are authorized by this plan.
- Distinguish generated draft plans from customer-approved plans and from plans approved for execution.

---

## Repository evidence and integration boundaries

Observed on `feature/admin-preview-secure-access`:
- `src/lib/solution-recommendations.ts` defines `NeedInput`, `Recommendation`, categories and current input validation.
- `src/lib/discovery.ts` provides local domain classification, clarification questions and preliminary recommendations.
- `src/lib/project-types.ts` defines `Project` and cloud project row mapping.
- `src/lib/local-analysis.ts` already provides a free local-analysis fallback and explicitly marks its assumptions.
- `app/api/projects/route.ts` persists existing project records through the signed-in user's Supabase token.
- `app/api/client-requests/route.ts` receives a project payload and Studio/quote/client-response data; it does not currently define a canonical, versioned technical specification.
- `app/api/ai/analyze/route.ts` deliberately returns `ZERO_EXPENSE_MODE` and does not call a provider.
- `package.json` exposes `npm test`, `npm run typecheck` and `npm run build`; Vitest uses the Node environment.

Therefore this first milestone is a pure domain capability. It must not silently write to existing project rows or treat preliminary recommendations as validated customer selections.

## Proposed domain contract

Create `src/lib/planning/plan-types.ts` with:
- `ProjectPlanInput`: project identifier, source brief version, the existing `NeedInput`, discovery result when available, explicit selected option identifiers and descriptions, approved scope identifiers, and any customer-confirmed constraints.
- `ProjectPlanStatus`: `needs_clarification` | `draft` | `ready_for_review`.
- `ProjectPlan`: stable plan identifier, version, source brief version, status, summary, goals, included scope, exclusions, assumptions, open questions, proposed architecture, tasks, milestones, estimates, acceptance criteria, verification checklist and generation metadata.
- `PlanTask`: stable task identifier, title, purpose, priority, dependencies, deliverable, acceptance criteria, estimate range and uncertainty notes.
- `PlanEstimate`: effort range and confidence/unknown markers. Do not present a calendar date or fixed price when the input does not support it.

Create `src/lib/planning/generate-project-plan.ts` with a pure exported function:
`generateProjectPlan(input: ProjectPlanInput): ProjectPlan`.

The function must not access the network, environment variables, browser APIs, Supabase, GitHub, Vercel, filesystem or external AI. Identical normalized inputs and the same planner version must produce equivalent plan content. The caller supplies the plan version; persistence and version allocation are outside this pure function.

## Task 1: Define the plan contract and deterministic generation core

**Files:**
- Create: `src/lib/planning/plan-types.ts`
- Create: `src/lib/planning/generate-project-plan.ts`
- Test: `src/lib/planning/generate-project-plan.test.ts`

**Interfaces:**
- Consumes: existing `NeedInput`, `DiscoveryResult` and `Recommendation` types from `src/lib/solution-recommendations.ts` and `src/lib/discovery.ts`.
- Produces: `ProjectPlanInput`, `ProjectPlan`, `PlanTask`, `PlanEstimate`, and `generateProjectPlan(input): ProjectPlan`.

- [x] **Step 1: Add the focused failing tests**

Cover at least these cases:
1. A complete commerce/team-management brief creates a draft plan with distinct analysis, design, implementation and verification tasks.
2. A Student Vision/education brief creates an education-oriented plan and does not insert retail, inventory or cash-register features.
3. A creative deliverable creates a production/approval plan rather than a software application architecture.
4. Only explicitly selected option identifiers and approved scope identifiers appear in the included scope; unselected recommendations remain suggestions and are not promoted to approved features.
5. A missing budget, deadline, user count or infrastructure detail appears as unknown/assumption/open question and is never fabricated into a numeric commitment.
6. An incomplete brief returns `needs_clarification`, contains targeted questions and cannot be marked `ready_for_review`.
7. Every task has a stable identifier, a deliverable and at least one verifiable acceptance criterion.
8. Dependencies refer to existing task identifiers; no task depends on itself and the dependency graph contains no cycle.
9. A project with no confirmed external integrations does not receive invented vendors, API keys or cloud services.
10. The generated plan records the source brief version and planner version supplied by the caller.
11. Equivalent inputs produce equivalent plan content; timestamps and random identifiers are not generated inside the pure function.

- [x] **Step 2: Verify the relevant failure**

Run: `npm test -- --run src/lib/planning/generate-project-plan.test.ts`

Expected: Vitest reports the new module or exported generator is missing. No existing test should be changed to hide this failure.

- [x] **Step 3: Implement the minimum behavior**

Implement typed plan output and deterministic rules for the current supported categories: business, digital, creative, organization, personal and other. Reuse discovery domain information when present; otherwise derive only a conservative category from the supplied project category. Create a small set of domain-specific task patterns and a shared lifecycle (clarify, scope, design, build/produce, verify, hand over).

Preserve uncertainty explicitly. If the description is vague or essential facts are missing, return a clarification state and list questions; do not label the plan ready. The first implementation may provide relative effort bands such as low/medium/high/unknown, but must not promise calendar dates or FCFA prices. Keep software construction tasks distinct from non-software creative or advisory work. Do not infer that a recommendation has been selected.

- [x] **Step 4: Verify the focused pass**

Run: `npm test -- --run src/lib/planning/generate-project-plan.test.ts`

Expected: all plan-generation tests pass, including domain separation, scope fidelity, uncertainty, task dependencies and determinism.

- [x] **Step 5: Run the affected integration check**

Run: `npm run typecheck && npm test`

Expected: strict TypeScript checking succeeds and the complete existing Vitest suite remains green. Existing discovery, recommendations, project serialization and zero-expense AI tests remain unchanged and pass.

- [x] **Step 6: Commit the passing deliverable**

```bash
git add src/lib/planning/plan-types.ts src/lib/planning/generate-project-plan.ts src/lib/planning/generate-project-plan.test.ts
git commit -m "feat(planning): add deterministic project plan engine"
```

## Task 2: Add explicit plan review and change comparison

**Files:**
- Create: `src/lib/planning/compare-project-plans.ts`
- Test: `src/lib/planning/compare-project-plans.test.ts`
- Modify: `src/lib/planning/plan-types.ts` only if the comparison contract requires a shared exported type.

**Interfaces:**
- Consumes: two `ProjectPlan` values generated from different brief versions.
- Produces: `ProjectPlanDiff` containing added, removed and changed scope items, tasks, assumptions, open questions and estimates.

- [x] **Step 1: Add the focused failing tests**

Verify that comparison:
1. identifies an added selected feature and the tasks it introduces;
2. identifies a removed feature and tasks no longer required;
3. detects changed assumptions and estimates;
4. does not claim that unchanged plan sections changed;
5. refuses to compare plans from different project identifiers;
6. retains the original plan objects without mutating either one.

- [x] **Step 2: Verify the relevant failure**

Run: `npm test -- --run src/lib/planning/compare-project-plans.test.ts`

Expected: the comparison module or export is missing.

- [x] **Step 3: Implement the minimum behavior**

Compare by stable identifiers and return a structured diff. Do not automatically overwrite, approve or execute the newer plan. A changed brief produces a new draft plan; a human/client review policy decides whether it can proceed.

- [x] **Step 4: Verify the focused pass**

Run: `npm test -- --run src/lib/planning/compare-project-plans.test.ts`

Expected: all add/remove/change and immutability assertions pass.

- [x] **Step 5: Run the affected integration check**

Run: `npm run typecheck && npm test`

Expected: all tests and type checks pass.

- [x] **Step 6: Commit the passing deliverable**

```bash
git add src/lib/planning/compare-project-plans.ts src/lib/planning/compare-project-plans.test.ts src/lib/planning/plan-types.ts
git commit -m "feat(planning): compare project plan revisions"
```

## Task 3: Expose a safe, non-persistent planning preview

**Files:**
- Create: `app/api/projects/[projectId]/plan/preview/route.ts`
- Test: `app/api/projects/[projectId]/plan/preview/route.test.ts`
- Reuse: `src/lib/planning/generate-project-plan.ts`, `src/lib/server/supabase-rest.ts`.

**Interfaces:**
- Consumes: authenticated user's existing project record and a same-origin preview request with a brief version and explicit selected/approved scope.
- Produces: a generated `ProjectPlan` response only; this endpoint does not persist the plan or update project status.

- [x] **Step 1: Add the focused failing tests**

Verify:
1. cross-origin requests are rejected before reading project data;
2. unauthenticated users receive 401;
3. the signed-in user cannot preview another user's project;
4. unknown project identifiers return 404 without leaking whether another user's record exists;
5. invalid JSON and malformed selected-scope payloads return 400;
6. a valid request returns the deterministic plan and the correct project/source version;
7. the endpoint never calls an external AI provider;
8. the endpoint never writes to Supabase and never changes quotes, payments, launch records or project status;
9. an unavailable Supabase configuration returns an explicit service-unavailable response rather than a fabricated plan.

- [x] **Step 2: Verify the relevant failure**

Run: `npm test -- --run 'app/api/projects/[projectId]/plan/preview/route.test.ts'`

Expected: the preview route does not exist.

- [x] **Step 3: Implement the minimum behavior**

Use the existing authenticated-user access pattern from `app/api/projects/route.ts`. Query only the requesting user's project through their own access token; do not use a service-role key. Apply same-origin protection to the POST request. Generate the plan in memory and return `Cache-Control: no-store`. Do not persist or approve it. Keep the route server-side and do not expose tokens or environment secrets.

- [x] **Step 4: Verify the focused pass**

Run: `npm test -- --run 'app/api/projects/[projectId]/plan/preview/route.test.ts'`

Expected: all authentication, ownership, malformed-input, zero-provider and no-write assertions pass.

- [x] **Step 5: Run the affected integration check**

Run: `npm run typecheck && npm test`

Expected: the API route type-checks and all existing project, auth and AI zero-expense tests pass.

- [x] **Step 6: Commit the passing deliverable**

```bash
git add 'app/api/projects/[projectId]/plan/preview/route.ts' 'app/api/projects/[projectId]/plan/preview/route.test.ts'
git commit -m "feat(planning): add authenticated plan preview endpoint"
```

## Task 4: Connect plan preview to the project experience

**Files:**
- Create: `src/components/project-plan-preview.tsx`
- Test: `src/lib/planning/mockup-selections.test.ts` (explicit Studio selection mapping; the Next.js production build compiles the UI component)
- Modify: the existing project detail/review component that currently displays discovery, recommendations and Studio/quote information. Exact component path must be confirmed from the repository tree before implementation; do not create a parallel project screen.

**Interfaces:**
- Consumes: project identifier, source brief version, explicit selected options, preview endpoint response and `ProjectPlanDiff`.
- Produces: an accessible plan preview with status, scope, tasks, milestones, unknowns, questions and review actions.

- [x] **Step 1: Add the focused failing tests**

Verify:
1. the client can request a plan preview for its own open project;
2. the UI clearly labels a generated plan as a draft until reviewed;
3. selected options are visually distinguished from recommendations not selected;
4. unknown values and open questions are visible rather than hidden;
5. a changed brief shows a structured difference and does not silently replace the prior preview;
6. loading, API failure, offline and clarification states are explicit;
7. the UI does not display a false “approved”, “in production” or “delivered” state;
8. keyboard navigation and labels are usable on mobile and desktop layouts.

- [x] **Step 2: Verify the relevant failure**

Run: `npm test -- --run src/components/project-plan-preview.test.tsx`

Expected: the component and tests do not exist.

- [x] **Step 3: Implement the minimum behavior**

Integrate the preview into the existing project flow without changing quote approval, payment or launch behavior. Provide separate review actions for requesting changes and marking the plan reviewed only if an existing authorized workflow supports them; otherwise keep the component read-only and label the review action as unavailable. Never persist an approval using browser-only state.

- [x] **Step 4: Verify the focused pass**

Run: `npm test -- --run src/components/project-plan-preview.test.tsx`

Expected: all rendering, draft-state, scope-fidelity, error and accessibility assertions pass.

- [x] **Step 5: Run the affected integration check**

Run: `npm run typecheck && npm test && npm run build`

Expected: the complete app builds and existing client/admin workflows remain functional.

- [x] **Step 6: Commit the passing deliverable**

```bash
git add src/components/project-plan-preview.tsx src/components/project-plan-preview.test.tsx [confirmed-existing-project-detail-files]
git commit -m "feat(planning): show generated project plans"
```

**Verification boundary:** the selection-mapping tests, strict TypeScript check and Next.js production build pass. The current milestone does not include a browser-driven click-through test; the preview remains non-persistent and requires an authenticated cloud-saved project.

---

## Acceptance criteria for this milestone

1. MerKora can generate a structured project plan from a project brief without ChatGPT manually writing that individual plan.
2. The engine works with no external AI provider and no paid call.
3. It reflects only customer-selected options and approved scope.
4. It asks questions or marks unknowns instead of inventing facts.
5. Every task has a deliverable and testable acceptance criteria.
6. Dependencies are valid and acyclic.
7. Plans identify the project, source brief version, planner version and plan version.
8. Changes produce a comparison; previous plan versions are not silently overwritten.
9. The preview endpoint enforces same-origin and user ownership and performs no writes.
10. Existing project, quote, payment, launch and authentication behavior remains unchanged.
11. Typecheck, focused tests, full tests and build pass before the milestone is declared complete.

## Decisions required before persistent storage or AI planning

- Decide whether a customer must explicitly approve the generated plan before it can be used to calculate a final quote, or whether an admin review is also mandatory for every project category.
- Define the authoritative source and versioning format for customer-selected modules/options. Current project recommendations are not proof of selection, and current client-request payload does not yet provide a canonical technical specification.
- Decide retention and deletion rules for plan versions and their audit history before adding database storage.
- Decide the initial effort-estimation unit (relative effort bands only, person-hours, or person-days). This plan deliberately does not invent dates or prices.
- Decide when external AI may be enabled, which provider/model is approved, the budget ceiling, and what client data may be sent. The current zero-expense behavior remains unchanged until explicit approval.
