"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { LandingPage } from "@/components/marketing/landing-page";
import { CloudAccountPanel } from "@/components/account/cloud-account-panel";
import { AiProposalPanel } from "@/components/ai/ai-proposal-panel";
import { ProjectMockupStudio } from "@/components/studio/project-mockup-studio";
import { ClientRequestSubmitPanel } from "@/components/studio/client-request-submit-panel";
import { ClientRequestTrackingPanel } from "@/components/account/client-request-tracking-panel";
import { ClientQuotesPanel } from "@/components/account/client-quotes-panel";\nimport { ClientPaymentsPanel } from "@/components/account/client-payments-panel";
import type { Project } from "@/lib/project-types";
import { analyzeNeed } from "@/lib/discovery";
import {
  buildRecommendations,
  getCategoryLabel,
  validateNeed,
  type NeedCategory,
  type NeedInput,
  type ProjectStatus,
} from "@/lib/solution-recommendations";

const STORAGE_KEY = "merkora-gdj-projects-v1";
const initialForm: NeedInput = {
  title: "",
  category: "other",
  problem: "",
  desiredOutcome: "",
  budget: "À définir",
  urgency: "normal",
};

const statusLabels: Record<ProjectStatus, string> = {
  discovery: "À clarifier",
  design: "À concevoir",
  awaiting_approval: "En attente de validation",
  in_progress: "En réalisation",
  verification: "À vérifier",
  delivered: "Livré",
};

const categoryOptions: { value: NeedCategory; label: string }[] = [
  { value: "business", label: "Entreprise / activité" },
  { value: "digital", label: "Solution numérique" },
  { value: "creative", label: "Création / communication" },
  { value: "organization", label: "Organisation / équipe" },
  { value: "personal", label: "Besoin personnel" },
  { value: "other", label: "Autre besoin / je ne sais pas encore" },
];

