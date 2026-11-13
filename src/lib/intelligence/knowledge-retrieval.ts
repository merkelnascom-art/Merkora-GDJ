/**
 * Transparent lexical retrieval for authorized MerKora knowledge sources.
 *
 * BM25 ranks supplied documents; it does not create knowledge, embeddings,
 * citations, or factual guarantees. Callers must enforce tenant/source access
 * before supplying documents.
 */
export type KnowledgeDocument = {
  id: string;
  title: string;
  content: string;
  sourceLabel: string;
  uri?: string;
};

export type KnowledgeMatch = {
  documentId: string;
  title: string;
  sourceLabel: string;
  uri?: string;
  score: number;
  excerpt: string;
  matchedTerms: string[];
};

export type KnowledgeSearchResult = {
  queryTerms: string[];
  matches: KnowledgeMatch[];
  method: "bm25-lexical";
  sourceCount: number;
};

const STOP_WORDS = new Set([
  "alors", "au", "aucun", "aussi", "autre", "avec", "avoir", "bon", "car",
  "ce", "cela", "ces", "ceux", "chaque", "ci", "comme", "comment", "dans",
  "des", "du", "dedans", "dehors", "depuis", "doit", "donc", "dos", "droite",
  "elle", "elles", "en", "encore", "essai", "est", "et", "eu", "fait", "faites",
  "fois", "font", "force", "haut", "hors", "ici", "il", "ils", "je", "juste",
  "la", "le", "les", "leur", "là", "ma", "maintenant", "mais", "mes", "mine",
  "moins", "mon", "mot", "même", "ni", "nommés", "notre", "nous", "nouveaux",
  "ou", "où", "par", "parce", "pas", "peut", "peu", "plupart", "pour", "pourquoi",
  "quand", "que", "quel", "quelle", "quelles", "quels", "qui", "sa", "sans",
  "ses", "seulement", "si", "sien", "son", "sont", "sous", "soyez", "sujet",
  "sur", "ta", "tandis", "tellement", "tels", "tes", "ton", "tous", "tout",
  "trop", "très", "tu", "voient", "vont", "votre", "vous", "vu", "ça", "être",
]);

function normalize(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("fr");
}

function tokenize(value: string): string[] {
  return normalize(value)
    .match(/[a-z0-9]{2,}/g)
    ?.filter((term) => !STOP_WORDS.has(term)) ?? [];
}

function excerptFor(content: string, terms: string[], maxLength = 420): string {
  const normalized = normalize(content);
  const positions = terms
    .map((term) => normalized.indexOf(term))
    .filter((position) => position >= 0);
  const start = positions.length ? Math.max(0, Math.min(...positions) - 100) : 0;
  const end = Math.min(content.length, start + maxLength);
  return `${start > 0 ? "…" : ""}${content.slice(start, end).trim()}${end < content.length ? "…" : ""}`;
}

function validateDocuments(documents: KnowledgeDocument[]): KnowledgeDocument[] {
  if (!Array.isArray(documents) || documents.length > 1000) {
    throw new RangeError("Knowledge search accepts at most 1000 documents.");
  }
  const ids = new Set<string>();
  return documents.map((document) => {
    if (!document || typeof document.id !== "string" || !/^[a-zA-Z0-9._:-]{1,160}$/.test(document.id) ||
      typeof document.title !== "string" || !document.title.trim() || document.title.length > 300 ||
      typeof document.content !== "string" || document.content.length > 40000 ||
      typeof document.sourceLabel !== "string" || !document.sourceLabel.trim() || document.sourceLabel.length > 200 ||
      (document.uri !== undefined && (typeof document.uri !== "string" || document.uri.length > 2048))) {
      throw new TypeError("A knowledge document has invalid or oversized fields.");
    }
    if (ids.has(document.id)) throw new TypeError("Knowledge document IDs must be unique.");
    ids.add(document.id);
    return document;
  });
}

/** Search only the authorized documents explicitly supplied by the caller. */
export function searchKnowledge(
  query: string,
  suppliedDocuments: KnowledgeDocument[],
  options: { limit?: number; minimumScore?: number } = {},
): KnowledgeSearchResult {
  if (typeof query !== "string" || query.trim().length === 0 || query.length > 2000) {
    throw new RangeError("Knowledge query must contain 1–2000 characters.");
  }
  const limit = options.limit ?? 5;
  const minimumScore = options.minimumScore ?? 0;
  if (!Number.isInteger(limit) || limit < 1 || limit > 20 ||
      !Number.isFinite(minimumScore) || minimumScore < 0) {
    throw new RangeError("Invalid knowledge search options.");
  }

  const documents = validateDocuments(suppliedDocuments);
  const queryTerms = [...new Set(tokenize(query))];
  if (queryTerms.length === 0 || documents.length === 0) {
    return { queryTerms, matches: [], method: "bm25-lexical", sourceCount: documents.length };
  }

  const tokenized = documents.map((document) => tokenize(`${document.title} ${document.content}`));
  const averageLength = tokenized.reduce((sum, terms) => sum + terms.length, 0) / documents.length || 1;
  const documentFrequency = new Map<string, number>();
  for (const term of queryTerms) {
    documentFrequency.set(term, tokenized.filter((terms) => terms.includes(term)).length);
  }

  const matches = documents.flatMap((document, index) => {
    const terms = tokenized[index];
    const length = terms.length;
    const matchedTerms = queryTerms.filter((term) => terms.includes(term));
    if (matchedTerms.length === 0) return [];
    let score = 0;
    for (const term of matchedTerms) {
      const frequency = terms.filter((candidate) => candidate === term).length;
      const frequencyInDocuments = documentFrequency.get(term) ?? 0;
      const inverseDocumentFrequency = Math.log(
        1 + (documents.length - frequencyInDocuments + 0.5) / (frequencyInDocuments + 0.5),
      );
      const k1 = 1.2;
      const b = 0.75;
      score += inverseDocumentFrequency *
        (frequency * (k1 + 1)) /
        (frequency + k1 * (1 - b + b * length / averageLength));
    }
    if (score < minimumScore) return [];
    return [{
      documentId: document.id,
      title: document.title,
      sourceLabel: document.sourceLabel,
      ...(document.uri ? { uri: document.uri } : {}),
      score,
      excerpt: excerptFor(document.content, matchedTerms),
      matchedTerms,
    }];
  }).sort((left, right) => right.score - left.score || left.documentId.localeCompare(right.documentId));

  return {
    queryTerms,
    matches: matches.slice(0, limit),
    method: "bm25-lexical",
    sourceCount: documents.length,
  };
}
