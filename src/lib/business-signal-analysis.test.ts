import { describe, expect, it } from "vitest";
import { analyzeBusinessSignals } from "./business-signal-analysis";

describe("analyzeBusinessSignals", () => {
  it("detects a mixed sales, cashflow, expense and profitability problem", () => {
    const result = analyzeBusinessSignals("Je vends beaucoup, mais je ne sais pas où passe l'argent. Je veux suivre les recettes, les dépenses et les bénéfices.");
    const ids = result.signals.map((signal) => signal.id);
    expect(ids).toContain("sales");
    expect(ids).toContain("cashflow");
    expect(ids).toContain("revenue");
    expect(ids).toContain("expenses");
    expect(ids).toContain("profitability");
    expect(result.candidateFamilyIds).toContain("family-05");
    expect(result.candidateFamilyIds).toContain("family-04");
    expect(result.transversalCapabilities).toContain("rapprochement des encaissements");
    expect(result.caution).toMatch(/pas des faits comptables vérifiés/);
  });

  it("detects payroll, supplier debt and payment methods without asserting amounts", () => {
    const result = analyzeBusinessSignals("Je dois payer les salaires, les fournisseurs et suivre les dettes par Mobile Money.");
    const ids = result.signals.map((signal) => signal.id);
    expect(ids).toContain("payroll");
    expect(ids).toContain("payables");
    expect(ids).toContain("debt");
    expect(ids).toContain("payments");
  });

  it("keeps the financial analysis empty when no financial cue is present", () => {
    expect(analyzeBusinessSignals("Je veux organiser les horaires des cours et les présences des apprenants.").signals).toEqual([]);
  });

  it("does not treat an unexplained money gap as proof of theft", () => {
    const result = analyzeBusinessSignals("Je ne sais pas où est passé l'argent.");
    expect(result.signals[0].confidence).toBe("suggested");
    expect(result.caution).toMatch(/pas des faits comptables vérifiés/);
    expect(result.signals[0].followUp).toMatch(/écart apparaît-il/);
  });
});
