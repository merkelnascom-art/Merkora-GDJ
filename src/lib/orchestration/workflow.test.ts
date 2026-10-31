import { describe, expect, it } from "vitest";
import { authorizeExternalAction, transitionWorkflow, type ApprovalContext, type WorkflowRecord } from "./workflow";

const active = (stage: WorkflowRecord["stage"]): WorkflowRecord => ({
  projectId: "project-demo",
  stage,
  status: "active",
  version: 0,
});

const safeContext: ApprovalContext = {
  authenticated: true,
  projectOwnerAuthorized: true,
  featureBranchScoped: true,
  explicitApprovalForAction: false,
  productionChecklistPassed: false,
};

describe("transitionWorkflow", () => {
  it("advances the workflow with a version increment", () => {
    expect(transitionWorkflow(active("intake"), "needs_clarified")).toEqual({
      ok: true,
      workflow: { ...active("intake"), stage: "solution_proposal", version: 1 },
    });
  });

  it("rejects skipping required stages", () => {
    expect(transitionWorkflow(active("intake"), "build_started")).toEqual({
      ok: false,
      reason: "invalid_transition",
    });
  });

  it("blocks progress while human review is pending and allows explicit resume", () => {
    const review = transitionWorkflow(active("implementation"), "request_human_review");
    expect(review.ok).toBe(true);
    if (!review.ok) return;
    expect(transitionWorkflow(review.workflow, "tests_passed")).toEqual({
      ok: false,
      reason: "workflow_not_active",
    });
    expect(transitionWorkflow(review.workflow, "resume")).toEqual({
      ok: true,
      workflow: { ...active("implementation"), status: "active", version: 2 },
    });
  });

  it("requires an explicit delivery approval before completing delivery", () => {
    expect(transitionWorkflow(active("delivery_approval"), "delivery_completed")).toEqual({
      ok: false,
      reason: "invalid_transition",
    });
    const approved = transitionWorkflow(active("delivery_approval"), "delivery_approved");
    expect(approved.ok).toBe(true);
    if (!approved.ok) return;
    expect(transitionWorkflow(approved.workflow, "delivery_completed")).toEqual({
      ok: true,
      workflow: { ...active("delivery_approved"), status: "completed", version: 2, stage: "delivered" },
    });
  });

  it("requires a separate transition into the test stage", () => {
    const started = transitionWorkflow(active("implementation"), "tests_started");
    expect(started).toEqual({
      ok: true,
      workflow: { ...active("implementation"), stage: "tests", version: 1 },
    });
  });

  it("rejects malformed records", () => {
    expect(transitionWorkflow({ ...active("intake"), projectId: "  " }, "needs_clarified")).toEqual({
      ok: false,
      reason: "invalid_record",
    });
  });
});

describe("authorizeExternalAction", () => {
  it("allows safe read and isolated tests for an authenticated project owner", () => {
    expect(authorizeExternalAction("read_project", safeContext)).toEqual({ allowed: true });
    expect(authorizeExternalAction("run_isolated_tests", safeContext)).toEqual({ allowed: true });
  });

  it("requires feature-branch scope for code writes", () => {
    expect(authorizeExternalAction("write_feature_branch", safeContext)).toEqual({ allowed: true });
    expect(authorizeExternalAction("write_feature_branch", {
      ...safeContext,
      featureBranchScoped: false,
    })).toEqual({ allowed: false, reason: "feature_branch_scope_required" });
  });

  it("denies preview publication without explicit approval", () => {
    expect(authorizeExternalAction("publish_preview", safeContext)).toEqual({
      allowed: false,
      reason: "preview_approval_and_feature_branch_required",
    });
  });

  it("denies production deployment until approval and checklist are both present", () => {
    expect(authorizeExternalAction("deploy_production", {
      ...safeContext,
      explicitApprovalForAction: true,
      productionChecklistPassed: false,
    })).toEqual({ allowed: false, reason: "production_checklist_required" });
    expect(authorizeExternalAction("deploy_production", {
      ...safeContext,
      explicitApprovalForAction: true,
      productionChecklistPassed: true,
    })).toEqual({ allowed: true });
  });

  it("rejects unauthenticated actors and unauthorized project access", () => {
    expect(authorizeExternalAction("read_project", {
      ...safeContext,
      authenticated: false,
    })).toEqual({ allowed: false, reason: "authentication_required" });
    expect(authorizeExternalAction("read_project", {
      ...safeContext,
      projectOwnerAuthorized: false,
    })).toEqual({ allowed: false, reason: "project_access_denied" });
  });
});
