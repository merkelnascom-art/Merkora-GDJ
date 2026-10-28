# MerKora GDJ

MerKora GDJ est une plateforme de découverte de besoins : elle commence par la situation réelle d’une personne ou d’une organisation, clarifie ce qui manque, puis propose des directions adaptées à examiner avant de construire une solution.

## Cette version de travail

- Page d’accueil en français, responsive, avec accès à la découverte sans création de compte.
- Espace de travail conservé pour créer, consulter et modifier les dossiers locaux.
- Inscription et connexion par e-mail/mot de passe via routes serveur; jetons de session conservés dans des cookies HttpOnly.
- Synchronisation manuelle des dossiers avec la table `public.user_projects`, protégée par les politiques RLS existantes.
- Pré-analyse contextuelle pour l’orientation scolaire et professionnelle, le commerce et la gestion d’équipe, la création/communication et certains besoins numériques.
- Questions de clarification quand le domaine ou le résultat attendu reste ambigu.
- Résultats étiquetés comme préliminaires, avec limites et incertitudes explicites.
- Stockage local compatible avec la clé existante `merkora-gdj-projects-v1`.

## Limites importantes

Cette version est un prototype. Les dossiers restent dans le navigateur utilisé et ne sont pas synchronisés entre appareils ni rattachés à un compte. Les suggestions proviennent de règles locales déterministes : aucun modèle d’IA n’est connecté. Les résultats ne constituent ni un diagnostic, ni un devis officiel, ni une promesse de réalisation.

La connexion au compte et la synchronisation manuelle sont désormais implémentées dans le code de la branche de travail. Leur fonctionnement dépend des variables Supabase configurées et doit être testé sur l’aperçu. Les devis officiels et leur versionnement, la composition de maquettes personnalisées, le suivi de réalisation et les paiements restent à développer.

## Stack

- Next.js App Router
- React
- TypeScript
- Vitest
- CSS responsive

## Développement local

```bash
npm install
npm run dev
```

## Vérifications

```bash
npm run typecheck
npm test
npm run build
```

## Sécurité et déploiement

- Ne jamais committer de secret ni de fichier `.env.local`.
- Les clés privées d’un fournisseur IA doivent rester côté serveur.
- Ne pas supprimer ni réinitialiser les données Supabase existantes.
- Ne pas modifier les autres projets, notamment WALL Trade.
- Développer et vérifier sur `feature/merkora-rebuild-foundation`.
- Aucun changement ne doit être fusionné dans `main` ni promu en production sans autorisation explicite.

## Aperçu Vercel

Vérifier l’aperçu de la branche ou de la pull request avant toute promotion. La présence d’un aperçu ne signifie pas que les fonctions reportées (IA connectée, devis officiels et paiements) sont actives. Vérifier l’inscription, la connexion, la confirmation e-mail selon les paramètres Auth, la synchronisation et les règles RLS avant toute mise en production.
