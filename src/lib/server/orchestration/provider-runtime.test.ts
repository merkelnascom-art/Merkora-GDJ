import { describe, expect, it } from "vitest";
import { createConfiguredAgentRuntime } from "./provider-runtime";

describe("configured provider runtime", () => {
  it("registers only providers with a server key and explicit model allowlist", () => {
    const configured = createConfiguredAgentRuntime({
      MERKORA_AGENT_RUNTIME_ENABLED: "true",
      OPENAI_API_KEY: "openai-secret",
      MERKORA_OPENAI_MODEL_BALANCED: "gpt-approved",
      GEMINI_API_KEY: "gemini-secret",
      MERKORA_GEMINI_MODEL_REVIEW: "gemini-approved",
      MERKORA_ANTHROPIC_MODEL_FAST: "claude-model-without-key",
    });
    expect(configured.registeredProviders).toEqual(["gemini", "openai"]);
  });

  it("keeps every provider disabled unless the global runtime switch is explicitly true", () => {
    const configured = createConfiguredAgentRuntime({
      OPENAI_API_KEY: "openai-secret",
      MERKORA_OPENAI_MODEL_BALANCED: "gpt-approved",
      ANTHROPIC_API_KEY: "anthropic-secret",
      MERKORA_ANTHROPIC_MODEL_REVIEW: "claude-approved",
    });
    expect(configured.registeredProviders).toEqual([]);
  });

  it("registers no provider when no server credentials and model allowlists exist", () => {
    const configured = createConfiguredAgentRuntime({
      MERKORA_AGENT_RUNTIME_ENABLED: "true",
      MERKORA_OPENAI_MODEL_BALANCED: "gpt-approved",
      ANTHROPIC_API_KEY: "anthropic-secret",
    });
    expect(configured.registeredProviders).toEqual([]);
  });

  it("does not make provider calls during runtime construction", () => {
    const configured = createConfiguredAgentRuntime({
      MERKORA_AGENT_RUNTIME_ENABLED: "true",
      OPENAI_API_KEY: "openai-secret",
      MERKORA_OPENAI_MODEL_BALANCED: "gpt-approved",
      ANTHROPIC_API_KEY: "anthropic-secret",
      MERKORA_ANTHROPIC_MODEL_REVIEW: "claude-approved",
      GEMINI_API_KEY: "gemini-secret",
      MERKORA_GEMINI_MODEL_FAST: "gemini-approved",
    });
    expect(configured.registeredProviders).toEqual(["anthropic", "gemini", "openai"]);
  });
});
