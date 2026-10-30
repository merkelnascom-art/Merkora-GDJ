import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminAccess } from "@/lib/server/admin-access";
import { callUserData, getAccessToken, isSameOrigin } from "@/lib/server/supabase-rest";

export const dynamic = "force-dynamic";
const fail = (status: number, error: string) => NextResponse.json({ error }, { status });
const uuid = (value: unknown): value is string => typeof value === "string" && /^[0-9a-f-]{36}$/i.test(value);

type Row = Record<string, unknown>;

export async function GET() {
  const access = await getAdminAccess();
  if (!access.ok) return fail(access.reason === "unauthenticated" ? 401 : 403, "Accès administrateur requis.");
  try {
    const token = await getAccessToken(await cookies());
    if (!token) return fail(401, "Session expirée. Reconnectez-vous.");
    const result = await callUserData(
      "client_project_launches?select=id,request_id,client_user_id,quote_version_id,invoice_id,launched_by,required_amount,invoice_total_at_launch,confirmed_amount_at_launch,launch_message,launched_at&order=launched_at.desc&limit=200",
      "GET", token,
    );
    if (!result.ok) return fail(502, "Impossible de charger l’historique des lancements. Vérifiez l’exposition Data API et les règles Supabase.");
    return NextResponse.json({ launches: Array.isArray(result.data) ? result.data : [] });
  } catch {
    return fail(503, "Le service de lancement est momentanément indisponible.");
  }
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return fail(403, "Requête non autorisée.");
  const access = await getAdminAccess();
  if (!access.ok) return fail(access.reason === "unauthenticated" ? 401 : 403, "Accès administrateur requis.");

  let body: unknown;
  try { body = await request.json(); } catch { return fail(400, "Données invalides."); }
  if (!body || typeof body !== "object" || Array.isArray(body)) return fail(400, "Données invalides.");
  const value = body as Row;
  if (!uuid(value.invoiceId) || !Number.isSafeInteger(value.requiredAmount) ||
      Number(value.requiredAmount) <= 0 ||
      typeof value.message !== "string" || !value.message.trim() || value.message.length > 1200) {
    return fail(400, "Facture, montant requis ou message de lancement invalide.");
  }

  try {
    const token = await getAccessToken(await cookies());
    if (!token) return fail(401, "Session expirée. Reconnectez-vous.");

    const invoiceResult = await callUserData(
      `client_invoices?select=id,quote_version_id,client_user_id,total_amount,description&id=eq.${encodeURIComponent(String(value.invoiceId))}&limit=1`,
      "GET", token,
    );
    if (!invoiceResult.ok || !Array.isArray(invoiceResult.data) || !invoiceResult.data.length) return fail(404, "Facture introuvable.");
    const invoice = invoiceResult.data[0] as { id: string; quote_version_id: string; client_user_id: string; total_amount: number; description: string };
    const invoiceTotal = Number(invoice.total_amount);
    const requiredAmount = Number(value.requiredAmount);
    if (!Number.isSafeInteger(invoiceTotal) || invoiceTotal <= 0 || requiredAmount > invoiceTotal) {
      return fail(400, "Le montant requis doit être positif et ne peut pas dépasser le total de la facture.");
    }

    const versionResult = await callUserData(
      `client_quote_versions?select=id,quote_id,client_user_id,published_at&id=eq.${encodeURIComponent(invoice.quote_version_id)}&limit=1`,
      "GET", token,
    );
    if (!versionResult.ok || !Array.isArray(versionResult.data) || !versionResult.data.length) return fail(409, "Version du devis introuvable.");
    const version = versionResult.data[0] as { id: string; quote_id: string; client_user_id: string; published_at: string | null };
    if (version.client_user_id !== invoice.client_user_id || !version.published_at) return fail(409, "La facture ne correspond pas à une version publiée du devis.");

    const [decisionResult, quoteResult, declarationResult, reviewResult] = await Promise.all([
      callUserData(
        `client_quote_decisions?select=id,decision&quote_version_id=eq.${encodeURIComponent(version.id)}&client_user_id=eq.${encodeURIComponent(invoice.client_user_id)}`,
        "GET", token,
      ),
      callUserData(
        `client_quotes?select=id,request_id,client_user_id&id=eq.${encodeURIComponent(version.quote_id)}&limit=1`,
        "GET", token,
      ),
      callUserData(
        `client_payment_declarations?select=id,amount,client_user_id,invoice_id&invoice_id=eq.${encodeURIComponent(invoice.id)}&client_user_id=eq.${encodeURIComponent(invoice.client_user_id)}`,
        "GET", token,
      ),
      callUserData(
        `client_payment_reviews?select=payment_declaration_id,status&invoice_id=eq.${encodeURIComponent(invoice.id)}&client_user_id=eq.${encodeURIComponent(invoice.client_user_id)}&status=eq.confirmed`,
        "GET", token,
      ),
    ]);
    if (![decisionResult, quoteResult, declarationResult, reviewResult].every(r => r.ok)) return fail(502, "Impossible de vérifier l’accord, le dossier et les paiements confirmés.");
    if (!Array.isArray(decisionResult.data) || !decisionResult.data.some((d: { decision?: string }) => d.decision === "accepted")) {
      return fail(409, "Le client doit avoir accepté précisément cette version du devis avant le lancement.");
    }
    if (!Array.isArray(quoteResult.data) || !quoteResult.data.length) return fail(404, "Dossier de devis introuvable.");
    const quote = quoteResult.data[0] as { id: string; request_id: string; client_user_id: string };
    if (quote.client_user_id !== invoice.client_user_id) return fail(409, "Le devis et la facture ne correspondent pas au même client.");

    const declarations = Array.isArray(declarationResult.data) ? declarationResult.data as Array<{ id: string; amount: number }> : [];
    const confirmedIds = new Set(
      (Array.isArray(reviewResult.data) ? reviewResult.data as Array<{ payment_declaration_id: string }> : [])
        .map(r => r.payment_declaration_id),
    );
    const confirmedAmount = declarations
      .filter(d => confirmedIds.has(d.id))
      .reduce((sum, d) => sum + Number(d.amount), 0);
    if (confirmedAmount < requiredAmount) {
      return fail(409, `Paiement confirmé insuffisant : ${confirmedAmount.toLocaleString("fr-FR")} FCFA confirmé sur ${requiredAmount.toLocaleString("fr-FR")} FCFA requis pour démarrer.`);
    }
    if (confirmedAmount > invoiceTotal) return fail(409, "Le cumul des paiements confirmés dépasse le total de la facture. Vérification administrative nécessaire.");

    const existing = await callUserData(
      `client_project_launches?select=id,launched_at&request_id=eq.${encodeURIComponent(quote.request_id)}&limit=1`,
      "GET", token,
    );
    if (!existing.ok) return fail(502, "Impossible de vérifier si le projet a déjà été lancé.");
    if (Array.isArray(existing.data) && existing.data.length) return fail(409, "Ce projet a déjà été officiellement lancé. Son historique est conservé.");

    const saved = await callUserData("client_project_launches", "POST", token, {
      request_id: quote.request_id,
      client_user_id: invoice.client_user_id,
      quote_version_id: version.id,
      invoice_id: invoice.id,
      launched_by: access.user.id,
      required_amount: requiredAmount,
      invoice_total_at_launch: invoiceTotal,
      confirmed_amount_at_launch: confirmedAmount,
      launch_message: value.message.trim(),
    }, "return=representation");
    if (!saved.ok) return fail(502, "Le lancement n’a pas été enregistré. Aucune facture ni déclaration de paiement n’a été modifiée.");

    const statusUpdate = await callUserData(
      `client_requests?id=eq.${encodeURIComponent(quote.request_id)}&user_id=eq.${encodeURIComponent(invoice.client_user_id)}`,
      "PATCH", token,
      { admin_status: "in_progress", updated_at: new Date().toISOString() },
      "return=representation",
    );
    const launch = Array.isArray(saved.data) ? saved.data[0] : null;
    return NextResponse.json({
      saved: true,
      launch,
      statusUpdated: statusUpdate.ok && Array.isArray(statusUpdate.data) && statusUpdate.data.length > 0,
      message: "Le lancement officiel est enregistré. Le client peut maintenant voir la confirmation dans son espace.",
    });
  } catch {
    return fail(503, "Le service de lancement est momentanément indisponible.");
  }
}
