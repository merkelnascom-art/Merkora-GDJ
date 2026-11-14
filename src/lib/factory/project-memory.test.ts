import { describe, expect, it } from "vitest";
import {
  assessTaskResumability,
  createProjectResumeSnapshot,
  type MemoryTask,
} from "./project-memory";

const readyTask = (overrides: Partial<MemoryTask> = {}): MemoryTask => ({
  id: "task-1",
  state: "in_progress",
  dependencies: [],
  evidenceRequired: true,
  evidenceIds: [],
  externalSideEffect: false,
  resultIsKnown: true,
  ...overrides,
});

describe("assessTaskResumability", () => {
  it("allows a safe in-progress task to be resumed only after server revalidation", () => {
    expect(assessTaskResumability([readyTask()])).toEqual([{
      taskId: "task-1",
      action: "resume",
      reason: "La tâche peut être reprise après revalidation du manifeste et des autorisations par le serveur.",
    }]);
  });

  it("blocks completed tasks that lack required evidence", () => {
    expect(assessTaskResumability([readyTask({
      state: "completed",
      evidenceRequired: true,
      evidenceIds: [],
    })])[0].action).toBe("blocked");
  });

  it("does not repeat an external action with an unknown result", () => {
    const [decision] = assessTaskResumability([readyTask({
      externalSideEffect: true,
      resultIsKnown: false,
    })]);
    expect(decision.action).toBe("verify_first");
  });

  it("blocks tasks with missing or incomplete dependencies", () => {
    const tasks = [
      readyTask({ id: "task-1", state: "in_progress", dependencies: ["task-missing"] }),
      readyTask({ id: "task-2", state: "in_progress", dependencies: ["task-3"] }),
      readyTask({ id: "task-3", state: "in_progress" }),
    ];
    const decisions = assessTaskResumability(tasks);
    expect(decisions[0].action).toBe("blocked");
    expect(decisions[1].action).toBe("blocked");
  });

  it("requires review of failed tasks before retrying", () => {
    const [decision] = assessTaskResumability([readyTask({ state: "failed" })]);
    expect(decision.action).toBe("verify_first");
  });

  it("skips completed tasks with evidence and cancelled tasks", () => {
    const decisions = assessTaskResumability([
      readyTask({ id: "done", state: "completed", evidenceIds: ["proof-1"] }),
      readyTask({ id: "cancelled", state: "cancelled" }),
    ]);
    expect(decisions.map((decision) => decision.action)).toEqual(["skip", "skip"]);
  });
});

describe("createProjectResumeSnapshot", () => {
  it("blocks resume when approvals are missing", () => {
    const snapshot = createProjectResumeSnapshot({
      projectId: "MK-001",
      briefVersion: 1,
      planVersion: 1,
      jobStatus: "interrupted",
      tasks: [readyTask()],
      requiredApprovals: ["client_scope", "execution_authorization"],
      recordedApprovals: ["client_scope"],
      evidenceCount: 2,
    });

    expect(snapshot.canResume).toBe(false);
    expect(snapshot.missingApprovals).toEqual(["execution_authorization"]);
    expect(snapshot.requiresHumanReview).toBe(true);
  });

  it("normalizes evidence count and exposes safe resumable task IDs", () => {
    const snapshot = createProjectResumeSnapshot({
      projectId: "MK-002",
      briefVersion: 2,
      planVersion: 3,
      jobStatus: "building",
      tasks: [readyTask({ id: "task-safe", evidenceRequired: false })],
      requiredApprovals: ["execution_authorization"],
      recordedApprovals: ["execution_authorization"],
      evidenceCount: -4,
    });

    expect(snapshot.canResume).toBe(true);
    expect(snapshot.resumableTaskIds).toEqual(["task-safe"]);
    expect(snapshot.evidenceCount).toBe(0);
  });

  it("requires human review before resuming an interrupted job", () => {
    const snapshot = createProjectResumeSnapshot({
      projectId: "MK-004",
      briefVersion: 1,
      planVersion: 1,
      jobStatus: "interrupted",
      tasks: [readyTask()],
      requiredApprovals: ["execution_authorization"],
      recordedApprovals: ["execution_authorization"],
      evidenceCount: 1,
    });
    expect(snapshot.canResume).toBe(false);
    expect(snapshot.requiresHumanReview).toBe(true);
  });

  it("does not resume an empty task list", () => {
    const snapshot = createProjectResumeSnapshot({
      projectId: "MK-005",
      briefVersion: 1,
      planVersion: 1,
      jobStatus: "building",
      tasks: [],
      requiredApprovals: [],
      recordedApprovals: [],
      evidenceCount: 0,
    });
    expect(snapshot.canResume).toBe(false);
  });

  it("does not allow resume when plan versions are unknown", () => {
    const snapshot = createProjectResumeSnapshot({
      projectId: "MK-003",
      briefVersion: null,
      planVersion: null,
      jobStatus: "interrupted",
      tasks: [readyTask()],
      requiredApprovals: [],
      recordedApprovals: [],
      evidenceCount: 0,
    });
    expect(snapshot.canResume).toBe(false);
  });
});
