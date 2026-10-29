"use client";

import { useEffect, useState } from "react";
import type { Project } from "@/lib/project-types";
import type { Recommendation } from "@/lib/solution-recommendations";
import type { CompetitiveAnalysis, CompetitorInput } from "@/lib/competitive-analysis";
import { buildLocalAnalysis } from "@/lib/local-analysis";

type Improvement = {
  title: string;
  description: string;
  expectedBenefit: string;
  effort: "low" | "medium" | "high" | "unknown";
  priority: "high" | "medium" | "low";
  assumptions: string[];
};

type Analysis = {
  summary: string;
  domain: string;
  understood: string[];
  questions: string[];
  recommendations: Recommendation[];
  improvements: Improvement[];
  competitiveAnalysis: CompetitiveAnalysis;
  assumptions: string[];
  nextSteps: string[];
};

type Status = { enabled: boolean; model: string | null; message: string };
type Props = { project: Project; onApply: (recommendations: Recommendation[]) => void };
const emptyCompetitor: CompetitorInput = { name: "", url: "", offer: "", price: "", notes: "" };
const priorityLabel = { high: "Priorité haute", medium: "Priorité moyenne", low: "Priorité basse" };
const effortLabel = { low: "Faible", medium: "Moyen", high: "Élevé", unknown: "À estimer" };

