import { describe, expect, it } from "vitest";
import {
  createProjectMemoryDigest,
  matchesProjectMemoryDigest,
} from "./project-memory-digest";

describe("project memory digests", () => {
  it("creates a SHA-256 digest from canonical payload content", () => {
    expect(createProjectMemoryDigest({ b: 2, a: 1 })).toBe(
      "43258cff783fe7036d8a43033f830adfc60ec037382473548ac742b888292777",
    );
  });

  it("produces the same digest for equivalent objects", () => {
    expect(createProjectMemoryDigest({ b: 2, a: 1 })).toBe(
      createProjectMemoryDigest({ a: 1, b: 2 }),
    );
  });

  it("detects changed content and malformed digests", () => {
    const digest = createProjectMemoryDigest({ title: "Approved plan" });
    expect(matchesProjectMemoryDigest({ title: "Approved plan" }, digest)).toBe(true);
    expect(matchesProjectMemoryDigest({ title: "Changed plan" }, digest)).toBe(false);
    expect(matchesProjectMemoryDigest({ title: "Approved plan" }, "not-a-digest")).toBe(false);
  });

  it("fails closed for invalid payloads", () => {
    expect(() => createProjectMemoryDigest({ value: undefined })).toThrow(
      "unsupported value",
    );
  });
});
