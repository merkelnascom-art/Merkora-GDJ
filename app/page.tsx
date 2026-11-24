import Link from "next/link";

const pathways = [
  {
    number: "01",
    symbol: "▦",
    name: "MerKora GDJ Catalogue",
    description: "Découvre les solutions numériques proposées par MerKora GDJ, leurs possibilités et les options de personnalisation.",
    action: "Entrer dans le catalogue",
    href: "/catalogue",
    tone: "catalogue",
    status: "Espace dédié",
  },
  {
    number: "02",
    symbol: "◎",
    name: "MerKora GDJ IDP",
    description: "Échange avec une personne de notre équipe pour expliquer ton besoin et être accompagné dans ton projet.",
    action: "Demander un accompagnement",
    href: "/idp",
    tone: "idp",
    status: "Espace dédié",
  },
  {
    number: "03",
    symbol: "✳",
    name: "MerKora GDJ DRT",
    description: "Conçois ton projet avec le parcours intelligent : clarification du besoin, proposition et préparation de la maquette.",
    action: "Commencer la conception",
    href: "/conversation",
    tone: "drt",
    status: "Parcours disponible",
  },
];

function BrandMark() {
  return <span className="mk2-brand-mark" aria-hidden="true">M</span>;
}

function HeroVisual() {
  return (
    <div className="mk2-visual" aria-hidden="true">
      <div className="mk2-visual-orbit mk2-visual-orbit-a" />
      <div className="mk2-visual-orbit mk2-visual-orbit-b" />
      <div className="mk2-visual-panel">
        <div className="mk2-visual-top"><i /><i /><i /><span>MERKORA GDJ · WORKSPACE</span></div>
        <div className="mk2-visual-body">
          <div className="mk2-visual-rail"><b>M</b><i /><i /><i /><i /></div>
          <div className="mk2-visual-main">
            <span className="mk2-visual-kicker">VOTRE PROJET, NOTRE SAVOIR-FAIRE</span>
            <b>Une idée devient<br />une solution.</b>
            <div className="mk2-visual-cards"><i /><i /><i /></div>
            <div className="mk2-visual-chart"><i /><i /><i /><i /><i /><i /></div>
          </div>
        </div>
      </div>
      <span className="mk2-float mk2-float-one">✦ Une idée prend forme</span>
      <span className="mk2-float mk2-float-two">✓ Pensée pour tes besoins</span>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="mk2-home">
      <header className="mk2-header">
        <Link className="mk2-brand" href="/" aria-label="MerKora GDJ, accueil">
          <BrandMark />
          <span><strong>MerKora GDJ</strong><small>DES IDÉES AUX SOLUTIONS</small></span>
        </Link>
        <nav className="mk2-nav" aria-label="Navigation principale">
          <Link href="/catalogue">Catalogue</Link>
          <Link href="/idp">Assistance humaine</Link>
          <Link href="/conversation">Conception intelligente</Link>
        </nav>
        <div className="mk2-header-actions">
          <Link className="mk2-login" href="/auth">Connexion</Link>
          <Link className="mk2-header-cta" href="/conversation">Créer mon projet <span>↗</span></Link>
        </div>
      </header>

      <section className="mk2-hero" aria-labelledby="mk2-hero-title">
        <div className="mk2-hero-copy">
          <div className="mk2-eyebrow"><span /> CONCEVOIR · PERSONNALISER · RÉALISER</div>
          <h1 id="mk2-hero-title">L'intelligence de tes idées.<br /><em>La puissance de leur réalisation.</em></h1>
          <p>Une idée, un problème ou une ambition ? MerKora GDJ t'accompagne pour imaginer et concrétiser la solution numérique qui te correspond.</p>
          <div className="mk2-hero-actions">
            <Link className="mk2-primary" href="/conversation">Décrire mon projet <span>→</span></Link>
            <a className="mk2-secondary" href="#choisir">Découvrir nos espaces</a>
          </div>
          <div className="mk2-promise"><span>✦</span> Tu gardes le contrôle. Les décisions importantes restent les tiennes.</div>
        </div>
        <HeroVisual />
        <div className="mk2-hero-bottom"><span>DES SOLUTIONS QUI PARTENT DU RÉEL</span><span>Sites web · Applications · Plateformes · Outils numériques</span></div>
      </section>

      <section className="mk2-pathways" id="choisir" aria-labelledby="mk2-path-title">
        <div className="mk2-path-heading">
          <div><div className="mk2-eyebrow"><span /> TROIS ESPACES, TROIS FAÇONS D'AVANCER</div><h2 id="mk2-path-title">Comment souhaites-tu<br /><em>commencer ?</em></h2></div>
          <p>Choisis ton espace. Chaque parcours possède son propre fonctionnement et son environnement dédié.</p>
        </div>
        <div className="mk2-path-grid">
          {pathways.map((path) => (
            <article className={`mk2-path-card mk2-path-${path.tone}`} key={path.number}>
              <div className="mk2-path-card-top"><span className="mk2-path-symbol">{path.symbol}</span><span className="mk2-path-number">{path.number}</span></div>
              <span className="mk2-path-status">{path.status}</span>
              <h3>{path.name}</h3>
              <p>{path.description}</p>
              <Link className="mk2-path-link" href={path.href}>{path.action}<span>→</span></Link>
            </article>
          ))}
        </div>
      </section>

      <section className="mk2-film" aria-labelledby="mk2-film-title">
        <div className="mk2-film-art" aria-label="Présentation vidéo de MerKora GDJ">
          <div className="mk2-film-orb mk2-film-orb-a" />
          <div className="mk2-film-orb mk2-film-orb-b" />
          <div className="mk2-film-brand"><BrandMark /><span>MERKORA GDJ</span></div>
          <div className="mk2-film-message">Une idée.<br /><em>Une solution.</em></div>
          <div className="mk2-film-play" aria-hidden="true">▶</div>
          <span className="mk2-film-caption">Vidéo de présentation bientôt disponible</span>
        </div>
        <div className="mk2-film-copy">
          <div className="mk2-eyebrow"><span /> DE L'IDÉE À LA RÉALISATION</div>
          <h2 id="mk2-film-title">Derrière chaque projet,<br /><em>il y a une histoire.</em></h2>
          <p>Un besoin à comprendre, des possibilités à explorer, puis une solution à construire. C'est cette aventure que MerKora GDJ veut rendre plus simple et plus accessible.</p>
          <Link href="/conversation" className="mk2-text-link">Raconter mon idée <span>→</span></Link>
        </div>
      </section>

      <section className="mk2-final">
        <div className="mk2-final-mark"><BrandMark /></div>
        <div><span className="mk2-final-kicker">LE PROCHAIN PROJET PEUT ÊTRE LE TIEN</span><h2>Et si on construisait la tienne ?</h2><p>Commence par nous raconter ce que tu as en tête.</p></div>
        <Link href="/conversation" className="mk2-primary">Commencer maintenant <span>→</span></Link>
      </section>

      <footer className="mk2-footer">
        <Link className="mk2-brand" href="/"><BrandMark /><span><strong>MerKora GDJ</strong><small>DES IDÉES AUX SOLUTIONS</small></span></Link>
        <span>L'intelligence pour comprendre. La technologie pour réaliser.</span>
        <span>© {new Date().getFullYear()} MerKora GDJ · Tes idées restent les tiennes.</span>
      </footer>
    </main>
  );
}
