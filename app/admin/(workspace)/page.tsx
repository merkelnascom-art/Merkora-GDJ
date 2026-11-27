import Link from "next/link";
import { adminSignOut } from "@/lib/supabase/admin-auth-actions";
import { requireMerkoraAdmin } from "@/lib/supabase/admin-guard";
export default async function AdminWorkspacePage() {
  const admin = await requireMerkoraAdmin();
  const modules = [
    {title:"Demandes clients",desc:"Consulter et suivre les demandes reçues."},
    {title:"Catalogue & parcours",desc:"Superviser Catalogue, IDP et DRT."},
    {title:"Tarification & devis",desc:"Préparer la gestion centralisée des tarifs et devis."},
    {title:"Réalisation",desc:"Suivre les projets et leurs livraisons."}
  ];
  return <main className="mk-v2-page" style={{ minHeight:"100vh", padding:"clamp(1rem,4vw,2.5rem)", color:"#f8f5ff" }}>
    <header className="mk-header"><Link className="mk-brand" href="/"><span className="mk-brand-mark">M</span><span><strong>MerKora GDJ</strong><small>ESPACE ADMINISTRATEUR</small></span></Link><form action={adminSignOut}><button className="mk-secondary-button" type="submit">Se déconnecter</button></form></header>
    <section style={{ maxWidth:1120, margin:"3rem auto" }}>
      <span className="mk-eyebrow"><span /> SESSION ADMINISTRATEUR VÉRIFIÉE</span>
      <h1 style={{ fontSize:"clamp(2.2rem,5vw,3.8rem)", marginBottom:8 }}>Tableau de bord</h1>
      <p style={{ opacity:.72 }}>Connecté en tant que <strong>{admin.email}</strong>. Cet espace est réservé au compte administrateur unique de MerKora.</p>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:16, marginTop:34 }}>
        {modules.map(item=><article key={item.title} style={{ padding:22, border:"1px solid rgba(220,190,130,.24)", borderRadius:18, background:"rgba(12,17,38,.72)" }}><h2 style={{ fontSize:"1.15rem" }}>{item.title}</h2><p style={{ opacity:.7, lineHeight:1.6 }}>{item.desc}</p><span style={{ fontSize:".78rem", opacity:.55 }}>Module en préparation</span></article>)}
      </div>
    </section>
  </main>;
}
