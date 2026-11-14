import { describe, expect, it, vi } from "vitest";
import { generateProjectImplementationPatch } from "./project-ai-implementation";
import type { ImplementationBrief } from "./implementation-agent";

const brief: ImplementationBrief = {
  projectName: "Gestion RH",
  projectDescription: "Gérer les équipes.",
  planVersion: 2,
  planDigest: "a".repeat(64),
  modules: [{ id: "staff", title: "Personnel", description: "Dossiers employés." }],
  confirmedConstraints: [],
  acceptanceCriteria: ["L'administrateur peut consulter les employés."],
  openQuestions: [],
};
const patch = {
  summary: "Ajoute la liste des employés.",
  openQuestions: [],
  files: [{ path: "src/app/modules/staff/page.tsx", content: "export default function Page() { return <main>Personnel</main>; }" }],
};

describe("generateProjectImplementationPatch", () => {
  it("sends the approved brief to the configured provider and validates its JSON patch", async () => {
    const requestCompletion = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      choices: [{ message: { content: JSON.stringify(patch) } }],
    }), { status: 200 }));
    const result = await generateProjectImplementationPatch({
      brief, apiKey: "server-secret", model: "test-model", requestCompletion,
    });
    expect(result).toEqual({ ok: true, patch });
    expect(requestCompletion).toHaveBeenCalledWith(expect.objectContaining({
      apiKey: "server-secret", model: "test-model", maxTokens: 8_000, timeoutMs: 90_000,
    }));
  });

  it("fails closed on provider errors and malformed model output", async () => {
    const failed = await generateProjectImplementationPatch({
      brief, apiKey: "key", model: "model",
      requestCompletion: vi.fn().mockResolvedValue(new Response("no", { status: 503 })),
    });
    expect(failed).toMatchObject({ ok: false, reason: "provider_error" });

    const invalid = await generateProjectImplementationPatch({
      brief, apiKey: "key", model: "model",
      requestCompletion: vi.fn().mockResolvedValue(new Response(JSON.stringify({
        choices: [{ message: { content: "not-json" } }],
      }), { status: 200 })),
    });
    expect(invalid).toMatchObject({ ok: false, reason: "invalid_patch", detail: "invalid_json" });
  });

  it("does not call the provider without server credentials", async () => {
    const requestCompletion = vi.fn();
    const result = await generateProjectImplementationPatch({
      brief, apiKey: "", model: "model", requestCompletion,
    });
    expect(result).toMatchObject({ ok: false, reason: "provider_error" });
    expect(requestCompletion).not.toHaveBeenCalled();
  });
});
