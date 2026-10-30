"use client";

import { useCallback, useEffect, useState } from "react";

type Invoice = { id: string; quote_version_id: string; client_user_id: string; invoice_number: string; description: string; currency: string; total_amount: number; due_date: string | null; created_at: string };
type Declaration = { id: string; invoice_id: string; client_user_id: string; amount: number; payment_method: string; paid_at: string; transaction_reference: string; client_note: string; created_at: string };
type Review = { id: string; payment_declaration_id: string; invoice_id: string; status: string; review_note: string; created_at: string };
type Version = { id: string; client_user_id: string; version_number: number; snapshot: Record<string, unknown>; total_amount: number; valid_until: string; published_at: string };
type Decision = { id: string; quote_version_id: string; client_user_id: string; decision: string; message: string; created_at: string };
const methods: Record<string, string> = { cash: "Espèces", mtn_momo: "MTN MoMo", moov_money: "Moov Money", celtiis_cash: "Celtiis Cash", bank_transfer: "Virement", other: "Autre" };
const money = (n: number) => Number(n || 0).toLocaleString("fr-FR") + " FCFA";

export function AdminPaymentsPanel() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [declarations, setDeclarations] = useState<Declaration[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [versions, setVersions] = useState<Version[]>([]);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [selected, setSelected] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [note, setNote] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      const response = await fetch("/api/admin/payments", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Impossible de charger les paiements.");
      setInvoices(data.invoices || []); setDeclarations(data.declarations || []); setReviews(data.reviews || []);
      setVersions(data.versions || []); setDecisions(data.decisions || []);
    } catch (e) { setError(e instanceof Error ? e.message : "Service indisponible."); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  const accepted = versions.filter(v => decisions.some(d => d.quote_version_id === v.id && d.client_user_id === v.client_user_id && d.decision === "accepted") && !invoices.some(i => i.quote_version_id === v.id));
  async function action(payload: Record<string, unknown>, key: string) {
    setBusy(key); setError(""); setNotice("");
    try {
      const response = await fetch("/api/admin/payments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Action impossible.");
      setNotice(data.message || "Opération enregistrée."); setSelected(""); setDueDate(""); setNote(current => ({ ...current, [key]: "" })); await load();
    } catch (e) { setError(e instanceof Error ? e.message : "Action impossible."); }
    finally { setBusy(""); }
  }

  return <section className="panel" style={{ maxWidth: 1100, margin: "18px auto", padding: 22, border: "1px solid #e7e2f0", borderRadius: 18, background: "#fff" }}>
    <div className="eyebrow">FACTURATION · ADMINISTRATION</div><h2>Factures et vérification des paiements</h2>
    <p style={{ color: "#716c80", fontSize: 14, lineHeight: 1.6 }}>Une facture ne peut être créée qu’à partir d’une version de devis acceptée. Les déclarations sont conservées; une confirmation ou un rejet ajoute une trace sans effacer la déclaration initiale.</p>
    {error && <p role="alert" style={{ color: "#b42318", background: "#fff2f0", padding: 10 }}>{error}</p>}{notice && <p role="status" style={{ color: "#176b45" }}>{notice}</p>}
    <div style={{ padding: 14, borderRadius: 12, background: "#f8f7fb", marginBottom: 16 }}>
      <strong>Créer une facture depuis un devis accepté</strong>
      <select value={selected} onChange={e => setSelected(e.target.value)} style={field}>
        <option value="">Choisir une version acceptée…</option>
        {accepted.map(v => <option key={v.id} value={v.id}>{String(v.snapshot?.title || "Devis")} · v{v.version_number} · {money(v.total_amount)} · {String(v.snapshot?.clientEmail || v.client_user_id)}</option>)}
      </select>
      <label style={label}>Date d’échéance (facultative)<input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} style={field} /></label>
      <button className="button button-primary" disabled={!selected || !!busy} onClick={() => void action({ action: "create_invoice", quoteVersionId: selected, dueDate: dueDate || null }, "invoice") } style={{ marginTop: 10 }}>{busy === "invoice" ? "Création…" : "Créer la facture"}</button>
      {accepted.length === 0 && <p style={{ fontSize: 12, color: "#716c80" }}>Aucun devis accepté non encore facturé n’est disponible.</p>}
    </div>
    <h3>Factures émises ({invoices.length})</h3>
    <div style={{ display: "grid", gap: 10 }}>
      {invoices.map(invoice => {
        const rows = declarations.filter(d => d.invoice_id === invoice.id);
        const confirmed = rows.filter(d => reviews.some(r => r.payment_declaration_id === d.id && r.status === "confirmed")).reduce((s, d) => s + Number(d.amount), 0);
        return <article key={invoice.id} style={{ border: "1px solid #e7e2f0", borderRadius: 12, padding: 14 }}>
          <strong>{invoice.invoice_number} · {invoice.description}</strong><p style={{ margin: "5px 0", color: "#716c80", fontSize: 13 }}>Total {money(invoice.total_amount)} · Confirmé {money(confirmed)} · Solde {money(Math.max(0, invoice.total_amount - confirmed))} · {invoice.client_user_id}</p>
        </article>;
      })}
    </div>
    <h3 style={{ marginTop: 22 }}>Déclarations à vérifier</h3>
    {declarations.filter(d => !reviews.some(r => r.payment_declaration_id === d.id)).length === 0 && <p style={{ color: "#716c80" }}>Aucune déclaration en attente.</p>}
    <div style={{ display: "grid", gap: 10 }}>
      {declarations.filter(d => !reviews.some(r => r.payment_declaration_id === d.id)).map(d => <article key={d.id} style={{ border: "1px solid #e7e2f0", borderRadius: 12, padding: 14 }}>
        <strong>{money(d.amount)} · {methods[d.payment_method] || d.payment_method}</strong>
        <p style={{ margin: "5px 0", color: "#716c80", fontSize: 13 }}>Client {d.client_user_id} · Facture {invoices.find(i => i.id === d.invoice_id)?.invoice_number || d.invoice_id} · payé le {new Date(d.paid_at).toLocaleString("fr-FR")}</p>
        {d.transaction_reference && <p style={{ fontSize: 13 }}>Référence : {d.transaction_reference}</p>}{d.client_note && <p style={{ fontSize: 13 }}>Note client : {d.client_note}</p>}
        <label style={label}>Note / motif de rejet<textarea rows={2} maxLength={1000} value={note[d.id] || ""} onChange={e => setNote(current => ({ ...current, [d.id]: e.target.value }))} style={field} /></label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 9 }}>
          <button className="button button-primary" disabled={!!busy} onClick={() => void action({ action: "review_payment", declarationId: d.id, status: "confirmed", note: note[d.id] || "" }, d.id)}>{busy === d.id ? "Traitement…" : "Confirmer le paiement"}</button>
          <button className="button button-quiet" disabled={!!busy || !(note[d.id] || "").trim()} onClick={() => void action({ action: "review_payment", declarationId: d.id, status: "rejected", note: note[d.id] || "" }, d.id)}>Rejeter avec motif</button>
        </div>
      </article>)}
    </div>
    <h3 style={{ marginTop: 22 }}>Historique des décisions</h3>
    {reviews.map(r => <p key={r.id} style={{ fontSize: 13 }}>{r.status === "confirmed" ? "Confirmé" : "Rejeté"} · {r.payment_declaration_id} · {r.review_note || "Sans note"} · {new Date(r.created_at).toLocaleString("fr-FR")}</p>)}
    <button className="button button-quiet" onClick={() => void load()} style={{ marginTop: 10 }}>Actualiser ↻</button>
  </section>;
}
const label: React.CSSProperties = { display: "block", fontWeight: 700, fontSize: 12, color: "#342e47", marginTop: 10 };
const field: React.CSSProperties = { display: "block", width: "100%", boxSizing: "border-box", marginTop: 5, padding: 9, border: "1px solid #ded8ea", borderRadius: 8, font: "inherit", background: "#fff" };
