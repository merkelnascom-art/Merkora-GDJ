import { describe, expect, it } from "vitest";
import { prepareSpecialistMission } from "./agent-mission-adapter";

describe("specialist mission adapter", () => {
  it("preserves the specialist identity while adapting compatible work to an existing runtime role", () => {
    const result = prepareSpecialistMission({
      agentId: "developpeur-backend",
      missionId: "mission-backend-01",
      projectId: "project-01",
      contextReferences: ["project:spec:v2"],
      approvalRequiredFor: ["database.write"],
    });

    expect(result.status).toBe("prepared");
    if (result.status !== "prepared") return;
    expect(result.agent.id).toBe("developpeur-backend");
    expect(result.agent.poleId).toBe("fabrication");
    expect(result.runtimeRole).toBe("implementer");
    expect(result.mission.missionId).toBe("mission-backend-01");
    expect(result.mission.projectId).toBe("project-01");
    expect(result.mission.role).toBe("implementer");
    expect(result.mission.contextReferences).toContain("agent-catalog:developpeur-backend");
    expect(result.mission.contextReferences).toContain("project:spec:v2");
    expect(result.mission.approvalRequiredFor).toContain("database.write");
    expect(result.mission.instructions.join("\n")).toContain("Développeur backend");
    expect(result.mission.constraints.join("\n")).toContain("Aucune modification de production");
  });


  it("includes bounded project context in the specialist mission packet", () => {
    const result = prepareSpecialistMission({
      agentId: "analyste-metier",
      missionId: "mission-context-01",
      projectId: "project-01",
      contextInstructions: [
        "Activité : centre de formation.",
        "Problème confirmé : le suivi des inscriptions est dispersé.",
        "Résultat attendu : centraliser les inscriptions et les paiements.",
      ],
    });

    expect(result.status).toBe("prepared");
    if (result.status !== "prepared") return;
    expect(result.mission.instructions.join("\\n")).toContain("Activité : centre de formation.");
    expect(result.mission.instructions.join("\\n")).toContain("Résultat attendu : centraliser les inscriptions et les paiements.");
    expect(result.mission.instructions.length).toBeLessThanOrEqual(20);
  });

  it("rejects oversized project context instead of silently truncating it", () => {
    expect(() => prepareSpecialistMission({
      agentId: "analyste-metier",
      missionId: "mission-context-02",
      projectId: "project-01",
      contextInstructions: Array.from({ length: 9 }, (_, index) => `Contexte ${index}`),
    })).toThrow("Le contexte projet dépasse la limite de huit éléments.");
  });

  it("does not force a specialist into an unrelated generic runtime role", () => {
    const result = prepareSpecialistMission({
      agentId: "ux-ui-designer",
      missionId: "mission-design-01",
      projectId: "project-01",
    });

    expect(result).toEqual({
      status: "requires_specialized_runtime",
      agentId: "ux-ui-designer",
      poleId: "conception",
      reason: "NO_COMPATIBLE_EXISTING_RUNTIME_ROLE",
    });
  });

  it("rejects unknown agent identifiers before creating a mission", () => {
    expect(() => prepareSpecialistMission({
      agentId: "unknown-agent",
      missionId: "mission-01",
      projectId: "project-01",
    })).toThrow("Agent inconnu : unknown-agent");
  });

  it("does not silently grant provider tools or infer approvals", () => {
    const result = prepareSpecialistMission({
      agentId: "analyste-metier",
      missionId: "mission-analysis-01",
      projectId: "project-01",
    });

    expect(result.status).toBe("prepared");
    if (result.status !== "prepared") return;
    expect(result.mission.approvalRequiredFor).toEqual([]);
    expect(result.mission.constraints.join("\n")).toContain("ne confèrent aucune permission");
    expect(result.mission.constraints.join("\n")).toContain("Ne prend aucune décision à la place du responsable métier.");
  });
});
