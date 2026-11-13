import { describe, expect, it } from "vitest";
import type { Project } from "./project-types";
import { buildMockupModel, type MockupConfig } from "./mockup-studio";
import { analyzeBusinessSignals } from "./business-signal-analysis";

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
      unmappedUniversalFamilyCandidates: [],
      universalSectorCandidates: [],
        businessSignals: analyzeBusinessSignals(""),
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

  it("keeps financial signal families visible in Studio for mixed business projects", () => {
    const project: Project = {
      ...teamProject,
      title: "Pilotage de mon entreprise",
      problem: "Je vends beaucoup, mais je ne sais pas où passe l'argent. Je dois suivre les recettes, dépenses et bénéfices.",
      desiredOutcome: "Avoir un rapport financier hebdomadaire.",
      discovery: undefined,
    };
    const model = buildMockupModel(project, { format: "dashboard", palette: "blue", enabledModules: [] });
    expect(model.businessSignals.signals.map((signal) => signal.id)).toContain("cashflow");
    expect(model.businessSignals.signals.map((signal) => signal.id)).toContain("revenue");
    expect(model.universalFamilyCandidates.map((family) => family.id)).toContain("family-05");
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

  it("recommends physical and service deliverables without forcing a digital application", () => {
    const physicalProject = {
      ...studentProject,
      title: "Kit de jardinage sur balcon",
      category: "other" as const,
      problem: "Les habitants manquent de place et ne savent pas comment cultiver des aromates.",
      desiredOutcome: "Un kit physique prêt à utiliser avec matériel adapté et guide pas-à-pas.",
    };
    const model = buildMockupModel(physicalProject, { format: "website", palette: "violet", enabledModules: [] });
    expect(model.recommendedDeliverables.map((item) => item.id))
      .toEqual(expect.arrayContaining(["physical_prototype", "visual_mockup", "business_plan"]));
    expect(model.recommendedDeliverables.map((item) => item.id)).not.toContain("web_app");
  });

  it("recommends a mixed digital and operational deliverable set for a neighborhood service", () => {
    const serviceProject = {
      ...studentProject,
      title: "Paniers anti-gaspillage",
      category: "other" as const,
      problem: "Les commerces jettent leurs invendus et les ménages cherchent des produits frais.",
      desiredOutcome: "Réserver des paniers avant la fermeture avec des commerces partenaires et organiser les retraits.",
    };
    const model = buildMockupModel(serviceProject, { format: "website", palette: "violet", enabledModules: [] });
    expect(model.recommendedDeliverables.map((item) => item.id))
      .toEqual(expect.arrayContaining(["web_app", "service_blueprint", "business_plan"]));
  });

  it("classifies all ten mixed project briefs by their useful deliverables without forcing every project into an app", () => {
    const briefs = [
      { title: "Application de covoiturage urbain quotidien", problem: "Les actifs partagent les mêmes trajets et les frais de carburant augmentent.", desiredOutcome: "Mettre en relation les voisins et partager les frais.", expected: ["web_app", "service_blueprint"] },
      { title: "Service de paniers anti-gaspillage", problem: "Les commerces jettent leurs invendus et les ménages cherchent des produits frais.", desiredOutcome: "Réserver des paniers avant la fermeture avec retrait chez les commerçants.", expected: ["web_app", "service_blueprint", "business_plan"] },
      { title: "Plateforme seniors et étudiants", problem: "Les seniors sont isolés et les étudiants cherchent un logement.", desiredOutcome: "Organiser une cohabitation sécurisée et des petits services.", expected: ["web_app", "service_blueprint"] },
      { title: "Outil de gestion pour artisans", problem: "Les indépendants perdent du temps sur les devis, factures et relances.", desiredOutcome: "Créer des devis en deux minutes et envoyer des rappels automatiques.", expected: ["web_app", "document_pack"] },
      { title: "Campagne de tri des déchets électroniques", problem: "Les habitants ignorent où déposer leurs anciens téléphones.", desiredOutcome: "Créer une campagne visuelle qui rassure sur l'effacement des données.", expected: ["poster", "communication_campaign"] },
      { title: "Service de consigne à bagages", problem: "Les voyageurs doivent porter leurs valises avant leur hébergement.", desiredOutcome: "Réserver une consigne chez des commerces partenaires.", expected: ["web_app", "service_blueprint"] },
      { title: "Kit de jardinage sur balcon", problem: "Les citadins manquent de place et de connaissances.", desiredOutcome: "Un kit physique prêt à utiliser avec matériel et guide pas-à-pas.", expected: ["physical_prototype", "business_plan", "document_pack"] },
      { title: "Prêt d'outils entre voisins", problem: "Chaque foyer achète du matériel rarement utilisé.", desiredOutcome: "Lister les outils disponibles et organiser des emprunts de proximité.", expected: ["web_app", "service_blueprint"] },
      { title: "Espace de coworking mobile en zone rurale", problem: "Les télétravailleurs manquent de lieux équipés.", desiredOutcome: "Aménager un café, une salle ou un véhicule avec Wi-Fi et espace de travail.", expected: ["service_blueprint", "physical_prototype"] },
      { title: "Programme de reconversion professionnelle", problem: "Les salariés veulent changer de voie mais craignent de perdre leur sécurité financière.", desiredOutcome: "Un parcours structuré pour tester un nouveau métier sans quitter son emploi.", expected: ["service_blueprint", "training_program"] },
    ] as const;

    for (const brief of briefs) {
      const model = buildMockupModel({
        ...studentProject,
        title: brief.title,
        category: "other",
        problem: brief.problem,
        desiredOutcome: brief.desiredOutcome,
      }, { format: "website", palette: "violet", enabledModules: [] });
      const formats = model.recommendedDeliverables.map((item) => item.id);
      expect(formats, brief.title).toEqual(expect.arrayContaining([...brief.expected]));
    }

    const physicalOnly = buildMockupModel({
      ...studentProject,
      title: "Kit de jardinage sur balcon",
      category: "other",
      problem: "Manque de place et de connaissances.",
      desiredOutcome: "Un kit physique prêt à utiliser avec matériel et guide pas-à-pas.",
    }, { format: "website", palette: "violet", enabledModules: [] });
    expect(physicalOnly.recommendedDeliverables.map((item) => item.id)).not.toContain("web_app");
  });

  it("preserves only client-selected deliverable formats and does not auto-confirm recommendations", () => {
    const model = buildMockupModel(studentProject, {
      format: "website", palette: "violet", enabledModules: [],
      selectedDeliverableFormats: ["poster", "physical_prototype", "unknown-format"],
    });
    expect(model.selectedDeliverableFormats).toEqual(["poster", "physical_prototype"]);
    expect(model.recommendedDeliverables.length).toBeGreaterThan(0);
  });

});
