import React from "react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import HomePage from "./page";
import ConversationPage, { ConversationPendingTurn, ConversationProcessingIndicator } from "./conversation/page";

describe("MerKora GDJ V2 welcome screen", () => {
  it("introduces MerKora with the approved natural greeting", () => {
    const html = renderToStaticMarkup(<HomePage />);
    expect(html).toContain("Salut !");
    expect(html).toContain("MerKora.");
    expect(html).toContain("Alors, qu&#x27;est-ce qu&#x27;on imagine");
  });

  it("offers written communication only while voice is paused", () => {
    const html = renderToStaticMarkup(<HomePage />);
    expect(html).toContain("ON COMMENCE PAR ÉCRIT");
    expect(html).not.toContain("Par la voix");
    expect(html).not.toContain("Choisir la conversation par la voix");
  });

  it("does not require an account to begin", () => {
    const html = renderToStaticMarkup(<HomePage />);
    expect(html).toContain("sans créer de compte");
  });
});

describe("MerKora GDJ V2 conversation screen", () => {
  it("presents the animated orb as the central conversation visual", () => {
    const html = renderToStaticMarkup(<ConversationPage />);
    expect(html).toContain('aria-label="Sphère intelligente MerKora"');
    expect(html).toContain("Les ondes de MerKora");
  });

  it("shows a live animated thinking state while MerKora processes a message", () => {
    const html = renderToStaticMarkup(<ConversationProcessingIndicator visible activity="analyzing" />);
    expect(html).toContain('data-testid="mk-thinking-indicator"');
    expect(html).toContain("MerKora réfléchit à ta réponse");
    expect(html).toContain('aria-busy="true"');
  });

  it("does not render the thinking indicator when processing is finished", () => {
    const html = renderToStaticMarkup(<ConversationProcessingIndicator visible={false} activity="idle" />);
    expect(html).toBe("");
  });
  it("places the thinking animation directly after the visitor message in the dialogue", () => {
    const html = renderToStaticMarkup(<ConversationPendingTurn message="Je veux organiser mon activité." activity="analyzing" />);
    expect(html.indexOf("Je veux organiser mon activité.")).toBeLessThan(html.indexOf("mk-thinking-indicator"));
    expect(html).toContain("MerKora réfléchit à ta réponse");
  });
  it("offers optional examples without forcing a project category", () => {
    const html = renderToStaticMarkup(<ConversationPage />);
    expect(html).toContain("Améliorer la gestion de mon établissement");
    expect(html).toContain("Mieux suivre les ventes de mon activité");
    expect(html).toContain("J&#x27;ai une idée à développer");
    expect(html).toContain("Tu peux aussi raconter ton besoin librement");
  });

  it("keeps a text-only input and removes voice mode controls", () => {
    const html = renderToStaticMarkup(<ConversationPage />);
    expect(html).toContain("DÉCRIS CE QUE TU SOUHAITES IMAGINER");
    expect(html).not.toContain("Notre façon d'échanger");
    expect(html).not.toContain(">Voix<");
    expect(html).not.toContain("Mode voix sélectionné");
  });
});
