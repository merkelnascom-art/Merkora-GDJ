import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { callUserData, getAccessToken, getCurrentUser, isSameOrigin } from "@/lib/server/supabase-rest";

export const dynamic = "force-dynamic";
const fail = (status: number, error: string) => NextResponse.json({ error }, { status });
const uuid = (value: unknown): value is string => typeof value === "string" && /^[0-9a-f-]{36}$/i.test(value);

type PaymentChannel = { label: string; number: string };
function getPaymentChannels(): Record<string, PaymentChannel> {
  try {
    const raw: unknown = JSON.parse(process.env.MERKORA_PAYMENT_CHANNELS_JSON ?? "{}");
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
    const source = raw as Record<string, unknown>;
    const channels: Record<string, PaymentChannel> = {};
    for (const key of ["mtn_momo", "celtiis_cash"] as const) {
      const item = source[key];
      if (!item || typeof item !== "object" || Array.isArray(item)) continue;
      const value = item as Record<string, unknown>;
      if (typeof value.number !== "string" || !/^\+?[0-9]{8,16}$/.test(value.number)) continue;
      channels[key] = {
        label: key === "mtn_momo" ? "MTN MoMo" : "Celtiis Cash",
        number: value.number,
      };
    }
    return channels;
  } catch {
    return {};
  }
}

export async function GET() {
  try {
    const store = await cookies();
    const user = await getCurrentUser(store);
    const token = await getAccessToken(store);
    if (!user || !token) return fail(401, "Connectez-vous pour consulter vos factures.");
    const filter = encodeURIComponent(user.id);
    const [invoices, declarations, reviews] = await Promise.all([
      callUserData(`client_invoices?select=*&client_user_id=eq.${filter}&order=created_at.desc&limit=100`, "GET", token),
      callUserData(`client_payment_declarations?select=*&client_user_id=eq.${filter}&order=created_at.desc&limit=200`, "GET", token),
      callUserData(`client_payment_reviews?select=*&client_user_id=eq.${filter}&order=created_at.desc&limit=200`, "GET", token),
    ]);
    if (![invoices, declarations, reviews].every(x => x.ok)) return fail(502, "Impossible de charger vos factures et déclarations.");
    const invoiceRows = Array.isArray(invoices.data) ? invoices.data : [];
    return NextResponse.json({
      invoices: invoiceRows,
      paymentChannels: invoiceRows.length > 0 ? getPaymentChannels() : {},
      declarations: Array.isArray(declarations.data) ? declarations.data : [],
      reviews: Array.isArray(reviews.data) ? reviews.data : [],
    });
  } catch { return fail(503, "Le service de facturation est indisponible."); }
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return fail(403, "Requête non autorisée.");
  let body: unknown;
  try { body = await request.json(); } catch { return fail(400, "Données invalides."); }
  if (!body || typeof body !== "object" || Array.isArray(body)) return fail(400, "Données invalides.");
  const value = body as Record<string, unknown>;
  if (!uuid(value.invoiceId) || !Number.isSafeInteger(value.amount) || Number(value.amount) <= 0 ||
      !["cash", "mtn_momo", "celtiis_cash", "bank_transfer", "other"].includes(String(value.paymentMethod)) ||
      typeof value.paidAt !== "string" || Number.isNaN(Date.parse(value.paidAt)) ||
      Date.parse(value.paidAt) > Date.now() + 5 * 60 * 1000 ||
      typeof value.reference !== "string" || value.reference.length > 160 ||
      typeof value.note !== "string" || value.note.length > 1000) {
    return fail(400, "Montant, date ou mode de paiement invalide.");
  }
  if (["mtn_momo", "celtiis_cash"].includes(String(value.paymentMethod)) && !value.reference.trim()) {
    return fail(400, "La référence de transaction est obligatoire pour un paiement Mobile Money.");
  }
  try {
    const store = await cookies();
    const user = await getCurrentUser(store);
    const token = await getAccessToken(store);
    if (!user || !token) return fail(401, "Connectez-vous à votre compte client.");
    const invoiceResult = await callUserData(
      `client_invoices?select=id,total_amount,currency&id=eq.${encodeURIComponent(value.invoiceId)}&client_user_id=eq.${encodeURIComponent(user.id)}&limit=1`,
      "GET", token,
    );
    if (!invoiceResult.ok || !Array.isArray(invoiceResult.data) || !invoiceResult.data.length) return fail(404, "Facture introuvable pour ce compte.");
    const invoice = invoiceResult.data[0] as { id: string; total_amount: number; currency: string };
    const [declarations, reviews] = await Promise.all([
      callUserData(`client_payment_declarations?select=id,amount&invoice_id=eq.${encodeURIComponent(invoice.id)}&client_user_id=eq.${encodeURIComponent(user.id)}`, "GET", token),
      callUserData(`client_payment_reviews?select=payment_declaration_id,status&invoice_id=eq.${encodeURIComponent(invoice.id)}&client_user_id=eq.${encodeURIComponent(user.id)}`, "GET", token),
    ]);
    if (!declarations.ok || !reviews.ok) return fail(502, "Impossible de calculer le solde actuel.");
    const amountById = new Map<string, number>((Array.isArray(declarations.data) ? declarations.data : []).map((d: { id: string; amount: number }) => [d.id, Number(d.amount)] as const));
    const confirmedIds = new Set((Array.isArray(reviews.data) ? reviews.data : []).filter((r: { status: string }) => r.status === "confirmed").map((r: { payment_declaration_id: string }) => r.payment_declaration_id));
    const confirmed = [...confirmedIds].reduce((sum, id) => sum + (amountById.get(id) || 0), 0);
    const pending = (Array.isArray(declarations.data) ? declarations.data : [])
      .filter((d: { id: string }) => ![...((Array.isArray(reviews.data) ? reviews.data : []) as Array<{ payment_declaration_id: string; status: string }>)]
        .some(r => r.payment_declaration_id === d.id))
      .reduce((sum: number, d: { amount: number }) => sum + Number(d.amount), 0);
    const remaining = Number(invoice.total_amount) - confirmed - pending;
    if (Number(value.amount) > remaining) return fail(409, `Le montant dépasse le solde disponible après les déclarations en attente (${Math.max(0, remaining).toLocaleString("fr-FR")} FCFA).`);
    const saved = await callUserData("client_payment_declarations", "POST", token, {
      invoice_id: invoice.id, client_user_id: user.id, amount: Number(value.amount),
      payment_method: value.paymentMethod, paid_at: new Date(value.paidAt).toISOString(),
      transaction_reference: value.reference.trim(), client_note: value.note.trim(),
    }, "return=representation");
    if (!saved.ok) return fail(502, "Votre déclaration n’a pas été enregistrée.");
    return NextResponse.json({ saved: true, message: "Déclaration reçue. Le paiement sera comptabilisé uniquement après vérification et confirmation par l’administration." });
  } catch { return fail(503, "Le service de facturation est indisponible."); }
}
