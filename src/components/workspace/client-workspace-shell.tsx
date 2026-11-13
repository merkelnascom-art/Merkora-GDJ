"use client";

import type { ReactNode } from "react";
import type { Project } from "@/lib/project-types";
import type { ClientJourneyStage } from "@/lib/client-journey";
import { CloudAccountPanel } from "@/components/account/cloud-account-panel";

type Props = {
  projects: Project[];
  activeProject: Project | null;
  activeStage: ClientJourneyStage | "home";
  storageReady: boolean;
  onCloudProjectsLoaded: (projects: Project[]) => void;
  onOpenHome: () => void;
  onStartProject: () => void;
  onNavigate: (stage: ClientJourneyStage) => void;
  onDeleteProject?: () => void;
  children: ReactNode;
};

const stages: Array<{ id: ClientJourneyStage; label: string }> = [
  { id: "understanding", label: "Comprendre" },
  { id: "analysis", label: "Analyser" },
  { id: "proposals", label: "Propositions" },
  { id: "concept", label: "Concept" },
  { id: "personalization", label: "Personnaliser" },
  { id: "validation", label: "Valider" },
  { id: "realization", label: "Réalisation" },
];

export function ClientWorkspaceShell({
  projects,
  activeProject,
  activeStage,
  storageReady,
  onCloudProjectsLoaded,
  onOpenHome,
  onStartProject,
  onNavigate,
  onDeleteProject,
  children,
}: Props) {
  const activeIndex = stages.findIndex((stage) => stage.id === activeStage);

  return (
    <main className="mk-workspace-shell">
      <aside className="mk-workspace-sidebar">
        <button className="mk-brand" onClick={onOpenHome} aria-label="Retour à l’espace MerKora">
          <span className="mk-brand-mark">M</span>
          <span>MerKora <b>GDJ</b></span>
        </button>
        <div className="mk-sidebar-caption">ESPACE CLIENT</div>
        <button className={`mk-nav-link ${activeStage === "home" ? "is-active" : ""}`} onClick={onOpenHome}>
          <span aria-hidden="true">⌂</span> Mes projets
        </button>
        <button className="mk-nav-link" onClick={onStartProject}>
          <span aria-hidden="true">＋</span> Nouveau besoin
        </button>
        {activeProject && (
          <>
            <div className="mk-sidebar-caption mk-project-caption">PARCOURS DU PROJET</div>
            <div className="mk-stage-nav" aria-label="Étapes du projet">
              {stages.map((stage, index) => {
                const isCurrent = stage.id === activeStage;
                const isPast = index < activeIndex;
                return (
                  <button
                    className={`mk-stage-link ${isCurrent ? "is-active" : ""} ${isPast ? "is-past" : ""}`}
                    key={stage.id}
                    onClick={() => onNavigate(stage.id)}
                    disabled={!isCurrent && !isPast}
                    aria-current={isCurrent ? "step" : undefined}
                  >
                    <span className="mk-stage-index">{isPast ? "✓" : String(index + 1).padStart(2, "0")}</span>
                    {stage.label}
                  </button>
                );
              })}
            </div>
          </>
        )}
        <div className="mk-sidebar-footer">
          <span className="mk-footer-orbit">✳</span>
          <strong>Le besoin d’abord.</strong>
          <p>La solution se construit avec vous.</p>
          <span className="mk-local-pill"><i /> Espace de travail</span>
        </div>
      </aside>

      <section className="mk-workspace-main">
        <header className="mk-workspace-topbar">
          <div>
            <div className="mk-breadcrumb">MerKora GDJ <span>/</span> {activeProject ? activeProject.title : "Mes projets"}</div>
            <p>{activeProject ? "Votre projet avance à votre rythme." : "Vos idées, vos besoins et vos projets au même endroit."}</p>
          </div>
          <div className="mk-topbar-actions">
            <span className="mk-local-status"><i /> Données enregistrées sur cet appareil</span>
            {onDeleteProject && <button className="mk-topbar-delete" onClick={onDeleteProject}>Supprimer le dossier</button>}
            <button className="mk-topbar-home" onClick={onOpenHome}>Mes projets</button>
          </div>
        </header>
        <div className="mk-cloud-account">
          <CloudAccountPanel localProjects={projects} onCloudProjectsLoaded={onCloudProjectsLoaded} storageReady={storageReady} />
        </div>
        {activeProject && (
          <div className="mk-project-context">
            <span className="mk-project-context-label">PROJET EN COURS</span>
            <strong>{activeProject.title}</strong>
            <span>{activeProject.id}</span>
          </div>
        )}
        <div className="mk-workspace-content">{children}</div>
      </section>
    </main>
  );
}
