import { describe, expect, it } from "vitest";
import { createUniversalKnowledgeRegistry } from "./registry";
import { matchKnowledgeConcept } from "./matching";
import { getClassificationLineage } from "./classification-graph";
import { COMMERCE_MARKETS_CATALOG } from "./commerce-markets-catalog";

describe("Fondation A — famille 09 Commerce et marchés", () => {
  const registry = createUniversalKnowledgeRegistry();
  const catalog = registry.concepts.filter((item) =>
    /^(subdomain|specialization|occupation|activity|process|problem|resource|function|indicator)-com:/.test(item.id),
  );

  it("réutilise la famille et les cinq domaines canoniques", () => {
    expect(registry.concepts.filter((item) => item.id === "family:commerce-markets")).toHaveLength(1);
    for (const id of [
      "domain:retail-trade",
      "domain:wholesale-trade",
      "domain:e-commerce",
      "domain:sales-distribution",
      "domain:marketing-advertising",
    ]) {
      expect(registry.concepts.filter((item) => item.id === id)).toHaveLength(1);
    }
  });

  it("rattache les activités commerciales à leur domaine puis à la famille", () => {
    const lineage = getClassificationLineage(registry, "subdomain-com:physical-retail", "universal-domain");
    expect(lineage.map((item) => item.id)).toEqual([
      "family:commerce-markets",
      "domain:retail-trade",
      "subdomain-com:physical-retail",
    ]);
  });

  it("distingue commerce de détail, commerce de gros et commerce électronique", () => {
    const retail = matchKnowledgeConcept("commerce de détail", registry, { expectedType: "subdomain", language: "fr" });
    const wholesale = matchKnowledgeConcept("commerce de gros", registry, { expectedType: "subdomain", language: "fr" });
    const ecommerce = matchKnowledgeConcept("vente en ligne", registry, { expectedType: "subdomain", language: "fr" });
    expect(retail.status).toBe("matched");
    expect(wholesale.status).toBe("matched");
    expect(ecommerce.status).toBe("matched");
    if (retail.status === "matched") expect(retail.concept.id).toBe("subdomain-com:physical-retail");
    if (wholesale.status === "matched") expect(wholesale.concept.id).toBe("subdomain-com:wholesale-commerce");
    if (ecommerce.status === "matched") expect(ecommerce.concept.id).toBe("subdomain-com:ecommerce-commerce");
  });

  it("ne confond pas vente, paiement, facturation et comptabilité", () => {
    const sale = matchKnowledgeConcept("vente", registry, { expectedType: "activity", language: "fr" });
    const payment = matchKnowledgeConcept("encaissement", registry, { expectedType: "activity", language: "fr" });
    const invoice = matchKnowledgeConcept("facturation client", registry, { expectedType: "activity", language: "fr" });
    expect(sale.status).toBe("matched");
    expect(payment.status).toBe("matched");
    expect(invoice.status).toBe("matched");
    if (sale.status === "matched") expect(sale.concept.id).toBe("activity-com:sales-transaction");
    if (payment.status === "matched") expect(payment.concept.id).toBe("activity-com:payment-collection");
    if (invoice.status === "matched") expect(invoice.concept.id).toBe("activity-com:customer-invoicing");
  });

  it("reconnaît les problèmes commerciaux et les fonctions numériques", () => {
    const problem = matchKnowledgeConcept("écart de caisse", registry, { expectedType: "problem", language: "fr" });
    const functionMatch = matchKnowledgeConcept("gestion de la relation client", registry, { expectedType: "function", language: "fr" });
    expect(problem.status).toBe("matched");
    expect(functionMatch.status).toBe("matched");
    if (problem.status === "matched") expect(problem.concept.id).toBe("problem-com:cash-discrepancy");
    if (functionMatch.status === "matched") expect(functionMatch.concept.id).toBe("function-com:crm");
  });

  it("contient un catalogue structuré couvrant les neuf catégories", () => {
    expect(catalog.length).toBeGreaterThanOrEqual(80);
    for (const type of ["subdomain", "specialization", "occupation", "activity", "process", "problem", "resource", "function", "indicator"]) {
      expect(catalog.some((item) => item.conceptType === type), type).toBe(true);
    }
    expect(COMMERCE_MARKETS_CATALOG.length).toBe(catalog.length);
  });

  it("ne crée ni identifiants ni clés canoniques en double", () => {
    const ids = registry.concepts.map((item) => item.id);
    const keys = registry.concepts.map((item) => item.canonicalKey);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("ne publie aucune relation orpheline de la famille 09", () => {
    const ids = new Set(registry.concepts.map((item) => item.id));
    for (const relation of registry.relationships.filter((item) => item.id.startsWith("rel:family-09-"))) {
      expect(ids.has(relation.sourceConceptId), relation.id).toBe(true);
      expect(ids.has(relation.targetConceptId), relation.id).toBe(true);
    }
  });
});
