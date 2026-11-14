import { createHash, timingSafeEqual } from "node:crypto";
import { canonicalizeProjectMemoryPayload } from "./project-memory-canonical";

/**
 * Creates a content fingerprint for integrity/version comparison.
 * This digest is not an authorization token or a digital signature.
 */
export function createProjectMemoryDigest(value: unknown): string {
  const canonicalPayload = canonicalizeProjectMemoryPayload(value);
  return createHash("sha256").update(canonicalPayload, "utf8").digest("hex");
}

/**
 * Compares a payload with a previously stored SHA-256 content fingerprint.
 * Invalid fingerprints return false. Callers must separately authorize access.
 */
export function matchesProjectMemoryDigest(value: unknown, expectedDigest: string): boolean {
  if (!/^[a-f0-9]{64}$/.test(expectedDigest)) return false;

  const actualDigest = createProjectMemoryDigest(value);
  return timingSafeEqual(
    Buffer.from(actualDigest, "hex"),
    Buffer.from(expectedDigest, "hex"),
  );
}
