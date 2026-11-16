import { describe, expect, it } from "vitest";
import { createUniversalKnowledgeRegistry } from "./registry";
import { matchKnowledgeConcept } from "./matching";
import { getClassificationLineage } from "./classification-graph";
import { FINANCE_INSURANCE_CATALOG } from "./finance-insurance-catalog";

describe("Fondation A — famille 10 Finance, assurance et comptabilité", () => {
  const registry = createUniversalKnowledgeRegistry();

  it("réutilise la famille et les cinq domaines canoniques sans les dupliquer", () => {
    expect(registry.concepts.filter((item) => item.id === "family:finance-insurance")).toHaveLength(1);
    for (const id of [
      "domain:banking",
      "domain:accounting-audit",
      "domain:insurance",
      "domain:investment-finance",
      "domain:microfinance",
    ]) {
      expect(registry.concepts.filter((item) => item.id === id)).toHaveLength(1);
    }
  });

  it("rattache les sous-domaines au domaine canonique puis à la famille", () => {
    const lineage = getClassificationLineage(registry, "subdomain-fin:retail-banking", "universal-domain");
    expect(lineage.map((item) => item.id)).toEqual([
      "family:finance-insurance",
      "domain:banking",
      "subdomain-fin:retail-banking",
    ]);
  });

  it("distingue banque, comptabilité, assurance, investissement et microfinance", () => {
    const examples = [
      ["banque de détail", "subdomain-fin:retail-banking"],
      ["tenue de comptabilité", "subdomain-fin:accounting-bookkeeping"],
      ["souscription d'assurance", "subdomain-fin:insurance-underwriting"],
      ["gestion de portefeuille d'investissement", "subdomain-fin:investment-management"],
      ["microcrédit", "subdomain-fin:microfinance-lending"],
    ] as const;
    for (const [phrase, expectedId] of examples) {
      const match = matchKnowledgeConcept(phrase, registry, { expectedType: "subdomain", language: "fr" });
      expect(match.status, phrase).toBe("matched");
      if (match.status === "matched") expect(match.concept.id).toBe(expectedId);
    }
  });

  it("ne confond pas revenu, bénéfice, trésorerie, paiement et écriture comptable", () => {
    const accounting = matchKnowledgeConcept("écriture comptable", registry, { expectedType: "activity", language: "fr" });
    const payment = matchKnowledgeConcept("traitement des paiements", registry, { expectedType: "activity", language: "fr" });
    const treasury = matchKnowledgeConcept("gestion de trésorerie", registry, { expectedType: "activity", language: "fr" });
    expect(accounting.status).toBe("matched");
    expect(payment.status).toBe("matched");
    expect(treasury.status).toBe("matched");
    if (accounting.status === "matched") expect(accounting.concept.id).toBe("activity-fin:accounting-entry");
    if (payment.status === "matched") expect(payment.concept.id).toBe("activity-fin:payment-processing");
    if (treasury.status === "matched") expect(treasury.concept.id).toBe("activity-fin:cash-management");
  });

  it("reconnaît les risques financiers et les fonctions numériques de rapprochement", () => {
    const problem = matchKnowledgeConcept("impayés clients", registry, { expectedType: "problem", language: "fr" });
    const reconciliation = matchKnowledgeConcept("rapprochement bancaire", registry, { expectedType: "function", language: "fr" });
    expect(problem.status).toBe("matched");
    expect(reconciliation.status).toBe("matched");
    if (problem.status === "matched") expect(problem.concept.id).toBe("problem-fin:payment-defaults");
    if (reconciliation.status === "matched") expect(reconciliation.concept.id).toBe("function-fin:bank-reconciliation");
  });

  it("contient 90 concepts structurés dans les neuf catégories attendues", () => {
    expect(FINANCE_INSURANCE_CATALOG).toHaveLength(90);
    const catalog = registry.concepts.filter((item) =>
      /^(subdomain|specialization|occupation|activity|process|problem|resource|function|indicator)-fin:/.test(item.id),
    );
    expect(catalog).toHaveLength(90);
    for (const type of ["subdomain", "specialization", "occupation", "activity", "process", "problem", "resource", "function", "indicator"]) {
      expect(catalog.some((item) => item.conceptType === type), type).toBe(true);
    }
  });

  it("ne crée ni identifiants ni clés canoniques en double", () => {
    const ids = registry.concepts.map((item) => item.id);
    const keys = registry.concepts.map((item) => item.canonicalKey);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("ne publie aucune relation orpheline de la famille 10", () => {
    const ids = new Set(registry.concepts.map((item) => item.id));
    for (const relation of registry.relationships.filter((item) => item.id.startsWith("rel:family-10-"))) {
      expect(ids.has(relation.sourceConceptId), relation.id).toBe(true);
      expect(ids.has(relation.targetConceptId), relation.id).toBe(true);
    }
  });
});
