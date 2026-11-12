-- Secure storefront mutations and support customer reference photos.
-- Additive only: existing products, orders, requests, and storefront data are preserved.

alter table public.project_store_custom_requests
  add column if not exists reference_image_path text
  check (reference_image_path is null or char_length(reference_image_path) <= 512);

-- The application only changes order/request status and storefront publication state.
-- Column-level grants prevent a compromised browser client from changing totals,
-- order items, customer details, or the reference image path.
revoke update on public.project_storefronts from authenticated;
revoke update on public.project_store_custom_requests from authenticated;
revoke update on public.project_store_orders from authenticated;

grant update (is_published) on public.project_storefronts to authenticated;
grant update (status) on public.project_store_custom_requests to authenticated;
grant update (status) on public.project_store_orders to authenticated;

-- Product photos are public storefront assets; customer reference photos stay private.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('project-store-product-images', 'project-store-product-images', true, 5242880, array['image/jpeg','image/png','image/webp']),
  ('project-store-references', 'project-store-references', false, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

grant insert on storage.objects to anon, authenticated;
grant select on storage.objects to authenticated;

drop policy if exists "Store owners can upload product photos" on storage.objects;
create policy "Store owners can upload product photos"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'project-store-product-images'
  and name ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/products/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|webp)$'
  and exists (
    select 1
    from public.project_storefronts s
    join public.user_projects p on p.id = s.project_id
    where s.id::text = split_part(name, '/', 1)
      and p.user_id = (select auth.uid())
  )
);

drop policy if exists "Customers can upload reference photos to published stores" on storage.objects;
create policy "Customers can upload reference photos to published stores"
on storage.objects for insert to anon, authenticated
with check (
  bucket_id = 'project-store-references'
  and name ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/custom-requests/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|webp)$'
  and exists (
    select 1
    from public.project_storefronts s
    where s.id::text = split_part(name, '/', 1)
      and s.is_published
  )
);

drop policy if exists "Store owners can read reference photos" on storage.objects;
create policy "Store owners can read reference photos"
on storage.objects for select to authenticated
using (
  bucket_id = 'project-store-references'
  and name ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/custom-requests/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|webp)$'
  and exists (
    select 1
    from public.project_storefronts s
    join public.user_projects p on p.id = s.project_id
    where s.id::text = split_part(name, '/', 1)
      and p.user_id = (select auth.uid())
  )
);
