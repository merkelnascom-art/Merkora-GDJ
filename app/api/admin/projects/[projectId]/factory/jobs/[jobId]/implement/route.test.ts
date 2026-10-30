import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({ cookies: vi.fn().mockResolvedValue({}) }));
vi.mock("@/lib/server/admin-access", () => ({ getAdminAccess: vi.fn() }));
vi.mock("@/lib/server/supabase-rest", () => ({
  callUserData: vi.fn(), getAccessToken: vi.fn(), getCurrentUser: vi.fn(), isSameOrigin: vi.fn(),
}));
vi.mock("@/lib/ai-provider", () => ({ requestAiGatewayCompletion: vi.fn() }));

import { getAdminAccess } from "@/lib/server/admin-access";
import { callUserData, getAccessToken, getCurrentUser, isSameOrigin } from "@/lib/server/supabase-rest";
import { createProjectMemoryDigest } from "@/lib/factory/project-memory-digest";
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

  it("requires client consent recorded in the exact approved plan", async () => {
    vi.stubEnv("MERKORA_AI_ENABLED", "true");
    vi.stubEnv("MERKORA_CODEGEN_MODEL", "openai/test-model");
    vi.stubEnv("AI_GATEWAY_API_KEY", "test-server-key");
    const payload = {
      includedScope: [{ id: "staff", title: "Personnel", description: "Dossiers employés." }],
      aiImplementationConsent: false,
    };
    const digest = createProjectMemoryDigest(payload);
    vi.mocked(callUserData).mockImplementation(async (path, method) => {
      if (method === "GET" && path.startsWith("project_factory_jobs?select")) return {
        ok: true, status: 200, data: [{
          id: jobId, status: "awaiting_approval", plan_version: 2,
          plan_digest: digest, scope_digest: createProjectMemoryDigest(payload.includedScope),
          approval_ids: ["approval-1", "approval-2", "approval-3"],
          manifest: { fullBusinessLogicImplementationPending: true, sourceManifestPath: "p/j/source.json", sourceDigest: "a".repeat(64) },
        }],
      };
      if (method === "GET" && path.startsWith("project_memory_plan_versions?select")) return {
        ok: true, status: 200, data: [{
          version: 2, payload, payload_digest: digest,
          scope_digest: createProjectMemoryDigest(payload.includedScope),
        }],
      };
      return { ok: true, status: 200, data: [] };
    });
    const response = await POST(request(true), context);
    expect(response.status).toBe(409);
    expect((await response.json()).code).toBe("CLIENT_AI_CONSENT_REQUIRED");
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
