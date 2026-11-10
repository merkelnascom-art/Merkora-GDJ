"use client";

import { useCallback, useEffect, useState } from "react";

type Launch = { id: string; request_id: string; required_amount: number; invoice_total_at_launch: number; confirmed_amount_at_launch: number; launch_message: string; launched_at: string };
type RequestItem = {
  id: string;
  project_id: string;
  project_title: string;
  admin_status: string;
  created_at: string;
  updated_at: string;
  payload?: { recordType?: string; version?: number; studio?: { reviewStatus?: string; reviewNote?: string }; officialDecision?: { status?: string; recordedAt?: string } };
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
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/client-requests", { cache: "no-store" });
      const data = await response.json().catch(() => ({})) as { requests?: RequestItem[]; launches?: Launch[]; error?: string };
      if (!response.ok) throw new Error(data.error || "Impossible de charger le suivi.");
      setItems(Array.isArray(data.requests) ? data.requests : []);
      setLaunches(Array.isArray(data.launches) ? data.launches : []);
      setLoaded(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Le suivi est indisponible.");
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    void load();
    const refreshAfterSubmission = () => { void load(); };
    window.addEventListener("merkora:request-sent", refreshAfterSubmission);
    const refreshTimer = window.setInterval(refreshAfterSubmission, 30_000);
    return () => {
      window.removeEventListener("merkora:request-sent", refreshAfterSubmission);
      window.clearInterval(refreshTimer);
    };
  }, [load]);

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
      {loaded && !error && ordinaryItems.length === 0 && mockupVersions.length === 0 && <p style={{ marginTop: 14, padding: 16, background: "#f8f7fb", borderRadius: 12, color: "#716c80" }}>Aucune demande envoyée depuis ce compte pour le moment. Les dossiers conservés uniquement sur cet appareil ne sont pas encore des demandes en ligne.</p>}
      {mockupVersions.length > 0 && <section style={{ marginTop: 18, padding: 16, background: "#fbfaff", border: "1px solid #e7e2f0", borderRadius: 14 }}>
        <div className="eyebrow">STUDIO & CONCEPT</div>
        <h3 style={{ margin: "6px 0" }}>Historique de vos validations</h3>
        <p style={{ color: "#716c80", fontSize: 13, lineHeight: 1.6 }}>Chaque envoi conserve la version exacte de votre maquette et votre décision. Une validation du concept ne vaut pas acceptation du devis.</p>
        <div style={{ display: "grid", gap: 10 }}>
          {mockupVersions.map((item) => {
            const decision = item.payload?.officialDecision;
            const status = decision?.status ?? item.payload?.studio?.reviewStatus;
            const title = status === "approved" && decision ? "Concept validé officiellement" : status === "changes_requested" ? "Modifications demandées" : decision ? "Version transmise à MerKora" : "Ancienne version de prototype";
            return <article key={item.id} style={{ padding: 12, background: "#fff", border: "1px solid #e7e2f0", borderRadius: 10 }}>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 8 }}>
                <strong>{item.project_title} · Version {item.payload?.version ?? "—"}</strong>
                <strong style={{ color: status === "approved" && decision ? "#176b45" : "#6e56a5" }}>{title}</strong>
              </div>
              {item.payload?.studio?.reviewNote && <p style={{ margin: "8px 0", whiteSpace: "pre-wrap" }}>Votre commentaire : {item.payload.studio.reviewNote}</p>}
              <p style={{ margin: "6px 0 0", color: "#716c80", fontSize: 12 }}>{decision?.recordedAt ? "Enregistré côté serveur le " + new Date(decision.recordedAt).toLocaleString("fr-FR") : "Enregistrement antérieur au parcours officiel."}</p>
            </article>;
          })}
        </div>
      </section>}
      <div style={{ display: "grid", gap: 12, marginTop: 14 }}>
        {ordinaryItems.map(item => {
          const launch = launches.find(entry => entry.request_id === item.id);
          const status = labels[item.admin_status] ?? { title: "Statut à vérifier", explanation: "Le statut de ce dossier doit être confirmé auprès de MerKora." };
          return (
            <article key={item.id} style={{ border: "1px solid #e7e2f0", borderRadius: 14, padding: 16 }}>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "start", justifyContent: "space-between", gap: 10 }}>
                <div><h3 style={{ margin: "0 0 6px" }}>{item.project_title}</h3><p style={{ margin: 0, color: "#716c80", fontSize: 13 }}>Référence : {item.project_id}</p></div>
                <strong style={{ color: launch ? "#176b45" : "#6e56a5" }}>{launch ? "Projet officiellement lancé" : status.title}</strong>
              </div>
              {launch ? (
                <div role="status" style={{ marginTop: 12, padding: 14, background: "#edf8f1", border: "1px solid #ccebd8", borderRadius: 12 }}>
                  <strong style={{ color: "#176b45" }}>Votre projet a officiellement commencé !</strong>
                  <p style={{ lineHeight: 1.6, margin: "8px 0" }}>{launch.launch_message}</p>
                  <p style={{ margin: 0, color: "#35694e", fontSize: 12 }}>Démarrage confirmé le {new Date(launch.launched_at).toLocaleString("fr-FR")} · Paiement confirmé à cette date : {Number(launch.confirmed_amount_at_launch).toLocaleString("fr-FR")} FCFA · Seuil requis : {Number(launch.required_amount).toLocaleString("fr-FR")} FCFA</p>
                </div>
              ) : <p style={{ lineHeight: 1.6, margin: "12px 0 8px" }}>{status.explanation}</p>}
              <p style={{ margin: "12px 0 0", color: "#716c80", fontSize: 12 }}>Envoyée le {new Date(item.created_at).toLocaleString("fr-FR")} · Mise à jour le {new Date(item.updated_at).toLocaleString("fr-FR")}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
