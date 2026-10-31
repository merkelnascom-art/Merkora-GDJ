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
