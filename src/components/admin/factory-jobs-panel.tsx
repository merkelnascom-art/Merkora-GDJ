"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type FactoryJob = {
  id: string;
  projectId: string;
  planVersion: number;
  status: string;
  createdAt: string;
  implementationStatus?: string;
  tasks: Array<{ id: string; taskKey: string; state: string; updatedAt?: string }>;
};

export function FactoryJobsPanel({ initialJobs, aiEnabled }: { initialJobs: FactoryJob[]; aiEnabled: boolean }) {
  const router = useRouter();
  const [jobs, setJobs] = useState(initialJobs);
  const [runningId, setRunningId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [githubStatus, setGithubStatus] = useState<{ verified: boolean; message: string } | null>(null);
  const [checkingGithub, setCheckingGithub] = useState(false);

  // Keep optimistic local updates, but reconcile them whenever the server refreshes the job list.
  useEffect(() => {
    setJobs(initialJobs);
  }, [initialJobs]);

  useEffect(() => {
    if (!runningId) return;
    const refresh = window.setInterval(() => router.refresh(), 5000);
    return () => window.clearInterval(refresh);
  }, [runningId, router]);

  async function verifyGitHubConnection() {
    setCheckingGithub(true);
    setGithubStatus(null);
    try {
      const response = await fetch("/api/admin/factory/github-app/verify", { cache: "no-store" });
      const result = await response.json().catch(() => ({})) as { verified?: boolean; message?: string };
      setGithubStatus({
        verified: response.ok && result.verified === true,
        message: result.message ?? "La vérification GitHub n'a pas abouti.",
      });
    } catch {
      setGithubStatus({ verified: false, message: "Le service de vérification GitHub ne répond pas." });
    } finally {
      setCheckingGithub(false);
    }
  }

  async function launchWorker(job: FactoryJob) {
    const confirmed = window.confirm(
      "Lancer la fabrication dans un Vercel Sandbox ? Ce service est facturé à l'utilisation. Le worker générera et compilera le squelette, sans publier ni livrer l'application. Confirmez uniquement si le coût potentiel est accepté.",
    );
    if (!confirmed) return;
    setRunningId(job.id);
    setMessage("");
    try {
      const response = await fetch(
        `/api/admin/projects/${encodeURIComponent(job.projectId)}/factory/jobs/${encodeURIComponent(job.id)}/dispatch`,
        { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ confirmSandboxCost: true }) },
      );
      const result = await response.json().catch(() => ({})) as {
        status?: string; error?: string; message?: string; dispatched?: boolean; runRequested?: boolean;
      };
      if (!response.ok) {
        setMessage(result.error ?? "La fabrication n'a pas abouti. Consultez le dossier du travail.");
        return;
      }
      setMessage(result.message ?? "GitHub Actions a accepté la demande. Le worker doit maintenant réclamer le travail.");
      router.refresh();
    } catch {
      setMessage("Le service de fabrication ne répond pas. Vérifiez le statut du travail avant de réessayer.");
    } finally {
      setRunningId(null);
    }
  }

  async function implementWithAi(job: FactoryJob) {
    const confirmed = window.confirm(
      "Confirmer l'envoi des besoins et du code de ce projet à un modèle IA externe ? Cette opération peut consommer des crédits. Elle ne déploiera rien.",
    );
    if (!confirmed) return;
    setRunningId(job.id);
    setMessage("");
    try {
      const response = await fetch(
        `/api/admin/projects/${encodeURIComponent(job.projectId)}/factory/jobs/${encodeURIComponent(job.id)}/implement`,
        { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ confirmAiSpend: true }) },
      );
      const result = await response.json().catch(() => ({})) as {
        status?: string; error?: string; message?: string; questions?: string[]; implementationStatus?: string;
      };
      if (result.status) {
        setJobs((current) => current.map((item) =>
          item.id === job.id ? { ...item, status: result.status!, implementationStatus: result.implementationStatus } : item,
        ));
      }
      setMessage(result.message ?? result.error ?? "L'implémentation IA n'a pas abouti.");
      router.refresh();
    } catch {
      setMessage("Le service IA ne répond pas. Vérifiez le statut du travail avant de réessayer.");
    } finally {
      setRunningId(null);
    }
  }

  return (
    <section style={styles.panel}>
      <div style={styles.heading}>
        <div>
          <div style={styles.eyebrow}>FABRIQUE LOGICIELLE</div>
          <h2 style={styles.title}>Travaux autorisés</h2>
          <p style={styles.description}>Les travaux ne peuvent être préparés qu'après les deux validations administratives exactes du même plan.</p>
        </div>
        <div style={styles.headingActions}>
          <button type="button" onClick={() => void verifyGitHubConnection()} disabled={checkingGithub} style={styles.refreshButton}>
            {checkingGithub ? "Vérification…" : "Vérifier GitHub"}
          </button>
          <button type="button" onClick={() => router.refresh()} style={styles.refreshButton}>Actualiser le suivi</button>
          <span style={styles.count}>{jobs.length} dossier(s)</span>
        </div>
      </div>
      {githubStatus ? (
        <p role="status" style={{ ...styles.message, color: githubStatus.verified ? "#176b45" : "#b42318" }}>
          {githubStatus.message}
        </p>
      ) : null}
      {jobs.length === 0 ? (
        <p style={styles.empty}>Aucun travail de fabrication n'est actuellement en attente.</p>
      ) : (
        <div style={styles.list}>
          {jobs.map((job) => (
            <article key={job.id} style={styles.item}>
              <div style={{ minWidth: 0 }}>
                <strong style={styles.project}>Projet {job.projectId}</strong>
                <p style={styles.meta}>Plan v{job.planVersion} · {job.status}</p>
                <p style={styles.id}>Travail {job.id}</p>
                {job.tasks.length > 0 ? (
                  <div style={styles.progressBlock}>
                    <div style={styles.progressCaption}>
                      <span>Progression</span>
                      <strong>{job.tasks.filter((task) => task.state === "completed").length}/{job.tasks.length} étapes</strong>
                    </div>
                    <div style={styles.progressTrack} role="progressbar"
                      aria-valuenow={job.tasks.filter((task) => task.state === "completed").length}
                      aria-valuemin={0} aria-valuemax={job.tasks.length}>
                      <span style={{ ...styles.progressFill, width: `${Math.round(job.tasks.filter((task) => task.state === "completed").length / job.tasks.length * 100)}%` }} />
                    </div>
                  </div>
                ) : null}
                {job.tasks.length > 0 ? (
                  <ol style={styles.taskList} aria-label="Progression du travail">
                    {job.tasks.map((task) => (
                      <li key={task.id} style={styles.taskRow}>
                        <span style={styles.taskName}>{taskLabel(task.taskKey)}</span>
                        <span style={{ ...styles.taskState, ...(task.state === "completed" ? styles.taskComplete : task.state === "failed" || task.state === "blocked" ? styles.taskBlocked : {}) }}>{taskLabelState(task.state)}</span>
                      </li>
                    ))}
                  </ol>
                ) : <p style={styles.taskEmpty}>Étapes de réalisation non disponibles.</p>}
                {job.status === "awaiting_approval" ? (
                  <a
                    href={`/api/admin/projects/${encodeURIComponent(job.projectId)}/factory/jobs/${encodeURIComponent(job.id)}/artifacts/source`}
                    style={styles.download}
                  >
                    Télécharger le code généré
                  </a>
                ) : null}
                {job.implementationStatus === "candidate_ready_for_human_review" ? (
                  <p style={styles.reviewNotice}>Version candidate compilée · revue humaine requise</p>
                ) : null}
                {aiEnabled && job.status === "awaiting_approval" && job.implementationStatus !== "candidate_ready_for_human_review" ? (
                  <button
                    type="button"
                    disabled={runningId !== null}
                    onClick={() => void implementWithAi(job)}
                    style={{ ...styles.aiButton, opacity: runningId !== null ? 0.55 : 1 }}
                  >
                    {runningId === job.id ? "Analyse IA…" : "Compléter la logique métier (IA)"}
                  </button>
                ) : null}
              </div>
              <button
                type="button"
                disabled={job.status !== "queued" || runningId !== null}
                onClick={() => void launchWorker(job)}
                style={{
                  ...styles.button,
                  opacity: job.status !== "queued" || runningId !== null ? 0.55 : 1,
                  cursor: job.status !== "queued" || runningId !== null ? "not-allowed" : "pointer",
                }}
              >
                {runningId === job.id ? "Déclenchement…" : job.status === "queued" ? "Lancer la fabrication" : "Déjà pris en charge"}
              </button>
            </article>
          ))}
        </div>
      )}
      {message ? <p role="status" style={styles.message}>{message}</p> : null}
      <p style={styles.warning}>Le lancement déclenche GitHub Actions puis un Vercel Sandbox facturé à l'utilisation, après confirmation explicite. Le worker compile un squelette isolé ; l'IA externe reste séparée et soumise au consentement client et à une confirmation de dépense. Aucun code n'est livré ni publié automatiquement.</p>
    </section>
  );
}

