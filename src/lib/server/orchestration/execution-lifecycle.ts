export type ExecutionTaskStatus =
  | "planned"
  | "awaiting_approval"
  | "ready"
  | "running"
  | "verifying"
  | "blocked"
  | "failed"
  | "completed";

export interface ExecutionTask {
  id: string;
  dependencyIds: string[];
  status: ExecutionTaskStatus;
  requiresApproval: boolean;
  approvalGranted: boolean;
  attempts: number;
  maxAttempts: number;
  createdAt: string;
  updatedAt: string;
  startedAt: string | null;
  completedAt: string | null;
  lastErrorCode: string | null;
}

export type ExecutionTaskAction =
  | { type: "approve"; actorId: string }
  | { type: "start" }
  | { type: "verification_passed" }
  | { type: "complete" }
  | { type: "fail"; errorCode: string }
  | { type: "retry" }
  | { type: "block" };

export interface ExecutionDependency {
  id: string;
  status: ExecutionTaskStatus;
}

export interface ExecutionTransitionContext {
  dependencies: readonly ExecutionDependency[];
  now: string;
}

export function createExecutionTask(input: {
  id: string;
  dependencyIds: readonly string[];
  requiresApproval: boolean;
  maxAttempts: number;
  now?: string;
}): ExecutionTask {
  if (!input.id.trim()) throw new Error("A task identifier is required.");
  if (!Number.isInteger(input.maxAttempts) || input.maxAttempts < 1) {
    throw new Error("maxAttempts must be a positive integer.");
  }
  const now = input.now ?? new Date().toISOString();
  return {
    id: input.id,
    dependencyIds: [...new Set(input.dependencyIds)],
    status: input.requiresApproval ? "awaiting_approval" : "ready",
    requiresApproval: input.requiresApproval,
    approvalGranted: false,
    attempts: 0,
    maxAttempts: input.maxAttempts,
    createdAt: now,
    updatedAt: now,
    startedAt: null,
    completedAt: null,
    lastErrorCode: null,
  };
}

function assertDependenciesComplete(task: ExecutionTask, dependencies: readonly ExecutionDependency[]) {
  const byId = new Map(dependencies.map((dependency) => [dependency.id, dependency.status]));
  const incomplete = task.dependencyIds.filter((id) => byId.get(id) !== "completed");
  if (incomplete.length > 0) throw new Error("Dependencies are not complete.");
}

function assertSafeErrorCode(code: string) {
  if (!/^[A-Z0-9_]{1,64}$/.test(code)) {
    throw new Error("A sanitized error code is required.");
  }
}

export function transitionExecutionTask(
  task: ExecutionTask,
  action: ExecutionTaskAction,
  context: ExecutionTransitionContext,
): ExecutionTask {
  const next: ExecutionTask = { ...task, updatedAt: context.now };

  switch (action.type) {
    case "approve":
      if (!action.actorId.trim()) throw new Error("An approving actor is required.");
      if (!task.requiresApproval) throw new Error("This task does not require approval.");
      if (task.status !== "awaiting_approval" && task.status !== "planned") {
        throw new Error("Task cannot be approved in its current state.");
      }
      assertDependenciesComplete(task, context.dependencies);
      next.approvalGranted = true;
      next.status = "ready";
      return next;

    case "start":
      if (task.status !== "ready") throw new Error("Task is not ready to start.");
      assertDependenciesComplete(task, context.dependencies);
      if (task.requiresApproval && !task.approvalGranted) throw new Error("Approval is required.");
      if (task.attempts >= task.maxAttempts) throw new Error("Retry limit reached.");
      next.status = "running";
      next.attempts += 1;
      next.startedAt = context.now;
      next.lastErrorCode = null;
      return next;

    case "verification_passed":
      if (task.status !== "running") throw new Error("Only a running task can be verified.");
      next.status = "verifying";
      return next;

    case "complete":
      if (task.status !== "verifying") throw new Error("Verification must pass before completion.");
      next.status = "completed";
      next.completedAt = context.now;
      return next;

    case "fail":
      if (task.status !== "running" && task.status !== "verifying") {
        throw new Error("Only an active task can fail.");
      }
      assertSafeErrorCode(action.errorCode);
      next.status = "failed";
      next.lastErrorCode = action.errorCode;
      return next;

    case "retry":
      if (task.status !== "failed") throw new Error("Only a failed task can be retried.");
      if (task.attempts >= task.maxAttempts) throw new Error("Retry limit reached.");
      next.status = "ready";
      next.lastErrorCode = null;
      return next;

    case "block":
      if (task.status === "completed") throw new Error("Completed tasks cannot be blocked.");
      next.status = "blocked";
      return next;
  }
}
