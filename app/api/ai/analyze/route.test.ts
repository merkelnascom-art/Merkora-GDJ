import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({ cookies: vi.fn(async () => ({})) }));
vi.mock("@/lib/server/supabase-rest", () => ({
  isSameOrigin: vi.fn(),
  getCurrentUser: vi.fn(),
  getAccessToken: vi.fn(),
  callUserData: vi.fn(),
}));

import { callUserData, getAccessToken, getCurrentUser, isSameOrigin } from "@/lib/server/supabase-rest";
import { POST } from "./route";

const user = { id: "user-1", email: null, fullName: null };
const project = { id: "MK-PROJECT-001", user_id: "user-1" };
const modelOutput = {
  summary: "L'activité a besoin d'un suivi opérationnel et financier à clarifier.",
  domain: "Entreprise / activité",
  understood: ["Les opérations doivent être mieux suivies."],
  questions: ["Qui valide les opérations ?"],
  recommendations: [{ title: "Suivi des ventes", description: "Centraliser les ventes enregistrées.", reason: "Le besoin mentionne des ventes." }],
  improvements: [{
    title: "Rapprochement quotidien", description: "Comparer les ventes et les encaissements.",
    expectedBenefit: "Identifier les écarts à vérifier.", effort: "medium", priority: "high",
    assumptions: ["Les justificatifs seront disponibles."],
  }],
  competitiveAnalysis: {
    summary: "La concurrence n'a pas été vérifiée.", comparisonCriteria: ["Fonctionnalités", "Prix"],
    opportunities: [], unknowns: ["Les offres réelles sont à vérifier."], nextSteps: ["Documenter les alternatives."],
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

function mockDatabase(consented = true) {
  vi.mocked(callUserData).mockImplementation(async (path) => {
    if (path.startsWith("user_projects?")) return { ok: true, status: 200, data: [project] };
    if (path.startsWith("project_ai_processing_consents?")) {
      return { ok: true, status: 200, data: consented ? [{ consented_at: "2026-11-13T08:00:00Z", revoked_at: null }] : [] };
    }
    if (path.startsWith("project_workspace_state?")) {
      return { ok: true, status: 200, data: [{ payload: { clientConfirmedChoices: { selectedUniversalSectorIds: ["S04-01"] } } }] };
    }
    return { ok: true, status: 200, data: [] };
  });
}

beforeEach(() => {
  vi.mocked(isSameOrigin).mockReturnValue(true);
  vi.mocked(getCurrentUser).mockResolvedValue(user);
  vi.mocked(getAccessToken).mockResolvedValue("user-token");
  mockDatabase();
});
afterEach(() => {
  delete process.env.GEMINI_API_KEY;
  delete process.env.GEMINI_MODEL;
  vi.clearAllMocks();
  vi.unstubAllGlobals();
});

describe("POST /api/ai/analyze safeguards", () => {
  it("rejects cross-origin requests before authentication or provider calls", async () => {
    vi.mocked(isSameOrigin).mockReturnValue(false);
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const response = await POST(makeRequest({ projectId: "MK-PROJECT-001" }, "https://attacker.test"));
    expect(response.status).toBe(403);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(getCurrentUser).not.toHaveBeenCalled();
  });

  it("requires a signed-in owner and a valid project", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(null);
    const response = await POST(makeRequest({ projectId: "MK-PROJECT-001" }));
    expect(response.status).toBe(401);
  });

  it("requires the project's recorded processing consent", async () => {
    mockDatabase(false);
    process.env.GEMINI_API_KEY = "test-only-secret";
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const response = await POST(makeRequest({
      projectId: "MK-PROJECT-001", title: "Suivi d'activité", category: "business",
      problem: "Je ne sais pas où passent les recettes.", desiredOutcome: "Suivre les ventes et les paiements.",
    }));
    expect(response.status).toBe(403);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("uses the recorded consent, includes saved client decisions and returns no provider identity", async () => {
    process.env.GEMINI_API_KEY = "test-only-secret";
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      candidates: [{ content: { parts: [{ text: JSON.stringify(modelOutput) }] } }],
    }), { status: 200, headers: { "Content-Type": "application/json" } }));
    vi.stubGlobal("fetch", fetchMock);
    const response = await POST(makeRequest({
      projectId: "MK-PROJECT-001",
      title: "Gestion de mon commerce",
      category: "business",
      problem: "Je vends beaucoup mais je ne sais pas où passe l'argent. J'ai des dépenses et des dettes.",
      desiredOutcome: "Suivre les ventes, les recettes et les paiements.",
      budget: "À définir",
      urgency: "normal",
    }));
    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    const requestBody = JSON.parse(String(options.body));
    expect(JSON.stringify(requestBody)).toContain("S04-01");
    const payload = await response.json();
    expect(payload.analysis.understood.join(" ")).toMatch(/Ventes et suivi commercial/);
    expect(payload.analysis.questions.join(" ")).toMatch(/Quelles sont vos sources de recettes|À quel moment l'écart apparaît-il/);
    expect(payload).not.toHaveProperty("provider");
    expect(payload).not.toHaveProperty("model");
    expect(JSON.stringify(payload)).not.toContain("test-only-secret");
  });

  it("does not call an external provider when the service is not configured", async () => {
    delete process.env.GEMINI_API_KEY;
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const response = await POST(makeRequest({
      projectId: "MK-PROJECT-001", title: "Suivi d'activité", category: "business",
      problem: "Je souhaite organiser les opérations de mon entreprise.",
      desiredOutcome: "Avoir un suivi clair de l'activité.",
    }));
    expect(response.status).toBe(503);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
