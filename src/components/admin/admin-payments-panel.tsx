"use client";

import { useCallback, useEffect, useState } from "react";

type Invoice = { id: string; quote_version_id: string; client_user_id: string; invoice_number: string; description: string; currency: string; total_amount: number; due_date: string | null; created_at: string };
type Declaration = { id: string; invoice_id: string; client_user_id: string; amount: number; payment_method: string; paid_at: string; transaction_reference: string; client_note: string; created_at: string };
type Review = { id: string; payment_declaration_id: string; invoice_id: string; status: string; review_note: string; created_at: string };
type Version = { id: string; client_user_id: string; version_number: number; snapshot: Record<string, unknown>; total_amount: number; valid_until: string; published_at: string };
type Decision = { id: string; quote_version_id: string; client_user_id: string; decision: string; message: string; created_at: string };
type Launch = { id: string; request_id: string; client_user_id: string; quote_version_id: string; invoice_id: string; required_amount: number; invoice_total_at_launch: number; confirmed_amount_at_launch: number; launch_message: string; launched_at: string };
const methods: Record<string, string> = { cash: "Espèces", mtn_momo: "MTN MoMo", moov_money: "Moov Money", celtiis_cash: "Celtiis Cash", bank_transfer: "Virement", other: "Autre" };
const money = (n: number) => Number(n || 0).toLocaleString("fr-FR") + " FCFA";

