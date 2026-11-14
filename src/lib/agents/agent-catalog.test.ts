import { describe, expect, it } from "vitest";
import {
  AGENT_CATALOG,
  AGENT_POLES,
  MERKORA_CORE,
  getAgentDefinition,
  getAgentsForPole,
  type AgentPoleId,
} from "./agent-catalog";

describe("MerKora multi-agent organization catalog", () => {
  it("keeps MerKora Core as the unique root above the seven validated poles", () => {
    expect(MERKORA_CORE.name).toBe("MERKORA CORE");
    expect(MERKORA_CORE.role).toBe("Orchestrateur central");
    expect(AGENT_POLES.map((pole) => pole.name)).toEqual([
      "Pôle 1 — Intelligence",
      "Pôle 2 — Conception",
      "Pôle 3 — Fabrication",
      "Pôle 4 — Contrôle",
      "Pôle 5 — Exploitation",
      "Pôle 6 — Relation client",
      "Pôle transversal — Gestion et administration",
    ]);
  });

  it("preserves the exact five-agent composition and order of every pole", () => {
    const expected: Record<AgentPoleId, string[]> = {
      intelligence: [
        "Analyste métier",
        "Chercheur documentaire",
        "Expert sectoriel",
        "Analyste des besoins",
        "Détecteur de contradictions",
      ],
      conception: [
        "Architecte logiciel",
        "Product designer",
        "UX/UI designer",
        "Expert fonctionnel",
        "Rédacteur technique",
      ],
      fabrication: [
        "Développeur frontend",
        "Développeur backend",
        "Expert base de données",
        "Intégrateur API",
        "Générateur de fichiers",
      ],
      controle: [
        "Testeur logiciel",
        "Auditeur de code",
        "Expert sécurité",
        "Détecteur d'erreurs",
        "Agent de correction",
      ],
      exploitation: [
        "DevOps",
        "Gestionnaire des déploiements",
        "Supervision",
        "Maintenance",
        "Gestion des incidents",
      ],
      relation_client: [
        "Assistant client",
        "Suivi des demandes",
        "Documentation",
        "Formation",
        "Support après livraison",
      ],
      gestion_administration: [
        "Estimation des ressources et des coûts",
        "Préparation des devis",
        "Suivi des budgets",
        "Validation administrative",
        "Gestion des autorisations",
      ],
    };

    for (const pole of AGENT_POLES) {
      expect(pole.agents.map((agent) => agent.name)).toEqual(expected[pole.id]);
      expect(pole.agents).toHaveLength(5);
    }
    expect(AGENT_CATALOG).toHaveLength(35);
  });

  it("provides stable unique identifiers and an explicit catalog-only status", () => {
    const ids = AGENT_CATALOG.map((agent) => agent.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every((id) => /^[a-z][a-z0-9-]*$/.test(id))).toBe(true);
    expect(AGENT_CATALOG.every((agent) => agent.implementationStatus === "catalog_only")).toBe(true);
  });

  it("defines a bounded work contract for every specialized agent", () => {
    for (const agent of AGENT_CATALOG) {
      expect(agent.mission.trim()).not.toBe("");
      expect(agent.responsibilities.length).toBeGreaterThan(0);
      expect(agent.activationTriggers.length).toBeGreaterThan(0);
      expect(agent.inputs.length).toBeGreaterThan(0);
      expect(agent.outputs.length).toBeGreaterThan(0);
      expect(agent.suggestedToolDomains.length).toBeGreaterThan(0);
      expect(agent.permissionBoundaries.length).toBeGreaterThan(0);
      expect(agent.acceptanceCriteria.length).toBeGreaterThan(0);
      expect(agent.verificationMethods.length).toBeGreaterThan(0);
      expect(agent.failureHandling.length).toBeGreaterThan(0);
    }
  });

  it("retrieves agents without merging the identities of different specialists", () => {
    const métier = getAgentDefinition("analyste-metier");
    const needs = getAgentDefinition("analyste-des-besoins");

    expect(métier?.name).toBe("Analyste métier");
    expect(needs?.name).toBe("Analyste des besoins");
    expect(métier?.id).not.toBe(needs?.id);
    expect(getAgentDefinition("agent-inconnu")).toBeUndefined();
  });

  it("returns only agents belonging to the requested pole", () => {
    const agents = getAgentsForPole("controle");
    expect(agents).toHaveLength(5);
    expect(agents.every((agent) => agent.poleId === "controle")).toBe(true);
    expect(getAgentsForPole("relation_client").map((agent) => agent.name)).toContain("Support après livraison");
  });
});
