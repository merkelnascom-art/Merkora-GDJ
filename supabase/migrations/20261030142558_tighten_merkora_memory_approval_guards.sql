-- Bind customer consent and factory jobs to the exact immutable plan scope.
alter table public.project_memory_plan_versions add column scope_digest text not null check (scope_digest ~ '^[a-f0-9]{64}$');
drop policy if exists "project owner or admin can add brief versions" on public.project_memory_brief_versions;
create policy "admins can add brief versions" on public.project_memory_brief_versions for insert to authenticated with check (public.is_merkora_admin() and created_by = (select auth.uid()));
drop policy if exists "client can approve exact scope of own project plan" on public.project_memory_approvals;
create policy "client can approve exact scope of own project plan" on public.project_memory_approvals for insert to authenticated with check (
 actor_user_id = (select auth.uid()) and actor_role = 'client' and approval_kind = 'client_scope'
 and exists (select 1 from public.user_projects p where p.id = project_memory_approvals.project_id and p.user_id = (select auth.uid()))
 and exists (select 1 from public.project_memory_plan_versions v where v.project_id = project_memory_approvals.project_id and v.version = project_memory_approvals.plan_version and v.payload_digest = project_memory_approvals.plan_digest and v.scope_digest = project_memory_approvals.scope_digest)
);
create policy "admins can record project decisions" on public.project_memory_decisions for insert to authenticated with check (public.is_merkora_admin() and actor_user_id = (select auth.uid()) and actor_role = 'admin');
drop policy if exists "admins can create factory jobs" on public.project_factory_jobs;
create policy "admins can create factory jobs after exact approvals" on public.project_factory_jobs for insert to authenticated with check (
 public.is_merkora_admin() and requested_by = (select auth.uid()) and authorized_by = (select auth.uid())
 and exists (select 1 from public.project_memory_plan_versions v where v.project_id = project_factory_jobs.project_id and v.version = project_factory_jobs.plan_version and v.payload_digest = project_factory_jobs.plan_digest and v.scope_digest = project_factory_jobs.scope_digest)
 and exists (select 1 from public.project_memory_approvals a where a.project_id = project_factory_jobs.project_id and a.plan_version = project_factory_jobs.plan_version and a.plan_digest = project_factory_jobs.plan_digest and a.scope_digest = project_factory_jobs.scope_digest and a.approval_kind = 'client_scope' and a.decision = 'approved')
 and exists (select 1 from public.project_memory_approvals a where a.project_id = project_factory_jobs.project_id and a.plan_version = project_factory_jobs.plan_version and a.plan_digest = project_factory_jobs.plan_digest and a.scope_digest = project_factory_jobs.scope_digest and a.approval_kind = 'admin_review' and a.decision = 'approved')
 and exists (select 1 from public.project_memory_approvals a where a.project_id = project_factory_jobs.project_id and a.plan_version = project_factory_jobs.plan_version and a.plan_digest = project_factory_jobs.plan_digest and a.scope_digest = project_factory_jobs.scope_digest and a.approval_kind = 'execution_authorization' and a.decision = 'approved')
);