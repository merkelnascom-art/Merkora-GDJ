# MerKora GDJ Catalogue Foundation Implementation Plan

> **For agentic workers:** Use the host's available task-by-task implementation workflow. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a typed, deterministic catalogue foundation that reuses MerKora's existing product/domain registry and models versioned offers, valid configurations, included personalization, and immutable order snapshots.

**Architecture:** Keep the existing `solution-catalog.ts` as the canonical product/domain registry. Add pure TypeScript modules for offer definitions and configuration evaluation; no database, payment, external provider, or production deployment is involved. All client-visible choices are checked by deterministic rules, while AI suggestions remain advisory and require client confirmation.

**Tech Stack:** Next.js App Router repository, TypeScript 5.9, Vitest 5.1, GitHub Actions.

## Global Constraints

- Preserve PR #75 and its head commit; work only on `feature/merkora-catalogue-foundation`, based on PR #75 head `641f5f61cfca7a733ec00e57bf3f1f4f93220262`.
- Do not merge any pull request or deploy to production.
- Do not change, migrate, seed, truncate, or delete Supabase data or schema.
- Do not activate paid services, real payment providers, external integrations, GPU jobs, or subscriptions.
- Reuse the existing product IDs and domain IDs in `src/lib/merkora-core/solution-catalog.ts`; do not create competing taxonomies.
- Cover every current product type and domain in the shared foundation. This does not claim that every specialized UI configurator is complete in this phase.
- A client may customize only items explicitly included or allowed by the accepted offer. Out-of-scope changes become separate change requests and may require a reviewed quote.
- Accepted order snapshots are immutable and preserve the offer/configuration/pricing versions.
- AI recommendations never become selected options or commercial approvals without explicit user/admin action.
- Preserve existing DRT, IDP, Screen 05/06/07 behavior and tests.
- Use TDD: observe a focused test failing for the intended behavior before implementing it; then run the identical test and record the pass.
- Keep commits small and reviewable.

---

### Task 1: Define versioned catalogue offers

**Files:**
- Create: `src/lib/merkora-core/catalog-offers.ts`
- Create: `src/lib/merkora-core/catalog-offers.test.ts`
- Reuse: `src/lib/merkora-core/solution-catalog.ts`

**Interfaces:**
- Consume: `SolutionProductTypeId`, `SolutionDomainId`, `SolutionDomainModule`, `getProductType`, `getDomainCatalog`, `buildHybridDomainComposition`.
- Produce: `CatalogOffer`, `CatalogOfferVersion`, `CatalogOfferStatus`, `CatalogPricingMode`, `CatalogOfferModule`, `CatalogOfferValidationIssue`, `validateCatalogOffer(offer)`.

- [ ] **Step 1: Add focused failing tests**

Test that:
1. A published offer with a known product type, known domains, at least one stable module entry, a positive version, and a pricing mode validates.
2. A product type ID absent from the canonical registry is rejected.
3. An unknown domain ID is rejected.
4. An offer module cannot refer to an unknown module.
5. A module marked included and optional at once is rejected.
6. A draft offer is structurally valid but is not customer-orderable.
7. Fixed, rule-based, and quote-required pricing modes remain distinguishable.

- [ ] **Step 2: Verify the relevant failure**

Run: `npm test -- src/lib/merkora-core/catalog-offers.test.ts`  
Expected: test runner reports the new module/export is missing; no syntax/setup error.

- [ ] **Step 3: Implement the minimum behavior**

Define immutable-by-convention typed records and pure validation. Keep validation issues machine-readable with a stable code, path and French-readable message. Validate identifiers against the existing registry. Do not add currency rounding, tax, discounts, or pricing arithmetic in this task.

- [ ] **Step 4: Verify the focused pass**

Run: `npm test -- src/lib/merkora-core/catalog-offers.test.ts`  
Expected: all offer model and validation tests pass.

- [ ] **Step 5: Run affected integration checks**

Run: `npm run typecheck` and `npm test -- src/lib/merkora-core/solution-catalog.test.ts src/lib/merkora-core/catalog-offers.test.ts`  
Expected: TypeScript succeeds and existing catalogue tests remain green.

- [ ] **Step 6: Commit the passing deliverable**

Commit message: `feat: define versioned catalogue offers`.

### Task 2: Evaluate configurations and hybrid module dependencies

**Files:**
- Create: `src/lib/merkora-core/catalog-configuration.ts`
- Create: `src/lib/merkora-core/catalog-configuration.test.ts`
- Reuse: `src/lib/merkora-core/catalog-offers.ts`
- Reuse: `src/lib/merkora-core/solution-catalog.ts`

**Interfaces:**
- Consume: `CatalogOffer`, `CatalogOfferModule`, `SolutionDomainModule`, `buildHybridDomainComposition`.
- Produce: `CatalogConfigurationSelection`, `CatalogConfigurationResult`, `evaluateCatalogConfiguration(offer, selection)`.

- [ ] **Step 1: Add focused failing tests**

Test that:
1. A selection containing only modules included by an offer is accepted.
2. An optional module is accepted only when the offer declares it as optional.
3. A module not declared by the offer is rejected with a stable issue code.
4. A selected module with a missing dependency is rejected and reports the missing dependency.
5. Selecting two domains with a shared module returns one copy of that module.
6. An unknown selected module is rejected, not silently ignored.
7. AI-suggested modules remain unselected unless included in the explicit client selection.

- [ ] **Step 2: Verify the relevant failure**

Run: `npm test -- src/lib/merkora-core/catalog-configuration.test.ts`  
Expected: the missing evaluator export/module causes a focused failure.

- [ ] **Step 3: Implement the minimum behavior**

