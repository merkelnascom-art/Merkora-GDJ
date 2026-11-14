import { assertEquals, assert } from "jsr:@std/assert@1.0.14";
import {
  bearerToken,
  confirmedEmail,
  normalizeTeamEmail,
  parseAcceptPayload,
  parseInvitePayload,
  parseRevokePayload,
} from "../_shared/project-team.ts";

Deno.test("normalizes invitation emails and rejects malformed addresses", () => {
  assertEquals(normalizeTeamEmail("  Person@Example.com "), "person@example.com");
  assertEquals(normalizeTeamEmail("not-an-email"), null);
  assertEquals(normalizeTeamEmail(12), null);
});

Deno.test("accepts unique module view/edit grants", () => {
  assertEquals(parseInvitePayload({
    projectId: "MK-TEST-000001",
    email: "Team@Example.com",
    grants: [
      { moduleId: "catalogue", canView: true, canEdit: false },
      { moduleId: "orders", canView: true, canEdit: true },
    ],
  }), {
    projectId: "MK-TEST-000001",
    email: "team@example.com",
    grants: [
      { moduleId: "catalogue", canView: true, canEdit: false },
      { moduleId: "orders", canView: true, canEdit: true },
    ],
  });
});

Deno.test("rejects unsafe or ambiguous invitation grants", () => {
  assertEquals(parseInvitePayload(null), null);
  assertEquals(parseInvitePayload({ projectId: "../other", email: "a@b.com", grants: [] }), null);
  assertEquals(parseInvitePayload({ projectId: "MK-1", email: "a@b.com", grants: [] }), null);
  assertEquals(parseInvitePayload({
    projectId: "MK-1", email: "a@b.com",
    grants: [{ moduleId: "../admin", canView: true, canEdit: true }],
  }), null);
  assertEquals(parseInvitePayload({
    projectId: "MK-1", email: "a@b.com",
    grants: [{ moduleId: "orders", canView: false, canEdit: true }],
  }), null);
  assertEquals(parseInvitePayload({
    projectId: "MK-1", email: "a@b.com",
    grants: [
      { moduleId: "orders", canView: true, canEdit: false },
      { moduleId: "orders", canView: true, canEdit: true },
    ],
  }), null);
});

Deno.test("validates accept and revoke requests", () => {
  assertEquals(parseAcceptPayload({ projectId: "MK-1" }), { projectId: "MK-1" });
  assertEquals(parseAcceptPayload({ projectId: "../MK-1" }), null);
  assertEquals(parseRevokePayload({
    projectId: "MK-1", membershipId: "9a0c5e54-6d5a-4a0e-9c7a-000000000001",
  }), { projectId: "MK-1", membershipId: "9a0c5e54-6d5a-4a0e-9c7a-000000000001" });
  assertEquals(parseRevokePayload({ projectId: "MK-1", membershipId: "not-a-uuid" }), null);
});

Deno.test("requires a confirmed email and extracts only a bearer token", () => {
  assert(confirmedEmail({ email: "person@example.com", email_confirmed_at: "2026-01-01T00:00:00Z" }));
  assertEquals(confirmedEmail({ email: "person@example.com", email_confirmed_at: null }), false);
  assertEquals(bearerToken(new Request("https://example.com", { headers: { authorization: "Bearer abc.DEF_123" } })), "abc.DEF_123");
  assertEquals(bearerToken(new Request("https://example.com", { headers: { authorization: "Basic abc" } })), null);
});

Deno.test("invite endpoint verifies owner identity before writing or sending invitations", async () => {
  const source = await Deno.readTextFile(new URL("./index.ts", import.meta.url));
  assert(source.includes("admin.auth.getUser(token)"));
  assert(source.includes("confirmedEmail(user)"));
  assert(source.includes("project.user_id !== user.id"));
  assert(source.includes("admin.auth.admin.inviteUserByEmail"));
  assert(source.includes("project_team_module_permissions"));
  assert(source.includes("payload.grants"));
});
