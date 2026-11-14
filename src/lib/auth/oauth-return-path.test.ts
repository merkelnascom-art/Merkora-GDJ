import { describe, expect, it } from "vitest";
import { getSafeOAuthConsentReturnPath } from "./oauth-return-path";

describe("getSafeOAuthConsentReturnPath", () => {
  it("accepts only a same-origin consent route with an authorization id", () => {
    expect(getSafeOAuthConsentReturnPath("/oauth/consent?authorization_id=req-123"))
      .toBe("/oauth/consent?authorization_id=req-123");
  });

  it("rejects external, protocol-relative, unrelated, and incomplete return paths", () => {
    expect(getSafeOAuthConsentReturnPath("https://evil.example/oauth/consent?authorization_id=x")).toBeNull();
    expect(getSafeOAuthConsentReturnPath("//evil.example/oauth/consent?authorization_id=x")).toBeNull();
    expect(getSafeOAuthConsentReturnPath("/admin?authorization_id=x")).toBeNull();
    expect(getSafeOAuthConsentReturnPath("/oauth/consent")).toBeNull();
    expect(getSafeOAuthConsentReturnPath(null)).toBeNull();
  });
});
