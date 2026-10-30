# MerKora GDJ — Inventaire en lecture seule avant mémoire durable

**Date :** 30 octobre 2026  
**Statut :** Inventaire du dépôt terminé sur les fichiers examinés ; schéma Supabase distant non inspecté dans ce jalon  
**Branche examinée :** `feature/admin-preview-secure-access`  
**Nature :** lecture seule du code GitHub. Aucune requête de modification Supabase, aucune migration et aucun déploiement.

## 1. Résumé exécutif

Le dépôt possède déjà une base utile pour construire la mémoire durable, mais cette mémoire n'est pas encore réalisée.

Capacités vérifiées dans le code :
- projets synchronisables avec Supabase via une route serveur authentifiée ;
- accès aux projets limité au compte connecté au moyen du jeton utilisateur et des politiques Supabase ;
- génération d'un aperçu de plan déterministe à partir d'un dossier projet ;
- vérification d'origine sur les routes POST concernées ;
- vérification de l'identité utilisateur depuis Supabase côté serveur ;
- liste d'administrateurs basée sur une liste d'e-mails configurée côté serveur.

Limites vérifiées :
- la route de planification est une route **POST sans écriture de plan** : elle calcule et renvoie un résultat, puis celui-ci n'est pas persisté par cette route ;
- les données de projet actuelles ne portent pas de versions immuables du brief ou du plan dans le modèle TypeScript examiné ;
- aucun journal d'événements de projet ni mécanisme de reprise de job n'a été trouvé dans les fichiers examinés ;
- l'aperçu de plan accepte des numéros de version et des choix transmis dans le corps de la requête, puis calcule un aperçu ; ces numéros ne constituent donc pas, à eux seuls, une preuve de version persistée ou d'approbation ;
- les statuts de projet actuels décrivent le cycle commercial/opérationnel du dossier, mais ne remplacent pas un état détaillé de tâches de fabrication.

Cet inventaire n'est pas une preuve exhaustive de l'absence de fonctionnalité dans chaque fichier du dépôt, et il ne confirme pas l'état du schéma Supabase distant.

## 2. Fichiers examinés et observations

### `app/api/projects/route.ts`

Responsabilités visibles :
- GET : lit les dossiers de l'utilisateur connecté depuis `user_projects`, ordonnés par mise à jour ;
- POST : valide et synchronise une liste de projets, en définissant `user_id` à partir de l'utilisateur authentifié côté serveur ;
- les écritures sont envoyées avec le jeton de l'utilisateur à l'API REST Supabase ;
- la route refuse les requêtes POST dont l'origine ne correspond pas à l'origine de la requête.

Conséquence : `user_projects` est un point d'entrée existant pour le dossier courant. Il ne faut pas transformer cette table en journal d'événements ni écraser son rôle actuel. La création d'une mémoire versionnée doit être additive et séparée.

### `app/api/projects/[projectId]/plan/preview/route.ts`

Responsabilités visibles :
- vérifie l'origine de la requête ;
- valide la forme du payload ;
- récupère l'utilisateur connecté et le jeton d'accès ;
- recherche le dossier avec l'identifiant du projet **et** l'identifiant du propriétaire ;
- génère un plan à partir du dossier existant et des choix transmis ;
- renvoie le plan sans cache.

Conséquence : la route est un bon point de départ pour l'aperçu, mais elle ne doit pas être présentée comme un stockage de plan, une approbation ou un lancement de production. Les futures versions persistées doivent être chargées depuis une source serveur faisant autorité, et les choix soumis doivent être comparés au périmètre réellement enregistré et approuvé.

### `src/lib/project-types.ts`

Le modèle `Project` contient le besoin, un statut, les recommandations et éventuellement le résultat de découverte. Le modèle `CloudProjectRow` représente les colonnes actuelles de `user_projects` : identité, besoin, budget, urgence, statut, recommandations et dates.

Conséquence : ne pas ajouter arbitrairement des champs de mémoire dans le type courant sans définir leur stockage, leur versionnement et leurs règles d'accès. Prévoir des types distincts pour les versions de brief, les plans, les événements, les tâches et les preuves.

### `src/lib/server/supabase-rest.ts`

Le module :
- lit les cookies de session HttpOnly ;
- récupère/renouvelle la session Supabase ;
- vérifie l'utilisateur via l'endpoint d'authentification ;
- exécute les requêtes REST avec le jeton d'accès utilisateur ;
- utilise `cache: no-store` pour les appels concernés.

Conséquence : les futurs endpoints de mémoire devraient réutiliser l'authentification utilisateur et le jeton d'accès, sans exposer de secret côté navigateur et sans utiliser une clé service pour les opérations utilisateur ordinaires.

