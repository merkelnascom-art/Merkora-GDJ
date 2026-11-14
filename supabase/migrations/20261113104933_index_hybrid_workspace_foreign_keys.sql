-- Cover ownership and actor foreign keys introduced by the hybrid workspace.
create index if not exists project_workspace_state_updated_by_idx
  on public.project_workspace_state(updated_by);
create index if not exists project_workspace_events_actor_user_id_idx
  on public.project_workspace_events(actor_user_id);
create index if not exists project_conversation_messages_created_by_idx
  on public.project_conversation_messages(created_by);
create index if not exists project_ai_processing_consents_user_id_idx
  on public.project_ai_processing_consents(user_id);
