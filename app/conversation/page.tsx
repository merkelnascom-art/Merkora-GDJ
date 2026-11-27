"use client";

import React, { useEffect, useState } from "react";
import { browserDossierStorage, getLatestLocalDossier, readLocalDossiers, saveLocalDossier } from "../../src/lib/dossiers/local-dossiers";
import { isDrtUnderstandingSessionPayload } from "../../src/lib/merkora-core/journey-boundaries";
import {
  answerUnderstanding,
  beginUnderstanding,
  decideUnderstandingSummary,
  deferUnderstandingQuestion,
  rebuildSituationGraph,
  type UnderstandingSession,
} from "../../src/lib/merkora-core/situation-intake-engine";

const SESSION_KEY = "merkora-v2-understanding-session";
const DRAFT_KEY = "merkora-v2-first-message";
const ANSWER_DRAFT_KEY = "merkora-v2-answer-draft";
const CORRECTION_DRAFT_KEY = "merkora-v2-correction-draft";

type OrbActivity = "idle" | "receiving" | "analyzing" | "responding";

function MerKoraOrb({ state, activity }: { state: "idle" | "clarification" | "summary_validation" | "complete"; activity: OrbActivity }) {
  return (
    <div
      className={`mk-orb-scene mk-orb-text mk-orb-state-${state} mk-orb-activity-${activity}`}
      role="img"
      aria-label="Sphère intelligente MerKora GDJ"
    >
      <div className="mk-orb-halo" />
      <div className="mk-orb-ring mk-orb-ring-a" />
      <div className="mk-orb-ring mk-orb-ring-b" />
      <div className="mk-orb-ring mk-orb-ring-c" />
      <div className="mk-orb-core">
        <div className="mk-orb-core-shine" />
        <div className="mk-orb-core-face"><span /><span /><i /></div>
      </div>
      <div className="mk-orb-wave mk-orb-wave-a" />
      <div className="mk-orb-wave mk-orb-wave-b" />
      <div className="mk-orb-wave mk-orb-wave-c" />
      <span className="mk-orb-star mk-orb-star-a">✦</span>
      <span className="mk-orb-star mk-orb-star-b">✧</span>
      <span className="mk-orb-star mk-orb-star-c">·</span>
      <span className="mk-orb-sr">Les ondes de MerKora GDJ</span>
    </div>
  );
}

export function ConversationProcessingIndicator({ visible, activity }: { visible: boolean; activity: OrbActivity }) {
  if (!visible) return null;

  const label = activity === "receiving"
    ? "Je reçois ton message…"
    : activity === "responding"
      ? "Je prépare la prochaine étape…"
      : "MerKora réfléchit à ta réponse…";

  return (
    <div className="mk-thinking-indicator" role="status" aria-live="polite" aria-busy="true" data-testid="mk-thinking-indicator">
      <span className="mk-thinking-orbit" aria-hidden="true"><i /><i /><i /></span>
      <span className="mk-thinking-label">{label}</span>
      <span className="mk-thinking-dots" aria-hidden="true"><i /><i /><i /></span>
    </div>
  );
}
export function ConversationPendingTurn({ message, activity }: { message: string; activity: OrbActivity }) {
  return (
    <>
      <article className="mk-dialogue-message mk-dialogue-visitor">
        <span>TOI</span>
        <p>{message}</p>
      </article>
      <ConversationProcessingIndicator visible activity={activity} />
    </>
  );
}

function readStoredSession(): UnderstandingSession | null {
  let forceNew = false;
  let raw: string | null = null;
  try {
    forceNew = window.sessionStorage.getItem("merkora-v2-new-journey") === "true";
    raw = window.sessionStorage.getItem(SESSION_KEY);
  } catch {
    // Le stockage de session peut être désactivé par le navigateur.
  }
  if (forceNew) return null;

  let parsed: Partial<UnderstandingSession> | undefined;
  try {
    if (raw) parsed = JSON.parse(raw) as Partial<UnderstandingSession>;
  } catch {
    // Une ancienne session illisible ne bloque pas la récupération locale.
  }
  if (!parsed) {
    try {
      const storage = browserDossierStorage();
      const local = storage ? getLatestLocalDossier<UnderstandingSession>(storage, (dossier) =>
        (dossier.journey === "drt" || dossier.journey === undefined) && isDrtUnderstandingSessionPayload(dossier.payload),
      ) : null;
      parsed = local?.payload as Partial<UnderstandingSession> | undefined;
    } catch {
      // Le dossier local peut être indisponible sur un navigateur en mode privé.
    }
  }
  if (isDrtUnderstandingSessionPayload(parsed)) {
    const restored = parsed as Partial<UnderstandingSession>;
    return {
      ...restored,
      situationGraph: restored.situationGraph ?? rebuildSituationGraph(restored.messages as UnderstandingSession["messages"]),
    } as UnderstandingSession;
  }
  return null;
}

