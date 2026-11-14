import { describe, expect, it } from "vitest";
import { AGENT_CATALOG } from "./agent-catalog";
import { planAgentFactoryWorkflow } from "./agent-factory-workflow";

describe("MerKora end-to-end multi-pole factory workflow", () => {
  it("coordinates all seven poles and all 35 specialists in lifecycle order", () => {
    const workflow = planAgentFactoryWorkflow({
      projectId: "project-001",
      workflowId: "factory-001",
      agentIds: AGENT_CATALOG.map((agent) => agent.id),
    });

    expect(workflow.poles).toHaveLength(7);
    expect(workflow.poles.map((pole) => pole.poleId)).toEqual([
      "intelligence",
      "conception",
      "fabrication",
      "controle",
      "exploitation",
      "relation_client",
      "gestion_administration",
    ]);
    expect(workflow.missionPlan.steps).toHaveLength(35);
    expect(workflow.phases.find((phase) => phase.id === "production-release")?.agentIds)
      .toContain("gestionnaire-des-deploiements");
    expect(workflow.phases.find((phase) => phase.id === "exploitation-preparation")?.agentIds)
      .toContain("devops");
    expect(workflow.phases.find((phase) => phase.id === "post-delivery-support")?.agentIds)
      .toEqual(["support-apres-livraison"]);
    expect(new Set(workflow.missionPlan.steps.map((step) => step.agentId)).size).toBe(35);
    expect(workflow.phases.map((phase) => phase.id)).toEqual([
      "intelligence",
      "conception",
      "governance-before-build",
      "fabrication",
      "controle",
      "governance-before-release",
      "exploitation-preparation",
      "production-release",
      "relation-client",
      "post-delivery-support",
    ]);
  });

  it("creates phase barriers so downstream work depends on every selected mission in the prior phase", () => {
    const workflow = planAgentFactoryWorkflow({
      projectId: "project-001",
      workflowId: "factory-002",
      agentIds: [
        "analyste-metier",
        "analyste-des-besoins",
        "architecte-logiciel",
        "ux-ui-designer",
        "preparation-des-devis",
        "developpeur-frontend",
        "testeur-logiciel",
      ],
    });

    const byAgent = new Map(workflow.missionPlan.steps.map((step) => [step.agentId, step]));
    const design = byAgent.get("architecte-logiciel");
    const designPeer = byAgent.get("ux-ui-designer");
    const quote = byAgent.get("preparation-des-devis");
    const build = byAgent.get("developpeur-frontend");
    const test = byAgent.get("testeur-logiciel");

    expect(design?.dependsOn).toEqual(["factory-002-analyste-metier", "factory-002-analyste-des-besoins"]);
    expect(designPeer?.dependsOn).toEqual(design?.dependsOn);
    expect(quote?.dependsOn).toEqual(["factory-002-architecte-logiciel", "factory-002-ux-ui-designer"]);
    expect(build?.dependsOn).toEqual(["factory-002-preparation-des-devis"]);
    expect(test?.dependsOn).toEqual(["factory-002-developpeur-frontend"]);
  });

  it("does not invent omitted specialists and marks unsupported specialists for dedicated runtime work", () => {
    const workflow = planAgentFactoryWorkflow({
      projectId: "project-001",
      workflowId: "factory-003",
      agentIds: ["analyste-metier", "ux-ui-designer", "devops"],
    });

    expect(workflow.missionPlan.steps.map((step) => step.agentId)).toEqual([
      "analyste-metier", "ux-ui-designer", "devops",
    ]);
    expect(workflow.assignments.map((item) => item.status)).toEqual([
      "prepared",
      "requires_specialized_runtime",
      "requires_specialized_runtime",
    ]);
    expect(workflow.assignments[1]?.reason).toBe("NO_COMPATIBLE_EXISTING_RUNTIME_ROLE");
  });

  it("keeps human approval gates explicit and never activates execution or tools", () => {
    const workflow = planAgentFactoryWorkflow({
      projectId: "project-001",
      workflowId: "factory-004",
      agentIds: ["analyste-metier", "architecte-logiciel", "developpeur-backend"],
    });

    expect(workflow.executionEnabled).toBe(false);
    expect(workflow.missionPlan.executionEnabled).toBe(false);
    expect(workflow.missionPlan.steps.every((step) => step.execution === "not_started")).toBe(true);
    expect(workflow.missionPlan.steps.every((step) => step.toolPermissions.length === 0)).toBe(true);
    expect(workflow.humanGates.map((gate) => gate.id)).toEqual([
      "client-scope-validation",
      "administrative-review",
      "execution-authorization",
      "quality-acceptance",
      "production-release-authorization",
      "delivery-acceptance",
    ]);
    expect(workflow.humanGates.every((gate) => gate.status === "not_evaluated")).toBe(true);
  });

  it("rejects empty, unknown, duplicated and malformed selections", () => {
    expect(() => planAgentFactoryWorkflow({
      projectId: "project-001",
      workflowId: "factory-005",
      agentIds: [],
    })).toThrow("Sélection d'agents vide");

    expect(() => planAgentFactoryWorkflow({
      projectId: "project-001",
      workflowId: "factory-006",
      agentIds: ["unknown-agent"],
    })).toThrow("Agent inconnu : unknown-agent");

    expect(() => planAgentFactoryWorkflow({
      projectId: "project-001",
      workflowId: "factory-007",
      agentIds: ["analyste-metier", "analyste-metier"],
    })).not.toThrow();

    expect(() => planAgentFactoryWorkflow({
      projectId: "project-001",
      workflowId: "INVALID ID",
      agentIds: ["analyste-metier"],
    })).toThrow("Identifiant de workflow invalide");
  });
});
