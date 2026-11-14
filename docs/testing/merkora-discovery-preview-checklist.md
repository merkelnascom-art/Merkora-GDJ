# Checklist de vérification — aperçu MerKora GDJ

## Contrôles automatisés

- [ ] `npm run typecheck` termine avec le code de sortie 0.
- [ ] `npm test` termine avec le code de sortie 0.
- [ ] `npm run build` termine avec le code de sortie 0.
- [ ] Les résultats CI sont consultés sur la branche de fonctionnalité ou sa pull request.
- [ ] Aucun résultat de test ou de build n’est déclaré réussi sans sortie vérifiée.

## Parcours fonctionnels

- [ ] La page d’accueil présente la promesse « Les besoins d’abord. Les solutions ensuite. ».
- [ ] Le bouton principal ouvre la description d’un besoin sans demander de compte.
- [ ] Un besoin de type Student Vision (élèves, bac, métiers, relevés, tests) propose des directions d’orientation scolaire et professionnelle, sans recommandations de gestion de boutique.
- [ ] Un besoin de commerce/équipe propose des directions liées aux ventes, stocks, caisse, rôles ou présences.
- [ ] Un besoin créatif ou numérique reçoit des pistes correspondant à ce domaine.
- [ ] Une description vague déclenche des questions plutôt qu’une recommandation présentée comme certaine.
- [ ] Un formulaire incomplet ne produit pas de dossier considéré comme analysé.
- [ ] La page détail affiche les informations comprises, les questions restantes et le statut préliminaire.
- [ ] Le résultat indique clairement que les règles sont locales et qu’aucune IA n’est connectée.
- [ ] L’utilisateur peut modifier un besoin existant.

## Conservation des dossiers

- [ ] La clé locale `merkora-gdj-projects-v1` reste inchangée.
- [ ] Des dossiers enregistrés avant cette mise à jour restent lisibles.
- [ ] La navigation entre l’accueil et l’espace de travail ne supprime pas les dossiers.
- [ ] Après actualisation, les dossiers locaux restent disponibles dans le même navigateur.
- [ ] L’interface ne prétend pas que les données locales sont synchronisées dans le cloud.

## Interface et accessibilité

- [ ] Aucun débordement horizontal à 1440 px, 1024 px, 768 px et 390 px.
- [ ] Les boutons et liens sont utilisables au clavier.
- [ ] Le focus clavier est visible.
- [ ] Les champs ont des libellés compréhensibles.
- [ ] La préférence de réduction des animations est respectée.
- [ ] Les boutons présentés comme actions effectuent bien une action.

## Isolation de production et sécurité

- [ ] Le travail reste sur `feature/merkora-rebuild-foundation`.
- [ ] Aucune donnée Supabase n’a été supprimée, réinitialisée ou migrée.
- [ ] Aucun secret privé n’a été ajouté au code client ou à Git.
- [ ] Aucun merge vers `main` ni déploiement de production n’a été réalisé sans autorisation explicite.
- [ ] Les fonctions reportées — IA réelle, sauvegarde cloud, devis officiels, paiements — sont décrites comme non disponibles.
