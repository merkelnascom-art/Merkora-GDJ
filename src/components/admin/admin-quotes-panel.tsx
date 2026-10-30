"use client";

import { useCallback, useEffect, useState } from "react";

type ClientRequest = { id: string; user_id: string; user_email: string; project_id: string; project_title: string; created_at: string };
type QuoteVersion = { id: string; quote_id: string; client_user_id: string; version_number: number; snapshot: Record<string, unknown>; currency: string; total_amount: number; valid_until: string; published_at: string | null; created_at: string };
type Decision = { id: string; quote_version_id: string; client_user_id: string; decision: string; message: string; created_at: string };
type QuoteForm = {
  title: string; description: string; amount: string; recurringAmount: string; discount: string;
  taxRateBasisPoints: string; taxConfirmed: boolean; validUntil: string; scope: string;
  exclusions: string; assumptionsText: string; paymentTerms: string;
};
const emptyForm = (): QuoteForm => ({
  title: "", description: "", amount: "", recurringAmount: "0", discount: "0",
  taxRateBasisPoints: "", taxConfirmed: false, validUntil: "", scope: "",
  exclusions: "Aucune exclusion supplémentaire, sauf mention écrite contraire.",
  assumptionsText: "", paymentTerms: "Les modalités de paiement seront confirmées avant tout démarrage.",
});
const decisionLabels: Record<string, string> = {
  accepted: "Accord sur cette version", declined: "Devis refusé",
  changes_requested: "Modifications demandées", negotiation: "Souhaite négocier",
};

