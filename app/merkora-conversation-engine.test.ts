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
  it("analyzes a complete Student Vision brief before asking anything already answered", () => {
    const session = beginUnderstanding(
      "Student Vision : les élèves après le BAC se perdent et choisissent des filières au hasard car ils ne savent pas quel métier faire. Je veux une application sans connexion obligatoire au départ. L'élève choisit son domaine scientifique ou littéraire, indique son BAC et sa mention, puis joint ses relevés de notes. Le système analyse les notes, les points forts et faibles, puis propose une orientation professionnelle. Ensuite il propose des tests mentaux, physiques, d'analyse, de réflexion, des devinettes et des jeux, synchronise les résultats et propose des catégories de métiers.",
    );

    expect(session.stage).toBe("summary_validation");
    expect(session.pendingQuestion).toBeNull();
    expect(session.dossier.title).toBe("Student Vision");
    expect(session.dossier.facets.map((item) => item.dimension)).toEqual(expect.arrayContaining([
      "problem", "audience", "goal", "preference", "feature", "constraint",
    ]));
    expect(session.summary).toContain("joint ses relevés de notes");
    expect(session.summary).not.toContain("Quel besoin concret veux-tu satisfaire");
  });

  it("asks one relevant missing question only after the person confirms the full brief", () => {
    const session = beginUnderstanding(
      "Student Vision : les élèves après le BAC se perdent car ils ne savent pas quel métier faire. Je veux une application qui analyse leurs relevés de notes et leurs aptitudes pour proposer des métiers.",
    );
    const confirmed = decideUnderstandingSummary(session, "confirmed");

    expect(confirmed.stage).toBe("clarification");
    expect(confirmed.pendingQuestion?.dimension).toBe("risk");
    expect(confirmed.messages.at(-1)?.content).toContain("Qui pourra consulter les relevés");
    expect(confirmed.messages.at(-1)?.content).not.toMatch(/et qui|seront-elles informées/);
  });

  it("does not classify a complaint that MerKora failed to understand as the project problem", () => {
    const session = beginUnderstanding("J'ai une idée à développer");
    const repaired = answerUnderstanding(
      session,
      "Avec tout ce que j'ai dit là tu n'as pas encore compris tout ça hein ?",
    );

    expect(repaired.messages.at(-1)?.content).toMatch(/reprends|réexpliquer|corriger/i);
    expect(repaired.evidence.some((item) => item.dimension === "problem" && /pas encore compris/i.test(item.value))).toBe(false);
    expect(repaired.dossier.repairRequested).toBe(true);
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


describe("MerKora multi-facet understanding from free-form messages", () => {
  it("keeps the idea, emotional need, audience and gameplay mechanics as separate evidence", () => {
    const first = beginUnderstanding("J'ai une idée à développer");
    const concept = answerUnderstanding(first, "Je veux créer une interface de jeu pour distraire.");
    const need = answerUnderstanding(
      concept,
      "J'ai remarqué que beaucoup de jeunes se frustrent à cause des études et n'arrivent plus à se détendre. Il n'y a pas de cadre particulier.",
    );
    const mechanics = answerUnderstanding(
      need,
      "Le jeu s'appelle Dare You Catch Me. Le joueur choisit ce qui l'énerve parmi des personnes, animaux, objets ou situations, puis un emoji apparaît. La cible défile, disparaît et réapparaît. Il faut la toucher. Si le joueur rate, la cible grandit et le taquine; s'il réussit, elle lui présente des excuses.",
    );

    expect(mechanics.evidence).toEqual(expect.arrayContaining([
      expect.objectContaining({ dimension: "preference", status: "user_stated" }),
      expect.objectContaining({ dimension: "problem", status: "user_stated" }),
      expect.objectContaining({ dimension: "audience", status: "user_stated" }),
      expect.objectContaining({ dimension: "emotion", status: "user_stated" }),
      expect.objectContaining({ dimension: "feature", status: "user_stated" }),
      expect.objectContaining({ dimension: "experience", status: "user_stated" }),
    ]));
    expect(mechanics.evidence.some((item) => item.dimension === "context" && /aucun cadre/i.test(item.value))).toBe(true);
    expect(mechanics.summary ?? "").not.toContain("emoji apparaît");
    expect(mechanics.summary ?? "").not.toContain("🐶");
  });

  it("does not keep asking about a missing context after the person explicitly says there is none", () => {
    const first = beginUnderstanding("J'ai une idée à développer");
    const concept = answerUnderstanding(first, "Je veux créer une interface de jeu pour distraire.");
    const noContext = answerUnderstanding(concept, "Il n'y a pas de cadre particulier, je veux juste un jeu accessible à tous.");

    expect(noContext.evidence.some((item) => item.dimension === "context" && /aucun cadre/i.test(item.value))).toBe(true);
    expect(noContext.pendingQuestion?.dimension).not.toBe("context");
  });
});
