import { describe, expect, it } from "vitest";
import { createCoreKnowledgeRegistry, createUniversalKnowledgeRegistry } from "./registry";
import { enrichSituationGraphWithKnowledge } from "./situation-linker";
import type { SituationGraph } from "../situation-graph";

describe("situation graph knowledge linking", () => {
  const graph: SituationGraph = {
    entities: [
      { id: "entity:actor", key: "actor", kind: "actor", label: "Acteur", evidence: [] },
      { id: "entity:activity", key: "activity", kind: "activity", label: "Activité", evidence: [] },
      { id: "entity:unknown", key: "unknown", kind: "activity", label: "Réparation textile bioluminescente", evidence: [] },
    ],
    relations: [],
    unresolvedRelations: [],
  };

  it("links open graph kinds to universal type concepts and known labels to canonical concepts", () => {
    const linked = enrichSituationGraphWithKnowledge(graph, createCoreKnowledgeRegistry());

    expect(linked.entities[0].knowledge).toMatchObject({
      typeConceptId: "core:actor",
      typeConceptLabel: "Acteur",
      conceptId: "core:actor",
      matchStatus: "matched",
    });
    expect(linked.entities[1].knowledge).toMatchObject({
      typeConceptId: "core:activity",
      conceptId: "core:activity",
      matchStatus: "matched",
    });
  });

  it("keeps unknown labels unchanged and never forces a canonical concept", () => {
    const linked = enrichSituationGraphWithKnowledge(graph, createCoreKnowledgeRegistry());
    const unknown = linked.entities[2];

    expect(unknown.label).toBe("Réparation textile bioluminescente");
    expect(unknown.knowledge?.typeConceptId).toBe("core:activity");
    expect(unknown.knowledge?.conceptId).toBeUndefined();
    expect(unknown.knowledge?.matchStatus).toBe("unmatched");
  });

  it("enriches legacy graph entities idempotently without changing their evidence or relations", () => {
    const first = enrichSituationGraphWithKnowledge(graph, createCoreKnowledgeRegistry());
    const second = enrichSituationGraphWithKnowledge(first, createCoreKnowledgeRegistry());

    expect(second.entities).toEqual(first.entities);
    expect(second.relations).toEqual(graph.relations);
    expect(second.unresolvedRelations).toEqual(graph.unresolvedRelations);
  });

  it("links an activity mention to a universal domain and exposes its family path", () => {
    const domainGraph: SituationGraph = {
      entities: [{ id: "entity:agriculture", key: "agriculture", kind: "activity", label: "Agriculture", evidence: [] }],
      relations: [], unresolvedRelations: [],
    };
    const linked = enrichSituationGraphWithKnowledge(domainGraph, createUniversalKnowledgeRegistry());
    expect(linked.entities[0].knowledge).toMatchObject({
      matchStatus: "matched", conceptId: "domain:agriculture", conceptLabel: "Agriculture",
      classificationPath: [
        { id: "family:agriculture-living", label: "Agriculture et vivant" },
        { id: "domain:agriculture", label: "Agriculture" },
      ],
    });
  });


  it("links a cross-cutting legal specialization to its parent domain", () => {
    const specializationGraph: SituationGraph = {
      entities: [{ id: "entity:law", key: "law", kind: "activity", label: "Droit et services juridiques", evidence: [] }],
      relations: [], unresolvedRelations: [],
    };
    const linked = enrichSituationGraphWithKnowledge(specializationGraph, createUniversalKnowledgeRegistry());
    expect(linked.entities[0].knowledge).toMatchObject({
      matchStatus: "matched",
      conceptId: "specialization:law-legal-services",
      classificationPath: [
        { id: "domain:public-administration", label: "Administration publique" },
        { id: "specialization:law-legal-services", label: "Droit et services juridiques" },
      ],
    });
  });

  it("links agricultural subdomains and returns their complete family lineage", () => {
    const agricultureGraph: SituationGraph = {
      entities: [{ id: "entity:market-gardening", key: "market-gardening", kind: "activity", label: "maraîchage", evidence: [] }],
      relations: [], unresolvedRelations: [],
    };
    const linked = enrichSituationGraphWithKnowledge(agricultureGraph, createUniversalKnowledgeRegistry());
    expect(linked.entities[0].knowledge).toMatchObject({
      matchStatus: "matched",
      conceptId: "subdomain-v2:market-gardening",
      classificationPath: [
        { id: "family:agriculture-agrofood", label: "Agriculture et agroalimentaire" },
        { id: "domain-v2:crop-production", label: "Productions végétales" },
        { id: "subdomain-v2:market-gardening", label: "Maraîchage" },
      ],
    });
  });

  it("links a farmer role without changing the actor's original label", () => {
    const roleGraph: SituationGraph = {
      entities: [{ id: "entity:farmer", key: "farmer", kind: "actor", label: "Personne", role: "Agriculteur", evidence: [] }],
      relations: [], unresolvedRelations: [],
    };
    const linked = enrichSituationGraphWithKnowledge(roleGraph, createUniversalKnowledgeRegistry());
    expect(linked.entities[0].label).toBe("Personne");
    expect(linked.entities[0].knowledge).toMatchObject({
      matchStatus: "matched",
      conceptId: "occupation-v2:farmer",
      conceptLabel: "Agriculteur",
    });
  });

  it("links veterinary roles and animal-health activities to the second family", () => {
    const animalGraph: SituationGraph = {
      entities: [
        { id: "entity:veterinarian", key: "veterinarian", kind: "actor", label: "Personne", role: "vétérinaire", evidence: [] },
        { id: "entity:aviculture", key: "aviculture", kind: "activity", label: "volaille", evidence: [] },
      ],
      relations: [], unresolvedRelations: [],
    };
    const linked = enrichSituationGraphWithKnowledge(animalGraph, createUniversalKnowledgeRegistry());
    expect(linked.entities[0].label).toBe("Personne");
    expect(linked.entities[0].knowledge).toMatchObject({
      matchStatus: "matched",
      conceptId: "occupation-vet:veterinarian",
      classificationPath: [
        { id: "family:animals-veterinary", label: "Animaux et médecine vétérinaire" },
        { id: "domain-vet:veterinary-medicine", label: "Médecine vétérinaire et santé animale" },
      ],
    });
    expect(linked.entities[1].knowledge).toMatchObject({
      matchStatus: "matched",
      conceptId: "subdomain-vet:aviculture",
      classificationPath: [
        { id: "family:animals-veterinary", label: "Animaux et médecine vétérinaire" },
        { id: "domain:livestock", label: "Élevage" },
        { id: "subdomain-vet:aviculture", label: "Aviculture" },
      ],
    });
  });

  it("does not attach a canonical concept from a different semantic type", () => {
    const mismatchedGraph: SituationGraph = {
      ...graph,
      entities: [
        { id: "entity:actor-homonym", key: "actor-homonym", kind: "actor", label: "Activité", evidence: [] },
      ],
    };
    const linked = enrichSituationGraphWithKnowledge(mismatchedGraph, createCoreKnowledgeRegistry());

    expect(linked.entities[0].knowledge?.typeConceptId).toBe("core:actor");
    expect(linked.entities[0].knowledge?.conceptId).toBeUndefined();
    expect(linked.entities[0].knowledge?.matchStatus).toBe("unmatched");
  });
});
