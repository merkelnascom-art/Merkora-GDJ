# Connexions universelles bidirectionnelles Implementation Plan

> **For agentic workers:** Use the host's available task-by-task implementation workflow. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construire dans MerKora un système sécurisé permettant à la fois de connecter des services externes et d'exposer des fonctions MerKora à des applications compatibles via API et MCP.

**Architecture:** Conserver le catalogue existant et lui ajouter un registre de capacités et un gestionnaire de connexions serveur. Séparer les connexions centrales des connexions propres aux clients. Exposer d'abord des opérations MerKora en lecture seule par API authentifiée et serveur MCP, puis ajouter les actions d'écriture avec des permissions et confirmations explicites.

**Tech Stack:** Next.js 16 App Router, TypeScript, Supabase Auth/RLS existants, Vitest, GitHub Actions. Ajouter un SDK ou une dépendance MCP seulement après vérification de compatibilité avec le runtime Next.js et les clients visés.

## Global Constraints

- Les secrets et jetons ne sont jamais placés dans le navigateur, le dépôt Git, les journaux ou les réponses API.
- Les connexions de l'organisation MerKora sont distinctes des connexions propres à chaque client.
- Chaque requête vérifie l'identité, le rôle, le tenant et les scopes côté serveur.
- Les scopes OAuth sont minimaux et les actions sensibles demandent une approbation explicite.
- Aucun appel API payant ni activation de facturation sans autorisation et budget définis.
- Aucun schéma ou contenu Supabase existant ne sera modifié sans autorisation spécifique.
- Aucune fusion dans main ni déploiement de production dans ce plan.
- Une intégration n'est affichée « connectée » qu'après autorisation réelle et test non destructif.
- Les services sans API ou mécanisme officiel adapté restent en lien externe ou transfert manuel.
- ChatGPT et Claude ne peuvent utiliser les fonctions MerKora que si leur environnement prend en charge le type de connecteur publié et si l'utilisateur l'autorise.
- Les actions de lecture seule sont le premier périmètre MCP/API ; les écritures sont exclues de ce premier jalon.

---

## Repository facts and conventions

- Branche de travail observée : `feature/merkora-orchestration-v1`.
- PR ouverte observée : #7, brouillon, cible `main`.
- Catalogue actuel : `src/lib/integrations/catalog.ts`.
- Présentation d'état actuelle : `src/lib/integrations/presentation.ts`.
- Catalogue protégé actuel : `app/api/admin/integrations/route.ts`.
- Authentification serveur existante : `src/lib/server/supabase-rest.ts`.
- Autorisation administrateur actuelle : `src/lib/server/admin-access.ts`.
- Tests : Vitest via `npm test`; vérification TS via `npm run typecheck`; build via `npm run build`.
- L'écran `app/admin/integrations/page.tsx` affiche actuellement un catalogue et des boutons désactivés. Il ne représente pas encore des connexions réelles.
- Le dépôt n'a pas actuellement de dépendance MCP dédiée dans `package.json`.

## Task 1: Stabilize the shared integration contract and truthful status model

**Files:**
- Modify: `src/lib/integrations/catalog.ts`
- Modify: `src/lib/integrations/presentation.ts`
- Modify: `app/api/admin/integrations/route.ts`
- Modify: `app/admin/integrations/page.tsx`
- Test: `src/lib/integrations/catalog.test.ts`
- Test: `src/lib/integrations/presentation.test.ts`
- Create: `src/lib/integrations/connection-types.test.ts`
- Create: `src/lib/integrations/connection-types.ts`

**Interfaces:**
- Consumes: `listIntegrationCatalog(): readonly IntegrationDefinition[]`; `getIntegrationStatusPresentation(status: string): IntegrationStatusPresentation`.
- Produces: a typed lifecycle contract with statuses `not_configured`, `ready_to_connect`, `pending_authorization`, `connected`, `expired`, `error`, and `revoked`; connection metadata contains provider ID, owner scope (organization or user), granted capabilities, timestamps and safe error code only. It never contains a raw token or secret.

- [ ] **Step 1: Add focused failing tests**

Test status presentation for every lifecycle value and unknown values. Test that safe connection metadata types do not require or expose credential fields. Test that catalog definitions clearly distinguish OAuth, API-key, manual and external-link connection modes. Test that the admin catalogue count never claims a connection when none is persisted.

