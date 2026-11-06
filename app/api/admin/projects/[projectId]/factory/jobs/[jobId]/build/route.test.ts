import { describe, expect, it, vi } from "vitest";
import { POST } from "./route";

describe("POST legacy factory job build", () => {
  it("returns 410 and directs callers to the controlled GitHub Actions dispatcher", async () => {
    const response = await POST();

    expect(response.status).toBe(410);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(await response.json()).toMatchObject({
      code: "LEGACY_FACTORY_BUILD_DISABLED",
    });
  });

  it("does not invoke legacy build dependencies", async () => {
    const legacyBuild = vi.fn();
    const response = await POST();

    expect(response.status).toBe(410);
    expect(legacyBuild).not.toHaveBeenCalled();
  });
});
