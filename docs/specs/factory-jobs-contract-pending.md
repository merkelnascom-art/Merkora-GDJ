# Factory job creation endpoint — pending implementation

**Status:** specification preserved; endpoint is not implemented yet.

The original Vitest file was orphaned: it imports `./route`, `@/lib/server/admin-access`, and `@/lib/server/supabase-rest`, but none of these files exist in this repository branch. This caused Vercel's TypeScript build to fail before the new MerKora orchestration work could be validated.

When implementing `POST /api/admin/projects/[projectId]/factory/jobs`, restore executable tests for these required behaviors:

1. Reject cross-origin and malformed requests before database access.
2. Require authenticated administrator access.
3. Require all three approvals — `client_scope`, `admin_review`, and `execution_authorization` — to match the exact plan and scope digests.
4. Create a queued job and five dependency-aware tasks, but do not start execution automatically.
5. Reject duplicate `correlationId` values to prevent duplicate jobs.
6. Record the requesting and authorizing administrator and preserve plan version/digests.
7. Keep execution separate from job creation; any real code generation or deployment must have explicit authorization and later verification.

No database migration or execution behavior is introduced by this note. This file preserves the intent of the orphaned tests without pretending the missing endpoint already exists.

## 8. Database inspection completed (read-only, 2026-10-31)

The connected Supabase project `tvwkickjtqjqwoiidmxj` (Merkora GDJ, eu-west-1) was inspected without changing its schema or data. The required tables already exist and have RLS enabled:

- `user_projects`: project ownership is stored in `user_id`.
- `project_memory_plan_versions`: plan version, source brief version, JSON payload, `payload_digest`, and `scope_digest`.
- `project_memory_approvals`: the three approval kinds are constrained to `client_scope`, `admin_review`, and `execution_authorization`; each row is tied to the exact plan and scope digests.
- `project_factory_jobs`: queued job metadata, plan/scope digests, requester, authorizer, approval IDs, and correlation ID.
- `project_factory_tasks`: task key, state, dependencies, evidence requirement, side-effect flag, and retry/error metadata.
- `project_memory_events`: append-only audit event structure.

The existing RLS policy for job insertion independently requires `is_merkora_admin()`, requester and authorizer equal to the authenticated user, a matching plan version/digests, and all three exact approvals. Task insertion and updates are also administrator-only. Project/job/task reads are scoped to the project owner or administrator.

The database function `public.is_merkora_admin()` currently recognizes the configured administrator email identities in the JWT. Do not replace this with a client-supplied role or editable user metadata.

**Implementation constraints discovered:**
1. Reuse the existing tables and RLS; do not create or reset tables.
2. Keep the endpoint administrator-only even though the database policy is a second enforcement layer.
3. Confirm the plan version and all three approvals match the same `project_id`, `plan_version`, `plan_digest`, and `scope_digest`; approval rows must have `decision='approved'`.
4. Preserve the original `request_id` and exact approval row IDs in the job record.
5. Job creation must remain queue-only. It must not start a worker, call an AI provider, write code, or deploy.
6. The current REST insert flow would write the job and tasks in separate requests. Before implementing it, provide a compensating rollback or a transactional database RPC; do not leave a partially created job if task creation fails. Any RPC/schema change requires separate review and explicit authorization.
7. The existing database currently reports zero rows in the plan, approval, job, task, and event tables at inspection time. No customer records were created or modified by this inspection.

This inspection is read-only. It does not implement the endpoint or authorize a schema change.

