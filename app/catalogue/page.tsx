import Link from "next/link";
import {
  getBaselineModuleLabel,
  getDomainCatalogs,
  getProductTypeCatalog,
} from "../../src/lib/merkora-core/solution-catalog";

export default function CataloguePage() {
  const productTypes = getProductTypeCatalog();
  const domains = getDomainCatalogs();

  return (
    <main className="mk2-space-page mk2-catalogue-page">
      <header className="mk2-space-header">
        <Link className="mk2-brand" href="/">
          <span className="mk2-brand-mark">M</span>
          <span><strong>MerKora GDJ</strong><small>CATALOGUE</small></span>
        </Link>
        <Link className="mk2-space-back" href="/">← Accueil MerKora GDJ</Link>
      </header>

      <section className="mk2-space-content mk2-catalogue-content">
        <span className="mk2-space-kicker">ESPACE PRODUITS ET OFFRES</span>
        <h1>Les solutions prennent <em>forme</em>.</h1>
        <p className="mk2-space-lead">
          Explore les familles de produits numériques et les domaines d'activité que MerKora GDJ
          peut réunir dans une même solution. Le choix du produit et celui du métier sont deux
          décisions différentes : nous les combinons selon ton besoin réel.
        </p>

        <nav className="mk2-catalogue-jump" aria-label="Explorer le catalogue">
          <a href="#product-types">Types de produits <span>{productTypes.length}</span></a>
          <a href="#business-domains">Domaines d'activité <span>{domains.length}</span></a>
        </nav>

        <section className="mk2-catalogue-section" id="product-types">
          <div className="mk2-catalogue-section-heading">
            <div>
              <span className="mk2-catalogue-kicker">01 · LA FORME DU PRODUIT</span>
              <h2>Quel type de produit souhaites-tu ?</h2>
              <p>Un site, une plateforme, une application ou un outil spécialisé : chaque type a son propre socle fonctionnel.</p>
            </div>
            <span className="mk2-catalogue-count">{productTypes.length} types référencés</span>
          </div>

          <div className="mk2-catalogue-grid mk2-catalogue-product-grid">
            {productTypes.map((product, index) => (
              <article className="mk2-catalogue-card mk2-catalogue-product-card" key={product.id}>
                <span className="mk2-catalogue-card-index">{String(index + 1).padStart(2, "0")}</span>
                <h3>{product.label}</h3>
                <p>{product.description}</p>
                <div className="mk2-catalogue-tags" aria-label="Fonctions de base">
                  {product.baselineModules.slice(0, 4).map((moduleId) => (
                    <span key={moduleId}>{getBaselineModuleLabel(moduleId)}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mk2-catalogue-section" id="business-domains">
          <div className="mk2-catalogue-section-heading">
            <div>
              <span className="mk2-catalogue-kicker">02 · LE MÉTIER À ACCOMPAGNER</span>
              <h2>Dans quel domaine sera-t-il utilisé ?</h2>
              <p>Une même activité peut avoir besoin de plusieurs domaines. Un domaine peut utiliser plusieurs types de produits, et un produit peut servir plusieurs domaines. Les combinaisons sont possibles, sans mélanger les règles propres à chaque métier.</p>
            </div>
            <span className="mk2-catalogue-count">{domains.length} domaines référencés</span>
          </div>

          <div className="mk2-catalogue-grid mk2-catalogue-domain-grid">
            {domains.map((domain, index) => (
              <article className="mk2-catalogue-card mk2-catalogue-domain-card" key={domain.id}>
                <div className="mk2-catalogue-domain-top">
                  <span className="mk2-catalogue-card-index">{String(index + 1).padStart(2, "0")}</span>
                  <span className="mk2-catalogue-module-count">{domain.modules.length} fonctions métier</span>
                </div>
                <h3>{domain.label}</h3>
                <p>{domain.description}</p>
                <ul>
                  {domain.modules.map((module) => (
                    <li key={module.id}>{module.label}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="mk2-catalogue-principle">
          <span className="mk2-catalogue-kicker">UNE COMPOSITION ADAPTÉE</span>
          <h2>Un produit peut servir plusieurs domaines.</h2>
          <p>
            Par exemple, une plateforme peut réunir le suivi de présence, les réservations et la
            gestion d'équipe. MerKora vérifie les dépendances entre fonctions et te laisse valider
            les choix avant toute commande.
          </p>
          <p className="mk2-catalogue-notice">
            Les offres commerciales seront publiées ici après validation par l'équipe MerKora GDJ.
            Les fiches, tarifs, options et délais ne seront affichés qu'une fois définis.
          </p>
          <Link className="mk2-primary" href="/conversation">
            Décrire mon projet sur mesure <span>→</span>
          </Link>
        </section>
      </section>
    </main>
  );
}
