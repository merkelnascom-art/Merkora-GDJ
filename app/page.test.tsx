import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import HomePage from "./page";

describe("MerKora GDJ V2 welcome screen", () => {
  it("introduces MerKora with the approved natural greeting", () => {
    const html = renderToStaticMarkup(<HomePage />);
    expect(html).toContain("Salut ! Moi, c'est MerKora.");
    expect(html).toContain("Alors, qu'est-ce qu'on imagine");
  });

  it("offers voice and text as explicit communication choices", () => {
    const html = renderToStaticMarkup(<HomePage />);
    expect(html).toContain("Choisir la conversation par la voix");
    expect(html).toContain("Choisir la conversation par écrit");
  });

  it("does not require an account to begin", () => {
    const html = renderToStaticMarkup(<HomePage />);
    expect(html).toContain("sans créer de compte");
  });
});
