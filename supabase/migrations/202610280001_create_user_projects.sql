-- MerKora GDJ: persistent project records owned by the authenticated user.
-- Review and apply this migration only to the verified MerKora GDJ Supabase project.
create table if not exists public.user_projects (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 160),
  category text not null,
  problem text not null,
  desired_outcome text not null,
  budget text not null default 'À définir',
  urgency text not null default 'normal' check (urgency in ('low', 'normal', 'high', 'urgent')),
  status text not null default 'discovery' check (status in ('discovery', 'design', 'awaiting_approval', 'in_progress', 'verification', 'delivered')),
  recommendations jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists user_projects_owner_updated_idx
  on public.user_projects (user_id, updated_at desc);

alter table public.user_projects enable row level security;

drop policy if exists "Users can read their own MerKora projects" on public.user_projects;
create policy "Users can read their own MerKora projects"
  on public.user_projects for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can create their own MerKora projects" on public.user_projects;
create policy "Users can create their own MerKora projects"
  on public.user_projects for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own MerKora projects" on public.user_projects;
create policy "Users can update their own MerKora projects"
  on public.user_projects for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete their own MerKora projects" on public.user_projects;
create policy "Users can delete their own MerKora projects"
  on public.user_projects for delete to authenticated
  using ((select auth.uid()) = user_id);

grant select, insert, update, delete on public.user_projects to authenticated;
