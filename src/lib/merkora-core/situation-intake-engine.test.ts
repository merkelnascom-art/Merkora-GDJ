import { describe, expect, it } from "vitest";
import { answerUnderstanding, beginUnderstanding } from "./situation-intake-engine";

const studentVision = `Ça s'appelle Student Vision.
J'ai remarqué que les élèves après avoir obtenu leur BAC se perdent et entrent dans les filières en désordre. De base ils ne savent pas quel métier faire et s'engagent dans n'importe quoi.
Ce que je veux, c'est une application qui pourrait leur permettre de se situer par proposition de divers métiers. Ceci par des questions et des tests spécifiques.
Ils n'ont pas besoin de se connecter au départ. Ils choisissent le domaine à évaluer : scientifique, littéraire et autres. Ils indiquent leur BAC et leur mention, puis joignent leurs relevés.
Le système analyse les notes, les points forts et faibles, puis estime les spécialisations professionnelles susceptibles de leur correspondre. Ensuite il leur propose des petits tests mentaux, physiques, d'aptitude à réfléchir et analyser, des devinettes, des questions et des jeux. Il synchronise les résultats et propose des catégories de métiers.`;

describe("whole-message situation intake", () => {
  it("extracts a rich first narrative and presents a dossier instead of asking already answered questions", () => {
    const session = beginUnderstanding(studentVision);
    expect(session.stage).toBe("summary_validation");
    expect(session.pendingQuestion).toBeNull();
    expect(session.summary).toContain("Student Vision");
    expect(session.summary).toContain("élèves");
    expect(session.summary).toContain("relevés");
    expect(session.summary).toContain("tests");
    expect(session.evidence.some((item) => item.dimension === "problem")).toBe(true);
    expect(session.evidence.some((item) => item.dimension === "goal")).toBe(true);
    expect(session.evidence.some((item) => item.dimension === "feature")).toBe(true);
    expect(session.evidence.filter((item) => item.dimension === "feature").length).toBeGreaterThan(1);
    expect(session.evidence.some((item) => item.dimension === "resource" && /relevés/i.test(item.value))).toBe(true);
    expect(session.evidence.some((item) => item.dimension === "constraint" && /connecter/i.test(item.value))).toBe(true);
    expect(session.evidence.every((item) => item.sourceMessageId && item.sourceQuote)).toBe(true);
  });

  it("builds source-backed relationships between the idea, its audience, goal and lived problem", () => {
    const session = beginUnderstanding(
      "Je veux créer un jeu interactif pour distraire les jeunes. Les jeunes sont stressés par les études et n'arrivent plus à se détendre."
    );
    const graph = session.situationGraph;
    const kinds = graph.entities.map((entity) => entity.kind);
    expect(kinds).toEqual(expect.arrayContaining(["actor", "activity", "goal", "problem"]));
    expect(graph.relations.map((relation) => relation.predicate)).toEqual(
      expect.arrayContaining(["imagines", "intended_for", "aims_at", "experiences"])
    );
    expect(graph.relations.every((relation) => relation.evidence.length > 0)).toBe(true);
    expect(graph.unresolvedRelations).toEqual([]);
  });

  it("does not let a conversational repair become a graph actor or project fact", () => {
    const first = beginUnderstanding("Je veux créer une application pour les élèves.");
    const repaired = answerUnderstanding(first, "Avec tout ce que j'ai dit, tu n'as pas encore compris.");
    expect(repaired.situationGraph.entities.some((entity) => /Porteur du besoin/.test(entity.label))).toBe(true);
    expect(repaired.situationGraph.entities.some((entity) => /pas encore compris/i.test(entity.label))).toBe(false);
  });

  it("does not classify a bare idea-to-develop as a request to improve something", () => {
    const session = beginUnderstanding("J'ai une idée à développer");
    expect(session.intentKind).toBe("explore");
    expect(session.pendingQuestion?.prompt).not.toMatch(/améliorer en priorité/i);
  });

  it("does not treat a complaint about MerKora as the project's problem statement", () => {
    const first = beginUnderstanding("Je veux créer une application pour les élèves.");
    const response = answerUnderstanding(first, "Avec tout ce que j'ai dit, tu n'as pas encore compris tout ça.");
    expect(response.messages.at(-1)?.content).toMatch(/reprends ton récit complet|reprends l'ensemble/i);
    expect(response.evidence.some((item) => item.dimension === "problem" && /tu n'as pas encore compris/i.test(item.value))).toBe(false);
  });

  it("retains multiple actors, workflow details and constraints from one booking narrative", () => {
    const session = beginUnderstanding(
      "Je veux une plateforme de réservation pour une clinique. Les patients choisissent un créneau et envoient une demande. Le secrétariat vérifie les disponibilités puis confirme le rendez-vous. Il ne faut pas demander de paiement en ligne."
    );
    expect(session.evidence.some((item) => item.dimension === "audience" && /patients/i.test(item.value))).toBe(true);
    expect(session.evidence.some((item) => item.dimension === "actor" && /secrétariat/i.test(item.value))).toBe(true);
    expect(session.evidence.filter((item) => item.dimension === "feature").length).toBeGreaterThan(1);
    expect(session.evidence.some((item) => item.dimension === "constraint" && /pas.*paiement en ligne/i.test(item.value))).toBe(true);
  });
  it("attaches universal knowledge type references to the situation graph used by the understanding session", () => {
    const session = beginUnderstanding("Je veux créer un jeu interactif pour les jeunes.");
    const activity = session.situationGraph.entities.find((entity) => entity.kind === "activity");
    const actor = session.situationGraph.entities.find((entity) => entity.kind === "actor");

    expect(activity?.knowledge?.typeConceptId).toBe("core:activity");
    expect(actor?.knowledge?.typeConceptId).toBe("core:actor");
  });
});
