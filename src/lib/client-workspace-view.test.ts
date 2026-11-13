import { describe, expect, it } from "vitest";
import { getClientWorkspaceView, shouldShowCommercialPanels } from "./client-workspace-view";

describe("client workspace composition", () => {
  it("shows the project home when there is no active project", () => {
    expect(getClientWorkspaceView("understanding", false)).toBe("home");
  });

  it("shows exactly the requested journey stage for an active project", () => {
    expect(getClientWorkspaceView("proposals", true)).toBe("proposals");
    expect(getClientWorkspaceView("validation", true)).toBe("validation");
  });

  it("falls back to home for unknown stages instead of rendering mixed content", () => {
    expect(getClientWorkspaceView("billing", true)).toBe("home");
  });

  it("keeps quotes and payments out of discovery and only exposes them for real commercial records", () => {
    expect(shouldShowCommercialPanels("understanding", true)).toBe(false);
    expect(shouldShowCommercialPanels("validation", true)).toBe(false);
    expect(shouldShowCommercialPanels("realization", false)).toBe(false);
    expect(shouldShowCommercialPanels("realization", true)).toBe(true);
  });
});
