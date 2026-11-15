import { describe, expect, it } from "vitest";
import { createKnowledgeRegistry } from "./registry";
import { importESCOBundle } from "./esco-import";

describe("ESCO relationship versioning", () => {
  it("revises a stable occupation-skill relationship and archives its previous version", () => {
    const occupationUri = "https://data.europa.eu/esco/occupation/teacher";
    const skillUri = "https://data.europa.eu/esco/skill/pedagogy";
    const concepts = [
      { uri: occupationUri, type: "occupation" as const, preferredLabels: { fr: "Enseignant" } },
      { uri: skillUri, type: "skill" as const, preferredLabels: { fr: "Pédagogie" } },
    ];
    const first = importESCOBundle(createKnowledgeRegistry([]), {
      datasetVersion: "1.2.1",
      importedAt: "2026-11-15T10:00:00.000Z",
      concepts,
      occupationSkillRelations: [{ occupationUri, skillUri, relation: "essential" }],
    });
    const second = importESCOBundle(first.registry, {
      datasetVersion: "1.2.2",
      importedAt: "2026-11-15T11:00:00.000Z",
      concepts,
      occupationSkillRelations: [{ occupationUri, skillUri, relation: "optional" }],
    });

    expect(second.registry.relationships).toHaveLength(1);
    expect(second.registry.relationships[0]).toMatchObject({
      predicate: "may_use_skill",
      version: 2,
    });
    expect(second.registry.relationshipHistory?.[0]).toMatchObject({
      version: 1,
      snapshot: { predicate: "requires_skill", version: 1 },
    });
  });
});
