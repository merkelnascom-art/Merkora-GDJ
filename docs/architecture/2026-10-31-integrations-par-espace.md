# MerKora GDJ — Répartition des intégrations par espace

Date: 2026-10-31
Status: mapping implemented in the feature branch; provider credentials and live connections are not configured.

## Principle

An integration is assigned only to the workspace(s) that need it. The catalog is not a claim that a provider is connected. Each adapter must declare its supported capabilities, direction, transport, owner and approval level before activation.

## Workspace mapping

| MerKora workspace | Provider tools | Purpose |
|---|---|---|
| Client | ChatGPT MCP, Claude MCP | Let the client authorize their own assistant to read permitted project information. |
| Administration | GitHub, Vercel, Supabase, Netlify, Render | Manage provider connections, project access, infrastructure status, audit and approvals. |
| Copilote IA | OpenAI, Anthropic Claude, Google Gemini, ChatGPT MCP, Claude MCP | Route analysis and assistant work to enabled providers. |
| Studio visuel | Figma, MagicPath | Prepare, review and export the visual mockup selected by the client. |
| Fabrique de projets | GitHub, Supabase, Vercel, Netlify, Render, OpenAI, Anthropic, Gemini, Codunk, WebsitePublisher, Figma, MagicPath | Orchestrate approved development tasks, tests, reviews and delivery. |
| Création média | Runway, HeyGen, CapCut | Produce and assemble media; CapCut remains a manual handoff unless an official API is verified. |

## Activation order

1. Establish the MerKora OAuth/MCP access lifecycle and the user's ability to inspect and revoke grants.
2. Verify the provider API and authorization model for each connector.
3. Connect GitHub in read-only mode first; add branch/PR write operations only after scoped authorization and explicit approval.
4. Connect infrastructure providers read-only; keep deployment and environment changes behind separate approvals.
5. Connect model providers with per-provider budgets and routing limits.
6. Connect design and media providers only after official API capabilities and billing are verified.
7. Enable factory workflows only when their required integrations are connected and each task has passed its own authorization gates.

## Security boundaries

- A user's OAuth grants are user-owned. An organization's GitHub/Vercel connection is not automatically available to every customer.
- Client project data remains tenant-scoped; no global customer access is granted to provider adapters.
- OAuth login scopes are not a substitute for application-level capabilities. MCP exposes only its declared tools.
- The current MCP tools remain read-only: profile, own-project list, own-project details.
- Production deploys, database writes, billing, secret rotation, project deletion and external publishing require separate approval.
- No provider credentials, database migrations, Supabase Auth settings, production deployments or merges to `main` are included in this mapping.
