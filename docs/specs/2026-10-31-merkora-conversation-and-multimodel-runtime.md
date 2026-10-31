# MerKora GDJ — conversation engine and multi-model runtime

Date: 2026-10-31  
Branch: `feature/admin-preview-secure-access`

## Purpose

Build MerKora's own conversation and orchestration layer. The product must understand a client's problem before proposing modules, distinguish confirmed requirements from assumptions, ask questions when information is missing, and never treat a model suggestion as client or admin approval.

## Implemented in this slice

- `src/lib/assistant/merkora-conversation.ts`: deterministic, provider-free first-pass analysis, bounded input/history, clarification questions and initial module suggestions.
- `app/api/projects/[projectId]/assistant/route.ts`: same-origin POST, authenticated owner check against the requested project, bounded payload, no-store response. It does not call external models or persist conversation history.
- `src/components/assistant/merkora-assistant-panel.tsx`: project workspace chat panel with a local fallback when the project is not yet synchronized or the online service is unavailable.
- `src/lib/assistant/assistant-runtime.ts`: server-side runtime configuration recognizes OpenAI and Anthropic model IDs through the existing Vercel AI Gateway adapter. External models are disabled unless `MERKORA_AI_ENABLED=true` and a valid model/credential are configured.
- `src/lib/assistant/assistant-provider.ts`: structured, bounded, consent-gated provider adapter. It treats model output as untrusted data and never performs tools, writes, code execution, deployment, or approvals.
- Tests cover clarification, module suggestions, input bounds, project ownership, runtime selection, consent gates and malformed provider output.

## External-model gates

The provider adapter requires all of:
1. The server runtime is explicitly enabled and configured.
2. The user explicitly requests external-model processing.
3. The client has granted consent for the processing.
4. An administrator has authorized the potential spend.

No external model call should be added to the customer chat route until consent is recorded in a durable, project-scoped record and the admin authorization mechanism is implemented and audited. Do not infer consent from a checkbox on a different screen, from account role, or from model availability.

## Model configuration

- `MERKORA_AI_ENABLED=false` by default.
- `MERKORA_ASSISTANT_MODEL=openai/<model-id>` or `anthropic/<model-id>`.
- `AI_GATEWAY_API_KEY` or supported server-side Vercel OIDC credential.
- Credentials must remain server-side and must never be exposed to client components or logs.

The adapter uses a provider-neutral interface. The model's own licensed API capabilities may be used, but MerKora does not inherit hidden proprietary model weights or private knowledge. MerKora's durable memory and future retrieval system must use authorized documents, explicit project scope and provenance.

## Current limitations

- The first-pass local engine is keyword/rule based, not a full LLM.
- Conversation history is bounded in the request but not durably stored.
- The external provider adapter is implemented and tested separately but is not wired into the customer endpoint.
- No RAG/knowledge base, autonomous code execution, self-repair worker or delivery automation is enabled by this slice.
- No AI provider was called as part of implementation or testing; no credits were consumed.
- No production deployment was made and no existing Supabase data was reset or deleted.

## Next safe milestones

1. Add a durable, append-only conversation record scoped to project and owner, with retention/export/delete rules.
2. Add a dedicated client consent record for external-model processing and a separate admin spend authorization with expiry and model/budget limits.
3. Add rate limits, request IDs, token/cost budgets, redacted observability and model fallback policy.
4. Wire the provider adapter only after the consent and spend records can be verified server-side.
5. Add authorized-document retrieval with source citations and prompt-injection boundaries.
6. Connect conversation conclusions to versioned plans; never let chat mutate the approved scope without a new plan version and approval.
7. Keep code generation, sandbox builds, repair loops and delivery approvals in separate auditable factory tasks.
