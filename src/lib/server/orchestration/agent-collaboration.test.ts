import { describe, expect, it } from "vitest";
import { planAgentCollaboration, type AgentProviderConnection } from "./agent-collaboration";

const providers: AgentProviderConnection[] = [
  { providerId: "openai", status: "connected", capabilities: ["models.generate"] },
  { providerId: "anthropic", status: "connected", capabilities: ["messages.create"] },
  { providerId: "google-gemini", status: "not_configured", capabilities: ["generate_content"] },
];

describe("agent collaboration planner", () => {
  it("assigns separate connected providers to analysis and independent review", () => {
    const plan = planAgentCollaboration({
      projectId: "project-1",
      requestedRoles: ["analyst", "reviewer"],
      providers,
    });

    expect(plan.assignments).toEqual([
      { role: "analyst", providerId: "openai", capability: "models.generate" },
      { role: "reviewer", providerId: "anthropic", capability: "messages.create" },
    ]);
    expect(plan.blockedRoles).toEqual([]);
  });

  it("never assigns an unconnected provider and reports unavailable roles", () => {
    const plan = planAgentCollaboration({
      projectId: "project-2",
      requestedRoles: ["cross_checker"],
      providers,
    });

    expect(plan.assignments).toEqual([]);
    expect(plan.blockedRoles).toEqual(["cross_checker"]);
  });

  it("does not silently use the same provider as an independent reviewer", () => {
    const plan = planAgentCollaboration({
      projectId: "project-3",
      requestedRoles: ["analyst", "reviewer"],
      providers: [providers[0]],
    });

    expect(plan.assignments.map((assignment) => assignment.role)).toEqual(["analyst"]);
    expect(plan.blockedRoles).toEqual(["reviewer"]);
  });

  it("rejects empty project ids and unknown roles", () => {
    expect(() => planAgentCollaboration({ projectId: " ", requestedRoles: ["analyst"], providers }))
      .toThrow("A project identifier is required.");
    expect(() => planAgentCollaboration({ projectId: "project-4", requestedRoles: ["root"], providers }))
      .toThrow("Unknown agent role.");
  });

  it("removes duplicate role requests while preserving requested order", () => {
    const plan = planAgentCollaboration({
      projectId: "project-5",
      requestedRoles: ["reviewer", "reviewer", "analyst"],
      providers,
    });
    expect(plan.assignments).toEqual([
      { role: "reviewer", providerId: "anthropic", capability: "messages.create" },
      { role: "analyst", providerId: "openai", capability: "models.generate" },
    ]);
  });
});
