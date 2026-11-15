import React from "react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import UnderstandingPage from "./understanding/page";
import DiagnosticPage from "./diagnostic/page";

describe("MerKora screen 03 — project understanding", () => {
  it("presents the universal understanding stage without a sector selector", () => {
    const html = renderToStaticMarkup(<UnderstandingPage />);
    expect(html).toContain("Vérifions-le ensemble");
    expect(html).toContain("Activité, idée ou phénomène");
    expect(html).toContain("Ce qui reste inconnu ne sera pas inventé");
    expect(html).not.toContain("Choisis ton secteur");
  });
});

describe("MerKora screen 04 — adaptive diagnostic", () => {
  it("presents one-question-at-a-time diagnostic language and allows uncertainty", () => {
    const html = renderToStaticMarkup(<DiagnosticPage />);
    expect(html).toContain("Une question à la fois");
    expect(html).toContain("Je ne sais pas encore");
    expect(html).toContain("Réponses déjà données");
    expect(html).not.toContain("Questionnaire complet");
  });
});
