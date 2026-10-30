import { describe, expect, it } from "vitest";
import { generateProjectSource } from "./project-generator";
import { validateGeneratedProjectSource } from "./validate-generated-source";

const generated = () => generateProjectSource({
  projectName: "Gestion de présence",
  projectDescription: "Suivre les arrivées.",
  modules: [{ id: "attendance", title: "Présences", description: "Pointage." }],
});

describe("validateGeneratedProjectSource", () => {
  it("accepts an intact generated source manifest", () => {
    expect(validateGeneratedProjectSource(generated())).toEqual({ ok: true, fileCount: 7, totalBytes: expect.any(Number) });
  });

  it("rejects a modified file whose digest no longer matches", () => {
    const source = generated();
    source.files[0].content += "\n// injected change";
    expect(validateGeneratedProjectSource(source)).toMatchObject({ ok: false, reason: "digest_mismatch" });
  });

  it("rejects unsafe paths, duplicate paths, and oversized manifests", () => {
    const source = generated();
    source.files[0].path = "../outside.txt";
    expect(validateGeneratedProjectSource(source)).toMatchObject({ ok: false, reason: "unsafe_path" });

    const duplicate = generated();
    duplicate.files.push({ ...duplicate.files[0] });
    expect(validateGeneratedProjectSource(duplicate)).toMatchObject({ ok: false, reason: "duplicate_path" });

    const oversized = generated();
    oversized.files[0].content = "x".repeat(1_100_000);
    expect(validateGeneratedProjectSource(oversized)).toMatchObject({ ok: false, reason: "manifest_too_large" });
  });

  it("rejects a source without the required application entry points", () => {
    const source = generated();
    source.files = source.files.filter((file) => file.path !== "src/app/page.tsx");
    expect(validateGeneratedProjectSource(source)).toMatchObject({ ok: false, reason: "missing_entrypoint" });
  });
});
