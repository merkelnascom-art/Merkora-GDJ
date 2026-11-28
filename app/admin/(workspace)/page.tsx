import Link from "next/link";
import { adminSignOut } from "@/lib/supabase/admin-auth-actions";
import { requireMerkoraAdmin } from "@/lib/supabase/admin-guard";

const navigation = [
  { label: "Vue d'ensemble", href: "/admin", icon: "▦", active: true },
  { label: "Demandes clients", href: "#demandes", icon: "▤", disabled: true },
  { label: "Parcours & dossiers", href: "#parcours", icon: "◇", disabled: true },
  { label: "Tarification & devis", href: "#pctd", icon: "₣", disabled: true, badge: "Priorité" },
  { label: "Réalisation", href: "#realisation", icon: "⌁", disabled: true },
  { label: "Intégrations", href: "/admin/integrations", icon: "⧉" },
];

const modules = [
  {
    id: "demandes",
    number: "01",
    title: "Demandes clients",
    description: "Centraliser les demandes, consulter les informations reçues et organiser leur traitement.",
    status: "À construire",
    tone: "muted",
    icon: "▤",
    detail: "Réception · qualification · attribution",
  },
  {
    id: "parcours",
    number: "02",
    title: "Catalogue, IDP & DRT",
    description: "Suivre séparément les trois parcours et retrouver les dossiers associés sans mélanger leurs étapes.",
    status: "Fondations posées",
    tone: "success",
    icon: "◇",
    detail: "3 parcours indépendants",
  },
  {
    id: "pctd",
    number: "03",
    title: "PCTD — Tarification & devis",
    description: "Définir les tarifs en FCFA, contrôler les règles et préparer des estimations cohérentes pour chaque projet.",
    status: "Prochaine priorité",
    tone: "priority",
    icon: "₣",
    detail: "Référentiel tarifaire · calcul · devis",
    featured: true,
  },
  {
    id: "realisation",
    number: "04",
    title: "Réalisation & livraisons",
    description: "Organiser le suivi des projets validés, les étapes de production, les contrôles et les livraisons.",
    status: "À construire",
    tone: "muted",
    icon: "⌁",
    detail: "Planification · avancement · livraison",
  },
];

