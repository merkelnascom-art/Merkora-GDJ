\set ON_ERROR_STOP on

create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then create role anon nologin; end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then create role authenticated nologin; end if;
  if not exists (select 1 from pg_roles where rolname = 'service_role') then create role service_role nologin bypassrls; end if;
end
$$;

grant usage on schema public to anon, authenticated, service_role;
create or replace function public.is_merkora_admin() returns boolean
language sql stable as $$ select false $$;

create table public.project_memory_plan_versions (
  project_id text not null,
  version integer not null,
  payload_digest text not null,
  scope_digest text not null,
  unique (project_id, version)
);

create table public.project_factory_jobs (
  id uuid primary key,
  project_id text not null,
  plan_version integer not null,
  plan_digest text not null,
  scope_digest text not null,
  status text not null,
  manifest jsonb not null,
  updated_at timestamptz not null default now(),
  unique (id, project_id)
);

\ir ../migrations/20261114125757_factory_multi_agent_mission_ledger.sql

insert into public.project_memory_plan_versions (
  project_id, version, payload_digest, scope_digest
) values (
  'MK-LEDGER-TEST', 3, repeat('a', 64), repeat('b', 64)
);

insert into public.project_factory_jobs (
  id, project_id, plan_version, plan_digest, scope_digest, status, manifest
) values (
  '11111111-1111-4111-8111-111111111111',
  'MK-LEDGER-TEST', 3, repeat('a', 64), repeat('b', 64), 'queued',
  jsonb_build_object(
    'specialistWorkflow',
    jsonb_build_object(
      'schemaVersion', 1,
      'workflowId', 'wf-ledger-test',
      'projectId', 'MK-LEDGER-TEST',
      'status', 'prepared',
      'executionEnabled', false,
      'sourceVersions', jsonb_build_object('briefVersion', 2, 'planVersion', 3),
      'plan', jsonb_build_object(
        'missionPlan', jsonb_build_object(
          'steps', jsonb_build_array(
            jsonb_build_object('sequence', 1, 'missionId', 'mission-1', 'dependsOn', '[]'::jsonb),
            jsonb_build_object('sequence', 2, 'missionId', 'mission-2', 'dependsOn', jsonb_build_array('mission-1')),
            jsonb_build_object('sequence', 3, 'missionId', 'mission-3', 'dependsOn', '[]'::jsonb)
          )
        ),
        'assignments', jsonb_build_array(
          jsonb_build_object(
            'missionId', 'mission-1', 'agentId', 'analyste-metier', 'phaseId', 'intelligence',
            'poleId', 'intelligence', 'runtimeRole', 'analyst', 'status', 'prepared',
            'mission', jsonb_build_object('contractVersion', 1, 'missionId', 'mission-1', 'projectId', 'MK-LEDGER-TEST', 'role', 'analyst')
          ),
          jsonb_build_object(
            'missionId', 'mission-2', 'agentId', 'developpeur-backend', 'phaseId', 'fabrication',
            'poleId', 'fabrication', 'runtimeRole', 'implementer', 'status', 'prepared',
            'mission', jsonb_build_object('contractVersion', 1, 'missionId', 'mission-2', 'projectId', 'MK-LEDGER-TEST', 'role', 'implementer')
          ),
          jsonb_build_object(
            'missionId', 'mission-3', 'agentId', 'chercheur-documentaire', 'phaseId', 'intelligence',
            'poleId', 'intelligence', 'runtimeRole', 'analyst', 'status', 'prepared',
            'mission', jsonb_build_object('contractVersion', 1, 'missionId', 'mission-3', 'projectId', 'MK-LEDGER-TEST', 'role', 'analyst')
          )
        )
      )
    )
  )
);

set role service_role;

do $$
declare
  v_init jsonb;
  v_claim jsonb;
  v_mission jsonb;
  v_result jsonb;
  v_job jsonb;
  v_mission_row_id uuid;
  v_lease_token uuid;
