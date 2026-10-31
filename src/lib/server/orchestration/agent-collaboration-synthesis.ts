import type { AgentMissionResult } from "./agent-mission-contract";
import type { AgentRole } from "./agent-collaboration";
import type { CollaborationExecutionResult } from "./agent-collaboration-executor";

export type SynthesizedFinding = {
  role: AgentRole;
  providerId: string;
  severity: "info" | "warning" | "critical";
  title: string;
  detail: string;
};

export type CollaborationSynthesis = {
  projectId: string;
  state: "incomplete" | "blocked" | "ready_for_human_review";
  readyForHumanReview: boolean;
  requiresHumanDecision: boolean;
  blockedRoles: AgentRole[];
  findings: SynthesizedFinding[];
  providerReportedVerification: Array<{
    role: AgentRole;
    providerId: string;
    performed: string[];
    passed: string[];
    failed: string[];
    notPerformed: string[];
  }>;
  limitations: string[];
};

/**
 * Deterministically aggregates provider reports without manufacturing consensus.
 * "Ready for human review" is deliberately not "verified", "approved" or "delivered".
 * Provider-reported tests are claims until a trusted test runner supplies evidence.
 */
export function synthesizeAgentCollaboration(input: {
  execution: CollaborationExecutionResult;
  requiredRoles: readonly AgentRole[];
}): CollaborationSynthesis {
  const findings: SynthesizedFinding[] = [];
  const providerReportedVerification: CollaborationSynthesis["providerReportedVerification"] = [];
  const blockedRoles = new Set<AgentRole>(input.execution.blockedRoles);
  let requiresHumanDecision = blockedRoles.size > 0;

  for (const invocation of input.execution.invocations) {
    if (!invocation.outcome.ok) {
      blockedRoles.add(invocation.role);
      requiresHumanDecision = true;
      continue;
    }

    const result: AgentMissionResult = invocation.outcome.result;
    if (result.status !== "completed") {
      blockedRoles.add(invocation.role);
      requiresHumanDecision = true;
    }
    if (result.requiresHumanDecision || result.verification.failed.length > 0) {
      requiresHumanDecision = true;
    }

    for (const finding of result.findings) {
      findings.push({
        role: invocation.role,
        providerId: invocation.providerId,
        severity: finding.severity,
        title: finding.title,
        detail: finding.detail,
      });
      if (finding.severity === "critical" || finding.severity === "warning") {
        requiresHumanDecision = true;
      }
    }

    providerReportedVerification.push({
      role: invocation.role,
      providerId: invocation.providerId,
      performed: [...result.verification.performed],
      passed: [...result.verification.passed],
      failed: [...result.verification.failed],
      notPerformed: [...result.verification.notPerformed],
    });
  }

  for (const role of input.requiredRoles) {
    const hasResult = input.execution.invocations.some(
      (invocation) => invocation.role === role && invocation.outcome.ok,
    );
    if (!hasResult) blockedRoles.add(role);
  }

  const hasCriticalFinding = findings.some((finding) => finding.severity === "critical");
  const hasIncompleteRole = blockedRoles.size > 0;
  const state = hasCriticalFinding
    ? "blocked"
    : hasIncompleteRole
      ? "incomplete"
      : "ready_for_human_review";

  return {
    projectId: input.execution.projectId,
    state,
    readyForHumanReview: state === "ready_for_human_review",
    requiresHumanDecision: requiresHumanDecision || hasCriticalFinding,
    blockedRoles: [...blockedRoles],
    findings,
    providerReportedVerification,
    limitations: [
      "Les résultats des fournisseurs sont des rapports non fiables tant qu'ils ne sont pas corroborés par des preuves indépendantes.",
      "Cette synthèse ne lance aucun test, ne modifie aucun dépôt et n'autorise aucun déploiement.",
      "Aucun consensus n'est fabriqué : les constats contradictoires doivent être examinés par une personne autorisée.",
    ],
  };
}
