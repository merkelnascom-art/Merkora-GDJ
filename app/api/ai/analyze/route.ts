import { NextResponse } from "next/server";
import { isSameOrigin } from "@/lib/server/supabase-rest";
import type { NeedInput, Recommendation } from "@/lib/solution-recommendations";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

type Analysis = {
  summary: string;
  domain: string;
  understood: string[];
  questions: string[];
  recommendations: Recommendation[];
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

function parseAnalysis(value: unknown): Analysis | null {
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
    assumptions: stringList(item.assumptions, 5),
    nextSteps: stringList(item.nextSteps, 5),
  };
  return result.summary && result.recommendations.length > 0 ? result : null;
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Requête non autorisée." }, { status: 403 });
  if (process.env.MERKORA_AI_ENABLED !== "true") {
    return NextResponse.json({ error: "L’IA est intégrée au code mais désactivée. Elle ne sera activée qu’après configuration explicite du budget et de l’accès AI Gateway." }, { status: 503 });
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
  if (need.title.length < 3 || need.problem.length < 15 || need.desiredOutcome.length < 8) {
    return NextResponse.json({ error: "Le dossier doit contenir un titre, un problème concret et un résultat souhaité." }, { status: 400 });
  }

  const model = process.env.MERKORA_AI_MODEL || "deepseek/deepseek-v4.1-flash";
  const prompt = [
    "Tu es l’analyste de besoins de MerKora GDJ, plateforme qui aide à concevoir des solutions numériques et organisationnelles.",
    "Réponds en français, avec prudence, sans inventer de faits, prix, délais, garanties, capacités ou recherches externes.",
    "Distingue clairement les faits fournis, les hypothèses et les questions. Ne prends pas une décision définitive à la place du client.",
    "Propose 2 à 5 pistes concrètes et différentes, adaptées au domaine réel; considère une procédure humaine, un outil existant, une automatisation et une application sur mesure quand c’est pertinent.",
    "Pour chaque piste, fournis title, description et reason. Les recommandations sont des propositions modifiables, pas un devis ni une commande.",
    "Retourne uniquement un objet JSON valide contenant exactement ces champs: summary (string), domain (string), understood (string[]), questions (string[]), recommendations ({title,description,reason}[]), assumptions (string[]), nextSteps (string[]).",
    "Ne demande pas de données sensibles ou de mots de passe. Si le domaine ou le résultat est flou, pose des questions et indique les incertitudes.",
    "",
    "Dossier client:",
    JSON.stringify(need),
  ].join("\n");

  try {
    const response = await fetch("https://ai-gateway.vercel.sh/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        messages: [{ role: "system", content: "Tu fournis une analyse de besoins structurée, transparente et modifiable." }, { role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.2,
        max_tokens: 1600,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(25_000),
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
    const analysis = parseAnalysis(decoded);
    if (!analysis) return NextResponse.json({ error: "La réponse du moteur IA est incomplète. Les pistes locales restent disponibles." }, { status: 502 });
    return NextResponse.json({ analysis, model }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Le moteur IA est momentanément indisponible. Les pistes locales restent disponibles." }, { status: 502 });
  }
}
