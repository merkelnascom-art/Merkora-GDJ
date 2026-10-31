import { cookies } from "next/headers";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

type DataResult<T = unknown> = { ok: boolean; status: number; data: T | null; error?: string };

function decodeCookieValue(value: string): string | null {
  try {
    const decoded = value.startsWith("base64-")
      ? atob(value.slice(7).replace(/-/g, "+").replace(/_/g, "/"))
      : decodeURIComponent(value);
    const parsed: unknown = JSON.parse(decoded);
    if (Array.isArray(parsed) && typeof parsed[0] === "string") return parsed[0];
    if (parsed && typeof parsed === "object" && typeof (parsed as { access_token?: unknown }).access_token === "string") {
      return (parsed as { access_token: string }).access_token;
    }
  } catch {
    return null;
  }
  return null;
}

export async function getAccessToken(): Promise<string | null> {
  const store = await cookies();
  const all = store.getAll();
  const base = all.find((cookie) => /^sb-.+-auth-token$/.test(cookie.name));
  if (base) return decodeCookieValue(base.value);

  const chunks = all
    .filter((cookie) => /^sb-.+-auth-token\.\d+$/.test(cookie.name))
    .sort((a, b) => Number(a.name.split(".").at(-1)) - Number(b.name.split(".").at(-1)));
  if (!chunks.length) return null;
  return decodeCookieValue(chunks.map((cookie) => cookie.value).join(""));
}

export async function getCurrentUser() {
  const accessToken = await getAccessToken();
  if (!accessToken || !SUPABASE_URL || !SUPABASE_KEY) return null;
  try {
    const response = await fetch(`${SUPABASE_URL.replace(/\/$/, "")}/auth/v1/user`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });
    if (!response.ok) return null;
    const user = await response.json();
    if (!user || typeof user.id !== "string" || typeof user.email !== "string") return null;
    return { id: user.id as string, email: user.email as string, fullName: user.user_metadata?.full_name ?? "" };
  } catch {
    return null;
  }
}

export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

export async function callUserData<T = unknown>(
  table: string,
  method: "GET" | "POST" | "PATCH" | "DELETE",
  filters: Record<string, string> = {},
  payload?: unknown,
): Promise<DataResult<T>> {
  const accessToken = await getAccessToken();
  if (!accessToken || !SUPABASE_URL || !SUPABASE_KEY) {
    return { ok: false, status: 401, data: null, error: "Session Supabase absente." };
  }
  const query = new URLSearchParams(filters);
  const url = `${SUPABASE_URL.replace(/\/$/, "")}/rest/v1/${encodeURIComponent(table)}${query.size ? `?${query}` : ""}`;
  try {
    const response = await fetch(url, {
      method,
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Prefer: method === "POST" ? "return=representation" : "return=representation",
      },
      ...(payload === undefined ? {} : { body: JSON.stringify(payload) }),
      cache: "no-store",
    });
    const text = await response.text();
    let data: unknown = null;
    if (text) {
      try { data = JSON.parse(text); } catch { data = null; }
    }
    return response.ok
      ? { ok: true, status: response.status, data: data as T }
      : { ok: false, status: response.status, data: data as T, error: "Requête Supabase refusée." };
  } catch {
    return { ok: false, status: 503, data: null, error: "Supabase est temporairement indisponible." };
  }
}
