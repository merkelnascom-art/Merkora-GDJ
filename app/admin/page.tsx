import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminAccess } from "@/lib/server/admin-access";
import { ClientResponseImportPanel } from "@/components/admin/client-response-import-panel";
import { CloudClientRequestsPanel } from "@/components/admin/cloud-client-requests-panel";

export const dynamic = "force-dynamic";

const cards = [
  { title: "Dossiers clients", description: "Consulter les dossiers autorisés et leur statut.", value: "Lecture seule" },
  { title: "Studio & propositions", description: "Préparer la revue des maquettes et des choix clients.", value: "À connecter" },
  { title: "Devis & validations", description: "Préparer le contrôle humain des périmètres et tarifs.", value: "Non activé" },
  { title: "Réalisation & livraison", description: "Suivre les étapes après autorisation du devis.", value: "À construire" },
];

export default async function AdminPage() {
  const access = await getAdminAccess();

  if (!access.ok && access.reason === "unauthenticated") redirect("/?connexion=requise");
  if (!access.ok && access.reason === "not_allowed") {
    return (
      <main style={styles.page}>
        <section style={styles.card}>
          <span style={styles.badge}>ACCÈS REFUSÉ</span>
          <h1 style={styles.title}>Cet espace est réservé à l’administration.</h1>
          <p style={styles.text}>Le compte connecté n’est pas autorisé à ouvrir le tableau de bord administrateur.</p>
          <Link href="/" style={styles.link}>Retour à MerKora GDJ</Link>
        </section>
      </main>
    );
  }
  if (!access.ok && access.reason === "not_configured") {
    return (
      <main style={styles.page}>
        <section style={styles.card}>
          <span style={styles.badge}>CONFIGURATION REQUISE</span>
          <h1 style={styles.title}>L’accès administrateur n’est pas encore activé.</h1>
          <p style={styles.text}>Pour éviter d’accorder des privilèges par erreur, la liste d’adresses autorisées doit être configurée dans les variables serveur de l’aperçu MerKora GDJ. Aucun rôle administrateur n’est accordé par défaut.</p>
          <Link href="/" style={styles.link}>Retour à MerKora GDJ</Link>
        </section>
      </main>
    );
  }
  if (!access.ok) redirect("/");

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div><div style={styles.eyebrow}>MERKORA GDJ · ESPACE PRIVÉ</div><h1 style={styles.title}>Administration</h1><p style={styles.text}>Connecté en tant que {access.user.email}. Accès vérifié côté serveur.</p></div>
        <Link href="/" style={styles.link}>← Espace de travail</Link>
      </header>
      <section style={styles.notice}>
        <strong>Mode aperçu sécurisé · lecture seule</strong>
        <p>Cette première étape n’écrit aucune donnée et ne modifie aucun dossier. Les modules ci-dessous décrivent le périmètre en préparation; ils ne sont pas présentés comme déjà opérationnels.</p>
      </section>
      <section style={styles.grid}>
        {cards.map((card) => <article key={card.title} style={styles.module}><span style={styles.moduleValue}>{card.value}</span><h2 style={styles.moduleTitle}>{card.title}</h2><p style={styles.text}>{card.description}</p></article>)}
      </section>
      <CloudClientRequestsPanel />
      <ClientResponseImportPanel />
      <footer style={styles.footer}>MerKora GDJ · Administration de prévisualisation · aucune action de production</footer>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", padding: "clamp(24px, 5vw, 64px)", background: "#f6f5fb", color: "#211d35", fontFamily: "Arial, sans-serif" },
  header: { display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 24, maxWidth: 1100, margin: "0 auto 28px" },
  card: { maxWidth: 640, margin: "10vh auto", padding: 32, background: "#fff", border: "1px solid #e5e0f0", borderRadius: 24, boxShadow: "0 20px 60px rgba(37, 24, 70, .08)" },
  badge: { display: "inline-block", padding: "7px 11px", borderRadius: 999, background: "#eee9ff", color: "#5e35b1", fontSize: 11, fontWeight: 700, letterSpacing: 1 },
  eyebrow: { color: "#6e56a5", fontSize: 11, fontWeight: 700, letterSpacing: 1.5 },
  title: { margin: "12px 0", fontSize: "clamp(30px, 5vw, 44px)", letterSpacing: "-1.5px" },
  text: { color: "#716c80", lineHeight: 1.65, fontSize: 14 },
  link: { display: "inline-block", color: "#5e35b1", fontWeight: 700, textDecoration: "none", padding: "10px 0" },
  notice: { maxWidth: 1100, margin: "0 auto 24px", padding: 22, borderRadius: 18, background: "#eeebff", border: "1px solid #ddd5ff", lineHeight: 1.6 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, maxWidth: 1100, margin: "0 auto" },
  module: { background: "#fff", border: "1px solid #e7e2f0", borderRadius: 20, padding: 24, minHeight: 170 },
  moduleValue: { display: "inline-block", fontSize: 11, fontWeight: 700, color: "#6e56a5", background: "#f1edfb", padding: "6px 9px", borderRadius: 999 },
  moduleTitle: { fontSize: 20, margin: "18px 0 8px" },
  footer: { maxWidth: 1100, margin: "32px auto 0", color: "#918ba0", fontSize: 12 },
};