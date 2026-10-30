import { describe, expect, it } from "vitest";
import { buildSelectedPlanOptions } from "./mockup-selections";
import type { Project } from "../project-types";

const project: Project = {
  id: "MK-UI-001",
  title: "Suivi d'équipe",
  category: "organization",
  problem: "Je ne sais pas qui est présent et quelles tâches avancent dans mon équipe.",
  desiredOutcome: "Suivre les présences et les responsabilités de chaque personne.",
  budget: "À définir",
  urgency: "normal",
  createdAt: "2026-10-30T00:00:00.000Z",
  status: "discovery",
  recommendations: [{
    title: "Clarifier le besoin",
    description: "Décomposer le problème et les personnes concernées.",
    reason: "Éviter de construire une solution inadaptée.",
  }],
};

describe("buildSelectedPlanOptions", () => {
  it("does not mistake default mockup modules or suggestions for explicit client selections", () => {
    expect(buildSelectedPlanOptions(project, {})).toEqual([]);
  });

  it("passes only modules and recommendations explicitly selected in the visual studio", () => {
    const selected = buildSelectedPlanOptions(project, {
      enabledModules: ["attendance"],
      selectedRecommendationIds: ["clarifier-le-besoin"],
    });

    expect(selected.map((item) => item.id)).toEqual([
      "module:attendance",
      "recommendation:clarifier-le-besoin",
    ]);
  });

  it("does not include recommendations when the client has not explicitly selected any", () => {
    const selected = buildSelectedPlanOptions(project, {
      enabledModules: ["attendance"],
    });

    expect(selected.map((item) => item.id)).toEqual(["module:attendance"]);
  });
});
