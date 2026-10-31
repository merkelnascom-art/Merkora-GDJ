import { describe, expect, it } from "vitest";
import { planProjectExecution } from "./project-execution-planner";

const connections = [
  { providerId: "github", status: "connected", capabilities: ["repositories.read", "branches.write", "pull_requests.manage"] },
  { providerId: "supabase", status: "connected", capabilities: ["database.read"] },
  { providerId: "vercel", status: "not_configured", capabilities: ["previews.create"] },
  { providerId: "openai", status: "connected", capabilities: ["models.generate"] },
  { providerId: "figma", status: "connected", capabilities: ["design.create"] },
] as const;

describe("project execution planner", () => {
  it("selects only connected tools that provide capabilities required by this project", () => {
    const plan = planProjectExecution({
      projectId: "project-123",
      requirements: ["web_application", "database", "visual_design"],
      connections,
    });

    expect(plan.selectedProviders).toEqual(["figma", "github", "openai", "supabase"]);
    expect(plan.blockedCapabilities).toContain("previews.create");
    expect(plan.tasks.map((task) => task.id)).toContain("prepare_delivery");
  });

  it("does not schedule paid AI generation when its provider is not connected", () => {
    const plan = planProjectExecution({
      projectId: "project-456",
      requirements: ["ai_features"],
      connections: [{ providerId: "openai", status: "not_configured", capabilities: ["models.generate"] }],
    });

    expect(plan.selectedProviders).toEqual([]);
    expect(plan.blockedCapabilities).toContain("models.generate");
    expect(plan.tasks.some((task) => task.providerId === "openai")).toBe(false);
  });

  it("requires explicit approval before production deployment and data writes", () => {
    const plan = planProjectExecution({
      projectId: "project-789",
      requirements: ["web_application", "database", "production_deployment"],
      connections: [
        { providerId: "github", status: "connected", capabilities: ["repositories.read", "branches.write"] },
        { providerId: "supabase", status: "connected", capabilities: ["database.read", "database.write"] },
        { providerId: "vercel", status: "connected", capabilities: ["previews.create", "production.deploy"] },
      ],
    });

    expect(plan.approvalsRequired).toEqual(["database.write", "production.deploy"]);
    expect(plan.tasks.some((task) => task.capability === "production.deploy" && task.requiresApproval)).toBe(true);
  });
});
