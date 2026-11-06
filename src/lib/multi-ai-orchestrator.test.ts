import { describe, expect, it, vi } from "vitest";
import { runTwoRoleWorkflow, type MultiAiTaskRunner, type MultiAiTaskInput } from "./multi-ai-orchestrator";

describe("runTwoRoleWorkflow", () => {
  it("runs the analyst then an independent critic, and keeps both outputs in the synthesis", async () => {
    const calls: string[] = [];
    const runner: MultiAiTaskRunner = {
      run: vi.fn(async ({ role, previousOutput }: MultiAiTaskInput) => {
        calls.push(role);
        if (role === "analyst") return "Le commerçant perd le suivi de ses ventes.";
        expect(previousOutput).toContain("suivi de ses ventes");
        return "Vérifier aussi les retours, annulations et ventes à crédit.";
      }),
    };

    const result = await runTwoRoleWorkflow({
      request: "Je ne comprends pas mes recettes en fin de mois.",
      runner,
    });

    expect(calls).toEqual(["analyst", "critic"]);
    expect(result.analysis).toContain("suivi de ses ventes");
    expect(result.critique).toContain("ventes à crédit");
    expect(result.synthesis).toContain(result.analysis);
    expect(result.synthesis).toContain(result.critique);
    expect(runner.run).toHaveBeenCalledTimes(2);
  });

  it("stops immediately when the analyst fails or returns an empty result", async () => {
    const runner: MultiAiTaskRunner = {
      run: vi.fn(async () => "   "),
    };

    await expect(runTwoRoleWorkflow({
      request: "Besoin de diagnostic",
      runner,
    })).rejects.toThrow("analyste");
    expect(runner.run).toHaveBeenCalledTimes(1);
  });

  it("rejects an empty request without calling any provider", async () => {
    const runner: MultiAiTaskRunner = {
      run: vi.fn(async () => "Réponse simulée"),
    };

    await expect(runTwoRoleWorkflow({ request: "  ", runner })).rejects.toThrow("demande");
    expect(runner.run).not.toHaveBeenCalled();
  });

  it("does not call the critic when the analyst provider throws", async () => {
    const runner: MultiAiTaskRunner = {
      run: vi.fn(async () => { throw new Error("provider offline"); }),
    };

    await expect(runTwoRoleWorkflow({
      request: "Besoin de diagnostic",
      runner,
    })).rejects.toThrow("provider offline");
    expect(runner.run).toHaveBeenCalledTimes(1);
  });
});
