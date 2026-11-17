import { describe, expect, it } from "vitest";
import type { ProductDefinitionSession } from "./product-definition";
import type { ProjectUnderstanding } from "./project-diagnostic";
import type { SolutionProposal } from "./solution-proposal";
import { buildVisualBlueprint } from "./visual-blueprint";

const dossier = (description = "Je veux une plateforme numérique pour un centre de formation."): ProjectUnderstanding => ({
  id: "dossier-1", projectId: "project-1", version: 1, originalDescription: description,
  items: [
    { id: "a1", dimension: "activity", originalDimension: "activity", value: "Centre de formation", status: "user_stated", source: "conversation", sourceQuote: "Centre de formation", createdAt: "2026-11-17" },
    { id: "a2", dimension: "actors", originalDimension: "audience", value: "Apprenants et formateurs", status: "user_stated", source: "conversation", sourceQuote: "Apprenants et formateurs", createdAt: "2026-11-17" },
  ],
  situationGraph: { entities: [], relations: [], unresolvedRelations: [] }, contradictions: [], unresolvedQuestions: [],
  privacyConsiderations: [], activityVocabulary: "open", validationStatus: "validated", sourceSessionVersion: 1,
  createdAt: "2026-11-17", updatedAt: "2026-11-17",
} as ProjectUnderstanding);

const definition = (): ProductDefinitionSession => ({
  id: "def-1", projectId: "project-1", understandingId: "dossier-1", version: 4,
  answers: [{
    id: "roles", questionId: "roles", familyId: "users_roles", value: ["Apprenant", "Formateur"],
    status: "answered", createdAt: "2026-11-17", version: 1,
    question: { id: "roles", familyId: "users_roles", prompt: "Profils ?", purpose: "Définir les profils", answerType: "multi_choice", allowDetail: false, evidenceIds: [] },
  }],
  askedQuestionIds: ["roles"], deferredQuestionIds: [], status: "ready_for_review",
  createdAt: "2026-11-17", updatedAt: "2026-11-17",
});

const proposal = (accepted = true, title = "Inscrire un apprenant", familyId = "functionalities"): SolutionProposal => ({
  id: "solution-project-1", projectId: "project-1", title: "Centre de formation",
  description: "Suivre les apprenants.", problem: "Suivi dispersé.", objective: "Suivre les apprenants.",
  operatingPrinciple: "Organisation centralisée.", architectures: [], components: [
    { id: "c1", title, description: "Fonction à visualiser", status: accepted ? "accepted" : "suggested", source: "validated_definition", familyId, sourceIds: [] },
    { id: "c2", title: "Suivre les présences", description: "Présences", status: "rejected", source: "validated_definition", familyId: "functionalities", sourceIds: [] },
  ],
  coherenceNotes: [], unresolvedPoints: ["Le calendrier reste à préciser."], version: 2, updatedAt: "2026-11-17",
});

describe("screen 07 — adaptive visual blueprint", () => {
  it("builds a navigable digital prototype only from retained components", () => {
    const blueprint = buildVisualBlueprint(dossier(), definition(), proposal());
    expect(blueprint.kind).toBe("digital");
    expect(blueprint.profiles.map((profile) => profile.name)).toEqual(["Apprenant", "Formateur"]);
    expect(blueprint.screens.length).toBeGreaterThan(0);
    expect(blueprint.screens.flatMap((screen) => screen.items.join(" ")).join(" ")).toContain("Inscrire un apprenant");
    expect(blueprint.screens.flatMap((screen) => screen.items.join(" ")).join(" ")).not.toContain("Suivre les présences");
  });

  it("does not present an unvalidated proposal as a designed solution", () => {
    const blueprint = buildVisualBlueprint(dossier(), definition(), proposal(false));
    expect(blueprint.screens.flatMap((screen) => screen.items).join(" ")).not.toContain("Inscrire un apprenant");
    expect(blueprint.pendingItems).toContain("Inscrire un apprenant");
  });

  it("creates an activity-flow representation instead of forcing a digital interface", () => {
    const blueprint = buildVisualBlueprint(dossier("Je veux organiser un service de livraison local."), definition(), proposal());
    expect(blueprint.kind).toBe("operational");
    expect(blueprint.flow.length).toBeGreaterThan(0);
  });

  it("provides contextual demonstration fields and a matching action for an enrollment screen", () => {
    const blueprint = buildVisualBlueprint(dossier(), definition(), proposal());
    expect(blueprint.screens[0].previewFields).toEqual(["Nom complet", "Contact", "Formation ou service", "Date"]);
    expect(blueprint.screens[0].primaryActionLabel).toBe("Ajouter un dossier");
  });

  it("uses payment-specific fields without adding payment functions that were not retained", () => {
    const blueprint = buildVisualBlueprint(dossier(), definition(), proposal(true, "Enregistrer un paiement", "finances"));
    expect(blueprint.screens[0].previewFields).toEqual(["Référence", "Montant", "Mode de paiement", "Date"]);
    expect(blueprint.screens[0].primaryActionLabel).toBe("Enregistrer un règlement");
    expect(blueprint.screens[0].items).toEqual(["Enregistrer un paiement"]);
  });
  
  it("extracts concise role profiles and responsibilities from a long free-text answer", () => {
    const rolesText = [
      "1. Propriétaire / administratrice",
      "Piloter l'activité.",
      "Valider les décisions importantes.",
      "2. Responsable commercial / Agent d'accueil",
      "Enregistrer les nouveaux clients.",
      "Présenter les produits et les tarifs.",
      "3. Pâtissier / Chef de production",
      "Consulter les commandes validées.",
      "Organiser les tâches de production.",
      "9. Client",
      "Consulter le catalogue.",
      "Suivre sa commande.",
    ].join("\n");
    const base = definition();
    const blueprint = buildVisualBlueprint(dossier(), {
      ...base,
      answers: [{ ...base.answers[0], value: rolesText }],
    }, proposal());

    expect(blueprint.profiles.map((profile) => profile.name)).toEqual([
      "Propriétaire / administratrice",
      "Responsable commercial / Agent d'accueil",
      "Pâtissier / Chef de production",
      "Client",
    ]);
    expect(blueprint.profiles[0].responsibilities).toEqual([
      "Piloter l'activité.",
      "Valider les décisions importantes.",
    ]);
    expect(blueprint.profiles[1].responsibilities).toContain("Enregistrer les nouveaux clients.");
    expect(blueprint.profiles.every((profile) => profile.name.length < 70)).toBe(true);
  });

  it("turns a long accepted answer into a concise feature label instead of rendering the whole dossier", () => {
    const longTitle = [
      "Contrôler les performances de l'entreprise.",
      "2. L'administrateur interne — Gestion quotidienne",
      "Créer et gérer les comptes utilisateurs.",
      "Mettre à jour le catalogue des produits.",
      "Vérifier les informations des commandes.",
      "Assurer une assistance technique en cas de problème.",
    ].join("\n");
    const blueprint = buildVisualBlueprint(dossier(), definition(), proposal(true, longTitle, "operations"));

    expect(blueprint.screens[0].items).toEqual(["Contrôler les performances de l'entreprise"]);
    expect(blueprint.screens[0].items[0].length).toBeLessThan(70);
  });

});
