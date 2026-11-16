import type { SituationGraph } from "../situation-graph";
import { createUniversalKnowledgeRegistry, getKnowledgeConcept } from "./registry";
import { getClassificationLineage } from "./classification-graph";
import { matchKnowledgeConcept } from "./matching";
import type { KnowledgeConcept, KnowledgeRegistry } from "./types";

const DEFAULT_REGISTRY = createUniversalKnowledgeRegistry();

const TYPE_CONCEPT_IDS: Record<string, string> = {
  actor: "core:actor", activity: "core:activity", event: "core:event",
  process: "core:process", object: "core:object", resource: "core:resource",
  goal: "core:goal", problem: "core:problem", outcome: "core:outcome",
  constraint: "core:constraint", place: "core:place", time: "core:time",
  organization: "core:organization", concept: "core:concept",
};

function label(concept: KnowledgeConcept, language = "fr"): string {
  return concept.definitions.find((item) => item.language === language)?.label
    ?? concept.definitions.find((item) => item.language === "fr")?.label
    ?? concept.definitions[0]?.label
    ?? concept.id;
}

function activityMatch(query: string, registry: KnowledgeRegistry, language?: string) {
  const domain = matchKnowledgeConcept(query, registry, { expectedType: "domain", language });
  const subdomain = matchKnowledgeConcept(query, registry, { expectedType: "subdomain", language });
  const specialization = matchKnowledgeConcept(query, registry, { expectedType: "specialization", language });
  const occupation = matchKnowledgeConcept(query, registry, { expectedType: "occupation", language });
  const matches = [domain, subdomain, specialization, occupation].filter((result) => result.status === "matched");
  if (matches.length === 1) return matches[0];
  if (matches.length > 1) {
    const candidates = matches.map((result) => result.concept);
    return { status: "ambiguous" as const, query, candidates };
  }
  const ambiguous = [domain, subdomain, specialization, occupation].filter((result) => result.status === "ambiguous");
  if (ambiguous.length) {
    return { status: "ambiguous" as const, query, candidates: ambiguous.flatMap((result) => result.candidates) };
  }
  return matchKnowledgeConcept(query, registry, { expectedType: "activity", language });
}

export function enrichSituationGraphWithKnowledge(
  graph: SituationGraph,
  registry: KnowledgeRegistry = DEFAULT_REGISTRY,
  language?: string,
): SituationGraph {
  return {
    ...graph,
    entities: graph.entities.map((entity) => {
      const typeConceptId = TYPE_CONCEPT_IDS[entity.kind];
      const typeConcept = typeConceptId ? getKnowledgeConcept(registry, typeConceptId) : undefined;
      const match = entity.kind === "activity"
        ? activityMatch(entity.label, registry, language)
        : entity.kind === "actor" && entity.role
          ? matchKnowledgeConcept(entity.role, registry, { expectedType: "occupation", language })
          : matchKnowledgeConcept(entity.label, registry, { expectedType: entity.kind, language });
      const selected = match.status === "matched" || match.status === "type_only" ? match.concept : undefined;
      const classificationType = selected?.classifications.find((item) => item.parentConceptId)?.classificationType
        ?? (selected?.conceptType === "occupation"
          ? "occupation-domain"
          : selected?.conceptType === "specialization"
            ? "universal-specialization"
            : "universal-domain");
      const lineage = selected ? getClassificationLineage(registry, selected.id, classificationType) : [];
      return {
        ...entity,
        knowledge: {
          ...(typeConcept ? { typeConceptId: typeConcept.id, typeConceptLabel: label(typeConcept, language) } : {}),
          matchStatus: match.status,
          ...(selected ? {
            conceptId: selected.id,
            conceptLabel: label(selected, language),
            ...(match.status === "matched" ? { matchMethod: match.method, confidence: match.confidence } : match.status === "type_only" ? { confidence: match.confidence } : {}),
            ...(lineage.length ? { classificationPath: lineage.map((item) => ({ id: item.id, label: label(item, language) })) } : {}),
          } : {}),
          ...(match.status === "ambiguous" ? { candidateConceptIds: [...new Set(match.candidates.map((candidate) => candidate.id))] } : {}),
        },
      };
    }),
  };
}
