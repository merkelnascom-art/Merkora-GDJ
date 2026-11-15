import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (code) {
    const supabase = await getSupabaseServerClient();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) return NextResponse.redirect(new URL("/account", request.url));
    }
  }
  return NextResponse.redirect(new URL("/auth?status=confirmation-error", request.url));
}
