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
    expect(model.universalFamilyCandidates.map((family) => family.id)).toContain("family-08");
    expect(model.modules.map((item) => item.id)).toEqual(expect.arrayContaining(["student-profile", "career-explorer", "study-paths"]));
    expect(model.headline).toMatch(/Student Vision/);
    expect(JSON.stringify(model)).not.toMatch(/Université nationale|prix de scolarité|85%/i);
  });

  it("reconstructs profession candidates for saved projects that do not retain discovery metadata", () => {
    const model = buildMockupModel(studentProject, { format: "website", palette: "violet", enabledModules: [] });
    expect(model.professionCandidates.length).toBeGreaterThan(0);
    expect(model.professionCandidates.every((candidate) => candidate.reviewStatus === "candidate")).toBe(true);
    expect(model.selectedProfessionCandidates).toEqual([]);
  });

  it("builds sector-focused diagnostic questions from client-confirmed sectors", () => {
    const model = buildMockupModel(studentProject, { format: "website", palette: "violet", enabledModules: [], selectedUniversalSectorIds: ["S08-01"] });
    expect(model.activityDiagnostic.status).toBe("sector_focused");
    expect(model.activityDiagnostic.questions.map((item) => item.id)).toContain("education-learner");
  });

  it("shows profession candidates for confirmation without selecting them automatically", () => {
    const projectWithCandidates: Project = {
      ...studentProject,
      discovery: {
        state: "preliminary",
        registryVersion: "test",
        domain: "education",
        domainId: "education-formation",
        specializationId: null,
        domainLabel: "Éducation et formation",
        universalFamilyCandidates: ["family-08"],
        professionCandidates: [
          { id: "candidate-08-001", title: "Conseiller d’orientation", familyId: "family-08", sourceGroup: "Éducation", reviewStatus: "candidate" },
          { id: "candidate-08-002", title: "Formateur professionnel", familyId: "family-08", sourceGroup: "Éducation", reviewStatus: "candidate" },
        ],
        confidence: "medium",
        isPreliminary: true,
        understood: [],
        questions: [],
        recommendations: [],
        notice: "À confirmer",
      },
    };
    const unselected = buildMockupModel(projectWithCandidates, { format: "website", palette: "violet", enabledModules: [] });
    expect(unselected.professionCandidates).toHaveLength(2);
    expect(unselected.selectedProfessionCandidates).toEqual([]);

    const selected = buildMockupModel(projectWithCandidates, {
      format: "website", palette: "violet", enabledModules: [],
      selectedProfessionCandidateIds: ["candidate-08-002"],
    });
    expect(selected.selectedProfessionCandidates.map((item) => item.title)).toEqual(["Formateur professionnel"]);
  });

  it("builds operational modules for team management, not education", () => {
    const model = buildMockupModel(teamProject, { format: "dashboard", palette: "blue", enabledModules: [] });
    expect(model.domain).toBe("operations");
    expect(model.universalFamilyCandidates.map((family) => family.id)).toContain("family-12");
    expect(model.modules.map((item) => item.id)).toEqual(expect.arrayContaining(["team-overview", "attendance", "task-board"]));
    expect(model.modules.map((item) => item.id)).not.toContain("career-explorer");
  });

  it("routes each of the 13 sectors to its own métier option catalogue", () => {
    const samples = [
      ["sport", "Je gère un club de football et ses entraînements."],
      ["sante", "Notre clinique organise les consultations des patients et les analyses."],
      ["agriculture-environnement", "Je veux suivre les récoltes et les stocks de ma ferme."],
      ["commerce", "Je veux gérer les ventes et les stocks de ma boutique."],
      ["entrepreneuriat-finance", "Je veux suivre la trésorerie, le budget et la rentabilité de mon entreprise."],
      ["immobilier-btp", "Je gère des locataires, les loyers et des chantiers de construction."],
      ["education-formation", "Les élèves après le bac ont besoin de tests d'orientation et de pistes de métiers."],
      ["transport-logistique", "Je veux gérer le transport de marchandises avec nos camions et planifier les tournées."],
      ["restauration-hotellerie-evenementiel", "Mon hôtel doit gérer les chambres et les réservations."],
      ["ressources-humaines", "Je veux gérer les ressources humaines, les contrats de travail et les congés."],
      ["artisanat-services", "Je suis plombier et je veux planifier les dépannages à domicile."],
      ["administration-services-publics", "Notre mairie gère les demandes d'actes de naissance des citoyens."],
      ["voyage-tourisme-creation-jeux", "Je veux concevoir un jeu vidéo éducatif avec des niveaux et des missions."],
    ] as const;
    for (const [domainId, problem] of samples) {
      const model = buildMockupModel({
        ...studentProject,
        title: "Projet métier",
        category: "other",
        problem,
        desiredOutcome: "Organiser le service et suivre son fonctionnement.",
      }, { format: "website", palette: "violet", enabledModules: [] });
      expect(model.domainId).toBe(domainId);
      expect(model.modules.some((item) => item.group === "metier")).toBe(true);
      expect(model.transversalOptions.length).toBeGreaterThan(0);
    }
  });

  it("offers the career-guidance specialization instead of generic school modules", () => {
    const model = buildMockupModel(studentProject, { format: "website", palette: "violet", enabledModules: [] });
    expect(model.specializationId).toBe("career-guidance");
    expect(model.modules.map((item) => item.id)).toEqual(expect.arrayContaining(["student-profile", "aptitude-tests", "career-explorer", "study-paths"]));
  });

  it("can represent an explicit decision to select no modules", () => {
    const model = buildMockupModel(studentProject, {
      format: "website", palette: "violet", enabledModules: [], moduleSelectionConfirmed: true,
    });
    expect(model.visibleModules).toEqual([]);
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

  it("shows only the solution tracks explicitly selected by the client", () => {
    const config = {
      format: "website" as const,
      palette: "violet" as const,
      enabledModules: [],
      selectedRecommendationIds: ["profil-de-l-eleve"],
    };
    const model = buildMockupModel(studentProject, config);
    expect(model.visibleRecommendations.map((item) => item.id)).toEqual([
      "profil-de-l-eleve",
    ]);
    expect(model.visibleRecommendations[0]?.title).toBe("Profil de l’élève");
    expect(model.visibleRecommendations).toHaveLength(1);
  });

  it("allows the client to explicitly deselect every recommendation", () => {
    const model = buildMockupModel(studentProject, {
      format: "website",
      palette: "violet",
      enabledModules: [],
      selectedRecommendationIds: [],
    });
    expect(model.visibleRecommendations).toEqual([]);
  });

  it("preserves legacy configs by showing recommendations when no selection has been saved", () => {
    const model = buildMockupModel(teamProject, {
      format: "website",
      palette: "violet",
      enabledModules: [],
    });
    expect(model.visibleRecommendations.length).toBe(teamProject.recommendations.length);
  });

});
