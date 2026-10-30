import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({ cookies: vi.fn().mockResolvedValue({}) }));
vi.mock("@/lib/server/admin-access", () => ({ getAdminAccess: vi.fn() }));
vi.mock("@/lib/server/supabase-rest", () => ({
  callUserData: vi.fn(), getAccessToken: vi.fn(), downloadUserStorageObject: vi.fn(),
}));
import { getAdminAccess } from "@/lib/server/admin-access";
import { callUserData, downloadUserStorageObject, getAccessToken } from "@/lib/server/supabase-rest";
import { GET } from "./route";

const projectId = "MK-PROJECT-001";
const jobId = "b2c3d4e5-f678-4123-8abc-1234567890ab";
const digest = "a".repeat(64);
const sourcePath = `${projectId}/${jobId}/source-${digest}.tar.gz`;
const context = { params: Promise.resolve({ projectId, jobId }) };

beforeEach(() => {
  vi.mocked(getAdminAccess).mockResolvedValue({ ok: true, user: { id: "admin-1", email: "merkelnascom@gmail.com", fullName: "Admin" } });
  vi.mocked(getAccessToken).mockResolvedValue("token");
  vi.mocked(callUserData).mockResolvedValue({
    ok: true, status: 200,
    data: [{ id: jobId, status: "awaiting_approval", manifest: { sourcePath, sourceDigest: digest } }],
  });
  vi.mocked(downloadUserStorageObject).mockResolvedValue({
    ok: true, status: 200, contentType: "application/gzip",
    data: new TextEncoder().encode('{"files":[]}'),
  });
});
afterEach(() => vi.clearAllMocks());

describe("GET factory source artifact", () => {
  it("downloads the exact source artifact for an administrator", async () => {
    const response = await GET(new Request("https://merkora.test"), context);
    expect(response.status).toBe(200);
    expect(response.headers.get("content-disposition")).toContain(jobId);
    expect(response.headers.get("content-type")).toBe("application/gzip");
    expect(await response.text()).toBe('{"files":[]}');
    expect(downloadUserStorageObject).toHaveBeenCalledWith("merkora-factory-artifacts", sourcePath, "token");
  });

  it("rejects non-administrators before reading the job", async () => {
    vi.mocked(getAdminAccess).mockResolvedValue({ ok: false, reason: "not_allowed" });
    const response = await GET(new Request("https://merkora.test"), context);
    expect(response.status).toBe(403);
    expect(callUserData).not.toHaveBeenCalled();
    expect(downloadUserStorageObject).not.toHaveBeenCalled();
  });

  it("rejects an artifact path that does not match the stored source digest", async () => {
    vi.mocked(callUserData).mockResolvedValue({
      ok: true, status: 200,
      data: [{ id: jobId, status: "awaiting_approval", manifest: { sourcePath, sourceDigest: "b".repeat(64) } }],
    });
    const response = await GET(new Request("https://merkora.test"), context);
    expect(response.status).toBe(404);
    expect(downloadUserStorageObject).not.toHaveBeenCalled();
  });
});
