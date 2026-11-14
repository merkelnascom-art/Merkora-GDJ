-- Additive durable mission ledger for the existing MerKora factory.
-- The historical five-task queue remains intact; this ledger stores each specialist mission.

create table public.project_factory_missions (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null,
  project_id text not null,
  workflow_id text not null check (char_length(workflow_id) between 1 and 100),
  mission_id text not null check (mission_id ~ '^[a-z0-9][a-z0-9-]{0,79}$'),
  phase_id text not null check (char_length(phase_id) between 1 and 100),
  pole_id text not null check (pole_id in (
    'intelligence','conception','fabrication','controle',
    'exploitation','relation_client','gestion_administration'
  )),
  agent_id text not null check (agent_id ~ '^[a-z0-9][a-z0-9-]{0,99}$'),
  runtime_role text not null check (runtime_role in (
    'analyst','architect','implementer','reviewer','tester','cross_checker',
    'designer','functional_analyst','technical_writer','estimator',
    'governance_advisor','operations_planner','customer_success'
  )),
  sequence integer not null check (sequence > 0),
  depends_on text[] not null default '{}',
  mission_packet jsonb not null check (jsonb_typeof(mission_packet) = 'object'),
  tool_permissions jsonb not null default '[]'::jsonb check (jsonb_typeof(tool_permissions) = 'array'),
  execution_mode text not null default 'model_only' check (execution_mode = 'model_only'),
  status text not null default 'ready' check (status in (
    'ready','claimed','running','blocked','completed','failed','cancelled'
  )),
  attempt_count integer not null default 0 check (attempt_count >= 0),
  max_attempts integer not null default 3 check (max_attempts between 1 and 10),
  lease_owner text,
  lease_token uuid,
  lease_expires_at timestamptz,
  result jsonb check (result is null or jsonb_typeof(result) = 'object'),
  result_digest text check (result_digest is null or result_digest ~ '^[a-f0-9]{64}$'),
  verification jsonb check (verification is null or jsonb_typeof(verification) = 'object'),
  block_reason text not null default '' check (char_length(block_reason) <= 2000),
  last_error_safe text not null default '' check (char_length(last_error_safe) <= 2000),
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (job_id, mission_id),
  unique (id, job_id, project_id),
  foreign key (job_id, project_id)
    references public.project_factory_jobs(id, project_id) on delete restrict,
  check (
    (status in ('claimed','running')
      and lease_owner is not null and lease_token is not null and lease_expires_at is not null)
    or
    (status not in ('claimed','running')
      and lease_owner is null and lease_token is null and lease_expires_at is null)
  )
);

create table public.project_factory_mission_attempts (
  id uuid primary key default gen_random_uuid(),
  mission_row_id uuid not null,
  job_id uuid not null,
  project_id text not null,
  mission_id text not null,
  attempt_number integer not null check (attempt_number > 0),
  worker_id text not null check (char_length(worker_id) between 1 and 160),
  lease_token uuid not null,
  outcome text not null check (outcome in (
    'active','completed','failed','blocked','lease_expired','cancelled'
  )),
  claimed_at timestamptz not null default now(),
  started_at timestamptz,
  finished_at timestamptz,
  failure_reason_safe text not null default '' check (char_length(failure_reason_safe) <= 2000),
  result_digest text check (result_digest is null or result_digest ~ '^[a-f0-9]{64}$'),
  created_at timestamptz not null default now(),
  unique (mission_row_id, attempt_number),
  unique (mission_row_id, lease_token),
  foreign key (mission_row_id, job_id, project_id)
    references public.project_factory_missions(id, job_id, project_id) on delete restrict
);

create table public.project_factory_mission_events (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null,
  project_id text not null,
  mission_row_id uuid,
  mission_id text,
  event_type text not null check (event_type in (
    'mission_created','mission_claimed','mission_started','mission_heartbeat',
    'mission_completed','mission_failed','mission_blocked','mission_unblocked',
    'mission_lease_expired','job_awaiting_human_review','job_blocked','job_failed'
  )),
  actor_type text not null check (actor_type in ('system','worker','admin')),
  actor_id text not null default '' check (char_length(actor_id) <= 160),
  idempotency_key text,
  payload jsonb not null default '{}'::jsonb check (jsonb_typeof(payload) = 'object'),
  created_at timestamptz not null default now(),
  foreign key (job_id, project_id)
    references public.project_factory_jobs(id, project_id) on delete restrict,
  foreign key (mission_row_id, job_id, project_id)
    references public.project_factory_missions(id, job_id, project_id) on delete restrict,
  unique (job_id, idempotency_key)
);

create index project_factory_missions_job_state_sequence_idx
  on public.project_factory_missions(job_id, status, sequence);
create index project_factory_missions_lease_expiry_idx
  on public.project_factory_missions(lease_expires_at)
  where status in ('claimed','running');
create index project_factory_mission_attempts_job_created_idx
  on public.project_factory_mission_attempts(job_id, created_at desc);
create index project_factory_mission_events_job_created_idx
  on public.project_factory_mission_events(job_id, created_at desc);

alter table public.project_factory_missions enable row level security;
alter table public.project_factory_mission_attempts enable row level security;
alter table public.project_factory_mission_events enable row level security;

revoke all on public.project_factory_missions,
  public.project_factory_mission_attempts,
  public.project_factory_mission_events from public, anon;
grant select on public.project_factory_missions,
  public.project_factory_mission_attempts,
  public.project_factory_mission_events to authenticated;
grant all on public.project_factory_missions,
  public.project_factory_mission_attempts,
  public.project_factory_mission_events to service_role;

create policy "admins can read specialist factory missions"
  on public.project_factory_missions for select to authenticated
  using (public.is_merkora_admin());
create policy "admins can read specialist factory attempts"
  on public.project_factory_mission_attempts for select to authenticated
  using (public.is_merkora_admin());
create policy "admins can read specialist factory mission events"
  on public.project_factory_mission_events for select to authenticated
  using (public.is_merkora_admin());

comment on table public.project_factory_missions is
  'Durable per-specialist mission state. Tool execution remains disabled; missions are model-only until separately authorized.';
comment on table public.project_factory_mission_attempts is
  'Append-only attempt history with worker leases, outcomes and safe failure reasons.';
comment on table public.project_factory_mission_events is
  'Append-only audit trail for specialist mission lifecycle transitions.';

