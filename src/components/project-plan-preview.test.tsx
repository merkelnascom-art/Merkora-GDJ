import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ProjectPlanPreview, buildSelectedPlanOptions } from "./project-plan-preview";
import type { Project } from "@/lib/project-types";

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

describe("ProjectPlanPreview", () => {
  it("does not mistake default mockup modules or suggestions for explicit client selections", () => {
    expect(buildSelectedPlanOptions(project, {})).toEqual([]);
  });

  it("passes only the modules and recommendations explicitly selected in the visual studio", () => {
    const selected = buildSelectedPlanOptions(project, {
      enabledModules: ["attendance"],
      selectedRecommendationIds: ["clarifier-le-besoin"],
    });

    expect(selected.map((item) => item.id)).toEqual([
      "module:attendance",
      "recommendation:clarifier-le-besoin",
    ]);
  });

  it("renders an accessible draft-plan entry point without claiming approval or production", () => {
    const markup = renderToStaticMarkup(createElement(ProjectPlanPreview, { project }));

    expect(markup).toContain("Plan de réalisation MerKora");
    expect(markup).toContain("Générer mon plan");
    expect(markup).toContain("Aucun plan généré");
    expect(markup).not.toMatch(/Plan approuvé|En production|Projet livré/i);
  });
});
