import { describe, expect, it } from "vitest";
import {
  createDecisionMemory,
  parseDecisionMemory,
  recordDecisionMemoryTurn,
  serializeDecisionMemory,
} from "./universal-project-decision-memory";

describe("universal project decision memory", () => {
  it("preserves client answers through serialization and recovery", () => {
    const initial = createDecisionMemory("project-123");
    const updated = recordDecisionMemoryTurn(initial, {
      role: "user",
      content: "Oui, je confirme : les deux besoins font partie du même projet.",
    }, {
      role: "assistant",
      content: "Ces besoins font-ils partie d'un même projet ou souhaitez-vous les traiter séparément ?",
    });
    const recovered = parseDecisionMemory(serializeDecisionMemory(updated), "project-123");

    expect(recovered?.clientAnswers).toHaveLength(1);
    expect(recovered?.clientAnswers[0].answer).toContain("même projet");
    expect(recovered?.clientAnswers[0].question).toContain("même projet");
  });

  it("remembers the last discovery question so an answer can be recovered after a restart", () => {
    const initial = createDecisionMemory("project-123");
    const afterAssistant = recordDecisionMemoryTurn(initial, {
      role: "assistant",
      content: "Comment procédez-vous aujourd'hui ?",
    });
    const recovered = parseDecisionMemory(serializeDecisionMemory(afterAssistant), "project-123");
    const afterRestart = recordDecisionMemoryTurn(recovered!, {
      role: "user",
      content: "Je note tout dans un cahier.",
    });

    expect(afterRestart.clientAnswers).toHaveLength(1);
    expect(afterRestart.clientAnswers[0].question).toContain("Comment procédez-vous");
    expect(afterRestart.clientAnswers[0].answer).toContain("cahier");
  });

  it("keeps assistant hypotheses separate from client-confirmed decisions", () => {
    const initial = createDecisionMemory("project-123");
    const updated = recordDecisionMemoryTurn(initial, {
      role: "assistant",
      content: "Votre difficulté pourrait venir d'un manque de suivi. C'est une hypothèse à vérifier.",
    });
    expect(updated.clientAnswers).toHaveLength(0);
    expect(updated.hypotheses).toHaveLength(1);
    expect(updated.hypotheses[0].confirmationRequired).toBe(true);
  });

  it("records an explicit client decision and preserves a later correction as history", () => {
    const initial = createDecisionMemory("project-123");
    const first = recordDecisionMemoryTurn(initial, {
      role: "user",
      content: "Je confirme : je veux traiter les deux besoins dans un seul projet.",
    });
    const corrected = recordDecisionMemoryTurn(first, {
      role: "user",
      content: "Je corrige ma décision : il faut finalement deux projets séparés.",
    });

    expect(corrected.decisions).toHaveLength(2);
    expect(corrected.decisions[0].supersededBy).toBe(corrected.decisions[1].id);
    expect(corrected.decisions[1].supersedes).toBe(corrected.decisions[0].id);
    expect(corrected.decisions[1].status).toBe("confirmed");
  });

  it("does not treat an assistant suggestion or an unanswered question as a client decision", () => {
    const initial = createDecisionMemory("project-123");
    const updated = recordDecisionMemoryTurn(initial, {
      role: "assistant",
      content: "Je propose une solution numérique. Souhaitez-vous la valider ?",
    });
    expect(updated.decisions).toHaveLength(0);
    expect(updated.clientAnswers).toHaveLength(0);
  });

  it("rejects a memory belonging to another project and unsupported versions", () => {
    const initial = createDecisionMemory("project-123");
    const serialized = serializeDecisionMemory(initial);
    expect(parseDecisionMemory(serialized, "project-456")).toBeNull();
    expect(parseDecisionMemory({ ...initial, version: 999 }, "project-123")).toBeNull();
  });
});
