import { describe, expect, it } from "vitest";
import { createKnowledgeRegistry } from "./registry";
import { matchKnowledgeConcept } from "./matching";
import type { KnowledgeConcept } from "./types";

const concept = (overrides: Partial<KnowledgeConcept> & Pick<KnowledgeConcept, "id" | "canonicalKey" | "conceptType" | "definitions" | "terms">): KnowledgeConcept => ({
  id: overrides.id,
  canonicalKey: overrides.canonicalKey,
  conceptType: overrides.conceptType,
  definitions: overrides.definitions,
  terms: overrides.terms,
  classifications: overrides.classifications ?? [],
  attributes: overrides.attributes ?? [],
  relationships: overrides.relationships ?? [],
  scope: overrides.scope ?? { global: true },
  lifecycle: overrides.lifecycle ?? { status: "validated", version: 1, createdAt: "2026-11-15T00:00:00.000Z", updatedAt: "2026-11-15T00:00:00.000Z" },
  sources: overrides.sources ?? [],
  reliability: overrides.reliability ?? { evidenceLevel: "documented", reviewStatus: "reviewed" },
});

describe("knowledge concept matching", () => {
  const registry = createKnowledgeRegistry([
    concept({
      id: "energy:solar",
      canonicalKey: "energy.solar",
      conceptType: "energy_source",
      definitions: [{ language: "fr", label: "Énergie solaire", definition: "Énergie issue du rayonnement solaire." }],
      terms: [{ value: "énergie solaire", language: "fr", kind: "preferred" }, { value: "solar energy", language: "en", kind: "preferred" }],
    }),
    concept({
      id: "energy:photovoltaic",
      canonicalKey: "energy.photovoltaic",
      conceptType: "technology",
      definitions: [{ language: "fr", label: "Photovoltaïque", definition: "Technologie de conversion de la lumière en électricité." }],
      terms: [{ value: "photovoltaïque", language: "fr", kind: "preferred" }, { value: "solaire photovoltaïque", language: "fr", kind: "synonym" }],
    }),
  ]);

  it("matches an exact preferred term", () => {
    const result = matchKnowledgeConcept("Énergie solaire", registry);
    expect(result.status).toBe("matched");
    if (result.status !== "matched") throw new Error("Expected a match.");
    expect(result.method).toBe("exact");
    expect(result.concept.id).toBe("energy:solar");
  });

  it("matches normalized accents and spacing while preserving the concept identity", () => {
    const result = matchKnowledgeConcept("  energie   solaire ", registry);
    expect(result.status).toBe("matched");
    if (result.status !== "matched") throw new Error("Expected a match.");
    expect(result.method).toBe("normalized");
    expect(result.concept.id).toBe("energy:solar");
  });

  it("matches a declared synonym without treating lexical similarity as semantic proof", () => {
    const result = matchKnowledgeConcept("solaire photovoltaïque", registry);
    expect(result.status).toBe("matched");
    if (result.status !== "matched") throw new Error("Expected a match.");
    expect(result.method).toBe("synonym");
    expect(result.confidence).toBeLessThan(1);
  });

  it("returns ambiguity instead of arbitrarily selecting equally good concepts", () => {
    const ambiguous = createKnowledgeRegistry([
      concept({
        id: "a:one",
        canonicalKey: "ambiguous.one",
        conceptType: "thing",
        definitions: [{ language: "fr", label: "Installation", definition: "Sens A." }],
        terms: [{ value: "installation", language: "fr", kind: "preferred" }],
      }),
      concept({
        id: "b:two",
        canonicalKey: "ambiguous.two",
        conceptType: "process",
        definitions: [{ language: "fr", label: "Installation", definition: "Sens B." }],
        terms: [{ value: "installation", language: "fr", kind: "preferred" }],
      }),
    ]);
    expect(matchKnowledgeConcept("installation", ambiguous).status).toBe("ambiguous");
  });

  it("does not invent a semantic match for an unknown term", () => {
    expect(matchKnowledgeConcept("activité quantique artisanale", registry).status).toBe("unmatched");
  });

  it("can return a type-only reference when the caller explicitly permits it", () => {
    const result = matchKnowledgeConcept("not in the catalog", registry, {
      expectedType: "energy_source",
      allowTypeFallback: true,
    });
    expect(result.status).toBe("type_only");
    if (result.status !== "type_only") throw new Error("Expected a type-only result.");
    expect(result.concept.id).toBe("energy:solar");
  });
  it("does not use proposed, rejected or deprecated concepts for ordinary matching", () => {
    const notValidated = createKnowledgeRegistry([
      concept({
        id: "draft:term",
        canonicalKey: "draft.term",
        conceptType: "experimental",
        definitions: [{ language: "fr", label: "Terme expérimental", definition: "Non validé." }],
        terms: [{ value: "terme expérimental", language: "fr", kind: "preferred" }],
        lifecycle: { status: "proposed", version: 1, createdAt: "2026-11-15T00:00:00.000Z", updatedAt: "2026-11-15T00:00:00.000Z" },
      }),
    ]);

    expect(matchKnowledgeConcept("Terme expérimental", notValidated).status).toBe("unmatched");
    expect(matchKnowledgeConcept("Terme expérimental", notValidated, { includeNonValidated: true }).status).toBe("matched");
  });

  it("does not expose a local concept outside its declared geographic or project scope", () => {
    const localRegistry = createKnowledgeRegistry([
      concept({
        id: "local:practice",
        canonicalKey: "local.practice",
        conceptType: "practice",
        definitions: [{ language: "fr", label: "Pratique locale", definition: "Connaissance limitée au Bénin." }],
        terms: [{ value: "pratique locale", language: "fr", kind: "preferred" }],
        scope: { global: false, countries: ["BJ"] },
      }),
    ]);

    expect(matchKnowledgeConcept("Pratique locale", localRegistry).status).toBe("unmatched");
    expect(matchKnowledgeConcept("Pratique locale", localRegistry, { country: "BJ" }).status).toBe("matched");
  });

});
