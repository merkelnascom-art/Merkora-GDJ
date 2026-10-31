import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({ cookies: vi.fn().mockResolvedValue({ getAll: () => [] }) }));
vi.mock("@/lib/server/admin-access", () => ({ getAdminAccess: vi.fn() }));
vi.mock("@/lib/server/supabase-rest", () => ({
  callUserData: vi.fn(), getAccessToken: vi.fn(), getCurrentUser: vi.fn(), isSameOrigin: vi.fn(),
}));
import { getAdminAccess } from "@/lib/server/admin-access";
import { callUserData, getAccessToken, getCurrentUser, isSameOrigin } from "@/lib/server/supabase-rest";
import { GET, POST } from "./route";

const user = { id: "admin-1", email: "merkelnascom@gmail.com", fullName: "Admin" };
const requestId = "c2c3d4e5-f678-4123-8abc-1234567890ab";
const plan = { version: 3, source_brief_version: 2, payload: { requestId, includedScope: [{ id: "attendance" }] }, payload_digest: "a".repeat(64), scope_digest: "b".repeat(64) };
const approvalRows = ["client_scope", "admin_review", "execution_authorization"].map((approval_kind, index) => ({
  id: `approval-${index + 1}`, approval_kind, decision: "approved", plan_digest: plan.payload_digest, scope_digest: plan.scope_digest, request_id: requestId, ai_processing_consent: approval_kind === "client_scope",
}));
const body = { planVersion: 3, correlationId: "b2c3d4e5-f678-4123-8abc-1234567890ab" };
const context = { params: Promise.resolve({ projectId: "MK-PROJECT-001" }) };
function makeRequest(value: unknown = body) {
  return new Request("https://merkora.test/api/admin/projects/MK-PROJECT-001/factory/jobs", {
    method: "POST", headers: { origin: "https://merkora.test", "content-type": "application/json" },
    body: JSON.stringify(value),
  });
}
beforeEach(() => {
  vi.mocked(isSameOrigin).mockReturnValue(true);
  vi.mocked(getAccessToken).mockResolvedValue("token");
  vi.mocked(getAdminAccess).mockResolvedValue({ ok: true, user });
  vi.mocked(callUserData)
    .mockResolvedValueOnce({ ok: true, status: 200, data: [plan] })
    .mockResolvedValueOnce({ ok: true, status: 200, data: approvalRows })
    .mockResolvedValueOnce({ ok: true, status: 200, data: [] })
    .mockResolvedValueOnce({ ok: true, status: 201, data: [{ id: "job-1" }] })
    .mockResolvedValueOnce({ ok: true, status: 201, data: [{ id: "task-1" }, { id: "task-2" }, { id: "task-3" }, { id: "task-4" }, { id: "task-5" }] });
});
afterEach(() => vi.clearAllMocks());

describe("GET /api/admin/projects/[projectId]/factory/jobs", () => {
  it("returns the project's jobs and task records using the authenticated RLS session", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(user);
    vi.mocked(callUserData).mockReset()
      .mockResolvedValueOnce({ ok: true, status: 200, data: [{ id: "job-1", project_id: "MK-PROJECT-001", status: "queued" }] })
      .mockResolvedValueOnce({ ok: true, status: 200, data: [{ id: "task-1", job_id: "job-1", task_key: "prepare_specification", state: "not_started" }] });
    const response = await GET(new Request("https://merkora.test/api/admin/projects/MK-PROJECT-001/factory/jobs"), context);
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      jobs: [{ id: "job-1", status: "queued" }],
      tasks: [{ id: "task-1", job_id: "job-1" }],
    });
    expect(callUserData).toHaveBeenNthCalledWith(1, "project_factory_jobs", "GET", expect.objectContaining({ project_id: "eq.MK-PROJECT-001" }));
    expect(callUserData).toHaveBeenNthCalledWith(2, "project_factory_tasks", "GET", expect.objectContaining({ project_id: "eq.MK-PROJECT-001" }));
  });

  it("does not disclose factory records to unauthenticated visitors", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(null);
    const response = await GET(new Request("https://merkora.test/api/admin/projects/MK-PROJECT-001/factory/jobs"), context);
    expect(response.status).toBe(401);
    expect(callUserData).not.toHaveBeenCalled();
  });
});

