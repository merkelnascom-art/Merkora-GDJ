import Link from "next/link";

export default function CataloguePage() {
  return (
    <main className="mk2-space-page">
      <header className="mk2-space-header">
        <Link className="mk2-brand" href="/"><span className="mk2-brand-mark">M</span><span><strong>MerKora GDJ</strong><small>CATALOGUE</small></span></Link>
        <Link className="mk2-space-back" href="/">← Accueil MerKora GDJ</Link>
      </header>
      <section className="mk2-space-content">
        <span className="mk2-space-kicker">ESPACE PRODUITS ET OFFRES</span>
        <h1>MerKora GDJ <em>Catalogue</em></h1>
        <p className="mk2-space-lead">Retrouve ici les solutions numériques proposées par MerKora GDJ : découvre chaque produit, ses fonctions, ses options et les possibilités de personnalisation.</p>
        <div className="mk2-space-empty"><span>▦</span><h2>Le catalogue se prépare.</h2><p>Les offres seront publiées ici par l'équipe MerKora GDJ. Chaque fiche présentera son produit, ses démonstrations, ses options et ses conditions.</p></div>
        <Link className="mk2-primary" href="/conversation">Tu as plutôt un projet sur mesure ? <span>→</span></Link>
      </section>
    </main>
  );
}
