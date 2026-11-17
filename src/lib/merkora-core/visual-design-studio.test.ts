import { describe, expect, it } from "vitest";
import type { ProductDefinitionSession } from "./product-definition";
import type { ProjectUnderstanding } from "./project-diagnostic";
import type { SolutionProposal } from "./solution-proposal";
import { buildVisualBlueprint } from "./visual-blueprint";

const dossier = (): ProjectUnderstanding => ({
  id: "dossier-studio",
  projectId: "project-studio",
  version: 1,
  originalDescription: "Je veux une plateforme pour organiser les ventes et le fonctionnement de mon activité.",
  items: [
    { id: "activity", dimension: "activity", originalDimension: "activity", value: "Activité commerciale", status: "user_stated", source: "conversation", sourceQuote: "activité commerciale", createdAt: "2026-11-17" },
    { id: "problem", dimension: "problem", originalDimension: "problem", value: "Le suivi est dispersé", status: "user_stated", source: "conversation", sourceQuote: "suivi dispersé", createdAt: "2026-11-17" },
  ],
  situationGraph: { entities: [], relations: [], unresolvedRelations: [] },
  contradictions: [],
  unresolvedQuestions: [],
  privacyConsiderations: [],
  activityVocabulary: "open",
  validationStatus: "validated",
  sourceSessionVersion: 1,
  createdAt: "2026-11-17",
  updatedAt: "2026-11-17",
} as ProjectUnderstanding);

const definition = (): ProductDefinitionSession => ({
  id: "definition-studio",
  projectId: "project-studio",
  understandingId: "dossier-studio",
  version: 5,
  answers: [
    {
      id: "answer-nature",
      questionId: "product-nature",
      familyId: "nature",
      value: "Une plateforme",
      status: "answered",
      createdAt: "2026-11-17",
      version: 1,
      question: { id: "product-nature", familyId: "nature", prompt: "Quel produit ?", purpose: "Choisir la nature du produit", answerType: "single_choice", allowDetail: true, evidenceIds: [] },
    },
    {
      id: "answer-delivery",
      questionId: "delivery-mode",
      familyId: "integrations_equipment",
      value: ["Accessible depuis un navigateur", "Installable comme PWA"],
      status: "answered",
      createdAt: "2026-11-17",
      version: 1,
      question: { id: "delivery-mode", familyId: "integrations_equipment", prompt: "Comment y accéder ?", purpose: "Choisir le mode de livraison", answerType: "multi_choice", allowDetail: true, evidenceIds: [] },
    },
    {
      id: "answer-roles",
      questionId: "roles",
      familyId: "users_roles",
      value: [
        "1. Responsable",
        "Piloter l'activité et valider les décisions.",
        "2. Agent commercial",
        "Enregistrer les clients et suivre les commandes.",
      ],
      status: "answered",
      createdAt: "2026-11-17",
      version: 1,
      question: { id: "roles", familyId: "users_roles", prompt: "Qui utilise le produit ?", purpose: "Identifier les profils", answerType: "text", allowDetail: true, evidenceIds: [] },
    },
  ],
  askedQuestionIds: ["product-nature", "delivery-mode", "roles"],
  deferredQuestionIds: [],
  status: "ready_for_review",
  createdAt: "2026-11-17",
  updatedAt: "2026-11-17",
});

const proposal = (): SolutionProposal => ({
  id: "solution-studio",
  projectId: "project-studio",
  title: "Plateforme de gestion",
  description: "Organiser les ventes et les opérations.",
  problem: "Le suivi est dispersé.",
  objective: "Centraliser le suivi.",
  operatingPrinciple: "Un espace commun pour les opérations.",
  architectures: [],
  components: [
    { id: "orders", title: "Gérer les commandes", description: "Suivre les commandes reçues.", status: "accepted", source: "validated_definition", familyId: "functionalities", sourceIds: ["answer-roles"] },
    { id: "payments", title: "Suivre les paiements", description: "Suivre les règlements.", status: "modified", source: "validated_definition", familyId: "finances", sourceIds: ["answer-delivery"] },
    { id: "performance", title: "Contrôler les performances de l'activité.\n2. Responsable — gestion générale\nValider les ventes et les paiements.", description: "Piloter l'activité.", status: "accepted", source: "validated_definition", familyId: "operations", sourceIds: ["answer-roles"] },
    { id: "stock", title: "Gérer les stocks", description: "Piste à confirmer.", status: "suggested", source: "knowledge_suggestion", familyId: "integrations_equipment", sourceIds: [] },
    { id: "removed", title: "Fonction abandonnée", description: "Écartée.", status: "rejected", source: "validated_definition", familyId: "functionalities", sourceIds: [] },
  ],
  coherenceNotes: [],
  unresolvedPoints: ["Le mode de notification reste à choisir."],
  version: 3,
  updatedAt: "2026-11-17",
});

