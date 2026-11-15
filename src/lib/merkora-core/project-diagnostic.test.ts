import { describe, expect, it } from "vitest";
import { beginUnderstanding } from "./situation-intake-engine";
import {
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
