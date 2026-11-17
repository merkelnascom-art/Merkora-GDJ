import { describe, expect, it } from "vitest";
import { createUniversalKnowledgeRegistry } from "./registry";
import { matchKnowledgeConcept } from "./matching";
import { getClassificationLineage } from "./classification-graph";
import { LEGAL_SERVICES_CATALOG } from "./legal-services-catalog";

describe("Fondation A — famille 12 Droit et services juridiques", () => {
  const registry = createUniversalKnowledgeRegistry();

  it("réutilise la famille et cinq domaines juridiques canoniques sans doublons", () => {
    expect(registry.concepts.filter((item) => item.id === "family:legal-services")).toHaveLength(1);
    for (const id of ["domain:business-law","domain:civil-family-law","domain:labour-law","domain:justice-litigation","domain:legal-advisory-acts"]) {
      expect(registry.concepts.filter((item) => item.id === id)).toHaveLength(1);
    }
  });

  it("rattache les sous-domaines à leur domaine puis à la famille", () => {
    const lineage = getClassificationLineage(registry, "subdomain-law:corporate-law", "universal-domain");
    expect(lineage.map((item) => item.id)).toEqual(["family:legal-services","domain:business-law","subdomain-law:corporate-law"]);
  });

  it("distingue droit des affaires, droit familial, travail, contentieux et conseil juridique", () => {
    const examples = [
      ["création d'une société", "subdomain-law:company-formation"],
      ["divorce et garde des enfants", "subdomain-law:family-law"],
      ["contrat de travail", "subdomain-law:employment-contracts"],
      ["contentieux civil", "subdomain-law:civil-litigation"],
      ["rédaction d'un acte juridique", "subdomain-law:legal-document-drafting"],
    ] as const;
    for (const [phrase, expectedId] of examples) {
      const match = matchKnowledgeConcept(phrase, registry, { expectedType: "subdomain", language: "fr" });
      expect(match.status, phrase).toBe("matched");
      if (match.status === "matched") expect(match.concept.id).toBe(expectedId);
    }
  });

  it("ne confond pas information juridique, conseil réservé, représentation et décision judiciaire", () => {
    const information = matchKnowledgeConcept("information juridique générale", registry, { expectedType: "activity", language: "fr" });
    const advice = matchKnowledgeConcept("consultation juridique personnalisée", registry, { expectedType: "activity", language: "fr" });
    const representation = matchKnowledgeConcept("représentation devant une juridiction", registry, { expectedType: "activity", language: "fr" });
    const judgment = matchKnowledgeConcept("rendre un jugement", registry, { expectedType: "activity", language: "fr" });
    for (const result of [information, advice, representation, judgment]) expect(result.status).toBe("matched");
  });

  it("contient 90 concepts dans les neuf catégories attendues", () => {
    expect(LEGAL_SERVICES_CATALOG).toHaveLength(90);
    const catalog = registry.concepts.filter((item) => /^(subdomain|specialization|occupation|activity|process|problem|resource|function|indicator)-law:/.test(item.id));
    expect(catalog).toHaveLength(90);
    const counts: Record<string, number> = { subdomain:20, specialization:7, occupation:12, activity:12, process:8, problem:10, resource:7, function:7, indicator:7 };
    for (const [type, count] of Object.entries(counts)) expect(catalog.filter((item) => item.conceptType === type)).toHaveLength(count);
  });

  it("ne crée aucun identifiant ou canonicalKey en double", () => {
    const ids = registry.concepts.map((item) => item.id);
    const keys = registry.concepts.map((item) => item.canonicalKey);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("ne publie aucune relation orpheline de la famille 12", () => {
    const ids = new Set(registry.concepts.map((item) => item.id));
    for (const relation of registry.relationships.filter((item) => item.id.startsWith("rel:family-12-"))) {
      expect(ids.has(relation.sourceConceptId), relation.id).toBe(true);
      expect(ids.has(relation.targetConceptId), relation.id).toBe(true);
    }
  });
});