-- Materialize the exact mission packets stored in the immutable workflow manifest.
create or replace function public.initialize_factory_specialist_missions(
  p_job_id uuid,
  p_project_id text
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, pg_temp
as $$
declare
  v_job public.project_factory_jobs%rowtype;
  v_plan_version public.project_memory_plan_versions%rowtype;
  v_workflow jsonb;
  v_plan jsonb;
  v_assignment jsonb;
  v_step jsonb;
  v_mission jsonb;
  v_count integer := 0;
  v_existing integer := 0;
begin
  select * into v_job
  from public.project_factory_jobs
  where id = p_job_id and project_id = p_project_id
  for update;

  if not found or v_job.status not in ('queued','building') then
    raise exception 'specialist_factory_job_not_claimable' using errcode = 'P0001';
  end if;

  v_workflow := v_job.manifest -> 'specialistWorkflow';
  if jsonb_typeof(v_workflow) is distinct from 'object'
     or v_workflow ->> 'executionEnabled' is distinct from 'false'
     or v_workflow ->> 'projectId' is distinct from p_project_id
     or nullif(v_workflow ->> 'workflowId','') is null
     or (v_workflow -> 'sourceVersions' ->> 'planVersion')::integer is distinct from v_job.plan_version
     or jsonb_typeof(v_workflow -> 'plan' -> 'missionPlan' -> 'steps') is distinct from 'array'
     or jsonb_typeof(v_workflow -> 'plan' -> 'assignments') is distinct from 'array' then
    raise exception 'specialist_workflow_manifest_invalid' using errcode = '22023';
  end if;

  select * into v_plan_version
  from public.project_memory_plan_versions
  where project_id = p_project_id and version = v_job.plan_version;

  if not found or v_plan_version.payload_digest <> v_job.plan_digest
     or v_plan_version.scope_digest <> v_job.scope_digest then
    raise exception 'specialist_workflow_plan_digest_mismatch' using errcode = 'P0001';
  end if;

  select count(*) into v_existing
  from public.project_factory_missions
  where job_id = p_job_id and project_id = p_project_id;

  if v_existing > 0 then
    if v_existing <> jsonb_array_length(v_workflow -> 'plan' -> 'missionPlan' -> 'steps') then
      raise exception 'specialist_mission_initialization_incomplete' using errcode = 'P0001';
    end if;
    return jsonb_build_object('initialized', false, 'missionCount', v_existing);
  end if;

  v_plan := v_workflow -> 'plan';
  if jsonb_array_length(v_plan -> 'missionPlan' -> 'steps') < 1
     or jsonb_array_length(v_plan -> 'missionPlan' -> 'steps') > 100
     or jsonb_array_length(v_plan -> 'assignments') <>
        jsonb_array_length(v_plan -> 'missionPlan' -> 'steps') then
    raise exception 'specialist_mission_count_invalid' using errcode = '22023';
  end if;

  for v_assignment in
    select value from jsonb_array_elements(v_plan -> 'assignments')
  loop
    select value into v_step
    from jsonb_array_elements(v_plan -> 'missionPlan' -> 'steps')
    where value ->> 'missionId' = v_assignment ->> 'missionId'
    limit 1;

    v_mission := v_assignment -> 'mission';
    if v_step is null
       or v_assignment ->> 'status' <> 'prepared'
       or nullif(v_assignment ->> 'agentId','') is null
       or nullif(v_assignment ->> 'phaseId','') is null
       or nullif(v_assignment ->> 'poleId','') is null
       or nullif(v_assignment ->> 'runtimeRole','') is null
       or jsonb_typeof(v_mission) is distinct from 'object'
       or v_mission ->> 'missionId' is distinct from v_assignment ->> 'missionId'
       or v_mission ->> 'projectId' is distinct from p_project_id
       or v_mission ->> 'role' is distinct from v_assignment ->> 'runtimeRole' then
      raise exception 'specialist_mission_packet_invalid' using errcode = '22023';
    end if;

    insert into public.project_factory_missions (
      job_id, project_id, workflow_id, mission_id, phase_id, pole_id,
      agent_id, runtime_role, sequence, depends_on, mission_packet,
      tool_permissions, execution_mode, status
    ) values (
      p_job_id,
      p_project_id,
      v_workflow ->> 'workflowId',
      v_assignment ->> 'missionId',
      v_assignment ->> 'phaseId',
      v_assignment ->> 'poleId',
      v_assignment ->> 'agentId',
      v_assignment ->> 'runtimeRole',
      (v_step ->> 'sequence')::integer,
      array(select jsonb_array_elements_text(coalesce(v_step -> 'dependsOn','[]'::jsonb))),
      v_mission,
      '[]'::jsonb,
      'model_only',
      'ready'
    );

    v_count := v_count + 1;
  end loop;

  if v_count <> jsonb_array_length(v_plan -> 'missionPlan' -> 'steps') then
    raise exception 'specialist_mission_assignment_mismatch' using errcode = '22023';
  end if;

  insert into public.project_factory_mission_events (
    job_id, project_id, event_type, actor_type, actor_id, idempotency_key, payload
  ) values (
    p_job_id, p_project_id, 'mission_created', 'system', '',
    'missions-initialized:' || (v_workflow ->> 'workflowId'),
    jsonb_build_object('workflowId', v_workflow ->> 'workflowId', 'missionCount', v_count)
  );

  return jsonb_build_object('initialized', true, 'missionCount', v_count);
end;
$$;

-- Claim ready missions atomically, reclaim expired leases, and append attempts/events.
create or replace function public.claim_factory_specialist_missions(
  p_job_id uuid,
  p_project_id text,
  p_worker_id text,
  p_run_id text,
  p_run_attempt integer,
  p_limit integer default 3,
  p_lease_seconds integer default 180
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, pg_temp
as $$
declare
  v_job public.project_factory_jobs%rowtype;
  v_expired record;
  v_missions jsonb := '[]'::jsonb;
  v_workflow_id text;
begin
  if nullif(trim(p_worker_id),'') is null or char_length(p_worker_id) > 160
     or p_run_id is null or p_run_id !~ '^[0-9]+
    raise exception 'specialist_worker_claim_arguments_invalid' using errcode = '22023';
  end if;

  select * into v_job
  from public.project_factory_jobs
  where id = p_job_id and project_id = p_project_id
  for update;

  if not found or v_job.status not in ('queued','building') then
    raise exception 'specialist_factory_job_not_claimable' using errcode = 'P0001';
  end if;

  v_workflow_id := v_job.manifest -> 'specialistWorkflow' ->> 'workflowId';
  if nullif(v_workflow_id,'') is null
     or v_job.manifest -> 'specialistWorkflow' ->> 'executionEnabled' is distinct from 'false' then
    raise exception 'specialist_workflow_manifest_invalid' using errcode = '22023';
  end if;

  for v_expired in
    select id, mission_id, lease_token, attempt_count
    from public.project_factory_missions
    where job_id = p_job_id and project_id = p_project_id
      and status in ('claimed','running') and lease_expires_at <= now()
    for update skip locked
  loop
    update public.project_factory_mission_attempts
      set outcome = 'lease_expired', finished_at = now(),
          failure_reason_safe = 'Worker lease expired before a verified result was persisted.'
      where mission_row_id = v_expired.id and lease_token = v_expired.lease_token
        and outcome = 'active';

    update public.project_factory_missions
      set status = case when attempt_count >= max_attempts then 'failed' else 'ready' end,
          lease_owner = null, lease_token = null, lease_expires_at = null,
          last_error_safe = 'Worker lease expired.', updated_at = now()
      where id = v_expired.id;

    insert into public.project_factory_mission_events (
      job_id, project_id, mission_row_id, mission_id, event_type, actor_type, actor_id,
      idempotency_key, payload
    ) values (
      p_job_id, p_project_id, v_expired.id, v_expired.mission_id,
      'mission_lease_expired', 'system', '',
      'lease-expired:' || v_expired.mission_id || ':' || v_expired.attempt_count,
      jsonb_build_object('attempt', v_expired.attempt_count)
    ) on conflict (job_id, idempotency_key) do nothing;
  end loop;

  if exists (
    select 1 from public.project_factory_missions
    where job_id = p_job_id and project_id = p_project_id
      and status in ('claimed','running') and lease_owner <> p_worker_id
      and lease_expires_at > now()
  ) then
    raise exception 'specialist_worker_lease_owned_by_another_run' using errcode = 'P0001';
  end if;

  update public.project_factory_jobs
  set status = 'building',
      manifest = manifest || jsonb_build_object(
        'specialistWorker',
        jsonb_build_object('workerId', p_worker_id, 'runId', p_run_id, 'runAttempt', p_run_attempt)
      ),
      updated_at = now()
  where id = p_job_id and project_id = p_project_id;

  with candidates as (
    select m.id
    from public.project_factory_missions m
    where m.job_id = p_job_id and m.project_id = p_project_id
      and m.status = 'ready' and m.attempt_count < m.max_attempts
      and not exists (
        select 1
        from unnest(m.depends_on) as dependency(mission_id)
        left join public.project_factory_missions dependency_mission
          on dependency_mission.job_id = m.job_id
          and dependency_mission.mission_id = dependency.mission_id
        where dependency_mission.id is null or dependency_mission.status <> 'completed'
      )
    order by m.sequence
    limit p_limit
    for update skip locked
  ),
  claimed as (
    update public.project_factory_missions m
    set status = 'claimed',
        lease_owner = p_worker_id,
        lease_token = gen_random_uuid(),
        lease_expires_at = now() + make_interval(secs => p_lease_seconds),
        attempt_count = attempt_count + 1,
        updated_at = now()
    from candidates c
    where m.id = c.id
    returning m.*
  ),
  attempts as (
    insert into public.project_factory_mission_attempts (
      mission_row_id, job_id, project_id, mission_id, attempt_number,
      worker_id, lease_token, outcome
    )
    select id, job_id, project_id, mission_id, attempt_count, p_worker_id, lease_token, 'active'
    from claimed
    returning mission_row_id
  ),
  events as (
    insert into public.project_factory_mission_events (
      job_id, project_id, mission_row_id, mission_id, event_type,
      actor_type, actor_id, idempotency_key, payload
    )
    select job_id, project_id, id, mission_id, 'mission_claimed',
      'worker', p_worker_id,
      'claimed:' || mission_id || ':' || attempt_count,
      jsonb_build_object('attempt', attempt_count, 'leaseExpiresAt', lease_expires_at)
    from claimed
    on conflict (job_id, idempotency_key) do nothing
    returning id
  )
  select coalesce(jsonb_agg(to_jsonb(claimed) order by claimed.sequence), '[]'::jsonb)
  into v_missions
  from claimed;

  return jsonb_build_object(
    'jobId', p_job_id,
    'projectId', p_project_id,
    'workflowId', v_workflow_id,
    'claimedCount', jsonb_array_length(v_missions),
    'missions', v_missions
  );
end;
$$;

create or replace function public.start_factory_specialist_mission(
  p_mission_row_id uuid,
  p_worker_id text,
  p_lease_token uuid,
  p_lease_seconds integer default 180
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, pg_temp
as $$
declare
  v_mission public.project_factory_missions%rowtype;
begin
  if p_lease_seconds < 30 or p_lease_seconds > 900 then
    raise exception 'specialist_lease_duration_invalid' using errcode = '22023';
  end if;
  update public.project_factory_missions
  set status = 'running', started_at = coalesce(started_at, now()),
      lease_expires_at = now() + make_interval(secs => p_lease_seconds), updated_at = now()
  where id = p_mission_row_id and lease_owner = p_worker_id
    and lease_token = p_lease_token and status = 'claimed'
  returning * into v_mission;
  if not found then raise exception 'specialist_mission_lease_mismatch' using errcode = 'P0001'; end if;

  update public.project_factory_mission_attempts
  set started_at = coalesce(started_at, now())
  where mission_row_id = v_mission.id and lease_token = p_lease_token and outcome = 'active';

  insert into public.project_factory_mission_events (
    job_id, project_id, mission_row_id, mission_id, event_type, actor_type, actor_id,
    idempotency_key, payload
  ) values (
    v_mission.job_id, v_mission.project_id, v_mission.id, v_mission.mission_id,
    'mission_started', 'worker', p_worker_id,
    'started:' || v_mission.mission_id || ':' || v_mission.attempt_count,
    jsonb_build_object('attempt', v_mission.attempt_count)
  ) on conflict (job_id, idempotency_key) do nothing;

  return jsonb_build_object('missionId', v_mission.mission_id, 'status', v_mission.status);
end;
$$;

create or replace function public.heartbeat_factory_specialist_mission(
  p_mission_row_id uuid,
  p_worker_id text,
  p_lease_token uuid,
  p_lease_seconds integer default 180
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, pg_temp
as $$
declare
  v_mission public.project_factory_missions%rowtype;
begin
  if p_lease_seconds < 30 or p_lease_seconds > 900 then
    raise exception 'specialist_lease_duration_invalid' using errcode = '22023';
  end if;
  update public.project_factory_missions
  set lease_expires_at = now() + make_interval(secs => p_lease_seconds), updated_at = now()
  where id = p_mission_row_id and lease_owner = p_worker_id
    and lease_token = p_lease_token and status in ('claimed','running')
  returning * into v_mission;
  if not found then raise exception 'specialist_mission_lease_mismatch' using errcode = 'P0001'; end if;

  insert into public.project_factory_mission_events (
    job_id, project_id, mission_row_id, mission_id, event_type, actor_type, actor_id,
    idempotency_key, payload
  ) values (
    v_mission.job_id, v_mission.project_id, v_mission.id, v_mission.mission_id,
    'mission_heartbeat', 'worker', p_worker_id,
    'heartbeat:' || v_mission.mission_id || ':' || v_mission.attempt_count || ':' || floor(extract(epoch from now()) / 30)::text,
    jsonb_build_object('leaseExpiresAt', v_mission.lease_expires_at)
  ) on conflict (job_id, idempotency_key) do nothing;

  return jsonb_build_object('missionId', v_mission.mission_id, 'leaseExpiresAt', v_mission.lease_expires_at);
end;
$$;

create or replace function public.complete_factory_specialist_mission(
  p_mission_row_id uuid,
  p_worker_id text,
  p_lease_token uuid,
  p_result jsonb,
  p_result_digest text
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, pg_temp
as $$
declare
  v_mission public.project_factory_missions%rowtype;
begin
  if jsonb_typeof(p_result) is distinct from 'object'
     or p_result ->> 'contractVersion' is distinct from '1'
     or p_result ->> 'status' is distinct from 'completed'
     or p_result ->> 'missionId' is distinct from (
       select mission_id from public.project_factory_missions where id = p_mission_row_id
     )
     or p_result ->> 'projectId' is distinct from (
       select project_id from public.project_factory_missions where id = p_mission_row_id
     )
     or p_result_digest is null or p_result_digest !~ '^[a-f0-9]{64}
     or jsonb_typeof(p_result #> '{verification,failed}') is distinct from 'array'
     or jsonb_array_length(p_result #> '{verification,failed}') <> 0 then
    raise exception 'specialist_mission_result_invalid' using errcode = '22023';
  end if;

  update public.project_factory_missions
  set status = 'completed', result = p_result, result_digest = p_result_digest,
      verification = p_result -> 'verification',
      lease_owner = null, lease_token = null, lease_expires_at = null,
      completed_at = now(), updated_at = now(), last_error_safe = ''
  where id = p_mission_row_id and lease_owner = p_worker_id
    and lease_token = p_lease_token and status = 'running'
  returning * into v_mission;
  if not found then raise exception 'specialist_mission_lease_mismatch' using errcode = 'P0001'; end if;

  update public.project_factory_mission_attempts
  set outcome = 'completed', result_digest = p_result_digest, finished_at = now()
  where mission_row_id = v_mission.id and lease_token = p_lease_token and outcome = 'active';

  insert into public.project_factory_mission_events (
    job_id, project_id, mission_row_id, mission_id, event_type, actor_type, actor_id,
    idempotency_key, payload
  ) values (
    v_mission.job_id, v_mission.project_id, v_mission.id, v_mission.mission_id,
    'mission_completed', 'worker', p_worker_id,
    'completed:' || v_mission.mission_id || ':' || v_mission.attempt_count,
    jsonb_build_object('resultDigest', p_result_digest, 'providerId', p_result ->> 'providerId')
  ) on conflict (job_id, idempotency_key) do nothing;

  return jsonb_build_object('missionId', v_mission.mission_id, 'status', v_mission.status);
end;
$$;

create or replace function public.fail_factory_specialist_mission(
  p_mission_row_id uuid,
  p_worker_id text,
  p_lease_token uuid,
  p_reason text
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, pg_temp
as $$
declare
  v_mission public.project_factory_missions%rowtype;
  v_next_status text;
begin
  update public.project_factory_missions
  set status = case when attempt_count >= max_attempts then 'failed' else 'ready' end,
      lease_owner = null, lease_token = null, lease_expires_at = null,
      last_error_safe = left(coalesce(nullif(trim(p_reason),''),'specialist_mission_failed'), 2000),
      updated_at = now()
  where id = p_mission_row_id and lease_owner = p_worker_id
    and lease_token = p_lease_token and status in ('claimed','running')
  returning * into v_mission;
  if not found then raise exception 'specialist_mission_lease_mismatch' using errcode = 'P0001'; end if;
  v_next_status := v_mission.status;

  update public.project_factory_mission_attempts
  set outcome = 'failed', failure_reason_safe = v_mission.last_error_safe, finished_at = now()
  where mission_row_id = v_mission.id and lease_token = p_lease_token and outcome = 'active';

  insert into public.project_factory_mission_events (
    job_id, project_id, mission_row_id, mission_id, event_type, actor_type, actor_id,
    idempotency_key, payload
  ) values (
    v_mission.job_id, v_mission.project_id, v_mission.id, v_mission.mission_id,
    'mission_failed', 'worker', p_worker_id,
    'failed:' || v_mission.mission_id || ':' || v_mission.attempt_count,
    jsonb_build_object('status', v_next_status, 'reason', v_mission.last_error_safe)
  ) on conflict (job_id, idempotency_key) do nothing;

  return jsonb_build_object('missionId', v_mission.mission_id, 'status', v_next_status);
end;
$$;

create or replace function public.block_factory_specialist_mission(
  p_mission_row_id uuid,
  p_worker_id text,
  p_lease_token uuid,
  p_reason text
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, pg_temp
as $$
declare
  v_mission public.project_factory_missions%rowtype;
begin
  update public.project_factory_missions
  set status = 'blocked', block_reason = left(coalesce(nullif(trim(p_reason),''),'human_approval_required'), 2000),
      lease_owner = null, lease_token = null, lease_expires_at = null, updated_at = now()
  where id = p_mission_row_id and lease_owner = p_worker_id
    and lease_token = p_lease_token and status in ('claimed','running')
  returning * into v_mission;
  if not found then raise exception 'specialist_mission_lease_mismatch' using errcode = 'P0001'; end if;

  update public.project_factory_mission_attempts
  set outcome = 'blocked', failure_reason_safe = v_mission.block_reason, finished_at = now()
  where mission_row_id = v_mission.id and lease_token = p_lease_token and outcome = 'active';

  insert into public.project_factory_mission_events (
    job_id, project_id, mission_row_id, mission_id, event_type, actor_type, actor_id,
    idempotency_key, payload
  ) values (
    v_mission.job_id, v_mission.project_id, v_mission.id, v_mission.mission_id,
    'mission_blocked', 'worker', p_worker_id,
    'blocked:' || v_mission.mission_id || ':' || v_mission.attempt_count,
    jsonb_build_object('reason', v_mission.block_reason)
  ) on conflict (job_id, idempotency_key) do nothing;

  return jsonb_build_object('missionId', v_mission.mission_id, 'status', v_mission.status);
end;
$$;

create or replace function public.finalize_factory_specialist_job(
  p_job_id uuid,
  p_project_id text
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, pg_temp
as $$
declare
  v_total integer;
  v_completed integer;
  v_blocked integer;
  v_failed integer;
  v_status text;
begin
  perform 1 from public.project_factory_jobs
  where id = p_job_id and project_id = p_project_id for update;
  if not found then raise exception 'specialist_factory_job_not_found' using errcode = 'P0001'; end if;

  select count(*),
    count(*) filter (where status = 'completed'),
    count(*) filter (where status = 'blocked'),
    count(*) filter (where status = 'failed')
  into v_total, v_completed, v_blocked, v_failed
  from public.project_factory_missions
  where job_id = p_job_id and project_id = p_project_id;

  if v_total = 0 then raise exception 'specialist_missions_not_initialized' using errcode = 'P0001'; end if;

  if v_failed > 0 then
    v_status := 'failed';
  elsif v_blocked > 0 then
    v_status := 'blocked';
  elsif v_completed = v_total then
    v_status := 'awaiting_approval';
  else
    v_status := 'building';
  end if;

  update public.project_factory_jobs
  set status = v_status,
      manifest = case when v_status = 'awaiting_approval'
        then jsonb_set(manifest, '{specialistWorkflow,executionStatus}', '"awaiting_approval"'::jsonb, true)
        else manifest end,
      updated_at = now()
  where id = p_job_id and project_id = p_project_id;

  if v_status = 'awaiting_approval' then
    insert into public.project_factory_mission_events (
      job_id, project_id, event_type, actor_type, actor_id, idempotency_key, payload
    ) values (
      p_job_id, p_project_id, 'job_awaiting_human_review', 'system', '',
      'job-awaiting-review:' || p_job_id::text,
      jsonb_build_object('missionCount', v_total, 'completedCount', v_completed)
    ) on conflict (job_id, idempotency_key) do nothing;
  elsif v_status in ('blocked','failed') then
    insert into public.project_factory_mission_events (
      job_id, project_id, event_type, actor_type, actor_id, idempotency_key, payload
    ) values (
      p_job_id, p_project_id,
      case when v_status = 'blocked' then 'job_blocked' else 'job_failed' end,
      'system', '',
      'job-' || v_status || ':' || p_job_id::text,
      jsonb_build_object('missionCount', v_total, 'blockedCount', v_blocked, 'failedCount', v_failed)
    ) on conflict (job_id, idempotency_key) do nothing;
  end if;

  return jsonb_build_object(
    'jobId', p_job_id, 'status', v_status,
    'missionCount', v_total, 'completedCount', v_completed,
    'blockedCount', v_blocked, 'failedCount', v_failed
  );
end;
$$;

revoke all on function public.initialize_factory_specialist_missions(uuid,text) from public, anon, authenticated;
revoke all on function public.claim_factory_specialist_missions(uuid,text,text,text,integer,integer,integer) from public, anon, authenticated;
revoke all on function public.start_factory_specialist_mission(uuid,text,uuid,integer) from public, anon, authenticated;
revoke all on function public.heartbeat_factory_specialist_mission(uuid,text,uuid,integer) from public, anon, authenticated;
revoke all on function public.complete_factory_specialist_mission(uuid,text,uuid,jsonb,text) from public, anon, authenticated;
revoke all on function public.fail_factory_specialist_mission(uuid,text,uuid,text) from public, anon, authenticated;
revoke all on function public.block_factory_specialist_mission(uuid,text,uuid,text) from public, anon, authenticated;
revoke all on function public.finalize_factory_specialist_job(uuid,text) from public, anon, authenticated;

grant execute on function public.initialize_factory_specialist_missions(uuid,text) to service_role;
grant execute on function public.claim_factory_specialist_missions(uuid,text,text,text,integer,integer,integer) to service_role;
grant execute on function public.start_factory_specialist_mission(uuid,text,uuid,integer) to service_role;
grant execute on function public.heartbeat_factory_specialist_mission(uuid,text,uuid,integer) to service_role;
grant execute on function public.complete_factory_specialist_mission(uuid,text,uuid,jsonb,text) to service_role;
grant execute on function public.fail_factory_specialist_mission(uuid,text,uuid,text) to service_role;
grant execute on function public.block_factory_specialist_mission(uuid,text,uuid,text) to service_role;
grant execute on function public.finalize_factory_specialist_job(uuid,text) to service_role;

comment on function public.initialize_factory_specialist_missions(uuid,text) is
  'Idempotently materializes mission packets from a verified immutable workflow manifest.';
comment on function public.claim_factory_specialist_missions(uuid,text,text,text,integer,integer,integer) is
  'Atomically claims dependency-ready specialist missions using row locks, bounded leases and append-only attempt history.';
comment on function public.complete_factory_specialist_mission(uuid,text,uuid,jsonb,text) is
  'Completes a specialist mission only with a matching, digest-bound result and no failed verification items.';
comment on function public.finalize_factory_specialist_job(uuid,text) is
  'Moves a specialist job to human review only after every mission is completed; never deploys or delivers.';

     or p_run_attempt is null or p_run_attempt < 1
     or p_limit is null or p_limit < 1 or p_limit > 10
     or p_lease_seconds is null or p_lease_seconds < 30 or p_lease_seconds > 900 then
    raise exception 'specialist_worker_claim_arguments_invalid' using errcode = '22023';
  end if;

  select * into v_job
  from public.project_factory_jobs
  where id = p_job_id and project_id = p_project_id
  for update;

  if not found or v_job.status not in ('queued','building') then
    raise exception 'specialist_factory_job_not_claimable' using errcode = 'P0001';
  end if;

  v_workflow_id := v_job.manifest -> 'specialistWorkflow' ->> 'workflowId';
  if nullif(v_workflow_id,'') is null
     or v_job.manifest -> 'specialistWorkflow' ->> 'executionEnabled' is distinct from 'false' then
    raise exception 'specialist_workflow_manifest_invalid' using errcode = '22023';
  end if;

  for v_expired in
    select id, mission_id, lease_token, attempt_count
    from public.project_factory_missions
    where job_id = p_job_id and project_id = p_project_id
      and status in ('claimed','running') and lease_expires_at <= now()
    for update skip locked
  loop
    update public.project_factory_mission_attempts
      set outcome = 'lease_expired', finished_at = now(),
          failure_reason_safe = 'Worker lease expired before a verified result was persisted.'
      where mission_row_id = v_expired.id and lease_token = v_expired.lease_token
        and outcome = 'active';

    update public.project_factory_missions
      set status = case when attempt_count >= max_attempts then 'failed' else 'ready' end,
          lease_owner = null, lease_token = null, lease_expires_at = null,
          last_error_safe = 'Worker lease expired.', updated_at = now()
      where id = v_expired.id;

    insert into public.project_factory_mission_events (
      job_id, project_id, mission_row_id, mission_id, event_type, actor_type, actor_id,
      idempotency_key, payload
    ) values (
      p_job_id, p_project_id, v_expired.id, v_expired.mission_id,
      'mission_lease_expired', 'system', '',
      'lease-expired:' || v_expired.mission_id || ':' || v_expired.attempt_count,
      jsonb_build_object('attempt', v_expired.attempt_count)
    ) on conflict (job_id, idempotency_key) do nothing;
  end loop;

  if exists (
    select 1 from public.project_factory_missions
    where job_id = p_job_id and project_id = p_project_id
      and status in ('claimed','running') and lease_owner <> p_worker_id
      and lease_expires_at > now()
  ) then
    raise exception 'specialist_worker_lease_owned_by_another_run' using errcode = 'P0001';
  end if;

  update public.project_factory_jobs
  set status = 'building',
      manifest = manifest || jsonb_build_object(
        'specialistWorker',
        jsonb_build_object('workerId', p_worker_id, 'runId', p_run_id, 'runAttempt', p_run_attempt)
      ),
      updated_at = now()
  where id = p_job_id and project_id = p_project_id;

  with candidates as (
    select m.id
    from public.project_factory_missions m
    where m.job_id = p_job_id and m.project_id = p_project_id
      and m.status = 'ready' and m.attempt_count < m.max_attempts
      and not exists (
        select 1
        from unnest(m.depends_on) as dependency(mission_id)
        left join public.project_factory_missions dependency_mission
          on dependency_mission.job_id = m.job_id
          and dependency_mission.mission_id = dependency.mission_id
        where dependency_mission.id is null or dependency_mission.status <> 'completed'
      )
    order by m.sequence
    limit p_limit
    for update skip locked
  ),
  claimed as (
    update public.project_factory_missions m
    set status = 'claimed',
        lease_owner = p_worker_id,
        lease_token = gen_random_uuid(),
        lease_expires_at = now() + make_interval(secs => p_lease_seconds),
        attempt_count = attempt_count + 1,
        updated_at = now()
    from candidates c
    where m.id = c.id
    returning m.*
  ),
  attempts as (
    insert into public.project_factory_mission_attempts (
      mission_row_id, job_id, project_id, mission_id, attempt_number,
      worker_id, lease_token, outcome
    )
    select id, job_id, project_id, mission_id, attempt_count, p_worker_id, lease_token, 'active'
    from claimed
    returning mission_row_id
  ),
  events as (
    insert into public.project_factory_mission_events (
      job_id, project_id, mission_row_id, mission_id, event_type,
      actor_type, actor_id, idempotency_key, payload
    )
    select job_id, project_id, id, mission_id, 'mission_claimed',
      'worker', p_worker_id,
      'claimed:' || mission_id || ':' || attempt_count,
      jsonb_build_object('attempt', attempt_count, 'leaseExpiresAt', lease_expires_at)
    from claimed
    on conflict (job_id, idempotency_key) do nothing
    returning id
  )
  select coalesce(jsonb_agg(to_jsonb(claimed) order by claimed.sequence), '[]'::jsonb)
  into v_missions
  from claimed;

  return jsonb_build_object(
    'jobId', p_job_id,
    'projectId', p_project_id,
    'workflowId', v_workflow_id,
    'claimedCount', jsonb_array_length(v_missions),
    'missions', v_missions
  );
end;
$$;

create or replace function public.start_factory_specialist_mission(
  p_mission_row_id uuid,
  p_worker_id text,
  p_lease_token uuid,
  p_lease_seconds integer default 180
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, pg_temp
as $$
declare
  v_mission public.project_factory_missions%rowtype;
begin
  if p_lease_seconds < 30 or p_lease_seconds > 900 then
    raise exception 'specialist_lease_duration_invalid' using errcode = '22023';
  end if;
  update public.project_factory_missions
  set status = 'running', started_at = coalesce(started_at, now()),
      lease_expires_at = now() + make_interval(secs => p_lease_seconds), updated_at = now()
  where id = p_mission_row_id and lease_owner = p_worker_id
    and lease_token = p_lease_token and status = 'claimed'
  returning * into v_mission;
  if not found then raise exception 'specialist_mission_lease_mismatch' using errcode = 'P0001'; end if;

  update public.project_factory_mission_attempts
  set started_at = coalesce(started_at, now())
  where mission_row_id = v_mission.id and lease_token = p_lease_token and outcome = 'active';

  insert into public.project_factory_mission_events (
    job_id, project_id, mission_row_id, mission_id, event_type, actor_type, actor_id,
    idempotency_key, payload
  ) values (
    v_mission.job_id, v_mission.project_id, v_mission.id, v_mission.mission_id,
    'mission_started', 'worker', p_worker_id,
    'started:' || v_mission.mission_id || ':' || v_mission.attempt_count,
    jsonb_build_object('attempt', v_mission.attempt_count)
  ) on conflict (job_id, idempotency_key) do nothing;

  return jsonb_build_object('missionId', v_mission.mission_id, 'status', v_mission.status);
end;
$$;

create or replace function public.heartbeat_factory_specialist_mission(
  p_mission_row_id uuid,
  p_worker_id text,
  p_lease_token uuid,
  p_lease_seconds integer default 180
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, pg_temp
as $$
declare
  v_mission public.project_factory_missions%rowtype;
begin
  if p_lease_seconds < 30 or p_lease_seconds > 900 then
    raise exception 'specialist_lease_duration_invalid' using errcode = '22023';
  end if;
  update public.project_factory_missions
  set lease_expires_at = now() + make_interval(secs => p_lease_seconds), updated_at = now()
  where id = p_mission_row_id and lease_owner = p_worker_id
    and lease_token = p_lease_token and status in ('claimed','running')
  returning * into v_mission;
  if not found then raise exception 'specialist_mission_lease_mismatch' using errcode = 'P0001'; end if;

  insert into public.project_factory_mission_events (
    job_id, project_id, mission_row_id, mission_id, event_type, actor_type, actor_id,
    idempotency_key, payload
  ) values (
    v_mission.job_id, v_mission.project_id, v_mission.id, v_mission.mission_id,
    'mission_heartbeat', 'worker', p_worker_id,
    'heartbeat:' || v_mission.mission_id || ':' || v_mission.attempt_count || ':' || floor(extract(epoch from now()) / 30)::text,
    jsonb_build_object('leaseExpiresAt', v_mission.lease_expires_at)
  ) on conflict (job_id, idempotency_key) do nothing;

  return jsonb_build_object('missionId', v_mission.mission_id, 'leaseExpiresAt', v_mission.lease_expires_at);
end;
$$;

create or replace function public.complete_factory_specialist_mission(
  p_mission_row_id uuid,
  p_worker_id text,
  p_lease_token uuid,
  p_result jsonb,
  p_result_digest text
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, pg_temp
as $$
declare
  v_mission public.project_factory_missions%rowtype;
begin
  if jsonb_typeof(p_result) is distinct from 'object'
     or p_result ->> 'contractVersion' is distinct from '1'
     or p_result ->> 'status' is distinct from 'completed'
     or p_result ->> 'missionId' is distinct from (
       select mission_id from public.project_factory_missions where id = p_mission_row_id
     )
     or p_result ->> 'projectId' is distinct from (
       select project_id from public.project_factory_missions where id = p_mission_row_id
     )
     or p_result_digest !~ '^[a-f0-9]{64}$'
     or jsonb_typeof(p_result #> '{verification,failed}') is distinct from 'array'
     or jsonb_array_length(p_result #> '{verification,failed}') <> 0 then
    raise exception 'specialist_mission_result_invalid' using errcode = '22023';
  end if;

  update public.project_factory_missions
  set status = 'completed', result = p_result, result_digest = p_result_digest,
      verification = p_result -> 'verification',
      lease_owner = null, lease_token = null, lease_expires_at = null,
      completed_at = now(), updated_at = now(), last_error_safe = ''
  where id = p_mission_row_id and lease_owner = p_worker_id
    and lease_token = p_lease_token and status = 'running'
  returning * into v_mission;
  if not found then raise exception 'specialist_mission_lease_mismatch' using errcode = 'P0001'; end if;

  update public.project_factory_mission_attempts
  set outcome = 'completed', result_digest = p_result_digest, finished_at = now()
  where mission_row_id = v_mission.id and lease_token = p_lease_token and outcome = 'active';

  insert into public.project_factory_mission_events (
    job_id, project_id, mission_row_id, mission_id, event_type, actor_type, actor_id,
    idempotency_key, payload
  ) values (
    v_mission.job_id, v_mission.project_id, v_mission.id, v_mission.mission_id,
    'mission_completed', 'worker', p_worker_id,
    'completed:' || v_mission.mission_id || ':' || v_mission.attempt_count,
    jsonb_build_object('resultDigest', p_result_digest, 'providerId', p_result ->> 'providerId')
  ) on conflict (job_id, idempotency_key) do nothing;

  return jsonb_build_object('missionId', v_mission.mission_id, 'status', v_mission.status);
end;
$$;

create or replace function public.fail_factory_specialist_mission(
  p_mission_row_id uuid,
  p_worker_id text,
  p_lease_token uuid,
  p_reason text
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, pg_temp
as $$
declare
  v_mission public.project_factory_missions%rowtype;
  v_next_status text;
begin
  update public.project_factory_missions
  set status = case when attempt_count >= max_attempts then 'failed' else 'ready' end,
      lease_owner = null, lease_token = null, lease_expires_at = null,
      last_error_safe = left(coalesce(nullif(trim(p_reason),''),'specialist_mission_failed'), 2000),
      updated_at = now()
  where id = p_mission_row_id and lease_owner = p_worker_id
    and lease_token = p_lease_token and status in ('claimed','running')
  returning * into v_mission;
  if not found then raise exception 'specialist_mission_lease_mismatch' using errcode = 'P0001'; end if;
  v_next_status := v_mission.status;

  update public.project_factory_mission_attempts
  set outcome = 'failed', failure_reason_safe = v_mission.last_error_safe, finished_at = now()
  where mission_row_id = v_mission.id and lease_token = p_lease_token and outcome = 'active';

  insert into public.project_factory_mission_events (
    job_id, project_id, mission_row_id, mission_id, event_type, actor_type, actor_id,
    idempotency_key, payload
  ) values (
    v_mission.job_id, v_mission.project_id, v_mission.id, v_mission.mission_id,
    'mission_failed', 'worker', p_worker_id,
    'failed:' || v_mission.mission_id || ':' || v_mission.attempt_count,
    jsonb_build_object('status', v_next_status, 'reason', v_mission.last_error_safe)
  ) on conflict (job_id, idempotency_key) do nothing;

  return jsonb_build_object('missionId', v_mission.mission_id, 'status', v_next_status);
end;
$$;

create or replace function public.block_factory_specialist_mission(
  p_mission_row_id uuid,
  p_worker_id text,
  p_lease_token uuid,
  p_reason text
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, pg_temp
as $$
declare
  v_mission public.project_factory_missions%rowtype;
begin
  update public.project_factory_missions
  set status = 'blocked', block_reason = left(coalesce(nullif(trim(p_reason),''),'human_approval_required'), 2000),
      lease_owner = null, lease_token = null, lease_expires_at = null, updated_at = now()
  where id = p_mission_row_id and lease_owner = p_worker_id
    and lease_token = p_lease_token and status in ('claimed','running')
  returning * into v_mission;
  if not found then raise exception 'specialist_mission_lease_mismatch' using errcode = 'P0001'; end if;

  update public.project_factory_mission_attempts
  set outcome = 'blocked', failure_reason_safe = v_mission.block_reason, finished_at = now()
  where mission_row_id = v_mission.id and lease_token = p_lease_token and outcome = 'active';

  insert into public.project_factory_mission_events (
    job_id, project_id, mission_row_id, mission_id, event_type, actor_type, actor_id,
    idempotency_key, payload
  ) values (
    v_mission.job_id, v_mission.project_id, v_mission.id, v_mission.mission_id,
    'mission_blocked', 'worker', p_worker_id,
    'blocked:' || v_mission.mission_id || ':' || v_mission.attempt_count,
    jsonb_build_object('reason', v_mission.block_reason)
  ) on conflict (job_id, idempotency_key) do nothing;

  return jsonb_build_object('missionId', v_mission.mission_id, 'status', v_mission.status);
end;
$$;

create or replace function public.finalize_factory_specialist_job(
  p_job_id uuid,
  p_project_id text
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, pg_temp
as $$
declare
  v_total integer;
  v_completed integer;
  v_blocked integer;
  v_failed integer;
  v_status text;
begin
  perform 1 from public.project_factory_jobs
  where id = p_job_id and project_id = p_project_id for update;
  if not found then raise exception 'specialist_factory_job_not_found' using errcode = 'P0001'; end if;

  select count(*),
    count(*) filter (where status = 'completed'),
    count(*) filter (where status = 'blocked'),
    count(*) filter (where status = 'failed')
  into v_total, v_completed, v_blocked, v_failed
  from public.project_factory_missions
  where job_id = p_job_id and project_id = p_project_id;

  if v_total = 0 then raise exception 'specialist_missions_not_initialized' using errcode = 'P0001'; end if;

  if v_failed > 0 then
    v_status := 'failed';
  elsif v_blocked > 0 then
    v_status := 'blocked';
  elsif v_completed = v_total then
    v_status := 'awaiting_approval';
  else
    v_status := 'building';
  end if;

  update public.project_factory_jobs
  set status = v_status,
      manifest = case when v_status = 'awaiting_approval'
        then jsonb_set(manifest, '{specialistWorkflow,executionStatus}', '"awaiting_approval"'::jsonb, true)
        else manifest end,
      updated_at = now()
  where id = p_job_id and project_id = p_project_id;

  if v_status = 'awaiting_approval' then
    insert into public.project_factory_mission_events (
      job_id, project_id, event_type, actor_type, actor_id, idempotency_key, payload
    ) values (
      p_job_id, p_project_id, 'job_awaiting_human_review', 'system', '',
      'job-awaiting-review:' || p_job_id::text,
      jsonb_build_object('missionCount', v_total, 'completedCount', v_completed)
    ) on conflict (job_id, idempotency_key) do nothing;
  elsif v_status in ('blocked','failed') then
    insert into public.project_factory_mission_events (
      job_id, project_id, event_type, actor_type, actor_id, idempotency_key, payload
    ) values (
      p_job_id, p_project_id,
      case when v_status = 'blocked' then 'job_blocked' else 'job_failed' end,
      'system', '',
      'job-' || v_status || ':' || p_job_id::text,
      jsonb_build_object('missionCount', v_total, 'blockedCount', v_blocked, 'failedCount', v_failed)
    ) on conflict (job_id, idempotency_key) do nothing;
  end if;

  return jsonb_build_object(
    'jobId', p_job_id, 'status', v_status,
    'missionCount', v_total, 'completedCount', v_completed,
    'blockedCount', v_blocked, 'failedCount', v_failed
  );
end;
$$;

revoke all on function public.initialize_factory_specialist_missions(uuid,text) from public, anon, authenticated;
revoke all on function public.claim_factory_specialist_missions(uuid,text,text,text,integer,integer,integer) from public, anon, authenticated;
revoke all on function public.start_factory_specialist_mission(uuid,text,uuid,integer) from public, anon, authenticated;
revoke all on function public.heartbeat_factory_specialist_mission(uuid,text,uuid,integer) from public, anon, authenticated;
revoke all on function public.complete_factory_specialist_mission(uuid,text,uuid,jsonb,text) from public, anon, authenticated;
revoke all on function public.fail_factory_specialist_mission(uuid,text,uuid,text) from public, anon, authenticated;
revoke all on function public.block_factory_specialist_mission(uuid,text,uuid,text) from public, anon, authenticated;
revoke all on function public.finalize_factory_specialist_job(uuid,text) from public, anon, authenticated;

grant execute on function public.initialize_factory_specialist_missions(uuid,text) to service_role;
grant execute on function public.claim_factory_specialist_missions(uuid,text,text,text,integer,integer,integer) to service_role;
grant execute on function public.start_factory_specialist_mission(uuid,text,uuid,integer) to service_role;
grant execute on function public.heartbeat_factory_specialist_mission(uuid,text,uuid,integer) to service_role;
grant execute on function public.complete_factory_specialist_mission(uuid,text,uuid,jsonb,text) to service_role;
grant execute on function public.fail_factory_specialist_mission(uuid,text,uuid,text) to service_role;
grant execute on function public.block_factory_specialist_mission(uuid,text,uuid,text) to service_role;
grant execute on function public.finalize_factory_specialist_job(uuid,text) to service_role;

comment on function public.initialize_factory_specialist_missions(uuid,text) is
  'Idempotently materializes mission packets from a verified immutable workflow manifest.';
comment on function public.claim_factory_specialist_missions(uuid,text,text,text,integer,integer,integer) is
  'Atomically claims dependency-ready specialist missions using row locks, bounded leases and append-only attempt history.';
comment on function public.complete_factory_specialist_mission(uuid,text,uuid,jsonb,text) is
  'Completes a specialist mission only with a matching, digest-bound result and no failed verification items.';
comment on function public.finalize_factory_specialist_job(uuid,text) is
  'Moves a specialist job to human review only after every mission is completed; never deploys or delivers.';

     or jsonb_typeof(p_result #> '{verification,failed}') is distinct from 'array'
     or jsonb_array_length(p_result #> '{verification,failed}') <> 0 then
    raise exception 'specialist_mission_result_invalid' using errcode = '22023';
  end if;

  update public.project_factory_missions
  set status = 'completed', result = p_result, result_digest = p_result_digest,
      verification = p_result -> 'verification',
      lease_owner = null, lease_token = null, lease_expires_at = null,
      completed_at = now(), updated_at = now(), last_error_safe = ''
  where id = p_mission_row_id and lease_owner = p_worker_id
    and lease_token = p_lease_token and status = 'running'
  returning * into v_mission;
  if not found then raise exception 'specialist_mission_lease_mismatch' using errcode = 'P0001'; end if;

  update public.project_factory_mission_attempts
  set outcome = 'completed', result_digest = p_result_digest, finished_at = now()
  where mission_row_id = v_mission.id and lease_token = p_lease_token and outcome = 'active';

  insert into public.project_factory_mission_events (
    job_id, project_id, mission_row_id, mission_id, event_type, actor_type, actor_id,
    idempotency_key, payload
  ) values (
    v_mission.job_id, v_mission.project_id, v_mission.id, v_mission.mission_id,
    'mission_completed', 'worker', p_worker_id,
    'completed:' || v_mission.mission_id || ':' || v_mission.attempt_count,
    jsonb_build_object('resultDigest', p_result_digest, 'providerId', p_result ->> 'providerId')
  ) on conflict (job_id, idempotency_key) do nothing;

  return jsonb_build_object('missionId', v_mission.mission_id, 'status', v_mission.status);
end;
$$;

create or replace function public.fail_factory_specialist_mission(
  p_mission_row_id uuid,
  p_worker_id text,
  p_lease_token uuid,
  p_reason text
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, pg_temp
as $$
declare
  v_mission public.project_factory_missions%rowtype;
  v_next_status text;
begin
  update public.project_factory_missions
  set status = case when attempt_count >= max_attempts then 'failed' else 'ready' end,
      lease_owner = null, lease_token = null, lease_expires_at = null,
      last_error_safe = left(coalesce(nullif(trim(p_reason),''),'specialist_mission_failed'), 2000),
      updated_at = now()
  where id = p_mission_row_id and lease_owner = p_worker_id
    and lease_token = p_lease_token and status in ('claimed','running')
  returning * into v_mission;
  if not found then raise exception 'specialist_mission_lease_mismatch' using errcode = 'P0001'; end if;
  v_next_status := v_mission.status;

  update public.project_factory_mission_attempts
  set outcome = 'failed', failure_reason_safe = v_mission.last_error_safe, finished_at = now()
  where mission_row_id = v_mission.id and lease_token = p_lease_token and outcome = 'active';

  insert into public.project_factory_mission_events (
    job_id, project_id, mission_row_id, mission_id, event_type, actor_type, actor_id,
    idempotency_key, payload
  ) values (
    v_mission.job_id, v_mission.project_id, v_mission.id, v_mission.mission_id,
    'mission_failed', 'worker', p_worker_id,
    'failed:' || v_mission.mission_id || ':' || v_mission.attempt_count,
    jsonb_build_object('status', v_next_status, 'reason', v_mission.last_error_safe)
  ) on conflict (job_id, idempotency_key) do nothing;

  return jsonb_build_object('missionId', v_mission.mission_id, 'status', v_next_status);
end;
$$;

create or replace function public.block_factory_specialist_mission(
  p_mission_row_id uuid,
  p_worker_id text,
  p_lease_token uuid,
  p_reason text
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, pg_temp
as $$
declare
  v_mission public.project_factory_missions%rowtype;
begin
  update public.project_factory_missions
  set status = 'blocked', block_reason = left(coalesce(nullif(trim(p_reason),''),'human_approval_required'), 2000),
      lease_owner = null, lease_token = null, lease_expires_at = null, updated_at = now()
  where id = p_mission_row_id and lease_owner = p_worker_id
    and lease_token = p_lease_token and status in ('claimed','running')
  returning * into v_mission;
  if not found then raise exception 'specialist_mission_lease_mismatch' using errcode = 'P0001'; end if;

  update public.project_factory_mission_attempts
  set outcome = 'blocked', failure_reason_safe = v_mission.block_reason, finished_at = now()
  where mission_row_id = v_mission.id and lease_token = p_lease_token and outcome = 'active';

  insert into public.project_factory_mission_events (
    job_id, project_id, mission_row_id, mission_id, event_type, actor_type, actor_id,
    idempotency_key, payload
  ) values (
    v_mission.job_id, v_mission.project_id, v_mission.id, v_mission.mission_id,
    'mission_blocked', 'worker', p_worker_id,
    'blocked:' || v_mission.mission_id || ':' || v_mission.attempt_count,
    jsonb_build_object('reason', v_mission.block_reason)
  ) on conflict (job_id, idempotency_key) do nothing;

  return jsonb_build_object('missionId', v_mission.mission_id, 'status', v_mission.status);
end;
$$;

create or replace function public.finalize_factory_specialist_job(
  p_job_id uuid,
  p_project_id text
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, pg_temp
as $$
declare
  v_total integer;
  v_completed integer;
  v_blocked integer;
  v_failed integer;
  v_status text;
begin
  perform 1 from public.project_factory_jobs
  where id = p_job_id and project_id = p_project_id for update;
  if not found then raise exception 'specialist_factory_job_not_found' using errcode = 'P0001'; end if;

  select count(*),
    count(*) filter (where status = 'completed'),
    count(*) filter (where status = 'blocked'),
    count(*) filter (where status = 'failed')
  into v_total, v_completed, v_blocked, v_failed
  from public.project_factory_missions
  where job_id = p_job_id and project_id = p_project_id;

  if v_total = 0 then raise exception 'specialist_missions_not_initialized' using errcode = 'P0001'; end if;

  if v_failed > 0 then
    v_status := 'failed';
  elsif v_blocked > 0 then
    v_status := 'blocked';
  elsif v_completed = v_total then
    v_status := 'awaiting_approval';
  else
    v_status := 'building';
  end if;

  update public.project_factory_jobs
  set status = v_status,
      manifest = case when v_status = 'awaiting_approval'
        then jsonb_set(manifest, '{specialistWorkflow,executionStatus}', '"awaiting_approval"'::jsonb, true)
        else manifest end,
      updated_at = now()
  where id = p_job_id and project_id = p_project_id;

  if v_status = 'awaiting_approval' then
    insert into public.project_factory_mission_events (
      job_id, project_id, event_type, actor_type, actor_id, idempotency_key, payload
    ) values (
      p_job_id, p_project_id, 'job_awaiting_human_review', 'system', '',
      'job-awaiting-review:' || p_job_id::text,
      jsonb_build_object('missionCount', v_total, 'completedCount', v_completed)
    ) on conflict (job_id, idempotency_key) do nothing;
  elsif v_status in ('blocked','failed') then
    insert into public.project_factory_mission_events (
      job_id, project_id, event_type, actor_type, actor_id, idempotency_key, payload
    ) values (
      p_job_id, p_project_id,
      case when v_status = 'blocked' then 'job_blocked' else 'job_failed' end,
      'system', '',
      'job-' || v_status || ':' || p_job_id::text,
      jsonb_build_object('missionCount', v_total, 'blockedCount', v_blocked, 'failedCount', v_failed)
    ) on conflict (job_id, idempotency_key) do nothing;
  end if;

  return jsonb_build_object(
    'jobId', p_job_id, 'status', v_status,
    'missionCount', v_total, 'completedCount', v_completed,
    'blockedCount', v_blocked, 'failedCount', v_failed
  );
end;
$$;

revoke all on function public.initialize_factory_specialist_missions(uuid,text) from public, anon, authenticated;
revoke all on function public.claim_factory_specialist_missions(uuid,text,text,text,integer,integer,integer) from public, anon, authenticated;
revoke all on function public.start_factory_specialist_mission(uuid,text,uuid,integer) from public, anon, authenticated;
revoke all on function public.heartbeat_factory_specialist_mission(uuid,text,uuid,integer) from public, anon, authenticated;
revoke all on function public.complete_factory_specialist_mission(uuid,text,uuid,jsonb,text) from public, anon, authenticated;
revoke all on function public.fail_factory_specialist_mission(uuid,text,uuid,text) from public, anon, authenticated;
revoke all on function public.block_factory_specialist_mission(uuid,text,uuid,text) from public, anon, authenticated;
revoke all on function public.finalize_factory_specialist_job(uuid,text) from public, anon, authenticated;

grant execute on function public.initialize_factory_specialist_missions(uuid,text) to service_role;
grant execute on function public.claim_factory_specialist_missions(uuid,text,text,text,integer,integer,integer) to service_role;
grant execute on function public.start_factory_specialist_mission(uuid,text,uuid,integer) to service_role;
grant execute on function public.heartbeat_factory_specialist_mission(uuid,text,uuid,integer) to service_role;
grant execute on function public.complete_factory_specialist_mission(uuid,text,uuid,jsonb,text) to service_role;
grant execute on function public.fail_factory_specialist_mission(uuid,text,uuid,text) to service_role;
grant execute on function public.block_factory_specialist_mission(uuid,text,uuid,text) to service_role;
grant execute on function public.finalize_factory_specialist_job(uuid,text) to service_role;

comment on function public.initialize_factory_specialist_missions(uuid,text) is
  'Idempotently materializes mission packets from a verified immutable workflow manifest.';
comment on function public.claim_factory_specialist_missions(uuid,text,text,text,integer,integer,integer) is
  'Atomically claims dependency-ready specialist missions using row locks, bounded leases and append-only attempt history.';
comment on function public.complete_factory_specialist_mission(uuid,text,uuid,jsonb,text) is
  'Completes a specialist mission only with a matching, digest-bound result and no failed verification items.';
comment on function public.finalize_factory_specialist_job(uuid,text) is
  'Moves a specialist job to human review only after every mission is completed; never deploys or delivers.';

     or p_run_attempt is null or p_run_attempt < 1
     or p_limit is null or p_limit < 1 or p_limit > 10
     or p_lease_seconds is null or p_lease_seconds < 30 or p_lease_seconds > 900 then
    raise exception 'specialist_worker_claim_arguments_invalid' using errcode = '22023';
  end if;

  select * into v_job
  from public.project_factory_jobs
  where id = p_job_id and project_id = p_project_id
  for update;

  if not found or v_job.status not in ('queued','building') then
    raise exception 'specialist_factory_job_not_claimable' using errcode = 'P0001';
  end if;

  v_workflow_id := v_job.manifest -> 'specialistWorkflow' ->> 'workflowId';
  if nullif(v_workflow_id,'') is null
     or v_job.manifest -> 'specialistWorkflow' ->> 'executionEnabled' is distinct from 'false' then
    raise exception 'specialist_workflow_manifest_invalid' using errcode = '22023';
  end if;

  for v_expired in
    select id, mission_id, lease_token, attempt_count
    from public.project_factory_missions
    where job_id = p_job_id and project_id = p_project_id
      and status in ('claimed','running') and lease_expires_at <= now()
    for update skip locked
  loop
    update public.project_factory_mission_attempts
      set outcome = 'lease_expired', finished_at = now(),
          failure_reason_safe = 'Worker lease expired before a verified result was persisted.'
      where mission_row_id = v_expired.id and lease_token = v_expired.lease_token
        and outcome = 'active';

    update public.project_factory_missions
      set status = case when attempt_count >= max_attempts then 'failed' else 'ready' end,
          lease_owner = null, lease_token = null, lease_expires_at = null,
          last_error_safe = 'Worker lease expired.', updated_at = now()
      where id = v_expired.id;

    insert into public.project_factory_mission_events (
      job_id, project_id, mission_row_id, mission_id, event_type, actor_type, actor_id,
      idempotency_key, payload
    ) values (
      p_job_id, p_project_id, v_expired.id, v_expired.mission_id,
      'mission_lease_expired', 'system', '',
      'lease-expired:' || v_expired.mission_id || ':' || v_expired.attempt_count,
      jsonb_build_object('attempt', v_expired.attempt_count)
    ) on conflict (job_id, idempotency_key) do nothing;
  end loop;

  if exists (
    select 1 from public.project_factory_missions
    where job_id = p_job_id and project_id = p_project_id
      and status in ('claimed','running') and lease_owner <> p_worker_id
      and lease_expires_at > now()
  ) then
    raise exception 'specialist_worker_lease_owned_by_another_run' using errcode = 'P0001';
  end if;

  update public.project_factory_jobs
  set status = 'building',
      manifest = manifest || jsonb_build_object(
        'specialistWorker',
        jsonb_build_object('workerId', p_worker_id, 'runId', p_run_id, 'runAttempt', p_run_attempt)
      ),
      updated_at = now()
  where id = p_job_id and project_id = p_project_id;

  with candidates as (
    select m.id
    from public.project_factory_missions m
    where m.job_id = p_job_id and m.project_id = p_project_id
      and m.status = 'ready' and m.attempt_count < m.max_attempts
      and not exists (
        select 1
        from unnest(m.depends_on) as dependency(mission_id)
        left join public.project_factory_missions dependency_mission
          on dependency_mission.job_id = m.job_id
          and dependency_mission.mission_id = dependency.mission_id
        where dependency_mission.id is null or dependency_mission.status <> 'completed'
      )
    order by m.sequence
    limit p_limit
    for update skip locked
  ),
  claimed as (
    update public.project_factory_missions m
    set status = 'claimed',
        lease_owner = p_worker_id,
        lease_token = gen_random_uuid(),
        lease_expires_at = now() + make_interval(secs => p_lease_seconds),
        attempt_count = attempt_count + 1,
        updated_at = now()
    from candidates c
    where m.id = c.id
    returning m.*
  ),
  attempts as (
    insert into public.project_factory_mission_attempts (
      mission_row_id, job_id, project_id, mission_id, attempt_number,
      worker_id, lease_token, outcome
    )
    select id, job_id, project_id, mission_id, attempt_count, p_worker_id, lease_token, 'active'
    from claimed
    returning mission_row_id
  ),
  events as (
    insert into public.project_factory_mission_events (
      job_id, project_id, mission_row_id, mission_id, event_type,
      actor_type, actor_id, idempotency_key, payload
    )
    select job_id, project_id, id, mission_id, 'mission_claimed',
      'worker', p_worker_id,
      'claimed:' || mission_id || ':' || attempt_count,
      jsonb_build_object('attempt', attempt_count, 'leaseExpiresAt', lease_expires_at)
    from claimed
    on conflict (job_id, idempotency_key) do nothing
    returning id
  )
  select coalesce(jsonb_agg(to_jsonb(claimed) order by claimed.sequence), '[]'::jsonb)
  into v_missions
  from claimed;

  return jsonb_build_object(
    'jobId', p_job_id,
    'projectId', p_project_id,
    'workflowId', v_workflow_id,
    'claimedCount', jsonb_array_length(v_missions),
    'missions', v_missions
  );
end;
$$;

create or replace function public.start_factory_specialist_mission(
  p_mission_row_id uuid,
  p_worker_id text,
  p_lease_token uuid,
  p_lease_seconds integer default 180
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, pg_temp
as $$
declare
  v_mission public.project_factory_missions%rowtype;
begin
  if p_lease_seconds < 30 or p_lease_seconds > 900 then
    raise exception 'specialist_lease_duration_invalid' using errcode = '22023';
  end if;
  update public.project_factory_missions
  set status = 'running', started_at = coalesce(started_at, now()),
      lease_expires_at = now() + make_interval(secs => p_lease_seconds), updated_at = now()
  where id = p_mission_row_id and lease_owner = p_worker_id
    and lease_token = p_lease_token and status = 'claimed'
  returning * into v_mission;
  if not found then raise exception 'specialist_mission_lease_mismatch' using errcode = 'P0001'; end if;

  update public.project_factory_mission_attempts
  set started_at = coalesce(started_at, now())
  where mission_row_id = v_mission.id and lease_token = p_lease_token and outcome = 'active';

  insert into public.project_factory_mission_events (
    job_id, project_id, mission_row_id, mission_id, event_type, actor_type, actor_id,
    idempotency_key, payload
  ) values (
    v_mission.job_id, v_mission.project_id, v_mission.id, v_mission.mission_id,
    'mission_started', 'worker', p_worker_id,
    'started:' || v_mission.mission_id || ':' || v_mission.attempt_count,
    jsonb_build_object('attempt', v_mission.attempt_count)
  ) on conflict (job_id, idempotency_key) do nothing;

  return jsonb_build_object('missionId', v_mission.mission_id, 'status', v_mission.status);
end;
$$;

create or replace function public.heartbeat_factory_specialist_mission(
  p_mission_row_id uuid,
  p_worker_id text,
  p_lease_token uuid,
  p_lease_seconds integer default 180
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, pg_temp
as $$
declare
  v_mission public.project_factory_missions%rowtype;
begin
  if p_lease_seconds < 30 or p_lease_seconds > 900 then
    raise exception 'specialist_lease_duration_invalid' using errcode = '22023';
  end if;
  update public.project_factory_missions
  set lease_expires_at = now() + make_interval(secs => p_lease_seconds), updated_at = now()
  where id = p_mission_row_id and lease_owner = p_worker_id
    and lease_token = p_lease_token and status in ('claimed','running')
  returning * into v_mission;
  if not found then raise exception 'specialist_mission_lease_mismatch' using errcode = 'P0001'; end if;

  insert into public.project_factory_mission_events (
    job_id, project_id, mission_row_id, mission_id, event_type, actor_type, actor_id,
    idempotency_key, payload
  ) values (
    v_mission.job_id, v_mission.project_id, v_mission.id, v_mission.mission_id,
    'mission_heartbeat', 'worker', p_worker_id,
    'heartbeat:' || v_mission.mission_id || ':' || v_mission.attempt_count || ':' || floor(extract(epoch from now()) / 30)::text,
    jsonb_build_object('leaseExpiresAt', v_mission.lease_expires_at)
  ) on conflict (job_id, idempotency_key) do nothing;

  return jsonb_build_object('missionId', v_mission.mission_id, 'leaseExpiresAt', v_mission.lease_expires_at);
end;
$$;

create or replace function public.complete_factory_specialist_mission(
  p_mission_row_id uuid,
  p_worker_id text,
  p_lease_token uuid,
  p_result jsonb,
  p_result_digest text
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, pg_temp
as $$
declare
  v_mission public.project_factory_missions%rowtype;
begin
  if jsonb_typeof(p_result) is distinct from 'object'
     or p_result ->> 'contractVersion' is distinct from '1'
     or p_result ->> 'status' is distinct from 'completed'
     or p_result ->> 'missionId' is distinct from (
       select mission_id from public.project_factory_missions where id = p_mission_row_id
     )
     or p_result ->> 'projectId' is distinct from (
       select project_id from public.project_factory_missions where id = p_mission_row_id
     )
     or p_result_digest !~ '^[a-f0-9]{64}$'
     or jsonb_typeof(p_result #> '{verification,failed}') is distinct from 'array'
     or jsonb_array_length(p_result #> '{verification,failed}') <> 0 then
    raise exception 'specialist_mission_result_invalid' using errcode = '22023';
  end if;

  update public.project_factory_missions
  set status = 'completed', result = p_result, result_digest = p_result_digest,
      verification = p_result -> 'verification',
      lease_owner = null, lease_token = null, lease_expires_at = null,
      completed_at = now(), updated_at = now(), last_error_safe = ''
  where id = p_mission_row_id and lease_owner = p_worker_id
    and lease_token = p_lease_token and status = 'running'
  returning * into v_mission;
  if not found then raise exception 'specialist_mission_lease_mismatch' using errcode = 'P0001'; end if;

  update public.project_factory_mission_attempts
  set outcome = 'completed', result_digest = p_result_digest, finished_at = now()
  where mission_row_id = v_mission.id and lease_token = p_lease_token and outcome = 'active';

  insert into public.project_factory_mission_events (
    job_id, project_id, mission_row_id, mission_id, event_type, actor_type, actor_id,
    idempotency_key, payload
  ) values (
    v_mission.job_id, v_mission.project_id, v_mission.id, v_mission.mission_id,
    'mission_completed', 'worker', p_worker_id,
    'completed:' || v_mission.mission_id || ':' || v_mission.attempt_count,
    jsonb_build_object('resultDigest', p_result_digest, 'providerId', p_result ->> 'providerId')
  ) on conflict (job_id, idempotency_key) do nothing;

  return jsonb_build_object('missionId', v_mission.mission_id, 'status', v_mission.status);
end;
$$;

create or replace function public.fail_factory_specialist_mission(
  p_mission_row_id uuid,
  p_worker_id text,
  p_lease_token uuid,
  p_reason text
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, pg_temp
as $$
declare
  v_mission public.project_factory_missions%rowtype;
  v_next_status text;
begin
  update public.project_factory_missions
  set status = case when attempt_count >= max_attempts then 'failed' else 'ready' end,
      lease_owner = null, lease_token = null, lease_expires_at = null,
      last_error_safe = left(coalesce(nullif(trim(p_reason),''),'specialist_mission_failed'), 2000),
      updated_at = now()
  where id = p_mission_row_id and lease_owner = p_worker_id
    and lease_token = p_lease_token and status in ('claimed','running')
  returning * into v_mission;
  if not found then raise exception 'specialist_mission_lease_mismatch' using errcode = 'P0001'; end if;
  v_next_status := v_mission.status;

  update public.project_factory_mission_attempts
  set outcome = 'failed', failure_reason_safe = v_mission.last_error_safe, finished_at = now()
  where mission_row_id = v_mission.id and lease_token = p_lease_token and outcome = 'active';

  insert into public.project_factory_mission_events (
    job_id, project_id, mission_row_id, mission_id, event_type, actor_type, actor_id,
    idempotency_key, payload
  ) values (
    v_mission.job_id, v_mission.project_id, v_mission.id, v_mission.mission_id,
    'mission_failed', 'worker', p_worker_id,
    'failed:' || v_mission.mission_id || ':' || v_mission.attempt_count,
    jsonb_build_object('status', v_next_status, 'reason', v_mission.last_error_safe)
  ) on conflict (job_id, idempotency_key) do nothing;

  return jsonb_build_object('missionId', v_mission.mission_id, 'status', v_next_status);
end;
$$;

create or replace function public.block_factory_specialist_mission(
  p_mission_row_id uuid,
  p_worker_id text,
  p_lease_token uuid,
  p_reason text
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, pg_temp
as $$
declare
  v_mission public.project_factory_missions%rowtype;
begin
  update public.project_factory_missions
  set status = 'blocked', block_reason = left(coalesce(nullif(trim(p_reason),''),'human_approval_required'), 2000),
      lease_owner = null, lease_token = null, lease_expires_at = null, updated_at = now()
  where id = p_mission_row_id and lease_owner = p_worker_id
    and lease_token = p_lease_token and status in ('claimed','running')
  returning * into v_mission;
  if not found then raise exception 'specialist_mission_lease_mismatch' using errcode = 'P0001'; end if;

  update public.project_factory_mission_attempts
  set outcome = 'blocked', failure_reason_safe = v_mission.block_reason, finished_at = now()
  where mission_row_id = v_mission.id and lease_token = p_lease_token and outcome = 'active';

  insert into public.project_factory_mission_events (
    job_id, project_id, mission_row_id, mission_id, event_type, actor_type, actor_id,
    idempotency_key, payload
  ) values (
    v_mission.job_id, v_mission.project_id, v_mission.id, v_mission.mission_id,
    'mission_blocked', 'worker', p_worker_id,
    'blocked:' || v_mission.mission_id || ':' || v_mission.attempt_count,
    jsonb_build_object('reason', v_mission.block_reason)
  ) on conflict (job_id, idempotency_key) do nothing;

  return jsonb_build_object('missionId', v_mission.mission_id, 'status', v_mission.status);
end;
$$;

create or replace function public.finalize_factory_specialist_job(
  p_job_id uuid,
  p_project_id text
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, pg_temp
as $$
declare
  v_total integer;
  v_completed integer;
  v_blocked integer;
  v_failed integer;
  v_status text;
begin
  perform 1 from public.project_factory_jobs
  where id = p_job_id and project_id = p_project_id for update;
  if not found then raise exception 'specialist_factory_job_not_found' using errcode = 'P0001'; end if;

  select count(*),
    count(*) filter (where status = 'completed'),
    count(*) filter (where status = 'blocked'),
    count(*) filter (where status = 'failed')
  into v_total, v_completed, v_blocked, v_failed
  from public.project_factory_missions
  where job_id = p_job_id and project_id = p_project_id;

  if v_total = 0 then raise exception 'specialist_missions_not_initialized' using errcode = 'P0001'; end if;

  if v_failed > 0 then
    v_status := 'failed';
  elsif v_blocked > 0 then
    v_status := 'blocked';
  elsif v_completed = v_total then
    v_status := 'awaiting_approval';
  else
    v_status := 'building';
  end if;

  update public.project_factory_jobs
  set status = v_status,
      manifest = case when v_status = 'awaiting_approval'
        then jsonb_set(manifest, '{specialistWorkflow,executionStatus}', '"awaiting_approval"'::jsonb, true)
        else manifest end,
      updated_at = now()
  where id = p_job_id and project_id = p_project_id;

  if v_status = 'awaiting_approval' then
    insert into public.project_factory_mission_events (
      job_id, project_id, event_type, actor_type, actor_id, idempotency_key, payload
    ) values (
      p_job_id, p_project_id, 'job_awaiting_human_review', 'system', '',
      'job-awaiting-review:' || p_job_id::text,
      jsonb_build_object('missionCount', v_total, 'completedCount', v_completed)
    ) on conflict (job_id, idempotency_key) do nothing;
  elsif v_status in ('blocked','failed') then
    insert into public.project_factory_mission_events (
      job_id, project_id, event_type, actor_type, actor_id, idempotency_key, payload
    ) values (
      p_job_id, p_project_id,
      case when v_status = 'blocked' then 'job_blocked' else 'job_failed' end,
      'system', '',
      'job-' || v_status || ':' || p_job_id::text,
      jsonb_build_object('missionCount', v_total, 'blockedCount', v_blocked, 'failedCount', v_failed)
    ) on conflict (job_id, idempotency_key) do nothing;
  end if;

  return jsonb_build_object(
    'jobId', p_job_id, 'status', v_status,
    'missionCount', v_total, 'completedCount', v_completed,
    'blockedCount', v_blocked, 'failedCount', v_failed
  );
end;
$$;

revoke all on function public.initialize_factory_specialist_missions(uuid,text) from public, anon, authenticated;
revoke all on function public.claim_factory_specialist_missions(uuid,text,text,text,integer,integer,integer) from public, anon, authenticated;
revoke all on function public.start_factory_specialist_mission(uuid,text,uuid,integer) from public, anon, authenticated;
revoke all on function public.heartbeat_factory_specialist_mission(uuid,text,uuid,integer) from public, anon, authenticated;
revoke all on function public.complete_factory_specialist_mission(uuid,text,uuid,jsonb,text) from public, anon, authenticated;
revoke all on function public.fail_factory_specialist_mission(uuid,text,uuid,text) from public, anon, authenticated;
revoke all on function public.block_factory_specialist_mission(uuid,text,uuid,text) from public, anon, authenticated;
revoke all on function public.finalize_factory_specialist_job(uuid,text) from public, anon, authenticated;

grant execute on function public.initialize_factory_specialist_missions(uuid,text) to service_role;
grant execute on function public.claim_factory_specialist_missions(uuid,text,text,text,integer,integer,integer) to service_role;
grant execute on function public.start_factory_specialist_mission(uuid,text,uuid,integer) to service_role;
grant execute on function public.heartbeat_factory_specialist_mission(uuid,text,uuid,integer) to service_role;
grant execute on function public.complete_factory_specialist_mission(uuid,text,uuid,jsonb,text) to service_role;
grant execute on function public.fail_factory_specialist_mission(uuid,text,uuid,text) to service_role;
grant execute on function public.block_factory_specialist_mission(uuid,text,uuid,text) to service_role;
grant execute on function public.finalize_factory_specialist_job(uuid,text) to service_role;

comment on function public.initialize_factory_specialist_missions(uuid,text) is
  'Idempotently materializes mission packets from a verified immutable workflow manifest.';
comment on function public.claim_factory_specialist_missions(uuid,text,text,text,integer,integer,integer) is
  'Atomically claims dependency-ready specialist missions using row locks, bounded leases and append-only attempt history.';
comment on function public.complete_factory_specialist_mission(uuid,text,uuid,jsonb,text) is
  'Completes a specialist mission only with a matching, digest-bound result and no failed verification items.';
comment on function public.finalize_factory_specialist_job(uuid,text) is
  'Moves a specialist job to human review only after every mission is completed; never deploys or delivers.';
