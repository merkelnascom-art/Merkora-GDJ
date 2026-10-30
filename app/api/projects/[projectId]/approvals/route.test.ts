import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({ cookies: vi.fn().mockResolvedValue({}) }));
vi.mock("@/lib/server/admin-access", () => ({ getAdminAccess: vi.fn() }));
vi.mock("@/lib/server/supabase-rest", () => ({
  callUserData: vi.fn(), getAccessToken: vi.fn(), getCurrentUser: vi.fn(), isSameOrigin: vi.fn(),
}));
import { getAdminAccess } from "@/lib/server/admin-access";
import { callUserData, getAccessToken, getCurrentUser, isSameOrigin } from "@/lib/server/supabase-rest";
import { POST } from "./route";

const user = { id: "user-1", email: "client@example.com", fullName: "Client" };
const plan = { version: 2, payload_digest: "a".repeat(64), scope_digest: "b".repeat(64) };
const requestId = "b2c3d4e5-f678-4123-8abc-1234567890ab";
const context = { params: Promise.resolve({ projectId: "MK-CLIENT-001" }) };
function makeRequest(body: unknown) {
  return new Request("https://merkora.test/api/projects/MK-CLIENT-001/approvals", {
    method: "POST", headers: { origin: "https://merkora.test", "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}
const clientBody = {
  planVersion: 2, approvalKind: "client_scope", decision: "approved",
  comment: "Je confirme ce périmètre.", requestId,
};
beforeEach(() => {
  vi.mocked(isSameOrigin).mockReturnValue(true);
  vi.mocked(getCurrentUser).mockResolvedValue(user);
  vi.mocked(getAccessToken).mockResolvedValue("access-token");
  vi.mocked(getAdminAccess).mockResolvedValue({ ok: false, reason: "not_allowed" });
  vi.mocked(callUserData)
    .mockResolvedValueOnce({ ok: true, status: 200, data: [plan] })
    .mockResolvedValueOnce({ ok: true, status: 201, data: [{ id: "approval-1" }] });
});
afterEach(() => vi.clearAllMocks());

describe("POST /api/projects/[projectId]/approvals", () => {
  it("rejects cross-origin and malformed requests", async () => {
    vi.mocked(isSameOrigin).mockReturnValue(false);
    expect((await POST(makeRequest(clientBody), context)).status).toBe(403);
    vi.mocked(isSameOrigin).mockReturnValue(true);
    expect((await POST(makeRequest({ ...clientBody, requestId: "bad" }), context)).status).toBe(400);
    expect(callUserData).not.toHaveBeenCalled();
  });

  it("lets an authenticated project client approve only the exact stored plan digests", async () => {
    const response = await POST(makeRequest(clientBody), context);
    expect(response.status).toBe(200);
    const insert = vi.mocked(callUserData).mock.calls[1];
    expect(insert[0]).toBe("project_memory_approvals");
    expect(insert[3]).toMatchObject({
      project_id: "MK-CLIENT-001", plan_version: 2,
      plan_digest: plan.payload_digest, scope_digest: plan.scope_digest,
      actor_user_id: user.id, actor_role: "client", approval_kind: "client_scope",
    });
  });

  it("does not allow a client to issue administrative approvals", async () => {
    const response = await POST(makeRequest({ ...clientBody, approvalKind: "execution_authorization" }), context);
    expect(response.status).toBe(403);
    expect(callUserData).not.toHaveBeenCalled();
  });

  it("lets an administrator record admin review and appends an audit event", async () => {
    vi.mocked(getAdminAccess).mockResolvedValue({ ok: true, user: { ...user, email: "merkelnascom@gmail.com" } });
    vi.mocked(callUserData).mockReset()
      .mockResolvedValueOnce({ ok: true, status: 200, data: [plan] })
      .mockResolvedValueOnce({ ok: true, status: 201, data: [{ id: "approval-2" }] })
      .mockResolvedValueOnce({ ok: true, status: 201, data: null });
    const response = await POST(makeRequest({ ...clientBody, approvalKind: "admin_review" }), context);
    expect(response.status).toBe(200);
    expect(vi.mocked(callUserData).mock.calls[1][3]).toMatchObject({ actor_role: "admin", approval_kind: "admin_review" });
    expect(vi.mocked(callUserData).mock.calls[2][0]).toBe("project_memory_events");
  });

  it("does not append an approval when the plan version cannot be read", async () => {
    vi.mocked(callUserData).mockReset().mockResolvedValueOnce({ ok: true, status: 200, data: [] });
    const response = await POST(makeRequest(clientBody), context);
    expect(response.status).toBe(404);
    expect(callUserData).toHaveBeenCalledTimes(1);
  });
});
