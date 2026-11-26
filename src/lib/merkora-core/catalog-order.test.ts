import { describe, expect, it } from "vitest";
import type { CatalogOffer } from "./catalog-offers";
import { evaluateCatalogConfiguration } from "./catalog-configuration";
import { classifyCatalogChange, createCatalogOrderSnapshot } from "./catalog-order";

function offer(overrides: Partial<CatalogOffer> = {}): CatalogOffer {
  return {
    id: "commerce-starter",
    name: "Commerce essentiel",
    summary: "Une solution de vente adaptée à une petite activité.",
    version: 3,
    status: "published",
    productTypeId: "ecommerce",
    domainIds: ["commerce"],
    modules: [
      {
        moduleId: "product_catalog",
        availability: "included",
        includedPersonalizationFields: ["brand_name", "brand_logo"],
      },
      { moduleId: "inventory_movements", availability: "optional" },
    ],
    pricing: { mode: "fixed", currency: "XOF" },
    ...overrides,
  };
}

function acceptedConfiguration() {
  return evaluateCatalogConfiguration(offer(), { selectedModuleIds: ["product_catalog"] });
}

describe("catalogue foundation — order scope and personalization", () => {
  it("classifies a declared field on a purchased module as included personalization", () => {
    const snapshot = createCatalogOrderSnapshot({
      offer: offer(),
      configuration: acceptedConfiguration(),
      optionIds: [],
      acceptedAt: "2026-11-24T12:00:00.000Z",
    });
    expect(classifyCatalogChange(snapshot, {
      kind: "field",
      moduleId: "product_catalog",
      fieldId: "brand_name",
    }).classification).toBe("included_personalization");
  });

  it("classifies a request for a module absent from the accepted order as a scope change", () => {
    const snapshot = createCatalogOrderSnapshot({
      offer: offer(),
      configuration: acceptedConfiguration(),
      optionIds: [],
      acceptedAt: "2026-11-24T12:00:00.000Z",
    });
    expect(classifyCatalogChange(snapshot, {
      kind: "module",
      moduleId: "inventory_movements",
    }).classification).toBe("scope_change");
  });

  it("allows configuration of a purchased module only through its declared fields", () => {
    const snapshot = createCatalogOrderSnapshot({
      offer: offer(),
      configuration: acceptedConfiguration(),
      optionIds: [],
      acceptedAt: "2026-11-24T12:00:00.000Z",
    });
    expect(classifyCatalogChange(snapshot, {
      kind: "field",
      moduleId: "product_catalog",
      fieldId: "brand_logo",
    }).classification).toBe("included_personalization");
    expect(classifyCatalogChange(snapshot, {
      kind: "field",
      moduleId: "product_catalog",
      fieldId: "unlisted_setting",
    }).classification).toBe("scope_change");
    expect(snapshot.moduleIds).toEqual(["product_catalog"]);
  });

  it("records the exact accepted offer and configuration version references", () => {
    const snapshot = createCatalogOrderSnapshot({
      offer: offer(),
      configuration: acceptedConfiguration(),
      optionIds: ["custom-domain"],
      acceptedAt: "2026-11-24T12:00:00.000Z",
    });
    expect(snapshot).toMatchObject({
      offerId: "commerce-starter",
      offerVersion: 3,
      productTypeId: "ecommerce",
      domainIds: ["commerce"],
      moduleIds: ["product_catalog"],
      optionIds: ["custom-domain"],
      pricingMode: "fixed",
      currency: "XOF",
      acceptedAt: "2026-11-24T12:00:00.000Z",
    });
  });

  it("does not change when the source offer or configuration is later mutated", () => {
    const sourceOffer = offer();
    const configuration = evaluateCatalogConfiguration(sourceOffer, {
      selectedModuleIds: ["product_catalog"],
    });
    const snapshot = createCatalogOrderSnapshot({
      offer: sourceOffer,
      configuration,
      optionIds: [],
      acceptedAt: "2026-11-24T12:00:00.000Z",
    });

    sourceOffer.modules.push({ moduleId: "inventory_movements", availability: "optional" });
    sourceOffer.domainIds.push("finance" as CatalogOffer["domainIds"][number]);
    configuration.selectedModuleIds.push("inventory_movements");

    expect(snapshot.moduleIds).toEqual(["product_catalog"]);
    expect(snapshot.domainIds).toEqual(["commerce"]);
    expect(snapshot.personalizationFieldsByModule.product_catalog).toEqual(["brand_name", "brand_logo"]);
  });

  it("sends unknown change targets to review instead of silently including them", () => {
    const snapshot = createCatalogOrderSnapshot({
      offer: offer(),
      configuration: acceptedConfiguration(),
      optionIds: [],
      acceptedAt: "2026-11-24T12:00:00.000Z",
    });
    expect(classifyCatalogChange(snapshot, {
      kind: "unknown",
      targetId: "mystery",
    }).classification).toBe("needs_review");
  });

  it("refuses to create an order snapshot from a rejected configuration", () => {
    const rejected = evaluateCatalogConfiguration(offer(), {
      selectedModuleIds: ["not_a_real_module"],
    });
    expect(() => createCatalogOrderSnapshot({
      offer: offer(),
      configuration: rejected,
      optionIds: [],
      acceptedAt: "2026-11-24T12:00:00.000Z",
    })).toThrow(/configuration/i);
  });
  it("revalidates the selected modules instead of trusting a forged accepted result", () => {
    const forged = {
      accepted: true,
      selectedModuleIds: ["delivery_tracking"],
      suggestedModuleIds: [],
      availableModuleIds: [],
      issues: [],
    };
    expect(() => createCatalogOrderSnapshot({
      offer: offer(),
      configuration: forged,
      optionIds: [],
      acceptedAt: "2026-11-24T12:00:00.000Z",
    })).toThrow(/selection/i);
  });

  it("freezes the accepted snapshot and its nested scope collections", () => {
    const snapshot = createCatalogOrderSnapshot({
      offer: offer(),
      configuration: acceptedConfiguration(),
      optionIds: [],
      acceptedAt: "2026-11-24T12:00:00.000Z",
    });
    expect(Object.isFrozen(snapshot)).toBe(true);
    expect(Object.isFrozen(snapshot.domainIds)).toBe(true);
    expect(Object.isFrozen(snapshot.moduleIds)).toBe(true);
    expect(Object.isFrozen(snapshot.personalizationFieldsByModule)).toBe(true);
    expect(Object.isFrozen(snapshot.personalizationFieldsByModule.product_catalog)).toBe(true);
  });

  it("refuses to create an order snapshot from an unpublished offer", () => {
    const draft = offer({ status: "draft" });
    const result = evaluateCatalogConfiguration(draft, { selectedModuleIds: ["product_catalog"] });
    expect(() => createCatalogOrderSnapshot({
      offer: draft,
      configuration: result,
      optionIds: [],
      acceptedAt: "2026-11-24T12:00:00.000Z",
    })).toThrow(/unpublished/i);
  });

});