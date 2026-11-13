import type { ConversationReply, SuggestedModule } from "./merkora-conversation";

function recordOf(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function boundedText(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function stringList(value: unknown, maxItems: number, maxLength: number): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.slice(0, maxItems)
    .map((item) => boundedText(item, maxLength))
    .filter(Boolean))];
}

/** Applies Gemini wording only to deterministic MerKora decisions; it cannot add or activate modules. */
export function mergeGeminiConversationReply(
  value: unknown,
  base: ConversationReply,
): ConversationReply | null {
  const item = recordOf(value);
  if (!item) return null;
  const assistantMessage = boundedText(item.assistantMessage, 1600);
  if (!assistantMessage || !Array.isArray(item.clarifyingQuestions) ||
      !Array.isArray(item.extractedNeeds)) return null;

  const enhancements = Array.isArray(item.moduleEnhancements) ? item.moduleEnhancements : [];
  const enhancedModules = base.suggestedModules.map((module): SuggestedModule => {
    const match = enhancements.map(recordOf).find((candidate) => candidate?.id === module.id);
    if (!match) return module;
    return {
      ...module,
      description: boundedText(match.description, 500) || module.description,
      reason: boundedText(match.reason, 350) || module.reason,
    };
  });

  return {
    ...base,
    assistantMessage,
    // The deterministic discovery engine owns the next required question; model suggestions follow it.
    clarifyingQuestions: [...new Set([
      ...base.clarifyingQuestions.map((question) => boundedText(question, 300)).filter(Boolean),
      ...stringList(item.clarifyingQuestions, 7, 300),
    ])].slice(0, 7),
    extractedNeeds: stringList(item.extractedNeeds, 8, 300),
    suggestedModules: enhancedModules,
  };
}
