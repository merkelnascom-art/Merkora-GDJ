"use client";

import { useCallback, useEffect, useState } from "react";

type Invoice = { id: string; invoice_number: string; description: string; currency: string; total_amount: number; due_date: string | null; created_at: string };
type Declaration = { id: string; invoice_id: string; amount: number; payment_method: string; paid_at: string; transaction_reference: string; client_note: string; created_at: string };
type Review = { id: string; payment_declaration_id: string; status: string; review_note: string; created_at: string };
const methods: Record<string, string> = { cash: "Espèces", mtn_momo: "MTN MoMo", moov_money: "Moov Money", bank_transfer: "Virement bancaire", other: "Autre" };

export function ClientPaymentsPanel() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [declarations, setDeclarations] = useState<Declaration[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [forms, setForms] = useState<Record<string, { amount: string; method: string; paidAt: string; reference: string; note: string }>>({});
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loaded, setLoaded] = useState(false);
  const money = (n: number) => Number(n || 0).toLocaleString("fr-FR") + " FCFA";

  const load = useCallback(async () => {
    setError("");
    try {
      const response = await fetch("/api/client-payments", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Impossible de charger les factures.");
      setInvoices(data.invoices || []); setDeclarations(data.declarations || []); setReviews(data.reviews || []); setLoaded(true);
    } catch (e) { setError(e instanceof Error ? e.message : "Service indisponible."); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  function formFor(id: string) {
    return forms[id] || { amount: "", method: "mtn_momo", paidAt: new Date().toISOString().slice(0, 16), reference: "", note: "" };
  }
  function update(id: string, key: string, value: string) {
    setForms(current => ({ ...current, [id]: { ...formFor(id), [key]: value } }));
  }
  async function submit(invoiceId: string) {
    const form = formFor(invoiceId);
    setBusy(invoiceId); setError(""); setNotice("");
    try {
      const response = await fetch("/api/client-payments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
        invoiceId, amount: Number(form.amount), paymentMethod: form.method, paidAt: form.paidAt,
        reference: form.reference, note: form.note,
      }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Déclaration impossible.");
      setNotice(data.message); setForms(current => ({ ...current, [invoiceId]: { ...form, amount: "", reference: "", note: "" } }));
      await load();
    } catch (e) { setError(e instanceof Error ? e.message : "Déclaration impossible."); }
    finally { setBusy(""); }
  }

  return <section className="panel" style={{ maxWidth: 1100, margin: "18px auto", padding: 22, border: "1px solid #e7e2f0", borderRadius: 18, background: "#fff" }}>
    <div className="eyebrow">FACTURATION · ESPACE CLIENT</div><h2>Mes factures et paiements</h2>
    <p style={{ color: "#716c80", fontSize: 14, lineHeight: 1.6 }}>Déclarez un paiement total ou partiel. Une déclaration reste « à vérifier » jusqu’à sa confirmation par l’administration; elle ne réduit pas le solde comptabilisé avant confirmation.</p>
    {error && <p role="alert" style={{ color: "#b42318" }}>{error}</p>}{notice && <p role="status" style={{ color: "#176b45" }}>{notice}</p>}
    {loaded && invoices.length === 0 && <p style={{ color: "#716c80" }}>Aucune facture disponible pour ce compte.</p>}
    <div style={{ display: "grid", gap: 14 }}>
      {invoices.map(invoice => {
        const rows = declarations.filter(d => d.invoice_id === invoice.id);
        const reviewsForInvoice = rows.map(d => ({ declaration: d, review: reviews.find(r => r.payment_declaration_id === d.id) }));
        const confirmed = reviewsForInvoice.filter(x => x.review?.status === "confirmed").reduce((s, x) => s + Number(x.declaration.amount), 0);
        const pending = reviewsForInvoice.filter(x => !x.review).reduce((s, x) => s + Number(x.declaration.amount), 0);
        const balance = Math.max(0, Number(invoice.total_amount) - confirmed);
        const form = formFor(invoice.id);
        return <article key={invoice.id} style={{ border: "1px solid #e7e2f0", borderRadius: 14, padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <div><strong>{invoice.invoice_number}</strong><p style={{ margin: "5px 0", color: "#716c80" }}>{invoice.description} · Émise le {new Date(invoice.created_at).toLocaleDateString("fr-FR")}</p></div>
            <strong>{money(invoice.total_amount)}</strong>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 18, margin: "12px 0", padding: 12, background: "#f8f7fb", borderRadius: 10 }}>
            <span>Confirmé : <b>{money(confirmed)}</b></span><span>À vérifier : <b>{money(pending)}</b></span><span>Solde comptable : <b>{money(balance)}</b></span>
          </div>
          {rows.length > 0 && <div style={{ marginBottom: 14 }}>{reviewsForInvoice.map(({ declaration, review }) => <p key={declaration.id} style={{ fontSize: 13, margin: "7px 0" }}>
            {money(declaration.amount)} · {methods[declaration.payment_method] || declaration.payment_method} · {new Date(declaration.paid_at).toLocaleDateString("fr-FR")} — <b>{review?.status === "confirmed" ? "Confirmé" : review?.status === "rejected" ? "Rejeté" : "À vérifier"}</b>{review?.review_note ? " · " + review.review_note : ""}{declaration.transaction_reference ? " · Réf. " + declaration.transaction_reference : ""}
          </p>)}</div>}
          {balance > 0 && <div style={{ borderTop: "1px solid #eee", paddingTop: 12 }}>
            <strong>Déclarer un paiement</strong>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 9, marginTop: 10 }}>
              <label style={label}>Montant (FCFA)<input type="number" min="1" max={balance} step="1" value={form.amount} onChange={e => update(invoice.id, "amount", e.target.value)} style={field} /></label>
              <label style={label}>Mode<select value={form.method} onChange={e => update(invoice.id, "method", e.target.value)} style={field}>{Object.entries(methods).map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label>
              <label style={label}>Date du paiement<input type="datetime-local" value={form.paidAt} onChange={e => update(invoice.id, "paidAt", e.target.value)} style={field} /></label>
              <label style={label}>Référence (facultatif)<input maxLength={160} value={form.reference} onChange={e => update(invoice.id, "reference", e.target.value)} style={field} /></label>
            </div>
            <label style={label}>Note (facultative)<textarea maxLength={1000} rows={2} value={form.note} onChange={e => update(invoice.id, "note", e.target.value)} style={field} /></label>
            <button className="button button-primary" disabled={busy === invoice.id || !form.amount} onClick={() => void submit(invoice.id)} style={{ marginTop: 10 }}>{busy === invoice.id ? "Envoi…" : "Envoyer ma déclaration"}</button>
          </div>}
        </article>;
      })}
    </div>
    <button className="button button-quiet" onClick={() => void load()} style={{ marginTop: 12 }}>Actualiser ↻</button>
  </section>;
}
const label: React.CSSProperties = { display: "block", fontWeight: 700, fontSize: 12, color: "#342e47" };
const field: React.CSSProperties = { display: "block", width: "100%", boxSizing: "border-box", marginTop: 5, padding: 9, border: "1px solid #ded8ea", borderRadius: 8, font: "inherit", background: "#fff" };
