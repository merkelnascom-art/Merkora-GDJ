import { describe, expect, it } from "vitest";
import { POST } from "./route";

describe("POST legacy factory job build", () => {
  it("rejects the retired direct-build route and points callers to GitHub Actions", async () => {
    const response = await POST();
    const body = await response.json();

    expect(response.status).toBe(410);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(body).toMatchObject({ code: "LEGACY_FACTORY_BUILD_DISABLED" });
    expect(body.error).toContain("GitHub Actions");
  });
});
