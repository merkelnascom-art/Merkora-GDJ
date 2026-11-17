"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  acceptSolutionComponent,
  buildSolutionProposal,
  rejectSolutionComponent,
  reviseSolutionComponent,
  type SolutionProposal,
} from "../../src/lib/merkora-core/solution-proposal";
import type { ProjectUnderstanding } from "../../src/lib/merkora-core/project-diagnostic";
import type { ProductDefinitionSession } from "../../src/lib/merkora-core/product-definition";

const DOSSIER_KEY = "merkora-v2-project-understanding";
const DEFINITION_KEY = "merkora-v2-product-definition-session";
const PROPOSAL_KEY = "merkora-v2-solution-proposal";

interface StoredProposal {
  definitionVersion: number;
  proposal: SolutionProposal;
  validated: boolean;
}

export default function SolutionProposalPage() {
  const [proposal, setProposal] = useState<SolutionProposal | null>(null);
  const [validated, setValidated] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [problem, setProblem] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  useEffect(() => {
    try {
      const dossierRaw = window.sessionStorage.getItem(DOSSIER_KEY);
      const definitionRaw = window.sessionStorage.getItem(DEFINITION_KEY);
      if (!dossierRaw || !definitionRaw) {
        setProblem("Le dossier des étapes précédentes est introuvable dans cette session.");
        setLoaded(true);
        return;
      }

      const dossier = JSON.parse(dossierRaw) as ProjectUnderstanding;
      const definition = JSON.parse(definitionRaw) as ProductDefinitionSession;
      if (definition.understandingId !== dossier.id || definition.status !== "ready_for_review") {
        setProblem("La définition du produit doit être terminée avant de composer la solution.");
        setLoaded(true);
        return;
      }

      const storedRaw = window.sessionStorage.getItem(PROPOSAL_KEY);
      const stored = storedRaw ? JSON.parse(storedRaw) as StoredProposal : null;
      const current = stored?.definitionVersion === definition.version
        ? stored
        : { definitionVersion: definition.version, proposal: buildSolutionProposal(dossier, definition), validated: false };
      setProposal(current.proposal);
      setValidated(current.validated);
      window.sessionStorage.setItem(PROPOSAL_KEY, JSON.stringify(current));
    } catch {
      setProblem("Les données du projet n'ont pas pu être lues. Retourne à l'écran 05 pour vérifier la définition.");
    }
    setLoaded(true);
  }, []);

  const acceptedCount = useMemo(
    () => proposal?.components.filter((item) => item.status === "accepted" || item.status === "modified").length ?? 0,
    [proposal],
  );
  const rejectedCount = useMemo(
    () => proposal?.components.filter((item) => item.status === "rejected").length ?? 0,
    [proposal],
  );

  function save(next: SolutionProposal, nextValidated = false) {
    setProposal(next);
    setValidated(nextValidated);
    try {
      const raw = window.sessionStorage.getItem(DEFINITION_KEY);
      const definition = raw ? JSON.parse(raw) as ProductDefinitionSession : null;
      window.sessionStorage.setItem(PROPOSAL_KEY, JSON.stringify({
        definitionVersion: definition?.version ?? 0,
        proposal: next,
        validated: nextValidated,
      } satisfies StoredProposal));
    } catch {
      setProblem("La modification est visible, mais le navigateur n'a pas pu la conserver. Garde cet onglet ouvert.");
    }
  }

  function beginEdit(id: string, title: string) {
    setEditingId(id);
    setEditingTitle(title);
  }

  function saveEdit(id: string) {
    if (!proposal) return;
    save(reviseSolutionComponent(proposal, id, editingTitle));
    setEditingId(null);
    setEditingTitle("");
  }

  function validateProposal() {
    if (!proposal || acceptedCount === 0) return;
    save({ ...proposal, version: proposal.version + 1, updatedAt: new Date().toISOString() }, true);
  }

  return (
    <main className="mk-v2-page mk-stage-page mk-solution-page">
      <div className="mk-v2-noise" aria-hidden="true" />
      <header className="mk-header">
        <a className="mk-brand" href="/" aria-label="MerKora GDJ, accueil">
          <span className="mk-brand-mark">M</span>
          <span><strong>MerKora</strong><small>GUIDED DIGITAL JOURNEY · V2</small></span>
        </a>
        <a className="mk-back-link" href="/product-definition">← Retour à l'écran 05</a>
      </header>

      <section className="mk-stage-shell">
        <div className="mk-stage-heading">
          <div className="mk-stage-steps">
            <span className="done">01 · Entrée</span>
            <span className="done">02 · Conversation</span>
            <span className="done">03 · Compréhension</span>
            <span className="done">04 · Diagnostic</span>
            <span className="done">05 · Définition</span>
            <span className="active">06 · Solution</span>
            <span>07 · Maquette</span>
          </div>
          <span className="mk-eyebrow"><span /> ÉTAPE 06 · PROPOSITION ET COMPOSITION</span>
          <h1>Voici la solution<br /><em>que nous pouvons construire.</em></h1>
          <p>MerKora organise les éléments de ton projet en une proposition concrète. Tu gardes la main : chaque composant peut être accepté, modifié ou écarté. Rien n'est imposé.</p>
        </div>

        {!loaded && <section className="mk-stage-empty"><p>Préparation de la proposition…</p></section>}

        {loaded && problem && (
          <section className="mk-stage-empty">
            <h2>Impossible de préparer la solution</h2>
            <p>{problem}</p>
            <a className="mk-continue-button" href="/product-definition">Revenir à l'écran 05 <span>→</span></a>
          </section>
        )}

        {loaded && proposal && (
          <>
            <section className="mk-solution-overview">
              <span className="mk-summary-kicker">PROPOSITION GLOBALE</span>
              <h2>{proposal.title}</h2>
              <p className="mk-solution-lead">{proposal.description}</p>
              <div className="mk-solution-context-grid">
                <article><span>LE BESOIN À RÉSOUDRE</span><p>{proposal.problem}</p></article>
                <article><span>LE RÉSULTAT RECHERCHÉ</span><p>{proposal.objective}</p></article>
              </div>
              <p className="mk-solution-principle">{proposal.operatingPrinciple}</p>
            </section>

            <section className="mk-solution-architecture">
              <div>
                <span className="mk-summary-kicker">ARCHITECTURE PROPOSÉE</span>
                <h2>{proposal.architectures[0]?.title}</h2>
                <p>{proposal.architectures[0]?.description}</p>
              </div>
              <details>
                <summary>Voir les avantages et points à préciser</summary>
                <ul>{proposal.architectures[0]?.tradeOffs.map((item) => <li key={item}>{item}</li>)}</ul>
              </details>
            </section>

            <section className="mk-solution-components">
              <div className="mk-solution-section-heading">
                <div>
                  <span className="mk-summary-kicker">COMPOSITION PERSONNALISABLE</span>
                  <h2>Les éléments de la solution</h2>
                  <p>Ouvre uniquement les éléments que tu veux examiner.</p>
                </div>
                <span className="mk-solution-count">{proposal.components.length} élément(s)</span>
              </div>

              {proposal.components.length === 0 ? (
                <div className="mk-solution-empty">La définition ne contient pas encore de composant précis. Reviens à l'écran 05 pour compléter les éléments utiles.</div>
              ) : (
                <div className="mk-solution-component-list">
                  {proposal.components.map((component, index) => (
                    <article className={"mk-solution-component is-" + component.status} key={component.id}>
                      <div className="mk-solution-component-top">
                        <span className="mk-solution-index">{String(index + 1).padStart(2, "0")}</span>
                        <div className="mk-solution-component-copy">
                          {editingId === component.id ? (
                            <div className="mk-solution-edit">
                              <input aria-label="Nom du composant" value={editingTitle} onChange={(event) => setEditingTitle(event.target.value)} />
                              <button type="button" onClick={() => saveEdit(component.id)}>Enregistrer</button>
                              <button type="button" className="quiet" onClick={() => setEditingId(null)}>Annuler</button>
                            </div>
                          ) : <h3>{component.title}</h3>}
                          <span className={"mk-solution-status status-" + component.status}>
                            {component.status === "accepted" ? "Accepté" : component.status === "modified" ? "Modifié et retenu" : component.status === "rejected" ? "Écarté" : "À examiner"}
                          </span>
                        </div>
                        <details className="mk-solution-why">
                          <summary>Pourquoi ?</summary>
                          <p>{component.description}</p>
                          <small>{component.source === "validated_definition" ? "Issu de tes réponses à l'écran 05." : "Suggestion du référentiel métier, à confirmer."}</small>
                        </details>
                      </div>
                      {component.status !== "rejected" && editingId !== component.id && (
                        <div className="mk-solution-actions">
                          <button type="button" onClick={() => save(acceptSolutionComponent(proposal, component.id))}>Retenir</button>
                          <button type="button" className="quiet" onClick={() => beginEdit(component.id, component.title)}>Modifier</button>
                          <button type="button" className="quiet" onClick={() => save(rejectSolutionComponent(proposal, component.id))}>Écarter</button>
                        </div>
                      )}
                      {component.status === "rejected" && (
                        <div className="mk-solution-actions">
                          <button type="button" className="quiet" onClick={() => save(acceptSolutionComponent(proposal, component.id))}>Réintégrer</button>
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </section>

            {(proposal.coherenceNotes.length > 0 || proposal.unresolvedPoints.length > 0) && (
              <details className="mk-solution-coherence">
                <summary>Points à vérifier avant de figer la solution ({proposal.unresolvedPoints.length})</summary>
                {proposal.coherenceNotes.map((item) => <p key={item}>{item}</p>)}
                {proposal.unresolvedPoints.map((item) => <div key={item}>• {item}</div>)}
              </details>
            )}

            <div className="mk-solution-footer">
              <div>
                <strong>{acceptedCount} élément(s) retenu(s) · {rejectedCount} écarté(s)</strong>
                <p>Les éléments encore proposés ne seront pas considérés comme validés tant que tu ne les as pas retenus.</p>
              </div>
              <button type="button" className="mk-continue-button" disabled={acceptedCount === 0} onClick={validateProposal}>
                Valider cette composition <span>→</span>
              </button>
            </div>

            {validated && (
              <section className="mk-solution-validated" role="status">
                <span>✓</span>
                <div>
                  <strong>Composition validée</strong>
                  <p>La maquette de l'écran 07 est prête à partir des éléments retenus : espaces, navigation, fonctions et profils confirmés.</p>
                  <a className="mk-continue-button" href="/visual-prototype">Découvrir la maquette <span>→</span></a>
                </div>
              </section>
            )}
          </>
        )}
      </section>
    </main>
  );
}
