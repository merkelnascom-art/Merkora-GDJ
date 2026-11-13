import { describe, expect, it } from "vitest";
import { MERKORA_UNIVERSAL_FAMILIES } from "./universal-reference";
import {
  MERKORA_DETAILED_PROFESSION_PROFILES,
  MERKORA_PROFESSION_CANDIDATES,
  PROFESSION_CANDIDATE_IMPORTED_COUNT,
  PROFESSION_CANDIDATE_CURATED_ADDITION_COUNT,
  PROFESSION_CANDIDATE_TOTAL_COUNT,
  PROFESSION_CANDIDATE_SOURCE_DECLARED_COUNT,
  PROFESSION_CANDIDATE_SOURCE_GAP,
  getProfessionCandidatesForFamilies,
} from "./profession-reference";

describe("MerKora profession reference", () => {
  it("keeps source-index imports distinct from the curated expansion", () => {
    expect(PROFESSION_CANDIDATE_SOURCE_DECLARED_COUNT).toBe(500);
    expect(PROFESSION_CANDIDATE_IMPORTED_COUNT).toBe(484);
    expect(PROFESSION_CANDIDATE_SOURCE_GAP).toBe(16);
    expect(PROFESSION_CANDIDATE_CURATED_ADDITION_COUNT).toBe(200);
    expect(PROFESSION_CANDIDATE_TOTAL_COUNT).toBe(684);
    expect(MERKORA_PROFESSION_CANDIDATES).toHaveLength(684);
  });

  it("gives every candidate a unique stable ID and a valid family", () => {
    const familyIds = new Set(MERKORA_UNIVERSAL_FAMILIES.map((family) => family.id));
    const candidateIds = MERKORA_PROFESSION_CANDIDATES.map((candidate) => candidate.id);
    expect(new Set(candidateIds).size).toBe(candidateIds.length);
    expect(MERKORA_PROFESSION_CANDIDATES.every((candidate) =>
      familyIds.has(candidate.familyId) && candidate.reviewStatus === "candidate"
    )).toBe(true);
  });

  it("returns only candidate titles from explicitly supplied families", () => {
    const candidates = getProfessionCandidatesForFamilies(["family-01"], 5);
    expect(candidates).toHaveLength(5);
    expect(candidates.every((candidate) => candidate.familyId === "family-01" && candidate.reviewStatus === "candidate")).toBe(true);
    expect(getProfessionCandidatesForFamilies(["unknown-family"])).toEqual([]);
  });

  it("keeps repeated profession titles as distinct family-specific candidates", () => {
    const couriers = MERKORA_PROFESSION_CANDIDATES.filter((candidate) => candidate.title === "Livreur");
    expect(couriers.length).toBeGreaterThan(1);
    expect(new Set(couriers.map((candidate) => candidate.familyId)).size).toBe(couriers.length);
  });

  it("contains 60 detailed profiles, distinct from candidate-only titles", () => {
    expect(MERKORA_DETAILED_PROFESSION_PROFILES).toHaveLength(60);
    expect(MERKORA_DETAILED_PROFESSION_PROFILES.every((profile) =>
      profile.reviewStatus === "documented_unreviewed" &&
      profile.purpose.trim().length > 0 &&
      profile.workflow.trim().length > 0 &&
      profile.actorsAndResponsibilities.trim().length > 0 &&
      profile.businessData.trim().length > 0 &&
      profile.diagnosticQuestions.trim().length > 0 &&
      profile.digitalCapabilities.trim().length > 0 &&
      profile.risksAndLimits.trim().length > 0 &&
      profile.possibleIndicators.trim().length > 0 &&
      profile.projectExample.trim().length > 0 &&
      profile.clientValidation.trim().length > 0
    )).toBe(true);
  });

  it("links the new profiles to valid universal sectors without promoting candidate titles", () => {
    const sectorIds = new Set<string>(MERKORA_UNIVERSAL_FAMILIES.flatMap((family) => family.sectors.map((sector) => sector.id)));
    const expanded = MERKORA_DETAILED_PROFESSION_PROFILES.filter((profile) => Number(profile.id.slice(-2)) >= 21);
    expect(expanded).toHaveLength(40);
    expect(expanded.every((profile) => profile.sectorIds?.length && profile.sectorIds.every((id) => sectorIds.has(id)))).toBe(true);
    expect(expanded.every((profile) => profile.reviewStatus === "documented_unreviewed")).toBe(true);
  });
});
