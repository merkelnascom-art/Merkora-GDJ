import { describe, expect, it } from "vitest";
import type { ProductDefinitionSession } from "./product-definition";
import type { ProjectUnderstanding } from "./project-diagnostic";
import {
  acceptSolutionComponent,
  buildSolutionProposal,
  rejectSolutionComponent,
  reviseSolutionComponent,
} from "./solution-proposal";

function dossier(): ProjectUnderstanding {
  return {
    id: "understanding-1",
    projectId: "project-1",
    version: 1,
    originalDescription: "Je veux une plateforme pour gérer un centre de formation et suivre les apprenants.",
    items: [
      { id: "activity", dimension: "activity", originalDimension: "activity", value: "Gérer un centre de formation", status: "user_stated", source: "conversation", sourceQuote: "Gérer un centre de formation", createdAt: "2026-11-17T00:00:00.000Z" },
      { id: "goal", dimension: "objectives", originalDimension: "goal", value: "Suivre les apprenants", status: "user_stated", source: "conversation", sourceQuote: "Suivre les apprenants", createdAt: "2026-11-17T00:00:00.000Z" },
    ],
    situationGraph: { entities: [], relations: [], unresolvedRelations: [] },
    contradictions: [],
    unresolvedQuestions: [],
    privacyConsiderations: [],
    knowledgeMap: { version: 1, familyCandidates: [], needsFamilyClarification: false, links: [], solutionCandidates: [], processCandidates: [], resourceCandidates: [], indicatorCandidates: [], unresolved: [], automaticDecisions: [], registryVersion: 1 },
    activityVocabulary: "open",
    validationStatus: "in_progress",
    sourceSessionVersion: 1,
    createdAt: "2026-11-17T00:00:00.000Z",
    updatedAt: "2026-11-17T00:00:00.000Z",
  } as ProjectUnderstanding;
}

function definition(): ProductDefinitionSession {
  return {
    id: "definition-1",
    projectId: "project-1",
    understandingId: "understanding-1",
    version: 3,
    answers: [
      {
        id: "answer-function",
        questionId: "product-functions",
        familyId: "functionalities",
        value: ["Inscrire un apprenant", "Suivre les présences"],
        status: "answered",
        createdAt: "2026-11-17T00:00:00.000Z",
        version: 2,
        question: { id: "product-functions", familyId: "functionalities", prompt: "Quelles fonctions ?", purpose: "Définir les fonctions", answerType: "multi_choice", allowDetail: false, evidenceIds: [] },
      },
      {
        id: "answer-unknown",
        questionId: "product-finances",
        familyId: "finances",
        value: "Je ne sais pas encore",
        status: "unknown",
        createdAt: "2026-11-17T00:00:00.000Z",
        version: 3,
        question: { id: "product-finances", familyId: "finances", prompt: "Quels flux ?", purpose: "Préciser les flux", answerType: "text", allowDetail: false, evidenceIds: [] },
      },
    ],
    askedQuestionIds: ["product-functions", "product-finances"],
    deferredQuestionIds: [],
    status: "ready_for_review",
    createdAt: "2026-11-17T00:00:00.000Z",
    updatedAt: "2026-11-17T00:00:00.000Z",
  };
}

describe("screen 06 — solution proposal", () => {
  it("builds a concise proposal from the validated definition without turning unknown answers into features", () => {
    const proposal = buildSolutionProposal(dossier(), definition());

    expect(proposal.title).toMatch(/formation/i);
    expect(proposal.components.map((component) => component.title)).toEqual([
      "Inscrire un apprenant",
      "Suivre les présences",
    ]);
    expect(proposal.components.every((component) => component.status === "suggested")).toBe(true);
    expect(proposal.components.some((component) => /flux financiers/i.test(component.title))).toBe(false);
  });

  it("keeps client decisions explicit when a component is accepted, modified, or rejected", () => {
    const proposal = buildSolutionProposal(dossier(), definition());
    const componentId = proposal.components[0].id;

    const accepted = acceptSolutionComponent(proposal, componentId);
    expect(accepted.components[0].status).toBe("accepted");

    const modified = reviseSolutionComponent(accepted, componentId, "Inscription et dossier apprenant");
    expect(modified.components[0].status).toBe("modified");
    expect(modified.components[0].title).toBe("Inscription et dossier apprenant");

    const rejected = rejectSolutionComponent(modified, componentId);
    expect(rejected.components[0].status).toBe("rejected");
  });

  it("does not invent an alternative architecture when no meaningful trade-off is evidenced", () => {
    const proposal = buildSolutionProposal(dossier(), definition());
    expect(proposal.architectures).toHaveLength(1);
  });
  it("uses the selected product type and combines domain-specific modules for a hybrid project", () => {
    const proposal = buildSolutionProposal(dossier(), definition(), {
      projectName: "Aéro Service — Gestion intégrée",
      productTypeId: "web_platform",
      domainIds: ["attendance", "reservation"],
      navigationStyle: "sidebar",
      brandingMode: "create_logo",
    });

    expect(proposal.title).toBe("Aéro Service — Gestion intégrée");
    expect(proposal.architectures[0].title).toContain("Plateforme web");
    expect(proposal.domainComposition?.isHybrid).toBe(true);
    expect(proposal.components.map((component) => component.title)).toEqual(
      expect.arrayContaining([
        "Espaces par profil",
        "Espace administrateur",
        "Pointage et identification",
        "Retards, absences et justificatifs",
        "Disponibilités et créneaux",
        "Invitations et QR codes",
        "Transformer une réservation en présence",
      ]),
    );
    expect(proposal.components.filter((component) => component.source === "catalog_suggestion")
      .every((component) => component.status === "suggested")).toBe(true);
    expect(proposal.productProfile?.brandingMode).toBe("create_logo");
  });

});