import "server-only";
import { cookies } from "next/headers";

const ACCESS_COOKIE = "merkora_access";
const REFRESH_COOKIE = "merkora_refresh";
const REFRESH_WINDOW_SECONDS = 60;

type AuthSession = {
  access_token: string;
  refresh_token: string;
  expires_in?: number;
  token_type?: string;
  user?: { id: string; email?: string; user_metadata?: Record<string, unknown> };
};

type CookieStore = Awaited<ReturnType<typeof cookies>>;

export type SafeAuthUser = { id: string; email: string | null; fullName: string | null };

function config() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("SUPABASE_NOT_CONFIGURED");
  return { url, key };
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

export function getAuthErrorMessage(payload: unknown, fallback: string): string {
  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    const message = record.msg ?? record.message ?? record.error_description ?? record.error;
    if (typeof message === "string" && message.length < 240) return message;
  }
  return fallback;
}

export async function callAuth(path: string, body: Record<string, unknown>): Promise<{ ok: boolean; status: number; data: unknown }> {
  const { url, key } = config();
  const response = await fetch(`${url}/auth/v1/${path}`, {
    method: "POST",
    headers: { apikey: key, "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const data: unknown = await response.json().catch(() => ({}));
  return { ok: response.ok, status: response.status, data };
}

export function setSessionCookies(store: CookieStore, session: AuthSession) {
  const maxAge = Math.max(60, Math.min(session.expires_in ?? 3600, 60 * 60 * 24));
  const options = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/", maxAge };
  store.set(ACCESS_COOKIE, session.access_token, options);
  // Refresh tokens are rotated by Supabase; allow the server to manage their lifetime.
  store.set(REFRESH_COOKIE, session.refresh_token, { ...options, maxAge: 60 * 60 * 24 * 30 });
}

export function clearSessionCookies(store: CookieStore) {
  const options = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/", maxAge: 0 };
  store.set(ACCESS_COOKIE, "", options);
  store.set(REFRESH_COOKIE, "", options);
}

function tokenExpiresSoon(token: string): boolean {
  try {
    const payload = token.split(".")[1];
    if (!payload) return true;
    const claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { exp?: number };
    return !claims.exp || claims.exp <= Math.floor(Date.now() / 1000) + REFRESH_WINDOW_SECONDS;
  } catch {
    return true;
  }
}

export async function getAccessToken(store: CookieStore): Promise<string | null> {
  const accessToken = store.get(ACCESS_COOKIE)?.value;
  const refreshToken = store.get(REFRESH_COOKIE)?.value;
  if (!accessToken && !refreshToken) return null;
  if (accessToken && !tokenExpiresSoon(accessToken)) return accessToken;
  if (!refreshToken) {
    clearSessionCookies(store);
    return null;
  }

  try {
    const refreshed = await callAuth("token?grant_type=refresh_token", { refresh_token: refreshToken });
    if (!refreshed.ok || !refreshed.data || typeof refreshed.data !== "object") {
      clearSessionCookies(store);
      return null;
    }
    const session = refreshed.data as AuthSession;
    if (!session.access_token || !session.refresh_token) {
      clearSessionCookies(store);
      return null;
    }
    setSessionCookies(store, session);
    return session.access_token;
  } catch {
    // A temporary network error should not destroy a valid refresh token.
    return accessToken ?? null;
  }
}

export async function getCurrentUser(store: CookieStore): Promise<SafeAuthUser | null> {
  const accessToken = await getAccessToken(store);
  if (!accessToken) return null;
  try {
    const { url, key } = config();
    const response = await fetch(`${url}/auth/v1/user`, {
      headers: { apikey: key, Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });
    if (!response.ok) return null;
    const user = await response.json() as { id?: string; email?: string; user_metadata?: Record<string, unknown> };
    if (!user.id) return null;
    const fullName = user.user_metadata?.full_name;
    return { id: user.id, email: user.email ?? null, fullName: typeof fullName === "string" ? fullName : null };
  } catch {
    return null;
  }
}

export async function callUserData(path: string, method: "GET" | "POST" | "PATCH" | "DELETE", accessToken: string, body?: unknown, prefer?: string) {
  const { url, key } = config();
  const headers: Record<string, string> = {
    apikey: key,
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };
  if (prefer) headers.Prefer = prefer;
  const response = await fetch(`${url}/rest/v1/${path}`, {
    method,
    headers,
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    cache: "no-store",
  });
  const data: unknown = response.status === 204 ? null : await response.json().catch(() => null);
  return { ok: response.ok, status: response.status, data };
}

export async function validateSessionAccessToken(accessToken: string): Promise<boolean> {
  const { url, key } = config();
  const response = await fetch(`${url}/auth/v1/user`, {
    headers: { apikey: key, Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  return response.ok;
}


export async function uploadUserStorageObject(
  bucket: string,
  objectPath: string,
  content: string,
  accessToken: string,
): Promise<{ ok: boolean; status: number; data: unknown }> {
  if (!/^[a-z0-9-]{1,100}$/.test(bucket) || !accessToken.trim() ||
    typeof content !== "string" || Buffer.byteLength(content, "utf8") > 1_000_000) {
    return { ok: false, status: 400, data: null };
  }
  const segments = objectPath.split("/");
  if (!objectPath || objectPath.length > 500 ||
    segments.some((segment) => !segment || segment === "." || segment === ".." || !/^[a-zA-Z0-9._-]+$/.test(segment))) {
    return { ok: false, status: 400, data: null };
  }
  const { url, key } = config();
  const encodedPath = segments.map(encodeURIComponent).join("/");
  const response = await fetch(`${url}/storage/v1/object/${encodeURIComponent(bucket)}/${encodedPath}`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "x-upsert": "false",
    },
    body: content,
    cache: "no-store",
  });
  const data: unknown = await response.json().catch(() => null);
  return { ok: response.ok, status: response.status, data };
}
