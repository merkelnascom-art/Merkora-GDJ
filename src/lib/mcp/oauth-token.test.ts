import { describe, expect, it } from "vitest";
import { getOAuthClientIdFromAccessToken } from "./oauth-token";

function token(payload: Record<string, unknown>) {
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `header.${encoded}.signature`;
}

describe("getOAuthClientIdFromAccessToken", () => {
  it("returns the OAuth client id from a well-formed access token payload", () => {
    expect(getOAuthClientIdFromAccessToken(token({ sub: "user-1", client_id: "client-123" }))).toBe("client-123");
  });

  it("rejects ordinary Supabase user tokens without an OAuth client id", () => {
    expect(getOAuthClientIdFromAccessToken(token({ sub: "user-1", aud: "authenticated" }))).toBeNull();
  });

  it("rejects malformed tokens and malformed payloads", () => {
    expect(getOAuthClientIdFromAccessToken("not-a-jwt")).toBeNull();
    expect(getOAuthClientIdFromAccessToken("header.@@@.signature")).toBeNull();
    expect(getOAuthClientIdFromAccessToken(token({ client_id: 42 }))).toBeNull();
  });

  it("rejects empty or excessively long client ids", () => {
    expect(getOAuthClientIdFromAccessToken(token({ client_id: " " }))).toBeNull();
    expect(getOAuthClientIdFromAccessToken(token({ client_id: "x".repeat(513) }))).toBeNull();
  });
});
