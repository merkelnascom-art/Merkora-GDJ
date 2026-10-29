import { describe, expect, it } from "vitest";
import {
  calculateQuoteTotals,
  canTransitionQuoteStatus,
  validateQuoteDraft,
  type QuoteDraft,
} from "./quotes";

const validDraft: QuoteDraft = {
  id: "quote-1",
  requestId: "request-1",
  version: 1,
  currency: "XOF",
  status: "draft",
  lines: [
    { id: "line-1", description: "Conception", quantity: 1, unit: "forfait", unitPriceMinor: 25000 },
    { id: "line-2", description: "Développement", quantity: 2, unit: "jour", unitPriceMinor: 40000 },
  ],
  discountMinor: 0,
  taxRateBasisPoints: null,
  taxConfirmed: false,
  validityEndsAt: "2026-12-31T23:59:59.000Z",
  scope: "Conception et réalisation du périmètre validé.",
  exclusions: "Hébergement payant non inclus.",
  assumptions: ["Les contenus sont fournis par le client."],
  paymentTerms: "Acompte à définir avant signature.",
  recurringLines: [],
};

describe("quote domain rules", () => {
  it("calculates line totals and a one-time total with integer money", () => {
    expect(calculateQuoteTotals(validDraft)).toEqual({
      oneTimeSubtotalMinor: 105000,
      recurringSubtotalMinor: 0,
      discountMinor: 0,
      taxMinor: 0,
      totalMinor: 105000,
    });
  });

  it("does not apply a tax rate until its use is explicitly confirmed", () => {
    const draft = { ...validDraft, taxRateBasisPoints: 1800, taxConfirmed: false };
    expect(calculateQuoteTotals(draft).taxMinor).toBe(0);
    expect(validateQuoteDraft(draft)).toContain("Le traitement fiscal doit être confirmé avant publication.");
  });

  it("rejects negative prices, zero quantities, and empty descriptions", () => {
    const draft = {
      ...validDraft,
      lines: [
        { id: "bad-1", description: "", quantity: 0, unit: "forfait", unitPriceMinor: -1 },
      ],
    };
    expect(validateQuoteDraft(draft)).toEqual(expect.arrayContaining([
      expect.stringMatching(/description/i),
      expect.stringMatching(/quantité/i),
      expect.stringMatching(/montant/i),
    ]));
  });

  it("requires scope, validity, and payment terms before publication", () => {
    const draft = { ...validDraft, scope: "", validityEndsAt: "", paymentTerms: "" };
    expect(validateQuoteDraft(draft)).toEqual(expect.arrayContaining([
      expect.stringMatching(/périmètre/i),
      expect.stringMatching(/validité/i),
      expect.stringMatching(/paiement/i),
    ]));
  });

  it("allows only explicit quote status transitions", () => {
    expect(canTransitionQuoteStatus("draft", "pending_client")).toBe(true);
    expect(canTransitionQuoteStatus("pending_client", "accepted_by_client")).toBe(true);
    expect(canTransitionQuoteStatus("accepted_by_client", "pending_client")).toBe(false);
    expect(canTransitionQuoteStatus("superseded", "accepted_by_client")).toBe(false);
  });

  it("rejects publication of a quote whose validity has already expired", () => {
    const draft = { ...validDraft, validityEndsAt: "2020-01-01T00:00:00.000Z" };
    expect(validateQuoteDraft(draft, new Date("2026-10-29T12:00:00.000Z"))).toContain(
      "La date de validité doit être postérieure à maintenant.",
    );
  });
});
