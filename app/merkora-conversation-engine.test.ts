import { describe, expect, it } from "vitest";
import {
  answerUnderstanding,
  beginUnderstanding,
  decideUnderstandingSummary,
  deferUnderstandingQuestion,
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


  it("lets the person defer a question without inventing an answer or repeating it", () => {
    const first = beginUnderstanding("Je veux améliorer mon centre de formation.");
    const skipped = deferUnderstandingQuestion(first);

    expect(skipped.deferredDimensions).toContain("problem");
    expect(skipped.evidence.some((item) => item.dimension === "problem")).toBe(false);
    expect(skipped.pendingQuestion?.dimension).not.toBe("problem");
  });

  it("shows skipped points in the final provisional summary instead of silently dropping them", () => {
    const first = beginUnderstanding(
      "Je veux améliorer le centre de formation. Aujourd'hui, je note les présences dans un cahier. Les enseignants sont concernés. Parce que les horaires changent.",
    );
    const skipped = deferUnderstandingQuestion(first);

    expect(skipped.stage).toBe("summary_validation");
    expect(skipped.summary).toContain("Points laissés en attente");
    expect(skipped.summary).toContain("Quel besoin concret veux-tu satisfaire");
  });

  it("records an imagined solution separately and still asks what need it should solve", () => {
    const session = beginUnderstanding("Je veux créer une plateforme pour gérer les rendez-vous.");
    expect(session.evidence.some((item) => item.dimension === "preference" && item.status === "user_stated")).toBe(true);
    expect(session.pendingQuestion?.dimension).toBe("problem");
  });

  it("pauses the ordinary flow when access statements conflict and asks the person to clarify", () => {
    const session = beginUnderstanding(
      "Toute ma famille doit pouvoir consulter les contributions.\nFinalement, seul moi peux voir les montants.",
    );

    expect(session.pendingQuestion?.dimension).toBe("business_rule");
    expect(session.contradictions).toEqual(expect.arrayContaining([
      expect.objectContaining({ topic: "access", confirmationRequired: true }),
    ]));
    expect(session.evidence.some((item) => item.status === "validated")).toBe(false);

    const clarified = answerUnderstanding(
      session,
      "La famille peut consulter les totaux, mais seuls les montants détaillés me sont réservés.",
    );
    expect(clarified.resolvedContradictionKeys).toHaveLength(1);
    expect(clarified.pendingQuestion?.dimension).not.toBe("business_rule");
  });

  it("clarifies whether multiple activity groups belong to one project or separate projects", () => {
    const first = beginUnderstanding(
      "Je veux suivre les revenus de ma famille et noter les heures de visite de mes amis.",
    );
    expect(first.pendingQuestion?.dimension).toBe("project_scope");

    const ambiguous = answerUnderstanding(first, "Oui");
    expect(ambiguous.pendingQuestion?.id).toBe("clarify-project-scope-choice-v1");
    expect(ambiguous.evidence.some((item) => item.dimension === "project_scope")).toBe(false);

    const explicit = answerUnderstanding(ambiguous, "Un seul projet commun.");
    expect(explicit.evidence.some((item) => item.dimension === "project_scope")).toBe(true);
    expect(explicit.pendingQuestion?.dimension).not.toBe("project_scope");
  });

  it("asks about information and access when other people are involved", () => {
    const session = beginUnderstanding(
      "Je veux mieux suivre les contributions de ma famille. Aujourd'hui, je note les contributions dans un cahier. Le problème est que je perds les montants. Parce que les notes sont dispersées. Mon objectif est de retrouver les montants rapidement.",
    );
    expect(session.pendingQuestion?.dimension).toBe("risk");
    expect(session.pendingQuestion?.prompt).toMatch(/informées|informations/i);
  });

  it("preserves an explicit privacy or consent statement instead of asking it again", () => {
    const session = beginUnderstanding(
      "Je veux mieux suivre les contributions de ma famille. Aujourd'hui, je note les contributions dans un cahier. Le problème est que je perds les montants. Parce que les notes sont dispersées. Mon objectif est de retrouver les montants rapidement. Les membres sont informés et ont donné leur accord.",
    );
    expect(session.evidence.some((item) => item.dimension === "risk" && item.status === "user_stated")).toBe(true);
    expect(session.pendingQuestion?.dimension).not.toBe("risk");
  });

  it("does not force a domain when the initial idea is vague or hybrid", () => {
    const session = beginUnderstanding("Je veux mieux organiser certaines choses.");
    expect(session.intentClues).toEqual([]);
    expect(session.pendingQuestion?.dimension).toBe("problem");
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


describe("MerKora intent-first understanding and conversational repair", () => {
  it("recognizes an event to organize instead of treating it as an existing problem", () => {
    const session = beginUnderstanding(
      "Je veux organiser une pool party pour mon anniversaire et inviter mes amis.",
    );

    expect(session.intentKind).toBe("organize_event");
    expect(session.pendingQuestion?.prompt).toMatch(/date|période|prévu/i);
    expect(session.pendingQuestion?.dimension).not.toBe("problem");
    expect(session.pendingQuestion?.dimension).not.toBe("activity");
  });

  it("recognizes a reservation request and asks for reservation-specific information", () => {
    const session = beginUnderstanding("Je veux réserver une table pour samedi soir.");

    expect(session.intentKind).toBe("reservation");
    expect(session.pendingQuestion?.prompt).toMatch(/réserver|date|heure|personnes/i);
    expect(session.pendingQuestion?.dimension).not.toBe("problem");
  });

  it("recognizes a creation project such as opening a school without assuming an existing process", () => {
    const session = beginUnderstanding("Je veux créer une école pour former des jeunes.");

    expect(session.intentKind).toBe("create_project");
    expect(session.pendingQuestion?.prompt).toMatch(/créer|école|personnes|public/i);
    expect(session.pendingQuestion?.dimension).not.toBe("activity");
  });

  it("treats a user saying MerKora did not understand as a conversational repair, not as a cause", () => {
    const first = beginUnderstanding("Je veux organiser une pool party pour mon anniversaire.");
    const repaired = answerUnderstanding(
      first,
      "Non mais tu ne me suis pas, est-ce que tu me comprends ?",
    );

    expect(repaired.messages.at(-1)?.content).toMatch(/raison|reprenons|comprendre/i);
    expect(repaired.pendingQuestion?.prompt).toMatch(/concrètement|expliquer|reformuler/i);
    expect(repaired.evidence.some((item) => item.dimension === "cause")).toBe(false);
  });
});
