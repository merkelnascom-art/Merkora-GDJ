import { describe, expect, it } from "vitest";
import { analyzeConversation } from "./situation-reasoning";
import type { ConversationMessage } from "./types";

function messages(...contents: string[]): ConversationMessage[] {
  return contents.map((content, index) => ({
    id: `m${index + 1}`,
    conversationId: "conversation-test",
    role: "visitor",
    content,
    createdAt: new Date(index).toISOString(),
  }));
}

describe("cross-message situation reasoning", () => {
  it("detects incompatible statements about the same operating constraint", () => {
    const result = analyzeConversation(messages(
      "La plateforme doit fonctionner sans connexion internet.",
      "Les utilisateurs doivent toujours être connectés à Internet pour l'utiliser.",
    ));

    expect(result.contradictions).toHaveLength(1);
    expect(result.contradictions[0].topic).toBe("internet_access");
    expect(result.contradictions[0].messageIds).toEqual(["m1", "m2"]);
    expect(result.nextIntervention.kind).toBe("resolve_contradiction");
  });

  it("resolves a pronoun to a clearly introduced platform across messages", () => {
    const result = analyzeConversation(messages(
      "Je veux créer une plateforme de réservation pour une clinique.",
      "Elle doit permettre aux patients de choisir un créneau.",
    ));

    expect(result.references).toContainEqual(expect.objectContaining({
      mention: "Elle",
      targetLabel: expect.stringMatching(/plateforme/i),
      resolved: true,
    }));
  });

  it("keeps directly stated facts separate from a user's hypothesis", () => {
    const result = analyzeConversation(messages(
      "Les patients choisissent un créneau depuis la plateforme.",
      "Je pense que cela réduira le temps d'attente.",
    ));

    expect(result.assertions.some((item) => item.status === "fact" && /patients/i.test(item.quote))).toBe(true);
    expect(result.assertions.some((item) => item.status === "hypothesis" && /réduira/i.test(item.quote))).toBe(true);
  });

  it("preserves a hybrid situation spanning healthcare and education", () => {
    const result = analyzeConversation(messages(
      "Je veux une plateforme pour une clinique et une école de formation.",
      "Elle doit gérer les rendez-vous médicaux et les inscriptions aux cours.",
    ));

    expect(result.domains).toEqual(expect.arrayContaining(["healthcare", "education"]));
    expect(result.isHybrid).toBe(true);
  });

  it("prioritizes an unresolved contradiction over ordinary discovery questions", () => {
    const result = analyzeConversation(messages(
      "Le service doit être accessible sans compte.",
      "Chaque utilisateur doit obligatoirement créer un compte.",
      "Je veux aussi un tableau de bord avec des statistiques.",
    ));

    expect(result.nextIntervention.kind).toBe("resolve_contradiction");
    expect(result.nextIntervention.messageIds).toEqual(["m1", "m2"]);
  });
});
