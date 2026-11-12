# Architecture decision — applications generated and operated by MerKora

- **ID:** ADR-002
- **Status:** Proposed
- **Date:** 2026-11-12
- **Scope:** MerKora GDJ factory and every application delivered by it

## Context

MerKora must not depend on an operator manually creating each customer's application, administrator account, user accounts, or follow-up workflow. The factory is responsible for generating, configuring, testing, delivering, and (when included in the offer) hosting and maintaining each solution.

At the time this decision was drafted, the generator had two different maturity levels:
- The Asho Sweet vertical template already had a Supabase-backed catalogue, products, custom requests, and orders.
- The generic module workspace was initially a browser-local prototype.
- The Asho Sweet customer-account and order-history migration was being added.
- The generic persistent runtime and its owner/admin RLS are now implemented (see implementation updates below), but staff invitations and granular project roles are still outstanding.

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

- Générateur générique version `merkora-nextjs-scaffold/1.7.0` : les modules standards n'utilisent plus `localStorage` comme stockage métier. Ils se connectent à Supabase Auth et enregistrent leur état dans `project_module_data`, avec `project_id` et `module_id` explicites.
- Le compte propriétaire peut retrouver et modifier les données du module depuis plusieurs appareils. À cette première étape, les règles RLS limitaient l'accès au propriétaire et à l'administration MerKora. Cette limite a été levée par l'extension équipe décrite dans la mise à jour du 12 novembre ci-dessous.
- Migration `20261112135510_project_module_data` appliquée au projet Supabase `tvwkickjtqjqwoiidmxj`. Vérification : table présente, RLS activé, trois politiques de lecture/création/mise à jour présentes.
- Preview Vercel du commit `09e13ca95abc90e1f3be4b0e6e119ffc8a32fd8f` : `READY`, 63 fichiers de tests réussis, 311 tests réussis et build Next.js terminé.
- Les données Asho Sweet restent inchangées ; aucun lancement Sandbox ni déploiement de production n'a été effectué.


## Implementation update — generic persistent runtime — 2026-11-12

- Générateur `merkora-nextjs-scaffold/1.7.0` : les modules génériques ne reposent plus sur `localStorage` pour leurs données métier.
- Chaque espace de module reçoit l'identifiant réel du projet et l'identifiant du module ; il lit et enregistre son état dans `project_module_data` avec une clé composite projet/module.
- Le propriétaire se connecte avec Supabase Auth. L'interface permet de récupérer les données et d'enregistrer explicitement les modifications.
- Les variables Supabase publiques et la dépendance `@supabase/supabase-js` sont maintenant incluses dans tous les projets générés, pas uniquement dans le template boutique.
- Migration appliquée au projet Supabase MerKora `tvwkickjtqjqwoiidmxj` : `20261112135510_project_module_data`.
- Contrôle en base : table présente, RLS activé, trois politiques (lecture, insertion et mise à jour) limitées au propriétaire du projet et à l'administrateur MerKora ; aucun droit DELETE accordé aux applications générées.
- Test transactionnel contrôlé : le propriétaire peut créer et relire un état de module ; un autre identifiant utilisateur ne voit pas cet état ; la transaction a été annulée et le nombre de lignes de test après rollback est resté à zéro.
- Limites assumées de cette première étape : les membres du personnel et invitations d'équipe ne sont pas encore provisionnés ; le workspace générique reste une liste d'actions persistante, pas encore un module métier spécialisé. La fabrique ne doit donc pas qualifier ces applications de solutions métier entièrement terminées sur la seule base de ce runtime.
- Contrôles CI sur le commit `9f3e9118089050fa83edecefc4688cac9429164e` : typecheck et tests unitaires terminés avec succès ; le build de production est encore en cours au moment de cette mise à jour.


## Implementation update — owner-managed teams and public access — 2026-11-12

- Générateur générique version `merkora-nextjs-scaffold/1.8.0` : chaque application générée reçoit un espace `/team` pour la propriétaire, avec connexion, invitation par email, sélection des modules, droits consultation/modification, liste des invitations et révocation.
- La propriétaire reste la seule personne autorisée à inviter, attribuer ou révoquer les collaborateurs. L'inscription client ne crée jamais une appartenance à l'équipe.
- Les invitations utilisent trois Edge Functions préparées dans le dépôt : `project-team-invite`, `project-team-accept`, `project-team-revoke`. Elles vérifient le JWT et l'email confirmé ; l'invitation est activée uniquement pour l'adresse invitée. Les fonctions sont protégées par `verify_jwt = true`.
- Une page MerKora d'activation d'invitation permet à un nouveau collaborateur de définir son mot de passe puis d'accepter l'invitation. Un compte existant peut se connecter à l'application et activer l'invitation depuis `/team`.
- Migration appliquée au projet Supabase `tvwkickjtqjqwoiidmxj` : `20261112163000_project_team_memberships`. Les tables `project_team_memberships` et `project_team_module_permissions` ont RLS activé. Les collaborateurs n'ont aucun droit tant qu'une invitation n'est pas acceptée.
- Les modules génériques accordent lecture ou modification à partir de la combinaison projet/membre/module. La révocation bloque les lectures et écritures ultérieures via RLS.
- Asho Sweet : tout visiteur peut consulter le catalogue d'une boutique publiée et les produits actifs sans compte. Le catalogue reste vide et la boutique non publiée tant que la propriétaire n'a pas ajouté ses propres créations et tarifs et choisi de publier.
- Asho Sweet : la propriétaire garde le contrôle de la publication et de l'équipe. Les collaborateurs peuvent recevoir des droits limités sur le catalogue, les commandes ou les demandes personnalisées. Les mises à jour de commandes/demandes sont limitées à la colonne de statut ; les employés ne peuvent pas modifier les montants ni l'identité du client.
- Photos de référence privées : lecture client/propriétaire conservée ; un collaborateur ne peut les consulter que si la propriétaire lui attribue la consultation des demandes personnalisées. Les photos de produits restent des médias publics de catalogue, mais leur téléversement exige un droit de modification du catalogue.
- Tests transactionnels sur la base : un collaborateur lecture seule lit son module mais ne peut pas le modifier ; un collaborateur en modification peut écrire dans son module ; un module sans droit est invisible ; une révocation supprime l'accès. La transaction a été annulée et les lignes de test sont revenues à zéro.
- Test public transactionnel : un visiteur anonyme voit un produit actif lorsque la boutique est temporairement publiée, ne voit pas un produit inactif ; après rollback, la boutique est restée non publiée et aucune ligne temporaire ne subsiste.
- Les Edge Functions et les nouveaux écrans sont enregistrés sur la branche `feature/admin-owned-factory-planning`, mais ils ne sont pas encore déployés sur Supabase ni livrés en production. Le merge de la PR #13 et le déploiement de production restent soumis à une autorisation explicite.
- Prérequis de livraison : l'envoi des emails d'invitation dépend de la configuration SMTP de Supabase Auth et de l'URL de redirection autorisée. Si nécessaire, configurer `MERKORA_INVITE_REDIRECT_URL` vers la page d'activation MerKora.
- Contrôle Supabase Security Advisor : un avertissement préexistant indique que la protection contre les mots de passe compromis est désactivée. Ce paramètre Auth global n'a pas été modifié dans cette migration.
- Vérification CI/build de cette dernière série de changements : en attente. Aucun déploiement Vercel Preview de cette version 1.8.0 n'a encore été effectué.
