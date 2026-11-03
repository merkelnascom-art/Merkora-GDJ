import { createAnthropicAgentAdapter } from "./anthropic-agent-adapter";
import { createGeminiAgentAdapter } from "./gemini-agent-adapter";
import { createOpenAIAgentAdapter } from "./openai-agent-adapter";
import {
  createAgentRuntime,
  type AgentInvocation,
  type AgentRuntimeAdapter,
} from "./provider-execution";

export type ProviderRuntimeEnvironment = Readonly<Record<string, string | undefined>>;
export type ProviderCredentialResolver = (
  providerId: string,
  connection: AgentInvocation["connection"],
) => string | undefined;

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

function resolveCredential(
  providerId: string,
  connection: AgentInvocation["connection"],
  platformKey: string | undefined,
  organizationId: string | undefined,
  tenantResolver: ProviderCredentialResolver | undefined,
): string | undefined {
  const tenantCredential = tenantResolver?.(providerId, connection)?.trim();
  if (tenantCredential) return tenantCredential;

  // Platform-owned keys must never be used for user/customer-owned connections.
  if (connection.owner.type === "organization"
    && organizationId
    && connection.owner.id === organizationId) {
    return platformKey;
  }
  return undefined;
}

/**
 * Server composition root for configured model providers.
 *
 * A provider is registered only when the global kill switch is enabled, a model
 * alias is configured, and either a tenant credential resolver or an explicitly
 * identified organization credential is available. Customer/user credentials
 * are resolved per connection by server code; platform keys are organization-only.
 */
export function createConfiguredAgentRuntime(
  env: ProviderRuntimeEnvironment,
  options: { resolveCredential?: ProviderCredentialResolver } = {},
) {
  const adapters: AgentRuntimeAdapter[] = [];
  if (env.MERKORA_AGENT_RUNTIME_ENABLED !== "true") {
    return { runtime: createAgentRuntime(adapters), registeredProviders: [] as string[] };
  }

  const organizationId = env.MERKORA_ORGANIZATION_ID?.trim();
  const hasCredentialResolver = typeof options.resolveCredential === "function";

  const openAiKey = env.OPENAI_API_KEY?.trim();
  const openAiModels = readModelAllowlist(env, "OPENAI");
  if (Object.keys(openAiModels).length > 0 && ((openAiKey && organizationId) || hasCredentialResolver)) {
    adapters.push(createOpenAIAgentAdapter({
      getApiKey: (connection) => resolveCredential("openai", connection, openAiKey, organizationId, options.resolveCredential),
      models: openAiModels,
    }));
  }

  const anthropicKey = env.ANTHROPIC_API_KEY?.trim();
  const anthropicModels = readModelAllowlist(env, "ANTHROPIC");
  if (Object.keys(anthropicModels).length > 0 && ((anthropicKey && organizationId) || hasCredentialResolver)) {
    adapters.push(createAnthropicAgentAdapter({
      getApiKey: (connection) => resolveCredential("anthropic", connection, anthropicKey, organizationId, options.resolveCredential),
      models: anthropicModels,
    }));
  }

  const geminiKey = env.GEMINI_API_KEY?.trim();
  const geminiModels = readModelAllowlist(env, "GEMINI");
  if (Object.keys(geminiModels).length > 0 && ((geminiKey && organizationId) || hasCredentialResolver)) {
    adapters.push(createGeminiAgentAdapter({
      getApiKey: (connection) => resolveCredential("gemini", connection, geminiKey, organizationId, options.resolveCredential),
      models: geminiModels,
    }));
  }

  return {
    runtime: createAgentRuntime(adapters),
    registeredProviders: adapters.map((adapter) => adapter.providerId).sort(),
  };
}
