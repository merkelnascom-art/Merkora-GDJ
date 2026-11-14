export function getSafeOAuthConsentReturnPath(value: string | null): string | null {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return null;

  try {
    const target = new URL(value, "https://merkora.invalid");
    if (target.origin !== "https://merkora.invalid" || target.pathname !== "/oauth/consent") return null;
    if (!target.searchParams.get("authorization_id")) return null;
    return `${target.pathname}${target.search}`;
  } catch {
    return null;
  }
}
