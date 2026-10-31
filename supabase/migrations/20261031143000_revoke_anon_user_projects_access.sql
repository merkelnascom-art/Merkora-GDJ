-- Remove unnecessary Data API privileges from unauthenticated clients.
-- RLS remains enabled and existing authenticated-owner policies are unchanged.
-- This migration does not modify or delete any user_projects rows.
revoke all privileges on table public.user_projects from anon;

comment on table public.user_projects is
  'MerKora customer projects. Access is restricted to authenticated owners by RLS.';
