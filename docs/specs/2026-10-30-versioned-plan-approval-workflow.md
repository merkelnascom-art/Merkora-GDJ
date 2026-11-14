# MerKora GDJ — Versioned Plan Approval Workflow

**Status:** Proposed design; not implemented  
**Date:** 2026-10-30  
**Scope:** Design only. No database migration, data write, queue, or deployment is authorized by this document.

## 1. Decision

MerKora must own the complete lifecycle of every customer project plan. A generated plan is a draft, not customer consent. MerKora must store immutable plan versions and separately record explicit approvals before any future factory job can begin.

The browser is never the authority for approvals. Server-side code must verify the signed-in actor, role, project ownership, exact plan version, exact approved scope, and current plan status from trusted persisted records.

## 2. Current baseline

The preview branch now contains:
- a deterministic, provider-free plan generator;
- a structured comparison between plan versions;
- an authenticated, same-origin preview endpoint that reads only the signed-in user's project and does not write;
- a plan preview in the project workspace;
- a pure fail-closed readiness gate requiring a review-ready plan, no open questions, confirmed scope, acceptance criteria, and explicit approval state.

The preview remains non-persistent. Browser-local Studio preferences are not a durable record of customer consent. No code-generation worker is connected.

## 3. Lifecycle

```text
Project brief vN
    |
    v
MerKora planner -> Draft plan vN
    |
    v
Client reviews exact scope + questions
    |                 \
    | approve          \ request changes
    v                   v
Server records approval  Brief/scope changes -> new draft plan version
for exact plan version        |
    |                         +-> previous approval is not reused
    v
Admin review / execution authorization (policy-controlled)
    |
    v
Server revalidates plan + scope + approvals
    |
    v
Future factory job manifest -> isolated sandbox -> tests/evidence
    |
    v
Human review before external side effects or delivery
```

Any change to the brief, selected options, scope, tasks, acceptance criteria, architecture, or material estimate creates a new plan version or invalidates the relevant approval. Previous versions remain available for audit and comparison; they are never silently overwritten.

## 4. Proposed logical records

These are conceptual records only. Do not create them until the schema, RLS, and retention policy have been reviewed.

### Project plan version
- id: immutable record identifier.
- project_id: owning project reference.
- version: monotonic version within the project.
- source_brief_version: version of the brief used as input.
- planner_version: generator version used.
- status: draft, needs_clarification, ready_for_review, approved, superseded.
- plan_json: validated structured plan.
- plan_digest: server-computed digest of canonicalized plan content.
- created_by: actor/system identity responsible for generation.
- created_at: server timestamp.
- supersedes_plan_id: optional prior plan version.

Unique constraint: one record per (project_id, version). A plan record must not be updated to change its content after creation; lifecycle metadata may be represented separately.

### Plan approval
- id: immutable approval identifier.
- project_id and plan_id: exact project and plan version approved.
- actor_user_id and actor_role: server-verified identity and role.
- approval_kind: client_scope, admin_review, execution_authorization.
- approved_scope_digest: server-computed digest of the exact included scope.
- plan_digest: digest of the exact plan version approved.
- decision: approved or changes_requested.
- comment: optional bounded note.
- created_at: server timestamp.
- request_id: audit correlation identifier.

Approval records are append-only. A later change is a new decision record, not an update to the old one. The server must reject approval attempts if the submitted plan or scope digest does not match the current persisted version.

### Factory execution record (future)
- id, project_id, plan_id, plan_digest, scope_digest.
- requested_by, authorized_by, and the verified approval IDs.
- status, timestamps, bounded resource limits, sandbox reference.
- artifact references, test results, repair attempts, and final review result.
- audit correlation ID and sanitized error information.

The factory must not accept arbitrary commands, secrets, deployment credentials, or unbounded work supplied by a customer.

## 5. Approval policy

