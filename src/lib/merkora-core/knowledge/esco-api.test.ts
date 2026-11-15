import { describe, expect, it } from "vitest";
import { normalizeESCOApiSuggestions } from "./esco-api";

describe("ESCO API suggestion normalization", () => {
  it("normalizes HAL suggestion fragments into stable external references", () => {
    const results = normalizeESCOApiSuggestions({
      _embedded: {
        results: [
          {
            uri: "http://data.europa.eu/esco/occupation/123",
            title: "Développeur logiciel",
            description: "Conçoit et développe des logiciels.",
            altLabels: ["programmeur", "ingénieur logiciel"],
          },
        ],
      },
    }, "fr");

    expect(results).toEqual([{
      uri: "http://data.europa.eu/esco/occupation/123",
      label: "Développeur logiciel",
      description: "Conçoit et développe des logiciels.",
      alternativeLabels: ["programmeur", "ingénieur logiciel"],
      language: "fr",
      source: "ESCO",
    }]);
  });

  it("accepts alternate ESCO response shapes and removes duplicate or incomplete entries", () => {
    const results = normalizeESCOApiSuggestions({
      items: [
        { conceptUri: "https://data.europa.eu/esco/occupation/a", preferredLabel: "Comptable" },
        { conceptUri: "https://data.europa.eu/esco/occupation/a", preferredLabel: "Comptable" },
        { conceptUri: "https://data.europa.eu/esco/occupation/b", preferredLabel: "" },
        { uri: "https://data.europa.eu/esco/occupation/c", label: "Électricien" },
      ],
    }, "fr");

    expect(results.map((item) => item.label)).toEqual(["Comptable", "Électricien"]);
    expect(results[0].uri).toContain("/occupation/a");
  });

  it("does not invent a translation when a requested language is absent", () => {
    const results = normalizeESCOApiSuggestions({
      results: [{ uri: "https://data.europa.eu/esco/occupation/x", preferredLabel: "Bookkeeper" }],
    }, "en");

    expect(results[0].language).toBe("en");
    expect(results[0].label).toBe("Bookkeeper");
  });
});
