# Architecture decision — applications generated and operated by MerKora

- **ID:** ADR-002
- **Status:** Proposed
- **Date:** 2026-11-12
- **Scope:** MerKora GDJ factory and every application delivered by it

## Context

MerKora must not depend on an operator manually creating each customer's application, administrator account, user accounts, or follow-up workflow. The factory is responsible for generating, configuring, testing, delivering, and (when included in the offer) hosting and maintaining each solution.

The current generator has two different maturity levels:
- The Asho Sweet vertical template has a real Supabase-backed catalogue, products, custom requests, and orders.
- The generic module workspace still stores task lists in browser localStorage. It is a prototype, not a shared operational application.
- The existing `project_module_data` migration is explicitly staged only and has owner/admin-only RLS. It is not yet a general end-user membership system.
- Asho Sweet orders currently have no customer account ownership field or customer-facing order-history screen. A submitted guest order cannot safely become a private account-tracked order without a schema and access-model change.

These distinctions must be visible to the factory's quality gate. A generated UI must never be labelled a complete deliverable merely because it builds.

## Decision

MerKora will own a repeatable, project-scoped delivery lifecycle. Every generated project receives its own tenant boundary, owner administrator, end-user access model, persistent data services, and operational handover.

### 1. Project provisioning

After quote acceptance, required payment validation, official launch, approved scope, and internal execution authorization, the factory must:
1. create a unique project tenant and immutable project identifier;
2. bind the customer owner identity to that project;
3. provision the first owner-admin access using an invitation or secure account activation flow (never a hard-coded password);
4. provision the required database schema, storage buckets, policies, and application configuration;
5. generate the application from the approved module scope;
6. run tests, security checks, and a preview acceptance review;
7. publish/deploy only after the applicable human approvals;
8. issue the owner handover, end-user access instructions, and project follow-up entry.

### 2. Roles and access

The standard model distinguishes:
- **MerKora platform administrator:** controls factory planning, delivery gates, platform billing, support and project lifecycle; cannot silently become the customer's business owner.
- **Project owner administrator:** manages the delivered application, settings, staff invitations, content and business data.
- **Project staff/member:** receives only the permissions granted by the project owner.
- **End customer/user:** can register or sign in where the product requires it, perform permitted actions, and view only their own records (for example their own orders and status).
- **Public visitor:** can access only intentionally public pages and published content.

Authorization must be enforced server-side and by database/storage RLS, not by hiding UI controls or trusting editable user metadata. Membership is scoped to a single project. No customer may see another project's data.

### 3. Persistent application runtime

Generated operational modules must not silently fall back to localStorage for shared business data. They must use a project-scoped persistent API/database model with:
- authenticated identity and project membership;
- explicit role/permission checks;
- validated writes and server/database-computed totals;
- audit timestamps and actor identity;
- scoped file uploads and private reference assets;
- documented backup, retention, export and deletion policies.

Browser storage is permitted only for temporary UX state (such as a cart draft), never as the sole store for business records.

### 4. Customer-facing workflows

Where the approved project scope includes accounts:
- users can register/sign in and recover access;
- each user can see their own activity, requests, orders, files and status;
- owners/admins can see and process all project records;
- status changes are recorded and reflected to the correct user;
- uploaded reference photos are private and accessible only to the submitting user and authorized project staff.

For Asho Sweet, the intended journey is:
- the owner adds her own creations, images, descriptions and real FCFA prices;
- the public catalogue remains empty until she adds and publishes real products;
- customers can browse published products, place orders, and attach an inspiration photo to a custom request;
- customers with an account can track only their own orders/requests;
- the owner manages the catalogue and updates order/request statuses from her owner workspace.

### 5. Factory quality gates

The factory must distinguish at least:
- **Prototype/scaffold:** visual or local-only behavior; never deliver as production-ready.
- **Integrated preview:** real persistence and auth wired, tests/build pass, security review pending or in progress.
- **Delivery candidate:** tenant isolation, owner access, end-user access, critical workflows, storage/RLS, build and tests verified.
- **Delivered/operational:** approvals complete, production deployment verified, owner handover completed, monitoring/support lifecycle recorded.

The human delivery review must fail closed if the app uses local-only persistence for required business data, has no owner provisioning, lacks required end-user access, has unverified RLS/storage policies, or has no customer-facing status tracking where requested.

## Alternatives considered

