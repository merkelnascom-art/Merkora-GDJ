import { describe, expect, it } from "vitest";
import { ADMIN_NAV_ITEMS } from "./admin-navigation";

describe("admin workspace navigation", () => {
  it("keeps the approved administrator navigation sequence", () => {
    expect(ADMIN_NAV_ITEMS.map((item) => item.id)).toEqual([
      "dashboard", "requests", "conception", "quotes", "realization", "clients", "finances", "configuration",
    ]);
  });

  it("uses unique destinations for every navigation item", () => {
    const ids = ADMIN_NAV_ITEMS.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
