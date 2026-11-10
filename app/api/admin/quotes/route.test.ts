import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({ cookies: vi.fn().mockResolvedValue({}) }));
vi.mock("@/lib/server/admin-access", () => ({ getAdminAccess: vi.fn() }));
vi.mock("@/lib/server/supabase-rest", () => ({
  callUserData: vi.fn(), getAccessToken: vi.fn(), isSameOrigin: vi.fn(),
}));

import { getAdminAccess } from "@/lib/server/admin-access";
import { callUserData, getAccessToken, isSameOrigin } from "@/lib/server/supabase-rest";
import { POST } from "./route";

const requestId = "b2c3d4e5-f678-4123-8abc-1234567890ab";
const clientRequest = {
  id: requestId, user_id: "client-1", user_email: "client@example.com",
  project_id: "MK-001", project_title: "Projet client", payload: { recordType: "client_request" },
};
const quote = {
  title: "Conception et réalisation",
  description: "Développement de la solution.",
  amount: 150000,
  recurringAmount: 0,
  discount: 0,
  taxRateBasisPoints: null,
  taxConfirmed: true,
  validUntil: "2026-12-31",
  scope: "Périmètre convenu.",
  exclusions: "Aucune.",
  assumptionsText: "",
  paymentTerms: "Acompte à convenir.",
};
function makeRequest() {
  return new Request("https://merkora.test/api/admin/quotes", {
    method: "POST", headers: { origin: "https://merkora.test", "content-type": "application/json" },
    body: JSON.stringify({ requestId, action: "save_draft", quote }),
  });
}
beforeEach(() => {
  vi.mocked(isSameOrigin).mockReturnValue(true);
  vi.mocked(getAdminAccess).mockResolvedValue({ ok: true, user: { id: "admin-1", email: "admin@example.com" } });
  vi.mocked(getAccessToken).mockResolvedValue("admin-token");
});
afterEach(() => vi.clearAllMocks());

describe("POST /api/admin/quotes concept-approval gate", () => {
  it("blocks quote preparation until the latest mockup version is officially approved", async () => {
    vi.mocked(callUserData)
      .mockResolvedValueOnce({ ok: true, status: 200, data: [clientRequest] })
      .mockResolvedValueOnce({
        ok: true, status: 200,
        data: [{ id: "mockup-v2", payload: { recordType: "mockup_version", officialDecision: { status: "changes_requested" } } }],
      });
    const response = await POST(makeRequest());
    expect(response.status).toBe(409);
    expect(callUserData).toHaveBeenCalledTimes(2);
  });

  it("allows quote preparation after the latest mockup version is officially approved", async () => {
    vi.mocked(callUserData)
      .mockResolvedValueOnce({ ok: true, status: 200, data: [clientRequest] })
      .mockResolvedValueOnce({
        ok: true, status: 200,
        data: [{ id: "mockup-v3", payload: { recordType: "mockup_version", officialDecision: { status: "approved" } } }],
      })
      .mockResolvedValueOnce({ ok: true, status: 200, data: [] })
      .mockResolvedValueOnce({ ok: true, status: 201, data: [{ id: "quote-1" }] })
      .mockResolvedValueOnce({ ok: true, status: 200, data: [] })
      .mockResolvedValueOnce({ ok: true, status: 201, data: [{ id: "quote-version-1" }] });
    const response = await POST(makeRequest());
    expect(response.status).toBe(200);
    expect(callUserData).toHaveBeenCalledTimes(6);
    expect(vi.mocked(callUserData).mock.calls[5][3]).toMatchObject({
      quote_id: "quote-1", client_user_id: "client-1", version_number: 1,
    });
  });
});
