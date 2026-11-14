import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({ cookies: vi.fn().mockResolvedValue({}) }));
vi.mock("@/lib/server/admin-access", () => ({ getAdminAccess: vi.fn() }));
vi.mock("@/lib/server/supabase-rest", () => ({
  callUserData: vi.fn(), getAccessToken: vi.fn(), getCurrentUser: vi.fn(), isSameOrigin: vi.fn(),
}));
vi.mock("@/lib/server/merkora-factory-github", () => ({
  dispatchMerkoraFactoryWorkflow: vi.fn(),
}));

import { getAdminAccess } from "@/lib/server/admin-access";
import { callUserData, getAccessToken, getCurrentUser, isSameOrigin } from "@/lib/server/supabase-rest";
import { dispatchMerkoraFactoryWorkflow } from "@/lib/server/merkora-factory-github";
import { POST } from "./route";

const user = { id: "admin-1", email: "admin@merkora.test", fullName: "Admin" };
const context = { params: Promise.resolve({
  projectId: "MK-PROJECT-001",
  jobId: "b2c3d4e5-f678-4123-8abc-1234567890ab",
}) };
function makeRequest() {
  return new Request("https://merkora.test/api/admin/projects/MK-PROJECT-001/factory/jobs/job-1/dispatch", {
    method: "POST",
    headers: { origin: "https://merkora.test", "content-type": "application/json" },
    body: JSON.stringify({ confirmSandboxCost: true }),
  });
}

beforeEach(() => {
  vi.mocked(isSameOrigin).mockReturnValue(true);
  vi.mocked(getCurrentUser).mockResolvedValue(user);
  vi.mocked(getAccessToken).mockResolvedValue("token");
  vi.mocked(getAdminAccess).mockResolvedValue({ ok: true, user });
  vi.mocked(callUserData).mockResolvedValue({
    ok: true, status: 200,
    data: [{ id: context.params, status: "queued", manifest: {} }],
  });
  vi.mocked(dispatchMerkoraFactoryWorkflow).mockResolvedValue({ ok: true });
});
afterEach(() => vi.clearAllMocks());

describe("POST factory job dispatch", () => {
  it("does not dispatch or incur Sandbox cost for a job carrying a planned specialist workflow", async () => {
    vi.mocked(callUserData).mockResolvedValue({
      ok: true, status: 200,
      data: [{
        id: "job-1", status: "queued",
        manifest: { specialistWorkflow: { executionEnabled: false, status: "prepared" } },
      }],
    });

    const response = await POST(makeRequest(), context);
    expect(response.status).toBe(409);
    expect(await response.json()).toMatchObject({ code: "SPECIALIST_WORKFLOW_NOT_EXECUTABLE" });
    expect(dispatchMerkoraFactoryWorkflow).not.toHaveBeenCalled();
  });

  it("preserves the existing dispatch path for ordinary factory jobs", async () => {
    vi.mocked(callUserData).mockResolvedValue({
      ok: true, status: 200,
      data: [{ id: "job-1", status: "queued", manifest: { kind: "merkora_project_factory_job" } }],
    });

    const response = await POST(makeRequest(), context);
    expect(response.status).toBe(202);
    expect(dispatchMerkoraFactoryWorkflow).toHaveBeenCalledWith("MK-PROJECT-001", context.params.then ? expect.any(String) : expect.any(String));
  });
});
