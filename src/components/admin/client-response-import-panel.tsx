"use client";

import { useEffect, useState } from "react";
import { parseClientResponseFile, type ClientResponseFile } from "@/lib/client-response-file";

const STORAGE_KEY = "merkora-admin-imported-client-responses-v1";
type ImportedItem = ClientResponseFile & { importedAt: string; localImportId: string };

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
      };
      setItems((current) => {
        const next = [item, ...current.filter((old) => old.localImportId !== item.localImportId)].slice(0, 50);
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
          }))));
          setMessage("Fichier vérifié et ajouté à la liste locale. Vérifiez manuellement l’identité de l’expéditeur et le dossier concerné.");
        } catch {
          setMessage("Fichier vérifié pour cette session. Le navigateur n’a pas permis de le conserver après fermeture.");
        }
        return next;
      });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Impossible de lire ce fichier.");
    }
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
      "Commentaire : " + (item.response.comment.trim() || "Aucun commentaire"),
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
    ].join("\\n");
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
        }))));
      } catch {
        setMessage("La liste a été modifiée dans cette session, mais n’a pas pu être enregistrée localement.");
      }
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
  warning: { color: "#746a82", fontSize: 12, lineHeight: 1.55 },
  actions: { display: "flex", flexWrap: "wrap", gap: 10, marginTop: 12 },
  download: { border: "1px solid #5e35b1", borderRadius: 9, padding: "8px 11px", background: "#5e35b1", color: "#fff", cursor: "pointer", fontWeight: 700 },
  remove: { border: "1px solid #ddd5e8", borderRadius: 9, padding: "8px 11px", background: "#fff", color: "#514b61", cursor: "pointer" },
  footer: { color: "#918ba0", fontSize: 11, lineHeight: 1.5, marginTop: 16 },
};
