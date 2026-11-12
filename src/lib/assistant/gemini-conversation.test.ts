import { describe, expect, it } from "vitest";
import { createMerkoraConversationReply } from "./merkora-conversation";
import { mergeGeminiConversationReply } from "./gemini-conversation";

describe("mergeGeminiConversationReply", () => {
  const base = createMerkoraConversationReply({
    message: "Je veux suivre les retards du personnel et les rapports de caisse",
    history: [],
  });

  it("enriches wording while preserving deterministic domain and module decisions", () => {
    const result = mergeGeminiConversationReply({
      assistantMessage: "Précisons les retards et les mouvements de caisse.",
      clarifyingQuestions: ["Qui valide les retards ?", "Comment rapprochez-vous la caisse ?"],
      extractedNeeds: ["Suivi des retards", "Rapports de caisse"],
      moduleEnhancements: [{
        id: "cash-reports",
        description: "Enregistrer et rapprocher les mouvements de caisse.",
        reason: "Votre besoin cite explicitement les rapports de caisse.",
      }, {
        id: "invented-paid-module",
        description: "Module non autorisé",
        reason: "Ne doit pas être ajouté",
      }],
    }, base);

    expect(result?.domainId).toBe(base.domainId);
    expect(result?.status).toBe(base.status);
    expect(result?.suggestedModules.map((item) => item.id)).toEqual(base.suggestedModules.map((item) => item.id));
    expect(result?.suggestedModules.find((item) => item.id === "cash-reports")?.description)
      .toContain("rapprocher");
  });

  it("rejects incomplete output and bounds generated lists", () => {
    expect(mergeGeminiConversationReply({ assistantMessage: "Incomplete" }, base)).toBeNull();
    const result = mergeGeminiConversationReply({
      assistantMessage: "Réponse enrichie",
      clarifyingQuestions: Array.from({ length: 20 }, (_, index) => `Question ${index}`),
      extractedNeeds: Array.from({ length: 20 }, (_, index) => `Besoin ${index}`),
    }, base);
    expect(result?.clarifyingQuestions).toHaveLength(7);
    expect(result?.extractedNeeds).toHaveLength(8);
  });
});
