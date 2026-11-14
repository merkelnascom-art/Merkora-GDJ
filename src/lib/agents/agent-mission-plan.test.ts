import { describe, expect, it } from "vitest";
import { createAgentMissionPlan } from "./agent-mission-plan";

describe("explicit multi-agent mission planning", () => {
  it("orders missions by dependencies without inventing agents or work", () => {
    const plan = createAgentMissionPlan([
      { missionId: "build-ui", agentId: "developpeur-frontend", dependsOn: ["design"] },
      { missionId: "design", agentId: "ux-ui-designer", dependsOn: ["needs"] },
      { missionId: "needs", agentId: "analyste-des-besoins", dependsOn: [] },
      { missionId: "audit", agentId: "auditeur-de-code", dependsOn: ["build-ui"] },
    ]);

    expect(plan.steps.map((step) => step.missionId)).toEqual([
      "needs", "design", "build-ui", "audit",
    ]);
    expect(plan.steps.map((step) => step.agentId)).toEqual([
      "analyste-des-besoins", "ux-ui-designer", "developpeur-frontend", "auditeur-de-code",
    ]);
    expect(plan.steps.every((step) => step.execution === "not_started")).toBe(true);
    expect(plan.steps.every((step) => step.toolPermissions.length === 0)).toBe(true);
  });

  it("keeps independent missions in their original request order", () => {
    const plan = createAgentMissionPlan([
      { missionId: "support", agentId: "assistant-client", dependsOn: [] },
      { missionId: "budget", agentId: "suivi-des-budgets", dependsOn: [] },
    ]);

    expect(plan.steps.map((step) => step.missionId)).toEqual(["support", "budget"]);
  });

  it("rejects duplicate mission identifiers and unknown specialists", () => {
    expect(() => createAgentMissionPlan([
      { missionId: "same", agentId: "analyste-metier", dependsOn: [] },
      { missionId: "same", agentId: "analyste-des-besoins", dependsOn: [] },
    ])).toThrow("Identifiant de mission dupliqué : same");

    expect(() => createAgentMissionPlan([
      { missionId: "unknown", agentId: "agent-inconnu", dependsOn: [] },
    ])).toThrow("Agent inconnu : agent-inconnu");
  });

  it("rejects missing dependencies, self-dependencies and cycles", () => {
    expect(() => createAgentMissionPlan([
      { missionId: "a", agentId: "analyste-metier", dependsOn: ["missing"] },
    ])).toThrow("Dépendance inconnue : missing");

    expect(() => createAgentMissionPlan([
      { missionId: "a", agentId: "analyste-metier", dependsOn: ["a"] },
    ])).toThrow("Une mission ne peut pas dépendre d'elle-même : a");

    expect(() => createAgentMissionPlan([
      { missionId: "a", agentId: "analyste-metier", dependsOn: ["b"] },
      { missionId: "b", agentId: "analyste-des-besoins", dependsOn: ["a"] },
    ])).toThrow("Cycle de dépendances détecté");
  });

  it("does not infer omitted agents, activate missions or grant approvals", () => {
    const plan = createAgentMissionPlan([
      { missionId: "analysis", agentId: "analyste-metier", dependsOn: [] },
    ]);

    expect(plan.steps).toHaveLength(1);
    expect(plan.steps[0]?.approvalRequiredFor).toEqual([]);
    expect(plan.steps[0]?.toolPermissions).toEqual([]);
    expect(plan.steps[0]?.execution).toBe("not_started");
  });

  it("rejects malformed and oversized plans", () => {
    expect(() => createAgentMissionPlan([])).toThrow("Le plan doit contenir au moins une mission.");
    expect(() => createAgentMissionPlan([
      { missionId: "bad id", agentId: "analyste-metier", dependsOn: [] },
    ])).toThrow("Identifiant de mission invalide.");

    expect(() => createAgentMissionPlan(Array.from({ length: 101 }, (_, index) => ({
      missionId: `mission-${index}`,
      agentId: "analyste-metier",
      dependsOn: [],
    })))).toThrow("Le plan dépasse la limite de 100 missions.");
  });
});
