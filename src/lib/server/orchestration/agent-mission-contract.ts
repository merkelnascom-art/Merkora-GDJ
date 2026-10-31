export type AgentMissionRole =
  | "analyst"
  | "architect"
  | "implementer"
  | "reviewer"
  | "tester"
  | "cross_checker";

export type AgentMissionEnvelope = {
  contractVersion: 1;
  missionId: string;
  projectId: string;
  role: AgentMissionRole;
  objective: string;
  instructions: string[];
  contextReferences: string[];
  constraints: string[];
  expectedOutput: {
    summary: true;
    findings: true;
    artifacts: true;
    verification: true;
  };
  approvalRequiredFor: string[];
};

export type AgentMissionResult = {
  contractVersion: 1;
  missionId: string;
  projectId: string;
  providerId: string;
  status: "completed" | "blocked" | "failed";
  summary: string;
  findings: Array<{
    severity: "info" | "warning" | "critical";
    title: string;
    detail: string;
  }>;
  artifacts: Array<{
    kind: "patch" | "document" | "test_report" | "design" | "deployment_reference";
    reference: string;
  }>;
  verification: {
    performed: string[];
    passed: string[];
    failed: string[];
    notPerformed: string[];
  };
  requiresHumanDecision: boolean;
};

const ROLES = new Set<AgentMissionRole>([
  "analyst", "architect", "implementer", "reviewer", "tester", "cross_checker",
]);

function requiredText(value: string, label: string, maxLength: number): string {
  const normalized = value.trim();
  if (!normalized || normalized.length > maxLength) {
    throw new Error(`${label} must be non-empty and within its length limit.`);
  }
  return normalized;
}

function uniqueReferences(values: readonly string[], label: string): string[] {
  const normalized = [...new Set(values.map((value) => requiredText(value, label, 240)))];
  if (normalized.length > 30) throw new Error(`${label} limit exceeded.`);
  return normalized;
}

/**
 * Creates a provider-neutral mission packet. Only explicit, bounded references
 * are shared; credentials, access tokens and raw connection secrets are not
 * part of this contract. The caller remains responsible for project ACL checks.
 */
export function createAgentMissionEnvelope(input: {
  missionId: string;
  projectId: string;
  role: AgentMissionRole;
  objective: string;
  instructions: readonly string[];
  contextReferences?: readonly string[];
  constraints?: readonly string[];
  approvalRequiredFor?: readonly string[];
}): AgentMissionEnvelope {
  if (!ROLES.has(input.role)) throw new Error("Unknown agent mission role.");

  const instructions = input.instructions.map((item) => requiredText(item, "Instruction", 2_000));
  if (instructions.length < 1 || instructions.length > 20) {
    throw new Error("Mission must contain between 1 and 20 instructions.");
  }

  return {
    contractVersion: 1,
    missionId: requiredText(input.missionId, "Mission identifier", 160),
    projectId: requiredText(input.projectId, "Project identifier", 160),
    role: input.role,
    objective: requiredText(input.objective, "Mission objective", 2_000),
    instructions,
    contextReferences: uniqueReferences(input.contextReferences ?? [], "Context reference"),
    constraints: uniqueReferences(input.constraints ?? [], "Constraint"),
    expectedOutput: { summary: true, findings: true, artifacts: true, verification: true },
    approvalRequiredFor: uniqueReferences(input.approvalRequiredFor ?? [], "Approval boundary"),
  };
}

/**
 * Validates that a returned result belongs to the exact mission and has a
 * complete, bounded shape. This does not prove that claims or artifacts are true:
 * independent verification is a separate workflow stage.
 */
export function validateAgentMissionResult(
  mission: Pick<AgentMissionEnvelope, "missionId" | "projectId">,
  result: AgentMissionResult,
): AgentMissionResult {
  if (result.contractVersion !== 1) throw new Error("Unsupported mission result contract.");
  if (result.missionId !== mission.missionId || result.projectId !== mission.projectId) {
    throw new Error("Mission result scope mismatch.");
  }
  requiredText(result.providerId, "Provider identifier", 100);
  requiredText(result.summary, "Result summary", 4_000);
  if (result.findings.length > 100 || result.artifacts.length > 50) {
    throw new Error("Mission result collection limit exceeded.");
  }
  for (const finding of result.findings) {
    requiredText(finding.title, "Finding title", 240);
    requiredText(finding.detail, "Finding detail", 4_000);
  }
  for (const artifact of result.artifacts) {
    requiredText(artifact.reference, "Artifact reference", 1_000);
  }
  for (const list of [
    result.verification.performed,
    result.verification.passed,
    result.verification.failed,
    result.verification.notPerformed,
  ]) {
    if (list.length > 100) throw new Error("Verification list limit exceeded.");
    for (const item of list) requiredText(item, "Verification entry", 240);
  }
  if (result.status === "completed" && result.verification.failed.length > 0) {
    throw new Error("A result with failed verification cannot be marked completed.");
  }
  return result;
}
