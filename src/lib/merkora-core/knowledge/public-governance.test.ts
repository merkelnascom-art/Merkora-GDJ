import { describe, expect, it } from "vitest";
import { createUniversalKnowledgeRegistry } from "./registry";
import { matchKnowledgeConcept } from "./matching";
import { getClassificationLineage } from "./classification-graph";
import { PUBLIC_GOVERNANCE_CATALOG } from "./public-governance-catalog";

describe("Fondation A — famille 11 Administration publique et gouvernance", () => {
  const registry = createUniversalKnowledgeRegistry();

  it("réutilise la famille et les cinq domaines publics canoniques sans doublons", () => {
    expect(registry.concepts.filter((item) => item.id === "family:public-governance")).toHaveLength(1);
    for (const id of ["domain:public-administration","domain:local-government","domain:public-finance","domain:diplomacy-international","domain:civil-registration"]) {
      expect(registry.concepts.filter((item) => item.id === id)).toHaveLength(1);
    }
  });

  it("rattache les sous-domaines aux domaines canoniques et à la famille", () => {
    const lineage = getClassificationLineage(registry, "subdomain-gov:central-government", "universal-domain");
    expect(lineage.map((item) => item.id)).toEqual(["family:public-governance","domain:public-administration","subdomain-gov:central-government"]);
  });

  it("distingue administration centrale, collectivités, finances publiques, diplomatie et état civil", () => {
    const examples = [
      ["administration centrale", "subdomain-gov:central-government"],
      ["gestion des collectivités territoriales", "subdomain-gov:local-public-services"],
      ["budget de l'État", "subdomain-gov:public-budgeting"],
      ["relations diplomatiques", "subdomain-gov:diplomatic-relations"],
      ["actes de naissance", "subdomain-gov:civil-status-records"],
    ] as const;
    for (const [phrase, expectedId] of examples) {
      const match = matchKnowledgeConcept(phrase, registry, { expectedType: "subdomain", language: "fr" });
      expect(match.status, phrase).toBe("matched");
      if (match.status === "matched") expect(match.concept.id).toBe(expectedId);
    }
  });

  it("ne confond pas politique publique, prestation citoyenne, décision administrative et dépense publique", () => {
    const policy = matchKnowledgeConcept("évaluation des politiques publiques", registry, { expectedType: "activity", language: "fr" });
    const service = matchKnowledgeConcept("instruction d'une demande citoyenne", registry, { expectedType: "activity", language: "fr" });
    const decision = matchKnowledgeConcept("décision administrative", registry, { expectedType: "activity", language: "fr" });
    const spending = matchKnowledgeConcept("exécution de la dépense publique", registry, { expectedType: "activity", language: "fr" });
    expect(policy.status).toBe("matched");
    expect(service.status).toBe("matched");
    expect(decision.status).toBe("matched");
    expect(spending.status).toBe("matched");
  });

  it("contient 90 concepts dans les neuf catégories attendues", () => {
    expect(PUBLIC_GOVERNANCE_CATALOG).toHaveLength(90);
    const catalog = registry.concepts.filter((item) => /^(subdomain|specialization|occupation|activity|process|problem|resource|function|indicator)-gov:/.test(item.id));
    expect(catalog).toHaveLength(90);
    for (const type of ["subdomain","specialization","occupation","activity","process","problem","resource","function","indicator"]) {
      expect(catalog.filter((item) => item.conceptType === type)).toHaveLength(({subdomain:20,specialization:7,occupation:12,activity:12,process:8,problem:10,resource:7,function:7,indicator:7} as Record<string,number>)[type]);
    }
  });

  it("ne crée aucun identifiant ou canonicalKey en double", () => {
    const ids = registry.concepts.map((item) => item.id);
    const keys = registry.concepts.map((item) => item.canonicalKey);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("ne publie aucune relation orpheline de la famille 11", () => {
    const ids = new Set(registry.concepts.map((item) => item.id));
    for (const relation of registry.relationships.filter((item) => item.id.startsWith("rel:family-11-"))) {
      expect(ids.has(relation.sourceConceptId), relation.id).toBe(true);
      expect(ids.has(relation.targetConceptId), relation.id).toBe(true);
    }
  });
});
