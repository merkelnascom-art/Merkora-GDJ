import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/ai-provider", () => ({ requestAiGatewayCompletion: vi.fn() }));

vi.mock("@/lib/server/supabase-rest", () => ({
  isSameOrigin: (request: Request) => {
    const origin = request.headers.get("origin");
    return Boolean(origin && new URL(origin).origin === new URL(request.url).origin);
  },
}));

import { requestAiGatewayCompletion } from "@/lib/ai-provider";
import { POST } from "./route";

afterEach(() => {
  delete process.env.MERKORA_AI_ENABLED;
  delete process.env.AI_GATEWAY_API_KEY;
  delete process.env.VERCEL_OIDC_TOKEN;
  vi.unstubAllGlobals();
});

describe("POST /api/ai/analyze cost and origin gates", () => {
  it("does not call any provider when the AI feature flag is disabled", async () => {
    process.env.MERKORA_AI_ENABLED = "false";
    process.env.AI_GATEWAY_API_KEY = "test-only-secret";
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(new Request("https://merkora.test/api/ai/analyze", {
      method: "POST",
      headers: { origin: "https://merkora.test", "content-type": "application/json" },
      body: "{malformed json is never parsed while disabled",
    }));

    expect(response.status).toBe(503);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(requestAiGatewayCompletion).not.toHaveBeenCalled();
    expect(await response.json()).toMatchObject({ error: expect.stringMatching(/désactivée/i) });
  });


  it("validates and returns improvements while marking unsourced competitor research as unverified", async () => {
    process.env.MERKORA_AI_ENABLED = "true";
    process.env.AI_GATEWAY_API_KEY = "test-only-secret";
    vi.mocked(requestAiGatewayCompletion).mockResolvedValueOnce(new Response(JSON.stringify({
      choices: [{ message: { content: JSON.stringify({
        summary: "Analyse de test",
        domain: "Organisation",
        understood: ["Équipe à suivre"],
        questions: [],
        recommendations: [{ title: "Piste A", description: "Description A", reason: "Motif A" }],
        improvements: [
          { title: "Amélioration A", description: "Clarifier les rôles", expectedBenefit: "Réduire les oublis", effort: "unexpected", priority: "urgent", assumptions: ["À confirmer"] },
          { title: "Incomplète", description: "", expectedBenefit: "Sans description" },
        ],
        competitiveAnalysis: {
          summary: "Aucune recherche web réalisée",
          comparisonCriteria: ["Prix"],
          opportunities: [],
          unknowns: ["Prix actuels à vérifier"],
          nextSteps: ["Consulter les sites officiels"],
        },
        assumptions: [],
        nextSteps: ["Confirmer le besoin"],
      }) } }],
    }), { status: 200, headers: { "Content-Type": "application/json" } }));

    const response = await POST(new Request("https://merkora.test/api/ai/analyze", {
      method: "POST",
      headers: { origin: "https://merkora.test", "content-type": "application/json" },
      body: JSON.stringify({
        title: "Suivi d’équipe",
        category: "organization",
        problem: "Je ne sais pas qui est présent et quelles tâches avancent.",
        desiredOutcome: "Suivre les présences et les tâches de chaque personne.",
      }),
    }));

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.analysis.improvements).toHaveLength(1);
    expect(data.analysis.improvements[0]).toMatchObject({ effort: "unknown", priority: "medium" });
    expect(data.analysis.competitiveAnalysis.researchStatus).toBe("not_verified");
    expect(requestAiGatewayCompletion).toHaveBeenCalledTimes(1);
  });

  it("rejects a cross-origin request before checking credentials or calling a provider", async () => {
    process.env.MERKORA_AI_ENABLED = "true";
    process.env.AI_GATEWAY_API_KEY = "test-only-secret";
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(new Request("https://merkora.test/api/ai/analyze", {
      method: "POST",
      headers: { origin: "https://attacker.test", "content-type": "application/json" },
      body: "{}",
    }));

    expect(response.status).toBe(403);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
