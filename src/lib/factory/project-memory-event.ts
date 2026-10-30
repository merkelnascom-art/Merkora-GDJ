import type { ProjectMemoryEvent, ProjectMemoryEventType } from "./project-memory";

const EVENT_TYPES = new Set<ProjectMemoryEventType>([
  "brief_version_created",
  "plan_version_created",
  "decision_recorded",
  "approval_recorded",
  "task_started",
  "task_completed",
  "task_blocked",
  "task_failed",
  "job_interrupted",
  "job_resumed",
  "evidence_recorded",
  "delivery_recorded",
]);

export type ProjectMemoryEventInput = {
  id: unknown;
  projectId: unknown;
  type: unknown;
  occurredAt: unknown;
  actorId: unknown;
  correlationId: unknown;
  briefVersion?: unknown;
  planVersion?: unknown;
  taskId?: unknown;
  summary: unknown;
};

export type ProjectMemoryEventValidation =
  | { ok: true; event: ProjectMemoryEvent }
  | { ok: false; errors: string[] };

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

/**
 * Validates an event candidate before the server considers persisting it.
 * This is structural validation only; callers must still authenticate the actor,
 * authorize project access, enforce append-only persistence, and deduplicate IDs.
 */
export function validateProjectMemoryEvent(
  input: ProjectMemoryEventInput,
): ProjectMemoryEventValidation {
  const errors: string[] = [];

  for (const field of ["id", "projectId", "actorId", "correlationId", "summary"] as const) {
    if (!isNonEmptyString(input[field])) errors.push(`${field} doit être une chaîne non vide.`);
  }

  if (typeof input.type !== "string" || !EVENT_TYPES.has(input.type as ProjectMemoryEventType)) {
    errors.push("type ne correspond pas à un événement de mémoire autorisé.");
  }

  if (typeof input.occurredAt !== "string" || Number.isNaN(Date.parse(input.occurredAt))) {
    errors.push("occurredAt doit être une date valide.");
  }

  for (const field of ["briefVersion", "planVersion"] as const) {
    if (input[field] !== undefined && !isPositiveInteger(input[field])) {
      errors.push(`${field} doit être un entier strictement positif lorsqu'il est fourni.`);
    }
  }

  if (input.taskId !== undefined && !isNonEmptyString(input.taskId)) {
    errors.push("taskId doit être une chaîne non vide lorsqu'il est fourni.");
  }

  if (errors.length > 0) return { ok: false, errors };

  return {
    ok: true,
    event: {
      id: input.id as string,
      projectId: input.projectId as string,
      type: input.type as ProjectMemoryEventType,
      occurredAt: input.occurredAt as string,
      actorId: input.actorId as string,
      correlationId: input.correlationId as string,
      summary: input.summary as string,
      ...(input.briefVersion === undefined ? {} : { briefVersion: input.briefVersion as number }),
      ...(input.planVersion === undefined ? {} : { planVersion: input.planVersion as number }),
      ...(input.taskId === undefined ? {} : { taskId: input.taskId as string }),
    },
  };
}
