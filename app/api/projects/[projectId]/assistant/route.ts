import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createMerkoraConversationReply, validateConversationInput } from "@/lib/assistant/merkora-conversation";
import { callUserData, getAccessToken, getCurrentUser, isSameOrigin } from "@/lib/server/supabase-rest";

export const dynamic = "force-dynamic";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function validProjectId(value: unknown): value is string {
  return typeof value === "string" && value.length >= 3 && value.length <= 100 &&
    /^[a-zA-Z0-9_-]+$/.test(value);
}

export async function POST(
  request: Request,
  context: { params: Promise<{ projectId: string }> },
) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Requête non autorisée." }, { status: 403 });
  }

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json({ error: "Le message envoyé est invalide." }, { status: 400 });
  }

  const input = validateConversationInput(rawBody);
  if (!input.ok) {
    const message = input.reason === "message_too_long"
      ? "Votre message dépasse la limite de 5 000 caractères."
      : "Envoyez un message texte et un historique de conversation valide.";
    return NextResponse.json({ error: message, code: input.reason.toUpperCase() }, { status: 400 });
  }

  try {
    const store = await cookies();
    const [user, token] = await Promise.all([getCurrentUser(store), getAccessToken(store)]);
    if (!user || !token) {
      return NextResponse.json({ error: "Connectez-vous pour discuter avec l'assistant MerKora." }, { status: 401 });
    }

    const { projectId } = await context.params;
    if (!validProjectId(projectId)) {
      return NextResponse.json({ error: "Projet introuvable." }, { status: 404 });
    }

    const projectResult = await callUserData(
      `user_projects?select=id,user_id,title,problem,desired_outcome&id=eq.${encodeURIComponent(projectId)}&user_id=eq.${encodeURIComponent(user.id)}&limit=1`,
      "GET",
      token,
    );
    if (!projectResult.ok) {
      return NextResponse.json({ error: "Impossible de vérifier l'accès au projet." }, {
        status: projectResult.status === 401 ? 401 : 502,
      });
    }
    const project = Array.isArray(projectResult.data) ? projectResult.data[0] : null;
    if (!isRecord(project) || project.id !== projectId || project.user_id !== user.id) {
      return NextResponse.json({ error: "Projet introuvable." }, { status: 404 });
    }

    // Provider-free by design: this first assistant version never transmits client data to an external model.
    const projectContext = [
      typeof project.title === "string" ? project.title : "",
      typeof project.problem === "string" ? project.problem : "",
      typeof project.desired_outcome === "string" ? project.desired_outcome : "",
    ].filter(Boolean).join(" ");
    const combinedMessage = projectContext
      ? `${input.value.message}\n\nContexte du dossier (à vérifier avec le client) : ${projectContext.slice(0, 1200)}`
      : input.value.message;
    const reply = createMerkoraConversationReply({
      message: combinedMessage,
      history: input.value.history,
    });

    return NextResponse.json({
      reply,
      project: { id: project.id, title: typeof project.title === "string" ? project.title : null },
      aiProviderCalled: false,
      persistence: "not_saved",
    }, {
      headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
    });
  } catch {
    return NextResponse.json({ error: "L'assistant MerKora est momentanément indisponible." }, {
      status: 502,
      headers: { "Cache-Control": "no-store" },
    });
  }
}
