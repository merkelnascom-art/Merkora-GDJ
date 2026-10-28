import { NextResponse } from "next/server";
import { callAuth, getAuthErrorMessage, isSameOrigin, setSessionCookies } from "@/lib/server/supabase-rest";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Requête non autorisée." }, { status: 403 });
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Formulaire invalide." }, { status: 400 }); }
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Formulaire invalide." }, { status: 400 });
  const input = body as Record<string, unknown>;
  const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  const password = typeof input.password === "string" ? input.password : "";
  const fullName = typeof input.fullName === "string" ? input.fullName.trim().slice(0, 100) : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "Adresse e-mail invalide." }, { status: 400 });
  if (password.length < 10 || password.length > 128) return NextResponse.json({ error: "Le mot de passe doit contenir entre 10 et 128 caractères." }, { status: 400 });

  try {
    const result = await callAuth("signup", { email, password, data: fullName ? { full_name: fullName } : {} });
    if (!result.ok) return NextResponse.json({ error: getAuthErrorMessage(result.data, "Impossible de créer ce compte pour le moment.") }, { status: result.status >= 400 && result.status < 500 ? result.status : 502 });
    const data = result.data as Record<string, unknown>;
    const session = (data.session && typeof data.session === "object" ? data.session : data) as { access_token?: string; refresh_token?: string; expires_in?: number };
    if (session.access_token && session.refresh_token) {
      setSessionCookies(await cookies(), session as { access_token: string; refresh_token: string; expires_in?: number });
      return NextResponse.json({ authenticated: true, confirmationRequired: false });
    }
    return NextResponse.json({ authenticated: false, confirmationRequired: true, message: "Compte créé. Consultez votre boîte e-mail pour confirmer l’adresse avant de vous connecter." });
  } catch (error) {
    const message = error instanceof Error && error.message === "SUPABASE_NOT_CONFIGURED" ? "La connexion au service de compte n’est pas encore configurée." : "Le service de compte est momentanément indisponible.";
    return NextResponse.json({ error: message }, { status: error instanceof Error && error.message === "SUPABASE_NOT_CONFIGURED" ? 503 : 502 });
  }
}
