import { describe, expect, it } from "vitest";
import { validateProjectMemoryEvent } from "./project-memory-event";

const validEvent = () => ({
  id: "evt-1",
  projectId: "project-1",
  type: "task_started",
  occurredAt: "2026-10-30T13:00:00.000Z",
  actorId: "user-1",
  correlationId: "corr-1",
  briefVersion: 1,
  planVersion: 2,
  taskId: "task-1",
  summary: "La tâche a commencé.",
});

describe("validateProjectMemoryEvent", () => {
  it("accepts a structurally valid event candidate", () => {
    const result = validateProjectMemoryEvent(validEvent());
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.event.projectId).toBe("project-1");
      expect(result.event.planVersion).toBe(2);
    }
  });

  it("rejects unknown event types and missing identity fields", () => {
    const result = validateProjectMemoryEvent({
      ...validEvent(),
      type: "admin_override",
      actorId: " ",
      projectId: "",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.some((error) => error.includes("type"))).toBe(true);
      expect(result.errors.some((error) => error.includes("actorId"))).toBe(true);
      expect(result.errors.some((error) => error.includes("projectId"))).toBe(true);
    }
  });

  it("rejects invalid timestamps and non-positive versions", () => {
    const result = validateProjectMemoryEvent({
      ...validEvent(),
      occurredAt: "not-a-date",
      briefVersion: 0,
      planVersion: -1,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toHaveLength(3);
    }
  });

  it("does not trust structural validation as authorization", () => {
    const result = validateProjectMemoryEvent(validEvent());
    expect(result.ok).toBe(true);
    // Authentication, project access and deduplication remain server responsibilities.
    // This validator only validates the candidate's shape.
  });
});
