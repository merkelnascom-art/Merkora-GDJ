import React from "react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import CataloguePage from "./page";

describe("MerKora GDJ Catalogue foundation screen", () => {
  it("presents the registered product types and business domains from the canonical catalogue", () => {
    const html = renderToStaticMarkup(<CataloguePage />);
    expect(html).toContain("Site vitrine");
    expect(html).toContain("Plateforme web");
    expect(html).toContain("Application mobile");
    expect(html).toContain("Boutique / e-commerce");
    expect(html).toContain("Architecture et construction");
    expect(html).toContain("Éducation et formation");
    expect(html).toContain("Santé");
    expect(html).toContain("Agriculture");
    expect(html).toContain("Transport");
    expect(html).toContain("Médias");
  });

  it("explains that product type and business domain are two separate choices", () => {
    const html = renderToStaticMarkup(<CataloguePage />);
    expect(html).toContain("Quel type de produit souhaites-tu ?");
    expect(html).toContain("Dans quel domaine sera-t-il utilisé ?");
    expect(html).toContain("Un domaine peut utiliser plusieurs types de produits");
  });

  it("does not invent published offers or imply that checkout is already available", () => {
    const html = renderToStaticMarkup(<CataloguePage />);
    expect(html).toContain("Les offres commerciales seront publiées ici");
    expect(html).toContain("Choisis le parcours qui correspond à ton activité.");
    expect(html).toContain("/catalogue/configurer/ecommerce");
    expect(html).toContain("/catalogue/configurer/education");
    expect(html).toContain("Numérisation et archivage documentaire");
    expect(html).not.toContain("Commander maintenant");
    expect(html).not.toContain("Offre publiée");
  });

  it("keeps the path to a custom project and the existing guided journey available", () => {
    const html = renderToStaticMarkup(<CataloguePage />);
    expect(html).toContain('href="/conversation"');
    expect(html).toContain('href="/"');
  });
});
