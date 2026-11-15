import { CORE_KNOWLEDGE_CONCEPTS } from "./core-catalog";
import type { KnowledgeConcept, KnowledgeRegistry, KnowledgeRelationship } from "./types";

export function createKnowledgeRegistry(
  concepts: KnowledgeConcept[] = [],
  relationships: KnowledgeRelationship[] = [],
  conceptHistory: KnowledgeConcept[] = [],
): KnowledgeRegistry {
  const ids = new Set<string>();
  const canonicalKeys = new Set<string>();

  for (const concept of concepts) {
    if (!concept.id.trim() || !concept.canonicalKey.trim()) {
      throw new Error("Knowledge concepts require a stable identifier and canonical key.");
    }
    if (ids.has(concept.id)) {
      throw new Error(`Duplicate knowledge concept identifier: ${concept.id}`);
    }
    if (canonicalKeys.has(concept.canonicalKey)) {
      throw new Error(`Duplicate knowledge canonical key: ${concept.canonicalKey}`);
    }
    if (!Number.isInteger(concept.lifecycle.version) || concept.lifecycle.version < 1) {
      throw new Error(`Knowledge concept ${concept.id} has an invalid version.`);
    }
    ids.add(concept.id);
    canonicalKeys.add(concept.canonicalKey);
  }

  const allRelationships = new Map<string, KnowledgeRelationship>();
  const addRelationship = (relationship: KnowledgeRelationship) => {
    const existing = allRelationships.get(relationship.id);
    if (existing) {
      if (JSON.stringify(existing) !== JSON.stringify(relationship)) {
        throw new Error(`Conflicting knowledge relationship identifier: ${relationship.id}`);
      }
      return;
    }
    allRelationships.set(relationship.id, relationship);
  };

  for (const concept of concepts) {
    for (const relationship of concept.relationships) {
      if (relationship.sourceConceptId !== concept.id) {
        throw new Error(`Knowledge relationship ${relationship.id} must originate from its owning concept.`);
      }
      addRelationship(relationship);
    }
    for (const classification of concept.classifications) {
      if (classification.parentConceptId && !ids.has(classification.parentConceptId)) {
        throw new Error(`Knowledge classification on ${concept.id} references an unknown parent concept.`);
      }
    }
  }
  for (const relationship of relationships) addRelationship(relationship);

  for (const relationship of allRelationships.values()) {
    if (!ids.has(relationship.sourceConceptId) || !ids.has(relationship.targetConceptId)) {
      throw new Error(`Knowledge relationship ${relationship.id} references an unknown concept.`);
    }
    if (!Number.isInteger(relationship.version) || relationship.version < 1) {
      throw new Error(`Knowledge relationship ${relationship.id} has an invalid version.`);
    }
    if (relationship.confidence !== undefined &&
      (!Number.isFinite(relationship.confidence) || relationship.confidence < 0 || relationship.confidence > 1)) {
      throw new Error(`Knowledge relationship ${relationship.id} has an invalid confidence score.`);
    }
  }

  const historyVersions = new Set<string>();
  for (const historical of conceptHistory) {
    const current = concepts.find((concept) => concept.id === historical.id);
    if (!current || historical.canonicalKey !== current.canonicalKey || historical.lifecycle.version >= current.lifecycle.version) {
      throw new Error(`Invalid historical version for knowledge concept ${historical.id}.`);
    }
    const key = `${historical.id}@${historical.lifecycle.version}`;
    if (historyVersions.has(key)) throw new Error(`Duplicate knowledge concept history version: ${key}`);
    historyVersions.add(key);
  }

  return {
    version: 1,
    concepts: concepts.map((concept) => ({
      ...concept,
      definitions: [...concept.definitions],
      terms: [...concept.terms],
      classifications: [...concept.classifications],
      attributes: [...concept.attributes],
      relationships: [...concept.relationships],
      scope: { ...concept.scope },
      sources: [...concept.sources],
      reliability: { ...concept.reliability, verificationNotes: concept.reliability.verificationNotes ? [...concept.reliability.verificationNotes] : undefined },
    })),
    relationships: [...allRelationships.values()].map((relationship) => ({ ...relationship })),
    conceptHistory: conceptHistory.map((concept) => ({
      ...concept,
      definitions: [...concept.definitions],
      terms: [...concept.terms],
      classifications: [...concept.classifications],
      attributes: [...concept.attributes],
      relationships: [...concept.relationships],
      scope: { ...concept.scope },
      sources: [...concept.sources],
      reliability: { ...concept.reliability, verificationNotes: concept.reliability.verificationNotes ? [...concept.reliability.verificationNotes] : undefined },
    })),
  };
}

export function createCoreKnowledgeRegistry(): KnowledgeRegistry {
  return createKnowledgeRegistry(CORE_KNOWLEDGE_CONCEPTS);
}

export function getKnowledgeConcept(
  registry: KnowledgeRegistry,
  conceptId: string,
): KnowledgeConcept | undefined {
  return registry.concepts.find((concept) => concept.id === conceptId);
}

export function addKnowledgeConcept(
  registry: KnowledgeRegistry,
  concept: KnowledgeConcept,
): KnowledgeRegistry {
  const next = createKnowledgeRegistry(
    [...registry.concepts, concept],
    registry.relationships,
    registry.conceptHistory,
  );
  return { ...next, version: registry.version + 1 };
}

export function addKnowledgeRelationship(
  registry: KnowledgeRegistry,
  relationship: KnowledgeRelationship,
): KnowledgeRegistry {
  const next = createKnowledgeRegistry(
    registry.concepts,
    [...registry.relationships, relationship],
    registry.conceptHistory,
  );
  return { ...next, version: registry.version + 1 };
}

/**
 * Creates a new immutable version and archives the previous snapshot.
 * expectedVersion prevents concurrent or stale edits from silently overwriting
 * a more recent knowledge revision.
 */
export function reviseKnowledgeConcept(
  registry: KnowledgeRegistry,
  conceptId: string,
  expectedVersion: number,
  changes: Partial<Omit<KnowledgeConcept, "id" | "canonicalKey" | "lifecycle">>,
  updatedAt = new Date().toISOString(),
): KnowledgeRegistry {
  const current = getKnowledgeConcept(registry, conceptId);
  if (!current) throw new Error(`Knowledge concept not found: ${conceptId}`);
  if (current.lifecycle.version !== expectedVersion) {
    throw new Error(`Knowledge concept version conflict: expected ${expectedVersion}, found ${current.lifecycle.version}.`);
  }

  const revised: KnowledgeConcept = {
    ...current,
    ...changes,
    id: current.id,
    canonicalKey: current.canonicalKey,
    lifecycle: {
      ...current.lifecycle,
      version: current.lifecycle.version + 1,
      updatedAt,
    },
  };

  const next = createKnowledgeRegistry(
    registry.concepts.map((concept) => concept.id === conceptId ? revised : concept),
    registry.relationships,
    [...registry.conceptHistory, current],
  );
  return { ...next, version: registry.version + 1 };
}
