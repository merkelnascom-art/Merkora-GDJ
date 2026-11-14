import { describe, expect, it } from "vitest";
import { getPlanGenerationAction } from "./plan-generation-action";

describe("getPlanGenerationAction", () => {
  it("offers a new plan version when an older plan already exists", () => {
    expect(getPlanGenerationAction(true)).toEqual({
      label: "Générer une nouvelle version du plan",
      hint: "Les validations précédentes ne seront pas réutilisées.",
    });
  });

  it("offers initial plan generation when no plan exists", () => {
    expect(getPlanGenerationAction(false)).toEqual({
      label: "Générer le plan interne",
      hint: "Aucun worker ni service payant ne sera lancé.",
    });
  });
});
