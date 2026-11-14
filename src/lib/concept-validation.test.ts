import { describe, expect, it } from "vitest";
import {
  createConceptValidationState,
  createConceptVersionId,
  recordConceptDecision,
  startNewConceptVersion,
} from "./concept-validation";

describe("versioned concept validation", () => {
  it("keeps a generated concept in draft until an explicit client decision", () => {
    const state = createConceptValidationState("concept-v1");
    expect(state.status).toBe("draft");
    expect(state.history).toEqual([]);
  });

  it("records a change request without erasing the version that was reviewed", () => {
    const state = createConceptValidationState("concept-v1");
    const requested = recordConceptDecision(state, {
      conceptVersionId: "concept-v1",
      action: "request_changes",
      clientNote: "Prévoir aussi le rôle du secrétariat.",
      decidedAt: "2026-11-13T12:00:00.000Z",
      decidedBy: "client-1",
    });
    expect(requested.status).toBe("changes_requested");
    expect(requested.history).toHaveLength(1);
    expect(requested.history[0].conceptVersionId).toBe("concept-v1");
  });

  it("binds approval to the exact concept version shown", () => {
    const state = createConceptValidationState("concept-v2");
    const stale = recordConceptDecision(state, {
      conceptVersionId: "concept-v1",
      action: "approve",
      decidedAt: "2026-11-13T12:00:00.000Z",
      decidedBy: "client-1",
    });
    expect(stale).toEqual(state);
    const approved = recordConceptDecision(state, {
      conceptVersionId: "concept-v2",
      action: "approve",
      decidedAt: "2026-11-13T12:05:00.000Z",
      decidedBy: "client-1",
    });
    expect(approved.status).toBe("approved");
    expect(approved.history[0].conceptVersionId).toBe("concept-v2");
  });

  it("invalidates approval for a new concept version but preserves the previous approval record", () => {
    const approved = recordConceptDecision(createConceptValidationState("concept-v1"), {
      conceptVersionId: "concept-v1",
      action: "approve",
      decidedAt: "2026-11-13T12:00:00.000Z",
      decidedBy: "client-1",
    });
    const revised = startNewConceptVersion(approved, "concept-v2");
    expect(revised.currentVersionId).toBe("concept-v2");
    expect(revised.status).toBe("draft");
    expect(revised.history).toHaveLength(1);
    expect(revised.history[0].status).toBe("approved");
  });

  it("does not infer quote acceptance or payment from design approval", () => {
    const approved = recordConceptDecision(createConceptValidationState("concept-v1"), {
      conceptVersionId: "concept-v1",
      action: "approve",
    });
    expect(approved).not.toHaveProperty("quoteAccepted");
    expect(approved).not.toHaveProperty("paymentCompleted");
  });

  it("does not fabricate a timestamp or decision actor", () => {
    const approved = recordConceptDecision(createConceptValidationState("concept-v1"), {
      conceptVersionId: "concept-v1",
      action: "approve",
    });
    expect(approved.updatedAt).toBeNull();
    expect(approved.updatedBy).toBeNull();
    expect(approved.history[0].decidedAt).toBeNull();
    expect(approved.history[0].decidedBy).toBeNull();
  });
});


describe("concept version identity", () => {
  it("stays stable for the same confirmed project snapshot", () => {
    const project = { title: "Projet", problem: "Besoin", desiredOutcome: "Résultat" };
    const snapshot = { solutionFormat: "digital", format: "website", formatConfirmed: true, palette: "violet", enabledModules: ["a", "b"] };
    expect(createConceptVersionId("p1", project, snapshot)).toBe(createConceptVersionId("p1", project, snapshot));
  });

  it("creates a new concept version when confirmed project choices change", () => {
    const project = { title: "Projet", problem: "Besoin", desiredOutcome: "Résultat" };
    const first = createConceptVersionId("p1", project, { solutionFormat: "digital", format: "website", formatConfirmed: true });
    const second = createConceptVersionId("p1", project, { solutionFormat: "organizational", format: "website", formatConfirmed: false });
    expect(second).not.toBe(first);
  });
});


  it("creates a new concept version when diagnostic answers change", () => {
    const project = { title: "Projet", problem: "Besoin", desiredOutcome: "Résultat" };
    const first = createConceptVersionId("p1", project, { solutionFormat: "organizational", diagnosticResponses: { role: "manager" } });
    const second = createConceptVersionId("p1", project, { solutionFormat: "organizational", diagnosticResponses: { role: "everyone" } });
    expect(second).not.toBe(first);
  });
