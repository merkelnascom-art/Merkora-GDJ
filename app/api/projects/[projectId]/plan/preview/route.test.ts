import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({ cookies: vi.fn().mockResolvedValue({}) }));
vi.mock("@/lib/server/supabase-rest", () => ({
  callUserData: vi.fn(),
  getAccessToken: vi.fn(),
  getCurrentUser: vi.fn(),
  isSameOrigin: vi.fn(),
}));

import { callUserData, getAccessToken, getCurrentUser, isSameOrigin } from "@/lib/server/supabase-rest";
import { POST } from "./route";

const user = { id: "user-123", email: "client@example.com", fullName: "Client" };
const projectRow = {
  id: "MK-API-001",
  user_id: user.id,
  title: "Suivi d'équipe",
  category: "organization",
  problem: "Je ne sais pas qui est présent et quelles tâches avancent dans mon équipe.",
  desired_outcome: "Suivre les présences et les responsabilités de chaque personne.",
  budget: "À définir",
  urgency: "normal",
  status: "discovery",
  recommendations: [],
  created_at: "2026-10-30T00:00:00.000Z",
  updated_at: "2026-10-30T00:00:00.000Z",
};

function request(body: string, origin = "https://merkora.test") {
  return new Request("https://merkora.test/api/projects/MK-API-001/plan/preview", {
    method: "POST",
    headers: { origin, "content-type": "application/json" },
    body,
  });
}

function params(projectId = "MK-API-001") {
  return { params: Promise.resolve({ projectId }) };
}

beforeEach(() => {
  vi.mocked(isSameOrigin).mockReturnValue(true);
  vi.mocked(getCurrentUser).mockResolvedValue(user);
  vi.mocked(getAccessToken).mockResolvedValue("test-access-token");
  vi.mocked(callUserData).mockResolvedValue({ ok: true, status: 200, data: [projectRow] });
});

afterEach(() => vi.clearAllMocks());

describe("POST /api/projects/[projectId]/plan/preview", () => {
  it("rejects cross-origin requests before reading user data", async () => {
    vi.mocked(isSameOrigin).mockReturnValue(false);

    const response = await POST(request(JSON.stringify({ briefVersion: 1, planVersion: 1, plannerVersion: "1.0.0" })), params());

    expect(response.status).toBe(403);
    expect(getCurrentUser).not.toHaveBeenCalled();
    expect(callUserData).not.toHaveBeenCalled();
  });

  it("requires an authenticated user", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(null);

    const response = await POST(request(JSON.stringify({ briefVersion: 1, planVersion: 1, plannerVersion: "1.0.0" })), params());

    expect(response.status).toBe(401);
    expect(callUserData).not.toHaveBeenCalled();
  });

  it("scopes the project lookup to the signed-in user", async () => {
    const response = await POST(request(JSON.stringify({ briefVersion: 1, planVersion: 1, plannerVersion: "1.0.0" })), params());

    expect(response.status).toBe(200);
    expect(callUserData).toHaveBeenCalledWith(
      expect.stringContaining(`user_id=eq.${encodeURIComponent(user.id)}`),
      "GET",
      "test-access-token",
    );
  });

  it("returns 404 when the project is missing or not owned by the signed-in user", async () => {
    vi.mocked(callUserData).mockResolvedValue({ ok: true, status: 200, data: [] });

    const response = await POST(request(JSON.stringify({ briefVersion: 1, planVersion: 1, plannerVersion: "1.0.0" })), params());

    expect(response.status).toBe(404);
  });

  it("rejects malformed JSON and invalid plan metadata", async () => {
    const malformedJson = await POST(request("{not-json"), params());
    const malformedMetadata = await POST(request(JSON.stringify({
      briefVersion: 0,
      planVersion: -1,
      plannerVersion: "",
      selectedOptions: [{ id: "", title: "", description: "" }],
    })), params());

    expect(malformedJson.status).toBe(400);
    expect(malformedMetadata.status).toBe(400);
    expect(callUserData).not.toHaveBeenCalled();
  });

  it("returns a deterministic preview with the requested source version", async () => {
    const response = await POST(request(JSON.stringify({
      briefVersion: 2,
      planVersion: 1,
      plannerVersion: "1.0.0",
      selectedOptions: [{ id: "attendance", title: "Suivi des présences", description: "Enregistrer les arrivées." }],
      approvedScope: [],
      confirmedConstraints: [],
    })), params());

    const payload = await response.json();
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(payload.plan).toMatchObject({
      projectId: "MK-API-001",
      briefVersion: 2,
      version: 1,
      plannerVersion: "1.0.0",
      includedScope: [{ id: "attendance", source: "selected_option" }],
    });
  });

  it("does not call an external AI provider or write project data", async () => {
    const response = await POST(request(JSON.stringify({ briefVersion: 1, planVersion: 1, plannerVersion: "1.0.0" })), params());

    expect(response.status).toBe(200);
    expect(callUserData).toHaveBeenCalledTimes(1);
    expect(vi.mocked(callUserData).mock.calls[0][1]).toBe("GET");
  });

  it("returns service unavailable instead of fabricating a plan when Supabase is not configured", async () => {
    vi.mocked(callUserData).mockRejectedValue(new Error("SUPABASE_NOT_CONFIGURED"));

    const response = await POST(request(JSON.stringify({ briefVersion: 1, planVersion: 1, plannerVersion: "1.0.0" })), params());

    expect(response.status).toBe(503);
  });
});
