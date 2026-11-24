import Link from "next/link";

export default function IdpPage() {
  return (
    <main className="mk2-space-page">
      <header className="mk2-space-header">
        <Link className="mk2-brand" href="/"><span className="mk2-brand-mark">M</span><span><strong>MerKora GDJ</strong><small>IDP · ACCOMPAGNEMENT HUMAIN</small></span></Link>
        <Link className="mk2-space-back" href="/">← Accueil MerKora GDJ</Link>
      </header>
      <section className="mk2-space-content">
        <span className="mk2-space-kicker">ESPACE D'ACCOMPAGNEMENT HUMAIN</span>
        <h1>MerKora GDJ <em>IDP</em></h1>
        <p className="mk2-space-lead">Un échange direct avec une personne de l'équipe pour expliquer ton besoin, partager tes documents et avancer avec un accompagnement humain.</p>
        <div className="mk2-space-empty"><span>◎</span><h2>L'espace IDP est en préparation.</h2><p>Il accueillera les échanges avec l'équipe, les pièces jointes, le dossier structuré du projet, les décisions et le suivi des étapes.</p></div>
        <Link className="mk2-primary" href="/conversation">Continuer avec la conception intelligente <span>→</span></Link>
      </section>
    </main>
  );
}
