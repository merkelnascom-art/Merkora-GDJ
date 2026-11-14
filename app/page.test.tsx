import React from "react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import HomePage from "./page";
import ConversationPage from "./conversation/page";

function renderMarkup(element: React.ReactElement) {
  return renderToStaticMarkup(element).replace(/&#x27;/g, "'");
}

describe("MerKora GDJ V2 welcome screen", () => {
  it("introduces MerKora with the approved natural greeting", () => {
    const html = renderMarkup(<HomePage />);
    expect(html).toContain("Salut !");
    expect(html).toContain("MerKora.");
    expect(html).toContain("Alors, qu'est-ce qu'on imagine");
  });

  it("offers voice and text as explicit communication choices", () => {
    const html = renderMarkup(<HomePage />);
    expect(html).toContain("Choisir la conversation par la voix");
    expect(html).toContain("Choisir la conversation par écrit");
  });

  it("does not require an account to begin", () => {
    const html = renderMarkup(<HomePage />);
    expect(html).toContain("sans créer de compte");
  });
});

describe("MerKora GDJ V2 conversation screen", () => {
  it("presents the animated orb as the central listening visual", () => {
    const html = renderMarkup(<ConversationPage />);
    expect(html).toContain('aria-label="Sphère intelligente MerKora"');
    expect(html).toContain("Les ondes de MerKora");
  });

  it("offers optional examples without forcing a project category", () => {
    const html = renderMarkup(<ConversationPage />);
    expect(html).toContain("Améliorer la gestion de mon établissement");
    expect(html).toContain("Mieux suivre les ventes de mon activité");
    expect(html).toContain("J'ai une idée à développer");
    expect(html).toContain("Tu peux aussi raconter ton besoin librement");
  });

  it("keeps the text input available and is transparent about AI connection status", () => {
    const html = renderMarkup(<ConversationPage />);
    expect(html).toContain("DÉCRIS CE QUE TU SOUHAITES IMAGINER");
    expect(html).toContain("Notre façon d'échanger");
  });

  it("provides browser voice capture, transcript status, and speech playback controls", () => {
    const html = renderMarkup(<ConversationPage />);
    expect(html).toContain("Activer le microphone");
    expect(html).toContain("Arrêter l'écoute");
    expect(html).toContain("Transcription vocale");
    expect(html).toContain("Écouter la présentation");
    expect(html).toContain("La réponse intelligente à voix haute sera disponible après connexion du moteur IA");
  });
});
