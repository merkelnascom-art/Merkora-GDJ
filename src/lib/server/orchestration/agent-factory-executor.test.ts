import { describe, expect, it, vi } from "vitest";
import type { AgentMissionResult } from "./agent-mission-contract";
import type { AgentRuntimeAdapter, AgentRuntimeConnection } from "./provider-execution";
import { executeAgentFactoryWorkflow } from "./agent-factory-executor";

function resultFor(input: {
  missionId: string;
  projectId: string;
  providerId: string;
}): AgentMissionResult {
  return {
    contractVersion: 1,
    missionId: input.missionId,
    projectId: input.projectId,
    providerId: input.providerId,
    status: "completed",
    summary: "Mission terminée avec résultat structuré.",
    findings: [],
    artifacts: [],
    verification: { performed: [], passed: [], failed: [], notPerformed: [] },
    requiresHumanDecision: false,
  };
}

function connection(providerId: string): AgentRuntimeConnection {
  return {
    connectionId: `connection-${providerId}`,
    owner: { type: "organization", id: "merkora-org" },
    providerId,
    status: "connected",
    capabilities: ["models.generate"],
  };
}

function adapter(providerId: string, calls: string[]): AgentRuntimeAdapter {
  return {
    providerId,
    invocationCapability: "models.generate",
    async invoke({ mission }) {
      calls.push(`${providerId}:${mission.missionId}`);
      return resultFor({
        missionId: mission.missionId,
        projectId: mission.projectId,
        providerId,
      });
    },
  };
}

const baseInput = {
  projectId: "project-001",
  workflowId: "factory-execution-01",
  contextReferences: ["project:brief:v1", "project:plan:v2"],
  timeoutMs: 10_000,
  modelAliases: { openai: "fast", anthropic: "review", gemini: "deep" },
};

