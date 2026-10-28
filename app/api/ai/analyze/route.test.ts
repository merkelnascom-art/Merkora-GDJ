import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/server/supabase-rest", () => ({
  isSameOrigin: (request: Request) => {
    const origin = request.headers.get("origin");
    return Boolean(origin && new URL(origin).origin === new URL(request.url).origin);
  },
}));

import { POST } from "./route";

afterEach(() => {
  delete process.env.MERKORA_AI_ENABLED;
  delete process.env.AI_GATEWAY_API_KEY;
  delete process.env.VERCEL_OIDC_TOKEN;
  vi.unstubAllGlobals();
});

describe("POST /api/ai/analyze cost and origin gates", () => {
  it("does not call any provider when the AI feature flag is disabled", async () => {
    process.env.MERKORA_AI_ENABLED = "false";
    process.env.AI_GATEWAY_API_KEY = "test-only-secret";
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(new Request("https://merkora.test/api/ai/analyze", {
      method: "POST",
      headers: { origin: "https://merkora.test", "content-type": "application/json" },
      body: "{malformed json is never parsed while disabled",
    }));

    expect(response.status).toBe(503);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(await response.json()).toMatchObject({ error: expect.stringMatching(/désactivée/i) });
  });

  it("rejects a cross-origin request before checking credentials or calling a provider", async () => {
    process.env.MERKORA_AI_ENABLED = "true";
    process.env.AI_GATEWAY_API_KEY = "test-only-secret";
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(new Request("https://merkora.test/api/ai/analyze", {
      method: "POST",
      headers: { origin: "https://attacker.test", "content-type": "application/json" },
      body: "{}",
    }));

    expect(response.status).toBe(403);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
