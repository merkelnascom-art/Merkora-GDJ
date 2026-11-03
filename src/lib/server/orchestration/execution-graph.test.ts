import { describe, expect, it } from "vitest";
import { orderExecutionTasks, type ExecutionGraphTask } from "./execution-graph";

describe("execution dependency graph", () => {
  it("orders tasks so every dependency appears before its consumer", () => {
    const tasks: ExecutionGraphTask[] = [
      { id: "deliver", dependencyIds: ["verify"] },
      { id: "verify", dependencyIds: ["build"] },
      { id: "build", dependencyIds: [] },
    ];

    expect(orderExecutionTasks(tasks)).toEqual(["build", "verify", "deliver"]);
  });

  it("rejects duplicate task identifiers and unknown dependencies", () => {
    expect(() => orderExecutionTasks([
      { id: "build", dependencyIds: [] },
      { id: "build", dependencyIds: [] },
    ])).toThrow("Duplicate task identifier");

    expect(() => orderExecutionTasks([
      { id: "deploy", dependencyIds: ["missing"] },
    ])).toThrow("Unknown task dependency");
  });

  it("rejects cyclic dependencies instead of returning an unsafe execution order", () => {
    expect(() => orderExecutionTasks([
      { id: "build", dependencyIds: ["deploy"] },
      { id: "deploy", dependencyIds: ["build"] },
    ])).toThrow("Cyclic task dependencies");
  });

  it("returns a stable order when independent tasks are available", () => {
    expect(orderExecutionTasks([
      { id: "z-task", dependencyIds: [] },
      { id: "a-task", dependencyIds: [] },
    ])).toEqual(["a-task", "z-task"]);
  });
});
