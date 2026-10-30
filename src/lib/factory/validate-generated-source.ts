import { matchesProjectMemoryDigest } from "./project-memory-digest";
import type { GeneratedProjectSource } from "./project-generator";

export type GeneratedSourceValidationReason =
  | "invalid_manifest"
  | "unsafe_path"
  | "duplicate_path"
  | "manifest_too_large"
  | "missing_entrypoint"
  | "invalid_package_manifest"
  | "digest_mismatch";

export type GeneratedSourceValidation =
  | { ok: true; fileCount: number; totalBytes: number }
  | { ok: false; reason: GeneratedSourceValidationReason };

const REQUIRED_PATHS = [
  "package.json",
  "tsconfig.json",
  "README.md",
  "src/app/layout.tsx",
  "src/app/globals.css",
  "src/app/page.tsx",
] as const;
const MAX_FILES = 200;
const MAX_TOTAL_BYTES = 1_000_000;

function safeRelativePath(path: string): boolean {
  if (!path || path.length > 240 || path.startsWith("/") || path.includes("\\") ||
    !/^[a-zA-Z0-9._/-]+$/.test(path)) return false;
  const segments = path.split("/");
  return segments.every((segment) => segment.length > 0 && segment !== "." && segment !== "..");
}

export function validateGeneratedProjectSource(
  source: unknown,
): GeneratedSourceValidation {
  if (!source || typeof source !== "object" || Array.isArray(source)) {
    return { ok: false, reason: "invalid_manifest" };
  }
  const candidate = source as Partial<GeneratedProjectSource>;
  if (typeof candidate.generatorVersion !== "string" ||
    !Array.isArray(candidate.files) ||
    typeof candidate.digest !== "string" ||
    !Array.isArray(candidate.moduleIds) ||
    candidate.files.length < REQUIRED_PATHS.length ||
    candidate.files.length > MAX_FILES) {
    return { ok: false, reason: "invalid_manifest" };
  }

  const seen = new Set<string>();
  let totalBytes = 0;
  for (const file of candidate.files) {
    if (!file || typeof file !== "object" ||
      typeof file.path !== "string" || typeof file.content !== "string") {
      return { ok: false, reason: "invalid_manifest" };
    }
    if (!safeRelativePath(file.path)) return { ok: false, reason: "unsafe_path" };
    if (seen.has(file.path)) return { ok: false, reason: "duplicate_path" };
    seen.add(file.path);
    totalBytes += new TextEncoder().encode(file.content).byteLength;
    if (totalBytes > MAX_TOTAL_BYTES) return { ok: false, reason: "manifest_too_large" };
  }

  if (!REQUIRED_PATHS.every((path) => seen.has(path))) {
    return { ok: false, reason: "missing_entrypoint" };
  }

  const packageFile = candidate.files.find((file) => file.path === "package.json");
  try {
    const packageJson = JSON.parse(packageFile?.content ?? "") as {
      scripts?: Record<string, unknown>;
    };
    if (!packageJson.scripts ||
      typeof packageJson.scripts.build !== "string" ||
      typeof packageJson.scripts.typecheck !== "string" ||
      ["preinstall", "install", "postinstall", "prepare"].some((script) =>
        Object.prototype.hasOwnProperty.call(packageJson.scripts, script))) {
      return { ok: false, reason: "invalid_package_manifest" };
    }
  } catch {
    return { ok: false, reason: "invalid_package_manifest" };
  }

  if (!matchesProjectMemoryDigest(
    { generatorVersion: candidate.generatorVersion, files: candidate.files },
    candidate.digest,
  )) {
    return { ok: false, reason: "digest_mismatch" };
  }

  return { ok: true, fileCount: candidate.files.length, totalBytes };
}
