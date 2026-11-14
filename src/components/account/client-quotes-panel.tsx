"use client";

import { useCallback, useEffect, useState } from "react";

type QuoteVersion = {
  id: string; quote_id: string; version_number: number; snapshot: Record<string, unknown>;
  currency: string; total_amount: number; valid_until: string; published_at: string; created_at: string;
};
type Decision = { id: string; quote_version_id: string; decision: string; message: string; created_at: string };
const decisionLabels: Record<string, string> = {
  accepted: "Accord sur cette version", declined: "Devis refusé",
  changes_requested: "Modifications demandées", negotiation: "Souhaite négocier",
};

export function ClientQuotesPanel() {
  const [versions, setVersions] = useState<QuoteVersion[]>([]);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [messages, setMessages] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    setError("");
    try {
      const response = await fetch("/api/client-quotes", { cache: "no-store" });
      const data = await response.json() as { versions?: QuoteVersion[]; decisions?: Decision[]; error?: string };
      if (!response.ok) throw new Error(data.error || "Impossible de charger vos devis.");
      setVersions(data.versions || []);
      setDecisions(data.decisions || []);
      setLoaded(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Le service de devis est indisponible.");
    }
  }, []);

  useEffect(() => { void load(); window.addEventListener("merkora:quote-updated", load); return () => window.removeEventListener("merkora:quote-updated", load); }, [load]);

  async function decide(versionId: string, decision: string) {
    setBusyId(versionId); setError(""); setNotice("");
    try {
      const response = await fetch("/api/client-quotes", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ versionId, decision, message: messages[versionId] || "" }),
      });
      const data = await response.json() as { error?: string; message?: string };
      if (!response.ok) throw new Error(data.error || "Votre réponse n’a pas été enregistrée.");
      setNotice(data.message || "Votre réponse a été enregistrée.");
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Votre réponse n’a pas été enregistrée.");
    } finally { setBusyId(""); }
  }

  const money = (value: unknown) => Number(value || 0).toLocaleString("fr-FR") + " FCFA";
  const today = new Date().toISOString().slice(0, 10);

  return (
    <section className="panel" style={{ maxWidth: 1100, margin: "18px auto 0", padding: 22, border: "1px solid #e7e2f0", borderRadius: 18, background: "#fff" }}>
      <div className="eyebrow">DEVIS OFFICIELS · ESPACE CLIENT</div>
      <h2 style={{ margin: "8px 0" }}>Mes devis et validations</h2>
      <p style={{ color: "#716c80", fontSize: 14, lineHeight: 1.6 }}>Seules les versions publiées par l’administration apparaissent ici. Votre réponse porte sur une version précise. Elle ne confirme pas le paiement et ne lance pas automatiquement la réalisation.</p>
      {error && <p role="alert" style={{ color: "#b42318", background: "#fff2f0", padding: 12, borderRadius: 10 }}>{error}</p>}
      {notice && <p role="status" style={{ color: "#176b45", background: "#effaf4", padding: 12, borderRadius: 10 }}>{notice}</p>}
      {loaded && !error && versions.length === 0 && <p style={{ padding: 16, background: "#f8f7fb", borderRadius: 12, color: "#716c80" }}>Aucun devis publié pour ce compte pour le moment.</p>}
      <div style={{ display: "grid", gap: 14 }}>
        {versions.map(version => {
          const quote = version.snapshot || {};
          const previousDecisions = decisions.filter(item => item.quote_version_id === version.id);
          const alreadyDecided = previousDecisions.length > 0;
          const isExpired = version.valid_until < today;
          const lines = Array.isArray(quote.lines) ? quote.lines as Array<Record<string, unknown>> : [];
          const recurring = Array.isArray(quote.recurringLines) ? quote.recurringLines as Array<Record<string, unknown>> : [];
          return <article key={version.id} style={{ border: "1px solid #e7e2f0", borderRadius: 16, padding: 18 }}>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 10 }}>
              <div><h3 style={{ margin: "0 0 6px" }}>{String(quote.title || "Devis MerKora")} · v{version.version_number}</h3><p style={{ margin: 0, color: "#716c80", fontSize: 13 }}>Référence projet : {String(quote.projectId || "—")} · Publié le {new Date(version.published_at).toLocaleDateString("fr-FR")}</p></div>
              <strong style={{ color: isExpired ? "#b42318" : "#176b45" }}>{isExpired ? "Validité expirée" : "Valide jusqu’au " + new Date(version.valid_until + "T12:00:00").toLocaleDateString("fr-FR")}</strong>
            </div>
            <div style={{ marginTop: 16, padding: 18, background: "#f8f7fb", borderRadius: 12 }}>
              <div style={{ color: "#716c80", fontSize: 12 }}>TOTAL PONCTUEL + RÉCURRENT (une période)</div>
              <strong style={{ fontSize: 28 }}>{money(version.total_amount)}</strong>
              <p style={{ margin: "6px 0 0", color: "#716c80", fontSize: 12 }}>Les abonnements éventuels sont facturés par période selon les conditions indiquées.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 14, marginTop: 16 }}>
              <div><strong>Prestations ponctuelles</strong>{lines.map((line, index) => <p key={String(line.id || index)}>{String(line.description || "Prestation")} · {money(line.unitPriceMinor)}</p>)}</div>
              {recurring.length > 0 && <div><strong>Prestations récurrentes</strong>{recurring.map((line, index) => <p key={String(line.id || index)}>{String(line.description || "Abonnement")} · {money(line.unitPriceMinor)} / période</p>)}</div>}
              <div><strong>Périmètre inclus</strong><p style={{ whiteSpace: "pre-wrap" }}>{String(quote.scope || "À confirmer")}</p></div>
              <div><strong>Exclusions</strong><p style={{ whiteSpace: "pre-wrap" }}>{String(quote.exclusions || "À confirmer")}</p></div>
              <div><strong>Conditions de paiement</strong><p style={{ whiteSpace: "pre-wrap" }}>{String(quote.paymentTerms || "À convenir")}</p></div>
              <div><strong>Hypothèses</strong><p style={{ whiteSpace: "pre-wrap" }}>{Array.isArray(quote.assumptions) && quote.assumptions.length ? (quote.assumptions as string[]).join("\n") : "Aucune hypothèse renseignée."}</p></div>
            </div>
            {previousDecisions.length > 0 && <div style={{ marginTop: 14, padding: 12, background: "#f8f7fb", borderRadius: 10 }}>
              <strong>Votre historique de réponse pour cette version</strong>
              {previousDecisions.map(item => <p key={item.id} style={{ margin: "6px 0", fontSize: 13 }}>{decisionLabels[item.decision] || item.decision}{item.message ? " — " + item.message : ""} · {new Date(item.created_at).toLocaleString("fr-FR")}</p>)}
            </div>}
            {alreadyDecided ? <p style={{ color: "#716c80", fontSize: 13, marginBottom: 0 }}>Une réponse est déjà enregistrée pour cette version. Si les conditions changent, attendez une nouvelle version du devis.</p> : <div style={{ marginTop: 16 }}>
              <label style={{ display: "block", fontWeight: 700, fontSize: 13 }}>Commentaire (facultatif)<textarea value={messages[version.id] || ""} maxLength={2000} rows={2} onChange={event => setMessages(current => ({ ...current, [version.id]: event.target.value }))} style={{ display: "block", width: "100%", boxSizing: "border-box", padding: 10, marginTop: 6, border: "1px solid #ded8ea", borderRadius: 9 }} /></label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                <button className="button button-primary" disabled={busyId === version.id || isExpired} onClick={() => {
                  if (window.confirm("Confirmez-vous votre accord sur cette version du devis ? Cela ne vaut ni paiement ni démarrage du projet.")) void decide(version.id, "accepted");
                }}>Accepter ce devis</button>
                <button className="button button-quiet" disabled={busyId === version.id || isExpired} onClick={() => void decide(version.id, "negotiation")}>Discuter du prix</button>
                <button className="button button-quiet" disabled={busyId === version.id || isExpired} onClick={() => void decide(version.id, "changes_requested")}>Demander des changements</button>
                <button className="button button-quiet" disabled={busyId === version.id || isExpired} onClick={() => {
                  if (window.confirm("Confirmez-vous le refus de ce devis ?")) void decide(version.id, "declined");
                }}>Refuser</button>
              </div>
            </div>}
          </article>;
        })}
      </div>
      <button className="button button-quiet" onClick={() => void load()} style={{ marginTop: 14 }}>Actualiser les devis ↻</button>
    </section>
  );
}
