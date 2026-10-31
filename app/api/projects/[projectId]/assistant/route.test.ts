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
afterEach(() => vi.clearAllMocks());

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
    expect(body.reply.disclaimer).toMatch(/pas encore validé/i);
  });

  it("rejects malformed messages", async () => {
    const response = await POST(request({ message: " " }), context);
    expect(response.status).toBe(400);
  });
});
