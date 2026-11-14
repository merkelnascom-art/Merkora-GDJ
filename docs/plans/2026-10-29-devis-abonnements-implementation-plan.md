# Devis et abonnements MerKora GDJ — Implementation Plan

> **For agentic workers:** Use the host's available task-by-task implementation workflow. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a manually managed, secure, versioned quote workflow in MerKora GDJ Preview, allowing the administrator to prepare a quote and the correct client to review and respond to a specific published version.

**Architecture:** Keep commercial rules in pure TypeScript functions and test them with the existing Vitest setup. Reuse the existing Next.js App Router, authenticated Supabase REST helpers, admin access checks, and client request flow. Persisted immutable quote versions require a separate schema sufficiency check; no database schema change may happen without explicit user approval.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Supabase REST with user session/RLS, Vitest, Vercel Preview.

## Global Constraints

- No additional spending, paid plans, paid AI calls, credit-based features, or paid third-party integrations.
- Work only on branch `feature/admin-preview-secure-access` and verify Preview only.
- Do not touch production, the main branch, production environment variables, or deploy/promote to production.
- Do not reset Supabase, delete existing data, create Supabase projects/branches, or modify existing records destructively.
- Do not add service-role secrets or expose secrets to the browser.
- Do not change the database schema or run a migration without separate explicit user approval.
- Keep external AI routes disabled; the first quote workflow must work manually.
- Do not claim a feature works until tests and the relevant Preview flow have actually been verified.
- Distinguish quote acceptance from payment receipt, project start, and delivery.
- Unknown prices, taxes, costs, dates, and terms must not silently become zero or be invented.
- Preserve internal admin notes from client-facing responses.

---

### Task 1: Pure quote model, calculations, and validation

**Files:**
- Create: `src/lib/quotes.ts` (proposed; pure domain logic only)
- Create: `src/lib/quotes.test.ts` (proposed; Vitest tests)
- Modify: none outside this task unless an existing shared type proves necessary

**Interfaces:**
- Produce `QuoteStatus`: `draft | pending_client | changes_requested | negotiation | accepted_by_client | declined_by_client | expired | superseded`.
- Produce `QuoteLine` with stable id, description, category, quantity, unit, unitPriceMinor, and cost certainty; represent money as integer minor units to avoid floating-point arithmetic.
- Produce `QuoteDraft` with quote id, client request id, project identity, version, currency, line items, explicitly specified discount/tax values, validity dates, scope, exclusions, assumptions, payment terms, one-time costs, recurring costs, and status.
- Produce pure functions `calculateQuoteTotals(draft)`, `validateQuoteDraft(draft)`, and `canTransitionQuoteStatus(from, to)`; exact field names may be refined to fit existing conventions before implementation, but tests and consumers must agree.

- [ ] **Step 1: Add focused failing tests**

Cover: empty draft remains a draft; two positive line items produce exact subtotals and total; decimal display formatting does not affect integer calculations; zero quantity and negative amounts are rejected; unknown/unsupported currency is rejected; unconfirmed tax is not added; unknown costs are marked as unconfirmed rather than counted as zero; invalid dates and expired publication are rejected; unknown statuses and forbidden transitions are rejected; changing a draft does not mutate an already-created published snapshot.

- [ ] **Step 2: Verify the relevant failure**

Run: `npm test -- --run src/lib/quotes.test.ts`

Expected: Vitest reports the missing module or missing exported functions before implementation.

- [ ] **Step 3: Implement minimum pure behavior**

Implement deterministic arithmetic and closed status/validation rules only. No network calls, browser storage, AI, database access, invented pricing, tax defaults, or implicit publication.

- [ ] **Step 4: Verify the focused pass**

Run: `npm test -- --run src/lib/quotes.test.ts`

Expected: all quote domain tests pass.

- [ ] **Step 5: Run affected integration checks**

Run: `npm run typecheck`

Expected: TypeScript reports no new errors.

