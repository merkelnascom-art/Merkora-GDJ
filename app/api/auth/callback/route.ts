import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isSameOrigin, setSessionCookies, validateSessionAccessToken } from "@/lib/server/supabase-rest";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Requête non autorisée." }, { status: 403 });

  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Confirmation invalide." }, { status: 400 }); }
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Confirmation invalide." }, { status: 400 });

  const input = body as Record<string, unknown>;
  const accessToken = typeof input.access_token === "string" ? input.access_token : "";
  const refreshToken = typeof input.refresh_token === "string" ? input.refresh_token : "";
  const expiresIn = typeof input.expires_in === "number" && Number.isFinite(input.expires_in) ? input.expires_in : 3600;

  if (!accessToken || accessToken.length > 8192 || !refreshToken || refreshToken.length > 2048 || expiresIn < 0) {
    return NextResponse.json({ error: "Le lien de confirmation est incomplet ou expiré. Demandez un nouveau lien." }, { status: 400 });
  }

  try {
    // Never trust tokens from the URL fragment until Supabase validates the access token.
    if (!(await validateSessionAccessToken(accessToken))) {
      return NextResponse.json({ error: "Le lien de confirmation est expiré ou invalide. Demandez un nouveau lien." }, { status: 401 });
    }
    setSessionCookies(await cookies(), {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: expiresIn,
    });
    return NextResponse.json({ authenticated: true });
  } catch {
    return NextResponse.json({ error: "Le service de compte est momentanément indisponible." }, { status: 502 });
  }
}
