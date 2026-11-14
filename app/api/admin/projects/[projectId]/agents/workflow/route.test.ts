import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({ cookies: vi.fn().mockResolvedValue({}) }));
vi.mock("@/lib/server/admin-access", () => ({ getAdminAccess: vi.fn() }));
vi.mock("@/lib/server/supabase-rest", () => ({
  callUserData: vi.fn(),
  getAccessToken: vi.fn(),
  isSameOrigin: vi.fn(),
}));

import { getAdminAccess } from "@/lib/server/admin-access";
import { callUserData, getAccessToken, isSameOrigin } from "@/lib/server/supabase-rest";
import { POST } from "./route";

const planSnapshot = {
  version: 4,
  source_brief_version: 3,
  payload_digest: "a".repeat(64),
  scope_digest: "b".repeat(64),
};

function request(body: unknown = {
  workflowId: "factory-check-01",
  agentIds: ["analyste-metier", "architecte-logiciel", "developpeur-backend"],
}) {
  return new Request("https://merkora.test/api/admin/projects/project-001/agents/workflow", {
    method: "POST",
    headers: { origin: "https://merkora.test", "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

const context = { params: Promise.resolve({ projectId: "project-001" }) };

beforeEach(() => {
  vi.mocked(isSameOrigin).mockReturnValue(true);
  vi.mocked(getAdminAccess).mockResolvedValue({
    ok: true,
    user: { id: "admin-123", email: "admin@merkora.test", fullName: "Admin" },
  });
  vi.mocked(getAccessToken).mockResolvedValue("admin-token");
  vi.mocked(callUserData).mockResolvedValue({ ok: true, status: 200, data: [planSnapshot] });
});

afterEach(() => vi.clearAllMocks());

describe("POST /api/admin/projects/[projectId]/agents/workflow", () => {
  it("rejects cross-origin and malformed requests before reading project memory", async () => {
    vi.mocked(isSameOrigin).mockReturnValue(false);
    expect((await POST(request(), context)).status).toBe(403);
    vi.mocked(isSameOrigin).mockReturnValue(true);
    expect((await POST(request({ workflowId: "invalid id", agentIds: [] }), context)).status).toBe(400);
    expect(callUserData).not.toHaveBeenCalled();
  });

  it("requires a server-authorized administrator", async () => {
    vi.mocked(getAdminAccess).mockResolvedValue({ ok: false, reason: "not_allowed" });
    const response = await POST(request(), context);
    expect(response.status).toBe(403);
    expect(callUserData).not.toHaveBeenCalled();
  });

  it("prepares the complete selected workflow from the latest immutable project plan without execution", async () => {
    const response = await POST(request(), context);
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      prepared: true,
      executionStarted: false,
      sourceVersions: { briefVersion: 3, planVersion: 4 },
    });
    expect(body.workflow).toMatchObject({
      projectId: "project-001",
      workflowId: "factory-check-01",
      status: "planned",
      executionEnabled: false,
    });
    expect(body.workflow.phases.find((phase: { id: string }) => phase.id === "fabrication").agentIds)
      .toEqual(["developpeur-backend"]);
    expect(body.workflow.missionPlan.steps.every((step: { execution: string }) => step.execution === "not_started"))
      .toBe(true);
    expect(callUserData).toHaveBeenCalledTimes(1);
    expect(callUserData).toHaveBeenCalledWith(
      expect.stringContaining("project_memory_plan_versions?select=version"),
      "GET",
      "admin-token",
    );
  });

  it("blocks when no valid versioned project plan exists", async () => {
    vi.mocked(callUserData).mockResolvedValue({ ok: true, status: 200, data: [] });
    const response = await POST(request(), context);
    expect(response.status).toBe(409);
    expect((await response.json()).error).toContain("Aucun plan projet versionné");
  });

  it("rejects unknown specialists instead of silently changing the requested team", async () => {
    const response = await POST(request({
      workflowId: "factory-check-02",
      agentIds: ["analyste-metier", "agent-inconnu"],
    }), context);
    expect(response.status).toBe(400);
    expect((await response.json()).error).toContain("Agent inconnu");
  });
});
