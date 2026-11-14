import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminAccess } from "@/lib/server/admin-access";
import { ClientResponseImportPanel } from "@/components/admin/client-response-import-panel";
import { CloudClientRequestsPanel } from "@/components/admin/cloud-client-requests-panel";
import { AdminQuotesPanel } from "@/components/admin/admin-quotes-panel";
import { AdminPaymentsPanel } from "@/components/admin/admin-payments-panel";
import { FactoryJobsPanel } from "@/components/admin/factory-jobs-panel";
import { AdminFactoryPlanningPanel } from "@/components/admin/admin-factory-planning-panel";
import { AdminWorkspaceShell } from "@/components/admin/admin-workspace-shell";
import { callUserData, getAccessToken } from "@/lib/server/supabase-rest";

export const dynamic = "force-dynamic";



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

  const token = await getAccessToken(await cookies());
  const factoryJobsResult = token
    ? await callUserData("project_factory_jobs?select=id,project_id,plan_version,status,created_at,manifest&order=created_at.desc&limit=20", "GET", token)
    : { ok: false, status: 401, data: [] };
  const factoryJobs = factoryJobsResult.ok && Array.isArray(factoryJobsResult.data)
    ? factoryJobsResult.data.flatMap((item) => {
        if (!item || typeof item !== "object") return [];
        const job = item as Record<string, unknown>;
        if (typeof job.id !== "string" || typeof job.project_id !== "string" ||
          typeof job.status !== "string" || typeof job.plan_version !== "number" ||
          typeof job.created_at !== "string") return [];
        return [{
          id: job.id, projectId: job.project_id, status: job.status,
          planVersion: job.plan_version, createdAt: job.created_at,
          implementationStatus: job.manifest && typeof job.manifest === "object" && !Array.isArray(job.manifest)
            ? (job.manifest as Record<string, unknown>).implementationStatus === "candidate_ready_for_human_review" ? "candidate_ready_for_human_review" : undefined
            : undefined,
        }];
      })
    : [];

  const factoryJobIds = factoryJobs.map((job) => job.id).filter((id) => /^[0-9a-f-]{36}$/i.test(id));
  const factoryTasksResult = token && factoryJobIds.length
    ? await callUserData(
        `project_factory_tasks?select=id,job_id,task_key,state,updated_at&job_id=in.(${factoryJobIds.join(",")})&order=created_at.asc`,
        "GET", token,
      )
    : { ok: true, status: 200, data: [] };
  const tasksByJob = new Map<string, Array<{ id: string; taskKey: string; state: string; updatedAt?: string }>>();
  if (factoryTasksResult.ok && Array.isArray(factoryTasksResult.data)) {
    for (const item of factoryTasksResult.data) {
      if (!item || typeof item !== "object") continue;
      const task = item as Record<string, unknown>;
      if (typeof task.job_id !== "string" || typeof task.id !== "string" ||
        typeof task.task_key !== "string" || typeof task.state !== "string") continue;
      const current = tasksByJob.get(task.job_id) ?? [];
      current.push({
        id: task.id, taskKey: task.task_key, state: task.state,
        updatedAt: typeof task.updated_at === "string" ? task.updated_at : undefined,
      });
      tasksByJob.set(task.job_id, current);
    }
  }
  const jobsWithTasks = factoryJobs.map((job) => ({
    ...job, tasks: tasksByJob.get(job.id) ?? [],
  }));

  return (
    <AdminWorkspaceShell email={access.user.email ?? "Compte administrateur"}>
      <section id="dashboard" className="mk-admin-section">
        <div className="mk-admin-page-heading">
          <div><span>VUE D’ENSEMBLE</span><h1>Tableau de bord</h1><p>Suivez les demandes, les validations et les travaux sans perdre le contrôle des décisions.</p></div>
          <span className="mk-admin-preview-badge"><i /> MODE APERÇU SÉCURISÉ</span>
        </div>
        <div className="mk-admin-safety-notice">
          <strong>Actions sensibles sous contrôle humain</strong>
          <p>Les devis, factures, validations de paiement et lancements officiels restent soumis à vérification côté serveur. Aucun déploiement ou lancement de production n’est effectué depuis cet aperçu.</p>
        </div>
        <div className="mk-admin-overview-grid">
          <article><span>JOBS DE FABRICATION</span><strong>{factoryJobs.length.toString().padStart(2, "0")}</strong><small>Dossiers techniques enregistrés</small></article>
          <article><span>À CONTRÔLER</span><strong>{factoryJobs.filter((job) => job.status === "awaiting_review" || job.implementationStatus === "candidate_ready_for_human_review").length.toString().padStart(2, "0")}</strong><small>Revue humaine requise</small></article>
          <article><span>EN COURS</span><strong>{factoryJobs.filter((job) => job.status === "queued" || job.status === "running").length.toString().padStart(2, "0")}</strong><small>Jobs en file ou actifs</small></article>
          <article><span>COMPTE ADMIN</span><strong>Actif</strong><small>Accès vérifié côté serveur</small></article>
        </div>
      </section>

      <section id="requests" className="mk-admin-section">
        <div className="mk-admin-section-heading"><div><span>01 · ENTRÉES CLIENTS</span><h2>Demandes clients</h2><p>Consulter les dossiers transmis et leur état actuel.</p></div></div>
        <CloudClientRequestsPanel />
      </section>

      <section id="conception" className="mk-admin-section">
        <div className="mk-admin-section-heading"><div><span>02 · TRAVAIL INTELLECTUEL</span><h2>Analyse & conception</h2><p>Zone de revue des besoins, des hypothèses, des pistes proposées et des concepts.</p></div></div>
        <div className="mk-admin-placeholder"><span>✳</span><div><strong>La revue de conception reste liée au dossier client.</strong><p>Les propositions de l’IA ne sont pas considérées comme des décisions. Les outils de revue transversale seront ajoutés sans dupliquer les dossiers ni créer de décisions automatiques.</p></div><small>ESPACE EN STRUCTURATION</small></div>
      </section>

      <section id="quotes" className="mk-admin-section">
        <div className="mk-admin-section-heading"><div><span>03 · ACCORD CLIENT</span><h2>Validations & devis</h2><p>Préparer les versions, publier les documents et vérifier les retours explicites du client.</p></div></div>
        <AdminQuotesPanel />
        <ClientResponseImportPanel />
      </section>

      <section id="realization" className="mk-admin-section">
        <div className="mk-admin-section-heading"><div><span>04 · EXÉCUTION</span><h2>Réalisation</h2><p>Suivre les jobs techniques, les tâches et les contrôles humains avant livraison.</p></div></div>
        <AdminFactoryPlanningPanel />
      <FactoryJobsPanel initialJobs={jobsWithTasks} aiEnabled={false} />
      </section>

      <section id="clients" className="mk-admin-section">
        <div className="mk-admin-section-heading"><div><span>05 · RELATION CLIENT</span><h2>Clients</h2><p>Les identités et historiques restent rattachés aux dossiers autorisés.</p></div></div>
        <div className="mk-admin-placeholder"><span>♙</span><div><strong>Vue clients dédiée en préparation.</strong><p>Pour éviter les doublons, les dossiers clients existants restent consultables depuis « Demandes clients ». Aucune fiche client indépendante n’est créée automatiquement.</p></div><small>DONNÉES NON DUPLIQUÉES</small></div>
      </section>

      <section id="finances" className="mk-admin-section">
        <div className="mk-admin-section-heading"><div><span>06 · SUIVI FINANCIER</span><h2>Finances</h2><p>Consulter les factures, déclarations et confirmations réellement enregistrées.</p></div></div>
        <AdminPaymentsPanel />
      </section>

      <section id="configuration" className="mk-admin-section">
        <div className="mk-admin-section-heading"><div><span>07 · PARAMÈTRES</span><h2>Configuration</h2><p>Règles de fonctionnement et intégrations de la plateforme.</p></div></div>
        <div className="mk-admin-placeholder"><span>⚙</span><div><strong>Aucun paramètre sensible modifiable depuis cet aperçu.</strong><p>Les règles tarifaires, abonnements, limites d’usage, connexions et autorisations restent inchangés tant qu’une configuration dédiée n’a pas été validée.</p></div><small>LECTURE SEULE</small></div>
      </section>

      <footer className="mk-admin-footer">MerKora GDJ · Administration · actions de production soumises à autorisation</footer>
    </AdminWorkspaceShell>
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