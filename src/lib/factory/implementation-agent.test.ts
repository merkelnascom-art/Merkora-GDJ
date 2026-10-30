import { describe, expect, it } from "vitest";
import { applyProjectCodePatch, buildProjectImplementationPrompt, validateProjectCodePatch } from "./implementation-agent";
import { generateProjectSource } from "./project-generator";
import { validateGeneratedProjectSource } from "./validate-generated-source";

const brief = {
  projectName: "Aéro Service",
  projectDescription: "Suivre les présences et retards des apprenants.",
  planVersion: 4,
  planDigest: "a".repeat(64),
  modules: [
    { id: "attendance", title: "Présences", description: "Pointage des arrivées et retards." },
    { id: "learners", title: "Apprenants", description: "Dossiers et groupes des apprenants." },
  ],
  confirmedConstraints: [{ key: "opening_hours", value: "08:30–19:30" }],
  acceptanceCriteria: ["Un apprenant ne peut pas pointer deux fois à la même séance."],
  openQuestions: ["Qui valide les retards autorisés ?"],
};

describe("buildProjectImplementationPrompt", () => {
  it("builds a project-specific prompt that preserves approved scope and constraints", () => {
    const result = buildProjectImplementationPrompt(brief);
    expect(result.systemPrompt).toContain("Ne jamais inventer");
    expect(result.systemPrompt).toContain("Aucun déploiement");
    expect(result.userPrompt).toContain("Aéro Service");
    expect(result.userPrompt).toContain("Présences");
    expect(result.userPrompt).toContain("08:30–19:30");
    expect(result.userPrompt).toContain("Qui valide les retards autorisés ?");
  });

  it("rejects an empty module scope", () => {
    expect(() => buildProjectImplementationPrompt({ ...brief, modules: [] })).toThrow(/périmètre/i);
  });
});

describe("validateProjectCodePatch", () => {
  it("accepts bounded application code changes inside approved source folders", () => {
    expect(validateProjectCodePatch({
      summary: "Ajoute l'écran de pointage.",
      openQuestions: [],
      files: [{ path: "src/app/modules/attendance/page.tsx", content: "export default function Page() { return <main />; }" }],
    })).toMatchObject({ ok: true, fileCount: 1 });
  });

  it("rejects path traversal, dependency manifests, secrets, and unsafe execution primitives", () => {
    const base = { summary: "Patch", openQuestions: [], files: [{ path: "src/app/page.tsx", content: "export default function Page() {}" }] };
    expect(validateProjectCodePatch({ ...base, files: [{ path: "../../package.json", content: "{}" }] })).toMatchObject({ ok: false, reason: "unsafe_path" });
    expect(validateProjectCodePatch({ ...base, files: [{ path: "package.json", content: "{}" }] })).toMatchObject({ ok: false, reason: "unsafe_path" });
    expect(validateProjectCodePatch({ ...base, files: [{ path: "src/lib/secret.ts", content: 'const key = "sk-live-1234567890abcdef";' }] })).toMatchObject({ ok: false, reason: "sensitive_content" });
    expect(validateProjectCodePatch({ ...base, files: [{ path: "src/lib/exec.ts", content: 'import { exec } from "node:child_process";' }] })).toMatchObject({ ok: false, reason: "unsafe_code" });
  });

  it("rejects duplicate paths and oversized code patches", () => {
    const duplicate = { summary: "Patch", openQuestions: [], files: [
      { path: "src/app/page.tsx", content: "a" },
      { path: "src/app/page.tsx", content: "b" },
    ] };
    expect(validateProjectCodePatch(duplicate)).toMatchObject({ ok: false, reason: "duplicate_path" });
    expect(validateProjectCodePatch({
      summary: "Patch", openQuestions: [],
      files: [{ path: "src/app/page.tsx", content: "x".repeat(600_000) }],
    })).toMatchObject({ ok: false, reason: "patch_too_large" });
  });
});


describe("applyProjectCodePatch", () => {
  it("applies only validated source changes and recalculates the source digest", () => {
    const source = generateProjectSource({
      projectName: "Gestion RH",
      projectDescription: "Gérer le personnel.",
      modules: [{ id: "staff", title: "Personnel", description: "Profils employés." }],
    });
    const result = applyProjectCodePatch(source, {
      summary: "Ajoute une vue de liste du personnel.",
      openQuestions: [],
      files: [{ path: "src/app/modules/staff/page.tsx", content: "export default function Page() { return <main>Personnel</main>; }" }],
    });
    expect(result.source.digest).not.toBe(source.digest);
    expect(result.source.files.find((file) => file.path === "src/app/modules/staff/page.tsx")?.content).toContain("Personnel");
    expect(validateGeneratedProjectSource(result.source).ok).toBe(true);
  });

  it("refuses patches that change dependency manifests or escape approved folders", () => {
    const source = generateProjectSource({
      projectName: "Gestion RH",
      projectDescription: "Gérer le personnel.",
      modules: [{ id: "staff", title: "Personnel", description: "Profils employés." }],
    });
    expect(() => applyProjectCodePatch(source, {
      summary: "Ajoute une dépendance.",
      openQuestions: [],
      files: [{ path: "package.json", content: "{}" }],
    })).toThrow(/patch/i);
  });
});
