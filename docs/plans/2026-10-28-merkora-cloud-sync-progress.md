# MerKora GDJ — phase 2: comptes et sauvegarde cloud

## Objectif

Relier les dossiers locaux à un compte et permettre une synchronisation explicite, sans supprimer les données déjà présentes dans le navigateur.

## Réalisé dans la branche de travail

- Routes serveur d’inscription, connexion, état de session et déconnexion.
- Jetons conservés dans des cookies HttpOnly, SameSite=Lax, Secure en production; aucun jeton renvoyé au code client.
- Vérification de l’origine des requêtes POST.
- Routes de lecture et de synchronisation manuelle pour `public.user_projects`, utilisant le jeton de l’utilisateur et les politiques RLS existantes.
- Validation des champs de projet et limites de taille des recommandations.
- Conversion entre les valeurs locales et les valeurs acceptées par la base (`soon` devient `high`).
- Fusion des projets cloud qui ne sont pas encore présents localement; les projets locaux existants sont conservés.
- Confirmation explicite avant de copier les dossiers du navigateur vers le compte connecté.
- Tests unitaires des conversions local/cloud et checklist de tests manuels.

## Base de données

Projet vérifié : `tvwkickjtqjqwoiidmxj` (Merkora GDJ). Table `public.user_projects` existante, RLS activé, politiques SELECT/INSERT/UPDATE/DELETE limitées à `auth.uid() = user_id`. Aucun DDL, migration, reset, suppression ou écriture de données exécuté pendant cette phase.

## Vérification

- Workflow automatisé: voir https://github.com/merkelnascom-art/Merkora-GDJ/actions
- Checklist manuelle: `docs/testing/merkora-cloud-sync-checklist.md`
- Les tests automatiques ne remplacent pas le test manuel d’inscription, de confirmation e-mail, de connexion et de séparation entre deux comptes.
- Ne pas présenter la connexion cloud comme validée en production avant ces tests manuels sur l’aperçu.

## Limites et décisions encore nécessaires

- L’advisor Supabase signale que la protection contre les mots de passe compromis est désactivée. Aucun paramètre Auth n’a été modifié.
- Vérifier le flux de confirmation d’e-mail avec la configuration Auth réelle.
- La synchronisation est manuelle et envoie les dossiers locaux vers le compte connecté après confirmation. Elle ne supprime pas les dossiers locaux.
- L’IA connectée, les maquettes personnalisées, les devis officiels et le suivi de réalisation ne sont pas encore livrés.
- Aucun merge vers `main`, aucune promotion production.
