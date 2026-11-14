"use client";

import React, { useState } from "react";

type CommunicationMode = "voice" | "text";

function MerKoraMascot() {
  return (
    <div className="mk-mascot-stage" aria-label="Mascotte robotique MerKora">
      <div className="mk-orbit mk-orbit-one" />
      <div className="mk-orbit mk-orbit-two" />
      <div className="mk-mascot-glow" />
      <svg className="mk-mascot" viewBox="0 0 360 390" role="img" aria-labelledby="mascot-title">
        <title id="mascot-title">MerKora, votre compagnon intelligent</title>
        <defs>
          <linearGradient id="shell" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fffdf8" />
            <stop offset=".48" stopColor="#c9c9db" />
            <stop offset="1" stopColor="#85869f" />
          </linearGradient>
          <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff0bd" />
            <stop offset=".5" stopColor="#d7ad62" />
            <stop offset="1" stopColor="#9e7139" />
          </linearGradient>
          <linearGradient id="violet" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#d4a7ff" />
            <stop offset=".55" stopColor="#8055df" />
            <stop offset="1" stopColor="#432e8b" />
          </linearGradient>
          <linearGradient id="face" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#24213e" />
            <stop offset="1" stopColor="#090b1b" />
          </linearGradient>
          <filter id="shadow" x="-40%" y="-40%" width="180%" height="190%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="9" />
            <feOffset dy="10" />
            <feComponentTransfer><feFuncA type="linear" slope=".32" /></feComponentTransfer>
            <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <ellipse cx="180" cy="365" rx="104" ry="13" fill="#050611" opacity=".45" />
        <g filter="url(#shadow)">
          <path d="M102 257 Q62 267 50 313 Q44 341 71 350 L111 325 L133 276Z" fill="url(#shell)" stroke="#e9d5a5" strokeWidth="4" />
          <path d="M258 257 Q298 267 310 313 Q316 341 289 350 L249 325 L227 276Z" fill="url(#shell)" stroke="#e9d5a5" strokeWidth="4" />
          <path d="M111 242 Q83 258 80 302 L91 349 Q180 382 269 349 L280 302 Q277 258 249 242Z" fill="url(#shell)" stroke="#e8d7b6" strokeWidth="4" />
          <path d="M129 257 Q180 278 231 257 L246 322 Q180 350 114 322Z" fill="#15162d" stroke="#7860bc" strokeWidth="3" />
          <path d="M147 251 L180 276 L213 251" fill="none" stroke="url(#gold)" strokeWidth="7" strokeLinecap="round" />
          <circle cx="180" cy="313" r="24" fill="#17162b" stroke="url(#gold)" strokeWidth="3" />
          <text x="180" y="323" textAnchor="middle" fontSize="30" fontWeight="800" fill="#f5d48e">M</text>
          <path d="M153 234 L153 266 Q180 286 207 266 L207 234Z" fill="url(#shell)" stroke="#c8a76c" strokeWidth="3" />
          <path d="M94 100 Q91 31 180 25 Q269 31 266 100 L285 173 Q293 243 245 270 Q180 298 115 270 Q67 243 75 173Z" fill="url(#shell)" stroke="#f4e2bc" strokeWidth="5" />
          <path d="M96 101 Q101 42 180 39 Q259 42 264 101 L252 122 Q180 105 108 122Z" fill="#15162f" stroke="url(#gold)" strokeWidth="5" />
          <path d="M120 55 Q180 8 240 55 L229 79 Q180 96 131 79Z" fill="url(#shell)" stroke="#e5c78f" strokeWidth="3" />
          <path d="M74 126 Q47 119 42 156 L49 215 Q56 239 82 224 L94 168Z" fill="url(#violet)" stroke="#e3c38a" strokeWidth="4" />
          <path d="M286 126 Q313 119 318 156 L311 215 Q304 239 278 224 L266 168Z" fill="url(#violet)" stroke="#e3c38a" strokeWidth="4" />
          <path d="M104 116 Q180 95 256 116 Q276 164 258 218 Q244 254 180 260 Q116 254 102 218 Q84 164 104 116Z" fill="url(#face)" stroke="#282144" strokeWidth="6" />
          <path d="M120 160 Q143 137 164 159 Q171 181 151 193 Q128 199 120 177Z" fill="#d6c4ff" opacity=".95" />
          <path d="M196 159 Q217 137 240 160 L240 177 Q230 199 207 193 Q189 181 196 159Z" fill="#d6c4ff" opacity=".95" />
          <ellipse cx="145" cy="172" rx="12" ry="16" fill="#171a36" />
          <ellipse cx="215" cy="172" rx="12" ry="16" fill="#171a36" />
          <circle cx="149" cy="166" r="4" fill="#fff" />
          <circle cx="219" cy="166" r="4" fill="#fff" />
          <path d="M149 215 Q180 244 211 215" fill="none" stroke="#f0c98b" strokeWidth="7" strokeLinecap="round" />
          <path d="M160 218 Q180 230 200 218" fill="none" stroke="#fff1db" strokeWidth="3" strokeLinecap="round" />
          <path d="M97 135 L77 144 M263 135 L283 144" stroke="#b68af2" strokeWidth="5" strokeLinecap="round" />
          <path d="M104 270 Q90 300 101 322 M256 270 Q270 300 259 322" fill="none" stroke="url(#gold)" strokeWidth="5" />
        </g>
        <path d="M49 321 Q34 311 24 328 Q20 345 41 354 L75 362 Q91 359 85 344Z" fill="url(#shell)" stroke="#e4c58c" strokeWidth="4" />
        <path d="M311 321 Q326 311 336 328 Q340 345 319 354 L285 362 Q269 359 275 344Z" fill="url(#shell)" stroke="#e4c58c" strokeWidth="4" />
      </svg>
      <span className="mk-mascot-spark mk-spark-a">✦</span>
      <span className="mk-mascot-spark mk-spark-b">✧</span>
    </div>
  );
}

