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
        <p className="mk2-space-lead">Un parcours indépendant pour échanger avec un conseiller humain, expliquer ton besoin, partager tes documents et construire ton dossier avec l'équipe MerKora.</p>
        <div className="mk2-space-empty">
          <span>◎</span>
          <h2>L'espace IDP est en préparation.</h2>
          <p>Il disposera de ses propres demandes, conversations avec un conseiller, pièces jointes, dossiers de conception, validations et suivi de réalisation.</p>
          <p><strong>Important :</strong> ton choix IDP reste ici. Il ne déclenche pas une conversation DRT et ne transfère pas automatiquement tes informations vers la conception assistée par IA.</p>
        </div>
        <Link className="mk2-space-back" href="/">← Revenir aux trois parcours</Link>
      </section>
    </main>
  );
}
