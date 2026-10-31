# MerKora GDJ — MCP OAuth with Supabase Auth

Date: 2026-10-31
Status: implementation prepared on a feature branch; not enabled or deployed.

## Decision

Use the existing MerKora GDJ Supabase Auth project as the OAuth 2.1 authorization server for the remote MCP endpoint. Supabase Auth owns authorization-code issuance, PKCE validation, token refresh/rotation, client registration, and the user approval primitives. MerKora remains the MCP resource server and exposes only explicitly listed, read-only tools.

This avoids implementing a second token issuer inside the Next.js application.

## Public endpoints

- MCP endpoint: `/api/mcp`
- Protected Resource Metadata: `/.well-known/oauth-protected-resource`
- Supabase authorization-server issuer: `https://<project-ref>.supabase.co/auth/v1`
- Supabase authorization-server discovery: `https://<project-ref>.supabase.co/.well-known/oauth-authorization-server/auth/v1`

The metadata route publishes the canonical MCP resource URL and the Supabase Auth issuer. The MCP endpoint returns a Bearer `WWW-Authenticate` challenge containing the protected-resource metadata URL when no valid access token is supplied.

Set `MERKORA_MCP_RESOURCE_URL` to the exact public HTTPS MCP endpoint URL in each deployed environment. When omitted, the metadata route derives the URL from the incoming request origin. Do not set a production URL in a preview environment.

## Authentication and data access

1. The MCP client discovers protected-resource metadata.
2. The client discovers Supabase Auth OAuth metadata and performs authorization-code + PKCE.
3. The user signs in to MerKora and explicitly approves the requesting client in the configured consent UI.
4. Supabase Auth issues an access token.
5. MerKora requires the OAuth `client_id` claim and an `aud` claim bound to the exact canonical MCP resource URL, then validates the same token through Supabase Auth's `/auth/v1/user` endpoint. The local claim parser is not treated as signature verification.
6. MerKora forwards the same user access token to PostgREST. No service-role key is used.
7. The query also filters `user_projects.user_id` to the authenticated user ID; RLS remains active as a second enforcement layer.

## Verified database facts (read-only inspection, 2026-10-31)

- `public.user_projects` exists.
- `id` and `user_id` are text and UUID respectively; `user_id` references `auth.users.id`.
- RLS is enabled.
- The SELECT policy for ordinary authenticated users restricts rows to `user_id = auth.uid()`.
- The MCP project list/detail tools only read this table and explicitly filter by the authenticated user's ID.
- The current MCP tool list contains only profile read, project list, and project detail. It does not expose quote acceptance, approvals, factory execution, database writes, deployments, or administrative actions.

Other project-memory tables also have owner/admin read policies, but they are not exposed as MCP tools. Admin privileges do not broaden MCP queries because the explicit `user_id` filter remains in place.

## Token audience binding requirement

Supabase OAuth access tokens include a `client_id` claim and use `authenticated` as their default `aud`. MerKora therefore rejects these tokens for MCP use until the Supabase Custom Access Token Hook adds the exact canonical MCP resource URL (for example, `https://merkora.com/api/mcp`) to the audience while preserving `authenticated` (for example, an audience array containing both values). Preserving `authenticated` is necessary for compatibility with Supabase APIs. The route checks both the OAuth client claim and exact resource audience before validating the token with Supabase Auth.

This is intentional fail-closed behavior: an OAuth token that is valid for Supabase generally is not automatically valid for the MerKora MCP resource. Configure and test the hook in a non-production environment first. Do not use user-editable metadata to decide authorization. The hook should distinguish OAuth issuance using the trusted `client_id` / `authentication_method` context and preserve safe defaults for ordinary user sessions.

## Important Supabase OAuth scope limitation

Supabase's currently documented OAuth scopes (`openid`, `email`, `profile`, `phone`) are identity/OIDC scopes, not custom application permissions. They do not narrow PostgREST access by themselves. OAuth access tokens otherwise carry the authenticated user's normal database role and are evaluated by RLS.

Therefore MerKora must not interpret an approved OAuth consent screen or a requested `email`/`profile` scope as authorization to read project data. Access to each exposed table must be explicitly constrained by RLS using both ownership (`auth.uid()`) and the trusted OAuth `client_id` where appropriate. The MCP route must also enforce its own read-only tool allowlist and project ownership checks. The current project-list/detail route is not production-ready until the actual `user_projects` policies have been reviewed for OAuth-token access and tested against both the owner and a second user.

