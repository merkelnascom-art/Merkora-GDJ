-- Additive storefront foundation for generated customer projects.
-- Public visitors can browse published products and submit orders/custom requests.
-- Only the owning authenticated project user can manage the catalogue and read submissions.
-- Product prices are calculated server-side by a SECURITY INVOKER trigger; public input
-- cannot choose order totals or initial order status.

create table if not exists public.project_storefronts (
  id uuid primary key default gen_random_uuid(),
  project_id text not null unique references public.user_projects(id) on delete cascade,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  display_name text not null check (char_length(display_name) between 1 and 160),
  description text not null default '' check (char_length(description) <= 2000),
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_store_products (
  id uuid primary key default gen_random_uuid(),
  storefront_id uuid not null references public.project_storefronts(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 160),
  description text not null default '' check (char_length(description) <= 2000),
  category text not null default 'Autres' check (char_length(category) between 1 and 80),
  price_xof bigint not null check (price_xof > 0),
  image_url text not null default '' check (char_length(image_url) <= 2000),
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_store_custom_requests (
  id uuid primary key default gen_random_uuid(),
  storefront_id uuid not null references public.project_storefronts(id) on delete cascade,
  customer_name text not null check (char_length(customer_name) between 1 and 120),
  customer_phone text not null check (char_length(customer_phone) between 3 and 40),
  occasion text not null check (char_length(occasion) between 1 and 160),
  desired_date date not null,
  portions integer not null check (portions between 1 and 500),
  flavour text not null default '' check (char_length(flavour) <= 160),
  decoration text not null default '' check (char_length(decoration) <= 500),
  notes text not null default '' check (char_length(notes) <= 2000),
  status text not null default 'received' check (status in ('received','reviewing','quoted','accepted','rejected','completed')),
  created_at timestamptz not null default now()
);

create table if not exists public.project_store_orders (
  id uuid primary key default gen_random_uuid(),
  storefront_id uuid not null references public.project_storefronts(id) on delete cascade,
  customer_name text not null check (char_length(customer_name) between 1 and 120),
  customer_phone text not null check (char_length(customer_phone) between 3 and 40),
  desired_date date,
  notes text not null default '' check (char_length(notes) <= 2000),
  items jsonb not null default '[]'::jsonb check (jsonb_typeof(items) = 'array'),
  total_amount_xof bigint not null default 0 check (total_amount_xof >= 0),
  status text not null default 'received' check (status in ('received','confirmed','preparing','ready','delivered','cancelled')),
  created_at timestamptz not null default now()
);

create index if not exists project_store_products_storefront_active_idx
  on public.project_store_products (storefront_id, is_active, sort_order);
create index if not exists project_store_custom_requests_storefront_created_idx
  on public.project_store_custom_requests (storefront_id, created_at desc);
create index if not exists project_store_orders_storefront_created_idx
  on public.project_store_orders (storefront_id, created_at desc);

alter table public.project_storefronts enable row level security;
alter table public.project_store_products enable row level security;
alter table public.project_store_custom_requests enable row level security;
alter table public.project_store_orders enable row level security;

grant select on public.project_storefronts to anon, authenticated;
grant select on public.project_store_products to anon, authenticated;
grant insert on public.project_store_custom_requests to anon, authenticated;
grant select, update on public.project_store_custom_requests to authenticated;
grant insert on public.project_store_orders to anon, authenticated;
grant select, update on public.project_store_orders to authenticated;
grant insert, update, delete on public.project_store_products to authenticated;
grant update on public.project_storefronts to authenticated;

create policy "Published storefronts are public"
on public.project_storefronts for select to anon, authenticated
using (is_published);
create policy "Store owners can read their storefront"
on public.project_storefronts for select to authenticated
using (exists (select 1 from public.user_projects p where p.id = project_storefronts.project_id and p.user_id = (select auth.uid())));
create policy "Store owners can update their storefront"
on public.project_storefronts for update to authenticated
using (exists (select 1 from public.user_projects p where p.id = project_storefronts.project_id and p.user_id = (select auth.uid())))
with check (exists (select 1 from public.user_projects p where p.id = project_storefronts.project_id and p.user_id = (select auth.uid())));

create policy "Published active products are public"
on public.project_store_products for select to anon, authenticated
using (is_active and exists (select 1 from public.project_storefronts s where s.id = project_store_products.storefront_id and s.is_published));
create policy "Store owners can read all products"
on public.project_store_products for select to authenticated
using (exists (select 1 from public.project_storefronts s join public.user_projects p on p.id = s.project_id where s.id = project_store_products.storefront_id and p.user_id = (select auth.uid())));
create policy "Store owners can insert products"
on public.project_store_products for insert to authenticated
with check (exists (select 1 from public.project_storefronts s join public.user_projects p on p.id = s.project_id where s.id = project_store_products.storefront_id and p.user_id = (select auth.uid())));
create policy "Store owners can update products"
on public.project_store_products for update to authenticated
using (exists (select 1 from public.project_storefronts s join public.user_projects p on p.id = s.project_id where s.id = project_store_products.storefront_id and p.user_id = (select auth.uid())))
with check (exists (select 1 from public.project_storefronts s join public.user_projects p on p.id = s.project_id where s.id = project_store_products.storefront_id and p.user_id = (select auth.uid())));
create policy "Store owners can delete products"
on public.project_store_products for delete to authenticated
using (exists (select 1 from public.project_storefronts s join public.user_projects p on p.id = s.project_id where s.id = project_store_products.storefront_id and p.user_id = (select auth.uid())));

create policy "Public can submit custom requests to published stores"
on public.project_store_custom_requests for insert to anon, authenticated
with check (exists (select 1 from public.project_storefronts s where s.id = project_store_custom_requests.storefront_id and s.is_published));
create policy "Store owners can read custom requests"
on public.project_store_custom_requests for select to authenticated
using (exists (select 1 from public.project_storefronts s join public.user_projects p on p.id = s.project_id where s.id = project_store_custom_requests.storefront_id and p.user_id = (select auth.uid())));
create policy "Store owners can update custom request status"
on public.project_store_custom_requests for update to authenticated
using (exists (select 1 from public.project_storefronts s join public.user_projects p on p.id = s.project_id where s.id = project_store_custom_requests.storefront_id and p.user_id = (select auth.uid())))
with check (exists (select 1 from public.project_storefronts s join public.user_projects p on p.id = s.project_id where s.id = project_store_custom_requests.storefront_id and p.user_id = (select auth.uid())));

create policy "Public can submit orders to published stores"
on public.project_store_orders for insert to anon, authenticated
with check (exists (select 1 from public.project_storefronts s where s.id = project_store_orders.storefront_id and s.is_published));
create policy "Store owners can read orders"
on public.project_store_orders for select to authenticated
using (exists (select 1 from public.project_storefronts s join public.user_projects p on p.id = s.project_id where s.id = project_store_orders.storefront_id and p.user_id = (select auth.uid())));
create policy "Store owners can update order status"
on public.project_store_orders for update to authenticated
using (exists (select 1 from public.project_storefronts s join public.user_projects p on p.id = s.project_id where s.id = project_store_orders.storefront_id and p.user_id = (select auth.uid())))
with check (exists (select 1 from public.project_storefronts s join public.user_projects p on p.id = s.project_id where s.id = project_storefronts.project_id and p.user_id = (select auth.uid())));

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
  if jsonb_typeof(new.items) <> 'array' or jsonb_array_length(new.items) = 0 or jsonb_array_length(new.items) > 50 then
    raise exception 'Le panier est vide ou contient trop de lignes.';
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
  new.status := 'received';
  return new;
end;
$function$;

create trigger calculate_project_store_order_before_insert
before insert on public.project_store_orders
for each row execute function public.calculate_project_store_order();
create trigger normalize_project_store_custom_request_before_insert
before insert on public.project_store_custom_requests
for each row execute function public.normalize_project_store_custom_request();

insert into public.project_storefronts (project_id, slug, display_name, description, is_published)
values ('MK-MWAWRAVH-1FWG', 'asho-sweet', 'Asho Sweet', 'Catalogue de gâteaux et pâtisseries, commandes personnalisées et suivi des commandes.', false)
on conflict (project_id) do nothing;
