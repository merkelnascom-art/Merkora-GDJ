/**
 * Bounded two-role orchestration core.
 *
 * This module has no provider SDK, network access, secrets, or billing logic.
 * A caller injects a runner; tests use deterministic mocks. The workflow
 * always performs at most two sequential calls: analyst, then critic.
 */
export type MultiAiRole = "analyst" | "critic";

export type MultiAiTaskInput = {
  role: MultiAiRole;
  request: string;
  previousOutput?: string;
  maxOutputChars: number;
};

export interface MultiAiTaskRunner {
  run(input: MultiAiTaskInput): Promise<string>;
}

export type TwoRoleWorkflowInput = {
  request: string;
  runner: MultiAiTaskRunner;
};

export type TwoRoleWorkflowResult = {
  analysis: string;
  critique: string;
  synthesis: string;
  callsUsed: 2;
};

const MAX_REQUEST_CHARS = 8_000;
const MAX_OUTPUT_CHARS = 6_000;
const MAX_CALLS = 2 as const;

function validateOutput(value: unknown, role: MultiAiRole): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`La réponse de l'${role === "analyst" ? "analyste" : "critique"} est vide ou invalide.`);
  }
  if (value.length > MAX_OUTPUT_CHARS) {
    throw new Error(`La réponse du rôle ${role} dépasse la limite autorisée.`);
  }
  return value.trim();
}

export async function runTwoRoleWorkflow(
  input: TwoRoleWorkflowInput,
): Promise<TwoRoleWorkflowResult> {
  const request = input.request.trim();
  if (!request) throw new Error("La demande MerKora est obligatoire.");
  if (request.length > MAX_REQUEST_CHARS) {
    throw new Error("La demande MerKora dépasse la limite autorisée.");
  }

  // Fixed sequence and fixed call budget: no model can add steps or recurse.
  const analysis = validateOutput(await input.runner.run({
    role: "analyst",
    request,
    maxOutputChars: MAX_OUTPUT_CHARS,
  }), "analyst");

  const critique = validateOutput(await input.runner.run({
    role: "critic",
    request,
    previousOutput: analysis,
    maxOutputChars: MAX_OUTPUT_CHARS,
  }), "critic");

  const synthesis = [
    "ANALYSE INITIALE",
    analysis,
    "",
    "CONTRE-ANALYSE ET POINTS À VÉRIFIER",
    critique,
    "",
    "SYNTHÈSE",
    "Conserver les constats de l'analyse et traiter les objections de la contre-analyse comme des vérifications à effectuer. Aucun désaccord n'est supprimé automatiquement.",
  ].join("\n");

  return { analysis, critique, synthesis, callsUsed: MAX_CALLS };
}
