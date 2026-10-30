import { createProjectMemoryDigest } from "./project-memory-digest";
import type { GeneratedProjectSource } from "./project-generator";
import { validateGeneratedProjectSource } from "./validate-generated-source";

export type ImplementationModule = { id: string; title: string; description: string };
export type ImplementationBrief = {
  projectName: string;
  projectDescription: string;
  planVersion: number;
  planDigest: string;
  modules: ImplementationModule[];
  confirmedConstraints: Array<{ key: string; value: string }>;
  acceptanceCriteria: string[];
  openQuestions: string[];
};

export type ProjectImplementationPrompt = {
  schemaVersion: 1;
  systemPrompt: string;
  userPrompt: string;
};

export type ProjectCodePatchFile = { path: string; content: string };
export type ProjectCodePatch = {
  summary: string;
  openQuestions: string[];
  files: ProjectCodePatchFile[];
};

export type CodePatchValidationReason =
  | "invalid_patch"
  | "unsafe_path"
  | "duplicate_path"
  | "patch_too_large"
  | "sensitive_content"
  | "unsafe_code";

export type CodePatchValidation =
  | { ok: true; fileCount: number; totalBytes: number }
  | { ok: false; reason: CodePatchValidationReason };

const SYSTEM_PROMPT = [
  "Tu es l'agent d'implémentation logiciel de MerKora GDJ.",
  "Ne jamais inventer de besoin, de rôle, de règle métier, de donnée ou de permission absent du périmètre approuvé.",
  "Implémente uniquement les modules et contraintes fournis. Si une décision métier manque, laisse-la dans openQuestions au lieu de la supposer.",
  "Respecte l'architecture existante, ajoute des tests et conserve les comportements déjà validés.",
  "Ne modifie jamais package.json, les fichiers de configuration, les migrations SQL, les secrets ou les règles d'authentification.",
  "N'ajoute aucun appel réseau externe, aucune télémétrie, aucun script d'installation, aucun paiement et aucun effet externe.",
  "N'utilise jamais eval, Function, child_process, exec, ni dangerouslySetInnerHTML.",
  "N'inclus aucun secret, token, clé, mot de passe ou donnée personnelle réelle.",
  "Ne déploie rien. Aucun déploiement, aucune livraison, aucune modification de production.",
  "Retourne uniquement un objet JSON avec summary, openQuestions et files [{path, content}].",
  "Les chemins doivent rester dans src/app, src/components, src/lib ou tests. Les fichiers doivent être du code source texte.",
].join("\n");

function requiredText(value: unknown, field: string, max: number): string {
  if (typeof value !== "string" || !value.trim() || value.trim().length > max) {
    throw new Error(`Le champ ${field} est invalide.`);
  }
  return value.trim();
}

export function buildProjectImplementationPrompt(
  brief: ImplementationBrief,
): ProjectImplementationPrompt {
  const projectName = requiredText(brief.projectName, "nom du projet", 120);
  const projectDescription = requiredText(brief.projectDescription, "description", 1000);
  if (!Number.isSafeInteger(brief.planVersion) || brief.planVersion < 1 ||
    !/^[a-f0-9]{64}$/.test(brief.planDigest) ||
    !Array.isArray(brief.modules) || brief.modules.length < 1 || brief.modules.length > 30) {
    throw new Error("Le périmètre approuvé du projet est invalide.");
  }

  const modules = brief.modules.map((module) => ({
    id: requiredText(module.id, "identifiant de module", 60),
    title: requiredText(module.title, "titre de module", 100),
    description: requiredText(module.description, "description de module", 500),
  }));
  const constraints = (brief.confirmedConstraints ?? []).map((item) => ({
    key: requiredText(item.key, "contrainte", 100),
    value: requiredText(item.value, "valeur de contrainte", 500),
  }));
  const acceptanceCriteria = (brief.acceptanceCriteria ?? []).map((item) =>
    requiredText(item, "critère d'acceptation", 500));
  const openQuestions = (brief.openQuestions ?? []).map((item) =>
    requiredText(item, "question ouverte", 500));

  const userPrompt = [
    "PROJET APPROUVÉ",
    JSON.stringify({
      projectName, projectDescription, planVersion: brief.planVersion,
      planDigest: brief.planDigest, modules, confirmedConstraints: constraints,
      acceptanceCriteria, openQuestions,
    }, null, 2),
    "",
    "TRAVAIL ATTENDU",
    "1. Examiner les modules approuvés et leurs dépendances.",
    "2. Implémenter les comportements explicitement décrits.",
    "3. Ajouter les validations et tests nécessaires.",
    "4. Si une règle métier indispensable manque, ne pas la deviner : retourner une question dans openQuestions et ne pas inventer le comportement.",
    "5. Retourner seulement les fichiers à créer ou modifier dans les répertoires autorisés.",
  ].join("\n");

  return { schemaVersion: 1, systemPrompt: SYSTEM_PROMPT, userPrompt };
}

