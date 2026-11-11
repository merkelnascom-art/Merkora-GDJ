"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Recommendation = { id?: string; title: string; description: string; reason?: string };
type ProjectRequest = {
  id: string;
  user_id: string;
  project_id: string;
  project_title: string;
  payload: {
    project?: { title?: string; problem?: string; desiredOutcome?: string; recommendations?: Recommendation[] };
    studio?: { selectedRecommendationIds?: string[]; format?: string; palette?: string };
  };
};
type SavedPlan = {
  version: number;
  payload: {
    summary?: string;
    includedScope?: Array<{ id: string; title: string; description: string }>;
    tasks?: Array<{ id: string; title: string; purpose: string; deliverable: string; acceptanceCriteria: string[]; priority: string }>;
    milestones?: Array<{ id: string; title: string; taskIds: string[] }>;
    assumptions?: string[];
    openQuestions?: string[];
  };
  payload_digest: string;
  scope_digest: string;
};
type Approval = { approval_kind: string; decision: string };
type QueueItem = {
  launch: { id: string; request_id: string; launched_at: string; confirmed_amount_at_launch: number };
  request: ProjectRequest;
  plan: SavedPlan | null;
  approvals: Approval[];
};

const approvalLabels: Record<string, string> = {
  admin_review: "Revue du plan par l'administration",
  execution_authorization: "Autorisation interne d'exécution",
};
const slugify = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function AdminFactoryPlanningPanel() {
  const router = useRouter();
  const [items, setItems] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/factory/planning", { cache: "no-store" });
      const result = await response.json().catch(() => ({})) as { projects?: QueueItem[]; error?: string };
      if (!response.ok) throw new Error(result.error || "Impossible de charger la file de planification.");
      setItems(Array.isArray(result.projects) ? result.projects : []);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "La file de planification est indisponible.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  function selectedOptions(request: ProjectRequest) {
    const selected = new Set(request.payload.studio?.selectedRecommendationIds ?? []);
    return (request.payload.project?.recommendations ?? []).flatMap((recommendation) => {
      const id = recommendation.id || slugify(recommendation.title);
      return selected.has(id) ? [{ id, title: recommendation.title, description: recommendation.description }] : [];
    });
  }

  async function generate(item: QueueItem) {
    setBusy(item.request.project_id);
    setError(""); setMessage("");
    try {
      const response = await fetch("/api/admin/projects/" + encodeURIComponent(item.request.project_id) + "/plan/versions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plannerVersion: "merkora-admin-planner-v2", requestId: item.request.id }),
      });
      const result = await response.json().catch(() => ({})) as { error?: string; planVersion?: number };
      if (!response.ok) throw new Error(result.error || "Le plan interne n'a pas pu être généré.");
      setMessage("Plan interne v" + result.planVersion + " enregistré. Aucun worker ni service payant n'a été lancé.");
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "La génération du plan a échoué.");
    } finally {
      setBusy(null);
    }
  }

  async function approve(item: QueueItem, approvalKind: "admin_review" | "execution_authorization") {
    if (!item.plan) return;
    setBusy(item.request.project_id);
    setError(""); setMessage("");
    try {
      const response = await fetch("/api/projects/" + encodeURIComponent(item.request.project_id) + "/approvals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planVersion: item.plan.version,
          approvalKind,
          decision: "approved",
          comment: approvalKind === "admin_review" ? "Plan interne examiné et validé par l'administration." : "Exécution autorisée par l'administration.",
          requestId: crypto.randomUUID(),
        }),
      });
      const result = await response.json().catch(() => ({})) as { error?: string };
      if (!response.ok) throw new Error(result.error || "La validation interne n'a pas été enregistrée.");
      setMessage(approvalLabels[approvalKind] + " : validation enregistrée.");
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "La validation interne a échoué.");
    } finally {
      setBusy(null);
    }
  }

  async function prepareJob(item: QueueItem) {
    if (!item.plan) return;
    setBusy(item.request.project_id);
    setError(""); setMessage("");
    try {
      const response = await fetch("/api/admin/projects/" + encodeURIComponent(item.request.project_id) + "/factory/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planVersion: item.plan.version, correlationId: crypto.randomUUID() }),
      });
      const result = await response.json().catch(() => ({})) as { error?: string; message?: string; taskCount?: number };
      if (!response.ok) throw new Error(result.error || "Le travail n'a pas pu être préparé.");
      setMessage(result.message || "Travail préparé avec " + result.taskCount + " étapes. Aucun worker n'a démarré.");
      await load();
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "La préparation du travail a échoué.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <section style={styles.panel}>
      <div style={styles.header}>
        <div>
          <div style={styles.eyebrow}>PLANIFICATION INTERNE · ADMINISTRATION</div>
          <h2 style={styles.title}>Projets lancés · à planifier</h2>
          <p style={styles.description}>Le client a validé son besoin, ses maquettes et son devis. MerKora prépare ici le plan interne ; l'administrateur le contrôle et autorise l'exécution.</p>
        </div>
        <button type="button" style={styles.secondaryButton} onClick={() => void load()} disabled={loading}>{loading ? "Actualisation…" : "Actualiser"}</button>
      </div>
      {error ? <p role="alert" style={styles.error}>{error}</p> : null}
      {message ? <p role="status" style={styles.success}>{message}</p> : null}
      {!loading && items.length === 0 ? <p style={styles.empty}>Aucun lancement officiel en attente de planification.</p> : null}
      <div style={styles.list}>
        {items.map((item) => {
          const project = item.request.payload.project ?? {};
          const chosen = selectedOptions(item.request);
          const plan = item.plan;
          const hasApproval = (kind: string) => item.approvals.some((approval) => approval.approval_kind === kind && approval.decision === "approved");
          const busyThis = busy === item.request.project_id;
          return (
            <article key={item.launch.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <h3 style={styles.projectTitle}>{project.title || item.request.project_title}</h3>
                  <p style={styles.meta}>{item.request.project_id} · Lancé le {new Date(item.launch.launched_at).toLocaleString("fr-FR")}</p>
                </div>
                <span style={styles.status}>{plan ? "Plan v" + plan.version : "À planifier"}</span>
              </div>
              <div style={styles.summaryGrid}>
                <div><strong>Besoin</strong><p>{project.problem || "Non renseigné"}</p></div>
                <div><strong>Résultat attendu</strong><p>{project.desiredOutcome || "Non renseigné"}</p></div>
                <div><strong>Choix Studio conservés</strong>
                  {chosen.length ? <ul>{chosen.map((option) => <li key={option.id}>{option.title}</li>)}</ul> : <p>Aucun module explicitement sélectionné dans ce dossier.</p>}
                </div>
              </div>
              {!plan ? (
                <button type="button" style={styles.primaryButton} disabled={busy !== null} onClick={() => void generate(item)}>
                  {busyThis ? "Génération…" : "Générer le plan interne"}
                </button>
              ) : (
                <div style={styles.plan}>
                  <h4>{plan.payload.summary || "Plan interne de réalisation"}</h4>
                  <p style={styles.meta}>Version {plan.version} · plan enregistré et réservé à l'administration</p>
                  <strong>Périmètre retenu</strong>
                  <ul>{(plan.payload.includedScope ?? []).map((scope) => <li key={scope.id}><b>{scope.title}</b>{scope.description ? " — " + scope.description : ""}</li>)}</ul>
                  <strong>Étapes de travail</strong>
                  <ol>{(plan.payload.tasks ?? []).map((task) => <li key={task.id}><b>{task.title}</b><p>{task.purpose}</p><small>Livrable : {task.deliverable}</small></li>)}</ol>
                  {(plan.payload.openQuestions?.length ?? 0) > 0 ? <div style={styles.warning}><strong>Points à clarifier en interne</strong><ul>{plan.payload.openQuestions?.map((question) => <li key={question}>{question}</li>)}</ul></div> : null}
                  {(plan.payload.assumptions?.length ?? 0) > 0 ? <p style={styles.meta}>Hypothèses : {plan.payload.assumptions?.join(" · ")}</p> : null}
                  <div style={styles.approvals}>
                    {(["admin_review", "execution_authorization"] as const).map((kind) => (
                      <div key={kind} style={styles.approvalRow}>
                        <span>{approvalLabels[kind]}</span>
                        <strong style={{ color: hasApproval(kind) ? "#176b45" : "#9a6700" }}>{hasApproval(kind) ? "Validée" : "À valider"}</strong>
                        {!hasApproval(kind) ? <button type="button" style={styles.smallButton} disabled={busy !== null} onClick={() => void approve(item, kind)}>{busyThis ? "Enregistrement…" : "Valider"}</button> : null}
                      </div>
                    ))}
                  </div>
                  <button type="button" style={styles.primaryButton} disabled={busy !== null || !hasApproval("admin_review") || !hasApproval("execution_authorization")} onClick={() => void prepareJob(item)}>
                    {busyThis ? "Préparation…" : "Préparer le travail de fabrication"}
                  </button>
                  <p style={styles.note}>Cette action prépare le dossier et ses tâches. Elle ne lance ni GitHub Actions, ni Vercel Sandbox, ni déploiement.</p>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  panel: { maxWidth: 1100, margin: "28px auto", padding: 24, border: "1px solid #e7e2f0", borderRadius: 20, background: "#fff" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" },
  eyebrow: { color: "#6e56a5", fontSize: 10, fontWeight: 800, letterSpacing: 1.5 },
  title: { margin: "8px 0", fontSize: 22 },
  description: { margin: 0, maxWidth: 720, color: "#716c80", lineHeight: 1.6, fontSize: 13 },
  secondaryButton: { border: "1px solid #ded7ec", borderRadius: 9, padding: "9px 12px", background: "#fff", color: "#5e35b1", fontWeight: 700, cursor: "pointer" },
  error: { padding: 12, borderRadius: 10, background: "#fff2f0", color: "#b42318" },
  success: { padding: 12, borderRadius: 10, background: "#edf8f1", color: "#176b45" },
  empty: { marginTop: 20, padding: 18, borderRadius: 12, background: "#f8f7fb", color: "#716c80" },
  list: { display: "grid", gap: 14, marginTop: 18 },
  card: { border: "1px solid #e7e2f0", borderRadius: 16, padding: 18 },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" },
  projectTitle: { margin: 0, fontSize: 17 },
  meta: { color: "#716c80", fontSize: 12, lineHeight: 1.5 },
  status: { borderRadius: 999, padding: "7px 10px", background: "#f1edfb", color: "#6e56a5", fontSize: 11, fontWeight: 700 },
  summaryGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 14, margin: "16px 0" },
  plan: { marginTop: 16, padding: 16, background: "#faf9fc", border: "1px solid #eeeaf4", borderRadius: 12, lineHeight: 1.6 },
  approvals: { display: "grid", gap: 8, margin: "18px 0" },
  approvalRow: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap", padding: 10, border: "1px solid #e7e2f0", borderRadius: 9, background: "#fff" },
  primaryButton: { border: 0, borderRadius: 10, padding: "11px 15px", background: "#5e35b1", color: "#fff", fontWeight: 700, cursor: "pointer" },
  smallButton: { border: "1px solid #ded7ec", borderRadius: 8, padding: "6px 10px", background: "#fff", color: "#5e35b1", fontWeight: 700, cursor: "pointer" },
  warning: { marginTop: 12, padding: 12, background: "#fff8e7", borderRadius: 9, color: "#805b00" },
  note: { marginBottom: 0, color: "#716c80", fontSize: 12 },
};
