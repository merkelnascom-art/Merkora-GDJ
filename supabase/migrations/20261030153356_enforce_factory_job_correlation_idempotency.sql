-- Enforce atomic idempotency for a project factory job correlation ID.
-- Existing duplicate check completed before this constraint was applied.
alter table public.project_factory_jobs
add constraint project_factory_jobs_project_correlation_key
unique (project_id, correlation_id);
