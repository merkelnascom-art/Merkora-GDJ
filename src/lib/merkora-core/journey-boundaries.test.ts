import { describe, expect, it } from "vitest";
import { canTransitionJourney, isDrtUnderstandingSessionPayload, type JourneyTransitionRequest } from "./journey-boundaries";

describe("customer journey boundaries", () => {
  it.each([
    [{ from: "catalogue", to: "idp", customerRequested: true }, true],
    [{ from: "catalogue", to: "drt", customerRequested: true }, true],
    [{ from: "idp", to: "drt", customerRequested: true, counselorApproved: true }, true],
    [{ from: "drt", to: "idp", customerRequested: true }, true],
    [{ from: "catalogue", to: "drt", customerRequested: false }, false],
    [{ from: "idp", to: "drt", customerRequested: true, counselorApproved: false }, false],
    [{ from: "idp", to: "drt", customerRequested: false, counselorApproved: true }, false],
    [{ from: "drt", to: "catalogue", customerRequested: true }, false],
    [{ from: "catalogue", to: "idp", customerRequested: false }, false],
  ] satisfies Array<[JourneyTransitionRequest, boolean]>)(
    "allows only explicitly authorized transitions: %o",
    (request, expected) => {
      expect(canTransitionJourney(request)).toBe(expected);
    },
  );
});

describe("DRT session provenance", () => {
  it("recognizes an understanding session", () => {
    expect(isDrtUnderstandingSessionPayload({
      originalDescription: "Créer une plateforme",
      messages: [],
      evidence: [],
      stage: "clarification",
    })).toBe(true);
  });

  it("does not mistake a Catalogue dossier for a DRT session", () => {
    expect(isDrtUnderstandingSessionPayload({
      schemaVersion: 1,
      source: { journey: "catalogue_specialized_configurator" },
      answers: [],
      evidence: [],
    })).toBe(false);
  });

  it("rejects null and malformed payloads", () => {
    expect(isDrtUnderstandingSessionPayload(null)).toBe(false);
    expect(isDrtUnderstandingSessionPayload({ originalDescription: "Projet", messages: [], evidence: [] })).toBe(false);
  });
});
