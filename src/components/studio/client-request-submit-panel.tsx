"use client";

import { useEffect, useState } from "react";
import type { Project } from "@/lib/project-types";
import { submitClientRequest } from "@/lib/client-request-submission";

type Props = { project: Project };
type SavedStudio = {
  format?: string; formatConfirmed?: boolean; solutionFormat?: string | null; palette?: string; enabledModules?: string[]; selectedRecommendationIds?: string[]; conceptValidation?: unknown;
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
      const legacyDisplayChoice = saved.solutionFormat === undefined && ["website", "mobile", "dashboard"].includes(saved.format ?? "");
      const displayFormatConfirmed = saved.formatConfirmed === true || legacyDisplayChoice;
      const successMessage = await submitClientRequest(project, {
        project: {
          id: project.id, title: project.title, category: project.category,
          problem: project.problem, desiredOutcome: project.desiredOutcome,
          budget: project.budget, urgency: project.urgency,
          recommendations: project.recommendations,
        },
        studio: {
          format: displayFormatConfirmed ? saved.format : null,
          formatConfirmed: displayFormatConfirmed,
          solutionFormat: ["human", "organizational", "documentary", "physical", "digital", "hybrid"].includes(saved.solutionFormat ?? "") ? saved.solutionFormat : legacyDisplayChoice ? "digital" : null,
          palette: ["violet", "blue", "emerald", "amber"].includes(saved.palette ?? "") ? saved.palette : "violet",
          enabledModules: Array.isArray(saved.enabledModules) ? saved.enabledModules.slice(0, 40) : [],
          selectedRecommendationIds: Array.isArray(saved.selectedRecommendationIds) ? saved.selectedRecommendationIds.slice(0, 40) : [],
          conceptValidation: saved.conceptValidation && typeof saved.conceptValidation === "object" ? saved.conceptValidation : null,
        },
      });
      setMessage(successMessage);
      window.dispatchEvent(new Event("merkora:request-sent"));
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
        Connectez-vous d’abord à votre compte. MerKora enregistrera automatiquement ce projet dans votre espace client avant de transmettre le besoin, les choix du studio et votre réponse à l’administration. L’envoi ne remplace pas la vérification humaine d’un devis ou d’un accord.
      </p>
      <button className="button button-primary" disabled={busy} onClick={sendRequest}>{busy ? "Transmission en cours…" : "Envoyer ma demande à MerKora →"}</button>
      {message && <p role="status" style={{ color: "#176b45", marginTop: 12 }}>{message}</p>}
      {error && <p role="alert" style={{ color: "#b42318", marginTop: 12 }}>{error}</p>}
    </section>
  );
}
