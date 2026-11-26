import type { SolutionDomainId, SolutionProductTypeId } from "./solution-catalog";
import type { CatalogOffer, CatalogPricingMode } from "./catalog-offers";
import { evaluateCatalogConfiguration, type CatalogConfigurationResult } from "./catalog-configuration";

export interface CatalogOrderSnapshot {
  readonly offerId: string;
  readonly offerVersion: number;
  readonly productTypeId: SolutionProductTypeId;
  readonly domainIds: readonly SolutionDomainId[];
  readonly moduleIds: readonly string[];
  readonly optionIds: readonly string[];
  readonly pricingMode: CatalogPricingMode;
  readonly currency: string;
  readonly acceptedAt: string;
  readonly personalizationFieldsByModule: Readonly<Record<string, readonly string[]>>;
}

export interface CreateCatalogOrderSnapshotInput {
  offer: CatalogOffer;
  configuration: CatalogConfigurationResult;
  optionIds: string[];
  acceptedAt: string;
}

export type CatalogChange =
  | { kind: "field"; moduleId: string; fieldId: string }
  | { kind: "module"; moduleId: string }
  | { kind: "option"; optionId: string }
  | { kind: "unknown"; targetId: string };

export type CatalogChangeClassification =
  | "included_personalization"
  | "scope_change"
  | "needs_review";

export interface CatalogChangeDecision {
  classification: CatalogChangeClassification;
  reason: string;
}

/**
 * Creates a detached, frozen snapshot of the accepted commercial and
 * functional scope. The offer must be published and the selection is
 * re-evaluated rather than trusting a client-provided "accepted" flag.
 */
export function createCatalogOrderSnapshot(
  input: CreateCatalogOrderSnapshotInput,
): CatalogOrderSnapshot {
  const { offer, configuration } = input;

  if (!configuration.accepted) {
    throw new Error("Cannot create an order snapshot from a rejected configuration.");
  }
  if (offer.status !== "published") {
    throw new Error("Cannot create an order snapshot from an unpublished offer.");
  }

  const verifiedSelection = evaluateCatalogConfiguration(offer, {
    selectedModuleIds: configuration.selectedModuleIds,
  });
  if (!verifiedSelection.accepted) {
    throw new Error("Cannot create an order snapshot from an invalid selection.");
  }

  const selectedModuleIds = [...verifiedSelection.selectedModuleIds];
  const selectedSet = new Set(selectedModuleIds);
  const personalizationFieldsByModule = Object.freeze(Object.fromEntries(
    offer.modules
      .filter((module) => selectedSet.has(module.moduleId))
      .map((module) => [
        module.moduleId,
        Object.freeze([...new Set(module.includedPersonalizationFields ?? [])]),
      ]),
  ));

  return Object.freeze({
    offerId: offer.id,
    offerVersion: offer.version,
    productTypeId: offer.productTypeId,
    domainIds: Object.freeze([...offer.domainIds]),
    moduleIds: Object.freeze(selectedModuleIds),
    optionIds: Object.freeze([...input.optionIds]),
    pricingMode: offer.pricing.mode,
    currency: offer.pricing.currency,
    acceptedAt: input.acceptedAt,
    personalizationFieldsByModule,
  });
}

/** Classifies a post-order change against the exact scope accepted by the client. */
export function classifyCatalogChange(
  snapshot: CatalogOrderSnapshot,
  change: CatalogChange,
): CatalogChangeDecision {
  if (change.kind === "field") {
    const moduleWasPurchased = snapshot.moduleIds.includes(change.moduleId);
    const fieldWasIncluded = snapshot.personalizationFieldsByModule[change.moduleId]
      ?.includes(change.fieldId) ?? false;

    if (moduleWasPurchased && fieldWasIncluded) {
      return {
        classification: "included_personalization",
        reason: "Ce champ fait partie de la personnalisation incluse pour un module commandé.",
      };
    }

    return {
      classification: "scope_change",
      reason: "Ce champ n'est pas autorisé dans la personnalisation incluse de la commande.",
    };
  }

  if (change.kind === "module") {
    if (snapshot.moduleIds.includes(change.moduleId)) {
      return {
        classification: "included_personalization",
        reason: "Ce module figure déjà dans le périmètre accepté.",
      };
    }

    return {
      classification: "scope_change",
      reason: "L'ajout de ce module étend le périmètre de la commande acceptée.",
    };
  }

  if (change.kind === "option") {
    if (snapshot.optionIds.includes(change.optionId)) {
      return {
        classification: "included_personalization",
        reason: "Cette option figure déjà dans la commande acceptée.",
      };
    }

    return {
      classification: "scope_change",
      reason: "Cette option n'est pas présente dans la commande acceptée.",
    };
  }

  return {
    classification: "needs_review",
    reason: "La cible de cette demande n'est pas reconnue et nécessite une vérification par MerKora.",
  };
}
