import type { ConversationMessage } from "./assistant/merkora-conversation";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

/** Converts untrusted database rows into bounded, chronological assistant context. */
export function storedConversationRowsToHistory(value: unknown): ConversationMessage[] {
  if (!Array.isArray(value)) return [];

  return value.filter(isRecord).filter((row) =>
    (row.role === "user" || row.role === "assistant") &&
    typeof row.content === "string" && row.content.trim().length > 0,
  ).sort((left, right) => {
    const leftDate = typeof left.created_at === "string" ? left.created_at : "";
    const rightDate = typeof right.created_at === "string" ? right.created_at : "";
    const byDate = leftDate.localeCompare(rightDate);
    if (byDate !== 0) return byDate;

    const leftTurn = typeof left.turn_id === "string" ? left.turn_id : "";
    const rightTurn = typeof right.turn_id === "string" ? right.turn_id : "";
    const byTurn = leftTurn.localeCompare(rightTurn);
    if (byTurn !== 0) return byTurn;

    // A turn always presents the client's message before MerKora's answer.
    return left.role === right.role ? 0 : left.role === "user" ? -1 : 1;
  }).slice(-60).map((row) => ({
    role: row.role as "user" | "assistant",
    content: (row.content as string).slice(0, 5000),
  }));
}
