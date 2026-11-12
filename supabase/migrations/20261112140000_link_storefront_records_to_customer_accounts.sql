-- Complete authenticated customer tracking for project storefronts.
-- This migration is additive. Guest submissions remain valid and existing records stay unchanged.

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

-- Derive the customer account from the authenticated Supabase session.
-- This prevents a browser from attaching another person's user ID.
create or replace function public.calculate_project_store_order()
returns trigger language plpgsql set search_path = ''
as $function$
declare
  item jsonb;
  product record;
  quantity integer;
  total bigint := 0;
  normalized_items jsonb := '[]'::jsonb;
begin
  new.customer_user_id := auth.uid();

  if jsonb_typeof(new.items) <> 'array' or jsonb_array_length(new.items) = 0 or jsonb_array_length(new.items) > 50 then
    raise exception 'Le panier est vide ou contient trop de lignes.';
  end if;
  if new.fulfillment_method = 'delivery' and char_length(trim(new.delivery_address)) = 0 then
    raise exception 'Une adresse est nécessaire pour une livraison.';
  end if;
  if new.fulfillment_method = 'pickup' then
    new.delivery_address := '';
  end if;
  for item in select value from jsonb_array_elements(new.items)
  loop
    if jsonb_typeof(item) <> 'object' or (item->>'product_id') is null or (item->>'quantity') !~ '^[0-9]{1,2}$' then
      raise exception 'Ligne de panier invalide.';
    end if;
    quantity := (item->>'quantity')::integer;
    if quantity < 1 or quantity > 99 then raise exception 'Quantité hors limites.'; end if;
    select p.id, p.name, p.price_xof into product
    from public.project_store_products p
    join public.project_storefronts s on s.id = p.storefront_id
    where p.id = (item->>'product_id')::uuid and p.storefront_id = new.storefront_id and p.is_active and s.is_published;
    if not found then raise exception 'Un produit du panier n’est plus disponible.'; end if;
    total := total + (product.price_xof * quantity);
    normalized_items := normalized_items || jsonb_build_array(jsonb_build_object(
      'product_id', product.id, 'name', product.name, 'unit_price_xof', product.price_xof,
      'quantity', quantity, 'line_total_xof', product.price_xof * quantity
    ));
  end loop;
  new.items := normalized_items;
  new.total_amount_xof := total;
  new.status := 'received';
  return new;
end;
$function$;

create or replace function public.normalize_project_store_custom_request()
returns trigger language plpgsql set search_path = ''
as $function$
begin
  new.customer_user_id := auth.uid();
  new.status := 'received';
  return new;
end;
$function$;

-- Replace the original triggers so each submission has exactly one calculation/link step.
drop trigger if exists calculate_project_store_order_before_insert on public.project_store_orders;
drop trigger if exists set_customer_account_on_store_order on public.project_store_orders;
create trigger set_customer_account_on_store_order
before insert on public.project_store_orders
for each row execute function public.calculate_project_store_order();

drop trigger if exists normalize_project_store_custom_request_before_insert on public.project_store_custom_requests;
drop trigger if exists set_customer_account_on_store_request on public.project_store_custom_requests;
create trigger set_customer_account_on_store_request
before insert on public.project_store_custom_requests
for each row execute function public.normalize_project_store_custom_request();

-- Authenticated inserts can only create records for their own session.
-- Anonymous visitors may still submit guest orders with a NULL customer_user_id.
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

-- Private inspiration photos are readable by the submitting customer and the store owner only.
drop policy if exists "Customers can read their own reference photos" on storage.objects;
create policy "Customers can read their own reference photos"
on storage.objects for select to authenticated
using (
  bucket_id = 'project-store-references'
  and exists (
    select 1 from public.project_store_custom_requests r
    where r.reference_image_path = name
      and r.customer_user_id = (select auth.uid())
  )
);
