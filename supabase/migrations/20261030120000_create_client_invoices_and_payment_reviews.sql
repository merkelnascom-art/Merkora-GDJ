-- MerKora GDJ: additive invoice and client-declared payment workflow.
-- Existing data and quote tables are not altered or deleted.
-- Payments are append-only: client declarations and admin reviews are retained.

create table public.client_invoices (
  id uuid primary key default gen_random_uuid(),
  quote_version_id uuid not null unique
    references public.client_quote_versions(id) on delete restrict,
  client_user_id uuid not null
    references auth.users(id) on delete restrict,
  invoice_number text not null unique
    check (char_length(invoice_number) between 3 and 64),
  description text not null default ''
    check (char_length(description) <= 2000),
  currency text not null default 'XOF'
    check (currency ~ '^[A-Z]{3}$'),
  total_amount bigint not null
    check (total_amount > 0),
  due_date date,
  created_by uuid not null
    references auth.users(id) on delete restrict,
  created_at timestamptz not null default now()
);

create index client_invoices_client_created_idx
  on public.client_invoices (client_user_id, created_at desc);

create table public.client_payment_declarations (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null
    references public.client_invoices(id) on delete restrict,
  client_user_id uuid not null
    references auth.users(id) on delete restrict,
  amount bigint not null check (amount > 0),
  payment_method text not null
    check (payment_method in ('cash', 'mtn_momo', 'moov_money', 'bank_transfer', 'other')),
  paid_at timestamptz not null,
  transaction_reference text not null default ''
    check (char_length(transaction_reference) <= 160),
  client_note text not null default ''
    check (char_length(client_note) <= 1000),
  created_at timestamptz not null default now()
);

create index client_payment_declarations_invoice_created_idx
  on public.client_payment_declarations (invoice_id, created_at desc);
create index client_payment_declarations_client_created_idx
  on public.client_payment_declarations (client_user_id, created_at desc);

create table public.client_payment_reviews (
  id uuid primary key default gen_random_uuid(),
  payment_declaration_id uuid not null unique
    references public.client_payment_declarations(id) on delete restrict,
  invoice_id uuid not null
    references public.client_invoices(id) on delete restrict,
  client_user_id uuid not null
    references auth.users(id) on delete restrict,
  status text not null check (status in ('confirmed', 'rejected')),
  review_note text not null default ''
    check (char_length(review_note) <= 1000),
  reviewed_by uuid not null
    references auth.users(id) on delete restrict,
  created_at timestamptz not null default now()
);

create index client_payment_reviews_invoice_created_idx
  on public.client_payment_reviews (invoice_id, created_at desc);
create index client_payment_reviews_client_created_idx
  on public.client_payment_reviews (client_user_id, created_at desc);

alter table public.client_invoices enable row level security;
alter table public.client_payment_declarations enable row level security;
alter table public.client_payment_reviews enable row level security;

revoke all on table public.client_invoices from anon, authenticated;
revoke all on table public.client_payment_declarations from anon, authenticated;
revoke all on table public.client_payment_reviews from anon, authenticated;

grant select, insert on public.client_invoices to authenticated;
grant select, insert on public.client_payment_declarations to authenticated;
grant select, insert on public.client_payment_reviews to authenticated;

-- The two administrator emails already approved in MerKora Preview configuration.
create policy "Merkora admins can read invoices"
  on public.client_invoices for select to authenticated
  using ((select auth.jwt() ->> 'email') in ('merkelnascom@gmail.com', 'wdesk87@gmail.com'));

create policy "Merkora admins can create invoices"
  on public.client_invoices for insert to authenticated
  with check (
    (select auth.jwt() ->> 'email') in ('merkelnascom@gmail.com', 'wdesk87@gmail.com')
    and created_by = (select auth.uid())
    and exists (
      select 1
      from public.client_quote_versions v
      join public.client_quote_decisions d on d.quote_version_id = v.id
      where v.id = client_invoices.quote_version_id
        and v.client_user_id = client_invoices.client_user_id
        and v.published_at is not null
        and d.client_user_id = client_invoices.client_user_id
        and d.decision = 'accepted'
    )
  );

