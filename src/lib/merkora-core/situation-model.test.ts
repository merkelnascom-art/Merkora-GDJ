import { describe, expect, it } from "vitest";
import type { ConversationMessage } from "./types";
import { buildSituationModel } from "./situation-model";

const messages: ConversationMessage[] = [
  {
    id: "m1",
    conversationId: "c1",
    role: "visitor",
    content: "Je veux organiser une pool party pour mon anniversaire.",
    createdAt: "2026-11-15T08:00:00.000Z",
  },
  {
    id: "m2",
    conversationId: "c1",
    role: "visitor",
    content: "Je vais inviter mes amis et les invités devront confirmer leur présence.",
    createdAt: "2026-11-15T08:01:00.000Z",
  },
  {
    id: "m3",
    conversationId: "c1",
    role: "visitor",
    content: "À l'entrée, je veux vérifier les invitations avec un QR code.",
    createdAt: "2026-11-15T08:02:00.000Z",
  },
];

describe("MerKora situation model", () => {
  it("connects actors, event and process steps across separate messages", () => {
    const model = buildSituationModel(messages);

    const organizer = model.nodes.find((node) => node.kind === "actor" && node.role === "organizer");
    const invitees = model.nodes.find((node) => node.kind === "actor" && node.role === "invitees");
    const event = model.nodes.find((node) => node.kind === "event" && /pool party/i.test(node.label));
    const qrCode = model.nodes.find((node) => node.kind === "object" && /qr code/i.test(node.label));

    expect(organizer).toBeDefined();
    expect(invitees).toBeDefined();
    expect(event).toBeDefined();
    expect(qrCode).toBeDefined();
    expect(model.relations).toEqual(expect.arrayContaining([
      expect.objectContaining({ fromNodeId: organizer?.id, predicate: "organizes", toNodeId: event?.id }),
      expect.objectContaining({ fromNodeId: organizer?.id, predicate: "invites", toNodeId: invitees?.id }),
      expect.objectContaining({ fromNodeId: invitees?.id, predicate: "confirms_attendance", toNodeId: event?.id }),
      expect.objectContaining({ fromNodeId: organizer?.id, predicate: "checks_access_with", toNodeId: qrCode?.id }),
    ]));
  });

  it("preserves the source message and exact quote for every inferred link", () => {
    const model = buildSituationModel(messages);

    for (const relation of model.relations) {
      expect(messages.some((item) =>
        item.id === relation.sourceMessageId && item.content.includes(relation.sourceQuote),
      )).toBe(true);
      expect(relation.status).toBe("user_stated");
    }
  });

  it("does not invent payment, registration or approval steps that were never mentioned", () => {
    const model = buildSituationModel(messages);
    const predicates = model.relations.map((relation) => relation.predicate);

    expect(predicates).not.toContain("pays");
    expect(predicates).not.toContain("registers");
    expect(predicates).not.toContain("approves");
  });

  it("ignores assistant messages when reconstructing what the person actually stated", () => {
    const model = buildSituationModel([
      ...messages,
      {
        id: "a1",
        conversationId: "c1",
        role: "merkora",
        content: "Les invités paieront tous avant l'entrée.",
        createdAt: "2026-11-15T08:03:00.000Z",
      },
    ]);

    expect(model.relations.some((relation) => relation.predicate === "pays")).toBe(false);
  });
});
