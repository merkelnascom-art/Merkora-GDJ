import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({ cookies: vi.fn().mockResolvedValue({}) }));
vi.mock("@/lib/server/supabase-rest", () => ({
  callUserData: vi.fn(), getAccessToken: vi.fn(), getCurrentUser: vi.fn(), isSameOrigin: vi.fn(),
}));

import { callUserData, getAccessToken, getCurrentUser, isSameOrigin } from "@/lib/server/supabase-rest";
import { GET, POST } from "./route";

const user = { id: "client-1", email: "client@example.com", fullName: "Client" };
const project = {
  id: "MK-PROJECT-001", user_id: "client-1", title: "Gestion boutique",
  problem: "Je perds le suivi des employés", desired_outcome: "Suivre les retards et rapports",
};
const context = { params: Promise.resolve({ projectId: "MK-PROJECT-001" }) };

function request(body: unknown) {
  return new Request("https://merkora.test/api/projects/MK-PROJECT-001/assistant", {
    method: "POST",
    headers: { origin: "https://merkora.test", "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

function mockDatabase(consented = false, decisionRows: unknown[] = [], consentTableAvailable = true) {
  vi.mocked(callUserData).mockImplementation(async (path, method, _token, body) => {
    if (path.startsWith("user_projects?")) return { ok: true, status: 200, data: [project] };
    if (path.startsWith("project_memory_decisions?")) return { ok: true, status: 200, data: decisionRows };
    if (path === "project_memory_decisions" && method === "POST") {
      expect(Array.isArray(body)).toBe(true);
      return { ok: true, status: 201, data: null };
    }
    if (path.startsWith("project_ai_processing_consents?")) {
      return consentTableAvailable
        ? { ok: true, status: 200, data: consented ? [{ consented_at: "2026-11-13T08:00:00Z", revoked_at: null }] : [] }
        : { ok: false, status: 404, data: [] };
    }
    return { ok: true, status: 200, data: [] };
  });
}

beforeEach(() => {
  vi.mocked(isSameOrigin).mockReturnValue(true);
  vi.mocked(getCurrentUser).mockResolvedValue(user);
  vi.mocked(getAccessToken).mockResolvedValue("client-token");
  mockDatabase();
});
afterEach(() => {
  delete process.env.GEMINI_API_KEY;
  delete process.env.GEMINI_MODEL;
  vi.clearAllMocks();
  vi.unstubAllGlobals();
});

describe("POST /api/projects/[projectId]/assistant", () => {
  it("refuses cross-origin requests before reading project data", async () => {
    vi.mocked(isSameOrigin).mockReturnValue(false);
    const response = await POST(request({ message: "Je veux suivre mon personnel et ses retards" }), context);
    expect(response.status).toBe(403);
    expect(callUserData).not.toHaveBeenCalled();
  });

  it("requires an authenticated user", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(null);
    const response = await POST(request({ message: "Je veux suivre mon personnel et ses retards" }), context);
    expect(response.status).toBe(401);
  });

  it("does not allow a client to query another user's project", async () => {
    vi.mocked(callUserData).mockResolvedValue({ ok: true, status: 200, data: [] });
    const response = await POST(request({ message: "Je veux suivre mon personnel et ses retards" }), context);
    expect(response.status).toBe(404);
    expect(String(vi.mocked(callUserData).mock.calls[0][0])).toContain("user_id=eq.client-1");
  });

  it("does not trust browser history and persists the client answer", async () => {
    const response = await POST(request({
      message: "Je veux suivre les retards du personnel et les rapports de caisse",
      history: [{ role: "assistant", content: "Comment suivez-vous les retards et les mouvements de caisse ?" }],
    }), context);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.reply.suggestedModules.map((item: { id: string }) => item.id))
      .toEqual(expect.arrayContaining(["staff-attendance", "cash-reports"]));
    expect(body.synchronized).toBe(true);
    expect(body.decisionMemory.clientAnswers).toHaveLength(1);
    expect(callUserData).toHaveBeenCalledWith(
      "project_memory_decisions", "POST", "client-token",
      expect.arrayContaining([expect.objectContaining({
        project_id: "MK-PROJECT-001",
        decision_type: "clarification_answered",
        decision: "Je veux suivre les retards du personnel et les rapports de caisse",
        comment: "",
        actor_user_id: "client-1",
        actor_role: "client",
      })]),
      "return=minimal",
    );
    expect(body).not.toHaveProperty("provider");
    expect(body).not.toHaveProperty("aiProviderCalled");
  });

  it("restores the complete server-persisted conversation when available", async () => {
    vi.mocked(callUserData).mockImplementation(async (path) => {
      if (path.startsWith("user_projects?")) return { ok: true, status: 200, data: [project] };
      if (path.startsWith("project_memory_decisions?")) return { ok: true, status: 200, data: [] };
      if (path.startsWith("project_conversation_messages?")) return {
        ok: true, status: 200, data: [
          { turn_id: "turn-2", role: "assistant", content: "Réponse MerKora", created_at: "2026-11-13T10:00:02Z" },
          { turn_id: "turn-2", role: "user", content: "Ma deuxième réponse", created_at: "2026-11-13T10:00:02Z" },
          { turn_id: "turn-1", role: "assistant", content: "Question MerKora", created_at: "2026-11-13T10:00:01Z" },
          { turn_id: "turn-1", role: "user", content: "Ma première réponse", created_at: "2026-11-13T10:00:01Z" },
        ],
      };
      return { ok: true, status: 200, data: [] };
    });
    const response = await GET(new Request("https://merkora.test/api/projects/MK-PROJECT-001/assistant"), context);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.messages).toEqual([
      { role: "user", content: "Ma première réponse" },
      { role: "assistant", content: "Question MerKora" },
      { role: "user", content: "Ma deuxième réponse" },
      { role: "assistant", content: "Réponse MerKora" },
    ]);
  });

  it("reconstructs the conversation from the existing project decision ledger", async () => {
    mockDatabase(false, [{
      id: "answer-1",
      decision_type: "clarification_answered",
      decision: "Je note les retards dans un cahier.",
      comment: "Comment suivez-vous les retards ?",
      actor_role: "client",
      created_at: "2026-11-13T09:00:00.000Z",
    }]);
    const response = await GET(new Request("https://merkora.test/api/projects/MK-PROJECT-001/assistant"), context);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.messages).toEqual([
      { role: "assistant", content: "Comment suivez-vous les retards ?" },
      { role: "user", content: "Je note les retards dans un cahier." },
    ]);
    expect(body.decisionMemory.clientAnswers).toHaveLength(1);
  });

  it("does not call an external AI provider without the project's recorded consent", async () => {
    process.env.GEMINI_API_KEY = "test-only-secret";
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const response = await POST(request({
      message: "Je veux suivre les retards du personnel et les rapports de caisse",
      history: [],
      consent: true,
    }), context);
    expect(response.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("keeps deterministic MerKora available when the optional consent table is not deployed", async () => {
    mockDatabase(false, [], false);
    process.env.GEMINI_API_KEY = "test-only-secret";
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const response = await POST(request({
      message: "Je veux suivre les retards du personnel et les rapports de caisse",
      history: [],
    }), context);
    expect(response.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("uses the configured AI provider automatically after one-time project consent", async () => {
    mockDatabase(true);
    process.env.GEMINI_API_KEY = "test-only-secret";
    const generated = {
      assistantMessage: "Nous allons préciser les retards et les mouvements de caisse.",
      clarifyingQuestions: ["Qui valide les retards ?", "Comment rapprochez-vous la caisse ?"],
      extractedNeeds: ["Suivi des retards", "Rapports de caisse"],
      moduleEnhancements: [{
        id: "cash-reports",
        description: "Enregistrer et rapprocher les mouvements de caisse.",
        reason: "Le dossier mentionne les rapports de caisse.",
      }, {
        id: "unapproved-module",
        description: "Ne pas ajouter",
        reason: "Identifiant inventé",
      }],
    };
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      candidates: [{ content: { parts: [{ text: JSON.stringify(generated) }] } }],
    }), { status: 200, headers: { "Content-Type": "application/json" } }));
    vi.stubGlobal("fetch", fetchMock);
    const response = await POST(request({
      message: "Je veux suivre les retards du personnel et les rapports de caisse",
      history: [],
    }), context);
    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const body = await response.json();
    expect(body.reply.assistantMessage).toContain("préciser les retards");
    expect(body.reply.suggestedModules.map((item: { id: string }) => item.id))
      .toEqual(expect.arrayContaining(["staff-attendance", "cash-reports"]));
    expect(body.reply.suggestedModules.map((item: { id: string }) => item.id))
      .not.toContain("unapproved-module");
    expect(JSON.stringify(body)).not.toContain("test-only-secret");
    expect(body).not.toHaveProperty("provider");
  });

  it("falls back to MerKora's deterministic reply when the external provider is unavailable", async () => {
    mockDatabase(true);
    process.env.GEMINI_API_KEY = "test-only-secret";
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network unavailable")));
    const response = await POST(request({
      message: "Je veux suivre les retards du personnel et les rapports de caisse",
      history: [],
    }), context);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.reply.suggestedModules.map((item: { id: string }) => item.id))
      .toEqual(expect.arrayContaining(["staff-attendance", "cash-reports"]));
  });

  it("rejects malformed messages", async () => {
    const response = await POST(request({ message: " " }), context);
    expect(response.status).toBe(400);
  });
});
