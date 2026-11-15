import { describe, expect, it } from "vitest";
import {
  createCoreKnowledgeRegistry,
  createKnowledgeRegistry,
  getKnowledgeConcept,
} from "./registry";
import { normalizeKnowledgeTerm } from "./normalization";

describe("universal knowledge registry", () => {
  it("normalizes Unicode, accents, case and repeated whitespace without changing stored source terms", () => {
    expect(normalizeKnowledgeTerm("  ÉNERGIE   solaire  ")).toBe("energie solaire");
    expect(normalizeKnowledgeTerm("l’énergie renouvelable")).toBe("l'energie renouvelable");
  });

  it("provides language-independent universal concepts with French and English definitions", () => {
    const registry = createCoreKnowledgeRegistry();
    const activity = getKnowledgeConcept(registry, "core:activity");

    expect(activity?.canonicalKey).toBe("universal-type:activity");
    expect(activity?.definitions).toEqual(expect.arrayContaining([
      expect.objectContaining({ language: "fr", label: "Activité" }),
      expect.objectContaining({ language: "en", label: "Activity" }),
    ]));
    expect(registry.concepts.length).toBeGreaterThan(10);
  });

  it("accepts new open-vocabulary concept types without changing a closed enum", () => {
    const registry = createKnowledgeRegistry([{
      id: "custom:concept-1",
      canonicalKey: "custom:bioluminescent-textile-repair",
      conceptType: "emerging_practice",
      definitions: [{ language: "fr", label: "Réparation textile bioluminescente", definition: "Pratique expérimentale définie dans son contexte." }],
      terms: [{ value: "réparation textile bioluminescente", language: "fr", kind: "preferred" }],
      classifications: [],
      attributes: [],
      relationships: [],
      scope: { global: false },
      lifecycle: { status: "proposed", version: 1, createdAt: "2026-11-15T00:00:00.000Z", updatedAt: "2026-11-15T00:00:00.000Z" },
      sources: [],
      reliability: { evidenceLevel: "unverified", reviewStatus: "not_reviewed" },
    }]);

    expect(registry.concepts[0].conceptType).toBe("emerging_practice");
    expect(getKnowledgeConcept(registry, "custom:concept-1")?.canonicalKey).toBe("custom:bioluminescent-textile-repair");
  });

  it("rejects duplicate stable identifiers and canonical keys", () => {
    const concept = createCoreKnowledgeRegistry().concepts[0];

    expect(() => createKnowledgeRegistry([concept, { ...concept, id: "another-id" }])).toThrow(/canonical/i);
    expect(() => createKnowledgeRegistry([concept, { ...concept, canonicalKey: "another-key" }])).toThrow(/identifier/i);
  });
});
