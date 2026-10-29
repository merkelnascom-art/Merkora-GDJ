# MerKora GDJ — accès administrateur en prévisualisation

## Objectif
Mettre en place une première porte d’entrée administrateur contrôlée côté serveur, sans changement de base, sans mutation de dossier et sans promotion en production.

## Implémenté dans cette branche
- Route `/admin` rendue côté serveur et dynamique.
- L’accès exige une session valide via les cookies HttpOnly existants.
- L’autorisation vient exclusivement de `MERKORA_ADMIN_EMAILS`, une liste d’adresses séparées par des virgules, lue côté serveur.
- Aucun rôle envoyé par le navigateur ni métadonnée utilisateur n’est accepté comme preuve d’administration.
- Le tableau indique explicitement les modules qui restent à connecter; aucune donnée client n’est affichée à cette étape.

## Configuration requise dans Vercel
Configurer `MERKORA_ADMIN_EMAILS` uniquement pour l’environnement **Preview** du projet MerKora GDJ, avec l’adresse e-mail du compte administrateur. Ne pas l’ajouter à Production pour cette étape.

## Hors périmètre volontaire
- Aucun accès privilégié aux tables Supabase.
- Aucune clé service-role ajoutée ou exposée.
- Aucune lecture globale des dossiers clients.
- Aucune écriture, suppression, migration ou réinitialisation Supabase.
- Aucun changement sur `main`, aucune fusion et aucune promotion en production.

## Étapes suivantes
1. Configurer l’allowlist côté Preview et vérifier le comportement avec compte non connecté, compte client et compte admin.
2. Ajouter une API d’administration strictement en lecture seule après vérification du schéma et des politiques existantes; utiliser une clé serveur uniquement si nécessaire et sans jamais la transmettre au client.
3. Ajouter les dossiers clients, puis devis/validation, avec journalisation et tests d’autorisation.
