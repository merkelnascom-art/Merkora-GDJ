"use client";

import { useEffect, useState } from "react";
import { parseClientResponseFile, type ClientResponseFile } from "@/lib/client-response-file";

const STORAGE_KEY = "merkora-admin-imported-client-responses-v1";
const workflowStatuses = [
  { value: "to_review", label: "À examiner" },
  { value: "verified", label: "Identité et dossier vérifiés" },
  { value: "changes_requested", label: "Modifications à préparer" },
  { value: "negotiation", label: "Négociation en cours" },
  { value: "accepted", label: "Accepté par l’administration" },
  { value: "in_progress", label: "Réalisation en cours" },
  { value: "delivered", label: "Livré" },
  { value: "rejected", label: "Refusé / clôturé" },
] as const;
type WorkflowStatus = typeof workflowStatuses[number]["value"];
type ImportedItem = ClientResponseFile & {
  importedAt: string;
  localImportId: string;
  adminStatus: WorkflowStatus;
  adminNote: string;
};
function isWorkflowStatus(value: unknown): value is WorkflowStatus {
  return typeof value === "string" && workflowStatuses.some((status) => status.value === value);
}

const labels = {
  accepted: "Le client indique accepter",
  changes_requested: "Modifications demandées",
  negotiate: "Discussion du prix ou des conditions demandée",
} as const;

