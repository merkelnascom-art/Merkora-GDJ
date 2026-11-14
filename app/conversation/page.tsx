"use client";

import React, { useEffect, useState } from "react";

const examples = [
  { icon: "✦", label: "Éducation", text: "Améliorer la gestion de mon établissement" },
  { icon: "◈", label: "Commerce", text: "Mieux suivre les ventes de mon activité" },
  { icon: "⌁", label: "Une idée", text: "J'ai une idée à développer" },
];

function MerKoraOrb() {
  return (
    <div className="mk-orb-scene mk-orb-text" role="img" aria-label="Sphère intelligente MerKora">
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

export default function ConversationPage() {
  const [message, setMessage] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const draft = window.sessionStorage.getItem("merkora-v2-first-message");
      if (draft) setMessage(draft);
    } catch {
      // La page reste utilisable si le stockage de session est indisponible.
    }
  }, []);

  function keepMessage() {
    if (!message.trim()) return;
    try {
      window.sessionStorage.setItem("merkora-v2-first-message", message.trim());
    } catch {
      // Le message reste présent dans le champ si le stockage est indisponible.
    }
    setSaved(true);
  }

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
          <span className="mk-eyebrow"><span /> ESPACE DE CONVERSATION</span>
          <MerKoraOrb />
          <div className="mk-orb-status"><i /> Conversation écrite</div>
          <p className="mk-orb-caption">Une idée, un besoin, une envie de changement.<br /><b>On commence par comprendre.</b></p>
        </div>

        <div className="mk-conversation-copy">
          <span className="mk-eyebrow"><span /> PRENONS LE TEMPS DE COMPRENDRE</span>
          <h1>Alors, raconte-moi.<br /><em>Je suis là pour comprendre.</em></h1>
          <p className="mk-conversation-intro">Qu'aimerais-tu créer, améliorer, organiser ou résoudre ? Tu peux commencer par ce qui te préoccupe, même si ton idée n'est pas encore très claire.</p>

          <label className="mk-input-label" htmlFor="mk-first-message">DÉCRIS CE QUE TU SOUHAITES IMAGINER</label>
          <textarea
            id="mk-first-message"
            className="mk-first-message"
            value={message}
            onChange={(event) => { setMessage(event.target.value); setSaved(false); }}
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
              <button key={example.label} type="button" className="mk-example-chip" onClick={() => { setMessage(example.text); setSaved(false); }}>
                <span>{example.icon}</span><small>{example.label}</small><b>{example.text}</b><i>＋</i>
              </button>
            ))}
          </div>
          <p className="mk-free-note">Tu peux aussi raconter ton besoin librement. Aucun domaine ni type de projet n'est imposé.</p>



          <button type="button" className="mk-continue-button" onClick={keepMessage} disabled={!message.trim()}>
            Garder mon message <span>→</span>
          </button>
          {saved && <p className="mk-saved-note" role="status">Ton message est conservé dans cette session. Le moteur de compréhension sera connecté dans une prochaine étape : aucune analyse automatique n'est simulée ici.</p>}
          <p className="mk-privacy-note">Tu gardes la maîtrise de tes idées. Tu pourras les préciser ou les corriger à chaque étape.</p>
        </div>
      </section>
      <footer className="mk-footer">
        <span><b>MerKora GDJ</b> · L'intelligence pour comprendre. La technologie pour réaliser.</span>
        <span>Vos idées restent les vôtres.</span>
      </footer>
    </main>
  );
}
