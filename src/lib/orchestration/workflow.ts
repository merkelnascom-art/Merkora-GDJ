/**
 * Pure workflow primitives for MerKora's project-orchestration engine.
 *
 * This module does not call providers or perform side effects. Server routes
 * must authenticate the actor and enforce ownership before using these helpers.
 */
export const WORKFLOW_STAGES = [
  "intake",
  "clarification",
  "solution_proposal",
  "visual_concept",
  "client_review",
  "quote_review",
  "approved_for_build",
  "implementation",
  "tests",
  "preview_review",
  "delivery_approval",
  "delivery_approved",
  "delivered",
] as const;

export type WorkflowStage = (typeof WORKFLOW_STAGES)[number];
export type WorkflowStatus = "active" | "blocked" | "needs_human_review" | "completed";

export type WorkflowRecord = {
  projectId: string;
  stage: WorkflowStage;
  status: WorkflowStatus;
  version: number;
};

export type WorkflowAction =
  | "clarification_needed"
  | "needs_clarified"
  | "proposal_prepared"
  | "concept_prepared"
  | "client_approved_concept"
  | "quote_prepared"
  | "client_approved_quote"
  | "build_started"
  | "tests_started"
  | "tests_passed"
  | "tests_failed"
  | "preview_ready"
  | "delivery_approved"
  | "delivery_completed"
  | "blocked"
  | "request_human_review"
  | "resume";

export type WorkflowTransitionResult =
  | { ok: true; workflow: WorkflowRecord }
  | { ok: false; reason: "invalid_transition" | "workflow_not_active" | "invalid_record" };

const NEXT: Partial<Record<WorkflowStage, Partial<Record<WorkflowAction, WorkflowStage>>>> = {
  intake: { clarification_needed: "clarification", needs_clarified: "solution_proposal" },
  clarification: { needs_clarified: "solution_proposal" },
  solution_proposal: { proposal_prepared: "visual_concept" },
  visual_concept: { concept_prepared: "client_review" },
  client_review: { client_approved_concept: "quote_review", concept_prepared: "client_review" },
  quote_review: { quote_prepared: "quote_review", client_approved_quote: "approved_for_build" },
  approved_for_build: { build_started: "implementation" },
  implementation: { tests_started: "tests" },
  tests: { tests_passed: "preview_review", tests_failed: "implementation" },
  preview_review: { preview_ready: "delivery_approval" },
  delivery_approval: { delivery_approved: "delivery_approved" },
  delivery_approved: { delivery_completed: "delivered" },
};

function isValidRecord(record: WorkflowRecord): boolean {
  return Boolean(record.projectId.trim())
    && Number.isInteger(record.version)
    && record.version >= 0
    && WORKFLOW_STAGES.includes(record.stage)
    && ["active", "blocked", "needs_human_review", "completed"].includes(record.status);
}

/**
 * Apply a workflow event without side effects. Persist the returned record only
 * after authorization and optimistic-concurrency checks in the calling route.
 */
export function transitionWorkflow(
  current: WorkflowRecord,
  action: WorkflowAction,
): WorkflowTransitionResult {
  if (!isValidRecord(current)) return { ok: false, reason: "invalid_record" };

  if (action === "blocked") {
    if (current.status === "completed") return { ok: false, reason: "workflow_not_active" };
    return { ok: true, workflow: { ...current, status: "blocked", version: current.version + 1 } };
  }

  if (action === "request_human_review") {
    if (current.status === "completed") return { ok: false, reason: "workflow_not_active" };
    return { ok: true, workflow: { ...current, status: "needs_human_review", version: current.version + 1 } };
  }

  if (action === "resume") {
    if (current.status === "completed" || current.status === "active") {
      return { ok: false, reason: "workflow_not_active" };
    }
    return { ok: true, workflow: { ...current, status: "active", version: current.version + 1 } };
  }

  if (current.status !== "active") return { ok: false, reason: "workflow_not_active" };

  const nextStage = NEXT[current.stage]?.[action];
  if (!nextStage) return { ok: false, reason: "invalid_transition" };

  const nextStatus: WorkflowStatus = nextStage === "delivered" ? "completed" : "active";
  return {
    ok: true,
    workflow: { ...current, stage: nextStage, status: nextStatus, version: current.version + 1 },
  };
}

export type ExternalAction =
  | "read_project"
  | "write_feature_branch"
  | "run_isolated_tests"
  | "publish_preview"
  | "modify_customer_data"
  | "spend_money"
  | "delete_data"
  | "merge_main"
  | "deploy_production";

export type ApprovalContext = {
  authenticated: boolean;
  projectOwnerAuthorized: boolean;
  featureBranchScoped: boolean;
  explicitApprovalForAction: boolean;
  productionChecklistPassed: boolean;
};

/**
 * Conservative policy helper. This only decides whether an action may proceed;
 * the caller must still execute the action and handle provider/API errors.
 */
export function authorizeExternalAction(
  action: ExternalAction,
  context: ApprovalContext,
): { allowed: true } | { allowed: false; reason: string } {
  if (!context.authenticated) return { allowed: false, reason: "authentication_required" };
  if (!context.projectOwnerAuthorized) return { allowed: false, reason: "project_access_denied" };

  if (action === "read_project" || action === "run_isolated_tests") return { allowed: true };

  if (action === "write_feature_branch") {
    return context.featureBranchScoped
      ? { allowed: true }
      : { allowed: false, reason: "feature_branch_scope_required" };
  }

  if (action === "publish_preview") {
    return context.featureBranchScoped && context.explicitApprovalForAction
      ? { allowed: true }
      : { allowed: false, reason: "preview_approval_and_feature_branch_required" };
  }

  if (["modify_customer_data", "spend_money", "delete_data", "merge_main", "deploy_production"].includes(action)) {
    if (!context.explicitApprovalForAction) {
      return { allowed: false, reason: "explicit_approval_required" };
    }
    if (action === "deploy_production" && !context.productionChecklistPassed) {
      return { allowed: false, reason: "production_checklist_required" };
    }
    return { allowed: true };
  }

  return { allowed: false, reason: "action_not_allowed" };
}