- [ ] **Step 2: Verify the relevant failure**

Run: `npm test -- src/lib/integrations/catalog.test.ts src/lib/integrations/presentation.test.ts src/lib/integrations/connection-types.test.ts`

Expected: the new lifecycle and metadata tests fail because the lifecycle contract and corresponding presentation states do not yet exist.

- [ ] **Step 3: Implement the minimum behavior**

Add the lifecycle union and safe metadata interface. Extend presentation labels for pending, expired, error and revoked states. Remove the hard-coded always-zero connected-count expression from the page and derive counts from actual connection data returned by the server; until persistence exists, all services remain not configured. Do not add connect buttons that imply a working OAuth/API-key flow.

- [ ] **Step 4: Verify the focused pass**

Run: `npm test -- src/lib/integrations/catalog.test.ts src/lib/integrations/presentation.test.ts src/lib/integrations/connection-types.test.ts`

Expected: all focused tests pass and unconfigured services remain clearly unconfigured.

- [ ] **Step 5: Run the affected integration check**

Run: `npm run typecheck && npm test && npm run build`

Expected: type check, all tests and production build pass.

- [ ] **Step 6: Commit the passing deliverable**

```bash
git add src/lib/integrations/catalog.ts src/lib/integrations/presentation.ts app/api/admin/integrations/route.ts app/admin/integrations/page.tsx src/lib/integrations/connection-types.ts src/lib/integrations/connection-types.test.ts
git commit -m "feat: define integration connection lifecycle"
```

## Task 2: Build the server-side connection manager and credential boundary

**Files:**
- Create: `src/lib/server/integrations/connection-manager.ts`
- Create: `src/lib/server/integrations/credential-vault.ts`
- Create: `src/lib/server/integrations/provider-adapter.ts`
- Create: `src/lib/server/integrations/connection-manager.test.ts`
- Create: `src/lib/server/integrations/credential-vault.test.ts`
- Modify: `app/api/admin/integrations/route.ts`
- Proposed future persistence migration: `supabase/migrations/<timestamp>_integration_connections.sql` (do not create or apply until separately approved)

**Interfaces:**
- `ProviderAdapter`: provider ID, `verifyConnection(credentials)`, `listCapabilities()`, and typed provider errors.
- `ConnectionManager`: `startConnection(input)`, `completeConnection(input)`, `getConnectionStatus(owner, providerId)`, `verifyConnection(owner, providerId)`, and `revokeConnection(owner, providerId)`.
- `CredentialVault`: `seal(secret)` and `open(ciphertext)`; encryption key comes only from server environment and is never returned to callers.

- [ ] **Step 1: Add focused failing tests**

Test that credential values never appear in returned connection metadata; invalid provider IDs are rejected; organization and client owners cannot read each other's connections; expired and revoked connections cannot be used; provider verification failure produces an error status without exposing provider response bodies; missing encryption configuration disables credential storage safely.

- [ ] **Step 2: Verify the relevant failure**

Run: `npm test -- src/lib/server/integrations/connection-manager.test.ts src/lib/server/integrations/credential-vault.test.ts`

Expected: tests fail because the manager and vault modules do not yet exist.

- [ ] **Step 3: Implement the minimum behavior**

Implement provider-neutral interfaces and authenticated server-only credential encryption using Node.js crypto with authenticated encryption (AES-256-GCM), unique random nonce per secret, versioned ciphertext envelope and key ID. Validate owner scope on every operation. Keep persistence behind an interface. Do not use browser storage, logs, source files or public environment variables for secrets. Do not implement OAuth callbacks until provider-specific client IDs, redirect URLs and scopes are configured.

- [ ] **Step 4: Verify the focused pass**

Run: `npm test -- src/lib/server/integrations/connection-manager.test.ts src/lib/server/integrations/credential-vault.test.ts`

Expected: isolation, encryption, revoked-state and failure-redaction tests pass.

- [ ] **Step 5: Run the affected integration check**

Run: `npm run typecheck && npm test && npm run build`

Expected: all checks pass with no Supabase schema change.

- [ ] **Step 6: Commit the passing deliverable**

```bash
git add src/lib/server/integrations app/api/admin/integrations/route.ts
git commit -m "feat: add secure integration connection manager"
```

## Task 3: Expose a versioned, read-only MerKora API for external applications

