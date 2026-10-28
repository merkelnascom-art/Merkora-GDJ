import { describe, expect, it } from "vitest";
import { analyzeNeed } from "./discovery";
import type { NeedInput } from "./solution-recommendations";

const makeNeed = (overrides: Partial<NeedInput> = {}): NeedInput => ({
  title: "Student Vision",
  category: "other",
  problem: "Les élèves après le bac ne savent pas quels métiers choisir selon leurs relevés et leurs résultats.",
  desiredOutcome: "Proposer des métiers adaptés après des tests d'orientation.",
  budget: "À définir",
  urgency: "normal",
  ...overrides,
});

describe("analyzeNeed", () => {
  it("returns education-specific directions for career orientation", () => {
    const result = analyzeNeed(makeNeed());
    expect(result.domain).toBe("education");
    expect(result.state).toBe("preliminary");
    expect(result.recommendations.some((item) => item.title.includes("orientation scolaire"))).toBe(true);
    expect(result.isPreliminary).toBe(true);
  });

  it("asks for clarification when the domain is ambiguous", () => {
    const result = analyzeNeed(makeNeed({
      title: "Mon projet",
      category: "other",
      problem: "Je veux améliorer quelque chose mais je ne sais pas encore quoi.",
      desiredOutcome: "Trouver une meilleure direction.",
    }));
    expect(result.state).toBe("needs_clarification");
    expect(result.questions.length).toBeGreaterThan(0);
    expect(result.isPreliminary).toBe(true);
  });

  it("does not mark an incomplete need as ready for analysis", () => {
    const result = analyzeNeed(makeNeed({ title: "  ", problem: "  ", desiredOutcome: "" }));
    expect(result.state).toBe("incomplete");
    expect(result.questions.length).toBeGreaterThan(0);
  });
});
