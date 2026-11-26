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

const offerStatuses: readonly CatalogOfferStatus[] = [
  "draft",
  "in_review",
  "published",
  "suspended",
  "archived",
];
const pricingModes: readonly CatalogPricingMode[] = ["fixed", "rule_based", "quote_required"];
const identifierPattern = /^[a-z0-9][a-z0-9_-]*$/;

/**
 * Checks offer metadata and its references against the canonical MerKora
 * registry. This is structural validation only: it deliberately does not
 * calculate prices, taxes, discounts, delivery estimates or recurring fees.
 */
export function validateCatalogOffer(offer: CatalogOffer): CatalogOfferValidationIssue[] {
  const issues: CatalogOfferValidationIssue[] = [];
  const addIssue = (code: string, path: string, message: string) => {
    issues.push({ code, path, message });
  };

  if (typeof offer.id !== "string" || !identifierPattern.test(offer.id.trim())) {
    addIssue("invalid_offer_id", "id", "L'identifiant de l'offre doit être un identifiant stable sans espace.");
  }
  if (typeof offer.name !== "string" || !offer.name.trim()) {
    addIssue("invalid_offer_name", "name", "Le nom de l'offre est obligatoire.");
  }
  if (typeof offer.summary !== "string" || !offer.summary.trim()) {
    addIssue("invalid_offer_summary", "summary", "Le résumé de l'offre est obligatoire.");
  }
  if (!Number.isSafeInteger(offer.version) || offer.version < 1) {
    addIssue("invalid_offer_version", "version", "La version doit être un entier positif.");
  }
  if (!offerStatuses.includes(offer.status)) {
    addIssue("invalid_offer_status", "status", "Le statut de l'offre n'est pas reconnu.");
  }
  if (!pricingModes.includes(offer.pricing?.mode)) {
    addIssue("invalid_pricing_mode", "pricing.mode", "Le mode tarifaire n'est pas reconnu.");
  }
  if (typeof offer.pricing?.currency !== "string" || !/^[A-Z]{3}$/.test(offer.pricing.currency)) {
    addIssue("invalid_currency", "pricing.currency", "La devise doit être indiquée par un code de trois lettres majuscules.");
  }

  const productType = getProductType(offer.productTypeId);
  if (!productType) {
    addIssue("unknown_product_type", "productTypeId", "Le type de produit n'existe pas dans le référentiel MerKora.");
  }

  const seenDomainIds = new Set<string>();
  const knownDomainIds: SolutionDomainId[] = [];
  offer.domainIds.forEach((domainId, index) => {
    if (seenDomainIds.has(domainId)) {
      addIssue("duplicate_domain", `domainIds[${index}]`, `Le domaine « ${domainId} » est déclaré plusieurs fois.`);
      return;
    }
    seenDomainIds.add(domainId);

    if (!getDomainCatalog(domainId)) {
      addIssue("unknown_domain", `domainIds[${index}]`, `Le domaine « ${domainId} » n'existe pas dans le référentiel MerKora.`);
      return;
    }
    knownDomainIds.push(domainId);
  });

  const domainComposition = buildHybridDomainComposition(knownDomainIds);
  const knownModuleIds = new Set([
    ...(productType?.baselineModules ?? []),
    ...domainComposition.modules.map((module) => module.id),
  ]);
  const declaredModuleIds = new Set<string>();

  offer.modules.forEach((module, index) => {
    const modulePath = `modules[${index}]`;
    if (typeof module.moduleId !== "string" || !identifierPattern.test(module.moduleId)) {
      addIssue("invalid_module_id", `${modulePath}.moduleId`, "L'identifiant du module est invalide.");
    } else if (!knownModuleIds.has(module.moduleId)) {
      addIssue("unknown_module", `${modulePath}.moduleId`, `Le module « ${module.moduleId} » n'est pas disponible pour ce produit et ces domaines.`);
    }

    if (declaredModuleIds.has(module.moduleId)) {
      addIssue("duplicate_offer_module", `${modulePath}.moduleId`, `Le module « ${module.moduleId} » est déclaré plusieurs fois dans cette offre.`);
    }
    declaredModuleIds.add(module.moduleId);

    if (module.availability !== "included" && module.availability !== "optional") {
      addIssue("invalid_module_availability", `${modulePath}.availability`, "Un module doit être inclus ou optionnel.");
    }

    const fields = module.includedPersonalizationFields ?? [];
    if (fields.length > 0 && module.availability !== "included") {
      addIssue(
        "personalization_requires_included_module",
        `${modulePath}.includedPersonalizationFields`,
        "La personnalisation incluse doit appartenir à un module lui-même inclus dans l'offre.",
      );
    }

    const seenFields = new Set<string>();
    fields.forEach((fieldId, fieldIndex) => {
      if (typeof fieldId !== "string" || !identifierPattern.test(fieldId)) {
        addIssue(
          "invalid_personalization_field",
          `${modulePath}.includedPersonalizationFields[${fieldIndex}]`,
          "L'identifiant du champ personnalisable est invalide.",
        );
      } else if (seenFields.has(fieldId)) {
        addIssue(
          "duplicate_personalization_field",
          `${modulePath}.includedPersonalizationFields[${fieldIndex}]`,
          `Le champ « ${fieldId} » est déclaré plusieurs fois.`,
        );
      }
      seenFields.add(fieldId);
    });
  });

  return issues;
}

/** Only structurally valid published offers can be ordered by a customer. */
export function isCatalogOfferOrderable(offer: CatalogOffer): boolean {
  return offer.status === "published" && validateCatalogOffer(offer).length === 0;
}
