-- MerKora generated applications: persistent, owner-scoped module state.
-- Generic module workspace v1 supports project owners and platform administrators.
-- Team memberships and granular staff roles are a separate additive phase.

create table if not exists public.project_module_data (
  project_id text not null references public.user_projects(id) on delete cascade,
  module_id text not null check (module_id ~ '^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$' and char_length(module_id) <= 50),
  payload jsonb not null default '{}'::jsonb
    check (jsonb_typeof(payload) = 'object' and octet_length(payload::text) <= 65536),
  updated_by uuid not null default auth.uid() references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (project_id, module_id)
);

comment on table public.project_module_data is
  'Persistent operational state for generated project modules; isolated by project ownership and protected by RLS.';

alter table public.project_module_data enable row level security;

revoke all on table public.project_module_data from anon;
revoke all on table public.project_module_data from authenticated;
grant select, insert, update on table public.project_module_data to authenticated;

create policy "module data readable by owner or admin"
  on public.project_module_data
  for select
  to authenticated
  using (
    public.is_merkora_admin()
    or exists (
      select 1
      from public.user_projects p
      where p.id = project_module_data.project_id
        and p.user_id = (select auth.uid())
    )
  );

create policy "project owners and admins can create module data"
  on public.project_module_data
  for insert
  to authenticated
  with check (
    updated_by = (select auth.uid())
    and (
      public.is_merkora_admin()
      or exists (
        select 1
        from public.user_projects p
        where p.id = project_module_data.project_id
          and p.user_id = (select auth.uid())
      )
    )
  );

create policy "project owners and admins can update module data"
  on public.project_module_data
  for update
  to authenticated
  using (
    public.is_merkora_admin()
    or exists (
      select 1
      from public.user_projects p
      where p.id = project_module_data.project_id
        and p.user_id = (select auth.uid())
    )
  )
  with check (
    updated_by = (select auth.uid())
    and (
      public.is_merkora_admin()
      or exists (
        select 1
        from public.user_projects p
        where p.id = project_module_data.project_id
          and p.user_id = (select auth.uid())
      )
    )
  );

-- Deliberately no DELETE policy: module state is not silently erasable by
-- generated clients. Retention/deletion must follow an explicit project flow.
