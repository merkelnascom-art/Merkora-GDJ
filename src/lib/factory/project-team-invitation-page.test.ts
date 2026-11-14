import { readFileSync } from "node:fs";
import ts from "typescript";
import { describe, expect, it } from "vitest";

const redirect = readFileSync("app/components/auth/invite-hash-redirect.tsx", "utf8");
const activation = readFileSync("app/auth/accept-invite/page.tsx", "utf8");

describe("MerKora team invitation activation", () => {
  it("routes verified Supabase invite callbacks to the activation page", () => {
    expect(redirect).toContain('hash.get("type")');
    expect(redirect).toContain('type === "invite"');
    expect(redirect).toContain('"/auth/accept-invite"');
    expect(redirect).toContain("window.location.hash");
  });

  it("sets the invited user's password and accepts only the matching project invitation", () => {
    expect(activation).toContain("/auth/v1/user");
    expect(activation).toContain('method: "PUT"');
    expect(activation).toContain("merkora_project_invitation");
    expect(activation).toContain("/functions/v1/project-team-accept");
    expect(activation).toContain("projectId");
    expect(activation).not.toContain("localStorage");
  });

  it("generates syntactically valid client components", () => {
    for (const source of [redirect, activation]) {
      const output = ts.transpileModule(source, {
        compilerOptions: { jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2020 },
        reportDiagnostics: true,
      });
      expect(output.diagnostics?.filter((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error)).toEqual([]);
    }
  });
});
