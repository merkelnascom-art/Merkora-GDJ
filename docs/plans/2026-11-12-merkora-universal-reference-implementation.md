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

- [x] Add tests for candidate/profile status separation, unique stable IDs, valid family references and cross-family duplicate titles.
- [x] Import the 484 candidate entries actually present in the source index without inventing job descriptions; preserve sector mappings as unassigned for review and retain the 16-entry discrepancy.
- [x] Add the 20 detailed professional profiles actually documented in the source, marked `documented_unreviewed` rather than certified or jurisdictionally verified.
- [ ] Run focused tests, typecheck and full Vitest suite.
- [x] Commit the profession candidate index, 20 detailed profiles and tests.

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

- [x] Add tests for direct, hybrid, ambiguous/multi-domain, unmapped and unknown-reference cases.
- [x] Add explicit family-to-domain mappings with deterministic ordering, confidence, evidence and unmapped-family reporting.
- [x] Preserve the existing 13-domain result and expose universal family candidates as a separate non-final classification field in discovery.
- [ ] Run domain, discovery integration, typecheck and full tests.
- [x] Commit the mapping bridge, discovery integration and focused tests.

### Task 4: Feed profession/process context into adaptive diagnosis and Studio

**Files:**
- Inspect and modify only as needed: `src/lib/discovery.ts`, `src/lib/solution-recommendations.ts`, `src/lib/mockup-studio.ts`, `src/components/studio/project-mockup-studio.tsx`
- Add focused tests beside the affected library modules.

**Interfaces:**
- Diagnosis may use family, sector, métier and process evidence to select follow-up questions.
- Recommendations remain separated into métier-specific and transversal options.
- Studio displays only modules the client explicitly selected or confirmed.
- Hybrid projects can combine compatible capabilities without collapsing their distinct business contexts.

- [x] Add focused integration tests for known family candidates, ambiguous finance/management candidates, vague requests, and Studio family context. Broader hybrid and regulated-domain scenarios remain to be expanded.
- [x] Implement the compatible discovery-to-family bridge and expose family candidates without auto-selecting a family or module.
- [x] Display the possible universal family context in the Studio and its exported summary; preserve the existing client-controlled module selection.
- [x] Display profession candidate titles supplied by discovery as optional client-confirmed choices; persist those choices locally and include confirmed métiers in the concept summary and quote draft.
- [x] Add a structured activity diagnostic plan with universal questions on real activities, workflow stages, roles, volume, exceptions, data/documents and business rules.
- [x] Add profession-family question packs across all 20 universal families, including regulated-domain confidentiality and human-validation prompts.
- [x] Let the client explicitly confirm one or more sector IDs in Studio; reject unknown sectors and sectors outside the suggested families.
- [x] Feed confirmed sectors and confirmed métier titles into a hybrid-aware diagnostic plan; preserve separate family contexts and shared transversal questions.
- [x] Display the diagnostic prompts in Studio and include confirmed sectors and question prompts in the local concept/quote summary.
- [ ] Add answer capture and persist diagnostic responses with project ownership and version history; do not treat displayed prompts as completed answers.
- [ ] Expand discovery to recognize currently unmapped families 16–20 without forcing them into the 13 legacy operational domains.
- [ ] Run focused tests, typecheck and full build checks for the latest Studio changes.

## Execution ledger

- Branch created from `feature/merkora-factory-unified-runtime`: `feature/merkora-universal-reference-implementation`.
- Task 1 source data extracted and checked: 20 families, 5 sectors per family, 100 sectors total.
- Task 1 implementation committed: `src/lib/universal-reference.ts` and `src/lib/universal-reference.test.ts`.
- Task 2 implementation committed: 484 source candidate entries, 20 detailed unreviewed profiles and focused tests in `src/lib/profession-reference.ts` / `.test.ts`.
- Task 3 implementation committed: explicit family-to-operational-domain mapping and discovery family-candidate output, with focused tests.
- Task 4 first slice committed: discovery carries possible family candidates and Studio supports client confirmation of profession candidates.
- Task 4 second slice committed: `activity-diagnostic.ts` defines shared process questions and family-specific question packs across all 20 families; Studio now allows explicit sector confirmation, builds a hybrid-aware question plan and includes confirmed sectors/questions in the local concept and quote summary. Answer capture and persistence remain open.
- Focused Vitest, full Vitest, typecheck and production build execution are still pending; no passing-test claim is made.
- No Supabase changes, Sandbox runs, merges or deployments were performed.

## Product decisions deliberately preserved

- Whether the profession index should expose all candidate titles to clients or use them internally for recognition is not changed by this plan.
- The taxonomy does not itself decide legal/regulatory requirements for a country; these must be verified per project and jurisdiction.
- No automatic selection of modules, paid integrations, hosting, maintenance or external AI consent is introduced.
- The 2,000–3,000 profession target is reached through reviewed batches, not generated filler entries.
