import { describe, expect, it } from "vitest";
import {
  createExecutionGuard,
  type ExecutionAuditEvent,
} from "./execution-guard";

describe("execution guard", () => {
  it("claims an idempotency key once and rejects duplicates", () => {
    const guard = createExecutionGuard({ budgetLimitMinor: 5000 });
    expect(guard.claimIdempotencyKey("project-1", "task-1", "attempt-1")).toBe(true);
    expect(guard.claimIdempotencyKey("project-1", "task-1", "attempt-1")).toBe(false);
    expect(guard.claimIdempotencyKey("project-1", "task-2", "attempt-1")).toBe(true);
  });

  it("reserves budget only within the approved limit", () => {
    const guard = createExecutionGuard({ budgetLimitMinor: 5000 });
    expect(guard.reserveBudget("project-1", 3000)).toEqual({ ok: true, reservedMinor: 3000 });
    expect(guard.reserveBudget("project-1", 2000)).toEqual({ ok: true, reservedMinor: 5000 });
    expect(guard.reserveBudget("project-1", 1)).toEqual({ ok: false, code: "BUDGET_LIMIT_EXCEEDED" });
    expect(guard.getReservedBudget("project-1")).toBe(5000);
  });

  it("rejects invalid amounts and invalid budgets", () => {
    expect(() => createExecutionGuard({ budgetLimitMinor: -1 })).toThrow("budget limit");
    const guard = createExecutionGuard({ budgetLimitMinor: 100 });
    expect(() => guard.reserveBudget("project-1", -10)).toThrow("positive integer");
    expect(() => guard.reserveBudget("project-1", 1.5)).toThrow("positive integer");
  });

  it("records audit events without retaining arbitrary sensitive payloads", () => {
    const guard = createExecutionGuard({ budgetLimitMinor: 1000 });
    guard.appendAuditEvent({
      projectId: "project-1",
      taskId: "task-1",
      actorId: "admin-1",
      action: "task.approved",
      outcome: "success",
      code: null,
      occurredAt: "2026-10-31T14:00:00.000Z",
    });
    const events: ExecutionAuditEvent[] = guard.listAuditEvents("project-1");
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({
      projectId: "project-1",
      taskId: "task-1",
      actorId: "admin-1",
      action: "task.approved",
      outcome: "success",
    });
    expect("payload" in events[0]).toBe(false);
  });

  it("isolates idempotency keys, budgets and audit history by project", () => {
    const guard = createExecutionGuard({ budgetLimitMinor: 1000 });
    guard.claimIdempotencyKey("project-a", "task", "same-key");
    guard.claimIdempotencyKey("project-b", "task", "same-key");
    guard.reserveBudget("project-a", 700);
    expect(guard.getReservedBudget("project-b")).toBe(0);
    expect(guard.listAuditEvents("project-b")).toEqual([]);
  });
});
