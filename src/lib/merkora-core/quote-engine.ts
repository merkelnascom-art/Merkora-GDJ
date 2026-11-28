import type { CustomerJourney } from "./journey-boundaries";

export type QuoteComplexity = "simple" | "standard" | "complex" | "very_complex";
export type QuoteBillingTreatment = "included" | "billable" | "manual_review";
export type QuoteLineStatus = "included" | "priced" | "requires_review";

export interface QuoteTariffRule {
  id: string;
  domainIds?: readonly string[];
  moduleIds?: readonly string[];
  /** Administratively configured price in FCFA/XOF. */
  unitPriceXof: number;
  complexityMultipliers?: Partial<Record<QuoteComplexity, number>>;
}

export interface QuoteScopeItem {
  id: string;
  /** Stable identity shared by the same capability across modules, preventing double billing. */
  billingKey?: string;
  label: string;
  domainId: string;
  moduleId?: string;
  billingTreatment: QuoteBillingTreatment;
  tariffRuleId?: string;
  quantity?: number;
  complexity?: QuoteComplexity;
}

export interface AutomaticQuoteInput {
  quoteId: string;
  journey: CustomerJourney;
  tariffVersion: string;
  items: readonly QuoteScopeItem[];
  tariffRules: readonly QuoteTariffRule[];
  createdAt?: string;
}

export type QuoteReviewCode =
  | "manual_review_required"
  | "missing_tariff"
  | "ambiguous_tariff"
  | "tariff_scope_mismatch"
  | "invalid_tariff"
  | "invalid_quantity"
  | "missing_complexity_multiplier"
  | "duplicate_scope_item"
  | "amount_overflow";

export interface QuoteReviewReason {
  itemId: string;
  code: QuoteReviewCode;
  message: string;
}

export interface AutomaticQuoteLine {
  itemId: string;
  label: string;
  domainId: string;
  moduleId?: string;
  quantity: number;
  unitPriceXof: number;
  multiplier: number;
  amountXof: number;
  status: QuoteLineStatus;
  reason?: string;
  tariffRuleId?: string;
}

export interface AutomaticQuote {
  quoteId: string;
  journey: CustomerJourney;
  currency: "XOF";
  tariffVersion: string;
  status: "ready" | "provisional";
  customerCanAccept: boolean;
  totalXof: number;
  lines: AutomaticQuoteLine[];
  reviewReasons: QuoteReviewReason[];
  createdAt: string;
}

function review(
  item: QuoteScopeItem,
  code: QuoteReviewCode,
  message: string,
): QuoteReviewReason {
  return { itemId: item.id, code, message };
}

/**
 * Central PCTD calculation.
 *
 * The engine never invents prices: every billable item must reference exactly
 * one administratively configured tariff rule. Included items are not charged,
 * shared billing keys are charged at most once, and uncertain items keep the
 * quote provisional instead of being silently priced.
 */
