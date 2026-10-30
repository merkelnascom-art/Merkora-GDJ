import { describe, expect, it } from "vitest";
import { generateProjectSource, type ProjectSourceInput } from "./project-generator";

const input: ProjectSourceInput = {
  projectName: "Gestion de présence",
  projectDescription: "Suivre les arrivées et retards du personnel.",
  modules: [
    { id: "attendance", title: "Présences", description: "Pointage et retards." },
    { id: "staff", title: "Personnel", description: "Profils et équipes." },
  ],
};

describe("generateProjectSource", () => {
  it("generates a runnable Next.js scaffold with every approved module", () => {
    const result = generateProjectSource(input);
    expect(result.files.map((file) => file.path)).toContain("package.json");
    expect(result.files.map((file) => file.path)).toContain("src/app/page.tsx");
    expect(result.files.map((file) => file.path)).toContain("src/app/modules/attendance/page.tsx");
    expect(result.files.map((file) => file.path)).toContain("src/app/modules/staff/page.tsx");
    expect(result.files.find((file) => file.path === "src/app/modules/attendance/page.tsx")?.content).toContain("Pointage et retards.");
    expect(result.files.find((file) => file.path === "src/app/page.tsx")?.content).toContain("Présences");
    expect(result.files.every((file) => file.content.length > 0)).toBe(true);
  });

  it("escapes untrusted text before placing it in generated JSX", () => {
    const result = generateProjectSource({
      ...input,
      projectName: "</title><script>alert(1)</script>",
      modules: [{ id: "xss", title: "{danger}", description: "<img src=x onerror=alert(1)>" }],
    });
    const page = result.files.find((file) => file.path === "src/app/page.tsx")?.content ?? "";
    expect(page).not.toContain("<script>");
    expect(page).not.toContain("<img");
    expect(page).toContain("&lt;script&gt;");
  });

  it("rejects an empty scope and unsafe or duplicate module identifiers", () => {
    expect(() => generateProjectSource({ ...input, modules: [] })).toThrow(/module/i);
    expect(() => generateProjectSource({ ...input, modules: [{ id: "../admin", title: "Admin", description: "" }] })).toThrow(/identifiant/i);
    expect(() => generateProjectSource({ ...input, modules: [
      { id: "staff", title: "A", description: "" },
      { id: "staff", title: "B", description: "" },
    ] })).toThrow(/unique/i);
  });

  it("produces a deterministic manifest digest for identical input", () => {
    expect(generateProjectSource(input).digest).toBe(generateProjectSource(input).digest);
  });
});
