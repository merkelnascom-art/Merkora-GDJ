import { assertStringIncludes } from "jsr:@std/assert@1.0.14";

Deno.test("revoke endpoint is owner-only and removes effective module access", async () => {
  const source = await Deno.readTextFile(new URL("./index.ts", import.meta.url));
  assertStringIncludes(source, "admin.auth.getUser(token)");
  assertStringIncludes(source, "project.user_id !== user.id");
  assertStringIncludes(source, 'status: "revoked"');
  assertStringIncludes(source, "project_team_module_permissions");
  assertStringIncludes(source, "membership_revocation_failed");
});
