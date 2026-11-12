# MerKora Universal Reference Implementation Plan

> **For agentic workers:** Use the host's available task-by-task implementation workflow. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the approved universal MerKora conception into a versioned, testable runtime reference that can recognize activities across 20 families and 100 sectors, connect them to métiers and processes, and feed the adaptive diagnosis and Studio without removing client control.

**Architecture:** Preserve the existing 13-domain registry as the operational compatibility layer. Add a separate canonical universal reference for the 20 families and 100 sectors, then connect it to the existing discovery engine through explicit, testable mappings. Expand profession records progressively from verified source material; do not pretend that the 2,000–3,000 target is already complete.

**Tech Stack:** TypeScript, Next.js 16, Vitest, existing MerKora discovery, domain registry, recommendations and Studio modules.

## Global Constraints

- Do not delete, reset, truncate or rewrite existing Supabase data or tables.
- Do not merge into `main`, deploy production, launch a paid Vercel Sandbox, or activate paid/external AI services without separate explicit approval.
- Keep the existing 13 operational domains compatible during migration.
- Treat 20 families and 100 sectors as the initial taxonomy; distinguish it from the 13 operational domains.
- Treat the stated 500 profession titles as a source-document target requiring reconciliation: an audit of the current index found 484 candidate entries after excluding the 20 family headings. Preserve the source discrepancy; do not invent the missing 16.
- Treat 2,000–3,000 métiers/specializations as a progressive target, never as an existing complete catalogue.
- AI suggestions are proposals. No module, integration, payment, publication or external action is activated without the required client/admin validation.
- Preserve health, legal, finance, safety, education and other regulated-domain safeguards; do not automate professional decisions.
- No API keys, credentials, personal data or secrets may be committed.

---

### Task 1: Canonical 20-family / 100-sector reference

**Files:**
- Create: `src/lib/universal-reference.ts`
- Create: `src/lib/universal-reference.test.ts`
- Source: `docs/strategie-13-domaines/09-referentiel-universel-domaines-secteurs-metiers.md`

**Interfaces:**
- Produces `MERKORA_UNIVERSAL_FAMILIES`, a typed immutable list of 20 families.
- Each family contains a stable ID, display label, five sector records with stable IDs, labels and concise activity descriptions.
- Produces lookup helpers `getUniversalFamilyById(id)` and `getUniversalSectorById(id)`.
- Does not replace or rename `DomainId` or `MERKORA_DOMAINS`.

- [x] Add tests asserting 20 unique family IDs, exactly 100 unique sector IDs, five sectors per family, non-empty labels/descriptions, and successful lookup / null for unknown IDs.
- [ ] Run `npm test -- src/lib/universal-reference.test.ts`; expected initial failure because the module is absent.
- [x] Implement the reference using the exact family and sector structure in document 09; preserve source IDs where present and assign deterministic IDs only where the source requires them.
- [ ] Run the focused test; expected all taxonomy invariants and lookup cases pass.
- [ ] Run `npm run typecheck` and `npm test`; expected no regression in the existing discovery and domain tests.
- [x] Commit as `feat: add universal family and sector reference`.

### Task 2: Profession candidate index and verified profile boundary

**Source audit finding:** document 10 declares 500 candidate titles, but its current index contains 504 bullet rows across the 20 groups; 20 are family labels, leaving 484 candidate entries. Four titles occur in more than one family (`Livreur`, `Gestionnaire de paie`, `Concierge`, `Éducateur spécialisé`). Keep cross-family occurrences linked to their source family, and record the 16-entry gap instead of fabricating titles.

**Files:**
- Create: `src/lib/profession-reference.ts`
- Create: `src/lib/profession-reference.test.ts`
- Source: `docs/strategie-13-domaines/10-catalogue-metiers-fiches-professionnelles.md`

**Interfaces:**
- Produces a typed candidate index linked to family/sector IDs where the source supports the mapping.
- Separates `candidate` titles from `verified_profile` records.
- A detailed profile may contain work activities, processes, roles, questions, data, digital capabilities, risks and review status.
- No candidate title is silently promoted to a verified profile.

- [ ] Test candidate/profile status separation, unique stable IDs, valid references and explicit unknown mappings.
- [ ] Import the source's initial candidate titles without inventing job descriptions; preserve uncertain sector mappings as unassigned for review.
- [ ] Add only the 20 detailed professional profiles that the source actually documents, clearly marking review status and regulated-domain cautions.
- [ ] Run focused tests, typecheck and full Vitest suite.
- [ ] Commit as `feat: add reviewed profession reference index`.

### Task 3: Bridge universal reference to the 13 operational domains

**Files:**
- Modify: `src/lib/domain-registry.ts`
- Create: `src/lib/universal-domain-mapping.ts`
- Create: `src/lib/universal-domain-mapping.test.ts`

**Interfaces:**
- Produces explicit mapping records from universal family/sector IDs to one or more existing `DomainId` values.
- Supports hybrid projects with multiple family/sector matches.
- Does not infer a confident classification from a vague request.
- Existing `identifyDomain` behavior remains backward compatible until the bridge is covered by integration tests.

- [ ] Test direct, hybrid, ambiguous and unmapped requests, including the existing 13-domain sample corpus.
- [ ] Add explicit mappings and deterministic ranking; return confidence and evidence rather than silently selecting a single sector.
- [ ] Preserve the existing 13-domain result as a compatibility field for current discovery callers.
- [ ] Run domain, discovery integration, typecheck and full tests.
- [ ] Commit as `feat: bridge universal taxonomy to operational domains`.

### Task 4: Feed profession/process context into adaptive diagnosis and Studio

**Files:**
- Inspect and modify only as needed: `src/lib/discovery.ts`, `src/lib/solution-recommendations.ts`, `src/lib/mockup-studio.ts`, `src/components/studio/project-mockup-studio.tsx`
- Add focused tests beside the affected library modules.

**Interfaces:**
- Diagnosis may use family, sector, métier and process evidence to select follow-up questions.
- Recommendations remain separated into métier-specific and transversal options.
- Studio displays only modules the client explicitly selected or confirmed.
- Hybrid projects can combine compatible capabilities without collapsing their distinct business contexts.

- [ ] Add integration tests for a simple activity, a hybrid activity, a vague request and a regulated-domain request.
- [ ] Implement the smallest compatible changes to diagnosis and recommendations.
- [ ] Ensure Studio updates from the selected project scope and does not auto-enable proposed modules.
- [ ] Run focused tests, typecheck and full build checks.
- [ ] Commit as `feat: connect universal reference to diagnosis and studio`.

## Execution ledger

- Branch created from `feature/merkora-factory-unified-runtime`: `feature/merkora-universal-reference-implementation`.
- Task 1 source data extracted and checked: 20 families, 5 sectors per family, 100 sectors total.
- Task 1 implementation committed: `src/lib/universal-reference.ts` and `src/lib/universal-reference.test.ts`.
- Automated execution of Vitest/typecheck is still pending; no passing-test claim is made.
- No Supabase changes, Sandbox runs, merges or deployments were performed.

## Product decisions deliberately preserved

- Whether the profession index should expose all candidate titles to clients or use them internally for recognition is not changed by this plan.
- The taxonomy does not itself decide legal/regulatory requirements for a country; these must be verified per project and jurisdiction.
- No automatic selection of modules, paid integrations, hosting, maintenance or external AI consent is introduced.
- The 2,000–3,000 profession target is reached through reviewed batches, not generated filler entries.
