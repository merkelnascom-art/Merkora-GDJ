/** Conversation contract used by deterministic project discovery helpers. */
export interface ConversationMessage {
  role: "user" | "assistant" | "system";
  content: string;
}
