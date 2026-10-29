import { describe, expect, it } from "vitest";
import { parseCompetitiveAnalysis, parseCompetitorInputs } from "./competitive-analysis";

describe("parseCompetitorInputs", () => {
  it("bounds the list and field sizes and removes duplicate identities", () => {
    const result = parseCompetitorInputs([
      { name: "Shop A", url: "https://example.test", offer: "x".repeat(800), price: "10", notes: "" },
      { name: "Shop B", url: "https://example.test", offer: "duplicate", price: "", notes: "" },
      ...Array.from({ length: 6 }, (_, i) => ({ name: `Shop ${i}`, url: "", offer: "", price: "", notes: "" })),
    ]);
    expect(result).toHaveLength(5);
    expect(result[0].offer).toHaveLength(500);
    expect(result.some((item) => item.name === "Shop B")).toBe(false);
  });

  it("ignores malformed and empty entries", () => {
    expect(parseCompetitorInputs([null, 5, {}, { name: "Known competitor" }])).toEqual([
      { name: "Known competitor", url: "", offer: "", price: "", notes: "" },
    ]);
  });
});

describe("parseCompetitiveAnalysis", () => {
  it("does not claim live research or invent competitors when no source is supplied", () => {
    const result = parseCompetitiveAnalysis({ summary: "", opportunities: ["Investigate a niche"] }, false);
    expect(result.researchStatus).toBe("not_verified");
    expect(result.summary).toMatch(/n’a pas été vérifiée/i);
    expect(result.opportunities).toEqual(["Investigate a niche"]);
  });

  it("marks comparison as based on user-supplied information and bounds output", () => {
    const result = parseCompetitiveAnalysis({
      summary: "Comparaison partielle",
      comparisonCriteria: Array.from({ length: 12 }, (_, i) => `Critère ${i}`),
      unknowns: ["x".repeat(500)],
    }, true);
    expect(result.researchStatus).toBe("user_supplied");
    expect(result.comparisonCriteria).toHaveLength(8);
    expect(result.unknowns[0]).toHaveLength(220);
  });
});
