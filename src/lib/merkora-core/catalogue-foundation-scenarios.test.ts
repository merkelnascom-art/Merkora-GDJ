import { describe, expect, it } from "vitest";
import { evaluateCatalogConfiguration } from "./catalog-configuration";
import type { CatalogOffer } from "./catalog-offers";
import { getDomainCatalogs, getProductTypeCatalog } from "./solution-catalog";

function offer(
  id: string,
  productTypeId: CatalogOffer["productTypeId"],
  domainIds: CatalogOffer["domainIds"],
  moduleIds: string[],
): CatalogOffer {
  return {
    id,
    name: id,
    summary: "Offre de test en mémoire.",
    version: 1,
    status: "published",
    productTypeId,
    domainIds,
    modules: moduleIds.map((moduleId) => ({ moduleId, availability: "included" })),
    pricing: { mode: "quote_required", currency: "XOF" },
  };
}

describe("catalogue foundation — universal business scenarios", () => {
  it("composes Aéro Service attendance, reservation and team operations without confusing check-in with booking", () => {
    const product = offer("aero-service", "web_platform",
      ["attendance", "reservation", "business_management"], [
        "attendance_capture",
        "reservation_slots",
        "check_in_from_reservation",
        "task_follow_up",
      ]);
    const result = evaluateCatalogConfiguration(product, {
      selectedModuleIds: [
        "attendance_capture",
        "reservation_slots",
        "check_in_from_reservation",
        "task_follow_up",
      ],
    });
    expect(result.accepted).toBe(true);
    expect(result.selectedModuleIds).toContain("check_in_from_reservation");
    expect(result.availableModuleIds).not.toContain("cashflow_tracking");
  });

  it("composes WALL Trade commerce and business operations without duplicate modules", () => {
    const product = offer("wall-trade", "ecommerce", ["commerce", "business_management"], [
      "product_catalog",
      "inventory_movements",
      "order_management",
      "delivery_tracking",
      "team_directory",
      "task_follow_up",
    ]);
    const result = evaluateCatalogConfiguration(product, {
      selectedModuleIds: product.modules.map((module) => module.moduleId),
    });
    expect(result.accepted).toBe(true);
    expect(new Set(result.availableModuleIds).size).toBe(result.availableModuleIds.length);
    expect(result.selectedModuleIds).toContain("inventory_movements");
  });

  it("keeps Ginesse de Paris Center Work service catalogue and financial tracking as distinct capabilities", () => {
    const product = offer("ginesse-center-work", "web_application", ["commerce", "finance"], [
      "product_catalog",
      "cashflow_tracking",
      "invoice_register",
    ]);
    const result = evaluateCatalogConfiguration(product, {
      selectedModuleIds: ["product_catalog", "cashflow_tracking", "invoice_register"],
    });
    expect(result.accepted).toBe(true);
    expect(result.availableModuleIds).toContain("product_catalog");
    expect(result.availableModuleIds).toContain("cashflow_tracking");
    expect(result.selectedModuleIds).not.toContain("inventory_movements");
  });

  it("lets Student Vision select assessment capabilities without assuming a school-management scope", () => {
    const product = offer("student-vision", "web_platform", ["education"], [
      "quizzes_assessments",
    ]);
    const result = evaluateCatalogConfiguration(product, {
      selectedModuleIds: ["quizzes_assessments"],
    });
    expect(result.accepted).toBe(true);
    expect(result.selectedModuleIds).toEqual(["quizzes_assessments"]);
    expect(result.selectedModuleIds).not.toContain("learner_records");
  });

  it("supports an architecture workspace with measurements, plans, 3D and materials estimation", () => {
    const product = offer("architecture-workspace", "architecture_workspace", ["architecture"], [
      "site_measurements",
      "architectural_plans",
      "3d_visualization",
      "materials_estimation",
    ]);
    const result = evaluateCatalogConfiguration(product, {
      selectedModuleIds: product.modules.map((module) => module.moduleId),
    });
    expect(result.accepted).toBe(true);
    expect(result.selectedModuleIds).toEqual(expect.arrayContaining([
      "site_measurements",
      "architectural_plans",
      "3d_visualization",
      "materials_estimation",
    ]));
  });

  it("keeps every currently registered product type and business domain addressable", () => {
    expect(getProductTypeCatalog()).toHaveLength(10);
    expect(getDomainCatalogs()).toHaveLength(16);
  });
});
