import {
  createProjectMemoryDigest,
  matchesProjectMemoryDigest,
} from "./project-memory-digest";
import { canonicalizeProjectMemoryPayload } from "./project-memory-canonical";

export type ProjectMemoryVersionKind = "brief" | "plan";

export type ProjectMemoryVersionRecord = {
  schemaVersion: 1;
  projectId: string;
  version: number;
  kind: ProjectMemoryVersionKind;
  sourceBriefVersion: number | null;
  createdAt: string;
  createdBy: string;
  canonicalPayload: string;
  digest: string;
};

export type CreateProjectMemoryVersionInput = {
  projectId: string;
  version: number;
  kind: ProjectMemoryVersionKind;
  sourceBriefVersion?: number;
  createdAt: string;
  createdBy: string;
  payload: unknown;
};

function requireNonBlank(value: string, field: string): void {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new TypeError(`Project memory version requires a non-empty ${field}.`);
  }
}

function requirePositiveInteger(value: number, field: string): void {
  if (!Number.isSafeInteger(value) || value < 1) {
    throw new TypeError(`Project memory version requires a positive integer ${field}.`);
  }
}

function isCanonicalTimestamp(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)) return false;
  const parsed = new Date(value);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString() === value;
}

/**
 * Builds a detached, content-addressed version envelope.
 * The payload is stored as canonical JSON text so later caller mutations
 * cannot silently alter the captured version. Persistence and authorization
 * remain responsibilities of the server-side repository layer.
 */
export function createProjectMemoryVersion(
  input: CreateProjectMemoryVersionInput,
): ProjectMemoryVersionRecord {
  requireNonBlank(input.projectId, "projectId");
  requireNonBlank(input.createdBy, "createdBy");
  requirePositiveInteger(input.version, "version");

  if (input.kind !== "brief" && input.kind !== "plan") {
    throw new TypeError("Project memory version kind must be brief or plan.");
  }
  if (!isCanonicalTimestamp(input.createdAt)) {
    throw new TypeError("Project memory version createdAt must be a valid UTC ISO timestamp.");
  }

  let sourceBriefVersion: number | null = null;
  if (input.kind === "brief") {
    if (input.sourceBriefVersion !== undefined) {
      throw new TypeError("A brief version cannot reference a source brief version.");
    }
  } else {
    if (input.sourceBriefVersion === undefined) {
      throw new TypeError("A plan version requires a source brief version.");
    }
    requirePositiveInteger(input.sourceBriefVersion, "sourceBriefVersion");
    sourceBriefVersion = input.sourceBriefVersion;
  }

  const canonicalPayload = canonicalizeProjectMemoryPayload(input.payload);
  return {
    schemaVersion: 1,
    projectId: input.projectId.trim(),
    version: input.version,
    kind: input.kind,
    sourceBriefVersion,
    createdAt: input.createdAt,
    createdBy: input.createdBy.trim(),
    canonicalPayload,
    digest: createProjectMemoryDigest(JSON.parse(canonicalPayload) as unknown),
  };
}

/**
 * Checks the captured payload fingerprint and basic envelope invariants.
 * This is an integrity check, not proof of actor identity or authorization.
 */
export function verifyProjectMemoryVersion(
  record: ProjectMemoryVersionRecord,
): boolean {
  if (!record || record.schemaVersion !== 1) return false;
  if (typeof record.projectId !== "string" || record.projectId.trim().length === 0) return false;
  if (typeof record.createdBy !== "string" || record.createdBy.trim().length === 0) return false;
  if (!Number.isSafeInteger(record.version) || record.version < 1) return false;
  if (!isCanonicalTimestamp(record.createdAt)) return false;

  if (record.kind === "brief") {
    if (record.sourceBriefVersion !== null) return false;
  } else if (record.kind === "plan") {
    if (!Number.isSafeInteger(record.sourceBriefVersion) || (record.sourceBriefVersion ?? 0) < 1) {
      return false;
    }
  } else {
    return false;
  }

  try {
    const parsedPayload: unknown = JSON.parse(record.canonicalPayload);
    if (canonicalizeProjectMemoryPayload(parsedPayload) !== record.canonicalPayload) return false;
    return matchesProjectMemoryDigest(parsedPayload, record.digest);
  } catch {
    return false;
  }
}
