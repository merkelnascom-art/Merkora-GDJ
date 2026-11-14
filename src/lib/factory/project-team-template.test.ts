import ts from "typescript";
import { describe, expect, it } from "vitest";
import { projectTeamManagementSource } from "./project-team-template";

describe("generated project team management workspace", () => {
  it("lets only the owner invite people and choose module-level view/edit rights", () => {
    expect(projectTeamManagementSource).toContain("project-team-invite");
    expect(projectTeamManagementSource).toContain("export function ProjectTeamLink");
    expect(projectTeamManagementSource).toContain("return visible ?");
    expect(projectTeamManagementSource).toContain("setVisible(Boolean(membership))");
    expect(projectTeamManagementSource).toContain("if (owner)");
    expect(projectTeamManagementSource).toContain("signInWithPassword");
    expect(projectTeamManagementSource).toContain("project-team-revoke");
    expect(projectTeamManagementSource).toContain("project_team_memberships");
    expect(projectTeamManagementSource).toContain("project_team_module_permissions");
    expect(projectTeamManagementSource).toContain("canView");
    expect(projectTeamManagementSource).toContain("canEdit");
    expect(projectTeamManagementSource).toContain("ownerProject");
    expect(projectTeamManagementSource).toContain("Révoquer l'accès");
  });

  it("allows a signed-in invitee to explicitly activate only their own pending invitation", () => {
    expect(projectTeamManagementSource).toContain("project-team-accept");
    expect(projectTeamManagementSource).toContain("Activer mon accès");
    expect(projectTeamManagementSource).toContain("if (!isOwner)");
  });

  it("does not expose service-role credentials or self-service staff registration", () => {
    expect(projectTeamManagementSource).not.toContain("SERVICE_ROLE");
    expect(projectTeamManagementSource).not.toContain("signUp(");
    expect(projectTeamManagementSource).not.toContain("user_metadata");
  });

  it("generates syntactically valid TSX", () => {
    const output = ts.transpileModule(projectTeamManagementSource, {
      compilerOptions: { jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2020 },
      reportDiagnostics: true,
    });
    expect(output.diagnostics?.filter((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error)).toEqual([]);
  });
});
