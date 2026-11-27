import { describe, expect, it } from "vitest";
import { canTransitionJourney, type JourneyTransitionRequest } from "./journey-boundaries";

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
