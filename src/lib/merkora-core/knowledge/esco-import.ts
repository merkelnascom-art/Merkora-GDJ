import { addKnowledgeConcept, addKnowledgeRelationship } from "./registry";
import type {
  KnowledgeConcept,
  KnowledgeExternalMapping,
  KnowledgeRegistry,
  KnowledgeRelationship,
  KnowledgeScope,
  KnowledgeTerm,
} from "./types";

export interface ESCOConceptRecord {
  uri: string;
  type: "occupation" | "skill";
  preferredLabels: Record<string, string>;
  alternativeLabels?: Record<string, string[]>;
  descriptions?: Record<string, string>;
  broaderUri?: string;
  scope?: KnowledgeScope;
}

export interface ESCOOccupationSkillRelation {
  occupationUri: string;
  skillUri: string;
  relation: "essential" | "optional";
}

export interface ESCOImportBundle {
  datasetVersion: string;
  importedAt?: string;
  concepts: ESCOConceptRecord[];
  occupationSkillRelations?: ESCOOccupationSkillRelation[];
  /** Explicit human-reviewed mappings; absent mappings remain unclassified. */
  domainMappings?: Record<string, string>;
}

export interface ESCOImportResult {
  registry: KnowledgeRegistry;
  importedConceptIds: string[];
  updatedConceptIds: string[];
  importedRelationshipIds: string[];
  skippedExistingUris: string[];
}

function stableId(type: string, uri: string): string {
  return `esco:${type}:${encodeURIComponent(uri)}`;
}

function externalMapping(uri: string, datasetVersion: string, importedAt: string): KnowledgeExternalMapping {
  return {
    system: "ESCO",
    externalId: uri,
    uri,
    datasetVersion,
    matchType: "exact",
    importedAt,
  };
}

/**
 * Imports normalized ESCO concepts without guessing local equivalences.
 * All source language labels are preserved; alternate labels are synonyms
 * only inside their original language. Missing translations stay missing.
 */
