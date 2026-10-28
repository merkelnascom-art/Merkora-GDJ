# MerKora GDJ

Plateforme centrale destinée à transformer un besoin exprimé en langage naturel en pistes de solutions, puis en projet structuré.

## Ce que contient cette première version

- Interface responsive en français.
- Formulaire de description d'un besoin, avec validation.
- Dossiers de projet enregistrés dans le stockage local du navigateur.
- Pré-analyse par règles locales et pistes de réflexion adaptées aux mots-clés et à la catégorie.
- Tests unitaires et workflow CI de typecheck, tests et build.

## Limites importantes

Cette version est un prototype de travail. Les dossiers restent dans le navigateur utilisé et ne sont pas synchronisés entre appareils ni avec un compte utilisateur. Les suggestions sont déterministes et locales : aucun modèle d'IA n'est encore connecté. Il n'y a pas encore d'authentification, de devis contractuel, de paiement ou de création automatique de logiciel.

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
- Configurer Supabase uniquement après vérification du projet cible et des politiques RLS.
- Garder les clés privées IA côté serveur.
- Ne pas supprimer ni réinitialiser les données Supabase existantes.
- Distinguer clairement prototype, prévisualisation et production.
