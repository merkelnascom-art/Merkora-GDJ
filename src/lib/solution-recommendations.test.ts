import { describe, expect, it } from "vitest";
import { buildRecommendations, getCategoryLabel, validateNeed, type NeedInput } from "./solution-recommendations";

const validNeed: NeedInput = {
  title: "Mieux gérer mon équipe",
  category: "organization",
  problem: "Je ne sais pas facilement qui est présent et quelles tâches sont terminées.",
  desiredOutcome: "Suivre les présences et les tâches de chaque personne.",
  budget: "À définir",
  urgency: "normal",
};

describe("validateNeed", () => {
  it("reports missing or too-short essential information", () => {
    expect(validateNeed({ ...validNeed, title: "Ok", problem: "Non", desiredOutcome: "" })).toHaveLength(3);
  });

  it("accepts a sufficiently described need", () => {
    expect(validateNeed(validNeed)).toEqual([]);
  });
});

describe("buildRecommendations", () => {
  it("suggests organization steps for a team-management need", () => {
    const recommendations = buildRecommendations(validNeed);
    expect(recommendations.some((item) => item.title === "Structurer le fonctionnement")).toBe(true);
  });

  it("always starts by clarifying the need and never returns more than four items", () => {
    const recommendations = buildRecommendations({ ...validNeed, category: "other", problem: "Je veux un objectif général sans domaine précis." });
    expect(recommendations[0].title).toBe("Clarifier le besoin");
    expect(recommendations.length).toBeLessThanOrEqual(4);
  });
});

describe("getCategoryLabel", () => {
  it("returns a French category label", () => {
    expect(getCategoryLabel("digital")).toBe("Solution numérique");
  });
});