Evaluate only explicit client selections. Derive domain composition from the canonical registry. Check offer membership and module dependencies deterministically. Return accepted IDs and structured issues; do not mutate the offer or selection. Do not invent incompatibility rules absent from the data.

- [ ] **Step 4: Verify the focused pass**

Run: `npm test -- src/lib/merkora-core/catalog-configuration.test.ts`  
Expected: all selection, dependency and hybrid-deduplication tests pass.

- [ ] **Step 5: Run affected integration checks**

Run: `npm run typecheck` and `npm test -- src/lib/merkora-core/solution-catalog.test.ts src/lib/merkora-core/catalog-offers.test.ts src/lib/merkora-core/catalog-configuration.test.ts`  
Expected: TypeScript succeeds and all catalogue foundation tests pass.

- [ ] **Step 6: Commit the passing deliverable**

Commit message: `feat: validate catalogue configurations`.

### Task 3: Separate included personalization from scope changes and preserve order snapshots

**Files:**
- Create: `src/lib/merkora-core/catalog-order.ts`
- Create: `src/lib/merkora-core/catalog-order.test.ts`
- Reuse: `src/lib/merkora-core/catalog-offers.ts`
- Reuse: `src/lib/merkora-core/catalog-configuration.ts`

**Interfaces:**
- Consume: `CatalogOffer`, `CatalogConfigurationResult`.
- Produce: `CatalogOrderSnapshot`, `CatalogPersonalizationPolicy`, `CatalogChangeRequest`, `classifyCatalogChange(snapshot, change)`, `createCatalogOrderSnapshot(input)`.

- [ ] **Step 1: Add focused failing tests**

Test that:
1. A change to a field explicitly listed as included personalization is classified as `included_personalization`.
2. A request to add a module absent from the accepted snapshot is classified as `scope_change`.
3. A change to an included module's declared configuration field is allowed without changing the purchased module set.
4. An order snapshot records offer ID/version, product type, domains, modules, option IDs, pricing mode and accepted timestamp supplied by the caller.
5. Creating a later offer version does not mutate an earlier snapshot.
6. An unknown change target is classified as `needs_review`, not accepted as included.

- [ ] **Step 2: Verify the relevant failure**

Run: `npm test -- src/lib/merkora-core/catalog-order.test.ts`  
Expected: the missing order/personalization exports cause a focused failure.

- [ ] **Step 3: Implement the minimum behavior**

Represent snapshots as copied plain data with no shared mutable arrays/objects from the source offer or configuration. Classify only fields explicitly permitted by the accepted offer. Treat unknown change targets as review-required. Do not implement payments, invoices, subscriptions or contract acceptance here.

- [ ] **Step 4: Verify the focused pass**

Run: `npm test -- src/lib/merkora-core/catalog-order.test.ts`  
Expected: personalization, scope-change and immutability tests pass.

- [ ] **Step 5: Run affected integration checks**

Run: `npm run typecheck` and `npm test -- src/lib/merkora-core/catalog-offers.test.ts src/lib/merkora-core/catalog-configuration.test.ts src/lib/merkora-core/catalog-order.test.ts`  
Expected: TypeScript succeeds and all three domain modules pass.

- [ ] **Step 6: Commit the passing deliverable**

Commit message: `feat: preserve catalogue order scope`.

### Task 4: Verify universal business scenarios and publish the implementation record

**Files:**
- Create: `src/lib/merkora-core/catalogue-foundation-scenarios.test.ts`
- Modify: `docs/specs/2026-11-24-merkora-catalogue-foundation-design.md`
- Modify: `README.md` only if the documented verification commands or scope summary need a concise addition.

**Interfaces:**
- Consume: all public offer, configuration and order APIs from Tasks 1–3.
- Produce: regression evidence for Aéro Service, WALL Trade, Ginesse de Paris Center Work, Student Vision and an architecture project.

- [ ] **Step 1: Add focused failing scenario tests**

Use synthetic in-memory offers to prove:
1. Aéro Service can combine attendance, reservation and business management without confusing check-in with booking.
2. WALL Trade can combine commerce and business management without duplicating shared modules.
3. Ginesse de Paris Center Work can combine commerce and finance while retaining separate service-price and financial concepts.
4. Student Vision can combine education and quiz/assessment functions without becoming a school-management system by assumption.
5. Architecture can use the architecture workspace product and architecture domain modules.
6. All currently registered product types and domains are addressable through the canonical registry.

- [ ] **Step 2: Verify the relevant failure**

Run: `npm test -- src/lib/merkora-core/catalogue-foundation-scenarios.test.ts`  
Expected: at least one missing scenario/API assertion fails for the intended reason before implementation.

- [ ] **Step 3: Implement only required integration corrections**

Correct registry composition or API seams only where scenario evidence proves a gap. Do not add unrequested business rules to make a synthetic scenario pass.

- [ ] **Step 4: Verify the focused pass**

Run: `npm test -- src/lib/merkora-core/catalogue-foundation-scenarios.test.ts`  
Expected: all five business scenarios and full registry coverage pass.

- [ ] **Step 5: Run complete repository verification**

Run: `npm run typecheck`, `npm test`, and `npm run build`.  
Expected: all checks exit 0; existing DRT, IDP and Screen 05/06/07 tests remain green.

- [ ] **Step 6: Commit the passing deliverable**

Commit message: `test: verify universal catalogue foundation`.

---

## Unresolved external decisions

These are intentionally outside this first foundation and must be decided before the corresponding later implementation:
- Exact commercial prices, FCFA tax treatment, discounts and recurring-fee policy.
- Final offer inventory, published names, demonstrations, commercial terms and delivery estimates.
- Exact field-by-field personalization list for each published offer.
- Full specialized configurator question sets and sector-specific constraints.
- Supabase persistence schema, RLS policies and migration plan.
- Payment providers, verification webhooks, refund policy and production launch controls.
