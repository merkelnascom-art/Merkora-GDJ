import { describe, expect, it } from "vitest";
import { analyzeUniversalProjectIntent } from "./universal-project-understanding";

describe("analyzeUniversalProjectIntent lexical baseline", () => {
  it("preserves the original wording and identifies two independent need clusters", () => {
    const raw = "Je veux suivre les revenus de ma famille et noter les heures de visite de mes amis.";
    const result = analyzeUniversalProjectIntent(raw);

    expect(result.rawIntent).toBe(raw);
    expect(result.intentGroups).toContain("finance_and_contributions");
    expect(result.intentGroups).toContain("visits_and_attendance");
    expect(result.actors).toEqual(expect.arrayContaining(["famille", "amis"]));
    expect(result.privacyConsiderations).toContain("third_party_information_may_be_involved");
  });

  it("does not invent a current process when none is described", () => {
    const result = analyzeUniversalProjectIntent("Je veux recevoir un résumé des dépenses de la maison.");

    expect(result.currentSituation).toBeNull();
    expect(result.desiredOutcomes.length).toBeGreaterThan(0);
  });

  it("captures an explicitly described current process", () => {
    const result = analyzeUniversalProjectIntent(
      "Aujourd'hui je note les contributions dans un cahier. Je veux recevoir un résumé chaque dimanche.",
    );

    expect(result.currentSituation).toMatch(/Aujourd'hui je note les contributions dans un cahier/i);
    expect(result.desiredOutcomes.length).toBeGreaterThan(0);
  });

  it("does not create categories or clues from an unrelated vague statement", () => {
    const result = analyzeUniversalProjectIntent("Je veux mieux organiser certaines choses.");

    expect(result.intentGroups).toEqual([]);
    expect(result.currentSituation).toBeNull();
    expect(result.actors).toEqual([]);
    expect(result.constraints).toEqual([]);
  });
});