Do not create broad policies such as `TO authenticated USING (auth.uid() = user_id)` as a substitute for client-specific restrictions if the requirement is to distinguish ordinary MerKora sessions from external assistants. Keep ordinary application access and OAuth-client access as separate policy paths.

## Live RLS audit (read-only inspection, 2026-10-31)

The connected Supabase project `tvwkickjtqjqwoiidmxj` was inspected without changing it.

- All 18 current public base tables have RLS enabled.
- There are no public views or materialized views in the inspected schema.
- `public.user_projects` has owner-scoped SELECT, INSERT, UPDATE and DELETE policies. Its write policies currently allow the authenticated owner to write, including a Supabase OAuth token carrying the normal `authenticated` role.
- Several other tables intentionally allow authenticated clients to submit quote decisions, payment declarations, or requests, while admin policies allow additional reads and writes. These policies are not suitable as a direct-access permission boundary for an MCP OAuth bearer token.
- The MCP HTTP route only exposes three read-only tools, but that alone does not prevent an OAuth bearer token from being reused directly against the Supabase Data API.

A review-only SQL proposal is stored at `docs/security/2026-10-31-mcp-oauth-rls-hardening-review.sql`. It adds restrictive policies so OAuth tokens (identified by the trusted `client_id` claim) can read only their own `user_projects` rows and cannot write to any public table. It also includes the Custom Access Token Hook that sets a dedicated MCP audience for OAuth authorization-code and refresh tokens.

**The SQL proposal has not been applied.** No RLS policy, hook, Auth setting, table, row, or migration history was changed in Supabase. The domain placeholder in the SQL must be replaced with the verified canonical HTTPS MCP URL before review or application.

## Required dashboard configuration before real client connections

These actions have deliberately NOT been performed:

1. Enable OAuth 2.1 Server under Supabase Authentication settings.
2. Configure the authorization path to the MerKora consent screen.
3. Decide whether dynamic client registration is enabled. If enabled, monitor registrations and require user approval.
4. Configure exact HTTPS redirect URIs / trusted client settings according to the MCP clients' current official setup requirements.
5. Configure a Custom Access Token Hook that adds the exact MCP resource URL to the OAuth token audience for approved clients while preserving `authenticated`; ordinary session tokens must not receive the MCP audience.
6. Confirm the project uses asymmetric JWT signing if OIDC ID tokens are requested.
7. Test the complete authorization, refresh, revocation, audience rejection, and cross-user isolation flow on a preview environment before production.

A first consent screen now exists at `/oauth/consent`. It displays the OAuth client name, redirect URI, requested OAuth scopes, and the read-only MerKora data currently exposed by MCP, with explicit approve/deny controls. The login page safely returns users to the pending consent request. A user page at `/account/connections` now lists OAuth grants and offers revocation using Supabase Auth grant methods. The complete flow still requires Supabase OAuth 2.1 to be enabled, the authorization path to be configured, and a real client to be registered or dynamically registered; grant management must be verified against the enabled project.

## Security and operational boundaries

- No OAuth client or client secret has been created.
- No Supabase Auth setting has been changed.
- No database schema, row, policy, or migration has been changed.
- No API key, service-role key, or OAuth secret is stored in source.
- No production deployment or merge to `main` has occurred.
- MCP transport supports the `2025-11-25` protocol version, JSON responses, and POST-only requests; server-initiated SSE is not implemented.
- OAuth tokens must be validated on every request. Tokens are never accepted in query strings.
- Do not expose new write tools until scopes, approvals, audit records, idempotency, and durable budget controls are implemented and tested.

## References

- MCP authorization specification: https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization
- Supabase MCP authentication: https://supabase.com/docs/guides/auth/oauth-server/mcp-authentication
- Supabase OAuth 2.1 setup: https://supabase.com/docs/guides/auth/oauth-server/getting-started
- Supabase OAuth flows: https://supabase.com/docs/guides/auth/oauth-server/oauth-flows
- Supabase token security and RLS: https://supabase.com/docs/guides/auth/oauth-server/token-security