export function buildAutomaticQuote(input: AutomaticQuoteInput): AutomaticQuote {
  const lines: AutomaticQuoteLine[] = [];
  const reviewReasons: QuoteReviewReason[] = [];
  const seenItemIds = new Set<string>();
  const seenBillingKeys = new Set<string>();
  let totalXof = 0;

  for (const item of input.items) {
    if (seenItemIds.has(item.id)) {
      reviewReasons.push(review(item, "duplicate_scope_item", "Cet élément apparaît plusieurs fois dans le dossier. Vérification nécessaire."));
      lines.push({
        itemId: item.id,
        label: item.label,
        domainId: item.domainId,
        moduleId: item.moduleId,
        quantity: 0,
        unitPriceXof: 0,
        multiplier: 1,
        amountXof: 0,
        status: "requires_review",
        reason: "Élément dupliqué dans le périmètre.",
      });
      continue;
    }
    seenItemIds.add(item.id);

    const billingKey = item.billingKey ?? item.id;
    if (seenBillingKeys.has(billingKey)) {
      lines.push({
        itemId: item.id,
        label: item.label,
        domainId: item.domainId,
        moduleId: item.moduleId,
        quantity: 0,
        unitPriceXof: 0,
        multiplier: 1,
        amountXof: 0,
        status: "included",
        reason: "Cette capacité est déjà prise en compte dans une autre ligne du devis.",
      });
      continue;
    }
    seenBillingKeys.add(billingKey);

    if (item.billingTreatment === "included") {
      lines.push({
        itemId: item.id,
        label: item.label,
        domainId: item.domainId,
        moduleId: item.moduleId,
        quantity: 1,
        unitPriceXof: 0,
        multiplier: 1,
        amountXof: 0,
        status: "included",
        reason: "Inclus dans le périmètre validé.",
      });
      continue;
    }

    if (item.billingTreatment === "manual_review") {
      reviewReasons.push(review(item, "manual_review_required", "Cet élément nécessite une vérification avant de fixer son prix."));
      lines.push({
        itemId: item.id,
        label: item.label,
        domainId: item.domainId,
        moduleId: item.moduleId,
        quantity: item.quantity ?? 1,
        unitPriceXof: 0,
        multiplier: 1,
        amountXof: 0,
        status: "requires_review",
        reason: "Évaluation complémentaire nécessaire.",
      });
      continue;
    }

    const matchingRules = input.tariffRules.filter((rule) => rule.id === item.tariffRuleId);
    if (matchingRules.length === 0) {
      reviewReasons.push(review(item, "missing_tariff", "Aucun tarif administré ne correspond à cette prestation."));
      lines.push({
        itemId: item.id, label: item.label, domainId: item.domainId, moduleId: item.moduleId,
        quantity: item.quantity ?? 1, unitPriceXof: 0, multiplier: 1, amountXof: 0,
        status: "requires_review", reason: "Tarif non configuré.", tariffRuleId: item.tariffRuleId,
      });
      continue;
    }
    if (matchingRules.length > 1) {
      reviewReasons.push(review(item, "ambiguous_tariff", "Plusieurs règles tarifaires portent le même identifiant."));
      lines.push({
        itemId: item.id, label: item.label, domainId: item.domainId, moduleId: item.moduleId,
        quantity: item.quantity ?? 1, unitPriceXof: 0, multiplier: 1, amountXof: 0,
        status: "requires_review", reason: "Règle tarifaire ambiguë.", tariffRuleId: item.tariffRuleId,
      });
      continue;
    }

    const rule = matchingRules[0];
    const domainMatches = !rule.domainIds || rule.domainIds.includes(item.domainId);
    const moduleMatches = !rule.moduleIds || (item.moduleId !== undefined && rule.moduleIds.includes(item.moduleId));
    if (!domainMatches || !moduleMatches) {
      reviewReasons.push(review(item, "tariff_scope_mismatch", "La règle tarifaire ne correspond pas au domaine ou au module sélectionné."));
      lines.push({
        itemId: item.id, label: item.label, domainId: item.domainId, moduleId: item.moduleId,
        quantity: item.quantity ?? 1, unitPriceXof: 0, multiplier: 1, amountXof: 0,
        status: "requires_review", reason: "Périmètre du tarif incompatible.", tariffRuleId: rule.id,
      });
      continue;
    }

    const quantity = item.quantity ?? 1;
    if (!Number.isSafeInteger(quantity) || quantity < 1) {
      reviewReasons.push(review(item, "invalid_quantity", "La quantité doit être un nombre entier positif."));
      lines.push({
        itemId: item.id, label: item.label, domainId: item.domainId, moduleId: item.moduleId,
        quantity: 0, unitPriceXof: 0, multiplier: 1, amountXof: 0,
        status: "requires_review", reason: "Quantité à vérifier.", tariffRuleId: rule.id,
      });
      continue;
    }

    if (!Number.isSafeInteger(rule.unitPriceXof) || rule.unitPriceXof < 0) {
      reviewReasons.push(review(item, "invalid_tariff", "Le prix de référence doit être un montant FCFA entier et positif ou nul."));
      lines.push({
        itemId: item.id, label: item.label, domainId: item.domainId, moduleId: item.moduleId,
        quantity, unitPriceXof: 0, multiplier: 1, amountXof: 0,
        status: "requires_review", reason: "Prix de référence invalide.", tariffRuleId: rule.id,
      });
      continue;
    }

    const complexity = item.complexity ?? "standard";
    const multiplier = rule.complexityMultipliers?.[complexity] ?? (complexity === "standard" ? 1 : undefined);
    if (multiplier === undefined || !Number.isFinite(multiplier) || multiplier <= 0) {
      reviewReasons.push(review(item, "missing_complexity_multiplier", "Le niveau de complexité n'a pas de coefficient tarifaire configuré."));
      lines.push({
        itemId: item.id, label: item.label, domainId: item.domainId, moduleId: item.moduleId,
        quantity, unitPriceXof: rule.unitPriceXof, multiplier: 1, amountXof: 0,
        status: "requires_review", reason: "Coefficient de complexité manquant.", tariffRuleId: rule.id,
      });
      continue;
    }

    const amountXof = Math.round(rule.unitPriceXof * quantity * multiplier);
    if (!Number.isSafeInteger(amountXof) || amountXof < 0 || !Number.isSafeInteger(totalXof + amountXof)) {
      reviewReasons.push(review(item, "amount_overflow", "Le montant calculé dépasse les limites de calcul autorisées."));
      lines.push({
        itemId: item.id, label: item.label, domainId: item.domainId, moduleId: item.moduleId,
        quantity, unitPriceXof: rule.unitPriceXof, multiplier, amountXof: 0,
        status: "requires_review", reason: "Montant à vérifier.", tariffRuleId: rule.id,
      });
      continue;
    }

    totalXof += amountXof;
    lines.push({
      itemId: item.id,
      label: item.label,
      domainId: item.domainId,
      moduleId: item.moduleId,
      quantity,
      unitPriceXof: rule.unitPriceXof,
      multiplier,
      amountXof,
      status: "priced",
      tariffRuleId: rule.id,
    });
  }

  const ready = reviewReasons.length === 0;
  return {
    quoteId: input.quoteId,
    journey: input.journey,
    currency: "XOF",
    tariffVersion: input.tariffVersion,
    status: ready ? "ready" : "provisional",
    customerCanAccept: ready,
    totalXof,
    lines,
    reviewReasons,
    createdAt: input.createdAt ?? new Date().toISOString(),
  };
}
