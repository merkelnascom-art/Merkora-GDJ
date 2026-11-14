drop policy if exists "admins can record plan reviews and execution approvals" on public.project_memory_approvals;
drop policy if exists "client can approve exact scope of own project plan" on public.project_memory_approvals;
create policy "project participants can append permitted approvals" on public.project_memory_approvals for insert to authenticated with check (
 (public.is_merkora_admin() and actor_user_id=(select auth.uid()) and actor_role='admin')
 or
 (actor_user_id=(select auth.uid()) and actor_role='client' and approval_kind='client_scope'
  and exists(select 1 from public.user_projects p where p.id=project_memory_approvals.project_id and p.user_id=(select auth.uid()))
  and exists(select 1 from public.project_memory_plan_versions v where v.project_id=project_memory_approvals.project_id and v.version=project_memory_approvals.plan_version and v.payload_digest=project_memory_approvals.plan_digest and v.scope_digest=project_memory_approvals.scope_digest))
);
drop policy if exists "admins can record project decisions" on public.project_memory_decisions;
drop policy if exists "project owner can record own client decisions" on public.project_memory_decisions;
create policy "project participants can append permitted decisions" on public.project_memory_decisions for insert to authenticated with check (
 (public.is_merkora_admin() and actor_user_id=(select auth.uid()) and actor_role='admin')
 or
 (actor_user_id=(select auth.uid()) and actor_role='client' and exists(select 1 from public.user_projects p where p.id=project_memory_decisions.project_id and p.user_id=(select auth.uid())))
);