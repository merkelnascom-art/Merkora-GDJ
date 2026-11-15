import { addKnowledgeConcept, reviseKnowledgeConcept } from "./registry";
import { normalizeKnowledgeTerm } from "./normalization";
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
  /** Merge as a reviewed local synonym into an existing canonical concept. */
  mergeIntoConceptId?: string;
  expectedConceptVersion?: number;
}

export function findKnowledgeProposalDuplicates(
  proposal: Pick<KnowledgeProposal, "label" | "language">,
  registry: KnowledgeRegistry,
): string[] {
  const target = normalizeKnowledgeTerm(proposal.label);
  if (!target) return [];
  return registry.concepts.filter((concept) =>
    concept.lifecycle.status !== "rejected" &&
    concept.terms.some((term) =>
      (!proposal.language || proposal.language === "und" || term.language === proposal.language) &&
      normalizeKnowledgeTerm(term.value) === target,
    ),
  ).map((concept) => concept.id);
}

export function createProjectKnowledgeProposal(
  input: CreateKnowledgeProposalInput,
  registry?: KnowledgeRegistry,
): KnowledgeProposal {
  if (!input.projectId.trim() || !input.label.trim() || !input.sourceMessageId.trim() || !input.sourceQuote.trim()) {
    throw new Error("A project, label, source message and source quote are required.");
  }
  const proposal: KnowledgeProposal = {
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
  const duplicates = registry ? findKnowledgeProposalDuplicates(proposal, registry) : [];
  return duplicates.length ? { ...proposal, possibleDuplicateConceptIds: duplicates } : proposal;
}

export function submitKnowledgeProposalForReview(
  proposal: KnowledgeProposal,
  projectId: string,
): KnowledgeProposal {
  if (proposal.projectId !== projectId) throw new Error("Only the owning project can submit this proposal for review.");
  if (proposal.status !== "proposed") throw new Error("Only a new proposal can enter review.");
  return { ...proposal, status: "under_review" };
}

export function approveKnowledgeProposal(
  registry: KnowledgeRegistry,
  proposal: KnowledgeProposal,
  review: ApproveKnowledgeProposalInput,
): { registry: KnowledgeRegistry; proposal: KnowledgeProposal } {
  if (proposal.status !== "proposed" && proposal.status !== "under_review") {
    throw new Error("Only a pending knowledge proposal can be approved.");
  }
  const reviewedAt = review.reviewedAt ?? new Date().toISOString();
  if (review.mergeIntoConceptId) {
    const existing = registry.concepts.find((concept) => concept.id === review.mergeIntoConceptId);
    if (!existing) throw new Error("The target concept for this proposal merge does not exist.");
    if (existing.lifecycle.version !== review.expectedConceptVersion) {
      throw new Error("The target concept version changed; refresh the review before merging.");
    }
    const duplicate = existing.terms.some((term) =>
      term.language === review.language && normalizeKnowledgeTerm(term.value) === normalizeKnowledgeTerm(proposal.label),
    );
    const next = duplicate ? registry : reviseKnowledgeConcept(
      registry,
      existing.id,
      existing.lifecycle.version,
      {
        terms: [...existing.terms, { value: proposal.label, language: review.language, kind: "local" }],
        sources: [...existing.sources, {
          id: `source:review:${proposal.id}`,
          sourceType: "human_review",
          label: "Terme local validé par une revue humaine",
        }],
      },
      reviewedAt,
    );
    return {
      registry: next,
      proposal: {
        ...proposal,
        status: "approved",
        reviewedAt,
        approvedConceptId: existing.id,
        review: { reviewerId: review.reviewerId, ...(review.reason ? { reason: review.reason } : {}) },
      },
    };
  }

  const concept: KnowledgeConcept = {
    id: review.conceptId,
    canonicalKey: review.canonicalKey,
    conceptType: review.conceptType,
    definitions: [{ language: review.language, label: proposal.label, definition: review.definition }],
    terms: [{ value: proposal.label, language: review.language, kind: "preferred" }],
    classifications: [],
    attributes: [],
    relationships: [],
    scope: { ...review.scope },
    lifecycle: { status: "validated", version: 1, createdAt: reviewedAt, updatedAt: reviewedAt },
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
  if (proposal.status !== "proposed" && proposal.status !== "under_review") {
    throw new Error("Only a pending knowledge proposal can be rejected.");
  }
  return {
    registry,
    proposal: { ...proposal, status: "rejected", reviewedAt, review: { reviewerId, reason } },
  };
}
