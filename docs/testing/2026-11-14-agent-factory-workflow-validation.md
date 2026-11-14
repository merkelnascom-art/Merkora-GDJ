# Vérification du workflow multi-pôles MerKora

Date : 14 novembre 2026  
Branche : `feature/merkora-multi-agent-org-catalog`  
PR : #17

## Contrôles automatisés

La suite doit couvrir :

- les 7 pôles et les 35 identifiants d'agents ;
- les 35 paquets de mission et leurs 13 rôles modèle dédiés ;
- les limites d'action des rôles devis, gouvernance, déploiement et relation client ;
- l'ordre des 10 phases de fabrication et les barrières entre phases ;
- l'absence d'activation automatique d'un agent omis ;
- le statut explicite des spécialistes sans runtime compatible ;
- les dépendances manquantes, dupliquées ou cycliques ;
- le chargement des trois approbations exactes et le consentement IA depuis la session projet ;
- le refus des portes qualité, production et réception tant qu'elles n'ont pas de preuve d'approbation dédiée ;
- la validation du manifeste spécialiste dans le worker Edge ;
- le refus du démarrage si le service d'autorisation le refuse ;
- le refus d'appel fournisseur si l'accès projet ou la réservation de budget échoue ;
- le refus d'une phase si une validation humaine obligatoire est absente ;
- l'exigence d'un fournisseur indépendant pour les revues et contre-vérifications ;
- l'absence d'exigence de mise en production lorsqu'aucune tâche de déploiement n'est sélectionnée ;
- l'acceptation client avant le démarrage du support après livraison ;
- la validation TypeScript, les tests, les contrôles Edge Functions, le worker identity et le build.

## Contrôle manuel de l'administrateur

La route `GET /api/admin/agents/runtime-readiness` expose uniquement l'état de configuration serveur des fournisseurs. Elle exige un compte administrateur, ne retourne ni clé ni nom de modèle, et doit toujours indiquer `providerCallsPerformed: false`, `spendingStarted: false` et `projectConnectionCheckRequired: true`. Elle ne prouve pas qu'une connexion client donnée est autorisée ou utilisable.

Sur une Preview autorisée, ouvrir `/admin/agents/factory` avec un compte administrateur et :

1. Saisir l'identifiant exact d'un projet de test possédant déjà un brief et un plan versionnés.
2. Vérifier que la route de préparation lit le dernier snapshot et affiche ses versions sans créer de nouvelle ligne.
3. Vérifier que MerKora Core propose les pôles nécessaires sans activer tous les agents par défaut ; « Sélectionner les 35 » doit rester un choix explicite.
4. Vérifier que les phases, l'ordre topologique et les dépendances affichées correspondent aux choix retenus.
5. Vérifier qu'un agent sans runtime spécialisé apparaît comme non raccordé, et non comme exécuté.
6. Vérifier que les tests du moteur transmettent les résultats amont à la phase suivante sans fuite entre agents d'une même phase.
7. Avant toute activation ultérieure, refuser une validation client ou administrative et confirmer que la fabrication ne démarre pas.
8. Refuser l'autorisation de mise en production et confirmer qu'aucune publication n'est effectuée.
9. Vérifier les résultats, les preuves indépendantes, les événements d'audit et la reprise après échec.

## Vérification SQL du registre de missions

Le workflow `.github/workflows/factory-mission-ledger-sql.yml` applique la migration sur un PostgreSQL 16 éphémère et exécute `supabase/tests/factory_mission_ledger.sql`. Il vérifie l'initialisation idempotente, les dépendances, les leases, la reprise après expiration, l'historique append-only et la finalisation en attente de revue humaine. Cette base de test est détruite avec le job CI ; elle n'est pas le projet Supabase connecté.

## Limites de cette phase

- Les tests modèle utilisent des adaptateurs factices ; aucun appel réel à OpenAI, Anthropic ou Gemini n'est effectué.
- La migration SQL est testée sur PostgreSQL éphémère mais n'a pas été appliquée au projet Supabase connecté.
- Le worker Edge mis à jour n'est pas déployé ; la route de dispatch admin continue donc de refuser les jobs spécialistes.
- Aucun job spécialiste n'a été réclamé, aucun budget IA n'a été réservé, aucun fournisseur, Vercel Sandbox, paiement ou déploiement n'a été lancé.
- Le runtime des 35 agents est actuellement modèle-only. Les outils d'exploitation, de déploiement, de relation client et de gestion administrative restent désactivés.
- Le test Preview de bout en bout reste à faire après autorisation d'appliquer la migration et de déployer la fonction Edge sur un environnement Preview contrôlé.
- Aucun merge ni déploiement de production n'est autorisé par ce travail.
