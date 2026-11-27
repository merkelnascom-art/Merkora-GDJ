# MerKora GDJ — PCTD & IDP data model

**Status:** design specification only.  
**Target:** MerKora GDJ Supabase project `tvwkickjtqjqwoiidmxj`.  
**Scope:** additive design; no database operation is authorized or performed by this document.

## 1. Decisions and invariants

1. Catalogue, IDP and DRT remain three independent customer journeys with separate lifecycle, dossier, permissions and user experience.
2. PCTD is one shared pricing service. It is not a fourth customer journey and it does not own project dossiers.
3. Existing quote, invoice and payment tables remain the financial system of record. Do not create a parallel quote/invoice/payment subsystem.
4. A quote is calculated only from an immutable, customer-validated scope snapshot and an explicitly selected active tariff version.
5. Missing, conflicting or out-of-scope tariffs produce a provisional quote. AI must never invent a price.
6. Shared capabilities are charged at most once per quote using a stable billing key.
7. Every published quote version is immutable. Later tariff changes must not rewrite earlier quotes.
8. XOF is the stored currency code; customer-facing labels may say FCFA.
9. No automatic journey transition. Handoffs require the customer's explicit request; IDP → DRT additionally requires counselor approval.
10. No schema, policy, data, auth, deployment, payment-provider or billing changes are made as part of this specification.

## 2. Existing structures to reuse

| Existing table | Reuse |
|---|---|
| `user_projects` | DRT project identity and ownership |
| `user_project_dossiers` | Versioned universal dossier payloads |
| `project_workspace_state`, `project_workspace_events` | Validated DRT state and event history |
| `project_memory_brief_versions`, `project_memory_plan_versions` | DRT diagnosis and plan snapshots |
| `project_memory_decisions`, `project_memory_approvals` | DRT decisions and approvals |
| `project_conversation_messages` | DRT conversation only |
| `client_requests` | Shared financial-request envelope for the existing quote subsystem; not a replacement for a journey-specific dossier |
| `client_quotes`, `client_quote_versions`, `client_quote_decisions` | Canonical quote grouping, immutable published quote snapshots, client decisions |
| `client_invoices`, `client_payment_declarations`, `client_payment_reviews` | Existing invoice and payment lifecycle |
| `user_profiles` | Existing application roles; counselor permissions must be separately scoped |

Catalogue-specific storefront/order tables remain specific to those storefront workflows. They must not be repurposed as the universal MerKora offer catalogue without a separate product decision.

## 3. PCTD proposed additive tables

### 3.1 `pctd_tariff_rules`

One row represents one administratively configured tariff rule.

Suggested columns:
- `id` UUID primary key.
- `rule_key` text, stable machine identifier.
- `label` text.
- `domain_id` text nullable for global rules.
- `module_id` text nullable for domain-level rules.
- `capability_id` text nullable for a specific billable capability.
- `unit_price_xof` bigint, non-negative.
- `unit` text (e.g. forfait, heure, utilisateur, écran, module); controlled vocabulary to be finalized.
- `complexity_multipliers` JSONB object.
- `conditions` JSONB object for explicitly supported rule conditions.
- `priority` integer for deterministic precedence.
- `version` integer.
- `status` text (draft, active, retired).
- `valid_from`, `valid_until` timestamptz nullable.
- `created_by`, `updated_by` UUID references auth users.
- `created_at`, `updated_at` timestamptz.

Rule selection must be deterministic. If zero or multiple equally applicable rules match, mark the quote provisional. Never silently choose the cheapest or newest rule.

### 3.2 `pctd_tariff_history`

Append-only audit of tariff changes:
- `id` UUID primary key.
- `tariff_rule_id` UUID references `pctd_tariff_rules`.
- `rule_version` integer.
- `before_snapshot`, `after_snapshot` JSONB objects.
- `change_reason` text.
- `changed_by` UUID references auth users.
- `created_at` timestamptz.

Application roles must not update or delete history rows.

