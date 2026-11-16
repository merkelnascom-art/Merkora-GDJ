import { describe, expect, it } from "vitest";
import { createUniversalKnowledgeRegistry } from "./registry";
import { matchKnowledgeConcept } from "./matching";
import { getClassificationLineage } from "./classification-graph";
import {
  ENVIRONMENT_NATURAL_RESOURCES_CATALOG,
  ENVIRONMENT_NATURAL_RESOURCES_SUBDOMAINS,
  ENVIRONMENT_NATURAL_RESOURCES_RELATIONSHIPS,
} from "./environment-natural-resources-catalog";

describe("Fondation A — famille 03 Environnement et ressources naturelles", () => {
  const registry = createUniversalKnowledgeRegistry();

  it("réutilise la famille et les domaines universels sans créer de doublons", () => {
    expect(registry.concepts.some((item) => item.id === "family:environment-natural-resources")).toBe(true);
    for (const id of ["domain:environment", "domain:water-management", "domain:waste-management", "domain:climate-energy-transition", "domain:natural-resource-management"]) {
      expect(registry.concepts.filter((item) => item.id === id)).toHaveLength(1);
    }
  });

  it("enregistre les sous-domaines environnementaux et leurs rattachements", () => {
    expect(ENVIRONMENT_NATURAL_RESOURCES_SUBDOMAINS.length).toBeGreaterThanOrEqual(15);
    const ids = new Set(registry.concepts.map((item) => item.id));
    for (const concept of ENVIRONMENT_NATURAL_RESOURCES_SUBDOMAINS) {
      expect(ids.has(concept.id), concept.id).toBe(true);
      const parent = concept.classifications.find((item) => item.classificationType === "universal-domain")?.parentConceptId;
      expect(parent && ids.has(parent), concept.id).toBe(true);
    }
  });

  it("reconnaît les expressions courantes sans confondre activité et domaine", () => {
    const waste = matchKnowledgeConcept("ramassage des ordures", registry, { expectedType: "activity", language: "fr" });
    expect(waste.status).toBe("matched");
    if (waste.status === "matched") expect(waste.concept.id).toBe("activity-env:waste-collection");

    const water = matchKnowledgeConcept("Gestion de l'eau", registry, { expectedType: "domain", language: "fr" });
    expect(water.status).toBe("matched");
    if (water.status === "matched") expect(water.concept.id).toBe("domain:water-management");
  });

  it("remonte du sous-domaine jusqu'à la famille universelle", () => {
    const lineage = getClassificationLineage(registry, "subdomain-env:water-treatment", "universal-domain");
    expect(lineage.map((item) => item.id)).toEqual([
      "family:environment-natural-resources",
      "domain:water-management",
      "subdomain-env:water-treatment",
    ]);
  });

  it("fournit métiers, activités, processus, problèmes, ressources, fonctions et indicateurs", () => {
    const types = new Set(ENVIRONMENT_NATURAL_RESOURCES_CATALOG.map((item) => item.conceptType));
    for (const type of ["subdomain", "specialization", "occupation", "activity", "process", "problem", "resource", "function", "indicator"]) {
      expect(types.has(type), type).toBe(true);
    }
  });

  it("ne publie aucune relation orpheline et conserve des identifiants uniques", () => {
    const ids = new Set(registry.concepts.map((item) => item.id));
    expect(new Set(ENVIRONMENT_NATURAL_RESOURCES_CATALOG.map((item) => item.id)).size).toBe(ENVIRONMENT_NATURAL_RESOURCES_CATALOG.length);
    for (const relation of ENVIRONMENT_NATURAL_RESOURCES_RELATIONSHIPS) {
      expect(ids.has(relation.sourceConceptId), relation.id).toBe(true);
      expect(ids.has(relation.targetConceptId), relation.id).toBe(true);
    }
  });
});
