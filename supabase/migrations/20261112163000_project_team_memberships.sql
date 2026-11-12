-- Project-scoped, owner-managed team membership and module permissions.
-- Additive only: existing project and storefront records are preserved.

create table if not exists public.project_team_memberships (
  id uuid primary key default gen_random_uuid(),
  project_id text not null references public.user_projects(id) on delete cascade,
  email text not null check (email = lower(btrim(email)) and char_length(email) between 3 and 320),
  user_id uuid references auth.users(id) on delete cascade,
  status text not null default 'pending'
    check (status in ('pending', 'active', 'revoked')),
  invited_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  accepted_at timestamptz,
  revoked_at timestamptz,
  unique (id, project_id),
  check (status <> 'active' or user_id is not null)
);

create unique index if not exists project_team_pending_email_unique
  on public.project_team_memberships (project_id, email)
  where status = 'pending';

create unique index if not exists project_team_active_user_unique
  on public.project_team_memberships (project_id, user_id)
  where status = 'active' and user_id is not null;

create index if not exists project_team_memberships_user_idx
  on public.project_team_memberships (user_id, project_id)
  where user_id is not null;

create table if not exists public.project_team_module_permissions (
  id uuid primary key default gen_random_uuid(),
  membership_id uuid not null,
  project_id text not null references public.user_projects(id) on delete cascade,
  module_id text not null
    check (module_id ~ '^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$' and char_length(module_id) <= 80),
  can_view boolean not null default true,
  can_edit boolean not null default false,
  created_at timestamptz not null default now(),
  unique (membership_id, module_id),
  foreign key (membership_id, project_id)
    references public.project_team_memberships(id, project_id) on delete cascade,
  check (not can_edit or can_view)
);

create index if not exists project_team_module_permissions_project_module_idx
  on public.project_team_module_permissions (project_id, module_id, membership_id);

alter table public.project_team_memberships enable row level security;
alter table public.project_team_module_permissions enable row level security;

revoke all on table public.project_team_memberships from anon, authenticated;
revoke all on table public.project_team_module_permissions from anon, authenticated;
grant select on table public.project_team_memberships to authenticated;
grant select on table public.project_team_module_permissions to authenticated;

create policy "Project owners and members can read team memberships"
  on public.project_team_memberships
  for select
  to authenticated
  using (
    public.is_merkora_admin()
    or user_id = (select auth.uid())
    or exists (
      select 1 from public.user_projects p
      where p.id = project_team_memberships.project_id
        and p.user_id = (select auth.uid())
    )
  );

create policy "Project owners and members can read module permissions"
  on public.project_team_module_permissions
  for select
  to authenticated
  using (
    public.is_merkora_admin()
    or exists (
      select 1 from public.user_projects p
      where p.id = project_team_module_permissions.project_id
        and p.user_id = (select auth.uid())
    )
    or exists (
      select 1 from public.project_team_memberships m
      where m.id = project_team_module_permissions.membership_id
        and m.project_id = project_team_module_permissions.project_id
        and m.user_id = (select auth.uid())
        and m.status = 'active'
    )
  );

-- Replace owner-only generic module policies with owner/admin/collaborator rules.
drop policy if exists "module data readable by owner or admin" on public.project_module_data;
drop policy if exists "project owners and admins can create module data" on public.project_module_data;
drop policy if exists "project owners and admins can update module data" on public.project_module_data;

create policy "Project module data readable by owner admin or collaborator"
  on public.project_module_data
  for select
  to authenticated
  using (
    public.is_merkora_admin()
    or exists (
      select 1 from public.user_projects p
      where p.id = project_module_data.project_id
        and p.user_id = (select auth.uid())
    )
    or exists (
      select 1
      from public.project_team_memberships m
      join public.project_team_module_permissions g
        on g.membership_id = m.id and g.project_id = m.project_id
      where m.project_id = project_module_data.project_id
        and m.user_id = (select auth.uid())
        and m.status = 'active'
        and g.module_id = project_module_data.module_id
        and g.can_view
    )
  );

