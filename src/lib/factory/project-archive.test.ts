import { gunzipSync } from "node:zlib";
import { describe, expect, it } from "vitest";
import { generateProjectSource } from "./project-generator";
import { createProjectArchive } from "./project-archive";

const source = generateProjectSource({
  projectName: "Gestion RH",
  projectDescription: "Gérer les équipes et les présences.",
  modules: [{ id: "staff", title: "Personnel", description: "Profils employés." }],
});

describe("createProjectArchive", () => {
  it("creates a gzip tar archive containing the generated project files", () => {
    const archive = createProjectArchive(source);
    expect(archive.contentType).toBe("application/gzip");
    expect(archive.fileName).toMatch(/\.tar\.gz$/);
    const tar = gunzipSync(archive.bytes);
    expect(tar.toString("utf8")).toContain("package.json");
    expect(tar.toString("utf8")).toContain("src/app/page.tsx");
    expect(tar.toString("utf8")).toContain("src/app/modules/staff/page.tsx");
  });

  it("rejects a tampered source manifest before packaging", () => {
    const tampered = { ...source, files: [...source.files] };
    tampered.files[0] = { ...tampered.files[0], content: "tampered" };
    expect(() => createProjectArchive(tampered)).toThrow(/source/i);
  });
});