export function importESCOBundle(
  initialRegistry: KnowledgeRegistry,
  bundle: ESCOImportBundle,
): ESCOImportResult {
  if (!bundle.datasetVersion.trim()) throw new Error("An ESCO dataset version is required.");
  const importedAt = bundle.importedAt ?? new Date().toISOString();
  const byUri = new Map(bundle.concepts.map((record) => [record.uri, record]));
  let registry = initialRegistry;
  const importedConceptIds: string[] = [];
  const updatedConceptIds: string[] = [];
  const importedRelationshipIds: string[] = [];
  const skippedExistingUris: string[] = [];
  const existingUris = new Set(
    registry.concepts.flatMap((concept) => (concept.externalMappings ?? [])
      .filter((mapping) => mapping.system === "ESCO")
      .map((mapping) => mapping.externalId)),
  );

  for (const record of bundle.concepts) {
    if (!record.uri.trim() || Object.keys(record.preferredLabels).length === 0) continue;
    const id = stableId(record.type, record.uri);
    if (existingUris.has(record.uri)) {
      const current = registry.concepts.find((concept) =>
        concept.id === id && concept.externalMappings?.some((mapping) =>
          mapping.system === "ESCO" && mapping.externalId === record.uri,
        ),
      );
      if (!current) {
        skippedExistingUris.push(record.uri);
        continue;
      }

      const labels = Object.entries(record.preferredLabels).filter(([, value]) => value.trim());
      const definitions = [...current.definitions];
      const terms = [...current.terms];
      for (const [language, value] of labels) {
        const index = definitions.findIndex((item) => item.language === language);
        const definition = {
          language,
          label: value,
          definition: record.descriptions?.[language] ?? value,
        };
        if (index >= 0) definitions[index] = definition;
        else definitions.push(definition);

        const preferredIndex = terms.findIndex((term) => term.language === language && term.kind === "preferred");
        const preferred = { value, language, kind: "preferred" as const };
        if (preferredIndex >= 0) terms[preferredIndex] = preferred;
        else terms.push(preferred);
      }
      for (const [language, values] of Object.entries(record.alternativeLabels ?? {})) {
        for (const value of values.filter((item) => item.trim())) {
          if (!terms.some((term) => term.language === language && term.value === value)) {
            terms.push({ value, language, kind: "synonym" });
          }
        }
      }

      const externalMappings = (current.externalMappings ?? []).map((mapping) =>
        mapping.system === "ESCO" && mapping.externalId === record.uri
          ? { ...mapping, datasetVersion: bundle.datasetVersion, importedAt }
          : mapping,
      );
      const source = {
        id: `source:esco:${bundle.datasetVersion}`,
        sourceType: "external_classification",
        reference: record.uri,
        label: `ESCO dataset ${bundle.datasetVersion}`,
        retrievedAt: importedAt,
      };
      const sources = current.sources.some((item) => item.id === source.id)
        ? current.sources.map((item) => item.id === source.id ? source : item)
        : [...current.sources, source];
      const domainId = bundle.domainMappings?.[record.uri];
      const classifications = domainId && !current.classifications.some((item) =>
        item.classificationType === "occupation-domain" && item.parentConceptId === domainId,
      )
        ? [...current.classifications, { classificationType: "occupation-domain", parentConceptId: domainId, domainId }]
        : current.classifications;

      const changed = JSON.stringify({ definitions, terms, externalMappings, sources, classifications }) !==
        JSON.stringify({
          definitions: current.definitions,
          terms: current.terms,
          externalMappings: current.externalMappings ?? [],
          sources: current.sources,
          classifications: current.classifications,
        });
      if (changed) {
        registry = reviseKnowledgeConcept(registry, id, current.lifecycle.version, {
          definitions, terms, externalMappings, sources, classifications,
          reliability: { ...current.reliability, lastVerifiedAt: importedAt },
        }, importedAt);
        updatedConceptIds.push(id);
      } else {
        skippedExistingUris.push(record.uri);
      }
      continue;
    }
    const labels = Object.entries(record.preferredLabels).filter(([, value]) => value.trim());
    const terms = labels.map(([language, value]) => ({ value, language, kind: "preferred" as const }));
    for (const [language, values] of Object.entries(record.alternativeLabels ?? {})) {
      for (const value of values.filter((item) => item.trim())) terms.push({ value, language, kind: "synonym" as const });
    }
    const domainId = bundle.domainMappings?.[record.uri];
    if (domainId && !registry.concepts.some((concept) => concept.id === domainId)) {
      throw new Error(`ESCO domain mapping references an unknown MerKora domain: ${domainId}`);
    }
    const classifications = record.type === "occupation" && domainId
      ? [{ classificationType: "occupation-domain", parentConceptId: domainId, domainId }]
      : [];
    const externalMappings = [externalMapping(record.uri, bundle.datasetVersion, importedAt)];
    const concept: KnowledgeConcept = {
      id,
      canonicalKey: `esco.${record.type}.${encodeURIComponent(record.uri)}`,
      conceptType: record.type,
      definitions: labels.map(([language, label]) => ({
        language,
        label,
        definition: record.descriptions?.[language] ?? label,
      })),
      terms,
      classifications,
      attributes: [],
      relationships: [],
      externalMappings,
      scope: record.scope ?? { global: true },
      lifecycle: {
        status: "validated",
        version: 1,
        createdAt: importedAt,
        updatedAt: importedAt,
      },
      sources: [{
        id: `source:esco:${bundle.datasetVersion}`,
        sourceType: "external_classification",
        reference: record.uri,
        label: `ESCO dataset ${bundle.datasetVersion}`,
        retrievedAt: importedAt,
      }],
      reliability: {
        evidenceLevel: "authoritative",
        reviewStatus: "reviewed",
        lastVerifiedAt: importedAt,
        verificationNotes: ["Source terminology imported from the official ESCO dataset; local domain equivalences are not inferred."],
      },
    };
    registry = addKnowledgeConcept(registry, concept);
    importedConceptIds.push(id);
    existingUris.add(record.uri);
  }

  for (const record of bundle.concepts) {
    if (!record.broaderUri) continue;
    const sourceId = stableId(record.type, record.uri);
    const targetRecord = byUri.get(record.broaderUri);
    const targetId = targetRecord
      ? stableId(targetRecord.type, targetRecord.uri)
      : registry.concepts.find((concept) => concept.externalMappings?.some((mapping) => mapping.system === "ESCO" && mapping.externalId === record.broaderUri))?.id;
    if (!targetId || !registry.concepts.some((concept) => concept.id === sourceId)) continue;
    const relationship: KnowledgeRelationship = {
      id: `rel:esco:broader:${encodeURIComponent(record.uri)}`,
      sourceConceptId: sourceId,
      targetConceptId: targetId,
      predicate: "broader_than",
      status: "validated",
      confidence: 1,
      sourceIds: [`source:esco:${bundle.datasetVersion}`],
      version: 1,
    };
    if (!registry.relationships.some((item) => item.id === relationship.id)) {
      registry = addKnowledgeRelationship(registry, relationship);
      importedRelationshipIds.push(relationship.id);
    }
  }

  for (const item of bundle.occupationSkillRelations ?? []) {
    const occupationId = stableId("occupation", item.occupationUri);
    const skillId = stableId("skill", item.skillUri);
    if (!registry.concepts.some((concept) => concept.id === occupationId) ||
        !registry.concepts.some((concept) => concept.id === skillId)) continue;
    const id = `rel:esco:${item.relation}:${encodeURIComponent(item.occupationUri)}:${encodeURIComponent(item.skillUri)}`;
    if (registry.relationships.some((relationship) => relationship.id === id)) continue;
    registry = addKnowledgeRelationship(registry, {
      id,
      sourceConceptId: occupationId,
      targetConceptId: skillId,
      predicate: item.relation === "essential" ? "requires_skill" : "may_use_skill",
      status: "validated",
      confidence: 1,
      sourceIds: [`source:esco:${bundle.datasetVersion}`],
      version: 1,
    });
    importedRelationshipIds.push(id);
  }

  return { registry, importedConceptIds, updatedConceptIds, importedRelationshipIds, skippedExistingUris };
}