**Files:**
- Create: `app/api/v1/external/me/route.ts`
- Create: `app/api/v1/external/projects/route.ts`
- Create: `app/api/v1/external/projects/[projectId]/route.ts`
- Create: `src/lib/server/external-api/auth.ts`
- Create: `src/lib/server/external-api/scopes.ts`
- Create: `src/lib/server/external-api/rate-limit.ts`
- Create: `src/lib/server/external-api/auth.test.ts`
- Create: `src/lib/server/external-api/scopes.test.ts`
- Create: `app/api/v1/external/external-api.test.ts`

**Interfaces:**
- `authenticateExternalRequest(request): Promise<ExternalPrincipal | ApiAuthError>`.
- `ExternalPrincipal`: authenticated user/client identity, owner scope and granted scopes; never includes credentials.
- `requireScope(principal, scope): ScopeCheckResult`.
- Read scopes: `profile:read`, `projects:list`, `projects:read`.
- API responses return only fields explicitly selected for external sharing; no admin-only data, internal secrets or other tenants' data.

- [ ] **Step 1: Add focused failing tests**

Test missing, malformed, expired and revoked bearer tokens; unknown scopes; valid token with insufficient scope; user A requesting user B's project; unknown project; and response projection excluding internal/admin-only fields. Verify rate-limit rejection returns HTTP 429 with a stable safe error.

- [ ] **Step 2: Verify the relevant failure**

Run: `npm test -- src/lib/server/external-api/auth.test.ts src/lib/server/external-api/scopes.test.ts app/api/v1/external/external-api.test.ts`

Expected: tests fail because the external API authentication and route handlers do not exist.

- [ ] **Step 3: Implement the minimum behavior**

Implement bearer authentication through a dedicated external-connection token verifier, scope checks and tenant-aware read-only routes. Reuse the authenticated Supabase user's access/RLS context for project reads where possible. Do not create a long-lived token format without a separately approved persistence design. Return 401 for missing/invalid identity, 403 for insufficient scope, 404 for inaccessible resources, 429 for rate limit and 503 when required verification infrastructure is unavailable.

- [ ] **Step 4: Verify the focused pass**

Run: `npm test -- src/lib/server/external-api/auth.test.ts src/lib/server/external-api/scopes.test.ts app/api/v1/external/external-api.test.ts`

Expected: all authorization, tenant isolation and response projection tests pass.

- [ ] **Step 5: Run the affected integration check**

Run: `npm run typecheck && npm test && npm run build`

Expected: all checks pass; the API remains read-only.

- [ ] **Step 6: Commit the passing deliverable**

```bash
git add app/api/v1/external src/lib/server/external-api
git commit -m "feat: expose scoped read-only MerKora API"
```

## Task 4: Publish a read-only MCP adapter for compatible AI clients

**Files:**
- Create: `src/lib/server/mcp/merkoratools.ts`
- Create: `src/lib/server/mcp/server.ts`
- Create: `app/api/mcp/route.ts`
- Create: `src/lib/server/mcp/merkoratools.test.ts`
- Create: `src/lib/server/mcp/server.test.ts`
- Modify: `package.json` only if a maintained MCP SDK is selected after runtime compatibility review.
- Create: `docs/integrations/mcp-client-setup.md`

**Interfaces:**
- MCP tools initially exposed: `merkora_get_profile`, `merkora_list_projects`, `merkora_get_project`.
- Every tool receives an authenticated principal from the shared external API authentication layer and enforces the same read scopes.
- Tool schemas are explicit, bounded and versioned; tool output contains only data authorized for the connected user.
- The MCP transport uses a maintained protocol implementation compatible with the deployed Next.js runtime. The exact SDK/version is selected only after checking its current transport requirements.

- [ ] **Step 1: Add focused failing tests**

Test tool discovery, valid input schemas, invalid/oversized project identifiers, missing authentication, insufficient scope, inaccessible projects and safe tool error output. Confirm MCP calls cannot invoke write operations.

- [ ] **Step 2: Verify the relevant failure**

Run: `npm test -- src/lib/server/mcp/merkoratools.test.ts src/lib/server/mcp/server.test.ts`

Expected: tests fail because the MCP tool registry and transport are not implemented.

- [ ] **Step 3: Implement the minimum behavior**

