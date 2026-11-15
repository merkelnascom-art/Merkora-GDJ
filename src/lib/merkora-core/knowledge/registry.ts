import { CORE_KNOWLEDGE_CONCEPTS } from "./core-catalog";
import type { KnowledgeConcept, KnowledgeRegistry, KnowledgeRelationship } from "./types";

export function createKnowledgeRegistry(
  concepts: KnowledgeConcept[] = [],
  relationships: KnowledgeRelationship[] = [],
): KnowledgeRegistry {
  const ids = new Set<string>();
  const canonicalKeys = new Set<string>();

  for (const concept of concepts) {
    if (ids.has(concept.id)) {
      throw new Error(`Duplicate knowledge concept identifier: ${concept.id}`);
    }
    if (canonicalKeys.has(concept.canonicalKey)) {
      throw new Error(`Duplicate knowledge canonical key: ${concept.canonicalKey}`);
    }
    ids.add(concept.id);
    canonicalKeys.add(concept.canonicalKey);
  }

  const relationIds = new Set<string>();
  for (const relationship of relationships) {
    if (relationIds.has(relationship.id)) {
      throw new Error(`Duplicate knowledge relationship identifier: ${relationship.id}`);
    }
    if (!ids.has(relationship.sourceConceptId) || !ids.has(relationship.targetConceptId)) {
      throw new Error(`Knowledge relationship ${relationship.id} references an unknown concept.`);
    }
    relationIds.add(relationship.id);
  }

  return {
    version: 1,
    concepts: concepts.map((concept) => ({ ...concept })),
    relationships: relationships.map((relationship) => ({ ...relationship })),
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
  const next = createKnowledgeRegistry([...registry.concepts, concept], registry.relationships);
  return { ...next, version: registry.version + 1 };
}

export function addKnowledgeRelationship(
  registry: KnowledgeRegistry,
  relationship: KnowledgeRelationship,
): KnowledgeRegistry {
  const next = createKnowledgeRegistry(registry.concepts, [...registry.relationships, relationship]);
  return { ...next, version: registry.version + 1 };
}
