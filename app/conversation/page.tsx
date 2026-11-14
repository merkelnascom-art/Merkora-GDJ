"use client";

import React, { useEffect, useRef, useState } from "react";

type CommunicationMode = "voice" | "text";
type RecognitionAlternative = { transcript: string };
type RecognitionResult = { isFinal: boolean; 0: RecognitionAlternative };
type RecognitionEvent = { resultIndex: number; results: ArrayLike<RecognitionResult> };
type RecognitionErrorEvent = { error: string };
type BrowserSpeechRecognition = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: RecognitionEvent) => void) | null;
  onerror: ((event: RecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
};
type SpeechRecognitionWindow = Window & {
  SpeechRecognition?: new () => BrowserSpeechRecognition;
  webkitSpeechRecognition?: new () => BrowserSpeechRecognition;
};

const examples = [
  { icon: "✦", label: "Éducation", text: "Améliorer la gestion de mon établissement" },
  { icon: "◈", label: "Commerce", text: "Mieux suivre les ventes de mon activité" },
  { icon: "⌁", label: "Une idée", text: "J'ai une idée à développer" },
];

function MerKoraOrb({ mode }: { mode: CommunicationMode }) {
  return (
    <div className={`mk-orb-scene mk-orb-${mode}`} role="img" aria-label="Sphère intelligente MerKora">
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
  const [mode, setMode] = useState<CommunicationMode>("text");
  const [message, setMessage] = useState("");
  const [saved, setSaved] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState("Le microphone n'est pas encore activé.");
  const [voiceError, setVoiceError] = useState("");
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const finalTranscriptRef = useRef("");

  useEffect(() => {
    try {
      const stored = window.sessionStorage.getItem("merkora-v2-communication-mode");
      if (stored === "voice" || stored === "text") setMode(stored);
      const draft = window.sessionStorage.getItem("merkora-v2-first-message");
      if (draft) setMessage(draft);
    } catch {
      // La page reste utilisable si le stockage de session est indisponible.
    }
    return () => recognitionRef.current?.abort();
  }, []);

  function selectMode(nextMode: CommunicationMode) {
    setMode(nextMode);
    setSaved(false);
    if (nextMode === "text" && recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
    }
    try {
      window.sessionStorage.setItem("merkora-v2-communication-mode", nextMode);
    } catch {
      // Le changement de mode reste visible dans l'interface.
    }
  }

  function startListening() {
    const speechWindow = window as SpeechRecognitionWindow;
    const Recognition = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
    if (!Recognition) {
      setVoiceError("La reconnaissance vocale n'est pas prise en charge par ce navigateur. Essaie Chrome ou utilise le mode écrit.");
      setVoiceStatus("Microphone indisponible sur ce navigateur.");
      return;
    }
    setVoiceError("");
    const recognition = new Recognition();
    recognition.lang = "fr-FR";
    recognition.continuous = true;
    recognition.interimResults = true;
    finalTranscriptRef.current = "";
    recognition.onresult = (event) => {
      let interim = "";
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index];
        if (result.isFinal) finalTranscriptRef.current += result[0].transcript;
        else interim += result[0].transcript;
      }
      const combined = [finalTranscriptRef.current, interim].filter(Boolean).join(" ");
      if (combined) {
        setMessage((current) => {
          const prefix = current.trim();
          return prefix && !finalTranscriptRef.current.startsWith(prefix)
            ? [prefix, combined].filter(Boolean).join(" ")
            : combined;
        });
        setSaved(false);
      }
    };
    recognition.onerror = (event) => {
      setListening(false);
      const messages: Record<string, string> = {
        "not-allowed": "L'accès au microphone a été refusé. Autorise le microphone dans les réglages du navigateur.",
        "no-speech": "Je n'ai pas entendu de parole. Tu peux réessayer.",
        "audio-capture": "Aucun microphone utilisable n'a été détecté.",
        network: "Le service de reconnaissance vocale est momentanément indisponible.",
      };
      const detail = messages[event.error] || "Une erreur a interrompu la reconnaissance vocale. Réessaie ou passe en mode écrit.";
      setVoiceError(detail);
      setVoiceStatus("Écoute interrompue.");
    };
    recognition.onend = () => {
      setListening(false);
      setVoiceStatus("Écoute terminée. Tu peux corriger la transcription ou reprendre.");
    };
    recognitionRef.current = recognition;
    try {
      recognition.start();
      setListening(true);
      setVoiceStatus("MerKora t'écoute… Parle naturellement.");
    } catch {
      setListening(false);
      setVoiceError("Le microphone n'a pas pu démarrer. Vérifie son autorisation puis réessaie.");
    }
  }

  function stopListening() {
    recognitionRef.current?.stop();
    setListening(false);
    setVoiceStatus("Écoute arrêtée. Tu peux relire et corriger ton message.");
  }

  function speakIntroduction() {
    if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") {
      setVoiceError("La lecture audio n'est pas prise en charge par ce navigateur.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(
      "Alors, raconte-moi. Je suis tout ouïe. Qu'aimerais-tu créer, améliorer, organiser ou résoudre ? Tu peux commencer par ce qui te préoccupe, même si ton idée n'est pas encore très claire."
    );
    utterance.lang = "fr-FR";
    utterance.rate = 0.96;
    window.speechSynthesis.speak(utterance);
  }

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
          <MerKoraOrb mode={mode} />
          <div className="mk-orb-status"><i /> {mode === "voice" ? (listening ? "MerKora t'écoute" : "Mode voix sélectionné") : "Mode écrit sélectionné"}</div>
          <p className="mk-orb-caption">Une idée, un besoin, une envie de changement.<br /><b>On commence par comprendre.</b></p>
        </div>

        <div className="mk-conversation-copy">
          <span className="mk-eyebrow"><span /> PRENONS LE TEMPS DE COMPRENDRE</span>
          <h1>Alors, raconte-moi.<br /><em>Je suis tout ouïe.</em></h1>
          <p className="mk-conversation-intro">Qu'aimerais-tu créer, améliorer, organiser ou résoudre ? Tu peux commencer par ce qui te préoccupe, même si ton idée n'est pas encore très claire.</p>

          <div className="mk-voice-tools" hidden={mode !== "voice"} aria-label="Outils du mode voix">
            <div className="mk-voice-actions">
              <button type="button" className="mk-microphone-button" onClick={startListening} disabled={listening}>◉ {listening ? "Microphone actif" : "Activer le microphone"}</button>
              <button type="button" className="mk-stop-voice-button" onClick={stopListening} disabled={!listening}>Arrêter l'écoute</button>
              <button type="button" className="mk-speak-button" onClick={speakIntroduction}>Écouter la présentation</button>
            </div>
            <p className="mk-voice-status" role="status" aria-live="polite">{voiceStatus}</p>
            {voiceError && <p className="mk-voice-error" role="alert">{voiceError}</p>}
            <p className="mk-voice-disclosure">La transcription vocale remplit le champ ci-dessous et reste modifiable. La réponse intelligente à voix haute sera disponible après connexion du moteur IA.</p>
          </div>

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

          <div className="mk-mode-switch" aria-label="Mode de communication">
            <span>Notre façon d'échanger</span>
            <button type="button" className={mode === "text" ? "active" : ""} onClick={() => selectMode("text")}>Écrit</button>
            <button type="button" className={mode === "voice" ? "active" : ""} onClick={() => selectMode("voice")}>Voix</button>
          </div>
          {mode === "voice" && <p className="mk-voice-notice">Le mode voix est actif : tu peux parler pour remplir ton message. Relis et corrige la transcription avant de la conserver.</p>}

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
