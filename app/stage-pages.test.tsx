import React from "react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import UnderstandingPage from "./understanding/page";
import DiagnosticPage from "./diagnostic/page";
import ProductDefinitionPage from "./product-definition/page";
import SolutionProposalPage from "./solution-proposal/page";

describe("MerKora screen 03 — project understanding", () => {
  it("presents the universal understanding stage without a sector selector", () => {
    const html = renderToStaticMarkup(<UnderstandingPage />);
    expect(html).toContain("Vérifions-le ensemble");
    expect(html).toContain("activité, idée, situation");
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


describe("MerKora screen 05 — adaptive product definition", () => {
  it("presents the 12 decision families as a conditional library and keeps one active question", () => {
    const html = renderToStaticMarkup(<ProductDefinitionPage />);
    expect(html).toContain("Définissons le");
    expect(html).toContain("produit à concevoir.");
    expect(html).toContain("12 familles");
    expect(html).toContain("Une question à la fois");
    expect(html).toContain("Non applicable");
    expect(html).toContain("Je ne sais pas encore");
    expect(html).toContain("Passer pour le moment");
    expect(html).toContain("Réponses déjà données");
    expect(html).not.toContain("Questionnaire complet");
  });
});


describe("MerKora screen 06 — solution proposal", () => {
  it("introduces product framing and keeps the visual mockup as the next distinct stage", () => {
    const html = renderToStaticMarkup(<SolutionProposalPage />);
    expect(html).toContain("Construisons la structure");
    expect(html).toContain("ÉTAPE 06 · ARCHITECTURE ET COMPOSITION");
    expect(html).toContain("identifier le produit et son domaine");
    expect(html).toContain("07 · Maquette");
    expect(html).not.toContain("Questionnaire complet");
  });
});
