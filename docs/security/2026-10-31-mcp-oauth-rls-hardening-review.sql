-- REVIEW ONLY — NOT APPLIED TO THE LIVE DATABASE.
-- Purpose: keep every Supabase OAuth client token read-only and limit the
-- current MerKora MCP data surface to the authenticated user's own projects.
-- Before use: replace the placeholder audience with the exact HTTPS MCP URL.
-- Apply only after a reviewed backup / rollback plan and explicit approval.

-- 1) Custom Access Token Hook.
-- Supabase Auth runs this for all token issuance. Only OAuth authorization
-- code and OAuth refresh tokens with a trusted client_id receive the MCP aud.
CREATE OR REPLACE FUNCTION public.merkora_mcp_custom_access_token_hook(event jsonb)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  claims jsonb := event -> 'claims';
  oauth_client_id text;
  auth_method text := event ->> 'authentication_method';
BEGIN
  IF claims IS NULL OR jsonb_typeof(claims) <> 'object' THEN
    RAISE EXCEPTION 'Invalid access-token hook event';
  END IF;

  oauth_client_id := claims ->> 'client_id';

  IF oauth_client_id IS NOT NULL
     AND oauth_client_id = ANY (ARRAY[
       'REPLACE-WITH-APPROVED-CHATGPT-OAUTH-CLIENT-ID',
       'REPLACE-WITH-APPROVED-CLAUDE-OAUTH-CLIENT-ID'
     ]::text[])
     AND auth_method IN ('oauth_provider/authorization_code', 'token_refresh') THEN
    claims := jsonb_set(
      claims,
      '{aud}',
      jsonb_build_array('authenticated', 'https://REPLACE-WITH-VERIFIED-MERKORA-DOMAIN/api/mcp'),
      true
    );
  END IF;

  RETURN jsonb_build_object('claims', claims);
END;
$$;

REVOKE ALL ON FUNCTION public.merkora_mcp_custom_access_token_hook(jsonb) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.merkora_mcp_custom_access_token_hook(jsonb) FROM anon, authenticated;
GRANT USAGE ON SCHEMA public TO supabase_auth_admin;
GRANT EXECUTE ON FUNCTION public.merkora_mcp_custom_access_token_hook(jsonb) TO supabase_auth_admin;

-- Configure this function as the Custom Access Token Hook in Supabase Auth
-- only after replacing the audience placeholder and reviewing the function.

-- 2) user_projects remains the only table that OAuth clients can read.
-- Existing owner-based SELECT policy continues to enforce user_id = auth.uid().
-- These restrictive write policies prevent a bearer token from being reused
-- directly against PostgREST to create, edit, or delete a project.
CREATE POLICY "MCP OAuth tokens cannot insert projects"
ON public.user_projects
AS RESTRICTIVE
FOR INSERT
TO authenticated
WITH CHECK ((SELECT auth.jwt() ->> 'client_id') IS NULL);

CREATE POLICY "MCP OAuth tokens cannot update projects"
ON public.user_projects
AS RESTRICTIVE
FOR UPDATE
TO authenticated
USING ((SELECT auth.jwt() ->> 'client_id') IS NULL)
WITH CHECK ((SELECT auth.jwt() ->> 'client_id') IS NULL);

CREATE POLICY "MCP OAuth tokens cannot delete projects"
ON public.user_projects
AS RESTRICTIVE
FOR DELETE
TO authenticated
USING ((SELECT auth.jwt() ->> 'client_id') IS NULL);

-- 3) All other current public tables are denied to OAuth client tokens.
-- Direct MerKora user sessions (without client_id) keep their existing policies.
CREATE POLICY "MCP OAuth tokens cannot access client invoices"
ON public.client_invoices
AS RESTRICTIVE
FOR ALL
TO authenticated
USING ((SELECT auth.jwt() ->> 'client_id') IS NULL)
WITH CHECK ((SELECT auth.jwt() ->> 'client_id') IS NULL);

CREATE POLICY "MCP OAuth tokens cannot access client payment declarations"
ON public.client_payment_declarations
AS RESTRICTIVE
FOR ALL
TO authenticated
USING ((SELECT auth.jwt() ->> 'client_id') IS NULL)
WITH CHECK ((SELECT auth.jwt() ->> 'client_id') IS NULL);

CREATE POLICY "MCP OAuth tokens cannot access client payment reviews"
ON public.client_payment_reviews
AS RESTRICTIVE
FOR ALL
TO authenticated
USING ((SELECT auth.jwt() ->> 'client_id') IS NULL)
WITH CHECK ((SELECT auth.jwt() ->> 'client_id') IS NULL);

CREATE POLICY "MCP OAuth tokens cannot access client project launches"
ON public.client_project_launches
AS RESTRICTIVE
FOR ALL
TO authenticated
USING ((SELECT auth.jwt() ->> 'client_id') IS NULL)
WITH CHECK ((SELECT auth.jwt() ->> 'client_id') IS NULL);

