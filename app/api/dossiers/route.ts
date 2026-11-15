import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

type DossierInput = { id?: unknown; title?: unknown; payload?: unknown; version?: unknown; updatedAt?: unknown };

async function authenticatedClient() {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return { response: NextResponse.json({ error: "Cloud sync is not configured." }, { status: 503 }) };
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return { response: NextResponse.json({ error: "Authentication required." }, { status: 401 }) };
  return { supabase, user };
}

export async function GET() {
  const auth = await authenticatedClient();
  if ("response" in auth) return auth.response;
  const { data, error } = await auth.supabase
    .from("user_project_dossiers")
    .select("id,title,payload,version,updated_at")
    .eq("user_id", auth.user.id)
    .order("updated_at", { ascending: false });
  if (error) return NextResponse.json({ error: "Unable to load project dossiers." }, { status: 500 });
  return NextResponse.json({ dossiers: data ?? [] });
}

export async function POST(request: NextRequest) {
  const auth = await authenticatedClient();
  if ("response" in auth) return auth.response;
  let body: DossierInput;
  try { body = await request.json() as DossierInput; }
  catch { return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 }); }
  if (typeof body.id !== "string" || !body.id.trim() || typeof body.title !== "string" || !body.title.trim() || !("payload" in body)) {
    return NextResponse.json({ error: "A dossier id, title and payload are required." }, { status: 400 });
  }
  const { data, error } = await auth.supabase.from("user_project_dossiers").insert({
    id: body.id,
    user_id: auth.user.id,
    title: body.title.slice(0, 160),
    payload: body.payload,
    version: typeof body.version === "number" && Number.isInteger(body.version) && body.version > 0 ? body.version : 1,
  }).select("id,title,payload,version,updated_at").single();
  if (error?.code === "23505") return NextResponse.json({ error: "This dossier already exists in the cloud. Reload it before updating." }, { status: 409 });
  if (error || !data) return NextResponse.json({ error: "Unable to save this dossier." }, { status: 500 });
  return NextResponse.json({ dossier: data }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const auth = await authenticatedClient();
  if ("response" in auth) return auth.response;
  let body: DossierInput & { expectedVersion?: unknown };
  try { body = await request.json() as DossierInput & { expectedVersion?: unknown }; }
  catch { return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 }); }
  if (typeof body.id !== "string" || !body.id || typeof body.title !== "string" || !("payload" in body) || typeof body.expectedVersion !== "number" || !Number.isInteger(body.expectedVersion)) {
    return NextResponse.json({ error: "Dossier id, title, payload and expectedVersion are required." }, { status: 400 });
  }
  const { data, error } = await auth.supabase.from("user_project_dossiers").update({
    title: body.title.slice(0, 160),
    payload: body.payload,
    version: body.expectedVersion + 1,
    updated_at: new Date().toISOString(),
  }).eq("id", body.id).eq("user_id", auth.user.id).eq("version", body.expectedVersion)
    .select("id,title,payload,version,updated_at").maybeSingle();
  if (error) return NextResponse.json({ error: "Unable to update this dossier." }, { status: 500 });
  if (!data) return NextResponse.json({ error: "This dossier changed elsewhere. Reload it before retrying." }, { status: 409 });
  return NextResponse.json({ dossier: data });
}
