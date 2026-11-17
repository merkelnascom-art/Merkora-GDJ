import { describe, expect, it } from "vitest";
import type { ProjectUnderstandingItem } from "./project-diagnostic";
import { deriveScreen03Evidence } from "./understanding-quality";

const item = (id: string, value: string, dimension: string = "other"): ProjectUnderstandingItem => ({
  id,
  dimension,
  originalDimension: dimension,
  value,
  status: "validated",
  source: "diagnostic_answer",
  sourceQuote: value,
  sourceMessageId: "message-1",
  createdAt: "2026-11-17T00:00:00.000Z",
});

describe("screen 03 evidence quality", () => {
  it("classifies an activity separately from an imagined interface solution", () => {
    const result = deriveScreen03Evidence([
      item("a", "Je veux organiser un tournoi de Baby foot."),
      item("b", "Je veux organiser un interface façon organigramme."),
    ]);

    expect(result.projectItems.find((entry) => entry.id === "a")?.dimension).toBe("activity");
    expect(result.projectItems.find((entry) => entry.id === "b")?.dimension).toBe("imagined_solution");
  });

  it("classifies a requested working system as a success criterion, not a cause", () => {
    const result = deriveScreen03Evidence([
      item("a", "Bah que le système fonctionne et procède correctement", "causes"),
      item("b", "Bah si il arrive à effectuer les processus de réalisation d'un tournoi", "causes"),
    ]);
    expect(result.projectItems.map((entry) => entry.dimension)).toEqual(["success_criteria", "success_criteria"]);
  });

  it("classifies motivation as motivation and not as a cause", () => {
    const result = deriveScreen03Evidence([item("a", "Je veux juste détendre les jeunes", "causes")]);
    expect(result.projectItems[0]?.dimension).toBe("motivation");
  });

  it("does not treat a conversational reaction as a project outcome", () => {
    const result = deriveScreen03Evidence([item("a", "J'ai déjà dit ça non 🤷🏻‍♂️", "expected_outcome")]);
    expect(result.conversationOnly.map((entry) => entry.id)).toContain("a");
    expect(result.projectItems).toHaveLength(0);
  });

  it("records explicit non-applicability separately from unknown evidence", () => {
    const result = deriveScreen03Evidence([item("a", "Non applicable à ce projet", "other")]);
    expect(result.notApplicable.map((entry) => entry.id)).toContain("a");
    expect(result.projectItems).toHaveLength(0);
  });

  it("keeps an unknown answer separate from project facts", () => {
    const result = deriveScreen03Evidence([{
      ...item("unknown", "Je ne sais pas encore", "expected_outcome"),
      status: "unknown",
    }]);
    expect(result.unknown.map((entry) => entry.id)).toContain("unknown");
    expect(result.projectItems).toHaveLength(0);
  });

  it("deduplicates repeated evidence without deleting its source record", () => {
    const source = [
      item("a", "Tout le monde peut accéder à l'interface sans connexion.", "context"),
      item("b", "Tout le monde peut accéder à l'interface sans connexion.", "constraints"),
    ];
    const result = deriveScreen03Evidence(source);
    expect(result.projectItems).toHaveLength(1);
    expect(result.projectItems[0]?.id).toBe("a");
    expect(source).toHaveLength(2);
  });

  it("does not deduplicate source-less records across independent dimensions", () => {
    const result = deriveScreen03Evidence([
      { ...item("activity", "Information déjà précisée", "activity"), sourceMessageId: undefined, sourceReferenceId: undefined },
      { ...item("actors", "Information déjà précisée", "actors"), sourceMessageId: undefined, sourceReferenceId: undefined },
    ]);
    expect(result.projectItems).toHaveLength(2);
    expect(result.projectItems.map((entry) => entry.dimension)).toEqual(["activity", "actors"]);
  });

  it("keeps the same wording when it was independently stated in another message", () => {
    const result = deriveScreen03Evidence([
      item("a", "Tout le monde peut accéder à l'interface sans connexion.", "constraints"),
      { ...item("b", "Tout le monde peut accéder à l'interface sans connexion.", "constraints"), sourceMessageId: "message-2" },
    ]);
    expect(result.projectItems).toHaveLength(2);
  });

  it("does not merge distinct statements merely because they share a dimension", () => {
    const result = deriveScreen03Evidence([
      item("a", "Il y aura neuf joueurs.", "actors"),
      item("b", "Chaque participant paie mille francs.", "constraints"),
    ]);
    expect(result.projectItems).toHaveLength(2);
  });
});
