import { NextResponse } from "next/server";
import { resolveAiModel, type AiTask } from "@/lib/ai-model-routing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_MESSAGES = 10;
const MAX_MESSAGE_CHARS = 4_000;
const MAX_TOTAL_CHARS = 12_000;
const ALLOWED_TASKS = new Set<AiTask>(["conversation", "analysis", "architecture", "code_review"]);

type ChatMessage = { role: "user" | "assistant"; content: string };

function isChatMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (item.role === "user" || item.role === "assistant")
    && typeof item.content === "string"
    && item.content.trim().length > 0
    && item.content.length <= MAX_MESSAGE_CHARS;
}

function systemInstruction(task: AiTask): string {
  const common = [
    "Tu es l'assistant de MerKora GDJ, une plateforme qui transforme les besoins réels des clients en solutions adaptées.",
    "Réponds en français, de façon claire, utile et honnête. Pose des questions lorsqu'une information essentielle manque.",
    "Ne prétends jamais qu'un code a été exécuté, qu'un design a été créé, qu'un prix a été validé ou qu'un déploiement a réussi si ce n'est pas vérifié.",
    "Ne promets aucune action externe non réalisée. Une validation humaine est nécessaire avant toute dépense, suppression, fusion ou mise en production.",
  ];
  const byTask: Record<AiTask, string> = {
    conversation: "Aide le client à exprimer son besoin, son contexte, ses contraintes et le résultat attendu. Une question ciblée à la fois si nécessaire.",
    analysis: "Analyse le problème, distingue les faits des hypothèses, identifie les personnes concernées, les risques, les contraintes et les critères de réussite.",
    architecture: "Propose une architecture progressive et sécurisée. Justifie les choix et signale les dépendances, coûts potentiels et décisions encore ouvertes.",
    code_review: "Fais une revue critique: sécurité, erreurs, données, tests et maintenabilité. N'affirme pas que les tests passent sans résultat d'exécution.",
  };
  return [...common, byTask[task]].join("\n");
}

export async function POST(request: Request) {
  if (process.env.MERKORA_AI_ENABLED !== "true") {
    return NextResponse.json(
      { error: "L'assistance IA est désactivée. Elle doit être activée explicitement par l'administrateur." },
      { status: 503 },
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const gatewayKey = process.env.AI_GATEWAY_API_KEY;
  if (!supabaseUrl || !supabaseKey || !gatewayKey) {
    return NextResponse.json(
      { error: "Configuration serveur incomplète pour l'assistance IA." },
      { status: 503 },
    );
  }

  const authorization = request.headers.get("authorization");
  const accessToken = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!accessToken) {
    return NextResponse.json({ error: "Authentification requise." }, { status: 401 });
  }

  let authResponse: Response;
  try {
    authResponse = await fetch(`${supabaseUrl.replace(/\/$/, "")}/auth/v1/user`, {
      headers: { apikey: supabaseKey, Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });
  } catch {
    return NextResponse.json({ error: "Service d'authentification temporairement indisponible." }, { status: 503 });
  }
  if (!authResponse.ok) {
    return NextResponse.json({ error: "Session invalide ou expirée." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps JSON invalide." }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  const task = input.task;
  const messages = input.messages;
  if (typeof task !== "string" || !ALLOWED_TASKS.has(task as AiTask)) {
    return NextResponse.json({ error: "Type de tâche IA non pris en charge." }, { status: 400 });
  }
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MESSAGES || !messages.every(isChatMessage)) {
    return NextResponse.json({ error: "Les messages sont invalides ou dépassent les limites autorisées." }, { status: 400 });
  }
  const typedMessages = messages as ChatMessage[];
  if (typedMessages.reduce((sum, message) => sum + message.content.length, 0) > MAX_TOTAL_CHARS) {
    return NextResponse.json({ error: "La conversation est trop longue. Réduisez le texte envoyé." }, { status: 413 });
  }

  const model = resolveAiModel(task as AiTask, process.env);
  if (!model) {
    return NextResponse.json({ error: "Aucun modèle valide n'est configuré pour cette tâche." }, { status: 503 });
  }

  let gatewayResponse: Response;
  try {
    gatewayResponse = await fetch("https://ai-gateway.vercel.sh/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${gatewayKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemInstruction(task as AiTask) },
          ...typedMessages,
        ],
        max_tokens: 1_200,
      }),
      signal: AbortSignal.timeout(45_000),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json({ error: "Le service IA ne répond pas pour le moment." }, { status: 502 });
  }

  if (!gatewayResponse.ok) {
    const status = gatewayResponse.status === 429 ? 429 : gatewayResponse.status >= 500 ? 502 : 503;
    return NextResponse.json(
      { error: status === 429 ? "Limite de requêtes IA atteinte. Réessayez plus tard." : "Le service IA n'a pas pu traiter la demande." },
      { status },
    );
  }

  let result: unknown;
  try {
    result = await gatewayResponse.json();
  } catch {
    return NextResponse.json({ error: "Réponse IA illisible." }, { status: 502 });
  }
  const choices = (result as { choices?: Array<{ message?: { content?: unknown } }> })?.choices;
  const answer = choices?.[0]?.message?.content;
  if (typeof answer !== "string" || !answer.trim()) {
    return NextResponse.json({ error: "Le service IA n'a pas retourné de réponse exploitable." }, { status: 502 });
  }

  return NextResponse.json({ answer, model });
}
