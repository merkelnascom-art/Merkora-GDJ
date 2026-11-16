import { describe, expect, it } from "vitest";
import { createUniversalKnowledgeRegistry } from "./registry";
import { matchKnowledgeConcept } from "./matching";
import { getClassificationLineage } from "./classification-graph";

describe("Fondation A — famille 07 Mobilité et transport", () => {
  const registry = createUniversalKnowledgeRegistry();
  const catalog = registry.concepts.filter((item) =>
    /^(subdomain|specialization|occupation|activity|process|problem|resource|function|indicator)-trn:/.test(item.id),
  );

  it("réutilise la famille et les cinq domaines canoniques", () => {
    expect(registry.concepts.filter((item) => item.id === "family:mobility-transport")).toHaveLength(1);
    for (const id of [
      "domain:road-transport",
      "domain:rail-transport",
      "domain:maritime-transport",
      "domain:aviation",
      "domain:urban-mobility",
    ]) {
      expect(registry.concepts.filter((item) => item.id === id)).toHaveLength(1);
    }
  });

  it("rattache les sous-domaines au domaine de transport puis à la famille", () => {
    const lineage = getClassificationLineage(registry, "subdomain-trn:road-passenger-transport", "universal-domain");
    expect(lineage.map((item) => item.id)).toEqual([
      "family:mobility-transport",
      "domain:road-transport",
      "subdomain-trn:road-passenger-transport",
    ]);
  });

  it("distingue le transport de voyageurs du transport de marchandises", () => {
    const passengers = matchKnowledgeConcept("transport de voyageurs", registry, { expectedType: "subdomain", language: "fr" });
    const freight = matchKnowledgeConcept("transport routier de marchandises", registry, { expectedType: "subdomain", language: "fr" });
    expect(passengers.status).toBe("matched");
    expect(freight.status).toBe("matched");
    if (passengers.status === "matched" && freight.status === "matched") {
      expect(passengers.concept.id).toBe("subdomain-trn:road-passenger-transport");
      expect(freight.concept.id).toBe("subdomain-trn:road-freight-transport");
      expect(passengers.concept.id).not.toBe(freight.concept.id);
    }
  });

  it("reconnaît les problèmes et les activités sans les confondre", () => {
    const problem = matchKnowledgeConcept("retard de transport", registry, { expectedType: "problem", language: "fr" });
    const activity = matchKnowledgeConcept("planification d'itinéraire", registry, { expectedType: "activity", language: "fr" });
    expect(problem.status).toBe("matched");
    expect(activity.status).toBe("matched");
    if (problem.status === "matched") expect(problem.concept.id).toBe("problem-trn:transport-delay");
    if (activity.status === "matched") expect(activity.concept.id).toBe("activity-trn:route-planning");
  });

  it("contient les 78 concepts et les neuf catégories attendues", () => {
    expect(catalog).toHaveLength(78);
    const expected = {
      subdomain: 18, specialization: 5, occupation: 12, activity: 10,
      process: 7, problem: 8, resource: 6, function: 6, indicator: 6,
    };
    for (const [type, count] of Object.entries(expected)) {
      expect(catalog.filter((item) => item.conceptType === type), type).toHaveLength(count);
    }
  });

  it("ne crée ni identifiants ni clés canoniques en double", () => {
    const ids = registry.concepts.map((item) => item.id);
    const keys = registry.concepts.map((item) => item.canonicalKey);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("ne publie aucune relation orpheline pour la famille 07", () => {
    const ids = new Set(registry.concepts.map((item) => item.id));
    for (const relation of registry.relationships.filter((item) => item.id.startsWith("rel:family-07-"))) {
      expect(ids.has(relation.sourceConceptId), relation.id).toBe(true);
      expect(ids.has(relation.targetConceptId), relation.id).toBe(true);
    }
  });
});