export function AiProposalPanel({ project, onApply }: Props) {
  const [status, setStatus] = useState<Status | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [edited, setEdited] = useState<Recommendation[]>([]);
  const [improvements, setImprovements] = useState<Improvement[]>([]);
  const [competitors, setCompetitors] = useState<CompetitorInput[]>([]);
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
      if (!status?.enabled) {
        const local = buildLocalAnalysis(project, competitors.filter((item) => Object.values(item).some((value) => value.trim())));
        setAnalysis(local);
        setEdited(local.recommendations.map((item) => ({ ...item })));
        setImprovements(local.improvements.map((item) => ({ ...item, assumptions: [...item.assumptions] })));
        setMessage("Pré-analyse locale gratuite préparée. Aucun appel à un modèle IA n’a été effectué.");
        return;
      }
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
          competitors: competitors.filter((item) => Object.values(item).some((value) => value.trim())),
        }),
      });
      const data = await response.json() as { error?: string; analysis?: Analysis };
      if (!response.ok || !data.analysis) throw new Error(data.error || "L’analyse n’a pas abouti.");
      setAnalysis(data.analysis);
      setEdited(data.analysis.recommendations.map((item) => ({ ...item })));
      setImprovements(data.analysis.improvements.map((item) => ({ ...item, assumptions: [...item.assumptions] })));
      setMessage("Proposition générée. Relisez, modifiez, ajoutez ou retirez les pistes avant de les appliquer.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Le service IA est momentanément indisponible.");
    } finally {
      setBusy(false);
    }
  }

  function editRecommendation(index: number, field: keyof Recommendation, value: string) {
    setEdited((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item));
  }

  function addRecommendation() {
    setEdited((current) => [...current, { title: "", description: "", reason: "" }]);
  }

  function removeRecommendation(index: number) {
    setEdited((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  function editImprovement(index: number, field: "title" | "description" | "expectedBenefit", value: string) {
    setImprovements((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item));
  }

  function addImprovement() {
    setImprovements((current) => [...current, {
      title: "", description: "", expectedBenefit: "", effort: "unknown", priority: "medium", assumptions: [],
    }]);
  }

  function addImprovementToRecommendations(item: Improvement) {
    if (!item.title.trim() || !item.description.trim() || !item.expectedBenefit.trim()) {
      setError("Complétez le titre, la description et le bénéfice avant d’ajouter cette amélioration aux pistes.");
      return;
    }
    setEdited((current) => [...current, {
      title: item.title.trim(),
      description: item.description.trim(),
      reason: item.expectedBenefit.trim(),
    }]);
    setMessage("Amélioration ajoutée à la liste des pistes. Validez ensuite les pistes pour l’enregistrer au dossier.");
    setError("");
  }

  function updateCompetitor(index: number, field: keyof CompetitorInput, value: string) {
    setCompetitors((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item));
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
    setMessage("Vos pistes modifiées sont maintenant enregistrées dans ce dossier. Les autres dossiers restent inchangés.");
    setError("");
  }

  return (
    <section className="ai-proposal-panel" aria-labelledby="ai-proposal-title">
      <div className="ai-proposal-header">
        <div>
          <div className="eyebrow">ANALYSE INTELLIGENTE · AMÉLIORATION · CONCURRENCE</div>
          <h3 id="ai-proposal-title">Faire évoluer le projet avec méthode</h3>
          <p>Les propositions restent modifiables. Tu peux ajouter tes propres pistes et décider ce qui sera appliqué au dossier.</p>
        </div>
        <span className={`ai-state-pill ${status?.enabled ? "is-ready" : ""}`}>{status === null ? "Vérification…" : status.enabled ? "Connectable" : "En attente de configuration"}</span>
      </div>

      {status && <p className="ai-status-note">{status.message}{status.model ? ` Modèle : ${status.model}.` : ""}</p>}

      <div className="ai-list-block">
        <strong>Sources pour comparer la concurrence (facultatif)</strong>
        <p>Ajoute uniquement les informations que tu connais ou les sources que tu as consultées. Sans sources, MerKora prépare une méthode de recherche et ne prétend pas avoir vérifié le marché en direct.</p>
        {competitors.map((item, index) => (
          <article className="ai-edit-card" key={index}>
            <div className="ai-edit-card-top"><span>Concurrent ou alternative {index + 1}</span><button type="button" className="text-button ai-remove" onClick={() => setCompetitors((current) => current.filter((_, itemIndex) => itemIndex !== index))}>Retirer</button></div>
            <label>Nom<input value={item.name} maxLength={100} onChange={(event) => updateCompetitor(index, "name", event.target.value)} /></label>
            <label>Site ou source publique<input value={item.url} maxLength={240} placeholder="https://…" onChange={(event) => updateCompetitor(index, "url", event.target.value)} /></label>
            <label>Offre ou fonctionnalités observées<textarea value={item.offer} maxLength={500} rows={2} onChange={(event) => updateCompetitor(index, "offer", event.target.value)} /></label>
            <label>Prix constaté (si connu)<input value={item.price} maxLength={120} onChange={(event) => updateCompetitor(index, "price", event.target.value)} /></label>
            <label>Notes et date de vérification<textarea value={item.notes} maxLength={500} rows={2} onChange={(event) => updateCompetitor(index, "notes", event.target.value)} /></label>
          </article>
        ))}
        <button type="button" className="button button-quiet" onClick={() => setCompetitors((current) => current.length >= 5 ? current : [...current, { ...emptyCompetitor }])} disabled={competitors.length >= 5}>Ajouter une source ({competitors.length}/5)</button>
      </div>

      <div className="ai-proposal-actions">
        <button className="button button-primary" onClick={() => void analyze()} disabled={busy || status === null}>
          {busy ? "Analyse en cours…" : status?.enabled ? (analysis ? "Recommencer l’analyse IA" : "Analyser avec l’IA") : "Préparer une analyse locale gratuite"}
        </button>
        {!status?.enabled && <span>Mode local sans frais : aucune requête n’est envoyée à un fournisseur IA. Les résultats restent préliminaires.</span>}
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

          {analysis.understood.length > 0 && <div className="ai-list-block"><strong>Ce que l’analyse a compris</strong><ul>{analysis.understood.map((item, i) => <li key={i}>{item}</li>)}</ul></div>}
          {analysis.questions.length > 0 && <div className="ai-list-block"><strong>Questions à clarifier</strong><ul>{analysis.questions.map((item, i) => <li key={i}>{item}</li>)}</ul></div>}
          {analysis.assumptions.length > 0 && <div className="ai-list-block"><strong>Hypothèses à vérifier</strong><ul>{analysis.assumptions.map((item, i) => <li key={i}>{item}</li>)}</ul></div>}

          <div className="ai-edit-heading">
            <div><strong>Choisir, modifier ou ajouter des pistes</strong><p>Tu peux modifier les propositions de l’analyse, en retirer ou ajouter les tiennes.</p></div>
            <button type="button" className="button button-quiet" onClick={addRecommendation}>Ajouter une piste</button>
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

          <div className="ai-edit-heading"><div><strong>Pistes d’amélioration du projet</strong><p>Priorité, bénéfice attendu, effort et hypothèses. Une estimation inconnue reste indiquée comme telle.</p></div><button type="button" className="button button-quiet" onClick={addImprovement}>Ajouter une amélioration</button></div>
          <div className="ai-edit-list">
            {improvements.map((item, index) => (
              <article className="ai-edit-card" key={index}>
                <div className="ai-edit-card-top"><span>Amélioration {index + 1} · {priorityLabel[item.priority]}</span><button type="button" className="text-button ai-remove" onClick={() => setImprovements((current) => current.filter((_, itemIndex) => itemIndex !== index))}>Retirer</button></div>
                <label>Titre<input value={item.title} maxLength={100} onChange={(event) => editImprovement(index, "title", event.target.value)} /></label>
                <label>Description<textarea value={item.description} maxLength={500} rows={3} onChange={(event) => editImprovement(index, "description", event.target.value)} /></label>
                <label>Bénéfice attendu<textarea value={item.expectedBenefit} maxLength={260} rows={2} onChange={(event) => editImprovement(index, "expectedBenefit", event.target.value)} /></label>
                <p>Effort estimé : {effortLabel[item.effort]}. Hypothèses : {item.assumptions.length ? item.assumptions.join(" · ") : "Aucune précision fournie."}</p>
                <button type="button" className="button button-quiet" onClick={() => addImprovementToRecommendations(item)}>Ajouter aux pistes du dossier</button>
              </article>
            ))}
          </div>

          <div className="ai-list-block">
            <strong>Analyse concurrentielle</strong>
            <p>{analysis.competitiveAnalysis.researchStatus === "not_verified" ? "État : concurrence non vérifiée en direct." : "État : comparaison basée sur les informations fournies."}</p>
            <p>{analysis.competitiveAnalysis.summary}</p>
            {analysis.competitiveAnalysis.comparisonCriteria.length > 0 && <><strong>Critères de comparaison</strong><ul>{analysis.competitiveAnalysis.comparisonCriteria.map((item, i) => <li key={i}>{item}</li>)}</ul></>}
            {analysis.competitiveAnalysis.opportunities.length > 0 && <><strong>Occasions de différenciation à examiner</strong><ul>{analysis.competitiveAnalysis.opportunities.map((item, i) => <li key={i}>{item}</li>)}</ul></>}
            {analysis.competitiveAnalysis.unknowns.length > 0 && <><strong>Informations à vérifier</strong><ul>{analysis.competitiveAnalysis.unknowns.map((item, i) => <li key={i}>{item}</li>)}</ul></>}
            {analysis.competitiveAnalysis.nextSteps.length > 0 && <><strong>Prochaines recherches</strong><ul>{analysis.competitiveAnalysis.nextSteps.map((item, i) => <li key={i}>{item}</li>)}</ul></>}
          </div>

          {analysis.nextSteps.length > 0 && <div className="ai-list-block"><strong>Prochaines étapes suggérées</strong><ul>{analysis.nextSteps.map((item, i) => <li key={i}>{item}</li>)}</ul></div>}
          <div className="ai-apply-row"><button className="button button-primary" onClick={applyProposal}>Valider et appliquer ces pistes au dossier</button><span>Cette action remplace uniquement les pistes de ce dossier; les autres dossiers ne changent pas.</span></div>
        </div>
      )}
    </section>
  );
}