export function AdminQuotesPanel() {
  const [requests, setRequests] = useState<ClientRequest[]>([]);
  const [versions, setVersions] = useState<QuoteVersion[]>([]);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [form, setForm] = useState<QuoteForm>(emptyForm());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/admin/quotes", { cache: "no-store" });
      const data = await response.json() as { requests?: ClientRequest[]; versions?: QuoteVersion[]; decisions?: Decision[]; error?: string };
      if (!response.ok) throw new Error(data.error || "Impossible de charger les devis.");
      setRequests(data.requests || []); setVersions(data.versions || []); setDecisions(data.decisions || []);
      setSelectedId(current => current || data.requests?.[0]?.id || "");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Le module devis est indisponible.");
    } finally { setBusy(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const selected = requests.find(item => item.id === selectedId);
  const visibleVersions = selected ? versions.filter(version => version.client_user_id === selected.user_id && version.snapshot.requestId === selected.id) : [];
  const money = (amount: unknown) => Number(amount || 0).toLocaleString("fr-FR") + " FCFA";

  async function submit(action: "save_draft" | "publish") {
    if (!selected) { setError("Sélectionnez un dossier client."); return; }
    setBusy(true); setError(""); setMessage("");
    try {
      const response = await fetch("/api/admin/quotes", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: selected.id, action,
          quote: {
            ...form, amount: Number(form.amount), recurringAmount: Number(form.recurringAmount || 0),
            discount: Number(form.discount || 0),
            taxRateBasisPoints: form.taxRateBasisPoints.trim() === "" ? null : Number(form.taxRateBasisPoints),
          },
        }),
      });
      const data = await response.json() as { error?: string; message?: string; version?: number; diagnostic?: string };
      if (!response.ok) throw new Error([data.error || "Le devis n’a pas été enregistré.", data.diagnostic].filter(Boolean).join("\\nDétail technique : "));
      setMessage((data.message || "Enregistré") + (data.version ? ` · version ${data.version}` : ""));
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Le devis n’a pas été enregistré.");
    } finally { setBusy(false); }
  }

  function update<K extends keyof QuoteForm>(key: K, value: QuoteForm[K]) {
    setForm(current => ({ ...current, [key]: value }));
  }

  return (
    <section style={{ maxWidth: 1100, margin: "24px auto 0", padding: 22, background: "#fff", border: "1px solid #e7e2f0", borderRadius: 20 }}>
      <div style={{ color: "#6e56a5", fontSize: 11, fontWeight: 700, letterSpacing: 1.5 }}>DEVIS VERSIONNÉS · FCFA</div>
      <h2 style={{ margin: "8px 0" }}>Préparer et publier un devis</h2>
      <p style={{ color: "#716c80", lineHeight: 1.6, fontSize: 14 }}>Chaque enregistrement crée une nouvelle version. Une publication devient visible au client et n’est jamais écrasée. L’accord client n’est ni un paiement ni un ordre de démarrage.</p>
      {error && <p role="alert" style={{ color: "#b42318", background: "#fff2f0", padding: 12, borderRadius: 10 }}>{error}</p>}
      {message && <p role="status" style={{ color: "#176b45", background: "#effaf4", padding: 12, borderRadius: 10 }}>{message}</p>}
      <label style={{ display: "block", fontWeight: 700 }}>Dossier client
        <select value={selectedId} onChange={event => { setSelectedId(event.target.value); setForm(emptyForm()); }} style={fieldStyle}>
          <option value="">Choisir un dossier…</option>
          {requests.map(item => <option key={item.id} value={item.id}>{item.project_title} · {item.user_email}</option>)}
        </select>
      </label>
      {selected && <div style={{ marginTop: 16, padding: 14, background: "#f8f7fb", borderRadius: 12, color: "#716c80", fontSize: 13 }}>
        Client : <strong>{selected.user_email}</strong> · Référence : {selected.project_id}
      </div>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 12, marginTop: 16 }}>
        <label style={labelStyle}>Titre du devis<input value={form.title} maxLength={160} onChange={e => update("title", e.target.value)} style={fieldStyle} /></label>
        <label style={labelStyle}>Montant ponctuel (FCFA)<input type="number" min="0" step="1" value={form.amount} onChange={e => update("amount", e.target.value)} style={fieldStyle} /></label>
        <label style={labelStyle}>Abonnement par période (FCFA, 0 si aucun)<input type="number" min="0" step="1" value={form.recurringAmount} onChange={e => update("recurringAmount", e.target.value)} style={fieldStyle} /></label>
        <label style={labelStyle}>Remise (FCFA)<input type="number" min="0" step="1" value={form.discount} onChange={e => update("discount", e.target.value)} style={fieldStyle} /></label>
        <label style={labelStyle}>Taux fiscal en points de base (1800 = 18 %)<input type="number" min="0" max="10000" step="1" value={form.taxRateBasisPoints} onChange={e => update("taxRateBasisPoints", e.target.value)} style={fieldStyle} /></label>
        <label style={{ ...labelStyle, display: "flex", alignItems: "center", gap: 8 }}><input type="checkbox" checked={form.taxConfirmed} onChange={e => update("taxConfirmed", e.target.checked)} /> Traitement fiscal vérifié et confirmé</label>
        <label style={labelStyle}>Valide jusqu’au<input type="date" value={form.validUntil} onChange={e => update("validUntil", e.target.value)} style={fieldStyle} /></label>
      </div>
      <label style={{ ...labelStyle, marginTop: 12 }}>Description des prestations<textarea value={form.description} maxLength={2000} rows={2} onChange={e => update("description", e.target.value)} style={fieldStyle} /></label>
      <label style={{ ...labelStyle, marginTop: 12 }}>Périmètre inclus<textarea value={form.scope} maxLength={5000} rows={3} onChange={e => update("scope", e.target.value)} style={fieldStyle} /></label>
      <label style={{ ...labelStyle, marginTop: 12 }}>Exclusions<textarea value={form.exclusions} maxLength={3000} rows={2} onChange={e => update("exclusions", e.target.value)} style={fieldStyle} /></label>
      <label style={{ ...labelStyle, marginTop: 12 }}>Hypothèses (une par ligne)<textarea value={form.assumptionsText} maxLength={2000} rows={2} onChange={e => update("assumptionsText", e.target.value)} style={fieldStyle} /></label>
      <label style={{ ...labelStyle, marginTop: 12 }}>Conditions de paiement<textarea value={form.paymentTerms} maxLength={1500} rows={2} onChange={e => update("paymentTerms", e.target.value)} style={fieldStyle} /></label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 16 }}>
        <button className="button button-quiet" disabled={busy || !selected} onClick={() => void submit("save_draft")}>{busy ? "Enregistrement…" : "Enregistrer un brouillon"}</button>
        <button className="button button-primary" disabled={busy || !selected} onClick={() => {
          if (window.confirm("Publier une nouvelle version de ce devis dans l’espace du client ?")) void submit("publish");
        }}>{busy ? "Traitement…" : "Publier au client"}</button>
        <button className="button button-quiet" disabled={busy} onClick={() => void load()}>Actualiser ↻</button>
      </div>
      <div style={{ marginTop: 24 }}>
        <h3>Versions et réponses du client</h3>
        {!selected && <p style={{ color: "#716c80" }}>Choisissez un dossier pour afficher ses versions.</p>}
        {selected && visibleVersions.length === 0 && <p style={{ color: "#716c80" }}>Aucune version créée pour ce client. Les brouillons sont visibles uniquement par l’administration.</p>}
        <div style={{ display: "grid", gap: 10 }}>
          {visibleVersions.map(version => {
            const snapshot = version.snapshot || {};
            const versionDecisions = decisions.filter(decision => decision.quote_version_id === version.id);
            return <article key={version.id} style={{ border: "1px solid #e7e2f0", borderRadius: 14, padding: 14 }}>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 8 }}>
                <strong>{String(snapshot.title || "Devis")} · v{version.version_number}</strong>
                <strong style={{ color: version.published_at ? "#176b45" : "#8a6d1d" }}>{version.published_at ? "Publié" : "Brouillon interne"}</strong>
              </div>
              <p style={{ margin: "8px 0", color: "#716c80" }}>{money(version.total_amount)} · validité {version.valid_until}</p>
              {versionDecisions.map(decision => <p key={decision.id} style={{ margin: "6px 0", fontSize: 13 }}>Réponse : <strong>{decisionLabels[decision.decision] || decision.decision}</strong>{decision.message ? ` — ${decision.message}` : ""} · {new Date(decision.created_at).toLocaleString("fr-FR")}</p>)}
            </article>;
          })}
        </div>
      </div>
    </section>
  );
}

const labelStyle: React.CSSProperties = { display: "block", fontWeight: 700, fontSize: 13, color: "#342e47" };
const fieldStyle: React.CSSProperties = { display: "block", width: "100%", boxSizing: "border-box", marginTop: 6, padding: 10, border: "1px solid #ded8ea", borderRadius: 9, font: "inherit", background: "#fff" };
