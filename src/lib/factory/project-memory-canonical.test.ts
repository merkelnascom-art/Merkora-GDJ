import { describe, expect, it } from "vitest";
import { canonicalizeProjectMemoryPayload } from "./project-memory-canonical";

describe("canonicalizeProjectMemoryPayload", () => {
  it("serializes equivalent objects identically regardless of key insertion order", () => {
    expect(canonicalizeProjectMemoryPayload({ b: 2, a: 1 })).toBe(
      canonicalizeProjectMemoryPayload({ a: 1, b: 2 }),
    );
  });

  it("preserves array order while sorting object keys recursively", () => {
    expect(canonicalizeProjectMemoryPayload({
      tasks: [{ z: true, a: "task" }, { a: "next" }],
    })).toBe('{"tasks":[{"a":"task","z":true},{"a":"next"}]}');
  });

  it("rejects values that JSON would silently omit or distort", () => {
    expect(() => canonicalizeProjectMemoryPayload({ value: undefined })).toThrow(
      "unsupported value",
    );
    expect(() => canonicalizeProjectMemoryPayload({ value: Number.NaN })).toThrow(
      "finite number",
    );
  });

  it("rejects cyclic and non-plain objects", () => {
    const cyclic: Record<string, unknown> = {};
    cyclic.self = cyclic;
    expect(() => canonicalizeProjectMemoryPayload(cyclic)).toThrow("cyclic");
    expect(() => canonicalizeProjectMemoryPayload({ createdAt: new Date() })).toThrow(
      "plain object",
    );
  });
});
