import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const path = "supabase/migrations/20261112163000_project_team_memberships.sql";
const migration = existsSync(path) ? readFileSync(path, "utf8") : "";

describe("project team membership migration", () => {
  it("creates project-scoped memberships and per-module view/edit grants", () => {
    expect(migration).toMatch(/create table if not exists public\.project_team_memberships/i);
    expect(migration).toMatch(/project_id text not null references public\.user_projects\(id\)/i);
    expect(migration).toMatch(/user_id uuid references auth\.users\(id\)/i);
    expect(migration).toMatch(/create table if not exists public\.project_team_module_permissions/i);
    expect(migration).toMatch(/can_view boolean not null/i);
    expect(migration).toMatch(/can_edit boolean not null/i);
    expect(migration).toMatch(/check\s*\(not can_edit or can_view\)/i);
  });

  it("keeps membership management owner/admin-only and pending invites non-authorizing", () => {
    expect(migration).toMatch(/alter table public\.project_team_memberships enable row level security/i);
    expect(migration).toMatch(/alter table public\.project_team_module_permissions enable row level security/i);
    expect(migration).toMatch(/status = 'active'/i);
    expect(migration).toMatch(/user_id = \(select auth\.uid\(\)\)/i);
    expect(migration).toMatch(/revoke all on table public\.project_team_memberships from anon, authenticated/i);
    expect(migration).toMatch(/revoke all on table public\.project_team_module_permissions from anon, authenticated/i);
    expect(migration).toMatch(/grant select on table public\.project_team_memberships to authenticated/i);
    expect(migration).toMatch(/grant select on table public\.project_team_module_permissions to authenticated/i);
  });

  it("adds module-level collaborator access to persistent module data", () => {
    expect(migration).toMatch(/drop policy if exists "module data readable by owner or admin"/i);
    expect(migration).toMatch(/can_view/i);
    expect(migration).toMatch(/can_edit/i);
    expect(migration).toMatch(/updated_by = \(select auth\.uid\(\)\)/i);
    expect(migration).toMatch(/create policy .*module data.*collaborator/i);
    expect(migration).not.toMatch(/create policy .*for delete.*project_module_data/i);
  });

  it("keeps storefront content public only when published and grants staff only assigned management access", () => {
    expect(migration).toMatch(/is_published/i);
    expect(migration).toMatch(/is_active/i);
    expect(migration).toMatch(/catalogue-de-gateau-et-de-patisserie/i);
    expect(migration).toMatch(/panier-et-validation-de-commande/i);
    expect(migration).toMatch(/commande-personnalisee/i);
    expect(migration).toMatch(/store owners can read orders/i);
    expect(migration).toMatch(/store owners can update order status/i);
    expect(migration).toMatch(/store owners can read custom requests/i);
    expect(migration).toMatch(/store owners can update custom request status/i);
    expect(migration).toMatch(/revoke update on table public\.project_store_orders from authenticated/i);
    expect(migration).toMatch(/grant update \(status\) on table public\.project_store_orders to authenticated/i);
    expect(migration).toMatch(/revoke update on table public\.project_store_custom_requests from authenticated/i);
    expect(migration).toMatch(/grant update \(status\) on table public\.project_store_custom_requests to authenticated/i);
  });

  it("preserves existing data and never grants anonymous access to private business records", () => {
    expect(migration).not.toMatch(/delete from public\./i);
    expect(migration).not.toMatch(/drop table public\./i);
    expect(migration).not.toMatch(/to anon.*project_store_orders/i);
    expect(migration).not.toMatch(/to anon.*project_store_custom_requests/i);
    expect(migration).not.toMatch(/to anon.*project_module_data/i);
  });
});
