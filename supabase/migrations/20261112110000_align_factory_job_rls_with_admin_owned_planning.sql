-- Align the factory-job INSERT policy with the admin-owned planning workflow.
-- Customer scope approval is not part of the internal factory plan approval.
-- External AI processing consent remains a separate prerequisite for any future
-- external AI execution; queue preparation itself performs no external AI call.

drop policy if exists "admins can create factory jobs after exact approvals"
  on public.project_factory_jobs;

create policy "admins can create factory jobs after exact approvals"
on public.project_factory_jobs
for insert
to authenticated
with check (
  is_merkora_admin()
  and requested_by = (select auth.uid())
  and authorized_by = (select auth.uid())
  and exists (
    select 1
    from public.project_memory_plan_versions v
    where v.project_id = project_factory_jobs.project_id
      and v.version = project_factory_jobs.plan_version
      and v.payload_digest = project_factory_jobs.plan_digest
      and v.scope_digest = project_factory_jobs.scope_digest
  )
  and exists (
    select 1
    from public.project_memory_approvals a
    where a.id = any(project_factory_jobs.approval_ids)
      and a.project_id = project_factory_jobs.project_id
      and a.plan_version = project_factory_jobs.plan_version
      and a.plan_digest = project_factory_jobs.plan_digest
      and a.scope_digest = project_factory_jobs.scope_digest
      and a.approval_kind = 'admin_review'
      and a.decision = 'approved'
      and a.actor_role = 'admin'
  )
  and exists (
    select 1
    from public.project_memory_approvals a
    where a.id = any(project_factory_jobs.approval_ids)
      and a.project_id = project_factory_jobs.project_id
      and a.plan_version = project_factory_jobs.plan_version
      and a.plan_digest = project_factory_jobs.plan_digest
      and a.scope_digest = project_factory_jobs.scope_digest
      and a.approval_kind = 'execution_authorization'
      and a.decision = 'approved'
      and a.actor_role = 'admin'
  )
);

comment on policy "admins can create factory jobs after exact approvals"
on public.project_factory_jobs is
  'Requires an allowlisted administrator, the exact plan and scope digests, and both matching admin_review and execution_authorization approvals. Customer plan approval and external AI consent are separate concerns.';
