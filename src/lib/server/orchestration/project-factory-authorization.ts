import { callUserData } from "@/lib/server/supabase-rest";

export type FactoryApprovalKind = "client_scope" | "admin_review" | "execution_authorization";
export type FactoryHumanGateId =
  | "client-scope-validation"
  | "administrative-review"
  | "execution-authorization"
  | "quality-acceptance"
  | "production-release-authorization"
  | "delivery-acceptance";

export type ProjectFactoryApprovalState = {
  authorized: boolean;
  hasClientAiConsent: boolean;
  approvedKinds: readonly FactoryApprovalKind[];
  missingApprovals: readonly FactoryApprovalKind[];
};

type ApprovalRow = {
  approval_kind?: unknown;
  decision?: unknown;
  plan_digest?: unknown;
  scope_digest?: unknown;
  ai_processing_consent?: unknown;
};

const REQUIRED_APPROVALS: readonly FactoryApprovalKind[] = [
  "client_scope",
  "admin_review",
  "execution_authorization",
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function isDigest(value: string): boolean {
  return /^[a-f0-9]{64}$/.test(value);
}

/**
 * Evaluates project approvals against the exact immutable plan and scope.
 * Provider output and client-provided approval claims are never accepted here;
 * the caller must supply rows read from the authenticated project data store.
 */
export function evaluateProjectFactoryApprovals(
  rows: readonly unknown[],
  expected: { planDigest: string; scopeDigest: string },
): ProjectFactoryApprovalState {
  if (!isDigest(expected.planDigest) || !isDigest(expected.scopeDigest)) {
    return {
      authorized: false,
      hasClientAiConsent: false,
      approvedKinds: [],
      missingApprovals: [...REQUIRED_APPROVALS],
    };
  }

  const exactApprovedRows = rows.filter((value): value is ApprovalRow =>
    isRecord(value)
    && value.decision === "approved"
    && value.plan_digest === expected.planDigest
    && value.scope_digest === expected.scopeDigest
    && REQUIRED_APPROVALS.includes(value.approval_kind as FactoryApprovalKind),
  );
  const approvedKinds = [...new Set(
    exactApprovedRows.map((row) => row.approval_kind as FactoryApprovalKind),
  )];
  const hasClientAiConsent = exactApprovedRows.some((row) =>
    row.approval_kind === "client_scope" && row.ai_processing_consent === true,
  );
  const missingApprovals = REQUIRED_APPROVALS.filter((kind) => !approvedKinds.includes(kind));

  return {
    authorized: missingApprovals.length === 0 && hasClientAiConsent,
    hasClientAiConsent,
    approvedKinds,
    missingApprovals,
  };
}

/**
 * The current approval table stores only the three pre-fabrication approvals.
 * Quality, production release and delivery acceptance must remain blocked until
 * their dedicated approval records exist; no earlier approval is reused.
 */
export function isProjectFactoryGateApproved(
  state: ProjectFactoryApprovalState,
  gateId: FactoryHumanGateId,
): boolean {
  if (!state.authorized) return false;
  switch (gateId) {
    case "client-scope-validation":
      return state.hasClientAiConsent && state.approvedKinds.includes("client_scope");
    case "administrative-review":
      return state.approvedKinds.includes("admin_review");
    case "execution-authorization":
      return state.approvedKinds.includes("execution_authorization");
    case "quality-acceptance":
    case "production-release-authorization":
    case "delivery-acceptance":
      return false;
  }
}

/** Loads the approvals attached to one exact project plan version. */
export async function loadProjectFactoryApprovalState(input: {
  projectId: string;
  accessToken: string;
  planVersion: number;
  planDigest: string;
  scopeDigest: string;
}): Promise<ProjectFactoryApprovalState> {
  if (!input.projectId.trim() || !input.accessToken.trim()
    || !Number.isSafeInteger(input.planVersion) || input.planVersion < 1) {
    throw new Error("PROJECT_APPROVAL_SCOPE_INVALID");
  }

  const result = await callUserData(
    `project_memory_approvals?select=approval_kind,decision,plan_digest,scope_digest,ai_processing_consent&project_id=eq.${encodeURIComponent(input.projectId)}&plan_version=eq.${input.planVersion}`,
    "GET",
    input.accessToken,
  );
  if (!result.ok) throw new Error("PROJECT_APPROVAL_READ_FAILED");
  const rows = Array.isArray(result.data) ? result.data : [];
  return evaluateProjectFactoryApprovals(rows, {
    planDigest: input.planDigest,
    scopeDigest: input.scopeDigest,
  });
}
