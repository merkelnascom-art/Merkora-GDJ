"use client";

import { useMemo, useState } from "react";
import { AGENT_POLES } from "@/lib/agents/agent-catalog";
import type { AgentFactoryWorkflow } from "@/lib/agents/agent-factory-workflow";
import styles from "./factory-workflow.module.css";

type DurableJobResponse = {
  created: true;
  jobId: string;
  status: "queued";
  taskCount: number;
  executionStarted: false;
  specialistWorkflow?: {
    status: "prepared" | "requires_specialized_task_runtime";
    executionEnabled: false;
    unsupportedCount: number;
  };
};

type PreparedWorkflowResponse = {
  prepared: boolean;
  executionStarted: false;
  sourceVersions: { briefVersion: number; planVersion: number };
  selectionSource: "explicit" | "core_recommendation";
  recommendedAgentIds: string[];
  recommendationReasons: Readonly<Record<string, readonly string[]>>;
  workflow: AgentFactoryWorkflow;
};

export function FactoryWorkflowPlanner() {
  const [projectId, setProjectId] = useState("");
  const [selectedAgentIds, setSelectedAgentIds] = useState<string[]>([]);
  const [workflow, setWorkflow] = useState<PreparedWorkflowResponse | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [durableJob, setDurableJob] = useState<DurableJobResponse | null>(null);

  const selectedCount = selectedAgentIds.length;
  const selectedSet = useMemo(() => new Set(selectedAgentIds), [selectedAgentIds]);

  function toggleAgent(agentId: string) {
    setSelectedAgentIds((current) => current.includes(agentId)
      ? current.filter((id) => id !== agentId)
      : [...current, agentId]);
    setWorkflow(null);
    setDurableJob(null);
    setError("");
  }

  function selectAll() {
    setSelectedAgentIds(AGENT_POLES.flatMap((pole) => pole.agents.map((agent) => agent.id)));
    setWorkflow(null);
    setDurableJob(null);
    setError("");
  }

  function clearSelection() {
    setSelectedAgentIds([]);
    setWorkflow(null);
    setError("");
  }

  async function prepareWorkflow() {
    setError("");
    setWorkflow(null);
    setDurableJob(null);
    if (projectId.trim().length < 3) {
      setError("Saisissez l'identifiant du projet.");
      return;
    }
    setBusy(true);
    try {
      const workflowId = `factory-${Date.now().toString(36)}`;
      const response = await fetch(
        `/api/admin/projects/${encodeURIComponent(projectId.trim())}/agents/workflow`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ workflowId, agentIds: selectedAgentIds }),
        },
      );
      const payload = await response.json() as PreparedWorkflowResponse | { error?: string };
      if (!response.ok || !("workflow" in payload)) {
        throw new Error("error" in payload && payload.error ? payload.error : "Préparation du workflow impossible.");
      }
      if (selectedAgentIds.length === 0) {
        setSelectedAgentIds(payload.workflow.poles.flatMap((pole) => pole.selectedAgentIds));
      }
      setWorkflow(payload);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Une erreur inattendue est survenue.");
    } finally {
      setBusy(false);
    }
  }

  async function persistWorkflow() {
    if (!workflow) return;
    setError("");
    setSaving(true);
    try {
      const response = await fetch(
        `/api/admin/projects/${encodeURIComponent(projectId.trim())}/factory/jobs`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            planVersion: workflow.sourceVersions.planVersion,
            correlationId: crypto.randomUUID(),
            workflow: {
              workflowId: workflow.workflow.workflowId,
              agentIds: workflow.workflow.assignments.map((assignment) => assignment.agentId),
            },
          }),
        },
      );
      const payload = await response.json() as DurableJobResponse | { error?: string };
      if (!response.ok || !("created" in payload) || payload.created !== true) {
        throw new Error("error" in payload && payload.error ? payload.error : "Enregistrement du travail durable impossible.");
      }
      setDurableJob(payload);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Une erreur inattendue est survenue.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <a href="/admin/agents" className={styles.back}>← Organigramme des agents</a>
        <span className={styles.eyebrow}>MERKORA GDJ · ORCHESTRATION</span>
        <h1>Préparer le workflow de fabrication</h1>
        <p>Reliez un plan projet versionné aux spécialistes nécessaires. MerKora Core prépare les missions et leurs dépendances, sans les exécuter.</p>
      </header>

      <section className={styles.setup}>
        <label className={styles.projectField}>
          <span>Identifiant du projet</span>
          <input
            value={projectId}
            onChange={(event) => setProjectId(event.target.value)}
            placeholder="Identifiant exact du projet MerKora"
            autoComplete="off"
          />
        </label>
        <div className={styles.selectionSummary}>
          <div><strong>{selectedCount}/35</strong><span>spécialistes sélectionnés</span></div>
          <div className={styles.selectionActions}>
            <button type="button" onClick={selectAll}>Sélectionner les 35</button>
            <button type="button" onClick={clearSelection}>Tout désélectionner</button>
          </div>
        </div>
      </section>

      <section className={styles.poles}>
        {AGENT_POLES.map((pole, index) => {
          const count = pole.agents.filter((agent) => selectedSet.has(agent.id)).length;
          return (
            <article className={styles.pole} key={pole.id}>
              <div className={styles.poleHeader}>
                <span className={styles.poleNumber}>0{index + 1}</span>
                <div><h2>{pole.name}</h2><p>{pole.objective} · {count}/{pole.agents.length} sélectionnés</p></div>
              </div>
              <div className={styles.agentChoices}>
                {pole.agents.map((agent) => (
                  <label key={agent.id} className={selectedSet.has(agent.id) ? styles.agentSelected : styles.agent}>
                    <input
                      type="checkbox"
                      checked={selectedSet.has(agent.id)}
                      onChange={() => toggleAgent(agent.id)}
                    />
                    <span>{agent.name}</span>
                  </label>
                ))}
              </div>
            </article>
          );
        })}
      </section>

      <div className={styles.prepareBar}>
        <p>Le plan utilise la dernière version administrative enregistrée du projet. Aucun enregistrement ou lancement n'est effectué.</p>
        <button type="button" onClick={prepareWorkflow} disabled={busy}>
          {busy
            ? "Préparation…"
            : selectedCount === 0
              ? "Recommander l'équipe et préparer"
              : "Préparer le workflow sélectionné"}
        </button>
      </div>

      {error && <p className={styles.error} role="alert">{error}</p>}

      {workflow && (
        <section className={styles.result} aria-live="polite">
          <div className={styles.resultHeader}>
            <div>
              <span className={styles.eyebrow}>PLAN PRÉPARÉ · NON EXÉCUTÉ</span>
              <h2>Workflow {workflow.workflow.workflowId}</h2>
              <p>{workflow.selectionSource === "core_recommendation" ? "Équipe recommandée par MerKora Core à partir du plan versionné." : "Équipe sélectionnée explicitement par l'administrateur."}</p>
              <p>Brief v{workflow.sourceVersions.briefVersion} · Plan v{workflow.sourceVersions.planVersion} · {workflow.workflow.missionPlan.steps.length} missions ordonnées</p>
            </div>
            <span className={styles.status}>Aucune exécution</span>
          </div>

          <div className={styles.phaseList}>
            {workflow.workflow.phases.map((phase, index) => (
              <article className={styles.phase} key={phase.id}>
                <span className={styles.phaseNumber}>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{phase.label}</h3>
                  <p>{phase.purpose}</p>
                  <div className={styles.phaseAgents}>
                    {phase.missionIds.length
                      ? phase.missionIds.map((missionId) => {
                          const step = workflow.workflow.missionPlan.steps.find((item) => item.missionId === missionId);
                          return (
                            <div className={styles.mission} key={missionId}>
                              <span>{step?.agentName ?? missionId}</span>
                              <small>Prérequis : {step?.dependsOn.length ? step.dependsOn.join(", ") : "aucun"}</small>
                            </div>
                          );
                        })
                      : <small>Aucun spécialiste sélectionné dans cette phase.</small>}
                  </div>
                </div>
                <span className={phase.status === "planned" ? styles.planned : styles.notSelected}>
                  {phase.status === "planned" ? "Planifiée" : "Non sélectionnée"}
                </span>
              </article>
            ))}
          </div>

          <div className={styles.executionOrder}>
            <h3>Ordre topologique calculé</h3>
            <p>{workflow.workflow.executionOrder.join(" → ")}</p>
          </div>

          <div className={styles.assignmentPanel}>
            <h3>Raccordement au runtime existant</h3>
            {workflow.workflow.assignments.map((assignment) => (
              <div className={styles.assignment} key={assignment.agentId}>
                <span>{assignment.agentId}</span>
                <strong className={assignment.status === "prepared" ? styles.prepared : styles.runtimeMissing}>
                  {assignment.status === "prepared" ? "Mission préparée" : "Runtime spécialisé requis"}
                </strong>
              </div>
            ))}
          </div>

          <div className={styles.recommendations}>
            <h3>Pourquoi MerKora Core recommande ces spécialistes</h3>
            {workflow.recommendedAgentIds.map((agentId) => (
              <div className={styles.recommendation} key={agentId}>
                <strong>{agentId}</strong>
                <span>{workflow.recommendationReasons[agentId]?.join(" ") ?? "Rôle utile au parcours du projet."}</span>
              </div>
            ))}
          </div>

          <div className={styles.gates}>
            <h3>Validations humaines à vérifier</h3>
            {workflow.workflow.humanGates.map((gate) => (
              <div className={styles.gate} key={gate.id}>
                <span>{gate.label}</span>
                <small>{gate.requiredFor.join(" · ")}</small>
                <strong>Non évaluée</strong>
              </div>
            ))}
          </div>

          <div className={styles.durableHandoff}>
            <div>
              <h3>Enregistrer dans le travail durable</h3>
              <p>Le manifeste des missions sera enregistré avec les cinq tâches existantes. Cela ne déclenche ni IA ni Sandbox.</p>
            </div>
            <button type="button" onClick={persistWorkflow} disabled={saving || Boolean(durableJob)}>
              {saving ? "Enregistrement…" : durableJob ? "Travail enregistré" : "Enregistrer le workflow"}
            </button>
          </div>
          {durableJob && (
            <p className={styles.durableSuccess} role="status">
              Travail {durableJob.jobId} enregistré dans la file durable · {durableJob.taskCount} tâches · aucun worker lancé.
              {durableJob.specialistWorkflow?.status === "requires_specialized_task_runtime"
                ? ` ${durableJob.specialistWorkflow.unsupportedCount} spécialiste(s) ou mission(s) restent à raccorder.`
                : " Le manifeste est prêt pour la prochaine étape d'exécution contrôlée."}
            </p>
          )}

          <p className={styles.safetyNote}>
            Ce résultat est une préparation de missions. Les spécialistes sans runtime adapté restent bloqués. Aucun appel IA, budget, worker, modification de base, déploiement ou livraison n'a été déclenché.
          </p>
        </section>
      )}
    </main>
  );
}
