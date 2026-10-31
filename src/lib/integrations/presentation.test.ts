import { describe, expect, it } from "vitest";
import { getIntegrationStatusPresentation } from "./presentation";

describe("integration status presentation", () => {
  it("labels every catalog entry as not connected until a real connection is verified", () => {
    expect(getIntegrationStatusPresentation("not_configured")).toEqual({
      label: "Non connecté",
      tone: "neutral",
    });
  });

  it("distinguishes a verified connection from an action that needs attention", () => {
    expect(getIntegrationStatusPresentation("connected")).toEqual({
      label: "Connecté",
      tone: "success",
    });
    expect(getIntegrationStatusPresentation("attention_required")).toEqual({
      label: "À vérifier",
      tone: "warning",
    });
  });

  it("does not treat unknown values as a successful connection", () => {
    expect(getIntegrationStatusPresentation("unexpected")).toEqual({
      label: "État inconnu",
      tone: "neutral",
    });
  });
});
