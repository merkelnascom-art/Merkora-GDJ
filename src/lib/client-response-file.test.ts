import { describe, expect, it } from "vitest";
import { CLIENT_RESPONSE_SCHEMA, parseClientResponseFile } from "./client-response-file";

const valid = {
  schema: CLIENT_RESPONSE_SCHEMA,
  project: { id: "MK-001", title: "Gestion de boutique" },
  quote: { amountFcfa: "150000", estimatedDays: "14", paymentTerms: "50% au démarrage" },
  response: { choice: "negotiate", comment: "Peut-on étaler le paiement ?" },
  exportedAt: "2026-10-29T10:00:00.000Z",
};

describe("parseClientResponseFile", () => {
  it("accepts a valid response and returns a safe normalized object", () => {
    const result = parseClientResponseFile(JSON.stringify(valid));
    expect(result.project.id).toBe("MK-001");
    expect(result.response.choice).toBe("negotiate");
    expect(result.notice).toContain("Import manuel local");
  });

  it("rejects invalid JSON and unsupported schema versions", () => {
    expect(() => parseClientResponseFile("{oops")).toThrow(/JSON valide/);
    expect(() => parseClientResponseFile(JSON.stringify({ ...valid, schema: "other" }))).toThrow(/Version de fichier inconnue/);
  });

  it("rejects missing project references and unknown response choices", () => {
    expect(() => parseClientResponseFile(JSON.stringify({ ...valid, project: { id: "", title: "Projet" } }))).toThrow(/référence et le titre/);
    expect(() => parseClientResponseFile(JSON.stringify({ ...valid, response: { choice: "pay_now", comment: "" } }))).toThrow(/décision ou le commentaire/);
  });

  it("rejects oversized input and malformed dates", () => {
    expect(() => parseClientResponseFile("x".repeat(100_001))).toThrow(/trop volumineux/);
    expect(() => parseClientResponseFile(JSON.stringify({ ...valid, exportedAt: "hier" }))).toThrow(/date d'export/);
  });

  it("does not accept unsupported fields as a substitute for required values", () => {
    const { project: _project, ...withoutProject } = valid;
    expect(() => parseClientResponseFile(JSON.stringify(withoutProject))).toThrow(/Référence du projet/);
  });
});
