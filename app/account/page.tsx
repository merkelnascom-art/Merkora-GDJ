import Link from "next/link";
import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/supabase/auth-actions";

export default async function AccountPage() {
  const supabase = await getSupabaseServerClient();
  if (!supabase) redirect("/auth?status=not-configured");
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  return (
    <main className="mk-v2-page" style={{ minHeight: "100vh", padding: "2rem", color: "#f8f5ff" }}>
      <header className="mk-header"><Link className="mk-brand" href="/"><span className="mk-brand-mark">M</span><span><strong>MerKora</strong><small>ESPACE PERSONNEL</small></span></Link><Link className="mk-back-link" href="/">Accueil</Link></header>
      <section style={{ maxWidth: 760, margin: "4rem auto", padding: "2rem", border: "1px solid rgba(220,190,130,.28)", borderRadius: 24, background: "rgba(12,17,38,.8)" }}>
        <span className="mk-eyebrow"><span /> COMPTE SÉCURISÉ</span>
        <h1 style={{ fontSize: "clamp(2rem,5vw,3.4rem)" }}>Bienvenue dans ton espace.</h1>
        <p>Connecté avec <strong>{user.email}</strong></p>
        <p style={{ opacity: .75 }}>Tes projets enregistrés et leur synchronisation seront accessibles depuis ton espace projets. Tes dossiers locaux restent conservés sur cet appareil.</p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 28 }}>
          <Link className="mk-continue-button" href="/projects">Mes projets <span>→</span></Link>
          <form action={signOut}><button className="mk-secondary-button" type="submit">Se déconnecter</button></form>
        </div>
      </section>
    </main>
  );
}
