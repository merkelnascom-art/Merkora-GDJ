import { describe, expect, it } from "vitest";
import { createUniversalKnowledgeRegistry } from "./registry";
import { matchKnowledgeConcept } from "./matching";
import { getClassificationLineage } from "./classification-graph";
import { CONSTRUCTION_BUILT_ENVIRONMENT_CATALOG } from "./construction-built-environment-catalog";

describe("Fondation A — famille 05 Construction et cadre bâti", () => {
  const registry = createUniversalKnowledgeRegistry();

  it("réutilise la famille et les cinq domaines canoniques du cadre bâti", () => {
    expect(registry.concepts.filter((item) => item.id === "family:construction-built-environment")).toHaveLength(1);
    for (const id of [
      "domain:architecture",
      "domain:civil-engineering",
      "domain:building-construction",
      "domain:public-works",
      "domain:facility-management",
    ]) {
      expect(registry.concepts.filter((item) => item.id === id)).toHaveLength(1);
    }
  });

  it("rattache les sous-domaines à leur domaine canonique puis à la famille", () => {
    const lineage = getClassificationLineage(registry, "subdomain-con:building-site-management", "universal-domain");
    expect(lineage.map((item) => item.id)).toEqual([
      "family:construction-built-environment",
      "domain:building-construction",
      "subdomain-con:building-site-management",
    ]);
  });

  it("reconnaît les expressions de chantier et distingue problème et activité", () => {
    const problem = matchKnowledgeConcept("retard de chantier", registry, { expectedType: "problem", language: "fr" });
    expect(problem.status).toBe("matched");
    if (problem.status === "matched") expect(problem.concept.id).toBe("problem-con:construction-delay");

    const activity = matchKnowledgeConcept("suivi de chantier", registry, { expectedType: "activity", language: "fr" });
    expect(activity.status).toBe("matched");
    if (activity.status === "matched") expect(activity.concept.id).toBe("activity-con:site-progress-monitoring");
  });

  it("représente les spécialités, métiers, activités, processus, problèmes, ressources, fonctions et indicateurs", () => {
    expect(CONSTRUCTION_BUILT_ENVIRONMENT_CATALOG).toHaveLength(68);
    const types = new Set(CONSTRUCTION_BUILT_ENVIRONMENT_CATALOG.map((item) => item.conceptType));
    for (const type of ["subdomain", "specialization", "occupation", "activity", "process", "problem", "resource", "function", "indicator"]) {
      expect([...types].includes(type)).toBe(true);
    }
  });

  it("ne crée ni identifiants ni clés canoniques en double", () => {
    const ids = registry.concepts.map((item) => item.id);
    const keys = registry.concepts.map((item) => item.canonicalKey);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("ne publie aucune relation orpheline pour la famille 05", () => {
    const ids = new Set(registry.concepts.map((item) => item.id));
    for (const relation of registry.relationships.filter((item) => item.id.startsWith("rel:family-05-"))) {
      expect(ids.has(relation.sourceConceptId), relation.id).toBe(true);
      expect(ids.has(relation.targetConceptId), relation.id).toBe(true);
    }
  });
});
