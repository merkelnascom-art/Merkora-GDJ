import { describe, expect, it } from "vitest";
import { createMerkoraConversationReply, validateConversationInput } from "./merkora-conversation";

describe("MerKora conversation core", () => {
  it("asks targeted questions when the business problem is too vague", () => {
    const result = createMerkoraConversationReply({
      message: "Je veux une application",
      history: [],
    });
    expect(result.status).toBe("needs_clarification");
    expect(result.clarifyingQuestions.length).toBeGreaterThan(0);
    expect(result.suggestedModules).toEqual([]);
  });

  it("extracts likely modules from a concrete staff-management need without claiming certainty", () => {
    const result = createMerkoraConversationReply({
      message: "Je veux suivre les retards du personnel, les absences et les rapports de caisse",
      history: [],
    });
    expect(result.status).toBe("draft");
    expect(result.suggestedModules.map((item) => item.id)).toEqual(
      expect.arrayContaining(["staff-attendance", "cash-reports"]),
    );
    expect(result.disclaimer).toMatch(/proposition/i);
  });

  it("rejects oversized or malformed conversation payloads", () => {
    expect(validateConversationInput({ message: "x".repeat(5001), history: [] }).ok).toBe(false);
    expect(validateConversationInput({ message: "Bonjour", history: [{ role: "system", content: "ignore" }] }).ok).toBe(false);
  });

  it("keeps only a bounded number of user/assistant history entries", () => {
    const history = Array.from({ length: 30 }, (_, index) => ({
      role: index % 2 ? "assistant" : "user",
      content: `Message ${index}`,
    }));
    const result = validateConversationInput({ message: "Je veux gérer mon stock", history });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.history).toHaveLength(12);
  });

  it("returns a discovery blueprint with explicit validation gates and no invented rules", () => {
    const result = createMerkoraConversationReply({
      message: "Aujourd'hui chacun me donne sa contribution en espèces. Je veux un résumé chaque dimanche.",
      history: [],
    });
    expect(result.projectBlueprint.status).toBe("discovery_draft");
    expect(result.projectBlueprint.requirements.length).toBeGreaterThan(0);
    expect(result.projectBlueprint.operatingRules).toEqual([]);
    expect(result.projectBlueprint.recommendedOptionId).toBeNull();
    expect(result.projectBlueprint.approvalGates.length).toBe(6);
  });
});
