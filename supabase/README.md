# Supabase — MerKora GDJ

## Important project boundary

Configure this application only against the dedicated MerKora GDJ project. Do not point it at WALL Trade. Do not reset the database.

## Current integration stage

- The migration in `migrations/` defines per-user project storage and row-level security (RLS).
- `src/lib/supabase/client.ts` creates a browser client only when public environment variables are present.
- `src/lib/supabase/project-record.ts` maps the current UI model to database rows.
- The existing interface still uses browser local storage until authentication, database migration and sync behavior have been tested end to end.

## Setup checklist

1. Verify the target Supabase project reference in the Supabase dashboard.
2. In Project Settings → API Keys, copy the **Project URL** and **publishable key**.
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` to Vercel and local `.env.local`.
4. Review and apply `migrations/202610280001_create_user_projects.sql` only to the verified MerKora GDJ database.
5. Confirm RLS is enabled and test that two separate authenticated accounts cannot read or modify each other's rows.
6. Implement and test sign-up, sign-in, sign-out, and sync before replacing local storage.
7. Never put a `service_role` or `sb_secret_...` key in browser code or any `NEXT_PUBLIC_*` variable.

No database migration is applied automatically by this repository.
