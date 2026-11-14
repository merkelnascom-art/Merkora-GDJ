import { describe, expect, it } from "vitest";
import { recommendAgentsForProjectPlan } from "./agent-recommendation";

describe("MerKora Core specialist recommendations", () => {
  it("recommends a coherent team from the approved project task types", () => {
    const result = recommendAgentsForProjectPlan({
      domainId: "education-formation",
      summary: "Plateforme de gestion d'un centre de formation.",
      tasks: [
        { kind: "analysis" },
        { kind: "scope" },
        { kind: "design" },
        { kind: "implementation" },
        { kind: "verification" },
        { kind: "handover" },
      ],
      includedScope: [
        { id: "registration", title: "Inscriptions", description: "Dossiers et statuts des apprenants" },
      ],
    });

    expect(result.agentIds).toContain("analyste-metier");
    expect(result.agentIds).toContain("expert-sectoriel");
    expect(result.agentIds).toContain("architecte-logiciel");
    expect(result.agentIds).toContain("ux-ui-designer");
    expect(result.agentIds).toContain("developpeur-backend");
    expect(result.agentIds).toContain("testeur-logiciel");
    expect(result.agentIds).toContain("documentation");
    expect(result.agentIds).toContain("expert-securite");
    expect(result.agentIds).toContain("preparation-des-devis");
    expect(result.agentIds).not.toContain("gestionnaire-des-deploiements");
    expect(result.reasons["expert-securite"]?.length).toBeGreaterThan(0);
  });

  it("does not recommend software developers for a purely creative production plan", () => {
    const result = recommendAgentsForProjectPlan({
      domainId: "voyage-tourisme-creation-jeux",
      summary: "Création d'une affiche et d'un dossier de présentation.",
      tasks: [{ kind: "analysis" }, { kind: "production" }, { kind: "verification" }, { kind: "handover" }],
      includedScope: [{ id: "poster", title: "Affiche", description: "Support imprimable" }],
    });

    expect(result.agentIds).toContain("product-designer");
    expect(result.agentIds).toContain("generateur-de-fichiers");
    expect(result.agentIds).not.toContain("developpeur-frontend");
    expect(result.agentIds).not.toContain("developpeur-backend");
  });

  it("adds operations and deployment specialists only when the approved scope explicitly requests them", () => {
    const withoutOperations = recommendAgentsForProjectPlan({
      domainId: "digital",
      tasks: [{ kind: "implementation" }, { kind: "verification" }],
      includedScope: [{ id: "app", title: "Application", description: "Application interne" }],
    });
    expect(withoutOperations.agentIds).not.toContain("devops");
    expect(withoutOperations.agentIds).not.toContain("gestionnaire-des-deploiements");

    const withOperations = recommendAgentsForProjectPlan({
      domainId: "digital",
      tasks: [{ kind: "implementation" }, { kind: "verification" }],
      includedScope: [{
        id: "hosting",
        title: "Hébergement et mise en production",
        description: "Déploiement en production, supervision et maintenance continue",
      }],
    });
    expect(withOperations.agentIds).toContain("devops");
    expect(withOperations.agentIds).toContain("supervision");
    expect(withOperations.agentIds).toContain("maintenance");
    expect(withOperations.agentIds).toContain("gestionnaire-des-deploiements");
    expect(withOperations.agentIds).toContain("support-apres-livraison");
  });

  it("returns recommendations in the canonical catalog order without duplicates", () => {
    const result = recommendAgentsForProjectPlan({
      domainId: null,
      tasks: [
        { kind: "analysis" }, { kind: "analysis" }, { kind: "design" },
        { kind: "implementation" }, { kind: "verification" },
      ],
      includedScope: [],
    });

    expect(new Set(result.agentIds).size).toBe(result.agentIds.length);
    expect(result.agentIds).toEqual([...result.agentIds].sort((a, b) => {
      const order = ["analyste-metier", "analyste-des-besoins"];
      return order.indexOf(a) - order.indexOf(b);
    }).filter((id) => id !== undefined));
  });
});
