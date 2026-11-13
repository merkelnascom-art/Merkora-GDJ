import { describe, expect, it } from "vitest";
import { analyzeUniversalProjectIntent } from "./universal-project-understanding";
import { selectNextDiscoveryQuestion } from "./universal-project-discovery";

describe("selectNextDiscoveryQuestion", () => {
  it("asks whether several needs belong together before asking lower-priority details", () => {
    const analysis = analyzeUniversalProjectIntent(
      "Je veux suivre les revenus de ma famille et noter les heures de visite de mes amis.",
    );
    const result = selectNextDiscoveryQuestion(analysis, []);

    expect(result.stage).toBe("project_scope");
    expect(result.nextQuestion).toMatch(/même projet|séparément/i);
    expect(result.readyForSolutionReview).toBe(false);
  });

  it("uses prior answers to avoid repeating the project-scope question", () => {
    const analysis = analyzeUniversalProjectIntent(
      "Je veux suivre les revenus de ma famille et noter les heures de visite de mes amis.",
    );
    const result = selectNextDiscoveryQuestion(analysis, [
      { role: "assistant", content: "Ces besoins font-ils partie d'un même projet ?" },
      { role: "user", content: "Oui, c'est un seul projet." },
    ]);

    expect(result.stage).not.toBe("project_scope");
    expect(result.nextQuestion).toMatch(/procédez-vous aujourd'hui/i);
  });

  it("understands a short yes or no answer when the preceding assistant question defines the topic", () => {
    const analysis = analyzeUniversalProjectIntent(
      "Je veux suivre les revenus de ma famille et noter les heures de visite de mes amis.\nOui.",
    );
    const result = selectNextDiscoveryQuestion(analysis, [
      { role: "assistant", content: "Ces besoins font-ils partie d'un même projet ou souhaitez-vous les traiter séparément ?" },
    ]);

    expect(result.stage).toBe("current_process");
  });

  it("asks about current operations when the user only describes a desired outcome", () => {
    const analysis = analyzeUniversalProjectIntent("Je veux recevoir un résumé des dépenses de la maison.");
    const result = selectNextDiscoveryQuestion(analysis, []);

    expect(result.stage).toBe("current_process");
    expect(result.nextQuestion).toMatch(/aujourd'hui|actuellement/i);
  });

  it("does not ask for current operations again after the user explicitly described them", () => {
    const analysis = analyzeUniversalProjectIntent(
      "Aujourd'hui je note les contributions dans un cahier. Je veux recevoir un résumé chaque dimanche.",
    );
    const result = selectNextDiscoveryQuestion(analysis, []);

    expect(result.stage).not.toBe("current_process");
    expect(result.nextQuestion).toBeTruthy();
    expect(result.readyForSolutionReview).toBe(false);
  });

  it("detects conflicting access instructions and asks for clarification before proceeding", () => {
    const analysis = analyzeUniversalProjectIntent(
      "Toute ma famille doit pouvoir consulter les contributions.\nFinalement, seul moi peux voir les montants.",
    );
    expect(analysis.intentGroups).toHaveLength(1);
    const result = selectNextDiscoveryQuestion(analysis, []);

    expect(result.stage).toBe("resolve_contradiction");
    expect(result.contradictions).toEqual(expect.arrayContaining([
      expect.objectContaining({ topic: "access", confirmationRequired: true }),
    ]));
    expect(result.nextQuestion).toMatch(/qui doit réellement pouvoir/i);
    expect(result.readyForSolutionReview).toBe(false);
  });

  it("detects conflicting access requirements stated in different conversation turns", () => {
    const analysis = analyzeUniversalProjectIntent(
      "Finalement, seul moi peux consulter les montants.",
    );
    const result = selectNextDiscoveryQuestion(analysis, [
      { role: "user", content: "Toute ma famille doit pouvoir consulter les contributions." },
      { role: "assistant", content: "Qui doit pouvoir consulter les informations ?" },
    ]);

    expect(result.stage).toBe("resolve_contradiction");
    expect(result.contradictions).toEqual(expect.arrayContaining([
      expect.objectContaining({ topic: "access", confirmationRequired: true }),
    ]));
    expect(result.readyForSolutionReview).toBe(false);
  });

  it("detects a conflict between informed consent and covert collection", () => {
    const analysis = analyzeUniversalProjectIntent(
      "Les visiteurs seront informés et pourront donner leur accord.\nJe veux pourtant enregistrer leurs visites sans les prévenir.",
    );
    const result = selectNextDiscoveryQuestion(analysis, []);

    expect(result.stage).toBe("resolve_contradiction");
    expect(result.contradictions).toEqual(expect.arrayContaining([
      expect.objectContaining({ topic: "consent", confirmationRequired: true }),
    ]));
    expect(result.nextQuestion).toMatch(/informée|informé|accepter ou refuser/i);
    expect(result.readyForSolutionReview).toBe(false);
  });

  it("returns one question at a time and never declares a solution ready while critical gaps remain", () => {
    const analysis = analyzeUniversalProjectIntent("Je veux mieux organiser certaines choses.");
    const result = selectNextDiscoveryQuestion(analysis, []);

    expect(result.nextQuestion).toBeTruthy();
    expect(result.remainingGaps.length).toBeGreaterThan(0);
    expect(result.readyForSolutionReview).toBe(false);
  });
});
