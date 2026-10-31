import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "node:crypto";

const VERSION = "v1";
const ALGORITHM = "aes-256-gcm";
const AAD_PREFIX = "merkora-credential:v1";

export type CredentialContext = Readonly<{
  connectionId: string;
  providerId: string;
}>;

function readKey(getKey: (keyId?: string) => string | undefined, keyId?: string): Buffer {
  const encoded = getKey(keyId);
  if (!encoded || !/^[A-Za-z0-9+/]+={0,2}$/.test(encoded)) {
    throw new Error("Credential encryption is not configured");
  }

  const key = Buffer.from(encoded, "base64");
  if (key.length !== 32 || key.toString("base64") !== encoded) {
    throw new Error("Credential encryption is not configured");
  }
  return key;
}

function decodePart(value: string): Buffer {
  if (!/^[A-Za-z0-9_-]+$/.test(value)) {
    throw new Error("Invalid credential envelope");
  }
  return Buffer.from(value, "base64url");
}

function associatedData(keyId: string, context: CredentialContext): Buffer {
  if (!context || typeof context.connectionId !== "string"
    || !/^[A-Za-z0-9_-]{1,128}$/.test(context.connectionId)
    || typeof context.providerId !== "string"
    || !/^[a-z0-9-]{1,64}$/.test(context.providerId)) {
    throw new Error("A valid credential context is required");
  }
  return Buffer.from(JSON.stringify([
    AAD_PREFIX,
    keyId,
    context.connectionId,
    context.providerId,
  ]), "utf8");
}

export function createCredentialVault(getKey: (keyId?: string) => string | undefined) {
  return {
    seal(plaintext: string, context: CredentialContext): string {
      if (typeof plaintext !== "string" || plaintext.length === 0) {
        throw new Error("Credential must be a non-empty string");
      }

      const key = readKey(getKey);
      const keyId = createHash("sha256").update(key).digest("hex").slice(0, 12);
      const nonce = randomBytes(12);
      const cipher = createCipheriv(ALGORITHM, key, nonce);
      cipher.setAAD(associatedData(keyId, context));
      const ciphertext = Buffer.concat([
        cipher.update(plaintext, "utf8"),
        cipher.final(),
      ]);
      const tag = cipher.getAuthTag();

      return [
        VERSION,
        keyId,
        nonce.toString("base64url"),
        tag.toString("base64url"),
        ciphertext.toString("base64url"),
      ].join(".");
    },

    open(envelope: string, context: CredentialContext): string {
      const parts = envelope.split(".");
      if (parts.length !== 5 || parts[0] !== VERSION) {
        throw new Error("Invalid credential envelope");
      }

      const [, keyId, noncePart, tagPart, ciphertextPart] = parts;
      if (!/^[a-f0-9]{12}$/.test(keyId)) {
        throw new Error("Invalid credential envelope");
      }

      const key = readKey(getKey, keyId);
      const expectedKeyId = createHash("sha256").update(key).digest("hex").slice(0, 12);
      if (keyId !== expectedKeyId) {
        throw new Error("Unable to decrypt credential");
      }

      try {
        const nonce = decodePart(noncePart);
        const tag = decodePart(tagPart);
        const ciphertext = decodePart(ciphertextPart);
        if (nonce.length !== 12 || tag.length !== 16 || ciphertext.length === 0) {
          throw new Error("Invalid credential envelope");
        }

        const decipher = createDecipheriv(ALGORITHM, key, nonce);
        decipher.setAAD(associatedData(keyId, context));
        decipher.setAuthTag(tag);
        return Buffer.concat([
          decipher.update(ciphertext),
          decipher.final(),
        ]).toString("utf8");
      } catch {
        throw new Error("Unable to decrypt credential");
      }
    },
  };
}
