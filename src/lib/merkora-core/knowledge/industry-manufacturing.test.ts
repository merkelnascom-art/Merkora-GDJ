import { describe, expect, it } from "vitest";
import { createUniversalKnowledgeRegistry } from "./registry";
import { matchKnowledgeConcept } from "./matching";
import { getClassificationLineage } from "./classification-graph";
import {
  INDUSTRY_MANUFACTURING_CATALOG,
  INDUSTRY_MANUFACTURING_SUBDOMAINS,
  INDUSTRY_MANUFACTURING_RELATIONSHIPS,
} from "./industry-manufacturing-catalog";

describe("Fondation A — famille 04 Industrie et fabrication", () => {
  const registry = createUniversalKnowledgeRegistry();

  it("réutilise la famille et les cinq domaines industriels canoniques", () => {
    expect(registry.concepts.filter((item) => item.id === "family:manufacturing-industry")).toHaveLength(1);
    for (const id of [
      "domain:mechanical-engineering",
      "domain:electrical-engineering",
      "domain:electronics",
      "domain:textile-fashion",
      "domain:industrial-production",
    ]) {
      expect(registry.concepts.filter((item) => item.id === id)).toHaveLength(1);
    }
  });

  it("rattache chaque sous-domaine à un domaine industriel existant", () => {
    const ids = new Set(registry.concepts.map((item) => item.id));
    expect(INDUSTRY_MANUFACTURING_SUBDOMAINS.length).toBeGreaterThanOrEqual(18);
    for (const concept of INDUSTRY_MANUFACTURING_SUBDOMAINS) {
      const parent = concept.classifications.find((item) => item.classificationType === "universal-domain")?.parentConceptId;
      expect(parent && ids.has(parent), concept.id).toBe(true);
    }
  });

  it("reconnaît les expressions métier sans confondre profession et activité", () => {
    const machine = matchKnowledgeConcept("panne machine", registry, { expectedType: "problem", language: "fr" });
    expect(machine.status).toBe("matched");
    if (machine.status === "matched") expect(machine.concept.id).toBe("problem-ind:machine-downtime");

    const maintenance = matchKnowledgeConcept("maintenance préventive", registry, { expectedType: "activity", language: "fr" });
    expect(maintenance.status).toBe("matched");
    if (maintenance.status === "matched") expect(maintenance.concept.id).toBe("activity-ind:preventive-maintenance");
  });

  it("remonte d'un sous-domaine vers le domaine puis la famille", () => {
    const lineage = getClassificationLineage(registry, "subdomain-ind:machining", "universal-domain");
    expect(lineage.map((item) => item.id)).toEqual([
      "family:manufacturing-industry",
      "domain:mechanical-engineering",
      "subdomain-ind:machining",
    ]);
  });

  it("inclut métiers, activités, processus, problèmes, ressources, fonctions et indicateurs", () => {
    const types = new Set(INDUSTRY_MANUFACTURING_CATALOG.map((item) => item.conceptType));
    for (const type of ["subdomain", "specialization", "occupation", "activity", "process", "problem", "resource", "function", "indicator"]) {
      expect(types.has(type), type).toBe(true);
    }
  });

  it("ne crée ni identifiants ni clés canoniques en double", () => {
    const ids = registry.concepts.map((item) => item.id);
    const keys = registry.concepts.map((item) => item.canonicalKey);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("ne publie aucune relation orpheline", () => {
    const ids = new Set(registry.concepts.map((item) => item.id));
    for (const relation of INDUSTRY_MANUFACTURING_RELATIONSHIPS) {
      expect(ids.has(relation.sourceConceptId), relation.id).toBe(true);
      expect(ids.has(relation.targetConceptId), relation.id).toBe(true);
    }
  });
});
