import type { EvidenceStatus } from "./types";

/**
 * Open vocabulary: the common values document the shared model, while string
 * extension keeps the graph usable for new and hybrid human situations.
 */
export type SituationEntityKind =
  | "actor"
  | "activity"
  | "event"
  | "process"
  | "object"
  | "resource"
  | "goal"
  | "problem"
  | "outcome"
  | "constraint"
  | "place"
  | "time"
  | "organization"
  | "concept"
  | (string & {});

export interface SituationEvidence {
  messageId: string;
  quote: string;
  role: "visitor";
  status: EvidenceStatus;
}

export interface SituationEntityObservation {
  key: string;
  kind: SituationEntityKind;
  label: string;
  role?: string;
  source: SituationEvidence;
}

export interface SituationRelationObservation {
  fromKey: string;
  predicate: string;
  toKey: string;
  source: SituationEvidence;
}

export interface SituationObservationBatch {
  entities: SituationEntityObservation[];
  relations: SituationRelationObservation[];
}

export interface SituationKnowledgeLink {
  typeConceptId?: string;
  typeConceptLabel?: string;
  conceptId?: string;
  conceptLabel?: string;
  matchStatus: "matched" | "type_only" | "ambiguous" | "unmatched";
  matchMethod?: "exact" | "normalized" | "synonym";
  confidence?: number;
  candidateConceptIds?: string[];
  classificationPath?: Array<{ id: string; label: string }>;
}

export interface SituationEntity {
  id: string;
  key: string;
  kind: SituationEntityKind;
  label: string;
  role?: string;
  evidence: SituationEvidence[];
  knowledge?: SituationKnowledgeLink;
}

export interface SituationRelation {
  id: string;
  fromEntityId: string;
  predicate: string;
  toEntityId: string;
  status: EvidenceStatus | "mixed";
  evidence: SituationEvidence[];
}

export interface UnresolvedSituationRelation {
  fromKey: string;
  predicate: string;
  toKey: string;
  reason: "missing_source" | "missing_target" | "missing_both";
  source: SituationEvidence;
}

export interface SituationGraph {
  entities: SituationEntity[];
  relations: SituationRelation[];
  unresolvedRelations: UnresolvedSituationRelation[];
}

function stableId(prefix: string, key: string): string {
  const normalized = key
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("fr")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${prefix}:${normalized}`;
}

function evidenceKey(evidence: SituationEvidence): string {
  return `${evidence.messageId}::${evidence.quote}::${evidence.status}`;
}

function addEvidence(target: SituationEvidence[], evidence: SituationEvidence): void {
  if (!target.some((item) => evidenceKey(item) === evidenceKey(evidence))) {
    target.push({ ...evidence });
  }
}

/**
 * Builds a domain-neutral graph from already extracted observations.
 *
 * This function deliberately does not interpret natural language. The
 * extraction layer must supply source-backed observations; this graph layer
 * merges identities, preserves provenance and refuses dangling relationships.
 */
export function buildSituationGraph(
  batches: SituationObservationBatch[],
): SituationGraph {
  const entities = new Map<string, SituationEntity>();
  const relations = new Map<string, SituationRelation>();
  const unresolvedRelations: UnresolvedSituationRelation[] = [];

  for (const batch of batches) {
    for (const observation of batch.entities) {
      const id = stableId("situation", observation.key);
      const existing = entities.get(observation.key);

      if (existing) {
        if (existing.kind !== observation.kind || existing.role !== observation.role) {
          // Do not silently rewrite an identity when its meaning changes.
          continue;
        }
        addEvidence(existing.evidence, observation.source);
        continue;
      }

      entities.set(observation.key, {
        id,
        key: observation.key,
        kind: observation.kind,
        label: observation.label,
        ...(observation.role ? { role: observation.role } : {}),
        evidence: [{ ...observation.source }],
      });
    }
  }

  for (const batch of batches) {
    for (const observation of batch.relations) {
      const from = entities.get(observation.fromKey);
      const to = entities.get(observation.toKey);

      if (!from || !to) {
        unresolvedRelations.push({
          ...observation,
          reason: !from && !to
            ? "missing_both"
            : !from
              ? "missing_source"
              : "missing_target",
        });
        continue;
      }

      const id = `${from.id}|${observation.predicate}|${to.id}`;
      const existing = relations.get(id);
      if (existing) {
        addEvidence(existing.evidence, observation.source);
        if (existing.status !== observation.source.status) existing.status = "mixed";
        continue;
      }

      relations.set(id, {
        id,
        fromEntityId: from.id,
        predicate: observation.predicate,
        toEntityId: to.id,
        status: observation.source.status,
        evidence: [{ ...observation.source }],
      });
    }
  }

  return {
    entities: [...entities.values()],
    relations: [...relations.values()],
    unresolvedRelations,
  };
}
