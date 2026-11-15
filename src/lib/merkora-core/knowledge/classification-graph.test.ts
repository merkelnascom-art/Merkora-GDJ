import { describe, expect, it } from "vitest";
import { createKnowledgeRegistry } from "./registry";
import { getClassificationLineage, getClassificationDescendants } from "./classification-graph";
import type { KnowledgeConcept } from "./types";

function concept(id: string, parentConceptId?: string): KnowledgeConcept {
  return {
    id,
    canonicalKey: id,
    conceptType: "domain",
    definitions: [{ language: "fr", label: id, definition: id }],
    terms: [{ value: id, language: "fr", kind: "preferred" }],
    classifications: [{ classificationType: "domain-tree", ...(parentConceptId ? { parentConceptId } : {}) }],
    attributes: [],
    relationships: [],
    scope: { global: true },
    lifecycle: { status: "validated", version: 1, createdAt: "2026-11-15T00:00:00.000Z", updatedAt: "2026-11-15T00:00:00.000Z" },
    sources: [],
    reliability: { evidenceLevel: "documented", reviewStatus: "reviewed" },
  };
}

describe("classification graph navigation", () => {
  const registry = createKnowledgeRegistry([
    concept("family"),
    concept("domain-a", "family"),
    concept("specialty-a1", "domain-a"),
    concept("specialty-a2", "domain-a"),
    concept("domain-b", "family"),
  ]);

  it("returns the complete root-to-node lineage in stable order", () => {
    expect(getClassificationLineage(registry, "specialty-a1", "domain-tree").map((item) => item.id))
      .toEqual(["family", "domain-a", "specialty-a1"]);
  });

  it("returns every descendant once, without including the starting concept", () => {
    expect(getClassificationDescendants(registry, "family", "domain-tree").map((item) => item.id))
      .toEqual(["domain-a", "specialty-a1", "specialty-a2", "domain-b"]);
  });

  it("returns an empty lineage for an unknown concept and does not cross classification types", () => {
    expect(getClassificationLineage(registry, "missing", "domain-tree")).toEqual([]);
    expect(getClassificationDescendants(registry, "family", "occupation-tree")).toEqual([]);
  });

  it("rejects cyclic classification parent chains when creating a registry", () => {
    expect(() => createKnowledgeRegistry([
      concept("cycle-a", "cycle-b"),
      concept("cycle-b", "cycle-a"),
    ])).toThrow(/classification cycle/i);
  });
});
