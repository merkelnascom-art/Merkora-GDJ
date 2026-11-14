# MerKora GDJ — Studio de maquettes conceptuelles Implementation Plan

> **For agentic workers:** Use the host's available task-by-task implementation workflow. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a first functional MerKora Studio that assembles a responsive, editable concept preview from the current dossier without calling a paid AI provider or claiming the preview is a working product.

**Architecture:** A pure domain helper derives safe preview content and modules from the existing project and user-selected options. A client component renders a responsive preview in three formats and stores only its presentation settings in browser-local storage. The feature stays independent of Supabase schema and AI configuration.

**Tech Stack:** Next.js App Router, React, TypeScript, existing CSS, Vitest, GitHub feature branch and Vercel Preview.

## Global Constraints

- Work only on `feature/merkora-rebuild-foundation`; do not merge to `main`.
- Do not deploy or promote to production without explicit user approval.
- Do not delete, reset, or migrate any existing Supabase project/data.
- Do not change WALL Trade or any other project.
- Do not call a model provider or enable `MERKORA_AI_ENABLED`; no new costs or secrets.
- Keep existing local dossier key `merkora-gdj-projects-v1` readable and preserve all dossiers.
- Label the output as a concept preview, not a functional product or AI-generated image.
- Store preview settings locally and state clearly that they are not yet synchronized to the cloud.
- Run `npm run typecheck`, `npm test`, and `npm run build` before declaring completion.

---

### Task 1: Add a tested mockup model

**Files:**
- Create: `src/lib/mockup-studio.ts`
- Create: `src/lib/mockup-studio.test.ts`
- Consume: `src/lib/project-types.ts` and `src/lib/solution-recommendations.ts`

**Interfaces:**
- Export `MockupFormat = "website" | "mobile" | "dashboard"`.
- Export `MockupPalette = "violet" | "blue" | "emerald" | "amber"`.
- Export `MockupConfig = { format: MockupFormat; palette: MockupPalette; enabledModules: string[] }`.
- Export `MockupModule = { id: string; title: string; description: string }`.
- Export `buildMockupModel(project, config)`, returning a project-specific headline, supporting copy, modules and format label. It must not fabricate actual school names, prices, statistics, or market facts.

- [ ] **Step 1: Add focused failing tests**
  - Student Vision input produces education-oriented modules about profile, tests, métiers/formations/écoles.
  - A commerce/team project produces operational modules rather than education modules.
  - Each of the three formats and four palettes is accepted.
  - Unknown module IDs are ignored when deriving enabled modules.
  - Missing optional content uses safe neutral copy, never invented facts.

- [ ] **Step 2: Verify failure**
  - Run `npm test -- --run src/lib/mockup-studio.test.ts`.
  - Expected: the test file cannot resolve the new model module.

- [ ] **Step 3: Implement the pure model**
  - Use existing project fields and recommendations; derive domain-specific modules with deterministic rules.
  - Keep the model provider-agnostic and free of network calls.

- [ ] **Step 4: Verify focused pass**
  - Run `npm test -- --run src/lib/mockup-studio.test.ts`.
  - Expected: all model tests pass.

- [ ] **Step 5: Run typecheck**
  - Run `npm run typecheck`.
  - Expected: no TypeScript errors.

- [ ] **Step 6: Commit**
  - Commit message: `feat: add domain-aware mockup model`.

### Task 2: Build the interactive Studio

**Files:**
- Create: `src/components/studio/project-mockup-studio.tsx`
- Modify: `app/page.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- `ProjectMockupStudio({ project })` renders the concept preview for the active dossier.
- The user can switch website/mobile/dashboard layouts, choose one of four palettes, enable or disable suggested modules and inspect the preview immediately.
- Store config under a separate key `merkora-gdj-mockup-v1:<project-id>`; do not overwrite the existing dossier storage.
- If local storage is unavailable or malformed, render default settings without crashing.
- Mark every preview “Maquette conceptuelle — non fonctionnelle” and state that the settings are local to this browser until cloud persistence is implemented.

- [ ] **Step 1: Add view tests for the model-backed controls**
  - Test the pure model, and verify accessible labels and default selections through the repository's existing React test conventions if available.
  - Do not make tests call any external service.

- [ ] **Step 2: Implement the preview component**
  - Use semantic HTML and existing CSS conventions.
  - Provide keyboard-accessible buttons and responsive layout.
  - Render realistic structural components (header, navigation, cards, sections, calls to action) using only dossier content and clearly marked illustrative placeholders.
  - Do not create fake charts with purported real data; use neutral placeholders when the domain needs indicators.

- [ ] **Step 3: Integrate in the active project view**
  - Render the Studio inside the active dossier before the analysis panel.
  - Ensure the portfolio list, auth panel, recommendation editing and deletion flows continue to work.
  - Do not change the AI provider flag or any database schema.

- [ ] **Step 4: Verify**
  - Run `npm test -- --run src/lib/mockup-studio.test.ts`, `npm run typecheck`, `npm test`, and `npm run build`.
  - Expected: all checks pass; the preview can be switched among three formats and survives refresh in the same browser.

- [ ] **Step 5: Commit**
  - Commit message: `feat: add interactive concept mockup studio`.

## Next implementation phase

After the Studio is verified, implement the admin console and quote/realization workflows as separate deliverables. The admin's cross-customer access must not be faked with client-side hiding: choose and verify a server-enforced role and data-access method before showing other users' private dossiers. No service-role secret or RLS change is assumed by this plan.
