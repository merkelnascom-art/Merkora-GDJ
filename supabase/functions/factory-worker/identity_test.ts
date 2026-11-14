import * as identity from "./identity.ts";
const { isTrustedGitHubWorkflowClaims } = identity;

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

Deno.test("accepts the production-hardening and main branches for the same pinned workflow", () => {
  for (const branch of ["feature/merkora-production-security-hardening", "main"]) {
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

Deno.test("identifies specialist manifests so the legacy worker cannot silently process them", () => {
  const guard = (identity as unknown as Record<string, unknown>).isPlannedSpecialistWorkflowManifest;
  if (typeof guard !== "function") throw new Error("specialist manifest guard is not implemented");
  const isPlanned = guard as (manifest: unknown) => boolean;
  if (!isPlanned({ specialistWorkflow: { status: "prepared", executionEnabled: false } })) {
    throw new Error("a planned specialist manifest must be detected");
  }
  if (isPlanned({ kind: "merkora_project_factory_job" })) {
    throw new Error("an ordinary legacy factory job must remain dispatchable");
  }
});


const specialistManifest = {
  specialistWorkflow: {
    schemaVersion: 1,
    workflowId: "factory-specialist-01",
    projectId: "MK-PROJECT-001",
    status: "prepared",
    executionEnabled: false,
    sourceVersions: { briefVersion: 2, planVersion: 3 },
    stages: [
      { taskKey: "prepare_specification", missionIds: ["mission-1"], agentIds: ["analyste-metier"] },
      { taskKey: "generate_application", missionIds: ["mission-2"], agentIds: ["developpeur-backend"] },
      { taskKey: "run_quality_checks", missionIds: [], agentIds: [] },
      { taskKey: "repair_and_retest", missionIds: [], agentIds: [] },
      { taskKey: "human_delivery_review", missionIds: [], agentIds: [] },
    ],
    unsupported: [],
    plan: {
      missionPlan: { steps: [{ missionId: "mission-1" }, { missionId: "mission-2" }] },
      assignments: [{ missionId: "mission-1" }, { missionId: "mission-2" }],
    },
  },
};

Deno.test("validates the persisted specialist plan and returns bounded worker metadata", () => {
  const read = (identity as unknown as Record<string, unknown>).readSpecialistWorkflowManifest;
  if (typeof read !== "function") throw new Error("specialist manifest reader is not implemented");
  const parse = read as (manifest: unknown, projectId: string, planVersion: number) => Record<string, unknown> | null;
  const result = parse(specialistManifest, "MK-PROJECT-001", 3);
  if (!result || result.workflowId !== "factory-specialist-01" ||
      result.missionCount !== 2 || result.unsupportedCount !== 0 ||
      result.status !== "prepared") {
    throw new Error("the valid specialist workflow manifest should be accepted");
  }
});

Deno.test("rejects specialist manifests with mismatched project, plan version or execution flag", () => {
  const read = (identity as unknown as Record<string, unknown>).readSpecialistWorkflowManifest as
    (manifest: unknown, projectId: string, planVersion: number) => unknown;
  if (read({ specialistWorkflow: { ...specialistManifest.specialistWorkflow, projectId: "other-project" } }, "MK-PROJECT-001", 3) !== null) {
    throw new Error("a manifest from another project must be rejected");
  }
  if (read(specialistManifest, "MK-PROJECT-001", 4) !== null) {
    throw new Error("a manifest from an old plan version must be rejected");
  }
  if (read({ specialistWorkflow: { ...specialistManifest.specialistWorkflow, executionEnabled: true } }, "MK-PROJECT-001", 3) !== null) {
    throw new Error("a planning manifest must never enable execution");
  }
});

Deno.test("rejects malformed stage sets and mission-assignment mismatches", () => {
  const read = (identity as unknown as Record<string, unknown>).readSpecialistWorkflowManifest as
    (manifest: unknown, projectId: string, planVersion: number) => unknown;
  const workflow = specialistManifest.specialistWorkflow;
  if (read({ specialistWorkflow: { ...workflow, stages: workflow.stages.slice(1) } }, "MK-PROJECT-001", 3) !== null) {
    throw new Error("all five existing durable task stages must be present");
  }
  if (read({ specialistWorkflow: { ...workflow, plan: { ...workflow.plan, assignments: [{ missionId: "mission-other" }] } } }, "MK-PROJECT-001", 3) !== null) {
    throw new Error("mission assignments must match the planned mission set");
  }
});
