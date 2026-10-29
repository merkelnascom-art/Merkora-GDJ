"use client";

type LandingPageProps = {
  onStartDiscovery: () => void;
  onOpenWorkspace: () => void;
  projectCount: number;
};

const examples = [
  {
    number: "01",
    label: "ÉDUCATION",
    title: "Student Vision",
    description: "Aider un élève après le bac à explorer des métiers et formations adaptés à ses résultats, ses intérêts et ses objectifs.",
    icon: "↗",
  },
  {
    number: "02",
    label: "COMMERCE",
    title: "Une activité mieux organisée",
    description: "Comprendre les difficultés de caisse, de stock, de vente ou de gestion d’équipe avant de choisir un outil.",
    icon: "◫",
  },
  {
    number: "03",
    label: "CRÉATION",
    title: "Une idée à concrétiser",
    description: "Structurer un besoin de site, d’identité visuelle, de communication ou d’outil numérique sur mesure.",
    icon: "✳",
  },
];

export function LandingPage({ onStartDiscovery, onOpenWorkspace, projectCount }: LandingPageProps) {
  return (
    <main className="marketing-shell">
      <header className="marketing-nav">
        <a className="brand marketing-brand" href="#top" aria-label="MerKora GDJ accueil">
          <span className="brand-mark">M</span>
          <span className="brand-name">MerKora <b>GDJ</b></span>
        </a>
        <nav aria-label="Navigation principale" className="marketing-nav-links">
          <a href="#methode">La méthode</a>
          <a href="#exemples">Exemples</a>
        </nav>
        <button className="button button-quiet nav-workspace" onClick={onOpenWorkspace}>
          Espace de travail <span aria-hidden="true">↗</span>
          {projectCount > 0 && <span className="nav-count">{projectCount}</span>}
        </button>
      </header>

      <section className="marketing-hero" id="top">
        <div className="hero-copy">
          <div className="hero-kicker"><span className="hero-kicker-dot" /> DE L’IDÉE À LA SOLUTION CONCRÈTE</div>
          <h1>Les besoins d’abord.<br /><span>Les solutions ensuite.</span></h1>
          <p className="hero-lead">Vous n’avez pas besoin de connaître la technologie à utiliser. Expliquez ce qui bloque, ce que vous voulez changer et pourquoi c’est important. On commence par comprendre.</p>
          <div className="hero-actions">
            <button className="button button-primary hero-primary" onClick={onStartDiscovery}>
              Décrire mon besoin <span aria-hidden="true">→</span>
            </button>
            <a className="hero-text-link" href="#methode">Découvrir la méthode <span aria-hidden="true">↓</span></a>
          </div>
          <div className="hero-trust">
            <span><i /> Sans compte pour commencer</span>
            <span><i /> Vous gardez le contrôle</span>
          </div>
        </div>

        <div className="hero-visual" aria-label="Illustration du processus de transformation d’un besoin en projet">
          <div className="visual-orbit orbit-one" />
          <div className="visual-orbit orbit-two" />
          <div className="visual-glow" />
          <div className="visual-core"><span className="visual-core-star">✳</span><span>MERKORA</span><strong>Comprendre<br />avant de construire.</strong></div>
          <div className="visual-node node-problem"><span className="node-icon">◎</span><div><small>POINT DE DÉPART</small><strong>Votre réalité</strong></div></div>
          <div className="visual-node node-analysis"><span className="node-icon">⌘</span><div><small>ÉTAPE SUIVANTE</small><strong>Analyse du besoin</strong></div></div>
          <div className="visual-node node-solution"><span className="node-icon">↗</span><div><small>OBJECTIF</small><strong>Solution adaptée</strong></div></div>
          <span className="visual-footnote">Un projet clair commence par les bonnes questions.</span>
        </div>
      </section>

      <section className="marketing-principles" aria-label="Principes de MerKora">
        <article><span>01</span><div><strong>Partez du problème réel</strong><p>Pas d’outil imposé avant d’avoir compris votre situation.</p></div></article>
        <article><span>02</span><div><strong>Explorez les options utiles</strong><p>Des pistes expliquées selon vos besoins, vos contraintes et vos priorités.</p></div></article>
        <article><span>03</span><div><strong>Décidez avant d’investir</strong><p>Vous examinez et validez le périmètre avant tout devis officiel.</p></div></article>
      </section>

      <section className="marketing-method" id="methode">
        <div className="method-intro">
          <div className="eyebrow"><span className="eyebrow-star">✳</span> UNE MÉTHODE QUI PART DE VOUS</div>
          <h2>On ne vous demande pas d’avoir déjà la réponse.</h2>
          <p>Un besoin peut venir d’un problème d’organisation, d’un choix d’études, d’une activité commerciale ou d’une idée numérique. La première étape est de bien comprendre le contexte.</p>
        </div>
        <div className="method-timeline">
          <article><span>01</span><div><strong>Vous racontez la situation</strong><p>Expliquez avec vos mots ce qui ne fonctionne pas ou ce que vous aimeriez rendre possible.</p></div></article>
          <article><span>02</span><div><strong>Nous clarifions ce qui manque</strong><p>Les informations incertaines restent visibles. On pose des questions avant de conclure.</p></div></article>
          <article><span>03</span><div><strong>Vous explorez des directions</strong><p>Les pistes pertinentes sont comparées avant de décider du périmètre et du budget.</p></div></article>
          <article><span>04</span><div><strong>Vous validez la suite</strong><p>Le devis et la réalisation viennent après l’examen du besoin, pas avant.</p></div></article>
        </div>
      </section>

      <section className="marketing-examples" id="exemples">
        <div className="section-title-row">
          <div><div className="eyebrow">DES CONTEXTES DIFFÉRENTS</div><h2>Une méthode. Des besoins qui ne se ressemblent pas.</h2><p>Les propositions doivent suivre votre domaine, pas vous faire entrer dans un modèle unique.</p></div>
        </div>
        <div className="example-grid">
          {examples.map((example) => (
            <article className="example-card" key={example.number}>
              <div className="example-card-top"><span>{example.number}</span><span className="example-icon">{example.icon}</span></div>
              <small>{example.label}</small><h3>{example.title}</h3><p>{example.description}</p>
              <button className="example-link" onClick={onStartDiscovery}>Explorer ce besoin <span aria-hidden="true">→</span></button>
            </article>
          ))}
        </div>
      </section>

      <section className="marketing-cta">
        <div><div className="eyebrow">VOTRE PROJET COMMENCE ICI</div><h2>Vous connaissez le problème.<br /><span>Commençons par là.</span></h2><p>Vous pouvez commencer sans créer de compte. Dans cette version, vos dossiers sont conservés dans le navigateur de cet appareil.</p></div>
        <button className="button button-primary hero-primary" onClick={onStartDiscovery}>Décrire mon besoin <span aria-hidden="true">→</span></button>
      </section>

      <footer className="marketing-footer">
        <a className="brand marketing-brand" href="#top"><span className="brand-mark">M</span><span className="brand-name">MerKora <b>GDJ</b></span></a>
        <span>Les besoins d’abord. Les solutions ensuite.</span>
        <span className="prototype-pill"><i /> Prototype en évolution</span>
      </footer>
      <p className="marketing-disclaimer">Cette première version utilise des règles locales pour explorer les besoins. L’IA connectée, la synchronisation entre appareils et les devis officiels ne sont pas encore activés.</p>
    </main>
  );
}
