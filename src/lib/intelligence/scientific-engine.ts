/**
 * Deterministic scientific primitives used by MerKora's analysis runtime.
 *
 * These are transparent mathematical operations, not a substitute for an
 * embedding provider, a trained model, or calibrated statistical confidence.
 */
export type EvidenceCoverage = {
  evidenceSignals: number;
  unresolvedSignals: number;
  coverageRatio: number;
  uncertaintyRatio: number;
  band: "low" | "moderate" | "high";
};

function assertFiniteVector(vector: number[], name: string): void {
  if (!vector.every(Number.isFinite)) throw new RangeError(`${name} must contain only finite numbers.`);
}

export function cosineSimilarity(left: number[], right: number[]): number {
  if (left.length !== right.length) throw new RangeError("Vectors must have the same dimensions.");
  assertFiniteVector(left, "left");
  assertFiniteVector(right, "right");
  if (left.length === 0) return 0;
  let dot = 0;
  let leftSquared = 0;
  let rightSquared = 0;
  for (let index = 0; index < left.length; index += 1) {
    const a = left[index];
    const b = right[index];
    dot += a * b;
    leftSquared += a * a;
    rightSquared += b * b;
  }
  const denominator = Math.sqrt(leftSquared) * Math.sqrt(rightSquared);
  return denominator === 0 ? 0 : Math.max(-1, Math.min(1, dot / denominator));
}

/** Numerically stable softmax: subtracting max(logits) avoids exponential overflow. */
export function softmax(logits: number[]): number[] {
  if (logits.length === 0) return [];
  assertFiniteVector(logits, "logits");
  const maximum = Math.max(...logits);
  const exponentials = logits.map((value) => Math.exp(value - maximum));
  const total = exponentials.reduce((sum, value) => sum + value, 0);
  return exponentials.map((value) => value / total);
}

/** Shannon entropy in nats for a valid probability distribution. */
export function shannonEntropy(probabilities: number[]): number {
  if (probabilities.length === 0) return 0;
  if (!probabilities.every((value) => Number.isFinite(value) && value >= 0)) {
    throw new RangeError("Probabilities must be finite and non-negative.");
  }
  const total = probabilities.reduce((sum, value) => sum + value, 0);
  if (Math.abs(total - 1) > 1e-9) throw new RangeError("Probabilities must sum to 1.");
  return -probabilities.reduce(
    (entropy, probability) => entropy + (probability === 0 ? 0 : probability * Math.log(probability)),
    0,
  );
}

/** Min-max normalization; a constant vector maps to 0.5 (neutral). */
export function normalizeScores(scores: number[]): number[] {
  if (scores.length === 0) return [];
  assertFiniteVector(scores, "scores");
  const minimum = Math.min(...scores);
  const maximum = Math.max(...scores);
  if (minimum === maximum) return scores.map(() => 0.5);
  const range = maximum - minimum;
  return scores.map((score) => (score - minimum) / range);
}

/**
 * Measures how much of the discovery checklist currently has evidence.
 * This is a coverage indicator, never a probability that an interpretation is true.
 */
export function calculateEvidenceCoverage(evidenceSignals: number, unresolvedSignals: number): EvidenceCoverage {
  if (!Number.isInteger(evidenceSignals) || evidenceSignals < 0 ||
      !Number.isInteger(unresolvedSignals) || unresolvedSignals < 0) {
    throw new RangeError("Signal counts must be non-negative integers.");
  }
  const total = evidenceSignals + unresolvedSignals;
  const coverageRatio = total === 0 ? 0 : evidenceSignals / total;
  const uncertaintyRatio = total === 0 ? 1 : unresolvedSignals / total;
  return {
    evidenceSignals,
    unresolvedSignals,
    coverageRatio,
    uncertaintyRatio,
    band: coverageRatio >= 0.7 ? "high" : coverageRatio >= 0.35 ? "moderate" : "low",
  };
}
