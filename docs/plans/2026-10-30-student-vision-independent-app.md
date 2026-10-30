# Student Vision — plan d’implémentation de l’application indépendante

> **For agentic workers:** Use the host's available task-by-task implementation workflow. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construire Student Vision comme une application web autonome pour l’orientation après le BAC, tout en permettant à l’administration MerKora GDJ de suivre chaque étape du projet depuis son lancement jusqu’à sa livraison.

**Architecture:** Student Vision est une application Next.js indépendante dans le monorepo, isolée dans `apps/student-vision/` et déployable avec son propre projet Vercel Preview. MerKora GDJ reste le plan de contrôle : il conserve le dossier commercial et expose une vue administrative des événements, jalons, versions et livrables Student Vision. Les deux applications échangent par des API serveur authentifiées et des identifiants de projet explicites ; elles ne partagent pas leur interface ni leurs secrets.

**Tech Stack:** Next.js App Router, React, TypeScript, Vitest, Supabase Auth/Postgres/RLS, GitHub et Vercel Preview. Le fournisseur IA est optionnel et reste côté serveur ; le parcours étudiant doit fonctionner en mode déterministe lorsque l’IA n’est pas configurée.

## Global Constraints

- Développer uniquement sur la branche `feature/admin-preview-secure-access` du dépôt `merkelnascom-art/Merkora-GDJ`.
- Créer Student Vision dans `apps/student-vision/` comme application indépendante et séparément déployable ; ne pas remplacer MerKora GDJ.
- Déployer et vérifier uniquement des aperçus Vercel. Ne pas promouvoir ni déployer en production.
- Ne pas modifier `main`, les paramètres ou variables de production, ni les autres projets Vercel.
- Ne supprimer, réinitialiser, tronquer ou écraser aucune donnée Supabase existante. Toute évolution de schéma doit être additive, documentée et limitée à des objets Student Vision nommés explicitement.
- Ne modifier aucune facture, déclaration de paiement, revue de paiement ou historique de lancement déjà enregistré.
- Ne créer aucune facture ni déclaration de paiement réelle dans le cadre du développement Student Vision.
- Une déclaration Mobile Money reste une déclaration du client ; seul un administrateur vérifiant le reçu peut la confirmer. Ne jamais confirmer automatiquement un paiement.
- Ne jamais demander ni stocker PIN, OTP ou mot de passe Mobile Money.
- Le compte administrateur `merkelnascom@gmail.com` peut être utilisé comme compte pilote pour observer le parcours complet ; il ne doit pas être reclassé en compte client.
- Le lancement administratif existant de Student Vision est déjà enregistré sous la référence `MK-MVS0DJXN-WV60`. Le montant confirmé à ce lancement était de 205 000 FCFA pour un montant requis de 205 000 FCFA. Cela prouve le lancement administratif, pas la construction ni la livraison du produit.
- Le concept visuel enregistré pour Student Vision est actuellement un brouillon : aucun module ni choix de recommandation n’est enregistré comme sélectionné. Ne pas prétendre que le client a validé une maquette ou des options qui ne sont pas présentes dans les données.
- Les recommandations d’orientation doivent être présentées comme exploratoires et non comme une décision scolaire, médicale, psychologique ou professionnelle définitive. Expliquer les limites et encourager la vérification auprès des établissements et conseillers compétents.
- Minimiser les données personnelles des élèves. Ne collecter aucun bulletin ou document scolaire réel avant d’avoir défini les autorisations, la durée de conservation, les accès et le consentement appropriés.
- Chaque étape doit être vérifiable. Rapporter séparément les tests passés, les tests non exécutés et les dépendances non configurées.

---

## Décisions de produit

### Rôle de chaque application

