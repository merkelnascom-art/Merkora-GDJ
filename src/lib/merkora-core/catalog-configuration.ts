import {
  buildHybridDomainComposition,
  getProductType,
  type SolutionDomainModule,
} from "./solution-catalog";
import { validateCatalogOffer, type CatalogOffer } from "./catalog-offers";

export interface CatalogConfigurationSelection {
  /** Explicit choices made by the customer; AI suggestions do not belong here. */
  selectedModuleIds: string[];
  /** Advisory suggestions that must remain unselected until the customer chooses them. */
  suggestedModuleIds?: string[];
}

export interface CatalogConfigurationIssue {
  code: string;
  path: string;
  message: string;
}

export interface CatalogConfigurationResult {
  accepted: boolean;
  selectedModuleIds: string[];
  suggestedModuleIds: string[];
  availableModuleIds: string[];
  issues: CatalogConfigurationIssue[];
}

/**
 * Evaluates explicit customer choices against a versioned offer.
 * The function is deterministic and does not mutate the offer or selection.
 */
export function evaluateCatalogConfiguration(
  offer: CatalogOffer,
  selection: CatalogConfigurationSelection,
): CatalogConfigurationResult {
  const issues: CatalogConfigurationIssue[] = [];
  const offerIssues = validateCatalogOffer(offer);

  if (offerIssues.length > 0) {
    issues.push({
      code: "invalid_offer",
      path: "offer",
      message: "Cette offre contient des références ou déclarations invalides.",
    });
  }

  const productType = getProductType(offer.productTypeId);
  const composition = buildHybridDomainComposition(offer.domainIds);
  const domainModules = new Map<string, SolutionDomainModule>(
    composition.modules.map((module) => [module.id, module]),
  );
  const availableModuleIds = [...new Set([
    ...(productType?.baselineModules ?? []),
    ...composition.modules.map((module) => module.id),
  ])];
  const availableModuleIdSet = new Set(availableModuleIds);
  const offerModules = new Map(offer.modules.map((module) => [module.moduleId, module]));
  const selectedModuleIds: string[] = [];
  const seenSelectedIds = new Set<string>();

  selection.selectedModuleIds.forEach((moduleId, index) => {
    if (seenSelectedIds.has(moduleId)) return;
    seenSelectedIds.add(moduleId);

    if (!availableModuleIdSet.has(moduleId)) {
      issues.push({
        code: "unknown_selected_module",
        path: `selectedModuleIds[${index}]`,
        message: `Le module « ${moduleId} » n'existe pas dans la composition de ce produit.`,
      });
      return;
    }

    if (!offerModules.has(moduleId)) {
      issues.push({
        code: "module_not_in_offer",
        path: `selectedModuleIds[${index}]`,
        message: `Le module « ${moduleId} » n'est pas compris dans cette offre ni proposé comme option.`,
      });
      return;
    }

    selectedModuleIds.push(moduleId);
  });

  const selectedSet = new Set(selectedModuleIds);
  selectedModuleIds.forEach((moduleId) => {
    const definition = domainModules.get(moduleId);
    definition?.dependsOn?.forEach((dependencyId) => {
      if (!selectedSet.has(dependencyId)) {
        issues.push({
          code: "missing_module_dependency",
          path: `selectedModuleIds.${moduleId}`,
          message: `Le module « ${moduleId} » nécessite aussi « ${dependencyId} ».`,
        });
      }
    });
  });

  const suggestedModuleIds = [...new Set(selection.suggestedModuleIds ?? [])]
    .filter((moduleId) => offerModules.has(moduleId) && availableModuleIdSet.has(moduleId));

  return {
    accepted: issues.length === 0,
    selectedModuleIds,
    suggestedModuleIds,
    availableModuleIds,
    issues,
  };
}
