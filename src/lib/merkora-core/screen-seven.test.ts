import { describe, expect, it } from "vitest";
import {
  addWorkspaceRole,
  buildWorkspacePlan,
  setWorkspaceRoleEnabled,
  simulateWorkspaceAction,
  updateWorkspaceRole,
} from "./screen-seven";
import type { SolutionProductProfile } from "./solution-catalog";

const profile: SolutionProductProfile = {
  projectName: "Boutique test",
  productTypeId: "ecommerce",
  domainIds: ["commerce"],
  navigationStyle: "sidebar",
  brandingMode: "to_define",
};

describe("screen 07 — role workspaces and product launch", () => {
  it("creates a private owner space and distinct customer and operational spaces", () => {
    const plan = buildWorkspacePlan(profile);
    expect(plan.roles).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: "project_owner_admin", access: "private" }),
      expect.objectContaining({ id: "end_user", access: "authenticated" }),
      expect.objectContaining({ id: "sales_agent", access: "authenticated" }),
      expect.objectContaining({ id: "stock_manager", access: "authenticated" }),
    ]));
  });

  it("gives a showcase website a public visitor experience without inventing a staff workspace", () => {
    const plan = buildWorkspacePlan({ ...profile, productTypeId: "showcase_website", domainIds: [] });
    expect(plan.roles).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: "project_owner_admin", access: "private" }),
      expect.objectContaining({ id: "public_visitor", access: "public" }),
    ]));
    expect(plan.roles.some((role) => role.id === "sales_agent")).toBe(false);
  });

  it("lets the client rename, disable and add roles without losing the original identity", () => {
    const plan = buildWorkspacePlan(profile);
    const renamed = updateWorkspaceRole(plan, "sales_agent", { label: "Conseiller commercial" });
    const disabled = setWorkspaceRoleEnabled(renamed, "stock_manager", false);
    const extended = addWorkspaceRole(disabled, {
      id: "delivery_agent",
      label: "Livreur",
      description: "Suit les livraisons.",
      access: "authenticated",
      permissions: ["view_assigned_deliveries", "update_delivery_status"],
    });
    expect(extended.roles.find((role) => role.id === "sales_agent")?.label).toBe("Conseiller commercial");
    expect(extended.roles.find((role) => role.id === "stock_manager")?.enabled).toBe(false);
    expect(extended.roles.find((role) => role.id === "delivery_agent")?.permissions).toContain("update_delivery_status");
  });

  it("propagates a simulated customer order to the owner and sales workspaces", () => {
    const plan = buildWorkspacePlan(profile);
    const result = simulateWorkspaceAction(plan, "customer_order_created");
    expect(result.events[0]?.visibleToRoleIds).toEqual(expect.arrayContaining(["project_owner_admin", "sales_agent"]));
    expect(result.events[0]?.visibleToRoleIds).not.toContain("public_visitor");
  });

  it("rejects duplicate custom role identifiers", () => {
    const plan = buildWorkspacePlan(profile);
    expect(() => addWorkspaceRole(plan, {
      id: "sales_agent",
      label: "Autre agent",
      description: "Doublon",
      access: "authenticated",
      permissions: [],
    })).toThrow("Ce profil existe déjà.");
  });
});
