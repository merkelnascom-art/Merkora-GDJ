import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminAccess } from "@/lib/server/admin-access";
import { callUserData, getAccessToken, isSameOrigin } from "@/lib/server/supabase-rest";
import { calculateQuoteTotals, validateQuoteDraft, type QuoteDraft, type QuoteLine } from "@/lib/quotes";

export const dynamic = "force-dynamic";
const adminError = (status: number) => NextResponse.json({ error: "Accès administrateur requis." }, { status });

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}
function cleanText(value: unknown, max: number): value is string {
  return typeof value === "string" && value.length <= max;
}

export async function GET() {
  const access = await getAdminAccess();
  if (!access.ok) return adminError(access.reason === "unauthenticated" ? 401 : 403);
  try {
    const token = await getAccessToken(await cookies());
    if (!token) return NextResponse.json({ error: "Session expirée. Reconnectez-vous." }, { status: 401 });
    const [requests, groups, versions, decisions] = await Promise.all([
      callUserData("client_requests?select=id,user_id,user_email,project_id,project_title,payload,created_at&order=created_at.desc&limit=100", "GET", token),
      callUserData("client_quotes?select=id,request_id,client_user_id,created_at&order=created_at.desc&limit=100", "GET", token),
      callUserData("client_quote_versions?select=id,quote_id,client_user_id,version_number,snapshot,currency,total_amount,valid_until,published_at,created_at&order=created_at.desc&limit=200", "GET", token),
      callUserData("client_quote_decisions?select=id,quote_version_id,client_user_id,decision,message,created_at&order=created_at.desc&limit=200", "GET", token),
    ]);
    if (![requests, groups, versions, decisions].every(r => r.ok)) {
      return NextResponse.json({ error: "Impossible de charger les devis. Vérifiez les politiques d’accès Supabase." }, { status: 502 });
    }
    return NextResponse.json({
      requests: Array.isArray(requests.data) ? requests.data : [],
      quotes: Array.isArray(groups.data) ? groups.data : [],
      versions: Array.isArray(versions.data) ? versions.data : [],
      decisions: Array.isArray(decisions.data) ? decisions.data : [],
    });
  } catch {
    return NextResponse.json({ error: "Le service de devis est momentanément indisponible." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Requête non autorisée." }, { status: 403 });
  const access = await getAdminAccess();
  if (!access.ok) return adminError(access.reason === "unauthenticated" ? 401 : 403);
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Données invalides." }, { status: 400 }); }
  if (!isRecord(body) || typeof body.requestId !== "string" || !/^[0-9a-f-]{36}$/i.test(body.requestId) ||
      typeof body.action !== "string" || !["save_draft", "publish"].includes(body.action) || !isRecord(body.quote)) {
    return NextResponse.json({ error: "Le dossier ou l’action de devis est invalide." }, { status: 400 });
  }

  const input = body.quote;
  if (!cleanText(input.title, 160) || !input.title.trim() ||
      !cleanText(input.description, 2000) || !input.description.trim() ||
      !cleanText(input.scope, 5000) || !cleanText(input.exclusions, 3000) ||
      !cleanText(input.assumptionsText, 2000) || !cleanText(input.paymentTerms, 1500) ||
      !cleanText(input.validUntil, 10) || !/^\d{4}-\d{2}-\d{2}$/.test(input.validUntil) ||
      !Number.isSafeInteger(input.amount) || Number(input.amount) < 0 ||
      !Number.isSafeInteger(input.recurringAmount ?? 0) || Number(input.recurringAmount ?? 0) < 0 ||
      !Number.isSafeInteger(input.discount ?? 0) || Number(input.discount ?? 0) < 0 ||
      (input.taxRateBasisPoints !== null && input.taxRateBasisPoints !== undefined &&
        (!Number.isInteger(input.taxRateBasisPoints) || Number(input.taxRateBasisPoints) < 0 || Number(input.taxRateBasisPoints) > 10000)) ||
      typeof input.taxConfirmed !== "boolean") {
    return NextResponse.json({ error: "Complétez les champs du devis avec des valeurs valides." }, { status: 400 });
  }

  const lines: QuoteLine[] = [{ id: "service-main", description: input.description.trim(), quantity: 1, unit: "forfait", unitPriceMinor: Number(input.amount) }];
  const recurringLines: QuoteLine[] = Number(input.recurringAmount ?? 0) > 0
    ? [{ id: "service-recurring", description: "Abonnement / prestation récurrente", quantity: 1, unit: "période", unitPriceMinor: Number(input.recurringAmount) }]
    : [];
  const assumptions = input.assumptionsText.split("\n").map((s: string) => s.trim()).filter(Boolean);
  const taxRateBasisPoints = input.taxRateBasisPoints === null || input.taxRateBasisPoints === undefined || input.taxRateBasisPoints === ""
    ? null : Number(input.taxRateBasisPoints);
  const draft: QuoteDraft = {
    id: "pending-quote", requestId: body.requestId, version: 1, currency: "XOF", status: "draft",
    lines, recurringLines, discountMinor: Number(input.discount ?? 0),
    taxRateBasisPoints, taxConfirmed: input.taxConfirmed,
    validityEndsAt: new Date(input.validUntil + "T23:59:59.000Z").toISOString(),
    scope: input.scope, exclusions: input.exclusions, assumptions, paymentTerms: input.paymentTerms,
  };
  if (body.action === "publish") {
    const errors = validateQuoteDraft(draft);
    if (errors.length) return NextResponse.json({ error: errors.join(" ") }, { status: 400 });
  }

  try {
    const token = await getAccessToken(await cookies());
    if (!token) return NextResponse.json({ error: "Session expirée. Reconnectez-vous." }, { status: 401 });

    const requestResult = await callUserData(
      `client_requests?select=id,user_id,user_email,project_id,project_title&id=eq.${encodeURIComponent(body.requestId)}`,
      "GET", token,
    );
    if (!requestResult.ok || !Array.isArray(requestResult.data) || !requestResult.data.length) {
      return NextResponse.json({ error: "Dossier client introuvable ou inaccessible." }, { status: 404 });
    }
    const clientRequest = requestResult.data[0] as { id: string; user_id: string; user_email: string; project_id: string; project_title: string };

    const existingGroup = await callUserData(
      `client_quotes?select=id&request_id=eq.${encodeURIComponent(body.requestId)}&limit=1`, "GET", token,
    );
    if (!existingGroup.ok) return NextResponse.json({ error: "Impossible de vérifier le devis existant." }, { status: 502 });
    let quoteId: string;
    if (Array.isArray(existingGroup.data) && existingGroup.data.length) {
      quoteId = String((existingGroup.data[0] as { id: string }).id);
    } else {
      const createdGroup = await callUserData("client_quotes", "POST", token, {
        request_id: clientRequest.id, client_user_id: clientRequest.user_id, created_by: access.user.id,
      }, "return=representation");
      if (!createdGroup.ok || !Array.isArray(createdGroup.data) || !createdGroup.data.length) {
        return NextResponse.json({ error: "Impossible de créer le dossier de devis. Réessayez après actualisation." }, { status: 502 });
      }
      quoteId = String((createdGroup.data[0] as { id: string }).id);
    }

    const latest = await callUserData(
      `client_quote_versions?select=version_number&quote_id=eq.${encodeURIComponent(quoteId)}&order=version_number.desc&limit=1`, "GET", token,
    );
    if (!latest.ok) return NextResponse.json({ error: "Impossible de déterminer la prochaine version du devis." }, { status: 502 });
    const previousVersion = Array.isArray(latest.data) && latest.data.length ? Number((latest.data[0] as { version_number: number }).version_number) : 0;
    const versionNumber = previousVersion + 1;
    const totals = calculateQuoteTotals(draft);
    const snapshot = {
      title: input.title.trim(), requestId: clientRequest.id, projectId: clientRequest.project_id,
      projectTitle: clientRequest.project_title, clientEmail: clientRequest.user_email,
      version: versionNumber, currency: "XOF", lines, recurringLines,
      subtotal: totals.oneTimeSubtotalMinor, recurringSubtotal: totals.recurringSubtotalMinor,
      discount: totals.discountMinor, taxRateBasisPoints, taxConfirmed: input.taxConfirmed,
      tax: totals.taxMinor, total: totals.totalMinor, scope: input.scope.trim(),
      exclusions: input.exclusions.trim(), assumptions, paymentTerms: input.paymentTerms.trim(),
      validUntil: input.validUntil, createdByEmail: access.user.email,
      publicationState: body.action === "publish" ? "published" : "draft",
    };
    const createdVersion = await callUserData("client_quote_versions", "POST", token, {
      quote_id: quoteId, client_user_id: clientRequest.user_id, version_number: versionNumber,
      snapshot, currency: "XOF", total_amount: totals.totalMinor, valid_until: input.validUntil,
      published_at: body.action === "publish" ? new Date().toISOString() : null, created_by: access.user.id,
    }, "return=representation");
    if (!createdVersion.ok) {
      const databaseError = isRecord(createdVersion.data) ? createdVersion.data : {};
      const databaseMessage = typeof databaseError.message === "string"
        ? databaseError.message.slice(0, 240)
        : "La base de données n’a pas précisé la cause.";
      const databaseCode = typeof databaseError.code === "string"
        ? databaseError.code.slice(0, 32)
        : null;
      return NextResponse.json({
        error: "La version du devis n’a pas été enregistrée. Aucune version existante n’a été modifiée.",
        diagnostic: [databaseCode, databaseMessage].filter(Boolean).join(" · "),
      }, { status: 502 });
    }
    return NextResponse.json({
      saved: true, published: body.action === "publish", version: versionNumber,
      message: body.action === "publish" ? "Version publiée dans l’espace client." : "Brouillon enregistré en interne.",
    });
  } catch {
    return NextResponse.json({ error: "Le service de devis est momentanément indisponible." }, { status: 503 });
  }
}
