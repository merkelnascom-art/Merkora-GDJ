import { describe, expect, it } from "vitest";
import { createCoreKnowledgeRegistry } from "./registry";
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
});
