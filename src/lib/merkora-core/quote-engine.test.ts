import { describe, expect, it } from "vitest";
import { buildAutomaticQuote, type QuoteScopeItem, type QuoteTariffRule } from "./quote-engine";

const rule: QuoteTariffRule = {
  id: "module-learners",
  domainIds: ["education"],
  moduleIds: ["learner_management"],
  unitPriceXof: 10000,
  complexityMultipliers: { simple: 0.8, standard: 1, complex: 1.5, very_complex: 2 },
};

function item(overrides: Partial<QuoteScopeItem> = {}): QuoteScopeItem {
  return {
    id: "learners",
    billingKey: "education:learner-management",
    label: "Gestion des apprenants",
    domainId: "education",
    moduleId: "learner_management",
    billingTreatment: "billable",
    tariffRuleId: "module-learners",
    quantity: 2,
    complexity: "standard",
    ...overrides,
  };
}

describe("PCTD automatic quote engine", () => {
  it("calculates a project-specific amount from the configured tariff rule", () => {
    const quote = buildAutomaticQuote({
      quoteId: "quote-1",
      journey: "drt",
      tariffVersion: "2026-11",
      items: [item()],
      tariffRules: [rule],
      createdAt: "2026-11-27T10:00:00.000Z",
    });

    expect(quote.status).toBe("ready");
    expect(quote.customerCanAccept).toBe(true);
    expect(quote.totalXof).toBe(20000);
    expect(quote.lines[0]).toMatchObject({ amountXof: 20000, status: "priced" });
  });

  it("does not charge a feature already included in the selected offer", () => {
    const quote = buildAutomaticQuote({
      quoteId: "quote-2",
      journey: "catalogue",
      tariffVersion: "2026-11",
      items: [item({ billingTreatment: "included" })],
      tariffRules: [],
    });

    expect(quote.totalXof).toBe(0);
    expect(quote.lines[0]).toMatchObject({ amountXof: 0, status: "included" });
    expect(quote.status).toBe("ready");
  });

  it("uses the configured complexity multiplier for the actual scope", () => {
    const quote = buildAutomaticQuote({
      quoteId: "quote-3",
      journey: "idp",
      tariffVersion: "2026-11",
      items: [item({ quantity: 1, complexity: "complex" })],
      tariffRules: [rule],
    });

    expect(quote.totalXof).toBe(15000);
    expect(quote.lines[0].multiplier).toBe(1.5);
  });

  it("does not invent a price when a billable feature has no configured tariff", () => {
    const quote = buildAutomaticQuote({
      quoteId: "quote-4",
      journey: "drt",
      tariffVersion: "2026-11",
      items: [item({ tariffRuleId: "missing-rule" })],
      tariffRules: [],
    });

    expect(quote.status).toBe("provisional");
    expect(quote.customerCanAccept).toBe(false);
    expect(quote.totalXof).toBe(0);
    expect(quote.reviewReasons).toEqual([
      expect.objectContaining({ itemId: "learners", code: "missing_tariff" }),
    ]);
  });

  it("does not apply a tariff configured for a different domain or module", () => {
    const quote = buildAutomaticQuote({
      quoteId: "quote-5",
      journey: "drt",
      tariffVersion: "2026-11",
      items: [item({ domainId: "health" })],
      tariffRules: [rule],
    });

    expect(quote.status).toBe("provisional");
    expect(quote.customerCanAccept).toBe(false);
    expect(quote.reviewReasons[0].code).toBe("tariff_scope_mismatch");
  });

  it("does not double-charge a shared function represented by multiple modules", () => {
    const quote = buildAutomaticQuote({
      quoteId: "quote-6",
      journey: "drt",
      tariffVersion: "2026-11",
      items: [
        item(),
        item({ id: "learners-copy", moduleId: "student_portal", label: "Accès aux apprenants" }),
      ],
      tariffRules: [rule],
    });

    expect(quote.totalXof).toBe(20000);
    expect(quote.lines[1]).toMatchObject({ amountXof: 0, status: "included" });
  });

  it("requires review when the selected complexity has no configured multiplier", () => {
    const quote = buildAutomaticQuote({
      quoteId: "quote-7",
      journey: "drt",
      tariffVersion: "2026-11",
      items: [item({ complexity: "very_complex" })],
      tariffRules: [{ ...rule, complexityMultipliers: { standard: 1 } }],
    });

    expect(quote.status).toBe("provisional");
    expect(quote.reviewReasons[0].code).toBe("missing_complexity_multiplier");
  });
});