**MerKora GDJ — centre de pilotage administratif**
- Conserve le dossier commercial, le devis et l’historique de lancement existants.
- Affiche Student Vision comme projet de réalisation associé à la référence MerKora.
- Permet à l’administrateur de consulter les jalons, versions, demandes de modification, événements techniques et liens Preview.
- Permet de consigner les décisions administratives et les notes internes sans les exposer à l’espace étudiant.
- Affiche clairement la différence entre statut commercial MerKora, avancement technique Student Vision et validation du client.

**Student Vision — produit livré au client**
- Présente un parcours étudiant distinct de l’interface MerKora.
- Permet de créer un profil d’orientation, répondre à des questionnaires, réaliser des exercices et consulter des pistes de métiers/formations.
- Peut proposer une analyse des résultats scolaires uniquement après validation du cadre de confidentialité et des droits d’accès.
- Affiche les résultats, les raisons, les incertitudes, les compétences à explorer et les prochaines étapes.
- Dispose d’un espace de gestion pour les responsables autorisés de Student Vision, séparé de l’espace MerKora.

### Référence de liaison

- Référence MerKora existante : `MK-MVS0DJXN-WV60`.
- Identifiant externe Student Vision : UUID propre à l’application.
- Chaque événement transmis à MerKora contient au minimum : identifiant du projet Student Vision, référence MerKora, type d’événement, date UTC, auteur/acteur, identifiant de version et résumé non sensible.
- Les contenus détaillés des réponses étudiantes et documents scolaires ne sont pas copiés dans le journal MerKora. L’administration voit l’état et les métadonnées nécessaires, et ouvre Student Vision avec une autorisation dédiée si elle doit consulter un contenu autorisé.

### États distincts

- Projet MerKora : conserver les statuts commerciaux existants.
- Réalisation Student Vision : `not_started`, `planning`, `designing`, `building`, `testing`, `client_review`, `changes_requested`, `ready_for_delivery`, `delivered`, `blocked`.
- Revue du concept : `draft`, `ready_for_review`, `changes_requested`, `approved`.
- Ces états ne se substituent jamais les uns aux autres. Une validation de concept n’est ni une validation de devis, ni un paiement, ni une livraison.

---

### Task 1: Isoler l’application Student Vision et ses fondations

**Files:**
- Create: `apps/student-vision/package.json` — scripts et dépendances propres à l’application, alignés sur les versions déjà utilisées dans le dépôt.
- Create: `apps/student-vision/next.config.ts` — configuration Next.js isolée.
- Create: `apps/student-vision/tsconfig.json` — résolution TypeScript propre à l’application.
- Create: `apps/student-vision/app/layout.tsx` — layout, métadonnées et styles globaux Student Vision.
- Create: `apps/student-vision/app/page.tsx` — page d’accueil produit.
- Create: `apps/student-vision/src/lib/config.ts` — lecture et validation des variables serveur/publiques autorisées.
- Create: `apps/student-vision/README.md` — démarrage, tests, variables et limites du prototype.
- Test: `apps/student-vision/src/lib/config.test.ts`.

**Interfaces:**
- Consumes: Node/npm et versions de Next/React déjà présentes dans le dépôt racine.
- Produces: application Student Vision exécutable indépendamment depuis son répertoire et construisible par Vercel avec `rootDirectory=apps/student-vision`.

- [ ] **Step 1: Add the focused failing test**

Écrire des tests de configuration qui vérifient :
1. le mode démo fonctionne sans clé IA ;
2. une URL Supabase absente désactive proprement les fonctions cloud sans faire planter la page d’accueil ;
3. une variable secrète n’est jamais exposée dans un objet de configuration client ;
4. une configuration incomplète affiche un état explicite plutôt qu’un faux succès.

- [ ] **Step 2: Verify the relevant failure**

Run: `cd apps/student-vision && npm test -- --run src/lib/config.test.ts`

Expected: échec initial car les fichiers et fonctions de configuration n’existent pas encore.

- [ ] **Step 3: Implement the minimum behavior**

