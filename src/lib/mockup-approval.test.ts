import { describe, expect, it } from "vitest";
import { createOfficialMockupSnapshot } from "./mockup-approval";

describe("createOfficialMockupSnapshot", () => {
  const submitted = {
    recordType: "mockup_version",
    project: { id: "MK-001", title: "Titre manipulable", problem: "Faux problème" },
    studio: {
      format: "dashboard",
      palette: "emerald",
      reviewStatus: "approved",
      reviewNote: "Le concept me convient.",
      enabledModules: ["staff"],
      selectedRecommendationIds: ["finance"],
    },
    quote: { amount: "", days: "", paymentTerms: "À convenir" },
    clientResponse: { choice: "undecided", comment: "" },
  };
  const ownedProject = {
    id: "MK-001",
    title: "Projet officiel",
    category: "business",
    problem: "Données provenant du dossier sauvegardé.",
    desired_outcome: "Suivre les opérations.",
    budget: "À définir",
    urgency: "normal",
    recommendations: [{ title: "Gestion", description: "Centraliser", reason: "Clarté" }],
  };

  it("records the authenticated approval against the exact saved project snapshot", () => {
    const result = createOfficialMockupSnapshot(submitted, ownedProject, "auth-user-1", 3, "2026-11-10T12:00:00.000Z");
    expect(result.project).toEqual({
      id: "MK-001",
      title: "Projet officiel",
      category: "business",
      problem: "Données provenant du dossier sauvegardé.",
      desiredOutcome: "Suivre les opérations.",
      budget: "À définir",
      urgency: "normal",
      recommendations: ownedProject.recommendations,
    });
    expect(result.version).toBe(3);
    expect(result.snapshotCreatedAt).toBe("2026-11-10T12:00:00.000Z");
    expect(result.officialDecision).toEqual({
      status: "approved",
      actorUserId: "auth-user-1",
      recordedAt: "2026-11-10T12:00:00.000Z",
    });
    expect(result.studio.reviewNote).toBe("Le concept me convient.");
  });

  it("preserves a change request as an official server-recorded decision", () => {
    const result = createOfficialMockupSnapshot({
      ...submitted,
      studio: { ...submitted.studio, reviewStatus: "changes_requested" },
    }, ownedProject, "auth-user-1", 4, "2026-11-10T12:05:00.000Z");
    expect(result.officialDecision.status).toBe("changes_requested");
    expect(result.version).toBe(4);
  });
});