type StudioBlueprintContract = {
  productNature: string;
  productNatureStatus: string;
  deliveryModes: string[];
  screens: Array<{
    id: string;
    title: string;
    navLabel: string;
    features: Array<{ id: string; label: string; sourceIds: string[]; fields: string[]; actionLabel: string }>;
  }>;
  decisionRegister: Array<{ elementLabel: string; sourceIds: string[]; sourceLabel: string }>;
  pendingItems: string[];
};

describe("screen 07 — conception structurée et traçable", () => {
  it("sépare la nature du produit de son mode de livraison", () => {
    const result = buildVisualBlueprint(dossier(), definition(), proposal()) as unknown as StudioBlueprintContract;

    expect(result.productNature).toBe("platform");
    expect(result.productNatureStatus).toBe("confirmed");
    expect(result.deliveryModes).toEqual(["browser", "pwa"]);
  });

  it("construit des pages produit à partir des composants retenus, pas des noms de familles génériques", () => {
    const result = buildVisualBlueprint(dossier(), definition(), proposal()) as unknown as StudioBlueprintContract;
    const allLabels = result.screens.flatMap((screen) => [screen.title, screen.navLabel, ...screen.features.map((feature) => feature.label)]);

    expect(result.screens.length).toBeGreaterThan(2);
    expect(allLabels).toContain("Gérer les commandes");
    expect(allLabels).toContain("Suivre les paiements");
    expect(allLabels).toContain("Contrôler les performances de l'activité");
    expect(allLabels).not.toContain("Organisation et suivi");
    expect(allLabels.join(" ")).not.toContain("Valider les ventes et les paiements");
    expect(allLabels.join(" ")).not.toContain("Fonction abandonnée");
  });

  it("donne à chaque fonction conçue ses champs, son action et une source vérifiable", () => {
    const result = buildVisualBlueprint(dossier(), definition(), proposal()) as unknown as StudioBlueprintContract;
    const features = result.screens.flatMap((screen) => screen.features);

    expect(features.every((feature) => feature.fields.length > 0)).toBe(true);
    expect(features.every((feature) => feature.actionLabel.length > 0)).toBe(true);
    expect(features.every((feature) => feature.sourceIds.length > 0)).toBe(true);
    expect(result.decisionRegister.length).toBeGreaterThan(features.length);
    expect(result.decisionRegister.every((item) => item.elementLabel && item.sourceIds.length > 0 && item.sourceLabel)).toBe(true);
  });

  it("sépare les suggestions de la maquette et conserve leur état non validé", () => {
    const result = buildVisualBlueprint(dossier(), definition(), proposal()) as unknown as StudioBlueprintContract;
    const labels = result.screens.flatMap((screen) => screen.features.map((feature) => feature.label));

    expect(labels).not.toContain("Gérer les stocks");
    expect(result.pendingItems).toContain("Gérer les stocks");
  });

  it("ne confond pas un paiement mobile avec une application mobile", () => {
    const base = definition();
    const withoutNatureOrDelivery = base.answers.filter((answer) => answer.familyId !== "nature" && answer.id !== "answer-delivery");
    const operationalDefinition = {
      ...base,
      answers: [
        ...withoutNatureOrDelivery,
        {
          id: "answer-mobile-money",
          questionId: "payment-integration",
          familyId: "integrations_equipment",
          value: "Paiement mobile money MTN",
          status: "answered",
          createdAt: "2026-11-17",
          version: 1,
          question: { id: "payment-integration", familyId: "integrations_equipment", prompt: "Quels moyens de paiement ?", purpose: "Identifier les paiements", answerType: "text", allowDetail: true, evidenceIds: [] },
        },
      ],
    } as ProductDefinitionSession;
    const operationalDossier = {
      ...dossier(),
      originalDescription: "Je veux organiser un service de livraison local.",
    } as ProjectUnderstanding;
    const operationalProposal = {
      ...proposal(),
      title: "Organisation des tournées",
      description: "Suivre les tournées et les opérations de livraison.",
      operatingPrinciple: "Un parcours coordonné.",
    } as SolutionProposal;
    const result = buildVisualBlueprint(operationalDossier, operationalDefinition, operationalProposal) as unknown as { kind: string; deliveryModes: string[] };

    expect(result.kind).toBe("operational");
    expect(result.deliveryModes).toEqual([]);
  });

  it("résume la source d'une fonction sans recopier les longues responsabilités d'un profil", () => {
    const result = buildVisualBlueprint(dossier(), definition(), proposal()) as unknown as StudioBlueprintContract;
    const feature = result.screens.flatMap((screen) => screen.features).find((item) => item.label === "Gérer les commandes");

    expect(feature?.sourceLabel).toContain("Qui utilise le produit ?");
    expect(feature?.sourceLabel).toContain("Responsable");
    expect(feature?.sourceLabel).not.toContain("Piloter l'activité");
  });

});