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

/**
 * The legacy scaffold worker must never claim a job carrying a planned
 * multi-agent manifest it does not know how to execute.
 */
export function isPlannedSpecialistWorkflowManifest(manifest: unknown): boolean {
  return Boolean(
    manifest && typeof manifest === "object" && !Array.isArray(manifest) &&
    Object.prototype.hasOwnProperty.call(manifest, "specialistWorkflow")
  );
}


export type ValidatedSpecialistWorkflowManifest = Readonly<{
  workflowId: string;
  projectId: string;
  planVersion: number;
  missionCount: number;
  unsupportedCount: number;
  status: "prepared" | "requires_specialized_task_runtime";
}>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

/**
 * Validates the persisted specialist plan before the worker considers it.
 * This is deliberately a manifest validator, not a mission lease or execution
 * authorization. Human approvals and payment are checked separately.
 */
export function readSpecialistWorkflowManifest(
  manifest: unknown,
  expectedProjectId: string,
  expectedPlanVersion: number,
): ValidatedSpecialistWorkflowManifest | null {
  if (!isPlannedSpecialistWorkflowManifest(manifest) || !isRecord(manifest)) return null;
  const workflow = manifest.specialistWorkflow;
  if (!isRecord(workflow) || workflow.schemaVersion !== 1 ||
      workflow.executionEnabled !== false ||
      workflow.projectId !== expectedProjectId ||
      typeof workflow.workflowId !== "string" || !workflow.workflowId.trim() ||
      (workflow.status !== "prepared" && workflow.status !== "requires_specialized_task_runtime") ||
      !isRecord(workflow.sourceVersions) ||
      workflow.sourceVersions.planVersion !== expectedPlanVersion ||
      !Array.isArray(workflow.stages) || workflow.stages.length !== 5 ||
      !Array.isArray(workflow.unsupported) ||
      !isRecord(workflow.missionPlan) || !Array.isArray(workflow.missionPlan.steps) ||
      !Array.isArray(workflow.assignments)) {
    return null;
  }

  const expectedTaskKeys = [
    "prepare_specification",
    "generate_application",
    "run_quality_checks",
    "repair_and_retest",
    "human_delivery_review",
  ];
  const taskKeys = workflow.stages.flatMap((stage) =>
    isRecord(stage) && typeof stage.taskKey === "string" ? [stage.taskKey] : []
  );
  if (taskKeys.length !== 5 || new Set(taskKeys).size !== 5 ||
      expectedTaskKeys.some((key) => !taskKeys.includes(key))) {
    return null;
  }

  const missionIds = workflow.missionPlan.steps.flatMap((step) =>
    isRecord(step) && typeof step.missionId === "string" && step.missionId.trim()
      ? [step.missionId]
      : []
  );
  const assignmentIds = workflow.assignments.flatMap((assignment) =>
    isRecord(assignment) && typeof assignment.missionId === "string" && assignment.missionId.trim()
      ? [assignment.missionId]
      : []
  );
  if (missionIds.length < 1 || missionIds.length !== workflow.missionPlan.steps.length ||
      assignmentIds.length !== workflow.assignments.length ||
      missionIds.length !== assignmentIds.length ||
      new Set(missionIds).size !== missionIds.length ||
      new Set(assignmentIds).size !== assignmentIds.length ||
      missionIds.some((id) => !assignmentIds.includes(id))) {
    return null;
  }

  return {
    workflowId: workflow.workflowId,
    projectId: expectedProjectId,
    planVersion: expectedPlanVersion,
    missionCount: missionIds.length,
    unsupportedCount: workflow.unsupported.length,
    status: workflow.status,
  };
}
