"use client";

import "./visualization.css";

import React, { useEffect, useMemo, useState } from "react";
import { buildVisualBlueprint, type VisualBlueprint } from "../../src/lib/merkora-core/visual-blueprint";
import type { ProjectUnderstanding } from "../../src/lib/merkora-core/project-diagnostic";
import type { ProductDefinitionSession } from "../../src/lib/merkora-core/product-definition";
import type { SolutionProposal } from "../../src/lib/merkora-core/solution-proposal";

const DOSSIER_KEY = "merkora-v2-project-understanding";
const DEFINITION_KEY = "merkora-v2-product-definition-session";
const PROPOSAL_KEY = "merkora-v2-solution-proposal";
const FEEDBACK_KEY = "merkora-v2-visualization-feedback";
const VALIDATION_KEY = "merkora-v2-visualization-validation";

interface StoredProposal {
  definitionVersion: number;
  proposal: SolutionProposal;
  validated: boolean;
}

interface StoredValidation {
  proposalVersion: number;
  validatedAt: string;
}

export default function VisualisationPage() {
  const [blueprint, setBlueprint] = useState<VisualBlueprint | null>(null);
  const [activeProfile, setActiveProfile] = useState(0);
  const [activeScreen, setActiveScreen] = useState(0);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [activeFlow, setActiveFlow] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [problem, setProblem] = useState("");
  const [simulationMessage, setSimulationMessage] = useState("");
  const [feedbackDraft, setFeedbackDraft] = useState("");
  const [feedbackItems, setFeedbackItems] = useState<string[]>([]);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    try {
      const dossierRaw = window.sessionStorage.getItem(DOSSIER_KEY);
      const definitionRaw = window.sessionStorage.getItem(DEFINITION_KEY);
      const proposalRaw = window.sessionStorage.getItem(PROPOSAL_KEY);
      if (!dossierRaw || !definitionRaw || !proposalRaw) {
        setProblem("Les informations des étapes précédentes sont introuvables dans cet onglet.");
      } else {
        const dossier = JSON.parse(dossierRaw) as ProjectUnderstanding;
        const definition = JSON.parse(definitionRaw) as ProductDefinitionSession;
        const stored = JSON.parse(proposalRaw) as StoredProposal;
        if (!stored.validated) {
          setProblem("La composition de la solution doit d'abord être validée à l'écran 06.");
        } else if (definition.status !== "ready_for_review" || stored.definitionVersion !== definition.version) {
          setProblem("La définition du produit a changé. Vérifie à nouveau la composition à l'écran 06.");
        } else if (stored.proposal.projectId !== dossier.projectId) {
          setProblem("Les données chargées ne correspondent pas au même projet.");
        } else {
          const nextBlueprint = buildVisualBlueprint(dossier, definition, stored.proposal);
          setBlueprint(nextBlueprint);
          const feedbackRaw = window.sessionStorage.getItem(FEEDBACK_KEY);
          if (feedbackRaw) {
            const savedFeedback = JSON.parse(feedbackRaw) as string[];
            if (Array.isArray(savedFeedback)) setFeedbackItems(savedFeedback);
          }
          const validationRaw = window.sessionStorage.getItem(VALIDATION_KEY);
          if (validationRaw) {
            const savedValidation = JSON.parse(validationRaw) as StoredValidation;
            setValidated(savedValidation.proposalVersion === stored.proposal.version);
          }
        }
      }
    } catch {
      setProblem("La maquette n'a pas pu être préparée à partir des données de cette session.");
    }
    setLoaded(true);
  }, []);

  const currentScreen = useMemo(
    () => blueprint?.screens[activeScreen] ?? null,
    [blueprint, activeScreen],
  );
  const activeProfileData = blueprint?.profiles[activeProfile] ?? null;
  const selectedFeature = currentScreen?.items.find((item) => item === activeFeature) ?? activeFeature;

  function openFeature(item: string) {
    setActiveFeature(item);
    setSimulationMessage("");
  }

  function simulateFeature() {
    setSimulationMessage("Simulation terminée. Aucune donnée réelle n'a été créée, envoyée ou enregistrée.");
  }

  function saveFeedback() {
    const note = feedbackDraft.trim();
    if (!note) return;
    const next = [...feedbackItems, note];
    setFeedbackItems(next);
    setFeedbackDraft("");
    try {
      window.sessionStorage.setItem(FEEDBACK_KEY, JSON.stringify(next));
    } catch {
      setProblem("La retouche est visible dans cet écran, mais le navigateur n'a pas pu la conserver.");
    }
  }

  function validateVisualization() {
    if (!blueprint) return;
    const validation: StoredValidation = {
      proposalVersion: blueprint.sourceVersion,
      validatedAt: new Date().toISOString(),
    };
    try {
      window.sessionStorage.setItem(VALIDATION_KEY, JSON.stringify(validation));
      setValidated(true);
    } catch {
      setProblem("La validation est visible, mais le navigateur n'a pas pu la conserver dans cet onglet.");
    }
  }

  return (
    <main className="mk-v2-page mk-stage-page mk-visual-page">
      <div className="mk-v2-noise" aria-hidden="true" />
      <header className="mk-header">
        <a className="mk-brand" href="/" aria-label="MerKora GDJ, accueil">
          <span className="mk-brand-mark">M</span>
          <span><strong>MerKora</strong><small>GUIDED DIGITAL JOURNEY · V2</small></span>
        </a>
        <a className="mk-back-link" href="/solution-proposal">← Retour à l'écran 06</a>
      </header>

      <section className="mk-stage-shell">
        <div className="mk-stage-heading">
          <div className="mk-stage-steps">
            <span className="done">01 · Entrée</span><span className="done">02 · Conversation</span>
            <span className="done">03 · Compréhension</span><span className="done">04 · Diagnostic</span>
            <span className="done">05 · Définition</span><span className="done">06 · Solution</span>
            <span className="active">07 · Maquette</span>
          </div>
          <span className="mk-eyebrow"><span /> ÉTAPE 07 · VISUALISATION DU PRODUIT</span>
          <h1>Découvrons ton futur<br /><em>produit en situation.</em></h1>
          <p>Explore les écrans, change de profil et teste les interactions. Tu peux aussi demander une retouche avant de valider cette représentation.</p>
        </div>

        {!loaded && <section className="mk-stage-empty"><p>Préparation de la maquette…</p></section>}
        {loaded && problem && (
          <section className="mk-stage-empty">
            <h2>La maquette n'est pas encore disponible</h2><p>{problem}</p>
            <a className="mk-continue-button" href="/solution-proposal">Revenir à l'écran 06 <span>→</span></a>
          </section>
        )}

        {blueprint && (
          <>
            <section className="mk-visual-intro">
              <div><span className="mk-summary-kicker">APERÇU DU PROJET</span><h2>{blueprint.projectTitle}</h2><p>{blueprint.summary}</p></div>
              <span className="mk-visual-kind">{blueprint.kind === "digital" ? "Prototype d'interface" : "Parcours opérationnel"}</span>
            </section>

            {blueprint.kind === "digital" ? (
              <section className="mk-prototype-shell" aria-label="Prototype visuel interactif">
                <aside className="mk-prototype-sidebar">
                  <div className="mk-prototype-brand"><span>M</span><strong>{blueprint.projectTitle}</strong></div>
                  <small>ESPACES DU PRODUIT</small>
                  <nav aria-label="Écrans du prototype">
                    {blueprint.screens.map((screen, index) => (
                      <button type="button" key={screen.id} className={activeScreen === index ? "active" : ""} onClick={() => { setActiveScreen(index); setActiveFeature(null); setSimulationMessage(""); }}>
                        <span>{String(index + 1).padStart(2, "0")}</span>{screen.title}
                      </button>
                    ))}
                  </nav>
                  <div className="mk-prototype-sidebar-note">Maquette de conception · aucune opération réelle</div>
                </aside>
                <div className="mk-prototype-main">
                  <div className="mk-prototype-topbar">
                    <span>APERÇU DU PRODUIT · MODE DÉMONSTRATION</span>
                    <span className="mk-prototype-avatar">{activeProfileData?.name.slice(0, 1).toUpperCase()}</span>
                  </div>
                  <div className="mk-prototype-content">
                    <div className="mk-prototype-welcome">
                      <div>
                        <small>ESPACE DE TRAVAIL</small>
                        <h2>{currentScreen?.title ?? "Vue d'ensemble"}</h2>
                        <p>{currentScreen?.description}</p>
                      </div>
                      <span>Bonjour, {activeProfileData?.name}</span>
                    </div>

                    <div className="mk-prototype-metrics">
                      <article><span>FONCTIONS RETENUES</span><strong>{blueprint.screens.reduce((total, screen) => total + screen.items.length, 0)}</strong><small>Dans la composition validée</small></article>
                      <article><span>PROFILS IDENTIFIÉS</span><strong>{blueprint.profiles.length}</strong><small>Selon la définition du projet</small></article>
                      <article><span>POINTS À CONFIRMER</span><strong>{blueprint.unresolvedPoints.length}</strong><small>Restent ouverts à cette étape</small></article>
                    </div>

                    <div className="mk-prototype-profile-switch">
                      <label className="mk-prototype-profile-select">
                        <span>APERÇU EN TANT QUE</span>
                        <select value={activeProfile} onChange={(event) => { setActiveProfile(Number(event.target.value)); setActiveFeature(null); setSimulationMessage(""); }}>
                          {blueprint.profiles.map((profile, index) => (
                            <option value={index} key={profile.id}>{profile.name}</option>
                          ))}
                        </select>
                      </label>
                      <p>{activeProfileData?.note} La sélection permet d'examiner ce profil ; elle ne définit pas encore ses autorisations.</p>
                      {activeProfileData && activeProfileData.responsibilities.length > 0 && (
                        <div className="mk-prototype-responsibilities">
                          <small>RESPONSABILITÉS DÉCRITES POUR CE PROFIL</small>
                          <ul>
                            {activeProfileData.responsibilities.slice(0, 4).map((item, index) => <li key={index}>{item}</li>)}
                          </ul>
                          {activeProfileData.responsibilities.length > 4 && (
                            <details>
                              <summary>Voir les autres responsabilités ({activeProfileData.responsibilities.length - 4})</summary>
                              <ul>{activeProfileData.responsibilities.slice(4).map((item, index) => <li key={index}>{item}</li>)}</ul>
                            </details>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="mk-prototype-screen-toolbar">
                      <div><strong>{currentScreen?.title ?? "Espace"}</strong><small>{currentScreen?.items.length ?? 0} fonction(s) retenue(s)</small></div>
                      {currentScreen?.items[0] && <button type="button" onClick={() => openFeature(currentScreen.items[0])}>Tester une action <span>↗</span></button>}
                    </div>

                    <div className="mk-prototype-cards">
                      {(currentScreen?.items ?? []).map((item, index) => (
                        <button type="button" className="mk-prototype-feature-card" key={item} onClick={() => openFeature(item)}>
                          <span className="mk-prototype-card-icon">{String(index + 1).padStart(2, "0")}</span>
                          <span className="mk-prototype-feature-copy"><small>FONCTION RETENUE</small><strong>{item}</strong><em>Ouvrir l'aperçu et tester</em></span>
                          <span className="mk-prototype-card-arrow">↗</span>
                        </button>
                      ))}
                      {(!currentScreen || currentScreen.items.length === 0) && <p>Aucun élément confirmé dans cet espace pour le moment.</p>}
                    </div>

                    {selectedFeature && (
                      <section className="mk-prototype-action-panel">
                        <div className="mk-prototype-action-heading"><div><small>APERÇU D'INTERACTION</small><h3>{selectedFeature}</h3></div><button type="button" className="mk-prototype-close" onClick={() => { setActiveFeature(null); setSimulationMessage(""); }} aria-label="Fermer l'aperçu">×</button></div>
                        <p>Voici une proposition de présentation. Les champs ci-dessous sont illustratifs et devront être confirmés dans la conception détaillée.</p>
                        <div className="mk-prototype-demo-fields">
                          {(currentScreen?.previewFields ?? []).map((field) => <label key={field}>{field}<input type="text" placeholder="À renseigner dans le produit final" /></label>)}
                        </div>
                        <button type="button" className="mk-prototype-demo-submit" onClick={simulateFeature}>{currentScreen?.primaryActionLabel ?? "Simuler l'action"}</button>
                        {simulationMessage && <p className="mk-prototype-simulation-result" role="status">{simulationMessage}</p>}
                      </section>
                    )}

                    <div className="mk-prototype-lower">
                      <div><small>ESPACE ACTUEL</small><strong>{currentScreen?.title ?? "Aperçu"}</strong></div>
                      <div><small>PROFIL SÉLECTIONNÉ</small><strong>{activeProfileData?.name}</strong></div>
                    </div>
                  </div>
                </div>
              </section>
            ) : (
              <section className="mk-operational-preview">
                <div className="mk-operational-heading"><span>PARCOURS DE L'ACTIVITÉ</span><h2>Comment la solution s'organise</h2><p>Les étapes ci-dessous reprennent les éléments retenus. Sélectionne une étape pour en examiner le déroulement.</p></div>
                <div className="mk-operational-flow">
                  {blueprint.flow.map((item, index) => (
                    <button type="button" className={activeFlow === index ? "active" : ""} key={item} onClick={() => { setActiveFlow(index); setSimulationMessage(""); }}>
                      <span>{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong>{index < blueprint.flow.length - 1 && <i>→</i>}
                    </button>
                  ))}
                </div>
                {activeFlow !== null && (
                  <div className="mk-operational-step-detail">
                    <div><small>ÉTAPE SÉLECTIONNÉE</small><h3>{blueprint.flow[activeFlow]}</h3><p>Le déroulement, les personnes responsables et les moyens nécessaires restent à confirmer à partir des décisions du projet.</p></div>
                    <button type="button" onClick={() => setSimulationMessage("Étape parcourue en mode démonstration. Aucune opération réelle n'a été déclenchée.")}>Simuler cette étape</button>
                    {simulationMessage && <p role="status">{simulationMessage}</p>}
                  </div>
                )}
              </section>
            )}

            <section className="mk-visual-notes">
              <div><span className="mk-summary-kicker">ÉLÉMENTS À GARDER DISTINCTS</span><p>Les suggestions non retenues et les questions ouvertes ne sont pas présentées comme des décisions.</p></div>
              {blueprint.pendingItems.length > 0 && <details><summary>Suggestions non retenues ({blueprint.pendingItems.length})</summary><ul>{blueprint.pendingItems.map((item) => <li key={item}>{item}</li>)}</ul></details>}
              {blueprint.unresolvedPoints.length > 0 && <details><summary>Points encore à préciser ({blueprint.unresolvedPoints.length})</summary><ul>{blueprint.unresolvedPoints.map((item) => <li key={item}>{item}</li>)}</ul></details>}
            </section>

            <section className="mk-visual-feedback">
              <div><span className="mk-summary-kicker">TES DEMANDES DE RETOUCHE</span><h2>Qu'aimerais-tu changer ?</h2><p>Décris une modification précise. Elle sera conservée dans cet onglet comme note de conception, sans être envoyée ni appliquée automatiquement.</p></div>
              <textarea value={feedbackDraft} onChange={(event) => setFeedbackDraft(event.target.value)} placeholder="Ex. : Je veux que le responsable voie les inscriptions et les paiements sur la même page." rows={3} />
              <button type="button" onClick={saveFeedback} disabled={!feedbackDraft.trim()}>Ajouter cette retouche</button>
              {feedbackItems.length > 0 && <div className="mk-visual-feedback-list"><strong>{feedbackItems.length} retouche(s) notée(s)</strong>{feedbackItems.map((item, index) => <p key={index}><span>{String(index + 1).padStart(2, "0")}</span>{item}</p>)}</div>}
            </section>

            <div className="mk-visual-footer">
              <div><strong>{validated ? "Maquette validée dans cette session." : "Cette maquette est une base de discussion."}</strong><p>Les interactions sont simulées. Aucune donnée métier n'est créée, aucune notification n'est envoyée et aucune opération réelle n'est déclenchée.</p></div>
              <button type="button" className="mk-continue-button" onClick={validateVisualization} disabled={validated}>{validated ? "Maquette validée ✓" : "Valider cette maquette →"}</button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
