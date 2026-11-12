export type BusinessSignalId =
  | "revenue" | "sales" | "cashflow" | "expenses" | "profitability"
  | "debt" | "receivables" | "payables" | "payments" | "pricing"
  | "payroll" | "budget_control" | "stock_value" | "financial_reporting" | "financial_context";

export type BusinessSignal = {
  id: BusinessSignalId;
  label: string;
  evidence: string[];
  confidence: "explicit" | "suggested";
  followUp: string;
};

export type BusinessSignalAnalysis = {
  signals: BusinessSignal[];
  candidateFamilyIds: string[];
  transversalCapabilities: string[];
  caution: string;
};

const RULES: Array<{
  id: BusinessSignalId; label: string; pattern: RegExp; followUp: string;
  capabilities: string[]; familyIds: string[];
}> = [
  { id: "revenue", label: "Recettes et chiffre d'affaires", pattern: /\b(recette|recettes|chiffre d'affaires|ca journalier|revenu|revenus|encaissement|encaissements)\b/gi, followUp: "Quelles sont vos sources de recettes, à quelle fréquence les enregistrez-vous et qui les vérifie ?", capabilities: ["journal des recettes", "rapprochement des encaissements"], familyIds: ["family-05", "family-06"] },
  { id: "sales", label: "Ventes et suivi commercial", pattern: /\b(vente|ventes|vends|vend|vendu|vendus|vendues|commande|commandes|clients qui achètent|volume de vente)\b/gi, followUp: "Faut-il suivre les ventes par produit, vendeur, canal, client ou période ?", capabilities: ["suivi des ventes", "tableau de bord commercial"], familyIds: ["family-04", "family-05"] },
  { id: "cashflow", label: "Trésorerie et caisse", pattern: /\b(trésorerie|tresorerie|caisse|solde|liquidité|liquidites|argent en caisse|mouvements de caisse)\b/gi, followUp: "Comment suivez-vous l'argent disponible, les entrées, les sorties et le solde réel de chaque caisse ou compte ?", capabilities: ["journal de caisse", "suivi de trésorerie", "rapprochement caisse/banque"], familyIds: ["family-05", "family-06"] },
  { id: "expenses", label: "Dépenses et charges", pattern: /\b(dépense|dépenses|depense|depenses|charge|charges|frais|achats|coûts|couts|coût|cout)\b/gi, followUp: "Quelles catégories de dépenses avez-vous, qui les saisit et qui autorise leur paiement ?", capabilities: ["registre des dépenses", "catégorisation", "circuit de validation"], familyIds: ["family-05", "family-06"] },
  { id: "profitability", label: "Bénéfice, marge et rentabilité", pattern: /\b(bénéfice|benefice|bénéfices|benefices|profit|profits|marge|marges|rentabilité|rentabilite|perte|pertes|résultat net|resultat net)\b/gi, followUp: "Souhaitez-vous calculer la marge par produit, activité, projet ou période, en tenant compte des coûts directs et indirects ?", capabilities: ["calcul des marges", "analyse de rentabilité", "résultat périodique"], familyIds: ["family-05", "family-06"] },
  { id: "debt", label: "Dettes et emprunts", pattern: /\b(dette|dettes|emprunt|emprunts|crédit|credit|crédits|credits|remboursement|rembourser)\b/gi, followUp: "Qui doit de l'argent à qui, quels montants restent dus, quelles échéances et quelles preuves faut-il conserver ?", capabilities: ["registre des dettes", "échéancier", "historique des remboursements"], familyIds: ["family-05", "family-06"] },
  { id: "receivables", label: "Créances et paiements clients en attente", pattern: /\b(impayé|impayés|impayes|doivent me|me doivent|à recouvrer|a recouvrer|reste à payer|reste a payer|paiement en retard|facture impayée|facture impayee)\b/gi, followUp: "Comment identifiez-vous les clients débiteurs, les montants dus, les relances et les paiements partiels ?", capabilities: ["comptes clients", "relances", "suivi des paiements partiels"], familyIds: ["family-05", "family-04"] },
  { id: "payables", label: "Fournisseurs et factures à payer", pattern: /\b(fournisseur|fournisseurs|factures à payer|factures a payer|échéance fournisseur|echeance fournisseur|crédit fournisseur|credit fournisseur)\b/gi, followUp: "Faut-il suivre les factures fournisseurs, les échéances, les paiements partiels et les justificatifs ?", capabilities: ["comptes fournisseurs", "échéancier fournisseurs"], familyIds: ["family-05", "family-04"] },
  { id: "payments", label: "Paiements et modes de règlement", pattern: /\b(paiement|paiements|payer|payé|payee|payés|mobile money|mtn|moov|celtiis|virement|espèces|especes|acompte|avance)\b/gi, followUp: "Quels moyens de paiement utilisez-vous et comment confirmez-vous qu'un paiement est réellement reçu ?", capabilities: ["journal des paiements", "reçus", "rapprochement des transactions"], familyIds: ["family-05", "family-04"] },
  { id: "pricing", label: "Prix, tarifs et remises", pattern: /\b(prix|tarif|tarifs|remise|remises|promotion|promotions|prix de revient|prix de vente)\b/gi, followUp: "Qui définit les prix et remises, et faut-il historiser les changements de tarifs ?", capabilities: ["gestion tarifaire", "historique des prix", "contrôle des remises"], familyIds: ["family-04", "family-05"] },
  { id: "payroll", label: "Salaires et rémunérations", pattern: /\b(salaire|salaires|paie|payroll|prime|primes|commission|commissions|indemnité|indemnités|indemnite|indemnites)\b/gi, followUp: "Quelles composantes de rémunération faut-il suivre et qui peut consulter ou valider ces informations sensibles ?", capabilities: ["suivi de rémunération", "commissions", "droits d'accès RH"], familyIds: ["family-12", "family-05"] },
  { id: "budget_control", label: "Budget et écarts budgétaires", pattern: /\b(budget|budgets|prévisionnel|previsionnel|dépassement|depassement|écart budgétaire|ecart budgetaire|budget dépassé|budget depasse)\b/gi, followUp: "Quels budgets prévoyez-vous, qui les approuve et comment comparez-vous le prévu au réalisé ?", capabilities: ["budgets prévisionnels", "analyse des écarts", "workflow d'approbation"], familyIds: ["family-05", "family-06"] },
  { id: "stock_value", label: "Stock, achats et valeur immobilisée", pattern: /\b(stock|stocks|inventaire|inventaires|rupture|surstock|marchandise|marchandises|approvisionnement)\b/gi, followUp: "Faut-il valoriser le stock, suivre les entrées/sorties, les pertes, les achats et les écarts d'inventaire ?", capabilities: ["inventaire", "valorisation du stock", "suivi des achats et pertes"], familyIds: ["family-04", "family-05"] },
  { id: "financial_reporting", label: "Rapports et contrôle financier", pattern: /\b(rapport financier|rapport de gestion|bilan financier|état financier|etat financier|comptabilité|comptabilite|audit financier|clôture|cloture|rapport hebdomadaire|rapport mensuel)\b/gi, followUp: "Quel rapport attendez-vous, à quelle fréquence, avec quelles pièces justificatives et quels contrôles ?", capabilities: ["tableaux de bord", "rapports périodiques", "piste d'audit"], familyIds: ["family-05", "family-06"] },
];

function evidenceFor(text: string, pattern: RegExp): string[] {
  const matches = [...text.matchAll(new RegExp(pattern.source, "gi"))].map((match) => match[0].toLocaleLowerCase("fr"));
  return [...new Set(matches)].slice(0, 5);
}

/** Detects financial/operational signals from the client's own words. It suggests questions, never activates modules or asserts accounting facts. */
export function analyzeBusinessSignals(text: string, options: { includeBusinessBaseline?: boolean } = {}): BusinessSignalAnalysis {
  const signals: BusinessSignal[] = [];
  const families = new Set<string>();
  const capabilities = new Set<string>();
  for (const rule of RULES) {
    const evidence = evidenceFor(text, rule.pattern);
    if (!evidence.length) continue;
    signals.push({ id: rule.id, label: rule.label, evidence, confidence: "explicit", followUp: rule.followUp });
    rule.familyIds.forEach((id) => families.add(id));
    rule.capabilities.forEach((item) => capabilities.add(item));
  }

  const normalized = text.toLocaleLowerCase("fr");
  const genericMoneyCue = /\b(argent|fcfa|cfa|francs?|financement|fonds|capital|investissement|investir|trésor|tresor)\b/i.test(normalized);
  if (genericMoneyCue && signals.length === 0) {
    signals.push({
      id: "financial_context",
      label: "Mention financière à clarifier",
      evidence: [...normalized.matchAll(/\\b(argent|fcfa|cfa|francs?|financement|fonds|capital|investissement|investir|trésor|tresor)\\b/gi)].map((match) => match[0]).slice(0, 5),
      confidence: "suggested",
      followUp: "Parlez-vous du budget destiné à créer la solution, ou souhaitez-vous aussi suivre les finances de votre activité : recettes, dépenses, caisse, dettes, paiements et bénéfices ?",
    });
    families.add("family-05");
    capabilities.add("clarification du besoin financier");
  }
  if (options.includeBusinessBaseline && signals.length === 0) {
    signals.push({
      id: "financial_context",
      label: "Dimension financière de l'activité à vérifier",
      evidence: ["activité d'entreprise ou organisation déclarée"],
      confidence: "suggested",
      followUp: "Souhaitez-vous que la solution suive aussi les recettes, dépenses, caisse, paiements, dettes, marges ou bénéfices, ou faut-il se concentrer sur les opérations uniquement ?",
    });
    families.add("family-05");
    capabilities.add("suivi financier facultatif");
  }
  // A plain statement that money is missing/unclear is a warning signal, not proof of theft or loss.
  if (/je ne sais pas où est passé|je ne sais plus où est passé|on ne sait pas où est passé|je ne sais pas où passe|je ne sais plus où passe|on ne sait pas où passe|l'argent disparaît|argent disparait|l'argent manque|argent manque|je ne maîtrise pas l'argent|je ne maitrise pas l'argent/.test(normalized) &&
      !signals.some((item) => item.id === "cashflow")) {
    signals.push({
      id: "cashflow", label: "Écart ou manque de visibilité sur l'argent", evidence: ["argent difficile à localiser ou à expliquer"],
      confidence: "suggested",
      followUp: "À quel moment l'écart apparaît-il : ventes, dépenses, retraits, paiements en attente, caisse ou banque ? Disposez-vous de justificatifs pour comparer les montants ?",
    });
    families.add("family-05"); families.add("family-06");
    capabilities.add("rapprochement caisse/banque"); capabilities.add("journal des mouvements");
  }

  return {
    signals,
    candidateFamilyIds: [...families],
    transversalCapabilities: [...capabilities],
    caution: "Les mots repérés sont des indices de besoin, pas des faits comptables vérifiés. Les familles et fonctions restent à confirmer par le client; aucun module ni paiement n'est activé automatiquement.",
  };
}
