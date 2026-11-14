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

Sur une Preview autorisée, après raccordement à une interface de planification :

1. Ouvrir un projet de test et vérifier que le bon propriétaire et le bon périmètre sont utilisés.
2. Vérifier que MerKora Core propose les pôles nécessaires sans activer tous les agents par défaut.
3. Vérifier que les phases et dépendances affichées correspondent aux choix retenus.
4. Vérifier qu'un agent sans runtime spécialisé apparaît comme bloqué, et non comme exécuté.
5. Refuser une validation client ou administrative et confirmer que la fabrication ne démarre pas.
6. Refuser l'autorisation de mise en production et confirmer qu'aucune publication n'est effectuée.
7. Vérifier les résultats, les preuves indépendantes, les événements d'audit et la reprise après échec.

## Limites de cette phase

- Les tests utilisent des adaptateurs factices ; ils ne font aucun appel réel à OpenAI, Anthropic ou Gemini.
- Aucun worker, Vercel Sandbox, paiement ou déploiement n'est lancé.
- Le nouvel exécuteur n'est pas encore raccordé à une route ou à une persistance durable ; ce raccordement doit réutiliser les services existants et faire l'objet d'une phase distincte.
- Aucun schéma ni aucune donnée Supabase n'est modifié.
- Aucun merge ni déploiement de production n'est autorisé par ce travail.
