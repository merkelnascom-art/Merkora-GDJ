import { describe, expect, it } from "vitest";
import {
  answerUnderstanding,
  beginUnderstanding,
  decideUnderstandingSummary,
} from "../src/lib/merkora-core/conversation-engine";

describe("MerKora screen 2 guided understanding journey", () => {
  it("preserves the original message and asks one useful missing question without inventing facts", () => {
    const session = beginUnderstanding(
      "Je veux améliorer la gestion de mon centre de formation.",
    );

    expect(session.originalDescription).toBe(
      "Je veux améliorer la gestion de mon centre de formation.",
    );
    expect(session.pendingQuestion?.dimension).toBe("problem");
    expect(session.messages.filter((message) => message.role === "merkora")).toHaveLength(1);
    expect(session.evidence.some((item) => item.status === "validated")).toBe(false);
  });

  it("adapts the next question as the person explains the problem, current process and cause", () => {
    const first = beginUnderstanding(
      "Je veux améliorer la gestion de mon centre de formation.",
    );
    const afterProblem = answerUnderstanding(
      first,
      "Les enseignants arrivent souvent en retard.",
    );

    expect(afterProblem.pendingQuestion?.dimension).toBe("activity");
    expect(afterProblem.evidence.some(
      (item) => item.dimension === "problem" &&
        item.value === "Les enseignants arrivent souvent en retard." &&
        item.status === "user_stated",
    )).toBe(true);

    const afterProcess = answerUnderstanding(
      afterProblem,
      "Aujourd'hui, je note les présences dans un cahier.",
    );
    expect(afterProcess.pendingQuestion?.dimension).toBe("cause");

    const afterCause = answerUnderstanding(
      afterProcess,
      "Parce que les horaires changent et personne ne prévient.",
    );
    expect(afterCause.stage).toBe("summary_validation");
    expect(afterCause.pendingQuestion).toBeNull();
    expect(afterCause.summary).toContain("centre de formation");
    expect(afterCause.summary).toContain("Les enseignants arrivent souvent en retard.");

    const confirmed = decideUnderstandingSummary(afterCause, "confirmed");
    expect(confirmed.stage).toBe("complete");
    expect(confirmed.evidence.every((item) => item.status === "validated")).toBe(true);
  });

  it("does not ask a second question when an answer is blank", () => {
    const first = beginUnderstanding("Je veux mieux organiser mon activité.");
    const afterBlank = answerUnderstanding(first, "   ");

    expect(afterBlank.messages).toHaveLength(first.messages.length);
    expect(afterBlank.pendingQuestion?.id).toBe(first.pendingQuestion?.id);
  });

  it("records an explicit summary decision and keeps a correction traceable", () => {
    const session = beginUnderstanding(
      "Je veux améliorer le centre de formation. Les enseignants arrivent en retard. Aujourd'hui, je note les présences dans un cahier. Parce que les horaires changent.",
    );
    const corrected = decideUnderstandingSummary(
      session,
      "corrected",
      "Ce n'est pas un centre de formation, c'est un centre de santé.",
    );

    expect(corrected.validations).toHaveLength(1);
    expect(corrected.validations[0].decision).toBe("corrected");
    expect(corrected.validations[0].correction).toBe(
      "Ce n'est pas un centre de formation, c'est un centre de santé.",
    );
    expect(corrected.messages.at(-1)?.content).toContain("centre de santé");
  });
});
