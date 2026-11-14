"use client";

import { useMemo, useState } from "react";
import {
  AGENT_CATALOG,
  AGENT_POLES,
  MERKORA_CORE,
  type AgentDefinition,
  type AgentPoleId,
} from "@/lib/agents/agent-catalog";
import { filterAgentCatalog, type AgentCatalogFilter } from "@/lib/agents/agent-catalog-view";
import styles from "./agents.module.css";

const ALL_FILTERS: Array<{ id: AgentCatalogFilter; label: string }> = [
  { id: "all", label: "Tous les pôles" },
  ...AGENT_POLES.map((pole) => ({ id: pole.id, label: pole.name.replace(/^Pôle [^—]+— /, "") })),
];

function DetailList({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <section className={styles.detailSection}>
      <h3>{title}</h3>
      {items.length ? (
        <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
      ) : <p className={styles.empty}>Aucun élément renseigné.</p>}
    </section>
  );
}

function AgentDetails({ agent }: { agent: AgentDefinition }) {
  const pole = AGENT_POLES.find((item) => item.id === agent.poleId);
  return (
    <article className={styles.detailCard} aria-live="polite">
      <div className={styles.detailTop}>
        <div>
          <span className={styles.eyebrow}>{pole?.name ?? "Pôle"}</span>
          <h2>{agent.name}</h2>
          <p>{agent.mission}</p>
        </div>
        <span className={styles.catalogStatus}>Catalogue uniquement</span>
      </div>
      <div className={styles.detailGrid}>
        <DetailList title="Responsabilités" items={agent.responsibilities} />
        <DetailList title="Déclencheurs de mission" items={agent.activationTriggers} />
        <DetailList title="Entrées attendues" items={agent.inputs} />
        <DetailList title="Livrables attendus" items={agent.outputs} />
        <DetailList title="Limites et permissions" items={agent.permissionBoundaries} />
        <DetailList title="Critères d’acceptation" items={agent.acceptanceCriteria} />
        <DetailList title="Méthodes de vérification" items={agent.verificationMethods} />
        <DetailList title="Gestion des échecs" items={agent.failureHandling} />
      </div>
      <div className={styles.toolDomains}>
        <strong>Domaines d’outils envisagés</strong>
        <div>{agent.suggestedToolDomains.map((domain) => <span key={domain}>{domain}</span>)}</div>
        <small>Ce sont des domaines conceptuels, pas des accès ou permissions déjà accordés.</small>
      </div>
    </article>
  );
}

