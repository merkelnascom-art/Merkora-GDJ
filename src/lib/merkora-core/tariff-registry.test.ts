import { describe, expect, it } from "vitest";
import { buildAutomaticQuote } from "./quote-engine";
import {
  resolveTariffRule,
  toQuoteBillingTreatment,
  toQuoteTariffRule,
  validateTariffCatalog,
  validateTariffRule,
  type ManagedTariffRule,
} from "./tariff-registry";

const rule = (overrides: Partial<ManagedTariffRule> = {}): ManagedTariffRule => ({
  id: "site-vitrine",
  name: "Conception site vitrine",
  capabilityId: "website-showcase",
  billingMode: "fixed",
  unitLabel: "projet",
  unitPriceXof: 75000,
  domainIds: ["commerce"],
  moduleIds: ["public-site"],
  status: "active",
  version: 1,
  updatedAt: "2026-11-27T10:00:00.000Z",
  complexityMultipliers: { simple: 0.8, standard: 1, complex: 1.5, very_complex: 2 },
  ...overrides,
});

describe("tariff registry", () => {
  it("adapts managed tariffs to the existing quote engine", () => {
    const configured = rule();
    expect(toQuoteTariffRule(configured)).toEqual({
      id: "site-vitrine",
      domainIds: ["commerce"],
      moduleIds: ["public-site"],
      unitPriceXof: 75000,
      complexityMultipliers: configured.complexityMultipliers,
    });
    expect(toQuoteBillingTreatment(configured)).toBe("billable");
    expect(toQuoteBillingTreatment(rule({ billingMode: "included", unitPriceXof: 0 }))).toBe("included");
    expect(toQuoteBillingTreatment(rule({ billingMode: "manual_review" }))).toBe("manual_review");
  });

  it("feeds a resolved tariff into the quote engine without inventing a price", () => {
    const configured = rule();
    const quote = buildAutomaticQuote({
      quoteId: "quote-test",
      journey: "drt",
      tariffVersion: "tariffs-v1",
      items: [{
        id: "scope-site",
        label: "Site vitrine",
        domainId: "commerce",
        moduleId: "public-site",
        billingTreatment: toQuoteBillingTreatment(configured),
        tariffRuleId: configured.id,
        quantity: 1,
        complexity: "standard",
      }],
      tariffRules: [toQuoteTariffRule(configured)],
    });
    expect(quote.status).toBe("ready");
    expect(quote.totalXof).toBe(75000);
    expect(quote.customerCanAccept).toBe(true);
  });

  it("accepts a valid administrator tariff", () => {
    expect(validateTariffRule(rule())).toEqual([]);
  });

  it("rejects negative or fractional prices", () => {
    expect(validateTariffRule(rule({ unitPriceXof: -1 })).some((issue) => issue.field === "unitPriceXof")).toBe(true);
    expect(validateTariffRule(rule({ unitPriceXof: 1000.5 })).some((issue) => issue.field === "unitPriceXof")).toBe(true);
  });

  it("requires an included tariff to have a zero price", () => {
    expect(validateTariffRule(rule({ billingMode: "included" })).some((issue) => issue.field === "unitPriceXof")).toBe(true);
  });

  it("detects duplicate tariff identifiers in a catalogue", () => {
    const issues = validateTariffCatalog([rule(), rule({ name: "Autre règle" })]);
    expect(issues.some((issue) => issue.message.includes("utilisé plusieurs fois"))).toBe(true);
  });

  it("resolves one active tariff matching domain, module and capability", () => {
    const result = resolveTariffRule(
      { domainId: "commerce", moduleId: "public-site", capabilityId: "website-showcase" },
      [rule()],
      "2026-11-27",
    );
    expect(result.status).toBe("resolved");
    if (result.status === "resolved") expect(result.rule.unitPriceXof).toBe(75000);
  });

  it("rejects impossible calendar dates in tariff configuration", () => {
    expect(validateTariffRule(rule({ validFrom: "2026-02-30" })).some((issue) => issue.field === "validFrom")).toBe(true);
  });

  it("rejects an invalid date used for resolution", () => {
    const result = resolveTariffRule(
      { domainId: "commerce", moduleId: "public-site", capabilityId: "website-showcase" },
      [rule()],
      "2026-02-30",
    );
    expect(result.status).toBe("invalid_date");
  });

  it("does not resolve a tariff outside its validity period", () => {
    const result = resolveTariffRule(
      { domainId: "commerce", moduleId: "public-site", capabilityId: "website-showcase" },
      [rule({ validUntil: "2026-11-26" })],
      "2026-11-27",
    );
    expect(result.status).toBe("missing");
  });

  it("does not silently choose between two matching tariffs", () => {
    const result = resolveTariffRule(
      { domainId: "commerce", moduleId: "public-site", capabilityId: "website-showcase" },
      [rule(), rule({ id: "site-vitrine-alt", unitPriceXof: 60000 })],
      "2026-11-27",
    );
    expect(result.status).toBe("ambiguous");
    if (result.status === "ambiguous") expect(result.ruleIds).toEqual(["site-vitrine", "site-vitrine-alt"]);
  });

  it("supports an explicit tariff identifier to disambiguate an approved choice", () => {
    const result = resolveTariffRule(
      { domainId: "commerce", moduleId: "public-site", capabilityId: "website-showcase", tariffRuleId: "site-vitrine-alt" },
      [rule(), rule({ id: "site-vitrine-alt", unitPriceXof: 60000 })],
      "2026-11-27",
    );
    expect(result.status).toBe("resolved");
    if (result.status === "resolved") expect(result.rule.unitPriceXof).toBe(60000);
  });

  it("ignores draft and archived tariffs", () => {
    const result = resolveTariffRule(
      { domainId: "commerce", moduleId: "public-site", capabilityId: "website-showcase" },
      [rule({ status: "draft" }), rule({ id: "archived", status: "archived" })],
      "2026-11-27",
    );
    expect(result.status).toBe("missing");
  });
});
