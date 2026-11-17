import { CORE_KNOWLEDGE_CONCEPTS } from "./core-catalog";
import { UNIVERSAL_DOMAIN_CATALOG } from "./universal-domain-catalog";
import {
  AGRICULTURE_AGROFOOD_CATALOG,
  AGRICULTURE_AGROFOOD_RELATIONSHIPS,
} from "./agriculture-agrofood-catalog";
import { ANIMAL_VETERINARY_CATALOG, ANIMAL_VETERINARY_LEGACY_DOMAIN_PATCHES, ANIMAL_VETERINARY_RELATIONSHIPS } from "./animal-veterinary-catalog";
import { ENVIRONMENT_NATURAL_RESOURCES_CATALOG, ENVIRONMENT_NATURAL_RESOURCES_RELATIONSHIPS } from "./environment-natural-resources-catalog";
import { INDUSTRY_MANUFACTURING_CATALOG, INDUSTRY_MANUFACTURING_RELATIONSHIPS } from "./industry-manufacturing-catalog";
import { CONSTRUCTION_BUILT_ENVIRONMENT_CATALOG, CONSTRUCTION_BUILT_ENVIRONMENT_RELATIONSHIPS } from "./construction-built-environment-catalog";
import { ENERGY_UTILITIES_CATALOG, ENERGY_UTILITIES_RELATIONSHIPS } from "./energy-utilities-catalog";
import { MOBILITY_TRANSPORT_CATALOG, MOBILITY_TRANSPORT_RELATIONSHIPS } from "./mobility-transport-catalog";
import { LOGISTICS_SUPPLY_CHAIN_CATALOG, LOGISTICS_SUPPLY_CHAIN_RELATIONSHIPS } from "./logistics-supply-chain-catalog";
import { COMMERCE_MARKETS_CATALOG, COMMERCE_MARKETS_RELATIONSHIPS } from "./commerce-markets-catalog";
import { FINANCE_INSURANCE_CATALOG, FINANCE_INSURANCE_RELATIONSHIPS } from "./finance-insurance-catalog";
import { PUBLIC_GOVERNANCE_CATALOG, PUBLIC_GOVERNANCE_RELATIONSHIPS } from "./public-governance-catalog";
import { LEGAL_SERVICES_CATALOG, LEGAL_SERVICES_FAMILY_CONCEPTS, LEGAL_SERVICES_RELATIONSHIPS } from "./legal-services-catalog";
import { EDUCATION_RESEARCH_CATALOG, EDUCATION_RESEARCH_FAMILY_CONCEPTS, EDUCATION_RESEARCH_RELATIONSHIPS } from "./education-research-catalog";
import { HEALTH_SOCIAL_SERVICES_CATALOG, HEALTH_SOCIAL_SERVICES_FAMILY_CONCEPTS, HEALTH_SOCIAL_SERVICES_RELATIONSHIPS } from "./health-social-services-catalog";
import type { KnowledgeConcept, KnowledgeRegistry, KnowledgeRelationship, KnowledgeRelationshipVersion } from "./types";

function cloneRelationship(relationship: KnowledgeRelationship): KnowledgeRelationship {
  return {
    ...relationship,
    sourceIds: [...relationship.sourceIds],
    ...(relationship.conditions ? { conditions: JSON.parse(JSON.stringify(relationship.conditions)) as Record<string, unknown> } : {}),
  };
}

function cloneConcept(concept: KnowledgeConcept): KnowledgeConcept {
  return {
    ...concept,
    definitions: concept.definitions.map((definition) => ({ ...definition })),
    terms: concept.terms.map((term) => ({ ...term })),
    classifications: concept.classifications.map((classification) => ({ ...classification })),
    attributes: concept.attributes.map((attribute) => ({ ...attribute })),
    relationships: concept.relationships.map(cloneRelationship),
    ...(concept.externalMappings ? { externalMappings: concept.externalMappings.map((mapping) => ({ ...mapping })) } : {}),
    scope: {
      ...concept.scope,
      ...(concept.scope.countries ? { countries: [...concept.scope.countries] } : {}),
      ...(concept.scope.jurisdictions ? { jurisdictions: [...concept.scope.jurisdictions] } : {}),
      ...(concept.scope.regions ? { regions: [...concept.scope.regions] } : {}),
      ...(concept.scope.projectIds ? { projectIds: [...concept.scope.projectIds] } : {}),
    },
    lifecycle: { ...concept.lifecycle },
    sources: concept.sources.map((source) => ({ ...source })),
    reliability: {
      ...concept.reliability,
      ...(concept.reliability.verificationNotes ? { verificationNotes: [...concept.reliability.verificationNotes] } : {}),
    },
  };
}

export function createKnowledgeRegistry(
  concepts: KnowledgeConcept[] = [],
  relationships: KnowledgeRelationship[] = [],
  conceptHistory: KnowledgeConcept[] = [],
  relationshipHistory: KnowledgeRelationshipVersion[] = [],
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

  // Classification parent chains must be acyclic within each classification system.
  for (const concept of concepts) {
    const seenTypes = new Set<string>();
    for (const classification of concept.classifications) {
      if (seenTypes.has(classification.classificationType)) {
        throw new Error(`Knowledge concept ${concept.id} has duplicate classification type ${classification.classificationType}.`);
      }
      seenTypes.add(classification.classificationType);

      const visited = new Set<string>([concept.id]);
      let parentId = classification.parentConceptId;
      while (parentId) {
        if (visited.has(parentId)) {
          throw new Error(`Knowledge classification cycle detected for ${concept.id} in ${classification.classificationType}.`);
        }
        visited.add(parentId);
        const parent = concepts.find((candidate) => candidate.id === parentId);
        parentId = parent?.classifications.find(
          (candidate) => candidate.classificationType === classification.classificationType,
        )?.parentConceptId;
      }
    }
  }

  return {
    version: 1,
    concepts: concepts.map(cloneConcept),
    relationships: [...allRelationships.values()].map(cloneRelationship),
    conceptHistory: conceptHistory.map(cloneConcept),
    relationshipHistory: relationshipHistory.map((entry) => ({ ...entry, snapshot: cloneRelationship(entry.snapshot) })),
  };
}