export default async function AdminWorkspacePage() {
  const admin = await requireMerkoraAdmin();

  return (
    <main style={{ minHeight: "100vh", background: "#f3f6f8", color: "#172b35", fontFamily: "Arial, Helvetica, sans-serif" }}>
      <div style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "minmax(220px, 258px) minmax(0, 1fr)" }}>
        <aside style={{ background: "#102d3a", color: "#f4f8f8", padding: "26px 16px", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12, color: "inherit", textDecoration: "none", padding: "0 10px 28px", borderBottom: "1px solid rgba(255,255,255,.12)" }}>
            <span style={{ width: 42, height: 42, borderRadius: 13, display: "grid", placeItems: "center", background: "#1d8b70", color: "white", fontSize: 23, fontWeight: 800 }}>M</span>
            <span><strong style={{ display: "block", fontSize: 17, letterSpacing: ".2px" }}>MerKora GDJ</strong><small style={{ display: "block", color: "#a9c1c7", fontSize: 9, letterSpacing: "1.5px", marginTop: 5 }}>ADMINISTRATION</small></span>
          </Link>

          <p style={{ margin: "27px 10px 11px", color: "#8faeb5", fontSize: 10, fontWeight: 800, letterSpacing: "1.5px" }}>ESPACE DE PILOTAGE</p>
          <nav aria-label="Navigation administrateur" style={{ display: "grid", gap: 6 }}>
            {navigation.map((item) => item.disabled ? (
              <div key={item.label} title="Ce module sera activé lors de sa mise en service" style={{ display: "flex", alignItems: "center", gap: 12, minHeight: 45, padding: "0 12px", borderRadius: 10, color: "#8fa8ae", fontSize: 13, cursor: "default" }}>
                <span aria-hidden="true" style={{ width: 20, textAlign: "center", fontSize: 17 }}>{item.icon}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && <span style={{ color: "#c4e8d8", background: "rgba(39,157,119,.2)", padding: "4px 6px", borderRadius: 5, fontSize: 9 }}>PRIORITÉ</span>}
              </div>
            ) : (
              <Link key={item.label} href={item.href} aria-current={item.active ? "page" : undefined} style={{ display: "flex", alignItems: "center", gap: 12, minHeight: 45, padding: "0 12px", borderRadius: 10, background: item.active ? "#1b4853" : "transparent", color: item.active ? "#ffffff" : "#c0d1d5", textDecoration: "none", fontSize: 13, fontWeight: item.active ? 700 : 500 }}>
                <span aria-hidden="true" style={{ width: 20, textAlign: "center", fontSize: 17 }}>{item.icon}</span>{item.label}
              </Link>
            ))}
          </nav>

          <div style={{ marginTop: "auto", padding: "16px 11px 4px", borderTop: "1px solid rgba(255,255,255,.12)" }}>
            <span style={{ display: "block", color: "#91b0b7", fontSize: 10, letterSpacing: "1px", marginBottom: 8 }}>SESSION SÉCURISÉE</span>
            <strong style={{ display: "block", color: "#e6f1f1", fontSize: 12, overflowWrap: "anywhere" }}>{admin.email}</strong>
            <form action={adminSignOut} style={{ marginTop: 15 }}>
              <button type="submit" style={{ width: "100%", border: "1px solid rgba(255,255,255,.2)", borderRadius: 9, padding: "10px 12px", background: "transparent", color: "#d8e6e8", textAlign: "left", cursor: "pointer", fontSize: 12 }}>↪ Se déconnecter</button>
            </form>
          </div>
        </aside>

        <section style={{ minWidth: 0, padding: "30px clamp(18px, 4vw, 48px) 48px" }}>
          <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, paddingBottom: 22, borderBottom: "1px solid #dce5e7" }}>
            <div>
              <p style={{ margin: 0, color: "#66818a", fontSize: 10, fontWeight: 800, letterSpacing: "1.6px" }}>MERKORA GDJ / ADMINISTRATION</p>
              <h1 style={{ margin: "7px 0 0", fontSize: "clamp(23px, 3vw, 31px)", color: "#153746" }}>Tableau de bord</h1>
            </div>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8, border: "1px solid #c9e6da", background: "#eaf6f0", color: "#176b50", borderRadius: 999, padding: "8px 12px", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#21966d" }} /> Administrateur vérifié
            </span>
          </header>

          <div style={{ maxWidth: 1180, margin: "30px auto 0" }}>
            <section style={{ borderRadius: 18, padding: "clamp(20px, 3vw, 30px)", background: "linear-gradient(115deg, #123746 0%, #1a5960 100%)", color: "#f5fbfa", boxShadow: "0 12px 30px rgba(16,45,58,.12)" }}>
              <p style={{ margin: 0, color: "#a8d7c8", fontSize: 10, fontWeight: 800, letterSpacing: "1.6px" }}>CENTRE DE COMMANDE</p>
              <h2 style={{ margin: "10px 0 8px", fontSize: "clamp(20px, 3vw, 27px)" }}>Bienvenue dans votre espace administrateur.</h2>
              <p style={{ maxWidth: 700, margin: 0, color: "#d2e3e4", fontSize: 13, lineHeight: 1.7 }}>Pilotez les activités de MerKora GDJ depuis un espace unique. Les modules sont organisés par fonction et ne sont activés qu'une fois leurs outils réellement opérationnels.</p>
            </section>

            <section aria-label="État des modules" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 210px), 1fr))", gap: 14, marginTop: 22 }}>
              <Summary label="Parcours définis" value="03" note="Catalogue · IDP · DRT" />
              <Summary label="Moteur de devis" value="01" note="Socle PCTD préparé" />
              <Summary label="Modules opérationnels" value="01" note="Catalogue d'intégrations" />
            </section>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 16, margin: "34px 0 15px" }}>
              <div>
                <p style={{ margin: 0, color: "#258267", fontSize: 10, fontWeight: 800, letterSpacing: "1.5px" }}>ORGANISATION DE LA PLATEFORME</p>
                <h2 style={{ margin: "6px 0 0", color: "#173b48", fontSize: 20 }}>Modules d'administration</h2>
              </div>
              <span style={{ color: "#73878d", fontSize: 11 }}>Vue structurée · 4 pôles</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 285px), 1fr))", gap: 16 }}>
              {modules.map((item) => (
                <article id={item.id} key={item.id} style={{ position: "relative", minWidth: 0, display: "flex", flexDirection: "column", padding: 21, border: item.featured ? "1px solid #9bcdbb" : "1px solid #dce6e8", borderRadius: 15, background: item.featured ? "#f5fbf7" : "#ffffff", boxShadow: item.featured ? "0 8px 24px rgba(32,119,88,.08)" : "0 5px 18px rgba(20,53,65,.035)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                    <span style={{ width: 39, height: 39, borderRadius: 11, display: "grid", placeItems: "center", background: item.featured ? "#dff2e8" : "#eaf1f3", color: "#176b58", fontSize: 20, fontWeight: 700 }}>{item.icon}</span>
                    <span style={{ color: "#9aabb0", fontSize: 11, fontWeight: 800 }}>PÔLE {item.number}</span>
                  </div>
                  <h3 style={{ margin: "18px 0 8px", color: "#173b48", fontSize: 17 }}>{item.title}</h3>
                  <p style={{ margin: 0, color: "#657980", fontSize: 12, lineHeight: 1.7, minHeight: 62 }}>{item.description}</p>
                  <p style={{ margin: "14px 0 17px", color: "#789097", fontSize: 10, letterSpacing: ".2px" }}>{item.detail}</p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginTop: "auto", paddingTop: 13, borderTop: "1px solid #e7edef" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: item.tone === "success" ? "#18734f" : item.tone === "priority" ? "#176b58" : "#74868c", fontSize: 10, fontWeight: 800 }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: item.tone === "success" ? "#25966b" : item.tone === "priority" ? "#1b9672" : "#aab8bc" }} />{item.status}
                    </span>
                    {item.id === "pctd" ? <span style={{ color: "#176b58", fontSize: 10, fontWeight: 800 }}>ÉTAPE SUIVANTE</span> : item.id === "parcours" ? <span style={{ color: "#18734f", fontSize: 10, fontWeight: 700 }}>STRUCTURE POSÉE</span> : <span style={{ color: "#89999e", fontSize: 10 }}>NON ACTIVÉ</span>}
                  </div>
                </article>
              ))}
            </div>

            <section style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 15, marginTop: 22, padding: 18, border: "1px solid #dce6e8", borderRadius: 14, background: "#fff" }}>
              <div>
                <strong style={{ display: "block", color: "#173b48", fontSize: 13 }}>Écosystème d'intégrations</strong>
                <span style={{ display: "block", color: "#71858b", fontSize: 11, marginTop: 5 }}>Consulter les outils référencés et leur état de configuration.</span>
              </div>
              <Link href="/admin/integrations" style={{ display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 9, padding: "10px 14px", background: "#176b58", color: "#fff", textDecoration: "none", fontSize: 11, fontWeight: 700 }}>Ouvrir les intégrations <span aria-hidden="true">→</span></Link>
            </section>

            <p style={{ margin: "22px 0 0", color: "#829399", fontSize: 10, lineHeight: 1.6 }}>Les compteurs ci-dessus décrivent l'état de préparation du produit, pas des données de production. Aucun tarif officiel ni devis client n'est encore présenté comme validé.</p>
          </div>
        </section>
      </div>
      <style>{`
        @media (max-width: 760px) {
          main > div { grid-template-columns: 1fr !important; }
          main aside { min-height: auto !important; padding: 16px !important; }
          main aside nav { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
          main aside nav > * { min-width: 0; font-size: 11px !important; }
          main aside > div:last-child { margin-top: 18px !important; }
          main section[aria-label="État des modules"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}

function Summary({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <article style={{ padding: "17px 19px", border: "1px solid #dce6e8", borderRadius: 13, background: "#fff" }}>
      <span style={{ display: "block", color: "#70848a", fontSize: 10 }}>{label}</span>
      <strong style={{ display: "block", marginTop: 6, color: "#173b48", fontSize: 25 }}>{value}</strong>
      <span style={{ display: "block", marginTop: 4, color: "#87999e", fontSize: 10 }}>{note}</span>
    </article>
  );
}
