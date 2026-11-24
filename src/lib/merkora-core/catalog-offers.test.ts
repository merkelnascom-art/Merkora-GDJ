import { describe, expect, it } from "vitest";
import {
  isCatalogOfferOrderable,
  validateCatalogOffer,
  type CatalogOffer,
} from "./catalog-offers";

function offer(overrides: Partial<CatalogOffer> = {}): CatalogOffer {
  return {
    id: "commerce-starter",
    name: "Commerce essentiel",
    summary: "Une solution de vente adaptée à une petite activité.",
    version: 1,
    status: "published",
    productTypeId: "ecommerce",
    domainIds: ["commerce"],
    modules: [
      { moduleId: "product_catalog", availability: "included", includedPersonalizationFields: ["brand_name", "brand_logo"] },
      { moduleId: "inventory_movements", availability: "optional" },
    ],
    pricing: { mode: "fixed", currency: "XOF" },
    ...overrides,
  };
}

describe("catalogue foundation — versioned offers", () => {
  it("accepts a published offer that references the canonical product, domain and modules", () => {
    expect(validateCatalogOffer(offer())).toEqual([]);
    expect(isCatalogOfferOrderable(offer())).toBe(true);
  });

  it("rejects a product type that is not in the canonical registry", () => {
    const invalid = offer({ productTypeId: "unknown_product" as CatalogOffer["productTypeId"] });
    expect(validateCatalogOffer(invalid)).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: "unknown_product_type" })]),
    );
    expect(isCatalogOfferOrderable(invalid)).toBe(false);
  });

  it("rejects an unknown business domain", () => {
    const invalid = offer({ domainIds: ["commerce", "unknown_domain"] as CatalogOffer["domainIds"] });
    expect(validateCatalogOffer(invalid)).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: "unknown_domain" })]),
    );
  });

  it("rejects a module that is not part of the selected product and domain composition", () => {
    const invalid = offer({ modules: [{ moduleId: "not_a_real_module", availability: "included" }] });
    expect(validateCatalogOffer(invalid)).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: "unknown_module" })]),
    );
  });

  it("rejects duplicate declarations that mark one module both included and optional", () => {
    const invalid = offer({
      modules: [
        { moduleId: "product_catalog", availability: "included" },
        { moduleId: "product_catalog", availability: "optional" },
      ],
    });
    expect(validateCatalogOffer(invalid)).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: "duplicate_offer_module" })]),
    );
  });

  it("keeps draft offers valid but not orderable by customers", () => {
    const draft = offer({ status: "draft" });
    expect(validateCatalogOffer(draft)).toEqual([]);
    expect(isCatalogOfferOrderable(draft)).toBe(false);
  });

  it("preserves the three distinct pricing modes without calculating a price", () => {
    expect(validateCatalogOffer(offer({ pricing: { mode: "fixed", currency: "XOF" } }))).toEqual([]);
    expect(validateCatalogOffer(offer({ pricing: { mode: "rule_based", currency: "XOF" } }))).toEqual([]);
    expect(validateCatalogOffer(offer({ pricing: { mode: "quote_required", currency: "XOF" } }))).toEqual([]);
  });
});
