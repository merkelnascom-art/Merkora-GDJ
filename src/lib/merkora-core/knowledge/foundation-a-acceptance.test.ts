import { describe, expect, it } from "vitest";
import { createKnowledgeRegistry } from "./registry";
import { matchKnowledgeConcept } from "./matching";
import type { KnowledgeConcept, KnowledgeRelationship } from "./types";

const makeConcept = (
  id: string,
  canonicalKey: string,
  label: string,
  options: Partial<KnowledgeConcept> = {},
): KnowledgeConcept => ({
  id,
  canonicalKey,
  conceptType: "test_concept",
  definitions: [{ language: "fr", label, definition: `Définition de ${label}.` }],
  terms: [{ value: label, language: "fr", kind: "preferred" }],
  classifications: [],
  attributes: [],
  relationships: [],
  scope: { global: true },
  lifecycle: {
    status: "validated",
    version: 1,
    createdAt: "2026-11-15T00:00:00.000Z",
    updatedAt: "2026-11-15T00:00:00.000Z",
  },
  sources: [],
  reliability: { evidenceLevel: "documented", reviewStatus: "reviewed" },
  ...options,
});

describe("Fondation A — intégrité du référentiel", () => {
  it("indexes relations declared on concepts and validates both endpoints", () => {
    const relation: KnowledgeRelationship = {
      id: "relation:actor-activity",
      sourceConceptId: "concept:actor",
      targetConceptId: "concept:activity",
      predicate: "performs",
      status: "validated",
      sourceIds: [],
      version: 1,
    };
    const actor = makeConcept("concept:actor", "actor", "Acteur", {
      relationships: [relation],
    });
    const activity = makeConcept("concept:activity", "activity", "Activité");

    const registry = createKnowledgeRegistry([actor, activity]);

    expect(registry.relationships).toEqual([relation]);
  });

  it("rejects concept-declared relationships with missing endpoints", () => {
    const relation: KnowledgeRelationship = {
      id: "relation:missing",
      sourceConceptId: "concept:actor",
      targetConceptId: "missing:activity",
      predicate: "performs",
      status: "validated",
      sourceIds: [],
      version: 1,
    };
    const actor = makeConcept("concept:actor", "actor", "Acteur", {
      relationships: [relation],
    });

    expect(() => createKnowledgeRegistry([actor])).toThrow(/unknown concept/i);
  });

  it("requires every declared geographic scope dimension to match", () => {
    const local = makeConcept("local:practice", "local.practice", "Pratique locale", {
      scope: { global: false, countries: ["BJ"], jurisdictions: ["BJ-LI"] },
    });
    const registry = createKnowledgeRegistry([local]);

    expect(matchKnowledgeConcept("Pratique locale", registry, { country: "BJ" }).status).toBe("unmatched");
    expect(matchKnowledgeConcept("Pratique locale", registry, {
      country: "BJ",
      jurisdiction: "BJ-AT",
    }).status).toBe("unmatched");
    expect(matchKnowledgeConcept("Pratique locale", registry, {
      country: "BJ",
      jurisdiction: "BJ-LI",
    }).status).toBe("matched");
  });

  it("uses the requested language to distinguish homonymous terms", () => {
    const french = makeConcept("language:fr", "language.fr", "Banc", {
      terms: [{ value: "banc", language: "fr", kind: "preferred" }],
    });
    const english = makeConcept("language:en", "language.en", "Banc", {
      terms: [{ value: "banc", language: "en", kind: "preferred" }],
      definitions: [{ language: "en", label: "Banc", definition: "An English term." }],
    });
    const registry = createKnowledgeRegistry([french, english]);

    const result = matchKnowledgeConcept("banc", registry, { language: "fr" } as never);

    expect(result.status).toBe("matched");
    if (result.status !== "matched") throw new Error("Expected a language-scoped match.");
    expect(result.concept.id).toBe("language:fr");
  });
});