- [ ] **Step 6: Commit the passing deliverable**

```bash
git add src/lib/quotes.ts src/lib/quotes.test.ts
git commit -m "feat: add tested quote domain rules"
```

### Task 2: Inspect persistence and obtain approval for any schema change

**Files:**
- Inspect: `app/api/client-requests/route.ts`
- Inspect: `app/api/admin/client-requests/route.ts`
- Inspect: `src/lib/server/supabase-rest.ts` (actual existing path must be confirmed from repository)
- Inspect: `src/lib/server/admin-access.ts` (actual existing path must be confirmed from repository)
- Inspect only: existing Supabase migration files under `supabase/`
- Proposed only if needed: a separately reviewed additive quote schema migration and accompanying RLS policies

**Interfaces:**
- Consume the existing authenticated user token, `getCurrentUser`, `getAccessToken`, `getAdminAccess`, `callUserData`, and same-origin request guard where applicable.
- No new persistence interface is approved until the schema sufficiency audit is complete.

- [ ] **Step 1: Add a persistence contract/audit test or documented inspection checklist**

Confirm what the existing `client_requests` table can represent and whether it can safely support immutable quote versions and client decisions without overwriting existing request payloads. Verify current migrations and RLS policies from repository evidence; do not run SQL or modify the remote database.

- [ ] **Step 2: Verify the baseline**

Run: `npm test`

Expected: record the existing suite result before persistence work; do not interpret a pre-existing failure as caused by the quote feature.

- [ ] **Step 3: Decide based on evidence, not assumptions**

If existing structures support versioned quotes with correct client/admin isolation, document the exact safe interface and proceed. If they do not, stop implementation at this gate and present the proposed additive tables/columns, foreign keys, indexes, and RLS policies for the user's explicit approval. Do not use a JSON payload overwrite as a substitute for immutable version history.

- [ ] **Step 4: Verify no data/schema mutation occurred during the audit**

Expected: no SQL migration was executed, no Supabase project or branch was created, and no existing record was changed.

- [ ] **Step 5: Commit only audit documentation if a repository artifact is needed**

```bash
git add docs/specs/2026-10-29-devis-abonnements-design.md
git commit -m "docs: record quote persistence boundary"
```

Do not create this commit if no document changed.

### Task 3: Administrator quote editor and printable preview

**Files:**
- Create: `src/components/admin/quote-editor.tsx` (proposed)
- Modify: `src/components/admin/cloud-client-requests-panel.tsx`
- Create: `src/components/admin/quote-editor.test.tsx` only if a component-test setup already exists; otherwise test all domain behavior in Task 1 and run manual Preview checks.

**Interfaces:**
- Consume a selected client request from the existing admin inbox and the `QuoteDraft` / calculation / validation functions from `src/lib/quotes.ts`.
- Produce an editor state that is either a local unsaved draft or a server-confirmed saved draft; never label local-only state as centrally saved.
- The printable view must use browser print styles and must not call a paid PDF service.

- [ ] **Step 1: Define focused tests or testable component states**

Verify an administrator can edit line descriptions, quantities, unit prices, certainty, scope, exclusions, assumptions, validity, delivery estimate, payment terms, and one-time/recurring costs; totals update from structured values; incomplete fields prevent publication; an unsaved draft is clearly marked; internal notes are not part of the printable client quote.

- [ ] **Step 2: Verify relevant failures**

Run the chosen focused Vitest command before implementation; expected failures must identify missing editor behavior or validation feedback.

- [ ] **Step 3: Implement the minimum editor**

Embed the editor in the existing admin inbox, keep the responsive style consistent with current components, provide explicit saving/publishing feedback, and add a print-only quote preview. Do not activate subscriptions, payment collection, external AI, or schema mutations in this task.

- [ ] **Step 4: Verify the focused pass**

Run: `npm test`

Expected: quote domain tests and any newly added component tests pass.

- [ ] **Step 5: Run integration checks**

