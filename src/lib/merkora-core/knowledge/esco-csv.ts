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
  occupationSkillRelationsCsv?: string;
  broaderRelationFiles?: Array<{ type: "occupation" | "skill"; content: string }>;
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

function normalizeHeader(value: string): string {
  return value.trim().toLocaleLowerCase("en").replace(/[^a-z0-9]/g, "");
}

function columnIndex(headers: string[], ...names: string[]): number {
  const accepted = new Set(names.map(normalizeHeader));
  return headers.findIndex((header) => accepted.has(normalizeHeader(header)));
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
    const conceptTypeIndex = columnIndex(headers, "conceptType", "Concept type", "type");
    const uriIndex = columnIndex(headers, "conceptUri", "Concept URI", "uri");
    const labelIndex = columnIndex(headers, "preferredLabel", "Concept PT", "preferred term", "label");
    const altIndex = columnIndex(headers, "altLabels", "alternative labels", "non-preferred terms");
    const descriptionIndex = columnIndex(headers, "description", "definition", "scope note");
    const broaderIndex = columnIndex(headers, "broaderUri", "broader", "parentConceptUri", "parent URI");
    if (uriIndex < 0 || labelIndex < 0) {
      throw new Error("ESCO CSV must contain conceptUri and preferredLabel columns.");
    }

    for (const row of rows.slice(1)) {
      const uri = cell(row, uriIndex);
      const preferredLabel = cell(row, labelIndex);
      if (!uri || !preferredLabel) continue;
      const rawConceptType = cell(row, conceptTypeIndex).toUpperCase();
      const recordType = file.type === "occupation"
        ? rawConceptType === "OG" ? "occupation_group" : "occupation"
        : rawConceptType === "SG" ? "skill_group" : "skill";
      const key = `${recordType}::${uri}`;
      let concept = concepts.get(key);
      if (!concept) {
        concept = {
          uri,
          type: recordType,
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

  for (const relationFile of input.broaderRelationFiles ?? []) {
    const rows = parseRows(relationFile.content);
    if (rows.length < 2) continue;
    const headers = rows[0].map((header) => header.trim());
    const uriIndex = columnIndex(headers, "conceptUri", "Concept URI", "uri");
    const parentIndex = columnIndex(headers, "broaderUri", "broader", "parentConceptUri", "parent URI");
    if (uriIndex < 0 || parentIndex < 0) {
      throw new Error("ESCO broader-relations CSV must contain concept URI and parent concept URI columns.");
    }
    for (const row of rows.slice(1)) {
      const uri = cell(row, uriIndex);
      const broaderUri = cell(row, parentIndex);
      const concept = concepts.get(`${relationFile.type}::${uri}`)
        ?? concepts.get(`${relationFile.type}_group::${uri}`);
      if (concept && broaderUri) concept.broaderUri = broaderUri;
    }
  }

  const occupationSkillRelations = (input.occupationSkillRelationsCsv
    ? (() => {
        const rows = parseRows(input.occupationSkillRelationsCsv);
        if (rows.length < 2) return [];
        const headers = rows[0].map((header) => header.trim());
        const occupationIndex = columnIndex(headers, "occupationUri", "occupation URI", "occupationConceptUri");
        const skillIndex = columnIndex(headers, "skillUri", "skill URI", "skillConceptUri");
        const relationIndex = columnIndex(headers, "relation", "relationType", "relationshipType", "type");
        if (occupationIndex < 0 || skillIndex < 0 || relationIndex < 0) {
          throw new Error("ESCO occupation-skill relations CSV must contain occupation URI, skill URI and relation type columns.");
        }
        return rows.slice(1).flatMap((row) => {
          const occupationUri = cell(row, occupationIndex);
          const skillUri = cell(row, skillIndex);
          const relationValue = cell(row, relationIndex).toLocaleLowerCase("en");
          if (!occupationUri || !skillUri || !relationValue) return [];
          if (!relationValue.includes("essential") && !relationValue.includes("optional")) {
            throw new Error(`Unknown ESCO occupation-skill relation type: ${relationValue}`);
          }
          return [{
            occupationUri,
            skillUri,
            relation: relationValue.includes("essential") ? "essential" as const : "optional" as const,
          }];
        });
      })()
    : []);

  return {
    datasetVersion: input.datasetVersion,
    ...(input.importedAt ? { importedAt: input.importedAt } : {}),
    concepts: [...concepts.values()],
    ...(occupationSkillRelations.length ? { occupationSkillRelations } : {}),
  };
}
