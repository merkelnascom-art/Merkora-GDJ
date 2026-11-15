# Supabase — MerKora GDJ

## Project boundary

Configure this application only against the dedicated MerKora GDJ Supabase project. Never point it at WALL Trade. Never reset the database.

## Foundation B status

- B1 server-side authentication actions use Supabase Auth with @supabase/ssr.
- proxy.ts refreshes auth cookies; server pages and API routes verify users with auth.getUser().
- User profiles are provisioned by a database trigger. The default role is client.
- Roles are client, collaborator, designer, developer, admin, and superadmin. A browser user cannot update their own role.
- B2 stores a full project dossier as JSONB in user_project_dossiers, isolated by owner with RLS.
- Local dossiers are saved first in browser local storage. Cloud sync is explicit and does not delete local originals.
- Version checks reject concurrent cloud updates with HTTP 409 rather than silently overwriting a newer version.

## Required configuration

1. Verify the target Supabase project reference in the Supabase dashboard. Do not use another business project database.
2. The correct Project URL and publishable key are configured in Vercel for production, preview, and development.
3. NEXT_PUBLIC_SITE_URL is configured as https://merkoragdj.vercel.app for production, preview, and development.
4. In Supabase Auth → URL Configuration, set the Site URL to https://merkoragdj.vercel.app and add /auth/callback to allowed redirect URLs. This dashboard setting still needs verification.
5. Migration 20261115192400_foundation_b_profiles_and_dossiers has been applied to the verified MerKora GDJ project (tvwkickjtqjqwoiidmxj). Both new tables have RLS enabled; existing tables and data were retained.
6. Create a test account, confirm its email, and verify sign-in/sign-out.
7. Test with two separate accounts: neither may read or update the other account dossiers.
8. Test local-first behavior with cloud unavailable, then test manual sync and conflict handling.

## Existing project storage

migrations/202610280001_create_user_projects.sql and its user_projects table are retained. The B2 universal dossier table is additive and does not replace or delete those records.

## Secrets

Never place a Supabase service_role or sb_secret key in browser code or any NEXT_PUBLIC_* variable. This implementation requires only the publishable key in public configuration. No database migration is applied automatically by the application or repository.
## Quality and dependency security

- Vitest is pinned to 5.1.0 and Vite to 8.3.7; the test runner's React JSX transform is configured in `vitest.config.ts`.
- CI runs `npm audit --audit-level=moderate` and persists the generated npm lockfile after a successful verification run.
