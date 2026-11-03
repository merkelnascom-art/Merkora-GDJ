export type ExecutionAuditEvent = Readonly<{
  projectId: string;
  taskId: string | null;
  actorId: string | null;
  action: string;
  outcome: "success" | "denied" | "failure";
  code: string | null;
  occurredAt: string;
}>;

export type BudgetReservationResult =
  | { ok: true; reservedMinor: number }
  | { ok: false; code: "BUDGET_LIMIT_EXCEEDED" };

function requireIdentifier(value: string, label: string): string {
  const normalized = value.trim();
  if (!normalized || normalized.length > 128) {
    throw new Error(`A valid ${label} is required.`);
  }
  return normalized;
}

function safeAuditCode(code: string | null): string | null {
  if (code === null) return null;
  return /^[A-Z0-9_]{1,64}$/.test(code) ? code : "UNSAFE_ERROR_REDACTED";
}

/**
 * In-memory safety primitives. Replace with atomic durable storage before
 * multi-instance or production execution; this is not a distributed lock.
 */
export function createExecutionGuard(input: { budgetLimitMinor: number }) {
  if (!Number.isSafeInteger(input.budgetLimitMinor) || input.budgetLimitMinor < 0) {
    throw new Error("A non-negative integer budget limit is required.");
  }

  const idempotencyKeys = new Set<string>();
  const reservedByProject = new Map<string, number>();
  const auditByProject = new Map<string, ExecutionAuditEvent[]>();

  return {
    claimIdempotencyKey(projectId: string, taskId: string, key: string): boolean {
      const project = requireIdentifier(projectId, "project identifier");
      const task = requireIdentifier(taskId, "task identifier");
      const token = requireIdentifier(key, "idempotency key");
      const composite = JSON.stringify([project, task, token]);
      if (idempotencyKeys.has(composite)) return false;
      idempotencyKeys.add(composite);
      return true;
    },

    reserveBudget(projectId: string, amountMinor: number): BudgetReservationResult {
      const project = requireIdentifier(projectId, "project identifier");
      if (!Number.isSafeInteger(amountMinor) || amountMinor <= 0) {
        throw new Error("Budget reservation must be a positive integer.");
      }
      const current = reservedByProject.get(project) ?? 0;
      if (amountMinor > input.budgetLimitMinor - current) {
        return { ok: false, code: "BUDGET_LIMIT_EXCEEDED" };
      }
      const next = current + amountMinor;
      reservedByProject.set(project, next);
      return { ok: true, reservedMinor: next };
    },

    getReservedBudget(projectId: string): number {
      const project = requireIdentifier(projectId, "project identifier");
      return reservedByProject.get(project) ?? 0;
    },

    appendAuditEvent(event: ExecutionAuditEvent): void {
      const projectId = requireIdentifier(event.projectId, "project identifier");
      const safeEvent: ExecutionAuditEvent = Object.freeze({
        projectId,
        taskId: event.taskId === null ? null : requireIdentifier(event.taskId, "task identifier"),
        actorId: event.actorId === null ? null : requireIdentifier(event.actorId, "actor identifier"),
        action: requireIdentifier(event.action, "audit action"),
        outcome: event.outcome,
        code: safeAuditCode(event.code),
        occurredAt: event.occurredAt,
      });
      const events = auditByProject.get(projectId) ?? [];
      events.push(safeEvent);
      auditByProject.set(projectId, events);
    },

    listAuditEvents(projectId: string): readonly ExecutionAuditEvent[] {
      const project = requireIdentifier(projectId, "project identifier");
      return [...(auditByProject.get(project) ?? [])];
    },
  };
}