function taskLabel(key: string): string {
  const labels: Record<string, string> = {
    prepare_specification: "Préparer le cahier des charges",
    generate_application: "Générer l'application",
    run_quality_checks: "Contrôler la qualité",
    repair_and_retest: "Corriger et retester",
    human_delivery_review: "Revue humaine avant livraison",
  };
  return labels[key] ?? key;
}
function taskLabelState(state: string): string {
  const labels: Record<string, string> = {
    not_started: "À venir", ready: "Prête", in_progress: "En cours",
    blocked: "Bloquée", completed: "Terminée", failed: "Échec", cancelled: "Annulée",
  };
  return labels[state] ?? state;
}

const styles: Record<string, React.CSSProperties> = {
  panel: { maxWidth: 1100, margin: "28px auto", padding: 24, border: "1px solid #e7e2f0", borderRadius: 20, background: "#fff" },
  heading: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" },
  eyebrow: { color: "#6e56a5", fontSize: 10, fontWeight: 800, letterSpacing: 1.5 },
  title: { margin: "8px 0", fontSize: 22 },
  description: { margin: 0, maxWidth: 650, color: "#716c80", lineHeight: 1.6, fontSize: 13 },
  headingActions: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" },
  refreshButton: { border: "1px solid #ded7ec", borderRadius: 9, padding: "8px 10px", background: "#fff", color: "#5e35b1", fontWeight: 700, fontSize: 11, cursor: "pointer" },
  count: { borderRadius: 999, padding: "7px 10px", background: "#f1edfb", color: "#6e56a5", fontSize: 11, fontWeight: 700 },
  empty: { margin: "20px 0 0", color: "#716c80", fontSize: 13 },
  list: { display: "grid", gap: 10, marginTop: 20 },
  item: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap", border: "1px solid #eeeaf4", borderRadius: 14, padding: 16 },
  project: { fontSize: 14 },
  meta: { margin: "5px 0", color: "#716c80", fontSize: 12 },
  id: { margin: 0, color: "#9992a8", fontSize: 10, overflowWrap: "anywhere" },
  progressBlock: { marginTop: 12, maxWidth: 470 },
  progressCaption: { display: "flex", justifyContent: "space-between", gap: 12, color: "#716c80", fontSize: 10, marginBottom: 6 },
  progressTrack: { height: 6, borderRadius: 999, overflow: "hidden", background: "#eeeaf5" },
  progressFill: { display: "block", height: "100%", borderRadius: 999, background: "#6e56a5", transition: "width .2s ease" },
  taskList: { listStyle: "none", padding: 0, margin: "12px 0 0", display: "grid", gap: 6, maxWidth: 470 },
  taskRow: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, fontSize: 11 },
  taskName: { color: "#716c80" },
  taskState: { color: "#716c80", fontWeight: 700, whiteSpace: "nowrap" },
  taskComplete: { color: "#24634b" },
  taskBlocked: { color: "#a33a3a" },
  taskEmpty: { margin: "10px 0 0", color: "#9992a8", fontSize: 11 },
  button: { border: 0, borderRadius: 10, padding: "11px 14px", background: "#5e35b1", color: "#fff", fontWeight: 700, fontSize: 12 },
  download: { display: "inline-block", marginTop: 9, color: "#5e35b1", fontSize: 12, fontWeight: 700, textDecoration: "underline" },
  reviewNotice: { margin: "10px 0 0", color: "#24634b", fontSize: 12, fontWeight: 700 },
  aiButton: { display: "block", marginTop: 9, border: "1px solid #b7a5df", borderRadius: 10, padding: "9px 12px", background: "#f7f4fc", color: "#5e35b1", fontWeight: 700, fontSize: 11 },
  message: { margin: "16px 0 0", color: "#4d3b73", fontSize: 13, lineHeight: 1.6 },
  warning: { margin: "16px 0 0", color: "#8b8498", fontSize: 11, lineHeight: 1.6 },
};
