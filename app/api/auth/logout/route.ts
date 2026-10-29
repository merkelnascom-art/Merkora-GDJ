import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { clearSessionCookies, getAccessToken, isSameOrigin } from "@/lib/server/supabase-rest";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Requête non autorisée." }, { status: 403 });
  const store = await cookies();
  try {
    const token = await getAccessToken(store);
    if (token) {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
      const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
      if (url && key) {
        await fetch(`${url}/auth/v1/logout`, { method: "POST", headers: { apikey: key, Authorization: `Bearer ${token}` }, cache: "no-store" }).catch(() => undefined);
      }
    }
  } finally {
    clearSessionCookies(store);
  }
  return NextResponse.json({ authenticated: false });
}
