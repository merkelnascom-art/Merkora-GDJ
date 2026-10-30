"use client";

import { useCallback, useEffect, useState } from "react";

type RequestItem = {
  id: string; user_id: string; user_email: string; project_id: string; project_title: string;
  payload: {
    project?: { category?: string; problem?: string; desiredOutcome?: string; budget?: string; urgency?: string; recommendations?: Array<{title?:string;description?:string}> };
    studio?: { format?: string; palette?: string; reviewStatus?: string; reviewNote?: string };
    quote?: { amount?: string; days?: string; paymentTerms?: string };
    clientResponse?: { choice?: string; comment?: string };
  };
  admin_status: string; admin_note: string; created_at: string; updated_at: string;
};
const statuses = [
  ["to_review", "À examiner"], ["verified", "Identité et dossier vérifiés"],
  ["changes_requested", "Modifications à préparer"], ["negotiation", "Négociation en cours"],
  ["accepted", "Accepté par l’administration"], ["in_progress", "Réalisation en cours"],
  ["delivered", "Livré"], ["rejected", "Refusé / clôturé"],
] as const;

export function CloudClientRequestsPanel() {
  const [items, setItems] = useState<RequestItem[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [statusesById, setStatusesById] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/admin/client-requests", { cache: "no-store" });
      const data = await response.json().catch(() => ({})) as { requests?: RequestItem[]; error?: string };
      if (!response.ok) throw new Error(data.error || "Impossible de charger les demandes.");
      const next = Array.isArray(data.requests) ? data.requests : [];
      setItems(next);
      setNotes(Object.fromEntries(next.map(item => [item.id, item.admin_note || ""])));
      setStatusesById(Object.fromEntries(next.map(item => [item.id, item.admin_status || "to_review"])));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "La boîte de réception est indisponible.");
    } finally { setBusy(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function save(item: RequestItem) {
    setBusy(true); setError(""); setMessage("");
    try {
      const response = await fetch("/api/admin/client-requests", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, status: statusesById[item.id] || item.admin_status, note: notes[item.id] || "" }),
      });
      const data = await response.json().catch(() => ({})) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Le suivi n’a pas été enregistré.");
      setMessage("Suivi administratif enregistré en ligne.");
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Le suivi n’a pas été enregistré.");
    } finally { setBusy(false); }
  }

  const choiceLabel = (choice?: string) => choice === "accepted" ? "Le client indique accepter" : choice === "changes_requested" ? "Modifications demandées" : choice === "negotiate" ? "Souhaite négocier" : "Aucune décision enregistrée";

  return (
    <section style={{ maxWidth: 1100, margin: "24px auto 0", padding: 22, background: "#fff", border: "1px solid #e7e2f0", borderRadius: 20 }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <div><div style={{ color: "#6e56a5", fontSize: 11, fontWeight: 700, letterSpacing: 1.5 }}>RÉCEPTION EN LIGNE</div><h2 style={{ margin: "8px 0" }}>Demandes clients reçues</h2><p style={{ color: "#716c80", fontSize: 14 }}>Les dossiers envoyés depuis les comptes clients apparaissent ici sans téléchargement manuel.</p></div>
        <button className="button button-quiet" disabled={busy} onClick={() => void load()}>{busy ? "Chargement…" : "Actualiser ↻"}</button>
      </div>
      {error && <p role="alert" style={{ color: "#b42318", padding: 12, background: "#fff2f0", borderRadius: 10 }}>{error}</p>}
      {message && <p role="status" style={{ color: "#176b45" }}>{message}</p>}
      {!error && items.length === 0 && <p style={{ padding: 18, color: "#716c80", background: "#f8f7fb", borderRadius: 12 }}>Aucune demande en ligne pour le moment.</p>}
      <div style={{ display: "grid", gap: 14 }}>
        {items.map(item => {
          const payload = item.payload || {};
          const project = payload.project || {};
          const studio = payload.studio || {};
          const quote = payload.quote || {};
          const response = payload.clientResponse || {};
          return <article key={item.id} style={{ border: "1px solid #e7e2f0", borderRadius: 16, padding: 18 }}>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 10 }}>
              <div><h3 style={{ margin: "0 0 6px" }}>{item.project_title}</h3><p style={{ margin: 0, color: "#716c80", fontSize: 13 }}>{item.user_email} · {item.project_id} · {new Date(item.created_at).toLocaleString("fr-FR")}</p></div>
              <strong style={{ color: "#6e56a5" }}>{statuses.find(s => s[0] === (statusesById[item.id] || item.admin_status))?.[1] || item.admin_status}</strong>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12, marginTop: 14 }}>
              <div><strong>Problème</strong><p>{project.problem || "Non renseigné"}</p></div>
              <div><strong>Résultat souhaité</strong><p>{project.desiredOutcome || "Non renseigné"}</p></div>
              <div><strong>Budget déclaré</strong><p>{project.budget || "À définir"}</p></div>
              <div><strong>Concept</strong><p>{studio.format || "website"} · {studio.palette || "violet"} · {studio.reviewStatus || "draft"}</p>{studio.reviewNote && <p>Retour concept : {studio.reviewNote}</p>}</div>
              <div><strong>Réponse client</strong><p>{choiceLabel(response.choice)}</p>{response.comment && <p>{response.comment}</p>}</div>
              <div><strong>Proposition</strong><p>{quote.amount ? quote.amount + " FCFA" : "Montant non renseigné"} · {quote.days ? quote.days + " jours" : "Délai à confirmer"}</p><p>{quote.paymentTerms || "Conditions à convenir"}</p></div>
            </div>
            <label style={{ display: "block", marginTop: 14 }}>Statut administratif<select value={statusesById[item.id] || item.admin_status} onChange={e => setStatusesById(current => ({ ...current, [item.id]: e.target.value }))} style={{ display: "block", width: "100%", maxWidth: 420, padding: 10, marginTop: 6 }}>{statuses.map(s => <option value={s[0]} key={s[0]}>{s[1]}</option>)}</select></label>
            <label style={{ display: "block", marginTop: 12 }}>Note interne<textarea value={notes[item.id] ?? ""} maxLength={1200} onChange={e => setNotes(current => ({ ...current, [item.id]: e.target.value }))} rows={3} style={{ display: "block", width: "100%", padding: 10, marginTop: 6 }} /></label>
            <button className="button button-primary" disabled={busy} onClick={() => void save(item)} style={{ marginTop: 12 }}>Enregistrer le suivi</button>
          </article>;
        })}
      </div>
    </section>
  );
}
