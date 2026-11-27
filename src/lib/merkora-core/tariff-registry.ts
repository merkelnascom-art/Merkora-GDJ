import type { QuoteComplexity, QuoteTariffRule } from "./quote-engine";

export type TariffBillingMode = "fixed" | "variable" | "included" | "manual_review";
export type TariffRuleStatus = "draft" | "active" | "archived";

export interface ManagedTariffRule extends QuoteTariffRule {
  name: string;
  description?: string;
  capabilityId: string;
  billingMode: TariffBillingMode;
  unitLabel: string;
  status: TariffRuleStatus;
  validFrom?: string;
  validUntil?: string;
  version: number;
  updatedAt: string;
}

export interface TariffRuleCandidate {
  domainId: string;
  moduleId?: string;
  capabilityId: string;
  tariffRuleId?: string;
}

export type TariffResolution =
  | { status: "resolved"; rule: ManagedTariffRule }
  | { status: "missing"; reason: string }
  | { status: "ambiguous"; ruleIds: string[]; reason: string };

export interface TariffValidationIssue {
  field: string;
  message: string;
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function isValidIsoDate(value: string): boolean {
  if (!ISO_DATE.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
const COMPLEXITIES: QuoteComplexity[] = ["simple", "standard", "complex", "very_complex"];

/** Validates an administrator-authored tariff without changing or persisting it. */
export function validateTariffRule(rule: ManagedTariffRule): TariffValidationIssue[] {
  const issues: TariffValidationIssue[] = [];
  if (!rule.id.trim()) issues.push({ field: "id", message: "L'identifiant du tarif est obligatoire." });
  if (!rule.name.trim()) issues.push({ field: "name", message: "Le nom du tarif est obligatoire." });
  if (!rule.capabilityId.trim()) issues.push({ field: "capabilityId", message: "La capacité concernée est obligatoire." });
  if (!Number.isSafeInteger(rule.version) || rule.version < 1) {
    issues.push({ field: "version", message: "La version doit être un entier positif." });
  }
  if (!Number.isSafeInteger(rule.unitPriceXof) || rule.unitPriceXof < 0) {
    issues.push({ field: "unitPriceXof", message: "Le prix doit être un montant FCFA entier positif ou nul." });
  }
  if (!rule.unitLabel.trim()) issues.push({ field: "unitLabel", message: "L'unité de facturation est obligatoire." });
  if (!isValidIsoDate(rule.updatedAt.slice(0, 10))) {
    issues.push({ field: "updatedAt", message: "La date de mise à jour doit être une date valide." });
  }
  if (rule.validFrom && !isValidIsoDate(rule.validFrom)) {
    issues.push({ field: "validFrom", message: "La date de début doit être au format AAAA-MM-JJ." });
  }
  if (rule.validUntil && !isValidIsoDate(rule.validUntil)) {
    issues.push({ field: "validUntil", message: "La date de fin doit être au format AAAA-MM-JJ." });
  }
  if (rule.validFrom && rule.validUntil && rule.validFrom > rule.validUntil) {
    issues.push({ field: "validUntil", message: "La date de fin ne peut pas précéder la date de début." });
  }
  for (const complexity of COMPLEXITIES) {
    const multiplier = rule.complexityMultipliers?.[complexity];
    if (multiplier !== undefined && (!Number.isFinite(multiplier) || multiplier <= 0)) {
      issues.push({ field: `complexityMultipliers.${complexity}`, message: "Le coefficient doit être un nombre strictement positif." });
    }
  }
  if (rule.billingMode === "included" && rule.unitPriceXof !== 0) {
    issues.push({ field: "unitPriceXof", message: "Une prestation incluse doit avoir un prix nul." });
  }
  return issues;
}

/** Detects duplicate IDs and invalid rules before a catalogue can be activated. */
export function validateTariffCatalog(rules: readonly ManagedTariffRule[]): TariffValidationIssue[] {
  const issues = rules.flatMap((rule) => validateTariffRule(rule).map((issue) => ({
    field: `${rule.id || "sans-identifiant"}.${issue.field}`,
    message: issue.message,
  })));
  const ids = new Set<string>();
  for (const rule of rules) {
    if (ids.has(rule.id)) issues.push({ field: rule.id, message: "Cet identifiant de tarif est utilisé plusieurs fois." });
    ids.add(rule.id);
  }
  return issues;
}

/**
 * Resolves exactly one active rule for a capability and date.
 * The resolver never picks the cheapest, newest, or first rule when several match.
 */
export function resolveTariffRule(
  candidate: TariffRuleCandidate,
  rules: readonly ManagedTariffRule[],
  onDate: string,
): TariffResolution {
  const matching = rules.filter((rule) => {
    if (rule.status !== "active") return false;
    if (validateTariffRule(rule).length > 0) return false;
    if (rule.capabilityId !== candidate.capabilityId) return false;
    if (rule.domainIds && !rule.domainIds.includes(candidate.domainId)) return false;
    if (rule.moduleIds && (!candidate.moduleId || !rule.moduleIds.includes(candidate.moduleId))) return false;
    if (rule.validFrom && onDate < rule.validFrom) return false;
    if (rule.validUntil && onDate > rule.validUntil) return false;
    if (candidate.tariffRuleId && rule.id !== candidate.tariffRuleId) return false;
    return true;
  });

  if (matching.length === 0) {
    return { status: "missing", reason: "Aucun tarif actif et valide ne correspond à cette prestation." };
  }
  if (matching.length > 1) {
    return {
      status: "ambiguous",
      ruleIds: matching.map((rule) => rule.id).sort(),
      reason: "Plusieurs tarifs actifs correspondent à cette prestation. Une décision administrative est nécessaire.",
    };
  }
  return { status: "resolved", rule: matching[0] };
}
