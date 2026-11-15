import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthenticatedContext } from "@/lib/supabase/auth-context";
import { signOut } from "@/lib/supabase/auth-actions";

async function handleSignOut() {
  "use server";
  await signOut();
  redirect("/");
}

const roleLabels: Record<string, string> = {
  client: "Client",
  collaborator: "Collaborateur",
  designer: "Concepteur",
  developer: "Développeur",
  admin: "Administrateur",
  superadmin: "Super-administrateur",
};

export default async function AccountPage() {
  const context = await getAuthenticatedContext();
  if (!context) redirect("/auth");

  return (
    <main className="mk-v2-page" style={{ minHeight: "100vh", padding: "2rem", color: "#f8f5ff" }}>
      <header className="mk-header"><Link className="mk-brand" href="/"><span className="mk-brand-mark">M</span><span><strong>MerKora</strong><small>ESPACE PERSONNEL</small></span></Link><Link className="mk-back-link" href="/">Accueil</Link></header>
      <section style={{ maxWidth: 760, margin: "4rem auto", padding: "2rem", border: "1px solid rgba(220,190,130,.28)", borderRadius: 24, background: "rgba(12,17,38,.8)" }}>
        <span className="mk-eyebrow"><span /> COMPTE SÉCURISÉ</span>
        <h1 style={{ fontSize: "clamp(2rem,5vw,3.4rem)" }}>Bienvenue dans ton espace.</h1>
        <p>Connecté avec <strong>{context.email}</strong></p>
        <p>Profil : <strong>{context.displayName ?? "Utilisateur MerKora"}</strong> · Rôle : <strong>{roleLabels[context.role]}</strong></p>
        <p style={{ opacity: .75 }}>Tes projets enregistrés et leur synchronisation sont accessibles depuis ton espace projets. Tes dossiers locaux restent conservés sur cet appareil.</p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 28 }}>
          <Link className="mk-continue-button" href="/projects">Mes projets <span>→</span></Link>
          <form action={handleSignOut}><button className="mk-secondary-button" type="submit">Se déconnecter</button></form>
        </div>
      </section>
    </main>
  );
}
