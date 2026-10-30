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

Le prompt et le validateur préparent le futur agent. L'intégration d'une génération IA réelle devra être derrière :
1. une configuration serveur explicite du modèle et de l'authentification AI Gateway ;
2. un interrupteur d'activation administrateur ;
3. une confirmation explicite de l'appel payant au moment de l'exécution ;
4. un budget et des limites de dépense côté AI Gateway ;
5. la validation du patch avant toute écriture dans le projet ;
6. une compilation isolée et une revue humaine avant livraison.

## Contrat de sécurité

- Ne jamais transmettre de secret au code client ou au bac à sable.
- Ne jamais autoriser l'agent à modifier `package.json`, les migrations SQL ou les règles d'accès.
- Ne jamais déployer automatiquement.
- Les questions ouvertes empêchent de considérer l'implémentation comme complète.
- Un patch refusé ne modifie pas le manifeste source.
- L'empreinte SHA-256 est une preuve d'intégrité, pas une autorisation.

## État

Le générateur de squelette et la compilation isolée existent. Le prompt d'implémentation et le contrat de patch sont implémentés et testés. L'appel IA réel, l'implémentation complète de chaque logique métier et la livraison client restent à construire et à autoriser séparément.
