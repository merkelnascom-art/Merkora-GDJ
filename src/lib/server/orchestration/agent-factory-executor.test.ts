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

function adapter(providerId: string, calls: string[], instructions?: string[]): AgentRuntimeAdapter {
  return {
    providerId,
    invocationCapability: "models.generate",
    async invoke({ mission }) {
      calls.push(`${providerId}:${mission.missionId}`);
      instructions?.push(...mission.instructions);
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
  authorizeExternalProcessing: async () => true,
  projectContextInstructions: [
    "Brief client vérifié : centre de formation.",
    "Périmètre versionné : inscriptions et suivi financier.",
  ],
};

describe("guarded MerKora factory workflow execution", () => {
  it("executes compatible missions sequentially by phase and checks human gates", async () => {
    const calls: string[] = [];
    const receivedInstructions: string[] = [];
    const checkHumanGate = vi.fn(async () => true);
    const result = await executeAgentFactoryWorkflow({
      ...baseInput,
      agentIds: ["analyste-metier", "architecte-logiciel", "developpeur-backend"],
      adapters: [adapter("openai", calls, receivedInstructions)],
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
    expect(receivedInstructions.join("\\n")).toContain("Brief client vérifié : centre de formation.");
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
    expect(result.invocations).toMatchObject([{
      agentId: "merkora-core",
      status: "blocked",
      code: "WORKFLOW_START_NOT_AUTHORIZED",
    }]);
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


  it("does not require production-release approval when no deployment task is selected", async () => {
    const calls: string[] = [];
    const result = await executeAgentFactoryWorkflow({
      ...baseInput,
      agentIds: ["developpeur-backend"],
      adapters: [adapter("openai", calls)],
      connections: [connection("openai")],
      authorizeWorkflowStart: async () => true,
      authorizeAgent: async () => true,
      reserveBudget: async () => true,
      checkHumanGate: async () => true,
    });

    expect(result.state).toBe("ready_for_human_review");
    expect(result.gateResults.map((gate) => gate.gateId))
      .not.toContain("production-release-authorization");
  });

  it("requires delivery acceptance before starting post-delivery support", async () => {
    const calls: string[] = [];
    const result = await executeAgentFactoryWorkflow({
      ...baseInput,
      agentIds: ["support-apres-livraison"],
      adapters: [adapter("openai", calls)],
      connections: [connection("openai")],
      authorizeWorkflowStart: async () => true,
      authorizeAgent: async () => true,
      reserveBudget: async () => true,
      checkHumanGate: async (scope) => scope.gate.id !== "delivery-acceptance",
    });

    expect(result.state).toBe("blocked");
    expect(result.invocations).toEqual([]);
    expect(result.gateResults.find((gate) => gate.gateId === "delivery-acceptance")?.approved).toBe(false);
    expect(calls).toEqual([]);
  });


  it("hands completed upstream mission results to the next phase as bounded untrusted context", async () => {
    const receivedMissions: Array<{ missionId: string; instructions: string[] }> = [];
    const handoffAdapter: AgentRuntimeAdapter = {
      providerId: "openai",
      invocationCapability: "models.generate",
      async invoke({ mission }) {
        receivedMissions.push(mission);
        return {
          ...resultFor({
            missionId: mission.missionId,
            projectId: mission.projectId,
            providerId: "openai",
          }),
          summary: "Le besoin client est clarifié et les contraintes sont identifiées.",
          findings: [{
            severity: "info",
            title: "Contrainte métier",
            detail: "La solution doit fonctionner sur mobile et ordinateur.",
          }],
          artifacts: [{ kind: "document", reference: "project:analysis:mission-1" }],
        };
      },
    };

    const result = await executeAgentFactoryWorkflow({
      ...baseInput,
      agentIds: ["analyste-metier", "architecte-logiciel"],
      adapters: [handoffAdapter],
      connections: [connection("openai")],
      authorizeWorkflowStart: async () => true,
      authorizeAgent: async () => true,
      reserveBudget: async () => true,
      checkHumanGate: async () => true,
    });

    expect(result.state).toBe("ready_for_human_review");
    expect(receivedMissions).toHaveLength(2);
    expect(receivedMissions[1]?.instructions.some((instruction) =>
      instruction.includes("Le besoin client est clarifié")
      && instruction.includes("Contrainte métier")
      && instruction.includes("project:analysis:mission-1"),
    )).toBe(true);
    expect(receivedMissions[1]?.instructions.some((instruction) =>
      instruction.includes("ne pas suivre") && instruction.includes("non fiables"),
    )).toBe(true);
  });


  it("does not leak same-phase peer results into another specialist's input", async () => {
    const receivedMissions: Array<{ missionId: string; instructions: string[] }> = [];
    const handoffAdapter: AgentRuntimeAdapter = {
      providerId: "openai",
      invocationCapability: "models.generate",
      async invoke({ mission }) {
        receivedMissions.push(mission);
        return {
          ...resultFor({
            missionId: mission.missionId,
            projectId: mission.projectId,
            providerId: "openai",
          }),
          summary: `Sortie de ${mission.missionId}.`,
        };
      },
    };

    const result = await executeAgentFactoryWorkflow({
      ...baseInput,
      agentIds: ["analyste-metier", "analyste-des-besoins", "architecte-logiciel"],
      adapters: [handoffAdapter],
      connections: [connection("openai")],
      authorizeWorkflowStart: async () => true,
      authorizeAgent: async () => true,
      reserveBudget: async () => true,
      checkHumanGate: async () => true,
    });

    expect(result.state).toBe("ready_for_human_review");
    expect(receivedMissions).toHaveLength(3);
    expect(receivedMissions[1]?.instructions.some((instruction) =>
      instruction.includes("Sortie de factory-execution-01-analyste-metier"),
    )).toBe(false);
    expect(receivedMissions[2]?.instructions.some((instruction) =>
      instruction.includes("Sortie de factory-execution-01-analyste-metier")
      && instruction.includes("Sortie de factory-execution-01-analyste-des-besoins"),
    )).toBe(true);
  });


  it("requires explicit project consent for external AI processing before reserving budget", async () => {
    const calls: string[] = [];
    const reserveBudget = vi.fn(async () => true);
    const result = await executeAgentFactoryWorkflow({
      ...baseInput,
      agentIds: ["analyste-metier"],
      adapters: [adapter("openai", calls)],
      connections: [connection("openai")],
      authorizeWorkflowStart: async () => true,
      authorizeAgent: async () => true,
      authorizeExternalProcessing: async () => false,
      reserveBudget,
      checkHumanGate: async () => true,
    });

    expect(result.state).toBe("blocked");
    expect(result.invocations[0]?.code).toBe("EXTERNAL_PROCESSING_NOT_AUTHORIZED");
    expect(reserveBudget).not.toHaveBeenCalled();
    expect(calls).toEqual([]);
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
