import { describe, expect, it } from "vitest";
import { createUniversalKnowledgeRegistry } from "./registry";
import { matchKnowledgeConcept } from "./matching";
import { getClassificationLineage } from "./classification-graph";
import { COMMERCE_DISTRIBUTION_CATALOG } from "./commerce-distribution-catalog";

describe("Fondation A — famille 09 Commerce et marchés", () => {
  const registry = createUniversalKnowledgeRegistry();
  const catalog = registry.concepts.filter((item) =>
    /^(subdomain|specialization|occupation|activity|process|problem|resource|function|indicator)-com:/.test(item.id),
  );

  it("réutilise la famille et les cinq domaines canoniques sans doublons", () => {
    expect(registry.concepts.filter((item) => item.id === "family:commerce-markets")).toHaveLength(1);
    for (const id of ["domain:retail-trade","domain:wholesale-trade","domain:e-commerce","domain:sales-distribution","domain:marketing-advertising"]) {
      expect(registry.concepts.filter((item) => item.id === id)).toHaveLength(1);
    }
  });

  it("rattache les sous-domaines au bon domaine et à la famille", () => {
    const lineage = getClassificationLineage(registry, "subdomain-com:physical-retail-store", "universal-domain");
    expect(lineage.map((item) => item.id)).toEqual([
      "family:commerce-markets", "domain:retail-trade", "subdomain-com:physical-retail-store",
    ]);
  });

  it("distingue détail, gros, commerce électronique et distribution", () => {
    const retail = matchKnowledgeConcept("commerce de détail", registry, { expectedType: "subdomain", language: "fr" });
    const wholesale = matchKnowledgeConcept("commerce de gros", registry, { expectedType: "subdomain", language: "fr" });
    const ecommerce = matchKnowledgeConcept("vente en ligne", registry, { expectedType: "subdomain", language: "fr" });
    const distribution = matchKnowledgeConcept("distribution commerciale", registry, { expectedType: "subdomain", language: "fr" });
    for (const result of [retail, wholesale, ecommerce, distribution]) expect(result.status).toBe("matched");
    if (retail.status === "matched") expect(retail.concept.id).toBe("subdomain-com:physical-retail-store");
    if (wholesale.status === "matched") expect(wholesale.concept.id).toBe("subdomain-com:wholesale-b2b-trade");
    if (ecommerce.status === "matched") expect(ecommerce.concept.id).toBe("subdomain-com:ecommerce-retailing");
    if (distribution.status === "matched") expect(distribution.concept.id).toBe("subdomain-com:commercial-distribution-network");
  });

  it("distingue vente, encaissement, facture et marge commerciale", () => {
    const sale = matchKnowledgeConcept("vente en magasin", registry, { expectedType: "activity", language: "fr" });
    const checkout = matchKnowledgeConcept("encaissement client", registry, { expectedType: "activity", language: "fr" });
    const invoice = matchKnowledgeConcept("facturation client", registry, { expectedType: "activity", language: "fr" });
    const margin = matchKnowledgeConcept("marge commerciale", registry, { expectedType: "indicator", language: "fr" });
    expect([sale.status, checkout.status, invoice.status, margin.status]).toEqual(["matched","matched","matched","matched"]);
    if (sale.status === "matched") expect(sale.concept.id).toBe("activity-com:in-store-selling");
    if (checkout.status === "matched") expect(checkout.concept.id).toBe("activity-com:customer-checkout");
    if (invoice.status === "matched") expect(invoice.concept.id).toBe("activity-com:sales-invoicing");
    if (margin.status === "matched") expect(margin.concept.id).toBe("indicator-com:gross-margin-rate");
  });

  it("reconnaît les problèmes commerciaux et les fonctions numériques", () => {
    const problem = matchKnowledgeConcept("rupture de stock en magasin", registry, { expectedType: "problem", language: "fr" });
    const fn = matchKnowledgeConcept("gestion du catalogue produits", registry, { expectedType: "function", language: "fr" });
    expect(problem.status).toBe("matched");
    expect(fn.status).toBe("matched");
    if (problem.status === "matched") expect(problem.concept.id).toBe("problem-com:retail-stockout");
    if (fn.status === "matched") expect(fn.concept.id).toBe("function-com:product-catalog-management");
  });

  it("contient exactement les 90 concepts structurés dans les neuf catégories", () => {
    expect(catalog).toHaveLength(90);
    const expected = { subdomain:20, specialization:7, occupation:12, activity:12, process:8, problem:10, resource:7, function:7, indicator:7 };
    for (const [type,count] of Object.entries(expected)) expect(catalog.filter((item) => item.conceptType === type), type).toHaveLength(count);
    expect(COMMERCE_DISTRIBUTION_CATALOG).toHaveLength(90);
  });

  it("ne crée ni identifiants ni clés canoniques en double", () => {
    const ids = registry.concepts.map((item) => item.id);
    const keys = registry.concepts.map((item) => item.canonicalKey);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("ne publie aucune relation orpheline pour la famille 09", () => {
    const ids = new Set(registry.concepts.map((item) => item.id));
    for (const relation of registry.relationships.filter((item) => item.id.startsWith("rel:family-09-"))) {
      expect(ids.has(relation.sourceConceptId), relation.id).toBe(true);
      expect(ids.has(relation.targetConceptId), relation.id).toBe(true);
    }
  });
});
