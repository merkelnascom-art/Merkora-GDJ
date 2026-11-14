# Project team and public access — design specification

- Date: 2026-11-12
- Project: MerKora GDJ
- Branch: `feature/admin-owned-factory-planning`
- Status: approved direction from the project owner; implementation plan follows.

## Goal

Every application delivered by MerKora has a public-facing access model where intended public content is available without an account, while the business owner alone decides who joins the internal team and what each invited person can access.

## Product rules

### Public visitors and customers

- Published public pages are readable without signing in.
- For Asho Sweet, anyone may browse the published shop, catalogue, product photos, descriptions, and prices.
- The catalogue is owner-managed. It starts empty and unpublished until the owner adds real creations and explicitly publishes the shop.
- A visitor may submit a guest order or custom request where the workflow allows it.
- A customer account is optional for browsing and ordering. Signing in gives the customer private access to their own orders, custom requests, and reference photos.
- Public users never gain access to owner tools, employee workspaces, unpublished products, internal records, or other customers' records.

### Owner and team

- The project owner receives the initial owner-admin account through MerKora's secure provisioning flow.
- Only the owner can invite employees or other collaborators to that project.
- Staff access is invitation-only; there is no self-service path to become a project employee.
- Invitations are sent to a specified email address. The invited person must activate/sign in with that email before membership becomes active.
- The owner chooses which project modules the invited person can access and whether the person can view or edit those modules.
- The owner can review, change, and revoke memberships. Revocation must immediately block future database/API access through RLS, not merely hide the UI.
- The MerKora platform administrator retains platform support and delivery controls, but does not become the customer's business owner or silently add staff.

## Recommended first role model

- **Owner:** full project control, including catalogue, staff, configuration, orders, and all modules.
- **Collaborator:** access only to modules selected by the owner; each module grant is either view-only or edit.
- **Customer:** public browsing and own customer records only.
- **Public visitor:** published public content only.

This intentionally avoids inventing many fixed job titles. The owner can invite a person and choose the modules and access level that match the actual job.

## Architecture

- Keep public storefront reads separate from authenticated owner/staff workspaces.
- Add project-scoped membership and invitation records; never store authorization in user-editable profile metadata.
- Use a server-side Supabase Edge Function for owner-authorized invitations, using the authenticated caller JWT to identify the owner and a server-only Auth Admin client to send the invite. Never expose the service-role key to generated browser code.
- Bind invitation acceptance to a verified authenticated email matching the pending invitation. Do not activate membership based only on a browser-supplied user ID or role.
- Add RLS membership predicates to project-scoped module data and storefront management tables. Owner-only writes remain owner-only unless a staff grant explicitly permits them.
- For the generic JSON module store, module-level view/edit is the initial permission boundary. More granular record-level permissions can be added only when a real module requires them.
- Public storefront policies expose only published storefront metadata and active products. Customer order/request policies continue to restrict private history to the submitting customer and the store owner/authorized staff.

## Asho Sweet public journey

1. Anyone opens the published Asho Sweet website without signing in.
2. They browse the real creations, photos, descriptions, and prices entered by the owner.
3. They can submit a guest order/custom request; an account is not required just to consult the site.
4. A signed-in customer can see only their own orders and requests.
5. The owner signs into the private management area to add/edit/deactivate products, publish/unpublish the catalogue, manage orders, and invite chosen workers.
6. Invited workers see only the management modules and view/edit rights assigned by the owner.

## Security and privacy

- All authorization decisions are enforced by database RLS and server-side functions.
- No role is trusted from `user_metadata`, URL parameters, client-side state, or a submitted form.
- The invitation endpoint checks that the caller owns the target project before sending any invite.
- A pending invite does not grant data access; access begins only after verified acceptance.
- Revoked members lose access on subsequent requests even if their UI remains open.
- Public access is limited to published storefront records and active products. Orders, customer details, private reference photos, staff lists, and module state are never public.
- Existing projects, products, orders, and customer records are preserved. All schema changes are additive.
- No production deployment, merge, destructive reset, or paid Sandbox run is implied by this design.

## Acceptance criteria

- Anonymous visitors can load a published storefront and read only its active public products.
- Anonymous visitors cannot read owner data, unpublished products, orders, requests, staff membership, or module data.
- A project owner can invite an email address and choose modules plus view/edit level.
- An uninvited authenticated user cannot access the project as staff.
- A pending invitation grants no access before verified acceptance.
- An accepted collaborator can read only modules granted to them and can write only where edit access is granted.
- A revoked collaborator is denied by RLS on their next request.
- The owner can manage Asho Sweet products and workers; public visitors cannot access those controls.
- Customers can continue to browse without signing in and can track only their own customer records after signing in.
