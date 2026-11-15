"use client";

import React, { useEffect, useState } from "react";
import {
  createDiagnosticSession,
  getActiveDiagnosticAnswers,
  getNextDiagnosticQuestion,
  recordDiagnosticAnswer,
  reviseDiagnosticAnswer,
  deferDiagnosticQuestion,
  markDiagnosticReady,
  type DiagnosticAnswer,
  type DiagnosticQuestion,
  type DiagnosticSession,
  type ProjectUnderstanding,
} from "../../src/lib/merkora-core/project-diagnostic";

const DOSSIER_KEY = "merkora-v2-project-understanding";
const DIAGNOSTIC_KEY = "merkora-v2-diagnostic-session";

function readDossier(): ProjectUnderstanding | null {
  try {
    const raw = window.sessionStorage.getItem(DOSSIER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ProjectUnderstanding;
    if (typeof parsed.originalDescription === "string" && Array.isArray(parsed.items)) return parsed;
  } catch { /* Le parcours reste accessible si le stockage est indisponible. */ }
  return null;
}

export default function DiagnosticPage() {
  const [dossier, setDossier] = useState<ProjectUnderstanding | null>(null);
  const [diagnostic, setDiagnostic] = useState<DiagnosticSession | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [textAnswer, setTextAnswer] = useState("");
  const [singleChoice, setSingleChoice] = useState("");
  const [multipleChoices, setMultipleChoices] = useState<string[]>([]);
  const [detail, setDetail] = useState("");
  const [editingAnswer, setEditingAnswer] = useState<DiagnosticAnswer | null>(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const savedDossier = readDossier();
    if (!savedDossier) { setLoaded(true); return; }
    setDossier(savedDossier);
    try {
      const raw = window.sessionStorage.getItem(DIAGNOSTIC_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as DiagnosticSession;
        if (saved.understandingId === savedDossier.id && Array.isArray(saved.answers)) {
          setDiagnostic(saved);
          setLoaded(true);
          return;
        }
      }
    } catch { /* Créer une session de diagnostic neuve à partir du dossier. */ }
    setDiagnostic(createDiagnosticSession(savedDossier));
    setLoaded(true);
  }, []);

  function persist(nextDossier: ProjectUnderstanding, nextDiagnostic: DiagnosticSession) {
    setDossier(nextDossier);
    setDiagnostic(nextDiagnostic);
    try {
      window.sessionStorage.setItem(DOSSIER_KEY, JSON.stringify(nextDossier));
      window.sessionStorage.setItem(DIAGNOSTIC_KEY, JSON.stringify(nextDiagnostic));
    } catch {
      setNotice("Le navigateur n'a pas pu conserver cette mise à jour. Garde cet onglet ouvert.");
    }
  }

  const currentQuestion: DiagnosticQuestion | null = editingAnswer
    ? editingAnswer.question
    : dossier && diagnostic
      ? getNextDiagnosticQuestion(dossier, diagnostic)
      : null;

  useEffect(() => {
    if (loaded && dossier && diagnostic && !currentQuestion && diagnostic.status !== "ready_for_review") {
      const ready = markDiagnosticReady(diagnostic);
      setDiagnostic(ready);
      try { window.sessionStorage.setItem(DIAGNOSTIC_KEY, JSON.stringify(ready)); } catch { /* La page reste utilisable. */ }
    }
  }, [loaded, dossier, diagnostic, currentQuestion]);

  function resetAnswerFields(answer?: DiagnosticAnswer) {
    setTextAnswer(answer && typeof answer.value === "string" ? answer.value : "");
    setSingleChoice(answer && typeof answer.value === "string" ? answer.value : "");
    setMultipleChoices(answer && Array.isArray(answer.value) ? answer.value : []);
    setDetail(answer?.detail ?? "");
  }

  function submitAnswer(status: "answered" | "unknown" | "not_applicable" = "answered") {
    if (!dossier || !diagnostic || !currentQuestion) return;
    let value: string | string[];
    if (status === "unknown") value = "Je ne sais pas encore";
    else if (status === "not_applicable") value = "Non applicable à ce projet";
    else if (currentQuestion.answerType === "multi_choice") value = multipleChoices;
    else if (currentQuestion.answerType === "single_choice") value = singleChoice;
    else value = textAnswer.trim();

    if (Array.isArray(value) ? value.length === 0 : !value.trim()) {
      setNotice("Choisis une réponse ou écris quelques mots pour continuer.");
      return;
    }

    const input = { value, detail, status };
    const result = editingAnswer
      ? reviseDiagnosticAnswer(dossier, diagnostic, editingAnswer.id, input)
      : recordDiagnosticAnswer(dossier, diagnostic, currentQuestion, input);
    persist(result.understanding, result.diagnostic);
    setEditingAnswer(null);
    resetAnswerFields();
    setNotice("Réponse enregistrée. La prochaine question est adaptée à ce que tu viens d'expliquer.");
  }

  function skipQuestion() {
    if (!diagnostic || !currentQuestion || editingAnswer) { setEditingAnswer(null); resetAnswerFields(); return; }
    const next = deferDiagnosticQuestion(diagnostic, currentQuestion);
    setDiagnostic(next);
    try { window.sessionStorage.setItem(DIAGNOSTIC_KEY, JSON.stringify(next)); } catch { setNotice("Garde cet onglet ouvert pour préserver la progression."); }
    setNotice("Question mise en attente. Elle n'est pas traitée comme une réponse.");
  }

  function editPrevious(answer: DiagnosticAnswer) {
    setEditingAnswer(answer);
    resetAnswerFields(answer);
    setNotice("Tu modifies une réponse précédente. La version initiale restera dans l'historique.");
  }

  const history = diagnostic ? getActiveDiagnosticAnswers(diagnostic) : [];
  const answeredCount = history.length;

  return (
    <main className="mk-v2-page mk-stage-page">
      <div className="mk-v2-noise" aria-hidden="true" />
      <header className="mk-header">
        <a className="mk-brand" href="/" aria-label="MerKora GDJ, accueil"><span className="mk-brand-mark">M</span><span><strong>MerKora</strong><small>GUIDED DIGITAL JOURNEY · V2</small></span></a>
        <a className="mk-back-link" href="/understanding">← Retour à la compréhension</a>
      </header>

      <section className="mk-stage-shell">
        <div className="mk-stage-heading">
          <div className="mk-stage-steps"><span className="done">01 · Entrée</span><span className="done">02 · Conversation</span><span className="done">03 · Compréhension</span><span className="active">04 · Diagnostic</span></div>
          <span className="mk-eyebrow"><span /> ÉTAPE 04 · EXPLORATION ADAPTATIVE</span>
          <h1>Approfondissons.<br /><em>Une question à la fois.</em></h1>
          <p>Je choisis la prochaine précision selon ton projet et tes réponses. Tu peux expliquer librement, choisir des propositions, dire que tu ne sais pas ou revenir sur une réponse.</p>
        </div>

        {!loaded && <section className="mk-stage-empty"><p>Chargement de ton dossier…</p></section>}
        {loaded && !dossier && (
          <section className="mk-stage-empty"><h2>Le dossier de compréhension est introuvable</h2><p>Reviens à l'écran 03 pour retrouver les informations de ton projet.</p><a className="mk-continue-button" href="/understanding">Ouvrir l'écran 03 <span>→</span></a></section>
        )}

        {loaded && dossier && diagnostic && currentQuestion && (
          <>
            <div className="mk-stage-overview">
              <div><strong>{answeredCount}</strong><span>précisions enregistrées</span></div>
              <div><strong>{diagnostic.deferredQuestionIds.length}</strong><span>questions mises en attente</span></div>
              <div><strong>{diagnostic.version}</strong><span>version du diagnostic</span></div>
            </div>
            <section className="mk-diagnostic-card" aria-live="polite">
              <div className="mk-diagnostic-card-top"><span className="mk-summary-kicker">{editingAnswer ? "CORRECTION D'UNE RÉPONSE" : "QUESTION SUIVANTE · ADAPTÉE À TON PROJET"}</span><span className="mk-question-number">Précision {answeredCount + (editingAnswer ? 0 : 1)}</span></div>
              <h2>{currentQuestion.prompt}</h2>
              <p className="mk-question-purpose">{currentQuestion.purpose}</p>

              {currentQuestion.answerType === "single_choice" && (
                <div className="mk-diagnostic-options" role="radiogroup" aria-label="Choisir une réponse">
                  {(currentQuestion.options ?? []).map((option) => <label className={"mk-diagnostic-option" + (singleChoice === option ? " selected" : "")} key={option}><input type="radio" name="mk-diagnostic-choice" value={option} checked={singleChoice === option} onChange={() => setSingleChoice(option)} /><span>{option}</span></label>)}
                </div>
              )}

              {currentQuestion.answerType === "multi_choice" && (
                <div className="mk-diagnostic-options" aria-label="Choisir une ou plusieurs réponses">
                  {(currentQuestion.options ?? []).map((option) => <label className={"mk-diagnostic-option" + (multipleChoices.includes(option) ? " selected" : "")} key={option}><input type="checkbox" checked={multipleChoices.includes(option)} onChange={(event) => setMultipleChoices((current) => event.target.checked ? [...current, option] : current.filter((item) => item !== option))} /><span>{option}</span></label>)}
                </div>
              )}

              {currentQuestion.answerType === "text" && (
                <label className="mk-diagnostic-answer-label" htmlFor="mk-diagnostic-answer">TA RÉPONSE
                  <textarea id="mk-diagnostic-answer" value={textAnswer} onChange={(event) => setTextAnswer(event.target.value)} rows={5} placeholder="Explique avec tes propres mots. Tu n'as pas besoin de vocabulaire technique." />
                </label>
              )}

              {currentQuestion.allowDetail && (
                <label className="mk-diagnostic-answer-label mk-diagnostic-detail" htmlFor="mk-diagnostic-detail">UNE PRÉCISION COMPLÉMENTAIRE (FACULTATIF)
                  <textarea id="mk-diagnostic-detail" value={detail} onChange={(event) => setDetail(event.target.value)} rows={2} placeholder="Tu peux ajouter un exemple ou une explication…" />
                </label>
              )}

              <div className="mk-diagnostic-actions">
                <button type="button" className="mk-continue-button" onClick={() => submitAnswer()}>{editingAnswer ? "Enregistrer ma correction" : "Valider ma réponse"} <span>→</span></button>
                <div className="mk-diagnostic-secondary-actions"><button type="button" className="mk-secondary-button" onClick={() => submitAnswer("unknown")}>Je ne sais pas encore</button><button type="button" className="mk-tertiary-button" onClick={() => submitAnswer("not_applicable")}>Non applicable</button><button type="button" className="mk-tertiary-button" onClick={skipQuestion}>Passer pour le moment</button></div>
              </div>
            </section>

            <section className="mk-diagnostic-history">
              <div className="mk-history-heading"><div><span className="mk-summary-kicker">MÉMOIRE DU DIAGNOSTIC</span><h2>Réponses déjà données</h2></div><span>{history.length}</span></div>
              {history.length === 0 ? <p>Les réponses apparaîtront ici au fur et à mesure, sans remplacer tes mots d'origine.</p> : history.map((answer) => (
                <article className="mk-history-item" key={answer.id}>
                  <div><strong>{answer.question.prompt}</strong><p>{Array.isArray(answer.value) ? answer.value.join(" · ") : answer.value}{answer.detail ? " — " + answer.detail : ""}</p></div>
                  <button type="button" className="mk-small-action" onClick={() => editPrevious(answer)}>Modifier</button>
                </article>
              ))}
            </section>
          </>
        )}

        {loaded && dossier && diagnostic && !currentQuestion && (
          <section className="mk-diagnostic-complete">
            <span className="mk-summary-kicker">PREMIÈRE EXPLORATION TERMINÉE</span>
            <h2>Nous avons assez d'éléments pour consolider ce diagnostic.</h2>
            <p>Les réponses, les éléments confirmés et les points encore inconnus sont conservés. Cela ne signifie pas que toutes les causes sont prouvées ni que la solution est déjà choisie.</p>
            <div className="mk-diagnostic-complete-stats"><strong>{history.length} réponses conservées</strong><strong>{diagnostic.deferredQuestionIds.length} questions différées</strong></div>
            <a className="mk-secondary-button" href="/understanding">Revoir ma compréhension</a>
          </section>
        )}

        {notice && <p className="mk-stage-notice" role="status">{notice}</p>}
      </section>

      <footer className="mk-footer"><span><b>MerKora GDJ</b> · Le diagnostic avant la solution.</span><span>Tu gardes le contrôle.</span></footer>
    </main>
  );
}
