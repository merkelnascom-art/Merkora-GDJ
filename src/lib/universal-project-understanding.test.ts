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
    expect(result.constraints).toEqual(expect.arrayContaining([expect.stringMatching(/connectivité|connexion/i)]));
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

  it.each([
    ["agriculture", "Je veux suivre les parcelles de tomates, les périodes d'arrosage et les récoltes."],
    ["education", "Je veux aider les élèves à choisir une orientation après le baccalauréat grâce à des questionnaires."],
    ["transport", "Je veux organiser les trajets des conducteurs et informer les passagers des changements."],
    ["craft", "Je veux gérer les commandes, les matières premières et les étapes de fabrication de mes créations."],
    ["public service", "Je veux simplifier le dépôt et le suivi des demandes des habitants d'une commune."],
  ])("keeps an unfamiliar %s domain open for discovery instead of forcing a solution category", (_domain, request) => {
    const result = analyzeUniversalProjectIntent(request);

    expect(result.prematureClassification).toBe(false);
    expect(result.recommendedFormats).toEqual([]);
    expect(result.statedFacts.every((item) => item.source === "client")).toBe(true);
    expect(result.questions.length).toBeGreaterThan(0);
    expect(result.unknowns.length).toBeGreaterThan(0);
  });

  it("does not invent a solution format from an incomplete idea", () => {
    const result = analyzeUniversalProjectIntent("Je veux mieux organiser certaines choses.");

    expect(result.recommendedFormats).toEqual([]);
    expect(result.confidence).toBe("low");
    expect(result.questions.length).toBeGreaterThan(0);
  });

  it("recognizes a personalized CV creation need without inventing home visits or task management", () => {
  const result = analyzeUniversalProjectIntent(
    "Je remarque que les personnes n'arrive pas à créer des CV selon ce qu'ils veulent et sont obligées de payer des frais IA ou de se débrouiller avant d'avoir leur CV propre à leur parcours et ce pourquoi ils veulent le faire. Je veux les aider avec des maquettes de CV, le choix du modèle, l'ajout de leur photo et de la police selon leurs objectifs.",
  );

  expect(result.intentGroups.map((group) => group.id)).toContain("career-documents");
  expect(result.intentGroups.map((group) => group.id)).not.toContain("visitors-and-events");
  expect(result.intentGroups.map((group) => group.id)).not.toContain("work-and-tasks");
  });

  it("treats a project budget as a constraint, not as a financial-management intent", () => {
    const analysis = analyzeUniversalProjectIntent(
      "Je veux créer un service de CV personnalisés. Mon budget maximal est de 100 000 FCFA.",
    );

    expect(analysis.intentGroups.map((group) => group.id)).toContain("career-documents");
    expect(analysis.intentGroups.map((group) => group.id)).not.toContain("money-flow");
    expect(analysis.constraints).toContain("budget et coût acceptable à préciser");
  });

});