describe("POST /api/admin/projects/[projectId]/factory/jobs", () => {
  it("rejects malformed and cross-origin requests before database access", async () => {
    vi.mocked(isSameOrigin).mockReturnValue(false);
    expect((await POST(makeRequest(), context)).status).toBe(403);
    vi.mocked(isSameOrigin).mockReturnValue(true);
    expect((await POST(makeRequest({ planVersion: 0, correlationId: "bad" }), context)).status).toBe(400);
    expect(callUserData).not.toHaveBeenCalled();
  });

  it("requires an administrator", async () => {
    vi.mocked(getAdminAccess).mockResolvedValue({ ok: false, reason: "not_allowed" });
    const response = await POST(makeRequest(), context);
    expect(response.status).toBe(403);
    expect(callUserData).not.toHaveBeenCalled();
  });

  it("blocks job creation until all three exact approvals exist", async () => {
    vi.mocked(callUserData).mockReset()
      .mockResolvedValueOnce({ ok: true, status: 200, data: [plan] })
      .mockResolvedValueOnce({ ok: true, status: 200, data: approvalRows.slice(0, 2) });
    const response = await POST(makeRequest(), context);
    expect(response.status).toBe(409);
    expect((await response.json()).missingApprovals).toEqual(["execution_authorization"]);
    expect(callUserData).toHaveBeenCalledTimes(2);
  });


  it("blocks factory creation when the client did not consent to AI processing", async () => {
    const noConsent = approvalRows.map((row) => row.approval_kind === "client_scope" ? { ...row, ai_processing_consent: false } : row);
    vi.mocked(callUserData).mockReset()
      .mockResolvedValueOnce({ ok: true, status: 200, data: [plan] })
      .mockResolvedValueOnce({ ok: true, status: 200, data: noConsent });
    const response = await POST(makeRequest(), context);
    expect(response.status).toBe(409);
    expect((await response.json()).missingApprovals).toEqual(["client_scope_consent"]);
    expect(callUserData).toHaveBeenCalledTimes(2);
  });

  it("rejects approvals from a different request even when their kind is approved", async () => {
    const stale = approvalRows.map((row) => row.approval_kind === "admin_review" ? { ...row, request_id: "d2c3d4e5-f678-4123-8abc-1234567890ab" } : row);
    vi.mocked(callUserData).mockReset()
      .mockResolvedValueOnce({ ok: true, status: 200, data: [plan] })
      .mockResolvedValueOnce({ ok: true, status: 200, data: stale });
    const response = await POST(makeRequest(), context);
    expect(response.status).toBe(409);
    expect(callUserData).toHaveBeenCalledTimes(2);
  });

  it("creates a queued job and five tasks without starting execution", async () => {
    const response = await POST(makeRequest(), context);
    const result = await response.json();
    expect(response.status).toBe(200);
    expect(result).toMatchObject({ created: true, jobId: "job-1", status: "queued", taskCount: 5, executionStarted: false });
    const calls = vi.mocked(callUserData).mock.calls;
    expect(calls[3][0]).toBe("project_factory_jobs");
    expect(calls[1][2]).toMatchObject({
      request_id: `eq.${requestId}`, plan_digest: `eq.${plan.payload_digest}`, scope_digest: `eq.${plan.scope_digest}`,
    });
    expect(calls[3][3]).toMatchObject({
      plan_version: 3, plan_digest: plan.payload_digest, scope_digest: plan.scope_digest,
      requested_by: user.id, authorized_by: user.id,
      manifest: expect.objectContaining({ sourceApprovalRequestId: requestId }),
    });
    expect(calls[4][0]).toBe("project_factory_tasks");
    const tasksPayload = calls[4][3] as Array<Record<string, unknown>>;
    expect(tasksPayload).toHaveLength(5);
    expect(tasksPayload[1]).toMatchObject({ task_key: "generate_application", dependencies: ["prepare_specification"] });
  });

  it("does not create a second job for an existing correlation id", async () => {
    vi.mocked(callUserData).mockReset()
      .mockResolvedValueOnce({ ok: true, status: 200, data: [plan] })
      .mockResolvedValueOnce({ ok: true, status: 200, data: approvalRows })
      .mockResolvedValueOnce({ ok: true, status: 200, data: [{ id: "job-existing" }] });
    const response = await POST(makeRequest(), context);
    expect(response.status).toBe(409);
    expect(callUserData).toHaveBeenCalledTimes(3);
  });

  it("marks the job blocked when task provisioning is incomplete", async () => {
    vi.mocked(callUserData).mockReset()
      .mockResolvedValueOnce({ ok: true, status: 200, data: [plan] })
      .mockResolvedValueOnce({ ok: true, status: 200, data: approvalRows })
      .mockResolvedValueOnce({ ok: true, status: 200, data: [] })
      .mockResolvedValueOnce({ ok: true, status: 201, data: [{ id: "job-2" }] })
      .mockResolvedValueOnce({ ok: false, status: 500, data: null })
      .mockResolvedValueOnce({ ok: true, status: 200, data: [{ id: "job-2" }] });
    const response = await POST(makeRequest(), context);
    expect(response.status).toBe(502);
    expect((await response.json()).jobId).toBe("job-2");
    expect(callUserData).toHaveBeenLastCalledWith("project_factory_jobs", "PATCH", { id: "eq.job-2" }, expect.objectContaining({ status: "blocked" }));
  });
});
