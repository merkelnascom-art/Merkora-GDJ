const TRUSTED_REPOSITORY = "merkelnascom-art/Merkora-GDJ";
const TRUSTED_REPOSITORY_ID = "1436120048";
const TRUSTED_BRANCHES = new Set([
  "refs/heads/feature/merkora-factory-unified-runtime",
  "refs/heads/feature/admin-owned-factory-planning",
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

function hasValidMissionDependencyGraph(steps: readonly unknown[]): boolean {
  const byId = new Map<string, string[]>();
  const sequences = new Set<number>();

  for (const value of steps) {
    if (!isRecord(value) || typeof value.missionId !== "string" ||
        !/^[a-z0-9][a-z0-9-]{0,79}$/.test(value.missionId) ||
        !Number.isSafeInteger(value.sequence) || Number(value.sequence) < 1 ||
        !Array.isArray(value.dependsOn) || value.dependsOn.length > 20 ||
        byId.has(value.missionId) || sequences.has(Number(value.sequence)) ||
        value.dependsOn.some((dependency) => typeof dependency !== "string")) {
      return false;
    }
    byId.set(value.missionId, value.dependsOn as string[]);
    sequences.add(Number(value.sequence));
  }

  for (const [missionId, dependencies] of byId) {
    if (dependencies.some((dependency) => dependency === missionId || !byId.has(dependency))) {
      return false;
    }
  }

  const states = new Map<string, "visiting" | "visited">();
  const visit = (missionId: string): boolean => {
    const state = states.get(missionId);
    if (state === "visited") return true;
    if (state === "visiting") return false;
    states.set(missionId, "visiting");
    for (const dependency of byId.get(missionId) ?? []) {
      if (!visit(dependency)) return false;
    }
    states.set(missionId, "visited");
    return true;
  };

  return [...byId.keys()].every(visit);
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
      !isRecord(workflow.plan) ||
      !isRecord(workflow.plan.missionPlan) || !Array.isArray(workflow.plan.missionPlan.steps) ||
      !Array.isArray(workflow.plan.assignments)) {
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

  const missionIds = (workflow.plan as Record<string, unknown>).missionPlan && isRecord((workflow.plan as Record<string, unknown>).missionPlan)
    ? ((workflow.plan as Record<string, unknown>).missionPlan as Record<string, unknown>).steps
    : [];
  if (!Array.isArray(missionIds) || !hasValidMissionDependencyGraph(missionIds)) return null;
  const normalizedMissionIds = missionIds.flatMap((step) =>
    isRecord(step) && typeof step.missionId === "string" && step.missionId.trim()
      ? [step.missionId]
      : []
  );
  const assignments = (workflow.plan as Record<string, unknown>).assignments as unknown[];
  const assignmentIds = assignments.flatMap((assignment) => {
    if (!isRecord(assignment) || typeof assignment.missionId !== "string" ||
        typeof assignment.agentId !== "string" || typeof assignment.runtimeRole !== "string" ||
        !isRecord(assignment.mission)) {
      return [];
    }
    const mission = assignment.mission;
    if (mission.contractVersion !== 1 ||
        mission.missionId !== assignment.missionId ||
        mission.projectId !== expectedProjectId ||
        mission.role !== assignment.runtimeRole ||
        !Array.isArray(mission.instructions) || mission.instructions.length < 1 ||
        mission.instructions.length > 20 ||
        !Array.isArray(mission.contextReferences) ||
        !Array.isArray(mission.constraints) ||
        !Array.isArray(mission.approvalRequiredFor) ||
        !isRecord(mission.expectedOutput)) {
      return [];
    }
    return [assignment.missionId];
  });
  if (normalizedMissionIds.length < 1 || normalizedMissionIds.length !== missionIds.length ||
      assignmentIds.length !== assignments.length ||
      normalizedMissionIds.length !== assignmentIds.length ||
      new Set(normalizedMissionIds).size !== normalizedMissionIds.length ||
      new Set(assignmentIds).size !== assignmentIds.length ||
      normalizedMissionIds.some((id) => !assignmentIds.includes(id))) {
    return null;
  }

  return {
    workflowId: workflow.workflowId,
    projectId: expectedProjectId,
    planVersion: expectedPlanVersion,
    missionCount: normalizedMissionIds.length,
    unsupportedCount: workflow.unsupported.length,
    status: workflow.status,
  };
}
