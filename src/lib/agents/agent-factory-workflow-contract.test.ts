import { describe, expect, it } from "vitest";
import { AGENT_CATALOG, AGENT_POLES } from "./agent-catalog";
import { planAgentFactoryWorkflow } from "./agent-factory-workflow";

describe("complete MerKora factory workflow contract", () => {
  it("places all 35 specialists exactly once across the ten ordered lifecycle phases", () => {
    const workflow = planAgentFactoryWorkflow({
      projectId: "project-001",
      workflowId: "factory-contract-01",
      agentIds: AGENT_CATALOG.map((agent) => agent.id),
      contextReferences: ["project-plan-version:4"],
      contextInstructions: ["Dossier client vérifié.", "Périmètre approuvé."],
    });

    const phaseAgentIds = workflow.phases.flatMap((phase) => phase.agentIds);
    expect(AGENT_POLES).toHaveLength(7);
    expect(AGENT_CATALOG).toHaveLength(35);
    expect(workflow.phases).toHaveLength(10);
    expect(phaseAgentIds).toHaveLength(35);
    expect(new Set(phaseAgentIds).size).toBe(35);
    expect(new Set(phaseAgentIds)).toEqual(new Set(AGENT_CATALOG.map((agent) => agent.id)));
    expect(workflow.missionPlan.steps).toHaveLength(35);
    expect(workflow.status).toBe("planned");
    expect(workflow.executionEnabled).toBe(false);
    expect(workflow.humanGates.every((gate) => gate.status === "not_evaluated")).toBe(true);
  });

  it("keeps the sixteen compatible generic-role adapters separate from nineteen specialized runtimes", () => {
    const workflow = planAgentFactoryWorkflow({
      projectId: "project-001",
      workflowId: "factory-runtime-coverage",
      agentIds: AGENT_CATALOG.map((agent) => agent.id),
    });

    expect(workflow.assignments.filter((assignment) => assignment.status === "prepared")).toHaveLength(16);
    expect(workflow.assignments.filter((assignment) => assignment.status === "requires_specialized_runtime")).toHaveLength(19);
    expect(workflow.assignments.every((assignment) => assignment.status !== "prepared" || !assignment.reason)).toBe(true);
  });

  it("orders every dependency before the mission that depends on it", () => {
    const workflow = planAgentFactoryWorkflow({
      projectId: "project-001",
      workflowId: "factory-dependency-order",
      agentIds: AGENT_CATALOG.map((agent) => agent.id),
    });
    const position = new Map(workflow.executionOrder.map((missionId, index) => [missionId, index]));

    for (const step of workflow.missionPlan.steps) {
      for (const dependencyId of step.dependsOn) {
        expect(position.get(dependencyId)).toBeLessThan(position.get(step.missionId) ?? -1);
      }
    }
  });
});
