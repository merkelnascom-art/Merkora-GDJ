"use client";

import { useEffect, useState, type FormEvent } from "react";
import { createMerkoraConversationReply, type ConversationReply } from "@/lib/assistant/merkora-conversation";

type Props = { projectId: string; projectTitle: string; problem: string; desiredOutcome: string };
type ConversationItem = { id?: string; role: "user" | "assistant"; content: string };

export function MerkoraAssistantPanel({ projectId, projectTitle, problem, desiredOutcome }: Props) {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState<ConversationReply | null>(null);
  const [messages, setMessages] = useState<ConversationItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [consented, setConsented] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const [consentBusy, setConsentBusy] = useState(false);
  const [noticeVersion, setNoticeVersion] = useState("2026-11-13-v1");

  useEffect(() => {
    let active = true;
    async function loadProjectContext() {
      const [historyResponse, consentResponse] = await Promise.all([
        fetch(`/api/projects/${encodeURIComponent(projectId)}/assistant`, { cache: "no-store" }),
        fetch(`/api/projects/${encodeURIComponent(projectId)}/ai-consent`, { cache: "no-store" }),
      ]);
      if (!active) return;
      if (historyResponse.ok) {
        const payload: unknown = await historyResponse.json().catch(() => null);
        if (payload && typeof payload === "object" && "messages" in payload && Array.isArray((payload as { messages: unknown[] }).messages)) {
          const loaded = (payload as { messages: unknown[] }).messages.flatMap((item): ConversationItem[] => {
            if (!item || typeof item !== "object") return [];
            const row = item as Record<string, unknown>;
            return (row.role === "user" || row.role === "assistant") && typeof row.content === "string"
              ? [{ id: typeof row.id === "string" ? row.id : undefined, role: row.role, content: row.content }]
              : [];
          });
          setMessages(loaded);
        }
      }
      if (consentResponse.ok) {
        const payload: unknown = await consentResponse.json().catch(() => null);
        if (payload && typeof payload === "object") {
          const value = payload as { consented?: boolean; noticeVersion?: string };
          setConsented(value.consented === true);
          if (typeof value.noticeVersion === "string") setNoticeVersion(value.noticeVersion);
        }
      }
    }
    void loadProjectContext().catch(() => {
      if (active) setError("La mémoire en ligne n'a pas pu être chargée. Vérifiez votre connexion avant de poursuivre.");
    });
    return () => { active = false; };
  }, [projectId]);

  async function acceptAiProcessing() {
    if (!consentChecked || consentBusy) return;
    setConsentBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/projects/${encodeURIComponent(projectId)}/ai-consent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ consent: true, noticeVersion }),
      });
      const payload: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        const detail = payload && typeof payload === "object" && "error" in payload ? String((payload as { error: unknown }).error) : "";
        throw new Error(detail || "Votre autorisation n'a pas pu être enregistrée.");
      }
      setConsented(true);
      setConsentChecked(false);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Votre autorisation n'a pas pu être enregistrée.");
    } finally {
      setConsentBusy(false);
    }
  }

  async function revokeAiProcessing() {
    if (consentBusy) return;
    setConsentBusy(true);
    try {
      const response = await fetch(`/api/projects/${encodeURIComponent(projectId)}/ai-consent`, { method: "PATCH" });
      if (!response.ok) throw new Error("Le retrait de votre autorisation n'a pas pu être enregistré.");
      setConsented(false);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Le retrait de votre autorisation a échoué.");
    } finally {
      setConsentBusy(false);
    }
  }

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
      const payload: unknown = await response.json().catch(() => null);
      if (response.ok && payload && typeof payload === "object" && "reply" in payload) {
        const result = payload as { reply: ConversationReply; synchronized?: boolean; conversationSynchronized?: boolean };
        setReply(result.reply);
        setMessages((current) => [
          ...current,
          { role: "user", content: submitted },
          { role: "assistant", content: result.reply.assistantMessage },
        ]);
        if (result.synchronized !== true) {
          setError("Votre réponse est affichée, mais la mémoire décisionnelle n'est pas synchronisée.");
        } else if (result.conversationSynchronized !== true) {
          setError("Votre décision est enregistrée, mais l'historique complet des échanges n'est pas encore synchronisé. La mémoire conversationnelle nécessite l'activation de la migration dédiée.");
        }
        setMessage("");
        return;
      }
      const detail = payload && typeof payload === "object" && "error" in payload
        ? String((payload as { error: unknown }).error) : "L'analyse en ligne est momentanément indisponible.";
      setError(detail);
      const localReply = createMerkoraConversationReply({
        message: `${submitted}\nProjet : ${projectTitle}. Problème : ${problem}. Résultat souhaité : ${desiredOutcome}`,
        history: [],
      });
      setReply(localReply);
      setMessages((current) => [...current, { role: "user", content: submitted }, { role: "assistant", content: localReply.assistantMessage }]);
      setMessage("");
    } catch {
      const localReply = createMerkoraConversationReply({
        message: `${submitted}\nProjet : ${projectTitle}. Problème : ${problem}. Résultat souhaité : ${desiredOutcome}`,
        history: [],
      });
      setReply(localReply);
      setMessages((current) => [...current, { role: "user", content: submitted }, { role: "assistant", content: localReply.assistantMessage }]);
      setError("Connexion indisponible. Une première analyse locale est affichée ; la synchronisation en ligne reste à rétablir.");
      setMessage("");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="panel" aria-labelledby="merkora-assistant-title">
      <div className="panel-heading">
        <div>
          <div className="eyebrow">MERKORA · ESPACE DE CONCEPTION</div>
          <h3 id="merkora-assistant-title">Construisons votre projet ensemble.</h3>
          <p>Votre dossier conserve les échanges, les précisions et les décisions afin de reprendre le travail sur vos différents appareils.</p>
        </div>
        <span className="local-tag">Mémoire de projet</span>
      </div>

      {!consented ? (
        <div className="discovery-notice" style={{ marginBottom: "1rem" }}>
          <strong>Traitement assisté par intelligence artificielle</strong>
          <p>Pour approfondir votre dossier et préparer des propositions, MerKora peut utiliser ses propres traitements ainsi que des services externes spécialisés. Certaines informations de votre projet pourront leur être transmises uniquement pour fournir ce service. Consultez notre <a href="/confidentialite">notice de confidentialité et de traitement assisté</a> pour comprendre les données concernées, vos choix et les vérifications encore nécessaires avant l’ouverture publique. N’envoyez aucun mot de passe ni donnée inutilement sensible.</p>
          <label style={{ display: "flex", alignItems: "flex-start", gap: "0.65rem", marginTop: "0.75rem" }}>
            <input type="checkbox" checked={consentChecked} onChange={(event) => setConsentChecked(event.target.checked)} />
            <span>J'ai lu cette information et j'autorise le traitement assisté de mon dossier, y compris par des prestataires externes lorsque cela est nécessaire.</span>
          </label>
          <button className="button button-primary" type="button" disabled={!consentChecked || consentBusy} onClick={acceptAiProcessing} style={{ marginTop: "0.75rem" }}>
            {consentBusy ? "Enregistrement…" : "Confirmer et continuer"} <span>→</span>
          </button>
        </div>
      ) : (
        <div className="discovery-notice" style={{ marginBottom: "1rem" }}>
          <span>Le traitement assisté est autorisé pour ce dossier. Les échanges restent liés à votre projet.</span>
          <button className="button button-secondary" type="button" disabled={consentBusy} onClick={revokeAiProcessing} style={{ marginLeft: "0.75rem" }}>
            Retirer mon autorisation
          </button>
        </div>
      )}

      {messages.length > 0 && (
        <div className="clarification-list" aria-label="Historique du projet">
          <strong>Historique du dossier</strong>
          <ol>
            {messages.slice(-12).map((item, index) => (
              <li key={item.id ?? `${item.role}-${index}`}>
                <strong>{item.role === "user" ? "Vous" : "MerKora"}</strong> : {item.content}
              </li>
            ))}
          </ol>
        </div>
      )}

      <form onSubmit={submit} className="need-form">
        <label className="field-wide">
          Votre message
          <textarea value={message} onChange={(event) => setMessage(event.target.value)} rows={3} maxLength={5000}
            placeholder="Décrivez votre idée, ajoutez une précision ou corrigez notre compréhension…" />
        </label>
        <div className="form-footer">
          <p>MerKora conserve vos choix et reprend le contexte du dossier à chaque échange. Les propositions restent à valider.</p>
          <button className="button button-primary" type="submit" disabled={busy || !message.trim()}>
            {busy ? "Analyse…" : "Continuer avec MerKora"} <span>→</span>
          </button>
        </div>
      </form>
      {error && <p role="status" className="discovery-notice">{error}</p>}
      {reply && (
        <div className="discovery-summary" aria-live="polite">
          <div className="discovery-summary-head">
            <div><div className="eyebrow">ANALYSE MERKORA</div><h4>{reply.status === "needs_clarification" ? "Précisons votre besoin" : "Pistes à examiner"}</h4></div>
            <span className="local-tag">{reply.status === "draft" ? "Proposition" : "Clarification"}</span>
          </div>
          <p>{reply.assistantMessage}</p>
          {reply.domainLabel && <p className="discovery-notice">Domaine repéré : <strong>{reply.domainLabel}</strong> · Confiance {reply.confidence === "high" ? "forte" : reply.confidence === "medium" ? "moyenne" : "à confirmer"}{reply.specializationId ? ` · Spécialisation : ${reply.specializationId.replace(/-/g, " ")}` : ""}.</p>}
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