Create the three read-only tools and mount them on a single MCP endpoint. Reuse the external API auth and scope enforcement; do not duplicate authorization logic. Document how an eligible ChatGPT or Claude environment can add the MCP server URL and complete its own authorization flow. State explicitly that each host platform controls its connector availability and approval process.

- [ ] **Step 4: Verify the focused pass**

Run: `npm test -- src/lib/server/mcp/merkoratools.test.ts src/lib/server/mcp/server.test.ts`

Expected: all discovery, schema, authorization and read-only boundary tests pass.

- [ ] **Step 5: Run the affected integration check**

Run: `npm run typecheck && npm test && npm run build`

Expected: all checks pass and the MCP route is included in the production build.

- [ ] **Step 6: Commit the passing deliverable**

```bash
git add src/lib/server/mcp app/api/mcp/route.ts docs/integrations/mcp-client-setup.md package.json package-lock.json
git commit -m "feat: expose read-only MerKora MCP tools"
```

## Task 5: Add external-connection administration and operational documentation

**Files:**
- Create: `app/api/admin/integrations/connections/route.ts`
- Create: `app/api/admin/integrations/connections/[providerId]/verify/route.ts`
- Create: `app/api/admin/integrations/connections/[providerId]/revoke/route.ts`
- Modify: `app/admin/integrations/page.tsx`
- Create: `src/lib/integrations/admin-view-model.test.ts`
- Create: `src/lib/integrations/admin-view-model.ts`
- Create: `docs/integrations/connection-operations.md`

**Interfaces:**
- Admin endpoints use the existing `getAdminAccess()` gate plus owner-scoped ConnectionManager operations.
- Safe admin view model includes provider name, owner scope, lifecycle status, granted capabilities, last verification time and redacted error; never credential material.
- UI actions: verify, revoke and display authorization requirements. Connect controls are shown only for providers with implemented official authorization adapters.

- [ ] **Step 1: Add focused failing tests**

Test that non-admin requests return 401/403; the UI never renders secret values; status counts match persisted statuses; revoke changes status to revoked; verify updates status based on provider result; and unimplemented providers cannot be launched through an enabled button.

- [ ] **Step 2: Verify the relevant failure**

Run: `npm test -- src/lib/integrations/admin-view-model.test.ts`

Expected: tests fail because the view model and real connection operations are not implemented.

- [ ] **Step 3: Implement the minimum behavior**

Add protected endpoints and replace the disabled catalogue-only presentation with truthful live status, verification and revocation actions. Keep connection setup disabled for providers lacking a verified adapter. Show the required permissions, external billing warning and account scope before initiating any provider authorization.

- [ ] **Step 4: Verify the focused pass**

Run: `npm test -- src/lib/integrations/admin-view-model.test.ts`

Expected: the status and admin action tests pass without exposing credentials.

- [ ] **Step 5: Run the affected integration check**

Run: `npm run typecheck && npm test && npm run build`

Expected: all checks pass.

- [ ] **Step 6: Commit the passing deliverable**

```bash
git add app/api/admin/integrations app/admin/integrations/page.tsx src/lib/integrations/admin-view-model.ts src/lib/integrations/admin-view-model.test.ts docs/integrations/connection-operations.md
git commit -m "feat: manage verified external connections"
```

## Explicit decisions still required before live credentials and production activation

1. **Credential persistence:** choose a dedicated managed secrets vault or approve a narrowly scoped Supabase migration with RLS and encrypted credential payloads. The current repository does not establish an approved durable credential store for third-party secrets.
2. **OAuth applications:** register each provider's OAuth application and approve its client IDs, redirect URLs and minimum scopes. This is provider-specific and cannot be inferred from the existing GitHub/Vercel/Supabase development connections.
3. **External API identity:** decide whether external applications connect as the signed-in user's own identity only, or whether organization-level service accounts are also offered. The implementation must preserve both scopes without sharing tokens.
4. **MCP client publication:** confirm the target ChatGPT and Claude connector setup requirements for the deployment URL and authentication method. Each host's support and review process remains independent.

## Self-review

- Both connection directions are covered: outbound provider adapters and inbound MerKora API/MCP.
- First release is explicitly read-only on the inbound side; no undocumented write capability is implied.
- Existing authentication, admin gate, Vitest commands and App Router conventions are used.
- Secrets, customer data, billing, database migrations, production deployment and merge are guarded.
- Every task has a focused red/green test, integration checks and a bounded commit.
