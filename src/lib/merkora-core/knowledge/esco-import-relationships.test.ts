import { describe, expect, it } from "vitest";
import { createKnowledgeRegistry } from "./registry";
import { importESCOBundle } from "./esco-import";

describe("ESCO hierarchy relationship semantics", () => {
  it("represents a concept's broader parent as a narrower-than relationship", () => {
    const parentUri = "https://data.europa.eu/esco/occupation-group/education";
    const childUri = "https://data.europa.eu/esco/occupation/teacher";
    const result = importESCOBundle(createKnowledgeRegistry([]), {
      datasetVersion: "1.2.1",
      concepts: [
        { uri: parentUri, type: "occupation_group", preferredLabels: { en: "Education professionals" } },
        { uri: childUri, type: "occupation", preferredLabels: { en: "Teacher" }, broaderUri: parentUri },
      ],
    });
    expect(result.registry.relationships).toHaveLength(1);
    expect(result.registry.relationships[0]).toMatchObject({
      sourceConceptId: `esco:occupation:${encodeURIComponent(childUri)}`,
      targetConceptId: `esco:occupation_group:${encodeURIComponent(parentUri)}`,
      predicate: "narrower_than",
    });
  });

  it("rejects domain mappings that point to a family rather than a domain", () => {
    const registry = createKnowledgeRegistry([{
      id: "family:test",
      canonicalKey: "family.test",
      conceptType: "domain_family",
      definitions: [{ language: "en", label: "Family", definition: "Family" }],
      terms: [{ value: "Family", language: "en", kind: "preferred" }],
      classifications: [],
      attributes: [],
      relationships: [],
      scope: { global: true },
      lifecycle: { status: "validated", version: 1, createdAt: "2026-11-15T00:00:00.000Z", updatedAt: "2026-11-15T00:00:00.000Z" },
      sources: [],
      reliability: { evidenceLevel: "documented", reviewStatus: "reviewed" },
    }]);
    expect(() => importESCOBundle(registry, {
      datasetVersion: "1.2.1",
      concepts: [{ uri: "urn:occupation:test", type: "occupation", preferredLabels: { en: "Test" } }],
      domainMappings: { "urn:occupation:test": "family:test" },
    })).toThrow(/must reference a MerKora domain/i);
  });
});
