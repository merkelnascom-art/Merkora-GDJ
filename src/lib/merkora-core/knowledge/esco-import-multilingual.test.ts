import { describe, expect, it } from "vitest";
import { createUniversalKnowledgeRegistry } from "./registry";
import { importESCOBundle } from "./esco-import";

const occupationUri = "https://data.europa.eu/esco/occupation/occupation-001";

describe("multilingual ESCO imports", () => {
  it("merges language packs for the same stable occupation URI and archives the prior version", () => {
    const initial = createUniversalKnowledgeRegistry();
    const french = importESCOBundle(initial, {
      datasetVersion: "v1.2.1",
      importedAt: "2026-11-15T10:00:00.000Z",
      concepts: [{
        uri: occupationUri,
        type: "occupation",
        preferredLabels: { fr: "Développeur logiciel" },
        alternativeLabels: { fr: ["Programmeur"] },
        descriptions: { fr: "Conçoit des logiciels." },
      }],
    });
    const english = importESCOBundle(french.registry, {
      datasetVersion: "v1.2.1",
      importedAt: "2026-11-15T11:00:00.000Z",
      concepts: [{
        uri: occupationUri,
        type: "occupation",
        preferredLabels: { en: "Software developer" },
        alternativeLabels: { en: ["Software programmer"] },
        descriptions: { en: "Designs software." },
      }],
    });

    const concept = english.registry.concepts.find((item) =>
      item.externalMappings?.some((mapping) => mapping.externalId === occupationUri),
    );

    expect(concept?.definitions.map((item) => item.language).sort()).toEqual(["en", "fr"]);
    expect(concept?.terms.some((term) => term.value === "Programmeur" && term.language === "fr")).toBe(true);
    expect(concept?.terms.some((term) => term.value === "Software programmer" && term.language === "en")).toBe(true);
    expect(concept?.lifecycle.version).toBe(2);
    expect(english.registry.conceptHistory.some((item) => item.id === concept?.id && item.lifecycle.version === 1)).toBe(true);
  });

  it("does not create duplicate language terms when the same ESCO pack is imported twice", () => {
    const first = importESCOBundle(createUniversalKnowledgeRegistry(), {
      datasetVersion: "v1.2.1",
      concepts: [{ uri: occupationUri, type: "occupation", preferredLabels: { fr: "Comptable" } }],
    });
    const second = importESCOBundle(first.registry, {
      datasetVersion: "v1.2.1",
      concepts: [{ uri: occupationUri, type: "occupation", preferredLabels: { fr: "Comptable" } }],
    });
    const concept = second.registry.concepts.find((item) => item.externalMappings?.some((mapping) => mapping.externalId === occupationUri));
    expect(concept?.lifecycle.version).toBe(1);
    expect(concept?.terms.filter((term) => term.value === "Comptable" && term.language === "fr")).toHaveLength(1);
  });
});
