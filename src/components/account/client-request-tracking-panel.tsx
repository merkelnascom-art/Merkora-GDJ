"use client";

import { useCallback, useEffect, useState } from "react";

type RequestItem = {
  id: string;
  project_id: string;
  project_title: string;
  admin_status: string;
  created_at: string;
  updated_at: string;
};

const labels: Record<string, { title: string; explanation: string }> = {
  to_review: { title: "Reçue · à examiner", explanation: "MerKora a reçu votre dossier. L’équipe doit encore l’examiner." },
  verified: { title: "Dossier vérifié", explanation: "Les premières vérifications du dossier ont été effectuées." },
  changes_requested: { title: "Précisions nécessaires", explanation: "Des ajustements ou informations complémentaires sont nécessaires. Contactez MerKora pour connaître les détails." },
  negotiation: { title: "Discussion en cours", explanation: "Les conditions ou le périmètre du projet sont en discussion." },
  accepted: { title: "Dossier accepté", explanation: "L’administration a marqué le dossier comme accepté. Cela ne remplace pas un contrat ou un accord de paiement." },
  in_progress: { title: "Réalisation en cours", explanation: "Le projet est indiqué comme étant en cours de réalisation." },
  delivered: { title: "Livré", explanation: "Le dossier est marqué comme livré. Vérifiez les éléments remis avec MerKora." },
  rejected: { title: "Dossier clôturé", explanation: "Le dossier a été clôturé par l’administration. Contactez MerKora si vous souhaitez en discuter." },
};

export function ClientRequestTrackingPanel() {
  const [items, setItems] = useState<RequestItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/client-requests", { cache: "no-store" });
      const data = await response.json().catch(() => ({})) as { requests?: RequestItem[]; error?: string };
      if (!response.ok) throw new Error(data.error || "Impossible de charger le suivi.");
      setItems(Array.isArray(data.requests) ? data.requests : []);
      setLoaded(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Le suivi est indisponible.");
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  return (
    <section className="panel" style={{ maxWidth: 1100, margin: "18px auto 0", padding: 22, border: "1px solid #e7e2f0", borderRadius: 18, background: "#fff" }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <div>
          <div className="eyebrow">SUIVI EN LIGNE</div>
          <h2 style={{ margin: "8px 0" }}>Mes demandes envoyées</h2>
          <p style={{ color: "#716c80", fontSize: 14, margin: 0 }}>Retrouvez ici les dossiers transmis à MerKora et leur état d’avancement.</p>
        </div>
        <button className="button button-quiet" onClick={() => void load()} disabled={busy}>{busy ? "Actualisation…" : "Actualiser ↻"}</button>
      </div>
      {error && <p role="alert" style={{ marginTop: 14, color: "#b42318", background: "#fff2f0", padding: 12, borderRadius: 10 }}>{error}</p>}
      {loaded && !error && items.length === 0 && <p style={{ marginTop: 14, padding: 16, background: "#f8f7fb", borderRadius: 12, color: "#716c80" }}>Aucune demande envoyée depuis ce compte pour le moment. Les dossiers conservés uniquement sur cet appareil ne sont pas encore des demandes en ligne.</p>}
      <div style={{ display: "grid", gap: 12, marginTop: 14 }}>
        {items.map(item => {
          const status = labels[item.admin_status] ?? { title: "Statut à vérifier", explanation: "Le statut de ce dossier doit être confirmé auprès de MerKora." };
          return (
            <article key={item.id} style={{ border: "1px solid #e7e2f0", borderRadius: 14, padding: 16 }}>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "start", justifyContent: "space-between", gap: 10 }}>
                <div><h3 style={{ margin: "0 0 6px" }}>{item.project_title}</h3><p style={{ margin: 0, color: "#716c80", fontSize: 13 }}>Référence : {item.project_id}</p></div>
                <strong style={{ color: "#6e56a5" }}>{status.title}</strong>
              </div>
              <p style={{ lineHeight: 1.6, margin: "12px 0 8px" }}>{status.explanation}</p>
              <p style={{ margin: 0, color: "#716c80", fontSize: 12 }}>Envoyée le {new Date(item.created_at).toLocaleString("fr-FR")} · Mise à jour le {new Date(item.updated_at).toLocaleString("fr-FR")}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
