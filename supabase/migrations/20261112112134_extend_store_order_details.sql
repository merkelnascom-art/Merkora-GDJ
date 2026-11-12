-- Capture the requested creation type and fulfilment preference.
-- Order totals and initial status continue to be computed/enforced by the trigger.
alter table public.project_store_custom_requests
  add column if not exists creation_type text not null default 'À préciser'
  check (char_length(creation_type) between 1 and 160);

alter table public.project_store_orders
  add column if not exists fulfillment_method text not null default 'pickup'
  check (fulfillment_method in ('pickup','delivery')),
  add column if not exists delivery_address text not null default ''
  check (char_length(delivery_address) <= 500);

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
