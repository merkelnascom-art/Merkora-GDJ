-- Tighten the launch ledger's read policy and index its remaining foreign keys.
-- No rows are modified or deleted.

drop policy if exists "Merkora admins can read project launches" on public.client_project_launches;
drop policy if exists "Clients can read their own project launches" on public.client_project_launches;
drop policy if exists "Merkora admins can record project launches" on public.client_project_launches;

create policy "Owners and MerKora admins can read project launches"
  on public.client_project_launches for select to authenticated
  using (
    client_user_id = (select auth.uid())
    or (select auth.jwt() ->> 'email') in ('merkelnascom@gmail.com', 'wdesk87@gmail.com')
  );

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

create index if not exists client_project_launches_launched_by_idx
  on public.client_project_launches (launched_by);
create index if not exists client_project_launches_quote_version_idx
  on public.client_project_launches (quote_version_id);
