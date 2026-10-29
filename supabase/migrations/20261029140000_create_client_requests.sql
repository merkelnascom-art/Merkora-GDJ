-- MerKora GDJ: secure cross-account client request inbox.
-- This migration is committed to the preview branch only; it is not applied automatically.
create table if not exists public.client_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  user_email text not null,
  project_id text not null check (char_length(project_id) between 3 and 160),
  project_title text not null check (char_length(project_title) between 1 and 160),
  payload jsonb not null default '{}'::jsonb,
  admin_status text not null default 'to_review'
    check (admin_status in ('to_review','verified','changes_requested','negotiation','accepted','in_progress','delivered','rejected')),
  admin_note text not null default '' check (char_length(admin_note) <= 1200),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.client_requests enable row level security;
grant select, insert on public.client_requests to authenticated;
grant all on public.client_requests to service_role;

drop policy if exists "Clients can read their own MerKora requests" on public.client_requests;
create policy "Clients can read their own MerKora requests"
  on public.client_requests for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Clients can submit their own MerKora requests" on public.client_requests;
create policy "Clients can submit their own MerKora requests"
  on public.client_requests for insert to authenticated
  with check ((select auth.uid()) = user_id);

create index if not exists client_requests_created_at_idx on public.client_requests (created_at desc);
create index if not exists client_requests_admin_status_idx on public.client_requests (admin_status, updated_at desc);

comment on table public.client_requests is 'Client-submitted MerKora project and quote responses; admin reads via server-only service-role API.';
