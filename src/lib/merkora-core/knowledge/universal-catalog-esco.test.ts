import { describe, expect, it } from "vitest";
import { createKnowledgeRegistry } from "./registry";
import { importESCOBundle } from "./esco-import";
import { UNIVERSAL_DOMAIN_COUNT, UNIVERSAL_FAMILY_COUNT } from "./universal-domain-catalog";
import { createUniversalKnowledgeRegistry } from "./registry";
import { getClassificationLineage } from "./classification-graph";

describe("universal domain catalogue and ESCO import", () => {
  it("provides exactly 20 open families and 100 domain concepts", () => {
    expect(UNIVERSAL_FAMILY_COUNT).toBe(20);
    expect(UNIVERSAL_DOMAIN_COUNT).toBe(100);
  });

  it("navigates a domain to its family through the canonical classification tree", () => {
    const registry = createUniversalKnowledgeRegistry();
    const lineage = getClassificationLineage(registry, "domain:agriculture", "universal-domain");
    expect(lineage.map((item) => item.id)).toEqual(["family:agriculture-living", "domain:agriculture"]);
  });

  it("imports multilingual occupation and skill concepts with their source identities", () => {
    const result = importESCOBundle(createKnowledgeRegistry([]), {
      datasetVersion: "1.2.1",
      importedAt: "2026-11-15T12:00:00.000Z",
      concepts: [
        { uri: "https://data.europa.eu/esco/occupation/teacher", type: "occupation",
          preferredLabels: { fr: "Enseignant", en: "Teacher", es: "Docente" },
          alternativeLabels: { fr: ["Professeur"] }, descriptions: { fr: "Profession d'enseignement." } },
        { uri: "https://data.europa.eu/esco/skill/pedagogy", type: "skill",
          preferredLabels: { fr: "Pédagogie", en: "Pedagogy" } },
      ],
      occupationSkillRelations: [{
        occupationUri: "https://data.europa.eu/esco/occupation/teacher",
        skillUri: "https://data.europa.eu/esco/skill/pedagogy",
        relation: "essential",
      }],
    });
    const teacher = result.registry.concepts.find((item) => item.conceptType === "occupation");
    expect(teacher?.terms.map((term) => term.language)).toContain("es");
    expect(teacher?.terms.find((term) => term.value === "Professeur")?.kind).toBe("synonym");
    expect(teacher?.externalMappings?.[0].datasetVersion).toBe("1.2.1");
    expect(result.registry.relationships[0].predicate).toBe("requires_skill");
  });

  it("is idempotent for an already imported ESCO external URI", () => {
    const bundle = {
      datasetVersion: "1.2.1",
      concepts: [{ uri: "urn:esco:occupation:test", type: "occupation" as const, preferredLabels: { fr: "Test" } }],
    };
    const first = importESCOBundle(createKnowledgeRegistry([]), bundle);
    const second = importESCOBundle(first.registry, bundle);
    expect(second.importedConceptIds).toHaveLength(0);
    expect(second.skippedExistingUris).toEqual(["urn:esco:occupation:test"]);
    expect(second.registry.concepts).toHaveLength(1);
  });
});
