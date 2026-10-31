import { describe, expect, it } from "vitest";
import { createCredentialVault } from "./credential-vault";

const key = Buffer.alloc(32, 7).toString("base64");

describe("credential vault", () => {
  it("encrypts and decrypts a secret without storing plaintext in the envelope", () => {
    const vault = createCredentialVault(() => key);
    const secret = "provider-token-that-must-stay-private";
    const sealed = vault.seal(secret);

    expect(sealed).not.toContain(secret);
    expect(vault.open(sealed)).toBe(secret);
  });

  it("uses a fresh nonce for each encryption of the same secret", () => {
    const vault = createCredentialVault(() => key);
    expect(vault.seal("same-secret")).not.toBe(vault.seal("same-secret"));
  });

  it("rejects missing or malformed encryption configuration", () => {
    expect(() => createCredentialVault(() => undefined).seal("secret")).toThrow(
      "Credential encryption is not configured",
    );
    expect(() => createCredentialVault(() => "not-a-key").seal("secret")).toThrow(
      "Credential encryption is not configured",
    );
  });

  it("rejects tampered envelopes and keys that do not match", () => {
    const sealed = createCredentialVault(() => key).seal("secret");
    const tampered = sealed.slice(0, -2) + "aa";
    expect(() => createCredentialVault(() => key).open(tampered)).toThrow(
      "Unable to decrypt credential",
    );
    expect(() =>
      createCredentialVault(() => Buffer.alloc(32, 8).toString("base64")).open(sealed),
    ).toThrow("Unable to decrypt credential");
  });

  it("rejects unsupported envelope versions", () => {
    expect(() =>
      createCredentialVault(() => key).open("v2.a.b.c"),
    ).toThrow("Invalid credential envelope");
  });
});
