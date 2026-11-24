import { describe, expect, it } from "vitest";
import {
  buildHybridDomainComposition,
  getDomainCatalog,
  getProductTypeCatalog,
} from "./solution-catalog";

describe("screen 06 — universal product and domain catalogue", () => {
  it("keeps a showcase website, a platform and a mobile app as distinct product types", () => {
    const types = getProductTypeCatalog();
    const website = types.find((item) => item.id === "showcase_website");
    const platform = types.find((item) => item.id === "web_platform");
    const mobile = types.find((item) => item.id === "mobile_app");

    expect(website?.baselineModules).toContain("public_pages");
    expect(website?.baselineModules).toContain("seo_visibility");
    expect(platform?.baselineModules).toContain("role_workspaces");
    expect(platform?.baselineModules).toContain("admin_console");
    expect(mobile?.baselineModules).toContain("mobile_navigation");
    expect(mobile?.baselineModules).toContain("push_notifications");
  });

  it("gives attendance its own controls instead of confusing it with financial tracking", () => {
    const attendance = getDomainCatalog("attendance");
    const finance = getDomainCatalog("finance");

    expect(attendance?.modules.map((module) => module.id)).toEqual(
      expect.arrayContaining(["attendance_capture", "late_management", "attendance_audit"]),
    );
    expect(finance?.modules.map((module) => module.id)).toEqual(
      expect.arrayContaining(["cashflow_tracking", "expense_approval", "financial_reporting"]),
    );
    expect(attendance?.modules.some((module) => module.id === "cashflow_tracking")).toBe(false);
  });

  it("composes attendance and reservation as a real hybrid without duplicate modules", () => {
    const composition = buildHybridDomainComposition(["attendance", "reservation"]);
    const ids = composition.modules.map((module) => module.id);

    expect(composition.domainIds).toEqual(["attendance", "reservation"]);
    expect(ids).toEqual(expect.arrayContaining([
      "attendance_capture",
      "late_management",
      "reservation_slots",
      "qr_invitations",
      "check_in_from_reservation",
    ]));
    expect(new Set(ids).size).toBe(ids.length);
    expect(composition.modules.find((module) => module.id === "check_in_from_reservation")?.dependsOn)
      .toEqual(expect.arrayContaining(["attendance_capture", "reservation_slots"]));
  });

  it("keeps the project owner administrator distinct from the people who use the product", () => {
    const platform = getProductTypeCatalog().find((item) => item.id === "web_platform");
    expect(platform?.defaultRoles).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: "project_owner_admin", scope: "owner" }),
      expect.objectContaining({ id: "end_user", scope: "product_user" }),
    ]));
  });

  it("exposes the architecture and construction domain as a specialized catalogue", () => {
    const architecture = getDomainCatalog("architecture");
    expect(architecture?.modules.map((module) => module.id)).toEqual(
      expect.arrayContaining(["site_measurements", "architectural_plans", "3d_visualization", "materials_estimation"]),
    );
  });
});
