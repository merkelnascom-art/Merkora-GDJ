import { createBrowserClient } from "@supabase/ssr";

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

/**
 * Returns null until the public Supabase URL and publishable key are configured.
 * Never place a Supabase secret/service-role key in NEXT_PUBLIC_* variables.
 */
export function getSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) return null;

  if (!browserClient) {
    browserClient = createBrowserClient(url, key);
  }

  return browserClient;
}
