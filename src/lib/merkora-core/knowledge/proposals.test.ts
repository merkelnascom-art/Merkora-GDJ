import { describe, expect, it } from "vitest";
import { createKnowledgeRegistry } from "./registry";
import {
  approveKnowledgeProposal,
  createProjectKnowledgeProposal,
  rejectKnowledgeProposal,
} from "./proposals";

describe("project-scoped unknown knowledge proposals", () => {
  const input = {
    projectId: "project-123",
    label: "Réparation textile bioluminescente",
    description: "Procédé expérimental décrit par le porteur du projet.",
    language: "fr",
    sourceMessageId: "message-9",
    sourceQuote: "Je développe une réparation textile bioluminescente.",
    createdAt: "2026-11-15T10:00:00.000Z",
  };

  it("keeps an unknown concept as a project proposal without changing the shared registry", () => {
    const registry = createKnowledgeRegistry([]);
    const proposal = createProjectKnowledgeProposal(input);

    expect(proposal.projectId).toBe("project-123");
    expect(proposal.sourceQuote).toBe(input.sourceQuote);
    expect(proposal.status).toBe("proposed");
    expect(registry.concepts).toHaveLength(0);
  });

  it("publishes a concept only after explicit review and preserves the proposal provenance privately", () => {
    const registry = createKnowledgeRegistry([]);
    const proposal = createProjectKnowledgeProposal(input);
    const result = approveKnowledgeProposal(registry, proposal, {
      reviewerId: "reviewer-1",
      conceptId: "custom:bioluminescent-repair",
      canonicalKey: "custom.bioluminescent-repair",
      conceptType: "emerging_practice",
      definition: "Pratique de réparation textile utilisant un procédé bioluminescent expérimental.",
      language: "fr",
      scope: { global: false },
      reviewedAt: "2026-11-15T11:00:00.000Z",
    });

    expect(result.proposal.status).toBe("approved");
    expect(result.registry.concepts).toHaveLength(1);
    expect(result.registry.concepts[0].lifecycle.status).toBe("validated");
    expect(result.registry.concepts[0].sources[0].sourceType).toBe("human_review");
    expect(JSON.stringify(result.registry)).not.toContain(input.sourceQuote);
  });

  it("does not publish a rejected proposal", () => {
    const registry = createKnowledgeRegistry([]);
    const proposal = createProjectKnowledgeProposal(input);
    const result = rejectKnowledgeProposal(registry, proposal, "reviewer-2", "Définition insuffisante.");

    expect(result.proposal.status).toBe("rejected");
    expect(result.registry.concepts).toHaveLength(0);
    expect(result.proposal.review?.reason).toBe("Définition insuffisante.");
  });
});