Run: `npm run typecheck` and `npm run build`

Expected: both commands exit successfully.

- [ ] **Step 6: Commit the passing deliverable**

```bash
git add src/components/admin/cloud-client-requests-panel.tsx src/components/admin/quote-editor.tsx
git commit -m "feat: add admin quote editor and print preview"
```

### Task 4: Versioned publication, client review, and recorded decisions

**Files:**
- Create: `app/api/admin/quotes/route.ts` (proposed)
- Create: `app/api/client/quotes/route.ts` (proposed)
- Create: `src/components/account/client-quotes-panel.tsx` (proposed)
- Modify: the existing client account page/component that currently renders request tracking; identify its exact path before editing.
- Add focused tests for quote API validation and version/status transitions using the repository's established test conventions.

**Interfaces:**
- Admin API must require `getAdminAccess()`, a valid user session/token, same-origin mutation requests, closed status values, and server-side validation.
- Client API must require the authenticated user and scope every read/write to that user's identity; never return internal admin notes.
- Publication creates a new immutable version snapshot. Client decisions must reference the exact quote id and version, include the decision and timestamp, and require a confirmation step in the UI.
- If Task 2 finds that persistence requires a schema change, this task remains blocked until the user explicitly approves and the approved additive migration is reviewed and applied.

- [ ] **Step 1: Add failing API/domain tests**

Cover unauthenticated admin and client requests; a client attempting to read or decide on another user's quote; draft visibility hidden from clients; publishing a valid version; rejection of incomplete or expired publication; accept/change-request/negotiate actions against the displayed version; stale-version decision rejection; preservation of prior published versions; internal-note isolation; and errors where the server has not confirmed the write.

- [ ] **Step 2: Verify the relevant failures**

Run the focused tests and confirm they fail for the missing route/behavior, not because of missing environment secrets.

- [ ] **Step 3: Implement authenticated versioned workflow**

Use only the approved persistence interface from Task 2. Server-check ownership, role, request origin, version and transition; return client-safe fields only. Keep quote acceptance, payment, work start, and delivery as separate states. Do not add payment providers, automatic renewals, or AI calls.

- [ ] **Step 4: Verify the focused pass**

Run the focused quote tests and the full `npm test` suite.

Expected: all quote and existing tests pass.

- [ ] **Step 5: Run integration checks**

Run: `npm run typecheck` and `npm run build`.

Expected: both commands exit successfully.

- [ ] **Step 6: Commit the passing deliverable**

```bash
git add app/api/admin/quotes/route.ts app/api/client/quotes/route.ts src/components/account/client-quotes-panel.tsx
git commit -m "feat: add versioned client quote decisions"
```

## Preview acceptance checklist

- The existing client request inbox still works and existing requests remain intact.
- An authorized administrator can create a draft and see a calculated, printable preview.
- A draft is invisible to clients until publication.
- Only the owner of a quote can read it or make a decision.
- A client decision is tied to the exact published version; older versions remain unchanged.
- Admin-only notes never appear in client responses or the printable quote.
- No UI says a quote is saved, accepted, paid, or delivered before the server confirms that exact state.
- No quote action marks a payment as received or a project as delivered.
- The external AI provider remains disabled and the full workflow is manually usable.
- `npm test`, `npm run typecheck`, and `npm run build` pass.
- The complete flow is checked on Vercel Preview only; no production promotion occurs.

## Unresolved product decisions

These decisions do not block building and testing the domain/editor foundations, but they must be resolved before real commercial publication:
- The actual price and contents of Simple, Avancé, and Premium plans, including quotas and support.
- Whether and how recurring subscriptions renew, and the user-facing cancellation/expiry policy.
- The applicable tax rates and who authorizes their use.
- Standard validity periods, delivery estimates, revision counts, warranties, and payment milestones.
- The policy for discount limits and which administrator may authorize exceptions.
- Whether the first release needs a downloadable PDF in addition to browser printing.