create policy "Project owners admins and collaborators can create module data"
  on public.project_module_data
  for insert
  to authenticated
  with check (
    updated_by = (select auth.uid())
    and (
      public.is_merkora_admin()
      or exists (
        select 1 from public.user_projects p
        where p.id = project_module_data.project_id
          and p.user_id = (select auth.uid())
      )
      or exists (
        select 1
        from public.project_team_memberships m
        join public.project_team_module_permissions g
          on g.membership_id = m.id and g.project_id = m.project_id
        where m.project_id = project_module_data.project_id
          and m.user_id = (select auth.uid())
          and m.status = 'active'
          and g.module_id = project_module_data.module_id
          and g.can_edit
      )
    )
  );

create policy "Project owners admins and collaborators can update module data"
  on public.project_module_data
  for update
  to authenticated
  using (
    public.is_merkora_admin()
    or exists (
      select 1 from public.user_projects p
      where p.id = project_module_data.project_id
        and p.user_id = (select auth.uid())
    )
    or exists (
      select 1
      from public.project_team_memberships m
      join public.project_team_module_permissions g
        on g.membership_id = m.id and g.project_id = m.project_id
      where m.project_id = project_module_data.project_id
        and m.user_id = (select auth.uid())
        and m.status = 'active'
        and g.module_id = project_module_data.module_id
        and g.can_edit
    )
  )
  with check (
    updated_by = (select auth.uid())
    and (
      public.is_merkora_admin()
      or exists (
        select 1 from public.user_projects p
        where p.id = project_module_data.project_id
          and p.user_id = (select auth.uid())
      )
      or exists (
        select 1
        from public.project_team_memberships m
        join public.project_team_module_permissions g
          on g.membership_id = m.id and g.project_id = m.project_id
        where m.project_id = project_module_data.project_id
          and m.user_id = (select auth.uid())
          and m.status = 'active'
          and g.module_id = project_module_data.module_id
          and g.can_edit
      )
    )
  );

-- Staff can read the private product catalogue only when the owner grants view access.
create policy "Store collaborators can read assigned product catalogue"
  on public.project_store_products
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.project_storefronts s
      join public.project_team_memberships m on m.project_id = s.project_id
      join public.project_team_module_permissions g
        on g.membership_id = m.id and g.project_id = m.project_id
      where s.id = project_store_products.storefront_id
        and m.user_id = (select auth.uid())
        and m.status = 'active'
        and g.module_id = 'catalogue-de-gateau-et-de-patisserie'
        and g.can_view
    )
  );

create policy "Store collaborators can insert assigned products"
  on public.project_store_products
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.project_storefronts s
      join public.project_team_memberships m on m.project_id = s.project_id
      join public.project_team_module_permissions g
        on g.membership_id = m.id and g.project_id = m.project_id
      where s.id = project_store_products.storefront_id
        and m.user_id = (select auth.uid())
        and m.status = 'active'
        and g.module_id = 'catalogue-de-gateau-et-de-patisserie'
        and g.can_edit
    )
  );

create policy "Store collaborators can update assigned products"
  on public.project_store_products
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.project_storefronts s
      join public.project_team_memberships m on m.project_id = s.project_id
      join public.project_team_module_permissions g
        on g.membership_id = m.id and g.project_id = m.project_id
      where s.id = project_store_products.storefront_id
        and m.user_id = (select auth.uid())
        and m.status = 'active'
        and g.module_id = 'catalogue-de-gateau-et-de-patisserie'
        and g.can_edit
    )
  )
  with check (
    exists (
      select 1
      from public.project_storefronts s
      join public.project_team_memberships m on m.project_id = s.project_id
      join public.project_team_module_permissions g
        on g.membership_id = m.id and g.project_id = m.project_id
      where s.id = project_store_products.storefront_id
        and m.user_id = (select auth.uid())
        and m.status = 'active'
        and g.module_id = 'catalogue-de-gateau-et-de-patisserie'
        and g.can_edit
    )
  );

-- Staff may see/process orders only when the owner grants access to the order module.
create policy "Store collaborators can read assigned orders"
  on public.project_store_orders
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.project_storefronts s
      join public.project_team_memberships m on m.project_id = s.project_id
      join public.project_team_module_permissions g
        on g.membership_id = m.id and g.project_id = m.project_id
      where s.id = project_store_orders.storefront_id
        and m.user_id = (select auth.uid())
        and m.status = 'active'
        and g.module_id = 'panier-et-validation-de-commande'
        and g.can_view
    )
  );

