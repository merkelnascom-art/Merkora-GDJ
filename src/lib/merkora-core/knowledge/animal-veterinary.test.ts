import { describe, expect, it } from "vitest";
import { createUniversalKnowledgeRegistry } from "./registry";
import { matchKnowledgeConcept } from "./matching";
import { getClassificationLineage } from "./classification-graph";
import {
  ANIMAL_VETERINARY_FAMILY,
  ANIMAL_VETERINARY_DOMAINS,
  ANIMAL_VETERINARY_SUBDOMAINS,
  ANIMAL_VETERINARY_CATALOG,
  ANIMAL_VETERINARY_RELATIONSHIPS,
} from "./animal-veterinary-catalog";

describe("Fondation A — famille 02 Animaux et médecine vétérinaire", () => {
  const registry = createUniversalKnowledgeRegistry();

  it("intègre la famille et ses domaines dans le registre universel sans dupliquer le domaine élevage existant", () => {
    expect(registry.concepts.some((item) => item.id === ANIMAL_VETERINARY_FAMILY.id)).toBe(true);
    expect(ANIMAL_VETERINARY_DOMAINS.length).toBe(5);
    expect(registry.concepts.filter((item) => item.id === "domain:livestock")).toHaveLength(1);
    for (const domain of ANIMAL_VETERINARY_DOMAINS) {
      expect(registry.concepts.some((item) => item.id === domain.id), domain.id).toBe(true);
    }
  });

  it("raccorde les nouveaux domaines et sous-domaines à la famille sans déplacer les concepts historiques", () => {
    const allDomainIds = new Set(ANIMAL_VETERINARY_DOMAINS.map((item) => item.id));
    const familyDomainIds = new Set(ANIMAL_VETERINARY_DOMAINS.map((item) => item.id));
    for (const domain of familyDomainIds) {
      expect(registry.concepts.find((item) => item.id === domain)?.classifications).toContainEqual({
        classificationType: "foundation-a-family-v2",
        parentConceptId: ANIMAL_VETERINARY_FAMILY.id,
      });
    }
    for (const subdomain of ANIMAL_VETERINARY_SUBDOMAINS) {
      expect(registry.concepts.some((item) => item.id === subdomain.id)).toBe(true);
      expect(subdomain.classifications.some((item) => item.parentConceptId && allDomainIds.has(item.parentConceptId))).toBe(true);
    }
    expect(registry.concepts.find((item) => item.id === "domain:livestock")?.classifications).toContainEqual({
      classificationType: "foundation-a-family-v2",
      parentConceptId: ANIMAL_VETERINARY_FAMILY.id,
    });
    expect(registry.concepts.find((item) => item.id === "domain:livestock")?.classifications).toContainEqual({
      classificationType: "universal-domain",
      parentConceptId: "family:animals-veterinary",
    });
  });

  it("fournit des métiers, activités, processus, problèmes, ressources, fonctions et indicateurs", () => {
    const types = new Set(ANIMAL_VETERINARY_CATALOG.map((item) => item.conceptType));
    for (const type of ["subdomain", "specialization", "occupation", "activity", "process", "problem", "resource", "function", "indicator"]) {
      expect(types.has(type), type).toBe(true);
    }
  });

  it("documente précisément le volume du premier corpus animalier", () => {
    expect(ANIMAL_VETERINARY_CATALOG).toHaveLength(132);
    expect(ANIMAL_VETERINARY_SUBDOMAINS).toHaveLength(28);
    expect(ANIMAL_VETERINARY_CATALOG.filter((item) => item.conceptType === "specialization")).toHaveLength(6);
    expect(ANIMAL_VETERINARY_CATALOG.filter((item) => item.conceptType === "occupation")).toHaveLength(18);
    expect(ANIMAL_VETERINARY_CATALOG.filter((item) => item.conceptType === "activity")).toHaveLength(20);
    expect(ANIMAL_VETERINARY_CATALOG.filter((item) => item.conceptType === "process")).toHaveLength(10);
    expect(ANIMAL_VETERINARY_CATALOG.filter((item) => item.conceptType === "problem")).toHaveLength(14);
    expect(ANIMAL_VETERINARY_CATALOG.filter((item) => item.conceptType === "resource")).toHaveLength(14);
    expect(ANIMAL_VETERINARY_CATALOG.filter((item) => item.conceptType === "function")).toHaveLength(10);
    expect(ANIMAL_VETERINARY_CATALOG.filter((item) => item.conceptType === "indicator")).toHaveLength(7);
  });

  it("reconnaît le vocabulaire animalier et vétérinaire sans confondre les concepts", () => {
    const examples = [
      ["volaille", "subdomain-vet:aviculture"],
      ["vaccination animale", "activity-vet:animal-vaccination"],
      ["vétérinaire", "occupation-vet:veterinarian"],
      ["apiculture", "subdomain-vet:beekeeping"],
      ["alimentation du bétail", "subdomain-vet:animal-nutrition"],
    ] as const;
    for (const [term, expectedId] of examples) {
      const result = matchKnowledgeConcept(term, registry, { language: "fr" });
      expect(result.status, term).toBe("matched");
      if (result.status === "matched") expect(result.concept.id).toBe(expectedId);
    }
  });

  it("ne confond pas apiculture et pêche ou aquaculture", () => {
    const bee = matchKnowledgeConcept("apiculture", registry, { language: "fr" });
    const fisheries = matchKnowledgeConcept("Pêche et aquaculture", registry, { expectedType: "subdomain", language: "fr" });
    expect(bee.status).toBe("matched");
    if (bee.status === "matched") expect(bee.concept.id).toBe("subdomain-vet:beekeeping");
    expect(fisheries.status).toBe("matched");
    if (fisheries.status === "matched") expect(fisheries.concept.id).toBe("domain:fisheries");
  });

  it("rattache les sous-domaines vétérinaires à leur famille complète", () => {
    const lineage = getClassificationLineage(registry, "subdomain-vet:clinical-veterinary-medicine", "foundation-a-family-v2");
    expect(lineage.map((item) => item.id)).toEqual([
      ANIMAL_VETERINARY_FAMILY.id,
      "domain-vet:veterinary-medicine",
      "subdomain-vet:clinical-veterinary-medicine",
    ]);
  });

  it("relie le domaine élevage historique à la nouvelle famille sans en changer l'identité", () => {
    expect(ANIMAL_VETERINARY_RELATIONSHIPS).toContainEqual(expect.objectContaining({
      sourceConceptId: "domain:livestock",
      targetConceptId: ANIMAL_VETERINARY_FAMILY.id,
      predicate: "also_classified_in_family",
    }));
    expect(registry.concepts.find((item) => item.id === "domain:livestock")?.definitions[0].label).toBe("Élevage");
  });

  it("relie les professions, ressources, problèmes, indicateurs et processus à leurs domaines", () => {
    expect(registry.relationships).toEqual(expect.arrayContaining([
      expect.objectContaining({
        sourceConceptId: "occupation-vet:veterinarian",
        targetConceptId: "domain-vet:veterinary-medicine",
        predicate: "works_in_domain",
      }),
      expect.objectContaining({
        sourceConceptId: "resource-vet:animal-feed",
        targetConceptId: "domain-vet:animal-nutrition",
        predicate: "resource_for_domain",
      }),
      expect.objectContaining({
        sourceConceptId: "problem-vet:animal-disease-outbreak",
        targetConceptId: "function-vet:report-animal-disease",
        predicate: "may_be_addressed_by",
      }),
      expect.objectContaining({
        sourceConceptId: "indicator-vet:animal-mortality-rate",
        targetConceptId: "domain-vet:veterinary-medicine",
        predicate: "measures_domain",
      }),
    ]));
  });

  it("ne publie aucune relation orpheline et préserve les identifiants uniques", () => {
    const ids = new Set(registry.concepts.map((item) => item.id));
    expect(new Set(ANIMAL_VETERINARY_CATALOG.map((item) => item.id)).size).toBe(ANIMAL_VETERINARY_CATALOG.length);
    for (const relation of ANIMAL_VETERINARY_RELATIONSHIPS) {
      expect(ids.has(relation.sourceConceptId), relation.id).toBe(true);
      expect(ids.has(relation.targetConceptId), relation.id).toBe(true);
    }
  });
});
