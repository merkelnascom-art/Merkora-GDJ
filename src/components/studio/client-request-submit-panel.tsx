"use client";

import { useEffect, useState } from "react";
import type { Project } from "@/lib/project-types";

type Props = { project: Project };
type SavedStudio = {
  format?: string; palette?: string; enabledModules?: string[]; selectedRecommendationIds?: string[];
  reviewStatus?: string; reviewNote?: string; quoteAmount?: string; quoteDays?: string;
  quotePaymentTerms?: string; clientQuoteResponse?: string; clientQuoteNote?: string;
};

export function ClientRequestSubmitPanel({ project }: Props) {
  const [saved, setSaved] = useState<SavedStudio>({});
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(`merkora-gdj-mockup-v1:${project.id}`);
      if (raw) setSaved(JSON.parse(raw) as SavedStudio);
    } catch {
      // Defaults remain safe when the local studio state is unavailable.
    } finally {
      setReady(true);
    }
  }, [project.id]);

  async function sendRequest() {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/client-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project: {
            id: project.id, title: project.title, category: project.category,
            problem: project.problem, desiredOutcome: project.desiredOutcome,
            budget: project.budget, urgency: project.urgency,
            recommendations: project.recommendations,
          },
          studio: {
            format: ["website", "mobile", "dashboard"].includes(saved.format ?? "") ? saved.format : "website",
            palette: ["violet", "blue", "emerald", "amber"].includes(saved.palette ?? "") ? saved.palette : "violet",
            enabledModules: Array.isArray(saved.enabledModules) ? saved.enabledModules.slice(0, 40) : [],
            selectedRecommendationIds: Array.isArray(saved.selectedRecommendationIds) ? saved.selectedRecommendationIds.slice(0, 40) : [],
            reviewStatus: ["draft", "changes_requested", "approved"].includes(saved.reviewStatus ?? "") ? saved.reviewStatus : "draft",
            reviewNote: typeof saved.reviewNote === "string" ? saved.reviewNote.slice(0, 1200) : "",
          },
          quote: {
            amount: typeof saved.quoteAmount === "string" ? saved.quoteAmount.slice(0, 40) : "",
            days: typeof saved.quoteDays === "string" ? saved.quoteDays.slice(0, 20) : "",
            paymentTerms: typeof saved.quotePaymentTerms === "string" ? saved.quotePaymentTerms.slice(0, 500) : "",
          },
          clientResponse: {
            choice: ["undecided", "accepted", "changes_requested", "negotiate"].includes(saved.clientQuoteResponse ?? "") ? saved.clientQuoteResponse : "undecided",
            comment: typeof saved.clientQuoteNote === "string" ? saved.clientQuoteNote.slice(0, 1200) : "",
          },
        }),
      });
      const data = await response.json().catch(() => ({})) as { error?: string; message?: string };
      if (!response.ok) throw new Error(data.error || "La demande n’a pas pu être envoyée.");
      setMessage(data.message || "Demande transmise à MerKora.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "La demande n’a pas pu être envoyée.");
    } finally {
      setBusy(false);
    }
  }

  if (!ready) return null;

  return (
    <section className="panel" style={{ marginTop: 20, padding: 24, border: "1px solid #ddd5ff", borderRadius: 18, background: "#fbfaff" }}>
      <div className="eyebrow">TRANSMISSION EN LIGNE</div>
      <h3 style={{ margin: "8px 0" }}>Envoyer ce dossier à MerKora</h3>
      <p style={{ color: "#716c80", lineHeight: 1.65, fontSize: 14 }}>
        Cette action transmet le besoin, les choix du studio, le brouillon de proposition et votre réponse au serveur central. Connectez-vous d’abord à votre compte. L’envoi en ligne ne remplace pas la vérification humaine d’un devis ou d’un accord.
      </p>
      <button className="button button-primary" disabled={busy} onClick={sendRequest}>{busy ? "Transmission en cours…" : "Envoyer ma demande à MerKora →"}</button>
      {message && <p role="status" style={{ color: "#176b45", marginTop: 12 }}>{message}</p>}
      {error && <p role="alert" style={{ color: "#b42318", marginTop: 12 }}>{error}</p>}
    </section>
  );
}