### `src/lib/server/admin-access.ts`

L'accès administrateur est déterminé par une liste `MERKORA_ADMIN_EMAILS` côté serveur et l'e-mail de l'utilisateur authentifié. Les métadonnées envoyées par le client ne sont pas utilisées pour accorder le rôle.

Conséquence : ce mécanisme est un élément existant, mais il faut vérifier sa configuration et le modèle de rôle réellement utilisé dans les autres routes avant de l'adopter comme autorité universelle de toutes les futures approbations.

### `package.json`

Les commandes de qualité déclarées sont :
- `npm test` — Vitest ;
- `npm run typecheck` — TypeScript sans émission ;
- `npm run build` — build Next.js.

Les outils de test et de build sont disponibles dans les scripts du projet. Cet inventaire GitHub n'a pas exécuté ces commandes dans un workspace local.

## 3. Écart entre l'existant et la cible

| Capacité | État observé |
|---|---|
| Dossier projet serveur | Présent via `user_projects` |
| Authentification des routes projet | Présente sur les routes examinées |
| Génération d'un aperçu de plan | Présente |
| Versions persistées et immuables du brief | Non observées dans les fichiers examinés |
| Versions persistées et immuables des plans | Non observées dans les fichiers examinés |
| Approbations immuables liées au digest plan/périmètre | Définies en conception, non observées comme implémentées |
| Journal append-only des événements | Non observé dans les fichiers examinés |
| État durable de tâches de fabrication | Non observé dans les fichiers examinés |
| Manifeste de job et worker de construction | Non observés dans les fichiers examinés |
| Reprise après interruption avec réconciliation | Non observée dans les fichiers examinés |
| Preuves de tests attachées à un job | Non observées dans les fichiers examinés |

## 4. Architecture d'implémentation recommandée

### Phase A — contrats purs, sans base de données

Créer des types et fonctions pures, sans effet externe, pour :
- les événements projet ;
- les transitions d'état autorisées ;
- la version de brief ;
- le manifeste de tâche/job ;
- la construction du résumé de reprise ;
- la classification des tâches comme reprenables, ambiguës ou bloquées.

Cette phase peut être testée sans migration et sans toucher aux dossiers clients.

### Phase B — tests d'autorisation et de cohérence

Écrire des tests pour :
- la séparation entre propriétaire et autres utilisateurs ;
- l'absence d'héritage d'approbation entre versions ;
- le refus d'une reprise quand le digest du plan/périmètre ne correspond plus ;
- l'idempotence des événements et des demandes de reprise ;
- l'impossibilité de marquer une tâche terminée sans preuve obligatoire.

### Phase C — conception de persistance additive

Avant toute migration :
1. inspecter le schéma Supabase distant en lecture seule ;
2. inspecter les migrations et RLS déjà présentes ;
3. confirmer les clés, contraintes et politiques réelles ;
4. définir tables séparées pour les versions, approbations, événements et exécutions ;
5. documenter rétention, suppression, index et retour arrière ;
6. demander une autorisation distincte avant d'appliquer une migration à la base partagée.

### Phase D — persistance en Preview puis simulation de reprise

Après approbation explicite de la migration :
- ajouter les écritures append-only ;
- créer les routes avec authentification, autorisation, validation et limites ;
- tester les interruptions avec des jobs simulés ;
- afficher l'état et les preuves à l'administration ;
- ne connecter aucun worker exécutant du code tant que les limites d'isolation et d'autorisation ne sont pas démontrées.

## 5. Garde-fous

- Aucune modification de la table `user_projects` qui écrase ou supprime des dossiers existants.
- Aucune migration distante dans le cadre de cet inventaire.
- Aucun changement du flux devis, paiement ou lancement de projet.
- Aucune confirmation automatique de paiement.
- Aucun fournisseur IA externe ou service payant ajouté sans décision explicite.
- Aucun déploiement en production.
- Les routes et schémas proposés doivent être testés avec les politiques RLS réelles avant usage.

## 6. Limites de cet inventaire

Les observations reposent sur les fichiers GitHub listés ci-dessus et leur contenu au moment de la lecture. Le schéma distant Supabase, ses politiques RLS effectives, les variables d'environnement Vercel et le comportement de l'application déployée n'ont pas été vérifiés dans ce jalon. Les déclarations « non observé » signifient uniquement que la capacité n'apparaît pas dans les fichiers examinés.

**Conclusion :** la prochaine implémentation sûre est un noyau de contrats purs et de tests pour la mémoire et la reprise. La persistance ne doit venir qu'après l'inspection en lecture seule du schéma réel et une approbation explicite de la migration proposée.
