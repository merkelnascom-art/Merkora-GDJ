# MerKora GDJ — Audit read-only des accès OAuth / RLS

Date: 2026-10-31
Status: inspection only; no database or Auth settings changed.

## Project inspected

- Supabase project: `tvwkickjtqjqwoiidmxj` (Merkora GDJ, eu-west-1).
- Project status at inspection: `ACTIVE_HEALTHY`.
- Inspection methods: Supabase project/table metadata and read-only query of `pg_policies`.
- No rows were read from customer tables; no schema, policy, function, Auth setting, secret or data was modified.

## Important result

The project tables inspected have RLS enabled. However, OAuth access tokens use the normal `authenticated` role and carry a `client_id`; RLS policies that only check `auth.uid() = user_id` do not distinguish a direct MerKora browser session from an external OAuth client.

The current `public.user_projects` policies allow an authenticated owner to:
- SELECT their own projects;
- INSERT their own projects;
- UPDATE their own projects;
- DELETE their own projects.

The current policies also permit owner-side inserts in:
- `client_requests` (new client requests);
- `client_payment_declarations` (payment declarations);
- `client_quote_decisions` (quote decisions);
- `project_memory_approvals` (client-scope approvals, after its existing checks);
- `project_memory_decisions` (client decisions, after its existing checks).

These permissions may be correct for the MerKora application itself, but they are too broad to describe an external MCP access token as read-only if the same token can call the Supabase Data API directly.

Other listed write policies are administrator-only and should remain protected by their existing checks. Read policies on project memory, factory jobs and evidence are owner-or-admin scoped; they still require a specific OAuth-client review before those tables are ever exposed as MCP tools.

## Required safe design before enabling MCP OAuth

1. Configure a Supabase Custom Access Token Hook. For the intended external MCP client flow, inject a trusted claim such as `merkora_mcp_read_only: true`; preserve the default claim set for ordinary sessions. Do not derive this from user-editable metadata.
2. Add restrictive RLS policies for write commands on every exposed table where a client-side write policy currently exists. The restrictive predicate should reject the MCP read-only claim for INSERT, UPDATE and DELETE while leaving SELECT unaffected.
3. Keep the MCP server's own allowlist read-only and keep its explicit `user_id = auth.uid()` ownership filter.
4. Verify direct PostgREST write attempts with an MCP OAuth token are denied, ordinary MerKora client workflows still work, and one user cannot read another user's records.
5. Review each table and storage bucket before exposing it to MCP. Never expose factory execution, payment, approval or administration tables by default.

## Policy shape (draft only — NOT executed)

For each affected table and each write command, use a restrictive policy pattern based on the trusted hook claim. For example, the INSERT form is:

```sql
CREATE POLICY "block_mcp_read_only_insert"
ON public.user_projects
AS RESTRICTIVE
FOR INSERT
TO authenticated
WITH CHECK (
  coalesce(auth.jwt() ->> 'merkora_mcp_read_only', 'false') <> 'true'
);
```

Equivalent restrictive UPDATE policies must apply the same predicate in both `USING` and `WITH CHECK`; DELETE policies apply it in `USING`. Apply only after reviewing all permissive policies, all exposed tables and the intended OAuth client inventory. This example is not a complete migration and must not be run by itself.

## Approval gate

No RLS policies or Auth hooks have been changed. Applying the hook and restrictive policies is a Supabase security configuration/schema change and requires the owner's explicit approval. Until then, keep the MCP endpoint disabled from external clients and do not describe OAuth as production-ready.
