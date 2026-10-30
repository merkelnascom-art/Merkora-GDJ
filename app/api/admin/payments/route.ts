import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminAccess } from "@/lib/server/admin-access";
import { callUserData, getAccessToken, isSameOrigin } from "@/lib/server/supabase-rest";

export const dynamic = "force-dynamic";
const fail = (status: number, error: string) => NextResponse.json({ error }, { status });
const uuid = (value: unknown): value is string => typeof value === "string" && /^[0-9a-f-]{36}$/i.test(value);

export async function GET() {
  const access = await getAdminAccess();
  if (!access.ok) return fail(access.reason === "unauthenticated" ? 401 : 403, "Accès administrateur requis.");
  try {
    const token = await getAccessToken(await cookies());
    if (!token) return fail(401, "Session expirée. Reconnectez-vous.");
    const [invoices, declarations, reviews, versions, decisions] = await Promise.all([
      callUserData("client_invoices?select=*&order=created_at.desc&limit=200", "GET", token),
      callUserData("client_payment_declarations?select=*&order=created_at.desc&limit=300", "GET", token),
      callUserData("client_payment_reviews?select=*&order=created_at.desc&limit=300", "GET", token),\n      callUserData("client_quote_versions?select=id,client_user_id,version_number,snapshot,currency,total_amount,valid_until,published_at&published_at=not.is.null&order=created_at.desc&limit=200", "GET", token),\n      callUserData("client_quote_decisions?select=id,quote_version_id,client_user_id,decision,message,created_at&order=created_at.desc&limit=300", "GET", token),
    ]);
    if (![invoices, declarations, reviews, versions, decisions].every(x => x.ok)) return fail(502, "Impossible de charger les factures et paiements. Vérifiez les accès Supabase du compte administrateur.");
    return NextResponse.json({
      invoices: Array.isArray(invoices.data) ? invoices.data : [],
      declarations: Array.isArray(declarations.data) ? declarations.data : [],
      reviews: Array.isArray(reviews.data) ? reviews.data : [],\n      versions: Array.isArray(versions.data) ? versions.data : [],\n      decisions: Array.isArray(decisions.data) ? decisions.data : [],
    });
  } catch { return fail(503, "Le service de facturation est indisponible."); }
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return fail(403, "Requête non autorisée.");
  const access = await getAdminAccess();
  if (!access.ok) return fail(access.reason === "unauthenticated" ? 401 : 403, "Accès administrateur requis.");
  let body: unknown;
  try { body = await request.json(); } catch { return fail(400, "Données invalides."); }
  if (!body || typeof body !== "object" || Array.isArray(body)) return fail(400, "Données invalides.");
  const value = body as Record<string, unknown>;
  try {
    const token = await getAccessToken(await cookies());
    if (!token) return fail(401, "Session expirée. Reconnectez-vous.");

    if (value.action === "create_invoice") {
      if (!uuid(value.quoteVersionId) || (value.dueDate !== null && value.dueDate !== undefined &&
          (typeof value.dueDate !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value.dueDate)))) {
        return fail(400, "Version du devis ou date d’échéance invalide.");
      }
      const versionResult = await callUserData(
        `client_quote_versions?select=id,client_user_id,currency,total_amount,valid_until,published_at,snapshot&id=eq.${encodeURIComponent(value.quoteVersionId)}&limit=1`,
        "GET", token,
      );
      if (!versionResult.ok || !Array.isArray(versionResult.data) || !versionResult.data.length) return fail(404, "Version du devis introuvable ou inaccessible.");
      const version = versionResult.data[0] as { id: string; client_user_id: string; currency: string; total_amount: number; valid_until: string; published_at: string | null; snapshot: Record<string, unknown> };
      if (!version.published_at || version.valid_until < new Date().toISOString().slice(0, 10) || Number(version.total_amount) <= 0) {
        return fail(409, "Seul un devis publié, non expiré et d’un montant positif peut être facturé.");
      }
      const decisions = await callUserData(
        `client_quote_decisions?select=id,decision&quote_version_id=eq.${encodeURIComponent(version.id)}&client_user_id=eq.${encodeURIComponent(version.client_user_id)}`,
        "GET", token,
      );
      if (!decisions.ok) return fail(502, "Impossible de vérifier l’accord du client.");
      if (!Array.isArray(decisions.data) || !decisions.data.some((d: { decision?: string }) => d.decision === "accepted")) {
        return fail(409, "Le client n’a pas encore accepté précisément cette version du devis.");
      }
      const existing = await callUserData(`client_invoices?select=id&quote_version_id=eq.${encodeURIComponent(version.id)}&limit=1`, "GET", token);
      if (!existing.ok) return fail(502, "Impossible de vérifier si cette version est déjà facturée.");
      if (Array.isArray(existing.data) && existing.data.length) return fail(409, "Une facture existe déjà pour cette version du devis.");
      const suffix = crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();
      const snapshotTitle = typeof version.snapshot?.title === "string" ? version.snapshot.title.slice(0, 160) : "Prestation MerKora GDJ";
      const created = await callUserData("client_invoices", "POST", token, {
        quote_version_id: version.id, client_user_id: version.client_user_id,
        invoice_number: `MK-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${suffix}`,
        description: snapshotTitle, currency: version.currency, total_amount: version.total_amount,
        due_date: typeof value.dueDate === "string" ? value.dueDate : null, created_by: access.user.id,
      }, "return=representation");
      if (!created.ok) return fail(502, "La facture n’a pas été créée. Vérifiez les règles d’accès et réessayez.");
      return NextResponse.json({ saved: true, invoice: Array.isArray(created.data) ? created.data[0] : null });
    }

    if (value.action === "review_payment") {
      if (!uuid(value.declarationId) || !["confirmed", "rejected"].includes(String(value.status)) ||
          typeof value.note !== "string" || value.note.length > 1000 ||
          (value.status === "rejected" && !value.note.trim())) return fail(400, "Décision de paiement ou motif invalide.");
      const declaration = await callUserData(
        `client_payment_declarations?select=id,invoice_id,client_user_id&id=eq.${encodeURIComponent(value.declarationId)}&limit=1`,
        "GET", token,
      );
      if (!declaration.ok || !Array.isArray(declaration.data) || !declaration.data.length) return fail(404, "Déclaration introuvable.");
      const row = declaration.data[0] as { id: string; invoice_id: string; client_user_id: string };
      const already = await callUserData(`client_payment_reviews?select=id&payment_declaration_id=eq.${encodeURIComponent(row.id)}&limit=1`, "GET", token);
      if (!already.ok) return fail(502, "Impossible de vérifier cette déclaration.");
      if (Array.isArray(already.data) && already.data.length) return fail(409, "Cette déclaration a déjà été examinée. Le journal est conservé sans modification.");
      const saved = await callUserData("client_payment_reviews", "POST", token, {
        payment_declaration_id: row.id, invoice_id: row.invoice_id, client_user_id: row.client_user_id,
        status: value.status, review_note: value.note.trim(), reviewed_by: access.user.id,
      }, "return=representation");
      if (!saved.ok) {
        const info = saved.data && typeof saved.data === "object" ? saved.data as Record<string, unknown> : {};
        const message = typeof info.message === "string" ? info.message.slice(0, 220) : "";
        return fail(409, value.status === "confirmed"
          ? (message || "Paiement non confirmé : il pourrait dépasser le solde restant.")
          : "La décision n’a pas été enregistrée.");
      }
      return NextResponse.json({ saved: true, message: value.status === "confirmed" ? "Paiement confirmé." : "Déclaration rejetée; l’historique est conservé." });
    }
    return fail(400, "Action inconnue.");
  } catch { return fail(503, "Le service de facturation est indisponible."); }
}
