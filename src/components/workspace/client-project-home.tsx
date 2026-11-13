"use client";

import type { Project } from "@/lib/project-types";
import { getCategoryLabel } from "@/lib/solution-recommendations";

type Props = {
  projects: Project[];
  onStart: () => void;
  onResume: (projectId: string) => void;
};

const statusLabels: Record<Project["status"], string> = {
  discovery: "À clarifier",
  design: "À concevoir",
  awaiting_approval: "À valider",
  in_progress: "En réalisation",
  verification: "À vérifier",
  delivered: "Livré",
};

export function ClientProjectHome({ projects, onStart, onResume }: Props) {
  return (
    <section className="mk-home-view">
      <div className="mk-home-intro">
        <div>
          <div className="mk-eyebrow"><span>✳</span> VOTRE ESPACE DE CONCEPTION</div>
          <h1>Vos projets prennent forme <em>ici.</em></h1>
          <p>Partez d’un problème, d’une idée ou d’un objectif. MerKora vous accompagne étape par étape, sans vous imposer une solution avant d’avoir compris votre besoin.</p>
        </div>
        <button className="mk-primary-button" onClick={onStart}><span>＋</span> Décrire un besoin</button>
      </div>

      <div className="mk-home-stats">
        <article><span>PROJETS</span><strong>{projects.length.toString().padStart(2, "0")}</strong><small>Enregistrés sur cet appareil</small></article>
        <article><span>À CLARIFIER</span><strong>{projects.filter((project) => project.status === "discovery").length.toString().padStart(2, "0")}</strong><small>Besoin à approfondir</small></article>
        <article><span>PISTES DE TRAVAIL</span><strong>{projects.reduce((total, project) => total + project.recommendations.length, 0).toString().padStart(2, "0")}</strong><small>Non confirmées tant que vous ne les choisissez pas</small></article>
      </div>

      <div className="mk-section-heading">
        <div><div className="mk-eyebrow">VOTRE PORTFOLIO</div><h2>Reprendre un projet</h2></div>
        <span>{projects.length} dossier{projects.length > 1 ? "s" : ""}</span>
      </div>

      {projects.length === 0 ? (
        <div className="mk-empty-state">
          <span className="mk-empty-symbol">✳</span>
          <h3>Votre première idée commence ici.</h3>
          <p>Décrivez librement ce que vous vivez, ce qui vous bloque ou ce que vous aimeriez améliorer. Vous pourrez préciser le reste avec MerKora.</p>
          <button className="mk-primary-button" onClick={onStart}>Commencer mon projet <span>→</span></button>
        </div>
      ) : (
        <div className="mk-project-grid">
          {projects.map((project) => (
            <article className="mk-project-card" key={project.id}>
              <div className="mk-project-card-top"><span className="mk-project-category">{getCategoryLabel(project.category)}</span><span className="mk-project-status">{statusLabels[project.status]}</span></div>
              <h3>{project.title}</h3>
              <p>{project.problem}</p>
              <div className="mk-project-card-bottom">
                <span>{new Date(project.createdAt).toLocaleDateString("fr-FR")}</span>
                <button onClick={() => onResume(project.id)}>Reprendre <span>→</span></button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
