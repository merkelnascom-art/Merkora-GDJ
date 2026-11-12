import { isTrustedGitHubWorkflowClaims } from "./identity.ts";

const validClaims: Record<string, unknown> = {
  repository: "merkelnascom-art/Merkora-GDJ",
  repository_id: "1436120048",
  workflow_ref: "merkelnascom-art/Merkora-GDJ/.github/workflows/merkora-factory-worker.yml@refs/heads/feature/merkora-factory-unified-runtime",
  ref: "refs/heads/feature/merkora-factory-unified-runtime",
  event_name: "workflow_dispatch",
  run_id: "41875961714",
  run_attempt: "1",
};

Deno.test("accepts only the immutable MerKora repository and approved workflow identity", () => {
  if (!isTrustedGitHubWorkflowClaims(validClaims)) {
    throw new Error("expected the approved GitHub workflow identity to be trusted");
  }
});

Deno.test("rejects a repository with the same name but a different immutable repository ID", () => {
  if (isTrustedGitHubWorkflowClaims({ ...validClaims, repository_id: "999999999" })) {
    throw new Error("a different repository ID must never be trusted");
  }
});

Deno.test("rejects a different workflow path", () => {
  if (isTrustedGitHubWorkflowClaims({ ...validClaims, workflow_ref: "merkelnascom-art/Merkora-GDJ/.github/workflows/other.yml@refs/heads/feature/merkora-factory-unified-runtime" })) {
    throw new Error("an unapproved workflow must never be trusted");
  }
});

Deno.test("accepts the active factory branch, production-hardening, and main for the same pinned workflow", () => {
  for (const branch of ["feature/admin-owned-factory-planning", "feature/merkora-production-security-hardening", "main"]) {
    const ref = `refs/heads/${branch}`;
    const workflowRef = `merkelnascom-art/Merkora-GDJ/.github/workflows/merkora-factory-worker.yml@${ref}`;
    if (!isTrustedGitHubWorkflowClaims({ ...validClaims, ref, workflow_ref: workflowRef })) {
      throw new Error(`the approved workflow should be trusted on ${branch}`);
    }
  }
});

Deno.test("rejects a different branch or event", () => {
  if (isTrustedGitHubWorkflowClaims({ ...validClaims, ref: "refs/heads/main" })) {
    throw new Error("an unapproved branch must never be trusted");
  }
  if (isTrustedGitHubWorkflowClaims({ ...validClaims, event_name: "pull_request" })) {
    throw new Error("an unapproved event must never be trusted");
  }
});

Deno.test("requires numeric GitHub run and attempt identifiers", () => {
  if (isTrustedGitHubWorkflowClaims({ ...validClaims, run_id: "run-1" })) {
    throw new Error("a malformed run ID must never be trusted");
  }
  if (isTrustedGitHubWorkflowClaims({ ...validClaims, run_attempt: "" })) {
    throw new Error("a malformed run attempt must never be trusted");
  }
});
