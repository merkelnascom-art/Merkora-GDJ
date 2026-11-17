"use client";

import React, { useEffect, useState } from "react";
import {
  createProductDefinitionSession,
  deferProductDefinitionQuestion,
  getActiveProductDefinitionAnswers,
  getNextProductDefinitionQuestion,
  markProductDefinitionReady,
  recordProductDefinitionAnswer,
  resumeDeferredProductDefinitionQuestions,
  reviseProductDefinitionAnswer,
  PRODUCT_DEFINITION_FAMILIES,
  type ProductDefinitionAnswer,
  type ProductDefinitionQuestion,
  type ProductDefinitionSession,
} from "../../src/lib/merkora-core/product-definition";
import {
  getProjectEvidenceItems,
  migrateStoredProjectUnderstanding,
  type ProjectUnderstanding,
} from "../../src/lib/merkora-core/project-diagnostic";
import { buildProjectKnowledgeMap } from "../../src/lib/merkora-core/knowledge/universal-project-knowledge";

const DOSSIER_KEY = "merkora-v2-project-understanding";
const DEFINITION_KEY = "merkora-v2-product-definition-session";
const DRAFT_KEY = "merkora-v2-product-definition-draft";

function readDossier(): ProjectUnderstanding | null {
  try {
    const raw = window.sessionStorage.getItem(DOSSIER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ProjectUnderstanding;
    if (typeof parsed.originalDescription !== "string" || !Array.isArray(parsed.items)) return null;
    const normalized: ProjectUnderstanding = {
      ...parsed,
      situationGraph: parsed.situationGraph ?? { entities: [], relations: [], unresolvedRelations: [] },
      contradictions: Array.isArray(parsed.contradictions) ? parsed.contradictions : [],
      unresolvedQuestions: Array.isArray(parsed.unresolvedQuestions) ? parsed.unresolvedQuestions : [],
      privacyConsiderations: Array.isArray(parsed.privacyConsiderations) ? parsed.privacyConsiderations : [],
    };
    const migrated = migrateStoredProjectUnderstanding({
      ...normalized,
      knowledgeMap: buildProjectKnowledgeMap(getProjectEvidenceItems(normalized), normalized.situationGraph),
    });
    window.sessionStorage.setItem(DOSSIER_KEY, JSON.stringify(migrated));
    return migrated;
  } catch {
    return null;
  }
}

function readSession(dossier: ProjectUnderstanding): ProductDefinitionSession {
  try {
    const raw = window.sessionStorage.getItem(DEFINITION_KEY);
    if (raw) {
      const saved = JSON.parse(raw) as ProductDefinitionSession;
      if (saved.understandingId === dossier.id && Array.isArray(saved.answers)) return saved;
    }
  } catch {
    // Une session illisible est recréée à partir du dossier conservé.
  }
  return createProductDefinitionSession(dossier);
}

export default function ProductDefinitionPage() {
  const [dossier, setDossier] = useState<ProjectUnderstanding | null>(null);
  const [session, setSession] = useState<ProductDefinitionSession | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [textAnswer, setTextAnswer] = useState("");
  const [singleChoice, setSingleChoice] = useState("");
  const [multipleChoices, setMultipleChoices] = useState<string[]>([]);
  const [detail, setDetail] = useState("");
  const [editingAnswer, setEditingAnswer] = useState<ProductDefinitionAnswer | null>(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const savedDossier = readDossier();
    if (!savedDossier) {
      setLoaded(true);
      return;
    }
    const savedSession = readSession(savedDossier);
    setDossier(savedDossier);
    setSession(savedSession);
    setLoaded(true);
    try {
      const rawDraft = window.sessionStorage.getItem(DRAFT_KEY);
      if (rawDraft) {
        const draft = JSON.parse(rawDraft) as {
          questionId?: string;
          editingAnswerId?: string;
          textAnswer?: string;
          singleChoice?: string;
          multipleChoices?: string[];
          detail?: string;
        };
        const editing = draft.editingAnswerId
          ? getActiveProductDefinitionAnswers(savedSession).find((answer) => answer.id === draft.editingAnswerId) ?? null
          : null;
        const expected = editing?.question ?? getNextProductDefinitionQuestion(savedDossier, savedSession);
        if (expected && expected.id === draft.questionId) {
          setEditingAnswer(editing);
          setTextAnswer(draft.textAnswer ?? "");
          setSingleChoice(draft.singleChoice ?? "");
          setMultipleChoices(Array.isArray(draft.multipleChoices) ? draft.multipleChoices : []);
          setDetail(draft.detail ?? "");
        }
      }
    } catch {
      // Un brouillon invalide ne bloque pas le parcours.
    }
  }, []);

  const currentQuestion: ProductDefinitionQuestion | null = editingAnswer
    ? editingAnswer.question
    : dossier && session
      ? getNextProductDefinitionQuestion(dossier, session)
      : null;

  const history = session ? getActiveProductDefinitionAnswers(session) : [];

  useEffect(() => {
    if (!loaded || !session || !dossier || currentQuestion || session.status === "ready_for_review") return;
    const ready = markProductDefinitionReady(session);
    setSession(ready);
    try {
      window.sessionStorage.setItem(DEFINITION_KEY, JSON.stringify(ready));
    } catch {
      setNotice("La progression reste visible dans cet onglet, mais le navigateur n'a pas pu la conserver.");
    }
  }, [loaded, dossier, session, currentQuestion]);

  function persist(next: ProductDefinitionSession) {
    setSession(next);
    try {
      window.sessionStorage.setItem(DEFINITION_KEY, JSON.stringify(next));
    } catch {
      setNotice("Le navigateur n'a pas pu conserver cette mise à jour. Garde cet onglet ouvert.");
    }
  }

  function persistDraft(patch: Partial<{
    textAnswer: string;
    singleChoice: string;
    multipleChoices: string[];
    detail: string;
  }>) {
    if (!currentQuestion) return;
    try {
      window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify({
        questionId: currentQuestion.id,
        editingAnswerId: editingAnswer?.id,
        textAnswer,
        singleChoice,
        multipleChoices,
        detail,
        ...patch,
      }));
    } catch {
      // La saisie courante reste disponible.
    }
  }

  function clearDraft() {
    try {
      window.sessionStorage.removeItem(DRAFT_KEY);
    } catch {
      // Le parcours reste utilisable même si le stockage est indisponible.
    }
  }

  function resetFields(answer?: ProductDefinitionAnswer) {
    setTextAnswer(answer && typeof answer.value === "string" ? answer.value : "");
    setSingleChoice(answer && typeof answer.value === "string" ? answer.value : "");
    setMultipleChoices(answer && Array.isArray(answer.value) ? answer.value : []);
    setDetail(answer?.detail ?? "");
  }

  function submitAnswer(status: "answered" | "unknown" | "not_applicable" = "answered") {
    if (!session || !currentQuestion) return;
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
    const next = editingAnswer
      ? reviseProductDefinitionAnswer(session, editingAnswer.id, input)
      : recordProductDefinitionAnswer(session, currentQuestion, input);
    persist(next);
    clearDraft();
    setEditingAnswer(null);
    resetFields();
    setNotice("Réponse enregistrée. La prochaine question tient compte de ce que tu viens d'indiquer.");
  }

  function deferQuestion() {
    if (!session || !currentQuestion) return;
    if (editingAnswer) {
      setEditingAnswer(null);
      resetFields();
      clearDraft();
      return;
    }
    persist(deferProductDefinitionQuestion(session, currentQuestion));
    clearDraft();
    resetFields();
    setNotice("Question mise en attente. Elle n'est pas considérée comme une réponse.");
  }

  function resumeDeferred() {
    if (!session) return;
    persist(resumeDeferredProductDefinitionQuestions(session));
    setNotice("Les questions mises en attente sont de nouveau disponibles.");
  }

  function editPrevious(answer: ProductDefinitionAnswer) {
    setEditingAnswer(answer);
    resetFields(answer);
    try {
      window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify({
        questionId: answer.question.id,
        editingAnswerId: answer.id,
        textAnswer: typeof answer.value === "string" ? answer.value : "",
        singleChoice: typeof answer.value === "string" ? answer.value : "",
        multipleChoices: Array.isArray(answer.value) ? answer.value : [],
        detail: answer.detail ?? "",
      }));
    } catch {
      // La réponse reste modifiable dans le champ courant.
    }
    setNotice("Tu modifies une réponse précédente. La version initiale restera dans l'historique.");
  }

  return (
    <main className="mk-v2-page mk-stage-page">
      <div className="mk-v2-noise" aria-hidden="true" />
      <header className="mk-header">
        <a className="mk-brand" href="/" aria-label="MerKora GDJ, accueil">
          <span className="mk-brand-mark">M</span>
          <span><strong>MerKora</strong><small>GUIDED DIGITAL JOURNEY · V2</small></span>
        </a>
        <a className="mk-back-link" href="/diagnostic">← Retour au diagnostic</a>
      </header>

      <section className="mk-stage-shell">
        <div className="mk-stage-heading">
          <div className="mk-stage-steps">
            <span className="done">01 · Entrée</span>
            <span className="done">02 · Conversation</span>
            <span className="done">03 · Compréhension</span>
            <span className="done">04 · Diagnostic</span>
            <span className="active">05 · Définition</span>
          </div>
          <span className="mk-eyebrow"><span /> ÉTAPE 05 · DÉFINITION DU PRODUIT</span>
          <h1>Définissons le<br /><em>produit à concevoir.</em></h1>
          <p>
            MerKora réutilise les informations déjà données et sélectionne uniquement les précisions utiles à ton projet.
            Les 12 familles sont une bibliothèque adaptative, pas 12 formulaires obligatoires. Une question à la fois : tu peux répondre, indiquer « Je ne sais pas encore », « Non applicable » ou « Passer pour le moment ».
          </p>
        </div>

        <section className="mk-product-family-library" aria-label="Bibliothèque des 12 familles de définition">
          <div className="mk-product-family-library-heading">
            <span className="mk-summary-kicker">BIBLIOTHÈQUE DE DÉCISIONS · 12 FAMILLES</span>
            <p>Le moteur n'ouvre que les familles pertinentes pour l'activité, le domaine, les besoins et les réponses déjà fournis.</p>
          </div>
          <div className="mk-product-family-grid">
            {PRODUCT_DEFINITION_FAMILIES.map((family) => (
              <span className="mk-product-family-chip" key={family.id}>{family.label}</span>
            ))}
          </div>
        </section>

        {!loaded && <section className="mk-stage-empty"><p>Chargement de la définition de ton projet…</p></section>}

        {loaded && !dossier && (
          <section className="mk-stage-empty">
            <h2>Le dossier du projet est introuvable</h2>
            <p>Reviens à l'écran 03 pour retrouver les informations de ton projet. MerKora ne créera pas un dossier fictif.</p>
            <a className="mk-continue-button" href="/understanding">Ouvrir l'écran 03 <span>→</span></a>
          </section>
        )}

        {loaded && dossier && session && currentQuestion && (
          <>
            <div className="mk-stage-overview">
              <div><strong>{history.length}</strong><span>précisions enregistrées</span></div>
              <div><strong>{session.deferredQuestionIds.length}</strong><span>questions mises en attente</span></div>
              <div><strong>{session.version}</strong><span>version de la définition</span></div>
            </div>

            {session.deferredQuestionIds.length > 0 && (
              <button type="button" className="mk-secondary-button mk-resume-deferred" onClick={resumeDeferred}>
                Reprendre les {session.deferredQuestionIds.length} question(s) mises en attente
              </button>
            )}

            <section className="mk-diagnostic-card" aria-live="polite">
              <div className="mk-diagnostic-card-top">
                <span className="mk-summary-kicker">{editingAnswer ? "CORRECTION D'UNE RÉPONSE" : "PRÉCISION SUIVANTE · ADAPTÉE AU PROJET"}</span>
                <span className="mk-question-number">Précision {history.length + (editingAnswer ? 0 : 1)}</span>
              </div>
              <div className="mk-product-question-family">
                {PRODUCT_DEFINITION_FAMILIES.find((family) => family.id === currentQuestion.familyId)?.label ?? "Repère métier"}
                {currentQuestion.domainFamilyId && <span> · {currentQuestion.domainFamilyId.replace("family:", "").replaceAll("-", " ")}</span>}
              </div>
              <h2>{currentQuestion.prompt}</h2>
              <p className="mk-question-purpose">{currentQuestion.purpose}</p>

              {((currentQuestion.suggestedIndicators && currentQuestion.suggestedIndicators.length > 0) || (currentQuestion.suggestedFunctions && currentQuestion.suggestedFunctions.length > 0)) && (
                <p className="mk-product-evidence-note">Ces propositions viennent du référentiel métier et des informations déjà données. Tu gardes le choix : elles ne sont ni imposées ni activées automatiquement.</p>
              )}

              {currentQuestion.answerType === "single_choice" && (
                <div className="mk-diagnostic-options" role="radiogroup" aria-label="Choisir une réponse">
                  {(currentQuestion.options ?? []).map((option) => (
                    <label className={"mk-diagnostic-option" + (singleChoice === option ? " selected" : "")} key={option}>
                      <input type="radio" name="mk-product-choice" value={option} checked={singleChoice === option} onChange={() => { setSingleChoice(option); persistDraft({ singleChoice: option }); }} />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {currentQuestion.answerType === "multi_choice" && (
                <div className="mk-diagnostic-options" aria-label="Choisir une ou plusieurs réponses">
                  {(currentQuestion.options ?? []).map((option) => (
                    <label className={"mk-diagnostic-option" + (multipleChoices.includes(option) ? " selected" : "")} key={option}>
                      <input type="checkbox" checked={multipleChoices.includes(option)} onChange={(event) => {
                        const next = event.target.checked ? [...multipleChoices, option] : multipleChoices.filter((item) => item !== option);
                        setMultipleChoices(next);
                        persistDraft({ multipleChoices: next });
                      }} />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {currentQuestion.answerType === "text" && (
                <label className="mk-diagnostic-answer-label" htmlFor="mk-product-answer">
                  TA RÉPONSE
                  <textarea id="mk-product-answer" value={textAnswer} onChange={(event) => { setTextAnswer(event.target.value); persistDraft({ textAnswer: event.target.value }); }} rows={5} placeholder="Explique avec tes propres mots. Tu n'as pas besoin de vocabulaire technique." />
                </label>
              )}

              {currentQuestion.allowDetail && (
                <label className="mk-diagnostic-answer-label mk-diagnostic-detail" htmlFor="mk-product-detail">
                  UNE PRÉCISION COMPLÉMENTAIRE (FACULTATIF)
                  <textarea id="mk-product-detail" value={detail} onChange={(event) => { setDetail(event.target.value); persistDraft({ detail: event.target.value }); }} rows={2} placeholder="Tu peux ajouter un exemple ou une précision…" />
                </label>
              )}

              <div className="mk-diagnostic-actions">
                <button type="button" className="mk-continue-button" onClick={() => submitAnswer()}>
                  {editingAnswer ? "Enregistrer ma correction" : "Valider ma réponse"} <span>→</span>
                </button>
                <div className="mk-diagnostic-secondary-actions">
                  <button type="button" className="mk-secondary-button" onClick={() => submitAnswer("unknown")}>Je ne sais pas encore</button>
                  <button type="button" className="mk-tertiary-button" onClick={() => submitAnswer("not_applicable")}>Non applicable</button>
                  <button type="button" className="mk-tertiary-button" onClick={deferQuestion}>Passer pour le moment</button>
                </div>
              </div>
            </section>
          </>
        )}

        {loaded && dossier && session && !currentQuestion && (
          <section className="mk-diagnostic-complete">
            <span className="mk-summary-kicker">DÉFINITION INITIALE CONSOLIDÉE</span>
            <h2>Nous avons les éléments utiles pour préparer la composition du produit.</h2>
            <p>Les réponses, les propositions métier, les éléments inconnus et les points différés restent distincts. Aucune suggestion n'est transformée automatiquement en décision.</p>
            <div className="mk-diagnostic-complete-stats">
              <strong>{history.length} réponses conservées</strong>
              <strong>{session.deferredQuestionIds.length} questions différées</strong>
            </div>
            {session.deferredQuestionIds.length > 0 && (
              <button type="button" className="mk-secondary-button" onClick={resumeDeferred}>Reprendre les questions mises en attente</button>
            )}
            <a className="mk-secondary-button" href="/diagnostic">Revoir le diagnostic</a>
          </section>
        )}

        <section className="mk-diagnostic-history">
          <div className="mk-history-heading">
            <div><span className="mk-summary-kicker">MÉMOIRE DE LA DÉFINITION</span><h2>Réponses déjà données</h2></div>
            <span>{history.length}</span>
          </div>
          {!loaded || history.length === 0
            ? <p>Les précisions apparaîtront ici au fur et à mesure, sans remplacer tes mots d'origine.</p>
            : history.map((answer) => (
              <article className="mk-history-item" key={answer.id}>
                <div>
                  <strong>{answer.question.prompt}</strong>
                  <p>{Array.isArray(answer.value) ? answer.value.join(" · ") : answer.value}{answer.detail ? " — " + answer.detail : ""}</p>
                  {session?.answers.some((previous) => previous.id !== answer.id && previous.questionId === answer.questionId) && (
                    <details className="mk-answer-versions">
                      <summary>Voir les versions précédentes</summary>
                      {session.answers.filter((previous) => previous.id !== answer.id && previous.questionId === answer.questionId).map((previous) => (
                        <p key={previous.id}>{Array.isArray(previous.value) ? previous.value.join(" · ") : previous.value}{previous.detail ? " — " + previous.detail : ""}</p>
                      ))}
                    </details>
                  )}
                </div>
                <button type="button" className="mk-small-action" onClick={() => editPrevious(answer)}>Modifier</button>
              </article>
            ))}
        </section>

        {notice && <p className="mk-stage-notice" role="status">{notice}</p>}
      </section>

      <footer className="mk-footer"><span><b>MerKora GDJ</b> · Définir avant de concevoir.</span><span>Tu gardes le contrôle.</span></footer>
    </main>
  );
}
