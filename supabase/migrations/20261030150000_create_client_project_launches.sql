-- MerKora GDJ: official, administrator-triggered project launch ledger.
-- Additive only: existing project, quote, invoice and payment rows are preserved.
-- A launch is a one-time event linked to the exact accepted quote and invoice.

create table public.client_project_launches (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null unique
    references public.client_requests(id) on delete restrict,
  client_user_id uuid not null
    references auth.users(id) on delete restrict,
  quote_version_id uuid not null
    references public.client_quote_versions(id) on delete restrict,
  invoice_id uuid not null
    references public.client_invoices(id) on delete restrict,
  launched_by uuid not null
    references auth.users(id) on delete restrict,
  required_amount bigint not null check (required_amount > 0),
  invoice_total_at_launch bigint not null check (invoice_total_at_launch > 0),
  confirmed_amount_at_launch bigint not null check (confirmed_amount_at_launch > 0),
  launch_message text not null
    default 'Votre projet a officiellement commencé. Vous pouvez suivre son avancement depuis votre espace client.'
    check (char_length(launch_message) between 1 and 1200),
  launched_at timestamptz not null default now(),
  check (required_amount <= invoice_total_at_launch),
  check (confirmed_amount_at_launch >= required_amount),
  check (confirmed_amount_at_launch <= invoice_total_at_launch)
);

create index client_project_launches_client_launched_idx
  on public.client_project_launches (client_user_id, launched_at desc);

create index client_project_launches_invoice_idx
  on public.client_project_launches (invoice_id);

alter table public.client_project_launches enable row level security;

-- The new table is private to authenticated clients and the approved administrators.
revoke all on table public.client_project_launches from anon, authenticated;
grant select, insert on table public.client_project_launches to authenticated;

create policy "Merkora admins can read project launches"
  on public.client_project_launches for select to authenticated
  using (
    (select auth.jwt() ->> 'email') in ('merkelnascom@gmail.com', 'wdesk87@gmail.com')
  );

create policy "Clients can read their own project launches"
  on public.client_project_launches for select to authenticated
  using (client_user_id = (select auth.uid()));

create policy "Merkora admins can record project launches"
  on public.client_project_launches for insert to authenticated
  with check (
    (select auth.jwt() ->> 'email') in ('merkelnascom@gmail.com', 'wdesk87@gmail.com')
    and launched_by = (select auth.uid())
    and exists (
      select 1
      from public.client_invoices i
      join public.client_quote_versions v on v.id = i.quote_version_id
      join public.client_quotes q on q.id = v.quote_id
      join public.client_requests r on r.id = q.request_id
      where i.id = client_project_launches.invoice_id
        and i.client_user_id = client_project_launches.client_user_id
        and v.id = client_project_launches.quote_version_id
        and v.client_user_id = client_project_launches.client_user_id
        and q.request_id = client_project_launches.request_id
        and r.user_id = client_project_launches.client_user_id
        and i.total_amount = client_project_launches.invoice_total_at_launch
    )
  );

comment on table public.client_project_launches is
  'Append-only official project launch events. Each event records the administrator, accepted quote, invoice, required threshold and confirmed amount at launch.';