begin
  v_init := public.initialize_factory_specialist_missions(
    '11111111-1111-4111-8111-111111111111', 'MK-LEDGER-TEST'
  );
  if (v_init ->> 'missionCount')::integer <> 3 then
    raise exception 'expected three durable specialist missions';
  end if;

  v_init := public.initialize_factory_specialist_missions(
    '11111111-1111-4111-8111-111111111111', 'MK-LEDGER-TEST'
  );
  if (v_init ->> 'initialized')::boolean is distinct from false then
    raise exception 'mission initialization must be idempotent';
  end if;

  v_claim := public.claim_factory_specialist_missions(
    '11111111-1111-4111-8111-111111111111', 'MK-LEDGER-TEST',
    'gha:123456:1', '123456', 1, 2, 180
  );
  if (v_claim ->> 'claimedCount')::integer <> 2 then
    raise exception 'expected the two dependency-free missions to be claimed first';
  end if;

  for v_mission in select value from jsonb_array_elements(v_claim -> 'missions')
  loop
    v_mission_row_id := (v_mission ->> 'id')::uuid;
    v_lease_token := (v_mission ->> 'lease_token')::uuid;
    perform public.start_factory_specialist_mission(v_mission_row_id, 'gha:123456:1', v_lease_token, 180);
    v_result := jsonb_build_object(
      'contractVersion', 1,
      'missionId', v_mission ->> 'mission_id',
      'projectId', 'MK-LEDGER-TEST',
      'providerId', 'test-provider',
      'status', 'completed',
      'summary', 'Verified test result.',
      'findings', '[]'::jsonb,
      'artifacts', '[]'::jsonb,
      'verification', jsonb_build_object('performed', jsonb_build_array('sql-test'), 'passed', jsonb_build_array('sql-test'), 'failed', '[]'::jsonb, 'notPerformed', '[]'::jsonb),
      'requiresHumanDecision', false
    );
    perform public.complete_factory_specialist_mission(
      v_mission_row_id, 'gha:123456:1', v_lease_token, v_result, repeat('c', 64)
    );
  end loop;

  v_claim := public.claim_factory_specialist_missions(
    '11111111-1111-4111-8111-111111111111', 'MK-LEDGER-TEST',
    'gha:123456:1', '123456', 1, 1, 180
  );
  if (v_claim ->> 'claimedCount')::integer <> 1
     or v_claim -> 'missions' -> 0 ->> 'mission_id' <> 'mission-2' then
    raise exception 'dependent mission must become claimable only after its dependency completes';
  end if;

  v_mission := v_claim -> 'missions' -> 0;
  v_mission_row_id := (v_mission ->> 'id')::uuid;
  v_lease_token := (v_mission ->> 'lease_token')::uuid;
  update public.project_factory_missions
    set lease_expires_at = now() - interval '1 second'
    where id = v_mission_row_id;

  v_claim := public.claim_factory_specialist_missions(
    '11111111-1111-4111-8111-111111111111', 'MK-LEDGER-TEST',
    'gha:123456:1', '123456', 1, 1, 180
  );
  if (v_claim ->> 'claimedCount')::integer <> 1 then
    raise exception 'expired lease must be safely reclaimed';
  end if;

  v_mission := v_claim -> 'missions' -> 0;
  v_mission_row_id := (v_mission ->> 'id')::uuid;
  v_lease_token := (v_mission ->> 'lease_token')::uuid;
  perform public.start_factory_specialist_mission(v_mission_row_id, 'gha:123456:1', v_lease_token, 180);
  v_result := jsonb_build_object(
    'contractVersion', 1,
    'missionId', 'mission-2',
    'projectId', 'MK-LEDGER-TEST',
    'providerId', 'test-provider',
    'status', 'completed',
    'summary', 'Dependent mission completed after lease recovery.',
    'findings', '[]'::jsonb,
    'artifacts', '[]'::jsonb,
    'verification', jsonb_build_object('performed', jsonb_build_array('sql-test'), 'passed', jsonb_build_array('sql-test'), 'failed', '[]'::jsonb, 'notPerformed', '[]'::jsonb),
    'requiresHumanDecision', false
  );
  perform public.complete_factory_specialist_mission(
    v_mission_row_id, 'gha:123456:1', v_lease_token, v_result, repeat('d', 64)
  );

  v_job := public.finalize_factory_specialist_job(
    '11111111-1111-4111-8111-111111111111', 'MK-LEDGER-TEST'
  );
  if v_job ->> 'status' <> 'awaiting_approval' then
    raise exception 'job must wait for human review after every mission completes';
  end if;

  if (select count(*) from public.project_factory_mission_attempts where job_id = '11111111-1111-4111-8111-111111111111') <> 4 then
    raise exception 'attempt history must retain the expired lease and all retries';
  end if;
  if not exists (
    select 1 from public.project_factory_mission_attempts
    where job_id = '11111111-1111-4111-8111-111111111111' and outcome = 'lease_expired'
  ) then
    raise exception 'expired attempt must be recorded in append-only history';
  end if;
  if not exists (
    select 1 from public.project_factory_mission_events
    where job_id = '11111111-1111-4111-8111-111111111111'
      and event_type = 'job_awaiting_human_review'
  ) then
    raise exception 'final human-review event must be recorded';
  end if;
end
$$;

reset role;

select 'factory mission ledger SQL checks passed' as result;
