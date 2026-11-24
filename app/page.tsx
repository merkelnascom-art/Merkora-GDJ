import Link from "next/link";

const solutionFamilies = [
  { icon: "◈", title: "Sites web", description: "Sites vitrines, portails, espaces de présentation et expériences web." },
  { icon: "▣", title: "Applications mobiles", description: "Des expériences utiles, pensées pour les usages du quotidien." },
  { icon: "⌘", title: "Plateformes métiers", description: "Des outils adaptés aux activités, aux équipes et aux règles de chaque organisation." },
  { icon: "✧", title: "Jeux numériques", description: "Des univers interactifs, des mécaniques de jeu et des expériences originales." },
  { icon: "◷", title: "Réservation & services", description: "Des parcours de réservation, de demande, de suivi et de gestion." },
  { icon: "⚙", title: "Outils spécialisés", description: "Générateurs, automatisations, espaces de travail et solutions sur mesure." },
];

const steps = [
  { number: "01", title: "Tu expliques", description: "Tu racontes ton idée, ton activité ou ce qui te pose problème." },
  { number: "02", title: "Nous concevons", description: "Nous clarifions le besoin et préparons une solution adaptée." },
  { number: "03", title: "Tu découvres", description: "Tu consultes la proposition, la maquette et le devis avant de décider." },
  { number: "04", title: "Nous réalisons", description: "Après validation, l'équipe prépare, teste et te présente le produit." },
];

function BrandMark() {
  return <span className="mk-home-brand-mark" aria-hidden="true">M</span>;
}

