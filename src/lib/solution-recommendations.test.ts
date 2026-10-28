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
    expect(recommendations.some((item) => item.title === "Organiser les opérations commerciales")).toBe(true);
  });

  it("does not recommend shop or team management for career orientation", () => {
    const recommendations = buildRecommendations({
      ...validNeed,
      title: "Student Vision",
      category: "other",
      problem: "Les élèves après le bac ne savent pas quels métiers choisir selon leurs relevés et leurs résultats.",
      desiredOutcome: "Proposer des métiers adaptés après des tests d'orientation.",
    });
    const titles = recommendations.map((item) => item.title);
    expect(titles).toContain("Explorer l’orientation scolaire et professionnelle");
    expect(titles).not.toContain("Structurer le fonctionnement");
  });

  it("suggests commerce and staff operations for a shop-management need", () => {
    const recommendations = buildRecommendations({
      ...validNeed,
      title: "Suivi de ma boutique",
      category: "business",
      problem: "Je ne maîtrise pas les ventes, les stocks et les retards de mon personnel.",
      desiredOutcome: "Suivre la caisse, les stocks, les ventes et les présences.",
    });
    const titles = recommendations.map((item) => item.title);
    expect(titles).toContain("Organiser les opérations commerciales");
    expect(titles).not.toContain("Explorer l’orientation scolaire et professionnelle");
  });

  it("keeps vague descriptions exploratory instead of asserting a domain", () => {
    const recommendations = buildRecommendations({
      ...validNeed,
      title: "Mon projet",
      category: "other",
      problem: "Je veux améliorer quelque chose mais je ne sais pas encore quoi.",
      desiredOutcome: "Trouver une meilleure direction.",
    });
    expect(recommendations.some((item) => /préciser|clarifier/i.test(item.title))).toBe(true);
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
