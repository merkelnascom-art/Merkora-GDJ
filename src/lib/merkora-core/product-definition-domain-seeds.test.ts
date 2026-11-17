import { describe, expect, it } from "vitest";
import { createProductDefinitionSession, getNextProductDefinitionQuestion } from "./product-definition";
import type { ProjectUnderstanding } from "./project-diagnostic";

function project(items: Array<{ id: string; dimension: string; value: string }>): ProjectUnderstanding {
  const evidence = items.map((item) => ({
    ...item,
    originalDimension: item.dimension,
    status: "user_stated" as const,
    source: "conversation" as const,
    sourceQuote: item.value,
    createdAt: "2026-11-17T00:00:00.000Z",
  }));
  return {
    id: "domain-seed-understanding",
    projectId: "domain-seed-project",
    version: 1,
    originalDescription: "Je veux développer une activité agricole.",
    items: evidence,
    situationGraph: { entities: [], relations: [], unresolvedRelations: [] },
    contradictions: [],
    unresolvedQuestions: [],
    privacyConsiderations: [],
    knowledgeMap: {
      version: 1,
      familyCandidates: [{
        familyId: "family:agriculture-agrofood",
        labelFr: "Agriculture",
        labelEn: "Agriculture",
        confidence: 0.9,
        evidenceCount: 1,
      }],
      primaryFamilyId: "family:agriculture-agrofood",
      needsFamilyClarification: false,
      links: [],
      solutionCandidates: [],
      processCandidates: [],
      resourceCandidates: [],
      indicatorCandidates: [],
      unresolved: [],
      automaticDecisions: [],
      registryVersion: 1,
    },
    activityVocabulary: "open",
    validationStatus: "in_progress",
    sourceSessionVersion: 1,
    createdAt: "2026-11-17T00:00:00.000Z",
    updatedAt: "2026-11-17T00:00:00.000Z",
  } as ProjectUnderstanding;
}

describe("screen 05 — domain questions remain active when the activity is already known", () => {
  it("asks for agricultural production context when only the broad activity is known", () => {
    const dossier = project([
      { id: "activity", dimension: "activity", value: "Développer une activité agricole" },
    ]);

    const next = getNextProductDefinitionQuestion(dossier, createProductDefinitionSession(dossier));

    expect(next?.id).toBe("domain-family:agriculture-agrofood-production-cycle");
    expect(next?.prompt).toMatch(/cultures|productions végétales|saisons|agroalimentaires/i);
  });

  it("moves to agricultural constraints when production context is already documented", () => {
    const dossier = project([
      { id: "activity", dimension: "activity", value: "Cultiver du maïs" },
      { id: "context", dimension: "context", value: "Maïs pendant la saison des pluies" },
    ]);

    const next = getNextProductDefinitionQuestion(dossier, createProductDefinitionSession(dossier));

    expect(next?.id).toBe("domain-family:agriculture-agrofood-agri-constraints");
    expect(next?.prompt).toMatch(/terre|eau|climat|intrants|stockage|qualité|débouchés/i);
  });
});


describe("screen 05 — selectable suggestions alongside free-text answers", () => {
  it("offers contextual role suggestions without treating them as confirmed roles", () => {
    const dossier = project([
      { id: "activity", dimension: "activity", value: "Gérer une pâtisserie et vendre des gâteaux" },
      { id: "actors", dimension: "actors", value: "La responsable et les pâtissiers" },
    ]);
    dossier.originalDescription = "Je veux une plateforme numérique pour une pâtisserie.";
    dossier.knowledgeMap = {
      ...dossier.knowledgeMap!,
      familyCandidates: [],
      primaryFamilyId: undefined,
      needsFamilyClarification: false,
    };

    const next = getNextProductDefinitionQuestion(dossier, createProductDefinitionSession(dossier));

    expect(next?.id).toBe("users-roles");
    expect(next?.answerType).toBe("text");
    expect(next?.suggestedOptions).toEqual(expect.arrayContaining([
      "Responsable / administrateur",
      "Personnel de préparation",
      "Client",
    ]));
  });
});