export function AdminPaymentsPanel() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [declarations, setDeclarations] = useState<Declaration[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [versions, setVersions] = useState<Version[]>([]);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [requiredAmounts, setRequiredAmounts] = useState<Record<string, string>>({});
  const [launchMessages, setLaunchMessages] = useState<Record<string, string>>({});
  const [launchConfirmInvoiceId, setLaunchConfirmInvoiceId] = useState("");
  const [selected, setSelected] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [note, setNote] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      const [response, launchResponse] = await Promise.all([
        fetch("/api/admin/payments", { cache: "no-store" }),
        fetch("/api/admin/project-launches", { cache: "no-store" }),
      ]);
      const data = await response.json();
      const launchData = await launchResponse.json();
      if (!response.ok) throw new Error(data.error || "Impossible de charger les paiements.");
      if (!launchResponse.ok) throw new Error(launchData.error || "Impossible de charger les lancements de projets.");
      setInvoices(data.invoices || []); setDeclarations(data.declarations || []); setReviews(data.reviews || []);
      setVersions(data.versions || []); setDecisions(data.decisions || []);
      setLaunches(launchData.launches || []);
    } catch (e) { setError(e instanceof Error ? e.message : "Service indisponible."); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  const accepted = versions.filter(v => decisions.some(d => d.quote_version_id === v.id && d.client_user_id === v.client_user_id && d.decision === "accepted") && !invoices.some(i => i.quote_version_id === v.id));
  async function action(payload: Record<string, unknown>, key: string) {
    setBusy(key); setError(""); setNotice("");
    try {
      const endpoint = payload.action === "launch_project" ? "/api/admin/project-launches" : "/api/admin/payments";
      const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Action impossible.");
      setNotice(data.message || "Opération enregistrée."); setSelected(""); setDueDate(""); setNote(current => ({ ...current, [key]: "" }));
      if (payload.action === "launch_project") setLaunchConfirmInvoiceId("");
      await load();
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
        const launch = launches.find(item => item.invoice_id === invoice.id);
        const version = versions.find(item => item.id === invoice.quote_version_id);
        const projectTitle = String(version?.snapshot?.projectTitle || invoice.description || "Projet client");
        const required = Number(requiredAmounts[invoice.id] ?? invoice.total_amount);
        return <article key={invoice.id} style={{ border: "1px solid #e7e2f0", borderRadius: 12, padding: 14 }}>
          <strong>{invoice.invoice_number} · {projectTitle}</strong>
          <p style={{ margin: "5px 0", color: "#716c80", fontSize: 13 }}>Total {money(invoice.total_amount)} · Confirmé {money(confirmed)} · Solde {money(Math.max(0, invoice.total_amount - confirmed))} · {invoice.client_user_id}</p>
          {typeof version?.snapshot?.paymentTerms === "string" && <p style={{ fontSize: 13, color: "#716c80" }}>Conditions du devis accepté : {version.snapshot.paymentTerms}</p>}
          {launch ? (
            <div style={{ marginTop: 12, padding: 12, borderRadius: 10, background: "#edf8f1", border: "1px solid #ccebd8" }}>
              <strong style={{ color: "#176b45" }}>Projet officiellement lancé</strong>
              <p style={{ margin: "6px 0", fontSize: 13 }}>{new Date(launch.launched_at).toLocaleString("fr-FR")} · Seuil requis : {money(launch.required_amount)} · Confirmé à cette date : {money(launch.confirmed_amount_at_launch)}</p>
              <p style={{ margin: 0, fontSize: 13 }}>{launch.launch_message}</p>
            </div>
          ) : (
            <div style={{ marginTop: 12, padding: 12, borderRadius: 10, background: "#f8f7fb" }}>
              <strong>Démarrage du projet</strong>
              <p style={{ margin: "5px 0", color: "#716c80", fontSize: 13 }}>Choisissez le montant exigé par les conditions du devis. Seuls les paiements déjà confirmés par l’administration sont comptabilisés.</p>
              <label style={label}>Montant requis pour lancer (FCFA)
                <input type="number" min="1" max={invoice.total_amount} step="1" value={requiredAmounts[invoice.id] ?? String(invoice.total_amount)} onChange={e => setRequiredAmounts(current => ({ ...current, [invoice.id]: e.target.value }))} style={field} />
              </label>
              <p style={{ fontSize: 12, color: confirmed >= required && required > 0 && required <= invoice.total_amount ? "#176b45" : "#9a5b12" }}>
                {required > 0 && required <= invoice.total_amount && confirmed >= required
                  ? "Conditions financières remplies. Vous pouvez lancer le projet."
                  : `Paiement confirmé : ${money(confirmed)} · Requis : ${money(required)}`}
              </p>
              <button className="button button-primary" disabled={!!busy || !Number.isSafeInteger(required) || required <= 0 || required > invoice.total_amount || confirmed < required} onClick={() => setLaunchConfirmInvoiceId(invoice.id)}>Lancer le projet</button>
            </div>
          )}
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
    {launchConfirmInvoiceId && (() => {
      const invoice = invoices.find(item => item.id === launchConfirmInvoiceId);
      if (!invoice) return null;
      const rows = declarations.filter(d => d.invoice_id === invoice.id);
      const confirmed = rows.filter(d => reviews.some(r => r.payment_declaration_id === d.id && r.status === "confirmed")).reduce((s, d) => s + Number(d.amount), 0);
      const required = Number(requiredAmounts[invoice.id] ?? invoice.total_amount);
      const version = versions.find(item => item.id === invoice.quote_version_id);
      const projectTitle = String(version?.snapshot?.projectTitle || invoice.description || "Projet client");
      const message = launchMessages[invoice.id] ?? "Votre projet a officiellement commencé. Notre équipe démarre sa réalisation. Vous pourrez suivre les prochaines étapes depuis votre espace client.";
      return <div role="presentation" onClick={() => !busy && setLaunchConfirmInvoiceId("")} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(24,18,38,.55)", display: "grid", placeItems: "center", padding: 16 }}>
        <section role="dialog" aria-modal="true" aria-labelledby="launch-confirm-title" onClick={e => e.stopPropagation()} style={{ width: "min(560px,100%)", background: "#fff", borderRadius: 18, padding: 22, boxShadow: "0 24px 80px rgba(0,0,0,.22)" }}>
          <div className="eyebrow">CONFIRMATION ADMINISTRATEUR</div>
          <h3 id="launch-confirm-title">Lancer officiellement ce projet ?</h3>
          <p><strong>{projectTitle}</strong> · {invoice.invoice_number}</p>
          <p style={{ color: "#716c80", fontSize: 13 }}>Montant confirmé : {money(confirmed)} · Seuil requis : {money(required)}</p>
          <label style={label}>Message visible par le client
            <textarea rows={4} maxLength={1200} value={message} onChange={e => setLaunchMessages(current => ({ ...current, [invoice.id]: e.target.value }))} style={field} />
          </label>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", flexWrap: "wrap", marginTop: 16 }}>
            <button className="button button-quiet" disabled={!!busy} onClick={() => setLaunchConfirmInvoiceId("")}>Annuler</button>
            <button className="button button-primary" disabled={!!busy || !message.trim() || confirmed < required || required <= 0 || required > invoice.total_amount} onClick={() => void action({ action: "launch_project", invoiceId: invoice.id, requiredAmount: required, message }, `launch-${invoice.id}`)}>{busy === `launch-${invoice.id}` ? "Lancement…" : "Confirmer et lancer le projet"}</button>
          </div>
        </section>
      </div>;
    })()}

  </section>;
}
const label: React.CSSProperties = { display: "block", fontWeight: 700, fontSize: 12, color: "#342e47", marginTop: 10 };
const field: React.CSSProperties = { display: "block", width: "100%", boxSizing: "border-box", marginTop: 5, padding: 9, border: "1px solid #ded8ea", borderRadius: 8, font: "inherit", background: "#fff" };
