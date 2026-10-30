"use client";

import { useState } from "react";
import type { Project } from "@/lib/project-types";
import { buildSelectedPlanOptions } from "@/lib/planning/mockup-selections";
import type { MockupConfig } from "@/lib/mockup-studio";
import type { ProjectPlan, ProjectPlanInput } from "@/lib/planning/plan-types";

type Props = { project: Project };
type StoredStudioConfig = Partial<MockupConfig>;

function readStudioConfig(projectId: string): StoredStudioConfig {
  try {
    const raw = window.localStorage.getItem(`merkora-gdj-mockup-v1:${projectId}`);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return parsed as StoredStudioConfig;
  } catch {
    return {};
  }
}

function statusLabel(plan: ProjectPlan): string {
  return plan.status === "needs_clarification" ? "Clarifications nécessaires" : "Brouillon à examiner";
}

export function ProjectPlanPreview({ project }: Props) {
  const [plan, setPlan] = useState<ProjectPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generatePlan() {
    setLoading(true);
    setError("");
    try {
      const selectedOptions = buildSelectedPlanOptions(project, readStudioConfig(project.id));
      const response = await fetch(`/api/projects/${encodeURIComponent(project.id)}/plan/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          briefVersion: 1,
          planVersion: 1,
          plannerVersion: "1.0.0",
          selectedOptions,
          approvedScope: [],
          confirmedConstraints: [],
        }),
      });
      const payload = await response.json().catch(() => ({})) as { plan?: ProjectPlan; error?: string };
      if (!response.ok || !payload.plan) {
        throw new Error(payload.error || "Le plan n’a pas pu être généré.");
      }
      setPlan(payload.plan);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Le service de planification est indisponible.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      className="panel project-plan-preview"
      aria-labelledby="project-plan-preview-title"
      style={{ marginTop: 20, padding: 24, border: "1px solid #d9d2f2", borderRadius: 18, background: "#fff" }}
    >
      <div className="eyebrow">ÉTAPE 03 · PLANIFICATION AUTONOME</div>
      <h3 id="project-plan-preview-title" style={{ margin: "8px 0" }}>Plan de réalisation MerKora</h3>
      <p style={{ color: "#716c80", lineHeight: 1.65, fontSize: 14 }}>
        MerKora transforme le dossier en étapes de travail. Seuls les choix explicitement sélectionnés dans le Studio sont inclus ; les autres pistes restent des suggestions. Cet aperçu n’est pas encore enregistré ni approuvé.
      </p>
      <button className="button button-primary" type="button" disabled={loading} onClick={generatePlan}>
        {loading ? "MerKora prépare le plan…" : "Générer mon plan"}
      </button>

      {!plan && !error && (
        <p role="status" style={{ color: "#716c80", marginTop: 14 }}>
          Aucun plan généré. Connectez-vous et synchronisez ce dossier pour demander un aperçu.
        </p>
      )}
      {error && <p role="alert" style={{ color: "#b42318", marginTop: 14 }}>{error}</p>}

      {plan && (
        <div role="region" aria-label="Plan généré" style={{ marginTop: 22 }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
            <strong>{statusLabel(plan)}</strong>
            <span className="local-tag">Version {plan.version} · dossier v{plan.briefVersion}</span>
          </div>
          <p style={{ lineHeight: 1.65 }}>{plan.summary}</p>

          <h4>Périmètre explicitement retenu</h4>
          {plan.includedScope.length > 0 ? (
            <ul>{plan.includedScope.map((item) => <li key={item.id}><strong>{item.title}</strong>{item.description ? ` — ${item.description}` : ""}</li>)}</ul>
          ) : (
            <p>Aucun module n’est encore confirmé comme inclus.</p>
          )}

          {plan.openQuestions.length > 0 && (
            <>
              <h4>Questions à clarifier</h4>
              <ul>{plan.openQuestions.map((item) => <li key={item}>{item}</li>)}</ul>
            </>
          )}
          {plan.assumptions.length > 0 && (
            <>
              <h4>Informations non confirmées</h4>
              <ul>{plan.assumptions.map((item) => <li key={item}>{item}</li>)}</ul>
            </>
          )}

          <h4>Étapes proposées</h4>
          {plan.tasks.length > 0 ? (
            <ol>
              {plan.tasks.map((task) => (
                <li key={task.id} style={{ marginBottom: 12 }}>
                  <strong>{task.title}</strong>
                  <p style={{ margin: "4px 0" }}>{task.purpose}</p>
                  <small>Livrable : {task.deliverable}</small>
                  <ul>{task.acceptanceCriteria.map((criterion) => <li key={criterion}>{criterion}</li>)}</ul>
                </li>
              ))}
            </ol>
          ) : (
            <p>MerKora attend les précisions nécessaires avant de proposer des tâches de réalisation.</p>
          )}

          {plan.milestones.length > 0 && (
            <>
              <h4>Jalons</h4>
              <ol>{plan.milestones.map((milestone) => <li key={milestone.id}><strong>{milestone.title}</strong> — {milestone.exitCriteria.join(" ")}</li>)}</ol>
            </>
          )}
          <p style={{ color: "#716c80", fontSize: 13 }}>{plan.estimate.notes.join(" ")}</p>
          <p role="note" style={{ color: "#716c80", fontSize: 13 }}>
            Ce plan est un brouillon de travail. Il ne vaut ni devis, ni validation client, ni autorisation de lancer une construction.
          </p>
        </div>
      )}
    </section>
  );
}import { buildSelectedPlanOptions } from "@/lib/planning/mockup-selections";
import type { ProjectPlan } from "@/lib/planning/plan-types";

type Props = { project: Project };
type StoredStudioConfig = Partial<MockupConfig>;

function readStudioConfig(projectId: string): StoredStudioConfig {
  try {
    const raw = window.localStorage.getItem(`merkora-gdj-mockup-v1:${projectId}`);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return parsed as StoredStudioConfig;
  } catch {
    return {};
  }
}

function statusLabel(plan: ProjectPlan): string {
  return plan.status === "needs_clarification" ? "Clarifications nécessaires" : "Brouillon à examiner";
}

export function ProjectPlanPreview({ project }: Props) {
  const [plan, setPlan] = useState<ProjectPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generatePlan() {
    setLoading(true);
    setError("");
    try {
      const selectedOptions = buildSelectedPlanOptions(project, readStudioConfig(project.id));
      const response = await fetch(`/api/projects/${encodeURIComponent(project.id)}/plan/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          briefVersion: 1,
          planVersion: 1,
          plannerVersion: "1.0.0",
          selectedOptions,
          approvedScope: [],
          confirmedConstraints: [],
        }),
      });
      const payload = await response.json().catch(() => ({})) as { plan?: ProjectPlan; error?: string };
      if (!response.ok || !payload.plan) {
        throw new Error(payload.error || "Le plan n’a pas pu être généré.");
      }
      setPlan(payload.plan);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Le service de planification est indisponible.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      className="panel project-plan-preview"
      aria-labelledby="project-plan-preview-title"
      style={{ marginTop: 20, padding: 24, border: "1px solid #d9d2f2", borderRadius: 18, background: "#fff" }}
    >
      <div className="eyebrow">ÉTAPE 03 · PLANIFICATION AUTONOME</div>
      <h3 id="project-plan-preview-title" style={{ margin: "8px 0" }}>Plan de réalisation MerKora</h3>
      <p style={{ color: "#716c80", lineHeight: 1.65, fontSize: 14 }}>
        MerKora transforme le dossier en étapes de travail. Seuls les choix explicitement sélectionnés dans le Studio sont inclus ; les autres pistes restent des suggestions. Cet aperçu n’est pas encore enregistré ni approuvé.
      </p>
      <button className="button button-primary" type="button" disabled={loading} onClick={generatePlan}>
        {loading ? "MerKora prépare le plan…" : "Générer mon plan"}
      </button>

      {!plan && !error && (
        <p role="status" style={{ color: "#716c80", marginTop: 14 }}>
          Aucun plan généré. Connectez-vous et synchronisez ce dossier pour demander un aperçu.
        </p>
      )}
      {error && <p role="alert" style={{ color: "#b42318", marginTop: 14 }}>{error}</p>}

      {plan && (
        <div role="region" aria-label="Plan généré" style={{ marginTop: 22 }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
            <strong>{statusLabel(plan)}</strong>
            <span className="local-tag">Version {plan.version} · dossier v{plan.briefVersion}</span>
          </div>
          <p style={{ lineHeight: 1.65 }}>{plan.summary}</p>

          <h4>Périmètre explicitement retenu</h4>
          {plan.includedScope.length > 0 ? (
            <ul>{plan.includedScope.map((item) => <li key={item.id}><strong>{item.title}</strong>{item.description ? ` — ${item.description}` : ""}</li>)}</ul>
          ) : (
            <p>Aucun module n’est encore confirmé comme inclus.</p>
          )}

          {plan.openQuestions.length > 0 && (
            <>
              <h4>Questions à clarifier</h4>
              <ul>{plan.openQuestions.map((item) => <li key={item}>{item}</li>)}</ul>
            </>
          )}
          {plan.assumptions.length > 0 && (
            <>
              <h4>Informations non confirmées</h4>
              <ul>{plan.assumptions.map((item) => <li key={item}>{item}</li>)}</ul>
            </>
          )}

          <h4>Étapes proposées</h4>
          {plan.tasks.length > 0 ? (
            <ol>
              {plan.tasks.map((task) => (
                <li key={task.id} style={{ marginBottom: 12 }}>
                  <strong>{task.title}</strong>
                  <p style={{ margin: "4px 0" }}>{task.purpose}</p>
                  <small>Livrable : {task.deliverable}</small>
                  <ul>{task.acceptanceCriteria.map((criterion) => <li key={criterion}>{criterion}</li>)}</ul>
                </li>
              ))}
            </ol>
          ) : (
            <p>MerKora attend les précisions nécessaires avant de proposer des tâches de réalisation.</p>
          )}

          {plan.milestones.length > 0 && (
            <>
              <h4>Jalons</h4>
              <ol>{plan.milestones.map((milestone) => <li key={milestone.id}><strong>{milestone.title}</strong> — {milestone.exitCriteria.join(" ")}</li>)}</ol>
            </>
          )}
          <p style={{ color: "#716c80", fontSize: 13 }}>{plan.estimate.notes.join(" ")}</p>
          <p role="note" style={{ color: "#716c80", fontSize: 13 }}>
            Ce plan est un brouillon de travail. Il ne vaut ni devis, ni validation client, ni autorisation de lancer une construction.
          </p>
        </div>
      )}
    </section>
  );
}function readStudioConfig(projectId: string): StoredStudioConfig {
  try {
    const raw = window.localStorage.getItem(`merkora-gdj-mockup-v1:${projectId}`);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return parsed as StoredStudioConfig;
  } catch {
    return {};
  }
}

