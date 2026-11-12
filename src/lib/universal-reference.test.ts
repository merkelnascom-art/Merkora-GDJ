import { describe, expect, it } from "vitest";
import {
  getUniversalFamilyById,
  getUniversalSectorById,
  MERKORA_UNIVERSAL_FAMILIES,
  MERKORA_UNIVERSAL_SECTORS,
} from "./universal-reference";

describe("MerKora universal reference", () => {
  it("contains 20 uniquely identified families", () => {
    expect(MERKORA_UNIVERSAL_FAMILIES).toHaveLength(20);
    expect(new Set(MERKORA_UNIVERSAL_FAMILIES.map((family) => family.id)).size).toBe(20);
  });

  it("contains exactly 100 uniquely identified sectors, five per family", () => {
    expect(MERKORA_UNIVERSAL_SECTORS).toHaveLength(100);
    expect(new Set(MERKORA_UNIVERSAL_SECTORS.map((sector) => sector.id)).size).toBe(100);
    for (const family of MERKORA_UNIVERSAL_FAMILIES) {
      expect(family.sectors).toHaveLength(5);
      expect(family.sectors.every((sector) => sector.familyId === family.id)).toBe(true);
    }
  });

  it("provides a label and activity description for every family and sector", () => {
    expect(MERKORA_UNIVERSAL_FAMILIES.every((family) => family.label.trim().length > 0)).toBe(true);
    expect(MERKORA_UNIVERSAL_SECTORS.every((sector) =>
      sector.label.trim().length > 0 && sector.description.trim().length > 0
    )).toBe(true);
  });

  it("looks up known families and sectors", () => {
    expect(getUniversalFamilyById("family-01")?.label).toContain("Santé");
    expect(getUniversalSectorById("S04-03")?.label).toBe("Vente en ligne et marketplaces");
  });

  it("returns null for unknown family and sector identifiers", () => {
    expect(getUniversalFamilyById("unknown-family")).toBeNull();
    expect(getUniversalSectorById("S99-99")).toBeNull();
  });
});
