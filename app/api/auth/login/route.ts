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
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 1 || password.length > 128) {
    return NextResponse.json({ error: "E-mail ou mot de passe invalide." }, { status: 400 });
  }

  try {
    const result = await callAuth("token?grant_type=password", { email, password });
    if (!result.ok) return NextResponse.json({ error: "Connexion impossible. Vérifiez vos identifiants et la confirmation de votre adresse e-mail." }, { status: result.status === 400 || result.status === 401 ? 401 : 502 });
    const session = result.data as { access_token?: string; refresh_token?: string; expires_in?: number };
    if (!session.access_token || !session.refresh_token) return NextResponse.json({ error: "Le service n’a pas renvoyé de session valide." }, { status: 502 });
    setSessionCookies(await cookies(), session as { access_token: string; refresh_token: string; expires_in?: number });
    return NextResponse.json({ authenticated: true });
  } catch (error) {
    const message = error instanceof Error && error.message === "SUPABASE_NOT_CONFIGURED" ? "La connexion au service de compte n’est pas encore configurée." : "Le service de compte est momentanément indisponible.";
    return NextResponse.json({ error: message }, { status: error instanceof Error && error.message === "SUPABASE_NOT_CONFIGURED" ? 503 : 502 });
  }
}
