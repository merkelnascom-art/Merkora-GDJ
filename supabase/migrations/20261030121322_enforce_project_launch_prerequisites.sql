-- Enforce the accepted-quote and confirmed-payment prerequisites at the database boundary.
-- Also prevent manual status changes to in_progress unless a launch event exists.
-- Existing project and payment rows are not modified.

drop policy if exists "Merkora admins can record project launches" on public.client_project_launches;
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
        and v.published_at is not null
        and q.request_id = client_project_launches.request_id
        and r.user_id = client_project_launches.client_user_id
        and i.total_amount = client_project_launches.invoice_total_at_launch
        and exists (
          select 1
          from public.client_quote_decisions d
          where d.quote_version_id = client_project_launches.quote_version_id
            and d.client_user_id = client_project_launches.client_user_id
            and d.decision = 'accepted'
        )
        and client_project_launches.required_amount <= (
          select coalesce(sum(p.amount), 0)
          from public.client_payment_reviews pr
          join public.client_payment_declarations p on p.id = pr.payment_declaration_id
          where pr.invoice_id = client_project_launches.invoice_id
            and pr.client_user_id = client_project_launches.client_user_id
            and pr.status = 'confirmed'
            and p.invoice_id = client_project_launches.invoice_id
            and p.client_user_id = client_project_launches.client_user_id
        )
        and client_project_launches.confirmed_amount_at_launch = (
          select coalesce(sum(p.amount), 0)
          from public.client_payment_reviews pr
          join public.client_payment_declarations p on p.id = pr.payment_declaration_id
          where pr.invoice_id = client_project_launches.invoice_id
            and pr.client_user_id = client_project_launches.client_user_id
            and pr.status = 'confirmed'
            and p.invoice_id = client_project_launches.invoice_id
            and p.client_user_id = client_project_launches.client_user_id
        )
    )
  );

drop policy if exists "Merkora admin can update client request tracking" on public.client_requests;
create policy "Merkora admin can update client request tracking"
  on public.client_requests for update to authenticated
  using ((select auth.jwt() ->> 'email') = 'merkelnascom@gmail.com')
  with check (
    (select auth.jwt() ->> 'email') = 'merkelnascom@gmail.com'
    and (
      admin_status <> 'in_progress'
      or exists (
        select 1
        from public.client_project_launches l
        where l.request_id = client_requests.id
          and l.client_user_id = client_requests.user_id
      )
    )
  );
