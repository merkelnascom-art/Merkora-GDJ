import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/server/supabase-rest";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser(await cookies());
    return NextResponse.json({ configured: true, authenticated: Boolean(user), user });
  } catch (error) {
    if (error instanceof Error && error.message === "SUPABASE_NOT_CONFIGURED") {
      return NextResponse.json({ configured: false, authenticated: false, user: null });
    }
    return NextResponse.json({ configured: true, authenticated: false, user: null, error: "Session indisponible." }, { status: 502 });
  }
}
