import { describe, expect, it } from "vitest";
import { beginUnderstanding } from "./situation-intake-engine";
import {
  attachKnowledgeProposalToUnderstanding,
  createDiagnosticSession,
  createProjectUnderstanding,
  getNextDiagnosticQuestion,
  recordDiagnosticAnswer,
  reviseUnderstandingItem,
  reviseDiagnosticAnswer,
  deferDiagnosticQuestion,
  resumeDeferredDiagnosticQuestions,
  validateProjectUnderstanding,
} from "./project-diagnostic";
import { createProjectKnowledgeProposal } from "./knowledge/proposals";
import { createCoreKnowledgeRegistry } from "./knowledge/registry";
import { buildProjectKnowledgeMap } from "./knowledge/universal-project-knowledge";

describe("universal project understanding", () => {
  it("preserves the original narrative and source trace without requiring a sector classification", () => {
    const original = "Je développe un procédé artisanal de réparation textile bioluminescente pour des objets qui n'existent pas encore.";
    const dossier = createProjectUnderstanding(beginUnderstanding(original));

    expect(dossier.originalDescription).toBe(original);
    expect(dossier.items.every((item) => item.sourceMessageId && item.sourceQuote)).toBe(true);
    expect(dossier.activityVocabulary).toContain("open");
    expect(dossier.validationStatus).toBe("in_progress");
  });

  it("keeps a corrected statement as a new version instead of deleting its source", () => {
    const dossier = createProjectUnderstanding(beginUnderstanding("Je veux créer une application expérimentale."));
    const original = dossier.items[0];
    const revised = reviseUnderstandingItem(dossier, original.id, "Je veux concevoir un instrument expérimental.");

    expect(revised.items).toHaveLength(dossier.items.length + 1);
    expect(revised.items.find((item) => item.id === original.id)?.value).toBe(original.value);
    expect(revised.items.at(-1)?.supersedesId).toBe(original.id);
    expect(revised.items.at(-1)?.value).toBe("Je veux concevoir un instrument expérimental.");
  });

  it("validates user-stated elements but never turns hypotheses into facts", () => {
    const dossier = createProjectUnderstanding(beginUnderstanding("Je pense que mon atelier manque de coordination."));
    const validated = validateProjectUnderstanding(dossier);

    expect(validated.items.find((item) => item.status === "hypothesis")?.status).toBe("hypothesis");
    expect(validated.validationStatus).toBe("validated");
  });

  it("keeps unknown knowledge proposals private to their project until explicit review", () => {
    const dossier = createProjectUnderstanding(beginUnderstanding("Je développe une activité expérimentale."));
    const registry = createCoreKnowledgeRegistry();
    const proposal = createProjectKnowledgeProposal({
      projectId: dossier.projectId,
      label: "Activité expérimentale nouvelle",
      language: "und",
      sourceMessageId: "message-private",
      sourceQuote: "Je développe une activité expérimentale nouvelle.",
      createdAt: "2026-11-15T12:00:00.000Z",
    });
    const updated = attachKnowledgeProposalToUnderstanding(dossier, proposal);

    expect(dossier.knowledgeProposals).toEqual([]);
    expect(updated.knowledgeProposals).toEqual([proposal]);
    expect(updated.version).toBe(dossier.version + 1);
    expect(registry.concepts.some((concept) => concept.id === proposal.id)).toBe(false);
    expect(JSON.stringify(registry)).not.toContain(proposal.sourceQuote);
  });

  it("rejects proposals attached to another project and duplicate source proposals", () => {
    const dossier = createProjectUnderstanding(beginUnderstanding("Je développe un projet inédit."));
    const proposal = createProjectKnowledgeProposal({
      projectId: dossier.projectId,
      label: "Concept inédit",
      language: "und",
      sourceMessageId: "message-1",
      sourceQuote: "Concept inédit.",
    });
    const attached = attachKnowledgeProposalToUnderstanding(dossier, proposal);
    const duplicate = createProjectKnowledgeProposal({
      projectId: dossier.projectId,
      label: proposal.label,
      language: "und",
      sourceMessageId: proposal.sourceMessageId,
      sourceQuote: proposal.sourceQuote,
    });

    expect(() => attachKnowledgeProposalToUnderstanding(dossier, { ...proposal, projectId: "other-project" })).toThrow(/own project/i);
    expect(() => attachKnowledgeProposalToUnderstanding(attached, duplicate)).toThrow(/already been proposed/i);
  });

  it("attaches a non-authoritative knowledge map and refreshes it after each answer", () => {
    const dossier = createProjectUnderstanding(beginUnderstanding("Je veux gérer les rendez-vous d'un salon de coiffure."));
    expect(dossier.knowledgeMap).toBeDefined();
    const diagnostic = createDiagnosticSession(dossier);
    const first = getNextDiagnosticQuestion(dossier, diagnostic)!;
    const result = recordDiagnosticAnswer(dossier, diagnostic, first, { value: "gestion des rendez-vous d'un salon de coiffure" });
    expect(result.understanding.knowledgeMap).toBeDefined();
    expect(result.understanding.knowledgeMap?.automaticDecisions).toEqual([]);
  });

  it("asks family-specific follow-up questions only after a family is lexically supported", () => {
    const base = createProjectUnderstanding(beginUnderstanding("Je veux améliorer le fonctionnement d'un club sportif."));
    const items = [
      ...base.items,
      { id:"sport-activity",dimension:"activity",originalDimension:"activity",value:"arbitrage d'un match",status:"user_stated",source:"conversation",sourceQuote:"arbitrage d'un match",createdAt:"2026-11-17T00:00:00.000Z" },
      { id:"sport-context",dimension:"current_situation",originalDimension:"current_situation",value:"un club sportif organise des matchs",status:"user_stated",source:"conversation",sourceQuote:"un club sportif organise des matchs",createdAt:"2026-11-17T00:00:00.000Z" },
    ];
    const dossier = { ...base, items, knowledgeMap: buildProjectKnowledgeMap(items) };
    const diagnostic = { ...createDiagnosticSession(dossier), askedQuestionIds:[
      "activity-context","current-situation","project-motivation","problem-description","expected-outcome","people-and-roles","operations-and-flow"
    ] };
    const next = getNextDiagnosticQuestion(dossier, diagnostic);
    expect(next?.id).toContain("family-context-family:sport-physical-activity");
    expect(next?.prompt).toMatch(/discipline|catégories d'âge/i);
  });
});

describe("adaptive universal diagnostic", () => {
  it("asks one open-vocabulary question at a time for an unlisted activity", () => {
    const dossier = createProjectUnderstanding(beginUnderstanding("Je développe un procédé artisanal de réparation textile bioluminescente."));
    const diagnostic = createDiagnosticSession(dossier);
    const question = getNextDiagnosticQuestion(dossier, diagnostic);

    expect(question).not.toBeNull();
    expect(question?.id).toBe("activity-context");
    expect(question?.prompt).not.toMatch(/commerce|santé|éducation|agriculture/i);
  });

  it("records an answer as traceable evidence and advances to a different question", () => {
    const dossier = createProjectUnderstanding(beginUnderstanding("Je développe un procédé artisanal de réparation textile bioluminescente."));
    const diagnostic = createDiagnosticSession(dossier);
    const first = getNextDiagnosticQuestion(dossier, diagnostic);
    if (!first) throw new Error("Expected a first diagnostic question.");

    const result = recordDiagnosticAnswer(dossier, diagnostic, first, { value: "Je transforme des fibres expérimentales dans un atelier partagé." });
    const next = getNextDiagnosticQuestion(result.understanding, result.diagnostic);

    expect(result.understanding.items.some((item) => item.dimension === "activity" && item.value.includes("fibres expérimentales"))).toBe(true);
    expect(result.diagnostic.answers).toHaveLength(1);
    expect(next?.id).not.toBe(first.id);
  });








  it("clarifies unresolved references before continuing with generic questions", () => {
    const base = createProjectUnderstanding(beginUnderstanding("Je développe une activité nouvelle."));
    const dossier = { ...base, unresolvedQuestions: ["Préciser la référence « elle »." ] };
    const diagnostic = createDiagnosticSession(dossier);
    const question = getNextDiagnosticQuestion(dossier, diagnostic);

    expect(question?.id).toBe("unresolved-reference-0");
    expect(question?.prompt).toContain("Peux-tu préciser la référence");
  });

  it("treats the explicit 'I don't know yet' option as unknown rather than as a fact", () => {
    const dossier = createProjectUnderstanding(beginUnderstanding("Je développe une activité expérimentale."));
    const diagnostic = createDiagnosticSession(dossier);
    const question = getNextDiagnosticQuestion(dossier, diagnostic);
    if (!question) throw new Error("Expected a diagnostic question.");
    const result = recordDiagnosticAnswer(dossier, diagnostic, question, { value: "Je ne sais pas encore" });

    expect(result.diagnostic.answers[0].status).toBe("unknown");
    expect(result.diagnostic.deferredQuestionIds).toContain(question.id);
    expect(result.understanding.items.at(-1)?.status).toBe("unknown");
  });

  it("asks for the concrete difficulty after the user chooses a problem-solving motivation", () => {
    const base = createProjectUnderstanding(beginUnderstanding("Je veux explorer une nouvelle activité."));
    const dossier = {
      ...base,
      items: [
        ...base.items,
        { id: "activity-known", dimension: "activity" as const, originalDimension: "activity", value: "Une nouvelle activité", status: "user_stated" as const, source: "conversation" as const, sourceQuote: "Une nouvelle activité", createdAt: "2026-11-15T00:00:00.000Z" },
        { id: "situation-known", dimension: "current_situation" as const, originalDimension: "current_situation", value: "Elle existe déjà", status: "user_stated" as const, source: "conversation" as const, sourceQuote: "Elle existe déjà", createdAt: "2026-11-15T00:00:00.000Z" },
      ],
    };
    const diagnostic = createDiagnosticSession(dossier);
    const motivation = getNextDiagnosticQuestion(dossier, diagnostic);
    expect(motivation?.id).toBe("project-motivation");
    if (!motivation) throw new Error("Expected a motivation question.");
    const result = recordDiagnosticAnswer(dossier, diagnostic, motivation, { value: "Résoudre une difficulté" });
    expect(getNextDiagnosticQuestion(result.understanding, result.diagnostic)?.id).toBe("problem-description");
  });

  it("carries apparent contradictions into the diagnostic and records an explicit resolution", () => {
    const base = beginUnderstanding("Je prépare un projet avec deux règles à clarifier.");
    const session = {
      ...base,
      contradictions: [{
        topic: "access",
        statementA: "L'accès doit être sans compte.",
        statementB: "Chaque utilisateur doit créer un compte.",
        question: "L'accès doit-il être possible sans compte, ou le compte est-il obligatoire ?",
        confirmationRequired: true,
      }],
    };
    const dossier = createProjectUnderstanding(session);
    const diagnostic = createDiagnosticSession(dossier);
    const question = getNextDiagnosticQuestion(dossier, diagnostic);

    expect(question?.resolvesContradictionId).toBe(dossier.contradictions[0].id);
    if (!question) throw new Error("Expected a contradiction-resolution question.");
    const result = recordDiagnosticAnswer(dossier, diagnostic, question, { value: "Les deux s'appliquent dans des contextes différents" });

    expect(result.understanding.contradictions[0].status).toBe("resolved");
    expect(getNextDiagnosticQuestion(result.understanding, result.diagnostic)?.resolvesContradictionId).toBeUndefined();
  });

  it("keeps an unknown contradiction unresolved and makes it resumable", () => {
    const base = beginUnderstanding("Je prépare un projet avec deux règles à clarifier.");
    const session = {
      ...base,
      contradictions: [{
        topic: "access",
        statementA: "L'accès doit être sans compte.",
        statementB: "Chaque utilisateur doit créer un compte.",
        question: "L'accès doit-il être possible sans compte, ou le compte est-il obligatoire ?",
        confirmationRequired: true,
      }],
    };
    const dossier = createProjectUnderstanding(session);
    const diagnostic = createDiagnosticSession(dossier);
    const question = getNextDiagnosticQuestion(dossier, diagnostic);
    if (!question) throw new Error("Expected a contradiction-resolution question.");
    const result = recordDiagnosticAnswer(dossier, diagnostic, question, { value: "Je ne sais pas encore", status: "unknown" });

    expect(result.understanding.contradictions[0].status).toBe("deferred");
    expect(getNextDiagnosticQuestion(result.understanding, result.diagnostic)?.resolvesContradictionId).toBeUndefined();
    const resumed = resumeDeferredDiagnosticQuestions(result.diagnostic);
    expect(getNextDiagnosticQuestion(result.understanding, resumed)?.resolvesContradictionId).toBe(result.understanding.contradictions[0].id);
  });

  it("asks for local jurisdiction and languages only when the project signals those needs", () => {
    const base = createProjectUnderstanding(beginUnderstanding(
      "Je conçois un service soumis aux règles sur les données personnelles dans plusieurs pays et disponible en plusieurs langues."
    ));
    const dimensions = ["activity", "current_situation", "motivation", "expected_outcome", "actors", "operations", "constraints", "resources", "success_criteria"] as const;
    const dossier = {
      ...base,
      items: [
        ...base.items,
        ...dimensions.map((dimension, index) => ({
          id: "known-" + index,
          dimension,
          originalDimension: dimension,
          value: "Information déjà précisée",
          status: "user_stated" as const,
          source: "conversation" as const,
          sourceQuote: "Information déjà précisée",
          createdAt: "2026-11-15T00:00:00.000Z",
        })),
      ],
    };
    const diagnostic = createDiagnosticSession(dossier);
    const jurisdiction = getNextDiagnosticQuestion(dossier, diagnostic);
    expect(jurisdiction?.id).toBe("jurisdiction-context");
    if (!jurisdiction) throw new Error("Expected a jurisdiction question.");
    const withJurisdiction = recordDiagnosticAnswer(dossier, diagnostic, jurisdiction, { value: "Bénin et France, selon les opérations." });
    const languages = getNextDiagnosticQuestion(withJurisdiction.understanding, withJurisdiction.diagnostic);
    expect(languages?.id).toBe("language-context");
  });

  it("lets the user resume questions that were deferred earlier", () => {
    const dossier = createProjectUnderstanding(beginUnderstanding("Je développe un procédé expérimental."));
    const diagnostic = createDiagnosticSession(dossier);
    const first = getNextDiagnosticQuestion(dossier, diagnostic);
    if (!first) throw new Error("Expected a first diagnostic question.");
    const deferred = deferDiagnosticQuestion(diagnostic, first);

    expect(getNextDiagnosticQuestion(dossier, deferred)?.id).not.toBe(first.id);
    const resumed = resumeDeferredDiagnosticQuestions(deferred);

    expect(resumed.deferredQuestionIds).toEqual([]);
    expect(getNextDiagnosticQuestion(dossier, resumed)?.id).toBe(first.id);
  });

  it("revises a previous answer without deleting its earlier version", () => {
    const dossier = createProjectUnderstanding(beginUnderstanding("Je veux explorer une idée nouvelle."));
    const diagnostic = createDiagnosticSession(dossier);
    const first = getNextDiagnosticQuestion(dossier, diagnostic);
    if (!first) throw new Error("Expected a first diagnostic question.");
    const initial = recordDiagnosticAnswer(dossier, diagnostic, first, { value: "Une nouvelle activité expérimentale." });
    const revised = reviseDiagnosticAnswer(initial.understanding, initial.diagnostic, initial.diagnostic.answers[0].id, {
      value: "Une activité de recherche expérimentale.",
      detail: "La démarche est encore exploratoire.",
    });

    expect(revised.diagnostic.answers).toHaveLength(2);
    expect(revised.diagnostic.answers[1].supersedesId).toBe(initial.diagnostic.answers[0].id);
    expect(revised.diagnostic.answers[0].value).toBe("Une nouvelle activité expérimentale.");
    expect(revised.understanding.items.at(-1)?.value).toContain("recherche expérimentale");
  });

  it("supports a choice plus optional explanation and retains the explanation", () => {
    const base = createProjectUnderstanding(beginUnderstanding("Je veux explorer une idée nouvelle."));
    const dossier = {
      ...base,
      items: [
        ...base.items,
        { id: "activity-1", dimension: "activity" as const, originalDimension: "activity", value: "Exploration d'une idée nouvelle", status: "user_stated" as const, source: "conversation" as const, sourceQuote: "Exploration d'une idée nouvelle", createdAt: new Date().toISOString() },
        { id: "situation-1", dimension: "current_situation" as const, originalDimension: "current_situation", value: "Projet encore au stade de l'idée", status: "user_stated" as const, source: "conversation" as const, sourceQuote: "Projet encore au stade de l'idée", createdAt: new Date().toISOString() },
      ],
    };
    const diagnostic = createDiagnosticSession(dossier);
    const first = getNextDiagnosticQuestion(dossier, diagnostic);
    if (!first) throw new Error("Expected a diagnostic question.");

    expect(first.answerType).toBe("single_choice");
    const result = recordDiagnosticAnswer(dossier, diagnostic, first, {
      value: "Autre",
      detail: "Il s'agit d'une activité qui n'a pas encore de nom reconnu.",
    });

    expect(result.diagnostic.answers[0].detail).toContain("pas encore de nom reconnu");
    expect(result.understanding.items.at(-1)?.source).toBe("diagnostic_answer");
  });
});
