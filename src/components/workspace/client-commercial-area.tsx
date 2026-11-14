"use client";

import { useEffect, useState } from "react";
import type { ClientJourneyStage } from "@/lib/client-journey";
import { shouldShowCommercialPanels } from "@/lib/client-workspace-view";
import { ClientQuotesPanel } from "@/components/account/client-quotes-panel";
import { ClientPaymentsPanel } from "@/components/account/client-payments-panel";

export function ClientCommercialArea({ stage }: { stage: ClientJourneyStage }) {
  const [hasRecords, setHasRecords] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    async function checkRecords() {
      try {
        const [quotesResponse, paymentsResponse] = await Promise.all([
          fetch("/api/client-quotes", { cache: "no-store" }),
          fetch("/api/client-payments", { cache: "no-store" }),
        ]);
        const [quotes, payments] = await Promise.all([
          quotesResponse.json().catch(() => null),
          paymentsResponse.json().catch(() => null),
        ]);
        const hasQuote = quotesResponse.ok && Boolean(quotes && Array.isArray(quotes.versions) && quotes.versions.length > 0);
        const hasInvoice = paymentsResponse.ok && Boolean(payments && Array.isArray(payments.invoices) && payments.invoices.length > 0);
        if (active) setHasRecords(hasQuote || hasInvoice);
      } catch {
        if (active) setHasRecords(false);
      }
    }
    void checkRecords();
    return () => { active = false; };
  }, []);

  if (hasRecords === null) return <p className="mk-commercial-loading">Vérification des documents commerciaux disponibles…</p>;
  if (!shouldShowCommercialPanels(stage, hasRecords)) return null;

  return (
    <section className="mk-commercial-area" aria-label="Documents commerciaux">
      <div><span>ESPACE COMMERCIAL</span><h2>Devis et paiements disponibles</h2><p>Seuls les documents effectivement publiés pour votre compte sont affichés ici.</p></div>
      <ClientQuotesPanel />
      <ClientPaymentsPanel />
    </section>
  );
}