describe("guarded MerKora factory workflow execution", () => {
  it("executes compatible missions sequentially by phase and checks human gates", async () => {
    const calls: string[] = [];
    const checkHumanGate = vi.fn(async () => true);
    const result = await executeAgentFactoryWorkflow({
      ...baseInput,
      agentIds: ["analyste-metier", "architecte-logiciel", "developpeur-backend"],
      adapters: [adapter("openai", calls)],
      connections: [connection("openai")],
      authorizeWorkflowStart: async () => true,
      authorizeAgent: async () => true,
      reserveBudget: async () => true,
      checkHumanGate,
    });

    expect(result.state).toBe("ready_for_human_review");
    expect(result.invocations.map((item) => item.agentId)).toEqual([
      "analyste-metier", "architecte-logiciel", "developpeur-backend",
    ]);
    expect(calls).toHaveLength(3);
    expect(result.gateResults.every((gate) => gate.approved)).toBe(true);
    expect(checkHumanGate).toHaveBeenCalled();
    expect(result.executionStarted).toBe(true);
  });

  it("does not invoke providers when the workflow start is not authorized", async () => {
    const calls: string[] = [];
    const reserveBudget = vi.fn(async () => true);
    const result = await executeAgentFactoryWorkflow({
      ...baseInput,
      agentIds: ["analyste-metier"],
      adapters: [adapter("openai", calls)],
      connections: [connection("openai")],
      authorizeWorkflowStart: async () => false,
      authorizeAgent: async () => true,
      reserveBudget,
      checkHumanGate: async () => true,
    });

    expect(result.state).toBe("blocked");
    expect(result.executionStarted).toBe(false);
    expect(result.invocations).toEqual([]);
    expect(calls).toEqual([]);
    expect(reserveBudget).not.toHaveBeenCalled();
  });

  it("stops before fabrication when a required client or administrative gate is refused", async () => {
    const calls: string[] = [];
    const result = await executeAgentFactoryWorkflow({
      ...baseInput,
      agentIds: ["analyste-metier", "architecte-logiciel", "developpeur-backend"],
      adapters: [adapter("openai", calls)],
      connections: [connection("openai")],
      authorizeWorkflowStart: async () => true,
      authorizeAgent: async () => true,
      reserveBudget: async () => true,
      checkHumanGate: async (gate) => gate.gate.id !== "client-scope-validation",
    });

    expect(result.state).toBe("blocked");
    expect(result.invocations.map((item) => item.agentId)).toEqual([
      "analyste-metier", "architecte-logiciel",
    ]);
    expect(calls).toHaveLength(2);
    expect(result.gateResults.find((gate) => gate.gateId === "client-scope-validation")?.approved).toBe(false);
  });

  it("never forces a specialist without a compatible runtime into a provider call", async () => {
    const calls: string[] = [];
    const result = await executeAgentFactoryWorkflow({
      ...baseInput,
      agentIds: ["ux-ui-designer"],
      adapters: [adapter("openai", calls)],
      connections: [connection("openai")],
      authorizeWorkflowStart: async () => true,
      authorizeAgent: async () => true,
      reserveBudget: async () => true,
      checkHumanGate: async () => true,
    });

    expect(result.state).toBe("blocked");
    expect(result.invocations[0]).toMatchObject({
      agentId: "ux-ui-designer",
      status: "blocked",
      code: "SPECIALIZED_RUNTIME_REQUIRED",
    });
    expect(calls).toEqual([]);
  });

  it("requires an independent provider for reviewer and cross-checker work", async () => {
    const calls: string[] = [];
    const oneProvider = await executeAgentFactoryWorkflow({
      ...baseInput,
      agentIds: ["analyste-metier", "auditeur-de-code"],
      adapters: [adapter("openai", calls)],
      connections: [connection("openai")],
      authorizeWorkflowStart: async () => true,
      authorizeAgent: async () => true,
      reserveBudget: async () => true,
      checkHumanGate: async () => true,
    });

    expect(oneProvider.state).toBe("blocked");
    expect(oneProvider.invocations.find((item) => item.agentId === "auditeur-de-code")?.code)
      .toBe("INDEPENDENT_PROVIDER_REQUIRED");

    const twoProviderCalls: string[] = [];
    const twoProviders = await executeAgentFactoryWorkflow({
      ...baseInput,
      agentIds: ["analyste-metier", "auditeur-de-code"],
      adapters: [adapter("openai", twoProviderCalls), adapter("anthropic", twoProviderCalls)],
      connections: [connection("openai"), connection("anthropic")],
      authorizeWorkflowStart: async () => true,
      authorizeAgent: async () => true,
      reserveBudget: async () => true,
      checkHumanGate: async () => true,
    });

    expect(twoProviders.state).toBe("ready_for_human_review");
    expect(twoProviderCalls).toHaveLength(2);
    expect(twoProviderCalls[0]?.startsWith("openai:")).toBe(true);
    expect(twoProviderCalls[1]?.startsWith("anthropic:")).toBe(true);
  });

  it("blocks provider calls when project authorization or budget reservation fails", async () => {
    const calls: string[] = [];
    const unauthorized = await executeAgentFactoryWorkflow({
      ...baseInput,
      agentIds: ["analyste-metier"],
      adapters: [adapter("openai", calls)],
      connections: [connection("openai")],
      authorizeWorkflowStart: async () => true,
      authorizeAgent: async () => false,
      reserveBudget: async () => true,
      checkHumanGate: async () => true,
    });
    expect(unauthorized.invocations[0]?.code).toBe("NOT_AUTHORIZED");

    const unbudgeted = await executeAgentFactoryWorkflow({
      ...baseInput,
      agentIds: ["analyste-metier"],
      adapters: [adapter("openai", calls)],
      connections: [connection("openai")],
      authorizeWorkflowStart: async () => true,
      authorizeAgent: async () => true,
      reserveBudget: async () => false,
      checkHumanGate: async () => true,
    });
    expect(unbudgeted.invocations[0]?.code).toBe("BUDGET_NOT_RESERVED");
    expect(calls).toEqual([]);
  });
});
