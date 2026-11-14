import { describe, expect, it } from "vitest";
import { planAgentFactoryWorkflow } from "@/lib/agents/agent-factory-workflow";
import { bridgeWorkflowToDurableFactoryTasks } from "./factory-task-mission-bridge";

describe("bridgeWorkflowToDurableFactoryTasks", () => {
  it("maps compatible missions onto the five existing durable task keys", () => {
    const workflow = planAgentFactoryWorkflow({
      projectId: "project-123",
      workflowId: "demo",
      agentIds: ["analyste-metier", "architecte-logiciel", "developpeur-backend", "testeur-logiciel", "agent-de-correction"],
    });

    const bridge = bridgeWorkflowToDurableFactoryTasks(workflow);

    expect(bridge.status).toBe("prepared");
    expect(bridge.executionEnabled).toBe(false);
    expect(bridge.stages.find((stage) => stage.taskKey === "prepare_specification")?.agentIds)
      .toEqual(["analyste-metier", "architecte-logiciel"]);
    expect(bridge.stages.find((stage) => stage.taskKey === "generate_application")?.agentIds)
      .toEqual(["developpeur-backend"]);
    expect(bridge.stages.find((stage) => stage.taskKey === "run_quality_checks")?.agentIds)
      .toEqual(["testeur-logiciel"]);
    expect(bridge.stages.find((stage) => stage.taskKey === "repair_and_retest")?.agentIds)
      .toEqual(["agent-de-correction"]);
    expect(bridge.stages.find((stage) => stage.taskKey === "human_delivery_review")?.agentIds).toEqual([]);
  });

  it("does not force production, operations, client support or administration into an unrelated task", () => {
    const workflow = planAgentFactoryWorkflow({
      projectId: "project-123",
      workflowId: "demo",
      agentIds: ["gestionnaire-des-deploiements", "support-apres-livraison", "devops"],
    });

    const bridge = bridgeWorkflowToDurableFactoryTasks(workflow);

    expect(bridge.status).toBe("requires_specialized_task_runtime");
    expect(bridge.executionEnabled).toBe(false);
    expect(bridge.unsupported.map((item) => item.agentIds)).toEqual([
      ["devops"],
      ["gestionnaire-des-deploiements"],
      ["support-apres-livraison"],
    ]);
  });

  it("rejects an execution-enabled workflow", () => {
    const workflow = planAgentFactoryWorkflow({
      projectId: "project-123",
      workflowId: "demo",
      agentIds: ["analyste-metier"],
    });

    expect(() => bridgeWorkflowToDurableFactoryTasks({
      ...workflow,
      executionEnabled: true,
    } as unknown as typeof workflow)).toThrow("Le pont de tâches ne peut accepter qu'un workflow non activé.");
  });
});
