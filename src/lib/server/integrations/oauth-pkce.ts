import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

const STATE_BYTES = 32;
const VERIFIER_BYTES = 32;

/**
 * Creates the state and PKCE values for one OAuth authorization attempt.
 * Store state in a short-lived, HTTP-only, same-site cookie/session and
 * keep verifier server-side until the callback has been validated.
 */
export function createOAuthAuthorizationProof() {
  const state = randomBytes(STATE_BYTES).toString("base64url");
  const verifier = randomBytes(VERIFIER_BYTES).toString("base64url");
  const challenge = createHash("sha256").update(verifier, "ascii").digest("base64url");

  return { state, verifier, challenge, challengeMethod: "S256" as const };
}

/** Compare callback state with the value saved for the initiating session. */
export function isValidOAuthState(
  receivedState: string | null | undefined,
  expectedState: string | null | undefined,
): boolean {
  if (
    typeof receivedState !== "string" ||
    typeof expectedState !== "string" ||
    receivedState.length === 0 ||
    receivedState.length !== expectedState.length
  ) {
    return false;
  }

  return timingSafeEqual(
    Buffer.from(receivedState, "utf8"),
    Buffer.from(expectedState, "utf8"),
  );
}