export function ClientResponseImportPanel() {
  const [items, setItems] = useState<ImportedItem[]>([]);
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState("Sélectionnez un export JSON MerKora pour l’examiner.");
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const restored = parsed.flatMap((item): ImportedItem[] => {
            if (!item || typeof item !== "object") return [];
            const candidate = item as Record<string, unknown>;
            if (typeof candidate.rawJson !== "string") return [];
            try {
              const response = parseClientResponseFile(candidate.rawJson);
              return [{
                ...response,
                importedAt: typeof candidate.importedAt === "string" ? candidate.importedAt : response.exportedAt,
                localImportId: typeof candidate.localImportId === "string" ? candidate.localImportId : response.project.id + response.exportedAt,
                adminStatus: isWorkflowStatus(candidate.adminStatus) ? candidate.adminStatus : "to_review",
                adminNote: typeof candidate.adminNote === "string" ? candidate.adminNote.slice(0, 1200) : "",
              }];
            } catch {
              return [];
            }
          });
          setItems(restored);
        }
      }
    } catch {
      setMessage("Le stockage local est indisponible ; les imports resteront visibles pour cette session uniquement.");
    } finally {
      setReady(true);
    }
  }, []);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    setError("");
    if (!file) return;
    if (file.size > 100_000) {
      setError("Fichier trop volumineux : maximum 100 Ko.");
      return;
    }
    try {
      const rawJson = await file.text();
      const response = parseClientResponseFile(rawJson);
      const item: ImportedItem = {
        ...response,
        importedAt: new Date().toISOString(),
        localImportId: response.project.id + ":" + response.exportedAt + ":" + response.response.choice,
        adminStatus: "to_review",
        adminNote: "",
      };
      setItems((current) => {
        const next = [item, ...current.filter((old) => old.localImportId !== item.localImportId)].slice(0, 50);
        if (saveItemsLocally(next)) {
          setMessage("Fichier vérifié et ajouté à la liste locale. Vérifiez manuellement l’identité de l’expéditeur et le dossier concerné.");
        } else {
          setMessage("Fichier importé pour cette session, mais non enregistré durablement.");
        }
        return next;
      });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Impossible de lire ce fichier.");
    }
  }

  function saveItemsLocally(next: ImportedItem[]) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next.map((entry) => ({
        rawJson: JSON.stringify({
          schema: entry.schema,
          project: entry.project,
          quote: entry.quote,
          response: entry.response,
          exportedAt: entry.exportedAt,
        }),
        importedAt: entry.importedAt,
        localImportId: entry.localImportId,
        adminStatus: entry.adminStatus,
        adminNote: entry.adminNote,
      }))));
      return true;
    } catch {
      setMessage("La liste est mise à jour dans cette session, mais le navigateur n’a pas permis de l’enregistrer durablement.");
      return false;
    }
  }

  function updateAdminReview(localImportId: string, changes: Partial<Pick<ImportedItem, "adminStatus" | "adminNote">>) {
    setItems((current) => {
      const next = current.map((item) => item.localImportId === localImportId ? { ...item, ...changes } : item);
      if (saveItemsLocally(next)) setMessage("Suivi administratif enregistré sur cet appareil uniquement.");
      return next;
    });
  }

  function downloadReviewSheet(item: ImportedItem) {
    const content = [
      "MERKORA GDJ — FICHE DE RÉCEPTION D’UN RETOUR CLIENT",
      "",
      "Référence du projet : " + item.project.id,
      "Projet : " + item.project.title,
      "Décision déclarée : " + labels[item.response.choice],
      "Montant du devis affiché : " + (item.quote.amountFcfa ? Number(item.quote.amountFcfa).toLocaleString("fr-FR") + " FCFA" : "Non renseigné"),
      "Délai affiché : " + (item.quote.estimatedDays ? item.quote.estimatedDays + " jour(s)" : "Non renseigné"),
      "Conditions affichées : " + (item.quote.paymentTerms || "À convenir"),
      "Statut administratif local : " + (workflowStatuses.find((status) => status.value === item.adminStatus)?.label || "À examiner"),
      "Note administrative locale : " + (item.adminNote.trim() || "Aucune note"),
      "Commentaire client : " + (item.response.comment.trim() || "Aucun commentaire"),
      "Fichier exporté le : " + new Date(item.exportedAt).toLocaleString("fr-FR"),
      "Importé sur cet appareil le : " + new Date(item.importedAt).toLocaleString("fr-FR"),
      "",
      "CONTRÔLES ADMINISTRATIFS À EFFECTUER",
      "[ ] Confirmer que la référence correspond au bon dossier.",
      "[ ] Vérifier l’identité du client par un canal indépendant.",
      "[ ] Vérifier le montant, le périmètre et les conditions du devis.",
      "[ ] Contacter le client si une clarification est nécessaire.",
      "[ ] Enregistrer la décision administrative dans le dossier officiel.",
      "",
      "ATTENTION : cette fiche est un relevé local généré depuis un fichier importé. Elle ne prouve pas l’identité de l’expéditeur et ne constitue pas un contrat ni une preuve de paiement.",
    ].join("\n");
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "merkora-fiche-retour-" + item.project.id.replace(/[^a-zA-Z0-9_-]/g, "-") + ".txt";
    link.click();
    URL.revokeObjectURL(url);
  }

  function removeItem(localImportId: string) {
    setItems((current) => {
      const next = current.filter((item) => item.localImportId !== localImportId);
      saveItemsLocally(next);
      return next;
    });
  }

  return (
    <section style={styles.section} aria-labelledby="client-response-import-title">
      <div style={styles.heading}>
        <div>
          <span style={styles.eyebrow}>TRANSFERT GRATUIT · FICHIER LOCAL</span>
          <h2 id="client-response-import-title" style={styles.title}>Retours clients à examiner</h2>
          <p style={styles.text}>Importez le fichier JSON que le client vous a transmis. Les réponses restent sur ce navigateur : aucun envoi au serveur ni synchronisation entre comptes n’a lieu.</p>
        </div>
        <label style={styles.upload}>
          Choisir un fichier JSON
          <input type="file" accept=".json,application/json" onChange={handleFileChange} style={styles.fileInput} />
        </label>
      </div>
      <p role="status" style={styles.status}>{message}</p>
      {error && <p role="alert" style={styles.error}>{error}</p>}
      {!ready && <p style={styles.text}>Chargement des imports locaux…</p>}
      {ready && items.length === 0 && <div style={styles.empty}>Aucun retour importé pour le moment.</div>}
      <div style={styles.list}>
        {items.map((item) => (
          <article key={item.localImportId} style={styles.item}>
            <div style={styles.itemHeader}>
              <div><span style={styles.projectId}>{item.project.id}</span><h3 style={styles.itemTitle}>{item.project.title}</h3></div>
              <span style={styles.pending}>À vérifier manuellement</span>
            </div>
            <p style={styles.decision}>{labels[item.response.choice]}</p>
            <dl style={styles.details}>
              <div><dt>Montant proposé</dt><dd>{item.quote.amountFcfa ? Number(item.quote.amountFcfa).toLocaleString("fr-FR") + " FCFA" : "Non renseigné"}</dd></div>
              <div><dt>Délai annoncé</dt><dd>{item.quote.estimatedDays ? item.quote.estimatedDays + " jour(s)" : "Non renseigné"}</dd></div>
              <div><dt>Exporté le</dt><dd>{new Date(item.exportedAt).toLocaleString("fr-FR")}</dd></div>
            </dl>
            <div style={styles.comment}><strong>Commentaire du client</strong><p>{item.response.comment.trim() || "Aucun commentaire ajouté."}</p></div>
            <p style={styles.terms}><strong>Conditions affichées :</strong> {item.quote.paymentTerms || "À convenir"}</p>
            <div style={styles.adminReview}>
              <label style={styles.adminLabel} htmlFor={"admin-status-" + item.localImportId}>Statut administratif interne</label>
              <select id={"admin-status-" + item.localImportId} value={item.adminStatus} onChange={(event) => updateAdminReview(item.localImportId, { adminStatus: event.target.value as WorkflowStatus })} style={styles.adminSelect}>
                {workflowStatuses.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
              </select>
              <label style={styles.adminLabel} htmlFor={"admin-note-" + item.localImportId}>Note de suivi interne</label>
              <textarea id={"admin-note-" + item.localImportId} value={item.adminNote} maxLength={1200} rows={3} onChange={(event) => updateAdminReview(item.localImportId, { adminNote: event.target.value })} placeholder="Prochaine action, personne à contacter, point à vérifier…" style={styles.adminTextarea} />
              <p style={styles.localHint}>Ce statut et cette note sont internes à ce navigateur. Ils ne sont pas transmis au client ni à un autre administrateur.</p>
            </div>
            <p style={styles.warning}>{item.notice} L’import ne prouve pas l’identité de l’expéditeur. Comparez la référence avec le dossier avant toute décision.</p>
            <div style={styles.actions}>
              <button type="button" onClick={() => downloadReviewSheet(item)} style={styles.download}>Télécharger la fiche de contrôle (.txt)</button>
              <button type="button" onClick={() => removeItem(item.localImportId)} style={styles.remove}>Retirer de cette liste locale</button>
            </div>
          </article>
        ))}
      </div>
      <p style={styles.footer}>Maximum 50 réponses conservées localement sur cet appareil. Le stockage peut être effacé par le navigateur ; exportez et conservez les documents nécessaires séparément.</p>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  section: { maxWidth: 1100, margin: "24px auto", padding: 24, border: "1px solid #e2dcef", borderRadius: 22, background: "#fff" },
  heading: { display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 18 },
  eyebrow: { color: "#6e56a5", fontSize: 11, fontWeight: 800, letterSpacing: 1.4 },
  title: { fontSize: 24, margin: "8px 0" },
  text: { color: "#716c80", fontSize: 13, lineHeight: 1.6, maxWidth: 680 },
  upload: { position: "relative", display: "inline-block", padding: "12px 16px", background: "#5e35b1", color: "#fff", borderRadius: 12, fontWeight: 700, fontSize: 13, cursor: "pointer" },
  fileInput: { position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer" },
  status: { padding: 12, borderRadius: 10, background: "#f5f2fc", color: "#50446e", fontSize: 13, lineHeight: 1.5 },
  error: { padding: 12, borderRadius: 10, background: "#fff0f0", color: "#9c2020", fontSize: 13 },
  empty: { padding: 24, border: "1px dashed #d8d0e7", borderRadius: 14, color: "#716c80", textAlign: "center" },
  list: { display: "grid", gap: 14, marginTop: 16 },
  item: { padding: 20, border: "1px solid #e7e2f0", borderRadius: 16, background: "#fdfcff" },
  itemHeader: { display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 10, alignItems: "start" },
  projectId: { color: "#716c80", fontSize: 11, fontWeight: 800, letterSpacing: 1 },
  itemTitle: { fontSize: 18, margin: "5px 0 10px" },
  pending: { padding: "6px 9px", background: "#fff3d6", color: "#795500", borderRadius: 999, fontSize: 11, fontWeight: 800 },
  decision: { fontWeight: 700, color: "#4b347f" },
  details: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, margin: "14px 0" },
  comment: { padding: 14, background: "#f5f2fc", borderRadius: 12, whiteSpace: "pre-wrap" },
  terms: { color: "#514b61", fontSize: 13, lineHeight: 1.5 },
  adminReview: { display: "grid", gap: 8, margin: "16px 0", padding: 14, border: "1px solid #e3dced", borderRadius: 12, background: "#fff" },
  adminLabel: { fontSize: 12, fontWeight: 800, color: "#514b61" },
  adminSelect: { width: "100%", maxWidth: 420, border: "1px solid #d8d0e7", borderRadius: 9, padding: "10px 12px", background: "#fff", color: "#302840" },
  adminTextarea: { width: "100%", border: "1px solid #d8d0e7", borderRadius: 9, padding: 12, background: "#fff", color: "#302840", resize: "vertical", font: "inherit", fontSize: 13 },
  localHint: { color: "#918ba0", fontSize: 11, lineHeight: 1.5, margin: 0 },
  warning: { color: "#746a82", fontSize: 12, lineHeight: 1.55 },
  actions: { display: "flex", flexWrap: "wrap", gap: 10, marginTop: 12 },
  download: { border: "1px solid #5e35b1", borderRadius: 9, padding: "8px 11px", background: "#5e35b1", color: "#fff", cursor: "pointer", fontWeight: 700 },
  remove: { border: "1px solid #ddd5e8", borderRadius: 9, padding: "8px 11px", background: "#fff", color: "#514b61", cursor: "pointer" },
  footer: { color: "#918ba0", fontSize: 11, lineHeight: 1.5, marginTop: 16 },
};
