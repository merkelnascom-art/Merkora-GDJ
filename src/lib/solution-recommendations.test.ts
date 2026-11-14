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
  it("suggests operational steps for a team-management need", () => {
    const recommendations = buildRecommendations(validNeed);
    expect(recommendations.some((item) => item.title === "Mettre au clair le fonctionnement")).toBe(true);
  });

  it("offers measurable tracking when the user describes a monitoring need", () => {
    const recommendations = buildRecommendations({
      ...validNeed,
      problem: "Je ne peux pas suivre les ventes et voir les écarts de caisse chaque jour.",
      desiredOutcome: "Avoir un historique et un tableau de bord des recettes.",
    });
    expect(recommendations.some((item) => item.title === "Créer un suivi mesurable")).toBe(true);
  });

  it("compares digital approaches without assuming a custom app is always necessary", () => {
    const recommendations = buildRecommendations({
      ...validNeed,
      category: "digital",
      title: "Créer une plateforme",
      problem: "Je veux une application en ligne pour suivre les demandes de mes clients.",
      desiredOutcome: "Les clients peuvent déposer une demande et consulter son état.",
    });
    const digital = recommendations.find((item) => item.title === "Comparer les options numériques");
    expect(digital).toBeDefined();
    expect(digital?.tradeoff).toContain("outil existant");
    expect(digital?.nextStep).toBeTruthy();
  });

  it("adds an immediate reversible action for urgent needs", () => {
    const recommendations = buildRecommendations({ ...validNeed, urgency: "urgent" });
    expect(recommendations.some((item) => item.title === "Prévoir une mesure immédiate")).toBe(true);
  });

  it("always returns a first clarification step and no more than four items", () => {
    const recommendations = buildRecommendations({
      ...validNeed,
      category: "other",
      problem: "Je veux un objectif général sans domaine précis.",
    });
    expect(recommendations[0].title).toBe("Préciser le problème à résoudre");
    expect(recommendations.length).toBeLessThanOrEqual(4);
  });

  it("provides tradeoffs and next steps when an option includes them", () => {
    const recommendations = buildRecommendations(validNeed);
    const actionable = recommendations.find((item) => item.tradeoff || item.nextStep);
    expect(actionable).toBeDefined();
    expect(actionable?.nextStep).toBeTruthy();
  });
});

describe("getCategoryLabel", () => {
  it("returns a French category label", () => {
    expect(getCategoryLabel("digital")).toBe("Solution numérique");
  });
});
