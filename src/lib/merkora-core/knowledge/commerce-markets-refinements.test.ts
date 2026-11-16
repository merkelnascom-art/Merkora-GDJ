import { describe, expect, it } from "vitest";
import { createUniversalKnowledgeRegistry } from "./registry";
import { matchKnowledgeConcept } from "./matching";
import { getClassificationLineage } from "./classification-graph";
import { COMMERCE_MARKETS_CATALOG } from "./commerce-markets-catalog";

describe("Fondation A — compléments de la famille 09", () => {
  const registry = createUniversalKnowledgeRegistry();

  it("reconnaît le commerce par abonnement comme sous-domaine du commerce électronique", () => {
    const match = matchKnowledgeConcept("commerce par abonnement", registry, { expectedType: "subdomain", language: "fr" });
    expect(match.status).toBe("matched");
    if (match.status === "matched") expect(match.concept.id).toBe("subdomain-com:subscription-commerce");
    expect(getClassificationLineage(registry, "subdomain-com:subscription-commerce", "universal-domain").map((item) => item.id)).toEqual([
      "family:commerce-markets", "domain:e-commerce", "subdomain-com:subscription-commerce",
    ]);
  });

  it("reconnaît les études de marché comme sous-domaine marketing distinct", () => {
    const match = matchKnowledgeConcept("études de marché", registry, { expectedType: "subdomain", language: "fr" });
    expect(match.status).toBe("matched");
    if (match.status === "matched") expect(match.concept.id).toBe("subdomain-com:market-research-insights");
  });

  it("étend le catalogue existant à 90 concepts sans créer de doublons", () => {
    const catalog = registry.concepts.filter((item) => /^(subdomain|specialization|occupation|activity|process|problem|resource|function|indicator)-com:/.test(item.id));
    expect(COMMERCE_MARKETS_CATALOG).toHaveLength(90);
    expect(catalog).toHaveLength(90);
    expect(new Set(registry.concepts.map((item) => item.id)).size).toBe(registry.concepts.length);
    expect(new Set(registry.concepts.map((item) => item.canonicalKey)).size).toBe(registry.concepts.length);
  });
});
