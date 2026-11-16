import { describe, expect, it } from "vitest";
import { createUniversalKnowledgeRegistry } from "./registry";
import { matchKnowledgeConcept } from "./matching";
import { getClassificationLineage } from "./classification-graph";
import {
  AGRICULTURE_AGROFOOD_FAMILY,
  AGRICULTURE_AGROFOOD_DOMAINS,
  AGRICULTURE_AGROFOOD_SUBDOMAINS,
  AGRICULTURE_AGROFOOD_CATALOG,
} from "./agriculture-agrofood-catalog";

describe("Fondation A — famille 01 Agriculture et agroalimentaire", () => {
  const registry = createUniversalKnowledgeRegistry();

  it("intègre la famille et ses cinq domaines canoniques dans le registre universel", () => {
    expect(registry.concepts.some((item) => item.id === AGRICULTURE_AGROFOOD_FAMILY.id)).toBe(true);
    expect(AGRICULTURE_AGROFOOD_DOMAINS).toHaveLength(5);

    for (const domain of AGRICULTURE_AGROFOOD_DOMAINS) {
      const registered = registry.concepts.find((item) => item.id === domain.id);
      expect(registered, domain.id).toBeDefined();
      expect(
        registered?.classifications.some(
          (item) => item.classificationType === "foundation-a-agriculture-v1" &&
            item.parentConceptId === AGRICULTURE_AGROFOOD_FAMILY.id,
        ),
      ).toBe(true);
    }
  });

  it("raccorde chaque sous-domaine à un domaine existant", () => {
    const domainIds = new Set(AGRICULTURE_AGROFOOD_DOMAINS.map((item) => item.id));
    expect(AGRICULTURE_AGROFOOD_SUBDOMAINS.length).toBeGreaterThanOrEqual(20);

    for (const subdomain of AGRICULTURE_AGROFOOD_SUBDOMAINS) {
      expect(
        subdomain.classifications.some(
          (item) => item.classificationType === "foundation-a-agriculture-v1" &&
            item.parentConceptId && domainIds.has(item.parentConceptId),
        ),
      ).toBe(true);
      expect(registry.concepts.some((item) => item.id === subdomain.id)).toBe(true);
    }
  });

  it("fournit des connaissances métier au-delà des seuls noms de domaines", () => {
    const types = new Set(AGRICULTURE_AGROFOOD_CATALOG.map((item) => item.conceptType));
    for (const type of ["occupation", "activity", "process", "problem", "resource", "function", "indicator"]) {
      expect(types.has(type), type).toBe(true);
    }
  });

  it("reconnaît les expressions agricoles françaises et conserve les variantes lexicales", () => {
    const terms = AGRICULTURE_AGROFOOD_CATALOG.flatMap((item) => item.terms.map((term) => term.value.toLocaleLowerCase("fr")));
    expect(terms).toContain("maraîchage");
    expect(terms).toContain("intrants agricoles");
    expect(terms).toContain("post-récolte");
    expect(terms).toContain("coopérative agricole");
  });

  it("permet de remonter de la spécialité au domaine puis à la famille", () => {
    const lineage = getClassificationLineage(
      registry,
      "specialization-v2:organic-farming",
      "foundation-a-agriculture-v1",
    );
    expect(lineage.map((item) => item.id)).toEqual([
      AGRICULTURE_AGROFOOD_FAMILY.id,
      "domain-v2:crop-production",
      "subdomain-v2:field-crops",
      "specialization-v2:organic-farming",
    ]);
  });

  it("rend les termes de la famille recherchables par le moteur lexical", () => {
    const result = matchKnowledgeConcept("maraîchage", registry, { language: "fr" });
    expect(result.status).toBe("matched");
    if (result.status !== "matched") throw new Error("Expected the market-gardening concept.");
    expect(result.concept.id).toBe("subdomain-v2:market-gardening");
  });

  it("ne remplace pas les concepts historiques déjà présents", () => {
    expect(registry.concepts.some((item) => item.id === "family:agriculture-living")).toBe(true);
    expect(registry.concepts.some((item) => item.id === "domain:agriculture")).toBe(true);
    expect(registry.concepts.some((item) => item.id === "domain:food-production")).toBe(true);
  });

  it("ne publie pas de relations orphelines", () => {
    const conceptIds = new Set(registry.concepts.map((item) => item.id));
    for (const relation of registry.relationships) {
      expect(conceptIds.has(relation.sourceConceptId), relation.id).toBe(true);
      expect(conceptIds.has(relation.targetConceptId), relation.id).toBe(true);
    }
  });
});
