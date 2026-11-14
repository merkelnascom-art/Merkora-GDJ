# Progress — project team and public access

Updated: 2026-11-12

## Completed and verified

- [x] Saved the public access and owner-managed team design.
- [x] Applied Supabase migration `20261112163528_project_team_memberships`.
- [x] Verified membership and module permission tables exist with RLS enabled.
- [x] Transactionally verified view-only, edit, ungranted-module, revocation, and rollback behavior. No probe rows remain.
- [x] Transactionally verified anonymous visitors can read active products from a published store but not inactive products. Rollback restored Asho Sweet to unpublished and left no probe products.
- [x] Added owner-only invitation, verified-email acceptance, and revocation Edge Function source; JWT verification is enabled in Supabase config.
- [x] Added generated team management UI and module-level access checks.
- [x] Added Asho Sweet staff views limited to the modules and view/edit rights selected by the owner.
- [x] Added central invitation activation page and invite-link redirect handling.
- [x] Updated generator to version 1.8.0 and added tests for the new files and access model.

## Verification in progress

- [x] Full Preview build on branch commit `48939f9acbdb917d29e5ea9fa06b6bc4809c572d`: Vercel deployment READY; `vitest run` completed without failures; TypeScript and Next.js production build completed successfully. The preview also serves `/auth/accept-invite` with HTTP 200.
- [ ] Deno check and tests for the three new Edge Functions. The GitHub workflow was updated to include them, but no fresh workflow run was available for this branch.
- [ ] Review actual invitation email delivery and Auth redirect allowlist/SMTP configuration.
- [ ] Final security review and ADR/spec reconciliation.

## Not performed

- No Edge Function deployment to the live Supabase project.
- No merge of PR #13.
- No production deployment.
- No Vercel Sandbox run.
- No deletion, reset, or modification of existing customer, product, order, or project business data.

## Remaining behavior boundaries

- Team permissions are module-level view/edit, not per-field custom permissions.
- The owner can revoke and re-invite to change an existing collaborator's grants.
- Invitations remain pending until accepted or revoked; automatic expiry is not implemented.
- Email delivery depends on Supabase Auth SMTP and an allowed redirect URL. The optional function secret `MERKORA_INVITE_REDIRECT_URL` can specify a configured redirect; otherwise Supabase uses its configured Site URL.
- Existing-account invitees can sign in to the generated app and activate their pending invitation from `/team`.
