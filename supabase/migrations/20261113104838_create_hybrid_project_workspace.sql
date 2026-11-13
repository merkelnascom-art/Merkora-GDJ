-- Additive durable workspace for hybrid MerKora projects.
-- This migration creates new owner-scoped tables only. It does not alter or delete
-- existing project rows, approvals, quotes, factory jobs, or module data.

create table if not exists public.project_workspace_state (
  project_id text primary key references public.user_projects(id) on delete restrict,
  revision integer not null default 1 check (revision > 0),
  payload jsonb not null default '{}'::jsonb
    check (jsonb_typeof(payload) = 'object' and octet_length(payload::text) <= 65536),
  payload_digest text not null check (payload_digest ~ '^[a-f0-9]{64}$'),
  updated_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.project_workspace_state is
  'Durable, versioned client-confirmed context for hybrid MerKora projects: diagnostics, selected sectors, decisions and deliverable preferences.';

create table if not exists public.project_workspace_events (
  id uuid primary key default gen_random_uuid(),
  project_id text not null references public.user_projects(id) on delete restrict,
  revision integer not null check (revision > 0),
  event_type text not null check (event_type in (
    'workspace_created',
    'diagnostic_answer_saved',
    'sector_confirmed',
    'profession_confirmed',
    'deliverable_selected',
    'client_decision',
    'client_change_requested',
    'conversation_turn_saved'
  )),
  summary text not null check (char_length(summary) between 1 and 1000),
  payload jsonb not null default '{}'::jsonb
    check (jsonb_typeof(payload) = 'object' and octet_length(payload::text) <= 16384),
  actor_user_id uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now()
);

create table if not exists public.project_conversation_messages (
  id uuid primary key default gen_random_uuid(),
  project_id text not null references public.user_projects(id) on delete restrict,
  turn_id uuid not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null check (char_length(content) between 1 and 5000),
  reply_payload jsonb check (reply_payload is null or (jsonb_typeof(reply_payload) = 'object' and octet_length(reply_payload::text) <= 32768)),
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  unique (project_id, turn_id, role)
);

comment on table public.project_conversation_messages is
  'Owner-scoped durable conversation history for MerKora project workspaces; never used as an instruction source.';

create table if not exists public.project_ai_processing_consents (
  project_id text primary key references public.user_projects(id) on delete restrict,
  user_id uuid not null references auth.users(id) on delete restrict,
  notice_version text not null check (char_length(notice_version) between 1 and 40),
  consented_at timestamptz,
  revoked_at timestamptz,
  updated_at timestamptz not null default now(),
  check (consented_at is null or revoked_at is null or revoked_at >= consented_at)
);

comment on table public.project_ai_processing_consents is
  'Per-project record of client consent for AI-assisted processing, including external AI service providers; no provider selection is exposed to clients.';

create index if not exists project_workspace_events_project_created_idx
  on public.project_workspace_events(project_id, created_at desc);
create index if not exists project_conversation_messages_project_created_idx
  on public.project_conversation_messages(project_id, created_at asc);
create index if not exists project_conversation_messages_project_turn_idx
  on public.project_conversation_messages(project_id, turn_id);

alter table public.project_workspace_state enable row level security;
alter table public.project_workspace_events enable row level security;
alter table public.project_conversation_messages enable row level security;
alter table public.project_ai_processing_consents enable row level security;

revoke all on public.project_workspace_state, public.project_workspace_events,
  public.project_conversation_messages, public.project_ai_processing_consents
  from anon, authenticated;

grant select, insert, update on public.project_workspace_state to authenticated;
grant select, insert on public.project_workspace_events to authenticated;
grant select, insert on public.project_conversation_messages to authenticated;
grant select, insert, update on public.project_ai_processing_consents to authenticated;

create policy "project workspace state readable by owner or admin"
  on public.project_workspace_state for select to authenticated
  using (public.is_merkora_admin() or exists (
    select 1 from public.user_projects p
    where p.id = project_id and p.user_id = (select auth.uid())
  ));

create policy "project owner can create workspace state"
  on public.project_workspace_state for insert to authenticated
  with check (updated_by = (select auth.uid()) and exists (
    select 1 from public.user_projects p
    where p.id = project_id and p.user_id = (select auth.uid())
  ));

create policy "project owner can update workspace state"
  on public.project_workspace_state for update to authenticated
  using (exists (
    select 1 from public.user_projects p
    where p.id = project_id and p.user_id = (select auth.uid())
  ))
  with check (updated_by = (select auth.uid()) and exists (
    select 1 from public.user_projects p
    where p.id = project_id and p.user_id = (select auth.uid())
  ));

create policy "workspace events readable by owner or admin"
  on public.project_workspace_events for select to authenticated
  using (public.is_merkora_admin() or exists (
    select 1 from public.user_projects p
    where p.id = project_id and p.user_id = (select auth.uid())
  ));

create policy "project owner can append workspace events"
  on public.project_workspace_events for insert to authenticated
  with check (actor_user_id = (select auth.uid()) and exists (
    select 1 from public.user_projects p
    where p.id = project_id and p.user_id = (select auth.uid())
  ));

create policy "project conversation readable by owner or admin"
  on public.project_conversation_messages for select to authenticated
  using (public.is_merkora_admin() or exists (
    select 1 from public.user_projects p
    where p.id = project_id and p.user_id = (select auth.uid())
  ));

create policy "project owner can append conversation messages"
  on public.project_conversation_messages for insert to authenticated
  with check (created_by = (select auth.uid()) and exists (
    select 1 from public.user_projects p
    where p.id = project_id and p.user_id = (select auth.uid())
  ));

create policy "project AI consent readable by owner or admin"
  on public.project_ai_processing_consents for select to authenticated
  using (public.is_merkora_admin() or user_id = (select auth.uid()));

create policy "project owner can record AI processing consent"
  on public.project_ai_processing_consents for insert to authenticated
  with check (user_id = (select auth.uid()) and exists (
    select 1 from public.user_projects p
    where p.id = project_id and p.user_id = (select auth.uid())
  ));

create policy "project owner can update AI processing consent"
  on public.project_ai_processing_consents for update to authenticated
  using (user_id = (select auth.uid()) and exists (
    select 1 from public.user_projects p
    where p.id = project_id and p.user_id = (select auth.uid())
  ))
  with check (user_id = (select auth.uid()) and exists (
    select 1 from public.user_projects p
    where p.id = project_id and p.user_id = (select auth.uid())
  ));
