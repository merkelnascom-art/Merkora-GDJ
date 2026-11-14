import { describe, expect, it } from "vitest";
import { isValidGatewayModelId, resolveAiModel } from "./ai-model-routing";

describe("isValidGatewayModelId", () => {
  it("accepts provider/model identifiers for configured Gateway models", () => {
    expect(isValidGatewayModelId("openai/gpt-example")).toBe(true);
    expect(isValidGatewayModelId("anthropic/claude-example-v2")).toBe(true);
    expect(isValidGatewayModelId("deepseek/deepseek-v4.1-flash")).toBe(true);
  });

  it("rejects malformed identifiers and whitespace", () => {
    for (const value of ["", "gpt-example", "/model", "provider/", "provider/model name", " provider/model", "provider/model "]) {
      expect(isValidGatewayModelId(value)).toBe(false);
    }
  });
});

describe("resolveAiModel", () => {
  it("prefers the model configured for the requested task", () => {
    expect(resolveAiModel("architecture", {
      MERKORA_AI_MODEL: "openai/shared-model",
      MERKORA_AI_MODEL_ARCHITECTURE: "anthropic/architecture-model",
    })).toBe("anthropic/architecture-model");
  });

  it("falls back to the shared configured model when no task model is set", () => {
    expect(resolveAiModel("conversation", {
      MERKORA_AI_MODEL: "openai/shared-model",
      MERKORA_AI_MODEL_CONVERSATION: "   ",
    })).toBe("openai/shared-model");
  });

  it("returns null rather than inventing a model when configuration is missing or invalid", () => {
    expect(resolveAiModel("analysis", {})).toBeNull();
    expect(resolveAiModel("analysis", { MERKORA_AI_MODEL: "not-a-model-id" })).toBeNull();
    expect(resolveAiModel("analysis", {
      MERKORA_AI_MODEL: "openai/shared-model",
      MERKORA_AI_MODEL_ANALYSIS: "invalid",
    })).toBeNull();
  });
});
