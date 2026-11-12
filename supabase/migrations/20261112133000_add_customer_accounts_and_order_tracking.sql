-- Customer accounts and private order history for generated storefront projects.
-- Existing guest orders remain intact; new authenticated submissions are linked to auth.uid().
-- The customer identity is always assigned by the database, never trusted from browser input.

alter table public.project_store_orders
  add column if not exists customer_user_id uuid references auth.users(id) on delete set null;

alter table public.project_store_custom_requests
  add column if not exists customer_user_id uuid references auth.users(id) on delete set null;

create index if not exists project_store_orders_customer_history_idx
  on public.project_store_orders (customer_user_id, storefront_id, created_at desc)
  where customer_user_id is not null;

create index if not exists project_store_requests_customer_history_idx
  on public.project_store_custom_requests (customer_user_id, storefront_id, created_at desc)
  where customer_user_id is not null;

create or replace function public.bind_project_store_customer()
returns trigger
language plpgsql
set search_path = ''
as $function$
begin
  new.customer_user_id := (select auth.uid());
  return new;
end;
$function$;

drop trigger if exists bind_project_store_order_customer on public.project_store_orders;
create trigger bind_project_store_order_customer
before insert on public.project_store_orders
for each row execute function public.bind_project_store_customer();

drop trigger if exists bind_project_store_request_customer on public.project_store_custom_requests;
create trigger bind_project_store_request_customer
before insert on public.project_store_custom_requests
for each row execute function public.bind_project_store_customer();

drop policy if exists "Public can submit orders to published stores" on public.project_store_orders;
create policy "Public can submit orders to published stores"
on public.project_store_orders for insert to anon, authenticated
with check (
  customer_user_id is not distinct from (select auth.uid())
  and exists (
    select 1 from public.project_storefronts s
    where s.id = project_store_orders.storefront_id and s.is_published
  )
);

drop policy if exists "Public can submit custom requests to published stores" on public.project_store_custom_requests;
create policy "Public can submit custom requests to published stores"
on public.project_store_custom_requests for insert to anon, authenticated
with check (
  customer_user_id is not distinct from (select auth.uid())
  and exists (
    select 1 from public.project_storefronts s
    where s.id = project_store_custom_requests.storefront_id and s.is_published
  )
);

drop policy if exists "Customers can read their own orders" on public.project_store_orders;
create policy "Customers can read their own orders"
on public.project_store_orders for select to authenticated
using (customer_user_id = (select auth.uid()));

drop policy if exists "Customers can read their own custom requests" on public.project_store_custom_requests;
create policy "Customers can read their own custom requests"
on public.project_store_custom_requests for select to authenticated
using (customer_user_id = (select auth.uid()));

drop policy if exists "Customers can read their own reference photos" on storage.objects;
create policy "Customers can read their own reference photos"
on storage.objects for select to authenticated
using (
  bucket_id = 'project-store-references'
  and exists (
    select 1
    from public.project_store_custom_requests r
    where r.reference_image_path = storage.objects.name
      and r.customer_user_id = (select auth.uid())
  )
);
