import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({ cookies: vi.fn().mockResolvedValue({}) }));
vi.mock("@/lib/server/admin-access", () => ({ getAdminAccess: vi.fn() }));
vi.mock("@/lib/server/supabase-rest", () => ({
  callUserData: vi.fn(), getAccessToken: vi.fn(), isSameOrigin: vi.fn(),
}));

import { getAdminAccess } from "@/lib/server/admin-access";
import { callUserData, getAccessToken, isSameOrigin } from "@/lib/server/supabase-rest";
import { POST } from "./route";

const admin = { id: "admin-123", email: "merkelnascom@gmail.com", fullName: "Admin" };
const project = {
  id: "MK-ADMIN-001", user_id: "client-123", title: "Gestion d'équipe",
  category: "organization", problem: "Je manque de visibilité sur mon équipe et ses activités.",
  desired_outcome: "Suivre les présences et les responsabilités.", budget: "À définir", urgency: "normal",
};
const requestId = "d1c2d3e4-f567-4890-8abc-1234567890ab";
const sourceRequest = {
  id: requestId, user_id: project.user_id, project_id: project.id,
  payload: {
    project: {
      id: project.id, title: project.title, category: project.category,
      problem: project.problem, desiredOutcome: project.desired_outcome,
      budget: project.budget, urgency: project.urgency,
      recommendations: [{ title: "Présences", description: "Suivre les arrivées." }],
    },
    studio: { selectedRecommendationIds: ["presences"] },
  },
};
const officialLaunch = {
  id: "launch-1", request_id: requestId, client_user_id: project.user_id,
  quote_version_id: "quote-version-1", invoice_id: "invoice-1",
};
const payload = {
  plannerVersion: "1.0.0",
  requestId,
  approvedScope: [],
  confirmedConstraints: [],
};
function request(body: unknown = payload, origin = "https://merkora.test") {
  return new Request("https://merkora.test/api/admin/projects/MK-ADMIN-001/plan/versions", {
    method: "POST", headers: { origin, "content-type": "application/json" }, body: JSON.stringify(body),
  });
}
const context = { params: Promise.resolve({ projectId: "MK-ADMIN-001" }) };

beforeEach(() => {
  vi.mocked(isSameOrigin).mockReturnValue(true);
  vi.mocked(getAdminAccess).mockResolvedValue({ ok: true, user: admin });
  vi.mocked(getAccessToken).mockResolvedValue("admin-token");
  vi.mocked(callUserData)
    .mockResolvedValueOnce({ ok: true, status: 200, data: [sourceRequest] })
    .mockResolvedValueOnce({ ok: true, status: 200, data: [officialLaunch] })
    .mockResolvedValueOnce({ ok: true, status: 200, data: [] })
    .mockResolvedValueOnce({ ok: true, status: 201, data: [{ version: 1 }] })
    .mockResolvedValueOnce({ ok: true, status: 200, data: [] })
    .mockResolvedValueOnce({ ok: true, status: 201, data: [{ version: 1 }] })
    .mockResolvedValueOnce({ ok: true, status: 201, data: null });
});
afterEach(() => vi.clearAllMocks());

describe("POST /api/admin/projects/[projectId]/plan/versions", () => {
  it("rejects cross-origin and invalid payloads before accessing project data", async () => {
    vi.mocked(isSameOrigin).mockReturnValue(false);
    expect((await POST(request(), context)).status).toBe(403);
    vi.mocked(isSameOrigin).mockReturnValue(true);
    expect((await POST(request({ plannerVersion: "", requestId }), context)).status).toBe(400);
    expect(callUserData).not.toHaveBeenCalled();
  });

  it("requires the server-verified administrator role", async () => {
    vi.mocked(getAdminAccess).mockResolvedValue({ ok: false, reason: "not_allowed" });
    const response = await POST(request(), context);
    expect(response.status).toBe(403);
    expect(callUserData).not.toHaveBeenCalled();
  });

  it("requires an official launch linked to the exact client request", async () => {
    vi.mocked(callUserData).mockReset()
      .mockResolvedValueOnce({ ok: true, status: 200, data: [sourceRequest] })
      .mockResolvedValueOnce({ ok: true, status: 200, data: [] });
    const response = await POST(request(), context);
    expect(response.status).toBe(409);
    expect(callUserData).toHaveBeenCalledTimes(2);
  });

  it("persists immutable brief and plan snapshots using only modules selected in the client Studio", async () => {
    const response = await POST(request(), context);
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body).toMatchObject({ saved: true, briefVersion: 1, planVersion: 1, executionStarted: false });
    expect(body.plan.includedScope).toEqual([
      { id: "presences", title: "Présences", description: "Suivre les arrivées.", source: "selected_option" },
    ]);
    const calls = vi.mocked(callUserData).mock.calls;
    expect(calls[0][0]).toContain("client_requests?");
    expect(calls[1][0]).toContain("client_project_launches?");
    expect(calls[3][0]).toBe("project_memory_brief_versions");
    expect(calls[3][3]).toMatchObject({ project_id: project.id, version: 1, created_by: admin.id });
    expect(calls[5][0]).toBe("project_memory_plan_versions");
    expect(calls[5][3]).toMatchObject({
      project_id: project.id, version: 1, source_brief_version: 1,
      created_by: admin.id, payload_digest: body.planDigest, scope_digest: body.scopeDigest,
    });
    expect(calls[6][0]).toBe("project_memory_events");
    expect(calls[6][3]).toMatchObject({ actor_user_id: admin.id, actor_role: "admin", plan_version: 1 });
  });

  it("does not create a plan when the brief snapshot insert fails", async () => {
    vi.mocked(callUserData).mockReset()
      .mockResolvedValueOnce({ ok: true, status: 200, data: [sourceRequest] })
      .mockResolvedValueOnce({ ok: true, status: 200, data: [officialLaunch] })
      .mockResolvedValueOnce({ ok: true, status: 200, data: [] })
      .mockResolvedValueOnce({ ok: false, status: 403, data: null });
    const response = await POST(request(), context);
    expect(response.status).toBe(502);
    expect(callUserData).toHaveBeenCalledTimes(4);
  });

  it("reports a partial save if the plan insert fails and never starts execution", async () => {
    vi.mocked(callUserData).mockReset()
      .mockResolvedValueOnce({ ok: true, status: 200, data: [sourceRequest] })
      .mockResolvedValueOnce({ ok: true, status: 200, data: [officialLaunch] })
      .mockResolvedValueOnce({ ok: true, status: 200, data: [] })
      .mockResolvedValueOnce({ ok: true, status: 201, data: [{ version: 1 }] })
      .mockResolvedValueOnce({ ok: true, status: 200, data: [] })
      .mockResolvedValueOnce({ ok: false, status: 409, data: null });
    const response = await POST(request(), context);
    expect(response.status).toBe(409);
    expect(callUserData).toHaveBeenCalledTimes(6);
  });
});
