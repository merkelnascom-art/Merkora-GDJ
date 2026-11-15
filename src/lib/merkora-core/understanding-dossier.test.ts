import { describe, expect, it } from "vitest";
import { buildUnderstandingDossier } from "./understanding-dossier";
import type { ConversationMessage } from "./types";

const visitor = (id: string, content: string): ConversationMessage => ({
  id, conversationId: "student-vision", role: "visitor", content,
  createdAt: "2026-11-15T10:00:00.000Z",
});

describe("universal understanding dossier", () => {
  it("reads a complete Student Vision brief as one dossier instead of asking already answered basics", () => {
    const dossier = buildUnderstandingDossier([
      visitor("m1", "Student Vision : les élèves après le BAC se perdent et choisissent des filières au hasard car ils ne savent pas quel métier faire. Je veux une application sans connexion obligatoire au départ. L'élève choisit son domaine (scientifique, littéraire ou autre), indique son BAC et sa mention, puis joint ses relevés de notes. Le système analyse les notes, les points forts et faibles, puis prépare une orientation professionnelle probable. Ensuite il propose des tests mentaux, physiques, d'analyse, de réflexion, des devinettes et des jeux. Il synchronise les résultats et propose des catégories de métiers adaptées."),
    ]);

    expect(dossier.title).toBe("Student Vision");
    expect(dossier.facets.map((item) => item.dimension)).toEqual(expect.arrayContaining([
      "problem", "audience", "goal", "preference", "feature", "constraint",
    ]));
    expect(dossier.rawVisitorMessages).toHaveLength(1);
    expect(dossier.rawVisitorMessages[0]).toContain("joint ses relevés de notes");
    expect(dossier.missingDimensions).not.toContain("problem");
    expect(dossier.missingDimensions).not.toContain("audience");
    expect(dossier.missingDimensions).not.toContain("goal");
  });

  it("combines information from multiple visitor messages and ignores assistant suggestions as evidence", () => {
    const dossier = buildUnderstandingDossier([
      visitor("m1", "Je veux créer un service de réservation pour des consultations."),
      { ...visitor("a1", "Le paiement sera obligatoire."), role: "merkora" },
      visitor("m2", "Les patients choisissent un créneau et reçoivent une confirmation. Le service doit fonctionner sur téléphone."),
    ]);

    expect(dossier.facets.some((item) => /patients/i.test(item.content))).toBe(true);
    expect(dossier.facets.some((item) => /téléphone/i.test(item.content))).toBe(true);
    expect(dossier.facets.some((item) => /paiement obligatoire/i.test(item.content))).toBe(false);
  });

  it("recognizes a complaint about MerKora as conversational repair, not as the user's project problem", () => {
    const dossier = buildUnderstandingDossier([
      visitor("m1", "Avec tout ce que j'ai dit là tu n'as pas encore compris tout ça hein ?"),
    ]);

    expect(dossier.facets.some((item) => item.dimension === "problem")).toBe(false);
    expect(dossier.repairRequested).toBe(true);
  });

  it("understands an entertainment game through its audience, emotion, intended experience and mechanics", () => {
    const dossier = buildUnderstandingDossier([
      visitor("game-1", "Dare You Catch Me : je veux créer un jeu pour les jeunes qui sont stressés et frustrés par les études. Ils veulent se divertir et se défouler. Le joueur choisit une cible avec un emoji, la cible défile, disparaît et réapparaît, puis le joueur doit la toucher. Après un échec la cible grandit et le jeu devient plus difficile."),
    ]);

    const dimensions = dossier.facets.map((item) => item.dimension);
    expect(dossier.title).toBe("Dare You Catch Me");
    expect(dimensions).toEqual(expect.arrayContaining(["audience", "emotion", "experience", "activity", "feature", "goal"]));
  });

  it("recognizes a reservation and consultation workflow without requiring an industry-specific questionnaire", () => {
    const dossier = buildUnderstandingDossier([
      visitor("booking-1", "Je veux un service de réservation pour les consultations. Les patients choisissent un créneau, reçoivent une confirmation et peuvent annuler leur rendez-vous."),
    ]);

    const dimensions = dossier.facets.map((item) => item.dimension);
    expect(dimensions).toEqual(expect.arrayContaining(["preference", "activity", "audience", "feature"]));
    expect(dossier.facets.some((item) => item.content.includes("créneau"))).toBe(true);
  });

  it("recognizes a quiz and dance activity as a hybrid project rather than forcing a fixed category", () => {
    const dossier = buildUnderstandingDossier([
      visitor("dance-quiz-1", "Je veux une plateforme de quiz pour les danseurs. Ils peuvent créer des défis, répondre aux questions et comparer leurs résultats."),
    ]);

    const dimensions = dossier.facets.map((item) => item.dimension);
    expect(dimensions).toEqual(expect.arrayContaining(["preference", "activity", "audience", "feature"]));
  });

  it("does not mistake a simple event intention for a described software feature", () => {
    const dossier = buildUnderstandingDossier([
      visitor("event-1", "Je veux organiser une pool party pour mon anniversaire."),
    ]);

    expect(dossier.facets.some((item) => item.dimension === "feature")).toBe(false);
  });

  it("preserves the complete original visitor text and does not invent a missing fact", () => {
    const source = "Je veux une plateforme de quiz pour les danseurs. Ils peuvent créer des défis, répondre et comparer leurs résultats. Je n'ai pas encore décidé du mode de classement.";
    const dossier = buildUnderstandingDossier([visitor("m1", source)]);

    expect(dossier.rawVisitorMessages[0]).toBe(source);
    expect(dossier.facets.some((item) => /classement/i.test(item.content))).toBe(false);
    expect(dossier.openQuestions.length).toBeGreaterThan(0);
  });
});
