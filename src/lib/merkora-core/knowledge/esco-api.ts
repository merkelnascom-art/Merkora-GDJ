export interface ESCOSuggestion {
  uri: string;
  label: string;
  description?: string;
  alternativeLabels: string[];
  language: string;
  source: "ESCO";
}

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord | undefined {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as UnknownRecord
    : undefined;
}

function asText(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim()) return value.trim();
  const record = asRecord(value);
  if (!record) return undefined;
  for (const key of ["literal", "value", "label", "text"]) {
    const candidate = record[key];
    if (typeof candidate === "string" && candidate.trim()) return candidate.trim();
  }
  return undefined;
}

function asTextList(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(asText).filter((item): item is string => Boolean(item));
  if (typeof value === "string") return value.split(/[\n|;]/).map((item) => item.trim()).filter(Boolean);
  return [];
}

/**
 * ESCO HAL payloads have varied slightly between API releases. This adapter
 * accepts the documented HAL collection and common export shapes while
 * requiring a stable occupation URI and a real preferred label.
 */
export function normalizeESCOApiSuggestions(payload: unknown, language: string): ESCOSuggestion[] {
  const root = asRecord(payload);
  if (!root) return [];

  const collections: unknown[] = [];
  const embedded = asRecord(root._embedded);
  if (embedded) collections.push(...Object.values(embedded));
  for (const key of ["results", "items", "suggestions", "occupations"]) {
    if (Array.isArray(root[key])) collections.push(root[key]);
  }

  const output: ESCOSuggestion[] = [];
  const seen = new Set<string>();
  for (const collection of collections) {
    if (!Array.isArray(collection)) continue;
    for (const raw of collection) {
      const item = asRecord(raw);
      if (!item) continue;
      const uri = asText(item.uri) ?? asText(item.conceptUri) ?? asText(item.conceptURI);
      const label = asText(item.preferredLabel) ?? asText(item.title) ?? asText(item.label);
      if (!uri || !label || !uri.includes("/occupation/") || seen.has(uri)) continue;
      seen.add(uri);
      const description = asText(item.description) ?? asText(item.definition);
      output.push({
        uri,
        label,
        ...(description ? { description } : {}),
        alternativeLabels: asTextList(item.altLabels ?? item.alternativeLabels),
        language,
        source: "ESCO",
      });
    }
  }
  return output;
}

export const ESCO_API_LANGUAGE_CODES = [
  "bg", "es", "cs", "da", "de", "et", "el", "en", "fr", "ga", "hr", "it", "lv", "lt",
  "hu", "mt", "nl", "pl", "pt", "ro", "sk", "sl", "fi", "sv", "is", "no", "ar", "uk",
] as const;
