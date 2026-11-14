/** Minimal shared conversation contract for deterministic discovery helpers. */
export interface ConversationMessage {
  role: "user" | "assistant" | "system";
  content: string;
}
