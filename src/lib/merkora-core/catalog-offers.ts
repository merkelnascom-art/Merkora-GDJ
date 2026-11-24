import {
  buildHybridDomainComposition,
  getDomainCatalog,
  getProductType,
  type SolutionDomainId,
  type SolutionProductTypeId,
} from "./solution-catalog";

export type CatalogOfferStatus =
  | "draft"
  | "in_review"
  | "published"
  | "suspended"
  | "archived";

export type CatalogPricingMode = "fixed" | "rule_based" | "quote_required";

export interface CatalogOfferModule {
  moduleId: string;
  availability: "included" | "optional";
  includedPersonalizationFields?: string[];
}

export interface CatalogOfferPricing {
  mode: CatalogPricingMode;
  currency: string;
}

export interface CatalogOffer {
  id: string;
  name: string;
  summary: string;
  version: number;
  status: CatalogOfferStatus;
  productTypeId: SolutionProductTypeId;
  domainIds: SolutionDomainId[];
  modules: CatalogOfferModule[];
  pricing: CatalogOfferPricing;
}

export interface CatalogOfferValidationIssue {
  code: string;
  path: string;
  message: string;
}

/**
 * Checks that an offer refers only to product, domain and module definitions
 * already present in the canonical MerKora registry.
 *
 * This is structural validation only: it deliberately does not calculate
 * prices, taxes, discounts, delivery estimates or recurring fees.
 */
export function validateCatalogOffer(offer: CatalogOffer): CatalogOfferValidationIssue[] {
  const issues: CatalogOfferValidationIssue[] = [];
  const productType = getProductType(offer.productTypeId);

  if (!productType) {
    issues.push({
      code: "unknown_product_type",
      path: "productTypeId",
      message: "Le type de produit n'existe pas dans le référentiel MerKora.",
    });
  }

  const knownDomainIds = offer.domainIds.filter((domainId) => getDomainCatalog(domainId));
  offer.domainIds.forEach((domainId, index) => {
    if (!getDomainCatalog(domainId)) {
      issues.push({
        code: "unknown_domain",
        path: `domainIds[${index}]`,
        message: `Le domaine « ${domainId} » n'existe pas dans le référentiel MerKora.`,
      });
    }
  });

  const domainComposition = buildHybridDomainComposition(knownDomainIds);
  const knownModuleIds = new Set([
    ...(productType?.baselineModules ?? []),
    ...domainComposition.modules.map((module) => module.id),
  ]);
  const declaredModuleIds = new Set<string>();

  offer.modules.forEach((module, index) => {
    if (!knownModuleIds.has(module.moduleId)) {
      issues.push({
        code: "unknown_module",
        path: `modules[${index}].moduleId`,
        message: `Le module « ${module.moduleId} » n'est pas disponible pour ce produit et ces domaines.`,
      });
    }

    if (declaredModuleIds.has(module.moduleId)) {
      issues.push({
        code: "duplicate_offer_module",
        path: `modules[${index}].moduleId`,
        message: `Le module « ${module.moduleId} » est déclaré plusieurs fois dans cette offre.`,
      });
    }
    declaredModuleIds.add(module.moduleId);
  });

  return issues;
}

/** Only structurally valid published offers can be ordered by a customer. */
export function isCatalogOfferOrderable(offer: CatalogOffer): boolean {
  return offer.status === "published" && validateCatalogOffer(offer).length === 0;
}
