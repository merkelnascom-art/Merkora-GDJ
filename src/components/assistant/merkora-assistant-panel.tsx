"use client";

import { useState, type FormEvent } from "react";
import { createMerkoraConversationReply, type ConversationReply } from "@/lib/assistant/merkora-conversation";

type Props = { projectId: string; projectTitle: string; problem: string; desiredOutcome: string };

export function MerkoraAssistantPanel({ projectId, projectTitle, problem, desiredOutcome }: Props) {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState<ConversationReply | null>(null);
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<"cloud" | "local" | null>(null);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!message.trim() || busy) return;
    setBusy(true);
    setError("");
    const submitted = message.trim();
    try {
      const response = await fetch(`/api/projects/${encodeURIComponent(projectId)}/assistant`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: submitted, history: [] }),
      });
      if (response.ok) {
        const payload: unknown = await response.json();
        if (payload && typeof payload === "object" && "reply" in payload) {
          setReply((payload as { reply: ConversationReply }).reply);
          setMode("cloud");
          setMessage("");
          return;
        }
      }
      // A local-only draft may not yet exist in the cloud. Never lose the user's request.
      setReply(createMerkoraConversationReply({
        message: `${submitted}\nProjet : ${projectTitle}. Problème : ${problem}. Résultat souhaité : ${desiredOutcome}`,
        history: [],
      }));
      setMode("local");
      setMessage("");
      if (response.status === 401) {
        setError("Connectez-vous pour analyser le dossier en ligne. Une première analyse locale est affichée ci-dessous.");
      } else if (response.status === 404) {
        setError("Ce dossier n'est pas encore synchronisé avec votre espace en ligne. Une première analyse locale est affichée ci-dessous.");
      } else {
        setError("L'assistant en ligne est indisponible pour le moment. Une première analyse locale est affichée ci-dessous.");
      }
    } catch {
      setReply(createMerkoraConversationReply({
        message: `${submitted}\nProjet : ${projectTitle}. Problème : ${problem}. Résultat souhaité : ${desiredOutcome}`,
        history: [],
      }));
      setMode("local");
      setMessage("");
      setError("Connexion indisponible : une première analyse locale est affichée. Aucun fournisseur IA externe n'a été appelé.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="panel" aria-labelledby="merkora-assistant-title">
      <div className="panel-heading">
        <div>
          <div className="eyebrow">MERKORA · ASSISTANT DE PROJET</div>
          <h3 id="merkora-assistant-title">Réfléchissons ensemble.</h3>
          <p>Expliquez ce qui manque, corrigez notre compréhension ou demandez quelles pistes examiner.</p>
        </div>
        <span className="local-tag">{mode === "cloud" ? "Espace sécurisé" : "Mode sans dépense"}</span>
      </div>
      <form onSubmit={submit} className="need-form">
        <label className="field-wide">
          Votre message
          <textarea value={message} onChange={(event) => setMessage(event.target.value)} rows={3} maxLength={5000}
            placeholder="Ex. Je veux savoir qui arrive en retard et recevoir un rapport chaque semaine…" />
        </label>
        <div className="form-footer">
          <p>Les réponses actuelles reposent sur l'analyse MerKora locale. Les modèles externes restent désactivés par défaut.</p>
          <button className="button button-primary" type="submit" disabled={busy || !message.trim()}>
            {busy ? "Analyse…" : "Analyser avec MerKora"} <span>→</span>
          </button>
        </div>
      </form>
      {error && <p role="status" className="discovery-notice">{error}</p>}
      {reply && (
        <div className="discovery-summary" aria-live="polite">
          <div className="discovery-summary-head">
            <div><div className="eyebrow">{mode === "cloud" ? "RÉPONSE DU SERVICE MERKORA" : "PREMIÈRE ANALYSE LOCALE"}</div><h4>{reply.status === "needs_clarification" ? "Précisons votre besoin" : "Pistes à examiner"}</h4></div>
            <span className="local-tag">{reply.status === "draft" ? "Proposition" : "Clarification"}</span>
          </div>
          <p>{reply.assistantMessage}</p>
          {reply.suggestedModules.length > 0 && <div className="recommendation-list">{reply.suggestedModules.map((item) => (
            <article className="recommendation-card" key={item.id}>
              <span className="recommendation-number">✳</span>
              <div><h4>{item.title}</h4><p>{item.description}</p><small>{item.reason}</small></div>
            </article>
          ))}</div>}
          {reply.clarifyingQuestions.length > 0 && <div className="clarification-list"><strong>Questions à traiter</strong><ol>{reply.clarifyingQuestions.map((question) => <li key={question}>{question}</li>)}</ol></div>}
          <p className="discovery-notice">{reply.disclaimer}</p>
        </div>
      )}
    </section>
  );
}