function statusLabel(plan: ProjectPlan): string {
  return plan.status === "needs_clarification" ? "Clarifications nécessaires" : "Brouillon à examiner";
}

export function ProjectPlanPreview({ project }: Props) {
  const [plan, setPlan] = useState<ProjectPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generatePlan() {
    setLoading(true);
    setError("");
    try {
      const selectedOptions = buildSelectedPlanOptions(project, readStudioConfig(project.id));
      const response = await fetch(`/api/projects/${encodeURIComponent(project.id)}/plan/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          briefVersion: 1,
          planVersion: 1,
          plannerVersion: "1.0.0",
          selectedOptions,
          approvedScope: [],
          confirmedConstraints: [],
        }),
      });
      const payload = await response.json().catch(() => ({})) as { plan?: ProjectPlan; error?: string };
      if (!response.ok || !payload.plan) {
        throw new Error(payload.error || "Le plan n’a pas pu être généré.");
      }
      setPlan(payload.plan);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Le service de planification est indisponible.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      className="panel project-plan-preview"
      aria-labelledby="project-plan-preview-title"
      style={{ marginTop: 20, padding: 24, border: "1px solid #d9d2f2", borderRadius: 18, background: "#fff" }}
    >
      <div className="eyebrow">ÉTAPE 03 · PLANIFICATION AUTONOME</div>
      <h3 id="project-plan-preview-title" style={{ margin: "8px 0" }}>Plan de réalisation MerKora</h3>
      <p style={{ color: "#716c80", lineHeight: 1.65, fontSize: 14 }}>
        MerKora transforme le dossier en étapes de travail. Seuls les choix explicitement sélectionnés dans le Studio sont inclus ; les autres pistes restent des suggestions. Cet aperçu n’est pas encore enregistré ni approuvé.
      </p>
      <button className="button button-primary" type="button" disabled={loading} onClick={generatePlan}>
        {loading ? "MerKora prépare le plan…" : "Générer mon plan"}
      </button>

      {!plan && !error && (
        <p role="status" style={{ color: "#716c80", marginTop: 14 }}>
          Aucun plan généré. Connectez-vous et synchronisez ce dossier pour demander un aperçu.
        </p>
      )}
      {error && <p role="alert" style={{ color: "#b42318", marginTop: 14 }}>{error}</p>}

      {plan && (
        <div role="region" aria-label="Plan généré" style={{ marginTop: 22 }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
            <strong>{statusLabel(plan)}</strong>
            <span className="local-tag">Version {plan.version} · dossier v{plan.briefVersion}</span>
          </div>
          <p style={{ lineHeight: 1.65 }}>{plan.summary}</p>

          <h4>Périmètre explicitement retenu</h4>
          {plan.includedScope.length > 0 ? (
            <ul>{plan.includedScope.map((item) => <li key={item.id}><strong>{item.title}</strong>{item.description ? ` — ${item.description}` : ""}</li>)}</ul>
          ) : (
            <p>Aucun module n’est encore confirmé comme inclus.</p>
          )}

          {plan.openQuestions.length > 0 && (
            <>
              <h4>Questions à clarifier</h4>
              <ul>{plan.openQuestions.map((item) => <li key={item}>{item}</li>)}</ul>
            </>
          )}
          {plan.assumptions.length > 0 && (
            <>
              <h4>Informations non confirmées</h4>
              <ul>{plan.assumptions.map((item) => <li key={item}>{item}</li>)}</ul>
            </>
          )}

          <h4>Étapes proposées</h4>
          {plan.tasks.length > 0 ? (
            <ol>
              {plan.tasks.map((task) => (
                <li key={task.id} style={{ marginBottom: 12 }}>
                  <strong>{task.title}</strong>
                  <p style={{ margin: "4px 0" }}>{task.purpose}</p>
                  <small>Livrable : {task.deliverable}</small>
                  <ul>{task.acceptanceCriteria.map((criterion) => <li key={criterion}>{criterion}</li>)}</ul>
                </li>
              ))}
            </ol>
          ) : (
            <p>MerKora attend les précisions nécessaires avant de proposer des tâches de réalisation.</p>
          )}

          {plan.milestones.length > 0 && (
            <>
              <h4>Jalons</h4>
              <ol>{plan.milestones.map((milestone) => <li key={milestone.id}><strong>{milestone.title}</strong> — {milestone.exitCriteria.join(" ")}</li>)}</ol>
            </>
          )}
          <p style={{ color: "#716c80", fontSize: 13 }}>{plan.estimate.notes.join(" ")}</p>
          <p role="note" style={{ color: "#716c80", fontSize: 13 }}>
            Ce plan est un brouillon de travail. Il ne vaut ni devis, ni validation client, ni autorisation de lancer une construction.
          </p>
        </div>
      )}
    </section>
  );
}import { buildSelectedPlanOptions } from "@/lib/planning/mockup-selections";
import type { ProjectPlan } from "@/lib/planning/plan-types";

type Props = { project: Project };
type StoredStudioConfig = Partial<MockupConfig>;

function readStudioConfig(projectId: string): StoredStudioConfig {
  try {
    const raw = window.localStorage.getItem(`merkora-gdj-mockup-v1:${projectId}`);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return parsed as StoredStudioConfig;
  } catch {
    return {};
  }
}

function statusLabel(plan: ProjectPlan): string {
  return plan.status === "needs_clarification" ? "Clarifications nécessaires" : "Brouillon à examiner";
}

export function ProjectPlanPreview({ project }: Props) {
  const [plan, setPlan] = useState<ProjectPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generatePlan() {
    setLoading(true);
    setError("");
    try {
      const selectedOptions = buildSelectedPlanOptions(project, readStudioConfig(project.id));
      const response = await fetch(`/api/projects/${encodeURIComponent(project.id)}/plan/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          briefVersion: 1,
          planVersion: 1,
          plannerVersion: "1.0.0",
          selectedOptions,
          approvedScope: [],
          confirmedConstraints: [],
        }),
      });
      const payload = await response.json().catch(() => ({})) as { plan?: ProjectPlan; error?: string };
      if (!response.ok || !payload.plan) {
        throw new Error(payload.error || "Le plan n’a pas pu être généré.");
      }
      setPlan(payload.plan);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Le service de planification est indisponible.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      className="panel project-plan-preview"
      aria-labelledby="project-plan-preview-title"
      style={{ marginTop: 20, padding: 24, border: "1px solid #d9d2f2", borderRadius: 18, background: "#fff" }}
    >
      <div className="eyebrow">ÉTAPE 03 · PLANIFICATION AUTONOME</div>
      <h3 id="project-plan-preview-title" style={{ margin: "8px 0" }}>Plan de réalisation MerKora</h3>
      <p style={{ color: "#716c80", lineHeight: 1.65, fontSize: 14 }}>
        MerKora transforme le dossier en étapes de travail. Seuls les choix explicitement sélectionnés dans le Studio sont inclus ; les autres pistes restent des suggestions. Cet aperçu n’est pas encore enregistré ni approuvé.
      </p>
      <button className="button button-primary" type="button" disabled={loading} onClick={generatePlan}>
        {loading ? "MerKora prépare le plan…" : "Générer mon plan"}
      </button>

      {!plan && !error && (
        <p role="status" style={{ color: "#716c80", marginTop: 14 }}>
          Aucun plan généré. Connectez-vous et synchronisez ce dossier pour demander un aperçu.
        </p>
      )}
      {error && <p role="alert" style={{ color: "#b42318", marginTop: 14 }}>{error}</p>}

      {plan && (
        <div role="region" aria-label="Plan généré" style={{ marginTop: 22 }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
            <strong>{statusLabel(plan)}</strong>
            <span className="local-tag">Version {plan.version} · dossier v{plan.briefVersion}</span>
          </div>
          <p style={{ lineHeight: 1.65 }}>{plan.summary}</p>

          <h4>Périmètre explicitement retenu</h4>
          {plan.includedScope.length > 0 ? (
            <ul>{plan.includedScope.map((item) => <li key={item.id}><strong>{item.title}</strong>{item.description ? ` — ${item.description}` : ""}</li>)}</ul>
          ) : (
            <p>Aucun module n’est encore confirmé comme inclus.</p>
          )}

          {plan.openQuestions.length > 0 && (
            <>
              <h4>Questions à clarifier</h4>
              <ul>{plan.openQuestions.map((item) => <li key={item}>{item}</li>)}</ul>
            </>
          )}
          {plan.assumptions.length > 0 && (
            <>
              <h4>Informations non confirmées</h4>
              <ul>{plan.assumptions.map((item) => <li key={item}>{item}</li>)}</ul>
            </>
          )}

          <h4>Étapes proposées</h4>
          {plan.tasks.length > 0 ? (
            <ol>
              {plan.tasks.map((task) => (
                <li key={task.id} style={{ marginBottom: 12 }}>
                  <strong>{task.title}</strong>
                  <p style={{ margin: "4px 0" }}>{task.purpose}</p>
                  <small>Livrable : {task.deliverable}</small>
                  <ul>{task.acceptanceCriteria.map((criterion) => <li key={criterion}>{criterion}</li>)}</ul>
                </li>
              ))}
            </ol>
          ) : (
            <p>MerKora attend les précisions nécessaires avant de proposer des tâches de réalisation.</p>
          )}

          {plan.milestones.length > 0 && (
            <>
              <h4>Jalons</h4>
              <ol>{plan.milestones.map((milestone) => <li key={milestone.id}><strong>{milestone.title}</strong> — {milestone.exitCriteria.join(" ")}</li>)}</ol>
            </>
          )}
          <p style={{ color: "#716c80", fontSize: 13 }}>{plan.estimate.notes.join(" ")}</p>
          <p role="note" style={{ color: "#716c80", fontSize: 13 }}>
            Ce plan est un brouillon de travail. Il ne vaut ni devis, ni validation client, ni autorisation de lancer une construction.
          </p>
        </div>
      )}
    </section>
  );
}
