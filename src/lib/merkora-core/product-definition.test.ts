import { describe, expect, it } from "vitest";
import {
  createProductDefinitionSession,
  getNextProductDefinitionQuestion,
  recordProductDefinitionAnswer,
  deferProductDefinitionQuestion,
  resumeDeferredProductDefinitionQuestions,
  reviseProductDefinitionAnswer,
  type ProductDefinitionSession,
} from "./product-definition";
import type { ProjectUnderstanding } from "./project-diagnostic";

function dossier(options: {
  description: string;
  items?: Array<{ id: string; dimension: string; value: string }>;
  familyId?: string;
}): ProjectUnderstanding {
  const items = (options.items ?? []).map((item) => ({
    ...item,
    originalDimension: item.dimension,
    status: "user_stated" as const,
    source: "conversation" as const,
    sourceQuote: item.value,
    createdAt: "2026-11-17T00:00:00.000Z",
  }));
  return {
    id: "understanding-test",
    projectId: "project-test",
    version: 1,
    originalDescription: options.description,
    items,
    situationGraph: { entities: [], relations: [], unresolvedRelations: [] },
    contradictions: [],
    unresolvedQuestions: [],
    privacyConsiderations: [],
    knowledgeMap: {
      version: 1,
      familyCandidates: options.familyId ? [{
        familyId: options.familyId,
        labelFr: options.familyId,
        labelEn: options.familyId,
        confidence: 0.9,
        evidenceCount: 1,
      }] : [],
      ...(options.familyId ? { primaryFamilyId: options.familyId } : {}),
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

describe("MerKora screen 05 — universal adaptive product definition", () => {
  it("uses the known tournament details and never asks again for the activity or participant count", () => {
    const project = dossier({
      description: "Créer une plateforme web pour organiser un tournoi de baby-foot.",
      familyId: "family:sport-physical-activity",
      items: [
        { id: "activity", dimension: "activity", value: "Organiser un tournoi de baby-foot" },
        { id: "players", dimension: "actors", value: "Il y aura 9 joueurs" },
        { id: "flow", dimension: "operations", value: "Inscriptions, matchs, scores et classement" },
        { id: "solution", dimension: "imagined_solution", value: "Une plateforme web" },
      ],
    });
    const session = createProductDefinitionSession(project);
    const next = getNextProductDefinitionQuestion(project, session);

    expect(next).not.toBeNull();
    expect(next?.prompt).not.toMatch(/quelle activité|combien de joueurs|nombre de participants/i);
    expect(next?.evidenceIds).toContain("activity");
    expect(next?.familyId).toBeTruthy();
  });

  it("uses agricultural knowledge for an agricultural project, not sports or commerce questions", () => {
    const project = dossier({
      description: "Créer un outil pour suivre la culture du maïs et les récoltes.",
      familyId: "family:agriculture-agrofood",
      items: [{ id: "activity", dimension: "activity", value: "Cultiver du maïs et suivre les récoltes" }],
    });
    const next = getNextProductDefinitionQuestion(project, createProductDefinitionSession(project));

    expect(next?.prompt).toMatch(/cultures|productions végétales|saisons|agroalimentaires/i);
    expect(next?.prompt).not.toMatch(/joueurs|tournoi|commandes|clients|ventes/i);
  });

  it("uses education knowledge for an educational project without inheriting another sector's questions", () => {
    const project = dossier({
      description: "Concevoir un parcours pour accompagner les apprenants dans leur orientation.",
      familyId: "family:education-research",
      items: [{ id: "activity", dimension: "activity", value: "Accompagner les apprenants dans leur orientation" }],
    });
    const next = getNextProductDefinitionQuestion(project, createProductDefinitionSession(project));

    expect(next?.prompt).toMatch(/apprenants|niveaux|disciplines|parcours/i);
    expect(next?.prompt).not.toMatch(/joueurs|récoltes|paiements/i);
  });

  it("does not force an irrelevant family and can finish when no useful question remains", () => {
    const project = dossier({
      description: "Un projet libre sans besoin d'interface, de finance ou d'identité visuelle.",
      items: [
        { id: "nature", dimension: "imagined_solution", value: "Un protocole papier ponctuel" },
        { id: "roles", dimension: "actors", value: "Une seule personne responsable" },
        { id: "operations", dimension: "operations", value: "Une action unique, sans suivi ultérieur" },
        { id: "visual", dimension: "context", value: "Aucune identité visuelle nécessaire" },
      ],
    });
    const session: ProductDefinitionSession = {
      ...createProductDefinitionSession(project),
      askedQuestionIds: [
        "product-nature",
        "users-roles",
        "product-functions",
        "product-exploitation",
        "visual-identity",
      ],
    };

    expect(getNextProductDefinitionQuestion(project, session)).toBeNull();
  });

  it("supports defer, resume and answer revision without losing the previous version", () => {
    const project = dossier({ description: "Créer un outil de suivi." });
    const session = createProductDefinitionSession(project);
    const question = getNextProductDefinitionQuestion(project, session);
    expect(question).not.toBeNull();
    if (!question) return;

    const deferred = deferProductDefinitionQuestion(session, question);
    expect(getNextProductDefinitionQuestion(project, deferred)).not.toEqual(question);
    const resumed = resumeDeferredProductDefinitionQuestions(deferred);
    expect(resumed.deferredQuestionIds).toHaveLength(0);\n    expect(resumed.status).toBe("in_progress");

    const answered = recordProductDefinitionAnswer(resumed, question, { value: "Une application web" });
    const previous = answered.answers[0];
    const revised = reviseProductDefinitionAnswer(answered, previous.id, { value: "Une plateforme web" });

    expect(revised.answers).toHaveLength(2);
    expect(revised.answers[1].supersedesId).toBe(previous.id);
    expect(revised.answers[0].value).toBe("Une application web");
  });
});
