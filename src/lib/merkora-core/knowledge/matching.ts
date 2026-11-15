import { normalizeKnowledgeTerm } from "./normalization";
import type { KnowledgeConcept, KnowledgeRegistry } from "./types";

export type KnowledgeMatchMethod = "exact" | "normalized" | "synonym";

export type KnowledgeMatchResult =
  | {
      status: "matched";
      query: string;
      concept: KnowledgeConcept;
      method: KnowledgeMatchMethod;
      confidence: number;
    }
  | {
      status: "type_only";
      query: string;
      concept: KnowledgeConcept;
      confidence: number;
    }
  | {
      status: "ambiguous";
      query: string;
      candidates: KnowledgeConcept[];
    }
  | {
      status: "unmatched";
      query: string;
    };

interface Candidate {
  concept: KnowledgeConcept;
  rank: number;
  method: KnowledgeMatchMethod;
}

export interface KnowledgeMatchOptions {
  expectedType?: string;
  allowTypeFallback?: boolean;
  includeNonValidated?: boolean;
}

/**
 * Performs cautious lexical lookup only. It does not claim semantic similarity.
 * Equal best candidates remain ambiguous rather than being selected arbitrarily.
 */
export function matchKnowledgeConcept(
  query: string,
  registry: KnowledgeRegistry,
  options: KnowledgeMatchOptions = {},
): KnowledgeMatchResult {
  const original = query.trim();
  if (!original) return { status: "unmatched", query };

  const normalizedQuery = normalizeKnowledgeTerm(original);
  const candidates: Candidate[] = [];

  for (const concept of registry.concepts) {
    if (!options.includeNonValidated && concept.lifecycle.status !== "validated") continue;
    if (options.expectedType && concept.conceptType !== options.expectedType) continue;

    const terms = [
      ...concept.terms.map((term) => ({ value: term.value, kind: term.kind })),
      ...concept.definitions.map((definition) => ({ value: definition.label, kind: "preferred" as const })),
    ];

    for (const term of terms) {
      const normalizedTerm = normalizeKnowledgeTerm(term.value);
      if (term.value === original) {
        candidates.push({
          concept,
          rank: term.kind === "preferred" ? 3 : 1,
          method: term.kind === "preferred" ? "exact" : "synonym",
        });
      } else if (normalizedTerm === normalizedQuery) {
        candidates.push({
          concept,
          rank: term.kind === "preferred" ? 2 : 1,
          method: term.kind === "preferred" ? "normalized" : "synonym",
        });
      }
    }
  }

  const bestByConcept = new Map<string, Candidate>();
  for (const candidate of candidates) {
    const existing = bestByConcept.get(candidate.concept.id);
    if (!existing || candidate.rank > existing.rank) bestByConcept.set(candidate.concept.id, candidate);
  }

  const ranked = [...bestByConcept.values()].sort((a, b) => b.rank - a.rank);
  if (ranked.length > 0) {
    const bestRank = ranked[0].rank;
    const best = ranked.filter((candidate) => candidate.rank === bestRank);
    if (best.length > 1) {
      return { status: "ambiguous", query, candidates: best.map((candidate) => candidate.concept) };
    }
    const selected = best[0];
    return {
      status: "matched",
      query,
      concept: selected.concept,
      method: selected.method,
      confidence: selected.rank === 3 ? 1 : selected.rank === 2 ? 0.98 : 0.94,
    };
  }

  if (options.allowTypeFallback && options.expectedType) {
    const typed = registry.concepts.filter((concept) =>
      concept.conceptType === options.expectedType &&
      (options.includeNonValidated || concept.lifecycle.status === "validated"),
    );
    if (typed.length === 1) {
      return { status: "type_only", query, concept: typed[0], confidence: 0.75 };
    }
    if (typed.length > 1) return { status: "ambiguous", query, candidates: typed };
  }

  return { status: "unmatched", query };
}
