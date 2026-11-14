import { describe, expect, it } from "vitest";
import { AGENT_POLES } from "./agent-catalog";
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
    expect(result.mission.constraints.join("\\n")).toContain("donnée non fiable");
  });

  it("rejects oversized project context instead of silently truncating it", () => {
    expect(() => prepareSpecialistMission({
      agentId: "analyste-metier",
      missionId: "mission-context-02",
      projectId: "project-01",
      contextInstructions: Array.from({ length: 8 }, (_, index) => `Contexte ${index}`),
    })).toThrow("Le contexte projet dépasse la limite de sept éléments.");
  });

  it("prepares all 35 catalog specialists with a purpose-specific model runtime role", () => {
    const agents = AGENT_POLES.flatMap((pole) => pole.agents);
    const prepared = agents.map((agent) => prepareSpecialistMission({
      agentId: agent.id,
      missionId: `mission-${agent.id}`,
      projectId: "project-01",
    }));

    expect(agents).toHaveLength(35);
    expect(prepared.every((item) => item.status === "prepared")).toBe(true);
    expect(prepared.find((item) => item.status === "prepared" && item.agent.id === "ux-ui-designer"))
      .toMatchObject({ status: "prepared", runtimeRole: "designer" });
    expect(prepared.find((item) => item.status === "prepared" && item.agent.id === "preparation-des-devis"))
      .toMatchObject({ status: "prepared", runtimeRole: "estimator" });
    expect(prepared.find((item) => item.status === "prepared" && item.agent.id === "gestion-des-autorisations"))
      .toMatchObject({ status: "prepared", runtimeRole: "governance_advisor" });
    expect(prepared.find((item) => item.status === "prepared" && item.agent.id === "gestionnaire-des-deploiements"))
      .toMatchObject({ status: "prepared", runtimeRole: "operations_planner" });
    expect(prepared.find((item) => item.status === "prepared" && item.agent.id === "assistant-client"))
      .toMatchObject({ status: "prepared", runtimeRole: "customer_success" });
  });

  it("keeps advisory specialists unable to approve, deploy, publish quotes or contact clients", () => {
    const cases = [
      { agentId: "preparation-des-devis", boundary: "ne publie ni n'envoie un devis" },
      { agentId: "gestion-des-autorisations", boundary: "ne donne aucune autorisation et n'approuve aucune action" },
      { agentId: "gestionnaire-des-deploiements", boundary: "Ne déclenche aucun déploiement ni changement de production." },
      { agentId: "assistant-client", boundary: "Ne contacte pas le client et n'envoie aucun message." },
    ];

    for (const item of cases) {
      const result = prepareSpecialistMission({
        agentId: item.agentId,
        missionId: `mission-${item.agentId}`,
        projectId: "project-01",
      });
      expect(result.status).toBe("prepared");
      if (result.status === "prepared") {
        expect(result.mission.constraints.join("\\n")).toContain(item.boundary);
      }
    }
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
