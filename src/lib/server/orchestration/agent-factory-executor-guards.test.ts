import { describe, expect, it } from "vitest";
import type { AgentMissionResult } from "./agent-mission-contract";
import type { AgentRuntimeAdapter, AgentRuntimeConnection } from "./provider-execution";
import { executeAgentFactoryWorkflow } from "./agent-factory-executor";

describe("factory workflow fail-closed policy callbacks", () => {
  it("treats a thrown human-gate check as a refusal and does not cross the gate", async () => {
    const calls: string[] = [];
    const provider: AgentRuntimeAdapter = {
      providerId: "openai",
      invocationCapability: "models.generate",
      async invoke({ mission }) {
        calls.push(mission.missionId);
        return {
          contractVersion: 1,
          missionId: mission.missionId,
          projectId: mission.projectId,
          providerId: "openai",
          status: "completed",
          summary: "ok",
          findings: [],
          artifacts: [],
          verification: { performed: [], passed: [], failed: [], notPerformed: [] },
          requiresHumanDecision: false,
        } satisfies AgentMissionResult;
      },
    };
    const connection: AgentRuntimeConnection = {
      connectionId: "connection-openai",
      owner: { type: "organization", id: "merkora-org" },
      providerId: "openai",
      status: "connected",
      capabilities: ["models.generate"],
    };

    const result = await executeAgentFactoryWorkflow({
      projectId: "project-001",
      workflowId: "gate-failure-01",
      agentIds: ["developpeur-backend"],
      adapters: [provider],
      connections: [connection],
      modelAliases: { openai: "fast" },
      timeoutMs: 10_000,
      authorizeWorkflowStart: async () => true,
      authorizeAgent: async () => true,
      reserveBudget: async () => true,
      checkHumanGate: async ({ gate }) => {
        if (gate.id === "execution-authorization") throw new Error("unavailable");
        return true;
      },
    });

    expect(result.state).toBe("blocked");
    expect(result.gateResults.find((gate) => gate.gateId === "execution-authorization")?.approved).toBe(false);
    expect(calls).toEqual([]);
    expect(result.executionStarted).toBe(false);
  });

  it("treats a thrown budget reservation as a denial before provider invocation", async () => {
    const calls: string[] = [];
    const provider: AgentRuntimeAdapter = {
      providerId: "openai",
      invocationCapability: "models.generate",
      async invoke({ mission }) {
        calls.push(mission.missionId);
        return {
          contractVersion: 1,
          missionId: mission.missionId,
          projectId: mission.projectId,
          providerId: "openai",
          status: "completed",
          summary: "ok",
          findings: [],
          artifacts: [],
          verification: { performed: [], passed: [], failed: [], notPerformed: [] },
          requiresHumanDecision: false,
        };
      },
    };
    const connection: AgentRuntimeConnection = {
      connectionId: "connection-openai",
      owner: { type: "organization", id: "merkora-org" },
      providerId: "openai",
      status: "connected",
      capabilities: ["models.generate"],
    };

    const result = await executeAgentFactoryWorkflow({
      projectId: "project-001",
      workflowId: "budget-failure-01",
      agentIds: ["analyste-metier"],
      adapters: [provider],
      connections: [connection],
      modelAliases: { openai: "fast" },
      timeoutMs: 10_000,
      authorizeWorkflowStart: async () => true,
      authorizeAgent: async () => true,
      reserveBudget: async () => { throw new Error("budget service unavailable"); },
      checkHumanGate: async () => true,
    });

    expect(result.state).toBe("blocked");
    expect(result.invocations[0]?.code).toBe("BUDGET_NOT_RESERVED");
    expect(calls).toEqual([]);
  });
});
