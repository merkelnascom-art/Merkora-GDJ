import { NextResponse } from "next/server";
import { isSameOrigin } from "@/lib/server/supabase-rest";
import { buildStudioImagePrompt } from "@/lib/studio-image-prompt";
import type { MockupConfig, MockupFormat, MockupPalette } from "@/lib/mockup-studio";
import type { NeedCategory, Recommendation } from "@/lib/solution-recommendations";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const categories = new Set<NeedCategory>(["business", "digital", "creative", "organization", "personal", "other"]);
const formats = new Set<MockupFormat>(["website", "mobile", "dashboard"]);
const palettes = new Set<MockupPalette>(["violet", "blue", "emerald", "amber"]);

function boundedText(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function parseRecommendations(value: unknown): Recommendation[] | null {
  if (!Array.isArray(value) || value.length > 10) return null;
  const items: Recommendation[] = [];
  for (const raw of value) {
    if (!raw || typeof raw !== "object") return null;
    const item = raw as Record<string, unknown>;
    const title = boundedText(item.title, 120);
    const description = boundedText(item.description, 600);
    const reason = boundedText(item.reason, 400);
    if (!title || !description || !reason) return null;
    items.push({ title, description, reason });
  }
  return items;
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Requête non autorisée." }, { status: 403 });
  }

  // Two explicit feature flags prevent accidental or unexpected billable image requests.
  if (process.env.MERKORA_AI_ENABLED !== "true" || process.env.MERKORA_IMAGE_ENABLED !== "true") {
    return NextResponse.json({
      error: "La génération d’images est désactivée. La maquette interactive reste disponible et aucun appel image n’a été effectué.",
      code: "IMAGE_GENERATION_DISABLED",
    }, { status: 503 });
  }

  const apiKey = process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN;
  if (!apiKey) {
    return NextResponse.json({ error: "Authentification AI Gateway non configurée.", code: "IMAGE_AUTH_NOT_CONFIGURED" }, { status: 503 });
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > 24_000) {
    return NextResponse.json({ error: "Le dossier transmis est trop volumineux." }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Données du concept invalides." }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Données du concept invalides." }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  const rawProject = input.project;
  const rawConfig = input.config;
  if (!rawProject || typeof rawProject !== "object" || !rawConfig || typeof rawConfig !== "object") {
    return NextResponse.json({ error: "Le dossier et les choix visuels sont requis." }, { status: 400 });
  }

  const source = rawProject as Record<string, unknown>;
  const configInput = rawConfig as Record<string, unknown>;
  const title = boundedText(source.title, 120);
  const problem = boundedText(source.problem, 1800);
  const desiredOutcome = boundedText(source.desiredOutcome, 1200);
  const category = categories.has(source.category as NeedCategory) ? source.category as NeedCategory : null;
  const budget = boundedText(source.budget, 100) || "À définir";
  const urgency = boundedText(source.urgency, 30) || "normal";
  const recommendations = parseRecommendations(source.recommendations);

  if (title.length < 3 || problem.length < 15 || desiredOutcome.length < 8 || !category || !recommendations) {
    return NextResponse.json({ error: "Le dossier est incomplet ou contient des champs invalides." }, { status: 400 });
  }

  const format = formats.has(configInput.format as MockupFormat) ? configInput.format as MockupFormat : null;
  const palette = palettes.has(configInput.palette as MockupPalette) ? configInput.palette as MockupPalette : null;
  const enabledModules = Array.isArray(configInput.enabledModules)
    ? configInput.enabledModules.filter((id): id is string => typeof id === "string").slice(0, 20)
    : null;
  const selectedRecommendationIds = configInput.selectedRecommendationIds === undefined
    ? undefined
    : Array.isArray(configInput.selectedRecommendationIds)
      ? configInput.selectedRecommendationIds.filter((id): id is string => typeof id === "string").slice(0, 10)
      : null;

  if (!format || !palette || !enabledModules || selectedRecommendationIds === null) {
    return NextResponse.json({ error: "Les choix du concept sont invalides." }, { status: 400 });
  }

  const project = { title, category, problem, desiredOutcome, budget, urgency, recommendations };
  const config: MockupConfig = {
    format,
    palette,
    enabledModules,
    ...(selectedRecommendationIds === undefined ? {} : { selectedRecommendationIds }),
  };
  const prompt = buildStudioImagePrompt(project, config);
  const model = boundedText(process.env.MERKORA_IMAGE_MODEL, 120) || "google/imagen-4.0-generate-001";

  try {
    const response = await fetch("https://ai-gateway.vercel.sh/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model, prompt, n: 1, response_format: "b64_json" }),
      cache: "no-store",
      signal: AbortSignal.timeout(55_000),
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return NextResponse.json({ error: "AI Gateway a refusé l’authentification. Vérifiez la configuration serveur." }, { status: 502 });
      }
      if (response.status === 402) {
        return NextResponse.json({ error: "Le service image signale un solde ou une limite de budget insuffisante. Aucun nouvel essai automatique n’est lancé." }, { status: 503 });
      }
      if (response.status === 429) {
        return NextResponse.json({ error: "La limite de génération d’images est atteinte. Réessayez plus tard." }, { status: 429 });
      }
      return NextResponse.json({ error: "Le fournisseur n’a pas pu générer l’image. La maquette interactive reste disponible." }, { status: 502 });
    }

    const payload = await response.json() as {
      data?: Array<{ b64_json?: unknown; url?: unknown; revised_prompt?: unknown }>;
    };
    const image = payload.data?.[0];
    if (typeof image?.b64_json === "string" && image.b64_json.length > 100 && image.b64_json.length <= 16_000_000) {
      return NextResponse.json({
        imageDataUrl: `data:image/png;base64,${image.b64_json}`,
        model,
        revisedPrompt: typeof image.revised_prompt === "string" ? image.revised_prompt.slice(0, 500) : null,
        persisted: false,
      }, { headers: { "Cache-Control": "no-store" } });
    }
    if (typeof image?.url === "string") {
      try {
        const url = new URL(image.url);
        if (url.protocol === "https:") {
          return NextResponse.json({
            imageUrl: url.toString(),
            model,
            revisedPrompt: typeof image.revised_prompt === "string" ? image.revised_prompt.slice(0, 500) : null,
            persisted: false,
          }, { headers: { "Cache-Control": "no-store" } });
        }
      } catch {
        // Invalid provider URLs fall through to the generic error below.
      }
    }
    return NextResponse.json({ error: "Le fournisseur a répondu sans image exploitable. Réessayez plus tard." }, { status: 502 });
  } catch {
    return NextResponse.json({ error: "Le service image est momentanément indisponible. La maquette interactive reste utilisable." }, { status: 502 });
  }
}
