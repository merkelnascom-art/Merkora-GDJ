import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/ai-provider", () => ({ requestAiGatewayCompletion: vi.fn() }));
import { requestAiGatewayCompletion } from "@/lib/ai-provider";
import { completeWithExternalAssistant } from "./assistant-provider";

const config = {
  status: "ready" as const,
  provider: "anthropic" as const,
  model: "anthropic/claude-sonnet-4",
  credential: "server-key",
};
const allowed = { explicitUserRequest: true, clientConsent: true, adminSpendAuthorized: true };

afterEach(() => vi.clearAllMocks());

describe("external MerKora assistant provider", () => {
  it("does not call a provider unless all three authorizations are true", async () => {
    const result = await completeWithExternalAssistant({
      config,
      authorization: { ...allowed, clientConsent: false },
      message: "Je veux suivre mon personnel",
      history: [],
    });
    expect(result.ok).toBe(false);
    expect(result.reason).toBe("client_consent_required");
    expect(requestAiGatewayCompletion).not.toHaveBeenCalled();
  });

  it("sends a bounded project-scoped prompt to the configured model and parses structured JSON", async () => {
    vi.mocked(requestAiGatewayCompletion).mockResolvedValue(new Response(JSON.stringify({
      choices: [{ message: { content: JSON.stringify({
        assistantMessage: "Commençons par préciser les horaires.",
        status: "needs_clarification",
        clarifyingQuestions: ["Quels sont les horaires ?"],
        extractedNeeds: ["Suivi du personnel"],
        suggestedModules: [],
      }) } }],
    }), { status: 200, headers: { "content-type": "application/json" } }));
    const result = await completeWithExternalAssistant({
      config,
      authorization: allowed,
      message: "Je veux suivre mon personnel",
      history: [{ role: "user", content: "Je gère une boutique." }],
      projectContext: "Boutique, suivi du personnel",
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.reply.assistantMessage).toContain("horaires");
    expect(requestAiGatewayCompletion).toHaveBeenCalledTimes(1);
    expect(vi.mocked(requestAiGatewayCompletion).mock.calls[0][0].model).toBe("anthropic/claude-sonnet-4");
  });

  it("rejects malformed provider JSON instead of trusting it", async () => {
    vi.mocked(requestAiGatewayCompletion).mockResolvedValue(new Response(JSON.stringify({
      choices: [{ message: { content: "{not-json" } }],
    }), { status: 200 }));
    const result = await completeWithExternalAssistant({
      config, authorization: allowed, message: "Je veux suivre mon personnel", history: [],
    });
    expect(result).toEqual({ ok: false, reason: "invalid_provider_response" });
  });
});
