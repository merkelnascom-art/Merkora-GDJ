import { describe, expect, it } from "vitest";
import type { AgentMissionResult } from "./agent-mission-contract";
import type { CollaborationExecutionResult } from "./agent-collaboration-executor";
import { synthesizeAgentCollaboration } from "./agent-collaboration-synthesis";

function execution(result: AgentMissionResult): CollaborationExecutionResult {
  return {
    projectId: "project-1",
    blockedRoles: [],
    completedResults: [result],
    invocations: [{
      role: "analyst",
      providerId: "openai",
      outcome: { ok: true, result },
    }],
  };
}
const result: AgentMissionResult = {
  contractVersion: 1,
  missionId: "mission-1",
  projectId: "project-1",
  providerId: "openai",
  status: "completed",
  summary: "Analyse structurée.",
  findings: [],
  artifacts: [],
  verification: { performed: ["Format"], passed: ["Contrat"], failed: [], notPerformed: ["Test navigateur"] },
  requiresHumanDecision: false,
};

describe("agent collaboration synthesis", () => {
  it("returns only a human-review handoff, never a verified or delivered state", () => {
    const synthesis = synthesizeAgentCollaboration({
      execution: execution(result),
      requiredRoles: ["analyst"],
    });
    expect(synthesis.state).toBe("ready_for_human_review");
    expect(synthesis.readyForHumanReview).toBe(true);
    expect(synthesis).not.toHaveProperty("delivered");
    expect(synthesis.limitations.length).toBeGreaterThan(0);
  });

  it("blocks a result containing a critical finding", () => {
    const synthesis = synthesizeAgentCollaboration({
      execution: execution({
        ...result,
        findings: [{ severity: "critical", title: "Risque critique", detail: "Une vérification est nécessaire." }],
      }),
      requiredRoles: ["analyst"],
    });
    expect(synthesis.state).toBe("blocked");
    expect(synthesis.requiresHumanDecision).toBe(true);
  });

  it("requires a human decision for warnings and failed provider-reported checks", () => {
    const synthesis = synthesizeAgentCollaboration({
      execution: execution({
        ...result,
        findings: [{ severity: "warning", title: "À examiner", detail: "Le choix mérite une revue." }],
        verification: { ...result.verification, failed: ["Test annoncé en échec"] },
      }),
      requiredRoles: ["analyst"],
    });
    expect(synthesis.state).toBe("ready_for_human_review");
    expect(synthesis.requiresHumanDecision).toBe(true);
  });

  it("marks missing required roles as incomplete", () => {
    const synthesis = synthesizeAgentCollaboration({
      execution: execution(result),
      requiredRoles: ["analyst", "reviewer"],
    });
    expect(synthesis.state).toBe("incomplete");
    expect(synthesis.blockedRoles).toContain("reviewer");
  });

  it("does not treat blocked provider results as completed work", () => {
    const synthesis = synthesizeAgentCollaboration({
      execution: execution({ ...result, status: "blocked" }),
      requiredRoles: ["analyst"],
    });
    expect(synthesis.state).toBe("blocked");
    expect(synthesis.blockedRoles).toContain("analyst");
  });
});
