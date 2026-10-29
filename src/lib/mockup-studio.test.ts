import { describe, expect, it } from "vitest";
import type { Project } from "./project-types";
import { buildMockupModel, type MockupConfig } from "./mockup-studio";

const studentProject: Project = {
  id: "MK-STUDENT-1",
  title: "Student Vision",
  category: "digital",
  problem: "Les élèves après le bac ne savent pas choisir leur métier.",
  desiredOutcome: "Une plateforme de tests qui recommande des métiers, formations et écoles.",
  budget: "100 000 – 500 000 FCFA",
  urgency: "soon",
  createdAt: "2026-10-28T00:00:00.000Z",
  status: "discovery",
  recommendations: [
    { title: "Profil de l’élève", description: "Questionnaire d’intérêts.", reason: "Comprendre l’élève." },
    { title: "Métiers et formations", description: "Explorer les parcours.", reason: "Comparer les options." },
  ],
};

const teamProject: Project = {
  ...studentProject,
  id: "MK-TEAM-1",
  title: "Gestion d’équipe",
  category: "organization",
  problem: "Le responsable ne sait pas qui est présent ni quelles tâches avancent.",
  desiredOutcome: "Suivre les présences et les tâches de chaque employé.",
  recommendations: [
    { title: "Présences", description: "Suivre les arrivées.", reason: "Améliorer le suivi." },
  ],
};

describe("buildMockupModel", () => {
  it("builds education-specific modules for Student Vision without inventing facts", () => {
    const model = buildMockupModel(studentProject, { format: "website", palette: "violet", enabledModules: [] });
    expect(model.domain).toBe("education");
    expect(model.modules.map((item) => item.id)).toEqual(expect.arrayContaining(["student-profile", "career-explorer", "study-paths"]));
    expect(model.headline).toMatch(/Student Vision/);
    expect(JSON.stringify(model)).not.toMatch(/Université nationale|prix de scolarité|85%/i);
  });

  it("builds operational modules for team management, not education", () => {
    const model = buildMockupModel(teamProject, { format: "dashboard", palette: "blue", enabledModules: [] });
    expect(model.domain).toBe("operations");
    expect(model.modules.map((item) => item.id)).toEqual(expect.arrayContaining(["team-overview", "attendance", "task-board"]));
    expect(model.modules.map((item) => item.id)).not.toContain("career-explorer");
  });

  it("accepts all supported formats and palettes", () => {
    const formats: MockupConfig["format"][] = ["website", "mobile", "dashboard"];
    const palettes: MockupConfig["palette"][] = ["violet", "blue", "emerald", "amber"];
    for (const format of formats) {
      for (const palette of palettes) {
        const model = buildMockupModel(studentProject, { format, palette, enabledModules: [] });
        expect(model.format).toBe(format);
        expect(model.palette).toBe(palette);
      }
    }
  });

  it("ignores unknown enabled module ids and defaults to all known modules", () => {
    const all = buildMockupModel(studentProject, { format: "mobile", palette: "emerald", enabledModules: [] });
    const selected = buildMockupModel(studentProject, { format: "mobile", palette: "emerald", enabledModules: ["student-profile", "made-up"] });
    expect(selected.visibleModules.map((item) => item.id)).toEqual(["student-profile"]);
    expect(all.visibleModules.length).toBeGreaterThan(0);
  });

  it("uses neutral fallback copy for empty optional fields", () => {
    const sparse = { ...studentProject, desiredOutcome: "", recommendations: [] };
    const model = buildMockupModel(sparse, { format: "website", palette: "amber", enabledModules: [] });
    expect(model.supportingCopy.length).toBeGreaterThan(0);
    expect(model.visibleModules.length).toBeGreaterThan(0);
  });
});
