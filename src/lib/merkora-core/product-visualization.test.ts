import { describe, expect, it } from "vitest";
import type { ProductDefinitionSession } from "./product-definition";
import type { ProjectUnderstanding } from "./project-diagnostic";
import type { SolutionProposal } from "./solution-proposal";
import { buildProductVisualization } from "./product-visualization";

const timestamp = "2026-11-17T00:00:00.000Z";

function dossier(description = "Je veux une plateforme numérique pour gérer un centre de formation.") {
  return {
    id: "understanding-visual",
    projectId: "project-visual",
    version: 1,
    originalDescription: description,
    items: [
      { id: "activity", dimension: "activity", originalDimension: "activity", value: "Gérer un centre de formation", status: "user_stated", source: "conversation", sourceQuote: "Gérer un centre de formation", createdAt: timestamp },
      { id: "actors", dimension: "actors", originalDimension: "actors", value: "Responsable et apprenants", status: "user_stated", source: "conversation", sourceQuote: "Responsable et apprenants", createdAt: timestamp },
    ],
    situationGraph: { entities: [], relations: [], unresolvedRelations: [] },
    contradictions: [],
    unresolvedQuestions: [],
    privacyConsiderations: [],
    knowledgeMap: { version: 1, familyCandidates: [], needsFamilyClarification: false, links: [], solutionCandidates: [], processCandidates: [], resourceCandidates: [], indicatorCandidates: [], unresolved: [], automaticDecisions: [], registryVersion: 1 },
    activityVocabulary: "open",
    validationStatus: "in_progress",
    sourceSessionVersion: 1,
    createdAt: timestamp,
    updatedAt: timestamp,
  } as ProjectUnderstanding;
}

function definition(): ProductDefinitionSession {
  return {
    id: "definition-visual",
    projectId: "project-visual",
    understandingId: "understanding-visual",
    version: 2,
    answers: [{
      id: "roles-answer",
      questionId: "roles",
      familyId: "users_roles",
      value: ["Responsable", "Formateur", "Apprenant"],
      status: "answered",
      createdAt: timestamp,
      version: 1,
      question: { id: "roles", familyId: "users_roles", prompt: "Quels profils ?", purpose: "Définir les profils", answerType: "multi_choice", allowDetail: false, evidenceIds: [] },
    }],
    askedQuestionIds: ["roles"],
    deferredQuestionIds: [],
    status: "ready_for_review",
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

function proposal(overrides: Partial<SolutionProposal> = {}): SolutionProposal {
  return {
    id: "solution-project-visual",
    projectId: "project-visual",
    title: "Centre de formation",
    description: "Une solution pour suivre les apprenants.",
    problem: "Le suivi est dispersé.",
    objective: "Suivre les apprenants.",
    operatingPrinciple: "Une organisation commune.",
    architectures: [{ id: "recommended", title: "Plateforme numérique centralisée", description: "Une plateforme.", recommended: true, tradeOffs: [] }],
    components: [
      { id: "registration", title: "Inscription des apprenants", description: "Enregistrer les inscriptions.", status: "accepted", source: "validated_definition", familyId: "functionalities", sourceIds: [] },
      { id: "attendance", title: "Suivi des présences", description: "Suivre les présences.", status: "modified", source: "validated_definition", familyId: "functionalities", sourceIds: [] },
      { id: "rejected", title: "Gestion des paiements", description: "À examiner.", status: "rejected", source: "knowledge_suggestion", sourceIds: [] },
      { id: "suggested", title: "Messagerie", description: "À examiner.", status: "suggested", source: "knowledge_suggestion", sourceIds: [] },
    ],
    coherenceNotes: [],
    unresolvedPoints: [],
    version: 2,
    updatedAt: timestamp,
    ...overrides,
  };
}

describe("screen 07 — product visualization", () => {
  it("builds a navigable digital prototype from only the components retained on screen 06", () => {
    const result = buildProductVisualization(dossier(), definition(), proposal());

    expect(result.kind).toBe("digital");
    expect(result.roles).toEqual(["Responsable", "Formateur", "Apprenant"]);
    expect(result.screens.map((screen) => screen.title)).toEqual([
      "Vue d'ensemble",
      "Inscription des apprenants",
      "Suivi des présences",
    ]);
    expect(result.screens.some((screen) => screen.title === "Gestion des paiements" || screen.title === "Messagerie")).toBe(false);
  });

  it("creates an operational journey instead of forcing a digital interface for a non-digital project", () => {
    const result = buildProductVisualization(
      dossier("Je veux organiser un service de livraison local."),
      definition(),
      proposal({
        title: "Service de livraison",
        architectures: [{ id: "recommended", title: "Organisation opérationnelle", description: "Un parcours de service.", recommended: true, tradeOffs: [] }],
      }),
    );

    expect(result.kind).toBe("operational");
    expect(result.journey).toHaveLength(2);
    expect(result.screens).toHaveLength(0);
  });

  it("does not invent roles or components when the client has not retained any", () => {
    const result = buildProductVisualization(
      dossier(),
      { ...definition(), answers: [] },
      proposal({ components: [] }),
    );

    expect(result.roles).toEqual(["Vue générale"]);
    expect(result.screens).toHaveLength(1);
    expect(result.screens[0].componentId).toBeNull();
  });
});
