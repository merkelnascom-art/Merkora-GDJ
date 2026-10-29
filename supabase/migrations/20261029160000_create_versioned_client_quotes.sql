-- MerKora GDJ: additive, versioned quote storage.
-- No existing table or row is altered or deleted.
-- Published versions and client decisions are append-only: application roles receive no UPDATE/DELETE grants.

create table public.client_quotes (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null unique
    references public.client_requests(id) on delete restrict,
  client_user_id uuid not null
    references auth.users(id) on delete restrict,
  created_by uuid not null
    references auth.users(id) on delete restrict,
  created_at timestamptz not null default now()
);

create index client_quotes_client_user_id_idx
  on public.client_quotes (client_user_id);
create index client_quotes_request_id_idx
  on public.client_quotes (request_id);

create table public.client_quote_versions (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null
    references public.client_quotes(id) on delete restrict,
  version_number integer not null check (version_number > 0),
  snapshot jsonb not null check (jsonb_typeof(snapshot) = 'object'),
  currency text not null default 'XOF'
    check (currency ~ '^[A-Z]{3}$'),
  total_amount bigint not null check (total_amount >= 0),
  valid_until date not null,
  published_at timestamptz,
  created_by uuid not null
    references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  unique (quote_id, version_number),
  check (published_at is null or valid_until >= (published_at at time zone 'UTC')::date)
);

create index client_quote_versions_quote_version_idx
  on public.client_quote_versions (quote_id, version_number desc);
create index client_quote_versions_published_idx
  on public.client_quote_versions (quote_id, published_at)
  where published_at is not null;

create table public.client_quote_decisions (
  id uuid primary key default gen_random_uuid(),
  quote_version_id uuid not null
    references public.client_quote_versions(id) on delete restrict,
  client_user_id uuid not null
    references auth.users(id) on delete restrict default auth.uid(),
  decision text not null
    check (decision in ('accepted', 'declined', 'changes_requested', 'negotiation')),
  message text not null default ''
    check (char_length(message) <= 2000),
  created_at timestamptz not null default now()
);

create index client_quote_decisions_version_created_idx
  on public.client_quote_decisions (quote_version_id, created_at desc);
create index client_quote_decisions_client_created_idx
  on public.client_quote_decisions (client_user_id, created_at desc);

alter table public.client_quotes enable row level security;
alter table public.client_quote_versions enable row level security;
alter table public.client_quote_decisions enable row level security;

-- Explicit least-privilege grants. No anonymous access and no UPDATE/DELETE for app roles.
revoke all on table public.client_quotes from anon, authenticated;
revoke all on table public.client_quote_versions from anon, authenticated;
revoke all on table public.client_quote_decisions from anon, authenticated;

grant select, insert on table public.client_quotes to authenticated;
grant select, insert on table public.client_quote_versions to authenticated;
grant select, insert on table public.client_quote_decisions to authenticated;

-- Admin authorization mirrors the existing project's configured admin email policy.
create policy "Merkora admin can read client quotes"
  on public.client_quotes for select to authenticated
  using ((select auth.jwt() ->> 'email') = 'merkelnascom@gmail.com');

create policy "Merkora admin can create client quotes"
  on public.client_quotes for insert to authenticated
  with check (
    (select auth.jwt() ->> 'email') = 'merkelnascom@gmail.com'
    and created_by = (select auth.uid())
  );

create policy "Clients can read their published quotes"
  on public.client_quotes for select to authenticated
  using (
    client_user_id = (select auth.uid())
    and exists (
      select 1
      from public.client_quote_versions v
      where v.quote_id = client_quotes.id
        and v.published_at is not null
    )
  );

create policy "Merkora admin can read quote versions"
  on public.client_quote_versions for select to authenticated
  using ((select auth.jwt() ->> 'email') = 'merkelnascom@gmail.com');

create policy "Merkora admin can create quote versions"
  on public.client_quote_versions for insert to authenticated
  with check (
    (select auth.jwt() ->> 'email') = 'merkelnascom@gmail.com'
    and created_by = (select auth.uid())
    and exists (
      select 1
      from public.client_quotes q
      where q.id = quote_id
        and q.client_user_id is not null
    )
  );

create policy "Clients can read their published quote versions"
  on public.client_quote_versions for select to authenticated
  using (
    published_at is not null
    and exists (
      select 1
      from public.client_quotes q
      where q.id = quote_id
        and q.client_user_id = (select auth.uid())
    )
  );

create policy "Merkora admin can read quote decisions"
  on public.client_quote_decisions for select to authenticated
  using ((select auth.jwt() ->> 'email') = 'merkelnascom@gmail.com');

create policy "Clients can read their own quote decisions"
  on public.client_quote_decisions for select to authenticated
  using (client_user_id = (select auth.uid()));

create policy "Clients can submit decisions on their own published quotes"
  on public.client_quote_decisions for insert to authenticated
  with check (
    client_user_id = (select auth.uid())
    and exists (
      select 1
      from public.client_quote_versions v
      join public.client_quotes q on q.id = v.quote_id
      where v.id = quote_version_id
        and v.published_at is not null
        and v.valid_until >= current_date
        and q.client_user_id = (select auth.uid())
    )
  );

comment on table public.client_quotes is
  'Quote group tied to one existing client request. Additive schema; request data remains unchanged.';
comment on table public.client_quote_versions is
  'Immutable quote snapshots. Drafts have published_at NULL; published versions are visible to the owning client.';
comment on table public.client_quote_decisions is
  'Append-only client decisions, each tied to the exact quote version shown to the client.';
