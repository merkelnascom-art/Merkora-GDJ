import { describe, expect, it } from "vitest";
import { analyzeUniversalProjectIntent } from "./universal-project-understanding";

describe("analyzeUniversalProjectIntent", () => {
  it("understands an unusual family request without forcing finance or attendance categories", () => {
    const result = analyzeUniversalProjectIntent(
      "Je veux surveiller l'argent que gagne ma famille et connaître les heures auxquelles mes amis viennent chez moi.",
    );

    expect(result.intentGroups).toEqual(expect.arrayContaining([
      expect.objectContaining({ subject: expect.stringMatching(/revenu|argent/i) }),
      expect.objectContaining({ subject: expect.stringMatching(/visite|ami/i) }),
    ]));
    expect(result.prematureClassification).toBe(false);
    expect(result.questions.length).toBeGreaterThan(0);
    expect(result.privacyConsiderations.length).toBeGreaterThan(0);
  });

  it("keeps distinct needs separate when one sentence contains unrelated objectives", () => {
    const result = analyzeUniversalProjectIntent(
      "Je veux suivre les dépenses de la maison, organiser les visites de mes amis et recevoir une alerte quand un colis arrive.",
    );

    expect(result.intentGroups.length).toBeGreaterThanOrEqual(3);
    expect(result.unknowns.length).toBeGreaterThan(0);
  });

  it("does not invent a solution format from an incomplete idea", () => {
    const result = analyzeUniversalProjectIntent("Je veux mieux organiser certaines choses.");

    expect(result.recommendedFormats).toEqual([]);
    expect(result.confidence).toBe("low");
    expect(result.questions.length).toBeGreaterThan(0);
  });
});
