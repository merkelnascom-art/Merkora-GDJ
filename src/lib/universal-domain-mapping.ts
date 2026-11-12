import type { DomainId } from "./domain-registry";
import {
  getUniversalFamilyById,
  getUniversalSectorById,
} from "./universal-reference";

export type UniversalReferenceInput = {
  familyIds?: readonly string[];
  sectorIds?: readonly string[];
};

export type UniversalDomainMappingResult = {
  operationalDomainIds: DomainId[];
  matchedFamilyIds: string[];
  unmappedFamilyIds: string[];
  unknownFamilyIds: string[];
  unknownSectorIds: string[];
  classification: "mapped" | "hybrid" | "unmapped";
  confidence: "high" | "none";
  evidence: Array<{
    familyId: string;
    sectorIds: string[];
    operationalDomainIds: DomainId[];
  }>;
};

/**
 * Explicit compatibility bridge. Empty mappings are intentional: the current
 * 13 operational domains do not yet cover every universal family.
 */
export const UNIVERSAL_FAMILY_OPERATIONAL_DOMAINS = {
  "family-01": ["sante"],
  "family-02": ["sport"],
  "family-03": ["agriculture-environnement"],
  "family-04": ["commerce"],
  "family-05": ["entrepreneuriat-finance"],
  "family-06": ["entrepreneuriat-finance"],
  "family-07": ["immobilier-btp"],
  "family-08": ["education-formation"],
  "family-09": ["transport-logistique"],
  "family-10": ["restauration-hotellerie-evenementiel"],
  "family-11": ["restauration-hotellerie-evenementiel", "voyage-tourisme-creation-jeux"],
  "family-12": ["ressources-humaines"],
  "family-13": ["artisanat-services"],
  "family-14": ["artisanat-services"],
  "family-15": ["administration-services-publics"],
  "family-16": [],
  "family-17": [],
  "family-18": [],
  "family-19": [],
  "family-20": [],
} as const satisfies Record<string, readonly DomainId[]>;

export function mapUniversalReferences(input: UniversalReferenceInput): UniversalDomainMappingResult {
  const unknownFamilyIds: string[] = [];
  const unknownSectorIds: string[] = [];
  const sectorIdsByFamily = new Map<string, Set<string>>();
  const familyIds = new Set<string>();

  for (const familyId of input.familyIds ?? []) {
    if (!getUniversalFamilyById(familyId)) {
      unknownFamilyIds.push(familyId);
      continue;
    }
    familyIds.add(familyId);
  }

  for (const sectorId of input.sectorIds ?? []) {
    const sector = getUniversalSectorById(sectorId);
    if (!sector) {
      unknownSectorIds.push(sectorId);
      continue;
    }
    familyIds.add(sector.familyId);
    const sectorIdsForFamily = sectorIdsByFamily.get(sector.familyId) ?? new Set<string>();
    sectorIdsForFamily.add(sector.id);
    sectorIdsByFamily.set(sector.familyId, sectorIdsForFamily);
  }

  const matchedFamilyIds: string[] = [];
  const unmappedFamilyIds: string[] = [];
  const domainIds = new Set<DomainId>();
  const evidence: UniversalDomainMappingResult["evidence"] = [];

  for (const familyId of [...familyIds].sort()) {
    const family = getUniversalFamilyById(familyId);
    if (!family) continue;
    const mappedDomains = UNIVERSAL_FAMILY_OPERATIONAL_DOMAINS[familyId as keyof typeof UNIVERSAL_FAMILY_OPERATIONAL_DOMAINS] ?? [];
    if (mappedDomains.length > 0) matchedFamilyIds.push(familyId);
    else unmappedFamilyIds.push(familyId);
    for (const domainId of mappedDomains) domainIds.add(domainId);
    evidence.push({
      familyId,
      sectorIds: [...(sectorIdsByFamily.get(familyId) ?? [])].sort(),
      operationalDomainIds: [...mappedDomains],
    });
  }

  const operationalDomainIds = [...domainIds];
  const classification = operationalDomainIds.length === 0
    ? "unmapped"
    : operationalDomainIds.length > 1
      ? "hybrid"
      : "mapped";

  return {
    operationalDomainIds,
    matchedFamilyIds,
    unmappedFamilyIds,
    unknownFamilyIds: [...new Set(unknownFamilyIds)],
    unknownSectorIds: [...new Set(unknownSectorIds)],
    classification,
    confidence: operationalDomainIds.length > 0 ? "high" : "none",
    evidence,
  };
}
