import { CORE_KNOWLEDGE_CONCEPTS } from "./core-catalog";
import type { KnowledgeConcept, KnowledgeRegistry } from "./types";

export function createKnowledgeRegistry(concepts: KnowledgeConcept[] = []): KnowledgeRegistry {
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

  return { version: 1, concepts: concepts.map((concept) => ({ ...concept })) };
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
  const next = createKnowledgeRegistry([...registry.concepts, concept]);
  return { ...next, version: registry.version + 1 };
}
