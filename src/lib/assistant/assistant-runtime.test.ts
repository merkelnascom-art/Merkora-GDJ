import { describe, expect, it } from "vitest";
import { authorizeExternalAssistant, getAssistantRuntimeConfig } from "./assistant-runtime";

describe("MerKora assistant runtime safety", () => {
  it("keeps external providers disabled unless explicitly enabled on the server", () => {
    const config = getAssistantRuntimeConfig({
      MERKORA_AI_ENABLED: "false",
      MERKORA_ASSISTANT_MODEL: "anthropic/claude-sonnet-4",
      AI_GATEWAY_API_KEY: "server-key",
    });
    expect(config.status).toBe("disabled");
    expect(config.provider).toBeNull();
  });

  it("recognizes OpenAI and Anthropic models through the provider-neutral gateway", () => {
    expect(getAssistantRuntimeConfig({
      MERKORA_AI_ENABLED: "true", MERKORA_ASSISTANT_MODEL: "openai/gpt-4o-mini", AI_GATEWAY_API_KEY: "server-key",
    })).toMatchObject({ status: "ready", provider: "openai", model: "openai/gpt-4o-mini" });
    expect(getAssistantRuntimeConfig({
      MERKORA_AI_ENABLED: "true", MERKORA_ASSISTANT_MODEL: "anthropic/claude-sonnet-4", AI_GATEWAY_API_KEY: "server-key",
    })).toMatchObject({ status: "ready", provider: "anthropic" });
  });

  it("fails closed for missing credentials and unsupported provider names", () => {
    expect(getAssistantRuntimeConfig({
      MERKORA_AI_ENABLED: "true", MERKORA_ASSISTANT_MODEL: "anthropic/claude-sonnet-4",
    }).status).toBe("not_configured");
    expect(getAssistantRuntimeConfig({
      MERKORA_AI_ENABLED: "true", MERKORA_ASSISTANT_MODEL: "unknown/model", AI_GATEWAY_API_KEY: "server-key",
    }).status).toBe("not_configured");
  });

  it("requires client consent, an explicit request and admin spend authorization", () => {
    const config = getAssistantRuntimeConfig({
      MERKORA_AI_ENABLED: "true", MERKORA_ASSISTANT_MODEL: "openai/gpt-4o-mini", AI_GATEWAY_API_KEY: "server-key",
    });
    expect(authorizeExternalAssistant(config, {
      explicitUserRequest: true, clientConsent: true, adminSpendAuthorized: false,
    }).allowed).toBe(false);
    expect(authorizeExternalAssistant(config, {
      explicitUserRequest: true, clientConsent: false, adminSpendAuthorized: true,
    }).allowed).toBe(false);
    expect(authorizeExternalAssistant(config, {
      explicitUserRequest: true, clientConsent: true, adminSpendAuthorized: true,
    }).allowed).toBe(true);
  });
});
