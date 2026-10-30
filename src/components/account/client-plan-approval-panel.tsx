"use client";

import { useCallback, useEffect, useState } from "react";

type SavedPlan = {
  version: number;
  payload: {
    summary?: string;
    includedScope?: Array<{ id: string; title: string; description: string }>;
    openQuestions?: string[];
    acceptanceCriteria?: string[];
  };
  payload_digest: string;
  scope_digest: string;
};

export function ClientPlanApprovalPanel({ projectId }: { projectId: string }) {
  const [plan, setPlan] = useState<SavedPlan | null>(null);
  const [aiConsent, setAiConsent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/projects/${encodeURIComponent(projectId)}/plan/latest`, { cache: "no-store" });
      const result = await response.json() as { plan?: SavedPlan | null; error?: string };
      if (!response.ok) {
        if (response.status === 401 || response.status === 404) {
          setPlan(null);
          return;
        }
        throw new Error(result.error || "Le plan enregistré est indisponible.");
      }
      setPlan(result.plan ?? null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Impossible de charger le plan.");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => { void load(); }, [load]);

  async function approve() {
    if (!plan) return;
    if (!window.confirm("Confirmez-vous le périmètre du plan ? Votre choix concernant l'IA externe sera enregistré séparément.")) return;
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch(`/api/projects/${encodeURIComponent(projectId)}/approvals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planVersion: plan.version,
          approvalKind: "client_scope",
          decision: "approved",
          comment: "Périmètre confirmé par le client.",
          requestId: crypto.randomUUID(),
          aiProcessingConsent: aiConsent,
        }),
      });
      const result = await response.json() as { error?: string; aiProcessingConsent?: boolean };
      if (!response.ok) throw new Error(result.error || "La validation n'a pas été enregistrée.");
      setMessage(aiConsent
        ? "Périmètre confirmé. Vous avez aussi autorisé l'envoi de ce dossier à l'IA externe lors d'une étape ultérieure, après confirmation de dépense par l'administration."
        : "Périmètre confirmé. Aucun envoi de votre dossier à un modèle IA externe n'est autorisé.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "La validation n'a pas été enregistrée.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="panel" aria-labelledby="client-plan-approval-title" style={{ marginTop: 18, padding: 22, border: "1px solid #e7e2f0", borderRadius: 18, background: "#fff" }}>
      <div className="eyebrow">VALIDATION CLIENT · PÉRIMÈTRE</div>
      <h3 id="client-plan-approval-title" style={{ margin: "8px 0" }}>Confirmer le plan enregistré</h3>
      {loading ? <p style={{ color: "#716c80" }}>Recherche du dernier plan enregistré…</p> : null}
      {!loading && !plan && !error ? <p style={{ color: "#716c80", fontSize: 13 }}>Aucun plan enregistré pour ce projet. L'administration doit d'abord enregistrer une version à examiner.</p> : null}
      {error ? <p role="alert" style={{ color: "#b42318" }}>{error}</p> : null}
      {plan ? (
        <>
          <p style={{ color: "#716c80", fontSize: 13 }}>Version {plan.version} · {plan.payload.summary || "Plan de réalisation"}</p>
          <ul>{(plan.payload.includedScope ?? []).map(item => <li key={item.id}><strong>{item.title}</strong>{item.description ? ` — ${item.description}` : ""}</li>)}</ul>
          {(plan.payload.openQuestions?.length ?? 0) > 0 ? (
            <p style={{ color: "#9a6700", fontSize: 13 }}>Des questions restent à clarifier. Demandez leur résolution avant de confirmer ce périmètre.</p>
          ) : (
            <>
              <label style={{ display: "flex", alignItems: "flex-start", gap: 10, marginTop: 16, fontSize: 13, lineHeight: 1.6 }}>
                <input type="checkbox" checked={aiConsent} onChange={event => setAiConsent(event.target.checked)} style={{ marginTop: 4 }} />
                <span>J'autorise MerKora à transmettre le dossier de ce projet et le code généré à un fournisseur IA externe afin de proposer une implémentation métier. Je comprends que cette étape pourra consommer des crédits et nécessitera encore une confirmation de dépense par l'administration.</span>
              </label>
              <p style={{ color: "#716c80", fontSize: 12, lineHeight: 1.5 }}>Si cette case reste décochée, votre plan peut être confirmé, mais aucun envoi à un modèle IA externe ne sera autorisé.</p>
              <button type="button" className="button button-primary" disabled={saving} onClick={() => void approve()}>
                {saving ? "Enregistrement…" : "Confirmer le périmètre"}
              </button>
            </>
          )}
        </>
      ) : null}
      {message ? <p role="status" style={{ color: "#176b45", fontSize: 13, lineHeight: 1.6 }}>{message}</p> : null}
      <button type="button" className="button button-quiet" onClick={() => void load()} style={{ marginTop: 12 }}>Actualiser le plan</button>
    </section>
  );
}
