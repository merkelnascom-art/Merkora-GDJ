"use client";

import React, { useEffect, useState } from "react";
import {
  createProjectUnderstanding,
  getActiveUnderstandingItems,
  reviseUnderstandingItem,
  rejectUnderstandingItem,
  validateProjectUnderstanding,
  validateUnderstandingItem,
  UNDERSTANDING_SECTIONS,
  type ProjectUnderstanding,
  type ProjectUnderstandingItem,
} from "../../src/lib/merkora-core/project-diagnostic";
import type { UnderstandingSession } from "../../src/lib/merkora-core/situation-intake-engine";

const SOURCE_SESSION_KEY = "merkora-v2-understanding-session";
const DOSSIER_KEY = "merkora-v2-project-understanding";
const EDIT_DRAFT_KEY = "merkora-v2-understanding-edit-draft";

function readSession(): UnderstandingSession | null {
  try {
    const raw = window.sessionStorage.getItem(SOURCE_SESSION_KEY);
    if (!raw) return null;
    const value = JSON.parse(raw) as Partial<UnderstandingSession>;
    if (typeof value.originalDescription === "string" && Array.isArray(value.evidence) && Array.isArray(value.messages)) {
      return value as UnderstandingSession;
    }
  } catch { /* Le parcours reste accessible si le stockage est indisponible. */ }
  return null;
}

function statusLabel(status: ProjectUnderstandingItem["status"]): string {
  const labels: Record<ProjectUnderstandingItem["status"], string> = {
    user_stated: "Exprimé par toi",
    observed: "Observation",
    inferred: "Interprétation à confirmer",
    hypothesis: "Hypothèse à vérifier",
    unknown: "Inconnu",
    validated: "Validé par toi",
    rejected: "Écarté",
  };
  return labels[status];
}

function restoreEditDraft(dossier: ProjectUnderstanding, setEditingId: (id: string | null) => void, setEditValue: (value: string) => void) {
  try {
    const raw = window.sessionStorage.getItem(EDIT_DRAFT_KEY);
    if (!raw) return;
    const draft = JSON.parse(raw) as { itemId?: string; value?: string };
    if (draft.itemId && typeof draft.value === "string" && getActiveUnderstandingItems(dossier).some((item) => item.id === draft.itemId)) {
      setEditingId(draft.itemId);
      setEditValue(draft.value);
    }
  } catch { /* Le dossier reste disponible même si le brouillon est illisible. */ }
}

