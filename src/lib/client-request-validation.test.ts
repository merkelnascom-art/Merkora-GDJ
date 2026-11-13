import { describe, expect, it } from "vitest";
import { isValidClientRequestPayload } from "@/lib/client-request-validation";

const project = {
  id: "MK-TEST-1",
  title: "Organisation de formation",
  category: "other",
  problem: "Les informations de formation sont dispersées.",
  desiredOutcome: "Mieux organiser les parcours.",
  budget: "À définir",
  urgency: "normal",
  recommendations: [],
};

describe("client request payload", () => {
  it("accepts a concept submission without a quote or client quote response", () => {
    expect(isValidClientRequestPayload({
      project,
      studio: {
        format: null,
        formatConfirmed: false,
        solutionFormat: "organizational",
        palette: "violet",
        enabledModules: [],
        selectedRecommendationIds: [],
      },
    })).toBe(true);
  });

  it("preserves legacy requests that already include quote and response data", () => {
    expect(isValidClientRequestPayload({
      project,
      studio: { format: "website", palette: "violet", reviewStatus: "draft" },
      quote: { amount: "100000", days: "14", paymentTerms: "À convenir" },
      clientResponse: { choice: "undecided", comment: "" },
    })).toBe(true);
  });

  it("rejects a digital display format that has not been selected as digital", () => {
    expect(isValidClientRequestPayload({
      project,
      studio: { format: "website", formatConfirmed: true, solutionFormat: "organizational", palette: "violet" },
    })).toBe(false);
  });

  it("rejects unknown universal solution formats", () => {
    expect(isValidClientRequestPayload({
      project,
      studio: { format: null, formatConfirmed: false, solutionFormat: "crypto-dashboard", palette: "violet" },
    })).toBe(false);
  });
});
