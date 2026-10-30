-- Allow the private factory artifact bucket to store generated source archives.
-- The bucket remains private and existing objects are not modified.
update storage.buckets
set allowed_mime_types = array['application/json', 'application/gzip']::text[]
where id = 'merkora-factory-artifacts';
