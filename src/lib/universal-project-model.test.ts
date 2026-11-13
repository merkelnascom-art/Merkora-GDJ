import { describe, expect, it } from "vitest";
import { buildUniversalProjectModel } from "./universal-project-model";
import { analyzeUniversalProjectIntent } from "./universal-project-understanding";

describe("buildUniversalProjectModel", () => {
  it("keeps several explicit needs distinct and asks the client to confirm their relationship", () => {
    const understanding = analyzeUniversalProjectIntent(
      "Je veux suivre les revenus de ma famille et noter les heures de visite de mes amis.",
    );

    const model = buildUniversalProjectModel(understanding);

    expect(model.needs.length).toBeGreaterThanOrEqual(2);
    expect(model.needs.map((need) => need.sourceIntentId)).toEqual(
      expect.arrayContaining(["money-flow", "visitors-and-events"]),
    );
    expect(model.relationships).toEqual(expect.arrayContaining([
      expect.objectContaining({ kind: "relationship_unknown", confirmationRequired: true }),
    ]));
    expect(model.validationCheckpoints.some((item) => /même projet|séparément/i.test(item.question))).toBe(true);
  });

  it("does not invent workflows, permissions, operating rules, or collected data", () => {
    const understanding = analyzeUniversalProjectIntent("Je veux mieux organiser certaines choses.");
    const model = buildUniversalProjectModel(understanding);

    expect(model.processes).toEqual([]);
    expect(model.operatingRules).toEqual([]);
    expect(model.dataEntities).toEqual([]);
    expect(model.roles.every((role) => role.permissions.length === 0)).toBe(true);
    expect(model.openQuestions.length).toBeGreaterThan(0);
  });

  it("explores human, organizational, documentary, physical, digital and hybrid formats without choosing prematurely", () => {
    const understanding = analyzeUniversalProjectIntent("Je veux suivre les contributions de chacun.");
    const model = buildUniversalProjectModel(understanding);

    expect(model.solutionDirections.map((item) => item.format)).toEqual([
      "human", "organizational", "documentary", "physical", "digital", "hybrid",
    ]);
    expect(model.solutionDirections.every((item) => item.status === "to_explore")).toBe(true);
    expect(model.selectedSolutionFormat).toBeNull();
  });

  it("marks inferred needs as proposals requiring client validation and preserves evidence", () => {
    const understanding = analyzeUniversalProjectIntent("Je veux suivre les dépenses de la maison.");
    const model = buildUniversalProjectModel(understanding);

    expect(model.needs[0]).toMatchObject({
      status: "proposed",
      confirmationRequired: true,
      evidence: expect.arrayContaining(["dépense"]),
    });
    expect(model.validationCheckpoints.length).toBeGreaterThan(0);
  });
});
