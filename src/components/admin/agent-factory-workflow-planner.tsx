"use client";

import { useMemo, useState } from "react";
import { AGENT_CATALOG, AGENT_POLES } from "@/lib/agents/agent-catalog";

type WorkflowResponse = {
  prepared?: boolean;
  executionStarted?: boolean;
  sourceVersions?: { briefVersion: number; planVersion: number };
  error?: string;
  workflow?: {
    workflowId: string;
    projectId: string;
    status: string;
    executionEnabled: boolean;
    phases: Array<{
      id: string;
      label: string;
      purpose: string;
      agentIds: string[];
      missionIds: string[];
      status: string;
    }>;
    poles: Array<{
      poleId: string;
      poleName: string;
      selectedAgentIds: string[];
      selectedCount: number;
      totalAgents: number;
      status: string;
    }>;
    assignments: Array<{
      agentId: string;
      poleId: string;
      phaseId: string;
      missionId: string;
      status: string;
      reason?: string;
    }>;
    missionPlan: {
      steps: Array<{ missionId: string; agentId: string; dependsOn: string[]; execution: string }>;
    };
    humanGates: Array<{ id: string; label: string; blocksPhase: string; status: string }>;
    guarantees: string[];
  };
};

const STATUS_LABELS: Record<string, string> = {
  prepared: "Contrat générique compatible",
  requires_specialized_runtime: "Runtime spécialisé à raccorder",
  planned: "Planifiée",
  not_selected: "Non sélectionnée",
};

