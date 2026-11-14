-- Reduce duplicate permissive SELECT policy evaluation while preserving
-- public storefront visibility and owner access to unpublished/inactive rows.
drop policy if exists "Published storefronts are public" on public.project_storefronts;
drop policy if exists "Store owners can read their storefront" on public.project_storefronts;
create policy "Published storefronts are public"
on public.project_storefronts for select to anon
using (is_published);
create policy "Published storefronts and owners can read"
on public.project_storefronts for select to authenticated
using (
  is_published
  or exists (
    select 1 from public.user_projects p
    where p.id = project_storefronts.project_id and p.user_id = (select auth.uid())
  )
);

drop policy if exists "Published active products are public" on public.project_store_products;
drop policy if exists "Store owners can read all products" on public.project_store_products;
create policy "Published active products are public"
on public.project_store_products for select to anon
using (
  is_active and exists (
    select 1 from public.project_storefronts s
    where s.id = project_store_products.storefront_id and s.is_published
  )
);
create policy "Published products and store owners can read"
on public.project_store_products for select to authenticated
using (
  (is_active and exists (
    select 1 from public.project_storefronts s
    where s.id = project_store_products.storefront_id and s.is_published
  ))
  or exists (
    select 1 from public.project_storefronts s
    join public.user_projects p on p.id = s.project_id
    where s.id = project_store_products.storefront_id and p.user_id = (select auth.uid())
  )
);
