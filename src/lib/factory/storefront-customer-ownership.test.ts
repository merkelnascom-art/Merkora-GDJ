import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  "supabase/migrations/20261112140000_link_storefront_records_to_customer_accounts.sql",
  "utf8",
);

describe("storefront customer account ownership migration", () => {
  it("links authenticated orders and custom requests to the submitting account", () => {
    expect(migration).toMatch(/alter table public\.project_store_orders[\s\S]*add column if not exists customer_user_id uuid references auth\.users\(id\)/i);
    expect(migration).toMatch(/alter table public\.project_store_custom_requests[\s\S]*add column if not exists customer_user_id uuid references auth\.users\(id\)/i);
    expect(migration).toMatch(/new\.customer_user_id\s*:=\s*auth\.uid\(\)/i);
    expect(migration).toMatch(/create trigger .*customer.*order/i);
    expect(migration).toMatch(/create trigger .*customer.*request/i);
  });

  it("allows customers to read only their own orders and custom requests", () => {
    expect(migration).toMatch(/customer_user_id\s*=\s*\(select auth\.uid\(\)\)/i);
    expect(migration).toMatch(/create policy .*customers can read their own orders/i);
    expect(migration).toMatch(/create policy .*customers can read their own custom requests/i);
  });

  it("allows customers to read only their own private inspiration photos", () => {
    expect(migration).toMatch(/create policy .*customers can read their own reference photos/i);
    expect(migration).toMatch(/bucket_id\s*=\s*'project-store-references'/i);
    expect(migration).toMatch(/reference_image_path\s*=\s*name/i);
    expect(migration).toMatch(/customer_user_id\s*=\s*\(select auth\.uid\(\)\)/i);
  });

  it("preserves guest ordering and existing customer records", () => {
    expect(migration).toMatch(/add column if not exists customer_user_id/i);
    expect(migration).not.toMatch(/delete from public\.project_store_(orders|custom_requests)/i);
    expect(migration).not.toMatch(/drop table public\.project_store_(orders|custom_requests)/i);
  });
});
