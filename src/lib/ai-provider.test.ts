import { afterEach, describe, expect, it, vi } from "vitest";
import { requestAiGatewayCompletion } from "./ai-provider";

afterEach(() => vi.unstubAllGlobals());

describe("requestAiGatewayCompletion", () => {
  it("sends a structured request to the gateway using only the supplied server credential", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ choices: [] }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const response = await requestAiGatewayCompletion({
      apiKey: "test-only-secret",
      model: "provider/test-model",
      messages: [{ role: "user", content: "test dossier" }],
    });

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://ai-gateway.vercel.sh/v1/chat/completions");
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer test-only-secret");
    expect(JSON.parse(String(init.body))).toMatchObject({
      model: "provider/test-model",
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: "test dossier" }],
    });
  });

  it("propagates provider HTTP errors without retrying or making a second request", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("budget exhausted", { status: 402 }));
    vi.stubGlobal("fetch", fetchMock);

    const response = await requestAiGatewayCompletion({
      apiKey: "test-only-secret",
      model: "provider/test-model",
      messages: [{ role: "user", content: "test dossier" }],
    });

    expect(response.status).toBe(402);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
