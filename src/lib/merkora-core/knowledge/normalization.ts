/**
 * Normalizes a term for lookup while leaving the original term untouched in
 * KnowledgeTerm. This is technical normalization, not semantic equivalence.
 */
export function normalizeKnowledgeTerm(value: string): string {
  return value
    .normalize("NFKC")
    .replace(/[’‘`´]/g, "'")
    .trim()
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
}
