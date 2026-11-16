import { describe, expect, it } from "vitest";
import { createUniversalKnowledgeRegistry } from "./registry";
import { matchKnowledgeConcept } from "./matching";
import { getClassificationLineage } from "./classification-graph";
import { LOGISTICS_SUPPLY_CHAIN_CATALOG } from "./logistics-supply-chain-catalog";

describe("Fondation A — famille 08 Logistique et chaîne d'approvisionnement", () => {
  const registry = createUniversalKnowledgeRegistry();

  it("réutilise la famille et les cinq domaines canoniques sans les dupliquer", () => {
    expect(registry.concepts.filter((item) => item.id === "family:logistics-supply-chain")).toHaveLength(1);
    for (const id of [
      "domain:warehousing",
      "domain:freight-forwarding",
      "domain:procurement",
      "domain:inventory-management",
      "domain:postal-delivery",
    ]) {
      expect(registry.concepts.filter((item) => item.id === id)).toHaveLength(1);
    }
  });

  it("rattache les sous-domaines au domaine canonique puis à la famille", () => {
    const lineage = getClassificationLineage(registry, "subdomain-log:warehouse-operations", "universal-domain");
    expect(lineage.map((item) => item.id)).toEqual([
      "family:logistics-supply-chain",
      "domain:warehousing",
      "subdomain-log:warehouse-operations",
    ]);
  });

  it("distingue stockage, gestion de stock, approvisionnement et transport", () => {
    const warehouse = matchKnowledgeConcept("entreposage", registry, { expectedType: "subdomain", language: "fr" });
    const inventory = matchKnowledgeConcept("gestion des stocks", registry, { expectedType: "subdomain", language: "fr" });
    const procurement = matchKnowledgeConcept("approvisionnement", registry, { expectedType: "subdomain", language: "fr" });
    expect(warehouse.status).toBe("matched");
    expect(inventory.status).toBe("matched");
    expect(procurement.status).toBe("matched");
    if (warehouse.status === "matched") expect(warehouse.concept.id).toBe("subdomain-log:warehouse-operations");
    if (inventory.status === "matched") expect(inventory.concept.id).toBe("subdomain-log:inventory-control");
    if (procurement.status === "matched") expect(procurement.concept.id).toBe("subdomain-log:procurement-sourcing");
    expect(registry.concepts.some((item) => item.id === "subdomain-trn:road-freight-transport")).toBe(true);
  });

  it("reconnaît les problèmes logistiques et les fonctions numériques correspondantes", () => {
    const problem = matchKnowledgeConcept("rupture de stock", registry, { expectedType: "problem", language: "fr" });
    const functionMatch = matchKnowledgeConcept("préparation des commandes", registry, { expectedType: "activity", language: "fr" });
    expect(problem.status).toBe("matched");
    expect(functionMatch.status).toBe("matched");
    if (problem.status === "matched") expect(problem.concept.id).toBe("problem-log:stockout");
    if (functionMatch.status === "matched") expect(functionMatch.concept.id).toBe("activity-log:order-picking");
  });

  it("contient un corpus sectoriel structuré et les neuf catégories attendues", () => {
    expect(LOGISTICS_SUPPLY_CHAIN_CATALOG).toHaveLength(88);
    for (const type of ["subdomain", "specialization", "occupation", "activity", "process", "problem", "resource", "function", "indicator"]) {
      expect(LOGISTICS_SUPPLY_CHAIN_CATALOG.some((item) => item.conceptType === type), type).toBe(true);
    }
  });

  it("ne crée ni identifiants ni clés canoniques en double", () => {
    const ids = registry.concepts.map((item) => item.id);
    const keys = registry.concepts.map((item) => item.canonicalKey);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("ne publie aucune relation orpheline de la famille 08", () => {
    const ids = new Set(registry.concepts.map((item) => item.id));
    for (const relation of registry.relationships.filter((item) => item.id.startsWith("rel:family-08-"))) {
      expect(ids.has(relation.sourceConceptId), relation.id).toBe(true);
      expect(ids.has(relation.targetConceptId), relation.id).toBe(true);
    }
  });
});
