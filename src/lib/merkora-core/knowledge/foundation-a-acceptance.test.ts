import { describe, expect, it } from "vitest";
import { createKnowledgeRegistry, reviseKnowledgeConcept } from "./registry";
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

    const result = matchKnowledgeConcept("banc", registry, { language: "fr" });

    expect(result.status).toBe("matched");
    if (result.status !== "matched") throw new Error("Expected a language-scoped match.");
    expect(result.concept.id).toBe("language:fr");
  });

  it("archives the previous concept version and rejects stale concurrent revisions", () => {
    const original = makeConcept("concept:career", "career", "Métier");
    const registry = createKnowledgeRegistry([original]);
    const revised = reviseKnowledgeConcept(
      registry,
      "concept:career",
      1,
      {
        definitions: [{ language: "fr", label: "Profession", definition: "Activité professionnelle exercée." }],
      },
      "2026-11-15T12:00:00.000Z",
    );

    expect(revised.concepts[0].lifecycle.version).toBe(2);
    expect(revised.concepts[0].definitions[0].label).toBe("Profession");
    expect(revised.conceptHistory).toHaveLength(1);
    expect(revised.conceptHistory[0].lifecycle.version).toBe(1);
    expect(revised.conceptHistory[0].definitions[0].label).toBe("Métier");
    expect(() => reviseKnowledgeConcept(revised, "concept:career", 1, {})).toThrow(/version conflict/i);
  });

  it("rejects classifications that point to concepts outside the registry", () => {
    const classified = makeConcept("concept:child", "child", "Sous-concept", {
      classifications: [{ classificationType: "broader", parentConceptId: "missing:parent" }],
    });

    expect(() => createKnowledgeRegistry([classified])).toThrow(/unknown parent concept/i);
  });

  it("rejects relationship confidence values outside the probability interval", () => {
    const actor = makeConcept("concept:actor", "actor", "Acteur");
    const activity = makeConcept("concept:activity", "activity", "Activité");
    const invalidRelation: KnowledgeRelationship = {
      id: "relation:invalid-confidence",
      sourceConceptId: actor.id,
      targetConceptId: activity.id,
      predicate: "performs",
      status: "validated",
      confidence: 1.4,
      sourceIds: [],
      version: 1,
    };

    expect(() => createKnowledgeRegistry([actor, activity], [invalidRelation])).toThrow(/confidence/i);
  });

  it("keeps registry snapshots independent from mutable input objects", () => {
    const source = makeConcept("concept:mutable", "mutable", "Terme d'origine", {
      terms: [{ value: "Terme d'origine", language: "fr", kind: "preferred" }],
      scope: { global: false, countries: ["BJ"] },
    });
    const registry = createKnowledgeRegistry([source]);

    source.terms[0].value = "Terme modifié";
    source.scope.countries?.push("TG");

    expect(registry.concepts[0].terms[0].value).toBe("Terme d'origine");
    expect(registry.concepts[0].scope.countries).toEqual(["BJ"]);
  });

  it("replaces a concept's outgoing relation only through a new version", () => {
    const originalRelation: KnowledgeRelationship = {
      id: "relation:actor-performs-activity",
      sourceConceptId: "concept:actor",
      targetConceptId: "concept:activity",
      predicate: "performs",
      status: "validated",
      sourceIds: [],
      version: 1,
    };
    const actor = makeConcept("concept:actor", "actor", "Acteur", {
      relationships: [originalRelation],
    });
    const activity = makeConcept("concept:activity", "activity", "Activité");
    const registry = createKnowledgeRegistry([actor, activity]);
    const revisedRelation = { ...originalRelation, predicate: "coordinates" };

    const revised = reviseKnowledgeConcept(
      registry,
      actor.id,
      1,
      { relationships: [revisedRelation] },
    );

    expect(revised.relationships).toHaveLength(1);
    expect(revised.relationships[0].predicate).toBe("coordinates");
    expect(revised.conceptHistory[0].relationships[0].predicate).toBe("performs");
  });
});
