import { describe, expect, it } from "vitest";
import { createCredentialVault } from "./credential-vault";

const key = Buffer.alloc(32, 7).toString("base64");
const context = { connectionId: "connection_123", providerId: "github" };

describe("credential vault", () => {
  it("encrypts and decrypts a secret without storing plaintext in the envelope", () => {
    const vault = createCredentialVault(() => key);
    const secret = "provider-token-that-must-stay-private";
    const sealed = vault.seal(secret, context);

    expect(sealed).not.toContain(secret);
    expect(vault.open(sealed, context)).toBe(secret);
  });

  it("uses a fresh nonce for each encryption of the same secret", () => {
    const vault = createCredentialVault(() => key);
    expect(vault.seal("same-secret", context)).not.toBe(vault.seal("same-secret", context));
  });

  it("rejects missing or malformed encryption configuration", () => {
    expect(() => createCredentialVault(() => undefined).seal("secret", context)).toThrow(
      "Credential encryption is not configured",
    );
    expect(() => createCredentialVault(() => "not-a-key").seal("secret", context)).toThrow(
      "Credential encryption is not configured",
    );
  });

  it("rejects tampered envelopes and keys that do not match", () => {
    const sealed = createCredentialVault(() => key).seal("secret", context);
    const tampered = sealed.slice(0, -2) + "aa";
    expect(() => createCredentialVault(() => key).open(tampered, context)).toThrow(
      "Unable to decrypt credential",
    );
    expect(() =>
      createCredentialVault(() => Buffer.alloc(32, 8).toString("base64")).open(sealed, context),
    ).toThrow("Unable to decrypt credential");
  });

  it("binds ciphertext to the exact provider connection context", () => {
    const vault = createCredentialVault(() => key);
    const sealed = vault.seal("github-token", context);
    expect(vault.open(sealed, context)).toBe("github-token");
    expect(() => vault.open(sealed, { connectionId: "another_connection", providerId: "github" }))
      .toThrow("Unable to decrypt credential");
    expect(() => vault.open(sealed, { connectionId: "connection_123", providerId: "vercel" }))
      .toThrow("Unable to decrypt credential");
  });

  it("rejects unsupported envelope versions", () => {
    expect(() =>
      createCredentialVault(() => key).open("v2.a.b.c", context),
    ).toThrow("Invalid credential envelope");
  });
});
