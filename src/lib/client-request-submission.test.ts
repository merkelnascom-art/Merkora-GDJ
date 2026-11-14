import { describe, expect, it } from "vitest";
import type { Project } from "./project-types";
import { submitClientRequest } from "./client-request-submission";

const project: Project = {
  id: "MK-TEST-001",
  title: "Gestion de centre",
  category: "business",
  problem: "Les inscriptions et les paiements sont suivis dans plusieurs cahiers.",
  desiredOutcome: "Centraliser les inscriptions et suivre les paiements.",
  budget: "À définir",
  urgency: "normal",
  createdAt: "2026-11-10T10:00:00.000Z",
  status: "discovery",
  recommendations: [{ title: "Espace de gestion", description: "Centraliser les dossiers.", reason: "Réduire les doubles saisies." }],
};

const requestPayload = {
  project: { id: project.id, title: project.title },
  studio: { format: "dashboard", palette: "violet", enabledModules: [], selectedRecommendationIds: [], reviewStatus: "draft", reviewNote: "" },
  quote: { amount: "", days: "", paymentTerms: "" },
  clientResponse: { choice: "undecided", comment: "" },
};

describe("submitClientRequest", () => {
  it("saves the owner-scoped project before sending the client request", async () => {
    const calls: Array<{ input: RequestInfo | URL; init?: RequestInit }> = [];
    const responses = [
      new Response(JSON.stringify({ saved: 1 }), { status: 200 }),
      new Response(JSON.stringify({ sent: true, message: "Demande enregistrée." }), { status: 200 }),
    ];
    const fetcher: typeof fetch = async (input, init) => {
      calls.push({ input, init });
      const response = responses.shift();
      if (!response) throw new Error("Unexpected extra request");
      return response;
    };

    await expect(submitClientRequest(project, requestPayload, fetcher)).resolves.toBe("Demande enregistrée.");
    expect(calls).toHaveLength(2);
    expect(String(calls[0].input)).toBe("/api/projects");
    expect(calls[0].init?.method).toBe("POST");
    expect(JSON.parse(String(calls[0].init?.body))).toEqual([project]);
    expect(String(calls[1].input)).toBe("/api/client-requests");
    expect(JSON.parse(String(calls[1].init?.body))).toEqual(requestPayload);
  });

  it("does not send a request when project persistence fails", async () => {
    let callCount = 0;
    const fetcher: typeof fetch = async () => {
      callCount += 1;
      return new Response(JSON.stringify({ error: "Sauvegarde refusée." }), { status: 502 });
    };

    await expect(submitClientRequest(project, requestPayload, fetcher)).rejects.toThrow("Sauvegarde refusée.");
    expect(callCount).toBe(1);
  });

  it("reports a partial failure when the project is saved but the request is rejected", async () => {
    let callCount = 0;
    const fetcher: typeof fetch = async () => {
      callCount += 1;
      return callCount === 1
        ? new Response(JSON.stringify({ saved: 1 }), { status: 200 })
        : new Response(JSON.stringify({ error: "Boîte de réception indisponible." }), { status: 502 });
    };

    await expect(submitClientRequest(project, requestPayload, fetcher)).rejects.toThrow("Boîte de réception indisponible.");
    expect(callCount).toBe(2);
  });
});
