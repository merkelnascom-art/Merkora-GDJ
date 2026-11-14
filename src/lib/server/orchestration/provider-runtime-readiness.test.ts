import { describe, expect, it } from "vitest";
import { inspectConfiguredProviderRuntime } from "./provider-runtime-readiness";

describe("configured provider runtime readiness", () => {
  it("keeps the runtime disabled unless the explicit kill switch is true", () => {
    expect(inspectConfiguredProviderRuntime({
      OPENAI_API_KEY: "secret",
      MERKORA_ORGANIZATION_ID: "merkora-org",
      MERKORA_OPENAI_MODEL_FAST: "model-a",
    })).toEqual({
      enabled: false,
      status: "disabled",
      providers: [],
      providerCallsPerformed: false,
      spendingStarted: false,
      projectConnectionCheckRequired: true,
    });
  });

  it("reports missing model or organization binding without exposing credentials", () => {
    const noModel = inspectConfiguredProviderRuntime({
      MERKORA_AGENT_RUNTIME_ENABLED: "true",
      MERKORA_ORGANIZATION_ID: "merkora-org",
      OPENAI_API_KEY: "secret",
    });
    expect(noModel.status).toBe("not_configured");
    expect(noModel.providers).toEqual([]);

    const noOrganization = inspectConfiguredProviderRuntime({
      MERKORA_AGENT_RUNTIME_ENABLED: "true",
      OPENAI_API_KEY: "secret",
      MERKORA_OPENAI_MODEL_FAST: "model-a",
    });
    expect(noOrganization.status).toBe("not_configured");
    expect(noOrganization.providers).toEqual([]);
  });

  it("lists only providers whose model aliases and organization credentials are configured", () => {
    const status = inspectConfiguredProviderRuntime({
      MERKORA_AGENT_RUNTIME_ENABLED: "true",
      MERKORA_ORGANIZATION_ID: "merkora-org",
      OPENAI_API_KEY: "openai-secret",
      MERKORA_OPENAI_MODEL_FAST: "model-a",
      ANTHROPIC_API_KEY: "anthropic-secret",
      MERKORA_ANTHROPIC_MODEL_REVIEW: "model-b",
      GEMINI_API_KEY: "unused-secret",
    });
    expect(status).toEqual({
      enabled: true,
      status: "ready",
      providers: ["anthropic", "openai"],
      providerCallsPerformed: false,
      spendingStarted: false,
      projectConnectionCheckRequired: true,
    });
    expect(JSON.stringify(status)).not.toContain("secret");
    expect(JSON.stringify(status)).not.toContain("model-a");
  });

  it("recognizes a server credential resolver without exposing resolved credentials", () => {
    const status = inspectConfiguredProviderRuntime({
      MERKORA_AGENT_RUNTIME_ENABLED: "true",
      MERKORA_OPENAI_MODEL_FAST: "model-a",
    }, { hasCredentialResolver: true });
    expect(status.status).toBe("ready");
    expect(status.providers).toEqual(["openai"]);
  });
});
