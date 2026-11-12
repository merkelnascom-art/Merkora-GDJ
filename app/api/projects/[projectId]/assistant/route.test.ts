import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({ cookies: vi.fn().mockResolvedValue({}) }));
vi.mock("@/lib/server/supabase-rest", () => ({
  callUserData: vi.fn(), getAccessToken: vi.fn(), getCurrentUser: vi.fn(), isSameOrigin: vi.fn(),
}));

import { callUserData, getAccessToken, getCurrentUser, isSameOrigin } from "@/lib/server/supabase-rest";
import { POST } from "./route";

const user = { id: "client-1", email: "client@example.com", fullName: "Client" };
const context = { params: Promise.resolve({ projectId: "MK-PROJECT-001" }) };

function request(body: unknown) {
  return new Request("https://merkora.test/api/projects/MK-PROJECT-001/assistant", {
    method: "POST",
    headers: { origin: "https://merkora.test", "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.mocked(isSameOrigin).mockReturnValue(true);
  vi.mocked(getCurrentUser).mockResolvedValue(user);
  vi.mocked(getAccessToken).mockResolvedValue("client-token");
  vi.mocked(callUserData).mockResolvedValue({
    ok: true, status: 200, data: [{
      id: "MK-PROJECT-001", user_id: "client-1", title: "Gestion boutique",
      problem: "Je perds le suivi des employés", desired_outcome: "Suivre les retards et rapports",
    }],
  });
});
afterEach(() => { delete process.env.GEMINI_API_KEY; delete process.env.GEMINI_MODEL; vi.clearAllMocks(); vi.unstubAllGlobals(); });

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

  it("returns structured provider-free advice for the authenticated project owner", async () => {
    const response = await POST(request({
      message: "Je veux suivre les retards du personnel et les rapports de caisse",
      history: [],
    }), context);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.reply.suggestedModules.map((item: { id: string }) => item.id))
      .toEqual(expect.arrayContaining(["staff-attendance", "cash-reports"]));
    expect(body.aiProviderCalled).toBe(false);
    expect(body.reply.disclaimer).toMatch(/aucun module.*encore validé/i);
  });

  it("does not call Gemini when the client has not explicitly consented", async () => {
    process.env.GEMINI_API_KEY = "test-only-secret";
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const response = await POST(request({
      message: "Je veux suivre les retards du personnel et les rapports de caisse",
      history: [],
      consent: false,
    }), context);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.provider).toBe("local");
    expect(body.aiProviderCalled).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("calls Gemini only after consent and preserves MerKora's module decisions", async () => {
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
      consent: true,
    }), context);
    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const body = await response.json();
    expect(body.provider).toBe("gemini");
    expect(body.aiProviderCalled).toBe(true);
    expect(body.reply.assistantMessage).toContain("préciser les retards");
    expect(body.reply.suggestedModules.map((item: { id: string }) => item.id))
      .toEqual(expect.arrayContaining(["staff-attendance", "cash-reports"]));
    expect(body.reply.suggestedModules.map((item: { id: string }) => item.id))
      .not.toContain("unapproved-module");
    expect(JSON.stringify(body)).not.toContain("test-only-secret");
  });

  it("falls back to the deterministic reply when Gemini is unavailable", async () => {
    process.env.GEMINI_API_KEY = "test-only-secret";
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network unavailable")));
    const response = await POST(request({
      message: "Je veux suivre les retards du personnel et les rapports de caisse",
      history: [],
      consent: true,
    }), context);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.provider).toBe("unavailable");
    expect(body.aiProviderCalled).toBe(false);
    expect(body.reply.suggestedModules.map((item: { id: string }) => item.id))
      .toEqual(expect.arrayContaining(["staff-attendance", "cash-reports"]));
  });

  it("rejects malformed messages", async () => {
    const response = await POST(request({ message: " " }), context);
    expect(response.status).toBe(400);
  });
});
