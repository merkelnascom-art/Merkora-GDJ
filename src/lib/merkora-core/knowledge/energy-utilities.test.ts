import { describe, expect, it } from "vitest";
import { createUniversalKnowledgeRegistry } from "./registry";
import { matchKnowledgeConcept } from "./matching";
import { getClassificationLineage } from "./classification-graph";

describe("Fondation A — famille 06 Énergie et services essentiels", () => {
  const registry = createUniversalKnowledgeRegistry();

  it("réutilise la famille et les cinq domaines canoniques", () => {
    expect(registry.concepts.filter((item) => item.id === "family:energy-utilities")).toHaveLength(1);
    for (const id of [
      "domain:electricity",
      "domain:renewable-energy",
      "domain:gas-utilities",
      "domain:thermal-energy",
      "domain:utility-maintenance",
    ]) {
      expect(registry.concepts.filter((item) => item.id === id)).toHaveLength(1);
    }
  });

  it("rattache les sous-domaines à leur domaine puis à la famille", () => {
    const lineage = getClassificationLineage(registry, "subdomain-ene:electricity-distribution", "universal-domain");
    expect(lineage.map((item) => item.id)).toEqual([
      "family:energy-utilities",
      "domain:electricity",
      "subdomain-ene:electricity-distribution",
    ]);
  });

  it("reconnaît les expressions courantes sans confondre panne et intervention", () => {
    const problem = matchKnowledgeConcept("coupure de courant", registry, { expectedType: "problem", language: "fr" });
    expect(problem.status).toBe("matched");
    if (problem.status === "matched") expect(problem.concept.id).toBe("problem-ene:power-outage");

    const activity = matchKnowledgeConcept("relevé du compteur", registry, { expectedType: "activity", language: "fr" });
    expect(activity.status).toBe("matched");
    if (activity.status === "matched") expect(activity.concept.id).toBe("activity-ene:meter-reading");
  });

  it("contient toutes les catégories de concepts attendues", () => {
    const types = new Set(registry.concepts.map((item) => item.conceptType));
    for (const type of ["subdomain", "specialization", "occupation", "activity", "process", "problem", "resource", "function", "indicator"]) {
      expect(types.has(type), type).toBe(true);
    }
  });

  it("ne crée aucun identifiant ou canonicalKey en double", () => {
    const ids = registry.concepts.map((item) => item.id);
    const keys = registry.concepts.map((item) => item.canonicalKey);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("ne publie aucune relation orpheline de la famille 06", () => {
    const ids = new Set(registry.concepts.map((item) => item.id));
    for (const relation of registry.relationships.filter((item) => item.id.startsWith("rel:family-06-"))) {
      expect(ids.has(relation.sourceConceptId), relation.id).toBe(true);
      expect(ids.has(relation.targetConceptId), relation.id).toBe(true);
    }
  });
});
