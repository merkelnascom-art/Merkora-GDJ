import { describe, expect, it } from "vitest";
import { parseGeminiAnalysis } from "./gemini-analysis";

const validAnalysis = {
  summary: "Analyse du besoin.",
  domain: "Commerce",
  understood: ["Les ventes doivent être suivies."],
  questions: ["Qui enregistre chaque vente ?"],
  recommendations: [{ title: "Suivi des ventes", description: "Centraliser les ventes.", reason: "Améliorer le suivi." }],
  improvements: [{
    title: "Contrôle quotidien",
    description: "Comparer les ventes et les encaissements.",
    expectedBenefit: "Repérer les écarts.",
    effort: "medium",
    priority: "high",
    assumptions: ["Les données sont disponibles."],
  }],
  competitiveAnalysis: {
    summary: "Aucune concurrence vérifiée.",
    comparisonCriteria: ["Prix", "Fonctionnalités"],
    opportunities: [],
    unknowns: ["Les tarifs doivent être vérifiés."],
    nextSteps: ["Comparer les offres publiques."],
  },
  assumptions: ["Les chiffres restent à confirmer."],
  nextSteps: ["Valider les processus avec le responsable."],
};

describe("parseGeminiAnalysis", () => {
  it("normalizes a structured Gemini analysis into the UI contract", () => {
    const parsed = parseGeminiAnalysis(validAnalysis, "Commerce", false);

    expect(parsed).not.toBeNull();
    expect(parsed?.summary).toBe("Analyse du besoin.");
    expect(parsed?.domain).toBe("Commerce");
    expect(parsed?.recommendations[0]?.title).toBe("Suivi des ventes");
    expect(parsed?.improvements[0]?.priority).toBe("high");
    expect(parsed?.competitiveAnalysis.researchStatus).toBe("not_verified");
  });

  it("rejects incomplete or non-object model output", () => {
    expect(parseGeminiAnalysis(null, "Autre", false)).toBeNull();
    expect(parseGeminiAnalysis({ summary: "Seulement une synthèse" }, "Autre", false)).toBeNull();
  });

  it("bounds generated lists and ignores invalid enum values", () => {
    const parsed = parseGeminiAnalysis({
      ...validAnalysis,
      questions: Array.from({ length: 20 }, (_, index) => `Question ${index}`),
      improvements: [{
        ...validAnalysis.improvements[0],
        effort: "extreme",
        priority: "critical",
      }],
    }, "Commerce", true);

    expect(parsed?.questions).toHaveLength(7);
    expect(parsed?.improvements[0]?.effort).toBe("unknown");
    expect(parsed?.improvements[0]?.priority).toBe("medium");
    expect(parsed?.competitiveAnalysis.researchStatus).toBe("user_supplied");
  });
});
