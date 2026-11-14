import { describe, expect, it } from "vitest";
import { buildUniversalProjectModel } from "./universal-project-model";
import { buildUniversalProjectBlueprint } from "./universal-project-blueprint";
import { analyzeUniversalProjectIntent } from "./universal-project-understanding";

describe("buildUniversalProjectBlueprint", () => {
  it("turns needs into traceable draft requirements without inventing process steps", () => {
    const analysis = analyzeUniversalProjectIntent(
      "Aujourd'hui chacun me donne sa contribution en espèces, mais je ne sais plus qui a payé. Je veux recevoir un résumé chaque dimanche.",
    );
    const blueprint = buildUniversalProjectBlueprint(buildUniversalProjectModel(analysis));

    expect(blueprint.requirements.length).toBeGreaterThan(0);
    expect(blueprint.requirements[0]).toMatchObject({
      sourceNeedId: expect.any(String),
      status: "draft",
      validationRequired: true,
      priority: "not_defined",
    });
    expect(blueprint.processes[0]).toMatchObject({
      status: "current_process_to_confirm",
      sourceDescription: expect.stringMatching(/Aujourd'hui/i),
      steps: [],
    });
  });

  it("keeps roles, permissions, data, rules and exception scenarios unassigned until discovery", () => {
    const analysis = analyzeUniversalProjectIntent("Je veux organiser les visites de mes amis.");
    const blueprint = buildUniversalProjectBlueprint(buildUniversalProjectModel(analysis));

    expect(blueprint.roles.every((role) => role.permissions.length === 0)).toBe(true);
    expect(blueprint.dataRequirements).toEqual([]);
    expect(blueprint.operatingRules).toEqual([]);
    expect(blueprint.scenarios).toEqual([]);
    expect(blueprint.approvalGates.length).toBeGreaterThan(0);
  });

  it("creates no false current process when the client only describes a desired result", () => {
    const analysis = analyzeUniversalProjectIntent("Je veux recevoir un résumé des dépenses de la maison.");
    const blueprint = buildUniversalProjectBlueprint(buildUniversalProjectModel(analysis));

    expect(blueprint.processes).toEqual([]);
    expect(blueprint.openQuestions.join(" ")).toMatch(/fonctionnement actuel|étapes/i);
  });

  it("retains every solution family as an unranked option", () => {
    const analysis = analyzeUniversalProjectIntent("Je veux mieux organiser les contributions.");
    const blueprint = buildUniversalProjectBlueprint(buildUniversalProjectModel(analysis));

    expect(blueprint.solutionOptions).toHaveLength(6);
    expect(blueprint.solutionOptions.every((option) => option.assessment === "not_assessed")).toBe(true);
    expect(blueprint.recommendedOptionId).toBeNull();
  });
});