export function AgentCatalogExplorer() {
  const [query, setQuery] = useState("");
  const [poleFilter, setPoleFilter] = useState<AgentCatalogFilter>("all");
  const [selectedAgentId, setSelectedAgentId] = useState(AGENT_CATALOG[0]?.id ?? "");
  const visibleAgents = useMemo(
    () => filterAgentCatalog(query, poleFilter),
    [query, poleFilter],
  );
  const selectedAgent = visibleAgents.find((agent) => agent.id === selectedAgentId) ?? visibleAgents[0];

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <a className={styles.backLink} href="/admin">← Retour à l’administration</a>
        <a className={styles.backLink} href="/admin/agents/factory">Préparer un workflow de fabrication →</a>
        <span className={styles.headerMark}>MERKORA GDJ · ARCHITECTURE DES AGENTS</span>
        <div className={styles.heading}>
          <div>
            <span className={styles.eyebrow}>ORGANISATION CIBLE</span>
            <h1>Le réseau des agents MerKora</h1>
            <p>Une organisation hiérarchisée pour analyser, concevoir, fabriquer, contrôler, exploiter et accompagner les projets.</p>
          </div>
          <div className={styles.totalCard}>
            <strong>{AGENT_POLES.length + 1}</strong><span>nœuds organisationnels</span>
            <strong>{AGENT_CATALOG.length}</strong><span>spécialistes catalogués</span>
          </div>
        </div>
      </header>

      <section className={styles.coreCard} aria-labelledby="core-title">
        <div className={styles.coreSymbol}>M</div>
        <div>
          <span className={styles.coreLabel}>NŒUD CENTRAL · ORCHESTRATION</span>
          <h2 id="core-title">{MERKORA_CORE.name}</h2>
          <p className={styles.coreRole}>{MERKORA_CORE.role}</p>
          <p>{MERKORA_CORE.mission}</p>
          <div className={styles.coreResponsibilities}>
            {MERKORA_CORE.responsibilities.map((item) => <span key={item}>{item}</span>)}
          </div>
        </div>
      </section>

      <div className={styles.connector} aria-hidden="true"><span /></div>
      <section className={styles.poles} aria-label="Les sept pôles de l'organisation">
        {AGENT_POLES.map((pole, index) => (
          <article className={styles.poleCard} key={pole.id}>
            <div className={styles.poleTop}>
              <span className={styles.poleNumber}>{String(index + 1).padStart(2, "0")}</span>
              <span className={styles.poleCount}>{pole.agents.length} spécialistes</span>
            </div>
            <h2>{pole.name}</h2>
            <span className={styles.poleObjective}>{pole.objective}</span>
            <p>{pole.description}</p>
            <div className={styles.agentChips}>
              {pole.agents.map((agent) => (
                <button
                  type="button"
                  key={agent.id}
                  onClick={() => {
                    setPoleFilter(pole.id);
                    setQuery("");
                    setSelectedAgentId(agent.id);
                  }}
                >
                  {agent.name}
                </button>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className={styles.explorer} aria-labelledby="explorer-title">
        <div className={styles.explorerHeading}>
          <div>
            <span className={styles.eyebrow}>RÉPERTOIRE DÉTAILLÉ</span>
            <h2 id="explorer-title">Explorer les spécialistes</h2>
            <p>Recherchez une mission, un métier, une responsabilité ou une limite.</p>
          </div>
          <span className={styles.resultCount}>{visibleAgents.length} résultat(s)</span>
        </div>
        <div className={styles.filters}>
          <label className={styles.searchLabel}>
            <span>Recherche</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ex. sécurité, devis, tests, client…"
            />
          </label>
          <label className={styles.poleSelectLabel}>
            <span>Filtrer par pôle</span>
            <select
              value={poleFilter}
              onChange={(event) => setPoleFilter(event.target.value as AgentCatalogFilter)}
            >
              {ALL_FILTERS.map((filter) => <option key={filter.id} value={filter.id}>{filter.label}</option>)}
            </select>
          </label>
        </div>
        <div className={styles.resultsLayout}>
          <nav className={styles.agentList} aria-label="Liste des spécialistes">
            {visibleAgents.map((agent) => (
              <button
                type="button"
                key={agent.id}
                className={selectedAgent?.id === agent.id ? styles.agentActive : styles.agentButton}
                onClick={() => setSelectedAgentId(agent.id)}
                aria-pressed={selectedAgent?.id === agent.id}
              >
                <span>{agent.name}</span>
                <small>{AGENT_POLES.find((pole) => pole.id === agent.poleId)?.name}</small>
              </button>
            ))}
            {visibleAgents.length === 0 && <p className={styles.noResults}>Aucun spécialiste ne correspond à cette recherche.</p>}
          </nav>
          <div className={styles.detailArea}>
            {selectedAgent ? <AgentDetails agent={selectedAgent} /> : (
              <div className={styles.noSelection}>Sélectionnez un spécialiste pour consulter sa fiche détaillée.</div>
            )}
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <strong>Règle de sécurité fondamentale</strong>
        <p>Cette page présente l’organisation cible. Elle n’active aucun agent, n’appelle aucun fournisseur IA, n’accorde aucun accès et ne déclenche aucune mission. Les validations humaines et les permissions réelles restent séparées.</p>
      </footer>
    </main>
  );
}
