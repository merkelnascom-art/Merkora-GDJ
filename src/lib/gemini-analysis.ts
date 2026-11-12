import type { LocalAnalysis, LocalImprovement } from "./local-analysis";
import type { Recommendation } from "./solution-recommendations";
import { parseCompetitiveAnalysis } from "./competitive-analysis";

function recordOf(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function stringList(value: unknown, maxItems: number, maxLength: number): string[] {
  if (!Array.isArray(value)) return [];
  return value.slice(0, maxItems)
    .map((item) => text(item, maxLength))
    .filter(Boolean);
}

export function parseGeminiAnalysis(
  value: unknown,
  fallbackDomain: string,
  hasSuppliedCompetitors: boolean,
): LocalAnalysis | null {
  const item = recordOf(value);
  if (!item) return null;

  const summary = text(item.summary, 1200);
  const domain = text(item.domain, 120) || fallbackDomain;
  const requiredLists = [
    "understood", "questions", "recommendations", "improvements", "assumptions", "nextSteps",
  ];
  if (!summary || !domain || requiredLists.some((key) => !Array.isArray(item[key]))) return null;

  const recommendations: Recommendation[] = (item.recommendations as unknown[])
    .slice(0, 8)
    .flatMap((raw) => {
      const candidate = recordOf(raw);
      const title = text(candidate?.title, 100);
      const description = text(candidate?.description, 500);
      const reason = text(candidate?.reason, 350);
      return title && description && reason ? [{ title, description, reason }] : [];
    });

  const improvements: LocalImprovement[] = (item.improvements as unknown[])
    .slice(0, 6)
    .flatMap((raw) => {
      const candidate = recordOf(raw);
      const title = text(candidate?.title, 100);
      const description = text(candidate?.description, 500);
      const expectedBenefit = text(candidate?.expectedBenefit, 300);
      if (!title || !description || !expectedBenefit) return [];
      const effort = candidate?.effort === "low" || candidate?.effort === "medium" || candidate?.effort === "high"
        ? candidate.effort : "unknown";
      const priority = candidate?.priority === "high" || candidate?.priority === "low"
        ? candidate.priority : "medium";
      return [{
        title, description, expectedBenefit, effort, priority,
        assumptions: stringList(candidate?.assumptions, 5, 220),
      }];
    });

  if (!recommendations.length || !improvements.length) return null;

  return {
    summary,
    domain,
    understood: stringList(item.understood, 12, 260),
    questions: stringList(item.questions, 10, 300),
    recommendations,
    improvements,
    competitiveAnalysis: parseCompetitiveAnalysis(item.competitiveAnalysis, hasSuppliedCompetitors),
    assumptions: stringList(item.assumptions, 10, 260),
    nextSteps: stringList(item.nextSteps, 10, 260),
  };
}
