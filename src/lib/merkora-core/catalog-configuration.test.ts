import { describe, expect, it } from "vitest";
import type { CatalogOffer } from "./catalog-offers";
import { evaluateCatalogConfiguration } from "./catalog-configuration";

function commerceOffer(overrides: Partial<CatalogOffer> = {}): CatalogOffer {
  return {
    id: "commerce-starter",
    name: "Commerce essentiel",
    summary: "Une solution de vente adaptée à une petite activité.",
    version: 1,
    status: "published",
    productTypeId: "ecommerce",
    domainIds: ["commerce"],
    modules: [
      { moduleId: "product_catalog", availability: "included" },
      { moduleId: "inventory_movements", availability: "optional" },
      { moduleId: "order_management", availability: "included" },
    ],
    pricing: { mode: "fixed", currency: "XOF" },
    ...overrides,
  };
}

describe("catalogue foundation — configuration evaluator", () => {
  it("accepts an explicitly selected module included in the offer", () => {
    const result = evaluateCatalogConfiguration(commerceOffer(), {
      selectedModuleIds: ["product_catalog"],
    });
    expect(result.accepted).toBe(true);
    expect(result.selectedModuleIds).toEqual(["product_catalog"]);
    expect(result.issues).toEqual([]);
  });

  it("accepts an optional module only when the offer declares it", () => {
    const result = evaluateCatalogConfiguration(commerceOffer(), {
      selectedModuleIds: ["inventory_movements"],
    });
    expect(result.accepted).toBe(true);
    expect(result.selectedModuleIds).toEqual(["inventory_movements"]);
  });

  it("rejects a known module that is not declared by the offer", () => {
    const result = evaluateCatalogConfiguration(commerceOffer(), {
      selectedModuleIds: ["delivery_tracking"],
    });
    expect(result.accepted).toBe(false);
    expect(result.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: "module_not_in_offer" })]),
    );
  });

  it("rejects an unknown selected module instead of silently ignoring it", () => {
    const result = evaluateCatalogConfiguration(commerceOffer(), {
      selectedModuleIds: ["made_up_module"],
    });
    expect(result.accepted).toBe(false);
    expect(result.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: "unknown_selected_module" })]),
    );
  });

  it("reports dependencies missing from an explicitly selected hybrid module", () => {
    const hybridOffer = commerceOffer({
      productTypeId: "operational_solution",
      domainIds: ["attendance", "reservation"],
      modules: [
        { moduleId: "attendance_capture", availability: "included" },
        { moduleId: "reservation_slots", availability: "included" },
        { moduleId: "check_in_from_reservation", availability: "optional" },
      ],
    });
    const result = evaluateCatalogConfiguration(hybridOffer, {
      selectedModuleIds: ["check_in_from_reservation"],
    });
    expect(result.accepted).toBe(false);
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "missing_module_dependency",
          message: expect.stringMatching(/attendance_capture|reservation_slots/),
        }),
      ]),
    );
  });

  it("returns shared hybrid modules only once", () => {
    const hybridOffer = commerceOffer({
      productTypeId: "architecture_workspace",
      domainIds: ["architecture", "business_management"],
      modules: [{ moduleId: "materials_estimation", availability: "included" }],
    });
    const result = evaluateCatalogConfiguration(hybridOffer, { selectedModuleIds: [] });
    expect(result.availableModuleIds.filter((id) => id === "materials_estimation")).toHaveLength(1);
  });

  it("keeps AI suggestions advisory until the client explicitly selects them", () => {
    const result = evaluateCatalogConfiguration(commerceOffer(), {
      selectedModuleIds: ["product_catalog"],
      suggestedModuleIds: ["inventory_movements"],
    });
    expect(result.selectedModuleIds).toEqual(["product_catalog"]);
    expect(result.suggestedModuleIds).toEqual(["inventory_movements"]);
  });
});
