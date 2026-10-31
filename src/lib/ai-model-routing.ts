/**
 * Server-side model routing for MerKora's AI Gateway.
 *
 * This module only selects a configured model; it never performs a request and
 * never enables AI by itself. Callers must still enforce MERKORA_AI_ENABLED,
 * consent, budget and authorization checks before calling the provider.
 */
export type AiTask = "conversation" | "analysis" | "architecture" | "code_review";

export type AiModelEnvironment = Readonly<Record<string, string | undefined>>;

const TASK_ENV: Record<AiTask, string> = {
  conversation: "MERKORA_AI_MODEL_CONVERSATION",
  analysis: "MERKORA_AI_MODEL_ANALYSIS",
  architecture: "MERKORA_AI_MODEL_ARCHITECTURE",
  code_review: "MERKORA_AI_MODEL_CODE_REVIEW",
};

/**
 * Model IDs use the AI Gateway's provider/model convention, for example
 * "openai/gpt-..." or "anthropic/claude-...". We intentionally do not hard-code
 * provider names or model IDs, so deployments can use only models they have
 * verified and budgeted for.
 */
export function isValidGatewayModelId(value: string): boolean {
  return /^[a-zA-Z0-9][a-zA-Z0-9._-]*\/[a-zA-Z0-9][a-zA-Z0-9._:-]*$/.test(value);
}

/**
 * Resolve a task-specific model first, then the shared model setting.
 * Returns null when no valid model is configured; callers must not silently
 * pick a paid model or attempt a fallback request.
 */
export function resolveAiModel(
  task: AiTask,
  env: AiModelEnvironment,
): string | null {
  const taskSpecific = env[TASK_ENV[task]]?.trim();
  const shared = env.MERKORA_AI_MODEL?.trim();
  const candidate = taskSpecific || shared;

  if (!candidate || !isValidGatewayModelId(candidate)) return null;
  return candidate;
}
