import { NextResponse } from "next/server";
import { isSameOrigin } from "@/lib/server/supabase-rest";
import { requestAiGatewayCompletion } from "@/lib/ai-provider";
import { parseCompetitiveAnalysis, parseCompetitorInputs, type CompetitiveAnalysis, type CompetitorInput } from "@/lib/competitive-analysis";
import type { NeedInput, Recommendation } from "@/lib/solution-recommendations";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

type Improvement = {
  title: string;
  description: string;
  expectedBenefit: string;
  effort: "low" | "medium" | "high" | "unknown";
  priority: "high" | "medium" | "low";
  assumptions: string[];
};

type Analysis = {
  summary: string;
  domain: string;
  understood: string[];
  questions: string[];
  recommendations: Recommendation[];
  improvements: Improvement[];
  competitiveAnalysis: CompetitiveAnalysis;
  assumptions: string[];
  nextSteps: string[];
};

function text(value: unknown, max = 900): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function stringList(value: unknown, maxItems: number, maxLength = 260): string[] {
  if (!Array.isArray(value)) return [];
  return value.slice(0, maxItems).map((item) => text(item, maxLength)).filter(Boolean);
}

function parseImprovements(value: unknown): Improvement[] {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 5).flatMap((raw) => {
    if (!raw || typeof raw !== "object") return [];
    const item = raw as Record<string, unknown>;
    const title = text(item.title, 100);
    const description = text(item.description, 500);
    const expectedBenefit = text(item.expectedBenefit, 260);
    const effortValues = ["low", "medium", "high", "unknown"];
    const priorityValues = ["high", "medium", "low"];
    const effort = effortValues.includes(String(item.effort)) ? item.effort as Improvement["effort"] : "unknown";
    const priority = priorityValues.includes(String(item.priority)) ? item.priority as Improvement["priority"] : "medium";
    const assumptions = stringList(item.assumptions, 4, 220);
    return title && description && expectedBenefit
      ? [{ title, description, expectedBenefit, effort, priority, assumptions }]
      : [];
  });
}