### 3.3 `pctd_quote_evaluations`

One evaluation is the PCTD's calculation record for one journey-specific source scope:
- `id` UUID primary key.
- `journey` text constrained to catalogue, idp, drt.
- `source_type` text (e.g. catalogue_order, idp_dossier, drt_project).
- `source_id` text; identifier in the owning journey's subsystem.
- `client_user_id` UUID references auth users.
- `scope_snapshot` JSONB object containing validated scope items and billing keys.
- `tariff_snapshot` JSONB object containing the exact rule versions used.
- `calculation_snapshot` JSONB object containing lines, totals, review reasons and engine version.
- `tariff_set_version` text.
- `currency` text default XOF.
- `total_amount_xof` bigint non-negative.
- `status` text (ready, provisional, superseded).
- `quote_version_id` UUID nullable references `client_quote_versions`.
- `created_at` timestamptz.

The evaluation is append-only from the perspective of client-facing application roles. A recalculation creates a new evaluation; it does not overwrite a published one.

## 4. Quote integration with existing financial tables

The current `client_quotes` table has a required, unique `request_id` foreign key to `client_requests`. This is a real integration constraint: Catalogue orders and IDP dossiers do not automatically have a `client_requests` row, while DRT has a different project identity.

Recommended adapter boundary:
- Each journey retains its own source record and lifecycle.
- When a journey requests a quote, a thin financial-request envelope is created in `client_requests` with `payload` identifying `journey`, `source_type`, `source_id` and the validated scope digest.
- This envelope is only the bridge required by the existing quote subsystem. It is not the canonical Catalogue order, IDP dossier or DRT project.
- PCTD creates/reuses the matching `client_quotes` record and publishes a frozen snapshot into `client_quote_versions`.
- `pctd_quote_evaluations.quote_version_id` points to the exact published version.
- Client acceptance/refusal remains in `client_quote_decisions`; invoicing and payment remain in the existing tables.

Before implementation, inspect the existing quote API and RLS policies to confirm that this envelope can be created safely and that the current one-quote-per-request constraint matches the intended revision workflow. If it does not, prepare a narrowly scoped additive migration rather than weakening constraints.

## 5. IDP proposed additive tables

### 5.1 `idp_assistance_requests`

A separate human-assistance case:
- `id` UUID primary key.
- `client_user_id` UUID references auth users.
- `subject` text.
- `initial_description` text.
- `status` text (submitted, assigned, in_conversation, dossier_review, awaiting_client_validation, quote_ready, accepted, declined, completed, cancelled).
- `priority` text.
- `assigned_counselor_id` UUID nullable references auth users.
- `created_at`, `updated_at`, `closed_at` timestamptz nullable.

Assignment is an administrative/counselor action. The client can create and read their own case, but cannot assign a counselor or change internal workflow state.

### 5.2 `idp_conversation_messages`

Dedicated client-counselor communication:
- `id` UUID primary key.
- `request_id` UUID references `idp_assistance_requests`.
- `sender_user_id` UUID references auth users.
- `sender_kind` text (client, counselor, admin, system).
- `body` text.
- `attachment_refs` JSONB array of storage object references; never store public unrestricted file URLs.
- `created_at` timestamptz.
- `read_at` timestamptz nullable.

Messages are append-only. Editing/deletion policy and retention period require a separate privacy decision.

### 5.3 `idp_dossier_versions`

Versioned structured assistance dossier:
- `id` UUID primary key.
- `request_id` UUID references `idp_assistance_requests`.
- `version` integer.
- `payload` JSONB object: facts, client-confirmed requirements, counselor interpretations, unresolved questions, proposed functions, roles, workflows and constraints.
- `payload_digest` text.
- `created_by` UUID references auth users.
- `created_at` timestamptz.
- `validated_by_client_at` timestamptz nullable.
- `client_validation_note` text nullable.

Each revision is a new row. Client validation binds to one exact version and digest. AI suggestions must be visibly distinguished from client-confirmed facts.

