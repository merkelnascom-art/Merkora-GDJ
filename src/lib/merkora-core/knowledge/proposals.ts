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
  externalReference?: KnowledgeProposal["externalReference"];
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
    ...(input.externalReference ? { externalReference: { ...input.externalReference } } : {}),
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
    if (proposal.externalReference && existing.conceptType !== proposal.externalReference.conceptType) {
      throw new Error("The external reference concept type does not match the target concept type.");
    }
    if (existing.lifecycle.version !== review.expectedConceptVersion) {
      throw new Error("The target concept version changed; refresh the review before merging.");
    }
    const duplicate = existing.terms.some((term) =>
      term.language === review.language && normalizeKnowledgeTerm(term.value) === normalizeKnowledgeTerm(proposal.label),
    );
    const approvedExternalMapping = proposal.externalReference
      ? {
          system: proposal.externalReference.system,
          externalId: proposal.externalReference.uri,
          uri: proposal.externalReference.uri,
          datasetVersion: proposal.externalReference.datasetVersion,
          language: proposal.externalReference.language,
          matchType: "exact" as const,
          importedAt: reviewedAt,
        }
      : undefined;
    const externalMappings = [...(existing.externalMappings ?? [])];
    if (approvedExternalMapping && !externalMappings.some((mapping) =>
      mapping.system === approvedExternalMapping.system && mapping.externalId === approvedExternalMapping.externalId,
    )) externalMappings.push(approvedExternalMapping);
    const hasNewMapping = externalMappings.length !== (existing.externalMappings ?? []).length;
    const next = duplicate && !hasNewMapping ? registry : reviseKnowledgeConcept(
      registry,
      existing.id,
      existing.lifecycle.version,
      {
        terms: duplicate ? existing.terms : [...existing.terms, { value: proposal.label, language: review.language, kind: "local" }],
        externalMappings,
        sources: [...existing.sources, {
          id: `source:review:${proposal.id}`,
          sourceType: "human_review",
          label: approvedExternalMapping
            ? "Rapprochement ESCO validé par une revue humaine"
            : "Terme local validé par une revue humaine",
          ...(approvedExternalMapping ? { reference: approvedExternalMapping.uri } : {}),
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

  if (proposal.externalReference && review.conceptType !== proposal.externalReference.conceptType) {
    throw new Error("The reviewed concept type does not match the external reference concept type.");
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
    ...(proposal.externalReference ? {
      externalMappings: [{
        system: proposal.externalReference.system,
        externalId: proposal.externalReference.uri,
        uri: proposal.externalReference.uri,
        datasetVersion: proposal.externalReference.datasetVersion,
        language: proposal.externalReference.language,
        matchType: "exact" as const,
        importedAt: reviewedAt,
      }],
    } : {}),
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
