import type { SituationGraph } from "../situation-graph";
import { createCoreKnowledgeRegistry, getKnowledgeConcept } from "./registry";
import { matchKnowledgeConcept } from "./matching";
import type { KnowledgeRegistry } from "./types";

const DEFAULT_REGISTRY = createCoreKnowledgeRegistry();

const TYPE_CONCEPT_IDS: Record<string, string> = {
  actor: "core:actor",
  activity: "core:activity",
  event: "core:event",
  process: "core:process",
  object: "core:object",
  resource: "core:resource",
  goal: "core:goal",
  problem: "core:problem",
  outcome: "core:outcome",
  constraint: "core:constraint",
  place: "core:place",
  time: "core:time",
  organization: "core:organization",
  concept: "core:concept",
};

export function enrichSituationGraphWithKnowledge(
  graph: SituationGraph,
  registry: KnowledgeRegistry = DEFAULT_REGISTRY,
): SituationGraph {
  return {
    ...graph,
    entities: graph.entities.map((entity) => {
      const typeConceptId = TYPE_CONCEPT_IDS[entity.kind];
      const typeConcept = typeConceptId ? getKnowledgeConcept(registry, typeConceptId) : undefined;
      const match = matchKnowledgeConcept(entity.label, registry);

      return {
        ...entity,
        knowledge: {
          ...(typeConcept ? {
            typeConceptId: typeConcept.id,
            typeConceptLabel: typeConcept.definitions.find((definition) => definition.language === "fr")?.label
              ?? typeConcept.definitions[0]?.label
              ?? typeConcept.id,
          } : {}),
          matchStatus: match.status,
          ...(match.status === "matched" ? {
            conceptId: match.concept.id,
            conceptLabel: match.concept.definitions.find((definition) => definition.language === "fr")?.label
              ?? match.concept.definitions[0]?.label
              ?? match.concept.id,
            matchMethod: match.method,
            confidence: match.confidence,
          } : {}),
          ...(match.status === "type_only" ? {
            conceptId: match.concept.id,
            conceptLabel: match.concept.definitions.find((definition) => definition.language === "fr")?.label
              ?? match.concept.definitions[0]?.label
              ?? match.concept.id,
            confidence: match.confidence,
          } : {}),
          ...(match.status === "ambiguous" ? {
            candidateConceptIds: match.candidates.map((candidate) => candidate.id),
          } : {}),
        },
      };
    }),
  };
}