function parseAnalysis(value: unknown, competitors: CompetitorInput[]): Analysis | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Record<string, unknown>;
  const recommendations = Array.isArray(item.recommendations)
    ? item.recommendations.slice(0, 5).flatMap((raw) => {
        if (!raw || typeof raw !== "object") return [];
        const recommendation = raw as Record<string, unknown>;
        const title = text(recommendation.title, 100);
        const description = text(recommendation.description, 500);
        const reason = text(recommendation.reason, 350);
        return title && description && reason ? [{ title, description, reason }] : [];
      })
    : [];
  const result: Analysis = {
    summary: text(item.summary, 900),
    domain: text(item.domain, 100),
    understood: stringList(item.understood, 5),
    questions: stringList(item.questions, 6),
    recommendations,
    improvements: parseImprovements(item.improvements),
    competitiveAnalysis: parseCompetitiveAnalysis(item.competitiveAnalysis, competitors.length > 0),
    assumptions: stringList(item.assumptions, 5),
    nextSteps: stringList(item.nextSteps, 5),
  };
  return result.summary && result.recommendations.length > 0 ? result : null;
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Requête non autorisée." }, { status: 403 });
  // Critical cost gate: this check must happen before credentials, body parsing or provider access.
  if (process.env.MERKORA_AI_ENABLED !== "true") {
    return NextResponse.json({ error: "L’IA est intégrée au code mais désactivée. Aucun appel au fournisseur n’est effectué avant une activation explicite et un contrôle du budget." }, { status: 503 });
  }

  const apiKey = process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN;
  if (!apiKey) return NextResponse.json({ error: "Authentification AI Gateway non configurée." }, { status: 503 });

  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Dossier invalide." }, { status: 400 }); }
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Dossier invalide." }, { status: 400 });
  const input = body as Record<string, unknown>;
  const need: NeedInput = {
    title: text(input.title, 120),
    category: ["business", "digital", "creative", "organization", "personal", "other"].includes(String(input.category)) ? input.category as NeedInput["category"] : "other",
    problem: text(input.problem, 3000),
    desiredOutcome: text(input.desiredOutcome, 2000),
    budget: text(input.budget, 120) || "À définir",
    urgency: ["low", "normal", "soon", "urgent"].includes(String(input.urgency)) ? String(input.urgency) : "normal",
  };
  const competitors = parseCompetitorInputs(input.competitors);
  if (need.title.length < 3 || need.problem.length < 15 || need.desiredOutcome.length < 8) {
    return NextResponse.json({ error: "Le dossier doit contenir un titre, un problème concret et un résultat souhaité." }, { status: 400 });
  }

  const model = process.env.MERKORA_AI_MODEL || "deepseek/deepseek-v4.1-flash";
  const prompt = [
    "Tu es l’analyste de besoins de MerKora GDJ, plateforme qui aide à concevoir des solutions numériques et organisationnelles.",
    "Réponds en français, avec prudence, sans inventer de faits, prix, délais, garanties, capacités ou recherches externes.",
    "Distingue les faits fournis, les hypothèses et les questions. Ne prends pas de décision définitive à la place du client.",
    "Propose 2 à 5 pistes concrètes et différentes, adaptées au domaine réel; compare une procédure humaine, un outil existant, une automatisation et une application sur mesure quand c’est pertinent.",
    "Pour chaque piste, fournis title, description et reason. Les recommandations sont modifiables, pas un devis ni une commande.",
    "Propose 0 à 5 améliorations priorisées. Pour chaque amélioration, retourne title, description, expectedBenefit, effort (low|medium|high|unknown), priority (high|medium|low), assumptions (string[]). Ne chiffre pas le ROI ni les délais sans données vérifiables.",
    "Pour l’analyse concurrentielle, compare uniquement les informations fournies ci-dessous. N’invente aucun nom, prix, fonctionnalité, part de marché ou avantage concurrentiel et ne prétends pas avoir consulté le web.",
    "Retourne competitiveAnalysis avec summary, comparisonCriteria (string[]), opportunities (string[]), unknowns (string[]), nextSteps (string[]). Sans concurrents fournis, résume la démarche de recherche et les questions à vérifier, sans nommer de concurrents fictifs.",
    "Retourne uniquement un objet JSON valide contenant: summary, domain, understood (string[]), questions (string[]), recommendations ({title,description,reason}[]), improvements ({title,description,expectedBenefit,effort,priority,assumptions}[]), competitiveAnalysis, assumptions (string[]), nextSteps (string[]).",
    "Ne demande pas de mots de passe, secrets, informations de paiement ou données sensibles. Si le domaine est flou, pose des questions et indique les incertitudes.",
    "",
    "Dossier client fourni:",
    JSON.stringify({ need, competitorSourcesProvidedByUser: competitors }),
  ].join("\n");

  try {
    const response = await requestAiGatewayCompletion({
      apiKey,
      model,
      messages: [
        { role: "system", content: "Tu fournis une analyse de besoins structurée, transparente, sourcée uniquement sur les informations disponibles et modifiable." },
        { role: "user", content: prompt },
      ],
      maxTokens: 2200,
      timeoutMs: 25_000,
    });
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) return NextResponse.json({ error: "AI Gateway a refusé l’authentification. Vérifiez l’accès configuré côté serveur." }, { status: 502 });
      if (response.status === 402) return NextResponse.json({ error: "Le service IA indique un solde ou une limite de budget insuffisante. Aucun nouvel essai automatique n’est lancé." }, { status: 503 });
      if (response.status === 429) return NextResponse.json({ error: "La limite de requêtes IA est atteinte. Réessayez plus tard." }, { status: 429 });
      return NextResponse.json({ error: "Le moteur IA n’a pas pu analyser ce dossier. Les pistes locales restent disponibles." }, { status: 502 });
    }
    const payload = await response.json() as { choices?: Array<{ message?: { content?: unknown } }> };
    const content = payload.choices?.[0]?.message?.content;
    if (typeof content !== "string") return NextResponse.json({ error: "La réponse du moteur IA est incomplète. Réessayez." }, { status: 502 });
    let decoded: unknown;
    try { decoded = JSON.parse(content); } catch { return NextResponse.json({ error: "La réponse du moteur IA n’a pas respecté le format attendu. Réessayez." }, { status: 502 }); }
    const analysis = parseAnalysis(decoded, competitors);
    if (!analysis) return NextResponse.json({ error: "La réponse du moteur IA est incomplète. Les pistes locales restent disponibles." }, { status: 502 });
    return NextResponse.json({ analysis, model }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Le moteur IA est momentanément indisponible. Les pistes locales restent disponibles." }, { status: 502 });
  }
}