create policy "Clients can read their invoices"
  on public.client_invoices for select to authenticated
  using (client_user_id = (select auth.uid()));

create policy "Merkora admins can read payment declarations"
  on public.client_payment_declarations for select to authenticated
  using ((select auth.jwt() ->> 'email') in ('merkelnascom@gmail.com', 'wdesk87@gmail.com'));

create policy "Clients can read their payment declarations"
  on public.client_payment_declarations for select to authenticated
  using (client_user_id = (select auth.uid()));

create policy "Clients can declare payments on their invoices"
  on public.client_payment_declarations for insert to authenticated
  with check (
    client_user_id = (select auth.uid())
    and exists (
      select 1 from public.client_invoices i
      where i.id = invoice_id and i.client_user_id = (select auth.uid())
    )
  );

create policy "Merkora admins can read payment reviews"
  on public.client_payment_reviews for select to authenticated
  using ((select auth.jwt() ->> 'email') in ('merkelnascom@gmail.com', 'wdesk87@gmail.com'));

create policy "Clients can read their payment reviews"
  on public.client_payment_reviews for select to authenticated
  using (client_user_id = (select auth.uid()));

create policy "Merkora admins can review payments"
  on public.client_payment_reviews for insert to authenticated
  with check (
    (select auth.jwt() ->> 'email') in ('merkelnascom@gmail.com', 'wdesk87@gmail.com')
    and reviewed_by = (select auth.uid())
    and exists (
      select 1
      from public.client_payment_declarations p
      where p.id = client_payment_reviews.payment_declaration_id
        and p.invoice_id = client_payment_reviews.invoice_id
        and p.client_user_id = client_payment_reviews.client_user_id
    )
  );

-- Database-level protection against concurrent confirmations causing overpayment.
-- The transaction-scoped advisory lock serializes confirmations per invoice.
create or replace function public.prevent_invoice_overpayment()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
declare
  declared_amount bigint;
  invoice_total bigint;
  already_confirmed bigint;
begin
  if new.status <> 'confirmed' then
    return new;
  end if;

  perform pg_advisory_xact_lock(hashtextextended(new.invoice_id::text, 0));

  select p.amount
    into declared_amount
  from public.client_payment_declarations p
  where p.id = new.payment_declaration_id
    and p.invoice_id = new.invoice_id
    and p.client_user_id = new.client_user_id;

  if declared_amount is null then
    raise exception 'Déclaration de paiement introuvable ou incohérente';
  end if;

  select i.total_amount
    into invoice_total
  from public.client_invoices i
  where i.id = new.invoice_id
    and i.client_user_id = new.client_user_id;

  if invoice_total is null then
    raise exception 'Facture introuvable ou incohérente';
  end if;

  select coalesce(sum(p.amount), 0)
    into already_confirmed
  from public.client_payment_reviews r
  join public.client_payment_declarations p on p.id = r.payment_declaration_id
  where r.invoice_id = new.invoice_id
    and r.client_user_id = new.client_user_id
    and r.status = 'confirmed';

  if already_confirmed + declared_amount > invoice_total then
    raise exception 'Ce paiement dépasserait le solde restant de la facture';
  end if;

  return new;
end;
$$;

revoke all on function public.prevent_invoice_overpayment() from public, anon, authenticated;

create trigger prevent_invoice_overpayment_before_review
  before insert on public.client_payment_reviews
  for each row execute function public.prevent_invoice_overpayment();

comment on table public.client_invoices is
  'Invoices linked to one exact accepted quote version. Additive schema; append-only for application roles.';
comment on table public.client_payment_declarations is
  'Client-declared payments awaiting administrative review. Declarations are append-only.';
comment on table public.client_payment_reviews is
  'Append-only administrative confirmation or rejection of each payment declaration.';
