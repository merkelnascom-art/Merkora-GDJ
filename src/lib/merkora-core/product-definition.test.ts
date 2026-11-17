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
      description: "Créer un projet dans le domaine agricole.",
      familyId: "family:agriculture-agrofood",
    });
    const next = getNextProductDefinitionQuestion(project, createProductDefinitionSession(project));

    expect(next?.prompt).toMatch(/cultures|productions végétales|saisons|agroalimentaires/i);
    expect(next?.prompt).not.toMatch(/joueurs|tournoi|commandes|clients|ventes/i);
  });

  it("uses education knowledge for an educational project without inheriting another sector's questions", () => {
    const project = dossier({
      description: "Créer un projet dans le domaine de l'éducation.",
      familyId: "family:education-research",
    });
    const next = getNextProductDefinitionQuestion(project, createProductDefinitionSession(project));

    expect(next?.prompt).toMatch(/apprenants|niveaux|disciplines|parcours/i);
    expect(next?.prompt).not.toMatch(/joueurs|récoltes|paiements/i);
  });

  it("does not force an irrelevant family and can finish when no useful question remains", () => {
    const project = dossier({
      description: "Un projet libre sans besoin de fonctions numériques, de finance ou d'identité visuelle.",
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



  it("asks a targeted clarification when the domain is ambiguous, then uses the selected domain", () => {
    const project = dossier({ description: "Je veux lancer un projet entre agriculture et éducation." });
    project.knowledgeMap = {
      ...project.knowledgeMap!,
      needsFamilyClarification: true,
      familyCandidates: [
        { familyId: "family:agriculture-agrofood", labelFr: "Agriculture", labelEn: "Agriculture", confidence: 0.6, evidenceCount: 1 },
        { familyId: "family:education-research", labelFr: "Éducation", labelEn: "Education", confidence: 0.5, evidenceCount: 1 },
      ],
    };
    const session = createProductDefinitionSession(project);
    const clarification = getNextProductDefinitionQuestion(project, session);

    expect(clarification?.id).toBe("domain-scope-clarification");
    expect(clarification?.options).toContain("Agriculture");
    if (!clarification) return;

    const selected = recordProductDefinitionAnswer(session, clarification, { value: ["Agriculture"] });
    const next = getNextProductDefinitionQuestion(project, selected);

    expect(next?.domainFamilyId).toBe("family:agriculture-agrofood");
    expect(next?.prompt).toMatch(/cultures|productions végétales|saisons|agroalimentaires/i);
  });

  it("uses an earlier answer to unlock relevant questions instead of staying in a generic path", () => {
    const project = dossier({ description: "Créer un outil de suivi." });
    const session = createProductDefinitionSession(project);
    const natureQuestion = getNextProductDefinitionQuestion(project, session);
    expect(natureQuestion?.id).toBe("product-nature");
    if (!natureQuestion) return;

    const answered = recordProductDefinitionAnswer(session, natureQuestion, { value: "Une plateforme ou un logiciel" });
    const next = getNextProductDefinitionQuestion(project, answered);

    expect(next?.familyId).toBe("users_roles");
    expect(next?.id).not.toBe("product-nature");
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
    expect(resumed.deferredQuestionIds).toHaveLength(0);
    expect(resumed.status).toBe("in_progress");

    const answered = recordProductDefinitionAnswer(resumed, question, { value: "Une application web" });
    const previous = answered.answers[0];
    const revised = reviseProductDefinitionAnswer(answered, previous.id, { value: "Une plateforme web" });

    expect(revised.answers).toHaveLength(2);
    expect(revised.answers[1].supersedesId).toBe(previous.id);
    expect(revised.answers[0].value).toBe("Une application web");
  });
});
