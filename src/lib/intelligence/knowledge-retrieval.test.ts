import { describe, expect, it } from "vitest";
import { searchKnowledge, type KnowledgeDocument } from "./knowledge-retrieval";

const documents: KnowledgeDocument[] = [
  {
    id: "privacy-001",
    title: "Protection des données personnelles",
    content: "Informer les personnes concernées, limiter les données collectées et contrôler les accès selon les rôles.",
    sourceLabel: "Guide interne — confidentialité",
    uri: "https://example.test/privacy",
  },
  {
    id: "finance-001",
    title: "Suivi des contributions financières",
    content: "Enregistrer les montants, les dates, les contributeurs et les justificatifs autorisés.",
    sourceLabel: "Guide interne — gestion financière",
  },
  {
    id: "offline-001",
    title: "Synchronisation hors ligne",
    content: "Mettre en file les modifications locales et les synchroniser lorsque la connexion revient.",
    sourceLabel: "Guide technique — synchronisation",
  },
];

describe("authorized knowledge retrieval", () => {
  it("ranks relevant documents and preserves source provenance", () => {
    const result = searchKnowledge("comment protéger les données et limiter les accès", documents);
    expect(result.method).toBe("bm25-lexical");
    expect(result.matches[0].documentId).toBe("privacy-001");
    expect(result.matches[0].sourceLabel).toBe("Guide interne — confidentialité");
    expect(result.matches[0].uri).toBe("https://example.test/privacy");
    expect(result.matches[0].matchedTerms).toContain("donnees");
  });

  it("supports top-k limits and deterministic tie breaking", () => {
    const result = searchKnowledge("synchroniser connexion", documents, { limit: 1 });
    expect(result.matches).toHaveLength(1);
    expect(result.matches[0].documentId).toBe("offline-001");
  });

  it("returns no fabricated sources for an unrelated query", () => {
    const result = searchKnowledge("astronomie quantique", documents);
    expect(result.matches).toEqual([]);
    expect(result.sourceCount).toBe(3);
  });

  it("normalizes French accents and punctuation", () => {
    const result = searchKnowledge("protection des données personnelles", documents);
    expect(result.matches[0].documentId).toBe("privacy-001");
  });

  it("keeps excerpt offsets correct for decomposed Unicode accents", () => {
    const decomposedPrefix = "e\\u0301".repeat(180);
    const result = searchKnowledge("repère unique", [{
      id: "unicode-001",
      title: "Texte Unicode",
      content: `${decomposedPrefix} repère unique suivi d'un passage important.`,
      sourceLabel: "Test Unicode",
    }]);
    expect(result.matches).toHaveLength(1);
    expect(result.matches[0].excerpt).toContain("repère unique");
    expect(result.matches[0].excerpt).toContain("passage important");
  });

  it("rejects duplicate IDs, invalid limits and oversized source collections", () => {
    expect(() => searchKnowledge("finance", [documents[0], documents[0]])).toThrow(TypeError);
    expect(() => searchKnowledge("finance", documents, { limit: 0 })).toThrow(RangeError);
    expect(() => searchKnowledge("finance", Array.from({ length: 1001 }, (_, i) => ({
      id: `doc-${i}`, title: "x", content: "x", sourceLabel: "x",
    })))).toThrow(RangeError);
  });
});
