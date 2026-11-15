"use client";

import React, { useEffect, useState } from "react";
import {
  answerUnderstanding,
  beginUnderstanding,
  decideUnderstandingSummary,
  deferUnderstandingQuestion,
  rebuildSituationGraph,
  type UnderstandingSession,
} from "../../src/lib/merkora-core/situation-intake-engine";

const examples = [
  { icon: "✦", label: "Éducation", text: "Améliorer la gestion de mon établissement" },
  { icon: "◈", label: "Commerce", text: "Mieux suivre les ventes de mon activité" },
  { icon: "⌁", label: "Une idée", text: "J'ai une idée à développer" },
];

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
      aria-label="Sphère intelligente MerKora"
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
      <span className="mk-orb-sr">Les ondes de MerKora</span>
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
  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<UnderstandingSession>;
    if (
      typeof parsed.originalDescription === "string" &&
      Array.isArray(parsed.messages) &&
      Array.isArray(parsed.evidence) &&
      typeof parsed.stage === "string"
    ) {
      return {
        ...parsed,
        situationGraph: parsed.situationGraph ?? rebuildSituationGraph(parsed.messages as UnderstandingSession["messages"]),
      } as UnderstandingSession;
    }
  } catch {
    // Une session illisible ne doit jamais bloquer l'écran.
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
    try {
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
        <a className="mk-brand" href="/" aria-label="Retour à l'accueil MerKora">
          <span className="mk-brand-mark">M</span>
          <span><strong>MerKora</strong><small>GUIDED DIGITAL JOURNEY · V2</small></span>
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
                Qu'aimerais-tu créer, améliorer, organiser ou résoudre ? Tu peux commencer par ce qui te préoccupe, même si ton idée n'est pas encore très claire.
              </p>
              <label className="mk-input-label" htmlFor="mk-first-message">DÉCRIS CE QUE TU SOUHAITES IMAGINER</label>
              <textarea
                id="mk-first-message"
                className="mk-first-message"
                value={message}
                onChange={(event) => updateMessageDraft(event.target.value)}
                placeholder="En ce moment, ce qui me pose problème, c'est…"
                rows={5}
              />
              <div className="mk-input-footer">
                <span>Tu peux écrire librement, sans vocabulaire technique.</span>
                <span>{message.length} caractères</span>
              </div>
              <div className="mk-example-heading">
                <strong>Quelques points de départ, si tu en as besoin</strong>
                <span>FACULTATIFS</span>
              </div>
              <div className="mk-example-list">
                {examples.map((example) => (
                  <button key={example.label} type="button" className="mk-example-chip" onClick={() => setMessage(example.text)}>
                    <span>{example.icon}</span><small>{example.label}</small><b>{example.text}</b><i>＋</i>
                  </button>
                ))}
              </div>
              <p className="mk-free-note">Tu peux aussi raconter ton besoin librement. Aucun domaine ni type de projet n'est imposé.</p>
              <button type="button" className="mk-continue-button" onClick={startJourney} disabled={!message.trim() || isProcessing}>
                Commencer notre compréhension <span>→</span>
              </button>
              <p className="mk-privacy-note">Tes mots restent le point de départ. Rien n'est considéré comme validé sans ton accord.</p>
            </>
          )}

          {session && (
            <>
              <section aria-label="Dossier de compréhension en construction" style={{margin:"1.25rem 0",padding:"1rem",border:"1px solid rgba(196,164,104,.35)",borderRadius:"18px",background:"rgba(12,17,38,.72)"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:"1rem",marginBottom:".8rem"}}>
                  <div><span className="mk-summary-kicker">DÉCRYPTAGE EN DIRECT</span><h2 style={{margin:".25rem 0",fontSize:"1.15rem"}}>Ce que j'ai recueilli</h2></div>
                  <strong>{session.evidence.length} éléments</strong>
                </div>
                <p style={{fontSize:".88rem",opacity:.78,marginTop:0}}>Chaque élément reste relié au message qui l'a fourni. Les informations exprimées ne sont pas confondues avec des hypothèses.</p>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:".65rem"}}>
                  {(["project_scope","problem","audience","actor","goal","preference","activity","feature","context","resource","constraint","cause"] as const).map((dimension)=> {
                    const items=session.evidence.filter((item)=>item.dimension===dimension);
                    if(!items.length)return null;
                    const labels:Record<string,string>={project_scope:"Identité du projet",problem:"Situation / problème",audience:"Public concerné",actor:"Personnes et rôles",goal:"Objectifs",preference:"Solution imaginée",activity:"Activités concernées",feature:"Fonctionnement",context:"Cadre",resource:"Données / ressources",constraint:"Contraintes",cause:"Causes évoquées"};
                    return <div key={dimension} style={{padding:".75rem",borderRadius:"12px",background:"rgba(255,255,255,.045)",border:"1px solid rgba(255,255,255,.08)"}}>
                      <strong style={{fontSize:".82rem"}}>{labels[dimension]}</strong>
                      {items.map((item)=><div key={item.id} style={{fontSize:".82rem",lineHeight:1.5,marginTop:".4rem",overflowWrap:"anywhere"}}>{item.value}<div style={{fontSize:".68rem",opacity:.65}}>{item.status==="validated"?"Validé par toi":item.status==="hypothesis"?"Hypothèse à vérifier":item.status==="inferred"?"Déduit par le moteur":"Exprimé par toi"}</div><div style={{fontSize:".66rem",opacity:.5}}>Origine : {Math.max(1,session.messages.findIndex((message)=>message.id===item.sourceMessageId)+1)}ᵉ message de ton récit</div></div>)}
                    </div>;
                  })}
                </div>
                {session.situationGraph.relations.length > 0 && (
                  <div style={{marginTop:".9rem",paddingTop:".8rem",borderTop:"1px solid rgba(255,255,255,.1)"}}>
                    <strong style={{fontSize:".82rem"}}>Relations repérées entre les éléments</strong>
                    <div style={{display:"grid",gap:".4rem",marginTop:".55rem"}}>
                      {session.situationGraph.relations.slice(0,6).map((relation)=> {
                        const from=session.situationGraph.entities.find((entity)=>entity.id===relation.fromEntityId);
                        const to=session.situationGraph.entities.find((entity)=>entity.id===relation.toEntityId);
                        const verbs:Record<string,string>={imagines:"imagine",intended_for:"s'adresse à",aims_at:"vise",experiences:"rencontre / vit"};
                        return <div key={relation.id} style={{fontSize:".78rem",opacity:.88}}>
                          <b>{from?.label ?? "Élément non identifié"}</b> — {verbs[relation.predicate] ?? relation.predicate} — <b>{to?.label ?? "Élément non identifié"}</b>
                        </div>;
                      })}
                    </div>
                  </div>
                )}
                {session.situationGraph.unresolvedRelations.length > 0 && (
                  <p style={{marginBottom:0,fontSize:".75rem",opacity:.7}}>
                    {session.situationGraph.unresolvedRelations.length} lien(s) restent à éclaircir ; aucun élément manquant n'est inventé.
                  </p>
                )}
                {session.stage==="clarification"&&session.pendingQuestion&&<p style={{marginBottom:0,fontSize:".85rem",color:"#d9bd83"}}>Prochaine précision utile : {session.pendingQuestion.rationale}</p>}
              </section>
              <div className="mk-dialogue" role="log" aria-live="polite" aria-label="Historique de notre conversation">
                {(pendingMessage ? session.messages.slice(0, -2) : session.messages).map((item) => (
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
                  <button type="button" className="mk-tertiary-button" onClick={restartJourney}>Commencer une nouvelle compréhension</button>
                </section>
              )}

              <p className="mk-privacy-note">Le moteur actuel utilise des règles explicites, des indices de langage et quelques contrôles limités de cohérence. Il ne prétend pas comprendre automatiquement tout texte ni deviner tes intentions. Rien n'est validé sans ton accord.</p>
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
