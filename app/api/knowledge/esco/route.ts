import { NextRequest, NextResponse } from "next/server";
import { ESCO_API_LANGUAGE_CODES, normalizeESCOApiSuggestions } from "../../../../src/lib/merkora-core/knowledge/esco-api";

const ALLOWED_LANGUAGES = new Set<string>(ESCO_API_LANGUAGE_CODES);

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("text")?.trim() ?? "";
  const language = request.nextUrl.searchParams.get("language") ?? "fr";
  const conceptType = request.nextUrl.searchParams.get("type") ?? "occupation";

  if (query.length < 2 || query.length > 120) {
    return NextResponse.json({ error: "Le terme doit contenir entre 2 et 120 caractères." }, { status: 400 });
  }
  if (!ALLOWED_LANGUAGES.has(language)) {
    return NextResponse.json({ error: "Langue ESCO non prise en charge." }, { status: 400 });
  }
  if (conceptType !== "occupation" && conceptType !== "skill") {
    return NextResponse.json({ error: "Type ESCO non pris en charge." }, { status: 400 });
  }

  const url = new URL("https://ec.europa.eu/esco/api/suggest2");
  url.searchParams.set("text", query);
  url.searchParams.set("language", language);
  url.searchParams.append("type", conceptType === "occupation" ? "Occupation" : "Skill");
  url.searchParams.set("limit", "8");
  url.searchParams.set("alt", "true");
  url.searchParams.set("viewObsolete", "false");

  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json", "Accept-Language": language },
      next: { revalidate: 3600 },
    });
    if (!response.ok) {
      return NextResponse.json({ error: "Le service ESCO est temporairement indisponible." }, { status: 502 });
    }
    const payload: unknown = await response.json();
    return NextResponse.json({
      source: "ESCO",
      datasetVersion: "version par défaut du service ESCO",
      language,
      results: normalizeESCOApiSuggestions(payload, language, conceptType),
    });
  } catch {
    return NextResponse.json({ error: "Impossible de joindre le service ESCO pour le moment." }, { status: 502 });
  }
}
