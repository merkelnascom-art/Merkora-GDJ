export type CompetitorInput = {
  name: string;
  url: string;
  offer: string;
  price: string;
  notes: string;
};

export type CompetitiveAnalysis = {
  summary: string;
  comparisonCriteria: string[];
  opportunities: string[];
  unknowns: string[];
  nextSteps: string[];
  researchStatus: "not_verified" | "user_supplied";
};

function boundedText(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export function parseCompetitorInputs(value: unknown): CompetitorInput[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  return value.slice(0, 5).flatMap((raw) => {
    if (!raw || typeof raw !== "object") return [];
    const item = raw as Record<string, unknown>;
    const name = boundedText(item.name, 100);
    const url = boundedText(item.url, 240);
    const offer = boundedText(item.offer, 500);
    const price = boundedText(item.price, 120);
    const notes = boundedText(item.notes, 500);
    if (!name && !url && !offer && !price && !notes) return [];
    const identity = (url || name).toLocaleLowerCase("fr");
    if (identity && seen.has(identity)) return [];
    if (identity) seen.add(identity);
    return [{ name, url, offer, price, notes }];
  });
}

export function parseCompetitiveAnalysis(value: unknown, hasSuppliedCompetitors: boolean): CompetitiveAnalysis {
  const item = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const list = (candidate: unknown, max: number, length = 260): string[] =>
    Array.isArray(candidate)
      ? candidate.slice(0, max).map((entry) => boundedText(entry, length)).filter(Boolean)
      : [];
  return {
    summary: boundedText(item.summary, 800) || (
      hasSuppliedCompetitors
        ? "Comparaison partielle : seules les informations fournies ont été prises en compte."
        : "La concurrence n’a pas été vérifiée. Ajoutez des noms ou des sources publiques pour préparer une comparaison."
    ),
    comparisonCriteria: list(item.comparisonCriteria, 8, 160),
    opportunities: list(item.opportunities, 5, 260),
    unknowns: list(item.unknowns, 8, 220),
    nextSteps: list(item.nextSteps, 6, 220),
    researchStatus: hasSuppliedCompetitors ? "user_supplied" : "not_verified",
  };
}
