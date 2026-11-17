import { describe, expect, it } from "vitest";
import type { ConversationMessage } from "./types";
import { buildSituationGraph } from "./situation-graph";
import { extractSituationObservations } from "./situation-extractor";

const messages: ConversationMessage[] = [
  {
    id: "m1",
    conversationId: "c1",
    role: "visitor",
    content: "Je veux créer un jeu interactif pour distraire les jeunes.",
    createdAt: "2026-11-15T08:00:00.000Z",
  },
  {
    id: "m2",
    conversationId: "c1",
    role: "visitor",
    content: "Les jeunes sont stressés par les études et n'arrivent plus à se détendre.",
    createdAt: "2026-11-15T08:01:00.000Z",
  },
  {
    id: "a1",
    conversationId: "c1",
    role: "merkora",
    content: "Le jeu devra obligatoirement utiliser un paiement.",
    createdAt: "2026-11-15T08:02:00.000Z",
  },
];

describe("situation language extractor", () => {
  it("extracts a project idea, its audience, intended experience and stated difficulty", () => {
    const graph = buildSituationGraph(extractSituationObservations(messages));

    const initiator = graph.entities.find((entity) => entity.kind === "actor" && entity.role === "initiator");
    const audience = graph.entities.find((entity) => entity.kind === "actor" && entity.role === "audience");
    const activity = graph.entities.find((entity) => entity.kind === "activity");
    const goal = graph.entities.find((entity) => entity.kind === "goal");
    const problem = graph.entities.find((entity) => entity.kind === "problem");

    expect(initiator).toBeDefined();
    expect(audience?.label).toBe("Jeunes");
    expect(activity?.label.toLocaleLowerCase("fr")).toContain("jeu interactif");
    expect(goal?.label.toLocaleLowerCase("fr")).toContain("distraire");
    expect(problem?.label.toLocaleLowerCase("fr")).toContain("stress");
    expect(graph.relations).toEqual(expect.arrayContaining([
      expect.objectContaining({ fromEntityId: initiator?.id, predicate: "imagines", toEntityId: activity?.id }),
      expect.objectContaining({ fromEntityId: activity?.id, predicate: "intended_for", toEntityId: audience?.id }),
      expect.objectContaining({ fromEntityId: activity?.id, predicate: "aims_at", toEntityId: goal?.id }),
      expect.objectContaining({ fromEntityId: audience?.id, predicate: "experiences", toEntityId: problem?.id }),
    ]));
  });

  it("represents an organized tournament as an event, not as an abstract goal", () => {
    const graph = buildSituationGraph(extractSituationObservations([{
      id: "tournament",
      conversationId: "tournament-project",
      role: "visitor",
      content: "Je veux organiser un tournoi de Baby foot. Donc il y aura 9 joueurs.",
      createdAt: "2026-11-17T08:00:00.000Z",
    }]));
    expect(graph.entities.some((entity) => entity.kind === "event" && /tournoi de baby foot/i.test(entity.label))).toBe(true);
    expect(graph.entities.some((entity) => entity.kind === "goal" && /organiser un tournoi/i.test(entity.label))).toBe(false);
    expect(graph.entities.some((entity) => entity.kind === "actor" && entity.label === "Joueurs")).toBe(true);
  });

  it("keeps an imagined interface separate from an event or goal", () => {
    const graph = buildSituationGraph(extractSituationObservations([{
      id: "interface",
      conversationId: "interface-project",
      role: "visitor",
      content: "Je veux organiser une interface façon organigramme.",
      createdAt: "2026-11-17T08:01:00.000Z",
    }]));
    expect(graph.entities.some((entity) => entity.kind === "concept" && /interface façon organigramme/i.test(entity.label))).toBe(true);
    expect(graph.entities.some((entity) => entity.kind === "goal")).toBe(false);
  });

  it("uses visitor messages only and preserves the exact sentence behind each extracted fact", () => {
    const graph = buildSituationGraph(extractSituationObservations(messages));

    expect(graph.entities.some((entity) => /paiement/i.test(entity.label))).toBe(false);
    for (const entity of graph.entities) {
      for (const evidence of entity.evidence) {
        const original = messages.find((message) => message.id === evidence.messageId);
        expect(original?.role).toBe("visitor");
        expect(original?.content).toContain(evidence.quote);
      }
    }
    for (const relation of graph.relations) {
      for (const evidence of relation.evidence) {
        const original = messages.find((message) => message.id === evidence.messageId);
        expect(original?.role).toBe("visitor");
        expect(original?.content).toContain(evidence.quote);
      }
    }
  });

  it("does not invent a goal or an audience when the message only states an activity", () => {
    const graph = buildSituationGraph(extractSituationObservations([
      {
        id: "m3",
        conversationId: "c2",
        role: "visitor",
        content: "Je veux développer un outil numérique.",
        createdAt: "2026-11-15T08:03:00.000Z",
      },
    ]));

    expect(graph.entities.some((entity) => entity.kind === "activity")).toBe(true);
    expect(graph.entities.some((entity) => entity.kind === "goal")).toBe(false);
    expect(graph.entities.some((entity) => entity.role === "audience")).toBe(false);
  });
});
