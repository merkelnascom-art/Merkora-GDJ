import { describe, expect, it } from "vitest";
import {
  createOAuthAuthorizationProof,
  isValidOAuthState,
} from "./oauth-pkce";

describe("OAuth authorization proof", () => {
  it("creates a unique state and an S256 PKCE challenge from a verifier", () => {
    const first = createOAuthAuthorizationProof();
    const second = createOAuthAuthorizationProof();

    expect(first.state).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(first.verifier).toMatch(/^[A-Za-z0-9_-]{43,128}$/);
    expect(first.challenge).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(first.state).not.toBe(second.state);
    expect(first.verifier).not.toBe(second.verifier);
    expect(first.challenge).not.toBe(first.verifier);
  });

  it("accepts only the exact state stored for the authorization attempt", () => {
    const proof = createOAuthAuthorizationProof();

    expect(isValidOAuthState(proof.state, proof.state)).toBe(true);
    expect(isValidOAuthState(proof.state, "attacker-controlled-state")).toBe(false);
    expect(isValidOAuthState(null, proof.state)).toBe(false);
    expect(isValidOAuthState(proof.state, null)).toBe(false);
  });
});