function safePatchPath(path: string): boolean {
  if (!path || path.length > 180 || path.startsWith("/") || path.includes("\\") ||
    !/^[a-zA-Z0-9._/-]+$/.test(path)) return false;
  const segments = path.split("/");
  if (segments.some((segment) => !segment || segment === "." || segment === "..")) return false;
  const allowedRoot = ["src/app/", "src/components/", "src/lib/", "tests/"];
  if (!allowedRoot.some((root) => path.startsWith(root))) return false;
  return /\.(ts|tsx|css|md|json)$/.test(path) &&
    !/(^|\/)(package\.json|tsconfig\.json|next\.config\.[^/]+)$/.test(path);
}

export function validateProjectCodePatch(value: unknown): CodePatchValidation {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { ok: false, reason: "invalid_patch" };
  }
  const patch = value as Partial<ProjectCodePatch>;
  if (typeof patch.summary !== "string" || !patch.summary.trim() || patch.summary.length > 1000 ||
    !Array.isArray(patch.openQuestions) || patch.openQuestions.length > 20 ||
    patch.openQuestions.some((question) => typeof question !== "string" || question.length > 500) ||
    !Array.isArray(patch.files) || patch.files.length < 1 || patch.files.length > 50) {
    return { ok: false, reason: "invalid_patch" };
  }

  const seen = new Set<string>();
  let totalBytes = 0;
  for (const file of patch.files) {
    if (!file || typeof file !== "object" ||
      typeof file.path !== "string" || typeof file.content !== "string") {
      return { ok: false, reason: "invalid_patch" };
    }
    if (!safePatchPath(file.path)) return { ok: false, reason: "unsafe_path" };
    if (seen.has(file.path)) return { ok: false, reason: "duplicate_path" };
    seen.add(file.path);

    const content = file.content;
    totalBytes += new TextEncoder().encode(content).byteLength;
    if (totalBytes > 500_000) return { ok: false, reason: "patch_too_large" };
    if (/sk-[a-zA-Z0-9_-]{16,}|SUPABASE_SERVICE_ROLE_KEY|VERCEL_OIDC_TOKEN|AI_GATEWAY_API_KEY|-----BEGIN [A-Z ]*PRIVATE KEY-----/i.test(content)) {
      return { ok: false, reason: "sensitive_content" };
    }
    if (/\beval\s*\(|\bnew\s+Function\s*\(|node:child_process|from\s+["']child_process["']|\bexecSync\s*\(|\bspawnSync\s*\(|dangerouslySetInnerHTML|fetch\s*\(\s*["']https?:\/\//i.test(content)) {
      return { ok: false, reason: "unsafe_code" };
    }
  }

  return { ok: true, fileCount: patch.files.length, totalBytes };
}


export type ProjectCodePatchParseResult =
  | { ok: true; patch: ProjectCodePatch }
  | { ok: false; reason: "empty_response" | "invalid_json" | CodePatchValidationReason };

export function parseProjectCodePatchResponse(content: unknown): ProjectCodePatchParseResult {
  if (typeof content !== "string" || !content.trim() || content.length > 550_000) {
    return { ok: false, reason: "empty_response" };
  }
  let candidate: unknown;
  try { candidate = JSON.parse(content); }
  catch { return { ok: false, reason: "invalid_json" }; }
  const validation = validateProjectCodePatch(candidate);
  if (!validation.ok) return { ok: false, reason: validation.reason };
  return { ok: true, patch: candidate as ProjectCodePatch };
}

export function applyProjectCodePatch(
  source: GeneratedProjectSource,
  patch: ProjectCodePatch,
): { source: GeneratedProjectSource; summary: string; openQuestions: string[] } {
  const sourceValidation = validateGeneratedProjectSource(source);
  if (!sourceValidation.ok) throw new Error("Le manifeste source doit être valide avant application du patch.");
  const patchValidation = validateProjectCodePatch(patch);
  if (!patchValidation.ok) throw new Error(`Patch de code refusé : ${patchValidation.reason}.`);

  const filesByPath = new Map(source.files.map((file) => [file.path, file]));
  for (const file of patch.files) filesByPath.set(file.path, { path: file.path, content: file.content });
  const files = [...filesByPath.values()].sort((left, right) => left.path.localeCompare(right.path));
  const nextSource: GeneratedProjectSource = {
    ...source,
    files,
    digest: createProjectMemoryDigest({ generatorVersion: source.generatorVersion, files }),
  };
  const nextValidation = validateGeneratedProjectSource(nextSource);
  if (!nextValidation.ok) throw new Error(`Le résultat du patch est invalide : ${nextValidation.reason}.`);

  return {
    source: nextSource,
    summary: patch.summary.trim(),
    openQuestions: patch.openQuestions.map((question) => question.trim()),
  };
}
