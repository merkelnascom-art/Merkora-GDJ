import { describe, expect, it } from "vitest";
import { createProjectMemoryVersion, verifyProjectMemoryVersion } from "./project-memory-version";

describe("project memory version envelopes", () => {
  const base = {
    projectId: "project-123",
    version: 1,
    kind: "plan" as const,
    sourceBriefVersion: 2,
    createdAt: "2026-10-30T15:00:00.000Z",
    createdBy: "admin-1",
    payload: { title: "Staff management", modules: ["attendance", "reports"] },
  };

  it("captures canonical content and a server-computable digest", () => {
    const record = createProjectMemoryVersion(base);
    expect(record).toMatchObject({
      projectId: "project-123",
      version: 1,
      kind: "plan",
      sourceBriefVersion: 2,
      schemaVersion: 1,
    });
    expect(record.digest).toMatch(/^[a-f0-9]{64}$/);
    expect(record.canonicalPayload).toBe(
      '{"modules":["attendance","reports"],"title":"Staff management"}',
    );
    expect(verifyProjectMemoryVersion(record)).toBe(true);
  });

  it("does not change when the caller later mutates the original payload", () => {
    const payload = { title: "Initial" };
    const record = createProjectMemoryVersion({ ...base, payload });
    payload.title = "Modified";
    expect(verifyProjectMemoryVersion(record)).toBe(true);
    expect(record.canonicalPayload).toBe('{"title":"Initial"}');
  });

  it("rejects invalid identifiers, versions and timestamps", () => {
    expect(() => createProjectMemoryVersion({ ...base, projectId: " " })).toThrow();
    expect(() => createProjectMemoryVersion({ ...base, version: 0 })).toThrow();
    expect(() => createProjectMemoryVersion({ ...base, sourceBriefVersion: 0 })).toThrow();
    expect(() => createProjectMemoryVersion({ ...base, createdAt: "yesterday" })).toThrow();
  });

  it("rejects brief versions linked to a source brief version", () => {
    expect(() => createProjectMemoryVersion({
      ...base,
      kind: "brief",
      sourceBriefVersion: 2,
    })).toThrow("brief version cannot reference a source brief version");
  });

  it("detects tampered canonical content or digest", () => {
    const record = createProjectMemoryVersion(base);
    expect(verifyProjectMemoryVersion({ ...record, canonicalPayload: "{}" })).toBe(false);
    expect(verifyProjectMemoryVersion({ ...record, digest: "0".repeat(64) })).toBe(false);
  });
});
