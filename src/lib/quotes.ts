export type QuoteStatus =
  | "draft"
  | "pending_client"
  | "changes_requested"
  | "negotiation"
  | "accepted_by_client"
  | "declined_by_client"
  | "expired"
  | "superseded";

export type QuoteLine = {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  /** Integer amount in the quote currency's smallest supported unit. XOF is stored as whole francs. */
  unitPriceMinor: number;
};

export type QuoteDraft = {
  id: string;
  requestId: string;
  version: number;
  currency: "XOF";
  status: QuoteStatus;
  lines: QuoteLine[];
  recurringLines: QuoteLine[];
  discountMinor: number;
  /** 100 basis points = 1%. Null means no tax rate has been provided. */
  taxRateBasisPoints: number | null;
  /** True only after an authorized person confirms the applicable tax treatment. */
  taxConfirmed: boolean;
  validityEndsAt: string;
  scope: string;
  exclusions: string;
  assumptions: string[];
  paymentTerms: string;
};

export type QuoteTotals = {
  oneTimeSubtotalMinor: number;
  recurringSubtotalMinor: number;
  discountMinor: number;
  taxMinor: number;
  totalMinor: number;
};

const transitions: Record<QuoteStatus, readonly QuoteStatus[]> = {
  draft: ["pending_client"],
  pending_client: ["changes_requested", "negotiation", "accepted_by_client", "declined_by_client", "expired", "superseded"],
  changes_requested: ["pending_client", "negotiation", "declined_by_client", "superseded"],
  negotiation: ["pending_client", "accepted_by_client", "declined_by_client", "expired", "superseded"],
  accepted_by_client: [],
  declined_by_client: [],
  expired: [],
  superseded: [],
};

function sumLines(lines: QuoteLine[]): number {
  return lines.reduce((sum, line) => sum + line.quantity * line.unitPriceMinor, 0);
}

export function calculateQuoteTotals(draft: QuoteDraft): QuoteTotals {
  const oneTimeSubtotalMinor = sumLines(draft.lines);
  const recurringSubtotalMinor = sumLines(draft.recurringLines);
  const discountMinor = Math.min(Math.max(0, Math.trunc(draft.discountMinor || 0)), oneTimeSubtotalMinor);
  const taxableBase = Math.max(0, oneTimeSubtotalMinor - discountMinor);
  const taxMinor = draft.taxConfirmed && draft.taxRateBasisPoints !== null
    ? Math.round(taxableBase * draft.taxRateBasisPoints / 10_000)
    : 0;

  return {
    oneTimeSubtotalMinor,
    recurringSubtotalMinor,
    discountMinor,
    taxMinor,
    totalMinor: taxableBase + recurringSubtotalMinor + taxMinor,
  };
}

export function validateQuoteDraft(draft: QuoteDraft, now: Date = new Date()): string[] {
  const errors: string[] = [];
  if (!draft.id.trim()) errors.push("La référence du devis est obligatoire.");
  if (!draft.requestId.trim()) errors.push("Le dossier client associé est obligatoire.");
  if (!Number.isInteger(draft.version) || draft.version < 1) errors.push("La version du devis doit être un entier positif.");
  if (draft.currency !== "XOF") errors.push("La devise du devis n’est pas prise en charge.");
  if (!Array.isArray(draft.lines) || draft.lines.length === 0) errors.push("Ajoutez au moins une prestation ponctuelle.");
  if (!Array.isArray(draft.recurringLines)) errors.push("Les prestations récurrentes sont invalides.");

  for (const [kind, lines] of [["ponctuelle", draft.lines], ["récurrente", draft.recurringLines]] as const) {
    if (!Array.isArray(lines)) continue;
    for (const [index, line] of lines.entries()) {
      const prefix = `Ligne ${kind} ${index + 1}`;
      if (!line || typeof line !== "object") {
        errors.push(`${prefix} invalide.`);
        continue;
      }
      if (typeof line.description !== "string" || !line.description.trim()) errors.push(`${prefix} : description obligatoire.`);
      if (typeof line.unit !== "string" || !line.unit.trim()) errors.push(`${prefix} : unité obligatoire.`);
      if (!Number.isInteger(line.quantity) || line.quantity <= 0) errors.push(`${prefix} : quantité entière supérieure à zéro obligatoire.`);
      if (!Number.isSafeInteger(line.unitPriceMinor) || line.unitPriceMinor < 0) errors.push(`${prefix} : montant entier positif ou nul obligatoire.`);
      if (!line.id?.trim()) errors.push(`${prefix} : identifiant obligatoire.`);
    }
  }

  if (!Number.isSafeInteger(draft.discountMinor) || draft.discountMinor < 0) errors.push("La remise doit être un montant entier positif ou nul.");
  if (draft.discountMinor > sumLines(draft.lines)) errors.push("La remise ne peut pas dépasser le total des prestations ponctuelles.");
  if (draft.taxRateBasisPoints !== null &&
      (!Number.isInteger(draft.taxRateBasisPoints) || draft.taxRateBasisPoints < 0 || draft.taxRateBasisPoints > 10_000)) {
    errors.push("Le taux fiscal doit être compris entre 0 % et 100 %.");
  }
  if (draft.taxRateBasisPoints !== null && !draft.taxConfirmed) errors.push("Le traitement fiscal doit être confirmé avant publication.");
  if (draft.taxConfirmed && draft.taxRateBasisPoints === null) errors.push("Le taux fiscal doit être renseigné avant confirmation.");

  const validity = Date.parse(draft.validityEndsAt);
  if (!draft.validityEndsAt || !Number.isFinite(validity)) {
    errors.push("La date de validité du devis est obligatoire et doit être valide.");
  } else if (validity <= now.getTime()) {
    errors.push("La date de validité doit être postérieure à maintenant.");
  }
  if (!draft.scope.trim()) errors.push("Le périmètre des prestations doit être précisé.");
  if (!draft.exclusions.trim()) errors.push("Les exclusions doivent être précisées, même si aucune exclusion n’est prévue.");
  if (!Array.isArray(draft.assumptions) || draft.assumptions.some((item) => typeof item !== "string" || !item.trim())) {
    errors.push("Les hypothèses doivent être des textes non vides.");
  }
  if (!draft.paymentTerms.trim()) errors.push("Les conditions de paiement doivent être précisées.");
  if (!transitions[draft.status]) errors.push("Le statut du devis est invalide.");

  return errors;
}

export function canTransitionQuoteStatus(from: QuoteStatus, to: QuoteStatus): boolean {
  return (transitions[from] ?? []).includes(to);
}
