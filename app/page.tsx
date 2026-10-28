"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { toProjectRecord, toSupabaseProjectRow, type SupabaseProjectRow } from "@/lib/supabase/project-record";
import {
  buildRecommendations,
  getCategoryLabel,
  validateNeed,
  type NeedCategory,
  type NeedInput,
  type ProjectStatus,
  type Recommendation,
} from "@/lib/solution-recommendations";

type Project = NeedInput & {
  id: string;
  createdAt: string;
  status: ProjectStatus;
  recommendations: Recommendation[];
};

const STORAGE_KEY = "merkora-gdj-projects-v1";
const initialForm: NeedInput = {
  title: "",
  category: "business",
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
  { value: "other", label: "Autre besoin" },
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
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signup");
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authNotice, setAuthNotice] = useState("");
  const [currentUser, setCurrentUser] = useState<{ id: string; email?: string } | null>(null);
  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    let active = true;
    if (!supabase) {
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
      return;
    }

    void supabase.auth.getSession().then(async ({ data, error }: { data: { session: import("@supabase/supabase-js").Session | null }; error: Error | null }) => {
      if (!active) return;
      if (error) setAuthError("Impossible de vérifier la session. Réessayez.");
      const user = data.session?.user;
      setCurrentUser(user ? { id: user.id, email: user.email } : null);
      if (user) {
        const { data: rows, error: queryError } = await supabase
          .from("user_projects")
          .select("*")
          .eq("user_id", user.id)
          .order("updated_at", { ascending: false });
        if (!active) return;
        if (queryError) setAuthError("Connexion réussie, mais les dossiers n'ont pas pu être chargés. Vérifiez la configuration de la base.");
        else setProjects((rows ?? []).map((row: SupabaseProjectRow) => toProjectRecord(row) as Project));
      }
      setStorageReady(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event: import("@supabase/supabase-js").AuthChangeEvent, session: import("@supabase/supabase-js").Session | null) => {
      if (!active) return;
      const user = session?.user;
      setCurrentUser(user ? { id: user.id, email: user.email } : null);
      if (!user) setProjects([]);
      if (user) {
        window.setTimeout(() => {
          void supabase.from("user_projects").select("*").eq("user_id", user.id)
            .order("updated_at", { ascending: false })
            .then(({ data: rows, error: queryError }: { data: SupabaseProjectRow[] | null; error: Error | null }) => {
              if (!active) return;
              if (queryError) setAuthError("Impossible de charger vos dossiers depuis la base.");
              else setProjects((rows ?? []).map((row: SupabaseProjectRow) => toProjectRecord(row) as Project));
            });
        }, 0);
      }
    });
    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  // The client is a module-level singleton.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!storageReady || supabase) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch {
      // Storage can be unavailable in private browsing or restricted contexts.
    }
  }, [projects, storageReady, supabase]);

  const activeProject = useMemo(
    () => projects.find((project) => project.id === activeProjectId) ?? null,
    [projects, activeProjectId],
  );

  function updateForm<K extends keyof NeedInput>(key: K, value: NeedInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submitNeed(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validateNeed(form);
    setErrors(validation);
    setAuthError("");
    if (validation.length > 0) return;

    const project: Project = {
      ...form,
      title: form.title.trim(),
      problem: form.problem.trim(),
      desiredOutcome: form.desiredOutcome.trim(),
      id: makeId(),
      createdAt: new Date().toISOString(),
      status: "discovery",
      recommendations: buildRecommendations(form),
    };

    if (supabase) {
      if (!currentUser) {
        setAuthError("Connectez-vous pour enregistrer ce dossier en ligne.");
        return;
      }
      const { error } = await supabase.from("user_projects").upsert(toSupabaseProjectRow(project, currentUser.id));
      if (error) {
        setAuthError("Le dossier n'a pas été enregistré en ligne. Vérifiez votre connexion et réessayez ; vos informations sont toujours dans le formulaire.");
        return;
      }
    }

    setProjects((current) => [project, ...current]);
    setActiveProjectId(project.id);
    setForm(initialForm);
    setErrors([]);
    setShowForm(false);
    setAuthNotice(supabase ? "Dossier enregistré dans votre espace en ligne." : "Dossier enregistré dans ce navigateur.");
  }

  async function deleteProject(id: string) {
    const confirmed = window.confirm(supabase
      ? "Supprimer définitivement ce dossier de votre espace en ligne ?"
      : "Supprimer ce projet enregistré dans ce navigateur ?");
    if (!confirmed) return;
    setAuthError("");

    if (supabase && currentUser) {
      const { error } = await supabase.from("user_projects").delete().eq("id", id).eq("user_id", currentUser.id);
      if (error) {
        setAuthError("La suppression en ligne a échoué. Le dossier a été conservé ; réessayez.");
        return;
      }
    }

    setProjects((current) => current.filter((project) => project.id !== id));
    if (activeProjectId === id) setActiveProjectId(null);
    setAuthNotice("Dossier supprimé.");
  }

  async function handleAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthBusy(true);
    setAuthError("");
    setAuthNotice("");
    try {
      if (!supabase) {
        setAuthError("La connexion en ligne n'est pas configurée. Réessayez après configuration de Supabase.");
        return;
      }
      const result = authMode === "signup"
        ? await supabase.auth.signUp({
            email: authEmail.trim(),
            password: authPassword,
            options: { emailRedirectTo: window.location.origin },
          })
        : await supabase.auth.signInWithPassword({ email: authEmail.trim(), password: authPassword });
      if (result.error) throw result.error;
      if (authMode === "signup" && !result.data.session) {
        setAuthNotice("Compte créé. Consultez votre boîte mail pour confirmer l'adresse, puis connectez-vous.");
        setAuthMode("signin");
      } else if (result.data.user) {
        setCurrentUser({ id: result.data.user.id, email: result.data.user.email });
        setAuthNotice("Connexion réussie. Chargement de votre espace…");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Une erreur inattendue est survenue.";
      setAuthError(message);
    } finally {
      setAuthBusy(false);
    }
  }

  async function handleSignOut() {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) setAuthError("La déconnexion n'a pas abouti. Réessayez.");
    else {
      setCurrentUser(null);
      setProjects([]);
      setActiveProjectId(null);
      setAuthNotice("Vous êtes déconnecté.");
    }
  }

  if (supabase && !currentUser) {
    return (
      <main className="app-shell" style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "24px" }}>
        <section className="panel form-panel" style={{ width: "min(100%, 520px)", margin: "0 auto" }}>
          <a className="brand" href="#accueil" aria-label="MerKora GDJ accueil">
            <span className="brand-mark">M</span><span className="brand-name">MerKora <b>GDJ</b></span>
          </a>
          <div className="panel-heading" style={{ marginTop: "32px" }}>
            <div><div className="eyebrow">VOTRE ESPACE PERSONNEL</div><h2>{authMode === "signup" ? "Créons votre espace." : "Ravi de vous revoir."}</h2><p>Vos projets seront associés à votre compte et sauvegardés en ligne.</p></div>
          </div>
          <form className="need-form" onSubmit={handleAuth}>
            <label>Adresse e-mail <span>*</span><input type="email" required autoComplete="email" value={authEmail} onChange={(event) => setAuthEmail(event.target.value)} placeholder="vous@exemple.com" /></label>
            <label>Mot de passe <span>*</span><input type="password" required minLength={8} autoComplete={authMode === "signup" ? "new-password" : "current-password"} value={authPassword} onChange={(event) => setAuthPassword(event.target.value)} placeholder="8 caractères minimum" /></label>
            {authError && <div className="form-errors" role="alert"><p>{authError}</p></div>}
            {authNotice && <p role="status">{authNotice}</p>}
            <div className="form-footer"><button className="button button-primary" type="submit" disabled={authBusy}>{authBusy ? "Patientez…" : authMode === "signup" ? "Créer mon compte →" : "Me connecter →"}</button></div>
          </form>
          <p style={{ marginTop: "20px" }}>{authMode === "signup" ? "Vous avez déjà un compte ?" : "Vous découvrez MerKora ?"}{" "}
            <button className="button button-quiet" type="button" onClick={() => { setAuthMode(authMode === "signup" ? "signin" : "signup"); setAuthError(""); setAuthNotice(""); }}>
              {authMode === "signup" ? "Se connecter" : "Créer un compte"}
            </button>
          </p>
          <p style={{ color: "var(--muted, #6b7280)", fontSize: "13px" }}>Connexion sécurisée par Supabase. Ne partagez jamais votre mot de passe.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#accueil" aria-label="MerKora GDJ accueil">
          <span className="brand-mark">M</span>
          <span className="brand-name">MerKora <b>GDJ</b></span>
        </a>
        <div className="sidebar-label">ESPACE DE TRAVAIL</div>
        <button className="side-link selected" onClick={() => { setActiveProjectId(null); setShowForm(false); }}>
          <span>◫</span> Vue d'ensemble
        </button>
        <button className="side-link" onClick={() => setShowForm(true)}>
          <span>＋</span> Nouveau besoin
        </button>
        <a className="side-link" href="#methode"><span>✳</span> Comment ça marche</a>
        <div className="sidebar-bottom">
          <div className="sidebar-mini-mark">✳</div>
          <strong>Les besoins d’abord.</strong>
          <p>Les solutions ensuite.</p>
          <span className="prototype-pill"><i /> Prototype de travail</span>
        </div>
      </aside>

      <section className="main-area" id="accueil">
        <header className="topbar">
          <div>
            <div className="breadcrumb">MerKora GDJ <span>/</span> Espace de travail</div>
            <p className="topbar-subtitle">Donnez une forme concrète à vos idées.</p>
          </div>
          <div className="topbar-right">
            <span className="local-indicator"><i /> {supabase ? "Sauvegarde en ligne" : "Données locales"}</span>
            {currentUser && <span style={{ fontSize: "13px" }}>{currentUser.email}</span>}
            {currentUser ? <button className="button button-quiet" onClick={handleSignOut}>Déconnexion</button> : <button className="avatar" aria-label="Profil de démonstration">M</button>}
          </div>
        </header>

        <div className="content-wrap">
          {authError && <div className="notice" role="status" style={{ marginBottom: "18px" }}><span>ⓘ</span><p>{authError}</p><button className="button button-quiet" onClick={() => setAuthError("")}>Fermer</button></div>}
          <section className="welcome-row">
            <div>
              <div className="eyebrow"><span className="eyebrow-star">✳</span> VOTRE ESPACE POUR CONSTRUIRE</div>
              <h1>Bonjour, <span>créateur.</span></h1>
              <p>Un projet commence rarement par le bon outil. Il commence par une question à résoudre.</p>
            </div>
            <button className="button button-primary" onClick={() => { setShowForm(true); setActiveProjectId(null); }}>
              <span>＋</span> Décrire un besoin
            </button>
          </section>

          <section className="metric-grid" aria-label="Résumé des projets">
            <article className="metric-card">
              <span className="metric-icon violet">◈</span><span className="metric-label">MES PROJETS</span>
              <strong>{projects.length.toString().padStart(2, "0")}</strong>
              <small>{supabase ? "Dossiers synchronisés avec votre compte" : "Enregistrés sur cet appareil"}</small>
            </article>
            <article className="metric-card">
              <span className="metric-icon green">✳</span><span className="metric-label">BESOINS À CLARIFIER</span>
              <strong>{projects.filter((project) => project.status === "discovery").length.toString().padStart(2, "0")}</strong>
              <small>En attente d'analyse approfondie</small>
            </article>
            <article className="metric-card">
              <span className="metric-icon amber">↗</span><span className="metric-label">PROCHAINES ÉTAPES</span>
              <strong>{projects.reduce((count, project) => count + project.recommendations.length, 0).toString().padStart(2, "0")}</strong>
              <small>Pistes préliminaires proposées</small>
            </article>
          </section>

          {showForm ? (
            <section className="panel form-panel">
              <div className="panel-heading">
                <div><div className="eyebrow">ÉTAPE 01 · COMPRÉHENSION</div><h2>Parlons de votre besoin.</h2><p>Expliquez la situation comme vous la vivez. Pas besoin de connaître la solution technique.</p></div>
                <button className="icon-button" onClick={() => { setShowForm(false); setErrors([]); }} aria-label="Fermer le formulaire">×</button>
              </div>
              <form onSubmit={submitNeed} className="need-form">
                <label>Titre du projet <span>*</span>
                  <input value={form.title} onChange={(event) => updateForm("title", event.target.value)} placeholder="Ex. Mieux organiser mon activité" maxLength={100} />
                </label>
                <label>Quel type de besoin décrivez-vous ?
                  <select value={form.category} onChange={(event) => updateForm("category", event.target.value as NeedCategory)}>
                    {categoryOptions.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
                  </select>
                </label>
                <label className="field-wide">Qu'est-ce qui se passe aujourd'hui ? <span>*</span>
                  <textarea value={form.problem} onChange={(event) => updateForm("problem", event.target.value)} placeholder="Décrivez la difficulté, ce qui vous fait perdre du temps, de l'argent ou de la tranquillité…" rows={4} maxLength={2500} />
                  <small>{form.problem.length}/2500 caractères</small>
                </label>
                <label className="field-wide">Quel résultat aimeriez-vous obtenir ? <span>*</span>
                  <textarea value={form.desiredOutcome} onChange={(event) => updateForm("desiredOutcome", event.target.value)} placeholder="Imaginez la situation idéale : qu'est-ce qui devrait changer ?" rows={3} maxLength={1500} />
                </label>
                <label>Budget envisagé
                  <select value={form.budget} onChange={(event) => updateForm("budget", event.target.value)}>
                    <option>À définir</option><option>Moins de 25 000 FCFA</option><option>25 000 – 100 000 FCFA</option><option>100 000 – 500 000 FCFA</option><option>Plus de 500 000 FCFA</option>
                  </select>
                </label>
                <label>Priorité
                  <select value={form.urgency} onChange={(event) => updateForm("urgency", event.target.value)}>
                    <option value="normal">Normale</option><option value="high">À traiter bientôt</option><option value="urgent">Urgente</option>
                  </select>
                </label>
                {errors.length > 0 && <div className="form-errors" role="alert">{errors.map((error) => <p key={error}>• {error}</p>)}</div>}
                <div className="form-footer"><p>{supabase ? "Votre dossier sera enregistré dans votre espace en ligne après validation." : "Votre dossier sera enregistré dans ce navigateur."}</p><button className="button button-primary" type="submit">Analyser mon besoin <span>→</span></button></div>
              </form>
            </section>
          ) : activeProject ? (
            <section className="panel project-detail">
              <div className="panel-heading">
                <div><div className="eyebrow">DOSSIER · {activeProject.id}</div><h2>{activeProject.title}</h2><p>{getCategoryLabel(activeProject.category)} · Créé le {new Date(activeProject.createdAt).toLocaleDateString("fr-FR")}</p></div>
                <button className="icon-button" onClick={() => setActiveProjectId(null)} aria-label="Retour à la liste">×</button>
              </div>
              <div className="detail-status"><span className="status-dot" /> {statusLabels[activeProject.status]} <span className="status-note">· Pré-analyse locale, sans IA connectée</span></div>
              <div className="detail-grid">
                <article><span className="detail-label">LA SITUATION</span><p>{activeProject.problem}</p></article>
                <article><span className="detail-label">LE RÉSULTAT SOUHAITÉ</span><p>{activeProject.desiredOutcome}</p></article>
                <article><span className="detail-label">BUDGET ENVISAGÉ</span><p>{activeProject.budget}</p></article>
                <article><span className="detail-label">PRIORITÉ</span><p>{activeProject.urgency === "urgent" ? "Urgente" : activeProject.urgency === "high" ? "À traiter bientôt" : "Normale"}</p></article>
              </div>
              <div className="recommendation-heading"><div><div className="eyebrow">PISTES DE RÉFLEXION</div><h3>Premières directions possibles</h3></div><span className="local-tag">Préliminaire</span></div>
              <div className="recommendation-list">
                {activeProject.recommendations.map((recommendation, index) => (
                  <article className="recommendation-card" key={recommendation.title}>
                    <span className="recommendation-number">{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <h4>{recommendation.title}</h4>
                      <p>{recommendation.description}</p>
                      <small>{recommendation.reason}</small>
                      {recommendation.tradeoff && <p className="recommendation-tradeoff"><strong>À prendre en compte :</strong> {recommendation.tradeoff}</p>}
                      {recommendation.nextStep && <p className="recommendation-next-step"><strong>Prochaine action :</strong> {recommendation.nextStep}</p>}
                    </div>
                  </article>
                ))}
              </div>
              <div className="notice"><span>ⓘ</span><p>Ces pistes sont générées par des règles locales simples. Elles ne constituent ni un diagnostic IA, ni un devis, ni une promesse de réalisation.</p></div>
              <button className="button button-quiet danger-button" onClick={() => deleteProject(activeProject.id)}>Supprimer ce dossier</button>
            </section>
          ) : (
            <section className="project-section">
              <div className="section-title-row"><div><div className="eyebrow">VOTRE PORTFOLIO</div><h2>Vos projets</h2><p>Chaque besoin devient un dossier que vous pouvez reprendre et approfondir.</p></div><span className="count-chip">{projects.length} dossier{projects.length > 1 ? "s" : ""}</span></div>
              {projects.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-illustration"><div className="empty-orbit orbit-a" /><div className="empty-orbit orbit-b" /><span>✳</span></div>
                  <h3>Votre prochaine idée commence ici.</h3>
                  <p>Décrivez un problème, une ambition ou une tâche que vous aimeriez améliorer. MerKora vous aidera à organiser les premières pistes.</p>
                  <button className="button button-primary" onClick={() => setShowForm(true)}>＋ Décrire mon premier besoin</button>
                </div>
              ) : (
                <div className="project-list">
                  {projects.map((project) => (
                    <article className="project-card" key={project.id}>
                      <div className="project-symbol">◈</div>
                      <button className="project-main" onClick={() => setActiveProjectId(project.id)}>
                        <strong>{project.title}</strong><span>{getCategoryLabel(project.category)}</span><small>{project.problem.slice(0, 110)}{project.problem.length > 110 ? "…" : ""}</small>
                      </button>
                      <div className="project-card-end"><span className="status-chip">{statusLabels[project.status]}</span><button className="open-project" onClick={() => setActiveProjectId(project.id)} aria-label={`Ouvrir ${project.title}`}>↗</button></div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}

          <section className="method-section" id="methode">
            <div><div className="eyebrow">LA MÉTHODE MERKORA</div><h2>Du pourquoi<br />à la solution.</h2><p>On ne choisit pas un outil avant d'avoir compris le besoin.</p></div>
            <div className="method-steps">
              <article><span>01</span><div><strong>Comprendre</strong><p>Clarifier le problème, le contexte et l'objectif.</p></div></article>
              <article><span>02</span><div><strong>Explorer</strong><p>Comparer des pistes sans promettre trop tôt.</p></div></article>
              <article><span>03</span><div><strong>Concevoir</strong><p>Définir le périmètre, les coûts et les validations.</p></div></article>
              <article><span>04</span><div><strong>Réaliser & vérifier</strong><p>Construire, tester, puis livrer avec transparence.</p></div></article>
            </div>
          </section>

          <footer className="footer"><span className="footer-brand">M <b>MerKora GDJ</b></span><span>Les besoins d’abord. Les solutions ensuite.</span><span>Version de travail · {new Date().getFullYear()}</span></footer>
        </div>
      </section>
    </main>
  );
}