function makeId() {
  return `MK-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState<NeedInput>(initialForm);
  const [errors, setErrors] = useState<string[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [storageReady, setStorageReady] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showLanding, setShowLanding] = useState(true);

  const mergeCloudProjects = useCallback((cloudProjects: Project[]) => {
    setProjects((current) => {
      const localIds = new Set(current.map((project) => project.id));
      return [...current, ...cloudProjects.filter((project) => !localIds.has(project.id))];
    });
  }, []);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) setProjects(parsed as Project[]);
      }
    } catch {
      // A corrupted local cache must not prevent the workspace from opening.
    } finally {
      setStorageReady(true);
    }
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch {
      // Storage can be unavailable in private browsing or restricted contexts.
    }
  }, [projects, storageReady]);

  const activeProject = useMemo(
    () => projects.find((project) => project.id === activeProjectId) ?? null,
    [projects, activeProjectId],
  );

  function updateForm<K extends keyof NeedInput>(key: K, value: NeedInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function startDiscovery(example?: { title: string; category: NeedCategory }) {
    setForm(example ? { ...initialForm, title: example.title, category: example.category } : initialForm);
    setActiveProjectId(null);
    setShowForm(true);
    setShowLanding(false);
    setErrors([]);
  }

  function submitNeed(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validateNeed(form);
    setErrors(validation);
    if (validation.length > 0) return;

    const discovery = analyzeNeed(form);
    const project: Project = {
      ...form,
      title: form.title.trim(),
      problem: form.problem.trim(),
      desiredOutcome: form.desiredOutcome.trim(),
      id: makeId(),
      createdAt: new Date().toISOString(),
      status: "discovery",
      recommendations: discovery.recommendations.length > 0 ? discovery.recommendations : buildRecommendations(form),
      discovery,
    };

    setProjects((current) => [project, ...current]);
    setActiveProjectId(project.id);
    setForm(initialForm);
    setErrors([]);
    setShowForm(false);
    setShowLanding(false);
  }

  function updateProjectRecommendations(id: string, recommendations: Project["recommendations"]) {
    setProjects((current) => current.map((project) => project.id === id ? { ...project, recommendations } : project));
  }

  function deleteProject(id: string) {
    const confirmed = window.confirm("Supprimer ce projet enregistré dans ce navigateur ?");
    if (!confirmed) return;
    setProjects((current) => current.filter((project) => project.id !== id));
    if (activeProjectId === id) setActiveProjectId(null);
  }

  if (showLanding) {
    return (
      <LandingPage
        onStartDiscovery={startDiscovery}
        onOpenWorkspace={() => setShowLanding(false)}
        projectCount={projects.length}
      />
    );
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <button className="brand brand-button" onClick={() => { setShowLanding(true); setShowForm(false); setActiveProjectId(null); }} aria-label="Retour à l’accueil MerKora">
          <span className="brand-mark">M</span><span className="brand-name">MerKora <b>GDJ</b></span>
        </button>
        <div className="sidebar-label">ESPACE DE TRAVAIL</div>
        <button className={`side-link ${!activeProject && !showForm ? "selected" : ""}`} onClick={() => { setActiveProjectId(null); setShowForm(false); }}>
          <span>◫</span> Vue d'ensemble
        </button>
        <button className={`side-link ${showForm ? "selected" : ""}`} onClick={() => startDiscovery()}>
          <span>＋</span> Nouveau besoin
        </button>
        <button className="side-link" onClick={() => setShowLanding(true)}><span>✳</span> Découvrir MerKora</button>
        <div className="sidebar-bottom">
          <div className="sidebar-mini-mark">✳</div><strong>Les besoins d’abord.</strong><p>Les solutions ensuite.</p>
          <span className="prototype-pill"><i /> Prototype de travail</span>
        </div>
      </aside>

      <section className="main-area" id="accueil">
        <header className="topbar">
          <div><div className="breadcrumb">MerKora GDJ <span>/</span> Espace de travail</div><p className="topbar-subtitle">Donnez une forme concrète à vos idées.</p></div>
          <div className="topbar-right"><span className="local-indicator"><i /> Données locales</span><button className="button button-quiet workspace-home" onClick={() => { setShowLanding(true); setShowForm(false); setActiveProjectId(null); }}>Accueil MerKora ↗</button></div>
        </header>

        <div className="account-panel-wrap"><CloudAccountPanel localProjects={projects} onCloudProjectsLoaded={mergeCloudProjects} storageReady={storageReady} /></div>
        <ClientRequestTrackingPanel />
        <ClientQuotesPanel />\n        <ClientPaymentsPanel />

        <div className="content-wrap">
          <section className="welcome-row">
            <div><div className="eyebrow"><span className="eyebrow-star">✳</span> VOTRE ESPACE POUR CONSTRUIRE</div><h1>Bonjour, <span>créateur.</span></h1><p>Un projet commence par une question à résoudre, pas par un outil imposé.</p></div>
            <button className="button button-primary" onClick={() => startDiscovery()}><span>＋</span> Décrire un besoin</button>
          </section>

          <section className="metric-grid" aria-label="Résumé des projets">
            <article className="metric-card"><span className="metric-icon violet">◈</span><span className="metric-label">MES PROJETS</span><strong>{projects.length.toString().padStart(2, "0")}</strong><small>Enregistrés sur cet appareil</small></article>
            <article className="metric-card"><span className="metric-icon green">✳</span><span className="metric-label">BESOINS À CLARIFIER</span><strong>{projects.filter((project) => project.status === "discovery").length.toString().padStart(2, "0")}</strong><small>À approfondir avec vous</small></article>
            <article className="metric-card"><span className="metric-icon amber">↗</span><span className="metric-label">PISTES PROPOSÉES</span><strong>{projects.reduce((count, project) => count + project.recommendations.length, 0).toString().padStart(2, "0")}</strong><small>Préliminaires, non contractuelles</small></article>
          </section>

          {showForm ? (
            <section className="panel form-panel">
              <div className="panel-heading"><div><div className="eyebrow">ÉTAPE 01 · COMPRÉHENSION</div><h2>Parlons de votre besoin.</h2><p>Expliquez la situation avec vos mots. Vous n’avez pas besoin de connaître la solution technique.</p></div><button className="icon-button" onClick={() => { setShowForm(false); setErrors([]); }} aria-label="Fermer le formulaire">×</button></div>
              <form onSubmit={submitNeed} className="need-form">
                <label>Titre du projet <span>*</span><input required value={form.title} onChange={(event) => updateForm("title", event.target.value)} placeholder="Ex. Student Vision, ma boutique, mon site…" maxLength={100} /></label>
                <label>Quel type de besoin décrivez-vous ?<select value={form.category} onChange={(event) => updateForm("category", event.target.value as NeedCategory)}>{categoryOptions.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}</select></label>
                <label className="field-wide">Qu’est-ce qui se passe aujourd’hui ? <span>*</span><textarea required value={form.problem} onChange={(event) => updateForm("problem", event.target.value)} placeholder="Décrivez la difficulté, les personnes concernées et ce qui vous préoccupe…" rows={4} maxLength={2500} /><small>{form.problem.length}/2500 caractères</small></label>
                <label className="field-wide">Quel résultat aimeriez-vous obtenir ? <span>*</span><textarea required value={form.desiredOutcome} onChange={(event) => updateForm("desiredOutcome", event.target.value)} placeholder="Imaginez la situation idéale : qu’est-ce qui devrait changer ?" rows={3} maxLength={1500} /></label>
                <label>Budget envisagé<select value={form.budget} onChange={(event) => updateForm("budget", event.target.value)}><option>À définir</option><option>Moins de 25 000 FCFA</option><option>25 000 – 100 000 FCFA</option><option>100 000 – 500 000 FCFA</option><option>Plus de 500 000 FCFA</option></select></label>
                <label>Priorité<select value={form.urgency} onChange={(event) => updateForm("urgency", event.target.value)}><option value="normal">Normale</option><option value="soon">À traiter bientôt</option><option value="urgent">Urgente</option></select></label>
                {errors.length > 0 && <div className="form-errors" role="alert">{errors.map((error) => <p key={error}>• {error}</p>)}</div>}
                <div className="form-footer"><p>Vous pouvez commencer sans compte. Pour cette version, le dossier sera conservé dans ce navigateur, pas synchronisé en ligne.</p><button className="button button-primary" type="submit">Examiner mon besoin <span>→</span></button></div>
              </form>
            </section>
          ) : activeProject ? (
            <section className="panel project-detail">
              <div className="panel-heading"><div><div className="eyebrow">DOSSIER · {activeProject.id}</div><h2>{activeProject.title}</h2><p>{getCategoryLabel(activeProject.category)} · Créé le {new Date(activeProject.createdAt).toLocaleDateString("fr-FR")}</p></div><button className="icon-button" onClick={() => setActiveProjectId(null)} aria-label="Retour à la liste">×</button></div>
              <div className="detail-status"><span className="status-dot" /> {statusLabels[activeProject.status]} <span className="status-note">· Pré-analyse locale, sans IA connectée</span></div>
              <div className="detail-grid"><article><span className="detail-label">LA SITUATION</span><p>{activeProject.problem}</p></article><article><span className="detail-label">LE RÉSULTAT SOUHAITÉ</span><p>{activeProject.desiredOutcome}</p></article><article><span className="detail-label">BUDGET ENVISAGÉ</span><p>{activeProject.budget}</p></article><article><span className="detail-label">PRIORITÉ</span><p>{activeProject.urgency === "urgent" ? "Urgente" : activeProject.urgency === "soon" ? "À traiter bientôt" : "Normale"}</p></article></div>
              <ProjectMockupStudio key={activeProject.id} project={activeProject} />
              <ClientRequestSubmitPanel key={`send-${activeProject.id}`} project={activeProject} />

              {(() => {
                const discovery = activeProject.discovery ?? analyzeNeed(activeProject);
                return (
                  <section className="discovery-summary" aria-labelledby="discovery-title">
                    <div className="discovery-summary-head"><div><div className="eyebrow">LECTURE PRÉLIMINAIRE</div><h3 id="discovery-title">{discovery.domainLabel}</h3></div><span className="local-tag">{discovery.state === "needs_clarification" ? "À préciser" : discovery.state === "incomplete" ? "Informations manquantes" : "À confirmer"}</span></div>
                    <p className="discovery-notice">{discovery.notice}</p>
                    {discovery.understood.length > 0 && <div className="understood-list"><strong>Ce que nous avons compris</strong>{discovery.understood.map((item, index) => <p key={index}>{item}</p>)}</div>}
                    {discovery.questions.length > 0 && <div className="clarification-list"><strong>Questions à examiner ensuite</strong><ol>{discovery.questions.map((question) => <li key={question}>{question}</li>)}</ol></div>}
                  </section>
                );
              })()}

              <div className="recommendation-heading"><div><div className="eyebrow">PISTES DE RÉFLEXION</div><h3>Premières directions possibles</h3></div><span className="local-tag">Préliminaire</span></div>
              <div className="recommendation-list">{activeProject.recommendations.map((recommendation, index) => <article className="recommendation-card" key={recommendation.title}><span className="recommendation-number">{String(index + 1).padStart(2, "0")}</span><div><h4>{recommendation.title}</h4><p>{recommendation.description}</p><small>{recommendation.reason}</small></div></article>)}</div>
              <div className="notice"><span>ⓘ</span><p>Ces pistes reposent sur des règles locales simples. Elles ne constituent ni un diagnostic IA, ni un devis, ni une promesse de réalisation. Les points incertains doivent être confirmés.</p></div>
              <AiProposalPanel key={activeProject.id} project={activeProject} onApply={(recommendations) => updateProjectRecommendations(activeProject.id, recommendations)} />
              <div className="detail-actions"><button className="button button-quiet" onClick={() => { setForm({ title: activeProject.title, category: activeProject.category, problem: activeProject.problem, desiredOutcome: activeProject.desiredOutcome, budget: activeProject.budget, urgency: activeProject.urgency }); setShowForm(true); setActiveProjectId(null); }}>Modifier le besoin</button><button className="button button-quiet danger-button" onClick={() => deleteProject(activeProject.id)}>Supprimer ce dossier</button></div>
            </section>
          ) : (
            <section className="project-section">
              <div className="section-title-row"><div><div className="eyebrow">VOTRE PORTFOLIO</div><h2>Vos projets</h2><p>Chaque besoin devient un dossier que vous pouvez reprendre et approfondir.</p></div><span className="count-chip">{projects.length} dossier{projects.length > 1 ? "s" : ""}</span></div>
              {projects.length === 0 ? <div className="empty-state"><div className="empty-illustration"><div className="empty-orbit orbit-a" /><div className="empty-orbit orbit-b" /><span>✳</span></div><h3>Votre prochaine idée commence ici.</h3><p>Décrivez un problème, une ambition ou une tâche à améliorer. Nous organiserons les premières pistes sans prétendre avoir déjà toutes les réponses.</p><button className="button button-primary" onClick={() => startDiscovery()}>＋ Décrire mon premier besoin</button></div> : <div className="project-list">{projects.map((project) => <article className="project-card" key={project.id}><div className="project-symbol">◈</div><button className="project-main" onClick={() => setActiveProjectId(project.id)}><strong>{project.title}</strong><span>{getCategoryLabel(project.category)}</span><small>{project.problem.slice(0, 110)}{project.problem.length > 110 ? "…" : ""}</small></button><div className="project-card-end"><span className="status-chip">{statusLabels[project.status]}</span><button className="open-project" onClick={() => setActiveProjectId(project.id)} aria-label={`Ouvrir ${project.title}`}>↗</button></div></article>)}</div>}
            </section>
          )}

          <section className="method-section" id="methode"><div><div className="eyebrow">LA MÉTHODE MERKORA</div><h2>Du pourquoi<br />à la solution.</h2><p>On ne choisit pas un outil avant d’avoir compris le besoin.</p></div><div className="method-steps"><article><span>01</span><div><strong>Comprendre</strong><p>Clarifier le problème, le contexte et l’objectif.</p></div></article><article><span>02</span><div><strong>Explorer</strong><p>Comparer des pistes sans promettre trop tôt.</p></div></article><article><span>03</span><div><strong>Concevoir</strong><p>Définir le périmètre, les coûts et les validations.</p></div></article><article><span>04</span><div><strong>Réaliser & vérifier</strong><p>Construire, tester, puis livrer avec transparence.</p></div></article></div></section>
          <footer className="footer"><span className="footer-brand">M <b>MerKora GDJ</b></span><span>Les besoins d’abord. Les solutions ensuite.</span><span>Version de travail · {new Date().getFullYear()}</span></footer>
        </div>
      </section>
    </main>
  );
}
