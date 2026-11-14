import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./project-factory-context", () => ({ loadProjectFactoryContext: vi.fn() }));
vi.mock("./agent-factory-executor", () => ({ executeConfiguredAgentFactoryWorkflow: vi.fn() }));

import { loadProjectFactoryContext } from "./project-factory-context";
import { executeConfiguredAgentFactoryWorkflow } from "./agent-factory-executor";
import { executeProjectFactoryWorkflow } from "./project-factory-executor";

describe("executeProjectFactoryWorkflow", () => {
  beforeEach(() => {
    vi.mocked(loadProjectFactoryContext).mockResolvedValue({
      projectId: "project-001",
      briefVersion: 3,
      planVersion: 7,
      contextReferences: ["project-brief-version:3", "project-plan-version:7"],
      contextInstructions: ["Verified client brief.", "Verified approved scope."],
      recommendedAgentIds: ["analyste-metier"],
      recommendationReasons: { "analyste-metier": ["Need analysis."] },
    });
    vi.mocked(executeConfiguredAgentFactoryWorkflow).mockResolvedValue({
      workflow: {} as never,
      state: "ready_for_human_review",
      executionStarted: true,
      phaseResults: [],
      gateResults: [],
      invocations: [],
      completedResults: [],
      blockedAgentIds: [],
    });
  });

  afterEach(() => vi.clearAllMocks());

  it("loads verified project context and passes it into the guarded provider executor", async () => {
    const result = await executeProjectFactoryWorkflow({
      projectId: "project-001",
      workflowId: "factory-project-01",
      agentIds: ["analyste-metier"],
      accessToken: "server-session-token",
      env: { MERKORA_AGENT_RUNTIME_ENABLED: "false" },
      connections: [],
      modelAliases: {},
      timeoutMs: 10_000,
      authorizeWorkflowStart: async () => true,
      authorizeAgent: async () => true,
      authorizeExternalProcessing: async () => false,
      reserveBudget: async () => false,
      checkHumanGate: async () => false,
    });

    expect(loadProjectFactoryContext).toHaveBeenCalledWith("project-001", "server-session-token");
    expect(executeConfiguredAgentFactoryWorkflow).toHaveBeenCalledWith(expect.objectContaining({
      projectId: "project-001",
      contextReferences: ["project-brief-version:3", "project-plan-version:7"],
      projectContextInstructions: ["Verified client brief.", "Verified approved scope."],
      env: { MERKORA_AGENT_RUNTIME_ENABLED: "false" },
    }));
    expect(result.sourceVersions).toEqual({ briefVersion: 3, planVersion: 7 });
    expect(result.state).toBe("ready_for_human_review");
  });
});