export function AgentFactoryWorkflowPlanner() {
  const [projectId, setProjectId] = useState("");
  const [workflowId, setWorkflowId] = useState("factory-review-01");
  const [selectedIds, setSelectedIds] = useState<string[]>(AGENT_CATALOG.map((agent) => agent.id));
  const [result, setResult] = useState<WorkflowResponse | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const readyCount = result?.workflow?.assignments.filter((item) => item.status === "prepared").length ?? 0;
  const specializedCount = result?.workflow?.assignments.filter((item) => item.status !== "prepared").length ?? 0;

  function toggleAgent(agentId: string) {
    setSelectedIds((current) => current.includes(agentId)
      ? current.filter((id) => id !== agentId)
      : [...current, agentId]);
  }

  function togglePole(poleId: string, checked: boolean) {
    const ids = AGENT_CATALOG.filter((agent) => agent.poleId === poleId).map((agent) => agent.id);
    setSelectedIds((current) => {
      const next = new Set(current);
      for (const id of ids) checked ? next.add(id) : next.delete(id);
      return AGENT_CATALOG.map((agent) => agent.id).filter((id) => next.has(id));
    });
  }

  async function prepareWorkflow() {
    setBusy(true);
    setError("");
    setResult(null);
    try {
      const response = await fetch(
        `/api/admin/projects/${encodeURIComponent(projectId.trim())}/agents/workflow`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
          body: JSON.stringify({ workflowId: workflowId.trim(), agentIds: selectedIds }),
        },
      );
      const data = await response.json().catch(() => ({})) as WorkflowResponse;
      if (!response.ok || !data.prepared || !data.workflow) {
        throw new Error(data.error || "Le plan de coordination n'a pas pu être préparé.");
      }
      setResult(data);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Service de coordination indisponible.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mk-factory-planner">
      <header className="mk-factory-planner__header">
        <a href="/admin/agents">← Retour au catalogue des agents</a>
        <span>MERKORA GDJ · COORDINATION DE LA FABRIQUE</span>
        <h1>Planifier le travail des sept pôles</h1>
        <p>Cette interface lit le plan versionné du projet, prépare l'ordre des missions et expose les validations nécessaires. Elle ne lance aucune IA ni aucun worker.</p>
      </header>

      <section className="mk-factory-planner__card">
        <h2>1. Choisir le dossier de référence</h2>
        <label>
          Identifiant exact du projet
          <input value={projectId} onChange={(event) => setProjectId(event.target.value)} placeholder="Identifiant du dossier client" maxLength={100} />
        </label>
        <label>
          Identifiant de cette préparation
          <input value={workflowId} onChange={(event) => setWorkflowId(event.target.value)} maxLength={30} />
        </label>
        <p>La préparation utilise la dernière version vérifiable du plan et de son périmètre. Si aucun plan n'existe, il faut d'abord terminer l'analyse et la conception dans le dossier client.</p>
      </section>

      <section className="mk-factory-planner__card">
        <div className="mk-factory-planner__section-heading">
          <div><h2>2. Composer l'équipe de coordination</h2><p>Les 35 spécialistes sont présélectionnés pour afficher l'usine complète. Tu peux désactiver un spécialiste ou un pôle si le projet ne le nécessite pas.</p></div>
          <strong>{selectedIds.length}/35 agents</strong>
        </div>
        <div className="mk-factory-planner__poles">
          {AGENT_POLES.map((pole) => {
            const count = pole.agents.filter((agent) => selectedSet.has(agent.id)).length;
            return (
              <fieldset key={pole.id}>
                <legend>
                  <input
                    type="checkbox"
                    checked={count === pole.agents.length}
                    ref={(element) => {
                      if (element) element.indeterminate = count > 0 && count < pole.agents.length;
                    }}
                    onChange={(event) => togglePole(pole.id, event.target.checked)}
                  />
                  <span>{pole.name}</span>
                  <small>{count}/{pole.agents.length}</small>
                </legend>
                <div className="mk-factory-planner__agents">
                  {pole.agents.map((agent) => (
                    <label key={agent.id}>
                      <input type="checkbox" checked={selectedSet.has(agent.id)} onChange={() => toggleAgent(agent.id)} />
                      <span>{agent.name}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            );
          })}
        </div>
        <div className="mk-factory-planner__actions">
          <button type="button" disabled={busy || !projectId.trim() || !selectedIds.length || !workflowId.trim()} onClick={() => void prepareWorkflow()}>
            {busy ? "Préparation du workflow…" : "Préparer le workflow complet"}
          </button>
          <span>Lecture seule · aucune exécution · aucune dépense</span>
        </div>
        {error && <p className="mk-factory-planner__error" role="alert">{error}</p>}
      </section>

      {result?.workflow && (
        <section className="mk-factory-planner__results" aria-live="polite">
          <div className="mk-factory-planner__result-heading">
            <div><span>WORKFLOW PRÉPARÉ</span><h2>La chaîne de fabrication coordonnée</h2><p>Projet {result.workflow.projectId} · {result.workflow.workflowId}</p></div>
            <strong>Plan v{result.sourceVersions?.planVersion ?? "?"} · Brief v{result.sourceVersions?.briefVersion ?? "?"}</strong>
          </div>
          <div className="mk-factory-planner__metrics">
            <article><strong>{result.workflow.poles.filter((pole) => pole.selectedCount > 0).length}/7</strong><span>Pôles sélectionnés</span></article>
            <article><strong>{result.workflow.assignments.length}</strong><span>Missions préparées</span></article>
            <article><strong>{readyCount}</strong><span>Rôles génériques compatibles</span></article>
            <article><strong>{specializedCount}</strong><span>Runtimes spécialisés requis</span></article>
          </div>
          <ol className="mk-factory-planner__phases">
            {result.workflow.phases.map((phase, index) => (
              <li key={phase.id} data-empty={phase.agentIds.length === 0}>
                <span className="mk-factory-planner__phase-number">{String(index + 1).padStart(2, "0")}</span>
                <div><h3>{phase.label}</h3><p>{phase.purpose}</p>
                  <small>{phase.agentIds.length ? phase.agentIds.map((id) => AGENT_CATALOG.find((agent) => agent.id === id)?.name ?? id).join(" · ") : "Aucun agent sélectionné"}</small>
                </div>
                <strong>{STATUS_LABELS[phase.status] ?? phase.status}</strong>
              </li>
            ))}
          </ol>
          <section className="mk-factory-planner__subsection">
            <h3>Raccordement des 35 spécialistes</h3>
            <p>Un spécialiste non raccordé à un rôle d'exécution compatible est clairement signalé. Il ne sera jamais envoyé à un rôle inadapté.</p>
            <div className="mk-factory-planner__assignment-list">
              {result.workflow.assignments.map((assignment) => (
                <article key={assignment.agentId}>
                  <span>{AGENT_CATALOG.find((agent) => agent.id === assignment.agentId)?.name ?? assignment.agentId}</span>
                  <strong data-ready={assignment.status === "prepared"}>{STATUS_LABELS[assignment.status] ?? assignment.status}</strong>
                </article>
              ))}
            </div>
          </section>
          <section className="mk-factory-planner__subsection">
            <h3>Portes de validation humaine</h3>
            <p>Chaque validation doit être lue dans le service d'approbation existant. Aucune n'est considérée comme acquise par ce plan.</p>
            <ul>{result.workflow.humanGates.map((gate) => <li key={gate.id}><strong>{gate.label}</strong><span>{gate.status} · avant {result.workflow?.phases.find((phase) => phase.id === gate.blocksPhase)?.label ?? gate.blocksPhase}</span></li>)}</ul>
          </section>
          <section className="mk-factory-planner__subsection">
            <h3>Garanties de coordination</h3>
            <ul>{result.workflow.guarantees.map((item) => <li key={item}>{item}</li>)}</ul>
          </section>
          <p className="mk-factory-planner__safe-state">ÉTAT : PLANIFIÉ · EXÉCUTION NON DÉMARRÉE · AUCUN APPEL IA · AUCUNE MODIFICATION SUPABASE</p>
        </section>
      )}
    </main>
  );
}
