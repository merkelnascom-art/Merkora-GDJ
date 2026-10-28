# Vérification — comptes et synchronisation cloud

## Automatisé
- [ ] TypeScript, Vitest et build Next.js passent sur le dernier commit de la branche.
- [ ] Les conversions local/cloud conservent les champs du projet.
- [ ] La priorité locale `soon` est convertie en valeur autorisée `high` pour la base.
- [ ] Les routes de compte et de projets ne journalisent ni mot de passe ni jeton.
- [ ] Les routes de mutation refusent une requête dont l’en-tête Origin n’est pas celui de l’application.

## Configuration Supabase Auth requise avant le test

Dans **Supabase > Authentication > URL Configuration**, ajouter à la liste des Redirect URLs :
- `https://merkoragdj-git-feature-merkora-rebuild-foundation-wall-trade.vercel.app/auth/callback` (aperçu stable de la branche, si ce domaine est toujours celui attribué par Vercel);
- `https://merkoragdj.vercel.app/auth/callback` (site principal, à utiliser uniquement quand l’URL principale est confirmée).

Le flux d’inscription transmet maintenant explicitement `/auth/callback` sur le domaine qui sert le formulaire. Supabase n’acceptera ce retour que si l’URL correspond à la liste autorisée. Ne pas utiliser `localhost:3000` pour tester l’aperçu en ligne.

## Tests manuels à faire sur l’aperçu
- [ ] Charger la page sans session : le prototype local reste accessible.
- [ ] Créer un compte de test avec une adresse e-mail contrôlée par le testeur.
- [ ] Si la confirmation e-mail est activée, confirmer l’adresse puis se connecter.
- [ ] Se connecter et vérifier que seuls les dossiers du compte sont listés par la route protégée.
- [ ] Synchroniser un dossier local et vérifier sa présence dans `public.user_projects` sous le compte attendu.
- [ ] Synchroniser à nouveau et vérifier qu’il n’y a pas de doublons.
- [ ] Se déconnecter : les cookies de session sont effacés, les dossiers locaux restent.
- [ ] Tester un compte distinct : il ne doit pas pouvoir lire les dossiers du premier compte.
- [ ] Vérifier la confirmation avant de copier les dossiers de ce navigateur vers un compte.
- [ ] Tester mobile et desktop, les erreurs de réseau et l’absence de configuration.

## Données et sécurité
- [ ] Les opérations cloud utilisent le JWT de l’utilisateur connecté et la clé publishable, jamais la clé service_role.
- [ ] Les politiques RLS limitent SELECT/INSERT/UPDATE/DELETE à `auth.uid() = user_id`.
- [ ] Aucune table n’a été supprimée, réinitialisée ou migrée.
- [ ] Aucun dossier local n’est supprimé par une synchronisation.
- [ ] Pas de fusion vers `main` et pas de promotion en production sans autorisation.
- [ ] Vérifier les paramètres de confirmation d’e-mail et le mot de passe dans Supabase Auth avant la production.

## Avertissement de sécurité Supabase relevé
L’advisor de sécurité signale que la protection contre les mots de passe compromis est désactivée. Ce paramètre n’a pas été modifié. L’activer nécessite une décision et une vérification dans les paramètres Auth du projet.


## Analyse IA — activation contrôlée

- [ ] Sans `MERKORA_AI_ENABLED=true`, l’interface indique que l’IA est en attente de configuration et aucun appel au modèle n’est envoyé.
- [ ] Configurer une limite de dépenses dans Vercel AI Gateway avant d’activer l’IA.
- [ ] Vérifier que `AI_GATEWAY_API_KEY` ou l’authentification OIDC Vercel fonctionne côté serveur; aucun secret n’est envoyé au navigateur.
- [ ] Vérifier l’identifiant de modèle et son prix actuel dans le catalogue Gateway.
- [ ] Effectuer un test live contrôlé après autorisation, puis vérifier le coût et l’usage dans le tableau de bord.
- [ ] Vérifier que l’analyse renvoie synthèse, domaine, questions, hypothèses, 2 à 5 pistes et prochaines étapes en français.
- [ ] Modifier le titre, la description et la raison d’une piste; en retirer une; appliquer les autres.
- [ ] Vérifier que seules les recommandations du dossier courant changent et qu’elles restent présentes après rechargement.
- [ ] Vérifier les réponses d’erreur pour authentification refusée, budget insuffisant, limite de requêtes et réponse JSON invalide.
- [ ] Confirmer que l’IA ne produit pas de devis officiel ni ne promet une fonctionnalité qui n’a pas été validée.


## Analyse IA, mode local et concurrence
- [ ] Vérifier la checklist complète `docs/testing/merkora-ai-checklist.md`.
- [ ] Lorsque le moteur IA est désactivé, la pré-analyse locale gratuite fonctionne sans appel à un fournisseur.
- [ ] L’utilisateur peut ajouter, modifier et retirer des pistes avant de les appliquer.
- [ ] L’analyse concurrentielle distingue les informations saisies par l’utilisateur des informations vérifiées; aucune recherche web en direct n’est prétendue.
