import { describe, expect, it } from "vitest";
import { isModuleId, validateModulePayload, MAX_MODULE_PAYLOAD_BYTES } from "./module-data";

describe("module data validation", () => {
  it("accepts safe module identifiers", () => {
    expect(isModuleId("attendance")).toBe(true);
    expect(isModuleId("staff-management")).toBe(true);
  });

  it("rejects unsafe module identifiers", () => {
    expect(isModuleId("../admin")).toBe(false);
    expect(isModuleId("123-module")).toBe(false);
    expect(isModuleId("module/name")).toBe(false);
  });

  it("accepts bounded JSON object payloads", () => {
    expect(validateModulePayload({ items: [{ id: "a", done: false }] })).toBe(true);
    expect(validateModulePayload({ text: "x".repeat(MAX_MODULE_PAYLOAD_BYTES) })).toBe(false);
  });

  it("rejects arrays, primitives and cyclic values", () => {
    expect(validateModulePayload([])).toBe(false);
    expect(validateModulePayload(null)).toBe(false);
    expect(validateModulePayload("value")).toBe(false);
    const cyclic: Record<string, unknown> = {};
    cyclic.self = cyclic;
    expect(validateModulePayload(cyclic)).toBe(false);
  });
});
