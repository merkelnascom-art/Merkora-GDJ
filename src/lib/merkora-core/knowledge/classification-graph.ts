import type { KnowledgeConcept, KnowledgeRegistry } from "./types";

function classificationParent(
  concept: KnowledgeConcept,
  classificationType: string,
): string | undefined {
  return concept.classifications.find(
    (classification) => classification.classificationType === classificationType,
  )?.parentConceptId;
}

/**
 * Returns the classification path from the highest known ancestor to the
 * requested concept. A concept may participate in several independent trees.
 */
export function getClassificationLineage(
  registry: KnowledgeRegistry,
  conceptId: string,
  classificationType: string,
): KnowledgeConcept[] {
  const start = registry.concepts.find((concept) => concept.id === conceptId);
  if (!start) return [];

  const path: KnowledgeConcept[] = [];
  const visited = new Set<string>();
  let current: KnowledgeConcept | undefined = start;

  while (current) {
    if (visited.has(current.id)) {
      throw new Error(`Classification cycle detected while resolving ${conceptId}.`);
    }
    visited.add(current.id);
    path.push(current);
    const parentId = classificationParent(current, classificationType);
    current = parentId
      ? registry.concepts.find((concept) => concept.id === parentId)
      : undefined;
  }

  return path.reverse();
}

/**
 * Returns descendants in deterministic breadth-first order. The starting
 * concept is excluded and each concept is returned at most once.
 */
export function getClassificationDescendants(
  registry: KnowledgeRegistry,
  conceptId: string,
  classificationType: string,
): KnowledgeConcept[] {
  if (!registry.concepts.some((concept) => concept.id === conceptId)) return [];

  const descendants: KnowledgeConcept[] = [];
  const visited = new Set<string>([conceptId]);
  const queue = [conceptId];

  while (queue.length > 0) {
    const parentId = queue.shift()!;
    for (const candidate of registry.concepts) {
      if (classificationParent(candidate, classificationType) !== parentId || visited.has(candidate.id)) continue;
      visited.add(candidate.id);
      descendants.push(candidate);
      queue.push(candidate.id);
    }
  }

  return descendants;
}
