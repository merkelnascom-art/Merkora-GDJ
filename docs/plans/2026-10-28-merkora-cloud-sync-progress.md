# MerKora GDJ — phase 2: comptes et sauvegarde cloud

## Objectif

Relier les dossiers locaux à un compte et permettre une synchronisation explicite, sans supprimer les données déjà présentes dans le navigateur.

## Réalisé dans la branche de travail

- Routes serveur d’inscription, connexion, état de session et déconnexion.
- Redirection explicite des e-mails de confirmation vers `/auth/callback`, écran de confirmation, validation du jeton auprès de Supabase avant de créer les cookies HttpOnly.
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
- Le code de retour e-mail est intégré; il reste à autoriser l’URL exacte `/auth/callback` dans Supabase Auth, puis à vérifier le flux réel avec un nouveau lien de confirmation. Un ancien lien peut déjà avoir expiré.
- La synchronisation est manuelle et envoie les dossiers locaux vers le compte connecté après confirmation. Elle ne supprime pas les dossiers locaux.
- L’IA connectée, les maquettes personnalisées, les devis officiels et le suivi de réalisation ne sont pas encore livrés.
- Aucun merge vers `main`, aucune promotion production.


## Phase suivante — propositions IA modifiables

- Route `GET /api/ai/status` : expose uniquement l’état de configuration, jamais les secrets.
- Route `POST /api/ai/analyze` : envoie le besoin à Vercel AI Gateway, valide et limite la forme de la réponse, renvoie une synthèse, les questions, hypothèses, pistes et prochaines étapes.
- Panneau d’analyse dans le détail du dossier : l’utilisateur peut modifier ou retirer chaque piste, puis décider explicitement de les appliquer.
- L’application des pistes ne modifie que les recommandations du dossier courant; les autres dossiers et la base restent inchangés.
- Garde-fou de coût : `MERKORA_AI_ENABLED` doit être explicitement défini à `true`; sinon aucune requête modèle n’est effectuée. Le modèle par défaut prévu est `deepseek/deepseek-v4.1-flash`, configurable par `MERKORA_AI_MODEL`.
- L’intégration est câblée côté code, mais ne doit pas être déclarée active avant configuration de l’accès Gateway, d’un budget/limite de dépenses et d’un test live autorisé.
