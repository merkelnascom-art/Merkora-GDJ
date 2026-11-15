import type { ESCOImportBundle, ESCOConceptRecord } from "./esco-import";

export interface ESCOCsvLanguageFile {
  language: string;
  type: "occupation" | "skill";
  content: string;
}

export interface ParseESCOCsvLanguageFilesInput {
  datasetVersion: string;
  importedAt?: string;
  files: ESCOCsvLanguageFile[];
}

function countOutsideQuotes(line: string, delimiter: string): number {
  let quoted = false;
  let count = 0;
  for (let index = 0; index < line.length; index += 1) {
    if (line[index] === '"') {
      if (quoted && line[index + 1] === '"') index += 1;
      else quoted = !quoted;
    } else if (!quoted && line[index] === delimiter) {
      count += 1;
    }
  }
  return count;
}

function parseRows(content: string): string[][] {
  const firstLine = content.replace(/^\uFEFF/, "").split(/\r?\n/, 1)[0] ?? "";
  const delimiter = countOutsideQuotes(firstLine, ";") > countOutsideQuotes(firstLine, ",") ? ";" : ",";
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < content.length; index += 1) {
    const character = content[index];
    if (character === '"') {
      if (quoted && content[index + 1] === '"') {
        field += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
      continue;
    }
    if (!quoted && character === delimiter) {
      row.push(field);
      field = "";
      continue;
    }
    if (!quoted && (character === "\n" || character === "\r")) {
      if (character === "\r" && content[index + 1] === "\n") index += 1;
      row.push(field);
      field = "";
      if (row.some((value) => value.trim())) rows.push(row);
      row = [];
      continue;
    }
    field += character;
  }

  row.push(field);
  if (row.some((value) => value.trim())) rows.push(row);
  if (quoted) throw new Error("ESCO CSV contains an unterminated quoted field.");
  return rows;
}

function columnIndex(headers: string[], ...names: string[]): number {
  return headers.findIndex((header) => names.includes(header.trim().toLocaleLowerCase("en")));
}

function cell(row: string[], index: number): string {
  return index >= 0 ? (row[index] ?? "").trim() : "";
}

function splitAlternativeLabels(value: string): string[] {
  return [...new Set(value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean))];
}

/**
 * Converts official ESCO language-specific CSV exports into one normalized
 * multilingual import bundle. URI identity is shared across language packs;
 * translations are never inferred when a language file is absent.
 */
export function parseESCOCsvLanguageFiles(
  input: ParseESCOCsvLanguageFilesInput,
): ESCOImportBundle {
  if (!input.datasetVersion.trim()) throw new Error("An ESCO dataset version is required.");
  if (input.files.length === 0) throw new Error("At least one ESCO language file is required.");

  const concepts = new Map<string, ESCOConceptRecord>();
  for (const file of input.files) {
    const language = file.language.trim().toLowerCase();
    if (!/^[a-z]{2,3}$/.test(language)) throw new Error(`Invalid ESCO language code: ${file.language}`);
    const rows = parseRows(file.content);
    if (rows.length < 2) continue;

    const headers = rows[0].map((header, index) => (index === 0 ? header.replace(/^\uFEFF/, "") : header).trim().toLowerCase());
    const uriIndex = columnIndex(headers, "concepturi", "concept_uri", "uri");
    const labelIndex = columnIndex(headers, "preferredlabel", "preferred_label", "label");
    const altIndex = columnIndex(headers, "altlabels", "alternative_labels", "alt_labels");
    const descriptionIndex = columnIndex(headers, "description", "definition", "scopenote");
    const broaderIndex = columnIndex(headers, "broaderuri", "broader_uri", "broader");
    if (uriIndex < 0 || labelIndex < 0) {
      throw new Error("ESCO CSV must contain conceptUri and preferredLabel columns.");
    }

    for (const row of rows.slice(1)) {
      const uri = cell(row, uriIndex);
      const preferredLabel = cell(row, labelIndex);
      if (!uri || !preferredLabel) continue;
      const key = `${file.type}::${uri}`;
      let concept = concepts.get(key);
      if (!concept) {
        concept = {
          uri,
          type: file.type,
          preferredLabels: {},
          alternativeLabels: {},
          descriptions: {},
        };
        concepts.set(key, concept);
      }

      const existingLabel = concept.preferredLabels[language];
      if (existingLabel && existingLabel !== preferredLabel) {
        throw new Error(`Conflicting preferred labels for ESCO concept ${uri} in language ${language}.`);
      }
      concept.preferredLabels[language] = preferredLabel;

      const alternatives = splitAlternativeLabels(cell(row, altIndex));
      const currentAlternatives = concept.alternativeLabels?.[language] ?? [];
      concept.alternativeLabels = {
        ...concept.alternativeLabels,
        [language]: [...new Set([...currentAlternatives, ...alternatives])],
      };
      const description = cell(row, descriptionIndex);
      if (description) concept.descriptions = { ...concept.descriptions, [language]: description };
      const broaderUri = cell(row, broaderIndex);
      if (broaderUri) concept.broaderUri = broaderUri;
    }
  }

  return {
    datasetVersion: input.datasetVersion,
    ...(input.importedAt ? { importedAt: input.importedAt } : {}),
    concepts: [...concepts.values()],
  };
}
