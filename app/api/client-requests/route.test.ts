import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({ cookies: vi.fn().mockResolvedValue({}) }));
vi.mock("@/lib/server/supabase-rest", () => ({
  callUserData: vi.fn(), getAccessToken: vi.fn(), getCurrentUser: vi.fn(), isSameOrigin: vi.fn(),
}));

import { callUserData, getAccessToken, getCurrentUser, isSameOrigin } from "@/lib/server/supabase-rest";
import { POST } from "./route";

const user = { id: "owner-123", email: "client@example.com", fullName: "Client" };
const ownedProject = {
  id: "MK-CLIENT-001",
  title: "Projet enregistré",
  category: "business",
  problem: "Données du projet sauvegardé dans le compte.",
  desired_outcome: "Suivre les opérations.",
  budget: "À définir",
  urgency: "normal",
  recommendations: [{ title: "Gestion", description: "Centraliser", reason: "Clarté" }],
};
const payload = {
  recordType: "mockup_version",
  project: { id: ownedProject.id, title: "Titre falsifié", problem: "Faux problème" },
  studio: {
    format: "dashboard", palette: "emerald", reviewStatus: "approved",
    reviewNote: "Je valide cette maquette.",
    enabledModules: ["staff"], selectedRecommendationIds: [],
  },
  quote: { amount: "", days: "", paymentTerms: "À convenir" },
  clientResponse: { choice: "undecided", comment: "" },
};
function makeRequest(body: unknown) {
  return new Request("https://merkora.test/api/client-requests", {
    method: "POST",
    headers: { origin: "https://merkora.test", "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}
beforeEach(() => {
  vi.mocked(isSameOrigin).mockReturnValue(true);
  vi.mocked(getCurrentUser).mockResolvedValue(user);
  vi.mocked(getAccessToken).mockResolvedValue("user-access-token");
});
afterEach(() => vi.clearAllMocks());

describe("POST /api/client-requests official mockup validation", () => {
  it("rejects cross-origin requests before touching project data", async () => {
    vi.mocked(isSameOrigin).mockReturnValue(false);
    const response = await POST(makeRequest(payload));
    expect(response.status).toBe(403);
    expect(callUserData).not.toHaveBeenCalled();
  });

  it("does not record a validation when the project is not owned by the signed-in client", async () => {
    vi.mocked(callUserData).mockResolvedValueOnce({ ok: true, status: 200, data: [] });
    const response = await POST(makeRequest(payload));
    expect(response.status).toBe(404);
    expect(callUserData).toHaveBeenCalledTimes(1);
    expect(String(vi.mocked(callUserData).mock.calls[0][0])).toContain("user_id=eq.owner-123");
  });

  it("records the exact decision using project data and identity resolved by the server", async () => {
    vi.mocked(callUserData)
      .mockResolvedValueOnce({ ok: true, status: 200, data: [ownedProject] })
      .mockResolvedValueOnce({ ok: true, status: 200, data: [{ id: "old-version" }] })
      .mockResolvedValueOnce({ ok: true, status: 201, data: [{ id: "request-version-2" }] });

    const response = await POST(makeRequest(payload));
    expect(response.status).toBe(200);
    expect(vi.mocked(callUserData)).toHaveBeenCalledTimes(3);
    const inserted = vi.mocked(callUserData).mock.calls[2][3] as { user_id: string; payload: Record<string, unknown> };
    expect(inserted.user_id).toBe(user.id);
    expect(inserted.payload).toMatchObject({
      project: { id: ownedProject.id, title: ownedProject.title, problem: ownedProject.problem },
      version: 2,
      officialDecision: {
        status: "approved",
        actorUserId: user.id,
        recordedAt: expect.any(String),
      },
      studio: { reviewStatus: "approved", reviewNote: "Je valide cette maquette." },
    });
  });
});
