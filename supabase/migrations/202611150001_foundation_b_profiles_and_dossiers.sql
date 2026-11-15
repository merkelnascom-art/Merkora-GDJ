-- MerKora GDJ Foundation B1/B2.
-- Additive only: creates new tables; does not alter or delete existing project data.

create table if not exists public.user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role text not null default 'client'
    check (role in ('client', 'collaborator', 'designer', 'developer', 'admin', 'superadmin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_profiles enable row level security;
drop policy if exists "Users can read their own MerKora profile" on public.user_profiles;
create policy "Users can read their own MerKora profile"
  on public.user_profiles for select to authenticated
  using ((select auth.uid()) = user_id);
revoke insert, update, delete on public.user_profiles from authenticated;
grant select on public.user_profiles to authenticated;

create or replace function public.handle_new_merkora_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.user_profiles (user_id, display_name)
  values (new.id, nullif(new.raw_user_meta_data ->> 'display_name', ''))
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_merkora on auth.users;
create trigger on_auth_user_created_merkora
  after insert on auth.users
  for each row execute procedure public.handle_new_merkora_user();

create table if not exists public.user_project_dossiers (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 160),
  payload jsonb not null,
  version integer not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists user_project_dossiers_owner_updated_idx
  on public.user_project_dossiers (user_id, updated_at desc);

alter table public.user_project_dossiers enable row level security;
drop policy if exists "Users can read their own MerKora dossiers" on public.user_project_dossiers;
create policy "Users can read their own MerKora dossiers"
  on public.user_project_dossiers for select to authenticated
  using ((select auth.uid()) = user_id);
drop policy if exists "Users can create their own MerKora dossiers" on public.user_project_dossiers;
create policy "Users can create their own MerKora dossiers"
  on public.user_project_dossiers for insert to authenticated
  with check ((select auth.uid()) = user_id);
drop policy if exists "Users can update their own MerKora dossiers" on public.user_project_dossiers;
create policy "Users can update their own MerKora dossiers"
  on public.user_project_dossiers for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
grant select, insert, update on public.user_project_dossiers to authenticated;
