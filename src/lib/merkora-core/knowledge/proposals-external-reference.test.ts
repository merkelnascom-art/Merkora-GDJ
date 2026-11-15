import { describe, expect, it } from "vitest";
import { createUniversalKnowledgeRegistry } from "./registry";
import { approveKnowledgeProposal, createProjectKnowledgeProposal } from "./proposals";

const externalReference = {
  system: "ESCO" as const,
  uri: "https://data.europa.eu/esco/occupation/accountant",
  label: "Accountant",
  language: "en",
  datasetVersion: "ESCO API latest",
};

describe("reviewed ESCO proposal governance", () => {
  it("publishes an external mapping only after a reviewer approves a merge", () => {
    const registry = createUniversalKnowledgeRegistry();
    const target = registry.concepts.find((concept) => concept.id === "domain:accounting-audit");
    if (!target) throw new Error("Expected the accounting domain seed.");

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
      mergeIntoConceptId: target.id,
      expectedConceptVersion: target.lifecycle.version,
    });

    const updated = reviewed.registry.concepts.find((concept) => concept.id === target.id);
    expect(reviewed.proposal.status).toBe("approved");
    expect(updated?.externalMappings?.some((mapping) => mapping.externalId === externalReference.uri)).toBe(true);
    expect(updated?.lifecycle.version).toBe(target.lifecycle.version + 1);
  });

  it("keeps a rejected candidate out of the shared registry", () => {
    const registry = createUniversalKnowledgeRegistry();
    const proposal = createProjectKnowledgeProposal({
      projectId: "project-2",
      label: "Métier local inconnu",
      language: "fr",
      sourceMessageId: "message-2",
      sourceQuote: "Mon métier est ...",
      externalReference,
    }, registry);

    expect(registry.concepts.some((concept) => concept.externalMappings?.some((mapping) => mapping.externalId === externalReference.uri))).toBe(false);
    expect(proposal.externalReference?.uri).toBe(externalReference.uri);
  });
});