Créer le squelette Next.js isolé. Définir les scripts `dev`, `build`, `start`, `typecheck` et `test`. Ne pas importer le layout, les composants ou le stockage local de MerKora dans l’application étudiante. La page d’accueil doit afficher le nom Student Vision, la finalité « explorer des pistes d’orientation après le BAC » et un avertissement clair : les résultats sont des pistes de réflexion, pas une décision automatique.

- [ ] **Step 4: Verify the focused pass**

Run: `cd apps/student-vision && npm test -- --run src/lib/config.test.ts`

Expected: tous les tests de configuration passent.

- [ ] **Step 5: Run the affected integration check**

Run: `cd apps/student-vision && npm run typecheck && npm run build`

Expected: application compilée indépendamment sans importer les routes de MerKora.

- [ ] **Step 6: Commit the passing deliverable**

```bash
git add apps/student-vision
git commit -m "feat(student-vision): scaffold independent app"
```

---

### Task 2: Construire le parcours d’orientation étudiant

**Files:**
- Create: `apps/student-vision/src/domain/student-profile.ts` — types du profil et du consentement.
- Create: `apps/student-vision/src/domain/questionnaire.ts` — questions, réponses et versionnement du questionnaire.
- Create: `apps/student-vision/src/domain/orientation-engine.ts` — moteur de correspondance explicable.
- Create: `apps/student-vision/src/domain/orientation-engine.test.ts`.
- Create: `apps/student-vision/app/espace/page.tsx` — espace étudiant.
- Create: `apps/student-vision/app/questionnaire/page.tsx` — questionnaire progressif.
- Create: `apps/student-vision/app/resultats/page.tsx` — résultats et pistes.
- Create: `apps/student-vision/src/components/interest-questionnaire.tsx` — interface de questions.
- Create: `apps/student-vision/src/components/orientation-results.tsx` — affichage des pistes et justifications.

**Interfaces:**
- Consumes: `StudentProfile`, `QuestionnaireDefinition`, `QuestionAnswer`.
- Produces: `OrientationAssessment` avec `suggestions`, `reasons`, `uncertainties`, `nextSteps` et `questionnaireVersion`.

- [ ] **Step 1: Add the focused failing test**

Tester des profils contrastés (intérêt scientifique, relationnel, créatif, organisationnel et profil mixte) et vérifier :
1. le moteur retourne plusieurs familles de pistes lorsqu’il existe plusieurs correspondances ;
2. chaque piste contient au moins une raison traçable vers les réponses ;
3. une réponse manquante augmente l’incertitude au lieu d’être inventée ;
4. aucun score n’est présenté comme une probabilité de réussite ou une vérité sur l’élève ;
5. deux versions du questionnaire conservent des identifiants de version distincts.

- [ ] **Step 2: Verify the relevant failure**

Run: `cd apps/student-vision && npm test -- --run src/domain/orientation-engine.test.ts`

Expected: échec initial car le moteur d’orientation n’existe pas.

- [ ] **Step 3: Implement the minimum behavior**

Créer un questionnaire versionné avec intérêts, matières appréciées, activités, environnement de travail préféré, compétences que l’élève souhaite développer et contraintes déclarées. Le moteur doit être déterministe et explicable pour le premier pilote. Il produit des familles de métiers et des pistes de formation à explorer, les raisons associées, les informations manquantes et les questions de suivi. Les exercices/rébus sont des activités de réflexion, pas des tests psychométriques certifiés. Ne pas intégrer d’analyse de bulletin dans cette tâche.

- [ ] **Step 4: Verify the focused pass**

Run: `cd apps/student-vision && npm test -- --run src/domain/orientation-engine.test.ts`

Expected: tous les cas de profils, d’incertitude et de versionnement passent.

- [ ] **Step 5: Run the affected integration check**

Run: `cd apps/student-vision && npm run typecheck && npm test`

Expected: les pages utilisent les types du domaine et tous les tests passent.

- [ ] **Step 6: Commit the passing deliverable**

