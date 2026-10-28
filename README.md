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
- Intégration du moteur d’analyse IA via Vercel AI Gateway, avec propositions modifiables et validation manuelle avant application au dossier.
- Activation IA désactivée par défaut pour éviter les appels potentiellement facturables sans accord et configuration du budget.
- Stockage local compatible avec la clé existante `merkora-gdj-projects-v1`.

## Limites importantes

Cette version est un prototype. Les dossiers restent dans le navigateur utilisé et ne sont pas synchronisés entre appareils ni rattachés à un compte. Les suggestions locales fonctionnent sans IA. Le code d’intégration IA est présent, mais le moteur reste désactivé tant que `MERKORA_AI_ENABLED=true` n’a pas été configuré explicitement côté serveur. Aucun appel de modèle n’est effectué par défaut. Les propositions IA restent à relire et modifier; elles ne constituent ni un devis officiel, ni une promesse de réalisation.

La connexion au compte et la synchronisation manuelle sont désormais implémentées dans le code de la branche de travail. Leur fonctionnement dépend des variables Supabase configurées et doit être testé sur l’aperçu. Les devis officiels et leur versionnement, la composition de maquettes personnalisées, le suivi de réalisation et les paiements restent à développer.

## Intégration IA (désactivée par défaut)

L’analyse utilise l’API compatible Chat Completions de Vercel AI Gateway. La clé est lue uniquement côté serveur depuis `AI_GATEWAY_API_KEY` ou le jeton OIDC Vercel. Le modèle est configurable via `MERKORA_AI_MODEL`; valeur par défaut prévue : `deepseek/deepseek-v4.1-flash`.

Avant d’activer le moteur :
1. Vérifier le modèle et son prix actuel dans le catalogue Vercel AI Gateway.
2. Configurer une limite de dépenses/budget dans Vercel AI Gateway.
3. Ajouter `MERKORA_AI_ENABLED=true` dans les variables d’environnement du seul projet MerKora GDJ.
4. Vérifier l’authentification du Gateway dans l’environnement de déploiement.
5. Effectuer un test contrôlé et consulter l’usage/coût avant d’ouvrir l’accès aux clients.

Variables côté serveur :
- `MERKORA_AI_ENABLED`: uniquement `true` pour autoriser les appels.
- `MERKORA_AI_MODEL`: identifiant `provider/model` vérifié dans le catalogue.
- `AI_GATEWAY_API_KEY`: optionnelle si l’environnement Vercel fournit l’authentification OIDC; ne jamais exposer cette variable côté client.

L’interface permet de relire, modifier ou retirer les pistes proposées avant de les appliquer au dossier. L’application des pistes remplace seulement la liste des recommandations de ce dossier; aucune autre donnée n’est modifiée.

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