export default function ConversationPage() {
  const [message, setMessage] = useState("");
  const [session, setSession] = useState<UnderstandingSession | null>(null);
  const [correction, setCorrection] = useState("");
  const [showCorrection, setShowCorrection] = useState(false);
  const [orbActivity, setOrbActivity] = useState<OrbActivity>("idle");
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingMessage, setPendingMessage] = useState("");

  useEffect(() => {
    const restored = readStoredSession();
    setSession(restored);
    try {
      const draftKey = restored ? ANSWER_DRAFT_KEY : DRAFT_KEY;
      const draft = window.sessionStorage.getItem(draftKey);
      const correctionDraft = window.sessionStorage.getItem(CORRECTION_DRAFT_KEY);
      if (draft) setMessage(draft);
      if (correctionDraft) {
        setCorrection(correctionDraft);
        setShowCorrection(true);
      }
    } catch {
      // La page reste utilisable si le stockage de session est indisponible.
    }
  }, []);

  function storeSession(next: UnderstandingSession) {
    setSession(next);
    const localStorage = browserDossierStorage();
    if (localStorage) {
      try {
        const existing = readLocalDossiers<UnderstandingSession>(localStorage).find(item => item.id === next.id);
        saveLocalDossier(localStorage, {
          id: next.id,
          title: next.originalDescription.slice(0, 120) || "Nouveau projet",
          journey: "drt",
          payload: next,
          version: next.version,
          syncedVersion: existing?.syncedVersion,
          updatedAt: new Date().toISOString(),
        });
      } catch {
        // La session courante reste disponible même si le stockage local est plein.
      }
    }
    try {
      window.sessionStorage.removeItem("merkora-v2-new-journey");
      window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(next));
      window.sessionStorage.removeItem(DRAFT_KEY);
      window.sessionStorage.removeItem(ANSWER_DRAFT_KEY);
      window.sessionStorage.removeItem(CORRECTION_DRAFT_KEY);
    } catch {
      // La conversation reste utilisable même sans stockage de session.
    }
  }
  function updateMessageDraft(value: string) {
    setMessage(value);
    try {
      window.sessionStorage.setItem(session ? ANSWER_DRAFT_KEY : DRAFT_KEY, value);
    } catch {
      // La saisie reste disponible même si le stockage local à la session échoue.
    }
  }

  function updateCorrectionDraft(value: string) {
    setCorrection(value);
    try {
      window.sessionStorage.setItem(CORRECTION_DRAFT_KEY, value);
    } catch {
      // La correction reste disponible dans le champ courant.
    }
  }

  function processIncomingMessage(process: () => void) {
    if (isProcessing) return;
    setIsProcessing(true);
    setOrbActivity("receiving");
    window.setTimeout(() => {
      setOrbActivity("analyzing");
      window.setTimeout(() => {
        process();
        setOrbActivity("responding");
        window.setTimeout(() => {
          setOrbActivity("idle");
          setIsProcessing(false);
          setPendingMessage("");
        }, 760);
      }, 950);
    }, 300);
  }

  function startJourney() {
    if (!message.trim() || isProcessing) return;
    const firstMessage = message.trim();
    setPendingMessage(firstMessage);
    processIncomingMessage(() => {
      storeSession(beginUnderstanding(firstMessage));
      setMessage("");
      setCorrection("");
      setShowCorrection(false);
    });
  }

  function sendAnswer() {
    if (!session || !message.trim() || isProcessing) return;
    const answer = message;
    const currentSession = session;
    setPendingMessage(answer.trim());
    processIncomingMessage(() => {
      storeSession(answerUnderstanding(currentSession, answer));
      setMessage("");
    });
  }

  function skipQuestion() {
    if (!session) return;
    storeSession(deferUnderstandingQuestion(session));
  }

  function confirmSummary() {
    if (!session) return;
    storeSession(decideUnderstandingSummary(session, "confirmed"));
  }

  function submitCorrection() {
    if (!session || !correction.trim()) return;
    storeSession(decideUnderstandingSummary(session, "corrected", correction));
    setCorrection("");
    setShowCorrection(false);
  }

  function deferSummary() {
    if (!session) return;
    storeSession(decideUnderstandingSummary(session, "deferred"));
  }

  function resumeSummary() {
    if (!session || session.stage !== "complete") return;
    storeSession({ ...session, stage: "summary_validation", version: session.version + 1 });
  }

  function restartJourney() {
    setSession(null);
    setMessage("");
    setCorrection("");
    setShowCorrection(false);
    try {
      window.sessionStorage.removeItem(SESSION_KEY);
      window.sessionStorage.removeItem(DRAFT_KEY);
      window.sessionStorage.removeItem(ANSWER_DRAFT_KEY);
      window.sessionStorage.removeItem(CORRECTION_DRAFT_KEY);
      window.sessionStorage.setItem("merkora-v2-new-journey", "true");
    } catch {
      // Le redémarrage visuel reste possible sans stockage.
    }
  }

  const orbState = session?.stage ?? "idle";
  const statusText = orbActivity === "receiving"
    ? "Je reçois ton message"
    : orbActivity === "analyzing"
      ? "Je relie les éléments de ton récit"
      : orbActivity === "responding"
        ? "Je prépare ma réponse"
        : session?.stage === "clarification"
          ? "À l'écoute · une question à la fois"
          : session?.stage === "summary_validation"
            ? "Je te présente ce que j'ai compris"
            : session?.stage === "complete"
              ? "Cette étape de compréhension est terminée"
              : "Conversation écrite · prête à commencer";

  return (
    <main className="mk-v2-page mk-conversation-page">
      <div className="mk-v2-noise" aria-hidden="true" />
      <header className="mk-header">
        <a className="mk-brand" href="/" aria-label="Retour à l'accueil MerKora GDJ">
          <span className="mk-brand-mark">M</span>
          <span><strong>MerKora GDJ</strong><small>GUIDED DIGITAL JOURNEY · V2</small></span>
        </a>
        <a className="mk-back-link" href="/">← Retour</a>
      </header>

      <section className="mk-conversation-layout">
        <div className="mk-orb-column">
          <span className="mk-eyebrow"><span /> ESPACE DE COMPRÉHENSION</span>
          <MerKoraOrb state={orbState} activity={orbActivity} />
          <div className="mk-orb-status" role="status" aria-live="polite"><i /> {statusText}</div>
          <p className="mk-orb-caption">
            Une idée, un besoin, une envie de changement.<br />
            <b>On avance une question à la fois.</b>
          </p>
          {session && (
            <div className="mk-understanding-progress">
              <span>Éléments explicitement repérés</span>
              <strong>{session.evidence.length}</strong>
            </div>
          )}
        </div>

        <div className="mk-conversation-copy">
          <span className="mk-eyebrow"><span /> {session ? "NOTRE ÉCHANGE EN COURS" : "PRENONS LE TEMPS DE COMPRENDRE"}</span>
          <h1>
            {session?.stage === "summary_validation" ? <>Voici ce que j'ai compris.<br /><em>Dis-moi si c'est fidèle.</em></> :
              session?.stage === "complete" ? <>Une première compréhension.<br /><em>Construite ensemble.</em></> :
                session ? <>Continuons à éclaircir.<br /><em>Je te suis.</em></> :
                  <>Alors, raconte-moi.<br /><em>Je suis là pour comprendre.</em></>}
          </h1>
          {!session && !isProcessing && (
            <>
              <p className="mk-conversation-intro">
                On va avancer simplement : je te pose une question, tu réponds, puis je passe à la suivante.
              </p>
              <label className="mk-input-label" htmlFor="mk-first-message">UNE PREMIÈRE QUESTION</label>
              <textarea
                id="mk-first-message"
                className="mk-first-message"
                value={message}
                onChange={(event) => updateMessageDraft(event.target.value)}
                placeholder="En quelques mots, que souhaites-tu améliorer ou créer ?"
                rows={3}
              />
              <div className="mk-input-footer">
                <span>Réponds naturellement. Tu n'as pas besoin de termes techniques.</span>
              </div>
              <button type="button" className="mk-continue-button" onClick={startJourney} disabled={!message.trim() || isProcessing}>
                Commencer notre compréhension <span>→</span>
              </button>
              <p className="mk-privacy-note">Tes mots restent le point de départ. Rien n'est considéré comme validé sans ton accord.</p>
            </>
          )}

          {session && (
            <>
              {session.messages.length > 2 && (
                <details className="mk-conversation-history">
                  <summary>Voir notre échange précédent ({session.messages.length - 2})</summary>
                  <div className="mk-dialogue" aria-label="Historique précédent">
                    {session.messages.slice(0, -2).map((item) => (
                      <article key={item.id} className={`mk-dialogue-message mk-dialogue-${item.role}`}>
                        <span>{item.role === "visitor" ? "TOI" : "MERKORA"}</span>
                        <p>{item.content}</p>
                      </article>
                    ))}
                  </div>
                </details>
              )}
              <div className="mk-dialogue" role="log" aria-live="polite" aria-label="Derniers messages">
                {(pendingMessage && session.messages.some((item) => item.role === "visitor" && item.content === pendingMessage) ? session.messages.slice(-4, -2) : session.messages.slice(-2)).map((item) => (
                  <article key={item.id} className={`mk-dialogue-message mk-dialogue-${item.role}`}>
                    <span>{item.role === "visitor" ? "TOI" : "MERKORA"}</span>
                    <p>{item.content}</p>
                  </article>
                ))}
                {pendingMessage && <ConversationPendingTurn message={pendingMessage} activity={orbActivity} />}
              </div>

              {session.stage === "clarification" && session.pendingQuestion && (
                <div className="mk-answer-panel">
                  <label className="mk-input-label" htmlFor="mk-follow-up-answer">TA RÉPONSE</label>
                  <textarea
                    id="mk-follow-up-answer"
                    className="mk-first-message"
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Prends ton temps pour expliquer…"
                    rows={3}
                  />
                  <div className="mk-answer-actions">
                    <button type="button" className="mk-continue-button" onClick={sendAnswer} disabled={!message.trim() || isProcessing}>
                      Envoyer ma réponse <span>→</span>
                    </button>
                    <button type="button" className="mk-secondary-button" onClick={skipQuestion}>
                      Je préfère passer cette question
                    </button>
                  </div>
                </div>
              )}

              {session.stage === "summary_validation" && (
                <section className="mk-summary-card" aria-labelledby="mk-summary-title">
                  <span className="mk-summary-kicker">SYNTHÈSE PROVISOIRE</span>
                  <h2 id="mk-summary-title">Est-ce que j'ai bien compris ?</h2>
                  <p className="mk-summary-text">{session.summary}</p>
                  {showCorrection ? (
                    <div className="mk-correction-panel">
                      <label className="mk-input-label" htmlFor="mk-correction">CE QUE JE DOIS CORRIGER</label>
                      <textarea id="mk-correction" className="mk-first-message" value={correction} onChange={(event) => updateCorrectionDraft(event.target.value)} rows={3} placeholder="Ce point n'est pas exact…"/>
                      <button type="button" className="mk-continue-button" onClick={submitCorrection} disabled={!correction.trim()}>
                        Envoyer ma correction <span>→</span>
                      </button>
                    </div>
                  ) : (
                    <div className="mk-summary-actions">
                      <button type="button" className="mk-continue-button" onClick={confirmSummary}>Oui, c'est fidèle <span>✓</span></button>
                      <button type="button" className="mk-secondary-button" onClick={() => setShowCorrection(true)}>Non, je veux corriger</button>
                      <button type="button" className="mk-tertiary-button" onClick={deferSummary}>Je préfère vérifier plus tard</button>
                    </div>
                  )}
                </section>
              )}

              {session.stage === "complete" && (
                <section className="mk-completion-card" role="status">
                  <strong>{session.validations.at(-1)?.decision === "confirmed" ? "Compréhension validée" : "Compréhension conservée, sans validation"}</strong>
                  <p>{session.validations.at(-1)?.decision === "confirmed"
                    ? "Tu as confirmé la synthèse. Les éléments recueillis portent maintenant le statut « validé par toi »."
                    : "La synthèse reste conservée et non validée. Tu peux reprendre sa vérification ou recommencer."}</p>
                  <p className="mk-summary-text">{session.summary}</p>
                  {session.validations.at(-1)?.decision !== "confirmed" && (
                    <button type="button" className="mk-secondary-button" onClick={resumeSummary}>Reprendre la vérification</button>
                  )}
                  <a className="mk-continue-button mk-stage-transition" href="/understanding">Continuer vers l'écran 03 · Vérifier ma compréhension <span>→</span></a>
                  <button type="button" className="mk-tertiary-button" onClick={restartJourney}>Commencer une nouvelle compréhension</button>
                </section>
              )}

              <p className="mk-privacy-note">Tu gardes le contrôle : rien n'est validé sans ton accord.</p>
            </>
          )}
          {!session && isProcessing && (
            <div className="mk-dialogue" role="log" aria-live="polite" aria-label="Historique de notre conversation">
              <ConversationPendingTurn message={pendingMessage} activity={orbActivity} />
            </div>
          )}
        </div>
      </section>
      <footer className="mk-footer">
        <span><b>MerKora GDJ</b> · L'intelligence pour comprendre. La technologie pour réaliser.</span>
        <span>Vos idées restent les vôtres.</span>
      </footer>
    </main>
  );
}