export default function HomePage() {
  const [mode, setMode] = useState<CommunicationMode | null>(null);

  function chooseMode(nextMode: CommunicationMode) {
    setMode(nextMode);
    try {
      window.sessionStorage.setItem("merkora-v2-communication-mode", nextMode);
    } catch {
      // The welcome screen remains usable if session storage is unavailable.
    }
  }

  return (
    <main className="mk-v2-page">
      <div className="mk-v2-noise" aria-hidden="true" />
      <header className="mk-header">
        <a className="mk-brand" href="/" aria-label="MerKora GDJ, accueil">
          <span className="mk-brand-mark">M</span>
          <span><strong>MerKora</strong><small>GUIDED DIGITAL JOURNEY · V2</small></span>
        </a>
        <span className="mk-online"><i /> Votre compagnon est disponible</span>
      </header>

      <section className="mk-welcome" aria-labelledby="mk-title">
        <div className="mk-welcome-copy">
          <span className="mk-eyebrow"><span /> UN ESPACE POUR DONNER VIE À VOS IDÉES</span>
          <h1 id="mk-title">Salut !<br /><em>Moi, c'est MerKora.</em></h1>
          <p className="mk-intro">Alors, qu'est-ce qu'on imagine, qu'est-ce qu'on construit ou qu'est-ce qu'on cherche à améliorer aujourd'hui ?</p>

          <div className="mk-chat-bubble">
            <span className="mk-chat-avatar">M</span>
            <div>
              <strong>MerKora</strong>
              <p>Raconte-moi ce que tu as en tête. Tu n'as pas besoin de tout savoir ni d'avoir déjà trouvé la solution. On va y réfléchir ensemble.</p>
            </div>
          </div>

          <div className="mk-choice-heading">
            <span>COMMENT PRÉFÈRES-TU QU'ON DISCUTE ?</span>
            <small>Choisis librement. Tu pourras changer plus tard.</small>
          </div>

          <div className="mk-mode-grid" role="group" aria-label="Choisir un mode de communication">
            <button
              type="button"
              className={`mk-mode-card ${mode === "voice" ? "is-selected" : ""}`}
              aria-label="Choisir la conversation par la voix"
              aria-pressed={mode === "voice"}
              onClick={() => chooseMode("voice")}
            >
              <span className="mk-mode-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="2.5" width="6" height="12" rx="3" /><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3m-4 0h8" /></svg></span>
              <span className="mk-mode-title">Par la voix</span>
              <span className="mk-mode-description">Je préfère parler naturellement.</span>
              <span className="mk-mode-check">{mode === "voice" ? "Choisi ✓" : "Choisir"}</span>
            </button>
            <button
              type="button"
              className={`mk-mode-card ${mode === "text" ? "is-selected" : ""}`}
              aria-label="Choisir la conversation par écrit"
              aria-pressed={mode === "text"}
              onClick={() => chooseMode("text")}
            >
              <span className="mk-mode-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-5 4v-4.8A2.5 2.5 0 0 1 4 13.5Z" /><path d="M8 8h8M8 11.5h5" /></svg></span>
              <span className="mk-mode-title">Par écrit</span>
              <span className="mk-mode-description">Je préfère écrire mes idées.</span>
              <span className="mk-mode-check">{mode === "text" ? "Choisi ✓" : "Choisir"}</span>
            </button>
          </div>

          <div className="mk-selection-note" aria-live="polite">
            {mode ? (
              <><span className="mk-note-check">✓</span> Très bien. Je garde ton choix pour la suite de notre échange.</>
            ) : (
              <>Tu peux commencer sans créer de compte. Prends ton temps.</>
            )}
          </div>
        </div>

        <div className="mk-welcome-visual">
          <div className="mk-visual-label"><span className="mk-live-dot" /> PRÉSENT POUR VOUS ÉCOUTER</div>
          <MerKoraMascot />
          <div className="mk-visual-caption">
            <span className="mk-caption-star">✦</span>
            <div><strong>On avance ensemble.</strong><small>Une idée à la fois. Une étape après l'autre.</small></div>
          </div>
        </div>
      </section>

      <footer className="mk-footer">
        <span><b>MerKora GDJ</b> · L'intelligence pour comprendre. La technologie pour réaliser.</span>
        <span>Vos idées restent les vôtres.</span>
      </footer>
    </main>
  );
}
