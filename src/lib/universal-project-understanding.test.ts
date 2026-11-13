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

  it("separates stated facts, hypotheses, current process, desired outcome and constraints", () => {
    const result = analyzeUniversalProjectIntent(
      "Aujourd'hui chacun me donne sa contribution en espèces, mais je ne sais plus qui a payé. Je veux éviter les disputes et recevoir un résumé chaque dimanche. Nous avons parfois une mauvaise connexion.",
    );

    expect(result.statedFacts.length).toBeGreaterThan(0);
    expect(result.currentSituation).toMatch(/contribution|espèces/i);
    expect(result.desiredOutcomes.length).toBeGreaterThan(0);
    expect(result.possibleCauses.length).toBeGreaterThan(0);
    expect(result.constraints).toEqual(expect.arrayContaining([expect.stringMatching(/connexion/i)]));
    expect(result.hypotheses.every((item) => item.confirmationRequired)).toBe(true);
  });

  it("does not treat surveillance of other people as permission for hidden collection", () => {
    const result = analyzeUniversalProjectIntent(
      "Je veux savoir à quelle heure mes amis arrivent chez moi sans qu'ils aient à faire quelque chose.",
    );

    expect(result.privacyConsiderations.length).toBeGreaterThan(0);
    expect(result.questions.join(" ")).toMatch(/inform|accord|consent/i);
    expect(result.risks.some((risk) => /vie privée|confidentialité/i.test(risk))).toBe(true);
  });

  it("does not invent a solution format from an incomplete idea", () => {
    const result = analyzeUniversalProjectIntent("Je veux mieux organiser certaines choses.");

    expect(result.recommendedFormats).toEqual([]);
    expect(result.confidence).toBe("low");
    expect(result.questions.length).toBeGreaterThan(0);
  });
});
