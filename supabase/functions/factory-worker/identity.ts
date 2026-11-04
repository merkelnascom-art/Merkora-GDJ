const TRUSTED_REPOSITORY = "merkelnascom-art/Merkora-GDJ";
const TRUSTED_REPOSITORY_ID = "1436120048";
const TRUSTED_WORKFLOW_REF = "merkelnascom-art/Merkora-GDJ/.github/workflows/merkora-factory-worker.yml@refs/heads/feature/merkora-factory-unified-runtime";
const TRUSTED_BRANCH_REF = "refs/heads/feature/merkora-factory-unified-runtime";

export function isTrustedGitHubWorkflowClaims(
  claims: Record<string, unknown>,
): claims is Record<string, unknown> & { run_id: string; run_attempt: string } {
  return claims.repository === TRUSTED_REPOSITORY &&
    claims.repository_id === TRUSTED_REPOSITORY_ID &&
    claims.workflow_ref === TRUSTED_WORKFLOW_REF &&
    claims.ref === TRUSTED_BRANCH_REF &&
    claims.event_name === "workflow_dispatch" &&
    typeof claims.run_id === "string" && /^\d+$/.test(claims.run_id) &&
    typeof claims.run_attempt === "string" && /^\d+$/.test(claims.run_attempt);
}
