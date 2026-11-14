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

export function evaluateProjectFactoryApprovals(
  _rows: readonly unknown[],
  _expected: { planDigest: string; scopeDigest: string },
): ProjectFactoryApprovalState {
  return {
    authorized: false,
    hasClientAiConsent: false,
    approvedKinds: [],
    missingApprovals: ["client_scope", "admin_review", "execution_authorization"],
  };
}

export function isProjectFactoryGateApproved(
  _state: ProjectFactoryApprovalState,
  _gateId: FactoryHumanGateId,
): boolean {
  return false;
}