function HeroVisual() {
  return (
    <div className="mk-home-visual" aria-label="Illustration abstraite d'une idée qui devient une solution numérique">
      <div className="mk-home-visual-grid" />
      <div className="mk-home-orbit mk-home-orbit-one" />
      <div className="mk-home-orbit mk-home-orbit-two" />
      <div className="mk-home-glow mk-home-glow-blue" />
      <div className="mk-home-glow mk-home-glow-green" />
      <div className="mk-home-floating mk-home-floating-top"><span>✦</span> Une idée prend forme</div>
      <div className="mk-home-product-window">
        <div className="mk-home-window-bar"><i /><i /><i /><span>votre-solution.app</span></div>
        <div className="mk-home-window-body">
          <div className="mk-home-window-sidebar"><b>M</b><i /><i /><i /><i /></div>
          <div className="mk-home-window-content">
            <div className="mk-home-window-heading"><span /><b /><i /></div>
            <div className="mk-home-window-metrics"><i /><i /><i /></div>
            <div className="mk-home-window-chart"><span /><span /><span /><span /><span /><span /><span /></div>
            <div className="mk-home-window-bottom"><i /><i /><i /></div>
          </div>
        </div>
      </div>
      <div className="mk-home-floating mk-home-floating-bottom"><span>✓</span> Pensée autour de tes besoins</div>
      <span className="mk-home-spark mk-home-spark-a">✧</span>
      <span className="mk-home-spark mk-home-spark-b">✦</span>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="mk-home">
      <header className="mk-home-header">
        <Link className="mk-home-brand" href="/" aria-label="MerKora, accueil">
          <BrandMark />
          <span><strong>MerKora</strong><small>DES IDÉES AUX SOLUTIONS</small></span>
        </Link>
        <nav className="mk-home-nav" aria-label="Navigation principale">
          <a href="#catalogue">Catalogue</a>
          <a href="#idp">Assistance humaine</a>
          <a href="#drt">Conception intelligente</a>
        </nav>
        <div className="mk-home-header-actions">
          <Link className="mk-home-login" href="/auth">Connexion</Link>
          <Link className="mk-home-header-cta" href="/conversation">Créer mon projet <span>↗</span></Link>
        </div>
      </header>

      <section className="mk-home-hero" aria-labelledby="mk-home-title">
        <div className="mk-home-hero-copy">
          <div className="mk-home-eyebrow"><span /> CONCEVOIR · PERSONNALISER · RÉALISER</div>
          <h1 id="mk-home-title">L'intelligence de tes idées.<br /><em>La puissance de leur réalisation.</em></h1>
          <p className="mk-home-hero-lead">Une idée, un problème ou une ambition ? MerKora t'aide à imaginer, concevoir et concrétiser la solution numérique qui te correspond.</p>
          <div className="mk-home-hero-actions">
            <Link className="mk-home-primary-button" href="/conversation">Décrire mon projet <span>→</span></Link>
            <a className="mk-home-secondary-button" href="#parcours">Découvrir les possibilités</a>
          </div>
          <div className="mk-home-trust-line"><span>✦</span> Tu gardes le contrôle à chaque étape. Rien n'est validé sans ton accord.</div>
        </div>
        <HeroVisual />
        <div className="mk-home-hero-foot">
          <span>DES SOLUTIONS QUI PARTENT DU RÉEL</span>
          <span>Sites web · Applications · Plateformes · Outils numériques</span>
        </div>
      </section>

      <section className="mk-home-pathways" id="parcours" aria-labelledby="mk-pathways-title">
        <div className="mk-home-section-intro">
          <div className="mk-home-eyebrow"><span /> TROIS FAÇONS DE COMMENCER</div>
          <h2 id="mk-pathways-title">Tu choisis ton chemin.<br /><em>Nous avançons avec toi.</em></h2>
          <p>Tu peux choisir une solution existante, demander un accompagnement humain ou construire ton projet étape par étape avec notre parcours intelligent.</p>
        </div>
        <div className="mk-home-path-grid">
          <article className="mk-home-path-card mk-home-path-catalogue" id="catalogue">
            <div className="mk-home-path-icon">▦</div>
            <div className="mk-home-path-meta"><span>01 · CHOISIR</span><span className="mk-home-status">Catalogue en préparation</span></div>
            <h3>MerKora Catalogue</h3>
            <p>Parcours nos solutions numériques, découvre leurs possibilités et prépare une commande adaptée à tes besoins.</p>
            <a className="mk-home-path-link" href="#solutions">Explorer les familles de solutions <span>→</span></a>
          </article>
          <article className="mk-home-path-card mk-home-path-idp" id="idp">
            <div className="mk-home-path-icon">◎</div>
            <div className="mk-home-path-meta"><span>02 · ÉCHANGER</span><span className="mk-home-status">Assistance humaine en préparation</span></div>
            <h3>MerKora IDP</h3>
            <p>Tu préfères être accompagné par une personne ? Un conseiller pourra comprendre ton besoin, structurer ton dossier et suivre les décisions avec toi.</p>
            <a className="mk-home-path-link" href="#accompagnement">Découvrir l'accompagnement <span>→</span></a>
          </article>
          <article className="mk-home-path-card mk-home-path-drt" id="drt">
            <div className="mk-home-path-icon">✳</div>
            <div className="mk-home-path-meta"><span>03 · CONCEVOIR</span><span className="mk-home-status mk-home-status-live">Parcours disponible</span></div>
            <h3>MerKora DRT</h3>
            <p>Décris librement ton projet. Le parcours intelligent t'aide à clarifier ton besoin, composer la solution et préparer sa maquette.</p>
            <Link className="mk-home-path-link" href="/conversation">Commencer la conception <span>→</span></Link>
          </article>
        </div>
      </section>

      <section className="mk-home-story" aria-labelledby="mk-story-title">
        <div className="mk-home-story-scene">
          <div className="mk-home-scene-glow" />
          <div className="mk-home-person-card">
            <div className="mk-home-person-avatar">A</div>
            <div><strong>Une activité à organiser</strong><span>Des tâches, des informations, des décisions...</span></div>
            <div className="mk-home-paper-stack"><i /><i /><i /></div>
          </div>
          <div className="mk-home-scene-arrow">→</div>
          <div className="mk-home-solution-card">
            <div className="mk-home-solution-card-top"><BrandMark /><span>MERKORA · CONCEPTION</span></div>
            <strong>Une solution pensée pour ton activité.</strong>
            <div className="mk-home-solution-bars"><i /><i /><i /></div>
            <span className="mk-home-solution-check">✓ Besoin clarifié · Solution proposée</span>
          </div>
          <div className="mk-home-scene-caption"><span className="mk-home-play">▶</span><span>Une histoire à raconter en vidéo</span><small>Film de présentation à produire</small></div>
        </div>
        <div className="mk-home-story-copy">
          <div className="mk-home-eyebrow"><span /> TU N'AS PAS BESOIN D'AVOIR TOUTES LES RÉPONSES</div>
          <h2 id="mk-story-title">Tu as un problème ?<br /><em>Commençons par l'écouter.</em></h2>
          <p>Tu n'as pas besoin de connaître le nom du logiciel, les fonctions techniques ou l'architecture qu'il te faut. Explique simplement ce que tu vis, ce que tu veux changer ou ce que tu aimerais créer.</p>
          <p>MerKora t'accompagne pour comprendre la situation, explorer les possibilités et construire une solution adaptée à ton objectif.</p>
          <Link className="mk-home-text-link" href="/conversation">Parler de mon besoin <span>→</span></Link>
        </div>
      </section>

      <section className="mk-home-solutions" id="solutions" aria-labelledby="mk-solutions-title">
        <div className="mk-home-section-heading">
          <div><div className="mk-home-eyebrow"><span /> TON UNIVERS NUMÉRIQUE</div><h2 id="mk-solutions-title">Qu'est-ce qu'on peut construire ?</h2></div>
          <p>Chaque projet possède son fonctionnement, ses utilisateurs et ses propres règles. Nous ne plaquons pas le même modèle sur tout.</p>
        </div>
        <div className="mk-home-solutions-grid">
          {solutionFamilies.map((family) => (
            <article className="mk-home-solution-family" key={family.title}>
              <span className="mk-home-family-icon">{family.icon}</span>
              <h3>{family.title}</h3>
              <p>{family.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mk-home-method" aria-labelledby="mk-method-title">
        <div className="mk-home-method-heading">
          <div className="mk-home-eyebrow"><span /> UN CHEMIN CLAIR, DE BOUT EN BOUT</div>
          <h2 id="mk-method-title">De la première idée<br /><em>à une solution réelle.</em></h2>
          <p>Tu avances à ton rythme. Les étapes s'adaptent à la nature et à la complexité de ton projet.</p>
        </div>
        <div className="mk-home-method-steps">
          {steps.map((step) => (
            <article key={step.number}><span>{step.number}</span><div><h3>{step.title}</h3><p>{step.description}</p></div></article>
          ))}
        </div>
      </section>

      <section className="mk-home-final-cta">
        <div className="mk-home-final-orb">M</div>
        <div><div className="mk-home-eyebrow"><span /> LE PROCHAIN PROJET PEUT ÊTRE LE TIEN</div><h2>Et si on construisait la tienne ?</h2><p>Commence par nous raconter ce que tu as en tête. Nous avancerons une étape à la fois.</p></div>
        <Link className="mk-home-primary-button" href="/conversation">Commencer maintenant <span>→</span></Link>
      </section>

      <footer className="mk-home-footer">
        <Link className="mk-home-brand" href="/"><BrandMark /><span><strong>MerKora</strong><small>DES IDÉES AUX SOLUTIONS</small></span></Link>
        <span>L'intelligence pour comprendre. La technologie pour réaliser.</span>
        <span>© {new Date().getFullYear()} MerKora · Tes idées restent les tiennes.</span>
      </footer>
    </main>
  );
}