## 6. Authorization and RLS model

RLS must be designed and tested before any migration is applied.

| Actor | PCTD tariffs | Quote evaluation | IDP case/messages/dossier |
|---|---|---|---|
| Anonymous | No access | No access | No access |
| Client | Read only active tariff presentation if product policy allows; no direct writes | Read own published outcome only | Read/create own case; read own messages; send client messages; read dossier; validate own version |
| Assigned counselor | No tariff writes | Read only quote context needed for assigned case | Access only assigned cases; add counselor messages and dossier versions |
| Admin/superadmin | Manage tariffs subject to audited writes | Manage/review authorized evaluations | Assign counselors and manage workflow |
| AI/service role | No browser exposure; narrowly scoped server-side use | Create evaluation through server-side boundary | Draft assistance material only when explicitly enabled; never impersonate client validation |

Do not infer counselor authority merely from the broad `designer` or `admin` profile role. Define an explicit authorization helper or assignment check. Never expose service-role credentials to the browser.

## 7. Application interfaces

Recommended pure/service boundaries:
- `resolveApplicableTariffs(scope, tariffSet)` — returns exact matches plus ambiguity/missing reasons.
- `buildAutomaticQuote(input)` — existing pure engine; preserve deterministic XOF calculation and review semantics.
- `createQuoteEvaluation(journeySource, validatedScope)` — server-only orchestration; persists an immutable evaluation.
- `publishQuoteVersion(evaluation)` — server-only adapter into existing quote tables.
- `createIdpRequest(input)` — authenticated client request creation.
- `assignIdpCounselor(requestId, counselorId)` — authorized admin operation.
- `appendIdpMessage(requestId, message)` — participant/assignment-scoped append.
- `createIdpDossierVersion(requestId, payload)` — assigned counselor or authorized admin only.
- `validateIdpDossierVersion(requestId, versionId, digest)` — client-only validation of the exact visible version.

All service operations must verify identity server-side with the authenticated user, not trust client-supplied user IDs or role labels.

## 8. Implementation sequence

1. **Read-only compatibility review:** inspect current quote creation, publishing, RLS policies, admin role checks, storage buckets and existing API routes. No writes.
2. **PCTD domain layer:** tariff resolution, immutable tariff snapshots, duplicate billing protection, deterministic rounding and calculation tests. No database dependency.
3. **PCTD persistence migration proposal:** three additive tables above, indexes, constraints, RLS and grants. Review SQL and test on an isolated Supabase branch before any production application.
4. **Quote adapters:** connect Catalogue, IDP and DRT to the one existing quote/invoice/payment subsystem. Ensure source journey remains explicit.
5. **IDP domain layer:** state transitions, assignment authorization, messages, dossier versioning and tests.
6. **IDP persistence migration proposal:** three additive tables, RLS, indexes and storage policies. Validate cross-account isolation.
7. **Admin and client UI:** tariff management, quote display, counselor queue, messaging and dossier validation.
8. **End-to-end verification:** test all three journeys independently, all voluntary handoffs, tariff edge cases, RLS isolation, quote immutability, and payment lifecycle regression.

## 9. Required test matrix

### PCTD
- Exact tariff match; no match; duplicate/ambiguous match; domain/module mismatch.
- Included capability; billable capability; manual-review capability.
- Shared billing key across modules is charged once.
- Missing multiplier, invalid quantity, negative/unsafe amount and integer overflow.
- Tariff version changes after quote publication do not mutate the old quote.
- Catalogue, IDP and DRT each preserve source journey and source identifier.
- Provisional quote cannot be accepted as a final priced offer.

### IDP
- Client A cannot read Client B's request, messages, dossier or attachments.
- Unassigned counselor cannot read another counselor's case.
- Assigned counselor can communicate and create dossier versions.
- Counselor cannot impersonate client validation.
- Client can validate only the exact dossier version presented.
- Assignment and workflow changes are auditable.
- IDP never silently opens a DRT session.

