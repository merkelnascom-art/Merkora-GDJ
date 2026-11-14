import { describe, expect, it } from "vitest";
import { recognizeUnmappedUniversalFamilies } from "./universal-family-recognition";

describe("unmapped universal family recognition", () => {
  it("recognizes legal work", () => {
    const result = recognizeUnmappedUniversalFamilies("Notre cabinet avocat suit des dossiers juridiques et des audiences.");
    expect(result.candidateFamilyIds).toContain("family-16");
    expect(result.candidateSectorIds).toContain("S16-01");
  });

  it("recognizes software, support and telecommunications", () => {
    const result = recognizeUnmappedUniversalFamilies("Nous faisons du développement logiciel, du support informatique et installons la fibre optique.");
    expect(result.candidateFamilyIds).toContain("family-17");
    expect(result.candidateSectorIds).toEqual(expect.arrayContaining(["S17-01", "S17-02", "S17-03"]));
  });

  it("recognizes renewable energy and water services", () => {
    const result = recognizeUnmappedUniversalFamilies("Notre entreprise installe des panneaux solaires et assure la distribution d'eau potable.");
    expect(result.candidateFamilyIds).toContain("family-18");
    expect(result.candidateSectorIds).toEqual(expect.arrayContaining(["S18-02", "S18-03"]));
  });

  it("recognizes security and access control", () => {
    const result = recognizeUnmappedUniversalFamilies("Notre société de gardiennage gère la sécurité incendie et le contrôle d'accès.");
    expect(result.candidateFamilyIds).toContain("family-19");
    expect(result.candidateSectorIds).toEqual(expect.arrayContaining(["S19-01", "S19-02", "S19-05"]));
  });

  it("recognizes associations and NGOs", () => {
    const result = recognizeUnmappedUniversalFamilies("Notre ONG organise la solidarité, gère les bénéficiaires et les cotisations de l'association.");
    expect(result.candidateFamilyIds).toContain("family-20");
    expect(result.candidateSectorIds).toEqual(expect.arrayContaining(["S20-02", "S20-03"]));
  });

  it("does not classify vague requests", () => {
    expect(recognizeUnmappedUniversalFamilies("Je veux une solution pour mieux gérer mon activité et gagner du temps.").matches).toEqual([]);
  });

  it("keeps hybrid family matches distinct", () => {
    const result = recognizeUnmappedUniversalFamilies("Notre ONG organise la solidarité et la gestion de crise avec des équipes de sécurité incendie.");
    expect(result.candidateFamilyIds).toEqual(expect.arrayContaining(["family-19", "family-20"]));
  });
});
