import { describe, expect, it } from "vitest";
import {
  calculateEvidenceCoverage,
  cosineSimilarity,
  normalizeScores,
  shannonEntropy,
  softmax,
} from "./scientific-engine";
import { analyzeUniversalProjectIntent } from "../universal-project-understanding";

describe("MerKora scientific computation core", () => {
  it("computes cosine similarity and safely handles zero vectors", () => {
    expect(cosineSimilarity([1, 0], [1, 0])).toBeCloseTo(1);
    expect(cosineSimilarity([1, 0], [0, 1])).toBeCloseTo(0);
    expect(cosineSimilarity([0, 0], [1, 2])).toBe(0);
  });

  it("rejects incompatible vector dimensions and non-finite values", () => {
    expect(() => cosineSimilarity([1], [1, 2])).toThrow(RangeError);
    expect(() => cosineSimilarity([Number.NaN], [1])).toThrow(RangeError);
  });

  it("computes stable softmax values for large logits", () => {
    const result = softmax([10000, 10001, 10002]);
    expect(result.reduce((sum, value) => sum + value, 0)).toBeCloseTo(1);
    expect(result[2]).toBeGreaterThan(result[1]);
    expect(result.every(Number.isFinite)).toBe(true);
  });

  it("computes Shannon entropy and rejects invalid distributions", () => {
    expect(shannonEntropy([0.5, 0.5])).toBeCloseTo(Math.log(2));
    expect(shannonEntropy([1, 0])).toBeCloseTo(0);
    expect(() => shannonEntropy([0.4, 0.4])).toThrow(RangeError);
    expect(() => shannonEntropy([-0.1, 1.1])).toThrow(RangeError);
  });

  it("normalizes scores without dividing by zero for constant vectors", () => {
    expect(normalizeScores([10, 20, 30])).toEqual([0, 0.5, 1]);
    expect(normalizeScores([4, 4])).toEqual([0.5, 0.5]);
    expect(normalizeScores([])).toEqual([]);
  });

  it("reports evidence coverage separately from truth confidence", () => {
    const result = calculateEvidenceCoverage(2, 6);
    expect(result.coverageRatio).toBe(0.25);
    expect(result.uncertaintyRatio).toBe(0.75);
    expect(result.band).toBe("low");
    expect(() => calculateEvidenceCoverage(-1, 2)).toThrow(RangeError);
  });

  it("executes evidence coverage in the universal understanding analysis", () => {
    const result = analyzeUniversalProjectIntent(
      "Aujourd'hui je note les contributions dans un cahier. Je veux suivre les paiements et recevoir un résumé chaque dimanche.",
    );
    expect(result.analysisMetrics.evidenceSignals).toBeGreaterThan(0);
    expect(result.analysisMetrics.coverageRatio).toBeGreaterThan(0);
    expect(result.analysisMetrics.uncertaintyRatio).toBeGreaterThanOrEqual(0);
    expect(result.analysisMetrics.coverageRatio + result.analysisMetrics.uncertaintyRatio).toBeCloseTo(1);
  });
});
