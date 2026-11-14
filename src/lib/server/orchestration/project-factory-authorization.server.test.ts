import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/server/supabase-rest", () => ({ callUserData: vi.fn() }));

import { callUserData } from "@/lib/server/supabase-rest";
import { loadProjectFactoryApprovalState } from "./project-factory-authorization.server";

const planDigest = "a".repeat(64);
const scopeDigest = "b".repeat(64);

describe("loadProjectFactoryApprovalState", () => {
  beforeEach(() => {
    vi.mocked(callUserData).mockResolvedValue({
      ok: true,
      status: 200,
      data: [
        { approval_kind: "client_scope", decision: "approved", plan_digest: planDigest, scope_digest: scopeDigest, ai_processing_consent: true },
        { approval_kind: "admin_review", decision: "approved", plan_digest: planDigest, scope_digest: scopeDigest },
        { approval_kind: "execution_authorization", decision: "approved", plan_digest: planDigest, scope_digest: scopeDigest },
      ],
    });
  });

  afterEach(() => vi.clearAllMocks());

  it("reads approvals for the exact project and plan version using the authenticated session", async () => {
    const state = await loadProjectFactoryApprovalState({
      projectId: "project-001",
      accessToken: "session-token",
      planVersion: 7,
      planDigest,
      scopeDigest,
    });

    expect(callUserData).toHaveBeenCalledWith(
      expect.stringContaining("project_memory_approvals?"),
      "GET",
      "session-token",
    );
    expect(String(vi.mocked(callUserData).mock.calls[0]?.[0])).toContain("project_id=eq.project-001");
    expect(String(vi.mocked(callUserData).mock.calls[0]?.[0])).toContain("plan_version=eq.7");
    expect(state.authorized).toBe(true);
    expect(state.hasClientAiConsent).toBe(true);
  });

  it("fails closed when the approval service cannot be read", async () => {
    vi.mocked(callUserData).mockResolvedValueOnce({ ok: false, status: 502, data: null });

    await expect(loadProjectFactoryApprovalState({
      projectId: "project-001",
      accessToken: "session-token",
      planVersion: 7,
      planDigest,
      scopeDigest,
    })).rejects.toThrow("PROJECT_APPROVAL_READ_FAILED");
  });

  it("rejects an invalid scope before making a database request", async () => {
    await expect(loadProjectFactoryApprovalState({
      projectId: "",
      accessToken: "session-token",
      planVersion: 7,
      planDigest,
      scopeDigest,
    })).rejects.toThrow("PROJECT_APPROVAL_SCOPE_INVALID");
    expect(callUserData).not.toHaveBeenCalled();
  });
});
