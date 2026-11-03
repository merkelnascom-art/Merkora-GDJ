# Déploiement contrôlé du worker MerKora

## État de cette étape

Cette première intégration est volontairement limitée à une vérification en lecture seule :
- vérification cryptographique du jeton GitHub Actions OIDC ;
- restriction au dépôt, au workflow et à la branche MerKora autorisés ;
- contrôle du statut `queued` ;
- relecture du propriétaire du projet, du plan et de ses empreintes SHA-256 ;
- contrôle des trois validations et du consentement IA ;
- contrôle du lancement commercial et du seuil de paiement confirmé.

Elle ne réclame pas le travail, ne modifie aucune ligne et ne démarre aucune compilation. L'exécution Vercel Sandbox sera raccordée dans une étape distincte, après vérification du handshake.

## Configuration GitHub

Créer une variable d'action au niveau du dépôt :
- Nom : `MERKORA_SUPABASE_URL`
- Valeur : URL du projet Supabase MerKora.

Aucun secret Supabase n'est à ajouter dans GitHub. Le jeton OIDC est court-vivant et obtenu directement par le runner. La clé serveur Supabase reste exclusivement dans l'environnement Edge Function.

## Déploiement Supabase à effectuer séparément

Depuis un environnement de confiance connecté au projet `tvwkickjtqjqwoiidmxj`, déployer uniquement la fonction :

```bash
supabase functions deploy factory-worker --project-ref tvwkickjtqjqwoiidmxj
```

Le fichier `supabase/config.toml` désactive le contrôle JWT générique de la passerelle pour cette seule fonction ; le handler vérifie lui-même la signature GitHub OIDC, l'émetteur, l'audience, l'expiration, le dépôt, le workflow et la branche. Ne pas désactiver la vérification JWT pour d'autres fonctions.

## Vérification

Lancer manuellement le workflow `MerKora factory worker` depuis la branche `feature/merkora-factory-unified-runtime`, avec un identifiant de projet et un UUID de job réellement existants et en statut `queued`.

Résultat attendu : `authorized: true` et `eligible: true`. Le statut du job doit rester `queued`. Aucun build ni appel IA ne doit être déclenché.

## Étape suivante avant toute exécution réelle

Raccorder l'exécution Vercel Sandbox au worker avec une identité serveur Vercel dédiée, une durée maximale, des ressources bornées, un réseau fermé après installation, des preuves de build et un retour d'état idempotent. Ajouter ensuite la réclamation atomique et les transitions de tâches dans une opération contrôlée, avec audit valide selon les contraintes existantes.

Aucune migration SQL n'est requise pour ce handshake en lecture seule. Aucune fonction n'a été déployée depuis cette modification GitHub.
