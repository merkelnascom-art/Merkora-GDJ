import { describe, expect, it } from "vitest";
import { buildLocalAnalysis } from "./local-analysis";
import type { Project } from "./project-types";

const project: Project = {
  id: "MK-LOCAL-1",
  title: "Suivi d’équipe",
  category: "organization",
  problem: "Je ne sais pas qui est présent et quelles tâches avancent.",
  desiredOutcome: "Suivre les présences et les tâches de chaque personne.",
  budget: "À définir",
  urgency: "normal",
  createdAt: "2026-10-28T00:00:00.000Z",
  status: "discovery",
  recommendations: [{ title: "Clarifier", description: "Définir le besoin.", reason: "Éviter les oublis." }],
};

describe("buildLocalAnalysis", () => {
  it("creates a transparent free fallback without inventing competitor facts", () => {
    const result = buildLocalAnalysis(project);
    expect(result.summary).toMatch(/locale gratuite/i);
    expect(result.recommendations).toEqual(project.recommendations);
    expect(result.improvements[0].title).toBe("Clarifier les rôles et les responsabilités");
    expect(result.competitiveAnalysis.researchStatus).toBe("not_verified");
    expect(result.competitiveAnalysis.summary).toMatch(/n’a pas été vérifiée/i);
  });

  it("preserves supplied competitor notes without claiming independent verification", () => {
    const result = buildLocalAnalysis(project, [{ name: "Alternative A", url: "", offer: "Gestion d'équipe", price: "à vérifier", notes: "Source consultée le 20/10" }]);
    expect(result.competitiveAnalysis.researchStatus).toBe("user_supplied");
    expect(result.competitiveAnalysis.summary).toMatch(/aucune vérification indépendante/i);
  });
});