create policy "Store collaborators can update assigned order status"
  on public.project_store_orders
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.project_storefronts s
      join public.project_team_memberships m on m.project_id = s.project_id
      join public.project_team_module_permissions g
        on g.membership_id = m.id and g.project_id = m.project_id
      where s.id = project_store_orders.storefront_id
        and m.user_id = (select auth.uid())
        and m.status = 'active'
        and g.module_id = 'panier-et-validation-de-commande'
        and g.can_edit
    )
  )
  with check (
    exists (
      select 1
      from public.project_storefronts s
      join public.project_team_memberships m on m.project_id = s.project_id
      join public.project_team_module_permissions g
        on g.membership_id = m.id and g.project_id = m.project_id
      where s.id = project_store_orders.storefront_id
        and m.user_id = (select auth.uid())
        and m.status = 'active'
        and g.module_id = 'panier-et-validation-de-commande'
        and g.can_edit
    )
  );

create policy "Store collaborators can read assigned custom requests"
  on public.project_store_custom_requests
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.project_storefronts s
      join public.project_team_memberships m on m.project_id = s.project_id
      join public.project_team_module_permissions g
        on g.membership_id = m.id and g.project_id = m.project_id
      where s.id = project_store_custom_requests.storefront_id
        and m.user_id = (select auth.uid())
        and m.status = 'active'
        and g.module_id = 'commande-personnalisee'
        and g.can_view
    )
  );

create policy "Store collaborators can update assigned custom request status"
  on public.project_store_custom_requests
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.project_storefronts s
      join public.project_team_memberships m on m.project_id = s.project_id
      join public.project_team_module_permissions g
        on g.membership_id = m.id and g.project_id = m.project_id
      where s.id = project_store_custom_requests.storefront_id
        and m.user_id = (select auth.uid())
        and m.status = 'active'
        and g.module_id = 'commande-personnalisee'
        and g.can_edit
    )
  )
  with check (
    exists (
      select 1
      from public.project_storefronts s
      join public.project_team_memberships m on m.project_id = s.project_id
      join public.project_team_module_permissions g
        on g.membership_id = m.id and g.project_id = m.project_id
      where s.id = project_store_custom_requests.storefront_id
        and m.user_id = (select auth.uid())
        and m.status = 'active'
        and g.module_id = 'commande-personnalisee'
        and g.can_edit
    )
  );

-- Status-only updates prevent staff (and customer clients) from changing prices or customer identity.
revoke update on table public.project_store_orders from authenticated;
grant update (status) on table public.project_store_orders to authenticated;
revoke update on table public.project_store_custom_requests from authenticated;
grant update (status) on table public.project_store_custom_requests to authenticated;

-- Product images are public display assets, but only owners and staff with catalogue edit access can upload.
create policy "Store collaborators can upload assigned product photos"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'project-store-product-images'
    and name ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/products/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|webp)$'
    and exists (
      select 1
      from public.project_storefronts s
      join public.project_team_memberships m on m.project_id = s.project_id
      join public.project_team_module_permissions g
        on g.membership_id = m.id and g.project_id = m.project_id
      where s.id::text = split_part(storage.objects.name, '/', 1)
        and m.user_id = (select auth.uid())
        and m.status = 'active'
        and g.module_id = 'catalogue-de-gateau-et-de-patisserie'
        and g.can_edit
    )
  );

-- Authorized staff may view private inspiration photos for custom requests in their assigned module.
create policy "Store collaborators can read assigned reference photos"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'project-store-references'
    and exists (
      select 1
      from public.project_store_custom_requests r
      join public.project_storefronts s on s.id = r.storefront_id
      join public.project_team_memberships m on m.project_id = s.project_id
      join public.project_team_module_permissions g
        on g.membership_id = m.id and g.project_id = m.project_id
      where r.reference_image_path = storage.objects.name
        and m.user_id = (select auth.uid())
        and m.status = 'active'
        and g.module_id = 'commande-personnalisee'
        and g.can_view
    )
  );
