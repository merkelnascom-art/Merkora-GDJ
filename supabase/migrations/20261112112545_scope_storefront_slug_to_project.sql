-- Keep the public storefront identifier unique to the exact MerKora project.
update public.project_storefronts
set slug = 'asho-sweet-vh1fwg', updated_at = now()
where project_id = 'MK-MWAWRAVH-1FWG'
  and slug = 'asho-sweet';
