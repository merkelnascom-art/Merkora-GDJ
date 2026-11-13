import { describe, expect, it } from "vitest";
import { storedConversationRowsToHistory } from "./project-conversation-history";

describe("stored project conversation history", () => {
  it("restores user then assistant turns in chronological order", () => {
    const history = storedConversationRowsToHistory([
      { id: "a2", turn_id: "turn-2", role: "assistant", content: "Réponse 2", created_at: "2026-11-13T10:00:02Z" },
      { id: "u2", turn_id: "turn-2", role: "user", content: "Question 2", created_at: "2026-11-13T10:00:02Z" },
      { id: "a1", turn_id: "turn-1", role: "assistant", content: "Réponse 1", created_at: "2026-11-13T10:00:01Z" },
      { id: "u1", turn_id: "turn-1", role: "user", content: "Question 1", created_at: "2026-11-13T10:00:01Z" },
    ]);

    expect(history).toEqual([
      { role: "user", content: "Question 1" },
      { role: "assistant", content: "Réponse 1" },
      { role: "user", content: "Question 2" },
      { role: "assistant", content: "Réponse 2" },
    ]);
  });

  it("ignores malformed rows and keeps only the most recent 60 messages", () => {
    const rows = Array.from({ length: 65 }, (_, index) => ({
      id: String(index),
      turn_id: String(index),
      role: index % 2 ? "assistant" : "user",
      content: `Message ${index}`,
      created_at: new Date(2026, 10, 13, 10, 0, index).toISOString(),
    }));
    rows.push({ id: "bad", turn_id: "bad", role: "system", content: "ignore", created_at: "2026-11-13T11:00:00Z" });

    const history = storedConversationRowsToHistory(rows);

    expect(history).toHaveLength(60);
    expect(history[0].content).toBe("Message 5");
    expect(history.at(-1)?.content).toBe("Message 64");
  });

  it("rejects empty and non-text content", () => {
    expect(storedConversationRowsToHistory([
      { role: "user", content: " " },
      { role: "assistant", content: 42 },
    ])).toEqual([]);
  });
});
