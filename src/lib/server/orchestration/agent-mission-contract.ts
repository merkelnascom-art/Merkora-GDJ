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
const FINDING_SEVERITIES = new Set(["info", "warning", "critical"]);
const ARTIFACT_KINDS = new Set(["patch", "document", "test_report", "design", "deployment_reference"]);
const RESULT_STATUSES = new Set(["completed", "blocked", "failed"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requiredText(value: unknown, label: string, maxLength: number): string {
  if (typeof value !== "string") throw new Error(`${label} must be text.`);
  const normalized = value.trim();
  if (!normalized || normalized.length > maxLength) {
    throw new Error(`${label} must be non-empty and within its length limit.`);
  }
  return normalized;
}

function boundedTextList(value: unknown, label: string, maxItems = 100, maxLength = 240): string[] {
  if (!Array.isArray(value) || value.length > maxItems) {
    throw new Error(`${label} must be a bounded list.`);
  }
  return value.map((item) => requiredText(item, label, maxLength));
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
 * Validates untrusted provider JSON at runtime. Contract typing alone is not a
 * runtime security boundary. This validates shape and scope, not truthfulness:
 * independent verification remains a separate workflow stage.
 */
export function validateAgentMissionResult(
  mission: Pick<AgentMissionEnvelope, "missionId" | "projectId">,
  value: unknown,
): AgentMissionResult {
  if (!isRecord(value)) throw new Error("Mission result must be an object.");
  if (value.contractVersion !== 1) throw new Error("Unsupported mission result contract.");
  if (value.missionId !== mission.missionId || value.projectId !== mission.projectId) {
    throw new Error("Mission result scope mismatch.");
  }

  const providerId = requiredText(value.providerId, "Provider identifier", 100);
  const summary = requiredText(value.summary, "Result summary", 4_000);
  if (typeof value.status !== "string" || !RESULT_STATUSES.has(value.status)) {
    throw new Error("Invalid mission result status.");
  }
  if (typeof value.requiresHumanDecision !== "boolean") {
    throw new Error("Invalid human-decision flag.");
  }
  if (!Array.isArray(value.findings) || value.findings.length > 100) {
    throw new Error("Mission findings must be a bounded list.");
  }
  const findings = value.findings.map((finding) => {
    if (!isRecord(finding) || typeof finding.severity !== "string" || !FINDING_SEVERITIES.has(finding.severity)) {
      throw new Error("Invalid mission finding.");
    }
    return {
      severity: finding.severity as "info" | "warning" | "critical",
      title: requiredText(finding.title, "Finding title", 240),
      detail: requiredText(finding.detail, "Finding detail", 4_000),
    };
  });

  if (!Array.isArray(value.artifacts) || value.artifacts.length > 50) {
    throw new Error("Mission artifacts must be a bounded list.");
  }
  const artifacts = value.artifacts.map((artifact) => {
    if (!isRecord(artifact) || typeof artifact.kind !== "string" || !ARTIFACT_KINDS.has(artifact.kind)) {
      throw new Error("Invalid mission artifact.");
    }
    return {
      kind: artifact.kind as "patch" | "document" | "test_report" | "design" | "deployment_reference",
      reference: requiredText(artifact.reference, "Artifact reference", 1_000),
    };
  });

  if (!isRecord(value.verification)) throw new Error("Mission verification is required.");
  const verification = {
    performed: boundedTextList(value.verification.performed, "Verification entry"),
    passed: boundedTextList(value.verification.passed, "Verification entry"),
    failed: boundedTextList(value.verification.failed, "Verification entry"),
    notPerformed: boundedTextList(value.verification.notPerformed, "Verification entry"),
  };
  if (value.status === "completed" && verification.failed.length > 0) {
    throw new Error("A result with failed verification cannot be marked completed.");
  }

  return {
    contractVersion: 1,
    missionId: mission.missionId,
    projectId: mission.projectId,
    providerId,
    status: value.status as "completed" | "blocked" | "failed",
    summary,
    findings,
    artifacts,
    verification,
    requiresHumanDecision: value.requiresHumanDecision,
  };
}
