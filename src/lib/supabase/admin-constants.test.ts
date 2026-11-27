import { describe, expect, it } from "vitest";
import { isMerkoraAdminEmail, MERKORA_ADMIN_EMAIL } from "./admin-constants";

describe("single MerKora administrator identity", () => {
  it("recognizes the canonical email case-insensitively", () => {
    expect(isMerkoraAdminEmail(MERKORA_ADMIN_EMAIL)).toBe(true);
    expect(isMerkoraAdminEmail(" MERKORA-GDJ@GMAIL.COM ")).toBe(true);
  });
  it("rejects former and unrelated administrator identities", () => {
    expect(isMerkoraAdminEmail("merkelnascom@gmail.com")).toBe(false);
    expect(isMerkoraAdminEmail("wdesk87@gmail.com")).toBe(false);
    expect(isMerkoraAdminEmail("client@example.com")).toBe(false);
    expect(isMerkoraAdminEmail(null)).toBe(false);
  });
});