export function createCoreKnowledgeRegistry(): KnowledgeRegistry {
  return createKnowledgeRegistry(CORE_KNOWLEDGE_CONCEPTS);
}

export function createUniversalKnowledgeRegistry(): KnowledgeRegistry {
  return createKnowledgeRegistry(
    [...CORE_KNOWLEDGE_CONCEPTS, ...UNIVERSAL_DOMAIN_CATALOG.filter((item) => item.id !== "domain:livestock"), ...ANIMAL_VETERINARY_LEGACY_DOMAIN_PATCHES, ...AGRICULTURE_AGROFOOD_CATALOG, ...ANIMAL_VETERINARY_CATALOG, ...ENVIRONMENT_NATURAL_RESOURCES_CATALOG, ...INDUSTRY_MANUFACTURING_CATALOG, ...CONSTRUCTION_BUILT_ENVIRONMENT_CATALOG, ...ENERGY_UTILITIES_CATALOG, ...MOBILITY_TRANSPORT_CATALOG, ...LOGISTICS_SUPPLY_CHAIN_CATALOG, ...COMMERCE_MARKETS_CATALOG, ...FINANCE_INSURANCE_CATALOG, ...PUBLIC_GOVERNANCE_CATALOG, ...LEGAL_SERVICES_FAMILY_CONCEPTS, ...LEGAL_SERVICES_CATALOG, ...EDUCATION_RESEARCH_FAMILY_CONCEPTS, ...EDUCATION_RESEARCH_CATALOG, ...HEALTH_SOCIAL_SERVICES_FAMILY_CONCEPTS, ...HEALTH_SOCIAL_SERVICES_CATALOG],
    [...AGRICULTURE_AGROFOOD_RELATIONSHIPS, ...ANIMAL_VETERINARY_RELATIONSHIPS, ...ENVIRONMENT_NATURAL_RESOURCES_RELATIONSHIPS, ...INDUSTRY_MANUFACTURING_RELATIONSHIPS, ...CONSTRUCTION_BUILT_ENVIRONMENT_RELATIONSHIPS, ...ENERGY_UTILITIES_RELATIONSHIPS, ...MOBILITY_TRANSPORT_RELATIONSHIPS, ...LOGISTICS_SUPPLY_CHAIN_RELATIONSHIPS, ...COMMERCE_MARKETS_RELATIONSHIPS, ...FINANCE_INSURANCE_RELATIONSHIPS, ...PUBLIC_GOVERNANCE_RELATIONSHIPS, ...LEGAL_SERVICES_RELATIONSHIPS, ...EDUCATION_RESEARCH_RELATIONSHIPS, ...HEALTH_SOCIAL_SERVICES_RELATIONSHIPS],
  );
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
    registry.relationshipHistory ?? [],
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
    registry.relationshipHistory ?? [],
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

  const previousEmbeddedRelationIds = new Set(current.relationships.map((relationship) => relationship.id));
  const registryLevelRelationships = registry.relationships.filter(
    (relationship) => !previousEmbeddedRelationIds.has(relationship.id),
  );
  const next = createKnowledgeRegistry(
    registry.concepts.map((concept) => concept.id === conceptId ? revised : concept),
    registryLevelRelationships,
    [...registry.conceptHistory, current],
    registry.relationshipHistory ?? [],
  );
  return { ...next, version: registry.version + 1 };
}

/** Version a relationship independently, preserving every superseded snapshot. */
export function reviseKnowledgeRelationship(
  registry: KnowledgeRegistry,
  relationshipId: string,
  expectedVersion: number,
  changes: Partial<Omit<KnowledgeRelationship, "id" | "sourceConceptId" | "version">>,
  updatedAt = new Date().toISOString(),
): KnowledgeRegistry {
  const current = registry.relationships.find((item) => item.id === relationshipId);
  if (!current) throw new Error(`Knowledge relationship not found: ${relationshipId}`);
  if (current.version !== expectedVersion) {
    throw new Error(`Knowledge relationship version conflict: expected ${expectedVersion}, found ${current.version}.`);
  }
  const revised: KnowledgeRelationship = {
    ...current,
    ...changes,
    id: current.id,
    sourceConceptId: current.sourceConceptId,
    version: current.version + 1,
  };
  const next = createKnowledgeRegistry(
    registry.concepts.map((concept) => ({
      ...concept,
      relationships: concept.relationships.map((item) => item.id === relationshipId ? revised : item),
    })),
    registry.relationships.some((item) => item.id === relationshipId)
      ? registry.relationships.map((item) => item.id === relationshipId ? revised : item)
      : [...registry.relationships, revised],
    registry.conceptHistory,
    [...(registry.relationshipHistory ?? []), {
      relationshipId,
      version: current.version,
      snapshot: cloneRelationship(current),
      archivedAt: updatedAt,
    }],
  );
  return { ...next, version: registry.version + 1 };
}