```bash
git add apps/student-vision
git commit -m "feat(student-vision): add explainable orientation flow"
```

---

### Task 3: Ajouter la persistance et les accès séparés

**Files:**
- Create: `apps/student-vision/src/server/auth.ts` — vérification de session côté serveur.
- Create: `apps/student-vision/src/server/student-repository.ts` — accès aux données via Supabase.
- Create: `apps/student-vision/app/api/student/profile/route.ts` — profil de l’élève.
- Create: `apps/student-vision/app/api/student/assessment/route.ts` — sauvegarde et lecture des évaluations.
- Create: `apps/student-vision/supabase/migrations/20261030_student_vision_initial.sql` — migration additive propre à Student Vision, à appliquer uniquement après revue.
- Create: `apps/student-vision/src/server/student-repository.test.ts`.
- Modify: `apps/student-vision/README.md` — schéma, RLS et configuration de l’environnement.

**Interfaces:**
- Consumes: session Supabase Auth, `StudentProfile`, `OrientationAssessment`.
- Produces: opérations serveur limitées au propriétaire du profil ; aucune lecture directe inter-élèves.

- [ ] **Step 1: Add the focused failing test**

Tester :
1. un étudiant authentifié peut lire et modifier uniquement son profil ;
2. un autre étudiant ne peut ni lire ni modifier ce profil ;
3. un visiteur non authentifié reçoit 401 sur les routes privées ;
4. une requête avec un identifiant de propriétaire fourni par le navigateur ne peut pas changer le propriétaire réel ;
5. une réponse invalide est refusée sans écraser les données déjà enregistrées.

- [ ] **Step 2: Verify the relevant failure**

Run: `cd apps/student-vision && npm test -- --run src/server/student-repository.test.ts`

Expected: échec initial car le dépôt sécurisé n’existe pas.

- [ ] **Step 3: Implement the minimum behavior**

Inspecter les tables, fonctions, règles RLS et conventions Auth déjà présentes dans le projet Supabase lié à MerKora avant toute migration. Réutiliser l’authentification existante uniquement si l’isolation des rôles et des données peut être prouvée ; sinon, garder les fonctions cloud désactivées dans ce pilote et documenter la décision avant de créer un nouveau projet Supabase. Si la migration est validée, créer uniquement des tables préfixées `student_vision_`, activer RLS, appliquer les politiques de propriétaire et n’ajouter aucun accès global. Ne pas inclure de notes de bulletin, pièces jointes ou données d’un mineur avant définition des consentements et de la conservation. Toute migration est additive ; aucune modification de table MerKora existante n’est autorisée dans cette tâche.

- [ ] **Step 4: Verify the focused pass**

Run: `cd apps/student-vision && npm test -- --run src/server/student-repository.test.ts`

Expected: tests d’autorisation et de propriété réussis avec les politiques vérifiées.

- [ ] **Step 5: Run the affected integration check**

Run: `cd apps/student-vision && npm run typecheck && npm test && npm run build`

Expected: toutes les vérifications passent. Après toute migration autorisée, exécuter une requête de lecture de vérification et les contrôles d’advisors Supabase ; ne pas lancer la migration si la cible ou les politiques ne sont pas confirmées.

- [ ] **Step 6: Commit the passing deliverable**

```bash
git add apps/student-vision
git commit -m "feat(student-vision): add isolated student persistence"
```

---

### Task 4: Relier Student Vision au contrôle administratif MerKora

**Files:**
- Create: `apps/student-vision/src/server/merkora-events.ts` — envoi serveur signé des événements.
- Create: `apps/student-vision/app/api/internal/health/route.ts` — état de service non sensible.
- Create: `apps/student-vision/src/server/merkora-events.test.ts`.
- Create: `app/api/admin/student-vision/route.ts` — lecture administrative des métadonnées du projet.
- Create: `src/components/admin/student-vision-project-panel.tsx` — suivi administratif.
- Modify: `app/admin/page.tsx` — ajout du panneau Student Vision.
- Create: `supabase/migrations/20261030_merkora_student_vision_events.sql` uniquement si une table de journal additive est nécessaire et approuvée après inspection du schéma existant.