1. **Manual setup per customer:** rejected; it does not scale and makes delivery dependent on ad hoc human steps.
2. **One shared admin login for all customers:** rejected; it breaks tenant isolation and accountability.
3. **UI-only roles:** rejected; users could bypass the UI and call the data API directly.
4. **localStorage-only generic modules:** rejected for operational delivery; it is device-local and cannot support teams, multiple devices, or reliable follow-up.

## Security and privacy constraints

- No service-role/secret key in generated browser code.
- No authorization based on user-editable metadata.
- All tenant-owned records carry a project/tenant reference and are checked against authenticated membership.
- Customer records are private by default; public access is explicit and limited to published content.
- Private inspiration uploads use private storage and short-lived signed URLs.
- Admin operations are auditable; customer consent for external AI processing remains separate from internal factory authorization.
- Existing business data must be preserved during additive migrations; destructive resets are prohibited without a separate explicit approval.

## Rollout

1. **Asho Sweet completion:** add customer identity/ownership and a private order/request tracking screen; verify owner-vs-customer RLS and private photo access. Keep the catalogue owner-managed and initially empty.
2. **Generic runtime:** replace generic localStorage-only module lists with a project-scoped persistent runtime and a first-class membership/role model.
3. **Provisioning automation:** make the factory create the owner invitation, project configuration, environment bindings, deployment record, and handover automatically.
4. **Delivery gate:** require automated evidence for build, tests, tenant isolation, RLS/storage, owner access, end-user access, and status tracking before human approval.
5. **Lifecycle operations:** track deployment health, support, maintenance plan, subscription state, and customer follow-up from MerKora admin.

## Acceptance criteria

- A new project can be created from an approved request without an operator manually assembling its tenant or accounts.
- The named customer receives owner-admin access through a secure activation flow.
- The owner can invite project users and assign scoped permissions.
- An end user can sign in and see only their own permitted records.
- Two generated projects with identical modules cannot read or mutate one another's records.
- Business data survives browser/device changes and is not stored solely in localStorage.
- The factory refuses delivery when any required access, persistence, security or workflow check is missing.
- Preview and production deployment are separate, approval-controlled actions.


## Implementation update — 2026-11-12

- Générateur storefront version `merkora-nextjs-scaffold/1.6.0` : le parcours Asho Sweet ajoute un espace client avec inscription, connexion, liste des commandes, suivi des statuts, demandes personnalisées et accès à la photo d'inspiration.
- Les commandes et demandes envoyées pendant une session authentifiée sont associées à `auth.uid()` par un déclencheur PostgreSQL ; le navigateur ne peut pas choisir le propriétaire de l'enregistrement.
- Les politiques RLS autorisent chaque client authentifié à lire uniquement ses propres commandes et demandes ; les droits du propriétaire restent limités à son projet.
- Les photos de référence restent dans le bucket privé ; le client concerné et le propriétaire peuvent obtenir des URL signées pour leurs propres demandes.
- Migrations appliquées au projet Supabase MerKora `tvwkickjtqjqwoiidmxj` :
  - `20261112133837_secure_storefront_updates_and_photo_uploads`
  - `20261112133842_add_customer_accounts_and_order_tracking`
- Vérification en base : colonnes de liaison client, colonne du chemin photo, buckets public/privé, politiques RLS et déclencheurs présents.
- Vérification des données Asho Sweet après migration : 0 produit, 0 commande et 0 demande ; aucun enregistrement métier préexistant n'a été modifié.
- Le catalogue Asho Sweet reste volontairement non publié et vide. La propriétaire devra ajouter ses propres réalisations, photos et tarifs.
- Limite restante : les modules génériques hors template boutique utilisent encore le prototype localStorage. Ils ne doivent pas être livrés comme des espaces de travail multi-utilisateurs opérationnels avant l'implémentation du runtime persistant commun.
- La Preview Vercel du commit `213551cd3f57bdd01992b3365dacab01660c5d3a` a terminé READY avec 62 fichiers de tests et 307 tests réussis, puis le build Next.js a abouti. Cette vérification ne remplace pas l'audit de l'artefact généré.

- Preview Vercel de la branche sur le commit `213551cd3f57bdd01992b3365dacab01660c5d3a` : état `READY`.
- Contrôle de compilation exécuté par Vercel : 62 fichiers de tests réussis, 307 tests réussis, puis build Next.js terminé.
- Cette vérification porte sur le dépôt MerKora et la génération du code ; l'artefact Asho Sweet doit encore être régénéré avec le générateur 1.6.0 et soumis à sa revue humaine avant toute livraison.
