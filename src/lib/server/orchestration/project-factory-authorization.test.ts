import { describe, expect, it } from "vitest";
import {
  evaluateProjectFactoryApprovals,
  isProjectFactoryGateApproved,
} from "./project-factory-authorization";

const planDigest = "a".repeat(64);
const scopeDigest = "b".repeat(64);

function approvals(overrides: Record<string, unknown> = {}) {
  const base = {
    decision: "approved",
    plan_digest: planDigest,
    scope_digest: scopeDigest,
    ai_processing_consent: false,
  };
  return [
    { ...base, approval_kind: "client_scope", ai_processing_consent: true, ...overrides },
    { ...base, approval_kind: "admin_review" },
    { ...base, approval_kind: "execution_authorization" },
  ];
}

describe("project-backed multi-agent approval policy", () => {
  it("authorizes only the three approvals bound to the exact plan and scope digests", () => {
    const state = evaluateProjectFactoryApprovals(approvals(), { planDigest, scopeDigest });

    expect(state.authorized).toBe(true);
    expect(state.hasClientAiConsent).toBe(true);
    expect(state.missingApprovals).toEqual([]);
    expect(isProjectFactoryGateApproved(state, "client-scope-validation")).toBe(true);
    expect(isProjectFactoryGateApproved(state, "administrative-review")).toBe(true);
    expect(isProjectFactoryGateApproved(state, "execution-authorization")).toBe(true);
  });

  it("rejects stale, changed or unapproved approval rows", () => {
    const rows = approvals().map((row, index) => index === 1
      ? { ...row, plan_digest: "c".repeat(64) }
      : row);
    const state = evaluateProjectFactoryApprovals(rows, { planDigest, scopeDigest });

    expect(state.authorized).toBe(false);
    expect(state.missingApprovals).toContain("admin_review");
    expect(isProjectFactoryGateApproved(state, "administrative-review")).toBe(false);
  });

  it("requires explicit client AI-processing consent even when the client scope is approved", () => {
    const rows = approvals().map((row) => row.approval_kind === "client_scope"
      ? { ...row, ai_processing_consent: false }
      : row);
    const state = evaluateProjectFactoryApprovals(rows, { planDigest, scopeDigest });

    expect(state.authorized).toBe(false);
    expect(state.hasClientAiConsent).toBe(false);
    expect(isProjectFactoryGateApproved(state, "client-scope-validation")).toBe(false);
  });

  it("does not invent quality, release or delivery approvals that the current approval service cannot store", () => {
    const state = evaluateProjectFactoryApprovals(approvals(), { planDigest, scopeDigest });

    expect(isProjectFactoryGateApproved(state, "quality-acceptance")).toBe(false);
    expect(isProjectFactoryGateApproved(state, "production-release-authorization")).toBe(false);
    expect(isProjectFactoryGateApproved(state, "delivery-acceptance")).toBe(false);
  });
});
