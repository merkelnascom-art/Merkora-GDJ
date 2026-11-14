import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./project-factory-context", () => ({ loadProjectFactoryContext: vi.fn() }));
vi.mock("./agent-factory-executor", () => ({ executeConfiguredAgentFactoryWorkflow: vi.fn() }));
vi.mock("./project-factory-authorization.server", () => ({ loadProjectFactoryApprovalState: vi.fn() }));

import { loadProjectFactoryContext } from "./project-factory-context";
import { executeConfiguredAgentFactoryWorkflow } from "./agent-factory-executor";
import { loadProjectFactoryApprovalState } from "./project-factory-authorization.server";
import type { ProjectFactoryApprovalState } from "./project-factory-authorization";
import type { FactoryHumanGate } from "../../agents/agent-factory-workflow";
import { executeProjectFactoryWorkflow } from "./project-factory-executor";

const approvedState: ProjectFactoryApprovalState = {
  authorized: true,
  hasClientAiConsent: true,
  approvedKinds: ["client_scope", "admin_review", "execution_authorization"],
  missingApprovals: [],
};

describe("executeProjectFactoryWorkflow", () => {
  beforeEach(() => {
    vi.mocked(loadProjectFactoryContext).mockResolvedValue({
      projectId: "project-001",
      briefVersion: 3,
      planVersion: 7,
      planDigest: "a".repeat(64),
      scopeDigest: "b".repeat(64),
      contextReferences: ["project-brief-version:3", "project-plan-version:7"],
      contextInstructions: ["Verified client brief.", "Verified approved scope."],
      recommendedAgentIds: ["analyste-metier"],
      recommendationReasons: { "analyste-metier": ["Need analysis."] },
    });
    vi.mocked(loadProjectFactoryApprovalState).mockResolvedValue(approvedState);
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

  it("loads verified project context and exact approval state before calling the guarded provider executor", async () => {
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
      authorizeExternalProcessing: async () => true,
      reserveBudget: async () => true,
      checkHumanGate: async () => true,
    });

    expect(loadProjectFactoryContext).toHaveBeenCalledWith("project-001", "server-session-token");
    expect(loadProjectFactoryApprovalState).toHaveBeenCalledWith({
      projectId: "project-001",
      accessToken: "server-session-token",
      planVersion: 7,
      planDigest: "a".repeat(64),
      scopeDigest: "b".repeat(64),
    });
    expect(executeConfiguredAgentFactoryWorkflow).toHaveBeenCalledWith(expect.objectContaining({
      projectId: "project-001",
      contextReferences: ["project-brief-version:3", "project-plan-version:7"],
      projectContextInstructions: ["Verified client brief.", "Verified approved scope."],
      env: { MERKORA_AGENT_RUNTIME_ENABLED: "false" },
    }));
    expect(result.sourceVersions).toEqual({ briefVersion: 3, planVersion: 7 });
    expect(result.state).toBe("ready_for_human_review");
  });

  it("does not allow a caller callback to bypass missing exact project approvals or AI consent", async () => {
    vi.mocked(loadProjectFactoryApprovalState).mockResolvedValue({
      authorized: false,
      hasClientAiConsent: false,
      approvedKinds: [],
      missingApprovals: ["client_scope", "admin_review", "execution_authorization"],
    });
    const authorizeWorkflowStart = vi.fn(async () => true);
    const authorizeExternalProcessing = vi.fn(async () => true);
    const checkHumanGate = vi.fn(async () => true);

    await executeProjectFactoryWorkflow({
      projectId: "project-001",
      workflowId: "factory-project-02",
      agentIds: ["analyste-metier", "developpeur-backend"],
      accessToken: "server-session-token",
      env: { MERKORA_AGENT_RUNTIME_ENABLED: "false" },
      connections: [],
      modelAliases: {},
      timeoutMs: 10_000,
      authorizeWorkflowStart,
      authorizeAgent: async () => true,
      authorizeExternalProcessing,
      reserveBudget: async () => true,
      checkHumanGate,
    });

    const policy = vi.mocked(executeConfiguredAgentFactoryWorkflow).mock.calls[0]?.[0];
    expect(policy).toBeDefined();
    expect(await policy!.authorizeWorkflowStart({ projectId: "project-001", workflowId: "factory-project-02" })).toBe(false);
    expect(await policy!.authorizeExternalProcessing({
      projectId: "project-001",
      workflowId: "factory-project-02",
      agentId: "analyste-metier",
      providerId: "openai",
      connectionId: "org-openai",
      connectionOwner: { type: "organization", id: "merkora-org" },
    })).toBe(false);
    expect(await policy!.checkHumanGate({
      projectId: "project-001",
      workflowId: "factory-project-02",
      gate: { id: "client-scope-validation" } as FactoryHumanGate,
    })).toBe(false);
    expect(authorizeWorkflowStart).not.toHaveBeenCalled();
    expect(authorizeExternalProcessing).not.toHaveBeenCalled();
    expect(checkHumanGate).not.toHaveBeenCalled();
  });

  it("keeps quality, release and delivery gates blocked until their own approval records exist", async () => {
    const checkHumanGate = vi.fn(async () => true);
    await executeProjectFactoryWorkflow({
      projectId: "project-001",
      workflowId: "factory-project-03",
      agentIds: ["testeur-logiciel"],
      accessToken: "server-session-token",
      env: { MERKORA_AGENT_RUNTIME_ENABLED: "false" },
      connections: [],
      modelAliases: {},
      timeoutMs: 10_000,
      authorizeWorkflowStart: async () => true,
      authorizeAgent: async () => true,
      authorizeExternalProcessing: async () => true,
      reserveBudget: async () => true,
      checkHumanGate,
    });

    const policy = vi.mocked(executeConfiguredAgentFactoryWorkflow).mock.calls[0]?.[0];
    expect(await policy!.checkHumanGate({
      projectId: "project-001",
      workflowId: "factory-project-03",
      gate: { id: "quality-acceptance" } as FactoryHumanGate,
    })).toBe(false);
    expect(checkHumanGate).not.toHaveBeenCalled();
  });
});
