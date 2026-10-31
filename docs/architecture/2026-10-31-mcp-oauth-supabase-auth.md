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
5. MerKora validates the token through Supabase Auth's `/auth/v1/user` endpoint.
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

## Required dashboard configuration before real client connections

These actions have deliberately NOT been performed:

1. Enable OAuth 2.1 Server under Supabase Authentication settings.
2. Configure the authorization path to the MerKora consent screen.
3. Decide whether dynamic client registration is enabled. If enabled, monitor registrations and require user approval.
4. Configure exact HTTPS redirect URIs / trusted client settings according to the MCP clients' current official setup requirements.
5. Confirm the project uses asymmetric JWT signing if OIDC ID tokens are requested.
6. Test the complete authorization, refresh, revocation, and cross-user isolation flow on a preview environment before production.

The consent screen is a required remaining implementation step. It must show the OAuth client name, redirect URI, requested scopes, what MerKora data will be accessible, and explicit approve/deny controls. Users must later be able to revoke client access.

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
