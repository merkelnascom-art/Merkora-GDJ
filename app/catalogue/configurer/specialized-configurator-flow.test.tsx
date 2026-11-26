import React from "react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import SpecializedConfiguratorFlow from "./specialized-configurator-flow";
import { getSpecializedConfigurator } from "../../../src/lib/merkora-core/specialized-configurators";

describe("specialized configurator flow", () => {
  it("shows one clear question, contextual help and a free-text precision field", () => {
    const configurator = getSpecializedConfigurator("ecommerce");
    if (!configurator) throw new Error("Missing e-commerce configurator");
    const html = renderToStaticMarkup(<SpecializedConfiguratorFlow configurator={configurator} />);
    expect(html).toContain("Modèle de vente");
    expect(html).toContain("Que vendra la boutique");
    expect(html).toContain("Précision avec vos propres mots");
    expect(html).toContain("Continuer");
    expect(html).not.toContain("Catalogue et fiches");
  });

  it("explains that the client can review their answers before leaving the configurator", () => {
    const configurator = getSpecializedConfigurator("reservation");
    if (!configurator) throw new Error("Missing reservation configurator");
    const html = renderToStaticMarkup(<SpecializedConfiguratorFlow configurator={configurator} />);
    expect(html).toContain("Tes réponses seront regroupées");
    expect(html).toContain("Enregistrer mon avancement");
  });
});
