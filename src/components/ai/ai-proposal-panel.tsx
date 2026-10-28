"use client";

import { useEffect, useState } from "react";
import type { Project } from "@/lib/project-types";
import type { Recommendation } from "@/lib/solution-recommendations";

type Analysis = {
  summary: string;
  domain: string;
  understood: string[];
  questions: string[];
  recommendations: Recommendation[];
  assumptions: string[];
  nextSteps: string[];
};

type Status = {
  enabled: boolean;
  model: string | null;
  message: string;
};

type Props = {
  project: Project;
  onApply: (recommendations: Recommendation[]) => void;
};

export function AiProposalPanel({ project, onApply }: Props) {
  const [status, setStatus] = useState<Status | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [edited, setEdited] = useState<Recommendation[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/ai/status", { cache: "no-store" })
      .then(async (response) => await response.json() as Status)
      .then((data) => { if (active) setStatus(data); })
      .catch(() => { if (active) setStatus({ enabled: false, model: null, message: "État du service IA indisponible." }); });
    return () => { active = false; };
  }, []);

  async function analyze() {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: project.title,
          category: project.category,
          problem: project.problem,
          desiredOutcome: project.desiredOutcome,
          budget: project.budget,
          urgency: project.urgency,
        }),
      });
      const data = await response.json() as { error?: string; analysis?: Analysis };
      if (!response.ok || !data.analysis) throw new Error(data.error || "L’analyse n’a pas abouti.");
      setAnalysis(data.analysis);
      setEdited(data.analysis.recommendations.map((item) => ({ ...item })));
      setMessage("Proposition générée. Relisez et modifiez chaque piste avant de l’appliquer au dossier.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Le service IA est momentanément indisponible.");
    } finally {
      setBusy(false);
    }
  }

  function editRecommendation(index: number, field: keyof Recommendation, value: string) {
    setEdited((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item));
  }

  function removeRecommendation(index: number) {
    setEdited((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  function applyProposal() {
    const cleaned = edited.map((item) => ({
      title: item.title.trim(),
      description: item.description.trim(),
      reason: item.reason.trim(),
    })).filter((item) => item.title && item.description && item.reason);
    if (cleaned.length === 0) {
      setError("Conservez au moins une piste complète avant de l’appliquer.");
      return;
    }
    onApply(cleaned);
    setMessage("Vos pistes modifiées sont maintenant enregistrées dans ce dossier. Vous pourrez encore les modifier en relançant une analyse.");
    setError("");
  }

  return (
    <section className="ai-proposal-panel" aria-labelledby="ai-proposal-title">
      <div className="ai-proposal-header">
        <div>
          <div className="eyebrow">ANALYSE INTELLIGENTE · ÉTAPE SUIVANTE</div>
          <h3 id="ai-proposal-title">Affiner les pistes avec l’IA</h3>
          <p>L’IA proposera plusieurs directions, les questions qui manquent et les prochaines étapes. Tu gardes le contrôle : rien n’est appliqué avant ta validation.</p>
        </div>
        <span className={`ai-state-pill ${status?.enabled ? "is-ready" : ""}`}>{status === null ? "Vérification…" : status.enabled ? "Connectable" : "En attente de configuration"}</span>
      </div>

      {status && <p className="ai-status-note">{status.message}{status.model ? ` Modèle : ${status.model}.` : ""}</p>}
      <div className="ai-proposal-actions">
        <button className="button button-primary" onClick={() => void analyze()} disabled={busy || !status?.enabled}>
          {busy ? "Analyse en cours…" : analysis ? "Recommencer l’analyse" : "Analyser ce besoin"}
        </button>
        {!status?.enabled && <span>L’analyse est désactivée pour éviter tout appel facturable avant configuration explicite.</span>}
      </div>

      {error && <p className="ai-feedback is-error" role="alert">{error}</p>}
      {message && <p className="ai-feedback" role="status">{message}</p>}

      {analysis && (
        <div className="ai-analysis-result">
          <div className="ai-summary-card">
            <span className="detail-label">SYNTHÈSE PROPOSÉE</span>
            <h4>{analysis.domain || "Domaine à confirmer"}</h4>
            <p>{analysis.summary}</p>
          </div>

          {analysis.understood.length > 0 && <div className="ai-list-block"><strong>Ce que l’IA a compris</strong><ul>{analysis.understood.map((item, i) => <li key={i}>{item}</li>)}</ul></div>}
          {analysis.questions.length > 0 && <div className="ai-list-block"><strong>Questions à clarifier</strong><ul>{analysis.questions.map((item, i) => <li key={i}>{item}</li>)}</ul></div>}
          {analysis.assumptions.length > 0 && <div className="ai-list-block"><strong>Hypothèses à vérifier</strong><ul>{analysis.assumptions.map((item, i) => <li key={i}>{item}</li>)}</ul></div>}

          <div className="ai-edit-heading">
            <div><strong>Modifier la proposition avant validation</strong><p>Change le titre, le contenu ou la raison; supprime une piste qui ne te convient pas.</p></div>
          </div>
          <div className="ai-edit-list">
            {edited.map((item, index) => (
              <article className="ai-edit-card" key={index}>
                <div className="ai-edit-card-top"><span>Piste {String(index + 1).padStart(2, "0")}</span><button type="button" className="text-button ai-remove" onClick={() => removeRecommendation(index)}>Retirer</button></div>
                <label>Titre<input value={item.title} maxLength={100} onChange={(event) => editRecommendation(index, "title", event.target.value)} /></label>
                <label>Proposition<textarea value={item.description} maxLength={500} rows={3} onChange={(event) => editRecommendation(index, "description", event.target.value)} /></label>
                <label>Pourquoi cette piste ?<textarea value={item.reason} maxLength={350} rows={2} onChange={(event) => editRecommendation(index, "reason", event.target.value)} /></label>
              </article>
            ))}
          </div>
          {analysis.nextSteps.length > 0 && <div className="ai-list-block"><strong>Prochaines étapes suggérées</strong><ul>{analysis.nextSteps.map((item, i) => <li key={i}>{item}</li>)}</ul></div>}
          <div className="ai-apply-row"><button className="button button-primary" onClick={applyProposal}>Valider et appliquer ces pistes au dossier</button><span>Cette action remplace les pistes actuelles de ce dossier; les autres dossiers ne changent pas.</span></div>
        </div>
      )}
    </section>
  );
}
