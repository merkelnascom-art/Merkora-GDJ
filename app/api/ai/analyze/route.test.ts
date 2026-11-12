import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => ({})),
}));

vi.mock("@/lib/server/supabase-rest", () => ({
  isSameOrigin: (request: Request) => {
    const origin = request.headers.get("origin");
    return Boolean(origin && new URL(origin).origin === new URL(request.url).origin);
  },
  getCurrentUser: vi.fn(),
}));

import { getCurrentUser } from "@/lib/server/supabase-rest";
import { POST } from "./route";

const modelOutput = {
  summary: "L'activité a besoin d'un suivi opérationnel et financier à clarifier.",
  domain: "Entreprise / activité",
  understood: ["Les opérations doivent être mieux suivies."],
  questions: ["Qui valide les opérations ?"],
  recommendations: [{
    title: "Suivi des ventes",
    description: "Centraliser les ventes enregistrées.",
    reason: "Le besoin mentionne des ventes.",
  }],
  improvements: [{
    title: "Rapprochement quotidien",
    description: "Comparer les ventes et les encaissements.",
    expectedBenefit: "Identifier les écarts à vérifier.",
    effort: "medium",
    priority: "high",
    assumptions: ["Les justificatifs seront disponibles."],
  }],
  competitiveAnalysis: {
    summary: "La concurrence n'a pas été vérifiée.",
    comparisonCriteria: ["Fonctionnalités", "Prix"],
    opportunities: [],
    unknowns: ["Les offres réelles sont à vérifier."],
    nextSteps: ["Documenter les alternatives."],
  },
  assumptions: ["Les données comptables restent à confirmer."],
  nextSteps: ["Valider le processus avec le responsable."],
};

function makeRequest(body: unknown, origin = "https://merkora.test") {
  return new Request("https://merkora.test/api/ai/analyze", {
    method: "POST",
    headers: { origin, "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

afterEach(() => {
  delete process.env.GEMINI_API_KEY;
  delete process.env.GEMINI_MODEL;
  vi.mocked(getCurrentUser).mockReset();
  vi.unstubAllGlobals();
});

describe("POST /api/ai/analyze Gemini safeguards", () => {
  it("rejects cross-origin requests before authentication or provider calls", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(makeRequest({ consent: true }, "https://attacker.test"));

    expect(response.status).toBe(403);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(getCurrentUser).not.toHaveBeenCalled();
  });

  it("requires explicit consent before transmitting any dossier data", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({
      id: "user-1", email: null, fullName: null,
    });
    process.env.GEMINI_API_KEY = "test-only-secret";
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(makeRequest({
      title: "Suivi d'activité",
      category: "business",
      problem: "Je ne sais pas où passent les recettes.",
      desiredOutcome: "Suivre les ventes et les paiements.",
      consent: false,
    }));

    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("uses Gemini only after consent and keeps deterministic financial evidence", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({
      id: "user-1", email: null, fullName: null,
    });
    process.env.GEMINI_API_KEY = "test-only-secret";
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      candidates: [{ content: { parts: [{ text: JSON.stringify(modelOutput) }] } }],
    }), { status: 200, headers: { "Content-Type": "application/json" } }));
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(makeRequest({
      title: "Gestion de mon commerce",
      category: "business",
      problem: "Je vends beaucoup mais je ne sais pas où passe l'argent. J'ai des dépenses et des dettes.",
      desiredOutcome: "Suivre les ventes, les recettes et les paiements.",
      budget: "À définir",
      urgency: "normal",
      consent: true,
    }));

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect((options.headers as Record<string, string>)["x-goog-api-key"]).toBe("test-only-secret");
    const payload = await response.json();
    expect(payload.provider).toBe("gemini");
    expect(payload.analysis.understood.join(" ")).toMatch(/Ventes et suivi commercial/);
    expect(payload.analysis.questions.join(" ")).toMatch(/Quelles sont vos sources de recettes|À quel moment l'écart apparaît-il/);
    expect(JSON.stringify(payload)).not.toContain("test-only-secret");
  });

  it("does not call Gemini for an unauthenticated session", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(null);
    process.env.GEMINI_API_KEY = "test-only-secret";
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(makeRequest({
      title: "Suivi d'activité",
      category: "business",
      problem: "Je souhaite organiser les opérations de mon entreprise.",
      desiredOutcome: "Avoir un suivi clair de l'activité.",
      consent: true,
    }));

    expect(response.status).toBe(401);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
