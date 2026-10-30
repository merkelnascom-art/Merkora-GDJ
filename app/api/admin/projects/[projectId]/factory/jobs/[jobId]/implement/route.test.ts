import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({ cookies: vi.fn().mockResolvedValue({}) }));
vi.mock("@/lib/server/admin-access", () => ({ getAdminAccess: vi.fn() }));
vi.mock("@/lib/server/supabase-rest", () => ({
  getAccessToken: vi.fn(), getCurrentUser: vi.fn(), isSameOrigin: vi.fn(),
}));
vi.mock("@/lib/ai-provider", () => ({ requestAiGatewayCompletion: vi.fn() }));

import { getAdminAccess } from "@/lib/server/admin-access";
import { getAccessToken, getCurrentUser, isSameOrigin } from "@/lib/server/supabase-rest";
import { requestAiGatewayCompletion } from "@/lib/ai-provider";
import { POST } from "./route";

const user = { id: "admin-1", email: "merkelnascom@gmail.com", fullName: "Admin" };
const jobId = "b2c3d4e5-f678-4123-8abc-1234567890ab";
const projectId = "MK-PROJECT-001";
const context = { params: Promise.resolve({ projectId, jobId }) };

function request(confirmAiSpend: boolean) {
  return new Request(`https://merkora.test/api/admin/projects/${projectId}/factory/jobs/${jobId}/implement`, {
    method: "POST",
    headers: { origin: "https://merkora.test", "content-type": "application/json" },
    body: JSON.stringify({ confirmAiSpend }),
  });
}

beforeEach(() => {
  vi.stubEnv("MERKORA_AI_ENABLED", "false");
  vi.stubEnv("MERKORA_CODEGEN_MODEL", "");
  vi.stubEnv("AI_GATEWAY_API_KEY", "");
  vi.stubEnv("VERCEL_OIDC_TOKEN", "");
  vi.mocked(isSameOrigin).mockReturnValue(true);
  vi.mocked(getCurrentUser).mockResolvedValue(user);
  vi.mocked(getAccessToken).mockResolvedValue("token");
  vi.mocked(getAdminAccess).mockResolvedValue({ ok: true, user });
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

describe("POST factory AI implementation", () => {
  it("keeps external AI disabled in zero-expense mode", async () => {
    const response = await POST(request(true), context);
    expect(response.status).toBe(503);
    expect((await response.json()).code).toBe("AI_DISABLED");
    expect(requestAiGatewayCompletion).not.toHaveBeenCalled();
  });

  it("requires explicit confirmation of AI spend", async () => {
    vi.stubEnv("MERKORA_AI_ENABLED", "true");
    const response = await POST(request(false), context);
    expect(response.status).toBe(400);
    expect(requestAiGatewayCompletion).not.toHaveBeenCalled();
  });

  it("requires a configured model and server credential before making a provider call", async () => {
    vi.stubEnv("MERKORA_AI_ENABLED", "true");
    const response = await POST(request(true), context);
    expect(response.status).toBe(503);
    expect((await response.json()).code).toBe("AI_NOT_CONFIGURED");
    expect(requestAiGatewayCompletion).not.toHaveBeenCalled();
  });

  it("rejects non-administrators before considering paid AI execution", async () => {
    vi.stubEnv("MERKORA_AI_ENABLED", "true");
    vi.mocked(getAdminAccess).mockResolvedValue({ ok: false, reason: "not_allowed" });
    const response = await POST(request(true), context);
    expect(response.status).toBe(403);
    expect(requestAiGatewayCompletion).not.toHaveBeenCalled();
  });
});
