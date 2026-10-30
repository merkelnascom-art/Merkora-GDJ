-- Private storage for generated source manifests and build reports.
-- No existing buckets, objects, tables, or business records are modified.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'merkora-factory-artifacts',
  'merkora-factory-artifacts',
  false,
  20971520,
  array['application/json']::text[]
)
on conflict (id) do nothing;

create policy "Merkora factory artifacts admin upload"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'merkora-factory-artifacts'
  and public.is_merkora_admin()
  and exists (
    select 1
    from public.project_factory_jobs j
    where j.project_id = (storage.foldername(name))[1]
      and j.id::text = (storage.foldername(name))[2]
  )
);

create policy "Merkora factory artifacts owner and admin read"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'merkora-factory-artifacts'
  and (
    public.is_merkora_admin()
    or exists (
      select 1
      from public.user_projects p
      join public.project_factory_jobs j on j.project_id = p.id
      where p.id = (storage.foldername(name))[1]
        and j.id::text = (storage.foldername(name))[2]
        and p.user_id = (select auth.uid())
        and j.status in ('awaiting_approval', 'ready', 'delivered')
    )
  )
);
