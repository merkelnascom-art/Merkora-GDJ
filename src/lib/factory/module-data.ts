export const MAX_MODULE_PAYLOAD_BYTES = 64 * 1024;

export function isModuleId(value: unknown): value is string {
  return typeof value === "string" &&
    value.length <= 50 &&
    /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(value);
}

export function validateModulePayload(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  try {
    const serialized = JSON.stringify(value);
    return typeof serialized === "string" &&
      new TextEncoder().encode(serialized).byteLength <= MAX_MODULE_PAYLOAD_BYTES;
  } catch {
    return false;
  }
}
