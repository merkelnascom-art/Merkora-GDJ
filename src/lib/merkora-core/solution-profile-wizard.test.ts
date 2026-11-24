import { describe, expect, it } from "vitest";
import {
  canAdvanceSolutionProfileStep,
  SOLUTION_PROFILE_QUESTIONS,
} from "./solution-profile-wizard";

describe("screen 06 sequential product profile", () => {
  it("asks five focused questions in the intended order", () => {
    expect(SOLUTION_PROFILE_QUESTIONS.map((question) => question.title)).toEqual([
      "Comment s'appelle ton projet ?",
      "Quel type de produit veux-tu créer ?",
      "Dans quel(s) domaine(s) sera-t-il utilisé ?",
      "Comment souhaites-tu naviguer dans le produit ?",
      "Quelle identité visuelle souhaites-tu ?",
    ]);
  });

  it("requires only the project name and product type before continuing", () => {
    expect(canAdvanceSolutionProfileStep(0, { projectName: "   ", productTypeId: "" })).toBe(false);
    expect(canAdvanceSolutionProfileStep(0, { projectName: "Aéro Service", productTypeId: "" })).toBe(true);
    expect(canAdvanceSolutionProfileStep(1, { projectName: "Aéro Service", productTypeId: "" })).toBe(false);
    expect(canAdvanceSolutionProfileStep(1, { projectName: "Aéro Service", productTypeId: "web_platform" })).toBe(true);
  });

  it("allows the domain, navigation and visual identity questions to be skipped", () => {
    const answers = { projectName: "Aéro Service", productTypeId: "web_platform" as const };
    expect(canAdvanceSolutionProfileStep(2, answers)).toBe(true);
    expect(canAdvanceSolutionProfileStep(3, answers)).toBe(true);
    expect(canAdvanceSolutionProfileStep(4, answers)).toBe(true);
  });
});
