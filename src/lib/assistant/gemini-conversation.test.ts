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

  it("keeps the deterministic next question first even when the model proposes different questions", () => {
    const deterministicQuestion = base.clarifyingQuestions[0];
    expect(deterministicQuestion).toBeTruthy();
    const result = mergeGeminiConversationReply({
      assistantMessage: "Précisons votre organisation.",
      clarifyingQuestions: ["Question inventée par le modèle ?", deterministicQuestion],
      extractedNeeds: ["Suivi du personnel"],
    }, base);
    expect(result?.clarifyingQuestions[0]).toBe(deterministicQuestion);
    expect(result?.clarifyingQuestions.filter((question) => question === deterministicQuestion)).toHaveLength(1);
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

  it("does not let model wording override a deterministic contradiction gate", () => {
    const blocked = createMerkoraConversationReply({
      message: "Seul moi peux voir les montants.",
      history: [
        { role: "user", content: "Toute ma famille doit pouvoir consulter les contributions." },
        { role: "assistant", content: "Qui doit pouvoir consulter les montants ?" },
      ],
    });
    expect(blocked.discovery.stage).toBe("resolve_contradiction");
    const result = mergeGeminiConversationReply({
      assistantMessage: "Tout est clair. Votre solution est prête à être réalisée.",
      clarifyingQuestions: ["Quel design préférez-vous ?"],
      extractedNeeds: ["Créer un tableau de bord"],
      moduleEnhancements: [],
    }, blocked);

    expect(result?.assistantMessage).toBe(blocked.assistantMessage);
    expect(result?.status).toBe("needs_clarification");
    expect(result?.nextAction).toBe("clarify_need");
    expect(result?.clarifyingQuestions[0]).toBe(blocked.clarifyingQuestions[0]);
    expect(result?.suggestedModules).toHaveLength(0);
  });

});
