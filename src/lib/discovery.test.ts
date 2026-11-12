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
    expect(result.professionCandidates.length).toBeGreaterThan(0);
    expect(result.professionCandidates.every((candidate) => candidate.reviewStatus === "candidate")).toBe(true);
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

  it("detects financial needs inside a broader business story and asks targeted questions", () => {
    const result = analyzeNeed(makeNeed({
      title: "Pilotage de mon entreprise",
      category: "business",
      problem: "Je vends beaucoup, mais je ne sais pas où passe l'argent. J'ai des dépenses, des dettes et des clients qui me doivent encore de l'argent.",
      desiredOutcome: "Suivre les recettes, les paiements, les bénéfices et obtenir un rapport chaque semaine.",
    }));
    const signalIds = result.businessSignals.signals.map((signal) => signal.id);
    expect(signalIds).toContain("sales");
    expect(signalIds).toContain("cashflow");
    expect(signalIds).toContain("expenses");
    expect(signalIds).toContain("debt");
    expect(signalIds).toContain("receivables");
    expect(signalIds).toContain("revenue");
    expect(signalIds).toContain("profitability");
    expect(result.universalFamilyCandidates).toContain("family-05");
    expect(result.questions.some((question) => question.includes("sources de recettes"))).toBe(true);
    expect(result.recommendations.some((item) => item.title.includes("flux financiers"))).toBe(true);
    expect(result.understood.some((item) => item.includes("Indice métier/financier"))).toBe(true);
  });

  it("recognizes families 16–20 without forcing a legacy operational domain", () => {
    const result = analyzeNeed(makeNeed({
      title: "Gestion d'un cabinet juridique",
      category: "business",
      problem: "Notre cabinet avocat suit les dossiers juridiques, les audiences et les échéances des clients.",
      desiredOutcome: "Organiser les dossiers, pièces et rendez-vous avec un suivi confidentiel.",
    }));
    expect(result.unmappedUniversalFamilyCandidates).toContain("family-16");
    expect(result.universalSectorCandidates).toContain("S16-01");
    expect(result.universalFamilyCandidates).toContain("family-16");
    expect(result.questions.some((question) => question.includes("juridiction"))).toBe(true);
  });

  it("keeps hybrid unmapped family evidence distinct", () => {
    const result = analyzeNeed(makeNeed({
      title: "ONG et sécurité",
      category: "organization",
      problem: "Notre ONG organise la solidarité et la gestion de crise avec des équipes de sécurité incendie.",
      desiredOutcome: "Suivre les bénéficiaires, les alertes et les interventions.",
    }));
    expect(result.unmappedUniversalFamilyCandidates).toEqual(expect.arrayContaining(["family-19", "family-20"]));
  });

  it("does not mark an incomplete need as ready for analysis", () => {
    const result = analyzeNeed(makeNeed({ title: "  ", problem: "  ", desiredOutcome: "" }));
    expect(result.state).toBe("incomplete");
    expect(result.questions.length).toBeGreaterThan(0);
  });
});
