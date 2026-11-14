# Vérification du workflow multi-pôles MerKora

Date : 14 novembre 2026  
Branche : `feature/merkora-multi-agent-org-catalog`  
PR : #17

## Contrôles automatisés

La suite doit couvrir :

- les 7 pôles et les 35 identifiants d'agents ;
- l'ordre des 10 phases de fabrication et les barrières entre phases ;
- l'absence d'activation automatique d'un agent omis ;
- le statut explicite des spécialistes sans runtime compatible ;
- les dépendances manquantes, dupliquées ou cycliques ;
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

## Limites de cette phase

- Les tests utilisent des adaptateurs factices ; ils ne font aucun appel réel à OpenAI, Anthropic ou Gemini.
- Aucun worker, Vercel Sandbox, paiement ou déploiement n'est lancé.
- L'interface de planification et la route de lecture seule sont raccordées au snapshot de plan versionné. Le lancement réel multi-pôles, la persistance durable et le budget restent bloqués jusqu'à une phase d'intégration distincte.
- Aucun schéma ni aucune donnée Supabase n'est modifié.
- Aucun merge ni déploiement de production n'est autorisé par ce travail.