Proposed default for the first implementation:
1. Client confirms the exact included scope and accepts the draft plan.
2. MerKora admin reviews the plan, estimate assumptions, risk and required integrations.
3. Server independently checks the persisted approval records and exact plan/scope digests.
4. Only then may a future sandbox execution be queued.
5. Production deployment, payments, external communications, destructive changes, and handling of sensitive data remain separate explicit approval gates.

Do not treat clicking “approve mockup”, accepting a quote, launching a project, or declaring a Mobile Money payment as interchangeable with approval to execute code. Existing commercial and payment workflows must remain unchanged.

## 6. Security and privacy requirements

- Enforce project ownership and role authorization on every read/write route.
- Do not use a service-role key for ordinary user-scoped operations.
- Derive actor identity and role on the server; ignore actor IDs or roles submitted by the browser.
- Validate and canonicalize plan data before calculating a digest.
- Use a cryptographic digest computed server-side; do not trust a digest supplied by the client.
- Add rate limits and request-size limits to generation and approval endpoints.
- Keep plan content private to authorized project participants and administrators.
- Minimize stored personal information; define retention and deletion rules before migration.
- Do not send project briefs to an external AI provider until the provider, data policy, and spending ceiling are explicitly approved.
- Keep a tamper-evident audit trail for approvals and execution attempts.
- Fail closed if plan version, scope digest, project ownership, approval or audit persistence cannot be verified.

## 7. API shape to evaluate

Possible routes, not implemented:
- POST /api/projects/:projectId/plans — generate and persist a new draft from a validated current brief.
- GET /api/projects/:projectId/plans — list authorized versions and status.
- GET /api/projects/:projectId/plans/:planId — read one authorized immutable plan.
- POST /api/projects/:projectId/plans/:planId/approval — record a decision for an exact version and scope.
- POST /api/projects/:projectId/plans/:planId/execution-request — request execution; server verifies all approvals before enqueueing.
- GET /api/projects/:projectId/executions/:executionId — inspect authorized progress and evidence.

Each route needs schema validation, same-origin protection where appropriate, authorization, rate limits, audit logging, and tests for cross-user access and stale approvals.

## 8. Migration and rollout sequence

1. Read-only inspection of current Supabase schema and RLS policies.
2. Confirm the actual ownership model and admin-role source.
3. Decide plan retention, deletion, and audit-history policy.
4. Design tables, constraints, indexes, RLS policies, and rollback plan.
5. Add migration tests and authorization tests without modifying existing data.
6. Obtain explicit approval before applying any migration to a shared Supabase project.
7. Implement persistence in preview only; do not deploy production.
8. Add end-to-end tests for stale approvals, changed scope, unauthorized actors, and interrupted writes.
9. Connect a bounded sandbox worker only after persistence and approvals are verified.

## 9. Acceptance tests before implementation is declared complete

- Client A cannot read or approve Client B's plan.
- A client cannot submit a different actor ID or claim an admin role.
- Approval of plan v1 does not authorize plan v2.
- A scope change invalidates the old scope digest and blocks execution.
- Missing, stale, conflicting, or unreadable approval records block execution.
- Duplicate approval submissions are safely handled with idempotency.
- A failed write cannot leave the system reporting an approval that was not persisted.
- A queued job retains the exact approved plan/scope digest.
- All actions produce an audit record without exposing secrets or excessive personal data.
- Existing quote, payment, project launch, and user data remain unchanged.

## 10. Open decisions

- Is admin review mandatory for every project category, or can low-risk projects use a lighter path?
- Which existing role source is authoritative for MerKora admins?
- How long should superseded plans, approval records, and execution artifacts be retained?
- Which initial project categories are allowed to enter sandbox code generation?
- What resource/time limits and allowed toolchain should the first sandbox enforce?
- Who may authorize any external side effect or production deployment?

**Implementation boundary:** This design does not authorize migrations, database writes, external AI, a job queue, paid resources, or production deployment. The current preview route remains read-only until a separate implementation plan is reviewed and approved.
