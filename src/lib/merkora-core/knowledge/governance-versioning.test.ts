import { describe, expect, it } from "vitest";
import { createKnowledgeRegistry, reviseKnowledgeRelationship } from "./registry";
import { createProjectKnowledgeProposal, findKnowledgeProposalDuplicates, approveKnowledgeProposal } from "./proposals";
import type { KnowledgeConcept, KnowledgeRelationship } from "./types";

const concept = (id: string, label: string, type = "occupation"): KnowledgeConcept => ({
  id, canonicalKey: id, conceptType: type,
  definitions: [{ language: "fr", label, definition: label }],
  terms: [{ value: label, language: "fr", kind: "preferred" }],
  classifications: [], attributes: [], relationships: [],
  scope: { global: true },
  lifecycle: { status: "validated", version: 1, createdAt: "2026-11-15T00:00:00.000Z", updatedAt: "2026-11-15T00:00:00.000Z" },
  sources: [], reliability: { evidenceLevel: "documented", reviewStatus: "reviewed" },
});

describe("knowledge governance and relationship history", () => {
  it("finds same-language duplicates before a proposal is published", () => {
    const registry = createKnowledgeRegistry([concept("occupation:teacher", "Enseignant")]);
    const proposal = createProjectKnowledgeProposal({
      projectId: "p1", label: "enseignant", language: "fr",
      sourceMessageId: "m1", sourceQuote: "Je suis enseignant.",
    }, registry);
    expect(proposal.possibleDuplicateConceptIds).toEqual(["occupation:teacher"]);
    expect(findKnowledgeProposalDuplicates(proposal, registry)).toEqual(["occupation:teacher"]);
  });

  it("merges an approved local term into an existing concept using optimistic versioning", () => {
    const registry = createKnowledgeRegistry([concept("occupation:teacher", "Enseignant")]);
    const proposal = createProjectKnowledgeProposal({
      projectId: "p1", label: "Professeur", language: "fr",
      sourceMessageId: "m1", sourceQuote: "Je suis professeur.",
    }, registry);
    const result = approveKnowledgeProposal(registry, proposal, {
      reviewerId: "admin:1", conceptId: "unused", canonicalKey: "unused",
      conceptType: "occupation", definition: "Métier d'enseignement.", language: "fr",
      scope: { global: true }, mergeIntoConceptId: "occupation:teacher", expectedConceptVersion: 1,
    });
    expect(result.proposal.approvedConceptId).toBe("occupation:teacher");
    expect(result.registry.concepts[0].lifecycle.version).toBe(2);
    expect(result.registry.concepts[0].terms.some((term) => term.value === "Professeur" && term.kind === "local")).toBe(true);
    expect(result.registry.conceptHistory[0].lifecycle.version).toBe(1);
  });

  it("archives the prior relationship snapshot and rejects stale revisions", () => {
    const a = concept("a", "A", "thing");
    const b = concept("b", "B", "thing");
    const relation: KnowledgeRelationship = {
      id: "rel:a-b", sourceConceptId: "a", targetConceptId: "b",
      predicate: "related_to", status: "validated", sourceIds: [], version: 1,
    };
    const registry = createKnowledgeRegistry([a, b], [relation]);
    const revised = reviseKnowledgeRelationship(registry, relation.id, 1, { predicate: "depends_on" }, "2026-11-15T12:00:00.000Z");
    expect(revised.relationships[0].version).toBe(2);
    expect(revised.relationships[0].predicate).toBe("depends_on");
    expect(revised.relationshipHistory?.[0].snapshot.predicate).toBe("related_to");
    expect(() => reviseKnowledgeRelationship(revised, relation.id, 1, {})).toThrow(/version conflict/i);
  });
});