export default function UnderstandingPage() {
  const [dossier, setDossier] = useState<ProjectUnderstanding | null>(null);
  const [sourceAvailable, setSourceAvailable] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const session = readSession();
    if (!session) return;
    setSourceAvailable(true);
    try {
      const saved = window.sessionStorage.getItem(DOSSIER_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as ProjectUnderstanding;
        if (parsed.projectId === session.conversationId && Array.isArray(parsed.items)) {
          setDossier(parsed);
          restoreEditDraft(parsed, setEditingId, setEditValue);
          return;
        }
      }
    } catch { /* Reconstruire à partir de la session source. */ }
    const initial = createProjectUnderstanding(session);
    setDossier(initial);
    restoreEditDraft(initial, setEditingId, setEditValue);
    try { window.sessionStorage.setItem(DOSSIER_KEY, JSON.stringify(initial)); } catch { /* Mémoire de page seulement. */ }
  }, []);

  function persist(next: ProjectUnderstanding) {
    setDossier(next);
    try { window.sessionStorage.setItem(DOSSIER_KEY, JSON.stringify(next)); } catch { setNotice("Le navigateur n'a pas pu conserver cette mise à jour."); }
  }

  function validateItem(itemId: string) {
    if (!dossier) return;
    persist(validateUnderstandingItem(dossier, itemId));
    setNotice("Élément validé. Son origine et son historique sont conservés.");
  }

  function startEdit(item: ProjectUnderstandingItem) {
    setEditingId(item.id);
    setEditValue(item.value);
    setNotice("");
    try { window.sessionStorage.setItem(EDIT_DRAFT_KEY, JSON.stringify({ itemId: item.id, value: item.value })); } catch { /* La saisie reste disponible dans le champ courant. */ }
  }

  function saveEdit() {
    if (!dossier || !editingId || !editValue.trim()) return;
    persist(reviseUnderstandingItem(dossier, editingId, editValue));
    setEditingId(null);
    setEditValue("");
    try { window.sessionStorage.removeItem(EDIT_DRAFT_KEY); } catch { /* Le dossier est déjà enregistré. */ }
    setNotice("Correction enregistrée comme une nouvelle version. La formulation précédente est conservée.");
  }

  function rejectItem(itemId: string) {
    if (!dossier) return;
    persist(rejectUnderstandingItem(dossier, itemId));
    setNotice("Interprétation écartée. Elle reste conservée dans l'historique.");
  }

  function continueToDiagnostic() {
    if (!dossier) return;
    const validated = validateProjectUnderstanding(dossier);
    persist(validated);
    window.location.href = "/diagnostic";
  }

  const activeItems = dossier ? getActiveUnderstandingItems(dossier) : [];
  const populatedSections = dossier ? UNDERSTANDING_SECTIONS.filter((section) => activeItems.some((item) => item.dimension === section.id)) : [];
  const missingSections = dossier ? UNDERSTANDING_SECTIONS.filter((section) => !activeItems.some((item) => item.dimension === section.id)) : [];

  return (
    <main className="mk-v2-page mk-stage-page">
      <div className="mk-v2-noise" aria-hidden="true" />
      <header className="mk-header">
        <a className="mk-brand" href="/" aria-label="MerKora GDJ, accueil"><span className="mk-brand-mark">M</span><span><strong>MerKora</strong><small>GUIDED DIGITAL JOURNEY · V2</small></span></a>
        <a className="mk-back-link" href="/conversation">← Retour à notre échange</a>
      </header>

      <section className="mk-stage-shell">
        <div className="mk-stage-heading">
          <div className="mk-stage-steps"><span className="done">01 · Entrée</span><span className="done">02 · Conversation</span><span className="active">03 · Compréhension</span><span>04 · Diagnostic</span></div>
          <span className="mk-eyebrow"><span /> ÉTAPE 03 · MIROIR DU PROJET</span>
          <h1>Voici ce que j'ai compris.<br /><em>Vérifions-le ensemble.</em></h1>
          <p>Je rassemble tes mots et les informations déjà exprimées : activité, idée, situation, personnes, objectifs et contraintes. Tu peux corriger chaque élément. Ce qui reste inconnu ne sera pas inventé.</p>
        </div>

        {!sourceAvailable && (
          <section className="mk-stage-empty">
            <h2>Retrouvons d'abord ton échange</h2>
            <p>Je n'ai pas trouvé de conversation enregistrée dans cette session. Reviens à l'écran 02 pour reprendre ton projet.</p>
            <a className="mk-continue-button" href="/conversation">Revenir à la conversation <span>→</span></a>
          </section>
        )}

        {sourceAvailable && dossier && (
          <>
            <section className="mk-original-narrative">
              <span className="mk-summary-kicker">TON EXPRESSION INITIALE · CONSERVÉE INTÉGRALEMENT</span>
              <p>{dossier.originalDescription}</p>
            </section>

            <div className="mk-stage-overview">
              <div><strong>{activeItems.length}</strong><span>éléments actifs</span></div>
              <div><strong>{activeItems.filter((item) => item.status === "validated").length}</strong><span>déjà validés</span></div>
              <div><strong>{activeItems.filter((item) => item.status === "hypothesis" || item.status === "inferred").length}</strong><span>à confirmer</span></div>
            </div>

            <div className="mk-understanding-sections">
              {populatedSections.length === 0 && <p className="mk-section-empty">Aucun élément structuré n'a encore été extrait. Ton récit initial reste conservé intégralement ; le diagnostic pourra commencer par clarifier l'activité ou l'idée.</p>}
              {populatedSections.map((section) => {
                const items = activeItems.filter((item) => item.dimension === section.id);
                return (
                  <section className="mk-understanding-section" key={section.id}>
                    <div className="mk-understanding-section-heading">
                      <div><h2>{section.title}</h2><p>{section.description}</p></div>
                      <span>{items.length}</span>
                    </div>
                    <div className="mk-understanding-items">
                      {items.map((item) => (
                          <article className="mk-understanding-item" key={item.id}>
                            {editingId === item.id ? (
                              <div className="mk-edit-item">
                                <label htmlFor={"edit-" + item.id}>Corriger cet élément</label>
                                <textarea id={"edit-" + item.id} value={editValue} onChange={(event) => { setEditValue(event.target.value); try { window.sessionStorage.setItem(EDIT_DRAFT_KEY, JSON.stringify({ itemId: item.id, value: event.target.value })); } catch { /* Le champ reste éditable. */ } }} rows={3} />
                                <div className="mk-inline-actions"><button type="button" className="mk-continue-button" onClick={saveEdit} disabled={!editValue.trim()}>Enregistrer la correction</button><button type="button" className="mk-tertiary-button" onClick={() => { setEditingId(null); try { window.sessionStorage.removeItem(EDIT_DRAFT_KEY); } catch { /* Rien à nettoyer. */ } }}>Annuler</button></div>
                              </div>
                            ) : (
                              <>
                                <p>{item.value}</p>
                                <div className="mk-item-meta"><span className={"mk-status mk-status-" + item.status}>{statusLabel(item.status)}</span><span>Source : {item.source === "conversation" ? "ton récit" : item.source === "user_correction" ? "ta correction" : "ta réponse au diagnostic"}</span></div>
                                <details><summary>Voir l'origine de cette information</summary><p>{item.sourceQuote}</p><small>Référence : {item.sourceMessageId ?? item.sourceReferenceId ?? "source conservée"}</small></details>
                                <div className="mk-inline-actions">
                                  <button type="button" className="mk-small-action" onClick={() => startEdit(item)}>Modifier</button>
                                  {item.status !== "validated" && <button type="button" className="mk-small-action mk-small-action-gold" onClick={() => validateItem(item.id)}>Confirmer cet élément</button>}
                                  {(item.status === "hypothesis" || item.status === "inferred") && <button type="button" className="mk-small-action" onClick={() => rejectItem(item.id)}>Écarter cette interprétation</button>}
                                </div>
                              </>
                            )}
                          </article>
                        ))}
                    </div>
                  </section>
                );
              })}
            </div>
            {missingSections.length > 0 && <details className="mk-missing-sections"><summary>Voir les {missingSections.length} dimensions non encore identifiées</summary><ul>{missingSections.map((section) => <li key={section.id}><strong>{section.title}</strong><span>{section.description}</span></li>)}</ul><p>Ces dimensions ne sont pas des champs obligatoires. MerKora les explorera seulement si elles deviennent utiles au projet.</p></details>}

            <section className="mk-stage-next">
              <div><span className="mk-summary-kicker">PROCHAINE ÉTAPE</span><h2>Approfondir ce qui doit encore être compris</h2><p>La validation confirme les informations que tu as exprimées. Les hypothèses restent des hypothèses. Le diagnostic pourra préciser les éléments manquants, un par un.</p></div>
              <button type="button" className="mk-continue-button" onClick={continueToDiagnostic}>Valider et passer au diagnostic <span>→</span></button>
            </section>
            {notice && <p className="mk-stage-notice" role="status">{notice}</p>}
          </>
        )}
      </section>

      <footer className="mk-footer"><span><b>MerKora GDJ</b> · Comprendre avant de construire.</span><span>Vos idées restent les vôtres.</span></footer>
    </main>
  );
}
