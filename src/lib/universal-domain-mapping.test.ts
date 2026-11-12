import { describe, expect, it } from "vitest";
import { mapUniversalReferences } from "./universal-domain-mapping";

describe("universal to operational domain mapping", () => {
  it("maps a known family and sector to the existing operational domain", () => {
    const result = mapUniversalReferences({ familyIds: ["family-04"], sectorIds: ["S04-03"] });
    expect(result.operationalDomainIds).toEqual(["commerce"]);
    expect(result.classification).toBe("mapped");
    expect(result.confidence).toBe("high");
    expect(result.evidence).toEqual([
      { familyId: "family-04", sectorIds: ["S04-03"], operationalDomainIds: ["commerce"] },
    ]);
  });

  it("supports hybrid projects spanning more than one operational domain", () => {
    const result = mapUniversalReferences({ familyIds: ["family-04", "family-12"] });
    expect(result.operationalDomainIds).toEqual(["commerce", "ressources-humaines"]);
    expect(result.classification).toBe("hybrid");
    expect(result.matchedFamilyIds).toEqual(["family-04", "family-12"]);
  });

  it("preserves a family that has no honest operational-domain equivalent", () => {
    const result = mapUniversalReferences({ familyIds: ["family-16"] });
    expect(result.operationalDomainIds).toEqual([]);
    expect(result.unmappedFamilyIds).toEqual(["family-16"]);
    expect(result.classification).toBe("unmapped");
    expect(result.confidence).toBe("none");
  });

  it("reports unknown identifiers without inventing a classification", () => {
    const result = mapUniversalReferences({ familyIds: ["unknown"], sectorIds: ["S99-99"] });
    expect(result.operationalDomainIds).toEqual([]);
    expect(result.unknownFamilyIds).toEqual(["unknown"]);
    expect(result.unknownSectorIds).toEqual(["S99-99"]);
    expect(result.classification).toBe("unmapped");
  });

  it("maps a family from a sector even when no family ID was separately supplied", () => {
    const result = mapUniversalReferences({ sectorIds: ["S01-01"] });
    expect(result.operationalDomainIds).toEqual(["sante"]);
    expect(result.evidence[0]?.familyId).toBe("family-01");
  });

  it("does not collapse an explicit family with no mapping when another family is mapped", () => {
    const result = mapUniversalReferences({ familyIds: ["family-04", "family-16"] });
    expect(result.operationalDomainIds).toEqual(["commerce"]);
    expect(result.unmappedFamilyIds).toEqual(["family-16"]);
    expect(result.classification).toBe("mapped");
  });
});
