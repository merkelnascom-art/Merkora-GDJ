import { describe, expect, it } from "vitest";
import { buildVisualPrototypeModel } from "./visual-prototype";
import type { SolutionProposal } from "./solution-proposal";
import type { ProductDefinitionSession } from "./product-definition";
import type { ProjectUnderstanding } from "./project-diagnostic";

const proposal = (components: SolutionProposal["components"]): SolutionProposal => ({
  id: "solution-1", projectId: "p1", title: "Gestion Asho Sweet",
  description: "Organiser les commandes", problem: "Suivi dispersé", objective: "Mieux suivre les ventes",
  operatingPrinciple: "Centraliser les opérations", architectures: [], components,
  coherenceNotes: [], unresolvedPoints: [], version: 2, updatedAt: "2026-11-17",
});

const component = (id: string, title: string, familyId: string, status: "accepted" | "modified" | "suggested" | "rejected" = "accepted") => ({
  id, title, description: "", familyId, status, source: "validated_definition" as const, sourceIds: [],
});

const definition = (answers: ProductDefinitionSession["answers"] = []): ProductDefinitionSession => ({
  id: "d1", projectId: "p1", understandingId: "u1", version: 2, answers,
  askedQuestionIds: [], deferredQuestionIds: [], status: "ready_for_review",
  createdAt: "", updatedAt: "",
});

const dossier = (description: string): ProjectUnderstanding => ({
  id: "u1", projectId: "p1", originalDescription: description,
  items: [], situationGraph: { entities: [], relations: [], unresolvedRelations: [] },
  contradictions: [], unresolvedQuestions: [], privacyConsiderations: [],
} as unknown as ProjectUnderstanding);

describe("screen 07 visual prototype model", () => {
  it("builds a navigable digital prototype only from retained components", () => {
    const model = buildVisualPrototypeModel(
      dossier("Je veux une plateforme web pour ma pâtisserie"),
      definition(),
      proposal([
        component("a", "Gestion des commandes", "functionalities"),
        component("b", "Espace client", "users_roles"),
        component("c", "Paiement mobile", "integrations_equipment", "suggested"),
        component("d", "Ancienne fonction", "functionalities", "rejected"),
      ]),
    );
    expect(model.mode).toBe("digital");
    expect(model.components.map((item) => item.title)).toEqual(["Gestion des commandes", "Espace client"]);
    expect(model.navigation.length).toBeGreaterThan(0);
  });

  it("creates an operational visual when the project is not a digital product", () => {
    const model = buildVisualPrototypeModel(
      dossier("Je veux organiser une exploitation agricole avec des équipes et des parcelles"),
      definition(),
      proposal([component("a", "Préparation des parcelles", "functionalities")]),
    );
    expect(model.mode).toBe("operational");
    expect(model.navigation).toContain("Déroulement");
  });

  it("does not invent a user profile when none was validated", () => {
    const model = buildVisualPrototypeModel(dossier("Projet de service"), definition(), proposal([]));
    expect(model.profiles).toEqual([]);
  });
});