CREATE POLICY "MCP OAuth tokens cannot access client quote decisions"
ON public.client_quote_decisions
AS RESTRICTIVE
FOR ALL
TO authenticated
USING ((SELECT auth.jwt() ->> 'client_id') IS NULL)
WITH CHECK ((SELECT auth.jwt() ->> 'client_id') IS NULL);

CREATE POLICY "MCP OAuth tokens cannot access client quote versions"
ON public.client_quote_versions
AS RESTRICTIVE
FOR ALL
TO authenticated
USING ((SELECT auth.jwt() ->> 'client_id') IS NULL)
WITH CHECK ((SELECT auth.jwt() ->> 'client_id') IS NULL);

CREATE POLICY "MCP OAuth tokens cannot access client quotes"
ON public.client_quotes
AS RESTRICTIVE
FOR ALL
TO authenticated
USING ((SELECT auth.jwt() ->> 'client_id') IS NULL)
WITH CHECK ((SELECT auth.jwt() ->> 'client_id') IS NULL);

CREATE POLICY "MCP OAuth tokens cannot access client requests"
ON public.client_requests
AS RESTRICTIVE
FOR ALL
TO authenticated
USING ((SELECT auth.jwt() ->> 'client_id') IS NULL)
WITH CHECK ((SELECT auth.jwt() ->> 'client_id') IS NULL);

CREATE POLICY "MCP OAuth tokens cannot access project factory evidence"
ON public.project_factory_evidence
AS RESTRICTIVE
FOR ALL
TO authenticated
USING ((SELECT auth.jwt() ->> 'client_id') IS NULL)
WITH CHECK ((SELECT auth.jwt() ->> 'client_id') IS NULL);

CREATE POLICY "MCP OAuth tokens cannot access project factory jobs"
ON public.project_factory_jobs
AS RESTRICTIVE
FOR ALL
TO authenticated
USING ((SELECT auth.jwt() ->> 'client_id') IS NULL)
WITH CHECK ((SELECT auth.jwt() ->> 'client_id') IS NULL);

CREATE POLICY "MCP OAuth tokens cannot access project factory tasks"
ON public.project_factory_tasks
AS RESTRICTIVE
FOR ALL
TO authenticated
USING ((SELECT auth.jwt() ->> 'client_id') IS NULL)
WITH CHECK ((SELECT auth.jwt() ->> 'client_id') IS NULL);

CREATE POLICY "MCP OAuth tokens cannot access project memory approvals"
ON public.project_memory_approvals
AS RESTRICTIVE
FOR ALL
TO authenticated
USING ((SELECT auth.jwt() ->> 'client_id') IS NULL)
WITH CHECK ((SELECT auth.jwt() ->> 'client_id') IS NULL);

CREATE POLICY "MCP OAuth tokens cannot access project memory brief versions"
ON public.project_memory_brief_versions
AS RESTRICTIVE
FOR ALL
TO authenticated
USING ((SELECT auth.jwt() ->> 'client_id') IS NULL)
WITH CHECK ((SELECT auth.jwt() ->> 'client_id') IS NULL);

CREATE POLICY "MCP OAuth tokens cannot access project memory decisions"
ON public.project_memory_decisions
AS RESTRICTIVE
FOR ALL
TO authenticated
USING ((SELECT auth.jwt() ->> 'client_id') IS NULL)
WITH CHECK ((SELECT auth.jwt() ->> 'client_id') IS NULL);

CREATE POLICY "MCP OAuth tokens cannot access project memory events"
ON public.project_memory_events
AS RESTRICTIVE
FOR ALL
TO authenticated
USING ((SELECT auth.jwt() ->> 'client_id') IS NULL)
WITH CHECK ((SELECT auth.jwt() ->> 'client_id') IS NULL);

CREATE POLICY "MCP OAuth tokens cannot access project memory plan versions"
ON public.project_memory_plan_versions
AS RESTRICTIVE
FOR ALL
TO authenticated
USING ((SELECT auth.jwt() ->> 'client_id') IS NULL)
WITH CHECK ((SELECT auth.jwt() ->> 'client_id') IS NULL);

CREATE POLICY "MCP OAuth tokens cannot access project resume snapshots"
ON public.project_resume_snapshots
AS RESTRICTIVE
FOR ALL
TO authenticated
USING ((SELECT auth.jwt() ->> 'client_id') IS NULL)
WITH CHECK ((SELECT auth.jwt() ->> 'client_id') IS NULL);

-- 4) Verification after an approved application:
-- - OAuth-issued token has client_id and aud = exact MCP resource URL.
-- - A direct user session has no client_id and retains normal app behavior.
-- - OAuth token SELECT on user_projects returns only rows owned by auth.uid().
-- - OAuth token INSERT/UPDATE/DELETE on user_projects is denied.
-- - OAuth token SELECT/INSERT/UPDATE/DELETE on every other table above is denied.
-- - Admin direct session continues to use existing admin policies.
-- - No service-role key is exposed to the MCP client.
