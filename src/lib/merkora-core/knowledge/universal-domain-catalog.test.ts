import { describe, expect, it } from "vitest";
import {
  UNIVERSAL_DOMAIN_COUNT,
  UNIVERSAL_DOMAIN_FAMILY_COUNT,
  UNIVERSAL_DOMAIN_CONCEPTS,
  UNIVERSAL_FAMILY_CONCEPTS,
} from "./universal-domain-catalog";
import { createUniversalKnowledgeRegistry } from "./registry";

describe("MerKora universal domain map", () => {
  it("contains the complete 20-family and 100-domain navigation scaffold", () => {
    expect(UNIVERSAL_DOMAIN_FAMILY_COUNT).toBe(20);
    expect(UNIVERSAL_DOMAIN_COUNT).toBe(100);
    expect(UNIVERSAL_FAMILY_CONCEPTS).toHaveLength(20);
    expect(UNIVERSAL_DOMAIN_CONCEPTS).toHaveLength(100);
  });

  it("connects every domain to one existing family through a stable classification", () => {
    const registry = createUniversalKnowledgeRegistry();
    const families = new Set(registry.concepts.filter((item) => item.conceptType === "domain_family").map((item) => item.id));
    for (const domain of UNIVERSAL_DOMAIN_CONCEPTS) {
      const parent = domain.classifications.find((item) => item.classificationType === "universal-domain")?.parentConceptId;
      expect(parent, domain.id).toBeTruthy();
      expect(families.has(parent!)).toBe(true);
    }
  });
});