### Regression and operations
- Existing Catalogue orders continue to work.
- Existing DRT dossier recovery remains journey-filtered.
- Existing quote decision, invoice and payment review behavior remains intact.
- No production deployment or real payment is part of this implementation tranche.

## 10. Open product decisions before production

1. Tariff units and rounding policy for fractional quantities or time-based work.
2. Whether clients can see the complete active tariff catalogue or only quote line items.
3. Counselor eligibility and whether a dedicated counselor permission/role is needed beyond existing profile roles.
4. Attachment types, maximum sizes, retention and deletion/export policy.
5. Whether provisional quotes are visible to clients as estimates or remain internal until reviewed.
6. Quote validity defaults and who may extend them.
7. Whether an IDP dossier can be exported/shared before client validation.

These decisions do not block the pure PCTD engine or isolated IDP state-machine implementation, but they must be settled before production release.


## 11. Implemented tariff registry foundation

The branch now contains `src/lib/merkora-core/tariff-registry.ts`, a pure domain module with no database or browser dependency.

It provides:
- Admin-authored tariff metadata: capability, domain/module scope, billing mode, XOF unit price, unit label, complexity coefficients, status, validity dates and version.
- Validation for required identifiers, safe integer XOF prices, positive coefficients, included-price consistency, duplicate IDs and real calendar dates.
- Deterministic resolution for one active tariff on a requested date.
- Explicit `missing`, `ambiguous` and `invalid_date` outcomes. The resolver never selects a cheapest, newest or first match silently.
- Draft and archived rules are excluded from quote resolution.

The corresponding `tariff-registry.test.ts` covers valid rules, invalid amounts, included-price rules, duplicate IDs, exact matching, validity periods, ambiguity, explicit rule selection, inactive rules and invalid dates.

This is deliberately a domain foundation, not a completed admin screen or persistent tariff catalogue. No tariff values are seeded as official MerKora prices. The next integration step is to map a validated resolved rule into the existing quote engine, then add authenticated persistence and a protected admin interface after the additive migration and RLS design are approved.


## 12. Read-only admin authorization review (2026-11-27)

The application and database authorization paths were inspected without changing the project:

- `proxy.ts` refreshes the Supabase session with `auth.getUser()`, but it does not reject unauthenticated requests or enforce an admin role. Session refresh is not route authorization.
- `src/lib/supabase/server.ts` creates a cookie-aware server client with the publishable key. This is appropriate as a user-scoped client, but it does not itself establish admin authority.
- No `app/admin/page.tsx` or `app/admin/layout.tsx` was present at the inspected branch paths. The public home page exposes the customer Catalogue, IDP and DRT routes; it does not expose a protected tariff console.
- The database currently has two different email-based admin authorization patterns. The `public.is_merkora_admin()` function returns true only when the JWT email equals `merkelnascom@gmail.com`. Separately, 14 RLS policies across 8 tables compare the JWT email directly and include both `merkelnascom@gmail.com` and `wdesk87@gmail.com` in some financial/payment rules; other quote/request policies accept only the first address.
- In the inspected policy set, 29 policies across 16 tables call `is_merkora_admin()`, while 14 policies across 8 tables use direct email comparisons. This creates inconsistent authorization: an identity accepted by some payment/invoice policies may not be accepted by quote/request policies or by the shared helper.

### Security decision

Do not build or expose the tariff-management UI against this mixed authorization state. Do not copy either email allowlist into a new application helper. Before the admin console or tariff writes are enabled, define one canonical, server-verified admin authorization source (prefer a protected database role/claim in `app_metadata`, not user-editable `user_metadata`), migrate all relevant RLS policies consistently, and verify server routes with `auth.getUser()` plus that canonical authorization check. Keep all tariff mutations behind server-side operations and retain RLS as the database boundary.

This review is observational only. No auth users, functions, policies, tables, grants, application files, or data were changed. The tariff registry remains a pure in-branch domain module; no persistent tariff rules or official prices have been created.
