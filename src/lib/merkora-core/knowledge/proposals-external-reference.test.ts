import { describe, expect, it } from "vitest";
import { addKnowledgeConcept, createUniversalKnowledgeRegistry } from "./registry";
import { approveKnowledgeProposal, createProjectKnowledgeProposal } from "./proposals";
import type { KnowledgeConcept } from "./types";

const externalReference = {
  system: "ESCO" as const,
  conceptType: "occupation" as const,
  uri: "https://data.europa.eu/esco/occupation/accountant",
  label: "Accountant",
  language: "en",
  datasetVersion: "ESCO API latest",
};

function addAccountantConcept() {
  const base = createUniversalKnowledgeRegistry();
  const occupation: KnowledgeConcept = {
    id: "occupation:accountant",
    canonicalKey: "merkora.occupation.accountant",
    conceptType: "occupation",
    definitions: [{ language: "en", label: "Accountant", definition: "Maintains financial records." }],
    terms: [{ value: "Accountant", language: "en", kind: "preferred" }],
    classifications: [],
    attributes: [],
    relationships: [],
    scope: { global: true },
    lifecycle: { status: "validated", version: 1, createdAt: "2026-11-15T00:00:00.000Z", updatedAt: "2026-11-15T00:00:00.000Z" },
    sources: [],
    reliability: { evidenceLevel: "documented", reviewStatus: "reviewed" },
  };
  return { registry: addKnowledgeConcept(base, occupation), occupation };
}

describe("reviewed ESCO proposal governance", () => {
  it("publishes an external mapping only after a reviewer approves a same-type occupation merge", () => {
    const { registry, occupation } = addAccountantConcept();
    const proposal = createProjectKnowledgeProposal({
      projectId: "project-1",
      label: "Comptable confirmé",
      language: "fr",
      sourceMessageId: "message-1",
      sourceQuote: "Je suis comptable confirmé.",
      externalReference,
    }, registry);

    const reviewed = approveKnowledgeProposal(registry, proposal, {
      reviewerId: "reviewer-1",
      conceptId: "unused-new-concept",
      canonicalKey: "unused.new.concept",
      conceptType: "occupation",
      definition: "Profil professionnel comptable.",
      language: "fr",
      scope: { global: true },
      mergeIntoConceptId: occupation.id,
      expectedConceptVersion: occupation.lifecycle.version,
    });

    const updated = reviewed.registry.concepts.find((concept) => concept.id === occupation.id);
    expect(reviewed.proposal.status).toBe("approved");
    expect(updated?.externalMappings?.some((mapping) => mapping.externalId === externalReference.uri)).toBe(true);
    expect(updated?.lifecycle.version).toBe(occupation.lifecycle.version + 1);
  });

  it("refuses to merge an occupation URI into a domain concept", () => {
    const registry = createUniversalKnowledgeRegistry();
    const domain = registry.concepts.find((concept) => concept.id === "domain:accounting-audit");
    if (!domain) throw new Error("Expected the accounting domain seed.");
    const proposal = createProjectKnowledgeProposal({
      projectId: "project-2",
      label: "Comptable",
      language: "fr",
      sourceMessageId: "message-2",
      sourceQuote: "Je suis comptable.",
      externalReference,
    }, registry);

    expect(() => approveKnowledgeProposal(registry, proposal, {
      reviewerId: "reviewer-1",
      conceptId: "unused",
      canonicalKey: "unused",
      conceptType: "occupation",
      definition: "Comptable.",
      language: "fr",
      scope: { global: true },
      mergeIntoConceptId: domain.id,
      expectedConceptVersion: domain.lifecycle.version,
    })).toThrow(/concept type/i);
  });

  it("keeps an unreviewed external candidate out of the shared registry", () => {
    const registry = createUniversalKnowledgeRegistry();
    const proposal = createProjectKnowledgeProposal({
      projectId: "project-3",
      label: "Métier local inconnu",
      language: "fr",
      sourceMessageId: "message-3",
      sourceQuote: "Mon métier est ...",
      externalReference,
    }, registry);

    expect(registry.concepts.some((concept) => concept.externalMappings?.some((mapping) => mapping.externalId === externalReference.uri))).toBe(false);
    expect(proposal.externalReference?.uri).toBe(externalReference.uri);
  });
});
