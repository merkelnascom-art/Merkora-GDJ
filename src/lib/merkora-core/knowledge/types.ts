export type KnowledgeConceptType = string & {};

export type KnowledgeLifecycleStatus =
  | "proposed"
  | "under_review"
  | "validated"
  | "contested"
  | "deprecated"
  | "rejected";

export type KnowledgeTermKind =
  | "preferred"
  | "synonym"
  | "local"
  | "abbreviation"
  | "variant";

export interface KnowledgeDefinition {
  language: string;
  label: string;
  definition: string;
  shortDescription?: string;
}

export interface KnowledgeTerm {
  value: string;
  language: string;
  kind: KnowledgeTermKind;
  region?: string;
  usage?: string;
}

export interface KnowledgeClassification {
  classificationType: string;
  parentConceptId?: string;
  domainId?: string;
}

export interface KnowledgeAttributeDefinition {
  key: string;
  valueType: string;
  description: string;
  required?: boolean;
}

export interface KnowledgeRelationship {
  id: string;
  sourceConceptId: string;
  targetConceptId: string;
  predicate: string;
  status: "proposed" | "validated" | "contested" | "deprecated";
  confidence?: number;
  conditions?: Record<string, unknown>;
  sourceIds: string[];
  version: number;
}

export interface KnowledgeScope {
  global: boolean;
  countries?: string[];
  jurisdictions?: string[];
  regions?: string[];
  projectIds?: string[];
}

export interface KnowledgeSource {
  id: string;
  sourceType: string;
  reference?: string;
  label?: string;
  publishedAt?: string;
  retrievedAt?: string;
}

export interface KnowledgeReliability {
  evidenceLevel:
    | "authoritative"
    | "documented"
    | "corroborated"
    | "single_source"
    | "unverified";
  reviewStatus: "not_reviewed" | "reviewed" | "needs_update" | "disputed";
  validFrom?: string;
  validUntil?: string;
  lastVerifiedAt?: string;
  verificationNotes?: string[];
}

export interface KnowledgeExternalMapping {
  system: string;
  externalId: string;
  uri?: string;
  datasetVersion: string;
  language?: string;
  matchType: "exact" | "close" | "broader" | "narrower" | "related";
  importedAt: string;
}

export interface KnowledgeRelationshipVersion {
  relationshipId: string;
  version: number;
  snapshot: KnowledgeRelationship;
  archivedAt: string;
}

export interface KnowledgeConcept {
  id: string;
  canonicalKey: string;
  conceptType: KnowledgeConceptType;
  definitions: KnowledgeDefinition[];
  terms: KnowledgeTerm[];
  classifications: KnowledgeClassification[];
  attributes: KnowledgeAttributeDefinition[];
  relationships: KnowledgeRelationship[];
  externalMappings?: KnowledgeExternalMapping[];
  scope: KnowledgeScope;
  lifecycle: {
    status: KnowledgeLifecycleStatus;
    version: number;
    createdAt: string;
    updatedAt: string;
    deprecatedById?: string;
  };
  sources: KnowledgeSource[];
  reliability: KnowledgeReliability;
}

export interface KnowledgeRegistry {
  version: number;
  concepts: KnowledgeConcept[];
  relationships: KnowledgeRelationship[];
  /** Immutable snapshots of superseded concept versions. */
  conceptHistory: KnowledgeConcept[];
  relationshipHistory?: KnowledgeRelationshipVersion[];
}

export interface KnowledgeProposal {
  id: string;
  projectId: string;
  label: string;
  description?: string;
  language: string;
  sourceMessageId: string;
  sourceQuote: string;
  createdAt: string;
  status: "proposed" | "under_review" | "approved" | "rejected";
  possibleDuplicateConceptIds?: string[];
  reviewedAt?: string;
  review?: {
    reviewerId: string;
    reason?: string;
  };
  approvedConceptId?: string;
}
