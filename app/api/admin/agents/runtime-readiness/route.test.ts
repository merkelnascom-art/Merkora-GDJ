import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/server/admin-access", () => ({ getAdminAccess: vi.fn() }));
import { getAdminAccess } from "@/lib/server/admin-access";
import { GET } from "./route";

beforeEach(() => {
  vi.mocked(getAdminAccess).mockResolvedValue({
    ok: true,
    user: { id: "admin-123", email: "admin@merkora.test", fullName: "Admin" },
  });
  vi.stubEnv("MERKORA_AGENT_RUNTIME_ENABLED", "false");
  vi.stubEnv("OPENAI_API_KEY", "never-return-this");
  vi.stubEnv("MERKORA_ORGANIZATION_ID", "merkora-org");
  vi.stubEnv("MERKORA_OPENAI_MODEL_FAST", "private-model-name");
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

describe("GET /api/admin/agents/runtime-readiness", () => {
  it("requires an authorized administrator", async () => {
    vi.mocked(getAdminAccess).mockResolvedValue({ ok: false, reason: "not_allowed" });
    const response = await GET();
    expect(response.status).toBe(403);
  });

  it("returns only safe configuration status and never exposes secrets or model names", async () => {
    const response = await GET();
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body).toEqual({
      enabled: false,
      status: "disabled",
      providers: [],
      providerCallsPerformed: false,
      spendingStarted: false,
      projectConnectionCheckRequired: true,
    });
    expect(JSON.stringify(body)).not.toContain("never-return-this");
    expect(JSON.stringify(body)).not.toContain("private-model-name");
    expect(response.headers.get("cache-control")).toBe("no-store");
  });

  it("reports enabled server-level providers without claiming project readiness", async () => {
    vi.stubEnv("MERKORA_AGENT_RUNTIME_ENABLED", "true");
    const response = await GET();
    const body = await response.json();
    expect(body).toMatchObject({
      enabled: true,
      status: "ready",
      providers: ["openai"],
      providerCallsPerformed: false,
      spendingStarted: false,
      projectConnectionCheckRequired: true,
    });
  });
});
