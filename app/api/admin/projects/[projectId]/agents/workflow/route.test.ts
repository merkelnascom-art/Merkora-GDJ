import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({ cookies: vi.fn().mockResolvedValue({}) }));
vi.mock("@/lib/server/admin-access", () => ({ getAdminAccess: vi.fn() }));
vi.mock("@/lib/server/supabase-rest", () => ({
  getAccessToken: vi.fn(),
  isSameOrigin: vi.fn(),
}));
vi.mock("@/lib/server/orchestration/project-factory-context", () => ({
  loadProjectFactoryContext: vi.fn(),
}));

import { getAdminAccess } from "@/lib/server/admin-access";
import { getAccessToken, isSameOrigin } from "@/lib/server/supabase-rest";
import { loadProjectFactoryContext } from "@/lib/server/orchestration/project-factory-context";
import { POST } from "./route";

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
  vi.mocked(loadProjectFactoryContext).mockResolvedValue({
    projectId: "project-001",
    briefVersion: 3,
    planVersion: 4,
    contextReferences: [
      "project-brief-version:3",
      "project-brief-digest:brief-digest",
      "project-plan-version:4",
      "project-plan-digest:plan-digest",
      "project-scope-digest:scope-digest",
    ],
    contextInstructions: ["Contexte client validé.", "Périmètre du plan versionné."],
    recommendedAgentIds: ["analyste-metier", "architecte-logiciel", "developpeur-backend"],
    recommendationReasons: {
      "analyste-metier": ["Compréhension du besoin."],
      "architecte-logiciel": ["Conception du périmètre."],
      "developpeur-backend": ["Réalisation logicielle."],
    },
  });
});

afterEach(() => vi.clearAllMocks());

describe("POST /api/admin/projects/[projectId]/agents/workflow", () => {
  it("rejects cross-origin and malformed requests before reading project memory", async () => {
    vi.mocked(isSameOrigin).mockReturnValue(false);
    expect((await POST(request(), context)).status).toBe(403);
    vi.mocked(isSameOrigin).mockReturnValue(true);
    expect((await POST(request({ workflowId: "invalid id", agentIds: [] }), context)).status).toBe(400);
    expect(loadProjectFactoryContext).not.toHaveBeenCalled();
  });

  it("requires a server-authorized administrator", async () => {
    vi.mocked(getAdminAccess).mockResolvedValue({ ok: false, reason: "not_allowed" });
    const response = await POST(request(), context);
    expect(response.status).toBe(403);
    expect(loadProjectFactoryContext).not.toHaveBeenCalled();
  });

  it("prepares the selected workflow from the verified project snapshot without execution", async () => {
    const response = await POST(request(), context);
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      prepared: true,
      executionStarted: false,
      selectionSource: "explicit",
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
    expect(loadProjectFactoryContext).toHaveBeenCalledWith("project-001", "admin-token");
  });


  it("uses MerKora Core recommendations when the administrator has not selected agents", async () => {
    const response = await POST(request({ workflowId: "factory-core-01", agentIds: [] }), context);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.selectionSource).toBe("core_recommendation");
    expect(body.recommendedAgentIds).toEqual([
      "analyste-metier", "architecte-logiciel", "developpeur-backend",
    ]);
    expect(body.workflow.missionPlan.steps.map((step: { agentId: string }) => step.agentId))
      .toEqual(body.recommendedAgentIds);
  });

  it("blocks when the project has no verified versioned plan", async () => {
    vi.mocked(loadProjectFactoryContext).mockRejectedValue(new Error("PROJECT_PLAN_NOT_FOUND"));
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
