"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  addWorkspaceRole,
  buildWorkspacePlan,
  getWorkspaceRoleSummary,
  setWorkspaceRoleEnabled,
  simulateWorkspaceAction,
  updateWorkspaceRole,
  type WorkspaceAccess,
  type WorkspaceEvent,
  type WorkspacePlan,
} from "../../src/lib/merkora-core/screen-seven";
import type { SolutionProposal } from "../../src/lib/merkora-core/solution-proposal";

const PROPOSAL_KEY = "merkora-v2-solution-proposal";
const PLAN_KEY = "merkora-v2-screen-seven-plan";
const LAUNCH_KEY = "merkora-v2-screen-seven-launch";

type LaunchState = "preview" | "validated" | "requested";

const styles: Record<string, React.CSSProperties> = {
  panel: { background: "rgba(255,255,255,.045)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 18, padding: 20 },
  muted: { color: "rgba(255,255,255,.68)", lineHeight: 1.6 },
  button: { border: "1px solid rgba(255,255,255,.2)", borderRadius: 12, padding: "10px 14px", color: "inherit", background: "rgba(255,255,255,.07)", cursor: "pointer" },
  field: { display: "grid", gap: 7, color: "rgba(255,255,255,.8)", fontSize: 13 },
  input: { width: "100%", border: "1px solid rgba(255,255,255,.2)", borderRadius: 10, background: "rgba(0,0,0,.22)", color: "inherit", padding: "11px 12px" },
};

export default function WorkspaceDesignPage() {
  const [plan, setPlan] = useState<WorkspacePlan | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [launchState, setLaunchState] = useState<LaunchState>("preview");
  const [loaded, setLoaded] = useState(false);
  const [problem, setProblem] = useState("");
  const [newRoleLabel, setNewRoleLabel] = useState("");
  const [newRoleDescription, setNewRoleDescription] = useState("");
  const [newRoleAccess, setNewRoleAccess] = useState<WorkspaceAccess>("authenticated");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(PROPOSAL_KEY);
      const stored = raw ? JSON.parse(raw) as { proposal?: SolutionProposal } : null;
      const profile = stored?.proposal?.productProfile;
      if (!profile) {
        setProblem("La proposition de l'écran 06 est introuvable. Termine d'abord la composition du produit.");
        setLoaded(true);
        return;
      }
      const savedPlanRaw = window.sessionStorage.getItem(PLAN_KEY);
      const savedPlan = savedPlanRaw ? JSON.parse(savedPlanRaw) as WorkspacePlan : null;
      const initialPlan = savedPlan?.productTypeId === profile.productTypeId
        ? savedPlan
        : buildWorkspacePlan(profile);
      setPlan(initialPlan);
      setSelectedRoleId(initialPlan.roles.find((role) => role.enabled)?.id ?? "");
      const savedLaunch = window.sessionStorage.getItem(LAUNCH_KEY) as LaunchState | null;
      if (savedLaunch === "validated" || savedLaunch === "requested") setLaunchState(savedLaunch);
    } catch {
      setProblem("Les informations de conception n'ont pas pu être lues dans cette session.");
    }
    setLoaded(true);
  }, []);

  const selectedRole = useMemo(
    () => plan?.roles.find((role) => role.id === selectedRoleId) ?? plan?.roles[0] ?? null,
    [plan, selectedRoleId],
  );

  function persist(next: WorkspacePlan) {
    setPlan(next);
    try {
      window.sessionStorage.setItem(PLAN_KEY, JSON.stringify(next));
    } catch {
      setNotice("Les changements sont visibles, mais le navigateur n'a pas pu les conserver.");
    }
  }

  function updateRoleLabel(roleId: string, label: string) {
    if (!plan) return;
    persist(updateWorkspaceRole(plan, roleId, { label }));
  }

  function togglePermission(permission: string) {
    if (!plan || !selectedRole) return;
    const permissions = selectedRole.permissions.includes(permission)
      ? selectedRole.permissions.filter((item) => item !== permission)
      : [...selectedRole.permissions, permission];
    persist(updateWorkspaceRole(plan, selectedRole.id, { permissions }));
  }

  function addRole() {
    if (!plan || !newRoleLabel.trim()) return;
    const id = newRoleLabel.trim().toLocaleLowerCase("fr")
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
    try {
      const next = addWorkspaceRole(plan, {
        id,
        label: newRoleLabel.trim(),
        description: newRoleDescription.trim() || "Espace personnalisé à définir.",
        access: newRoleAccess,
        permissions: ["view_assigned_information"],
      });
      persist(next);
      setSelectedRoleId(id);
      setNewRoleLabel("");
      setNewRoleDescription("");
      setNotice("Le nouvel espace a été ajouté à ton organisation.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Impossible d'ajouter ce profil.");
    }
  }

  function runDemo(kind: WorkspaceEvent["kind"]) {
    if (!plan) return;
    persist(simulateWorkspaceAction(plan, kind));
    setNotice("Simulation enregistrée. Consulte les espaces concernés pour voir où l'événement est visible.");
  }

  function changeLaunchState(next: LaunchState) {
    setLaunchState(next);
    try {
      window.sessionStorage.setItem(LAUNCH_KEY, next);
    } catch {
      setNotice("Le statut est visible, mais n'a pas pu être conservé dans cette session.");
    }
  }

  const enabledCount = plan?.roles.filter((role) => role.enabled).length ?? 0;
  const selectedEvents = plan?.events.filter((event) => selectedRole && event.visibleToRoleIds.includes(selectedRole.id)) ?? [];

  return (
    <main className="mk-v2-page mk-stage-page" style={{ minHeight: "100vh" }}>
      <div className="mk-v2-noise" aria-hidden="true" />
      <header className="mk-header">
        <a className="mk-brand" href="/" aria-label="MerKora GDJ, accueil">
          <span className="mk-brand-mark">M</span>
          <span><strong>MerKora</strong><small>GUIDED DIGITAL JOURNEY · V2</small></span>
        </a>
        <a className="mk-back-link" href="/solution-proposal">← Retour à l'écran 06</a>
      </header>

      <section className="mk-stage-shell" style={{ maxWidth: 1180 }}>
        <div className="mk-stage-heading">
          <div className="mk-stage-steps">
            <span className="done">01 · Entrée</span><span className="done">02 · Conversation</span>
            <span className="done">03 · Compréhension</span><span className="done">04 · Diagnostic</span>
            <span className="done">05 · Définition</span><span className="done">06 · Solution</span>
            <span className="active">07 · Espaces et simulation</span>
          </div>
          <span className="mk-eyebrow"><span /> ÉTAPE 07 · ORGANISATION ET EXPÉRIENCE DU PRODUIT</span>
          <h1>Organisons les espaces<br /><em>de ton futur produit.</em></h1>
          <p>MerKora propose une organisation de départ. Tu peux la modifier, ajouter des profils et tester comment les actions circulent entre les personnes. Rien n'est figé sans ta validation.</p>
        </div>

        {!loaded && <section className="mk-stage-empty"><p>Préparation des espaces du produit…</p></section>}
        {loaded && problem && (
          <section className="mk-stage-empty">
            <h2>Le produit n'est pas encore prêt pour cette étape</h2><p>{problem}</p>
            <a className="mk-continue-button" href="/solution-proposal">Revenir à l'écran 06 <span>→</span></a>
          </section>
        )}

        {loaded && plan && (
          <div style={{ display: "grid", gap: 20 }}>
            <section style={styles.panel}>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                <div><span className="mk-summary-kicker">ORGANISATION PROPOSÉE · MODIFIABLE</span><h2 style={{ margin: "8px 0" }}>{plan.projectName}</h2><p style={styles.muted}>Le propriétaire dispose d'un espace privé. Les autres profils ont uniquement les accès qui leur sont attribués.</p></div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <span className="mk-solution-count">{enabledCount} espace(s) actif(s)</span><span className="mk-solution-count">{plan.events.length} simulation(s)</span>
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 9, marginTop: 18 }}>
                {plan.roles.map((role) => (
                  <button key={role.id} type="button" aria-pressed={selectedRoleId === role.id} onClick={() => setSelectedRoleId(role.id)}
                    style={{ ...styles.button, opacity: role.enabled ? 1 : .48, borderColor: selectedRoleId === role.id ? "#a6d5ff" : "rgba(255,255,255,.2)", background: selectedRoleId === role.id ? "rgba(92,160,220,.2)" : "rgba(255,255,255,.07)" }}>
                    <strong>{role.label}</strong><small style={{ display: "block", marginTop: 4, opacity: .72 }}>{role.access === "public" ? "Public" : role.scope === "owner" ? "Propriétaire" : role.scope === "operational" ? "Équipe" : "Utilisateur"}</small>
                  </button>
                ))}
              </div>
            </section>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,340px),1fr))", gap: 20 }}>
              <section style={styles.panel}>
                <span className="mk-summary-kicker">ESPACE SÉLECTIONNÉ</span>
                {selectedRole ? (
                  <>
                    <h2 style={{ margin: "8px 0" }}>{selectedRole.label}</h2>
                    <p style={styles.muted}>{selectedRole.description}</p>
                    <p style={{ fontSize: 12, opacity: .7 }}>{getWorkspaceRoleSummary(selectedRole)}</p>
                    <label style={{ ...styles.field, marginTop: 16 }}>Nom de cet espace
                      <input style={styles.input} value={selectedRole.label} onChange={(event) => updateRoleLabel(selectedRole.id, event.target.value)} />
                    </label>
                    <label style={{ ...styles.field, marginTop: 14 }}>Description
                      <textarea style={{ ...styles.input, minHeight: 76 }} value={selectedRole.description} onChange={(event) => {
                        if (plan) persist(updateWorkspaceRole(plan, selectedRole.id, { description: event.target.value }));
                      }} />
                    </label>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", marginTop: 16 }}>
                      <strong>Activer cet espace</strong>
                      <input type="checkbox" aria-label="Activer cet espace" checked={selectedRole.enabled} disabled={selectedRole.id === "project_owner_admin"} onChange={(event) => {
                        if (!plan) return;
                        persist(setWorkspaceRoleEnabled(plan, selectedRole.id, event.target.checked));
                      }} />
                    </div>
                    <div style={{ marginTop: 20 }}>
                      <strong>Permissions de ce profil</strong>
                      <p style={styles.muted}>Coche uniquement les actions que ce profil est autorisé à effectuer.</p>
                      <div style={{ display: "grid", gap: 9, marginTop: 10 }}>
                        {selectedRole.permissions.map((permission) => (
                          <label key={permission} style={{ display: "flex", gap: 9, alignItems: "center" }}>
                            <input type="checkbox" checked onChange={() => togglePermission(permission)} />
                            <span>{permission.replace(/_/g, " ")}</span>
                          </label>
                        ))}
                        <label style={{ display: "flex", gap: 9, alignItems: "center" }}>
                          <input type="checkbox" checked={false} onChange={() => togglePermission("view_assigned_information")} />
                          <span>Ajouter l'accès : view assigned information</span>
                        </label>
                      </div>
                    </div>
                    <div style={{ marginTop: 16, borderTop: "1px solid rgba(255,255,255,.12)", paddingTop: 12 }}>
                      <strong>Événements visibles dans cet espace</strong>
                      {selectedEvents.length === 0 ? <p style={styles.muted}>Aucun événement simulé pour ce profil.</p> : selectedEvents.map((event) => <p key={event.id} style={{ ...styles.muted, marginBottom: 6 }}>• {event.title}</p>)}
                    </div>
                  </>
                ) : <p style={styles.muted}>Sélectionne un profil.</p>}
              </section>

              <section style={styles.panel}>
                <span className="mk-summary-kicker">LIBERTÉ DE CONSTRUCTION</span>
                <h2 style={{ margin: "8px 0" }}>Ajouter un nouvel espace</h2>
                <p style={styles.muted}>Crée un profil supplémentaire lorsque ton activité comporte un rôle qui n'est pas encore représenté.</p>
                <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
                  <label style={styles.field}>Nom du profil<input style={styles.input} value={newRoleLabel} onChange={(event) => setNewRoleLabel(event.target.value)} placeholder="Ex. : Livreur, superviseur…" /></label>
                  <label style={styles.field}>Responsabilité<textarea style={{ ...styles.input, minHeight: 76 }} value={newRoleDescription} onChange={(event) => setNewRoleDescription(event.target.value)} placeholder="Que doit faire cette personne ?" /></label>
                  <label style={styles.field}>Accès
                    <select style={styles.input} value={newRoleAccess} onChange={(event) => setNewRoleAccess(event.target.value as WorkspaceAccess)}>
                      <option value="authenticated">Compte utilisateur requis</option><option value="public">Accessible au public</option><option value="private">Accès privé / invitation</option>
                    </select>
                  </label>
                  <button type="button" style={styles.button} onClick={addRole} disabled={!newRoleLabel.trim()}>+ Ajouter cet espace</button>
                </div>
                <div style={{ marginTop: 24, borderTop: "1px solid rgba(255,255,255,.12)", paddingTop: 16 }}>
                  <span className="mk-summary-kicker">SIMULER LES INTERACTIONS</span>
                  <p style={styles.muted}>Ces actions sont fictives et restent dans la prévisualisation. Elles montrent quels espaces reçoivent chaque événement.</p>
                  <div style={{ display: "grid", gap: 9 }}>
                    <button type="button" style={styles.button} onClick={() => runDemo("customer_order_created")}>Simuler une commande client</button>
                    <button type="button" style={styles.button} onClick={() => runDemo("staff_attendance_recorded")}>Simuler un pointage</button>
                    <button type="button" style={styles.button} onClick={() => runDemo("learner_grade_published")}>Simuler la publication d'un résultat</button>
                  </div>
                </div>
              </section>
            </div>

            <section style={styles.panel}>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                <div><span className="mk-summary-kicker">JOURNAL DE SIMULATION</span><h2 style={{ margin: "8px 0" }}>Ce qui circule entre les espaces</h2></div>
                <button type="button" style={styles.button} onClick={() => persist({ ...plan, events: [], version: plan.version + 1 })} disabled={plan.events.length === 0}>Effacer les simulations</button>
              </div>
              {plan.events.length === 0 ? <p style={styles.muted}>Lance une simulation pour observer la circulation des informations entre les profils.</p> : (
                <div style={{ display: "grid", gap: 12 }}>
                  {plan.events.map((event) => (
                    <article key={event.id} style={{ borderTop: "1px solid rgba(255,255,255,.12)", paddingTop: 12 }}>
                      <strong>{event.title}</strong><p style={styles.muted}>{event.description}</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                        {event.visibleToRoleIds.map((id) => <span className="mk-solution-count" key={id}>{plan.roles.find((role) => role.id === id)?.label ?? id}</span>)}
                        {event.visibleToRoleIds.length === 0 && <span style={styles.muted}>Aucun espace actif destinataire</span>}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <section style={styles.panel}>
              <span className="mk-summary-kicker">PRÉVISUALISATION ET MISE EN SERVICE</span>
              <h2 style={{ margin: "8px 0" }}>Tu gardes la main sur le lancement.</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 10, margin: "18px 0" }}>
                <div><strong>1. Prévisualisation privée</strong><p style={styles.muted}>MerKora prépare un lien de test lorsque le produit est construit.</p><span className="mk-solution-count">Étape de conception</span></div>
                <div><strong>2. Validation du client</strong><p style={styles.muted}>Tu testes les profils et confirmes que le résultat te convient.</p><span className="mk-solution-count">{launchState === "preview" ? "En attente" : "Validée"}</span></div>
                <div><strong>3. Contrôle et activation</strong><p style={styles.muted}>MerKora vérifie les conditions puis active la version officielle après confirmation.</p><span className="mk-solution-count">{launchState === "requested" ? "Demande transmise" : "Pas encore demandé"}</span></div>
              </div>
              {launchState === "preview" && <button type="button" className="mk-continue-button" onClick={() => changeLaunchState("validated")}>Je valide l'organisation et la prévisualisation <span>→</span></button>}
              {launchState === "validated" && <div><p style={styles.muted}>Ta validation est enregistrée dans cette session. La demande de lancement ne publie rien automatiquement.</p><button type="button" className="mk-continue-button" onClick={() => changeLaunchState("requested")}>Confirmer ma demande de mise en service <span>→</span></button></div>}
              {launchState === "requested" && <div role="status" style={{ border: "1px solid rgba(120,210,160,.35)", borderRadius: 12, padding: 14 }}><strong>Demande de mise en service préparée</strong><p style={styles.muted}>Cette confirmation est une simulation de parcours. L'activation réelle nécessitera les contrôles et l'action de MerKora. Aucun déploiement n'a été effectué.</p></div>}
              <button type="button" style={{ ...styles.button, marginTop: 12, display: "block" }} onClick={() => changeLaunchState("preview")}>Revenir à l'état de prévisualisation</button>
            </section>
            {notice && <p className="mk-stage-notice" role="status">{notice}</p>}
          </div>
        )}
      </section>
      <footer className="mk-footer"><span><b>MerKora GDJ</b> · Concevoir, tester, valider.</span><span>Le client garde le contrôle.</span></footer>
    </main>
  );
}
