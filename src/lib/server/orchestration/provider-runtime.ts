import { createAnthropicAgentAdapter } from "./anthropic-agent-adapter";
import { createGeminiAgentAdapter } from "./gemini-agent-adapter";
import { createOpenAIAgentAdapter } from "./openai-agent-adapter";
import { createAgentRuntime, type AgentRuntimeAdapter } from "./provider-execution";

export type ProviderRuntimeEnvironment = Readonly<Record<string, string | undefined>>;

const MODEL_ALIASES = ["fast", "balanced", "deep", "review"] as const;

function readModelAllowlist(
  env: ProviderRuntimeEnvironment,
  prefix: "OPENAI" | "ANTHROPIC" | "GEMINI",
): Readonly<Record<string, string>> {
  const models: Record<string, string> = {};
  for (const alias of MODEL_ALIASES) {
    const value = env[`MERKORA_${prefix}_MODEL_${alias.toUpperCase()}`]?.trim();
    if (value) models[alias] = value;
  }
  return models;
}

/**
 * Server composition root for configured model providers.
 *
 * It intentionally registers only providers with both a server-side credential
 * and at least one explicit model allowlist entry. It does not read customer
 * OAuth tokens, accept client model IDs, or initiate any provider request.
 */
export function createConfiguredAgentRuntime(env: ProviderRuntimeEnvironment) {
  const adapters: AgentRuntimeAdapter[] = [];
  if (env.MERKORA_AGENT_RUNTIME_ENABLED !== "true") {
    return { runtime: createAgentRuntime(adapters), registeredProviders: [] as string[] };
  }

  const openAiKey = env.OPENAI_API_KEY?.trim();
  const openAiModels = readModelAllowlist(env, "OPENAI");
  if (openAiKey && Object.keys(openAiModels).length > 0) {
    adapters.push(createOpenAIAgentAdapter({
      getApiKey: () => openAiKey,
      models: openAiModels,
    }));
  }

  const anthropicKey = env.ANTHROPIC_API_KEY?.trim();
  const anthropicModels = readModelAllowlist(env, "ANTHROPIC");
  if (anthropicKey && Object.keys(anthropicModels).length > 0) {
    adapters.push(createAnthropicAgentAdapter({
      getApiKey: () => anthropicKey,
      models: anthropicModels,
    }));
  }

  const geminiKey = env.GEMINI_API_KEY?.trim();
  const geminiModels = readModelAllowlist(env, "GEMINI");
  if (geminiKey && Object.keys(geminiModels).length > 0) {
    adapters.push(createGeminiAgentAdapter({
      getApiKey: () => geminiKey,
      models: geminiModels,
    }));
  }

  return {
    runtime: createAgentRuntime(adapters),
    registeredProviders: adapters.map((adapter) => adapter.providerId).sort(),
  };
}
