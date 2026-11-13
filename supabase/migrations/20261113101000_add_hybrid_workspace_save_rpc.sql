-- Atomic, optimistic-concurrency save for the durable hybrid workspace.
-- SECURITY INVOKER keeps all owner-scoped RLS policies active.
create or replace function public.save_project_workspace_state(
  p_project_id text,
  p_expected_revision integer,
  p_payload jsonb,
  p_payload_digest text,
  p_event_type text,
  p_summary text
)
returns jsonb
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
declare
  v_revision integer;
begin
  if p_project_id is null or char_length(p_project_id) < 3 or char_length(p_project_id) > 100 then
    raise exception 'invalid_project_id' using errcode = '22023';
  end if;
  if p_expected_revision is null or p_expected_revision < 0 then
    raise exception 'invalid_expected_revision' using errcode = '22023';
  end if;
  if jsonb_typeof(p_payload) is distinct from 'object'
    or octet_length(p_payload::text) > 65536
    or p_payload_digest !~ '^[a-f0-9]{64}$' then
    raise exception 'invalid_workspace_payload' using errcode = '22023';
  end if;
  if p_event_type not in (
    'workspace_created', 'diagnostic_answer_saved', 'sector_confirmed',
    'profession_confirmed', 'deliverable_selected', 'client_decision',
    'client_change_requested', 'conversation_turn_saved'
  ) or p_summary is null or char_length(p_summary) not between 1 and 1000 then
    raise exception 'invalid_workspace_event' using errcode = '22023';
  end if;

  if p_expected_revision = 0 then
    insert into public.project_workspace_state (
      project_id, revision, payload, payload_digest, updated_by
    ) values (
      p_project_id, 1, p_payload, p_payload_digest, auth.uid()
    )
    returning revision into v_revision;
  else
    update public.project_workspace_state
    set revision = revision + 1,
        payload = p_payload,
        payload_digest = p_payload_digest,
        updated_by = auth.uid(),
        updated_at = now()
    where project_id = p_project_id
      and revision = p_expected_revision
    returning revision into v_revision;

    if v_revision is null then
      raise exception 'workspace_revision_conflict' using errcode = '40001';
    end if;
  end if;

  insert into public.project_workspace_events (
    project_id, revision, event_type, summary, payload, actor_user_id
  ) values (
    p_project_id, v_revision, p_event_type, p_summary,
    jsonb_build_object('payload_digest', p_payload_digest),
    auth.uid()
  );

  return jsonb_build_object('revision', v_revision, 'payload_digest', p_payload_digest);
exception
  when unique_violation then
    -- Two devices may both try to create revision zero. The loser must reload,
    -- not overwrite or surface an opaque database error.
    raise exception 'workspace_revision_conflict' using errcode = '40001';
end;
$;

revoke all on function public.save_project_workspace_state(text, integer, jsonb, text, text, text) from public, anon;
grant execute on function public.save_project_workspace_state(text, integer, jsonb, text, text, text) to authenticated;

comment on function public.save_project_workspace_state(text, integer, jsonb, text, text, text) is
  'Atomically persists a versioned hybrid project workspace and its audit event under caller RLS policies.';