**Interfaces:**
- Consumes: référence MerKora `MK-MVS0DJXN-WV60`, identifiant externe Student Vision, statut de réalisation, jalons et événements.
- Produces: journal administratif chronologique, état de synchronisation, lien Preview et résumé des jalons.

- [ ] **Step 1: Add the focused failing test**

Tester :
1. un événement valide associé à la référence Student Vision est accepté par le point d’entrée serveur ;
2. une signature absente ou invalide est rejetée ;
3. un événement d’un autre projet ne peut pas modifier le suivi Student Vision ;
4. les données privées de réponses et de profils étudiants ne sont pas présentes dans le journal MerKora ;
5. l’interface admin distingue « synchronisé », « en attente » et « échec de synchronisation » ;
6. un échec de transmission ne se présente jamais comme un événement enregistré.

- [ ] **Step 2: Verify the relevant failure**

Run: `npm test -- --run src/components/admin/student-vision-project-panel.test.tsx src/server/merkora-events.test.ts`

Expected: échec initial car l’intégration et ses tests n’existent pas.

- [ ] **Step 3: Implement the minimum behavior**

Créer un canal serveur-à-serveur avec secret exclusivement côté serveur et vérification de signature/horodatage. Ne pas faire confiance à un statut ou à un identifiant de propriétaire fourni par le navigateur. L’API admin MerKora réutilise `getAdminAccess()` et les conventions de `supabase-rest.ts`. Le panneau affiche :
- référence et nom Student Vision ;
- statut commercial MerKora existant, sans le modifier ;
- statut technique Student Vision ;
- dernière synchronisation et dernière activité ;
- jalons, versions, demandes de correction et historique ;
- liens Preview fournis par Vercel ;
- avertissements lorsque les données sont locales, non synchronisées ou indisponibles.

Les notes internes restent visibles uniquement à l’administration. Le compte `merkelnascom@gmail.com` reste administrateur selon les règles existantes. Ne jamais enregistrer de contenu de profil, réponse de questionnaire ou bulletin dans les notes d’événements.

- [ ] **Step 4: Verify the focused pass**

Run: `npm test -- --run src/components/admin/student-vision-project-panel.test.tsx src/server/merkora-events.test.ts`

Expected: tests d’authenticité, d’isolation et d’affichage d’état réussis.

- [ ] **Step 5: Run the affected integration check**

Run: `npm run typecheck && npm test && npm run build`

Expected: MerKora et les nouvelles routes admin compilent et passent leurs tests sans altérer les fonctions de devis, paiement et lancement.

- [ ] **Step 6: Commit the passing deliverable**

```bash
git add app/api/admin/student-vision src/components/admin/student-vision-project-panel.tsx app/admin/page.tsx src/server/merkora-events.ts apps/student-vision
git commit -m "feat(merkora): monitor Student Vision delivery"
```

---

### Task 5: Prévisualisation, recette et livraison contrôlée

**Files:**
- Modify: `apps/student-vision/README.md` — procédure Preview et recette.
- Create: `apps/student-vision/docs/acceptance-checklist.md` — scénario de validation pilote.
- Modify: configuration Vercel du projet Preview Student Vision uniquement, après vérification de la cible.
- Modify: configuration du projet Vercel MerKora Preview uniquement si une variable d’intégration est nécessaire.

**Interfaces:**
- Consumes: application Student Vision compilée, événements admin, URL Preview et scénarios de test.
- Produces: preuve de build Preview, liste de recette et état de livraison visible depuis MerKora.

- [ ] **Step 1: Add the focused failing test**

