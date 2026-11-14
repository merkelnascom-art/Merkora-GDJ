import { describe, expect, it } from "vitest";
import { resolveAgentSelection } from "./agent-selection";

describe("explicit MerKora agent selection", () => {
  it("selects only explicitly requested specialists and preserves their identities", () => {
    const result = resolveAgentSelection([
      "analyste-metier",
      "expert-sectoriel",
      "ux-ui-designer",
    ]);

    expect(result.agents.map((agent) => agent.id)).toEqual([
      "analyste-metier",
      "expert-sectoriel",
      "ux-ui-designer",
    ]);
    expect(result.agents[0]?.name).toBe("Analyste métier");
    expect(result.agents[1]?.name).toBe("Expert sectoriel");
    expect(result.agents[2]?.name).toBe("UX/UI designer");
  });

  it("deduplicates repeated identifiers without changing the first-request order", () => {
    const result = resolveAgentSelection([
      "testeur-logiciel",
      "auditeur-de-code",
      "testeur-logiciel",
    ]);

    expect(result.agents.map((agent) => agent.id)).toEqual([
      "testeur-logiciel",
      "auditeur-de-code",
    ]);
    expect(result.duplicateAgentIds).toEqual(["testeur-logiciel"]);
  });

  it("groups selected specialists in the validated organigram order", () => {
    const result = resolveAgentSelection([
      "support-apres-livraison",
      "analyste-metier",
      "preparation-des-devis",
      "developpeur-backend",
    ]);

    expect(result.byPole.map((group) => group.poleId)).toEqual([
      "intelligence",
      "fabrication",
      "relation_client",
      "gestion_administration",
    ]);
    expect(result.byPole[0]?.agents.map((agent) => agent.id)).toEqual(["analyste-metier"]);
  });

  it("returns an empty selection instead of activating agents implicitly", () => {
    const result = resolveAgentSelection([]);
    expect(result.agents).toEqual([]);
    expect(result.byPole).toEqual([]);
  });

  it("rejects unknown, empty, malformed and oversized requests", () => {
    expect(() => resolveAgentSelection(["agent-absent"])).toThrow("Agent inconnu : agent-absent");
    expect(() => resolveAgentSelection([" "])).toThrow("Identifiant d'agent invalide.");
    expect(() => resolveAgentSelection([null as unknown as string])).toThrow("Identifiant d'agent invalide.");
    expect(() => resolveAgentSelection(Array.from({ length: 36 }, () => "analyste-metier")))
      .toThrow("La sélection dépasse les 35 agents du catalogue.");
  });
});
