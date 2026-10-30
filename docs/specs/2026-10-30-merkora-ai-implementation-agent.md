# MerKora GDJ — Agent d'implémentation logiciel

Date : 2026-10-30  
Branche : `feature/admin-preview-secure-access`

## Objectif

Transformer un plan et un périmètre client déjà approuvés en changements de code qui restent strictement dans ce périmètre. L'agent doit demander des précisions plutôt que d'inventer une règle métier.

## Éléments implémentés

- `src/lib/factory/implementation-agent.ts` construit un prompt propre au projet à partir du nom, du problème, des modules, des contraintes confirmées, des critères d'acceptation et des questions ouvertes.
- Le prompt interdit les fonctionnalités hors périmètre, les secrets, les appels réseau externes, les paiements, les déploiements et les modifications des migrations ou dépendances.
- `validateProjectCodePatch` limite les changements aux répertoires source autorisés, borne le nombre et la taille des fichiers, rejette les chemins dangereux, les secrets et les primitives d'exécution risquées.
- `applyProjectCodePatch` applique uniquement un patch validé, conserve les fichiers non touchés et recalcule l'empreinte du manifeste.
- Les tests vérifient le prompt, les limites de patch, les refus de sécurité et l'intégrité du manifeste.

## Limites volontaires

Cette étape ne déclenche aucun appel à un modèle. Le mode zéro dépense reste actif : aucun appel AI Gateway, aucune création de clé et aucun crédit consommé par ces fonctions.

Le prompt, le validateur et la route d'implémentation sont préparés. La route `POST /api/admin/projects/[projectId]/factory/jobs/[jobId]/implement` reste inactive par défaut et exige cumulativement :
1. le consentement de traitement IA enregistré dans le payload du plan approuvé (`aiImplementationConsent: true`) ;
2. `MERKORA_AI_ENABLED=true` côté serveur ;
3. un modèle `provider/model` configuré dans `MERKORA_CODEGEN_MODEL` et une authentification AI Gateway serveur ;
4. une confirmation explicite `confirmAiSpend: true` au moment de l'exécution ;
5. un budget et des limites de dépense côté AI Gateway ;
6. la validation du patch avant toute écriture dans le projet ;
7. une compilation isolée et une revue humaine avant livraison.

## Contrat de sécurité

- Ne jamais transmettre de secret au code client ou au bac à sable.
- Ne jamais autoriser l'agent à modifier `package.json`, les migrations SQL ou les règles d'accès.
- Ne jamais déployer automatiquement.
- Les questions ouvertes empêchent de considérer l'implémentation comme complète.
- Un patch refusé ne modifie pas le manifeste source.
- L'empreinte SHA-256 est une preuve d'intégrité, pas une autorisation.

## État

Le générateur de squelette et la compilation isolée existent. Le prompt d'implémentation, le parseur de réponse, le validateur de patch et l'application sécurisée du patch sont implémentés et testés. La route d'appel IA est construite mais ne peut pas s'exécuter sans consentement client, activation serveur et confirmation de dépense. Aucun appel IA n'a été effectué. L'implémentation complète de chaque logique métier et la livraison client restent à construire et à autoriser séparément.
