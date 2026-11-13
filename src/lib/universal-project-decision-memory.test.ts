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
      content: "Je confirme mon choix : je veux traiter les deux besoins dans un seul projet.",
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

  it("marks an explicitly revised preference as superseding the previous confirmed decision", () => {
    const initial = createDecisionMemory("project-123");
    const first = recordDecisionMemoryTurn(initial, {
      role: "user",
      content: "Je choisis finalement une application web.",
    });
    const revised = recordDecisionMemoryTurn(first, {
      role: "user",
      content: "Finalement, je préfère une application mobile à la place.",
    });

    expect(revised.decisions).toHaveLength(2);
    expect(revised.decisions[0].status).toBe("superseded");
    expect(revised.decisions[0].supersededBy).toBe(revised.decisions[1].id);
    expect(revised.decisions[1].status).toBe("confirmed");
    expect(revised.decisions[1].supersedes).toBe(revised.decisions[0].id);
  });

  it("does not supersede an unrelated decision when the client corrects another topic", () => {
    const initial = createDecisionMemory("project-123");
    const platformChoice = recordDecisionMemoryTurn(initial, {
      role: "user",
      content: "Je choisis une application web pour mon projet.",
    });
    const budgetChoice = recordDecisionMemoryTurn(platformChoice, {
      role: "user",
      content: "Je change d'avis : mon budget maximal est de 100 000 FCFA.",
    });

    expect(budgetChoice.decisions).toHaveLength(2);
    expect(budgetChoice.decisions[0].status).toBe("confirmed");
    expect(budgetChoice.decisions[0].supersededBy).toBeUndefined();
    expect(budgetChoice.decisions[1].status).toBe("confirmed");
    expect(budgetChoice.decisions[1].supersedes).toBeUndefined();
  });

  it("treats a short yes or no as a decision only when the prior question asks for a choice", () => {
    const initial = createDecisionMemory("project-123");
    const yes = recordDecisionMemoryTurn(initial, {
      role: "user",
      content: "Oui",
    }, {
      role: "assistant",
      content: "Ces deux besoins doivent-ils être regroupés dans un même projet ?",
    });
    expect(yes.decisions).toHaveLength(1);
    expect(yes.decisions[0].statement).toBe("Oui");

    const unrelated = recordDecisionMemoryTurn(initial, {
      role: "user",
      content: "Oui",
    }, {
      role: "assistant",
      content: "Avez-vous déjà un ordinateur ?",
    });
    expect(unrelated.decisions).toHaveLength(0);
  });

  it("persists a short scope confirmation with the correct decision type", async () => {
    const { buildProjectMemoryDecisionInserts } = await import("./universal-project-decision-memory");
    const initial = createDecisionMemory("project-123");
    const answered = recordDecisionMemoryTurn(initial, {
      role: "user",
      content: "Oui",
    }, {
      role: "assistant",
      content: "Ces deux besoins doivent-ils être regroupés dans un même projet ?",
    });
    const rows = buildProjectMemoryDecisionInserts(answered, initial, "project-123", "user-1");
    expect(rows.map((row) => row.decision_type)).toEqual(["clarification_answered", "scope_confirmed"]);
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

  it("rebuilds answers and decisions from the existing append-only project decision ledger", async () => {
    const { hydrateDecisionMemory, projectMemoryRowsToConversationHistory } = await import("./universal-project-decision-memory");
    const rows = [
      {
        id: "row-answer",
        decision_type: "clarification_answered",
        decision: "Je note les retards dans un cahier.",
        comment: "Comment suivez-vous les retards ?",
        actor_role: "client",
        created_at: "2026-11-13T09:00:00.000Z",
      },
      {
        id: "row-decision",
        decision_type: "scope_confirmed",
        decision: "Je confirme mon choix : un seul projet.",
        comment: "",
        actor_role: "client",
        created_at: "2026-11-13T09:01:00.000Z",
      },
      {
        id: "row-assistant",
        decision_type: "other",
        decision: "Ne pas importer",
        comment: "",
        actor_role: "admin",
        created_at: "2026-11-13T09:02:00.000Z",
      },
    ];
    const recovered = hydrateDecisionMemory("project-123", rows);
    const history = projectMemoryRowsToConversationHistory(rows);
    expect(recovered.clientAnswers).toHaveLength(1);
    expect(recovered.decisions).toHaveLength(1);
    expect(recovered.decisions[0].status).toBe("confirmed");
    expect(history).toEqual([
      { role: "assistant", content: "Comment suivez-vous les retards ?" },
      { role: "user", content: "Je note les retards dans un cahier." },
      { role: "user", content: "Je confirme mon choix : un seul projet." },
    ]);
  });

  it("creates inserts compatible with the existing client decision RLS policy", async () => {
    const { buildProjectMemoryDecisionInserts } = await import("./universal-project-decision-memory");
    const initial = createDecisionMemory("project-123");
    const answered = recordDecisionMemoryTurn(initial, {
      role: "user",
      content: "Je tiens un cahier.",
    });
    const rows = buildProjectMemoryDecisionInserts(answered, initial, "project-123", "user-1");
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      project_id: "project-123",
      decision_type: "clarification_answered",
      decision: "Je tiens un cahier.",
      comment: "",
      actor_user_id: "user-1",
      actor_role: "client",
    });
  });

  it("does not persist assistant hypotheses as client decisions", async () => {
    const { buildProjectMemoryDecisionInserts } = await import("./universal-project-decision-memory");
    const initial = createDecisionMemory("project-123");
    const suggested = recordDecisionMemoryTurn(initial, {
      role: "assistant",
      content: "Votre difficulté pourrait venir d'un manque de suivi, hypothèse à vérifier.",
    });
    expect(suggested.hypotheses).toHaveLength(1);
    expect(buildProjectMemoryDecisionInserts(suggested, initial, "project-123", "user-1")).toEqual([]);
  });

  it("reconstructs superseded decisions from correction rows", async () => {
    const { hydrateDecisionMemory } = await import("./universal-project-decision-memory");
    const recovered = hydrateDecisionMemory("project-123", [
      {
        id: "decision-1", decision_type: "scope_confirmed",
        decision: "Je confirme mon choix : un seul projet.",
        actor_role: "client", created_at: "2026-11-13T09:00:00Z",
      },
      {
        id: "decision-2", decision_type: "change_requested",
        decision: "Je change d'avis : deux projets séparés.",
        actor_role: "client", created_at: "2026-11-13T09:05:00Z",
      },
    ]);
    expect(recovered.decisions[0].status).toBe("superseded");
    expect(recovered.decisions[0].supersededBy).toBe("decision-2");
    expect(recovered.decisions[1].status).toBe("confirmed");
    expect(recovered.decisions[1].supersedes).toBe("decision-1");
  });

  it("rejects a memory belonging to another project and unsupported versions", () => {
    const initial = createDecisionMemory("project-123");
    const serialized = serializeDecisionMemory(initial);
    expect(parseDecisionMemory(serialized, "project-456")).toBeNull();
    expect(parseDecisionMemory({ ...initial, version: 999 }, "project-123")).toBeNull();
  });

  it("restores the last clarification question from the persisted answer ledger", async () => {
    const { hydrateDecisionMemory } = await import("./universal-project-decision-memory");
    const recovered = hydrateDecisionMemory("project-123", [{
      id: "answer-1",
      decision_type: "clarification_answered",
      decision: "Je note tout dans un cahier.",
      comment: "Comment procédez-vous aujourd'hui ?",
      actor_role: "client",
      created_at: "2026-11-13T09:00:00.000Z",
    }]);

    expect(recovered.lastAssistantQuestion).toBe("Comment procédez-vous aujourd'hui ?");
    const resumed = recordDecisionMemoryTurn(recovered, {
      role: "user",
      content: "Je veux aussi recevoir un rapport chaque dimanche.",
    });

    expect(resumed.clientAnswers.at(-1)?.question).toBe("Comment procédez-vous aujourd'hui ?");
  });


  it("merges ledger answers missing from conversation storage without duplicating turns", async () => {
    const { mergeProjectConversationHistory } = await import("./universal-project-decision-memory");
    const history = mergeProjectConversationHistory([
      { role: "user", content: "Je veux recevoir un rapport chaque dimanche.", created_at: "2026-11-13T09:02:00.000Z" },
      { role: "assistant", content: "Quel format de rapport préférez-vous ?", created_at: "2026-11-13T09:03:00.000Z" },
    ], [
      {
        id: "answer-1",
        decision_type: "clarification_answered",
        decision: "Je note les contributions dans un cahier.",
        comment: "Comment procédez-vous aujourd'hui ?",
        actor_role: "client",
        created_at: "2026-11-13T09:01:00.000Z",
      },
    ]);

    expect(history).toEqual([
      { role: "assistant", content: "Comment procédez-vous aujourd'hui ?" },
      { role: "user", content: "Je note les contributions dans un cahier." },
      { role: "user", content: "Je veux recevoir un rapport chaque dimanche." },
      { role: "assistant", content: "Quel format de rapport préférez-vous ?" },
    ]);
  });

  it("does not duplicate a clarification pair already present in conversation storage", async () => {
    const { mergeProjectConversationHistory } = await import("./universal-project-decision-memory");
    const rows = [{
      decision_type: "clarification_answered",
      decision: "Je note tout dans un cahier.",
      comment: "Comment procédez-vous aujourd'hui ?",
      actor_role: "client",
      created_at: "2026-11-13T09:00:00.000Z",
    }];
    const history = mergeProjectConversationHistory([
      { role: "assistant", content: "Comment procédez-vous aujourd'hui ?", created_at: "2026-11-13T08:59:00.000Z" },
      { role: "user", content: "Je note tout dans un cahier.", created_at: "2026-11-13T09:00:00.000Z" },
    ], rows);

    expect(history).toEqual([
      { role: "assistant", content: "Comment procédez-vous aujourd'hui ?" },
      { role: "user", content: "Je note tout dans un cahier." },
    ]);
  });

});
