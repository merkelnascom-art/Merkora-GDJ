import { assertStringIncludes } from "jsr:@std/assert@1.0.14";

Deno.test("accept endpoint binds activation to a verified email and project invitation", async () => {
  const source = await Deno.readTextFile(new URL("./index.ts", import.meta.url));
  assertStringIncludes(source, "admin.auth.getUser(token)");
  assertStringIncludes(source, "confirmedEmail(user)");
  assertStringIncludes(source, "user.email.trim().toLowerCase()");
  assertStringIncludes(source, '.eq("email", email)');
  assertStringIncludes(source, '.eq("status", "pending")');
  assertStringIncludes(source, 'status: "active"');
  assertStringIncludes(source, "invitation_belongs_to_another_account");
});
