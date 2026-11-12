import { describe, expect, it } from "vitest";
import { MERKORA_UNIVERSAL_FAMILIES } from "./universal-reference";
import {
  MERKORA_DETAILED_PROFESSION_PROFILES,
  MERKORA_PROFESSION_CANDIDATES,
  PROFESSION_CANDIDATE_IMPORTED_COUNT,
  PROFESSION_CANDIDATE_SOURCE_DECLARED_COUNT,
  PROFESSION_CANDIDATE_SOURCE_GAP,
  getProfessionCandidatesForFamilies,
} from "./profession-reference";

describe("MerKora profession reference", () => {
  it("imports only the candidate entries actually present in the source index", () => {
    expect(PROFESSION_CANDIDATE_SOURCE_DECLARED_COUNT).toBe(500);
    expect(PROFESSION_CANDIDATE_IMPORTED_COUNT).toBe(484);
    expect(PROFESSION_CANDIDATE_SOURCE_GAP).toBe(16);
    expect(MERKORA_PROFESSION_CANDIDATES).toHaveLength(484);
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

  it("contains 20 detailed profiles, distinct from candidate-only titles", () => {
    expect(MERKORA_DETAILED_PROFESSION_PROFILES).toHaveLength(20);
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
});
