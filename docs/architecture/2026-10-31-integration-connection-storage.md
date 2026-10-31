# MerKora GDJ — Stockage durable des connexions fournisseurs

Date: 2026-10-31
Status: architecture review only; no database objects or credentials created.

## Why this is required

The current `createConnectionManager` is deliberately in-memory. It is suitable for isolated tests, but a restart loses the connection state. Real provider tokens must not be stored in browser storage, source control, plaintext database columns, or logs.

The next provider-connection stage therefore requires a durable server-side repository and a credential vault. The existing AES-256-GCM envelope in `src/lib/server/integrations/credential-vault.ts` is the encryption primitive; it is not yet connected to persistence.

## Ownership model

Each connection belongs to exactly one owner:
- `organization`: a MerKora-controlled provider account shared by approved internal workspaces.
- `user`: a provider account connected by one MerKora user.
- `customer`: a provider account belonging to one customer tenant.

A workspace assignment is not an ownership grant. A provider connection assigned to Administration and Project Factory is still unavailable to the factory unless the owner, project scope, capabilities and execution approval all match.

## Proposed tables

### `public.integration_connections`

Safe metadata only:
- `id uuid primary key`
- `owner_type text check in ('organization','user','customer')`
- `owner_id text not null`
- `provider_id text not null`
- `status text check in ('ready_to_connect','pending_authorization','connected','expired','error','revoked')`
- `granted_capabilities jsonb not null default '[]'`
- `created_at`, `updated_at`, `last_verified_at`
- `safe_error_code text null`
- unique key on `(owner_type, owner_id, provider_id)`

### `public.integration_credentials`

Encrypted provider credentials, never returned to clients:
- `connection_id uuid primary key references integration_connections(id)`
- `envelope_version text not null`
- `key_id text not null`
- `encrypted_payload text not null`
- `created_at`, `updated_at`, `expires_at timestamptz null`

The payload contains only provider token material required by that adapter. Encrypt the complete serialized payload using AES-256-GCM with a random nonce and authenticated associated data including connection ID, provider ID and envelope version. The master key is a server-only Vercel environment secret, not a Supabase column or public environment variable. Key rotation must support old key IDs until re-encryption is complete.

### `public.integration_connection_events`

Append-only audit:
- `id uuid primary key`
- `connection_id uuid references integration_connections(id)`
- `actor_user_id uuid null`
- `event_type text`
- `safe_metadata jsonb`
- `created_at timestamptz`

Never write tokens, authorization codes, secrets, full provider error bodies, or sensitive request payloads to this table.

## Database access boundary

- Enable RLS on all three tables.
- Do not grant `anon` or `authenticated` direct SELECT/INSERT/UPDATE/DELETE access to credential rows.
- Read/write credentials only from server-side code using a dedicated server credential. Never expose a service-role or secret key to a browser.
- Admin UI calls a server route that returns only safe metadata and capabilities, never ciphertext or tokens.
- Every operation verifies owner type/id, provider, status and requested capability server-side.
- Audit rows are append-only to application code; only a controlled server path may insert.
- Do not reuse the OAuth MCP user token as a credential for outbound providers.

## Connection lifecycle

1. Admin or user requests a provider connection for a specific owner and workspace.
2. MerKora creates a short-lived state + PKCE verifier, binds it to the owner/provider/redirect URI, and stores it server-side.
3. Provider authorization runs with exact redirect URI and minimum scopes.
4. Callback validates state, exchanges the code server-side, fetches the provider identity, and stores encrypted credentials.
5. MerKora runs a read-only verification call and records safe status.
6. Workspace adapters may use only declared capabilities on a connected record.
7. Expiry, provider revocation or explicit disconnect updates status and blocks use immediately.
8. Revocation attempts provider-side token revocation where supported, then deletes encrypted credentials and appends an audit event.

## Workspace consumption rules

- Administration: manage connections, owners, health, audit and approval policies.
- Project Factory: use GitHub, infrastructure, design and AI adapters only for the approved project tasks.
- Copilote IA: route model requests to enabled AI providers with per-provider and per-project budgets.
- Studio visuel: use only the design capabilities selected in the client's validated brief.
- Création média: use verified generation APIs; CapCut remains manual handoff until official API support is verified.
- Espace client: view and revoke their own inbound OAuth grants; it does not receive organization provider secrets.

## Explicitly deferred

No tables, policies, migrations, credentials, provider OAuth apps, environment secrets, or production deployments have been created. The SQL/RLS design must be reviewed and approved before implementation. First provider candidate after storage approval: GitHub read-only repository access, then pull-request creation only behind a separate approval.


## Cryptographic context binding update (2026-10-31)

The AES-256-GCM vault now authenticates the connection identifier and provider identifier as additional authenticated data, in addition to the envelope version and key identifier. A ciphertext copied from one provider connection cannot be decrypted in the context of another connection/provider pair. The context is supplied by trusted server-side metadata and is not read from a client request.

The vault remains a cryptographic primitive only: no database persistence, key rotation workflow, OAuth callback, or production secret has been configured. The API requires the caller to pass the exact connection context to both `seal` and `open`.
