import { describe, expect, it } from "vitest";
import {
  createExecutionTask,
  transitionExecutionTask,
  type ExecutionTask,
} from "./execution-lifecycle";

describe("execution lifecycle", () => {
  it("starts tasks requiring approval in awaiting_approval", () => {
    const task = createExecutionTask({
      id: "deploy-preview",
      dependencyIds: [],
      requiresApproval: true,
      maxAttempts: 2,
    });

    expect(task.status).toBe("awaiting_approval");
    expect(task.attempts).toBe(0);
  });

  it("does not start before approval or completed dependencies", () => {
    const task: ExecutionTask = {
      ...createExecutionTask({ id: "deploy", dependencyIds: ["build"], requiresApproval: true, maxAttempts: 2 }),
      status: "ready",
    };

    expect(() => transitionExecutionTask(task, { type: "start" }, {
      dependencies: [{ id: "build", status: "running" }],
      now: "2026-10-31T14:00:00.000Z",
    })).toThrow("Dependencies are not complete");

    expect(() => transitionExecutionTask(task, { type: "start" }, {
      dependencies: [{ id: "build", status: "completed" }],
      now: "2026-10-31T14:00:00.000Z",
    })).toThrow("Approval is required");
  });

  it("requires approval, then allows start only after dependencies complete", () => {
    let task = createExecutionTask({
      id: "deploy",
      dependencyIds: ["build"],
      requiresApproval: true,
      maxAttempts: 2,
    });

    task = transitionExecutionTask(task, { type: "approve", actorId: "admin-1" }, {
      dependencies: [{ id: "build", status: "completed" }],
      now: "2026-10-31T14:00:00.000Z",
    });

    expect(task.status).toBe("ready");
    task = transitionExecutionTask(task, { type: "start" }, {
      dependencies: [{ id: "build", status: "completed" }],
      now: "2026-10-31T14:01:00.000Z",
    });
    expect(task.status).toBe("running");
    expect(task.attempts).toBe(1);
  });

  it("requires verification before completion", () => {
    let task = createExecutionTask({
      id: "generate",
      dependencyIds: [],
      requiresApproval: false,
      maxAttempts: 2,
    });
    task = transitionExecutionTask(task, { type: "start" }, { dependencies: [], now: "2026-10-31T14:00:00.000Z" });
    expect(() => transitionExecutionTask(task, { type: "complete" }, { dependencies: [], now: "2026-10-31T14:01:00.000Z" }))
      .toThrow("Verification must pass");
    task = transitionExecutionTask(task, { type: "verification_passed" }, { dependencies: [], now: "2026-10-31T14:01:00.000Z" });
    task = transitionExecutionTask(task, { type: "complete" }, { dependencies: [], now: "2026-10-31T14:02:00.000Z" });
    expect(task.status).toBe("completed");
  });

  it("limits retries and records sanitized failure codes", () => {
    let task = createExecutionTask({
      id: "build",
      dependencyIds: [],
      requiresApproval: false,
      maxAttempts: 1,
    });
    task = transitionExecutionTask(task, { type: "start" }, { dependencies: [], now: "2026-10-31T14:00:00.000Z" });
    task = transitionExecutionTask(task, { type: "fail", errorCode: "PROVIDER_UNAVAILABLE" }, { dependencies: [], now: "2026-10-31T14:01:00.000Z" });
    expect(task.status).toBe("failed");
    expect(task.lastErrorCode).toBe("PROVIDER_UNAVAILABLE");
    expect(() => transitionExecutionTask(task, { type: "retry" }, { dependencies: [], now: "2026-10-31T14:02:00.000Z" }))
      .toThrow("Retry limit reached");
  });
});