Définir la recette qui vérifie :
1. page d’accueil mobile et bureau ;
2. parcours étudiant sans compte en mode démonstration ;
3. questionnaire, sauvegarde et résultats explicables ;
4. erreurs réseau et service IA absent ;
5. séparation de deux profils étudiants ;
6. accès administrateur MerKora refusé à un compte étudiant ;
7. événements visibles dans l’administration MerKora ;
8. absence de création/modification de facture, paiement ou lancement ;
9. liens Preview sans exposition de secrets.

- [ ] **Step 2: Verify the relevant failure**

Run: `cd apps/student-vision && npm run typecheck && npm test && npm run build`

Expected: toute régression du parcours ou des tests bloque la recette avant création du Preview.

- [ ] **Step 3: Implement the minimum behavior**

Créer une configuration Vercel distincte avec `rootDirectory=apps/student-vision`, liée au dépôt Git existant, sans déclencher de déploiement de production. Limiter les variables au scope Preview. Le Preview Student Vision et le Preview MerKora sont deux déploiements distincts. Le panneau admin n’affiche une URL qu’après réception d’une URL réelle issue de Vercel. Ne pas publier de domaine personnalisé ni promouvoir une version.

- [ ] **Step 4: Verify the focused pass**

Run: `cd apps/student-vision && npm run typecheck && npm test && npm run build`

Expected: toutes les vérifications locales réussissent avant le test distant.

- [ ] **Step 5: Run the affected integration check**

Vérifier le déploiement Preview Student Vision, ouvrir le parcours étudiant, puis ouvrir le Preview MerKora et confirmer que le panneau admin reçoit les jalons et événements attendus. En cas d’échec de synchronisation, l’interface indique explicitement l’échec et conserve les informations déjà enregistrées. Ne pas déclarer la livraison terminée tant que la recette fonctionnelle n’est pas passée.

- [ ] **Step 6: Commit the passing deliverable**

```bash
git add apps/student-vision
git commit -m "test(student-vision): document preview acceptance"
```

---

## Critères d’acceptation finaux

1. Student Vision démarre et se construit indépendamment de MerKora.
2. L’élève peut parcourir un questionnaire et obtenir des pistes justifiées, avec incertitudes explicites.
3. Aucun résultat ne se présente comme une décision définitive ou une certification psychométrique.
4. Les données d’un élève ne sont pas accessibles à un autre élève.
5. L’administration MerKora voit les jalons, l’état, les événements, les versions et le lien Preview.
6. Les contenus personnels détaillés des élèves ne sont pas copiés dans le journal administratif MerKora.
7. Le statut commercial du projet et l’avancement technique restent séparés.
8. Le lancement déjà enregistré et les factures/déclarations de paiement existantes restent inchangés.
9. Aucune facture, déclaration de paiement ou confirmation de paiement n’est créée automatiquement.
10. Les deux applications disposent d’un Preview distinct et aucun déploiement de production n’est déclenché.
11. Les tests, le contrôle TypeScript et les builds passent ; les résultats sont consignés.

## Décisions non résolues avant activation des fonctions cloud

- Confirmer si Student Vision peut réutiliser le projet Supabase MerKora après audit des tables Auth, des rôles et des politiques RLS, ou s’il doit recevoir un projet Supabase distinct. Aucune nouvelle base ni migration ne sera créée avant cette vérification.
- Définir si le pilote accueille uniquement des étudiants majeurs ou également des mineurs ; ce choix détermine les consentements et les données pouvant être collectées.
- Définir les règles de conservation et de suppression des profils, réponses et éventuels documents scolaires avant l’activation du téléversement de bulletins.
- Vérifier le fournisseur d’images et le fournisseur IA, leurs coûts et leurs variables Preview avant de les activer. Le mode sans IA demeure le comportement par défaut.
- La création d’un nouveau dépôt GitHub séparé n’est pas nécessaire au premier pilote : l’isolation est assurée par le répertoire applicatif et le projet Vercel séparé. Si une séparation GitHub physique devient nécessaire, elle sera une opération distincte, sans déplacer ni supprimer l’historique existant.
