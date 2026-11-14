import { describe, expect, it } from "vitest";
import { planAgentFactoryWorkflow } from "./agent-factory-workflow";

describe("MerKora factory approval gates", () => {
  it("requires production authorization only for a selected production-release phase", () => {
    const workflow = planAgentFactoryWorkflow({
      projectId: "project-001",
      workflowId: "gates-build-only",
      agentIds: ["developpeur-backend"],
    });

    expect(workflow.phases.find((phase) => phase.id === "production-release")?.status)
      .toBe("not_selected");
    expect(workflow.humanGates.find((gate) => gate.id === "production-release-authorization")?.requiredFor)
      .toEqual(["production-release"]);
  });

  it("places client scope, fabrication, quality, release and delivery gates at distinct lifecycle boundaries", () => {
    const workflow = planAgentFactoryWorkflow({
      projectId: "project-001",
      workflowId: "gates-full",
      agentIds: [
        "analyste-metier",
        "architecte-logiciel",
        "preparation-des-devis",
        "developpeur-backend",
        "testeur-logiciel",
        "validation-administrative",
        "devops",
        "gestionnaire-des-deploiements",
        "documentation",
        "support-apres-livraison",
      ],
    });

    const gate = (id: string) => workflow.humanGates.find((item) => item.id === id);
    expect(gate("client-scope-validation")?.blocksPhase).toBe("fabrication");
    expect(gate("administrative-review")?.blocksPhase).toBe("fabrication");
    expect(gate("execution-authorization")?.blocksPhase).toBe("fabrication");
    expect(gate("quality-acceptance")?.blocksPhase).toBe("governance-before-release");
    expect(gate("production-release-authorization")?.blocksPhase).toBe("production-release");
    expect(gate("delivery-acceptance")?.blocksPhase).toBe("post-delivery-support");
  });

  it("keeps preparation, production release, client handover and post-delivery support separate", () => {
    const workflow = planAgentFactoryWorkflow({
      projectId: "project-001",
      workflowId: "gates-phases",
      agentIds: [
        "devops",
        "gestionnaire-des-deploiements",
        "documentation",
        "support-apres-livraison",
      ],
    });

    expect(workflow.phases.find((phase) => phase.id === "exploitation-preparation")?.agentIds)
      .toEqual(["devops"]);
    expect(workflow.phases.find((phase) => phase.id === "production-release")?.agentIds)
      .toEqual(["gestionnaire-des-deploiements"]);
    expect(workflow.phases.find((phase) => phase.id === "relation-client")?.agentIds)
      .toEqual(["documentation"]);
    expect(workflow.phases.find((phase) => phase.id === "post-delivery-support")?.agentIds)
      .toEqual(["support-apres-livraison"]);
  });
});
