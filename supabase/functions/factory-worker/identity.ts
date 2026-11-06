const TRUSTED_REPOSITORY = "merkelnascom-art/Merkora-GDJ";
const TRUSTED_REPOSITORY_ID = "1436120048";
const TRUSTED_BRANCHES = new Set([
  "refs/heads/feature/merkora-factory-unified-runtime",
  "refs/heads/feature/merkora-production-security-hardening",
  "refs/heads/main",
]);
const TRUSTED_WORKFLOW_REFS = new Set(
  [...TRUSTED_BRANCHES].map((branch) =>
    `merkelnascom-art/Merkora-GDJ/.github/workflows/merkora-factory-worker.yml@${branch}`
  ),
);

export function isTrustedGitHubWorkflowClaims(
  claims: Record<string, unknown>,
): claims is Record<string, unknown> & { run_id: string; run_attempt: string } {
  return claims.repository === TRUSTED_REPOSITORY &&
    claims.repository_id === TRUSTED_REPOSITORY_ID &&
    typeof claims.workflow_ref === "string" && TRUSTED_WORKFLOW_REFS.has(claims.workflow_ref) &&
    typeof claims.ref === "string" && TRUSTED_BRANCHES.has(claims.ref) &&
    claims.workflow_ref.endsWith(`@${claims.ref}`) &&
    claims.event_name === "workflow_dispatch" &&
    typeof claims.run_id === "string" && /^\d+$/.test(claims.run_id) &&
    typeof claims.run_attempt === "string" && /^\d+$/.test(claims.run_attempt);
}
