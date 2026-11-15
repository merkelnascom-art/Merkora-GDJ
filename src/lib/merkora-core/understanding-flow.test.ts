import { describe, expect, it } from "vitest";
import { answerUnderstanding, beginUnderstanding } from "./conversation-engine";

const studentVision = "Student Vision : les élèves après le BAC se perdent et choisissent des filières au hasard car ils ne savent pas quel métier faire. Je veux une application sans connexion obligatoire au départ. L'élève choisit son domaine (scientifique, littéraire ou autre), indique son BAC et sa mention, puis joint ses relevés de notes. Le système analyse les notes, les points forts et faibles, puis prépare une orientation professionnelle probable. Ensuite il propose des tests mentaux, physiques, d'analyse, de réflexion, des devinettes et des jeux. Il synchronise les résultats et propose des catégories de métiers adaptées.";

describe("whole-message understanding flow", () => {
  it("summarizes a complete first message instead of starting a redundant questionnaire", () => {
    const session = beginUnderstanding(studentVision);

    expect(session.stage).toBe("summary_validation");
    expect(session.pendingQuestion).toBeNull();
    expect(session.summary).toContain("Student Vision");
    expect(session.summary).toContain("relevés de notes");
    expect(session.summary).toContain("élèves");
    expect(session.messages.filter((item) => item.role === "merkora")).toHaveLength(1);
  });

  it("uses a long answer to fill the dossier and asks only about sensitive data access", () => {
    const first = beginUnderstanding("J'ai une idée à développer");
    expect(first.stage).toBe("clarification");

    const next = answerUnderstanding(first, studentVision);
    expect(next.stage).toBe("clarification");
    expect(next.dossier.facets.some((item) => item.dimension === "problem")).toBe(true);
    expect(next.dossier.facets.some((item) => item.dimension === "audience")).toBe(true);
    expect(next.dossier.facets.some((item) => item.dimension === "goal")).toBe(true);
    expect(next.dossier.facets.some((item) => item.dimension === "feature")).toBe(true);
    expect(next.pendingQuestion?.dimension).toBe("risk");
    expect(next.pendingQuestion?.prompt).not.toMatch(/quel besoin concret|qui est concerné|quel résultat souhaites-tu/i);
  });

  it("does not confuse an organization setting with a proposed solution", () => {
    const first = beginUnderstanding("Je veux améliorer la gestion de mon centre de formation.");
    expect(first.dossier.facets.map((item) => item.dimension)).not.toContain("preference");
    expect(first.evidence.map((item) => item.dimension)).not.toContain("preference");
  });

  it("repairs understanding by showing what was already captured instead of asking for the whole story again", () => {
    const first = beginUnderstanding("J'ai une idée à développer");
    const detailed = answerUnderstanding(first, studentVision);
    const repaired = answerUnderstanding(detailed, "Avec tout ce que j'ai dit, tu n'as pas encore compris ?");

    expect(repaired.pendingQuestion?.id).toBe("repair-understanding-v1");
    expect(repaired.pendingQuestion?.prompt).toContain("Student Vision");
    expect(repaired.pendingQuestion?.prompt).toContain("relevés de notes");
    expect(repaired.dossier.facets.some((item) => item.dimension === "problem")).toBe(true);
    expect(repaired.dossier.facets.some((item) => item.content.includes("tu n'as pas encore compris"))).toBe(false);
  });
});
