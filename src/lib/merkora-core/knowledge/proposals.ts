import { addKnowledgeConcept } from "./registry";
import type {
  KnowledgeConcept,
  KnowledgeProposal,
  KnowledgeRegistry,
  KnowledgeScope,
} from "./types";

let proposalSequence = 0;

export interface CreateKnowledgeProposalInput {
  projectId: string;
  label: string;
  description?: string;
  language: string;
  sourceMessageId: string;
  sourceQuote: string;
  createdAt?: string;
}

export interface ApproveKnowledgeProposalInput {
  reviewerId: string;
  conceptId: string;
  canonicalKey: string;
  conceptType: string;
  definition: string;
  language: string;
  scope: KnowledgeScope;
  reviewedAt?: string;
  reason?: string;
}

export function createProjectKnowledgeProposal(
  input: CreateKnowledgeProposalInput,
): KnowledgeProposal {
  if (!input.projectId.trim() || !input.label.trim() || !input.sourceMessageId.trim() || !input.sourceQuote.trim()) {
    throw new Error("A project, label, source message and source quote are required.");
  }

  return {
    id: `knowledge-proposal-${Date.now()}-${++proposalSequence}`,
    projectId: input.projectId,
    label: input.label.trim(),
    ...(input.description?.trim() ? { description: input.description.trim() } : {}),
    language: input.language,
    sourceMessageId: input.sourceMessageId,
    sourceQuote: input.sourceQuote,
    createdAt: input.createdAt ?? new Date().toISOString(),
    status: "proposed",
  };
}

export function approveKnowledgeProposal(
  registry: KnowledgeRegistry,
  proposal: KnowledgeProposal,
  review: ApproveKnowledgeProposalInput,
): { registry: KnowledgeRegistry; proposal: KnowledgeProposal } {
  if (proposal.status !== "proposed") throw new Error("Only a pending knowledge proposal can be approved.");

  const reviewedAt = review.reviewedAt ?? new Date().toISOString();
  const concept: KnowledgeConcept = {
    id: review.conceptId,
    canonicalKey: review.canonicalKey,
    conceptType: review.conceptType,
    definitions: [{
      language: review.language,
      label: proposal.label,
      definition: review.definition,
    }],
    terms: [{ value: proposal.label, language: review.language, kind: "preferred" }],
    classifications: [],
    attributes: [],
    relationships: [],
    scope: { ...review.scope },
    lifecycle: {
      status: "validated",
      version: 1,
      createdAt: reviewedAt,
      updatedAt: reviewedAt,
    },
    // The shared registry receives review provenance, not the private project quote.
    sources: [{
      id: `source:review:${proposal.id}`,
      sourceType: "human_review",
      label: "Proposition validée par une revue humaine",
    }],
    reliability: {
      evidenceLevel: "single_source",
      reviewStatus: "reviewed",
      lastVerifiedAt: reviewedAt,
      verificationNotes: review.reason ? [review.reason] : [],
    },
  };

  return {
    registry: addKnowledgeConcept(registry, concept),
    proposal: {
      ...proposal,
      status: "approved",
      reviewedAt,
      approvedConceptId: concept.id,
      review: { reviewerId: review.reviewerId, ...(review.reason ? { reason: review.reason } : {}) },
    },
  };
}

export function rejectKnowledgeProposal(
  registry: KnowledgeRegistry,
  proposal: KnowledgeProposal,
  reviewerId: string,
  reason: string,
  reviewedAt = new Date().toISOString(),
): { registry: KnowledgeRegistry; proposal: KnowledgeProposal } {
  if (proposal.status !== "proposed") throw new Error("Only a pending knowledge proposal can be rejected.");

  return {
    registry,
    proposal: {
      ...proposal,
      status: "rejected",
      reviewedAt,
      review: { reviewerId, reason },
    },
  };
}
