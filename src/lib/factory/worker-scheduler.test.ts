import { describe, expect, it } from "vitest";
import { selectNextFactoryTask, type FactoryTaskCandidate } from "./worker-scheduler";

const task = (overrides: Partial<FactoryTaskCandidate> = {}): FactoryTaskCandidate => ({
  id: "task-1", taskKey: "prepare_specification", state: "not_started",
  dependencies: [], evidenceRequired: true, evidenceCount: 0,
  externalSideEffect: false, ...overrides,
});

describe("selectNextFactoryTask", () => {
  it("selects the first task with no dependencies", () => {
    expect(selectNextFactoryTask([task()])).toEqual({ taskId: "task-1", taskKey: "prepare_specification" });
  });

  it("waits until every dependency is completed with required evidence", () => {
    const dependency = task({ id: "task-1", state: "completed", evidenceCount: 1 });
    const next = task({ id: "task-2", taskKey: "generate_application", dependencies: ["task-1"] });
    expect(selectNextFactoryTask([dependency, next])).toEqual({ taskId: "task-2", taskKey: "generate_application" });
    expect(selectNextFactoryTask([task({ id: "task-1", state: "in_progress" }), next])).toBeNull();
    expect(selectNextFactoryTask([task({ id: "task-1", state: "completed", evidenceCount: 0 }), next])).toBeNull();
  });

  it("does not run a task with a missing dependency", () => {
    expect(selectNextFactoryTask([task({ dependencies: ["missing-task"] })])).toBeNull();
  });

  it("never auto-runs tasks with external side effects", () => {
    expect(selectNextFactoryTask([task({ externalSideEffect: true })])).toBeNull();
  });

  it("does not restart completed, blocked, failed, or cancelled tasks", () => {
    for (const state of ["completed", "blocked", "failed", "cancelled"] as const) {
      expect(selectNextFactoryTask([task({ state })])).toBeNull();
    }
  });
});
