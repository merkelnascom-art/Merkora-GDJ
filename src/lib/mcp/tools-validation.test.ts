import { describe, expect, it } from "vitest";
import { validateMcpToolArguments } from "./tools";

describe("validateMcpToolArguments", () => {
  it("rejects undeclared properties instead of silently ignoring them", () => {
    expect(validateMcpToolArguments("merkora_list_projects", { admin: true })).toBe(false);
  });

  it("rejects a missing or oversized project identifier", () => {
    expect(validateMcpToolArguments("merkora_get_project", {})).toBe(false);
    expect(validateMcpToolArguments("merkora_get_project", { project_id: "x".repeat(161) })).toBe(false);
  });

  it("accepts a bounded project identifier", () => {
    expect(validateMcpToolArguments("merkora_get_project", { project_id: "MK-123" })).toBe(true);
  });

  it("rejects unknown tool names", () => {
    expect(validateMcpToolArguments("merkora_delete_project", {})).toBe(false);
  });
});
