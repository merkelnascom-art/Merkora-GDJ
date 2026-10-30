-- Add an explicit, immutable client consent flag for external AI processing.
-- Existing approval rows remain false; no client consent is inferred retroactively.
alter table public.project_memory_approvals
  add column if not exists ai_processing_consent boolean not null default false;

comment on column public.project_memory_approvals.ai_processing_consent is
  'Explicit client authorization to send this exact approved project brief and generated code to an external AI provider for implementation.';
