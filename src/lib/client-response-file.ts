export const CLIENT_RESPONSE_SCHEMA = "merkora.client-response.v1" as const;

export type ClientResponseChoice = "accepted" | "changes_requested" | "negotiate";
export type ClientResponseFile = {
  schema: typeof CLIENT_RESPONSE_SCHEMA;
  project: { id: string; title: string };
  quote: { amountFcfa: string | null; estimatedDays: string | null; paymentTerms: string };
  response: { choice: ClientResponseChoice; comment: string };
  exportedAt: string;
  notice: string;
};

const choices = new Set<ClientResponseChoice>(["accepted", "changes_requested", "negotiate"]);
const MAX_FILE_LENGTH = 100_000;
const MAX_TEXT = 1200;

function boundedString(value: unknown, maxLength: number): value is string {
  return typeof value === "string" && value.length <= maxLength;
}

export function parseClientResponseFile(input: unknown): ClientResponseFile {
  if (typeof input !== "string" || input.length > MAX_FILE_LENGTH) {
    throw new Error("Fichier invalide ou trop volumineux (maximum 100 Ko).");
  }

  let value: unknown;
  try {
    value = JSON.parse(input);
  } catch {
    throw new Error("Le fichier n'est pas un JSON valide.");
  }

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Le contenu JSON doit être un objet.");
  }

  const data = value as Record<string, unknown>;
  if (data.schema !== CLIENT_RESPONSE_SCHEMA) {
    throw new Error("Version de fichier inconnue. Importez un export de réponse MerKora v1.");
  }
  if (!data.project || typeof data.project !== "object" || Array.isArray(data.project)) {
    throw new Error("Référence du projet absente.");
  }
  const project = data.project as Record<string, unknown>;
  if (!boundedString(project.id, 160) || project.id.trim().length === 0 ||
      !boundedString(project.title, 160) || project.title.trim().length === 0) {
    throw new Error("La référence et le titre du projet sont obligatoires (160 caractères maximum).");
  }
  if (!data.quote || typeof data.quote !== "object" || Array.isArray(data.quote)) {
    throw new Error("Les informations de proposition sont absentes.");
  }
  const quote = data.quote as Record<string, unknown>;
  if (!(quote.amountFcfa === null || (boundedString(quote.amountFcfa, 40) && (quote.amountFcfa === "" || /^\\d+(?:[.,]\\d{1,2})?$/.test(quote.amountFcfa)))) ||
      !(quote.estimatedDays === null || (boundedString(quote.estimatedDays, 20) && (quote.estimatedDays === "" || /^\\d+$/.test(quote.estimatedDays)))) ||
      !boundedString(quote.paymentTerms, 500)) {
    throw new Error("Les informations de proposition sont invalides.");
  }
  if (!data.response || typeof data.response !== "object" || Array.isArray(data.response)) {
    throw new Error("La réponse du client est absente.");
  }
  const response = data.response as Record<string, unknown>;
  if (typeof response.choice !== "string" || !choices.has(response.choice as ClientResponseChoice) ||
      !boundedString(response.comment, MAX_TEXT)) {
    throw new Error("La décision ou le commentaire du client est invalide.");
  }
  if (!boundedString(data.exportedAt, 40) || Number.isNaN(Date.parse(data.exportedAt))) {
    throw new Error("La date d'export est absente ou invalide.");
  }

  return {
    schema: CLIENT_RESPONSE_SCHEMA,
    project: { id: project.id.trim(), title: project.title.trim() },
    quote: {
      amountFcfa: quote.amountFcfa,
      estimatedDays: quote.estimatedDays,
      paymentTerms: quote.paymentTerms,
    },
    response: { choice: response.choice as ClientResponseChoice, comment: response.comment },
    exportedAt: data.exportedAt,
    notice: "Import manuel local : fichier à vérifier. Cet import ne confirme ni l'identité de l'expéditeur ni une acceptation contractuelle.",
  };
}
