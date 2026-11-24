import React from "react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import HomePage from "./page";
import ConversationPage, { ConversationPendingTurn, ConversationProcessingIndicator } from "./conversation/page";

describe("MerKora public welcome screen", () => {
  it("introduces the platform with its new promise and premium identity", () => {
    const html = renderToStaticMarkup(<HomePage />).replace(/&#x27;/g, "'");
    expect(html).toContain("L'intelligence de tes idées");
    expect(html).toContain("La puissance de leur réalisation");
    expect(html).toContain("Une idée, un problème ou une ambition ?");
  });

  it("offers three distinct entry paths and keeps the existing DRT journey reachable", () => {
    const html = renderToStaticMarkup(<HomePage />).replace(/&#x27;/g, "'");
    expect(html).toContain("MerKora Catalogue");
    expect(html).toContain("MerKora IDP");
    expect(html).toContain("MerKora DRT");
    expect(html).toContain('href="/conversation"');
  });

  it("explains the human support and catalogue paths without pretending they are already operational", () => {
    const html = renderToStaticMarkup(<HomePage />).replace(/&#x27;/g, "'");
    expect(html).toContain("Catalogue en préparation");
    expect(html).toContain("Assistance humaine en préparation");
  });

  it("contains an accessible story section and concrete solution families", () => {
    const html = renderToStaticMarkup(<HomePage />).replace(/&#x27;/g, "'");
    expect(html).toContain('aria-labelledby="mk-story-title"');
    expect(html).toContain("Sites web");
    expect(html).toContain("Applications mobiles");
    expect(html).toContain("Plateformes métiers");
    expect(html).toContain("Jeux numériques");
  });


  it("keeps the homepage short and reserves each product catalogue for its own MerKora GDJ space", () => {
    const html = renderToStaticMarkup(<HomePage />).replace(/&#x27;/g, "'");
    expect(html).toContain("MerKora GDJ");
    expect(html).toContain('href="/catalogue"');
    expect(html).toContain('href="/idp"');
    expect(html).toContain('href="/conversation"');
    expect(html).not.toContain("Applications mobiles");
    expect(html).not.toContain("Qu'est-ce qu'on peut construire ?");
    expect(html).not.toContain("De la première idée");
  });

  it("uses the brand's deep marine blue and presents a clearly identified video area", () => {
    const html = renderToStaticMarkup(<HomePage />);
    expect(html).toContain("MerKora GDJ");
    expect(html).toContain('aria-label="Présentation vidéo de MerKora GDJ"');
    expect(html).toContain("Vidéo de présentation bientôt disponible");
  });

  it("keeps the customer account entry available", () => {
    const html = renderToStaticMarkup(<HomePage />).replace(/&#x27;/g, "'");
    expect(html).toContain('href="/auth"');
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

  it("starts with one short open question instead of several examples", () => {
    const html = renderToStaticMarkup(<ConversationPage />);
    expect(html).toContain("UNE PREMIÈRE QUESTION");
    expect(html).toContain("En quelques mots, que souhaites-tu améliorer ou créer ?");
    expect(html).toContain("je te pose une question, tu réponds, puis je passe à la suivante");
    expect(html).not.toContain("Améliorer la gestion de mon établissement");
    expect(html).not.toContain("DÉCRYPTAGE EN DIRECT");
  });

  it("keeps a text-only input and removes voice mode controls", () => {
    const html = renderToStaticMarkup(<ConversationPage />);
    expect(html).toContain("UNE PREMIÈRE QUESTION");
    expect(html).not.toContain("Notre façon d'échanger");
    expect(html).not.toContain(">Voix<");
    expect(html).not.toContain("Mode voix sélectionné");
  });
});
