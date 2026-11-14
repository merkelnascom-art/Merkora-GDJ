import { describe, expect, it } from "vitest";
import { MERKORA_MCP_TOOLS } from "./tools";

describe("MerKora MCP tool contract", () => {
  it("exposes only the three read-only account tools", () => {
    expect(MERKORA_MCP_TOOLS.map((tool) => tool.name)).toEqual([
      "merkora_get_profile",
      "merkora_list_projects",
      "merkora_get_project",
    ]);
    expect(MERKORA_MCP_TOOLS.every((tool) => !/create|update|delete|write|deploy/i.test(tool.name))).toBe(true);
  });

  it("requires a bounded project_id for project reads", () => {
    const tool = MERKORA_MCP_TOOLS.find((item) => item.name === "merkora_get_project");
    expect(tool?.inputSchema.required).toEqual(["project_id"]);
    expect(tool?.inputSchema.properties.project_id).toEqual({
      type: "string",
      minLength: 1,
      maxLength: 160,
    });
    expect(tool?.inputSchema.additionalProperties).toBe(false);
  });

  it("does not permit undeclared arguments on any tool", () => {
    expect(MERKORA_MCP_TOOLS.every((tool) => tool.inputSchema.additionalProperties === false)).toBe(true);
  });
});
